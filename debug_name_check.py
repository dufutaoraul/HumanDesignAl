# -*- coding: utf-8 -*-
"""
检查中文名称前缀
"""

import re

file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 只提取中文名
pattern1 = r'([右左并]角度交叉之[^\n]+)\s*\n'
matches1 = re.findall(pattern1, content)

print(f"找到 {len(matches1)} 个中文名")
print("\n前20个中文名（原始）:")
for i, name in enumerate(matches1[:20], 1):
    print(f"{i}. '{name}'")
    print(f"   前3个字符: '{name[:3]}'")
    print(f"   Unicode bytes: {[hex(ord(c)) for c in name[:3]]}")

# 检查并列开头的
juxtaposition_names = [n for n in matches1 if n.startswith('并列')]
print(f"\n找到并列交叉: {len(juxtaposition_names)}")
if juxtaposition_names:
    print("前5个并列交叉:")
    for n in juxtaposition_names[:5]:
        print(f"  {n}")
