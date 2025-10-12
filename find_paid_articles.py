#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
找出收费文章并剪切到单独文件夹
"""
import os
import re
import shutil
from pathlib import Path

# 配置路径
ARTICLES_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_去重后"
PAID_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_收费文章"
FREE_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_免费文章"

# 收费文章的关键词（会出现在收费文章中）
PAID_KEYWORDS = [
    "付费",
    "收费",
    "准备好了吗？准备好了，就付费吧",
    "上文.*字.*下文.*字",  # 如：(上文2520字，下文12512字)
    "付费阅读",
    "¥",
    "元/篇",
    "购买",
]

def is_paid_article(content):
    """判断是否是收费文章"""
    # 检查是否包含收费关键词
    for keyword in PAID_KEYWORDS:
        if re.search(keyword, content, re.IGNORECASE):
            return True

    # 检查字数统计模式（收费文章常见）
    if re.search(r'\(上文\d+字.*下文\d+字', content):
        return True

    return False

def main():
    print("=" * 80)
    print("开始分类收费和免费文章")
    print("=" * 80)

    # 创建输出目录
    os.makedirs(PAID_DIR, exist_ok=True)
    os.makedirs(FREE_DIR, exist_ok=True)

    paid_count = 0
    free_count = 0
    paid_articles = []

    print("\n正在扫描文章...")

    # 遍历所有文章
    for file in os.listdir(ARTICLES_DIR):
        if not file.endswith('.md') or file == '去重报告.txt':
            continue

        file_path = os.path.join(ARTICLES_DIR, file)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取标题
            title_match = re.search(r'title:\s*"([^"]+)"', content)
            title = title_match.group(1) if title_match else file

            # 判断是否是收费文章
            if is_paid_article(content):
                # 剪切到收费文章文件夹
                dest_path = os.path.join(PAID_DIR, file)
                shutil.move(file_path, dest_path)
                paid_count += 1
                paid_articles.append(title)
                print(f"  [收费] {title}")
            else:
                # 剪切到免费文章文件夹
                dest_path = os.path.join(FREE_DIR, file)
                shutil.move(file_path, dest_path)
                free_count += 1

        except Exception as e:
            print(f"处理文件失败: {file}")
            print(f"错误: {e}")

    # 统计结果
    print("\n" + "=" * 80)
    print("分类完成")
    print("=" * 80)
    print(f"收费文章: {paid_count} 篇")
    print(f"免费文章: {free_count} 篇")
    print(f"总计: {paid_count + free_count} 篇")

    # 保存收费文章列表
    report_path = os.path.join(PAID_DIR, "收费文章列表.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("收费文章列表\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"总计: {paid_count} 篇\n\n")
        for i, title in enumerate(paid_articles, 1):
            f.write(f"{i}. {title}\n")

    print(f"\n收费文章列表已保存到: {report_path}")
    print(f"\n收费文章目录: {PAID_DIR}")
    print(f"免费文章目录: {FREE_DIR}")

if __name__ == "__main__":
    main()
