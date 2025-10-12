/**
 * 人类图计算核心模块
 * 基于 swisseph-wasm 和 SharpAstrology.HumanDesign 的实现逻辑
 */

// 人类图核心常量 (来自 SharpAstrology.HumanDesign)
const HD_OFFSET_TO_ZODIAC = 3.875;  // 人类图相对黄道的偏移量
const DEGREE_PER_GATE = 5.625;      // 每个闸门占用的度数 (360° / 64)
const DEGREE_PER_LINE = 0.9375;     // 每爻占用的度数 (5.625° / 6)

// 行星枚举
export enum Planet {
  Sun = 0,
  Moon = 1,
  Mercury = 2,
  Venus = 3,
  Mars = 4,
  Jupiter = 5,
  Saturn = 6,
  Uranus = 7,
  Neptune = 8,
  Pluto = 9,
  Earth = 10,
  NorthNode = 11,
  SouthNode = 12,
}

// 闸门激活数据结构
export interface Activation {
  gate: number;        // 闸门号 (1-64)
  line: number;        // 爻线 (1-6)
  longitude: number;   // 黄道经度
  planet: Planet;      // 行星
}

// 人类图数据结构
export interface HumanDesignChart {
  personality: {
    sun: Activation;
    earth: Activation;
    moon: Activation;
    northNode: Activation;
    southNode: Activation;
    mercury: Activation;
    venus: Activation;
    mars: Activation;
    jupiter: Activation;
    saturn: Activation;
    uranus: Activation;
    neptune: Activation;
    pluto: Activation;
  };
  design: {
    sun: Activation;
    earth: Activation;
    moon: Activation;
    northNode: Activation;
    southNode: Activation;
    mercury: Activation;
    venus: Activation;
    mars: Activation;
    jupiter: Activation;
    saturn: Activation;
    uranus: Activation;
    neptune: Activation;
    pluto: Activation;
  };
}

/**
 * 将黄道经度转换为人类图激活信息（闸门+爻）
 * @param longitude 黄道经度 (0-360)
 * @param planet 行星
 * @returns 激活信息
 */
export function longitudeToActivation(longitude: number, planet: Planet): Activation {
  // 应用人类图偏移量
  let x = longitude - HD_OFFSET_TO_ZODIAC;
  if (x < 0) x += 360;

  // 计算闸门号 (0-63对应64个闸门)
  const gateIndex = Math.floor(x / DEGREE_PER_GATE);

  // 计算爻线 (1-6)
  const lineIndex = Math.floor((x % DEGREE_PER_GATE) / DEGREE_PER_LINE) + 1;

  // 闸门映射表 (从 SharpAstrology.HumanDesign 的 Gates 枚举)
  // 索引0-63映射到实际闸门号
  const gateMap = [
    17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16,
    35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7,
    4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32,
    50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10,
    58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37,
    63, 22, 36, 25
  ];

  const gate = gateMap[gateIndex];

  return {
    gate,
    line: lineIndex,
    longitude,
    planet,
  };
}

/**
 * 计算设计日期（出生前88度太阳运行，约88天）
 * @param birthDate 出生日期
 * @returns 设计日期
 */
export function calculateDesignDate(birthDate: Date): Date {
  // 设计日期约为出生前88天
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);
  return designDate;
}

/**
 * 测试函数：打印激活信息
 */
export function testActivationCalculation() {
  // 测试案例：假设太阳位于黄道 45°
  const testLongitude = 45;
  const activation = longitudeToActivation(testLongitude, Planet.Sun);

  console.log('=== 人类图计算测试 ===');
  console.log(`黄道经度: ${testLongitude}°`);
  console.log(`闸门: ${activation.gate}`);
  console.log(`爻线: ${activation.line}`);
  console.log(`行星: ${Planet[activation.planet]}`);

  return activation;
}

// 如果直接运行此文件
if (require.main === module) {
  testActivationCalculation();
}
