# HDKit (2016) 人类图开源项目 - 详细评估报告

> 评估日期: 2025-10-10
> 项目地址: https://github.com/jdempcy/hdkit
> 项目星标: 135 stars | 66 forks
> 最后更新: 2016年（主要代码）

---

## 一、项目概述

### 1.1 项目定位
HDKit 是世界上第一个开源的人类图编程工具包（Human Design Programming Toolkit），由 Jonah Dempcy 于 2016 年创建并开源，采用 MIT 许可证。

### 1.2 核心功能
- 生成完整的人类图（Bodygraph）
- 计算 26 个行星位置的闸门数据
- SVG Rave Mandala 绘制
- 提供 5 个示例应用（React, Rails, Node.js, HTML/SVG）

### 1.3 技术栈
- **后端计算**: Ruby + swe4r (Swiss Ephemeris C 扩展)
- **前端展示**: JavaScript, React, HTML/SVG
- **天文计算**: Swiss Ephemeris (业界黄金标准)
- **数据库**: PostgreSQL (示例应用)

---

## 二、依赖分析

### 2.1 核心依赖（Rails 示例应用）

#### 主要 Gems (Gemfile)
```ruby
# 框架
Rails 8.0.1                 # ⚠️ 2025年1月发布，项目已更新到最新版本

# 关键依赖
swe4r                       # ✅ Swiss Ephemeris C扩展 (天文计算核心)
geocoder                    # ✅ 地理位置服务
rest-client                 # ✅ HTTP客户端

# 数据库与部署
pg (PostgreSQL)             # ✅ 数据库
puma                        # ✅ Web服务器
kamal                       # ✅ 现代化部署工具
```

#### 依赖状态评估

**优点**:
- ✅ **核心天文计算库可靠**: swe4r 基于 Swiss Ephemeris，这是占星学和天文学计算的黄金标准
- ✅ **Rails 8.0.1 最新版本**: 说明项目在2025年有过维护更新
- ✅ **依赖简洁**: 没有过多的外部依赖，降低了维护风险

**问题**:
- ⚠️ **swe4r 维护状态未知**: GitHub (aakara/swe4r) 最后更新 2014年2月
- ⚠️ **GPL-2.0 许可**: swe4r 是 GPL 许可，可能对商业应用有限制
- ⚠️ **无 npm 包**: 主库没有发布为 npm 包，需要手动集成

### 2.2 前端依赖
```
无标准 package.json
主要依赖原生 JavaScript 和 SVG
```

**评估**:
- ✅ **轻量级**: 不依赖复杂的前端框架
- ❌ **缺乏现代化工具链**: 没有 TypeScript, 没有现代构建工具
- ❌ **难以集成到 Next.js 项目**: 需要大量改造

---

## 三、天文计算准确性分析

### 3.1 计算引擎: Swiss Ephemeris (swe4r)

**核心代码片段** (hdkit.rb):
```ruby
def generate_activations(celestial_positions)
  sun_activation = activation(celestial_positions[Swe4r::SE_SUN][0])
  north_node_activation = activation(celestial_positions[Swe4r::SE_TRUE_NODE][0])
  moon_activation = activation(celestial_positions[Swe4r::SE_MOON][0])
  mercury_activation = activation(celestial_positions[Swe4r::SE_MERCURY][0])
  # ... 其他行星
end
```

**准确性评估**:

| 评估项 | 状态 | 说明 |
|--------|------|------|
| 天文库来源 | ✅ 优秀 | Swiss Ephemeris 是 NASA JPL 数据支持的专业库 |
| 行星位置精度 | ✅ 优秀 | 精度可达 1 角秒以内 |
| 13 个行星支持 | ✅ 完整 | Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Earth, North Node, South Node |
| 设计日期计算 | ✅ 正确 | 88° 太阳逆行计算（约88天） |
| 时区处理 | ⚠️ 需验证 | 未找到明确的时区转换代码 |

**已知问题** (来自 GitHub Issues):
1. **Issue #1**: "Where to get data for calculating?"
   - 用户对行星位置数据来源有疑问
   - 作者确认使用 Swiss Ephemeris，数据可靠

2. **设计时间计算问题**:
   - 有 issue 提到 "`get-bodygraph-json.js` returns the wrong design time"
   - 可能涉及时区或闰秒处理的边缘情况

**结论**:
- ✅ **天文计算核心可靠**，基于业界标准
- ⚠️ **边缘情况需要测试**（时区、夏令时、历史日期）

---

## 四、闸门和通道映射关系

### 4.1 闸门顺序定义 (constants.js)

**发现的三种闸门顺序**:
```javascript
// 1. 标准闸门顺序 (64个闸门)
GATES = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, ...]

// 2. Harmonic Order (调和顺序)
harmonicOrder = [...]

// 3. SVG Rave Mandala 绘图顺序
svgRaveMandalaGateOrder = [47, 64, 40, 59, 29, 4, 7, 33, 31, 56, 62, 53, ...]
```

### 4.2 闸门映射数据 (constants.js)

**包含的映射关系**:
- ✅ **64 个闸门名称和描述**
- ✅ **闸门对宫关系** (oppositeGate 函数)
- ✅ **调和闸门关系** (harmonicGate 函数)
- ✅ **氨基酸映射** (aminoAcidsByGate)
- ✅ **核苷酸序列** (nucleicAcidByGate)
- ✅ **God Heads 关联** (godheadByGate)
- ✅ **I Ching 六十四卦对应** (hexagramGlyphs)

**评估**:
| 数据项 | 完整性 | 可用性 |
|--------|--------|--------|
| 64 闸门基础数据 | ✅ 完整 | ✅ 可直接使用 |
| 闸门对宫表 | ✅ 完整 | ✅ 有函数实现 |
| 36 条通道定义 | ❓ 未找到明确数据 | ⚠️ 可能需要从其他文件提取 |
| 闸门→中心映射 | ❓ 未找到 | ❌ 需要自己建立 |
| 通道→类型映射 | ❓ 部分实现 | ⚠️ 在 bodygraph_data.rb 中 |

### 4.3 通道和中心计算 (bodygraph_data.rb)

**发现的核心方法**:
```ruby
class BodygraphData
  def aura_type          # 计算人类图类型 (生产者、投射者等)
  def inner_authority    # 计算内在权威
  def definition         # 计算定义 (几分人)
  def incarnation_cross  # 计算轮回交叉
  def variable           # 计算变量
end
```

**评估**:
- ✅ **类型判断逻辑完整**: 包含 5 种类型的判断
- ✅ **内在权威计算**: 包含 7 种权威的优先级判断
- ⚠️ **定义计算复杂**: 使用图论算法，需要仔细验证
- ⚠️ **轮回交叉映射**: 包含预定义的交叉数据，但未见完整的 192 个

**已知 Bug**:
- **Issue**: "Chart says I'm Triple Split When I am just a single split"
  - 说明 definition (定义) 计算有错误
  - 有 PR #13 尝试修复: "Modify split definition logic and add test"
  - ⚠️ **这是一个核心 Bug，直接影响推算准确性**

---

## 五、SVG 绘图逻辑评估

### 5.1 Rave Mandala 示例 (svg-rave-mandala.html)

**发现的绘图代码**:
```html
<svg width="800" height="800">
  <circle cx="400" cy="400" r="320" fill="transparent" stroke="#000"/>
  <circle cx="400" cy="400" r="360" fill="transparent" stroke="#000"/>
  <circle cx="400" cy="400" r="400" fill="transparent" stroke="#000"/>
  <g transform="translate(400, 400) scale(4)">
    <script>
      const svgRaveMandalaGateOrder = [47, 64, 40, 59, ...];
      const astrologicalSigns = ["Virgo", "Leo", "Cancer", ...];
      // 动态生成闸门和星座的 SVG 元素
    </script>
  </g>
</svg>
```

**评估**:

| 功能项 | 完整性 | 可用性 |
|--------|--------|--------|
| 基础圆形结构 | ✅ 完整 | ✅ 可直接使用 |
| 64 闸门位置计算 | ✅ 完整 | ✅ 有顺序定义 |
| 12 星座绘制 | ✅ 完整 | ✅ 可用 |
| 9 个中心绘制 | ❓ 未见代码 | ❌ 需要自己实现 |
| 36 条通道连线 | ❓ 未见代码 | ❌ 需要自己实现 |
| 行星激活标记 | ❓ 未见代码 | ❌ 需要自己实现 |

**SVG 实现方式**:
- ✅ **使用原生 SVG + JavaScript**: 轻量级，易于定制
- ⚠️ **不是 React 组件**: 如果要用于 Next.js，需要改造
- ⚠️ **代码不完整**: 只有 Mandala 外圈，没有 Bodygraph 中心部分

### 5.2 示例应用目录结构
```
sample-apps/
├── hdblacklist-client   (React)
├── hdkit_sample_app     (Rails) ✅ 最完整的实现
├── pdf-maker            (Node/React)
├── rave-mandala         (HTML/SVG) ⚠️ 部分实现
└── v1                   (JavaScript工具方法)
```

**推荐**:
- ✅ **hdkit_sample_app (Rails)** 是最完整的参考实现
- ⚠️ **rave-mandala** 只能作为 SVG 绘图的起点

---

## 六、已知 Bugs 和 Issues 总结

### 6.1 开放的 Issues (8个)

| Issue | 严重性 | 影响范围 | 状态 |
|-------|--------|----------|------|
| **Split Definition 计算错误** | 🔴 高 | 核心推算逻辑 | 有PR等待合并 |
| **Design Time 计算错误** | 🔴 高 | 天文计算 | 未解决 |
| **Ephemeris URL 404** | 🟡 中 | 依赖资源 | 未解决 |
| **npm run 报错** | 🟡 中 | 开发体验 | 未解决 |
| **缺少 Swift API** | 🟢 低 | 功能扩展 | 功能请求 |
| **缺少原始 Ruby 代码** | 🟢 低 | 文档 | 功能请求 |
| **Planetary position data** | 🟢 低 | 文档 | 问题咨询 |
| **G2B Notation 标准化** | 🟢 低 | 功能扩展 | 提案 |

### 6.2 关键 Bug 详细分析

#### Bug 1: Split Definition 计算错误
**症状**:
- 用户报告显示 "Triple Split"（三分人），但实际应该是 "Single Split"（一分人）

**影响**:
- ❌ 直接影响"定义"（Definition）的准确性
- ❌ 这是六大核心属性之一，错误会导致整个解读偏差

**状态**:
- PR #13 "Modify split definition logic and add test" 已提交但未合并
- ⚠️ **需要仔细审查这个 PR 的修复方案**

**建议**:
- 🔧 **必须修复**: 如果要使用这个项目，必须先验证并修复这个 Bug
- 📝 **需要测试用例**: 准备多个真实人类图案例进行验证

#### Bug 2: Design Time 计算错误
**症状**:
- `get-bodygraph-json.js` 返回错误的设计时间

**影响**:
- ❌ 设计时间是出生前 88° 太阳逆行的时刻
- ❌ 如果这个错误，13 个红色行星位置全部错误
- ❌ 影响范围: 50% 的闸门数据

**可能原因**:
- 时区处理错误
- 闰秒未考虑
- 夏令时处理错误
- 太阳逆行 88° 的计算方法错误

**建议**:
- 🔧 **必须验证**: 用已知准确的人类图网站对比验证
- 📝 **需要边缘测试**: 测试不同时区、历史日期、闰年等情况

---

## 七、代码质量评估

### 7.1 代码组织

| 评估项 | 评分 | 说明 |
|--------|------|------|
| 模块化程度 | ⭐⭐⭐☆☆ | 有 constants, hdkit, bodygraph_data 分离，但职责不够清晰 |
| 可读性 | ⭐⭐⭐☆☆ | Ruby 代码较清晰，JavaScript 部分缺少注释 |
| 测试覆盖 | ⭐☆☆☆☆ | 几乎没有测试文件（这是最大问题） |
| 文档完整性 | ⭐⭐☆☆☆ | README 简单，缺少 API 文档和使用指南 |
| 错误处理 | ⭐⭐☆☆☆ | 缺少异常处理和边界情况检查 |

### 7.2 可维护性评估

**优点**:
- ✅ **MIT 许可**: 完全开源，可自由修改和商用
- ✅ **代码量适中**: 核心代码不到 1000 行，易于理解
- ✅ **依赖简洁**: 主要依赖 swe4r，风险可控

**问题**:
- ❌ **缺少测试**: 无法保证修改后的正确性
- ❌ **维护不活跃**: 2016 年发布后，更新很少
- ❌ **Issues 未处理**: 8 个开放 issues，作者响应慢
- ❌ **PR 未合并**: 关键 Bug 修复的 PR 长时间未合并

### 7.3 技术债务

| 债务类型 | 严重性 | 说明 |
|----------|--------|------|
| 缺少类型定义 | 🟡 中 | 无 TypeScript，无 RBS (Ruby 3) |
| 缺少单元测试 | 🔴 高 | 核心计算逻辑无测试保障 |
| 硬编码数据 | 🟡 中 | 轮回交叉等数据硬编码在代码中 |
| 无 API 文档 | 🟡 中 | 函数用法需要阅读源码才能理解 |
| 过时的依赖 | 🟢 低 | Rails 8.0.1 已更新，但 swe4r 2014 年停更 |

---

## 八、可直接使用的部分

### 8.1 ✅ 推荐直接使用

1. **constants.js 中的映射数据** (95% 可用)
   - 64 个闸门名称、描述
   - 闸门对宫关系 (oppositeGate)
   - 调和闸门关系 (harmonicGate)
   - I Ching 六十四卦对应
   - 氨基酸、核苷酸映射

2. **天文计算方案参考** (概念可用)
   - Swiss Ephemeris 的使用方式
   - 13 个行星的提取顺序
   - 设计日期 = 出生前 88° 太阳逆行

3. **SVG 绘图思路** (部分可用)
   - Rave Mandala 外圈的绘制逻辑
   - 64 闸门的圆周排列顺序
   - 12 星座的标注方式

### 8.2 ⚠️ 需要验证后使用

1. **bodygraph_data.rb 中的计算逻辑** (需要 Debug)
   - `aura_type` (类型判断) - 可能正确，需验证
   - `inner_authority` (内在权威) - 可能正确，需验证
   - `definition` (定义) - **已知有 Bug，必须修复**
   - `incarnation_cross` (轮回交叉) - 需要检查映射表完整性

2. **时间和时区处理** (需要测试)
   - 设计时间的计算
   - 时区转换
   - 夏令时处理

### 8.3 ❌ 不可直接使用

1. **整个 JavaScript 前端部分**
   - 代码不完整
   - 没有模块化
   - 无法直接集成到 Next.js

2. **Rails 示例应用**
   - 技术栈不匹配（我们用 Next.js + TypeScript）
   - 但可以作为逻辑参考

---

## 九、需要修复或更新的部分

### 9.1 🔧 必须修复（核心功能）

1. **Split Definition 计算错误**
   - **优先级**: 🔴 最高
   - **工作量**: 2-3 天
   - **方案**:
     - 审查 PR #13 的修复代码
     - 编写测试用例验证
     - 用多个已知准确的人类图案例对比

2. **Design Time 计算验证**
   - **优先级**: 🔴 最高
   - **工作量**: 3-5 天
   - **方案**:
     - 对比多个在线人类图网站的计算结果
     - 检查时区、夏令时、闰秒处理
     - 编写边缘情况测试（历史日期、不同时区）

3. **建立完整的数据映射表**
   - **优先级**: 🔴 高
   - **工作量**: 5-7 天
   - **缺失数据**:
     - 36 条通道的完整定义（闸门对、名称、连接的中心）
     - 64 个闸门→9 个中心的映射表
     - 192 个轮回交叉的完整映射

### 9.2 🛠️ 建议更新（提升可用性）

1. **TypeScript 改造**
   - **优先级**: 🟡 中
   - **工作量**: 7-10 天
   - **好处**:
     - 类型安全
     - IDE 自动补全
     - 降低集成错误

2. **模块化和 npm 包发布**
   - **优先级**: 🟡 中
   - **工作量**: 5-7 天
   - **好处**:
     - 易于在 Next.js 中安装使用
     - 版本管理更规范

3. **单元测试和集成测试**
   - **优先级**: 🟡 中
   - **工作量**: 10-15 天
   - **好处**:
     - 保证修改后的正确性
     - 回归测试
     - 文档作用（测试即文档）

4. **完整的 SVG Bodygraph 组件**
   - **优先级**: 🟢 低
   - **工作量**: 10-15 天
   - **内容**:
     - 9 个中心的绘制
     - 36 条通道的连线
     - 行星激活的标记
     - 响应式设计

### 9.3 🎨 可选优化（增强体验）

1. **React/Next.js 组件化**
   - Bodygraph 组件
   - Planet Table 组件
   - Interactive SVG

2. **性能优化**
   - 缓存计算结果
   - 懒加载 SVG 元素
   - Web Workers 异步计算

---

## 十、与我们项目的集成建议

### 10.1 推荐集成策略：混合方案

**方案**: swisseph-wasm + HDKit 数据映射 + 自研计算逻辑

| 组件 | 来源 | 理由 |
|------|------|------|
| 天文计算引擎 | **swisseph-wasm** | ✅ 有 npm 包，支持浏览器，性能更好 |
| 闸门映射数据 | **HDKit constants.js** | ✅ 直接可用，数据完整 |
| 类型/权威计算 | **参考 HDKit，自己实现** | ⚠️ HDKit 有 Bug，需要修复后重写 |
| 定义计算 | **自己实现图论算法** | ❌ HDKit 有 Bug，不能直接用 |
| 轮回交叉 | **提取 HDKit 数据 + 补充** | ⚠️ HDKit 数据不完整，需要补充到 192 个 |
| SVG 绘图 | **参考 HDKit，用 React 重写** | ⚠️ HDKit 代码不完整，需要大量补充 |

### 10.2 具体实施步骤

#### 第一阶段：数据提取（1-2 天）
```bash
# 1. 从 HDKit 提取可用数据
- constants.js → 转为 TypeScript 常量文件
  - gateNames (64 个闸门名称)
  - oppositeGates (对宫表)
  - harmonicGates (调和表)
  - hexagramGlyphs (I Ching)

# 2. 补充缺失数据
- 36 条通道定义
- 64 闸门→9 中心映射
- 192 个轮回交叉（从知识库提取）
```

#### 第二阶段：天文计算（3-5 天）
```typescript
// 使用 swisseph-wasm 替代 swe4r

import swisseph from 'swisseph-wasm'

async function calculatePlanetaryPositions(
  birthDate: Date,
  latitude: number,
  longitude: number
) {
  // 1. 计算 13 个行星的黄道经度
  const personality = await calculatePersonalityChart(birthDate)

  // 2. 计算设计日期（88° 太阳逆行）
  const designDate = await calculateDesignDate(birthDate)
  const design = await calculateDesignChart(designDate)

  // 3. 转换为 26 个闸门位置
  const gates26 = convertToGates(personality, design)

  return gates26
}
```

#### 第三阶段：推算逻辑（5-7 天）
```typescript
// 完全自己实现，参考 HDKit 但修复 Bug

import { calculateHumanDesign } from './calculator'

const result = calculateHumanDesign(gates26)
// {
//   profile: "6/2",
//   type: "投射者",
//   authority: "情绪权威",
//   incarnationCross: "右角度交叉之...",
//   definition: "二分人",
//   channels: ["13-33", "20-34"],
//   centers: { sacral: true, throat: false, ... }
// }
```

#### 第四阶段：SVG 绘图（10-15 天）
```typescript
// React 组件化，参考 HDKit 的布局

import { Bodygraph } from '@/components/Bodygraph'

<Bodygraph
  gates26={gates26}
  centers={centers}
  channels={channels}
  width={800}
  height={800}
/>
```

### 10.3 风险控制

| 风险 | 应对措施 |
|------|----------|
| **Bug 影响准确性** | 多源验证：对比 3+ 个在线人类图工具 |
| **数据不完整** | 从知识库文档补充（轮回交叉、通道定义） |
| **集成复杂度高** | 分阶段开发，先计算后绘图 |
| **维护成本高** | 编写完整测试，用测试保证质量 |

---

## 十一、总体评分

### 11.1 评估维度

| 维度 | 评分 | 说明 |
|------|------|------|
| **天文计算准确性** | ⭐⭐⭐⭐☆ (4/5) | Swiss Ephemeris 可靠，但时间处理有疑问 |
| **数据映射完整性** | ⭐⭐⭐☆☆ (3/5) | 闸门数据完整，通道和交叉不完整 |
| **代码质量** | ⭐⭐☆☆☆ (2/5) | 缺少测试，有已知 Bug |
| **可维护性** | ⭐⭐☆☆☆ (2/5) | 项目不活跃，Issues 未解决 |
| **直接可用性** | ⭐⭐☆☆☆ (2/5) | 需要大量改造才能用于生产 |
| **参考价值** | ⭐⭐⭐⭐☆ (4/5) | 作为参考实现很有价值 |

**总评**: ⭐⭐⭐☆☆ (3/5)

### 11.2 总结陈述

**HDKit 是什么**:
- ✅ 世界上第一个开源人类图编程工具包
- ✅ 基于可靠的天文计算库（Swiss Ephemeris）
- ✅ 包含大量有价值的映射数据

**HDKit 不是什么**:
- ❌ 不是一个可以开箱即用的 npm 包
- ❌ 不是一个经过充分测试的生产级库
- ❌ 不是一个活跃维护的项目

**对我们的价值**:
- 🟢 **高价值**: 作为参考实现和数据来源
- 🟡 **中等风险**: 有已知 Bug，需要验证和修复
- 🔴 **不能直接用**: 需要大量改造和补充

---

## 十二、改进建议优先级

### 🔴 P0 - 必须做（核心功能）

1. **验证和修复 Split Definition Bug**
   - 工作量: 2-3 天
   - 影响: 核心推算准确性

2. **验证 Design Time 计算**
   - 工作量: 3-5 天
   - 影响: 50% 的闸门数据

3. **补充完整数据映射表**
   - 36 条通道定义
   - 64 闸门→9 中心映射
   - 192 个轮回交叉
   - 工作量: 5-7 天

### 🟡 P1 - 应该做（提升可用性）

4. **TypeScript 改造**
   - 工作量: 7-10 天
   - 好处: 类型安全，易于集成

5. **编写单元测试**
   - 工作量: 10-15 天
   - 好处: 保证质量

6. **模块化和 npm 包**
   - 工作量: 5-7 天
   - 好处: 易于安装使用

### 🟢 P2 - 可以做（增强体验）

7. **完整 SVG Bodygraph 组件**
   - 工作量: 10-15 天

8. **React/Next.js 组件化**
   - 工作量: 7-10 天

9. **性能优化**
   - 工作量: 3-5 天

---

## 十三、结论和建议

### 13.1 核心结论

**HDKit 2016 项目的当前状态**:
- ✅ **有参考价值**: 作为人类图计算的第一个开源实现，包含大量有价值的数据和逻辑
- ⚠️ **有已知问题**: Split Definition 计算有 Bug，Design Time 计算需要验证
- ❌ **不能直接用**: 技术栈老旧，代码不完整，缺少测试

### 13.2 推荐方案

**最佳策略**: **参考 HDKit + 自研核心逻辑 + swisseph-wasm**

```
天文计算: swisseph-wasm (npm, 现代化, 高性能)
         ↓
数据映射: HDKit constants.js (直接提取)
         ↓
推算逻辑: 自己实现 (参考 HDKit 但修复 Bug)
         ↓
SVG 绘图: 参考 HDKit 布局，React 重写
```

**理由**:
1. ✅ **避开 HDKit 的 Bug 和技术债务**
2. ✅ **利用 HDKit 的数据和经验**
3. ✅ **使用现代化工具链（TypeScript, Next.js）**
4. ✅ **完全掌控代码质量和维护**

### 13.3 时间和资源估算

**完整实现人类图计算和绘图功能**:

| 阶段 | 工作量 | 交付物 |
|------|--------|--------|
| 数据提取和补充 | 5-7 天 | 完整的常量文件 |
| 天文计算集成 | 3-5 天 | swisseph-wasm 封装 |
| 推算逻辑开发 | 7-10 天 | TypeScript 计算引擎 |
| SVG 绘图开发 | 10-15 天 | React Bodygraph 组件 |
| 测试和验证 | 5-7 天 | 测试套件 + 验证报告 |
| **总计** | **30-44 天** | **完整的人类图系统** |

**如果复用 HDKit 更多代码**（不推荐）:
- 时间可缩短到 20-30 天
- 但会继承 Bug 和技术债务
- 后期维护成本更高

### 13.4 最终建议

**对于我们的项目 (HumanDesignAI)**:

1. ✅ **提取 HDKit 的数据映射** (constants.js)
2. ✅ **参考 HDKit 的计算逻辑** (bodygraph_data.rb)
3. ❌ **不要直接用 HDKit 的代码** (有 Bug，技术栈不匹配)
4. ✅ **使用 swisseph-wasm** 作为天文计算引擎
5. ✅ **自己实现核心推算逻辑** (TypeScript, 带测试)
6. ✅ **分阶段开发**: 先计算，后绘图

**风险提示**:
- ⚠️ **必须多源验证**: 用 3+ 个在线工具对比验证计算结果
- ⚠️ **测试是关键**: HDKit 的教训是缺少测试导致 Bug 存在多年
- ⚠️ **数据完整性**: 需要从知识库补充 HDKit 缺失的数据

---

**评估完成日期**: 2025-10-10
**评估人**: Claude (AI Assistant)
**下一步**: 开始数据提取和 swisseph-wasm 集成
