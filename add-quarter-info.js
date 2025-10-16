/**
 * 为轮回交叉添加等分（quarter）信息
 *
 * 64个闸门分为4个等分，每个等分16个闸门：
 * - 第一等分：闸门 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24
 * - 第二等分：闸门 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33
 * - 第三等分：闸门 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44
 * - 第四等分：闸门 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19
 *
 * 轮回交叉编号规则：
 * - 右角度交叉：黑太阳在第几等分，数字就是几（1-4）
 * - 左角度交叉：第一、三等分→数字1，第二、四等分→数字2
 * - 并列交叉：无数字
 */

const fs = require('fs');
const path = require('path');

// 四个等分的闸门
const quarters = {
  1: [13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24],
  2: [2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33],
  3: [7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44],
  4: [1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19]
};

// 获取闸门所在的等分
function getQuarter(gate) {
  for (let q = 1; q <= 4; q++) {
    if (quarters[q].includes(gate)) {
      return q;
    }
  }
  return null;
}

// 计算轮回交叉的编号（基于等分）
function calculateNumberByQuarter(blackSunGate, type) {
  const quarter = getQuarter(blackSunGate);
  if (!quarter) return null;

  if (type === '右角度') {
    // 右角度：第几等分就是几
    return quarter;
  } else if (type === '左角度') {
    // 左角度：第一、三等分→1，第二、四等分→2
    return (quarter === 1 || quarter === 3) ? 1 : 2;
  } else {
    // 并列交叉：无编号
    return null;
  }
}

// 加载数据库
const dbPath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = require(dbPath);

console.log('开始为轮回交叉添加等分信息...\n');

// 验证等分定义（确保所有64个闸门都被分配）
const allGates = new Set();
for (let q = 1; q <= 4; q++) {
  quarters[q].forEach(gate => allGates.add(gate));
}
console.log(`等分定义验证: 共${allGates.size}个闸门 (应该是64个)`);
if (allGates.size !== 64) {
  console.error('⚠️ 警告: 等分定义不完整!');
}

let updatedCount = 0;
let correctedCount = 0;

crosses.forEach(cross => {
  const blackSunGate = cross.gates.black_sun;
  const quarter = getQuarter(blackSunGate);
  const calculatedNumber = calculateNumberByQuarter(blackSunGate, cross.type);

  // 添加等分字段
  cross.quarter = quarter;

  // 如果数据库中的number与计算出的不一致，则更新
  if (cross.number !== calculatedNumber && cross.type !== '并列交叉') {
    if (cross.number !== null && cross.number !== undefined) {
      console.log(`修正编号: ${cross.chinese_name} (${cross.key})`);
      console.log(`  原编号: ${cross.number}, 计算编号: ${calculatedNumber}, 黑太阳: ${blackSunGate}, 等分: ${quarter}`);
      correctedCount++;
    }
    cross.number = calculatedNumber;
  }

  updatedCount++;
});

console.log(`\n总共为 ${updatedCount} 个轮回交叉添加了等分信息`);
console.log(`修正了 ${correctedCount} 个轮回交叉的编号`);

// 保存
fs.writeFileSync(dbPath, JSON.stringify(crosses, null, 2), 'utf-8');
console.log(`\n已保存到: ${dbPath}`);

// 验证关键数据
console.log('\n验证关键数据:');
const testCases = [
  { key: '32-42-62-61', expectedNumber: 3, expectedQuarter: 3, name: '玛雅' },
  { key: '13-7-1-2', expectedNumber: 1, expectedQuarter: 1, name: '方向（人面狮身）' },
  { key: '15-10-25-46', expectedNumber: 2, expectedQuarter: 2, name: '爱的化身' },
];

testCases.forEach(test => {
  const found = crosses.find(c => c.key === test.key);
  if (found) {
    const pass = found.number === test.expectedNumber && found.quarter === test.expectedQuarter;
    console.log(`${pass ? '✓' : '✗'} ${found.chinese_name}`);
    console.log(`  编号: ${found.number} (期望: ${test.expectedNumber}), 等分: ${found.quarter} (期望: ${test.expectedQuarter})`);
  } else {
    console.log(`✗ 未找到: ${test.name} (${test.key})`);
  }
});
