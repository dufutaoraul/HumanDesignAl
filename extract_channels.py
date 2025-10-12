# -*- coding: utf-8 -*-
"""
提取人类图36条通道数据
从36条通道（东昍老师版）.txt中提取36条通道
"""

import re
import json

def extract_channels(file_path):
    """
    提取通道数据

    格式示例：
    58-18 批判的通道
    不知足、完美主义的设计
    """

    channels = []

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 匹配格式：数字-数字 通道名称
        match = re.match(r'^(\d+)-(\d+)\s+(.+)$', line)

        if match:
            gate1 = int(match.group(1))
            gate2 = int(match.group(2))
            channel_name = match.group(3)

            # 读取下一行（副标题/描述）
            description = ''
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # 如果下一行不是新的通道标题，就作为描述
                if not re.match(r'^\d+-\d+\s+', next_line):
                    description = next_line

            channel_data = {
                'gates': sorted([gate1, gate2]),  # 排序以保持一致性
                'name': channel_name,
                'description': description,
                'key': f"{min(gate1, gate2)}-{max(gate1, gate2)}"
            }

            channels.append(channel_data)

        i += 1

    # 去重（基于key）
    unique_channels = {}
    for channel in channels:
        key = channel['key']
        if key not in unique_channels:
            unique_channels[key] = channel

    return list(unique_channels.values())

def main():
    file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\36条通道（东昍老师版）.txt'

    print("正在提取通道数据...")
    channels = extract_channels(file_path)

    print(f"共提取到 {len(channels)} 条通道")

    # 保存为JSON文件
    output_file = r'D:\CursorWork\HumanDesignAI\data\channels_36.json'

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(channels, f, ensure_ascii=False, indent=2)

    print(f"数据已保存到: {output_file}")

    # 显示所有通道
    print("\n36条通道列表：")
    for i, channel in enumerate(sorted(channels, key=lambda x: x['key']), 1):
        print(f"{i}. {channel['key']} - {channel['name']}")
        if channel['description']:
            print(f"   描述：{channel['description']}")

if __name__ == '__main__':
    main()
