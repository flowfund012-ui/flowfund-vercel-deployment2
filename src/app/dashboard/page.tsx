'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const MODULES = [
  {href:'/dashboard/mission',icon:'fa-chart-line',label:'Mission Tracker',desc:'Track income & expenses',color:'#00f2ff'},
  {href:'/dashboard/autopilot',icon:'fa-robot',label:'AutoPilot Engine',desc:'Automate savings & goals',color:'#a78bfa'},
  {href:'/dashboard/growth',icon:'fa-bolt',label:'Growth Engine',desc:'Business revenue tracking',color:'#2dd4bf'},
  {href:'/dashboard/academy',icon:'fa-graduation-cap',label:'Personal Academy',desc:'Learn financial mastery',color:'#f59e0b'},
  {href:'/dashboard/vault',icon:'fa-lock',label:'Vault Access',desc:'Premium templates & tools',color:'#00f0ff'},
  {href:'/dashboard/security',icon:'fa-shield-alt',label:'Security Hub',desc:'Protect your data',color:'#00ff9d'},
];
export default function DashboardHomePage() {
  const [stats,setStats] = useState({inc:0,exp:0,goals:0,txn:0});
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session) return;
      const uid = session.user.id;
      const [txRes,goalRes] = await Promise.all([
        sb.from('transactions').select('type,amount').eq('user_id',uid),
        sb.from('savings_goals').select('id').eq('user_id',uid),
      ]);
      const txns = txRes.data??[];
      const inc = txns.filter((t:any)=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
      const exp = txns.filter((t:any)=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
      setStats({inc,exp,goals:(goalRes.data??[]).length,txn:txns.length});
    });
  },[]);
  const fm=(n:number)=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const net=stats.inc-stats.exp;
  const sr=stats.inc>0?Math.round(((stats.inc-stats.exp)/stats.inc)*100):0;
  return (
    <div style={{padding:'0 0 40px'}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:700,color:'#fff',textShadow:'0 0 8px rgba(0,242,255,.5)',marginBottom:6}}>Command Center</h1>
        <p style={{color:'rgba(255,255,255,.4)',fontSize:13}}>AI-enhanced financial intelligence. Battle-tested.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:28}}>
        {[{l:'Total Income',v:fm(stats.inc),c:'#00f2ff',bg:'rgba(0,242,255,.06)'},{l:'Total Expenses',v:fm(stats.exp),c:'#ff5252',bg:'rgba(255,82,82,.06)'},{l:'Net Cash Flow',v:fm(net),c:net>=0?'#10b981':'#ff5252',bg:net>=0?'rgba(16,185,129,.06)':'rgba(255,82,82,.06)'},{l:'Savings Rate',v:sr+'%',c:'#a78bfa',bg:'rgba(124,58,237,.06)'}].map(s=>(
          <div key={s.l} style={{background:s.bg,border:'1px solid '+s.c.replace(')',', .2)').replace('rgb','rgba'),borderRadius:12,padding:'16px 18px'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.l}</div>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:600,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#00f2ff',marginBottom:14,letterSpacing:'.04em'}}>Control Modules</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {MODULES.map(m=>(
          <Link key={m.href} href={m.href} style={{textDecoration:'none'}}>
            <div className="dash-glass" style={{padding:22,cursor:'pointer',transition:'all .2s',borderColor:'rgba(255,255,255,.08)'}} onMouseEnter={e=>(e.currentTarget.style.borderColor=m.color+'44')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,.08)')}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{width:44,height:44,borderRadius:11,background:m.color+'12',border:'1px solid '+m.color+'30',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <i className={'fas '+m.icon} style={{color:m.color,fontSize:18}} />
                </div>
                <span style={{fontSize:9,fontFamily:"'Orbitron',sans-serif",color:m.color,letterSpacing:'.08em'}}>ACTIVE</span>
              </div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:600,color:'#e2e8f0',marginBottom:4}}>{m.label}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.32)'}}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}