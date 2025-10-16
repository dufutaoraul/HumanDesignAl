/**
 * 用户手动绘制的人类图SVG组件
 * 直接导入用户在Inkscape中绘制的SVG文件
 */

'use client'

import React from 'react'

interface HumanDesignManualChartProps {
  width?: number
  height?: number
  className?: string
}

export default function HumanDesignManualChart({
  width = 750,
  height = 1240,
  className = ""
}: HumanDesignManualChartProps) {
  return (
    <div className={`human-design-manual-chart ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 750 1240"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <image
          href="/human-design-chart.svg"
          width="750"
          height="1240"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  )
}