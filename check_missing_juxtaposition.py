# -*- coding: utf-8 -*-
"""
检查缺失的并列交叉（应该每个闸门1-64都有一个）
"""

import json

# 读取提取的数据
with open(r'D:\CursorWork\HumanDesignAI\data\incarnation_crosses_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取所有并列交叉的黑太阳闸门
juxtaposition_crosses = [c for c in data if c['type'] == '并列']
black_suns = sorted([c['gates']['black_sun'] for c in juxtaposition_crosses])

print(f"并列交叉总数: {len(juxtaposition_crosses)}")
print(f"黑太阳闸门列表 (共{len(black_suns)}个):")
print(black_suns)

# 找出缺失的闸门
all_gates = set(range(1, 65))  # 1-64
found_gates = set(black_suns)
missing_gates = all_gates - found_gates

print(f"\n缺失的闸门:")
if missing_gates:
    for gate in sorted(missing_gates):
        print(f"  闸门 {gate}")
else:
    print("  无缺失！")

# 检查重复
from collections import Counter
duplicates = Counter(black_suns)
repeated = {k: v for k, v in duplicates.items() if v > 1}
if repeated:
    print(f"\n重复的闸门:")
    for gate, count in sorted(repeated.items()):
        print(f"  闸门 {gate}: {count}次")
        # 显示这些重复的并列交叉
        for c in juxtaposition_crosses:
            if c['gates']['black_sun'] == gate:
                print(f"    - {c['chinese_name']} ({c['key']})")
