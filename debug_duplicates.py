# -*- coding: utf-8 -*-
"""
调试重复的key
"""

import re
from collections import defaultdict

file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'((?:右角度|左角度|并列)交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'

matches = re.findall(pattern, content)

# 按key分组
key_groups = defaultdict(list)

for match in matches:
    chinese_name_raw = match[0].strip()
    english_name = match[1].strip()
    key = f"{match[2]}-{match[3]}-{match[4]}-{match[5]}"

    # 确定类型
    if chinese_name_raw.startswith('右角度'):
        cross_type = '右角度'
    elif chinese_name_raw.startswith('左角度'):
        cross_type = '左角度'
    elif chinese_name_raw.startswith('并列'):
        cross_type = '并列'
    else:
        cross_type = '未知'

    key_groups[key].append({
        'chinese_name': chinese_name_raw,
        'english_name': english_name,
        'type': cross_type
    })

# 找出重复的key
print("=== 重复的key（同一门组合被多个交叉使用）===\n")
duplicate_count = 0
for key, items in sorted(key_groups.items()):
    if len(items) > 1:
        duplicate_count += 1
        print(f"Key: {key} ({len(items)}个交叉)")
        for item in items:
            print(f"  [{item['type']}] {item['chinese_name']}")
            print(f"      {item['english_name']}")
        print()

print(f"总共 {duplicate_count} 个key有重复")
print(f"总匹配数: {len(matches)}")
print(f"唯一key数: {len(key_groups)}")
