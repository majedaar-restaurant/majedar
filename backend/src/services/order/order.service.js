import mongoose from 'mongoose';
import { Order } from '../../models/Order.js';
import { MenuItem } from '../../models/MenuItem.js';
import { Review } from '../../models/Review.js';
import { DeliveryZone } from '../../models/DeliveryZone.js';
import { PaymentAttempt } from '../../models/Payment.js';
import { Message } from '../../models/Message.js';
import { Customer } from '../../models/Customer.js';
import { Rider } from '../../models/Rider.js';
import { config } from '../../config/env.js';
import { createRiderNotification } from '../rider/rider-notification.service.js';
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
import { sendRiderPushNotification } from '../rider/rider-push.service.js';
import { initiateRefund } from '../payments/payment-verification.service.js';
import {
    emitNewOrder,
    emitOrderConfirmed,
    emitOrderStatusChanged,
    emitOrderExpired,
    emitOrderCancelled,
    emitRiderAssigned,
    getIO,
} from '../../socket/socket.server.js';
import { calculateRouteDistance } from '../delivery/distance.service.js';
import { getPublicSettings } from '../settings/settings.service.js';
import {
    calculateCartPricing,
    recordDiscountUsage,
    rollbackDiscountUsage,
} from '../discount/discount.service.js';

const refreshPreviousRiderAvailability = async (riderId) => {
    if (!riderId) return;
    const rider = await Rider.findById(riderId);
    if (!rider || rider.availability !== 'busy') return;
    const activeAssignments = await Order.countDocuments({
        rider: riderId,
        riderStatus: { $in: ['pending', 'accepted', 'picked_up', 'out_for_delivery'] },
    });
    if (activeAssignments > 0) return;
    rider.availability = 'available';
    await rider.save();
    const availabilityPayload = {
        riderId: rider._id.toString(),
        availability: rider.availability,
        activeAssignments: 0,
    };
    getIO()?.to('admin:orders').emit('rider:availability_changed', availabilityPayload);
    getIO()?.to(`rider:${rider._id}`).emit('rider:availability_changed', availabilityPayload);
};

const getDeliveryAttention = (order, now = new Date()) => {
    const doc = typeof order.toObject === 'function' ? order.toObject() : order;
    const lastDeliveryStart = [...(doc.riderDeliveryHistory || [])].reverse()
        .find((event) => ['picked_up', 'out_for_delivery'].includes(event.status))?.timestamp;
    const deliveryIsActive = doc.orderStatus === 'out_for_delivery'
        || ['picked_up', 'out_for_delivery'].includes(doc.riderStatus);
    const startedAt = doc.deliveryStartedAt || lastDeliveryStart || (deliveryIsActive ? doc.createdAt : null);
    const durationMinutes = startedAt
        ? Math.max(0, Math.floor((now.getTime() - new Date(startedAt).getTime()) / 60000))
        : null;
    const overdueAt = startedAt
        ? new Date(new Date(startedAt).getTime() + config.deliveryOverdueMinutes * 60 * 1000)
        : null;
    const latestAssignment = [...(doc.riderAssignmentHistory || [])].reverse()
        .find((assignment) => !assignment.unassignedAt);
    return {
        ...doc,
        deliveryStartedAt: startedAt,
        deliveryDurationMinutes: durationMinutes,
        deliveryOverdue: deliveryIsActive && Boolean(overdueAt) && now >= overdueAt,
        deliveryOverdueAt: deliveryIsActive ? overdueAt : null,
        deliveryOverdueMinutes: deliveryIsActive && durationMinutes !== null
            ? Math.max(0, durationMinutes - config.deliveryOverdueMinutes)
            : 0,
        assignmentTimedOut: Boolean(latestAssignment?.timedOutAt),
        assignmentRejected: doc.riderStatus === 'rejected',
    };
};

export const createOrder = async (customerId, orderData) => {

    // 1. Restaurant operational and over-order dynamic check
    try {
        const shopStatus = await getPublicSettings();
        if (shopStatus && !shopStatus.canAcceptOrders) {
            throw new BadRequestError(
                shopStatus.restrictionMessage || 'The restaurant is currently closed and not accepting orders.'
            );
        }
    } catch (err) {
        if (err instanceof BadRequestError) throw err;
        // Fallback to static check if setting model lookup is mocked/unavailable
        if (!isRestaurantOpen()) {
            throw new BadRequestError('The restaurant is currently closed and not accepting orders.');
        }
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
    } else {
        deliveryAddress.location = null;
    }

    // Central authoritative discount and pricing calculation
    const pricing = await calculateCartPricing({
        items: orderData.items,
        couponCode: orderData.couponCode,
        customerId,
        deliveryFee,
    });

    if (pricing.foodSubtotal < restaurantConfig.minimumOrderAmount) {
        throw new BadRequestError(
            `Minimum order amount is ₹${restaurantConfig.minimumOrderAmount}. Current subtotal is ₹${pricing.foodSubtotal}.`
        );
    }

    const orderNumber = generateOrderNumber();
    const acceptanceDeadline = new Date(Date.now() + 3 * 60 * 1000);

    // Persist order with immutable snapshots and initial statuses
    const order = new Order({
        orderNumber,
        customer: customerId,
        items: pricing.items,
        deliveryAddress,
        orderType,
        subtotal: pricing.foodSubtotal,
        discount: pricing.discount,
        totalSavings: pricing.totalSavings,
        gst: pricing.gst,
        deliveryFee: pricing.deliveryFee,
        total: pricing.total,
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: 'pending',
        orderStatus: 'placed',
        statusHistory: [{
            domain: 'order',
            status: 'placed',
            actorType: 'customer',
            actor: customerId,
            timestamp: new Date(),
        }],
        acceptanceDeadline,
        acceptedAt: null,
        confirmedAt: null,
        expiredAt: null,
        expiryReason: null,
        rider: null,
    });

    await order.save();

    // Record discount redemption atomically
    if (pricing.discount?.discountId) {
        await recordDiscountUsage(pricing.discount.discountId, customerId, pricing.discount.amount);
    }

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
            $push: {
                statusHistory: {
                    domain: 'order',
                    status: 'expired',
                    previousStatus: 'placed',
                    actorType: 'system',
                    timestamp: now,
                },
            },
        }
    );

    for (const ord of overdueOrders) {
        try {
            ord.orderStatus = 'expired';
            ord.expiredAt = now;
            ord.expiryReason = 'admin_acceptance_timeout';
            emitOrderExpired(ord);
        } catch (_) { }
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
                $push: {
                    statusHistory: {
                        domain: 'order',
                        status: 'expired',
                        previousStatus: 'placed',
                        actorType: 'system',
                        timestamp: now,
                    },
                },
            },
            { new: true }
        );
        if (expired) {
            try {
                emitOrderExpired(expired);
            } catch (_) { }
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
                $push: {
                    statusHistory: {
                        domain: 'order',
                        status: 'expired',
                        previousStatus: 'placed',
                        actorType: 'system',
                        timestamp: now,
                    },
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
    const trackingIsLive = doc.orderStatus === 'out_for_delivery';
    const deliveryHasStarted = ['out_for_delivery', 'completed'].includes(doc.orderStatus);
    if (!deliveryHasStarted && doc.orderStatus !== 'out_for_delivery' && doc.orderStatus !== 'completed') {
        doc.rider = null;
    } else if (doc.rider) {
        doc.rider = {
            _id: doc.rider._id,
            name: doc.rider.name,
            phone: doc.rider.phone,
        };
    }
    if (!trackingIsLive) {
        doc.riderLocation = null;
        doc.routeEta = null;
    }
    delete doc.deliveryRecoveryHistory;
    delete doc.riderAssignmentHistory;
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
        } catch (_) { }
    }

    const doc = sanitizeCustomerOrder(order);

    // Attach existing reviews for this order so the frontend can pre-populate ratings on refresh
    try {
        const reviews = await Review.find({
            customer: customerId,
            order: orderId,
        }).lean();
        doc.reviews = reviews || [];
    } catch (_) {
        doc.reviews = [];
    }

    return doc;
};

export const getAdminOrders = async (queryFilters = {}) => {
    const filter = {};
    const now = new Date();
    const overdueBefore = new Date(now.getTime() - config.deliveryOverdueMinutes * 60 * 1000);

    if (queryFilters.orderStatus) {
        filter.orderStatus = queryFilters.orderStatus;
    }

    if (queryFilters.paymentStatus) {
        filter.paymentStatus = queryFilters.paymentStatus;
    }

    if (queryFilters.attention === 'active_deliveries') {
        filter.$or = [
            { riderStatus: { $in: ['picked_up', 'out_for_delivery'] } },
            { orderStatus: 'out_for_delivery' },
        ];
    } else if (queryFilters.attention === 'overdue') {
        filter.$and = [
            { $or: [{ riderStatus: { $in: ['picked_up', 'out_for_delivery'] } }, { orderStatus: 'out_for_delivery' }] },
            {
                $or: [
                    { deliveryStartedAt: { $lte: overdueBefore } },
                    {
                        deliveryStartedAt: null,
                        riderDeliveryHistory: {
                            $elemMatch: {
                                status: { $in: ['picked_up', 'out_for_delivery'] },
                                timestamp: { $lte: overdueBefore },
                            },
                        },
                    },
                    { deliveryStartedAt: null, riderDeliveryHistory: { $size: 0 }, createdAt: { $lte: overdueBefore } },
                    { deliveryStartedAt: null, riderDeliveryHistory: { $exists: false }, createdAt: { $lte: overdueBefore } },
                ],
            },
        ];
    } else if (queryFilters.attention === 'assignment_pending') {
        filter.$or = [
            { orderStatus: 'ready_for_pickup', rider: null },
            { riderStatus: 'pending', rider: { $ne: null } },
        ];
    } else if (queryFilters.attention === 'new_orders') {
        filter.orderStatus = 'placed';
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
        } catch (_) { }

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
            query = query.populate('rider', 'name phone isActive availability');
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
    orders = orders.map((order) => getDeliveryAttention(order, now));

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
            query = query.populate('rider', 'name phone isActive availability');
            query = query.populate('riderAssignmentHistory.rider', 'name phone');
            query = query.populate('riderDeliveryHistory.rider', 'name phone');
            query = query.populate('deliveryRecoveryHistory.actor', 'name email');
            query = query.populate('deliveryRecoveryHistory.rider', 'name phone');
            query = query.populate('codCollections.rider', 'name phone');
            query = query.populate('codCollections.verifiedBy', 'name email');
        }
    }
    let order = await query;
    if (!order) {
        throw new NotFoundError('Order not found');
    }
    order = await checkAndExpireOrder(order);
    return getDeliveryAttention(order);
};

export const updateOrderStatus = async (orderId, updateData, adminId = null) => {
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
    const previousOrderStatus = order.orderStatus;

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
                    $push: {
                        statusHistory: {
                            domain: 'order',
                            status: 'expired',
                            previousStatus: 'placed',
                            actorType: 'system',
                            timestamp: now,
                        },
                    },
                }
            );
        }
        order.orderStatus = 'expired';
        order.expiredAt = now;
        order.expiryReason = 'admin_acceptance_timeout';
        try {
            emitOrderExpired(order);
        } catch (_) { }
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
        if (
            orderStatus === 'completed'
            && order.orderType === 'delivery'
            && order.orderStatus === 'out_for_delivery'
            && order.riderStatus !== 'delivered'
        ) {
            throw new BadRequestError('Verify delivery and use the delivery recovery action before completing this order.');
        }
        if (orderStatus === 'out_for_delivery' && order.orderType === 'delivery') {
            if (!order.rider) {
                throw new BadRequestError('Assign a rider before marking this delivery out for delivery.');
            }
            if (!['pending', 'accepted', 'picked_up', 'out_for_delivery'].includes(order.riderStatus)) {
                throw new BadRequestError('The assigned rider is not eligible to start this delivery.');
            }
        }
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
                    } catch (_) { }
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

    if (
        orderStatus === 'out_for_delivery'
        && order.orderStatus === 'out_for_delivery'
        && order.orderType === 'delivery'
        && order.rider
        && (order.riderStatus !== 'out_for_delivery' || !order.deliveryStartedAt)
    ) {
        if (!['pending', 'accepted', 'picked_up', 'out_for_delivery'].includes(order.riderStatus)) {
            throw new BadRequestError('The assigned rider is not eligible to start this delivery.');
        }
        const previousRiderStatus = order.riderStatus;
        order.riderStatus = 'out_for_delivery';
        order.deliveryStartedAt = order.deliveryStartedAt || now;
        order.riderHandoffRequired = false;
        const pendingAssignment = [...(order.riderAssignmentHistory || [])].reverse().find((assignment) =>
            assignment.rider.toString() === order.rider.toString()
            && !assignment.acceptedAt
            && !assignment.rejectedAt
            && !assignment.timedOutAt
            && !assignment.unassignedAt
        );
        if (pendingAssignment) pendingAssignment.acceptedAt = now;
        order.statusHistory.push({
            domain: 'rider',
            status: 'out_for_delivery',
            previousStatus: previousRiderStatus,
            actorType: adminId ? 'admin' : 'system',
            actor: adminId,
            note: 'Admin marked the order as handed to the rider.',
            timestamp: now,
        });
    }

    if (paymentStatus) {
        order.paymentStatus = paymentStatus;
        if (paymentStatus === 'paid' && !order.paymentPaidAt) order.paymentPaidAt = now;
    }

    if (previousOrderStatus !== order.orderStatus) {
        order.statusHistory.push({
            domain: 'order',
            status: order.orderStatus,
            previousStatus: previousOrderStatus,
            actorType: adminId ? 'admin' : 'system',
            actor: adminId,
            timestamp: now,
        });
    }

    if (typeof order.save === 'function') {
        await order.save();
    }

    if (typeof order.populate === 'function') {
        try {
            await order.populate('rider', 'name phone isActive');
        } catch (_) { }
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
export const assignRiderToOrder = async (orderId, riderId, adminId = null, note = '') => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found');
    }

    if (['completed', 'cancelled', 'expired'].includes(order.orderStatus)) {
        throw new BadRequestError(`Cannot assign a rider to a ${order.orderStatus} order.`);
    }

    if (riderId && !mongoose.Types.ObjectId.isValid(riderId)) {
        throw new BadRequestError('Invalid rider ID format');
    }

    if (riderId && order.rider?.toString() === riderId.toString()) {
        if (['failed', 'rejected', 'delivered'].includes(order.riderStatus)) {
            throw new BadRequestError('Choose a different rider to replace this delivery assignment.');
        }
        await order.populate('rider', 'name phone email isActive availability');
        emitRiderAssigned(order);
        return order;
    }

    const now = new Date();
    const previousRiderId = order.rider?.toString();
    const previousRiderStatus = order.riderStatus;
    const wasInDelivery = order.riderHandoffRequired || ['picked_up', 'out_for_delivery'].includes(previousRiderStatus);
    if (order.rider) {
        const previousAssignment = [...(order.riderAssignmentHistory || [])].reverse()
            .find((entry) => entry.rider.toString() === order.rider.toString() && !entry.unassignedAt);
        if (previousAssignment) previousAssignment.unassignedAt = now;
        else {
            order.riderAssignmentHistory.push({
                rider: order.rider,
                assignedBy: 'admin',
                assignedAt: order.updatedAt || order.createdAt || now,
                unassignedAt: now,
            });
        }
    }

    if (!riderId) {
        order.rider = null;
        order.riderStatus = 'pending';
        order.riderHandoffRequired = wasInDelivery;
        order.riderLocation = { latitude: null, longitude: null, updatedAt: null };
        order.routeEta = { durationSeconds: null, calculatedAt: null };
        if (adminId) {
            order.deliveryRecoveryHistory.push({
                action: 'reassign_rider',
                actor: adminId,
                note: note.trim() || 'Rider removed by admin for reassignment.',
                rider: previousRiderId,
                previousRiderStatus: wasInDelivery ? previousRiderStatus : null,
                previousOrderStatus: order.orderStatus,
                timestamp: now,
            });
        }
        order.statusHistory.push({
            domain: 'assignment',
            status: 'unassigned',
            previousStatus: previousRiderStatus,
            actorType: adminId ? 'admin' : 'system',
            actor: adminId,
            note: note.trim() || null,
            timestamp: now,
        });
        await order.save();
        await refreshPreviousRiderAvailability(previousRiderId);
        if (previousRiderId) {
            getIO()?.to(`rider:${previousRiderId}`).emit('rider:assignment_updated', {
                orderId: order._id.toString(),
                riderId: null,
                riderStatus: order.riderStatus,
                orderStatus: order.orderStatus,
            });
        }
        getIO()?.to('admin:orders').emit('rider:assignment_updated', {
            orderId: order._id.toString(), riderId: null, riderStatus: order.riderStatus,
            orderStatus: order.orderStatus, riderHandoffRequired: order.riderHandoffRequired,
        });
        return order;
    }

    const rider = await Rider.findById(riderId);
    if (!rider) throw new NotFoundError('Rider not found');
    if (!rider.isActive) throw new BadRequestError('This rider is inactive and cannot be assigned to an order.');
    if (rider.availability !== 'available') {
        throw new BadRequestError('Only available riders can receive new assignments.');
    }
    const otherAssignments = await Order.countDocuments({
        _id: { $ne: order._id },
        rider: rider._id,
        riderStatus: { $in: ['pending', 'accepted', 'picked_up', 'out_for_delivery'] },
    });
    if (otherAssignments > 0) throw new BadRequestError('This rider already has an active assignment.');
    const reservedRider = await Rider.findOneAndUpdate(
        { _id: rider._id, isActive: true, availability: 'available' },
        { $set: { availability: 'busy' } },
        { new: true }
    );
    if (!reservedRider) throw new BadRequestError('This rider is no longer available for assignment.');

    order.rider = rider._id;
    order.riderStatus = 'pending';
    order.riderHandoffRequired = wasInDelivery;
    order.riderLocation = { latitude: null, longitude: null, updatedAt: null };
    order.routeEta = { durationSeconds: null, calculatedAt: null };
    order.riderAssignmentHistory.push({
        rider: rider._id,
        assignedBy: 'admin',
        assignedById: adminId,
        assignedAt: now,
        responseDeadline: new Date(now.getTime() + config.riderAssignmentTimeoutMinutes * 60 * 1000),
    });
    if (adminId) {
        order.deliveryRecoveryHistory.push({
            action: 'reassign_rider',
            actor: adminId,
            note: note.trim() || (wasInDelivery ? 'Rider reassigned during an active delivery.' : 'Rider assigned by admin.'),
            rider: rider._id,
            previousRiderStatus: wasInDelivery ? previousRiderStatus : null,
            previousOrderStatus: order.orderStatus,
            timestamp: now,
        });
    }
    order.statusHistory.push({
        domain: 'assignment',
        status: 'pending',
        previousStatus: previousRiderStatus,
        actorType: adminId ? 'admin' : 'system',
        actor: adminId,
        note: note.trim() || null,
        timestamp: now,
    });
    try {
        await order.save();
    } catch (error) {
        await Rider.updateOne({ _id: rider._id, availability: 'busy' }, { $set: { availability: 'available' } });
        throw error;
    }
    await refreshPreviousRiderAvailability(previousRiderId);
    if (previousRiderId) {
        getIO()?.to(`rider:${previousRiderId}`).emit('rider:assignment_updated', {
            orderId: order._id.toString(),
            riderId: null,
            riderStatus: 'pending',
            orderStatus: order.orderStatus,
        });
    }
    getIO()?.to('admin:orders').emit('rider:availability_changed', {
        riderId: rider._id.toString(),
        availability: 'busy',
        activeAssignments: 1,
    });
    getIO()?.to(`rider:${rider._id}`).emit('rider:availability_changed', {
        riderId: rider._id.toString(),
        availability: 'busy',
        activeAssignments: 1,
    });
    await order.populate('rider', 'name phone email isActive availability');
    const populated = order;
    try {
        emitRiderAssigned(populated);
    } catch (err) {
        console.error('[OrderService] emitRiderAssigned error:', err.message);
    }
    const activeAssignment = [...(populated.riderAssignmentHistory || [])].reverse()
        .find((assignment) => assignment.rider.toString() === rider._id.toString() && !assignment.unassignedAt);
    const assignmentId = activeAssignment
        ? `${populated._id}:${rider._id}:${new Date(activeAssignment.assignedAt).getTime()}`
        : null;
    const riderHasSocket = Boolean(getIO()?.sockets.adapter.rooms.get(`rider:${rider._id}`)?.size);
    if (!riderHasSocket) {
        sendRiderPushNotification({
            riderId: rider._id,
            title: 'New delivery assigned',
            body: `Order ${populated.orderNumber} requires your acceptance.`,
            url: `/rider/dashboard?order=${populated._id}`,
            data: {
                event: 'rider_assignment',
                assignmentId,
                orderId: populated._id.toString(),
            },
        }).catch((error) => console.error('[RiderPush] Unable to send assignment alert:', error.message));
    }
    return populated;
};

export const recoverDeliveryOrder = async (orderId, adminId, { action, note, verified = false }) => {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order not found.');
    if (!['contact_rider', 'contact_customer', 'mark_delivered', 'cancel_order'].includes(action)) {
        throw new BadRequestError('Unsupported delivery recovery action.');
    }
    if (['completed', 'cancelled', 'expired'].includes(order.orderStatus)) {
        throw new BadRequestError('This order is already in a terminal state.');
    }
    if (action === 'mark_delivered') {
        if (
            order.orderStatus !== 'out_for_delivery'
            || !['out_for_delivery', 'failed'].includes(order.riderStatus)
        ) {
            throw new BadRequestError('Only an order currently out for delivery can be verified as delivered.');
        }
        if (verified !== true) throw new BadRequestError('Confirm delivery verification before marking this order delivered.');
    }

    const now = new Date();
    const riderId = order.rider?._id || order.rider || null;
    const historyEntry = {
        action,
        actor: adminId,
        note: note.trim(),
        rider: riderId,
        previousRiderStatus: order.riderStatus,
        previousOrderStatus: order.orderStatus,
        timestamp: now,
    };
    const update = {
        $push: {
            deliveryRecoveryHistory: historyEntry,
            statusHistory: {
                domain: 'recovery',
                status: action,
                previousStatus: order.riderStatus,
                actorType: 'admin',
                actor: adminId,
                note: note.trim(),
                timestamp: now,
            },
        },
    };
    const updateOptions = { new: true, runValidators: true };
    if (action === 'mark_delivered') {
        update.$set = {
            orderStatus: 'completed',
            riderStatus: 'delivered',
            riderLocation: { latitude: null, longitude: null, updatedAt: null },
            routeEta: { durationSeconds: null, calculatedAt: null },
        };
    } else if (action === 'cancel_order') {
        update.$set = {
            orderStatus: 'cancelled',
            riderStatus: 'failed',
            rider: null,
            riderLocation: { latitude: null, longitude: null, updatedAt: null },
            routeEta: { durationSeconds: null, calculatedAt: null },
            riderHandoffRequired: false,
        };
        if (riderId) {
            const activeAssignment = [...(order.riderAssignmentHistory || [])].reverse()
                .find((entry) => entry.rider.toString() === riderId.toString() && !entry.unassignedAt);
            if (activeAssignment) {
                update.$set['riderAssignmentHistory.$[assignment].unassignedAt'] = now;
                updateOptions.arrayFilters = [{
                    'assignment.rider': riderId,
                    'assignment.unassignedAt': null,
                }];
            }
        }
    }

    const updatedOrder = await Order.findOneAndUpdate(
        {
            _id: order._id,
            orderStatus: order.orderStatus,
            riderStatus: order.riderStatus,
            rider: riderId,
        },
        update,
        updateOptions
    );
    if (!updatedOrder) throw new ConflictError('The order changed while this recovery action was being recorded. Refresh and try again.');

    if (action === 'mark_delivered') {
        await refreshPreviousRiderAvailability(riderId);
        emitOrderStatusChanged(updatedOrder);
    } else if (action === 'cancel_order') {
        await refreshPreviousRiderAvailability(riderId);
        emitOrderCancelled(updatedOrder, riderId);
        if (riderId) {
            const rider = await Rider.findById(riderId).select('name').lean();
            await createRiderNotification({
                recipientType: 'rider',
                rider: { _id: riderId, name: rider?.name || 'Rider' },
                order: order._id,
                event: 'order_cancelled',
                message: `Admin cancelled order ${order.orderNumber}.`,
                dedupeKey: `order-cancelled:${order._id}`,
            });
        }
    }
    return getAdminOrderById(updatedOrder._id);
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
        order.statusHistory.push({
            domain: 'order',
            status: 'expired',
            previousStatus: 'placed',
            actorType: 'system',
            timestamp: now,
        });
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
    order.statusHistory.push({
        domain: 'order',
        status: 'cancelled',
        previousStatus: 'placed',
        actorType: 'customer',
        actor: customerId,
        timestamp: now,
    });
    await order.save();

    if (order.discount?.discountId) {
        await rollbackDiscountUsage(order.discount.discountId, order.customer, order.discount.amount);
    }

    try {
        emitOrderCancelled(order);
    } catch (emitErr) {
        console.error('[OrderService] emitOrderCancelled error:', emitErr.message);
    }
    if (order.rider) {
        const rider = await Rider.findById(order.rider).select('name').lean();
        await createRiderNotification({
            recipientType: 'rider',
            rider: { _id: order.rider, name: rider?.name || 'Rider' },
            order: order._id,
            event: 'order_cancelled',
            message: `Customer cancelled order ${order.orderNumber}.`,
            dedupeKey: `order-cancelled:${order._id}`,
        });
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
