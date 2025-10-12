-- ================================
-- 添加关系标签系统 (Relationship Tagging System)
-- ================================

-- 1. 添加 relationship 字段到 charts 表
ALTER TABLE public.charts
ADD COLUMN IF NOT EXISTS relationship VARCHAR(50) DEFAULT '其他';

-- 2. 创建部分唯一索引 - 确保每个用户只能有一个"本人"标签
-- 使用 WHERE 子句创建部分索引，只对 relationship='本人' 的行生效
CREATE UNIQUE INDEX IF NOT EXISTS idx_charts_user_self
ON public.charts (user_id)
WHERE relationship = '本人';

-- 3. 为 relationship 字段创建普通索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_charts_relationship
ON public.charts (relationship);

-- 4. 创建自定义标签表（用户可以添加自己的标签）
CREATE TABLE IF NOT EXISTS public.relationship_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT relationship_tags_unique_per_user UNIQUE(user_id, tag_name)
);

CREATE INDEX IF NOT EXISTS idx_relationship_tags_user_id
ON public.relationship_tags(user_id);

-- 5. 启用 RLS for relationship_tags 表
ALTER TABLE public.relationship_tags ENABLE ROW LEVEL SECURITY;

-- 6. Relationship Tags 表的 RLS 策略
DROP POLICY IF EXISTS "Users can view their own tags" ON public.relationship_tags;
CREATE POLICY "Users can view their own tags"
  ON public.relationship_tags FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tags" ON public.relationship_tags;
CREATE POLICY "Users can insert their own tags"
  ON public.relationship_tags FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tags" ON public.relationship_tags;
CREATE POLICY "Users can delete their own tags"
  ON public.relationship_tags FOR DELETE USING (auth.uid() = user_id);

-- 7. 创建触发器函数 - 在插入/更新时检查"本人"标签的唯一性
CREATE OR REPLACE FUNCTION check_self_tag_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果新的或更新的记录使用"本人"标签
  IF NEW.relationship = '本人' THEN
    -- 检查是否已经存在其他"本人"标签的记录
    IF EXISTS (
      SELECT 1 FROM public.charts
      WHERE user_id = NEW.user_id
        AND relationship = '本人'
        AND id != NEW.id
    ) THEN
      RAISE EXCEPTION '每个用户只能有一个"本人"标签的人类图。请先删除或修改现有的"本人"图。';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 创建触发器
DROP TRIGGER IF EXISTS trigger_check_self_tag ON public.charts;
CREATE TRIGGER trigger_check_self_tag
  BEFORE INSERT OR UPDATE ON public.charts
  FOR EACH ROW
  EXECUTE FUNCTION check_self_tag_uniqueness();

-- 9. 为现有用户插入默认的预定义标签
-- 注意：这会为每个现有用户创建默认标签，如果用户不存在则跳过
INSERT INTO public.relationship_tags (user_id, tag_name)
SELECT DISTINCT u.id, tag.name
FROM auth.users u
CROSS JOIN (
  VALUES ('本人'), ('家人'), ('朋友'), ('同事'), ('名人'), ('其他')
) AS tag(name)
ON CONFLICT (user_id, tag_name) DO NOTHING;

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 关系标签系统已创建！';
    RAISE NOTICE '📊 已添加 relationship 字段到 charts 表';
    RAISE NOTICE '🔒 已创建"本人"标签唯一性约束';
    RAISE NOTICE '🏷️ 已创建 relationship_tags 表用于自定义标签';
    RAISE NOTICE '⚡ 已创建触发器自动验证"本人"标签唯一性';
    RAISE NOTICE '';
    RAISE NOTICE '预定义标签：本人、家人、朋友、同事、名人、其他';
    RAISE NOTICE '用户可以通过 relationship_tags 表添加自定义标签';
END $$;
