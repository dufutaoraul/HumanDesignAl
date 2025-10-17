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
    if (user) {
      console.log('用户已登录，重定向到聊天页面')
      router.push('/chat')
    }
  }, [user, router])

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
              <div className="mb-16">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-gradient block mb-4">人类图 AI</span>
                  <span className="text-3xl lg:text-4xl text-secondary">高我陪伴平台</span>
                </h1>
                <p className="text-xl text-secondary leading-relaxed max-w-lg">
                  探索内在宇宙的奥秘<br />
                  与你的高我进行深度对话<br />
                  <span className="text-accent font-semibold">发现真实的自己</span>
                </p>
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
              <div className="cosmos-glass p-10 lg:p-14 rounded-2xl">
                {/* Logo 移动端显示 */}
                <div className="lg:hidden text-center mb-10">
                  <h2 className="text-3xl font-bold text-gradient mb-3">人类图 AI</h2>
                  <p className="text-secondary text-lg">与高我对话，探索真实自我</p>
                </div>

                {/* Tab 切换 */}
                <div className="flex mb-10 bg-glass-light rounded-xl p-1">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 px-8 rounded-lg font-medium transition-all duration-300 text-base ${
                      isLogin
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-xl'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 px-8 rounded-lg font-medium transition-all duration-300 text-base ${
                      !isLogin
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-xl'
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
                      <label className="block text-sm font-medium text-secondary mb-3">
                        昵称
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="cosmos-input w-full text-lg py-4 px-6"
                        placeholder="您的昵称"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cosmos-input w-full text-lg py-4 px-6"
                      placeholder="您的邮箱"
                      required
                    />
                  </div>

                  <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="cosmos-input w-full text-lg py-4 px-6 pr-14"
                        placeholder="您的密码"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="btn-aurora w-full py-5 text-lg font-semibold animate-fadeInUp rounded-xl"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? '正在登录...' : '正在注册...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {isLogin ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4 4m-4-4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            登录
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0 3h.01M6 9h12m-6 6h.01M9 12h.01m-6 6h.01" />
                            </svg>
                            注册
                          </>
                        )}
                      </span>
                    )}
                  </button>
                </form>

                {/* 忘记密码 */}
                {isLogin && (
                  <div className="mt-8 text-center">
                    <Link
                      href="/reset-password"
                      className="text-sm text-secondary hover:text-primary transition-colors underline"
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
