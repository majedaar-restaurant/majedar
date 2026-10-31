import * as discountService from '../services/discount/discount.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Customer / Public: Authoritative cart price calculation.
 */
export const calculateCartPricing = async (req, res, next) => {
    try {
        const customerId = req.customer?._id || null;
        const result = await discountService.calculateCartPricing({
            items: req.body.items,
            couponCode: req.body.couponCode,
            customerId,
            deliveryFee: req.body.deliveryFee,
        });

        return sendSuccess(res, {
            statusCode: 200,
            message: 'Pricing calculated successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Customer / Public: Validate coupon code against cart.
 */
export const validateCoupon = async (req, res, next) => {
    try {
        const customerId = req.customer?._id || null;
        const result = await discountService.calculateCartPricing({
            items: req.body.items,
            couponCode: req.body.couponCode,
            customerId,
            deliveryFee: req.body.deliveryFee,
        });

        return sendSuccess(res, {
            statusCode: 200,
            message: `Coupon "${req.body.couponCode.toUpperCase()}" applied successfully! You save ₹${result.discountAmount}`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Public: Get active automatic discounts for product badge decoration.
 */
export const getActiveOffers = async (req, res, next) => {
    try {
        const offers = await discountService.getActiveAutomaticDiscounts();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Active offers retrieved successfully',
            data: { offers },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get all discounts with pagination & filters.
 */
export const getAdminDiscounts = async (req, res, next) => {
    try {
        const result = await discountService.getAdminDiscounts(req.query);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Discounts retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get discount overview statistics.
 */
export const getDiscountOverview = async (req, res, next) => {
    try {
        const stats = await discountService.getDiscountOverviewStats();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Discount overview retrieved successfully',
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Create a new discount.
 */
export const createDiscount = async (req, res, next) => {
    try {
        const discount = await discountService.createDiscount(req.body);
        return sendSuccess(res, {
            statusCode: 201,
            message: 'Discount created successfully',
            data: { discount },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get single discount by ID.
 */
export const getAdminDiscountById = async (req, res, next) => {
    try {
        const discount = await discountService.Discount.findById(req.params.id)
            .populate('categoryIds', 'name')
            .populate('productIds', 'name price image');
        if (!discount) {
            return res.status(404).json({ success: false, message: 'Discount not found' });
        }
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Discount details retrieved',
            data: { discount },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Update discount.
 */
export const updateDiscount = async (req, res, next) => {
    try {
        const discount = await discountService.updateDiscount(req.params.id, req.body);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Discount updated successfully',
            data: { discount },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Toggle discount active status.
 */
export const toggleDiscountStatus = async (req, res, next) => {
    try {
        const discount = await discountService.toggleDiscountStatus(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: `Discount is now ${discount.isActive ? 'active' : 'inactive'}`,
            data: { discount },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Delete discount.
 */
export const deleteDiscount = async (req, res, next) => {
    try {
        const discount = await discountService.deleteDiscount(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Discount deleted successfully',
            data: { discount },
        });
    } catch (error) {
        next(error);
    }
};

