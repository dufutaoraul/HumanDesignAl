/**
 * 人类图SVG绘制组件 - 重新设计版本
 * 基于参考图片创建更真实的人类图身体图
 */

'use client'

import React, { useMemo } from 'react'

interface HumanDesignChartProps {
  chartData: {
    analysis: {
      channels: string[]
      definedCenters: string[]
      type: string
      profile: string
      authority: string
      definition: string
      incarnationCross: {
        full: string
        key: string
        type: string
      }
    }
    planets: {
      design: Record<string, any>
      personality: Record<string, any>
    }
  }
  width?: number
  height?: number
}

interface Center {
  id: string
  name: string
  x: number
  y: number
  shape: 'triangle' | 'square' | 'diamond' | 'inverted-triangle'
  color?: string
  gates: number[]
}

interface Channel {
  id: string
  name: string
  fromGate: number
  toGate: number
  fromCenter: string
  toCenter: string
  path: string
}

interface Gate {
  id: number
  center: string
  x: number
  y: number
  isActive: boolean
  activationType?: 'design' | 'personality' | 'both'
}

export default function HumanDesignChart({ chartData, width = 800, height = 800 }: HumanDesignChartProps) {

  // 重新设计9大中心的几何结构和位置 - 更接近参考图
  const centers: Center[] = useMemo(() => [
    // 头中心 (Head Center) - 倒三角形
    {
      id: 'head',
      name: 'Head',
      x: 400,
      y: 100,
      shape: 'inverted-triangle',
      gates: [64, 47, 24, 4, 61, 63]
    },
    // 脑中心 (Ajna Center) - 菱形
    {
      id: 'ajna',
      name: 'Ajna',
      x: 400,
      y: 200,
      shape: 'diamond',
      gates: [47, 64, 11, 62, 17, 43, 24, 4, 63, 61]
    },
    // 喉咙中心 (Throat Center) - 正方形
    {
      id: 'throat',
      name: 'Throat',
      x: 400,
      y: 320,
      shape: 'square',
      gates: [62, 23, 56, 31, 8, 33, 45, 12, 15, 20, 16, 35, 36, 22, 63, 57, 52, 11, 43, 17]
    },
    // G中心 (G Center) - 菱形（较大的中心）
    {
      id: 'g',
      name: 'G Center',
      x: 400,
      y: 440,
      shape: 'diamond',
      gates: [1, 13, 7, 2, 10, 46, 25, 51, 15, 33]
    },
    // 意志力中心 (Ego/Heart Center) - 三角形
    {
      id: 'ego',
      name: 'Ego',
      x: 280,
      y: 380,
      shape: 'triangle',
      gates: [21, 26, 40, 51, 44, 45]
    },
    // 脾中心 (Spleen Center) - 三角形
    {
      id: 'spleen',
      name: 'Spleen',
      x: 280,
      y: 500,
      shape: 'triangle',
      gates: [48, 57, 44, 50, 32, 28, 18, 58, 52, 53, 27, 26]
    },
    // 太阳神经丛中心 (Solar Plexus) - 三角形
    {
      id: 'solarPlexus',
      name: 'Solar Plexus',
      x: 520,
      y: 500,
      shape: 'triangle',
      gates: [55, 49, 39, 22, 36, 37, 41, 30, 35, 19, 59, 6]
    },
    // 荐骨中心 (Sacral Center) - 正方形
    {
      id: 'sacral',
      name: 'Sacral',
      x: 520,
      y: 380,
      shape: 'square',
      gates: [34, 59, 14, 29, 5, 9, 46, 2, 3, 58, 42, 53, 60]
    },
    // 根中心 (Root Center) - 倒三角形
    {
      id: 'root',
      name: 'Root',
      x: 400,
      y: 600,
      shape: 'inverted-triangle',
      gates: [60, 52, 3, 58, 42, 53, 19, 39, 41, 30, 38, 54, 32, 28, 18]
    }
  ], [])

  // 定义36根通道
  const channels: Channel[] = useMemo(() => [
    // 个体化回路
    { id: '1-8', name: '1-8', fromGate: 1, toGate: 8, fromCenter: 'g', toCenter: 'throat', path: 'M 400,420 Q 350,350 400,300' },
    { id: '2-14', name: '2-14', fromGate: 2, toGate: 14, fromCenter: 'g', toCenter: 'g', path: 'M 400,420 Q 450,400 480,380' },
    { id: '3-60', name: '3-60', fromGate: 3, toGate: 60, fromCenter: 'sacral', toCenter: 'root', path: 'M 520,380 Q 460,480 400,580' },
    { id: '7-31', name: '7-31', fromGate: 7, toGate: 31, fromCenter: 'g', toCenter: 'throat', path: 'M 400,420 Q 450,350 400,300' },
    { id: '13-33', name: '13-33', fromGate: 13, toGate: 33, fromCenter: 'g', toCenter: 'throat', path: 'M 400,420 Q 400,350 400,300' },
    { id: '10-20', name: '10-20', fromGate: 10, toGate: 20, fromCenter: 'g', toCenter: 'throat', path: 'M 400,420 Q 350,350 400,300' },
    { id: '10-34', name: '10-34', fromGate: 10, toGate: 34, fromCenter: 'g', toCenter: 'sacral', path: 'M 400,420 Q 480,400 520,380' },
    { id: '25-51', name: '25-51', fromGate: 25, toGate: 51, fromCenter: 'g', toCenter: 'ego', path: 'M 400,420 Q 320,400 280,380' },
    { id: '57-20', name: '57-20', fromGate: 57, toGate: 20, fromCenter: 'spleen', toCenter: 'throat', path: 'M 280,480 Q 350,380 400,300' },
    { id: '57-34', name: '57-34', fromGate: 57, toGate: 34, fromCenter: 'spleen', toCenter: 'sacral', path: 'M 280,480 Q 400,430 520,380' },
    { id: '57-10', name: '57-10', fromGate: 57, toGate: 10, fromCenter: 'spleen', toCenter: 'g', path: 'M 280,480 Q 350,450 400,420' },
    // 逻辑回路
    { id: '43-23', name: '43-23', fromGate: 43, toGate: 23, fromCenter: 'ajna', toCenter: 'throat', path: 'M 400,180 Q 450,240 400,300' },
    { id: '11-56', name: '11-56', fromGate: 11, toGate: 56, fromCenter: 'ajna', toCenter: 'throat', path: 'M 400,180 Q 350,240 400,300' },
    { id: '17-62', name: '17-62', fromGate: 17, toGate: 62, fromCenter: 'ajna', toCenter: 'throat', path: 'M 400,180 Q 400,240 400,300' },
    { id: '47-64', name: '47-64', fromGate: 47, toGate: 64, fromCenter: 'head', toCenter: 'ajna', path: 'M 400,80 Q 450,130 400,180' },
    { id: '24-61', name: '24-61', fromGate: 24, toGate: 61, fromCenter: 'head', toCenter: 'ajna', path: 'M 400,80 Q 350,130 400,180' },
    { id: '4-63', name: '4-63', fromGate: 4, toGate: 63, fromCenter: 'head', toCenter: 'ajna', path: 'M 400,80 Q 400,130 400,180' },
    // 家族回路
    { id: '45-21', name: '45-21', fromGate: 45, toGate: 21, fromCenter: 'throat', toCenter: 'ego', path: 'M 400,300 Q 320,340 280,380' },
    { id: '21-25', name: '21-25', fromGate: 21, toGate: 25, fromCenter: 'ego', toCenter: 'g', path: 'M 280,380 Q 350,400 400,420' },
    { id: '26-44', name: '26-44', fromGate: 26, toGate: 44, fromCenter: 'spleen', toCenter: 'ego', path: 'M 280,480 Q 280,430 280,380' },
    { id: '44-26', name: '44-26', fromGate: 44, toGate: 26, fromCenter: 'ego', toCenter: 'spleen', path: 'M 280,380 Q 280,430 280,480' },
    { id: '40-37', name: '40-37', fromGate: 40, toGate: 37, fromCenter: 'ego', toCenter: 'solarPlexus', path: 'M 280,380 Q 400,430 520,480' },
    { id: '37-40', name: '37-40', fromGate: 37, toGate: 40, fromCenter: 'solarPlexus', toCenter: 'ego', path: 'M 520,480 Q 400,430 280,380' },
    { id: '54-32', name: '54-32', fromGate: 54, toGate: 32, fromCenter: 'root', toCenter: 'spleen', path: 'M 400,580 Q 320,530 280,480' },
    { id: '32-54', name: '32-54', fromGate: 32, toGate: 54, fromCenter: 'spleen', toCenter: 'root', path: 'M 280,480 Q 320,530 400,580' },
    // 感知回路
    { id: '22-12', name: '22-12', fromGate: 22, toGate: 12, fromCenter: 'solarPlexus', toCenter: 'throat', path: 'M 520,480 Q 450,380 400,300' },
    { id: '12-22', name: '12-22', fromGate: 12, toGate: 22, fromCenter: 'throat', toCenter: 'solarPlexus', path: 'M 400,300 Q 450,380 520,480' },
    { id: '35-36', name: '35-36', fromGate: 35, toGate: 36, fromCenter: 'solarPlexus', toCenter: 'throat', path: 'M 520,480 Q 450,380 400,300' },
    { id: '36-35', name: '36-35', fromGate: 36, toGate: 35, fromCenter: 'throat', toCenter: 'solarPlexus', path: 'M 400,300 Q 450,380 520,480' },
    // 社会回路
    { id: '59-6', name: '59-6', fromGate: 59, toGate: 6, fromCenter: 'sacral', toCenter: 'solarPlexus', path: 'M 520,380 Q 520,430 520,480' },
    { id: '6-59', name: '6-59', fromGate: 6, toGate: 59, fromCenter: 'solarPlexus', toCenter: 'sacral', path: 'M 520,480 Q 520,430 520,380' },
    { id: '19-49', name: '19-49', fromGate: 19, toGate: 49, fromCenter: 'root', toCenter: 'solarPlexus', path: 'M 400,580 Q 480,530 520,480' },
    { id: '49-19', name: '49-19', fromGate: 49, toGate: 19, fromCenter: 'solarPlexus', toCenter: 'root', path: 'M 520,480 Q 480,530 400,580' },
    { id: '39-55', name: '39-55', fromGate: 39, toGate: 55, fromCenter: 'root', toCenter: 'solarPlexus', path: 'M 400,580 Q 480,530 520,480' },
    { id: '55-39', name: '55-39', fromGate: 55, toGate: 39, fromCenter: 'solarPlexus', toCenter: 'root', path: 'M 520,480 Q 480,530 400,580' },
    { id: '41-30', name: '41-30', fromGate: 41, toGate: 30, fromCenter: 'root', toCenter: 'solarPlexus', path: 'M 400,580 Q 480,530 520,480' },
    { id: '30-41', name: '30-41', fromGate: 30, toGate: 41, fromCenter: 'solarPlexus', toCenter: 'root', path: 'M 520,480 Q 480,530 400,580' },
    // 中心连接通道
    { id: '16-48', name: '16-48', fromGate: 16, toGate: 48, fromCenter: 'throat', toCenter: 'spleen', path: 'M 400,300 Q 320,380 280,480' },
    { id: '48-16', name: '48-16', fromGate: 48, toGate: 16, fromCenter: 'spleen', toCenter: 'throat', path: 'M 280,480 Q 320,380 400,300' },
    { id: '52-31', name: '52-31', fromGate: 52, toGate: 31, fromCenter: 'spleen', toCenter: 'throat', path: 'M 280,480 Q 350,380 400,300' },
    { id: '31-52', name: '31-52', fromGate: 31, toGate: 52, fromCenter: 'throat', toCenter: 'spleen', path: 'M 400,300 Q 350,380 280,480' },
    { id: '53-42', name: '53-42', fromGate: 53, toGate: 42, fromCenter: 'spleen', toCenter: 'sacral', path: 'M 280,480 Q 400,430 520,380' },
    { id: '42-53', name: '42-53', fromGate: 42, toGate: 53, fromCenter: 'sacral', toCenter: 'spleen', path: 'M 520,380 Q 400,430 280,480' },
    { id: '60-3', name: '60-3', fromGate: 60, toGate: 3, fromCenter: 'root', toCenter: 'sacral', path: 'M 400,580 Q 480,480 520,380' },
    { id: '3-60', name: '3-60', fromGate: 3, toGate: 60, fromCenter: 'sacral', toCenter: 'root', path: 'M 520,380 Q 480,480 400,580' }
  ], [])

  // 分析激活的通道
  const activeChannels = useMemo(() => {
    if (!chartData?.analysis?.channels) {
      // 如果没有数据，显示一些测试通道 - 连接真实的中心
      return [
        {
          id: '1-8',
          name: '1-8',
          fromGate: 1,
          toGate: 8,
          fromCenter: 'g',
          toCenter: 'throat',
          path: '',
          activationType: 'design'
        },
        {
          id: '25-51',
          name: '25-51',
          fromGate: 25,
          toGate: 51,
          fromCenter: 'g',
          toCenter: 'ego',
          path: '',
          activationType: 'personality'
        },
        {
          id: '57-20',
          name: '57-20',
          fromGate: 57,
          toGate: 20,
          fromCenter: 'spleen',
          toCenter: 'throat',
          path: '',
          activationType: 'both'
        },
        {
          id: '34-57',
          name: '34-57',
          fromGate: 34,
          toGate: 57,
          fromCenter: 'sacral',
          toCenter: 'spleen',
          path: '',
          activationType: 'design'
        },
        {
          id: '47-64',
          name: '47-64',
          fromGate: 47,
          toGate: 64,
          fromCenter: 'head',
          toCenter: 'ajna',
          path: '',
          activationType: 'personality'
        }
      ]
    }

    const channelStrings = chartData.analysis.channels
    return channels.filter(channel => {
      // 检查通道名称或闸门对是否匹配
      return channelStrings.includes(channel.name) ||
             channelStrings.includes(`${channel.fromGate}-${channel.toGate}`) ||
             channelStrings.includes(`${channel.toGate}-${channel.fromGate}`)
    }).map(channel => {
      // 根据通道类型确定激活类型（这里简化处理）
      // 在实际实现中，需要根据设计/个性数据来判断
      const activationType = Math.random() > 0.5 ? 'design' :
                           Math.random() > 0.3 ? 'personality' : 'both'

      return {
        ...channel,
        activationType
      }
    })
  }, [chartData, channels])

  // 判断中心是否被定义 - 重新设计，基于测试数据
  const isCenterDefined = (centerId: string) => {
    // 如果有真实数据，使用真实数据
    if (chartData?.analysis?.definedCenters?.length > 0) {
      return chartData.analysis.definedCenters.some((center: string) =>
        center.toLowerCase().includes(centerId.toLowerCase())
      )
    }

    // 否则使用测试数据 - 模拟一些被定义的中心
    const testDefinedCenters = ['throat', 'g', 'sacral', 'spleen']
    return testDefinedCenters.includes(centerId)
  }

  // 绘制中心形状 - 重新设计更接近参考图
  const renderCenter = (center: Center) => {
    const isDefined = isCenterDefined(center.id)
    const centerColor = isDefined ? '#ff6b6b' : '#ffffff' // 定义中心为红色，未定义为白色
    const scale = width / 800
    const strokeColor = '#2c3e50'
    const strokeWidth = 3

    switch (center.shape) {
      case 'triangle':
        // 上三角形（意志力中心）
        return (
          <path
            d={`M ${center.x * scale},${(center.y - 45) * scale} L ${(center.x - 40) * scale},${(center.y + 25) * scale} L ${(center.x + 40) * scale},${(center.y + 25) * scale} Z`}
            fill={centerColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={isDefined ? 1 : 0.3}
          />
        )
      case 'inverted-triangle':
        // 下三角形（头中心、根中心）
        if (center.id === 'head') {
          // 头中心 - 较小的倒三角形
          return (
            <path
              d={`M ${(center.x - 35) * scale},${(center.y - 25) * scale} L ${(center.x + 35) * scale},${(center.y - 25) * scale} L ${center.x * scale},${(center.y + 35) * scale} Z`}
              fill={centerColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={isDefined ? 1 : 0.3}
            />
          )
        } else {
          // 根中心 - 较大的倒三角形
          return (
            <path
              d={`M ${(center.x - 45) * scale},${(center.y - 30) * scale} L ${(center.x + 45) * scale},${(center.y - 30) * scale} L ${center.x * scale},${(center.y + 45) * scale} Z`}
              fill={centerColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={isDefined ? 1 : 0.3}
            />
          )
        }
      case 'square':
        // 正方形（喉咙中心、荐骨中心）
        const size = center.id === 'throat' ? 40 : 45
        return (
          <rect
            x={(center.x - size) * scale}
            y={(center.y - size) * scale}
            width={size * 2 * scale}
            height={size * 2 * scale}
            fill={centerColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={isDefined ? 1 : 0.3}
          />
        )
      case 'diamond':
        // 菱形（脑中心、G中心、脾中心、太阳神经丛中心）
        if (center.id === 'g') {
          // G中心 - 最大的菱形
          return (
            <path
              d={`M ${center.x * scale},${(center.y - 55) * scale} L ${(center.x + 50) * scale},${center.y * scale} L ${center.x * scale},${(center.y + 55) * scale} L ${(center.x - 50) * scale},${center.y * scale} Z`}
              fill={centerColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={isDefined ? 1 : 0.3}
            />
          )
        } else if (center.id === 'ajna') {
          // 脑中心 - 中等菱形
          return (
            <path
              d={`M ${center.x * scale},${(center.y - 35) * scale} L ${(center.x + 30) * scale},${center.y * scale} L ${center.x * scale},${(center.y + 35) * scale} L ${(center.x - 30) * scale},${center.y * scale} Z`}
              fill={centerColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={isDefined ? 1 : 0.3}
            />
          )
        } else {
          // 脾中心、太阳神经丛中心 - 小菱形
          return (
            <path
              d={`M ${center.x * scale},${(center.y - 30) * scale} L ${(center.x + 25) * scale},${center.y * scale} L ${center.x * scale},${(center.y + 30) * scale} L ${(center.x - 25) * scale},${center.y * scale} Z`}
              fill={centerColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={isDefined ? 1 : 0.3}
            />
          )
        }
      default:
        return null
    }
  }

  // 绘制通道 - 重新设计更真实的连接线
  const renderChannel = (channel: Channel & { activationType?: string }) => {
    const isActive = activeChannels.some(active => active.id === channel.id)
    if (!isActive) return null

    const scale = width / 800
    const activationType = channel.activationType || 'design'

    // 根据激活类型确定通道颜色
    const getChannelColor = () => {
      switch (activationType) {
        case 'design':
          return '#dc2626' // 红色
        case 'personality':
          return '#000000' // 黑色
        case 'both':
          return '#9333ea' // 紫色表示同时激活
        default:
          return '#dc2626' // 默认红色
      }
    }

    // 重新计算通道路径 - 直线连接而不是曲线
    const fromCenter = centers.find(c => c.id === channel.fromCenter)
    const toCenter = centers.find(c => c.id === channel.toCenter)

    if (!fromCenter || !toCenter) return null

    const strokeWidth = activationType === 'both' ? 6 : 4

    return (
      <line
        x1={fromCenter.x * scale}
        y1={fromCenter.y * scale}
        x2={toCenter.x * scale}
        y2={toCenter.y * scale}
        stroke={getChannelColor()}
        strokeWidth={strokeWidth}
        opacity={0.9}
        strokeLinecap="round"
      />
    )
  }

  // 闸门精确位置映射
  const gatePositions: Record<number, { center: string; x: number; y: number; angle: number; distance: number }> = useMemo(() => ({
    // 头中心闸门
    64: { center: 'head', x: 400, y: 80, angle: -30, distance: 50 },
    47: { center: 'head', x: 400, y: 80, angle: 30, distance: 50 },
    24: { center: 'head', x: 400, y: 80, angle: 90, distance: 50 },
    4: { center: 'head', x: 400, y: 80, angle: 150, distance: 50 },
    61: { center: 'head', x: 400, y: 80, angle: 210, distance: 50 },
    63: { center: 'head', x: 400, y: 80, angle: -150, distance: 50 },

    // 脑中心闸门
    11: { center: 'ajna', x: 400, y: 180, angle: -45, distance: 60 },
    62: { center: 'ajna', x: 400, y: 180, angle: 45, distance: 60 },
    17: { center: 'ajna', x: 400, y: 180, angle: 135, distance: 60 },
    43: { center: 'ajna', x: 400, y: 180, angle: -135, distance: 60 },

    // 喉咙中心闸门
    62: { center: 'throat', x: 400, y: 300, angle: -60, distance: 50 },
    23: { center: 'throat', x: 400, y: 300, angle: -20, distance: 50 },
    56: { center: 'throat', x: 400, y: 300, angle: 20, distance: 50 },
    31: { center: 'throat', x: 400, y: 300, angle: 60, distance: 50 },
    8: { center: 'throat', x: 400, y: 300, angle: 100, distance: 50 },
    33: { center: 'throat', x: 400, y: 300, angle: 140, distance: 50 },
    45: { center: 'throat', x: 400, y: 300, angle: 180, distance: 50 },
    12: { center: 'throat', x: 400, y: 300, angle: -180, distance: 50 },
    15: { center: 'throat', x: 400, y: 300, angle: -140, distance: 50 },
    20: { center: 'throat', x: 400, y: 300, angle: -100, distance: 50 },
    16: { center: 'throat', x: 400, y: 300, angle: -120, distance: 50 },
    35: { center: 'throat', x: 400, y: 300, angle: -80, distance: 50 },
    36: { center: 'throat', x: 400, y: 300, angle: -40, distance: 50 },
    22: { center: 'throat', x: 400, y: 300, angle: 40, distance: 50 },
    63: { center: 'throat', x: 400, y: 300, angle: 80, distance: 50 },
    57: { center: 'throat', x: 400, y: 300, angle: 120, distance: 50 },
    52: { center: 'throat', x: 400, y: 300, angle: 160, distance: 50 },

    // G中心闸门
    1: { center: 'g', x: 400, y: 420, angle: -60, distance: 60 },
    13: { center: 'g', x: 400, y: 420, angle: 0, distance: 60 },
    7: { center: 'g', x: 400, y: 420, angle: 60, distance: 60 },
    2: { center: 'g', x: 400, y: 420, angle: 120, distance: 60 },
    10: { center: 'g', x: 400, y: 420, angle: 180, distance: 60 },
    46: { center: 'g', x: 400, y: 420, angle: -180, distance: 60 },
    25: { center: 'g', x: 400, y: 420, angle: -120, distance: 60 },
    51: { center: 'g', x: 400, y: 420, angle: -120, distance: 60 },
    15: { center: 'g', x: 400, y: 420, angle: -60, distance: 60 },
    33: { center: 'g', x: 400, y: 420, angle: 0, distance: 60 },

    // 意志力中心闸门
    21: { center: 'ego', x: 280, y: 380, angle: -45, distance: 45 },
    26: { center: 'ego', x: 280, y: 380, angle: 45, distance: 45 },
    40: { center: 'ego', x: 280, y: 380, angle: 135, distance: 45 },
    51: { center: 'ego', x: 280, y: 380, angle: -135, distance: 45 },
    44: { center: 'ego', x: 280, y: 380, angle: -90, distance: 45 },
    45: { center: 'ego', x: 280, y: 380, angle: 90, distance: 45 },

    // 脾中心闸门
    48: { center: 'spleen', x: 280, y: 480, angle: -60, distance: 45 },
    57: { center: 'spleen', x: 280, y: 480, angle: -30, distance: 45 },
    44: { center: 'spleen', x: 280, y: 480, angle: 0, distance: 45 },
    50: { center: 'spleen', x: 280, y: 480, angle: 30, distance: 45 },
    32: { center: 'spleen', x: 280, y: 480, angle: 60, distance: 45 },
    28: { center: 'spleen', x: 280, y: 480, angle: 90, distance: 45 },
    18: { center: 'spleen', x: 280, y: 480, angle: 120, distance: 45 },
    58: { center: 'spleen', x: 280, y: 480, angle: 150, distance: 45 },
    52: { center: 'spleen', x: 280, y: 480, angle: -150, distance: 45 },
    53: { center: 'spleen', x: 280, y: 480, angle: -120, distance: 45 },
    27: { center: 'spleen', x: 280, y: 480, angle: -90, distance: 45 },
    26: { center: 'spleen', x: 280, y: 480, angle: -45, distance: 45 },

    // 太阳神经丛中心闸门
    55: { center: 'solarPlexus', x: 520, y: 480, angle: -75, distance: 45 },
    49: { center: 'solarPlexus', x: 520, y: 480, angle: -45, distance: 45 },
    39: { center: 'solarPlexus', x: 520, y: 480, angle: -15, distance: 45 },
    22: { center: 'solarPlexus', x: 520, y: 480, angle: 15, distance: 45 },
    36: { center: 'solarPlexus', x: 520, y: 480, angle: 45, distance: 45 },
    37: { center: 'solarPlexus', x: 520, y: 480, angle: 75, distance: 45 },
    41: { center: 'solarPlexus', x: 520, y: 480, angle: 105, distance: 45 },
    30: { center: 'solarPlexus', x: 520, y: 480, angle: 135, distance: 45 },
    35: { center: 'solarPlexus', x: 520, y: 480, angle: 165, distance: 45 },
    19: { center: 'solarPlexus', x: 520, y: 480, angle: -165, distance: 45 },
    59: { center: 'solarPlexus', x: 520, y: 480, angle: -135, distance: 45 },
    6: { center: 'solarPlexus', x: 520, y: 480, angle: -105, distance: 45 },

    // 荐骨中心闸门
    34: { center: 'sacral', x: 520, y: 380, angle: -60, distance: 50 },
    59: { center: 'sacral', x: 520, y: 380, angle: -30, distance: 50 },
    14: { center: 'sacral', x: 520, y: 380, angle: 0, distance: 50 },
    29: { center: 'sacral', x: 520, y: 380, angle: 30, distance: 50 },
    5: { center: 'sacral', x: 520, y: 380, angle: 60, distance: 50 },
    9: { center: 'sacral', x: 520, y: 380, angle: 90, distance: 50 },
    46: { center: 'sacral', x: 520, y: 380, angle: 120, distance: 50 },
    2: { center: 'sacral', x: 520, y: 380, angle: 150, distance: 50 },
    3: { center: 'sacral', x: 520, y: 380, angle: -150, distance: 50 },
    58: { center: 'sacral', x: 520, y: 380, angle: -120, distance: 50 },
    42: { center: 'sacral', x: 520, y: 380, angle: -90, distance: 50 },
    53: { center: 'sacral', x: 520, y: 380, angle: -60, distance: 50 },
    60: { center: 'sacral', x: 520, y: 380, angle: -30, distance: 50 },

    // 根中心闸门
    60: { center: 'root', x: 400, y: 580, angle: -75, distance: 50 },
    52: { center: 'root', x: 400, y: 580, angle: -45, distance: 50 },
    3: { center: 'root', x: 400, y: 580, angle: -15, distance: 50 },
    58: { center: 'root', x: 400, y: 580, angle: 15, distance: 50 },
    42: { center: 'root', x: 400, y: 580, angle: 45, distance: 50 },
    53: { center: 'root', x: 400, y: 580, angle: 75, distance: 50 },
    19: { center: 'root', x: 400, y: 580, angle: 105, distance: 50 },
    39: { center: 'root', x: 400, y: 580, angle: 135, distance: 50 },
    41: { center: 'root', x: 400, y: 580, angle: 165, distance: 50 },
    30: { center: 'root', x: 400, y: 580, angle: -165, distance: 50 },
    38: { center: 'root', x: 400, y: 580, angle: -135, distance: 50 },
    54: { center: 'root', x: 400, y: 580, angle: -105, distance: 50 },
    32: { center: 'root', x: 400, y: 580, angle: -75, distance: 50 },
    28: { center: 'root', x: 400, y: 580, angle: -45, distance: 50 },
    18: { center: 'root', x: 400, y: 580, angle: -15, distance: 50 }
  }), [])

  // 绘制闸门
  const renderGate = (gateNumber: number) => {
    const position = gatePositions[gateNumber]
    if (!position) return null

    const scale = width / 800
    const x = position.x * scale + Math.cos(position.angle * Math.PI / 180) * position.distance * scale
    const y = position.y * scale + Math.sin(position.angle * Math.PI / 180) * position.distance * scale

    // 判断闸门是否被激活
    const isActive = activeChannels.some(channel =>
      channel.fromGate === gateNumber || channel.toGate === gateNumber
    )

    const gateColor = isActive ? '#dc2626' : '#e5e7eb'

    return (
      <g key={`gate-${gateNumber}`}>
        <circle
          cx={x}
          cy={y}
          r="14"
          fill={gateColor}
          stroke="#374151"
          strokeWidth="2"
          className="transition-colors duration-200"
        />
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize="10"
          fill={isActive ? '#ffffff' : '#111827'}
          fontWeight="bold"
        >
          {gateNumber}
        </text>
      </g>
    )
  }

  return (
    <div className="flex justify-center items-center p-4">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="border border-gray-200 rounded-lg bg-white shadow-lg"
      >
        {/* 定义渐变 */}
        <defs>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="channelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 绘制通道 */}
        {activeChannels.map(channel => (
          <g key={`channel-${channel.id}`}>
            {renderChannel(channel)}
          </g>
        ))}

        {/* 绘制中心 */}
        {centers.map(center => (
          <g key={`center-${center.id}`}>
            {renderCenter(center)}
            <text
              x={center.x * (width / 800)}
              y={center.y * (width / 800) + 5}
              textAnchor="middle"
              fontSize="12"
              fill="#111827"
              fontWeight="bold"
            >
              {center.name}
            </text>
          </g>
        ))}

        {/* 绘制所有闸门 */}
        {Object.keys(gatePositions).map(gateNumber =>
          renderGate(parseInt(gateNumber))
        )}
      </svg>
    </div>
  )
}