import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

import { Order } from '../../src/models/Order.js';
import { Customer } from '../../src/models/Customer.js';
import { MenuItem } from '../../src/models/MenuItem.js';
import { Category } from '../../src/models/Category.js';
import {
    isOnlinePaymentEnabled,
    setOnlinePaymentEnabled,
    setRestaurantOpen,
} from '../../src/config/restaurant.config.js';
import * as paymentService from '../../src/services/payments/payment-verification.service.js';
import * as orderService from '../../src/services/order/order.service.js';

describe('Online Payment Feature Flag Test Suite', () => {
    let customer;
    let category;
    let menuItem;
    let initialFlagState;

    before(async () => {
        initialFlagState = isOnlinePaymentEnabled();
        setRestaurantOpen(true);

        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/majedar_test');
        }

        customer = await Customer.create({
            name: `Flag Tester ${Date.now()}`,
            email: `flagtester-${Date.now()}@test.com`,
            phone: '9876543210',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
        });

        category = await Category.create({
            name: `Flag Category ${Date.now()}`,
            isActive: true,
        });

        menuItem = await MenuItem.create({
            name: `Flag Item ${Date.now()}`,
            description: 'Delicious item for testing payment flag',
            category: category._id,
            price: 250,
            isAvailable: true,
        });
    });

    after(async () => {
        setOnlinePaymentEnabled(initialFlagState);
        if (customer) await Customer.findByIdAndDelete(customer._id);
        if (category) await Category.findByIdAndDelete(category._id);
        if (menuItem) await MenuItem.findByIdAndDelete(menuItem._id);
        await Order.deleteMany({ customer: customer?._id });
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

    test('when online payment is disabled, createOrder rejects razorpay paymentMethod with friendly message', async () => {
        setOnlinePaymentEnabled(false);
        assert.equal(isOnlinePaymentEnabled(), false);

        const orderData = {
            items: [{ menuItem: menuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Ayodhya Street 1',
            },
            paymentMethod: 'razorpay',
        };

        await assert.rejects(
            () => orderService.createOrder(customer._id, orderData),
            (err) => {
                assert.ok(
                    err.message.includes('Online payment is currently unavailable') &&
                    err.message.includes('Cash on Delivery')
                );
                return true;
            }
        );
    });

    test('when online payment is disabled, COD order creates successfully with pending paymentStatus', async () => {
        setOnlinePaymentEnabled(false);

        const orderData = {
            items: [{ menuItem: menuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Ayodhya Street 1',
            },
            paymentMethod: 'cod',
        };

        const order = await orderService.createOrder(customer._id, orderData);
        assert.ok(order._id);
        assert.equal(order.paymentMethod, 'cod');
        assert.equal(order.paymentStatus, 'pending');
        assert.equal(order.orderStatus, 'placed');
        assert.ok(order.acceptanceDeadline);
    });

    test('when online payment is disabled, initiatePayment rejects with friendly message without modifying order', async () => {
        setOnlinePaymentEnabled(false);

        const order = await Order.create({
            orderNumber: `ORD-FLAG-${Date.now()}`,
            customer: customer._id,
            items: [
                {
                    menuItem: menuItem._id,
                    name: menuItem.name,
                    variant: 'single',
                    unitPrice: 250,
                    price: 250,
                    quantity: 1,
                    subtotal: 250,
                },
            ],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Ayodhya',
            },
            subtotal: 250,
            deliveryFee: 15,
            total: 265,
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            orderStatus: 'placed',
        });

        await assert.rejects(
            () => paymentService.initiatePayment(customer._id, order._id),
            (err) => {
                assert.ok(
                    err.message.includes('Online payment is currently unavailable') &&
                    err.message.includes('Cash on Delivery')
                );
                return true;
            }
        );

        // Order remains unchanged
        const fresh = await Order.findById(order._id);
        assert.equal(fresh.paymentMethod, 'cod');
        assert.equal(fresh.paymentStatus, 'pending');
    });

    test('when online payment is disabled, retryPayment rejects with friendly message', async () => {
        setOnlinePaymentEnabled(false);

        const order = await Order.create({
            orderNumber: `ORD-RETRY-${Date.now()}`,
            customer: customer._id,
            items: [
                {
                    menuItem: menuItem._id,
                    name: menuItem.name,
                    variant: 'single',
                    unitPrice: 250,
                    price: 250,
                    quantity: 1,
                    subtotal: 250,
                },
            ],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Ayodhya',
            },
            subtotal: 250,
            deliveryFee: 15,
            total: 265,
            paymentMethod: 'razorpay',
            paymentStatus: 'pending',
            orderStatus: 'placed',
        });

        await assert.rejects(
            () => paymentService.retryPayment(customer._id, order._id),
            (err) => {
                assert.ok(
                    err.message.includes('Online payment is currently unavailable') &&
                    err.message.includes('Cash on Delivery')
                );
                return true;
            }
        );
    });

    test('when online payment is re-enabled, online order placement succeeds without rewriting system', async () => {
        setOnlinePaymentEnabled(true);
        assert.equal(isOnlinePaymentEnabled(), true);

        const orderData = {
            items: [{ menuItem: menuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Ayodhya Street 1',
            },
            paymentMethod: 'razorpay',
        };

        const order = await orderService.createOrder(customer._id, orderData);
        assert.ok(order._id);
        assert.equal(order.paymentMethod, 'razorpay');
        assert.equal(order.paymentStatus, 'pending');
    });
});
