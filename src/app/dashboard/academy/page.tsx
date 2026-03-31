'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const COURSES=[{id:1,title:'Financial Basics 101',desc:'Master budgeting, saving and spending habits',duration:'45 min',level:'Beginner',icon:'📊',color:'#00f2ff',plan:'free'},{id:2,title:'Investment Fundamentals',desc:'Stocks, ETFs, crypto and portfolio building',duration:'60 min',level:'Beginner',icon:'📈',color:'#10b981',plan:'free'},{id:3,title:'Tax Optimization',desc:'Legal strategies to keep more of your money',duration:'55 min',level:'Intermediate',icon:'🧾',color:'#f59e0b',plan:'free'},{id:4,title:'Business Finance',desc:'Cash flow, P&L, and scaling your business',duration:'70 min',level:'Advanced',icon:'💼',color:'#a78bfa',plan:'pro'},{id:5,title:'Passive Income Mastery',desc:'Build income streams that work while you sleep',duration:'50 min',level:'Intermediate',icon:'💰',color:'#ffd700',plan:'pro'},{id:6,title:'Wealth Mindset',desc:'Psychology of money and long-term thinking',duration:'40 min',level:'All Levels',icon:'🧠',color:'#00ff9d',plan:'premium'}];
export default function AcademyPage(){
  const[progress,setProgress]=useState<Record<number,number>>({});
  const[plan,setPlan]=useState('free');
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session)return;
      const[{data:p},{data:pr}]=await Promise.all([
        sb.from('profiles').select('plan').eq('id',session.user.id).single(),
        sb.from('course_progress').select('course_id,progress').eq('user_id',session.user.id)
      ]);
      setPlan(p?.plan??'free');
      const map:Record<number,number>={};
      (pr??[]).forEach((r:any)=>{map[r.course_id]=r.progress;});
      setProgress(map);
    });
  },[]);
  const planRank={free:0,pro:1,premium:2};
  const canAccess=(p:string)=>(planRank[plan as keyof typeof planRank]??0)>=(planRank[p as keyof typeof planRank]??0);
  const startCourse=async(id:number)=>{
    const{data:{session}}=await sb.auth.getSession();
    if(!session)return;
    const cur=progress[id]??0;
    const next=Math.min(100,cur+25);
    await sb.from('course_progress').upsert({user_id:session.user.id,course_id:id,progress:next},{onConflict:'user_id,course_id'});
    setProgress(p=>({...p,[id]:next}));
  };
  const completed=Object.values(progress).filter(v=>v>=100).length;
  const inProgress=Object.values(progress).filter(v=>v>0&&v<100).length;
  return(
    <div style={{padding:'0 0 40px'}}>
      <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#fff',marginBottom:5}}>Personal Academy</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:20}}>Level up your financial knowledge. One course at a time.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[{l:'Courses',v:String(COURSES.length)},{l:'Completed',v:String(completed)},{l:'In Progress',v:String(inProgress)},{l:'Your Plan',v:plan.charAt(0).toUpperCase()+plan.slice(1)}].map(s=>(
          <div key={s.l} style={{background:'rgba(0,242,255,.05)',border:'1px solid rgba(0,242,255,.15)',borderRadius:12,padding:'14px 16px'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{s.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:'#00f2ff'}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {COURSES.map(c=>{
          const pct=progress[c.id]??0;
          const locked=!canAccess(c.plan);
          return(
            <div key={c.id} style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,opacity:locked?.6:1}}>
              <div style={{fontSize:32,marginBottom:10}}>{c.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:'#e2e8f0',marginBottom:4}}>{c.title}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:10}}>{c.desc}</div>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                <span style={{padding:'2px 8px',borderRadius:100,fontSize:10,background:'rgba(255,255,255,.07)',color:'rgba(255,255,255,.5)'}}>{c.level}</span>
                <span style={{padding:'2px 8px',borderRadius:100,fontSize:10,background:'rgba(255,255,255,.07)',color:'rgba(255,255,255,.5)'}}>{c.duration}</span>
              </div>
              {pct>0&&<div style={{background:'rgba(255,255,255,.08)',borderRadius:4,height:4,marginBottom:10}}><div style={{background:c.color,borderRadius:4,height:4,width:pct+'%'}}/></div>}
              {locked
                ?<a href="/dashboard/settings" style={{display:'block',textAlign:'center',padding:'8px 16px',borderRadius:8,background:'rgba(255,215,0,.1)',color:'#ffd700',fontSize:11,textDecoration:'none'}}>🔒 Upgrade to unlock</a>
                :<button onClick={()=>startCourse(c.id)} style={{width:'100%',padding:'8px 16px',borderRadius:8,background:pct>=100?'rgba(16,185,129,.15)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:pct>=100?'#10b981':'#fff',border:pct>=100?'1px solid rgba(16,185,129,.3)':'none',cursor:'pointer',fontSize:11}}>{pct>=100?'✓ Completed':pct>0?'Continue (+25%)':'Start Course'}</button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
