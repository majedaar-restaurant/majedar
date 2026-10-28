import { RestaurantSetting } from '../../models/RestaurantSetting.js';
import { emitShopStatusUpdated } from '../../socket/socket.server.js';
import { restaurantConfig } from '../../config/restaurant.config.js';

const TIMEZONE = 'Asia/Kolkata';

/**
 * Format a 24h "HH:mm" time string into a 12h "hh:mm AM/PM" string.
 */
export const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m.padStart(2, '0')} ${ampm}`;
};

/**
 * Format a Date object into "hh:mm AM/PM" in IST timezone.
 */
export const formatDateToISTTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        timeZone: TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Get current hour and minute in IST.
 */
export const getNowInIST = (date = new Date()) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    });
    const parts = formatter.formatToParts(date);
    let hour = 0;
    let minute = 0;
    let second = 0;
    for (const p of parts) {
        if (p.type === 'hour') hour = parseInt(p.value, 10);
        if (p.type === 'minute') minute = parseInt(p.value, 10);
        if (p.type === 'second') second = parseInt(p.value, 10);
    }
    return { hour, minute, second, totalMinutes: hour * 60 + minute };
};

/**
 * Get or create the singleton RestaurantSetting document.
 */
export const getOrCreateSetting = async () => {
    let setting = await RestaurantSetting.findOne();
    if (!setting) {
        setting = new RestaurantSetting();
        await setting.save();
    }
    return setting;
};

/**
 * Compute the full live shop availability status, considering schedule,
 * manual closure, and over-order timers.
 */
export const computeShopStatus = (setting) => {
    const openingStr = setting.openingTime || '10:00';
    const closingStr = setting.closingTime || '22:30';

    const [openH, openM] = openingStr.split(':').map((v) => parseInt(v, 10) || 0);
    const [closeH, closeM] = closingStr.split(':').map((v) => parseInt(v, 10) || 0);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const { hour, minute, totalMinutes: nowMinutes } = getNowInIST();

    // Determine if current time is within schedule
    let isScheduledOpen = false;
    if (openMinutes < closeMinutes) {
        // Standard same-day timings (e.g., 10:00 AM to 10:30 PM)
        isScheduledOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;
    } else {
        // Overnight timings spanning past midnight (e.g., 6:00 PM to 2:00 AM)
        isScheduledOpen = nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    }

    const formattedOpen = format12Hour(openingStr);
    const formattedClose = format12Hour(closingStr);

    let isOpen = false;
    let closureReason = null;
    let closedTimeDisplay = '';
    let reopenTimeDisplay = '';
    let announcementMessage = '';

    if (setting.isManuallyClosed) {
        isOpen = false;
        closureReason = 'manual';
        closedTimeDisplay = setting.manualClosedAt
            ? formatDateToISTTime(setting.manualClosedAt)
            : formattedClose;

        // Reopening timing based on configured schedule
        const isBeforeOpenToday = nowMinutes < openMinutes;
        reopenTimeDisplay = isBeforeOpenToday
            ? `today at ${formattedOpen}`
            : `tomorrow at ${formattedOpen}`;

        announcementMessage = `Sorry! Our shop is currently closed. We closed at ${closedTimeDisplay} and will reopen ${reopenTimeDisplay}.`;
    } else if (!isScheduledOpen) {
        isOpen = false;
        closureReason = 'scheduled';
        closedTimeDisplay = formattedClose;

        const isBeforeOpenToday = nowMinutes < openMinutes;
        reopenTimeDisplay = isBeforeOpenToday
            ? `today at ${formattedOpen}`
            : `tomorrow at ${formattedOpen}`;

        announcementMessage = `Sorry! Our shop is currently closed. We closed at ${closedTimeDisplay} and will reopen ${reopenTimeDisplay}.`;
    } else {
        isOpen = true;
    }

    // Evaluate Over Order state
    let isOverOrderActive = false;
    let remainingMinutes = 0;
    let overOrderMessage = '';

    if (setting.overOrder && setting.overOrder.isActive) {
        const now = Date.now();
        const expiresAt = setting.overOrder.expiresAt ? new Date(setting.overOrder.expiresAt).getTime() : 0;
        if (now >= expiresAt) {
            isOverOrderActive = false;
        } else {
            isOverOrderActive = true;
            remainingMinutes = Math.max(1, Math.ceil((expiresAt - now) / 60000));
            overOrderMessage = `We're receiving a high number of orders right now. Please try again after ${remainingMinutes} minutes.`;
        }
    }

    // Determine ordering acceptance
    const canAcceptOrders = isOpen && !isOverOrderActive;
    let restrictionReason = null;
    let restrictionMessage = null;

    if (!isOpen) {
        restrictionReason = 'shop_closed';
        restrictionMessage = announcementMessage;
    } else if (isOverOrderActive) {
        restrictionReason = 'over_order';
        restrictionMessage = overOrderMessage;
    }

    return {
        isOpen,
        isManuallyClosed: Boolean(setting.isManuallyClosed),
        manualClosedAt: setting.manualClosedAt,
        closureReason,
        closedTimeDisplay,
        reopenTimeDisplay,
        announcementMessage,
        openingTime: openingStr,
        closingTime: closingStr,
        formattedOpeningTime: formattedOpen,
        formattedClosingTime: formattedClose,
        displayTimings: `${formattedOpen} – ${formattedClose}`,
        overOrder: {
            isActive: isOverOrderActive,
            activatedAt: setting.overOrder?.activatedAt || null,
            expiresAt: setting.overOrder?.expiresAt || null,
            durationMinutes: setting.overOrder?.durationMinutes || 30,
            remainingMinutes,
            message: overOrderMessage,
        },
        canAcceptOrders,
        restrictionReason,
        restrictionMessage,
        minimumOrderAmount: setting.minimumOrderAmount || restaurantConfig.minimumOrderAmount || 100,
    };
};

/**
 * Public settings payload with calculated status.
 */
export const getPublicSettings = async () => {
    const setting = await getOrCreateSetting();

    // Auto-deactivate overOrder in database if expired
    if (setting.overOrder?.isActive && setting.overOrder?.expiresAt && new Date() >= new Date(setting.overOrder.expiresAt)) {
        setting.overOrder.isActive = false;
        await setting.save();
    }

    return computeShopStatus(setting);
};

/**
 * Admin: Full settings payload.
 */
export const getAdminSettings = async () => {
    const setting = await getOrCreateSetting();

    // Auto-deactivate overOrder if expired
    if (setting.overOrder?.isActive && setting.overOrder?.expiresAt && new Date() >= new Date(setting.overOrder.expiresAt)) {
        setting.overOrder.isActive = false;
        await setting.save();
    }

    const computed = computeShopStatus(setting);
    return {
        ...computed,
        rawSetting: setting,
    };
};

/**
 * Admin: Toggle shop status between Open and Closed manually.
 */
export const toggleShopStatus = async ({ isOpen }) => {
    const setting = await getOrCreateSetting();
    const shouldBeManuallyClosed = !isOpen;

    setting.isManuallyClosed = shouldBeManuallyClosed;
    if (shouldBeManuallyClosed) {
        setting.manualClosedAt = new Date();
    } else {
        setting.manualClosedAt = null;
    }

    await setting.save();

    const computed = computeShopStatus(setting);
    try {
        emitShopStatusUpdated(computed);
    } catch (_) {}

    return computed;
};

/**
 * Admin: Activate or deactivate Over Order functionality.
 */
export const toggleOverOrder = async ({ active, durationMinutes = 30 }) => {
    const setting = await getOrCreateSetting();

    if (active) {
        const mins = Math.max(1, parseInt(durationMinutes, 10) || 30);
        const activatedAt = new Date();
        const expiresAt = new Date(activatedAt.getTime() + mins * 60 * 1000);

        setting.overOrder = {
            isActive: true,
            activatedAt,
            expiresAt,
            durationMinutes: mins,
        };
    } else {
        setting.overOrder = {
            isActive: false,
            activatedAt: null,
            expiresAt: null,
            durationMinutes: 30,
        };
    }

    await setting.save();

    const computed = computeShopStatus(setting);
    try {
        emitShopStatusUpdated(computed);
    } catch (_) {}

    return computed;
};

/**
 * Admin: Update restaurant configuration (timings, minimum order amount).
 */
export const updateSettings = async (updates) => {
    const setting = await getOrCreateSetting();

    if (updates.openingTime) setting.openingTime = updates.openingTime.trim();
    if (updates.closingTime) setting.closingTime = updates.closingTime.trim();
    if (updates.minimumOrderAmount !== undefined) {
        setting.minimumOrderAmount = Math.max(0, Number(updates.minimumOrderAmount) || 100);
        restaurantConfig.minimumOrderAmount = setting.minimumOrderAmount;
    }

    await setting.save();

    const computed = computeShopStatus(setting);
    try {
        emitShopStatusUpdated(computed);
    } catch (_) {}

    return computed;
};
