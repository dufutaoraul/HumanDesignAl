// 测试 swisseph-wasm 库计算 True Node

async function testSwissEph() {
  const { default: SwissEph } = require('swisseph-wasm');

  try {
    const swe = new SwissEph();
    await swe.initSwissEph();

    // 刘勇：1970-12-19 14:30 北京时间 = 1970-12-19 06:30 UTC
    const birthDate = new Date(Date.UTC(1970, 11, 19, 6, 30, 0));

    // 转换为儒略日
    const julianDay = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60 + birthDate.getUTCSeconds() / 3600
    );

    console.log(`\n儒略日: ${julianDay}`);

    // 计算 True Node (Body ID = 11) 和 Mean Node (Body ID = 10)
    const TRUE_NODE = swe.SE_TRUE_NODE || 11;
    const MEAN_NODE = swe.SE_MEAN_NODE || 10;
    const SEFLG_SWIEPH = swe.SEFLG_SWIEPH || 2;

    console.log('\n使用 Swiss Ephemeris 计算 True Node:');
    const trueNodeResult = swe.calc_ut(julianDay, TRUE_NODE, SEFLG_SWIEPH);
    console.log('True Node 黄道经度:', trueNodeResult[0].toFixed(4), '度');

    console.log('\n使用 Swiss Ephemeris 计算 Mean Node:');
    const meanNodeResult = swe.calc_ut(julianDay, MEAN_NODE, SEFLG_SWIEPH);
    console.log('Mean Node 黄道经度:', meanNodeResult[0].toFixed(4), '度');

    console.log('\n差异:', (trueNodeResult[0] - meanNodeResult[0]).toFixed(4), '度');

    // 期望值
    console.log('\n期望值: 324.5° (对应 30.1)');
    console.log('差异:', (trueNodeResult[0] - 324.5).toFixed(4), '度');

    swe.close();

  } catch (error) {
    console.error('错误:', error);
    console.error('错误堆栈:', error.stack);
  }
}

testSwissEph();
