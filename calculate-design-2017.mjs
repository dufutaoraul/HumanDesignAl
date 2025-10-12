/**
 * 计算2017-01-20的设计端（Design）
 * 设计端 = 当太阳位置比出生太阳位置早88度时的时刻
 */

import SwissEph from 'swisseph-wasm';

const HD_OFFSET = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;

const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

function longitudeToActivation(longitude, planetName) {
  let x = longitude - HD_OFFSET;
  if (x < 0) x += 360;

  const gateIndex = Math.floor(x / DEGREE_PER_GATE);
  const lineIndex = Math.floor((x % DEGREE_PER_GATE) / DEGREE_PER_LINE) + 1;
  const gate = GATE_MAP[gateIndex];

  return {
    gate,
    line: lineIndex,
    longitude: parseFloat(longitude.toFixed(4)),
    planet: planetName,
  };
}

// 角度差计算（考虑360度循环）
function angleDifference(target, current) {
  let diff = target - current;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

// 二分查找设计日期
async function findDesignDate(swe, birthJD, birthSunLon) {
  const targetSunLon = (birthSunLon - 88 + 360) % 360;

  // 搜索范围：出生前70-110天
  let jdLow = birthJD - 110;
  let jdHigh = birthJD - 70;

  console.log(`出生太阳位置: ${birthSunLon.toFixed(4)}°`);
  console.log(`目标太阳位置: ${targetSunLon.toFixed(4)}° (出生-88°)\n`);
  console.log('开始二分查找设计日期...\n');

  let iteration = 0;
  while (jdHigh - jdLow > 0.00001) { // 精度约1秒
    const jdMid = (jdLow + jdHigh) / 2;
    const sunPos = swe.calc_ut(jdMid, swe.SE_SUN, swe.SEFLG_SWIEPH);
    const sunLon = sunPos[0];

    const diff = angleDifference(targetSunLon, sunLon);

    iteration++;
    if (iteration <= 5 || Math.abs(diff) < 0.01) {
      console.log(`迭代${iteration}: JD=${jdMid.toFixed(5)}, 太阳=${sunLon.toFixed(4)}°, 误差=${diff.toFixed(6)}°`);
    }

    if (Math.abs(diff) < 0.001) {
      console.log(`\n找到精确匹配！误差 < 0.001°\n`);
      return jdMid;
    }

    if (diff > 0) {
      jdLow = jdMid; // 太阳还没到目标位置，需要继续往前
    } else {
      jdHigh = jdMid; // 太阳已经过了目标位置，需要往后
    }
  }

  return (jdLow + jdHigh) / 2;
}

async function calculateDesign2017() {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    // 出生时间：2017-01-20 20:35 北京时间（UTC+8）
    const birthDate = new Date('2017-01-20T12:35:00Z');

    console.log('=== 2017-01-20 设计端计算 ===\n');
    console.log(`出生时间（北京）: 2017-01-20 20:35`);
    console.log(`出生时间（UTC）: ${birthDate.toISOString()}\n`);

    const birthJD = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60
    );

    // 计算出生时太阳位置
    const birthSunPos = swe.calc_ut(birthJD, swe.SE_SUN, swe.SEFLG_SWIEPH);
    const birthSunLon = birthSunPos[0];

    // 找到设计日期
    const designJD = await findDesignDate(swe, birthJD, birthSunLon);

    // 转换为日期
    const designDateInfo = swe.revjul(designJD);
    const designDate = new Date(Date.UTC(
      designDateInfo.year,
      designDateInfo.month - 1,
      designDateInfo.day,
      Math.floor(designDateInfo.hour),
      Math.floor((designDateInfo.hour % 1) * 60),
      Math.floor(((designDateInfo.hour % 1) * 60 % 1) * 60)
    ));

    console.log(`设计日期（UTC）: ${designDate.toISOString()}`);
    console.log(`设计日期（北京时间）: ${new Date(designDate.getTime() + 8*3600000).toLocaleString('zh-CN')}\n`);

    console.log('--- 设计端 (Design / 红色) ---\n');

    const planets = [
      { name: 'Sun', id: swe.SE_SUN },
      { name: 'Moon', id: swe.SE_MOON },
      { name: 'Mercury', id: swe.SE_MERCURY },
      { name: 'Venus', id: swe.SE_VENUS },
      { name: 'Mars', id: swe.SE_MARS },
      { name: 'Jupiter', id: swe.SE_JUPITER },
      { name: 'Saturn', id: swe.SE_SATURN },
      { name: 'Uranus', id: swe.SE_URANUS },
      { name: 'Neptune', id: swe.SE_NEPTUNE },
      { name: 'Pluto', id: swe.SE_PLUTO },
      { name: 'NorthNode', id: swe.SE_TRUE_NODE },
    ];

    const results = [];

    for (const planet of planets) {
      if (planet.name === 'Sun') {
        const sunPos = swe.calc_ut(designJD, planet.id, swe.SEFLG_SWIEPH);
        const sunLon = sunPos[0];
        const sunActivation = longitudeToActivation(sunLon, 'Sun');
        results.push(sunActivation);
        console.log(`${planet.name.padEnd(10)}: 闸门 ${sunActivation.gate}.${sunActivation.line}  (${sunLon.toFixed(4)}°)`);

        const earthLon = (sunLon + 180) % 360;
        const earthActivation = longitudeToActivation(earthLon, 'Earth');
        results.push(earthActivation);
        console.log(`${'Earth'.padEnd(10)}: 闸门 ${earthActivation.gate}.${earthActivation.line}  (${earthLon.toFixed(4)}°)`);
      } else {
        const pos = swe.calc_ut(designJD, planet.id, swe.SEFLG_SWIEPH);
        const lon = pos[0];
        const activation = longitudeToActivation(lon, planet.name);
        results.push(activation);
        console.log(`${planet.name.padEnd(10)}: 闸门 ${activation.gate}.${activation.line}  (${lon.toFixed(4)}°)`);
      }
    }

    const nodePos = swe.calc_ut(designJD, swe.SE_TRUE_NODE, swe.SEFLG_SWIEPH);
    const southNodeLon = (nodePos[0] + 180) % 360;
    const southNodeActivation = longitudeToActivation(southNodeLon, 'SouthNode');
    results.push(southNodeActivation);
    console.log(`${'SouthNode'.padEnd(10)}: 闸门 ${southNodeActivation.gate}.${southNodeActivation.line}  (${southNodeLon.toFixed(4)}°)`);

    console.log('\n=== 设计端格式化结果 ===\n');
    results.forEach(r => {
      console.log(`  ${r.planet.padEnd(12)}: ${r.gate}.${r.line}`);
    });

  } finally {
    swe.close();
  }
}

calculateDesign2017().catch(console.error);
