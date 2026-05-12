// Zod validators shared between client (React Hook Form) and server (Server Actions).
// One source of truth for input shapes.

import { z } from 'zod';
import { ALL_SLUGS } from '@/lib/slugs';

const transactionSideEnum = z.enum(['buy', 'sell', 'short_open', 'short_close']);

// Validate that the slug exists in our 19-asset registry.
const assetSlugSchema = z
  .string()
  .min(1, 'Pick an asset')
  .refine((s) => ALL_SLUGS.includes(s), {
    message: 'Asset is not in the supported list',
  });

// Date: YYYY-MM-DD. We don't allow future dates more than 1 day ahead (TZ flex).
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .refine((d) => {
    const parsed = new Date(d + 'T00:00:00Z');
    if (Number.isNaN(parsed.getTime())) return false;
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(23, 59, 59, 999);
    return parsed <= tomorrow;
  }, 'Date cannot be in the future');

export const transactionInputSchema = z.object({
  assetSlug: assetSlugSchema,
  side: transactionSideEnum,
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .positive('Quantity must be greater than zero')
    .finite(),
  priceUsd: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .finite(),
  transactionDate: dateSchema,
  note: z
    .string()
    .max(500, 'Note must be 500 characters or less')
    .nullish()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
});

export type TransactionFormInput = z.input<typeof transactionInputSchema>;
export type TransactionFormParsed = z.output<typeof transactionInputSchema>;

export const assetRequestSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, 'Enter a ticker')
    .max(12, 'Ticker must be 12 chars or less')
    .regex(/^[A-Za-z0-9.\-]+$/, 'Letters, numbers, dot, dash only'),
});

export const accountUpdateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(50, 'Name must be 50 characters or less')
    .nullish()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
});
