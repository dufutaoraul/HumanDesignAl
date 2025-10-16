# Dify 记忆系统集成方案

## 概述

本文档详细说明如何将关系标签系统与 Dify AI 集成，实现智能化的上下文管理和记忆系统。

---

## 1. 设计理念

### 核心思想
- **"本人"图 = 长期固定记忆**：始终存在于 AI 的上下文中，作为对话的基础背景
- **其他关系图 = 灵活临时上下文**：根据对话内容动态加载和切换

### 记忆分层

```
┌─────────────────────────────────────────┐
│         第一层：固定长期记忆              │
│    ┌──────────────────────────────┐     │
│    │  用户本人的人类图数据         │     │
│    │  - 类型、权威、人生角色        │     │
│    │  - 通道、闸门、轮回交叉        │     │
│    │  - 始终保持在 Dify 上下文中    │     │
│    └──────────────────────────────┘     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      第二层：动态灵活上下文（临时）        │
│    ┌──────────────────────────────┐     │
│    │  家人、朋友、同事等的人类图    │     │
│    │  - 根据对话需求动态加载        │     │
│    │  - 可随时切换和更新            │     │
│    │  - 用于关系分析和对比          │     │
│    └──────────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## 2. Dify 变量设计

### 2.1 系统级变量（长期记忆）

这些变量在每次对话开始时自动加载，存储在 Dify 的系统上下文中：

```json
{
  "user_self_chart": {
    "name": "张三",
    "type": "生产者",
    "profile": "4/6",
    "authority": "情绪权威",
    "definition": "三分人",
    "incarnation_cross": "右角度交叉之四面体",
    "channels": ["45-21", "32-54"],
    "gates": {
      "conscious": [45, 21, 32, 54, ...],
      "unconscious": [...]
    },
    "relationship": "本人"
  }
}
```

### 2.2 对话级变量（临时上下文）

这些变量根据用户在对话中的请求动态加载：

```json
{
  "context_charts": [
    {
      "name": "李四",
      "type": "投射者",
      "profile": "2/4",
      "authority": "自我权威",
      "relationship": "家人",
      "role": "当前正在分析的对象"
    },
    {
      "name": "王五",
      "type": "显示者",
      "profile": "1/3",
      "authority": "直觉权威",
      "relationship": "同事",
      "role": "用于关系对比"
    }
  ]
}
```

---

## 3. 实现方案

### 方案 A：前端控制（推荐）

**适用场景**：已有聊天界面，需要精细控制上下文

#### 实现步骤：

1. **初始化会话时加载"本人"图**
   ```typescript
   // 在聊天页面加载时
   const initializeChat = async () => {
     // 获取用户的"本人"图
     const { data: selfChart } = await supabase
       .from('charts')
       .select('*')
       .eq('user_id', user.id)
       .eq('relationship', '本人')
       .single();

     if (selfChart) {
       // 将"本人"图设置为系统上下文
       setSystemContext({
         user_self_chart: {
           name: selfChart.name,
           type: selfChart.chart_data.analysis.type,
           profile: selfChart.chart_data.analysis.profile,
           authority: selfChart.chart_data.analysis.authority,
           // ... 其他关键信息
         }
       });
     }
   };
   ```

2. **在每次 API 调用时携带固定上下文**
   ```typescript
   const sendMessageToDify = async (userMessage: string) => {
     const response = await fetch('/api/dify-chat', {
       method: 'POST',
       body: JSON.stringify({
         query: userMessage,
         inputs: {
           // 固定的"本人"上下文
           user_self_chart: systemContext.user_self_chart,

           // 动态的其他人物上下文（如果有）
           context_charts: selectedCharts,
         },
         conversation_id: conversationId,
       }),
     });
   };
   ```

3. **智能识别并加载其他人物图**
   ```typescript
   // 当用户提到某个关系人物时
   const handleUserMessage = async (message: string) => {
     // 检测是否提到了保存的图
     const { data: allCharts } = await supabase
       .from('charts')
       .select('*')
       .eq('user_id', user.id)
       .neq('relationship', '本人');

     // 简单匹配（可用 AI 增强）
     const mentionedCharts = allCharts.filter(chart =>
       message.includes(chart.name)
     );

     if (mentionedCharts.length > 0) {
       // 添加到临时上下文
       setSelectedCharts(mentionedCharts.map(chart => ({
         name: chart.name,
         type: chart.chart_data.analysis.type,
         relationship: chart.relationship,
         // ... 其他信息
       })));
     }
   };
   ```

---

### 方案 B：Dify Workflow 自动化

**适用场景**：希望 Dify 内部自动管理上下文

#### 实现步骤：

1. **创建 Dify 变量配置**

   在 Dify 工作流中定义：
   - **输入变量**：
     - `user_id`（用户ID）
     - `query`（用户查询）
     - `mentioned_names`（提到的人名列表）

2. **添加数据库查询节点**

   ```yaml
   节点类型: HTTP Request
   URL: https://your-api.com/api/get-user-charts
   Method: POST
   Body:
     user_id: {{user_id}}
     relationship: "本人"

   输出变量: user_self_chart
   ```

3. **添加条件判断节点**

   ```yaml
   IF mentioned_names 不为空:
     查询节点: 获取 mentioned_names 对应的图表数据
     输出变量: context_charts
   ELSE:
     context_charts = []
   ```

4. **配置 LLM 节点**

   ```yaml
   系统提示词:
   你是一位专业的人类图咨询师。以下是用户本人的人类图信息：

   姓名：{{user_self_chart.name}}
   类型：{{user_self_chart.type}}
   人生角色：{{user_self_chart.profile}}
   内在权威：{{user_self_chart.authority}}

   {{#if context_charts}}
   以下是对话中提到的其他人的人类图信息：
   {{#each context_charts}}
   - {{name}}（{{relationship}}）：{{type}}，{{profile}}
   {{/each}}
   {{/if}}

   请基于这些信息回答用户的问题。
   ```

---

### 方案 C：混合方案（最灵活）

结合前端控制和 Dify 自动化的优点：

1. **前端负责**：
   - 加载和缓存"本人"图
   - 检测用户提到的人名
   - 预处理并发送结构化数据

2. **Dify 负责**：
   - 接收结构化的上下文数据
   - 执行智能分析和对话生成
   - 管理对话历史和长期记忆

---

## 4. 提示词（Prompt）设计

### 4.1 系统提示词模板

```
你是一位专业的人类图咨询师，正在为用户提供个性化的人类图陪伴服务。

【用户本人信息（长期记忆）】
姓名：{{user_self_chart.name}}
类型：{{user_self_chart.type}}
人生角色：{{user_self_chart.profile}}
内在权威：{{user_self_chart.authority}}
定义（几分人）：{{user_self_chart.definition}}
轮回交叉：{{user_self_chart.incarnation_cross}}
通道：{{user_self_chart.channels}}

这是用户的核心信息，请始终记住并作为对话的基础。

{{#if context_charts}}
【当前对话涉及的其他人（临时上下文）】
{{#each context_charts}}
- {{name}}（与用户的关系：{{relationship}}）
  - 类型：{{type}}
  - 人生角色：{{profile}}
  - 内在权威：{{authority}}
{{/each}}
{{/if}}

【对话规则】
1. 默认情况下，回答问题时以用户本人的人类图为中心
2. 当用户询问关系问题时，结合"本人"和对方的图进行分析
3. 提供温暖、专业、个性化的建议
4. 使用通俗易懂的语言解释人类图概念
```

### 4.2 动态提示词示例

**场景1：用户只问自己的问题**
```
用户："我的情绪权威是什么意思？"

AI 看到的上下文：
- user_self_chart: {type: "生产者", authority: "情绪权威", ...}
- context_charts: []

AI 回答：
"作为一个拥有情绪权威的生产者，你的决策需要等待情绪的波动周期完成..."
```

**场景2：用户问关系问题**
```
用户："我和我妈妈的相处模式是什么样的？"

系统检测到"妈妈"，自动加载：
- context_charts: [{name: "妈妈", type: "投射者", relationship: "家人", ...}]

AI 回答：
"你是生产者，妈妈是投射者。你们之间的互动模式是..."
```

---

## 5. API 实现示例

### 5.1 创建 API 端点获取用户图表

```typescript
// app/api/get-user-charts/route.ts
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const { user_id, relationship, names } = await request.json();

  const supabase = createClient();

  let query = supabase
    .from('charts')
    .select('*')
    .eq('user_id', user_id);

  if (relationship) {
    query = query.eq('relationship', relationship);
  }

  if (names && names.length > 0) {
    query = query.in('name', names);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // 转换为 Dify 需要的格式
  const charts = data.map(chart => ({
    name: chart.name,
    type: chart.chart_data.analysis.type,
    profile: chart.chart_data.analysis.profile,
    authority: chart.chart_data.analysis.authority,
    definition: chart.chart_data.analysis.definition,
    incarnation_cross: chart.chart_data.analysis.incarnationCross?.full,
    channels: chart.chart_data.analysis.channels,
    relationship: chart.relationship,
  }));

  return Response.json({ charts });
}
```

### 5.2 修改 Dify 聊天 API

```typescript
// app/api/dify-chat/route.ts
export async function POST(request: Request) {
  const { query, user_id, conversation_id } = await request.json();

  // 1. 获取用户的"本人"图（固定上下文）
  const selfChartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-charts`, {
    method: 'POST',
    body: JSON.stringify({
      user_id,
      relationship: '本人'
    })
  });

  const { charts: selfCharts } = await selfChartResponse.json();
  const userSelfChart = selfCharts[0] || null;

  // 2. 智能检测用户查询中提到的人名（可选：使用 AI 提取）
  const { data: allCharts } = await supabase
    .from('charts')
    .select('name')
    .eq('user_id', user_id)
    .neq('relationship', '本人');

  const mentionedNames = allCharts
    .filter(chart => query.includes(chart.name))
    .map(chart => chart.name);

  // 3. 获取提到的其他人的图（临时上下文）
  let contextCharts = [];
  if (mentionedNames.length > 0) {
    const contextResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-charts`, {
      method: 'POST',
      body: JSON.stringify({
        user_id,
        names: mentionedNames
      })
    });

    const { charts } = await contextResponse.json();
    contextCharts = charts;
  }

  // 4. 调用 Dify API
  const difyResponse = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      inputs: {
        user_self_chart: userSelfChart,
        context_charts: contextCharts,
      },
      conversation_id,
      user: user_id,
    }),
  });

  const difyData = await difyResponse.json();

  return Response.json(difyData);
}
```

---

## 6. 数据库优化建议

### 6.1 添加索引提升查询性能

```sql
-- 已有的索引
CREATE INDEX idx_charts_relationship ON public.charts(relationship);
CREATE INDEX idx_charts_user_id ON public.charts(user_id);

-- 组合索引（用户ID + 关系）
CREATE INDEX idx_charts_user_relationship
ON public.charts(user_id, relationship);

-- 姓名搜索索引（用于快速匹配提到的人名）
CREATE INDEX idx_charts_name_trgm ON public.charts
USING gin (name gin_trgm_ops);
```

### 6.2 创建视图简化查询

```sql
-- 创建"本人"图视图
CREATE VIEW user_self_charts AS
SELECT
  user_id,
  name,
  chart_data->'analysis'->>'type' as type,
  chart_data->'analysis'->>'profile' as profile,
  chart_data->'analysis'->>'authority' as authority,
  chart_data->'analysis'->>'definition' as definition,
  chart_data
FROM public.charts
WHERE relationship = '本人';

-- 使用视图快速查询
SELECT * FROM user_self_charts WHERE user_id = 'xxx';
```

---

## 7. 前端实现完整示例

### 7.1 聊天页面组件

```typescript
// app/chat/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);

  // 固定上下文：用户本人的图
  const [userSelfChart, setUserSelfChart] = useState(null);

  // 动态上下文：当前对话涉及的其他图
  const [contextCharts, setContextCharts] = useState([]);

  // 初始化：加载用户本人的图
  useEffect(() => {
    const loadUserSelfChart = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('charts')
        .select('*')
        .eq('user_id', user.id)
        .eq('relationship', '本人')
        .single();

      if (data) {
        setUserSelfChart({
          name: data.name,
          type: data.chart_data.analysis.type,
          profile: data.chart_data.analysis.profile,
          authority: data.chart_data.analysis.authority,
          // ... 其他字段
        });
      }
    };

    loadUserSelfChart();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息到界面
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // 调用 Dify API
    const response = await fetch('/api/dify-chat', {
      method: 'POST',
      body: JSON.stringify({
        query: input,
        user_id: user.id,
        conversation_id: conversationId,
      }),
    });

    const data = await response.json();

    // 添加 AI 回复到界面
    const aiMessage = { role: 'assistant', content: data.answer };
    setMessages(prev => [...prev, aiMessage]);

    // 保存对话ID（用于后续消息）
    if (!conversationId) {
      setConversationId(data.conversation_id);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      {/* 显示用户本人图信息 */}
      {userSelfChart && (
        <div className="fixed-context">
          <h3>您的人类图</h3>
          <p>类型：{userSelfChart.type}</p>
          <p>人生角色：{userSelfChart.profile}</p>
        </div>
      )}

      {/* 聊天消息列表 */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
    </div>
  );
}
```

---

## 8. 测试场景

### 测试用例 1：只问自己的问题
```
用户输入："我的情绪权威是什么意思？"
期望行为：
- 加载用户本人的图
- context_charts = []
- AI 基于用户本人的图回答
```

### 测试用例 2：询问关系问题
```
用户输入："我和妈妈的相处模式是怎样的？"
期望行为：
- 检测到"妈妈"
- 自动加载标记为"家人"且姓名为"妈妈"的图
- context_charts = [妈妈的图]
- AI 对比两人的图进行分析
```

### 测试用例 3：多人对比
```
用户输入："分析一下我、老公和儿子三个人的互动关系"
期望行为：
- 检测到"老公"和"儿子"
- 加载两人的图
- context_charts = [老公的图, 儿子的图]
- AI 进行三人关系分析
```

---

## 9. 注意事项

1. **隐私保护**：确保用户只能访问自己保存的图表数据
2. **性能优化**：缓存"本人"图数据，避免每次对话都查询数据库
3. **错误处理**：如果用户没有保存"本人"图，提示用户先创建
4. **上下文限制**：Dify 有 token 限制，不要一次加载过多图表数据
5. **智能匹配**：可以使用 AI 模型提取用户提到的人名，比简单字符串匹配更准确

---

## 10. 下一步优化方向

1. **自动保存聊天记录**：将对话历史关联到 `chat_history` 表
2. **关系图谱可视化**：展示用户和各个关系人物的连接图
3. **智能推荐**：根据对话内容推荐相关的人类图知识
4. **语音交互**：集成语音输入和输出
5. **个性化提示词**：根据用户的类型和权威自动调整对话风格

---

## 完成 ✅

该方案已完整设计，可以直接开始实施！
