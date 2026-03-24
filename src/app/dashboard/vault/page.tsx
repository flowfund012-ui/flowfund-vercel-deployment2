'use client';

export const dynamic = 'force-dynamic';

export default function VaultPage() {
  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#06b6d4,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔒</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#e8e8f4' }}>Vault</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#9b9bba', marginTop: 3 }}>Premium resources and downloads</p>
        </div>
      </div>
      <div style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f4', marginBottom: 8 }}>Vault Module</div>
        <div style={{ fontSize: 13, color: '#5c5c7a', lineHeight: 1.6 }}>Premium resources and downloads<br/>Connect your Supabase account to see live data.</div>
      </div>
    </div>
  );
}
