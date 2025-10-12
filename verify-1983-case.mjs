/**
 * 验证1983年10月15日案例
 * 出生时间：1983-10-15 11:40 北京时间（UTC+8）
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

async function verify1983Case() {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    // 出生时间：1983-10-15 11:40 北京时间（UTC+8）
    // 转换为UTC：11:40 - 8:00 = 03:40 UTC
    const birthDate = new Date('1983-10-15T03:40:00Z');

    console.log('=== 1983-10-15案例验证 ===');
    console.log(`出生时间（北京）: 1983-10-15 11:40`);
    console.log(`出生时间（UTC）: ${birthDate.toISOString()}\n`);

    const birthJD = swe.julday(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth() + 1,
      birthDate.getUTCDate(),
      birthDate.getUTCHours() + birthDate.getUTCMinutes() / 60
    );

    console.log('--- 个性端 (Personality) ---');

    // 计算太阳
    const sunPos = swe.calc_ut(birthJD, swe.SE_SUN, swe.SEFLG_SWIEPH);
    const sunLon = sunPos[0];
    const sunActivation = longitudeToActivation(sunLon, 'Sun');
    console.log(`Sun     : 闸门 ${sunActivation.gate}.${sunActivation.line}  (${sunLon.toFixed(4)}°) [应该是48.1]`);

    // 计算地球（太阳+180°）
    const earthLon = (sunLon + 180) % 360;
    const earthActivation = longitudeToActivation(earthLon, 'Earth');
    console.log(`Earth   : 闸门 ${earthActivation.gate}.${earthActivation.line}  (${earthLon.toFixed(4)}°) [应该是40.1]`);

    // 计算月亮
    const moonPos = swe.calc_ut(birthJD, swe.SE_MOON, swe.SEFLG_SWIEPH);
    const moonLon = moonPos[0];
    const moonActivation = longitudeToActivation(moonLon, 'Moon');
    console.log(`Moon    : 闸门 ${moonActivation.gate}.${moonActivation.line}  (${moonLon.toFixed(4)}°) [应该是40.4]`);

    // 北交点
    const nodePos = swe.calc_ut(birthJD, swe.SE_TRUE_NODE, swe.SEFLG_SWIEPH);
    const nodeLon = nodePos[0];
    const nodeActivation = longitudeToActivation(nodeLon, 'NorthNode');
    console.log(`Node    : 闸门 ${nodeActivation.gate}.${nodeActivation.line}  (${nodeLon.toFixed(4)}°) [应该是45.1]`);

    // 水星
    const mercuryPos = swe.calc_ut(birthJD, swe.SE_MERCURY, swe.SEFLG_SWIEPH);
    const mercuryLon = mercuryPos[0];
    const mercuryActivation = longitudeToActivation(mercuryLon, 'Mercury');
    console.log(`Mercury : 闸门 ${mercuryActivation.gate}.${mercuryActivation.line}  (${mercuryLon.toFixed(4)}°) [应该是48.1]`);

  } finally {
    swe.close();
  }
}

verify1983Case().catch(console.error);
