-- ================================
-- 检查表结构脚本
-- ================================

-- 1. 查看 charts 表的完整结构
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'charts'
ORDER BY ordinal_position;

-- 2. 查看所有 public schema 的表
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. 如果 charts 表缺少字段，重建它
DROP TABLE IF EXISTS public.charts CASCADE;

CREATE TABLE public.charts (
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

CREATE INDEX idx_charts_user_id ON public.charts(user_id);
CREATE INDEX idx_charts_created_at ON public.charts(created_at DESC);

-- 4. 启用 RLS
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

-- 5. 删除旧策略并重建
DROP POLICY IF EXISTS "Users can view their own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can insert their own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can update their own charts" ON public.charts;
DROP POLICY IF EXISTS "Users can delete their own charts" ON public.charts;

CREATE POLICY "Users can view their own charts"
  ON public.charts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own charts"
  ON public.charts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own charts"
  ON public.charts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charts"
  ON public.charts FOR DELETE USING (auth.uid() = user_id);

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ Charts 表已重建！';
    RAISE NOTICE '📊 请查看上方查询结果确认表结构';
END $$;
