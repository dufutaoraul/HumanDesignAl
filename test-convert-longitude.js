// 将黄道经度转换为人类图闸门爻

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

function longitudeToGate(eclipticLon) {
  // 加上偏移量
  let adjustedLongitude = (eclipticLon + HD_OFFSET_TO_ZODIAC) % 360;

  // 计算闸门索引
  const gateIndex = Math.floor(adjustedLongitude / DEGREE_PER_GATE);

  // 计算爻
  const remainderInGate = adjustedLongitude % DEGREE_PER_GATE;
  const line = Math.floor(remainderInGate / DEGREE_PER_LINE) + 1;

  // 获取实际闸门编号
  const gate = GATE_MAP[gateIndex];

  return `${gate}.${Math.min(line, 6)}`;
}

console.log('\nSwiss Ephemeris True Node 325.3325° =>',  longitudeToGate(325.3325));
console.log('期望 324.5° =>', longitudeToGate(324.5));
console.log('\n如果是 30.1，应该是多少黄道经度？');

// 反向计算
const gateIndex = GATE_MAP.indexOf(30);
const hdLon = gateIndex * DEGREE_PER_GATE + (1 - 1) * DEGREE_PER_LINE;
const eclipticLon = (hdLon - HD_OFFSET_TO_ZODIAC + 360) % 360;
console.log(`闸门30索引=${gateIndex}, HD经度=${hdLon.toFixed(4)}, 黄道经度=${eclipticLon.toFixed(4)}`);
