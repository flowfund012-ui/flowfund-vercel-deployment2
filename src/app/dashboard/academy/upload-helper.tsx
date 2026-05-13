'use client';
import{createClient}from'@supabase/supabase-js';

const BUCKET='academy-uploads';
const sb=createClient(
  'https://ammymxsyerlkdezsxuip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E'
);

export async function uploadToStorage(file:File,folder:string,uid:string):Promise<{url:string|null,error:string|null}>{
  try{
    const ext=file.name.split('.').pop()||'bin';
    const path=`${uid}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    // Get current session and set it on the client
    const{data:{session}}=await sb.auth.getSession();
    if(session){
      await sb.auth.setSession({access_token:session.access_token,refresh_token:session.refresh_token});
    }
    
    const{data,error}=await sb.storage.from(BUCKET).upload(path,file,{
      upsert:true,
      cacheControl:'3600',
      contentType:file.type
    });
    
    if(error){
      console.error('Storage upload error:',error);
      return{url:null,error:error.message};
    }
    
    const{data:urlData}=sb.storage.from(BUCKET).getPublicUrl(path);
    return{url:urlData.publicUrl,error:null};
  }catch(e:any){
    console.error('Upload exception:',e);
    return{url:null,error:e?.message||'Unknown error'};
  }
}