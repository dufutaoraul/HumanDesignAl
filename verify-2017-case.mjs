/**
 * 验证2017年1月20日案例
 * 出生时间：2017-01-20 20:35 北京时间（UTC+8）
 * 地点：四川泸州
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

async function verify2017Case() {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    // 出生时间：2017-01-20 20:35 北京时间（UTC+8）
    // 转换为UTC：20:35 - 8:00 = 12:35 UTC
    const birthDate = new Date('2017-01-20T12:35:00Z');

    console.log('=== 2017-01-20案例验证 ===');
    console.log(`出生时间（北京）: 2017-01-20 20:35`);
    console.log(`出生时间（UTC）: ${birthDate.toISOString()}`);
    console.log(`地点：四川泸州\n`);

    const birthJD = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60
    );

    console.log('--- 个性端 (Personality) ---\n');

    // 计算所有行星
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
      { name: 'SouthNode', id: swe.SE_TRUE_NODE }, // 南交点 = 北交点 + 180°
    ];

    const results = [];

    for (const planet of planets) {
      if (planet.name === 'SouthNode') {
        // 南交点 = 北交点 + 180°
        const nodePos = swe.calc_ut(birthJD, swe.SE_TRUE_NODE, swe.SEFLG_SWIEPH);
        const southNodeLon = (nodePos[0] + 180) % 360;
        const activation = longitudeToActivation(southNodeLon, 'SouthNode');
        results.push(activation);
        console.log(`${planet.name.padEnd(10)}: 闸门 ${activation.gate}.${activation.line}  (${southNodeLon.toFixed(4)}°)`);
      } else if (planet.name === 'Sun') {
        // 太阳
        const sunPos = swe.calc_ut(birthJD, planet.id, swe.SEFLG_SWIEPH);
        const sunLon = sunPos[0];
        const sunActivation = longitudeToActivation(sunLon, 'Sun');
        results.push(sunActivation);
        console.log(`${planet.name.padEnd(10)}: 闸门 ${sunActivation.gate}.${sunActivation.line}  (${sunLon.toFixed(4)}°)`);

        // 地球 = 太阳 + 180°
        const earthLon = (sunLon + 180) % 360;
        const earthActivation = longitudeToActivation(earthLon, 'Earth');
        results.push(earthActivation);
        console.log(`${'Earth'.padEnd(10)}: 闸门 ${earthActivation.gate}.${earthActivation.line}  (${earthLon.toFixed(4)}°)`);
      } else {
        const pos = swe.calc_ut(birthJD, planet.id, swe.SEFLG_SWIEPH);
        const lon = pos[0];
        const activation = longitudeToActivation(lon, planet.name);
        results.push(activation);
        console.log(`${planet.name.padEnd(10)}: 闸门 ${activation.gate}.${activation.line}  (${lon.toFixed(4)}°)`);
      }
    }

    console.log('\n=== 输出格式化结果 ===\n');
    console.log('个性端 (BLACK):');
    results.forEach(r => {
      console.log(`  ${r.planet.padEnd(12)}: ${r.gate}.${r.line}`);
    });

  } finally {
    swe.close();
  }
}

verify2017Case().catch(console.error);
