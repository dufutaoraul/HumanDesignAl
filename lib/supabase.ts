/**
 * Supabase Client 配置
 * 用于与 Supabase 数据库交互
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 环境变量。请在 .env.local 文件中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

/**
 * Supabase 客户端实例
 * 用于客户端和服务端的数据库操作
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 数据库表名常量
 */
export const TABLES = {
  USERS: 'users',
  CHARTS: 'charts', // 用户的人类图数据
  CHAT_HISTORY: 'chat_history', // AI 对话历史
  INCARNATION_CROSSES: 'incarnation_crosses', // 轮回交叉数据
  CHANNELS: 'channels', // 通道数据
  GATES: 'gates', // 闸门数据
  CENTERS: 'centers', // 能量中心数据
} as const
