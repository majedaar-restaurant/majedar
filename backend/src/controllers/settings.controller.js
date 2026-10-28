import * as settingsService from '../services/settings/settings.service.js';
import { sendSuccess } from '../utils/response.js';
import { Order } from '../models/Order.js';
import { getDateRangeFilter, getCurrentISTDateString } from '../utils/date-filter.js';

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
 * Supports datePreset ('today' [default], 'this-week', 'last-week', 'this-month', 'last-month', 'this-year', 'custom')
 * and dateFrom/dateTo.
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const { datePreset = 'today', dateFrom, dateTo } = req.query;

        // Apply date filter
        const dateFilter = getDateRangeFilter({
            datePreset,
            dateFrom,
            dateTo,
            fieldName: 'createdAt',
        });

        // Filtered orders for metrics
        const filteredOrders = await Order.find(dateFilter).sort({ createdAt: -1 }).lean();

        // Status breakdown for the filtered range
        const statusBreakdown = {
            placed: 0,
            preparing: 0,
            out_for_delivery: 0,
            completed: 0,
            cancelled: 0,
            expired: 0,
        };

        let revenue = 0;

        for (const o of filteredOrders) {
            const st = o.orderStatus || 'placed';
            if (statusBreakdown[st] !== undefined) {
                statusBreakdown[st]++;
            } else {
                statusBreakdown[st] = 1;
            }

            // Calculate revenue: exclude cancelled / expired orders, include paid or completed
            if (st !== 'cancelled' && st !== 'expired') {
                if (o.paymentStatus === 'paid' || st === 'completed') {
                    revenue += Number(o.total) || 0;
                }
            }
        }

        // Live / active counts across all orders (for live kitchen operational alerts)
        const allLiveOrders = await Order.find({
            orderStatus: { $in: ['placed', 'preparing', 'out_for_delivery'] },
        }).lean();

        const pendingOrdersCount = allLiveOrders.filter((o) => o.orderStatus === 'placed').length;
        const activeOrdersCount = allLiveOrders.length;
        const totalAllTimeOrders = await Order.countDocuments();

        const shopStatus = await settingsService.getPublicSettings();
        const todayIST = getCurrentISTDateString();

        const roundedRevenue = Math.round(revenue * 100) / 100;

        return sendSuccess(res, {
            statusCode: 200,
            message: 'Dashboard operational metrics retrieved successfully',
            data: {
                datePreset,
                dateFrom: dateFrom || null,
                dateTo: dateTo || null,
                todayDateIST: todayIST,
                // Filtered metric counts
                ordersCount: filteredOrders.length,
                todayOrdersCount: filteredOrders.length,
                revenue: roundedRevenue,
                todayRevenue: roundedRevenue,
                statusBreakdown,
                // Live operational counts
                pendingOrdersCount,
                activeOrdersCount,
                totalAllTimeOrders,
                shopStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};
