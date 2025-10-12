/**
 * 与高我对话界面 - 主对话页面
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
  const [showGuidanceBanner, setShowGuidanceBanner] = useState(true)
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
          const hasSelfChart = data.charts?.some((chart: { is_self: boolean }) => chart.is_self)
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cosmic-blue)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--star-gold)' }}></div>
          <p className="text-white">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未登录，显示加载状态（即将跳转）
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cosmic-blue)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--star-gold)' }}></div>
          <p className="text-white">正在跳转...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--cosmic-blue)' }}>
      {/* 左侧边栏 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:relative z-50 w-80 h-screen flex flex-col shadow-lg"
            style={{ background: 'var(--nebula-purple)', borderRight: '1px solid rgba(255, 215, 0, 0.2)' }}
          >
            {/* 侧边栏头部 */}
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold gradient-text">
                  人类图 AI
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden hover:opacity-80"
                  style={{ color: 'var(--star-gold)' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 用户信息 */}
              <div className="glass rounded-lg p-3 mb-4">
                <div className="flex items-center mb-2">
                  <UserIcon className="w-5 h-5 mr-2" style={{ color: 'var(--star-gold)' }} />
                  <span className="text-sm truncate text-white">{user.email}</span>
                </div>
                {hasHumanDesign !== null && (
                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255, 215, 0, 0.1)' }}>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          hasHumanDesign ? 'animate-pulse' : ''
                        }`}
                        style={{ background: hasHumanDesign ? 'var(--star-gold)' : '#6b7280' }}
                      />
                      <span className="text-gray-300">
                        {hasHumanDesign ? '已录入人类图' : '未录入人类图'}
                      </span>
                    </div>
                    {!hasHumanDesign && (
                      <button
                        onClick={() => router.push('/calculate')}
                        className="text-xs px-2 py-1 rounded transition-colors hover:opacity-80"
                        style={{ color: 'var(--star-gold)', background: 'rgba(255, 215, 0, 0.1)' }}
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
                className="btn-gold w-full flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                新对话
              </button>
            </div>

            {/* 对话历史 */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--gold-glow)' }}>对话历史</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`relative group rounded-lg transition-colors ${
                      currentConversation?.id === conversation.id
                        ? 'glass border-2'
                        : 'border-2 border-transparent hover:border-opacity-30'
                    }`}
                    style={currentConversation?.id === conversation.id
                      ? { borderColor: 'var(--star-gold)' }
                      : { background: 'rgba(255, 255, 255, 0.05)' }
                    }
                  >
                    {editingConversationId === conversation.id ? (
                      <div className="p-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-2 py-1 rounded border focus:outline-none text-white"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'var(--star-gold)'
                          }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveConversationTitle(conversation.id)
                            } else if (e.key === 'Escape') {
                              cancelEditing()
                            }
                          }}
                        />
                        <div className="flex items-center justify-end space-x-2 mt-2">
                          <button
                            onClick={() => saveConversationTitle(conversation.id)}
                            className="p-1 rounded transition-colors hover:opacity-80"
                            style={{ color: 'var(--star-gold)' }}
                            title="保存"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 rounded transition-colors hover:opacity-80"
                            style={{ color: '#ff6b6b' }}
                            title="取消"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => selectConversation(conversation)}
                          className="w-full text-left p-3"
                        >
                          <div className="truncate font-medium pr-16 text-white">
                            {conversation.title}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--gold-glow)', opacity: 0.7 }}>
                            {conversation.updatedAt.toLocaleDateString()}
                          </div>
                        </button>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingConversation(conversation)
                            }}
                            className="p-1.5 rounded transition-colors hover:opacity-80"
                            style={{ color: 'var(--star-gold)' }}
                            title="编辑标题"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                            className="p-1.5 rounded transition-colors hover:opacity-80"
                            style={{ color: '#ff6b6b' }}
                            title="删除对话"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 侧边栏底部 */}
            <div className="p-4" style={{ borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center text-white hover:opacity-80"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <LogOut className="w-5 h-5 mr-2" />
                退出登录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航 */}
        <div className="glass p-4" style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-3 transition-colors hover:opacity-80"
                style={{ color: 'var(--star-gold)' }}
                title={sidebarOpen ? "隐藏对话列表" : "显示对话列表"}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Sparkles className="w-6 h-6 mr-2" style={{ color: 'var(--star-gold)' }} />
              <h1 className="text-xl font-bold text-white">
                {currentConversation?.title || '与高我对话'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/charts')}
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--star-gold)' }}
              >
                人类图
              </button>
            </div>
          </div>
        </div>

        {/* 引导提示横幅 */}
        {hasHumanDesign === false && showGuidanceBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-4"
          >
            <div className="glass rounded-lg p-4 relative" style={{ borderLeft: '4px solid var(--star-gold)' }}>
              <button
                onClick={() => setShowGuidanceBanner(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                title="关闭提示"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start">
                <Sparkles className="w-6 h-6 mr-3 flex-shrink-0 mt-1" style={{ color: 'var(--star-gold)' }} />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    录入你的人类图，让AI高我更懂你
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    输入你的出生信息，生成专属人类图，获得更精准的个性化指引和对话体验
                  </p>
                  <button
                    onClick={() => router.push('/calculate')}
                    className="btn-gold text-sm px-4 py-2"
                  >
                    立即录入
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">开始与你的高我对话</h2>
              <p className="text-gray-300 mb-8">
                探索内在智慧，获得人生指引
              </p>
              {hasHumanDesign === false && (
                <div className="glass rounded-lg p-6 max-w-md">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-white font-semibold mb-2">
                    还未录入人类图
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    虽然你可以开始对话，但录入人类图后，AI高我能根据你的独特设计提供更精准的指引
                  </p>
                  <button
                    onClick={() => router.push('/calculate')}
                    className="btn-gold text-sm px-5 py-2.5"
                  >
                    录入我的人类图
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[70%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'text-white'
                          : 'text-white'
                      }`}
                      style={message.role === 'user'
                        ? { background: 'linear-gradient(135deg, var(--star-gold), var(--light-gold))' }
                        : { background: 'rgba(255, 215, 0, 0.2)' }
                      }
                    >
                      {message.role === 'user' ? (
                        <UserIcon className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" style={{ color: 'var(--star-gold)' }} />
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'rounded-br-sm'
                            : 'glass rounded-bl-sm'
                        }`}
                        style={message.role === 'user'
                          ? { background: 'linear-gradient(135deg, var(--star-gold), var(--light-gold))', color: 'var(--cosmic-blue)' }
                          : {}
                        }
                      >
                        <p className="whitespace-pre-wrap text-white">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
                      <Bot className="w-5 h-5" style={{ color: 'var(--star-gold)' }} />
                    </div>
                    <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--star-gold)' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--star-gold)', animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--star-gold)', animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="glass p-4" style={{ borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入你想说的话..."
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-white placeholder:text-gray-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)'
                }}
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="btn-gold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
