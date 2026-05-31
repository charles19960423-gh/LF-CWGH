-- 林峰 Life OS V1 — 初始 Schema（6 张表）
-- 在 Supabase Dashboard → SQL Editor 中执行

-- users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own" ON public.users FOR ALL
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  account TEXT,
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_tx_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_tx_user_type ON public.transactions(user_id, type, date DESC);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx_own" ON public.transactions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- assets
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets_own" ON public.assets FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- liabilities
CREATE TABLE public.liabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  interest_rate DECIMAL(5,4),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.liabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "liabilities_own" ON public.liabilities FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  target_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals_own" ON public.goals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  income_total DECIMAL(12,2),
  expense_total DECIMAL(12,2),
  saving_rate DECIMAL(5,2),
  income_breakdown JSONB,
  expense_breakdown JSONB,
  ai_summary TEXT,
  ai_suggestions JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, month)
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_own" ON public.reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 注册自动创建 users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
