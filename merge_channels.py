# -*- coding: utf-8 -*-
"""
合并两个来源的通道数据，得到完整的36条通道
"""

import json

# 标准的36条通道列表（按闸门编号）
STANDARD_36_CHANNELS = [
    [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31],
    [9, 52], [10, 20], [10, 34], [10, 57], [11, 56], [12, 22], [13, 33],
    [16, 48], [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45],
    [23, 43], [24, 61], [25, 51], [26, 44], [27, 50], [28, 38], [29, 46],
    [30, 41], [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53],
    [47, 64]
]

# 从东昍老师版本加载
dongzhao_file = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\36条通道（东昍老师版）.txt'

def extract_dongzhao_channels():
    """
    从东昍老师版本提取
    """
    import re
    channels = {}

    with open(dongzhao_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        match = re.match(r'^(\d+)-(\d+)\s+(.+)$', line)

        if match:
            gate1 = int(match.group(1))
            gate2 = int(match.group(2))
            name = match.group(3)

            description = ''
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if not re.match(r'^\d+-\d+\s+', next_line):
                    description = next_line

            key = f"{min(gate1, gate2)}-{max(gate1, gate2)}"
            channels[key] = {
                'gates': sorted([gate1, gate2]),
                'chinese_name': name,
                'description': description,
                'source': '东昍老师版'
            }

        i += 1

    return channels

# 从《区分的科学》原文加载（已提取的JSON）
science_file = r'D:\CursorWork\HumanDesignAI\data\channels_36.json'

with open(science_file, 'r', encoding='utf-8') as f:
    science_channels_list = json.load(f)

science_channels = {}
for ch in science_channels_list:
    key = ch['key']
    science_channels[key] = {
        'gates': ch['gates'],
        'chinese_name': ch['chinese_name'],
        'english_name': ch.get('english_name', ''),
        'source': '区分的科学'
    }

# 合并
dongzhao_channels = extract_dongzhao_channels()

print(f"东昍老师版: {len(dongzhao_channels)} 条")
print(f"区分的科学: {len(science_channels)} 条")

# 创建最终的36条通道列表
final_channels = []

for gates_pair in STANDARD_36_CHANNELS:
    key = f"{gates_pair[0]}-{gates_pair[1]}"

    # 优先使用《区分的科学》的数据（更权威）
    if key in science_channels:
        final_channels.append({
            'gates': science_channels[key]['gates'],
            'chinese_name': science_channels[key]['chinese_name'],
            'english_name': science_channels[key].get('english_name', ''),
            'description': dongzhao_channels.get(key, {}).get('description', ''),
            'key': key,
            'source': '区分的科学 + 东昍老师版'
        })
    elif key in dongzhao_channels:
        final_channels.append({
            'gates': dongzhao_channels[key]['gates'],
            'chinese_name': dongzhao_channels[key]['chinese_name'],
            'english_name': '',
            'description': dongzhao_channels[key].get('description', ''),
            'key': key,
            'source': '东昍老师版'
        })
    else:
        # 缺失的通道
        final_channels.append({
            'gates': gates_pair,
            'chinese_name': '【缺失】',
            'english_name': '',
            'description': '',
            'key': key,
            'source': '缺失'
        })

print(f"\n最终合并: {len(final_channels)} 条")

# 统计缺失
missing = [ch for ch in final_channels if ch['source'] == '缺失']
print(f"缺失: {len(missing)} 条")
if missing:
    print("缺失的通道:")
    for ch in missing:
        print(f"  {ch['key']}")

# 保存
output_file = r'D:\CursorWork\HumanDesignAI\data\channels_36_complete.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(final_channels, f, ensure_ascii=False, indent=2)

print(f"\n完整的36条通道数据已保存到: {output_file}")
