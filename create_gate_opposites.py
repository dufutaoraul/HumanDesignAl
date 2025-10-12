# -*- coding: utf-8 -*-
"""
创建64个闸门的对宫映射表
基于易经64卦的对宫关系（曼陀罗轮盘上相对的位置）
"""

import json

# 64个闸门的对宫关系
# 在曼陀罗轮盘上，对宫闸门相差180度
# 规律：闸门号码相加等于65（除了个别特殊情况）
GATE_OPPOSITES = {
    1: 2,    # 乾 ↔ 坤
    2: 1,    # 坤 ↔ 乾
    3: 50,   # 屯 ↔ 鼎
    4: 49,   # 蒙 ↔ 革
    5: 35,   # 需 ↔ 晋
    6: 36,   # 讼 ↔ 明夷
    7: 13,   # 师 ↔ 同人
    8: 14,   # 比 ↔ 大有
    9: 16,   # 小畜 ↔ 豫
    10: 15,  # 履 ↔ 谦
    11: 12,  # 泰 ↔ 否
    12: 11,  # 否 ↔ 泰
    13: 7,   # 同人 ↔ 师
    14: 8,   # 大有 ↔ 比
    15: 10,  # 谦 ↔ 履
    16: 9,   # 豫 ↔ 小畜
    17: 18,  # 随 ↔ 蛊
    18: 17,  # 蛊 ↔ 随
    19: 33,  # 临 ↔ 遁
    20: 34,  # 观 ↔ 大壮
    21: 48,  # 噬嗑 ↔ 井
    22: 47,  # 贲 ↔ 困
    23: 43,  # 剥 ↔ 夬
    24: 44,  # 复 ↔ 姤
    25: 46,  # 无妄 ↔ 升
    26: 45,  # 大畜 ↔ 萃
    27: 28,  # 颐 ↔ 大过
    28: 27,  # 大过 ↔ 颐
    29: 30,  # 坎 ↔ 离
    30: 29,  # 离 ↔ 坎
    31: 41,  # 咸 ↔ 损
    32: 42,  # 恒 ↔ 益
    33: 19,  # 遁 ↔ 临
    34: 20,  # 大壮 ↔ 观
    35: 5,   # 晋 ↔ 需
    36: 6,   # 明夷 ↔ 讼
    37: 40,  # 家人 ↔ 解
    38: 39,  # 睽 ↔ 蹇
    39: 38,  # 蹇 ↔ 睽
    40: 37,  # 解 ↔ 家人
    41: 31,  # 损 ↔ 咸
    42: 32,  # 益 ↔ 恒
    43: 23,  # 夬 ↔ 剥
    44: 24,  # 姤 ↔ 复
    45: 26,  # 萃 ↔ 大畜
    46: 25,  # 升 ↔ 无妄
    47: 22,  # 困 ↔ 贲
    48: 21,  # 井 ↔ 噬嗑
    49: 4,   # 革 ↔ 蒙
    50: 3,   # 鼎 ↔ 屯
    51: 57,  # 震 ↔ 巽
    52: 58,  # 艮 ↔ 兑
    53: 54,  # 渐 ↔ 归妹
    54: 53,  # 归妹 ↔ 渐
    55: 59,  # 丰 ↔ 涣
    56: 60,  # 旅 ↔ 节
    57: 51,  # 巽 ↔ 震
    58: 52,  # 兑 ↔ 艮
    59: 55,  # 涣 ↔ 丰
    60: 56,  # 节 ↔ 旅
    61: 62,  # 中孚 ↔ 小过
    62: 61,  # 小过 ↔ 中孚
    63: 64,  # 既济 ↔ 未济
    64: 63,  # 未济 ↔ 既济
}

# 64卦中文名称（用于验证和显示）
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

def create_gate_opposites_data():
    """
    创建闸门对宫映射数据
    """
    opposites_list = []

    for gate in range(1, 65):
        opposite_gate = GATE_OPPOSITES[gate]

        gate_data = {
            'gate': gate,
            'gate_name': GATE_NAMES[gate],
            'opposite_gate': opposite_gate,
            'opposite_name': GATE_NAMES[opposite_gate],
            'note': '南北交点（Nodes）的闸门对宫关系，爻线必须一致'
        }

        opposites_list.append(gate_data)

    return opposites_list

def verify_opposites():
    """
    验证对宫关系的对称性
    """
    print("验证对宫关系的对称性...")
    errors = []

    for gate in range(1, 65):
        opposite = GATE_OPPOSITES[gate]
        # 检查：如果A的对宫是B，那么B的对宫必须是A
        if GATE_OPPOSITES[opposite] != gate:
            errors.append(f"闸门{gate}的对宫是{opposite}，但{opposite}的对宫不是{gate}")

    if errors:
        print("发现错误:")
        for error in errors:
            print(f"  [ERROR] {error}")
        return False
    else:
        print("[OK] 所有对宫关系对称性验证通过！")
        return True

def main():
    print("=" * 60)
    print("创建64个闸门的对宫映射表")
    print("=" * 60)

    # 验证数据
    if not verify_opposites():
        print("\n数据验证失败，请检查GATE_OPPOSITES字典")
        return

    # 创建数据
    opposites_data = create_gate_opposites_data()

    # 保存JSON
    output_file = r'D:\CursorWork\HumanDesignAI\data\gate_opposites.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(opposites_data, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] 已创建64个闸门的对宫映射表")
    print(f"[OK] 数据已保存到: {output_file}")

    # 显示示例
    print("\n示例（前10个）:")
    for i, data in enumerate(opposites_data[:10], 1):
        print(f"{i}. 闸门{data['gate']}（{data['gate_name']}）<-> 闸门{data['opposite_gate']}（{data['opposite_name']}）")

    print("\n说明：")
    print("- 南北交点的闸门必须是对宫关系")
    print("- 爻线必须完全一致")
    print("- 例如：黑南交 = 11.3，则黑北交 = 12.3")
    print("- 例如：红南交 = 25.6，则红北交 = 46.6")

if __name__ == '__main__':
    main()
