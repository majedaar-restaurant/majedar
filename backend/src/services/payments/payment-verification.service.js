import mongoose from 'mongoose';
import { PaymentAttempt } from '../../models/Payment.js';
import { Order } from '../../models/Order.js';
import { Customer } from '../../models/Customer.js';
import {
    createRazorpayOrder,
    verifyPaymentSignature,
    verifyWebhookSignature,
    fetchRazorpayPayment,
    createRazorpayRefund,
    rupeesToPaise,
} from './razorpay.service.js';
import {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
    ConflictError,
    AppError,
    UnauthorizedError,
} from '../../utils/errors.js';
import { config } from '../../config/env.js';
import { isOnlinePaymentEnabled } from '../../config/restaurant.config.js';
import { sendAdminPushNotification } from '../notifications/admin-push.service.js';
import { emitPaymentSuccess } from '../../socket/socket.server.js';
import { getDateRangeFilter } from '../../utils/date-filter.js';

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Fetch an order and verify it belongs to the given customer.
 * Throws ForbiddenError if ownership check fails.
 */
const getOwnedOrder = async (customerId, orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new BadRequestError('Invalid order ID format.');
    }
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('Order not found.');
    }
    if (order.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You do not have permission to access this order.');
    }
    return order;
};

/**
 * Trigger payment received push notification with strict duplicate protection.
 *
 * @param {string|mongoose.Types.ObjectId} attemptId
 * @param {string} orderNumber
 * @param {number} amountInPaise
 */
const triggerPaymentPushNotification = async (attemptId, orderNumber, amountInPaise) => {
    try {
        if (mongoose.connection?.readyState === 1) {
            const claimed = await PaymentAttempt.findOneAndUpdate(
                { _id: attemptId, pushNotificationSent: false },
                { pushNotificationSent: true },
                { new: true }
            );

            if (claimed) {
                const amountInRupees = (amountInPaise / 100).toFixed(2);

                try {
                    emitPaymentSuccess({
                        orderId: claimed.order,
                        orderNumber,
                        amount: amountInPaise / 100,
                    });
                } catch (socketErr) {
                    console.error('[PaymentService] Socket emission error for payment:', socketErr.message);
                }

                sendAdminPushNotification({
                    type: 'PAYMENT_RECEIVED',
                    title: 'Payment Received — Majedaar',
                    body: `₹${amountInRupees} received for Order #${orderNumber}`,
                    url: '/dashboard/payments',
                    data: {
                        attemptId: attemptId.toString(),
                        orderNumber,
                        amount: amountInPaise / 100,
                    },
                }).catch((err) => {
                    console.error('[PaymentService] Push notification delivery failed:', err.message);
                });
            }
        }
    } catch (err) {
        console.error('[PaymentService] Push notification claim error:', err.message);
    }
};

/**
 * Validate that an order is eligible for payment initiation.
 * Rules:
 *  - Must use razorpay payment method
 *  - Must not already be paid
 *  - Must not be cancelled or completed
 */
const assertOrderPayable = (order) => {
    if (order.paymentMethod !== 'razorpay' && order.paymentMethod !== 'cod') {
        throw new BadRequestError('This order is not eligible for online payment.');
    }
    if (order.paymentStatus === 'paid') {
        throw new ConflictError('This order has already been paid.');
    }
    if (order.orderStatus === 'cancelled') {
        throw new BadRequestError('Cannot initiate payment for a cancelled order.');
    }
    if (order.orderStatus === 'completed') {
        throw new BadRequestError('Cannot initiate payment for a completed order.');
    }
    if (order.orderStatus === 'expired') {
        throw new BadRequestError('Cannot initiate payment for an expired order.');
    }
    if (!isOnlinePaymentEnabled()) {
        throw new BadRequestError('Online payment is currently unavailable. Please choose Cash on Delivery.');
    }
};

// ─────────────────────────────────────────────────────────
// PUBLIC SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Initiate payment for an existing application Order.
 *
 * Flow:
 *   1. Validate order ownership + eligibility
 *   2. Create Razorpay Order (backend-authoritative amount)
 *   3. Create PaymentAttempt record
 *   4. Return config for frontend Razorpay Checkout
 *
 * @param {string} customerId
 * @param {string} orderId - Application Order ID
 * @returns {Object} Razorpay checkout config (razorpayKeyId, razorpayOrderId, amount, currency, applicationOrderId)
 */
export const initiatePayment = async (customerId, orderId) => {
    const order = await getOwnedOrder(customerId, orderId);
    assertOrderPayable(order);

    // Backend is sole source of truth — use order.total always
    const amountInPaise = rupeesToPaise(order.total);

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder(
        amountInPaise,
        'INR',
        order._id.toString()
    );

    // Create PaymentAttempt record
    const attempt = await PaymentAttempt.create({
        order: order._id,
        customer: customerId,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
    });

    return {
        razorpayKeyId: config.razorpay.keyId,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        applicationOrderId: order._id.toString(),
        attemptId: attempt._id.toString(),
        orderNumber: order.orderNumber,
    };
};

/**
 * Verify a completed Razorpay payment and mark the order as paid.
 *
 * Security requirements (all must pass):
 *  - HMAC signature must be valid
 *  - razorpayOrderId must match a known PaymentAttempt
 *  - PaymentAttempt must belong to the correct application Order
 *  - Customer must own the Order
 *  - Order must not already be paid
 *  - Amount must match what was originally computed
 *  - Payment must not already have been verified (idempotency)
 *
 * @param {string} customerId
 * @param {Object} payload
 * @param {string} payload.razorpayOrderId
 * @param {string} payload.razorpayPaymentId
 * @param {string} payload.razorpaySignature
 * @returns {Object} Updated order
 */
export const verifyPayment = async (customerId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    // 1. Find PaymentAttempt by Razorpay Order ID
    const attempt = await PaymentAttempt.findOne({ razorpayOrderId });
    if (!attempt) {
        throw new NotFoundError('Payment attempt not found.');
    }

    // 2. Verify customer ownership
    if (attempt.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You do not have permission to verify this payment.');
    }

    // 3. Idempotency: already paid attempts are not reprocessed
    if (attempt.status === 'paid') {
        const order = await Order.findById(attempt.order);
        return order;
    }

    // 4. Verify application order ownership and state
    const order = await Order.findById(attempt.order);
    if (!order) throw new NotFoundError('Associated order not found.');
    if (order.customer.toString() !== customerId.toString()) {
        throw new ForbiddenError('You do not have permission to verify this payment.');
    }
    if (order.paymentStatus === 'paid') {
        throw new ConflictError('This order has already been paid.');
    }
    if (order.orderStatus === 'cancelled') {
        throw new BadRequestError('Cannot verify payment for a cancelled order.');
    }

    // 5. Cryptographic signature verification — MUST happen before any state change
    const isValidSignature = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValidSignature) {
        // Mark this attempt as failed
        await PaymentAttempt.findByIdAndUpdate(attempt._id, {
            status: 'failed',
            failureReason: 'Invalid payment signature',
        });
        throw new BadRequestError('Payment verification failed. Invalid signature.');
    }

    // 6. Update PaymentAttempt → paid
    await PaymentAttempt.findByIdAndUpdate(attempt._id, {
        status: 'paid',
        razorpayPaymentId,
        razorpaySignature, // stored for audit, never exposed via toJSON
        webhookProcessed: true, // frontend verified, no need for webhook to re-process
    });

    // 7. Update application Order paymentStatus → paid and paymentMethod → razorpay
    order.paymentStatus = 'paid';
    order.paymentMethod = 'razorpay';
    await order.save();

    // Trigger payment received push notification (idempotent, duplicate protected)
    triggerPaymentPushNotification(attempt._id, order.orderNumber, attempt.amount);

    return order;
};

/**
 * Create a new payment attempt for an existing application Order (retry flow).
 *
 * Rules:
 *  - Verify customer owns the order
 *  - Verify order is still payable (not paid/cancelled/completed)
 *  - Create fresh Razorpay Order + PaymentAttempt
 *  - Old failed attempts are preserved
 *
 * @param {string} customerId
 * @param {string} orderId - Application Order ID
 * @returns {Object} Razorpay checkout config
 */
export const retryPayment = async (customerId, orderId) => {
    const order = await getOwnedOrder(customerId, orderId);
    assertOrderPayable(order);

    // Recalculate authoritative amount from current order total
    const amountInPaise = rupeesToPaise(order.total);

    // Create NEW Razorpay Order — never reuse an old failed one
    const razorpayOrder = await createRazorpayOrder(
        amountInPaise,
        'INR',
        order._id.toString()
    );

    // Create NEW PaymentAttempt
    const attempt = await PaymentAttempt.create({
        order: order._id,
        customer: customerId,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
    });

    return {
        razorpayKeyId: config.razorpay.keyId,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        applicationOrderId: order._id.toString(),
        attemptId: attempt._id.toString(),
        orderNumber: order.orderNumber,
    };
};

/**
 * Handle incoming Razorpay webhook events.
 *
 * Security:
 *  - Signature is verified with HMAC SHA256 using webhook secret
 *  - Must receive RAW request body (Buffer)
 *  - Processing is idempotent (safe for duplicate delivery)
 *  - Out-of-order events are handled safely
 *
 * Handled events:
 *  - payment.captured → mark attempt + order as paid
 *  - payment.failed   → mark attempt as failed
 *  - order.paid       → mark order paid (backup)
 *
 * @param {Buffer} rawBody - Unparsed request body
 * @param {string} razorpaySignature - Value of x-razorpay-signature header
 */
export const handleWebhookEvent = async (rawBody, razorpaySignature) => {
    // 1. Verify webhook signature — reject unverified payloads
    const isValid = verifyWebhookSignature(rawBody, razorpaySignature);
    if (!isValid) {
        throw new UnauthorizedError('Invalid webhook signature.');
    }

    let event;
    try {
        event = JSON.parse(rawBody.toString('utf8'));
    } catch {
        throw new BadRequestError('Invalid webhook payload.');
    }

    const eventType = event.event;
    const payload = event.payload;

    if (eventType === 'payment.captured') {
        await handlePaymentCaptured(payload);
    } else if (eventType === 'payment.failed') {
        await handlePaymentFailed(payload);
    } else if (eventType === 'order.paid') {
        await handleOrderPaid(payload);
    }
    // Unknown events are ignored silently — safe for future Razorpay event additions
};

/**
 * Handle payment.captured webhook event.
 * Idempotent: checks webhookProcessed flag before processing.
 */
const handlePaymentCaptured = async (payload) => {
    const razorpayPaymentId = payload?.payment?.entity?.id;
    const razorpayOrderId = payload?.payment?.entity?.order_id;
    const method = payload?.payment?.entity?.method;

    if (!razorpayPaymentId || !razorpayOrderId) return;

    // Use findOneAndUpdate for atomic idempotency — only process once
    const attempt = await PaymentAttempt.findOneAndUpdate(
        { razorpayOrderId, webhookProcessed: false, status: { $ne: 'paid' } },
        {
            status: 'paid',
            razorpayPaymentId,
            method: method || null,
            webhookProcessed: true,
            webhookEvent: 'payment.captured',
        },
        { new: true }
    );

    if (!attempt) return; // Already processed or not found — idempotent

    // Update the application Order payment status and payment method
    const order = await Order.findByIdAndUpdate(
        attempt.order,
        { paymentStatus: 'paid', paymentMethod: 'razorpay' },
        { new: true }
    );

    if (order) {
        triggerPaymentPushNotification(attempt._id, order.orderNumber, attempt.amount);
    }
};

/**
 * Handle payment.failed webhook event.
 */
const handlePaymentFailed = async (payload) => {
    const razorpayPaymentId = payload?.payment?.entity?.id;
    const razorpayOrderId = payload?.payment?.entity?.order_id;
    const errorDescription = payload?.payment?.entity?.error_description;

    if (!razorpayOrderId) return;

    await PaymentAttempt.findOneAndUpdate(
        { razorpayOrderId, webhookProcessed: false, status: { $nin: ['paid', 'failed'] } },
        {
            status: 'failed',
            razorpayPaymentId: razorpayPaymentId || null,
            failureReason: 'Payment failed', // Safe user-facing message; internal details not stored
            webhookProcessed: true,
            webhookEvent: 'payment.failed',
        }
    );
};

/**
 * Handle order.paid webhook event (backup handler).
 */
const handleOrderPaid = async (payload) => {
    const razorpayOrderId = payload?.order?.entity?.id;
    if (!razorpayOrderId) return;

    const attempt = await PaymentAttempt.findOneAndUpdate(
        { razorpayOrderId, webhookProcessed: false, status: { $ne: 'paid' } },
        {
            status: 'paid',
            webhookProcessed: true,
            webhookEvent: 'order.paid',
        },
        { new: true }
    );

    if (!attempt) return;

    const order = await Order.findByIdAndUpdate(
        attempt.order,
        { paymentStatus: 'paid', paymentMethod: 'razorpay' },
        { new: true }
    );

    if (order) {
        triggerPaymentPushNotification(attempt._id, order.orderNumber, attempt.amount);
    }
};

export const getAllPaymentAttempts = async (filters = {}) => {
    // Authoritative scope: ONLY paid payments
    const matchQuery = { paymentStatus: 'paid' };

    // Method filter: 'cod' (Cash / COD), 'razorpay' (Online)
    const rawMethod = (filters.paymentMethod || filters.method || '').toLowerCase().trim();
    if (rawMethod === 'cod' || rawMethod === 'cash') {
        matchQuery.paymentMethod = 'cod';
    } else if (rawMethod === 'razorpay' || rawMethod === 'online') {
        matchQuery.paymentMethod = 'razorpay';
    }

    // Apply server-side date filter (Today, This Week, or Custom Range in IST)
    const dateFilter = getDateRangeFilter({
        datePreset: filters.datePreset,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        fieldName: 'createdAt',
    });
    Object.assign(matchQuery, dateFilter);

    // Apply search across Order #, Customer (name/email/phone), and Razorpay ID
    if (filters.search && filters.search.trim()) {
        const s = filters.search.trim();
        const escaped = s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        let customerIds = [];
        let onlineOrderIdsFromRzp = [];
        try {
            const [matchingCusts, matchingAttempts] = await Promise.all([
                Customer.find({ $or: [{ name: regex }, { email: regex }, { phone: regex }] }).select('_id').lean(),
                PaymentAttempt.find({ $or: [{ razorpayPaymentId: regex }, { razorpayOrderId: regex }] }).select('order').lean(),
            ]);
            customerIds = (matchingCusts || []).map((c) => c._id);
            onlineOrderIdsFromRzp = (matchingAttempts || []).map((a) => a.order).filter(Boolean);
        } catch (_) { }

        matchQuery.$and = matchQuery.$and || [];
        matchQuery.$and.push({
            $or: [
                { orderNumber: regex },
                ...(customerIds.length > 0 ? [{ customer: { $in: customerIds } }] : []),
                ...(onlineOrderIdsFromRzp.length > 0 ? [{ _id: { $in: onlineOrderIdsFromRzp } }] : []),
            ],
        });
    }

    // MongoDB Aggregation for Authoritative Financial Summary (Calculated on ALL matching records, NOT just current page)
    const summaryAgg = await Order.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
                totalPaid: { $sum: '$total' },
                cashTotal: {
                    $sum: {
                        $cond: [{ $eq: ['$paymentMethod', 'cod'] }, '$total', 0],
                    },
                },
                onlineTotal: {
                    $sum: {
                        $cond: [{ $eq: ['$paymentMethod', 'razorpay'] }, '$total', 0],
                    },
                },
            },
        },
    ]);

    const rawSummary = summaryAgg[0] || { count: 0, totalPaid: 0, cashTotal: 0, onlineTotal: 0 };
    const summary = {
        totalPaid: Math.round((rawSummary.totalPaid || 0) * 100) / 100,
        cashTotal: Math.round((rawSummary.cashTotal || 0) * 100) / 100,
        onlineTotal: Math.round((rawSummary.onlineTotal || 0) * 100) / 100,
        count: rawSummary.count || 0,
    };

    const total = summary.count;
    const page = Math.max(parseInt(filters.page, 10) || 1, 1);
    const limit = Math.min(parseInt(filters.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Fetch paginated paid orders
    const orders = await Order.find(matchQuery)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Map online payment attempts for Razorpay transaction details
    const onlineOrderIds = orders.filter((o) => o.paymentMethod === 'razorpay').map((o) => o._id);
    const attemptsMap = new Map();
    if (onlineOrderIds.length > 0) {
        const attempts = await PaymentAttempt.find({
            order: { $in: onlineOrderIds },
            status: 'paid',
        }).lean();
        for (const a of attempts) {
            attemptsMap.set(a.order.toString(), a);
        }
    }

    const records = orders.map((ord) => {
        const isOnline = ord.paymentMethod === 'razorpay';
        const attempt = isOnline ? attemptsMap.get(ord._id.toString()) : null;
        const transId = isOnline
            ? (attempt?.razorpayPaymentId || attempt?.razorpayOrderId || `RZP-${ord.orderNumber}`)
            : `COD-${ord.orderNumber}`;

        return {
            _id: attempt?._id || ord._id,
            orderId: ord._id,
            orderNumber: ord.orderNumber,
            order: {
                _id: ord._id,
                orderNumber: ord.orderNumber,
                total: ord.total,
                paymentMethod: ord.paymentMethod,
                paymentStatus: ord.paymentStatus,
                orderStatus: ord.orderStatus,
            },
            customer: ord.customer
                ? {
                    _id: ord.customer._id,
                    name: ord.customer.name,
                    email: ord.customer.email,
                    phone: ord.customer.phone,
                }
                : null,
            paymentMethod: ord.paymentMethod,
            methodDisplay: isOnline ? 'Online' : 'Cash / COD',
            method: attempt?.method || (isOnline ? 'Online' : 'Cash / COD'),
            transactionId: transId,
            razorpayPaymentId: attempt?.razorpayPaymentId || null,
            razorpayOrderId: attempt?.razorpayOrderId || null,
            amount: ord.total,
            amountInPaise: Math.round(ord.total * 100),
            status: 'paid',
            createdAt: ord.createdAt,
            paidAt: attempt?.updatedAt || ord.updatedAt || ord.createdAt,
            refundId: attempt?.refundId || null,
            refundAmount: attempt?.refundAmount || null,
            refundStatus: attempt?.refundStatus || null,
        };
    });

    return {
        records,
        attempts: records,
        summary,
        total,
        page,
        limit,
        totalPages,
        pagination: {
            total,
            page,
            limit,
            totalPages,
        },
    };
};

/**
 * Get all payment attempts for a specific order (admin view).
 * Useful to see Attempt 1 → failed, Attempt 2 → paid, etc.
 *
 * @param {string} orderId
 * @returns {Promise<Array<PaymentAttempt>>}
 */
export const getPaymentAttemptsByOrder = async (orderId) => {
    return PaymentAttempt.find({ order: orderId })
        .populate('customer', 'name email phone')
        .sort({ createdAt: 1 }); // chronological order
};

/**
 * Initiate a refund for a paid PaymentAttempt.
 *
 * Security:
 *  - Only paid attempts can be refunded
 *  - Amount is validated against original payment amount
 *  - Refund is idempotent (checks refundId before initiating)
 *  - Amount comes from admin request, capped at original payment amount
 *
 * @param {string} paymentAttemptId
 * @param {number} amountInPaise - Amount to refund (in paise)
 * @returns {Promise<PaymentAttempt>} Updated attempt
 */
export const initiateRefund = async (paymentAttemptId, amountInPaise) => {
    const attempt = await PaymentAttempt.findById(paymentAttemptId);
    if (!attempt) throw new NotFoundError('Payment attempt not found.');
    if (attempt.status !== 'paid') {
        throw new BadRequestError('Only successfully paid payments can be refunded.');
    }
    if (!attempt.razorpayPaymentId) {
        throw new BadRequestError('No Razorpay payment ID associated with this attempt.');
    }

    // Prevent duplicate refunds
    if (attempt.refundId) {
        throw new ConflictError('A refund has already been initiated for this payment.');
    }

    const refundAmount = Math.round(amountInPaise);
    if (refundAmount <= 0 || refundAmount > attempt.amount) {
        throw new BadRequestError(
            `Refund amount must be between 1 and ${attempt.amount} paise (original payment amount).`
        );
    }

    const refund = await createRazorpayRefund(attempt.razorpayPaymentId, refundAmount);

    // Update attempt with refund details
    const isFullRefund = refundAmount >= attempt.amount;
    attempt.refundId = refund.id;
    attempt.refundAmount = refundAmount;
    attempt.refundStatus = refund.status;
    attempt.status = isFullRefund ? 'refunded' : attempt.status;
    await attempt.save();

    // Update order paymentStatus if fully refunded
    if (isFullRefund) {
        await Order.findByIdAndUpdate(attempt.order, { paymentStatus: 'refunded' });
    }

    return attempt;
};
