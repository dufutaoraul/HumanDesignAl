#!/usr/bin/env node
/**
 * Swiss Ephemeris 独立计算服务
 * 在纯Node.js环境中运行，通过HTTP提供精确的True Node计算
 */

const http = require('http');

// 延迟加载 Swiss Ephemeris
let sweInstance = null;
let isInitializing = false;
let initError = null;

async function initSwissEph() {
  if (sweInstance) return sweInstance;
  if (isInitializing) {
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 100));
    return initSwissEph();
  }

  isInitializing = true;
  try {
    const { default: SwissEph } = await import('swisseph-wasm');
    const swe = new SwissEph();
    await swe.initSwissEph();
    sweInstance = swe;
    isInitializing = false;
    console.log('✅ Swiss Ephemeris 初始化成功');
    return swe;
  } catch (error) {
    isInitializing = false;
    initError = error;
    console.error('❌ Swiss Ephemeris 初始化失败:', error.message);
    throw error;
  }
}

/**
 * 计算 True Node
 */
async function calculateTrueNode(dateISO) {
  try {
    const swe = await initSwissEph();
    const date = new Date(dateISO);

    const julianDay = swe.julday(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
    );

    const TRUE_NODE = 11;
    const SEFLG_SWIEPH = 2;

    const result = swe.calc_ut(julianDay, TRUE_NODE, SEFLG_SWIEPH);
    return {
      success: true,
      longitude: result[0],
      latitude: result[1],
      distance: result[2]
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/calculate-node') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { date } = JSON.parse(body);

        if (!date) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing date parameter' }));
          return;
        }

        const result = await calculateTrueNode(date);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      swissephReady: sweInstance !== null,
      error: initError ? initError.message : null
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.SWISSEPH_PORT || 3100;

server.listen(PORT, () => {
  console.log(`🚀 Swiss Ephemeris 服务运行在 http://localhost:${PORT}`);
  console.log(`   健康检查: http://localhost:${PORT}/health`);
  console.log(`   计算接口: POST http://localhost:${PORT}/calculate-node`);

  // 预加载 Swiss Ephemeris
  initSwissEph().catch(err => {
    console.error('预加载失败，但服务仍在运行:', err.message);
  });
});
