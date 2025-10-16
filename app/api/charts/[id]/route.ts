/**
 * Chart详情和删除API - 动态路由
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/charts/[id] - 获取单个chart详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: chart, error } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('查询chart失败:', error)
      return NextResponse.json(
        { error: '未找到该人类图资料' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chart })
  } catch (error) {
    console.error('GET chart详情错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// DELETE /api/charts/[id] - 删除chart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除chart失败:', error)
      return NextResponse.json(
        { error: '删除失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE chart错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
