/**
 * 通道验证器 - 基于数据库中的36通道定义
 * 用于验证和修正AI识别的通道
 */

// 36通道定义（从数据库导入的标准定义）
export const VALID_CHANNELS = [
  { gates: [1, 8], name: '创造' },
  { gates: [2, 14], name: '脉动' },
  { gates: [3, 60], name: '突变' },
  { gates: [4, 63], name: '逻辑' },
  { gates: [5, 15], name: '韵律' },
  { gates: [6, 59], name: '亲密' },
  { gates: [7, 31], name: '领导者' },
  { gates: [9, 52], name: '专注' },
  { gates: [10, 20], name: '觉醒' },
  { gates: [10, 34], name: '探索' },
  { gates: [10, 57], name: '完美形式' },
  { gates: [11, 56], name: '好奇' },
  { gates: [12, 22], name: '开放' },
  { gates: [13, 33], name: '浪子' },
  { gates: [16, 48], name: '波长' },
  { gates: [17, 62], name: '接受' },
  { gates: [18, 58], name: '评判' },
  { gates: [19, 49], name: '综合' },
  { gates: [20, 34], name: '魅力' },
  { gates: [20, 57], name: '脑波' },
  { gates: [21, 45], name: '金钱线' },
  { gates: [23, 43], name: '结构' },
  { gates: [24, 61], name: '觉知' },
  { gates: [25, 51], name: '发起' },
  { gates: [26, 44], name: '臣服' },
  { gates: [27, 50], name: '保存' },
  { gates: [28, 38], name: '挣扎' },
  { gates: [29, 46], name: '发现' },
  { gates: [30, 41], name: '认知' },
  { gates: [32, 54], name: '蜕变' },
  { gates: [34, 57], name: '力量' },
  { gates: [35, 36], name: '无常' },
  { gates: [37, 40], name: '社区' },
  { gates: [39, 55], name: '情绪' },
  { gates: [42, 53], name: '成熟' },
  { gates: [47, 64], name: '抽象' }
]

/**
 * 从识别的闸门列表中提取有效通道
 * @param gates - 识别到的闸门数组（格式如 ["23.4", "43.1", ...]）
 * @returns 有效通道数组（格式如 ["23-43", "1-8"]）
 */
export function extractValidChannels(gates: string[]): string[] {
  // 提取闸门号码（去掉爻线）
  const gateNumbers = gates
    .map(gate => {
      const match = gate.match(/^(\d+)/)
      return match ? parseInt(match[1]) : null
    })
    .filter(n => n !== null) as number[]

  // 去重
  const uniqueGates = Array.from(new Set(gateNumbers))

  // 检查哪些通道被激活
  const activatedChannels: string[] = []

  for (const channel of VALID_CHANNELS) {
    const [gate1, gate2] = channel.gates

    // 如果通道的两个闸门都被激活，则该通道存在
    if (uniqueGates.includes(gate1) && uniqueGates.includes(gate2)) {
      activatedChannels.push(`${gate1}-${gate2}`)
    }
  }

  return activatedChannels
}

/**
 * 验证通道是否有效
 * @param channel - 通道字符串（格式如 "1-8"）
 * @returns 是否为有效通道
 */
export function isValidChannel(channel: string): boolean {
  const [gate1Str, gate2Str] = channel.split('-')
  const gate1 = parseInt(gate1Str)
  const gate2 = parseInt(gate2Str)

  return VALID_CHANNELS.some(ch => {
    const [g1, g2] = ch.gates
    return (g1 === gate1 && g2 === gate2) || (g1 === gate2 && g2 === gate1)
  })
}

/**
 * 获取通道名称
 * @param channel - 通道字符串（格式如 "1-8"）
 * @returns 通道中文名称
 */
export function getChannelName(channel: string): string | null {
  const [gate1Str, gate2Str] = channel.split('-')
  const gate1 = parseInt(gate1Str)
  const gate2 = parseInt(gate2Str)

  const found = VALID_CHANNELS.find(ch => {
    const [g1, g2] = ch.gates
    return (g1 === gate1 && g2 === gate2) || (g1 === gate2 && g2 === gate1)
  })

  return found ? found.name : null
}

/**
 * 从行星闸门数据中提取有效通道
 * @param planetaryGates - 行星闸门对象
 * @returns 有效通道数组
 */
export function extractChannelsFromPlanetary(planetaryGates: any): string[] {
  const allGates: string[] = []

  // 提取所有行星的设计和人格闸门
  for (const planet in planetaryGates) {
    const data = planetaryGates[planet]
    if (data.design) allGates.push(data.design)
    if (data.personality) allGates.push(data.personality)
  }

  return extractValidChannels(allGates)
}
