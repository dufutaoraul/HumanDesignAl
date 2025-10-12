# -*- coding: utf-8 -*-
"""
完整提取人类图轮回交叉数据
应该是192个：16右角度×4 + 32左角度×2 + 64并列
"""

import re
import json
from collections import defaultdict

def extract_all_crosses(file_path):
    """
    提取所有轮回交叉数据
    """

    crosses = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 匹配模式：中文名称 + 数字（可选） + 换行 + 英文名称 + 数字——闸门/闸门/闸门/闸门
    # 支持三种类型：右角度、左角度、并列
    pattern = r'([右左并]角度交叉之[^\n]+?)\s*\n\s*([A-Z][^\n]*?)\s*(\d+)——(\d+)/(\d+)/(\d+)/(\d+)'

    matches = re.findall(pattern, content, re.MULTILINE)

    for match in matches:
        chinese_name_raw = match[0].strip()
        english_name = match[1].strip()
        sun_gate = match[3]
        earth_gate = match[4]
        design_sun_gate = match[5]
        design_earth_gate = match[6]

        # 清理中文名称（去掉末尾数字）
        chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

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

def analyze_crosses(crosses):
    """
    分析轮回交叉数据
    """
    from collections import Counter, defaultdict

    type_counts = Counter(c['type'] for c in crosses)

    # 按基础名字分组
    name_groups = defaultdict(list)
    for c in crosses:
        name_groups[c['chinese_name']].append(c)

    # 分类统计
    right_angle = {k: v for k, v in name_groups.items() if '右角度' in k}
    left_angle = {k: v for k, v in name_groups.items() if '左角度' in k}
    juxtaposition = {k: v for k, v in name_groups.items() if '并列' in k}

    return {
        'total': len(crosses),
        'by_type': type_counts,
        'right_angle': right_angle,
        'left_angle': left_angle,
        'juxtaposition': juxtaposition
    }

def main():
    file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

    print("正在提取轮回交叉数据...")
    crosses = extract_all_crosses(file_path)

    analysis = analyze_crosses(crosses)

    print(f"\n总计提取：{analysis['total']} 个")
    print(f"\n类型统计：")
    for t, count in analysis['by_type'].items():
        print(f"  {t}: {count}个")

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\incarnation_crosses_complete.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(crosses, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: {output_file}")

    # 生成缺失报告
    report_file = r'D:\CursorWork\HumanDesignAI\data\crosses_analysis.txt'
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("===== 轮回交叉数据分析报告 =====\n\n")
        f.write(f"总计：{analysis['total']} / 192（应该192个）\n\n")

        f.write("=" * 60 + "\n")
        f.write("右角度交叉（应该16个名字，每个4种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['right_angle'])}个名字，共{analysis['by_type']['右角度']}个\n\n")

        for name, items in sorted(analysis['right_angle'].items()):
            status = "✓" if len(items) == 4 else f"✗ 缺{4-len(items)}个"
            f.write(f"{status} {name}: {len(items)}/4\n")
            for item in items:
                f.write(f"    {item['key']}\n")

        f.write("\n" + "=" * 60 + "\n")
        f.write("左角度交叉（应该32个名字，每个2种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['left_angle'])}个名字，共{analysis['by_type']['左角度']}个\n\n")

        for name, items in sorted(analysis['left_angle'].items()):
            status = "✓" if len(items) == 2 else f"✗ 缺{2-len(items)}个"
            f.write(f"{status} {name}: {len(items)}/2\n")
            for item in items:
                f.write(f"    {item['key']}\n")

        f.write("\n" + "=" * 60 + "\n")
        f.write(f"并列交叉（应该64个名字，每个1种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['juxtaposition'])}个名字，共{analysis['by_type'].get('并列', 0)}个\n\n")

        for name, items in sorted(analysis['juxtaposition'].items()):
            status = "✓" if len(items) == 1 else f"✗ 多{len(items)-1}个"
            f.write(f"{status} {name}: {len(items)}/1\n")
            for item in items:
                f.write(f"    {item['key']}\n")

    print(f"\n详细分析报告已保存到: {report_file}")
    print("\n请查看该文件，核对缺失的轮回交叉。")

if __name__ == '__main__':
    main()
