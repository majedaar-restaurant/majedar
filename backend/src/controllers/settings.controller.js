import * as settingsService from '../services/settings/settings.service.js';
import { sendSuccess } from '../utils/response.js';
import { Order } from '../models/Order.js';

const TIMEZONE = 'Asia/Kolkata';

/**
 * Public: Get current restaurant status, timings, and announcement.
 */
export const getPublicSettings = async (req, res, next) => {
    try {
        const data = await settingsService.getPublicSettings();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Restaurant settings retrieved successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get all settings and raw document for editing.
 */
export const getAdminSettings = async (req, res, next) => {
    try {
        const data = await settingsService.getAdminSettings();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Admin restaurant settings retrieved successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Update restaurant configuration (timings, minimum order amount).
 */
export const updateSettings = async (req, res, next) => {
    try {
        const data = await settingsService.updateSettings(req.body);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Restaurant settings updated successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Toggle shop status between Open and Closed manually.
 */
export const toggleShopStatus = async (req, res, next) => {
    try {
        const { isOpen } = req.body;
        const data = await settingsService.toggleShopStatus({ isOpen: Boolean(isOpen) });
        return sendSuccess(res, {
            statusCode: 200,
            message: `Shop successfully ${isOpen ? 'opened' : 'closed'}`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Toggle Over Order feature.
 */
export const toggleOverOrder = async (req, res, next) => {
    try {
        const { active, durationMinutes } = req.body;
        const data = await settingsService.toggleOverOrder({
            active: Boolean(active),
            durationMinutes: durationMinutes ? Number(durationMinutes) : 30,
        });
        return sendSuccess(res, {
            statusCode: 200,
            message: active
                ? `Over order mode activated for ${data.overOrder.durationMinutes} minutes`
                : 'Over order mode deactivated',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get operational dashboard statistics in local timezone (Asia/Kolkata).
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        // Fetch all orders
        const allOrders = await Order.find().sort({ createdAt: -1 }).lean();

        // Get today's date in IST (YYYY-MM-DD)
        const todayIST = new Intl.DateTimeFormat('en-CA', {
            timeZone: TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());

        // Filter orders placed today in IST
        const todayOrders = allOrders.filter((order) => {
            if (!order.createdAt) return false;
            const orderDateIST = new Intl.DateTimeFormat('en-CA', {
                timeZone: TIMEZONE,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(order.createdAt));
            return orderDateIST === todayIST;
        });

        // Status breakdown for today
        const statusBreakdown = {
            placed: 0,
            preparing: 0,
            out_for_delivery: 0,
            completed: 0,
            cancelled: 0,
            expired: 0,
        };

        let todayRevenue = 0;

        for (const o of todayOrders) {
            const st = o.orderStatus || 'placed';
            if (statusBreakdown[st] !== undefined) {
                statusBreakdown[st]++;
            } else {
                statusBreakdown[st] = 1;
            }

            // Calculate revenue: exclude cancelled / expired orders, include paid or completed
            if (st !== 'cancelled' && st !== 'expired') {
                if (o.paymentStatus === 'paid' || st === 'completed') {
                    todayRevenue += Number(o.total) || 0;
                }
            }
        }

        // Live / active counts across all orders
        const pendingOrders = allOrders.filter((o) => o.orderStatus === 'placed');
        const activeOrders = allOrders.filter(
            (o) => o.orderStatus === 'placed' || o.orderStatus === 'preparing' || o.orderStatus === 'out_for_delivery'
        );

        const shopStatus = await settingsService.getPublicSettings();

        return sendSuccess(res, {
            statusCode: 200,
            message: 'Dashboard operational metrics retrieved successfully',
            data: {
                todayDateIST: todayIST,
                todayOrdersCount: todayOrders.length,
                todayRevenue: Math.round(todayRevenue * 100) / 100,
                statusBreakdown,
                pendingOrdersCount: pendingOrders.length,
                activeOrdersCount: activeOrders.length,
                totalAllTimeOrders: allOrders.length,
                shopStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};
