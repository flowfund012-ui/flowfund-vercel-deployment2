'use client';
import {useEffect,useRef} from 'react';
export const dynamic='force-dynamic';
export default function SettingsPage(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const w=window as any;
    const go=()=>w.__ffRender&&ref.current&&w.__ffRender('settings',ref.current);
    if(w.__ffLoaded)return void setTimeout(go,10);
    const s=document.createElement('script');
    s.src='/api/runner';
    s.onload=()=>{w.__ffLoaded=true;go();};
    document.head.appendChild(s);
    return()=>{try{if((window as any).activeChart){(window as any).activeChart.destroy();(window as any).activeChart=null;}}catch(e){}};
  },[]);
  return <div ref={ref} style={{minHeight:400}}/>;
}
