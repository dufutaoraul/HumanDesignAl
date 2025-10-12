-- ================================
-- 人类图 AI 陪伴平台 - Supabase 数据库架构（升级版）
-- 参考 Seth 项目的设计，添加用户付费、积分、会员等功能
-- 在 Supabase Dashboard > SQL Editor 中执行此脚本
-- ================================

-- ================================
-- 1. 会员体系表
-- ================================

-- 1.1 用户会员等级表
CREATE TABLE IF NOT EXISTS public.user_membership_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    monthly_credits INTEGER NOT NULL,
    price_yuan DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入会员等级数据
INSERT INTO public.user_membership_types (name, monthly_credits, price_yuan, description) VALUES
('免费用户', 10, 0.00, '每月10次免费查询'),
('标准会员', 100, 99.00, '每月100次查询，性价比高'),
('高级会员', 500, 299.00, '每月500次查询，无限畅聊')
ON CONFLICT (name) DO NOTHING;

-- 1.2 用户积分记录表
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_credits INTEGER DEFAULT 10,
    used_credits INTEGER DEFAULT 0,
    remaining_credits INTEGER GENERATED ALWAYS AS (total_credits - used_credits) STORED,
    current_membership VARCHAR(50) DEFAULT '免费用户',
    membership_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================
-- 2. 用户图表数据表
-- ================================

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

-- ================================
-- 3. AI 对话历史表
-- ================================

CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_id UUID REFERENCES public.charts(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  dify_conversation_id VARCHAR(100),
  dify_message_id VARCHAR(100),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_chart_id ON public.chat_history(chart_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- ================================
-- 4. 用户配置表
-- ================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- ================================
-- 5. 支付订单表
-- ================================

CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    membership_type VARCHAR(50) NOT NULL,
    amount_yuan DECIMAL(10,2) NOT NULL,
    credits_to_add INTEGER NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'alipay',
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),
    zpay_trade_no VARCHAR(100),
    zpay_response TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_no ON public.payment_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(payment_status);

-- ================================
-- 6. 用户登录日志表
-- ================================

CREATE TABLE IF NOT EXISTS public.user_login_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_method VARCHAR(20) DEFAULT 'email',
    ip_address INET,
    user_agent TEXT,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON public.user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_login_at ON public.user_login_logs(login_at DESC);

-- ================================
-- 7. 积分消耗记录表
-- ================================

CREATE TABLE IF NOT EXISTS public.credit_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    chart_id UUID REFERENCES public.charts(id) ON DELETE SET NULL,
    chat_id UUID REFERENCES public.chat_history(id) ON DELETE SET NULL,
    credits_consumed INTEGER DEFAULT 1,
    remaining_credits_after INTEGER,
    action_type VARCHAR(50) DEFAULT 'chat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_user_id ON public.credit_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_logs_created_at ON public.credit_usage_logs(created_at DESC);

-- ================================
-- 触发器和函数
-- ================================

-- 1. 自动更新updated_at字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. 为需要updated_at的表创建触发器
DROP TRIGGER IF EXISTS update_charts_updated_at ON public.charts;
CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON public.charts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_credits_updated_at ON public.user_credits;
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_orders_updated_at ON public.payment_orders;
CREATE TRIGGER update_payment_orders_updated_at BEFORE UPDATE ON public.payment_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. 新用户自动创建积分记录和配置的函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 创建积分记录
    INSERT INTO public.user_credits (user_id, total_credits, used_credits, current_membership, membership_expires_at)
    VALUES (NEW.id, 10, 0, '免费用户', NULL)
    ON CONFLICT (user_id) DO NOTHING;

    -- 创建用户配置
    INSERT INTO public.user_profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', '用户'))
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. 新用户注册触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. 消费积分的函数
CREATE OR REPLACE FUNCTION consume_user_credit(
    p_user_id UUID,
    p_chart_id UUID DEFAULT NULL,
    p_chat_id UUID DEFAULT NULL,
    p_action_type VARCHAR DEFAULT 'chat'
)
RETURNS BOOLEAN AS $$
DECLARE
    current_remaining INTEGER;
BEGIN
    -- 检查剩余积分
    SELECT remaining_credits INTO current_remaining
    FROM public.user_credits
    WHERE user_id = p_user_id;

    -- 如果积分不足
    IF current_remaining < 1 THEN
        RETURN FALSE;
    END IF;

    -- 扣除积分
    UPDATE public.user_credits
    SET used_credits = used_credits + 1
    WHERE user_id = p_user_id;

    -- 记录消费日志
    INSERT INTO public.credit_usage_logs (user_id, chart_id, chat_id, credits_consumed, remaining_credits_after, action_type)
    VALUES (p_user_id, p_chart_id, p_chat_id, 1, current_remaining - 1, p_action_type);

    RETURN TRUE;
END;
$$ language 'plpgsql';

-- ================================
-- 行级安全策略 (RLS)
-- ================================

-- 启用RLS
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage_logs ENABLE ROW LEVEL SECURITY;

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

-- User Credits 表策略
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
CREATE POLICY "Users can view their own credits"
  ON public.user_credits FOR ALL USING (auth.uid() = user_id);

-- Payment Orders 表策略
DROP POLICY IF EXISTS "Users can view their own orders" ON public.payment_orders;
CREATE POLICY "Users can view their own orders"
  ON public.payment_orders FOR ALL USING (auth.uid() = user_id);

-- Login Logs 表策略
DROP POLICY IF EXISTS "Users can view their own login logs" ON public.user_login_logs;
CREATE POLICY "Users can view their own login logs"
  ON public.user_login_logs FOR ALL USING (auth.uid() = user_id);

-- Credit Usage Logs 表策略
DROP POLICY IF EXISTS "Users can view their own credit logs" ON public.credit_usage_logs;
CREATE POLICY "Users can view their own credit logs"
  ON public.credit_usage_logs FOR ALL USING (auth.uid() = user_id);

-- ================================
-- 视图 - 便于查询
-- ================================

-- 用户当前状态视图
CREATE OR REPLACE VIEW public.user_status_view AS
SELECT
    u.id as user_id,
    u.email,
    up.name as user_name,
    up.avatar_url,
    uc.total_credits,
    uc.used_credits,
    uc.remaining_credits,
    uc.current_membership,
    uc.membership_expires_at,
    CASE
        WHEN uc.membership_expires_at > NOW() OR uc.membership_expires_at IS NULL THEN true
        ELSE false
    END as membership_active,
    u.created_at as user_created_at
FROM auth.users u
LEFT JOIN public.user_credits uc ON u.id = uc.user_id
LEFT JOIN public.user_profiles up ON u.id = up.user_id;

-- ================================
-- 完成
-- ================================

-- 提示信息
DO $$
BEGIN
    RAISE NOTICE '✅ 数据库架构创建成功！';
    RAISE NOTICE '📊 已创建以下表:';
    RAISE NOTICE '   - user_membership_types (会员等级)';
    RAISE NOTICE '   - user_credits (用户积分)';
    RAISE NOTICE '   - charts (图表数据)';
    RAISE NOTICE '   - chat_history (对话历史)';
    RAISE NOTICE '   - user_profiles (用户配置)';
    RAISE NOTICE '   - payment_orders (支付订单)';
    RAISE NOTICE '   - user_login_logs (登录日志)';
    RAISE NOTICE '   - credit_usage_logs (积分使用日志)';
    RAISE NOTICE '🔒 已启用行级安全策略 (RLS)';
    RAISE NOTICE '⚡ 已创建触发器和函数';
END $$;
