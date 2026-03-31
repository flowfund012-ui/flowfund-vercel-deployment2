'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const fmt=(n:number)=>{return'$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});};
const fmtDate=(s:string)=>new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
export default function GrowthPage(){
  const[revenues,setRevenues]=useState<any[]>([]);
  const[expenses,setExpenses]=useState(0);
  const[loading,setLoading]=useState(true);
  const[showModal,setShowModal]=useState(false);
  const[src,setSrc]=useState('');
  const[amt,setAmt]=useState('');
  const[rType,setRType]=useState('Recurring');
  const[rDate,setRDate]=useState(new Date().toISOString().split('T')[0]);
  const[saving,setSaving]=useState(false);
  const[simPrice,setSimPrice]=useState(49);
  const[simConv,setSimConv]=useState(100);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:rev},{data:txns}]=await Promise.all([
        sb.from('revenue_entries').select('*').eq('user_id',uid).order('date',{ascending:false}),
        sb.from('transactions').select('type,amount').eq('user_id',uid)
      ]);
      setRevenues(rev??[]);
      const exp=(txns??[]).filter((t:any)=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
      setExpenses(exp);
      setLoading(false);
    });
  },[]);
  const totalRev=revenues.reduce((s:number,r:any)=>s+Number(r.amount),0);
  const mrr=revenues.filter((r:any)=>r.type==='Recurring').reduce((s:number,r:any)=>s+Number(r.amount),0);
  const profit=totalRev-expenses;
  const simMRR=simPrice*simConv;
  const addRev=async()=>{
    if(!src.trim()||!amt)return;
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data}=await sb.from('revenue_entries').insert({user_id:session.user.id,source:src.trim(),amount:parseFloat(amt),type:rType,date:rDate}).select().single();
    if(data)setRevenues((p:any[])=>[data,...p]);
    setShowModal(false);setSrc('');setAmt('');setSaving(false);
  };
  const delRev=async(id:string)=>{
    setRevenues((p:any[])=>p.filter((r:any)=>r.id!==id));
    await sb.from('revenue_entries').delete().eq('id',id);
  };
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Growth Engine...</div>;
  const card=(label:string,value:string,color:string)=>(
    <div style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:12,padding:'14px 16px'}}>
      <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{label}</div>
      <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:600,color}}>{value}</div>
    </div>
  );
  return(
    <div style={{padding:'0 0 40px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#2dd4bf',marginBottom:5}}>Growth Engine</h1>
          <p style={{fontSize:12,color:'rgba(224,242,254,.38)'}}>Business intelligence and revenue tracking.</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{padding:'8px 16px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:600}}>+ Log Revenue</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {card('Total Revenue',fmt(totalRev),'#2dd4bf')}
        {card('MRR',fmt(mrr),'#34d399')}
        {card('Net Profit',fmt(profit),profit>=0?'#10b981':'#ff5252')}
        {card('Entries',String(revenues.length),'#f59e0b')}
      </div>
      <div style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:14,padding:24,marginBottom:20}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#2dd4bf',marginBottom:16}}>Revenue Simulator</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:6}}>Price per Unit: {fmt(simPrice)}</label>
            <input type="range" min={1} max={999} value={simPrice} onChange={e=>setSimPrice(parseInt(e.target.value))} style={{width:'100%',accentColor:'#2dd4bf'}}/>
          </div>
          <div>
            <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:6}}>Monthly Customers: {simConv}</label>
            <input type="range" min={1} max={1000} value={simConv} onChange={e=>setSimConv(parseInt(e.target.value))} style={{width:'100%',accentColor:'#2dd4bf'}}/>
          </div>
        </div>
        <div style={{marginTop:16,padding:16,background:'rgba(45,212,191,.08)',borderRadius:10,textAlign:'center'}}>
          <div style={{fontSize:11,color:'rgba(45,212,191,.6)',marginBottom:4}}>PROJECTED MRR</div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:32,color:'#2dd4bf',fontWeight:700}}>{fmt(simMRR)}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:4}}>ARR: {fmt(simMRR*12)}</div>
        </div>
      </div>
      <div style={{background:'rgba(10,26,53,.72)',border:'1px solid rgba(45,212,191,.28)',borderRadius:14,padding:24}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#2dd4bf',marginBottom:14}}>Revenue Log</div>
        {revenues.length===0&&<div style={{textAlign:'center',padding:20,color:'rgba(255,255,255,.3)'}}>No revenue logged yet - add your first entry!</div>}
        {revenues.map((r:any)=>(
          <div key={r.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(45,212,191,.08)'}}>
            <div>
              <div style={{fontSize:13,color:'#e0f2fe'}}>{r.source}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{r.type} - {fmtDate(r.date)}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,color:'#2dd4bf'}}>{fmt(Number(r.amount))}</span>
              <button onClick={()=>delRev(r.id)} style={{background:'none',border:'none',color:'rgba(255,82,82,.6)',cursor:'pointer',fontSize:16}}>x</button>
            </div>
          </div>
        ))}
      </div>
      {showModal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(45,212,191,.3)',borderRadius:16,padding:28,width:'100%',maxWidth:440}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,color:'#2dd4bf'}}>Log Revenue</span>
              <button onClick={()=>setShowModal(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.5)',cursor:'pointer',fontSize:18}}>x</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Source</label>
                <input value={src} onChange={e=>setSrc(e.target.value)} placeholder="e.g. Client Project" style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13,boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Amount ($)</label>
                <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00" style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13,boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Type</label>
                <select value={rType} onChange={e=>setRType(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13}}>
                  {['Recurring','One-time','Passive','Other'].map(t=><option key={t} style={{background:'#0d1117'}}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Date</label>
                <input type="date" value={rDate} onChange={e=>setRDate(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 10px',color:'#fff',fontSize:13,boxSizing:'border-box'}}/>
              </div>
            </div>
            <button onClick={addRev} disabled={saving} style={{width:'100%',padding:'10px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:600,opacity:saving?.7:1}}>
              {saving?'Saving...':'Log Revenue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
