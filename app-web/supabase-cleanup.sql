-- ============================================
-- 清理旧的数据库结构
-- 在执行 supabase-schema-v2.sql 前运行此脚本
-- ============================================

-- 删除所有策略
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own charts" ON charts;
DROP POLICY IF EXISTS "Users can insert own charts" ON charts;
DROP POLICY IF EXISTS "Users can update own charts" ON charts;
DROP POLICY IF EXISTS "Users can delete own charts" ON charts;
DROP POLICY IF EXISTS "Users can view own chat history" ON chat_history;
DROP POLICY IF EXISTS "Users can insert own chat history" ON chat_history;
DROP POLICY IF EXISTS "Anyone can read incarnation crosses" ON incarnation_crosses;
DROP POLICY IF EXISTS "Anyone can read channels" ON channels;
DROP POLICY IF EXISTS "Anyone can read gates" ON gates;
DROP POLICY IF EXISTS "Anyone can read centers" ON centers;

-- 删除触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_charts_updated_at ON charts;

-- 删除函数
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 删除所有表（按依赖顺序）
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS charts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS incarnation_crosses CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS gates CASCADE;
DROP TABLE IF EXISTS centers CASCADE;

-- 完成
SELECT 'All tables and policies dropped successfully!' as status;
