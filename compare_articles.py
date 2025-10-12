#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
对比新旧去重结果，找出差异
"""
import os
import re

# 配置路径
OLD_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章"
NEW_FREE_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_免费文章"
NEW_PAID_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_收费文章"

def get_article_urls(directory):
    """获取目录中所有文章的URL"""
    urls = {}
    for file in os.listdir(directory):
        if file.endswith('.md'):
            file_path = os.path.join(directory, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read(1000)
                    url_match = re.search(r'source_url:\s*"([^"]+)"', content)
                    title_match = re.search(r'title:\s*"([^"]+)"', content)
                    if url_match:
                        urls[url_match.group(1)] = {
                            'title': title_match.group(1) if title_match else file,
                            'file': file
                        }
            except:
                pass
    return urls

def main():
    print("=" * 80)
    print("对比新旧去重结果")
    print("=" * 80)

    print("\n正在读取文章信息...")

    # 获取旧版文章（173篇）
    old_urls = get_article_urls(OLD_DIR)

    # 获取新版免费文章（147篇）
    new_free_urls = get_article_urls(NEW_FREE_DIR)

    # 获取新版收费文章（25篇）
    new_paid_urls = get_article_urls(NEW_PAID_DIR)

    # 合并新版所有文章
    new_all_urls = {**new_free_urls, **new_paid_urls}

    print(f"\n旧版文章数: {len(old_urls)} 篇")
    print(f"新版免费文章: {len(new_free_urls)} 篇")
    print(f"新版收费文章: {len(new_paid_urls)} 篇")
    print(f"新版总计: {len(new_all_urls)} 篇")

    # 找出新增的文章（在新版中但不在旧版中）
    new_articles = set(new_all_urls.keys()) - set(old_urls.keys())

    # 找出缺失的文章（在旧版中但不在新版中）
    missing_articles = set(old_urls.keys()) - set(new_all_urls.keys())

    print("\n" + "=" * 80)
    print("差异分析")
    print("=" * 80)

    if new_articles:
        print(f"\n新版多出来的文章 ({len(new_articles)} 篇):")
        for i, url in enumerate(new_articles, 1):
            article = new_all_urls[url]
            article_type = "收费" if url in new_paid_urls else "免费"
            print(f"  {i}. [{article_type}] {article['title']}")

    if missing_articles:
        print(f"\n新版缺失的文章 ({len(missing_articles)} 篇):")
        for i, url in enumerate(missing_articles, 1):
            article = old_urls[url]
            print(f"  {i}. {article['title']}")

    if not new_articles and not missing_articles:
        print("\n✅ 两个版本的文章URL完全一致！")

    # 保存报告
    report_path = r"D:\CursorWork\HumanDesignAI\文章对比报告.txt"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("王骁老师文章新旧版本对比报告\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"旧版文章数: {len(old_urls)} 篇\n")
        f.write(f"新版免费文章: {len(new_free_urls)} 篇\n")
        f.write(f"新版收费文章: {len(new_paid_urls)} 篇\n")
        f.write(f"新版总计: {len(new_all_urls)} 篇\n\n")

        if new_articles:
            f.write(f"新版多出来的文章 ({len(new_articles)} 篇):\n")
            for i, url in enumerate(new_articles, 1):
                article = new_all_urls[url]
                article_type = "收费" if url in new_paid_urls else "免费"
                f.write(f"  {i}. [{article_type}] {article['title']}\n")
            f.write("\n")

        if missing_articles:
            f.write(f"新版缺失的文章 ({len(missing_articles)} 篇):\n")
            for i, url in enumerate(missing_articles, 1):
                article = old_urls[url]
                f.write(f"  {i}. {article['title']}\n")

    print(f"\n报告已保存到: {report_path}")

if __name__ == "__main__":
    main()
