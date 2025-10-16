/**
 * 基于用户原始SVG结构的动态人类图组件
 */

'use client'

import { useEffect, useRef, useState } from 'react'

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

interface HumanDesignDynamicChartOriginalProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignDynamicChartOriginal({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignDynamicChartOriginalProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // 加载用户的原始SVG
    fetch('/human-design-chart.svg')
      .then(response => response.text())
      .then(svgText => {
        setSvgContent(svgText)
      })
      .catch(error => {
        console.error('Error loading SVG:', error)
      })
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data || !svgContent) return

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
          // 移除任何现有的样式
          element.setAttribute('fill', 'none')
          element.setAttribute('stroke', '#ffffff')
          element.setAttribute('stroke-width', '2')
        }
      })

      // 清除所有闸门的填充状态
      for (let i = 1; i <= 64; i++) {
        const gate = doc.getElementById(`gate-${i}`)
        const gateText = doc.getElementById(`gate-${i}-text`)
        if (gate) {
          gate.setAttribute('fill', 'none')
          gate.setAttribute('stroke', '#ffffff')
          gate.setAttribute('stroke-width', '2')
        }
        if (gateText) {
          const tspans = gateText.querySelectorAll('tspan')
          tspans.forEach(tspan => {
            tspan.setAttribute('fill', '#000000')
          })
        }
      }
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
            element.setAttribute('fill', '#ffffff')
          }
        }
      })

      // 激活闸门
      activeGates.forEach(gateNum => {
        const gate = doc.getElementById(`gate-${gateNum}`)
        const gateText = doc.getElementById(`gate-${gateNum}-text`)
        if (gate) {
          gate.setAttribute('fill', '#ff4444')
        }
        if (gateText) {
          const tspans = gateText.querySelectorAll('tspan')
          tspans.forEach(tspan => {
            tspan.setAttribute('fill', '#ffffff')
          })
        }
      })

      // 激活通道并设置颜色
      data.analysis.channels.forEach(channel => {
        const match = channel.match(/(\d+)-(\d+)/)
        if (match) {
          const gate1 = parseInt(match[1])
          const gate2 = parseInt(match[2])

          // 根据行星数据确定通道类型
          const gate1Planet = getGatePlanet(gate1, data)
          const gate2Planet = getGatePlanet(gate2, data)

          let strokeColor = '#ff4444' // 默认红色
          if (gate1Planet === 'personality' && gate2Planet === 'personality') {
            strokeColor = '#000000' // 黑色
          } else if (gate1Planet !== gate2Planet) {
            strokeColor = 'url(#redBlackStripes)' // 红黑条纹
          }

          // 查找连接这两个闸门的路径
          const allPaths = svg.querySelectorAll('path')
          allPaths.forEach(path => {
            const d = path.getAttribute('d')
            if (d) {
              // 检查这个路径是否连接了这两个闸门
              // 这里需要根据实际的SVG路径格式来判断
              // 暂时通过ID或属性来识别
              const pathId = path.getAttribute('id')
              if (pathId && (
                pathId.includes(`${gate1}`) && pathId.includes(`${gate2}`) ||
                pathId.includes(`${gate1}-${gate2}`) ||
                pathId.includes(`${gate2}-${gate1}`)
              )) {
                path.setAttribute('stroke', strokeColor)
                path.setAttribute('stroke-width', '4')
              }
            }
          })
        }
      })
    }

    // 执行样式更新
    clearStyles()
    applyDataStyles()

  }, [data, svgContent])

  if (!svgContent) {
    return (
      <div className={`human-design-dynamic-chart-original ${className}`}>
        <div className="flex items-center justify-center" style={{ width, height }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">加载人类图中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`human-design-dynamic-chart-original ${className}`}>
      <div
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ maxWidth: width }}
      />
    </div>
  )
}