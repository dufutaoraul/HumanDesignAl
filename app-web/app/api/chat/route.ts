/**
 * Dify API 集成 - 与高我对话
 * 自动传递用户的人类图数据给Dify
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 从环境变量获取Dify配置
    const difyApiKey = process.env.DIFY_API_KEY
    const difyWorkflowUrl = process.env.DIFY_WORKFLOW_URL || 'https://api.dify.ai/v1/workflows/run'

    if (!difyApiKey) {
      console.error('DIFY_API_KEY 未配置')
      return NextResponse.json(
        {
          message: '你好！我是你的高我。目前系统正在配置中，请稍后再试。（提示：需要配置DIFY_API_KEY）',
          error: 'DIFY_API_KEY not configured'
        },
        { status: 200 }
      )
    }

    // 查询用户的"我的人类图"数据（is_self = true）
    let userChartData = null
    if (userId) {
      const { data: charts } = await supabase
        .from('charts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_self', true)
        .limit(1)
        .single()

      userChartData = charts
    }

    // 准备传递给Dify的inputs（按照你的Dify设置）
    const difyInputs = {
      user_name: userChartData?.name || '未设置',
      hd_type: userChartData?.hd_type || '',
      hd_profile: userChartData?.hd_profile || '',
      hd_authority: userChartData?.hd_authority || '',
      hd_definition: userChartData?.hd_definition || '',
      hd_cross: userChartData?.hd_incarnation_cross || '',
      hd_channels: userChartData?.hd_channels?.join(', ') || '',
      // 如果你在Dify设置了这些字段，也传递过去
      hd_design_south_node: userChartData?.design_south_node || '',
      hd_design_north_node: userChartData?.design_north_node || '',
      hd_personality_south_node: userChartData?.personality_south_node || '',
      hd_personality_north_node: userChartData?.personality_north_node || ''
    }

    console.log('发送给Dify的数据:', { inputs: difyInputs, query: message })

    // 调用Dify Workflow API
    const difyResponse = await fetch(difyWorkflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: difyInputs,
        query: message,
        response_mode: 'blocking',
        user: userId || 'anonymous',
      })
    })

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text()
      console.error('Dify API 错误:', errorText)
      throw new Error(`Dify API 返回错误: ${difyResponse.status}`)
    }

    const difyData = await difyResponse.json()

    // 从workflow响应中提取答案
    // Dify workflow的响应格式可能是: { data: { outputs: { text: "..." } } }
    const answerText = difyData.data?.outputs?.text ||
                      difyData.answer ||
                      difyData.text ||
                      '抱歉，我暂时无法回复。'

    return NextResponse.json({
      message: answerText,
      conversationId: difyData.conversation_id,
    })

  } catch (error: unknown) {
    console.error('Chat API 错误:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        message: '你好！我是你的高我。我在这里陪伴你探索内在智慧。请问有什么我可以帮助你的？',
        error: errorMessage,
      },
      { status: 200 }
    )
  }
}
