'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f=(n:number)=>'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fp=(n:number)=>(n>=0?'+':'')+n.toFixed(1)+'%';
const MODULES=[
  {href:'/dashboard/mission',label:'Mission Tracker',desc:'Income & expenses',color:'#00f2ff',icon:'T'},
  {href:'/dashboard/autopilot',label:'AutoPilot',desc:'Savings goals',color:'#a78bfa',icon:'A'},
  {href:'/dashboard/growth',label:'Growth Engine',desc:'Business revenue',color:'#2dd4bf',icon:'G'},
  {href:'/dashboard/debts',label:'Debt Planner',desc:'AI payoff strategy',color:'#ef4444',icon:'X'},
  {href:'/dashboard/academy',label:'Academy',desc:'Financial education',color:'#f59e0b',icon:'E'},
  {href:'/dashboard/vault',label:'Vault',desc:'Premium resources',color:'#00f0ff',icon:'V'},
];
interface AIInsight{financial_score:number;score_explanation:string;top_actions:any[];spending_alerts:any[];savings_opportunity:number;cashflow_forecast:any;weekly_verdict:string;goal_recommendations:any[];}
export default function DashboardPage(){
  const [loading,setLoading]=useState(true);
  const [profile,setProfile]=useState<any>(null);
  const [txns,setTxns]=useState<any[]>([]);
  const [goals,setGoals]=useState<any[]>([]);
  const [budgets,setBudgets]=useState<any[]>([]);
  const [aiInsight,setAiInsight]=useState<AIInsight|null>(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiError,setAiError]=useState('');
  const [showAdd,setShowAdd]=useState(false);
  const [txDesc,setTxDesc]=useState('');const [txAmt,setTxAmt]=useState('');
  const [txCat,setTxCat]=useState('Salary');const [txType,setTxType]=useState<'income'|'expense'>('income');
  const [txDate,setTxDate]=useState(new Date().toISOString().split('T')[0]);
  const [txSaving,setTxSaving]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [chatMsg,setChatMsg]=useState('');
  const [chatHistory,setChatHistory]=useState<{role:string;content:string}[]>([]);
  const [chatLoading,setChatLoading]=useState(false);
  const chatRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session)return;
      const uid=session.user.id;
      const [{data:p},{data:t},{data:g},{data:b},{data:ai}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',uid).single(),
        sb.from('transactions').select('*').eq('user_id',uid).order('date',{ascending:false}).limit(200),
        sb.from('savings_goals').select('*').eq('user_id',uid).eq('completed',false),
        sb.from('budgets').select('*').eq('user_id',uid).eq('month',new Date().getMonth()+1).eq('year',new Date().getFullYear()),
        sb.from('ai_insights').select('*').eq('user_id',uid).order('week_start',{ascending:false}).limit(1).single(),
      ]);
      setProfile(p);setTxns(t??[]);setGoals(g??[]);setBudgets(b??[]);
      if(ai)setAiInsight(ai as any);
      setLoading(false);
    });
  },[]);
  const now=new Date();
  const tm=txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const lm=txns.filter(t=>{const d=new Date(t.date);const l=new Date(now.getFullYear(),now.getMonth()-1,1);return d.getMonth()===l.getMonth()&&d.getFullYear()===l.getFullYear();});
  const income=tm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const expenses=tm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const net=income-expenses;const sr=income>0?Math.round((net/income)*100):0;
  const li=lm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const le=lm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const ic=li>0?((income-li)/li)*100:0;const ec=le>0?((expenses-le)/le)*100:0;
  const cs:Record<string,number>={};
  tm.filter(t=>t.type==='expense').forEach((t:any)=>{cs[t.category]=(cs[t.category]||0)+Number(t.amount);});
  const callAI=async(prompt:string,maxTokens=1200):Promise<string>=>{
    const{data:{session}}=await sb.auth.getSession();
    if(!session)throw new Error('Not authenticated');
    const res=await fetch('/api/ai/analyze',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({prompt,max_tokens:maxTokens})});
    if(!res.ok){const e=await res.json();throw new Error(e.error||'AI error');}
    const d=await res.json();
    return d.content||'';
  };
  const runAI=async()=>{
    setAiLoading(true);setAiError('');
    try{
      const context={
        user:{name:profile?.full_name,role:profile?.role},
        income_this_month:income,expenses_this_month:expenses,net,savings_rate_pct:sr,
        income_vs_prev:li>0?Math.round(((income-li)/li)*100):null,
        expense_vs_prev:le>0?Math.round(((expenses-le)/le)*100):null,
        top_categories:Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,a])=>({category:c,amount:a,pct:income>0?Math.round((a/income)*100):0})),
        transaction_count:tm.length,
        goals:goals.map(g=>({name:g.name,target:Number(g.target_amount),current:Number(g.current_amount),pct:Math.round((Number(g.current_amount)/Number(g.target_amount))*100)})),
        budgets:budgets.map(b=>({category:b.category,budget:Number(b.amount),spent:cs[b.category]||0,over:(cs[b.category]||0)>Number(b.amount)})),
      };
      const prompt=`You are a personal financial advisor AI. Analyze this financial data and return ONLY a valid JSON object, no markdown, no explanation.\n\nDATA: ${JSON.stringify(context)}\n\nReturn exactly this JSON structure:\n{"financial_score":<integer 0-100>,"score_explanation":"<one sentence>","top_actions":[{"priority":1,"action":"<specific action with dollar amount>","impact":"<measurable outcome>","urgency":"this_week"},{"priority":2,"action":"<specific>","impact":"<measurable>","urgency":"this_month"}],"spending_alerts":[{"category":"<name>","message":"<specific alert>","severity":"warning"}],"savings_opportunity":<number>,"cashflow_forecast":{"30_days":<number>,"60_days":<number>,"confidence":"medium"},"weekly_verdict":"<2-3 sentences, brutally honest, specific numbers>","goal_recommendations":[{"goal_name":"<name>","months_at_current_rate":<n>,"months_if_following_advice":<n>}]}`;
      const raw=await callAI(prompt,1200);
      const clean=raw.replace(/```json|```/g,'').trim();
      const start=clean.indexOf('{');const end=clean.lastIndexOf('}');
      const parsed=JSON.parse(clean.slice(start,end+1));
      setAiInsight(parsed);
      const{data:{session:s2}}=await sb.auth.getSession();
      if(s2){
        const ws=new Date();const day=ws.getDay();const diff=ws.getDate()-day+(day===0?-6:1);const monday=new Date(ws.setDate(diff));
        await sb.from('ai_insights').upsert({user_id:s2.user.id,week_start:monday.toISOString().split('T')[0],...parsed,generated_at:new Date().toISOString()},{onConflict:'user_id,week_start'});
        await sb.from('profiles').update({financial_score:parsed.financial_score,last_ai_analysis:new Date().toISOString()}).eq('id',s2.user.id);
      }
    }catch(e:any){setAiError(e.message||'Analysis failed. Try again.');}
    setAiLoading(false);
  };
  const sendChat=async()=>{
    if(!chatMsg.trim()||chatLoading)return;
    const msg=chatMsg.trim();setChatMsg('');
    const newHistory=[...chatHistory,{role:'user',content:msg}];
    setChatHistory(newHistory);setChatLoading(true);
    setTimeout(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},50);
    try{
      const{data:{session}}=await sb.auth.getSession();
      if(!session)throw new Error('Not authenticated');
      const context=`Income: ${f(income)}/mo, Expenses: ${f(expenses)}/mo, Savings rate: ${sr}%, Net: ${f(net)}/mo. Goals: ${goals.map(g=>g.name).join(', ')||'none'}. Top spending: ${Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,a])=>`${c} ${f(a)}`).join(', ')||'none'}.`;
      const res=await fetch('/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({messages:newHistory.map(m=>({role:m.role,content:m.content})),context})});
      if(!res.ok)throw new Error('AI unavailable');
      const d=await res.json();
      setChatHistory([...newHistory,{role:'assistant',content:d.content||'Could not process that.'}]);
    }catch(e:any){setChatHistory([...newHistory,{role:'assistant',content:'AI temporarily unavailable. Try again.'}]);}
    setChatLoading(false);
    setTimeout(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},50);
  };
  const addTx=async()=>{
    if(!txDesc.trim()||!txAmt)return;setTxSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setTxSaving(false);return;}
    const{data}=await sb.from('transactions').insert({user_id:session.user.id,type:txType,description:txDesc.trim(),amount:parseFloat(txAmt),category:txCat,date:txDate}).select().single();
    if(data)setTxns(p=>[data,...p]);
    setShowAdd(false);setTxDesc('');setTxAmt('');setTxSaving(false);
  };
  const scoreColor=(s:number)=>s>=70?'#10b981':s>=40?'#f59e0b':'#ef4444';
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif",transition:'border-color .2s'};
  if(loading)return <div style={{padding:60,textAlign:'center',color:'rgba(255,255,255,.4)',fontFamily:"'Orbitron',monospace",fontSize:11,letterSpacing:'.15em'}}>INITIALIZING AI COMMAND CENTER...</div>;
  const hr=new Date().getHours();const gr=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  const fn=profile?.full_name?.split(' ')[0]||'Commander';
  const score=aiInsight?.financial_score??profile?.financial_score??null;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#fff',marginBottom:4}}>{gr}, {fn}</h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.35)'}}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setChatOpen(true)} style={{padding:'9px 16px',borderRadius:10,background:'rgba(0,242,255,.08)',border:'1px solid rgba(0,242,255,.22)',color:'#00f2ff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>AI Chat</button>
          <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 16px rgba(26,107,255,.3)'}}>+ Add Transaction</button>
        </div>
      </div>

      {/* AI ADVISOR — hero card */}
      <div style={{background:'rgba(13,17,23,.92)',border:'1px solid rgba(255,255,255,.09)',borderRadius:18,padding:24,marginBottom:20,backdropFilter:'blur(16px)'}}>
        <div style={{display:'grid',gridTemplateColumns:score!==null?'120px 1fr':'1fr',gap:24,alignItems:'center'}}>
          {score!==null&&(
            <div style={{textAlign:'center'}}>
              <div style={{position:'relative',width:100,height:100,margin:'0 auto'}}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor(score)} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${(score/100)*264} 264`} strokeDashoffset="66" transform="rotate(-90 50 50)"
                    style={{filter:`drop-shadow(0 0 8px ${scoreColor(score)}90)`,transition:'stroke-dasharray 1s ease'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:24,fontWeight:900,color:scoreColor(score),lineHeight:1}}>{score}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.1em',marginTop:2}}>SCORE</div>
                </div>
              </div>
              {aiInsight?.score_explanation&&<div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginTop:8,lineHeight:1.4}}>{aiInsight.score_explanation}</div>}
            </div>
          )}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:score!==null?scoreColor(score):'#00f2ff',letterSpacing:'.08em'}}>
                {score!==null?'AI FINANCIAL ANALYSIS — POWERED BY NVIDIA':'AI FINANCIAL ADVISOR — POWERED BY NVIDIA'}
              </div>
              <button onClick={runAI} disabled={aiLoading} style={{padding:'8px 16px',borderRadius:8,background:aiLoading?'rgba(255,255,255,.05)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:aiLoading?'rgba(255,255,255,.3)':'#fff',border:'none',cursor:aiLoading?'not-allowed':'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap',flexShrink:0,marginLeft:16,boxShadow:aiLoading?'none':'0 4px 14px rgba(26,107,255,.3)',transition:'all .2s'}}>
                {aiLoading?'Analyzing...':'Run Analysis'}
              </button>
            </div>
            {aiError&&<div style={{fontSize:12,color:'#ef4444',marginBottom:8,padding:'6px 10px',background:'rgba(239,68,68,.08)',borderRadius:6,border:'1px solid rgba(239,68,68,.2)'}}>{aiError}</div>}
            {aiInsight?.weekly_verdict?<p style={{fontSize:13,color:'rgba(255,255,255,.72)',lineHeight:1.65,marginBottom:aiInsight.top_actions?.length>0?12:0}}>{aiInsight.weekly_verdict}</p>
            :<p style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>{txns.length===0?'Add your first transaction to activate AI analysis.':'Click "Run Analysis" to get your AI financial score, spending alerts, and a personalized action plan.'}</p>}
            {aiInsight?.top_actions?.length>0&&(
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {aiInsight.top_actions.slice(0,2).map((a:any,i:number)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,background:'rgba(255,255,255,.04)',borderRadius:8,padding:'8px 12px',border:'1px solid rgba(255,255,255,.05)'}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:i===0?'rgba(0,242,255,.12)':'rgba(167,139,250,.1)',border:`1px solid ${i===0?'rgba(0,242,255,.3)':'rgba(167,139,250,.25)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i===0?'#00f2ff':'#a78bfa',flexShrink:0,fontFamily:"'Orbitron',monospace"}}>{a.priority}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:'#e2e8f0',marginBottom:2}}>{a.action}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.32)'}}>{a.impact}</div>
                    </div>
                    <span style={{fontSize:10,padding:'2px 8px',borderRadius:100,background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.38)',flexShrink:0,whiteSpace:'nowrap'}}>{a.urgency?.replace(/_/g,' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {aiInsight?.spending_alerts?.length>0&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',flexWrap:'wrap',gap:7}}>
            {aiInsight.spending_alerts.map((a:any,i:number)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:100,background:a.severity==='critical'?'rgba(239,68,68,.1)':'rgba(245,158,11,.07)',border:`1px solid ${a.severity==='critical'?'rgba(239,68,68,.25)':'rgba(245,158,11,.2)'}`,fontSize:11,color:a.severity==='critical'?'#ef4444':'#f59e0b'}}>
                <span style={{fontSize:10,fontWeight:700}}>{a.severity==='critical'?'!':'~'}</span>{a.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          {l:'Income',v:f(income),ch:ic,c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.18)',inv:false},
          {l:'Expenses',v:f(expenses),ch:ec,c:'#ef4444',bg:'rgba(239,68,68,.07)',b:'rgba(239,68,68,.18)',inv:true},
          {l:'Net Cash Flow',v:f(net),ch:null,c:net>=0?'#10b981':'#ef4444',bg:net>=0?'rgba(16,185,129,.07)':'rgba(239,68,68,.07)',b:net>=0?'rgba(16,185,129,.18)':'rgba(239,68,68,.18)'},
          {l:'Savings Rate',v:sr+'%',ch:null,c:sr>=20?'#a78bfa':'#f59e0b',bg:'rgba(124,58,237,.07)',b:'rgba(124,58,237,.18)'},
        ].map(c=>(
          <div key={c.l} style={{background:c.bg,border:`1px solid ${c.b}`,borderRadius:14,padding:'18px 20px',transition:'transform .18s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.33)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.09em'}}>{c.l}</div>
            <div style={{fontSize:23,fontWeight:700,color:c.c,fontFamily:"'Roboto Mono',monospace",marginBottom:5}}>{c.v}</div>
            {c.ch!==null&&li>0?<div style={{fontSize:11,color:(c.inv?c.ch<0:c.ch>=0)?'#10b981':'#ef4444'}}>{fp(c.ch)} vs last month</div>:<div style={{fontSize:11,color:'rgba(255,255,255,.2)'}}>This month</div>}
          </div>
        ))}
      </div>

      {/* Cashflow Forecast */}
      {aiInsight?.cashflow_forecast&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>AI Cashflow Forecast</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[['30 Days',aiInsight.cashflow_forecast['30_days']],['60 Days',aiInsight.cashflow_forecast['60_days']],['90 Days',aiInsight.cashflow_forecast['90_days']]].map(([l,v]:any)=>(
              <div key={l} style={{background:'rgba(255,255,255,.04)',borderRadius:10,padding:'12px 16px',textAlign:'center'}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,.33)',marginBottom:6}}>{l}</div>
                <div style={{fontSize:18,fontWeight:700,color:v>=0?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{f(v)}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:'rgba(255,255,255,.18)',marginTop:10}}>Confidence: {aiInsight.cashflow_forecast.confidence} · Based on last 30 days</div>
        </div>
      )}

      {/* Budgets + Goals */}
      {(budgets.length>0||goals.length>0)&&(
        <div style={{display:'grid',gridTemplateColumns:budgets.length>0&&goals.length>0?'1fr 1fr':'1fr',gap:16,marginBottom:20}}>
          {budgets.length>0&&(
            <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:10,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:"'Orbitron',monospace"}}>Budgets</span>
                <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
              </div>
              {budgets.slice(0,4).map((b:any)=>{const sp=cs[b.category]||0;const pct=Math.min(100,Math.round((sp/Number(b.amount))*100));const ov=pct>=100;return(
                <div key={b.id} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>{b.category}</span><span style={{fontSize:12,color:ov?'#ef4444':'rgba(255,255,255,.32)'}}>{f(sp)}/{f(Number(b.amount))}</span></div>
                  <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:5}}><div style={{background:ov?'#ef4444':pct>80?'#f59e0b':'#10b981',borderRadius:100,height:5,width:pct+'%',transition:'width .5s'}}/></div>
                </div>
              );})}
            </div>
          )}
          {goals.length>0&&(
            <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:10,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:"'Orbitron',monospace"}}>Savings Goals</span>
                <Link href="/dashboard/autopilot" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>Manage</Link>
              </div>
              {goals.slice(0,3).map((g:any)=>{
                const p=Math.min(100,Math.round((Number(g.current_amount)/Number(g.target_amount))*100));
                const rec=aiInsight?.goal_recommendations?.find((r:any)=>r.goal_name===g.name);
                return(
                  <div key={g.id} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:13,color:'rgba(255,255,255,.68)'}}>{g.name}</span><span style={{fontSize:12,color:'#a78bfa'}}>{p}%</span></div>
                    <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:6}}><div style={{background:'linear-gradient(90deg,#7c00ff,#a78bfa)',borderRadius:100,height:6,width:p+'%',transition:'width .6s',boxShadow:p>50?'0 0 8px rgba(167,139,250,.35)':'none'}}/></div>
                    {rec&&<div style={{fontSize:10,color:'rgba(0,242,255,.55)',marginTop:3}}>AI: {rec.months_at_current_rate}mo now → {rec.months_if_following_advice}mo with advice</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modules */}
      <div style={{fontSize:10,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:12,fontFamily:"'Orbitron',monospace"}}>Control Modules</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {MODULES.map(m=>(
          <Link key={m.href} href={m.href} style={{textDecoration:'none'}}>
            <div style={{background:'rgba(13,17,23,.8)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:18,cursor:'pointer',transition:'all .2s'}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=m.color+'40';el.style.transform='translateY(-2px)';el.style.background='rgba(20,26,40,.9)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,255,255,.07)';el.style.transform='translateY(0)';el.style.background='rgba(13,17,23,.8)';}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{width:34,height:34,borderRadius:9,background:m.color+'14',border:`1px solid ${m.color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:700,color:m.color}}>{m.icon}</div>
                <span style={{fontSize:9,color:m.color+'cc',fontFamily:"'Orbitron',monospace",letterSpacing:'.08em'}}>ACTIVE</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:11,color:m.color+'88'}}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      {txns.length>0?(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span style={{fontSize:10,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:"'Orbitron',monospace"}}>Recent Transactions</span>
            <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
          </div>
          {txns.slice(0,6).map((t:any)=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.type==='income'?'rgba(16,185,129,.1)':'rgba(239,68,68,.09)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}</div>
                <div>
                  <div style={{fontSize:13,color:'#e2e8f0',marginBottom:1}}>{t.description}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.26)'}}>{t.category} — {new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                </div>
              </div>
              <span style={{fontSize:14,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}{f(Number(t.amount))}</span>
            </div>
          ))}
        </div>
      ):(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'44px 24px',textAlign:'center'}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:32,fontWeight:900,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:10}}>FF</div>
          <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:'rgba(255,255,255,.5)',marginBottom:8}}>Mission Control Ready</h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.28)',marginBottom:22}}>Log your first transaction to activate AI analysis and your financial score.</p>
          <button onClick={()=>setShowAdd(true)} style={{padding:'11px 28px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 20px rgba(26,107,255,.3)'}}>+ Log First Transaction</button>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.78)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(5px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:28,width:'100%',maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:'#00f2ff'}}>Quick Add Transaction</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,lineHeight:1,padding:0}}>×</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {(['income','expense'] as const).map(t=>(
                <button key={t} onClick={()=>setTxType(t)} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid',borderColor:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.1)',background:txType===t?(t==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)'):'transparent',color:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.4)',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>
                  {t==='income'?'+ Income':'− Expense'}
                </button>
              ))}
            </div>
            <div style={{marginBottom:10}}><input value={txDesc} onChange={e=>setTxDesc(e.target.value)} placeholder="Description" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <input type="number" value={txAmt} onChange={e=>setTxAmt(e.target.value)} placeholder="Amount ($)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <input type="date" value={txDate} onChange={e=>setTxDate(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{marginBottom:20}}>
              <select value={txCat} onChange={e=>setTxCat(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                {['Salary','Freelance','Business','Food','Transport','Housing','Entertainment','Health','Savings','Education','Shopping','Utilities','Other'].map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <button onClick={addTx} disabled={!txDesc.trim()||!txAmt||txSaving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:(!txDesc.trim()||!txAmt||txSaving)?'not-allowed':'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:txSaving?.6:1,boxShadow:'0 4px 20px rgba(26,107,255,.3)',transition:'opacity .2s'}}>
              {txSaving?'Saving...':'Add Transaction'}
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Drawer */}
      {chatOpen&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',zIndex:1000,backdropFilter:'blur(4px)'}} onClick={()=>setChatOpen(false)}>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:'min(420px,100vw)',background:'#0a0e1a',borderLeft:'1px solid rgba(255,255,255,.09)',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,color:'#00f2ff',marginBottom:3}}>AI Financial Advisor</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>Powered by NVIDIA · Llama 3.3 70B</div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,padding:0}}>×</button>
            </div>
            <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12}}>
              {chatHistory.length===0&&(
                <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.28)',marginBottom:4}}>Suggested questions:</div>
                  {['Can I afford a $500 purchase next month?','What is my biggest financial problem right now?','How do I save $1,000 in 60 days?','Where is most of my money going?'].map(q=>(
                    <button key={q} onClick={()=>setChatMsg(q)} style={{padding:'9px 13px',borderRadius:9,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',color:'rgba(255,255,255,.55)',cursor:'pointer',fontSize:12,textAlign:'left',fontFamily:"'Inter',sans-serif",transition:'background .15s'}}>{q}</button>
                  ))}
                </div>
              )}
              {chatHistory.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'10px 14px',borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.role==='user'?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.07)',fontSize:13,color:'#e2e8f0',lineHeight:1.55}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading&&(
                <div style={{display:'flex',gap:5,padding:'10px 14px',background:'rgba(255,255,255,.06)',borderRadius:'14px 14px 14px 4px',width:'fit-content'}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'rgba(0,242,255,.6)',animation:'bounce 1.2s infinite',animationDelay:`${i*0.2}s`}}/>)}
                </div>
              )}
            </div>
            <div style={{padding:14,borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',gap:8'}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Ask about your finances..." style={{...inp,flex:1}}/>
              <button onClick={sendChat} disabled={!chatMsg.trim()||chatLoading} style={{padding:'10px 16px',borderRadius:8,background:!chatMsg.trim()||chatLoading?'rgba(255,255,255,.05)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:!chatMsg.trim()||chatLoading?'rgba(255,255,255,.3)':'#fff',border:'none',cursor:!chatMsg.trim()||chatLoading?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",transition:'all .2s',flexShrink:0}}>Send</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}
