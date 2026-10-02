import assert from 'node:assert';
import {
    getCurrentISTDateString,
    parseISTDate,
    getISTWeekBounds,
    getDateRangeFilter,
} from './date-filter.js';

console.log('Testing date-filter.js...');

// 1. Current IST Date String format
const todayStr = getCurrentISTDateString();
assert.match(todayStr, /^\d{4}-\d{2}-\d{2}$/, 'Today format must be YYYY-MM-DD');

// 2. parseISTDate start and end
const start = parseISTDate('2026-10-02', false);
const end = parseISTDate('2026-10-02', true);

// 2026-10-02 00:00:00+05:30 in UTC is 2026-10-01 18:30:00.000Z
assert.strictEqual(start.toISOString(), '2026-10-01T18:30:00.000Z', 'Start of day UTC mismatch');
// 2026-10-02 23:59:59.999+05:30 in UTC is 2026-10-02 18:29:59.999Z
assert.strictEqual(end.toISOString(), '2026-10-02T18:29:59.999Z', 'End of day UTC mismatch');

// 3. Invalid date validation
assert.throws(() => parseISTDate('invalid'), /Invalid date/);
assert.throws(() => parseISTDate('2026-02-31'), /Invalid calendar date/);

// 4. Week bounds (Monday - Sunday)
const weekBounds = getISTWeekBounds(new Date('2026-10-02T12:00:00Z')); // Friday, Oct 2, 2026
assert.strictEqual(weekBounds.mondayStr, '2026-09-28', 'Monday should be Sept 28');
assert.strictEqual(weekBounds.sundayStr, '2026-10-04', 'Sunday should be Oct 4');
assert.strictEqual(weekBounds.startOfWeek.toISOString(), '2026-09-27T18:30:00.000Z');
assert.strictEqual(weekBounds.endOfWeek.toISOString(), '2026-10-04T18:29:59.999Z');

// 5. Sunday in IST test
const sundayWeek = getISTWeekBounds(new Date('2026-10-04T12:00:00Z')); // Sunday, Oct 4, 2026
assert.strictEqual(sundayWeek.mondayStr, '2026-09-28', 'Sunday belongs to current week starting Monday');
assert.strictEqual(sundayWeek.sundayStr, '2026-10-04', 'Sunday is end of week');

// 6. getDateRangeFilter today
const todayFilter = getDateRangeFilter({ datePreset: 'today' });
assert.ok(todayFilter.createdAt.$gte);
assert.ok(todayFilter.createdAt.$lte);

// 7. getDateRangeFilter custom
const customFilter = getDateRangeFilter({
    datePreset: 'custom',
    dateFrom: '2026-10-01',
    dateTo: '2026-10-03',
});
assert.strictEqual(customFilter.createdAt.$gte.toISOString(), '2026-09-30T18:30:00.000Z');
assert.strictEqual(customFilter.createdAt.$lte.toISOString(), '2026-10-03T18:29:59.999Z');

// 8. dateFrom > dateTo throws error
assert.throws(
    () => getDateRangeFilter({ datePreset: 'custom', dateFrom: '2026-10-05', dateTo: '2026-10-01' }),
    /dateFrom cannot be after dateTo/
);

console.log('✅ All date-filter tests passed successfully!');
