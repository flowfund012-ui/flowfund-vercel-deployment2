-- ════════════════════════════════════════════════════════════
-- FlowFund OS — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  full_name    TEXT,
  avatar_url   TEXT,
  plan         TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','premium')),
  plan_expires_at TIMESTAMPTZ,
  onboarded    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRANSACTIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('income','expense')),
  description  TEXT NOT NULL,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category     TEXT NOT NULL DEFAULT 'Other' CHECK (category IN (
    'Food','Transport','Housing','Entertainment','Health','Business','Savings','Other'
  )),
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAVINGS GOALS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '💰 Custom',
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline     DATE,
  completed    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUTOPILOT SETTINGS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.autopilot_settings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  smart_save       BOOLEAN DEFAULT true,
  smart_save_pct   INTEGER DEFAULT 20 CHECK (smart_save_pct BETWEEN 1 AND 100),
  auto_invest      BOOLEAN DEFAULT false,
  auto_invest_pct  INTEGER DEFAULT 10 CHECK (auto_invest_pct BETWEEN 1 AND 100),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REVENUE ENTRIES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revenue_entries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source       TEXT NOT NULL,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type         TEXT NOT NULL DEFAULT 'One-time' CHECK (type IN (
    'Recurring','One-time','Product Sale','Affiliate','Service'
  )),
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ACADEMY PROGRESS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.academy_progress (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  xp                INTEGER DEFAULT 0,
  completed_courses TEXT[] DEFAULT '{}',
  streak            INTEGER DEFAULT 0,
  last_challenge    DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VAULT DOWNLOADS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vault_downloads (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id     TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, asset_id)
);

-- ─── SECURITY LOGS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.security_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event        TEXT NOT NULL,
  type         TEXT DEFAULT 'info' CHECK (type IN ('info','success','error')),
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAYMENT ORDERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_order_id TEXT,           -- NOWPayments payment_id
  provider          TEXT DEFAULT 'nowpayments',
  plan              TEXT NOT NULL CHECK (plan IN ('pro','premium')),
  amount_usd        NUMERIC(10,2) NOT NULL,
  currency          TEXT DEFAULT 'btc',
  status            TEXT DEFAULT 'pending' CHECK (status IN (
    'pending','waiting','confirming','confirmed','sending',
    'partially_paid','finished','failed','refunded','expired'
  )),
  pay_address       TEXT,           -- crypto address to pay to
  pay_amount        NUMERIC(20,10), -- crypto amount
  actually_paid     NUMERIC(20,10) DEFAULT 0,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopilot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_downloads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders     ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Transactions ──
CREATE POLICY "Users CRUD own transactions"
  ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- ── Savings Goals ──
CREATE POLICY "Users CRUD own goals"
  ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

-- ── AutoPilot ──
CREATE POLICY "Users CRUD own autopilot"
  ON public.autopilot_settings FOR ALL USING (auth.uid() = user_id);

-- ── Revenue ──
CREATE POLICY "Users CRUD own revenue"
  ON public.revenue_entries FOR ALL USING (auth.uid() = user_id);

-- ── Academy ──
CREATE POLICY "Users CRUD own academy"
  ON public.academy_progress FOR ALL USING (auth.uid() = user_id);

-- ── Vault ──
CREATE POLICY "Users CRUD own downloads"
  ON public.vault_downloads FOR ALL USING (auth.uid() = user_id);

-- ── Security Logs ──
CREATE POLICY "Users CRUD own logs"
  ON public.security_logs FOR ALL USING (auth.uid() = user_id);

-- ── Payments ──
CREATE POLICY "Users can view own orders"
  ON public.payment_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders"
  ON public.payment_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile + academy + autopilot on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.academy_progress (user_id) VALUES (NEW.id);
  INSERT INTO public.autopilot_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_goals_updated_at
  BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_autopilot_updated_at
  BEFORE UPDATE ON public.autopilot_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_academy_updated_at
  BEFORE UPDATE ON public.academy_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Update plan after payment confirmed
CREATE OR REPLACE FUNCTION public.activate_plan_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status != 'finished' THEN
    UPDATE public.profiles
    SET
      plan = NEW.plan,
      plan_expires_at = NOW() + INTERVAL '1 year',
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER activate_plan_on_payment
  AFTER UPDATE ON public.payment_orders
  FOR EACH ROW EXECUTE FUNCTION public.activate_plan_after_payment();

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════
CREATE INDEX idx_transactions_user_id   ON public.transactions(user_id);
CREATE INDEX idx_transactions_date      ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type      ON public.transactions(type);
CREATE INDEX idx_goals_user_id          ON public.savings_goals(user_id);
CREATE INDEX idx_revenue_user_id        ON public.revenue_entries(user_id);
CREATE INDEX idx_revenue_date           ON public.revenue_entries(date DESC);
CREATE INDEX idx_security_logs_user_id  ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_created  ON public.security_logs(created_at DESC);
CREATE INDEX idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX idx_payment_orders_status  ON public.payment_orders(status);
