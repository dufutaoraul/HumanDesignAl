/**
 * 用户人类图资料列表页
 */

'use client'

import { useState, useEffect } from 'react'
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
  is_self: boolean // 是否是本人
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

  const loadCharts = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/charts?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        // 排序：本人的排第一，其他按时间倒序
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
  }

  useEffect(() => {
    if (user) {
      loadCharts()
    }
  }, [user])

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
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 glow" style={{ borderColor: 'var(--star-gold)' }}></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* 顶部导航 - 参考 Seth 的简洁导航 */}
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold gradient-text">
              人类图 AI 陪伴
            </h1>
            <div className="flex gap-6">
              <Link href="/chat" className="text-gray-300 hover:text-white transition-colors text-sm">
                聊天
              </Link>
              <Link href="/charts" className="text-yellow-400 font-medium text-sm">
                我的资料
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 - 参考 Xiaohongshu 的布局 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题和操作 - 参考 Xiaohongshu 的标题样式 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-6">📊 我的人类图资料</h1>
          <p className="text-xl text-white/80 mb-8">
            查看和管理您的人类图资料，与高我对话
          </p>
          <Link
            href="/calculate"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            + 新增人类图
          </Link>
        </div>

        {/* 资料列表 */}
        {charts.length === 0 ? (
          // 空状态 - 参考 Xiaohongshu 的卡片样式
          <div className="glass-effect p-12 rounded-3xl border border-white/20 backdrop-blur-lg text-center">
            <div className="text-8xl mb-8 animate-pulse">📊</div>
            <h1 className="text-4xl font-bold gradient-text mb-6">还没有人类图资料</h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              请点击上方&ldquo;新增人类图&rdquo;按钮，输入出生信息来创建人类图
            </p>
            <Link
              href="/calculate"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              立即创建
            </Link>
          </div>
        ) : (
          // 列表布局 - 参考 Xiaohongshu 的 Card 组件样式
          <div className="space-y-6">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg hover:border-white/30 transition-all duration-300"
              >
                {/* 标题行 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-white">
                      {chart.name}
                    </h3>
                    {chart.is_self && (
                      <span className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium shadow-lg">
                        我的人类图
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-white/50">
                    {new Date(chart.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* 基本信息 - 网格布局 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <span className="text-xs text-white/60 block mb-2">类型</span>
                    <span className="text-base text-white font-semibold">
                      {chart.chart_data?.analysis?.type || '未知'}
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <span className="text-xs text-white/60 block mb-2">人生角色</span>
                    <span className="text-base text-white font-semibold">
                      {chart.chart_data?.analysis?.profile || '未知'}
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <span className="text-xs text-white/60 block mb-2">内在权威</span>
                    <span className="text-base text-white font-semibold">
                      {chart.chart_data?.analysis?.authority || '未知'}
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <span className="text-xs text-white/60 block mb-2">定义</span>
                    <span className="text-base text-white font-semibold">
                      {chart.chart_data?.analysis?.definition || '未知'}
                    </span>
                  </div>
                </div>

                {/* 通道信息 - 显示全部，不截断 */}
                {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-white/70 font-medium">激活通道 ({chart.chart_data.analysis.channels.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chart.chart_data.analysis.channels.map((channel, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 轮回交叉 */}
                {chart.chart_data?.analysis?.incarnationCross?.full && (
                  <div className="mb-6 p-4 bg-purple-500/10 rounded-lg border border-purple-400/30">
                    <span className="text-sm text-purple-300 font-medium block mb-2">轮回交叉</span>
                    <span className="text-base text-white">
                      {chart.chart_data.analysis.incarnationCross.full}
                    </span>
                  </div>
                )}

                {/* 操作按钮 - 参考 Xiaohongshu 的按钮样式 */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    href={`/chat`}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    💬 与高我对话
                  </Link>
                  <Link
                    href={`/charts/${chart.id}`}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => deleteChart(chart.id)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
