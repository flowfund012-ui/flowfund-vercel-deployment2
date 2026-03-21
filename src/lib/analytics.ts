// Client-side analytics class (used in 'use client' components via named export)
// Server-side trackServerEvent is safe to call from server actions too

type EventName =
  | 'page_view' | 'signup' | 'login' | 'logout'
  | 'transaction_created' | 'transaction_deleted'
  | 'goal_created' | 'goal_deleted'
  | 'revenue_logged' | 'course_completed' | 'challenge_completed'
  | 'asset_downloaded' | 'payment_initiated' | 'payment_completed'
  | 'payment_failed' | 'plan_upgraded' | 'csv_exported' | 'autopilot_updated';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

class Analytics {
  private enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  private queue: Array<{ event: EventName; properties?: EventProperties }> = [];
  private flushing = false;

  track(event: EventName, properties?: EventProperties) {
    if (!this.enabled || typeof window === 'undefined') return;
    this.queue.push({ event, properties });
    if (!this.flushing) {
      this.flushing = true;
      setTimeout(() => this.flush(), 1000);
    }
  }

  private async flush() {
    if (this.queue.length === 0) { this.flushing = false; return; }
    const batch = [...this.queue];
    this.queue = [];
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
      });
    } catch {}
    finally { this.flushing = false; }
  }

  pageView(path: string)                           { this.track('page_view',           { path }); }
  transactionCreated(type: string, amount: number) { this.track( transaction_created', { type, amount }); }
  goalCreated(category: string)                    { this.track('goal_created',        { category }); }
  courseCompleted(courseId: string, xp: number)    { this.track('course_completed',    { courseId, xp }); }
  paymentInitiated(plan: string, currency: string) { this.track('payment_initiated',   { plan, currency }); }
  paymentCompleted(plan: string, amountUsd: number){ this.track('payment_completed',   { plan, amountUsd }); }
  assetDownloaded(assetId: string)                 { this.track('asset_downloaded',    { assetId }); }
  csvExported(count: number)                       { this.track('csv_exported',        { count }); }
  autopilotUpdated(ss: boolean, ai: boolean)       { this.track('autopilot_updated',   { ss, ai }); }
}

// Singleton â€” safe to import anywhere
export const analytics = new Analytics();

export async function trackServerEvent(event: string, userId: string | null, properties?: Record<string, unknown>, path?: string) {
  if (typeof window !== 'undefined') return;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    await fetch(`${baseUrl}/api/analytics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: [{ event, userId, properties, path }] }) });
  } catch {}
}
