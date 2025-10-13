/**
 * 用户人类图资料列表页 - 简洁深邃星空风格
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

  const loadCharts = async () => {
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
    <div className="min-h-screen">
      {/* 顶部导航 - 简洁透明 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold gradient-text">人类图 AI 陪伴</h1>
          <div className="flex gap-8">
            <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
              聊天
            </Link>
            <Link href="/charts" className="text-white font-medium">
              我的资料
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="pt-24 px-6 pb-12 max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">我的人类图资料</h2>
          <p className="text-gray-400 mb-8">查看和管理您的人类图资料，与高我对话</p>
          <Link
            href="/calculate"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            + 新增人类图
          </Link>
        </div>

        {/* 资料列表 */}
        {charts.length === 0 ? (
          // 空状态
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-50">✨</div>
            <h3 className="text-2xl font-bold text-white mb-3">还没有人类图资料</h3>
            <p className="text-gray-400 mb-8">
              点击上方按钮，输入出生信息来创建人类图
            </p>
            <Link
              href="/calculate"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              立即创建
            </Link>
          </div>
        ) : (
          // 列表
          <div className="space-y-6">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-200"
              >
                {/* 标题行 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{chart.name}</h3>
                    {chart.is_self && (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        我的人类图
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(chart.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* 基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">类型</div>
                    <div className="text-sm text-white font-medium">
                      {chart.chart_data?.analysis?.type || '未知'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">人生角色</div>
                    <div className="text-sm text-white font-medium">
                      {chart.chart_data?.analysis?.profile || '未知'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">内在权威</div>
                    <div className="text-sm text-white font-medium">
                      {chart.chart_data?.analysis?.authority || '未知'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">定义</div>
                    <div className="text-sm text-white font-medium">
                      {chart.chart_data?.analysis?.definition || '未知'}
                    </div>
                  </div>
                </div>

                {/* 激活通道 */}
                {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-2">
                      激活通道 ({chart.chart_data.analysis.channels.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chart.chart_data.analysis.channels.map((channel, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 轮回交叉 */}
                {chart.chart_data?.analysis?.incarnationCross?.full && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-xs text-purple-400 mb-1">轮回交叉</div>
                    <div className="text-sm text-white">
                      {chart.chart_data.analysis.incarnationCross.full}
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/chat"
                    className="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                  >
                    与高我对话
                  </Link>
                  <Link
                    href={`/charts/${chart.id}`}
                    className="px-5 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => deleteChart(chart.id)}
                    className="px-5 py-2 bg-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/30 transition-all duration-200"
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
