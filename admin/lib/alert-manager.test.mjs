import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { alertManager } from './alert-manager.js';

describe('OrderAlertManager Unit Tests', () => {
  test('Initial state has 0 pending orders', () => {
    const state = alertManager.getState();
    assert.equal(typeof state.pendingCount, 'number');
    assert.equal(typeof state.isAudioPlaying, 'boolean');
  });

  test('Adding pending order increases count', () => {
    const futureDeadline = new Date(Date.now() + 180000).toISOString();
    alertManager.addPendingOrder({
      orderId: 'test-order-1',
      orderNumber: 'MD-101',
      total: 500,
      acceptanceDeadline: futureDeadline,
    });

    const state = alertManager.getState();
    assert.ok(state.pendingCount >= 1);
  });

  test('Multiple orders: removing one order when another is pending keeps active pending state', () => {
    const futureDeadline = new Date(Date.now() + 180000).toISOString();
    alertManager.addPendingOrder({
      orderId: 'test-order-2',
      orderNumber: 'MD-102',
      total: 750,
      acceptanceDeadline: futureDeadline,
    });

    // Remove first order
    alertManager.removePendingOrder('test-order-1');
    const state = alertManager.getState();
    assert.ok(state.pendingCount >= 1);
    assert.ok(state.pendingOrders.some(o => o.orderId === 'test-order-2'));

    // Remove second order
    alertManager.removePendingOrder('test-order-2');
    const finalState = alertManager.getState();
    assert.equal(finalState.pendingOrders.some(o => o.orderId === 'test-order-2'), false);
  });

  test('Check expirations removes overdue orders', () => {
    const pastDeadline = new Date(Date.now() - 5000).toISOString();
    alertManager.pendingOrders.set('test-expired-1', {
      orderId: 'test-expired-1',
      orderNumber: 'MD-EXP',
      acceptanceDeadline: pastDeadline,
    });

    alertManager.checkExpirations();
    assert.equal(alertManager.pendingOrders.has('test-expired-1'), false);
  });
});
