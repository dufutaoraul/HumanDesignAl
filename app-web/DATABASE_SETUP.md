# Supabase 数据库设置指南

## 📋 快速开始

### 1. 执行 SQL 脚本

在 Supabase Dashboard 中执行数据库结构脚本:

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目: `HumanDesignAI`
3. 点击左侧菜单的 **"SQL Editor"**
4. 点击 **"New query"** 创建新查询
5. 复制 `supabase-schema.sql` 文件的全部内容
6. 粘贴到查询编辑器中
7. 点击 **"Run"** 执行脚本

### 2. 验证数据表创建成功

执行成功后，在左侧菜单点击 **"Table Editor"**，您应该看到以下数据表:

#### 用户数据表:
- ✓ `users` - 用户信息
- ✓ `charts` - 人类图计算结果
- ✓ `chat_history` - AI 对话历史

#### 静态数据表:
- ✓ `incarnation_crosses` - 192 条轮回交叉
- ✓ `channels` - 36 条通道
- ✓ `gates` - 64 个闸门
- ✓ `centers` - 9 个能量中心

---

## 📊 数据库结构详解

### `users` - 用户表
```sql
id              UUID (主键)
email           TEXT (唯一)
name            TEXT
avatar_url      TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `charts` - 人类图数据表
存储用户的出生信息和计算结果:
```sql
id                          UUID (主键)
user_id                     UUID (外键 -> users)

-- 出生信息
birth_date                  DATE
birth_time                  TIME
birth_location              TEXT
birth_latitude              DECIMAL
birth_longitude             DECIMAL
timezone                    TEXT

-- 计算结果 (JSON)
activated_gates             JSONB
activated_channels          JSONB
defined_centers             JSONB

-- 核心属性
type                        TEXT (显示者/生产者/...)
type_english                TEXT
definition_type             TEXT (1分人/2分人/...)
authority                   TEXT
authority_english           TEXT
profile                     TEXT (例如: 3/5)
incarnation_cross_key       TEXT
incarnation_cross_name      TEXT
incarnation_cross_english   TEXT

-- 完整数据
calculation_data            JSONB

created_at                  TIMESTAMP
updated_at                  TIMESTAMP
```

### `chat_history` - AI 对话历史
```sql
id              UUID (主键)
user_id         UUID (外键 -> users)
chart_id        UUID (外键 -> charts)
role            TEXT ('user' 或 'assistant')
content         TEXT
session_id      UUID (会话分组)
topic           TEXT (对话主题)
created_at      TIMESTAMP
```

### `incarnation_crosses` - 轮回交叉静态数据
```sql
id                      SERIAL (主键)
cross_key               TEXT (唯一, 例如: right-1-2)
cross_type              TEXT (right/left/juxta)
chinese_name            TEXT
english_name            TEXT
black_sun_gate          INTEGER
red_sun_gate            INTEGER
black_earth_gate        INTEGER
red_earth_gate          INTEGER
line_info               TEXT
description             TEXT
keywords                JSONB
created_at              TIMESTAMP
```

### `channels` - 通道静态数据
```sql
id                      SERIAL (主键)
channel_key             TEXT (唯一, 例如: 1-8)
gate1, gate2            INTEGER
center1, center2        TEXT
center1_chinese         TEXT
center1_english         TEXT
center2_chinese         TEXT
center2_english         TEXT
chinese_name            TEXT
english_name            TEXT
description             TEXT
connection_key          TEXT (例如: g-throat)
connection_chinese      TEXT
connection_english      TEXT
created_at              TIMESTAMP
```

### `gates` - 闸门静态数据
```sql
gate                    INTEGER (主键)
gate_name               TEXT (易经卦名)
center                  TEXT
center_chinese          TEXT
center_english          TEXT
opposite_gate           INTEGER
opposite_name           TEXT
description             TEXT
keywords                JSONB
created_at              TIMESTAMP
```

### `centers` - 能量中心静态数据
```sql
center_key              TEXT (主键)
chinese_name            TEXT
english_name            TEXT
is_motor                BOOLEAN
description             TEXT
keywords                JSONB
created_at              TIMESTAMP
```

---

## 🔒 安全策略 (Row Level Security)

数据库已启用行级安全策略 (RLS):

### 用户数据保护:
- ✓ 用户只能查看和修改自己的数据
- ✓ `users`, `charts`, `chat_history` 表受 RLS 保护
- ✓ 通过 `auth.uid()` 验证用户身份

### 静态数据开放:
- ✓ `incarnation_crosses`, `channels`, `gates`, `centers` 表允许所有人读取
- ✓ 静态数据表不允许客户端修改

---

## 📥 导入静态数据

数据库结构创建完成后，接下来需要导入静态数据。

### 方法 1: 使用 Supabase Dashboard

1. 进入 **Table Editor**
2. 选择要导入的表 (例如 `gates`)
3. 点击 **"Insert"** -> **"Import data from CSV/JSON"**
4. 上传对应的 JSON 文件

### 方法 2: 使用 SQL INSERT 语句

我们将创建单独的数据导入脚本:
- `import-gates.sql` - 导入 64 个闸门数据
- `import-channels.sql` - 导入 36 条通道数据
- `import-incarnation-crosses.sql` - 导入 192 条轮回交叉数据
- `import-centers.sql` - 导入 9 个能量中心数据

### 方法 3: 使用 Node.js 脚本 (推荐)

运行项目中的数据导入脚本 (即将创建):
```bash
npm run import-static-data
```

---

## ✅ 验证数据库设置

### 1. 检查表结构
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### 2. 检查 RLS 策略
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 3. 检查索引
```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

---

## 🚀 下一步

数据库结构创建完成后:

1. ✅ 运行 `supabase-schema.sql` 创建表结构
2. ⏳ 导入静态数据 (闸门、通道、轮回交叉、能量中心)
3. ⏳ 在网站上访问 `/test-db` 测试连接
4. ⏳ 开始开发人类图计算功能
5. ⏳ 集成 AI 陪伴功能

---

## 📞 问题排查

### 问题 1: 权限错误
**错误**: `permission denied for table xxx`

**解决方案**:
- 检查 RLS 策略是否正确启用
- 确认使用了正确的 API key (anon key 用于客户端)

### 问题 2: 外键约束错误
**错误**: `violates foreign key constraint`

**解决方案**:
- 先创建父表数据 (如 `users`)
- 再创建子表数据 (如 `charts`)

### 问题 3: JSON 格式错误
**错误**: `invalid input syntax for type json`

**解决方案**:
- 确保 JSONB 字段使用正确的 JSON 格式
- 使用单引号包裹 JSON 字符串: `'{"key": "value"}'::jsonb`

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [PostgreSQL JSON 函数](https://www.postgresql.org/docs/current/functions-json.html)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
