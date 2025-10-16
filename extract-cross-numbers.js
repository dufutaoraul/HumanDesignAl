/**
 * 从《人类图轮回交叉全书》中提取轮回交叉编号
 * 更新 incarnation_crosses_final.json 文件添加 number 字段
 */

const fs = require('fs');
const path = require('path');

// 读取轮回交叉全书
const bookPath = 'D:\\CursorWork\\download_gongzhonghao\\人类图AI高我知识库\\01_核心理论\\人类图轮回交叉全书.txt';
const bookContent = fs.readFileSync(bookPath, 'utf-8');

// 读取现有的 JSON 数据库
const dbPath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = require(dbPath);

// 正则表达式匹配轮回交叉条目
// 格式如：右角度交叉之方向（人面狮身）4
//       DIRECTION(THESPHINX) 4——1/2/7/13
const crossPattern = /^(.+?)\s+(\d+)\s*$/gm;
const gatePattern = /——(\d+)\/(\d+)\/(\d+)\/(\d+)/;

// 解析书籍内容
const lines = bookContent.split('\n');
const crossMap = {}; // key -> number

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // 方法1：匹配中文名 + 编号（中文和编号之间有空格）
  const chineseMatch = line.match(/^(右角度交叉|左角度交叉|并列交叉)(.+?)\s+(\d+)\s*$/);
  if (chineseMatch) {
    const type = chineseMatch[1];
    const namePart = chineseMatch[2];
    const number = parseInt(chineseMatch[3]);

    // 查找下一行的门信息
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const nextLine = lines[j].trim();
      const gateMatch = nextLine.match(gatePattern);
      if (gateMatch) {
        const key = `${gateMatch[1]}-${gateMatch[2]}-${gateMatch[3]}-${gateMatch[4]}`;
        crossMap[key] = number;
        console.log(`找到(中文): ${type}${namePart} ${number} - ${key}`);
        break;
      }
    }
  }

  // 方法2：匹配英文格式 "THEMAYA3——32/42/62/61"（编号紧跟英文名，无空格）
  const englishMatch = line.match(/^([A-Z\(\)]+)(\d+)——(\d+)\/(\d+)\/(\d+)\/(\d+)/);
  if (englishMatch) {
    const englishName = englishMatch[1];
    const number = parseInt(englishMatch[2]);
    const key = `${englishMatch[3]}-${englishMatch[4]}-${englishMatch[5]}-${englishMatch[6]}`;

    crossMap[key] = number;
    console.log(`找到(英文): ${englishName} ${number} - ${key}`);
  }

  // 方法3：匹配英文格式 "DIRECTION(THESPHINX) 4——1/2/7/13"（编号和英文名之间有空格）
  const englishSpaceMatch = line.match(/^([A-Z\(\)]+)\s+(\d+)——(\d+)\/(\d+)\/(\d+)\/(\d+)/);
  if (englishSpaceMatch) {
    const englishName = englishSpaceMatch[1];
    const number = parseInt(englishSpaceMatch[2]);
    const key = `${englishSpaceMatch[3]}-${englishSpaceMatch[4]}-${englishSpaceMatch[5]}-${englishSpaceMatch[6]}`;

    crossMap[key] = number;
    console.log(`找到(英文空格): ${englishName} ${number} - ${key}`);
  }
}

console.log(`\n总共找到 ${Object.keys(crossMap).length} 个编号`);

// 更新 JSON 数据库
let updated = 0;
let notFound = 0;

crosses.forEach(cross => {
  if (crossMap[cross.key] !== undefined) {
    cross.number = crossMap[cross.key];
    updated++;
  } else {
    // 并置交叉没有编号
    if (cross.type === '并置交叉') {
      cross.number = null;
    } else {
      notFound++;
      console.warn(`警告: 未找到编号 - ${cross.type} ${cross.chinese_name} (${cross.key})`);
    }
  }
});

console.log(`\n更新了 ${updated} 个轮回交叉的编号`);
console.log(`未找到编号: ${notFound} 个`);

// 保存更新后的数据
fs.writeFileSync(dbPath, JSON.stringify(crosses, null, 2), 'utf-8');
console.log(`\n已保存到: ${dbPath}`);

// 验证：检查32号门的玛雅交叉
const mayaCross = crosses.find(c => c.key === '32-42-62-61');
if (mayaCross) {
  console.log(`\n验证: 32/42/62/61 玛雅交叉编号 = ${mayaCross.number} (应该是3)`);
}
