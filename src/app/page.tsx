'use client';
export const dynamic='force-dynamic';
import Link from'next/link';
import{useState}from'react';
function Logo({size=28}:{size?:number}){const rx=Math.round(size*0.28);return(<svg width={size} height={size} viewBox="0 0 64 64"><defs><linearGradient id="lp1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient><linearGradient id="lp2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient><linearGradient id="lp3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient></defs><rect width="64" height="64" rx={rx} fill="#08091e"/><rect width="64" height="64" rx={rx} fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/><path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#lp1)" opacity="0.78"/><path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#lp2)" opacity="0.88"/><path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#lp3)" opacity="0.72"/><path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/><line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/><polygon points="56,-2 60,6 52,2" fill="#00d4ff"/></svg>);}
const MODULES=[
  {n:'Transactions',d:'Track every dollar in and out. Smart categories, budgets, recurring entries, and CSV bank import.'},
  {n:'Goals',d:'Set savings targets with deadlines. AI calculates monthly amounts and tracks 25, 50, 75, 100 percent milestones.'},
  {n:'Revenue',d:'Built for freelancers and entrepreneurs. MRR simulator, revenue log, and P&L at a glance.'},
  {n:'Debt Payoff',d:'Avalanche or snowball strategy. AI calculates your fastest path to zero with exact monthly timelines.'},
  {n:'Academy',d:'Real financial courses with quizzes and XP. Upload your own notes and build a personal knowledge base.'},
  {n:'Toolkit',d:'Financial templates and calculators updated regularly. Download and use instantly.'},
  {n:'Tax Radar',d:'Live tax estimates for 20 plus countries. Automatically calculates from your real transaction data.'},
  {n:'Security',d:'Account security, activity log, data export, and account management in one place.'},
];
const FAQS=[
  ['What makes FlowFund different from other budgeting apps?','FlowFund is built for students, freelancers, and entrepreneurs in a single product. It has an AI advisor that reads your real transaction data, supports 20 plus languages including Pashto and Dari, accepts crypto payments with zero KYC, and calculates live taxes for 20 plus countries.'],
  ['Is my financial data secure?','Yes. Authentication and data storage are handled by Supabase with industry-standard encryption. Your data is private and is never sold or shared with third parties.'],
  ['Can I cancel my subscription anytime?','Yes. Monthly plans can be cancelled at any time with no penalty. Your data remains accessible on the free tier after cancellation.'],
  ['Which countries does Tax Radar support?','Tax Radar covers 20 plus countries including Afghanistan, Germany, United States, United Kingdom, UAE, Pakistan, India, Saudi Arabia, France, Canada and more.'],
  ['Can freelancers and small businesses use FlowFund?','Yes. The Revenue module is specifically designed for freelancers and small business owners with MRR tracking, revenue logging, and a P&L overview.'],
];
export default function Page(){
  const[faq,setFaq]=useState<number|null>(null);
  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:'#000814',color:'#fff',minHeight:'100vh'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#1a6bff44;border-radius:3px}`}</style>
      {/* NAVIGATION */}
      <nav style={{background:'#000814',borderBottom:'1px solid rgba(255,255,255,.06)',position:'sticky',top:0,zIndex:100,padding:'0 5%'}}>
        <div style={{maxWidth:1160,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:9}}>
            <Logo size={30}/>
            <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:16,color:'#fff',letterSpacing:'.04em'}}>FlowFund</span>
          </a>
          <div style={{display:'flex',alignItems:'center',gap:26}}>
            <div style={{display:'flex',gap:22}}>
              {[['Features','#features'],['Pricing','#pricing'],['FAQ','#faq']].map(([l,h])=>(
                <a key={l} href={h} style={{fontSize:13,color:'rgba(255,255,255,.5)',fontWeight:500}}>{l}</a>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <Link href="/login" style={{padding:'7px 16px',borderRadius:8,border:'1px solid rgba(255,255,255,.14)',color:'rgba(255,255,255,.7)',fontSize:13,fontWeight:600}}>Login</Link>
              <Link href="/signup" style={{padding:'7px 16px',borderRadius:8,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',fontSize:13,fontWeight:700,boxShadow:'0 2px 12px rgba(26,107,255,.35)'}}>Start Free</Link>
            </div>
          </div>
        </div>
      </nav>
      {/* HERO */}
      <section style={{padding:'90px 5% 70px',textAlign:'center',maxWidth:800,margin:'0 auto'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(26,107,255,.1)',border:'1px solid rgba(26,107,255,.3)',borderRadius:20,padding:'5px 14px',fontSize:11,color:'#60a5fa',marginBottom:28,letterSpacing:'.06em'}}>
          AI-POWERED — VERSION 3.0
        </div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:22}}>
          <Logo size={72}/>
        </div>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(26px,5vw,54px)',fontWeight:900,lineHeight:1.1,marginBottom:16,background:'linear-gradient(135deg,#fff 30%,#60a5fa 70%,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          Your Complete Financial OS
        </h1>
        <p style={{fontSize:'clamp(14px,1.8vw,17px)',color:'rgba(255,255,255,.5)',lineHeight:1.75,marginBottom:34,maxWidth:540,margin:'0 auto 34px'}}>
          Track income, automate savings, and grow your revenue. Built for students, freelancers, and entrepreneurs worldwide.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:50}}>
          <Link href="/signup" style={{padding:'13px 32px',borderRadius:11,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',fontWeight:700,fontSize:14,fontFamily:"'Orbitron',monospace",letterSpacing:'.04em',boxShadow:'0 4px 22px rgba(26,107,255,.4)'}}>
            Start Free — No Card Needed
          </Link>
          <a href="#features" style={{padding:'13px 32px',borderRadius:11,border:'1px solid rgba(255,255,255,.14)',color:'rgba(255,255,255,.65)',fontWeight:600,fontSize:14}}>
            See Features
          </a>
        </div>
        <div style={{display:'flex',gap:36,justifyContent:'center',flexWrap:'wrap'}}>
          {[['8','Modules'],['20+','Languages'],['20+','Countries'],['0','KYC']].map(([n,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:26,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{n}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.3)',letterSpacing:'.05em'}}>{l}</div>
            </div>
          ))}
        </div>
      </section>
      {/* FEATURES */}
      <section id="features" style={{padding:'70px 5%',maxWidth:1160,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(22px,4vw,36px)',fontWeight:900,marginBottom:12}}>8 Modules. One Platform.</h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,.4)'}}>Everything you need to manage your financial life in one place.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
          {MODULES.map(m=>(
            <div key={m.n} style={{background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'22px 20px'}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:700,color:'#fff',marginBottom:9,letterSpacing:'.03em'}}>{m.n}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.42)',lineHeight:1.6}}>{m.d}</div>
            </div>
          ))}
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section style={{padding:'70px 5%',maxWidth:900,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(22px,4vw,34px)',fontWeight:900,marginBottom:12}}>Get started in minutes.</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20}}>
          {[
            ['01','Create your account','Sign up free in 30 seconds. No card, no KYC required.'],
            ['02','Add or import transactions','Enter manually or drop a CSV from your bank. AI categorizes everything.'],
            ['03','Set goals and budgets','Define savings goals and spending limits. FlowFund monitors automatically.'],
            ['04','Talk to your AI advisor','Ask anything about your money. Get specific, data-driven answers.'],
          ].map(([n,t,d])=>(
            <div key={n} style={{background:'rgba(13,17,30,.7)',border:'1px solid rgba(255,255,255,.06)',borderRadius:14,padding:'22px 20px'}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'rgba(26,107,255,.7)',marginBottom:10,letterSpacing:'.1em'}}>{n}</div>
              <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:8}}>{t}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
      </section>
      {/* PRICING */}
      <section id="pricing" style={{padding:'70px 5%',maxWidth:960,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:44}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(20px,4vw,34px)',fontWeight:900,marginBottom:10}}>Simple, honest pricing.</h2>
          <p style={{fontSize:13,color:'rgba(255,255,255,.3)'}}>Pay with BTC, ETH, USDT and 150 plus coins via NOWPayments. Zero KYC.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:18}}>
          {[
            {n:'Free',p:'$0',sub:'Forever, no card needed',features:['Dashboard and AI score','50 transactions per month','Transactions module','Goals (up to 2)','3 Academy courses'],cta:'Get Started Free',href:'/signup',pop:false},
            {n:'Pro',p:'$19 / month',sub:'Cancel anytime',features:['Everything in Free','Unlimited transactions','Full AI Advisor and Chat','Revenue module','All Academy courses','Debt Payoff planner','Tax Radar and Bank Sync','CSV export'],cta:'Start Pro',href:'/signup',pop:true},
            {n:'Premium',p:'$39 / month',sub:'Cancel anytime',features:['Everything in Pro','Full Toolkit library','PDF financial reports','Priority AI response','Early feature access','Unlimited everything'],cta:'Start Premium',href:'/signup',pop:false},
          ].map(p=>(
            <div key={p.n} style={{background:p.pop?'rgba(26,107,255,.07)':'rgba(13,17,30,.95)',border:`1px solid ${p.pop?'rgba(26,107,255,.4)':'rgba(255,255,255,.07)'}`,borderRadius:18,padding:'26px 22px',position:'relative'}}>
              {p.pop&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1a6bff,#7c00ff)',borderRadius:18,padding:'3px 14px',fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'#fff',whiteSpace:'nowrap'}}>MOST POPULAR</div>}
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:900,color:'#fff',marginBottom:3}}>{p.n}</div>
              <div style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:3}}>{p.p}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginBottom:20}}>{p.sub}</div>
              {p.features.map(f=>(
                <div key={f} style={{fontSize:12,color:'rgba(255,255,255,.6)',marginBottom:7,display:'flex',gap:7,alignItems:'flex-start'}}>
                  <span style={{color:'#22c55e',flexShrink:0,fontSize:11,marginTop:1}}>✓</span>{f}
                </div>
              ))}
              <Link href={p.href} style={{display:'block',marginTop:20,padding:'11px',borderRadius:9,background:p.pop?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.06)',color:'#fff',fontSize:13,fontWeight:700,textAlign:'center',border:p.pop?'none':'1px solid rgba(255,255,255,.1)'}}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>
      {/* FAQ */}
      <section id="faq" style={{padding:'70px 5%',maxWidth:680,margin:'0 auto'}}>
        <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(20px,4vw,32px)',fontWeight:900,textAlign:'center',marginBottom:36}}>Frequently Asked Questions</h2>
        {FAQS.map(([q,a],i)=>(
          <div key={i} style={{borderBottom:'1px solid rgba(255,255,255,.07)',marginBottom:2}}>
            <button onClick={()=>setFaq(faq===i?null:i)} style={{width:'100%',background:'none',border:'none',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',padding:'16px 0',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Inter',sans-serif"}}>
              {q}
              <span style={{color:'rgba(255,255,255,.3)',fontSize:18,transform:faq===i?'rotate(45deg)':'none',display:'inline-block',transition:'transform .2s',flexShrink:0,marginLeft:12}}>+</span>
            </button>
            {faq===i&&<div style={{fontSize:13,color:'rgba(255,255,255,.45)',lineHeight:1.75,paddingBottom:16}}>{a}</div>}
          </div>
        ))}
      </section>
      {/* FINAL CTA */}
      <section style={{padding:'70px 5%',textAlign:'center',maxWidth:620,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}><Logo size={50}/></div>
        <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(20px,4vw,32px)',fontWeight:900,marginBottom:14}}>
          Ready to take control of your finances?
        </h2>
        <p style={{fontSize:15,color:'rgba(255,255,255,.4)',marginBottom:32,lineHeight:1.7}}>
          Free to start. No card required. Works in your language.
        </p>
        <Link href="/signup" style={{display:'inline-block',padding:'14px 44px',borderRadius:11,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',fontWeight:700,fontSize:15,fontFamily:"'Orbitron',monospace",letterSpacing:'.04em',boxShadow:'0 4px 26px rgba(26,107,255,.4)'}}>
          Start Free Today
        </Link>
      </section>
      {/* FOOTER */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,.06)',padding:'26px 5%',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9,marginBottom:14}}>
          <Logo size={24}/>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:12,fontWeight:800,color:'#fff'}}>FlowFund</span>
        </div>
        <div style={{display:'flex',gap:20,justifyContent:'center',marginBottom:12,flexWrap:'wrap'}}>
          {[['Login','/login'],['Sign Up','/signup'],['Features','#features'],['Pricing','#pricing'],['FAQ','#faq']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.18)'}}>
          2025 FlowFund — Financial OS for students, freelancers and entrepreneurs
        </div>
      </footer>
    </div>
  );
}
