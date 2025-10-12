/**
 * Supabase 数据库连接测试页面
 * 访问 http://localhost:3000/test-db 测试数据库连接
 */

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDatabasePage() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    setStatus('testing')
    setMessage('正在测试数据库连接...')

    try {
      // 测试数据库连接
      const { error } = await supabase.from('_test').select('*').limit(1)

      if (error) {
        // 如果表不存在是正常的,说明连接成功
        if (error.code === '42P01') {
          setStatus('success')
          setMessage('✓ 数据库连接成功!\n\n您的 Supabase 配置正确。\n\n接下来您可以创建数据表了。')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('✓ 数据库连接成功!')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setStatus('error')
      setMessage(`✗ 连接失败:\n\n${errorMessage}\n\n请检查 .env.local 文件中的配置是否正确。`)
      console.error('数据库连接错误:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Supabase 连接测试
        </h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            点击下方按钮测试 Supabase 数据库连接是否正常。
          </p>

          <button
            onClick={testConnection}
            disabled={status === 'testing'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {status === 'testing' ? '测试中...' : '测试连接'}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 border border-green-200'
                : status === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {message}
            </pre>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-2">配置说明:</h2>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>确保已创建 <code className="bg-gray-100 px-1 rounded">.env.local</code> 文件</li>
            <li>填入 Supabase 项目 URL</li>
            <li>填入 Supabase anon key</li>
            <li>重启开发服务器</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
