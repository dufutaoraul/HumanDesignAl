/**
 * 修复版：基于用户原始SVG的动态人类图组件
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

interface HumanDesignDynamicChartFixedProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignDynamicChartFixed({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignDynamicChartFixedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // 加载用户的原始SVG
    fetch('/human-design-chart.svg')
      .then(response => response.text())
      .then(svgText => {
        console.log('SVG content loaded, length:', svgText.length)
        setSvgContent(svgText)
      })
      .catch(error => {
        console.error('Error loading SVG:', error)
      })
  }, [])

  useEffect(() => {
    if (!containerRef.current || !data || !svgContent) {
      console.log('Missing data or SVG content')
      return
    }

    console.log('Applying dynamic styles...')
    const container = containerRef.current
    const svg = container.querySelector('svg') as SVGSVGElement

    if (!svg) {
      console.error('SVG element not found')
      return
    }

    console.log('SVG found, applying styles...')

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
    console.log('Defined centers:', data.analysis.definedCenters)
    data.analysis.definedCenters.forEach(center => {
      const centerId = centerMap[center]
      if (centerId) {
        const element = svg.querySelector(`#${centerId}`) as SVGPathElement
        if (element) {
          console.log('Filling center:', centerId)
          element.style.fill = '#ffffff'
          element.style.stroke = '#ffffff'
          element.style.strokeWidth = '2'
        } else {
          console.log('Center not found:', centerId)
        }
      }
    })

    // 激活闸门
    activeGates.forEach(gateNum => {
      const gate = svg.querySelector(`#gate-${gateNum}`) as SVGCircleElement
      const gateText = svg.querySelector(`#gate-${gateNum}-text`) as SVGTextElement

      if (gate) {
        console.log('Filling gate:', gateNum)
        gate.style.fill = '#ff4444'
        gate.style.stroke = '#ffffff'
        gate.style.strokeWidth = '2'
      }

      if (gateText) {
        const tspans = gateText.querySelectorAll('tspan')
        tspans.forEach(tspan => {
          tspan.setAttribute('fill', '#ffffff')
        })
      }
    })

    // 激活通道
    console.log('Activating channels:', data.analysis.channels)
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        const gate1 = parseInt(match[1])
        const gate2 = parseInt(match[2])

        // 查找连接这两个闸门的路径
        const allPaths = svg.querySelectorAll('path')
        allPaths.forEach(path => {
          const pathId = path.getAttribute('id')
          if (pathId && (
            (pathId.includes(`gate-${gate1}`) && pathId.includes(`gate-${gate2}`)) ||
            (pathId.includes(`${gate1}-${gate2}`)) ||
            (pathId.includes(`${gate2}-${gate1}`))
          )) {
            console.log('Found channel path:', pathId)
            path.style.stroke = '#ff4444'
            path.style.strokeWidth = '4'
            path.style.fill = 'none'
          }
        })
      }
    })

  }, [data, svgContent])

  if (!svgContent) {
    return (
      <div className={`human-design-dynamic-chart-fixed ${className}`}>
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
    <div className={`human-design-dynamic-chart-fixed ${className}`}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: width,
          height: 'auto',
          maxHeight: height,
          overflow: 'hidden'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    </div>
  )
}