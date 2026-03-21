-- ════════════════════════════════════════════════════════════
-- FlowFund OS — Migration 002: Analytics + Hardening
-- Run AFTER 001_initial_schema.sql
-- ════════════════════════════════════════════════════════════

-- ── Analytics Events ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event      TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  path       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event   ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);

-- No RLS on analytics — only written by service role / API
-- Users never read their own raw analytics

-- ── Payment orders: prevent concurrent activation ─────────────
-- Add a unique constraint to prevent double-activation
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_finished
  ON public.payment_orders(user_id, plan)
  WHERE status = 'finished';

-- ── Profile plan downgrade safety ────────────────────────────
-- Function to safely downgrade expired plans (called by cron or manually)
CREATE OR REPLACE FUNCTION public.downgrade_expired_plans()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.profiles
  SET
    plan = 'free',
    plan_expires_at = NULL,
    updated_at = NOW()
  WHERE
    plan != 'free'
    AND plan_expires_at IS NOT NULL
    AND plan_expires_at < NOW();

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count > 0 THEN
    RAISE NOTICE 'Downgraded % expired plans', updated_count;
  END IF;

  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Security logs: auto-trim to 500 per user ─────────────────
CREATE OR REPLACE FUNCTION public.trim_security_logs()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.security_logs
  WHERE user_id = NEW.user_id
    AND id NOT IN (
      SELECT id FROM public.security_logs
      WHERE user_id = NEW.user_id
      ORDER BY created_at DESC
      LIMIT 500
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trim_security_logs_trigger ON public.security_logs;
CREATE TRIGGER trim_security_logs_trigger
  AFTER INSERT ON public.security_logs
  FOR EACH ROW EXECUTE FUNCTION public.trim_security_logs();

-- ── Rate limit tracking table (optional — use if no Redis) ───
-- Only needed if you want persistent rate limiting without Upstash
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  key        TEXT NOT NULL,
  count      INTEGER DEFAULT 1,
  window_end TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (key)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON public.rate_limit_log(window_end);

-- Auto-clean old rate limit entries
CREATE OR REPLACE FUNCTION public.clean_rate_limits()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.rate_limit_log WHERE window_end < NOW();
END;
$$ LANGUAGE plpgsql;

-- ── Additional analytics indexes ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_analytics_event_user
  ON public.analytics_events(event, user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_event
  ON public.analytics_events(created_at DESC, event);

-- ── Convenience view: user dashboard stats ───────────────────
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  p.id                    AS user_id,
  p.email,
  p.plan,
  p.created_at            AS joined_at,
  COUNT(DISTINCT t.id)    AS transaction_count,
  COUNT(DISTINCT g.id)    AS goal_count,
  COUNT(DISTINCT r.id)    AS revenue_count,
  COALESCE(ac.xp, 0)      AS academy_xp,
  COALESCE(ac.streak, 0)  AS academy_streak
FROM public.profiles p
LEFT JOIN public.transactions t        ON t.user_id = p.id
LEFT JOIN public.savings_goals g       ON g.user_id = p.id AND NOT g.completed
LEFT JOIN public.revenue_entries r     ON r.user_id = p.id
LEFT JOIN public.academy_progress ac   ON ac.user_id = p.id
GROUP BY p.id, p.email, p.plan, p.created_at, ac.xp, ac.streak;

-- Only admins should query this view (not exposed via RLS)
