/**
 * 人类图资料列表 API
 * 查询用户的所有人类图数据
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // 从请求头或查询参数获取userId
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: '未提供用户ID' },
        { status: 400 }
      )
    }

    // 查询用户的所有人类图数据
    const { data: charts, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('查询人类图数据失败:', error)
      throw error
    }

    return NextResponse.json({
      charts: charts || []
    })

  } catch (error: unknown) {
    console.error('Charts API 错误:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { error: errorMessage, charts: [] },
      { status: 500 }
    )
  }
}
