import type { Metadata } from 'next';
import '@/styles/globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://flowfund-v3.vercel.app'),
  title: { default: 'FlowFund — AI Financial OS', template: '%s | FlowFund' },
  description: 'AI-powered financial OS for students, freelancers and entrepreneurs. Track income, automate savings, grow revenue. Supports 20+ languages and crypto payments.',
  keywords: ['finance','budgeting','savings','fintech','financial os','AI finance','freelancer finance'],
  authors:[{name:'FlowFund'}],
  openGraph: { title:'FlowFund — AI Financial OS', description:'Track income, automate savings, grow revenue. Built for students, freelancers and entrepreneurs.', url:'https://flowfund-v3.vercel.app', siteName:'FlowFund', type:'website' },
  twitter: { card:'summary_large_image', title:'FlowFund — AI Financial OS', description:'AI-powered financial OS for students, freelancers and entrepreneurs.' },
  robots: { index:true, follow:true },
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap"/>
        <meta name="theme-color" content="#070810"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="apple-mobile-web-app-title" content="FlowFund"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
