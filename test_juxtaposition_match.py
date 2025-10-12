# -*- coding: utf-8 -*-
"""
测试并列交叉匹配
"""

import re

# 实际内容（从文件line 12-13）
test_text = """并列交叉之创意的自我表达 4
CREATIVESELF-EXPRESSION 4——1/2/4/49"""

print("测试文本:")
print(test_text)
print()

# 测试不同的模式
patterns = [
    (r'([右左并]角度交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)', "完整模式（当前使用）"),
    (r'(并列角度交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)', "只匹配并列"),
    (r'并列交叉之[^\n]+\n[^\n]+——\d+/\d+/\d+/\d+', "简化模式"),
    (r'并列交叉之.*?\n.*?——\d+/\d+/\d+/\d+', "最宽松模式"),
]

for pattern, desc in patterns:
    print(f"模式: {desc}")
    print(f"正则: {pattern}")
    match = re.search(pattern, test_text, re.MULTILINE | re.DOTALL)
    if match:
        print("[OK] 匹配成功")
        if match.groups():
            print(f"  组: {match.groups()}")
    else:
        print("[FAIL] 匹配失败")
    print()

# 测试字符
print("字符检查:")
first_line = test_text.split('\n')[0]
print(f"第一行: '{first_line}'")
print(f"前2个字符: '{first_line[:2]}'")
print(f"Unicode: {[hex(ord(c)) for c in first_line[:2]]}")
print()

# 直接测试startswith
print(f"first_line.startswith('并列'): {first_line.startswith('并列')}")
print(f"first_line.startswith('并'): {first_line.startswith('并')}")
