/**
 * 与高我对话界面 - 主对话页面
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UserChart {
  id: string
  name: string
  birth_datetime: string
  birth_location: string
  analysis: any
}

export default function ChatPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [userCharts, setUserCharts] = useState<UserChart[]>([])
  const [selectedChart, setSelectedChart] = useState<UserChart | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 如果未登录，重定向到首页
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // 加载用户的人类图资料
    if (user) {
      loadUserCharts()
    }
  }, [user])

  const loadUserCharts = async () => {
    try {
      const response = await fetch('/api/charts')
      if (response.ok) {
        const data = await response.json()
        setUserCharts(data.charts || [])
      }
    } catch (error) {
      console.error('加载人类图资料失败:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsSending(true)

    try {
      // TODO: 接入Dify API
      // 这里需要配置Dify的API endpoint和key
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          chartData: selectedChart ? {
            name: selectedChart.name,
            analysis: selectedChart.analysis
          } : null
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('发送消息失败')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回复。请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未登录，显示加载状态（即将跳转）
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在跳转...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            人类图 AI 高我陪伴
          </h1>
          {selectedChart && (
            <span className="text-sm text-gray-600">
              正在参考：{selectedChart.name} 的人类图
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            {showSidebar ? '隐藏' : '显示'}人类图工具
          </button>
          <Link
            href="/calculate"
            className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            计算人类图
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 主对话区域 */}
        <div className="flex-1 flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    欢迎与你的高我对话
                  </h2>
                  <p className="text-gray-600 mb-8">
                    在这里，你可以探索内在智慧，获得人生指引。如果你已经有人类图资料，可以在右侧选择，让对话更加个性化。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-purple-600 mb-2">💬 自由对话</h3>
                      <p className="text-sm text-gray-600">
                        无需人类图，直接开始与高我的对话，探索你的内在世界
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-purple-600 mb-2">🎯 个性化指引</h3>
                      <p className="text-sm text-gray-600">
                        结合你的人类图资料，获得更精准的个性化建议和指引
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入框 */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="输入你想说的话..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !inputMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSending ? '发送中...' : '发送'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 侧边栏 - 人类图工具 */}
        {showSidebar && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">人类图资料</h2>

              {userCharts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">暂无人类图资料</p>
                  <Link
                    href="/calculate"
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    计算人类图
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedChart(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      !selectedChart
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">不使用人类图</p>
                    <p className="text-xs text-gray-500 mt-1">自由对话模式</p>
                  </button>

                  {userCharts.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => setSelectedChart(chart)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedChart?.id === chart.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{chart.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(chart.birth_datetime).toLocaleDateString()}
                      </p>
                      {chart.analysis && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-600">
                            类型: {chart.analysis.type || '未知'}
                          </p>
                          <p className="text-xs text-gray-600">
                            策略: {chart.analysis.strategy || '未知'}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
