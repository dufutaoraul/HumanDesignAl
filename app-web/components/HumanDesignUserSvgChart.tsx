/**
 * 用户原始SVG内嵌组件 - 基于用户手动绘制的SVG
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

  // 读取用户绘制的完整SVG文件
  const [svgContent, setSvgContent] = useState<string>(
    `<svg width="750" height="1240" viewBox="0 0 750 1240" xmlns="http://www.w3.org/2000/svg">
      <text x="375" y="620" text-anchor="middle" font-size="20" fill="#666">正在加载SVG...</text>
    </svg>`
  )

  // 异步加载SVG文件
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch('/human-design-complete.svg')
        if (response.ok) {
          const svgText = await response.text()
          setSvgContent(svgText)
          console.log('✅ 成功加载用户完整SVG文件')
        } else {
          console.log('⚠️ 无法加载SVG文件，使用默认内容')
        }
      } catch (error) {
        console.log('⚠️ SVG文件加载出错:', error)
      }
    }

    loadSvg()
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (!data) {
      console.log('⚠️ 人类图数据为空，显示默认图表')
      return
    }

    const container = containerRef.current
    const svg = container.querySelector('svg') as SVGSVGElement

    if (!svg) {
      console.error('SVG element not found')
      return
    }

    console.log('=== 应用用户SVG人类图逻辑 ===')

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
      'Heart/Ego': 'heart-center',  // 更新为用户SVG中的ID
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
            element.style.stroke = '#ffffff'
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
      const possibleIds = [
        `gate-${gateNum}`,
        `gate-${gateNum}-text`,
        `gate_${gateNum}`,
        `gate${gateNum}`
      ]

      let gateFound = false
      for (const id of possibleIds) {
        // 使用CSS.escape来处理特殊字符和数字开头的问题
        const escapedId = CSS.escape(id)
        const gate = svg.querySelector(`#${escapedId}`) as SVGElement
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
        const escapedTextId = CSS.escape(textId)
        const gateText = svg.querySelector(`#${escapedTextId}`) as SVGElement
        if (gateText) {
          gateText.style.fill = '#ffffff'
          break
        }
      }

      if (!gateFound) {
        console.log(`✗ 闸门未找到: ${gateNum}`)
      }
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

    console.log('=== 用户SVG人类图样式应用完成 ===')

  }, [data])

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