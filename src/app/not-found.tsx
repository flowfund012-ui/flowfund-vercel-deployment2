import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:0,fontFamily:"'Inter',sans-serif",textAlign:'center',padding:20 }}>
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 40%,rgba(239,68,68,.07),transparent 60%)',pointerEvents:'none' }}/>
      <div style={{ fontFamily:"'Orbitron',monospace",fontSize:'clamp(80px,15vw,160px)',fontWeight:900,lineHeight:1,background:'linear-gradient(135deg,rgba(239,68,68,.6),rgba(124,0,255,.4))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8 }}>404</div>
      <h1 style={{ fontFamily:"'Orbitron',monospace",fontSize:'clamp(16px,3vw,24px)',fontWeight:700,color:'rgba(255,255,255,.7)',marginBottom:12 }}>Mission Not Found</h1>
      <p style={{ fontSize:14,color:'rgba(255,255,255,.35)',marginBottom:32,maxWidth:360 }}>This page does not exist in the FlowFund OS. You may have followed a broken link or mistyped the address.</p>
      <div style={{ display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center' }}>
        <Link href="/dashboard" style={{ padding:'11px 24px',borderRadius:10,background:'linear-gradient(135deg,#1a6bff,#7c00ff)',color:'#fff',textDecoration:'none',fontSize:13,fontWeight:700,boxShadow:'0 4px 20px rgba(26,107,255,.3)' }}>Go to Dashboard</Link>
        <Link href="/" style={{ padding:'11px 24px',borderRadius:10,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',textDecoration:'none',fontSize:13,fontWeight:600 }}>Home</Link>
      </div>
    </div>
  );
}
