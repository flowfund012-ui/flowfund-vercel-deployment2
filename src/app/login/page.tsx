'use client';
export const dynamic='force-dynamic';
import{useState}from'react';
import{createClient}from'@supabase/supabase-js';
import Link from'next/link';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
function WaveLogo({size=52}:{size?:number}){
  const rx=Math.round(size*0.28);
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg1l" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient>
        <linearGradient id="wg2l" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
        <linearGradient id="wg3l" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx={rx} fill="#08091e"/>
      <rect x="0" y="0" width="64" height="64" rx={rx} fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/>
      <path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#wg1l)" opacity="0.78"/>
      <path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#wg2l)" opacity="0.88"/>
      <path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#wg3l)" opacity="0.72"/>
      <path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="56,-2 60,6 52,2" fill="#00d4ff"/>
    </svg>
  );
}
export default function LoginPage(){
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState('');
  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);setError('');
    const{error:err}=await sb.auth.signInWithPassword({email,password});
    if(err){setError(err.message);setLoading(false);}
    else{window.location.href='/dashboard';}
  };
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:'13px 16px',color:'#fff',fontSize:14,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box',transition:'border-color .2s'};
  return(
    <div style={{minHeight:'100vh',background:'#000814',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');input:focus{border-color:rgba(26,107,255,.5)!important;box-shadow:0 0 0 3px rgba(26,107,255,.1)}`}</style>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:18}}>
            <WaveLogo size={64}/>
          </div>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'.04em',marginBottom:6}}>FlowFund</div>
          <div style={{fontSize:8,color:'rgba(255,255,255,.25)',letterSpacing:'.3em',textTransform:'uppercase',marginBottom:4}}>FINANCIAL OS</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginTop:12}}>Sign in to your command center</div>
        </div>
        <div style={{background:'rgba(13,17,30,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:20,padding:36,backdropFilter:'blur(20px)'}}>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:7,letterSpacing:'.08em',textTransform:'uppercase'}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={inp} required autoFocus/>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                <label style={{fontSize:11,color:'rgba(255,255,255,.38)',letterSpacing:'.08em',textTransform:'uppercase'}}>Password</label>
              </div>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp} required/>
            </div>
            {error&&<div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#ef4444',marginBottom:18}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'13px',borderRadius:11,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Orbitron',monospace",letterSpacing:'.05em',opacity:loading?0.7:1,transition:'all .2s',boxShadow:'0 4px 20px rgba(26,107,255,.35)'}}>
              {loading?'Signing in...':'Sign In'}
            </button>
          </form>
          <div style={{textAlign:'center',marginTop:22,fontSize:13,color:'rgba(255,255,255,.35)'}}>
            No account?{' '}
            <Link href="/signup" style={{color:'#60a5fa',textDecoration:'none',fontWeight:600}}>Create one free →</Link>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:24,fontSize:11,color:'rgba(255,255,255,.18)'}}>
          <Link href="/" style={{color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Back to FlowFund.io</Link>
        </div>
      </div>
    </div>
  );
}
