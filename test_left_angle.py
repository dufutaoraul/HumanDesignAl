# -*- coding: utf-8 -*-
"""
测试左角度匹配
"""

import re

file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 测试模式
pattern = r'((?:右角度|左角度|并列)交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'

matches = re.findall(pattern, content)

# 统计类型
from collections import Counter
types_raw = []
types_clean = []

for match in matches:
    chinese_name_raw = match[0].strip()
    chinese_name_clean = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

    if chinese_name_raw.startswith('右角度'):
        types_raw.append('右角度')
    elif chinese_name_raw.startswith('左角度'):
        types_raw.append('左角度')
    elif chinese_name_raw.startswith('并列'):
        types_raw.append('并列')

    if chinese_name_clean.startswith('右角度'):
        types_clean.append('右角度')
    elif chinese_name_clean.startswith('左角度'):
        types_clean.append('左角度')
    elif chinese_name_clean.startswith('并列'):
        types_clean.append('并列')

print("原始匹配统计（匹配后）:")
print(Counter(types_raw))

print("\n清理后统计（去掉末尾数字后）:")
print(Counter(types_clean))

# 显示前5个左角度
print("\n前5个左角度匹配（原始）:")
left_count = 0
for match in matches:
    chinese_name_raw = match[0].strip()
    if chinese_name_raw.startswith('左角度'):
        print(f"{left_count+1}. {chinese_name_raw}")
        print(f"   {match[1].strip()}")
        left_count += 1
        if left_count >= 5:
            break
