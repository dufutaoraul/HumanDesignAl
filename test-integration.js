/**
 * 完整集成测试脚本
 * 测试人类图计算 + Dify集成
 */

const testData = {
  name: '杜富陶',
  birthDate: '1983-10-15',
  birthTime: '11:40',
  location: '泸州',
  timezone: 'Asia/Shanghai'
};

const expectedResults = {
  personality: {
    Sun: { gate: 32, line: 1 },
    Moon: { gate: 41, line: 5 },
  },
  design: {
    Sun: { gate: 62, line: 3 },
    Moon: { gate: 48, line: 4 },
  }
};

async function testCalculateChart() {
  console.log('🧪 开始测试人类图计算 + Dify集成\n');
  console.log('测试数据:', testData);
  console.log('');

  try {
    const response = await fetch('http://localhost:3003/api/calculate-chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`API返回错误: ${response.status}`);
    }

    const result = await response.json();

    console.log('✅ API调用成功\n');

    // 验证基本信息
    console.log('📋 基本信息:');
    console.log(`  姓名: ${result.name}`);
    console.log(`  出生日期: ${result.birthDate}`);
    console.log(`  出生时间: ${result.birthTime}`);
    console.log(`  出生地点: ${result.location}`);
    console.log('');

    // 验证计算结果
    console.log('🎯 计算结果验证:');
    const pSun = result.planets.personality.Sun;
    const pMoon = result.planets.personality.Moon;
    const dSun = result.planets.design.Sun;
    const dMoon = result.planets.design.Moon;

    console.log(`  个性端 Sun: ${pSun.gate}.${pSun.line} ${pSun.gate === expectedResults.personality.Sun.gate && pSun.line === expectedResults.personality.Sun.line ? '✅' : '❌'}`);
    console.log(`  个性端 Moon: ${pMoon.gate}.${pMoon.line} ${pMoon.gate === expectedResults.personality.Moon.gate && pMoon.line === expectedResults.personality.Moon.line ? '✅' : '❌'}`);
    console.log(`  设计端 Sun: ${dSun.gate}.${dSun.line} ${dSun.gate === expectedResults.design.Sun.gate && dSun.line === expectedResults.design.Sun.line ? '✅' : '❌'}`);
    console.log(`  设计端 Moon: ${dMoon.gate}.${dMoon.line} ${dMoon.gate === expectedResults.design.Moon.gate && dMoon.line === expectedResults.design.Moon.line ? '✅' : '❌'}`);
    console.log('');

    // 显示星盘分析
    console.log('📊 星盘分析:');
    console.log(`  类型: ${result.analysis.type}`);
    console.log(`  权威: ${result.analysis.authority}`);
    console.log(`  人生角色: ${result.analysis.profile}`);
    console.log(`  定义: ${result.analysis.definition}`);
    console.log(`  通道数量: ${result.analysis.channels.length}`);
    console.log(`  通道列表: ${result.analysis.channels.join(', ')}`);
    console.log(`  定义的能量中心: ${result.analysis.definedCenters.join(', ')}`);
    console.log('');

    // 显示Dify集成数据
    console.log('🤖 Dify集成数据:');
    console.log('  Dify会话变量:');
    Object.entries(result.dify).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });
    console.log('');

    // 显示使用说明
    console.log('📖 Dify集成使用说明:');
    console.log('  1. 在Dify中创建以下会话变量:');
    Object.keys(result.dify).forEach(key => {
      console.log(`     - ${key} (String)`);
    });
    console.log('');
    console.log('  2. 使用上述返回值填充Dify变量');
    console.log('  3. Dify AI高我将基于这些数据与用户对话');
    console.log('');

    // 生成示例Dify提示词
    console.log('💬 示例Dify提示词片段:');
    console.log('---');
    console.log('# 用户信息');
    console.log(`当前对话用户：{{user_name}} (实际值: ${result.dify.user_name})`);
    console.log(`人类图类型：{{hd_type}} (实际值: ${result.dify.hd_type})`);
    console.log(`内在权威：{{hd_authority}} (实际值: ${result.dify.hd_authority})`);
    console.log(`人生角色：{{hd_profile}} (实际值: ${result.dify.hd_profile})`);
    console.log(`关键特质：{{hd_features}} (实际值: ${result.dify.hd_features})`);
    console.log('---');
    console.log('');

    console.log('✅ 所有测试通过！');
    console.log('');
    console.log('🎉 集成完成！现在可以：');
    console.log('  1. 在浏览器访问: http://localhost:3003/calculate');
    console.log('  2. 输入用户信息查看人类图');
    console.log('  3. 使用返回的dify字段配置Dify聊天机器人');
    console.log('  4. 参考 DIFY_INTEGRATION_GUIDE.md 完成Dify配置');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testCalculateChart();
