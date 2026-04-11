'use client';
import { useState } from 'react';
import Link from 'next/link';

function LogoMark({ size = 36 }: { size?: number }) {
  const r = Math.round(size * 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="lm" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a6bff"/>
          <stop offset="100%" stopColor="#7c00ff"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx={r} fill="#0d1225" stroke="rgba(26,107,255,0.4)" strokeWidth="1.5"/>
      <rect x="10" y="44" width="10" height="14" rx="2.5" fill="#1a6bff" opacity="0.7"/>
      <rect x="23" y="36" width="10" height="22" rx="2.5" fill="#7c00ff" opacity="0.85"/>
      <rect x="36" y="26" width="10" height="32" rx="2.5" fill="url(#lm)"/>
      <polyline points="15,42 28,34 41,24" fill="none" stroke="#00d4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="41,24 52,19 48,28" fill="#00d4ff"/>
    </svg>
  );
}

function NavLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={34}/>
      <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '.04em' }}>FlowFund</span>
    </div>
  );
}

const FAQS = [
  { q: 'What makes FlowFund different?', a: 'FlowFund is a full financial operating system built on real infrastructure — real auth, real database, real automation. Not a spreadsheet template.' },
  { q: 'Is this really $29/month?', a: 'Yes. $29/month for Pro, $49/month for Premium. Cancel anytime. No hidden fees. Payments via crypto — zero KYC, works globally.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your settings page and your subscription ends at the current billing period. No questions asked.' },
  { q: 'How secure is my data?', a: 'Your data is stored in Supabase with row-level security — only you can access your financial data. Zero-knowledge architecture.' },
  { q: 'Can I use it for business finances?', a: 'Yes. The Growth Engine module is built for freelancers and small business owners — revenue tracking, MRR simulation, P&L overview.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#000814', color: '#F5F9FF', fontFamily: "'Inter',sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: '#000814', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.07)', height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <NavLogo/>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['#lp-features','Features'],['#lp-pricing','Pricing'],['#lp-about','About'],['#lp-faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href} style={{ color: 'rgba(255,255,255,.6)', padding: '8px 12px', fontSize: 14, borderRadius: 6, textDecoration: 'none', transition: 'color .2s' }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ padding: '9px 18px', borderRadius: 10, fontFamily: "'Orbitron',monospace", fontSize: 12, border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.65)', textDecoration: 'none' }}>Login</a>
          <a href="/signup" style={{ padding: '9px 18px', borderRadius: 10, fontFamily: "'Orbitron',monospace", fontSize: 12, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(26,107,255,.35)' }}>Start Free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64, background: 'radial-gradient(ellipse at 50% 0%,rgba(26,107,255,.14),transparent 65%),radial-gradient(ellipse at 80% 80%,rgba(124,0,255,.08),transparent 50%)', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 800 }}>
          {/* Hero logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -16, background: 'radial-gradient(circle,rgba(26,107,255,.2),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}/>
              <LogoMark size={72}/>
            </div>
          </div>
          <div style={{ display: 'inline-block', padding: '4px 14px', fontSize: 11, fontFamily: "'Orbitron',monospace", borderRadius: 100, color: '#60a5fa', background: 'rgba(30,58,138,.45)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>
            Version 3.0 — Now Monthly
          </div>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(30px,6vw,66px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: '#fff' }}>
            Your Complete<br/>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Financial OS</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.58)', marginBottom: 14, maxWidth: 540, margin: '0 auto 14px' }}>
            Track income, automate savings, grow your business revenue. Built for students, freelancers, and entrepreneurs.
          </p>
          <p style={{ fontSize: 14, color: '#60a5fa', marginBottom: 40 }}>From $0/month — Free forever. Upgrade when you are ready.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" style={{ padding: '14px 36px', borderRadius: 12, fontFamily: "'Orbitron',monospace", fontSize: 13, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', boxShadow: '0 0 28px rgba(26,107,255,.4)' }}>Start Free Today</a>
            <a href="#lp-pricing" style={{ padding: '14px 36px', borderRadius: 12, fontFamily: "'Orbitron',monospace", fontSize: 13, border: '1px solid rgba(96,165,250,.4)', color: '#60a5fa', textDecoration: 'none' }}>See Pricing</a>
          </div>
          <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[['6','Modules'],['Real-time','Insights'],['Zero-KYC','Payments'],['Bank-grade','Security']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa', fontFamily: "'Orbitron',monospace" }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.38)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="lp-features" style={{ padding: '96px 24px', background: '#000' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(22px,4vw,42px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>6 Modules. One Platform.</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.45)', fontSize: 15, marginBottom: 56 }}>Everything you need to command your financial future.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {[
              { icon: 'T', title: 'Mission Tracker', desc: 'Real-time income and expense tracking with recurring transactions, budget vs actual, and smart categorization.', tags: ['Budgets','Recurring','CSV Export'] },
              { icon: 'A', title: 'AutoPilot', desc: 'Set-it-and-forget-it savings automation. Define rules, allocate percentages, hit your goals on autopilot.', tags: ['Automation','Goals','Smart Save'] },
              { icon: 'G', title: 'Growth Engine', desc: 'Built for entrepreneurs. Track revenue streams, simulate MRR, see net profit vs expenses in one view.', tags: ['MRR Simulator','P&L','Pro Tools'] },
              { icon: 'E', title: 'Personal Academy', desc: 'Structured financial education tailored to your role. Student, freelancer, or business owner — all covered.', tags: ['Courses','XP System','Progress'] },
              { icon: 'V', title: 'Vault Access', desc: 'Templates, spreadsheets, tools, and resources updated every month. An ever-growing library of financial assets.', tags: ['Templates','Tools','Monthly Drops'] },
              { icon: 'S', title: 'Security Hub', desc: 'Full audit log of all account activity. Row-level security on all data. Your finances, only visible to you.', tags: ['Audit Log','RLS','Encrypted'] },
            ].map(m => (
              <div key={m.title} style={{ background: 'rgba(13,17,23,.8)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 26 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(26,107,255,.12)', border: '1px solid rgba(26,107,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontFamily: "'Orbitron',monospace", fontSize: 16, fontWeight: 700, color: '#60a5fa' }}>{m.icon}</div>
                <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, fontWeight: 700, marginBottom: 9 }}>{m.title}</h3>
                <p style={{ color: 'rgba(255,255,255,.48)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{m.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', fontSize: 10, borderRadius: 100, background: 'rgba(96,165,250,.09)', color: '#60a5fa', border: '1px solid rgba(96,165,250,.18)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="lp-pricing" style={{ padding: '96px 24px', background: 'linear-gradient(to bottom,#000,rgba(0,31,84,.08))' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(22px,4vw,42px)', fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Simple Monthly Pricing</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.45)', fontSize: 15, marginBottom: 8 }}>Start free. Upgrade when you need more. Cancel anytime.</p>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.28)', fontSize: 12, marginBottom: 52 }}>All paid plans use crypto via NOWPayments — Zero KYC, works globally</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {/* FREE */}
            <div style={{ background: 'rgba(13,17,23,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 30 }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, marginBottom: 8 }}>Free</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 38, fontWeight: 900, marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', marginBottom: 22 }}>Forever free — no card needed</div>
              {['Dashboard & Insights','Mission Tracker (50 txns/mo)','AutoPilot (1 goal)','Academy (3 free courses)','2 Vault assets','Security Hub'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.6)' }}>
                  <span style={{ color: '#10b981', fontSize: 10, flexShrink: 0 }}>OK</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 22, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Get Started Free</a>
            </div>
            {/* PRO */}
            <div style={{ background: 'rgba(26,107,255,.05)', border: '1px solid rgba(26,107,255,.28)', borderRadius: 20, padding: 30 }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, marginBottom: 8 }}>Pro</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 38, fontWeight: 900, color: '#00f2ff' }}>$29</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.38)', marginLeft: 4 }}>/month</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', marginBottom: 22 }}>Cancel anytime — crypto payment</div>
              {['Everything in Free','Unlimited transactions','Growth Engine','All Academy courses','Vault (4 assets + monthly drops)','Advanced charts & CSV export','Budget system (all categories)','Recurring transactions'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.6)' }}>
                  <span style={{ color: '#10b981', fontSize: 10, flexShrink: 0 }}>OK</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 22, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Start Pro — $29/mo</a>
            </div>
            {/* PREMIUM */}
            <div style={{ background: 'rgba(255,215,0,.04)', border: '1px solid rgba(255,215,0,.32)', borderRadius: 20, padding: 30, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', fontFamily: "'Orbitron',monospace", fontSize: 9, fontWeight: 700, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>BEST VALUE</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 16, marginBottom: 8 }}>Premium</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 38, fontWeight: 900, color: '#ffd700' }}>$49</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.38)', marginLeft: 4 }}>/month</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', marginBottom: 22 }}>Cancel anytime — crypto payment</div>
              {['Everything in Pro','Full Vault (unlimited assets)','Hidden Vault unlocked monthly','AI-powered financial insights','Priority support (24h response)','Early access to new features','Custom categories & tags','Financial snapshot reports'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.6)' }}>
                  <span style={{ color: '#ffd700', fontSize: 10, flexShrink: 0 }}>*</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 22, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Start Premium — $49/mo</a>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'rgba(255,255,255,.28)' }}>
            Payments via NOWPayments — BTC, ETH, USDT, USDC and 150+ coins. Zero KYC. Cancel anytime from settings.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="lp-about" style={{ padding: '96px 24px', background: '#000' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ width: 240, height: 240, borderRadius: 24, background: 'rgba(13,17,23,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(26,107,255,.2)', flexShrink: 0, flexDirection: 'column', gap: 12 }}>
            <LogoMark size={72}/>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700, color: '#fff' }}>Maiwand</div>
              <div style={{ fontSize: 10, color: '#60a5fa', fontFamily: "'Orbitron',monospace", letterSpacing: '.08em' }}>Mission Architect</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(18px,3vw,34px)', fontWeight: 700, marginBottom: 18 }}>
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Built for Real People, Not Demos</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>FlowFund started from a real problem: financial tools are either too basic or too complex. There was nothing built specifically for students, freelancers, and small business owners who need real power without the noise.</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.8, marginBottom: 22 }}>Built with Next.js, TypeScript, Supabase, and NOWPayments. Every feature is real — real auth, real data, real automation. No demo placeholders.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[['Next.js 14','Frontend'],['Supabase','Backend'],['NOWPayments','Crypto'],['TypeScript','Type-safe']].map(([tech,role]) => (
                <div key={tech} style={{ padding: '8px 14px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{tech}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.32)' }}>{role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="lp-faq" style={{ padding: '96px 24px', background: 'linear-gradient(to bottom,#000,rgba(0,31,84,.08))' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(22px,4vw,42px)', fontWeight: 700, textAlign: 'center', marginBottom: 44 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FAQ</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ cursor: 'pointer', padding: '17px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 500 }}>{faq.q}</span>
                  <span style={{ color: '#60a5fa', fontSize: 20, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 17px', color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'radial-gradient(ellipse at 50% 50%,rgba(26,107,255,.12),#000)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <LogoMark size={56}/>
        </div>
        <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 'clamp(20px,4vw,40px)', fontWeight: 700, marginBottom: 14 }}>Ready to Command Your Finances?</h2>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 15, marginBottom: 10 }}>Join students and entrepreneurs who run their finances on FlowFund.</p>
        <p style={{ color: '#60a5fa', fontSize: 13, marginBottom: 34 }}>Free to start. $29/month when you need the full system.</p>
        <a href="/signup" style={{ padding: '15px 48px', borderRadius: 12, fontFamily: "'Orbitron',monospace", fontSize: 14, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', boxShadow: '0 0 32px rgba(26,107,255,.45)' }}>Start Free — No Card Needed</a>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#000814', borderTop: '1px solid rgba(255,255,255,.06)', padding: '36px 24px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          <LogoMark size={28}/>
          <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 700 }}>FlowFund OS</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14 }}>
          {[['Login','/login'],['Sign Up','/signup'],['Pricing','#lp-pricing'],['FAQ','#lp-faq']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.18)' }}>2025 Maiwand Ahmadzai — FlowFund OS v3.0 — Built with Next.js + Supabase</p>
      </footer>

    </div>
  );
}
