'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { t, getLangFromStorage } from '@/lib/i18n';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f = (n:number) => '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fp = (n:number) => (n>=0?'+':'')+n.toFixed(1)+'%';
const TYPES=['SaaS','Consulting','Freelance','Product','Agency','Other'];
export default function GrowthPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [clients, setClients] = useState('1');
  const [arpu, setArpu] = useState('29');
  const [churn, setChurn] = useState('5');
  const [saving, setSaving] = useState(false);
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState('SaaS');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(true);
  const [lang, setLang] = useState('en');
  useEffect(() => {
    setLang(getLangFromStorage());
    sb.auth.getSession().then(async ({data:{session}}) => {
      if(!session){setLoading(false);return;}
      const{data}=await sb.from('revenue_entries').select('*').eq('user_id',session.user.id).order('date',{ascending:false});
      setEntries(data??[]); setLoading(false);
    });
  },[]);
  const addEntry = async () => {
    if(!desc.trim()||!amt)return; setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data}=await sb.from('revenue_entries').insert({user_id:session.user.id,description:desc.trim(),amount:parseFloat(amt),revenue_type:type,date,is_recurring:isRecurring}).select().single();
    if(data)setEntries(p=>[data,...p]);
    setShowAdd(false);setDesc('');setAmt('');setSaving(false);
  };
  const now = new Date();
  const thisMonth = entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  const lastMonth = entries.filter(e=>{const d=new Date(e.date);const l=new Date(now.getFullYear(),now.getMonth()-1,1);return d.getMonth()===l.getMonth()&&d.getFullYear()===l.getFullYear();});
  const mrr = thisMonth.filter(e=>e.is_recurring).reduce((s:number,e:any)=>s+Number(e.amount),0);
  const oneTime = thisMonth.filter(e=>!e.is_recurring).reduce((s:number,e:any)=>s+Number(e.amount),0);
  const totalRev = mrr+oneTime;
  const lastTotal = lastMonth.reduce((s:number,e:any)=>s+Number(e.amount),0);
  const revChange = lastTotal>0?((totalRev-lastTotal)/lastTotal)*100:0;
  const simMrr = Number(clients)*Number(arpu);
  const simChurnLost = simMrr*(Number(churn)/100);
  const simNet = simMrr - simChurnLost;
  const simArr = simNet*12;
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'9px 12px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none'};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>{t(lang,'loading')} {t(lang,'growth')}...</div>;
  return (
    <div style={{padding:'0 0 48px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#2dd4bf',marginBottom:4}}>{t(lang,'growth')}</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>{t(lang,'growth_subtitle')}</p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{padding:'9px 18px',borderRadius:10,background:'linear-gradient(135deg,#2dd4bf,#1a6bff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700}}>+ {t(lang,'revenue')}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[
          {l:t(lang,'total_revenue'),v:f(totalRev),change:revChange,c:'#2dd4bf',bg:'rgba(45,212,191,.06)',border:'rgba(45,212,191,.2)'},
          {l:t(lang,'mrr'),v:f(mrr),change:null,c:'#10b981',bg:'rgba(16,185,129,.06)',border:'rgba(16,185,129,.2)'},
          {l:t(lang,'one_time'),v:f(oneTime),change:null,c:'#60a5fa',bg:'rgba(96,165,250,.06)',border:'rgba(96,165,250,.2)'},
          {l:t(lang,'arr_projected'),v:f(mrr*12),change:null,c:'#a78bfa',bg:'rgba(167,139,250,.06)',border:'rgba(167,139,250,.2)'},
        ].map(c=>(
          <div key={c.l} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:'16px 18px',transition:'transform .2s'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.05em'}}>{c.l}</div>
            <div style={{fontSize:22,fontWeight:700,color:c.c,fontFamily:"'Roboto Mono',monospace",marginBottom:4}}>{c.v}</div>
            {c.change!==null&&lastTotal>0&&<div style={{fontSize:11,color:c.change>=0?'#10b981':'#ef4444'}}>{fp(c.change)} {t(lang,'vs_last_month')}</div>}
            {c.change===null&&<div style={{fontSize:11,color:'rgba(255,255,255,.25)'}}>{t(lang,'this_month')}</div>}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(45,212,191,.15)',borderRadius:14,padding:22}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#2dd4bf',marginBottom:16}}>{t(lang,'mrr_simulator')}</div>
          {[{l:t(lang,'active_clients'),v:clients,s:setClients,min:1,max:10000},{l:t(lang,'arpu'),v:arpu,s:setArpu,min:1,max:9999},{l:t(lang,'churn_rate'),v:churn,s:setChurn,min:0,max:100}].map(fi=>(
            <div key={fi.l} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <label style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{fi.l}</label>
                <span style={{fontSize:12,color:'#2dd4bf',fontFamily:"'Roboto Mono',monospace"}}>{fi.v}</span>
              </div>
              <input type="range" min={fi.min} max={fi.max} value={fi.v} onChange={e=>fi.s(e.target.value)} style={{width:'100%',accentColor:'#2dd4bf'}}/>
            </div>
          ))}
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',marginTop:16,paddingTop:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[{l:t(lang,'gross_mrr'),v:f(simMrr),c:'#2dd4bf'},{l:t(lang,'churn_lost'),v:f(simChurnLost),c:'#ef4444'},{l:t(lang,'net_mrr'),v:f(simNet),c:'#10b981'},{l:t(lang,'arr'),v:f(simArr),c:'#a78bfa'}].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,.04)',borderRadius:8,padding:'8px 12px'}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:3}}>{s.l}</div>
                <div style={{fontSize:15,fontWeight:700,color:s.c,fontFamily:"'Roboto Mono',monospace"}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:22}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#2dd4bf',marginBottom:14}}>{t(lang,'revenue_breakdown')}</div>
          {entries.length===0?<div style={{textAlign:'center',padding:'32px 0',color:'rgba(255,255,255,.3)',fontSize:13}}>{t(lang,'no_revenue_entries')}</div>:
          entries.slice(0,8).map((e:any)=>(
            <div key={e.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <div>
                <div style={{fontSize:13,color:'#e2e8f0',marginBottom:1}}>{e.description}</div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:10,padding:'1px 7px',borderRadius:100,background:'rgba(45,212,191,.1)',color:'#2dd4bf'}}>{e.revenue_type}</span>
                  {e.is_recurring&&<span style={{fontSize:10,padding:'1px 7px',borderRadius:100,background:'rgba(167,139,250,.1)',color:'#a78bfa'}}>{t(lang,'recurring')}</span>}
                  <span style={{fontSize:10,color:'rgba(255,255,255,.25)'}}>{new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                </div>
              </div>
              <span style={{fontSize:14,fontWeight:700,color:'#10b981',fontFamily:"'Roboto Mono',monospace"}}>+{f(Number(e.amount))}</span>
            </div>
          ))}
        </div>
      </div>
      {showAdd&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(45,212,191,.25)',borderRadius:16,padding:28,width:'100%',maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#2dd4bf'}}>{t(lang,'log_revenue')}</span>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:20}}>×</button>
            </div>
            <div style={{marginBottom:10}}><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder={t(lang,'revenue_desc_placeholder')} style={inp}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder={t(lang,'amount')} style={inp}/>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
            </div>
            <div style={{marginBottom:10}}><select value={type} onChange={e=>setType(e.target.value)} style={{...inp}}>{TYPES.map(tp=><option key={tp} style={{background:'#0d1117'}}>{tp}</option>)}</select></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,.04)',borderRadius:8,padding:'10px 14px',marginBottom:18}}>
              <span style={{fontSize:13,color:'#e2e8f0'}}>{t(lang,'recurring_revenue')}</span>
              <div onClick={()=>setIsRecurring(!isRecurring)} style={{width:40,height:22,borderRadius:100,background:isRecurring?'#2dd4bf':'rgba(255,255,255,.15)',cursor:'pointer',position:'relative',transition:'background .2s'}}>
                <div style={{position:'absolute',top:2,left:isRecurring?20:2,width:18,height:18,borderRadius:'50%',background:'white',transition:'left .2s'}}/>
              </div>
            </div>
            <button onClick={addEntry} disabled={!desc.trim()||!amt||saving} style={{width:'100%',padding:'11px',borderRadius:8,background:'linear-gradient(135deg,#2dd4bf,#1a6bff)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,opacity:saving?.7:1}}>{saving?t(lang,'saving'):t(lang,'log_revenue')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
