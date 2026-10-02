import { z } from 'zod';
import { objectIdRegex } from './category.validator.js';

export const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const riderIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, 'Invalid rider ID format'),
});

const coerceBoolean = z.union([
    z.boolean(),
    z.string().transform((val) => val === 'true' || val === '1'),
]);

export const createRiderSchema = z
    .object({
        name: z
            .string({ required_error: 'Rider name is required' })
            .trim()
            .min(2, 'Rider name must be at least 2 characters long')
            .max(100, 'Rider name cannot exceed 100 characters'),
        phone: z
            .string({ required_error: 'Phone number is required' })
            .trim()
            .regex(phoneRegex, 'Invalid Indian phone number format (10 digits starting with 6-9)'),
        isActive: coerceBoolean.optional().default(true),
    })
    .strip();

export const updateRiderSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Rider name must be at least 2 characters long')
            .max(100, 'Rider name cannot exceed 100 characters')
            .optional(),
        phone: z
            .string()
            .trim()
            .regex(phoneRegex, 'Invalid Indian phone number format (10 digits starting with 6-9)')
            .optional(),
        isActive: coerceBoolean.optional(),
    })
    .strip();

export const assignRiderSchema = z
    .object({
        riderId: z
            .string({ required_error: 'Rider ID is required' })
            .regex(objectIdRegex, 'Invalid rider ID format')
            .nullable(),
    })
    .strip();

export const riderQuerySchema = z
    .object({
        isActive: coerceBoolean.optional(),
        search: z.string().trim().optional(),
    })
    .strip();
