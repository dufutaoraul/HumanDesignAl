/**
 * 测试地球闸门计算
 * 地球 = 太阳黄道位置 + 180度后对应的闸门
 */

const HD_OFFSET = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

function longitudeToActivation(longitude, planetName) {
  let x = longitude - HD_OFFSET;
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

console.log('=== 地球闸门计算测试 ===\n');

// 案例1: 1990-01-01
console.log('案例1 (1990-01-01):');
const sun1Lon = 280.8143;
const earth1Lon = (sun1Lon + 180) % 360;
console.log(`太阳黄道: ${sun1Lon}°`);
console.log(`地球黄道: ${earth1Lon.toFixed(4)}° (太阳+180°)`);

const sun1 = longitudeToActivation(sun1Lon, 'Sun');
const earth1 = longitudeToActivation(earth1Lon, 'Earth');

console.log(`太阳: 闸门 ${sun1.gate}.${sun1.line}`);
console.log(`地球: 闸门 ${earth1.gate}.${earth1.line} (应该是39.2)`);

console.log('\n---\n');

// 案例2: 1983-10-15
// 个性太阳是48.1，我需要反推黄道度数
console.log('案例2 (1983-10-15):');
console.log('个性太阳应该是48.1，让我们找一个能得到这个结果的黄道度数...\n');

// 闸门48在映射表中的索引
const gate48Index = GATE_MAP.indexOf(48);
console.log(`闸门48在映射表的索引: ${gate48Index}`);

// 计算闸门48.1对应的黄道度数范围
const gate48StartDegree = HD_OFFSET + gate48Index * DEGREE_PER_GATE;
const line1Offset = 0 * DEGREE_PER_LINE; // 第1爻
const sun2LonApprox = gate48StartDegree + line1Offset + 0.5; // 加0.5度作为中间值

console.log(`闸门48起始度数: ${gate48StartDegree.toFixed(4)}°`);
console.log(`闸门48.1近似黄道: ${sun2LonApprox.toFixed(4)}°`);

const sun2 = longitudeToActivation(sun2LonApprox, 'Sun');
const earth2Lon = (sun2LonApprox + 180) % 360;
const earth2 = longitudeToActivation(earth2Lon, 'Earth');

console.log(`\n验证计算:`);
console.log(`太阳: 闸门 ${sun2.gate}.${sun2.line} (应该是48.1)`);
console.log(`地球: 闸门 ${earth2.gate}.${earth2.line} (应该是40.1)`);
console.log(`地球黄道: ${earth2Lon.toFixed(4)}°`);
