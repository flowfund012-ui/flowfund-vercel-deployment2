'use client';
export const dynamic='force-dynamic';
import{useState,useEffect,Suspense}from'react';
import{createClient}from'@supabase/supabase-js';
import Link from'next/link';
import{usePathname}from'next/navigation';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');
type Lang=string;
function getLang():Lang{if(typeof window==='undefined')return'en';return localStorage.getItem('ff_lang')||'en';}
const TRANS:Record<string,Record<string,string>>={
  en:{dashboard:'Dashboard',transactions:'Transactions',goals:'Goals',revenue:'Revenue',debt_payoff:'Debt Payoff',academy:'Academy',toolkit:'Toolkit',tax_radar:'Tax Radar',bank_sync:'Bank Sync',security:'Security',settings:'Settings',sign_out:'Sign Out',insights:'Insights',account:'Account'},
  ps:{dashboard:'ډشبورډ',transactions:'لیږدونه',goals:'اهداف',revenue:'عاید',debt_payoff:'پور ورکول',academy:'اکاډمي',toolkit:'وسایل',tax_radar:'مالیه ریدار',bank_sync:'بانک سینک',security:'امنیت',settings:'ترتیبات',sign_out:'وتل',insights:'بصیرتونه',account:'حساب'},
  fa:{dashboard:'داشبورد',transactions:'تراکنش‌ها',goals:'اهداف',revenue:'درآمد',debt_payoff:'بازپرداخت بدهی',academy:'آکادمی',toolkit:'ابزارها',tax_radar:'رادار مالیات',bank_sync:'همگام‌سازی بانک',security:'امنیت',settings:'تنظیمات',sign_out:'خروج',insights:'بینش‌ها',account:'حساب'},
  ar:{dashboard:'لوحة القيادة',transactions:'المعاملات',goals:'الأهداف',revenue:'الإيرادات',debt_payoff:'سداد الديون',academy:'أكاديمية',toolkit:'الأدوات',tax_radar:'رادار الضريبة',bank_sync:'مزامنة البنك',security:'الأمان',settings:'الإعدادات',sign_out:'تسجيل الخروج',insights:'رؤى',account:'الحساب'},
  ur:{dashboard:'ڈیش بورڈ',transactions:'لین دین',goals:'اہداف',revenue:'آمدنی',debt_payoff:'قرض ادائیگی',academy:'اکیڈمی',toolkit:'ٹول کٹ',tax_radar:'ٹیکس ریڈار',bank_sync:'بینک سنک',security:'سیکیورٹی',settings:'ترتیبات',sign_out:'سائن آؤٹ',insights:'بصیرت',account:'اکاؤنٹ'},
  de:{dashboard:'Dashboard',transactions:'Transaktionen',goals:'Ziele',revenue:'Einnahmen',debt_payoff:'Schuldenabbau',academy:'Akademie',toolkit:'Werkzeuge',tax_radar:'Steuer-Radar',bank_sync:'Bank-Sync',security:'Sicherheit',settings:'Einstellungen',sign_out:'Abmelden',insights:'Einblicke',account:'Konto'},
  fr:{dashboard:'Tableau de bord',transactions:'Transactions',goals:'Objectifs',revenue:'Revenus',debt_payoff:'Remboursement',academy:'Académie',toolkit:'Outils',tax_radar:'Radar fiscal',bank_sync:'Sync bancaire',security:'Sécurité',settings:'Paramètres',sign_out:'Déconnexion',insights:'Aperçus',account:'Compte'},
  es:{dashboard:'Panel',transactions:'Transacciones',goals:'Metas',revenue:'Ingresos',debt_payoff:'Pago de deuda',academy:'Academia',toolkit:'Herramientas',tax_radar:'Radar fiscal',bank_sync:'Sync bancario',security:'Seguridad',settings:'Ajustes',sign_out:'Cerrar sesión',insights:'Perspectivas',account:'Cuenta'},
  zh:{dashboard:'仪表板',transactions:'交易',goals:'目标',revenue:'收入',debt_payoff:'还债',academy:'学院',toolkit:'工具包',tax_radar:'税务雷达',bank_sync:'银行同步',security:'安全',settings:'设置',sign_out:'退出',insights:'洞察',account:'账户'},
  hi:{dashboard:'डैशबोर्ड',transactions:'लेनदेन',goals:'लक्ष्य',revenue:'राजस्व',debt_payoff:'ऋण भुगतान',academy:'अकादमी',toolkit:'टूलकिट',tax_radar:'टैक्स रडार',bank_sync:'बैंक सिंक',security:'सुरक्षा',settings:'सेटिंग्स',sign_out:'साइन आउट',insights:'अंतर्दृष्टि',account:'खाता'},
  tr:{dashboard:'Panel',transactions:'İşlemler',goals:'Hedefler',revenue:'Gelir',debt_payoff:'Borç Ödeme',academy:'Akademi',toolkit:'Araçlar',tax_radar:'Vergi Radar',bank_sync:'Banka Senkronizasyonu',security:'Güvenlik',settings:'Ayarlar',sign_out:'Çıkış Yap',insights:'İçgörüler',account:'Hesap'},
  ru:{dashboard:'Панель',transactions:'Транзакции',goals:'Цели',revenue:'Доходы',debt_payoff:'Погашение долга',academy:'Академия',toolkit:'Инструменты',tax_radar:'Налоговый радар',bank_sync:'Синхронизация',security:'Безопасность',settings:'Настройки',sign_out:'Выйти',insights:'Аналитика',account:'Аккаунт'},
  pt:{dashboard:'Painel',transactions:'Transações',goals:'Metas',revenue:'Receita',debt_payoff:'Pagamento de dívida',academy:'Academia',toolkit:'Ferramentas',tax_radar:'Radar fiscal',bank_sync:'Sync bancário',security:'Segurança',settings:'Configurações',sign_out:'Sair',insights:'Insights',account:'Conta'},
  id:{dashboard:'Dasbor',transactions:'Transaksi',goals:'Tujuan',revenue:'Pendapatan',debt_payoff:'Pelunasan utang',academy:'Akademi',toolkit:'Alat',tax_radar:'Radar Pajak',bank_sync:'Sinkronisasi',security:'Keamanan',settings:'Pengaturan',sign_out:'Keluar',insights:'Wawasan',account:'Akun'},
  ja:{dashboard:'ダッシュボード',transactions:'取引',goals:'目標',revenue:'収益',debt_payoff:'借金返済',academy:'アカデミー',toolkit:'ツール',tax_radar:'税務レーダー',bank_sync:'銀行同期',security:'セキュリティ',settings:'設定',sign_out:'サインアウト',insights:'インサイト',account:'アカウント'},
  ko:{dashboard:'대시보드',transactions:'거래',goals:'목표',revenue:'수익',debt_payoff:'부채 상환',academy:'아카데미',toolkit:'툴킷',tax_radar:'세금 레이더',bank_sync:'은행 동기화',security:'보안',settings:'설정',sign_out:'로그아웃',insights:'인사이트',account:'계정'},
};
function t(lang:Lang,key:string):string{return TRANS[lang]?.[key]||TRANS['en'][key]||key;}
function Logo({full=true}:{full?:boolean}){return(<div style={{display:'flex',alignItems:'center',gap:full?9:0}}><svg width="28" height="28" viewBox="0 0 64 64"><defs><linearGradient id="dl1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient><linearGradient id="dl2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient><linearGradient id="dl3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="#08091e"/><rect width="64" height="64" rx="18" fill="none" stroke="rgba(26,107,255,0.35)" strokeWidth="1.5"/><path d="M4,42 C16,34 32,50 60,42 L60,60 L4,60 Z" fill="url(#dl1)" opacity="0.78"/><path d="M4,30 C18,18 34,38 60,26 L60,46 C32,58 16,38 4,46 Z" fill="url(#dl2)" opacity="0.88"/><path d="M4,18 C20,6 36,24 60,12 L60,30 C36,42 20,22 4,34 Z" fill="url(#dl3)" opacity="0.72"/><path d="M4,10 C22,0 38,14 60,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/><line x1="46" y1="4" x2="56" y2="-2" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/><polygon points="56,-2 60,6 52,2" fill="#00d4ff"/></svg>{full&&<span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:14,color:'#fff',letterSpacing:'.04em'}}>FlowFund</span>}</div>);}
const NAV_GROUPS=[
  {group:'',key:'',items:[
    {href:'/dashboard',key:'dashboard',c:'#60a5fa'},
    {href:'/dashboard/mission',key:'transactions',c:'#34d399'},
    {href:'/dashboard/autopilot',key:'goals',c:'#f59e0b'},
    {href:'/dashboard/growth',key:'revenue',c:'#a78bfa'},
    {href:'/dashboard/debts',key:'debt_payoff',c:'#f87171'},
  ]},
  {group:'insights',key:'insights',items:[
    {href:'/dashboard/academy',key:'academy',c:'#38bdf8'},
    {href:'/dashboard/vault',key:'toolkit',c:'#fb923c'},
    {href:'/dashboard/tax',key:'tax_radar',c:'#4ade80'},
    {href:'/dashboard/banksync',key:'bank_sync',c:'#c084fc'},
  ]},
  {group:'account',key:'account',items:[
    {href:'/dashboard/security',key:'security',c:'#94a3b8'},
    {href:'/dashboard/settings',key:'settings',c:'#64748b'},
  ]},
];
function Sidebar(){
  const path=usePathname();
  const[col,setCol]=useState(false);
  const[lang,setLang]=useState('en');
  const[user,setUser]=useState<{name:string,plan:string}|null>(null);
  useEffect(()=>{
    setLang(getLang());
    sb.auth.getUser().then(async({data})=>{
      if(!data.user)return;
      const{data:p}=await sb.from('profiles').select('full_name,plan').eq('id',data.user.id).single();
      setUser({name:p?.full_name?.split(' ')[0]||data.user.email?.split('@')[0]||'User',plan:p?.plan||'free'});
    });
  },[]);
  const out=async()=>{await sb.auth.signOut();window.location.href='/';};
  const isRTL=['ps','fa','ar','ur'].includes(lang);
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'#070810',borderRight:'1px solid rgba(255,255,255,.06)',width:col?56:214,transition:'width .2s',overflow:'hidden',direction:isRTL?'rtl':'ltr'}}>
      <div style={{padding:'14px 10px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:54}}>
        <Logo full={!col}/>
        <button onClick={()=>setCol(c=>!c)} style={{background:'none',border:'none',color:'rgba(255,255,255,.25)',cursor:'pointer',fontSize:16,padding:'2px 4px',flexShrink:0,lineHeight:1}}>{col?'›':'‹'}</button>
      </div>
      <nav style={{flex:1,padding:'8px 5px',overflowY:'auto'}}>
        {NAV_GROUPS.map(g=>(
          <div key={g.group}>
            {g.group&&!col&&<div style={{fontSize:9,color:'rgba(255,255,255,.22)',letterSpacing:'.1em',textTransform:'uppercase',padding:'10px 10px 4px',marginTop:2}}>{t(lang,g.key)}</div>}
            {g.items.map(n=>{
              const act=path===n.href||(n.href!=='/dashboard'&&path?.startsWith(n.href));
              return(
                <Link key={n.href} href={n.href} title={col?t(lang,n.key):''} style={{display:'flex',alignItems:'center',gap:col?0:9,padding:col?'10px':'9px 10px',borderRadius:9,marginBottom:1,background:act?'rgba(255,255,255,.07)':'transparent',color:act?'#fff':'rgba(255,255,255,.45)',textDecoration:'none',borderLeft:act?`2.5px solid ${n.c}`:'2.5px solid transparent',justifyContent:col?'center':'flex-start',transition:'all .15s'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:act?n.c:'rgba(255,255,255,.2)',display:'block',flexShrink:0}}/>
                  {!col&&<span style={{fontSize:13,fontWeight:act?600:400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t(lang,n.key)}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{padding:'8px 5px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        {user&&!col&&<div style={{padding:'9px 10px',borderRadius:9,background:'rgba(255,255,255,.03)',marginBottom:6}}>
          <div style={{fontSize:11,fontWeight:600,color:'#fff',marginBottom:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div>
          <div style={{fontSize:9,color:'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.06em'}}>{user.plan} plan</div>
        </div>}
        <button onClick={out} title={col?t(lang,'sign_out'):''} style={{width:'100%',padding:col?'9px':'8px 10px',borderRadius:9,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.14)',color:'#f87171',fontSize:11,cursor:'pointer',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',justifyContent:col?'center':'flex-start',gap:col?0:7}}>
          <span style={{flexShrink:0,fontSize:13}}>↩</span>
          {!col&&<span>{t(lang,'sign_out')}</span>}
        </button>
      </div>
    </div>
  );
}
export default function DashboardLayout({children}:{children:React.ReactNode}){
  const[mob,setMob]=useState(false);
  const[open,setOpen]=useState(false);
  useEffect(()=>{const c=()=>setMob(window.innerWidth<768);c();window.addEventListener('resize',c);return()=>window.removeEventListener('resize',c);},[]);
  return(
    <div style={{display:'flex',minHeight:'100vh',background:'#070810',fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a6bff33;border-radius:2px}`}</style>
      {!mob&&<div style={{flexShrink:0,position:'sticky',top:0,height:'100vh'}}><Suspense fallback={<div style={{width:214,background:'#070810',height:'100%'}}/>}><Sidebar/></Suspense></div>}
      {mob&&open&&<div style={{position:'fixed',inset:0,zIndex:200,display:'flex'}}><div style={{width:214,background:'#070810',height:'100%'}}><Suspense fallback={null}><Sidebar/></Suspense></div><div style={{flex:1,background:'rgba(0,0,0,.5)'}} onClick={()=>setOpen(false)}/></div>}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {mob&&<div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',gap:10,background:'#070810',position:'sticky',top:0,zIndex:100}}><button onClick={()=>setOpen(true)} style={{background:'none',border:'none',color:'#fff',fontSize:20,cursor:'pointer',padding:2}}>☰</button><Logo full/></div>}
        <main style={{flex:1,padding:'22px 18px',overflowY:'auto'}}>{children}</main>
      </div>
    </div>
  );
}
