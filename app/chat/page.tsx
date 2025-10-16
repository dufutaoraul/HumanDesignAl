/**
 * 与高我对话界面 - 标准简洁设计
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Plus,
  Menu,
  User as UserIcon,
  Bot,
  Trash2,
  Sparkles,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

export default function ChatPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [hasHumanDesign, setHasHumanDesign] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 如果未登录，重定向到首页
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // 检查用户是否有人类图数据
    const checkHumanDesign = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/charts?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          const hasSelfChart = data.charts?.some((chart: { relationship: string }) => chart.relationship === '本人')
          setHasHumanDesign(hasSelfChart)
        }
      } catch (error) {
        console.error('检查人类图数据失败:', error)
      }
    }

    checkHumanDesign()
  }, [user])

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createNewConversation = () => {
    setCurrentConversation(null)
    setMessages([])
    setSidebarOpen(false)
  }

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    // TODO: 加载会话消息
    setSidebarOpen(false)
  }

  
  const deleteConversation = (conversationId: string) => {
    if (!confirm('确定要删除这个对话吗？删除后无法恢复。')) {
      return
    }

    setConversations(conversations.filter(c => c.id !== conversationId))

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null)
      setMessages([])
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isSending || !user) return

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user.id
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

        // 如果是新对话，创建会话记录
        if (!currentConversation && messages.length === 0) {
          const newConversation: Conversation = {
            id: Date.now().toString(),
            title: inputMessage.slice(0, 20) + (inputMessage.length > 20 ? '...' : ''),
            lastMessage: data.message.slice(0, 50),
            updatedAt: new Date()
          }
          setCurrentConversation(newConversation)
          setConversations(prev => [newConversation, ...prev])
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未登录，显示加载状态（即将跳转）
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">正在跳转...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen main-content flex">
      {/* 全新设计：左侧简洁面板 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10"
          >
            <div className="p-6 space-y-6">
              {/* 用户信息卡片 */}
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80 font-medium">用户</p>
                    <p className="text-xs text-white/60 truncate">{user.email}</p>
                  </div>
                </div>
                {hasHumanDesign && (
                  <div className="flex items-center text-xs text-green-400 bg-green-400/10 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    已录入人类图
                  </div>
                )}
              </div>

              {/* 新对话按钮 */}
              <button
                onClick={createNewConversation}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 px-4 font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>新对话</span>
              </button>

              {/* 对话列表 */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">对话历史</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        currentConversation?.id === conversation.id
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{conversation.title}</p>
                          <p className="text-xs text-white/50 mt-1">
                            {conversation.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteConversation(conversation.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 底部操作 */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => router.push('/charts')}
                  className="w-full text-left text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  人类图管理
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  退出登录
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全新设计：主聊天区域 */}
      <div className="flex-1 flex flex-col bg-black/20">
        {/* 简洁顶部栏 */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {currentConversation?.title || '与高我对话'}
                </h1>
                <p className="text-xs text-white/60">AI心灵陪伴</p>
              </div>
            </div>
            {!hasHumanDesign && (
              <button
                onClick={() => router.push('/calculate')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
              >
                录入人类图
              </button>
            )}
          </div>
        </header>

        {/* 聊天内容区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <main className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">开始与你的高我对话</h2>
                  <p className="text-sm text-white/60">
                    探索内在智慧，获得人生指引
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white/10 text-white backdrop-blur-sm rounded-bl-sm border border-white/20'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs text-white/50 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* 输入区域 */}
          <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 p-4">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="输入你想说的话..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </footer>
        </div>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}