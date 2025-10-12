# -*- coding: utf-8 -*-
"""
提取人类图轮回交叉数据
从人类图轮回交叉全书.txt中提取192个轮回交叉
"""

import re
import json

def extract_incarnation_crosses(file_path):
    """
    提取轮回交叉数据

    格式示例：
    右角度交叉之方向（人面狮身）4
    DIRECTION(THESPHINX) 4——1/2/7/13

    或：
    右角度交叉之方向（人面狮身）2
    Direction（The Sphinx）2——2/1/13/7
    """

    crosses = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找所有轮回交叉标题和闸门组合
    # 匹配模式：中文名称 + 英文名称（可选） + 数字——闸门/闸门/闸门/闸门
    pattern = r'([右左并]角度交叉之[^\n]+?)\s*\n\s*([A-Z][^\n]*?)\s*(\d+)——(\d+)/(\d+)/(\d+)/(\d+)'

    matches = re.findall(pattern, content)

    for match in matches:
        chinese_name = match[0].strip()
        english_name = match[1].strip()
        sun_gate = match[3]  # 黑太阳
        earth_gate = match[4]  # 黑地球
        design_sun_gate = match[5]  # 红太阳
        design_earth_gate = match[6]  # 红地球

        # 清理中文名称（去掉数字）
        chinese_name = re.sub(r'\d+$', '', chinese_name).strip()

        # 确定类型
        if chinese_name.startswith('右角度'):
            cross_type = '右角度'
        elif chinese_name.startswith('左角度'):
            cross_type = '左角度'
        elif chinese_name.startswith('并列'):
            cross_type = '并列'
        else:
            cross_type = '未知'

        cross_data = {
            'chinese_name': chinese_name,
            'english_name': english_name,
            'type': cross_type,
            'gates': {
                'black_sun': int(sun_gate),
                'black_earth': int(earth_gate),
                'red_sun': int(design_sun_gate),
                'red_earth': int(design_earth_gate)
            },
            'key': f"{sun_gate}-{earth_gate}-{design_sun_gate}-{design_earth_gate}"
        }

        crosses.append(cross_data)

    return crosses

def main():
    file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

    print("正在提取轮回交叉数据...")
    crosses = extract_incarnation_crosses(file_path)

    print(f"共提取到 {len(crosses)} 个轮回交叉")

    # 保存为JSON文件
    output_file = r'D:\CursorWork\HumanDesignAI\data\incarnation_crosses.json'

    # 创建data目录
    import os
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(crosses, f, ensure_ascii=False, indent=2)

    print(f"数据已保存到: {output_file}")

    # 显示前5个示例
    print("\n前5个示例：")
    for i, cross in enumerate(crosses[:5], 1):
        print(f"\n{i}. {cross['chinese_name']}")
        print(f"   英文名: {cross['english_name']}")
        print(f"   类型: {cross['type']}")
        print(f"   闸门: {cross['gates']}")

    # 统计各类型数量
    from collections import Counter
    type_counts = Counter(cross['type'] for cross in crosses)
    print(f"\n类型统计：")
    for type_name, count in type_counts.items():
        print(f"  {type_name}: {count}个")

if __name__ == '__main__':
    main()
