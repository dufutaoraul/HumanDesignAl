/**
 * 批量格式化轮回交叉英文名称
 * 将 DIRECTION(THESPHINX) 格式化为 Direction (The Sphinx)
 */

const fs = require('fs');
const path = require('path');

// 读取JSON文件
const filePath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log(`读取到 ${crosses.length} 个轮回交叉`);

/**
 * 格式化英文名称
 * @param {string} name - 原始英文名称
 * @returns {string} - 格式化后的名称
 */
function formatEnglishName(name) {
  if (!name) return '';

  // 如果已经是正常格式（有小写字母和空格），直接返回
  if (/[a-z]/.test(name) && name.includes(' ')) {
    return name;
  }

  let formatted = name;

  // 处理括号内的内容
  // DIRECTION(THESPHINX) -> DIRECTION (THESPHINX)
  formatted = formatted.replace(/\(([A-Z]+)\)/g, (match, p1) => {
    return ` (${p1})`;
  });

  // 分离主名称和括号内容
  const mainPart = formatted.split('(')[0].trim();
  const bracketPart = formatted.includes('(') ? formatted.substring(formatted.indexOf('(')).trim() : '';

  // 格式化主名称
  let formattedMain = formatSingleName(mainPart);

  // 格式化括号内容
  let formattedBracket = '';
  if (bracketPart) {
    const innerName = bracketPart.replace(/[()]/g, '').trim();
    formattedBracket = ` (${formatSingleName(innerName)})`;
  }

  return formattedMain + formattedBracket;
}

/**
 * 格式化单个名称（无括号）
 */
function formatSingleName(name) {
  if (!name) return '';

  // 转为小写
  let lower = name.toLowerCase();

  // 特殊模式映射（手动处理常见组合）
  const patterns = {
    'themaya': 'the maya',
    'thesphinx': 'the sphinx',
    'thegardenofeden': 'the garden of eden',
    'thevessellove': 'the vessel love',
    'therevolutionary': 'the revolutionary',
    'thepenetrating': 'the penetrating',
    'theunexpected': 'the unexpected',
    'theconqueror': 'the conqueror',
    'thesleeper': 'the sleeper',
    'theplaneofservice': 'the plane of service',
    'planofservice': 'plane of service',
  };

  // 检查是否匹配特殊模式
  for (const [pattern, replacement] of Object.entries(patterns)) {
    if (lower === pattern) {
      return capitalizeWords(replacement);
    }
  }

  // 通用处理：在特定位置添加空格
  // the + 单词 -> the 单词
  lower = lower.replace(/^the([a-z])/, 'the $1');

  // of + 单词 -> of 单词
  lower = lower.replace(/of([a-z])/g, 'of $1');

  // and + 单词 -> and 单词
  lower = lower.replace(/and([a-z])/g, 'and $1');

  // 在大写字母前添加空格（如果还没有空格）
  // 但保留已经处理过的 the/of/and 等
  if (!lower.includes(' ')) {
    // 单个单词，直接首字母大写
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  // 首字母大写每个单词
  return capitalizeWords(lower);
}

/**
 * 首字母大写每个单词
 */
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 统计需要修改的数量
let modifiedCount = 0;
const changes = [];

crosses.forEach((cross, index) => {
  const original = cross.english_name;
  const formatted = formatEnglishName(original);

  if (original !== formatted) {
    modifiedCount++;
    changes.push({
      number: cross.number,
      original,
      formatted
    });

    // 更新数据
    crosses[index].english_name = formatted;
  }
});

console.log(`\n需要修改的轮回交叉: ${modifiedCount} 个`);
console.log('\n修改详情：');
changes.forEach(change => {
  console.log(`${change.number}. "${change.original}" -> "${change.formatted}"`);
});

// 备份原文件
const backupPath = path.join(__dirname, 'data', 'incarnation_crosses_final.backup.json');
fs.writeFileSync(backupPath, JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf-8')), null, 2), 'utf-8');
console.log(`\n✅ 已备份原文件到: incarnation_crosses_final.backup.json`);

// 保存修改后的文件
fs.writeFileSync(filePath, JSON.stringify(crosses, null, 2), 'utf-8');
console.log(`✅ 已保存格式化后的文件到: incarnation_crosses_final.json`);

console.log(`\n完成！共修改了 ${modifiedCount} 个轮回交叉的英文名称。`);
console.log(`\n请手动检查修改结果，如有问题可从备份文件恢复。`);
