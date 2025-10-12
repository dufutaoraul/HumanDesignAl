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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
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
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* 左侧边栏 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:relative z-50 w-80 h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg"
          >
            {/* 侧边栏头部 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  人类图 AI
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 用户信息 */}
              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <div className="flex items-center mb-2">
                  <UserIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm truncate text-gray-800">{user.email}</span>
                </div>
              </div>

              {/* 新对话按钮 */}
              <button
                onClick={createNewConversation}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                新对话
              </button>
            </div>

            {/* 对话历史 */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">对话历史</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`relative group rounded-lg transition-colors ${
                      currentConversation?.id === conversation.id
                        ? 'bg-purple-100 border-2 border-purple-600'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                    }`}
                  >
                    {editingConversationId === conversation.id ? (
                      <div className="p-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full bg-white text-gray-900 px-2 py-1 rounded border border-purple-300 focus:border-purple-600 focus:outline-none"
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
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="保存"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
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
                          <div className="truncate font-medium pr-16 text-gray-900">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {conversation.updatedAt.toLocaleDateString()}
                          </div>
                        </button>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingConversation(conversation)
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            title="编辑标题"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
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
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
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
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-3 text-gray-400 hover:text-gray-600 transition-colors"
                title={sidebarOpen ? "隐藏对话列表" : "显示对话列表"}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">
                {currentConversation?.title || '与高我对话'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/charts')}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                人类图
              </button>
            </div>
          </div>
        </div>

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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">开始与你的高我对话</h2>
              <p className="text-gray-600 mb-8">
                探索内在智慧，获得人生指引
              </p>
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
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <UserIcon className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
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
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
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
