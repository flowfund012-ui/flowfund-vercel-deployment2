'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const PLANS=[
  {id:'free',name:'Free',price:'$0',period:'/forever',color:'rgba(255,255,255,.35)',border:'rgba(255,255,255,.1)',features:['Dashboard & AI Score','50 transactions/month','Mission Tracker','1 savings goal','3 Academy courses','2 Vault assets']},
  {id:'pro',name:'Pro',price:'$19',period:'/month',color:'#00f2ff',border:'rgba(0,242,255,.3)',badge:'',features:['Everything in Free','Unlimited transactions','Full AI Advisor + Chat','Growth Engine','All Academy courses','4 Vault assets + drops','Budget tracker (all cats)','Debt Planner with AI','Cashflow forecasting','CSV export']},
  {id:'premium',name:'Premium',price:'$39',period:'/month',color:'#ffd700',border:'rgba(255,215,0,.35)',badge:'BEST VALUE',features:['Everything in Pro','Unlimited Vault access','Hidden monthly drops','Priority AI analysis','PDF financial reports','Early feature access','Custom categories']},
];
export default function SettingsPage(){
  const [profile,setProfile]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [name,setName]=useState('');
  const [role,setRole]=useState('');
  const [saved,setSaved]=useState(false);
  const [showPayment,setShowPayment]=useState(false);
  const [selectedPlan,setSelectedPlan]=useState('');
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const{data:p}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
      setProfile(p);setName(p?.full_name||'');setRole(p?.role||'Student');setLoading(false);
    });
  },[]);
  const saveProfile=async()=>{
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(session){await sb.from('profiles').update({full_name:name.trim(),role}).eq('id',session.user.id);setSaved(true);setTimeout(()=>setSaved(false),2500);}
    setSaving(false);
  };
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif"};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  const currentPlan=profile?.plan||'free';
  return(
    <div style={{paddingBottom:48,maxWidth:900,margin:'0 auto'}}>
      <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:22,fontWeight:700,color:'#fff',marginBottom:4}}>Settings & Billing</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:28}}>Manage your account, preferences, and subscription.</p>
      {/* Profile */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28,marginBottom:20}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:18,fontFamily:"'Orbitron',monospace"}}>Profile</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:18}}>
          <div>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp}/>
          </div>
          <div>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
              {['Student','Freelancer','Entrepreneur','Employee','Investor','Other'].map(r=><option key={r} style={{background:'#0d1117'}}>{r}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <button onClick={saveProfile} disabled={saving} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:saving?.7:1}}>
            {saving?'Saving...':'Save Profile'}
          </button>
          {saved&&<span style={{fontSize:12,color:'#10b981'}}>Saved!</span>}
        </div>
      </div>
      {/* Plan status */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:"'Orbitron',monospace"}}>Current Plan</div>
          <div style={{padding:'4px 14px',borderRadius:100,background:currentPlan==='premium'?'rgba(255,215,0,.12)':currentPlan==='pro'?'rgba(0,242,255,.1)':'rgba(255,255,255,.06)',border:`1px solid ${currentPlan==='premium'?'rgba(255,215,0,.3)':currentPlan==='pro'?'rgba(0,242,255,.25)':'rgba(255,255,255,.12)'}`,fontSize:12,fontWeight:700,color:currentPlan==='premium'?'#ffd700':currentPlan==='pro'?'#00f2ff':'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.08em'}}>{currentPlan}</div>
        </div>
        {currentPlan==='free'&&<p style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>You are on the free plan. Upgrade to Pro or Premium to unlock the full AI Advisor, unlimited transactions, and all modules.</p>}
        {currentPlan==='pro'&&<p style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>Pro plan active. To cancel, contact support. Upgrade to Premium for the full Vault and PDF reports.</p>}
        {currentPlan==='premium'&&<p style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>Premium plan active — full access to everything. Thank you.</p>}
      </div>
      {/* Pricing cards */}
      <div style={{fontSize:12,color:'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:16,fontFamily:"'Orbitron',monospace"}}>Plans</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20}}>
        {PLANS.map(plan=>{
          const isCurrent=currentPlan===plan.id;
          return(
            <div key={plan.id} style={{background:'rgba(13,17,23,.85)',border:`1px solid ${isCurrent?plan.color:plan.border}`,borderRadius:16,padding:24,position:'relative',transition:'transform .2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
              {plan.badge&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',fontFamily:"'Orbitron',monospace",fontSize:9,fontWeight:700,padding:'3px 14px',borderRadius:100,whiteSpace:'nowrap'}}>{plan.badge}</div>}
              {isCurrent&&<div style={{position:'absolute',top:-11,right:14,background:'rgba(16,185,129,.9)',color:'#fff',fontSize:9,fontWeight:700,padding:'3px 10px',borderRadius:100,fontFamily:"'Orbitron',monospace"}}>CURRENT</div>}
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:700,color:plan.color,marginBottom:6}}>{plan.name}</div>
              <div style={{marginBottom:16}}>
                <span style={{fontFamily:"'Orbitron',monospace",fontSize:28,fontWeight:900,color:'#fff'}}>{plan.price}</span>
                <span style={{fontSize:12,color:'rgba(255,255,255,.35)',marginLeft:3}}>{plan.period}</span>
              </div>
              {plan.features.map(feat=>(
                <div key={feat} style={{display:'flex',alignItems:'flex-start',gap:7,marginBottom:7,fontSize:12,color:'rgba(255,255,255,.55)'}}>
                  <span style={{color:'#10b981',marginTop:1,flexShrink:0,fontSize:10}}>✓</span>{feat}
                </div>
              ))}
              {!isCurrent&&plan.id!=='free'&&(
                <button onClick={()=>{setSelectedPlan(plan.id);setShowPayment(true);}} style={{width:'100%',marginTop:18,padding:'10px',borderRadius:9,background:plan.id==='premium'?'linear-gradient(135deg,#ffd700,#daa520)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:plan.id==='premium'?'#000':'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                  Upgrade to {plan.name}
                </button>
              )}
              {!isCurrent&&plan.id==='free'&&currentPlan!=='free'&&(
                <button style={{width:'100%',marginTop:18,padding:'10px',borderRadius:9,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.5)',cursor:'pointer',fontSize:13,fontFamily:"'Inter',sans-serif"}}>
                  Downgrade (contact support)
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p style={{fontSize:11,color:'rgba(255,255,255,.25)',textAlign:'center'}}>All paid plans use crypto via NOWPayments — BTC, ETH, USDT, USDC and 150+ coins. Zero KYC. Cancel anytime.</p>
      {/* Payment Modal */}
      {showPayment&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowPayment(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20,backdropFilter:'blur(5px)'}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(255,215,0,.25)',borderRadius:18,padding:32,width:'100%',maxWidth:420,textAlign:'center'}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:16,color:'#ffd700',marginBottom:6}}>Upgrade to {selectedPlan}</div>
            <p style={{fontSize:13,color:'rgba(255,255,255,.5)',lineHeight:1.6,marginBottom:20}}>Payment is processed via NOWPayments. Click below to be directed to the payment page. After payment, your plan will be activated within a few minutes.</p>
            <div style={{background:'rgba(255,215,0,.06)',border:'1px solid rgba(255,215,0,.2)',borderRadius:12,padding:16,marginBottom:20}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,.45)',marginBottom:8}}>Accepted cryptocurrencies</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
                {['Bitcoin','Ethereum','USDT','USDC','Litecoin','Solana','150+ more'].map(c=>(
                  <span key={c} style={{padding:'3px 10px',fontSize:11,borderRadius:100,background:'rgba(255,215,0,.08)',border:'1px solid rgba(255,215,0,.15)',color:'rgba(255,215,0,.7)'}}>{c}</span>
                ))}
              </div>
            </div>
            <a href="https://nowpayments.io" target="_blank" rel="noopener noreferrer" style={{display:'block',padding:'13px',borderRadius:10,background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',textDecoration:'none',fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",marginBottom:10}}>
              Pay with Crypto via NOWPayments
            </a>
            <button onClick={()=>setShowPayment(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',cursor:'pointer',fontSize:13,fontFamily:"'Inter',sans-serif"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
