# -*- coding: utf-8 -*-
"""
测试正则表达式为什么不匹配并列交叉
"""

import re

# 测试文本
test_samples = [
    # 右角度（应该匹配）
    """右角度交叉之方向（人面狮身）2
Direction（The Sphinx）2——2/1/13/7""",

    # 并列交叉示例1（应该匹配但没有）
    """并列交叉之创意的自我表达 4
CREATIVESELF-EXPRESSION 4——1/2/4/49""",

    # 并列交叉示例2（应该匹配但没有）
    """并列交叉之驾驶2
The Driver 2——2/1/49/4""",

    # 左角度（应该匹配）
    """左角度交叉之反抗 4
DEFIANCE 4——1/2/4/49"""
]

# 当前的正则模式
pattern = r'([右左并]角度交叉之[^\n]+?)\s*\n\s*([A-Z\s][^\n]*?)\s*(\d+)?——(\d+)/(\d+)/(\d+)/(\d+)'

print("=" * 60)
print("测试当前正则模式")
print("=" * 60)

for i, sample in enumerate(test_samples, 1):
    print(f"\n测试样本 {i}:")
    print(sample[:50] + "...")
    match = re.search(pattern, sample, re.MULTILINE)
    if match:
        print("[OK] 匹配成功")
        print(f"  中文名: {match.group(1)}")
        print(f"  英文名: {match.group(2)}")
        print(f"  门组合: {match.group(4)}-{match.group(5)}-{match.group(6)}-{match.group(7)}")
    else:
        print("[FAIL] 匹配失败")

# 尝试更宽松的模式
pattern2 = r'([右左并]角度交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'

print("\n\n" + "=" * 60)
print("测试更宽松的正则模式（去掉 [A-Z\\s] 限制）")
print("=" * 60)

for i, sample in enumerate(test_samples, 1):
    print(f"\n测试样本 {i}:")
    print(sample[:50] + "...")
    match = re.search(pattern2, sample, re.MULTILINE)
    if match:
        print("[OK] 匹配成功")
        print(f"  中文名: {match.group(1)}")
        print(f"  英文名: {match.group(2)}")
        print(f"  门组合: {match.group(3)}-{match.group(4)}-{match.group(5)}-{match.group(6)}")
    else:
        print("[FAIL] 匹配失败")
