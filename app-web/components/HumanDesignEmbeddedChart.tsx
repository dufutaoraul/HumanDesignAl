/**
 * 嵌入式人类图组件 - 直接包含SVG内容避免加载问题
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

interface HumanDesignEmbeddedChartProps {
  data: HumanDesignData
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignEmbeddedChart({
  data,
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignEmbeddedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 直接嵌入SVG内容，避免文件加载问题
  const svgContent = `
<svg width="750" height="1240" viewBox="0 0 750 1240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 定义渐变和图案 -->
    <pattern id="redBlackStripes" patternUnits="userSpaceOnUse" width="8" height="2" patternTransform="rotate(45)">
      <rect width="4" height="2" fill="#ff4444"/>
      <rect x="4" width="4" height="2" fill="#000000"/>
    </pattern>

    <!-- 中心颜色定义 -->
    <linearGradient id="headCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e8f4f8;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="ajnaCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f8ff;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="throatCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fff8dc;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="gCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5fffa;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="heartCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffe4e1;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="spleenCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fffacd;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="solarPlexusCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffcccb;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="sacralCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0fff0;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="rootCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fff5ee;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 头部中心 - 三角形 -->
  <path id="head-center" d="M 375,80 L 420,140 L 330,140 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 头部中心的闸门 -->
  <circle id="gate-3" cx="345" cy="120" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-3-text" x="345" y="120" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">3</text>

  <circle id="gate-60" cx="375" cy="105" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-60-text" x="375" y="105" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">60</text>

  <circle id="gate-61" cx="405" cy="120" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-61-text" x="405" y="120" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">61</text>

  <circle id="gate-64" cx="390" cy="135" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-64-text" x="390" y="135" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">64</text>

  <circle id="gate-57" cx="360" cy="135" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-57-text" x="360" y="135" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">57</text>

  <!-- 脑中心 - 菱形 -->
  <path id="ajna-center" d="M 375,180 L 410,220 L 375,260 L 340,220 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 脑中心的闸门 -->
  <circle id="gate-47" cx="345" cy="205" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-47-text" x="345" y="205" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">47</text>

  <circle id="gate-11" cx="405" cy="205" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-11-text" x="405" y="205" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">11</text>

  <circle id="gate-24" cx="345" cy="235" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-24-text" x="345" y="235" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">24</text>

  <circle id="gate-4" cx="405" cy="235" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-4-text" x="405" y="235" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">4</text>

  <circle id="gate-63" cx="360" cy="220" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-63-text" x="360" y="220" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">63</text>

  <circle id="gate-17" cx="390" cy="220" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-17-text" x="390" y="220" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">17</text>

  <circle id="gate-7" cx="375" cy="195" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-7-text" x="375" y="195" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">7</text>

  <circle id="gate-62" cx="375" cy="245" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-62-text" x="375" y="245" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">62</text>

  <!-- 喉咙中心 - 正方形 -->
  <rect id="throat-center" x="340" y="300" width="70" height="70" rx="5"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 喉咙中心的闸门 -->
  <circle id="gate-16" cx="355" cy="315" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-16-text" x="355" y="315" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">16</text>

  <circle id="gate-12" cx="395" cy="315" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-12-text" x="395" y="315" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">12</text>

  <circle id="gate-45" cx="355" cy="355" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-45-text" x="355" y="355" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">45</text>

  <circle id="gate-33" cx="395" cy="355" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-33-text" x="395" y="355" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">33</text>

  <circle id="gate-8" cx="375" cy="335" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-8-text" x="375" y="335" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">8</text>

  <circle id="gate-15" cx="340" cy="335" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-15-text" x="340" y="335" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">15</text>

  <circle id="gate-20" cx="410" cy="335" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-20-text" x="410" y="335" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">20</text>

  <circle id="gate-31" cx="375" cy="310" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-31-text" x="375" y="310" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">31</text>

  <!-- G中心 - 菱形 -->
  <path id="g-center" d="M 375,430 L 420,480 L 375,530 L 330,480 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- G中心的闸门 -->
  <circle id="gate-1" cx="340" cy="455" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-1-text" x="340" y="455" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">1</text>

  <circle id="gate-13" cx="410" cy="455" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-13-text" x="410" y="455" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">13</text>

  <circle id="gate-10" cx="360" cy="480" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-10-text" x="360" y="480" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">10</text>

  <circle id="gate-25" cx="390" cy="480" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-25-text" x="390" y="480" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">25</text>

  <!-- 心脏中心 - 三角形 -->
  <path id="ego-center" d="M 250,520 L 290,570 L 210,570 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 心脏中心的闸门 -->
  <circle id="gate-21" cx="225" cy="550" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-21-text" x="225" y="550" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">21</text>

  <circle id="gate-40" cx="250" cy="540" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-40-text" x="250" y="540" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">40</text>

  <circle id="gate-51" cx="275" cy="550" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-51-text" x="275" y="550" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">51</text>

  <circle id="gate-26" cx="235" cy="565" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-26-text" x="235" y="565" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">26</text>

  <!-- 脾中心 - 三角形 -->
  <path id="spleen-center" d="M 500,520 L 540,570 L 460,570 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 脾中心的闸门 -->
  <circle id="gate-48" cx="475" cy="550" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-48-text" x="475" y="550" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">48</text>

  <circle id="gate-57-2" cx="500" cy="540" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-57-2-text" x="500" y="540" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">57</text>

  <circle id="gate-44" cx="525" cy="550" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-44-text" x="525" y="550" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">44</text>

  <circle id="gate-18" cx="485" cy="565" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-18-text" x="485" y="565" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">18</text>

  <circle id="gate-28" cx="515" cy="565" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-28-text" x="515" y="565" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">28</text>

  <circle id="gate-32" cx="510" cy="540" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-32-text" x="510" y="540" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">32</text>

  <circle id="gate-50" cx="490" cy="540" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-50-text" x="490" y="540" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">50</text>

  <!-- 太阳神经丛中心 - 三角形 -->
  <path id="solar-plexus-center" d="M 375,620 L 440,690 L 310,690 Z"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 太阳神经丛中心的闸门 -->
  <circle id="gate-22" cx="330" cy="660" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-22-text" x="330" y="660" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">22</text>

  <circle id="gate-36" cx="365" cy="670" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-36-text" x="365" y="670" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">36</text>

  <circle id="gate-37" cx="385" cy="670" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-37-text" x="385" y="670" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">37</text>

  <circle id="gate-41" cx="420" cy="660" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-41-text" x="420" y="660" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">41</text>

  <circle id="gate-6" cx="345" cy="645" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-6-text" x="345" y="645" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">6</text>

  <circle id="gate-49" cx="405" cy="645" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-49-text" x="405" y="645" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">49</text>

  <circle id="gate-55" cx="350" cy="680" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-55-text" x="350" y="680" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">55</text>

  <circle id="gate-30" cx="400" cy="680" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-30-text" x="400" y="680" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">30</text>

  <!-- 荐骨中心 - 正方形 -->
  <rect id="sacral-center" x="300" y="760" width="150" height="100" rx="10"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 荐骨中心的闸门 -->
  <circle id="gate-3-2" cx="320" cy="780" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-3-2-text" x="320" y="780" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">3</text>

  <circle id="gate-9" cx="360" cy="770" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-9-text" x="360" y="770" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">9</text>

  <circle id="gate-5" cx="400" cy="770" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-5-text" x="400" y="770" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">5</text>

  <circle id="gate-14" cx="430" cy="780" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-14-text" x="430" y="780" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">14</text>

  <circle id="gate-42" cx="430" cy="820" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-42-text" x="430" y="820" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">42</text>

  <circle id="gate-59" cx="400" cy="830" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-59-text" x="400" y="830" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">59</text>

  <circle id="gate-27" cx="360" cy="830" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-27-text" x="360" y="830" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">27</text>

  <circle id="gate-58" cx="320" cy="820" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-58-text" x="320" y="820" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">58</text>

  <circle id="gate-6-2" cx="340" cy="770" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-6-2-text" x="340" y="770" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">6</text>

  <circle id="gate-34" cx="410" cy="770" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-34-text" x="410" y="770" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">34</text>

  <circle id="gate-29" cx="375" cy="760" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-29-text" x="375" y="760" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">29</text>

  <circle id="gate-46" cx="375" cy="840" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-46-text" x="375" y="840" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">46</text>

  <!-- 根中心 - 正方形 -->
  <rect id="root-center" x="320" y="920" width="110" height="80" rx="8"
        fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>

  <!-- 根中心的闸门 -->
  <circle id="gate-52" cx="340" cy="940" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-52-text" x="340" y="940" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">52</text>

  <circle id="gate-58-2" cx="380" cy="935" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-58-2-text" x="380" y="935" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">58</text>

  <circle id="gate-60-2" cx="340" cy="970" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-60-2-text" x="340" y="970" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">60</text>

  <circle id="gate-53" cx="380" cy="975" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-53-text" x="380" y="975" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">53</text>

  <circle id="gate-19" cx="410" cy="970" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-19-text" x="410" y="970" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">19</text>

  <circle id="gate-39" cx="360" cy="950" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-39-text" x="360" y="950" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">39</text>

  <circle id="gate-38" cx="400" cy="950" r="12" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <text id="gate-38-text" x="400" y="950" text-anchor="middle" dominant-baseline="central"
        fill="#000000" font-size="10" font-weight="bold">38</text>

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

    console.log('=== 应用嵌入式人类图逻辑 ===')
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

    console.log('=== 嵌入式人类图样式应用完成 ===')

  }, [data])

  return (
    <div className={`human-design-embedded-chart ${className}`}>
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