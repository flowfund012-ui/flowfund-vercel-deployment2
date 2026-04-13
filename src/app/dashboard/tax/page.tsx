'use client';
export const dynamic='force-dynamic';
import{useEffect,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const COUNTRIES=[
  {code:'AF',name:'Afghanistan',cur:'AFN',sym:'؋',vat:0,brackets:[{from:0,to:12500,rate:2},{from:12500,to:100000,rate:10},{from:100000,to:999999999,rate:20}]},
  {code:'DE',name:'Germany',cur:'EUR',sym:'€',vat:19,brackets:[{from:0,to:10908,rate:0},{from:10908,to:62810,rate:14},{from:62810,to:277826,rate:42},{from:277826,to:999999999,rate:45}]},
  {code:'US',name:'United States',cur:'USD',sym:'$',vat:0,brackets:[{from:0,to:11600,rate:10},{from:11600,to:47150,rate:12},{from:47150,to:100525,rate:22},{from:100525,to:191950,rate:24},{from:191950,to:243725,rate:32},{from:243725,to:609350,rate:35},{from:609350,to:999999999,rate:37}]},
  {code:'GB',name:'United Kingdom',cur:'GBP',sym:'£',vat:20,brackets:[{from:0,to:12570,rate:0},{from:12570,to:50270,rate:20},{from:50270,to:125140,rate:40},{from:125140,to:999999999,rate:45}]},
  {code:'FR',name:'France',cur:'EUR',sym:'€',vat:20,brackets:[{from:0,to:11294,rate:0},{from:11294,to:28797,rate:11},{from:28797,to:82341,rate:30},{from:82341,to:177106,rate:41},{from:177106,to:999999999,rate:45}]},
  {code:'CA',name:'Canada',cur:'CAD',sym:'C$',vat:5,brackets:[{from:0,to:53359,rate:15},{from:53359,to:106717,rate:20.5},{from:106717,to:165430,rate:26},{from:165430,to:235675,rate:29.32},{from:235675,to:999999999,rate:33}]},
  {code:'AU',name:'Australia',cur:'AUD',sym:'A$',vat:10,brackets:[{from:0,to:18200,rate:0},{from:18200,to:45000,rate:19},{from:45000,to:120000,rate:32.5},{from:120000,to:180000,rate:37},{from:180000,to:999999999,rate:45}]},
  {code:'IN',name:'India',cur:'INR',sym:'₹',vat:18,brackets:[{from:0,to:250000,rate:0},{from:250000,to:500000,rate:5},{from:500000,to:1000000,rate:20},{from:1000000,to:999999999,rate:30}]},
  {code:'PK',name:'Pakistan',cur:'PKR',sym:'₨',vat:17,brackets:[{from:0,to:600000,rate:0},{from:600000,to:1200000,rate:5},{from:1200000,to:2400000,rate:15},{from:2400000,to:3600000,rate:25},{from:3600000,to:999999999,rate:35}]},
  {code:'SA',name:'Saudi Arabia',cur:'SAR',sym:'SAR',vat:15,brackets:[{from:0,to:999999999,rate:0}]},
  {code:'AE',name:'UAE',cur:'AED',sym:'AED',vat:5,brackets:[{from:0,to:999999999,rate:0}]},
  {code:'TR',name:'Turkey',cur:'TRY',sym:'₺',vat:20,brackets:[{from:0,to:110000,rate:15},{from:110000,to:230000,rate:20},{from:230000,to:580000,rate:27},{from:580000,to:3000000,rate:35},{from:3000000,to:999999999,rate:40}]},
  {code:'NG',name:'Nigeria',cur:'NGN',sym:'₦',vat:7.5,brackets:[{from:0,to:300000,rate:7},{from:300000,to:600000,rate:11},{from:600000,to:1100000,rate:15},{from:1100000,to:1600000,rate:19},{from:1600000,to:3200000,rate:21},{from:3200000,to:999999999,rate:24}]},
  {code:'ZA',name:'South Africa',cur:'ZAR',sym:'R',vat:15,brackets:[{from:0,to:237100,rate:18},{from:237100,to:370500,rate:26},{from:370500,to:512800,rate:31},{from:512800,to:673000,rate:36},{from:673000,to:857900,rate:39},{from:857900,to:1817000,rate:41},{from:1817000,to:999999999,rate:45}]},
  {code:'BR',name:'Brazil',cur:'BRL',sym:'R$',vat:10,brackets:[{from:0,to:28559,rate:0},{from:28559,to:42750,rate:7.5},{from:42750,to:57422,rate:15},{from:57422,to:82666,rate:22.5},{from:82666,to:999999999,rate:27.5}]},
  {code:'EG',name:'Egypt',cur:'EGP',sym:'EGP',vat:14,brackets:[{from:0,to:40000,rate:0},{from:40000,to:55000,rate:10},{from:55000,to:70000,rate:15},{from:70000,to:200000,rate:20},{from:200000,to:400000,rate:22.5},{from:400000,to:999999999,rate:25}]},
  {code:'CN',name:'China',cur:'CNY',sym:'¥',vat:13,brackets:[{from:0,to:36000,rate:3},{from:36000,to:144000,rate:10},{from:144000,to:300000,rate:20},{from:300000,to:420000,rate:25},{from:420000,to:660000,rate:30},{from:660000,to:960000,rate:35},{from:960000,to:999999999,rate:45}]},
  {code:'JP',name:'Japan',cur:'JPY',sym:'¥',vat:10,brackets:[{from:0,to:1950000,rate:5},{from:1950000,to:3300000,rate:10},{from:3300000,to:6950000,rate:20},{from:6950000,to:9000000,rate:23},{from:9000000,to:18000000,rate:33},{from:18000000,to:40000000,rate:40},{from:40000000,to:999999999,rate:45}]},
  {code:'MX',name:'Mexico',cur:'MXN',sym:'$',vat:16,brackets:[{from:0,to:8952,rate:1.92},{from:8952,to:75984,rate:6.4},{from:75984,to:133536,rate:10.88},{from:133536,to:155232,rate:16},{from:155232,to:185852,rate:17.92},{from:185852,to:374838,rate:21.36},{from:374838,to:590796,rate:23.52},{from:590796,to:1127926,rate:30},{from:1127926,to:999999999,rate:35}]},
  {code:'KR',name:'South Korea',cur:'KRW',sym:'₩',vat:10,brackets:[{from:0,to:14000000,rate:6},{from:14000000,to:50000000,rate:15},{from:50000000,to:88000000,rate:24},{from:88000000,to:150000000,rate:35},{from:150000000,to:300000000,rate:38},{from:300000000,to:500000000,rate:40},{from:500000000,to:999999999999,rate:45}]},
];
function calcTax(income:number,brackets:{from:number,to:number,rate:number}[]){
  let tax=0;
  for(const b of brackets){
    if(income<=b.from)continue;
    const taxable=Math.min(income,b.to)-b.from;
    if(taxable>0)tax+=taxable*(b.rate/100);
  }
  const rounded=Math.round(tax*100)/100;
  return{tax:rounded,eff:income>0?Math.round((rounded/income)*1000)/10:0};
}
const fmn=(n:number)=>n>=1000?n.toLocaleString('en-US',{maximumFractionDigits:0}):n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export default function TaxRadarPage(){
  const[countryCode,setCountryCode]=useState('US');
  const[manualIncome,setManualIncome]=useState('');
  const[useTransactions,setUseTransactions]=useState(true);
  const[txIncome,setTxIncome]=useState(0);
  const[txExpenses,setTxExpenses]=useState(0);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState(false);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const[{data:prefs},{data:txns}]=await Promise.all([
        sb.from('user_preferences').select('country_code').eq('user_id',session.user.id).single(),
        sb.from('transactions').select('type,amount').eq('user_id',session.user.id),
      ]);
      if(prefs?.country_code)setCountryCode(prefs.country_code);
      const inc=(txns??[]).filter((t:any)=>t.type==='income').reduce((s:number,t:any)=>s+Number(t.amount),0);
      const exp=(txns??[]).filter((t:any)=>t.type==='expense').reduce((s:number,t:any)=>s+Number(t.amount),0);
      setTxIncome(Math.round(inc*100)/100);setTxExpenses(Math.round(exp*100)/100);setLoading(false);
    });
  },[]);
  const saveCountry=async()=>{
    setSaving(true);const{data:{session}}=await sb.auth.getSession();
    if(session){const c=COUNTRIES.find(x=>x.code===countryCode);await sb.from('user_preferences').upsert({user_id:session.user.id,country_code:countryCode,currency:c?.cur||'USD',updated_at:new Date().toISOString()},{onConflict:'user_id'});setSaved(true);setTimeout(()=>setSaved(false),2500);}
    setSaving(false);
  };
  const ct=COUNTRIES.find(c=>c.code===countryCode)||COUNTRIES[2];
  const income=useTransactions?txIncome:(parseFloat(manualIncome)||0);
  const{tax,eff}=calcTax(income,ct.brackets);
  const take=Math.round((income-tax)*100)/100;
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Tax Radar...</div>;
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#f97316',marginBottom:4}}>Tax Radar</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.32)'}}>Real tax calculation based on your country's brackets.</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <select value={countryCode} onChange={e=>setCountryCode(e.target.value)} style={{...inp,width:'auto',background:'rgba(7,8,16,.95)'}}>
            {[...COUNTRIES].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.code} value={c.code} style={{background:'#0d1117'}}>{c.name} ({c.cur})</option>)}
          </select>
          <button onClick={saveCountry} disabled={saving} style={{padding:'10px 18px',borderRadius:8,background:saved?'rgba(16,185,129,.15)':'rgba(249,115,22,.12)',border:`1px solid ${saved?'rgba(16,185,129,.3)':'rgba(249,115,22,.28)'}`,color:saved?'#10b981':'#f97316',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap'}}>
            {saving?'Saving...':(saved?'✓ Saved':'Save Country')}
          </button>
        </div>
      </div>

      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{display:'flex',gap:10,marginBottom:16}}>
          <button onClick={()=>setUseTransactions(true)} style={{flex:1,padding:'10px',borderRadius:8,background:useTransactions?'rgba(249,115,22,.1)':'rgba(255,255,255,.03)',border:`1px solid ${useTransactions?'rgba(249,115,22,.3)':'rgba(255,255,255,.07)'}`,color:useTransactions?'#f97316':'rgba(255,255,255,.42)',cursor:'pointer',fontSize:12,fontWeight:useTransactions?600:400,fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>
            Auto-Calculate from My Transactions
          </button>
          <button onClick={()=>setUseTransactions(false)} style={{flex:1,padding:'10px',borderRadius:8,background:!useTransactions?'rgba(249,115,22,.1)':'rgba(255,255,255,.03)',border:`1px solid ${!useTransactions?'rgba(249,115,22,.3)':'rgba(255,255,255,.07)'}`,color:!useTransactions?'#f97316':'rgba(255,255,255,.42)',cursor:'pointer',fontSize:12,fontWeight:!useTransactions?600:400,fontFamily:"'Inter',sans-serif",transition:'all .15s'}}>
            Enter Income Manually
          </button>
        </div>
        {useTransactions?(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[{l:'Total Income',v:`${ct.sym} ${fmn(txIncome)}`,c:'#10b981',bg:'rgba(16,185,129,.06)',b:'rgba(16,185,129,.18)'},{l:'Total Expenses',v:`${ct.sym} ${fmn(txExpenses)}`,c:'#ef4444',bg:'rgba(239,68,68,.06)',b:'rgba(239,68,68,.18)'},{l:'Net Profit',v:`${ct.sym} ${fmn(txIncome-txExpenses)}`,c:(txIncome-txExpenses)>=0?'#10b981':'#ef4444',bg:'rgba(255,255,255,.03)',b:'rgba(255,255,255,.07)'}].map(x=>(
              <div key={x.l} style={{background:x.bg,border:`1px solid ${x.b}`,borderRadius:10,padding:'12px 14px',textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.07em'}}>{x.l}</div>
                <div style={{fontSize:17,fontWeight:700,color:x.c,fontFamily:"'Roboto Mono',monospace"}}>{x.v}</div>
              </div>
            ))}
          </div>
        ):(
          <div>
            <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>Annual Income ({ct.cur})</label>
            <input type="number" value={manualIncome} onChange={e=>setManualIncome(e.target.value)} placeholder={`Enter annual income in ${ct.cur}`} style={inp}/>
          </div>
        )}
      </div>

      {/* Always show results when income > 0 — even for 0% countries like SA/UAE */}
      {income>0&&(
        <>
        {ct.code==='SA'||ct.code==='AE'?(
          <div style={{background:'rgba(16,185,129,.07)',border:'1px solid rgba(16,185,129,.2)',borderRadius:14,padding:'18px 22px',marginBottom:16,display:'flex',alignItems:'center',gap:14}}>
            <div style={{fontSize:32}}>🎉</div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:'#10b981',marginBottom:3}}>{ct.name} has 0% Income Tax</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.45)'}}>Personal income tax does not exist in {ct.name}. Your full income of {ct.sym} {fmn(income)} is yours to keep.{ct.vat>0?` Note: VAT of ${ct.vat}% applies to purchases.`:''}</div>
            </div>
          </div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
            {[
              {l:'Income Tax Owed',v:`${ct.sym} ${fmn(tax)}`,sub:`on ${ct.sym} ${fmn(income)} income`,c:'#ef4444',bg:'rgba(239,68,68,.07)',b:'rgba(239,68,68,.22)'},
              {l:'Effective Rate',v:`${eff}%`,sub:'of your total income',c:'#f59e0b',bg:'rgba(245,158,11,.07)',b:'rgba(245,158,11,.22)'},
              {l:'Take-Home Pay',v:`${ct.sym} ${fmn(take)}`,sub:'after all income tax',c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.22)'},
            ].map(x=>(
              <div key={x.l} style={{background:x.bg,border:`1px solid ${x.b}`,borderRadius:14,padding:'18px 20px',textAlign:'center'}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,.38)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.07em'}}>{x.l}</div>
                <div style={{fontSize:22,fontWeight:700,color:x.c,fontFamily:"'Roboto Mono',monospace",marginBottom:3}}>{x.v}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{x.sub}</div>
              </div>
            ))}
          </div>
        )}
        {ct.vat>0&&(
          <div style={{background:'rgba(249,115,22,.05)',border:'1px solid rgba(249,115,22,.14)',borderRadius:10,padding:'9px 16px',marginBottom:16,fontSize:12,color:'rgba(249,115,22,.8)',display:'flex',justifyContent:'space-between'}}>
            <span>VAT / Sales Tax — {ct.name}</span>
            <span style={{fontWeight:700,fontFamily:"'Roboto Mono',monospace"}}>{ct.vat}%</span>
          </div>
        )}
        </>
      )}

      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:22}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>{ct.name} — Tax Brackets</div>
        {ct.brackets.map((b,i)=>{
          const toStr=b.to>=999999999?'∞':fmn(b.to);
          const active=income>0&&income>b.from&&income<=b.to;
          const below=income>0&&income>b.to;
          return(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 14px',borderRadius:8,background:active?'rgba(249,115,22,.08)':below?'rgba(16,185,129,.03)':'rgba(255,255,255,.02)',border:`1px solid ${active?'rgba(249,115,22,.22)':'rgba(255,255,255,.04)'}`,marginBottom:5}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:6,height:6,borderRadius:'50%',flexShrink:0,background:active?'#f97316':below?'rgba(16,185,129,.5)':'rgba(255,255,255,.1)'}}/>
                <span style={{fontSize:12,color:active?'rgba(255,255,255,.85)':'rgba(255,255,255,.4)',fontFamily:"'Roboto Mono',monospace"}}>{ct.sym}{fmn(b.from)} — {toStr==='∞'?toStr:ct.sym+toStr}</span>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:b.rate===0?'#10b981':b.rate<20?'#f59e0b':b.rate<35?'#f97316':'#ef4444',fontFamily:"'Roboto Mono',monospace"}}>{b.rate}%{active?' ◀ you are here':''}</span>
            </div>
          );
        })}
        {income===0&&<p style={{textAlign:'center',padding:12,fontSize:12,color:'rgba(255,255,255,.25)'}}>Enter income above to see your bracket highlighted.</p>}
      </div>
    </div>
  );
}
