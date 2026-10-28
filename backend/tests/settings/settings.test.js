import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { computeShopStatus } from '../../src/services/settings/settings.service.js';
import { restaurantConfig } from '../../src/config/restaurant.config.js';

describe('Restaurant Availability, Timings & Over-Order Suite', () => {

    test('Standard timings are properly parsed and formatted in IST', () => {
        const mockSetting = {
            isManuallyClosed: false,
            manualClosedAt: null,
            openingTime: '10:00',
            closingTime: '22:30',
            timezone: 'Asia/Kolkata',
            overOrder: { isActive: false },
            minimumOrderAmount: 100,
        };

        const status = computeShopStatus(mockSetting);
        assert.equal(status.openingTime, '10:00');
        assert.equal(status.closingTime, '22:30');
        assert.equal(status.formattedOpeningTime, '10:00 AM');
        assert.equal(status.formattedClosingTime, '10:30 PM');
        assert.equal(status.displayTimings, '10:00 AM – 10:30 PM');
    });

    test('Manual closure produces accurate dynamic announcement with closed & reopen times', () => {
        const closedAt = new Date('2026-10-26T17:00:00.000Z'); // 10:30 PM IST
        const mockSetting = {
            isManuallyClosed: true,
            manualClosedAt: closedAt,
            openingTime: '10:00',
            closingTime: '22:30',
            timezone: 'Asia/Kolkata',
            overOrder: { isActive: false },
        };

        const status = computeShopStatus(mockSetting);
        assert.equal(status.isOpen, false);
        assert.equal(status.canAcceptOrders, false);
        assert.equal(status.closureReason, 'manual');
        assert.equal(status.isManuallyClosed, true);
        assert.match(status.announcementMessage, /Sorry! Our shop is currently closed\./);
        assert.match(status.announcementMessage, /will reopen.*10:00 AM/);
    });

    test('Over-order calculates active state and remaining minutes accurately', () => {
        const now = Date.now();
        const expiresAt = new Date(now + 25 * 60 * 1000); // 25 mins from now
        const mockSetting = {
            isManuallyClosed: false,
            manualClosedAt: null,
            openingTime: '00:00',
            closingTime: '23:59',
            timezone: 'Asia/Kolkata',
            overOrder: {
                isActive: true,
                activatedAt: new Date(now),
                expiresAt,
                durationMinutes: 25,
            },
        };

        const status = computeShopStatus(mockSetting);
        assert.equal(status.overOrder.isActive, true);
        assert.equal(status.canAcceptOrders, false);
        assert.equal(status.restrictionReason, 'over_order');
        assert.match(status.restrictionMessage, /We're receiving a high number of orders right now\. Please try again after 25 minutes\./);
    });

    test('Expired over-order automatically deactivates and restores order acceptance', () => {
        const now = Date.now();
        const expiresAt = new Date(now - 1000); // Expired 1 second ago
        const mockSetting = {
            isManuallyClosed: false,
            manualClosedAt: null,
            openingTime: '00:00',
            closingTime: '23:59',
            timezone: 'Asia/Kolkata',
            overOrder: {
                isActive: true,
                activatedAt: new Date(now - 31 * 60 * 1000),
                expiresAt,
                durationMinutes: 30,
            },
        };

        const status = computeShopStatus(mockSetting);
        assert.equal(status.overOrder.isActive, false);
        assert.equal(status.canAcceptOrders, true);
        assert.equal(status.restrictionReason, null);
    });

    test('Default minimum order amount is configured to ₹100', () => {
        assert.equal(restaurantConfig.minimumOrderAmount, 100);
    });
});
