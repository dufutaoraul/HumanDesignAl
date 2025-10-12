/**
 * Dify API 集成 - 与高我对话
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, chartData } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 从环境变量获取Dify配置
    const difyApiKey = process.env.DIFY_API_KEY
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1'

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

    // 构建发送给Dify的消息
    let contextMessage = message

    // 如果用户选择了人类图资料，将其作为上下文
    if (chartData) {
      const context = `
用户资料：
- 姓名：${chartData.name}
- 类型：${chartData.analysis?.type || '未知'}
- 策略：${chartData.analysis?.strategy || '未知'}
- 内在权威：${chartData.analysis?.authority || '未知'}
- 人生角色：${chartData.analysis?.profile || '未知'}
- 轮回交叉：${chartData.analysis?.incarnationCross || '未知'}

用户问题：${message}
`
      contextMessage = context
    }

    // 调用Dify API
    const difyResponse = await fetch(`${difyApiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: contextMessage,
        response_mode: 'blocking',
        user: 'user',
      })
    })

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text()
      console.error('Dify API 错误:', errorText)
      throw new Error(`Dify API 返回错误: ${difyResponse.status}`)
    }

    const difyData = await difyResponse.json()

    return NextResponse.json({
      message: difyData.answer || difyData.text || '抱歉，我暂时无法回复。',
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
