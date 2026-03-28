'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const ASSETS=[{id:'v1',name:'FlowFund Command Center',desc:'Complete Notion financial OS with 12 modules',size:'12.4 MB',icon:'📊',tag:'Premium',plan:'free',url:'https://www.notion.so/templates'},{id:'v2',name:'Financial Goal Tracker',desc:'30-day goal tracking spreadsheet with automations',size:'3.2 MB',icon:'🎯',tag:'Popular',plan:'free',url:'https://docs.google.com/spreadsheets'},{id:'v3',name:'Business Expense Analyzer',desc:'AI-powered expense categorizer for businesses',size:'5.7 MB',icon:'💼',tag:'New',plan:'pro',url:'#'},{id:'v4',name:'30-Day Wealth Blueprint',desc:'Step-by-step guide to financial freedom',size:'8.3 MB',icon:'📖',tag:'Bestseller',plan:'pro',url:'#'},{id:'v5',name:'AI Budget Planner',desc:'Web-based budget planner with AI suggestions',size:'Web App',icon:'🤖',tag:'AI',plan:'premium',url:'/dashboard'},{id:'v6',name:'Investment Portfolio Tracker',desc:'Real-time portfolio tracker with risk analysis',size:'32 MB',icon:'📈',tag:'Pro',plan:'premium',url:'#'}];
const planRank:{[k:string]:number}={free:0,pro:1,premium:2};
export default function VaultPage(){
  const[downloaded,setDownloaded]=useState<string[]>([]);
  const[plan,setPlan]=useState('free');
  const[loading,setLoading]=useState(true);
  useEffect(()=>{sb.auth.getSession().then(async({data:{session}})=>{if(!session){setLoading(false);return;}const uid=session.user.id;const[{data:dl},{data:prof}]=await Promise.all([sb.from('vault_downloads').select('asset_id').eq('user_id',uid),sb.from('profiles').select('plan').eq('id',uid).single()]);setDownloaded((dl??[]).map((d:any)=>d.asset_id));setPlan(prof?.plan??'free');setLoading(false);});},[]);
  const canAccess=(p:string)=>(planRank[plan]??0)>=(planRank[p]??0);
  const handleDownload=async(asset:typeof ASSETS[0])=>{if(!canAccess(asset.plan))return;const{data:{session}}=await sb.auth.getSession();if(!session)return;await sb.from('vault_downloads').upsert({user_id:session.user.id,asset_id:asset.id},{onConflict:'user_id,asset_id',ignoreDuplicates:true});setDownloaded(p=>p.includes(asset.id)?p:[...p,asset.id]);if(asset.url&&asset.url!=='#')window.open(asset.url,'_blank');};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Vault...</div>;
  return(<div style={{padding:'0 0 40px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
      <div><h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#00f0ff',marginBottom:5}}>Vault Access</h1><p style={{fontSize:12,color:'rgba(226,232,240,.38)'}}>Secure Vault. Premium assets. Yours forever.</p></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
      {[{l:'Assets',v:String(ASSETS.length)},{l:'Downloaded',v:String(downloaded.length)},{l:'Total Size',v:'67 MB'},{l:'Your Plan',v:plan.charAt(0).toUpperCase()+plan.slice(1)}].map(s=>(<div key={s.l} style={{background:'rgba(0,240,255,.05)',border:'1px solid rgba(0,240,255,.15)',borderRadius:12,padding:'14px 16px'}}><div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:600,color:'#00f0ff'}}>{s.v}</div></div>))}
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {ASSETS.map(a=>{const dl=downloaded.includes(a.id);const locked=!canAccess(a.plan);return(<div key={a.id} style={{background:'rgba(0,240,255,.02)',border:'1px solid rgba(0,240,255,'+(dl?'.3':'.1')+')',borderRadius:12,padding:20,display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:28,width:52,height:52,background:'rgba(0,240,255,.08)',border:'1px solid rgba(0,240,255,.18)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{a.icon}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><span style={{fontSize:15,fontWeight:700,color:'#e2e8f0'}}>{a.name}</span><span style={{padding:'2px 8px',borderRadius:100,fontSize:10,background:'rgba(0,240,255,.12)',color:'#00f0ff'}}>{a.tag}</span>{locked&&<span style={{padding:'2px 8px',borderRadius:100,fontSize:10,background:'rgba(255,215,0,.12)',color:'#ffd700'}}>🔒 {a.plan}</span>}{dl&&<span style={{padding:'2px 8px',borderRadius:100,fontSize:10,background:'rgba(16,185,129,.12)',color:'#10b981'}}>✓ Downloaded</span>}</div>
          <div style={{fontSize:12,color:'rgba(226,232,240,.4)'}}>{a.desc}</div>
        </div>
        <div style={{textAlign:'right'}}><div style={{fontSize:11,color:'rgba(226,232,240,.3)',marginBottom:8}}>{a.size}</div>{locked?<a href="/dashboard/settings" style={{padding:'6px 14px',borderRadius:8,background:'rgba(255,215,0,.12)',color:'#ffd700',fontSize:11,textDecoration:'none',border:'1px solid rgba(255,215,0,.3)'}}>👑 Upgrade</a>:<button onClick={()=>handleDownload(a)} style={{padding:'6px 14px',borderRadius:8,background:dl?'rgba(0,240,255,.1)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:dl?'#00f0ff':'white',fontSize:11,border:dl?'1px solid rgba(0,240,255,.3)':'none',cursor:'pointer'}}>{dl?'↻ Re-download':'↓ Access'}</button>}</div>
      </div>);})}
    </div>
  </div>);
}