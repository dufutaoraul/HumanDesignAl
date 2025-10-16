/**
 * 人类图完整计算 - 从出生日期到26个闸门
 * 使用真实的天文计算
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const swisseph = require('swisseph-wasm');

// 人类图核心常量
const HD_OFFSET_TO_ZODIAC = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

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
    longitude: longitude.toFixed(4),
    planet: planetName,
  };
}

/**
 * 将日期转换为儒略日
 */
function dateToJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // 使用 swisseph 的内置函数
  const jd = swisseph.julday(year, month, day, hour + minute / 60 + second / 3600, swisseph.SE_GREG_CAL);
  return jd;
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
 * 计算13个行星的位置
 */
function calculatePlanets(julianDay, side) {
  const planets = [
    { id: swisseph.SE_SUN, name: 'Sun' },
    { id: swisseph.SE_EARTH, name: 'Earth' },
    { id: swisseph.SE_MOON, name: 'Moon' },
    { id: swisseph.SE_TRUE_NODE, name: 'NorthNode' },
    { id: swisseph.SE_MERCURY, name: 'Mercury' },
    { id: swisseph.SE_VENUS, name: 'Venus' },
    { id: swisseph.SE_MARS, name: 'Mars' },
    { id: swisseph.SE_JUPITER, name: 'Jupiter' },
    { id: swisseph.SE_SATURN, name: 'Saturn' },
    { id: swisseph.SE_URANUS, name: 'Uranus' },
    { id: swisseph.SE_NEPTUNE, name: 'Neptune' },
    { id: swisseph.SE_PLUTO, name: 'Pluto' },
  ];

  const activations = {};
  console.log(`\n--- ${side} ---`);

  for (const { id, name } of planets) {
    try {
      const result = swisseph.calc_ut(julianDay, id, swisseph.SEFLG_SWIEPH);

      if (result.error) {
        console.error(`${name} 计算错误:`, result.error);
        continue;
      }

      const longitude = result.data[0]; // 黄道经度
      const activation = longitudeToActivation(longitude, name);

      console.log(
        `${name.padEnd(12)}: 闸门 ${String(activation.gate).padStart(2)}.${activation.line}  (${activation.longitude}°)`
      );

      activations[name] = activation;

      // South Node 是 North Node 的对面（+180°）
      if (id === swisseph.SE_TRUE_NODE) {
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
function calculateHumanDesignChart(birthDate, birthLat, birthLon) {
  console.log('=== 人类图计算 ===');
  console.log(`出生日期: ${birthDate.toISOString()}`);
  console.log(`出生地点: 纬度 ${birthLat}°, 经度 ${birthLon}°`);

  // 计算设计日期
  const designDate = calculateDesignDate(birthDate);
  console.log(`设计日期: ${designDate.toISOString()}`);

  // 转换为儒略日
  const birthJD = dateToJulianDay(birthDate);
  const designJD = dateToJulianDay(designDate);

  console.log(`\n出生儒略日: ${birthJD.toFixed(5)}`);
  console.log(`设计儒略日: ${designJD.toFixed(5)}`);

  // 计算个性端（出生时）
  const personality = calculatePlanets(birthJD, '个性端 (Personality)');

  // 计算设计端（设计日）
  const design = calculatePlanets(designJD, '设计端 (Design)');

  // 汇总所有激活的闸门
  console.log('\n=== 激活的闸门汇总 ===');
  const allActivations = [...Object.values(personality), ...Object.values(design)];
  const uniqueGates = [...new Set(allActivations.map((a) => a.gate))].sort((a, b) => a - b);
  console.log(`共激活 ${uniqueGates.length} 个闸门:`);
  console.log(uniqueGates.join(', '));

  // 返回完整数据
  return {
    personality,
    design,
    birthDate: birthDate.toISOString(),
    designDate: designDate.toISOString(),
    location: { lat: birthLat, lon: birthLon },
    activatedGates: uniqueGates,
  };
}

// ==================== 测试 ====================

// 测试案例1: 1990年1月1日 12:00 UTC，北京
console.log('\n🧪 测试案例 1: 1990-01-01 12:00 UTC, 北京\n');
const test1 = new Date('1990-01-01T12:00:00Z');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chart1 = calculateHumanDesignChart(test1, 39.9, 116.4);

// 导出函数供外部使用
module.exports = {
  calculateHumanDesignChart,
  longitudeToActivation,
};
