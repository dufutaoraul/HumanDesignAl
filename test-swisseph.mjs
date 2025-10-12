/**
 * 测试 swisseph-wasm 是否能正常工作
 */

import SwissEph from 'swisseph-wasm';

console.log('开始测试 swisseph-wasm...\n');

async function test() {
  console.log('1. 创建 SwissEph 实例...');
  const swe = new SwissEph();

  console.log('2. 初始化 SwissEph...');
  await swe.initSwissEph();

  console.log('3. 初始化成功！');
  console.log(`   版本: ${swe.version()}\n`);

  console.log('4. 计算儒略日...');
  const jd = swe.julday(2023, 6, 15, 12.0);
  console.log(`   儒略日: ${jd}\n`);

  console.log('5. 计算太阳位置...');
  const sunPos = swe.calc_ut(jd, swe.SE_SUN, swe.SEFLG_SWIEPH);
  console.log(`   太阳经度: ${sunPos[0].toFixed(4)}°\n`);

  console.log('6. 关闭 SwissEph...');
  swe.close();

  console.log('\n✅ 测试成功！');
}

test().catch(error => {
  console.error('\n❌ 测试失败:', error);
  process.exit(1);
});
