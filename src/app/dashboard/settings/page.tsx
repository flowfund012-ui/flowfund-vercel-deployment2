'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');

const LANGUAGES=[
  {code:'en',name:'English',native:'English'},
  {code:'ps',name:'Pashto',native:'پښتو'},
  {code:'fa',name:'Dari / Persian',native:'دری'},
  {code:'ar',name:'Arabic',native:'العربية'},
  {code:'de',name:'German',native:'Deutsch'},
  {code:'fr',name:'French',native:'Français'},
  {code:'es',name:'Spanish',native:'Español'},
  {code:'zh',name:'Chinese',native:'中文'},
  {code:'hi',name:'Hindi',native:'हिन्दी'},
  {code:'ur',name:'Urdu',native:'اردو'},
  {code:'tr',name:'Turkish',native:'Türkçe'},
  {code:'ru',name:'Russian',native:'Русский'},
  {code:'pt',name:'Portuguese',native:'Português'},
  {code:'it',name:'Italian',native:'Italiano'},
  {code:'ja',name:'Japanese',native:'日本語'},
  {code:'ko',name:'Korean',native:'한국어'},
  {code:'nl',name:'Dutch',native:'Nederlands'},
  {code:'pl',name:'Polish',native:'Polski'},
  {code:'sv',name:'Swedish',native:'Svenska'},
  {code:'no',name:'Norwegian',native:'Norsk'},
];

const COUNTRIES=[
  {code:'AF',name:'Afghanistan',currency:'AFN',vat:0,income_brackets:[{upto:0,rate:0},{upto:12500,rate:2},{upto:100000,rate:10},{upto:999999999,rate:20}]},
  {code:'DE',name:'Germany',currency:'EUR',vat:19,income_brackets:[{upto:10908,rate:0},{upto:62810,rate:14},{upto:277826,rate:42},{upto:999999999,rate:45}]},
  {code:'US',name:'United States',currency:'USD',vat:0,income_brackets:[{upto:11600,rate:10},{upto:47150,rate:12},{upto:100525,rate:22},{upto:191950,rate:24},{upto:243725,rate:32},{upto:609350,rate:35},{upto:999999999,rate:37}]},
  {code:'GB',name:'United Kingdom',currency:'GBP',vat:20,income_brackets:[{upto:12570,rate:0},{upto:50270,rate:20},{upto:125140,rate:40},{upto:999999999,rate:45}]},
  {code:'FR',name:'France',currency:'EUR',vat:20,income_brackets:[{upto:11294,rate:0},{upto:28797,rate:11},{upto:82341,rate:30},{upto:177106,rate:41},{upto:999999999,rate:45}]},
  {code:'CA',name:'Canada',currency:'CAD',vat:5,income_brackets:[{upto:53359,rate:15},{upto:106717,rate:20.5},{upto:165430,rate:26},{upto:235675,rate:29.32},{upto:999999999,rate:33}]},
  {code:'AU',name:'Australia',currency:'AUD',vat:10,income_brackets:[{upto:18200,rate:0},{upto:45000,rate:19},{upto:120000,rate:32.5},{upto:180000,rate:37},{upto:999999999,rate:45}]},
  {code:'IN',name:'India',currency:'INR',vat:18,income_brackets:[{upto:250000,rate:0},{upto:500000,rate:5},{upto:1000000,rate:20},{upto:999999999,rate:30}]},
  {code:'PK',name:'Pakistan',currency:'PKR',vat:17,income_brackets:[{upto:600000,rate:0},{upto:1200000,rate:5},{upto:2400000,rate:15},{upto:3600000,rate:25},{upto:999999999,rate:35}]},
  {code:'TR',name:'Turkey',currency:'TRY',vat:20,income_brackets:[{upto:110000,rate:15},{upto:230000,rate:20},{upto:580000,rate:27},{upto:3000000,rate:35},{upto:999999999,rate:40}]},
  {code:'SA',name:'Saudi Arabia',currency:'SAR',vat:15,income_brackets:[{upto:999999999,rate:0}]},
  {code:'AE',name:'UAE',currency:'AED',vat:5,income_brackets:[{upto:999999999,rate:0}]},
  {code:'NG',name:'Nigeria',currency:'NGN',vat:7.5,income_brackets:[{upto:300000,rate:7},{upto:600000,rate:11},{upto:1100000,rate:15},{upto:1600000,rate:19},{upto:3200000,rate:21},{upto:999999999,rate:24}]},
  {code:'ZA',name:'South Africa',currency:'ZAR',vat:15,income_brackets:[{upto:237100,rate:18},{upto:370500,rate:26},{upto:512800,rate:31},{upto:673000,rate:36},{upto:857900,rate:39},{upto:1817000,rate:41},{upto:999999999,rate:45}]},
  {code:'BR',name:'Brazil',currency:'BRL',vat:10,income_brackets:[{upto:28559,rate:0},{upto:42750,rate:7.5},{upto:57422,rate:15},{upto:82666,rate:22.5},{upto:999999999,rate:27.5}]},
  {code:'MX',name:'Mexico',currency:'MXN',vat:16,income_brackets:[{upto:8952,rate:1.92},{upto:75984,rate:6.4},{upto:133536,rate:10.88},{upto:155232,rate:16},{upto:185852,rate:17.92},{upto:374838,rate:21.36},{upto:590796,rate:23.52},{upto:1127926,rate:30},{upto:999999999,rate:35}]},
  {code:'CN',name:'China',currency:'CNY',vat:13,income_brackets:[{upto:36000,rate:3},{upto:144000,rate:10},{upto:300000,rate:20},{upto:420000,rate:25},{upto:660000,rate:30},{upto:960000,rate:35},{upto:999999999,rate:45}]},
  {code:'JP',name:'Japan',currency:'JPY',vat:10,income_brackets:[{upto:1950000,rate:5},{upto:3300000,rate:10},{upto:6950000,rate:20},{upto:9000000,rate:23},{upto:18000000,rate:33},{upto:40000000,rate:40},{upto:999999999,rate:45}]},
  {code:'KR',name:'South Korea',currency:'KRW',vat:10,income_brackets:[{upto:14000000,rate:6},{upto:50000000,rate:15},{upto:88000000,rate:24},{upto:150000000,rate:35},{upto:300000000,rate:38},{upto:500000000,rate:40},{upto:1000000000,rate:42},{upto:999999999999,rate:45}]},
  {code:'EG',name:'Egypt',currency:'EGP',vat:14,income_brackets:[{upto:40000,rate:0},{upto:55000,rate:10},{upto:70000,rate:15},{upto:200000,rate:20},{upto:400000,rate:22.5},{upto:999999999,rate:25}]},
];

function calcTax(income:number,brackets:{upto:number,rate:number}[]){
  let tax=0;let prev=0;
  for(const b of brackets){
    if(income<=prev)break;
    const slice=Math.min(income,b.upto)-prev;
    tax+=slice*(b.rate/100);
    prev=b.upto;
  }
  return{tax:Math.round(tax*100)/100,effectiveRate:income>0?Math.round((tax/income)*1000)/10:0};
}

const PLANS=[
  {id:'free',name:'Free',price:'$0',period:'/forever',color:'rgba(255,255,255,.35)',border:'rgba(255,255,255,.09)',features:['Dashboard & AI Score','50 transactions/month','Mission Tracker','1 savings goal','3 Academy courses','2 Vault assets']},
  {id:'pro',name:'Pro',price:'$19',period:'/month',color:'#00f2ff',border:'rgba(0,242,255,.28)',features:['Everything in Free','Unlimited transactions','Full AI Advisor + Chat','Growth Engine','All Academy courses','Vault assets + drops','Budgets all categories','Debt Planner with AI','Cashflow forecasting','CSV export']},
  {id:'premium',name:'Premium',price:'$39',period:'/month',color:'#ffd700',border:'rgba(255,215,0,.32)',badge:'BEST VALUE',features:['Everything in Pro','Unlimited Vault access','Monthly hidden drops','Priority AI analysis','PDF financial reports','Early feature access','Custom categories','Tax Radar pro features']},
];

export default function SettingsPage(){
  const [profile,setProfile]=useState<any>(null);
  const [prefs,setPrefs]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState('');
  const [name,setName]=useState('');
  const [role,setRole]=useState('Student');
  const [activeTab,setActiveTab]=useState<'profile'|'billing'|'tax'|'language'|'banksync'>('profile');
  const [taxIncome,setTaxIncome]=useState('');
  const [selectedCountry,setSelectedCountry]=useState('US');
  const [selectedLang,setSelectedLang]=useState('en');
  const [bankConnections,setBankConnections]=useState<any[]>([]);
  const [showPayment,setShowPayment]=useState('');
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:p},{data:pr},{data:bc}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',uid).single(),
        sb.from('user_preferences').select('*').eq('user_id',uid).single(),
        sb.from('bank_connections').select('*').eq('user_id',uid),
      ]);
      setProfile(p);setName(p?.full_name||'');setRole(p?.role||'Student');
      if(pr){setPrefs(pr);setSelectedCountry(pr.country_code||'US');setSelectedLang(pr.language||'en');}
      setBankConnections(bc??[]);setLoading(false);
    });
  },[]);
  const saveProfile=async()=>{
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(session){
      await sb.from('profiles').update({full_name:name.trim(),role,updated_at:new Date().toISOString()}).eq('id',session.user.id);
      setSaved('profile');setTimeout(()=>setSaved(''),2000);
    }
    setSaving(false);
  };
  const savePrefs=async()=>{
    setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(session){
      const country=COUNTRIES.find(c=>c.code===selectedCountry);
      await sb.from('user_preferences').upsert({user_id:session.user.id,language:selectedLang,country_code:selectedCountry,currency:country?.currency||'USD',updated_at:new Date().toISOString()},{onConflict:'user_id'});
      setSaved('prefs');setTimeout(()=>setSaved(''),2000);
    }
    setSaving(false);
  };
  const country=COUNTRIES.find(c=>c.code===selectedCountry)||COUNTRIES[0];
  const income=parseFloat(taxIncome)||0;
  const{tax,effectiveRate}=calcTax(income,country.income_brackets);
  const takeHome=income-tax;
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.055)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:"'Inter',sans-serif"};
  const tab=(id:typeof activeTab,label:string)=>(
    <button onClick={()=>setActiveTab(id)} style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:activeTab===id?600:400,background:activeTab===id?'rgba(0,242,255,.1)':'transparent',border:'1px solid '+(activeTab===id?'rgba(0,242,255,.28)':'rgba(255,255,255,.08)'),color:activeTab===id?'#00f2ff':'rgba(255,255,255,.5)',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>{label}</button>
  );
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  const currentPlan=profile?.plan||'free';
  return(
    <div style={{paddingBottom:48,maxWidth:900,margin:'0 auto'}}>
      <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>Settings</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:22}}>Manage your account, preferences, and subscription.</p>
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        {tab('profile','Profile')}
        {tab('language','Language')}
        {tab('tax','Tax Radar')}
        {tab('banksync','Bank Sync')}
        {tab('billing','Billing')}
      </div>

      {activeTab==='profile'&&(
        <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:18,fontFamily:"'Orbitron',monospace"}}>Profile</div>
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
            {saved==='profile'&&<span style={{fontSize:12,color:'#10b981'}}>Saved!</span>}
          </div>
        </div>
      )}

      {activeTab==='language'&&(
        <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Interface Language</div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:20}}>Choose your preferred language. Pashto, Dari, Arabic and other RTL languages are supported.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8,marginBottom:20}}>
            {LANGUAGES.map(lang=>(
              <div key={lang.code} onClick={()=>setSelectedLang(lang.code)} style={{padding:'10px 14px',borderRadius:10,cursor:'pointer',border:'1px solid '+(selectedLang===lang.code?'rgba(0,242,255,.4)':'rgba(255,255,255,.07)'),background:selectedLang===lang.code?'rgba(0,242,255,.08)':'rgba(255,255,255,.025)',transition:'all .15s'}}>
                <div style={{fontSize:13,color:selectedLang===lang.code?'#00f2ff':'rgba(255,255,255,.7)',fontWeight:selectedLang===lang.code?600:400}}>{lang.native}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:2}}>{lang.name}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={savePrefs} disabled={saving} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>Save Language</button>
            {saved==='prefs'&&<span style={{fontSize:12,color:'#10b981'}}>Saved!</span>}
          </div>
        </div>
      )}

      {activeTab==='tax'&&(
        <div>
          <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28,marginBottom:16}}>
            <div style={{fontSize:11,color:'rgba(0,242,255,.8)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Tax Radar</div>
            <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:20}}>Calculate your real tax liability based on your region. Select your country to apply the correct tax brackets automatically.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <div>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Country / Region</label>
                <select value={selectedCountry} onChange={e=>setSelectedCountry(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                  {COUNTRIES.sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.code} value={c.code} style={{background:'#0d1117'}}>{c.name} ({c.currency})</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Annual Income ({country.currency})</label>
                <input type="number" value={taxIncome} onChange={e=>setTaxIncome(e.target.value)} placeholder="e.g. 60000" style={inp}/>
              </div>
            </div>
            {income>0&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
                {[
                  {l:'Income Tax',v:tax.toLocaleString()+' '+country.currency,c:'#ef4444',bg:'rgba(239,68,68,.07)',b:'rgba(239,68,68,.18)'},
                  {l:'Effective Rate',v:effectiveRate+'%',c:'#f59e0b',bg:'rgba(245,158,11,.07)',b:'rgba(245,158,11,.18)'},
                  {l:'Take-Home',v:takeHome.toLocaleString()+' '+country.currency,c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.18)'},
                ].map(c=>(
                  <div key={c.l} style={{background:c.bg,border:`1px solid ${c.b}`,borderRadius:12,padding:'14px 16px',textAlign:'center'}}>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.07em'}}>{c.l}</div>
                    <div style={{fontSize:18,fontWeight:700,color:c.c,fontFamily:"'Roboto Mono',monospace"}}>{c.v}</div>
                  </div>
                ))}
              </div>
            )}
            {country.vat>0&&<div style={{fontSize:12,color:'rgba(255,255,255,.35)',padding:'8px 12px',background:'rgba(255,255,255,.04)',borderRadius:8,border:'1px solid rgba(255,255,255,.07)'}}>VAT / Sales tax in {country.name}: {country.vat}%</div>}
          </div>
          <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:24}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.38)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Tax Brackets — {country.name}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {country.income_brackets.map((b,i)=>{
                const from=i===0?0:(country.income_brackets[i-1].upto+1);
                const toStr=b.upto>=999999999?'∞':b.upto.toLocaleString();
                return(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 14px',borderRadius:8,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.05)'}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>{country.currency} {from.toLocaleString()} – {toStr}</span>
                    <span style={{fontSize:13,fontWeight:600,color:b.rate===0?'#10b981':b.rate<20?'#f59e0b':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{b.rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab==='banksync'&&(
        <div>
          <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28,marginBottom:16}}>
            <div style={{fontSize:11,color:'rgba(0,242,255,.8)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Bank Sync</div>
            <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:20}}>Choose how you want to add transactions. Manual entry gives full control. CSV import lets you upload your bank export. Plaid sync connects directly to your bank for automatic updates.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
              {[
                {id:'manual',label:'Manual Entry',desc:'Type each transaction yourself. Full control, zero data sharing.',icon:'✏️',color:'rgba(255,255,255,.5)',border:'rgba(255,255,255,.15)'},
                {id:'csv',label:'CSV Import',desc:'Export from your bank and upload monthly. Works with any bank worldwide.',icon:'📄',color:'#00f2ff',border:'rgba(0,242,255,.28)'},
                {id:'plaid',label:'Plaid Sync',desc:'Automatic real-time sync. Connects to 12,000+ banks in US, UK, EU, CA.',icon:'🔗',color:'#a78bfa',border:'rgba(167,139,250,.28)'},
              ].map(opt=>{
                const active=bankConnections.find(c=>c.sync_method===opt.id);
                return(
                  <div key={opt.id} style={{border:`1px solid ${opt.border}`,borderRadius:14,padding:20,background:'rgba(255,255,255,.025)',transition:'all .2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.025)';}}>
                    <div style={{fontSize:24,marginBottom:10}}>{opt.icon}</div>
                    <div style={{fontSize:14,fontWeight:600,color:opt.color,marginBottom:6}}>{opt.label}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,.4)',lineHeight:1.5,marginBottom:14}}>{opt.desc}</div>
                    <div style={{padding:'4px 10px',borderRadius:100,fontSize:10,display:'inline-block',background:opt.id==='manual'?'rgba(16,185,129,.12)':'rgba(255,255,255,.06)',color:opt.id==='manual'?'#10b981':'rgba(255,255,255,.35)',border:`1px solid ${opt.id==='manual'?'rgba(16,185,129,.25)':'rgba(255,255,255,.08)'}`}}>
                      {opt.id==='manual'?'Active (default)':opt.id==='plaid'?'Coming soon':'Available'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{background:'rgba(0,242,255,.05)',border:'1px solid rgba(0,242,255,.15)',borderRadius:10,padding:'12px 16px',fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.6}}>
              Currently on manual entry. CSV import works with any bank — export your transactions as CSV, upload here, and FlowFund will categorize them automatically using AI. Plaid direct sync is coming in the next release.
            </div>
          </div>
          <div style={{background:'rgba(13,17,23,.85)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:24}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.38)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:16,fontFamily:"'Orbitron',monospace"}}>Connected Accounts</div>
            {bankConnections.length===0?(
              <div style={{textAlign:'center',padding:'24px 0',color:'rgba(255,255,255,.28)',fontSize:13}}>No bank accounts connected yet.</div>
            ):(
              bankConnections.map(c=>(
                <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                  <div>
                    <div style={{fontSize:13,color:'#e2e8f0'}}>{c.bank_name}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{c.account_type} {c.last_four?`••••${c.last_four}`:''}</div>
                  </div>
                  <span style={{padding:'3px 10px',borderRadius:100,fontSize:10,background:c.status==='active'?'rgba(16,185,129,.12)':'rgba(245,158,11,.1)',color:c.status==='active'?'#10b981':'#f59e0b',border:`1px solid ${c.status==='active'?'rgba(16,185,129,.25)':'rgba(245,158,11,.2)'}`}}>{c.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab==='billing'&&(
        <div>
          <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:24,marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:"'Orbitron',monospace"}}>Current Plan</div>
              <div style={{padding:'4px 14px',borderRadius:100,background:currentPlan==='premium'?'rgba(255,215,0,.1)':currentPlan==='pro'?'rgba(0,242,255,.08)':'rgba(255,255,255,.05)',border:`1px solid ${currentPlan==='premium'?'rgba(255,215,0,.28)':currentPlan==='pro'?'rgba(0,242,255,.22)':'rgba(255,255,255,.1)'}`,fontSize:11,fontWeight:700,color:currentPlan==='premium'?'#ffd700':currentPlan==='pro'?'#00f2ff':'rgba(255,255,255,.45)',textTransform:'uppercase',letterSpacing:'.08em'}}>{currentPlan}</div>
            </div>
            <p style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>{currentPlan==='free'?'Upgrade to Pro or Premium to unlock AI Advisor, unlimited transactions, Tax Radar, and all modules.':currentPlan==='pro'?'Pro plan active. Upgrade to Premium for full Vault access and PDF reports.':'Full access. Thank you for supporting FlowFund.'}</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {PLANS.map(plan=>{
              const isCurrent=currentPlan===plan.id;
              return(
                <div key={plan.id} style={{background:'rgba(13,17,23,.85)',border:`1px solid ${isCurrent?plan.color:plan.border}`,borderRadius:16,padding:24,position:'relative',transition:'transform .2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
                  {(plan as any).badge&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',fontFamily:"'Orbitron',monospace",fontSize:9,fontWeight:700,padding:'3px 14px',borderRadius:100,whiteSpace:'nowrap'}}>{(plan as any).badge}</div>}
                  {isCurrent&&<div style={{position:'absolute',top:-11,right:14,background:'rgba(16,185,129,.9)',color:'#fff',fontSize:9,padding:'3px 10px',borderRadius:100,fontFamily:"'Orbitron',monospace"}}>ACTIVE</div>}
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,color:plan.color,marginBottom:6}}>{plan.name}</div>
                  <div style={{marginBottom:14}}><span style={{fontFamily:"'Orbitron',monospace",fontSize:26,fontWeight:900,color:'#fff'}}>{plan.price}</span><span style={{fontSize:12,color:'rgba(255,255,255,.35)',marginLeft:3}}>{plan.period}</span></div>
                  {plan.features.map(f=><div key={f} style={{display:'flex',gap:7,fontSize:11,marginBottom:6,color:'rgba(255,255,255,.55)'}}><span style={{color:'#10b981',marginTop:1,flexShrink:0}}>✓</span>{f}</div>)}
                  {!isCurrent&&plan.id!=='free'&&(
                    <button onClick={()=>setShowPayment(plan.id)} style={{width:'100%',marginTop:16,padding:'10px',borderRadius:9,background:plan.id==='premium'?'linear-gradient(135deg,#ffd700,#daa520)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:plan.id==='premium'?'#000':'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                      Upgrade to {plan.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{textAlign:'center',marginTop:20,fontSize:11,color:'rgba(255,255,255,.22)'}}>Payments via NOWPayments — BTC, ETH, USDT, USDC and 150+ coins. Zero KYC. Cancel anytime.</p>
        </div>
      )}
    </div>
  );
}
