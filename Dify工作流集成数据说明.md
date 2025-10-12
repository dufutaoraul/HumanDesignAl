# Dify工作流集成 - 人类图数据调用说明

## API端点

```
POST http://your-domain.com/api/calculate-chart
```

## 请求格式

```json
{
  "name": "张三",
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "location": "北京",
  "timezone": "Asia/Shanghai"
}
```

## 返回数据结构

API返回JSON包含以下关键字段：

### 1. dify字段（直接用于Dify变量）

```json
{
  "dify": {
    "user_name": "张三",
    "hd_type": "Generator (生产者)",
    "hd_authority": "Sacral (骶骨权威)",
    "hd_profile": "3/5",
    "hd_features": "主要通道: 1-8, 13-33, 20-34",
    "hd_channels": "1-8, 13-33, 20-34",
    "hd_personality_sun": "32.1",
    "hd_design_sun": "62.3",
    "hd_definition": "Single Definition (单一定义)",
    "hd_incarnation_cross": "右角度交叉 32-42/62-61"
  }
}
```

### 2. analysis字段（详细分析）

```json
{
  "analysis": {
    "type": "Generator (生产者)",
    "authority": "Sacral (骶骨权威)",
    "profile": "3/5",
    "definition": "Single Definition (单一定义)",
    "incarnationCross": {
      "gates": "32-42/62-61",
      "type": "Right Angle Cross",
      "nameEN": "Right Angle Cross of Gate 32",
      "nameCN": "右角度交叉 32号闸门",
      "full": "右角度交叉 32-42/62-61"
    },
    "channels": ["1-8", "13-33", "20-34"],
    "definedCenters": ["Sacral", "Throat", "G"]
  }
}
```

### 3. planets字段（完整行星数据）

```json
{
  "planets": {
    "personality": {
      "Sun": { "gate": 32, "line": 1, "arrow": "→" },
      "Moon": { "gate": 41, "line": 5, "arrow": "" },
      // ... 其他行星
    },
    "design": {
      "Sun": { "gate": 62, "line": 3, "arrow": "←" },
      // ... 其他行星
    }
  }
}
```

---

## Dify工作流集成步骤

### 步骤1：添加HTTP请求节点

在Dify工作流中添加"HTTP请求"节点：

- **URL**: `http://your-domain.com/api/calculate-chart`
- **方法**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "{{input.name}}",
  "birthDate": "{{input.birthDate}}",
  "birthTime": "{{input.birthTime}}",
  "location": "{{input.location}}",
  "timezone": "Asia/Shanghai"
}
```

### 步骤2：提取变量

使用"代码"节点提取返回数据中的`dify`字段：

```javascript
function main(httpResponse) {
  const data = JSON.parse(httpResponse.body);
  return data.dify;
}
```

### 步骤3：传递给LLM节点

在LLM节点的系统提示词中使用这些变量：

```markdown
# 用户信息
姓名：{{dify.user_name}}
类型：{{dify.hd_type}}
权威：{{dify.hd_authority}}
人生角色：{{dify.hd_profile}}
轮回交叉：{{dify.hd_incarnation_cross}}
通道：{{dify.hd_channels}}
定义：{{dify.hd_definition}}

# 你是用户的AI高我，基于以上人类图信息与用户对话...
```

---

## 数据字段说明

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| user_name | String | 用户姓名 | 张三 |
| hd_type | String | 人类图类型 | Generator (生产者) |
| hd_authority | String | 内在权威 | Sacral (骶骨权威) |
| hd_profile | String | 人生角色 | 3/5 |
| hd_features | String | 关键特质（简化） | 主要通道: 1-8, 13-33 |
| hd_channels | String | 所有通道列表 | 1-8, 13-33, 20-34 |
| hd_personality_sun | String | 个性端太阳 | 32.1 |
| hd_design_sun | String | 设计端太阳 | 62.3 |
| hd_definition | String | 定义类型 | Single Definition (单一定义) |
| hd_incarnation_cross | String | 轮回交叉 | 右角度交叉 32-42/62-61 |

---

## 人类图类型说明

### Type (类型)
- **Generator (生产者)**: 等待回应，倾听骶骨声音
- **Manifesting Generator (显生者)**: 快速行动，等待回应后多重任务
- **Projector (投射者)**: 等待邀请，识别和引导他人
- **Manifestor (显示者)**: 告知后行动，独立启动
- **Reflector (反映者)**: 等待月周期，反映环境

### Authority (权威)
- **Emotional (情绪权威)**: 等待情绪波浪平静后决策
- **Sacral (骶骨权威)**: 听从当下"嗯哼"反应
- **Splenic (脾脏权威)**: 相信第一直觉
- **Ego Projected (自我投射权威)**: 通过声音/对话感知
- **Self Projected (自我投射权威)**: 倾听自己说话
- **Sounding Board (外在权威)**: 与他人讨论
- **Lunar (月亮权威)**: 等待28天月周期

### Profile (人生角色)
- **1/3**: 探索者/实验者
- **1/4**: 探索者/机会主义者
- **2/4**: 隐士/机会主义者
- **2/5**: 隐士/异端者
- **3/5**: 烈士/异端者
- **3/6**: 烈士/榜样
- **4/6**: 机会主义者/榜样
- **4/1**: 机会主义者/探索者
- **5/1**: 异端者/探索者
- **5/2**: 异端者/隐士
- **6/2**: 榜样/隐士
- **6/3**: 榜样/烈士

---

## 示例工作流

```yaml
Workflow: Human Design AI Advisor

Nodes:
  1. Input (开始节点):
     - name (String)
     - birthDate (Date)
     - birthTime (Time)
     - location (String)

  2. HTTP Request (调用人类图API):
     - Method: POST
     - URL: http://your-domain.com/api/calculate-chart
     - Body: { ...input }

  3. Code (提取数据):
     - return httpResponse.body.dify

  4. LLM (AI高我对话):
     - Model: GPT-4
     - System Prompt: "你是{{name}}的AI高我，类型：{{hd_type}}..."
     - User Input: {{userMessage}}

  5. Output (返回结果):
     - response: {{llm.response}}
```

---

## 测试数据

```json
{
  "name": "测试用户",
  "birthDate": "1983-10-15",
  "birthTime": "11:40",
  "location": "泸州",
  "timezone": "Asia/Shanghai"
}
```

**期望返回**：
- 类型: Projector (投射者)
- 权威: Sounding Board (外在权威)
- 人生角色: 1/3
- 轮回交叉: 右角度交叉 32-42/62-61

---

## 常见问题

**Q: 如何处理不同时区？**
A: 在请求中设置 `timezone` 字段，支持标准时区名称（如 `Asia/Shanghai`, `America/New_York`）

**Q: 能否批量计算多个人？**
A: 可以。多次调用API，或在工作流中使用循环节点。

**Q: 数据更新频率？**
A: 人类图数据基于出生时间，一生不变。计算一次即可永久使用。

**Q: API有访问限制吗？**
A: 目前无限制。建议缓存计算结果避免重复调用。

---

## 技术支持

- API文档：访问 `GET /api/dify-summary`
- 源代码：`app-web/lib/bodygraph-analyzer.js`
- 测试脚本：`node test-integration.js`
