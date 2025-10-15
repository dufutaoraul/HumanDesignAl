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
  X,
  User as UserIcon,
  Bot,
  LogOut,
  Edit2,
  Trash2,
  Check,
  XCircle,
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
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
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

  const startEditingConversation = (conversation: Conversation) => {
    setEditingConversationId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const saveConversationTitle = (conversationId: string) => {
    if (!editingTitle.trim()) return

    setConversations(conversations.map(c =>
      c.id === conversationId ? { ...c, title: editingTitle.trim() } : c
    ))

    if (currentConversation?.id === conversationId) {
      setCurrentConversation({ ...currentConversation, title: editingTitle.trim() })
    }

    setEditingConversationId(null)
  }

  const cancelEditing = () => {
    setEditingConversationId(null)
    setEditingTitle('')
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
    <div className="flex h-screen main-content">
      {/* 左侧边栏 - 更大尺寸设计 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            className="fixed lg:relative z-50 w-96 h-screen flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10"
          >
            {/* 侧边栏头部 */}
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  人类图 AI
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* 用户信息 */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-7 h-7 mr-4 text-blue-400" />
                  <span className="text-xl truncate text-white font-medium">{user.email}</span>
                </div>
                {hasHumanDesign !== null && (
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center text-lg">
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${
                          hasHumanDesign ? 'animate-pulse' : ''
                        }`}
                        style={{ background: hasHumanDesign ? '#10b981' : '#6b7280' }}
                      />
                      <span className="text-gray-300 font-medium">
                        {hasHumanDesign ? '已录入人类图' : '未录入人类图'}
                      </span>
                    </div>
                    {!hasHumanDesign && (
                      <button
                        onClick={() => router.push('/calculate')}
                        className="text-lg px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                      >
                        录入
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 新对话按钮 */}
              <button
                onClick={createNewConversation}
                className="w-full px-8 py-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 flex items-center justify-center text-xl font-bold transition-all hover:scale-105"
              >
                <Plus className="w-7 h-7 mr-4" />
                新对话
              </button>
            </div>

            {/* 对话历史 */}
            <div className="flex-1 overflow-y-auto p-8">
              <h3 className="text-xl font-bold text-gray-300 mb-6">对话历史</h3>
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`relative group rounded-2xl border-2 transition-all duration-300 hover:scale-102 ${
                      currentConversation?.id === conversation.id
                        ? 'border-blue-500 bg-white/10 backdrop-blur-xl'
                        : 'border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10'
                    }`}
                  >
                    {editingConversationId === conversation.id ? (
                      <div className="p-6">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-blue-500 bg-white/10 backdrop-blur-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveConversationTitle(conversation.id)
                            } else if (e.key === 'Escape') {
                              cancelEditing()
                            }
                          }}
                        />
                        <div className="flex items-center justify-end space-x-4 mt-4">
                          <button
                            onClick={() => saveConversationTitle(conversation.id)}
                            className="p-3 rounded-xl text-green-400 hover:text-green-300 hover:bg-green-400/10 transition-all"
                            title="保存"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
                            title="取消"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => selectConversation(conversation)}
                          className="w-full text-left p-6"
                        >
                          <div className="truncate text-xl font-bold pr-20 text-white mb-2">
                            {conversation.title}
                          </div>
                          <div className="text-lg text-gray-400">
                            {conversation.updatedAt.toLocaleDateString()}
                          </div>
                        </button>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingConversation(conversation)
                            }}
                            className="p-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition-all"
                            title="编辑标题"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                            className="p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
                            title="删除对话"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 侧边栏底部 */}
            <div className="p-8 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="w-full py-5 px-8 bg-white/10 backdrop-blur-xl text-white rounded-2xl hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-all hover:scale-105 border border-white/10"
              >
                <LogOut className="w-7 h-7 mr-4" />
                退出登录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主聊天区域 - 更大布局 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航 */}
        <div className="bg-black/40 backdrop-blur-xl p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-6 text-gray-300 hover:text-white transition-colors"
                title={sidebarOpen ? "隐藏对话列表" : "显示对话列表"}
              >
                <Menu className="w-8 h-8" />
              </button>
              <Sparkles className="w-8 h-8 mr-4 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">
                {currentConversation?.title || '与高我对话'}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/charts')}
                className="px-8 py-4 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                人类图
              </button>
            </div>
          </div>
        </div>

        {/* 聊天消息区域 - 更大间距和文字 */}
        <div className="flex-1 overflow-y-auto p-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-8xl mb-8">✨</div>
              <h2 className="text-5xl font-black text-white mb-6">开始与你的高我对话</h2>
              <p className="text-2xl text-gray-300 max-w-2xl">
                探索内在智慧，获得人生指引
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-6 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 backdrop-blur-xl text-blue-400 border-2 border-white/20'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <UserIcon className="w-10 h-10" />
                      ) : (
                        <Bot className="w-10 h-10" />
                      )}
                    </div>
                    <div className="max-w-full">
                      <div
                        className={`px-8 py-6 rounded-2xl backdrop-blur-xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-2xl'
                            : 'bg-white/10 text-white rounded-bl-2xl border border-white/20'
                        }`}
                      >
                        <p className="text-xl leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="text-gray-400 mt-3 text-lg">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border-2 border-white/20">
                      <Bot className="w-10 h-10 text-blue-400" />
                    </div>
                    <div className="px-8 py-6 bg-white/10 rounded-2xl rounded-bl-2xl backdrop-blur-xl border border-white/20">
                      <div className="flex space-x-3">
                        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 - 更大设计 */}
        <div className="bg-black/40 backdrop-blur-xl p-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex space-x-6">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入你想说的话..."
                className="flex-1 px-8 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 text-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-10 py-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xl font-bold transition-all hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="w-7 h-7" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}