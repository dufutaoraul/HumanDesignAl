/**
 * 人类图完整计算 - 从出生日期到26个闸门
 * 使用真实的天文计算 (ES Module版本)
 */

import SwissEph from 'swisseph-wasm';

// 人类图核心常量
const HD_OFFSET_TO_ZODIAC = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

// 64闸门映射表 (从 SharpAstrology.HumanDesign 提取)
const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

/**
 * 将黄道经度转换为人类图激活信息（闸门+爻）
 */
function longitudeToActivation(longitude, planetName) {
  let x = longitude - HD_OFFSET_TO_ZODIAC;
  if (x < 0) x += 360;

  const gateIndex = Math.floor(x / DEGREE_PER_GATE);
  const lineIndex = Math.floor((x % DEGREE_PER_GATE) / DEGREE_PER_LINE) + 1;
  const gate = GATE_MAP[gateIndex];

  return {
    gate,
    line: lineIndex,
    longitude: parseFloat(longitude.toFixed(4)),
    planet: planetName,
  };
}

/**
 * 计算设计日期（出生前88天）
 */
function calculateDesignDate(birthDate) {
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);
  return designDate;
}

/**
 * 计算13个行星的位置并转换为闸门激活
 */
async function calculatePlanets(swe, julianDay, side) {
  const planets = [
    { id: swe.SE_SUN, name: 'Sun' },
    { id: swe.SE_MOON, name: 'Moon' },
    { id: swe.SE_MERCURY, name: 'Mercury' },
    { id: swe.SE_VENUS, name: 'Venus' },
    { id: swe.SE_MARS, name: 'Mars' },
    { id: swe.SE_JUPITER, name: 'Jupiter' },
    { id: swe.SE_SATURN, name: 'Saturn' },
    { id: swe.SE_URANUS, name: 'Uranus' },
    { id: swe.SE_NEPTUNE, name: 'Neptune' },
    { id: swe.SE_PLUTO, name: 'Pluto' },
    { id: swe.SE_EARTH, name: 'Earth' },
    { id: swe.SE_TRUE_NODE, name: 'NorthNode' },
  ];

  const activations = {};
  console.log(`\n--- ${side} ---`);

  for (const { id, name } of planets) {
    try {
      const position = swe.calc_ut(julianDay, id, swe.SEFLG_SWIEPH);
      const longitude = position[0]; // 黄道经度
      const activation = longitudeToActivation(longitude, name);

      console.log(
        `${name.padEnd(12)}: 闸门 ${String(activation.gate).padStart(2)}.${activation.line}  (${activation.longitude}°)`
      );

      activations[name] = activation;

      // South Node 是 North Node 的对面（+180°）
      if (id === swe.SE_TRUE_NODE) {
        const southLongitude = (longitude + 180) % 360;
        const southActivation = longitudeToActivation(southLongitude, 'SouthNode');
        console.log(
          `${'SouthNode'.padEnd(12)}: 闸门 ${String(southActivation.gate).padStart(2)}.${southActivation.line}  (${southActivation.longitude}°)`
        );
        activations['SouthNode'] = southActivation;
      }
    } catch (error) {
      console.error(`计算 ${name} 时出错:`, error);
    }
  }

  return activations;
}

/**
 * 完整的人类图计算
 */
async function calculateHumanDesignChart(birthDate, birthLat, birthLon) {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    console.log('\n=== 人类图完整计算 ===');
    console.log(`出生日期: ${birthDate.toISOString()}`);
    console.log(`出生地点: 纬度 ${birthLat}°, 经度 ${birthLon}°`);

    // 计算设计日期（出生前88天）
    const designDate = calculateDesignDate(birthDate);
    console.log(`设计日期: ${designDate.toISOString()}`);

    // 转换为儒略日
    const birthJD = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60 + birthDate.getUTCSeconds() / 3600
    );

    const designJD = swe.julday(
      designDate.getUTCFullYear(),
      designDate.getUTCMonth() + 1,
      designDate.getUTCDate(),
      designDate.getUTCHours() + designDate.getUTCMinutes() / 60 + designDate.getUTCSeconds() / 3600
    );

    console.log(`\n出生儒略日: ${birthJD.toFixed(5)}`);
    console.log(`设计儒略日: ${designJD.toFixed(5)}`);

    // 计算个性端（出生时刻）
    const personality = await calculatePlanets(swe, birthJD, '个性端 (Personality)');

    // 计算设计端（设计时刻）
    const design = await calculatePlanets(swe, designJD, '设计端 (Design)');

    // 汇总所有激活的闸门
    console.log('\n=== 激活的闸门汇总 ===');
    const allActivations = [...Object.values(personality), ...Object.values(design)];
    const uniqueGates = [...new Set(allActivations.map((a) => a.gate))].sort((a, b) => a - b);
    console.log(`共激活 ${uniqueGates.length} 个闸门:`);
    console.log(uniqueGates.join(', '));

    console.log(`\n✅ 计算完成！共生成 ${Object.keys(personality).length + Object.keys(design).length} 个行星激活数据`);

    // 返回完整数据
    return {
      personality,
      design,
      birthDate: birthDate.toISOString(),
      designDate: designDate.toISOString(),
      location: { lat: birthLat, lon: birthLon },
      activatedGates: uniqueGates,
      metadata: {
        calculatedAt: new Date().toISOString(),
        swissEphVersion: swe.version(),
      },
    };
  } finally {
    swe.close();
  }
}

// ==================== 测试案例 ====================

async function runTests() {
  console.log('🧪 人类图计算测试\n');
  console.log('=' .repeat(60));

  // 测试案例1: 1990年1月1日 12:00 UTC，北京
  console.log('\n📋 测试案例 1: 1990-01-01 12:00 UTC, 北京\n');
  const test1 = new Date('1990-01-01T12:00:00Z');
  const chart1 = await calculateHumanDesignChart(test1, 39.9, 116.4);

  console.log('\n' + '='.repeat(60));

  // 测试案例2: 使用真实的出生数据（您可以替换成真实数据）
  console.log('\n📋 测试案例 2: 2000-06-15 08:30 UTC, 纽约\n');
  const test2 = new Date('2000-06-15T08:30:00Z');
  const chart2 = await calculateHumanDesignChart(test2, 40.7128, -74.0060);

  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 所有测试完成！');

  return { chart1, chart2 };
}

// 如果直接运行此文件
runTests().catch(console.error);

// 导出函数供外部使用
export { calculateHumanDesignChart, longitudeToActivation };
