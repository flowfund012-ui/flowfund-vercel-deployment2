import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'FlowFund OS | Your Financial Command Center',
  description: 'Track income, automate savings, grow your business. The financial OS for students, freelancers, and entrepreneurs.',
  keywords: 'finance, budgeting, tracking, savings, investments, fintech, financial os',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="theme-color" content="#070810" />
      </head>
      <body>{children}</body>
    </html>
  );
}
