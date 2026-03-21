'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  { icon:'fa-chart-line',    title:'Mission Tracker',  desc:'Real-time income & expense tracking with predictive analytics and smart categorization.',       tags:[{l:'Automated',c:'blue'},{l:'AI-Powered',c:'purple'}] },
  { icon:'fa-robot',         title:'AutoPilot',        desc:'Set-it-and-forget-it savings & investment automation with intelligent allocation algorithms.',     tags:[{l:'Automated',c:'blue'},{l:'Smart',c:'green'}] },
  { icon:'fa-bolt',          title:'Growth Engine',    desc:'Entrepreneur tools for scaling your business with financial insights and cash flow optimization.', tags:[{l:'Pro Tools',c:'purple'},{l:'Scaling',c:'yellow'}] },
  { icon:'fa-graduation-cap',title:'Personal Academy', desc:'Financial education resources tailored to your goals and current financial situation.',           tags:[{l:'Learning',c:'blue'},{l:'Guided',c:'green'}] },
  { icon:'fa-lock',          title:'Vault Access',     desc:'Exclusive templates, tools, and lifetime updates to keep your financial system cutting-edge.',    tags:[{l:'Exclusive',c:'purple'},{l:'Bonuses',c:'yellow'}] },
  { icon:'fa-shield-alt',    title:'Security Hub',     desc:'Military-grade encryption and privacy controls to protect your financial data.',                  tags:[{l:'Secure',c:'blue'},{l:'Private',c:'green'}] },
];
const TAG_COLORS: Record<string,{color:string;bg:string}> = {
  blue:{color:'#60a5fa',bg:'rgba(30,58,138,.3)'}, purple:{color:'#a78bfa',bg:'rgba(76,29,149,.3)'},
  green:{color:'#34d399',bg:'rgba(6,78,59,.3)'},  yellow:{color:'#fbbf24',bg:'rgba(92,50,0,.3)'},
};
const FAQS = [
  { q:'What makes FlowFund different?', a:'FlowFund is a complete command center — tracking, automation, education, and business tools in one system powered by Supabase and built for modern students and entrepreneurs.' },
  { q:'Is this really a one-time payment?', a:'Yes — lifetime access for a single payment of $19. No subscriptions. All future updates included.' },
  { q:'How secure is my data?', a:'Bank-level encryption, Supabase Row-Level Security, and zero credential storage. Your data belongs only to you.' },
  { q:'Can I use it for business finances?', a:'Absolutely. The Growth Engine module includes revenue tracking, cash flow analysis, financial projections, and AI insights.' },
  { q:"What if I'm not satisfied?", a:"30-day satisfaction guarantee — full refund, no questions asked." },
];

export default function LandingPage() {
  const starsRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  useEffect(() => {
    const c = starsRef.current; if(!c) return;
    for(let i=0;i<200;i++){const s=document.createElement('div');const size=Math.random()*2+1;s.className='star';s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;--op:${Math.random()*.8+.2};--dur:${Math.random()*5+3}s`;c.appendChild(s);}
    return () => { if(c) c.innerHTML=''; };
  }, []);

  const lpBtn = { padding:'14px 32px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontSize:14, border:'none', cursor:'pointer', transition:'all .2s', display:'inline-flex', alignItems:'center', gap:8 } as React.CSSProperties;

  return (
    <div style={{ backgroundColor:'#000814', color:'#F5F9FF', fontFamily:"'Roboto',sans-serif", overflowX:'hidden' }}>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'rgba(0,0,0,.8)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,.08)', height:64, display:'flex', alignItems:'center', padding:'0 32px', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1a6bff,#7c00ff)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 15px rgba(0,102,255,.5)' }}><i className="fas fa-rocket" style={{ color:'#fff', fontSize:16 }} /></div>
          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:700, textShadow:'0 0 8px rgba(245,249,255,.5)' }}>FlowFund</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {[['Home','#lp-home'],['Features','#lp-features'],['Pricing','#lp-pricing'],['About','#lp-about'],['FAQ','#lp-faq']].map(([label,href])=>(
            <a key={label} href={href} style={{ color:'rgba(255,255,255,.7)', padding:'8px 12px', fontSize:14, borderRadius:6, transition:'color .2s' }} onMouseOver={e=>(e.currentTarget.style.color='#fff')} onMouseOut={e=>(e.currentTarget.style.color='rgba(255,255,255,.7)')}>{label}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Link href="/login" style={{ ...lpBtn, padding:'9px 18px', background:'transparent', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.15)', fontSize:13 }}>Login</Link>
          <Link href="/signup" style={{ ...lpBtn, padding:'9px 18px', background:'linear-gradient(135deg,#1a6bff,#7c00ff)', color:'#fff', boxShadow:'0 0 12px rgba(0,102,255,.4)', fontSize:13 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="lp-home" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', paddingTop:64, background:'radial-gradient(ellipse at center,#001F54 0%,#000814 70%)' }}>
        <div ref={starsRef} style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:800, padding:'0 24px' }}>
          <div style={{ display:'inline-block', padding:'4px 12px', fontSize:11, fontFamily:"'Orbitron',sans-serif", borderRadius:100, color:'#60a5fa', background:'rgba(30,58,138,.5)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:28 }}>Version 2.0 · Powered by Supabase</div>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(32px,6vw,72px)', fontWeight:700, lineHeight:1.15, marginBottom:20, textShadow:'0 0 8px rgba(245,249,255,.4)' }}>
            Welcome to<br/>
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FlowFund Command Center</span>
          </h1>
          <p style={{ fontSize:18, color:'rgba(255,255,255,.65)', marginBottom:40 }}>Command Your Financial Future. <span style={{ color:'#60a5fa' }}>Effortlessly.</span></p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/signup" style={{ ...lpBtn, background:'linear-gradient(135deg,#1a6bff,#7c00ff)', color:'#fff', boxShadow:'0 0 18px rgba(0,102,255,.5)' }}>Launch Free <i className="fas fa-arrow-right" /></Link>
            <a href="#lp-features" style={{ ...lpBtn, background:'transparent', color:'#60a5fa', border:'1px solid #3b82f6' }}>Explore Features</a>
          </div>
          <div style={{ marginTop:60, color:'rgba(255,255,255,.4)', fontSize:22, animation:'bounce 2s infinite' }}>
            <a href="#lp-features" style={{ color:'inherit' }}><i className="fas fa-chevron-down" /></a>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top,#000814,transparent)', zIndex:1 }} />
      </section>

      {/* FEATURES */}
      <section id="lp-features" style={{ padding:'96px 24px', background:'#000' }}>
        <div style={{ maxWidth:1120, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(24px,4vw,48px)', fontWeight:700, textAlign:'center', marginBottom:12 }}>
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Mission Control</span>
          </h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.55)', fontSize:17, marginBottom:60, maxWidth:640, margin:'0 auto 60px' }}>Your complete financial command center. 6 modules. One platform.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24, marginBottom:48 }}>
            {FEATURES.map(f=>(
              <div key={f.title} className="lp-feat-card">
                <div style={{ fontSize:36, color:'#0066FF', marginBottom:16 }}><i className={`fas ${f.icon}`} /></div>
                <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:700, marginBottom:10 }}>{f.title}</h3>
                <p style={{ color:'rgba(255,255,255,.5)', fontSize:14, lineHeight:1.7, marginBottom:20 }}>{f.desc}</p>
                <div>{f.tags.map(t=><span key={t.l} style={{ display:'inline-block', padding:'3px 10px', fontSize:11, fontFamily:"'Orbitron',sans-serif", borderRadius:100, marginRight:6, color:TAG_COLORS[t.c].color, background:TAG_COLORS[t.c].bg }}>{t.l}</span>)}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center' }}><Link href="/signup" style={{ ...lpBtn, background:'linear-gradient(135deg,#1a6bff,#7c00ff)', color:'#fff', boxShadow:'0 0 18px rgba(0,102,255,.5)' }}>Access Full System <i className="fas fa-arrow-right" /></Link></div>
        </div>
      </section>

      {/* PRICING */}
      <section id="lp-pricing" style={{ padding:'96px 24px', background:'linear-gradient(to bottom,#000,rgba(0,31,84,.12))' }}>
        <div style={{ maxWidth:1120, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(24px,4vw,48px)', fontWeight:700, textAlign:'center', marginBottom:12 }}>
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Simple Pricing</span>
          </h2>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,.55)', fontSize:17, marginBottom:60 }}>One-time payments. Lifetime access. No subscriptions.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24, maxWidth:900, margin:'0 auto' }}>
            {/* Free */}
            <div style={{ background:'rgba(15,20,35,.6)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:28 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, marginBottom:8 }}>🆓 Free</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:32, fontWeight:700, marginBottom:4 }}>$0</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginBottom:20 }}>Forever free</div>
              {['Dashboard','Mission Tracker','AutoPilot (basic)','Academy (3 courses)','2 Vault assets'].map(f=><div key={f} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.65)' }}><i className="fas fa-check-circle" style={{ color:'#10b981',fontSize:11 }}/>{f}</div>)}
              <Link href="/signup" className="btn btn-cyan btn-block btn-sm" style={{ marginTop:18 }}>Get Started Free</Link>
            </div>
            {/* Pro */}
            <div style={{ background:'rgba(0,102,255,.06)', border:'1px solid rgba(0,102,255,.25)', borderRadius:16, padding:28 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, marginBottom:8 }}>⚡ Pro</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:32, fontWeight:700, color:'#00f2ff', marginBottom:4 }}>$9<span style={{ fontSize:14,color:'rgba(255,255,255,.4)',fontWeight:400 }}> once</span></div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginBottom:20 }}>Lifetime · Crypto payment</div>
              {['Everything in Free','Growth Engine','All 6 Academy courses','4 Vault assets','Advanced charts','CSV export'].map(f=><div key={f} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.65)' }}><i className="fas fa-check-circle" style={{ color:'#10b981',fontSize:11 }}/>{f}</div>)}
              <Link href="/signup" className="btn btn-primary btn-block btn-sm" style={{ marginTop:18 }}>Get Pro</Link>
            </div>
            {/* Premium */}
            <div style={{ background:'rgba(255,215,0,.04)', border:'1px solid rgba(255,215,0,.3)', borderRadius:16, padding:28, position:'relative' }}>
              <div style={{ position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#ffd700,#daa520)',color:'#000',fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,padding:'4px 14px',borderRadius:'0 0 10px 10px' }}>BEST VALUE</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, marginBottom:8 }}>👑 Premium</div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:32, fontWeight:700, color:'#ffd700', marginBottom:4 }}>$19<span style={{ fontSize:14,color:'rgba(255,255,255,.4)',fontWeight:400 }}> once</span></div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginBottom:20 }}>Lifetime · Crypto payment</div>
              {['Everything in Pro','Full Vault (6 assets)','Hidden Vault unlocked','Priority support','Lifetime updates'].map(f=><div key={f} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,marginBottom:7,color:'rgba(255,255,255,.65)' }}><i className="fas fa-check-circle" style={{ color:'#10b981',fontSize:11 }}/>{f}</div>)}
              <Link href="/signup" className="btn btn-gold btn-block btn-sm" style={{ marginTop:18 }}>Get Premium</Link>
            </div>
          </div>
          <p style={{ textAlign:'center',marginTop:24,fontSize:12,color:'rgba(255,255,255,.3)' }}><i className="fab fa-bitcoin" style={{ marginRight:6 }} />Payments via NOWPayments — BTC, ETH, USDT, USDC and 150+ coins. Zero KYC. Works globally.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="lp-about" style={{ padding:'96px 24px', background:'#000' }}>
        <div style={{ maxWidth:1120, margin:'0 auto', display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>
          <div style={{ width:280, height:280, borderRadius:16, background:'linear-gradient(135deg,rgba(30,58,138,.5),rgba(76,29,149,.5))', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(100,149,237,.2)', flexShrink:0 }}>
            <div style={{ textAlign:'center', padding:24 }}>
              <div style={{ width:100,height:100,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#7c00ff)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 20px rgba(0,102,255,.5)' }}><i className="fas fa-user-astronaut" style={{ fontSize:40,color:'#fff' }} /></div>
              <h3 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:18,marginBottom:6 }}>Maiwand Ahmadzai</h3>
              <p style={{ color:'#60a5fa',fontFamily:"'Orbitron',sans-serif",fontSize:12 }}>Mission Architect</p>
            </div>
          </div>
          <div style={{ flex:1, minWidth:280 }}>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(20px,3vw,36px)',fontWeight:700,marginBottom:20 }}>
              <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Engineered for the Future of Finance</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,.6)',fontSize:15,lineHeight:1.8,marginBottom:16 }}>FlowFund was born from a simple vision: create a financial OS that works for modern students and entrepreneurs. Real Supabase backend, real auth, real data — no demo placeholders.</p>
            <p style={{ color:'rgba(255,255,255,.6)',fontSize:15,lineHeight:1.8,marginBottom:24 }}>Built with Next.js 14, TypeScript, Supabase, and NOWPayments — a full-stack SaaS platform ready for production.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="lp-faq" style={{ padding:'96px 24px', background:'linear-gradient(to bottom,#000,rgba(0,31,84,.12))' }}>
        <div style={{ maxWidth:1120, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(24px,4vw,48px)',fontWeight:700,textAlign:'center',marginBottom:60 }}>
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>FAQ</span>
          </h2>
          <div style={{ maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{ borderRadius:12, overflow:'hidden' }}>
                <div onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ cursor:'pointer',padding:'20px 24px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)',borderRadius:openFaq===i?'12px 12px 0 0':12,display:'flex',justifyContent:'space-between',alignItems:'center' }} onMouseOver={e=>(e.currentTarget.style.background='rgba(255,255,255,.07)')} onMouseOut={e=>(e.currentTarget.style.background='rgba(255,255,255,.04)')}>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:500 }}>{f.q}</h3>
                  <i className="fas fa-chevron-down" style={{ color:'#60a5fa',transition:'transform .3s',transform:openFaq===i?'rotate(180deg)':'none',flexShrink:0,marginLeft:16 }} />
                </div>
                {openFaq===i && <div style={{ padding:'16px 24px',background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',borderTop:'none',borderRadius:'0 0 12px 12px' }}><p style={{ color:'rgba(255,255,255,.55)',fontSize:14,lineHeight:1.8 }}>{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 24px', background:'radial-gradient(ellipse at center,rgba(0,31,84,.3),#000)', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(24px,4vw,44px)',fontWeight:700,marginBottom:16 }}>Ready to Command Your Finances?</h2>
        <p style={{ color:'rgba(255,255,255,.55)',fontSize:17,marginBottom:36 }}>Join thousands of students and entrepreneurs. Free to start.</p>
        <Link href="/signup" style={{ ...lpBtn, background:'linear-gradient(135deg,#1a6bff,#7c00ff)', color:'#fff', boxShadow:'0 0 24px rgba(0,102,255,.5)', fontSize:16, padding:'16px 40px' }}>
          Get Started Free <i className="fas fa-rocket" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'rgba(0,0,0,.8)', borderTop:'1px solid rgba(255,255,255,.06)', padding:'40px 24px 24px', textAlign:'center' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16 }}>
          <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#7c00ff)',display:'flex',alignItems:'center',justifyContent:'center' }}><i className="fas fa-rocket" style={{ color:'#fff',fontSize:13 }} /></div>
          <span style={{ fontFamily:"'Orbitron',sans-serif",fontSize:17,fontWeight:700 }}>FlowFund OS</span>
        </div>
        <div style={{ display:'flex',justifyContent:'center',gap:24,marginBottom:16 }}>
          <Link href="/login" style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>Login</Link>
          <Link href="/signup" style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>Sign Up</Link>
          <a href="#lp-faq" style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>FAQ</a>
        </div>
        <p style={{ fontSize:12,color:'rgba(255,255,255,.2)' }}>© 2024 Maiwand Ahmadzai · FlowFund OS v2.0 · Built with Next.js + Supabase</p>
      </footer>
    </div>
  );
}
