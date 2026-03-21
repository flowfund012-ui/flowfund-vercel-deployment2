import { nowPayments } from './nowpayments';
import { logger } from '@/lib/logger';

const TERMINAL_STATUSES = new Set(['finished','failed','refunded','expired','partially_paid']);
const SUCCESS_STATUSES   = new Set(['finished']);

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { attempts?: number; delayMs?: number; label?: string } = {}
): Promise<T> {
  const { attempts = 3, delayMs = 500, label = 'operation' } = opts;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        const wait = delayMs * Math.pow(2, i);
        logger.warn(`retry_attempt`, { label, attempt: i + 1, wait });
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  throw lastErr;
}

export async function activatePlanSafe(orderId: string, userId: string, plan: string): Promise<boolean> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();

  const { data: order } = await supabase
    .from('payment_orders').select('status, plan, user_id').eq('id', orderId).single();

  if (!order) { logger.error('activate_plan_order_not_found', undefined, { orderId }); return false; }
  if (order.user_id !== userId) { logger.error('activate_plan_user_mismatch', undefined, { orderId }); return false; }
  if (order.status === 'finished') { return true; }

  await supabase.from('payment_orders').update({
    status: 'finished', updated_at: new Date().toISOString()
  }).eq('id', orderId).neq('status', 'finished');

  const { error: profileErr } = await supabase.from('profiles').update({
    plan,
    plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', userId);

  if (profileErr) { logger.error('activate_plan_profile_error', profileErr, { userId, plan }); return false; }
  logger.info('plan_activated', { userId, plan, orderId });
  return true;
}

export async function verifyAndActivatePayment(
  orderId: string, nowPaymentId: string, userId: string, plan: string
): Promise<{ activated: boolean; status: string }> {
  try {
    const status = await withRetry(
      () => nowPayments.getPaymentStatus(nowPaymentId),
      { attempts: 3, delayMs: 1000, label: 'verify_payment_status' }
    );
    if (SUCCESS_STATUSES.has(status.payment_status)) {
      const activated = await activatePlanSafe(orderId, userId, plan);
      return { activated, status: status.payment_status };
    }
    return { activated: false, status: status.payment_status };
  } catch (err) {
    logger.error('payment_verification_failed', err, { orderId, nowPaymentId });
    return { activated: false, status: 'verification_failed' };
  }
}

export async function recoverPendingPayments(): Promise<{ recovered: number; errors: number }> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  let recovered = 0, errors = 0;
  try {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: stuckOrders } = await supabase
      .from('payment_orders').select('*')
      .not('status', 'in', `(${[...TERMINAL_STATUSES].join(',')})`)
      .not('provider_order_id', 'is', null)
      .lt('created_at', cutoff).limit(50);

    if (!stuckOrders?.length) return { recovered, errors };

    for (const order of stuckOrders) {
      try {
        const status = await withRetry(
          () => nowPayments.getPaymentStatus(order.provider_order_id!),
          { attempts: 2, delayMs: 500, label: `recover_${order.id}` }
        );
        await supabase.from('payment_orders').update({
          status: status.payment_status,
          actually_paid: status.actually_paid ?? order.actually_paid,
          updated_at: new Date().toISOString(),
        }).eq('id', order.id);
        if (SUCCESS_STATUSES.has(status.payment_status)) {
          const activated = await activatePlanSafe(order.id, order.user_id, order.plan);
          if (activated) recovered++;
        }
      } catch (err) {
        errors++;
        logger.error('payment_recovery_item_failed', err, { orderId: order.id });
      }
    }
  } catch (err) {
    logger.error('payment_recovery_failed', err);
  }
  return { recovered, errors };
}

export { TERMINAL_STATUSES, SUCCESS_STATUSES };
