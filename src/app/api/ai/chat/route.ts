import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const NVIDIA_KEY = process.env.NVIDIA_API_KEY ?? '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';
const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'meta/llama-3.3-70b-instruct';
const SB_URL = 'https://ammymxsyerlkdezsxuip.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbXlteHN5ZXJsa2RlenN4dWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTI0NzMsImV4cCI6MjA4OTY2ODQ3M30.kS0xKDTl3KyjWBCB4Tp-8WdWPkAqXC62djKg4VPgC6E';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sb = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { messages, system, context } = await req.json();
    const builtMessages = [];
    if (context) builtMessages.push({ role: 'user', content: `[Financial context: ${context}]` });
    builtMessages.push(...messages);
    const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${NVIDIA_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system || 'You are a personal financial advisor AI. You have access to the user\'s real financial data. Be direct, specific, and actionable. Use their actual numbers. Keep responses to 2-4 sentences max. Never give generic advice.' },
          ...builtMessages,
        ],
        max_tokens: 400,
        temperature: 0.5,
        stream: false,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: 'AI service error', detail: err }, { status: 502 });
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
