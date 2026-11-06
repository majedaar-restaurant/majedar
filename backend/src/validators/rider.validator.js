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
        email: z.string().trim().toLowerCase().email('Please provide a valid email address').optional(),
        password: z.string().min(8, 'Password must be at least 8 characters long').max(128).optional(),
        isActive: coerceBoolean.optional().default(true),
    })
    .strip()
    .superRefine((value, ctx) => {
        if (Boolean(value.email) !== Boolean(value.password)) {
            ctx.addIssue({ code: 'custom', message: 'Email and password must both be provided to create a rider login.' });
        }
    });

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
        email: z.string().trim().toLowerCase().email('Please provide a valid email address').optional(),
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
        availability: z.enum(['available', 'busy', 'unavailable']).optional(),
        search: z.string().trim().optional(),
    })
    .strip();

export const riderLoginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required').max(128),
}).strip();

export const riderGoogleLoginSchema = z.object({
    idToken: z.string().min(1, 'Google credential is required').max(10000),
}).strip();

export const riderAvailabilitySchema = z.object({
    availability: z.enum(['available', 'busy', 'unavailable']),
}).strip();

export const riderAssignmentResponseSchema = z.object({
    decision: z.enum(['accept', 'reject']),
    reason: z.string().trim().min(3).max(500).optional(),
}).strip().superRefine((value, ctx) => {
    if (value.decision === 'reject' && !value.reason) {
        ctx.addIssue({ code: 'custom', message: 'A reason is required to reject an assignment.' });
    }
});

export const riderDeliveryStatusSchema = z.object({
    status: z.enum(['picked_up', 'out_for_delivery', 'delivered', 'failed']),
    reason: z.enum(['Customer unreachable', 'Customer unavailable', 'Wrong address', 'Customer refused', 'Other']).optional(),
    remarks: z.string().trim().max(1000).optional(),
    collection: z.object({
        amount: z.number().positive().finite(),
        method: z.enum(['cash', 'upi']),
    }).optional(),
}).strip().superRefine((value, ctx) => {
    if (value.status === 'failed' && !value.reason) {
        ctx.addIssue({ code: 'custom', message: 'A failure reason is required.' });
    }
    if (value.status === 'failed' && value.reason === 'Other' && !value.remarks) {
        ctx.addIssue({ code: 'custom', message: 'Remarks are required when the failure reason is Other.' });
    }
    if (value.status !== 'delivered' && value.collection) {
        ctx.addIssue({ code: 'custom', message: 'COD collection details are only accepted when marking an order delivered.' });
    }
});

export const riderCodCollectionSchema = z.object({
    amount: z.number().positive().finite(),
    method: z.enum(['cash', 'upi']),
}).strip();

export const riderLocationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
}).strip();

export const riderProfileSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().regex(phoneRegex, 'Invalid Indian phone number format').optional(),
}).strip().refine((value) => Object.keys(value).length > 0, 'At least one profile field is required.');

export const riderPasswordSchema = z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
}).strip();

export const riderEmailChangeSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
}).strip();

export const riderEmailVerificationSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Verification code must contain six digits.'),
}).strip();

export const riderNotificationParamSchema = z.object({
    notificationId: z.string().regex(objectIdRegex, 'Invalid notification ID format.'),
});

export const riderPasswordResetSchema = z.object({
    password: z.string().min(8).max(128),
}).strip();

export const codCollectionParamSchema = z.object({
    id: z.string().regex(objectIdRegex, 'Invalid order ID format.'),
    collectionIndex: z.coerce.number().int().min(0),
});
