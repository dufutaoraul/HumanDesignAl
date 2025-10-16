-- ================================
-- 简化版数据库脚本 - 只创建核心表
-- ================================

-- 1. 用户图表数据表
CREATE TABLE IF NOT EXISTS public.charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Shanghai',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  chart_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charts_user_id ON public.charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON public.charts(created_at DESC);

-- 2. AI 对话历史表
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_id UUID REFERENCES public.charts(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_chart_id ON public.chat_history(chart_id);

-- 3. 用户配置表
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- 启用RLS
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Charts 表策略
DROP POLICY IF EXISTS "Users can view their own charts" ON public.charts;
CREATE POLICY "Users can view their own charts"
  ON public.charts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own charts" ON public.charts;
CREATE POLICY "Users can insert their own charts"
  ON public.charts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own charts" ON public.charts;
CREATE POLICY "Users can update their own charts"
  ON public.charts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own charts" ON public.charts;
CREATE POLICY "Users can delete their own charts"
  ON public.charts FOR DELETE USING (auth.uid() = user_id);

-- Chat History 表策略
DROP POLICY IF EXISTS "Users can view their own chat history" ON public.chat_history;
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat history" ON public.chat_history;
CREATE POLICY "Users can insert their own chat history"
  ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own chat history" ON public.chat_history;
CREATE POLICY "Users can delete their own chat history"
  ON public.chat_history FOR DELETE USING (auth.uid() = user_id);

-- User Profiles 表策略
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 基础表创建成功！';
    RAISE NOTICE '📊 已创建: charts, chat_history, user_profiles';
    RAISE NOTICE '🔒 已启用 RLS 安全策略';
END $$;
