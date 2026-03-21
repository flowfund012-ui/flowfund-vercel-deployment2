# FlowFund OS v3.0 — Enterprise SaaS

Production-hardened: Next.js 14 + Supabase + NOWPayments + Zod + Rate Limiting

## What's New in v3.0
- Zod validation on ALL inputs
- Server-side plan gate (requirePlan) — no client bypass
- requireOwnership() — validates user_id on every delete
- Transaction limits per plan (Free: 50, Pro: 5000, Premium: unlimited)
- XP values server-authoritative (client can't self-award)
- NOWPayments double-verify: IPN + API confirmation
- activatePlanSafe() — atomic DB, prevents duplicate activation
- Payment recovery cron (/api/payments/recover)
- Upstash Redis rate limiting (in-memory fallback)
- Brute force: 5 req/min auth, 3 req/10min payments
- Security headers: CSP, X-Frame-Options, XSS, Referrer-Policy
- ErrorBoundary on every module
- Skeleton loaders (loading.tsx per route)
- error.tsx per module route
- Structured JSON logger (Vercel/Datadog-ready)
- Analytics via Supabase (no external service)
- Plan expiry enforced server-side
- DB trigger: auto-trim security_logs to 500 per user
- Custom 404 and 500 pages
- Responsive sidebar (collapses at 900px, hidden at 600px)

## Setup

1. npm install
2. Supabase: run migrations/001 then 002
3. NOWPayments: https://nowpayments.io (free, no KYC)
4. Optional: Upstash Redis for persistent rate limiting
5. Fill .env.local → npm run dev

## Deploy
npx vercel → add env vars → set NOWPayments IPN URL

vercel.json cron runs payment recovery every 15 minutes.
