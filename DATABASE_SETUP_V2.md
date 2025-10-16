# 人类图 AI 陪伴平台 - 数据库设置指南 V2

## 📋 核心设计理念

### 用户工作流程：
1. 用户上传人类图图片
2. 手动录入或 AI 识别人类图关键信息
3. 系统存储结构化数据
4. 用户可随时查看图片和数据
5. AI 基于数据提供解读和陪伴

---

## 🖼️ Supabase Storage 配置

### 免费额度说明：
- ✅ **1 GB 存储空间**
- ✅ **2 GB 带宽/月**
- ✅ 单张人类图约 **200-500 KB**
- ✅ 理论上可存储 **2000-5000 张图片**

### 创建存储桶步骤：

1. **登录 Supabase Dashboard**
2. **进入 Storage 管理**：
   - 点击左侧菜单 **"Storage"**
   - 点击 **"Create a new bucket"**

3. **创建 chart-images 存储桶**：
   ```
   Bucket name: chart-images
   Public bucket: ❌ 关闭 (私有存储，只有用户自己能访问)
   File size limit: 5 MB (单个文件最大 5MB)
   Allowed MIME types: image/jpeg, image/png, image/jpg
   ```

4. **配置存储桶策略**：
   - 在 Storage 页面，选择 `chart-images` 存储桶
   - 点击 **"Policies"**
   - 点击 **"New Policy"**
   - 添加以下策略（见下方 SQL）

### 存储桶策略 SQL：

```sql
-- 1. 允许用户上传自己的人类图图片
CREATE POLICY "Users can upload own chart images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chart-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. 允许用户查看自己的人类图图片
CREATE POLICY "Users can view own chart images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chart-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. 允许用户删除自己的人类图图片
CREATE POLICY "Users can delete own chart images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chart-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 文件存储结构：
```
chart-images/
  ├── {user_id}/
  │   ├── chart_1.jpg
  │   ├── chart_2.png
  │   └── chart_3.jpg
  └── {another_user_id}/
      └── chart_1.jpg
```

---

## 📊 数据库表结构详解

### `charts` 表 - 人类图数据

这是核心表，存储所有人类图信息：

```sql
-- 基本信息
chart_name              TEXT        -- 人类图名称（姓名或备注）
chart_image_url         TEXT        -- 图片 URL

-- 核心属性
profile                 TEXT        -- 人生角色: 3/5, 1/3
incarnation_cross_name  TEXT        -- 轮回交叉: 右角度交叉之紧张
type                    TEXT        -- 类型: 显示者/生产者/...
authority               TEXT        -- 内在权威: 情绪权威/荐骨权威/...
definition_type         TEXT        -- 几分人: 1分人/2分人/...

-- 四个交点
design_south_node       TEXT        -- 设计南交点 (红色): "11.3"
design_north_node       TEXT        -- 设计北交点 (红色): "12.3"
personality_south_node  TEXT        -- 人格南交点 (黑色): "11.3"
personality_north_node  TEXT        -- 人格北交点 (黑色): "12.3"

-- 通道列表 (JSON)
channels                JSONB       -- ["1-8", "7-31", "10-20"]

-- 行星闸门数据 (JSON)
planetary_gates         JSONB       -- 见下方示例
```

### `planetary_gates` 字段格式示例：

```json
{
  "sun": {
    "design": "23.4",
    "personality": "43.2"
  },
  "earth": {
    "design": "43.4",
    "personality": "23.2"
  },
  "moon": {
    "design": "5.2",
    "personality": "35.1"
  },
  "north_node": {
    "design": "11.3",
    "personality": "11.3"
  },
  "south_node": {
    "design": "12.3",
    "personality": "12.3"
  },
  "mercury": {
    "design": "17.5",
    "personality": "62.3"
  },
  "venus": {
    "design": "31.2",
    "personality": "7.4"
  },
  "mars": {
    "design": "34.1",
    "personality": "20.5"
  },
  "jupiter": {
    "design": "46.6",
    "personality": "29.3"
  },
  "saturn": {
    "design": "54.2",
    "personality": "32.1"
  },
  "uranus": {
    "design": "18.4",
    "personality": "58.2"
  },
  "neptune": {
    "design": "38.3",
    "personality": "28.5"
  },
  "pluto": {
    "design": "41.1",
    "personality": "30.4"
  }
}
```

---

## 📥 数据录入示例

### 示例 1: 完整的人类图数据

```sql
INSERT INTO charts (
  user_id,
  chart_name,
  chart_image_url,
  profile,
  incarnation_cross_name,
  incarnation_cross_english,
  type,
  type_english,
  authority,
  authority_english,
  definition_type,
  design_south_node,
  design_north_node,
  personality_south_node,
  personality_north_node,
  channels,
  planetary_gates
) VALUES (
  'user-uuid-here',
  '张三的人类图',
  'https://xxx.supabase.co/storage/v1/object/public/chart-images/user-id/chart1.jpg',
  '3/5',
  '右角度交叉之紧张',
  'Right Angle Cross of Tension',
  '显示生产者',
  'Manifesting Generator',
  '荐骨权威',
  'Sacral Authority',
  '1分人',
  '11.3',
  '12.3',
  '11.3',
  '12.3',
  '["1-8", "7-31", "10-20", "13-33"]'::jsonb,
  '{
    "sun": {"design": "23.4", "personality": "43.2"},
    "earth": {"design": "43.4", "personality": "23.2"}
  }'::jsonb
);
```

---

## 🎯 前端展示 - 表格形式

根据您的需求，数据将以表格形式展示：

### 基本信息表：
| 项目 | 值 |
|------|-----|
| 姓名 | 张三 |
| 人生角色 | 3/5 |
| 轮回交叉 | 右角度交叉之紧张 |
| 类型 | 显示生产者 |
| 内在权威 | 荐骨权威 |
| 几分人 | 1分人 |

### 交点信息表：
| 交点类型 | 闸门.爻线 |
|---------|----------|
| 设计南交点 (红色) | 11.3 |
| 设计北交点 (红色) | 12.3 |
| 人格南交点 (黑色) | 11.3 |
| 人格北交点 (黑色) | 12.3 |

### 通道列表表：
| 序号 | 通道 | 中文名称 | 英文名称 |
|------|------|---------|---------|
| 1 | 1-8 | 启发的通道 | Channel of Inspiration |
| 2 | 7-31 | 创始者的通道 | Channel of the Alpha |
| 3 | 10-20 | 觉醒的通道 | Channel of Awakening |

### 行星闸门表：
| 行星 | 设计闸门 (红色) | 人格闸门 (黑色) |
|------|----------------|----------------|
| 太阳 (Sun) | 23.4 | 43.2 |
| 地球 (Earth) | 43.4 | 23.2 |
| 月亮 (Moon) | 5.2 | 35.1 |
| 水星 (Mercury) | 17.5 | 62.3 |
| 金星 (Venus) | 31.2 | 7.4 |
| 火星 (Mars) | 34.1 | 20.5 |
| 木星 (Jupiter) | 46.6 | 29.3 |
| 土星 (Saturn) | 54.2 | 32.1 |
| 天王星 (Uranus) | 18.4 | 58.2 |
| 海王星 (Neptune) | 38.3 | 28.5 |
| 冥王星 (Pluto) | 41.1 | 30.4 |
| 北交点 (North Node) | 11.3 | 11.3 |
| 南交点 (South Node) | 12.3 | 12.3 |

---

## 🚀 执行步骤

### 第一步: 创建存储桶
1. Supabase Dashboard → Storage
2. Create bucket: `chart-images`
3. 设置为私有存储桶

### 第二步: 执行数据库 SQL
1. Supabase Dashboard → SQL Editor
2. 复制 `supabase-schema-v2.sql` 内容
3. 点击 Run 执行

### 第三步: 配置存储桶策略
1. Storage → chart-images → Policies
2. 添加上传、查看、删除策略

### 第四步: 导入静态数据
- 导入 192 条轮回交叉数据
- 导入 36 条通道数据
- 导入 64 个闸门数据
- 导入 9 个能量中心数据

---

## 📸 关于图片功能的总结

### ✅ 推荐使用图片存储：
- 用户可以随时查看原始人类图
- 方便核对数据准确性
- 增强用户体验
- 1GB 空间足够 2000+ 张图片

### 📂 文件命名规范：
```
{user_id}/{timestamp}_{chart_name}.jpg

示例:
550e8400-e29b-41d4-a716-446655440000/1641234567_张三.jpg
```

### 🔒 安全保证：
- ✅ 每个用户只能访问自己的图片
- ✅ 图片 URL 需要认证才能访问
- ✅ RLS 策略自动保护数据安全

---

## 🎨 关于动态绘图功能

### 现阶段 (V1):
- ✅ 用户上传图片
- ✅ 手动录入数据
- ✅ 表格展示信息

### 未来优化 (V2):
- 🔄 开发 SVG 动态绘图功能
- 🔄 基于数据实时生成人类图
- 🔄 支持自定义样式和颜色
- 🔄 可以导出为图片

**技术可行性**: ✅ 完全可行，使用 Canvas/SVG + 底图叠加

---

## ❓ 常见问题

### Q1: 图片存储会很快用完吗？
**A**: 不会。假设每张图片 300KB，1GB 可存储 3400+ 张图片。

### Q2: 如果超出免费额度怎么办？
**A**: Supabase 提供付费升级：
- Pro Plan: 8$/月，包含 100GB 存储
- 或者使用其他图床服务（如阿里云 OSS）

### Q3: 数据录入会很麻烦吗？
**A**: 将来可以开发：
- OCR 自动识别图片中的数字
- AI 辅助录入
- 批量导入功能

### Q4: 能否实现图片自动生成？
**A**: 可以！技术方案：
- 使用底图 + SVG 叠加
- 根据通道数据绘制连接线
- 根据中心数据填充颜色
- 预计开发时间 2-3 周

---

## 📞 下一步

1. ✅ 在 Supabase 创建存储桶
2. ✅ 执行 `supabase-schema-v2.sql`
3. ✅ 配置存储桶策略
4. ⏳ 开发上传图片功能
5. ⏳ 开发数据录入表单
6. ⏳ 开发表格展示页面
7. ⏳ 集成 AI 陪伴功能
