'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, TABLES } from '@/lib/supabase';

interface PlanetData {
  gate: number;
  line: number;
  arrow?: string;
}

interface ChartData {
  id?: string;
  name: string;
  birthDate: string;
  birthTime: string;
  location: string;
  timezone: string;
  relationship?: string;
  planets: {
    personality: Record<string, PlanetData>;
    design: Record<string, PlanetData>;
  };
  analysis?: {
    type: string;
    profile: string;
    authority: string;
    definition: string;
    incarnationCross?: {
      full: string;
    };
    channels: string[];
  };
}

export default function CalculatePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('Asia/Shanghai'); // 默认北京时间
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [savedCharts, setSavedCharts] = useState<ChartData[]>([]);
  const [relationship, setRelationship] = useState('其他'); // 关系标签
  const [availableTags, setAvailableTags] = useState<string[]>([
    '本人', '家人', '朋友', '同事', '名人', '其他'
  ]); // 可用标签
  const [newTag, setNewTag] = useState(''); // 新建标签名
  const [showNewTagInput, setShowNewTagInput] = useState(false); // 是否显示新建标签输入框
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'relationship' | 'type'>('date'); // 排序方式

  // 认证保护：未登录时重定向到登录页
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // 加载用户保存的图表和自定义标签
  useEffect(() => {
    if (user) {
      loadSavedCharts();
      loadCustomTags();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSavedCharts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from(TABLES.CHARTS)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setSavedCharts(data.map(chart => ({
          id: chart.id,
          name: chart.name,
          birthDate: chart.birth_date,
          birthTime: chart.birth_time,
          location: chart.location,
          timezone: chart.timezone,
          relationship: chart.relationship || '其他',
          planets: chart.chart_data.planets,
          analysis: chart.chart_data.analysis,
        })));
      }
    } catch (error) {
      console.error('加载图表失败:', error);
    }
  };

  const loadCustomTags = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('relationship_tags')
        .select('tag_name')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data && data.length > 0) {
        const customTags = data.map(t => t.tag_name);
        // 合并预定义标签和用户自定义标签，去重
        const allTags = Array.from(new Set([...availableTags, ...customTags]));
        setAvailableTags(allTags);
      }
    } catch (error) {
      console.error('加载自定义标签失败:', error);
    }
  };

  // 获取排序后的图表列表
  const getSortedCharts = () => {
    const sorted = [...savedCharts];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

      case 'relationship':
        const relationshipOrder = ['本人', '家人', '朋友', '同事', '名人', '其他'];
        return sorted.sort((a, b) => {
          const aIndex = relationshipOrder.indexOf(a.relationship || '其他');
          const bIndex = relationshipOrder.indexOf(b.relationship || '其他');
          if (aIndex !== bIndex) return aIndex - bIndex;
          return a.name.localeCompare(b.name, 'zh-CN');
        });

      case 'type':
        return sorted.sort((a, b) => {
          const typeA = a.analysis?.type || '';
          const typeB = b.analysis?.type || '';
          if (typeA !== typeB) return typeA.localeCompare(typeB, 'zh-CN');
          return a.name.localeCompare(b.name, 'zh-CN');
        });

      case 'date':
      default:
        return sorted; // 已经按日期倒序排列
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim() || !user) return;

    try {
      // 检查标签是否已存在
      if (availableTags.includes(newTag.trim())) {
        alert('该标签已存在');
        return;
      }

      // 保存到数据库
      const { error } = await supabase
        .from('relationship_tags')
        .insert({
          user_id: user.id,
          tag_name: newTag.trim(),
        });

      if (error) throw error;

      // 更新本地标签列表
      setAvailableTags([...availableTags, newTag.trim()]);
      setRelationship(newTag.trim());
      setNewTag('');
      setShowNewTagInput(false);
      alert('新标签已添加');
    } catch (error: unknown) {
      console.error('添加标签失败:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`添加标签失败: ${errorMessage}`);
    }
  };

  const handleCalculate = async () => {
    if (!name || !birthDate || !birthTime || !location) {
      alert('请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/calculate-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime,
          location,
          timezone,
        }),
      });

      if (!response.ok) {
        throw new Error('计算失败');
      }

      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('计算错误:', error);
      alert('计算失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!chartData || !user) {
      alert('请先登录并计算人类图');
      return;
    }

    // 检查"本人"标签的唯一性
    if (relationship === '本人') {
      try {
        const { data: existingCharts, error: checkError } = await supabase
          .from(TABLES.CHARTS)
          .select('id')
          .eq('user_id', user.id)
          .eq('relationship', '本人');

        if (checkError) throw checkError;

        if (existingCharts && existingCharts.length > 0) {
          alert('⚠️ 每个用户只能有一个"本人"标签的人类图。\n\n请先删除或修改现有的"本人"图，或者为当前图选择其他标签。');
          return;
        }
      } catch (error: unknown) {
        console.error('检查失败:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`检查失败: ${errorMessage}`);
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from(TABLES.CHARTS)
        .insert({
          user_id: user.id,
          name: chartData.name,
          birth_date: chartData.birthDate,
          birth_time: chartData.birthTime,
          location: chartData.location,
          timezone: chartData.timezone,
          relationship: relationship,
          chart_data: {
            planets: chartData.planets,
            analysis: chartData.analysis,
          },
        });

      if (error) throw error;

      alert('✅ 保存成功！');
      await loadSavedCharts(); // 重新加载列表
      setRelationship('其他'); // 重置为默认值
    } catch (error: unknown) {
      console.error('保存失败:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // 检查是否是唯一性约束错误
      if (errorMessage.includes('本人')) {
        alert('⚠️ 每个用户只能有一个"本人"标签的人类图。请先删除或修改现有的"本人"图。');
      } else {
        alert(`保存失败: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const planets = [
    { en: 'Sun', cn: '太阳', symbol: '☉' },
    { en: 'Earth', cn: '地球', symbol: '⊕' },
    { en: 'Moon', cn: '月亮', symbol: '☽' },
    { en: 'NorthNode', cn: '北交点', symbol: '☊' },
    { en: 'SouthNode', cn: '南交点', symbol: '☋' },
    { en: 'Mercury', cn: '水星', symbol: '☿' },
    { en: 'Venus', cn: '金星', symbol: '♀' },
    { en: 'Mars', cn: '火星', symbol: '♂' },
    { en: 'Jupiter', cn: '木星', symbol: '♃' },
    { en: 'Saturn', cn: '土星', symbol: '♄' },
    { en: 'Uranus', cn: '天王星', symbol: '♅' },
    { en: 'Neptune', cn: '海王星', symbol: '♆' },
    { en: 'Pluto', cn: '冥王星', symbol: '♇' },
  ];

  // 如果正在加载认证状态，显示加载画面
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                人类图 AI 陪伴
              </h1>
              <span className="text-gray-600">计算器</span>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
              )}
              <button
                onClick={() => router.push('/charts')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                我的资料
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">人类图计算器</h2>

        {/* 输入表单 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">输入出生信息</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                placeholder="请输入姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">出生日期</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">出生时间</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">出生地点</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                placeholder="例如: 北京, 上海"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">时区</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              >
                <option value="Asia/Shanghai">中国(北京时间 UTC+8)</option>
                <option value="America/New_York">美国东部(UTC-5/-4)</option>
                <option value="America/Los_Angeles">美国西部(UTC-8/-7)</option>
                <option value="Europe/London">英国(UTC+0/+1)</option>
                <option value="Europe/Paris">欧洲中部(UTC+1/+2)</option>
                <option value="Asia/Tokyo">日本(UTC+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                关系标签 {relationship === '本人' && <span className="text-red-600 text-xs">(每个用户只能有1个)</span>}
              </label>
              <div className="flex gap-2">
                <select
                  value={relationship}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setShowNewTagInput(true);
                    } else {
                      setRelationship(e.target.value);
                      setShowNewTagInput(false);
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900"
                >
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                  <option value="__new__">+ 新建标签</option>
                </select>
              </div>
              {showNewTagInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="输入新标签名称"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNewTag();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddNewTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    添加
                  </button>
                  <button
                    onClick={() => {
                      setShowNewTagInput(false);
                      setNewTag('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '计算中...' : '计算人类图'}
            </button>

            {chartData && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                保存数据
              </button>
            )}
          </div>
        </div>

        {/* 计算结果 */}
        {chartData && (
          <div className="space-y-6 mb-8">
            {/* 基本信息卡片 */}
            {chartData.analysis && (
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-6">基本信息</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">姓名</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">类型</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.type}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">人生角色</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.profile}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">内在权威</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.authority}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">几分人</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.definition}
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm mb-2">轮回交叉</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.incarnationCross
                        ? chartData.analysis.incarnationCross.full
                        : '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-blue-200 text-sm mb-2">通道 (Channels)</label>
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-lg font-medium">
                      {chartData.analysis.channels.length > 0
                        ? chartData.analysis.channels.join(', ')
                        : '无通道'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 人类图数据表格 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {chartData.name} 的人类图数据
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                出生时间: {chartData.birthDate} {chartData.birthTime} ({chartData.location})
              </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {planets.map((planet) => {
                    const persData = chartData.planets.personality[planet.en] || {};
                    const desData = chartData.planets.design[planet.en] || {};

                    return (
                      <tr key={planet.en} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        {/* 左侧：设计端（红色） */}
                        <td className="px-6 py-4 text-right w-32">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-red-600 font-bold text-2xl">
                              {desData.gate ? `${desData.gate}.${desData.line}` : '-'}
                            </span>
                            {desData.arrow && (
                              <span className="text-red-500 text-xl">{desData.arrow}</span>
                            )}
                          </div>
                        </td>

                        {/* 中间：行星符号 */}
                        <td className="px-8 py-4 text-center bg-gradient-to-r from-transparent via-gray-50 to-transparent w-48">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-3xl text-gray-700">{planet.symbol}</span>
                            <span className="text-base font-medium text-gray-800">{planet.cn}</span>
                          </div>
                        </td>

                        {/* 右侧：个性端（黑色） */}
                        <td className="px-6 py-4 text-left w-32">
                          <div className="flex items-center justify-start gap-2">
                            {persData.arrow && (
                              <span className="text-gray-700 text-xl">{persData.arrow}</span>
                            )}
                            <span className="text-gray-900 font-bold text-2xl">
                              {persData.gate ? `${persData.gate}.${persData.line}` : '-'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* 已保存的数据列表 */}
        {savedCharts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">已保存的数据</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'relationship' | 'type')}
                  className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-900"
                >
                  <option value="date">保存时间</option>
                  <option value="name">姓名</option>
                  <option value="relationship">关系标签</option>
                  <option value="type">类型</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {getSortedCharts().map((chart, index) => (
                <div
                  key={chart.id || index}
                  className="border border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 hover:shadow-md transition-all"
                  onClick={() => setChartData(chart)}
                >
                  <div className="p-4">
                    {/* 标题行：姓名和标签 */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{chart.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        chart.relationship === '本人'
                          ? 'bg-purple-100 text-purple-800'
                          : chart.relationship === '家人'
                          ? 'bg-blue-100 text-blue-800'
                          : chart.relationship === '朋友'
                          ? 'bg-green-100 text-green-800'
                          : chart.relationship === '同事'
                          ? 'bg-yellow-100 text-yellow-800'
                          : chart.relationship === '名人'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {chart.relationship}
                      </span>
                    </div>

                    {/* 基本信息行 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">类型</p>
                        <p className="text-sm font-medium text-gray-900">
                          {chart.analysis?.type || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">人生角色</p>
                        <p className="text-sm font-medium text-gray-900">
                          {chart.analysis?.profile || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">内在权威</p>
                        <p className="text-sm font-medium text-gray-900">
                          {chart.analysis?.authority || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">几分人</p>
                        <p className="text-sm font-medium text-gray-900">
                          {chart.analysis?.definition || '-'}
                        </p>
                      </div>
                    </div>

                    {/* 通道信息 */}
                    {chart.analysis?.channels && chart.analysis.channels.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">通道 (Channels)</p>
                        <p className="text-sm text-gray-900">
                          {chart.analysis.channels.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* 出生信息行 */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
                      <span>📅 {chart.birthDate}</span>
                      <span>🕐 {chart.birthTime}</span>
                      <span>📍 {chart.location}</span>
                    </div>

                    {/* 轮回交叉（如果有） */}
                    {chart.analysis?.incarnationCross && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">轮回交叉</p>
                        <p className="text-sm text-gray-900">
                          {chart.analysis.incarnationCross.full}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
