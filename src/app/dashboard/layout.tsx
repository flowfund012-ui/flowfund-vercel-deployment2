'use client';
import{useEffect,useState}from'react';
import{useRouter,usePathname}from'next/navigation';
import{createClient}from'@supabase/supabase-js';
import Link from'next/link';
import{t,isRTL,getLangFromStorage,setLangInStorage}from'@/lib/i18n';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
function WaveLogo({size=28}:{size?:number}){
  const rx=Math.round(size*0.28);
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
      <defs>
        <linearGradient id="wg1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient>
        <linearGradient id="wg2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
        <linearGradient id="wg3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx={rx} fill="#08091e"/>
      <rect x="0" y="0" width="64" height="64" rx={rx} fill="none" stroke="rgba(26,107,255,0.3)" strokeWidth="1.5"/>
      <path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#wg1)" opacity="0.78"/>
      <path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#wg2)" opacity="0.88"/>
      <path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#wg3)" opacity="0.72"/>
      <path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="56,-2 60,6 52,2" fill="#00d4ff"/>
    </svg>
  );
}
export default function DashboardLayout({children}:{children:React.ReactNode}){
  const router=useRouter();const pathname=usePathname();
  const[profile,setProfile]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  const[collapsed,setCollapsed]=useState(false);
  const[mobileOpen,setMobileOpen]=useState(false);
  const[lang,setLang]=useState('en');
  const[rtl,setRtl]=useState(false);
  useEffect(()=>{
    const savedLang=getLangFromStorage();
    setLang(savedLang);setRtl(isRTL(savedLang));
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){router.push('/login');return;}
      const uid=session.user.id;
      const[{data:p},{data:pr}]=await Promise.all([
        sb.from('profiles').select('full_name,plan,financial_score').eq('id',uid).single(),
        sb.from('user_preferences').select('language').eq('user_id',uid).single(),
      ]);
      setProfile(p);
      if(pr?.language&&pr.language!==savedLang){
        setLangInStorage(pr.language);setLang(pr.language);setRtl(isRTL(pr.language));
      }
      setLoading(false);
    });
    const{data:{subscription}}=sb.auth.onAuthStateChange((e)=>{if(e==='SIGNED_OUT')router.push('/login');});
    return()=>subscription.unsubscribe();
  },[]);
  if(loading)return(
    <div style={{minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}><WaveLogo size={52}/><div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.25em',marginTop:14}}>{t(lang,'loading')}</div></div>
    </div>
  );
  const NAV=[
    {href:'/dashboard',key:'dashboard',color:'#00f2ff',exact:true},
    {href:'/dashboard/mission',key:'mission',color:'#10b981'},
    {href:'/dashboard/autopilot',key:'autopilot',color:'#a78bfa'},
    {href:'/dashboard/growth',key:'growth',color:'#2dd4bf'},
    {href:'/dashboard/debts',key:'debts',color:'#ef4444'},
    {href:'/dashboard/academy',key:'academy',color:'#f59e0b'},
    {href:'/dashboard/vault',key:'vault',color:'#00f0ff'},
    {href:'/dashboard/security',key:'security',color:'#00ff9d'},
    {href:'/dashboard/tax',key:'tax',color:'#f97316'},
    {href:'/dashboard/banksync',key:'banksync',color:'#60a5fa'},
  ];
  const isActive=(item:typeof NAV[0])=>item.exact?pathname===item.href:pathname.startsWith(item.href);
  const sw=collapsed?52:236;
  const score=profile?.financial_score??null;
  const sc=(s:number)=>s>=70?'#10b981':s>=40?'#f59e0b':'#ef4444';
  const dir=rtl?'rtl':'ltr';
  return(
    <div style={{minHeight:'100vh',background:'#070810',color:'#f0f6ff',fontFamily:"'Inter',system-ui,sans-serif",display:'flex',direction:dir}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:100px}
        @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .ni{transition:background .15s}.ni:hover{background:rgba(255,255,255,.038)!important}
        .ca{animation:fi .25s ease}
        @media(max-width:768px){.sd{display:none!important}.mb{display:flex!important}main{margin-left:0!important;margin-right:0!important;padding:62px 14px 28px!important}}
        @media(min-width:769px){.mb{display:none!important}}
      `}</style>
      <aside className="sd" style={{width:sw,minHeight:'100vh',flexShrink:0,background:'rgba(6,7,14,.99)',borderRight:rtl?'none':'1px solid rgba(255,255,255,.05)',borderLeft:rtl?'1px solid rgba(255,255,255,.05)':'none',position:'fixed',top:0,[rtl?'right':'left']:0,bottom:0,display:'flex',flexDirection:'column',zIndex:40,transition:'width .18s ease',overflowY:'auto',overflowX:'hidden'}}>
        <div style={{padding:'14px 10px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',gap:8,justifyContent:collapsed?'center':'space-between'}}>
          {!collapsed?(
            <>
              <div style={{display:'flex',alignItems:'center',gap:9,minWidth:0}}>
                <WaveLogo size={26}/>
                <div><div style={{fontFamily:"'Orbitron',monospace",fontSize:11,fontWeight:900,color:'#fff',letterSpacing:'.04em'}}>FlowFund</div><div style={{fontSize:7,color:'rgba(255,255,255,.22)',letterSpacing:'.22em',marginTop:2}}>{t(lang,'financial_os')}</div></div>
              </div>
              <button onClick={()=>setCollapsed(true)} style={{background:'none',border:'none',color:'rgba(255,255,255,.18)',cursor:'pointer',fontSize:13,padding:3,flexShrink:0}}>{rtl?'›':'‹'}</button>
            </>
          ):(
            <button onClick={()=>setCollapsed(false)} style={{background:'none',border:'none',cursor:'pointer',padding:0}}><WaveLogo size={26}/></button>
          )}
        </div>
        {!collapsed&&profile&&(
          <div style={{padding:'7px 10px'}}>
            <div style={{padding:'6px 9px',borderRadius:8,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.05)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:score!==null?4:0}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,.38)'}}>{profile.full_name?.split(' ')[0]||'Commander'}</span>
                <span style={{fontSize:9,fontWeight:700,color:profile.plan==='premium'?'#ffd700':profile.plan==='pro'?'#00f2ff':'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.07em'}}>{profile.plan||'free'}</span>
              </div>
              {score!==null&&<div style={{display:'flex',alignItems:'center',gap:5}}><div style={{flex:1,background:'rgba(255,255,255,.07)',borderRadius:100,height:2.5}}><div style={{background:sc(score),borderRadius:100,height:2.5,width:score+'%'}}/></div><span style={{fontSize:9,fontWeight:700,color:sc(score),fontFamily:"'Orbitron',monospace"}}>{score}</span></div>}
            </div>
          </div>
        )}
        <nav style={{flex:1,padding:'3px 8px',display:'flex',flexDirection:'column',gap:0.5}}>
          {NAV.map(item=>{
            const active=isActive(item);
            const label=t(lang,item.key);
            return(
              <Link key={item.href} href={item.href} style={{textDecoration:'none'}}>
                <div className="ni" style={{display:'flex',alignItems:'center',gap:10,padding:collapsed?'10px 0':'9px 11px',borderRadius:7,cursor:'pointer',position:'relative',background:active?`${item.color}0c`:'transparent',justifyContent:collapsed?'center':'flex-start',direction:dir}}>
                  {active&&!collapsed&&<div style={{position:'absolute',[rtl?'right':'left']:0,top:'18%',bottom:'18%',width:2.5,borderRadius:rtl?'3px 0 0 3px':'0 3px 3px 0',background:item.color}}/>}
                  <div style={{width:6,height:6,borderRadius:'50%',background:active?item.color:'rgba(255,255,255,.14)',flexShrink:0,transition:'background .15s'}}/>
                  {!collapsed&&<span style={{fontSize:12.5,fontWeight:active?600:400,color:active?item.color:'rgba(255,255,255,.45)',whiteSpace:'nowrap'}}>{label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
        <div style={{padding:'5px 8px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
          <Link href="/dashboard/settings" style={{textDecoration:'none'}}>
            <div className="ni" style={{display:'flex',alignItems:'center',gap:10,padding:collapsed?'10px 0':'9px 11px',borderRadius:7,cursor:'pointer',justifyContent:collapsed?'center':'flex-start',marginBottom:1}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:pathname==='/dashboard/settings'?'rgba(255,255,255,.6)':'rgba(255,255,255,.14)',flexShrink:0}}/>
              {!collapsed&&<span style={{fontSize:12.5,color:'rgba(255,255,255,.38)'}}>{t(lang,'settings')}</span>}
            </div>
          </Link>
          <div className="ni" onClick={async()=>{await sb.auth.signOut();router.push('/login');}} style={{display:'flex',alignItems:'center',gap:10,padding:collapsed?'10px 0':'9px 11px',borderRadius:7,cursor:'pointer',justifyContent:collapsed?'center':'flex-start'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'rgba(239,68,68,.4)',flexShrink:0}}/>
            {!collapsed&&<span style={{fontSize:12.5,color:'rgba(239,68,68,.45)'}}>{t(lang,'signout')}</span>}
          </div>
        </div>
      </aside>
      <div className="mb" style={{position:'fixed',top:0,left:0,right:0,zIndex:50,height:54,background:'rgba(6,7,14,.99)',borderBottom:'1px solid rgba(255,255,255,.05)',alignItems:'center',padding:'0 14px',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}><WaveLogo size={24}/><span style={{fontFamily:"'Orbitron',monospace",fontSize:11,fontWeight:900,color:'#fff'}}>FlowFund</span></div>
        <button onClick={()=>setMobileOpen(!mobileOpen)} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:6,color:'rgba(255,255,255,.6)',cursor:'pointer',fontSize:15,padding:'5px 10px'}}>{mobileOpen?'×':'≡'}</button>
      </div>
      {mobileOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:49,background:'rgba(0,0,0,.72)'}} onClick={()=>setMobileOpen(false)}>
          <div style={{position:'absolute',top:54,left:0,right:0,background:'#090b18',borderBottom:'1px solid rgba(255,255,255,.06)',padding:8,direction:dir}} onClick={e=>e.stopPropagation()}>
            {NAV.map(item=>(
              <Link key={item.href} href={item.href} style={{textDecoration:'none'}} onClick={()=>setMobileOpen(false)}>
                <div style={{display:'flex',alignItems:'center',gap:9,padding:'10px 13px',borderRadius:6,background:isActive(item)?`${item.color}0c`:'transparent',marginBottom:1}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:isActive(item)?item.color:'rgba(255,255,255,.14)',flexShrink:0}}/>
                  <span style={{fontSize:13,color:isActive(item)?item.color:'rgba(255,255,255,.52)'}}>{t(lang,item.key)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <main style={{[rtl?'marginRight':'marginLeft']:sw,flex:1,minHeight:'100vh',padding:'30px 26px',maxWidth:`calc(100vw - ${sw}px)`,transition:`margin .18s ease`}} className="ca">
        <div style={{maxWidth:1200,margin:'0 auto'}}>{children}</div>
      </main>
    </div>
  );
}
