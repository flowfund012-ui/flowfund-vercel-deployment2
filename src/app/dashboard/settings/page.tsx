'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

const PLANS = {
  free: { price: 0, label: 'Free', features: ['Dashboard & Insights','Mission Tracker (50 txns/mo)','AutoPilot (1 goal)','Academy (3 courses)','2 Vault assets'] },
  pro: { price: 29, label: 'Pro', features: ['Unlimited transactions','Growth Engine','All Academy courses','Vault (4 assets + drops)','Advanced charts & CSV','Budget system','Recurring transactions'] },
  premium: { price: 49, label: 'Premium', features: ['Everything in Pro','Full Vault (unlimited)','Hidden Vault monthly','AI-powered insights','Priority support','Custom categories','Snapshot reports'] },
};

const CRYPTOS = [['btc','Bitcoin (BTC)'],['eth','Ethereum (ETH)'],['usdttrc20','USDT (TRC20)'],['usdcerc20','USDC (ERC20)'],['ltc','Litecoin (LTC)'],['sol','Solana (SOL)']];

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState<string | null>(null);
  const [currency, setCurrency] = useState('btc');
  const [payData, setPayData] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return; }
      setEmail(session.user.email ?? '');
      const uid = session.user.id;
      const [{ data: p }, { data: o }, { data: s }] = await Promise.all([
        sb.from('profiles').select('*').eq('id', uid).single(),
        sb.from('payment_orders').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(10),
        sb.from('subscriptions').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
      ]);
      setProfile(p); setName(p?.full_name ?? ''); setOrders(o ?? []); setSubscriptions(s ?? []);
      setLoading(false);
    });
  }, []);

  const saveName = async () => {
    setSaving(true);
    const { data: { session } } = await sb.auth.getSession();
    if (session) await sb.from('profiles').update({ full_name: name.trim(), updated_at: new Date().toISOString() }).eq('id', session.user.id);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const createOrder = async () => {
    if (!payModal) return;
    setCreating(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: payModal, currency, billing_cycle: 'monthly' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create payment');
      setPayData(json.data ?? json);
    } catch (e: any) { alert(e.message); }
    setCreating(false);
  };

  const copy = () => {
    if (!payData?.payAddress) return;
    navigator.clipboard.writeText(payData.payAddress).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const plan = profile?.plan ?? 'free';
  const planInfo = PLANS[plan as keyof typeof PLANS] || PLANS.free;
  const planRank: Record<string, number> = { free: 0, pro: 1, premium: 2 };
  const activeSub = subscriptions.find(s => s.status === 'active');

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
  const card: React.CSSProperties = { background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 24 };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>Loading...</div>;

  return (
    <div style={{ padding: '0 0 48px' }}>
      <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Settings & Billing</h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 28 }}>Manage your account, subscription, and payments.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Profile */}
        <div style={card}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 18 }}>Profile</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Email</label>
            <input value={email} disabled style={{ ...inp, opacity: .5, cursor: 'not-allowed' }} />
          </div>
          <button onClick={saveName} disabled={saving} style={{ padding: '8px 18px', borderRadius: 8, background: saved ? 'rgba(16,185,129,.15)' : 'rgba(0,242,255,.12)', border: '1px solid ' + (saved ? 'rgba(16,185,129,.3)' : 'rgba(0,242,255,.25)'), color: saved ? '#10b981' : '#00f2ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Current Plan */}
        <div style={card}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 18 }}>Current Plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: plan === 'premium' ? 'rgba(255,215,0,.1)' : plan === 'pro' ? 'rgba(26,107,255,.1)' : 'rgba(255,255,255,.06)', border: '1px solid ' + (plan === 'premium' ? 'rgba(255,215,0,.3)' : plan === 'pro' ? 'rgba(26,107,255,.3)' : 'rgba(255,255,255,.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron',sans-serif", fontSize: 16, color: plan === 'premium' ? '#ffd700' : plan === 'pro' ? '#00f2ff' : '#fff' }}>
              {plan === 'premium' ? 'P+' : plan === 'pro' ? 'PR' : 'FR'}
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, color: plan === 'premium' ? '#ffd700' : plan === 'pro' ? '#00f2ff' : '#fff', textTransform: 'capitalize' }}>{planInfo.label}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>
                {plan === 'free' ? 'Free forever' : `$${planInfo.price}/month`}
              </div>
              {activeSub && (
                <div style={{ fontSize: 11, color: '#10b981', marginTop: 3 }}>
                  Active - renews {activeSub.current_period_end ? new Date(activeSub.current_period_end).toLocaleDateString() : 'monthly'}
                </div>
              )}
            </div>
          </div>
          {planInfo.features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 5 }}>
              <span style={{ color: '#10b981', fontSize: 10 }}>OK</span>{f}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Plans */}
      {plan !== 'premium' && (
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#ffd700', marginBottom: 8 }}>Upgrade Your Plan</div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>Cancel anytime. Crypto payments via NOWPayments. Zero KYC. Works globally.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {(Object.entries(PLANS) as any[]).filter(([pid]: any) => planRank[pid] > planRank[plan]).map(([pid, info]: any) => (
              <div key={pid} style={{ background: pid === 'premium' ? 'rgba(255,215,0,.04)' : 'rgba(26,107,255,.04)', border: '1px solid ' + (pid === 'premium' ? 'rgba(255,215,0,.3)' : 'rgba(26,107,255,.25)'), borderRadius: 14, padding: 20, position: 'relative' }}>
                {pid === 'premium' && <div style={{ position: 'absolute', top: -10, right: 14, background: '#ffd700', color: '#000', fontSize: 9, padding: '2px 10px', borderRadius: 100, fontFamily: "'Orbitron',sans-serif", fontWeight: 700 }}>BEST VALUE</div>}
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, marginBottom: 6 }}>{info.label}</div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 30, fontWeight: 700, color: pid === 'premium' ? '#ffd700' : '#00f2ff' }}>${info.price}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>/month</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Cancel anytime - no lock-in</div>
                {info.features.slice(0, 4).map((f: string) => (
                  <div key={f} style={{ display: 'flex', gap: 7, fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 5 }}>
                    <span style={{ color: '#10b981', flexShrink: 0 }}>OK</span>{f}
                  </div>
                ))}
                <button onClick={() => { setPayModal(pid); setPayData(null); }} style={{ width: '100%', marginTop: 16, padding: '10px', borderRadius: 8, background: pid === 'premium' ? 'linear-gradient(135deg,#ffd700,#daa520)' : 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: pid === 'premium' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  Subscribe - ${info.price}/mo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription History */}
      {subscriptions.length > 0 && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 14 }}>Active Subscriptions</div>
          {subscriptions.map((s: any) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0', textTransform: 'capitalize' }}>{s.plan} - ${s.amount_usd}/month</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>Started {new Date(s.created_at).toLocaleDateString()}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, background: s.status === 'active' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: s.status === 'active' ? '#10b981' : '#ef4444' }}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Payment History */}
      {orders.length > 0 && (
        <div style={card}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 14 }}>Payment History</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Date','Plan','Amount','Status'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,.35)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ padding: '9px 0', fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={{ fontSize: 12, color: '#e2e8f0', textTransform: 'capitalize' }}>{o.plan}</td>
                  <td style={{ fontSize: 12, fontFamily: "'Roboto Mono',monospace" }}>${Number(o.amount_usd).toFixed(2)}</td>
                  <td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: o.status === 'finished' ? 'rgba(16,185,129,.15)' : 'rgba(245,158,11,.15)', color: o.status === 'finished' ? '#10b981' : '#f59e0b' }}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div onClick={e => { if (e.target === e.currentTarget) { setPayModal(null); setPayData(null); } }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,215,0,.25)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#ffd700' }}>Subscribe to {payModal.charAt(0).toUpperCase() + payModal.slice(1)}</span>
              <button onClick={() => { setPayModal(null); setPayData(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 22 }}>x</button>
            </div>
            <div style={{ background: 'rgba(255,215,0,.06)', border: '1px solid rgba(255,215,0,.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: 'rgba(255,215,0,.8)' }}>
              ${PLANS[payModal as keyof typeof PLANS]?.price}/month - Cancel anytime from this page
            </div>
            {!payData ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 6 }}>Select Cryptocurrency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inp }}>
                    {CRYPTOS.map(([v, l]) => <option key={v} value={v} style={{ background: '#0d1117' }}>{l}</option>)}
                  </select>
                </div>
                <button onClick={createOrder} disabled={creating} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', border: 'none', cursor: creating ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: creating ? .7 : 1 }}>
                  {creating ? 'Generating address...' : 'Generate Payment Address'}
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', background: 'rgba(255,215,0,.05)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>SEND EXACTLY</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#ffd700', fontFamily: "'Orbitron',sans-serif" }}>{payData.payAmount}</div>
                  <div style={{ color: '#ffd700', fontSize: 14, marginTop: 4 }}>{payData.payCurrency?.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 6 }}>This covers your first month - you will be invoiced monthly</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 6 }}>Payment Address</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <code style={{ flex: 1, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#00f2ff', wordBreak: 'break-all' }}>{payData.payAddress}</code>
                    <button onClick={copy} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,242,255,.1)', border: '1px solid rgba(0,242,255,.2)', color: copied ? '#10b981' : '#00f2ff', cursor: 'pointer', fontSize: 14 }}>{copied ? 'ok' : 'cp'}</button>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,152,0,.8)', background: 'rgba(255,152,0,.06)', border: '1px solid rgba(255,152,0,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                  Send the exact amount shown. Your account will be upgraded automatically once confirmed on-chain.
                </div>
                <button onClick={() => { setPayModal(null); setPayData(null); }} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,82,82,.08)', border: '1px solid rgba(255,82,82,.2)', color: '#ff5252', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
