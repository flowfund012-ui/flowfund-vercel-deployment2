'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const LANGS=[{code:'en',name:'English',native:'English'},{code:'ps',name:'Pashto',native:'پښتو'},{code:'fa',name:'Dari',native:'دری'},{code:'ar',name:'Arabic',native:'العربية'},{code:'de',name:'German',native:'Deutsch'},{code:'fr',name:'French',native:'Français'},{code:'es',name:'Spanish',native:'Español'},{code:'zh',name:'Chinese',native:'中文'},{code:'hi',name:'Hindi',native:'हिन्दी'},{code:'ur',name:'Urdu',native:'اردو'},{code:'tr',name:'Turkish',native:'Türkçe'},{code:'ru',name:'Russian',native:'Русский'},{code:'pt',name:'Portuguese',native:'Português'},{code:'it',name:'Italian',native:'Italiano'},{code:'ja',name:'Japanese',native:'日本語'},{code:'ko',name:'Korean',native:'한국어'},{code:'nl',name:'Dutch',native:'Nederlands'},{code:'pl',name:'Polish',native:'Polski'},{code:'sv',name:'Swedish',native:'Svenska'},{code:'no',name:'Norwegian',native:'Norsk'}];
const COUNTRIES=[
  {code:'AF',name:'Afghanistan',cur:'AFN',vat:0,brackets:[{upto:0,rate:0},{upto:12500,rate:2},{upto:100000,rate:10},{upto:999999999,rate:20}]},
  {code:'DE',name:'Germany',cur:'EUR',vat:19,brackets:[{upto:10908,rate:0},{upto:62810,rate:14},{upto:277826,rate:42},{upto:999999999,rate:45}]},
  {code:'US',name:'United States',cur:'USD',vat:0,brackets:[{upto:11600,rate:10},{upto:47150,rate:12},{upto:100525,rate:22},{upto:191950,rate:24},{upto:243725,rate:32},{upto:609350,rate:35},{upto:999999999,rate:37}]},
  {code:'GB',name:'United Kingdom',cur:'GBP',vat:20,brackets:[{upto:12570,rate:0},{upto:50270,rate:20},{upto:125140,rate:40},{upto:999999999,rate:45}]},
  {code:'FR',name:'France',cur:'EUR',vat:20,brackets:[{upto:11294,rate:0},{upto:28797,rate:11},{upto:82341,rate:30},{upto:177106,rate:41},{upto:999999999,rate:45}]},
  {code:'CA',name:'Canada',cur:'CAD',vat:5,brackets:[{upto:53359,rate:15},{upto:106717,rate:20.5},{upto:165430,rate:26},{upto:235675,rate:29.32},{upto:999999999,rate:33}]},
  {code:'AU',name:'Australia',cur:'AUD',vat:10,brackets:[{upto:18200,rate:0},{upto:45000,rate:19},{upto:120000,rate:32.5},{upto:180000,rate:37},{upto:999999999,rate:45}]},
  {code:'IN',name:'India',cur:'INR',vat:18,brackets:[{upto:250000,rate:0},{upto:500000,rate:5},{upto:1000000,rate:20},{upto:999999999,rate:30}]},
  {code:'PK',name:'Pakistan',cur:'PKR',vat:17,brackets:[{upto:600000,rate:0},{upto:1200000,rate:5},{upto:2400000,rate:15},{upto:3600000,rate:25},{upto:999999999,rate:35}]},
  {code:'SA',name:'Saudi Arabia',cur:'SAR',vat:15,brackets:[{upto:999999999,rate:0}]},
  {code:'AE',name:'UAE',cur:'AED',vat:5,brackets:[{upto:999999999,rate:0}]},
  {code:'TR',name:'Turkey',cur:'TRY',vat:20,brackets:[{upto:110000,rate:15},{upto:230000,rate:20},{upto:580000,rate:27},{upto:3000000,rate:35},{upto:999999999,rate:40}]},
  {code:'NG',name:'Nigeria',cur:'NGN',vat:7.5,brackets:[{upto:300000,rate:7},{upto:600000,rate:11},{upto:1100000,rate:15},{upto:1600000,rate:19},{upto:3200000,rate:21},{upto:999999999,rate:24}]},
  {code:'ZA',name:'South Africa',cur:'ZAR',vat:15,brackets:[{upto:237100,rate:18},{upto:370500,rate:26},{upto:512800,rate:31},{upto:673000,rate:36},{upto:857900,rate:39},{upto:1817000,rate:41},{upto:999999999,rate:45}]},
  {code:'BR',name:'Brazil',cur:'BRL',vat:10,brackets:[{upto:28559,rate:0},{upto:42750,rate:7.5},{upto:57422,rate:15},{upto:82666,rate:22.5},{upto:999999999,rate:27.5}]},
  {code:'EG',name:'Egypt',cur:'EGP',vat:14,brackets:[{upto:40000,rate:0},{upto:55000,rate:10},{upto:70000,rate:15},{upto:200000,rate:20},{upto:400000,rate:22.5},{upto:999999999,rate:25}]},
  {code:'CN',name:'China',cur:'CNY',vat:13,brackets:[{upto:36000,rate:3},{upto:144000,rate:10},{upto:300000,rate:20},{upto:420000,rate:25},{upto:660000,rate:30},{upto:960000,rate:35},{upto:999999999,rate:45}]},
  {code:'JP',name:'Japan',cur:'JPY',vat:10,brackets:[{upto:1950000,rate:5},{upto:3300000,rate:10},{upto:6950000,rate:20},{upto:9000000,rate:23},{upto:18000000,rate:33},{upto:40000000,rate:40},{upto:999999999,rate:45}]},
  {code:'MX',name:'Mexico',cur:'MXN',vat:16,brackets:[{upto:8952,rate:1.92},{upto:75984,rate:6.4},{upto:133536,rate:10.88},{upto:155232,rate:16},{upto:185852,rate:17.92},{upto:374838,rate:21.36},{upto:590796,rate:23.52},{upto:1127926,rate:30},{upto:999999999,rate:35}]},
  {code:'KR',name:'South Korea',cur:'KRW',vat:10,brackets:[{upto:14000000,rate:6},{upto:50000000,rate:15},{upto:88000000,rate:24},{upto:150000000,rate:35},{upto:300000000,rate:38},{upto:500000000,rate:40},{upto:999999999999,rate:45}]},
];
function calcTax(income:number,brackets:{upto:number,rate:number}[]){let tax=0;let prev=0;for(const b of brackets){if(income<=prev)break;const slice=Math.min(income,b.upto)-prev;tax+=slice*(b.rate/100);prev=b.upto;}return{tax:Math.round(tax*100)/100,eff:income>0?Math.round((tax/income)*1000)/10:0};}
const PLANS=[
  {id:'free',label:'Free',price:'$0',sub:'/forever',col:'rgba(255,255,255,.35)',bdr:'rgba(255,255,255,.09)',features:['Dashboard & AI Score','50 transactions/month','Mission Tracker','1 savings goal','3 Academy courses','2 Vault assets']},
  {id:'pro',label:'Pro',price:'$19',sub:'/month',col:'#00f2ff',bdr:'rgba(0,242,255,.28)',features:['Everything in Free','Unlimited transactions','Full AI Advisor + Chat','Growth Engine','All Academy courses','4 Vault assets','Budgets & categories','Debt Planner with AI','Cashflow forecasting','CSV export']},
  {id:'premium',label:'Premium',price:'$39',sub:'/month',col:'#ffd700',bdr:'rgba(255,215,0,.32)',badge:'BEST VALUE',features:['Everything in Pro','Full Vault + hidden drops','PDF financial reports','Priority AI analysis','Tax Radar full access','Early feature access','Custom categories','Unlimited everything']},
];
const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
const card:React.CSSProperties={background:'rgba(13,17,23,.92)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:24,marginBottom:16};
export default function SettingsPage(){
  const[profile,setProfile]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState('');
  const[tab,setTab]=useState<'profile'|'language'|'tax'|'banksync'|'billing'>('profile');
  const[name,setName]=useState('');
  const[role,setRole]=useState('Student');
  const[lang,setLang]=useState('en');
  const[country,setCountry]=useState('US');
  const[income,setIncome]=useState('');
  const[connections,setConnections]=useState<any[]>([]);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:p},{data:pr},{data:bc}]=await Promise.all([
        sb.from('profiles').select('*').eq('id',uid).single(),
        sb.from('user_preferences').select('*').eq('user_id',uid).single(),
        sb.from('bank_connections').select('*').eq('user_id',uid),
      ]);
      if(p){setProfile(p);setName(p.full_name||'');setRole(p.role||'Student');}
      if(pr){setLang(pr.language||'en');setCountry(pr.country_code||'US');}
      setConnections(bc??[]);setLoading(false);
    });
  },[]);
  const saveProfile=async()=>{
    setSaving(true);const{data:{session}}=await sb.auth.getSession();
    if(session){await sb.from('profiles').update({full_name:name.trim(),role,updated_at:new Date().toISOString()}).eq('id',session.user.id);setSaved('p');setTimeout(()=>setSaved(''),2000);}
    setSaving(false);
  };
  const savePrefs=async()=>{
    setSaving(true);const{data:{session}}=await sb.auth.getSession();
    if(session){const c=COUNTRIES.find(x=>x.code===country);await sb.from('user_preferences').upsert({user_id:session.user.id,language:lang,country_code:country,currency:c?.cur||'USD',updated_at:new Date().toISOString()},{onConflict:'user_id'});setSaved('pr');setTimeout(()=>setSaved(''),2000);}
    setSaving(false);
  };
  const ct=COUNTRIES.find(c=>c.code===country)||COUNTRIES[2];
  const inc=parseFloat(income)||0;
  const{tax,eff}=calcTax(inc,ct.brackets);
  const take=inc-tax;
  const currentPlan=profile?.plan||'free';
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading...</div>;
  const TabBtn=({id,label}:{id:typeof tab,label:string})=>(
    <button onClick={()=>setTab(id)} style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:tab===id?600:400,background:tab===id?'rgba(0,242,255,.1)':'transparent',border:'1px solid '+(tab===id?'rgba(0,242,255,.3)':'rgba(255,255,255,.07)'),color:tab===id?'#00f2ff':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>{label}</button>
  );
  return(
    <div style={{paddingBottom:48,maxWidth:860}}>
      <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>Settings</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:22}}>Manage your account, preferences, and subscription.</p>
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        <TabBtn id="profile" label="Profile"/><TabBtn id="language" label="Language"/><TabBtn id="tax" label="Tax Radar"/><TabBtn id="banksync" label="Bank Sync"/><TabBtn id="billing" label="Billing"/>
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
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:18}}>Choose your preferred language. Pashto (پښتو), Dari, Arabic and other RTL languages supported.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:8,marginBottom:20}}>
            {LANGS.map(l=>(
              <div key={l.code} onClick={()=>setLang(l.code)} style={{padding:'10px 14px',borderRadius:10,cursor:'pointer',border:'1px solid '+(lang===l.code?'rgba(0,242,255,.4)':'rgba(255,255,255,.07)'),background:lang===l.code?'rgba(0,242,255,.07)':'rgba(255,255,255,.02)',transition:'all .15s'}}>
                <div style={{fontSize:13,color:lang===l.code?'#00f2ff':'rgba(255,255,255,.7)',fontWeight:lang===l.code?600:400}}>{l.native}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,.3)',marginTop:2}}>{l.name}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={savePrefs} disabled={saving} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>{saving?'Saving...':'Save Language'}</button>
            {saved==='pr'&&<span style={{fontSize:12,color:'#10b981'}}>✓ Saved</span>}
          </div>
        </div>
      )}

      {tab==='tax'&&(
        <>
        <div style={card}>
          <div style={{fontSize:11,color:'rgba(0,242,255,.8)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Tax Radar</div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:18}}>Real tax calculation based on your country's brackets. Select your region and enter your annual income.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Country / Region</label>
              <select value={country} onChange={e=>setCountry(e.target.value)} style={{...inp,background:'rgba(7,8,16,.95)'}}>
                {[...COUNTRIES].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.code} value={c.code} style={{background:'#0d1117'}}>{c.name} ({c.cur})</option>)}
              </select>
            </div>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Annual Income ({ct.cur})</label>
              <input type="number" value={income} onChange={e=>setIncome(e.target.value)} placeholder="e.g. 60000" style={inp}/>
            </div>
          </div>
          {inc>0&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
              {[{l:'Income Tax',v:`${tax.toLocaleString()} ${ct.cur}`,c:'#ef4444',bg:'rgba(239,68,68,.07)',b:'rgba(239,68,68,.2)'},{l:'Effective Rate',v:`${eff}%`,c:'#f59e0b',bg:'rgba(245,158,11,.07)',b:'rgba(245,158,11,.2)'},{l:'Take-Home',v:`${take.toLocaleString()} ${ct.cur}`,c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.2)'}].map(x=>(
                <div key={x.l} style={{background:x.bg,border:`1px solid ${x.b}`,borderRadius:12,padding:'14px 16px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.07em'}}>{x.l}</div>
                  <div style={{fontSize:18,fontWeight:700,color:x.c,fontFamily:"'Roboto Mono',monospace"}}>{x.v}</div>
                </div>
              ))}
            </div>
          )}
          {ct.vat>0&&<div style={{fontSize:12,color:'rgba(255,255,255,.35)',padding:'8px 12px',background:'rgba(255,255,255,.04)',borderRadius:8,border:'1px solid rgba(255,255,255,.07)'}}>VAT / Sales tax in {ct.name}: {ct.vat}%</div>}
        </div>
        <div style={{...card,marginBottom:0}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Tax Brackets — {ct.name}</div>
          {ct.brackets.map((b,i)=>{const from=i===0?0:(ct.brackets[i-1].upto+1);const toStr=b.upto>=999999999?'∞':b.upto.toLocaleString();return(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.04)',marginBottom:6}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.45)'}}>{ct.cur} {from.toLocaleString()} – {toStr}</span>
              <span style={{fontSize:13,fontWeight:600,color:b.rate===0?'#10b981':b.rate<20?'#f59e0b':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{b.rate}%</span>
            </div>
          );})}
        </div>
        </>
      )}

      {tab==='banksync'&&(
        <>
        <div style={card}>
          <div style={{fontSize:11,color:'rgba(0,242,255,.8)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>Bank Sync</div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:18}}>Choose how you add transactions. Manual gives full control. CSV lets you upload your bank export. Plaid connects directly for automatic sync.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
            {[{id:'manual',label:'Manual Entry',desc:'Type each transaction yourself. Full control, zero data sharing.',icon:'✏️',col:'rgba(255,255,255,.5)',bdr:'rgba(255,255,255,.14)',badge:'Active'},{id:'csv',label:'CSV Import',desc:'Export from your bank, upload monthly. Works with any bank worldwide.',icon:'📄',col:'#00f2ff',bdr:'rgba(0,242,255,.25)',badge:'Available'},{id:'plaid',label:'Plaid Sync',desc:'Automatic real-time sync. Connects to 12,000+ banks worldwide.',icon:'🔗',col:'#a78bfa',bdr:'rgba(167,139,250,.25)',badge:'Coming soon'}].map(o=>(
              <div key={o.id} style={{border:`1px solid ${o.bdr}`,borderRadius:14,padding:20,background:'rgba(255,255,255,.02)'}}>
                <div style={{fontSize:24,marginBottom:10}}>{o.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:o.col,marginBottom:6}}>{o.label}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.38)',lineHeight:1.5,marginBottom:14}}>{o.desc}</div>
                <div style={{padding:'3px 10px',borderRadius:100,fontSize:10,display:'inline-block',background:o.id==='manual'?'rgba(16,185,129,.1)':o.id==='plaid'?'rgba(167,139,250,.08)':'rgba(0,242,255,.08)',color:o.id==='manual'?'#10b981':o.id==='plaid'?'#a78bfa':'#00f2ff',border:`1px solid ${o.id==='manual'?'rgba(16,185,129,.2)':o.id==='plaid'?'rgba(167,139,250,.15)':'rgba(0,242,255,.15)'}`}}>{o.badge}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.4)',padding:'10px 14px',background:'rgba(0,242,255,.04)',borderRadius:8,border:'1px solid rgba(0,242,255,.12)',lineHeight:1.6}}>Currently using manual entry. CSV import is available — export transactions from your bank as CSV and FlowFund will auto-categorize them using AI. Plaid direct sync launches in the next update.</div>
        </div>
        <div style={{...card,marginBottom:0}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>Connected Accounts</div>
          {connections.length===0?<div style={{textAlign:'center',padding:'20px 0',color:'rgba(255,255,255,.25)',fontSize:13}}>No accounts connected yet.</div>:connections.map(c=>(
            <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <div><div style={{fontSize:13,color:'#e2e8f0'}}>{c.bank_name}</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{c.account_type}{c.last_four?` ••••${c.last_four}`:''}</div></div>
              <span style={{padding:'3px 10px',borderRadius:100,fontSize:10,background:c.status==='active'?'rgba(16,185,129,.1)':'rgba(245,158,11,.08)',color:c.status==='active'?'#10b981':'#f59e0b',border:`1px solid ${c.status==='active'?'rgba(16,185,129,.2)':'rgba(245,158,11,.15)'}`}}>{c.status}</span>
            </div>
          ))}
        </div>
        </>
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
