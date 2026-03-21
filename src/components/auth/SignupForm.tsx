'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { analytics } from '@/lib/analytics';
import { signupSchema } from '@/lib/validation';

export default function SignupForm() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  // Password strength indicator
  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : /(?=.*[A-Z])(?=.*[0-9])/.test(password) ? 3
    : 2;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ff5252', '#f59e0b', '#10b981'][strength];

  const handleSignup = async () => {
    setError('');

    // Client-side Zod validation (mirrors server schema)
    const parsed = signupSchema.safeParse({ name, email, password, confirm });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    try {
      await auth.signUp(parsed.data.email, parsed.data.password, parsed.data.name);
      analytics.track('signup', { method: 'email' });
      setSuccess(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (msg.includes('rate limit')) {
        setError('Too many sign-up attempts. Please wait a moment.');
      } else {
        setError(msg || 'Sign-up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-bg">
        <div className="vault-card" style={{ maxWidth: 480 }}>
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-envelope-open-text" style={{ fontSize: 32, color: '#10b981' }} />
            </div>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, color: '#ffd700', marginBottom: 12 }}>CHECK YOUR EMAIL</h2>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              We sent a confirmation link to
            </p>
            <p style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{email}</p>
            <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
              Click the link to activate your FlowFund account. Check spam if you don't see it.
            </p>
            <Link href="/login" className="btn btn-gold btn-block">
              Go to Login <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 200, height: 200, background: 'rgba(255,215,0,.06)', borderRadius: '50%', filter: 'blur(60px)', top: '20%', left: '20%' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, background: 'rgba(0,102,255,.05)', borderRadius: '50%', filter: 'blur(60px)', top: '60%', right: '10%' }} />
      </div>

      <div className="vault-card">
        <div style={{ background: 'linear-gradient(135deg,#001f3f,#0a1128)', padding: '32px 32px 28px', textAlign: 'center', borderBottom: '1px solid rgba(255,215,0,.1)' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 14px', background: 'rgba(255,215,0,.1)', border: '1px solid rgba(255,215,0,.25)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-rocket" style={{ fontSize: 26, color: '#ffd700' }} />
          </div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6, background: 'linear-gradient(135deg,#ffd700,#b8860b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            JOIN FLOWFUND
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Command your finances starting today</p>
        </div>

        <div style={{ padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,82,82,.1)', border: '1px solid rgba(255,82,82,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#ff8080', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <i className="fas fa-exclamation-circle" style={{ marginTop: 1, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="ff-group">
            <label className="ff-label">Full Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Maiwand Ahmadzai" className="ff-input"
              autoComplete="name" disabled={loading}
              onKeyDown={e => { if (e.key === 'Enter') handleSignup(); }}
            />
          </div>

          <div className="ff-group">
            <label className="ff-label">Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className="ff-input"
              autoComplete="email" disabled={loading}
              onKeyDown={e => { if (e.key === 'Enter') handleSignup(); }}
            />
          </div>

          <div className="ff-group">
            <label className="ff-label">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters" className="ff-input"
              autoComplete="new-password" disabled={loading}
            />
            {password.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(strength / 3) * 100}%`, background: strengthColor, transition: 'all .3s', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 10, color: strengthColor, fontFamily: "'Orbitron',sans-serif", minWidth: 36 }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="ff-group">
            <label className="ff-label">Confirm Password</label>
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password" className="ff-input"
              autoComplete="new-password" disabled={loading}
              onKeyDown={e => { if (e.key === 'Enter') handleSignup(); }}
              style={confirm && confirm !== password ? { borderColor: 'rgba(255,82,82,.5)' } : undefined}
            />
            {confirm && confirm !== password && (
              <div style={{ fontSize: 11, color: '#ff8080', marginTop: 4 }}>
                <i className="fas fa-times" style={{ marginRight: 4 }} />Passwords do not match
              </div>
            )}
          </div>

          <button
            onClick={handleSignup} disabled={loading}
            style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '.03em', background: loading ? 'rgba(255,215,0,.4)' : 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', boxShadow: '0 4px 18px rgba(255,215,0,.3)', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}
          >
            {loading ? <><i className="fas fa-circle-notch spinning" /> Creating Account...</> : <>CREATE ACCOUNT <i className="fas fa-arrow-right" /></>}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#ffd700' }}>Login →</Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 10, lineHeight: 1.6 }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: 'rgba(255,255,255,.35)' }}>Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}
