/**
 * 完整的人类图组件 - 确保显示所有元素
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

interface HumanDesignCompleteChartProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignCompleteChart({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignCompleteChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // 加载用户的原始SVG
    fetch('/human-design-chart.svg')
      .then(response => response.text())
      .then(svgText => {
        console.log('SVG loaded, length:', svgText.length)
        setSvgContent(svgText)
      })
      .catch(error => {
        console.error('Error loading SVG:', error)
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

    console.log('Applying dynamic styles to complete chart...')

    // 确保SVG尺寸正确
    svg.style.width = '100%'
    svg.style.height = 'auto'
    svg.style.maxWidth = `${width}px`
    svg.style.maxHeight = `${height}px`

    // 确保所有元素可见
    const allElements = svg.querySelectorAll('*')
    allElements.forEach(element => {
      (element as SVGElement).style.visibility = 'visible'
      ;(element as SVGElement).style.display = 'block'
    })

    // 获取激活的闸门
    const activeGates = new Set<number>()
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        activeGates.add(parseInt(match[1]))
        activeGates.add(parseInt(match[2]))
      }
    })

    console.log('Active gates:', Array.from(activeGates))
    console.log('Defined centers:', data.analysis.definedCenters)
    console.log('Channels:', data.analysis.channels)

    // 中心映射
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

    // 激活定义的中心
    data.analysis.definedCenters.forEach(center => {
      const centerId = centerMap[center]
      if (centerId) {
        const element = svg.querySelector(`#${centerId}`) as SVGPathElement
        if (element) {
          console.log('✓ Filling center:', centerId)
          element.style.fill = '#ffffff'
          element.style.stroke = '#ffffff'
          element.style.strokeWidth = '2'
          element.style.opacity = '1'
        } else {
          console.log('✗ Center not found:', centerId)
        }
      }
    })

    // 激活闸门 - 使用多种可能的ID格式
    activeGates.forEach(gateNum => {
      const possibleIds = [
        `gate-${gateNum}`,
        `gate_${gateNum}`,
        `gate${gateNum}`
      ]

      for (const id of possibleIds) {
        const gate = svg.querySelector(`#${id}`) as SVGCircleElement
        if (gate) {
          console.log(`✓ Filling gate: ${gateNum} (found as ${id})`)
          gate.style.fill = '#ff4444'
          gate.style.stroke = '#ffffff'
          gate.style.strokeWidth = '2'
          gate.style.opacity = '1'
          break
        }
      }

      // 查找闸门文字
      for (const id of possibleIds) {
        const gateText = svg.querySelector(`#${id}-text`) as SVGTextElement
        if (gateText) {
          const tspans = gateText.querySelectorAll('tspan')
          tspans.forEach(tspan => {
            tspan.setAttribute('fill', '#ffffff')
          })
          break
        }
      }
    })

    // 激活通道 - 查找连接两个闸门的路径
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        const gate1 = parseInt(match[1])
        const gate2 = parseInt(match[2])
        console.log(`Looking for channel between gate ${gate1} and gate ${gate2}`)

        // 查找所有路径，看哪些连接了这两个闸门
        const allPaths = svg.querySelectorAll('path, line')
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
              console.log(`✓ Found channel: ${pathId}`)
              ;(path as SVGElement).style.stroke = '#ff4444'
              ;(path as SVGElement).style.strokeWidth = '4'
              ;(path as SVGElement).style.fill = 'none'
              ;(path as SVGElement).style.opacity = '1'
            }
          }
        })
      }
    })

    // 确保所有元素都可见
    setTimeout(() => {
      const circles = svg.querySelectorAll('circle')
      const paths = svg.querySelectorAll('path')
      const lines = svg.querySelectorAll('line')
      const texts = svg.querySelectorAll('text')

      console.log(`Found elements: ${circles.length} circles, ${paths.length} paths, ${lines.length} lines, ${texts.length} texts`)

      circles.forEach((circle, index) => {
        const id = circle.getAttribute('id')
        console.log(`Circle ${index}: ${id}`)
      })

    }, 1000)

  }, [data, svgContent])

  if (!svgContent) {
    return (
      <div className={`human-design-complete-chart ${className}`}>
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
    <div className={`human-design-complete-chart ${className}`}>
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