'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    sb.auth.getSession().then(async ({data:{session:s}}) => {
      if(!s){setLoading(false);return;}
      setSession(s);
      const uid=s.user.id;
      const [{data:l},{data:p}] = await Promise.all([
        sb.from('security_logs').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(50),
        sb.from('profiles').select('*').eq('id',uid).single(),
      ]);
      setLogs(l??[]); setProfile(p);
      await sb.from('security_logs').insert({user_id:uid,event:'Security Hub accessed',type:'info',metadata:{user_agent:navigator.userAgent.slice(0,100)}});
      setLoading(false);
    });
  },[]);
  const exportCSV = async () => {
    if(!session)return;
    setExporting(true);
    const uid=session.user.id;
    const [{data:txns},{data:goals},{data:revenue}] = await Promise.all([
      sb.from('transactions').select('*').eq('user_id',uid).order('date',{ascending:false}),
      sb.from('savings_goals').select('*').eq('user_id',uid),
      sb.from('revenue_entries').select('*').eq('user_id',uid),
    ]);
    const txCSV = [
      ['Date','Type','Description','Category','Amount','Notes'],
      ...(txns||[]).map((t:any)=>[t.date,t.type,t.description,t.category,t.amount,t.notes||''])
    ].map(r=>r.map((c:any)=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([txCSV],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='flowfund-transactions-'+new Date().toISOString().split('T')[0]+'.csv';
    a.click(); URL.revokeObjectURL(url);
    await sb.from('security_logs').insert({user_id:uid,event:'CSV export downloaded',type:'info',metadata:{rows:(txns||[]).length}});
    setExporting(false);
  };
  const signOut = async () => {
    await sb.auth.signOut();
    window.location.href='/login';
  };
  const typeColor:Record<string,string>={info:'#60a5fa',success:'#10b981',error:'#ef4444'};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Security Hub...</div>;
  return (
    <div style={{padding:'0 0 48px'}}>
      <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#00ff9d',marginBottom:4}}>Security Hub</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:28}}>Your account security, data, and privacy controls.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
        <div style={{background:'rgba(0,255,157,.04)',border:'1px solid rgba(0,255,157,.15)',borderRadius:16,padding:22}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#00ff9d',marginBottom:16}}>Account Info</div>
          {[
            ['Email',session?.user?.email||'-'],
            ['User ID',session?.user?.id?.slice(0,16)+'...'],
            ['Plan',(profile?.plan||'free').toUpperCase()],
            ['Member Since',profile?.created_at?new Date(profile.created_at).toLocaleDateString():'Unknown'],
            ['Last Updated',profile?.updated_at?new Date(profile.updated_at).toLocaleDateString():'Never'],
          ].map(([l,v])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
              <span style={{fontSize:12,color:'#e2e8f0',fontFamily:"'Roboto Mono',monospace",fontSize:11}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:22}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#00ff9d',marginBottom:16}}>Security Status</div>
          {[
            ['Row Level Security','Active on all tables'],
            ['Data Encryption','AES-256 at rest'],
            ['Auth Provider','Supabase Auth (JWT)'],
            ['Access Control','User-scoped only'],
            ['Audit Logging','Enabled'],
          ].map(([l,v])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{l}</span>
              <span style={{fontSize:11,padding:'2px 8px',borderRadius:100,background:'rgba(0,255,157,.08)',color:'#00ff9d',border:'1px solid rgba(0,255,157,.2)'}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:22,marginBottom:20}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#00ff9d',marginBottom:16}}>Data Controls</div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <button onClick={exportCSV} disabled={exporting} style={{padding:'10px 20px',borderRadius:8,background:'rgba(0,242,255,.1)',border:'1px solid rgba(0,242,255,.25)',color:'#00f2ff',cursor:'pointer',fontSize:13,fontWeight:600,opacity:exporting?.7:1}}>
            {exporting?'Exporting...':'Export Transactions CSV'}
          </button>
          <button onClick={signOut} style={{padding:'10px 20px',borderRadius:8,background:'rgba(255,82,82,.08)',border:'1px solid rgba(255,82,82,.2)',color:'#ff5252',cursor:'pointer',fontSize:13,fontWeight:600}}>Sign Out</button>
        </div>
        <p style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:12}}>Your data is yours. Export anytime. We do not sell or share your financial data.</p>
      </div>
      <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:22}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#00ff9d',marginBottom:16}}>Activity Log ({logs.length} events)</div>
        {logs.length===0?<div style={{textAlign:'center',padding:20,color:'rgba(255,255,255,.3)',fontSize:13}}>No activity logged yet.</div>:
        logs.map((l:any)=>(
          <div key={l.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:typeColor[l.type]||'#60a5fa',flexShrink:0}}/>
              <span style={{fontSize:13,color:'rgba(255,255,255,.7)'}}>{l.event}</span>
            </div>
            <span style={{fontSize:11,color:'rgba(255,255,255,.28)',whiteSpace:'nowrap'}}>{new Date(l.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}</span>
          </div>
        ))}
      </div>
    </div>
  );
}