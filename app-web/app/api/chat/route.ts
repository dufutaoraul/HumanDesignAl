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
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1'
    const difyWorkflowUrl = `${difyApiUrl}/workflows/run`

    console.log('Dify配置检查:', {
      hasApiKey: !!difyApiKey,
      apiUrl: difyApiUrl,
      workflowUrl: difyWorkflowUrl
    })

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
      const { data: charts, error } = await supabase
        .from('charts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_self', true)
        .limit(1)
        .single()

      if (error) {
        console.log('查询用户人类图数据失败或未找到:', error.message)
      } else {
        userChartData = charts
        console.log('成功查询到用户人类图数据:', userChartData?.name)
      }
    }

    // 从 chart_data.analysis 中提取人类图数据
    const chartAnalysis = userChartData?.chart_data?.analysis
    const chartPlanets = userChartData?.chart_data?.planets

    // 准备传递给Dify的inputs（按照你的Dify设置）
    const difyInputs = {
      user_name: userChartData?.name || '未设置',
      hd_type: chartAnalysis?.type || '',
      hd_profile: chartAnalysis?.profile || '',
      hd_authority: chartAnalysis?.authority || '',
      hd_definition: chartAnalysis?.definition || '',
      hd_cross: chartAnalysis?.incarnationCross?.full || '',
      hd_channels: chartAnalysis?.channels?.join(', ') || '',
      // 从 planets 中提取南北交点信息
      hd_design_south_node: (() => {
        const node = chartPlanets?.design?.SouthNode as unknown as { gate?: number; line?: number }
        return node?.gate && node?.line ? `${node.gate}-${node.line}` : ''
      })(),
      hd_design_north_node: (() => {
        const node = chartPlanets?.design?.NorthNode as unknown as { gate?: number; line?: number }
        return node?.gate && node?.line ? `${node.gate}-${node.line}` : ''
      })(),
      hd_personality_south_node: (() => {
        const node = chartPlanets?.personality?.SouthNode as unknown as { gate?: number; line?: number }
        return node?.gate && node?.line ? `${node.gate}-${node.line}` : ''
      })(),
      hd_personality_north_node: (() => {
        const node = chartPlanets?.personality?.NorthNode as unknown as { gate?: number; line?: number }
        return node?.gate && node?.line ? `${node.gate}-${node.line}` : ''
      })()
    }

    console.log('发送给Dify的数据:', { inputs: difyInputs, query: message, userId })

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
      console.error('Dify API 错误响应:', {
        status: difyResponse.status,
        statusText: difyResponse.statusText,
        body: errorText
      })
      throw new Error(`Dify API 返回错误: ${difyResponse.status} - ${errorText}`)
    }

    const difyData = await difyResponse.json()
    console.log('Dify API 响应:', JSON.stringify(difyData, null, 2))

    // 从workflow响应中提取答案
    // Dify workflow的响应格式可能是: { data: { outputs: { text: "..." } } }
    const answerText = difyData.data?.outputs?.text ||
                      difyData.data?.outputs?.answer ||
                      difyData.answer ||
                      difyData.text ||
                      '抱歉，我暂时无法回复。'

    console.log('提取的答案文本:', answerText)

    return NextResponse.json({
      message: answerText,
      conversationId: difyData.conversation_id,
    })

  } catch (error: unknown) {
    console.error('Chat API 错误:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''

    console.error('完整错误堆栈:', errorStack)

    return NextResponse.json(
      {
        message: `❌ 调用失败：${errorMessage}\n\n请查看Vercel日志获取详细信息。`,
        error: errorMessage,
      },
      { status: 200 }
    )
  }
}
