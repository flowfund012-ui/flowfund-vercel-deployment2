'use client';

const _q = [];
let _t = null;

function _flush() {
  if (!_q.length || typeof window === 'undefined') return;
  const ev = _q.splice(0, _q.length);
  fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: ev }) }).catch(() => {});
}

function _track(event, properties) {
  if (typeof window === 'undefined') return;
  _q.push({ event, properties });
  if (_t) clearTimeout(_t);
  _t = setTimeout(_flush, 1000);
}

// Named exports
export const track = _track;
export const trackServerEvent = (event, properties) => Promise.resolve();

// Default export as object - for: import analytics from '@/lib/analytics'
const analytics = { track: _track, trackServerEvent };
export default analytics;

// Also export as named 'analytics' - for: import { analytics } from '@/lib/analytics'
export { analytics };
