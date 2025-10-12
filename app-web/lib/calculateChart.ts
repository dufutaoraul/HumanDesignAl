/**
 * 人类图完整计算 - 使用 swisseph-wasm 进行精确天文计算
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

let swisseph: any = null;

// 动态加载 swisseph（只在服务器端）
function getSwisseph() {
  if (!swisseph && typeof window === 'undefined') {
    swisseph = require('swisseph-wasm');
  }
  return swisseph;
}

// 人类图核心常量
const HD_OFFSET_TO_ZODIAC = 3.875;
const DEGREE_PER_GATE = 5.625;
const DEGREE_PER_LINE = 0.9375;
const DEGREE_PER_COLOR = 0.15625; // 0.9375 / 6
const DEGREE_PER_TONE = 0.026041667; // 0.15625 / 6
const DEGREE_PER_BASE = 0.004340278; // 0.026041667 / 6

// 64闸门映射表
const GATE_MAP = [
  17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
  35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
  4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
  50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
  58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
  63, 22, 36, 25
];

/**
 * 将黄道经度转换为人类图激活信息
 */
function longitudeToActivation(longitude: number, planetName: string) {
  let x = longitude - HD_OFFSET_TO_ZODIAC;
  if (x < 0) x += 360;

  const gateIndex = Math.floor(x / DEGREE_PER_GATE);
  const lineIndex = Math.floor((x % DEGREE_PER_GATE) / DEGREE_PER_LINE) + 1;
  const gate = GATE_MAP[gateIndex];

  // 计算 color, tone, base
  const positionInLine = x % DEGREE_PER_GATE - (lineIndex - 1) * DEGREE_PER_LINE;
  const color = Math.floor(positionInLine / DEGREE_PER_COLOR) + 1;

  const positionInColor = positionInLine - (color - 1) * DEGREE_PER_COLOR;
  const tone = Math.floor(positionInColor / DEGREE_PER_TONE) + 1;

  const positionInTone = positionInColor - (tone - 1) * DEGREE_PER_TONE;
  const base = Math.floor(positionInTone / DEGREE_PER_BASE) + 1;

  return {
    gate,
    line: lineIndex,
    color: Math.min(color, 6),
    tone: Math.min(tone, 6),
    base: Math.min(base, 5),
    longitude: parseFloat(longitude.toFixed(4)),
    planet: planetName,
  };
}

/**
 * 将日期转换为儒略日
 */
function dateToJulianDay(date: Date): number {
  const swe = getSwisseph();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  const jd = swe.julday(year, month, day, hour + minute / 60 + second / 3600, swe.SE_GREG_CAL);
  return jd;
}

/**
 * 计算设计日期（出生前88天）
 */
function calculateDesignDate(birthDate: Date): Date {
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);
  return designDate;
}

/**
 * 计算13个行星的位置
 */
export function calculatePlanets(julianDay: number): Record<string, any> {
  const swe = getSwisseph();
  const planets = [
    { id: swe.SE_SUN, name: 'Sun' },
    { id: swe.SE_EARTH, name: 'Earth' },
    { id: swe.SE_MOON, name: 'Moon' },
    { id: swe.SE_TRUE_NODE, name: 'NorthNode' },
    { id: swe.SE_MERCURY, name: 'Mercury' },
    { id: swe.SE_VENUS, name: 'Venus' },
    { id: swe.SE_MARS, name: 'Mars' },
    { id: swe.SE_JUPITER, name: 'Jupiter' },
    { id: swe.SE_SATURN, name: 'Saturn' },
    { id: swe.SE_URANUS, name: 'Uranus' },
    { id: swe.SE_NEPTUNE, name: 'Neptune' },
    { id: swe.SE_PLUTO, name: 'Pluto' },
  ];

  const activations: Record<string, any> = {};

  for (const { id, name } of planets) {
    try {
      const result = swe.calc_ut(julianDay, id, swe.SEFLG_SWIEPH);

      if (result.error) {
        console.error(`${name} 计算错误:`, result.error);
        continue;
      }

      const longitude = result.data[0]; // 黄道经度
      const activation = longitudeToActivation(longitude, name);

      activations[name] = activation;

      // South Node 是 North Node 的对面（+180°）
      if (id === swe.SE_TRUE_NODE) {
        const southLongitude = (longitude + 180) % 360;
        const southActivation = longitudeToActivation(southLongitude, 'SouthNode');
        activations['SouthNode'] = southActivation;
      }
    } catch (error) {
      console.error(`计算 ${name} 时出错:`, error);
    }
  }

  return activations;
}

/**
 * 计算完整人类图（个性端+设计端）
 */
export function calculateFullChart(birthDateTime: Date) {
  // 计算设计日期
  const designDate = calculateDesignDate(birthDateTime);

  // 转换为儒略日
  const birthJD = dateToJulianDay(birthDateTime);
  const designJD = dateToJulianDay(designDate);

  // 计算个性端（出生时）
  const personality = calculatePlanets(birthJD);

  // 计算设计端（设计日）
  const design = calculatePlanets(designJD);

  return {
    personality,
    design,
  };
}
