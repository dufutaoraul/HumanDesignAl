/**
 * 箭头符号计算器
 *
 * 实现完整的箭头计算逻辑，包括：
 * 1. 直接规则表查询
 * 2. HarmonicGates聚合
 * 3. 跨端(个性/设计)聚合
 *
 * 数据来源：SharpAstrology.HumanDesign/Utility/HumanDesignUtility.cs Line 709-742
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { FixingState, getFixingState } = require('./fixing-rules-complete.js');
const { getHarmonicGates } = require('./harmonic-gates.js');

/**
 * HarmonicGates聚合逻辑
 *
 * 对于当前行星的激活(gate, line)，查找所有激活harmonicGate的行星，
 * 然后查询这些行星+当前gate+当前line的规则，用位或(|)合并。
 *
 * @param {number} gate - 当前闸门
 * @param {number} line - 当前爻线
 * @param {number} harmonicGate - 和声闸门(与当前gate构成通道的闸门)
 * @param {Object} activations - 行星激活字典 {planet: {gate, line}}
 * @returns {number} 聚合后的FixingState
 */
function aggregateStateFromHarmonicGate(gate, line, harmonicGate, activations) {
  let state = FixingState.None;

  // 找到所有激活harmonicGate的行星
  const states = [];
  for (const [planet, activation] of Object.entries(activations)) {
    if (activation.gate === harmonicGate) {
      // 查询：该行星 + 当前gate + 当前line 的规则
      const planetState = getFixingState(planet, gate, line);
      states.push(planetState);
    }
  }

  // 用位或合并所有状态
  if (states.length > 0) {
    state = states.reduce((a, b) => a | b, FixingState.None);
  }

  return state;
}

/**
 * 计算行星的箭头状态（带跨端聚合）
 *
 * @param {string} planet - 行星名称
 * @param {Object} activations - 当前端的激活字典 {planet: {gate, line}}
 * @param {Object} comparerActivations - 对比端的激活字典 {planet: {gate, line}}
 * @returns {Object} { fixingState: number, changedByComparer: boolean }
 */
function calculateState(planet, activations, comparerActivations) {
  const result = {
    fixingState: FixingState.None,
    changedByComparer: false
  };

  // 步骤1：直接规则表查询
  const activation = activations[planet];
  if (!activation) {
    return result;
  }

  result.fixingState = getFixingState(planet, activation.gate, activation.line);

  // 步骤2：HarmonicGates聚合
  const harmonicGates = getHarmonicGates(activation.gate);

  for (const harmonicGate of harmonicGates) {
    // 2.1 在同一端（个性或设计）中聚合
    const sameEndState = aggregateStateFromHarmonicGate(
      activation.gate,
      activation.line,
      harmonicGate,
      activations
    );
    result.fixingState |= sameEndState;

    // 2.2 从另一端（设计或个性）聚合
    const otherEndState = aggregateStateFromHarmonicGate(
      activation.gate,
      activation.line,
      harmonicGate,
      comparerActivations
    );

    // 如果另一端提供了新的状态，标记为跨端聚合
    if ((result.fixingState & otherEndState) !== otherEndState) {
      result.fixingState |= otherEndState;
      result.changedByComparer = true;
    }
  }

  return result;
}

/**
 * 计算完整的箭头符号
 *
 * @param {Object} personalityActivations - 个性端激活 {planet: {gate, line}}
 * @param {Object} designActivations - 设计端激活 {planet: {gate, line}}
 * @returns {Object} 箭头结果
 */
function calculateArrows(personalityActivations, designActivations) {
  const result = {
    personality: {},
    design: {}
  };

  // 计算个性端箭头
  for (const planet of Object.keys(personalityActivations)) {
    result.personality[planet] = calculateState(
      planet,
      personalityActivations,
      designActivations
    );
  }

  // 计算设计端箭头
  for (const planet of Object.keys(designActivations)) {
    result.design[planet] = calculateState(
      planet,
      designActivations,
      personalityActivations
    );
  }

  return result;
}

/**
 * 格式化箭头符号为可读字符串
 * @param {number} fixingState - FixingState值
 * @returns {string} 箭头符号
 */
function formatArrowSymbol(fixingState) {
  if (fixingState === FixingState.Exalted) return '▲';
  if (fixingState === FixingState.Detriment) return '▼';
  if (fixingState === FixingState.Juxtaposed) return '✲';
  return '';
}

/**
 * 格式化箭头名称
 * @param {number} fixingState - FixingState值
 * @returns {string} 箭头名称
 */
function formatArrowName(fixingState) {
  if (fixingState === FixingState.Exalted) return 'Exalted';
  if (fixingState === FixingState.Detriment) return 'Detriment';
  if (fixingState === FixingState.Juxtaposed) return 'Juxtaposed';
  return 'None';
}

module.exports = {
  calculateState,
  calculateArrows,
  aggregateStateFromHarmonicGate,
  formatArrowSymbol,
  formatArrowName,
  FixingState
};
