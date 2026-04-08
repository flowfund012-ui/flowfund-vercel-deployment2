'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f = (n:number) => '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fp = (n:number) => (n>=0?'+':'')+n.toFixed(1)+'%';
const MODULES=[
  {href:'/dashboard/mission',label:'Mission Tracker',desc:'Income & expenses',color:'#00f2ff',icon:'T'},
  {href:'/dashboard/autopilot',label:'AutoPilot',desc:'Savings goals',color:'#a78bfa',icon:'A'},
  {href:'/dashboard/growth',label:'Growth Engine',desc:'Business revenue',color:'#2dd4bf',icon:'G'},
  {href:'/dashboard/academy',label:'Academy',desc:'Financial education',color:'#f59e0b',icon:'E'},
  {href:'/dashboard/vault',label:'Vault',desc:'Premium resources',color:'#00f0ff',icon:'V'},
  {href:'/dashboard/security',label:'Security',desc:'Data protection',color:'#00ff9d',icon:'S'},
];
interface AIInsight { financial_score:number; score_explanation:string; top_actions:any[]; spending_alerts:any[]; savings_opportunity:number; cashflow_forecast:any; weekly_verdict:string; goal_recommendations:any[]; }
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight|null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [txDesc, setTxDesc] = useState(''); const [txAmt, setTxAmt] = useState('');
  const [txCat, setTxCat] = useState('Salary'); const [txType, setTxType] = useState<'income'|'expense'>('income');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txSaving, setTxSaving] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{role:string;content:string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    sb.auth.getSession().then(async({data:{session}}) => {
      if(!session)return;
      const uid=session.user.id;
      const [{data:p},{data:t},{data:g},{data:b},{data:ai}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',uid).single(),
        sb.from('transactions').select('*').eq('user_id',uid).order('date',{ascending:false}).limit(200),
        sb.from('savings_goals').select('*').eq('user_id',uid).eq('completed',false),
        sb.from('budgets').select('*').eq('user_id',uid).eq('month',new Date().getMonth()+1).eq('year',new Date().getFullYear()),
        sb.from('ai_insights').select('*').eq('user_id',uid).order('week_start',{ascending:false}).limit(1).single(),
      ]);
      setProfile(p); setTxns(t??[]); setGoals(g??[]); setBudgets(b??[]);
      if(ai)setAiInsight(ai as any);
      setLoading(false);
    });
  },[]);
  const now=new Date();
  const tm=txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const lm=txns.filter(t=>{const d=new Date(t.date);const l=new Date(now.getFullYear(),now.getMonth()-1,1);return d.getMonth()===l.getMonth()&&d.getFullYear()===l.getFullYear();});
  const income=tm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const expenses=tm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const net=income-expenses; const sr=income>0?Math.round((net/income)*100):0;
  const li=lm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const le=lm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const ic=li>0?((income-li)/li)*100:0; const ec=le>0?((expenses-le)/le)*100:0;
  const cs:Record<string,number>={};
  tm.filter(t=>t.type==='expense').forEach((t:any)=>{cs[t.category]=(cs[t.category]||0)+Number(t.amount);});
  const runAI = async () => {
    setAiLoading(true); setAiError('');
    try {
      const {data:{session}}=await sb.auth.getSession();
      if(!session)throw new Error('Not logged in');
      const context={
        user:{name:profile?.full_name,role:profile?.role},
        income_this_month:income, expenses_this_month:expenses, net:net, savings_rate_pct:sr,
        income_vs_prev:li>0?Math.round(((income-li)/li)*100):null,
        expense_vs_prev:le>0?Math.round(((expenses-le)/le)*100):null,
        top_categories:Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,a])=>({category:c,amount:a,pct:income>0?Math.round((a/income)*100):0})),
        transaction_count:tm.length,
        goals:goals.map(g=>({name:g.name,target:Number(g.target_amount),current:Number(g.current_amount),pct:Math.round((Number(g.current_amount)/Number(g.target_amount))*100)})),
        budgets:budgets.map(b=>({category:b.category,budget:Number(b.amount),spent:cs[b.category]||0,over:(cs[b.category]||0)>Number(b.amount)})),
      };
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',max_tokens:1200,
          messages:[{role:'user',content:`You are a personal financial advisor AI. Analyze this user's financial data and return ONLY a JSON object.\n\nDATA: ${JSON.stringify(context)}\n\nReturn ONLY this JSON (no other text):\n{"financial_score":<0-100>,"score_explanation":"<one sentence>","top_actions":[{"priority":1,"action":"<specific with amount>","impact":"<measurable>","urgency":"this_week"},{"priority":2,"action":"<specific>","impact":"<measurable>","urgency":"this_month"}],"spending_alerts":[{"category":"<cat>","message":"<specific>","severity":"warning"}],"savings_opportunity":<number>,"cashflow_forecast":{"30_days":<n>,"60_days":<n>,"confidence":"medium"},"weekly_verdict":"<2-3 sentences, brutally honest, specific numbers, one key action this week>"}`}]
        })
      });
      if(!res.ok)throw new Error('AI service unavailable');
      const d=await res.json();
      const clean=(d.content?.[0]?.text??'{}').replace(/```json|```/g,'').trim();
      const parsed=JSON.parse(clean);
      setAiInsight(parsed);
      const {data:{session:s2}}=await sb.auth.getSession();
      if(s2){
        const ws=new Date(); const day=ws.getDay(); const diff=ws.getDate()-day+(day===0?-6:1); const monday=new Date(ws.setDate(diff));
        await sb.from('ai_insights').upsert({user_id:s2.user.id,week_start:monday.toISOString().split('T')[0],...parsed,generated_at:new Date().toISOString()},{onConflict:'user_id,week_start'});
        await sb.from('profiles').update({financial_score:parsed.financial_score,last_ai_analysis:new Date().toISOString()}).eq('id',s2.user.id);
      }
    } catch(e:any){ setAiError(e.message||'Analysis failed'); }
    setAiLoading(false);
  };
  const sendChat = async () => {
    if(!chatMsg.trim()||chatLoading)return;
    const msg=chatMsg.trim(); setChatMsg('');
    const newHistory=[...chatHistory,{role:'user',content:msg}];
    setChatHistory(newHistory); setChatLoading(true);
    setTimeout(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},50);
    try {
      const context=`User finances: income ${f(income)}/month, expenses ${f(expenses)}/month, savings rate ${sr}%, net ${f(net)}/month. Goals: ${goals.map(g=>g.name).join(', ')||'none'}. Top spending: ${Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,a])=>`${c} ${f(a)}`).join(', ')||'none'}.`;
      const messages=newHistory.map(m=>({role:m.role as 'user'|'assistant',content:m.content}));
      messages.unshift({role:'user',content:`[Financial context: ${context}]`});
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,system:'You are a personal financial advisor AI with access to the user\'s real financial data. Be direct, specific, and actionable. Use their actual numbers. Keep responses concise (2-4 sentences max). Never give generic advice.',messages})
      });
      if(!res.ok)throw new Error('AI unavailable');
      const d=await res.json();
      setChatHistory([...newHistory,{role:'assistant',content:d.content?.[0]?.text||'I could not process that.'}]);
    } catch(e:any){ setChatHistory([...newHistory,{role:'assistant',content:'AI service is currently unavailable. Please try again.'}]); }
    setChatLoading(false);
    setTimeout(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},50);
  };
  const addTx=async()=>{
    if(!txDesc.trim()||!txAmt)return; setTxSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setTxSaving(false);return;}
    const{data}=await sb.from('transactions').insert({user_id:session.user.id,type:txType,description:txDesc.trim(),amount:parseFloat(txAmt),category:txCat,date:txDate}).select().single();
    if(data)setTxns(p=>[data,...p]);
    setShowAdd(false);setTxDesc('');setTxAmt('');setTxSaving(false);
  };
  const scoreColor=(s:number)=>s>=70?'#10b981':s>=40?'#f59e0b':'#ef4444';
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif",transition:'border-color .2s'};
  if(loading)return <div style={{padding:60,textAlign:'center',color:'rgba(255,255,255,.4)',fontFamily:"'Orbitron',monospace",fontSize:12,letterSpacing:'.1em'}}>INITIALIZING COMMAND CENTER...</div>;
  const hr=new Date().getHours(); const gr=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  const fn=profile?.full_name?.split(' ')[0]||'Commander';
  const score=aiInsight?.financial_score??profile?.financial_score??null;
  return (
    <div style={{paddingBottom:48}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#fff',marginBottom:4}}>{gr}, {fn}</h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.35)'}}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setChatOpen(true)} style={{padding:'9px 16px',borderRadius:10,background:'rgba(0,242,255,.1)',border:'1px solid rgba(0,242,255,.25)',color:'#00f2ff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>AI Chat</button>
          <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 16px rgba(26,107,255,.3)'}}>+ Add Transaction</button>
        </div>
      </div>

      {/* AI FINANCIAL SCORE — the hero element */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:18,padding:24,marginBottom:20,backdropFilter:'blur(12px)'}}>
        <div style={{display:'grid',gridTemplateColumns:score!==null?'auto 1fr':'1fr',gap:24,alignItems:'center'}}>
          {score!==null&&(
            <div style={{textAlign:'center',minWidth:120}}>
              <div style={{position:'relative',width:110,height:110,margin:'0 auto'}}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8"/>
                  <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor(score)} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(score/100)*289} 289`} strokeDashoffset="72" transform="rotate(-90 55 55)"
                    style={{filter:`drop-shadow(0 0 6px ${scoreColor(score)}80)`,transition:'stroke-dasharray .8s ease'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:26,fontWeight:900,color:scoreColor(score),lineHeight:1}}>{score}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.35)',letterSpacing:'.08em',marginTop:2}}>SCORE</div>
                </div>
              </div>
              {aiInsight?.score_explanation&&<div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginTop:8,maxWidth:110}}>{aiInsight.score_explanation}</div>}
            </div>
          )}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,color:score!==null?scoreColor(score):'#00f2ff',letterSpacing:'.06em',marginBottom:4}}>
                  {score!==null?'AI FINANCIAL ANALYSIS':'AI FINANCIAL ADVISOR'}
                </div>
                {aiInsight?.weekly_verdict?(
                  <p style={{fontSize:13,color:'rgba(255,255,255,.7)',lineHeight:1.6,maxWidth:600}}>{aiInsight.weekly_verdict}</p>
                ):(
                  <p style={{fontSize:13,color:'rgba(255,255,255,.45)',lineHeight:1.6}}>
                    {txns.length===0?'Add your first transaction to activate AI analysis.':'Your AI advisor analyzes your income, expenses, goals and spending patterns to give you a personalized financial score and action plan.'}
                  </p>
                )}
              </div>
              <button onClick={runAI} disabled={aiLoading} style={{padding:'9px 16px',borderRadius:9,background:aiLoading?'rgba(255,255,255,.05)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:aiLoading?'rgba(255,255,255,.35)':'#fff',border:'none',cursor:aiLoading?'not-allowed':'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap',flexShrink:0,marginLeft:16,boxShadow:aiLoading?'none':'0 4px 14px rgba(26,107,255,.25)'}}>
                {aiLoading?'Analyzing...':'Run Analysis'}
              </button>
            </div>
            {aiError&&<div style={{fontSize:12,color:'#ef4444',marginBottom:8}}>{aiError}</div>}
            {aiInsight?.top_actions&&aiInsight.top_actions.length>0&&(
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {aiInsight.top_actions.slice(0,2).map((a:any,i:number)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,background:'rgba(255,255,255,.04)',borderRadius:8,padding:'8px 12px'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:i===0?'rgba(0,242,255,.15)':'rgba(167,139,250,.12)',border:`1px solid ${i===0?'rgba(0,242,255,.3)':'rgba(167,139,250,.25)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:i===0?'#00f2ff':'#a78bfa',flexShrink:0,fontFamily:"'Orbitron',monospace"}}>{a.priority}</div>
                    <div>
                      <div style={{fontSize:12,color:'#e2e8f0',marginBottom:2}}>{a.action}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{a.impact}</div>
                    </div>
                    <span style={{marginLeft:'auto',fontSize:10,padding:'2px 8px',borderRadius:100,background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.4)',flexShrink:0}}>{a.urgency?.replace('_',' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {aiInsight?.spending_alerts&&aiInsight.spending_alerts.length>0&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',flexWrap:'wrap',gap:8}}>
            {aiInsight.spending_alerts.map((a:any,i:number)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',borderRadius:100,background:a.severity==='critical'?'rgba(239,68,68,.1)':'rgba(245,158,11,.08)',border:`1px solid ${a.severity==='critical'?'rgba(239,68,68,.25)':'rgba(245,158,11,.2)'}`,fontSize:11,color:a.severity==='critical'?'#ef4444':'#f59e0b'}}>
                <span style={{fontSize:9}}>{a.severity==='critical'?'!':'~'}</span>{a.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[
          {label:'Income',value:f(income),change:ic,color:'#10b981',bg:'rgba(16,185,129,.07)',border:'rgba(16,185,129,.18)',inv:false},
          {label:'Expenses',value:f(expenses),change:ec,color:'#ef4444',bg:'rgba(239,68,68,.07)',border:'rgba(239,68,68,.18)',inv:true},
          {label:'Net Cash Flow',value:f(net),change:null,color:net>=0?'#10b981':'#ef4444',bg:net>=0?'rgba(16,185,129,.07)':'rgba(239,68,68,.07)',border:net>=0?'rgba(16,185,129,.18)':'rgba(239,68,68,.18)'},
          {label:'Savings Rate',value:sr+'%',change:null,color:sr>=20?'#a78bfa':'#f59e0b',bg:'rgba(124,58,237,.07)',border:'rgba(124,58,237,.18)'},
        ].map(c=>(
          <div key={c.label} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:'18px 20px',transition:'transform .2s',cursor:'default'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.08em'}}>{c.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:c.color,fontFamily:"'Roboto Mono',monospace",marginBottom:5}}>{c.value}</div>
            {c.change!==null&&li>0&&<div style={{fontSize:11,color:(c.inv?c.change<0:c.change>=0)?'#10b981':'#ef4444'}}>{fp(c.change)} vs last month</div>}
            {c.change===null&&<div style={{fontSize:11,color:'rgba(255,255,255,.22)'}}>This month</div>}
          </div>
        ))}
      </div>

      {/* Cashflow Forecast */}
      {aiInsight?.cashflow_forecast&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20,backdropFilter:'blur(12px)'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Cashflow Forecast</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[['30 Days',aiInsight.cashflow_forecast['30_days']],['60 Days',aiInsight.cashflow_forecast['60_days']],['90 Days',aiInsight.cashflow_forecast['90_days']]].map(([label,val]:any)=>(
              <div key={label} style={{background:'rgba(255,255,255,.04)',borderRadius:10,padding:'12px 16px',textAlign:'center'}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:6}}>{label}</div>
                <div style={{fontSize:18,fontWeight:700,color:val>=0?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{f(val)}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:'rgba(255,255,255,.2)',marginTop:10}}>Confidence: {aiInsight.cashflow_forecast.confidence} — based on your last 30 days of transactions</div>
        </div>
      )}

      {/* Budget + Goals row */}
      {(budgets.length>0||goals.length>0)&&(
        <div style={{display:'grid',gridTemplateColumns:budgets.length>0&&goals.length>0?'1fr 1fr':'1fr',gap:16,marginBottom:20}}>
          {budgets.length>0&&(
            <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,backdropFilter:'blur(12px)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:"'Orbitron',monospace"}}>Budgets</span>
                <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {budgets.slice(0,4).map((b:any)=>{const sp=cs[b.category]||0;const pct=Math.min(100,Math.round((sp/Number(b.amount))*100));const ov=pct>=100;return(
                  <div key={b.id}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:12,color:'rgba(255,255,255,.55)'}}>{b.category}</span><span style={{fontSize:12,color:ov?'#ef4444':'rgba(255,255,255,.35)'}}>{f(sp)}/{f(Number(b.amount))}</span></div>
                    <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:5}}><div style={{background:ov?'#ef4444':pct>80?'#f59e0b':'#10b981',borderRadius:100,height:5,width:pct+'%',transition:'width .5s'}}/></div>
                  </div>
                );})}
              </div>
            </div>
          )}
          {goals.length>0&&(
            <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,backdropFilter:'blur(12px)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:"'Orbitron',monospace"}}>Savings Goals</span>
                <Link href="/dashboard/autopilot" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>Manage</Link>
              </div>
              {goals.slice(0,3).map((g:any)=>{
                const p=Math.min(100,Math.round((Number(g.current_amount)/Number(g.target_amount))*100));
                const aiRec=aiInsight?.goal_recommendations?.find((r:any)=>r.goal_name===g.name);
                return(
                  <div key={g.id} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13,color:'rgba(255,255,255,.7)'}}>{g.name}</span><span style={{fontSize:12,color:'#a78bfa'}}>{p}%</span></div>
                    <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:6}}><div style={{background:'linear-gradient(90deg,#7c00ff,#a78bfa)',borderRadius:100,height:6,width:p+'%',transition:'width .6s',boxShadow:p>50?'0 0 8px rgba(167,139,250,.3)':'none'}}/></div>
                    {aiRec&&<div style={{fontSize:10,color:'rgba(0,242,255,.6)',marginTop:3}}>AI: {aiRec.months_at_current_rate}mo now → {aiRec.months_if_following_advice}mo with advice</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modules */}
      <div style={{fontSize:10,color:'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12,fontFamily:"'Orbitron',monospace"}}>Control Modules</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {MODULES.map(m=>(
          <Link key={m.href} href={m.href} style={{textDecoration:'none'}}>
            <div style={{background:'rgba(13,17,23,.8)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:18,cursor:'pointer',transition:'all .2s',backdropFilter:'blur(12px)'}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=m.color+'40';el.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,255,255,.07)';el.style.transform='translateY(0)';}}>
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
      {txns.length>0?(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span style={{fontSize:11,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:"'Orbitron',monospace"}}>Recent Transactions</span>
            <Link href="/dashboard/mission" style={{fontSize:11,color:'#60a5fa',textDecoration:'none'}}>View all</Link>
          </div>
          {txns.slice(0,6).map((t:any)=>(
            <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:t.type==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}</div>
                <div><div style={{fontSize:13,color:'#e2e8f0',marginBottom:2}}>{t.description}</div><div style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{t.category} — {new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div></div>
              </div>
              <span style={{fontSize:14,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}{f(Number(t.amount))}</span>
            </div>
          ))}
        </div>
      ):(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'48px 24px',textAlign:'center',backdropFilter:'blur(12px)'}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:36,fontWeight:900,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:12}}>FF</div>
          <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:15,color:'rgba(255,255,255,.55)',marginBottom:8}}>Mission Control Ready</h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:24}}>Log your first transaction to activate AI analysis and financial scoring.</p>
          <button onClick={()=>setShowAdd(true)} style={{padding:'11px 28px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 20px rgba(26,107,255,.3)'}}>+ Log First Transaction</button>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(4px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:28,width:'100%',maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:'#00f2ff'}}>Quick Add</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,lineHeight:1}}>x</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {(['income','expense'] as const).map(t=>(
                <button key={t} onClick={()=>setTxType(t)} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid',borderColor:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.1)',background:txType===t?(t==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)'):'transparent',color:txType===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.4)',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                  {t==='income'?'Income':'Expense'}
                </button>
              ))}
            </div>
            <div style={{marginBottom:10}}><input value={txDesc} onChange={e=>setTxDesc(e.target.value)} placeholder="Description" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <input type="number" value={txAmt} onChange={e=>setTxAmt(e.target.value)} placeholder="Amount ($)" style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
              <input type="date" value={txDate} onChange={e=>setTxDate(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor='rgba(0,212,255,.4)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
            </div>
            <div style={{marginBottom:20}}>
              <select value={txCat} onChange={e=>setTxCat(e.target.value)} style={{...inp,background:'rgba(13,17,23,.95)'}}>
                {['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Shopping','Utilities','Freelance','Salary','Other'].map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <button onClick={addTx} disabled={!txDesc.trim()||!txAmt||txSaving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:txSaving?.7:1,boxShadow:'0 4px 20px rgba(26,107,255,.3)'}}>
              {txSaving?'Saving...':'Add Transaction'}
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Drawer */}
      {chatOpen&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:1000,backdropFilter:'blur(4px)'}} onClick={()=>setChatOpen(false)}>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:'100%',maxWidth:400,background:'#0d1117',borderLeft:'1px solid rgba(255,255,255,.08)',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:'#00f2ff',marginBottom:2}}>AI Financial Advisor</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>Ask anything about your finances</div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:20}}>x</button>
            </div>
            <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12}}>
              {chatHistory.length===0&&(
                <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.3)',marginBottom:4}}>Try asking:</div>
                  {['Can I afford a $500 laptop next month?','What is my biggest spending problem?','How do I save $1,000 faster?'].map(q=>(
                    <button key={q} onClick={()=>{setChatMsg(q);}} style={{padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',color:'rgba(255,255,255,.55)',cursor:'pointer',fontSize:12,textAlign:'left',fontFamily:"'Inter',sans-serif"}}>{q}</button>
                  ))}
                </div>
              )}
              {chatHistory.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'85%',padding:'10px 14px',borderRadius:m.role==='user'?'12px 12px 4px 12px':'12px 12px 12px 4px',background:m.role==='user'?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.07)',fontSize:13,color:'#e2e8f0',lineHeight:1.5}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading&&<div style={{display:'flex',gap:4,padding:'10px 14px',background:'rgba(255,255,255,.07)',borderRadius:'12px 12px 12px 4px',width:'fit-content'}}>
                {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.4)',animation:'pulse 1.4s infinite',animationDelay:`${i*0.2}s`}}/>)}
              </div>}
            </div>
            <div style={{padding:16,borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',gap:8}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Ask your financial advisor..." style={{...inp,flex:1}}/>
              <button onClick={sendChat} disabled={!chatMsg.trim()||chatLoading} style={{padding:'10px 16px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:!chatMsg.trim()||chatLoading?.5:1}}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
