export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: '#000814', color: '#F5F9FF', fontFamily: 'Roboto, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, color: '#ff8080', marginBottom: 12 }}>
            System Error
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            FlowFund encountered an unexpected error. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ background: 'rgba(255,82,82,.08)', border: '1px solid rgba(255,82,82,.2)', borderRadius: 8, padding: 14, fontSize: 11, color: '#ff8080', textAlign: 'left', overflow: 'auto', marginBottom: 20 }}>
              {error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ padding: '10px 24px', borderRadius: 9, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', fontFamily: "'Orbitron', sans-serif", fontSize: 12, cursor: 'pointer' }}
            >
              <i className="fas fa-redo" style={{ marginRight: 6 }} />Try Again
            </button>
            <a
              href="/"
              style={{ padding: '10px 24px', borderRadius: 9, background: 'transparent', color: '#60a5fa', border: '1px solid rgba(96,165,250,.3)', fontFamily: "'Orbitron', sans-serif", fontSize: 12, cursor: 'pointer', textDecoration: 'none' }}
            >
              <i className="fas fa-home" style={{ marginRight: 6 }} />Home
            </a>
          </div>
          {error.digest && (
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 20, fontFamily: 'monospace' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
