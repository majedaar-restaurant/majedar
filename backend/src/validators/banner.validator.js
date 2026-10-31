import { z } from 'zod';
import { objectIdRegex } from './category.validator.js';

export const bannerIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, 'Invalid banner ID format'),
});

const coerceNumber = z.union([
    z.number(),
    z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
        message: 'Must be a valid integer',
    }),
]);

const coerceBoolean = z.union([
    z.boolean(),
    z.string().transform((val) => val === 'true' || val === '1'),
]);

const optionalObjectId = z.string().regex(objectIdRegex).optional().nullable().or(z.literal(''));

export const createBannerSchema = z.object({
    title: z.string().trim().max(150).optional().nullable(),
    description: z.string().trim().max(300).optional().nullable(),
    isActive: coerceBoolean.optional().default(true),
    priority: coerceNumber.optional().default(0),
    discount: optionalObjectId,
    category: optionalObjectId,
    product: optionalObjectId,
    menuSection: z.string().trim().optional().default('all'),
});

export const updateBannerSchema = z.object({
    title: z.string().trim().max(150).optional().nullable(),
    description: z.string().trim().max(300).optional().nullable(),
    isActive: coerceBoolean.optional(),
    priority: coerceNumber.optional(),
    discount: optionalObjectId,
    category: optionalObjectId,
    product: optionalObjectId,
    menuSection: z.string().trim().optional(),
});

