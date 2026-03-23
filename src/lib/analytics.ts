'use client';

const queue: Array<{event:string;properties?:unknown}> = [];
let timer: ReturnType<typeof setTimeout>|null = null;

function flush() {
  if (!queue.length || typeof window === 'undefined') return;
  const events = queue.splice(0, queue.length);
  fetch('/api/analytics', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({events})}).catch(()=>{});
}

const analytics = {
  track(event: string, properties?: unknown) {
    if (typeof window === 'undefined') return;
    queue.push({event, properties});
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 1000);
  },
  trackServer(_event: string, _properties?: unknown) {
    return Promise.resolve();
  }
};

export default analytics;
export { analytics };
export const track = analytics.track.bind(analytics);
export const trackServerEvent = analytics.trackServer.bind(analytics);

// Ensure pageView is always available
if (typeof analytics !== 'undefined' && analytics && !analytics.pageView) {
  (analytics as any).pageView = (path: string) => {};
}
