'use client';
export const dynamic='force-dynamic';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const LANGS=[['en','English'],['ps','پښتو (Pashto)'],['fa','دری (Dari)'],['ar','العربية'],['ur','اردو'],['de','Deutsch'],['fr','Français'],['es','Español'],['zh','中文'],['hi','हिन्दी'],['tr','Türkçe'],['ru','Русский'],['pt','Português'],['id','Bahasa Indonesia'],['ja','日本語'],['ko','한국어']];
const ROLES=['Student','Freelancer','Entrepreneur','Employee','Investor','Other'];
export default function SettingsPage(){
  const[tab,setTab]=useState('profile');
  const[name,setName]=useState('');
  const[role,setRole]=useState('');
  const[lang,setLang]=useState('en');
  const[saving,setSaving]=useState(false);
  const[msg,setMsg]=useState('');
  const[plan,setPlan]=useState('free');
  const[resetConfirm,setResetConfirm]=useState<string|null>(null);
  const[delConfirm,setDelConfirm]=useState('');
  const[working,setWorking]=useState(false);
  useEffect(()=>{
    const saved=localStorage.getItem('ff_lang')||'en';
    setLang(saved);
    sb.auth.getUser().then(async({data})=>{
      if(!data.user)return;
      const{data:p}=await sb.from('profiles').select('*').eq('id',data.user.id).single();
      if(p){setName(p.full_name||'');setRole(p.role||'Student');setPlan(p.plan||'free');}
    });
  },[]);
  const saveProfile=async()=>{
    setSaving(true);setMsg('');
    const{data}=await sb.auth.getUser();
    if(!data.user){setSaving(false);return;}
    await sb.from('profiles').update({full_name:name,role}).eq('id',data.user.id);
    setSaving(false);setMsg('Profile saved.');
    setTimeout(()=>setMsg(''),3000);
  };
  const saveLang=()=>{
    localStorage.setItem('ff_lang',lang);
    setMsg('Language saved. Reloading...');
    setTimeout(()=>window.location.reload(),1000);
  };
  const exportData=async()=>{
    setWorking(true);
    const{data:u}=await sb.auth.getUser();
    if(!u.user){setWorking(false);return;}
    const[{data:tx},{data:goals},{data:rev}]=await Promise.all([
      sb.from('transactions').select('*').eq('user_id',u.user.id),
      sb.from('savings_goals').select('*').eq('user_id',u.user.id),
      sb.from('revenue_entries').select('*').eq('user_id',u.user.id),
    ]);
    const rows:string[]=[];
    rows.push('TYPE,DATE,DESCRIPTION,AMOUNT,CATEGORY');
    (tx||[]).forEach((r:Record<string,unknown>)=>rows.push(`Transaction,${r.date||''},${String(r.description||'').replace(/,/g,' ')},${r.amount||0},${r.category||''}`));
    (goals||[]).forEach((r:Record<string,unknown>)=>rows.push(`Goal,${r.created_at||''},${String(r.name||'').replace(/,/g,' ')},${r.target_amount||0},Savings`));
    (rev||[]).forEach((r:Record<string,unknown>)=>rows.push(`Revenue,${r.date||''},${String(r.description||'').replace(/,/g,' ')},${r.amount||0},${r.type||''}`));
    const blob=new Blob([rows.join('\n')],{type:'text/csv'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='flowfund-export.csv';a.click();
    setWorking(false);setMsg('Data exported successfully.');
    setTimeout(()=>setMsg(''),4000);
  };
  const resetData=async(type:string)=>{
    setWorking(true);setMsg('');
    const{data:u}=await sb.auth.getUser();
    if(!u.user){setWorking(false);return;}
    if(type==='transactions')await sb.from('transactions').delete().eq('user_id',u.user.id);
    if(type==='goals')await sb.from('savings_goals').delete().eq('user_id',u.user.id);
    if(type==='revenue')await sb.from('revenue_entries').delete().eq('user_id',u.user.id);
    if(type==='all'){
      await Promise.all([
        sb.from('transactions').delete().eq('user_id',u.user.id),
        sb.from('savings_goals').delete().eq('user_id',u.user.id),
        sb.from('revenue_entries').delete().eq('user_id',u.user.id),
        sb.from('debts').delete().eq('user_id',u.user.id),
        sb.from('autopilot_settings').delete().eq('user_id',u.user.id),
      ]);
    }
    setResetConfirm(null);setWorking(false);
    setMsg(`${type==='all'?'All data':'Data'} cleared successfully.`);
    setTimeout(()=>setMsg(''),4000);
  };
  const deleteAccount=async()=>{
    if(delConfirm!=='DELETE'){setMsg('Type DELETE to confirm.');return;}
    setWorking(true);
    const{data:u}=await sb.auth.getUser();
    if(!u.user){setWorking(false);return;}
    await Promise.all([
      sb.from('transactions').delete().eq('user_id',u.user.id),
      sb.from('savings_goals').delete().eq('user_id',u.user.id),
      sb.from('revenue_entries').delete().eq('user_id',u.user.id),
      sb.from('profiles').delete().eq('id',u.user.id),
    ]);
    await sb.auth.signOut();
    window.location.href='/';
  };
  const card:React.CSSProperties={background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:24,marginBottom:16};
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:9,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  const btn=(bg:string,col='#fff'):React.CSSProperties=>({padding:'10px 22px',borderRadius:9,background:bg,color:col,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Inter',sans-serif"});
  const TABS=[['profile','Profile'],['language','Language'],['billing','Billing'],['data','Data & Privacy']];
  return(
    <div style={{maxWidth:680,margin:'0 auto',fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');input:focus{border-color:rgba(26,107,255,.5)!important;outline:none}`}</style>
      <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:6}}>Settings</h1>
      <p style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:24}}>Manage your account, language, billing and data.</p>
      {msg&&<div style={{background:msg.includes('error')||msg.includes('Type')?'rgba(239,68,68,.1)':'rgba(34,197,94,.1)',border:`1px solid ${msg.includes('error')||msg.includes('Type')?'rgba(239,68,68,.3)':'rgba(34,197,94,.3)'}`,borderRadius:9,padding:'10px 14px',fontSize:13,color:msg.includes('error')||msg.includes('Type')?'#f87171':'#4ade80',marginBottom:16}}>{msg}</div>}
      <div style={{display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid rgba(255,255,255,.07)',paddingBottom:0}}>
        {TABS.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{padding:'9px 16px',borderRadius:'8px 8px 0 0',background:'none',border:'none',color:tab===k?'#fff':'rgba(255,255,255,.4)',fontSize:13,fontWeight:tab===k?600:400,cursor:'pointer',borderBottom:tab===k?'2px solid #1a6bff':'2px solid transparent',fontFamily:"'Inter',sans-serif"}}>{l}</button>)}
      </div>
      {tab==='profile'&&(
        <div style={card}>
          <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:18}}>Profile Information</h3>
          <div style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={inp} placeholder="Your full name"/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:8,letterSpacing:'.08em',textTransform:'uppercase'}}>Role</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              {ROLES.map(r=><button key={r} onClick={()=>setRole(r)} style={{padding:'6px 14px',borderRadius:16,border:role===r?'1.5px solid #1a6bff':'1px solid rgba(255,255,255,.1)',background:role===r?'rgba(26,107,255,.14)':'transparent',color:role===r?'#60a5fa':'rgba(255,255,255,.45)',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{r}</button>)}
            </div>
          </div>
          <button onClick={saveProfile} disabled={saving} style={btn('linear-gradient(135deg,#1a6bff,#7c00ff)')}>{saving?'Saving...':'Save Profile'}</button>
        </div>
      )}
      {tab==='language'&&(
        <div style={card}>
          <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:6}}>Display Language</h3>
          <p style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:18}}>Changes the language of the entire dashboard including the sidebar, module names, and labels.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
            {LANGS.map(([code,label])=><button key={code} onClick={()=>setLang(code)} style={{padding:'10px 14px',borderRadius:10,border:lang===code?'1.5px solid #1a6bff':'1px solid rgba(255,255,255,.08)',background:lang===code?'rgba(26,107,255,.12)':'rgba(255,255,255,.03)',color:lang===code?'#60a5fa':'rgba(255,255,255,.55)',fontSize:13,cursor:'pointer',fontFamily:"'Inter',sans-serif",textAlign:'left'}}>{label}</button>)}
          </div>
          <button onClick={saveLang} style={btn('linear-gradient(135deg,#1a6bff,#7c00ff)')}>Save and Apply Language</button>
        </div>
      )}
      {tab==='billing'&&(
        <div>
          <div style={{...card,borderColor:plan==='pro'?'rgba(26,107,255,.4)':'rgba(255,255,255,.07)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,color:'#fff',marginBottom:3}}>Current Plan: <span style={{color:plan==='pro'?'#60a5fa':plan==='premium'?'#a78bfa':'rgba(255,255,255,.5)',textTransform:'capitalize'}}>{plan}</span></div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>{plan==='free'?'50 transactions/month — upgrade for unlimited access':plan==='pro'?'$19/month — unlimited access + AI Advisor':'$39/month — full access + priority AI'}</div>
              </div>
              {plan==='free'&&<span style={{background:'rgba(255,255,255,.08)',borderRadius:16,padding:'4px 12px',fontSize:11,color:'rgba(255,255,255,.4)'}}>Free</span>}
              {plan!=='free'&&<span style={{background:'rgba(26,107,255,.2)',borderRadius:16,padding:'4px 12px',fontSize:11,color:'#60a5fa'}}>Active</span>}
            </div>
          </div>
          {plan==='free'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[{n:'Pro',p:'$19/mo',f:['Unlimited transactions','AI Advisor + Chat','Revenue module','Tax Radar','Bank Sync','CSV export']},{n:'Premium',p:'$39/mo',f:['Everything in Pro','Full Toolkit library','PDF reports','Priority AI','Early access']}].map(p=>(
                <div key={p.n} style={{...card,border:'1px solid rgba(26,107,255,.25)'}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,color:'#fff',marginBottom:3}}>{p.n}</div>
                  <div style={{fontSize:18,fontWeight:800,color:'#fff',marginBottom:12}}>{p.p}</div>
                  {p.f.map(f=><div key={f} style={{fontSize:12,color:'rgba(255,255,255,.55)',marginBottom:5,display:'flex',gap:6}}><span style={{color:'#22c55e',fontSize:11}}>✓</span>{f}</div>)}
                  <button onClick={()=>setTab('billing')} style={{...btn('linear-gradient(135deg,#1a6bff,#7c00ff)'),marginTop:14,width:'100%'}}>Upgrade to {p.n}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab==='data'&&(
        <div>
          <div style={card}>
            <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:6}}>Export Your Data</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:16}}>Download all your transactions, goals, and revenue as a CSV file. You own your data.</p>
            <button onClick={exportData} disabled={working} style={btn('rgba(26,107,255,.2)','#60a5fa')}>{working?'Exporting...':'Download CSV Export'}</button>
          </div>
          <div style={card}>
            <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:6}}>Reset Data</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:16}}>Permanently delete specific data. This cannot be undone.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
              {[['transactions','Reset Transactions'],['goals','Reset Goals'],['revenue','Reset Revenue'],['all','Reset Everything']].map(([type,label])=>(
                <div key={type}>
                  {resetConfirm===type?(
                    <div style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:9,padding:12}}>
                      <div style={{fontSize:12,color:'#f87171',marginBottom:8}}>Are you sure? This deletes all your {label.replace('Reset ','')} data forever.</div>
                      <div style={{display:'flex',gap:7}}>
                        <button onClick={()=>resetData(type)} disabled={working} style={{...btn('rgba(239,68,68,.8)'),fontSize:12,padding:'7px 14px'}}>{working?'Deleting...':'Yes, Delete'}</button>
                        <button onClick={()=>setResetConfirm(null)} style={{...btn('rgba(255,255,255,.08)','rgba(255,255,255,.6)'),fontSize:12,padding:'7px 14px'}}>Cancel</button>
                      </div>
                    </div>
                  ):(
                    <button onClick={()=>setResetConfirm(type)} style={{...btn(type==='all'?'rgba(239,68,68,.12)':'rgba(255,255,255,.05)',type==='all'?'#f87171':'rgba(255,255,255,.55)'),border:`1px solid ${type==='all'?'rgba(239,68,68,.2)':'rgba(255,255,255,.08)'}`,width:'100%',textAlign:'left',padding:'10px 14px',fontSize:12}}>{label}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{...card,borderColor:'rgba(239,68,68,.2)'}}>
            <h3 style={{color:'#f87171',fontSize:15,fontWeight:700,marginBottom:6}}>Delete Account</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:16}}>Permanently delete your account and all associated data. This action is irreversible.</p>
            <div style={{marginBottom:12}}>
              <label style={{display:'block',fontSize:11,color:'rgba(239,68,68,.7)',marginBottom:6,letterSpacing:'.08em',textTransform:'uppercase'}}>Type DELETE to confirm</label>
              <input value={delConfirm} onChange={e=>setDelConfirm(e.target.value)} placeholder="DELETE" style={{...inp,borderColor:'rgba(239,68,68,.2)',maxWidth:220}}/>
            </div>
            <button onClick={deleteAccount} disabled={working||delConfirm!=='DELETE'} style={{...btn('rgba(239,68,68,.8)'),opacity:delConfirm==='DELETE'?1:0.4,cursor:delConfirm==='DELETE'?'pointer':'not-allowed'}}>{working?'Deleting Account...':'Delete My Account'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
