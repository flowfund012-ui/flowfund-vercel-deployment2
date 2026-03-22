'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: '#000814', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#00f2ff', fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={reset}
            style={{ background: 'linear-gradient(135deg, #0066ff, #00f2ff)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
