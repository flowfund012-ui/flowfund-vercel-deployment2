'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f = (n:number) => '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fp = (n:number) => (n>=0?'+':'')+n.toFixed(1)+'%';
const MODULES=[
  {href:'/dashboard/mission',label:'Mission Tracker',desc:'Income & expenses',color:'#00f2ff',icon:'T'},
  {href:'/dashboard/autopilot',label:'AutoPilot',desc:'Savings automation',color:'#a78bfa',icon:'A'},
  {href:'/dashboard/growth',label:'Growth Engine',desc:'Business revenue',color:'#2dd4bf',icon:'G'},
  {href:'/dashboard/academy',label:'Academy',desc:'Financial education',color:'#f59e0b',icon:'E'},
  {href:'/dashboard/vault',label:'Vault',desc:'Premium resources',color:'#00f0ff',icon:'V'},
  {href:'/dashboard/security',label:'Security',desc:'Data protection',color:'#00ff9d',icon:'S'},
];
export default function DashboardPage() {
  const [loading,setLoading]=useState(true);
  const [profile,setProfile]=useState<any>(null);
  const [txns,setTxns]=useState<any[]>([]);
  const [goals,setGoals]=useState<any[]>([]);
  const [budgets,setBudgets]=useState<any[]>([]);
  const [showAdd,setShowAdd]=useState(false);
  const [txDesc,setTxDesc]=useState('');
  const [txAmt,setTxAmt]=useState('');
  const [txCat,setTxCat]=useState('Salary');
  const [txType,setTxType]=useState<'income'|'expense'>('income');
  const [txDate,setTxDate]=useState(new Date().toISOString().split('T')[0]);
  const [txSaving,setTxSaving]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session)return;
      const uid=session.user.id;
      const [{data:p},{data:t},{data:g},{data:b}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',uid).single(),
        sb.from('transactions').select('*').eq('user_id',uid).order('date',{ascending:false}).limit(200),
        sb.from('savings_goals').select('*').eq('user_id',uid).eq('completed',false),
        sb.from('budgets').select('*').eq('user_id',uid).eq('month',new Date().getMonth()+1).eq('year',new Date().getFullYear()),
      ]);
      setProfile(p);setTxns(t??[]);setGoals(g??[]);setBudgets(b??[]);setLoading(false);
    });
  },[]);
  const now=new Date();
  const tm=txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const lm=txns.filter(t=>{const d=new Date(t.date);const l=new Date(now.getFullYear(),now.getMonth()-1,1);return d.getMonth()===l.getMonth()&&d.getFullYear()===l.getFullYear();});
  const income=tm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const expenses=tm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const net=income-expenses;
  const sr=income>0?Math.round((net/income)*100):0;
  const li=lm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const le=lm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const ic=li>0?((income-li)/li)*100:0;
  const ec=le>0?((expenses-le)/le)*100:0;
  const cs:Record<string,number>={};
  tm.filter(t=>t.type==='expense').forEach((t:any)=>{cs[t.category]=(cs[t.category]||0)+Number(t.amount);});
  const top=Object.entries(cs).sort((a,b)=>b[1]-a[1])[0];
  const addTx=async()=>{
    if(!txDesc.trim()||!txAmt)return; setTxSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setTxSaving(false);return;}
    const{data}=await sb.from('transactions').insert({user_id:session.user.id,type:txType,description:txDesc.trim(),amount:parseFloat(txAmt),category:txCat,date:txDate}).select().single();
    if(data)setTxns(p=>[data,...p]);
    setShowAdd(false);setTxDesc('');setTxAmt('');setTxSaving(false);
  };
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif",transition:'border-color .2s'};
  if(loading)return <div style={{padding:60,textAlign:'center',color:'rgba(255,255,255,.4)',fontFamily:"'Orbitron',monospace",letterSpacing:'.1em',fontSize:12}}>LOADING COMMAND CENTER...</div>;
  const hr=new Date().getHours();
  const gr=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  const fn=profile?.full_name?.split(' ')[0]||'Commander';
  const kpis=[
    {label:'Income',value:f(income),change:ic,color:'#10b981',bg:'rgba(16,185,129,.07)',border:'rgba(16,185,129,.18)',inv:false},
    {label:'Expenses',value:f(expenses),change:ec,color:'#ef4444',bg:'rgba(239,68,68,.07)',border:'rgba(239,68,68,.18)',inv:true},
    {label:'Net Cash Flow',value:f(net),change:null,color:net>=0?'#10b981':'#ef4444',bg:net>=0?'rgba(16,185,129,.07)':'rgba(239,68,68,.07)',border:net>=0?'rgba(16,185,129,.18)':'rgba(239,68,68,.18)'},
    {label:'Savings Rate',value:sr+'%',change:null,color:sr>=20?'#a78bfa':'#f59e0b',bg:'rgba(124,58,237,.07)',border:'rgba(124,58,237,.18)'},
  ];
  return (
    <div style={{paddingBottom:48}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#fff',marginBottom:4}}>{gr}, {fn}</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,.35)'}}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} - Financial Snapshot</p>
      </div>
      {/* KPI Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {kpis.map(c=>(
          <div key={c.label} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:'18px 20px',transition:'transform .2s,box-shadow .2s',cursor:'default'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 30px rgba(0,0,0,.3)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='none';}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.08em'}}>{c.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:c.color,fontFamily:"'Roboto Mono',monospace",marginBottom:5}}>{c.value}</div>
            {c.change!==null&&li>0&&<div style={{fontSize:11,color:(c.inv?c.change<0:c.change>=0)?'#10b981':'#ef4444'}}>{fp(c.change)} vs last month</div>}
            {c.change===null&&<div style={{fontSize:11,color:'rgba(255,255,255,.22)'}}>This month</div>}
          </div>
        ))}
      </div>
      {/* Insights + Add Tx button */}
      {(income>0||txns.length>0)&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:14,marginBottom:20,alignItems:'start'}}>
          <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px 18px',backdropFilter:'blur(12px)'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Insights</div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {sr>=20&&<div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#10b981',fontSize:11,flexShrink:0,marginTop:1}}>[OK]</span><span style={{fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.5}}>Saving {sr}% of income this month. Solid!</span></div>}
              {sr<20&&income>0&&<div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#f59e0b',fontSize:11,flexShrink:0,marginTop:1}}>[!]</span><span style={{fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.5}}>Savings rate is {sr}%. Aim for 20%+.</span></div>}
              {top&&top[1]>income*.35&&<div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#ef4444',fontSize:11,flexShrink:0,marginTop:1}}>[!]</span><span style={{fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.5}}>{top[0]} is {Math.round((top[1]/income)*100)}% of income. Review this.</span></div>}
              {goals.length===0&&<div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#60a5fa',fontSize:11,flexShrink:0,marginTop:1}}>[i]</span><span style={{fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.5}}>No savings goals set. Add one in AutoPilot.</span></div>}
              {txns.length===0&&<div style={{display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#60a5fa',fontSize:11,flexShrink:0,marginTop:1}}>[i]</span><span style={{fontSize:12,color:'rgba(255,255,255,.6)',lineHeight:1.5}}>Start logging transactions to get insights.</span></div>}
            </div>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{padding:'12px 20px',borderRadius:12,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(26,107,255,.35)',transition:'all .2s',fontFamily:"'Inter',sans-serif"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';(e.currentTarget as HTMLElement).style.boxShadow='0 6px 28px rgba(26,107,255,.5)';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(26,107,255,.35)';}}>
            + Add Transaction
          </button>
        </div>
      )}
      {/* Budgets */}
      {budgets.length>0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20,backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.06em'}}>Budget Tracker</span>
            <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {budgets.slice(0,4).map((b:any)=>{
              const sp=cs[b.category]||0;
              const pct=Math.min(100,Math.round((sp/Number(b.amount))*100));
              const ov=pct>=100;
              return(
                <div key={b.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.55)'}}>{b.category}</span>
                    <span style={{fontSize:12,color:ov?'#ef4444':'rgba(255,255,255,.35)'}}>{f(sp)}/{f(Number(b.amount))}</span>
                  </div>
                  <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:5}}>
                    <div style={{background:ov?'#ef4444':pct>80?'#f59e0b':'#10b981',borderRadius:100,height:5,width:pct+'%',transition:'width .5s'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Goals */}
      {goals.length>0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20,backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.06em'}}>Savings Goals</span>
            <Link href="/dashboard/autopilot" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>Manage</Link>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {goals.slice(0,3).map((g:any)=>{
              const p=Math.min(100,Math.round((Number(g.current_amount)/Number(g.target_amount))*100));
              return(
                <div key={g.id}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:13,color:'rgba(255,255,255,.7)'}}>{g.name}</span>
                    <span style={{fontSize:12,color:'#a78bfa'}}>{p}%</span>
                  </div>
                  <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:6}}>
                    <div style={{background:'linear-gradient(90deg,#7c00ff,#a78bfa)',borderRadius:100,height:6,width:p+'%',transition:'width .6s',boxShadow:p>50?'0 0 10px rgba(167,139,250,.3)':'none'}}/>
                  </div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:3}}>{f(Number(g.current_amount))} of {f(Number(g.target_amount))}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Modules */}
      <div style={{fontSize:10,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12,fontFamily:"'Orbitron',monospace"}}>Control Modules</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {MODULES.map(m=>(
          <Link key={m.href} href={m.href} style={{textDecoration:'none'}}>
            <div style={{background:'rgba(13,17,23,.8)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:18,cursor:'pointer',transition:'all .2s',backdropFilter:'blur(12px)'}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=m.color+'40';el.style.transform='translateY(-2px)';el.style.boxShadow=`0 8px 24px rgba(0,0,0,.3)`;}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,255,255,.07)';el.style.transform='translateY(0)';el.style.boxShadow='none';}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:m.color+'15',border:`1px solid ${m.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,color:m.color}}>{m.icon}</div>
                <span style={{fontSize:9,color:m.color,fontFamily:"'Orbitron',monospace",letterSpacing:'.08em'}}>ACTIVE</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:11,color:m.color+'99'}}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      {/* Recent Transactions */}
      {txns.length>0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.06em'}}>Recent Transactions</span>
            <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
          </div>
          {txns.slice(0,6).map((t:any)=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.type==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}</div>
                <div>
                  <div style={{fontSize:13,color:'#e2e8f0',marginBottom:2}}>{t.description}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{t.category} - {new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                </div>
              </div>
              <span style={{fontSize:14,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}{f(Number(t.amount))}</span>
            </div>
          ))}
        </div>
      )}
      {/* Empty state */}
      {txns.length===0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'48px 24px',textAlign:'center',backdropFilter:'blur(12px)'}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:36,fontWeight:900,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:12}}>F</div>
          <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:16,color:'rgba(255,255,255,.6)',marginBottom:8}}>Mission Control Ready</h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:24}}>Log your first transaction to activate your financial dashboard.</p>
          <button onClick={()=>setShowAdd(true)} style={{padding:'11px 28px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 20px rgba(26,107,255,.3)'}}>+ Log First Transaction</button>
        </div>
      )}
      {/* Add Transaction Modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(4px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:28,width:'100%',maxWidth:420,animation:'slideUp .2s ease'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:'#00f2ff'}}>Quick Add</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,lineHeight:1}}>x</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {(['income','expense'] as const).map(t=>(
                <button key={t} onClick={()=>setTxType(t)} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid',borderColor:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.1)',background:txType===t?(t==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)'):'transparent',color:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.4)',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>
                  {t==='income'?'Income':'Expense'}
                </button>
              ))}
            </div>
            <div style={{marginBottom:10}}><input value={txDesc} onChange={e=>setTxDesc(e.target.value)} placeholder="Description" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <input type="number" value={txAmt} onChange={e=>setTxAmt(e.target.value)} placeholder="Amount ($)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <input type="date" value={txDate} onChange={e=>setTxDate(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,242,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{marginBottom:20}}>
              <select value={txCat} onChange={e=>setTxCat(e.target.value)} style={{...inp,background:'rgba(13,17,23,.95)'}}>
                {['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Shopping','Utilities','Freelance','Salary','Other'].map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <button onClick={addTx} disabled={!txDesc.trim()||!txAmt||txSaving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:txSaving?.7:1,boxShadow:'0 4px 20px rgba(26,107,255,.3)',transition:'opacity .2s'}}>
              {txSaving?'Saving...':'Add Transaction'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
