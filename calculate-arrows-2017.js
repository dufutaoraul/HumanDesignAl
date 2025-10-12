/**
 * 计算2017-01-20和1983-10-15的箭头符号
 */

// 2017-01-20的数据
const data2017 = {
  design: {
    Earth: { gate: 27, line: 1 },
    Moon: { gate: 40, line: 1 },
    Neptune: { gate: 37, line: 4 },
    Pluto: { gate: 54, line: 1 },
  },
  personality: {
    Jupiter: { gate: 32, line: 3 },
    Pluto: { gate: 54, line: 3 },
  }
};

// 1983-10-15的数据
const data1983 = {
  personality: {
    Sun: { gate: 32, line: 1 },
    Earth: { gate: 42, line: 1 },
    Moon: { gate: 41, line: 5 },
    NorthNode: { gate: 45, line: 1 },
    Mercury: { gate: 48, line: 1 },
  }
};

// 规则表（从SharpAstrology提取）
const fixingRules = {
  Earth: {
    '27-1': 'Detriment',  // Line 121
    '42-1': 'None',       // 没有规则
  },
  Moon: {
    '40-1': 'Detriment',  // Line 151
    '41-5': 'None',       // 没有规则
  },
  Neptune: {
    '37-4': 'None',       // 没有规则 -> 需要检查
  },
  Pluto: {
    '54-1': 'Exalted',    // Line 302
    '54-3': 'Exalted',    // Line 303
  },
  Jupiter: {
    '32-3': 'Detriment',  // Line 196
    '45-1': 'Exalted',    // Line 214
  },
  Mars: {
    '32-3': 'None',       // 没有找到规则
  },
  Mercury: {
    '48-3': 'Detriment',  // Line 409
  },
  Sun: {
    '32-1': 'Exalted',    // Line 519
  }
};

console.log('=== 2017-01-20 箭头验证 ===\n');

console.log('设计端（红色）：');
console.log(`  地球 27.1 → ${fixingRules.Earth['27-1']} (应该是 ▼)`);
console.log(`  月亮 40.1 → ${fixingRules.Moon['40-1']} (应该是 ▼)`);
console.log(`  海王星 37.4 → ${fixingRules.Neptune['37-4']} (应该是 ▲)`);
console.log(`  冥王星 54.1 → ${fixingRules.Pluto['54-1']} (应该是 ▲)`);

console.log('\n个性端（黑色）：');
console.log(`  木星 32.3 → ${fixingRules.Jupiter['32-3']} (应该是 ▼)`);
console.log(`  冥王星 54.3 → ${fixingRules.Pluto['54-3']} (应该是 ▲)`);

console.log('\n\n=== 1983-10-15 箭头计算 ===\n');

console.log('个性端（黑色）：');
console.log(`  太阳 32.1 → ${fixingRules.Sun['32-1']}`);
console.log(`  地球 42.1 → ${fixingRules.Earth['42-1']}`);
console.log(`  月亮 41.5 → ${fixingRules.Moon['41-5']}`);
console.log(`  北交点 45.1 → ${fixingRules.Jupiter['45-1']}`);
console.log(`  水星 48.1 → 需要查Mercury规则`);

console.log('\n\n=== 问题分析 ===\n');

console.log('2017年对比：');
console.log('  ✅ 地球 27.1 → Detriment ▼ (正确)');
console.log('  ✅ 月亮 40.1 → Detriment ▼ (正确)');
console.log('  ❌ 海王星 37.4 → 没有直接规则，但应该是 ▲');
console.log('  ✅ 冥王星 54.1 → Exalted ▲ (正确)');
console.log('  ✅ 木星 32.3 → Detriment ▼ (正确)');
console.log('  ✅ 冥王星 54.3 → Exalted ▲ (正确)');

console.log('\n可能的原因：');
console.log('1. 海王星 37.4 的规则没有直接匹配');
console.log('2. 可能需要查看HarmonicGates相关逻辑');
console.log('3. 规则表可能有复杂的聚合逻辑 (CalculateState函数)');
