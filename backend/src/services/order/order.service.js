import mongoose from 'mongoose';
import { Order } from '../../models/Order.js';
import { MenuItem } from '../../models/MenuItem.js';
import { DeliveryZone } from '../../models/DeliveryZone.js';
import { PaymentAttempt } from '../../models/Payment.js';
import { Message } from '../../models/Message.js';
import { Customer } from '../../models/Customer.js';
import { Rider } from '../../models/Rider.js';
import {
    restaurantConfig,
    isRestaurantOpen,
    calculateDeliveryFee,
    isOnlinePaymentEnabled,
} from '../../config/restaurant.config.js';
import { generateOrderNumber } from '../../utils/generate-order-number.js';
import {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} from '../../utils/errors.js';
import { getDateRangeFilter } from '../../utils/date-filter.js';
import { sendAdminPushNotification } from '../notifications/admin-push.service.js';
import { initiateRefund } from '../payments/payment-verification.service.js';
import {
    emitNewOrder,
    emitOrderConfirmed,
    emitOrderStatusChanged,
    emitOrderExpired,
    emitOrderCancelled,
    emitRiderAssigned,
} from '../../socket/socket.server.js';
import { calculateRouteDistance } from '../delivery/distance.service.js';

export const createOrder = async (customerId, orderData) => {

    // 1. Restaurant operational check
    if (!isRestaurantOpen()) {
        throw new BadRequestError('The restaurant is currently closed and not accepting orders.');
    }

    // 1b. Online payment availability check
    if (orderData.paymentMethod === 'razorpay' && !isOnlinePaymentEnabled()) {
        throw new BadRequestError('Online payment is currently unavailable. Please choose Cash on Delivery.');
    }

    // 2. Consolidate requested items by (menuItemId + variant) to handle duplicate variants gracefully
    const itemVariantMap = new Map();
    const uniqueItemIdsSet = new Set();

    for (const item of orderData.items) {
        const id = item.menuItem.toString();
        const variant = item.variant || 'single';
        const key = `${id}__${variant}`;

        uniqueItemIdsSet.add(id);
        const existing = itemVariantMap.get(key) || { menuItemId: id, variant, quantity: 0 };
        existing.quantity += item.quantity;
        itemVariantMap.set(key, existing);
    }
    const uniqueItemIds = Array.from(uniqueItemIdsSet);

    // 3. Fetch all requested MenuItems from MongoDB in a single query
    const menuItems = await MenuItem.find({ _id: { $in: uniqueItemIds } });
    const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

    // 4. Verify all items exist in database
    if (menuItems.length !== uniqueItemIds.length) {
        const foundIds = new Set(menuItems.map((item) => item._id.toString()));
        const missingIds = uniqueItemIds.filter((id) => !foundIds.has(id));
        throw new NotFoundError(`Menu item(s) not found: ${missingIds.join(', ')}`);
    }

    // 5. Verify every item is available
    for (const menuItem of menuItems) {
        if (!menuItem.isAvailable) {
            throw new BadRequestError(`Menu item "${menuItem.name}" is currently unavailable`);
        }
    }

    // 6 & 7. Calculate item subtotals using CURRENT database price per variant (strictly ignoring client prices)
    let subtotal = 0;
    const orderItemSnapshots = [];

    for (const { menuItemId, variant, quantity } of itemVariantMap.values()) {
        const menuItem = menuItemMap.get(menuItemId);
        const pricingType = menuItem.pricingType || 'single';

        let unitPrice;
        if (pricingType === 'single') {
            if (variant !== 'single') {
                throw new BadRequestError(
                    `Item "${menuItem.name}" only supports single pricing, but received variant "${variant}"`
                );
            }
            unitPrice = menuItem.price;
        } else if (pricingType === 'half-full') {
            if (variant === 'half') {
                unitPrice = menuItem.halfPrice;
            } else if (variant === 'full') {
                unitPrice = menuItem.fullPrice;
            } else {
                throw new BadRequestError(
                    `Item "${menuItem.name}" requires a "half" or "full" variant, but received "${variant}"`
                );
            }
        }

        if (unitPrice === undefined || unitPrice === null || unitPrice <= 0) {
            throw new BadRequestError(
                `Price configuration missing or invalid for item "${menuItem.name}" (variant: ${variant})`
            );
        }

        const itemSubtotal = unitPrice * quantity;
        subtotal += itemSubtotal;

        orderItemSnapshots.push({
            menuItem: menuItem._id,
            name: menuItem.name,
            variant,
            unitPrice,
            price: unitPrice,
            quantity,
            image: menuItem.image?.url || null,
            subtotal: itemSubtotal,
        });
    }

    // 8. Check minimum order amount threshold
    if (subtotal < restaurantConfig.minimumOrderAmount) {
        throw new BadRequestError(
            `Minimum order amount is ₹${restaurantConfig.minimumOrderAmount}. Current subtotal is ₹${subtotal}.`
        );
    }

    // 9 & 10. Calculate delivery fee, GST, and authoritative total
    const orderType = orderData.orderType || 'delivery';
    let deliveryFee = 0;
    let gst = 0;
    const deliveryAddress = orderData.deliveryAddress ? { ...orderData.deliveryAddress } : {};
    const zoneId = orderData.deliveryZoneId || deliveryAddress.deliveryZoneId;

    // Validate and sanitize location if provided
    let hasValidCoords = false;
    let validLat = null;
    let validLng = null;

    if (deliveryAddress.location) {
        const lat = deliveryAddress.location.latitude;
        const lng = deliveryAddress.location.longitude;
        if (
            typeof lat === 'number' &&
            typeof lng === 'number' &&
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
        ) {
            hasValidCoords = true;
            validLat = lat;
            validLng = lng;
        }
    }

    if (orderType === 'delivery') {
        if (hasValidCoords) {
            // Authoritatively calculate and verify driving-route distance using Google Routes API
            const routeResult = await calculateRouteDistance(validLat, validLng);

            if (!routeResult.isEligible) {
                throw new BadRequestError(
                    routeResult.message || 'Sorry, we currently deliver only within 7 km of our restaurant. Please choose another delivery address.'
                );
            }

            deliveryFee = routeResult.fee;

            deliveryAddress.location = {
                latitude: validLat,
                longitude: validLng,
                placeId: deliveryAddress.location.placeId || null,
                formattedAddress: deliveryAddress.location.formattedAddress || null,
                source: deliveryAddress.location.source || 'google_places',
                distanceMeters: routeResult.distanceMeters,
                distanceKm: routeResult.distanceKm,
                formattedDistance: routeResult.formattedDistance,
            };

            // If a zone is also associated, snapshot area name
            if (zoneId) {
                const zone = await DeliveryZone.findById(zoneId);
                if (zone) {
                    deliveryAddress.area = zone.name;
                    deliveryAddress.deliveryZoneId = zone._id;
                }
            }
        } else if (zoneId) {
            // Fallback for manual addresses without coordinates using selected delivery zone
            const zone = await DeliveryZone.findById(zoneId);
            if (!zone) {
                throw new NotFoundError('Selected delivery zone not found');
            }
            if (!zone.isActive) {
                throw new BadRequestError('Selected delivery zone is currently inactive');
            }

            deliveryFee = zone.deliveryFee;
            deliveryAddress.area = zone.name;
            deliveryAddress.deliveryZoneId = zone._id;
            deliveryAddress.location = null;
        } else {
            // Fallback for legacy orders
            deliveryFee = calculateDeliveryFee({
                orderType,
                subtotal,
                address: deliveryAddress,
                selectedDeliveryFee: orderData.deliveryFee,
            });
            deliveryAddress.location = null;
        }

        // Authoritative 5% GST strictly on items subtotal (not delivery fee)
        gst = Math.round(subtotal * 0.05 * 100) / 100;
    } else {
        deliveryAddress.location = null;
    }

    const total = Math.round((subtotal + gst + deliveryFee) * 100) / 100;

    // 11. Generate unique customer-facing order reference
    const orderNumber = generateOrderNumber();

    const acceptanceDeadline = new Date(Date.now() + 3 * 60 * 1000);

    // 12 & 13. Persist order with immutable snapshots and initial statuses
    const order = new Order({
        orderNumber,
        customer: customerId,
        items: orderItemSnapshots,
        deliveryAddress,
        orderType,
        subtotal,
        gst,
        deliveryFee,
        total,
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: 'pending',
        orderStatus: 'placed',
        acceptanceDeadline,
        acceptedAt: null,
        confirmedAt: null,
        expiredAt: null,
        expiryReason: null,
        rider: null,
    });

    await order.save();

    // 10. Emit real-time Socket.IO event to admin:orders (safe & non-blocking)
    try {
        emitNewOrder(order);
    } catch (socketErr) {
        console.error('[OrderService] Socket emission error for new order:', socketErr.message);
    }

    // 11. Trigger admin push notification for new order (idempotent & non-blocking)
    try {
        if (mongoose.connection?.readyState === 1) {
            const claimed = await Order.findOneAndUpdate(
                { _id: order._id, pushNotificationSent: false },
                { pushNotificationSent: true },
                { new: true }
            );
            if (claimed) {
                sendAdminPushNotification({
                    type: 'NEW_ORDER',
                    title: 'New Order — Majedaar',
                    body: `Order #${order.orderNumber} • ₹${Number(order.total).toFixed(2)}`,
                    url: `/dashboard/orders/${order._id}`,
                    data: {
                        orderId: order._id.toString(),
                        orderNumber: order.orderNumber,
                        total: order.total,
                    },
                }).catch((err) => {
                    console.error('[OrderService] Push notification error:', err.message);
                });
            }
        }
    } catch (pushErr) {
        console.error('[OrderService] Push claim error:', pushErr.message);
    }

    return order;
};

/**
 * State machine defining permissible forward and cancellation transitions.
 */
export const VALID_STATUS_TRANSITIONS = {
    placed: ['confirmed', 'cancelled', 'expired'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready_for_pickup', 'cancelled'],
    ready_for_pickup: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['completed'],
    completed: [],
    cancelled: [],
    expired: [],
};

/**
 * Background / periodic helper: Transitions placed orders whose 3-minute acceptance window has elapsed to 'expired'.
 * Retains documents safely for history and analytics (never deletes).
 */
export const expireOverduePlacedOrders = async () => {
    const now = new Date();
    const overdueOrders = await Order.find({
        orderStatus: 'placed',
        acceptanceDeadline: { $ne: null, $lte: now },
    });

    if (!overdueOrders.length) return 0;

    const overdueIds = overdueOrders.map((o) => o._id);
    const result = await Order.updateMany(
        {
            _id: { $in: overdueIds },
            orderStatus: 'placed',
        },
        {
            $set: {
                orderStatus: 'expired',
                expiredAt: now,
                expiryReason: 'admin_acceptance_timeout',
            },
        }
    );

    for (const ord of overdueOrders) {
        try {
            ord.orderStatus = 'expired';
            ord.expiredAt = now;
            ord.expiryReason = 'admin_acceptance_timeout';
            emitOrderExpired(ord);
        } catch (_) {}
    }

    return result?.modifiedCount || 0;
};

/**
 * Lazy authoritative expiration check for a single order document.
 */
export const checkAndExpireOrder = async (order) => {
    if (!order) return null;
    const now = new Date();
    if (
        order.orderStatus === 'placed' &&
        order.acceptanceDeadline &&
        new Date(order.acceptanceDeadline) <= now
    ) {
        const expired = await Order.findOneAndUpdate(
            {
                _id: order._id,
                orderStatus: 'placed',
                acceptanceDeadline: { $lte: now },
            },
            {
                $set: {
                    orderStatus: 'expired',
                    expiredAt: now,
                    expiryReason: 'admin_acceptance_timeout',
                },
            },
            { new: true }
        );
        if (expired) {
            try {
                emitOrderExpired(expired);
            } catch (_) {}
            return expired;
        }
        return order;
    }
    return order;
};

/**
 * Lazy authoritative expiration check for an array of order documents.
 */
export const checkAndExpireOrders = async (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) return orders;
    const now = new Date();
    const expiredIds = [];

    for (const ord of orders) {
        if (
            ord.orderStatus === 'placed' &&
            ord.acceptanceDeadline &&
            new Date(ord.acceptanceDeadline) <= now
        ) {
            expiredIds.push(ord._id);
        }
    }

    if (expiredIds.length > 0) {
        await Order.updateMany(
            { _id: { $in: expiredIds }, orderStatus: 'placed' },
            {
                $set: {
                    orderStatus: 'expired',
                    expiredAt: now,
                    expiryReason: 'admin_acceptance_timeout',
                },
            }
        );
        for (const ord of orders) {
            if (expiredIds.some((id) => id.toString() === ord._id.toString())) {
                ord.orderStatus = 'expired';
                ord.expiredAt = now;
                ord.expiryReason = 'admin_acceptance_timeout';
            }
        }
    }
    return orders;
};

/**
 * Strips rider information from customer-facing order snapshot
 * unless order has reached 'out_for_delivery' or 'completed' status.
 */
export const sanitizeCustomerOrder = (order) => {
    if (!order) return null;
    const doc = order.toObject ? order.toObject() : { ...order };
    if (doc.orderStatus !== 'out_for_delivery' && doc.orderStatus !== 'completed') {
        doc.rider = null;
    } else if (doc.rider) {
        doc.rider = {
            _id: doc.rider._id,
            name: doc.rider.name,
            phone: doc.rider.phone,
        };
    }
    return doc;
};

/**
 * Retrieve all orders belonging to the authenticated customer.
 * 
 * @param {string|mongoose.Types.ObjectId} customerId 
 * @returns {Promise<Array<Object>>}
 */
export const getCustomerOrders = async (customerId) => {
    let query = Order.find({ customer: customerId });
    if (query && typeof query.populate === 'function') {
        query = query.populate('rider', 'name phone');
    }
    let orders = await (query && query.sort ? query.sort({ createdAt: -1 }) : query);

    orders = await checkAndExpireOrders(orders);
    return orders.map((ord) => sanitizeCustomerOrder(ord));
};

export const getCustomerOrderById = async (customerId, orderId) => {
    let order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (order.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You do not have permission to access this order');
    }

    order = await checkAndExpireOrder(order);

    if (order && typeof order.populate === 'function') {
        try {
            await order.populate('rider', 'name phone');
        } catch (_) {}
    }

    return sanitizeCustomerOrder(order);
};

export const getAdminOrders = async (queryFilters = {}) => {
    const filter = {};

    if (queryFilters.orderStatus) {
        filter.orderStatus = queryFilters.orderStatus;
    }

    if (queryFilters.paymentStatus) {
        filter.paymentStatus = queryFilters.paymentStatus;
    }

    // Apply server-side date filter (Today, This Week, or Custom Range in IST)
    const dateFilter = getDateRangeFilter({
        datePreset: queryFilters.datePreset,
        dateFrom: queryFilters.dateFrom,
        dateTo: queryFilters.dateTo,
        fieldName: 'createdAt',
    });
    Object.assign(filter, dateFilter);

    // Apply search across order #, customer name, email, phone, and delivery address
    if (queryFilters.search && queryFilters.search.trim()) {
        const s = queryFilters.search.trim();
        const escaped = s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        let matchingCustomerIds = [];
        try {
            const matchingCustomers = await Customer.find({
                $or: [{ name: regex }, { email: regex }, { phone: regex }],
            }).select('_id').lean();
            matchingCustomerIds = matchingCustomers.map((c) => c._id);
        } catch (_) {}

        filter.$and = filter.$and || [];
        filter.$and.push({
            $or: [
                { orderNumber: regex },
                { 'deliveryAddress.firstName': regex },
                { 'deliveryAddress.lastName': regex },
                { 'deliveryAddress.phone': regex },
                { 'customerInfo.name': regex },
                { 'customerInfo.phone': regex },
                ...(matchingCustomerIds.length > 0 ? [{ customer: { $in: matchingCustomerIds } }] : []),
            ],
        });
    }

    const hasPagination = queryFilters.page !== undefined || queryFilters.limit !== undefined;
    const page = Math.max(1, parseInt(queryFilters.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(queryFilters.limit, 10) || 50));
    const skip = (page - 1) * limit;

    let query = Order.find(filter);
    if (query && typeof query.populate === 'function') {
        query = query.populate('customer', 'name email phone');
        if (query && typeof query.populate === 'function' && (query.model || query.schema)) {
            query = query.populate('rider', 'name phone isActive');
        }
    }

    if (query && query.sort) {
        query = query.sort({ createdAt: -1 });
    }

    if (hasPagination && query && query.skip && query.limit) {
        query = query.skip(skip).limit(limit);
    }

    const [ordersResult, total] = await Promise.all([
        query,
        typeof Order.countDocuments === 'function' ? Order.countDocuments(filter) : (query?.length || 0),
    ]);

    let orders = await checkAndExpireOrders(ordersResult);

    return {
        orders,
        total: typeof total === 'number' ? total : (orders?.length || 0),
        page: hasPagination ? page : 1,
        limit: hasPagination ? limit : (orders?.length || 0),
        totalPages: Math.ceil((typeof total === 'number' ? total : orders.length) / (hasPagination ? limit : (total || 1))),
    };
};

export const getAdminOrderById = async (orderId) => {
    let query = Order.findById(orderId);
    if (query && typeof query.populate === 'function') {
        query = query.populate('customer', 'name email phone');
        if (query && typeof query.populate === 'function' && (query.model || query.schema)) {
            query = query.populate('rider', 'name phone isActive');
        }
    }
    let order = await query;
    if (!order) {
        throw new NotFoundError('Order not found');
    }
    order = await checkAndExpireOrder(order);
    return order;
};

export const updateOrderStatus = async (orderId, updateData) => {
    let orderStatus;
    let paymentStatus;
    if (typeof updateData === 'string') {
        orderStatus = updateData;
    } else if (updateData && typeof updateData === 'object') {
        orderStatus = updateData.orderStatus;
        paymentStatus = updateData.paymentStatus;
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    const now = new Date();

    // Check if order has reached deadline before any action
    if (
        order.orderStatus === 'placed' &&
        order.acceptanceDeadline &&
        new Date(order.acceptanceDeadline) <= now
    ) {
        if (typeof Order.updateOne === 'function') {
            await Order.updateOne(
                { _id: order._id, orderStatus: 'placed' },
                {
                    $set: {
                        orderStatus: 'expired',
                        expiredAt: now,
                        expiryReason: 'admin_acceptance_timeout',
                    },
                }
            );
        }
        order.orderStatus = 'expired';
        order.expiredAt = now;
        order.expiryReason = 'admin_acceptance_timeout';
        try {
            emitOrderExpired(order);
        } catch (_) {}
    }

    // Terminal states cannot be changed
    if (['completed', 'cancelled', 'expired'].includes(order.orderStatus) && orderStatus) {
        if (order.orderStatus === 'expired') {
            throw new BadRequestError('This order has already expired and can no longer be confirmed.');
        }
        throw new BadRequestError(
            `Order is in terminal state "${order.orderStatus}" and cannot be transitioned further.`
        );
    }

    // Handle orderStatus transition
    if (orderStatus && orderStatus !== order.orderStatus) {
        // Special atomic confirmation handling for 'confirmed'
        if (orderStatus === 'confirmed') {
            if (order.orderStatus !== 'placed') {
                throw new BadRequestError(`Cannot confirm order in "${order.orderStatus}" status.`);
            }

            if (typeof Order.findOneAndUpdate === 'function' && Order.schema) {
                const confirmedOrder = await Order.findOneAndUpdate(
                    {
                        _id: order._id,
                        orderStatus: 'placed',
                        $or: [
                            { acceptanceDeadline: null },
                            { acceptanceDeadline: { $gt: now } },
                        ],
                    },
                    {
                        $set: {
                            orderStatus: 'confirmed',
                            confirmedAt: now,
                            acceptedAt: now,
                            ...(paymentStatus ? { paymentStatus } : {}),
                        },
                    },
                    { new: true }
                );

                if (!confirmedOrder) {
                    const refreshed = await Order.findById(order._id);
                    if (
                        !refreshed ||
                        refreshed.orderStatus === 'expired' ||
                        (refreshed.acceptanceDeadline && new Date(refreshed.acceptanceDeadline) <= now)
                    ) {
                        throw new BadRequestError('This order has already expired and can no longer be confirmed.');
                    }
                    throw new BadRequestError(
                        `Order can no longer be confirmed (current status: ${refreshed.orderStatus}).`
                    );
                }

                if (typeof confirmedOrder.populate === 'function') {
                    try {
                        await confirmedOrder.populate('rider', 'name phone isActive');
                    } catch (_) {}
                }
                try {
                    emitOrderConfirmed(confirmedOrder);
                } catch (emitErr) {
                    console.error('[OrderService] emitOrderConfirmed error:', emitErr.message);
                }
                return confirmedOrder;
            } else {
                if (order.acceptanceDeadline && new Date(order.acceptanceDeadline) <= now) {
                    throw new BadRequestError('This order has already expired and can no longer be confirmed.');
                }
                order.orderStatus = 'confirmed';
                order.confirmedAt = now;
                order.acceptedAt = now;
            }
        } else {
            // General state machine validation
            const allowed = [...(VALID_STATUS_TRANSITIONS[order.orderStatus] || [])];
            // Backward-compatibility: allow legacy orders without acceptanceDeadline or direct test transitions
            if (order.orderStatus === 'placed' && !order.acceptanceDeadline) {
                allowed.push('preparing');
            }
            if (order.orderStatus === 'preparing') {
                allowed.push('completed');
            }

            if (!allowed.includes(orderStatus)) {
                throw new BadRequestError(
                    `Cannot transition order from "${order.orderStatus}" to "${orderStatus}". Allowed next statuses: ${allowed.join(', ')}`
                );
            }

            order.orderStatus = orderStatus;
        }
    }

    if (paymentStatus) {
        order.paymentStatus = paymentStatus;
    }

    if (typeof order.save === 'function') {
        await order.save();
    }

    if (typeof order.populate === 'function') {
        try {
            await order.populate('rider', 'name phone isActive');
        } catch (_) {}
    }

    try {
        if (order.orderStatus === 'confirmed') {
            emitOrderConfirmed(order);
        } else if (order.orderStatus === 'expired') {
            emitOrderExpired(order);
        } else if (order.orderStatus === 'cancelled') {
            emitOrderCancelled(order);
        } else {
            emitOrderStatusChanged(order);
        }
    } catch (emitErr) {
        console.error('[OrderService] emitOrderStatusChanged error:', emitErr.message);
    }

    return order;
};

/**
 * Assign or reassign an active rider to an order.
 * 
 * @param {string} orderId 
 * @param {string|null} riderId 
 * @returns {Promise<Order>}
 */
export const assignRiderToOrder = async (orderId, riderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (order.orderStatus === 'cancelled' || order.orderStatus === 'expired') {
        throw new BadRequestError(`Cannot assign a rider to a ${order.orderStatus} order.`);
    }

    if (!riderId) {
        order.rider = null;
        await order.save();
        return order;
    }

    if (!mongoose.Types.ObjectId.isValid(riderId)) {
        throw new BadRequestError('Invalid rider ID format');
    }

    const rider = await Rider.findById(riderId);
    if (!rider) {
        throw new NotFoundError('Rider not found');
    }

    if (!rider.isActive) {
        throw new BadRequestError('This rider is inactive and cannot be assigned to an order.');
    }

    order.rider = rider._id;
    await order.save();
    const populated = await order.populate('rider', 'name phone isActive');
    try {
        emitRiderAssigned(populated);
    } catch (err) {
        console.error('[OrderService] emitRiderAssigned error:', err.message);
    }
    return populated;
};

/**
 * Cancel an order by the owning customer.
 * Allowed ONLY when orderStatus is 'placed' (before kitchen preparation starts).
 * For paid online Razorpay orders, safely triggers refund.
 * 
 * @param {string} orderId 
 * @param {string} customerId 
 * @returns {Promise<Order>}
 */
export const cancelCustomerOrder = async (orderId, customerId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (order.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You are not authorized to cancel this order');
    }

    if (order.orderStatus === 'cancelled') {
        throw new BadRequestError('This order is already cancelled.');
    }

    if (order.orderStatus === 'expired') {
        throw new BadRequestError('This order has already expired.');
    }

    const now = new Date();
    if (order.acceptanceDeadline && new Date(order.acceptanceDeadline) <= now) {
        order.orderStatus = 'expired';
        order.expiredAt = now;
        order.expiryReason = 'admin_acceptance_timeout';
        await order.save();
        throw new BadRequestError('This order has already expired.');
    }

    if (order.orderStatus !== 'placed') {
        throw new BadRequestError('Order cannot be cancelled once preparation has started.');
    }

    // If online paid via Razorpay, trigger refund safely using existing architecture
    if (order.paymentMethod === 'razorpay' && order.paymentStatus === 'paid') {
        const paidAttempt = await PaymentAttempt.findOne({
            order: order._id,
            status: 'paid',
        });

        if (paidAttempt && !paidAttempt.refundId) {
            await initiateRefund(paidAttempt._id, paidAttempt.amount);
            order.paymentStatus = 'refunded';
        }
    }

    order.orderStatus = 'cancelled';
    await order.save();

    try {
        emitOrderCancelled(order);
    } catch (emitErr) {
        console.error('[OrderService] emitOrderCancelled error:', emitErr.message);
    }

    return order;
};

/**
 * Report an issue with an order.
 * Customer must be the owner of the order.
 * 
 * @param {string} orderId 
 * @param {string} customerId 
 * @param {Object} issueData
 * @param {string} issueData.issueType
 * @param {string} issueData.description
 * @returns {Promise<Message>}
 */
export const reportOrderIssue = async (orderId, customerId, { issueType, description }) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (order.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You are not authorized to report an issue for this order');
    }

    const customer = await Customer.findById(customerId);
    const senderName = customer?.name?.trim() || order.customerInfo?.name || 'Customer';
    const senderEmail = customer?.email?.trim() || '';
    const senderPhone = customer?.phone?.trim() || order.customerInfo?.phone || '';

    // Spam / duplicate prevention: 60s check for same order and issue description
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentDuplicate = await Message.findOne({
        customer: customerId,
        order: order._id,
        message: description.trim(),
        createdAt: { $gte: oneMinuteAgo },
    });

    if (recentDuplicate) {
        throw new BadRequestError('We have already received this issue report. Please wait before submitting again.');
    }

    const issueMessage = new Message({
        customer: customerId,
        name: senderName,
        email: senderEmail,
        phone: senderPhone,
        type: 'order_issue',
        order: order._id,
        orderNumber: order.orderNumber,
        issueType,
        message: description.trim(),
        status: 'new',
    });

    await issueMessage.save();
    return issueMessage;
};

export const createCustomerOrder = createOrder;
