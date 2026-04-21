'use client';
export const dynamic='force-dynamic';
import{useState,useEffect}from'react';
import{createClient}from'@supabase/supabase-js';
const sb=createClient('https://ammymxsyerlkdezsxuip.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E');function WaveLogo({size=40}:{size?:number}){
  const rx=Math.round(size*0.28);
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg1o" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a6bff"/><stop offset="60%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#0d9aff"/></linearGradient>
        <linearGradient id="wg2o" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6c2ef5"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
        <linearGradient id="wg3o" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0d9aff"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
      </defs>