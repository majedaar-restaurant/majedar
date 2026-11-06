import * as riderService from '../services/rider/rider.service.js';
import { Rider } from '../models/Rider.js';
import { Order } from '../models/Order.js';
import bcrypt from 'bcryptjs';
import { sendSuccess } from '../utils/response.js';

export const getRiders = async (req, res, next) => {
    try {
        const riders = await riderService.getAllRiders(req.query);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Riders retrieved successfully',
            data: { riders },
        });
    } catch (error) {
        next(error);
    }
};

export const getRiderById = async (req, res, next) => {
    try {
        const rider = await riderService.getRiderById(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider retrieved successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const createRider = async (req, res, next) => {
    try {
        const rider = await riderService.createRider(req.body);
        return sendSuccess(res, {
            statusCode: 201,
            message: 'Rider created successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const updateRider = async (req, res, next) => {
    try {
        const rider = await riderService.updateRider(req.params.id, req.body);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider updated successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRider = async (req, res, next) => {
    try {
        const result = await riderService.deleteRider(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider deleted successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const resetRiderPassword = async (req, res, next) => {
    try {
        const rider = await Rider.findById(req.params.id);
        if (!rider) {
            return res.status(404).json({ success: false, message: 'Rider not found.' });
        }
        rider.passwordHash = await bcrypt.hash(req.body.password, 12);
        rider.tokenVersion = (rider.tokenVersion || 0) + 1;
        await rider.save();
        return sendSuccess(res, { message: 'Rider password reset successfully.' });
    } catch (error) {
        next(error);
    }
};

export const getRiderDashboard = async (req, res, next) => {
    try {
        const activeOrders = await riderService.getAssignedOrders(req.rider._id);
        const allOrders = await riderService.getAssignedOrders(req.rider._id, { history: true });
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        const riderId = req.rider._id.toString();
        const todayEvents = allOrders.flatMap((order) => {
            const statusEvents = (order.statusHistory || []).filter((event) =>
                event.domain === 'rider'
                && event.actor?.toString() === riderId
                && ['delivered', 'failed', 'rejected'].includes(event.status)
                && event.timestamp >= start
                && event.timestamp < end
            );
            if (statusEvents.length) return statusEvents;
            return (order.riderDeliveryHistory || []).filter((event) =>
                event.rider.toString() === riderId && event.timestamp >= start && event.timestamp < end
            );
        });
        const codCollectedToday = allOrders.reduce((sum, order) => sum + (order.codCollections || [])
            .filter((entry) => entry.rider.toString() === riderId && entry.collectedAt >= start && entry.collectedAt < end)
            .reduce((collected, entry) => collected + entry.amount, 0), 0);
        const summary = {
            assigned: activeOrders.length,
            pending: activeOrders.filter((order) => order.riderStatus === 'pending').length,
            active: activeOrders.filter((order) => ['accepted', 'picked_up', 'out_for_delivery'].includes(order.riderStatus)).length,
            completed: todayEvents.filter((event) => event.status === 'delivered').length,
            failed: todayEvents.filter((event) => event.status === 'failed').length,
            rejected: todayEvents.filter((event) => event.status === 'rejected').length,
            codCollectedToday,
            codToCollect: activeOrders
                .filter((order) => order.paymentMethod === 'cod' && order.paymentStatus !== 'paid')
                .reduce((sum, order) => sum + Math.max(0, order.total - (order.codCollections || []).reduce((value, row) => value + row.amount, 0)), 0),
        };
        return sendSuccess(res, {
            data: {
                rider: {
                    _id: req.rider._id,
                    name: req.rider.name,
                    phone: req.rider.phone,
                    email: req.rider.email,
                    availability: req.rider.availability,
                    isActive: req.rider.isActive,
                },
                summary,
                orders: activeOrders,
                historyOrders: allOrders,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getRiderOrders = async (req, res, next) => {
    try {
        const orders = await riderService.getAssignedOrders(req.rider._id);
        return sendSuccess(res, { data: { orders } });
    } catch (error) {
        next(error);
    }
};

export const getRiderHistory = async (req, res, next) => {
    try {
        const orders = await riderService.getAssignedOrders(req.rider._id, { history: true });
        return sendSuccess(res, { data: { orders } });
    } catch (error) {
        next(error);
    }
};

export const setRiderAvailability = async (req, res, next) => {
    try {
        const result = await riderService.setAvailability(req.rider._id, req.body.availability);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const respondToAssignment = async (req, res, next) => {
    try {
        const order = await riderService.respondToAssignment(req.rider._id, req.params.id, req.body);
        return sendSuccess(res, { data: { order } });
    } catch (error) {
        next(error);
    }
};

export const updateDeliveryStatus = async (req, res, next) => {
    try {
        const order = await riderService.updateDeliveryStatus(req.rider._id, req.params.id, req.body);
        return sendSuccess(res, { data: { order } });
    } catch (error) {
        next(error);
    }
};

export const recordCodCollection = async (req, res, next) => {
    try {
        const order = await riderService.recordCodCollection(req.rider._id, req.params.id, req.body);
        return sendSuccess(res, { data: { order } });
    } catch (error) {
        next(error);
    }
};

export const updateRiderLocation = async (req, res, next) => {
    try {
        const result = await riderService.updateRiderLocation(req.rider._id, req.params.id, req.body);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const getRiderNotifications = async (req, res, next) => {
    try {
        const result = await riderService.getRiderNotifications(req.rider._id);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const markRiderNotificationRead = async (req, res, next) => {
    try {
        const result = await riderService.markRiderNotificationRead(req.rider._id, req.params.notificationId);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const getAdminRiderNotifications = async (req, res, next) => {
    try {
        const result = await riderService.getAdminRiderNotifications(req.params.id || null);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const markAdminRiderNotificationRead = async (req, res, next) => {
    try {
        const result = await riderService.markAdminRiderNotificationRead(req.params.notificationId);
        return sendSuccess(res, { data: result });
    } catch (error) {
        next(error);
    }
};

export const getAdminRiderHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'riderAssignmentHistory.rider': req.params.id })
            .sort({ updatedAt: -1 })
            .lean();
        return sendSuccess(res, { data: { orders } });
    } catch (error) {
        next(error);
    }
};

export const verifyCodCollection = async (req, res, next) => {
    try {
        const order = await riderService.verifyCodCollection(
            req.admin._id,
            req.params.id,
            Number(req.params.collectionIndex)
        );
        return sendSuccess(res, { data: { order }, message: 'COD collection reconciled successfully.' });
    } catch (error) {
        next(error);
    }
};
