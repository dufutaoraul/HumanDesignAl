/**
 * Swiss Ephemeris 包装器
 * 处理异步初始化，提供同步接口
 */

const { default: SwissEph } = require('swisseph-wasm');

let sweInstance = null;
let initPromise = null;

/**
 * 初始化 Swiss Ephemeris（异步，只运行一次）
 */
async function initSwissEphemeris() {
  if (sweInstance) {
    return sweInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const swe = new SwissEph();
      await swe.initSwissEph();
      sweInstance = swe;
      return swe;
    } catch (error) {
      console.error('Swiss Ephemeris 初始化失败:', error);
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
async function calculateTrueNodeLongitude(date) {
  const swe = await initSwissEphemeris();

  const julianDay = swe.julday(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  );

  const TRUE_NODE = 11;
  const SEFLG_SWIEPH = 2;

  const result = swe.calc_ut(julianDay, TRUE_NODE, SEFLG_SWIEPH);
  return result[0]; // 返回黄道经度
}

/**
 * 关闭 Swiss Ephemeris
 */
function closeSwissEphemeris() {
  if (sweInstance) {
    sweInstance.close();
    sweInstance = null;
    initPromise = null;
  }
}

module.exports = {
  initSwissEphemeris,
  calculateTrueNodeLongitude,
  closeSwissEphemeris
};
