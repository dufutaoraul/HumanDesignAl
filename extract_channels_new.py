# -*- coding: utf-8 -*-
"""
从《区分的科学》原文提取36条通道数据
"""

import re
import json

def extract_channels(file_path):
    """
    提取36条通道数据
    """
    channels = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找第六章内容（从"第六章"到"第七章"之间）
    chapter6_match = re.search(r'第六章.*?(?=第七章|$)', content, re.DOTALL)
    if not chapter6_match:
        print("未找到第六章内容")
        return []

    chapter6_content = chapter6_match.group(0)

    # 匹配模式：通道编号-编号，例如 34-57, 34-20等
    # 查找通道名称和中英文描述
    pattern = r'(\d+)-(\d+)\s*\n([^\n]+?)\s+The Channel[^\n]*\n([^\n]+)'

    matches = re.findall(pattern, chapter6_content)

    seen_keys = set()

    for match in matches:
        gate1 = int(match[0])
        gate2 = int(match[1])
        chinese_name = match[2].strip()
        english_line = match[3].strip()

        # 创建唯一key（排序后的闸门组合）
        key = f"{min(gate1, gate2)}-{max(gate1, gate2)}"

        # 去重
        if key in seen_keys:
            continue
        seen_keys.add(key)

        channel_data = {
            'gates': sorted([gate1, gate2]),
            'chinese_name': chinese_name,
            'english_name': english_line,
            'key': key
        }

        channels.append(channel_data)

    return channels

def main():
    file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\《区分的科学》原文.txt'

    print("正在提取36条通道数据...")
    channels = extract_channels(file_path)

    print(f"\n提取到 {len(channels)} 条通道")
    print(f"目标：36 条")
    print(f"缺失：{36 - len(channels)} 条")

    # 按闸门编号排序
    channels_sorted = sorted(channels, key=lambda x: (x['gates'][0], x['gates'][1]))

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\channels_36.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(channels_sorted, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: {output_file}")

    # 显示前10条
    print("\n前10条通道:")
    for i, ch in enumerate(channels_sorted[:10], 1):
        print(f"{i}. {ch['gates'][0]}-{ch['gates'][1]}: {ch['chinese_name']}")

if __name__ == '__main__':
    main()
