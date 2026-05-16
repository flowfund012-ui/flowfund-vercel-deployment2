'use client';
import{useState,useEffect,useRef,useCallback}from'react';
import{createClient,SupabaseClient}from'@supabase/supabase-js';
export const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
export const STORAGE_URL='https://ammymxsyerlkdezsxuip.supabase.co/storage/v1/object/public/academy-uploads/';
export const SUPABASE_URL='https://ammymxsyerlkdezsxuip.supabase.co';
export const ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E';
export const CC:Record<string,string>={'Budgeting':'#1a6bff','Investing':'#10b981','Debt':'#ef4444','Freelance':'#f59e0b','Tax':'#8b5cf6','Crypto':'#06b6d4','Business':'#f97316','Savings':'#3b82f6','Default':'#6c2ef5'};
export const CI:Record<string,string>={'Budgeting':'💰','Investing':'📈','Debt':'🏦','Freelance':'💼','Tax':'🧾','Crypto':'⛓','Business':'🏢','Savings':'🐷','Default':'📚'};
export const gc=(c:string)=>CC[c]||CC.Default;
export const gi=(c:string)=>CI[c]||CI.Default;
export function WaveLogo({size=32}:{size?:number}){return(<svg width={size} height={size} viewBox="0 0 64 64"><defs><linearGradient id="wga" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#wga)"/><path d="M10 38 Q18 22 26 32 Q34 42 42 26 Q50 10 54 26" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
export const B:Record<string,any>={wrap:{minHeight:'100vh',background:'#000814',color:'#e2e8f0',fontFamily:"'Inter',sans-serif"},hdr:{background:'#0a1628',padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12},title:{fontSize:22,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0},tabs:{display:'flex',gap:6,padding:'12px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',overflowX:'auto'},tab:(a:boolean)=>({padding:'8px 18px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,background:a?'linear-gradient(135deg,#1a6bff,#6c2ef5)':'rgba(255,255,255,0.04)',color:a?'#fff':'#64748b',whiteSpace:'nowrap',flexShrink:0}),grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,padding:'16px 24px 80px'},card:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,overflow:'hidden',cursor:'pointer'},badge:(c:string)=>({display:'inline-block',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600,background:`${c}22`,color:c}),btn:(v:string)=>({padding:'10px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:700,fontSize:13,background:v==='primary'?'linear-gradient(135deg,#1a6bff,#6c2ef5)':v==='danger'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.06)',color:v==='danger'?'#ef4444':'#fff'}),inp:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 14px',color:'#e2e8f0',fontSize:14,outline:'none',width:'100%',boxSizing:'border-box'},ta:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 14px',color:'#e2e8f0',fontSize:14,outline:'none',width:'100%',boxSizing:'border-box',resize:'vertical',minHeight:100},label:{fontSize:12,color:'#64748b',fontWeight:600,marginBottom:6,display:'block'},toast:{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#1a6bff',color:'#fff',padding:'12px 24px',borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999,pointerEvents:'none',maxWidth:'90vw',textAlign:'center'},back:{background:'none',border:'none',color:'#1a6bff',cursor:'pointer',fontSize:14,fontWeight:600,display:'flex',alignItems:'center',gap:6,padding:'0 0 16px'},};

// Standard upload for images/small files using Supabase SDK
export async function doUpload(file:File,folder:string,uid:string,onProgress?:(p:number)=>void):Promise<string|null>{
  const ext=file.name.split('.').pop()?.toLowerCase()||'bin';
  const ts=Date.now();const rand=Math.random().toString(36).slice(2,8);
  const path=uid+'/'+folder+'/'+ts+'_'+rand+'.'+ext;
  try{
    if(onProgress)onProgress(5);
    const{data,error}=await sb.storage.from('academy-uploads').upload(path,file,{cacheControl:'3600',upsert:true,contentType:file.type||'application/octet-stream'});
    if(error){console.error('Upload err:',error);return null;}
    if(onProgress)onProgress(100);
    const{data:u}=sb.storage.from('academy-uploads').getPublicUrl(path);
    return u.publicUrl;
  }catch(e:any){console.error('Upload ex:',e?.message);return null;}
}

// Resumable upload for large videos using XHR with progress - works up to 500MB
export async function doUploadLarge(file:File,folder:string,uid:string,onProgress?:(p:number,speed?:string)=>void,onDone?:(url:string|null)=>void):Promise<void>{
  const ext=file.name.split('.').pop()?.toLowerCase()||'bin';
  const ts=Date.now();const rand=Math.random().toString(36).slice(2,8);
  const path=uid+'/'+folder+'/'+ts+'_'+rand+'.'+ext;
  const url=`${SUPABASE_URL}/storage/v1/object/academy-uploads/${path}`;
  const xhr=new XMLHttpRequest();
  let startTime=Date.now();let lastLoaded=0;
  xhr.open('POST',url);
  xhr.setRequestHeader('Authorization','Bearer '+ANON_KEY);
  xhr.setRequestHeader('x-upsert','true');
  xhr.setRequestHeader('Content-Type',file.type||'application/octet-stream');
  if(onProgress){
    xhr.upload.onprogress=e=>{
      if(!e.lengthComputable)return;
      const pct=Math.round((e.loaded/e.total)*100);
      const elapsed=(Date.now()-startTime)/1000;
      const bytesPerSec=(e.loaded-lastLoaded)/Math.max(elapsed,0.1);
      lastLoaded=e.loaded;startTime=Date.now();
      const mbps=(bytesPerSec/1024/1024).toFixed(1);
      const remaining=Math.round((e.total-e.loaded)/Math.max(bytesPerSec,1));
      const remStr=remaining>60?`${Math.round(remaining/60)}m left`:`${remaining}s left`;
      onProgress(pct,`${mbps} MB/s · ${remStr}`);
    };
  }
  xhr.onload=()=>{
    if(xhr.status>=200&&xhr.status<300){
      const{data:u}=sb.storage.from('academy-uploads').getPublicUrl(path);
      onDone&&onDone(u.publicUrl);
    }else{
      console.error('Large upload failed:',xhr.status,xhr.responseText.slice(0,200));
      onDone&&onDone(null);
    }
  };
  xhr.onerror=()=>{console.error('Large upload XHR error');onDone&&onDone(null);};
  xhr.send(file);
}

export function UploadField({label,accept,value,onUrl,uid,folder,type='file',large=false}:{label:string,accept:string,value:string,onUrl:(u:string)=>void,uid:string,folder:string,type?:string,large?:boolean}){
  const ref=useRef<HTMLInputElement>(null);
  const[prog,setProg]=useState(0);const[speed,setSpeed]=useState('');const[uploading,setUploading]=useState(false);const[err,setErr]=useState('');const[done,setDone]=useState(false);
  async function handle(f:File){
    setUploading(true);setProg(0);setErr('');setDone(false);setSpeed('');
    const isLarge=f.size>20*1024*1024||large;
    if(isLarge){
      await doUploadLarge(f,folder,uid,(p,s)=>{setProg(p);if(s)setSpeed(s);},url=>{setUploading(false);if(url){onUrl(url);setProg(100);setDone(true);}else setErr('Upload failed — try again or use a smaller file');});
    }else{
      const url=await doUpload(f,folder,uid,p=>setProg(p));
      setUploading(false);
      if(url){onUrl(url);setProg(100);setDone(true);}else setErr('Upload failed');
    }
  }
  return(<div style={{marginBottom:14}}>
    {label&&<label style={B.label}>{label}</label>}
    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:6}}>
      <input ref={ref} type="file" accept={accept} style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handle(f);e.target.value='';}}/>
      <button type="button" disabled={uploading} onClick={()=>ref.current?.click()} style={{padding:'8px 16px',borderRadius:8,border:'1px dashed rgba(26,107,255,0.5)',background:'rgba(26,107,255,0.08)',color:'#1a6bff',cursor:uploading?'not-allowed':'pointer',fontSize:13,fontWeight:600,opacity:uploading?0.7:1,flexShrink:0}}>
        {uploading?`Uploading ${prog}%`:done?'✓ Uploaded':`📤 Upload ${type==='video'?'Video':type==='image'?'Image':type==='pdf'?'PDF':'File'}`}
      </button>
      {type!=='video'&&<><span style={{color:'#475569',fontSize:12}}>or URL:</span><input style={{...B.inp,flex:1,minWidth:160}} placeholder="https://..." value={value} onChange={e=>{onUrl(e.target.value);setDone(false);}} disabled={uploading}/></>}
    </div>
    {uploading&&<><div style={{height:5,background:'rgba(255,255,255,0.08)',borderRadius:3,marginBottom:4}}><div style={{height:'100%',width:`${prog}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:3,transition:'width 0.4s'}}/></div><div style={{fontSize:11,color:'#64748b'}}>{speed||`${prog}%`}</div></>}
    {err&&<div style={{fontSize:11,color:'#ef4444',marginTop:4}}>{err}</div>}
    {done&&<div style={{fontSize:11,color:'#10b981',marginTop:4}}>✓ Uploaded successfully</div>}
    {value&&!uploading&&type==='image'&&<img src={value} alt="" style={{height:80,borderRadius:8,objectFit:'cover',marginTop:6,display:'block'}}/>}
    {value&&!uploading&&type==='video'&&<div style={{marginTop:8,borderRadius:10,overflow:'hidden',background:'#000',border:'1px solid rgba(255,255,255,0.1)'}}><video src={value} controls style={{width:'100%',maxHeight:160,display:'block'}} preload="metadata"/></div>}
  </div>);}

export function ArticleDetail({article,user,onBack}:{article:any,user:any,onBack:()=>void}){
  const[liked,setLiked]=useState(false);const[likes,setLikes]=useState(article.likes||0);const[views,setViews]=useState(article.views||0);
  useEffect(()=>{
    const newViews=(article.views||0)+1;
    sb.from('academy_articles').update({views:newViews}).eq('id',article.id);
    setViews(newViews);
    if(user){sb.from('academy_article_likes').select('id').eq('user_id',user.id).eq('article_id',article.id).then(({data})=>setLiked((data||[]).length>0));}
  },[]);
  async function toggleLike(){
    if(!user){alert('Sign in to like articles');return;}
    if(liked){
      await sb.from('academy_article_likes').delete().eq('user_id',user.id).eq('article_id',article.id);
      const n=Math.max(0,likes-1);await sb.from('academy_articles').update({likes:n}).eq('id',article.id);setLikes(n);setLiked(false);
    }else{
      await sb.from('academy_article_likes').insert({user_id:user.id,article_id:article.id});
      const n=likes+1;await sb.from('academy_articles').update({likes:n}).eq('id',article.id);setLikes(n);setLiked(true);
    }
  }
  return(<div style={{...B.wrap,paddingBottom:80}}><div style={{maxWidth:760,margin:'0 auto',padding:'24px'}}>
    <button style={B.back} onClick={onBack}>← Back to Articles</button>
    {article.cover_url&&<img src={article.cover_url} alt="" style={{width:'100%',height:240,objectFit:'cover',borderRadius:12,marginBottom:20}}/>}
    <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}><span style={B.badge(gc(article.category))}>{article.category}</span>{(article.tags||[]).map((t:string)=><span key={t} style={{...B.badge('#475569'),marginLeft:2}}>{t}</span>)}</div>
    <h1 style={{fontSize:28,fontWeight:800,lineHeight:1.3,marginBottom:16,color:'#f1f5f9'}}>{article.title}</h1>
    <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,paddingBottom:20,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,flexShrink:0}}>{(article.author_name||'?')[0].toUpperCase()}</div>
      <div><div style={{fontWeight:700,color:'#e2e8f0'}}>{article.author_name}</div><div style={{fontSize:12,color:'#64748b'}}>{new Date(article.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}{article.read_time?` · ${article.read_time} min read`:''}</div></div>
      <div style={{marginLeft:'auto',display:'flex',gap:20,alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'#64748b'}}><span>👁</span><span>{views}</span></div>
        <button onClick={toggleLike} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#64748b',padding:0}}>
          <span style={{fontSize:22,transition:'transform 0.15s',transform:liked?'scale(1.2)':'scale(1)'}}>{liked?'❤️':'🤍'}</span><span style={{fontWeight:600,color:liked?'#ef4444':'#64748b'}}>{likes}</span>
        </button>
      </div>
    </div>
    <div style={{fontSize:16,lineHeight:1.95,color:'#cbd5e1',whiteSpace:'pre-wrap'}}>{article.content}</div>
  </div></div>);}

export function BookReader({book,onBack}:{book:any,onBack:()=>void}){
  const url=book.file_url||(book.file_path?STORAGE_URL+book.file_path:null);
  const[err,setErr]=useState(false);
  return(<div style={{...B.wrap,display:'flex',flexDirection:'column',height:'100vh'}}>
    <div style={{...B.hdr,flexShrink:0}}><button style={{...B.back,padding:0}} onClick={onBack}>← Back</button><h2 style={{...B.title,fontSize:16,margin:0,flex:1}}>{book.title}</h2>
    {url&&<a href={url} target="_blank" rel="noreferrer" download style={{...B.btn('ghost'),textDecoration:'none',fontSize:12,padding:'6px 14px',flexShrink:0}}>↓ Download</a>}
    </div>
    {url&&!err?<iframe src={url} style={{flex:1,border:'none',background:'#fff',width:'100%'}} title={book.title} onError={()=>setErr(true)}/>
    :<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#475569',gap:12}}>
      <div style={{fontSize:52}}>📖</div>
      <div style={{fontWeight:700,color:'#94a3b8'}}>{book.title}</div>
      {url?<a href={url} target="_blank" rel="noreferrer" style={{...B.btn('primary'),textDecoration:'none',padding:'10px 24px'}}>Open PDF ↗</a>:<div>No file available yet</div>}
    </div>}
  </div>);}

export function LessonViewer({course,lessons,activeLesson,setActiveLesson,user,onBack,onComplete}:{course:any,lessons:any[],activeLesson:any,setActiveLesson:any,user:any,onBack:()=>void,onComplete:(l:any)=>void}){
  const[qa,setQa]=useState<Record<number,number>>({});const[qResult,setQResult]=useState('');
  const progress=course.progress||0;const ltype=(l:any)=>l.lesson_type||'text';
  function submitQuiz(l:any){const qs=l.questions||[];let ok=0;qs.forEach((q:any,i:number)=>{if(qa[i]===q.correct_index)ok++;});const pct=Math.round((ok/qs.length)*100);setQResult(`${ok}/${qs.length} (${pct}%)${pct>=70?' — Passed ✓':' — Try again'}`);if(pct>=70)onComplete(l);}
  const videoSrc=(l:any)=>{const u=l.video_url||'';if(!u)return null;if(u.includes('youtube.com')||u.includes('youtu.be'))return u.replace('watch?v=','embed/').replace('youtu.be/','www.youtube.com/embed/');return u;};
  return(<div style={{...B.wrap,display:'flex',flexDirection:'column',height:'100vh'}}>
    <div style={{background:'#0a1628',padding:'10px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
      <button style={{...B.back,padding:0}} onClick={onBack}>← Exit</button>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:'#e2e8f0'}}>{course.title}</div><div style={{fontSize:11,color:'#64748b'}}>{progress}% complete</div></div>
      <div style={{width:120,height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,flexShrink:0}}><div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2,transition:'width 0.5s'}}/></div>
    </div>
    <div style={{display:'flex',flex:1,overflow:'hidden'}}>
      <div style={{width:250,background:'rgba(255,255,255,0.02)',borderRight:'1px solid rgba(255,255,255,0.06)',overflowY:'auto',flexShrink:0}}>
        <div style={{padding:'10px 14px',fontSize:11,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em'}}>Lessons ({lessons.length})</div>
        {lessons.map((l:any,i:number)=>{const done=progress>=(((i+1)/lessons.length)*100);const active=activeLesson?.id===l.id;return(<div key={l.id} onClick={()=>{setActiveLesson(l);setQa({});setQResult('');}} style={{padding:'10px 14px',cursor:'pointer',borderLeft:`3px solid ${active?'#1a6bff':'transparent'}`,background:active?'rgba(26,107,255,0.08)':'transparent',display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:22,height:22,borderRadius:'50%',background:done?'#10b981':active?'#1a6bff':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#fff',flexShrink:0,fontWeight:700}}>{done?'✓':i+1}</span>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:active?'#1a6bff':'#94a3b8',lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.title}</div><div style={{fontSize:10,color:'#475569',marginTop:1}}>{ltype(l)==='video'?'▶ Video':ltype(l)==='quiz'?'📝 Quiz':'📄 Reading'}</div></div>
        </div>);})}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:24}}>{activeLesson?(<>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:16,color:'#f1f5f9'}}>{activeLesson.title}</h2>
        {ltype(activeLesson)==='video'&&(()=>{const src=videoSrc(activeLesson);return(<div style={{width:'100%',aspectRatio:'16/9',background:'#000',borderRadius:12,overflow:'hidden',marginBottom:20,border:'1px solid rgba(255,255,255,0.08)'}}>{src?(src.includes('youtube.com/embed')?<iframe width="100%" height="100%" src={src} style={{border:'none'}} allowFullScreen/>:<video src={src} controls style={{width:'100%',height:'100%'}} controlsList="nodownload"/>):(<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'#475569',minHeight:200}}><div style={{fontSize:48}}>▶</div><div style={{fontSize:13,marginTop:8}}>No video attached</div></div>)}</div>);})()}
        {ltype(activeLesson)==='quiz'&&(<div style={{background:'rgba(139,92,246,0.05)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:12,padding:20,marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:15,color:'#8b5cf6',marginBottom:14}}>Quiz</div>
          {(activeLesson.questions||[]).map((q:any,qi:number)=>(<div key={qi} style={{marginBottom:18}}><div style={{fontWeight:600,marginBottom:8,color:'#e2e8f0'}}>{qi+1}. {q.question}</div>{(q.options||[]).map((opt:string,oi:number)=>(<div key={oi} onClick={()=>setQa(p=>({...p,[qi]:oi}))} style={{padding:'9px 14px',borderRadius:8,marginBottom:5,cursor:'pointer',background:qa[qi]===oi?'rgba(26,107,255,0.2)':'rgba(255,255,255,0.03)',border:`1px solid ${qa[qi]===oi?'#1a6bff':'rgba(255,255,255,0.07)'}`,fontSize:14,color:qa[qi]===oi?'#e2e8f0':'#94a3b8'}}>{opt}</div>))}</div>))}
          {qResult&&<div style={{padding:'10px 14px',borderRadius:8,background:qResult.includes('Passed')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:qResult.includes('Passed')?'#10b981':'#ef4444',fontWeight:700,marginBottom:10}}>{qResult}</div>}
          <button style={B.btn('primary')} onClick={()=>submitQuiz(activeLesson)}>Submit Quiz</button>
        </div>)}
        {activeLesson.content&&<div style={{fontSize:15,lineHeight:1.9,color:'#cbd5e1',whiteSpace:'pre-wrap',marginBottom:20}}>{activeLesson.content}</div>}
        {ltype(activeLesson)!=='quiz'&&<button style={{...B.btn('primary'),width:'100%',padding:'13px'}} onClick={()=>onComplete(activeLesson)}>{lessons.indexOf(activeLesson)===lessons.length-1?'Complete Course 🎉':'Next Lesson →'}</button>}
      </>):(<div style={{textAlign:'center',padding:60,color:'#475569'}}><div style={{fontSize:44,marginBottom:12}}>📖</div><div>Select a lesson to begin</div></div>)}</div>
    </div>
  </div>);}

export function CreatorStudio({user,supabase,profile,onBack,showToast}:{user:any,supabase?:SupabaseClient,profile:any,onBack:()=>void,showToast:(m:string)=>void}){
  const db=supabase||sb;
  const[tab,setTab]=useState<'dashboard'|'new-course'|'edit-course'|'bulk-upload'|'profile'>('dashboard');
  const[myCourses,setMyCourses]=useState<any[]>([]);
  const[editingCourse,setEditingCourse]=useState<any>(null);
  const[saving,setSaving]=useState(false);
  const[saveError,setSaveError]=useState('');
  const[ep,setEp]=useState({display_name:profile?.display_name||user?.email?.split('@')[0]||'Creator',tagline:profile?.tagline||'',bio:profile?.bio||'',website:profile?.website||'',expertise:(profile?.expertise||[]).join(', '),avatar_url:profile?.avatar_url||'',social_youtube:profile?.social_youtube||'',social_twitter:profile?.social_twitter||'',social_instagram:profile?.social_instagram||'',country:profile?.country||'',language:profile?.language||'English'});
  const blankCourse=()=>({title:'',description:'',category:'Budgeting',level:'Beginner',price:'0',language:'English',what_you_learn:'',requirements:'',thumbnail_url:''});
  const[nc,setNc]=useState<any>(blankCourse());
  const[ls,setLs]=useState<any[]>([{title:'Introduction',lesson_type:'text',content:'',video_url:'',is_free_preview:true}]);
  const[stats,setStats]=useState({courses:0,students:0,lessons:0});
  // Bulk upload state
  const[bulkFiles,setBulkFiles]=useState<{file:File,title:string,uploading:boolean,prog:number,speed:string,url:string,done:boolean,err:string}[]>([]);
  const[bulkCourseTitle,setBulkCourseTitle]=useState('');
  const[bulkCategory,setBulkCategory]=useState('Budgeting');
  const[bulkLevel,setBulkLevel]=useState('Beginner');
  const[bulkSaving,setBulkSaving]=useState(false);
  const bulkRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{if(user)loadDashboard();},[user]);

  async function loadDashboard(){
    const{data:courses}=await db.from('academy_courses').select('id,title,category,level,is_free,price,is_published,total_enrollments,avg_rating,thumbnail_url,created_at').eq('instructor_id',user.id).order('created_at',{ascending:false});
    setMyCourses(courses||[]);
    const totalStudents=(courses||[]).reduce((s:number,c:any)=>s+(c.total_enrollments||0),0);
    let lessonCount=0;
    if((courses||[]).length>0){const ids=(courses||[]).map((c:any)=>c.id);const{count}=await db.from('academy_lessons').select('id',{count:'exact',head:true}).in('course_id',ids);lessonCount=count||0;}
    setStats({courses:(courses||[]).length,students:totalStudents,lessons:lessonCount});
  }

  async function loadCourseForEdit(course:any){
    const{data:lessons}=await db.from('academy_lessons').select('*').eq('course_id',course.id).order('order_index');
    setEditingCourse(course);setNc({...course,price:String(course.price||0),what_you_learn:(course.what_you_learn||[]).join('\n'),requirements:(course.requirements||[]).join('\n')});
    setLs(lessons&&lessons.length>0?lessons:[{title:'Introduction',lesson_type:'text',content:'',video_url:'',is_free_preview:true}]);setTab('edit-course');
  }

  async function saveProfile(){
    setSaving(true);
    const{error}=await db.from('academy_creator_profiles').upsert({user_id:user.id,...ep,expertise:ep.expertise.split(',').map((s:string)=>s.trim()).filter(Boolean)},{onConflict:'user_id'});
    if(error)showToast('Error: '+error.message);else showToast('Profile saved! ✓');
    setSaving(false);
  }

  async function saveCourse(publish:boolean){
    if(!nc.title.trim()){showToast('Please add a course title');return;}
    setSaving(true);setSaveError('');
    const payload:any={title:nc.title.trim(),description:nc.description||'',category:nc.category||'Budgeting',level:nc.level||'Beginner',language:nc.language||'English',thumbnail_url:nc.thumbnail_url||null,price:parseFloat(nc.price)||0,is_free:(parseFloat(nc.price)||0)===0,what_you_learn:(nc.what_you_learn||'').split('\n').filter((s:string)=>s.trim()),requirements:(nc.requirements||'').split('\n').filter((s:string)=>s.trim()),instructor_id:user.id,instructor_name:ep.display_name||user?.email?.split('@')[0]||'Instructor',is_published:publish,certificate_enabled:true};
    let courseId=editingCourse?.id;
    if(courseId){const{error}=await db.from('academy_courses').update(payload).eq('id',courseId);if(error){setSaveError('Error: '+error.message);setSaving(false);return;}}
    else{const{data,error}=await db.from('academy_courses').insert(payload).select('id').single();if(error){setSaveError('Error: '+error.message);setSaving(false);return;}courseId=data.id;}
    const validLessons=ls.filter((l:any)=>l.title.trim());
    if(validLessons.length>0){
      if(editingCourse)await db.from('academy_lessons').delete().eq('course_id',courseId);
      const rows=validLessons.map((l:any,i:number)=>({course_id:courseId,title:l.title.trim(),lesson_type:l.lesson_type||'text',content:l.content||'',video_url:l.video_url||null,order_index:i,is_free_preview:l.is_free_preview||false,questions:l.questions||null}));
      const{error:lErr}=await db.from('academy_lessons').insert(rows);
      if(lErr){setSaveError('Lessons error: '+lErr.message);setSaving(false);return;}
    }
    await db.from('academy_courses').update({total_lessons:validLessons.length}).eq('id',courseId);
    showToast(publish?'Course published! 🎉':'Saved as draft ✓');
    setSaving(false);setSaveError('');setTab('dashboard');setNc(blankCourse());setLs([{title:'Introduction',lesson_type:'text',content:'',video_url:'',is_free_preview:true}]);setEditingCourse(null);loadDashboard();
  }

  // Bulk upload: upload all videos concurrently then create course+lessons
  function addBulkFiles(files:FileList){
    const items=Array.from(files).filter(f=>f.type.startsWith('video/')||f.name.match(/\.(mp4|mov|webm|m4v|avi)$/i));
    const newItems=items.map(f=>({file:f,title:f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),uploading:false,prog:0,speed:'',url:'',done:false,err:''}));
    setBulkFiles(p=>[...p,...newItems]);
  }

  async function startBulkUpload(){
    if(bulkFiles.length===0){showToast('Add some videos first');return;}
    // Upload all files concurrently
    const promises=bulkFiles.map((item,i)=>new Promise<void>(resolve=>{
      setBulkFiles(p=>p.map((x,j)=>j===i?{...x,uploading:true,prog:0,err:''}:x));
      doUploadLarge(item.file,'videos',user.id,(prog,speed)=>{
        setBulkFiles(p=>p.map((x,j)=>j===i?{...x,prog,speed:speed||''}:x));
      },url=>{
        setBulkFiles(p=>p.map((x,j)=>j===i?{...x,uploading:false,done:!!url,url:url||'',err:url?'':'Upload failed'}:x));
        resolve();
      });
    }));
    await Promise.all(promises);
  }

  async function publishBulkCourse(){
    if(!bulkCourseTitle.trim()){showToast('Add a course title');return;}
    const uploaded=bulkFiles.filter(f=>f.done&&f.url);
    if(uploaded.length===0){showToast('Upload videos first');return;}
    setBulkSaving(true);
    const{data:course,error}=await db.from('academy_courses').insert({title:bulkCourseTitle.trim(),description:'',category:bulkCategory,level:bulkLevel,language:'English',price:0,is_free:true,what_you_learn:[],requirements:[],instructor_id:user.id,instructor_name:ep.display_name||user?.email?.split('@')[0]||'Instructor',is_published:true,certificate_enabled:true,total_lessons:uploaded.length}).select('id').single();
    if(error){showToast('Error: '+error.message);setBulkSaving(false);return;}
    const rows=uploaded.map((f,i)=>({course_id:course.id,title:f.title,lesson_type:'video',content:'',video_url:f.url,order_index:i,is_free_preview:i===0,questions:null}));
    await db.from('academy_lessons').insert(rows);
    showToast(`Course published with ${uploaded.length} lessons! 🎉`);
    setBulkSaving(false);setBulkFiles([]);setBulkCourseTitle('');setTab('dashboard');loadDashboard();
  }

  async function deleteCourse(id:string){if(!confirm('Delete this course?'))return;await db.from('academy_lessons').delete().eq('course_id',id);await db.from('academy_courses').delete().eq('id',id);showToast('Deleted');loadDashboard();}
  async function togglePublish(course:any){await db.from('academy_courses').update({is_published:!course.is_published}).eq('id',course.id);showToast(course.is_published?'Unpublished':'Published! 🎉');loadDashboard();}

  const cats=['Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];
  const isEditing=tab==='edit-course'||tab==='new-course';
  const countries=['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Brazil','Canada','China','Colombia','Czech Republic','Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kazakhstan','Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','South Africa','South Korea','Spain','Sri Lanka','Sweden','Switzerland','Tanzania','Thailand','Turkey','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uzbekistan','Vietnam'];

  return(<div style={{...B.wrap,paddingBottom:80}}>
    <div style={{...B.hdr,flexWrap:'wrap',gap:8}}>
      <button style={{...B.back,padding:0}} onClick={isEditing||tab==='bulk-upload'?(()=>{setTab('dashboard');setSaveError('');setEditingCourse(null);}):onBack}>← {isEditing||tab==='bulk-upload'?'Back':'Exit Studio'}</button>
      <h2 style={{...B.title,fontSize:18,margin:0}}>Creator Studio</h2>
      {!isEditing&&tab!=='bulk-upload'&&<div style={{marginLeft:'auto',display:'flex',gap:8}}>
        <button style={{...B.btn('ghost'),padding:'7px 12px',fontSize:11}} onClick={()=>{setBulkFiles([]);setBulkCourseTitle('');setTab('bulk-upload');}}>📦 Bulk Upload</button>
        <button style={{...B.btn('primary'),padding:'7px 14px',fontSize:12}} onClick={()=>{setNc(blankCourse());setLs([{title:'Introduction',lesson_type:'text',content:'',video_url:'',is_free_preview:true}]);setEditingCourse(null);setSaveError('');setTab('new-course');}}>+ New Course</button>
      </div>}
    </div>

    {!isEditing&&tab!=='bulk-upload'&&<div style={B.tabs}>{(['dashboard','profile']as const).map(t=><button key={t} style={B.tab(tab===t)} onClick={()=>setTab(t)}>{t==='dashboard'?'My Courses':'My Profile'}</button>)}</div>}

    <div style={{padding:'20px 24px'}}>

    {tab==='profile'&&(<div style={{maxWidth:600}}>
      <h3 style={{color:'#e2e8f0',marginBottom:20,fontWeight:800,fontSize:18}}>Creator Profile</h3>
      {/* Avatar */}
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24,padding:16,background:'rgba(255,255,255,0.02)',borderRadius:12,border:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{width:72,height:72,borderRadius:'50%',overflow:'hidden',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,flexShrink:0}}>
          {ep.avatar_url?<img src={ep.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(ep.display_name[0]||'C').toUpperCase()}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,color:'#e2e8f0',marginBottom:4}}>{ep.display_name||'Your Name'}</div>
          <div style={{fontSize:12,color:'#64748b',marginBottom:8}}>{ep.tagline||'Add a tagline below'}</div>
          <UploadField label="" accept="image/jpeg,image/png,image/webp" value={ep.avatar_url} onUrl={u=>setEp(p=>({...p,avatar_url:u}))} uid={user?.id||'upload'} folder="avatars" type="image"/>
        </div>
      </div>
      {/* Basic info */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <div style={{gridColumn:'1/-1'}}><label style={B.label}>Display Name</label><input style={B.inp} value={ep.display_name} onChange={e=>setEp(p=>({...p,display_name:e.target.value}))}/></div>
        <div style={{gridColumn:'1/-1'}}><label style={B.label}>Tagline</label><input style={B.inp} placeholder="e.g. Finance Coach & Budgeting Expert" value={ep.tagline} onChange={e=>setEp(p=>({...p,tagline:e.target.value}))}/></div>
        <div><label style={B.label}>Country</label><select style={B.inp} value={ep.country} onChange={e=>setEp(p=>({...p,country:e.target.value}))}><option value="">Select country</option>{countries.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={B.label}>Language</label><select style={B.inp} value={ep.language} onChange={e=>setEp(p=>({...p,language:e.target.value}))}>{['English','Pashto','Dari','Arabic','Urdu','German','French','Spanish','Turkish'].map(l=><option key={l}>{l}</option>)}</select></div>
        <div style={{gridColumn:'1/-1'}}><label style={B.label}>Bio</label><textarea style={{...B.ta,minHeight:90}} value={ep.bio} onChange={e=>setEp(p=>({...p,bio:e.target.value}))} placeholder="Tell students about yourself, your background, and what you teach"/></div>
        <div style={{gridColumn:'1/-1'}}><label style={B.label}>Expertise (comma separated)</label><input style={B.inp} placeholder="e.g. Budgeting, Investing, Tax Planning" value={ep.expertise} onChange={e=>setEp(p=>({...p,expertise:e.target.value}))}/></div>
        <div style={{gridColumn:'1/-1'}}><label style={B.label}>Website</label><input style={B.inp} placeholder="https://yoursite.com" value={ep.website} onChange={e=>setEp(p=>({...p,website:e.target.value}))}/></div>
      </div>
      {/* Social links */}
      <div style={{marginBottom:20,padding:14,background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{fontWeight:700,color:'#e2e8f0',marginBottom:12,fontSize:13}}>Social Links</div>
        <div style={{display:'grid',gap:10}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{width:80,fontSize:12,color:'#ef4444',fontWeight:600}}>YouTube</span><input style={{...B.inp,flex:1}} placeholder="https://youtube.com/@channel" value={ep.social_youtube} onChange={e=>setEp(p=>({...p,social_youtube:e.target.value}))}/></div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{width:80,fontSize:12,color:'#1da1f2',fontWeight:600}}>Twitter</span><input style={{...B.inp,flex:1}} placeholder="https://x.com/username" value={ep.social_twitter} onChange={e=>setEp(p=>({...p,social_twitter:e.target.value}))}/></div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{width:80,fontSize:12,color:'#e1306c',fontWeight:600}}>Instagram</span><input style={{...B.inp,flex:1}} placeholder="https://instagram.com/username" value={ep.social_instagram} onChange={e=>setEp(p=>({...p,social_instagram:e.target.value}))}/></div>
        </div>
      </div>
      <button style={{...B.btn('primary'),padding:'12px 32px'}} onClick={saveProfile} disabled={saving}>{saving?'Saving...':'Save Profile'}</button>
    </div>)}

    {tab==='dashboard'&&(<>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        {[['Courses',stats.courses,'#1a6bff'],['Students',stats.students,'#10b981'],['Lessons',stats.lessons,'#8b5cf6']].map(([l,v,c])=>(<div key={l as string} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${c}33`,borderRadius:12,padding:'14px 20px',minWidth:120,flex:1}}><div style={{fontSize:28,fontWeight:800,fontFamily:"'Orbitron',monospace",color:c as string}}>{v}</div><div style={{fontSize:12,color:'#64748b',marginTop:2}}>{l}</div></div>))}
      </div>
      {myCourses.length===0?(<div style={{textAlign:'center',padding:40,color:'#475569',background:'rgba(255,255,255,0.02)',borderRadius:12,border:'1px dashed rgba(255,255,255,0.08)'}}><div style={{fontSize:40,marginBottom:12}}>🎬</div><div style={{marginBottom:16}}>No courses yet — create your first one!</div><div style={{display:'flex',gap:10,justifyContent:'center'}}><button style={B.btn('primary')} onClick={()=>{setNc(blankCourse());setLs([{title:'Introduction',lesson_type:'text',content:'',video_url:'',is_free_preview:true}]);setEditingCourse(null);setTab('new-course');}}>+ New Course</button><button style={B.btn('ghost')} onClick={()=>{setBulkFiles([]);setBulkCourseTitle('');setTab('bulk-upload');}}>📦 Bulk Upload</button></div></div>):(
      <div style={{display:'grid',gap:12}}>{myCourses.map((c:any)=>(<div key={c.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:16,display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{width:52,height:52,borderRadius:10,overflow:'hidden',flexShrink:0,background:`${gc(c.category)}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{c.thumbnail_url?<img src={c.thumbnail_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:gi(c.category)}</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,color:'#e2e8f0',fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div><div style={{fontSize:12,color:'#64748b',marginTop:3,display:'flex',gap:8,flexWrap:'wrap'}}><span style={B.badge(gc(c.category))}>{c.category}</span><span>{c.level}</span><span style={{color:c.is_free?'#10b981':'#e2e8f0'}}>{c.is_free?'Free':'$'+c.price}</span><span>👥 {c.total_enrollments||0}</span></div></div>
        <div style={{display:'flex',gap:6,flexShrink:0,flexWrap:'wrap'}}><span style={{...B.badge(c.is_published?'#10b981':'#f59e0b'),padding:'4px 10px',fontSize:11}}>{c.is_published?'Live':'Draft'}</span><button style={{...B.btn('ghost'),padding:'5px 12px',fontSize:11}} onClick={()=>loadCourseForEdit(c)}>Edit</button><button style={{...B.btn('ghost'),padding:'5px 12px',fontSize:11}} onClick={()=>togglePublish(c)}>{c.is_published?'Unpublish':'Publish'}</button><button style={{...B.btn('danger'),padding:'5px 12px',fontSize:11}} onClick={()=>deleteCourse(c.id)}>Delete</button></div>
      </div>))}</div>)}
    </>)}

    {tab==='bulk-upload'&&(<div style={{maxWidth:760}}>
      <h3 style={{color:'#e2e8f0',marginBottom:6,fontWeight:800,fontSize:18}}>Bulk Course Upload</h3>
      <p style={{color:'#64748b',fontSize:13,marginBottom:20}}>Upload multiple videos at once. Each video becomes a lesson. We auto-fill the title from the filename — you can edit it before publishing.</p>
      {/* Course info */}
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:16,marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
          <div style={{gridColumn:'1/-1'}}><label style={B.label}>Course Title *</label><input style={{...B.inp,border:'1px solid rgba(26,107,255,0.4)',fontSize:15}} placeholder="e.g. Complete Budgeting Masterclass" value={bulkCourseTitle} onChange={e=>setBulkCourseTitle(e.target.value)}/></div>
          <div><label style={B.label}>Category</label><select style={B.inp} value={bulkCategory} onChange={e=>setBulkCategory(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={B.label}>Level</label><select style={B.inp} value={bulkLevel} onChange={e=>setBulkLevel(e.target.value)}>{['Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}</select></div>
        </div>
      </div>
      {/* Drop zone */}
      <div onClick={()=>bulkRef.current?.click()} style={{border:'2px dashed rgba(26,107,255,0.4)',borderRadius:12,padding:'32px 20px',textAlign:'center',cursor:'pointer',background:'rgba(26,107,255,0.04)',marginBottom:16,transition:'all 0.2s'}}
        onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor='#1a6bff';e.currentTarget.style.background='rgba(26,107,255,0.1)';}}
        onDragLeave={e=>{e.currentTarget.style.borderColor='rgba(26,107,255,0.4)';e.currentTarget.style.background='rgba(26,107,255,0.04)';}}
        onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor='rgba(26,107,255,0.4)';e.currentTarget.style.background='rgba(26,107,255,0.04)';if(e.dataTransfer.files)addBulkFiles(e.dataTransfer.files);}}>
        <input ref={bulkRef} type="file" accept="video/*" multiple style={{display:'none'}} onChange={e=>{if(e.target.files)addBulkFiles(e.target.files);e.target.value='';}}/>
        <div style={{fontSize:36,marginBottom:8}}>🎬</div>
        <div style={{color:'#e2e8f0',fontWeight:700,marginBottom:4}}>Drop videos here or click to browse</div>
        <div style={{color:'#64748b',fontSize:12}}>MP4, MOV, WebM supported · Up to 500MB per video · Multiple files at once</div>
      </div>
      {/* File list */}
      {bulkFiles.length>0&&(<>
        <div style={{marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{color:'#e2e8f0',fontWeight:700}}>{bulkFiles.length} video{bulkFiles.length!==1?'s':''} selected</div>
          <div style={{display:'flex',gap:8}}>
            <button style={{...B.btn('ghost'),padding:'6px 14px',fontSize:12}} onClick={()=>setBulkFiles([])}>Clear All</button>
            <button style={{...B.btn('primary'),padding:'6px 14px',fontSize:12}} onClick={startBulkUpload} disabled={bulkFiles.every(f=>f.done||f.uploading)}>Upload All ↑</button>
          </div>
        </div>
        <div style={{display:'grid',gap:8,marginBottom:16}}>
          {bulkFiles.map((f,i)=>(<div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:12}}>
            <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:f.uploading?8:0}}>
              <span style={{fontSize:18,flexShrink:0}}>{f.done?'✅':f.err?'❌':f.uploading?'⏫':'🎬'}</span>
              <div style={{flex:1,minWidth:0}}>
                <input style={{...B.inp,fontSize:13,padding:'6px 10px'}} value={f.title} onChange={e=>setBulkFiles(p=>p.map((x,j)=>j===i?{...x,title:e.target.value}:x))} placeholder={`Lesson ${i+1} title`}/>
                <div style={{fontSize:11,color:'#475569',marginTop:3}}>{(f.file.size/1024/1024).toFixed(1)} MB · {f.file.name}</div>
              </div>
              <button onClick={()=>setBulkFiles(p=>p.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:16,flexShrink:0,padding:0}}>✕</button>
            </div>
            {f.uploading&&<><div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,marginBottom:3}}><div style={{height:'100%',width:`${f.prog}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2,transition:'width 0.4s'}}/></div><div style={{fontSize:11,color:'#64748b'}}>{f.speed||`${f.prog}%`}</div></>}
            {f.err&&<div style={{fontSize:11,color:'#ef4444',marginTop:4}}>{f.err}</div>}
            {f.done&&<div style={{fontSize:11,color:'#10b981',marginTop:4}}>✓ Uploaded — ready to publish</div>}
          </div>))}
        </div>
        {bulkFiles.some(f=>f.done)&&<button style={{...B.btn('primary'),padding:'13px 32px',fontSize:15,width:'100%'}} onClick={publishBulkCourse} disabled={bulkSaving}>{bulkSaving?'Creating course...':'Publish Course 🚀 ('+bulkFiles.filter(f=>f.done).length+' lessons)'}</button>}
      </>)}
    </div>)}

    {isEditing&&(<div style={{maxWidth:760}}>
      <h3 style={{color:'#e2e8f0',marginBottom:20,fontWeight:800,fontSize:18}}>{editingCourse?'Edit Course':'New Course'}</h3>
      {saveError&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#ef4444'}}>{saveError}</div>}
      <UploadField label="Thumbnail" accept="image/jpeg,image/png,image/webp" value={nc.thumbnail_url||''} onUrl={u=>setNc((p:any)=>({...p,thumbnail_url:u}))} uid={user?.id||'upload'} folder="thumbnails" type="image"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <div style={{gridColumn:'1/-1'}}><label style={{...B.label,color:'#e2e8f0',fontSize:13}}>Course Title *</label><input style={{...B.inp,border:'1px solid rgba(26,107,255,0.5)',fontSize:15}} placeholder="e.g. Budgeting for Beginners" value={nc.title} onChange={e=>setNc((p:any)=>({...p,title:e.target.value}))}/></div>
        <div><label style={B.label}>Category</label><select style={B.inp} value={nc.category} onChange={e=>setNc((p:any)=>({...p,category:e.target.value}))}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={B.label}>Level</label><select style={B.inp} value={nc.level} onChange={e=>setNc((p:any)=>({...p,level:e.target.value}))}>{['Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}</select></div>
        <div><label style={B.label}>Price USD (0 = free)</label><input style={B.inp} type="number" min="0" step="0.01" value={nc.price} onChange={e=>setNc((p:any)=>({...p,price:e.target.value}))}/></div>
        <div><label style={B.label}>Language</label><select style={B.inp} value={nc.language||'English'} onChange={e=>setNc((p:any)=>({...p,language:e.target.value}))}>{['English','Pashto','Dari','Arabic','Urdu','German','French','Spanish'].map(l=><option key={l}>{l}</option>)}</select></div>
      </div>
      <div style={{marginBottom:14}}><label style={B.label}>Description</label><textarea style={{...B.ta,minHeight:80}} placeholder="What is this course about?" value={nc.description} onChange={e=>setNc((p:any)=>({...p,description:e.target.value}))}/></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
        <div><label style={B.label}>What students will learn (one per line)</label><textarea style={B.ta} rows={4} value={nc.what_you_learn} onChange={e=>setNc((p:any)=>({...p,what_you_learn:e.target.value}))}/></div>
        <div><label style={B.label}>Requirements (one per line)</label><textarea style={B.ta} rows={4} value={nc.requirements} onChange={e=>setNc((p:any)=>({...p,requirements:e.target.value}))}/></div>
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:20,marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h4 style={{color:'#e2e8f0',margin:0,fontWeight:800}}>Lessons ({ls.length})</h4>
          <div style={{display:'flex',gap:8}}>{(['text','video','quiz']as const).map(t=>(<button key={t} style={{...B.btn('ghost'),padding:'5px 12px',fontSize:11}} onClick={()=>setLs(p=>[...p,{title:'',lesson_type:t,content:'',video_url:'',is_free_preview:false}])}>+ {t==='video'?'Video':t==='quiz'?'Quiz':'Reading'}</button>))}</div>
        </div>
        {ls.map((l:any,i:number)=>(<div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:16,marginBottom:10}}>
          <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center'}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:l.lesson_type==='video'?'rgba(26,107,255,0.2)':l.lesson_type==='quiz'?'rgba(139,92,246,0.2)':'rgba(16,185,129,0.2)',color:l.lesson_type==='video'?'#1a6bff':l.lesson_type==='quiz'?'#8b5cf6':'#10b981',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0,fontWeight:700}}>{l.lesson_type==='video'?'▶':l.lesson_type==='quiz'?'?':'T'}</div>
            <input style={{...B.inp,flex:1}} placeholder={`Lesson ${i+1} title`} value={l.title} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,title:e.target.value}:x))}/>
            <select style={{...B.inp,width:'auto'}} value={l.lesson_type} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,lesson_type:e.target.value}:x))}><option value="text">📄 Reading</option><option value="video">▶ Video</option><option value="quiz">📝 Quiz</option></select>
            <label style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#64748b',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}><input type="checkbox" checked={l.is_free_preview||false} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,is_free_preview:e.target.checked}:x))}/>Free</label>
            <button onClick={()=>setLs(p=>p.filter((_:any,j:number)=>j!==i))} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:18,flexShrink:0,padding:0,lineHeight:1}}>✕</button>
          </div>
          {l.lesson_type==='video'&&(<UploadField label="" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" value={l.video_url||''} onUrl={u=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,video_url:u}:x))} uid={user?.id||'upload'} folder="videos" type="video" large={true}/>)}
          <textarea style={{...B.ta,minHeight:l.lesson_type==='quiz'?52:80}} placeholder={l.lesson_type==='quiz'?'Quiz intro (optional)':'Lesson notes or reading content'} value={l.content||''} onChange={e=>setLs(p=>p.map((x:any,j:number)=>j===i?{...x,content:e.target.value}:x))}/>
        </div>))}
      </div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',paddingBottom:40}}>
        <button style={{...B.btn('primary'),padding:'13px 32px',fontSize:15}} onClick={()=>saveCourse(true)} disabled={saving}>{saving?'Publishing...':'Publish Course 🚀'}</button>
        <button style={{...B.btn('ghost'),padding:'13px 24px'}} onClick={()=>saveCourse(false)} disabled={saving}>{saving?'Saving...':'Save as Draft'}</button>
        <button style={{...B.btn('ghost'),padding:'13px 20px'}} onClick={()=>{setTab('dashboard');setEditingCourse(null);setSaveError('');}}>Cancel</button>
      </div>
    </div>)}

    </div>
  </div>);}
