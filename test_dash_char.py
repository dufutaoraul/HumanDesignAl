# -*- coding: utf-8 -*-
"""
检查破折号字符
"""

import re

# 从文件读取实际内容
file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到并列交叉的行
juxtaposition_lines = []
for line in content.split('\n'):
    if '并列交叉之' in line and '——' in line:
        juxtaposition_lines.append(line)
        if len(juxtaposition_lines) >= 3:
            break

print(f"找到 {len(juxtaposition_lines)} 行并列交叉")
for i, line in enumerate(juxtaposition_lines, 1):
    print(f"\n行 {i}:")
    print(f"内容: {line}")

    # 检查破折号字符
    if '——' in line:
        idx = line.index('——')
        dash_chars = line[idx:idx+2]
        print(f"破折号: '{dash_chars}'")
        print(f"破折号字节: {dash_chars.encode('utf-8')}")
        print(f"破折号Unicode: {[hex(ord(c)) for c in dash_chars]}")

# 测试正则表达式
print("\n" + "="*60)
print("测试正则匹配")
print("="*60)

# 提取包含门组合的段落
pattern1 = r'并列交叉之[^\n]+\n[^\n]+——\d+/\d+/\d+/\d+'
matches1 = re.findall(pattern1, content)
print(f"\n简单模式匹配数: {len(matches1)}")
if matches1:
    print("前3个匹配:")
    for m in matches1[:3]:
        print(f"  {m[:60]}...")

# 完整提取模式
pattern2 = r'(并列交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'
matches2 = re.findall(pattern2, content)
print(f"\n完整模式匹配数: {len(matches2)}")
if matches2:
    print("前3个匹配:")
    for m in matches2[:3]:
        print(f"  {m[0]} | {m[1]} | {m[2]}-{m[3]}-{m[4]}-{m[5]}")
