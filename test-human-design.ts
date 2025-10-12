/**
 * 人类图完整计算测试
 * 使用 swisseph-wasm 计算行星位置，然后映射到人类图闸门
 */

import { longitudeToActivation, calculateDesignDate, Planet, type Activation } from './lib/human-design-calculator';

// 动态导入 swisseph-wasm
async function calculateHumanDesign(birthDate: Date, birthLat: number, birthLon: number) {
  try {
    // 导入 swisseph-wasm
    const swisseph = await import('swisseph-wasm');

    console.log('=== 人类图计算开始 ===\n');
    console.log(`出生日期: ${birthDate.toISOString()}`);
    console.log(`出生地点: 纬度 ${birthLat}°, 经度 ${birthLon}°\n`);

    // 计算设计日期（出生前88天）
    const designDate = calculateDesignDate(birthDate);
    console.log(`设计日期: ${designDate.toISOString()}\n`);

    // 将日期转换为 Julian Day
    const birthJD = dateToJulianDay(birthDate);
    const designJD = dateToJulianDay(designDate);

    console.log('--- 个性端 (Personality) ---');
    const personality = await calculatePlanets(swisseph, birthJD, 'Personality');

    console.log('\n--- 设计端 (Design) ---');
    const design = await calculatePlanets(swisseph, designJD, 'Design');

    // 汇总激活的闸门
    console.log('\n=== 激活的闸门汇总 ===');
    const allActivations = [...Object.values(personality), ...Object.values(design)];
    const uniqueGates = new Set(allActivations.map(a => a.gate));
    console.log(`共激活 ${uniqueGates.size} 个闸门:`);
    console.log(Array.from(uniqueGates).sort((a, b) => a - b).join(', '));

    return {
      personality,
      design,
      birthDate,
      designDate,
    };
  } catch (error) {
    console.error('计算错误:', error);
    throw error;
  }
}

/**
 * 计算13个行星的位置并转换为激活信息
 */
async function calculatePlanets(swisseph: any, julianDay: number, side: string) {
  // swisseph 行星常量
  const SE_SUN = 0;
  const SE_MOON = 1;
  const SE_MERCURY = 2;
  const SE_VENUS = 3;
  const SE_MARS = 4;
  const SE_JUPITER = 5;
  const SE_SATURN = 6;
  const SE_URANUS = 7;
  const SE_NEPTUNE = 8;
  const SE_PLUTO = 9;
  const SE_EARTH = 14;
  const SE_TRUE_NODE = 11; // North Node

  const planets = [
    { id: SE_SUN, name: 'Sun', planet: Planet.Sun },
    { id: SE_MOON, name: 'Moon', planet: Planet.Moon },
    { id: SE_MERCURY, name: 'Mercury', planet: Planet.Mercury },
    { id: SE_VENUS, name: 'Venus', planet: Planet.Venus },
    { id: SE_MARS, name: 'Mars', planet: Planet.Mars },
    { id: SE_JUPITER, name: 'Jupiter', planet: Planet.Jupiter },
    { id: SE_SATURN, name: 'Saturn', planet: Planet.Saturn },
    { id: SE_URANUS, name: 'Uranus', planet: Planet.Uranus },
    { id: SE_NEPTUNE, name: 'Neptune', planet: Planet.Neptune },
    { id: SE_PLUTO, name: 'Pluto', planet: Planet.Pluto },
    { id: SE_EARTH, name: 'Earth', planet: Planet.Earth },
    { id: SE_TRUE_NODE, name: 'North Node', planet: Planet.NorthNode },
  ];

  const activations: Record<string, Activation> = {};

  for (const { id, name, planet } of planets) {
    try {
      // 计算行星位置
      const result = swisseph.calc_ut(julianDay, id, 0); // 0 = SEFLG_SWIEPH

      if (result.error) {
        console.error(`${name} 计算错误:`, result.error);
        continue;
      }

      const longitude = result.data[0]; // 黄道经度
      const activation = longitudeToActivation(longitude, planet);

      console.log(`${name.padEnd(12)}: 闸门 ${activation.gate.toString().padStart(2)}, 爻 ${activation.line} (${longitude.toFixed(2)}°)`);

      activations[name.toLowerCase().replace(' ', '')] = activation;

      // South Node 是 North Node 的对面（+180°）
      if (id === SE_TRUE_NODE) {
        const southLongitude = (longitude + 180) % 360;
        const southActivation = longitudeToActivation(southLongitude, Planet.SouthNode);
        console.log(`${'South Node'.padEnd(12)}: 闸门 ${southActivation.gate.toString().padStart(2)}, 爻 ${southActivation.line} (${southLongitude.toFixed(2)}°)`);
        activations['southnode'] = southActivation;
      }
    } catch (error) {
      console.error(`计算 ${name} 时出错:`, error);
    }
  }

  return activations;
}

/**
 * 将日期转换为儒略日
 */
function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;

  let jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;

  return jd;
}

// 测试案例
async function main() {
  // 示例：1990年1月1日 12:00 UTC，北京 (39.9°N, 116.4°E)
  const birthDate = new Date('1990-01-01T12:00:00Z');
  const birthLat = 39.9;
  const birthLon = 116.4;

  await calculateHumanDesign(birthDate, birthLat, birthLon);
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

export { calculateHumanDesign };
