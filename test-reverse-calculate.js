// 反向计算：从闸门爻推算黄道经度

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

function gateLineToEcliptic(gate, line) {
  const gateIndex = GATE_MAP.indexOf(gate);
  if (gateIndex === -1) return null;

  // HD经度
  const hdLongitude = gateIndex * DEGREE_PER_GATE + (line - 1) * DEGREE_PER_LINE;

  // 转换为黄道经度（去掉偏移）
  const eclipticLon = (hdLongitude - HD_OFFSET_TO_ZODIAC + 360) % 360;

  return {
    gate,
    line,
    gateIndex,
    hdLongitude: hdLongitude.toFixed(4),
    eclipticLongitude: eclipticLon.toFixed(4)
  };
}

console.log('\n期望的闸门爻对应的黄道经度：\n');
console.log('个性端北交点 30.1:', gateLineToEcliptic(30, 1));
console.log('个性端南交点 29.1:', gateLineToEcliptic(29, 1));
console.log('\n设计端北交点 55.3:', gateLineToEcliptic(55, 3));
console.log('设计端南交点 59.3:', gateLineToEcliptic(59, 3));

console.log('\n\n实际得到的闸门爻对应的黄道经度：\n');
console.log('个性端北交点 30.3:', gateLineToEcliptic(30, 3));
console.log('个性端南交点 29.3:', gateLineToEcliptic(29, 3));
console.log('\n设计端北交点 55.2:', gateLineToEcliptic(55, 2));
console.log('设计端南交点 59.2:', gateLineToEcliptic(59, 2));

console.log('\n\n现在计算的黄道经度：');
console.log('个性端北交点: 326.63°');
console.log('设计端北交点: 331.29°');
