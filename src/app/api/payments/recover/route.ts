export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { recoverPendingPayments } from '@/lib/payments/utils';
import { apiOk, apiErr } from '@/lib/logger';
import { logger } from '@/lib/logger';

// Called by: Vercel Cron, manual admin, or external cron service
// Vercel cron.json: { "crons": [{ "path": "/api/payments/recover", "schedule": "*/15 * * * *" }] }
export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  const expected = process.env.WEBHOOK_SECRET;

  if (expected && secret !== expected) {
    logger.warn('recovery_unauthorized');
    return apiErr('Unauthorized', 401);
  }

  try {
    const result = await recoverPendingPayments();
    logger.info('recovery_complete', result);
    return apiOk(result);
  } catch (err) {
    logger.error('recovery_endpoint_error', err);
    return apiErr('Recovery failed', 500);
  }
}
