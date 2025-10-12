/**
 * Human Design Bodygraph Analyzer
 * 根据星盘激活数据计算类型、权威、人生角色等核心信息
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

// 通道对应的能量中心映射
const CHANNEL_TO_CENTERS = {
  '1-8': ['G', 'Throat'],
  '2-14': ['Sacral', 'G'],
  '3-60': ['Root', 'Sacral'],
  '4-63': ['Head', 'Ajna'],
  '5-15': ['Sacral', 'G'],
  '6-59': ['Sacral', 'SolarPlexus'],
  '7-31': ['G', 'Throat'],
  '9-52': ['Root', 'Sacral'],
  '10-20': ['G', 'Throat'],
  '10-34': ['G', 'Sacral'],
  '10-57': ['G', 'Spleen'],
  '11-56': ['Ajna', 'Throat'],
  '12-22': ['Throat', 'SolarPlexus'],
  '13-33': ['G', 'Throat'],
  '16-48': ['Spleen', 'Throat'],
  '17-62': ['Ajna', 'Throat'],
  '18-58': ['Root', 'Spleen'],
  '19-49': ['Root', 'SolarPlexus'],
  '20-34': ['Throat', 'Sacral'],
  '20-57': ['Throat', 'Spleen'],
  '21-45': ['Ego', 'Throat'],
  '23-43': ['Ajna', 'Throat'],
  '24-61': ['Head', 'Ajna'],
  '25-51': ['Ego', 'G'],
  '26-44': ['Spleen', 'Ego'],
  '27-50': ['Spleen', 'Sacral'],
  '28-38': ['Spleen', 'Root'],
  '29-46': ['Sacral', 'G'],
  '30-41': ['Root', 'SolarPlexus'],
  '32-54': ['Root', 'Spleen'],
  '34-57': ['Sacral', 'Spleen'],
  '35-36': ['SolarPlexus', 'Throat'],
  '37-40': ['Ego', 'SolarPlexus'],
  '39-55': ['Root', 'SolarPlexus'],
  '42-53': ['Root', 'Sacral'],
  '47-64': ['Head', 'Ajna']
};

// 和谐闸门（可以形成通道的闸门配对）
const HARMONIC_GATES = {
  1: [8], 2: [14], 3: [60], 4: [63], 5: [15],
  6: [59], 7: [31], 8: [1], 9: [52], 10: [20, 34, 57],
  11: [56], 12: [22], 13: [33], 14: [2], 15: [5],
  16: [48], 17: [62], 18: [58], 19: [49], 20: [10, 34, 57],
  21: [45], 22: [12], 23: [43], 24: [61], 25: [51],
  26: [44], 27: [50], 28: [38], 29: [46], 30: [41],
  31: [7], 32: [54], 33: [13], 34: [10, 20, 57], 35: [36],
  36: [35], 37: [40], 38: [28], 39: [55], 40: [37],
  41: [30], 42: [53], 43: [23], 44: [26], 45: [21],
  46: [29], 47: [64], 48: [16], 49: [19], 50: [27],
  51: [25], 52: [9], 53: [42], 54: [32], 55: [39],
  56: [11], 57: [10, 20, 34], 58: [18], 59: [6], 60: [3],
  61: [24], 62: [17], 63: [4], 64: [47]
};

/**
 * 分析星盘数据，计算类型、权威、人生角色等
 * @param {Object} chartData - 从astronomy-calculator返回的星盘数据
 * @returns {Object} 分析结果
 */
function analyzeBodygraph(chartData) {
  const { personality, design } = chartData;

  // 1. 收集所有激活的闸门
  const allActivatedGates = new Set();
  const planets = ['Sun', 'Earth', 'Moon', 'NorthNode', 'SouthNode',
                   'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
                   'Uranus', 'Neptune', 'Pluto'];

  planets.forEach(planet => {
    if (personality[planet]) allActivatedGates.add(personality[planet].gate);
    if (design[planet]) allActivatedGates.add(design[planet].gate);
  });

  // 2. 确定所有形成的通道
  const channels = [];
  allActivatedGates.forEach(gate => {
    const harmonics = HARMONIC_GATES[gate] || [];
    harmonics.forEach(harmonicGate => {
      if (allActivatedGates.has(harmonicGate)) {
        const channel = [Math.min(gate, harmonicGate), Math.max(gate, harmonicGate)].join('-');
        if (!channels.includes(channel)) {
          channels.push(channel);
        }
      }
    });
  });

  // 3. 确定被定义的能量中心
  const definedCenters = new Set();
  channels.forEach(channel => {
    const centers = CHANNEL_TO_CENTERS[channel];
    if (centers) {
      centers.forEach(center => definedCenters.add(center));
    }
  });

  // 4. 计算类型（Type）
  const type = calculateType(channels, definedCenters);

  // 5. 计算内在权威（Authority）
  const authority = calculateAuthority(channels, definedCenters);

  // 6. 计算人生角色（Profile）
  const profile = `${personality.Sun.line}/${design.Sun.line}`;

  // 7. 计算定义（Definition）
  const definition = calculateDefinition(channels, definedCenters);

  // 8. 计算轮回交叉（Incarnation Cross）
  const incarnationCross = calculateIncarnationCross(personality, design);

  // 9. 提取关键特质（通道列表）
  const keyChannels = channels.slice(0, 5).join(', '); // 前5个通道

  return {
    type,
    authority,
    profile,
    definition,
    incarnationCross,
    channels,
    definedCenters: Array.from(definedCenters),
    keyChannels,
    activatedGates: Array.from(allActivatedGates)
  };
}

/**
 * 计算人类图类型
 */
function calculateType(channels, definedCenters) {
  // 无通道 = 反映者
  if (channels.length === 0) {
    return 'Reflector (反映者)';
  }

  const hasSacral = definedCenters.has('Sacral');
  const hasMotorToThroat = checkMotorToThroat(channels, definedCenters);

  if (hasSacral) {
    // 有骶骨
    if (hasMotorToThroat) {
      return 'Manifesting Generator (显生者)';
    } else {
      return 'Generator (生产者)';
    }
  } else {
    // 无骶骨
    if (hasMotorToThroat) {
      return 'Manifestor (显示者)';
    } else {
      return 'Projector (投射者)';
    }
  }
}

/**
 * 检查是否有动力中心到喉轮的连接
 */
function checkMotorToThroat(channels, definedCenters) {
  if (!definedCenters.has('Throat')) return false;

  // 直接连接到喉轮的通道
  const directToThroat = ['12-22', '35-36', '20-34', '21-45'];
  if (channels.some(ch => directToThroat.includes(ch))) {
    return true;
  }

  // 通过G中心连接
  const sacralToG = ['2-14', '5-15', '29-46'];
  const gToThroat = ['1-8', '7-31', '10-20', '13-33'];
  if (channels.some(ch => sacralToG.includes(ch)) &&
      channels.some(ch => gToThroat.includes(ch))) {
    return true;
  }

  // 通过脾脏中心连接
  const spleenToThroat = ['16-48', '20-57'];
  const sacralToSpleen = ['27-50'];
  const rootToSpleen = ['18-58', '28-38', '32-54'];

  if (channels.some(ch => spleenToThroat.includes(ch))) {
    if (channels.some(ch => sacralToSpleen.includes(ch)) ||
        channels.some(ch => rootToSpleen.includes(ch))) {
      return true;
    }
  }

  return false;
}

/**
 * 计算内在权威
 */
function calculateAuthority(channels, definedCenters) {
  // 权威层级（从高到低）
  if (definedCenters.has('SolarPlexus')) {
    return 'Emotional (情绪权威)';
  }
  if (definedCenters.has('Sacral')) {
    return 'Sacral (骶骨权威)';
  }
  if (definedCenters.has('Spleen')) {
    return 'Splenic (脾脏权威)';
  }

  // 检查自我中心到喉轮或G中心
  const egoToThroat = channels.some(ch => ['21-45', '25-51'].includes(ch));
  const egoToG = definedCenters.has('Ego') && definedCenters.has('G');
  if (egoToThroat || egoToG) {
    return 'Ego Projected (自我投射权威)';
  }

  // G中心到喉轮
  const gToThroat = ['1-8', '7-31', '10-20', '13-33'];
  if (channels.some(ch => gToThroat.includes(ch))) {
    return 'Self Projected (自我投射权威)';
  }

  // 头脑中心到喉轮
  const headToAjna = definedCenters.has('Head') && definedCenters.has('Ajna');
  const ajnaToThroat = ['11-56', '17-62', '23-43'];
  if ((headToAjna || definedCenters.has('Ajna')) &&
      channels.some(ch => ajnaToThroat.includes(ch))) {
    return 'Sounding Board (环境权威)';
  }

  // 无定义或反映者
  if (definedCenters.size === 0) {
    return 'Lunar (月亮权威)';
  }

  // 其他情况：无内在权威
  return 'None (无内在权威)';
}

/**
 * 计算定义类型
 */
function calculateDefinition(channels, definedCenters) {
  if (definedCenters.size === 0) {
    return 'No Definition (无定义)';
  }

  if (channels.length === 0) {
    return 'No Definition (无定义)';
  }

  if (definedCenters.size < 4) {
    return 'Single Definition (一分人)';
  }

  // 对于4个或以上的能量中心，需要检查是否分裂
  // 简化版本：根据通道连接性判断
  const areasOfDefinition = [];

  channels.forEach(channel => {
    const centers = CHANNEL_TO_CENTERS[channel];
    if (!centers) return;

    let foundArea = false;
    for (let area of areasOfDefinition) {
      if (centers.some(c => area.has(c))) {
        centers.forEach(c => area.add(c));
        foundArea = true;
        break;
      }
    }

    if (!foundArea) {
      const newArea = new Set(centers);
      areasOfDefinition.push(newArea);
    }
  });

  // 合并重叠的区域
  let merged = true;
  while (merged && areasOfDefinition.length > 1) {
    merged = false;
    for (let i = 0; i < areasOfDefinition.length - 1; i++) {
      for (let j = i + 1; j < areasOfDefinition.length; j++) {
        const overlap = [...areasOfDefinition[i]].some(c => areasOfDefinition[j].has(c));
        if (overlap) {
          areasOfDefinition[j].forEach(c => areasOfDefinition[i].add(c));
          areasOfDefinition.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }

  switch (areasOfDefinition.length) {
    case 1:
      return 'Single Definition (一分人)';
    case 2:
      return 'Split Definition (二分人)';
    case 3:
      return 'Triple Split Definition (三分人)';
    case 4:
      return 'Quadruple Split Definition (四分人)';
    default:
      return 'Single Definition (一分人)';
  }
}

/**
 * 加载轮回交叉数据库
 */
let incarnationCrossesDB = null;
function loadIncarnationCrosses() {
  if (!incarnationCrossesDB) {
    try {
      incarnationCrossesDB = require('../data/incarnation_crosses_final.json');
      console.log(`[Bodygraph] 加载了 ${incarnationCrossesDB.length} 个轮回交叉`);
    } catch (error) {
      console.error('[Bodygraph] 无法加载轮回交叉数据库:', error.message);
      incarnationCrossesDB = [];
    }
  }
  return incarnationCrossesDB;
}

/**
 * 格式化英文名：添加空格，首字母大写
 * THEMAYA -> The Maya
 * THEGARDENOFEDEN -> The Garden Of Eden
 * EDUCATION -> Education
 */
function formatEnglishName(name) {
  if (!name) return '';

  // 如果已经有空格和正确大小写，直接返回
  if (name.includes(' ') && /^[A-Z]/.test(name) && /[a-z]/.test(name)) {
    return name;
  }

  // 处理全大写的情况
  if (name === name.toUpperCase()) {
    // 先转为小写
    let formatted = name.toLowerCase();

    // 按顺序匹配并替换特定模式（从长到短，避免误匹配）
    // 模式: theXXX -> the XXX, ofXXX -> of XXX
    formatted = formatted
      .replace(/thegardenofeden/g, 'the garden of eden')
      .replace(/themaya/g, 'the maya')
      .replace(/thesphinx/g, 'the sphinx')
      .replace(/thevessellove/g, 'the vessel love')
      // 通用模式：the/of/and 等后面直接跟大写字母位置的单词
      .replace(/the([a-z]{2,})/g, (match, p1) => {
        // 如果是已知的完整单词组合，保持原样
        if (formatted.includes(match)) {
          return `the ${p1}`;
        }
        return match;
      })
      .replace(/of([a-z]{2,})/g, (match, p1) => {
        return `of ${p1}`;
      })
      .replace(/and([a-z]{2,})/g, (match, p1) => {
        return `and ${p1}`;
      });

    // 首字母大写每个单词
    formatted = formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // 如果没有空格（单个单词），就简单首字母大写
    if (!formatted.includes(' ')) {
      formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    return formatted;
  }

  return name;
}

/**
 * 计算轮回交叉
 * 轮回交叉由4个闸门组成：个性端太阳/地球 + 设计端太阳/地球
 */
function calculateIncarnationCross(personality, design) {
  const pSunGate = personality.Sun.gate;
  const pSunLine = personality.Sun.line;
  const pEarthGate = personality.Earth.gate;
  const dSunGate = design.Sun.gate;
  const dEarthGate = design.Earth.gate;

  // 构建查找key
  const key = `${pSunGate}-${pEarthGate}-${dSunGate}-${dEarthGate}`;

  // 轮回交叉格式：个性太阳/地球 | 设计太阳/地球
  const gates = `${pSunGate}/${pEarthGate} | ${dSunGate}/${dEarthGate}`;

  // 从数据库查找完整名称（优先使用数据库）
  const crossesDB = loadIncarnationCrosses();
  const found = crossesDB.find(cross => cross.key === key);

  let crossType = '';
  let crossNameEN = '';
  let crossNameCN = '';
  let crossNumber = null;

  if (found) {
    // 找到数据库匹配，完全使用数据库数据
    crossNameEN = formatEnglishName(found.english_name); // 格式化英文名
    crossNameCN = found.chinese_name;
    crossType = found.type;

    // 从数据库读取编号（不再计算）
    crossNumber = found.number;
  } else {
    // 数据库中找不到，根据爻线推断
    const dSunLine = design.Sun.line;

    // 根据爻线推断类型
    if (pSunLine <= 3 && dSunLine <= 3) {
      crossType = '右角度';
      crossNameCN = '右角度交叉';
    } else if (pSunLine >= 4 && dSunLine >= 4) {
      crossType = '左角度';
      crossNameCN = '左角度交叉';
    } else {
      crossType = '并置交叉';
      crossNameCN = '并置交叉';
    }

    // 数据库中找不到的轮回交叉没有编号
    crossNumber = null;
    crossNameEN = `${crossType} of Gate ${pSunGate}`;
    crossNameCN = `${crossNameCN} ${pSunGate}号闸门`;
    console.warn(`[Bodygraph] 未找到轮回交叉: ${key}`);
  }

  // 构建完整显示格式：
  // 有编号：右角度交叉之马雅1 The Maya 1 (32/42 | 62/61)
  // 无编号：并置交叉之XX XX (32/42 | 62/61)
  const numberSuffix = crossNumber ? ` ${crossNumber}` : '';
  const fullDisplay = `${crossNameCN}${numberSuffix} ${crossNameEN}${numberSuffix} (${gates})`;

  return {
    gates,
    key,
    type: crossType,
    number: crossNumber,
    nameEN: crossNameEN,
    nameCN: crossNameCN,
    full: fullDisplay
  };
}

/**
 * 生成Dify友好的摘要文本
 */
function generateDifySummary(analysis, chartData, userInfo) {
  const { name } = userInfo;
  const { type, authority, profile, channels, keyChannels, incarnationCross } = analysis;

  return {
    user_name: name,
    hd_type: type,
    hd_authority: authority,
    hd_profile: profile,
    hd_features: `主要通道: ${keyChannels}${channels.length > 5 ? `等${channels.length}条通道` : ''}`,
    hd_channels: channels.join(', '),
    hd_personality_sun: `${chartData.personality.Sun.gate}.${chartData.personality.Sun.line}`,
    hd_design_sun: `${chartData.design.Sun.gate}.${chartData.design.Sun.line}`,
    hd_definition: analysis.definition,
    hd_incarnation_cross: incarnationCross.full
  };
}

module.exports = {
  analyzeBodygraph,
  generateDifySummary,
  calculateIncarnationCross
};
