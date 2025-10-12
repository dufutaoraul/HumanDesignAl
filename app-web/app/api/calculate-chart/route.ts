import { NextRequest, NextResponse } from 'next/server';
import { calculateHumanDesignChart } from '@/lib/astronomy-calculator.js';
import arrowCalculator from '@/lib/arrow-calculator.js';
import { analyzeBodygraph, generateDifySummary } from '@/lib/bodygraph-analyzer.js';

// 类型定义
interface PlanetPosition {
  gate: number;
  line: number;
  longitude: number;
}

interface ChartResult {
  personality: Record<string, PlanetPosition>;
  design: Record<string, PlanetPosition>;
}

interface IncarnationCross {
  full: string;
  quarter?: string;
  angle?: string;
}

interface AnalysisResult {
  type: string;
  authority: string;
  profile: string;
  definition: string;
  incarnationCross: IncarnationCross;
  channels: string[];
  definedCenters: string[];
}

// 地点名称转经纬度（简化版，实际应该使用地理编码API）
function getCoordinates(location: string): { lat: number; lon: number } {
  // 常用城市坐标
  const coordinates: Record<string, { lat: number; lon: number }> = {
    '北京': { lat: 39.9042, lon: 116.4074 },
    '上海': { lat: 31.2304, lon: 121.4737 },
    '广州': { lat: 23.1291, lon: 113.2644 },
    '深圳': { lat: 22.5431, lon: 114.0579 },
    '成都': { lat: 30.5728, lon: 104.0668 },
    '杭州': { lat: 30.2741, lon: 120.1551 },
    '重庆': { lat: 29.4316, lon: 106.9123 },
    '西安': { lat: 34.3416, lon: 108.9398 },
    '武汉': { lat: 30.5928, lon: 114.3055 },
    '南京': { lat: 32.0603, lon: 118.7969 },
    '泸州': { lat: 28.8717, lon: 105.4417 },
    '四川泸州': { lat: 28.8717, lon: 105.4417 },
  };

  const cityName = location.trim();
  if (coordinates[cityName]) {
    return coordinates[cityName];
  }

  // 默认返回北京坐标
  console.warn(`未找到城市 ${location} 的坐标，使用北京坐标`);
  return { lat: 39.9042, lon: 116.4074 };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, birthTime, location, timezone } = body;

    if (!name || !birthDate || !birthTime || !location) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 组合日期和时间 - 正确处理时区
    // 用户输入的是当地时间，需要转换为UTC
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);

    // 创建一个UTC时间对象
    let birthDateTime: Date;

    if (timezone === 'Asia/Shanghai') {
      // 北京时间是UTC+8，用户输入11:40表示北京时间11:40
      // 需要转换为UTC时间：11:40 - 8小时 = 03:40 UTC
      birthDateTime = new Date(Date.UTC(year, month - 1, day, hours - 8, minutes));
    } else {
      // 其他时区暂时按UTC处理
      birthDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    }

    console.log('=== 时间转换调试 ===');
    console.log('输入时间:', birthDate, birthTime, timezone);
    console.log('UTC时间:', birthDateTime.toISOString());

    // 计算人类图（异步）
    // 注意：astronomy-calculator 不需要经纬度参数，只需要UTC时间
    const chartResult = await calculateHumanDesignChart(birthDateTime) as ChartResult;

    // 调试输出
    console.log('=== 计算结果 ===');
    console.log('个性端 Moon:', chartResult.personality.Moon);
    console.log('设计端 Moon:', chartResult.design.Moon);

    // 分析星盘数据（计算类型、权威、人生角色等）
    const analysis = analyzeBodygraph(chartResult) as AnalysisResult;
    console.log('=== 星盘分析结果 ===');
    console.log('类型:', analysis.type);
    console.log('权威:', analysis.authority);
    console.log('人生角色:', analysis.profile);
    console.log('定义:', analysis.definition);

    // 准备箭头计算的激活数据
    const personalityActivations: Record<string, { gate: number; line: number }> = {};
    const designActivations: Record<string, { gate: number; line: number }> = {};

    const planets = ['Sun', 'Earth', 'Moon', 'NorthNode', 'SouthNode', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

    planets.forEach(planet => {
      if (chartResult.personality[planet]) {
        personalityActivations[planet] = {
          gate: chartResult.personality[planet].gate,
          line: chartResult.personality[planet].line,
        };
      }
      if (chartResult.design[planet]) {
        designActivations[planet] = {
          gate: chartResult.design[planet].gate,
          line: chartResult.design[planet].line,
        };
      }
    });

    // 计算箭头
    const arrows = arrowCalculator.calculateArrows(personalityActivations, designActivations);

    // 组合最终结果
    const finalResult: Record<string, unknown> = {
      name,
      birthDate,
      birthTime,
      location,
      timezone,
      // 核心分析数据
      analysis: {
        type: analysis.type,
        authority: analysis.authority,
        profile: analysis.profile,
        definition: analysis.definition,
        incarnationCross: analysis.incarnationCross,
        channels: analysis.channels,
        definedCenters: analysis.definedCenters,
      },
      // Dify集成数据
      dify: generateDifySummary(analysis, chartResult, { name }),
      // 行星数据
      planets: {
        personality: {},
        design: {},
      },
    };

    planets.forEach(planet => {
      if (chartResult.personality[planet]) {
        finalResult.planets.personality[planet] = {
          gate: chartResult.personality[planet].gate,
          line: chartResult.personality[planet].line,
          arrow: arrows.personality[planet]
            ? arrowCalculator.formatArrowSymbol(arrows.personality[planet].fixingState)
            : '',
        };
      }

      if (chartResult.design[planet]) {
        finalResult.planets.design[planet] = {
          gate: chartResult.design[planet].gate,
          line: chartResult.design[planet].line,
          arrow: arrows.design[planet]
            ? arrowCalculator.formatArrowSymbol(arrows.design[planet].fixingState)
            : '',
        };
      }
    });

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error('计算错误:', error);
    return NextResponse.json(
      { error: '计算失败', details: String(error) },
      { status: 500 }
    );
  }
}
