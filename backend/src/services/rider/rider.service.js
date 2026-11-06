import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Rider } from '../../models/Rider.js';
import { Order } from '../../models/Order.js';
import { RiderNotification } from '../../models/RiderNotification.js';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../../utils/errors.js';
import { emitPaymentSuccess, getIO } from '../../socket/socket.server.js';
import { config } from '../../config/env.js';
import { createRiderNotification } from './rider-notification.service.js';

const terminal = ['delivered', 'failed', 'rejected'];
const activeStatuses = ['pending', 'accepted', 'picked_up', 'out_for_delivery'];
const busyStatuses = activeStatuses;

const riderIdOf = (value) => (value?._id || value)?.toString();

const notify = async ({ recipientType, rider, order = null, event, message, dedupeKey }) =>
    createRiderNotification({ recipientType, rider, order, event, message, dedupeKey });

const emitDeliveryUpdate = (order, event = 'rider:delivery_updated') => {
    const io = getIO();
    if (!io || !order) return;
    const orderId = order._id.toString();
    const payload = {
        orderId,
        orderNumber: order.orderNumber,
        riderId: order.rider?.toString?.() || null,
        riderStatus: order.riderStatus,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        riderLocation: order.riderLocation,
        routeEta: order.routeEta,
        deliveryStartedAt: order.deliveryStartedAt,
        deliveryDurationMinutes: order.deliveryStartedAt
            ? Math.max(0, Math.floor((Date.now() - new Date(order.deliveryStartedAt).getTime()) / 60000))
            : null,
        deliveryOverdue: order.orderStatus === 'out_for_delivery'
            && Boolean(order.deliveryStartedAt)
            && Date.now() >= new Date(order.deliveryStartedAt).getTime() + config.deliveryOverdueMinutes * 60000,
        riderHandoffRequired: order.riderHandoffRequired,
        updatedAt: order.updatedAt || new Date(),
    };
    io.to(`order:${orderId}`).emit(event, payload);
    io.to('admin:orders').emit(event, payload);
    if (order.rider) io.to(`rider:${order.rider}`).emit(event, payload);
};

const loadOrder = async (orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new BadRequestError('Invalid order ID format.');
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order not found.');
    return order;
};

const assertAssigned = (order, riderId) => {
    if (riderIdOf(order.rider) !== riderId.toString()) {
        throw new ForbiddenError('This order is not assigned to your rider account.');
    }
};

export const getAssignedOrders = async (riderId, { history = false } = {}) => {
    const filter = history
        ? {
            'riderAssignmentHistory.rider': riderId,
            $or: [{ rider: riderId }, { rider: null }],
        }
        : { rider: riderId, riderStatus: { $nin: terminal } };
    const orders = await Order.find(filter).sort({ updatedAt: -1 }).lean();
    const riderIdString = riderId.toString();
    return orders.map((order) => ({
        ...order,
        riderAssignmentHistory: (order.riderAssignmentHistory || [])
            .filter((entry) => riderIdOf(entry.rider) === riderIdString),
        riderDeliveryHistory: (order.riderDeliveryHistory || [])
            .filter((entry) => riderIdOf(entry.rider) === riderIdString),
        codCollections: (order.codCollections || []).map((entry) => (
            riderIdOf(entry.rider) === riderIdString
                ? entry
                : { ...entry, rider: null, verifiedBy: null }
        )),
    }));
};

export const setAvailability = async (riderId, availability) => {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new NotFoundError('Rider not found.');
    const previousAvailability = rider.availability;
    const activeCount = await Order.countDocuments({ rider: riderId, riderStatus: { $in: activeStatuses } });
    const busyCount = await Order.countDocuments({ rider: riderId, riderStatus: { $in: busyStatuses } });
    if (availability === 'busy' && busyCount === 0) {
        throw new ConflictError('Busy is only available while you have active assigned orders.');
    }
    if (availability === 'available' && busyCount > 0) {
        throw new ConflictError('Availability remains Busy while you have active assigned orders.');
    }
    rider.availability = availability;
    await rider.save();
    if (availability === 'unavailable' && activeCount > 0 && previousAvailability !== 'unavailable') {
        const activeOrder = await Order.findOne({
            rider: riderId,
            riderStatus: { $in: activeStatuses },
        }).select('_id');
        await notify({
            recipientType: 'admin',
            rider: riderId,
            order: activeOrder?._id,
            event: 'rider_unavailable_with_orders',
            message: `${rider.name} is unavailable with ${activeCount} active assigned order(s).`,
            dedupeKey: `unavailable:${riderId}:${activeOrder?._id}:${Date.now()}`,
        });
    }
    const io = getIO();
    if (io) io.to('admin:orders').emit('rider:availability_changed', {
        riderId: riderId.toString(), availability, activeAssignments: activeCount,
    });
    return { rider: rider.toJSON(), activeAssignments: activeCount };
};

export const respondToAssignment = async (riderId, orderId, { decision, reason }) => {
    const order = await loadOrder(orderId);
    assertAssigned(order, riderId);
    if (order.riderStatus !== 'pending') throw new ConflictError('This assignment has already been accepted or responded to.');
    const rider = await Rider.findById(riderId);
    if (decision === 'accept' && rider?.availability !== 'available') {
        const otherActiveOrders = await Order.countDocuments({
            rider: riderId,
            _id: { $ne: order._id },
            riderStatus: { $in: busyStatuses },
        });
        if (rider?.availability !== 'busy' || otherActiveOrders > 0) {
            throw new ConflictError('You must be Available to accept a new assignment.');
        }
    }

    const now = new Date();
    const update = {
        $set: { riderStatus: decision === 'accept' ? 'accepted' : 'rejected' },
        $push: {
            statusHistory: {
                domain: 'rider',
                status: decision === 'accept' ? 'accepted' : 'rejected',
                previousStatus: order.riderStatus,
                actorType: 'rider',
                actor: riderId,
                note: decision === 'reject' ? reason : null,
                timestamp: now,
            },
        },
    };
    const hasPendingAssignment = (order.riderAssignmentHistory || []).some((entry) =>
        riderIdOf(entry.rider) === riderId.toString() && !entry.acceptedAt && !entry.rejectedAt
    );
    if (hasPendingAssignment && decision === 'accept') {
        update.$set['riderAssignmentHistory.$[assignment].acceptedAt'] = now;
    } else if (hasPendingAssignment) {
        update.$set.rider = null;
        update.$set['riderAssignmentHistory.$[assignment].rejectedAt'] = now;
        update.$set['riderAssignmentHistory.$[assignment].rejectionReason'] = reason;
    } else {
        if (decision === 'reject') update.$set.rider = null;
        update.$push.riderAssignmentHistory = {
            rider: riderId,
            assignedBy: 'admin',
            assignedAt: order.updatedAt || order.createdAt || now,
            ...(decision === 'accept' ? { acceptedAt: now } : { rejectedAt: now, rejectionReason: reason }),
        };
    }
    const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, rider: riderId, riderStatus: 'pending' },
        update,
        {
            new: true,
            runValidators: true,
            ...(hasPendingAssignment ? {
                arrayFilters: [{ 'assignment.rider': riderId, 'assignment.acceptedAt': null, 'assignment.rejectedAt': null }],
            } : {}),
        }
    );
    if (!updatedOrder) throw new ConflictError('This assignment has already been responded to.');
    if (decision === 'accept' && rider) {
        rider.availability = 'busy';
        await rider.save();
    } else if (decision === 'reject' && rider) {
        const remaining = await Order.countDocuments({
            rider: riderId,
            riderStatus: { $in: busyStatuses },
        });
        if (remaining === 0 && rider.availability !== 'unavailable') {
            rider.availability = 'available';
            await rider.save();
        }
    }
    emitDeliveryUpdate(updatedOrder, 'rider:assignment_updated');
    const io = getIO();
    if (io && rider) {
        const activeAssignments = await Order.countDocuments({
            rider: riderId,
            riderStatus: { $in: activeStatuses },
        });
        io.to('admin:orders').emit('rider:availability_changed', {
            riderId: riderId.toString(),
            availability: rider.availability,
            activeAssignments,
        });
    }
    if (decision === 'reject') {
        const assignment = [...(updatedOrder.riderAssignmentHistory || [])].reverse()
            .find((entry) => riderIdOf(entry.rider) === riderId.toString());
        await notify({
            recipientType: 'admin',
            rider,
            order: updatedOrder._id,
            event: 'assignment_rejected',
            message: `${rider.name} rejected order ${updatedOrder.orderNumber}: ${reason}`,
            dedupeKey: `assignment-rejected:${updatedOrder._id}:${riderId}:${assignment?.assignedAt?.getTime?.() || now.getTime()}`,
        });
    }
    return updatedOrder;
};

export const updateDeliveryStatus = async (riderId, orderId, { status, reason, remarks, collection }) => {
    const order = await loadOrder(orderId);
    assertAssigned(order, riderId);
    const allowed = {
        picked_up: ['accepted'],
        out_for_delivery: ['picked_up'],
        delivered: ['out_for_delivery'],
        failed: ['out_for_delivery'],
    };
    if (!allowed[status]?.includes(order.riderStatus)) {
        throw new ConflictError(`Cannot change delivery from ${order.riderStatus} to ${status}.`);
    }
    if (status === 'picked_up' && order.orderStatus !== 'ready_for_pickup') {
        throw new ConflictError('The restaurant has not marked this order ready for pickup.');
    }
    if (status === 'failed' && (!reason || (reason === 'Other' && !remarks?.trim()))) {
        throw new BadRequestError('Choose a failure reason and provide remarks when selecting Other.');
    }
    if (status === 'delivered' && order.paymentMethod === 'cod') {
        const collected = order.codCollections.reduce((total, entry) => total + entry.amount, 0);
        const pending = order.paymentStatus === 'paid' ? 0 : Math.max(0, order.total - collected);
        if (pending > 0 && !collection) {
            throw new BadRequestError(`Confirm COD collection of ₹${pending.toFixed(2)} before marking this order delivered.`);
        }
        if (collection && Math.round(collection.amount * 100) !== Math.round(pending * 100)) {
            throw new BadRequestError(`Collect the outstanding COD balance of ₹${pending.toFixed(2)}.`);
        }
    } else if (collection) {
        throw new BadRequestError('COD collection details are only valid for a Cash on Delivery order.');
    }

    const now = new Date();
    const set = { riderStatus: status };
    if (['picked_up', 'out_for_delivery'].includes(status)) set.deliveryStartedAt = order.deliveryStartedAt || now;
    if (status === 'picked_up') set.riderHandoffRequired = false;
    if (status === 'out_for_delivery') set.orderStatus = 'out_for_delivery';
    if (status === 'failed') set.riderHandoffRequired = true;
    if (['delivered', 'failed'].includes(status)) {
        set.riderLocation = { latitude: null, longitude: null, updatedAt: null };
        set.routeEta = { durationSeconds: null, calculatedAt: null };
    }
    if (status === 'delivered') {
        set.orderStatus = 'completed';
        set.riderHandoffRequired = false;
        if (order.paymentMethod === 'cod') {
            set.paymentStatus = 'paid';
            if (order.paymentStatus !== 'paid') set.paymentPaidAt = now;
        }
    }
    const statusHistory = [{
        domain: 'rider',
        status,
        previousStatus: order.riderStatus,
        actorType: 'rider',
        actor: riderId,
        note: status === 'failed' ? (reason === 'Other' ? remarks.trim() : reason) : null,
        timestamp: now,
    }];
    if (status === 'delivered') {
        statusHistory.push({
            domain: 'order',
            status: 'completed',
            previousStatus: order.orderStatus,
            actorType: 'rider',
            actor: riderId,
            timestamp: now,
        });
    }
    if (status === 'out_for_delivery') {
        statusHistory.push({
            domain: 'order',
            status: 'out_for_delivery',
            previousStatus: order.orderStatus,
            actorType: 'rider',
            actor: riderId,
            timestamp: now,
        });
    }
    const push = {
        statusHistory: { $each: statusHistory },
    };
    if (status === 'delivered' && collection) {
        push.codCollections = {
            amount: collection.amount,
            method: collection.method,
            rider: riderId,
            collectedAt: now,
        };
    }
    const query = {
        _id: order._id,
        rider: riderId,
        riderStatus: { $in: allowed[status] },
        ...(status === 'picked_up' && !order.riderHandoffRequired ? { orderStatus: 'ready_for_pickup' } : {}),
    };
    if (status === 'delivered' && collection) {
        query.$expr = {
            $eq: [
                { $round: [{ $add: [{ $sum: { $ifNull: ['$codCollections.amount', []] } }, collection.amount] }, 2] },
                { $round: ['$total', 2] },
            ],
        };
    }
    const updatedOrder = await Order.findOneAndUpdate(
        query,
        { $set: set, $push: push },
        { new: true, runValidators: true }
    );
    if (!updatedOrder) throw new ConflictError('This delivery status changed. Refresh the order and try again.');
    const rider = await Rider.findById(riderId);
    const remaining = await Order.countDocuments({
        rider: riderId,
        _id: { $ne: updatedOrder._id },
        riderStatus: { $in: busyStatuses },
    });
    if (rider && ['delivered', 'failed'].includes(status) && remaining === 0 && rider.availability !== 'unavailable') {
        rider.availability = 'available';
        await rider.save();
    } else if (rider && ['picked_up', 'out_for_delivery'].includes(status)) {
        rider.availability = 'busy';
        await rider.save();
    }
    emitDeliveryUpdate(updatedOrder);
    if (status === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
        emitPaymentSuccess({
            orderId: updatedOrder._id,
            orderNumber: updatedOrder.orderNumber,
            amount: collection?.amount || 0,
        });
    }
    const io = getIO();
    if (io && rider) {
        const activeAssignments = await Order.countDocuments({
            rider: riderId,
            riderStatus: { $in: activeStatuses },
        });
        io.to('admin:orders').emit('rider:availability_changed', {
            riderId: riderId.toString(),
            availability: rider.availability,
            activeAssignments,
        });
    }
    if (status === 'failed') {
        await notify({
            recipientType: 'admin',
            rider: riderId,
            order: updatedOrder._id,
            event: 'delivery_failed',
            message: `Delivery for order ${updatedOrder.orderNumber} failed: ${reason === 'Other' ? remarks.trim() : reason}`,
            dedupeKey: `delivery-failed:${updatedOrder._id}:${riderId}:${now.getTime()}`,
        });
    }
    return updatedOrder;
};

export const recordCodCollection = async (riderId, orderId, collection) =>
    updateDeliveryStatus(riderId, orderId, { status: 'delivered', collection });

const computeRouteEta = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey || destination?.latitude == null || destination?.longitude == null) return null;
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration',
        },
        body: JSON.stringify({
            origin: { location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } } },
            destination: { location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } } },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
        }),
    });
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Google Routes API returned ${response.status}: ${details.slice(0, 300)}`);
    }
    const data = await response.json();
    const rawDuration = data.routes?.[0]?.duration;
    if (!rawDuration || !/^\d+(?:\.\d+)?s$/.test(rawDuration)) return null;
    return Math.ceil(Number.parseFloat(rawDuration.slice(0, -1)));
};

export const updateRiderLocation = async (riderId, orderId, coordinates) => {
    const order = await loadOrder(orderId);
    assertAssigned(order, riderId);
    if (!['picked_up', 'out_for_delivery'].includes(order.riderStatus)) {
        throw new ConflictError('Location sharing starts after the order is picked up.');
    }
    const updatedAt = new Date();
    let durationSeconds = null;
    try {
        durationSeconds = await computeRouteEta(coordinates, order.deliveryAddress?.location);
    } catch (error) {
        console.error('[RiderService] Unable to calculate route ETA:', error.message);
    }
    const routeEta = durationSeconds === null
        ? { durationSeconds: null, calculatedAt: null }
        : { durationSeconds, calculatedAt: updatedAt };
    const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, rider: riderId, riderStatus: { $in: ['picked_up', 'out_for_delivery'] } },
        { $set: { riderLocation: { ...coordinates, updatedAt }, routeEta } },
        { new: true, runValidators: true }
    );
    if (!updatedOrder) throw new ConflictError('Location sharing has stopped because this delivery is no longer active.');
    emitDeliveryUpdate(updatedOrder, 'rider:location_updated');
    return { riderLocation: updatedOrder.riderLocation, routeEta: updatedOrder.routeEta };
};

export const getRiderNotifications = async (riderId) => {
    const [notifications, unreadCount] = await Promise.all([
        RiderNotification.find({ recipientType: 'rider', rider: riderId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('order', 'orderNumber')
            .lean(),
        RiderNotification.countDocuments({ recipientType: 'rider', rider: riderId, readAt: null }),
    ]);
    return { notifications, unreadCount };
};

export const markRiderNotificationRead = async (riderId, notificationId) => {
    const result = await RiderNotification.updateOne(
        { _id: notificationId, recipientType: 'rider', rider: riderId, readAt: null },
        { $set: { readAt: new Date() } }
    );
    if (!result.matchedCount) throw new NotFoundError('Unread notification not found.');
    return { success: true };
};

export const getAdminRiderNotifications = async (riderId = null) => {
    const filter = riderId
        ? { rider: riderId, recipientType: { $in: ['admin', 'rider'] } }
        : { recipientType: 'admin' };
    const [notifications, unreadCount] = await Promise.all([
        RiderNotification.find(filter)
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('rider', 'name')
            .populate('order', 'orderNumber')
            .lean(),
        RiderNotification.countDocuments({ ...filter, readAt: null }),
    ]);
    return { notifications, unreadCount };
};

export const markAdminRiderNotificationRead = async (notificationId) => {
    const result = await RiderNotification.updateOne(
        { _id: notificationId, recipientType: { $in: ['admin', 'rider'] }, readAt: null },
        { $set: { readAt: new Date() } }
    );
    if (!result.matchedCount) throw new NotFoundError('Unread notification not found.');
    return { success: true };
};

export const processStaleRiderAssignments = async () => {
    const cutoff = new Date(Date.now() - config.riderAssignmentTimeoutMinutes * 60 * 1000);
    const orders = await Order.find({
        riderStatus: 'pending',
        rider: { $ne: null },
        riderAssignmentHistory: {
            $elemMatch: {
                assignedAt: { $lte: cutoff },
                acceptedAt: null,
                rejectedAt: null,
                timedOutAt: null,
                unassignedAt: null,
            },
        },
    }).select('orderNumber rider riderAssignmentHistory').lean();

    for (const order of orders) {
        const riderId = riderIdOf(order.rider);
        const assignment = [...(order.riderAssignmentHistory || [])].reverse().find((entry) =>
            riderIdOf(entry.rider) === riderId && !entry.acceptedAt && !entry.rejectedAt && !entry.timedOutAt && !entry.unassignedAt
        );
        if (!assignment) continue;
        const timedOutAt = new Date();
        const result = await Order.updateOne(
            {
                _id: order._id,
                riderStatus: 'pending',
                rider: order.rider,
                riderAssignmentHistory: {
                    $elemMatch: {
                        rider: order.rider,
                        assignedAt: assignment.assignedAt,
                        acceptedAt: null,
                        rejectedAt: null,
                        timedOutAt: null,
                        unassignedAt: null,
                    },
                },
            },
            {
                $set: { 'riderAssignmentHistory.$[assignment].timedOutAt': timedOutAt },
                $push: {
                    statusHistory: {
                        domain: 'assignment',
                        status: 'timed_out',
                        previousStatus: 'pending',
                        actorType: 'system',
                        note: `Rider did not respond within ${config.riderAssignmentTimeoutMinutes} minutes.`,
                        timestamp: timedOutAt,
                    },
                },
            },
            {
                arrayFilters: [{
                    'assignment.rider': order.rider,
                    'assignment.assignedAt': assignment.assignedAt,
                    'assignment.timedOutAt': null,
                    'assignment.unassignedAt': null,
                }],
            }
        );
        if (!result.modifiedCount) continue;
        const rider = await Rider.findById(order.rider).select('name').lean();
        await notify({
            recipientType: 'admin',
            rider: { _id: order.rider, name: rider?.name || 'Rider' },
            order: order._id,
            event: 'assignment_timeout',
            message: `${rider?.name || 'Rider'} has not responded to order ${order.orderNumber} within ${config.riderAssignmentTimeoutMinutes} minutes. Reassignment is available.`,
            dedupeKey: `assignment-timeout:${order._id}:${riderId}:${assignment.assignedAt.getTime()}`,
        });
        const io = getIO();
        io?.to('admin:orders').emit('rider:assignment_timeout', {
            orderId: order._id.toString(),
            riderId,
            timedOutAt,
        });
    }
};

export const verifyCodCollection = async (adminId, orderId, collectionIndex) => {
    const order = await loadOrder(orderId);
    if (order.paymentMethod !== 'cod') throw new BadRequestError('This order is not a COD order.');
    const collection = order.codCollections[collectionIndex];
    if (!collection) throw new NotFoundError('COD collection record not found.');
    if (collection.verifiedAt) throw new ConflictError('This COD collection has already been reconciled.');
    collection.verifiedAt = new Date();
    collection.verifiedBy = adminId;
    await order.save();
    emitDeliveryUpdate(order, 'rider:cod_updated');
    return order;
};

export const getAllRiders = async ({ isActive, availability, search } = {}) => {
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive;
    if (availability) filter.availability = availability;
    if (search?.trim()) {
        const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
    }
    const riders = await Rider.find(filter)
        .select('name phone email isActive availability createdAt updatedAt')
        .sort({ createdAt: -1 })
        .lean();
    return Promise.all(riders.map(async (rider) => ({
        ...rider,
        activeAssignments: await Order.countDocuments({
            rider: rider._id,
            riderStatus: { $in: activeStatuses },
        }),
    })));
};

export const getRiderById = async (id) => {
    const rider = await Rider.findById(id);
    if (!rider) throw new NotFoundError('Rider not found');
    return rider;
};

export const createRider = async (data) => {
    const cleanPhone = data.phone.replace(/\D/g, '').slice(-10);
    const riderData = { name: data.name.trim(), phone: cleanPhone, isActive: data.isActive !== false };
    if (data.email) riderData.email = data.email.trim().toLowerCase();
    if (data.password) riderData.passwordHash = await bcrypt.hash(data.password, 12);
    const rider = new Rider(riderData);
    try {
        await rider.save();
    } catch (error) {
        if (error.code === 11000) throw new ConflictError('A rider with this email or Google account already exists.');
        throw error;
    }
    return rider;
};

export const updateRider = async (id, updates) => {
    const rider = await Rider.findById(id);
    if (!rider) throw new NotFoundError('Rider not found');
    if (updates.name !== undefined) rider.name = updates.name.trim();
    if (updates.phone !== undefined) rider.phone = updates.phone.replace(/\D/g, '').slice(-10);
    if (updates.email !== undefined) rider.email = updates.email.trim().toLowerCase();
    if (updates.isActive !== undefined) rider.isActive = updates.isActive;
    await rider.save();
    return rider;
};

export const deleteRider = async (id) => {
    const rider = await Rider.findById(id);
    if (!rider) throw new NotFoundError('Rider not found');
    const associatedOrders = await Order.countDocuments({ $or: [{ rider: id }, { 'riderAssignmentHistory.rider': id }] });
    if (associatedOrders > 0) {
        throw new BadRequestError(`Cannot delete rider associated with ${associatedOrders} historical order(s). Please deactivate the rider instead.`);
    }
    await Rider.findByIdAndDelete(id);
    return { id, name: rider.name };
};

export const getRiders = getAllRiders;
