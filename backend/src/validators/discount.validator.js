import { z } from 'zod';
import { objectIdRegex } from './category.validator.js';

export const discountIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, 'Invalid discount ID format'),
});

const coerceNumber = z.union([
    z.number(),
    z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val), {
        message: 'Must be a valid number',
    }),
]);

const coercePositiveNumber = z.union([
    z.number().positive(),
    z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val > 0, {
        message: 'Must be greater than 0',
    }),
]);

const coerceBoolean = z.union([
    z.boolean(),
    z.string().transform((val) => val === 'true' || val === '1'),
]);

export const createDiscountSchema = z
    .object({
        name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
        description: z.string().trim().max(500).optional().nullable(),
        discountType: z.enum(['percentage', 'flat']),
        discountValue: coercePositiveNumber,
        method: z.enum(['automatic', 'coupon']),
        couponCode: z.string().trim().toUpperCase().optional().nullable(),
        applicability: z.enum(['entire_menu', 'categories', 'products']),
        categoryIds: z.array(z.string().regex(objectIdRegex, 'Invalid category ID')).optional().default([]),
        productIds: z.array(z.string().regex(objectIdRegex, 'Invalid product ID')).optional().default([]),
        minOrderAmount: coerceNumber.optional().default(0),
        maxDiscountLimit: coercePositiveNumber.optional().nullable(),
        startDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
        expiryDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().optional().nullable()),
        totalUsageLimit: coercePositiveNumber.optional().nullable(),
        perCustomerUsageLimit: coercePositiveNumber.optional().nullable(),
        isActive: coerceBoolean.optional().default(true),
    })
    .superRefine((data, ctx) => {
        if (data.discountType === 'percentage' && data.discountValue > 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Percentage discount cannot exceed 100%',
                path: ['discountValue'],
            });
        }
        if (data.method === 'coupon' && (!data.couponCode || !data.couponCode.trim())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Coupon code is required for coupon method',
                path: ['couponCode'],
            });
        }
        if (data.applicability === 'categories' && (!data.categoryIds || data.categoryIds.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please select at least one category',
                path: ['categoryIds'],
            });
        }
        if (data.applicability === 'products' && (!data.productIds || data.productIds.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please select at least one product',
                path: ['productIds'],
            });
        }
    });

export const updateDiscountSchema = z
    .object({
        name: z.string().trim().min(2).max(120).optional(),
        description: z.string().trim().max(500).optional().nullable(),
        discountType: z.enum(['percentage', 'flat']).optional(),
        discountValue: coercePositiveNumber.optional(),
        method: z.enum(['automatic', 'coupon']).optional(),
        couponCode: z.string().trim().toUpperCase().optional().nullable(),
        applicability: z.enum(['entire_menu', 'categories', 'products']).optional(),
        categoryIds: z.array(z.string().regex(objectIdRegex)).optional(),
        productIds: z.array(z.string().regex(objectIdRegex)).optional(),
        minOrderAmount: coerceNumber.optional(),
        maxDiscountLimit: coercePositiveNumber.optional().nullable(),
        startDate: z.string().optional().nullable(),
        expiryDate: z.string().optional().nullable(),
        totalUsageLimit: coercePositiveNumber.optional().nullable(),
        perCustomerUsageLimit: coercePositiveNumber.optional().nullable(),
        isActive: coerceBoolean.optional(),
    });

export const calculateCartSchema = z.object({
    items: z.array(
        z.object({
            menuItem: z.string().regex(objectIdRegex, 'Invalid menu item ID').optional(),
            itemId: z.string().regex(objectIdRegex, 'Invalid menu item ID').optional(),
            _id: z.string().regex(objectIdRegex, 'Invalid menu item ID').optional(),
            variant: z.enum(['single', 'half', 'full']).optional().default('single'),
            quantity: z.number().int().positive().default(1),
        })
    ).min(1, 'Cart items are required'),
    couponCode: z.string().trim().optional().nullable(),
    deliveryFee: z.number().min(0).optional().default(0),
});

export const validateCouponSchema = z.object({
    couponCode: z.string().trim().min(1, 'Coupon code is required'),
    items: z.array(
        z.object({
            menuItem: z.string().regex(objectIdRegex).optional(),
            itemId: z.string().regex(objectIdRegex).optional(),
            _id: z.string().regex(objectIdRegex).optional(),
            variant: z.enum(['single', 'half', 'full']).optional().default('single'),
            quantity: z.number().int().positive().default(1),
        })
    ).min(1, 'Cart items are required to validate coupon'),
    deliveryFee: z.number().min(0).optional().default(0),
});

