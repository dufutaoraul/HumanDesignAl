/**
 * 测试astronomy-calculator模块
 * 使用1983-10-15 11:40 (UTC+8) 四川泸州的数据
 */

const { calculateHumanDesignChart } = require('./app-web/lib/astronomy-calculator.js');

// 1983-10-15 11:40 UTC+8 = 1983-10-15 03:40 UTC
const birthDate = new Date('1983-10-15T03:40:00Z');
const latitude = 28.8717;
const longitude = 105.4417;

console.log('=== 测试数据 ===');
console.log(`出生时间: 1983-10-15 11:40 (北京时间)`);
console.log(`UTC时间: ${birthDate.toISOString()}`);
console.log(`地点: 四川泸州 (${latitude}°N, ${longitude}°E)\n`);

console.log('=== 开始计算 ===\n');

try {
  const result = calculateHumanDesignChart(birthDate, latitude, longitude);

  console.log('【个性端 (Personality - BLACK)】');
  const planets = ['Sun', 'Earth', 'Moon', 'NorthNode', 'SouthNode',
                   'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
                   'Uranus', 'Neptune', 'Pluto'];

  planets.forEach(planet => {
    const p = result.personality[planet];
    if (p) {
      console.log(`  ${planet.padEnd(12)}: 闸门 ${String(p.gate).padStart(2)}.${p.line}  (${p.longitude.toFixed(2)}°)`);
    }
  });

  console.log('\n【设计端 (Design - RED)】');
  planets.forEach(planet => {
    const d = result.design[planet];
    if (d) {
      console.log(`  ${planet.padEnd(12)}: 闸门 ${String(d.gate).padStart(2)}.${d.line}  (${d.longitude.toFixed(2)}°)`);
    }
  });

  console.log('\n✅ 计算成功！');
} catch (error) {
  console.error('\n❌ 计算失败:', error);
  console.error(error.stack);
}
