import { Router } from 'express';
import {
    getAdminOrders,
    getAdminOrderById,
    updateOrderStatus,
    assignRider,
    recoverDeliveryOrder,
} from '../controllers/order.controller.js';
import { verifyCodCollection } from '../controllers/rider.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    orderIdParamSchema,
    updateOrderStatusSchema,
    assignOrderRiderSchema,
    deliveryRecoverySchema,
    orderQuerySchema,
} from '../validators/order.validator.js';
import { codCollectionParamSchema } from '../validators/rider.validator.js';

const router = Router();

// Protect all admin order routes with admin authentication and authorization
router.use(authenticateAdmin, requireAdmin);

// Admin order management endpoints
router.get('/', validate(orderQuerySchema, 'query'), getAdminOrders);
router.get('/:id', validate(orderIdParamSchema, 'params'), getAdminOrderById);
router.patch(
    '/:id/status',
    validate(orderIdParamSchema, 'params'),
    validate(updateOrderStatusSchema, 'body'),
    updateOrderStatus
);
router.patch(
    '/:id/rider',
    validate(orderIdParamSchema, 'params'),
    validate(assignOrderRiderSchema, 'body'),
    assignRider
);
router.post(
    '/:id/recovery',
    validate(orderIdParamSchema, 'params'),
    validate(deliveryRecoverySchema, 'body'),
    recoverDeliveryOrder
);
router.patch(
    '/:id/cod/:collectionIndex/verify',
    validate(codCollectionParamSchema, 'params'),
    verifyCodCollection
);

export default router;
