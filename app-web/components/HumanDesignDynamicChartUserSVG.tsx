/**
 * 基于用户原始SVG的动态人类图组件
 */

'use client'

import { useEffect, useRef } from 'react'

interface HumanDesignData {
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

interface HumanDesignDynamicChartUserSVGProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignDynamicChartUserSVG({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignDynamicChartUserSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = svgRef.current
    const doc = svg.ownerDocument!

    // 获取闸门对应的行星类型
    const getGatePlanet = (gateNum: number, data: HumanDesignData): 'design' | 'personality' => {
      // 检查设计层面的行星
      if (data.planets.design) {
        for (const [, activation] of Object.entries(data.planets.design)) {
          if (typeof activation === 'object' && activation && 'gate' in activation) {
            const activationObj = activation as { gate: number }
            if (activationObj.gate === gateNum) {
              return 'design'
            }
          }
        }
      }

      // 检查个性层面的行星
      if (data.planets.personality) {
        for (const [, activation] of Object.entries(data.planets.personality)) {
          if (typeof activation === 'object' && activation && 'gate' in activation) {
            const activationObj = activation as { gate: number }
            if (activationObj.gate === gateNum) {
              return 'personality'
            }
          }
        }
      }

      // 默认返回设计层面
      return 'design'
    }

    // 清除所有现有的动态样式类
    const clearStyles = () => {
      // 清除中心的填充状态
      const centers = [
        'head-center', 'ajna-center', 'throat-center', 'g-center',
        'ego-center', 'solar-plexus-center', 'spleen-center',
        'sacral-center', 'root-center'
      ]
      centers.forEach(id => {
        const element = doc.getElementById(id)
        if (element) {
          element.classList.remove('center-filled', 'center-empty')
          element.classList.add('center-empty')
        }
      })

      // 清除所有闸门的填充状态
      for (let i = 1; i <= 64; i++) {
        const gate = doc.getElementById(`gate-${i}`)
        const gateText = doc.getElementById(`gate-${i}-text`)
        if (gate) {
          gate.classList.remove('gate-filled', 'gate-empty')
          gate.classList.add('gate-empty')
        }
        if (gateText) {
          gateText.classList.remove('gate-text-filled')
          gateText.classList.add('gate-text')
        }
      }

      // 清除所有通道的颜色
      const channels = svg.querySelectorAll('[id^="channel-"]')
      channels.forEach(channel => {
        channel.classList.remove('channel-design', 'channel-personality', 'channel-both')
        channel.classList.add('channel-inactive')
      })
    }

    // 应用数据驱动的样式
    const applyDataStyles = () => {
      // 获取激活的闸门
      const activeGates = new Set<number>()

      // 从通道中提取激活的闸门
      data.analysis.channels.forEach(channel => {
        const match = channel.match(/(\d+)-(\d+)/)
        if (match) {
          activeGates.add(parseInt(match[1]))
          activeGates.add(parseInt(match[2]))
        }
      })

      // 激活定义的中心
      const centerMap: Record<string, string> = {
        'Head': 'head-center',
        'Ajna': 'ajna-center',
        'Throat': 'throat-center',
        'G': 'g-center',
        'Heart/Ego': 'ego-center',
        'Spleen': 'spleen-center',
        'Solar Plexus': 'solar-plexus-center',
        'Sacral': 'sacral-center',
        'Root': 'root-center'
      }

      data.analysis.definedCenters.forEach(center => {
        const centerId = centerMap[center]
        if (centerId) {
          const element = doc.getElementById(centerId)
          if (element) {
            element.classList.remove('center-empty')
            element.classList.add('center-filled')
          }
        }
      })

      // 激活闸门
      activeGates.forEach(gateNum => {
        const gate = doc.getElementById(`gate-${gateNum}`)
        const gateText = doc.getElementById(`gate-${gateNum}-text`)
        if (gate) {
          gate.classList.remove('gate-empty')
          gate.classList.add('gate-filled')
        }
        if (gateText) {
          gateText.classList.remove('gate-text')
          gateText.classList.add('gate-text-filled')
        }
      })

      // 激活通道并设置颜色 - 使用用户原有的ID格式
      data.analysis.channels.forEach(channel => {
        const match = channel.match(/(\d+)-(\d+)/)
        if (match) {
          const gate1 = parseInt(match[1])
          const gate2 = parseInt(match[2])

          // 检查多种可能的通道ID格式
          const possibleIds = [
            `channel-${gate1}-${gate2}`,
            `${gate1}-${gate2}`,
            `${gate2}-${gate1}`,
            `${gate1}-to-${gate2}`,
            `${gate2}-to-${gate1}`
          ]

          let element: Element | null = null
          for (const id of possibleIds) {
            element = doc.getElementById(id)
            if (element) break
          }

          if (element) {
            element.classList.remove('channel-inactive')

            // 根据行星数据确定通道类型
            const gate1Planet = getGatePlanet(gate1, data)
            const gate2Planet = getGatePlanet(gate2, data)

            if (gate1Planet === 'design' && gate2Planet === 'design') {
              element.classList.add('channel-design')
            } else if (gate1Planet === 'personality' && gate2Planet === 'personality') {
              element.classList.add('channel-personality')
            } else {
              element.classList.add('channel-both')
            }
          }
        }
      })
    }

    // 执行样式更新
    clearStyles()
    applyDataStyles()

  }, [data])

  return (
    <div className={`human-design-dynamic-chart-user-svg ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox="0 0 750 1240"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* 定义样式 */}
        <defs>
          <style>
            {`
              .center-filled { fill: #ffffff; stroke: #ffffff; stroke-width: 2; }
              .center-empty { fill: none; stroke: #ffffff; stroke-width: 2; }
              .gate-filled { fill: #ff4444; stroke: #ffffff; stroke-width: 2; }
              .gate-empty { fill: none; stroke: #ffffff; stroke-width: 2; }
              .gate-text { fill: #000000; font-size: 12px; font-weight: bold; text-anchor: middle; dominant-baseline: central; }
              .gate-text-filled { fill: #ffffff; font-size: 12px; font-weight: bold; text-anchor: middle; dominant-baseline: central; }
              .channel-design { stroke: #ff4444; stroke-width: 4; fill: none; }
              .channel-personality { stroke: #000000; stroke-width: 4; fill: none; }
              .channel-both { stroke: url(#redBlackStripes); stroke-width: 4; fill: none; }
              .channel-inactive { stroke: #666666; stroke-width: 2; fill: none; stroke-dasharray: 2,2; }
            `}
          </style>

          {/* 红黑相间条纹图案 */}
          <pattern id="redBlackStripes" patternUnits="userSpaceOnUse" width="8" height="2" patternTransform="rotate(45)">
            <rect width="4" height="2" fill="#ff4444"/>
            <rect x="4" width="4" height="2" fill="#000000"/>
          </pattern>
        </defs>

        {/* 直接嵌入用户的原始SVG内容 */}
        <image
          href="/human-design-chart.svg"
          width="750"
          height="1240"
          preserveAspectRatio="xMidYMid meet"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* 叠加一个透明的交互层用于动态样式控制 */}
        <g style={{ pointerEvents: 'none' }}>
          {/* 这里会通过JavaScript动态添加样式控制的元素 */}
        </g>

      </svg>
    </div>
  )
}