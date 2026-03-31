'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const fm=(n:number)=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fd=(s:string)=>new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
export default function GrowthPage(){
  const[revenues,setRevenues]=useState<any[]>([]);
  const[expenses,setExpenses]=useState(0);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(false);
  const[src,setSrc]=useState('');
  const[amt,setAmt]=useState('');
  const[rType,setRType]=useState('Recurring');
  const[rDate,setRDate]=useState(new Date().toISOString().split('T')[0]);
  const[saving,setSaving]=useState(false);
  const[simPrice,setSimPrice]=useState(49);
  const[simConv,setSimConv]=useState(100);
  useEffect(()=>{sb.auth.getSession().then(async({data:{session}})=>{if(!session){setLoading(false);return;}const uid=session.user.id;const[{data:rev},{data:txns}]=await Promise.all([sb.from('revenue_entries').select('*').eq('user_id',uid).order('date',{ascending:false}),sb.from('transactions').select('type,amount').eq('user_id',uid)]);setRevenues(rev??[]);const exp=(txns??[]).filter((t:any)=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);setExpenses(exp);setLoading(false);});},[]);
  const totalRev=revenues.reduce((s:number,r:any)=>s+Number(r.amount),0);
  const mrr=revenues.filter((r:any)=>r.type==='Recurring').reduce((s:number,r:any)=>s+Number(r.amount),0);
  const profit=totalRev-expenses;
  const simMRR=simPrice*simConv;
  const addRev=async()=>{if(!src.trim()||!amt)return;setSaving(true);const{data:{session}}=await sb.auth.getSession();if(!session){setSaving(false);return;}const{data}=await sb.from('revenue_entries').insert({user_id:session.user.id,source:src.trim(),amount:parseFloat(amt),type:rType,date:rDate}).select().single();if(data)setRevenues(p=>[data,...p]);setModal(false);setSrc('');setAmt('');setSaving(false);};
  const delRev=async(id:string)=>{setRevenues(p=>p.filter((r:any)=>r.id!==id));await sb.from('revenue_entries').delete().eq('id',id);};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Growth Engine...</div>;
  return(<div style={{padding:'0 0 40px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
      <div><h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#2dd4bf',marginBottom:5}}>Growth Engine</h1><p style={{fontSize:12,color:'rgba(224,242,254,.38)'}}>Business intelligence and revenue tracking.</p></div>
      <button className="btn btn-primary btn-sm" onClick={()=>setModal(true)}>+ Log Revenue</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
      {[{l:'Total Revenue',v:fm(totalRev),c:'#2dd4bf'},{l:'MRR',v:fm(mrr),c:'#34d399'},{l:'Net Profit',v:fm(profit),c:profit>=0?'#10b981':'#ff5252'},{l:'Entries',v:String(revenues.length),c:'#f59e0b'}].map(s=>(<div key={s.l} style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:12,padding:'14px 16px'}}><div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:600,color:s.c}}>{s.v}</div></div>))}
    </div>
    <div style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:14,padding:24,marginBottom:20}}>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#2dd4bf',marginBottom:16}}>💡 Revenue Simulator</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div><label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:6}}>Price per Unit: {fm(simPrice)}</label><input type="range" min={1} max={999} value={simPrice} onChange={e=>setSimPrice(parseInt(e.target.value))} style={{width:'100%',accentColor:'#2dd4bf'}}/></div>
        <div><label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:6}}>Monthly Customers: {simConv}</label><input type="range" min={1} max={1000} value={simConv} onChange={e=>setSimConv(parseInt(e.target.value))} style={{width:'100%',accentColor:'#2dd4bf'}}/></div>
      </div>
      <div style={{marginTop:16,padding:16,background:'rgba(45,212,191,.08)',borderRadius:10,textAlign:'center'}}>
        <div style={{fontSize:11,color:'rgba(45,212,191,.6)',marginBottom:4}}>PROJECTED MRR</div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:32,color:'#2dd4bf',fontWeight:700}}>{fm(simMRR)}</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:4}}>ARR: {fm(simMRR*12)}</div>
      </div>
    </div>
    <div style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:14,padding:24}}>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#2dd4bf',marginBottom:14}}>Revenue Log</div>
      {revenues.length===0&&<div style={{textAlign:'center',padding:20,color:'rgba(255,255,255,.3)'}}>No revenue logged yet - add your first entry!</div>}
      {revenues.map((r:any)=>(<div key={r.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(45,212,191,.08)'}}><div><div style={{fontSize:13,color:'#e0f2fe'}}>{r.source}</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{r.type} · {fd(r.date)}</div></div><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,color:'#2dd4bf'}}>{fm(Number(r.amount))}</span><button onClick={()=>delRev(r.id)} style={{background:'none',border:'none',color:'rgba(255,82,82,.4)',cursor:'pointer'}}>✕</button></div></div>))}
    </div>
    {modal&&(<div className="ff-modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className="ff-modal"><div className="ff-modal-hdr"><span className="ff-modal-title">Log Revenue</span><button className="ff-modal-x" onClick={()=>setModal(false)}>✕</button></div><div className="ff-row"><div className="ff-group"><label className="ff-label">Source</label><input className="ff-input" value={src} onChange={e=>setSrc(e.target.value)} placeholder="e.g. Client Project"/></div><div className="ff-group"><label className="ff-label">Amount ($)</label><input className="ff-input" type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00"/></div></div><div className="ff-row"><div className="ff-group"><label className="ff-label">Type</label><select className="ff-input" value={rType} onChange={e=>setRType(e.target.value)}>{['Recurring','One-time','Passive','Other'].map(t=><option key={t}>{t}</option>)}</select></div><div className="ff-group"><label className="ff-label">Date</label><input className="ff-input" type="date" value={rDate} onChange={e=>setRDate(e.target.value)}/></div></div><button className="btn btn-primary btn-block" onClick={addRev} disabled={saving}>{saving?'Saving...':'Log Revenue'}</button></div></div>)}
  </div>);
}