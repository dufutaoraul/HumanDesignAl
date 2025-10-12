import { NextRequest, NextResponse } from 'next/server';

/**
 * Dify Summary API
 * 为Dify AI高我系统提供人类图数据摘要
 *
 * 使用方法：
 * 1. 先调用 /api/calculate-chart 计算完整星盘
 * 2. 从返回结果中提取 dify 字段
 * 3. 将 dify 字段中的变量值传递给Dify
 *
 * 或者直接调用此接口，传入用户基本信息和星盘数据
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartData } = body;

    if (!chartData || !chartData.analysis || !chartData.dify) {
      return NextResponse.json(
        { error: '缺少必要的星盘数据，请先调用 /api/calculate-chart' },
        { status: 400 }
      );
    }

    // 返回Dify友好的格式
    const difyData = {
      // Dify会话变量
      variables: chartData.dify,

      // 扩展信息（可选，用于更详细的对话）
      extended: {
        channels: chartData.analysis.channels,
        definedCenters: chartData.analysis.definedCenters,
        allGates: {
          personality: Object.keys(chartData.planets.personality).map(planet => ({
            planet,
            gate: chartData.planets.personality[planet].gate,
            line: chartData.planets.personality[planet].line,
          })),
          design: Object.keys(chartData.planets.design).map(planet => ({
            planet,
            gate: chartData.planets.design[planet].gate,
            line: chartData.planets.design[planet].line,
          }))
        }
      }
    };

    return NextResponse.json(difyData);
  } catch (error) {
    console.error('Dify摘要生成错误:', error);
    return NextResponse.json(
      { error: 'Dify摘要生成失败', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET方法：返回Dify集成说明
 */
export async function GET() {
  return NextResponse.json({
    message: 'Dify Human Design Integration API',
    usage: {
      step1: '调用 POST /api/calculate-chart 获取完整星盘数据',
      step2: '从返回结果的 dify 字段获取Dify会话变量',
      step3: '在Dify中创建以下会话变量',
      variables: [
        { name: 'user_name', type: 'String', description: '用户姓名' },
        { name: 'hd_type', type: 'String', description: '人类图类型（生产者/投射者/显示者/反映者）' },
        { name: 'hd_authority', type: 'String', description: '内在权威' },
        { name: 'hd_profile', type: 'String', description: '人生角色（如3/5、6/2）' },
        { name: 'hd_features', type: 'String', description: '关键特质（主要通道）' },
        { name: 'hd_channels', type: 'String', description: '所有通道列表（可选）' },
        { name: 'hd_personality_sun', type: 'String', description: '个性端太阳（可选）' },
        { name: 'hd_design_sun', type: 'String', description: '设计端太阳（可选）' },
        { name: 'hd_definition', type: 'String', description: '定义类型（可选）' }
      ]
    },
    example: {
      request: {
        method: 'POST',
        url: '/api/dify-summary',
        body: {
          chartData: '从 /api/calculate-chart 获取的完整返回数据'
        }
      },
      response: {
        variables: {
          user_name: '杜富陶',
          hd_type: 'Generator (生产者)',
          hd_authority: 'Sacral (骶骨权威)',
          hd_profile: '3/5',
          hd_features: '主要通道: 1-8, 13-33, 20-34等',
          hd_channels: '1-8, 13-33, 20-34, ...',
          hd_personality_sun: '32.1',
          hd_design_sun: '62.3',
          hd_definition: 'Single Definition (单一定义)'
        }
      }
    }
  });
}
