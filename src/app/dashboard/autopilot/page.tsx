'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const f = (n: number) => '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export default function AutopilotPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [log, setLog] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGoal, setShowGoal] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [gName, setGName] = useState('');
  const [gTarget, setGTarget] = useState('');
  const [gCurrent, setGCurrent] = useState('');
  const [gDeadline, setGDeadline] = useState('');
  const [gCat, setGCat] = useState('Emergency Fund');
  const [rName, setRName] = useState('');
  const [rTrigger, setRTrigger] = useState('on_income');
  const [rAction, setRAction] = useState('save_pct');
  const [rPct, setRPct] = useState('20');
  const [rFixed, setRFixed] = useState('');
  const [rGoal, setRGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const [smartSave, setSmartSave] = useState(true);
  const [smartPct, setSmartPct] = useState(20);
  useEffect(() => {
    sb.auth.getSession().then(async ({data:{session}}) => {
      if (!session) { setLoading(false); return; }
      const uid = session.user.id;
      const [{data:g},{data:r},{data:l},{data:ap}] = await Promise.all([
        sb.from('savings_goals').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
        sb.from('autopilot_rules').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
        sb.from('autopilot_log').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(20),
        sb.from('autopilot_settings').select('*').eq('user_id',uid).single(),
      ]);
      setGoals(g??[]); setRules(r??[]); setLog(l??[]); setSettings(ap);
      if(ap){setSmartSave(ap.smart_save);setSmartPct(ap.smart_save_pct);}
      setLoading(false);
    });
  },[]);
  const addGoal = async () => {
    if(!gName.trim()||!gTarget)return; setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data}=await sb.from('savings_goals').insert({user_id:session.user.id,name:gName.trim(),category:gCat,target_amount:parseFloat(gTarget),current_amount:parseFloat(gCurrent)||0,deadline:gDeadline||null}).select().single();
    if(data)setGoals(p=>[data,...p]);
    setShowGoal(false);setGName('');setGTarget('');setGCurrent('');setGDeadline('');setSaving(false);
  };
  const addRule = async () => {
    if(!rName.trim())return; setSaving(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setSaving(false);return;}
    const{data}=await sb.from('autopilot_rules').insert({user_id:session.user.id,name:rName.trim(),trigger_type:rTrigger,action_type:rAction,amount_pct:rAction==='save_pct'?parseFloat(rPct):null,amount_fixed:rAction==='save_fixed'?parseFloat(rFixed):null,goal_id:rGoal||null}).select().single();
    if(data)setRules(p=>[data,...p]);
    setShowRule(false);setRName('');setSaving(false);
  };
  const toggleRule = async (id:string,active:boolean) => {
    setRules(p=>p.map(r=>r.id===id?{...r,is_active:active}:r));
    await sb.from('autopilot_rules').update({is_active:active}).eq('id',id);
  };
  const delGoal = async (id:string) => {
    setGoals(p=>p.filter(g=>g.id!==id));
    await sb.from('savings_goals').delete().eq('id',id);
  };
  const addToGoal = async (goal:any, amount:string) => {
    const num = parseFloat(amount);
    if(!num||num<=0)return;
    const newAmt = Number(goal.current_amount)+num;
    const completed = newAmt >= Number(goal.target_amount);
    await sb.from('savings_goals').update({current_amount:newAmt,completed,updated_at:new Date().toISOString()}).eq('id',goal.id);
    setGoals(p=>p.map(g=>g.id===goal.id?{...g,current_amount:newAmt,completed}:g));
  };
  const saveSettings = async () => {
    const{data:{session}}=await sb.auth.getSession();
    if(!session)return;
    await sb.from('autopilot_settings').upsert({user_id:session.user.id,smart_save:smartSave,smart_save_pct:smartPct,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  };
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'9px 12px',color:'#fff',fontSize:13,boxSizing:'border-box',outline:'none'};
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading AutoPilot...</div>;
  const activeGoals = goals.filter(g=>!g.completed);
  const completedGoals = goals.filter(g=>g.completed);
  const totalSaved = activeGoals.reduce((s,g)=>s+Number(g.current_amount),0);
  const totalTarget = activeGoals.reduce((s,g)=>s+Number(g.target_amount),0);
  return (
    <div style={{padding:'0 0 48px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#a78bfa',marginBottom:4}}>AutoPilot</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Automate your savings. Set rules. Hit goals on autopilot.</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowRule(true)} style={{padding:'8px 14px',borderRadius:8,background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.25)',color:'#a78bfa',cursor:'pointer',fontSize:12,fontWeight:600}}>+ Rule</button>
          <button onClick={()=>setShowGoal(true)} style={{padding:'8px 16px',borderRadius:8,background:'linear-gradient(135deg,#7c00ff,#1a6bff)',color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700}}>+ Goal</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
        {[{l:'Active Goals',v:String(activeGoals.length),c:'#a78bfa'},{l:'Total Saved',v:f(totalSaved),c:'#10b981'},{l:'Total Target',v:f(totalTarget),c:'#f59e0b'}].map(s=>(
          <div key={s.l} style={{background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.2)',borderRadius:12,padding:'14px 18px'}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:6,textTransform:'uppercase'}}>{s.l}</div>
            <div style={{fontSize:22,fontWeight:700,color:s.c,fontFamily:"'Roboto Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#a78bfa'}}>Smart Save Settings</span>
          <button onClick={saveSettings} style={{padding:'5px 12px',borderRadius:6,background:'rgba(167,139,250,.15)',border:'1px solid rgba(167,139,250,.25)',color:'#a78bfa',cursor:'pointer',fontSize:11}}>Save</button>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div><div style={{fontSize:13,color:'#e2e8f0'}}>Auto-save on income</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>Automatically save a % when income is logged</div></div>
          <div onClick={()=>setSmartSave(!smartSave)} style={{width:44,height:24,borderRadius:100,background:smartSave?'#7c00ff':'rgba(255,255,255,.15)',cursor:'pointer',position:'relative',transition:'background .2s'}}>
            <div style={{position:'absolute',top:2,left:smartSave?22:2,width:20,height:20,borderRadius:'50%',background:'white',transition:'left .2s'}}/>
          </div>
        </div>
        {smartSave&&(
          <div>
            <label style={{fontSize:12,color:'rgba(255,255,255,.4)',display:'block',marginBottom:6}}>Save {smartPct}% of each income entry</label>
            <input type="range" min={1} max={50} value={smartPct} onChange={e=>setSmartPct(+e.target.value)} style={{width:'100%',accentColor:'#a78bfa'}}/>
          </div>
        )}
      </div>
      <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#a78bfa',marginBottom:16}}>Savings Goals</div>
        {activeGoals.length===0&&<div style={{textAlign:'center',padding:'20px 0',color:'rgba(255,255,255,.3)',fontSize:13}}>No active goals. Create one to start saving with purpose.</div>}
        {activeGoals.map((g:any)=>{
          const [addAmt,setAddAmt]=useState('');
          const pct=Math.min(100,Math.round((Number(g.current_amount)/Number(g.target_amount))*100));
          const left=Number(g.target_amount)-Number(g.current_amount);
          return (
            <div key={g.id} style={{marginBottom:20,padding:16,background:'rgba(124,58,237,.04)',border:'1px solid rgba(124,58,237,.15)',borderRadius:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:'#e2e8f0',marginBottom:2}}>{g.name}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{g.category}{g.deadline?` - Due ${new Date(g.deadline).toLocaleDateString('en-US',{month:'short',year:'numeric'})}`:''}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:15,fontWeight:700,color:'#a78bfa',fontFamily:"'Roboto Mono',monospace"}}>{f(Number(g.current_amount))}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>of {f(Number(g.target_amount))}</div>
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,.08)',borderRadius:100,height:8,marginBottom:8}}>
                <div style={{background:pct>=100?'#10b981':'linear-gradient(90deg,#7c00ff,#a78bfa)',borderRadius:100,height:8,width:pct+'%',transition:'width .5s'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:11,color:pct>=80?'#10b981':'rgba(255,255,255,.3)'}}>{pct}% complete - {f(left)} to go</span>
                <div style={{display:'flex',gap:6}}>
                  <input placeholder="Add $" value={addAmt} onChange={e=>setAddAmt(e.target.value)} style={{width:70,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:6,padding:'4px 8px',color:'#fff',fontSize:11,outline:'none'}}/>
                  <button onClick={()=>{addToGoal(g,addAmt);setAddAmt('');}} style={{padding:'4px 10px',borderRadius:6,background:'rgba(167,139,250,.2)',border:'1px solid rgba(167,139,250,.3)',color:'#a78bfa',cursor:'pointer',fontSize:11}}>+</button>
                  <button onClick={()=>delGoal(g.id)} style={{padding:'4px 8px',borderRadius:6,background:'none',border:'none',color:'rgba(255,82,82,.4)',cursor:'pointer',fontSize:14}}>x</button>
                </div>
              </div>
            </div>
          );
        })}
        {completedGoals.length>0&&<div style={{marginTop:16}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:8}}>COMPLETED</div>
          {completedGoals.map((g:any)=>(
            <div key={g.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>{g.name}</span>
              <span style={{fontSize:12,color:'#10b981'}}>Complete - {f(Number(g.target_amount))}</span>
            </div>
          ))}
        </div>}
      </div>
      {rules.length>0&&(
        <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#a78bfa',marginBottom:14}}>Automation Rules</div>
          {rules.map((r:any)=>(
            <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <div>
                <div style={{fontSize:13,color:'#e2e8f0',marginBottom:2}}>{r.name}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>
                  {r.trigger_type==='on_income'?'On income logged':r.trigger_type==='monthly'?'Monthly':'Weekly'} - 
                  {r.action_type==='save_pct'?` Save ${r.amount_pct}%`:r.action_type==='save_fixed'?` Save ${f(r.amount_fixed)}`:'Allocate to goal'}
                </div>
              </div>
              <div onClick={()=>toggleRule(r.id,!r.is_active)} style={{width:40,height:22,borderRadius:100,background:r.is_active?'#7c00ff':'rgba(255,255,255,.15)',cursor:'pointer',position:'relative',flexShrink:0}}>
                <div style={{position:'absolute',top:2,left:r.is_active?20:2,width:18,height:18,borderRadius:'50%',background:'white',transition:'left .2s'}}/>
              </div>
            </div>
          ))}
        </div>
      )}
      {log.length>0&&(
        <div style={{background:'rgba(15,20,35,.7)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:20}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#a78bfa',marginBottom:14}}>Automation Log</div>
          {log.map((l:any)=>(
            <div key={l.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.04)',fontSize:12}}>
              <span style={{color:'rgba(255,255,255,.6)'}}>{l.action_taken}</span>
              <span style={{color:'rgba(255,255,255,.3)'}}>{new Date(l.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
      {showGoal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowGoal(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(167,139,250,.25)',borderRadius:16,padding:28,width:'100%',maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#a78bfa'}}>New Savings Goal</span>
              <button onClick={()=>setShowGoal(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:20}}>x</button>
            </div>
            <div style={{marginBottom:10}}><input value={gName} onChange={e=>setGName(e.target.value)} placeholder="Goal name" style={inp}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <input type="number" value={gTarget} onChange={e=>setGTarget(e.target.value)} placeholder="Target ($)" style={inp}/>
              <input type="number" value={gCurrent} onChange={e=>setGCurrent(e.target.value)} placeholder="Current ($)" style={inp}/>
            </div>
            <div style={{marginBottom:10}}><input type="date" value={gDeadline} onChange={e=>setGDeadline(e.target.value)} style={inp}/></div>
            <div style={{marginBottom:18}}>
              <select value={gCat} onChange={e=>setGCat(e.target.value)} style={{...inp}}>
                {['Emergency Fund','Housing','Tech','Travel','Investment','Education','Business','Vehicle','Custom'].map(c=><option key={c} style={{background:'#0d1117'}}>{c}</option>)}
              </select>
            </div>
            <button onClick={addGoal} disabled={!gName.trim()||!gTarget||saving} style={{width:'100%',padding:'11px',borderRadius:8,background:'linear-gradient(135deg,#7c00ff,#1a6bff)',color:'#fff',border:'none',cursor:'pointer',fontSize:14,fontWeight:700,opacity:saving?.7:1}}>{saving?'Saving...':'Create Goal'}</button>
          </div>
        </div>
      )}
      {showRule&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setShowRule(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#0d1117',border:'1px solid rgba(167,139,250,.25)',borderRadius:16,padding:28,width:'100%',maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:'#a78bfa'}}>New Automation Rule</span>
              <button onClick={()=>setShowRule(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:20}}>x</button>
            </div>
            <div style={{marginBottom:10}}><input value={rName} onChange={e=>setRName(e.target.value)} placeholder="Rule name (e.g. Save 20% of income)" style={inp}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Trigger</label>
                <select value={rTrigger} onChange={e=>setRTrigger(e.target.value)} style={{...inp}}>
                  <option value="on_income" style={{background:'#0d1117'}}>On income logged</option>
                  <option value="monthly" style={{background:'#0d1117'}}>Monthly</option>
                  <option value="weekly" style={{background:'#0d1117'}}>Weekly</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:'rgba(255,255,255,.4)',display:'block',marginBottom:4}}>Action</label>
                <select value={rAction} onChange={e=>setRAction(e.target.value)} style={{...inp}}>
                  <option value="save_pct" style={{background:'#0d1117'}}>Save %</option>
                  <option value="save_fixed" style={{background:'#0d1117'}}>Save fixed $</option>
                  <option value="allocate_goal" style={{background:'#0d1117'}}>Allocate to goal</option>
                </select>
              </div>
            </div>
            {rAction==='save_pct'&&<div style={{marginBottom:10}}><input type="number" value={rPct} onChange={e=>setRPct(e.target.value)} placeholder="% to save" style={inp}/></div>}
            {rAction==='save_fixed'&&<div style={{marginBottom:10}}><input type="number" value={rFixed} onChange={e=>setRFixed(e.target.value)} placeholder="Fixed amount ($)" style={inp}/></div>}
            {rAction==='allocate_goal'&&<div style={{marginBottom:10}}>
              <select value={rGoal} onChange={e=>setRGoal(e.target.value)} style={{...inp}}>
                <option value="" style={{background:'#0d1117'}}>Select goal...</option>
                {activeGoals.map((g:any)=><option key={g.id} value={g.id} style={{background:'#0d1117'}}>{g.name}</option>)}
              </select>
            </div>}
            <button onClick={addRule} disabled={!rName.trim()||saving} style={{width:'100%',padding:'11px',borderRadius:8,background:'rgba(167,139,250,.2)',border:'1px solid rgba(167,139,250,.3)',color:'#a78bfa',cursor:'pointer',fontSize:14,fontWeight:700,marginTop:8}}>Create Rule</button>
          </div>
        </div>
      )}
    </div>
  );
}