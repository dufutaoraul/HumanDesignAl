/**
 * 测试2017-01-20案例的箭头计算
 *
 * 案例数据：
 * 个性端(BLACK):
 * - Sun: 54.3
 * - Earth: 53.3
 * - Moon: 19.6
 * - Jupiter: 32.3
 *
 * 设计端(RED):
 * - Sun: 27.3
 * - Earth: 27.1
 * - Moon: 40.1
 * - Neptune: 37.4
 *
 * 预期箭头：
 * - Neptune 37.4 → ▲ (通过Moon在40.1聚合得到)
 * - Earth 27.1 → ▼ (直接规则)
 * - Jupiter 32.3 → ▼ (直接规则)
 * - Pluto 54.1 → ▲ (直接规则)
 * - Pluto 54.3 → ▲ (直接规则)
 * - Sun 27.1 → ▲ (直接规则)
 */

const { calculateArrows, formatArrowSymbol, formatArrowName, FixingState } = require('./arrow-calculator.js');

// 2017-01-20案例数据
const personalityActivations = {
  Sun: { gate: 54, line: 3 },
  Earth: { gate: 53, line: 3 },
  Moon: { gate: 19, line: 6 },
  Mercury: { gate: 61, line: 5 },
  Venus: { gate: 38, line: 1 },
  Mars: { gate: 19, line: 1 },
  Jupiter: { gate: 32, line: 3 },
  Saturn: { gate: 11, line: 3 },
  Uranus: { gate: 21, line: 4 },
  Neptune: { gate: 37, line: 6 },
  Pluto: { gate: 54, line: 3 }
};

const designActivations = {
  Sun: { gate: 27, line: 3 },
  Earth: { gate: 27, line: 1 },
  Moon: { gate: 40, line: 1 },
  Mercury: { gate: 27, line: 3 },
  Venus: { gate: 3, line: 3 },
  Mars: { gate: 27, line: 3 },
  Jupiter: { gate: 42, line: 6 },
  Saturn: { gate: 61, line: 6 },
  Uranus: { gate: 21, line: 4 },
  Neptune: { gate: 37, line: 4 },
  Pluto: { gate: 54, line: 1 }
};

console.log('=== 2017-01-20 箭头计算测试 ===\n');

const result = calculateArrows(personalityActivations, designActivations);

console.log('【个性端 (BLACK)】');
for (const [planet, state] of Object.entries(result.personality)) {
  const activation = personalityActivations[planet];
  const symbol = formatArrowSymbol(state.fixingState);
  const name = formatArrowName(state.fixingState);
  const crossEnd = state.changedByComparer ? ' (跨端聚合)' : '';
  console.log(`  ${planet} ${activation.gate}.${activation.line} → ${symbol || '无'} ${name}${crossEnd}`);
}

console.log('\n【设计端 (RED)】');
for (const [planet, state] of Object.entries(result.design)) {
  const activation = designActivations[planet];
  const symbol = formatArrowSymbol(state.fixingState);
  const name = formatArrowName(state.fixingState);
  const crossEnd = state.changedByComparer ? ' (跨端聚合)' : '';
  console.log(`  ${planet} ${activation.gate}.${activation.line} → ${symbol || '无'} ${name}${crossEnd}`);
}

console.log('\n=== 关键箭头验证 ===');

// 验证关键箭头
const tests = [
  {
    name: 'Neptune 37.4 (设计端)',
    planet: 'Neptune',
    side: 'design',
    expected: FixingState.Exalted,
    explanation: '通过Moon在40.1聚合: Moon + Gate37 + Line4 = Exalted'
  },
  {
    name: 'Earth 27.1 (设计端)',
    planet: 'Earth',
    side: 'design',
    expected: FixingState.Detriment,
    explanation: '直接规则: Earth + Gate27 + Line1 = Detriment'
  },
  {
    name: 'Jupiter 32.3 (个性端)',
    planet: 'Jupiter',
    side: 'personality',
    expected: FixingState.Detriment,
    explanation: '直接规则: Jupiter + Gate32 + Line3 = Detriment'
  },
  {
    name: 'Pluto 54.1 (设计端)',
    planet: 'Pluto',
    side: 'design',
    expected: FixingState.Exalted,
    explanation: '直接规则: Pluto + Gate54 + Line1 = Exalted'
  },
  {
    name: 'Pluto 54.3 (个性端)',
    planet: 'Pluto',
    side: 'personality',
    expected: FixingState.Exalted,
    explanation: '直接规则: Pluto + Gate54 + Line3 = Exalted'
  },
  {
    name: 'Sun 27.1 (设计端) - 等等,应该是27.3',
    planet: 'Sun',
    side: 'design',
    expected: FixingState.Exalted,
    explanation: '直接规则: Sun + Gate27 + Line3 = ? (需要检查规则表)'
  }
];

let passCount = 0;
let failCount = 0;

for (const test of tests) {
  const actual = test.side === 'personality'
    ? result.personality[test.planet].fixingState
    : result.design[test.planet].fixingState;

  const passed = actual === test.expected;
  passCount += passed ? 1 : 0;
  failCount += passed ? 0 : 1;

  const status = passed ? '✓' : '✗';
  const actualName = formatArrowName(actual);
  const expectedName = formatArrowName(test.expected);

  console.log(`\n${status} ${test.name}`);
  console.log(`  预期: ${expectedName}  实际: ${actualName}`);
  console.log(`  说明: ${test.explanation}`);
}

console.log(`\n=== 测试结果: ${passCount} 通过, ${failCount} 失败 ===`);

// Neptune 37.4的详细聚合过程
console.log('\n=== Neptune 37.4 聚合过程详解 ===');

const { getFixingState } = require('./fixing-rules-complete.js');
const { getHarmonicGates } = require('./harmonic-gates.js');

const neptune = designActivations.Neptune;
console.log(`1. Neptune在设计端: ${neptune.gate}.${neptune.line}`);

// 直接查询
const directState = getFixingState('Neptune', neptune.gate, neptune.line);
console.log(`2. 直接规则表查询: Neptune + Gate${neptune.gate} + Line${neptune.line} = ${formatArrowName(directState)}`);

// HarmonicGates
const harmonicGates = getHarmonicGates(neptune.gate);
console.log(`3. Gate${neptune.gate}的HarmonicGates: [${harmonicGates.join(', ')}]`);

// 查找谁激活了HarmonicGate 40
console.log(`4. 查找谁激活了Gate40:`);
for (const [planet, activation] of Object.entries(designActivations)) {
  if (activation.gate === 40) {
    console.log(`   - ${planet}在${activation.gate}.${activation.line}`);

    // 查询该行星对Neptune 37.4的规则
    const aggregatedState = getFixingState(planet, neptune.gate, neptune.line);
    console.log(`   - 聚合规则: ${planet} + Gate${neptune.gate} + Line${neptune.line} = ${formatArrowName(aggregatedState)} ${formatArrowSymbol(aggregatedState)}`);
  }
}

console.log(`5. 最终结果: Neptune 37.4 = ${formatArrowSymbol(result.design.Neptune.fixingState)} ${formatArrowName(result.design.Neptune.fixingState)}`);
