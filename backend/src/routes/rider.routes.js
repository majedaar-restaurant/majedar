import { Router } from 'express';
import {
    getRiderDashboard,
    getRiderOrders,
    getRiderHistory,
    setRiderAvailability,
    respondToAssignment,
    updateDeliveryStatus,
    recordCodCollection,
    updateRiderLocation,
    getRiderNotifications,
    markRiderNotificationRead,
} from '../controllers/rider.controller.js';
import {
    getRiderPushPublicKey,
    subscribeRiderPush,
    unsubscribeRiderPush,
} from '../controllers/rider-push.controller.js';
import { authenticateRider } from '../middleware/rider-auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    riderIdParamSchema,
    riderAvailabilitySchema,
    riderAssignmentResponseSchema,
    riderDeliveryStatusSchema,
    riderCodCollectionSchema,
    riderLocationSchema,
    riderNotificationParamSchema,
} from '../validators/rider.validator.js';

const router = Router();
router.use(authenticateRider);

router.get('/dashboard', getRiderDashboard);
router.get('/orders', getRiderOrders);
router.get('/history', getRiderHistory);
router.patch('/availability', validate(riderAvailabilitySchema), setRiderAvailability);
router.get('/notifications', getRiderNotifications);
router.get('/push/vapid-public-key', getRiderPushPublicKey);
router.post('/push/subscribe', subscribeRiderPush);
router.post('/push/unsubscribe', unsubscribeRiderPush);
router.patch(
    '/notifications/:notificationId/read',
    validate(riderNotificationParamSchema, 'params'),
    markRiderNotificationRead
);
router.patch(
    '/orders/:id/assignment',
    validate(riderIdParamSchema, 'params'),
    validate(riderAssignmentResponseSchema),
    respondToAssignment
);
router.patch(
    '/orders/:id/status',
    validate(riderIdParamSchema, 'params'),
    validate(riderDeliveryStatusSchema),
    updateDeliveryStatus
);
router.post(
    '/orders/:id/cod',
    validate(riderIdParamSchema, 'params'),
    validate(riderCodCollectionSchema),
    recordCodCollection
);
router.put(
    '/orders/:id/location',
    validate(riderIdParamSchema, 'params'),
    validate(riderLocationSchema),
    updateRiderLocation
);

export default router;
