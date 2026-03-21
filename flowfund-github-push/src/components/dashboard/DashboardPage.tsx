'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Link from 'next/link';
import type { Transaction, SavingsGoal, RevenueEntry, Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';
import { fm, daysAgo, MODULE_BG } from '@/lib/utils';
import { StatCard, Badge } from '@/components/ui';

Chart.register(...registerables);

interface Props {
  transactions: Transaction[];
  goals: SavingsGoal[];
  revenues: RevenueEntry[];
  profile: Profile | null;
  user: User;
}

const MODULES = [
  { href: '/dashboard/mission',   icon: 'fa-chart-line',    label: 'Mission Tracker',  desc: 'Income & expense tracking', c: 'rgba(0,242,255,.08)',  bc: 'rgba(0,242,255,.2)',  ic: '#00f2ff' },
  { href: '/dashboard/autopilot', icon: 'fa-robot',         label: 'AutoPilot',        desc: 'Automated money rules',     c: 'rgba(139,92,246,.08)', bc: 'rgba(139,92,246,.2)', ic: '#a78bfa' },
  { href: '/dashboard/growth',    icon: 'fa-bolt',          label: 'Growth Engine',    desc: 'Business intelligence',     c: 'rgba(45,212,191,.08)', bc: 'rgba(45,212,191,.2)', ic: '#2dd4bf' },
  { href: '/dashboard/academy',   icon: 'fa-graduation-cap',label: 'Personal Academy', desc: 'Learn & level up',          c: 'rgba(245,158,11,.08)', bc: 'rgba(245,158,11,.2)', ic: '#f59e0b' },
  { href: '/dashboard/vault',     icon: 'fa-lock',          label: 'Vault Access',     desc: 'Premium downloads',         c: 'rgba(0,240,255,.08)',  bc: 'rgba(0,240,255,.2)',  ic: '#00f0ff' },
  { href: '/dashboard/security',  icon: 'fa-shield-alt',    label: 'Security Hub',     desc: 'Privacy & encryption',      c: 'rgba(0,255,157,.08)',  bc: 'rgba(0,255,157,.2)',  ic: '#00ff9d' },
];

export default function DashboardPage({ transactions, goals, revenues, profile, user }: Props) {
  const chartRef  = useRef<HTMLCanvasElement>(null);
  const chartInst = useRef<Chart | null>(null);

  const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const net = inc - exp;
  const sr  = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;
  const name = profile?.full_name ?? user.email?.split('@')[0] ?? 'Commander';

  useEffect(() => {
    if (!chartRef.current) return;
    chartInst.current?.destroy();
    const days = Array.from({ length: 30 }, (_, i) => daysAgo(29 - i));
    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: days.map(d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
        datasets: [
          { label: 'Income',   data: days.map(d => transactions.filter(t => t.date === d && t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)),  borderColor: '#00f2ff', backgroundColor: 'rgba(0,242,255,.07)', fill: true, tension: .4, pointRadius: 1, borderWidth: 2 },
          { label: 'Expenses', data: days.map(d => transactions.filter(t => t.date === d && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)), borderColor: '#ff5252', backgroundColor: 'rgba(255,82,82,.05)',  fill: true, tension: .4, pointRadius: 1, borderWidth: 1.5 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, labels: { color: 'rgba(255,255,255,.38)', boxWidth: 8, font: { size: 10 } } }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: 'rgba(255,255,255,.28)', font: { size: 10 }, callback: v => '$' + Number(v).toLocaleString() } },
        },
      },
    });
    return () => { chartInst.current?.destroy(); };
  }, [transactions]);

  const aiTips = [
    { i: '⚡', t: 'System Alert',          m: `Total income: ${fm(inc)}. Savings rate: ${sr}%${sr > 20 ? ' — above target ✓' : ' — consider reducing expenses.'}` },
    { i: '🎯', t: 'Next Recommended Move',  m: 'Activate Round-Up Investments in AutoPilot to automatically invest spare change from every transaction.' },
    { i: '🔄', t: 'Subscription Review',   m: `You have ${transactions.filter(t => t.category === 'Entertainment').length} entertainment expenses. Review monthly subscriptions to cut unused services.` },
  ];

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 700, color: '#fff', textShadow: '0 0 8px rgba(0,242,255,.5)', marginBottom: 6 }}>
          Welcome back, {name}.
        </h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
          Access your entire financial control system. AI-enhanced. Battle-tested.
        </p>
      </div>

      <div className="stat-row">
        <StatCard label="Total Income"   value={fm(inc)} sub={`↑ ${transactions.filter(t => t.type === 'income').length} transactions`}  valueColor="#00f2ff" subColor="#00f2ff" bg="rgba(0,242,255,.06)"  border="rgba(0,242,255,.14)" />
        <StatCard label="Total Expenses" value={fm(exp)} sub={`↓ ${transactions.filter(t => t.type === 'expense').length} entries`}       valueColor="#ff5252" subColor="#ff5252" bg="rgba(255,82,82,.06)" border="rgba(255,82,82,.14)" />
        <StatCard label="Net Cash Flow"  value={fm(net)} sub={net >= 0 ? '↑ Positive' : '↓ Negative'} valueColor={net >= 0 ? '#10b981' : '#ff5252'} subColor={net >= 0 ? '#10b981' : '#ff5252'} bg={net >= 0 ? 'rgba(16,185,129,.06)' : 'rgba(255,82,82,.06)'} border={net >= 0 ? 'rgba(16,185,129,.14)' : 'rgba(255,82,82,.14)'} />
        <StatCard label="Savings Rate"   value={`${sr}%`} sub="↑ Target: 30%" valueColor="#a78bfa" subColor="#a78bfa" bg="rgba(124,58,237,.06)" border="rgba(124,58,237,.14)" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff', letterSpacing: '.04em' }}>Control Modules</span>
      </div>
      <div className="g3" style={{ marginBottom: 28 }}>
        {MODULES.map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration: 'none' }}>
            <div className="dash-glass" style={{ padding: 22, cursor: 'pointer', borderColor: m.bc }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: m.c, border: `1px solid ${m.bc}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fas ${m.icon}`} style={{ color: m.ic, fontSize: 18 }} />
                </div>
                <Badge variant="cyan" style={{ fontSize: 9 }}>ACTIVE</Badge>
              </div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.32)' }}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="g2">
        <div style={{ background: 'rgba(15,20,35,.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff' }}>Cash Flow — 30 Days</span>
            <Badge variant="cyan">Live</Badge>
          </div>
          <div className="chart-wrap" style={{ height: 200 }}><canvas ref={chartRef} /></div>
        </div>

        <div style={{ background: 'rgba(15,20,35,.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, color: '#00f2ff' }}>AI Command Feed</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f2ff', animation: 'dpulse 2s infinite' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiTips.map((tip, i) => (
              <div key={i} style={{ background: 'rgba(0,242,255,.04)', border: '1px solid rgba(0,242,255,.1)', borderRadius: 10, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{tip.i}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{tip.t}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', lineHeight: 1.6 }}>{tip.m}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
