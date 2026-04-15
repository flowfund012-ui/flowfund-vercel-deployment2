'use client';
export const dynamic='force-dynamic';
import{useEffect,useRef,useState}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const PLAN_RANK:Record<string,number>={free:0,pro:1,premium:2};
const LEVEL_COL:Record<string,string>={Beginner:'#10b981',Intermediate:'#f59e0b',Advanced:'#ef4444'};
const CAT_COL:Record<string,string>={Budgeting:'#10b981',Debt:'#ef4444',Savings:'#60a5fa',Investing:'#a78bfa',Business:'#2dd4bf',Tax:'#f97316',Income:'#ffd700',FlowFund:'#00f2ff',Advanced:'#f97316'};
export default function AcademyPage(){
  const[courses,setCourses]=useState<any[]>([]);
  const[progress,setProgress]=useState<Record<string,any>>({});
  const[plan,setPlan]=useState('free');
  const[xp,setXp]=useState(0);
  const[loading,setLoading]=useState(true);
  const[view,setView]=useState<'grid'|'course'>('grid');
  const[activeCourse,setActiveCourse]=useState<any>(null);
  const[activeLesson,setActiveLesson]=useState(0);
  const[lessons,setLessons]=useState<any[]>([]);
  const[selectedAnswer,setSelectedAnswer]=useState<number|null>(null);
  const[showResult,setShowResult]=useState(false);
  const[tab,setTab]=useState<'courses'|'uploads'>('courses');
  const[uploads,setUploads]=useState<any[]>([]);
  const[uploading,setUploading]=useState(false);
  const[uploadTitle,setUploadTitle]=useState('');
  const[uploadDesc,setUploadDesc]=useState('');
  const[uploadFile,setUploadFile]=useState<File|null>(null);
  const[uploadMsg,setUploadMsg]=useState('');
  const[catFilter,setCatFilter]=useState('All');
  const fileRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:c},{data:p},{data:prof},{data:up}]=await Promise.all([
        sb.from('academy_courses').select('*').order('sort_order'),
        sb.from('academy_progress').select('*').eq('user_id',uid),
        sb.from('profiles').select('plan').eq('id',uid).single(),
        sb.from('academy_user_uploads').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
      ]);
      setCourses(c??[]);
      const pm:Record<string,any>={};(p??[]).forEach((x:any)=>{pm[x.course_id]=x;});
      setProgress(pm);
      const totalXp=(p??[]).filter((x:any)=>x.completed_at).reduce((s:number,x:any)=>{
        const course=(c??[]).find((cc:any)=>cc.id===x.course_id);
        return s+(course?.xp_reward||0);
      },0);
      setXp(totalXp);setPlan(prof?.plan||'free');setUploads(up??[]);setLoading(false);
    });
  },[]);
  const canAccess=(planReq:string)=>(PLAN_RANK[plan]??0)>=(PLAN_RANK[planReq]??0);
  const startCourse=async(course:any)=>{
    if(!canAccess(course.plan_required))return;
    const lessonData=course.lesson_content||[];
    setLessons(lessonData);setActiveCourse(course);setActiveLesson(0);setSelectedAnswer(null);setShowResult(false);setView('course');
    const{data:{session}}=await sb.auth.getSession();
    if(session&&!progress[course.id]){
      const{data}=await sb.from('academy_progress').insert({user_id:session.user.id,course_id:course.id,lessons_completed:0}).select().single();
      if(data)setProgress(p=>({...p,[course.id]:data}));
    }
  };
  const completeLesson=async()=>{
    const isLast=activeLesson>=lessons.length-1;
    const{data:{session}}=await sb.auth.getSession();
    if(session&&activeCourse){
      const newCount=(progress[activeCourse.id]?.lessons_completed||0)+1;
      const update:any={lessons_completed:newCount,updated_at:new Date().toISOString()};
      if(isLast)update.completed_at=new Date().toISOString();
      const{data}=await sb.from('academy_progress').upsert({user_id:session.user.id,course_id:activeCourse.id,...update},{onConflict:'user_id,course_id'}).select().single();
      if(data){setProgress(p=>({...p,[activeCourse.id]:data}));if(isLast)setXp(x=>x+(activeCourse.xp_reward||0));}
    }
    if(isLast){setView('grid');setActiveCourse(null);}
    else{setActiveLesson(l=>l+1);setSelectedAnswer(null);setShowResult(false);}
  };
  const handleUpload=async()=>{
    if(!uploadTitle.trim()||!uploadFile)return;
    setUploading(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setUploading(false);return;}
    const fileName=`${session.user.id}/${Date.now()}_${uploadFile.name}`;
    let fileUrl='';
    const{data:stored,error:upErr}=await sb.storage.from('academy-uploads').upload(fileName,uploadFile,{upsert:false});
    if(!upErr&&stored){const{data:url}=sb.storage.from('academy-uploads').getPublicUrl(fileName);fileUrl=url.publicUrl;}
    const{data:rec}=await sb.from('academy_user_uploads').insert({user_id:session.user.id,title:uploadTitle.trim(),description:uploadDesc.trim()||null,file_name:uploadFile.name,file_url:fileUrl||null,file_type:uploadFile.type.includes('pdf')?'pdf':uploadFile.type.includes('image')?'image':uploadFile.type.includes('video')?'video':'document',file_size_kb:Math.round(uploadFile.size/1024)}).select().single();
    if(rec)setUploads(p=>[rec,...p]);
    setUploadTitle('');setUploadDesc('');setUploadFile(null);
    setUploadMsg('Uploaded successfully!');setTimeout(()=>setUploadMsg(''),3000);
    if(fileRef.current)fileRef.current.value='';
    setUploading(false);
  };
  const deleteUpload=async(id:string)=>{setUploads(p=>p.filter(u=>u.id!==id));await sb.from('academy_user_uploads').delete().eq('id',id);};
  const cats=['All',...Array.from(new Set(courses.map((c:any)=>c.category)))];
  const filtered=courses.filter((c:any)=>catFilter==='All'||c.category===catFilter);
  const completedCount=Object.values(progress).filter((p:any)=>p.completed_at).length;
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Academy...</div>;

  // COURSE VIEW
  if(view==='course'&&activeCourse){
    const lesson=lessons[activeLesson]||{title:'Loading...',content:''};
    const total=lessons.length;
    const pct=total>0?Math.round((activeLesson/total)*100):0;
    return(
      <div style={{maxWidth:760,margin:'0 auto',paddingBottom:48}}>
        <button onClick={()=>{setView('grid');setActiveCourse(null);}} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'7px 14px',color:'rgba(255,255,255,.6)',cursor:'pointer',fontSize:12,fontFamily:"'Inter',sans-serif",marginBottom:20}}>← Back to courses</button>
        <div style={{background:'rgba(13,17,23,.95)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:28}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <div style={{fontSize:10,color:LEVEL_COL[activeCourse.level]||'#10b981',textTransform:'uppercase',letterSpacing:'.1em',fontWeight:700}}>{activeCourse.level} · {activeCourse.category}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>{activeLesson+1} / {total}</div>
          </div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:17,fontWeight:700,color:'#fff',marginBottom:8}}>{activeCourse.title}</h1>
          <div style={{background:'rgba(255,255,255,.06)',borderRadius:4,height:4,marginBottom:22}}>
            <div style={{background:'linear-gradient(90deg,#1a6bff,#7c00ff)',borderRadius:4,height:4,width:pct+'%',transition:'width .4s'}}/>
          </div>
          <h2 style={{fontSize:15,fontWeight:600,color:'#00f2ff',marginBottom:14,fontFamily:"'Orbitron',monospace"}}>{lesson.title}</h2>
          <div style={{fontSize:14,color:'rgba(255,255,255,.75)',lineHeight:1.9,whiteSpace:'pre-line',marginBottom:24}}>{lesson.content}</div>
          {lesson.quiz&&(
            <div style={{background:'rgba(26,107,255,.06)',border:'1px solid rgba(26,107,255,.2)',borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:'#60a5fa',marginBottom:14}}>Quick Check: {lesson.quiz.question}</div>
              {lesson.quiz.options.map((opt:string,i:number)=>{
                const isCorrect=i===lesson.quiz.correct;
                const isSelected=selectedAnswer===i;
                let bg='rgba(255,255,255,.04)';let bdr='rgba(255,255,255,.08)';let col='rgba(255,255,255,.65)';
                if(showResult&&isSelected&&isCorrect){bg='rgba(16,185,129,.1)';bdr='rgba(16,185,129,.3)';col='#10b981';}
                else if(showResult&&isSelected&&!isCorrect){bg='rgba(239,68,68,.1)';bdr='rgba(239,68,68,.3)';col='#ef4444';}
                else if(showResult&&isCorrect){bg='rgba(16,185,129,.05)';bdr='rgba(16,185,129,.2)';col='#10b981';}
                return(
                  <div key={i} onClick={()=>{if(!showResult){setSelectedAnswer(i);setShowResult(true);}}} style={{padding:'10px 14px',borderRadius:8,border:`1px solid ${bdr}`,background:bg,color:col,cursor:showResult?'default':'pointer',marginBottom:6,fontSize:13,transition:'all .15s'}}>
                    {showResult&&isCorrect?'✓ ':showResult&&isSelected&&!isCorrect?'✗ ':''}{opt}
                  </div>
                );
              })}
              {showResult&&<div style={{fontSize:12,color:selectedAnswer===lesson.quiz.correct?'#10b981':'rgba(239,68,68,.8)',marginTop:8,fontStyle:'italic'}}>{selectedAnswer===lesson.quiz.correct?'Correct!':'Incorrect — correct answer is highlighted above.'}</div>}
            </div>
          )}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <button onClick={()=>{if(activeLesson>0){setActiveLesson(l=>l-1);setSelectedAnswer(null);setShowResult(false);}}} disabled={activeLesson===0} style={{padding:'10px 20px',borderRadius:9,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',color:'rgba(255,255,255,.5)',cursor:activeLesson===0?'not-allowed':'pointer',fontSize:13,fontFamily:"'Inter',sans-serif",opacity:activeLesson===0?.4:1}}>← Previous</button>
            <button onClick={completeLesson} disabled={!!(lesson.quiz&&!showResult)} style={{padding:'10px 28px',borderRadius:9,background:(!lesson.quiz||showResult)?'linear-gradient(135deg,#1a6bff,#7c00ff)':'rgba(255,255,255,.06)',color:(!lesson.quiz||showResult)?'#fff':'rgba(255,255,255,.35)',border:'none',cursor:(!lesson.quiz||showResult)?'pointer':'not-allowed',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
              {activeLesson===total-1?'Complete Course ✓':'Next Lesson →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#f59e0b',marginBottom:4}}>Personal Academy</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Real financial education. Learn, apply, and upload your own resources.</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setTab('courses')} style={{padding:'8px 16px',borderRadius:8,fontSize:12,background:tab==='courses'?'rgba(245,158,11,.1)':'transparent',border:`1px solid ${tab==='courses'?'rgba(245,158,11,.3)':'rgba(255,255,255,.07)'}`,color:tab==='courses'?'#f59e0b':'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>Courses</button>
          <button onClick={()=>setTab('uploads')} style={{padding:'8px 16px',borderRadius:8,fontSize:12,background:tab==='uploads'?'rgba(245,158,11,.1)':'transparent',border:`1px solid ${tab==='uploads'?'rgba(245,158,11,.3)':'rgba(255,255,255,.07)'}`,color:tab==='uploads'?'#f59e0b':'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>My Library ({uploads.length})</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:22}}>
        {[{l:'Courses',v:String(courses.length),c:'#f59e0b',bg:'rgba(245,158,11,.06)',b:'rgba(245,158,11,.18)'},{l:'Completed',v:String(completedCount),c:'#10b981',bg:'rgba(16,185,129,.06)',b:'rgba(16,185,129,.18)'},{l:'In Progress',v:String(Object.values(progress).filter((p:any)=>!p.completed_at).length),c:'#60a5fa',bg:'rgba(96,165,250,.06)',b:'rgba(96,165,250,.18)'},{l:'Total XP',v:xp.toLocaleString(),c:'#ffd700',bg:'rgba(255,215,0,.06)',b:'rgba(255,215,0,.18)'}].map(s=>(
          <div key={s.l} style={{background:s.bg,border:`1px solid ${s.b}`,borderRadius:12,padding:'12px 16px',textAlign:'center'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.07em'}}>{s.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:"'Roboto Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
      </div>

      {tab==='courses'&&(
        <>
        <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCatFilter(c)} style={{padding:'5px 13px',borderRadius:100,fontSize:11,background:catFilter===c?`${CAT_COL[c]||'rgba(245,158,11,.15)'}20`:'rgba(255,255,255,.04)',border:`1px solid ${catFilter===c?(CAT_COL[c]||'rgba(245,158,11,.3)'):'rgba(255,255,255,.07)'}`,color:catFilter===c?(CAT_COL[c]||'#f59e0b'):'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{c}</button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map((course:any)=>{
            const prog=progress[course.id];
            const completed=!!prog?.completed_at;
            const started=!!prog&&!completed;
            const locked=!canAccess(course.plan_required);
            const col=CAT_COL[course.category]||'#f59e0b';
            const lessonCount=(course.lesson_content||[]).length;
            return(
              <div key={course.id} style={{background:'rgba(13,17,23,.9)',border:`1px solid ${completed?'rgba(16,185,129,.3)':started?`${col}30`:locked?'rgba(255,215,0,.12)':'rgba(255,255,255,.07)'}`,borderRadius:16,padding:22,display:'flex',flexDirection:'column',transition:'border-color .18s'}} onMouseEnter={e=>{if(!locked)(e.currentTarget as HTMLElement).style.borderColor=col+'44';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=completed?'rgba(16,185,129,.3)':started?`${col}30`:locked?'rgba(255,215,0,.12)':'rgba(255,255,255,.07)';}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{fontSize:32}}>{course.thumbnail_emoji||'📚'}</div>
                  <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
                    <span style={{padding:'2px 8px',borderRadius:100,fontSize:9,fontWeight:700,background:`${col}18`,color:col,border:`1px solid ${col}30`}}>{course.level}</span>
                    {course.plan_required!=='free'&&<span style={{padding:'2px 8px',borderRadius:100,fontSize:9,background:course.plan_required==='premium'?'rgba(255,215,0,.1)':'rgba(0,242,255,.08)',color:course.plan_required==='premium'?'#ffd700':'#00f2ff',border:`1px solid ${course.plan_required==='premium'?'rgba(255,215,0,.2)':'rgba(0,242,255,.15)'}`,fontFamily:"'Orbitron',monospace"}}>{course.plan_required.toUpperCase()}</span>}
                    {completed&&<span style={{padding:'2px 8px',borderRadius:100,fontSize:9,background:'rgba(16,185,129,.1)',color:'#10b981',border:'1px solid rgba(16,185,129,.2)'}}>✓ Done</span>}
                  </div>
                </div>
                <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:6,lineHeight:1.3}}>{course.title}</h3>
                <p style={{fontSize:12,color:'rgba(255,255,255,.45)',lineHeight:1.65,flex:1,marginBottom:14}}>{course.description}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,fontSize:11,color:'rgba(255,255,255,.3)'}}>
                  <span>{course.duration_mins} min · {lessonCount} lessons</span>
                  <span style={{color:'#ffd700',fontWeight:700}}>+{course.xp_reward} XP</span>
                </div>
                {started&&!completed&&(
                  <div style={{marginBottom:10}}>
                    <div style={{background:'rgba(255,255,255,.06)',borderRadius:4,height:3}}>
                      <div style={{background:col,borderRadius:4,height:3,width:Math.round(((prog.lessons_completed||0)/Math.max(lessonCount,1))*100)+'%'}}/>
                    </div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.3)',marginTop:3}}>{prog.lessons_completed||0}/{lessonCount} lessons</div>
                  </div>
                )}
                {locked?(
                  <a href="/dashboard/settings" style={{display:'block',padding:'9px',textAlign:'center',borderRadius:9,background:'rgba(255,215,0,.07)',border:'1px solid rgba(255,215,0,.18)',color:'#ffd700',textDecoration:'none',fontSize:12,fontFamily:"'Orbitron',monospace"}}>🔒 Upgrade to {course.plan_required}</a>
                ):(
                  <button onClick={()=>startCourse(course)} style={{padding:'10px',borderRadius:9,background:completed?'rgba(16,185,129,.1)':started?`${col}18`:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:completed?'#10b981':started?col:'#fff',border:completed?'1px solid rgba(16,185,129,.25)':started?`1px solid ${col}30`:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>
                    {completed?'↻ Review Course':started?'Continue →':'Start Course →'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        </>
      )}

      {tab==='uploads'&&(
        <>
        <div style={{background:'rgba(13,17,23,.95)',border:'1px solid rgba(245,158,11,.2)',borderRadius:16,padding:24,marginBottom:20}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'#f59e0b',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:6}}>Upload to My Library</div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:18,lineHeight:1.6}}>Upload your own notes, PDFs, spreadsheets, or any study material. Private — only you can see them. Use this as your personal financial knowledge base.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Title</label><input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)} placeholder="My Budget Notes" style={inp}/></div>
            <div><label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Description (optional)</label><input value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} placeholder="What is this about?" style={inp}/></div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{padding:'9px 18px',borderRadius:8,background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',color:'#f59e0b',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",display:'inline-block'}}>
              {uploadFile?`📎 ${uploadFile.name}`:'Choose File'}
              <input ref={fileRef} type="file" style={{display:'none'}} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.jpg,.png,.mp4" onChange={e=>setUploadFile(e.target.files?.[0]||null)}/>
            </label>
            {uploadFile&&<span style={{fontSize:11,color:'rgba(255,255,255,.35)',marginLeft:12}}>{(uploadFile.size/1024).toFixed(0)} KB</span>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <button onClick={handleUpload} disabled={uploading||!uploadTitle.trim()||!uploadFile} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:(!uploadTitle.trim()||!uploadFile||uploading)?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:(!uploadTitle.trim()||!uploadFile||uploading)?.5:1}}>{uploading?'Uploading...':'Upload to My Library'}</button>
            {uploadMsg&&<span style={{fontSize:12,color:'#10b981'}}>✓ {uploadMsg}</span>}
          </div>
        </div>
        <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:22}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:11,color:'rgba(255,255,255,.4)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:16}}>My Library ({uploads.length})</div>
          {uploads.length===0?(
            <div style={{textAlign:'center',padding:'28px 0'}}>
              <div style={{fontSize:32,marginBottom:10}}>📚</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:4}}>Your library is empty.</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.18)'}}>Upload notes, PDFs, spreadsheets — anything that helps you learn.</div>
            </div>
          ):uploads.map((u:any)=>(
            <div key={u.id} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
              <div style={{width:40,height:40,borderRadius:10,background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>
                {u.file_type==='pdf'?'📄':u.file_type==='image'?'🖼️':u.file_type==='video'?'🎬':'📝'}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',marginBottom:2}}>{u.title}</div>
                {u.description&&<div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:2}}>{u.description}</div>}
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{u.file_name}{u.file_size_kb?` · ${u.file_size_kb} KB`:''} · {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                {u.file_url&&<a href={u.file_url} target="_blank" rel="noopener noreferrer" style={{padding:'6px 12px',borderRadius:7,background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.2)',color:'#f59e0b',textDecoration:'none',fontSize:11,fontWeight:600}}>Open</a>}
                <button onClick={()=>deleteUpload(u.id)} style={{padding:'6px 12px',borderRadius:7,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',color:'rgba(239,68,68,.8)',cursor:'pointer',fontSize:11,fontFamily:"'Inter',sans-serif"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
