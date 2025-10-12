/**
 * 人类图闸门对宫映射表
 * 从 SharpAstrology.HumanDesign 的 HarmonicGates 提取
 * 用于计算地球位置：地球闸门 = 太阳闸门的对宫闸门（爻线相同）
 */

// 对宫闸门映射表（主要对宫关系）
export const HARMONIC_GATES = {
  1: 8,    // 闸门1的对宫是闸门8
  2: 14,
  3: 60,
  4: 63,
  5: 15,
  6: 59,
  7: 31,
  8: 1,
  9: 52,
  10: [20, 34, 57], // 闸门10有多个和谐闸门，主对宫是57
  11: 56,
  12: 22,
  13: 33,
  14: 2,
  15: 5,
  16: 48,
  17: 62,
  18: 58,
  19: 49,
  20: [10, 34, 57], // 主对宫是34
  21: 45,
  22: 12,
  23: 43,
  24: 61,
  25: 51,
  26: 44,
  27: 50,
  28: 38,
  29: 46,
  30: 41,
  31: 7,
  32: 54,
  33: 13,
  34: [10, 20, 57], // 主对宫是20
  35: 36,
  36: 35,
  37: 40,
  38: 28,
  39: 55,
  40: 37,
  41: 30,
  42: 53,
  43: 23,
  44: 26,
  45: 21,
  46: 29,
  47: 64,
  48: 16,
  49: 19,
  50: 27,
  51: 25,
  52: 9,
  53: 42,
  54: 32,
  55: 39,
  56: 11,
  57: [10, 20, 34], // 主对宫是10
  58: 18,
  59: 6,
  60: 3,
  61: 24,
  62: 17,
  63: 4,
  64: 47,
};

/**
 * 获取闸门的对宫闸门
 * @param {number} gate - 闸门号 (1-64)
 * @returns {number} 对宫闸门号
 */
export function getHarmonicGate(gate) {
  const harmonic = HARMONIC_GATES[gate];

  // 如果是数组，取第一个作为主对宫
  if (Array.isArray(harmonic)) {
    return harmonic[harmonic.length - 1]; // 取最后一个作为主对宫
  }

  return harmonic;
}

/**
 * 从太阳激活计算地球激活
 * @param {Object} sunActivation - 太阳的激活信息 {gate, line, longitude, planet}
 * @returns {Object} 地球的激活信息
 */
export function calculateEarthFromSun(sunActivation) {
  const earthGate = getHarmonicGate(sunActivation.gate);
  const earthLine = sunActivation.line; // 爻线相同

  // 地球黄道位置是太阳的对面（+180度）
  let earthLongitude = (sunActivation.longitude + 180) % 360;

  return {
    gate: earthGate,
    line: earthLine,
    longitude: parseFloat(earthLongitude.toFixed(4)),
    planet: 'Earth',
  };
}

// 测试
console.log('=== 对宫闸门映射测试 ===\n');

// 测试案例1：1990-01-01的太阳
const sun1 = { gate: 38, line: 2, longitude: 280.8143, planet: 'Sun' };
const earth1 = calculateEarthFromSun(sun1);
console.log('案例1 (1990-01-01):');
console.log(`太阳: 闸门${sun1.gate}.${sun1.line}`);
console.log(`地球: 闸门${earth1.gate}.${earth1.line} (应该是39.2)`);
console.log(`对宫验证: 闸门38的对宫 = ${getHarmonicGate(38)}\n`);

// 测试案例2：1983-10-15的太阳
const sun2 = { gate: 48, line: 1, longitude: 0, planet: 'Sun' }; // 假设值
const earth2 = calculateEarthFromSun(sun2);
console.log('案例2 (1983-10-15):');
console.log(`太阳: 闸门${sun2.gate}.${sun2.line}`);
console.log(`地球: 闸门${earth2.gate}.${earth2.line} (应该是40.1)`);
console.log(`对宫验证: 闸门48的对宫 = ${getHarmonicGate(48)}`);
