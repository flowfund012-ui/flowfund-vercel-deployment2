'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
function LogoMark({ size = 44 }: { size?: number }) {
  const r = Math.round(size * 0.24);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="bg" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#7c00ff"/></linearGradient></defs>
      <rect x="0" y="0" width="64" height="64" rx={r} fill="#0d1225" stroke="rgba(26,107,255,0.35)" strokeWidth="1"/>
      <rect x="10" y="44" width="10" height="14" rx="2.5" fill="#1a6bff" opacity="0.7"/>
      <rect x="23" y="36" width="10" height="22" rx="2.5" fill="#7c00ff" opacity="0.85"/>
      <rect x="36" y="26" width="10" height="32" rx="2.5" fill="url(#bg)"/>
      <polyline points="15,42 28,34 41,24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="41,24 52,19 48,28" fill="#00d4ff"/>
    </svg>
  );
}
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error: err } = await sb.auth.signInWithPassword({ email, password: pass });
    if (err) { setError(err.message); setLoading(false); }
    else window.location.href = '/dashboard';
  };
  return (
    <div style={{ minHeight:'100vh', background:'#070810', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'Inter',sans-serif" }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 20%,rgba(26,107,255,.1),transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(124,0,255,.08),transparent 60%)', pointerEvents:'none' }}/>
      <div style={{ width:'100%', maxWidth:420, position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <LogoMark size={44}/>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'0.05em', lineHeight:1 }}>FlowFund</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:'0.3em', marginTop:3 }}>FINANCIAL OS</div>
            </div>
          </div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:'#fff', marginBottom:6, marginTop:8 }}>Welcome Back</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.38)' }}>Sign in to your command center</p>
        </div>
        <div style={{ background:'rgba(13,17,23,.9)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }}>
          {error && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:13, color:'#ef4444' }}>{error}</div>}
          <form onSubmit={login}>
            {[{l:'Email',t:'email',v:email,s:setEmail,p:'you@example.com'},{l:'Password',t:'password',v:pass,s:setPass,p:'••••••••'}].map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.07em'}}>{f.l}</label>
                <input type={f.t} value={f.v} onChange={e=>f.s(e.target.value)} required placeholder={f.p}
                  style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box',transition:'border-color .2s',fontFamily:"'Inter',sans-serif"}}
                  onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              </div>
            ))}
            <button type="submit" disabled={loading} style={{width:'100%',marginTop:8,padding:'13px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:loading?.7:1,boxShadow:'0 4px 20px rgba(26,107,255,.3)',transition:'all .2s'}}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{marginTop:20,paddingTop:20,borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Link href="/signup" style={{fontSize:13,color:'rgba(255,255,255,.38)',textDecoration:'none'}}>No account? <span style={{color:'#60a5fa'}}>Start free</span></Link>
            <Link href="/" style={{fontSize:13,color:'rgba(255,255,255,.25)',textDecoration:'none'}}>Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
