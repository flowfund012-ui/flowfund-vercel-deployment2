'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const BANKS=['ABN AMRO','ANZ Bank','Barclays','Bank of America','Bank of Afghanistan','Bank Melli Iran','Citibank','Chase','Commonwealth Bank','Commerzbank','Deutsche Bank','Emirates NBD','First Abu Dhabi Bank','HSBC','ING Bank','JP Morgan','KBL Bank','Kabul Bank','Lloyds Bank','Maybank','National Bank of Pakistan','Pashtany Bank','Rabobank','Royal Bank of Canada','Standard Chartered','Santander','TD Bank','UniCredit','Wells Fargo','Westpac','Other / Custom'];
const fm=(n:number)=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
export default function BankSyncPage(){
  const[connections,setConnections]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[showForm,setShowForm]=useState(false);
  const[bankName,setBankName]=useState('');
  const[customBank,setCustomBank]=useState('');
  const[accountType,setAccountType]=useState('Checking');
  const[lastFour,setLastFour]=useState('');
  const[syncMethod,setSyncMethod]=useState('manual');
  const[saving,setSaving]=useState(false);
  const[csvFile,setCsvFile]=useState<File|null>(null);
  const[csvParsing,setCsvParsing]=useState(false);
  const[csvResult,setCsvResult]=useState('');
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const{data}=await sb.from('bank_connections').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false});
      setConnections(data??[]);setLoading(false);
    });
  },[]);
  const addConnection=async()=>{
    if(!bankName)return;
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const name=bankName==='Other / Custom'?customBank.trim()||'My Bank':bankName;
    const{data,error}=await sb.from('bank_connections').insert({user_id:session.user.id,bank_name:name,account_type:accountType,last_four:lastFour.slice(-4)||null,sync_method:syncMethod,status:'active'}).select().single();
    if(!error&&data){setConnections(p=>[data,...p]);setShowForm(false);setBankName('');setLastFour('');setCustomBank('');}
    setSaving(false);
  };
  const removeConnection=async(id:string)=>{
    setConnections(p=>p.filter(c=>c.id!==id));
    await sb.from('bank_connections').delete().eq('id',id);
  };
  const handleCsvUpload=async()=>{
    if(!csvFile)return;
    setCsvParsing(true);setCsvResult('');
    const text=await csvFile.text();
    const lines=text.split('\n').filter(l=>l.trim());
    const header=lines[0].toLowerCase();
    const dateIdx=header.split(',').findIndex((h:string)=>h.includes('date'));
    const descIdx=header.split(',').findIndex((h:string)=>h.includes('desc')||h.includes('name')||h.includes('detail'));
    const amtIdx=header.split(',').findIndex((h:string)=>h.includes('amount')||h.includes('debit')||h.includes('credit'));
    if(dateIdx<0||amtIdx<0){setCsvResult('Could not parse CSV. Make sure it has Date, Description, and Amount columns.');setCsvParsing(false);return;}
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setCsvParsing(false);return;}
    let imported=0;let skipped=0;
    for(let i=1;i<lines.length;i++){
      const cols=lines[i].split(',');
      const rawAmt=cols[amtIdx]?.replace(/[^0-9.\-]/g,'');
      const amount=parseFloat(rawAmt);
      if(isNaN(amount)||amount===0){skipped++;continue;}
      const date=cols[dateIdx]?.trim()||new Date().toISOString().split('T')[0];
      const description=cols[descIdx]?.trim()||'Imported transaction';
      const type=amount>0?'income':'expense';
      const{error}=await sb.from('transactions').insert({user_id:session.user.id,type,description,amount:Math.abs(amount),category:'Other',date:date.slice(0,10),notes:'CSV import'});
      if(!error)imported++;else skipped++;
    }
    setCsvResult(`Imported ${imported} transactions. Skipped ${skipped}.`);
    setCsvParsing(false);
  };
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Bank Sync...</div>;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#60a5fa',marginBottom:4}}>Bank Sync</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)'}}>Connect accounts, import CSV files, or add manually.</p>
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:'10px 20px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>+ Connect Account</button>
      </div>

      {showForm&&(
        <div style={{background:'rgba(13,17,23,.95)',border:'1px solid rgba(96,165,250,.25)',borderRadius:16,padding:24,marginBottom:20}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'#60a5fa',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:16}}>New Bank Connection</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
            <div>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Bank Name</label>
              <select value={bankName} onChange={e=>setBankName(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                <option value="">Select a bank...</option>
                {BANKS.map(b=><option key={b} value={b} style={{background:'#0d1117'}}>{b}</option>)}
              </select>
            </div>
            {bankName==='Other / Custom'&&(
              <div>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Custom Bank Name</label>
                <input value={customBank} onChange={e=>setCustomBank(e.target.value)} placeholder="Enter bank name" style={inp}/>
              </div>
            )}
            <div>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Account Type</label>
              <select value={accountType} onChange={e=>setAccountType(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                {['Checking','Savings','Business','Investment','Credit Card','Other'].map(t=><option key={t} style={{background:'#0d1117'}}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Last 4 Digits (optional)</label>
              <input value={lastFour} onChange={e=>setLastFour(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="1234" maxLength={4} style={inp}/>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>Sync Method</label>
            <div style={{display:'flex',gap:8}}>
              {[{id:'manual',label:'Manual Entry',col:'rgba(255,255,255,.5)'},{id:'csv',label:'CSV Import',col:'#00f2ff'},{id:'plaid',label:'Plaid (auto)',col:'#a78bfa'}].map(o=>(
                <button key={o.id} onClick={()=>setSyncMethod(o.id)} style={{flex:1,padding:'9px',borderRadius:8,background:syncMethod===o.id?'rgba(96,165,250,.1)':'rgba(255,255,255,.03)',border:`1px solid ${syncMethod===o.id?'rgba(96,165,250,.3)':'rgba(255,255,255,.08)'}`,color:syncMethod===o.id?'#60a5fa':'rgba(255,255,255,.4)',cursor:'pointer',fontSize:12,fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>
                  {o.label}{o.id==='plaid'?' 🔜':''}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:12}}>
            <button onClick={addConnection} disabled={saving||!bankName} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:(!bankName||saving)?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:(!bankName||saving)?0.5:1}}>{saving?'Adding...':'Add Account'}</button>
            <button onClick={()=>setShowForm(false)} style={{padding:'10px 20px',borderRadius:9,background:'transparent',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.5)',cursor:'pointer',fontSize:13,fontFamily:"'Inter',sans-serif"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* CSV Import Section */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(0,242,255,.15)',borderRadius:14,padding:22,marginBottom:16}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'#00f2ff',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>CSV Import</div>
        <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:14,lineHeight:1.6}}>Export your bank statement as CSV and upload it here. FlowFund will automatically parse Date, Description, and Amount columns and import your transactions.</p>
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <label style={{padding:'9px 18px',borderRadius:8,background:'rgba(0,242,255,.08)',border:'1px solid rgba(0,242,255,.2)',color:'#00f2ff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
            {csvFile?csvFile.name:'Choose CSV File'}
            <input type="file" accept=".csv,.txt" style={{display:'none'}} onChange={e=>setCsvFile(e.target.files?.[0]||null)}/>
          </label>
          {csvFile&&<button onClick={handleCsvUpload} disabled={csvParsing} style={{padding:'9px 20px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:csvParsing?0.7:1}}>{csvParsing?'Importing...':'Import Now'}</button>}
          {csvFile&&<button onClick={()=>{setCsvFile(null);setCsvResult('');}} style={{padding:'9px 14px',borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,.08)',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:12,fontFamily:"'Inter',sans-serif"}}>Clear</button>}
        </div>
        {csvResult&&<div style={{marginTop:12,padding:'9px 14px',borderRadius:8,background:csvResult.includes('Imported')?'rgba(16,185,129,.08)':'rgba(239,68,68,.08)',border:`1px solid ${csvResult.includes('Imported')?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}`,fontSize:12,color:csvResult.includes('Imported')?'#10b981':'#ef4444'}}>{csvResult}</div>}
      </div>

      {/* Connected Accounts */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:22}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'rgba(255,255,255,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:16}}>Connected Accounts ({connections.length})</div>
        {connections.length===0?(
          <div style={{textAlign:'center',padding:'28px 0'}}>
            <div style={{fontSize:28,marginBottom:10}}>🏦</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:6}}>No accounts connected yet.</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.18)'}}>Click "+ Connect Account" above to add your first bank.</div>
          </div>
        ):(
          connections.map(c=>(
            <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:38,height:38,borderRadius:10,background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🏦</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0'}}>{c.bank_name}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{c.account_type}{c.last_four?` ••••${c.last_four}`:''} · {c.sync_method}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{padding:'3px 10px',borderRadius:100,fontSize:10,background:c.status==='active'?'rgba(16,185,129,.1)':'rgba(245,158,11,.08)',color:c.status==='active'?'#10b981':'#f59e0b',border:`1px solid ${c.status==='active'?'rgba(16,185,129,.2)':'rgba(245,158,11,.15)'}`}}>{c.status}</span>
                <button onClick={()=>removeConnection(c.id)} style={{background:'none',border:'none',color:'rgba(239,68,68,.4)',cursor:'pointer',fontSize:14,padding:'4px 6px'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#ef4444'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(239,68,68,.4)'}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
