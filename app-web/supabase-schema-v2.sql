-- ============================================
-- 人类图 AI 陪伴平台 - Supabase 数据库结构 V2
-- 基于用户上传图片的模式
-- ============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 人类图数据表 (基于用户上传)
CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 基本信息
  chart_name TEXT NOT NULL, -- 人类图名称（可以是姓名或备注）
  chart_image_url TEXT, -- 上传的人类图图片 URL (Supabase Storage)

  -- 核心属性
  profile TEXT NOT NULL, -- 人生角色，例如: 3/5, 1/3
  incarnation_cross_key TEXT, -- 轮回交叉键，例如: right-1-2
  incarnation_cross_name TEXT NOT NULL, -- 轮回交叉名称
  incarnation_cross_english TEXT, -- 轮回交叉英文名

  type TEXT NOT NULL, -- 类型: 显示者/生产者/显示生产者/投射者/反映者
  type_english TEXT NOT NULL,

  authority TEXT NOT NULL, -- 内在权威
  authority_english TEXT NOT NULL,

  definition_type TEXT NOT NULL, -- 几分人: 1分人/2分人/3分人/4分人/无定义

  -- 四个交点 (Nodes)
  design_south_node TEXT NOT NULL, -- 设计南交点 (红色), 格式: "11.3"
  design_north_node TEXT NOT NULL, -- 设计北交点 (红色), 格式: "12.3"
  personality_south_node TEXT NOT NULL, -- 人格南交点 (黑色), 格式: "11.3"
  personality_north_node TEXT NOT NULL, -- 人格北交点 (黑色), 格式: "12.3"

  -- 通道列表 (JSON 数组)
  channels JSONB NOT NULL DEFAULT '[]', -- 例如: ["1-8", "7-31", "10-20"]

  -- 行星闸门数据 (JSON 对象)
  -- 格式: { "sun": {"design": "23.4", "personality": "43.2"}, "earth": {...}, ... }
  planetary_gates JSONB NOT NULL DEFAULT '{}',

  -- 激活的闸门（自动从 planetary_gates 计算，方便查询）
  activated_gates JSONB NOT NULL DEFAULT '[]', -- 例如: [{"gate": 23, "line": 4, "color": "red"}, ...]

  -- 被定义的中心（自动从 channels 计算）
  defined_centers JSONB NOT NULL DEFAULT '[]', -- 例如: ["g", "throat", "sacral"]

  -- 备注和标签
  notes TEXT, -- 用户自定义备注
  tags JSONB DEFAULT '[]', -- 标签，例如: ["家人", "朋友"]

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI 对话历史表
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chart_id UUID REFERENCES charts(id) ON DELETE SET NULL,

  role TEXT NOT NULL, -- 'user' 或 'assistant'
  content TEXT NOT NULL,

  -- 对话上下文
  session_id UUID, -- 同一次对话的会话 ID
  topic TEXT, -- 对话主题(如: 类型分析、通道解读、职业建议等)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 轮回交叉静态数据表 (192条)
CREATE TABLE IF NOT EXISTS incarnation_crosses (
  id SERIAL PRIMARY KEY,
  cross_key TEXT UNIQUE NOT NULL, -- 例如: right-1-2, left-1-2, juxta-1
  cross_type TEXT NOT NULL, -- right/left/juxta

  chinese_name TEXT NOT NULL,
  english_name TEXT NOT NULL,

  -- 组成闸门
  black_sun_gate INTEGER NOT NULL,
  red_sun_gate INTEGER NOT NULL,
  black_earth_gate INTEGER NOT NULL,
  red_earth_gate INTEGER NOT NULL,

  -- 爻线信息
  line_info TEXT, -- 例如: "1/1", "4/1"

  -- 描述信息
  description TEXT,
  keywords JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 通道静态数据表 (36条)
CREATE TABLE IF NOT EXISTS channels (
  id SERIAL PRIMARY KEY,
  channel_key TEXT UNIQUE NOT NULL, -- 例如: 1-8

  gate1 INTEGER NOT NULL,
  gate2 INTEGER NOT NULL,

  center1 TEXT NOT NULL,
  center1_chinese TEXT NOT NULL,
  center1_english TEXT NOT NULL,

  center2 TEXT NOT NULL,
  center2_chinese TEXT NOT NULL,
  center2_english TEXT NOT NULL,

  chinese_name TEXT NOT NULL,
  english_name TEXT NOT NULL,
  description TEXT,

  -- 连接类型
  connection_key TEXT NOT NULL, -- 例如: g-throat
  connection_chinese TEXT NOT NULL,
  connection_english TEXT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 闸门静态数据表 (64个)
CREATE TABLE IF NOT EXISTS gates (
  gate INTEGER PRIMARY KEY,
  gate_name TEXT NOT NULL, -- 易经卦名

  center TEXT NOT NULL,
  center_chinese TEXT NOT NULL,
  center_english TEXT NOT NULL,

  -- 对宫闸门
  opposite_gate INTEGER NOT NULL,
  opposite_name TEXT NOT NULL,

  -- 描述信息
  description TEXT,
  keywords JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 能量中心静态数据表 (9个)
CREATE TABLE IF NOT EXISTS centers (
  center_key TEXT PRIMARY KEY, -- g, throat, ajna, head, sacral, spleen, solar_plexus, heart, root
  chinese_name TEXT NOT NULL,
  english_name TEXT NOT NULL,

  -- 中心类型
  is_motor BOOLEAN DEFAULT FALSE, -- 是否是动力中心

  description TEXT,
  keywords JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 索引优化
-- ============================================

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 人类图数据表索引
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_type ON charts(type);
CREATE INDEX IF NOT EXISTS idx_charts_incarnation_cross ON charts(incarnation_cross_key);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);

-- 对话历史表索引
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_chart_id ON chat_history(chart_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

-- 静态数据表索引
CREATE INDEX IF NOT EXISTS idx_incarnation_crosses_type ON incarnation_crosses(cross_type);
CREATE INDEX IF NOT EXISTS idx_channels_connection ON channels(connection_key);
CREATE INDEX IF NOT EXISTS idx_gates_center ON gates(center);

-- ============================================
-- 行级安全策略 (RLS)
-- ============================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own charts" ON charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts" ON charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts" ON charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts" ON charts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 静态数据表允许所有人读取
ALTER TABLE incarnation_crosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read incarnation crosses" ON incarnation_crosses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read channels" ON channels
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read gates" ON gates
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read centers" ON centers
  FOR SELECT USING (true);

-- ============================================
-- 存储桶策略 (Storage Bucket)
-- ============================================

-- 注意：存储桶需要在 Supabase Dashboard 中手动创建
-- 创建名为 'chart-images' 的存储桶，然后执行以下策略

-- 允许用户上传自己的人类图图片
-- CREATE POLICY "Users can upload own chart images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'chart-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- 允许用户查看自己的人类图图片
-- CREATE POLICY "Users can view own chart images" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'chart-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- 允许用户删除自己的人类图图片
-- CREATE POLICY "Users can delete own chart images" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'chart-images' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================
-- 更新时间戳触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON charts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 示例数据说明
-- ============================================

-- charts 表的 planetary_gates 字段示例:
-- {
--   "sun": {"design": "23.4", "personality": "43.2"},
--   "earth": {"design": "43.4", "personality": "23.2"},
--   "moon": {"design": "5.2", "personality": "35.1"},
--   "north_node": {"design": "11.3", "personality": "11.3"},
--   "south_node": {"design": "12.3", "personality": "12.3"},
--   "mercury": {"design": "17.5", "personality": "62.3"},
--   "venus": {"design": "31.2", "personality": "7.4"},
--   "mars": {"design": "34.1", "personality": "20.5"},
--   "jupiter": {"design": "46.6", "personality": "29.3"},
--   "saturn": {"design": "54.2", "personality": "32.1"},
--   "uranus": {"design": "18.4", "personality": "58.2"},
--   "neptune": {"design": "38.3", "personality": "28.5"},
--   "pluto": {"design": "41.1", "personality": "30.4"}
-- }

-- channels 字段示例:
-- ["1-8", "7-31", "10-20", "13-33"]

-- activated_gates 字段示例:
-- [
--   {"gate": 23, "line": 4, "color": "red", "planet": "sun"},
--   {"gate": 43, "line": 2, "color": "black", "planet": "sun"},
--   {"gate": 5, "line": 2, "color": "red", "planet": "moon"}
-- ]
