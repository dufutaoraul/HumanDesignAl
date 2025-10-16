/**
 * 导入人类图静态数据到 Supabase
 * 运行: npx tsx scripts/import-static-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// 加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误：缺少 Supabase 环境变量')
  console.error('请确保 .env.local 中设置了:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../data')

/**
 * 读取 JSON 文件
 */
function readJsonFile(filename: string): any {
  const filePath = path.join(DATA_DIR, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * 导入闸门数据
 */
async function importGates() {
  console.log('\n📌 导入闸门数据...')

  const gateData = readJsonFile('gate_centers.json')
  const oppositeData = readJsonFile('gate_opposites.json')

  // 合并数据
  const gates = gateData.map((item: any) => {
    const opposite = oppositeData.find((o: any) => o.gate === item.gate)
    return {
      gate: item.gate,
      gate_name: item.gate_name,
      center: item.center,
      center_chinese: item.center_chinese,
      center_english: item.center_english,
      opposite_gate: opposite?.opposite_gate || 0,
      opposite_name: opposite?.opposite_name || '',
      description: null,
      keywords: null
    }
  })

  const { data, error } = await supabase
    .from('gates')
    .upsert(gates, { onConflict: 'gate' })

  if (error) {
    console.error('❌ 闸门数据导入失败:', error)
    throw error
  }

  console.log(`✅ 成功导入 ${gates.length} 个闸门数据`)
}

/**
 * 导入能量中心数据
 */
async function importCenters() {
  console.log('\n📌 导入能量中心数据...')

  const centers = [
    {
      center_key: 'head',
      chinese_name: '头部中心',
      english_name: 'Head Center',
      is_motor: false,
      description: '灵感和压力的中心',
      keywords: ['灵感', '压力', '疑问']
    },
    {
      center_key: 'ajna',
      chinese_name: '逻辑中心',
      english_name: 'Ajna Center',
      is_motor: false,
      description: '思考和概念化的中心',
      keywords: ['思考', '概念', '理解']
    },
    {
      center_key: 'throat',
      chinese_name: '喉咙中心',
      english_name: 'Throat Center',
      is_motor: false,
      description: '表达和显化的中心',
      keywords: ['表达', '沟通', '显化']
    },
    {
      center_key: 'g',
      chinese_name: 'G中心',
      english_name: 'G Center',
      is_motor: false,
      description: '身份和方向的中心',
      keywords: ['身份', '方向', '爱']
    },
    {
      center_key: 'heart',
      chinese_name: '意志力中心',
      english_name: 'Heart/Ego Center',
      is_motor: true,
      description: '意志力和自我价值的中心',
      keywords: ['意志力', '承诺', '价值']
    },
    {
      center_key: 'sacral',
      chinese_name: '荐骨中心',
      english_name: 'Sacral Center',
      is_motor: true,
      description: '生命力和工作能量的中心',
      keywords: ['生命力', '工作', '回应']
    },
    {
      center_key: 'solar_plexus',
      chinese_name: '情绪中心',
      english_name: 'Solar Plexus/Emotional Center',
      is_motor: true,
      description: '情绪和感受的中心',
      keywords: ['情绪', '感受', '波动']
    },
    {
      center_key: 'spleen',
      chinese_name: '直觉中心',
      english_name: 'Spleen Center',
      is_motor: false,
      description: '直觉和生存本能的中心',
      keywords: ['直觉', '生存', '当下']
    },
    {
      center_key: 'root',
      chinese_name: '根部中心',
      english_name: 'Root Center',
      is_motor: true,
      description: '压力和驱动力的中心',
      keywords: ['压力', '驱动', '进化']
    }
  ]

  const { data, error } = await supabase
    .from('centers')
    .upsert(centers, { onConflict: 'center_key' })

  if (error) {
    console.error('❌ 能量中心数据导入失败:', error)
    throw error
  }

  console.log(`✅ 成功导入 ${centers.length} 个能量中心数据`)
}

/**
 * 导入通道数据
 */
async function importChannels() {
  console.log('\n📌 导入通道数据...')

  const channelsData = readJsonFile('channels_with_centers.json')

  const channels = channelsData.map((item: any) => ({
    channel_key: item.channel_key,
    gate1: item.gates[0],
    gate2: item.gates[1],
    center1: item.center1,
    center1_chinese: item.center1_chinese,
    center1_english: item.center1_english,
    center2: item.center2,
    center2_chinese: item.center2_chinese,
    center2_english: item.center2_english,
    chinese_name: item.chinese_name,
    english_name: item.english_name || '',
    description: item.description || null,
    connection_key: item.connection_key,
    connection_chinese: item.connection_chinese,
    connection_english: item.connection_english
  }))

  const { data, error } = await supabase
    .from('channels')
    .upsert(channels, { onConflict: 'channel_key' })

  if (error) {
    console.error('❌ 通道数据导入失败:', error)
    throw error
  }

  console.log(`✅ 成功导入 ${channels.length} 条通道数据`)
}

/**
 * 导入轮回交叉数据
 */
async function importIncarnationCrosses() {
  console.log('\n📌 导入轮回交叉数据...')

  const crossesData = readJsonFile('incarnation_crosses_complete.json')

  const crosses = crossesData.map((item: any) => {
    // 将类型映射为英文缩写
    const typeMap: Record<string, string> = {
      '右角度': 'right',
      '左角度': 'left',
      '并列': 'juxta'
    }
    const typeEn = typeMap[item.type] || item.type

    return {
      cross_key: `${typeEn}-${item.key}`, // 使用 "right-1-2-7-13" 格式确保唯一性
      cross_type: typeEn,
      chinese_name: item.chinese_name,
      english_name: item.english_name || '',
      black_sun_gate: item.gates.black_sun,
      red_sun_gate: item.gates.red_sun,
      black_earth_gate: item.gates.black_earth,
      red_earth_gate: item.gates.red_earth,
      line_info: item.lines || null,
      description: item.description || null,
      keywords: null
    }
  })

  const { data, error } = await supabase
    .from('incarnation_crosses')
    .upsert(crosses, { onConflict: 'cross_key' })

  if (error) {
    console.error('❌ 轮回交叉数据导入失败:', error)
    throw error
  }

  console.log(`✅ 成功导入 ${crosses.length} 条轮回交叉数据`)
}

/**
 * 主函数
 */
async function main() {
  console.log('=' .repeat(60))
  console.log('人类图静态数据导入工具')
  console.log('=' .repeat(60))

  try {
    // 按顺序导入数据
    await importCenters()      // 9 个能量中心
    await importGates()         // 64 个闸门
    await importChannels()      // 36 条通道
    await importIncarnationCrosses()  // 192 条轮回交叉

    console.log('\n' + '=' .repeat(60))
    console.log('✅ 所有静态数据导入完成！')
    console.log('=' .repeat(60))

    console.log('\n📊 数据统计:')
    console.log('  - 9 个能量中心')
    console.log('  - 64 个闸门')
    console.log('  - 36 条通道')
    console.log('  - 192 条轮回交叉')

  } catch (error) {
    console.error('\n❌ 导入过程中出现错误:', error)
    process.exit(1)
  }
}

// 运行主函数
main()
