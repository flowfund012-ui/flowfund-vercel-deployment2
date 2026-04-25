'use client';
export const dynamic='force-dynamic';
import{useState,useEffect,Suspense}from'react';
import{createClient}from'@supabase/supabase-js';
import Link from'next/link';
import{usePathname}from'next/navigation';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
function Logo({full=true}:{full?:boolean}){return(<div style={{display:'flex',alignItems:'center',gap:full?9:0}}><svg width="28" height="28" viewBox="0 0 64 64"><defs><linearGradient id="dl1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient><linearGradient id="dl2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient><linearGradient id="dl3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="#08091e"/><rect width="64" height="64" rx="18" fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/><path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#dl1)" opacity="0.78"/><path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#dl2)" opacity="0.88"/><path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#dl3)" opacity="0.72"/><path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/><line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/><polygon points="56,-2 60,6 52,2" fill="#00d4ff"/></svg>{full&&<span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:14,color:'#fff',letterSpacing:'.04em'}}>FlowFund</span>}</div>);}
const NAV=[
  {group:'',items:[
    {href:'/dashboard',label:'Dashboard',c:'#60a5fa'},
    {href:'/dashboard/mission',label:'Transactions',c:'#34d399'},
    {href:'/dashboard/autopilot',label:'Goals',c:'#f59e0b'},
    {href:'/dashboard/growth',label:'Revenue',c:'#a78bfa'},
    {href:'/dashboard/debts',label:'Debt Payoff',c:'#f87171'},
  ]},
  {group:'Insights',items:[
    {href:'/dashboard/academy',label:'Academy',c:'#38bdf8'},
    {href:'/dashboard/vault',label:'Toolkit',c:'#fb923c'},
    {href:'/dashboard/tax',label:'Tax Radar',c:'#4ade80'},
    {href:'/dashboard/banksync',label:'Bank Sync',c:'#c084fc'},
  ]},
  {group:'Account',items:[
    {href:'/dashboard/security',label:'Security',c:'#94a3b8'},
    {href:'/dashboard/settings',label:'Settings',c:'#64748b'},
  ]},
];
function Sidebar(){
  const path=usePathname();
  const[col,setCol]=useState(false);
  const[user,setUser]=useState<{name:string,plan:string}|null>(null);
  useEffect(()=>{sb.auth.getUser().then(async({data})=>{if(!data.user)return;const{data:p}=await sb.from('profiles').select('full_name,plan').eq('id',data.user.id).single();setUser({name:p?.full_name?.split(' ')[0]||data.user.email?.split('@')[0]||'User',plan:p?.plan||'free'});});},[]);
  const out=async()=>{await sb.auth.signOut();window.location.href='/';};
  const allItems=NAV.flatMap(g=>g.items);
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'#070810',borderRight:'1px solid rgba(255,255,255,.06)',width:col?56:210,transition:'width .2s',overflow:'hidden'}}>
      <div style={{padding:'14px 10px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:56}}>
        <Logo full={!col}/>
        <button onClick={()=>setCol(c=>!c)} style={{background:'none',border:'none',color:'rgba(255,255,255,.25)',cursor:'pointer',fontSize:16,padding:'2px 4px',flexShrink:0,lineHeight:1}}>{col?'›':'‹'}</button>
      </div>
      <nav style={{flex:1,padding:'8px 5px',overflowY:'auto'}}>
        {col?(
          allItems.map(n=>{const act=path===n.href||(n.href!=='/dashboard'&&path?.startsWith(n.href));return(<Link key={n.href} href={n.href} title={n.label} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'9px',borderRadius:8,marginBottom:2,background:act?'rgba(255,255,255,.08)':'transparent',textDecoration:'none',borderLeft:act?`2.5px solid ${n.c}`:'2.5px solid transparent',transition:'all .15s'}}><span style={{width:6,height:6,borderRadius:'50%',background:n.c,display:'block'}}/></Link>);})
        ):(
          NAV.map(g=>(
            <div key={g.group}>
              {g.group&&<div style={{fontSize:9,color:'rgba(255,255,255,.22)',letterSpacing:'.1em',textTransform:'uppercase',padding:'10px 10px 4px',marginTop:4}}>{g.group}</div>}
              {g.items.map(n=>{const act=path===n.href||(n.href!=='/dashboard'&&path?.startsWith(n.href));return(<Link key={n.href} href={n.href} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 10px',borderRadius:9,marginBottom:1,background:act?'rgba(255,255,255,.07)':'transparent',color:act?'#fff':'rgba(255,255,255,.45)',textDecoration:'none',borderLeft:act?`2.5px solid ${n.c}`:'2.5px solid transparent',transition:'all .15s'}}><span style={{width:5,height:5,borderRadius:'50%',background:act?n.c:'rgba(255,255,255,.2)',display:'block',flexShrink:0}}/><span style={{fontSize:13,fontWeight:act?600:400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{n.label}</span></Link>);})}
            </div>
          ))
        )}
      </nav>
      <div style={{padding:'8px 5px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        {user&&!col&&<div style={{padding:'9px 10px',borderRadius:9,background:'rgba(255,255,255,.03)',marginBottom:6}}><div style={{fontSize:11,fontWeight:600,color:'#fff',marginBottom:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div><div style={{fontSize:9,color:'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.06em'}}>{user.plan} plan</div></div>}
        <button onClick={out} title={col?'Sign Out':''} style={{width:'100%',padding:col?'9px':'8px 10px',borderRadius:9,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.14)',color:'#f87171',fontSize:11,cursor:'pointer',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',justifyContent:col?'center':'flex-start',gap:col?0:7}}><span style={{flexShrink:0,fontSize:13}}>↩</span>{!col&&<span>Sign Out</span>}</button>
      </div>
    </div>
  );
}
export default function DashboardLayout({children}:{children:React.ReactNode}){
  const[mob,setMob]=useState(false);
  const[open,setOpen]=useState(false);
  useEffect(()=>{const c=()=>setMob(window.innerWidth<768);c();window.addEventListener('resize',c);return()=>window.removeEventListener('resize',c);},[]);
  return(
    <div style={{display:'flex',minHeight:'100vh',background:'#070810',fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a6bff33;border-radius:2px}`}</style>
      {!mob&&<div style={{flexShrink:0,position:'sticky',top:0,height:'100vh'}}><Suspense fallback={<div style={{width:210,background:'#070810',height:'100%'}}/>}><Sidebar/></Suspense></div>}
      {mob&&open&&<div style={{position:'fixed',inset:0,zIndex:200,display:'flex'}}><div style={{width:210,background:'#070810',height:'100%'}}><Suspense fallback={null}><Sidebar/></Suspense></div><div style={{flex:1,background:'rgba(0,0,0,.5)'}} onClick={()=>setOpen(false)}/></div>}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {mob&&<div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',gap:10,background:'#070810',position:'sticky',top:0,zIndex:100}}><button onClick={()=>setOpen(true)} style={{background:'none',border:'none',color:'#fff',fontSize:20,cursor:'pointer',padding:2}}>☰</button><Logo full/></div>}
        <main style={{flex:1,padding:'22px 18px',overflowY:'auto'}}>{children}</main>
      </div>
    </div>
  );
}
