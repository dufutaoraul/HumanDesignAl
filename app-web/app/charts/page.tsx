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
  birth_location: string
  is_self: boolean // 是否是本人
  hd_type: string
  hd_authority: string
  hd_profile: string
  hd_incarnation_cross: string
  hd_definition: string
  hd_channels: string[]
  hd_centers: Record<string, boolean>
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

  useEffect(() => {
    if (user) {
      loadCharts()
    }
  }, [user])

  const loadCharts = async () => {
    try {
      const response = await fetch('/api/charts')
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-purple-600">
              人类图 AI 陪伴
            </h1>
            <div className="flex gap-4">
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                聊天
              </Link>
              <Link href="/charts" className="text-purple-600 font-medium">
                我的资料
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和操作 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的人类图资料</h1>
            <p className="text-gray-600 mt-2">
              查看和管理您的人类图资料，与高我对话
            </p>
          </div>
          <Link
            href="/calculate"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            + 新增人类图
          </Link>
        </div>

        {/* 资料列表 */}
        {charts.length === 0 ? (
          // 空状态
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有人类图资料
            </h3>
            <p className="text-gray-600 mb-6">
              请点击上方&ldquo;新增人类图&rdquo;按钮，输入出生信息来创建人类图
            </p>
            <Link
              href="/calculate"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              立即创建
            </Link>
          </div>
        ) : (
          // 卡片网格
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* 图片预览区域 */}
                <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                  <div className="text-5xl">👤</div>
                  {chart.is_self && (
                    <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-medium">
                      我的人类图
                    </div>
                  )}
                </div>

                {/* 卡片内容 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {chart.name}
                  </h3>

                  {/* 基本信息 */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 w-20">类型:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                        {chart.hd_type || '未知'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 w-20">人生角色:</span>
                      <span className="text-gray-900">{chart.hd_profile || '未知'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 w-20">内在权威:</span>
                      <span className="text-gray-900 text-xs">{chart.hd_authority || '未知'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 w-20">定义:</span>
                      <span className="text-gray-900">{chart.hd_definition || '未知'}</span>
                    </div>
                  </div>

                  {/* 通道信息 */}
                  {chart.hd_channels && chart.hd_channels.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">激活通道:</div>
                      <div className="flex flex-wrap gap-1">
                        {chart.hd_channels.slice(0, 3).map((channel, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
                          >
                            {channel}
                          </span>
                        ))}
                        {chart.hd_channels.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{chart.hd_channels.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 轮回交叉 */}
                  {chart.hd_incarnation_cross && (
                    <div className="mb-4 text-xs text-gray-600">
                      <span className="font-medium">轮回交叉: </span>
                      <span>{chart.hd_incarnation_cross}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    上传时间: {new Date(chart.created_at).toLocaleDateString()}
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-2">
                    <Link
                      href={`/chat`}
                      className="w-full block px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      💬 与高我对话
                    </Link>
                    <div className="flex gap-2">
                      <Link
                        href={`/charts/${chart.id}`}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        查看详情
                      </Link>
                      <button
                        onClick={() => deleteChart(chart.id)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        删除
                      </button>
                    </div>
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
