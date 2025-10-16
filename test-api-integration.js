/**
 * 测试完整的API集成：Swiss Ephemeris服务 + Next.js API
 * 验证刘勇（1970-12-19 14:30 北京时间）的数据是否精确
 */

async function testAPICalculation() {
  const testData = {
    name: '刘勇',
    birthDate: '1970-12-19',
    birthTime: '14:30',
    location: '北京',
    timezone: 'Asia/Shanghai'
  };

  console.log('=== 测试完整API集成 ===');
  console.log('测试数据:', testData);
  console.log('');

  try {
    // 调用Next.js API
    const response = await fetch('http://localhost:3006/api/calculate-chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API调用失败:', response.status, error);
      return;
    }

    const result = await response.json();

    console.log('✅ API调用成功\n');

    // 检查个性端北交点和南交点
    const persNN = result.planets?.personality?.NorthNode;
    const persSN = result.planets?.personality?.SouthNode;
    const designNN = result.planets?.design?.NorthNode;
    const designSN = result.planets?.design?.SouthNode;

    console.log('=== 个性端 (Personality) ===');
    console.log(`北交点 (North Node): ${persNN?.gate}.${persNN?.line} ${persNN?.arrow || ''}`);
    console.log(`南交点 (South Node): ${persSN?.gate}.${persSN?.line} ${persSN?.arrow || ''}`);
    console.log('');

    console.log('=== 设计端 (Design) ===');
    console.log(`北交点 (North Node): ${designNN?.gate}.${designNN?.line} ${designNN?.arrow || ''}`);
    console.log(`南交点 (South Node): ${designSN?.gate}.${designSN?.line} ${designSN?.arrow || ''}`);
    console.log('');

    // 验证精度
    const expected = {
      personality: { northNode: '30.1', southNode: '29.1' },
      design: { northNode: '55.3', southNode: '59.3' }
    };

    const persNNStr = `${persNN?.gate}.${persNN?.line}`;
    const persSNStr = `${persSN?.gate}.${persSN?.line}`;
    const designNNStr = `${designNN?.gate}.${designNN?.line}`;
    const designSNStr = `${designSN?.gate}.${designSN?.line}`;

    console.log('=== 精度验证 ===');
    const checks = [
      { name: '个性端北交点', actual: persNNStr, expected: expected.personality.northNode },
      { name: '个性端南交点', actual: persSNStr, expected: expected.personality.southNode },
      { name: '设计端北交点', actual: designNNStr, expected: expected.design.northNode },
      { name: '设计端南交点', actual: designSNStr, expected: expected.design.southNode }
    ];

    let allPassed = true;
    checks.forEach(check => {
      const passed = check.actual === check.expected;
      const icon = passed ? '✓' : '✗';
      console.log(`${icon} ${check.name}: ${check.actual} (期望: ${check.expected})`);
      if (!passed) allPassed = false;
    });

    console.log('');
    if (allPassed) {
      console.log('🎉 所有验证通过！已实现100%精度计算！');
    } else {
      console.log('⚠️ 部分验证未通过');
    }

    // 显示其他核心数据
    console.log('\n=== 其他核心数据 ===');
    console.log('类型:', result.analysis?.type);
    console.log('权威:', result.analysis?.authority);
    console.log('人生角色:', result.analysis?.profile);
    console.log('定义:', result.analysis?.definition);

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testAPICalculation();
