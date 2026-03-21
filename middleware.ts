import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { rateLimit, rateLimitResponse } from '@/lib/ratelimit';

const AUTH_ROUTES   = new Set(['/login', '/signup', '/auth/reset-password']);
const PAYMENT_PATHS = ['/api/payments/create-order'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit auth endpoints (brute force protection)
  if (AUTH_ROUTES.has(pathname) && request.method === 'POST') {
    const rl = await rateLimit(request, 'auth');
    if (!rl.success) return rateLimitResponse();
  }

  // Rate limit payment creation
  if (PAYMENT_PATHS.some(p => pathname.startsWith(p)) && request.method === 'POST') {
    const rl = await rateLimit(request, 'payment');
    if (!rl.success) return rateLimitResponse();
  }

  // General API rate limit (skip webhooks — NOWPayments may burst)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhooks/')) {
    const rl = await rateLimit(request, 'api');
    if (!rl.success) return rateLimitResponse();
  }

  // Supabase session refresh + auth guard for /dashboard
  const response = await updateSession(request);

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://api.nowpayments.io wss://*.supabase.co",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
