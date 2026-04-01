'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

const f = (n: number) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fd = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function GrowthPage() {
  const [revs, setRevs] = useState<any[]>([]);
  const [exp, setExp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [src, setSrc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState('Recurring');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState(49);
  const [cust, setCust] = useState(100);

  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return; }
      const uid = session.user.id;
      const [{ data: r }, { data: t }] = await Promise.all([
        sb.from('revenue_entries').select('*').eq('user_id', uid).order('date', { ascending: false }),
        sb.from('transactions').select('type,amount').eq('user_id', uid),
      ]);
      setRevs(r ?? []);
      setExp((t ?? []).filter((x: any) => x.type === 'expense').reduce((s: number, x: any) => s + Number(x.amount), 0));
      setLoading(false);
    });
  }, []);

  const total = revs.reduce((s, r) => s + Number(r.amount), 0);
  const mrr = revs.filter(r => r.type === 'Recurring').reduce((s, r) => s + Number(r.amount), 0);
  const profit = total - exp;
  const simMRR = price * cust;

  const add = async () => {
    if (!src.trim() || !amt) return;
    setSaving(true);
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setSaving(false); return; }
    const { data } = await sb.from('revenue_entries').insert({ user_id: session.user.id, source: src.trim(), amount: parseFloat(amt), type, date }).select().single();
    if (data) setRevs(p => [data, ...p]);
    setModal(false); setSrc(''); setAmt(''); setSaving(false);
  };

  const del = async (id: string) => {
    setRevs(p => p.filter(r => r.id !== id));
    await sb.from('revenue_entries').delete().eq('id', id);
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>Loading...</div>;

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#2dd4bf', marginBottom: 4 }}>Growth Engine</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Business intelligence & revenue tracking.</p>
        </div>
        <button onClick={() => setModal(true)} style={{ padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          + Log Revenue
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[['Total Revenue', f(total), '#2dd4bf'], ['MRR', f(mrr), '#34d399'], ['Net Profit', f(profit), profit >= 0 ? '#10b981' : '#ff5252'], ['Entries', String(revs.length), '#f59e0b']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'rgba(10,26,53,.8)', border: '1px solid rgba(45,212,191,.25)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Roboto Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(10,26,53,.8)', border: '1px solid rgba(45,212,191,.25)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#2dd4bf', marginBottom: 18 }}>Revenue Simulator</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', display: 'block', marginBottom: 8 }}>Price per unit: {f(price)}</label>
            <input type="range" min={1} max={999} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: '#2dd4bf' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', display: 'block', marginBottom: 8 }}>Monthly customers: {cust}</label>
            <input type="range" min={1} max={1000} value={cust} onChange={e => setCust(+e.target.value)} style={{ width: '100%', accentColor: '#2dd4bf' }} />
          </div>
        </div>
        <div style={{ marginTop: 18, padding: 18, background: 'rgba(45,212,191,.08)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(45,212,191,.6)', marginBottom: 4, letterSpacing: '.06em' }}>PROJECTED MRR</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#2dd4bf', fontFamily: "'Orbitron',sans-serif" }}>{f(simMRR)}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 6 }}>ARR: {f(simMRR * 12)}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(10,26,53,.8)', border: '1px solid rgba(45,212,191,.25)', borderRadius: 14, padding: 24 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#2dd4bf', marginBottom: 16 }}>Revenue Log</div>
        {revs.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,.3)', fontSize: 13 }}>No revenue logged yet — add your first entry!</div>}
        {revs.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(45,212,191,.08)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#e0f2fe', marginBottom: 2 }}>{r.source}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{r.type} · {fd(r.date)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, color: '#2dd4bf', fontFamily: "'Roboto Mono',monospace" }}>{f(Number(r.amount))}</span>
              <button onClick={() => del(r.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,82,82,.5)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div onClick={e => { if (e.target === e.currentTarget) setModal(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(45,212,191,.3)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, color: '#2dd4bf' }}>Log Revenue</span>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Source</label>
                <input value={src} onChange={e => setSrc(e.target.value)} placeholder="e.g. Client Project" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Amount ($)</label>
                <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0.00" style={inp} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={{ ...inp }}>
                  {['Recurring', 'One-time', 'Passive', 'Other'].map(t => <option key={t} style={{ background: '#0d1117' }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: 5 }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
              </div>
            </div>
            <button onClick={add} disabled={saving} style={{ width: '100%', padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: saving ? .7 : 1 }}>
              {saving ? 'Saving...' : 'Log Revenue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
