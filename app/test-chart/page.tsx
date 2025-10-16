/**
 * 测试页面 - 验证嵌入式人类图组件
 */

'use client'

import HumanDesignEmbeddedChart from '@/components/HumanDesignEmbeddedChart'

// 模拟人类图数据
const mockData = {
  analysis: {
    type: '显示者',
    profile: '5/1',
    authority: '情绪权威',
    definition: '三分定义',
    channels: ['6-59', '34-20', '57-20'],
    definedCenters: ['Solar Plexus', 'Sacral', 'Spleen'],
    incarnationCross: {
      full: '右角度交叉之解释4',
      key: '解释',
      type: '右角度'
    }
  },
  planets: {
    design: {},
    personality: {}
  }
}

export default function TestChartPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          人类图组件测试页面
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">嵌入式人类图组件</h2>

          <div className="flex justify-center">
            <HumanDesignEmbeddedChart
              data={mockData}
              width={600}
              height={1000}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="mt-8 text-white/60 text-center">
          <p>如果看到人类图图形，说明嵌入式组件工作正常</p>
          <p>如果看到错误，说明还有问题需要解决</p>
        </div>
      </div>
    </div>
  )
}