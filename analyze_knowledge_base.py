#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析知识库结构和内容
"""
import os
from pathlib import Path

# 知识库根目录
KB_ROOT = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库"

def analyze_directory(path, level=0):
    """递归分析目录结构"""
    items = []
    try:
        for item in sorted(os.listdir(path)):
            item_path = os.path.join(path, item)
            indent = "  " * level

            if os.path.isdir(item_path):
                # 统计目录下的文件数
                file_count = len([f for f in os.listdir(item_path) if os.path.isfile(os.path.join(item_path, f))])
                items.append(f"{indent}[目录] {item}/ ({file_count} 个文件)")
                # 递归分析子目录
                items.extend(analyze_directory(item_path, level + 1))
            else:
                # 获取文件大小
                size = os.path.getsize(item_path)
                size_str = format_size(size)
                ext = os.path.splitext(item)[1]
                items.append(f"{indent}[文件] {item} ({size_str}) {ext}")
    except Exception as e:
        items.append(f"{indent}[错误] 无法访问: {e}")

    return items

def format_size(size):
    """格式化文件大小"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024:
            return f"{size:.1f}{unit}"
        size /= 1024
    return f"{size:.1f}TB"

def main():
    print("=" * 80)
    print("人类图AI高我知识库 - 结构分析")
    print("=" * 80)

    structure = analyze_directory(KB_ROOT)

    print("\n知识库结构:")
    print("-" * 80)
    for line in structure:
        print(line)

    # 统计信息
    print("\n" + "=" * 80)
    print("统计信息")
    print("=" * 80)

    # 统计各类文件
    total_files = 0
    txt_files = 0
    md_files = 0
    docx_files = 0
    total_size = 0

    for root, dirs, files in os.walk(KB_ROOT):
        for file in files:
            file_path = os.path.join(root, file)
            total_files += 1
            total_size += os.path.getsize(file_path)

            if file.endswith('.txt'):
                txt_files += 1
            elif file.endswith('.md'):
                md_files += 1
            elif file.endswith('.docx'):
                docx_files += 1

    print(f"总文件数: {total_files}")
    print(f"TXT文件: {txt_files}")
    print(f"MD文件: {md_files}")
    print(f"DOCX文件: {docx_files}")
    print(f"总大小: {format_size(total_size)}")

    # 保存报告
    report_path = os.path.join(KB_ROOT, "知识库结构分析.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("人类图AI高我知识库 - 结构分析\n")
        f.write("=" * 80 + "\n\n")
        f.write("知识库结构:\n")
        f.write("-" * 80 + "\n")
        for line in structure:
            f.write(line + "\n")

        f.write("\n" + "=" * 80 + "\n")
        f.write("统计信息\n")
        f.write("=" * 80 + "\n")
        f.write(f"总文件数: {total_files}\n")
        f.write(f"TXT文件: {txt_files}\n")
        f.write(f"MD文件: {md_files}\n")
        f.write(f"DOCX文件: {docx_files}\n")
        f.write(f"总大小: {format_size(total_size)}\n")

    print(f"\n报告已保存到: {report_path}")

if __name__ == "__main__":
    main()
