'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Chart, registerables } from 'chart.js';
import type { RevenueEntry } from '@/types/database';
import { fm, fd, today } from '@/lib/utils';
import { StatCard, Badge, EmptyState } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import { createRevenue, deleteRevenue } from '@/app/actions';

Chart.register(...registerables);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Props { initialRevenues: RevenueEntry[]; totalExpenses: number; plan: string; userId: string; }

export default function GrowthPage({ initialRevenues, totalExpenses, plan, userId }: Props) {
  const { showToast, growthPeriod, setGrowthPeriod, heatmapType, setHeatmapType } = useUIStore();
  const [revenues, setRevenues] = useState(initialRevenues);
  const [modal, setModal] = useState(false);
  const [src, setSrc] = useState(''); const [amt, setAmt] = useState('');
  const [rType, setRType] = useState('Recurring'); const [rDate, setRDate] = useState(today());
  const [simPrice, setSimPrice] = useState(49); const [simConv, setSimConv] = useState(120);
  const [pending, startTransition] = useTransition();
  const chartRef  = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<Chart|null>(null);

  const totalRev = revenues.reduce((s, r) => s + Number(r.amount), 0);
  const mrr      = revenues.filter(r => r.type === 'Recurring').reduce((s, r) => s + Number(r.amount), 0);
  const profit   = totalRev - totalExpenses;
  const simMRR   = simPrice * simConv;

  useEffect(() => {
    if (!chartRef.current) return;
    chartInst.current?.destroy();
    const n = growthPeriod === '3m' ? 3 : growthPeriod === '6m' ? 6 : 12;
    const m = new Date().getMonth();
    const labels = Array.from({ length: n }, (_, i) => MONTHS[(m - n + 1 + i + 12) % 12]);
    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: { labels, datasets: [
        { label: 'Revenue',  data: labels.map((_, i) => Math.round(3500 + i*400 + Math.random()*800)), borderColor: '#2dd4bf', backgroundColor: 'rgba(45,212,191,.07)', fill: true, tension: .4, pointRadius: 3, borderWidth: 2 },
        { label: 'Expenses', data: labels.map((_, i) => Math.round(1200 + i*80  + Math.random()*200)), borderColor: 'rgba(255,82,82,.5)', backgroundColor: 'rgba(255,82,82,.04)', fill: true, tension: .4, pointRadius: 2, borderWidth: 1.5 },
      ]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: 'rgba(224,242,254,.38)', boxWidth: 8, font: { size: 10 } } } }, scales: { x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 }, callback: v => '$' + v } } } },
    });
    return () => chartInst.current?.destroy();
  }, [growthPeriod, revenues]);

  const handleSaveRev = () => {
    if (!src.trim() || !amt) { showToast('Fill in source and amount', 'error'); return; }
    startTransition(async () => {
      const res = await createRevenue({ source: src.trim(), amount: parseFloat(amt), type: rType, date: rDate });
      if (res.error) { showToast(res.error, 'error'); return; }
      if (res.data) setRevenues(prev => [res.data!, ...prev]);
      showToast(`💰 ${src} — ${fm(parseFloat(amt))} logged!`, 'success');
      setModal(false); setSrc(''); setAmt('');
    });
  };

  const handleDeleteRev = (id: string) => {
    setRevenues(prev => prev.filter(r => r.id !== id));
    startTransition(async () => { await deleteRevenue(id); });
    showToast('Revenue entry removed', 'success');
  };

  const panel = { background: 'rgba(10,26,53,.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(45,212,191,.28)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.35)' };
  const gpBtn = (p: string) => `btn btn-xs ${growthPeriod === p ? 'btn-primary' : 'btn-cyan'}`;
  const hmBtn = (h: string) => `btn btn-xs ${heatmapType === h ? 'btn-primary' : 'btn-cyan'}`;

  const milestones = [
    { l: 'First $1K', t: 1000, i: '🌱' }, { l: '$5K Revenue', t: 5000, i: '🌿' },
    { l: '$10K Revenue', t: 10000, i: '🌳' }, { l: '$50K Revenue', t: 50000, i: '🏆' },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#2dd4bf', marginBottom: 5 }}>Growth Engine</h1>
          <p style={{ fontSize: 12, color: 'rgba(224,242,254,.38)' }}>Business Intelligence Command. Real-time revenue operations.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><i className="fas fa-plus" /> Log Revenue</button>
      </div>

      <div className="stat-row">
        <StatCard label="Total Revenue" value={fm(totalRev)} bg="rgba(45,212,191,.06)" border="rgba(45,212,191,.2)" valueColor="#2dd4bf" />
        <StatCard label="MRR"           value={fm(mrr)}      bg="rgba(45,212,191,.06)" border="rgba(45,212,191,.2)" valueColor="#34d399" />
        <StatCard label="Net Profit"    value={fm(profit)}   bg="rgba(45,212,191,.06)" border="rgba(45,212,191,.2)" valueColor={profit >= 0 ? '#10b981' : '#ff5252'} />
        <StatCard label="Conv. Rate"    value="3.8%"         bg="rgba(45,212,191,.06)" border="rgba(45,212,191,.2)" valueColor="#2dd4bf" />
      </div>

      <div className="g2" style={{ marginBottom: 20 }}>
        <div style={{ ...panel, padding: 20 }}>
          <div className="sec-hdr" style={{ marginBottom: 12 }}>
            <span className="sec-title" style={{ color: '#2dd4bf' }}>Revenue Trend</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['3m','6m','12m'] as const).map(p => <button key={p} className={gpBtn(p)} onClick={() => setGrowthPeriod(p)}>{p.toUpperCase()}</button>)}
            </div>
          </div>
          <div className="chart-wrap" style={{ height: 180 }}><canvas ref={chartRef} /></div>
        </div>
        <div style={{ ...panel, padding: 20 }}>
          <div className="sec-hdr" style={{ marginBottom: 12 }}>
            <span className="sec-title" style={{ color: '#2dd4bf' }}>Financial Heatmap</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['revenue','expenses','profit'] as const).map(h => <button key={h} className={hmBtn(h)} onClick={() => setHeatmapType(h)} style={{ textTransform: 'capitalize' }}>{h}</button>)}
            </div>
          </div>
          <div className="heatmap-grid" style={{ marginBottom: 8 }}>
            {MONTHS.map(mo => { const v = Math.random() * (heatmapType==='revenue'?8000:heatmapType==='expenses'?3000:5000); const p = v/(heatmapType==='revenue'?8000:heatmapType==='expenses'?3000:5000); return <div key={mo} className="hm-cell" title={`${mo}: ${fm(v)}`} style={{ background: `rgba(45,212,191,${0.1+p*.85})` }} />; })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(224,242,254,.3)' }}><div style={{ width: 10, height: 10, background: 'rgba(45,212,191,.15)', borderRadius: 2 }} />Low<div style={{ width: 10, height: 10, background: '#2dd4bf', borderRadius: 2 }} />High</div>
        </div>
      </div>

      <div className="g3" style={{ marginBottom: 20 }}>
        <div style={{ ...panel, padding: 20 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#2dd4bf', marginBottom: 14 }}>🔮 Revenue Simulator</div>
          <div className="ff-group"><label className="ff-label">Price per unit ($)</label><input className="ff-input" type="number" value={simPrice} onChange={e => setSimPrice(parseFloat(e.target.value)||0)} /></div>
          <div className="ff-group"><label className="ff-label">Conversions / month</label><input className="ff-input" type="number" value={simConv} onChange={e => setSimConv(parseInt(e.target.value)||0)} /></div>
          <div style={{ ...panel, padding: 14, marginTop: 10 }}>
            <div style={{ fontSize: 11, color: 'rgba(224,242,254,.4)' }}>Projected MRR</div>
            <div style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 24, fontWeight: 500, color: '#2dd4bf', marginTop: 5 }}>{fm(simMRR)}</div>
            <div style={{ fontSize: 11, color: 'rgba(224,242,254,.3)', marginTop: 4 }}>ARR: {fm(simMRR * 12)}</div>
          </div>
        </div>

        <div style={{ ...panel, padding: 20 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#2dd4bf', marginBottom: 14 }}>⚡ AI Insights</div>
          {[{ i:'💡',t:'Pricing Opportunity',m:'A 10% price increase could yield +$580 MRR with minimal churn risk.'},{i:'🎯',t:'Acquisition',m:'Estimated CAC: $28. Optimizing landing page copy could reduce this by 15%.'},{i:'🔄',t:'Retention',m:'Add annual plans to lock in LTV. Recurring revenue is your strongest asset.'}].map((a,i)=>(
            <div key={i} style={{ background: 'rgba(45,212,191,.05)', border: '1px solid rgba(45,212,191,.14)', borderRadius: 8, padding: 10, display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ flexShrink: 0 }}>{a.i}</span>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: '#e0f2fe', marginBottom: 3 }}>{a.t}</div><div style={{ fontSize: 10, color: 'rgba(224,242,254,.4)', lineHeight: 1.6 }}>{a.m}</div></div>
            </div>
          ))}
        </div>

        <div style={{ ...panel, padding: 20 }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: '#2dd4bf', marginBottom: 14 }}>🏆 Milestones</div>
          {milestones.map(m => { const p = Math.min(100, Math.round((totalRev/m.t)*100)); const done = totalRev >= m.t; return (
            <div key={m.l} style={{ marginBottom: 10, opacity: done?1:.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}><span>{m.i} {m.l}</span><span style={{ color: done?'#10b981':'rgba(224,242,254,.4)' }}>{done?'✓ Done':p+'%'}</span></div>
              <div className="pbar"><div className="pbar-fill" style={{ width:`${p}%`, background: done?'#10b981':'#2dd4bf' }} /></div>
            </div>
          );})}
        </div>
      </div>

      <div style={{ ...panel, padding: 20 }}>
        <div className="sec-hdr" style={{ marginBottom: 16 }}><span className="sec-title" style={{ color: '#2dd4bf' }}>Revenue Log</span></div>
        {revenues.length === 0
          ? <EmptyState icon="💰" title="No revenue logged yet" />
          : <div className="ff-table-wrap"><table className="ff-table"><thead><tr><th>Date</th><th>Source</th><th>Type</th><th>Amount</th><th></th></tr></thead><tbody>
              {[...revenues].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map(r=>(
                <tr key={r.id}><td>{fd(r.date)}</td><td>{r.source}</td><td><Badge variant="teal">{r.type}</Badge></td><td style={{ fontFamily:"'Roboto Mono',monospace", color:'#2dd4bf' }}>{fm(Number(r.amount))}</td><td><button onClick={()=>handleDeleteRev(r.id)} style={{ background:'none',border:'none',color:'rgba(255,82,82,.35)',cursor:'pointer',fontSize:11 }} onMouseOver={e=>(e.currentTarget.style.color='#ff5252')} onMouseOut={e=>(e.currentTarget.style.color='rgba(255,82,82,.35)')}>✕</button></td></tr>
              ))}
            </tbody></table></div>
        }
      </div>

      {modal && (
        <Modal title="Log Revenue" icon="fa-coins" onClose={() => setModal(false)}>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Source</label><input className="ff-input" placeholder="e.g. Stripe, PayPal" value={src} onChange={e=>setSrc(e.target.value)} /></div>
            <div className="ff-group"><label className="ff-label">Amount ($)</label><input className="ff-input" type="number" placeholder="0.00" value={amt} onChange={e=>setAmt(e.target.value)} /></div>
          </div>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Type</label><select className="ff-input" value={rType} onChange={e=>setRType(e.target.value)}>{['Recurring','One-time','Product Sale','Affiliate','Service'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="ff-group"><label className="ff-label">Date</label><input className="ff-input" type="date" value={rDate} onChange={e=>setRDate(e.target.value)} /></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleSaveRev} disabled={pending}>{pending?<><i className="fas fa-circle-notch spinning"/>Saving...</>:<><i className="fas fa-save"/>Log Revenue</>}</button>
        </Modal>
      )}
    </>
  );
}
