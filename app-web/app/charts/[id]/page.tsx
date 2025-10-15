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
                <span className="text-secondary">星图详情</span>
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
                href="/charts"
                className="cosmos-glass px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                我的星图
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="cosmos-container py-8">
        {/* 返回按钮 */}
        <Link
          href="/charts"
          className="inline-flex items-center text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回星图列表
        </Link>

        {/* 页面标题 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur opacity-25 animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl">🌟</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl lg:text-6xl font-black text-white">
              {chart.name} 的人类图
            </h1>
            {chart.is_self && (
              <span className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg shadow-yellow-500/30">
                我的人类图
              </span>
            )}
          </div>
          <p className="text-xl text-secondary/80">
            创建于 {new Date(chart.created_at).toLocaleString()}
          </p>
        </div>

        <div className="space-y-8 max-w-6xl mx-auto">
          {/* 基本信息卡片 */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-50"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  基本信息
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-500/10">
                  <p className="text-sm font-semibold text-blue-300 mb-3">出生日期</p>
                  <p className="text-lg font-bold text-white">{chart.birth_date}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/10">
                  <p className="text-sm font-semibold text-indigo-300 mb-3">出生时间</p>
                  <p className="text-lg font-bold text-white">{chart.birth_time}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/10">
                  <p className="text-sm font-semibold text-purple-300 mb-3">出生地点</p>
                  <p className="text-lg font-bold text-white">{chart.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 人类图类型信息 */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-xl rounded-3xl border border-green-500/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full blur opacity-50"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  人类图类型
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-xl p-6 border border-green-500/10">
                  <p className="text-sm font-semibold text-green-300 mb-3">类型</p>
                  <p className="text-lg font-bold text-white">
                    {chart.chart_data?.analysis?.type || '未知'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 rounded-xl p-6 border border-teal-500/10">
                  <p className="text-sm font-semibold text-teal-300 mb-3">人生角色</p>
                  <p className="text-lg font-bold text-white">
                    {chart.chart_data?.analysis?.profile || '未知'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl p-6 border border-cyan-500/10">
                  <p className="text-sm font-semibold text-cyan-300 mb-3">内在权威</p>
                  <p className="text-lg font-bold text-white">
                    {chart.chart_data?.analysis?.authority || '未知'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/20 to-violet-900/20 rounded-xl p-6 border border-blue-500/10">
                  <p className="text-sm font-semibold text-blue-300 mb-3">定义</p>
                  <p className="text-lg font-bold text-white">
                    {chart.chart_data?.analysis?.definition || '未知'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 激活通道 */}
          {chart.chart_data?.analysis?.channels && chart.chart_data.analysis.channels.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    激活通道 ({chart.chart_data.analysis.channels.length})
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {chart.chart_data.analysis.channels.map((channel, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 font-medium text-sm"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 定义中心 */}
          {chart.chart_data?.analysis?.definedCenters && chart.chart_data.analysis.definedCenters.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-teal-600 to-green-600 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-xl rounded-3xl border border-cyan-500/20 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur opacity-50"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    定义中心 ({chart.chart_data.analysis.definedCenters.length})
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {chart.chart_data.analysis.definedCenters.map((center, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 font-medium text-sm"
                    >
                      {center}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 轮回交叉 */}
          {chart.chart_data?.analysis?.incarnationCross?.full && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-gradient-to-br from-orange-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-50"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21H9l-2.286-6.857L3 12l5.714-2.143L11 3z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    轮回交叉
                  </h2>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-900/20 to-pink-900/20 rounded-xl border border-orange-500/20">
                  <p className="text-lg font-bold text-white mb-3">
                    {chart.chart_data.analysis.incarnationCross.full}
                  </p>
                  {chart.chart_data.analysis.incarnationCross.type && (
                    <p className="text-sm font-semibold text-orange-300">
                      类型: {chart.chart_data.analysis.incarnationCross.type}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/chat"
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative px-10 py-5 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  与高我对话
                </span>
              </div>
            </Link>
            <Link
              href="/charts"
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative px-10 py-5 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-lg rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  返回列表
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
