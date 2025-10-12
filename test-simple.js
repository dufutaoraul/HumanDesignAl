/**
 * 简单的人类图计算测试 (JavaScript版本)
 */

// 人类图核心常量
const HD_OFFSET_TO_ZODIAC = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

// 闸门映射表
const gateMap = [
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
  const gate = gateMap[gateIndex];

  return {
    gate,
    line: lineIndex,
    longitude,
    planet: planetName,
  };
}

/**
 * 测试人类图计算
 */
async function testHumanDesign() {
  console.log('=== 人类图计算测试 ===\n');

  // 模拟行星位置数据（这些数据通常来自 swisseph）
  const testData = {
    Sun: 280.5,
    Earth: 100.5,  // 太阳对面
    Moon: 45.3,
    NorthNode: 90.0,
    SouthNode: 270.0,  // 北交点对面
    Mercury: 295.2,
    Venus: 310.8,
    Mars: 15.6,
    Jupiter: 180.4,
    Saturn: 240.1,
    Uranus: 330.7,
    Neptune: 220.5,
    Pluto: 195.3,
  };

  console.log('--- 个性端 (Personality) ---');
  const personality = {};
  for (const [planet, longitude] of Object.entries(testData)) {
    const activation = longitudeToActivation(longitude, planet);
    personality[planet.toLowerCase()] = activation;
    console.log(`${planet.padEnd(12)}: 闸门 ${String(activation.gate).padStart(2)}, 爻 ${activation.line} (${longitude.toFixed(2)}°)`);
  }

  // 汇总激活的闸门
  console.log('\n=== 激活的闸门汇总 ===');
  const gates = Object.values(personality).map(a => a.gate);
  const uniqueGates = [...new Set(gates)].sort((a, b) => a - b);
  console.log(`共激活 ${uniqueGates.length} 个闸门:`);
  console.log(uniqueGates.join(', '));

  return personality;
}

// 运行测试
testHumanDesign().then(() => {
  console.log('\n✅ 测试完成！');
}).catch(console.error);
