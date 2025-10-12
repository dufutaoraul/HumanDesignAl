#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理王骁老师文章中的重复副本文件
"""
import os
from collections import defaultdict

# 目标文件夹
TARGET_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章"

def main():
    print("=" * 80)
    print("开始清理重复副本文件")
    print("=" * 80)

    # 存储文件信息
    files_info = []

    # 遍历文件
    print("\n正在扫描文件...")
    for file in os.listdir(TARGET_DIR):
        if not file.endswith('.md'):
            continue

        file_path = os.path.join(TARGET_DIR, file)
        file_size = os.path.getsize(file_path)

        files_info.append({
            'name': file,
            'path': file_path,
            'size': file_size,
            'is_copy': ' - 副本' in file or '- 副本' in file
        })

    print(f"共找到 {len(files_info)} 个.md文件")

    # 按文件名（去除"副本"）分组
    grouped_files = defaultdict(list)

    for file_info in files_info:
        # 获取基础名称（去除"副本"）
        base_name = file_info['name'].replace(' - 副本', '').replace('- 副本', '')
        grouped_files[base_name].append(file_info)

    # 查找需要删除的副本文件
    to_delete = []
    to_keep_different_size = []

    print("\n分析重复文件...")
    for base_name, file_list in grouped_files.items():
        if len(file_list) > 1:
            # 有重复文件
            # 按是否是副本排序，原文件在前
            file_list.sort(key=lambda x: x['is_copy'])

            original = file_list[0]  # 原文件
            copies = file_list[1:]    # 副本文件

            for copy in copies:
                if copy['is_copy']:
                    # 比较文件大小
                    if copy['size'] == original['size']:
                        # 大小相同，删除副本
                        to_delete.append(copy)
                        print(f"  [将删除] {copy['name']} ({copy['size']} bytes)")
                    else:
                        # 大小不同，保留
                        to_keep_different_size.append(copy)
                        print(f"  [保留-大小不同] {copy['name']} ({copy['size']} bytes) vs 原文件({original['size']} bytes)")

    # 统计
    print("\n" + "=" * 80)
    print("统计结果")
    print("=" * 80)
    print(f"总文件数: {len(files_info)}")
    print(f"需要删除的副本: {len(to_delete)} 个")
    print(f"大小不同需保留的副本: {len(to_keep_different_size)} 个")
    print(f"删除后剩余: {len(files_info) - len(to_delete)} 个")

    # 确认删除
    if to_delete:
        print("\n即将删除以下文件:")
        for i, file_info in enumerate(to_delete, 1):
            print(f"  {i}. {file_info['name']}")

        print("\n开始删除...")
        deleted_count = 0
        for file_info in to_delete:
            try:
                os.remove(file_info['path'])
                deleted_count += 1
                print(f"  已删除: {file_info['name']}")
            except Exception as e:
                print(f"  删除失败: {file_info['name']} - {e}")

        print(f"\n成功删除 {deleted_count} 个文件")
    else:
        print("\n没有需要删除的文件")

    # 保存报告
    report_path = os.path.join(TARGET_DIR, "清理报告.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("副本文件清理报告\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"清理时间: {os.popen('date /t').read().strip()}\n\n")
        f.write(f"原始文件数: {len(files_info)}\n")
        f.write(f"已删除副本: {len(to_delete)}\n")
        f.write(f"保留的不同大小副本: {len(to_keep_different_size)}\n")
        f.write(f"最终文件数: {len(files_info) - len(to_delete)}\n\n")

        if to_delete:
            f.write("已删除的文件:\n")
            for i, file_info in enumerate(to_delete, 1):
                f.write(f"  {i}. {file_info['name']} ({file_info['size']} bytes)\n")

        if to_keep_different_size:
            f.write("\n保留的不同大小副本:\n")
            for i, file_info in enumerate(to_keep_different_size, 1):
                f.write(f"  {i}. {file_info['name']} ({file_info['size']} bytes)\n")

    print(f"\n清理报告已保存到: {report_path}")
    print("\n" + "=" * 80)
    print("清理完成！")
    print("=" * 80)

if __name__ == "__main__":
    main()
