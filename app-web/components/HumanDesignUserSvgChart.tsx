/**
 * 使用用户示范图的SVG组件 - 直接引用文件
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

interface HumanDesignUserSvgChartProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignUserSvgChart({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignUserSvgChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 直接使用用户的示范图SVG - 通过fetch获取
  const [svgContent, setSvgContent] = useState<string | null>(null)

  useEffect(() => {
    // 获取用户的示范图SVG文件
    fetch('/human-design-chart.svg')
      .then(response => response.text())
      .then(svgText => {
        setSvgContent(svgText)
      })
      .catch(error => {
        console.error('加载示范图SVG失败:', error)
      })
  }, [])

  useEffect(() => {
    console.log('🔍 用户示范图SVG useEffect 开始')
    console.log('📊 数据:', data ? '存在' : '不存在')
    console.log('📋 SVG内容:', svgContent ? '已加载' : '未加载')

    if (!containerRef.current) {
      console.log('❌ containerRef.current 不存在')
      return
    }

    if (!data) {
      console.log('⚠️ 人类图数据为空，显示默认图表')
      return
    }

    if (!svgContent) {
      console.log('⚠️ SVG内容未加载，等待中...')
      return
    }

    const container = containerRef.current
    console.log('📦 容器:', container)

    const svg = container.querySelector('svg') as SVGSVGElement
    console.log('🎨 SVG元素:', svg)

    if (!svg) {
      console.error('❌ SVG element not found')
      console.log('📋 容器内容:', container.innerHTML)
      return
    }

    console.log('✅ 找到SVG元素，开始应用示范图逻辑 ===')

    // 安全检查数据结构
    if (!data.analysis) {
      console.log('⚠️ 缺少analysis数据，使用默认值')
      data.analysis = {
        type: '未知',
        profile: '未知',
        authority: '未知',
        definition: '未知',
        channels: [],
        definedCenters: [],
        incarnationCross: { full: '', key: '', type: '' }
      }
    }

    console.log('通道:', data.analysis.channels || [])
    console.log('定义的中心:', data.analysis.definedCenters || [])

    // 定义每个中心对应的颜色 - 使用鲜艳的颜色
    const centerColors: Record<string, string> = {
      'head-center': '#FF6B6B',      // 红色 - 头部中心
      'ajna-center': '#4ECDC4',      // 青色 - 脑中心
      'throat-center': '#45B7D1',    // 蓝色 - 喉咙中心
      'g-center': '#96CEB4',         // 绿色 - G中心
      'heart-center': '#FFEAA7',    // 橙色 - 心脏中心
      'spleen-center': '#DDA0DD',   // 紫色 - 脾中心
      'solar-plexus-center': '#F4A460', // 棕色 - 情绪中心
      'sacral-center': '#98D8C8',   // 薄荷绿 - 荐骨中心
      'root-center': '#F0E68C'       // 卡其色 - 根中心
    }

    // 激活的闸门集合
    const activeGates = new Set<number>()
    const channels = data.analysis.channels || []

    channels.forEach(channel => {
      try {
        const match = channel.match(/(\d+)-(\d+)/)
        if (match) {
          const gate1 = parseInt(match[1])
          const gate2 = parseInt(match[2])
          activeGates.add(gate1)
          activeGates.add(gate2)
          console.log(`通道 ${channel}: 激活闸门 ${gate1} 和 ${gate2}`)
        }
      } catch (error) {
        console.log(`⚠️ 处理通道 ${channel} 时出错:`, error)
      }
    })

    console.log('激活的闸门:', Array.from(activeGates))

    // 1. 首先激活定义的中心
    const centerMap: Record<string, string> = {
      'Head': 'head-center',
      'Ajna': 'ajna-center',
      'Throat': 'throat-center',
      'G': 'g-center',
      'Heart/Ego': 'heart-center',
      'Spleen': 'spleen-center',
      'Solar Plexus': 'solar-plexus-center',
      'Sacral': 'sacral-center',
      'Root': 'root-center'
    }

    const definedCenters = data.analysis.definedCenters || []

    definedCenters.forEach(center => {
      try {
        const centerId = centerMap[center]
        if (centerId) {
          const escapedCenterId = CSS.escape(centerId)
          const element = svg.querySelector(`#${escapedCenterId}`) as SVGElement
          if (element) {
            const color = centerColors[centerId] || '#ffffff'
            console.log(`✓ 激活中心: ${center} (${centerId}) - 颜色: ${color}`)
            element.style.fill = color
            element.style.stroke = '#333333'
            element.style.strokeWidth = '3'
            element.style.opacity = '1'
          } else {
            console.log(`✗ 中心未找到: ${centerId}`)
          }
        }
      } catch (error) {
        console.log(`⚠️ 处理中心 ${center} 时出错:`, error)
      }
    })

    // 2. 激活闸门
    activeGates.forEach(gateNum => {
      const possibleGateElements = svg.querySelectorAll(`[id*="gate-${gateNum}"]`)
      console.log(`🔍 查找闸门 ${gateNum}, 找到 ${possibleGateElements.length} 个元素`)

      possibleGateElements.forEach(element => {
        const id = element.getAttribute('id')
        if (element.tagName === 'circle' || element.tagName === 'path') {
          console.log(`✓ 激活闸门: ${gateNum} (ID: ${id})`)
          ;(element as SVGElement).style.fill = '#FF4444'
          ;(element as SVGElement).style.stroke = '#333333'
          ;(element as SVGElement).style.strokeWidth = '2'
          ;(element as SVGElement).style.opacity = '1'
        }
      })

      // 查找闸门文字
      const possibleTextElements = svg.querySelectorAll(`[id*="gate-${gateNum}-text"]`)
      possibleTextElements.forEach(textElement => {
        ;(textElement as SVGElement).style.fill = '#ffffff'
      })
    })

    // 3. 激活通道
    channels.forEach(channel => {
      try {
        const match = channel.match(/(\d+)-(\d+)/)
        if (match) {
          const gate1 = parseInt(match[1])
          const gate2 = parseInt(match[2])

          console.log(`处理通道: ${channel} (${gate1}-${gate2})`)

          const allPaths = svg.querySelectorAll('path, line')
          let channelFound = false

          allPaths.forEach(path => {
            try {
              const pathId = path.getAttribute('id')
              if (pathId) {
                if (
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
            } catch (error) {
              console.log(`⚠️ 处理路径时出错:`, error)
            }
          })

          if (!channelFound) {
            console.log(`✗ 通道未找到: ${channel}`)
          }
        }
      } catch (error) {
        console.log(`⚠️ 处理通道 ${channel} 时出错:`, error)
      }
    })

    console.log('=== 用户示范图样式应用完成 ===')

  }, [data, svgContent])

  return (
    <div className={`human-design-user-svg-chart ${className}`}>
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
        {svgContent && (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        )}
        {!svgContent && (
          <div className="text-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">加载人类图中...</p>
          </div>
        )}
      </div>
    </div>
  )
}