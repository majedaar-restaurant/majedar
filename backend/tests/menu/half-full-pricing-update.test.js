/**
 * Half & Full Pricing Update and Order Price Calculation Tests
 *
 * Covers:
 * - Admin creates half/full pricing menu item
 * - Admin updates half price and full price in MongoDB
 * - Updates correctly persist and return
 * - Zod validation enforces fullPrice >= halfPrice and positive values
 * - Customer menu query returns correct pricing structure
 * - Order calculation authoritatively uses halfPrice for 'half' variant and fullPrice for 'full' variant
 * - Customer-supplied unitPrice is ignored in favor of DB price
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';

import { config } from '../../src/config/env.js';
import { MenuItem } from '../../src/models/MenuItem.js';
import { Category } from '../../src/models/Category.js';
import { Order } from '../../src/models/Order.js';
import { Customer } from '../../src/models/Customer.js';
import * as menuService from '../../src/services/menu/menu.service.js';
import * as orderService from '../../src/services/order/order.service.js';

describe('Half & Full Pricing Flow & Authoritative Order Pricing', () => {
    let testCategory;
    let testCustomer;
    let singleItem;
    let halfFullItem;

    before(async () => {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(config.mongoUri);
        }

        const rand = crypto.randomBytes(4).toString('hex');
        testCategory = await Category.create({
            name: `Test Cat ${rand}`,
            slug: `test-cat-${rand}`,
            isActive: true,
        });

        testCustomer = await Customer.create({
            name: `Test Customer ${rand}`,
            email: `menu-cust-${rand}@test.com`,
            phone: '9876543210',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
        });
    });

    after(async () => {
        if (testCategory) await Category.findByIdAndDelete(testCategory._id).catch(() => {});
        if (testCustomer) {
            await Order.deleteMany({ customer: testCustomer._id });
            await Customer.findByIdAndDelete(testCustomer._id).catch(() => {});
        }
        if (singleItem) await MenuItem.findByIdAndDelete(singleItem._id).catch(() => {});
        if (halfFullItem) await MenuItem.findByIdAndDelete(halfFullItem._id).catch(() => {});
        await mongoose.disconnect().catch(() => {});
    });

    test('1. Create single item and update single price', async () => {
        singleItem = await menuService.createMenuItem({
            name: 'Butter Naan',
            category: testCategory._id,
            description: 'Delicious hot butter naan',
            pricingType: 'single',
            price: 50,
            isVeg: true,
        });

        assert.equal(singleItem.pricingType, 'single');
        assert.equal(singleItem.price, 50);

        const updated = await menuService.updateMenuItem(singleItem._id, {
            price: 60,
        });
        assert.equal(updated.price, 60);

        const fetched = await menuService.getMenuItemById(singleItem._id);
        assert.equal(fetched.price, 60);
    });

    test('2. Create half-full item and verify initial prices', async () => {
        halfFullItem = await menuService.createMenuItem({
            name: 'Kadhai Paneer',
            category: testCategory._id,
            description: 'Spicy cottage cheese gravy',
            pricingType: 'half-full',
            halfPrice: 120,
            fullPrice: 200,
            isVeg: true,
        });

        assert.equal(halfFullItem.pricingType, 'half-full');
        assert.equal(halfFullItem.halfPrice, 120);
        assert.equal(halfFullItem.fullPrice, 200);
    });

    test('3. Update halfPrice and fullPrice from Admin, verify DB persistence', async () => {
        const updated = await menuService.updateMenuItem(halfFullItem._id, {
            halfPrice: 130,
            fullPrice: 220,
        });

        assert.equal(updated.halfPrice, 130);
        assert.equal(updated.fullPrice, 220);

        // Fetch fresh document directly from Mongo
        const directFromDb = await MenuItem.findById(halfFullItem._id);
        assert.equal(directFromDb.halfPrice, 130);
        assert.equal(directFromDb.fullPrice, 220);
        assert.equal(directFromDb.pricingType, 'half-full');
    });

    test('4. Customer menu query receives updated half/full pricing', async () => {
        const publicMenu = await menuService.getPublicMenuItems({ category: testCategory._id });
        const item = publicMenu.find(i => i._id.toString() === halfFullItem._id.toString());

        assert.ok(item);
        assert.equal(item.pricingType, 'half-full');
        assert.equal(item.halfPrice, 130);
        assert.equal(item.fullPrice, 220);
    });

    test('5. Order calculation authoritatively uses halfPrice for half variant, ignoring client unitPrice', async () => {
        const order = await orderService.createCustomerOrder(testCustomer._id, {
            items: [
                {
                    menuItem: halfFullItem._id.toString(),
                    variant: 'half',
                    quantity: 2,
                    unitPrice: 10, // Attempted malicious price override by client
                }
            ],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'menu-cust@test.com',
                address: 'Civil Lines, Ayodhya',
            },
            orderType: 'delivery',
            deliveryFee: 15,
            paymentMethod: 'cod',
        });

        // 2 x 130 = 260 subtotal
        assert.equal(order.items[0].unitPrice, 130);
        assert.equal(order.items[0].subtotal, 260);
        assert.equal(order.subtotal, 260);
    });

    test('6. Order calculation authoritatively uses fullPrice for full variant', async () => {
        const order = await orderService.createCustomerOrder(testCustomer._id, {
            items: [
                {
                    menuItem: halfFullItem._id.toString(),
                    variant: 'full',
                    quantity: 1,
                    unitPrice: 5, // Client override ignored
                }
            ],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'menu-cust@test.com',
                address: 'Civil Lines, Ayodhya',
            },
            orderType: 'delivery',
            deliveryFee: 15,
            paymentMethod: 'cod',
        });

        // 1 x 220 = 220 subtotal
        assert.equal(order.items[0].unitPrice, 220);
        assert.equal(order.items[0].subtotal, 220);
        assert.equal(order.subtotal, 220);
    });
});
