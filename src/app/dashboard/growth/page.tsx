'use client';

export const dynamic = 'force-dynamic';

export default function Growth EnginePage() {
  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#e8e8f4' }}>Growth Engine</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9b9bba', marginTop: 3 }}>Compound interest and FIRE calculators</p>
        </div>
      </div>
      <div style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f4', marginBottom: 8 }}>Growth Engine Module</div>
        <div style={{ fontSize: 13, color: '#5c5c7a', lineHeight: 1.6 }}>Compound interest and FIRE calculators<br/>Connect your Supabase account to see live data.</div>
      </div>
    </div>
  );
}
