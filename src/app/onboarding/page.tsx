'use client';
export const dynamic='force-dynamic';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
const SB_URL='https://ammymxsyerlkdezsxuip.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E';
const sb=createClient(SB_URL,SB_KEY);
function Logo(){
  return(
    <svg width="56" height="56" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="o1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient>
        <linearGradient id="o2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
        <linearGradient id="o3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#08091e"/>
      <rect width="64" height="64" rx="18" fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/>
      <path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#o1)" opacity="0.78"/>
      <path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#o2)" opacity="0.88"/>
      <path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#o3)" opacity="0.72"/>
      <path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="56,-2 60,6 52,2" fill="#00d4ff"/>
    </svg>
  );
}
const STEPS=[
  {n:1,e:'👋',title:'Welcome to FlowFund',sub:'Your AI-powered financial command center',items:[{e:'🧠',t:'AI Financial Advisor',d:'Ask anything about your money. Specific data-driven answers.'},{e:'📊',t:'Smart Dashboard',d:'Financial health score, cashflow forecast, top actions at a glance.'},{e:'⚡',t:'AutoSave Automation',d:'Set rules once. Money moves automatically on every payday.'},{e:'🌍',t:'20+ Languages and Tax Regions',d:'Works in Pashto, Dari, Arabic and 17 more languages.'}]},
  {n:2,e:'💸',title:'Add Your First Transaction',sub:'Start tracking in 30 seconds',items:[{e:'➕',t:'Go to CashFlow',d:'Click CashFlow in sidebar then hit the blue Add button.'},{e:'🤖',t:'AI Auto-Categorizes',d:'Type a description and AI suggests the category instantly.'},{e:'🔄',t:'Mark as Recurring',d:'Toggle recurring for salary or rent — auto-created monthly.'},{e:'📁',t:'Or Import from Bank',d:'Settings then BankSync then Import CSV. Drop your bank export.'}]},
  {n:3,e:'🎯',title:'Set Your First Goal',sub:'Tell FlowFund what you want to achieve',items:[{e:'🏦',t:'Emergency Fund',d:'The number one recommended first goal. Set a 3-month expenses target.'},{e:'📅',t:'Set a Deadline',d:'Give it a date. FlowFund calculates how much to save monthly.'},{e:'🔔',t:'Milestone Alerts',d:'Notified at 25, 50, 75, and 100 percent. Stay motivated.'},{e:'⚙️',t:'Enable AutoSave',d:'AutoSave then Smart Save. FlowFund auto-allocates every payday.'}]},
  {n:4,e:'🤖',title:'Talk to Your AI Advisor',sub:'Ask anything, get answers from your real data',items:[{e:'💬',t:'Click AI Advisor in sidebar',d:'The AI reads all your transactions, goals, and spending patterns.'},{e:'❓',t:'Try these questions',d:'Am I on track this month? What is my biggest spending problem?'},{e:'📈',t:'90-Day Forecast',d:'Ask what finances look like in 90 days. AI projects from real patterns.'},{e:'🚨',t:'Automatic Alerts',d:'FlowFund warns before budget overruns and cash shortfalls happen.'}]},
];
export default function OnboardingPage(){
  const[step,setStep]=useState(0);
  const[done,setDone]=useState(false);
  const[name,setName]=useState('');
  useEffect(()=>{sb.auth.getUser().then(({data})=>{if(!data.user){window.location.href='/login';return;}setName(data.user.user_metadata?.full_name?.split(' ')[0]||'');});},[]);
  const finish=async()=>{const{data}=await sb.auth.getUser();if(data.user)await sb.from('profiles').update({onboarded:true}).eq('id',data.user.id);setDone(true);setTimeout(()=>{window.location.href='/dashboard';},1600);};
  const s=STEPS[step];
  if(done)return(<div style={{minHeight:'100vh',background:'#000814',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18,fontFamily:"'Inter',sans-serif"}}><style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;600;700&display=swap')`}</style><Logo/><div style={{fontFamily:"'Orbitron',monospace",fontSize:24,fontWeight:900,color:'#fff'}}>You are ready.</div><div style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Taking you to your dashboard...</div></div>);
  return(
    <div style={{minHeight:'100vh',background:'#000814',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap')`}</style>
      <div style={{width:'100%',maxWidth:560}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:10}}><Logo/></div>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'rgba(255,255,255,.28)',letterSpacing:'.2em',marginBottom:6}}>FLOWFUND SETUP</div>
          {name&&<div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginBottom:12}}>Welcome, <span style={{color:'#60a5fa',fontWeight:600}}>{name}</span></div>}
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            {STEPS.map((_,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:26,height:26,borderRadius:'50%',background:i<step?'#22c55e':i===step?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:700,border:i===step?'2px solid rgba(26,107,255,.4)':'none'}}>{i<step?'check':(i+1)}</div>{i<3&&<div style={{width:28,height:2,background:i<step?'#22c55e':'rgba(255,255,255,.1)',borderRadius:2}}/>}</div>))}
          </div>
        </div>
        <div style={{background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:28}}>
          <div style={{textAlign:'center',marginBottom:20}}><div style={{fontSize:30,marginBottom:8}}>{s.e}</div><div style={{fontSize:18,fontWeight:800,color:'#fff',marginBottom:5}}>{s.title}</div><div style={{fontSize:12,color:'rgba(255,255,255,.38)'}}>{s.sub}</div></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:22}}>
            {s.items.map((it,i)=>(<div key={i} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'13px 14px'}}><div style={{fontSize:18,marginBottom:6}}>{it.e}</div><div style={{fontSize:11,fontWeight:600,color:'#fff',marginBottom:3}}>{it.t}</div><div style={{fontSize:10,color:'rgba(255,255,255,.38)',lineHeight:1.5}}>{it.d}</div></div>))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            {step>0?<button onClick={()=>setStep(x=>x-1)} style={{padding:'8px 18px',borderRadius:8,border:'1px solid rgba(255,255,255,.12)',background:'transparent',color:'rgba(255,255,255,.45)',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>Back</button>:<div/>}
            <div style={{display:'flex',gap:8}}>
              <button onClick={finish} style={{padding:'8px 14px',borderRadius:8,border:'1px solid rgba(255,255,255,.08)',background:'transparent',color:'rgba(255,255,255,.3)',fontSize:11,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>Skip</button>
              {step<3?<button onClick={()=>setStep(x=>x+1)} style={{padding:'10px 26px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Orbitron',monospace",letterSpacing:'.04em',boxShadow:'0 4px 14px rgba(26,107,255,.35)'}}>Next</button>
              :<button onClick={finish} style={{padding:'10px 26px',borderRadius:8,background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Orbitron',monospace",letterSpacing:'.04em'}}>Enter FlowFund</button>}
            </div>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:12,fontSize:11,color:'rgba(255,255,255,.18)'}}>Step {step+1} of 4</div>
      </div>
    </div>
  );
}
