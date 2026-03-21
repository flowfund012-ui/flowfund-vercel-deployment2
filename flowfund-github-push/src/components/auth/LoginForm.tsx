'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { analytics } from '@/lib/analytics';
import { loginSchema } from '@/lib/validation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async () => {
    setError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.errors[0]?.message ?? 'Invalid input'); return; }
    if (attempts >= 5) { setError('Too many failed attempts. Please wait before trying again.'); return; }

    setLoading(true);
    try {
      await auth.signIn(parsed.data.email, parsed.data.password);
      analytics.track('login', { method: 'email' });
      router.push('/dashboard');
      router.refresh();
    } catch (e: unknown) {
      setAttempts(p => p + 1);
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        setError('Invalid email or password.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email first. Check your inbox.');
      } else if (msg.includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes.');
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <div style={{ position:'absolute',inset:0,pointerEvents:'none' }}>
        <div style={{ position:'absolute',width:200,height:200,background:'rgba(255,215,0,.06)',borderRadius:'50%',filter:'blur(60px)',top:'20%',left:'20%' }} />
        <div style={{ position:'absolute',width:280,height:280,background:'rgba(0,102,255,.05)',borderRadius:'50%',filter:'blur(60px)',top:'60%',left:'55%' }} />
      </div>
      <div className="vault-card">
        <div style={{ background:'linear-gradient(135deg,#001f3f,#0a1128)',padding:'36px 32px',textAlign:'center',borderBottom:'1px solid rgba(255,215,0,.1)' }}>
          <div style={{ width:72,height:72,margin:'0 auto 16px',background:'rgba(255,215,0,.1)',border:'1px solid rgba(255,215,0,.25)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <i className="fas fa-lock-open" style={{ fontSize:30,color:'#ffd700' }} />
          </div>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,marginBottom:6,background:'linear-gradient(135deg,#ffd700,#b8860b)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>ACCESS THE VAULT</h1>
          <p style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>Welcome back, Financial Architect</p>
        </div>
        <div style={{ padding:32 }}>
          {error && (
            <div style={{ background:'rgba(255,82,82,.1)',border:'1px solid rgba(255,82,82,.3)',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#ff8080',display:'flex',alignItems:'flex-start',gap:8 }}>
              <i className="fas fa-exclamation-circle" style={{ marginTop:1,flexShrink:0 }} /><span>{error}</span>
            </div>
          )}
          {attempts >= 3 && attempts < 5 && (
            <div style={{ background:'rgba(255,215,0,.06)',border:'1px solid rgba(255,215,0,.2)',borderRadius:8,padding:'8px 12px',marginBottom:12,fontSize:12,color:'rgba(255,215,0,.8)',display:'flex',alignItems:'center',gap:6 }}>
              <i className="fas fa-exclamation-triangle" />{5 - attempts} attempts remaining.
            </div>
          )}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block',fontSize:12,fontWeight:500,color:'rgba(255,255,255,.65)',marginBottom:7 }}>FlowFund ID</label>
            <div style={{ position:'relative' }}>
              <i className="fas fa-user-shield" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,215,0,.6)',fontSize:14,pointerEvents:'none' }} />
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@flowfund.id" className="vault-input" autoComplete="email" disabled={loading} onKeyDown={e=>{if(e.key==='Enter')handleLogin();}} />
            </div>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block',fontSize:12,fontWeight:500,color:'rgba(255,255,255,.65)',marginBottom:7 }}>Encryption Key</label>
            <div style={{ position:'relative' }}>
              <i className="fas fa-key" style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,215,0,.6)',fontSize:14,pointerEvents:'none' }} />
              <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="vault-input" autoComplete="current-password" disabled={loading} onKeyDown={e=>{if(e.key==='Enter')handleLogin();}} />
              <i className={`fas ${showPass?'fa-eye':'fa-eye-slash'}`} onClick={()=>setShowPass(!showPass)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)',cursor:'pointer',fontSize:14 }} />
            </div>
          </div>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:22,fontSize:13 }}>
            <Link href="/auth/reset-password" style={{ color:'#ffd700' }}>Recover access</Link>
          </div>
          <button onClick={handleLogin} disabled={loading||attempts>=5}
            style={{ width:'100%',padding:13,borderRadius:10,border:'none',cursor:loading||attempts>=5?'not-allowed':'pointer',fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:700,letterSpacing:'.03em',background:loading||attempts>=5?'rgba(255,215,0,.3)':'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',boxShadow:'0 4px 18px rgba(255,215,0,.3)',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
            {loading?<><i className="fas fa-circle-notch spinning"/>Authenticating...</>:<>UNLOCK COMMAND CENTER<i className="fas fa-arrow-right"/></>}
          </button>
          <p style={{ textAlign:'center',marginTop:18,fontSize:13,color:'rgba(255,255,255,.3)' }}>
            No account?{' '}<Link href="/signup" style={{ color:'#ffd700' }}>Create one free →</Link>
          </p>
          <p style={{ textAlign:'center',marginTop:6,fontSize:12,color:'rgba(255,255,255,.2)' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.3)' }}>← Back to Landing Page</Link>
          </p>
        </div>
        <div style={{ background:'rgba(0,0,0,.3)',borderTop:'1px solid rgba(255,255,255,.05)',padding:'14px 24px',textAlign:'center' }}>
          <div style={{ display:'flex',justifyContent:'center',gap:10,marginBottom:6 }}>
            {[{icon:'fa-shield-alt',text:'AES-256 Encrypted',bg:'rgba(0,100,50,.3)',c:'#4ade80'},{icon:'fa-user-secret',text:'Zero Tracking',bg:'rgba(0,60,100,.3)',c:'#60a5fa'}].map(b=>(
              <span key={b.text} style={{ display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:6,background:b.bg,color:b.c,fontSize:11 }}>
                <i className={`fas ${b.icon}`}/>{b.text}
              </span>
            ))}
          </div>
          <p style={{ fontSize:11,color:'rgba(255,255,255,.2)' }}>FlowFund OS v3.0 • Enterprise Security</p>
        </div>
      </div>
    </div>
  );
}
