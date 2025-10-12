/**
 * 人类图精准计算 - 修正版
 * 核心修正：设计日期 = 太阳退后88度的时刻（而非简单的88天）
 */

import SwissEph from 'swisseph-wasm';

// 人类图核心常量
const HD_OFFSET_TO_ZODIAC = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;
const DESIGN_SUN_DEGREES = 88; // 设计时刻：太阳退后88度

// 64闸门映射表
const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

/**
 * 将黄道经度转换为人类图激活信息
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
 * 计算角度差（考虑360度循环）
 */
function angleDifference(angle1, angle2) {
  let diff = angle1 - angle2;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return Math.abs(diff);
}

/**
 * 减去度数（考虑360度循环）
 */
function subtractDegree(longitude, degrees) {
  let result = longitude - degrees;
  while (result < 0) result += 360;
  while (result >= 360) result -= 360;
  return result;
}

/**
 * 计算设计日期 - 核心修正
 * 找到太阳位置退后88度的精确时刻
 */
async function calculateDesignDate(swe, birthDate) {
  // 计算出生时的太阳位置
  const birthJD = swe.julday(
    birthDate.getUTCFullYear(),
    birthDate.getUTCMonth() + 1,
    birthDate.getUTCDate(),
    birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60 + birthDate.getUTCSeconds() / 3600
  );

  const birthSunPos = swe.calc_ut(birthJD, swe.SE_SUN, swe.SEFLG_SWIEPH);
  const birthSunLongitude = birthSunPos[0];

  // 目标：太阳位置退后88度
  const targetSunLongitude = subtractDegree(birthSunLongitude, DESIGN_SUN_DEGREES);

  console.log(`  出生太阳位置: ${birthSunLongitude.toFixed(4)}°`);
  console.log(`  目标太阳位置: ${targetSunLongitude.toFixed(4)}° (退后88度)`);

  // 使用二分法在出生前70-110天之间查找
  let startJD = birthJD - 110;
  let endJD = birthJD - 70;
  let iterations = 0;
  const maxIterations = 1000;
  const tolerance = 0.0001; // 精度：约9秒

  while (iterations < maxIterations && (endJD - startJD) > tolerance) {
    const midJD = (startJD + endJD) / 2;
    const midSunPos = swe.calc_ut(midJD, swe.SE_SUN, swe.SEFLG_SWIEPH);
    const midSunLongitude = midSunPos[0];

    const diff = angleDifference(midSunLongitude, targetSunLongitude);

    if (diff < 0.001) {
      // 找到了！
      const designDate = swe.revjul(midJD, swe.SE_GREG_CAL);
      const resultDate = new Date(Date.UTC(
        designDate.year,
        designDate.month - 1,
        designDate.day,
        Math.floor(designDate.hour),
        Math.floor((designDate.hour % 1) * 60),
        Math.floor(((designDate.hour * 60) % 1) * 60)
      ));

      console.log(`  找到设计日期: ${resultDate.toISOString()}`);
      console.log(`  实际太阳位置: ${midSunLongitude.toFixed(4)}° (误差: ${diff.toFixed(6)}°)`);
      console.log(`  迭代次数: ${iterations}`);

      return { date: resultDate, julianDay: midJD };
    }

    // 判断应该往哪个方向搜索
    // 太阳从出生往前退，经度应该变小（逆时针）
    const startSunLon = swe.calc_ut(startJD, swe.SE_SUN, swe.SEFLG_SWIEPH)[0];
    const midDiffFromTarget = angleDifference(midSunLongitude, targetSunLongitude);
    const startDiffFromTarget = angleDifference(startSunLon, targetSunLongitude);

    if (midDiffFromTarget < startDiffFromTarget) {
      // mid更接近target，在左半边
      endJD = midJD;
    } else {
      // 在右半边
      startJD = midJD;
    }

    iterations++;
  }

  // 如果没找到，返回近似值
  console.warn(`  ⚠️  未找到精确设计日期，使用近似值（迭代${iterations}次）`);
  const approxDate = new Date(birthDate);
  approxDate.setDate(approxDate.getDate() - 88);
  return { date: approxDate, julianDay: startJD };
}

/**
 * 计算13个行星的位置
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
      const longitude = position[0];
      const activation = longitudeToActivation(longitude, name);

      console.log(
        `${name.padEnd(12)}: 闸门 ${String(activation.gate).padStart(2)}.${activation.line}  (${activation.longitude}°)`
      );

      activations[name] = activation;

      // South Node
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
 * 完整的人类图计算 - 修正版
 */
async function calculateHumanDesignChart(birthDate, birthLat, birthLon) {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    console.log('\n=== 人类图精准计算 (修正版) ===');
    console.log(`出生日期: ${birthDate.toISOString()}`);
    console.log(`出生地点: 纬度 ${birthLat}°, 经度 ${birthLon}°`);

    // 计算出生时的儒略日
    const birthJD = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60 + birthDate.getUTCSeconds() / 3600
    );

    console.log(`\n正在计算设计日期...`);
    // 计算设计日期（太阳退后88度）
    const designResult = await calculateDesignDate(swe, birthDate);
    const designJD = designResult.julianDay;

    console.log(`\n出生儒略日: ${birthJD.toFixed(5)}`);
    console.log(`设计儒略日: ${designJD.toFixed(5)}`);
    console.log(`实际相差: ${(birthJD - designJD).toFixed(2)} 天`);

    // 计算个性端（出生时刻）
    const personality = await calculatePlanets(swe, birthJD, '个性端 (Personality)');

    // 计算设计端（设计时刻）
    const design = await calculatePlanets(swe, designJD, '设计端 (Design)');

    // 汇总激活的闸门
    console.log('\n=== 激活的闸门汇总 ===');
    const allActivations = [...Object.values(personality), ...Object.values(design)];
    const uniqueGates = [...new Set(allActivations.map((a) => a.gate))].sort((a, b) => a - b);
    console.log(`共激活 ${uniqueGates.length} 个闸门:`);
    console.log(uniqueGates.join(', '));

    console.log(`\n✅ 计算完成！`);

    return {
      personality,
      design,
      birthDate: birthDate.toISOString(),
      designDate: designResult.date.toISOString(),
      location: { lat: birthLat, lon: birthLon },
      activatedGates: uniqueGates,
      metadata: {
        calculatedAt: new Date().toISOString(),
        swissEphVersion: swe.version(),
        method: 'Sun-88-degrees',
      },
    };
  } finally {
    swe.close();
  }
}

// 测试
async function runTest() {
  console.log('🧪 人类图精准计算测试（修正版）\n');
  console.log('=' .repeat(60));

  // 测试案例: 1990-01-01 12:00 UTC, 北京
  console.log('\n📋 测试案例: 1990-01-01 12:00 UTC, 北京\n');
  const test1 = new Date('1990-01-01T12:00:00Z');
  const chart1 = await calculateHumanDesignChart(test1, 39.9, 116.4);

  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 测试完成！');

  return chart1;
}

// 运行测试
runTest().catch(console.error);

export { calculateHumanDesignChart };
