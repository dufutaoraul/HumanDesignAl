/**
 * 用户人类图资料列表页
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ChartsListPage() {
  // 临时模拟数据
  const [charts] = useState([
    {
      id: '1',
      chart_name: '张三的人类图',
      type: '显示生产者',
      profile: '3/5',
      chart_image_url: null,
      created_at: '2025-01-10'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-purple-600">
              人类图 AI 陪伴
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                首页
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
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的人类图资料</h1>
          <p className="text-gray-600 mt-2">
            查看和管理您的人类图资料，与高我对话
          </p>
        </div>

        {/* 资料列表 */}
        {charts.length === 0 ? (
          // 空状态
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有人类图资料
            </h3>
            <p className="text-gray-600">
              请在计算页面输入出生信息来创建人类图
            </p>
          </div>
        ) : (
          // 卡片网格
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* 图片预览 */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                  {chart.chart_image_url ? (
                    <Image
                      src={chart.chart_image_url}
                      alt={chart.chart_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-6xl">👤</div>
                  )}
                </div>

                {/* 卡片内容 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {chart.chart_name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">类型:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {chart.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">人生角色:</span>
                      <span>{chart.profile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">上传时间:</span>
                      <span>{chart.created_at}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Link
                      href={`/charts/${chart.id}`}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      查看详情
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      编辑
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      删除
                    </button>
                  </div>

                  {/* AI 对话入口 */}
                  <Link
                    href={`/chat?chartId=${chart.id}`}
                    className="mt-3 w-full block px-4 py-2 bg-blue-50 text-blue-600 text-center rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    💬 与高我对话
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
