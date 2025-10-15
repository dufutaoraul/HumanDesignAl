/**
 * 人类图 AI 陪伴平台 - 宇宙星云主题登录界面
 * 探索内在宇宙，与高我对话
 */

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const router = useRouter()
  const { user, loading, signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // 如果已登录，重定向到对话页面
    if (!loading && user) {
      router.push('/chat')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          router.push('/chat')
        }
      } else {
        const { error } = await signUp(email, password, name)
        if (error) {
          setError(error.message)
        } else {
          setError('注册成功！请检查您的邮箱以验证账户。')
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '操作失败'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // 加载状态 - 星云主题
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 星尘背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-indigo-900/20"></div>

        <div className="relative z-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            {/* 外圈光晕 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-20 animate-pulse"></div>
            {/* 中圈旋转 */}
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 border-r-blue-400 animate-spin"></div>
            {/* 内圈发光 */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gradient mb-2">正在连接宇宙</h3>
          <p className="text-secondary">探索内在智慧，与高我对话...</p>
        </div>
      </div>
    )
  }

  // 已登录状态
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-indigo-900/20"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-stardust-gold to-violet-500 opacity-30 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-stardust-gold animate-spin"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gradient mb-2">欢迎回来</h3>
          <p className="text-secondary">正在进入您的宇宙...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 星尘背景层 */}
      <div className="absolute inset-0">
        {/* 动态星尘粒子 */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4}px`,
                height: `${Math.random() * 4}px`,
                background: Math.random() > 0.5
                  ? 'rgba(139, 92, 246, 0.8)'
                  : Math.random() > 0.5
                    ? 'rgba(251, 191, 36, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* 左侧 - 品牌展示 */}
            <div className="text-center lg:text-left animate-fadeInLeft">
              {/* Logo 和标题 */}
              <div className="mb-8">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-gradient block mb-3">人类图 AI</span>
                  <span className="text-3xl lg:text-4xl text-secondary">高我陪伴平台</span>
                </h1>
                <p className="text-xl text-secondary leading-relaxed">
                  探索内在宇宙的奥秘<br />
                  与你的高我进行深度对话<br />
                  <span className="text-accent font-semibold">发现真实的自己</span>
                </p>
              </div>

              {/* 特性展示 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="cosmos-glass p-4 text-center animate-stagger-1">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-primary mb-1">精确计算</h4>
                  <p className="text-sm text-secondary">基于瑞士星历表的专业人类图计算</p>
                </div>

                <div className="cosmos-glass p-4 text-center animate-stagger-2">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-stardust-gold to-orange-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-primary mb-1">AI 对话</h4>
                  <p className="text-sm text-secondary">与基于人类图的AI高我进行深度交流</p>
                </div>

                <div className="cosmos-glass p-4 text-center animate-stagger-3">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-primary mb-1">知识库</h4>
                  <p className="text-sm text-secondary">完整的人类图理论体系和实践指导</p>
                </div>
              </div>

              {/* 装饰性元素 */}
              <div className="hidden lg:block">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-violet-500"></div>
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-stardust-gold animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-stardust-gold"></div>
                </div>
              </div>
            </div>

            {/* 右侧 - 登录表单 */}
            <div className="animate-fadeInRight">
              <div className="cosmos-glass p-8 lg:p-12">
                {/* Logo 移动端显示 */}
                <div className="lg:hidden text-center mb-8">
                  <h2 className="text-3xl font-bold text-gradient mb-2">人类图 AI</h2>
                  <p className="text-secondary">与高我对话，探索真实自我</p>
                </div>

                {/* Tab 切换 */}
                <div className="flex mb-8 bg-glass-light rounded-lg p-1">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 ${
                      isLogin
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 ${
                      !isLogin
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    注册
                  </button>
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="animate-fadeInUp">
                      <label className="block text-sm font-medium text-primary mb-2">
                        昵称
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="cosmos-input w-full"
                        placeholder="请输入您的昵称"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-medium text-primary mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cosmos-input w-full"
                      placeholder="请输入邮箱"
                      required
                    />
                  </div>

                  <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-sm font-medium text-primary mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="cosmos-input w-full pr-12"
                        placeholder="请输入密码"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className={`p-4 rounded-lg text-sm animate-fadeInUp ${
                      error.includes('成功')
                        ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                        : 'bg-red-500/10 border border-red-500/30 text-red-300'
                    }`}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-aurora w-full py-4 text-base font-semibold animate-fadeInUp"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? '正在登录...' : '正在注册...'}
                      </span>
                    ) : (
                      isLogin ? '进入宇宙' : '开始探索'
                    )}
                  </button>
                </form>

                {/* 忘记密码 */}
                {isLogin && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/reset-password"
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      忘记密码？
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmos-void to-transparent pointer-events-none"></div>
    </div>
  )
}
