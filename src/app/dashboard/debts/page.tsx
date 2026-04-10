'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f=(n:number)=>'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const DEBT_TYPES=['credit_card','student_loan','personal_loan','mortgage','car_loan','other'];
function calcPayoff(balance:number,rate:number,payment:number){
  if(payment<=0||balance<=0)return{months:999,total:balance,interest:0};
  const monthly=rate/100/12;
  if(monthly===0)return{months:Math.ceil(balance/payment),total:balance,interest:0};
  if(payment<=balance*monthly)return{months:999,total:999999,interest:999999};
  const months=Math.ceil(-Math.log(1-balance*monthly/payment)/Math.log(1+monthly));
  const total=payment*months;
  return{months,total,interest:total-balance};
}
function avalanche(debts:any[]):any[]{
  return [...debts].sort((a,b)=>Number(b.interest_rate)-Number(a.interest_rate));
}
function snowball(debts:any[]):any[]{
  return [...debts].sort((a,b)=>Number(a.balance)-Number(b.balance));
}
export default function DebtPage(){
  const [debts,setDebts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [aiPlan,setAiPlan]=useState('');
  const [aiLoading,setAiLoading]=useState(false);
  const [strategy,setStrategy]=useState<'avalanche'|'snowball'>('avalanche');
  const [extraPayment,setExtraPayment]=useState(0);
  const [form,setForm]=useState({name:'',debt_type:'credit_card',balance:'',interest_rate:'',minimum_payment:'',due_day:''});
  const [saving,setSaving]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const{data}=await sb.from('debts').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false});
      setDebts(data??[]);setLoading(false);
    });
  },[]);
  const addDebt=async()=>{
    if(!form.name.trim()||!form.balance)return;setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data}=await sb.from('debts').insert({user_id:session.user.id,name:form.name.trim(),debt_type:form.debt_type,balance:parseFloat(form.balance),original_balance:parseFloat(form.balance),interest_rate:parseFloat(form.interest_rate)||0,minimum_payment:parseFloat(form.minimum_payment)||0,due_day:form.due_day?parseInt(form.due_day):null}).select().single();
    if(data)setDebts(p=>[data,...p]);
    setShowAdd(false);setForm({name:'',debt_type:'credit_card',balance:'',interest_rate:'',minimum_payment:'',due_day:''});setSaving(false);
  };
  const delDebt=async(id:string)=>{
    setDebts(p=>p.filter(d=>d.id!==id));
    await sb.from('debts').delete().eq('id',id);
  };
  const getAIPlan=async()=>{
    if(debts.length===0)return;setAiLoading(true);setAiPlan('');
    try{
      const{data:{session}}=await sb.auth.getSession();
      if(!session)throw new Error('Not logged in');
      const debtSummary=debts.map(d=>({name:d.name,type:d.debt_type,balance:Number(d.balance),rate:Number(d.interest_rate),min_payment:Number(d.minimum_payment)}));
      const totalDebt=debts.reduce((s,d)=>s+Number(d.balance),0);
      const prompt=`You are a debt payoff advisor. Analyze these debts and create a specific payoff plan.\n\nDebts: ${JSON.stringify(debtSummary)}\nTotal debt: ${f(totalDebt)}\nExtra monthly payment available: ${f(extraPayment)}\nPreferred strategy: ${strategy}\n\nProvide:\n1. Which debt to attack first and why (2 sentences)\n2. Specific monthly payment amounts for each debt\n3. Estimated payoff timeline for each debt\n4. Total interest saved vs minimum payments\n5. One key insight about their debt situation\n\nBe specific with numbers. Be direct. No fluff.`;
      const res=await fetch('/api/ai/analyze',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({prompt,max_tokens:600})});
      if(!res.ok)throw new Error('AI unavailable');
      const d=await res.json();
      setAiPlan(d.content||'Analysis failed');
    }catch(e:any){setAiPlan('AI analysis unavailable. Check your connection.');}
    setAiLoading(false);
  };
  const orderedDebts=strategy==='avalanche'?avalanche(debts):snowball(debts);
  const totalBalance=debts.reduce((s,d)=>s+Number(d.balance),0);
  const totalMinPayment=debts.reduce((s,d)=>s+Number(d.minimum_payment),0);
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif"};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#ef4444',marginBottom:4}}>Debt Planner</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Track debts. Get an AI payoff strategy. Become debt-free faster.</p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',borderRadius:10,background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>+ Add Debt</button>
      </div>
      {debts.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
          {[{l:'Total Debt',v:f(totalBalance),c:'#ef4444',bg:'rgba(239,68,68,.07)',border:'rgba(239,68,68,.18)'},{l:'Monthly Minimums',v:f(totalMinPayment),c:'#f59e0b',bg:'rgba(245,158,11,.07)',border:'rgba(245,158,11,.18)'},{l:'Debts Tracked',v:String(debts.length),c:'#60a5fa',bg:'rgba(96,165,250,.07)',border:'rgba(96,165,250,.18)'}].map(c=>(
            <div key={c.l} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:'18px 20px'}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.08em'}}>{c.l}</div>
              <div style={{fontSize:24,fontWeight:700,color:c.c,fontFamily:"'Roboto Mono',monospace"}}>{c.v}</div>
            </div>
          ))}
        </div>
      )}
      {debts.length>0&&(
        <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(239,68,68,.2)',borderRadius:14,padding:22,marginBottom:20,backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16,flexWrap:'wrap',gap:12}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,color:'#ef4444'}}>AI Payoff Strategy</div>
            <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
              <div style={{display:'flex',gap:6}}>
                {(['avalanche','snowball'] as const).map(s=>(
                  <button key={s} onClick={()=>setStrategy(s)} style={{padding:'5px 12px',borderRadius:100,fontSize:11,border:'1px solid',borderColor:strategy===s?'#ef4444':'rgba(255,255,255,.1)',background:strategy===s?'rgba(239,68,68,.12)':'transparent',color:strategy===s?'#ef4444':'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif",textTransform:'capitalize'}}>{s}</button>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Extra/mo:</span>
                <input type="number" value={extraPayment||''} onChange={e=>setExtraPayment(Number(e.target.value))} placeholder="$0" style={{width:70,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,padding:'4px 8px',color:'#fff',fontSize:11,outline:'none'}}/>
              </div>
              <button onClick={getAIPlan} disabled={aiLoading} style={{padding:'7px 16px',borderRadius:8,background:aiLoading?'rgba(255,255,255,.06)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:aiLoading?'rgba(255,255,255,.4)':'#fff',border:'none',cursor:aiLoading?'not-allowed':'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                {aiLoading?'Analyzing...':'Get AI Plan'}
              </button>
            </div>
          </div>
          {!aiPlan&&!aiLoading&&(
            <div style={{fontSize:13,color:'rgba(255,255,255,.3)',textAlign:'center',padding:'16px 0'}}>
              Select a strategy, add extra monthly payment (optional), then click "Get AI Plan" for a personalized debt payoff roadmap.
            </div>
          )}
          {aiPlan&&<div style={{fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiPlan}</div>}
        </div>
      )}
      {orderedDebts.length>0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:22,marginBottom:20,backdropFilter:'blur(12px)'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:16,fontFamily:"'Orbitron',monospace"}}>Debt Breakdown — {strategy.charAt(0).toUpperCase()+strategy.slice(1)} Order</div>
          {orderedDebts.map((d:any,i:number)=>{
            const payoff=calcPayoff(Number(d.balance),Number(d.interest_rate),Number(d.minimum_payment)+(i===0?extraPayment:0));
            const pctPaid=d.original_balance>0?Math.round(((Number(d.original_balance)-Number(d.balance))/Number(d.original_balance))*100):0;
            return(
              <div key={d.id} style={{padding:'16px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    {i===0&&<div style={{padding:'2px 8px',borderRadius:100,background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.3)',fontSize:10,color:'#ef4444',fontWeight:700,flexShrink:0}}>ATTACK</div>}
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:'#e2e8f0',marginBottom:2}}>{d.name}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{d.debt_type.replace('_',' ')} • {Number(d.interest_rate).toFixed(1)}% APR{d.due_day?` • Due day ${d.due_day}`:''}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:18,fontWeight:700,color:'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{f(Number(d.balance))}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>min {f(Number(d.minimum_payment))}/mo</div>
                  </div>
                </div>
                {d.original_balance>0&&pctPaid>0&&(
                  <div style={{marginBottom:8}}>
                    <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:4}}><div style={{background:'linear-gradient(90deg,#10b981,#059669)',borderRadius:100,height:4,width:pctPaid+'%'}}/></div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.3)',marginTop:3}}>{pctPaid}% paid off</div>
                  </div>
                )}
                <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Payoff: <span style={{color:payoff.months>=999?'#ef4444':'#60a5fa'}}>{payoff.months>=999?'Never (min too low)':`${payoff.months} months`}</span></div>
                  {payoff.interest<999999&&<div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Interest: <span style={{color:'#f59e0b'}}>{f(payoff.interest)}</span></div>}
                  {payoff.total<999999&&<div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Total paid: <span style={{color:'rgba(255,255,255,.6)'}}>{f(payoff.total)}</span></div>}
                </div>
                <div style={{marginTop:8}}>
                  <button onClick={()=>delDebt(d.id)} style={{fontSize:11,color:'rgba(239,68,68,.45)',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:"'Inter',sans-serif"}}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {debts.length===0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'48px 24px',textAlign:'center',backdropFilter:'blur(12px)'}}>
          <div style={{fontSize:36,marginBottom:12,color:'rgba(239,68,68,.4)'}}>0</div>
          <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:15,color:'rgba(255,255,255,.5)',marginBottom:8}}>No Debts Tracked</h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:24}}>Add your debts to get an AI-powered payoff plan and see exactly when you will be debt-free.</p>
          <button onClick={()=>setShowAdd(true)} style={{padding:'11px 28px',borderRadius:10,background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>+ Track First Debt</button>
        </div>
      )}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(4px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(239,68,68,.2)',borderRadius:18,padding:28,width:'100%',maxWidth:440,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:'#ef4444'}}>Add Debt</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22}}>x</button>
            </div>
            {[{l:'Debt Name',k:'name',p:'e.g. Chase Credit Card'},{l:'Current Balance ($)',k:'balance',p:'e.g. 3500',t:'number'},{l:'Interest Rate (% APR)',k:'interest_rate',p:'e.g. 19.99',t:'number'},{l:'Minimum Payment ($)',k:'minimum_payment',p:'e.g. 75',t:'number'},{l:'Due Day of Month',k:'due_day',p:'e.g. 15',t:'number'}].map(field=>(
              <div key={field.k} style={{marginBottom:12}}>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>{field.l}</label>
                <input type={field.t||'text'} value={(form as any)[field.k]} onChange={e=>setForm(p=>({...p,[field.k]:e.target.value}))} placeholder={field.p} style={inp}/>
              </div>
            ))}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>Debt Type</label>
              <select value={form.debt_type} onChange={e=>setForm(p=>({...p,debt_type:e.target.value}))} style={{...inp,background:'rgba(13,17,23,.95)'}}>
                {DEBT_TYPES.map(t=><option key={t} value={t} style={{background:'#0d1117'}}>{t.replace('_',' ')}</option>)}
              </select>
            </div>
            <button onClick={addDebt} disabled={!form.name.trim()||!form.balance||saving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?.7:1}}>
              {saving?'Saving...':'Add Debt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
