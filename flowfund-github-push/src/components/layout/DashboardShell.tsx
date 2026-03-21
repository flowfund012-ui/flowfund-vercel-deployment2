'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/useUIStore';
import { analytics } from '@/lib/analytics';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

const MODULE_BG: Record<string, string> = {
  '/dashboard':           'radial-gradient(ellipse at 50% 0%,#0b0e17 0%,#000 100%)',
  '/dashboard/mission':   '#111111',
  '/dashboard/autopilot': '#020617',
  '/dashboard/growth':    '#020617',
  '/dashboard/academy':   '#0f172a',
  '/dashboard/vault':     '#020617',
  '/dashboard/security':  '#050a17',
  '/dashboard/settings':  '#0b0e17',
};

const MODULE_TITLES: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/dashboard/mission':   'Mission Tracker',
  '/dashboard/autopilot': 'AutoPilot Engine',
  '/dashboard/growth':    'Growth Engine',
  '/dashboard/academy':   'Personal Academy',
  '/dashboard/vault':     'Vault Access',
  '/dashboard/security':  'Security Hub',
  '/dashboard/settings':  'Settings & Billing',
};

const NAV = [
  { section: 'Command', items: [
    { href: '/dashboard',           icon: 'fa-th-large',      label: 'Dashboard'       },
    { href: '/dashboard/mission',   icon: 'fa-chart-line',    label: 'Mission Tracker' },
    { href: '/dashboard/autopilot', icon: 'fa-robot',         label: 'AutoPilot'       },
  ]},
  { section: 'Growth', items: [
    { href: '/dashboard/growth',  icon: 'fa-bolt',           label: 'Growth Engine',   badge: 'pro'  },
    { href: '/dashboard/academy', icon: 'fa-graduation-cap', label: 'Personal Academy'              },
  ]},
  { section: 'Secure', items: [
    { href: '/dashboard/vault',    icon: 'fa-lock',       label: 'Vault Access'  },
    { href: '/dashboard/security', icon: 'fa-shield-alt', label: 'Security Hub'  },
  ]},
  { section: 'Account', items: [
    { href: '/dashboard/settings', icon: 'fa-cog', label: 'Settings' },
  ]},
];

const PLAN_BADGE: Record<string, string> = { free: '🆓 Free', pro: '⚡ Pro', premium: '👑 Premium' };

interface Props { user: User; profile: Profile | null; children: React.ReactNode; }

export default function DashboardShell({ user, profile, children }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { setProfile, showToast } = useUIStore();

  useEffect(() => { if (profile) setProfile(profile); }, [profile, setProfile]);
  useEffect(() => { analytics.pageView(pathname); }, [pathname]);

  const bg    = MODULE_BG[pathname]    ?? MODULE_BG['/dashboard'];
  const title = MODULE_TITLES[pathname] ?? 'Dashboard';
  const name  = profile?.full_name ?? user.email?.split('@')[0] ?? 'Commander';
  const plan  = profile?.plan ?? 'free';

  const handleLogout = async () => {
    try { await auth.signOut(); router.push('/'); router.refresh(); }
    catch { showToast('Logout failed', 'error'); }
  };

  return (
    <>
      <aside className="app-sidebar">
        <div className="sb-logo">
          <div className="sb-logo-icon"><i className="fas fa-rocket" style={{ color: '#fff', fontSize: 14 }} /></div>
          <span>FlowFund OS</span>
        </div>
        <nav className="sb-nav">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="sb-section">{group.section}</div>
              {group.items.map((item) => {
                const locked = (item as { badge?: string }).badge === 'pro' && plan === 'free';
                return (
                  <Link key={item.href} href={locked ? '/dashboard/settings' : item.href}
                    className={`sb-item ${pathname === item.href ? 'active' : ''}`}
                    style={locked ? { opacity: .65 } : undefined}>
                    <i className={`fas ${item.icon}`} />
                    {item.label}
                    {locked && <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: "'Orbitron',sans-serif", color: '#ffd700', background: 'rgba(255,215,0,.1)', padding: '2px 5px', borderRadius: 3 }}>PRO</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sb-user">
          <div className="sb-user-card">
            <div className="sb-avatar">{name.charAt(0).toUpperCase()}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="sb-uname" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
              <div className="sb-urole">{PLAN_BADGE[plan] ?? '🆓 Free'}</div>
            </div>
            <button onClick={handleLogout} title="Logout" aria-label="Logout"
              style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color .2s', padding: 4, flexShrink: 0 }}
              onMouseOver={e => (e.currentTarget.style.color = '#ff8080')}
              onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,255,255,.2)')}>↩</button>
          </div>
        </div>
      </aside>

      <div className="app-main" style={{ marginLeft: 220, flex: 1, minHeight: '100vh', background: bg, transition: 'background .3s' }}>
        <div className="app-topbar">
          <div className="app-topbar-title">{title}</div>
          <div className="app-topbar-right">
            <span className="badge badge-green" style={{ fontSize: 9 }}>● LIVE</span>
            {plan === 'free' && (
              <Link href="/dashboard/settings" className="btn btn-gold btn-sm" style={{ fontSize: 10 }}>
                <i className="fas fa-crown" /> Upgrade
              </Link>
            )}
            {plan === 'pro' && (
              <Link href="/dashboard/settings" style={{ padding: '5px 11px', borderRadius: 7, fontSize: 10, background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.2)', color: '#ffd700', fontFamily: "'Orbitron',sans-serif", textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <i className="fas fa-crown" /> Go Premium
              </Link>
            )}
          </div>
        </div>
        <div style={{ padding: '28px', maxWidth: 1200, margin: '0 auto' }}>
          <ErrorBoundary module={title}>{children}</ErrorBoundary>
        </div>
      </div>
    </>
  );
}
