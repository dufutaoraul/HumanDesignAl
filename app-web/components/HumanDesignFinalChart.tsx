/**
 * 最终完整的人类图组件 - 包含所有要求和正确逻辑
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

interface HumanDesignFinalChartProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignFinalChart({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignFinalChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // 加载完整的SVG - 使用正确的路径
    const svgPath = '/human-design-full-complete.svg'
    console.log('Loading SVG from:', svgPath)

    fetch(svgPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then(svgText => {
        console.log('Full SVG loaded, length:', svgText.length)
        setSvgContent(svgText)
      })
      .catch(error => {
        console.error('Error loading SVG:', error)
        console.error('Failed path:', svgPath)
        // 如果完整SVG加载失败，尝试使用原始SVG
        console.log('Trying fallback to original SVG...')
        fetch('/human-design-chart.svg')
          .then(response => response.text())
          .then(svgText => {
            console.log('Fallback SVG loaded, length:', svgText.length)
            setSvgContent(svgText)
          })
          .catch(fallbackError => {
            console.error('Fallback SVG also failed:', fallbackError)
          })
      })
  }, [])

  useEffect(() => {
    if (!containerRef.current || !data || !svgContent) {
      return
    }

    const container = containerRef.current
    const svg = container.querySelector('svg') as SVGSVGElement

    if (!svg) {
      console.error('SVG element not found')
      return
    }

    console.log('=== 应用最终人类图逻辑 ===')
    console.log('通道:', data.analysis.channels)
    console.log('定义的中心:', data.analysis.definedCenters)

    // 定义每个中心对应的颜色
    const centerColors: Record<string, string> = {
      'head-center': '#E8F4F8',      // 淡蓝色 - 头部中心
      'ajna-center': '#F0F8FF',      // 淡紫色 - 脑中心
      'throat-center': '#FFF8DC',    // 淡黄色 - 喉咙中心
      'g-center': '#F5FFFA',         // 淡绿色 - G中心
      'ego-center': '#FFE4E1',       // 淡粉色 - 心脏中心
      'spleen-center': '#FFFACD',    // 淡橙色 - 脾中心
      'solar-plexus-center': '#FFCCCB', // 淡红色 - 情绪中心
      'sacral-center': '#F0FFF0',     // 淡绿色 - 荐骨中心
      'root-center': '#FFF5EE'       // 淡棕色 - 根中心
    }

    // 激活的闸门集合
    const activeGates = new Set<number>()
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        const gate1 = parseInt(match[1])
        const gate2 = parseInt(match[2])
        activeGates.add(gate1)
        activeGates.add(gate2)
        console.log(`通道 ${channel}: 激活闸门 ${gate1} 和 ${gate2}`)
      }
    })

    console.log('激活的闸门:', Array.from(activeGates))

    // 1. 首先激活定义的中心
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
        const element = svg.querySelector(`#${centerId}`) as SVGElement
        if (element) {
          const color = centerColors[centerId] || '#ffffff'
          console.log(`✓ 激活中心: ${center} (${centerId}) - 颜色: ${color}`)
          element.style.fill = color
          element.style.stroke = '#ffffff'
          element.style.strokeWidth = '3'
          element.style.opacity = '1'
        } else {
          console.log(`✗ 中心未找到: ${centerId}`)
        }
      }
    })

    // 2. 激活闸门
    activeGates.forEach(gateNum => {
      // 尝试多种可能的ID格式
      const possibleIds = [
        `gate-${gateNum}`,
        `gate-${gateNum}-text`,
        `gate_${gateNum}`,
        `gate${gateNum}`,
        `${gateNum}`
      ]

      let gateFound = false
      for (const id of possibleIds) {
        const gate = svg.querySelector(`#${id}`) as SVGCircleElement
        if (gate) {
          console.log(`✓ 激活闸门: ${gateNum} (ID: ${id})`)
          gate.style.fill = '#FF4444'
          gate.style.stroke = '#ffffff'
          gate.style.strokeWidth = '2'
          gate.style.opacity = '1'
          gateFound = true
          break
        }
      }

      // 查找闸门文字
      for (const id of possibleIds) {
        const textId = id.includes('-text') ? id : `${id}-text`
        const gateText = svg.querySelector(`#${textId}`) as SVGTextElement
        if (gateText) {
          const tspans = gateText.querySelectorAll('tspan')
          tspans.forEach(tspan => {
            tspan.setAttribute('fill', '#ffffff')
          })
          break
        }
      }

      if (!gateFound) {
        console.log(`✗ 闸门未找到: ${gateNum}`)
      }
    })

    // 3. 激活通道
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        const gate1 = parseInt(match[1])
        const gate2 = parseInt(match[2])

        console.log(`处理通道: ${channel} (${gate1}-${gate2})`)

        // 查找连接这两个闸门的路径
        const allPaths = svg.querySelectorAll('path, line')
        let channelFound = false

        allPaths.forEach(path => {
          const pathId = path.getAttribute('id')
          if (pathId) {
            // 检查路径ID是否包含这两个闸门
            if (
              (pathId.includes(`${gate1}`) && pathId.includes(`${gate2}`)) ||
              (pathId.includes(`${gate1}-${gate2}`)) ||
              (pathId.includes(`${gate2}-${gate1}`)) ||
              (pathId.includes(`gate-${gate1}`) && pathId.includes(`gate-${gate2}`))
            ) {
              console.log(`✓ 激活通道: ${pathId}`)
              ;(path as SVGElement).style.stroke = '#FF4444'
              ;(path as SVGElement).style.strokeWidth = '4'
              ;(path as SVGElement).style.fill = 'none'
              ;(path as SVGElement).style.opacity = '1'
              channelFound = true
            }
          }
        })

        if (!channelFound) {
          console.log(`✗ 通道未找到: ${channel}`)
        }
      }
    })

    // 4. 确保所有元素都可见
    const allElements = svg.querySelectorAll('*')
    allElements.forEach(element => {
      ;(element as SVGElement).style.visibility = 'visible'
    })

    console.log('=== 人类图样式应用完成 ===')

  }, [data, svgContent])

  if (!svgContent) {
    return (
      <div className={`human-design-final-chart ${className}`}>
        <div className="flex items-center justify-center" style={{ width, height }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">加载完整人类图中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`human-design-final-chart ${className}`}>
      <div
        ref={containerRef}
        className="flex justify-center items-center"
        style={{
          width: '100%',
          maxWidth: width,
          height: 'auto',
          maxHeight: height,
          overflow: 'visible'
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            width: '100%',
            height: 'auto'
          }}
        />
      </div>
    </div>
  )
}