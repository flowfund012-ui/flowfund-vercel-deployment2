'use client';
import { useEffect } from 'react';
export default function ModuleError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ background: 'rgba(255,82,82,.06)', border: '1px solid rgba(255,82,82,.2)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, color: '#ff8080', marginBottom: 8 }}>Error loading module</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>{error.message}</p>
        <button onClick={reset} style={{ padding: '8px 18px', borderRadius: 8, background: 'rgba(255,82,82,.15)', border: '1px solid rgba(255,82,82,.3)', color: '#ff8080', fontFamily: "'Orbitron',sans-serif", fontSize: 11, cursor: 'pointer' }}>
          ↺ Retry
        </button>
      </div>
    </div>
  );
}
