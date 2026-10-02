import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { io as Client } from 'socket.io-client';

import app from '../../src/app.js';
import { config } from '../../src/config/env.js';
import { Admin } from '../../src/models/Admin.js';
import { Customer } from '../../src/models/Customer.js';
import { MenuItem } from '../../src/models/MenuItem.js';
import { Category } from '../../src/models/Category.js';
import { Order } from '../../src/models/Order.js';
import { Rider } from '../../src/models/Rider.js';
import { initSocketServer, getIO } from '../../src/socket/socket.server.js';
import { signToken } from '../../src/utils/token.js';
import * as orderService from '../../src/services/order/order.service.js';

describe('Real-Time Order System (Socket.IO + Web Push Architecture)', () => {
    let server;
    let baseUrl;
    let adminUser;
    let adminToken;
    let customer1;
    let customer1Token;
    let customer2;
    let customer2Token;
    let testCategory;
    let testMenuItem;
    let testRider;

    before(async () => {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(config.mongoUri);
        }

        // Initialize HTTP server with Socket.IO
        server = http.createServer(app);
        initSocketServer(server);

        await new Promise((resolve) => server.listen(0, resolve));
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;

        const rand = crypto.randomBytes(4).toString('hex');

        // Create Admin
        adminUser = await Admin.create({
            name: `Admin ${rand}`,
            email: `admin-${rand}@majedaar.test`,
            passwordHash: '$2a$10$testhash',
            role: 'admin',
        });
        adminToken = signToken({ id: adminUser._id, role: adminUser.role });

        // Create Customer 1
        customer1 = await Customer.create({
            name: `Customer One ${rand}`,
            email: `cust1-${rand}@majedaar.test`,
            phone: '9876543210',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
            tokenVersion: 1,
        });
        customer1Token = signToken({ id: customer1._id, type: 'customer', tokenVersion: 1 });

        // Create Customer 2
        customer2 = await Customer.create({
            name: `Customer Two ${rand}`,
            email: `cust2-${rand}@majedaar.test`,
            phone: '9876543211',
            passwordHash: '$2a$10$testhash',
            emailVerified: true,
            tokenVersion: 1,
        });
        customer2Token = signToken({ id: customer2._id, type: 'customer', tokenVersion: 1 });

        // Create Category & Menu item for placing orders
        testCategory = await Category.create({
            name: `Test Cat ${rand}`,
            slug: `test-cat-${rand}`,
            description: 'Test description',
        });

        testMenuItem = await MenuItem.create({
            name: `Biryani ${rand}`,
            description: 'Authentic royal dum biryani',
            category: testCategory._id,
            price: 250,
            pricingType: 'single',
            isAvailable: true,
            isVeg: false,
        });

        testRider = await Rider.create({
            name: `Rider ${rand}`,
            phone: '9876543222',
            isActive: true,
        });
    });

    after(async () => {
        const io = getIO();
        if (io) {
            io.disconnectSockets(true);
        }
        if (server) {
            server.closeAllConnections?.();
            await new Promise((res) => server.close(res));
        }
        if (adminUser) await Admin.findByIdAndDelete(adminUser._id).catch(() => {});
        if (customer1) {
            await Order.deleteMany({ customer: { $in: [customer1._id, customer2._id] } }).catch(() => {});
            await Customer.findByIdAndDelete(customer1._id).catch(() => {});
        }
        if (customer2) await Customer.findByIdAndDelete(customer2._id).catch(() => {});
        if (testMenuItem) await MenuItem.findByIdAndDelete(testMenuItem._id).catch(() => {});
        if (testCategory) await Category.findByIdAndDelete(testCategory._id).catch(() => {});
        if (testRider) await Rider.findByIdAndDelete(testRider._id).catch(() => {});
    });

    // ─────────────────────────────────────────────────────────────
    // 1. Socket Authentication & Security
    // ─────────────────────────────────────────────────────────────
    test('Anonymous connection is rejected during handshake', async () => {
        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                reconnection: false,
            });

            socket.on('connect', () => {
                socket.disconnect();
                assert.fail('Should not connect anonymously');
            });

            socket.on('connect_error', (err) => {
                assert.ok(err);
                assert.match(err.message, /Authentication required/i);
                socket.close();
                resolve();
            });
        });
    });

    test('Admin connects and is authenticated via admin cookie token', async () => {
        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                extraHeaders: {
                    Cookie: `${config.cookie.name}=${adminToken}`,
                },
                reconnection: false,
            });

            socket.on('connect', () => {
                assert.ok(socket.connected);
                socket.disconnect();
                resolve();
            });

            socket.on('connect_error', (err) => {
                assert.fail(`Connection should succeed: ${err.message}`);
            });
        });
    });

    test('Customer connects and is authenticated via customer cookie token', async () => {
        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                extraHeaders: {
                    Cookie: `${config.customerCookie.name}=${customer1Token}`,
                },
                reconnection: false,
            });

            socket.on('connect', () => {
                assert.ok(socket.connected);
                socket.disconnect();
                resolve();
            });

            socket.on('connect_error', (err) => {
                assert.fail(`Connection should succeed: ${err.message}`);
            });
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 2. Room Authorization & Multi-tenant Separation
    // ─────────────────────────────────────────────────────────────
    test('Customer cannot join admin:orders room', async () => {
        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                extraHeaders: {
                    Cookie: `${config.customerCookie.name}=${customer1Token}`,
                },
                reconnection: false,
            });

            socket.on('connect', () => {
                socket.emit('join:admin', (res) => {
                    assert.equal(res.success, false);
                    assert.equal(res.error, 'Unauthorized');
                    socket.disconnect();
                    resolve();
                });
            });
        });
    });

    test('Customer CANNOT join another customer’s order room', async () => {
        // Create an order belonging to customer2
        const orderOfCust2 = await orderService.createOrder(customer2._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Cust2',
                lastName: 'User',
                phone: '9876543211',
                email: customer2.email,
                address: '123 River Road',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        // Customer1 connects and tries to join Customer2's order room
        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                extraHeaders: {
                    Cookie: `${config.customerCookie.name}=${customer1Token}`,
                },
                reconnection: false,
            });

            socket.on('connect', () => {
                socket.emit('join:order', { orderId: orderOfCust2._id.toString() }, (res) => {
                    assert.equal(res.success, false);
                    assert.match(res.error, /Forbidden/i);
                    socket.disconnect();
                    resolve();
                });
            });
        });
    });

    test('Customer CAN join their own order room', async () => {
        // Create an order belonging to customer1
        const orderOfCust1 = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Cust1',
                lastName: 'User',
                phone: '9876543210',
                email: customer1.email,
                address: '456 Temple Road',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        await new Promise((resolve) => {
            const socket = Client(baseUrl, {
                transports: ['websocket'],
                extraHeaders: {
                    Cookie: `${config.customerCookie.name}=${customer1Token}`,
                },
                reconnection: false,
            });

            socket.on('connect', () => {
                socket.emit('join:order', { orderId: orderOfCust1._id.toString() }, (res) => {
                    assert.equal(res.success, true);
                    assert.equal(res.room, `order:${orderOfCust1._id}`);
                    socket.disconnect();
                    resolve();
                });
            });
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 3. Real-Time Order Flow & Countdown Acceptance
    // ─────────────────────────────────────────────────────────────
    test('Placing an order emits order:new to admin:orders with acceptanceDeadline', async () => {
        const adminSocket = Client(baseUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Cookie: `${config.cookie.name}=${adminToken}`,
            },
            reconnection: false,
        });

        await new Promise((resolve) => adminSocket.on('connect', resolve));

        const newOrderPromise = new Promise((resolve) => {
            adminSocket.on('order:new', (payload) => {
                resolve(payload);
            });
        });

        const createdOrder = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Rohan',
                lastName: 'Verma',
                phone: '9876543210',
                email: customer1.email,
                address: '789 Garden Colony',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        const eventPayload = await newOrderPromise;
        assert.equal(eventPayload.orderId, createdOrder._id.toString());
        assert.equal(eventPayload.orderNumber, createdOrder.orderNumber);
        assert.equal(eventPayload.orderStatus, 'placed');
        assert.ok(eventPayload.acceptanceDeadline);

        // Verify acceptanceDeadline is approximately 3 minutes in future
        const deadlineMs = new Date(eventPayload.acceptanceDeadline).getTime();
        const nowMs = Date.now();
        const diffSeconds = Math.round((deadlineMs - nowMs) / 1000);
        assert.ok(diffSeconds >= 170 && diffSeconds <= 185, `Deadline should be ~180s away, got ${diffSeconds}s`);

        adminSocket.disconnect();
    });

    test('Admin confirmation emits order:confirmed to customer order room immediately', async () => {
        const createdOrder = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Rohan',
                lastName: 'Verma',
                phone: '9876543210',
                email: customer1.email,
                address: '789 Garden Colony',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        const customerSocket = Client(baseUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Cookie: `${config.customerCookie.name}=${customer1Token}`,
            },
            reconnection: false,
        });

        await new Promise((resolve) => customerSocket.on('connect', resolve));

        // Join customer order room
        await new Promise((resolve) => {
            customerSocket.emit('join:order', { orderId: createdOrder._id.toString() }, resolve);
        });

        const confirmedPromise = new Promise((resolve) => {
            customerSocket.on('order:confirmed', (payload) => {
                resolve(payload);
            });
        });

        // Admin confirms order
        const confirmedOrder = await orderService.updateOrderStatus(createdOrder._id.toString(), {
            orderStatus: 'confirmed',
        });
        assert.equal(confirmedOrder.orderStatus, 'confirmed');

        const payload = await confirmedPromise;
        assert.equal(payload.orderId, createdOrder._id.toString());
        assert.equal(payload.orderStatus, 'confirmed');
        assert.ok(payload.confirmedAt);

        customerSocket.disconnect();
    });

    test('Order status progression emits order:status_changed', async () => {
        const createdOrder = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Rohan',
                lastName: 'Verma',
                phone: '9876543210',
                email: customer1.email,
                address: '789 Garden Colony',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'confirmed' });

        const customerSocket = Client(baseUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Cookie: `${config.customerCookie.name}=${customer1Token}`,
            },
            reconnection: false,
        });

        await new Promise((resolve) => customerSocket.on('connect', resolve));

        await new Promise((resolve) => {
            customerSocket.emit('join:order', { orderId: createdOrder._id.toString() }, resolve);
        });

        const statusChangedPromise = new Promise((resolve) => {
            customerSocket.on('order:status_changed', (payload) => {
                resolve(payload);
            });
        });

        // Admin updates status to 'preparing'
        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'preparing' });

        const payload = await statusChangedPromise;
        assert.equal(payload.orderId, createdOrder._id.toString());
        assert.equal(payload.orderStatus, 'preparing');

        customerSocket.disconnect();
    });

    test('Rider assignment and customer visibility at out_for_delivery', async () => {
        const createdOrder = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Rohan',
                lastName: 'Verma',
                phone: '9876543210',
                email: customer1.email,
                address: '789 Garden Colony',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'confirmed' });
        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'preparing' });
        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'ready_for_pickup' });

        const customerSocket = Client(baseUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Cookie: `${config.customerCookie.name}=${customer1Token}`,
            },
            reconnection: false,
        });

        await new Promise((resolve) => customerSocket.on('connect', resolve));
        await new Promise((resolve) => {
            customerSocket.emit('join:order', { orderId: createdOrder._id.toString() }, resolve);
        });

        // 1. Assign rider while in ready_for_pickup -> customer receives rider:assigned event with rider=null (not visible yet)
        const riderAssignedPromise = new Promise((resolve) => {
            customerSocket.on('rider:assigned', (payload) => {
                resolve(payload);
            });
        });

        await orderService.assignRiderToOrder(createdOrder._id.toString(), testRider._id.toString());
        const riderPayload = await riderAssignedPromise;
        assert.equal(riderPayload.orderId, createdOrder._id.toString());
        assert.equal(riderPayload.rider, null); // Protected: customer cannot see rider details before out_for_delivery

        // 2. Transition to out_for_delivery -> customer receives order:status_changed with rider details
        const outForDeliveryPromise = new Promise((resolve) => {
            customerSocket.on('order:status_changed', (payload) => {
                resolve(payload);
            });
        });

        await orderService.updateOrderStatus(createdOrder._id.toString(), { orderStatus: 'out_for_delivery' });
        const deliveryPayload = await outForDeliveryPromise;
        assert.equal(deliveryPayload.orderStatus, 'out_for_delivery');
        assert.ok(deliveryPayload.rider);
        assert.equal(deliveryPayload.rider.name, testRider.name);
        assert.equal(deliveryPayload.rider.phone, testRider.phone);

        customerSocket.disconnect();
    });

    test('Order expiration emits order:expired when 3-minute window lapses', async () => {
        const createdOrder = await orderService.createOrder(customer1._id, {
            items: [{ menuItem: testMenuItem._id.toString(), quantity: 1, variant: 'single' }],
            deliveryAddress: {
                firstName: 'Rohan',
                lastName: 'Verma',
                phone: '9876543210',
                email: customer1.email,
                address: '789 Garden Colony',
                deliveryInstructions: 'Call on arrival',
            },
            orderType: 'delivery',
            paymentMethod: 'cod',
        });

        const customerSocket = Client(baseUrl, {
            transports: ['websocket'],
            extraHeaders: {
                Cookie: `${config.customerCookie.name}=${customer1Token}`,
            },
            reconnection: false,
        });

        await new Promise((resolve) => customerSocket.on('connect', resolve));
        await new Promise((resolve) => {
            customerSocket.emit('join:order', { orderId: createdOrder._id.toString() }, resolve);
        });

        const expiredPromise = new Promise((resolve) => {
            customerSocket.on('order:expired', (payload) => {
                resolve(payload);
            });
        });

        // Artificially age deadline to 1 second in the past
        await Order.updateOne(
            { _id: createdOrder._id },
            { $set: { acceptanceDeadline: new Date(Date.now() - 1000) } }
        );

        // Run background expiration check
        await orderService.expireOverduePlacedOrders();

        const expiredPayload = await expiredPromise;
        assert.equal(expiredPayload.orderId, createdOrder._id.toString());
        assert.equal(expiredPayload.orderStatus, 'expired');
        assert.equal(expiredPayload.expiryReason, 'admin_acceptance_timeout');

        customerSocket.disconnect();
    });
});
