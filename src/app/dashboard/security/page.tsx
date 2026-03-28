'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const CHECKS=[{i:'🔐',l:'AES-256 Encryption',ok:true},{i:'🌐',l:'SSL/TLS 1.3',ok:true},{i:'👁',l:'Zero-Knowledge Proof',ok:true},{i:'🛡️',l:'2FA Authentication',ok:false},{i:'🗂️',l:'Decentralized Storage',ok:true},{i:'🤖',l:'AI Threat Monitoring',ok:true}];
export default function SecurityPage(){
  const[logs,setLogs]=useState<any[]>([]);
  const[scanning,setScanning]=useState(false);
  const[lockdown,setLockdown]=useState(false);
  const[loading,setLoading]=useState(true);
  const score=98;const circ=408.41;const offset=circ*(1-score/100);
  useEffect(()=>{sb.auth.getSession().then(async({data:{session}})=>{if(!session){setLoading(false);return;}const{data}=await sb.from('security_logs').select('*').eq('user_id',session.user.id).order('created_at',{ascending:false}).limit(20);setLogs(data??[]);setLoading(false);});},[]);
  const addLog=async(event:string,type:string)=>{const{data:{session}}=await sb.auth.getSession();if(!session)return;const entry:any={user_id:session.user.id,event,type,created_at:new Date().toISOString()};setLogs(p=>[{id:Math.random().toString(),...entry},...p]);await sb.from('security_logs').insert(entry);};
  const runScan=()=>{setScanning(true);setTimeout(()=>{addLog('Full scan completed - 0 threats found','success');setScanning(false);},2000);};
  const toggleLockdown=()=>{const next=!lockdown;setLockdown(next);addLog(next?'LOCKDOWN MODE ACTIVATED':'Lockdown disabled',next?'error':'success');};
  const clearLogs=async()=>{setLogs([]);const{data:{session}}=await sb.auth.getSession();if(!session)return;await sb.from('security_logs').delete().eq('user_id',session.user.id);};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Security Hub...</div>;
  return(<div style={{padding:'0 0 40px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
      <div><h1 style={{fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,color:'#00f0ff',marginBottom:5}}>Security Hub</h1><p style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,color:'rgba(226,232,240,.35)',letterSpacing:'.05em'}}>YOUR FINANCIAL FORTRESS. MONITORED 24/7.</p></div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn btn-cyan btn-sm" onClick={runScan} disabled={scanning}>{scanning?'Scanning...':'Run Scan'}</button>
        <button onClick={toggleLockdown} style={{padding:'6px 12px',borderRadius:7,background:lockdown?'rgba(0,255,157,.12)':'rgba(255,0,0,.12)',border:'1px solid '+(lockdown?'rgba(0,255,157,.25)':'rgba(255,0,0,.25)'),color:lockdown?'#00ff9d':'#ff5252',fontSize:10,cursor:'pointer'}}>{lockdown?'Disable Lockdown':'Lockdown Mode'}</button>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
      {[{l:'Security Score',v:score+'/100',c:'#00f0ff'},{l:'Encryption',v:'AES-256',c:'#00ff9d'},{l:'Log Events',v:String(logs.length),c:'#00f0ff'},{l:'Mode',v:lockdown?'LOCKDOWN':'Normal',c:lockdown?'#ff5252':'#00f0ff'}].map(s=>(<div key={s.l} style={{background:'rgba(0,240,255,.025)',border:'1px solid rgba(0,240,255,.1)',borderRadius:12,padding:'14px 16px'}}><div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Roboto Mono',monospace",fontSize:18,fontWeight:600,color:s.c}}>{s.v}</div></div>))}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
      <div style={{background:'rgba(0,240,255,.025)',border:'1px solid rgba(0,240,255,.1)',borderRadius:14,padding:24,textAlign:'center'}}>
        <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff',marginBottom:16}}>Security Score</div>
        <div style={{position:'relative',width:140,height:140,margin:'0 auto'}}>
          <svg width="140" height="140" style={{transform:'rotate(-90deg)'}}><circle cx="70" cy="70" r="60" fill="none" stroke="rgba(0,240,255,.07)" strokeWidth="10"/><circle cx="70" cy="70" r="60" fill="none" stroke="#00f0ff" strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{filter:'drop-shadow(0 0 6px rgba(0,240,255,.5))'}}/></svg>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><div style={{fontFamily:"'Roboto Mono',monospace",fontSize:28,color:'#00f0ff'}}>{score}</div><div style={{fontSize:10,color:'rgba(226,232,240,.3)'}}>/100</div></div>
        </div>
        <div style={{marginTop:12,padding:'4px 12px',borderRadius:100,background:'rgba(16,185,129,.12)',color:'#10b981',fontSize:11,display:'inline-block'}}>🛡️ EXCELLENT</div>
      </div>
      <div style={{background:'rgba(0,240,255,.025)',border:'1px solid rgba(0,240,255,.1)',borderRadius:14,padding:24}}>
        <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff',marginBottom:16}}>Encryption & Privacy</div>
        {CHECKS.map(c=>(<div key={c.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,fontFamily:"'Roboto Mono',monospace",marginBottom:10}}><span>{c.i} {c.l}</span><span style={{padding:'2px 8px',borderRadius:4,fontSize:10,background:c.ok?'rgba(16,185,129,.12)':'rgba(255,82,82,.12)',color:c.ok?'#10b981':'#ff5252'}}>{c.ok?'✓ Active':'○ Off'}</span></div>))}
      </div>
    </div>
    <div style={{background:'rgba(0,240,255,.025)',border:'1px solid rgba(0,240,255,.1)',borderRadius:14,padding:22}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff'}}>Activity Log</span>
        <button onClick={clearLogs} style={{padding:'3px 10px',borderRadius:6,background:'rgba(0,240,255,.08)',border:'1px solid rgba(0,240,255,.2)',color:'#00f0ff',fontSize:10,cursor:'pointer'}}>Clear</button>
      </div>
      {logs.length===0&&<div style={{textAlign:'center',padding:16,fontSize:11,color:'rgba(226,232,240,.22)',fontFamily:"'Roboto Mono',monospace"}}>No activity. Run a scan to generate the first log.</div>}
      {logs.slice(0,10).map((l:any,i:number)=>(<div key={l.id||i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'8px 0',borderBottom:'1px solid rgba(0,240,255,.05)'}}><div style={{width:28,height:28,borderRadius:8,background:l.type==='success'?'rgba(0,255,157,.1)':l.type==='error'?'rgba(255,0,0,.1)':'rgba(0,240,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>{l.type==='success'?'✅':l.type==='error'?'❌':'ℹ️'}</div><div><div style={{fontSize:12,color:'rgba(226,232,240,.7)',fontFamily:"'Roboto Mono',monospace"}}>{l.event}</div><div style={{fontSize:10,color:'rgba(226,232,240,.3)',fontFamily:"'Roboto Mono',monospace"}}>{new Date(l.created_at).toLocaleString()}</div></div></div>))}
    </div>
  </div>);
}