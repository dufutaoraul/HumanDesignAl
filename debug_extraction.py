# -*- coding: utf-8 -*-
"""
调试提取过程
"""

import re
from collections import Counter

file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 测试模式
pattern = r'([右左并]角度交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'

matches = re.findall(pattern, content, re.MULTILINE)

print(f"总匹配数: {len(matches)}")

# 统计类型
types = []
for match in matches:
    chinese_name_raw = match[0].strip()
    # 去掉末尾数字
    chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

    if chinese_name.startswith('右角度'):
        types.append('右角度')
    elif chinese_name.startswith('左角度'):
        types.append('左角度')
    elif chinese_name.startswith('并列'):
        types.append('并列')
    else:
        types.append('未知')

type_counts = Counter(types)
print("\n类型统计:")
for t, count in sorted(type_counts.items()):
    print(f"  {t}: {count}")

# 显示前5个并列交叉
print("\n前5个并列交叉:")
juxtaposition_count = 0
for match in matches:
    chinese_name_raw = match[0].strip()
    chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

    if chinese_name.startswith('并列'):
        english_name_raw = match[1].strip()
        english_name = re.sub(r'\s*\d+\s*$', '', english_name_raw).strip()
        gates = f"{match[2]}-{match[3]}-{match[4]}-{match[5]}"

        print(f"{juxtaposition_count+1}. {chinese_name}")
        print(f"   {english_name}")
        print(f"   {gates}")

        juxtaposition_count += 1
        if juxtaposition_count >= 5:
            break

print(f"\n并列交叉总数: {juxtaposition_count} (继续扫描完整列表...)")

# 完整扫描
all_juxtaposition = []
for match in matches:
    chinese_name_raw = match[0].strip()
    chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

    if chinese_name.startswith('并列'):
        all_juxtaposition.append(chinese_name)

print(f"并列交叉总数（完整扫描）: {len(all_juxtaposition)}")
