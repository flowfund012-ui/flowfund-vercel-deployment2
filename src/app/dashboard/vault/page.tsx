'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
import{t,getLangFromStorage}from'@/lib/i18n';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const TYPE_ICONS:Record<string,string>={spreadsheet:'📊',guide:'📖',template:'📋',checklist:'✅',tool:'🔧'};
const TYPE_COLORS:Record<string,string>={spreadsheet:'#10b981',guide:'#60a5fa',template:'#a78bfa',checklist:'#f59e0b',tool:'#f97316'};
const PLAN_RANK:Record<string,number>={free:0,pro:1,premium:2};
export default function VaultPage(){
  const[assets,setAssets]=useState<any[]>([]);
  const[downloads,setDownloads]=useState<string[]>([]);
  const[plan,setPlan]=useState('free');
  const[loading,setLoading]=useState(true);
  const[filter,setFilter]=useState('All');
  const[search,setSearch]=useState('');
  const[downloading,setDownloading]=useState('');
  const[lang,setLang]=useState('en');
  useEffect(()=>{
    setLang(getLangFromStorage());
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:a},{data:dl},{data:prof}]=await Promise.all([
        sb.from('vault_assets').select('*').eq('is_hidden',false).order('sort_order'),
        sb.from('vault_downloads').select('asset_id').eq('user_id',uid),
        sb.from('profiles').select('plan').eq('id',uid).single(),
      ]);
      setAssets(a??[]);setDownloads((dl??[]).map((d:any)=>d.asset_id));setPlan(prof?.plan||'free');setLoading(false);
    });
  },[]);
  const canAccess=(assetPlan:string)=>(PLAN_RANK[plan]??0)>=(PLAN_RANK[assetPlan]??0);
  const handleDownload=async(asset:any)=>{
    if(!canAccess(asset.plan_required)){return;}
    if(!asset.file_url&&!asset.preview_url){return;}
    setDownloading(asset.id);
    const{data:{session}}=await sb.auth.getSession();
    if(session){
      await sb.from('vault_downloads').upsert({user_id:session.user.id,asset_id:asset.id},{onConflict:'user_id,asset_id',ignoreDuplicates:true});
      if(!downloads.includes(asset.id))setDownloads(p=>[...p,asset.id]);
      await sb.from('vault_assets').update({downloads:(asset.downloads||0)+1}).eq('id',asset.id);
      const url=asset.file_url||asset.preview_url;
      window.open(url,'_blank');
    }
    setDownloading('');
  };
  const types=['All',...Array.from(new Set(assets.map((a:any)=>a.type)))];
  const filtered=assets.filter((a:any)=>{
    if(filter!=='All'&&a.type!==filter)return false;
    if(search&&!a.title.toLowerCase().includes(search.toLowerCase())&&!(a.description||'').toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const freeCount=assets.filter((a:any)=>a.plan_required==='free').length;
  const myDownloads=downloads.length;
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>{t(lang,'loading')}...</div>;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#00f0ff',marginBottom:4}}>{t(lang,'vault_title')}</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>{t(lang,'vault_subtitle')}</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t(lang,'search_vault')} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'8px 14px',color:'#fff',fontSize:12,outline:'none',fontFamily:"'Inter',sans-serif",width:180}}/>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[
          {l:t(lang,'total_assets'),v:String(assets.length),c:'#00f0ff',bg:'rgba(0,240,255,.05)',b:'rgba(0,240,255,.15)'},
          {l:t(lang,'free_assets'),v:String(freeCount),c:'#10b981',bg:'rgba(16,185,129,.05)',b:'rgba(16,185,129,.15)'},
          {l:t(lang,'downloaded'),v:String(myDownloads),c:'#a78bfa',bg:'rgba(167,139,250,.05)',b:'rgba(167,139,250,.15)'},
          {l:t(lang,'your_plan'),v:plan.charAt(0).toUpperCase()+plan.slice(1),c:plan==='premium'?'#ffd700':plan==='pro'?'#00f2ff':'rgba(255,255,255,.5)',bg:'rgba(255,255,255,.03)',b:'rgba(255,255,255,.08)'},
        ].map(s=>(
          <div key={s.l} style={{background:s.bg,border:`1px solid ${s.b}`,borderRadius:12,padding:'12px 16px',textAlign:'center'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.07em'}}>{s.l}</div>
            <div style={{fontSize:18,fontWeight:700,color:s.c,fontFamily:"'Roboto Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
        {types.map(tp=>(
          <button key={tp} onClick={()=>setFilter(tp)} style={{padding:'6px 14px',borderRadius:100,fontSize:11,background:filter===tp?'rgba(0,240,255,.1)':'rgba(255,255,255,.04)',border:`1px solid ${filter===tp?'rgba(0,240,255,.3)':'rgba(255,255,255,.07)'}`,color:filter===tp?'#00f0ff':'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif",textTransform:'capitalize'}}>{tp}</button>
        ))}
      </div>
      {plan==='free'&&(
        <div style={{background:'rgba(255,215,0,.05)',border:'1px solid rgba(255,215,0,.18)',borderRadius:12,padding:'12px 20px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div style={{fontSize:13,color:'rgba(255,215,0,.8)'}}>🔒 {assets.filter((a:any)=>a.plan_required!=='free').length} {t(lang,'locked_msg')}</div>
          <a href="/dashboard/settings" style={{padding:'7px 16px',borderRadius:8,background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',textDecoration:'none',fontSize:11,fontWeight:700,fontFamily:"'Orbitron',monospace",whiteSpace:'nowrap'}}>{t(lang,'upgrade_now')}</a>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
        {filtered.map((asset:any)=>{
          const downloaded=downloads.includes(asset.id);
          const locked=!canAccess(asset.plan_required);
          const col=TYPE_COLORS[asset.type]||'#60a5fa';
          const icon=TYPE_ICONS[asset.type]||'📄';
          return(
            <div key={asset.id} style={{background:'rgba(13,17,23,.9)',border:`1px solid ${downloaded?'rgba(16,185,129,.25)':locked?'rgba(255,215,0,.15)':'rgba(255,255,255,.07)'}`,borderRadius:16,padding:22,transition:'all .18s',display:'flex',flexDirection:'column'}} onMouseEnter={e=>{if(!locked)(e.currentTarget as HTMLElement).style.borderColor=col+'44';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=downloaded?'rgba(16,185,129,.25)':locked?'rgba(255,215,0,.15)':'rgba(255,255,255,.07)';}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:12,background:`${col}15`,border:`1px solid ${col}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                    <span style={{fontSize:10,color:col,textTransform:'uppercase',letterSpacing:'.08em',fontWeight:700}}>{asset.type}</span>
                    {asset.plan_required!=='free'&&<span style={{padding:'1px 7px',borderRadius:100,fontSize:9,background:asset.plan_required==='premium'?'rgba(255,215,0,.1)':'rgba(0,242,255,.08)',color:asset.plan_required==='premium'?'#ffd700':'#00f2ff',border:`1px solid ${asset.plan_required==='premium'?'rgba(255,215,0,.2)':'rgba(0,242,255,.15)'}`,fontFamily:"'Orbitron',monospace"}}>{asset.plan_required.toUpperCase()}</span>}
                    {downloaded&&<span style={{padding:'1px 7px',borderRadius:100,fontSize:9,background:'rgba(16,185,129,.1)',color:'#10b981',border:'1px solid rgba(16,185,129,.2)'}}>✓ {t(lang,'downloaded')}</span>}
                  </div>
                  <h3 style={{fontSize:14,fontWeight:700,color:'#fff',lineHeight:1.3}}>{asset.title}</h3>
                </div>
              </div>
              <p style={{fontSize:12,color:'rgba(255,255,255,.45)',lineHeight:1.7,flex:1,marginBottom:16}}>{asset.description}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',gap:10,fontSize:11,color:'rgba(255,255,255,.3)'}}>
                  <span>{(asset.downloads||0).toLocaleString()} downloads</span>
                  {asset.tags&&asset.tags.slice(0,2).map((tag:string)=><span key={tag} style={{padding:'2px 7px',borderRadius:100,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.06)'}}>{tag}</span>)}
                </div>
                {locked?(
                  <a href="/dashboard/settings" style={{padding:'7px 16px',borderRadius:8,background:'rgba(255,215,0,.08)',border:'1px solid rgba(255,215,0,.2)',color:'#ffd700',fontSize:11,textDecoration:'none',fontFamily:"'Orbitron',monospace",whiteSpace:'nowrap'}}>🔒 {t(lang,'upgrade_to')}</a>
                ):(
                  <button onClick={()=>handleDownload(asset)} disabled={downloading===asset.id} style={{padding:'8px 18px',borderRadius:8,background:downloaded?'rgba(16,185,129,.1)':'linear-gradient(135deg,#0d9aff,#1a6bff)',color:downloaded?'#10b981':'#fff',border:downloaded?'1px solid rgba(16,185,129,.25)':'none',cursor:downloading===asset.id?'not-allowed':'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap',opacity:downloading===asset.id?.7:1}}>
                    {downloading===asset.id?t(lang,'opening'):(downloaded?t(lang,'open_again'):t(lang,'download'))}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,.3)',fontSize:13}}>{t(lang,'no_assets')}</div>}
    </div>
  );
}
