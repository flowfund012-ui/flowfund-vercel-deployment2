import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#000814', color: '#F5F9FF', fontFamily: 'Roboto, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 80, fontWeight: 700, color: '#1a6bff', textShadow: '0 0 30px rgba(26,107,255,.5)', marginBottom: 8 }}>404</div>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, color: '#e2e8f0', marginBottom: 12 }}>
          Coordinates Not Found
        </h1>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          The mission sector you're looking for doesn't exist or has been relocated.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            href="/dashboard"
            style={{ padding: '10px 24px', borderRadius: 9, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', border: 'none', fontFamily: "'Orbitron', sans-serif", fontSize: 12, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <i className="fas fa-th-large" />Dashboard
          </Link>
          <Link
            href="/"
            style={{ padding: '10px 24px', borderRadius: 9, background: 'transparent', color: '#60a5fa', border: '1px solid rgba(96,165,250,.3)', fontFamily: "'Orbitron', sans-serif", fontSize: 12, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <i className="fas fa-home" />Home
          </Link>
        </div>
      </div>
    </div>
  );
}
