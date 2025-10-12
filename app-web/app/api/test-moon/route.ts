import { NextResponse } from 'next/server';
import { calculateHumanDesignChart } from '@/lib/astronomy-calculator.js';

interface PlanetPosition {
  gate: number;
  line: number;
  longitude: number;
}

interface ChartResult {
  personality: Record<string, PlanetPosition>;
  design: Record<string, PlanetPosition>;
}

export async function GET() {

  // 测试数据：1983-10-15 11:40 北京时间 = 1983-10-15 03:40 UTC
  const birthDateTime = new Date('1983-10-15T03:40:00Z');

  const result = await calculateHumanDesignChart(birthDateTime) as ChartResult;

  return NextResponse.json({
    test: '1983-10-15 11:40 泸州',
    personality_Moon: result.personality.Moon,
    design_Moon: result.design.Moon,
    personality_Sun: result.personality.Sun,
    design_Sun: result.design.Sun,
  });
}
