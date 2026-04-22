'use client';
export const dynamic='force-dynamic';
import{useState}from'react';
import{createClient}from'@supabase/supabase-js';
const SB_URL='https://ammymxsyerlkdezsxuip.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E';
const sb=createClient(SB_URL,SB_KEY);
function Logo(){return(<svg width="64" height="64" viewBox="0 0 64 64"><defs><linearGradient id="s1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient><linearGradient id="s2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient><linearGradient id="s3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="#08091e"/><rect width="64" height="64" rx="18" fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/><path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#s1)" opacity="0.78"/><path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#s2)" opacity="0.88"/><path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#s3)" opacity="0.72"/><path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/><line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/><polygon points="56,-2 60,6 52,2" fill="#00d4ff"/></svg>);}
const ROLES=['Student','Freelancer','Entrepreneur','Employee','Investor','Other'];
export default function SignupPage(){
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[pw,setPw]=useState('');
  const[role,setRole]=useState('Student');
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState('');
  const handle=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setErr('');const{data,error}=await sb.auth.signUp({email,password:pw,options:{data:{full_name:name,role}}});if(error){setErr(error.message);setLoading(false);return;}if(data.user){await sb.from('profiles').upsert({id:data.user.id,full_name:name,role,onboarded:false});window.location.href='/onboarding';}};
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  return(
    <div style={{minHeight:'100vh',background:'#000814',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');input:focus{border-color:rgba(26,107,255,.5)!important;box-shadow:0 0 0 3px rgba(26,107,255,.1)!important}`}</style>
      <div style={{width:'100%',maxWidth:430}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:12}}><Logo/></div>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:18,fontWeight:900,color:'#fff',letterSpacing:'.04em',marginBottom:3}}>FlowFund</div>
          <div style={{fontSize:7,color:'rgba(255,255,255,.22)',letterSpacing:'.3em',textTransform:'uppercase',marginBottom:14}}>FINANCIAL OS</div>
          <div style={{fontSize:19,fontWeight:700,color:'#fff'}}>Start Free</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.38)',marginTop:5}}>No card needed. Full access to free tier forever.</div>
        </div>
        <div style={{background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:28}}>
          <form onSubmit={handle}>
            <div style={{marginBottom:13}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Full Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" style={inp} required autoFocus/></div>
            <div style={{marginBottom:13}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={inp} required/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min 6 characters" style={inp} required minLength={6}/></div>
            <div style={{marginBottom:20}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:7,letterSpacing:'.08em',textTransform:'uppercase'}}>I am a...</label><div style={{display:'flex',flexWrap:'wrap',gap:6}}>{ROLES.map(r=>(<button key={r} type="button" onClick={()=>setRole(r)} style={{padding:'6px 13px',borderRadius:16,border:role===r?'1.5px solid #1a6bff':'1px solid rgba(255,255,255,.1)',background:role===r?'rgba(26,107,255,.14)':'transparent',color:role===r?'#60a5fa':'rgba(255,255,255,.45)',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{r}</button>))}</div></div>
            {err&&<div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.22)',borderRadius:8,padding:'8px 12px',fontSize:12,color:'#ef4444',marginBottom:13}}>{err}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Orbitron',monospace",letterSpacing:'.05em',opacity:loading?0.7:1,boxShadow:'0 4px 16px rgba(26,107,255,.32)'}}>{loading?'Creating Account...':'Create Free Account'}</button>
          </form>
          <div style={{textAlign:'center',marginTop:16,fontSize:12,color:'rgba(255,255,255,.32)'}}>Already have an account?{' '}<a href="/login" style={{color:'#60a5fa',fontWeight:600,textDecoration:'none'}}>Sign in</a></div>
          <div style={{marginTop:16,paddingTop:13,borderTop:'1px solid rgba(255,255,255,.05)',display:'flex',gap:14,justifyContent:'center'}}>{['Free Forever','Zero KYC','Secure'].map(t=>(<div key={t} style={{fontSize:10,color:'rgba(255,255,255,.22)',display:'flex',alignItems:'center',gap:3}}><span style={{color:'#22c55e'}}>check</span>{t}</div>))}</div>
        </div>
        <div style={{textAlign:'center',marginTop:16,fontSize:10}}><a href="/" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>Back to FlowFund</a></div>
      </div>
    </div>
  );
}
