'use client';
import{useState}from'react';

function WaveLogo({size=36}:{size?:number}){
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

const FAQS=[
  {q:'What makes FlowFund different?',a:'FlowFund is a full financial operating system built on real infrastructure — real auth, real database, real automation. Not a spreadsheet template.'},
  {q:'Is my data secure?',a:'Your data is stored in Supabase with row-level security — only you can access your financial data. AES-256 encryption at rest.'},
  {q:'Can I cancel anytime?',a:'Absolutely. Cancel from your settings page and your subscription ends at the current billing period. No questions asked.'},
  {q:'Which countries are supported?',a:'FlowFund works globally. Tax Radar supports 20+ countries including Afghanistan, Germany, US, UK, India, Pakistan, UAE, and more. The interface supports 20 languages including Pashto.'},
  {q:'Can I use it for business?',a:'Yes. The Growth Engine is built for freelancers and entrepreneurs — MRR simulator, revenue tracking, P&L overview, and more.'},
];

export default function LandingPage(){
  const[openFaq,setOpenFaq]=useState<number|null>(null);
  return(
    <div style={{background:'#000814',color:'#F5F9FF',fontFamily:"'Inter',sans-serif",overflowX:'hidden'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');a{transition:opacity .2s}a:hover{opacity:.8}`}</style>

      {/* NAV — solid #000814, no blur */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,background:'#000814',borderBottom:'1px solid rgba(255,255,255,.08)',height:64,display:'flex',alignItems:'center',padding:'0 32px',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <WaveLogo size={34}/>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:17,fontWeight:900,color:'#fff',letterSpacing:'.04em'}}>FlowFund</span>
        </div>
        <div style={{display:'flex',gap:4}}>
          {[['#lp-features','Features'],['#lp-pricing','Pricing'],['#lp-about','About'],['#lp-faq','FAQ']].map(([href,label])=>(
            <a key={href} href={href} style={{color:'rgba(255,255,255,.6)',padding:'8px 14px',fontSize:14,borderRadius:6,textDecoration:'none'}}>{label}</a>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <a href="/login" style={{padding:'9px 20px',borderRadius:10,fontFamily:"'Orbitron',monospace",fontSize:11,border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.65)',textDecoration:'none'}}>Login</a>
          <a href="/signup" style={{padding:'9px 20px',borderRadius:10,fontFamily:"'Orbitron',monospace",fontSize:11,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',boxShadow:'0 4px 14px rgba(26,107,255,.35)'}}>Start Free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(ellipse at 50% 0%,rgba(26,107,255,.14),transparent 65%),radial-gradient(ellipse at 80% 80%,rgba(124,0,255,.08),transparent 50%)',textAlign:'center',padding:'140px 24px 80px'}}>
        <div style={{maxWidth:800}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:28}}>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',inset:-20,background:'radial-gradient(circle,rgba(26,107,255,.18),transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>
              <WaveLogo size={80}/>
            </div>
          </div>
          <div style={{display:'inline-block',padding:'4px 14px',fontSize:11,fontFamily:"'Orbitron',monospace",borderRadius:100,color:'#60a5fa',background:'rgba(30,58,138,.45)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:24}}>Version 3.0 — Now Live</div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(28px,6vw,64px)',fontWeight:900,lineHeight:1.15,marginBottom:20,color:'#fff'}}>
            Your Complete<br/>
            <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Financial OS</span>
          </h1>
          <p style={{fontSize:18,color:'rgba(255,255,255,.58)',marginBottom:14,maxWidth:540,margin:'0 auto 14px'}}>Track income, automate savings, grow your revenue. Built for students, freelancers, and entrepreneurs worldwide.</p>
          <p style={{fontSize:14,color:'#60a5fa',marginBottom:40}}>Free forever. Upgrade when you're ready.</p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/signup" style={{padding:'14px 36px',borderRadius:12,fontFamily:"'Orbitron',monospace",fontSize:13,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',boxShadow:'0 0 28px rgba(26,107,255,.4)'}}>Start Free Today</a>
            <a href="#lp-pricing" style={{padding:'14px 36px',borderRadius:12,fontFamily:"'Orbitron',monospace",fontSize:13,border:'1px solid rgba(96,165,250,.4)',color:'#60a5fa',textDecoration:'none'}}>See Pricing</a>
          </div>
          <div style={{marginTop:56,display:'flex',justifyContent:'center',gap:48,flexWrap:'wrap'}}>
            {[['8','Modules'],['20+','Languages'],['20+','Countries'],['0','KYC Required']].map(([n,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:700,color:'#60a5fa',fontFamily:"'Orbitron',monospace"}}>{n}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.38)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="lp-features" style={{padding:'96px 24px',background:'#000'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(22px,4vw,40px)',fontWeight:700,textAlign:'center',marginBottom:12}}>
            <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>8 Modules. One Platform.</span>
          </h2>
          <p style={{textAlign:'center',color:'rgba(255,255,255,.45)',fontSize:15,marginBottom:52}}>Everything you need to command your financial future.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
            {[
              {title:'Mission Tracker',desc:'Real-time income and expense tracking with smart categorization, budgets, and CSV export.',col:'#10b981'},
              {title:'AutoPilot',desc:'Savings automation. Define rules, allocate percentages, hit your goals hands-free.',col:'#a78bfa'},
              {title:'Growth Engine',desc:'Built for entrepreneurs — MRR simulator, revenue tracking, P&L overview.',col:'#2dd4bf'},
              {title:'Debt Planner',desc:'Avalanche & snowball strategies with AI-powered payoff plans and timeline.',col:'#ef4444'},
              {title:'Academy',desc:'Structured financial education for students, freelancers, and business owners.',col:'#f59e0b'},
              {title:'Vault',desc:'Templates, tools, and assets updated monthly. Ever-growing resource library.',col:'#00f0ff'},
              {title:'Tax Radar',desc:'Real tax brackets for 20+ countries. Auto-calculates from your transactions.',col:'#f97316'},
              {title:'Bank Sync',desc:'Connect accounts, import CSV bank exports, or sync via Plaid — your choice.',col:'#60a5fa'},
            ].map(m=>(
              <div key={m.title} style={{background:'rgba(13,17,23,.8)',border:'1px solid rgba(255,255,255,.06)',borderRadius:16,padding:24}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:m.col,marginBottom:14}}/>
                <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,marginBottom:8,color:'#fff'}}>{m.title}</h3>
                <p style={{color:'rgba(255,255,255,.45)',fontSize:13,lineHeight:1.7}}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="lp-pricing" style={{padding:'96px 24px',background:'linear-gradient(to bottom,#000,rgba(0,31,84,.08))'}}>
        <div style={{maxWidth:960,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(22px,4vw,40px)',fontWeight:700,textAlign:'center',marginBottom:10}}>
            <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Simple Pricing</span>
          </h2>
          <p style={{textAlign:'center',color:'rgba(255,255,255,.45)',fontSize:15,marginBottom:8}}>Start free. Upgrade when you need more. Cancel anytime.</p>
          <p style={{textAlign:'center',color:'rgba(255,255,255,.28)',fontSize:12,marginBottom:48}}>Paid plans via NOWPayments — BTC, ETH, USDT and 150+ coins. Zero KYC.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18}}>
            <div style={{background:'rgba(13,17,23,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:20,padding:28}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:16,marginBottom:8,color:'#fff'}}>Free</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:38,fontWeight:900,marginBottom:4,color:'#fff'}}>$0</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:20}}>Forever — no card needed</div>
              {['Dashboard + AI Score','50 transactions/mo','Mission Tracker','AutoPilot (1 goal)','3 Academy courses','2 Vault assets'].map(f=>(
                <div key={f} style={{display:'flex',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.58)'}}><span style={{color:'#10b981',flexShrink:0}}>✓</span>{f}</div>
              ))}
              <a href="/signup" style={{display:'block',marginTop:20,padding:'11px',borderRadius:10,textAlign:'center',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',color:'#fff',textDecoration:'none',fontSize:13,fontWeight:600,fontFamily:"'Orbitron',monospace"}}>Get Started Free</a>
            </div>
            <div style={{background:'rgba(26,107,255,.05)',border:'1px solid rgba(26,107,255,.3)',borderRadius:20,padding:28}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:16,marginBottom:8,color:'#00f2ff'}}>Pro</div>
              <div style={{marginBottom:4}}><span style={{fontFamily:"'Orbitron',monospace",fontSize:38,fontWeight:900,color:'#00f2ff'}}>$19</span><span style={{fontSize:14,color:'rgba(255,255,255,.38)',marginLeft:4}}>/month</span></div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:20}}>Cancel anytime — crypto</div>
              {['Everything in Free','Unlimited transactions','AI Advisor + Chat','Growth Engine','All Academy courses','4 Vault assets','Debt Planner + AI','Tax Radar','Bank Sync','CSV export'].map(f=>(
                <div key={f} style={{display:'flex',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.58)'}}><span style={{color:'#10b981',flexShrink:0}}>✓</span>{f}</div>
              ))}
              <a href="/signup" style={{display:'block',marginTop:20,padding:'11px',borderRadius:10,textAlign:'center',background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',fontSize:13,fontWeight:700,fontFamily:"'Orbitron',monospace"}}>Start Pro — $19/mo</a>
            </div>
            <div style={{background:'rgba(255,215,0,.04)',border:'1px solid rgba(255,215,0,.32)',borderRadius:20,padding:28,position:'relative'}}>
              <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',fontFamily:"'Orbitron',monospace",fontSize:9,fontWeight:700,padding:'3px 14px',borderRadius:100,whiteSpace:'nowrap'}}>BEST VALUE</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:16,marginBottom:8,color:'#ffd700'}}>Premium</div>
              <div style={{marginBottom:4}}><span style={{fontFamily:"'Orbitron',monospace",fontSize:38,fontWeight:900,color:'#ffd700'}}>$39</span><span style={{fontSize:14,color:'rgba(255,255,255,.38)',marginLeft:4}}>/month</span></div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.32)',marginBottom:20}}>Cancel anytime — crypto</div>
              {['Everything in Pro','Full Vault + hidden drops','PDF financial reports','Priority AI analysis','Early feature access','Custom categories','Unlimited everything'].map(f=>(
                <div key={f} style={{display:'flex',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.58)'}}><span style={{color:'#ffd700',flexShrink:0}}>✓</span>{f}</div>
              ))}
              <a href="/signup" style={{display:'block',marginTop:20,padding:'11px',borderRadius:10,textAlign:'center',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',textDecoration:'none',fontSize:13,fontWeight:700,fontFamily:"'Orbitron',monospace"}}>Start Premium — $39/mo</a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="lp-about" style={{padding:'96px 24px',background:'#000'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:60,flexWrap:'wrap'}}>
          <div style={{width:220,height:220,borderRadius:24,background:'rgba(8,9,30,.9)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(26,107,255,.25)',flexShrink:0,flexDirection:'column',gap:14}}>
            <WaveLogo size={72}/>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:700,color:'#fff'}}>Maiwand</div>
              <div style={{fontSize:10,color:'#60a5fa',fontFamily:"'Orbitron',monospace",letterSpacing:'.08em'}}>Mission Architect</div>
            </div>
          </div>
          <div style={{flex:1,minWidth:280}}>
            <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(18px,3vw,32px)',fontWeight:700,marginBottom:16}}>
              <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Built for Real People, Not Demos</span>
            </h2>
            <p style={{color:'rgba(255,255,255,.55)',fontSize:14,lineHeight:1.8,marginBottom:14}}>FlowFund started from a real problem: financial tools are either too basic or too complex. Nothing was built for students, freelancers, and business owners who need real power without the noise.</p>
            <p style={{color:'rgba(255,255,255,.55)',fontSize:14,lineHeight:1.8,marginBottom:20}}>Every feature is real — real auth, real data, real AI, real automation. No demo placeholders. Works globally with support for 20+ languages and 20+ tax regions.</p>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[['Next.js 14','Frontend'],['Supabase','Backend'],['NOWPayments','Crypto'],['NVIDIA AI','Intelligence']].map(([tech,role])=>(
                <div key={tech} style={{padding:'7px 12px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:8}}>
                  <div style={{fontSize:12,fontWeight:600,color:'#e2e8f0'}}>{tech}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.3)'}}>{role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="lp-faq" style={{padding:'96px 24px',background:'linear-gradient(to bottom,#000,rgba(0,31,84,.08))'}}>
        <div style={{maxWidth:680,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(22px,4vw,40px)',fontWeight:700,textAlign:'center',marginBottom:40}}>
            <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>FAQ</span>
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {FAQS.map((faq,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,overflow:'hidden'}}>
                <div onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{cursor:'pointer',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                  <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:500,color:'#fff'}}>{faq.q}</span>
                  <span style={{color:'#60a5fa',fontSize:20,flexShrink:0,transform:openFaq===i?'rotate(45deg)':'none',transition:'transform .2s'}}>+</span>
                </div>
                {openFaq===i&&<div style={{padding:'0 20px 16px',color:'rgba(255,255,255,.5)',fontSize:14,lineHeight:1.7}}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'radial-gradient(ellipse at 50% 50%,rgba(26,107,255,.1),#000)',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}><WaveLogo size={56}/></div>
        <h2 style={{fontFamily:"'Orbitron',monospace",fontSize:'clamp(20px,4vw,38px)',fontWeight:700,marginBottom:14,color:'#fff'}}>Ready to Command Your Finances?</h2>
        <p style={{color:'rgba(255,255,255,.45)',fontSize:15,marginBottom:10}}>Join students and entrepreneurs who run their finances on FlowFund.</p>
        <p style={{color:'#60a5fa',fontSize:13,marginBottom:32}}>Free to start. No card. Works in your language.</p>
        <a href="/signup" style={{padding:'15px 48px',borderRadius:12,fontFamily:"'Orbitron',monospace",fontSize:14,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',boxShadow:'0 0 32px rgba(26,107,255,.45)'}}>Start Free — No Card Needed</a>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#000814',borderTop:'1px solid rgba(255,255,255,.06)',padding:'32px 24px 20px',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:12}}>
          <WaveLogo size={26}/>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:700,color:'#fff'}}>FlowFund OS</span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:22,marginBottom:12}}>
          {[['Login','/login'],['Sign Up','/signup'],['Pricing','#lp-pricing'],['FAQ','#lp-faq']].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:13,color:'rgba(255,255,255,.32)',textDecoration:'none'}}>{l}</a>
          ))}
        </div>
        <p style={{fontSize:11,color:'rgba(255,255,255,.16)'}}>2025 Maiwand Ahmadzai — FlowFund OS v3.0 — Next.js + Supabase + NVIDIA</p>
      </footer>
    </div>
  );
}
