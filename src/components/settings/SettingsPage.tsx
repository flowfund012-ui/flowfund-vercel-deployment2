'use client';

import { useState, useCallback } from 'react';
import type { Profile, PaymentOrder } from '@/types/database';
import type { User } from '@supabase/supabase-js';
import { fm, fd } from '@/lib/utils';
import { StatCard, Badge, Spinner } from '@/components/ui';
import { PLANS, type PlanId } from '@/lib/payments/nowpayments';
import { updateProfile } from '@/app/actions';
import { useUIStore } from '@/store/useUIStore';
import { analytics } from '@/lib/analytics';
import { profileSchema } from '@/lib/validation';

interface Props { profile: Profile | null; orders: PaymentOrder[]; user: User; }

const PLAN_FEATURES = {
  free:    ['Dashboard & Mission Tracker', 'AutoPilot (basic)', 'Academy (3 free courses)', 'Vault (2 assets)', 'Security Hub'],
  pro:     ['Everything in Free', 'Growth Engine', 'Academy (all 5 courses)', 'Vault (4 assets)', 'Advanced charts', 'CSV export', '5,000 transactions'],
  premium: ['Everything in Pro', 'Full Vault Access (6 assets)', 'Hidden Vault unlocked', 'All 6 Academy courses', 'Unlimited transactions', 'Priority support', 'Lifetime updates'],
};

const CURRENCIES = [
  { value: 'btc',       label: 'Bitcoin (BTC)'      },
  { value: 'eth',       label: 'Ethereum (ETH)'     },
  { value: 'usdttrc20', label: 'USDT (TRC20)'       },
  { value: 'usdcerc20', label: 'USDC (ERC20)'       },
  { value: 'ltc',       label: 'Litecoin (LTC)'     },
  { value: 'sol',       label: 'Solana (SOL)'       },
  { value: 'bnbbsc',    label: 'BNB (BSC)'          },
  { value: 'matic',     label: 'Polygon (MATIC)'    },
  { value: 'doge',      label: 'Dogecoin (DOGE)'    },
];

type PayStep = 'select' | 'paying';

export default function SettingsPage({ profile, orders, user }: Props) {
  const { showToast } = useUIStore();
  const [name,      setName]      = useState(profile?.full_name ?? '');
  const [saving,    setSaving]    = useState(false);
  const [currency,  setCurrency]  = useState('btc');
  const [payFlow,   setPayFlow]   = useState<{ planId: PlanId; step: PayStep } | null>(null);
  const [payData,   setPayData]   = useState<{ payAddress: string; payAmount: number; payCurrency: string; expiresAt: string; orderId: string } | null>(null);
  const [creating,  setCreating]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [pollTimer, setPollTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  const currentPlan = profile?.plan ?? 'free';

  // ── Profile save ──────────────────────────────────────────
  const handleSaveName = async () => {
    const parsed = profileSchema.safeParse({ full_name: name.trim() });
    if (!parsed.success) { showToast(parsed.error.errors[0]?.message ?? 'Invalid name', 'error'); return; }
    setSaving(true);
    const res = await updateProfile({ full_name: name.trim() });
    setSaving(false);
    if (res?.error) showToast(res.error, 'error');
    else showToast('Profile updated!', 'success');
  };

  // ── Start payment flow ────────────────────────────────────
  const handleStartPayment = (planId: PlanId) => {
    analytics.paymentInitiated(planId, currency);
    setPayFlow({ planId, step: 'select' });
  };

  // ── Create NOWPayments order ──────────────────────────────
  const handleCreateOrder = async () => {
    if (!payFlow) return;
    setCreating(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: payFlow.planId, currency }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Payment creation failed');

      const data = json.data ?? json;
      setPayData({
        payAddress: data.payAddress,
        payAmount:  data.payAmount,
        payCurrency: data.payCurrency,
        expiresAt:  data.expiresAt,
        orderId:    data.orderId,
      });
      setPayFlow(prev => prev ? { ...prev, step: 'paying' } : null);

      // Poll every 15s for confirmation
      const interval = setInterval(async () => {
        try {
          const sr = await fetch(`/api/payments/create-order?orderId=${data.orderId}`);
          const sd = await sr.json();
          const status = sd.data?.status ?? sd.status;
          if (status === 'finished') {
            clearInterval(interval);
            analytics.paymentCompleted(payFlow.planId, PLANS[payFlow.planId].price);
            showToast(`🎉 ${PLANS[payFlow.planId].name} activated! Refreshing...`, 'gold');
            setTimeout(() => window.location.reload(), 2000);
          } else if (['failed','expired','refunded'].includes(status)) {
            clearInterval(interval);
            showToast('Payment failed or expired. Please try again.', 'error');
            cancelPayment();
          }
        } catch { /* silent poll failure */ }
      }, 15_000);

      setPollTimer(interval);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Payment failed', 'error');
    } finally {
      setCreating(false);
    }
  };

  // ── Cancel ────────────────────────────────────────────────
  const cancelPayment = useCallback(() => {
    if (pollTimer) clearInterval(pollTimer);
    setPayFlow(null);
    setPayData(null);
    setCopied(false);
  }, [pollTimer]);

  // ── Copy address ──────────────────────────────────────────
  const copyAddress = () => {
    if (!payData?.payAddress) return;
    navigator.clipboard.writeText(payData.payAddress).then(() => {
      setCopied(true);
      showToast('Address copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const panel = { background: 'rgba(15,20,35,.6)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 24 };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 5 }}>Settings & Billing</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage your account and subscription.</p>
      </div>

      {/* Profile + Current Plan row */}
      <div className="g2" style={{ marginBottom: 24 }}>
        <div style={panel}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff', marginBottom: 18 }}>👤 Profile</div>
          <div className="ff-group">
            <label className="ff-label">Full Name</label>
            <input className="ff-input" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); }} />
          </div>
          <div className="ff-group">
            <label className="ff-label">Email</label>
            <input className="ff-input" value={user.email ?? ''} disabled
              style={{ opacity: .55, cursor: 'not-allowed' }} />
          </div>
          <button className="btn btn-cyan btn-sm" onClick={handleSaveName} disabled={saving}>
            {saving ? <><Spinner size={12} /> Saving...</> : <><i className="fas fa-save" /> Save Changes</>}
          </button>
        </div>

        <div style={panel}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff', marginBottom: 18 }}>💳 Current Plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,215,0,.1)', border: '1px solid rgba(255,215,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {currentPlan === 'premium' ? '👑' : currentPlan === 'pro' ? '⚡' : '🆓'}
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, color: '#ffd700', textTransform: 'capitalize' }}>{currentPlan}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 3 }}>
                {profile?.plan_expires_at
                  ? `Active until: ${fd(profile.plan_expires_at)}`
                  : currentPlan === 'free' ? 'Free forever' : 'Lifetime access'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 10 }}>Included features:</div>
          {PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES]?.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 7, color: 'rgba(255,255,255,.65)' }}>
              <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: 11 }} />{f}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade plans */}
      {currentPlan !== 'premium' && (
        <div style={panel}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#ffd700', marginBottom: 18 }}>🚀 Upgrade Your Plan</div>

          <div style={{ background: 'rgba(255,215,0,.05)', border: '1px solid rgba(255,215,0,.14)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: 'rgba(255,215,0,.8)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <i className="fab fa-bitcoin" style={{ marginTop: 1, flexShrink: 0 }} />
            <span>Zero-KYC crypto payments via NOWPayments. BTC, ETH, USDT, USDC and 150+ coins. Works globally. No registration required.</span>
          </div>

          <div className="g2">
            {(['pro', 'premium'] as PlanId[]).filter(p => p !== currentPlan as PlanId).map(planId => {
              const plan = PLANS[planId];
              const isPremium = planId === 'premium';
              return (
                <div key={planId} className="plan-card" style={{
                  background: isPremium ? 'rgba(255,215,0,.04)' : 'rgba(15,20,35,.7)',
                  ...(isPremium ? { borderColor: 'rgba(255,215,0,.3)' } : {}),
                }}>
                  {isPremium && <div className="plan-badge">BEST VALUE</div>}
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, marginBottom: 8 }}>
                    {isPremium ? '👑' : '⚡'} {plan.name}
                  </div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 36, fontWeight: 700, color: isPremium ? '#ffd700' : '#00f2ff', marginBottom: 4 }}>
                    ${plan.price}
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', fontWeight: 400 }}> once</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 16 }}>Lifetime access · One-time payment</div>

                  {PLAN_FEATURES[planId].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 7, color: 'rgba(255,255,255,.65)' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: 11 }} />{f}
                    </div>
                  ))}

                  <button
                    className={`btn ${isPremium ? 'btn-gold' : 'btn-primary'} btn-block btn-sm`}
                    style={{ marginTop: 20 }}
                    onClick={() => handleStartPayment(planId)}
                  >
                    <i className="fab fa-bitcoin" /> Pay with Crypto — ${plan.price}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order history */}
      {orders.length > 0 && (
        <div style={{ ...panel, marginTop: 24 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff', marginBottom: 16 }}>📋 Payment History</div>
          <div className="ff-table-wrap">
            <table className="ff-table">
              <thead><tr><th>Date</th><th>Plan</th><th>Amount</th><th>Currency</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{fd(o.created_at)}</td>
                    <td style={{ textTransform: 'capitalize', color: '#e2e8f0' }}>{o.plan}</td>
                    <td style={{ fontFamily: "'Roboto Mono',monospace" }}>{fm(Number(o.amount_usd))}</td>
                    <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{o.currency}</td>
                    <td>
                      <Badge variant={o.status === 'finished' ? 'green' : ['waiting','confirming','confirmed'].includes(o.status) ? 'gold' : o.status === 'pending' ? 'gray' : 'red'}>
                        {o.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment modal */}
      {payFlow && (
        <div className="ff-modal-overlay" onClick={e => { if (e.target === e.currentTarget) cancelPayment(); }}>
          <div className="ff-modal" style={{ maxWidth: 520 }}>
            <div className="ff-modal-hdr">
              <span className="ff-modal-title">
                <i className="fab fa-bitcoin" style={{ marginRight: 8 }} />
                Crypto Payment — {PLANS[payFlow.planId].name}
              </span>
              <button className="ff-modal-x" onClick={cancelPayment}>✕</button>
            </div>

            {/* Step 1: Select currency */}
            {payFlow.step === 'select' && (
              <>
                <div style={{ background: 'rgba(255,215,0,.06)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 15, color: '#ffd700', marginBottom: 6 }}>
                    {PLANS[payFlow.planId].name} — ${PLANS[payFlow.planId].price} USD
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>
                    One-time payment. Lifetime access. No subscription.
                  </p>
                </div>

                <div className="ff-group">
                  <label className="ff-label">Select Cryptocurrency</label>
                  <select className="ff-input" value={currency} onChange={e => setCurrency(e.target.value)}>
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
                  <i className="fas fa-shield-alt" style={{ color: '#10b981', marginRight: 6 }} />
                  Secured by NOWPayments. Your plan activates automatically once confirmed on-chain (usually 1–10 min).
                  No account required. 150+ coins accepted.
                </div>

                <button
                  className="btn btn-gold btn-block"
                  onClick={handleCreateOrder}
                  disabled={creating}
                >
                  {creating
                    ? <><Spinner size={14} /> Generating address...</>
                    : <>Generate Payment Address <i className="fas fa-arrow-right" /></>}
                </button>
              </>
            )}

            {/* Step 2: Show address */}
            {payFlow.step === 'paying' && payData && (
              <>
                {/* Amount to send */}
                <div style={{ textAlign: 'center', background: 'rgba(255,215,0,.05)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 12, padding: '20px 16px', marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6, fontFamily: "'Orbitron',sans-serif", letterSpacing: '.06em' }}>SEND EXACTLY</div>
                  <div style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 28, fontWeight: 700, color: '#ffd700' }}>
                    {payData.payAmount}
                  </div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, color: '#ffd700', marginBottom: 4 }}>
                    {payData.payCurrency.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
                    ≈ ${PLANS[payFlow.planId].price} USD
                  </div>
                </div>

                {/* Address */}
                <div className="ff-group">
                  <label className="ff-label">Payment Address</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <code style={{ flex: 1, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#00f2ff', fontFamily: "'Roboto Mono',monospace", wordBreak: 'break-all', lineHeight: 1.6 }}>
                      {payData.payAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className={`copy-btn ${copied ? 'copied' : ''}`}
                      data-tooltip={copied ? 'Copied!' : 'Copy address'}
                      style={{ flexShrink: 0, padding: '12px 14px' }}
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div style={{ background: 'rgba(255,152,0,.06)', border: '1px solid rgba(255,152,0,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'rgba(255,152,0,.85)', lineHeight: 1.7 }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: 6 }} />
                  Send <strong>exactly {payData.payAmount} {payData.payCurrency.toUpperCase()}</strong> to the address above.
                  Sending a different amount may cause the payment to not be recognized.
                </div>

                {/* Timer + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 16 }}>
                  <span>Expires: {new Date(payData.expiresAt).toLocaleString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className="fas fa-circle-notch spinning" style={{ fontSize: 10 }} />
                    Monitoring blockchain...
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={cancelPayment}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-cyan btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={copyAddress}
                  >
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
