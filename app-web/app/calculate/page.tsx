/**
 * 人类图计算器 - 现代美观设计
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [savedCharts, setSavedCharts] = useState<ChartData[]>([]);
  const [relationship, setRelationship] = useState('其他');
  const [availableTags, setAvailableTags] = useState<string[]>([
    '本人', '家人', '朋友', '同事', '名人', '其他'
  ]);
  const [newTag, setNewTag] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'relationship' | 'type'>('date');
  const [hasSelfChart, setHasSelfChart] = useState(false);

  // 认证保护
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadSavedCharts = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from(TABLES.CHARTS)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        const charts = data.map(chart => ({
          id: chart.id,
          name: chart.name,
          birthDate: chart.birth_date,
          birthTime: chart.birth_time,
          location: chart.location,
          timezone: chart.timezone,
          relationship: chart.relationship || '其他',
          planets: chart.chart_data.planets,
          analysis: chart.chart_data.analysis,
        }));
        setSavedCharts(charts);

        // 检查是否已有"本人"记录
        const hasSelf = charts.some(chart => chart.relationship === '本人');
        setHasSelfChart(hasSelf);

        // 如果已有本人记录，从可用标签中移除"本人"
        if (hasSelf) {
          setAvailableTags(prev => prev.filter(tag => tag !== '本人'));
        }
      }
    } catch (error) {
      console.error('加载图表失败:', error);
    }
  }, [user]);

  const loadCustomTags = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('relationship_tags')
        .select('tag_name')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data && data.length > 0) {
        const customTags = data.map(t => t.tag_name);
        const allTags = Array.from(new Set([...availableTags, ...customTags]));
        setAvailableTags(allTags);
      }
    } catch (error) {
      console.error('加载自定义标签失败:', error);
    }
  }, [user, availableTags]);

  // 加载数据
  useEffect(() => {
    if (user) {
      loadSavedCharts();
      loadCustomTags();
    }
  }, [user, loadSavedCharts, loadCustomTags]);

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
      default:
        return sorted;
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim() || !user) return;

    try {
      if (availableTags.includes(newTag.trim())) {
        alert('该标签已存在');
        return;
      }

      const { error } = await supabase
        .from('relationship_tags')
        .insert({
          user_id: user.id,
          tag_name: newTag.trim(),
        });

      if (error) throw error;

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
      await loadSavedCharts();
      setRelationship('其他');
    } catch (error: unknown) {
      console.error('保存失败:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('本人')) {
        alert('⚠️ 每个用户只能有一个"本人"标签的人类图。请先删除或修改现有的"本人"图。');
      } else {
        alert(`保存失败: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 认证加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center main-content">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main-content flex">
      {/* 全新设计：左侧操作面板 */}
      <div className="w-96 bg-white/5 backdrop-blur-sm border-r border-white/10 p-6">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white mb-2">人类图计算器</h1>
          <p className="text-sm text-white/60">探索您的宇宙能量印记</p>
        </div>

        {/* 输入表单 - 只有当没有本人资料时才显示 */}
        {!hasSelfChart && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">出生日期</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">出生时间</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">出生地点</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="例如: 北京"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">时区</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Asia/Shanghai">中国(UTC+8)</option>
                <option value="America/New_York">美国东部(UTC-5/-4)</option>
                <option value="America/Los_Angeles">美国西部(UTC-8/-7)</option>
                <option value="Europe/London">英国(UTC+0/+1)</option>
                <option value="Europe/Paris">欧洲中部(UTC+1/+2)</option>
                <option value="Asia/Tokyo">日本(UTC+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">关系标签</label>
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
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
                <option value="__new__">+ 新建标签</option>
              </select>
              {showNewTagInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新标签"
                    className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleAddNewTag}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all"
                  >
                    添加
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? '计算中...' : '计算人类图'}
              </button>

              {chartData && (
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200"
                >
                  保存星图
                </button>
              )}
            </div>
          </div>
        )}

        {/* 已有本人资料的提示 */}
        {hasSelfChart && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-300 text-sm leading-relaxed">
                您已创建本人的人类图资料，可在右侧查看或继续为他人创建。
              </p>
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => router.push('/chat')}
            className="w-full text-left text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            与高我对话
          </button>
          <button
            onClick={() => router.push('/charts')}
            className="w-full text-left text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
          >
            我的星图
          </button>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col bg-black/20">
        {/* 计算结果 */}
        {chartData ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">{chartData.name} 的人类图</h2>

                {chartData.analysis && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-xs text-white/60 mb-1">类型</p>
                      <p className="text-lg font-semibold text-white">{chartData.analysis.type}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-xs text-white/60 mb-1">人生角色</p>
                      <p className="text-lg font-semibold text-white">{chartData.analysis.profile}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-xs text-white/60 mb-1">内在权威</p>
                      <p className="text-lg font-semibold text-white">{chartData.analysis.authority}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-xs text-white/60 mb-1">定义</p>
                      <p className="text-lg font-semibold text-white">{chartData.analysis.definition}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <p className="text-xs text-white/60 mb-3">出生信息</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/80">
                    <div className="flex items-center">
                      <span className="mr-2">📅</span> {chartData.birthDate}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🕐</span> {chartData.birthTime}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span> {chartData.location}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🌍</span> {chartData.timezone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">快速操作</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/chat')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    开始对话
                  </button>
                  <button
                    onClick={() => router.push('/charts')}
                    className="bg-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 border border-white/20 transition-all duration-200"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">开始计算人类图</h2>
              <p className="text-sm text-white/60 mb-6">
                在左侧输入出生信息，探索独特的生命密码
              </p>
              <div className="text-left bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-medium text-white mb-3">人类图包含的信息：</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    内在权威与决策策略
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    人生角色与生命主题
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    能量类型与互动方式
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    轮回交叉与人生使命
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 底部：已保存的星图列表 - 简化显示 */}
        {savedCharts.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">已保存的星图</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-40 overflow-y-auto">
                {savedCharts.slice(0, 12).map((chart, index) => (
                  <div
                    key={chart.id || index}
                    className="bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40"
                    onClick={() => setChartData(chart)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white truncate flex-1">{chart.name}</h4>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                        chart.relationship === '本人'
                          ? 'bg-blue-600 text-white'
                          : chart.relationship === '家人'
                            ? 'bg-green-600 text-white'
                            : chart.relationship === '朋友'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-600 text-white'
                      }`}>
                        {chart.relationship}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {chart.analysis?.type || '未计算'}
                    </div>
                    <div className="text-xs text-white/50 truncate mt-1">
                      {chart.birthDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}