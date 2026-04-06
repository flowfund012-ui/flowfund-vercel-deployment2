'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
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
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 20%,rgba(26,107,255,.12),transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(124,0,255,.1),transparent 60%)', pointerEvents:'none' }}/>
      <div style={{ width:'100%', maxWidth:420, position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 30px rgba(26,107,255,.4)' }}>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:700, color:'#fff' }}>F</span>
          </div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:700, color:'#fff', marginBottom:6 }}>Welcome Back</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,.4)' }}>Sign in to your FlowFund OS</p>
        </div>
        <div style={{ background:'rgba(13,17,23,.9)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }}>
          {error && <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:13, color:'#ef4444' }}>{error}</div>}
          <form onSubmit={login}>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,.4)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.06em' }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={{ width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box',transition:'border-color .2s' }} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'} />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,.4)', marginBottom:5, textTransform:'uppercase', letterSpacing:'.06em' }}>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required placeholder="••••••••" style={{ width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box',transition:'border-color .2s' }} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'} />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%',padding:'13px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:loading?.7:1,transition:'all .2s',boxShadow:'0 4px 20px rgba(26,107,255,.35)' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Link href="/signup" style={{ fontSize:13, color:'rgba(255,255,255,.4)', textDecoration:'none' }}>No account? <span style={{ color:'#60a5fa' }}>Sign up free</span></Link>
            <Link href="/" style={{ fontSize:13, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>Home</Link>
          </div>
        </div>
        <p style={{ textAlign:'center', marginTop:24, fontSize:11, color:'rgba(255,255,255,.2)' }}>FlowFund OS v3.0 - Bank-grade security</p>
      </div>
    </div>
  );
}
