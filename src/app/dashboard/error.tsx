'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('dashboard_page_error', error, { digest: error.digest });
  }, [error]);

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ background: 'rgba(255,82,82,.06)', border: '1px solid rgba(255,82,82,.2)', borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, color: '#ff8080', marginBottom: 10 }}>
          Module Error
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 24 }}>
          {error.message?.includes('supabase') || error.message?.includes('fetch')
            ? 'Connection issue. Check your network and try again.'
            : 'Something went wrong loading this page. Please try again.'}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre style={{ background: 'rgba(255,82,82,.08)', borderRadius: 8, padding: 12, fontSize: 11, color: '#ff8080', textAlign: 'left', overflow: 'auto', marginBottom: 20 }}>
            {error.stack?.slice(0, 400)}
          </pre>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(255,82,82,.15)', border: '1px solid rgba(255,82,82,.3)', color: '#ff8080', fontFamily: "'Orbitron',sans-serif", fontSize: 11, cursor: 'pointer' }}
          >
            <i className="fas fa-redo" style={{ marginRight: 6 }} />Retry
          </button>
          <a
            href="/dashboard"
            style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(0,242,255,.08)', border: '1px solid rgba(0,242,255,.2)', color: '#00f2ff', fontFamily: "'Orbitron',sans-serif", fontSize: 11, textDecoration: 'none' }}
          >
            <i className="fas fa-th-large" style={{ marginRight: 6 }} />Dashboard
          </a>
        </div>
        {error.digest && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 16, fontFamily: 'monospace' }}>
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
