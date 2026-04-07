'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const NAV=[
  {href:'/dashboard',label:'Dashboard',icon:'D',color:'#00f2ff',exact:true},
  {href:'/dashboard/mission',label:'Mission Tracker',icon:'T',color:'#10b981'},
  {href:'/dashboard/autopilot',label:'AutoPilot',icon:'A',color:'#a78bfa'},
  {href:'/dashboard/growth',label:'Growth Engine',icon:'G',color:'#2dd4bf'},
  {href:'/dashboard/academy',label:'Academy',icon:'E',color:'#f59e0b'},
  {href:'/dashboard/vault',label:'Vault',icon:'V',color:'#00f0ff'},
  {href:'/dashboard/security',label:'Security',icon:'S',color:'#00ff9d'},
];
function LogoMark({ size = 32 }: { size?: number }) {
  const r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <defs><linearGradient id="lbg" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="100%" stopColor="#7c00ff"/></linearGradient></defs>
      <rect x="0" y="0" width="64" height="64" rx={r} fill="#0d1225" stroke="rgba(26,107,255,0.4)" strokeWidth="1.5"/>
      <rect x="10" y="44" width="10" height="14" rx="2.5" fill="#1a6bff" opacity="0.7"/>
      <rect x="23" y="36" width="10" height="22" rx="2.5" fill="#7c00ff" opacity="0.85"/>
      <rect x="36" y="26" width="10" height="32" rx="2.5" fill="url(#lbg)"/>
      <polyline points="15,42 28,34 41,24" fill="none" stroke="#00d4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="41,24 52,19 48,28" fill="#00d4ff"/>
    </svg>
  );
}
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      const { data: p } = await sb.from('profiles').select('full_name,plan').eq('id', session.user.id).single();
      setProfile(p); setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });
    return () => subscription.unsubscribe();
  }, []);
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#070810', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <LogoMark size={56}/>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.2em', marginTop:16 }}>LOADING</div>
      </div>
    </div>
  );
  const isActive = (item: typeof NAV[0]) => item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const sidebarW = collapsed ? 64 : 240;
  return (
    <div style={{ minHeight:'100vh', background:'#070810', color:'#f0f6ff', fontFamily:"'Inter',system-ui,sans-serif", display:'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:100px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .nav-item{transition:all .18s ease}
        .nav-item:hover{background:rgba(255,255,255,.055)!important;transform:translateX(2px)}
        .content-area{animation:fadeIn .28s ease}
        @media(max-width:768px){.sidebar-desk{display:none!important}.mob-bar{display:flex!important}}
        @media(min-width:769px){.mob-bar{display:none!important}}
      `}</style>
      {/* SIDEBAR */}
      <aside className="sidebar-desk" style={{ width:sidebarW, minHeight:'100vh', flexShrink:0, background:'rgba(7,8,16,.97)', borderRight:'1px solid rgba(255,255,255,.055)', position:'fixed', top:0, left:0, bottom:0, display:'flex', flexDirection:'column', zIndex:40, transition:'width .22s ease', overflowY:'auto', overflowX:'hidden' }}>
        {/* Logo area */}
        <div style={{ padding:'18px 14px 14px', borderBottom:'1px solid rgba(255,255,255,.055)', display:'flex', alignItems:'center', gap:10, justifyContent:collapsed?'center':'space-between' }}>
          {!collapsed ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <LogoMark size={32}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:900, color:'#fff', letterSpacing:'.04em', lineHeight:1 }}>FlowFund</div>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,.28)', letterSpacing:'.25em', marginTop:2 }}>FINANCIAL OS</div>
                </div>
              </div>
              <button onClick={()=>setCollapsed(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', fontSize:12, padding:4, borderRadius:4, flexShrink:0 }}>{'<'}</button>
            </>
          ) : (
            <button onClick={()=>setCollapsed(false)} style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
              <LogoMark size={32}/>
            </button>
          )}
        </div>
        {/* Plan badge */}
        {!collapsed && profile && (
          <div style={{ padding:'8px 12px' }}>
            <div style={{ padding:'5px 10px', borderRadius:8, background:profile.plan==='premium'?'rgba(255,215,0,.07)':profile.plan==='pro'?'rgba(0,242,255,.05)':'rgba(255,255,255,.04)', border:'1px solid '+(profile.plan==='premium'?'rgba(255,215,0,.18)':profile.plan==='pro'?'rgba(0,242,255,.14)':'rgba(255,255,255,.07)'), display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,.45)' }}>{profile.full_name?.split(' ')[0]||'Commander'}</span>
              <span style={{ fontSize:10, fontWeight:700, color:profile.plan==='premium'?'#ffd700':profile.plan==='pro'?'#00f2ff':'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.08em' }}>{profile.plan||'free'}</span>
            </div>
          </div>
        )}
        {/* Nav */}
        <nav style={{ flex:1, padding:'6px 10px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration:'none' }}>
                <div className={`nav-item${active?' active':''}`} style={{ display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 10px':'10px 12px', borderRadius:10, cursor:'pointer', position:'relative', background:active?`${item.color}10`:'transparent', border:'1px solid '+(active?`${item.color}28`:'transparent'), justifyContent:collapsed?'center':'flex-start' }}>
                  {active && <div style={{ position:'absolute', left:0, top:'22%', bottom:'22%', width:3, borderRadius:'0 3px 3px 0', background:item.color, boxShadow:`0 0 8px ${item.color}80` }}/>}
                  <div style={{ width:28, height:28, borderRadius:8, background:active?`${item.color}18`:'rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:active?item.color:'rgba(255,255,255,.38)', flexShrink:0, fontFamily:"'Orbitron',monospace", transition:'all .18s', border:active?`1px solid ${item.color}28`:'1px solid transparent' }}>
                    {item.icon}
                  </div>
                  {!collapsed && <span style={{ fontSize:13, fontWeight:active?600:400, color:active?item.color:'rgba(255,255,255,.52)', whiteSpace:'nowrap', transition:'all .18s' }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
        {/* Bottom */}
        <div style={{ padding:'8px 10px', borderTop:'1px solid rgba(255,255,255,.055)' }}>
          <Link href="/dashboard/settings" style={{ textDecoration:'none' }}>
            <div className="nav-item" style={{ display:'flex', alignItems:'center', gap:10, padding:collapsed?'9px 10px':'9px 12px', borderRadius:10, cursor:'pointer', background:'rgba(255,255,255,.025)', justifyContent:collapsed?'center':'flex-start', marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(255,255,255,.38)', fontWeight:700, fontFamily:"'Orbitron',monospace" }}>ST</div>
              {!collapsed && <span style={{ fontSize:13, color:'rgba(255,255,255,.38)' }}>Settings</span>}
            </div>
          </Link>
          <div className="nav-item" onClick={async()=>{await sb.auth.signOut();router.push('/login');}} style={{ display:'flex', alignItems:'center', gap:10, padding:collapsed?'9px 10px':'9px 12px', borderRadius:10, cursor:'pointer', justifyContent:collapsed?'center':'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'rgba(239,68,68,.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'rgba(239,68,68,.55)', fontWeight:700, fontFamily:"'Orbitron',monospace", border:'1px solid rgba(239,68,68,.12)' }}>OUT</div>
            {!collapsed && <span style={{ fontSize:13, color:'rgba(239,68,68,.5)' }}>Sign Out</span>}
          </div>
        </div>
      </aside>
      {/* MOBILE TOPBAR */}
      <div className="mob-bar" style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, height:56, background:'rgba(7,8,16,.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,.055)', alignItems:'center', padding:'0 16px', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <LogoMark size={28}/>
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:900, color:'#fff', letterSpacing:'.04em' }}>FlowFund</span>
        </div>
        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'rgba(255,255,255,.7)', cursor:'pointer', fontSize:16, padding:'6px 12px' }}>
          {mobileOpen?'X':'='}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:49, background:'rgba(0,0,0,.75)' }} onClick={()=>setMobileOpen(false)}>
          <div style={{ position:'absolute', top:56, right:0, left:0, background:'#0d1117', borderBottom:'1px solid rgba(255,255,255,.07)', padding:12 }} onClick={e=>e.stopPropagation()}>
            {NAV.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration:'none' }} onClick={()=>setMobileOpen(false)}>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:8, background:isActive(item)?`${item.color}10`:'transparent', marginBottom:2 }}>
                  <span style={{ fontSize:13, color:isActive(item)?item.color:'rgba(255,255,255,.6)' }}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* CONTENT */}
      <main style={{ marginLeft:sidebarW, flex:1, minHeight:'100vh', padding:'32px 28px', maxWidth:`calc(100vw - ${sidebarW}px)`, transition:'margin-left .22s ease' }} className="content-area">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
