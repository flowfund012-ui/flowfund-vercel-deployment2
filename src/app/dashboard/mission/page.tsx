'use client';
import{useEffect,useState,useRef}from'react';
import{createClient}from'@supabase/supabase-js';
export const dynamic='force-dynamic';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const CATS=['Food','Transport','Housing','Entertainment','Health','Business','Savings','Other'];
const CAT_ICONS:Record<string,string>={Food:'🍔',Transport:'🚗',Housing:'🏠',Entertainment:'🎮',Health:'💊',Business:'💼',Savings:'🏦',Other:'📦'};
const CAT_COLORS:Record<string,string>={Food:'#ff7043',Transport:'#29b6f6',Housing:'#ab47bc',Entertainment:'#00f2ff',Health:'#ec407a',Business:'#EBC96D',Savings:'#66bb6a',Other:'#78909c'};
const fm=(n:number)=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fd=(s:string)=>new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
export default function MissionPage(){
  const[txns,setTxns]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(false);
  const[type,setType]=useState<'income'|'expense'>('income');
  const[desc,setDesc]=useState('');
  const[amt,setAmt]=useState('');
  const[cat,setCat]=useState('Business');
  const[date,setDate]=useState(new Date().toISOString().split('T')[0]);
  const[filter,setFilter]=useState('all');
  const[search,setSearch]=useState('');
  const[saving,setSaving]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const{data}=await sb.from('transactions').select('*').eq('user_id',session.user.id).order('date',{ascending:false}).limit(100);
      setTxns(data??[]);
      setLoading(false);
    });
  },[]);
  const inc=txns.filter((t:any)=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const exp=txns.filter((t:any)=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
  const net=inc-exp;
  const sr=inc>0?Math.round(((inc-exp)/inc)*100):0;
  const filtered=txns.filter((t:any)=>{
    if(filter!=='all'&&t.type!==filter)return false;
    if(search&&!t.description?.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const handleSave=async()=>{
    if(!desc.trim()||!amt){return;}
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data,error}=await sb.from('transactions').insert({user_id:session.user.id,type,description:desc.trim(),amount:parseFloat(amt),category:cat,date,notes:''}).select().single();
    if(!error&&data){setTxns(p=>[data,...p]);setModal(false);setDesc('');setAmt('');}
    setSaving(false);
  };
  const handleDelete=async(id:string)=>{
    setTxns(p=>p.filter((t:any)=>t.id!==id));
    await sb.from('transactions').delete().eq('id',id);
  };
  const handleExport=()=>{
    const rows=txns.map((t:any)=>`${t.date},"${t.description}",${t.type},${t.category},${t.amount}`);
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(['Date,Description,Type,Category,Amount',...rows].join('\n'));
    a.download='flowfund-transactions.csv';a.click();
  };
  return(
    <div style={{padding:'0 0 40px'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20}}>
        <div><h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#fff',textShadow:'0 0 5px #00f2ff',marginBottom:5}}>Mission Tracker</h1><p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Track every financial move.</p></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-cyan btn-sm" onClick={handleExport}><i className="fas fa-download"/> Export</button>
          <button className="btn btn-primary btn-sm" onClick={()=>setModal(true)}><i className="fas fa-plus"/> Add Entry</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        {[{l:'Total Income',v:fm(inc),c:'#00f2ff'},{l:'Total Expenses',v:fm(exp),c:'#ff5252'},{l:'Net Flow',v:fm(net),c:net>=0?'#10b981':'#ff5252'},{l:'Savings Rate',v:sr+'%',c:'#a78bfa'}].map(s=>(
          <div key={s.l} style={{background:'rgba(0,78,100,.3)',border:'1px solid rgba(0,242,255,.2)',borderRadius:12,padding:'14px 16px'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:600,color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mission-panel" style={{padding:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#00f2ff'}}>Live Feed ({filtered.length})</span>
          <div style={{display:'flex',gap:8}}>
            <input className="ff-input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'5px 10px',width:130,fontSize:11}}/>
            <select className="ff-input" value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'5px 10px',width:'auto',fontSize:11}}>
              <option value="all">All</option><option value="income">Income</option><option value="expense">Expenses</option>
            </select>
          </div>
        </div>
        {loading&&<div style={{textAlign:'center',padding:30,color:'rgba(255,255,255,.3)'}}>Loading...</div>}
        {!loading&&filtered.length===0&&<div style={{textAlign:'center',padding:30}}><div style={{fontSize:32,marginBottom:8}}>💸</div><div style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>No transactions yet — add your first one!</div></div>}
        {filtered.map((t:any)=>(
          <div key={t.id} className="tx-item">
            <div className="tx-icon-wrap" style={{background:(CAT_COLORS[t.category]??'#666')+'20'}}>{CAT_ICONS[t.category]??'📦'}</div>
            <div style={{flex:1}}><div className="tx-name">{t.description}</div><div className="tx-meta">{t.category} · {fd(t.date)}</div></div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:600,color:t.type==='income'?'#7BBF8B':'#EBC96D'}}>{t.type==='income'?'+':'-'}{fm(Number(t.amount))}</div>
            </div>
            <button onClick={()=>handleDelete(t.id)} style={{background:'none',border:'none',color:'rgba(255,82,82,.35)',cursor:'pointer',fontSize:12,padding:'4px 6px',marginLeft:4}} onMouseEnter={e=>(e.currentTarget.style.color='#ff5252')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,82,82,.35)')}>✕</button>
          </div>
        ))}
      </div>
      {modal&&(
        <div className="ff-modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
          <div className="ff-modal">
            <div className="ff-modal-hdr"><span className="ff-modal-title">Add Transaction</span><button className="ff-modal-x" onClick={()=>setModal(false)}>✕</button></div>
            <div className="ff-group"><label className="ff-label">Type</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <button className={'btn '+(type==='income'?'btn-primary':'btn-cyan')+' btn-block'} onClick={()=>setType('income')}>📈 Income</button>
                <button className={'btn '+(type==='expense'?'btn-primary':'btn-cyan')+' btn-block'} onClick={()=>setType('expense')}>📉 Expense</button>
              </div>
            </div>
            <div className="ff-row">
              <div className="ff-group"><label className="ff-label">Description</label><input className="ff-input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Salary"/></div>
              <div className="ff-group"><label className="ff-label">Amount ($)</label><input className="ff-input" type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00"/></div>
            </div>
            <div className="ff-row">
              <div className="ff-group"><label className="ff-label">Category</label><select className="ff-input" value={cat} onChange={e=>setCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="ff-group"><label className="ff-label">Date</label><input className="ff-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Transaction'}</button>
          </div>
        </div>
      )}
    </div>
  );
}