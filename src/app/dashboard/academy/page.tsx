'use client';
export const dynamic='force-dynamic';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
const CAT_COLORS:Record<string,string>={Budgeting:'#10b981',FlowFund:'#1a6bff',Debt:'#f87171',Income:'#f59e0b',Investing:'#a78bfa',Tax:'#4ade80',Savings:'#38bdf8',Revenue:'#fb923c',Finance:'#60a5fa'};
const LEVEL_COLORS:Record<string,string>={Beginner:'#22c55e',Intermediate:'#f59e0b',Advanced:'#ef4444'};
const TABS=['Courses','Articles','Books','My Library','Teach'];
type Course={id:string;title:string;subtitle:string;category:string;level:string;price:number;total_lessons:number;total_duration_mins:number;total_students:number;avg_rating:number;what_you_learn:string[];is_featured:boolean;is_official:boolean;};
type Article={id:string;title:string;excerpt:string;category:string;reading_time_mins:number;created_at:string;likes:number;views:number;};
type Book={id:string;title:string;description:string;category:string;price:number;total_downloads:number;};
export default function AcademyPage(){
  const[tab,setTab]=useState('Courses');
  const[courses,setCourses]=useState<Course[]>([]);
  const[articles,setArticles]=useState<Article[]>([]);
  const[books,setBooks]=useState<Book[]>([]);
  const[uploads,setUploads]=useState<{id:string;title:string;file_type:string;created_at:string}[]>([]);
  const[enrollments,setEnrollments]=useState<string[]>([]);
  const[catFilter,setCatFilter]=useState('All');
  const[levelFilter,setLevelFilter]=useState('All');
  const[search,setSearch]=useState('');
  const[selected,setSelected]=useState<Course|null>(null);
  const[loading,setLoading]=useState(true);
  const[msg,setMsg]=useState('');
  const[userId,setUserId]=useState<string|null>(null);
  const[cTitle,setCTitle]=useState('');
  const[cSubtitle,setCSubtitle]=useState('');
  const[cDesc,setCDesc]=useState('');
  const[cCat,setCCat]=useState('Finance');
  const[cLevel,setCLevel]=useState('Beginner');
  const[cPrice,setCPrice]=useState('0');
  const[cLearn,setCLearn]=useState('');
  const[creating,setCreating]=useState(false);
  const[aTitle,setATitle]=useState('');
  const[aContent,setAContent]=useState('');
  const[aCat,setACat]=useState('Finance');
  const[aCreating,setACreating]=useState(false);
  const[showWrite,setShowWrite]=useState(false);
  useEffect(()=>{
    sb.auth.getUser().then(async({data})=>{
      if(!data.user)return;
      setUserId(data.user.id);
      const[{data:c},{data:ar},{data:bk},{data:up},{data:en}]=await Promise.all([
        sb.from('academy_courses').select('*').eq('is_published',true).order('is_featured',{ascending:false}).order('created_at',{ascending:false}),
        sb.from('academy_articles').select('id,title,excerpt,category,reading_time_mins,created_at,likes,views').eq('is_published',true).order('created_at',{ascending:false}).limit(20),
        sb.from('academy_books').select('id,title,description,category,price,total_downloads').eq('is_published',true).order('total_downloads',{ascending:false}),
        sb.from('user_uploads').select('id,title,file_type,created_at').eq('user_id',data.user.id).order('created_at',{ascending:false}),
        sb.from('course_enrollments').select('course_id').eq('user_id',data.user.id),
      ]);
      setCourses(c||[]);setArticles(ar||[]);setBooks(bk||[]);setUploads(up||[]);
      setEnrollments((en||[]).map((e:Record<string,string>)=>e.course_id));
      setLoading(false);
    });
  },[]);
  const enroll=async(courseId:string,price:number,e:React.MouseEvent)=>{
    e.stopPropagation();
    if(!userId)return;
    if(price>0){setMsg('Paid enrollment coming soon.');setTimeout(()=>setMsg(''),3000);return;}
    await sb.from('course_enrollments').upsert({user_id:userId,course_id:courseId,amount_paid:0});
    setEnrollments(prev=>[...prev,courseId]);
    setMsg('Enrolled successfully!');setTimeout(()=>setMsg(''),3000);
  };
  const createCourse=async()=>{
    if(!userId||!cTitle)return;
    setCreating(true);
    const learns=cLearn.split('\n').filter(Boolean);
    let{data:inst}=await sb.from('instructors').select('id').eq('user_id',userId).single();
    if(!inst){const{data:ni}=await sb.from('instructors').insert({user_id:userId,display_name:'Instructor'}).select('id').single();inst=ni;}
    await sb.from('academy_courses').insert({instructor_id:inst?.id,title:cTitle,subtitle:cSubtitle,description:cDesc,category:cCat,level:cLevel,price:parseFloat(cPrice)||0,is_published:true,what_you_learn:learns});
    const{data:c}=await sb.from('academy_courses').select('*').eq('is_published',true).order('created_at',{ascending:false});
    setCourses(c||[]);setCreating(false);setCTitle('');setCSubtitle('');setCDesc('');setCLearn('');
    setMsg('Course created and published!');setTimeout(()=>setMsg(''),4000);
  };
  const createArticle=async()=>{
    if(!userId||!aTitle||!aContent)return;
    setACreating(true);
    const slug=aTitle.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now();
    const mins=Math.max(1,Math.ceil(aContent.split(' ').length/200));
    await sb.from('academy_articles').insert({author_id:userId,title:aTitle,content:aContent,category:aCat,slug,reading_time_mins:mins,is_published:true,excerpt:aContent.substring(0,150)});
    const{data:ar}=await sb.from('academy_articles').select('id,title,excerpt,category,reading_time_mins,created_at,likes,views').eq('is_published',true).order('created_at',{ascending:false}).limit(20);
    setArticles(ar||[]);setACreating(false);setShowWrite(false);setATitle('');setAContent('');
    setMsg('Article published!');setTimeout(()=>setMsg(''),3000);
  };
  const filtered=courses.filter(c=>{
    if(catFilter!=='All'&&c.category!==catFilter)return false;
    if(levelFilter!=='All'&&c.level!==levelFilter)return false;
    if(search&&!c.title.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const col=(cat:string)=>CAT_COLORS[cat]||'#60a5fa';
  const cats=['All',...Array.from(new Set(courses.map(c=>c.category)))];
  const card:React.CSSProperties={background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14};
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:9,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none',fontFamily:"'Inter',sans-serif",boxSizing:'border-box'};
  const btnS=(bg:string,c='#fff'):React.CSSProperties=>({padding:'10px 22px',borderRadius:9,background:bg,color:c,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Inter',sans-serif"});
  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:300,color:'rgba(255,255,255,.4)',fontSize:14}}>Loading Academy...</div>);
  if(selected)return(
    <div style={{fontFamily:"'Inter',sans-serif",maxWidth:820,margin:'0 auto'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap')`}</style>
      <button onClick={()=>setSelected(null)} style={{...btnS('rgba(255,255,255,.07)','rgba(255,255,255,.6)'),marginBottom:20,fontSize:12}}>← Back</button>
      {msg&&<div style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',borderRadius:9,padding:'10px 16px',fontSize:13,color:'#4ade80',marginBottom:16}}>{msg}</div>}
      <div style={{...card,padding:32}}>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
          <div style={{width:48,height:48,borderRadius:13,background:`${col(selected.category)}18`,border:`2px solid ${col(selected.category)}40`,display:'flex',alignItems:'center',justifyContent:'center',color:col(selected.category),fontSize:16,fontWeight:700,fontFamily:"'Orbitron',monospace",flexShrink:0}}>{selected.category[0]}</div>
          <div>
            <div style={{fontSize:11,color:col(selected.category),letterSpacing:'.06em',textTransform:'uppercase'}}>{selected.category} · {selected.level}</div>
            {selected.is_official&&<span style={{fontSize:9,background:'rgba(26,107,255,.2)',color:'#60a5fa',borderRadius:4,padding:'2px 7px',letterSpacing:'.06em'}}>OFFICIAL COURSE</span>}
          </div>
        </div>
        <h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:900,color:'#fff',marginBottom:8}}>{selected.title}</h1>
        <p style={{fontSize:14,color:'rgba(255,255,255,.5)',marginBottom:20,lineHeight:1.7}}>{selected.subtitle}</p>
        <div style={{display:'flex',gap:20,marginBottom:24,flexWrap:'wrap'}}>
          {[[`${selected.total_lessons} lessons`],[`${selected.total_duration_mins} min`],[`${selected.total_students} students`],[selected.price===0?'Free':`$${selected.price}`]].map(([v],i)=><div key={i} style={{fontSize:13,color:'rgba(255,255,255,.45)',background:'rgba(255,255,255,.04)',borderRadius:7,padding:'5px 12px'}}>{v}</div>)}
        </div>
        {(selected.what_you_learn||[]).length>0&&(
          <div style={{background:'rgba(255,255,255,.04)',borderRadius:12,padding:20,marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:12}}>What you will learn</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {selected.what_you_learn.map((l,i)=><div key={i} style={{fontSize:12,color:'rgba(255,255,255,.6)',display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'#22c55e',flexShrink:0,marginTop:1}}>✓</span>{l}</div>)}
            </div>
          </div>
        )}
        {enrollments.includes(selected.id)
          ?<div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{...btnS('linear-gradient(135deg,#22c55e,#16a34a)')}}>Continue Learning →</div><div style={{fontSize:13,color:'#22c55e'}}>✓ You are enrolled</div></div>
          :<button onClick={(e)=>enroll(selected.id,selected.price,e)} style={{...btnS('linear-gradient(135deg,#1a6bff,#7c00ff)'),boxShadow:'0 4px 16px rgba(26,107,255,.35)'}}>{selected.price===0?'Enroll Free →':`Enroll — $${selected.price}`}</button>
        }
      </div>
    </div>
  );
  return(
    <div style={{fontFamily:"'Inter',sans-serif",maxWidth:1100,margin:'0 auto'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');select{-webkit-appearance:none}`}</style>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:900,color:'#fff',marginBottom:4}}>Academy</h1><p style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>Learn finance. Write articles. Sell courses.</p></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>{setShowWrite(true);setTab('Articles');}} style={{...btnS('rgba(255,255,255,.07)','rgba(255,255,255,.6)'),fontSize:12}}>Write Article</button>
          <button onClick={()=>setTab('Teach')} style={{...btnS('linear-gradient(135deg,#1a6bff,#7c00ff)'),fontSize:12}}>+ Create Course</button>
        </div>
      </div>
      {msg&&<div style={{background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.3)',borderRadius:9,padding:'10px 16px',fontSize:13,color:'#4ade80',marginBottom:16}}>{msg}</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
        {[['Courses',courses.length,'#1a6bff'],['Articles',articles.length,'#a78bfa'],['Books',books.length,'#f59e0b'],['Enrolled',enrollments.length,'#22c55e']].map(([l,v,c])=>(
          <div key={String(l)} style={{...card,padding:16,textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,fontFamily:"'Orbitron',monospace",color:String(c)}}>{v}</div><div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:3}}>{l}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:2,marginBottom:20,borderBottom:'1px solid rgba(255,255,255,.07)'}}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'9px 18px',borderRadius:'8px 8px 0 0',background:'none',border:'none',color:tab===t?'#fff':'rgba(255,255,255,.4)',fontSize:13,fontWeight:tab===t?600:400,cursor:'pointer',borderBottom:tab===t?'2px solid #1a6bff':'2px solid transparent',fontFamily:"'Inter',sans-serif"}}>{t}</button>)}
      </div>
      {tab==='Courses'&&(
        <div>
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." style={{...inp,maxWidth:240,padding:'8px 14px'}}/>
            {cats.map(c=><button key={c} onClick={()=>setCatFilter(c)} style={{padding:'6px 13px',borderRadius:16,border:catFilter===c?`1.5px solid ${col(c)}`:'1px solid rgba(255,255,255,.09)',background:catFilter===c?`${col(c)}18`:'transparent',color:catFilter===c?col(c):'rgba(255,255,255,.45)',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{c}</button>)}
            {['All','Beginner','Intermediate','Advanced'].map(l=><button key={l} onClick={()=>setLevelFilter(l)} style={{padding:'6px 11px',borderRadius:16,border:levelFilter===l?`1.5px solid ${LEVEL_COLORS[l]||'rgba(255,255,255,.3)'}`:'1px solid rgba(255,255,255,.07)',background:levelFilter===l?`${LEVEL_COLORS[l]||'#fff'}18`:'transparent',color:levelFilter===l?LEVEL_COLORS[l]||'#fff':'rgba(255,255,255,.35)',fontSize:12,cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>{l}</button>)}
          </div>
          {catFilter==='All'&&!search&&courses.filter(c=>c.is_featured).length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.28)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12}}>Featured</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>{courses.filter(c=>c.is_featured).map(c=>CourseCard(c,col,enrollments,setSelected,enroll))}</div>
            </div>
          )}
          <div style={{fontSize:11,color:'rgba(255,255,255,.28)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12}}>{catFilter==='All'&&!search?'All Courses':filtered.length+' Results'}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>{filtered.map(c=>CourseCard(c,col,enrollments,setSelected,enroll))}</div>
          {filtered.length===0&&<div style={{textAlign:'center',padding:48,color:'rgba(255,255,255,.3)',fontSize:14}}>No courses found.</div>}
        </div>
      )}
      {tab==='Articles'&&(
        <div>
          {showWrite&&(
            <div style={{...card,padding:24,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:16}}>Write an Article</div>
              <div style={{marginBottom:12}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Title</label><input value={aTitle} onChange={e=>setATitle(e.target.value)} placeholder="Your article title" style={inp}/></div>
              <div style={{marginBottom:12}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Category</label><select value={aCat} onChange={e=>setACat(e.target.value)} style={inp}>{['Finance','Budgeting','Investing','Tax','Freelance','Savings','Debt','Revenue'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Content</label><textarea value={aContent} onChange={e=>setAContent(e.target.value)} rows={10} placeholder="Write your article here..." style={{...inp,resize:'vertical',lineHeight:1.6}}/></div>
              <div style={{display:'flex',gap:10}}><button onClick={createArticle} disabled={aCreating} style={btnS('linear-gradient(135deg,#1a6bff,#7c00ff)')}>{aCreating?'Publishing...':'Publish'}</button><button onClick={()=>setShowWrite(false)} style={btnS('rgba(255,255,255,.07)','rgba(255,255,255,.5)')}>Cancel</button></div>
            </div>
          )}
          {!showWrite&&<button onClick={()=>setShowWrite(true)} style={{...btnS('rgba(26,107,255,.12)','#60a5fa'),marginBottom:16,fontSize:12}}>+ Write an Article</button>}
          <div style={{display:'grid',gap:10}}>
            {articles.length===0&&<div style={{textAlign:'center',padding:48,color:'rgba(255,255,255,.3)',fontSize:14,border:'1px dashed rgba(255,255,255,.08)',borderRadius:12}}>No articles yet. Be the first to write one.</div>}
            {articles.map(a=>(
              <div key={a.id} style={{...card,padding:18,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:14}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:8,marginBottom:7}}>
                    <span style={{fontSize:10,background:`${CAT_COLORS[a.category]||'#60a5fa'}18`,color:CAT_COLORS[a.category]||'#60a5fa',borderRadius:4,padding:'2px 7px'}}>{a.category}</span>
                    <span style={{fontSize:11,color:'rgba(255,255,255,.28)'}}>{a.reading_time_mins} min read</span>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:5}}>{a.title}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.42)',lineHeight:1.6}}>{a.excerpt}</div>
                </div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.28)',display:'flex',gap:10,flexShrink:0}}><span>♥ {a.likes}</span><span>👁 {a.views}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==='Books'&&(
        <div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:16,background:'rgba(26,107,255,.06)',border:'1px solid rgba(26,107,255,.14)',borderRadius:10,padding:'12px 16px',lineHeight:1.7}}>Ebooks and digital products. Instructors upload PDFs to sell. Payments via crypto — zero KYC. You keep 90%.</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14}}>
            {books.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'rgba(255,255,255,.3)',fontSize:14,border:'1px dashed rgba(255,255,255,.08)',borderRadius:12}}>No books yet. Upload your first ebook to sell it here.</div>}
            {books.map(b=>(
              <div key={b.id} style={{...card,padding:18}}>
                <div style={{height:100,borderRadius:9,background:'linear-gradient(135deg,rgba(26,107,255,.12),rgba(124,0,255,.12))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,fontSize:32}}>📚</div>
                <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:4}}>{b.title}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:12,lineHeight:1.5}}>{b.description}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:15,fontWeight:800,color:b.price===0?'#22c55e':'#fff'}}>{b.price===0?'Free':`$${b.price}`}</div>
                  <button style={btnS(b.price===0?'rgba(34,197,94,.15)':'linear-gradient(135deg,#1a6bff,#7c00ff)',b.price===0?'#22c55e':'#fff')}>{b.price===0?'Download':'Buy'}</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,textAlign:'center'}}><button onClick={()=>setMsg('Book upload coming soon.')} style={{...btnS('rgba(255,255,255,.05)','rgba(255,255,255,.45)'),fontSize:12}}>+ Upload Your Ebook</button></div>
        </div>
      )}
      {tab==='My Library'&&(
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>Your enrolled courses and private uploads.</div>
            <label style={{...btnS('linear-gradient(135deg,#1a6bff,#7c00ff)'),fontSize:12,cursor:'pointer'}}>
              + Upload File
              <input type="file" accept=".pdf,.mp4,.mp3,.doc,.docx,.txt,.png,.jpg" style={{display:'none'}} onChange={async e=>{
                const f=e.target.files?.[0];if(!f||!userId)return;
                const path=`user-uploads/${userId}/${Date.now()}-${f.name}`;
                const{error}=await sb.storage.from('user-files').upload(path,f,{upsert:true});
                if(error){setMsg('Upload failed. Storage bucket may not be set up yet.');setTimeout(()=>setMsg(''),4000);return;}
                const{data:url}=sb.storage.from('user-files').getPublicUrl(path);
                await sb.from('user_uploads').insert({user_id:userId,title:f.name,file_url:url.publicUrl,file_type:f.type,file_size_kb:Math.round(f.size/1024)});
                const{data:up}=await sb.from('user_uploads').select('id,title,file_type,created_at').eq('user_id',userId).order('created_at',{ascending:false});
                setUploads(up||[]);setMsg('Uploaded!');setTimeout(()=>setMsg(''),3000);
              }}/>
            </label>
          </div>
          {enrollments.length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,.28)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10}}>Enrolled Courses</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
                {courses.filter(c=>enrollments.includes(c.id)).map(c=>(
                  <div key={c.id} onClick={()=>setSelected(c)} style={{...card,padding:14,display:'flex',gap:10,alignItems:'center',cursor:'pointer'}}>
                    <div style={{width:34,height:34,borderRadius:9,background:`${col(c.category)}18`,border:`1.5px solid ${col(c.category)}35`,display:'flex',alignItems:'center',justifyContent:'center',color:col(c.category),fontSize:12,fontWeight:700,fontFamily:"'Orbitron',monospace",flexShrink:0}}>{c.category[0]}</div>
                    <div><div style={{fontSize:12,fontWeight:600,color:'#fff',marginBottom:2}}>{c.title}</div><div style={{fontSize:11,color:'#22c55e'}}>✓ Enrolled · {c.total_lessons} lessons</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{fontSize:11,color:'rgba(255,255,255,.28)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:10}}>Personal Files</div>
          {uploads.length===0&&<div style={{textAlign:'center',padding:40,color:'rgba(255,255,255,.3)',fontSize:13,border:'1px dashed rgba(255,255,255,.08)',borderRadius:12}}>No files uploaded yet.</div>}
          <div style={{display:'grid',gap:8}}>
            {uploads.map(u=>(
              <div key={u.id} style={{...card,padding:'11px 14px',display:'flex',gap:10,alignItems:'center'}}>
                <div style={{fontSize:20,flexShrink:0}}>{u.file_type?.includes('pdf')?'📄':u.file_type?.includes('video')?'🎬':u.file_type?.includes('audio')?'🎵':'📁'}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{u.title}</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>{new Date(u.created_at).toLocaleDateString()}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==='Teach'&&(
        <div>
          <div style={{...card,padding:24,marginBottom:20,background:'linear-gradient(135deg,rgba(26,107,255,.06),rgba(124,0,255,.06))',border:'1px solid rgba(26,107,255,.18)'}}>
            <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:15,fontWeight:700,color:'#fff',marginBottom:8}}>Become an Instructor</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,.45)',lineHeight:1.7,marginBottom:16}}>Share your financial knowledge. Create courses, set your price, earn in crypto. FlowFund takes 0% on free courses and 10% on paid — you keep the rest.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {[['Create','Build courses with text, video and quizzes','#1a6bff'],['Earn','Set your price. Get paid in crypto or fiat','#22c55e'],['Grow','Reach the FlowFund global user base','#a78bfa']].map(([t,d,c])=>(
                <div key={String(t)} style={{background:'rgba(0,0,0,.25)',borderRadius:9,padding:12}}><div style={{fontSize:12,fontWeight:700,color:String(c),marginBottom:3}}>{t}</div><div style={{fontSize:11,color:'rgba(255,255,255,.38)',lineHeight:1.5}}>{d}</div></div>
              ))}
            </div>
          </div>
          <div style={{...card,padding:24}}>
            <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:18}}>Create a New Course</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              <div><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Course Title *</label><input value={cTitle} onChange={e=>setCTitle(e.target.value)} placeholder="e.g. Freelance Finance Mastery" style={inp}/></div>
              <div><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Subtitle</label><input value={cSubtitle} onChange={e=>setCSubtitle(e.target.value)} placeholder="One-line description" style={inp}/></div>
            </div>
            <div style={{marginBottom:12}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Description</label><textarea value={cDesc} onChange={e=>setCDesc(e.target.value)} rows={3} placeholder="What will students learn? Who is this for?" style={{...inp,resize:'vertical'}}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
              <div><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Category</label><select value={cCat} onChange={e=>setCCat(e.target.value)} style={inp}>{['Finance','Budgeting','Investing','Tax','Freelance','Savings','Debt','Revenue'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Level</label><select value={cLevel} onChange={e=>setCLevel(e.target.value)} style={inp}>{['Beginner','Intermediate','Advanced'].map(l=><option key={l} value={l}>{l}</option>)}</select></div>
              <div><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>Price USD (0=Free)</label><input type="number" value={cPrice} onChange={e=>setCPrice(e.target.value)} min="0" placeholder="0" style={inp}/></div>
            </div>
            <div style={{marginBottom:18}}><label style={{display:'block',fontSize:10,color:'rgba(255,255,255,.32)',marginBottom:5,letterSpacing:'.08em',textTransform:'uppercase'}}>What Students Will Learn (one per line)</label><textarea value={cLearn} onChange={e=>setCLearn(e.target.value)} rows={4} placeholder={"Build a real budget\nAutomate savings\nReduce taxes legally"} style={{...inp,resize:'vertical'}}/></div>
            <button onClick={createCourse} disabled={creating||!cTitle} style={{...btnS('linear-gradient(135deg,#1a6bff,#7c00ff)'),opacity:!cTitle?0.5:1}}>{creating?'Creating...':'Publish Course'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
function CourseCard(c:Course,col:(cat:string)=>string,enrollments:string[],setSelected:(c:Course)=>void,enroll:(id:string,price:number,e:React.MouseEvent)=>void){
  const enrolled=enrollments.includes(c.id);
  const lc=['#22c55e','#f59e0b','#ef4444'][['Beginner','Intermediate','Advanced'].indexOf(c.level)]||'#60a5fa';
  return(
    <div key={c.id} onClick={()=>setSelected(c)} style={{background:'rgba(13,17,30,.95)',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,overflow:'hidden',cursor:'pointer',transition:'border-color .18s'}}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=col(c.category)+'40'}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.07)'}
    >
      <div style={{height:110,background:`linear-gradient(135deg,${col(c.category)}14,${col(c.category)}06)`,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid rgba(255,255,255,.04)',position:'relative'}}>
        <div style={{width:50,height:50,borderRadius:13,background:`${col(c.category)}20`,border:`2px solid ${col(c.category)}40`,display:'flex',alignItems:'center',justifyContent:'center',color:col(c.category),fontSize:17,fontWeight:700,fontFamily:"'Orbitron',monospace"}}>{c.category[0]}</div>
        {c.is_official&&<div style={{position:'absolute',top:9,right:9,fontSize:9,background:'rgba(26,107,255,.22)',border:'1px solid rgba(26,107,255,.4)',color:'#60a5fa',borderRadius:4,padding:'2px 6px',letterSpacing:'.05em'}}>OFFICIAL</div>}
        {enrolled&&<div style={{position:'absolute',top:9,left:9,fontSize:9,background:'rgba(34,197,94,.18)',border:'1px solid rgba(34,197,94,.4)',color:'#22c55e',borderRadius:4,padding:'2px 6px'}}>ENROLLED</div>}
      </div>
      <div style={{padding:14}}>
        <div style={{display:'flex',gap:5,marginBottom:8}}><span style={{fontSize:10,background:`${col(c.category)}15`,color:col(c.category),borderRadius:4,padding:'2px 7px'}}>{c.category}</span><span style={{fontSize:10,background:`${lc}12`,color:lc,borderRadius:4,padding:'2px 7px'}}>{c.level}</span></div>
        <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:4,lineHeight:1.35}}>{c.title}</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginBottom:10,lineHeight:1.5}}>{c.subtitle}</div>
        <div style={{display:'flex',gap:10,fontSize:11,color:'rgba(255,255,255,.3)',marginBottom:12}}><span>{c.total_lessons} lessons</span>{c.total_duration_mins>0&&<span>{c.total_duration_mins} min</span>}{c.avg_rating>0&&<span>★ {c.avg_rating.toFixed(1)}</span>}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:15,fontWeight:800,color:c.price===0?'#22c55e':'#fff'}}>{c.price===0?'Free':`$${c.price}`}</div>
          <button onClick={(e)=>{if(!enrolled)enroll(c.id,c.price,e);else e.stopPropagation();}} style={{padding:'6px 13px',borderRadius:8,background:enrolled?'rgba(34,197,94,.13)':'linear-gradient(135deg,#1a6bff,#7c00ff)',color:enrolled?'#22c55e':'#fff',border:'none',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>{enrolled?'✓ Enrolled':'Enroll'}</button>
        </div>
      </div>
    </div>
  );
}
