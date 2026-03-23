'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUIStore } from '@/store/useUIStore';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { Profile } from '@/types/database';
import type { User } from '@supabase/supabase-js';

const MODULE_TITLES: Record<string, string> = {
  '/dashboard':          'Dashboard',
  '/dashboard/mission':  'Mission Tracker',
  '/dashboard/autopilot':'AutoPilot Engine',
  '/dashboard/growth':   'Growth Engine',
  '/dashboard/academy':  'Personal Academy',
  '/dashboard/vault':    'Vault Access',
  '/dashboard/security': 'Security Hub',
  '/dashboard/settings': 'Settings & Billing',
};

const NAV = [
  { section: 'Command', items: [
    { href: '/dashboard',           icon: 'fa-th-large',      label: 'Dashboard'       },
    { href: '/dashboard/mission',   icon: 'fa-chart-line',    label: 'Mission Tracker' },
    { href: '/dashboard/autopilot', icon: 'fa-robot',         label: 'AutoPilot'       },
  ]},
  { section: 'Growth', items: [
    { href: '/dashboard/growth',    icon: 'fa-bolt',          label: 'Growth Engine',  badge: 'pro' },
    { href: '/dashboard/academy',   icon: 'fa-graduation-cap',label: 'Personal Academy'},
  ]},
  { section: 'Secure', items: [
    { href: '/dashboard/vault',     icon: 'fa-lock',          label: 'Vault Access'  },
    { href: '/dashboard/security',  icon: 'fa-shield-alt',    label: 'Security Hub'  },
  ]},
  { section: 'Account', items: [
    { href: '/dashboard/settings',  icon: 'fa-cog',           label: 'Settings' },
  ]},
];

const PLAN_BADGE: Record<string, string> = { free: 'Free Plan', pro: 'Pro Plan', premium: 'Premium' };

function SidebarNav({ plan }: { plan: string }) {
  let pathname = '/dashboard';
  try { pathname = usePathname() || '/dashboard'; } catch(e) {}
  return (
    <nav className="sb-nav">
      {NAV.map((group) => (
        <div key={group.section}>
          <div className="sb-section">{group.section}</div>
          {group.items.map((item) => {
            const locked = (item as any).badge === 'pro' && plan === 'free';
            const isActive = pathname === item.href;
            return (
              <Link key={item.href}
                href={locked ? '/dashboard/settings' : item.href}
                className={'sb-item' + (isActive ? ' active' : '')}
                style={locked ? { opacity: .65 } : undefined}>
                <i className={'fas ' + item.icon} />
                {item.label}
                {locked && <span style={{ marginLeft: 'auto', fontSize: 9, color: '#ffd700', background: 'rgba(255,215,0,.1)', padding: '2px 5px', borderRadius: 3 }}>PRO</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function TopbarTitle() {
  let pathname = '/dashboard';
  try { pathname = usePathname() || '/dashboard'; } catch(e) {}
  return <div className="app-topbar-title">{MODULE_TITLES[pathname] || 'Dashboard'}</div>;
}

interface Props { user: User; profile: Profile | null; children: React.ReactNode; }

export default function DashboardShell({ user, profile, children }: Props) {
  const setProfile = useUIStore((s) => s.setProfile);
  const showToast  = useUIStore((s) => s.showToast);

  useEffect(() => { if (profile) setProfile(profile); }, [profile, setProfile]);

  const name = (profile && profile.full_name) || (user.email ? user.email.split('@')[0] : 'Commander');
  const plan = (profile && profile.plan) || 'free';

  const handleLogout = async () => {
    try {
      const mod = await import('@/lib/auth');
      await mod.auth.signOut();
      window.location.href = '/';
    } catch {
      try { showToast('Logout failed', 'error'); } catch(e) {}
    }
  };

  return (
    <>
      <aside className="app-sidebar">
        <div className="sb-logo">
          <div className="sb-logo-icon"><i className="fas fa-rocket" style={{ color: '#fff', fontSize: 14 }} /></div>
          <span>FlowFund OS</span>
        </div>
        <Suspense fallback={null}>
          <SidebarNav plan={plan} />
        </Suspense>
        <div className="sb-user">
          <div className="sb-user-card">
            <div className="sb-avatar">{name.charAt(0).toUpperCase()}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="sb-uname">{name}</div>
              <div className="sb-urole">{PLAN_BADGE[plan] || 'Free Plan'}</div>
            </div>
            <button onClick={handleLogout} title="Logout"
              style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
              onMouseOver={e => (e.currentTarget.style.color = '#ff8080')}
              onMouseOut={e  => (e.currentTarget.style.color = 'rgba(255,255,255,.2)')}>
              &#x2712;
            </button>
          </div>
        </div>
      </aside>
      <div className="app-main" style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
        <div className="app-topbar">
          <Suspense fallback={<div className="app-topbar-title">Dashboard</div>}>
            <TopbarTitle />
          </Suspense>
          <div className="app-topbar-right">
            <span className="badge badge-green" style={{ fontSize: 9 }}>LIVE</span>
            {plan === 'free' && (
              <Link href="/dashboard/settings" className="btn btn-sm" style={{ fontSize: 10, background: 'rgba(255,215,0,.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,.2)', borderRadius: 6, padding: '4px 10px', textDecoration: 'none' }}>
                Upgrade
              </Link>
            )}
          </div>
        </div>
        <div style={{ padding: '28px', maxWidth: 1200, margin: '0 auto' }}>
          <ErrorBoundary module="Dashboard">{children}</ErrorBoundary>
        </div>
      </div>
    </>
  );
}
