# -*- coding: utf-8 -*-
"""
创建中心连接关系表
根据36条通道，生成每两个中心之间的连接映射
"""

import json

def load_data():
    """加载通道和闸门-中心映射数据"""

    # 加载36条通道数据
    with open(r'D:\CursorWork\HumanDesignAI\data\channels_36_complete.json', 'r', encoding='utf-8') as f:
        channels = json.load(f)

    # 加载闸门-中心映射数据
    with open(r'D:\CursorWork\HumanDesignAI\data\gate_centers.json', 'r', encoding='utf-8') as f:
        gate_centers_list = json.load(f)

    # 创建闸门到中心的快速查找字典
    gate_to_center = {}
    for item in gate_centers_list:
        gate_to_center[item['gate']] = {
            'center': item['center'],
            'center_chinese': item['center_chinese'],
            'center_english': item['center_english']
        }

    return channels, gate_to_center

def create_center_connections(channels, gate_to_center):
    """
    创建中心连接关系表
    返回：
    1. 按中心连接分组的通道字典
    2. 扁平化的通道列表（包含中心连接信息）
    """

    # 中心连接分组字典
    center_connections = {}

    # 扁平化的通道列表
    channels_with_centers = []

    for channel in channels:
        gate1, gate2 = channel['gates']

        # 获取两个闸门对应的中心
        center1_info = gate_to_center[gate1]
        center2_info = gate_to_center[gate2]

        center1 = center1_info['center']
        center2 = center2_info['center']

        # 创建连接键（按字母顺序排序，确保唯一性）
        connection_key = '-'.join(sorted([center1, center2]))
        connection_chinese = f"{center1_info['center_chinese']}-{center2_info['center_chinese']}"
        connection_english = f"{center1_info['center_english']}-{center2_info['center_english']}"

        # 创建通道详细信息
        channel_info = {
            'channel_key': channel['key'],
            'gates': channel['gates'],
            'chinese_name': channel['chinese_name'],
            'english_name': channel.get('english_name', ''),
            'description': channel.get('description', ''),
            'center1': center1,
            'center1_chinese': center1_info['center_chinese'],
            'center1_english': center1_info['center_english'],
            'center2': center2,
            'center2_chinese': center2_info['center_chinese'],
            'center2_english': center2_info['center_english'],
            'connection_key': connection_key,
            'connection_chinese': connection_chinese,
            'connection_english': connection_english
        }

        # 添加到扁平化列表
        channels_with_centers.append(channel_info)

        # 添加到中心连接分组
        if connection_key not in center_connections:
            center_connections[connection_key] = {
                'centers': sorted([center1, center2]),
                'chinese': connection_chinese,
                'english': connection_english,
                'channels': []
            }

        center_connections[connection_key]['channels'].append({
            'channel_key': channel['key'],
            'gates': channel['gates'],
            'chinese_name': channel['chinese_name'],
            'english_name': channel.get('english_name', ''),
            'description': channel.get('description', '')
        })

    return center_connections, channels_with_centers

def get_motor_centers():
    """返回四个动力中心的信息"""
    return {
        'sacral': {'chinese': '荐骨中心', 'english': 'Sacral Center'},
        'heart': {'chinese': '意志力中心', 'english': 'Heart/Ego Center'},
        'solar_plexus': {'chinese': '情绪中心', 'english': 'Solar Plexus/Emotional Center'},
        'root': {'chinese': '根部中心', 'english': 'Root Center'}
    }

def analyze_connections(center_connections):
    """分析中心连接关系"""

    print("\n" + "=" * 60)
    print("中心连接关系分析")
    print("=" * 60)

    # 统计每种连接的通道数量
    print(f"\n共有 {len(center_connections)} 种中心连接组合")
    print(f"共有 {sum(len(conn['channels']) for conn in center_connections.values())} 条通道")

    # 按通道数量排序
    sorted_connections = sorted(
        center_connections.items(),
        key=lambda x: len(x[1]['channels']),
        reverse=True
    )

    print("\n各中心连接包含的通道数量：")
    for conn_key, conn_info in sorted_connections:
        channel_count = len(conn_info['channels'])
        print(f"  {conn_info['chinese']}: {channel_count}条通道")
        for ch in conn_info['channels']:
            print(f"    - {ch['channel_key']}: {ch['chinese_name']}")

    # 动力中心到喉咙的连接（用于判定显示者/显示生产者）
    motor_centers = get_motor_centers()
    print("\n动力中心到喉咙中心的连接（判定显示者/显示生产者的关键）：")

    motor_to_throat = []
    for conn_key, conn_info in center_connections.items():
        centers = conn_info['centers']
        if 'throat' in centers:
            for motor in motor_centers.keys():
                if motor in centers:
                    motor_to_throat.append({
                        'motor': motor,
                        'motor_chinese': motor_centers[motor]['chinese'],
                        'connection': conn_info,
                        'channels': conn_info['channels']
                    })

    if motor_to_throat:
        for item in motor_to_throat:
            print(f"  {item['motor_chinese']} -> 喉咙中心: {len(item['channels'])}条通道")
            for ch in item['channels']:
                print(f"    - {ch['channel_key']}: {ch['chinese_name']}")
    else:
        print("  [注意] 没有直接的动力中心到喉咙中心的通道")

def main():
    print("=" * 60)
    print("创建中心连接关系表")
    print("=" * 60)

    # 加载数据
    print("\n正在加载数据...")
    channels, gate_to_center = load_data()
    print(f"[OK] 已加载 {len(channels)} 条通道")
    print(f"[OK] 已加载 {len(gate_to_center)} 个闸门-中心映射")

    # 创建中心连接关系
    print("\n正在创建中心连接关系...")
    center_connections, channels_with_centers = create_center_connections(channels, gate_to_center)
    print(f"[OK] 已创建 {len(center_connections)} 种中心连接")

    # 保存数据
    output_dir = r'D:\CursorWork\HumanDesignAI\data'

    # 保存按中心连接分组的数据
    with open(f'{output_dir}\\center_connections.json', 'w', encoding='utf-8') as f:
        json.dump(center_connections, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] 中心连接分组数据已保存到: {output_dir}\\center_connections.json")

    # 保存扁平化的通道数据（包含中心信息）
    with open(f'{output_dir}\\channels_with_centers.json', 'w', encoding='utf-8') as f:
        json.dump(channels_with_centers, f, ensure_ascii=False, indent=2)
    print(f"[OK] 通道详细数据已保存到: {output_dir}\\channels_with_centers.json")

    # 分析连接关系
    analyze_connections(center_connections)

    print("\n" + "=" * 60)
    print("数据创建完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()
