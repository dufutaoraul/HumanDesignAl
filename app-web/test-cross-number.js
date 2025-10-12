/**
 * 测试轮回交叉编号是否正确
 * 测试数据：1983-10-15 应该显示玛雅3而不是玛雅4
 */

const { analyzeBodygraph } = require('./lib/bodygraph-analyzer');

// 模拟 1983-10-15 的星盘数据
// 根据之前的计算，个性太阳在32门
const testChartData = {
  personality: {
    Sun: { gate: 32, line: 2 },
    Earth: { gate: 42, line: 2 },
    Moon: { gate: 50, line: 1 },
    NorthNode: { gate: 28, line: 1 },
    SouthNode: { gate: 27, line: 1 },
    Mercury: { gate: 28, line: 5 },
    Venus: { gate: 43, line: 5 },
    Mars: { gate: 14, line: 3 },
    Jupiter: { gate: 3, line: 6 },
    Saturn: { gate: 29, line: 2 },
    Uranus: { gate: 60, line: 5 },
    Neptune: { gate: 55, line: 2 },
    Pluto: { gate: 53, line: 2 }
  },
  design: {
    Sun: { gate: 62, line: 2 },
    Earth: { gate: 61, line: 2 },
    Moon: { gate: 31, line: 6 },
    NorthNode: { gate: 28, line: 1 },
    SouthNode: { gate: 27, line: 1 },
    Mercury: { gate: 56, line: 1 },
    Venus: { gate: 31, line: 1 },
    Mars: { gate: 2, line: 1 },
    Jupiter: { gate: 3, line: 6 },
    Saturn: { gate: 42, line: 1 },
    Uranus: { gate: 60, line: 5 },
    Neptune: { gate: 55, line: 2 },
    Pluto: { gate: 53, line: 2 }
  }
};

console.log('测试轮回交叉编号计算...\n');
console.log('测试数据: 1983-10-15');
console.log('个性太阳: Gate 32 (黑太阳)');
console.log('预期结果: 玛雅 3\n');

const analysis = analyzeBodygraph(testChartData);

console.log('计算结果:');
console.log('轮回交叉:', analysis.incarnationCross.full);
console.log('编号:', analysis.incarnationCross.number);
console.log('中文名:', analysis.incarnationCross.nameCN);
console.log('英文名:', analysis.incarnationCross.nameEN);
console.log('Key:', analysis.incarnationCross.key);

if (analysis.incarnationCross.number === 3) {
  console.log('\n✅ 测试通过！编号正确为 3');
} else {
  console.log(`\n❌ 测试失败！编号为 ${analysis.incarnationCross.number}，应该是 3`);
}
