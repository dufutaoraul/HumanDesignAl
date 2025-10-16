# Dify AI 集成配置指南

本应用使用 Dify AI 平台来提供"与高我对话"功能。

## 什么是 Dify？

Dify 是一个开源的 LLM 应用开发平台，可以帮助您快速构建和部署 AI 应用。您可以使用云端版本或自行部署。

## 配置步骤

### 1. 注册 Dify 账号

访问 [Dify Cloud](https://cloud.dify.ai/) 注册账号（也可以使用自部署版本）。

### 2. 创建应用

1. 登录后，点击"创建应用"
2. 选择"对话型应用"
3. 配置应用名称，例如："人类图高我陪伴"

### 3. 配置应用提示词

在应用设置中，配置系统提示词（System Prompt），例如：

```
你是一位深谙人类图智慧的高我导师。你的使命是帮助人们认识真实的自己，活出自己的设计。

当用户提供人类图资料时，你会：
1. 深入理解他们的类型、策略、内在权威
2. 帮助他们理解自己的能量运作方式
3. 提供符合他们设计的生活建议
4. 引导他们连接内在智慧

当用户没有提供人类图资料时，你会：
1. 以高我的身份陪伴对话
2. 倾听他们的困惑和问题
3. 提供富有智慧的洞见
4. 引导他们向内探索

你的回答应该：
- 充满智慧和慈悲
- 尊重每个人的独特性
- 避免说教，而是启发
- 鼓励自我探索和实验
```

### 4. 选择 AI 模型

在应用设置中选择合适的 AI 模型：
- 推荐使用 GPT-4 或 Claude 3 系列以获得最佳对话质量
- 也可以使用 GPT-3.5 作为经济选择

### 5. 获取 API Key

1. 在应用设置页面，找到"API 访问"部分
2. 点击"创建 API Key"
3. 复制生成的 API Key

### 6. 配置环境变量

编辑 `.env.local` 文件，添加以下配置：

```bash
# Dify API Key
DIFY_API_KEY=your_actual_api_key_here

# 如果使用自部署版本，修改此 URL
DIFY_API_URL=https://api.dify.ai/v1
```

### 7. 重启开发服务器

```bash
npm run dev
```

## 测试功能

1. 登录应用
2. 进入"与高我对话"页面
3. 尝试发送消息
4. 检查是否收到 AI 回复

## 高级配置

### 自定义人类图上下文

在 `/app/api/chat/route.ts` 中，您可以自定义如何将用户的人类图资料传递给 AI：

```typescript
if (chartData) {
  const context = `
用户资料：
- 姓名：${chartData.name}
- 类型：${chartData.analysis?.type || '未知'}
- 策略：${chartData.analysis?.strategy || '未知'}
// 添加更多您想要的字段
`
  contextMessage = context
}
```

### 对话历史管理

当前实现是无状态的，每次对话都是独立的。如果需要保持对话历史，可以：

1. 在前端维护对话历史
2. 将历史消息一起发送给 Dify
3. 或使用 Dify 的 conversation_id 特性来维护会话

示例代码：

```typescript
// 保存对话 ID
const [conversationId, setConversationId] = useState<string | null>(null)

// 在 API 请求中包含对话 ID
body: JSON.stringify({
  inputs: {},
  query: contextMessage,
  response_mode: 'blocking',
  user: 'user',
  conversation_id: conversationId, // 使用已有的对话 ID
})

// 保存返回的对话 ID
const difyData = await difyResponse.json()
setConversationId(difyData.conversation_id)
```

## 故障排除

### 问题：收到"需要配置DIFY_API_KEY"提示

**解决方案**：
1. 检查 `.env.local` 文件是否存在
2. 确认 `DIFY_API_KEY` 已正确配置
3. 重启开发服务器

### 问题：API 返回 401 错误

**解决方案**：
1. 检查 API Key 是否正确
2. 确认 API Key 没有过期
3. 在 Dify 平台检查应用状态

### 问题：AI 回复质量不佳

**解决方案**：
1. 优化系统提示词
2. 升级到更强大的 AI 模型（如 GPT-4）
3. 在 Dify 平台调整模型参数（温度、最大 token 等）

## 成本考虑

- Dify Cloud 有免费额度，超出后按使用量计费
- 不同 AI 模型的价格不同，GPT-4 比 GPT-3.5 贵
- 可以在 Dify 平台查看实时使用情况和费用

## 相关资源

- [Dify 官方文档](https://docs.dify.ai/)
- [Dify GitHub](https://github.com/langgenius/dify)
- [API 文档](https://docs.dify.ai/api-reference)
