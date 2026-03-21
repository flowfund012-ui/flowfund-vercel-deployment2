'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Chart, registerables } from 'chart.js';
import type { AutopilotSettings, SavingsGoal } from '@/types/database';
import { fm, fd, today } from '@/lib/utils';
import { StatCard, Badge, Toggle, ProgressBar, EmptyState } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import { updateAutopilot, createGoal, deleteGoal } from '@/app/actions';

Chart.register(...registerables);

interface Props {
  initialSettings: AutopilotSettings | null;
  initialGoals: SavingsGoal[];
  totalIncome: number;
  totalExpenses: number;
  userId: string;
}

export default function AutopilotPage({ initialSettings, initialGoals, totalIncome, totalExpenses, userId }: Props) {
  const { showToast } = useUIStore();
  const [settings, setSettings] = useState(initialSettings ?? { smart_save: true, smart_save_pct: 20, auto_invest: false, auto_invest_pct: 10 });
  const [goals, setGoals]       = useState(initialGoals);
  const [goalModal, setGoalModal] = useState(false);
  const [gName, setGName]  = useState(''); const [gTarget, setGTarget] = useState('');
  const [gCurrent, setGCurrent] = useState('0'); const [gDeadline, setGDeadline] = useState(''); const [gCat, setGCat] = useState('💰 Emergency Fund');
  const [pending, startTransition] = useTransition();
  const allocRef  = useRef<HTMLCanvasElement>(null);
  const allocInst = useRef<Chart|null>(null);

  const saved    = settings.smart_save ? totalIncome * (settings.smart_save_pct / 100) : 0;
  const invested = settings.auto_invest ? totalIncome * (settings.auto_invest_pct / 100) : 0;
  const free     = Math.max(0, totalIncome - saved - invested - totalExpenses);
  const active   = settings.smart_save || settings.auto_invest;

  useEffect(() => {
    if (!allocRef.current) return;
    allocInst.current?.destroy();
    allocInst.current = new Chart(allocRef.current, {
      type: 'doughnut',
      data: { labels: ['Saved', 'Invested', 'Expenses', 'Free Cash'], datasets: [{ data: [saved, invested, totalExpenses, free], backgroundColor: ['#7c3aed','#34d399','rgba(0,242,255,.6)','#f59e0b'], borderWidth: 0, hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'right', labels: { color: 'rgba(245,243,255,.38)', boxWidth: 9, font: { size: 10 } } } }, scales: { x: { display: false }, y: { display: false } } },
    });
    return () => allocInst.current?.destroy();
  }, [saved, invested, totalExpenses, free]);

  const handleToggle = (key: 'smart_save'|'auto_invest') => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    startTransition(async () => { await updateAutopilot(next); });
  };

  const handleSlider = (key: 'smart_save_pct'|'auto_invest_pct', val: number) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    startTransition(async () => { await updateAutopilot(next); });
  };

  const handleSaveGoal = () => {
    if (!gName.trim() || !gTarget) { showToast('Enter goal name and target', 'error'); return; }
    startTransition(async () => {
      const res = await createGoal({ name: gName.trim(), category: gCat, target_amount: parseFloat(gTarget), current_amount: parseFloat(gCurrent)||0, deadline: gDeadline });
      if (res.error) { showToast(res.error, 'error'); return; }
      if (res.data) setGoals(prev => [res.data!, ...prev]);
      showToast(`🎯 Goal "${gName}" created!`, 'success');
      setGoalModal(false); setGName(''); setGTarget(''); setGCurrent('0'); setGDeadline('');
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    startTransition(async () => { await deleteGoal(id); });
    showToast('Goal removed', 'success');
  };

  const capsule = { background: 'rgba(15,23,42,.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(124,58,237,.28)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.35)' };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#a78bfa', marginBottom: 5, filter: 'drop-shadow(0 0 8px rgba(167,139,250,.7))' }}>AutoPilot Engine</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,243,255,.38)' }}>Your Financial AI Navigator. Set rules. Let money work.</p>
        </div>
        <Badge variant={active ? 'purple' : 'gray'}>{active ? '● ACTIVE' : '○ PAUSED'}</Badge>
      </div>

      <div className="stat-row">
        <StatCard label="Auto-Saved"    value={fm(saved)}    bg="rgba(124,58,237,.08)" border="rgba(124,58,237,.2)" valueColor="#a78bfa" />
        <StatCard label="Auto-Invested" value={fm(invested)} bg="rgba(52,211,153,.08)" border="rgba(52,211,153,.2)" valueColor="#34d399" />
        <StatCard label="Free Cash"     value={fm(free)}     bg="rgba(0,242,255,.08)"  border="rgba(0,242,255,.2)"  valueColor="#00f2ff" />
        <StatCard label="Rules Active"  value={String((settings.smart_save?1:0)+(settings.auto_invest?1:0))} bg="rgba(245,158,11,.08)" border="rgba(245,158,11,.2)" valueColor="#f59e0b" />
      </div>

      <div className="g2" style={{ marginBottom: 20 }}>
        <div style={{ ...capsule, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div><div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#a78bfa', marginBottom: 5 }}>🏦 Smart Save</div><div style={{ fontSize: 11, color: 'rgba(245,243,255,.38)' }}>Auto-save % of every income</div></div>
            <Toggle on={settings.smart_save} onChange={() => handleToggle('smart_save')} accentColor="#7c3aed" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}><span style={{ color: 'rgba(245,243,255,.4)' }}>Save Rate</span><span style={{ color: '#a78bfa', fontWeight: 700 }}>{settings.smart_save_pct}%</span></div>
            <input className="ff-slider" type="range" min={5} max={50} value={settings.smart_save_pct} onChange={e => handleSlider('smart_save_pct', parseInt(e.target.value))} style={{ accentColor: '#7c3aed' } as React.CSSProperties} />
          </div>
          <div style={{ ...capsule, padding: 14 }}>
            <div style={{ fontSize: 11, color: 'rgba(245,243,255,.38)' }}>Saved this month</div>
            <div style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 22, fontWeight: 500, color: '#a78bfa', marginTop: 5 }}>{fm(saved)}</div>
          </div>
        </div>

        <div style={{ ...capsule, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div><div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#34d399', marginBottom: 5 }}>📈 Auto Invest</div><div style={{ fontSize: 11, color: 'rgba(245,243,255,.38)' }}>Round-up & invest spare change</div></div>
            <Toggle on={settings.auto_invest} onChange={() => handleToggle('auto_invest')} accentColor="#10b981" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}><span style={{ color: 'rgba(245,243,255,.4)' }}>Invest Rate</span><span style={{ color: '#34d399', fontWeight: 700 }}>{settings.auto_invest_pct}%</span></div>
            <input className="ff-slider" type="range" min={1} max={30} value={settings.auto_invest_pct} onChange={e => handleSlider('auto_invest_pct', parseInt(e.target.value))} style={{ accentColor: '#10b981' } as React.CSSProperties} />
          </div>
          <div style={{ ...capsule, padding: 14 }}>
            <div style={{ fontSize: 11, color: 'rgba(245,243,255,.38)' }}>Invested this month</div>
            <div style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 22, fontWeight: 500, color: '#34d399', marginTop: 5 }}>{fm(invested)}</div>
          </div>
        </div>
      </div>

      <div style={{ ...capsule, padding: 24, marginBottom: 20 }}>
        <div className="sec-hdr" style={{ marginBottom: 20 }}>
          <span className="sec-title" style={{ color: '#a78bfa' }}>🎯 Goals Progress</span>
          <button className="btn btn-cyan btn-sm" onClick={() => setGoalModal(true)}><i className="fas fa-plus" /> Add Goal</button>
        </div>
        {goals.length === 0
          ? <EmptyState icon="🎯" title="No goals yet" sub="Create your first financial goal" />
          : goals.map(g => {
              const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
              return (
                <div key={g.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div><span style={{ fontSize: 13, fontWeight: 600, color: '#f5f3ff' }}>{g.name}</span><span style={{ fontSize: 11, color: 'rgba(245,243,255,.38)', marginLeft: 8 }}>{g.category}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'rgba(245,243,255,.5)' }}>{fm(Number(g.current_amount))} / <span style={{ color: '#a78bfa' }}>{fm(Number(g.target_amount))}</span></span>
                      <button onClick={() => handleDeleteGoal(g.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,82,82,.35)', cursor: 'pointer', fontSize: 11 }} onMouseOver={e => (e.currentTarget.style.color='#ff5252')} onMouseOut={e => (e.currentTarget.style.color='rgba(255,82,82,.35)')}>✕</button>
                    </div>
                  </div>
                  <ProgressBar pct={pct} colorClass="pbar-purple" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'rgba(245,243,255,.3)' }}>
                    <span>{pct}% complete</span>
                    <span>{fm(Number(g.target_amount) - Number(g.current_amount))} remaining{g.deadline ? ' · ' + fd(g.deadline) : ''}</span>
                  </div>
                </div>
              );
            })
        }
      </div>

      <div style={{ ...capsule, padding: 24 }}>
        <div className="sec-hdr" style={{ marginBottom: 16 }}><span className="sec-title" style={{ color: '#a78bfa' }}>💡 Allocation Flow</span></div>
        <div className="chart-wrap" style={{ height: 200 }}><canvas ref={allocRef} /></div>
      </div>

      {goalModal && (
        <Modal title="New Financial Goal" icon="fa-bullseye" onClose={() => setGoalModal(false)}>
          <div className="ff-group"><label className="ff-label">Goal Name</label><input className="ff-input" placeholder="e.g. Emergency Fund" value={gName} onChange={e => setGName(e.target.value)} /></div>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Target ($)</label><input className="ff-input" type="number" placeholder="5000" value={gTarget} onChange={e => setGTarget(e.target.value)} /></div>
            <div className="ff-group"><label className="ff-label">Current ($)</label><input className="ff-input" type="number" placeholder="0" value={gCurrent} onChange={e => setGCurrent(e.target.value)} /></div>
          </div>
          <div className="ff-row">
            <div className="ff-group"><label className="ff-label">Deadline</label><input className="ff-input" type="date" value={gDeadline} onChange={e => setGDeadline(e.target.value)} /></div>
            <div className="ff-group"><label className="ff-label">Category</label>
              <select className="ff-input" value={gCat} onChange={e => setGCat(e.target.value)}>
                {['💰 Emergency Fund','🏠 Housing','📱 Tech','✈️ Travel','📈 Investment','🎓 Education','⚡ Custom'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleSaveGoal} disabled={pending}>
            {pending ? <><i className="fas fa-circle-notch spinning" /> Saving...</> : <><i className="fas fa-save" /> Create Goal</>}
          </button>
        </Modal>
      )}
    </>
  );
}
