/**
 * 真正的人类图SVG组件 - 基于用户示范图重新创建
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
  height = 1000,
  className = ""
}: HumanDesignUserSvgChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 重新创建真正的人类图SVG - 基于用户示范图
  const svgContent = `<svg width="750" height="1000" viewBox="0 0 750 1000" xmlns="http://www.w3.org/2000/svg">
  <!-- 定义样式 -->
  <defs>
    <style>
      .center-filled { fill: #ffffff; stroke: #333333; stroke-width: 2; }
      .center-empty { fill: none; stroke: #333333; stroke-width: 2; }
      .gate-filled { fill: #ff4444; stroke: #333333; stroke-width: 2; }
      .gate-empty { fill: none; stroke: #333333; stroke-width: 2; }
      .gate-text { fill: #333333; font-size: 10px; font-weight: bold; text-anchor: middle; dominant-baseline: central; }
      .channel-active { stroke: #ff4444; stroke-width: 3; fill: none; }
      .channel-inactive { stroke: #cccccc; stroke-width: 1; fill: none; stroke-dasharray: 3,3; }
      .center-text { fill: #333333; font-size: 12px; font-weight: bold; text-anchor: middle; }
    </style>
  </defs>

  <!-- 背景 -->
  <rect width="750" height="1000" fill="#fafafa"/>

  <!-- 头部中心 (Head Center) - 三角形 -->
  <path id="head-center" class="center-empty" d="M 375,50 L 410,110 L 340,110 Z"/>
  <text x="375" y="85" class="center-text">Head</text>

  <!-- 头部中心闸门 -->
  <circle id="gate-3" class="gate-empty" cx="345" cy="90" r="8"/>
  <text id="gate-3-text" class="gate-text" x="345" y="90">3</text>
  <circle id="gate-60" class="gate-empty" cx="375" cy="75" r="8"/>
  <text id="gate-60-text" class="gate-text" x="375" y="75">60</text>
  <circle id="gate-61" class="gate-empty" cx="405" cy="90" r="8"/>
  <text id="gate-61-text" class="gate-text" x="405" y="90">61</text>
  <circle id="gate-64" class="gate-empty" cx="390" cy="105" r="8"/>
  <text id="gate-64-text" class="gate-text" x="390" y="105">64</text>
  <circle id="gate-57" class="gate-empty" cx="360" cy="105" r="8"/>
  <text id="gate-57-text" class="gate-text" x="360" y="105">57</text>

  <!-- 脑中心 (Ajna Center) - 菱形 -->
  <path id="ajna-center" class="center-empty" d="M 375,150 L 410,190 L 375,230 L 340,190 Z"/>
  <text x="375" y="190" class="center-text">Ajna</text>

  <!-- 脑中心闸门 -->
  <circle id="gate-47" class="gate-empty" cx="345" cy="175" r="8"/>
  <text id="gate-47-text" class="gate-text" x="345" y="175">47</text>
  <circle id="gate-11" class="gate-empty" cx="405" cy="175" r="8"/>
  <text id="gate-11-text" class="gate-text" x="405" y="175">11</text>
  <circle id="gate-24" class="gate-empty" cx="345" cy="205" r="8"/>
  <text id="gate-24-text" class="gate-text" x="345" y="205">24</text>
  <circle id="gate-4" class="gate-empty" cx="405" cy="205" r="8"/>
  <text id="gate-4-text" class="gate-text" x="405" y="205">4</text>
  <circle id="gate-63" class="gate-empty" cx="360" cy="190" r="8"/>
  <text id="gate-63-text" class="gate-text" x="360" y="190">63</text>
  <circle id="gate-17" class="gate-empty" cx="390" cy="190" r="8"/>
  <text id="gate-17-text" class="gate-text" x="390" y="190">17</text>
  <circle id="gate-7" class="gate-empty" cx="375" cy="165" r="8"/>
  <text id="gate-7-text" class="gate-text" x="375" y="165">7</text>
  <circle id="gate-62" class="gate-empty" cx="375" cy="215" r="8"/>
  <text id="gate-62-text" class="gate-text" x="375" y="215">62</text>

  <!-- 喉咙中心 (Throat Center) - 正方形 -->
  <rect id="throat-center" class="center-empty" x="345" y="270" width="60" height="60" rx="5"/>
  <text x="375" y="305" class="center-text">Throat</text>

  <!-- 喉咙中心闸门 -->
  <circle id="gate-16" class="gate-empty" cx="355" cy="285" r="8"/>
  <text id="gate-16-text" class="gate-text" x="355" y="285">16</text>
  <circle id="gate-12" class="gate-empty" cx="395" cy="285" r="8"/>
  <text id="gate-12-text" class="gate-text" x="395" y="285">12</text>
  <circle id="gate-45" class="gate-empty" cx="355" cy="315" r="8"/>
  <text id="gate-45-text" class="gate-text" x="355" y="315">45</text>
  <circle id="gate-33" class="gate-empty" cx="395" cy="315" r="8"/>
  <text id="gate-33-text" class="gate-text" x="395" y="315">33</text>
  <circle id="gate-8" class="gate-empty" cx="375" cy="295" r="8"/>
  <text id="gate-8-text" class="gate-text" x="375" y="295">8</text>
  <circle id="gate-15" class="gate-empty" cx="340" cy="295" r="8"/>
  <text id="gate-15-text" class="gate-text" x="340" y="295">15</text>
  <circle id="gate-20" class="gate-empty" cx="410" cy="295" r="8"/>
  <text id="gate-20-text" class="gate-text" x="410" y="295">20</text>
  <circle id="gate-31" class="gate-empty" cx="375" cy="270" r="8"/>
  <text id="gate-31-text" class="gate-text" x="375" y="270">31</text>
  <circle id="gate-62-throat" class="gate-empty" cx="375" cy="330" r="8"/>
  <text id="gate-62-throat-text" class="gate-text" x="375" y="330">62</text>

  <!-- G中心 (G Center) - 菱形 -->
  <path id="g-center" class="center-empty" d="M 375,390 L 420,440 L 375,490 L 330,440 Z"/>
  <text x="375" y="440" class="center-text">G</text>

  <!-- G中心闸门 -->
  <circle id="gate-1" class="gate-empty" cx="340" cy="415" r="8"/>
  <text id="gate-1-text" class="gate-text" x="340" y="415">1</text>
  <circle id="gate-13" class="gate-empty" cx="410" cy="415" r="8"/>
  <text id="gate-13-text" class="gate-text" x="410" y="415">13</text>
  <circle id="gate-7-g" class="gate-empty" cx="345" cy="465" r="8"/>
  <text id="gate-7-g-text" class="gate-text" x="345" y="465">7</text>
  <circle id="gate-44-g" class="gate-empty" cx="405" cy="465" r="8"/>
  <text id="gate-44-g-text" class="gate-text" x="405" y="465">44</text>
  <circle id="gate-10" class="gate-empty" cx="360" cy="440" r="8"/>
  <text id="gate-10-text" class="gate-text" x="360" y="440">10</text>
  <circle id="gate-25" class="gate-empty" cx="390" cy="440" r="8"/>
  <text id="gate-25-text" class="gate-text" x="390" y="440">25</text>

  <!-- 心脏中心 (Heart Center) - 三角形 -->
  <path id="heart-center" class="center-empty" d="M 250,480 L 290,530 L 210,530 Z"/>
  <text x="250" y="510" class="center-text">Heart</text>

  <!-- 心脏中心闸门 -->
  <circle id="gate-21" class="gate-empty" cx="225" cy="510" r="8"/>
  <text id="gate-21-text" class="gate-text" x="225" y="510">21</text>
  <circle id="gate-40" class="gate-empty" cx="250" cy="500" r="8"/>
  <text id="gate-40-text" class="gate-text" x="250" y="500">40</text>
  <circle id="gate-51" class="gate-empty" cx="275" cy="510" r="8"/>
  <text id="gate-51-text" class="gate-text" x="275" y="510">51</text>
  <circle id="gate-26" class="gate-empty" cx="235" cy="525" r="8"/>
  <text id="gate-26-text" class="gate-text" x="235" y="525">26</text>

  <!-- 脾中心 (Spleen Center) - 三角形 -->
  <path id="spleen-center" class="center-empty" d="M 500,480 L 540,530 L 460,530 Z"/>
  <text x="500" y="510" class="center-text">Spleen</text>

  <!-- 脾中心闸门 -->
  <circle id="gate-48" class="gate-empty" cx="475" cy="510" r="8"/>
  <text id="gate-48-text" class="gate-text" x="475" y="510">48</text>
  <circle id="gate-57-spleen" class="gate-empty" cx="500" cy="500" r="8"/>
  <text id="gate-57-spleen-text" class="gate-text" x="500" y="500">57</text>
  <circle id="gate-44-spleen" class="gate-empty" cx="525" cy="510" r="8"/>
  <text id="gate-44-spleen-text" class="gate-text" x="525" y="510">44</text>
  <circle id="gate-18" class="gate-empty" cx="485" cy="525" r="8"/>
  <text id="gate-18-text" class="gate-text" x="485" y="525">18</text>
  <circle id="gate-28" class="gate-empty" cx="515" cy="525" r="8"/>
  <text id="gate-28-text" class="gate-text" x="515" y="525">28</text>
  <circle id="gate-32" class="gate-empty" cx="510" cy="500" r="8"/>
  <text id="gate-32-text" class="gate-text" x="510" y="500">32</text>
  <circle id="gate-50" class="gate-empty" cx="490" cy="500" r="8"/>
  <text id="gate-50-text" class="gate-text" x="490" y="500">50</text>

  <!-- 太阳神经丛中心 (Solar Plexus Center) - 三角形 -->
  <path id="solar-plexus-center" class="center-empty" d="M 375,580 L 440,650 L 310,650 Z"/>
  <text x="375" y="620" class="center-text">Solar</text>

  <!-- 太阳神经丛中心闸门 -->
  <circle id="gate-22" class="gate-empty" cx="330" cy="620" r="8"/>
  <text id="gate-22-text" class="gate-text" x="330" y="620">22</text>
  <circle id="gate-36" class="gate-empty" cx="365" cy="630" r="8"/>
  <text id="gate-36-text" class="gate-text" x="365" y="630">36</text>
  <circle id="gate-37" class="gate-empty" cx="385" cy="630" r="8"/>
  <text id="gate-37-text" class="gate-text" x="385" y="630">37</text>
  <circle id="gate-41" class="gate-empty" cx="420" cy="620" r="8"/>
  <text id="gate-41-text" class="gate-text" x="420" y="620">41</text>
  <circle id="gate-6" class="gate-empty" cx="345" cy="605" r="8"/>
  <text id="gate-6-text" class="gate-text" x="345" y="605">6</text>
  <circle id="gate-49" class="gate-empty" cx="405" cy="605" r="8"/>
  <text id="gate-49-text" class="gate-text" x="405" y="605">49</text>
  <circle id="gate-55" class="gate-empty" cx="350" cy="640" r="8"/>
  <text id="gate-55-text" class="gate-text" x="350" y="640">55</text>
  <circle id="gate-30" class="gate-empty" cx="400" cy="640" r="8"/>
  <text id="gate-30-text" class="gate-text" x="400" y="640">30</text>

  <!-- 荐骨中心 (Sacral Center) - 正方形 -->
  <rect id="sacral-center" class="center-empty" x="300" y="720" width="150" height="80" rx="8"/>
  <text x="375" y="765" class="center-text">Sacral</text>

  <!-- 荐骨中心闸门 -->
  <circle id="gate-3-sacral" class="gate-empty" cx="320" cy="735" r="8"/>
  <text id="gate-3-sacral-text" class="gate-text" x="320" y="735">3</text>
  <circle id="gate-9" class="gate-empty" cx="360" cy="725" r="8"/>
  <text id="gate-9-text" class="gate-text" x="360" y="725">9</text>
  <circle id="gate-5" class="gate-empty" cx="400" cy="725" r="8"/>
  <text id="gate-5-text" class="gate-text" x="400" y="725">5</text>
  <circle id="gate-14" class="gate-empty" cx="430" cy="735" r="8"/>
  <text id="gate-14-text" class="gate-text" x="430" y="735">14</text>
  <circle id="gate-42" class="gate-empty" cx="430" cy="785" r="8"/>
  <text id="gate-42-text" class="gate-text" x="430" y="785">42</text>
  <circle id="gate-59" class="gate-empty" cx="400" cy="795" r="8"/>
  <text id="gate-59-text" class="gate-text" x="400" y="795">59</text>
  <circle id="gate-27" class="gate-empty" cx="360" cy="795" r="8"/>
  <text id="gate-27-text" class="gate-text" x="360" y="795">27</text>
  <circle id="gate-58-sacral" class="gate-empty" cx="320" cy="785" r="8"/>
  <text id="gate-58-sacral-text" class="gate-text" x="320" y="785">58</text>
  <circle id="gate-6-sacral" class="gate-empty" cx="340" cy="725" r="8"/>
  <text id="gate-6-sacral-text" class="gate-text" x="340" y="725">6</text>
  <circle id="gate-34" class="gate-empty" cx="410" cy="725" r="8"/>
  <text id="gate-34-text" class="gate-text" x="410" y="725">34</text>
  <circle id="gate-29" class="gate-empty" cx="375" cy="715" r="8"/>
  <text id="gate-29-text" class="gate-text" x="375" y="715">29</text>
  <circle id="gate-46" class="gate-empty" cx="375" cy="785" r="8"/>
  <text id="gate-46-text" class="gate-text" x="375" y="785">46</text>

  <!-- 根中心 (Root Center) - 正方形 -->
  <rect id="root-center" class="center-empty" x="325" y="860" width="100" height="60" rx="6"/>
  <text x="375" y="895" class="center-text">Root</text>

  <!-- 根中心闸门 -->
  <circle id="gate-52" class="gate-empty" cx="340" cy="875" r="8"/>
  <text id="gate-52-text" class="gate-text" x="340" y="875">52</text>
  <circle id="gate-58-root" class="gate-empty" cx="380" cy="870" r="8"/>
  <text id="gate-58-root-text" class="gate-text" x="380" y="870">58</text>
  <circle id="gate-3-root" class="gate-empty" cx="410" cy="875" r="8"/>
  <text id="gate-3-root-text" class="gate-text" x="410" y="875">3</text>
  <circle id="gate-60-root" class="gate-empty" cx="340" cy="905" r="8"/>
  <text id="gate-60-root-text" class="gate-text" x="340" y="905">60</text>
  <circle id="gate-53" class="gate-empty" cx="380" cy="910" r="8"/>
  <text id="gate-53-text" class="gate-text" x="380" y="910">53</text>
  <circle id="gate-19" class="gate-empty" cx="410" cy="905" r="8"/>
  <text id="gate-19-text" class="gate-text" x="410" y="905">19</text>
  <circle id="gate-39" class="gate-empty" cx="360" cy="885" r="8"/>
  <text id="gate-39-text" class="gate-text" x="360" y="885">39</text>
  <circle id="gate-38" class="gate-empty" cx="390" cy="885" r="8"/>
  <text id="gate-38-text" class="gate-text" x="390" y="885">38</text>

  <!-- 通道定义 (36根通道) - 主要通道 -->
  <!-- 头部到脑中心通道 -->
  <line id="channel-3-60" class="channel-inactive" x1="345" y1="90" x2="375" y2="165"/>
  <line id="channel-61-24" class="channel-inactive" x1="405" y1="90" x2="345" y2="205"/>
  <line id="channel-64-47" class="channel-inactive" x1="390" y1="105" x2="345" y2="175"/>
  <line id="channel-57-11" class="channel-inactive" x1="360" y1="105" x2="405" y2="175"/>
  <line id="channel-63-4" class="channel-inactive" x1="360" y1="190" x2="405" y2="205"/>
  <line id="channel-17-62" class="channel-inactive" x1="390" y1="190" x2="375" y2="215"/>

  <!-- 脑中心到喉咙中心通道 -->
  <line id="channel-7-31" class="channel-inactive" x1="375" y1="165" x2="375" y2="270"/>
  <line id="channel-62-17" class="channel-inactive" x1="375" y1="215" x2="395" y2="315"/>
  <line id="channel-24-61" class="channel-inactive" x1="345" y1="205" x2="355" y2="285"/>
  <line id="channel-47-64" class="channel-inactive" x1="345" y1="175" x2="395" y2="315"/>
  <line id="channel-4-63" class="channel-inactive" x1="405" y1="205" x2="360" y2="190"/>
  <line id="channel-11-56" class="channel-inactive" x1="405" y1="175" x2="355" y2="315"/>

  <!-- 喉咙中心到G中心通道 -->
  <line id="channel-8-1" class="channel-inactive" x1="375" y1="295" x2="340" y2="415"/>
  <line id="channel-31-7" class="channel-inactive" x1="375" y1="270" x2="345" y2="465"/>
  <line id="channel-33-13" class="channel-inactive" x1="395" y1="315" x2="410" y2="415"/>
  <line id="channel-12-22" class="channel-inactive" x1="395" y1="285" x2="330" y2="620"/>
  <line id="channel-15-5" class="channel-inactive" x1="340" y1="295" x2="430" y2="735"/>
  <line id="channel-16-48" class="channel-inactive" x1="355" y1="285" x2="475" y2="510"/>
  <line id="channel-20-34" class="channel-inactive" x1="410" y1="295" x2="410" y2="725"/>
  <line id="channel-45-21" class="channel-inactive" x1="355" y1="315" x2="225" y2="510"/>

  <!-- G中心到心脏/脾中心通道 -->
  <line id="channel-1-44" class="channel-inactive" x1="340" y1="415" x2="525" y2="510"/>
  <line id="channel-13-30" class="channel-inactive" x1="410" y1="415" x2="400" y2="640"/>
  <line id="channel-25-51" class="channel-inactive" x1="390" y1="440" x2="275" y2="510"/>
  <line id="channel-10-57" class="channel-inactive" x1="360" y1="440" x2="500" y2="500"/>
  <line id="channel-7-31" class="channel-inactive" x1="345" y1="465" x2="375" y2="270"/>
  <line id="channel-44-26" class="channel-inactive" x1="405" y1="465" x2="235" y2="525"/>

  <!-- 心脏/脾中心到太阳神经丛通道 -->
  <line id="channel-21-45" class="channel-inactive" x1="225" y1="510" x2="355" y2="315"/>
  <line id="channel-40-37" class="channel-inactive" x1="250" y1="500" x2="385" y2="630"/>
  <line id="channel-51-25" class="channel-inactive" x1="275" y1="510" x2="390" y2="440"/>
  <line id="channel-26-44" class="channel-inactive" x1="235" y1="525" x2="405" y2="465"/>
  <line id="channel-48-16" class="channel-inactive" x1="475" y1="510" x2="355" y2="285"/>
  <line id="channel-57-20" class="channel-inactive" x1="500" y1="500" x2="410" y2="295"/>
  <line id="channel-44-26" class="channel-inactive" x1="525" y1="510" x2="235" y2="525"/>
  <line id="channel-18-58" class="channel-inactive" x1="485" y1="525" x2="320" y2="785"/>
  <line id="channel-28-38" class="channel-inactive" x1="515" y1="525" x2="390" y2="885"/>
  <line id="channel-32-54" class="channel-inactive" x1="510" y1="500" x2="380" y2="910"/>
  <line id="channel-50-27" class="channel-inactive" x1="490" y1="500" x2="360" y2="795"/>

  <!-- 太阳神经丛到荐骨中心通道 -->
  <line id="channel-22-12" class="channel-inactive" x1="330" y1="620" x2="395" y2="285"/>
  <line id="channel-36-35" class="channel-inactive" x1="365" y1="630" x2="360" y2="725"/>
  <line id="channel-37-40" class="channel-inactive" x1="385" y1="630" x2="250" y2="500"/>
  <line id="channel-41-35" class="channel-inactive" x1="420" y1="620" x2="360" y2="725"/>
  <line id="channel-6-59" class="channel-inactive" x1="345" y1="605" x2="400" y2="795"/>
  <line id="channel-49-19" class="channel-inactive" x1="405" y1="605" x2="410" y2="905"/>
  <line id="channel-55-39" class="channel-inactive" x1="350" y1="640" x2="360" y2="885"/>
  <line id="channel-30-41" class="channel-inactive" x1="400" y1="640" x2="420" y2="620"/>

  <!-- 荐骨中心到根中心通道 -->
  <line id="channel-3-60" class="channel-inactive" x1="320" y1="735" x2="340" y2="905"/>
  <line id="channel-9-52" class="channel-inactive" x1="360" y1="725" x2="340" y2="875"/>
  <line id="channel-5-15" class="channel-inactive" x1="400" y1="725" x2="340" y2="295"/>
  <line id="channel-14-2" class="channel-inactive" x1="430" y1="735" x2="380" y2="870"/>
  <line id="channel-42-53" class="channel-inactive" x1="430" y1="785" x2="380" y2="910"/>
  <line id="channel-59-6" class="channel-inactive" x1="400" y1="795" x2="345" y2="605"/>
  <line id="channel-27-50" class="channel-inactive" x1="360" y1="795" x2="490" y2="500"/>
  <line id="channel-58-18" class="channel-inactive" x1="320" y1="785" x2="485" y2="525"/>
  <line id="channel-6-46" class="channel-inactive" x1="340" y1="725" x2="375" y2="785"/>
  <line id="channel-34-10" class="channel-inactive" x1="410" y1="725" x2="360" y2="440"/>
  <line id="channel-29-46" class="channel-inactive" x1="375" y1="715" x2="375" y2="785"/>

  <!-- 根中心内部通道 -->
  <line id="channel-52-58" class="channel-inactive" x1="340" y1="875" x2="380" y2="870"/>
  <line id="channel-58-3" class="channel-inactive" x1="380" y1="870" x2="410" y2="875"/>
  <line id="channel-60-3" class="channel-inactive" x1="340" y1="905" x2="410" y2="875"/>
  <line id="channel-53-19" class="channel-inactive" x1="380" y1="910" x2="410" y2="905"/>
  <line id="channel-39-38" class="channel-inactive" x1="360" y1="885" x2="390" y2="885"/>

</svg>`

  useEffect(() => {
    console.log('🔍 新版真正人类图SVG useEffect 开始')
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
      console.error('❌ SVG element not found')
      console.log('📋 容器内容:', container.innerHTML)
      return
    }

    console.log('✅ 找到SVG元素，开始应用真正人类图逻辑 ===')

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

    // 定义每个中心对应的颜色 - 更鲜艳的颜色
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
        if (element.tagName === 'circle') {
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

          const allPaths = svg.querySelectorAll('line')
          let channelFound = false

          allPaths.forEach(path => {
            try {
              const pathId = path.getAttribute('id')
              if (pathId) {
                if (
                  (pathId.includes(`${gate1}-${gate2}`)) ||
                  (pathId.includes(`${gate2}-${gate1}`))
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

    console.log('=== 真正人类图样式应用完成 ===')

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