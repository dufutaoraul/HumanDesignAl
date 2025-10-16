/**
 * 验证轮回交叉计算的准确性
 */

async function testCrossCalculation() {
  const testData = {
    name: '刘勇',
    birthDate: '1970-12-19',
    birthTime: '14:30',
    location: '北京',
    timezone: 'Asia/Shanghai'
  };

  console.log('=== 测试轮回交叉计算 ===');
  console.log('测试数据:', testData);
  console.log('');

  try {
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

    // 检查轮回交叉
    const cross = result.analysis?.incarnationCross;

    console.log('=== 轮回交叉信息 ===');
    console.log('类型:', cross?.type);
    console.log('闸门:', cross?.gates);
    console.log('查找key:', cross?.key);
    console.log('中文名称:', cross?.nameCN);
    console.log('英文名称:', cross?.nameEN);
    console.log('完整名称:', cross?.full);
    console.log('');

    // 检查人生角色
    console.log('=== 人生角色信息 ===');
    console.log('人生角色:', result.analysis?.profile);
    console.log('个性端太阳:', `${result.planets.personality.Sun.gate}.${result.planets.personality.Sun.line}`);
    console.log('设计端太阳:', `${result.planets.design.Sun.gate}.${result.planets.design.Sun.line}`);
    console.log('');

    // 验证逻辑
    const pSunLine = result.planets.personality.Sun.line;
    const dSunLine = result.planets.design.Sun.line;

    console.log('=== 逻辑验证 ===');
    console.log(`个性端太阳爻: ${pSunLine}`);
    console.log(`设计端太阳爻: ${dSunLine}`);

    let expectedType = '';
    if (pSunLine <= 3 && dSunLine <= 3) {
      expectedType = '右角度交叉';
    } else if (pSunLine >= 4 && dSunLine >= 4) {
      expectedType = '左角度交叉';
    } else {
      expectedType = '并置交叉';
    }

    console.log(`预期类型: ${expectedType}`);
    console.log(`实际类型: ${cross?.type}`);

    if (cross?.nameCN.includes(expectedType)) {
      console.log('✓ 轮回交叉类型正确');
    } else {
      console.log('✗ 轮回交叉类型不正确');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testCrossCalculation();
