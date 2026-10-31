import { Router } from 'express';
import {
    calculateCartPricing,
    validateCoupon,
    getActiveOffers,
} from '../controllers/discount.controller.js';
import { optionalCustomerAuth } from '../middleware/customer-auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { calculateCartSchema, validateCouponSchema } from '../validators/discount.validator.js';

const router = Router();

// Public / Customer pricing & offers endpoints
router.get('/active', getActiveOffers);
router.post('/calculate', optionalCustomerAuth, validate(calculateCartSchema, 'body'), calculateCartPricing);
router.post('/validate-coupon', optionalCustomerAuth, validate(validateCouponSchema, 'body'), validateCoupon);

export default router;

