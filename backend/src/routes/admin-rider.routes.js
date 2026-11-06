import { Router } from 'express';
import {
    createRider,
    getRiders,
    getRiderById,
    updateRider,
    deleteRider,
    resetRiderPassword,
    getAdminRiderHistory,
    getAdminRiderNotifications,
    markAdminRiderNotificationRead,
} from '../controllers/rider.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    createRiderSchema,
    updateRiderSchema,
    riderIdParamSchema,
    riderQuerySchema,
    riderPasswordResetSchema,
    riderNotificationParamSchema,
} from '../validators/rider.validator.js';

const router = Router();

// All admin rider endpoints require admin authentication
router.use(authenticateAdmin, requireAdmin);

router.post('/', validate(createRiderSchema), createRider);
router.get('/', validate(riderQuerySchema, 'query'), getRiders);
router.get('/notifications', getAdminRiderNotifications);
router.patch(
    '/notifications/:notificationId/read',
    validate(riderNotificationParamSchema, 'params'),
    markAdminRiderNotificationRead
);
router.get('/:id/notifications', validate(riderIdParamSchema, 'params'), getAdminRiderNotifications);
router.get('/:id', validate(riderIdParamSchema, 'params'), getRiderById);
router.get('/:id/history', validate(riderIdParamSchema, 'params'), getAdminRiderHistory);
router.post(
    '/:id/reset-password',
    validate(riderIdParamSchema, 'params'),
    validate(riderPasswordResetSchema),
    resetRiderPassword
);
router.patch(
    '/:id',
    validate(riderIdParamSchema, 'params'),
    validate(updateRiderSchema),
    updateRider
);
router.delete('/:id', validate(riderIdParamSchema, 'params'), deleteRider);

export default router;
