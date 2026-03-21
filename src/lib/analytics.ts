'use client';
type EventName = 'page_view'|'signup'|'login'|'logout'|'transaction_created'|'goal_created'|'course_completed'|'payment_initiated'|'payment_completed'|'asset_downloaded';
type EP = Record<string, string|number|boolean|null|undefined>;
class Analytics {
  private enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  private queue: Array<{event:EventName;properties?:EP}> = [];
  private flushing = false;
  track(event: EventName, properties?: EP) {
    if (!this.enabled || typeof window === 'undefined') return;
    this.queue.push({ event, properties });
    if (!this.flushing) { this.flushing = true; setTimeout(() => this.flush(), 1000); }
  }
  private async flush() {
    if (!this.queue.length) { this.flushing = false; return; }
    const batch = [...this.queue]; this.queue = [];
    try { await fetch('/api/analytics', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ events: batch }) }); } catch {}
    finally { this.flushing = false; }
  }
  pageView(path: string) { this.track('page_view', { path }); }
  courseCompleted(courseId: string, xp: number) { this.track('course_completed', { courseId, xp }); }
  paymentInitiated(plan: string, currency: string) { this.track('payment_initiated', { plan, currency }); }
  assetDownloaded(assetId: string) { this.track('asset_downloaded', { assetId }); }
}
export const analytics = new Analytics();
export async function trackServerEvent(event: string, userId: string|null, properties?: EP, path?: string) {
  if (typeof window !== 'undefined') return;
  try { await fetch('/api/analytics', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ events: [{ event, userId, properties, path }] }) }); } catch {}
}
