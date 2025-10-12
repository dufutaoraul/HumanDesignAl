# -*- coding: utf-8 -*-
"""
修正版：完整提取192个轮回交叉数据
修复：去掉英文名开头的 [A-Z\s] 限制，允许所有英文名格式
"""

import re
import json
from collections import defaultdict, Counter

def extract_all_crosses(file_path):
    """
    提取所有轮回交叉数据
    """
    crosses = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 修正后的模式：
    # 1. 右角度/左角度：右角度交叉之... / 左角度交叉之...
    # 2. 并列：并列交叉之...（注意：没有"角度"二字！）
    # 匹配：中文名\n英文名——门1/门2/门3/门4
    pattern = r'((?:右角度|左角度|并列)交叉之[^\n]+)\s*\n\s*([^\n]+?)——(\d+)/(\d+)/(\d+)/(\d+)'

    matches = re.findall(pattern, content, re.MULTILINE)

    for match in matches:
        chinese_name_raw = match[0].strip()
        english_name_raw = match[1].strip()
        sun_gate = match[2]
        earth_gate = match[3]
        design_sun_gate = match[4]
        design_earth_gate = match[5]

        # 清理名称
        # 1. 去掉中文名末尾的数字（所有类型都去掉，因为这些数字只是用于区分4种/2种变体）
        chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()

        # 2. 去掉英文名末尾的数字
        english_name = re.sub(r'\s*\d+\s*$', '', english_name_raw).strip()

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

    # 去重（基于type+key，因为同样的4个门可以形成不同类型的交叉）
    unique_crosses = {}
    for cross in crosses:
        # 使用type+key作为唯一标识
        unique_key = f"{cross['type']}-{cross['key']}"
        if unique_key not in unique_crosses:
            unique_crosses[unique_key] = cross

    return list(unique_crosses.values())

def analyze_crosses(crosses):
    """
    分析轮回交叉数据
    """
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

def generate_report(analysis, output_file):
    """
    生成详细分析报告
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("===== 轮回交叉数据分析报告（修正版） =====\n\n")
        f.write(f"总计：{analysis['total']} / 192（目标192个）\n")
        f.write(f"缺失：{192 - analysis['total']} 个\n\n")

        # 类型统计
        f.write("=== 类型统计 ===\n")
        for t in ['右角度', '左角度', '并列']:
            count = analysis['by_type'].get(t, 0)
            expected = 64
            status = "✓" if count == expected else f"✗ 缺{expected-count}个"
            f.write(f"{status} {t}: {count}/{expected}\n")

        f.write("\n" + "=" * 60 + "\n")
        f.write("右角度交叉（应该16个名字，每个4种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['right_angle'])}个名字，共{analysis['by_type'].get('右角度', 0)}个\n\n")

        for name, items in sorted(analysis['right_angle'].items()):
            status = "✓" if len(items) == 4 else f"✗ 缺{4-len(items)}个"
            f.write(f"{status} {name}: {len(items)}/4\n")
            for item in items:
                f.write(f"    {item['key']} - {item['english_name']}\n")

        f.write("\n" + "=" * 60 + "\n")
        f.write("左角度交叉（应该32个名字，每个2种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['left_angle'])}个名字，共{analysis['by_type'].get('左角度', 0)}个\n\n")

        for name, items in sorted(analysis['left_angle'].items()):
            status = "✓" if len(items) == 2 else f"✗ 缺{2-len(items)}个"
            f.write(f"{status} {name}: {len(items)}/2\n")
            for item in items:
                f.write(f"    {item['key']} - {item['english_name']}\n")

        f.write("\n" + "=" * 60 + "\n")
        f.write(f"并列交叉（应该64个名字，每个1种，共64个）\n")
        f.write("=" * 60 + "\n")
        f.write(f"实际：{len(analysis['juxtaposition'])}个名字，共{analysis['by_type'].get('并列', 0)}个\n\n")

        if len(analysis['juxtaposition']) > 0:
            for name, items in sorted(analysis['juxtaposition'].items()):
                status = "✓" if len(items) == 1 else f"✗ 多{len(items)-1}个"
                f.write(f"{status} {name}: {len(items)}/1\n")
                for item in items:
                    f.write(f"    {item['key']} - {item['english_name']}\n")
        else:
            f.write("【完全缺失】需要检查提取逻辑\n")

def main():
    file_path = r'D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\人类图轮回交叉全书.txt'

    print("正在提取轮回交叉数据...")
    crosses = extract_all_crosses(file_path)

    analysis = analyze_crosses(crosses)

    print(f"\n总计提取：{analysis['total']} 个")
    print(f"目标：192 个")
    print(f"缺失：{192 - analysis['total']} 个")

    print(f"\n类型统计：")
    for t in ['右角度', '左角度', '并列']:
        count = analysis['by_type'].get(t, 0)
        expected = 64
        status = "[OK]" if count == expected else f"[缺{expected-count}个]"
        print(f"  {status} {t}: {count}/{expected}")

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\incarnation_crosses_complete.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(crosses, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: {output_file}")

    # 生成详细分析报告
    report_file = r'D:\CursorWork\HumanDesignAI\data\crosses_complete_analysis.txt'
    generate_report(analysis, report_file)
    print(f"详细分析报告已保存到: {report_file}")

if __name__ == '__main__':
    main()
