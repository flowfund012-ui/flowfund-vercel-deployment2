'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const NAV=[
  {href:'/dashboard',label:'Dashboard',color:'#00f2ff',exact:true},
  {href:'/dashboard/mission',label:'Mission Tracker',color:'#10b981'},
  {href:'/dashboard/autopilot',label:'AutoPilot',color:'#a78bfa'},
  {href:'/dashboard/growth',label:'Growth Engine',color:'#2dd4bf'},
  {href:'/dashboard/debts',label:'Debt Planner',color:'#ef4444'},
  {href:'/dashboard/academy',label:'Academy',color:'#f59e0b'},
  {href:'/dashboard/vault',label:'Vault',color:'#00f0ff'},
  {href:'/dashboard/security',label:'Security',color:'#00ff9d'},
];
function LogoMark({size=32}:{size?:number}){
  const r=Math.round(size*0.22);
  return(
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
export default function DashboardLayout({children}:{children:React.ReactNode}){
  const router=useRouter();const pathname=usePathname();
  const [profile,setProfile]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [collapsed,setCollapsed]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){router.push('/login');return;}
      const{data:p}=await sb.from('profiles').select('full_name,plan,financial_score').eq('id',session.user.id).single();
      setProfile(p);setLoading(false);
    });
    const{data:{subscription}}=sb.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT')router.push('/login');});
    return()=>subscription.unsubscribe();
  },[]);
  if(loading)return(
    <div style={{minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}><LogoMark size={48}/><div style={{fontFamily:"'Orbitron',monospace",fontSize:10,color:'rgba(255,255,255,.3)',letterSpacing:'.2em',marginTop:14}}>LOADING</div></div>
    </div>
  );
  const isActive=(item:typeof NAV[0])=>item.exact?pathname===item.href:pathname.startsWith(item.href);
  const sw=collapsed?56:240;
  const score=profile?.financial_score??null;
  const sc=(s:number)=>s>=70?'#10b981':s>=40?'#f59e0b':'#ef4444';
  return(
    <div style={{minHeight:'100vh',background:'#070810',color:'#f0f6ff',fontFamily:"'Inter',system-ui,sans-serif",display:'flex'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:100px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .ni{transition:all .18s ease}.ni:hover{background:rgba(255,255,255,.04)!important}
        .ca{animation:fadeIn .28s ease}
        @media(max-width:768px){.sd{display:none!important}.mb{display:flex!important}main{margin-left:0!important;padding:64px 16px 32px!important}}
        @media(min-width:769px){.mb{display:none!important}}
      `}</style>
      <aside className="sd" style={{width:sw,minHeight:'100vh',flexShrink:0,background:'rgba(7,8,16,.98)',borderRight:'1px solid rgba(255,255,255,.05)',position:'fixed',top:0,left:0,bottom:0,display:'flex',flexDirection:'column',zIndex:40,transition:'width .2s ease',overflowY:'auto',overflowX:'hidden'}}>
        <div style={{padding:'16px 12px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',gap:10,justifyContent:collapsed?'center':'space-between'}}>
          {!collapsed?(
            <>
              <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                <LogoMark size={28}/>
                <div><div style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:900,color:'#fff',letterSpacing:'.04em'}}>FlowFund</div><div style={{fontSize:8,color:'rgba(255,255,255,.25)',letterSpacing:'.22em',marginTop:1}}>FINANCIAL OS</div></div>
              </div>
              <button onClick={()=>setCollapsed(true)} style={{background:'none',border:'none',color:'rgba(255,255,255,.2)',cursor:'pointer',padding:4,fontSize:13,flexShrink:0}}>‹</button>
            </>
          ):(
            <button onClick={()=>setCollapsed(false)} style={{background:'none',border:'none',cursor:'pointer',padding:0}}><LogoMark size={28}/></button>
          )}
        </div>
        {!collapsed&&profile&&(
          <div style={{padding:'8px 12px'}}>
            <div style={{padding:'7px 10px',borderRadius:8,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.055)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:score!==null?5:0}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{profile.full_name?.split(' ')[0]||'Commander'}</span>
                <span style={{fontSize:9,fontWeight:700,color:profile.plan==='premium'?'#ffd700':profile.plan==='pro'?'#00f2ff':'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.07em'}}>{profile.plan||'free'}</span>
              </div>
              {score!==null&&<div style={{display:'flex',alignItems:'center',gap:6}}><div style={{flex:1,background:'rgba(255,255,255,.07)',borderRadius:100,height:3}}><div style={{background:sc(score),borderRadius:100,height:3,width:score+'%',transition:'width .5s'}}/></div><span style={{fontSize:9,fontWeight:700,color:sc(score),fontFamily:"'Orbitron',monospace"}}>{score}</span></div>}
            </div>
          </div>
        )}
        <nav style={{flex:1,padding:'4px 10px',display:'flex',flexDirection:'column',gap:1}}>
          {NAV.map(item=>{
            const active=isActive(item);
            return(
              <Link key={item.href} href={item.href} style={{textDecoration:'none'}}>
                <div className="ni" style={{display:'flex',alignItems:'center',gap:11,padding:collapsed?'11px 0':'10px 12px',borderRadius:8,cursor:'pointer',position:'relative',background:active?`${item.color}0c`:'transparent',justifyContent:collapsed?'center':'flex-start'}}>
                  {active&&!collapsed&&<div style={{position:'absolute',left:0,top:'18%',bottom:'18%',width:2.5,borderRadius:'0 3px 3px 0',background:item.color}}/>}
                  <div style={{width:7,height:7,borderRadius:'50%',background:active?item.color:'rgba(255,255,255,.16)',flexShrink:0,transition:'background .18s',boxShadow:active?`0 0 6px ${item.color}80`:undefined}}/>
                  {!collapsed&&<span style={{fontSize:13,fontWeight:active?600:400,color:active?item.color:'rgba(255,255,255,.48)',whiteSpace:'nowrap'}}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
        <div style={{padding:'6px 10px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
          <Link href="/dashboard/settings" style={{textDecoration:'none'}}>
            <div className="ni" style={{display:'flex',alignItems:'center',gap:11,padding:collapsed?'11px 0':'10px 12px',borderRadius:8,cursor:'pointer',justifyContent:collapsed?'center':'flex-start',marginBottom:2}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:pathname==='/dashboard/settings'?'rgba(255,255,255,.6)':'rgba(255,255,255,.16)',flexShrink:0}}/>
              {!collapsed&&<span style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>Settings</span>}
            </div>
          </Link>
          <div className="ni" onClick={async()=>{await sb.auth.signOut();router.push('/login');}} style={{display:'flex',alignItems:'center',gap:11,padding:collapsed?'11px 0':'10px 12px',borderRadius:8,cursor:'pointer',justifyContent:collapsed?'center':'flex-start'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'rgba(239,68,68,.45)',flexShrink:0}}/>
            {!collapsed&&<span style={{fontSize:13,color:'rgba(239,68,68,.5)'}}>Sign Out</span>}
          </div>
        </div>
      </aside>
      <div className="mb" style={{position:'fixed',top:0,left:0,right:0,zIndex:50,height:56,background:'rgba(7,8,16,.98)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,.05)',alignItems:'center',padding:'0 16px',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><LogoMark size={26}/><span style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:900,color:'#fff'}}>FlowFund</span></div>
        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:7,color:'rgba(255,255,255,.65)',cursor:'pointer',fontSize:15,padding:'5px 10px'}}>{mobileOpen?'×':'≡'}</button>
      </div>
      {mobileOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:49,background:'rgba(0,0,0,.7)'}} onClick={()=>setMobileOpen(false)}>
          <div style={{position:'absolute',top:56,left:0,right:0,background:'#0a0e1a',borderBottom:'1px solid rgba(255,255,255,.06)',padding:10}} onClick={e=>e.stopPropagation()}>
            {NAV.map(item=>(
              <Link key={item.href} href={item.href} style={{textDecoration:'none'}} onClick={()=>setMobileOpen(false)}>
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:7,background:isActive(item)?`${item.color}0c`:'transparent',marginBottom:1}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:isActive(item)?item.color:'rgba(255,255,255,.16)',flexShrink:0}}/>
                  <span style={{fontSize:13,color:isActive(item)?item.color:'rgba(255,255,255,.55)'}}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <main style={{marginLeft:sw,flex:1,minHeight:'100vh',padding:'32px 28px',maxWidth:`calc(100vw - ${sw}px)`,transition:'margin-left .2s ease'}} className="ca">
        <div style={{maxWidth:1200,margin:'0 auto'}}>{children}</div>
      </main>
    </div>
  );
}
