#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
王骁老师文章去重脚本
按 source_url 去重，保留每个独立URL的一篇文章
"""
import os
import re
import shutil
from pathlib import Path
from collections import defaultdict

# 配置路径
SOURCE_DIR = r"C:\Users\杜富陶\Downloads\下载文章"
OUTPUT_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_去重后"

def extract_metadata(file_path):
    """从Markdown文件中提取元数据"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 提取 source_url
        url_match = re.search(r'source_url:\s*"([^"]+)"', content)
        title_match = re.search(r'title:\s*"([^"]+)"', content)

        return {
            'source_url': url_match.group(1) if url_match else None,
            'title': title_match.group(1) if title_match else None,
            'content': content
        }
    except Exception as e:
        print(f"❌ 读取文件失败: {file_path}")
        print(f"   错误: {e}")
        return None

def main():
    print("=" * 80)
    print("开始去重王骁老师文章")
    print("=" * 80)

    # 创建输出目录
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 存储文章信息
    url_to_article = {}  # URL -> 文章信息
    no_url_articles = []  # 没有URL的文章
    total_files = 0

    # 遍历所有王骁老师的文章
    print("\n正在扫描文章...")
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith('.md') and file != 'README.md':
                total_files += 1
                file_path = os.path.join(root, file)
                collection = os.path.basename(os.path.dirname(os.path.dirname(file_path)))

                # 只处理王骁老师的文章
                if not collection.startswith('王骁老师'):
                    continue

                metadata = extract_metadata(file_path)
                if not metadata:
                    continue

                article_info = {
                    'file_path': file_path,
                    'file_name': file,
                    'collection': collection,
                    'metadata': metadata
                }

                # 按URL分类
                if metadata['source_url']:
                    url = metadata['source_url']
                    if url not in url_to_article:
                        url_to_article[url] = article_info
                    # else: 如果URL已存在，跳过（保留第一个）
                else:
                    no_url_articles.append(article_info)

    print(f"   扫描完成！共找到 {total_files} 个文件")

    # 统计信息
    print("\n" + "=" * 80)
    print("统计信息")
    print("=" * 80)
    print(f"原始文章总数: {total_files}")
    print(f"独立URL数量: {len(url_to_article)}")
    print(f"没有URL的文章: {len(no_url_articles)}")
    print(f"去重后保留: {len(url_to_article) + len(no_url_articles)} 篇")
    print(f"去除重复: {total_files - (len(url_to_article) + len(no_url_articles))} 篇")

    # 复制去重后的文章
    print("\n" + "=" * 80)
    print("正在复制去重后的文章...")
    print("=" * 80)

    copied_count = 0

    # 复制有URL的文章
    for url, article in url_to_article.items():
        source_path = article['file_path']
        dest_path = os.path.join(OUTPUT_DIR, article['file_name'])

        try:
            shutil.copy2(source_path, dest_path)
            copied_count += 1
            if copied_count % 50 == 0:
                print(f"   已复制 {copied_count} 篇...")
        except Exception as e:
            print(f"❌ 复制失败: {article['file_name']}")
            print(f"   错误: {e}")

    # 复制没有URL的文章
    for article in no_url_articles:
        source_path = article['file_path']
        dest_path = os.path.join(OUTPUT_DIR, article['file_name'])

        try:
            shutil.copy2(source_path, dest_path)
            copied_count += 1
        except Exception as e:
            print(f"❌ 复制失败: {article['file_name']}")
            print(f"   错误: {e}")

    print(f"   复制完成！共复制 {copied_count} 篇文章")

    # 生成去重报告
    print("\n" + "=" * 80)
    print("去重完成！")
    print("=" * 80)
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"文章总数: {copied_count} 篇")

    # 保存去重报告
    report_path = os.path.join(OUTPUT_DIR, "去重报告.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("王骁老师文章去重报告\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"原始文章总数: {total_files}\n")
        f.write(f"独立URL数量: {len(url_to_article)}\n")
        f.write(f"没有URL的文章: {len(no_url_articles)}\n")
        f.write(f"去重后保留: {copied_count} 篇\n")
        f.write(f"去除重复: {total_files - copied_count} 篇\n")

    print(f"\n报告已保存到: {report_path}")

if __name__ == "__main__":
    main()
