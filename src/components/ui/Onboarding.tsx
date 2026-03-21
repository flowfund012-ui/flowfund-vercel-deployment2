'use client';
import { useState, useEffect } from 'react';

const STEPS = [
  {
    icon: 'ðŸ‘‹',
    title: 'Welcome to FlowFund OS',
    desc: 'Your complete financial command center. Let\'s get you set up in 2 minutes.',
    action: 'Let\'s Go',
  },
  {
    icon: 'ðŸ“Š',
    title: 'Track Your Transactions',
    desc: 'Go to Mission Tracker to log your first income or expense. Track everything â€” even the small stuff.',
    action: 'Got it',
  },
  {
    icon: 'ðŽ¯'%,
    title: 'Set Your First Goal',
    desc: 'Head to AutoPilot and create a savings goal. Goals&÷ith deadlines are 3x more likely to be achieved.',
    action: 'Got it',
  },
  {
    icon: 'ðŸŽ“'%,
    title: 'Start Learning',
    desc: 'The Academy has 6 courses covering budgeting, debt elimination, side income, and passive income.',
    action: 'Got it',
  },
  {
    icon: 'ðŸš€',
    title: 'You\'rReady!',
    desc: 'FlowFund is now your financial HQ. Come back daily to track progress and level up your financial intelligence.',
    action: 'Start Using FlowFund',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const done = localStorage.getItem('ff_onboarded'); if (!done) setVisible(true); }, []);
  const handleNext = () => { if (step < STEPS.length - 1) { setStep(s => s + 1); } else { localStorage.setItem('ff_onboarded', '1'); setVisible(false); } };
  const handleSkip = () => { localStorage.setItem('ff_onboarded', '1'); setVisible(false); };
  if (!visible) return null;
  const current = STEPS[step];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'linear-gradient(135deg,rgba(0,8,20,.98),rgba(5,15,35,.98))', border: '1px solid rgba(0,102,255,.3)', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', boxShadow: '0 0 60px rgba(0,102,255,.2)' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {STEPS.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? '#0066ff' : 'rgba(255,255,255,.1)', transition: 'all .3s' }} />)}
        </div>
        <div style={{ textAlign: 'center', fontSize: 56, marginBottom: 20 }}>{current.icon}</div>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 16 }}>{current.title}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.8, textAlign: 'center', marginBottom: 32 }}>{current.desc}</p>
        <button onClick={handleNext} style={{ width: '100%', padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', border: 'none', color: '#fff', fontFamily: "'Orbitron',sans-serif", fontSize: 13, cursor: 'pointer', marginBottom: 12, boxShadow: '0 0 20px rgba(0,102,255,.4)' }}>{current.action} {step < STEPS.length - 1 ? 'â†’' : 'ðŸš€'}</button>
        {step < STEPS.length - 1 && <button onClick={handleSkip} style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)', fontSize: 12, cursor: 'pointer' }}>Skip intro</button>}
      </div>
    </div>
  );
}
