'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

const PLANS: Record<string, string[]> = {
  free: ['Dashboard & Mission Tracker', 'AutoPilot (basic)', 'Academy (3 free courses)', 'Vault (2 assets)', 'Security Hub'],
  pro: ['Everything in Free', 'Growth Engine', 'Academy (all courses)', 'Vault (4 assets)', 'Advanced charts', 'CSV export'],
  premium: ['Everything in Pro', 'Full Vault Access', 'All 6 Academy courses', 'Unlimited transactions', 'Priority support'],
};
const PRICES: Record<string, number> = { pro: 9, premium: 19 };

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
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
      const [{ data: p }, { data: o }] = await Promise.all([
        sb.from('profiles').select('*').eq('id', uid).single(),
        sb.from('payment_orders').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      ]);
      setProfile(p); setName(p?.full_name ?? ''); setOrders(o ?? []);
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
      const res = await fetch('/api/payments/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId: payModal, currency }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setPayData(json.data ?? json);
    } catch (e: any) { alert(e.message); }
    setCreating(false);
  };

  const copy = () => {
    if (!payData?.payAddress) return;
    navigator.clipboard.writeText(payData.payAddress).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const plan = profile?.plan ?? 'free';
  const planRank: Record<string, number> = { free: 0, pro: 1, premium: 2 };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
  const card: React.CSSProperties = { background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 24 };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>Loading...</div>;

  return (
    <div style={{ padding: '0 0 40px' }}>
      <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Settings & Billing</h1>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 28 }}>Manage your account and subscription.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
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
          <button onClick={saveName} disabled={saving} style={{ padding: '8px 18px', borderRadius: 8, background: saved ? 'rgba(16,185,129,.2)' : 'rgba(0,242,255,.15)', border: '1px solid rgba(0,242,255,.3)', color: saved ? '#10b981' : '#00f2ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={card}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 18 }}>Current Plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,215,0,.1)', border: '1px solid rgba(255,215,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {plan === 'premium' ? '👑' : plan === 'pro' ? '⚡' : '🆓'}
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, color: '#ffd700', textTransform: 'capitalize' }}>{plan}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{plan === 'free' ? 'Free forever' : 'Lifetime access'}</div>
            </div>
          </div>
          {(PLANS[plan] ?? []).map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 6 }}>
              <span style={{ color: '#10b981' }}>✓</span>{f}
            </div>
          ))}
        </div>
      </div>

      {plan !== 'premium' && (
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#ffd700', marginBottom: 18 }}>Upgrade Your Plan</div>
          <div style={{ background: 'rgba(255,215,0,.05)', border: '1px solid rgba(255,215,0,.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: 'rgba(255,215,0,.8)' }}>
            Zero-KYC crypto payments via NOWPayments. BTC, ETH, USDT, USDC and 150+ coins.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {(['pro', 'premium'] as const).filter(p => planRank[p] > planRank[plan]).map(pid => (
              <div key={pid} style={{ background: pid === 'premium' ? 'rgba(255,215,0,.04)' : 'rgba(15,20,35,.7)', border: '1px solid ' + (pid === 'premium' ? 'rgba(255,215,0,.3)' : 'rgba(255,255,255,.08)'), borderRadius: 12, padding: 20, position: 'relative' }}>
                {pid === 'premium' && <div style={{ position: 'absolute', top: -10, right: 16, background: '#ffd700', color: '#000', fontSize: 9, padding: '2px 10px', borderRadius: 100, fontFamily: "'Orbitron',sans-serif", fontWeight: 700 }}>BEST VALUE</div>}
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, marginBottom: 8 }}>{pid === 'premium' ? '👑' : '⚡'} FlowFund {pid.charAt(0).toUpperCase() + pid.slice(1)}</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 32, fontWeight: 700, color: pid === 'premium' ? '#ffd700' : '#00f2ff', marginBottom: 4 }}>
                  ${PRICES[pid]}<span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 400 }}> once</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Lifetime access · One-time payment</div>
                {(PLANS[pid] ?? []).map(feat => (
                  <div key={feat} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 6 }}>
                    <span style={{ color: '#10b981' }}>✓</span>{feat}
                  </div>
                ))}
                <button onClick={() => { setPayModal(pid); setPayData(null); }} style={{ width: '100%', marginTop: 16, padding: '10px', borderRadius: 8, background: pid === 'premium' ? 'linear-gradient(135deg,#ffd700,#daa520)' : 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: pid === 'premium' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  Pay with Crypto — ${PRICES[pid]}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div style={card}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#00f2ff', marginBottom: 14 }}>Payment History</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Date', 'Plan', 'Amount', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,.35)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>{h}</th>)}</tr></thead>
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

      {payModal && (
        <div onClick={e => { if (e.target === e.currentTarget) { setPayModal(null); setPayData(null); } }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,215,0,.25)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#ffd700' }}>Pay for FlowFund {payModal.charAt(0).toUpperCase() + payModal.slice(1)}</span>
              <button onClick={() => { setPayModal(null); setPayData(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 22 }}>×</button>
            </div>
            {!payData ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 6 }}>Select Cryptocurrency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inp }}>
                    {[['btc', 'Bitcoin (BTC)'], ['eth', 'Ethereum (ETH)'], ['usdttrc20', 'USDT (TRC20)'], ['usdcerc20', 'USDC (ERC20)'], ['ltc', 'Litecoin (LTC)'], ['sol', 'Solana (SOL)']].map(([v, l]) => <option key={v} value={v} style={{ background: '#0d1117' }}>{l}</option>)}
                  </select>
                </div>
                <button onClick={createOrder} disabled={creating} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', border: 'none', cursor: creating ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: creating ? .7 : 1 }}>
                  {creating ? 'Generating address...' : 'Generate Payment Address →'}
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', background: 'rgba(255,215,0,.05)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 12, padding: '18px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>SEND EXACTLY</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#ffd700', fontFamily: "'Orbitron',sans-serif" }}>{payData.payAmount}</div>
                  <div style={{ color: '#ffd700', fontSize: 14, marginTop: 4 }}>{payData.payCurrency?.toUpperCase()}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 6 }}>Payment Address</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <code style={{ flex: 1, background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#00f2ff', wordBreak: 'break-all' }}>{payData.payAddress}</code>
                    <button onClick={copy} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(0,242,255,.1)', border: '1px solid rgba(0,242,255,.2)', color: copied ? '#10b981' : '#00f2ff', cursor: 'pointer', fontSize: 16 }}>{copied ? '✓' : '📋'}</button>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,152,0,.8)', background: 'rgba(255,152,0,.06)', border: '1px solid rgba(255,152,0,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                  Send the exact amount shown. Different amounts may not be recognized.
                </div>
                <button onClick={() => { setPayModal(null); setPayData(null); }} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(255,82,82,.1)', border: '1px solid rgba(255,82,82,.25)', color: '#ff5252', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
