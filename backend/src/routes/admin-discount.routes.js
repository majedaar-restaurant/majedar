import { Router } from 'express';
import {
    getAdminDiscounts,
    getDiscountOverview,
    createDiscount,
    getAdminDiscountById,
    updateDiscount,
    toggleDiscountStatus,
    deleteDiscount,
} from '../controllers/discount.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    createDiscountSchema,
    updateDiscountSchema,
    discountIdParamSchema,
} from '../validators/discount.validator.js';

const router = Router();

router.use(authenticateAdmin, requireAdmin);

router.get('/overview', getDiscountOverview);
router.get('/', getAdminDiscounts);
router.post('/', validate(createDiscountSchema, 'body'), createDiscount);
router.get('/:id', validate(discountIdParamSchema, 'params'), getAdminDiscountById);
router.patch(
    '/:id',
    validate(discountIdParamSchema, 'params'),
    validate(updateDiscountSchema, 'body'),
    updateDiscount
);
router.patch('/:id/toggle', validate(discountIdParamSchema, 'params'), toggleDiscountStatus);
router.delete('/:id', validate(discountIdParamSchema, 'params'), deleteDiscount);

export default router;

