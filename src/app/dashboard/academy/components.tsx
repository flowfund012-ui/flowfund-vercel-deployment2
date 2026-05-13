'use client';
import{useState,useEffect,useRef}from'react';
import{createClient}from'@supabase/supabase-js';
export const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const BUCKET='academy-uploads';
export const STORAGE_URL='https://ammymxsyerlkdezsxuip.supabase.co/storage/v1/object/public/'+BUCKET+'/';
export const CC:Record<string,string>={'Budgeting':'#1a6bff','Investing':'#10b981','Debt':'#ef4444','Freelance':'#f59e0b','Tax':'#8b5cf6','Crypto':'#06b6d4','Business':'#f97316','Savings':'#3b82f6','Default':'#6c2ef5'};
export const CI:Record<string,string>={'Budgeting':'💰','Investing':'📈','Debt':'🏦','Freelance':'💼','Tax':'🧾','Crypto':'⛓','Business':'🏢','Savings':'🐷','Default':'📚'};
export const gc=(c:string)=>CC[c]||CC.Default;
export const gi=(c:string)=>CI[c]||CI.Default;

export async function uploadFile(file:File,folder:string,uid:string):Promise<string|null>{
  const ext=file.name.split('.').pop();
  const path=`${uid}/${folder}/${Date.now()}.${ext}`;
  const{error}=await sb.storage.from(BUCKET).upload(path,file,{upsert:true,cacheControl:'3600'});
  if(error){console.error('Upload failed:',error.message);return null;}
  const{data}=sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function WaveLogo({size=32}:{size?:number}){return(<svg width={size} height={size} viewBox="0 0 64 64"><defs><linearGradient id="wga" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#wga)"/><path d="M10 38 Q18 22 26 32 Q34 42 42 26 Q50 10 54 26" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}

export function UploadBtn({label,accept,onFile,uploading}:{label:string,accept:string,onFile:(f:File)=>void,uploading?:boolean}){
  const ref=useRef<HTMLInputElement>(null);
  return(<><input ref={ref} type="file" accept={accept} style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f);}}/><button type="button" onClick={()=>ref.current?.click()} style={{padding:'8px 14px',borderRadius:8,border:'1px dashed rgba(26,107,255,0.4)',background:'rgba(26,107,255,0.06)',color:'#1a6bff',cursor:uploading?'not-allowed':'pointer',fontSize:13,fontWeight:600,opacity:uploading?0.7:1}}>{uploading?'Uploading...':label}</button></>);}

export const B:Record<string,any>={
  wrap:{minHeight:'100vh',background:'#000814',color:'#e2e8f0',fontFamily:"'Inter',sans-serif"},
  hdr:{background:'#0a1628',padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12},
  title:{fontSize:22,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0},
  tabs:{display:'flex',gap:6,padding:'12px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',overflowX:'auto'},
  tab:(a:boolean)=>({padding:'8px 18px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,background:a?'linear-gradient(135deg,#1a6bff,#6c2ef5)':'rgba(255,255,255,0.04)',color:a?'#fff':'#64748b',whiteSpace:'nowrap',flexShrink:0}),
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,padding:'16px 24px 80px'},
  card:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden',cursor:'pointer'},
  badge:(c:string)=>({display:'inline-block',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600,background:`${c}22`,color:c}),
  btn:(v:string)=>({padding:'10px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:700,fontSize:13,background:v==='primary'?'linear-gradient(135deg,#1a6bff,#6c2ef5)':v==='danger'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.06)',color:v==='danger'?'#ef4444':'#fff'}),
  inp:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 14px',color:'#e2e8f0',fontSize:14,outline:'none',width:'100%',boxSizing:'border-box'},
  ta:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 14px',color:'#e2e8f0',fontSize:14,outline:'none',width:'100%',boxSizing:'border-box',resize:'vertical',minHeight:100},
  label:{fontSize:12,color:'#64748b',fontWeight:600,marginBottom:6,display:'block'},
  toast:{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#1a6bff',color:'#fff',padding:'12px 24px',borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999,pointerEvents:'none'},
  back:{background:'none',border:'none',color:'#1a6bff',cursor:'pointer',fontSize:14,fontWeight:600,display:'flex',alignItems:'center',gap:6,padding:'0 0 16px'},
};

export function ArticleDetail({article,user,onBack}:{article:any,user:any,onBack:()=>void}){
  const[liked,setLiked]=useState(false);
  const[likes,setLikes]=useState(article.likes||0);
  useEffect(()=>{
    sb.from('academy_articles').update({views:(article.views||0)+1}).eq('id',article.id);
    if(user)sb.from('academy_article_likes').select('*').eq('user_id',user.id).eq('article_id',article.id).then(({data})=>setLiked((data||[]).length>0));
  },[]);
  async function toggleLike(){
    if(!user)return;
    if(liked){await sb.from('academy_article_likes').delete().eq('user_id',user.id).eq('article_id',article.id);await sb.from('academy_articles').update({likes:likes-1}).eq('id',article.id);setLikes((l:number)=>l-1);setLiked(false);}
    else{await sb.from('academy_article_likes').insert({user_id:user.id,article_id:article.id});await sb.from('academy_articles').update({likes:likes+1}).eq('id',article.id);setLikes((l:number)=>l+1);setLiked(true);}
  }
  const cover=article.cover_url||(article.cover_path?STORAGE_URL+article.cover_path:null);
  return(
    <div style={{...B.wrap,paddingBottom:80}}>
      <div style={{maxWidth:760,margin:'0 auto',padding:'24px'}}>
        <button style={B.back} onClick={onBack}>← Back to Articles</button>
        {cover&&<img src={cover} alt="" style={{width:'100%',height:240,objectFit:'cover',borderRadius:12,marginBottom:20}}/>}
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          <span style={B.badge(gc(article.category))}>{article.category}</span>
          {(article.tags||[]).map((t:string)=><span key={t} style={{...B.badge('#475569'),marginLeft:2}}>{t}</span>)}
        </div>
        <h1 style={{fontSize:28,fontWeight:800,lineHeight:1.3,marginBottom:16,color:'#f1f5f9'}}>{article.title}</h1>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,paddingBottom:20,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16,flexShrink:0}}>{(article.author_name||'?')[0].toUpperCase()}</div>
          <div>
            <div style={{fontWeight:700,color:'#e2e8f0'}}>{article.author_name}</div>
            <div style={{fontSize:12,color:'#64748b'}}>{new Date(article.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}{article.read_time?` · ${article.read_time} min read`:''}</div>
          </div>
          <div style={{marginLeft:'auto',display:'flex',gap:16,alignItems:'center'}}>
            <span style={{fontSize:13,color:'#64748b'}}>👁 {article.views||0}</span>
            <button onClick={toggleLike} style={{background:'none',border:'none',cursor:user?'pointer':'default',fontSize:20,display:'flex',alignItems:'center',gap:4}}>
              <span style={{color:liked?'#ef4444':'#64748b'}}>{liked?'❤️':'🤍'}</span>
              <span style={{fontSize:13,color:'#64748b'}}>{likes}</span>
            </button>
          </div>
        </div>
        <div style={{fontSize:16,lineHeight:1.9,color:'#cbd5e1',whiteSpace:'pre-wrap'}}>{article.content}</div>
      </div>
    </div>
  );
}

export function BookReader({book,onBack}:{book:any,onBack:()=>void}){
  const url=book.file_url||(book.file_path?STORAGE_URL+book.file_path:null);
  return(
    <div style={{...B.wrap,display:'flex',flexDirection:'column',height:'100vh'}}>
      <div style={B.hdr}>
        <button style={{...B.back,padding:0}} onClick={onBack}>← Back to Books</button>
        <h2 style={{...B.title,fontSize:16,margin:0}}>{book.title}</h2>
        {url&&<a href={url} download style={{...B.btn('ghost'),marginLeft:'auto',textDecoration:'none',fontSize:12,padding:'6px 14px'}}>Download</a>}
      </div>
      {url?(
        <iframe src={url+'#toolbar=1'} style={{flex:1,border:'none',background:'#fff'}} title={book.title}/>
      ):(
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',color:'#475569'}}>
          <div style={{fontSize:48,marginBottom:12}}>📖</div>
          <div>No file available for this book yet</div>
        </div>
      )}
    </div>
  );
}

export function LessonViewer({course,lessons,activeLesson,setActiveLesson,user,onBack,onComplete}:{course:any,lessons:any[],activeLesson:any,setActiveLesson:any,user:any,onBack:()=>void,onComplete:(l:any)=>void}){
  const[qa,setQa]=useState<Record<number,number>>({});
  const[qResult,setQResult]=useState('');
  const progress=course.progress||0;
  const ltype=(l:any)=>l.lesson_type||l.type||'text';
  function submitQuiz(l:any){
    const qs=l.questions||[];let correct=0;
    qs.forEach((q:any,i:number)=>{if(qa[i]===q.correct_index)correct++;});
    const pct=Math.round((correct/qs.length)*100);
    setQResult(`${correct}/${qs.length} correct (${pct}%)${pct>=70?' — Passed! ✓':' — Try again'}`);
    if(pct>=70)onComplete(l);
  }
  const videoSrc=(l:any)=>{
    if(l.video_path)return STORAGE_URL+l.video_path;
    if(l.video_url){
      const u=l.video_url;
      if(u.includes('youtube.com')||u.includes('youtu.be'))return u.replace('watch?v=','embed/').replace('youtu.be/','www.youtube.com/embed/');
      return u;
    }
    return null;
  };
  return(
    <div style={{...B.wrap,display:'flex',flexDirection:'column',height:'100vh'}}>
      <div style={{background:'#0a1628',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
        <button style={{...B.back,padding:0}} onClick={onBack}>← Exit</button>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:'#e2e8f0'}}>{course.title}</div><div style={{fontSize:11,color:'#64748b'}}>{progress}% complete</div></div>
        <div style={{width:100,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2}}><div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2,transition:'width 0.5s'}}/></div>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:240,background:'rgba(255,255,255,0.02)',borderRight:'1px solid rgba(255,255,255,0.06)',overflowY:'auto',flexShrink:0}}>
          <div style={{padding:'10px 14px',fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em'}}>Lessons</div>
          {lessons.map((l:any,i:number)=>{
            const done=progress>=(((i+1)/lessons.length)*100);
            const active=activeLesson?.id===l.id;
            const t=ltype(l);
            return(<div key={l.id} onClick={()=>{setActiveLesson(l);setQa({});setQResult('');}} style={{padding:'10px 14px',cursor:'pointer',borderLeft:`3px solid ${active?'#1a6bff':'transparent'}`,background:active?'rgba(26,107,255,0.08)':'transparent',display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:20,height:20,borderRadius:'50%',background:done?'#10b981':active?'#1a6bff':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#fff',flexShrink:0,fontWeight:700}}>{done?'✓':i+1}</span>
              <div style={{flex:1}}><div style={{fontSize:12,color:active?'#1a6bff':'#94a3b8',lineHeight:1.3}}>{l.title}</div><div style={{fontSize:10,color:'#475569',marginTop:1}}>{t==='video'?'▶ Video':t==='quiz'?'📝 Quiz':'📄 Reading'}</div></div>
            </div>);
          })}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:24}}>
          {activeLesson?(
            <>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:16,color:'#f1f5f9'}}>{activeLesson.title}</h2>
              {ltype(activeLesson)==='video'&&(()=>{const src=videoSrc(activeLesson);return(
                <div style={{width:'100%',aspectRatio:'16/9',background:'rgba(255,255,255,0.03)',borderRadius:12,overflow:'hidden',marginBottom:20,border:'1px solid rgba(255,255,255,0.08)'}}>
                  {src?(
                    src.includes('youtube.com/embed')?
                      <iframe width="100%" height="100%" src={src} style={{border:'none'}} allowFullScreen/>:
                      <video src={src} controls style={{width:'100%',height:'100%',background:'#000'}} controlsList="nodownload"/>
                  ):(
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'#475569'}}><div style={{fontSize:48}}>▶</div><div style={{fontSize:13,marginTop:8}}>Video coming soon</div></div>
                  )}
                </div>
              );})()}
              {ltype(activeLesson)==='quiz'&&(
                <div style={{background:'rgba(139,92,246,0.05)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:12,padding:20,marginBottom:16}}>
                  <div style={{fontWeight:800,fontSize:15,color:'#8b5cf6',marginBottom:14}}>Quiz</div>
                  {(activeLesson.questions||[]).map((q:any,qi:number)=>(
                    <div key={qi} style={{marginBottom:18}}>
                      <div style={{fontWeight:600,marginBottom:8,color:'#e2e8f0'}}>{qi+1}. {q.question}</div>
                      {(q.options||[]).map((opt:string,oi:number)=>(
                        <div key={oi} onClick={()=>setQa(p=>({...p,[qi]:oi}))} style={{padding:'9px 14px',borderRadius:8,marginBottom:5,cursor:'pointer',background:qa[qi]===oi?'rgba(26,107,255,0.2)':'rgba(255,255,255,0.03)',border:`1px solid ${qa[qi]===oi?'#1a6bff':'rgba(255,255,255,0.07)'}`,fontSize:14,color:qa[qi]===oi?'#e2e8f0':'#94a3b8'}}>{opt}</div>
                      ))}
                    </div>
                  ))}
                  {qResult&&<div style={{padding:'10px 14px',borderRadius:8,background:qResult.includes('Passed')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:qResult.includes('Passed')?'#10b981':'#ef4444',fontWeight:700,marginBottom:10}}>{qResult}</div>}
                  <button style={B.btn('primary')} onClick={()=>submitQuiz(activeLesson)}>Submit Quiz</button>
                </div>
              )}
              <div style={{fontSize:15,lineHeight:1.9,color:'#cbd5e1',whiteSpace:'pre-wrap',marginBottom:20}}>{activeLesson.content}</div>
              {ltype(activeLesson)!=='quiz'&&<button style={{...B.btn('primary'),width:'100%',padding:'13px'}} onClick={()=>onComplete(activeLesson)}>{lessons.indexOf(activeLesson)===lessons.length-1?'Complete Course 🎉':'Next Lesson →'}</button>}
            </>
          ):(
            <div style={{textAlign:'center',padding:60,color:'#475569'}}><div style={{fontSize:44,marginBottom:12}}>📖</div><div>Select a lesson to begin</div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreatorStudio({user,profile,onBack,showToast}:{user:any,profile:any,onBack:()=>void,showToast:(m:string)=>void}){
  const[tab,setTab]=useState<'courses'|'new-course'|'profile'>('courses');
  const[myCourses,setMyCourses]=useState<any[]>([]);
  const[ep,setEp]=useState({display_name:profile?.display_name||'',bio:profile?.bio||'',website:profile?.website||'',expertise:(profile?.expertise||[]).join(', ')});
  const[nc,setNc]=useState({title:'',description:'',category:'Budgeting',level:'Beginner',price:'0',is_free:true,language:'English',what_you_learn:'',requirements:'',video_intro_url:''});
  const[ls,setLs]=useState<any[]>([{title:'',lesson_type:'video',content:'',video_url:'',order_index:0,is_free_preview:true}]);
  const[saving,setSaving]=useState(false);
  const[uploadingVideo,setUploadingVideo]=useState<Record<number,boolean>>({});
  useEffect(()=>{if(user)load();},[user]);
  async function load(){const{data}=await sb.from('academy_courses').select('*').eq('instructor_id',user.id).order('created_at',{ascending:false});setMyCourses(data||[]);}
  async function saveProfile(){setSaving(true);await sb.from('academy_creator_profiles').upsert({user_id:user.id,...ep,expertise:ep.expertise.split(',').map((s:string)=>s.trim()).filter(Boolean)},{onConflict:'user_id'});showToast('Profile saved!');setSaving(false);}
  async function handleVideoUpload(file:File,i:number){
    setUploadingVideo(p=>({...p,[i]:true}));
    const url=await uploadFile(file,'videos',user.id);
    setUploadingVideo(p=>({...p,[i]:false}));
    if(url){
      setLs(p=>p.map((x:any,j:number)=>j===i?{...x,video_url:url}:x));
      showToast('Video uploaded!');
    }else{
      showToast('Upload failed — check file type (MP4/WebM/MOV only)');
    }
  }
  async function publish(){
    if(!nc.title){showToast('Add a title');return;}setSaving(true);
    const{data:c,error}=await sb.from('academy_courses').insert({...nc,price:parseFloat(nc.price)||0,what_you_learn:nc.what_you_learn.split('\n').filter(Boolean),requirements:nc.requirements.split('\n').filter(Boolean),instructor_id:user.id,instructor_name:profile?.display_name||user.email?.split('@')[0]||'Instructor',is_published:true,certificate_enabled:true}).select().single();
    if(error){showToast('Error: '+error.message);setSaving(false);return;}
    if(c){const rows=ls.filter((l:any)=>l.title).map((l:any,i:number)=>({...l,course_id:c.id,order_index:i}));if(rows.length)await sb.from('academy_lessons').insert(rows);}
    showToast('Course published!');setSaving(false);setTab('courses');load();
    setNc({title:'',description:'',category:'Budgeting',level:'Beginner',price:'0',is_free:true,language:'English',what_you_learn:'',requirements:'',video_intro_url:''});
    setLs([{title:'',lesson_type:'video',content:'',video_url:'',order_index:0,is_free_preview:true}]);
  }
  const cats=['Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];
  return(
    <div style={{...B.wrap,paddingBottom:80}}>
      <div style={B.hdr}><button style={{...B.back,padding:0}} onClick={onBack}>← Back</button><h2 style={{...B.title,fontSize:18,margin:0}}>Creator Studio</h2></div>
      <div style={B.tabs}>
        {(['courses','new-course','profile']as const).map(t=><button key={t} style={B.tab(tab===t)} onClick={()=>setTab(t)}>{t==='courses'?'My Courses':t==='new-course'?'+ New Course':'Profile'}</button>)}
      </div>
      <div style={{padding:'20px 24px'}}>
        {tab==='profile'&&(
          <div style={{maxWidth:520}}>
            <h3 style={{color:'#e2e8f0',marginBottom:16}}>Creator Profile</h3>
            {[['Display Name','display_name','text'],['Bio','bio','ta'],['Website','website','text'],['Expertise (comma separated)','expertise','text']].map(([lbl,k,t])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={B.label}>{lbl}</label>
                {t==='ta'?<textarea style={B.ta} rows={3} value={(ep as any)[k]} onChange={e=>setEp(p=>({...p,[k]:e.target.value}))}/>:<input style={B.inp} value={(ep as any)[k]} onChange={e=>setEp(p=>({...p,[k]:e.target.value}))}/>}
              </div>
            ))}
            <button style={B.btn('primary')} onClick={saveProfile} disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
          </div>
        )}
        {tab==='courses'&&(
          myCourses.length===0?(
            <div style={{textAlign:'center',padding:40,color:'#475569'}}>
              <div style={{fontSize:40,marginBottom:12}}>🎬</div><div>No courses yet.</div>
              <button style={{...B.btn('primary'),marginTop:14}} onClick={()=>setTab('new-course')}>Create First Course</button>
            </div>
          ):myCourses.map((c:any)=>(
            <div key={c.id} style={{...B.card,display:'flex',alignItems:'center',gap:14,padding:14,marginBottom:10,cursor:'default'}}>
              <div style={{width:44,height:44,borderRadius:10,background:`${gc(c.category)}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{gi(c.category)}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,color:'#e2e8f0'}}>{c.title}</div><div style={{fontSize:12,color:'#64748b',marginTop:3}}>{c.category} · {c.level} · {c.is_free?'Free':`$${c.price}`}</div></div>
              <span style={{...B.badge(c.is_published?'#10b981':'#f59e0b'),fontSize:11}}>{c.is_published?'Live':'Draft'}</span>
              <button style={{...B.btn('ghost'),padding:'5px 12px',fontSize:11}} onClick={async()=>{await sb.from('academy_courses').update({is_published:!c.is_published}).eq('id',c.id);showToast(c.is_published?'Unpublished':'Published!');load();}}>{c.is_published?'Unpublish':'Publish'}</button>
            </div>
          ))
        )}
        {tab==='new-course'&&(
          <div style={{maxWidth:700}}>
            <h3 style={{color:'#e2e8f0',marginBottom:16}}>Create New Course</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              {[['Course Title','title','text'],['Category','category','sel-cat'],['Level','level','sel-lvl'],['Price USD (0=free)','price','number']].map(([lbl,k,t])=>(
                <div key={k}><label style={B.label}>{lbl}</label>
                  {t==='sel-cat'?<select style={B.inp} value={(nc as any)[k]} onChange={e=>setNc(p=>({...p,[k]:e.target.value}))}>{cats.map(c=><option key={c}>{c}</option>)}</select>
                  :t==='sel-lvl'?<select style={B.inp} value={(nc as any)[k]} onChange={e=>setNc(p=>({...p,[k]:e.target.value}))}>{['Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}</select>
                  :<input style={B.inp} type={t==='number'?'number':'text'} value={(nc as any)[k]} onChange={e=>setNc(p=>({...p,[k]:e.target.value,is_free:k==='price'?parseFloat(e.target.value)===0:p.is_free}))}/>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:12}}><label style={B.label}>Description</label><textarea style={B.ta} rows={3} value={nc.description} onChange={e=>setNc(p=>({...p,description:e.target.value}))}/></div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:14,marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <label style={{...B.label,margin:0}}>Lessons</label>
                <button style={{...B.btn('ghost'),padding:'5px 12px',fontSize:12}} onClick={()=>setLs(p=>[...p,{title:'',lesson_type:'video',content:'',video_url:'',order_index:p.length,is_free_preview:false}])}>+ Add Lesson</button>
              </div>
              {ls.map((l:any,i:number)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:12,marginBottom:8}}>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <span style={{width:22,height:22,borderRadius:'50%',background:'rgba(26,107,255,0.2)',color:'#1a6bff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                    <input style={{...B.inp,flex:1}} placeholder="Lesson title" value={l.title} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,title:e.target.value}:x))}/>
                    <select style={{...B.inp,width:'auto'}} value={l.lesson_type} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,lesson_type:e.target.value}:x))}><option value="video">Video</option><option value="text">Reading</option><option value="quiz">Quiz</option></select>
                    <button onClick={()=>setLs(p=>p.filter((_:any,j:number)=>j!==i))} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:15,flexShrink:0}}>✕</button>
                  </div>
                  {l.lesson_type==='video'&&(
                    <div style={{marginBottom:8}}>
                      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6,flexWrap:'wrap'}}>
                        <UploadBtn label="📤 Upload Video" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" onFile={f=>handleVideoUpload(f,i)} uploading={uploadingVideo[i]}/>
                        <span style={{color:'#475569',fontSize:12}}>or paste URL below</span>
                      </div>
                      <input style={B.inp} placeholder="https://youtube.com/watch?v=... or direct video link" value={l.video_url||''} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,video_url:e.target.value}:x))}/>
                      {l.video_url&&<div style={{fontSize:11,color:'#10b981',marginTop:4}}>✓ {l.video_url.includes('supabase')?'Video uploaded to storage':'External video URL set'}</div>}
                    </div>
                  )}
                  <textarea style={{...B.ta,minHeight:56,marginBottom:6}} placeholder="Lesson notes or content" value={l.content||''} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,content:e.target.value}:x))}/>
                  <label style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:'#64748b',cursor:'pointer'}}><input type="checkbox" checked={l.is_free_preview||false} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,is_free_preview:e.target.checked}:x))}/> Free preview</label>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div><label style={B.label}>What students will learn (one per line)</label><textarea style={B.ta} rows={4} value={nc.what_you_learn} onChange={e=>setNc(p=>({...p,what_you_learn:e.target.value}))}/></div>
              <div><label style={B.label}>Requirements (one per line)</label><textarea style={B.ta} rows={4} value={nc.requirements} onChange={e=>setNc(p=>({...p,requirements:e.target.value}))}/></div>
            </div>
            <div style={{display:'flex',gap:10}}><button style={{...B.btn('primary'),padding:'11px 28px'}} onClick={publish} disabled={saving}>{saving?'Publishing...':'Publish Course'}</button><button style={B.btn('ghost')} onClick={()=>setTab('courses')}>Cancel</button></div>
          </div>
        )}
      </div>
    </div>
  );
}