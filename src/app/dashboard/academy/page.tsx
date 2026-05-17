'use client';
export const dynamic = 'force-dynamic';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
import{B,sb,gc,gi,doUpload,UploadField,ArticleDetail,BookReader,LessonViewer,CreatorStudio,WaveLogo,STORAGE_URL}from'./components';

const DB=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');

export default function AcademyPage(){
  const[user,setUser]=useState<any>(null);
  const[tab,setTab]=useState<'courses'|'articles'|'books'|'my-learning'>('courses');
  const[courses,setCourses]=useState<any[]>([]);
  const[articles,setArticles]=useState<any[]>([]);
  const[books,setBooks]=useState<any[]>([]);
  const[enrollments,setEnrollments]=useState<any[]>([]);
  const[toast,setToast]=useState('');
  const[view,setView]=useState<any>(null);
  const[catFilter,setCatFilter]=useState('All');
  const[isCreator,setIsCreator]=useState(false);
  const[creatorProfile,setCreatorProfile]=useState<any>(null);
  const[writeArticle,setWriteArticle]=useState(false);
  const[uploadBook,setUploadBook]=useState(false);
  const[newArticle,setNewArticle]=useState({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});
  const[newBook,setNewBook]=useState({title:'',author:'',description:'',category:'Budgeting',is_free:true,price:'0',cover_url:'',file_url:''});
  const[lessons,setLessons]=useState<any[]>([]);
  const[activeLesson,setActiveLesson]=useState<any>(null);
  const cats=['All','Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];

  useEffect(()=>{
    DB.auth.getUser().then(({data})=>{
      setUser(data.user);
      if(data.user){
        DB.from('academy_creator_profiles').select('*').eq('user_id',data.user.id).maybeSingle().then(({data:p})=>setCreatorProfile(p));
        DB.from('academy_enrollments').select('course_id,progress').eq('user_id',data.user.id).then(({data:e})=>setEnrollments(e||[]));
      }
    });
    loadCourses();
    DB.from('academy_articles').select('*').eq('is_published',true).order('created_at',{ascending:false}).then(({data})=>setArticles(data||[]));
    DB.from('academy_books').select('*').order('title',{ascending:true}).then(({data})=>setBooks(data||[]));
  },[]);

  useEffect(()=>{
    if(view?.type==='course'){
      DB.from('academy_lessons').select('*').eq('course_id',view.course.id).order('order_index').then(({data})=>{setLessons(data||[]);if(data&&data.length>0)setActiveLesson(data[0]);});
    }
  },[view?.course?.id]);

  async function loadCourses(){const{data}=await DB.from('academy_courses').select('*').eq('is_published',true).order('created_at',{ascending:false});setCourses(data||[]);}
  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),3500);}

  async function enrollCourse(courseId:string){
    if(!user){showToast('Sign in to enroll');return;}
    const{error}=await DB.from('academy_enrollments').insert({user_id:user.id,course_id:courseId,progress:0});
    if(error&&error.code!=='23505'){showToast('Error: '+error.message);return;}
    const newEnroll={course_id:courseId,progress:0};
    setEnrollments(prev=>[...prev.filter(e=>e.course_id!==courseId),newEnroll]);
    showToast('Enrolled! 🎉');
    setView({type:'course',course:courses.find(c=>c.id===courseId)});
  }

  async function markComplete(lesson:any,courseId:string){
    if(!user)return;
    const{data:allLessons}=await DB.from('academy_lessons').select('id').eq('course_id',courseId);
    const{data:completed}=await DB.from('academy_progress').select('lesson_id').eq('user_id',user.id).eq('course_id',courseId);
    const completedIds=new Set((completed||[]).map((p:any)=>p.lesson_id));
    completedIds.add(lesson.id);
    await DB.from('academy_progress').upsert({user_id:user.id,course_id:courseId,lesson_id:lesson.id},{onConflict:'user_id,course_id,lesson_id'});
    const pct=Math.round((completedIds.size/(allLessons||[]).length)*100);
    await DB.from('academy_enrollments').update({progress:pct}).eq('user_id',user.id).eq('course_id',courseId);
    setEnrollments(prev=>prev.map(e=>e.course_id===courseId?{...e,progress:pct}:e));
    if(pct>=100)showToast('Course complete! Certificate earned! 🎉');
    else{const idx=lessons.findIndex(l=>l.id===lesson.id);if(idx<lessons.length-1)setActiveLesson(lessons[idx+1]);}
  }

  async function submitArticle(){
    if(!newArticle.title.trim()||!newArticle.content.trim()){showToast('Title and content required');return;}
    const{error}=await DB.from('academy_articles').insert({...newArticle,author_id:user?.id||null,author_name:user?.email?.split('@')[0]||'Anonymous',tags:newArticle.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),is_published:true,views:0,likes:0});
    if(error){showToast('Error: '+error.message);return;}
    showToast('Article published!');setWriteArticle(false);setNewArticle({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});
    DB.from('academy_articles').select('*').eq('is_published',true).order('created_at',{ascending:false}).then(({data})=>setArticles(data||[]));
  }

  async function submitBook(){
    if(!newBook.title.trim()){showToast('Book title required');return;}
    const{error}=await DB.from('academy_books').insert({...newBook,author_id:user?.id||null,price:parseFloat(newBook.price)||0,is_published:true,total_downloads:0});
    if(error){showToast('Error: '+error.message);return;}
    showToast('Book uploaded!');setUploadBook(false);setNewBook({title:'',author:'',description:'',category:'Budgeting',is_free:true,price:'0',cover_url:'',file_url:''});
    DB.from('academy_books').select('*').order('title',{ascending:true}).then(({data})=>setBooks(data||[]));
  }

  const filteredCourses=catFilter==='All'?courses:courses.filter(c=>c.category===catFilter);

  if(isCreator)return(<CreatorStudio user={user} supabase={DB} profile={creatorProfile} onBack={()=>{setIsCreator(false);loadCourses();}} showToast={showToast}/>);
  if(view?.type==='article')return(<ArticleDetail article={view.article} user={user} onBack={()=>setView(null)}/>);
  if(view?.type==='book-reader')return(<BookReader book={view.book} onBack={()=>setView(null)}/>);
  if(view?.type==='course'){
    const enrollment=enrollments.find(e=>e.course_id===view.course.id)||{progress:0};
    return(<LessonViewer course={{...view.course,progress:enrollment.progress}} lessons={lessons} activeLesson={activeLesson} setActiveLesson={setActiveLesson} user={user} onBack={()=>{setView(null);setLessons([]);setActiveLesson(null);}} onComplete={(l)=>markComplete(l,view.course.id)}/>);
  }

  return(
    <div style={B.wrap}>
      {toast&&<div style={B.toast}>{toast}</div>}
      <div style={{...B.hdr,gap:12}}>
        <WaveLogo size={36}/>
        <h1 style={B.title}>FlowFund Academy</h1>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {user&&<button onClick={()=>setIsCreator(true)} style={{padding:'7px 14px',borderRadius:8,border:'none',background:'rgba(108,46,245,0.15)',color:'#8b5cf6',cursor:'pointer',fontSize:12,fontWeight:700}}>🎬 Creator</button>}
          {user&&<div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'#fff',flexShrink:0}}>{user.email?.[0]?.toUpperCase()}</div>}
        </div>
      </div>

      <div style={B.tabs}>
        {(['courses','articles','books','my-learning']as const).map(t=><button key={t} style={B.tab(tab===t)} onClick={()=>setTab(t)}>{t==='my-learning'?'My Learning':t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>

      {tab==='courses'&&(
        <div style={{padding:'16px 24px 80px'}}>
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
            {cats.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:'5px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:catFilter===c?gc(c):'rgba(255,255,255,0.05)',color:catFilter===c?'#fff':'#64748b'}}>{c}</button>)}
          </div>
          <div style={B.grid}>
            {filteredCourses.map((c:any)=>{
              const enroll=enrollments.find(e=>e.course_id===c.id);
              return(
                <div key={c.id} style={B.card}>
                  <div style={{height:140,position:'relative',overflow:'hidden',background:`${gc(c.category)}18`}}>
                    {c.thumbnail_url
                      ?<img src={c.thumbnail_url} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
                      :<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>{gi(c.category)}</div>
                    }
                    <div style={{position:'absolute',top:8,right:8}}><span style={{...B.badge(c.is_free?'#10b981':'#f59e0b'),fontSize:10,background:c.is_free?'#10b98133':'#f59e0b33'}}>{c.is_free?'FREE':'$'+c.price}</span></div>
                    {enroll&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:3,background:'rgba(0,0,0,0.3)'}}><div style={{height:'100%',width:`${enroll.progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)'}}/></div>}
                  </div>
                  <div style={{padding:'12px 14px'}}>
                    <div style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}><span style={B.badge(gc(c.category))}>{c.category}</span><span style={{fontSize:11,color:'#475569'}}>{c.level}</span></div>
                    <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',lineHeight:1.3,marginBottom:4}}>{c.title}</div>
                    <div style={{fontSize:11,color:'#64748b',marginBottom:10}}>by {c.instructor_name||'Instructor'} · {c.total_lessons||0} lessons</div>
                    {enroll
                      ?<button onClick={()=>setView({type:'course',course:c})} style={{...B.btn('primary'),width:'100%',padding:'8px',fontSize:12}}>Continue ({enroll.progress}%)</button>
                      :<button onClick={()=>enrollCourse(c.id)} style={{...B.btn('primary'),width:'100%',padding:'8px',fontSize:12}}>Enroll Now</button>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==='articles'&&(
        <div style={{padding:'16px 24px 80px'}}>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
            {user&&<button onClick={()=>setWriteArticle(v=>!v)} style={{...B.btn('primary'),padding:'8px 16px',fontSize:13}}>{writeArticle?'Cancel':'+ Write'}</button>}
          </div>
          {writeArticle&&(
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:20,marginBottom:20}}>
              <h3 style={{color:'#e2e8f0',marginBottom:16,fontWeight:800}}>Write Article</h3>
              <div style={{marginBottom:12}}><label style={B.label}>Title</label><input style={B.inp} value={newArticle.title} onChange={e=>setNewArticle(p=>({...p,title:e.target.value}))} placeholder="Article title"/></div>
              <div style={{marginBottom:12}}><label style={B.label}>Category</label><select style={B.inp} value={newArticle.category} onChange={e=>setNewArticle(p=>({...p,category:e.target.value}))}>{cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
              <div style={{marginBottom:12}}><label style={B.label}>Tags (comma separated)</label><input style={B.inp} value={newArticle.tags} onChange={e=>setNewArticle(p=>({...p,tags:e.target.value}))} placeholder="budgeting, savings, tips"/></div>
              <UploadField label="Cover Photo" accept="image/jpeg,image/png,image/webp" value={newArticle.cover_url} onUrl={u=>setNewArticle(p=>({...p,cover_url:u}))} uid={user?.id||'upload'} folder="articles" type="image"/>
              <div style={{marginBottom:12}}><label style={B.label}>Content</label><textarea style={{...B.ta,minHeight:160}} value={newArticle.content} onChange={e=>setNewArticle(p=>({...p,content:e.target.value}))} placeholder="Write your article..."/></div>
              <div style={{display:'flex',gap:8}}><button style={B.btn('primary')} onClick={submitArticle}>Publish</button><button style={B.btn('ghost')} onClick={()=>setWriteArticle(false)}>Cancel</button></div>
            </div>
          )}
          <div style={B.grid}>
            {articles.map((a:any)=>(
              <div key={a.id} style={{...B.card}} onClick={()=>setView({type:'article',article:a})}>
                {a.cover_url?<img src={a.cover_url} alt={a.title} style={{width:'100%',height:120,objectFit:'cover',display:'block'}}/>:<div style={{height:80,background:`${gc(a.category)}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>{gi(a.category)}</div>}
                <div style={{padding:'12px 14px'}}>
                  <span style={B.badge(gc(a.category))}>{a.category}</span>
                  <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',lineHeight:1.3,margin:'8px 0 4px'}}>{a.title}</div>
                  <div style={{fontSize:11,color:'#64748b'}}>by {a.author_name} · {a.read_time||5} min · 👁 {a.views||0} · ❤️ {a.likes||0}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='books'&&(
        <div style={{padding:'16px 24px 80px'}}>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
            {user&&<button onClick={()=>setUploadBook(v=>!v)} style={{...B.btn('primary'),padding:'8px 16px',fontSize:13}}>{uploadBook?'Cancel':'+ Upload Book'}</button>}
          </div>
          {uploadBook&&(
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:20,marginBottom:20}}>
              <h3 style={{color:'#e2e8f0',marginBottom:16,fontWeight:800}}>Upload Book</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div><label style={B.label}>Title *</label><input style={B.inp} value={newBook.title} onChange={e=>setNewBook(p=>({...p,title:e.target.value}))} placeholder="Book title"/></div>
                <div><label style={B.label}>Author</label><input style={B.inp} value={newBook.author} onChange={e=>setNewBook(p=>({...p,author:e.target.value}))} placeholder="Author name"/></div>
                <div><label style={B.label}>Category</label><select style={B.inp} value={newBook.category} onChange={e=>setNewBook(p=>({...p,category:e.target.value}))}>{cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={B.label}>Price (0 = free)</label><input style={B.inp} type="number" min="0" step="0.01" value={newBook.price} onChange={e=>setNewBook(p=>({...p,price:e.target.value,is_free:parseFloat(e.target.value)===0}))}/></div>
              </div>
              <div style={{marginBottom:12}}><label style={B.label}>Description</label><textarea style={{...B.ta,minHeight:70}} value={newBook.description} onChange={e=>setNewBook(p=>({...p,description:e.target.value}))} placeholder="What is this book about?"/></div>
              <UploadField label="Cover Image" accept="image/jpeg,image/png,image/webp" value={newBook.cover_url} onUrl={u=>setNewBook(p=>({...p,cover_url:u}))} uid={user?.id||'upload'} folder="book-covers" type="image"/>
              <UploadField label="Book File (PDF)" accept="application/pdf" value={newBook.file_url} onUrl={u=>setNewBook(p=>({...p,file_url:u}))} uid={user?.id||'upload'} folder="books" type="pdf"/>
              <div style={{display:'flex',gap:8,marginTop:8}}><button style={B.btn('primary')} onClick={submitBook}>Upload Book</button><button style={B.btn('ghost')} onClick={()=>setUploadBook(false)}>Cancel</button></div>
            </div>
          )}
          <div style={B.grid}>
            {books.map((b:any)=>(
              <div key={b.id} style={B.card}>
                <div style={{height:160,background:`${gc(b.category||'Default')}18`,position:'relative',overflow:'hidden'}}>
                  {b.cover_url?<img src={b.cover_url} alt={b.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52}}>📖</div>}
                  <div style={{position:'absolute',top:8,right:8}}><span style={{...B.badge(b.is_free?'#10b981':'#f59e0b'),fontSize:10}}>{b.is_free?'FREE':'$'+b.price}</span></div>
                </div>
                <div style={{padding:'12px 14px'}}>
                  <span style={B.badge(gc(b.category||'Default'))}>{b.category}</span>
                  <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',margin:'8px 0 4px',lineHeight:1.3}}>{b.title}</div>
                  <div style={{fontSize:11,color:'#64748b',marginBottom:10}}>by {b.author}</div>
                  <div style={{display:'flex',gap:8}}>
                    {(b.file_url||b.file_path)&&<button onClick={()=>setView({type:'book-reader',book:b})} style={{...B.btn('primary'),flex:1,padding:'7px',fontSize:12}}>Read Now</button>}
                    {(b.file_url||b.file_path)&&<a href={b.file_url||(STORAGE_URL+(b.file_path||''))} target="_blank" rel="noreferrer" style={{...B.btn('ghost'),padding:'7px 12px',fontSize:12,textDecoration:'none'}}>↓</a>}
                    {!b.file_url&&!b.file_path&&<button style={{...B.btn('ghost'),flex:1,padding:'7px',fontSize:12,opacity:0.5}} disabled>Coming Soon</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='my-learning'&&(
        <div style={{padding:'16px 24px 80px'}}>
          {enrollments.length===0?(
            <div style={{textAlign:'center',padding:60,color:'#475569'}}><div style={{fontSize:44,marginBottom:12}}>📚</div><div style={{marginBottom:16}}>No courses enrolled yet</div><button style={{...B.btn('primary'),marginTop:8}} onClick={()=>setTab('courses')}>Browse Courses</button></div>
          ):(
            <div style={B.grid}>
              {enrollments.map(e=>{
                const c=courses.find(co=>co.id===e.course_id);if(!c)return null;
                return(
                  <div key={e.course_id} style={{...B.card,cursor:'pointer'}} onClick={()=>setView({type:'course',course:c})}>
                    <div style={{height:120,background:`${gc(c.category)}18`,position:'relative',overflow:'hidden'}}>
                      {c.thumbnail_url?<img src={c.thumbnail_url} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>{gi(c.category)}</div>}
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:'rgba(0,0,0,0.4)'}}><div style={{height:'100%',width:`${e.progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)'}}/></div>
                    </div>
                    <div style={{padding:'12px 14px'}}>
                      <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',marginBottom:4}}>{c.title}</div>
                      <div style={{fontSize:12,color:'#64748b',marginBottom:8}}>{e.progress}% complete</div>
                      <button style={{...B.btn('primary'),width:'100%',padding:'7px',fontSize:12}}>Continue →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
