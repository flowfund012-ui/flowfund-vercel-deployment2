
export const LANGS:{code:string,name:string,native:string,rtl?:boolean}[]=[
  {code:'en',name:'English',native:'English'},
  {code:'ps',name:'Pashto',native:'پښتو',rtl:true},
  {code:'fa',name:'Dari / Persian',native:'دری',rtl:true},
  {code:'ar',name:'Arabic',native:'العربية',rtl:true},
  {code:'de',name:'German',native:'Deutsch'},
  {code:'fr',name:'French',native:'Français'},
  {code:'es',name:'Spanish',native:'Español'},
  {code:'zh',name:'Chinese',native:'中文'},
  {code:'hi',name:'Hindi',native:'हिन्दी'},
  {code:'ur',name:'Urdu',native:'اردو',rtl:true},
  {code:'tr',name:'Turkish',native:'Türkçe'},
  {code:'ru',name:'Russian',native:'Русский'},
  {code:'pt',name:'Portuguese',native:'Português'},
  {code:'it',name:'Italian',native:'Italiano'},
  {code:'ja',name:'Japanese',native:'日本語'},
  {code:'ko',name:'Korean',native:'한국어'},
  {code:'nl',name:'Dutch',native:'Nederlands'},
  {code:'pl',name:'Polish',native:'Polski'},
  {code:'sv',name:'Swedish',native:'Svenska'},
  {code:'no',name:'Norwegian',native:'Norsk'},
];

type T={[key:string]:string};

const translations:{[lang:string]:T}={
  en:{
    dashboard:'Dashboard',mission:'Mission Tracker',autopilot:'AutoPilot',growth:'Growth Engine',
    debts:'Debt Planner',academy:'Academy',vault:'Vault',security:'Security',
    tax:'Tax Radar',banksync:'Bank Sync',settings:'Settings',signout:'Sign Out',
    loading:'LOADING',financial_os:'FINANCIAL OS',
    total_income:'Total Income',total_expenses:'Total Expenses',net_flow:'Net Flow',
    savings_rate:'Savings Rate',add_transaction:'Add Transaction',
    welcome:'Welcome back',financial_score:'Financial Score',
  },
  ps:{
    dashboard:'ډشبورډ',mission:'د معاملو تعقیب',autopilot:'اتومات پایلټ',growth:'د وده انجن',
    debts:'د پور پلانر',academy:'اکاډمي',vault:'خزانه',security:'امنیت',
    tax:'د مالیې راډار',banksync:'د بانک هم‌غږي',settings:'ترتیبات',signout:'وتل',
    loading:'بار کیږي',financial_os:'مالي سیسټم',
    total_income:'ټولنۍ عاید',total_expenses:'ټولنۍ لګښتونه',net_flow:'خالص جریان',
    savings_rate:'د پس‌انداز کچه',add_transaction:'معامله زیاته کړه',
    welcome:'ښه راغلاست',financial_score:'مالي نمره',
  },
  fa:{
    dashboard:'داشبورد',mission:'ردیاب معاملات',autopilot:'اتوپایلت',growth:'موتور رشد',
    debts:'برنامه‌ریز بدهی',academy:'آکادمی',vault:'خزانه',security:'امنیت',
    tax:'رادار مالیات',banksync:'همگام‌سازی بانک',settings:'تنظیمات',signout:'خروج',
    loading:'در حال بارگذاری',financial_os:'سیستم مالی',
    total_income:'درآمد کل',total_expenses:'هزینه‌های کل',net_flow:'جریان خالص',
    savings_rate:'نرخ پس‌انداز',add_transaction:'افزودن تراکنش',
    welcome:'خوش آمدید',financial_score:'امتیاز مالی',
  },
  ar:{
    dashboard:'لوحة التحكم',mission:'متتبع المعاملات',autopilot:'الطيار الآلي',growth:'محرك النمو',
    debts:'مخطط الديون',academy:'الأكاديمية',vault:'الخزينة',security:'الأمان',
    tax:'رادار الضرائب',banksync:'مزامنة البنك',settings:'الإعدادات',signout:'تسجيل الخروج',
    loading:'جاري التحميل',financial_os:'نظام مالي',
    total_income:'إجمالي الدخل',total_expenses:'إجمالي المصروفات',net_flow:'صافي التدفق',
    savings_rate:'معدل الادخار',add_transaction:'إضافة معاملة',
    welcome:'مرحباً بعودتك',financial_score:'النقاط المالية',
  },
  de:{
    dashboard:'Dashboard',mission:'Transaktionsverfolgung',autopilot:'AutoPilot',growth:'Wachstumsmotor',
    debts:'Schuldenplaner',academy:'Akademie',vault:'Tresor',security:'Sicherheit',
    tax:'Steuerradar',banksync:'Banksynchronisation',settings:'Einstellungen',signout:'Abmelden',
    loading:'WIRD GELADEN',financial_os:'FINANZ-OS',
    total_income:'Gesamteinnahmen',total_expenses:'Gesamtausgaben',net_flow:'Nettofluss',
    savings_rate:'Sparquote',add_transaction:'Transaktion hinzufügen',
    welcome:'Willkommen zurück',financial_score:'Finanzscore',
  },
  fr:{
    dashboard:'Tableau de bord',mission:'Suivi des transactions',autopilot:'AutoPilote',growth:'Moteur de croissance',
    debts:'Planificateur de dettes',academy:'Académie',vault:'Coffre-fort',security:'Sécurité',
    tax:'Radar fiscal',banksync:'Sync bancaire',settings:'Paramètres',signout:'Déconnexion',
    loading:'CHARGEMENT',financial_os:'OS FINANCIER',
    total_income:'Revenus totaux',total_expenses:'Dépenses totales',net_flow:'Flux net',
    savings_rate:'Taux d\'épargne',add_transaction:'Ajouter transaction',
    welcome:'Bon retour',financial_score:'Score financier',
  },
  es:{
    dashboard:'Panel',mission:'Rastreador de transacciones',autopilot:'AutoPiloto',growth:'Motor de crecimiento',
    debts:'Planificador de deudas',academy:'Academia',vault:'Bóveda',security:'Seguridad',
    tax:'Radar fiscal',banksync:'Sincronización bancaria',settings:'Configuración',signout:'Cerrar sesión',
    loading:'CARGANDO',financial_os:'OS FINANCIERO',
    total_income:'Ingresos totales',total_expenses:'Gastos totales',net_flow:'Flujo neto',
    savings_rate:'Tasa de ahorro',add_transaction:'Añadir transacción',
    welcome:'Bienvenido de nuevo',financial_score:'Puntuación financiera',
  },
  zh:{
    dashboard:'仪表板',mission:'交易追踪',autopilot:'自动驾驶',growth:'增长引擎',
    debts:'债务规划',academy:'学院',vault:'保险库',security:'安全',
    tax:'税务雷达',banksync:'银行同步',settings:'设置',signout:'退出登录',
    loading:'加载中',financial_os:'金融系统',
    total_income:'总收入',total_expenses:'总支出',net_flow:'净流量',
    savings_rate:'储蓄率',add_transaction:'添加交易',
    welcome:'欢迎回来',financial_score:'财务评分',
  },
  hi:{
    dashboard:'डैशबोर्ड',mission:'लेनदेन ट्रैकर',autopilot:'ऑटोपायलट',growth:'विकास इंजन',
    debts:'ऋण योजनाकार',academy:'अकादमी',vault:'वॉल्ट',security:'सुरक्षा',
    tax:'टैक्स रडार',banksync:'बैंक सिंक',settings:'सेटिंग्स',signout:'साइन आउट',
    loading:'लोड हो रहा है',financial_os:'वित्तीय ओएस',
    total_income:'कुल आय',total_expenses:'कुल खर्च',net_flow:'नेट फ्लो',
    savings_rate:'बचत दर',add_transaction:'लेनदेन जोड़ें',
    welcome:'वापस स्वागत है',financial_score:'वित्तीय स्कोर',
  },
  ur:{
    dashboard:'ڈیش بورڈ',mission:'لین دین ٹریکر',autopilot:'آٹو پائلٹ',growth:'ترقی انجن',
    debts:'قرض منصوبہ ساز',academy:'اکیڈمی',vault:'خزانہ',security:'سیکیورٹی',
    tax:'ٹیکس ریڈار',banksync:'بینک سنک',settings:'ترتیبات',signout:'سائن آؤٹ',
    loading:'لوڈ ہو رہا ہے',financial_os:'مالی نظام',
    total_income:'کل آمدنی',total_expenses:'کل اخراجات',net_flow:'خالص بہاؤ',
    savings_rate:'بچت کی شرح',add_transaction:'لین دین شامل کریں',
    welcome:'واپس خوش آمدید',financial_score:'مالی اسکور',
  },
  tr:{
    dashboard:'Gösterge Paneli',mission:'İşlem Takibi',autopilot:'Otomatik Pilot',growth:'Büyüme Motoru',
    debts:'Borç Planlayıcı',academy:'Akademi',vault:'Kasa',security:'Güvenlik',
    tax:'Vergi Radarı',banksync:'Banka Senkronizasyonu',settings:'Ayarlar',signout:'Çıkış',
    loading:'YÜKLÜYOR',financial_os:'FİNANSAL OS',
    total_income:'Toplam Gelir',total_expenses:'Toplam Gider',net_flow:'Net Akış',
    savings_rate:'Tasarruf Oranı',add_transaction:'İşlem Ekle',
    welcome:'Tekrar Hoşgeldiniz',financial_score:'Finansal Puan',
  },
  ru:{
    dashboard:'Панель управления',mission:'Отслеживание транзакций',autopilot:'Автопилот',growth:'Двигатель роста',
    debts:'Планировщик долгов',academy:'Академия',vault:'Хранилище',security:'Безопасность',
    tax:'Налоговый радар',banksync:'Синхронизация банка',settings:'Настройки',signout:'Выйти',
    loading:'ЗАГРУЗКА',financial_os:'ФИНАНСОВАЯ ОС',
    total_income:'Общий доход',total_expenses:'Общие расходы',net_flow:'Чистый поток',
    savings_rate:'Норма сбережений',add_transaction:'Добавить транзакцию',
    welcome:'С возвращением',financial_score:'Финансовый рейтинг',
  },
  pt:{
    dashboard:'Painel',mission:'Rastreador de transações',autopilot:'AutoPiloto',growth:'Motor de crescimento',
    debts:'Planejador de dívidas',academy:'Academia',vault:'Cofre',security:'Segurança',
    tax:'Radar fiscal',banksync:'Sincronização bancária',settings:'Configurações',signout:'Sair',
    loading:'CARREGANDO',financial_os:'OS FINANCEIRO',
    total_income:'Renda total',total_expenses:'Despesas totais',net_flow:'Fluxo líquido',
    savings_rate:'Taxa de poupança',add_transaction:'Adicionar transação',
    welcome:'Bem-vindo de volta',financial_score:'Pontuação financeira',
  },
  it:{
    dashboard:'Cruscotto',mission:'Tracker transazioni',autopilot:'AutoPilota',growth:'Motore di crescita',
    debts:'Pianificatore debiti',academy:'Accademia',vault:'Caveau',security:'Sicurezza',
    tax:'Radar fiscale',banksync:'Sincronizzazione bancaria',settings:'Impostazioni',signout:'Esci',
    loading:'CARICAMENTO',financial_os:'OS FINANZIARIO',
    total_income:'Entrate totali',total_expenses:'Spese totali',net_flow:'Flusso netto',
    savings_rate:'Tasso di risparmio',add_transaction:'Aggiungi transazione',
    welcome:'Bentornato',financial_score:'Punteggio finanziario',
  },
  ja:{
    dashboard:'ダッシュボード',mission:'取引追跡',autopilot:'オートパイロット',growth:'成長エンジン',
    debts:'負債プランナー',academy:'アカデミー',vault:'金庫',security:'セキュリティ',
    tax:'税務レーダー',banksync:'銀行同期',settings:'設定',signout:'サインアウト',
    loading:'読み込み中',financial_os:'財務OS',
    total_income:'総収入',total_expenses:'総支出',net_flow:'純利益',
    savings_rate:'貯蓄率',add_transaction:'取引を追加',
    welcome:'お帰りなさい',financial_score:'財務スコア',
  },
  ko:{
    dashboard:'대시보드',mission:'거래 추적',autopilot:'자동 조종',growth:'성장 엔진',
    debts:'부채 플래너',academy:'아카데미',vault:'금고',security:'보안',
    tax:'세금 레이더',banksync:'은행 동기화',settings:'설정',signout:'로그아웃',
    loading:'로딩 중',financial_os:'금융 OS',
    total_income:'총 수입',total_expenses:'총 지출',net_flow:'순 흐름',
    savings_rate:'저축률',add_transaction:'거래 추가',
    welcome:'다시 오신 것을 환영합니다',financial_score:'재무 점수',
  },
  nl:{
    dashboard:'Dashboard',mission:'Transactiebeheer',autopilot:'AutoPiloot',growth:'Groeimotor',
    debts:'Schuldenplanner',academy:'Academie',vault:'Kluis',security:'Beveiliging',
    tax:'Belastingradar',banksync:'Banksynchronisatie',settings:'Instellingen',signout:'Uitloggen',
    loading:'LADEN',financial_os:'FINANCIEEL OS',
    total_income:'Totale inkomsten',total_expenses:'Totale uitgaven',net_flow:'Nettostroom',
    savings_rate:'Spaarpercentage',add_transaction:'Transactie toevoegen',
    welcome:'Welkom terug',financial_score:'Financiële score',
  },
  pl:{
    dashboard:'Panel sterowania',mission:'Śledzenie transakcji',autopilot:'AutoPilot',growth:'Silnik wzrostu',
    debts:'Planista długów',academy:'Akademia',vault:'Skarbiec',security:'Bezpieczeństwo',
    tax:'Radar podatkowy',banksync:'Synchronizacja bankowa',settings:'Ustawienia',signout:'Wyloguj',
    loading:'ŁADOWANIE',financial_os:'FINANSOWY OS',
    total_income:'Łączny przychód',total_expenses:'Łączne wydatki',net_flow:'Przepływ netto',
    savings_rate:'Stopa oszczędności',add_transaction:'Dodaj transakcję',
    welcome:'Witaj z powrotem',financial_score:'Wynik finansowy',
  },
  sv:{
    dashboard:'Instrumentbräda',mission:'Transaktionsspårning',autopilot:'AutoPilot',growth:'Tillväxtmotor',
    debts:'Skuldsplanerare',academy:'Akademin',vault:'Valv',security:'Säkerhet',
    tax:'Skatteradar',banksync:'Banksynkronisering',settings:'Inställningar',signout:'Logga ut',
    loading:'LADDAR',financial_os:'FINANSIELLT OS',
    total_income:'Total inkomst',total_expenses:'Totala utgifter',net_flow:'Nettoflöde',
    savings_rate:'Sparkvot',add_transaction:'Lägg till transaktion',
    welcome:'Välkommen tillbaka',financial_score:'Finansiellt betyg',
  },
  no:{
    dashboard:'Dashbord',mission:'Transaksjonsbehandling',autopilot:'AutoPilot',growth:'Vekstmotor',
    debts:'Gjeldplanlegger',academy:'Akademiet',vault:'Hvelv',security:'Sikkerhet',
    tax:'Skatteradar',banksync:'Banksynkronisering',settings:'Innstillinger',signout:'Logg ut',
    loading:'LASTER',financial_os:'FINANSIELL OS',
    total_income:'Total inntekt',total_expenses:'Totale utgifter',net_flow:'Nettoflyt',
    savings_rate:'Sparerate',add_transaction:'Legg til transaksjon',
    welcome:'Velkommen tilbake',financial_score:'Finansiell score',
  },
};

export function t(lang:string,key:string):string{
  return translations[lang]?.[key]||translations['en'][key]||key;
}
export function isRTL(lang:string):boolean{
  return LANGS.find(l=>l.code===lang)?.rtl||false;
}
export function getLangFromStorage():string{
  if(typeof window==='undefined')return'en';
  return localStorage.getItem('ff_lang')||'en';
}
export function setLangInStorage(lang:string){
  if(typeof window==='undefined')return;
  localStorage.setItem('ff_lang',lang);
  document.documentElement.lang=lang;
  document.documentElement.dir=isRTL(lang)?'rtl':'ltr';
}
