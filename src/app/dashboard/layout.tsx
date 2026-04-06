'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const sb = createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: 'D', color: '#00f2ff', exact: true },
  { href: '/dashboard/mission', label: 'Mission Tracker', icon: 'T', color: '#10b981' },
  { href: '/dashboard/autopilot', label: 'AutoPilot', icon: 'A', color: '#a78bfa' },
  { href: '/dashboard/growth', label: 'Growth Engine', icon: 'G', color: '#2dd4bf' },
  { href: '/dashboard/academy', label: 'Academy', icon: 'E', color: '#f59e0b' },
  { href: '/dashboard/vault', label: 'Vault', icon: 'V', color: '#00f0ff' },
  { href: '/dashboard/security', label: 'Security', icon: 'S', color: '#00ff9d' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      const { data: p } = await sb.from('profiles').select('full_name,plan').eq('id', session.user.id).single();
      setProfile(p);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#070810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(26,107,255,.5)', animation: 'pulse 2s infinite' }}>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, color: '#fff' }}>F</span>
        </div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: '.2em' }}>LOADING</div>
      </div>
    </div>
  );

  const isActive = (item: typeof NAV[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const sidebarW = collapsed ? 64 : 240;

  return (
    <div style={{ minHeight: '100vh', background: '#070810', color: '#f0f6ff', fontFamily: "'Inter',system-ui,sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 100px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.2); }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(.95)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(26,107,255,.3)} 50%{box-shadow:0 0 40px rgba(26,107,255,.6)} }
        .nav-item { transition: all .2s ease; }
        .nav-item:hover { background: rgba(255,255,255,.06) !important; transform: translateX(2px); }
        .nav-item.active { animation: none; }
        .content-area { animation: fadeIn .3s ease; }
        .glass-card { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .btn-primary { transition: all .2s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(26,107,255,.4) !important; }
        .btn-primary:active { transform: translateY(0); }
        input, select, textarea { transition: border-color .2s ease; }
        input:focus, select:focus, textarea:focus { border-color: rgba(0,242,255,.4) !important; box-shadow: 0 0 0 3px rgba(0,242,255,.08); outline: none; }
        .metric-card { transition: all .2s ease; }
        .metric-card:hover { transform: translateY(-2px); }
        @media (max-width: 768px) { .sidebar-desktop { display: none !important; } .mobile-nav { display: flex !important; } }
        @media (min-width: 769px) { .mobile-nav { display: none !important; } }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar-desktop" style={{
        width: sidebarW, minHeight: '100vh', flexShrink: 0,
        background: 'rgba(7,8,16,.95)', borderRight: '1px solid rgba(255,255,255,.06)',
        backdropFilter: 'blur(20px)', position: 'fixed', top: 0, left: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', zIndex: 40, transition: 'width .25s ease',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(26,107,255,.4)', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>F</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1 }}>FlowFund</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>OS v3.0</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(26,107,255,.4)' }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>F</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', cursor: 'pointer', padding: 4, borderRadius: 6, fontSize: 14, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {collapsed ? '>' : '<'}
          </button>
        </div>

        {/* Plan badge */}
        {!collapsed && profile && (
          <div style={{ padding: '10px 16px' }}>
            <div style={{ padding: '6px 10px', borderRadius: 8, background: profile.plan === 'premium' ? 'rgba(255,215,0,.08)' : profile.plan === 'pro' ? 'rgba(0,242,255,.06)' : 'rgba(255,255,255,.04)', border: '1px solid ' + (profile.plan === 'premium' ? 'rgba(255,215,0,.2)' : profile.plan === 'pro' ? 'rgba(0,242,255,.15)' : 'rgba(255,255,255,.08)'), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'capitalize' }}>{profile.full_name?.split(' ')[0] || 'Commander'}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: profile.plan === 'premium' ? '#ffd700' : profile.plan === 'pro' ? '#00f2ff' : 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{profile.plan}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div className={`nav-item ${active ? 'active' : ''}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px 10px' : '10px 12px',
                  borderRadius: 10, cursor: 'pointer', position: 'relative',
                  background: active ? `${item.color}12` : 'transparent',
                  border: '1px solid ' + (active ? `${item.color}30` : 'transparent'),
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                  {active && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: 3, borderRadius: '0 3px 3px 0', background: item.color, boxShadow: `0 0 8px ${item.color}` }} />}
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? `${item.color}20` : 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: active ? item.color : 'rgba(255,255,255,.4)', flexShrink: 0, fontFamily: "'Orbitron',sans-serif", transition: 'all .2s', border: active ? `1px solid ${item.color}30` : '1px solid transparent' }}>
                    {item.icon}
                  </div>
                  {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? item.color : 'rgba(255,255,255,.55)', whiteSpace: 'nowrap', transition: 'all .2s' }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Settings + Signout */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '9px 10px' : '9px 12px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,.03)', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>ST</div>
              {!collapsed && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>Settings</span>}
            </div>
          </Link>
          <div className="nav-item" onClick={async () => { await sb.auth.signOut(); router.push('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '9px 10px' : '9px 12px', borderRadius: 10, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,82,82,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,82,82,.5)', fontWeight: 700, border: '1px solid rgba(255,82,82,.1)' }}>OUT</div>
            {!collapsed && <span style={{ fontSize: 13, color: 'rgba(255,82,82,.5)' }}>Sign Out</span>}
          </div>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="mobile-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 56, background: 'rgba(7,8,16,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: '#fff' }}>F</span>
          </div>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700 }}>FlowFund</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 20 }}>=</button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(0,0,0,.8)' }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: 'absolute', top: 56, right: 0, left: 0, background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,.08)', padding: 12 }} onClick={e => e.stopPropagation()}>
            {NAV.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: isActive(item) ? `${item.color}10` : 'transparent', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, color: isActive(item) ? item.color : 'rgba(255,255,255,.6)' }}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: sidebarW, flex: 1, minHeight: '100vh', padding: '32px 28px', maxWidth: `calc(100vw - ${sidebarW}px)`, transition: 'margin-left .25s ease' }} className="content-area">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
