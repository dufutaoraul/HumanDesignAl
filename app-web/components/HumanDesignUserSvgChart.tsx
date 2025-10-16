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

  // 基于用户原始SVG创建的核心结构
  const svgContent = `<svg width="750" height="1240" viewBox="0 0 750 1240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="redBlackStripes" patternUnits="userSpaceOnUse" width="8" height="2" patternTransform="rotate(45)">
      <rect width="4" height="2" fill="#ff4444"/>
      <rect x="4" width="4" height="2" fill="#000000"/>
    </pattern>
  </defs>

  <!-- 背景 -->
  <rect width="750" height="1240" fill="#f8f8f8"/>

  <!-- 用户绘制的9大中心 - 基于原始SVG的结构 -->
  <!-- 头部中心 -->
  <path
    id="head-center"
    d="m 370.08188,116.21474 -69.3766,-120.1637814 138.75319,-3.7e-6 z"
    transform="matrix(1,0,0,-1.1079813,5.2683343,166.10256)"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 脑中心 -->
  <path
    id="ajna-center"
    d="m 370.08188,116.21474 -69.3766,-120.1637814 138.75319,-3.7e-6 z"
    transform="matrix(1,0,0,1.1314554,5.3594177,212.92131)"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 喉咙中心 - 从用户SVG推断 -->
  <rect
    id="throat-center"
    x="340"
    y="380"
    width="70"
    height="50"
    rx="5"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- G中心 -->
  <ellipse
    id="g-center"
    cx="375"
    cy="520"
    rx="60"
    ry="60"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 心脏中心 -->
  <path
    id="ego-center"
    d="m 558.50773,737.9072 -143.49352,1.60853 70.35373,-125.0733 z"
    transform="matrix(1.0235892,0,0,0.63915609,2.90351,290.54401)"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 脾中心 -->
  <path
    id="spleen-center"
    d="M -9.0263898,898.12556 -7.1285051,725.52846 141.39603,813.47062 Z"
    transform="matrix(0.9324922,0,0,0.88886792,50.164078,162.99527)"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 太阳神经丛中心 -->
  <path
    id="solar-plexus-center"
    d="M -9.0263898,898.12556 -7.1285051,725.52846 141.39603,813.47062 Z"
    transform="matrix(-0.89021835,0,0,0.88886792,700.14743,162.71614)"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 荐骨中心 -->
  <rect
    id="sacral-center"
    x="320"
    y="700"
    width="110"
    height="80"
    rx="10"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 根中心 -->
  <rect
    id="root-center"
    x="330"
    y="850"
    width="90"
    height="60"
    rx="8"
    fill="none"
    stroke="#333"
    stroke-width="2"
    opacity="0.8"
  />

  <!-- 用户原始SVG中的部分闸门示例 -->
  <ellipse
    id="gate-20"
    cx="328.79944"
    cy="483.89899"
    rx="10.718836"
    ry="10.577798"
    fill="none"
    stroke="#666"
    stroke-width="1"
  />
  <text id="gate-20-text" x="328.8" y="483.9" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="10">20</text>

  <ellipse
    id="gate-12"
    cx="422.77435"
    cy="483.11554"
    rx="10.718836"
    ry="10.577798"
    fill="none"
    stroke="#666"
    stroke-width="1"
  />
  <text id="gate-12-text" x="422.8" y="483.1" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="10">12</text>

  <ellipse
    id="gate-16"
    cx="329.80615"
    cy="438.41693"
    rx="10.718836"
    ry="10.577798"
    fill="none"
    stroke="#666"
    stroke-width="1"
  />
  <text id="gate-16-text" x="329.8" y="438.4" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="10">16</text>

  <!-- 头部中心闸门 -->
  <circle id="gate-64" cx="320" cy="80" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-64-text" x="320" y="80" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">64</text>
  <circle id="gate-61" cx="375" cy="60" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-61-text" x="375" y="60" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">61</text>
  <circle id="gate-63" cx="430" cy="80" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-63-text" x="430" y="80" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">63</text>

  <!-- 脑中心闸门 -->
  <circle id="gate-47" cx="320" cy="150" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-47-text" x="320" y="150" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">47</text>
  <circle id="gate-24" cx="375" cy="140" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-24-text" x="375" y="140" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">24</text>
  <circle id="gate-4" cx="430" cy="150" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-4-text" x="430" y="150" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">4</text>

  <!-- 喉咙中心闸门 -->
  <circle id="gate-62" cx="320" cy="280" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-62-text" x="320" y="280" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">62</text>
  <circle id="gate-17" cx="375" cy="270" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-17-text" x="375" y="270" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">17</text>
  <circle id="gate-31" cx="430" cy="280" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-31-text" x="430" y="280" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">31</text>

  <!-- G中心闸门 -->
  <circle id="gate-7" cx="340" cy="480" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-7-text" x="340" y="480" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">7</text>
  <circle id="gate-13" cx="410" cy="480" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-13-text" x="410" y="480" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">13</text>

  <!-- 心脏中心闸门 -->
  <circle id="gate-21" cx="480" cy="600" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-21-text" x="480" y="600" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">21</text>
  <circle id="gate-51" cx="520" cy="630" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-51-text" x="520" y="630" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">51</text>

  <!-- 脾中心闸门 -->
  <circle id="gate-44" cx="250" cy="650" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-44-text" x="250" y="650" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">44</text>
  <circle id="gate-48" cx="220" cy="680" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-48-text" x="220" y="680" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">48</text>

  <!-- 太阳神经丛中心闸门 -->
  <circle id="gate-55" cx="500" cy="650" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-55-text" x="500" y="650" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">55</text>
  <circle id="gate-39" cx="530" cy="680" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-39-text" x="530" y="680" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">39</text>
  <circle id="gate-36" cx="480" cy="700" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-36-text" x="480" y="700" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">36</text>

  <!-- 荐骨中心闸门 -->
  <circle id="gate-3" cx="320" cy="750" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-3-text" x="320" y="750" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">3</text>
  <circle id="gate-42" cx="360" cy="760" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-42-text" x="360" y="760" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">42</text>
  <circle id="gate-9" cx="390" cy="750" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-9-text" x="390" y="750" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">9</text>
  <circle id="gate-5" cx="430" cy="760" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-5-text" x="430" y="760" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">5</text>

  <!-- 根中心闸门 -->
  <circle id="gate-58" cx="320" cy="880" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-58-text" x="320" y="880" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">58</text>
  <circle id="gate-60" cx="375" cy="870" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-60-text" x="375" y="870" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">60</text>
  <circle id="gate-52" cx="430" cy="880" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-52-text" x="430" y="880" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">52</text>
  <circle id="gate-53" cx="400" cy="900" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-53-text" x="400" y="900" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">53</text>
  <circle id="gate-19" cx="350" cy="900" r="10" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-19-text" x="350" y="900" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="9">19</text>
  <circle id="gate-6" cx="280" cy="750" r="12" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-6-text" x="280" y="750" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="10">6</text>
  <circle id="gate-59" cx="470" cy="750" r="12" fill="none" stroke="#666" stroke-width="1"/>
  <text id="gate-59-text" x="470" y="750" text-anchor="middle" dominant-baseline="central" fill="#333" font-size="10">59</text>

  <!-- 主要通道连接 -->
  <!-- 6-59 通道 (荐骨到根中心) -->
  <path id="channel-6-59" d="M 280 750 Q 375 800 470 750" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 34-20 通道 (荐骨到喉咙) -->
  <path id="channel-34-20" d="M 360 740 Q 340 500 328 483" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 57-20 通道 (脾到喉咙) -->
  <path id="channel-57-20" d="M 250 660 Q 290 450 328 483" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 10-20 通道 (G中心到喉咙) -->
  <path id="channel-10-20" d="M 380 440 Q 355 460 328 483" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 7-31 通道 (G中心到喉咙) -->
  <path id="channel-7-31" d="M 340 480 Q 385 380 430 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 13-33 通道 (G中心到喉咙) -->
  <path id="channel-13-33" d="M 410 480 Q 385 380 320 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 63-4 通道 (脑中心到喉咙) -->
  <path id="channel-63-4" d="M 430 150 Q 430 215 430 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 64-47 通道 (头部到脑中心) -->
  <path id="channel-64-47" d="M 320 80 Q 320 115 320 150" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 61-24 通道 (头部到脑中心) -->
  <path id="channel-61-24" d="M 375 60 Q 375 100 375 140" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 17-62 通道 (喉咙到逻辑) -->
  <path id="channel-17-62" d="M 375 270 Q 347 275 320 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 20-34 通道 (喉咙到荐骨) -->
  <path id="channel-20-34" d="M 328 483 Q 344 610 360 740" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 21-45 通道 (心脏到喉咙) -->
  <path id="channel-21-45" d="M 480 600 Q 455 440 430 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 51-25 通道 (心脏到喉咙) -->
  <path id="channel-51-25" d="M 520 630 Q 445 450 375 270" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 58-18 通道 (根中心到脾) -->
  <path id="channel-58-18" d="M 320 880 Q 285 765 250 660" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 60-3 通道 (根中心到荐骨) -->
  <path id="channel-60-3" d="M 375 870 Q 347 810 320 750" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 52-9 通道 (根中心到荐骨) -->
  <path id="channel-52-9" d="M 430 880 Q 410 815 390 750" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 19-49 通道 (根中心到脾) -->
  <path id="channel-19-49" d="M 350 900 Q 285 790 230 690" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 55-39 通道 (情绪中心到脾) -->
  <path id="channel-55-39" d="M 500 650 Q 365 665 250 660" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 36-35 通道 (情绪中心到喉咙) -->
  <path id="channel-36-35" d="M 480 700 Q 405 490 320 280" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 22-12 通道 (喉咙到G中心) -->
  <path id="channel-22-12" d="M 430 280 Q 426 380 422 460" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>

  <!-- 45-21 通道 (喉咙到心脏) -->
  <path id="channel-45-21" d="M 430 280 Q 455 440 480 600" fill="none" stroke="#999" stroke-width="3" opacity="0.6"/>
</svg>`

  useEffect(() => {
    if (!containerRef.current || !data) {
      return
    }

    const container = containerRef.current
    const svg = container.querySelector('svg') as SVGSVGElement

    if (!svg) {
      console.error('SVG element not found')
      return
    }

    console.log('=== 应用用户SVG人类图逻辑 ===')
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
      const possibleIds = [
        `gate-${gateNum}`,
        `gate-${gateNum}-text`,
        `gate_${gateNum}`,
        `gate${gateNum}`,
        `${gateNum}`
      ]

      let gateFound = false
      for (const id of possibleIds) {
        const gate = svg.querySelector(`#${id}`) as SVGElement
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
        const gateText = svg.querySelector(`#${textId}`) as SVGElement
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
    data.analysis.channels.forEach(channel => {
      const match = channel.match(/(\d+)-(\d+)/)
      if (match) {
        const gate1 = parseInt(match[1])
        const gate2 = parseInt(match[2])

        console.log(`处理通道: ${channel} (${gate1}-${gate2})`)

        const allPaths = svg.querySelectorAll('path, line')
        let channelFound = false

        allPaths.forEach(path => {
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
        })

        if (!channelFound) {
          console.log(`✗ 通道未找到: ${channel}`)
        }
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