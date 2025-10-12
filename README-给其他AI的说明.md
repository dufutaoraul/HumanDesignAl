# 人类图AI项目 - 给其他AI的说明文档

## 项目概述

这是一个人类图（Human Design）计算系统，集成了Dify AI高我聊天机器人。

### 核心功能
1. **精确计算人类图数据**：基于出生时间/地点计算13颗行星位置
2. **星盘分析**：自动计算类型、权威、人生角色、通道、能量中心
3. **Dify集成**：生成Dify聊天机器人可直接使用的变量数据

---

## 技术栈

- **Next.js 15.5.4** + **React** + **TypeScript**
- **astronomy-engine** - 天文计算库（纯JavaScript，替代swisseph-wasm）
- **Tailwind CSS** - UI样式
- **Supabase** - 数据库（计划中）

---

## 核心文件说明

### 1. 计算引擎
**`app-web/lib/astronomy-calculator.js`**
- 使用astronomy-engine计算行星位置
- 将黄道经度转换为人类图闸门.爻线
- 处理88度太阳回溯（设计端计算）

### 2. 星盘分析
**`app-web/lib/bodygraph-analyzer.js`**
- `analyzeBodygraph()` - 分析完整星盘
- `calculateType()` - 计算类型（生产者/投射者/显示者/反映者）
- `calculateAuthority()` - 计算内在权威
- `generateDifySummary()` - 生成Dify变量

### 3. API端点
**`app-web/app/api/calculate-chart/route.ts`**
- POST接口，接收出生信息
- 返回完整星盘数据 + Dify变量

### 4. 前端页面
**`app-web/app/calculate/page.tsx`**
- 用户输入表单
- 星盘数据表格显示
- 基本信息卡片（类型/权威/角色等）

---

## API数据结构

### 请求

```json
POST /api/calculate-chart
{
  "name": "张三",
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "location": "北京",
  "timezone": "Asia/Shanghai"
}
```

### 返回

```json
{
  "name": "张三",
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "location": "北京",

  // ⭐ 核心分析数据
  "analysis": {
    "type": "Generator (生产者)",
    "authority": "Sacral (骶骨权威)",
    "profile": "3/5",
    "definition": "Single Definition (单一定义)",
    "channels": ["1-8", "13-33", "20-34"],
    "definedCenters": ["Sacral", "Throat", "G"]
  },

  // ⭐ Dify集成数据（重点！）
  "dify": {
    "user_name": "张三",
    "hd_type": "Generator (生产者)",
    "hd_authority": "Sacral (骶骨权威)",
    "hd_profile": "3/5",
    "hd_features": "主要通道: 1-8, 13-33, 20-34",
    "hd_channels": "1-8, 13-33, 20-34",
    "hd_personality_sun": "32.1",
    "hd_design_sun": "62.3",
    "hd_definition": "Single Definition"
  },

  // 完整行星数据
  "planets": {
    "personality": {
      "Sun": { "gate": 32, "line": 1, "arrow": "→" },
      "Moon": { "gate": 41, "line": 5, "arrow": "" },
      // ...其他行星
    },
    "design": {
      "Sun": { "gate": 62, "line": 3, "arrow": "←" },
      // ...
    }
  }
}
```

---

## Dify集成要点

### 第1步：Dify变量设置

在Dify应用中创建这些会话变量：

| 变量名 | 类型 | 说明 |
|--------|------|------|
| user_name | String | 用户姓名 |
| hd_type | String | 人类图类型 |
| hd_authority | String | 内在权威 |
| hd_profile | String | 人生角色（如3/5） |
| hd_features | String | 关键特质（通道） |

### 第2步：提示词模板

```markdown
# 用户信息
当前对话用户：{{user_name}}
人类图类型：{{hd_type}}
内在权威：{{hd_authority}}
人生角色：{{hd_profile}}
关键特质：{{hd_features}}

# 你是用户的"高我"（Higher Self）
[后续提示词见 DIFY集成简明指南.md]
```

### 第3步：数据传递

从API返回的 `dify` 字段直接映射到Dify变量。

---

## 关键概念

### 人类图核心要素

1. **类型（Type）**
   - Generator (生产者) - 有骶骨，等待回应
   - Manifesting Generator (显生者) - 有骶骨 + 动力到喉轮
   - Projector (投射者) - 无骶骨，等待邀请
   - Manifestor (显示者) - 无骶骨 + 动力到喉轮
   - Reflector (反映者) - 无任何定义

2. **内在权威（Authority）**
   - Emotional (情绪权威) - 有情绪中心
   - Sacral (骶骨权威) - 有骶骨中心
   - Splenic (脾脏权威) - 有脾脏中心
   - Ego Projected (自我投射) - 自我中心到喉轮
   - Self Projected (自我投射) - G中心到喉轮
   - Sounding Board (外在权威) - 头脑中心到喉轮
   - Lunar (月亮权威) - 无定义

3. **人生角色（Profile）**
   - 个性端太阳爻线 / 设计端太阳爻线
   - 例如：3/5 = 个性端3爻，设计端5爻

4. **通道（Channels）**
   - 两个和谐闸门同时激活形成通道
   - 例如：1-8通道连接G中心和喉轮

5. **能量中心（Centers）**
   - 9个能量中心：头脑、眉心、喉咙、G、意志、情绪、骶骨、脾脏、根部
   - 有通道连接 = 被定义（defined）

---

## 已解决的问题

### ✅ 问题1：月亮计算错误
**原因**：时区被转换了两次
**解决**：使用 `Date.UTC()` 直接创建正确的UTC时间

### ✅ 问题2：Dify集成设计
**解决**：创建了bodygraph-analyzer模块，自动分析星盘并生成Dify变量

---

## 待完成任务

### 1. Supabase集成
需要实现：
- 用户认证
- 存储多人的人类图数据
- 查询历史记录

### 2. 首页重新设计
参考Seth项目，实现：
- 简洁的登录界面
- 对话界面（调用Dify）
- 顶部"人类图资料"按钮 → 打开计算页面

### 3. 对话功能
- 集成Dify聊天组件
- 存储对话历史到Supabase

---

## 测试数据

```json
{
  "name": "杜富陶",
  "birthDate": "1983-10-15",
  "birthTime": "11:40",
  "location": "泸州",
  "timezone": "Asia/Shanghai"
}
```

**期望结果**：
- 类型：Projector (投射者)
- 权威：Sounding Board (外在权威)
- 人生角色：1/3
- 个性端 Sun: 32.1 ✅
- 个性端 Moon: 41.5 ✅
- 设计端 Sun: 62.3 ✅
- 设计端 Moon: 48.4 ✅

---

## 如何运行

```bash
# 启动开发服务器
cd app-web
npm run dev

# 测试API
node test-integration.js

# 访问页面
http://localhost:3003/calculate
```

---

## 给Dify集成AI的建议

如果你是帮助用户配置Dify的AI，请重点参考：

1. **`DIFY集成简明指南.md`** - 完整的Dify配置步骤
2. **`Dify操作手册-最终版.md`** - Dify知识库配置
3. **API返回的 `dify` 字段** - 直接使用的变量数据

关键点：
- Dify变量名必须与API返回的key完全匹配
- 提示词中使用 `{{变量名}}` 引用
- 知识库已上传人类图相关文档（王骁、陶子、Ra等）

---

## 项目文件结构

```
HumanDesignAI/
├── app-web/
│   ├── app/
│   │   ├── calculate/page.tsx          # 计算页面
│   │   └── api/
│   │       ├── calculate-chart/route.ts # 计算API
│   │       └── dify-summary/route.ts    # Dify摘要API
│   └── lib/
│       ├── astronomy-calculator.js      # 天文计算
│       ├── bodygraph-analyzer.js        # 星盘分析
│       └── arrow-calculator.js          # 箭头计算
├── test-integration.js                  # 测试脚本
├── DIFY集成简明指南.md                  # Dify集成文档
├── Dify操作手册-最终版.md               # Dify知识库配置
└── README-给其他AI的说明.md             # 本文件
```

---

## 联系信息

如有问题，请查看：
- 技术细节：`app-web/lib/bodygraph-analyzer.js` 源代码
- Dify集成：`DIFY集成简明指南.md`
- 测试验证：运行 `node test-integration.js`
