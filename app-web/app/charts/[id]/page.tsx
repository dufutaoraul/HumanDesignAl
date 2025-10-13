/**
 * 人类图详情页
 */

'use client'

import { useState, useEffect } from 'react'
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

  const loadChart = async (id: string) => {
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
  }

  useEffect(() => {
    if (user && params.id) {
      loadChart(params.id as string)
    }
  }, [user, params.id])

  if (loading || loadingChart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--star-gold)' }}></div>
          <p className="text-gray-300">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user || !chart) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* 顶部导航 */}
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

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/charts"
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> 返回列表
          </Link>
        </div>

        {/* 标题行 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {chart.name} 的人类图
          </h1>
          {chart.is_self && (
            <span className="inline-block px-4 py-2 text-sm rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium shadow-lg">
              我的人类图
            </span>
          )}
        </div>

        {/* 详细信息 */}
        <div className="space-y-6">
          {/* 基本信息卡片 */}
          <div className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white mb-6">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-white/60 block mb-2">出生日期</span>
                <span className="text-lg text-white font-semibold">{chart.birth_date}</span>
              </div>
              <div>
                <span className="text-sm text-white/60 block mb-2">出生时间</span>
                <span className="text-lg text-white font-semibold">{chart.birth_time}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-white/60 block mb-2">出生地点</span>
                <span className="text-lg text-white font-semibold">{chart.location}</span>
              </div>
            </div>
          </div>

          {/* 人类图类型信息 */}
          <div className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white mb-6">人类图类型</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          </div>

          {/* 激活通道 */}
          {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
            <div className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6">
                激活通道 ({chart.chart_data.analysis.channels.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {chart.chart_data.analysis.channels.map((channel, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 text-base rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 定义中心 */}
          {chart.chart_data?.analysis?.definedCenters && chart.chart_data.analysis.definedCenters.length > 0 && (
            <div className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6">
                定义中心 ({chart.chart_data.analysis.definedCenters.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {chart.chart_data.analysis.definedCenters.map((center, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 text-base rounded-lg bg-green-500/20 text-green-300 border border-green-400/30 font-medium"
                  >
                    {center}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 轮回交叉 */}
          {chart.chart_data?.analysis?.incarnationCross?.full && (
            <div className="glass-effect p-8 rounded-3xl border border-white/20 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-6">轮回交叉</h2>
              <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-400/30">
                <p className="text-lg text-white">
                  {chart.chart_data.analysis.incarnationCross.full}
                </p>
                {chart.chart_data.analysis.incarnationCross.type && (
                  <p className="text-sm text-purple-300 mt-2">
                    类型: {chart.chart_data.analysis.incarnationCross.type}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 pt-6">
            <Link
              href="/chat"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💬 与高我对话
            </Link>
            <Link
              href="/charts"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
