import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { verifyToken } from '../utils/token.js';
import { Admin } from '../models/Admin.js';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';
import { logger } from '../utils/logger.js';

let ioInstance = null;

/**
 * Parse raw Cookie header string into key-value map.
 * @param {string|undefined} cookieHeader
 * @returns {Record<string, string>}
 */
export function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader || typeof cookieHeader !== 'string') return list;

    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
        const idx = pair.indexOf('=');
        if (idx === -1) continue;
        const key = pair.slice(0, idx).trim();
        const rawVal = pair.slice(idx + 1).trim();
        if (!key) continue;
        try {
            list[key] = decodeURIComponent(rawVal);
        } catch {
            list[key] = rawVal;
        }
    }
    return list;
}

/**
 * Socket.IO authentication middleware.
 * Verifies JWT from HttpOnly cookie or auth token and securely binds user identity to the socket.
 * Rejects unauthenticated connections.
 */
export async function socketAuthMiddleware(socket, next) {
    try {
        const cookieHeader = socket.handshake?.headers?.cookie || '';
        const cookies = parseCookies(cookieHeader);

        const adminCookieToken = cookies[config.cookie.name];
        const customerCookieToken = cookies[config.customerCookie.name];

        // Also allow auth token or Authorization header fallback (useful for mobile or cross-origin dev)
        const headerAuth = socket.handshake?.headers?.authorization;
        const bearerToken = headerAuth?.startsWith('Bearer ') ? headerAuth.slice(7).trim() : null;
        const explicitToken = socket.handshake?.auth?.token || bearerToken;

        // 1. Try Admin authentication (prefer admin cookie or explicit token)
        const potentialAdminToken = adminCookieToken || explicitToken;
        if (potentialAdminToken) {
            try {
                const decoded = verifyToken(potentialAdminToken);
                if (decoded && decoded.id && decoded.type !== 'customer') {
                    const admin = await Admin.findById(decoded.id).select('_id name role email');
                    if (admin) {
                        socket.user = {
                            id: admin._id.toString(),
                            type: 'admin',
                            role: admin.role,
                            name: admin.name,
                            email: admin.email,
                        };
                        return next();
                    }
                }
            } catch (err) {
                // If expired or invalid, ignore and try customer auth
                logger.debug('[REALTIME] Admin token verification error:', err.message);
            }
        }

        // 2. Try Customer authentication
        const potentialCustomerToken = customerCookieToken || explicitToken;
        if (potentialCustomerToken) {
            try {
                const decoded = verifyToken(potentialCustomerToken);
                if (decoded && decoded.id && decoded.type === 'customer') {
                    const customer = await Customer.findById(decoded.id).select(
                        '_id name email phone tokenVersion emailVerified'
                    );

                    if (
                        customer &&
                        (decoded.tokenVersion === undefined ||
                            customer.tokenVersion === undefined ||
                            decoded.tokenVersion === customer.tokenVersion) &&
                        customer.emailVerified !== false
                    ) {
                        socket.user = {
                            id: customer._id.toString(),
                            type: 'customer',
                            name: customer.name,
                            email: customer.email,
                            phone: customer.phone,
                        };
                        return next();
                    }
                }
            } catch (err) {
                logger.debug('[REALTIME] Customer token verification error:', err.message);
            }
        }

        // Neither admin nor customer could be authenticated
        return next(new Error('Authentication required. Invalid or missing session.'));
    } catch (error) {
        logger.error('[REALTIME] Authentication middleware error:', error.message);
        return next(new Error('Internal authentication error during socket handshake.'));
    }
}

/**
 * Initialize Socket.IO server on top of HTTP server.
 * @param {import('node:http').Server} httpServer
 * @returns {Server}
 */
export function initSocketServer(httpServer) {
    if (ioInstance) {
        return ioInstance;
    }

    const io = new Server(httpServer, {
        cors: {
            origin: config.cors.origin,
            credentials: true,
        },
        cookie: true,
        pingTimeout: 20000,
        pingInterval: 25000,
        transports: ['websocket', 'polling'],
    });

    // Authenticate every incoming socket connection
    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        const user = socket.user;
        if (!user) {
            socket.disconnect(true);
            return;
        }

        if (user.type === 'admin') {
            logger.info(`[REALTIME] Admin connected: ${user.name} (${user.id})`);
            // Admin automatically joins the admin:orders room
            socket.join('admin:orders');
        } else {
            logger.info(`[REALTIME] Customer connected: ${user.name} (${user.id})`);
        }

        // Join customer order room: strictly validates that customer owns this order
        socket.on('join:order', async (data, callback) => {
            try {
                const orderId = typeof data === 'string' ? data : data?.orderId;
                if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
                    if (typeof callback === 'function') {
                        callback({ success: false, error: 'Invalid order ID format' });
                    }
                    return;
                }

                // If admin, allow joining any order room
                if (socket.user.type === 'admin') {
                    socket.join(`order:${orderId}`);
                    logger.debug(`[REALTIME] Admin ${socket.user.id} joined room order:${orderId}`);
                    if (typeof callback === 'function') {
                        callback({ success: true, room: `order:${orderId}` });
                    }
                    return;
                }

                // If customer, authoritatively verify order ownership
                const order = await Order.findById(orderId).select('customer');
                if (!order) {
                    if (typeof callback === 'function') {
                        callback({ success: false, error: 'Order not found' });
                    }
                    return;
                }

                if (order.customer.toString() !== socket.user.id.toString()) {
                    logger.warn(
                        `[REALTIME] Unauthorized room join attempt by customer ${socket.user.id} for order ${orderId}`
                    );
                    if (typeof callback === 'function') {
                        callback({
                            success: false,
                            error: 'Forbidden: You do not have permission to access this order room',
                        });
                    }
                    return;
                }

                socket.join(`order:${orderId}`);
                logger.info(`[REALTIME] Customer ${socket.user.id} joined room order:${orderId}`);
                if (typeof callback === 'function') {
                    callback({ success: true, room: `order:${orderId}` });
                }
            } catch (err) {
                logger.error('[REALTIME] Error in join:order handler:', err.message);
                if (typeof callback === 'function') {
                    callback({ success: false, error: 'Failed to join order room' });
                }
            }
        });

        // Leave customer order room
        socket.on('leave:order', (data, callback) => {
            const orderId = typeof data === 'string' ? data : data?.orderId;
            if (orderId) {
                socket.leave(`order:${orderId}`);
                logger.debug(`[REALTIME] Socket ${socket.id} left room order:${orderId}`);
            }
            if (typeof callback === 'function') {
                callback({ success: true });
            }
        });

        // Explicit join admin room (only for admin sockets)
        socket.on('join:admin', (callback) => {
            if (socket.user?.type === 'admin') {
                socket.join('admin:orders');
                if (typeof callback === 'function') callback({ success: true });
            } else {
                if (typeof callback === 'function') callback({ success: false, error: 'Unauthorized' });
            }
        });

        socket.on('disconnect', (reason) => {
            logger.debug(`[REALTIME] Socket disconnected: ${socket.id} (User: ${user.type}/${user.id}, Reason: ${reason})`);
        });
    });

    ioInstance = io;
    return io;
}

/**
 * Get the current Socket.IO server instance.
 * @returns {Server|null}
 */
export function getIO() {
    return ioInstance;
}

// ─────────────────────────────────────────────────────────────
// Real-Time Event Emitters (Non-blocking & Safe)
// ─────────────────────────────────────────────────────────────

/**
 * Emit new order notification to all connected admins.
 * Emits both 'order:new' and 'new_order' for full compatibility.
 * @param {Object} order
 */
export function emitNewOrder(order) {
    if (!ioInstance || !order) return;
    try {
        const payload = {
            orderId: order._id ? order._id.toString() : order.id,
            orderNumber: order.orderNumber,
            customerName:
                order.deliveryAddress?.firstName
                    ? `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName || ''}`.trim()
                    : 'Customer',
            total: order.total,
            orderStatus: order.orderStatus || 'placed',
            acceptanceDeadline: order.acceptanceDeadline,
            createdAt: order.createdAt || new Date(),
            itemsCount: Array.isArray(order.items) ? order.items.length : 0,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
        };

        ioInstance.to('admin:orders').emit('order:new', payload);
        ioInstance.to('admin:orders').emit('new_order', payload);
        logger.info(`[REALTIME] order:new emitted for Order #${order.orderNumber} to admin:orders`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit order:new:', err.message);
    }
}

/**
 * Emit order confirmation event to customer order room and admin channel.
 * @param {Object} order
 */
export function emitOrderConfirmed(order) {
    if (!ioInstance || !order) return;
    try {
        const orderId = order._id ? order._id.toString() : order.id;
        const payload = {
            orderId,
            orderNumber: order.orderNumber,
            orderStatus: 'confirmed',
            confirmedAt: order.confirmedAt || new Date(),
        };

        ioInstance.to(`order:${orderId}`).emit('order:confirmed', payload);
        ioInstance.to('admin:orders').emit('order:confirmed', payload);
        logger.info(`[REALTIME] order:confirmed emitted for Order #${order.orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit order:confirmed:', err.message);
    }
}

/**
 * Emit order status change event to customer order room and admin channel.
 * Strips rider details unless order is 'out_for_delivery' or 'completed'.
 * @param {Object} order
 */
export function emitOrderStatusChanged(order) {
    if (!ioInstance || !order) return;
    try {
        const orderId = order._id ? order._id.toString() : order.id;
        const isRiderVisible =
            (order.orderStatus === 'out_for_delivery' || order.orderStatus === 'completed') && order.rider;

        const payload = {
            orderId,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            updatedAt: order.updatedAt || new Date(),
            rider: isRiderVisible
                ? {
                      _id: order.rider._id ? order.rider._id.toString() : order.rider,
                      name: order.rider.name,
                      phone: order.rider.phone,
                  }
                : null,
        };

        ioInstance.to(`order:${orderId}`).emit('order:status_changed', payload);
        ioInstance.to('admin:orders').emit('order:status_changed', payload);
        logger.info(`[REALTIME] order:status_changed (${order.orderStatus}) emitted for Order #${order.orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit order:status_changed:', err.message);
    }
}

/**
 * Emit order expired event to customer order room and admin channel.
 * @param {Object} order
 */
export function emitOrderExpired(order) {
    if (!ioInstance || !order) return;
    try {
        const orderId = order._id ? order._id.toString() : order.id;
        const payload = {
            orderId,
            orderNumber: order.orderNumber,
            orderStatus: 'expired',
            expiredAt: order.expiredAt || new Date(),
            expiryReason: order.expiryReason || 'admin_acceptance_timeout',
        };

        ioInstance.to(`order:${orderId}`).emit('order:expired', payload);
        ioInstance.to('admin:orders').emit('order:expired', payload);
        logger.info(`[REALTIME] order:expired emitted for Order #${order.orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit order:expired:', err.message);
    }
}

/**
 * Emit order cancelled event to customer order room and admin channel.
 * @param {Object} order
 */
export function emitOrderCancelled(order) {
    if (!ioInstance || !order) return;
    try {
        const orderId = order._id ? order._id.toString() : order.id;
        const payload = {
            orderId,
            orderNumber: order.orderNumber,
            orderStatus: 'cancelled',
            cancelledAt: order.updatedAt || new Date(),
        };

        ioInstance.to(`order:${orderId}`).emit('order:cancelled', payload);
        ioInstance.to('admin:orders').emit('order:cancelled', payload);
        // Also emit order:status_changed for universal compatibility
        ioInstance.to(`order:${orderId}`).emit('order:status_changed', payload);
        ioInstance.to('admin:orders').emit('order:status_changed', payload);
        logger.info(`[REALTIME] order:cancelled emitted for Order #${order.orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit order:cancelled:', err.message);
    }
}

/**
 * Emit rider assigned event.
 * Note: Customer UI only reveals rider details if status is out_for_delivery.
 * @param {Object} order
 */
export function emitRiderAssigned(order) {
    if (!ioInstance || !order) return;
    try {
        const orderId = order._id ? order._id.toString() : order.id;
        const isRiderVisible =
            (order.orderStatus === 'out_for_delivery' || order.orderStatus === 'completed') && order.rider;

        const payload = {
            orderId,
            orderNumber: order.orderNumber,
            riderAssigned: !!order.rider,
            rider: isRiderVisible
                ? {
                      _id: order.rider._id ? order.rider._id.toString() : order.rider,
                      name: order.rider.name,
                      phone: order.rider.phone,
                  }
                : null,
        };

        ioInstance.to(`order:${orderId}`).emit('rider:assigned', payload);
        ioInstance.to('admin:orders').emit('rider:assigned', payload);
        logger.info(`[REALTIME] rider:assigned emitted for Order #${order.orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit rider:assigned:', err.message);
    }
}

/**
 * Emit online payment verified event to admin and order room.
 * @param {Object} params
 */
export function emitPaymentSuccess({ orderId, orderNumber, amount }) {
    if (!ioInstance || !orderId) return;
    try {
        const payload = {
            orderId: orderId.toString(),
            orderNumber,
            paymentStatus: 'paid',
            amount,
        };

        ioInstance.to(`order:${orderId}`).emit('payment:success', payload);
        ioInstance.to('admin:orders').emit('payment:success', payload);
        logger.info(`[REALTIME] payment:success emitted for Order #${orderNumber}`);
    } catch (err) {
        logger.error('[REALTIME] Failed to emit payment:success:', err.message);
    }
}
