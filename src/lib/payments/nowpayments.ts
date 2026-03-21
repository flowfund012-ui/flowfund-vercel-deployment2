/**
 * NOWPayments Integration — v3 (fetch-based, no axios)
 * Real keys configured via environment variables
 */

import { createHmac } from 'crypto';
import { logger } from '@/lib/logger';

const NOWPAYMENTS_API = 'https://api.nowpayments.io/v1';

export const PLANS = {
  pro: {
    id: 'pro',
    name: 'FlowFund Pro',
    price: 9.00,
    currency: 'USD',
    features: ['All 6 modules', 'Real-time sync', 'Advanced charts', 'Export data'],
  },
  premium: {
    id: 'premium',
    name: 'FlowFund Premium',
    price: 19.00,
    currency: 'USD',
    features: ['Everything in Pro', 'Growth Engine', 'Vault Access', 'Lifetime updates'],
  },
} as const;

export type PlanId = keyof typeof PLANS;

export interface NOWPaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  expiration_estimate_date: string;
}

async function npFetch(endpoint: string, options?: RequestInit) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey || apiKey === 'placeholder') {
    throw new Error('NOWPayments API key not configured');
  }
  const res = await fetch(`${NOWPAYMENTS_API}${endpoint}`, {
    ...options,
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NOWPayments API error ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export const nowPayments = {
  async createPayment(opts: {
    planId: PlanId;
    orderId: string;
    userId: string;
    currency?: string;
  }): Promise<NOWPaymentResponse> {
    const plan = PLANS[opts.planId];
    const currency = opts.currency || 'btc';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://flowfund-v3.vercel.app';

    const data = await npFetch('/payment', {
      method: 'POST',
      body: JSON.stringify({
        price_amount: plan.price,
        price_currency: 'usd',
        pay_currency: currency,
        order_id: opts.orderId,
        order_description: `${plan.name} - ${opts.userId.slice(0, 8)}`,
        ipn_callback_url: `${appUrl}/api/webhooks/nowpayments`,
        success_url: `${appUrl}/dashboard/settings?payment=success`,
        cancel_url: `${appUrl}/dashboard/settings?payment=cancelled`,
      }),
    });

    logger.info('nowpayments_created', { paymentId: data.payment_id, plan: opts.planId });
    return data;
  },

  async getPaymentStatus(paymentId: string) {
    return npFetch(`/payment/${paymentId}`);
  },

  async getCurrencies(): Promise<string[]> {
    const data = await npFetch('/currencies');
    return data.currencies ?? [];
  },

  verifyIPN(receivedHmac: string, sortedBody: string): boolean {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) return false;
    const hmac = createHmac('sha512', secret);
    hmac.update(sortedBody);
    return receivedHmac === hmac.digest('hex');
  },

  isCompleted(status: string): boolean {
    return status === 'finished';
  },

  isFailed(status: string): boolean {
    return ['failed', 'refunded', 'expired'].includes(status);
  },
};
