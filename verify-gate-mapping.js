/**
 * 验证闸门映射是否正确
 * 从专业软件的输出反推黄道度数
 */

const HD_OFFSET = 3.875;
const DEGREE_PER_GATE = 5.625;

// 当前使用的映射表
const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

// 专业软件的数据（1990-01-01 12:00 UTC）
const professionalData = {
  '个性太阳': { gate: 48, line: 4, expectedLongitude: 280.8143 },
  '个性地球': { gate: 21, line: 4 },
  '个性月亮': { gate: 5, line: 6 },
  '个性北交点': { gate: 30, line: 1 },
  '个性南交点': { gate: 29, line: 1 },
  '个性水星': { gate: 6, line: 4 },
  '个性金星': { gate: 14, line: 3 },
  '个性火星': { gate: 48, line: 2 },
  '个性木星': { gate: 39, line: 1 },
  '个性土星': { gate: 58, line: 5 },
  '个性天王星': { gate: 10, line: 4 },
  '个性海王星': { gate: 38, line: 1 },
  '个性冥王星': { gate: 1, line: 1 },
};

// 从闸门号反推黄道度数
function gateToLongitude(gate, line) {
  // 找到闸门在映射表中的索引
  const gateIndex = GATE_MAP.indexOf(gate);

  if (gateIndex === -1) {
    console.error(`闸门 ${gate} 不在映射表中！`);
    return null;
  }

  // 计算该闸门对应的黄道起始度数
  const startDegree = HD_OFFSET + gateIndex * DEGREE_PER_GATE;

  // 加上爻线对应的度数
  const lineDegree = (line - 1) * (DEGREE_PER_GATE / 6);

  let longitude = startDegree + lineDegree;

  // 确保在0-360范围内
  while (longitude >= 360) longitude -= 360;
  while (longitude < 0) longitude += 360;

  return longitude;
}

// 从黄道度数计算闸门
function longitudeToGate(longitude) {
  let x = longitude - HD_OFFSET;
  if (x < 0) x += 360;

  const gateIndex = Math.floor(x / DEGREE_PER_GATE);
  const lineIndex = Math.floor((x % DEGREE_PER_GATE) / (DEGREE_PER_GATE / 6)) + 1;
  const gate = GATE_MAP[gateIndex];

  return { gate, line: lineIndex, gateIndex };
}

console.log('=== 验证闸门映射 ===\n');

// 验证专业软件的太阳数据
console.log('1. 专业软件: 个性太阳 = 闸门 48.4');
console.log(`   我的计算: 太阳黄道 = 280.8143°`);
console.log(`   我算出的闸门: ${JSON.stringify(longitudeToGate(280.8143))}`);
console.log(`   期望: 闸门 48.4\n`);

// 反推：如果专业软件说是闸门48.4，那对应的黄道度数应该是多少？
const expectedLon = gateToLongitude(48, 4);
console.log(`2. 反推验证: 闸门 48.4 对应的黄道度数:`);
console.log(`   计算结果: ${expectedLon?.toFixed(4)}°`);
console.log(`   实际太阳: 280.8143°`);
console.log(`   差值: ${(280.8143 - (expectedLon || 0)).toFixed(4)}°\n`);

// 看看280.8143度应该对应哪个索引
let x = 280.8143 - HD_OFFSET;
if (x < 0) x += 360;
const correctIndex = Math.floor(x / DEGREE_PER_GATE);
console.log(`3. 280.8143° 应该对应的闸门索引: ${correctIndex}`);
console.log(`   当前映射表[${correctIndex}] = ${GATE_MAP[correctIndex]}`);
console.log(`   专业软件显示 = 48\n`);

// 检查是否需要不同的映射表
console.log(`4. 让我们尝试找到正确的映射关系：`);
console.log(`   如果 280.8143° 应该是闸门48，那么：`);

// 尝试另一种可能：闸门是按1-64顺序排列的
console.log(`   (暂不测试顺序映射)`);

// 或者映射表的起始位置不同？
console.log(`\n5. 检查闸门48在当前映射表中的位置:`);
const gate48Index = GATE_MAP.indexOf(48);
console.log(`   索引: ${gate48Index}`);
console.log(`   对应黄道: ${(HD_OFFSET + gate48Index * DEGREE_PER_GATE).toFixed(4)}°`);
