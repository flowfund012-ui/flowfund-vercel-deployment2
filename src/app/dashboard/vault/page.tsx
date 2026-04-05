'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const TYPE_COLORS:Record<string,string>={template:'#00f2ff',spreadsheet:'#10b981',guide:'#a78bfa',tool:'#f59e0b',checklist:'#00ff9d'};
export default function VaultPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    sb.auth.getSession().then(async ({data:{session}}) => {
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const [{data:a},{data:d},{data:p}] = await Promise.all([
        sb.from('vault_assets').select('*').eq('is_hidden',false).order('sort_order'),
        sb.from('vault_downloads').select('asset_id').eq('user_id',uid),
        sb.from('profiles').select('plan').eq('id',uid).single(),
      ]);
      setAssets(a??[]); setDownloads((d??[]).map((x:any)=>x.asset_id)); setProfile(p);
      setLoading(false);
    });
  },[]);
  const unlock = async (asset:any) => {
    const{data:{session}}=await sb.auth.getSession();
    if(!session)return;
    const uid=session.user.id;
    if(!downloads.includes(asset.id)){
      await sb.from('vault_downloads').insert({user_id:uid,asset_id:asset.id});
      await sb.from('vault_assets').update({downloads:asset.downloads+1}).eq('id',asset.id);
      setDownloads(p=>[...p,asset.id]);
    }
    alert('Asset unlocked! In a full build, the download link would open here.\n\nAsset: '+asset.title);
  };
  const plan=profile?.plan||'free';
  const planRank:Record<string,number>={free:0,pro:1,premium:2};
  const types=['all','template','spreadsheet','guide','tool'];
  const filtered=filter==='all'?assets:assets.filter(a=>a.type===filter);
  const unlocked=filtered.filter(a=>planRank[a.plan_required]<=planRank[plan]);
  const locked=filtered.filter(a=>planRank[a.plan_required]>planRank[plan]);
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Vault...</div>;
  return (
    <div style={{padding:'0 0 48px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#00f0ff',marginBottom:4}}>Vault Access</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Premium templates, tools, and resources. Updated monthly.</p>
        </div>
        <div style={{background:'rgba(0,240,255,.06)',border:'1px solid rgba(0,240,255,.2)',borderRadius:12,padding:'10px 16px',textAlign:'center'}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:'#00f0ff'}}>{downloads.length}</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>Downloaded</div>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{padding:'6px 14px',borderRadius:100,fontSize:12,border:'1px solid',borderColor:filter===t?'#00f0ff':'rgba(255,255,255,.1)',background:filter===t?'rgba(0,240,255,.1)':'transparent',color:filter===t?'#00f0ff':'rgba(255,255,255,.4)',cursor:'pointer',textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>
      {unlocked.length>0&&(
        <div style={{marginBottom:32}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:14,textTransform:'uppercase',letterSpacing:'.06em'}}>Available to you ({unlocked.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {unlocked.map((a:any)=>{
              const dl=downloads.includes(a.id);
              const color=TYPE_COLORS[a.type]||'#60a5fa';
              return (
                <div key={a.id} style={{background:'rgba(15,20,35,.8)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:22,position:'relative'}}>
                  {dl&&<div style={{position:'absolute',top:14,right:14,fontSize:9,padding:'2px 8px',borderRadius:100,background:'rgba(16,185,129,.15)',color:'#10b981'}}>Downloaded</div>}
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                    <div style={{width:38,height:38,borderRadius:10,background:color+'15',border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:color}}>
                      {a.type==='template'?'T':a.type==='spreadsheet'?'S':a.type==='guide'?'G':a.type==='tool'?'X':'C'}
                    </div>
                    <div>
                      <div style={{fontSize:10,color,textTransform:'capitalize'}}>{a.type}</div>
                      <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0'}}>{a.title}</div>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6,marginBottom:16}}>{a.description}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                    {(a.tags||[]).map((tag:string)=>(
                      <span key={tag} style={{fontSize:10,padding:'2px 8px',borderRadius:100,background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.4)'}}>{tag}</span>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:11,color:'rgba(255,255,255,.25)'}}>{a.downloads} downloads</span>
                    <button onClick={()=>unlock(a)} style={{padding:'7px 16px',borderRadius:8,background:dl?'rgba(16,185,129,.15)':'rgba(0,240,255,.12)',border:dl?'1px solid rgba(16,185,129,.25)':'1px solid rgba(0,240,255,.25)',color:dl?'#10b981':'#00f0ff',cursor:'pointer',fontSize:12,fontWeight:600}}>
                      {dl?'Download Again':'Download'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {locked.length>0&&(
        <div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginBottom:14,textTransform:'uppercase',letterSpacing:'.06em'}}>Locked - Upgrade to access ({locked.length})</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {locked.map((a:any)=>(
              <div key={a.id} style={{background:'rgba(15,20,35,.5)',border:'1px solid rgba(255,255,255,.05)',borderRadius:14,padding:22,opacity:.6}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.5)'}}>{a.title}</div>
                  <span style={{fontSize:10,padding:'2px 8px',borderRadius:100,background:'rgba(255,215,0,.08)',color:'rgba(255,215,0,.6)',border:'1px solid rgba(255,215,0,.15)',textTransform:'capitalize'}}>{a.plan_required}</span>
                </div>
                <p style={{fontSize:12,color:'rgba(255,255,255,.3)',lineHeight:1.6,marginBottom:12}}>{a.description}</p>
                <a href="/dashboard/settings" style={{display:'block',padding:'7px',borderRadius:8,background:'rgba(255,215,0,.08)',border:'1px solid rgba(255,215,0,.15)',color:'rgba(255,215,0,.7)',fontSize:12,fontWeight:600,textAlign:'center',textDecoration:'none'}}>Upgrade to Unlock</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}