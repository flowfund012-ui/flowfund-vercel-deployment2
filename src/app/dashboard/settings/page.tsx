'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
import{LANGS,setLangInStorage,getLangFromStorage}from'@/lib/i18n';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
const card:React.CSSProperties={background:'rgba(13,17,23,.92)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:24,marginBottom:16};
const PLANS=[
  {id:'free',label:'Free',price:'$0',sub:'/forever',col:'rgba(255,255,255,.35)',bdr:'rgba(255,255,255,.09)',features:['Dashboard & AI Score','50 transactions/month','Mission Tracker','1 savings goal','3 Academy courses','2 Vault assets']},
  {id:'pro',label:'Pro',price:'$19',sub:'/month',col:'#00f2ff',bdr:'rgba(0,242,255,.28)',features:['Everything in Free','Unlimited transactions','Full AI Advisor + Chat','Growth Engine','All Academy courses','4 Vault assets','Budgets & categories','Debt Planner + AI','Cashflow forecast','CSV export']},
  {id:'premium',label:'Premium',price:'$39',sub:'/month',col:'#ffd700',bdr:'rgba(255,215,0,.32)',badge:'BEST VALUE',features:['Everything in Pro','Full Vault + hidden drops','PDF reports','Priority AI','Tax Radar pro','Early access','Custom categories','Unlimited everything']},
];
export default function SettingsPage(){
  const[profile,setProfile]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState('');
  const[tab,setTab]=useState<'profile'|'language'|'billing'>('profile');
  const[name,setName]=useState('');
  const[role,setRole]=useState('Student');
  const[lang,setLang]=useState('en');
  useEffect(()=>{
    setLang(getLangFromStorage());
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const[{data:p},{data:pr}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',session.user.id).single(),
        sb.from('user_preferences').select('language').eq('user_id',session.user.id).single(),
      ]);
      if(p){setProfile(p);setName(p.full_name||'');setRole(p.role||'Student');}
      if(pr?.language){setLang(pr.language);setLangInStorage(pr.language);}
      setLoading(false);
    });
  },[]);
  const saveProfile=async()=>{
    setSaving(true);const{data:{session}}=await sb.auth.getSession();
    if(session){await sb.from('profiles').update({full_name:name.trim(),role,updated_at:new Date().toISOString()}).eq('id',session.user.id);setSaved('p');setTimeout(()=>setSaved(''),2000);}
    setSaving(false);
  };
  const saveLang=async()=>{
    setSaving(true);const{data:{session}}=await sb.auth.getSession();
    if(session){
      await sb.from('user_preferences').upsert({user_id:session.user.id,language:lang,updated_at:new Date().toISOString()},{onConflict:'user_id'});
      setLangInStorage(lang);
      setSaved('l');setTimeout(()=>setSaved(''),2500);
      // Force page reload to apply language everywhere
      setTimeout(()=>window.location.reload(),600);
    }
    setSaving(false);
  };
  const currentPlan=profile?.plan||'free';
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  const TabBtn=({id,label}:{id:typeof tab,label:string})=>(
    <button onClick={()=>setTab(id)} style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:tab===id?600:400,background:tab===id?'rgba(0,242,255,.1)':'transparent',border:'1px solid '+(tab===id?'rgba(0,242,255,.3)':'rgba(255,255,255,.07)'),color:tab===id?'#00f2ff':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>{label}</button>
  );
  return(
    <div style={{paddingBottom:48,maxWidth:860}}>
      <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>Settings</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:22}}>Manage your account and subscription.</p>
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        <TabBtn id="profile" label="Profile"/><TabBtn id="language" label="Language"/><TabBtn id="billing" label="Billing"/>
      </div>

      {tab==='profile'&&(
        <div style={card}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:18,fontFamily:"'Orbitron',monospace"}}>Profile</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Full Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp}/></div>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Role</label><select value={role} onChange={e=>setRole(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>{['Student','Freelancer','Entrepreneur','Employee','Investor','Other'].map(r=><option key={r} style={{background:'#0d1117'}}>{r}</option>)}</select></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={saveProfile} disabled={saving} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?0.7:1}}>{saving?'Saving...':'Save Profile'}</button>
            {saved==='p'&&<span style={{fontSize:12,color:'#10b981'}}>✓ Saved</span>}
          </div>
        </div>
      )}

      {tab==='language'&&(
        <div style={card}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Interface Language</div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:18,lineHeight:1.6}}>
            Select your language. The entire dashboard will switch to your chosen language including all menus, labels, and buttons. Pashto (پښتو), Dari, Arabic, and Urdu display right-to-left automatically.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(162px,1fr))',gap:8,marginBottom:22}}>
            {LANGS.map(l=>(
              <div key={l.code} onClick={()=>setLang(l.code)} style={{padding:'11px 14px',borderRadius:10,cursor:'pointer',border:'1px solid '+(lang===l.code?'rgba(0,242,255,.45)':'rgba(255,255,255,.07)'),background:lang===l.code?'rgba(0,242,255,.08)':'rgba(255,255,255,.02)',transition:'all .15s',direction:l.rtl?'rtl':'ltr'}}>
                <div style={{fontSize:14,color:lang===l.code?'#00f2ff':'rgba(255,255,255,.72)',fontWeight:lang===l.code?600:400}}>{l.native}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,.28)',marginTop:3,direction:'ltr'}}>{l.name}</div>
                {lang===l.code&&<div style={{marginTop:4,fontSize:9,color:'#00f2ff',opacity:.7}}>✓ Selected</div>}
              </div>
            ))}
          </div>
          <div style={{background:'rgba(0,242,255,.05)',border:'1px solid rgba(0,242,255,.12)',borderRadius:9,padding:'10px 14px',marginBottom:18,fontSize:12,color:'rgba(0,242,255,.7)',lineHeight:1.6}}>
            After saving, the page will reload and apply <strong>{LANGS.find(l=>l.code===lang)?.native||'English'}</strong> across the entire dashboard.
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={saveLang} disabled={saving} style={{padding:'10px 28px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?0.7:1}}>
              {saving?'Applying...':'Save & Apply Language'}
            </button>
            {saved==='l'&&<span style={{fontSize:12,color:'#10b981'}}>✓ Language applied! Reloading...</span>}
          </div>
        </div>
      )}

      {tab==='billing'&&(
        <>
        <div style={{...card,marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Current Plan</div>
            <span style={{padding:'4px 14px',borderRadius:100,fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',background:currentPlan==='premium'?'rgba(255,215,0,.1)':currentPlan==='pro'?'rgba(0,242,255,.08)':'rgba(255,255,255,.05)',border:`1px solid ${currentPlan==='premium'?'rgba(255,215,0,.28)':currentPlan==='pro'?'rgba(0,242,255,.22)':'rgba(255,255,255,.1)'}`,color:currentPlan==='premium'?'#ffd700':currentPlan==='pro'?'#00f2ff':'rgba(255,255,255,.4)'}}>{currentPlan}</span>
          </div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.38)',lineHeight:1.6}}>{currentPlan==='free'?'Upgrade to unlock AI Advisor, unlimited transactions, Tax Radar, Growth Engine and more.':currentPlan==='pro'?'Pro active. Upgrade to Premium for full Vault, PDF reports, and priority AI.':'Full Premium access. Thank you for supporting FlowFund.'}</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {PLANS.map(plan=>{
            const isCurrent=currentPlan===plan.id;
            return(
              <div key={plan.id} style={{background:'rgba(13,17,23,.85)',border:`2px solid ${isCurrent?plan.col:plan.bdr}`,borderRadius:16,padding:22,position:'relative'}}>
                {(plan as any).badge&&!isCurrent&&<div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',fontSize:8,fontWeight:700,fontFamily:"'Orbitron',monospace",padding:'2px 12px',borderRadius:100,whiteSpace:'nowrap'}}>{(plan as any).badge}</div>}
                {isCurrent&&<div style={{position:'absolute',top:-10,right:12,background:'rgba(16,185,129,.9)',color:'#fff',fontSize:8,padding:'2px 10px',borderRadius:100,fontFamily:"'Orbitron',monospace"}}>ACTIVE</div>}
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:700,color:plan.col,marginBottom:6}}>{plan.label}</div>
                <div style={{marginBottom:14}}><span style={{fontFamily:"'Orbitron',monospace",fontSize:24,fontWeight:900,color:'#fff'}}>{plan.price}</span><span style={{fontSize:11,color:'rgba(255,255,255,.3)',marginLeft:3}}>{plan.sub}</span></div>
                {plan.features.map(f=><div key={f} style={{display:'flex',gap:7,fontSize:11,marginBottom:5,color:'rgba(255,255,255,.52)'}}><span style={{color:'#10b981',flexShrink:0}}>✓</span>{f}</div>)}
                {!isCurrent&&plan.id!=='free'&&<button style={{width:'100%',marginTop:14,padding:'9px',borderRadius:9,background:plan.id==='premium'?'linear-gradient(135deg,#ffd700,#daa520)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:plan.id==='premium'?'#000':'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>Upgrade to {plan.label}</button>}
              </div>
            );
          })}
        </div>
        <p style={{textAlign:'center',marginTop:18,fontSize:11,color:'rgba(255,255,255,.2)'}}>Payments via NOWPayments — BTC, ETH, USDT, USDC and 150+ coins. Zero KYC.</p>
        </>
      )}
    </div>
  );
}
