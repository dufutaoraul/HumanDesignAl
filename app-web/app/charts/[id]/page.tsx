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
    <div className="min-h-screen main-content flex">
      {/* 全新设计：左侧信息面板 */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 p-6">
        {/* 返回按钮 */}
        <Link
          href="/charts"
          className="flex items-center text-white/70 hover:text-white mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">返回星图列表</span>
        </Link>

        {/* 用户信息 */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/80 font-medium">{chart.name}</p>
              <p className="text-xs text-white/60">
                {new Date(chart.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {chart.is_self && (
            <div className="flex items-center text-xs text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              我的人类图
            </div>
          )}
        </div>

        {/* 基本信息 */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">基本信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-xs text-white/60">出生日期</span>
              <span className="text-sm text-white">{chart.birth_date}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-xs text-white/60">出生时间</span>
              <span className="text-sm text-white">{chart.birth_time}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-xs text-white/60">出生地点</span>
              <span className="text-sm text-white">{chart.location}</span>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">快速操作</h3>
          <div className="space-y-2">
            <Link
              href="/chat"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              与高我对话
            </Link>
            <Link
              href="/charts"
              className="w-full bg-white/10 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-white/20 border border-white/20 transition-all duration-200"
            >
              我的星图
            </Link>
          </div>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 bg-black/20 overflow-y-auto">
        <div className="p-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">{chart.name} 的人类图</h1>
            <p className="text-sm text-white/60">宇宙能量印记分析</p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* 人类图类型信息 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                人类图类型
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-xs text-white/60 mb-2">类型</p>
                  <p className="text-lg font-semibold text-white">
                    {chart.chart_data?.analysis?.type || '未知'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-xs text-white/60 mb-2">人生角色</p>
                  <p className="text-lg font-semibold text-white">
                    {chart.chart_data?.analysis?.profile || '未知'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-xs text-white/60 mb-2">内在权威</p>
                  <p className="text-lg font-semibold text-white">
                    {chart.chart_data?.analysis?.authority || '未知'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-xs text-white/60 mb-2">定义</p>
                  <p className="text-lg font-semibold text-white">
                    {chart.chart_data?.analysis?.definition || '未知'}
                  </p>
                </div>
              </div>
            </div>

            {/* 激活通道 */}
            {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  激活通道 ({chart.chart_data.analysis.channels.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {chart.chart_data.analysis.channels.map((channel, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 font-medium text-sm"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 定义中心 */}
            {chart.chart_data?.analysis?.definedCenters && chart.chart_data.analysis.definedCenters.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  定义中心 ({chart.chart_data.analysis.definedCenters.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {chart.chart_data.analysis.definedCenters.map((center, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 font-medium text-sm"
                    >
                      {center}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 轮回交叉 */}
            {chart.chart_data?.analysis?.incarnationCross?.full && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21H9l-2.286-6.857L3 12l5.714-2.143L11 3z" />
                    </svg>
                  </div>
                  轮回交叉
                </h2>
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="text-lg font-semibold text-white mb-3">
                    {chart.chart_data.analysis.incarnationCross.full}
                  </p>
                  {chart.chart_data.analysis.incarnationCross.type && (
                    <p className="text-sm text-orange-300">
                      类型: {chart.chart_data.analysis.incarnationCross.type}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 行动建议卡片 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">下一步建议</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/chat"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">开始对话</h4>
                      <p className="text-white/60 text-sm">与AI高我探索人类图</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/calculate"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">创建新星图</h4>
                      <p className="text-white/60 text-sm">为家人朋友计算人类图</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
