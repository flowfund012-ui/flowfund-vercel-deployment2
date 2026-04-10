'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const STEPS = [
  { id: 0, title: 'Welcome to FlowFund OS', subtitle: 'Your financial command center is ready.', icon: 'F' },
  { id: 1, title: 'Set Up Your Profile', subtitle: 'Tell us about yourself so we can personalize your experience.', icon: 'P' },
  { id: 2, title: 'Log Your First Transaction', subtitle: 'Add a recent income or expense to get started.', icon: 'T' },
  { id: 3, title: 'Create a Savings Goal', subtitle: 'Set a goal and AutoPilot will help you hit it.', icon: 'G' },
];
const ROLES = ['Student','Freelancer','Entrepreneur','Employee','Investor','Other'];
const CATS = ['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Salary','Freelance','Other'];
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [txDesc, setTxDesc] = useState('');
  const [txAmt, setTxAmt] = useState('');
  const [txType, setTxType] = useState<'income'|'expense'>('income');
  const [txCat, setTxCat] = useState('Salary');
  const [goalName, setGoalName] = useState('');
  const [goalAmt, setGoalAmt] = useState('');
  const [goalCat, setGoalCat] = useState('Emergency Fund');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    sb.auth.getSession().then(({data:{session}}) => {
      if (!session) { window.location.href = '/login'; return; }
      setUid(session.user.id);
      setName(session.user.user_metadata?.full_name || '');
      setRole(session.user.user_metadata?.role || 'Student');
    });
  }, []);
  const pct = ((step) / STEPS.length) * 100;
  const inp: React.CSSProperties = { width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:"'Inter',sans-serif",transition:'border-color .2s' };
  const saveStep = async () => {
    if (!uid) return; setSaving(true);
    if (step === 1) {
      await sb.from('profiles').upsert({ id: uid, full_name: name.trim() || 'Commander', role, updated_at: new Date().toISOString() });
    } else if (step === 2 && txDesc.trim() && txAmt) {
      await sb.from('transactions').insert({ user_id: uid, type: txType, description: txDesc.trim(), amount: parseFloat(txAmt), category: txCat, date: new Date().toISOString().split('T')[0] });
    } else if (step === 3 && goalName.trim() && goalAmt) {
      await sb.from('savings_goals').insert({ user_id: uid, name: goalName.trim(), category: goalCat, target_amount: parseFloat(goalAmt), current_amount: 0 });
    }
    setSaving(false);
    if (step >= STEPS.length - 1) { setDone(true); setTimeout(() => { window.location.href = '/dashboard'; }, 1800); }
    else setStep(s => s + 1);
  };
  if (done) return (
    <div style={{ minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,fontFamily:"'Inter',sans-serif" }}>
      <div style={{ width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 40px rgba(16,185,129,.5)',fontSize:32 }}>*</div>
      <h2 style={{ fontFamily:"'Orbitron',monospace",fontSize:22,color:'#10b981' }}>Mission Ready!</h2>
      <p style={{ color:'rgba(255,255,255,.5)',fontSize:14 }}>Taking you to your command center...</p>
    </div>
  );
  return (
    <div style={{ minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'Inter',sans-serif" }}>
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(26,107,255,.1),transparent 60%)',pointerEvents:'none' }}/>
      <div style={{ width:'100%',maxWidth:520,position:'relative' }}>
        {/* Progress */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
            {STEPS.map((s,i) => (
              <div key={s.id} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:4 }}>
                <div style={{ width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,transition:'all .3s',background:i<step?'#10b981':i===step?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.06)',color:i<=step?'#fff':'rgba(255,255,255,.3)',border:i===step?'none':'1px solid rgba(255,255,255,.1)',boxShadow:i===step?'0 0 20px rgba(26,107,255,.4)':i<step?'0 0 10px rgba(16,185,129,.3)':'none' }}>
                  {i<step?'OK':s.icon}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'rgba(255,255,255,.07)',borderRadius:100,height:3 }}>
            <div style={{ background:'linear-gradient(90deg,#1a6bff,#7c00ff)',borderRadius:100,height:3,width:pct+'%',transition:'width .5s ease' }}/>
          </div>
          <div style={{ textAlign:'right',marginTop:6,fontSize:11,color:'rgba(255,255,255,.3)' }}>Step {step+1} of {STEPS.length}</div>
        </div>
        <div style={{ background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:'36px 32px',backdropFilter:'blur(20px)' }}>
          <div style={{ marginBottom:28,textAlign:'center' }}>
            <div style={{ width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 0 24px rgba(26,107,255,.35)',fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff' }}>{STEPS[step].icon}</div>
            <h2 style={{ fontFamily:"'Orbitron',monospace",fontSize:18,fontWeight:700,color:'#fff',marginBottom:6 }}>{STEPS[step].title}</h2>
            <p style={{ fontSize:13,color:'rgba(255,255,255,.45)' }}>{STEPS[step].subtitle}</p>
          </div>
          {step === 0 && (
            <div style={{ textAlign:'center' }}>
              {[['6','Modules'],['Real-time','Insights'],['AutoPilot','Automation'],['$0','To start']].map(([v,l])=>(
                <div key={l} style={{ display:'inline-block',textAlign:'center',margin:'0 16px 12px' }}>
                  <div style={{ fontSize:20,fontWeight:700,color:'#60a5fa',fontFamily:"'Orbitron',monospace" }}>{v}</div>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>{l}</div>
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em' }}>Your Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              </div>
              <div>
                <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em' }}>I am a...</label>
                <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                  {ROLES.map(r=>(
                    <button key={r} type="button" onClick={()=>setRole(r)} style={{ padding:'7px 16px',borderRadius:100,fontSize:13,border:'1px solid',borderColor:role===r?'#1a6bff':'rgba(255,255,255,.12)',background:role===r?'rgba(26,107,255,.15)':'transparent',color:role===r?'#60a5fa':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all .15s' }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <div style={{ display:'flex',gap:8 }}>
                {(['income','expense'] as const).map(t=>(
                  <button key={t} type="button" onClick={()=>{setTxType(t);setTxCat(t==='income'?'Salary':'Food');}} style={{ flex:1,padding:'10px',borderRadius:10,border:'1px solid',borderColor:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.1)',background:txType===t?(t==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)'):'transparent',color:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,transition:'all .15s' }}>{t==='income'?'Income':'Expense'}</button>
                ))}
              </div>
              <input value={txDesc} onChange={e=>setTxDesc(e.target.value)} placeholder="Description (e.g. Monthly salary)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <input type="number" value={txAmt} onChange={e=>setTxAmt(e.target.value)} placeholder="Amount ($)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <select value={txCat} onChange={e=>setTxCat(e.target.value)} style={{...inp,background:'rgba(13,17,23,.9)'}}>
                {CATS.map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
          )}
          {step === 3 && (
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <input value={goalName} onChange={e=>setGoalName(e.target.value)} placeholder="Goal name (e.g. Emergency Fund)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <input type="number" value={goalAmt} onChange={e=>setGoalAmt(e.target.value)} placeholder="Target amount ($)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <select value={goalCat} onChange={e=>setGoalCat(e.target.value)} style={{...inp,background:'rgba(13,17,23,.9)'}}>
                {['Emergency Fund','Housing','Tech','Travel','Investment','Education','Business','Vehicle','Custom'].map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
          )}
          <div style={{ marginTop:28,display:'flex',gap:10 }}>
            {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{ padding:'11px 20px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',cursor:'pointer',fontFamily:"'Inter',sans-serif",fontSize:13 }}>Back</button>}
            <button onClick={saveStep} disabled={saving} style={{ flex:1,padding:'13px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?.7:1,boxShadow:'0 4px 20px rgba(26,107,255,.3)',transition:'all .2s' }}>
              {saving?'Saving...':(step===STEPS.length-1?'Launch Dashboard':step===0?'Get Started':'Continue')}
            </button>
          </div>
          {step>0 && step<STEPS.length-1 && (
            <button onClick={()=>setStep(s=>s+1)} style={{ width:'100%',marginTop:8,padding:'9px',borderRadius:8,background:'none',border:'none',color:'rgba(255,255,255,.3)',cursor:'pointer',fontSize:12,fontFamily:"'Inter',sans-serif" }}>Skip this step</button>
          )}
        </div>
      </div>
    </div>
  );
}
