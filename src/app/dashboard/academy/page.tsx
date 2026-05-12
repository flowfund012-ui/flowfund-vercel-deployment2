'use client';
import{useState,useEffect}from'react';
import{getLangFromStorage}from'../../../lib/i18n';
import{sb,gc,gi,WaveLogo,B,ArticleDetail,LessonViewer,CreatorStudio}from'./components';

function CourseDetail({course,user,onBack,onEnroll,showToast}:{course:any,user:any,onBack:()=>void,onEnroll:(c:any)=>void,showToast:(m:string)=>void}){
  const[reviews,setReviews]=useState<any[]>([]);
  const[myR,setMyR]=useState({rating:5,comment:''});
  const[hasR,setHasR]=useState(false);
  const[lessons,setLessons]=useState<any[]>([]);
  useEffect(()=>{
    sb.from('academy_lessons').select('id,title,type,duration_seconds,is_free_preview,order_index').eq('course_id',course.id).order('order_index').then(({data})=>setLessons(data||[]));
    sb.from('academy_reviews').select('*').eq('course_id',course.id).order('created_at',{ascending:false}).then(({data})=>setReviews(data||[]));
    if(user)sb.from('academy_reviews').select('id').eq('course_id',course.id).eq('user_id',user.id).then(({data})=>setHasR((data||[]).length>0));
  },[]);
  async function submitReview(){
    if(!user){showToast('Login to review');return;}
    await sb.from('academy_reviews').upsert({course_id:course.id,user_id:user.id,...myR},{onConflict:'course_id,user_id'});
    showToast('Review submitted!');setHasR(true);
    sb.from('academy_reviews').select('*').eq('course_id',course.id).order('created_at',{ascending:false}).then(({data})=>setReviews(data||[]));
  }
  const avg=reviews.length?Math.round((reviews.reduce((s:number,r:any)=>s+r.rating,0)/reviews.length)*10)/10:0;
  return(
    <div style={{...B.wrap,paddingBottom:80}}>
      <div style={{background:'linear-gradient(135deg,#0a1628,#0d1f3c)',padding:'28px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <button style={B.back} onClick={onBack}>← Back to Courses</button>
        <span style={B.badge(gc(course.category))}>{course.category}</span>
        <h1 style={{fontSize:26,fontWeight:800,margin:'10px 0 8px',color:'#f1f5f9',lineHeight:1.3}}>{course.title}</h1>
        <p style={{fontSize:14,color:'#94a3b8',lineHeight:1.7,marginBottom:14}}>{course.description}</p>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',fontSize:13,color:'#64748b',marginBottom:16}}>
          <span>👤 {course.instructor_name}</span><span>📊 {course.level}</span><span>🌐 {course.language||'English'}</span>
          {avg>0&&<span style={{color:'#f59e0b'}}>★ {avg} ({reviews.length} reviews)</span>}
          {course.total_enrollments>0&&<span>👥 {course.total_enrollments} students</span>}
        </div>
        <button style={{...B.btn('primary'),padding:'13px 32px',fontSize:14}} onClick={()=>onEnroll(course)}>
          {course.enrolled?'Continue Learning →':course.is_free?'Enroll Free':'Enroll — $'+course.price}
        </button>
      </div>
      <div style={{maxWidth:820,margin:'0 auto',padding:'20px 24px 0'}}>
        {(course.what_you_learn||[]).length>0&&(
          <div style={{background:'rgba(26,107,255,0.05)',border:'1px solid rgba(26,107,255,0.15)',borderRadius:12,padding:18,marginBottom:20}}>
            <h3 style={{color:'#e2e8f0',marginBottom:12,fontWeight:800}}>What you'll learn</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8}}>
              {(course.what_you_learn||[]).map((item:string,i:number)=>(
                <div key={i} style={{display:'flex',gap:7,fontSize:13,color:'#94a3b8'}}><span style={{color:'#10b981',flexShrink:0}}>✓</span>{item}</div>
              ))}
            </div>
          </div>
        )}
        <h3 style={{color:'#e2e8f0',marginBottom:12,fontWeight:800}}>Course Content ({lessons.length} lessons)</h3>
        <div style={{border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,overflow:'hidden',marginBottom:20}}>
          {lessons.length===0&&<div style={{padding:20,color:'#475569',textAlign:'center',fontSize:14}}>No lessons added yet</div>}
          {lessons.map((l:any,i:number)=>(
            <div key={l.id} style={{padding:'11px 16px',borderBottom:i<lessons.length-1?'1px solid rgba(255,255,255,0.04)':'none',display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:26,height:26,borderRadius:'50%',background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#64748b',flexShrink:0}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:'#e2e8f0'}}>{l.title}</div>
                <div style={{fontSize:11,color:'#64748b',marginTop:1}}>{l.type==='video'?'▶ Video':l.type==='quiz'?'📝 Quiz':'📄 Reading'}{l.duration_seconds?` · ${Math.round(l.duration_seconds/60)}min`:''}</div>
              </div>
              {l.is_free_preview&&<span style={{...B.badge('#10b981'),fontSize:10}}>Preview</span>}
            </div>
          ))}
        </div>
        {(course.requirements||[]).length>0&&(
          <div style={{marginBottom:20}}>
            <h3 style={{color:'#e2e8f0',marginBottom:10,fontWeight:800}}>Requirements</h3>
            {(course.requirements||[]).map((r:string,i:number)=><div key={i} style={{fontSize:13,color:'#94a3b8',marginBottom:5,paddingLeft:10,borderLeft:'2px solid rgba(255,255,255,0.08)'}}>• {r}</div>)}
          </div>
        )}
        <div style={{marginBottom:20}}>
          <h3 style={{color:'#e2e8f0',marginBottom:14,fontWeight:800}}>Reviews{avg>0&&<span style={{color:'#f59e0b',fontWeight:400,fontSize:15}}> ★ {avg}</span>}</h3>
          {!hasR&&user&&(
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:14,marginBottom:14}}>
              <label style={B.label}>Your Rating</label>
              <div style={{display:'flex',gap:5,marginBottom:10}}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>setMyR(p=>({...p,rating:n}))} style={{fontSize:22,cursor:'pointer',opacity:myR.rating>=n?1:0.3}}>★</span>)}</div>
              <textarea style={{...B.ta,minHeight:68}} placeholder="Share your experience..." value={myR.comment} onChange={e=>setMyR(p=>({...p,comment:e.target.value}))}/>
              <button style={{...B.btn('primary'),marginTop:8}} onClick={submitReview}>Submit Review</button>
            </div>
          )}
          {reviews.map((r:any)=>(
            <div key={r.id} style={{padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{(r.reviewer_name||r.user_id||'?')[0].toUpperCase()}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:'#e2e8f0'}}>{r.reviewer_name||'Student'}</div><div style={{color:'#f59e0b',fontSize:12}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div></div>
                <span style={{marginLeft:'auto',fontSize:11,color:'#475569'}}>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.comment&&<p style={{fontSize:13,color:'#94a3b8',margin:'0 0 0 38px'}}>{r.comment}</p>}
            </div>
          ))}
          {reviews.length===0&&<div style={{fontSize:13,color:'#475569',padding:'10px 0'}}>No reviews yet. Be the first!</div>}
        </div>
      </div>
    </div>
  );
}

export default function AcademyPage(){
  const[user,setUser]=useState<any>(null);
  const[creatorProfile,setCreatorProfile]=useState<any>(null);
  const[tab,setTab]=useState<'courses'|'articles'|'books'|'my-learning'>('courses');
  const[courses,setCourses]=useState<any[]>([]);
  const[articles,setArticles]=useState<any[]>([]);
  const[books,setBooks]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState('');
  const[catFilter,setCatFilter]=useState('All');
  const[viewCourse,setViewCourse]=useState<any>(null);
  const[viewLesson,setViewLesson]=useState<any>(null);
  const[viewArticle,setViewArticle]=useState<any>(null);
  const[showCreator,setShowCreator]=useState(false);
  const[toast,setToast]=useState('');
  const[writingArticle,setWritingArticle]=useState(false);
  const[af,setAf]=useState({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});
  const[lessonList,setLessonList]=useState<any[]>([]);
  const[activeLesson,setActiveLesson]=useState<any>(null);

  useEffect(()=>{
    getLangFromStorage();
    sb.auth.getUser().then(({data})=>{
      setUser(data.user);loadAll(data.user?.id);
      if(data.user)sb.from('academy_creator_profiles').select('*').eq('user_id',data.user.id).single().then(({data:p})=>setCreatorProfile(p));
    });
  },[]);

  async function loadAll(uid?:string){
    setLoading(true);
    const[{data:c},{data:a},{data:b}]=await Promise.all([
      sb.from('academy_courses').select('*').eq('is_published',true).order('created_at',{ascending:false}),
      sb.from('academy_articles').select('*').order('created_at',{ascending:false}),
      sb.from('academy_books').select('*').order('title'),
    ]);
    if(uid&&c){
      const{data:enr}=await sb.from('academy_enrollments').select('course_id,progress,last_lesson_id').eq('user_id',uid);
      const em:any=Object.fromEntries((enr||[]).map((e:any)=>[e.course_id,{progress:e.progress||0}]));
      setCourses(c.map((x:any)=>({...x,...(em[x.id]||{}),enrolled:!!em[x.id]})));
    }else setCourses(c||[]);
    setArticles(a||[]);setBooks(b||[]);setLoading(false);
  }

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),3500);}

  async function handleEnroll(course:any){
    if(!user){showToast('Please log in first');return;}
    if(!course.enrolled){
      await sb.from('academy_enrollments').upsert({user_id:user.id,course_id:course.id,progress:0},{onConflict:'user_id,course_id'});
      await sb.from('academy_courses').update({total_enrollments:(course.total_enrollments||0)+1}).eq('id',course.id);
      showToast('Enrolled! Opening course...');
      await loadAll(user?.id);
    }
    const{data:ls}=await sb.from('academy_lessons').select('*').eq('course_id',course.id).order('order_index');
    setLessonList(ls||[]);
    const updated=courses.find((c2:any)=>c2.id===course.id)||course;
    setViewLesson({...updated,enrolled:true});
    setActiveLesson(ls?.[0]||null);
    setViewCourse(null);
  }

  async function handleComplete(lesson:any){
    if(!user||!viewLesson)return;
    const idx=lessonList.findIndex((l:any)=>l.id===lesson.id);
    const progress=Math.round(((idx+1)/lessonList.length)*100);
    await sb.from('academy_enrollments').update({progress,last_lesson_id:lesson.id}).eq('user_id',user.id).eq('course_id',viewLesson.id);
    if(progress===100){
      await sb.from('academy_certificates').upsert({user_id:user.id,course_id:viewLesson.id},{onConflict:'user_id,course_id'});
      showToast('🎉 Course complete! Certificate earned!');
    }else{showToast('Lesson complete!');const next=lessonList[idx+1];if(next)setActiveLesson(next);}
    setViewLesson((p:any)=>p?{...p,progress}:p);loadAll(user?.id);
  }

  async function submitArticle(){
    if(!user){showToast('Log in first');return;}
    if(!af.title||!af.content){showToast('Fill title and content');return;}
    await sb.from('academy_articles').insert({...af,tags:af.tags.split(',').map((s:string)=>s.trim()).filter(Boolean),author_name:creatorProfile?.display_name||user.email?.split('@')[0]||'Student',user_id:user.id,read_time:Math.ceil(af.content.split(' ').length/200)});
    showToast('Article published!');setWritingArticle(false);setAf({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});loadAll(user?.id);
  }

  const cats=['All','Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];
  const filtered=(tab==='courses'?courses:tab==='articles'?articles:books).filter((x:any)=>{
    const ms=!search||(x.title||'').toLowerCase().includes(search.toLowerCase())||(x.description||x.content||'').toLowerCase().includes(search.toLowerCase());
    return ms&&(catFilter==='All'||x.category===catFilter);
  });
  const myCourses=courses.filter((c:any)=>c.enrolled);

  if(loading)return(<div style={{...B.wrap,display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div style={{textAlign:'center'}}><WaveLogo size={48}/><p style={{color:'#64748b',marginTop:14}}>Loading Academy...</p></div></div>);
  if(viewLesson&&activeLesson!==undefined)return(<LessonViewer course={viewLesson} lessons={lessonList} activeLesson={activeLesson} setActiveLesson={setActiveLesson} user={user} onBack={()=>{setViewLesson(null);loadAll(user?.id);}} onComplete={handleComplete}/>);
  if(showCreator)return(<CreatorStudio user={user} profile={creatorProfile} onBack={()=>{setShowCreator(false);loadAll(user?.id);}} showToast={showToast}/>);
  if(viewCourse)return(<CourseDetail course={viewCourse} user={user} onBack={()=>setViewCourse(null)} onEnroll={handleEnroll} showToast={showToast}/>);
  if(viewArticle)return(<ArticleDetail article={viewArticle} user={user} onBack={()=>setViewArticle(null)}/>);

  return(
    <div style={{...B.wrap,paddingBottom:80}}>
      {toast&&<div style={B.toast}>{toast}</div>}
      <div style={B.hdr}>
        <WaveLogo size={28}/><h1 style={B.title}>Academy</h1>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {user&&(
            <div style={{background:'rgba(255,255,255,0.04)',borderRadius:8,display:'flex',padding:2,gap:2}}>
              <button onClick={()=>setShowCreator(false)} style={{padding:'5px 12px',borderRadius:6,border:'none',cursor:'pointer',fontWeight:600,fontSize:12,background:!showCreator?'rgba(26,107,255,0.2)':'transparent',color:!showCreator?'#1a6bff':'#64748b'}}>Student</button>
              <button onClick={()=>setShowCreator(true)} style={{padding:'5px 12px',borderRadius:6,border:'none',cursor:'pointer',fontWeight:600,fontSize:12,background:'transparent',color:'#64748b'}}>🎬 Creator</button>
            </div>
          )}
          {user&&<div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13}}>{(creatorProfile?.display_name||user.email||'?')[0].toUpperCase()}</div>}
        </div>
      </div>
      <div style={{display:'flex',gap:10,padding:'14px 24px',overflowX:'auto'}}>
        {[['📚',courses.length,'Courses'],['📖',myCourses.length,'Enrolled'],['✍',articles.length,'Articles'],['📕',books.length,'Books']].map(([ico,val,lbl])=>(
          <div key={lbl as string} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'10px 16px',flexShrink:0,textAlign:'center',minWidth:80}}>
            <div style={{fontSize:16}}>{ico}</div>
            <div style={{fontSize:20,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{val}</div>
            <div style={{fontSize:11,color:'#64748b'}}>{lbl}</div>
          </div>
        ))}
      </div>
      <div style={B.tabs}>
        {(['courses','articles','books','my-learning']as const).map(t=><button key={t} style={B.tab(tab===t)} onClick={()=>setTab(t)}>{t==='courses'?'Courses':t==='articles'?'Articles':t==='books'?'Books':'My Learning'}</button>)}
      </div>
      <div style={{display:'flex',gap:10,padding:'12px 24px 0',alignItems:'center'}}>
        <input style={{...B.inp,flex:1,maxWidth:380}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {tab==='articles'&&<button style={B.btn('primary')} onClick={()=>setWritingArticle(v=>!v)}>+ Write</button>}
      </div>
      <div style={{display:'flex',gap:6,padding:'10px 24px 0',flexWrap:'wrap'}}>
        {cats.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:'5px 12px',borderRadius:16,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:catFilter===c?'rgba(26,107,255,0.2)':'rgba(255,255,255,0.04)',color:catFilter===c?'#1a6bff':'#64748b'}}>{c}</button>)}
      </div>
      {writingArticle&&tab==='articles'&&(
        <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,margin:'12px 24px 0',padding:18}}>
          <h3 style={{color:'#e2e8f0',marginBottom:14}}>Write an Article</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:10}}>
            <div><label style={B.label}>Title</label><input style={B.inp} value={af.title} onChange={e=>setAf(p=>({...p,title:e.target.value}))}/></div>
            <div><label style={B.label}>Category</label><select style={B.inp} value={af.category} onChange={e=>setAf(p=>({...p,category:e.target.value}))}>{cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{marginBottom:10}}><label style={B.label}>Tags (comma separated)</label><input style={B.inp} placeholder="e.g. saving, tips" value={af.tags} onChange={e=>setAf(p=>({...p,tags:e.target.value}))}/></div>
          <div style={{marginBottom:10}}><label style={B.label}>Cover Image URL (optional)</label><input style={B.inp} placeholder="https://..." value={af.cover_url} onChange={e=>setAf(p=>({...p,cover_url:e.target.value}))}/></div>
          <div style={{marginBottom:14}}><label style={B.label}>Content</label><textarea style={{...B.ta,minHeight:160}} value={af.content} onChange={e=>setAf(p=>({...p,content:e.target.value}))}/></div>
          <div style={{display:'flex',gap:8}}><button style={B.btn('primary')} onClick={submitArticle}>Publish</button><button style={B.btn('ghost')} onClick={()=>setWritingArticle(false)}>Cancel</button></div>
        </div>
      )}
      {tab==='my-learning'&&(
        <div style={B.grid}>
          {myCourses.length===0?(
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:44,color:'#475569'}}>
              <div style={{fontSize:40,marginBottom:12}}>📚</div><div style={{marginBottom:14}}>No courses enrolled yet</div>
              <button style={B.btn('primary')} onClick={()=>setTab('courses')}>Browse Courses</button>
            </div>
          ):myCourses.map((c:any)=>(
            <div key={c.id} style={B.card} onClick={()=>handleEnroll(c)}>
              <div style={{height:120,background:`linear-gradient(135deg,${gc(c.category)}22,${gc(c.category)}44)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>{gi(c.category)}</div>
              <div style={{padding:14}}>
                <span style={B.badge(gc(c.category))}>{c.category}</span>
                <div style={{fontWeight:700,color:'#e2e8f0',margin:'7px 0 3px',fontSize:14,lineHeight:1.3}}>{c.title}</div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:7}}>{c.instructor_name}</div>
                <div style={{fontSize:11,color:'#64748b',marginBottom:3}}>{c.progress||0}% complete</div>
                <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2}}><div style={{height:'100%',width:`${c.progress||0}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2}}/></div>
                <button style={{...B.btn('primary'),width:'100%',marginTop:10,padding:'8px'}}>Continue →</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='courses'&&(
        <div style={B.grid}>
          {filtered.length===0?<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#475569'}}>No courses found</div>
          :filtered.map((c:any)=>(
            <div key={c.id} style={B.card} onClick={()=>setViewCourse(c)}>
              <div style={{height:130,background:`linear-gradient(135deg,${gc(c.category)}22,${gc(c.category)}44)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>{gi(c.category)}</div>
              <div style={{padding:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                  <span style={B.badge(gc(c.category))}>{c.category}</span>
                  <span style={{fontSize:11,color:'#64748b'}}>{c.level}</span>
                </div>
                <div style={{fontWeight:700,color:'#e2e8f0',marginBottom:5,fontSize:14,lineHeight:1.4}}>{c.title}</div>
                <div style={{fontSize:12,color:'#64748b',lineHeight:1.5,marginBottom:8,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{c.description}</div>
                <div style={{fontSize:11,color:'#475569',marginBottom:8}}>👤 {c.instructor_name}{c.rating&&` · ★${c.rating}`}{c.total_enrollments>0&&` · ${c.total_enrollments} students`}</div>
                {c.enrolled&&<><div style={{fontSize:11,color:'#64748b',marginBottom:3}}>{c.progress||0}% complete</div><div style={{height:3,background:'rgba(255,255,255,0.08)',borderRadius:2,marginBottom:8}}><div style={{height:'100%',width:`${c.progress||0}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2}}/></div></>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:800,color:c.is_free?'#10b981':'#e2e8f0',fontSize:14}}>{c.is_free?'Free':`$${c.price}`}</span>
                  <button style={{...B.btn(c.enrolled?'ghost':'primary'),padding:'6px 14px',fontSize:12}} onClick={e=>{e.stopPropagation();c.enrolled?handleEnroll(c):setViewCourse(c);}}>{c.enrolled?'Continue':'View'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='articles'&&(
        <div style={{padding:'12px 24px 80px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
          {filtered.length===0?<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#475569'}}>No articles yet. Write the first one!</div>
          :filtered.map((a:any)=>(
            <div key={a.id} style={{...B.card,cursor:'pointer'}} onClick={()=>setViewArticle(a)}>
              {a.cover_url&&<img src={a.cover_url} alt="" style={{width:'100%',height:120,objectFit:'cover'}}/>}
              <div style={{padding:14}}>
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
                  <span style={B.badge(gc(a.category))}>{a.category}</span>
                  {(a.tags||[]).slice(0,2).map((t:string)=><span key={t} style={{...B.badge('#475569'),fontSize:10}}>{t}</span>)}
                </div>
                <h3 style={{fontWeight:700,color:'#e2e8f0',marginBottom:7,lineHeight:1.4,fontSize:14}}>{a.title}</h3>
                <p style={{fontSize:12,color:'#64748b',lineHeight:1.6,marginBottom:10,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical'}}>{a.content}</p>
                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:11,color:'#475569'}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0}}>{(a.author_name||'?')[0].toUpperCase()}</div>
                  <span>{a.author_name}</span>{a.read_time&&<span>· {a.read_time}min</span>}
                  <span style={{marginLeft:'auto'}}>❤ {a.likes||0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='books'&&(
        <div style={B.grid}>
          {filtered.length===0?<div style={{gridColumn:'1/-1',textAlign:'center',padding:40,color:'#475569'}}>No books yet</div>
          :filtered.map((bk:any)=>(
            <div key={bk.id} style={B.card}>
              <div style={{height:160,background:`linear-gradient(135deg,${gc(bk.category)}33,${gc(bk.category)}55)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:52}}>{gi(bk.category)}</div>
              <div style={{padding:14}}>
                <span style={B.badge(gc(bk.category))}>{bk.category}</span>
                <div style={{fontWeight:700,color:'#e2e8f0',margin:'7px 0 3px',fontSize:14}}>{bk.title}</div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:7}}>{bk.author}</div>
                <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.5,marginBottom:10,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{bk.description}</div>
                <span style={{fontWeight:800,color:bk.is_free?'#10b981':'#e2e8f0',display:'block',marginBottom:8}}>{bk.is_free?'Free':`$${bk.price}`}</span>
                <button style={{...B.btn('primary'),width:'100%',padding:'8px'}} onClick={()=>{if(bk.file_url)window.open(bk.file_url,'_blank');else showToast('Coming soon');}}>{bk.is_free?'Download Free':'Buy & Download'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}