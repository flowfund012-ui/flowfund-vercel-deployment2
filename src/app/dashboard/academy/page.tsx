'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [loadingLessons, setLoadingLessons] = useState(false);
  useEffect(() => {
    sb.auth.getSession().then(async ({data:{session}}) => {
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const [{data:c},{data:p},{data:pr}] = await Promise.all([
        sb.from('academy_courses').select('*').order('order_index'),
        sb.from('academy_progress').select('*').eq('user_id',uid).single(),
        sb.from('profiles').select('plan').eq('id',uid).single(),
      ]);
      setCourses(c??[]); setProgress(p); setProfile(pr);
      setLoading(false);
    });
  },[]);
  const openCourse = async (course: any) => {
    setActiveCourse(course); setLoadingLessons(true); setLessonIdx(0);
    const {data} = await sb.from('academy_lessons').select('*').eq('course_id',course.id).order('order_index');
    setLessons(data??[]); setLoadingLessons(false);
  };
  const completeCourse = async () => {
    const{data:{session}}=await sb.auth.getSession();
    if(!session||!activeCourse)return;
    const uid=session.user.id;
    const completed=(progress?.completed_courses||[]);
    if(completed.includes(activeCourse.id))return;
    const newCompleted=[...completed,activeCourse.id];
    const newXp=(progress?.xp||0)+activeCourse.xp_reward;
    await sb.from('academy_progress').upsert({user_id:uid,completed_courses:newCompleted,xp:newXp,updated_at:new Date().toISOString()},{onConflict:'user_id'});
    setProgress((p:any)=>({...p,completed_courses:newCompleted,xp:newXp}));
    setActiveCourse(null);
  };
  const plan=profile?.plan||'free';
  const planRank:Record<string,number>={free:0,pro:1,premium:2};
  const completed=progress?.completed_courses||[];
  const xp=progress?.xp||0;
  if(loading)return <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Academy...</div>;
  if(activeCourse){
    const lesson=lessons[lessonIdx];
    const isDone=completed.includes(activeCourse.id);
    const isLast=lessonIdx>=lessons.length-1;
    return (
      <div style={{padding:'0 0 48px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
          <button onClick={()=>setActiveCourse(null)} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'7px 14px',color:'rgba(255,255,255,.6)',cursor:'pointer',fontSize:12}}>Back</button>
          <div>
            <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:'#f59e0b',marginBottom:2}}>{activeCourse.title}</h1>
            <p style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{activeCourse.category} - {activeCourse.xp_reward} XP - {lessons.length} lessons</p>
          </div>
        </div>
        <div style={{background:'rgba(255,255,255,.08)',borderRadius:100,height:4,marginBottom:24}}>
          <div style={{background:'linear-gradient(90deg,#f59e0b,#ffd700)',borderRadius:100,height:4,width:((lessonIdx+1)/Math.max(lessons.length,1)*100)+'%',transition:'width .4s'}}/>
        </div>
        {loadingLessons?<div style={{textAlign:'center',padding:40,color:'rgba(255,255,255,.4)'}}>Loading...</div>:lesson?(
          <div style={{background:'rgba(15,20,35,.8)',border:'1px solid rgba(245,158,11,.2)',borderRadius:16,padding:28,marginBottom:20}}>
            <div style={{fontSize:11,color:'rgba(245,158,11,.6)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>Lesson {lessonIdx+1} of {lessons.length}</div>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:700,color:'#f59e0b',marginBottom:20}}>{lesson.title}</h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,.8)',lineHeight:1.8}}>{lesson.content}</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:28}}>
              <button onClick={()=>setLessonIdx(i=>Math.max(0,i-1))} disabled={lessonIdx===0} style={{padding:'9px 18px',borderRadius:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:lessonIdx===0?'rgba(255,255,255,.2)':'rgba(255,255,255,.7)',cursor:lessonIdx===0?'not-allowed':'pointer',fontSize:13}}>Previous</button>
              {isLast?(
                <button onClick={completeCourse} style={{padding:'9px 24px',borderRadius:8,background:'linear-gradient(135deg,#f59e0b,#ffd700)',color:'#000',border:'none',cursor:'pointer',fontSize:13,fontWeight:700}}>{isDone?'Completed':'Complete Course - +'+activeCourse.xp_reward+' XP'}</button>
              ):(
                <button onClick={()=>setLessonIdx(i=>i+1)} style={{padding:'9px 18px',borderRadius:8,background:'linear-gradient(135deg,#f59e0b,#ffd700)',color:'#000',border:'none',cursor:'pointer',fontSize:13,fontWeight:700}}>Next Lesson</button>
              )}
            </div>
          </div>
        ):null}
      </div>
    );
  }
  return (
    <div style={{padding:'0 0 48px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:700,color:'#f59e0b',marginBottom:4}}>Personal Academy</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Financial education built for your goals.</p>
        </div>
        <div style={{background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',borderRadius:12,padding:'10px 16px',textAlign:'center'}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:700,color:'#f59e0b'}}>{xp}</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>XP Earned</div>
        </div>
      </div>
      {completed.length>0&&(
        <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:13,color:'#10b981'}}>
          {completed.length} course{completed.length!==1?'s':''} completed - Keep going!
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16}}>
        {courses.map((c:any)=>{
          const locked=planRank[c.plan_required]>planRank[plan];
          const done=completed.includes(c.id);
          return (
            <div key={c.id} style={{background:'rgba(15,20,35,.7)',border:'1px solid '+(done?'rgba(16,185,129,.25)':locked?'rgba(255,255,255,.05)':'rgba(245,158,11,.15)'),borderRadius:14,padding:22,opacity:locked?.6:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div style={{padding:'3px 10px',fontSize:10,borderRadius:100,background:'rgba(245,158,11,.1)',color:'#f59e0b'}}>{c.category}</div>
                {done&&<span style={{fontSize:11,color:'#10b981',fontWeight:600}}>DONE</span>}
                {locked&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:100,background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.35)'}}>{c.plan_required}</span>}
              </div>
              <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:700,marginBottom:8,color:done?'#10b981':'#e2e8f0'}}>{c.title}</h3>
              <p style={{fontSize:13,color:'rgba(255,255,255,.5)',lineHeight:1.6,marginBottom:16}}>{c.description}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>~{c.duration_mins}min - {c.xp_reward} XP</div>
                <button onClick={()=>!locked&&openCourse(c)} style={{padding:'7px 16px',borderRadius:8,background:locked?'rgba(255,255,255,.06)':done?'rgba(16,185,129,.15)':'linear-gradient(135deg,#f59e0b,#daa520)',color:locked?'rgba(255,255,255,.3)':done?'#10b981':'#000',border:locked?'1px solid rgba(255,255,255,.1)':done?'1px solid rgba(16,185,129,.3)':'none',cursor:locked?'not-allowed':'pointer',fontSize:12,fontWeight:700}}>
                  {locked?'Upgrade':done?'Review':'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}