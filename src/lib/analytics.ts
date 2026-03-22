'use client';

const BATCH_INTERVAL = 1000;
const queue: Array<{ event: string; properties?: Record<string, unknown> }> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  fetch(`${appUrl}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  }).catch(() => {});
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  queue.push({ event, properties });
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, BATCH_INTERVAL);
}

export async function trackServerEvent(
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://flowfund-v3.vercel.app';
    await fetch(`${baseUrl}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: [{ event, properties }] }),
    });
  } catch {
    // Silent fail
  }
}
