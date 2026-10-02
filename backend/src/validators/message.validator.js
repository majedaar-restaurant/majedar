import { z } from 'zod';
import { objectIdRegex } from './category.validator.js';

export const messageIdParamSchema = z.object({
    id: z.string().regex(objectIdRegex, 'Invalid message ID format'),
});

export const createMessageSchema = z
    .object({
        type: z
            .enum(['complaint', 'suggestion', 'query'], {
                message: 'Type must be one of: complaint, suggestion, query',
            })
            .default('query'),
        message: z
            .string({ required_error: 'Message content is required' })
            .trim()
            .min(5, 'Message must be at least 5 characters long')
            .max(2000, 'Message cannot exceed 2000 characters'),
    })
    .strip();

export const updateMessageStatusSchema = z
    .object({
        status: z.enum(['new', 'read', 'resolved'], {
            message: 'Status must be one of: new, read, resolved',
        }),
    })
    .strip();

export const messageQuerySchema = z
    .object({
        status: z.enum(['new', 'read', 'resolved']).optional(),
        type: z.enum(['complaint', 'suggestion', 'query', 'order_issue']).optional(),
        search: z.string().trim().optional(),
        datePreset: z.enum(['today', 'this-week', 'this_week', 'custom']).optional(),
        dateFrom: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom must be in YYYY-MM-DD format')
            .optional(),
        dateTo: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo must be in YYYY-MM-DD format')
            .optional(),
        page: z
            .union([z.number().int().min(1), z.string().transform((v) => parseInt(v, 10))])
            .optional(),
        limit: z
            .union([z.number().int().min(1).max(100), z.string().transform((v) => parseInt(v, 10))])
            .optional(),
    })
    .refine(
        (data) => {
            if (data.dateFrom && data.dateTo) {
                return data.dateFrom <= data.dateTo;
            }
            return true;
        },
        {
            message: 'dateFrom cannot be after dateTo',
            path: ['dateFrom'],
        }
    )
    .strip();
