'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);
const f = (n: number) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const CATS = ['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Shopping','Utilities','Freelance','Salary','Subscriptions','Travel','Other'];

export default function MissionPage() {
  const [txns, setTxns] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTx, setShowTx] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [filterType, setFilterType] = useState<'all'|'income'|'expense'>('all');
  const [viewMode, setViewMode] = useState<'list'|'budget'>('list');
  const [txType, setTxType] = useState<'income'|'expense'>('expense');
  const [txDesc, setTxDesc] = useState('');
  const [txAmt, setTxAmt] = useState('');
  const [txCat, setTxCat] = useState('Food');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txRecurring, setTxRecurring] = useState(false);
  const [txInterval, setTxInterval] = useState('monthly');
  const [txNotes, setTxNotes] = useState('');
  const [txSaving, setTxSaving] = useState(false);
  const [budCat, setBudCat] = useState('Food');
  const [budAmt, setBudAmt] = useState('');
  const [budSaving, setBudSaving] = useState(false);
  const now = new Date();

  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const uid = session.user.id;
      const [{ data: t }, { data: b }] = await Promise.all([
        sb.from('transactions').select('*').eq('user_id', uid).order('date', { ascending: false }),
        sb.from('budgets').select('*').eq('user_id', uid).eq('month', now.getMonth() + 1).eq('year', now.getFullYear()),
      ]);
      setTxns(t ?? []); setBudgets(b ?? []); setLoading(false);
    });
  }, []);

  const tm = txns.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const income = tm.filter(t => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const expenses = tm.filter(t => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const cs: Record<string, number> = {};
  tm.filter(t => t.type === 'expense').forEach((t: any) => { cs[t.category] = (cs[t.category] || 0) + Number(t.amount); });
  const filtered = txns.filter(t => filterType === 'all' || t.type === filterType);

  const addTx = async () => {
    if (!txDesc.trim() || !txAmt) return;
    setTxSaving(true);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setTxSaving(false); return; }
    const { data } = await sb.from('transactions').insert({
      user_id: session.user.id, type: txType, description: txDesc.trim(),
      amount: parseFloat(txAmt), category: txCat, date: txDate,
      recurring: txRecurring, recurrence_interval: txRecurring ? txInterval : null, notes: txNotes.trim()
    }).select().single();
    if (data) setTxns(p => [data, ...p]);
    setShowTx(false); setTxDesc(''); setTxAmt(''); setTxNotes(''); setTxRecurring(false); setTxSaving(false);
  };

  const addBudget = async () => {
    if (!budAmt) return;
    setBudSaving(true);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setBudSaving(false); return; }
    const { data } = await sb.from('budgets').upsert({
      user_id: session.user.id, category: budCat, amount: parseFloat(budAmt),
      month: now.getMonth() + 1, year: now.getFullYear()
    }, { onConflict: 'user_id,category,month,year' }).select().single();
    if (data) setBudgets(p => { const ex = p.find(b => b.category === budCat); return ex ? p.map(b => b.category === budCat ? data : b) : [...p, data]; });
    setShowBudget(false); setBudAmt(''); setBudSaving(false);
  };

  const delTx = async (id: string) => {
    setTxns(p => p.filter(t => t.id !== id));
    await sb.from('transactions').delete().eq('id', id);
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>Loading...</div>;

  return (
    <div style={{ padding: '0 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#00f2ff', marginBottom: 4 }}>Mission Tracker</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {tm.length} transactions this month</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowBudget(true)} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(0,242,255,.1)', border: '1px solid rgba(0,242,255,.25)', color: '#00f2ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Set Budget</button>
          <button onClick={() => setShowTx(true)} style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>+ Transaction</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Income', val: f(income), color: '#10b981', bg: 'rgba(16,185,129,.06)', border: 'rgba(16,185,129,.2)' },
          { label: 'Expenses', val: f(expenses), color: '#ef4444', bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.2)' },
          { label: 'Net', val: f(income - expenses), color: income - expenses >= 0 ? '#10b981' : '#ef4444', bg: 'rgba(124,58,237,.06)', border: 'rgba(124,58,237,.2)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color, fontFamily: "'Roboto Mono',monospace" }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['list', 'budget'] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, border: '1px solid', borderColor: viewMode === v ? '#1a6bff' : 'rgba(255,255,255,.1)', background: viewMode === v ? 'rgba(26,107,255,.15)' : 'transparent', color: viewMode === v ? '#60a5fa' : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>{v === 'list' ? 'Transactions' : 'Budgets'}</button>
          ))}
        </div>
        {viewMode === 'list' && (
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'income', 'expense'] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)} style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, border: '1px solid', borderColor: filterType === t ? '#00f2ff' : 'rgba(255,255,255,.1)', background: filterType === t ? 'rgba(0,242,255,.08)' : 'transparent', color: filterType === t ? '#00f2ff' : 'rgba(255,255,255,.4)', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        )}
      </div>
      {viewMode === 'list' && (
        <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,.3)' }}>
              <div style={{ fontSize: 13, marginBottom: 8 }}>No transactions yet</div>
              <div style={{ fontSize: 12 }}>Click "+ Transaction" to log your first one</div>
            </div>
          ) : filtered.map((t: any) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0' }}>{t.description}</span>
                  {t.recurring && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 100, background: 'rgba(167,139,250,.15)', color: '#a78bfa' }}>recurring</span>}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)' }}>{t.category} - {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.type === 'income' ? '#10b981' : '#ef4444', fontFamily: "'Roboto Mono',monospace" }}>{t.type === 'income' ? '+' : '-'}{f(Number(t.amount))}</span>
                <button onClick={() => delTx(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,82,82,.4)', cursor: 'pointer', fontSize: 16 }}>x</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {viewMode === 'budget' && (
        <div style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 20 }}>
          {budgets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,.3)', fontSize: 13 }}>No budgets set. Click "Set Budget" to add spending limits.</div>
          ) : budgets.map((b: any) => {
            const sp = cs[b.category] || 0;
            const pct = Math.min(100, Math.round((sp / Number(b.amount)) * 100));
            const ov = pct >= 100;
            const rem = Number(b.amount) - sp;
            return (
              <div key={b.id} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>{b.category}</span>
                    {ov && <span style={{ marginLeft: 8, fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(239,68,68,.15)', color: '#ef4444' }}>Over budget</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: ov ? '#ef4444' : 'rgba(255,255,255,.7)' }}>{f(sp)} / {f(Number(b.amount))}</div>
                    <div style={{ fontSize: 11, color: ov ? '#ef4444' : '#10b981' }}>{ov ? f(Math.abs(rem)) + ' over' : f(rem) + ' left'}</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 100, height: 7 }}>
                  <div style={{ background: ov ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981', borderRadius: 100, height: 7, width: pct + '%' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showTx && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowTx(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff' }}>Add Transaction</span>
              <button onClick={() => setShowTx(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 20 }}>x</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {(['income', 'expense'] as const).map(t => (
                <button key={t} onClick={() => setTxType(t)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid', borderColor: txType === t ? (t === 'income' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,.1)', background: txType === t ? (t === 'income' ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)') : 'transparent', color: txType === t ? (t === 'income' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{t === 'income' ? 'Income' : 'Expense'}</button>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}><input value={txDesc} onChange={e => setTxDesc(e.target.value)} placeholder="Description" style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input type="number" value={txAmt} onChange={e => setTxAmt(e.target.value)} placeholder="Amount ($)" style={inp} />
              <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} style={inp} />
            </div>
            <div style={{ marginBottom: 10 }}><select value={txCat} onChange={e => setTxCat(e.target.value)} style={{ ...inp }}>{CATS.map(c => <option key={c} style={{ background: '#0d1117' }}>{c}</option>)}</select></div>
            <div style={{ marginBottom: 10 }}><input value={txNotes} onChange={e => setTxNotes(e.target.value)} placeholder="Notes (optional)" style={inp} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,.04)', borderRadius: 8, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0' }}>Recurring transaction</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>e.g. rent, salary, subscriptions</div>
              </div>
              <div onClick={() => setTxRecurring(!txRecurring)} style={{ width: 40, height: 22, borderRadius: 100, background: txRecurring ? '#1a6bff' : 'rgba(255,255,255,.15)', cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: txRecurring ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left .2s' }} />
              </div>
            </div>
            {txRecurring && <div style={{ marginBottom: 18 }}><select value={txInterval} onChange={e => setTxInterval(e.target.value)} style={{ ...inp }}>{['daily','weekly','monthly','yearly'].map(i => <option key={i} style={{ background: '#0d1117' }}>{i}</option>)}</select></div>}
            <button onClick={addTx} disabled={!txDesc.trim() || !txAmt || txSaving} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, opacity: txSaving ? .7 : 1 }}>{txSaving ? 'Saving...' : 'Add Transaction'}</button>
          </div>
        </div>
      )}
      {showBudget && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowBudget(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(0,242,255,.25)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff' }}>Set Monthly Budget</span>
              <button onClick={() => setShowBudget(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 20 }}>x</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Category</label>
              <select value={budCat} onChange={e => setBudCat(e.target.value)} style={{ ...inp }}>{CATS.map(c => <option key={c} style={{ background: '#0d1117' }}>{c}</option>)}</select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Monthly Limit ($)</label>
              <input type="number" value={budAmt} onChange={e => setBudAmt(e.target.value)} placeholder="e.g. 500" style={inp} />
            </div>
            <button onClick={addBudget} disabled={!budAmt || budSaving} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'rgba(0,242,255,.15)', border: '1px solid rgba(0,242,255,.3)', color: '#00f2ff', cursor: 'pointer', fontSize: 14, fontWeight: 700, opacity: budSaving ? .7 : 1 }}>{budSaving ? 'Saving...' : 'Set Budget'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
