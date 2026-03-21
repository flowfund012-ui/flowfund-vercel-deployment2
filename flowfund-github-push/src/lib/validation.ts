import { z } from 'zod';

// ── Auth ──────────────────────────────────────────────────────
export const signupSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(80).trim(),
  email:    z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

export const loginSchema = z.object({
  email:    z.string().email('Invalid email').toLowerCase().trim(),
  password: z.string().min(1, 'Password required'),
});

// ── Transactions ──────────────────────────────────────────────
export const transactionSchema = z.object({
  type:        z.enum(['income', 'expense']),
  description: z.string().min(1, 'Description required').max(200).trim(),
  amount:      z.number().positive('Amount must be positive').max(999_999_999),
  category:    z.enum(['Food','Transport','Housing','Entertainment','Health','Business','Savings','Other']),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  notes:       z.string().max(500).default(''),
});
export type TransactionInput = z.infer<typeof transactionSchema>;

// ── Goals ─────────────────────────────────────────────────────
export const goalSchema = z.object({
  name:           z.string().min(1, 'Name required').max(100).trim(),
  category:       z.string().max(50).default('💰 Custom'),
  target_amount:  z.number().positive('Target must be positive').max(999_999_999),
  current_amount: z.number().min(0).max(999_999_999).default(0),
  deadline:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
});
export type GoalInput = z.infer<typeof goalSchema>;

// ── Revenue ───────────────────────────────────────────────────
export const revenueSchema = z.object({
  source: z.string().min(1, 'Source required').max(100).trim(),
  amount: z.number().positive('Amount must be positive').max(999_999_999),
  type:   z.enum(['Recurring','One-time','Product Sale','Affiliate','Service']).default('One-time'),
  date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type RevenueInput = z.infer<typeof revenueSchema>;

// ── AutoPilot ─────────────────────────────────────────────────
export const autopilotSchema = z.object({
  smart_save:      z.boolean(),
  smart_save_pct:  z.number().int().min(1).max(100),
  auto_invest:     z.boolean(),
  auto_invest_pct: z.number().int().min(1).max(100),
});
export type AutopilotInput = z.infer<typeof autopilotSchema>;

// ── Profile ───────────────────────────────────────────────────
export const profileSchema = z.object({
  full_name: z.string().min(2).max(80).trim().optional(),
});

// ── Payment ───────────────────────────────────────────────────
export const paymentSchema = z.object({
  planId:   z.enum(['pro', 'premium']),
  currency: z.string().min(2).max(20).toLowerCase().default('btc'),
});
export type PaymentInput = z.infer<typeof paymentSchema>;

// ── IPN Webhook ───────────────────────────────────────────────
export const ipnSchema = z.object({
  payment_id:     z.string(),
  payment_status: z.string(),
  order_id:       z.string().uuid(),
  actually_paid:  z.number().optional(),
  pay_currency:   z.string().optional(),
  price_amount:   z.number().optional(),
});

// ── Helpers ───────────────────────────────────────────────────
export function formatZodError(error: z.ZodError): string {
  return error.errors.map(e => e.message).join('. ');
}

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: formatZodError(result.error) };
}
