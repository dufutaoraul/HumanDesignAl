/**
 * 全面修复所有轮回交叉的英文名称格式
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'incarnation_crosses_final.json');
const crosses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

console.log(`读取到 ${crosses.length} 个轮回交叉\n`);

// 修复映射表（手动修复明显错误的）
const manualFixes = {
  'Directi On (Thesph Inx)': 'Direction (The Sphinx)',
  'Direction（the Sphinx）': 'Direction (The Sphinx)',
  'Separ Ati On': 'Separation',
  'Identific Ati On': 'Identification',
  'Educ Ati On': 'Education',
  'Ref Inement': 'Refinement',
  'Incarn Ati On': 'Incarnation',
  'Limit Ati On': 'Limitation',
  'Thesleep Ing Phoenix (Futuretrans Form Ati On)': 'The Sleeping Phoenix (Future Transformation)',
  'Progressive Community (Migr Ati On)': 'Progressive Community (Migration)',
  'Explan Ati On': 'Explanation',
  'Dedic Ati On': 'Dedication',
  'Penetr Ati On': 'Penetration',
  'Obscur Ati On(c Onceal Ing）': 'Obscuration (Concealing)',
  'The Fourdirecti Ons (Ways)': 'The Four Directions (Ways)',
  'Directi On': 'Direction',
  'Plann Ing': 'Planning',
  'Uncerta Inty': 'Uncertainty',
  'Preventi On': 'Prevention',
  'The Gardenofeden': 'The Garden Of Eden',
  'The( Earth) Plane': 'The (Earth) Plane',
  'The（earth）plane': 'The (Earth) Plane',
  'The (Earthplane)': 'The (Earth) Plane',
  'Transference (C Ontagi On)': 'Transference (Contagion)',
  'C Onsciousness': 'Consciousness',
  'C Onfr Ont Ati On': 'Confrontation',
  'Tensi On': 'Tension',
  'Heal Ing': 'Healing',
  'In Form Ing': 'Informing',
  'Dem Ands': 'Demands',
  'Demand S': 'Demands',
  'Theclari On': 'The Clarion',
  'Dom Ini On': 'Dominion',
  'Distracti On': 'Distraction',
  'The Four Directions（ways）': 'The Four Directions (Ways)',
  'Progressivecommunity（migration)': 'Progressive Community (Migration)',
};

// 备份
const backupPath = path.join(__dirname, 'data', 'incarnation_crosses_final.backup3.json');
fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf-8'), 'utf-8');
console.log(`✅ 已备份到: incarnation_crosses_final.backup3.json\n`);

let fixedCount = 0;
const changes = [];

crosses.forEach((cross, index) => {
  const original = cross.english_name;
  let fixed = original;

  // 先尝试手动映射
  if (manualFixes[original]) {
    fixed = manualFixes[original];
  } else {
    // 自动修复常见模式
    fixed = original
      // 修复空格分词错误
      .replace(/Ati On/g, 'ation')
      .replace(/Ing\s+([A-Z])/g, 'ing $1')
      .replace(/On\s+([A-Z](?![a-z]))/g, 'on $1')
      .replace(/Ti On/g, 'tion')
      .replace(/nement/g, 'nement')
      // 修复括号
      .replace(/（/g, ' (')
      .replace(/）/g, ')')
      // 修复连在一起的单词
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // 清理多余空格
      .replace(/\s+/g, ' ')
      .trim();

    // 首字母大写
    fixed = fixed.split(' ').map(word => {
      if (word === '(') return word;
      if (word.startsWith('(')) {
        return '(' + word[1].toUpperCase() + word.slice(2).toLowerCase() + (word.endsWith(')') ? '' : '');
      }
      if (word.length <= 2 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

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

// 保存
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
