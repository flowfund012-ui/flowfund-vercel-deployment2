'use client';

export const dynamic = 'force-dynamic';

export default function SecurityPage() {
  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#10b981,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#e8e8f4' }}>Security Hub</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9b9bba', marginTop: 3 }}>Your account security overview</p>
        </div>
      </div>
      <div style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f4', marginBottom: 8 }}>Security Hub</div>
        <div style={{ fontSize: 13, color: '#5c5c7a', lineHeight: 1.6 }}>Your account security overview</div>
      </div>
    </div>
  );
}
