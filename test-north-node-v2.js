// 测试更精确的北交点计算
const { calculateHumanDesignChart } = require('./app-web/lib/astronomy-calculator.js');

// 刘勇：1970-12-19 14:30 北京时间 = 1970-12-19 06:30 UTC
const birthDate = new Date(Date.UTC(1970, 11, 19, 6, 30, 0));

console.log('\n========================================');
console.log('测试人物：刘勇');
console.log('出生时间：1970-12-19 14:30 北京时间 (06:30 UTC)');
console.log('========================================\n');

const chart = calculateHumanDesignChart(birthDate, 28.8853, 105.4305);

console.log('个性端 (Personality / 黑色右侧):');
console.log(`  北交点: ${chart.personality.NorthNode.gate}.${chart.personality.NorthNode.line}`);
console.log(`  南交点: ${chart.personality.SouthNode.gate}.${chart.personality.SouthNode.line}`);
console.log(`  (期望值: 30.1, 29.1)`);

console.log('\n设计端 (Design / 红色左侧):');
console.log(`  北交点: ${chart.design.NorthNode.gate}.${chart.design.NorthNode.line}`);
console.log(`  南交点: ${chart.design.SouthNode.gate}.${chart.design.SouthNode.line}`);
console.log(`  (期望值: 55.3, 59.3)`);

console.log('\n原始黄道经度:');
console.log(`  个性北交点: ${chart.personality.NorthNode.longitude.toFixed(2)}°`);
console.log(`  设计北交点: ${chart.design.NorthNode.longitude.toFixed(2)}°`);
console.log('========================================\n');
