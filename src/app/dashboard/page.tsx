'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

const f = (n: number) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fp = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

const MODULES = [
  { href: '/dashboard/mission', label: 'Mission Tracker', desc: 'Income & expenses', color: '#00f2ff' },
  { href: '/dashboard/autopilot', label: 'AutoPilot', desc: 'Savings automation', color: '#a78bfa' },
  { href: '/dashboard/growth', label: 'Growth Engine', desc: 'Business revenue', color: '#2dd4bf' },
  { href: '/dashboard/academy', label: 'Academy', desc: 'Financial education', color: '#f59e0b' },
  { href: '/dashboard/vault', label: 'Vault', desc: 'Premium resources', color: '#00f0ff' },
  { href: '/dashboard/security', label: 'Security', desc: 'Data protection', color: '#00ff9d' },
];

interface Insight { type: 'good' | 'warn' | 'tip'; message: string; }

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txAmt, setTxAmt] = useState('');
  const [txCat, setTxCat] = useState('Salary');
  const [txType, setTxType] = useState<'income'|'expense'>('income');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txSaving, setTxSaving] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const uid = session.user.id;
      const [{ data: p }, { data: t }, { data: g }, { data: b }] = await Promise.all([
        sb.from('profiles').select('*').eq('id', uid).single(),
        sb.from('transactions').select('*').eq('user_id', uid).order('date', { ascending: false }).limit(200),
        sb.from('savings_goals').select('*').eq('user_id', uid).eq('completed', false),
        sb.from('budgets').select('*').eq('user_id', uid).eq('month', new Date().getMonth() + 1).eq('year', new Date().getFullYear()),
      ]);
      setProfile(p); setTxns(t ?? []); setGoals(g ?? []); setBudgets(b ?? []);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const tm = txns.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const lm = txns.filter(t => { const d = new Date(t.date); const l = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === l.getMonth() && d.getFullYear() === l.getFullYear(); });
  const income = tm.filter(t => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const expenses = tm.filter(t => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const net = income - expenses;
  const sr = income > 0 ? Math.round((net / income) * 100) : 0;
  const li = lm.filter(t => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const le = lm.filter(t => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const ic = li > 0 ? ((income - li) / li) * 100 : 0;
  const ec = le > 0 ? ((expenses - le) / le) * 100 : 0;
  const cs: Record<string, number> = {};
  tm.filter(t => t.type === 'expense').forEach((t: any) => { cs[t.category] = (cs[t.category] || 0) + Number(t.amount); });
  const top = Object.entries(cs).sort((a, b) => b[1] - a[1])[0];
  const insights: Insight[] = [];
  if (sr >= 20) insights.push({ type: 'good', message: `Saving ${sr}% of income this month. Solid!` });
  else if (income > 0) insights.push({ type: 'warn', message: `Savings rate is ${sr}%. Aim for 20%+ by reducing ${top?.[0] || 'expenses'}.` });
  if (top && top[1] > income * 0.4) insights.push({ type: 'warn', message: `${top[0]} is ${Math.round((top[1] / income) * 100)}% of income. Consider a budget cap.` });
  if (goals.length === 0) insights.push({ type: 'tip', message: 'No savings goals. Set one in AutoPilot.' });
  else { const ng = goals.find(g => Number(g.current_amount) / Number(g.target_amount) >= 0.8); if (ng) insights.push({ type: 'good', message: `"${ng.name}" is 80%+ complete!` }); }
  if (txns.length === 0) insights.push({ type: 'tip', message: 'Start logging transactions to get personalized insights.' });

  const addTx = async () => {
    if (!txDesc.trim() || !txAmt) return;
    setTxSaving(true);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setTxSaving(false); return; }
    const { data } = await sb.from('transactions').insert({ user_id: session.user.id, type: txType, description: txDesc.trim(), amount: parseFloat(txAmt), category: txCat, date: txDate }).select().single();
    if (data) setTxns(p => [data, ...p]);
    setShowAdd(false); setTxDesc(''); setTxAmt(''); setTxSaving(false);
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>Loading your command center...</div>;

  const hr = new Date().getHours();
  const gr = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  const fn = profile?.full_name?.split(' ')[0] || 'Commander';

  return (
    <div style={{ padding: '0 0 48px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{gr}, {fn}</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)' }}>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - Your Financial Snapshot</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Income', value: f(income), change: ic, color: '#10b981', bg: 'rgba(16,185,129,.06)', border: 'rgba(16,185,129,.2)' },
          { label: 'Expenses', value: f(expenses), change: ec, color: '#ef4444', bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.2)', inv: true },
          { label: 'Net Cash Flow', value: f(net), change: null, color: net >= 0 ? '#10b981' : '#ef4444', bg: net >= 0 ? 'rgba(16,185,129,.06)' : 'rgba(239,68,68,.06)', border: net >= 0 ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)' },
          { label: 'Savings Rate', value: sr + '%', change: null, color: sr >= 20 ? '#a78bfa' : '#f59e0b', bg: 'rgba(124,58,237,.06)', border: 'rgba(124,58,237,.2)' },
        ].map((c: any) => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'Roboto Mono',monospace", marginBottom: 4 }}>{c.value}</div>
            {c.change !== null && li > 0 && <div style={{ fontSize: 11, color: (c.inv ? c.change < 0 : c.change >= 0) ? '#10b981' : '#ef4444' }}>{fp(c.change)} vs last month</div>}
            {c.change === null && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>This month</div>}
          </div>
        ))}
      </div>
      {insights.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, marginBottom: 24 }}>
          <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>INSIGHTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.slice(0, 2).map((ins, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{ins.type === 'good' ? '[OK]' : ins.type === 'warn' ? '[!]' : '[i]'}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{ins.message}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ padding: '0 24px', borderRadius: 14, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>+ Add Transaction</button>
        </div>
      )}
      {budgets.length > 0 && (
        <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Budget Tracker</span>
            <Link href="/dashboard/mission" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none' }}>View all -&gt;</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {budgets.slice(0, 4).map((b: any) => {
              const sp = cs[b.category] || 0;
              const pct = Math.min(100, Math.round((sp / Number(b.amount)) * 100));
              const ov = pct >= 100;
              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{b.category}</span>
                    <span style={{ fontSize: 12, color: ov ? '#ef4444' : 'rgba(255,255,255,.4)' }}>{f(sp)} / {f(Number(b.amount))}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 100, height: 5 }}>
                    <div style={{ background: ov ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981', borderRadius: 100, height: 5, width: pct + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {goals.length > 0 && (
        <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Savings Goals</span>
            <Link href="/dashboard/autopilot" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none' }}>Manage -&gt;</Link>
          </div>
          {goals.slice(0, 3).map((g: any) => {
            const p = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
            return (
              <div key={g.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{g.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{p}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 100, height: 5 }}>
                  <div style={{ background: 'linear-gradient(90deg,#a78bfa,#7c00ff)', borderRadius: 100, height: 5, width: p + '%' }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 3 }}>{f(Number(g.current_amount))} of {f(Number(g.target_amount))}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, color: 'rgba(255,255,255,.35)', letterSpacing: '.06em', marginBottom: 14 }}>CONTROL MODULES</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20, cursor: 'pointer' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: m.color }}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      {txns.length > 0 && (
        <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Recent Transactions</span>
            <Link href="/dashboard/mission" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none' }}>View all -&gt;</Link>
          </div>
          {txns.slice(0, 5).map((t: any) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 2 }}>{t.description}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)' }}>{t.category} - {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444', fontFamily: "'Roboto Mono',monospace" }}>{t.type === 'income' ? '+' : '-'}{f(Number(t.amount))}</span>
            </div>
          ))}
        </div>
      )}
      {showAdd && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff' }}>Quick Add Transaction</span>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 20 }}>x</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {(['income', 'expense'] as const).map(t => (
                <button key={t} onClick={() => setTxType(t)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid', borderColor: txType === t ? (t === 'income' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,.1)', background: txType === t ? (t === 'income' ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)') : 'transparent', color: txType === t ? (t === 'income' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{t === 'income' ? 'Income' : 'Expense'}</button>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}><input value={txDesc} onChange={e => setTxDesc(e.target.value)} placeholder="Description" style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input type="number" value={txAmt} onChange={e => setTxAmt(e.target.value)} placeholder="Amount" style={inp} />
              <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} style={inp} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <select value={txCat} onChange={e => setTxCat(e.target.value)} style={{ ...inp }}>
                {['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Shopping','Utilities','Freelance','Salary','Other'].map(c => <option key={c} style={{ background: '#0d1117' }}>{c}</option>)}
              </select>
            </div>
            <button onClick={addTx} disabled={!txDesc.trim() || !txAmt || txSaving} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, opacity: txSaving ? .7 : 1 }}>{txSaving ? 'Saving...' : 'Add Transaction'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
