'use client';
// ── Academy ──────────────────────────────────────────────────
import { useState, useTransition } from 'react';
import type { AcademyProgress } from '@/types/database';
import { COURSES, LEARNING_PATHS, DAILY_CHALLENGES, planCanAccess } from '@/lib/utils';
import { StatCard, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { useUIStore } from '@/store/useUIStore';
import { completeCourse, completeDailyChallenge } from '@/app/actions';
import Link from 'next/link';

interface AcademyProps { initialProgress: AcademyProgress | null; plan: string; userId: string; }

export function AcademyPageComponent({ initialProgress, plan, userId }: AcademyProps) {
  const { showToast } = useUIStore();
  const [progress, setProgress] = useState(initialProgress ?? { xp: 0, completed_courses: [] as string[], streak: 0, last_challenge: null });
  const [pending, startTransition] = useTransition();
  const { xp, completed_courses: done, streak, last_challenge: last } = progress;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const todayDone = last === new Date().toISOString().split('T')[0];
  const todayChallenge = DAILY_CHALLENGES[new Date().getDay() % DAILY_CHALLENGES.length];

  const handleStart = (id: string, courseXp: number) => {
    if (done.includes(id)) { showToast('Already completed!', 'success'); return; }
    startTransition(async () => {
      const res = await completeCourse(id, courseXp);
      if (res?.error && res.error !== 'Already completed') { showToast(res.error, 'error'); return; }
      setProgress(p => ({ ...p, xp: p.xp + courseXp, completed_courses: [...p.completed_courses, id] }));
      showToast(`🎉 Course complete! +${courseXp} XP`, 'success');
    });
  };

  const handleChallenge = () => {
    startTransition(async () => {
      await completeDailyChallenge();
      setProgress(p => ({ ...p, xp: p.xp + 50, streak: p.streak + 1, last_challenge: new Date().toISOString().split('T')[0] }));
      showToast('🔥 Challenge complete! +50 XP', 'success');
    });
  };

  const badges = [{ c: done.length >= 1, i: '🥉', l: 'First Step' },{ c: done.length >= 3, i: '🥈', l: 'Scholar' },{ c: done.length >= 6, i: '🥇', l: 'Master' },{ c: xp >= 500, i: '⚡', l: 'Power User' },{ c: streak >= 7, i: '🔥', l: 'On Fire' }].filter(b => b.c);
  const featured = COURSES.find(c => !done.includes(c.id)) ?? COURSES[0];
  const terminal = { background: 'rgba(15,23,42,.82)', backdropFilter: 'blur(16px)', border: '1px solid rgba(45,212,191,.28)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.35)' };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div><h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize: 22, fontWeight: 700, color: '#2dd4bf', marginBottom: 5 }}>Personal Academy</h1><p style={{ fontSize: 12, color: 'rgba(226,232,240,.38)' }}>Financial Intelligence Hub. Level up your money IQ.</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Badge variant="gold">⭐ Level {level}</Badge><Badge variant="teal">{xp} XP</Badge></div>
      </div>
      <div className="stat-row">
        <StatCard label="XP Earned"    value={String(xp)}          bg="rgba(245,158,11,.08)"  border="rgba(245,158,11,.2)"  valueColor="#f59e0b" />
        <StatCard label="Courses Done" value={String(done.length)} bg="rgba(45,212,191,.08)"  border="rgba(45,212,191,.2)"  valueColor="#2dd4bf" />
        <StatCard label="Level"        value={String(level)}       bg="rgba(16,185,129,.08)"  border="rgba(16,185,129,.2)"  valueColor="#10b981" />
        <StatCard label="Streak"       value={`${streak}🔥`}       bg="rgba(239,68,68,.08)"   border="rgba(239,68,68,.2)"   valueColor="#ef4444" />
      </div>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize: 13, color: '#2dd4bf', marginBottom: 14 }}>Choose Your Learning Path</div>
      <div className="g4" style={{ marginBottom: 24 }}>
        {LEARNING_PATHS.map(p => {
          const locked = !planCanAccess(plan, p.requiredPlan);
          return (
            <div key={p.id} className={`path-card${locked ? ' locked' : ''}`} onClick={() => locked && showToast(`Requires ${p.requiredPlan} plan`, 'error')}>
              {locked && <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,.55)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:6 }}><span style={{ fontSize: 24 }}>🔒</span><Link href="/dashboard/settings" style={{ fontSize:10,color:'#ffd700',fontFamily:"'Orbitron',sans-serif" }}>Upgrade</Link></div>}
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize: 11, fontWeight: 600, color: '#2dd4bf', marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(226,232,240,.38)' }}>{COURSES.filter(c => c.path === p.id).length} courses</div>
            </div>
          );
        })}
      </div>
      <div className="g2" style={{ marginBottom: 20 }}>
        <div style={{ ...terminal, padding: 22 }}>
          <div className="sec-hdr" style={{ marginBottom: 16 }}><span className="sec-title" style={{ color:'#2dd4bf' }}>Featured Course</span><Badge variant="gold">Recommended</Badge></div>
          <div style={{ background:'linear-gradient(-45deg,#1e293b,#3b82f6,#2dd4bf,#10b981)',backgroundSize:'400% 400%',animation:'vidgrad 12s ease infinite',borderRadius:12,height:110,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,marginBottom:16 }}>{featured.icon}</div>
          <div style={{ fontWeight:700,fontSize:15,marginBottom:6,color:'#e2e8f0' }}>{featured.title}</div>
          <div style={{ fontSize:12,color:'rgba(226,232,240,.4)',marginBottom:12 }}>{featured.desc}</div>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:16 }}><Badge variant="gold">{featured.xp} XP</Badge><Badge variant="teal">{featured.lessons} lessons</Badge><Badge variant="gray">{featured.dur}</Badge></div>
          <button className="btn btn-primary btn-sm" onClick={() => handleStart(featured.id, featured.xp)} disabled={pending || done.includes(featured.id)}>
            {done.includes(featured.id) ? '✓ Completed' : <><i className="fas fa-play" /> Start Learning</>}
          </button>
        </div>
        <div style={{ ...terminal, padding: 22 }}>
          <div className="sec-hdr" style={{ marginBottom: 12 }}><span className="sec-title" style={{ color:'#2dd4bf' }}>Your Progress</span></div>
          {COURSES.map(c => { const d=done.includes(c.id); return (
            <div key={c.id} style={{ marginBottom:10 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4 }}>
                <span style={{ color:'rgba(226,232,240,.65)' }}>{c.icon} {c.title}</span>
                <span style={{ color:d?'#10b981':'rgba(226,232,240,.3)' }}>{d?'✓ Done':'Not started'}</span>
              </div>
              <ProgressBar pct={d?100:0} colorClass={d?'pbar-green':'pbar-teal'} />
            </div>
          );})}
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, color:'#2dd4bf', margin:'16px 0 10px' }}>🏅 Earned Badges</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {badges.length > 0 ? badges.map(b=><Badge key={b.l} variant="gold" style={{ padding:'5px 10px',fontSize:11 }}>{b.i} {b.l}</Badge>) : <span style={{ fontSize:11,color:'rgba(226,232,240,.25)' }}>Complete courses to earn badges</span>}
          </div>
        </div>
      </div>
      <div style={{ ...terminal, padding: 22 }}>
        <div className="sec-hdr" style={{ marginBottom: 16 }}><span className="sec-title" style={{ color:'#2dd4bf' }}>📅 Daily Challenge</span><Badge variant="teal">🔥 {streak} day streak</Badge></div>
        <div style={{ background:'rgba(45,212,191,.05)',border:'1px solid rgba(45,212,191,.14)',borderRadius:10,padding:14,display:'flex',gap:12,marginBottom:14,alignItems:'flex-start' }}>
          <span style={{ fontSize:22,flexShrink:0 }}>📅</span>
          <div><div style={{ fontWeight:600,marginBottom:5,fontSize:13,color:'#e2e8f0' }}>Today's Mission</div><div style={{ fontSize:12,color:'rgba(226,232,240,.5)',lineHeight:1.6 }}>{todayChallenge}</div></div>
        </div>
        <button className={`btn btn-sm ${todayDone?'btn-cyan':'btn-primary'}`} onClick={todayDone?undefined:handleChallenge} disabled={todayDone||pending} style={{ fontSize:11 }}>
          {todayDone ? '✓ Completed Today' : '✅ Mark Complete (+50 XP)'}
        </button>
      </div>
    </>
  );
}

export default AcademyPageComponent;
