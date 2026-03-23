export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { nowPayments } from '@/lib/payments/nowpayments';
import { verifyAndActivatePayment, TERMINAL_STATUSES } from '@/lib/payments/utils';
import { ipnSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';
import { trackServerEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'webhook');
  if (!rl.success) return new NextResponse('Too many requests', { status: 429 });

  const bodyText = await req.text();
  const signature = req.headers.get('x-nowpayments-sig') ?? '';

  if (!signature) {
    logger.warn('webhook_missing_signature');
    return new NextResponse('Missing signature', { status: 403 });
  }

  let parsed: Record<string, unknown>;
  try { parsed = JSON.parse(bodyText); }
  catch { return new NextResponse('Invalid JSON', { status: 400 }); }

  const sortedBody = JSON.stringify(
    Object.fromEntries(Object.entries(parsed).sort(([a], [b]) => a.localeCompare(b)))
  );

  if (!nowPayments.verifyIPN(signature, sortedBody)) {
    logger.warn('webhook_signature_invalid');
    return new NextResponse('Invalid signature', { status: 403 });
  }

  const validation = ipnSchema.safeParse(parsed);
  if (!validation.success) {
    logger.warn('webhook_invalid_payload');
    return new NextResponse('Invalid payload', { status: 400 });
  }

  const { payment_id, payment_status, order_id, actually_paid, pay_currency } = validation.data;
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from('payment_orders').select('*').eq('id', order_id).single();

  if (!order) {
    logger.warn('webhook_order_not_found', { order_id });
    return NextResponse.json({ received: true });
  }

  if (TERMINAL_STATUSES.has(order.status) && order.status === payment_status) {
    return NextResponse.json({ received: true, note: 'already_processed' });
  }

  logger.info('webhook_received', { order_id, payment_id, payment_status });

  await supabase.from('payment_orders').update({
    status: payment_status,
    provider_order_id: payment_id,
    actually_paid: actually_paid ?? order.actually_paid,
    metadata: {
      ...((order.metadata as object) ?? {}),
      pay_currency,
      last_ipn: new Date().toISOString(),
      ipn_count: ((order.metadata as Record<string, number>)?.ipn_count ?? 0) + 1,
    },
    updated_at: new Date().toISOString(),
  }).eq('id', order_id);

  if (payment_status === 'finished' || payment_status === 'confirmed') {
    const { activated } = await verifyAndActivatePayment(order_id, payment_id, order.user_id, order.plan);
    if (activated) {
      await supabase.from('security_logs').insert({
        user_id: order.user_id,
        event: `Payment confirmed — ${order.plan} plan activated`,
        type: 'success',
        metadata: { payment_id, order_id },
      });
      await trackServerEvent('payment_completed', order.user_id, { plan: order.plan });
    }
  }

  if (nowPayments.isFailed(payment_status)) {
    await supabase.from('security_logs').insert({
      user_id: order.user_id,
      event: `Payment ${payment_status}: order ${order_id}`,
      type: 'error',
    });
    await trackServerEvent('payment_failed', order.user_id, { plan: order.plan, status: payment_status });
  }

  return NextResponse.json({ received: true });
}
