export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nowPayments, PLANS, type PlanId } from '@/lib/payments/nowpayments';
import { verifyAndActivatePayment, withRetry } from '@/lib/payments/utils';
import { paymentSchema, safeParse } from '@/lib/validation';
import { rateLimit } from '@/lib/ratelimit';
import { requirePlan } from '@/lib/access';
import { logger } from '@/lib/logger';
import { trackServerEvent } from '@/lib/analytics';
import { apiOk, apiErr } from '@/lib/logger';

// POST — Create payment order
export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'payment');
  if (!rl.success) return apiErr('Too many payment requests. Please wait.', 429, 'RATE_LIMITED');

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiErr('Unauthorized', 401);

    const body = await req.json();
    const validation = safeParse(paymentSchema, body);
    if (!validation.success) return apiErr(validation.error, 400, 'VALIDATION_ERROR');

    const { planId, currency } = validation.data;
    const plan = PLANS[planId as PlanId];

    // Check user doesn't already have this plan or higher
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
    const currentPlanRank = { free: 0, pro: 1, premium: 2 }[profile?.plan ?? 'free'] ?? 0;
    const targetPlanRank  = { pro: 1, premium: 2 }[planId] ?? 0;

    if (currentPlanRank >= targetPlanRank) {
      return apiErr(`You already have ${profile?.plan} plan or higher`, 400, 'PLAN_ALREADY_ACTIVE');
    }

    // Check for existing pending order (prevent duplicate payments)
    const { data: existingOrder } = await supabase
      .from('payment_orders')
      .select('id, status, pay_address, pay_amount, provider_order_id, created_at')
      .eq('user_id', user.id)
      .eq('plan', planId)
      .in('status', ['pending', 'waiting', 'confirming'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingOrder) {
      // Return existing pending order if <30 min old
      const age = Date.now() - new Date(existingOrder.created_at).getTime();
      if (age < 30 * 60 * 1000) {
        logger.info('payment_reuse_existing', { orderId: existingOrder.id });
        return apiOk({
          orderId:     existingOrder.id,
          payAddress:  existingOrder.pay_address,
          payAmount:   existingOrder.pay_amount,
          payCurrency: currency,
          priceAmount: plan.price,
          priceCurrency: 'usd',
          expiresAt:   new Date(new Date(existingOrder.created_at).getTime() + 60 * 60 * 1000).toISOString(),
          plan:        { ...plan },
          reused:      true,
        });
      }
    }

    // Create DB order first
    const { data: order, error: orderErr } = await supabase
      .from('payment_orders')
      .insert({ user_id: user.id, plan: planId, amount_usd: plan.price, currency, status: 'pending' })
      .select().single();

    if (orderErr || !order) {
      logger.error('payment_order_create_failed', orderErr);
      return apiErr('Failed to create order', 500);
    }

    // Create NOWPayments payment with retry
    let payment;
    try {
      payment = await withRetry(
        () => nowPayments.createPayment({ planId: planId as PlanId, orderId: order.id, userId: user.id, currency }),
        { attempts: 3, delayMs: 800, label: 'create_nowpayment' }
      );
    } catch (err) {
      // Cleanup order on NOWPayments failure
      await supabase.from('payment_orders').update({ status: 'failed' }).eq('id', order.id);
      logger.error('nowpayments_create_failed', err);
      return apiErr('Payment service unavailable. Please try again.', 503, 'PAYMENT_SERVICE_ERROR');
    }

    // Update order with payment details
    await supabase.from('payment_orders').update({
      provider_order_id: payment.payment_id,
      pay_address:       payment.pay_address,
      pay_amount:        payment.pay_amount,
      status:            'waiting',
      metadata: {
        payment_id:   payment.payment_id,
        pay_currency: payment.pay_currency,
        expiration:   payment.expiration_estimate_date,
      },
    }).eq('id', order.id);

    await supabase.from('security_logs').insert({
      user_id: user.id,
      event:   `Payment initiated: ${plan.name} ($${plan.price})`,
      type:    'info',
      metadata: { order_id: order.id, plan: planId },
    });

    await trackServerEvent('payment_initiated', user.id, { plan: planId, currency });
    logger.info('payment_created', { orderId: order.id, userId: user.id, plan: planId });

    return apiOk({
      orderId:       order.id,
      paymentId:     payment.payment_id,
      payAddress:    payment.pay_address,
      payAmount:     payment.pay_amount,
      payCurrency:   payment.pay_currency,
      priceAmount:   payment.price_amount,
      priceCurrency: payment.price_currency,
      expiresAt:     payment.expiration_estimate_date,
      plan:          { ...plan },
    });

  } catch (err) {
    logger.error('payment_create_route_error', err);
    return apiErr('Unexpected error. Please try again.', 500);
  }
}

// GET — Poll payment status (with backup verification)
export async function GET(req: NextRequest) {
  const rl = await rateLimit(req, 'api');
  if (!rl.success) return apiErr('Too many requests', 429);

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiErr('Unauthorized', 401);

    const orderId = req.nextUrl.searchParams.get('orderId');
    if (!orderId) return apiErr('Missing orderId', 400);

    const { data: order } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (!order) return apiErr('Order not found', 404);

    // Poll NOWPayments if not in terminal state
    if (order.provider_order_id && !['finished','failed','refunded','expired'].includes(order.status)) {
      try {
        const npStatus = await nowPayments.getPaymentStatus(order.provider_order_id);
        const newStatus = npStatus.payment_status;

        if (newStatus !== order.status) {
          await supabase.from('payment_orders').update({
            status:        newStatus,
            actually_paid: npStatus.actually_paid ?? order.actually_paid,
            updated_at:    new Date().toISOString(),
          }).eq('id', orderId);

          // Activate if confirmed
          if (newStatus === 'finished' || newStatus === 'confirmed') {
            await verifyAndActivatePayment(orderId, order.provider_order_id, user.id, order.plan);
          }

          return apiOk({ status: newStatus, order: { ...order, status: newStatus } });
        }
      } catch (err) {
        logger.warn('payment_poll_failed', { orderId, err: String(err) });
      }
    }

    return apiOk({ status: order.status, order });
  } catch (err) {
    logger.error('payment_poll_route_error', err);
    return apiErr('Status check failed', 500);
  }
}
