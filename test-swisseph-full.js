// 完整测试 Swiss Ephemeris 计算人类图

const GATE_MAP = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17,
  21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35,
  45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4,
  29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58,
  38, 54, 61, 60
];

const HD_OFFSET_TO_ZODIAC = 58;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

function longitudeToGateLine(longitude) {
  let adjustedLongitude = (longitude + HD_OFFSET_TO_ZODIAC) % 360;
  const gateIndex = Math.floor(adjustedLongitude / DEGREE_PER_GATE);
  const remainderInGate = adjustedLongitude % DEGREE_PER_GATE;
  const line = Math.floor(remainderInGate / DEGREE_PER_LINE) + 1;
  const gate = GATE_MAP[gateIndex];

  return {
    gate,
    line: Math.min(line, 6),
    longitude
  };
}

async function testFullChart() {
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
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60
    );

    console.log('\n========================================');
    console.log('测试人物：刘勇');
    console.log('出生时间：1970-12-19 14:30 北京时间 (06:30 UTC)');
    console.log(`儒略日: ${julianDay}`);
    console.log('========================================\n');

    // 计算个性端（出生时刻）
    const TRUE_NODE = 11;
    const SEFLG_SWIEPH = 2;

    const persNorthNodeLon = swe.calc_ut(julianDay, TRUE_NODE, SEFLG_SWIEPH)[0];
    const persSouthNodeLon = (persNorthNodeLon + 180) % 360;

    const persNorthNode = longitudeToGateLine(persNorthNodeLon);
    const persSouthNode = longitudeToGateLine(persSouthNodeLon);

    console.log('个性端 (Personality / 黑色右侧):');
    console.log(`  北交点: ${persNorthNode.gate}.${persNorthNode.line} (${persNorthNodeLon.toFixed(2)}°)`);
    console.log(`  南交点: ${persSouthNode.gate}.${persSouthNode.line} (${persSouthNodeLon.toFixed(2)}°)`);
    console.log(`  期望值: 30.1, 29.1`);

    // 计算设计端（找到太阳在出生前88度的时间点）
    const SUN = 0;
    const birthSunLon = swe.calc_ut(julianDay, SUN, SEFLG_SWIEPH)[0];
    const targetSunLon = (birthSunLon - 88 + 360) % 360;

    // 二分查找设计时间
    let minJD = julianDay - 95;
    let maxJD = julianDay - 80;
    let designJD = (minJD + maxJD) / 2;

    for (let i = 0; i < 30; i++) {
      designJD = (minJD + maxJD) / 2;
      const sunLon = swe.calc_ut(designJD, SUN, SEFLG_SWIEPH)[0];

      let diff = targetSunLon - sunLon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      if (Math.abs(diff) < 0.01) break;

      if (diff > 0) {
        minJD = designJD;
      } else {
        maxJD = designJD;
      }
    }

    const desNorthNodeLon = swe.calc_ut(designJD, TRUE_NODE, SEFLG_SWIEPH)[0];
    const desSouthNodeLon = (desNorthNodeLon + 180) % 360;

    const desNorthNode = longitudeToGateLine(desNorthNodeLon);
    const desSouthNode = longitudeToGateLine(desSouthNodeLon);

    console.log('\n设计端 (Design / 红色左侧):');
    console.log(`  北交点: ${desNorthNode.gate}.${desNorthNode.line} (${desNorthNodeLon.toFixed(2)}°)`);
    console.log(`  南交点: ${desSouthNode.gate}.${desSouthNode.line} (${desSouthNodeLon.toFixed(2)}°)`);
    console.log(`  期望值: 55.3, 59.3`);

    console.log('\n========================================');
    console.log('结果对比:');
    console.log(`个性北交点: ${persNorthNode.gate}.${persNorthNode.line} ${persNorthNode.gate === 30 && persNorthNode.line === 1 ? '✓' : '✗'}`);
    console.log(`个性南交点: ${persSouthNode.gate}.${persSouthNode.line} ${persSouthNode.gate === 29 && persSouthNode.line === 1 ? '✓' : '✗'}`);
    console.log(`设计北交点: ${desNorthNode.gate}.${desNorthNode.line} ${desNorthNode.gate === 55 && desNorthNode.line === 3 ? '✓' : '✗'}`);
    console.log(`设计南交点: ${desSouthNode.gate}.${desSouthNode.line} ${desSouthNode.gate === 59 && desSouthNode.line === 3 ? '✓' : '✗'}`);
    console.log('========================================\n');

    swe.close();

  } catch (error) {
    console.error('错误:', error);
    console.error('错误堆栈:', error.stack);
  }
}

testFullChart();
