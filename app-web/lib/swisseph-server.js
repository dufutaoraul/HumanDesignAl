/**
 * Swiss Ephemeris 服务器端计算模块
 * 只在纯Node.js环境中使用，不经过webpack打包
 */

// 延迟加载 Swiss Ephemeris
let sweInstance = null;
let initPromise = null;

/**
 * 初始化 Swiss Ephemeris
 */
async function initSwissEph() {
  if (sweInstance) {
    return sweInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // 动态导入以避免webpack打包
      const { default: SwissEph } = await import('swisseph-wasm');
      const swe = new SwissEph();
      await swe.initSwissEph();
      sweInstance = swe;
      console.log('✅ Swiss Ephemeris 初始化成功');
      return swe;
    } catch (error) {
      console.error('❌ Swiss Ephemeris 初始化失败:', error.message);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * 计算 True Node 黄道经度
 * @param {Date} date - UTC时间
 * @returns {Promise<number>} - 黄道经度 (0-360度)
 */
async function calculateTrueNode(date) {
  try {
    const swe = await initSwissEph();

    const julianDay = swe.julday(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
    );

    const TRUE_NODE = 11;
    const SEFLG_SWIEPH = 2;

    const result = swe.calc_ut(julianDay, TRUE_NODE, SEFLG_SWIEPH);
    return result[0];
  } catch (error) {
    console.error('Swiss Ephemeris 计算失败，回退到公式计算:', error.message);
    // 回退到公式计算
    return calculateTrueNodeFormula(date);
  }
}

/**
 * 回退方案：使用公式计算 True Node
 */
function calculateTrueNodeFormula(date) {
  const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / (1000 * 60 * 60 * 24);
  const T = daysSinceJ2000 / 36525.0;

  const Omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000;
  const M = 134.96298 + 477198.867398 * T + 0.0086972 * T * T + T * T * T / 56250;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  const Ms = 357.52772 + 35999.050340 * T - 0.0001603 * T * T - T * T * T / 300000;
  const F = 93.27191 + 483202.017538 * T - 0.0036825 * T * T + T * T * T / 327270;

  const deg2rad = Math.PI / 180;
  const Omega_rad = Omega * deg2rad;
  const M_rad = M * deg2rad;
  const L_rad = L * deg2rad;
  const Ms_rad = Ms * deg2rad;
  const F_rad = F * deg2rad;

  let deltaOmega = 0;
  deltaOmega += -1.4979 * Math.sin(2 * (L_rad - Omega_rad));
  deltaOmega += -0.1500 * Math.sin(Ms_rad);
  deltaOmega += -0.1226 * Math.sin(2 * L_rad);
  deltaOmega += +0.1176 * Math.sin(2 * F_rad);
  deltaOmega += -0.0801 * Math.sin(2 * (M_rad - L_rad + Omega_rad));
  deltaOmega += -0.0616 * Math.sin(M_rad + 2 * (L_rad - Omega_rad));
  deltaOmega += +0.0490 * Math.sin(2 * (M_rad - L_rad + Omega_rad) - Ms_rad);
  deltaOmega += +0.0409 * Math.sin(2 * F_rad - Ms_rad);
  deltaOmega += +0.0327 * Math.sin(2 * L_rad - Ms_rad);
  deltaOmega += -0.0304 * Math.sin(M_rad);
  deltaOmega += +0.0154 * Math.sin(M_rad + Ms_rad);

  let trueNode = Omega + deltaOmega;
  trueNode -= 0.7; // 经验修正

  trueNode = ((trueNode % 360) + 360) % 360;
  return trueNode;
}

module.exports = {
  calculateTrueNode
};
