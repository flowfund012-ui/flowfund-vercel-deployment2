'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Transaction } from '@/types/database';
import { fm, fd, daysAgo, CAT_ICONS, CAT_COLORS } from '@/lib/utils';
import { StatCard, Badge, EmptyState } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import { createTransaction, deleteTransaction } from '@/app/actions/transactions';
import { today } from '@/lib/utils';

Chart.register(...registerables);

interface Props { initialTransactions: Transaction[]; userId: string; }

export default function MissionPage({ initialTransactions, userId }: Props) {
  const { showToast } = useUIStore();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filterType, setFilterType] = useState<'all'|'income'|'expense'>('all');
  const [filterCat,  setFilterCat]  = useState('all');
  const [modal, setModal] = useState(false);
  const [txType, setTxType] = useState<'income'|'expense'>('income');
  const [desc,   setDesc]   = useState('');
  const [amount, setAmount] = useState('');
  const [cat,    setCat]    = useState('Business');
  const [date,   setDate]   = useState(today());
  const [notes,  setNotes]  = useState('');
  const [pending, startTransition] = useTransition();
  const barRef   = useRef<HTMLCanvasElement>(null);
  const donutRef = useRef<HTMLCanvasElement>(null);
  const barInst  = useRef<Chart|null>(null);
  const donutInst= useRef<Chart|null>(null);

  const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const net = inc - exp;
  const sr  = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;

  useEffect(() => {
    if (!barRef.current) return;
    barInst.current?.destroy();
    const d14 = Array.from({ length: 14 }, (_, i) => daysAgo(13 - i));
    barInst.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: d14.map(d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
        datasets: [
          { label: 'Income',  data: d14.map(d => transactions.filter(t => t.date === d && t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)),  backgroundColor: 'rgba(0,242,255,.5)',   borderRadius: 4 },
          { label: 'Expense', data: d14.map(d => transactions.filter(t => t.date === d && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)), backgroundColor: 'rgba(235,201,109,.5)', borderRadius: 4 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: 'rgba(255,255,255,.38)', boxWidth: 8, font: { size: 10 } } } }, scales: { x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 }, callback: v => '$' + v } } } },
    });
    return () => barInst.current?.destroy();
  }, [transactions]);

  useEffect(() => {
    if (!donutRef.current) return;
    donutInst.current?.destroy();
    const cats = Object.keys(CAT_ICONS);
    donutInst.current = new Chart(donutRef.current, {
      type: 'doughnut',
      data: { labels: cats, datasets: [{ data: cats.map(c => transactions.filter(t => t.type === 'expense' && t.category === c).reduce((s, t) => s + Number(t.amount), 0)), backgroundColor: Object.values(CAT_COLORS), borderWidth: 0, hoverOffset: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'right', labels: { color: 'rgba(255,255,255,.38)', boxWidth: 7, font: { size: 10 } } } }, scales: { x: { display: false }, y: { display: false } } },
    });
    return () => donutInst.current?.destroy();
  }, [transactions]);

  const handleSave = () => {
    if (!desc.trim() || !amount || !date) { showToast('Fill in all required fields', 'error'); return; }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) { showToast('Enter a valid amount', 'error'); return; }

    startTransition(async () => {
      const res = await createTransaction({ type: txType, description: desc.trim(), amount: num, category: cat, date, notes });
      if (res.error) { showToast(res.error, 'error'); return; }
      if (res.data) setTransactions(prev => [res.data!, ...prev]);
      showToast(`${txType === 'income' ? '📈' : '📉'} ${desc} — ${fm(num)} saved`, 'success');
      setModal(false);
      setDesc(''); setAmount(''); setNotes('');
    });
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    startTransition(async () => {
      const res = await deleteTransaction(id);
      if (res.error) { showToast(res.error, 'error'); setTransactions(initialTransactions); return; }
      showToast('Transaction deleted', 'success');
    });
  };

  const handleExport = () => {
    const rows = transactions.map(t => `${t.date},"${t.description}",${t.type},${t.category},${t.amount},"${t.notes}"`);
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(['Date,Description,Type,Category,Amount,Notes', ...rows].join('\n'));
    a.download = 'flowfund-transactions.csv'; a.click();
    showToast('CSV exported!', 'success');
  };

  const filtered = [...transactions]
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterCat  === 'all' || t.category === filterCat);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', textShadow: '0 0 5px #00f2ff,0 0 12px #00f2ff', marginBottom: 5 }}>Mission Tracker</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Track every financial move. AI-powered categorization.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-cyan btn-sm" onClick={handleExport}><i className="fas fa-download" /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><i className="fas fa-plus" /> Add Entry</button>
        </div>
      </div>

      <div className="stat-row">
        <StatCard label="Total Income"   value={fm(inc)} sub={`+${transactions.filter(t=>t.type==='income').length} entries`}  valueColor="#EBC96D" bg="rgba(0,78,100,.32)" border="rgba(0,242,255,.2)" />
        <StatCard label="Total Expenses" value={fm(exp)} sub={`${transactions.filter(t=>t.type==='expense').length} entries`}   valueColor="#ff5252" bg="rgba(0,78,100,.32)" border="rgba(0,242,255,.2)" />
        <StatCard label="Net Flow"       value={fm(net)} sub={net >= 0 ? 'Positive ↑' : 'Negative ↓'}                          valueColor={net >= 0 ? '#7BBF8B' : '#ff5252'} bg="rgba(0,78,100,.32)" border="rgba(0,242,255,.2)" />
        <StatCard label="Savings Rate"   value={`${sr}%`} sub="Goal: 30%"                                                       valueColor="#00f2ff" bg="rgba(0,78,100,.32)" border="rgba(0,242,255,.2)" />
      </div>

      <div className="g2" style={{ marginBottom: 20 }}>
        <div className="mission-panel" style={{ padding: 20 }}><div className="sec-hdr" style={{ marginBottom: 12 }}><span className="sec-title">Income vs Expenses</span></div><div className="chart-wrap" style={{ height: 180 }}><canvas ref={barRef} /></div></div>
        <div className="mission-panel" style={{ padding: 20 }}><div className="sec-hdr" style={{ marginBottom: 12 }}><span className="sec-title">Spending by Category</span></div><div className="chart-wrap" style={{ height: 180 }}><canvas ref={donutRef} /></div></div>
      </div>

      <div className="mission-panel" style={{ padding: 20 }}>
        <div className="sec-hdr" style={{ marginBottom: 16 }}>
          <span className="sec-title">Live Feed</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="ff-input" value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)} style={{ padding: '5px 10px', width: 'auto', fontSize: 11 }}>
              <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expenses</option>
            </select>
            <select className="ff-input" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '5px 10px', width: 'auto', fontSize: 11 }}>
              <option value="all">All Categories</option>
              {Object.keys(CAT_ICONS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {filtered.length === 0
          ? <EmptyState icon="💸" title="No transactions found" sub="Add your first transaction above" />
          : filtered.map(t => (
            <div key={t.id} className="tx-item">
              <div className="tx-icon-wrap" style={{ background: `${CAT_COLORS[t.category]||'#666'}20` }}>{CAT_ICONS[t.category]||'📦'}</div>
              <div style={{ flex: 1 }}>
                <div className="tx-name">{t.description}</div>
                <div className="tx-meta">
                  <span style={{ background: `${CAT_COLORS[t.category]||'#666'}20`, border: `1px solid ${CAT_COLORS[t.category]||'#666'}40`, color: CAT_COLORS[t.category]||'#999', padding: '2px 8px', borderRadius: 4, fontSize: 10 }}>{t.category}</span>
                  {t.notes && <span style={{ marginLeft: 6, fontSize: 10, color: 'rgba(255,255,255,.2)' }}>{t.notes}</span>}
                </div>
              </div>
              <div>
                <div className="tx-amount" style={{ color: t.type === 'income' ? '#7BBF8B' : '#EBC96D' }}>{t.type === 'income' ? '+' : '-'}{fm(Number(t.amount))}</div>
                <div className="tx-date-str">{fd(t.date)}</div>
              </div>
              <button onClick={() => handleDelete(t.id)} disabled={pending} style={{ background: 'none', border: 'none', color: 'rgba(255,82,82,.35)', cursor: 'pointer', fontSize: 12, padding: '4px 6px', transition: 'color .2s' }} onMouseOver={e => (e.currentTarget.style.color='#ff5252')} onMouseOut={e => (e.currentTarget.style.color='rgba(255,82,82,.35)')}>✕</button>
            </div>
          ))
        }
      </div>

      {modal && (
        <Modal title="Add Transaction" icon="fa-exchange-alt" onClose={() => setModal(false)}>
          <div className="ff-group">
            <label className="ff-label">Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className={`btn ${txType==='income'?'btn-primary':'btn-cyan'} btn-block`} onClick={() => setTxType('income')}><i className="fas fa-arrow-up" /> Income</button>
              <button className={`btn ${txType==='expense'?'btn-primary':'btn-cyan'} btn-block`} onClick={() => setTxType('expense')}><i className="fas fa-arrow-down" /> Expense</button>
            </div>
          </div>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Description *</label><input className="ff-input" placeholder="e.g. Freelance Project" value={desc} onChange={e => setDesc(e.target.value)} /></div>
            <div className="ff-group"><label className="ff-label">Amount ($) *</label><input className="ff-input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} /></div>
          </div>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Category</label><select className="ff-input" value={cat} onChange={e => setCat(e.target.value)}>{Object.keys(CAT_ICONS).map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="ff-group"><label className="ff-label">Date *</label><input className="ff-input" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>
          <div className="ff-group"><label className="ff-label">Notes</label><textarea className="ff-input" placeholder="Optional..." value={notes} onChange={e => setNotes(e.target.value)} /></div>
          <button className="btn btn-primary btn-block" onClick={handleSave} disabled={pending}>{pending ? <><i className="fas fa-circle-notch spinning" /> Saving...</> : <><i className="fas fa-save" /> Save Transaction</>}</button>
        </Modal>
      )}
    </>
  );
}
