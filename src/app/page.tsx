'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  { q: 'What makes FlowFund different?', a: 'FlowFund is a full financial operating system built on real infrastructure -- real auth, real database, real automation. Not a spreadsheet template.' },
  { q: 'Is this really $29/month?', a: 'Yes. $29/month for Pro, $49/month for Premium. Cancel anytime. No hidden fees. Payments via crypto -- zero KYC, works globally.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your settings page and your subscription ends at the current billing period. No questions asked.' },
  { q: 'How secure is my data?', a: 'Your data is stored in Supabase with row-level security -- only you can access your financial data. Zero-knowledge architecture.' },
  { q: 'Can I use it for business finances?', a: 'Yes. The Growth Engine module is built for freelancers and small business owners -- revenue tracking, MRR simulation, P&L overview.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#000814', color: '#F5F9FF', fontFamily: "'Roboto',sans-serif", overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.08)', height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18 }}>F</span>
          </div>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 700 }}>FlowFund</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['#lp-features','Features'],['#lp-pricing','Pricing'],['#lp-about','About'],['#lp-faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href} style={{ color: 'rgba(255,255,255,.7)', padding: '8px 12px', fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ padding: '9px 18px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontSize: 13, border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>Login</a>
          <a href="/signup" style={{ padding: '9px 18px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontSize: 13, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none' }}>Start Free</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="lp-home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64, background: 'radial-gradient(ellipse at center,#001F54 0%,#000814 70%)', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', fontSize: 11, fontFamily: "'Orbitron',sans-serif", borderRadius: 100, color: '#60a5fa', background: 'rgba(30,58,138,.5)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 28 }}>
            Version 3.0 - Now Monthly
          </div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(32px,6vw,68px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
            Your Complete<br />
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Financial OS</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.65)', marginBottom: 16, maxWidth: 560, margin: '0 auto 16px' }}>
            Track income, automate savings, grow your business revenue. Built for students, freelancers, and entrepreneurs.
          </p>
          <p style={{ fontSize: 14, color: '#60a5fa', marginBottom: 40 }}>From $0/month - Free forever. Upgrade when you're ready.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" style={{ padding: '14px 36px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontSize: 14, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', boxShadow: '0 0 24px rgba(0,102,255,.4)' }}>Start Free Today</a>
            <a href="#lp-pricing" style={{ padding: '14px 36px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontSize: 14, border: '1px solid #3b82f6', color: '#60a5fa', textDecoration: 'none' }}>See Pricing</a>
          </div>
          <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[['6','Modules'],['Real-time','Insights'],['Zero-KYC','Payments'],['Bank-grade','Security']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa', fontFamily: "'Orbitron',sans-serif" }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="lp-features" style={{ padding: '96px 24px', background: '#000' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(24px,4vw,44px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>6 Modules. One Platform.</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 16, marginBottom: 60 }}>Everything you need to command your financial future.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {[
              { icon: 'T', title: 'Mission Tracker', desc: 'Real-time income & expense tracking with recurring transactions, budget vs actual, and smart categorization.', tags: ['Budgets','Recurring','CSV Export'] },
              { icon: 'A', title: 'AutoPilot', desc: 'Set-it-and-forget-it savings automation. Define rules, allocate percentages, hit your goals on autopilot.', tags: ['Automation','Goals','Smart Save'] },
              { icon: 'G', title: 'Growth Engine', desc: 'Built for entrepreneurs. Track revenue streams, simulate MRR, see net profit vs expenses in one view.', tags: ['MRR Simulator','P&L','Pro Tools'] },
              { icon: 'P', title: 'Personal Academy', desc: 'Structured financial education tailored to your role. Student, freelancer, or business owner -- all covered.', tags: ['Courses','XP System','Streaks'] },
              { icon: 'V', title: 'Vault Access', desc: 'Templates, spreadsheets, tools, and resources updated every month. An ever-growing library of financial assets.', tags: ['Templates','Tools','Monthly Updates'] },
              { icon: 'S', title: 'Security Hub', desc: 'Full audit log of all account activity. Row-level security on all data. Your finances, only visible to you.', tags: ['Audit Log','RLS','Encrypted'] },
            ].map(m => (
              <div key={m.title} style={{ background: 'rgba(15,20,35,.7)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(26,107,255,.15)', border: '1px solid rgba(26,107,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontFamily: "'Orbitron',sans-serif", fontSize: 18, color: '#60a5fa' }}>{m.icon}</div>
                <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{m.title}</h3>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{m.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', fontSize: 10, borderRadius: 100, background: 'rgba(96,165,250,.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,.2)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="lp-pricing" style={{ padding: '96px 24px', background: 'linear-gradient(to bottom,#000,rgba(0,31,84,.1))' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(24px,4vw,44px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Simple Monthly Pricing</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 16, marginBottom: 8 }}>Start free. Upgrade when you need more. Cancel anytime.</p>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 13, marginBottom: 60 }}>All paid plans use crypto payments via NOWPayments - Zero KYC, works globally</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
            {/* FREE */}
            <div style={{ background: 'rgba(15,20,35,.6)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: 32 }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, marginBottom: 8 }}>Free</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 40, fontWeight: 700, marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>Forever free - no card needed</div>
              {['Dashboard & Insights','Mission Tracker (50 txns/mo)','AutoPilot (1 goal)','Academy (3 free courses)','2 Vault assets','Security Hub'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.65)' }}>
                  <span style={{ color: '#10b981', fontSize: 11 }}>OK</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 24, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Get Started Free</a>
            </div>
            {/* PRO */}
            <div style={{ background: 'rgba(0,102,255,.06)', border: '1px solid rgba(0,102,255,.3)', borderRadius: 20, padding: 32 }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, marginBottom: 8 }}>Pro</div>
              <div>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 40, fontWeight: 700, color: '#00f2ff' }}>$29</span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', marginLeft: 4 }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>Cancel anytime - crypto payment</div>
              {['Everything in Free','Unlimited transactions','Growth Engine','All Academy courses','Vault (4 assets + monthly drops)','Advanced charts & CSV export','Budget system (all categories)','Recurring transactions'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.65)' }}>
                  <span style={{ color: '#10b981', fontSize: 11 }}>OK</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 24, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Start Pro - $29/mo</a>
            </div>
            {/* PREMIUM */}
            <div style={{ background: 'rgba(255,215,0,.04)', border: '1px solid rgba(255,215,0,.35)', borderRadius: 20, padding: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, padding: '4px 16px', borderRadius: 100 }}>BEST VALUE</div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, marginBottom: 8 }}>Premium</div>
              <div>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 40, fontWeight: 700, color: '#ffd700' }}>$49</span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', marginLeft: 4 }}>/month</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>Cancel anytime - crypto payment</div>
              {['Everything in Pro','Full Vault (unlimited assets)','Hidden Vault unlocked monthly','AI-powered financial insights','Priority support (24h response)','Early access to new features','Custom categories & tags','Financial snapshot reports'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,.65)' }}>
                  <span style={{ color: '#ffd700', fontSize: 11 }}>*</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display: 'block', marginTop: 24, padding: '11px', borderRadius: 10, textAlign: 'center', background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Start Premium - $49/mo</a>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,.3)' }}>
            Payments via NOWPayments - BTC, ETH, USDT, USDC and 150+ coins. Zero KYC. Cancel anytime from your settings.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="lp-about" style={{ padding: '96px 24px', background: '#000' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ width: 260, height: 260, borderRadius: 20, background: 'linear-gradient(135deg,rgba(30,58,138,.5),rgba(76,29,149,.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(100,149,237,.2)', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32 }}>M</div>
              <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, marginBottom: 4 }}>Maiwand Ahmadzai</h3>
              <p style={{ color: '#60a5fa', fontFamily: "'Orbitron',sans-serif", fontSize: 11 }}>Mission Architect</p>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(20px,3vw,36px)', fontWeight: 700, marginBottom: 20 }}>
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Built for Real People, Not Demos</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>FlowFund started from a real problem: financial tools are either too basic (spreadsheets) or too complex (enterprise software). There was nothing built specifically for students, freelancers, and small business owners who need real power without the noise.</p>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>Built with Next.js, TypeScript, Supabase, and NOWPayments. Every feature is real -- real auth, real data, real automation. No demo placeholders.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[['Next.js 14','Frontend'],['Supabase','Backend'],['NOWPayments','Crypto'],['TypeScript','Type-safe']].map(([tech,role]) => (
                <div key={tech} style={{ padding: '8px 14px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{tech}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="lp-faq" style={{ padding: '96px 24px', background: 'linear-gradient(to bottom,#000,rgba(0,31,84,.1))' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(24px,4vw,44px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAQ</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ cursor: 'pointer', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 500 }}>{faq.q}</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 18px', color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'radial-gradient(ellipse at center,rgba(0,31,84,.3),#000)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(22px,4vw,42px)', fontWeight: 700, marginBottom: 16 }}>Ready to Command Your Finances?</h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 16, marginBottom: 12 }}>Join students and entrepreneurs who run their finances on FlowFund.</p>
        <p style={{ color: '#60a5fa', fontSize: 14, marginBottom: 36 }}>Free to start. $29/month when you need the full system.</p>
        <a href="/signup" style={{ padding: '16px 48px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontSize: 15, background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', color: '#fff', textDecoration: 'none', boxShadow: '0 0 28px rgba(0,102,255,.5)' }}>Start Free - No Card Needed</a>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'rgba(0,0,0,.8)', borderTop: '1px solid rgba(255,255,255,.06)', padding: '40px 24px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#1a6bff,#7c00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>F</div>
          <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 17, fontWeight: 700 }}>FlowFund OS</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
          <a href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Login</a>
          <a href="/signup" style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Sign Up</a>
          <a href="#lp-pricing" style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Pricing</a>
          <a href="#lp-faq" style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>FAQ</a>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>2025 Maiwand Ahmadzai - FlowFund OS v3.0 - Built with Next.js + Supabase</p>
      </footer>
    </div>
  );
}
