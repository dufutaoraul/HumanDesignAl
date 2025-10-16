/**
 * 用户人类图资料列表页 - 简洁深邃星空风格
 */

'use client'

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface ChartData {
  id: string
  user_id: string
  name: string
  birth_date: string
  birth_time: string
  location: string
  is_self: boolean
  chart_data: {
    analysis: {
      type: string
      profile: string
      authority: string
      definition: string
      channels: string[]
      definedCenters: string[]
      incarnationCross: {
        full: string
        key: string
        type: string
      }
    }
    planets: {
      design: Record<string, unknown>
      personality: Record<string, unknown>
    }
  }
  created_at: string
}

export default function ChartsListPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [charts, setCharts] = useState<ChartData[]>([])
  const [loadingCharts, setLoadingCharts] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const loadCharts = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/charts?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const sortedCharts = (data.charts || []).sort((a: ChartData, b: ChartData) => {
          if (a.is_self && !b.is_self) return -1
          if (!a.is_self && b.is_self) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setCharts(sortedCharts)
      }
    } catch (error) {
      console.error('加载人类图资料失败:', error)
    } finally {
      setLoadingCharts(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadCharts()
    }
  }, [user, loadCharts])

  const deleteChart = async (id: string) => {
    if (!confirm('确定要删除这个人类图资料吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/charts/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setCharts(charts.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  if (loading || loadingCharts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: 'var(--star-gold)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen main-content">
      {/* 顶部导航 */}
      <nav className="cosmos-glass sticky top-0 z-50 border-b border-glass">
        <div className="cosmos-container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gradient">
                人类图 AI 陪伴
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stardust-gold animate-pulse"></div>
                <span className="text-secondary">我的星图</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {user && (
                <div className="hidden sm:block">
                  <span className="text-sm text-secondary">
                    {user.email}
                  </span>
                </div>
              )}
              <Link
                href="/chat"
                className="text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
              <Link
                href="/calculate"
                className="cosmos-glass px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                计算星图
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="cosmos-container py-8">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-full blur opacity-25 animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-green-900/50 to-teal-900/50 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              我的人类图资料
            </span>
          </h2>
          <p className="text-2xl text-secondary/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            查看和管理您的人类图资料，与高我对话探索内在智慧
          </p>
          <Link
            href="/calculate"
            className="relative group inline-flex items-center gap-2"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative px-8 py-4 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新增人类图
              </span>
            </div>
          </Link>
        </div>

        {/* 资料列表 */}
        {charts.length === 0 ? (
          // 空状态
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-gradient-to-br from-violet-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl border border-violet-500/20 p-16 text-center">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full blur opacity-50 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-violet-900/50 to-blue-900/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-6xl">🌟</span>
                </div>
              </div>
              <h3 className="text-4xl font-black text-white mb-4">
                还没有人类图资料
              </h3>
              <p className="text-xl text-secondary/80 mb-8 max-w-lg mx-auto">
                点击上方按钮，输入出生信息来创建您的第一个人类图
              </p>
              <Link
                href="/calculate"
                className="relative group inline-flex items-center gap-2"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative px-8 py-4 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white font-bold text-lg rounded-2xl hover:from-violet-700 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    立即创建
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          // 列表
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.map((chart, index) => (
              <div
                key={chart.id}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-3xl blur opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-violet-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl border border-violet-500/20 p-8 hover:border-violet-500/40 transition-all duration-300 transform hover:scale-105">
                  {/* 标题行 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-black text-white">{chart.name}</h3>
                      {chart.is_self && (
                        <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg shadow-yellow-500/30">
                          我的人类图
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-secondary/70">
                      {new Date(chart.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 rounded-xl p-4 border border-violet-500/10">
                      <p className="text-xs font-semibold text-violet-300 mb-2">类型</p>
                      <p className="text-base font-bold text-white">
                        {chart.chart_data?.analysis?.type || '未知'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-4 border border-blue-500/10">
                      <p className="text-xs font-semibold text-blue-300 mb-2">人生角色</p>
                      <p className="text-base font-bold text-white">
                        {chart.chart_data?.analysis?.profile || '未知'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 rounded-xl p-4 border border-cyan-500/10">
                      <p className="text-xs font-semibold text-cyan-300 mb-2">内在权威</p>
                      <p className="text-base font-bold text-white">
                        {chart.chart_data?.analysis?.authority || '未知'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-900/20 to-green-900/20 rounded-xl p-4 border border-teal-500/10">
                      <p className="text-xs font-semibold text-teal-300 mb-2">定义</p>
                      <p className="text-base font-bold text-white">
                        {chart.chart_data?.analysis?.definition || '未知'}
                      </p>
                    </div>
                  </div>

                  {/* 激活通道 */}
                  {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-purple-300 mb-3">
                        激活通道 ({chart.chart_data.analysis.channels.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {chart.chart_data.analysis.channels.map((channel, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm font-medium"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 轮回交叉 */}
                  {chart.chart_data?.analysis?.incarnationCross?.full && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20">
                      <p className="text-sm font-semibold text-purple-300 mb-2">轮回交叉</p>
                      <p className="text-sm text-white">
                        {chart.chart_data.analysis.incarnationCross.full}
                      </p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-violet-500/20">
                    <Link
                      href="/chat"
                      className="relative group flex-1"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-sm rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 text-center">
                        与高我对话
                      </div>
                    </Link>
                    <Link
                      href={`/charts/${chart.id}`}
                      className="relative group flex-1"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm rounded-xl hover:from-violet-700 hover:to-blue-700 transition-all duration-300 text-center">
                        查看详情
                      </div>
                    </Link>
                    <button
                      onClick={() => deleteChart(chart.id)}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-sm rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300">
                        删除
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
