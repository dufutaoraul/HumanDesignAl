# 数据导入脚本使用说明

## 📋 准备工作

### 1. 确认数据库表已创建

在运行导入脚本前，请先在 Supabase SQL Editor 中执行：
- `supabase-schema-v2.sql`

### 2. 确认环境变量已配置

确保 `.env.local` 文件包含以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**注意**：导入脚本需要 `SUPABASE_SERVICE_ROLE_KEY`（服务端密钥），才有权限写入数据。

---

## 🚀 运行导入脚本

在项目根目录（`app-web/`）运行：

```bash
npm run import-data
```

---

## 📊 导入内容

脚本会按顺序导入以下数据：

### 1. 能量中心 (9个)
- head (头部中心)
- ajna (逻辑中心)
- throat (喉咙中心)
- g (G中心)
- heart (意志力中心)
- sacral (荐骨中心)
- solar_plexus (情绪中心)
- spleen (直觉中心)
- root (根部中心)

### 2. 闸门 (64个)
来源文件：`data/gate_centers.json` + `data/gate_opposites.json`

包含：
- 闸门编号 (1-64)
- 闸门名称（易经卦名）
- 所属中心
- 对宫闸门

### 3. 通道 (36条)
来源文件：`data/channels_with_centers.json`

包含：
- 通道键（如 1-8）
- 组成闸门
- 连接的两个中心
- 中英文名称

### 4. 轮回交叉 (192条)
来源文件：`data/incarnation_crosses_complete.json`

包含：
- 右角度交叉 (64条)
- 左角度交叉 (64条)
- 并列交叉 (64条)

---

## ✅ 验证导入结果

导入成功后，访问 Supabase Table Editor 验证：

### 检查数据量：
```sql
SELECT 'centers' as table_name, COUNT(*) as count FROM centers
UNION ALL
SELECT 'gates', COUNT(*) FROM gates
UNION ALL
SELECT 'channels', COUNT(*) FROM channels
UNION ALL
SELECT 'incarnation_crosses', COUNT(*) FROM incarnation_crosses;
```

预期结果：
| table_name | count |
|------------|-------|
| centers | 9 |
| gates | 64 |
| channels | 36 |
| incarnation_crosses | 192 |

---

## ❓ 常见问题

### Q1: 运行时提示"缺少环境变量"
**A**: 确保 `.env.local` 文件存在并包含所有必需的环境变量

### Q2: 导入失败，提示权限错误
**A**: 确保使用的是 `SUPABASE_SERVICE_ROLE_KEY`，而不是 `ANON_KEY`

### Q3: 数据已存在，如何重新导入？
**A**: 脚本使用 `upsert` 方法，会自动覆盖已有数据

### Q4: 如何清空表重新导入？
**A**: 在 Supabase SQL Editor 中执行：
```sql
DELETE FROM incarnation_crosses;
DELETE FROM channels;
DELETE FROM gates;
DELETE FROM centers;
```

---

## 📝 注意事项

1. **导入顺序很重要**：
   - 先导入 centers（被其他表引用）
   - 再导入 gates（被 channels 引用）
   - 最后导入 channels 和 incarnation_crosses

2. **数据验证**：
   - 导入后建议检查数据完整性
   - 特别是外键关联是否正确

3. **备份提醒**：
   - 首次导入前建议备份数据库
   - Supabase 提供自动备份功能

---

## 🔧 开发说明

### 脚本文件位置
```
app-web/
├── scripts/
│   ├── import-static-data.ts  # 导入脚本
│   └── README.md              # 本文档
├── data/                      # 源数据文件
└── package.json               # npm 脚本配置
```

### 修改导入逻辑
如需修改导入逻辑，编辑 `scripts/import-static-data.ts`

### 添加新数据
1. 将 JSON 文件放入 `data/` 目录
2. 在脚本中添加相应的导入函数
3. 在 `main()` 函数中调用

---

## 📞 下一步

数据导入完成后，您可以：
1. 在网站上查询静态数据
2. 开发人类图数据录入功能
3. 开始集成 AI 陪伴功能
