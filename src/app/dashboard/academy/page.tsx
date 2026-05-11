'use client';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
import{getLangFromStorage,t}from'../../../lib/i18n';

const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');

const CAT_COLORS={'Budgeting':'#1a6bff','Investing':'#10b981','Debt':'#ef4444','Freelance':'#f59e0b','Tax':'#8b5cf6','Crypto':'#06b6d4','Business':'#f97316','Savings':'#3b82f6','Default':'#6c2ef5'};
const CAT_ICONS={'Budgeting':'💰','Investing':'📈','Debt':'🏦','Freelance':'💼','Tax':'🧾','Crypto':'⛓','Business':'🏢','Savings':'🐷','Default':'📚'};

function WaveLogo({size=32}){
  return(<svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wg1a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#wg1a)"/><path d="M10 38 Q18 22 26 32 Q34 42 42 26 Q50 10 54 26" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}

export default function AcademyPage(){
  const [lang,setLang]=useState('en');
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState('courses');
  const [courses,setCourses]=useState([]);
  const [articles,setArticles]=useState([]);
  const [books,setBooks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [catFilter,setCatFilter]=useState('All');
  const [selectedCourse,setSelectedCourse]=useState(null);
  const [lessons,setLessons]=useState([]);
  const [activeLesson,setActiveLesson]=useState(null);
  const [quizAnswers,setQuizAnswers]=useState({});
  const [writeArticle,setWriteArticle]=useState(false);
  const [articleForm,setArticleForm]=useState({title:'',content:'',category:'Budgeting'});
  const [toast,setToast]=useState('');

  useEffect(()=>{
    setLang(getLangFromStorage());
    sb.auth.getUser().then(({data})=>{setUser(data.user);loadAll(data.user?.id);});
  },[]);

  async function loadAll(uid){
    setLoading(true);
    const[{data:c},{data:a},{data:b}]=await Promise.all([
      sb.from('academy_courses').select('*').eq('is_published',true).order('created_at',{ascending:false}),
      sb.from('academy_articles').select('*').order('created_at',{ascending:false}),
      sb.from('academy_books').select('*').order('title')
    ]);
    if(uid&&c){
      const{data:enr}=await sb.from('academy_enrollments').select('course_id,progress').eq('user_id',uid);
      const enrMap=Object.fromEntries((enr||[]).map(e=>[e.course_id,e.progress||0]));
      setCourses(c.map(x=>({...x,enrolled:!!enrMap[x.id],progress:enrMap[x.id]||0})));
    }else setCourses(c||[]);
    setArticles(a||[]);setBooks(b||[]);setLoading(false);
  }

  async function enrollCourse(course){
    if(!user){showToast('Please log in to enroll');return;}
    if(course.enrolled){openCourse(course);return;}
    await sb.from('academy_enrollments').upsert({user_id:user.id,course_id:course.id,progress:0},{onConflict:'user_id,course_id'});
    showToast('Enrolled! Starting course...');
    await loadAll(user?.id);openCourse(course);
  }

  async function openCourse(course){
    setSelectedCourse(course);
    const{data}=await sb.from('academy_lessons').select('*').eq('course_id',course.id).order('order_index');
    setLessons(data||[]);setActiveLesson(data?.[0]||null);
  }

  async function completeLesson(lesson){
    if(!user||!selectedCourse)return;
    const idx=lessons.findIndex(l=>l.id===lesson.id);
    const progress=Math.round(((idx+1)/lessons.length)*100);
    await sb.from('academy_enrollments').update({progress,last_lesson_id:lesson.id}).eq('user_id',user.id).eq('course_id',selectedCourse.id);
    showToast(progress===100?'Course Complete! Certificate earned!':'Lesson complete!');
    const next=lessons[idx+1];if(next)setActiveLesson(next);
  }

  async function submitArticle(){
    if(!user){showToast('Please log in');return;}
    if(!articleForm.title||!articleForm.content){showToast('Fill all fields');return;}
    await sb.from('academy_articles').insert({...articleForm,author_name:user.email?.split('@')[0]||'Student',user_id:user.id,read_time:Math.ceil(articleForm.content.split(' ').length/200)});
    showToast('Article published!');setWriteArticle(false);
    setArticleForm({title:'',content:'',category:'Budgeting'});loadAll(user?.id);
  }

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),3000);}

  const cats=['All','Budgeting','Investing','Debt','Freelance','Tax','Crypto','Business','Savings'];
  const allItems=tab==='courses'?courses:tab==='articles'?articles:books;
  const filtered=allItems.filter(x=>{
    const ms=x.title?.toLowerCase().includes(search.toLowerCase())||x.description?.toLowerCase().includes(search.toLowerCase())||x.content?.toLowerCase().includes(search.toLowerCase());
    const mc=catFilter==='All'||x.category===catFilter;
    return ms&&mc;
  });
  const myCourses=courses.filter(c=>c.enrolled);

  const col=c=>CAT_COLORS[c]||CAT_COLORS.Default;
  const ico=c=>CAT_ICONS[c]||CAT_ICONS.Default;

  const S={
    wrap:{minHeight:'100vh',background:'#000814',color:'#e2e8f0',fontFamily:"'Inter',sans-serif",paddingBottom:80},
    header:{background:'linear-gradient(135deg,#0a1628 0%,#0d1f3c 50%,#0a1628 100%)',padding:'32px 24px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)'},
    title:{fontSize:28,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0},
    sub:{fontSize:14,color:'#64748b',marginTop:4},
    tabs:{display:'flex',gap:8,padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)',overflowX:'auto'},
    tab:a=>({padding:'8px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,background:a?'linear-gradient(135deg,#1a6bff,#6c2ef5)':'rgba(255,255,255,0.04)',color:a?'#fff':'#64748b',whiteSpace:'nowrap'}),
    searchBar:{display:'flex',gap:12,padding:'16px 24px',alignItems:'center'},
    si:{flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 16px',color:'#e2e8f0',fontSize:14,outline:'none'},
    catBtn:a=>({padding:'6px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:a?'rgba(26,107,255,0.2)':'rgba(255,255,255,0.04)',color:a?'#1a6bff':'#64748b'}),
    grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,padding:'0 24px 24px'},
    card:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,overflow:'hidden',cursor:'pointer'},
    imgPh:c=>({width:'100%',height:140,display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${col(c)}22,${col(c)}44)`,fontSize:48}),
    cardBody:{padding:16},
    ct:{fontSize:15,fontWeight:700,color:'#e2e8f0',marginBottom:6,lineHeight:1.4},
    meta:{fontSize:12,color:'#64748b',display:'flex',gap:12,marginBottom:8,flexWrap:'wrap'},
    badge:c=>({padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600,background:`${c}22`,color:c,display:'inline-block'}),
    pb:{height:3,background:'rgba(255,255,255,0.08)',borderRadius:2,marginTop:8,overflow:'hidden'},
    pf:p=>({height:'100%',width:`${p}%`,background:'linear-gradient(90deg,#1a6bff,#6c2ef5)',borderRadius:2}),
    enBtn:e=>({width:'100%',marginTop:12,padding:'10px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:700,fontSize:13,background:e?'rgba(26,107,255,0.15)':'linear-gradient(135deg,#1a6bff,#6c2ef5)',color:e?'#1a6bff':'#fff'}),
    lw:{display:'flex',height:'calc(100vh - 200px)',gap:0},
    ls:{width:280,background:'rgba(255,255,255,0.02)',borderRight:'1px solid rgba(255,255,255,0.06)',overflowY:'auto',flexShrink:0},
    li:a=>({padding:'12px 16px',cursor:'pointer',borderLeft:`3px solid ${a?'#1a6bff':'transparent'}`,background:a?'rgba(26,107,255,0.08)':'transparent',fontSize:13,color:a?'#1a6bff':'#94a3b8'}),
    lm:{flex:1,overflowY:'auto',padding:24},
    vb:{width:'100%',aspectRatio:'16/9',background:'rgba(255,255,255,0.04)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20,border:'1px solid rgba(255,255,255,0.08)',fontSize:40},
    ac:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:20,cursor:'pointer'},
    bkCover:c=>({width:'100%',height:180,display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${col(c)}33,${col(c)}55)`,borderRadius:'8px 8px 0 0',fontSize:52}),
    toast:{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#1a6bff',color:'#fff',padding:'12px 24px',borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999},
    back:{background:'rgba(255,255,255,0.06)',border:'none',color:'#94a3b8',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13,marginBottom:16},
    comp:{background:'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:8,padding:'12px 24px',fontWeight:700,fontSize:14,cursor:'pointer',marginTop:16,width:'100%'},
    sr:{display:'flex',gap:16,padding:'0 24px 16px',flexWrap:'wrap'},
    sb2:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'12px 16px',flex:1,minWidth:120,textAlign:'center'},
    sn:{fontSize:24,fontWeight:800,fontFamily:"'Orbitron',monospace",background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'},
    sl:{fontSize:11,color:'#64748b',marginTop:2},
    wb:{background:'linear-gradient(135deg,#1a6bff,#6c2ef5)',color:'#fff',border:'none',borderRadius:8,padding:'10px 20px',fontWeight:700,fontSize:13,cursor:'pointer'},
    fa:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:20,margin:'0 24px 24px'},
    inp:{width:'calc(100% - 24px)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 12px',color:'#e2e8f0',fontSize:14,outline:'none',display:'block',marginBottom:12},
    ta:{width:'calc(100% - 24px)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'10px 12px',color:'#e2e8f0',fontSize:14,outline:'none',minHeight:160,resize:'vertical',display:'block',marginBottom:12},
  };

  if(loading)return(<div style={{...S.wrap,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center'}}><WaveLogo size={48}/><p style={{color:'#64748b',marginTop:16}}>Loading Academy...</p></div></div>);

  if(selectedCourse){
    return(
      <div style={S.wrap}>
        {toast&&<div style={S.toast}>{toast}</div>}
        <div style={{padding:'16px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <button style={S.back} onClick={()=>{setSelectedCourse(null);setActiveLesson(null);}}>← Back to Academy</button>
          <h2 style={{...S.title,fontSize:20,margin:0}}>{selectedCourse.title}</h2>
          <div style={{...S.meta,marginTop:6}}>
            <span style={S.badge(col(selectedCourse.category))}>{selectedCourse.category}</span>
            <span>{selectedCourse.level}</span>
            <span>{lessons.length} lessons</span>
            <span style={{color:'#f59e0b'}}>★ {selectedCourse.rating||4.5}</span>
          </div>
        </div>
        <div style={S.lw}>
          <div style={S.ls}>
            <div style={{padding:'12px 16px',fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.1em'}}>Lessons</div>
            {lessons.map((l,i)=>(
              <div key={l.id} style={S.li(activeLesson?.id===l.id)} onClick={()=>setActiveLesson(l)}>
                <span style={{color:'#475569',marginRight:8}}>{i+1}.</span>{l.title}
                {l.type==='quiz'&&<span style={{...S.badge('#8b5cf6'),marginLeft:6}}>Quiz</span>}
              </div>
            ))}
          </div>
          <div style={S.lm}>
            {activeLesson?(
              <>
                <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'#e2e8f0'}}>{activeLesson.title}</h3>
                {activeLesson.type==='video'&&(
                  <div style={S.vb}>
                    {activeLesson.video_url?(<iframe width="100%" height="100%" src={activeLesson.video_url.replace('watch?v=','embed/')} style={{border:'none',borderRadius:12}} allowFullScreen/>):(<div style={{textAlign:'center'}}><div style={{fontSize:48,marginBottom:8}}>▶</div><div style={{color:'#64748b',fontSize:14}}>Video lesson</div></div>)}
                  </div>
                )}
                {activeLesson.type==='quiz'&&(
                  <div style={{background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.15)',borderRadius:12,padding:20,marginBottom:16}}>
                    <div style={{fontWeight:700,marginBottom:12,color:'#8b5cf6'}}>Quiz</div>
                    {(activeLesson.questions||[]).map((q,qi)=>(
                      <div key={qi} style={{marginBottom:16}}>
                        <div style={{marginBottom:8,fontWeight:600}}>{q.question}</div>
                        {q.options.map((opt,oi)=>(
                          <div key={oi} onClick={()=>setQuizAnswers(p=>({...p,[qi]:oi}))} style={{padding:'8px 12px',borderRadius:6,marginBottom:4,cursor:'pointer',background:quizAnswers[qi]===oi?'rgba(26,107,255,0.15)':'rgba(255,255,255,0.03)',border:`1px solid ${quizAnswers[qi]===oi?'#1a6bff':'rgba(255,255,255,0.06)'}`,fontSize:14}}>{opt}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{fontSize:15,lineHeight:1.8,color:'#94a3b8',whiteSpace:'pre-wrap'}}>{activeLesson.content}</div>
                <button style={S.comp} onClick={()=>completeLesson(activeLesson)}>{activeLesson.type==='quiz'?'Submit & Continue':'Mark Complete →'}</button>
              </>
            ):(
              <div style={{textAlign:'center',padding:40,color:'#64748b'}}>Select a lesson to begin</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={S.wrap}>
      {toast&&<div style={S.toast}>{toast}</div>}
      <div style={S.header}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}><WaveLogo size={32}/><h1 style={S.title}>Academy</h1></div>
        <p style={S.sub}>Master your finances — courses, articles and books</p>
      </div>
      <div style={{...S.sr,marginTop:16}}>
        <div style={S.sb2}><div style={S.sn}>{courses.length}</div><div style={S.sl}>Courses</div></div>
        <div style={S.sb2}><div style={S.sn}>{myCourses.length}</div><div style={S.sl}>Enrolled</div></div>
        <div style={S.sb2}><div style={S.sn}>{articles.length}</div><div style={S.sl}>Articles</div></div>
        <div style={S.sb2}><div style={S.sn}>{books.length}</div><div style={S.sl}>Books</div></div>
      </div>
      <div style={S.tabs}>
        {['courses','articles','books','my-learning'].map(tb=>(
          <button key={tb} style={S.tab(tab===tb)} onClick={()=>setTab(tb)}>
            {tb==='courses'?'Courses':tb==='articles'?'Articles':tb==='books'?'Books':'My Learning'}
          </button>
        ))}
      </div>
      <div style={S.searchBar}>
        <input style={S.si} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {tab==='articles'&&<button style={S.wb} onClick={()=>setWriteArticle(v=>!v)}>+ Write</button>}
      </div>
      <div style={{display:'flex',gap:8,padding:'0 24px 16px',flexWrap:'wrap'}}>
        {cats.map(c=><button key={c} style={S.catBtn(catFilter===c)} onClick={()=>setCatFilter(c)}>{c}</button>)}
      </div>
      {writeArticle&&tab==='articles'&&(
        <div style={S.fa}>
          <h3 style={{color:'#e2e8f0',marginBottom:16}}>Write an Article</h3>
          <input style={S.inp} placeholder="Title" value={articleForm.title} onChange={e=>setArticleForm(p=>({...p,title:e.target.value}))}/>
          <select style={S.inp} value={articleForm.category} onChange={e=>setArticleForm(p=>({...p,category:e.target.value}))}>
            {cats.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
          </select>
          <textarea style={S.ta} placeholder="Write your article..." value={articleForm.content} onChange={e=>setArticleForm(p=>({...p,content:e.target.value}))}/>
          <div style={{display:'flex',gap:8}}>
            <button style={S.wb} onClick={submitArticle}>Publish</button>
            <button style={{...S.wb,background:'rgba(255,255,255,0.06)',color:'#94a3b8'}} onClick={()=>setWriteArticle(false)}>Cancel</button>
          </div>
        </div>
      )}
      {tab==='my-learning'&&(
        <div style={S.grid}>
          {myCourses.length===0?(
            <div style={{padding:40,color:'#64748b',gridColumn:'1/-1',textAlign:'center'}}>
              <div style={{fontSize:40,marginBottom:12}}>📚</div>
              <div>No courses enrolled yet. Browse courses to get started!</div>
            </div>
          ):myCourses.map(c=>(
            <div key={c.id} style={S.card} onClick={()=>openCourse(c)}>
              <div style={S.imgPh(c.category)}>{ico(c.category)}</div>
              <div style={S.cardBody}>
                <div style={S.ct}>{c.title}</div>
                <div style={S.meta}><span>{c.instructor_name}</span><span style={S.badge(col(c.category))}>{c.category}</span></div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:4}}>{c.progress||0}% complete</div>
                <div style={S.pb}><div style={S.pf(c.progress||0)}/></div>
                <button style={S.enBtn(true)}>Continue Learning →</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='courses'&&(
        <div style={S.grid}>
          {filtered.length===0?(
            <div style={{padding:40,color:'#64748b',gridColumn:'1/-1',textAlign:'center'}}>No courses found</div>
          ):filtered.map(c=>(
            <div key={c.id} style={S.card}>
              {c.thumbnail_url?(<img src={c.thumbnail_url} alt={c.title} style={{width:'100%',height:140,objectFit:'cover'}}/>):(<div style={S.imgPh(c.category)}>{ico(c.category)}</div>)}
              <div style={S.cardBody}>
                <span style={S.badge(col(c.category))}>{c.category}</span>
                <div style={{...S.ct,marginTop:8}}>{c.title}</div>
                <div style={{fontSize:13,color:'#64748b',marginBottom:8,lineHeight:1.5}}>{c.description?.slice(0,80)}{c.description?.length>80?'...':''}</div>
                <div style={S.meta}>
                  <span>👤 {c.instructor_name}</span><span>⏱ {c.duration_minutes}min</span><span>📊 {c.level}</span>
                  {c.rating&&<span style={{color:'#f59e0b'}}>★ {c.rating}</span>}
                </div>
                {c.enrolled&&(<><div style={{fontSize:11,color:'#64748b'}}>{c.progress||0}% complete</div><div style={S.pb}><div style={S.pf(c.progress||0)}/></div></>)}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                  <span style={{fontWeight:700,color:c.is_free?'#10b981':'#e2e8f0'}}>{c.is_free?'Free':`$${c.price}`}</span>
                  {c.students&&<span style={{fontSize:11,color:'#64748b'}}>{c.students.toLocaleString()} students</span>}
                </div>
                <button style={S.enBtn(!!c.enrolled)} onClick={()=>enrollCourse(c)}>{c.enrolled?'Continue Learning →':'Enroll Now'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='articles'&&(
        <div style={{padding:'0 24px 24px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
          {filtered.length===0?(
            <div style={{padding:40,color:'#64748b',gridColumn:'1/-1',textAlign:'center'}}>No articles yet. Be the first to write one!</div>
          ):filtered.map(a=>(
            <div key={a.id} style={S.ac}>
              <span style={S.badge(col(a.category))}>{a.category}</span>
              <h3 style={{fontSize:16,fontWeight:700,margin:'10px 0 8px',color:'#e2e8f0',lineHeight:1.4}}>{a.title}</h3>
              <p style={{fontSize:13,color:'#64748b',lineHeight:1.6,marginBottom:12}}>{a.content?.slice(0,120)}...</p>
              <div style={{fontSize:11,color:'#475569',display:'flex',gap:12}}>
                <span>✍ {a.author_name}</span>
                {a.read_time&&<span>⏱ {a.read_time} min read</span>}
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='books'&&(
        <div style={S.grid}>
          {filtered.length===0?(
            <div style={{padding:40,color:'#64748b',gridColumn:'1/-1',textAlign:'center'}}>No books available yet</div>
          ):filtered.map(bk=>(
            <div key={bk.id} style={S.card}>
              {bk.cover_url?(<img src={bk.cover_url} alt={bk.title} style={{width:'100%',height:180,objectFit:'cover',borderRadius:'8px 8px 0 0'}}/>):(<div style={S.bkCover(bk.category)}>{ico(bk.category)}</div>)}
              <div style={S.cardBody}>
                <div style={S.ct}>{bk.title}</div>
                <div style={{fontSize:13,color:'#64748b',marginBottom:8}}>{bk.author}</div>
                <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.5,marginBottom:10}}>{bk.description?.slice(0,90)}...</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,color:bk.is_free?'#10b981':'#e2e8f0'}}>{bk.is_free?'Free':`$${bk.price}`}</span>
                  <span style={S.badge(col(bk.category))}>{bk.category}</span>
                </div>
                <button style={{...S.enBtn(false),marginTop:12}} onClick={()=>{if(bk.file_url)window.open(bk.file_url,'_blank');else showToast('File coming soon');}}>{bk.is_free?'Download Free':'Buy & Download'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}