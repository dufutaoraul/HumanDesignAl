#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重新严格检查收费文章 - 必须包含明确的付费标识
"""
import os
import re
import shutil

# 配置路径
PAID_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_收费文章"
FREE_DIR = r"D:\CursorWork\download_gongzhonghao\人类图AI高我知识库\01_核心理论\王骁老师文章_免费文章"

# 严格的收费文章标识（必须包含）
STRICT_PAID_PATTERNS = [
    r"下文为付费阅读",
    r"付费阅读",
    r"准备好了吗？准备好了，就付费吧",
    r"付费后可见",
    r"付费内容",
    r"以下为付费",
]

def is_strictly_paid(content):
    """严格判断是否是收费文章"""
    for pattern in STRICT_PAID_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            return True
    return False

def main():
    print("=" * 80)
    print("重新严格检查收费文章")
    print("=" * 80)

    truly_paid = []
    not_paid = []

    print("\n正在检查每篇文章...")

    # 遍历收费文章文件夹
    for file in os.listdir(PAID_DIR):
        if not file.endswith('.md'):
            continue

        file_path = os.path.join(PAID_DIR, file)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取标题
            title_match = re.search(r'title:\s*"([^"]+)"', content)
            title = title_match.group(1) if title_match else file

            # 严格检查是否是收费文章
            if is_strictly_paid(content):
                truly_paid.append({
                    'title': title,
                    'file': file,
                    'path': file_path
                })
                print(f"  [真收费] {title}")

                # 找到付费标识的具体位置（用于确认）
                for pattern in STRICT_PAID_PATTERNS:
                    match = re.search(pattern, content)
                    if match:
                        # 显示付费标识前后的文字
                        start = max(0, match.start() - 20)
                        end = min(len(content), match.end() + 20)
                        context = content[start:end].replace('\n', ' ')
                        print(f"            → 付费标识: ...{context}...")
                        break
            else:
                not_paid.append({
                    'title': title,
                    'file': file,
                    'path': file_path
                })
                print(f"  [非收费] {title}")

        except Exception as e:
            print(f"处理文件失败: {file}")
            print(f"错误: {e}")

    # 统计结果
    print("\n" + "=" * 80)
    print("检查结果")
    print("=" * 80)
    print(f"真正的收费文章: {len(truly_paid)} 篇")
    print(f"误判为收费的文章: {len(not_paid)} 篇")

    # 将误判的文章移回免费文章文件夹
    if not_paid:
        print("\n正在将误判文章移回免费文章文件夹...")
        for article in not_paid:
            src = article['path']
            dst = os.path.join(FREE_DIR, article['file'])
            try:
                shutil.move(src, dst)
                print(f"  已移动: {article['title']}")
            except Exception as e:
                print(f"  移动失败: {article['title']} - {e}")

    # 保存真正的收费文章列表
    report_path = os.path.join(PAID_DIR, "收费文章列表_核实后.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("收费文章列表（严格核实后）\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"总计: {len(truly_paid)} 篇\n\n")
        f.write("这些文章包含明确的付费标识（如：下文为付费阅读）\n\n")

        for i, article in enumerate(truly_paid, 1):
            f.write(f"{i}. {article['title']}\n")

    print(f"\n最终统计:")
    print(f"  免费文章总数: {len(os.listdir(FREE_DIR)) - 1} 篇（含README）")
    print(f"  收费文章总数: {len(truly_paid)} 篇")
    print(f"\n收费文章列表已保存到: {report_path}")

if __name__ == "__main__":
    main()
