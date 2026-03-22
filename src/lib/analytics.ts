'use client';

const queue = [];
let timer = null;

function flush() {
  if (!queue.length || typeof window === 'undefined') return;
  const events = queue.splice(0, queue.length);
  fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events }) }).catch(() => {});
}

const analytics = {
  track(event, properties) {
    if (typeof window === 'undefined') return;
    queue.push({ event, properties });
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 1000);
  },
  trackServer(event, properties) {
    return Promise.resolve();
  }
};

export default analytics;
export const track = analytics.track.bind(analytics);
export const trackServerEvent = analytics.trackServer.bind(analytics);
