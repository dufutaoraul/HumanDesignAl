/**
 * 修复轮回交叉英文名称的格式问题
 * 处理OCR识别导致的空格错误
 */

const fs = require('fs');
const path = require('path');

// 读取JSON文件
const filePath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log(`读取到 ${crosses.length} 个轮回交叉\n`);

/**
 * 修复英文名称格式
 */
function fixEnglishName(name) {
  if (!name) return '';

  // 如果已经是正常格式，直接返回
  if (!/\s[A-Z]\s|[a-z][A-Z]/.test(name) && name.includes(' ')) {
    // 检查是否有不正常的大写模式
    const hasWeirdCapitals = /[A-Z]\s[A-Z]/.test(name) && !/^The\s|^A\s/.test(name);
    if (!hasWeirdCapitals) {
      return name;
    }
  }

  let result = name;

  // 1. 处理括号：确保括号前有空格，括号内容独立处理
  let mainPart = '';
  let bracketPart = '';

  if (name.includes('(') || name.includes('（')) {
    // 统一使用英文括号
    result = result.replace(/（/g, '(').replace(/）/g, ')');

    const bracketStart = result.indexOf('(');
    if (bracketStart > 0) {
      mainPart = result.substring(0, bracketStart).trim();
      bracketPart = result.substring(bracketStart);
    } else {
      mainPart = result;
    }
  } else {
    mainPart = result;
  }

  // 2. 修复主名称部分
  mainPart = fixNamePart(mainPart);

  // 3. 修复括号内容
  if (bracketPart) {
    // 提取括号内的文本
    const innerText = bracketPart.replace(/[()]/g, '').trim();
    const fixedInner = fixNamePart(innerText);
    bracketPart = ` (${fixedInner})`;
  }

  return mainPart + bracketPart;
}

/**
 * 修复名称的一部分（不含括号）
 */
function fixNamePart(text) {
  if (!text) return '';

  // 移除所有空格，重新分词
  let noSpaces = text.replace(/\s+/g, '');

  // 特殊词汇映射（已知的完整单词）
  const knownWords = {
    'THEMAYA': 'The Maya',
    'THESPHINX': 'The Sphinx',
    'THEGARDENOFEDEN': 'The Garden Of Eden',
    'GARDENOFEDEN': 'Garden Of Eden',
    'THEVESSELLOFE': 'The Vessel Of Love',
    'THEVESSELOFLOVE': 'The Vessel Of Love',
    'THEUNEXPECTED': 'The Unexpected',
    'THEFOURDIRECTIONS': 'The Four Directions',
    'THESLEEPINGPHOENIX': 'The Sleeping Phoenix',
    'FUTURETRANSFORMATION': 'Future Transformation',
    'THEREBEL': 'The Rebel',
    'REVOLUTION': 'Revolution',
    'THEALPHA': 'The Alpha',
    'THECLARION': 'The Clarion',
    'THELAWS': 'The Laws',
    'THEEARTH': 'The Earth',
    'CONTAGION': 'Contagion',
    'CONSCIOUSNESS': 'Consciousness',
    'DIRECTION': 'Direction',
    'TRANSFERENCE': 'Transference',
    'UNCERTAINTY': 'Uncertainty',
    'PLANNING': 'Planning',
    'IDENTIFICATION': 'Identification',
    'PREVENTION': 'Prevention',
    'SEPARATION': 'Separation',
    'CONFRONTATION': 'Confrontation',
    'EXPLANATION': 'Explanation',
    'DEDICATION': 'Dedication',
    'INCARNATION': 'Incarnation',
    'HEALING': 'Healing',
    'INFORMING': 'Informing',
    'ALIGNMENT': 'Alignment',
    'DILIGENCE': 'Diligence',
    'INDUSTRY': 'Industry',
    'LIMITATION': 'Limitation',
    'REFINEMENT': 'Refinement',
    'DUALITY': 'Duality',
    'EDUCATION': 'Education',
    'CHARADES': 'Charades',
    'MASKS': 'Masks',
    'UPHEAVAL': 'Upheaval',
    'ENDEAVOR': 'Endeavor',
    'RULERSHIP': 'Rulership',
    'TENSION': 'Tension',
    'INDIVIDUALISM': 'Individualism',
    'PROGRESSIVECOMMUNITY': 'Progressive Community',
    'MIGRATION': 'Migration',
    'OBSCURATION': 'Obscuration',
    'CONCEALING': 'Concealing',
    'DOMINION': 'Dominion',
    'PENETRATION': 'Penetration',
    'CYCLES': 'Cycles',
    'DEMANDS': 'Demands',
    'SERVICE': 'Service',
    'DEFIANCE': 'Defiance',
    'WISHES': 'Wishes',
    'DISTRACTION': 'Distraction',
    'SPIRIT': 'Spirit',
    'PLANE': 'Plane',
    'WAYS': 'Ways',
    'LOVE': 'Love',
  };

  // 转为大写检查
  const upper = noSpaces.toUpperCase();
  if (knownWords[upper]) {
    return knownWords[upper];
  }

  // 尝试分解常见模式
  let result = noSpaces;

  // THE 开头
  if (/^THE[A-Z]/i.test(result)) {
    result = result.replace(/^THE([A-Z])/i, 'The $1');
  }

  // OF 分隔
  result = result.replace(/OF([A-Z])/gi, 'Of $1');

  // AND 分隔
  result = result.replace(/AND([A-Z])/gi, 'And $1');

  // 如果还是没有空格，尝试按大写字母分词
  if (!result.includes(' ')) {
    // 在大写字母前添加空格（除了第一个字母）
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
    // 在连续大写字母中，倒数第二个大写字母后加空格
    result = result.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  }

  // 首字母大写每个单词
  result = result
    .split(/\s+/)
    .map(word => {
      if (!word) return '';
      // 保持全大写的缩写
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return result;
}

// 备份原文件
const backupPath = path.join(__dirname, 'data', 'incarnation_crosses_final.backup2.json');
fs.writeFileSync(
  backupPath,
  fs.readFileSync(filePath, 'utf-8'),
  'utf-8'
);
console.log(`✅ 已备份原文件到: incarnation_crosses_final.backup2.json\n`);

// 修复所有数据
let fixedCount = 0;
const changes = [];

crosses.forEach((cross, index) => {
  const original = cross.english_name;
  const fixed = fixEnglishName(original);

  if (original !== fixed) {
    fixedCount++;
    changes.push({
      number: cross.number || '?',
      chinese: cross.chinese_name,
      original,
      fixed
    });

    crosses[index].english_name = fixed;
  }
});

// 保存修改后的文件
fs.writeFileSync(filePath, JSON.stringify(crosses, null, 2), 'utf-8');

console.log(`修复完成！共修改了 ${fixedCount} 个轮回交叉\n`);
console.log('修改详情：\n');
changes.forEach(change => {
  console.log(`${change.number}. ${change.chinese}`);
  console.log(`   原始: "${change.original}"`);
  console.log(`   修复: "${change.fixed}"`);
  console.log('');
});

console.log(`\n✅ 已保存到: incarnation_crosses_final.json`);
console.log(`\n请检查修改结果，如有问题可从 incarnation_crosses_final.backup2.json 恢复`);
