# Supabase 设置指南

本文档说明如何为人类图 AI 陪伴平台配置 Supabase 数据库。

## 前置要求

- 已有 Supabase 账号（在 https://supabase.com 注册）
- 已创建 Supabase 项目

## 设置步骤

### 1. 获取 Supabase 凭证

1. 登录 Supabase Dashboard
2. 选择你的项目
3. 进入 **Settings** > **API**
4. 复制以下信息：
   - `Project URL`
   - `anon public key`
   - `service_role key`（可选，用于服务端操作）

### 2. 配置环境变量

确保 `.env.local` 文件包含以下内容：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥（可选）
```

### 3. 创建数据库表

1. 在 Supabase Dashboard 中，进入 **SQL Editor**
2. 创建新查询
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor 中
5. 点击 **Run** 执行脚本

脚本会自动创建以下内容：

#### 数据表

1. **charts** - 存储用户的人类图数据
   - `id`: UUID 主键
   - `user_id`: 用户 ID（外键关联 auth.users）
   - `name`: 姓名
   - `birth_date`: 出生日期
   - `birth_time`: 出生时间
   - `location`: 出生地点
   - `timezone`: 时区
   - `chart_data`: JSON 格式的完整图表数据
   - `created_at`, `updated_at`: 时间戳

2. **chat_history** - AI 对话历史
   - `id`: UUID 主键
   - `user_id`: 用户 ID
   - `chart_id`: 关联的图表 ID（可选）
   - `role`: 角色（user/assistant/system）
   - `content`: 对话内容
   - `created_at`: 时间戳

3. **user_profiles** - 用户扩展信息
   - `id`: UUID 主键（关联 auth.users）
   - `name`: 用户昵称
   - `avatar_url`: 头像 URL
   - `preferences`: JSON 格式的用户偏好设置
   - `created_at`, `updated_at`: 时间戳

#### 安全策略（RLS）

所有表都启用了行级安全策略（Row Level Security），确保：
- 用户只能访问自己的数据
- 数据操作受到严格的权限控制

#### 自动化功能

1. **自动创建用户配置**
   - 新用户注册时自动创建 user_profiles 记录

2. **自动更新时间戳**
   - 数据更新时自动更新 updated_at 字段

### 4. 配置认证（可选）

如果需要自定义认证设置：

1. 进入 **Authentication** > **Settings**
2. 配置以下选项：
   - **Site URL**: 你的网站 URL（如 http://localhost:3000）
   - **Redirect URLs**: 添加允许的重定向 URL
   - **Email Templates**: 自定义邮件模板（注册确认、密码重置等）

### 5. 测试连接

启动开发服务器并测试功能：

```bash
npm run dev
```

测试以下功能：
1. 用户注册
2. 用户登录
3. 计算人类图
4. 保存图表数据
5. 查看已保存的图表

## 数据结构示例

### chart_data JSON 格式

```json
{
  "planets": {
    "personality": {
      "Sun": { "gate": 30, "line": 1, "longitude": 325.33 },
      "Earth": { "gate": 29, "line": 1, "longitude": 145.33 }
      // ... 其他星体
    },
    "design": {
      "Sun": { "gate": 55, "line": 3, "longitude": 332.53 },
      "Earth": { "gate": 59, "line": 3, "longitude": 152.53 }
      // ... 其他星体
    }
  },
  "analysis": {
    "type": "Projector (投射者)",
    "profile": "5/1",
    "authority": "Sounding Board (环境权威)",
    "definition": "Split Definition (二分人)",
    "channels": ["21-45", "10-20"],
    "incarnationCross": {
      "type": "Left Angle",
      "nameEN": "Education",
      "nameCN": "教育",
      "gates": "11/12 | 46/25",
      "full": "左角度交叉之教育 Education (11/12 | 46/25)"
    }
  }
}
```

## 常见问题

### Q: 为什么需要 RLS（行级安全策略）？

A: RLS 确保用户只能访问自己的数据，防止数据泄露。即使有人获得了 anon key，也无法访问其他用户的数据。

### Q: service_role key 和 anon key 有什么区别？

A:
- **anon key**: 用于客户端，受 RLS 策略限制
- **service_role key**: 用于服务端，绕过 RLS，拥有完全权限（需妥善保管）

### Q: 如何备份数据？

A: 在 Supabase Dashboard 中：
1. 进入 **Database** > **Backups**
2. 可以手动创建备份或配置自动备份

### Q: 如何查看数据库中的数据？

A:
1. 进入 **Table Editor**
2. 选择要查看的表
3. 可以直接在界面中查看、编辑数据

## 安全建议

1. **不要泄露密钥**
   - 将 `.env.local` 添加到 `.gitignore`
   - 不要将密钥提交到版本控制系统

2. **使用 RLS**
   - 始终为用户数据表启用 RLS
   - 仔细设计安全策略

3. **定期备份**
   - 配置自动备份
   - 定期测试恢复流程

4. **监控使用情况**
   - 定期检查 API 使用量
   - 设置使用量告警

## 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Next.js + Supabase 集成指南](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [行级安全策略指南](https://supabase.com/docs/guides/auth/row-level-security)
