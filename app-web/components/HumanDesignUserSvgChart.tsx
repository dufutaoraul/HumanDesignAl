/**
 * 用户原始SVG内嵌组件 - 基于用户手动绘制的SVG
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

  // 直接使用用户的原始SVG文件内容
  const svgContent = `<svg width="750" height="1240" viewBox="0 0 750 1240" xmlns="http://www.w3.org/2000/svg">
  <!-- 定义样式 -->
  <defs>
    <style>
      .center-filled { fill: #ffffff; stroke: #ffffff; stroke-width: 2; }
      .center-empty { fill: none; stroke: #ffffff; stroke-width: 2; }
      .gate-filled { fill: #ff4444; stroke: #ffffff; stroke-width: 2; }
      .gate-empty { fill: none; stroke: #ffffff; stroke-width: 2; }
      .gate-text { fill: #000000; font-size: 12px; font-weight: bold; text-anchor: middle; dominant-baseline: central; }
      .channel-design { stroke: #ff4444; stroke-width: 4; fill: none; }
      .channel-personality { stroke: #000000; stroke-width: 4; fill: none; }
      .channel-both { stroke: url(#redBlackStripes); stroke-width: 4; fill: none; }
      .channel-inactive { stroke: #666666; stroke-width: 2; fill: none; stroke-dasharray: 2,2; }
    </style>

    <!-- 红黑相间条纹图案 -->
    <pattern id="redBlackStripes" patternUnits="userSpaceOnUse" width="8" height="2" patternTransform="rotate(45)">
      <rect width="4" height="2" fill="#ff4444"/>
      <rect x="4" width="4" height="2" fill="#000000"/>
    </pattern>
  </defs>

  <!-- 头部中心 (Head Center) - 三角形 -->
  <path id="head-center" class="center-empty" d="M 375,80 L 420,140 L 330,140 Z"/>

  <!-- 头部中心的闸门 -->
  <circle id="gate-3" class="gate-empty" cx="345" cy="120" r="12"/>
  <text id="gate-3-text" class="gate-text" x="345" y="120">3</text>

  <circle id="gate-60" class="gate-empty" cx="375" cy="105" r="12"/>
  <text id="gate-60-text" class="gate-text" x="375" y="105">60</text>

  <circle id="gate-61" class="gate-empty" cx="405" cy="120" r="12"/>
  <text id="gate-61-text" class="gate-text" x="405" y="120">61</text>

  <circle id="gate-64" class="gate-empty" cx="390" cy="135" r="12"/>
  <text id="gate-64-text" class="gate-text" x="390" y="135">64</text>

  <circle id="gate-57" class="gate-empty" cx="360" cy="135" r="12"/>
  <text id="gate-57-text" class="gate-text" x="360" y="135">57</text>

  <!-- 脑中心 (Ajna Center) - 菱形 -->
  <path id="ajna-center" class="center-empty" d="M 375,180 L 410,220 L 375,260 L 340,220 Z"/>

  <!-- 脑中心的闸门 -->
  <circle id="gate-47" class="gate-empty" cx="345" cy="205" r="12"/>
  <text id="gate-47-text" class="gate-text" x="345" y="205">47</text>

  <circle id="gate-11" class="gate-empty" cx="405" cy="205" r="12"/>
  <text id="gate-11-text" class="gate-text" x="405" y="205">11</text>

  <circle id="gate-24" class="gate-empty" cx="345" cy="235" r="12"/>
  <text id="gate-24-text" class="gate-text" x="345" y="235">24</text>

  <circle id="gate-4" class="gate-empty" cx="405" cy="235" r="12"/>
  <text id="gate-4-text" class="gate-text" x="405" y="235">4</text>

  <circle id="gate-63" class="gate-empty" cx="360" cy="220" r="12"/>
  <text id="gate-63-text" class="gate-text" x="360" y="220">63</text>

  <circle id="gate-17" class="gate-empty" cx="390" cy="220" r="12"/>
  <text id="gate-17-text" class="gate-text" x="390" y="220">17</text>

  <circle id="gate-7" class="gate-empty" cx="375" cy="195" r="12"/>
  <text id="gate-7-text" class="gate-text" x="375" y="195">7</text>

  <circle id="gate-62" class="gate-empty" cx="375" cy="245" r="12"/>
  <text id="gate-62-text" class="gate-text" x="375" y="245">62</text>

  <!-- 喉咙中心 (Throat Center) - 正方形 -->
  <rect id="throat-center" class="center-empty" x="340" y="300" width="70" height="70" rx="5"/>

  <!-- 喉咙中心的闸门 -->
  <circle id="gate-16" class="gate-empty" cx="355" cy="315" r="12"/>
  <text id="gate-16-text" class="gate-text" x="355" y="315">16</text>

  <circle id="gate-12" class="gate-empty" cx="395" cy="315" r="12"/>
  <text id="gate-12-text" class="gate-text" x="395" y="315">12</text>

  <circle id="gate-45" class="gate-empty" cx="355" cy="355" r="12"/>
  <text id="gate-45-text" class="gate-text" x="355" y="355">45</text>

  <circle id="gate-33" class="gate-empty" cx="395" cy="355" r="12"/>
  <text id="gate-33-text" class="gate-text" x="395" y="355">33</text>

  <circle id="gate-8" class="gate-empty" cx="375" cy="335" r="12"/>
  <text id="gate-8-text" class="gate-text" x="375" y="335">8</text>

  <circle id="gate-15" class="gate-empty" cx="340" cy="335" r="12"/>
  <text id="gate-15-text" class="gate-text" x="340" y="335">15</text>

  <circle id="gate-20" class="gate-empty" cx="410" cy="335" r="12"/>
  <text id="gate-20-text" class="gate-text" x="410" y="335">20</text>

  <circle id="gate-31" class="gate-empty" cx="375" cy="310" r="12"/>
  <text id="gate-31-text" class="gate-text" x="375" y="310">31</text>

  <circle id="gate-62" class="gate-empty" cx="375" cy="360" r="12"/>
  <text id="gate-62-text" class="gate-text" x="375" y="360">62</text>

  <!-- G中心 (G Center) - 菱形 -->
  <path id="g-center" class="center-empty" d="M 375,430 L 420,480 L 375,530 L 330,480 Z"/>

  <!-- G中心的闸门 -->
  <circle id="gate-1" class="gate-empty" cx="340" cy="455" r="12"/>
  <text id="gate-1-text" class="gate-text" x="340" y="455">1</text>

  <circle id="gate-13" class="gate-empty" cx="410" cy="455" r="12"/>
  <text id="gate-13-text" class="gate-text" x="410" y="455">13</text>

  <circle id="gate-7" class="gate-empty" cx="345" cy="505" r="12"/>
  <text id="gate-7-text" class="gate-text" x="345" y="505">7</text>

  <circle id="gate-44" class="gate-empty" cx="405" cy="505" r="12"/>
  <text id="gate-44-text" class="gate-text" x="405" y="505">44</text>

  <circle id="gate-10" class="gate-empty" cx="360" cy="480" r="12"/>
  <text id="gate-10-text" class="gate-text" x="360" y="480">10</text>

  <circle id="gate-25" class="gate-empty" cx="390" cy="480" r="12"/>
  <text id="gate-25-text" class="gate-text" x="390" y="480">25</text>

  <!-- 心脏中心 (Heart Center) - 三角形 -->
  <path id="heart-center" class="center-empty" d="M 250,520 L 290,570 L 210,570 Z"/>

  <!-- 心脏中心的闸门 -->
  <circle id="gate-21" class="gate-empty" cx="225" cy="550" r="12"/>
  <text id="gate-21-text" class="gate-text" x="225" y="550">21</text>

  <circle id="gate-40" class="gate-empty" cx="250" cy="540" r="12"/>
  <text id="gate-40-text" class="gate-text" x="250" y="540">40</text>

  <circle id="gate-51" class="gate-empty" cx="275" cy="550" r="12"/>
  <text id="gate-51-text" class="gate-text" x="275" y="550">51</text>

  <circle id="gate-26" class="gate-empty" cx="235" cy="565" r="12"/>
  <text id="gate-26-text" class="gate-text" x="235" y="565">26</text>

  <!-- 脾中心 (Spleen Center) - 三角形 -->
  <path id="spleen-center" class="center-empty" d="M 500,520 L 540,570 L 460,570 Z"/>

  <!-- 脾中心的闸门 -->
  <circle id="gate-48" class="gate-empty" cx="475" cy="550" r="12"/>
  <text id="gate-48-text" class="gate-text" x="475" y="550">48</text>

  <circle id="gate-57" class="gate-empty" cx="500" cy="540" r="12"/>
  <text id="gate-57-text" class="gate-text" x="500" y="540">57</text>

  <circle id="gate-44" class="gate-empty" cx="525" cy="550" r="12"/>
  <text id="gate-44-text" class="gate-text" x="525" y="550">44</text>

  <circle id="gate-18" class="gate-empty" cx="485" cy="565" r="12"/>
  <text id="gate-18-text" class="gate-text" x="485" y="565">18</text>

  <circle id="gate-28" class="gate-empty" cx="515" cy="565" r="12"/>
  <text id="gate-28-text" class="gate-text" x="515" y="565">28</text>

  <circle id="gate-32" class="gate-empty" cx="510" cy="540" r="12"/>
  <text id="gate-32-text" class="gate-text" x="510" y="540">32</text>

  <circle id="gate-50" class="gate-empty" cx="490" cy="540" r="12"/>
  <text id="gate-50-text" class="gate-text" x="490" y="540">50</text>

  <!-- 太阳神经丛中心 (Solar Plexus Center) - 三角形 -->
  <path id="solar-plexus-center" class="center-empty" d="M 375,620 L 440,690 L 310,690 Z"/>

  <!-- 太阳神经丛中心的闸门 -->
  <circle id="gate-22" class="gate-empty" cx="330" cy="660" r="12"/>
  <text id="gate-22-text" class="gate-text" x="330" y="660">22</text>

  <circle id="gate-36" class="gate-empty" cx="365" cy="670" r="12"/>
  <text id="gate-36-text" class="gate-text" x="365" y="670">36</text>

  <circle id="gate-37" class="gate-empty" cx="385" cy="670" r="12"/>
  <text id="gate-37-text" class="gate-text" x="385" y="670">37</text>

  <circle id="gate-41" class="gate-empty" cx="420" cy="660" r="12"/>
  <text id="gate-41-text" class="gate-text" x="420" y="660">41</text>

  <circle id="gate-6" class="gate-empty" cx="345" cy="645" r="12"/>
  <text id="gate-6-text" class="gate-text" x="345" y="645">6</text>

  <circle id="gate-49" class="gate-empty" cx="405" cy="645" r="12"/>
  <text id="gate-49-text" class="gate-text" x="405" y="645">49</text>

  <circle id="gate-55" class="gate-empty" cx="350" cy="680" r="12"/>
  <text id="gate-55-text" class="gate-text" x="350" y="680">55</text>

  <circle id="gate-30" class="gate-empty" cx="400" cy="680" r="12"/>
  <text id="gate-30-text" class="gate-text" x="400" y="680">30</text>

  <!-- 荐骨中心 (Sacral Center) - 正方形 -->
  <rect id="sacral-center" class="center-empty" x="300" y="760" width="150" height="100" rx="10"/>

  <!-- 荐骨中心的闸门 -->
  <circle id="gate-3" class="gate-empty" cx="320" cy="780" r="12"/>
  <text id="gate-3-text" class="gate-text" x="320" y="780">3</text>

  <circle id="gate-9" class="gate-empty" cx="360" cy="770" r="12"/>
  <text id="gate-9-text" class="gate-text" x="360" y="770">9</text>

  <circle id="gate-5" class="gate-empty" cx="400" cy="770" r="12"/>
  <text id="gate-5-text" class="gate-text" x="400" y="770">5</text>

  <circle id="gate-14" class="gate-empty" cx="430" cy="780" r="12"/>
  <text id="gate-14-text" class="gate-text" x="430" y="780">14</text>

  <circle id="gate-42" class="gate-empty" cx="430" cy="820" r="12"/>
  <text id="gate-42-text" class="gate-text" x="430" y="820">42</text>

  <circle id="gate-59" class="gate-empty" cx="400" cy="830" r="12"/>
  <text id="gate-59-text" class="gate-text" x="400" y="830">59</text>

  <circle id="gate-27" class="gate-empty" cx="360" cy="830" r="12"/>
  <text id="gate-27-text" class="gate-text" x="360" y="830">27</text>

  <circle id="gate-58" class="gate-empty" cx="320" cy="820" r="12"/>
  <text id="gate-58-text" class="gate-text" x="320" y="820">58</text>

  <circle id="gate-6" class="gate-empty" cx="340" cy="770" r="12"/>
  <text id="gate-6-text" class="gate-text" x="340" y="770">6</text>

  <circle id="gate-34" class="gate-empty" cx="410" cy="770" r="12"/>
  <text id="gate-34-text" class="gate-text" x="410" y="770">34</text>

  <circle id="gate-29" class="gate-empty" cx="375" cy="760" r="12"/>
  <text id="gate-29-text" class="gate-text" x="375" y="760">29</text>

  <circle id="gate-46" class="gate-empty" cx="375" cy="840" r="12"/>
  <text id="gate-46-text" class="gate-text" x="375" y="840">46</text>

  <!-- 根中心 (Root Center) - 正方形 -->
  <rect id="root-center" class="center-empty" x="320" y="920" width="110" height="80" rx="8"/>

  <!-- 根中心的闸门 -->
  <circle id="gate-52" class="gate-empty" cx="340" cy="940" r="12"/>
  <text id="gate-52-text" class="gate-text" x="340" y="940">52</text>

  <circle id="gate-58" class="gate-empty" cx="380" cy="935" r="12"/>
  <text id="gate-58-text" class="gate-text" x="380" y="935">58</text>

  <circle id="gate-3" class="gate-empty" cx="410" cy="940" r="12"/>
  <text id="gate-3-text" class="gate-text" x="410" y="940">3</text>

  <circle id="gate-60" class="gate-empty" cx="340" cy="970" r="12"/>
  <text id="gate-60-text" class="gate-text" x="340" y="970">60</text>

  <circle id="gate-53" class="gate-empty" cx="380" cy="975" r="12"/>
  <text id="gate-53-text" class="gate-text" x="380" y="975">53</text>

  <circle id="gate-19" class="gate-empty" cx="410" cy="970" r="12"/>
  <text id="gate-19-text" class="gate-text" x="410" y="970">19</text>

  <circle id="gate-39" class="gate-empty" cx="360" cy="950" r="12"/>
  <text id="gate-39-text" class="gate-text" x="360" y="950">39</text>

  <circle id="gate-38" class="gate-empty" cx="400" cy="950" r="12"/>
  <text id="gate-38-text" class="gate-text" x="400" y="950">38</text>

  <!-- 通道定义 (36根通道) -->
  <!-- 头部到脑中心 -->
  <line id="channel-3-60" class="channel-inactive" x1="345" y1="120" x2="375" y2="195"/>
  <line id="channel-61-24" class="channel-inactive" x1="405" y1="120" x2="345" y2="235"/>
  <line id="channel-64-47" class="channel-inactive" x1="390" y1="135" x2="345" y2="205"/>
  <line id="channel-57-11" class="channel-inactive" x1="360" y1="135" x2="405" y2="205"/>
  <line id="channel-63-4" class="channel-inactive" x1="360" y1="220" x2="405" y2="235"/>
  <line id="channel-17-62" class="channel-inactive" x1="390" y1="220" x2="375" y2="245"/>

  <!-- 脑中心到喉咙中心 -->
  <line id="channel-11-56" class="channel-inactive" x1="405" y1="205" x2="355" y2="315"/>
  <line id="channel-4-63" class="channel-inactive" x1="405" y1="235" x2="395" y2="315"/>
  <line id="channel-7-31" class="channel-inactive" x1="375" y1="195" x2="375" y2="310"/>
  <line id="channel-24-61" class="channel-inactive" x1="345" y1="235" x2="355" y2="315"/>
  <line id="channel-47-64" class="channel-inactive" x1="345" y1="205" x2="355" y2="315"/>
  <line id="channel-62-17" class="channel-inactive" x1="375" y1="245" x2="395" y2="315"/>

  <!-- 喉咙中心到G中心 -->
  <line id="channel-16-48" class="channel-inactive" x1="355" y1="335" x2="475" y2="550"/>
  <line id="channel-12-22" class="channel-inactive" x1="395" y1="335" x2="330" y2="660"/>
  <line id="channel-45-21" class="channel-inactive" x1="355" y1="355" x2="225" y2="550"/>
  <line id="channel-33-13" class="channel-inactive" x1="395" y1="355" x2="410" y2="455"/>
  <line id="channel-8-1" class="channel-inactive" x1="375" y1="335" x2="340" y2="455"/>
  <line id="channel-15-5" class="channel-inactive" x1="340" y1="335" x2="430" y2="780"/>
  <line id="channel-20-34" class="channel-inactive" x1="410" y1="335" x2="410" y2="770"/>
  <line id="channel-31-7" class="channel-inactive" x1="375" y1="310" x2="345" y2="505"/>

  <!-- G中心到心脏中心 -->
  <line id="channel-1-44" class="channel-inactive" x1="340" y1="455" x2="525" y2="550"/>
  <line id="channel-13-30" class="channel-inactive" x1="410" y1="455" x2="400" y2="680"/>
  <line id="channel-7-31" class="channel-inactive" x1="345" y1="505" x2="375" y2="310"/>
  <line id="channel-44-26" class="channel-inactive" x1="405" y1="505" x2="235" y2="565"/>

  <!-- G中心到脾中心 -->
  <line id="channel-10-57" class="channel-inactive" x1="360" y1="480" x2="500" y2="540"/>
  <line id="channel-25-51" class="channel-inactive" x1="390" y1="480" x2="275" y2="550"/>

  <!-- 心脏中心到脾中心 -->
  <line id="channel-21-45" class="channel-inactive" x1="225" y1="550" x2="355" y2="355"/>
  <line id="channel-40-37" class="channel-inactive" x1="250" y1="540" x2="385" y2="670"/>
  <line id="channel-51-25" class="channel-inactive" x1="275" y1="550" x2="390" y2="480"/>
  <line id="channel-26-44" class="channel-inactive" x1="235" y1="565" x2="405" y2="505"/>

  <!-- 脾中心到太阳神经丛 -->
  <line id="channel-48-16" class="channel-inactive" x1="475" y1="550" x2="355" y2="315"/>
  <line id="channel-57-20" class="channel-inactive" x1="500" y1="540" x2="410" y2="335"/>
  <line id="channel-44-26" class="channel-inactive" x1="525" y1="550" x2="235" y2="565"/>
  <line id="channel-18-58" class="channel-inactive" x1="485" y1="565" x2="320" y2="820"/>
  <line id="channel-28-38" class="channel-inactive" x1="515" y1="565" x2="400" y2="950"/>
  <line id="channel-32-54" class="channel-inactive" x1="510" y1="540" x2="380" y2="975"/>
  <line id="channel-50-27" class="channel-inactive" x1="490" y1="540" x2="360" y2="830"/>

  <!-- 太阳神经丛到荐骨中心 -->
  <line id="channel-22-12" class="channel-inactive" x1="330" y1="660" x2="395" y2="335"/>
  <line id="channel-36-35" class="channel-inactive" x1="365" y1="670" x2="360" y2="770"/>
  <line id="channel-37-40" class="channel-inactive" x1="385" y1="670" x2="250" y2="540"/>
  <line id="channel-41-35" class="channel-inactive" x1="420" y1="660" x2="360" y2="770"/>
  <line id="channel-6-59" class="channel-inactive" x1="345" y1="645" x2="400" y2="830"/>
  <line id="channel-49-19" class="channel-inactive" x1="405" y1="645" x2="410" y2="970"/>
  <line id="channel-55-39" class="channel-inactive" x1="350" y1="680" x2="360" y2="950"/>
  <line id="channel-30-41" class="channel-inactive" x1="400" y1="680" x2="420" y2="660"/>

  <!-- 荐骨中心到根中心 -->
  <line id="channel-3-60" class="channel-inactive" x1="320" y1="780" x2="340" y2="970"/>
  <line id="channel-9-52" class="channel-inactive" x1="360" y1="770" x2="340" y2="940"/>
  <line id="channel-5-15" class="channel-inactive" x1="400" y1="770" x2="340" y2="335"/>
  <line id="channel-14-2" class="channel-inactive" x1="430" y1="780" x2="380" y2="935"/>
  <line id="channel-42-53" class="channel-inactive" x1="430" y1="820" x2="380" y2="975"/>
  <line id="channel-59-6" class="channel-inactive" x1="400" y1="830" x2="345" y2="645"/>
  <line id="channel-27-50" class="channel-inactive" x1="360" y1="830" x2="490" y2="540"/>
  <line id="channel-58-18" class="channel-inactive" x1="320" y1="820" x2="485" y2="565"/>
  <line id="channel-6-46" class="channel-inactive" x1="340" y1="770" x2="375" y2="840"/>
  <line id="channel-34-10" class="channel-inactive" x1="410" y1="770" x2="360" y2="480"/>
  <line id="channel-29-46" class="channel-inactive" x1="375" y1="760" x2="375" y2="840"/>

  <!-- 根中心内部通道 -->
  <line id="channel-52-58" class="channel-inactive" x1="340" y1="940" x2="380" y2="935"/>
  <line id="channel-58-3" class="channel-inactive" x1="380" y1="935" x2="410" y2="940"/>
  <line id="channel-60-3" class="channel-inactive" x1="340" y1="970" x2="410" y2="940"/>
  <line id="channel-53-19" class="channel-inactive" x1="380" y1="975" x2="410" y2="970"/>
  <line id="channel-39-38" class="channel-inactive" x1="360" y1="950" x2="400" y2="950"/>

</svg>`

  useEffect(() => {
    console.log('🔍 HumanDesignUserSvgChart useEffect 开始')
    console.log('📊 数据:', data ? '存在' : '不存在')

    if (!containerRef.current) {
      console.log('❌ containerRef.current 不存在')
      return
    }

    if (!data) {
      console.log('⚠️ 人类图数据为空，显示默认图表')
      return
    }

    const container = containerRef.current
    console.log('📦 容器:', container)

    const svg = container.querySelector('svg') as SVGSVGElement
    console.log('🎨 SVG元素:', svg)

    if (!svg) {
      console.error('❌ SVG element not found - 这是问题所在！')
      console.log('📋 容器内容:', container.innerHTML)
      return
    }

    console.log('✅ 找到SVG元素，开始应用人类图逻辑 ===')

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
      'heart-center': '#FFE4E1',     // 淡粉色 - 心脏中心
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
      // 注意：由于SVG中有重复ID，我们需要查找所有匹配的闸门
      const possibleGateElements = svg.querySelectorAll(`[id*="gate-${gateNum}"]`)
      console.log(`🔍 查找闸门 ${gateNum}, 找到 ${possibleGateElements.length} 个元素`)

      possibleGateElements.forEach(element => {
        const id = element.getAttribute('id')
        console.log(`✓ 激活闸门: ${gateNum} (ID: ${id})`)
        ;(element as SVGElement).style.fill = '#FF4444'
        ;(element as SVGElement).style.stroke = '#ffffff'
        ;(element as SVGElement).style.strokeWidth = '2'
        ;(element as SVGElement).style.opacity = '1'
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