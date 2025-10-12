# -*- coding: utf-8 -*-
"""
创建64个闸门到9个能量中心的映射表
基于人类图系统的标准定义
"""

import json

# 9个能量中心的中英文名称
CENTERS = {
    'head': {'chinese': '头部中心', 'english': 'Head Center'},
    'ajna': {'chinese': '逻辑中心', 'english': 'Ajna Center'},
    'throat': {'chinese': '喉咙中心', 'english': 'Throat Center'},
    'g': {'chinese': 'G中心', 'english': 'G Center'},
    'heart': {'chinese': '意志力中心', 'english': 'Heart/Ego Center'},
    'sacral': {'chinese': '荐骨中心', 'english': 'Sacral Center'},
    'spleen': {'chinese': '直觉中心', 'english': 'Spleen Center'},
    'solar_plexus': {'chinese': '情绪中心', 'english': 'Solar Plexus/Emotional Center'},
    'root': {'chinese': '根部中心', 'english': 'Root Center'}
}

# 64个闸门到能量中心的映射
GATE_TO_CENTER = {
    # 头部中心 (Head Center) - 3个闸门
    61: 'head',  # 中孚
    63: 'head',  # 既济
    64: 'head',  # 未济

    # 逻辑中心 (Ajna Center) - 11个闸门
    47: 'ajna',  # 困
    24: 'ajna',  # 复
    4: 'ajna',   # 蒙
    17: 'ajna',  # 随
    43: 'ajna',  # 夬
    11: 'ajna',  # 泰

    # 喉咙中心 (Throat Center) - 11个闸门
    62: 'throat',  # 小过
    23: 'throat',  # 剥
    56: 'throat',  # 旅
    35: 'throat',  # 晋
    12: 'throat',  # 否
    45: 'throat',  # 萃
    33: 'throat',  # 遁
    8: 'throat',   # 比
    31: 'throat',  # 咸
    20: 'throat',  # 观
    16: 'throat',  # 豫

    # G中心 (G Center/Self) - 8个闸门
    1: 'g',   # 乾
    13: 'g',  # 同人
    25: 'g',  # 无妄
    46: 'g',  # 升
    2: 'g',   # 坤
    15: 'g',  # 谦
    10: 'g',  # 履
    7: 'g',   # 师

    # 意志力中心/心中心 (Heart/Ego Center) - 4个闸门
    51: 'heart',  # 震
    21: 'heart',  # 噬嗑
    40: 'heart',  # 解
    26: 'heart',  # 大畜

    # 荐骨中心 (Sacral Center) - 9个闸门
    5: 'sacral',   # 需
    14: 'sacral',  # 大有
    29: 'sacral',  # 坎
    59: 'sacral',  # 涣
    9: 'sacral',   # 小畜
    3: 'sacral',   # 屯
    42: 'sacral',  # 益
    27: 'sacral',  # 颐
    34: 'sacral',  # 大壮

    # 直觉中心/脾中心 (Spleen Center) - 7个闸门
    48: 'spleen',  # 井
    57: 'spleen',  # 巽
    44: 'spleen',  # 姤
    50: 'spleen',  # 鼎
    32: 'spleen',  # 恒
    28: 'spleen',  # 大过
    18: 'spleen',  # 蛊

    # 情绪中心/太阳神经丛 (Solar Plexus/Emotional Center) - 7个闸门
    36: 'solar_plexus',  # 明夷
    22: 'solar_plexus',  # 贲
    37: 'solar_plexus',  # 家人
    6: 'solar_plexus',   # 讼
    49: 'solar_plexus',  # 革
    55: 'solar_plexus',  # 丰
    30: 'solar_plexus',  # 离

    # 根部中心 (Root Center) - 9个闸门
    53: 'root',  # 渐
    60: 'root',  # 节
    52: 'root',  # 艮
    19: 'root',  # 临
    39: 'root',  # 蹇
    41: 'root',  # 损
    58: 'root',  # 兑
    38: 'root',  # 睽
    54: 'root',  # 归妹
}

# 64卦中文名称
GATE_NAMES = {
    1: "乾", 2: "坤", 3: "屯", 4: "蒙", 5: "需", 6: "讼", 7: "师", 8: "比",
    9: "小畜", 10: "履", 11: "泰", 12: "否", 13: "同人", 14: "大有", 15: "谦", 16: "豫",
    17: "随", 18: "蛊", 19: "临", 20: "观", 21: "噬嗑", 22: "贲", 23: "剥", 24: "复",
    25: "无妄", 26: "大畜", 27: "颐", 28: "大过", 29: "坎", 30: "离", 31: "咸", 32: "恒",
    33: "遁", 34: "大壮", 35: "晋", 36: "明夷", 37: "家人", 38: "睽", 39: "蹇", 40: "解",
    41: "损", 42: "益", 43: "夬", 44: "姤", 45: "萃", 46: "升", 47: "困", 48: "井",
    49: "革", 50: "鼎", 51: "震", 52: "艮", 53: "渐", 54: "归妹", 55: "丰", 56: "旅",
    57: "巽", 58: "兑", 59: "涣", 60: "节", 61: "中孚", 62: "小过", 63: "既济", 64: "未济"
}

def create_gate_centers_data():
    """
    创建64个闸门到9个能量中心的映射数据
    """
    gate_centers_list = []

    for gate in range(1, 65):
        center_key = GATE_TO_CENTER[gate]
        center_info = CENTERS[center_key]

        gate_data = {
            'gate': gate,
            'gate_name': GATE_NAMES[gate],
            'center': center_key,
            'center_chinese': center_info['chinese'],
            'center_english': center_info['english']
        }

        gate_centers_list.append(gate_data)

    return gate_centers_list

def verify_gate_centers():
    """
    验证所有64个闸门都已映射到能量中心
    """
    print("验证闸门到能量中心的映射...")
    errors = []

    # 检查是否所有64个闸门都有映射
    for gate in range(1, 65):
        if gate not in GATE_TO_CENTER:
            errors.append(f"闸门{gate}未映射到任何能量中心")

    # 检查是否有重复映射
    if len(GATE_TO_CENTER) != 64:
        errors.append(f"映射数量错误：应为64个，实际为{len(GATE_TO_CENTER)}个")

    if errors:
        print("发现错误:")
        for error in errors:
            print(f"  [ERROR] {error}")
        return False
    else:
        print("[OK] 所有64个闸门都已正确映射到能量中心！")
        return True

def print_statistics():
    """
    打印每个能量中心包含的闸门统计
    """
    print("\n各能量中心包含的闸门数量:")

    center_gates = {}
    for gate, center_key in GATE_TO_CENTER.items():
        if center_key not in center_gates:
            center_gates[center_key] = []
        center_gates[center_key].append(gate)

    for center_key, gates in sorted(center_gates.items()):
        center_name = CENTERS[center_key]['chinese']
        print(f"  {center_name}: {len(gates)}个闸门 {sorted(gates)}")

    total = sum(len(gates) for gates in center_gates.values())
    print(f"\n  总计: {total}个闸门")

def main():
    print("=" * 60)
    print("创建64个闸门到9个能量中心的映射表")
    print("=" * 60)

    # 验证数据
    if not verify_gate_centers():
        print("\n数据验证失败，请检查GATE_TO_CENTER字典")
        return

    # 打印统计信息
    print_statistics()

    # 创建数据
    gate_centers_data = create_gate_centers_data()

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\gate_centers.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(gate_centers_data, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] 已创建64个闸门到9个能量中心的映射表")
    print(f"[OK] 数据已保存到: {output_file}")

    # 显示示例
    print("\n示例（前10个）:")
    for i, data in enumerate(gate_centers_data[:10], 1):
        print(f"{i}. 闸门{data['gate']}（{data['gate_name']}）-> {data['center_chinese']}")

if __name__ == '__main__':
    main()
