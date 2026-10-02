import { BadRequestError } from './errors.js';

/**
 * Indian Standard Time (IST) offset configuration.
 * The restaurant operates in India (IST, UTC+05:30).
 */
export const RESTAURANT_TIMEZONE = 'Asia/Kolkata';

/**
 * Get current date string in IST as 'YYYY-MM-DD'.
 */
export function getCurrentISTDateString(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: RESTAURANT_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(date); // Format: 'YYYY-MM-DD'
}

/**
 * Parse a 'YYYY-MM-DD' date string as start or end of day in Indian Standard Time (UTC+05:30).
 *
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {boolean} isEndOfDay - If true, set to 23:59:59.999 IST; else 00:00:00.000 IST
 * @returns {Date} UTC Date object
 */
export function parseISTDate(dateStr, isEndOfDay = false) {
    if (!dateStr || typeof dateStr !== 'string') {
        throw new BadRequestError('Invalid date format. Expected YYYY-MM-DD.');
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
    if (!match) {
        throw new BadRequestError(`Invalid date "${dateStr}". Expected YYYY-MM-DD format.`);
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        throw new BadRequestError(`Invalid calendar date "${dateStr}".`);
    }

    // Verify calendar validity (e.g. Feb 30th)
    const checkDate = new Date(Date.UTC(year, month - 1, day));
    if (
        checkDate.getUTCFullYear() !== year ||
        checkDate.getUTCMonth() !== month - 1 ||
        checkDate.getUTCDate() !== day
    ) {
        throw new BadRequestError(`Invalid calendar date "${dateStr}".`);
    }

    const timePart = isEndOfDay ? '23:59:59.999' : '00:00:00.000';
    // JavaScript natively parses +05:30 ISO strings into correct UTC time
    const isoString = `${dateStr}T${timePart}+05:30`;
    const parsed = new Date(isoString);

    if (isNaN(parsed.getTime())) {
        throw new BadRequestError(`Failed to parse date "${dateStr}".`);
    }

    return parsed;
}

/**
 * Calculate the Monday-Sunday week bounds in Indian Standard Time.
 *
 * @param {Date} [referenceDate=new Date()]
 * @returns {{ startOfWeek: Date, endOfWeek: Date, mondayStr: string, sundayStr: string }}
 */
export function getISTWeekBounds(referenceDate = new Date()) {
    const istTodayStr = getCurrentISTDateString(referenceDate);
    const [year, month, day] = istTodayStr.split('-').map((n) => parseInt(n, 10));

    // Construct a UTC noon date representing the IST calendar day to avoid any DST/offset shifts
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // In a Monday-Sunday week:
    // If today is Sunday (0), Monday was 6 days ago (-6).
    // If today is Monday (1), diff is 0.
    // If Tuesday (2), diff is -1, etc.
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayUtc = new Date(d);
    mondayUtc.setUTCDate(d.getUTCDate() + diffToMonday);

    const sundayUtc = new Date(mondayUtc);
    sundayUtc.setUTCDate(mondayUtc.getUTCDate() + 6);

    const pad = (n) => String(n).padStart(2, '0');
    const mondayStr = `${mondayUtc.getUTCFullYear()}-${pad(mondayUtc.getUTCMonth() + 1)}-${pad(mondayUtc.getUTCDate())}`;
    const sundayStr = `${sundayUtc.getUTCFullYear()}-${pad(sundayUtc.getUTCMonth() + 1)}-${pad(sundayUtc.getUTCDate())}`;

    const startOfWeek = parseISTDate(mondayStr, false);
    const endOfWeek = parseISTDate(sundayStr, true);

    return { startOfWeek, endOfWeek, mondayStr, sundayStr };
}

/**
 * Builds a MongoDB date filter query object for a given field (default: 'createdAt').
 *
 * Supports:
 * - datePreset: 'today' | 'this-week' | 'custom'
 * - dateFrom: 'YYYY-MM-DD'
 * - dateTo: 'YYYY-MM-DD'
 *
 * @param {Object} options
 * @param {string} [options.datePreset] - 'today' | 'this-week' | 'custom'
 * @param {string} [options.dateFrom] - 'YYYY-MM-DD'
 * @param {string} [options.dateTo] - 'YYYY-MM-DD'
 * @param {string} [options.fieldName='createdAt'] - MongoDB field name to filter on
 * @returns {Object} MongoDB filter object, e.g. { createdAt: { $gte, $lte } } or {}
 */
export function getDateRangeFilter({
    datePreset,
    dateFrom,
    dateTo,
    fieldName = 'createdAt',
} = {}) {
    if (!datePreset && !dateFrom && !dateTo) {
        return {};
    }

    let start = null;
    let end = null;

    if (datePreset === 'today') {
        const todayStr = getCurrentISTDateString();
        start = parseISTDate(todayStr, false);
        end = parseISTDate(todayStr, true);
    } else if (datePreset === 'this-week' || datePreset === 'this_week') {
        const bounds = getISTWeekBounds();
        start = bounds.startOfWeek;
        end = bounds.endOfWeek;
    } else if (datePreset === 'custom' || dateFrom || dateTo) {
        if (dateFrom) {
            start = parseISTDate(dateFrom, false);
        }
        if (dateTo) {
            end = parseISTDate(dateTo, true);
        }

        if (start && end && start.getTime() > end.getTime()) {
            throw new BadRequestError('dateFrom cannot be after dateTo.');
        }
    } else {
        throw new BadRequestError(`Invalid datePreset: "${datePreset}". Expected "today", "this-week", or "custom".`);
    }

    const condition = {};
    if (start) condition.$gte = start;
    if (end) condition.$lte = end;

    if (Object.keys(condition).length > 0) {
        return { [fieldName]: condition };
    }

    return {};
}
