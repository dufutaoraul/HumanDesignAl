# -*- coding: utf-8 -*-
"""
最终版：完整提取人类图轮回交叉数据
192个：16右角度×4 + 32左角度×2 + 64并列
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

    # 匹配模式：支持三种类型
    # 右角度/左角度：可能带数字
    # 并列：去掉末尾数字
    pattern = r'([右左并]角度交叉之[^\n]+?)\s*\n\s*([A-Z\s][^\n]*?)\s*(\d+)?——(\d+)/(\d+)/(\d+)/(\d+)'

    matches = re.findall(pattern, content, re.MULTILINE)

    for match in matches:
        chinese_name_raw = match[0].strip()
        english_name = match[1].strip()
        # match[2] 是数字（可能为空）
        sun_gate = match[3]
        earth_gate = match[4]
        design_sun_gate = match[5]
        design_earth_gate = match[6]

        # 清理中文名称
        # 对于并列交叉：去掉末尾的所有数字
        # 对于右角度/左角度：保留原样（因为需要区分不同的组合）
        if '并列' in chinese_name_raw:
            # 并列交叉去掉末尾数字
            chinese_name = re.sub(r'\s*\d+\s*$', '', chinese_name_raw).strip()
        else:
            # 右角度/左角度保留原样，稍后去重
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

    # 去重（基于key）
    unique_crosses = {}
    for cross in crosses:
        key = cross['key']
        if key not in unique_crosses:
            unique_crosses[key] = cross

    return list(unique_crosses.values())

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
    print(f"目标：192 个")
    print(f"缺失：{192 - analysis['total']} 个")

    print(f"\n类型统计：")
    for t, count in sorted(analysis['by_type'].items()):
        expected = {'右角度': 64, '左角度': 64, '并列': 64}
        exp = expected.get(t, 0)
        print(f"  {t}: {count}/{exp}个 (缺{exp-count}个)")

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\incarnation_crosses_final.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(crosses, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: {output_file}")

    # 生成详细分析报告
    report_file = r'D:\CursorWork\HumanDesignAI\data\crosses_final_analysis.txt'
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("===== 轮回交叉数据分析报告（最终版） =====\n\n")
        f.write(f"总计：{analysis['total']} / 192（应该192个）\n")
        f.write(f"缺失：{192 - analysis['total']} 个\n\n")

        f.write("=" * 60 + "\n")
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

    print(f"\n详细分析报告已保存到: {report_file}")

if __name__ == '__main__':
    main()
