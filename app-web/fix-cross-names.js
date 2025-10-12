/**
 * 修正轮回交叉英文名称格式
 * 将 THEVESSELOFLOVE 拆分成 The Vessel Of Love
 */

const fs = require('fs');
const path = require('path');

// 加载数据库
const dbPath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = require(dbPath);

console.log('开始修正轮回交叉英文名称格式...\n');

/**
 * 将连续大写字母拆分成单词，每个单词首字母大写
 * 例如: THEVESSELOFLOVE -> The Vessel Of Love
 * 策略：在大写字母前插入空格，然后规范化
 */
function formatEnglishName(name) {
  if (!name) return name;

  // 移除已有的多余数字
  name = name.replace(/\d+/g, '');

  // 处理括号：分离主体和括号内容
  let mainPart = name;
  let parenthesesPart = '';

  const parenMatch = name.match(/^([^\(]+)\(([^\)]+)\)$/);
  if (parenMatch) {
    mainPart = parenMatch[1].trim();
    parenthesesPart = parenMatch[2].trim();
  }

  // 处理主体部分
  let formatted = processText(mainPart);

  // 处理括号部分
  if (parenthesesPart) {
    const formattedParen = processText(parenthesesPart);
    formatted = `${formatted} (${formattedParen})`;
  }

  return formatted;
}

/**
 * 处理文本：在大写字母前插入空格，规范化单词
 */
function processText(text) {
  if (!text) return text;

  // 如果已经包含空格，说明已经格式化过了
  if (text.includes(' ')) {
    // 只需要规范化首字母大写
    return text.split(' ')
      .map(word => {
        if (word.length === 0) return word;
        // 保留全大写的短词（如 OF, THE）
        if (word.length <= 3 && word === word.toUpperCase()) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  // 全大写文本：在每个大写字母前插入空格（第一个除外）
  let result = text.charAt(0);
  for (let i = 1; i < text.length; i++) {
    const char = text.charAt(i);
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      result += ' ' + char;
    } else {
      result += char;
    }
  }

  // 规范化：首字母大写，其余小写
  result = result.split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return result;
}

// 修正所有轮回交叉的英文名称
let updatedCount = 0;
crosses.forEach(cross => {
  const original = cross.english_name;
  const formatted = formatEnglishName(original);

  if (original !== formatted) {
    console.log(`修正: ${original} -> ${formatted}`);
    cross.english_name = formatted;
    updatedCount++;
  }
});

console.log(`\n总共修正了 ${updatedCount} 个轮回交叉的英文名称`);

// 保存
fs.writeFileSync(dbPath, JSON.stringify(crosses, null, 2), 'utf-8');
console.log(`\n已保存到: ${dbPath}`);

// 验证一些案例
console.log('\n验证修正结果:');
const testCases = [
  'The Vessel Of Love',
  'The Maya',
  'The Garden Of Eden',
  'The Sphinx'
];

testCases.forEach(name => {
  const found = crosses.find(c => c.english_name.includes(name));
  if (found) {
    console.log(`✓ ${found.chinese_name} - ${found.english_name}`);
  }
});
