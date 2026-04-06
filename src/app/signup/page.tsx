'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const ROLES=['Student','Freelancer','Entrepreneur','Employee','Investor','Other'];
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const signup = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { data, error: err } = await sb.auth.signUp({ email, password: pass, options: { data: { full_name: name, role } } });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await sb.from('profiles').upsert({ id: data.user.id, full_name: name, role, plan: 'free', email });
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };
  const inp: React.CSSProperties = { width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box',transition:'border-color .2s',fontFamily:"'Inter',sans-serif" };
  if (success) return (
    <div style={{ minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:20 }}>
      <div>
        <div style={{ fontSize:48,marginBottom:16 }}>*</div>
        <h2 style={{ fontFamily:"'Orbitron',monospace",fontSize:20,color:'#10b981',marginBottom:8 }}>Account Created!</h2>
        <p style={{ color:'rgba(255,255,255,.5)',marginBottom:24 }}>Check your email to confirm, then log in.</p>
        <Link href="/login" style={{ padding:'10px 24px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',fontSize:13,fontWeight:700 }}>Go to Login</Link>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'Inter',sans-serif" }}>
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 70% 20%,rgba(124,0,255,.12),transparent 60%),radial-gradient(ellipse at 30% 80%,rgba(26,107,255,.1),transparent 60%)',pointerEvents:'none' }}/>
      <div style={{ width:'100%',maxWidth:440,position:'relative' }}>
        <div style={{ textAlign:'center',marginBottom:32 }}>
          <div style={{ width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 30px rgba(26,107,255,.4)' }}>
            <span style={{ fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff' }}>F</span>
          </div>
          <h1 style={{ fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#fff',marginBottom:6 }}>Start Free</h1>
          <p style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>No card needed. Full access to free tier forever.</p>
        </div>
        <div style={{ background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:32,backdropFilter:'blur(20px)' }}>
          {error && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:10,padding:'10px 14px',marginBottom:18,fontSize:13,color:'#ef4444' }}>{error}</div>}
          <form onSubmit={signup}>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em' }}>Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Maiwand Ahmadzai" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em' }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em' }}>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required placeholder="Min 6 characters" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em' }}>I am a...</label>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {ROLES.map(r=>(
                  <button key={r} type="button" onClick={()=>setRole(r)} style={{ padding:'6px 14px',borderRadius:100,fontSize:12,border:'1px solid',borderColor:role===r?'#1a6bff':'rgba(255,255,255,.12)',background:role===r?'rgba(26,107,255,.15)':'transparent',color:role===r?'#60a5fa':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all .15s' }}>{r}</button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%',padding:'13px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:loading?.7:1,boxShadow:'0 4px 20px rgba(26,107,255,.35)',transition:'all .2s' }}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>
          <div style={{ marginTop:20,paddingTop:20,borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <Link href="/login" style={{ fontSize:13,color:'rgba(255,255,255,.4)',textDecoration:'none' }}>Have account? <span style={{ color:'#60a5fa' }}>Sign in</span></Link>
            <Link href="/" style={{ fontSize:13,color:'rgba(255,255,255,.3)',textDecoration:'none' }}>Home</Link>
          </div>
        </div>
        <div style={{ display:'flex',justifyContent:'center',gap:24,marginTop:24 }}>
          {[['Free Forever','No card needed'],['Zero KYC','Crypto payments'],['Secure','Bank-grade auth']].map(([t,d])=>(
            <div key={t} style={{ textAlign:'center' }}>
              <div style={{ fontSize:12,fontWeight:600,color:'rgba(255,255,255,.5)' }}>{t}</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,.25)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
