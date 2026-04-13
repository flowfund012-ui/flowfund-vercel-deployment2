'use client';
export const dynamic='force-dynamic';
import{useEffect,useState,useRef}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const LEVEL_COLORS:Record<string,string>={Fundamentals:'#60a5fa',Budgeting:'#10b981',Debt:'#ef4444',Business:'#f59e0b',Investing:'#a78bfa',Advanced:'#f97316',Tax:'#2dd4bf',Protection:'#00ff9d'};
export default function AcademyPage(){
  const[courses,setCourses]=useState<any[]>([]);
  const[lessons,setLessons]=useState<any[]>([]);
  const[progress,setProgress]=useState<any>(null);
  const[uploads,setUploads]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[selectedCourse,setSelectedCourse]=useState<any>(null);
  const[selectedLesson,setSelectedLesson]=useState<any>(null);
  const[activeTab,setActiveTab]=useState<'courses'|'my-uploads'>('courses');
  const[completing,setCompleting]=useState(false);
  const[uploadModal,setUploadModal]=useState(false);
  const[uploadTitle,setUploadTitle]=useState('');
  const[uploadDesc,setUploadDesc]=useState('');
  const[uploadFile,setUploadFile]=useState<File|null>(null);
  const[uploadPublic,setUploadPublic]=useState(false);
  const[uploading,setUploading]=useState(false);
  const[uploadResult,setUploadResult]=useState('');
  const[filterCat,setFilterCat]=useState('All');
  useEffect(()=>{
    sb.auth.getSession().then(async({data:{session}})=>{
      if(!session){setLoading(false);return;}
      const uid=session.user.id;
      const[{data:c},{data:l},{data:p},{data:u}]=await Promise.all([
        sb.from('academy_courses').select('*').order('order_index'),
        sb.from('academy_lessons').select('*').order('order_index'),
        sb.from('academy_progress').select('*').eq('user_id',uid).single(),
        sb.from('academy_user_uploads').select('*').eq('user_id',uid).order('created_at',{ascending:false}),
      ]);
      setCourses(c??[]);setLessons(l??[]);setProgress(p);setUploads(u??[]);setLoading(false);
    });
  },[]);
  const completed:string[]=progress?.completed_courses??[];
  const xp=progress?.xp??0;
  const streak=progress?.streak??0;
  const totalXp=courses.reduce((s:number,c:any)=>s+(c.xp_reward||0),0);
  const level=xp<200?1:xp<500?2:xp<1000?3:xp<2000?4:5;
  const levelNames=['','Beginner','Student','Practitioner','Expert','Master'];
  const courseLessons=(cid:string)=>lessons.filter((l:any)=>l.course_id===cid).sort((a:any,b:any)=>a.order_index-b.order_index);
  const completeLesson=async(course:any,lesson:any)=>{
    setCompleting(true);
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setCompleting(false);return;}
    const uid=session.user.id;
    const newCompleted=completed.includes(course.id)?completed:[...completed,course.id];
    const newXp=(progress?.xp??0)+(lesson.xp_reward||0);
    await sb.from('academy_progress').upsert({user_id:uid,completed_courses:newCompleted,xp:newXp,streak:streak+1,updated_at:new Date().toISOString()},{onConflict:'user_id'});
    setProgress((p:any)=>({...p,completed_courses:newCompleted,xp:newXp,streak:streak+1}));
    setCompleting(false);
    setSelectedLesson(null);
  };
  const handleUpload=async()=>{
    if(!uploadTitle.trim()||!uploadFile){return;}
    setUploading(true);setUploadResult('');
    const{data:{session}}=await sb.auth.getSession();
    if(!session){setUploading(false);return;}
    const uid=session.user.id;
    const ext=uploadFile.name.split('.').pop()||'file';
    const path=`${uid}/${Date.now()}.${ext}`;
    const{data:up,error:upErr}=await sb.storage.from('academy-uploads').upload(path,uploadFile,{upsert:false});
    if(upErr){setUploadResult('Upload failed: '+upErr.message);setUploading(false);return;}
    const{data:{publicUrl}}=sb.storage.from('academy-uploads').getPublicUrl(path);
    const{data:rec}=await sb.from('academy_user_uploads').insert({user_id:uid,title:uploadTitle.trim(),description:uploadDesc.trim(),file_name:uploadFile.name,file_size:uploadFile.size,file_type:ext,storage_path:path,public_url:publicUrl,is_public:uploadPublic}).select().single();
    if(rec)setUploads(p=>[rec,...p]);
    setUploadResult('Uploaded successfully!');setUploadTitle('');setUploadDesc('');setUploadFile(null);
    setTimeout(()=>{setUploadModal(false);setUploadResult('');},1500);
    setUploading(false);
  };
  const deleteUpload=async(upload:any)=>{
    await sb.storage.from('academy-uploads').remove([upload.storage_path]);
    await sb.from('academy_user_uploads').delete().eq('id',upload.id);
    setUploads(p=>p.filter((u:any)=>u.id!==upload.id));
  };
  const fmSize=(bytes:number)=>bytes>1000000?(bytes/1000000).toFixed(1)+'MB':bytes>1000?(bytes/1000).toFixed(0)+'KB':'<1KB';
  const categories=['All',...Array.from(new Set(courses.map((c:any)=>c.category)))];
  const filtered=filterCat==='All'?courses:courses.filter((c:any)=>c.category===filterCat);
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.09)',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  if(loading)return<div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,.4)'}}>Loading Academy...</div>;

  // LESSON READER
  if(selectedLesson&&selectedCourse){
    const cLessons=courseLessons(selectedCourse.id);
    const idx=cLessons.findIndex((l:any)=>l.id===selectedLesson.id);
    const next=cLessons[idx+1]||null;
    return(
      <div style={{maxWidth:780,margin:'0 auto',paddingBottom:48}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
          <button onClick={()=>setSelectedLesson(null)} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'rgba(255,255,255,.6)',cursor:'pointer',padding:'8px 14px',fontSize:12,fontFamily:"'Inter',sans-serif"}}>← Back to Course</button>
          <span style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Lesson {idx+1} of {cLessons.length}</span>
        </div>
        <div style={{background:'rgba(13,17,23,.95)',border:'1px solid rgba(255,255,255,.08)',borderRadius:18,padding:36}}>
          <div style={{fontSize:11,color:LEVEL_COLORS[selectedCourse.category]||'#60a5fa',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8,fontFamily:"'Orbitron',monospace"}}>{selectedCourse.category} · {selectedCourse.title.replace(/^[^\s]+\s/,'')}</div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:6,lineHeight:1.3}}>{selectedLesson.title}</h1>
          <div style={{display:'flex',gap:16,marginBottom:28,fontSize:12,color:'rgba(255,255,255,.35)'}}>
            <span>+{selectedLesson.xp_reward} XP</span>
            <span>·</span>
            <span>Lesson {idx+1}</span>
          </div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.78)',lineHeight:2,whiteSpace:'pre-wrap',letterSpacing:'.01em'}}>{selectedLesson.content}</div>
          <div style={{marginTop:36,paddingTop:28,borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div>
              {completed.includes(selectedCourse.id)&&<div style={{fontSize:12,color:'#10b981'}}>✓ Course completed</div>}
            </div>
            <div style={{display:'flex',gap:10}}>
              {next&&<button onClick={()=>setSelectedLesson(next)} style={{padding:'10px 20px',borderRadius:9,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',cursor:'pointer',fontSize:13,fontFamily:"'Inter',sans-serif"}}>Next: {next.title.slice(0,30)}... →</button>}
              {!completed.includes(selectedCourse.id)&&(
                <button onClick={()=>completeLesson(selectedCourse,selectedLesson)} disabled={completing} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:completing?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:completing?0.7:1}}>
                  {completing?'Saving...':'Mark Complete (+'+selectedLesson.xp_reward+' XP)'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COURSE DETAIL
  if(selectedCourse){
    const cLessons=courseLessons(selectedCourse.id);
    const isCompleted=completed.includes(selectedCourse.id);
    return(
      <div style={{maxWidth:780,margin:'0 auto',paddingBottom:48}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <button onClick={()=>setSelectedCourse(null)} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'rgba(255,255,255,.6)',cursor:'pointer',padding:'8px 14px',fontSize:12,fontFamily:"'Inter',sans-serif"}}>← All Courses</button>
        </div>
        <div style={{background:'rgba(13,17,23,.95)',border:'1px solid rgba(255,255,255,.08)',borderRadius:18,padding:32,marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontSize:11,color:LEVEL_COLORS[selectedCourse.category]||'#60a5fa',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8,fontFamily:"'Orbitron',monospace"}}>{selectedCourse.category}</div>
              <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#fff',marginBottom:12,lineHeight:1.3}}>{selectedCourse.title}</h1>
              <p style={{fontSize:13,color:'rgba(255,255,255,.52)',lineHeight:1.7,marginBottom:16}}>{selectedCourse.description}</p>
              <div style={{display:'flex',gap:16,fontSize:12,color:'rgba(255,255,255,.35)'}}>
                <span>⏱ {selectedCourse.duration_mins} min</span>
                <span>✦ {selectedCourse.xp_reward} XP</span>
                <span>📖 {cLessons.length} lessons</span>
              </div>
            </div>
            {isCompleted&&<div style={{padding:'6px 16px',borderRadius:100,background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',fontSize:11,color:'#10b981',fontWeight:700,whiteSpace:'nowrap'}}>✓ Completed</div>}
          </div>
        </div>
        <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'16px 22px',borderBottom:'1px solid rgba(255,255,255,.06)',fontSize:11,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.1em',fontFamily:"'Orbitron',monospace"}}>Course Lessons</div>
          {cLessons.length===0&&<div style={{padding:24,textAlign:'center',fontSize:13,color:'rgba(255,255,255,.3)'}}>Lessons coming soon.</div>}
          {cLessons.map((lesson:any,i:number)=>(
            <div key={lesson.id} onClick={()=>setSelectedLesson(lesson)} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 22px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,.04)',transition:'background .15s'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.035)'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'rgba(255,255,255,.5)',flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,color:'rgba(255,255,255,.85)',marginBottom:3}}>{lesson.title}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>+{lesson.xp_reward} XP</div>
              </div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>Read →</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN PAGE
  return(
    <div style={{paddingBottom:48}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:700,color:'#f59e0b',marginBottom:4}}>Personal Academy</h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>Learn, grow, upload your own resources.</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>setUploadModal(true)} style={{padding:'9px 18px',borderRadius:9,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.3)',color:'#f59e0b',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>+ Upload Resource</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:22}}>
        {[
          {l:'Your XP',v:xp.toLocaleString(),c:'#f59e0b',bg:'rgba(245,158,11,.07)',b:'rgba(245,158,11,.2)'},
          {l:'Level',v:levelNames[level],c:'#a78bfa',bg:'rgba(167,139,250,.07)',b:'rgba(167,139,250,.2)'},
          {l:'Completed',v:completed.length+'/'+courses.length,c:'#10b981',bg:'rgba(16,185,129,.07)',b:'rgba(16,185,129,.2)'},
          {l:'Day Streak',v:streak+' 🔥',c:'#f97316',bg:'rgba(249,115,22,.07)',b:'rgba(249,115,22,.2)'},
        ].map(s=>(
          <div key={s.l} style={{background:s.bg,border:`1px solid ${s.b}`,borderRadius:12,padding:'13px 16px',textAlign:'center'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.07em'}}>{s.l}</div>
            <div style={{fontSize:18,fontWeight:700,color:s.c,fontFamily:"'Roboto Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'14px 20px',marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
          <span style={{color:'rgba(255,255,255,.5)'}}>Level {level}: {levelNames[level]}</span>
          <span style={{color:'#f59e0b',fontFamily:"'Roboto Mono',monospace"}}>{xp} / {[0,200,500,1000,2000,999999][level+1]} XP</span>
        </div>
        <div style={{background:'rgba(255,255,255,.07)',borderRadius:100,height:6}}>
          <div style={{background:'linear-gradient(90deg,#f59e0b,#f97316)',borderRadius:100,height:6,width:Math.min(100,(xp/[200,500,1000,2000,999999][level])*100)+'%',transition:'width .5s'}}/>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {(['courses','my-uploads'] as const).map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:'8px 18px',borderRadius:8,fontSize:12,fontWeight:activeTab===t?600:400,background:activeTab===t?'rgba(245,158,11,.1)':'transparent',border:'1px solid '+(activeTab===t?'rgba(245,158,11,.3)':'rgba(255,255,255,.07)'),color:activeTab===t?'#f59e0b':'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",textTransform:'capitalize'}}>
            {t==='courses'?'All Courses':'My Uploads ('+uploads.length+')'}
          </button>
        ))}
        {activeTab==='courses'&&(
          <div style={{marginLeft:'auto',display:'flex',gap:6,flexWrap:'wrap'}}>
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setFilterCat(cat)} style={{padding:'5px 12px',borderRadius:100,fontSize:11,background:filterCat===cat?'rgba(245,158,11,.12)':'rgba(255,255,255,.04)',border:`1px solid ${filterCat===cat?'rgba(245,158,11,.3)':'rgba(255,255,255,.07)'}`,color:filterCat===cat?'#f59e0b':'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{cat}</button>
            ))}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {activeTab==='courses'&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map((course:any)=>{
            const cLessons=courseLessons(course.id);
            const isCompleted=completed.includes(course.id);
            const isPro=course.plan_required==='pro';
            const col=LEVEL_COLORS[course.category]||'#60a5fa';
            return(
              <div key={course.id} onClick={()=>setSelectedCourse(course)} style={{background:'rgba(13,17,23,.9)',border:`1px solid ${isCompleted?'rgba(16,185,129,.3)':'rgba(255,255,255,.07)'}`,borderRadius:16,padding:22,cursor:'pointer',transition:'all .18s',position:'relative'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.borderColor=col+'55';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.borderColor=isCompleted?'rgba(16,185,129,.3)':'rgba(255,255,255,.07)';}}>
                {isCompleted&&<div style={{position:'absolute',top:14,right:14,width:22,height:22,borderRadius:'50%',background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#10b981'}}>✓</div>}
                {isPro&&!isCompleted&&<div style={{position:'absolute',top:14,right:14,padding:'2px 8px',borderRadius:100,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)',fontSize:9,color:'#f59e0b',fontFamily:"'Orbitron',monospace"}}>PRO</div>}
                <div style={{fontSize:28,marginBottom:10}}>{course.title.match(/^(\S+)/)?.[1]||'📚'}</div>
                <div style={{fontSize:11,color:col,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6,fontFamily:"'Orbitron',monospace"}}>{course.category}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:8,lineHeight:1.3}}>{course.title.replace(/^[^\s]+\s/,'')}</h3>
                <p style={{fontSize:12,color:'rgba(255,255,255,.42)',lineHeight:1.6,marginBottom:14}}>{course.description.slice(0,100)}...</p>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,.3)'}}>
                  <span>⏱ {course.duration_mins}m</span>
                  <span>✦ {course.xp_reward} XP</span>
                  <span>📖 {cLessons.length} lessons</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Uploads */}
      {activeTab==='my-uploads'&&(
        <div>
          {uploads.length===0?(
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:40,marginBottom:12}}>📁</div>
              <div style={{fontSize:15,fontWeight:600,color:'rgba(255,255,255,.5)',marginBottom:8}}>No uploads yet</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:20}}>Upload your own PDFs, spreadsheets, guides, or study materials. Keep them private or share with the community.</div>
              <button onClick={()=>setUploadModal(true)} style={{padding:'10px 24px',borderRadius:9,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>Upload Your First Resource</button>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {uploads.map((u:any)=>(
                <div key={u.id} style={{background:'rgba(13,17,23,.9)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:42,height:42,borderRadius:10,background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                    {u.file_type==='pdf'?'📄':u.file_type==='xlsx'||u.file_type==='csv'?'📊':'📁'}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:'#e2e8f0',marginBottom:3}}>{u.title}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{u.file_name} · {fmSize(u.file_size)} · {u.is_public?'Public':'Private'}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    {u.public_url&&<a href={u.public_url} target="_blank" rel="noreferrer" style={{padding:'7px 14px',borderRadius:7,background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',color:'#60a5fa',fontSize:12,textDecoration:'none',fontFamily:"'Inter',sans-serif"}}>Download</a>}
                    <button onClick={()=>deleteUpload(u)} style={{padding:'7px 12px',borderRadius:7,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.15)',color:'#ef4444',cursor:'pointer',fontSize:12,fontFamily:"'Inter',sans-serif"}}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal&&(
        <div style={{position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={e=>{if(e.target===e.currentTarget){setUploadModal(false);setUploadResult('');}}}>
          <div style={{background:'rgba(10,12,22,.98)',border:'1px solid rgba(255,255,255,.1)',borderRadius:20,padding:32,width:'100%',maxWidth:500}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:'#f59e0b'}}>Upload Resource</div>
              <button onClick={()=>{setUploadModal(false);setUploadResult('');}} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:20,padding:4}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Title *</label>
              <input value={uploadTitle} onChange={e=>setUploadTitle(e.target.value)} placeholder="e.g. My Monthly Budget Template" style={inp}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>Description</label>
              <input value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} placeholder="Optional: what is this resource?" style={inp}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:5,textTransform:'uppercase',letterSpacing:'.06em'}}>File (PDF, XLSX, CSV, ZIP — max 50MB) *</label>
              <label style={{display:'block',padding:'12px 16px',borderRadius:9,background:'rgba(255,255,255,.04)',border:'2px dashed rgba(255,255,255,.12)',cursor:'pointer',textAlign:'center',fontSize:13,color:uploadFile?'#10b981':'rgba(255,255,255,.4)',transition:'all .15s'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(245,158,11,.35)'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.12)'}>
                {uploadFile?'✓ '+uploadFile.name:'Click to select file...'}
                <input type="file" accept=".pdf,.xlsx,.xls,.csv,.zip,.png,.jpg" style={{display:'none'}} onChange={e=>setUploadFile(e.target.files?.[0]||null)}/>
              </label>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <div onClick={()=>setUploadPublic(!uploadPublic)} style={{width:36,height:20,borderRadius:10,background:uploadPublic?'rgba(245,158,11,.8)':'rgba(255,255,255,.12)',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}}>
                <div style={{position:'absolute',top:2,left:uploadPublic?17:2,width:16,height:16,borderRadius:'50%',background:'white',transition:'left .2s'}}/>
              </div>
              <span style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>Make public (visible to other FlowFund users)</span>
            </div>
            {uploadResult&&<div style={{marginBottom:14,padding:'9px 14px',borderRadius:8,background:uploadResult.includes('success')?'rgba(16,185,129,.08)':'rgba(239,68,68,.08)',border:`1px solid ${uploadResult.includes('success')?'rgba(16,185,129,.2)':'rgba(239,68,68,.2)'}`,fontSize:12,color:uploadResult.includes('success')?'#10b981':'#ef4444'}}>{uploadResult}</div>}
            <button onClick={handleUpload} disabled={uploading||!uploadTitle.trim()||!uploadFile} style={{width:'100%',padding:'11px',borderRadius:10,background:'linear-gradient(135deg,#f59e0b,#f97316)',color:'#000',border:'none',cursor:(uploading||!uploadTitle.trim()||!uploadFile)?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",opacity:(uploading||!uploadTitle.trim()||!uploadFile)?0.5:1}}>
              {uploading?'Uploading...':'Upload Resource'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
