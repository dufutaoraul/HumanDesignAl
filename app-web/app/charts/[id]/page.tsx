/**
 * 人类图详情页 - 简洁深邃星空风格
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function ChartDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const [chart, setChart] = useState<ChartData | null>(null)
  const [loadingChart, setLoadingChart] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const loadChart = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/charts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setChart(data.chart)
      } else {
        console.error('加载失败')
        router.push('/charts')
      }
    } catch (error) {
      console.error('加载人类图详情失败:', error)
      router.push('/charts')
    } finally {
      setLoadingChart(false)
    }
  }, [router])

  useEffect(() => {
    if (user && params.id) {
      loadChart(params.id as string)
    }
  }, [user, params.id, loadChart])

  if (loading || loadingChart) {
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

  if (!user || !chart) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
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
      <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto">
        {/* 返回按钮 */}
        <Link
          href="/charts"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <span className="mr-2">←</span> 返回列表
        </Link>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold gradient-text">{chart.name} 的人类图</h1>
            {chart.is_self && (
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                我的人类图
              </span>
            )}
          </div>
          <p className="text-gray-400">创建于 {new Date(chart.created_at).toLocaleString()}</p>
        </div>

        <div className="space-y-6">
          {/* 基本信息卡片 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">出生日期</div>
                <div className="text-sm text-white">{chart.birth_date}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">出生时间</div>
                <div className="text-sm text-white">{chart.birth_time}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">出生地点</div>
                <div className="text-sm text-white">{chart.location}</div>
              </div>
            </div>
          </div>

          {/* 人类图类型信息 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">人类图类型</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          </div>

          {/* 激活通道 */}
          {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                激活通道 ({chart.chart_data.analysis.channels.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {chart.chart_data.analysis.channels.map((channel, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 定义中心 */}
          {chart.chart_data?.analysis?.definedCenters && chart.chart_data.analysis.definedCenters.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                定义中心 ({chart.chart_data.analysis.definedCenters.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {chart.chart_data.analysis.definedCenters.map((center, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm rounded-md bg-green-500/20 text-green-300 border border-green-500/30"
                  >
                    {center}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 轮回交叉 */}
          {chart.chart_data?.analysis?.incarnationCross?.full && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">轮回交叉</h2>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-sm text-white mb-2">
                  {chart.chart_data.analysis.incarnationCross.full}
                </p>
                {chart.chart_data.analysis.incarnationCross.type && (
                  <p className="text-xs text-purple-400">
                    类型: {chart.chart_data.analysis.incarnationCross.type}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/chat"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
            >
              与高我对话
            </Link>
            <Link
              href="/charts"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
