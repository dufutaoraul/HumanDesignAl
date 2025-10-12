// 测试新的 True Node 公式
const { calculateHumanDesignChart } = require('./app-web/lib/astronomy-calculator.js');

// 刘勇：1970-12-19 14:30 北京时间 = 1970-12-19 06:30 UTC
const birthDate = new Date(Date.UTC(1970, 11, 19, 6, 30, 0));

console.log('\n========================================');
console.log('测试新的 True Node 公式');
console.log('刘勇 - 1970-12-19 14:30 北京时间');
console.log('========================================\n');

const chart = calculateHumanDesignChart(birthDate, 28.8853, 105.4305);

console.log('个性端 (Personality):');
console.log(`  北交点: ${chart.personality.NorthNode.gate}.${chart.personality.NorthNode.line} ${chart.personality.NorthNode.gate === 30 && chart.personality.NorthNode.line === 1 ? '✓' : '✗ 期望 30.1'}`);
console.log(`  南交点: ${chart.personality.SouthNode.gate}.${chart.personality.SouthNode.line} ${chart.personality.SouthNode.gate === 29 && chart.personality.SouthNode.line === 1 ? '✓' : '✗ 期望 29.1'}`);
console.log(`  北交点经度: ${chart.personality.NorthNode.longitude.toFixed(2)}°`);

console.log('\n设计端 (Design):');
console.log(`  北交点: ${chart.design.NorthNode.gate}.${chart.design.NorthNode.line} ${chart.design.NorthNode.gate === 55 && chart.design.NorthNode.line === 3 ? '✓' : '✗ 期望 55.3'}`);
console.log(`  南交点: ${chart.design.SouthNode.gate}.${chart.design.SouthNode.line} ${chart.design.SouthNode.gate === 59 && chart.design.SouthNode.line === 3 ? '✓' : '✗ 期望 59.3'}`);
console.log(`  北交点经度: ${chart.design.NorthNode.longitude.toFixed(2)}°`);

console.log('\n========================================');
const allCorrect =
  chart.personality.NorthNode.gate === 30 && chart.personality.NorthNode.line === 1 &&
  chart.personality.SouthNode.gate === 29 && chart.personality.SouthNode.line === 1 &&
  chart.design.NorthNode.gate === 55 && chart.design.NorthNode.line === 3 &&
  chart.design.SouthNode.gate === 59 && chart.design.SouthNode.line === 3;

if (allCorrect) {
  console.log('✅ 所有南北交点数据正确！');
} else {
  console.log('❌ 部分数据不正确，需要调整公式');
}
console.log('========================================\n');
