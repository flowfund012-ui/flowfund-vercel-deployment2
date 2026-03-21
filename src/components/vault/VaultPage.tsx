'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { VAULT_ITEMS, planCanAccess } from '@/lib/utils';
import { StatCard, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { useUIStore } from '@/store/useUIStore';
import { recordVaultDownload, addSecurityLog, clearSecurityLogs } from '@/app/actions';
import type { SecurityLog } from '@/types/database';

// ── Vault ─────────────────────────────────────────────────────
interface VaultProps { downloadedIds: string[]; plan: string; userId: string; academyDone: number; }

export function VaultPage({ downloadedIds: initDl, plan, userId, academyDone }: VaultProps) {
  const { showToast, vaultFilter, setVaultFilter } = useUIStore();
  const [downloaded, setDownloaded] = useState(initDl);
  const [pending, startTransition] = useTransition();

  const filtered = vaultFilter === 'all' ? VAULT_ITEMS : VAULT_ITEMS.filter(v => v.type === vaultFilter);

  const handleDownload = (id: string, name: string, requiredPlan: string) => {
    if (!planCanAccess(plan, requiredPlan)) {
      showToast(`Requires ${requiredPlan} plan — upgrade to access`, 'error');
      return;
    }
    setDownloaded(prev => prev.includes(id) ? prev : [...prev, id]);
    startTransition(async () => { await recordVaultDownload(id); });
    showToast(`📥 ${name} — download started!`, 'success');
  };

  const hvPct = Math.min(100, Math.round((academyDone / 5) * 100));
  const filters = [['all','All'],['finance','Finance'],['business','Business'],['tools','AI Tools'],['books','eBooks']] as const;

  return (
    <>
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20 }}>
        <div><h1 style={{ fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#00f0ff',marginBottom:5 }}>Vault Access</h1><p style={{ fontSize:12,color:'rgba(226,232,240,.38)' }}>Secure Vault. Premium assets. Yours forever.</p></div>
        <div style={{ display:'flex',gap:8 }}>{filters.map(([id,label])=><button key={id} className={`btn btn-xs ${vaultFilter===id?'btn-primary':'btn-cyan'}`} onClick={()=>setVaultFilter(id)}>{label}</button>)}</div>
      </div>
      <div className="stat-row">
        <StatCard label="Assets"     value={String(VAULT_ITEMS.length)} bg="rgba(0,240,255,.05)" border="rgba(0,240,255,.15)" valueColor="#00f0ff" />
        <StatCard label="Downloaded" value={String(downloaded.length)}  bg="rgba(0,240,255,.05)" border="rgba(0,240,255,.15)" valueColor="#10b981" />
        <StatCard label="Total Size" value="67 MB"                       bg="rgba(0,240,255,.05)" border="rgba(0,240,255,.15)" valueColor="#00f0ff" />
        <StatCard label="Your Plan"  value={plan.charAt(0).toUpperCase()+plan.slice(1)} bg="rgba(0,240,255,.05)" border="rgba(0,240,255,.15)" valueColor="#f59e0b" />
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:12,marginBottom:20 }}>
        {filtered.map(v => {
          const dl = downloaded.includes(v.id);
          const locked = !planCanAccess(plan, v.requiredPlan);
          return (
            <div key={v.id} className="vault-asset" style={dl?{borderColor:'rgba(0,240,255,.3)',background:'rgba(0,240,255,.03)'}:{}}>
              <div style={{ width:48,height:48,borderRadius:12,background:'rgba(0,240,255,.08)',border:'1px solid rgba(0,240,255,.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{v.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
                  <span style={{ fontSize:15,fontWeight:700,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif" }}>{v.name}</span>
                  <Badge variant="cyan">{v.badge}</Badge>
                  {locked && <Badge variant="gold">🔒 {v.requiredPlan}</Badge>}
                  {dl && <Badge variant="green">✓ Downloaded</Badge>}
                </div>
                <div style={{ fontSize:12,color:'rgba(226,232,240,.4)' }}>{v.desc}</div>
              </div>
              <div style={{ textAlign:'right',flexShrink:0 }}>
                <div style={{ fontSize:11,color:'rgba(226,232,240,.3)',marginBottom:8 }}>{v.size}</div>
                {locked
                  ? <Link href="/dashboard/settings" className="btn btn-gold btn-sm" style={{ fontSize:11 }}><i className="fas fa-crown" /> Upgrade</Link>
                  : <button className={`btn btn-sm ${dl?'btn-cyan':'btn-primary'}`} onClick={() => handleDownload(v.id, v.name, v.requiredPlan)} disabled={pending} style={{ fontSize:11 }}>{dl?'↻ Re-download':'↓ Download'}</button>
                }
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)',border:'1px dashed rgba(0,240,255,.3)',borderRadius:14,padding:24 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12 }}>
          <div style={{ width:48,height:48,borderRadius:12,background:'rgba(0,240,255,.08)',border:'1px solid rgba(0,240,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><i className="fas fa-lock" style={{ color:'#00f0ff',fontSize:20 }} /></div>
          <div><div style={{ fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#00f0ff',marginBottom:4 }}>Hidden Vault</div><p style={{ fontSize:11,color:'rgba(226,232,240,.38)' }}>Complete 5 academy modules to unlock exclusive premium assets</p></div>
        </div>
        <ProgressBar pct={hvPct} colorClass="pbar-teal" style={{ boxShadow:'0 0 8px rgba(0,240,255,.4)' }} />
        <div style={{ fontSize:11,color:'rgba(226,232,240,.3)',marginTop:8 }}>{academyDone} / 5 modules completed</div>
      </div>
    </>
  );
}

// ── Security ──────────────────────────────────────────────────
const CHECKS = [
  { i:'🔐',l:'AES-256 Encryption',ok:true },{ i:'🌐',l:'SSL/TLS 1.3',ok:true },
  { i:'👁️',l:'Zero-Knowledge Proof',ok:true },{ i:'🛡️',l:'2FA Authentication',ok:false },
  { i:'🗂️',l:'Decentralized Storage',ok:true },{ i:'🤖',l:'AI Threat Monitoring',ok:true },
];

interface SecProps { initialLogs: SecurityLog[]; userId: string; }

export function SecurityPage({ initialLogs, userId }: SecProps) {
  const { showToast, lockdown, setLockdown } = useUIStore();
  const [logs, setLogs] = useState(initialLogs);
  const [scanning, setScanning] = useState(false);
  const [pending, startTransition] = useTransition();
  const score = 98;
  const ringCirc = 408.41;
  const ringOffset = ringCirc * (1 - score / 100);

  const handleScan = () => {
    setScanning(true);
    setTimeout(async () => {
      await addSecurityLog('Full scan completed — 0 threats found', 'success');
      setLogs(prev => [{ id: Math.random().toString(), user_id: userId, event: 'Full scan completed — 0 threats found', type: 'success', metadata: {}, created_at: new Date().toISOString() }, ...prev]);
      showToast('✅ Scan complete. All clear.', 'success');
      setScanning(false);
    }, 2000);
  };

  const handleLockdown = () => {
    const next = !lockdown;
    setLockdown(next);
    startTransition(async () => {
      await addSecurityLog(next ? 'LOCKDOWN MODE ACTIVATED' : 'Lockdown disabled', next ? 'error' : 'success');
    });
    showToast(next ? '🔒 LOCKDOWN ACTIVATED' : '🔓 Lockdown disabled', next ? 'error' : 'success');
  };

  const handleClearLogs = () => {
    setLogs([]);
    startTransition(async () => { await clearSecurityLogs(); });
    showToast('Log cleared', 'success');
  };

  const cyber = { background:'rgba(0,240,255,.025)',backdropFilter:'blur(16px)',border:'1px solid rgba(0,240,255,.1)',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,.35)' };

  return (
    <>
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20 }}>
        <div><h1 style={{ fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,color:'#00f0ff',marginBottom:5 }}>Security Hub</h1><p style={{ fontFamily:"'Roboto Mono',monospace",fontSize:11,color:'rgba(226,232,240,.35)',letterSpacing:'.05em' }}>YOUR FINANCIAL FORTRESS. MONITORED 24/7.</p></div>
        <div style={{ display:'flex',gap:8 }}>
          <button className="btn btn-cyan btn-sm" onClick={handleScan} disabled={scanning}>{scanning?<><i className="fas fa-circle-notch spinning"/> Scanning...</>:<><i className="fas fa-search"/> Run Scan</>}</button>
          <button onClick={handleLockdown} style={{ padding:'6px 12px',borderRadius:7,background:lockdown?'rgba(0,255,157,.12)':'rgba(255,0,0,.12)',border:`1px solid ${lockdown?'rgba(0,255,157,.25)':'rgba(255,0,0,.25)'}`,color:lockdown?'#00ff9d':'#ff5252',fontFamily:"'Orbitron',sans-serif",fontSize:10,cursor:'pointer',transition:'all .2s' }}>
            <i className={`fas ${lockdown?'fa-unlock':'fa-radiation'}`} /> {lockdown?'Disable Lockdown':'Lockdown Mode'}
          </button>
        </div>
      </div>
      <div className="stat-row">
        <StatCard label="Security Score" value={`${score}/100`}  bg="rgba(0,240,255,.05)"  border="rgba(0,240,255,.15)"  valueColor="#00f0ff"  labelFont="'Roboto Mono',monospace" />
        <StatCard label="Encryption"     value="AES-256"         bg="rgba(0,255,157,.05)"  border="rgba(0,255,157,.15)"  valueColor="#00ff9d"  labelFont="'Roboto Mono',monospace" />
        <StatCard label="Log Events"     value={String(logs.length)} bg="rgba(0,240,255,.05)" border="rgba(0,240,255,.15)" valueColor="#00f0ff" labelFont="'Roboto Mono',monospace" />
        <StatCard label="Mode" value={lockdown?'LOCKDOWN':'Normal'} bg={lockdown?'rgba(255,0,0,.08)':'rgba(0,240,255,.05)'} border={lockdown?'rgba(255,0,0,.2)':'rgba(0,240,255,.15)'} valueColor={lockdown?'#ff5252':'#00f0ff'} labelFont="'Roboto Mono',monospace" />
      </div>
      <div className="g2" style={{ marginBottom:20 }}>
        <div style={{ ...cyber,padding:24,textAlign:'center' }}>
          <div style={{ fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff',marginBottom:18 }}>Security Score</div>
          <div style={{ position:'relative',width:150,height:150,margin:'0 auto' }}>
            <svg width="150" height="150" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="75" cy="75" r="65" fill="none" stroke="rgba(0,240,255,.07)" strokeWidth="10"/>
              <circle cx="75" cy="75" r="65" fill="none" stroke="#00f0ff" strokeWidth="10" strokeDasharray={ringCirc} strokeDashoffset={ringOffset} strokeLinecap="round" style={{ transition:'stroke-dashoffset .7s',filter:'drop-shadow(0 0 6px rgba(0,240,255,.5))' }}/>
            </svg>
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column' }}>
              <div style={{ fontFamily:"'Roboto Mono',monospace",fontSize:30,fontWeight:500,color:'#00f0ff' }}>{score}</div>
              <div style={{ fontSize:10,color:'rgba(226,232,240,.3)',fontFamily:"'Roboto Mono',monospace" }}>/100</div>
            </div>
          </div>
          <Badge variant="green" style={{ marginTop:14 }}>🛡️ EXCELLENT</Badge>
        </div>
        <div style={{ ...cyber,padding:24 }}>
          <div style={{ fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff',marginBottom:16 }}>Encryption & Privacy</div>
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {CHECKS.map(c=>(
              <div key={c.l} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,fontFamily:"'Roboto Mono',monospace" }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>{c.i} {c.l}</div>
                <Badge variant={c.ok?'green':'red'}>{c.ok?'✓ Active':'○ Off'}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...cyber,padding:22,marginBottom:20 }}>
        <div className="sec-hdr" style={{ marginBottom:16 }}>
          <span className="sec-title" style={{ color:'#00f0ff',fontFamily:"'Roboto Mono',monospace" }}>Activity Log</span>
          <button className="btn btn-cyan btn-xs" onClick={handleClearLogs}>Clear</button>
        </div>
        {logs.length===0
          ? <div style={{ textAlign:'center',padding:18,fontSize:11,color:'rgba(226,232,240,.22)',fontFamily:"'Roboto Mono',monospace" }}>No activity logged</div>
          : logs.slice(0,10).map((l,i)=>(
            <div key={l.id||i} className="tx-item">
              <div className="tx-icon-wrap" style={{ background:l.type==='success'?'rgba(0,255,157,.1)':l.type==='error'?'rgba(255,0,0,.1)':'rgba(0,240,255,.1)' }}>{l.type==='success'?'✅':l.type==='error'?'❌':'ℹ️'}</div>
              <div style={{ flex:1 }}><div className="tx-name" style={{ color:'rgba(226,232,240,.7)',fontFamily:"'Roboto Mono',monospace",fontSize:12 }}>{l.event}</div><div className="tx-meta" style={{ fontFamily:"'Roboto Mono',monospace" }}>{new Date(l.created_at).toLocaleString()}</div></div>
            </div>
          ))
        }
      </div>
      <div style={{ background:'linear-gradient(135deg,#050a17,#0c1a3a)',borderLeft:'4px solid #00f0ff',borderRadius:12,padding:22 }}>
        <div style={{ display:'flex',gap:14,alignItems:'flex-start' }}>
          <div style={{ width:8,height:8,borderRadius:'50%',background:'#00f0ff',marginTop:4,animation:'dpulse 2s infinite',flexShrink:0 }} />
          <div>
            <div style={{ fontFamily:"'Roboto Mono',monospace",fontSize:12,color:'#00f0ff',marginBottom:8 }}>AI Security Auditor</div>
            <div style={{ fontSize:12,color:'rgba(226,232,240,.55)',lineHeight:1.7,fontFamily:"'Roboto Mono',monospace" }}>
              Your financial data is protected with military-grade <span style={{ color:'#00f0ff' }}>AES-256 encryption</span>. All connections secured via TLS 1.3. Zero-tracking policy active.<br/><br/>
              <span style={{ color:'#f59e0b' }}>Recommendation:</span> Enable 2FA to achieve a perfect 100/100 security score.<br/><br/>
              Last full audit: <span style={{ color:'#00f0ff' }}>{new Date().toLocaleDateString()}</span> — <span style={{ color:'#00ff9d' }}>No threats detected.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VaultPage;
