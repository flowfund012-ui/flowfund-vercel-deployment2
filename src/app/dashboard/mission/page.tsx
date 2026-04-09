'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f=(n:number)=>'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const CATS=['Food','Transport','Housing','Entertainment','Health','Business','Savings','Education','Shopping','Utilities','Freelance','Salary','Other'];
export default function MissionPage(){
  const [uid,setUid]=useState('');const [token,setToken]=useState('');
  const [txns,setTxns]=useState<any[]>([]);const [budgets,setBudgets]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);const [showBudget,setShowBudget]=useState(false);
  const [aiTip,setAiTip]=useState('');const [aiLoading,setAiLoading]=useState(false);
  const [filter,setFilter]=useState<'all'|'income'|'expense'>('all');
  const [search,setSearch]=useState('');
  const [form,setForm]=useState({desc:'',amount:'',type:'income' as 'income'|'expense',cat:'Salary',date:new Date().toISOString().split('T')[0],notes:''});
  const [budForm,setBudForm]=useState({category:'Food',amount:'',month:new Date().getMonth()+1,year:new Date().getFullYear()});
  const [saving,setSaving]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      setUid(session.user.id);setToken(session.access_token);
      const[{data:t},{data:b}]=await Promise.all([
        sb.from('transactions').select('*').eq('user_id',session.user.id).order('date',{ascending:false}).limit(300),
        sb.from('budgets').select('*').eq('user_id',session.user.id).eq('month',new Date().getMonth()+1).eq('year',new Date().getFullYear()),
      ]);
      setTxns(t??[]);setBudgets(b??[]);setLoading(false);
    });
  },[]);
  const now=new Date();
  const tm=txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const income=tm.filter(t=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const expenses=tm.filter(t=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const net=income-expenses;
  const cs:Record<string,number>={};
  tm.filter(t=>t.type==='expense').forEach((t:any)=>{cs[t.category]=(cs[t.category]||0)+Number(t.amount);});
  const topCat=Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const addTx=async()=>{
    if(!form.desc.trim()||!form.amount)return;setSaving(true);
    const{data}=await sb.from('transactions').insert({user_id:uid,type:form.type,description:form.desc.trim(),amount:parseFloat(form.amount),category:form.cat,date:form.date,notes:form.notes||null}).select().single();
    if(data)setTxns(p=>[data,...p]);
    setShowAdd(false);setForm({desc:'',amount:'',type:'income',cat:'Salary',date:new Date().toISOString().split('T')[0],notes:''});setSaving(false);
  };
  const addBudget=async()=>{
    if(!budForm.amount)return;setSaving(true);
    const{data}=await sb.from('budgets').upsert({user_id:uid,...budForm,amount:parseFloat(budForm.amount)},{onConflict:'user_id,category,month,year'}).select().single();
    if(data)setBudgets(p=>{const idx=p.findIndex(b=>b.category===data.category);if(idx>=0){const n=[...p];n[idx]=data;return n;}return[...p,data];});
    setShowBudget(false);setBudForm({category:'Food',amount:'',month:new Date().getMonth()+1,year:new Date().getFullYear()});setSaving(false);
  };
  const delTx=async(id:string)=>{setTxns(p=>p.filter(t=>t.id!==id));await sb.from('transactions').delete().eq('id',id);};
  const getAITip=async()=>{
    setAiLoading(true);setAiTip('');
    try{
      const context={income,expenses,net,savings_rate:income>0?Math.round((net/income)*100):0,top_categories:topCat.map(([c,a])=>({category:c,amount:a})),budget_status:budgets.map(b=>({category:b.category,budget:Number(b.amount),spent:cs[b.category]||0,over:(cs[b.category]||0)>Number(b.amount)}))};
      const prompt=`Financial data: ${JSON.stringify(context)}\n\nGive ONE specific, actionable spending tip for this month. 2 sentences max. Use actual numbers from the data. Be direct, no fluff.`;
      const res=await fetch('/api/ai/analyze',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({prompt,max_tokens:120})});
      const d=await res.json();setAiTip(d.content||'No tip available.');
    }catch{setAiTip('AI temporarily unavailable.');}
    setAiLoading(false);
  };
  const filtered=txns.filter(t=>{if(filter!=='all'&&t.type!==filter)return false;if(search&&!t.description.toLowerCase().includes(search.toLowerCase())&&!t.category.toLowerCase().includes(search.toLowerCase()))return false;return true;});
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif"};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#00f2ff',marginBottom:4}}>Mission Tracker</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Track every dollar. {now.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowBudget(true)} style={{padding:'9px 14px',borderRadius:9,background:'rgba(0,242,255,.08)',border:'1px solid rgba(0,242,255,.2)',color:'#00f2ff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>+ Budget</button>
          <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 14px rgba(26,107,255,.3)'}}>+ Transaction</button>
        </div>
      </div>
      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        {[{l:'Income',v:f(income),c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.18)'},{l:'Expenses',v:f(expenses),c:'#ef4444',bg:'rgba(239,68,68,.07)',b:'rgba(239,68,68,.18)'},{l:'Net',v:f(net),c:net>=0?'#10b981':'#ef4444',bg:net>=0?'rgba(16,185,129,.07)':'rgba(239,68,68,.07)',b:net>=0?'rgba(16,185,129,.18)':'rgba(239,68,68,.18)'}].map(c=>(
          <div key={c.l} style={{background:c.bg,border:`1px solid ${c.b}`,borderRadius:14,padding:'16px 18px'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:7,textTransform:'uppercase',letterSpacing:'.08em'}}>{c.l}</div>
            <div style={{fontSize:22,fontWeight:700,color:c.c,fontFamily:"'Roboto Mono',monospace"}}>{c.v}</div>
          </div>
        ))}
      </div>
      {/* Budgets */}
      {budgets.length>0&&(
        <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Budget vs Actual</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
            {budgets.map(b=>{const sp=cs[b.category]||0;const pct=Math.min(100,Math.round((sp/Number(b.amount))*100));const ov=pct>=100;return(
              <div key={b.id} style={{background:ov?'rgba(239,68,68,.06)':'rgba(255,255,255,.03)',border:`1px solid ${ov?'rgba(239,68,68,.2)':'rgba(255,255,255,.07)'}`,borderRadius:10,padding:'12px 14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                  <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>{b.category}</span>
                  <span style={{fontSize:11,color:ov?'#ef4444':'rgba(255,255,255,.35)'}}>{pct}%</span>
                </div>
                <div style={{background:'rgba(255,255,255,.08)',borderRadius:100,height:5,marginBottom:6}}><div style={{background:ov?'#ef4444':pct>80?'#f59e0b':'#10b981',borderRadius:100,height:5,width:pct+'%',transition:'width .5s'}}/></div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{f(sp)} / {f(Number(b.amount))}</div>
              </div>
            );})}
          </div>
        </div>
      )}
      {/* Top spending + AI tip */}
      {topCat.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
          <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Top Spending</div>
            {topCat.map(([cat,amt])=>(
              <div key={cat} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>{cat}</span><span style={{fontSize:12,color:'rgba(255,255,255,.4)',fontFamily:"'Roboto Mono',monospace"}}>{f(amt)}</span></div>
                  <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:4}}><div style={{background:'linear-gradient(90deg,#1a6bff,#7c00ff)',borderRadius:100,height:4,width:income>0?Math.min(100,Math.round((amt/income)*100))+'%':'0%',transition:'width .6s'}}/></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(0,242,255,.15)',borderRadius:14,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontSize:10,color:'#00f2ff',textTransform:'uppercase',letterSpacing:'.1em',fontFamily:"'Orbitron',monospace"}}>AI Spending Tip</div>
              <button onClick={getAITip} disabled={aiLoading} style={{padding:'5px 12px',borderRadius:7,background:aiLoading?'rgba(255,255,255,.05)':'rgba(26,107,255,.15)',border:'1px solid rgba(26,107,255,.3)',color:'#60a5fa',cursor:aiLoading?'not-allowed':'pointer',fontSize:11,fontFamily:"'Inter',sans-serif"}}>
                {aiLoading?'..':'Get tip'}
              </button>
            </div>
            {aiTip?<p style={{fontSize:13,color:'rgba(255,255,255,.7)',lineHeight:1.65}}>{aiTip}</p>
            :<p style={{fontSize:12,color:'rgba(255,255,255,.3)',lineHeight:1.6}}>Click "Get tip" for an AI insight on your spending this month.</p>}
          </div>
        </div>
      )}
      {/* Transactions list */}
      <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..." style={{...inp,flex:1,minWidth:180,padding:'8px 14px'}}/>
          <div style={{display:'flex',gap:6}}>
            {(['all','income','expense'] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:'7px 14px',borderRadius:8,fontSize:12,border:'1px solid',borderColor:filter===f?'#1a6bff':'rgba(255,255,255,.1)',background:filter===f?'rgba(26,107,255,.15)':'transparent',color:filter===f?'#60a5fa':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",textTransform:'capitalize'}}>{f}</button>
            ))}
          </div>
        </div>
        {filtered.length===0?<div style={{textAlign:'center',padding:'32px 0',color:'rgba(255,255,255,.3)',fontSize:13}}>No transactions found.</div>:filtered.slice(0,50).map((t:any)=>(
          <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:t.type==='income'?'rgba(16,185,129,.1)':'rgba(239,68,68,.09)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace",flexShrink:0}}>{t.type==='income'?'+':'-'}</div>
              <div>
                <div style={{fontSize:13,color:'#e2e8f0',marginBottom:1}}>{t.description}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{t.category} · {new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:14,fontWeight:700,color:t.type==='income'?'#10b981':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{t.type==='income'?'+':'-'}{f(Number(t.amount))}</span>
              <button onClick={()=>delTx(t.id)} style={{background:'none',border:'none',color:'rgba(239,68,68,.35)',cursor:'pointer',fontSize:16,padding:0,lineHeight:1}}>×</button>
            </div>
          </div>
        ))}
      </div>
      {/* Add Transaction Modal */}
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.78)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(4px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,padding:28,width:'100%',maxWidth:440,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:'#00f2ff'}}>Add Transaction</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,padding:0}}>×</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {(['income','expense'] as const).map(t=>(
                <button key={t} onClick={()=>setForm(p=>({...p,type:t,cat:t==='income'?'Salary':'Food'}))} style={{flex:1,padding:'10px',borderRadius:9,border:'1px solid',borderColor:form.type===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.1)',background:form.type===t?(t==='income'?'rgba(16,185,129,.12)':'rgba(239,68,68,.12)'):'transparent',color:form.type===t?(t==='income'?'#10b981':'#ef4444'):'rgba(255,255,255,.4)',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                  {t==='income'?'+ Income':'− Expense'}
                </button>
              ))}
            </div>
            {[{l:'Description',k:'desc',p:'e.g. Monthly salary'},{l:'Amount ($)',k:'amount',p:'0.00',t:'number'},{l:'Date',k:'date',p:'',t:'date'}].map(field=>(
              <div key={field.k} style={{marginBottom:12}}>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>{field.l}</label>
                <input type={field.t||'text'} value={(form as any)[field.k]} onChange={e=>setForm(p=>({...p,[field.k]:e.target.value}))} placeholder={field.p} style={inp}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>Category</label>
              <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                {CATS.map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>Notes (optional)</label>
              <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Optional notes" style={inp}/>
            </div>
            <button onClick={addTx} disabled={!form.desc.trim()||!form.amount||saving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?.6:1}}>
              {saving?'Saving...':'Add Transaction'}
            </button>
          </div>
        </div>
      )}
      {/* Add Budget Modal */}
      {showBudget&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowBudget(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.78)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(4px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(0,242,255,.2)',borderRadius:18,padding:28,width:'100%',maxWidth:380}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,color:'#00f2ff'}}>Set Budget</span>
              <button onClick={()=>setShowBudget(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:22,padding:0}}>×</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>Category</label>
              <select value={budForm.category} onChange={e=>setBudForm(p=>({...p,category:e.target.value}))} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                {CATS.filter(c=>!['Salary','Freelance'].includes(c)).map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <div style={{marginBottom:22}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>Monthly Budget ($)</label>
              <input type="number" value={budForm.amount} onChange={e=>setBudForm(p=>({...p,amount:e.target.value}))} placeholder="e.g. 400" style={inp}/>
            </div>
            <button onClick={addBudget} disabled={!budForm.amount||saving} style={{width:'100%',padding:'12px',borderRadius:10,background:'linear-gradient(135deg,#00b4d8,#0077b6)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?.6:1}}>
              {saving?'Saving...':'Set Budget'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
