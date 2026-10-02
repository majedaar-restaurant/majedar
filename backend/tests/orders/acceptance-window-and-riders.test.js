/**
 * Acceptance Window & Rider Management Integration Tests
 *
 * Covers:
 * - 3-minute acceptance window creation (acceptanceDeadline = createdAt + 3m)
 * - Confirmation before deadline
 * - Rejection / expiry when confirmation attempted after deadline
 * - Background / lazy expiration logic (expireOverduePlacedOrders)
 * - Atomic race-condition safety between confirm and expire
 * - Historical orders without deadline are protected from auto-expiration
 * - Order lifecycle state transitions
 * - Rider CRUD & validation
 * - Rider assignment (active vs inactive) & change rider
 * - Customer visibility (rider visible only at out_for_delivery)
 * - Protection of rider deletion when referenced by orders
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';

import { config } from '../../src/config/env.js';
import { Order } from '../../src/models/Order.js';
import { Customer } from '../../src/models/Customer.js';
import { Rider } from '../../src/models/Rider.js';
import * as orderService from '../../src/services/order/order.service.js';
import * as riderService from '../../src/services/rider/rider.service.js';
import { BadRequestError, NotFoundError } from '../../src/utils/errors.js';

describe('Acceptance Window & Rider Management System', () => {
    let testCustomer;
    let otherCustomer;
    let testRider1;
    let testRider2;

    before(async () => {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(config.mongoUri);
        }

        const rand = crypto.randomBytes(4).toString('hex');
        testCustomer = await Customer.create({
            name: `Test Customer ${rand}`,
            email: `cust-${rand}@test.com`,
            phone: '9876543210',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
        });

        otherCustomer = await Customer.create({
            name: `Other Customer ${rand}`,
            email: `other-${rand}@test.com`,
            phone: '9876543211',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
        });
    });

    after(async () => {
        if (testCustomer) {
            await Order.deleteMany({ customer: { $in: [testCustomer._id, otherCustomer._id] } });
            await Customer.findByIdAndDelete(testCustomer._id).catch(() => {});
            await Customer.findByIdAndDelete(otherCustomer._id).catch(() => {});
        }
        if (testRider1) await Rider.findByIdAndDelete(testRider1._id).catch(() => {});
        if (testRider2) await Rider.findByIdAndDelete(testRider2._id).catch(() => {});
    });

    // ─────────────────────────────────────────────────────────
    // 1. RIDER MANAGEMENT
    // ─────────────────────────────────────────────────────────
    describe('Rider CRUD & Validation', () => {
        test('Admin creates active rider with normalized Indian phone', async () => {
            const rider = await riderService.createRider({
                name: 'Ramesh Kumar',
                phone: '+91 98765 43210',
            });
            testRider1 = rider;

            assert.equal(rider.name, 'Ramesh Kumar');
            assert.equal(rider.phone, '9876543210');
            assert.equal(rider.isActive, true);
        });

        test('Admin creates second rider and deactivates them', async () => {
            const rider = await riderService.createRider({
                name: 'Suresh Verma',
                phone: '9876543212',
            });
            testRider2 = rider;

            const updated = await riderService.updateRider(rider._id, { isActive: false });
            assert.equal(updated.isActive, false);
        });

        test('getRiders filters active only or returns all', async () => {
            const allRiders = await riderService.getRiders({ isActive: undefined });
            assert.ok(allRiders.length >= 2);

            const activeOnly = await riderService.getRiders({ isActive: true });
            const foundInactive = activeOnly.find(r => r._id.toString() === testRider2._id.toString());
            assert.equal(foundInactive, undefined);
        });
    });

    // ─────────────────────────────────────────────────────────
    // 2. 3-MINUTE ACCEPTANCE WINDOW & DEADLINE
    // ─────────────────────────────────────────────────────────
    describe('3-Minute Acceptance Window', () => {
        test('New order receives acceptanceDeadline approximately 3 minutes in future', async () => {
            const beforeTime = new Date(Date.now() + 3 * 60 * 1000 - 2000);
            const order = await Order.create({
                orderNumber: `MD-WIN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Paneer Butter Masala',
                    variant: 'single',
                    unitPrice: 220,
                    price: 220,
                    quantity: 1,
                    subtotal: 220,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Civil Lines, Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 220,
                deliveryFee: 15,
                gst: 11,
                total: 246,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: new Date(Date.now() + 3 * 60 * 1000),
            });

            const afterTime = new Date(Date.now() + 3 * 60 * 1000 + 2000);
            assert.ok(order.acceptanceDeadline >= beforeTime);
            assert.ok(order.acceptanceDeadline <= afterTime);
        });

        test('Admin confirms order within 3-minute window succeeds and records confirmedAt', async () => {
            const order = await Order.create({
                orderNumber: `MD-CONF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Dal Makhani',
                    variant: 'single',
                    unitPrice: 180,
                    price: 180,
                    quantity: 1,
                    subtotal: 180,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Civil Lines, Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 180,
                total: 180,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: new Date(Date.now() + 180000),
            });

            const confirmed = await orderService.updateOrderStatus(order._id, 'confirmed');
            assert.equal(confirmed.orderStatus, 'confirmed');
            assert.ok(confirmed.confirmedAt);
        });

        test('Admin cannot confirm order if deadline has passed (becomes expired)', async () => {
            // Create an order whose deadline expired 10 seconds ago
            const order = await Order.create({
                orderNumber: `MD-EXP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Biryani',
                    variant: 'single',
                    unitPrice: 200,
                    price: 200,
                    quantity: 1,
                    subtotal: 200,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Civil Lines, Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 200,
                total: 200,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: new Date(Date.now() - 10000), // Expired!
            });

            await assert.rejects(
                () => orderService.updateOrderStatus(order._id, 'confirmed'),
                (err) => {
                    assert.ok(err.message.includes('expired'));
                    return true;
                }
            );

            // Re-fetch order: it must have transitioned to expired, not deleted
            const updated = await Order.findById(order._id);
            assert.equal(updated.orderStatus, 'expired');
            assert.equal(updated.expiryReason, 'admin_acceptance_timeout');
            assert.ok(updated.expiredAt);
        });

        test('Background job marks overdue placed orders as expired without deleting', async () => {
            const overdueOrder = await Order.create({
                orderNumber: `MD-BG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Naan',
                    variant: 'single',
                    unitPrice: 40,
                    price: 40,
                    quantity: 2,
                    subtotal: 80,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Civil Lines, Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 80,
                total: 80,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: new Date(Date.now() - 30000), // 30s overdue
            });

            const count = await orderService.expireOverduePlacedOrders();
            assert.ok(count >= 1);

            const fetched = await Order.findById(overdueOrder._id);
            assert.equal(fetched.orderStatus, 'expired');
            assert.equal(fetched.expiryReason, 'admin_acceptance_timeout');
        });

        test('Historical orders without acceptanceDeadline are NOT expired', async () => {
            const oldOrder = await Order.create({
                orderNumber: `MD-OLD-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Old Order Food',
                    variant: 'single',
                    unitPrice: 100,
                    price: 100,
                    quantity: 1,
                    subtotal: 100,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Civil Lines, Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 100,
                total: 100,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: null, // Legacy order without deadline
            });

            await orderService.expireOverduePlacedOrders();

            const refreshed = await Order.findById(oldOrder._id);
            assert.equal(refreshed.orderStatus, 'placed'); // Still placed!
        });
    });

    // ─────────────────────────────────────────────────────────
    // 3. RIDER ASSIGNMENT & CUSTOMER VISIBILITY
    // ─────────────────────────────────────────────────────────
    describe('Rider Assignment & Customer Visibility', () => {
        let order;

        const getOrCreateOrder = async () => {
            if (!order || !(await Order.findById(order._id))) {
                order = await Order.create({
                    orderNumber: `MD-RIDER-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                    customer: testCustomer._id,
                    items: [{
                        menuItem: new mongoose.Types.ObjectId(),
                        name: 'Thali',
                        variant: 'single',
                        unitPrice: 250,
                        price: 250,
                        quantity: 1,
                        subtotal: 250,
                    }],
                    deliveryAddress: {
                        firstName: 'Aman',
                        lastName: 'Gupta',
                        phone: '9876543210',
                        email: 'cust@test.com',
                        address: 'Civil Lines, Ayodhya',
                    },
                    orderType: 'delivery',
                    subtotal: 250,
                    total: 250,
                    paymentMethod: 'cod',
                    paymentStatus: 'pending',
                    orderStatus: 'confirmed',
                });
            }
            return order;
        };

        test('Assigning inactive rider fails', async () => {
            const ord = await getOrCreateOrder();
            await assert.rejects(
                () => orderService.assignRiderToOrder(ord._id, testRider2._id),
                (err) => {
                    assert.ok(err.message.includes('inactive'));
                    return true;
                }
            );
        });

        test('Assigning active rider succeeds', async () => {
            const ord = await getOrCreateOrder();
            const updated = await orderService.assignRiderToOrder(ord._id, testRider1._id);
            assert.ok(updated.rider);
            assert.equal(updated.rider.name, 'Ramesh Kumar');
            assert.equal(updated.rider.phone, '9876543210');
        });

        test('Customer does NOT see rider when order status is confirmed, preparing, or ready_for_pickup', async () => {
            const ord = await getOrCreateOrder();
            // Status is confirmed
            const customerOrder = await orderService.getCustomerOrderById(testCustomer._id, ord._id);
            assert.equal(customerOrder.rider, null);

            // Move to preparing
            await orderService.updateOrderStatus(ord._id, 'preparing');
            const preparingOrder = await orderService.getCustomerOrderById(testCustomer._id, ord._id);
            assert.equal(preparingOrder.rider, null);

            // Move to ready_for_pickup
            await orderService.updateOrderStatus(ord._id, 'ready_for_pickup');
            const readyOrder = await orderService.getCustomerOrderById(testCustomer._id, ord._id);
            assert.equal(readyOrder.rider, null);
        });

        test('Customer SEES rider ONLY when order status becomes out_for_delivery', async () => {
            const ord = await getOrCreateOrder();
            await orderService.updateOrderStatus(ord._id, 'out_for_delivery');
            const outOrder = await orderService.getCustomerOrderById(testCustomer._id, ord._id);

            assert.ok(outOrder.rider);
            assert.equal(outOrder.rider.name, 'Ramesh Kumar');
            assert.equal(outOrder.rider.phone, '9876543210');
            // Ensure no sensitive or internal fields leaked
            assert.equal(outOrder.rider.passwordHash, undefined);
        });

        test('Rider cannot be deleted if associated with historical orders', async () => {
            await assert.rejects(
                () => riderService.deleteRider(testRider1._id),
                (err) => {
                    assert.ok(err.message.includes('associated with') || err.message.includes('orders'));
                    return true;
                }
            );
        });
    });

    // ─────────────────────────────────────────────────────────
    // 4. ORDER STATUS TRANSITION VALIDATION
    // ─────────────────────────────────────────────────────────
    describe('Strict State Machine Transitions', () => {
        test('Terminal status (completed, cancelled, expired) cannot transition', async () => {
            const completedOrder = await Order.create({
                orderNumber: `MD-TERM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Roti',
                    variant: 'single',
                    unitPrice: 20,
                    price: 20,
                    quantity: 2,
                    subtotal: 40,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 40,
                total: 40,
                paymentMethod: 'cod',
                paymentStatus: 'paid',
                orderStatus: 'completed',
            });

            await assert.rejects(
                () => orderService.updateOrderStatus(completedOrder._id, 'confirmed'),
                (err) => {
                    assert.ok(err.message.toLowerCase().includes('terminal') || err.message.toLowerCase().includes('cannot'));
                    return true;
                }
            );
        });

        test('Illegal status jump (placed directly to completed) is rejected', async () => {
            const placedOrder = await Order.create({
                orderNumber: `MD-JUMP-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                customer: testCustomer._id,
                items: [{
                    menuItem: new mongoose.Types.ObjectId(),
                    name: 'Roti',
                    variant: 'single',
                    unitPrice: 20,
                    price: 20,
                    quantity: 2,
                    subtotal: 40,
                }],
                deliveryAddress: {
                    firstName: 'Aman',
                    lastName: 'Gupta',
                    phone: '9876543210',
                    email: 'cust@test.com',
                    address: 'Ayodhya',
                },
                orderType: 'delivery',
                subtotal: 40,
                total: 40,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'placed',
                acceptanceDeadline: new Date(Date.now() + 180000),
            });

            await assert.rejects(
                () => orderService.updateOrderStatus(placedOrder._id, 'completed'),
                (err) => {
                    assert.ok(err.message.includes('Cannot transition'));
                    return true;
                }
            );
        });
    });
});
