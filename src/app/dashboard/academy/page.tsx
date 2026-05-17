'use client';
export const dynamic='force-dynamic';
import{useState,useEffect,useRef}from'react';
import{createClient}from'@supabase/supabase-js';
import{B,sb,gc,gi,doUpload,UploadField,ArticleDetail,BookReader,LessonViewer,CreatorStudio,WaveLogo,STORAGE_URL}from'./components';
const DB=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const STARS=(n:number,total=5)=>Array.from({length:total},(_,i)=><span key={i} style={{color:i<Math.round(n)?'#f59e0b':'#334155',fontSize:14}}>★</span>);

function SearchBar({value,onChange}:{value:string,onChange:(v:string)=>void}){
  return <div style={{position:'relative',flex:1,minWidth:200}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#475569',fontSize:14}}>🔍</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder="Search courses, articles, books..." style={{...B.inp,paddingLeft:36,background:'rgba(255,255,255,0.05)'}}/></div>;
}

function CourseDetailPage({course,user,onEnroll,onContinue,enrollment,onBack}:{course:any,user:any,onEnroll:()=>void,onContinue:()=>void,enrollment:any,onBack:()=>void}){
  const[lessons,setLessons]=useState<any[]>([]);
  const[reviews,setReviews]=useState<any[]>([]);
  const[myRating,setMyRating]=useState(0);
  const[myReview,setMyReview]=useState('');
  const[submitting,setSubmitting]=useState(false);
  const[instructor,setInstructor]=useState<any>(null);
  useEffect(()=>{
    DB.from('academy_lessons').select('*').eq('course_id',course.id).order('order_index').then(({data})=>setLessons(data||[]));
    DB.from('academy_reviews').select('*').eq('course_id',course.id).order('created_at',{ascending:false}).then(({data})=>setReviews(data||[]));
    if(course.instructor_id)DB.from('academy_creator_profiles').select('*').eq('user_id',course.instructor_id).maybeSingle().then(({data})=>setInstructor(data));
  },[course.id]);
  async function submitReview(){
    if(!user||!myRating){return;}
    setSubmitting(true);
    await DB.from('academy_reviews').upsert({course_id:course.id,user_id:user.id,rating:myRating,comment:myReview},{onConflict:'course_id,user_id'});
    const{data}=await DB.from('academy_reviews').select('*').eq('course_id',course.id).order('created_at',{ascending:false});
    setReviews(data||[]);
    const avg=((data||[]).reduce((s:number,r:any)=>s+r.rating,0)/(data||[]).length)||0;
    await DB.from('academy_courses').update({avg_rating:Math.round(avg*10)/10,total_reviews:(data||[]).length}).eq('id',course.id);
    setSubmitting(false);setMyReview('');
  }
  const ltype=(l:any)=>l.lesson_type||'text';
  return(<div style={{...B.wrap,paddingBottom:80}}>
    <div style={B.hdr}><button style={{...B.back,padding:0}} onClick={onBack}>← Back</button><h2 style={{...B.title,fontSize:16,margin:0,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{course.title}</h2></div>
    {/* Hero */}
    <div style={{background:`linear-gradient(135deg,${gc(course.category)}22,rgba(0,0,0,0))`,borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'24px'}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
          <span style={B.badge(gc(course.category))}>{course.category}</span>
          <span style={B.badge('#475569')}>{course.level}</span>
          <span style={B.badge('#475569')}>{course.language||'English'}</span>
          {course.is_free?<span style={B.badge('#10b981')}>FREE</span>:<span style={B.badge('#f59e0b')}>${course.price}</span>}
        </div>
        <h1 style={{fontSize:24,fontWeight:800,color:'#f1f5f9',lineHeight:1.3,marginBottom:8}}>{course.title}</h1>
        <p style={{color:'#94a3b8',marginBottom:12,lineHeight:1.6}}>{course.description}</p>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',fontSize:13,color:'#64748b',marginBottom:16}}>
          <span>👥 {course.total_enrollments||0} students</span>
          <span>📚 {course.total_lessons||lessons.length} lessons</span>
          {course.avg_rating>0&&<span style={{color:'#f59e0b'}}>★ {course.avg_rating} ({reviews.length} reviews)</span>}
          <span>🌐 {course.language||'English'}</span>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          {enrollment
            ?<button onClick={onContinue} style={{...B.btn('primary'),padding:'12px 28px',fontSize:15}}>Continue Learning ({enrollment.progress}%)</button>
            :<button onClick={onEnroll} style={{...B.btn('primary'),padding:'12px 28px',fontSize:15}}>{course.is_free?'Enroll Free':'Enroll Now'}</button>}
          {enrollment&&enrollment.progress>=100&&<span style={{color:'#10b981',fontWeight:700}}>✓ Completed</span>}
        </div>
      </div>
    </div>
    <div style={{maxWidth:800,margin:'0 auto',padding:'20px 24px'}}>
      {/* Instructor */}
      {(instructor||course.instructor_name)&&<div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:16,marginBottom:20,display:'flex',gap:14,alignItems:'center'}}>
        <div style={{width:52,height:52,borderRadius:'50%',overflow:'hidden',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,flexShrink:0}}>
          {instructor?.avatar_url?<img src={instructor.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(course.instructor_name||'I')[0].toUpperCase()}
        </div>
        <div>
          <div style={{fontWeight:700,color:'#e2e8f0'}}>{instructor?.display_name||course.instructor_name}</div>
          {instructor?.tagline&&<div style={{fontSize:12,color:'#64748b',marginTop:2}}>{instructor.tagline}</div>}
          {instructor?.bio&&<div style={{fontSize:12,color:'#94a3b8',marginTop:4,lineHeight:1.5}}>{instructor.bio}</div>}
        </div>
      </div>}
      {/* What you'll learn */}
      {(course.what_you_learn||[]).length>0&&<div style={{marginBottom:20}}>
        <h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>What you'll learn</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {(course.what_you_learn||[]).map((item:string,i:number)=><div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:13,color:'#cbd5e1'}}><span style={{color:'#10b981',flexShrink:0,marginTop:1}}>✓</span>{item}</div>)}
        </div>
      </div>}
      {/* Requirements */}
      {(course.requirements||[]).length>0&&<div style={{marginBottom:20}}>
        <h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:10}}>Requirements</h3>
        {(course.requirements||[]).map((r:string,i:number)=><div key={i} style={{fontSize:13,color:'#94a3b8',marginBottom:4}}>• {r}</div>)}
      </div>}
      {/* Curriculum */}
      <div style={{marginBottom:24}}>
        <h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>Course Content ({lessons.length} lessons)</h3>
        <div style={{border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,overflow:'hidden'}}>
          {lessons.map((l:any,i:number)=>(
            <div key={l.id} style={{padding:'12px 16px',borderBottom:i<lessons.length-1?'1px solid rgba(255,255,255,0.05)':'none',display:'flex',alignItems:'center',gap:12,background:i%2===0?'rgba(255,255,255,0.01)':'transparent'}}>
              <span style={{width:24,height:24,borderRadius:'50%',background:'rgba(26,107,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#1a6bff',fontWeight:700,flexShrink:0}}>{i+1}</span>
              <span style={{fontSize:11,color:ltype(l)==='video'?'#1a6bff':ltype(l)==='quiz'?'#8b5cf6':'#10b981',flexShrink:0}}>{ltype(l)==='video'?'▶':ltype(l)==='quiz'?'📝':'📄'}</span>
              <span style={{flex:1,fontSize:13,color:'#cbd5e1'}}>{l.title}</span>
              {l.is_free_preview&&<span style={{fontSize:10,color:'#10b981',background:'rgba(16,185,129,0.1)',padding:'2px 7px',borderRadius:4}}>Preview</span>}
            </div>
          ))}
        </div>
      </div>
      {/* Reviews */}
      <div style={{marginBottom:24}}>
        <h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>Reviews {reviews.length>0&&`(${reviews.length})`}</h3>
        {user&&enrollment&&<div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontWeight:700,color:'#e2e8f0',marginBottom:10,fontSize:14}}>Leave a Review</div>
          <div style={{display:'flex',gap:6,marginBottom:12}}>{[1,2,3,4,5].map(s=><button key={s} onClick={()=>setMyRating(s)} style={{background:'none',border:'none',cursor:'pointer',fontSize:28,color:s<=myRating?'#f59e0b':'#334155',padding:2,lineHeight:1}}>★</button>)}</div>
          <textarea style={{...B.ta,minHeight:70,marginBottom:10}} value={myReview} onChange={e=>setMyReview(e.target.value)} placeholder="Share your experience with this course..."/>
          <button style={{...B.btn('primary'),padding:'8px 20px',fontSize:13}} onClick={submitReview} disabled={!myRating||submitting}>{submitting?'Submitting...':'Submit Review'}</button>
        </div>}
        {reviews.length===0&&<div style={{color:'#475569',fontSize:13,padding:'20px 0'}}>No reviews yet — be the first!</div>}
        {reviews.map((r:any)=>(
          <div key={r.id} style={{padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>U</div>
              <div><div style={{fontWeight:600,color:'#e2e8f0',fontSize:13}}>Student</div><div style={{display:'flex',gap:2,marginTop:2}}>{STARS(r.rating)}</div></div>
              <span style={{marginLeft:'auto',fontSize:11,color:'#475569'}}>{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            {r.comment&&<div style={{fontSize:13,color:'#94a3b8',lineHeight:1.6,paddingLeft:42}}>{r.comment}</div>}
          </div>
        ))}
      </div>
    </div>
  </div>);}

function StudentProfilePage({user,courses,enrollments,onBack,showToast}:{user:any,courses:any[],enrollments:any[],onBack:()=>void,showToast:(m:string)=>void}){
  const[certs,setCerts]=useState<any[]>([]);
  const[profile,setProfile]=useState<any>(null);
  useEffect(()=>{
    if(!user)return;
    DB.from('academy_certificates').select('*').eq('user_id',user.id).then(({data})=>setCerts(data||[]));
    DB.from('profiles').select('*').eq('id',user.id).maybeSingle().then(({data})=>setProfile(data));
  },[]);
  const completed=enrollments.filter(e=>e.progress>=100);
  const inProgress=enrollments.filter(e=>e.progress>0&&e.progress<100);
  return(<div style={{...B.wrap,paddingBottom:80}}>
    <div style={B.hdr}><button style={{...B.back,padding:0}} onClick={onBack}>← Back</button><h2 style={{...B.title,fontSize:16,margin:0}}>My Profile</h2></div>
    <div style={{maxWidth:700,margin:'0 auto',padding:'24px'}}>
      {/* Profile card */}
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:24,marginBottom:20,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:28,flexShrink:0,overflow:'hidden'}}>
          {profile?.avatar_url?<img src={profile.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>:(user?.email?.[0]||'U').toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:20,fontWeight:800,color:'#f1f5f9'}}>{profile?.full_name||user?.email?.split('@')[0]||'Student'}</div>
          <div style={{fontSize:13,color:'#64748b',marginTop:2}}>{user?.email}</div>
          <div style={{display:'flex',gap:16,marginTop:10,flexWrap:'wrap'}}>
            {[['Enrolled',enrollments.length,'#1a6bff'],['Completed',completed.length,'#10b981'],['Certificates',certs.length,'#f59e0b']].map(([l,v,c])=>(
              <div key={l as string}><div style={{fontSize:20,fontWeight:800,color:c as string}}>{v}</div><div style={{fontSize:11,color:'#64748b'}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
      {/* In Progress */}
      {inProgress.length>0&&<><h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>In Progress</h3>
      <div style={{display:'grid',gap:10,marginBottom:20}}>
        {inProgress.map(e=>{const c=courses.find(co=>co.id===e.course_id);if(!c)return null;return(
          <div key={e.course_id} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:14,display:'flex',gap:12,alignItems:'center'}}>
            <div style={{width:44,height:44,borderRadius:8,overflow:'hidden',background:`${gc(c.category)}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:20}}>
              {c.thumbnail_url?<img src={c.thumbnail_url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>:gi(c.category)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,color:'#e2e8f0',fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div>
              <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:2,marginTop:6}}><div style={{height:'100%',width:`${e.progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2}}/></div>
              <div style={{fontSize:11,color:'#64748b',marginTop:3}}>{e.progress}% complete</div>
            </div>
          </div>
        );})}
      </div></>}
      {/* Completed */}
      {completed.length>0&&<><h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>Completed Courses</h3>
      <div style={{display:'grid',gap:10,marginBottom:20}}>
        {completed.map(e=>{const c=courses.find(co=>co.id===e.course_id);if(!c)return null;return(
          <div key={e.course_id} style={{background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:12,padding:14,display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:28,flexShrink:0}}>🏆</span>
            <div><div style={{fontWeight:700,color:'#e2e8f0',fontSize:13}}>{c.title}</div><div style={{fontSize:11,color:'#10b981',marginTop:2}}>✓ Completed</div></div>
          </div>
        );})}
      </div></>}
      {/* Certificates */}
      {certs.length>0&&<><h3 style={{color:'#e2e8f0',fontWeight:800,marginBottom:12}}>Certificates</h3>
      <div style={{display:'grid',gap:10}}>
        {certs.map((cert:any)=>{const c=courses.find(co=>co.id===cert.course_id);return(
          <div key={cert.id} style={{background:'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(108,46,245,0.1))',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:16,display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:32,flexShrink:0}}>🎓</span>
            <div style={{flex:1}}><div style={{fontWeight:800,color:'#f59e0b',fontSize:14}}>Certificate of Completion</div><div style={{color:'#e2e8f0',fontSize:13,marginTop:2}}>{c?.title||'Course'}</div><div style={{fontSize:11,color:'#64748b',marginTop:2}}>{new Date(cert.issued_at||cert.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div></div>
          </div>
        );})}
      </div></>}
      {enrollments.length===0&&<div style={{textAlign:'center',padding:40,color:'#475569'}}><div style={{fontSize:44,marginBottom:12}}>📚</div><div>No courses enrolled yet</div></div>}
    </div>
  </div>);}

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
  const[search,setSearch]=useState('');
  const[isCreator,setIsCreator]=useState(false);
  const[showProfile,setShowProfile]=useState(false);
  const[creatorProfile,setCreatorProfile]=useState<any>(null);
  const[writeArticle,setWriteArticle]=useState(false);
  const[uploadBook,setUploadBook]=useState(false);
  const[newArticle,setNewArticle]=useState({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});
  const[newBook,setNewBook]=useState({title:'',author:'',description:'',category:'Budgeting',is_free:true,price:'0',cover_url:'',file_url:''});
  const[lessons,setLessons]=useState<any[]>([]);
  const[activeLesson,setActiveLesson]=useState<any>(null);
  const cats=['All','Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];
  useEffect(()=>{
    DB.auth.getUser().then(({data})=>{setUser(data.user);if(data.user){DB.from('academy_creator_profiles').select('*').eq('user_id',data.user.id).maybeSingle().then(({data:p})=>setCreatorProfile(p));DB.from('academy_enrollments').select('course_id,progress,completed_at').eq('user_id',data.user.id).then(({data:e})=>setEnrollments(e||[]));}});
    loadCourses();
    DB.from('academy_articles').select('*').eq('is_published',true).order('created_at',{ascending:false}).then(({data})=>setArticles(data||[]));
    DB.from('academy_books').select('*').order('title').then(({data})=>setBooks(data||[]));
  },[]);
  useEffect(()=>{if(view?.type==='lesson'){DB.from('academy_lessons').select('*').eq('course_id',view.course.id).order('order_index').then(({data})=>{setLessons(data||[]);if(data&&data.length>0)setActiveLesson(data[0]);});}},[ view?.type==='lesson'?view.course.id:null]);
  async function loadCourses(){const{data}=await DB.from('academy_courses').select('*').eq('is_published',true).order('created_at',{ascending:false});setCourses(data||[]);}
  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),3500);}
  async function enrollCourse(courseId:string){
    if(!user){showToast('Sign in to enroll');return;}
    await DB.from('academy_enrollments').upsert({user_id:user.id,course_id:courseId,progress:0},{onConflict:'user_id,course_id'});
    const newEnroll={course_id:courseId,progress:0};
    setEnrollments(prev=>[...prev.filter(e=>e.course_id!==courseId),newEnroll]);
    await DB.from('academy_courses').update({total_enrollments:courses.find(c=>c.id===courseId)?.total_enrollments+1||1}).eq('id',courseId);
    showToast('Enrolled! 🎉');
    setView({type:'lesson',course:courses.find(c=>c.id===courseId)});
  }
  async function markComplete(lesson:any,courseId:string){
    if(!user)return;
    const{data:allLessons}=await DB.from('academy_lessons').select('id').eq('course_id',courseId);
    await DB.from('academy_lesson_notes').upsert({user_id:user.id,course_id:courseId,lesson_id:lesson.id,content:''},{onConflict:'user_id,lesson_id'}).catch(()=>{});
    const{data:prog}=await DB.from('academy_progress').select('lesson_id').eq('user_id',user.id).eq('course_id',courseId).catch(()=>({data:[]})) as any;
    const completedIds=new Set(((prog||[])).map((p:any)=>p.lesson_id));completedIds.add(lesson.id);
    await DB.from('academy_progress').upsert({user_id:user.id,course_id:courseId,lesson_id:lesson.id},{onConflict:'user_id,course_id,lesson_id'}).catch(()=>{});
    const pct=Math.round((completedIds.size/(allLessons||[]).length)*100);
    await DB.from('academy_enrollments').update({progress:pct,completed_at:pct>=100?new Date().toISOString():null}).eq('user_id',user.id).eq('course_id',courseId);
    setEnrollments(prev=>prev.map(e=>e.course_id===courseId?{...e,progress:pct}:e));
    if(pct>=100){
      await DB.from('academy_certificates').upsert({user_id:user.id,course_id:courseId,issued_at:new Date().toISOString()},{onConflict:'user_id,course_id'}).catch(()=>{});
      showToast('Course complete! Certificate earned! 🎓');
    }else{const idx=lessons.findIndex(l=>l.id===lesson.id);if(idx>=0&&idx<lessons.length-1)setActiveLesson(lessons[idx+1]);}
  }
  async function submitArticle(){if(!newArticle.title.trim()||!newArticle.content.trim()){showToast('Title and content required');return;}const{error}=await DB.from('academy_articles').insert({...newArticle,author_id:user?.id||null,author_name:user?.email?.split('@')[0]||'Anonymous',tags:newArticle.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),is_published:true,views:0,likes:0});if(error){showToast('Error: '+error.message);return;}showToast('Published!');setWriteArticle(false);setNewArticle({title:'',content:'',category:'Budgeting',tags:'',cover_url:''});DB.from('academy_articles').select('*').eq('is_published',true).order('created_at',{ascending:false}).then(({data})=>setArticles(data||[]));}
  async function submitBook(){if(!newBook.title.trim()){showToast('Title required');return;}const{error}=await DB.from('academy_books').insert({...newBook,author_id:user?.id||null,price:parseFloat(newBook.price)||0,is_published:true,total_downloads:0});if(error){showToast('Error: '+error.message);return;}showToast('Uploaded!');setUploadBook(false);setNewBook({title:'',author:'',description:'',category:'Budgeting',is_free:true,price:'0',cover_url:'',file_url:''});DB.from('academy_books').select('*').order('title').then(({data})=>setBooks(data||[]));}

  const q=search.toLowerCase();
  const filteredCourses=(catFilter==='All'?courses:courses.filter(c=>c.category===catFilter)).filter(c=>!q||(c.title+c.description+(c.instructor_name||'')).toLowerCase().includes(q));
  const filteredArticles=articles.filter(a=>!q||(a.title+a.content+a.author_name).toLowerCase().includes(q));
  const filteredBooks=books.filter(b=>!q||(b.title+(b.author||'')+(b.description||'')).toLowerCase().includes(q));

  if(isCreator)return(<CreatorStudio user={user} supabase={DB} profile={creatorProfile} onBack={()=>{setIsCreator(false);loadCourses();}} showToast={showToast}/>);
  if(showProfile)return(<StudentProfilePage user={user} courses={courses} enrollments={enrollments} onBack={()=>setShowProfile(false)} showToast={showToast}/>);
  if(view?.type==='article')return(<ArticleDetail article={view.article} user={user} onBack={()=>setView(null)}/>);
  if(view?.type==='book-reader')return(<BookReader book={view.book} onBack={()=>setView(null)}/>);
  if(view?.type==='detail'){const enroll=enrollments.find(e=>e.course_id===view.course.id);return(<CourseDetailPage course={view.course} user={user} enrollment={enroll} onEnroll={()=>enrollCourse(view.course.id)} onContinue={()=>setView({type:'lesson',course:view.course})} onBack={()=>setView(null)}/>);}
  if(view?.type==='lesson'){const enrollment=enrollments.find(e=>e.course_id===view.course.id)||{progress:0};return(<LessonViewer course={{...view.course,progress:enrollment.progress}} lessons={lessons} activeLesson={activeLesson} setActiveLesson={setActiveLesson} user={user} onBack={()=>setView(null)} onComplete={(l)=>markComplete(l,view.course.id)}/>);}

  return(<div style={B.wrap}>
    {toast&&<div style={B.toast}>{toast}</div>}
    <div style={{...B.hdr,gap:10,flexWrap:'wrap'}}>
      <WaveLogo size={34}/>
      <h1 style={{...B.title,fontSize:18}}>FlowFund Academy</h1>
      <div style={{flex:1,minWidth:180,display:'flex'}}><SearchBar value={search} onChange={setSearch}/></div>
      <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
        {user&&<button onClick={()=>setShowProfile(true)} style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'#fff'}}>{user.email?.[0]?.toUpperCase()}</button>}
        {user&&<button onClick={()=>setIsCreator(true)} style={{padding:'6px 12px',borderRadius:8,border:'none',background:'rgba(108,46,245,0.15)',color:'#8b5cf6',cursor:'pointer',fontSize:12,fontWeight:700}}>🎬 Creator</button>}
      </div>
    </div>
    <div style={B.tabs}>{(['courses','articles','books','my-learning']as const).map(t=><button key={t} style={B.tab(tab===t)} onClick={()=>setTab(t)}>{t==='my-learning'?'My Learning':t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div>

    {tab==='courses'&&<div style={{padding:'16px 24px 80px'}}>
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {cats.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:'5px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:catFilter===c?gc(c):'rgba(255,255,255,0.05)',color:catFilter===c?'#fff':'#64748b'}}>{c}</button>)}
      </div>
      {search&&<div style={{color:'#64748b',fontSize:13,marginBottom:12}}>{filteredCourses.length} result{filteredCourses.length!==1?'s':''} for "{search}"</div>}
      <div style={B.grid}>{filteredCourses.map((c:any)=>{
        const enroll=enrollments.find(e=>e.course_id===c.id);
        return(<div key={c.id} style={B.card} onClick={()=>setView({type:'detail',course:c})}>
          <div style={{height:140,position:'relative',overflow:'hidden',background:`${gc(c.category)}18`}}>
            {c.thumbnail_url?<img src={c.thumbnail_url} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>{gi(c.category)}</div>}
            <div style={{position:'absolute',top:8,right:8}}><span style={{...B.badge(c.is_free?'#10b981':'#f59e0b'),fontSize:10,background:c.is_free?'#10b98133':'#f59e0b33'}}>{c.is_free?'FREE':'$'+c.price}</span></div>
            {enroll&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:3}}><div style={{height:'100%',width:`${enroll.progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)'}}/></div>}
          </div>
          <div style={{padding:'12px 14px'}}>
            <div style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}><span style={B.badge(gc(c.category))}>{c.category}</span><span style={{fontSize:11,color:'#475569'}}>{c.level}</span></div>
            <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',lineHeight:1.3,marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:11,color:'#64748b',marginBottom:6}}>by {c.instructor_name||'Instructor'} · {c.total_lessons||0} lessons</div>
            {c.avg_rating>0&&<div style={{fontSize:11,color:'#f59e0b',marginBottom:8}}>{'★'.repeat(Math.round(c.avg_rating))} {c.avg_rating} ({c.total_reviews||0})</div>}
            {enroll?<button onClick={e=>{e.stopPropagation();setView({type:'lesson',course:c});}} style={{...B.btn('primary'),width:'100%',padding:'8px',fontSize:12}}>Continue ({enroll.progress}%)</button>
            :<button onClick={e=>{e.stopPropagation();setView({type:'detail',course:c});}} style={{...B.btn('primary'),width:'100%',padding:'8px',fontSize:12}}>View Course</button>}
          </div>
        </div>);
      })}</div>
    </div>}

    {tab==='articles'&&<div style={{padding:'16px 24px 80px'}}>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>{user&&<button onClick={()=>setWriteArticle(v=>!v)} style={{...B.btn('primary'),padding:'8px 16px',fontSize:13}}>{writeArticle?'Cancel':'+ Write'}</button>}</div>
      {writeArticle&&<div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:20,marginBottom:20}}>
        <h3 style={{color:'#e2e8f0',marginBottom:16,fontWeight:800}}>Write Article</h3>
        <div style={{marginBottom:12}}><label style={B.label}>Title</label><input style={B.inp} value={newArticle.title} onChange={e=>setNewArticle(p=>({...p,title:e.target.value}))} placeholder="Article title"/></div>
        <div style={{marginBottom:12}}><label style={B.label}>Category</label><select style={B.inp} value={newArticle.category} onChange={e=>setNewArticle(p=>({...p,category:e.target.value}))}>{cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
        <div style={{marginBottom:12}}><label style={B.label}>Tags (comma separated)</label><input style={B.inp} value={newArticle.tags} onChange={e=>setNewArticle(p=>({...p,tags:e.target.value}))} placeholder="budgeting, savings"/></div>
        <UploadField label="Cover Photo" accept="image/jpeg,image/png,image/webp" value={newArticle.cover_url} onUrl={u=>setNewArticle(p=>({...p,cover_url:u}))} uid={user?.id||'upload'} folder="articles" type="image"/>
        <div style={{marginBottom:12}}><label style={B.label}>Content</label><textarea style={{...B.ta,minHeight:160}} value={newArticle.content} onChange={e=>setNewArticle(p=>({...p,content:e.target.value}))} placeholder="Write your article..."/></div>
        <div style={{display:'flex',gap:8}}><button style={B.btn('primary')} onClick={submitArticle}>Publish</button><button style={B.btn('ghost')} onClick={()=>setWriteArticle(false)}>Cancel</button></div>
      </div>}
      {search&&<div style={{color:'#64748b',fontSize:13,marginBottom:12}}>{filteredArticles.length} result{filteredArticles.length!==1?'s':''} for "{search}"</div>}
      <div style={B.grid}>{filteredArticles.map((a:any)=>(<div key={a.id} style={B.card} onClick={()=>setView({type:'article',article:a})}>
        {a.cover_url?<img src={a.cover_url} alt={a.title} style={{width:'100%',height:120,objectFit:'cover',display:'block'}}/>:<div style={{height:80,background:`${gc(a.category)}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>{gi(a.category)}</div>}
        <div style={{padding:'12px 14px'}}>
          <span style={B.badge(gc(a.category))}>{a.category}</span>
          <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',lineHeight:1.3,margin:'8px 0 4px'}}>{a.title}</div>
          <div style={{fontSize:11,color:'#64748b'}}>by {a.author_name} · {a.read_time||5} min · 👁 {a.views||0} · ❤️ {a.likes||0}</div>
        </div>
      </div>))}</div>
    </div>}

    {tab==='books'&&<div style={{padding:'16px 24px 80px'}}>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>{user&&<button onClick={()=>setUploadBook(v=>!v)} style={{...B.btn('primary'),padding:'8px 16px',fontSize:13}}>{uploadBook?'Cancel':'+ Upload Book'}</button>}</div>
      {uploadBook&&<div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:20,marginBottom:20}}>
        <h3 style={{color:'#e2e8f0',marginBottom:16,fontWeight:800}}>Upload Book</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
          <div><label style={B.label}>Title *</label><input style={B.inp} value={newBook.title} onChange={e=>setNewBook(p=>({...p,title:e.target.value}))} placeholder="Book title"/></div>
          <div><label style={B.label}>Author</label><input style={B.inp} value={newBook.author} onChange={e=>setNewBook(p=>({...p,author:e.target.value}))} placeholder="Author name"/></div>
          <div><label style={B.label}>Category</label><select style={B.inp} value={newBook.category} onChange={e=>setNewBook(p=>({...p,category:e.target.value}))}>{cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={B.label}>Price (0=free)</label><input style={B.inp} type="number" min="0" step="0.01" value={newBook.price} onChange={e=>setNewBook(p=>({...p,price:e.target.value,is_free:parseFloat(e.target.value)===0}))}/></div>
        </div>
        <div style={{marginBottom:12}}><label style={B.label}>Description</label><textarea style={{...B.ta,minHeight:70}} value={newBook.description} onChange={e=>setNewBook(p=>({...p,description:e.target.value}))} placeholder="What is this book about?"/></div>
        <UploadField label="Cover Image" accept="image/jpeg,image/png,image/webp" value={newBook.cover_url} onUrl={u=>setNewBook(p=>({...p,cover_url:u}))} uid={user?.id||'upload'} folder="book-covers" type="image"/>
        <UploadField label="Book File (PDF)" accept="application/pdf" value={newBook.file_url} onUrl={u=>setNewBook(p=>({...p,file_url:u}))} uid={user?.id||'upload'} folder="books" type="pdf"/>
        <div style={{display:'flex',gap:8,marginTop:8}}><button style={B.btn('primary')} onClick={submitBook}>Upload</button><button style={B.btn('ghost')} onClick={()=>setUploadBook(false)}>Cancel</button></div>
      </div>}
      {search&&<div style={{color:'#64748b',fontSize:13,marginBottom:12}}>{filteredBooks.length} result{filteredBooks.length!==1?'s':''} for "{search}"</div>}
      <div style={B.grid}>{filteredBooks.map((b:any)=>(<div key={b.id} style={B.card}>
        <div style={{height:160,background:`${gc(b.category||'Default')}18`,position:'relative',overflow:'hidden'}}>
          {b.cover_url?<img src={b.cover_url} alt={b.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52}}>📖</div>}
          <div style={{position:'absolute',top:8,right:8}}><span style={{...B.badge(b.is_free?'#10b981':'#f59e0b'),fontSize:10}}>{b.is_free?'FREE':'$'+b.price}</span></div>
        </div>
        <div style={{padding:'12px 14px'}}>
          <span style={B.badge(gc(b.category||'Default'))}>{b.category}</span>
          <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',margin:'8px 0 4px',lineHeight:1.3}}>{b.title}</div>
          <div style={{fontSize:11,color:'#64748b',marginBottom:10}}>by {b.author}</div>
          <div style={{display:'flex',gap:8}}>
            {(b.file_url||b.file_path)?<><button onClick={()=>setView({type:'book-reader',book:b})} style={{...B.btn('primary'),flex:1,padding:'7px',fontSize:12}}>Read Now</button><a href={b.file_url||(STORAGE_URL+(b.file_path||''))} target="_blank" rel="noreferrer" style={{...B.btn('ghost'),padding:'7px 12px',fontSize:12,textDecoration:'none'}}>↓</a></>:<button style={{...B.btn('ghost'),flex:1,padding:'7px',fontSize:12,opacity:0.5}} disabled>Coming Soon</button>}
          </div>
        </div>
      </div>))}</div>
    </div>}

    {tab==='my-learning'&&<div style={{padding:'16px 24px 80px'}}>
      {enrollments.length===0?(<div style={{textAlign:'center',padding:60,color:'#475569'}}><div style={{fontSize:44,marginBottom:12}}>📚</div><div style={{marginBottom:16}}>No courses enrolled yet</div><button style={{...B.btn('primary'),marginTop:8}} onClick={()=>setTab('courses')}>Browse Courses</button></div>):(
      <div style={B.grid}>{enrollments.map(e=>{const c=courses.find(co=>co.id===e.course_id);if(!c)return null;return(
        <div key={e.course_id} style={{...B.card,cursor:'pointer'}} onClick={()=>setView({type:'lesson',course:c})}>
          <div style={{height:120,background:`${gc(c.category)}18`,position:'relative',overflow:'hidden'}}>
            {c.thumbnail_url?<img src={c.thumbnail_url} alt={c.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>{gi(c.category)}</div>}
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:'rgba(0,0,0,0.4)'}}><div style={{height:'100%',width:`${e.progress}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)'}}/></div>
            {e.progress>=100&&<div style={{position:'absolute',top:8,right:8,background:'#10b981',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700,color:'#fff'}}>Complete ✓</div>}
          </div>
          <div style={{padding:'12px 14px'}}>
            <div style={{fontWeight:700,fontSize:14,color:'#e2e8f0',marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:12,color:'#64748b',marginBottom:8}}>{e.progress}% complete · {c.total_lessons||0} lessons</div>
            <button style={{...B.btn(e.progress>=100?'ghost':'primary'),width:'100%',padding:'7px',fontSize:12}}>{e.progress>=100?'Review Course':'Continue →'}</button>
          </div>
        </div>
      );})}</div>)}
    </div>}
  </div>);
}
