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
    <div className="min-h-screen main-content">
      {/* 导航栏 */}
      <nav className="bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">人类图 AI 陪伴</h1>
              <span className="text-gray-300 text-lg">星图计算器</span>
            </div>
            <div className="flex items-center space-x-6">
              {user && (
                <span className="text-gray-300 text-lg">{user.email}</span>
              )}
              <button
                onClick={() => router.push('/chat')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/charts')}
                className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all"
              >
                我的星图
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-white mb-4">人类图计算器</h2>
          <p className="text-xl text-gray-300">探索您的宇宙能量印记，解析独特的生命密码</p>
        </div>

        {/* 输入表单区域 - 只有当没有本人资料时才显示 */}
        {!hasSelfChart && (
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-white/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">出生信息</h3>
              <p className="text-lg text-gray-300">请填写准确的出生信息以计算您的人类图</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  出生日期
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  出生时间
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  出生地点
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="例如: 北京, 上海"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  时区
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  关系标签
                  {relationship === '本人' && (
                    <span className="text-base ml-3 text-yellow-400">
                      (每个用户只能有1个)
                    </span>
                  )}
                </label>
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
                  className="w-full px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                  <option value="__new__">+ 新建标签</option>
                </select>
                {showNewTagInput && (
                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="输入新标签名称"
                      className="flex-1 px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNewTag();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddNewTag}
                      className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-all"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => {
                        setShowNewTagInput(false);
                        setNewTag('');
                      }}
                      className="px-6 py-3 bg-gray-600 text-gray-300 text-lg font-medium rounded-xl hover:bg-gray-700 transition-all"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex gap-4 max-w-2xl mx-auto">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? '计算中...' : '计算人类图'}
              </button>

              {chartData && (
                <button
                  onClick={handleSave}
                  className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition-all"
                >
                  保存星图
                </button>
              )}
            </div>
          </div>
        )}

        {/* 已有本人资料的提示 */}
        {hasSelfChart && (
          <div className="bg-blue-900/30 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-6 mb-12">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-300 text-lg">您已经创建了本人的人类图资料，可以在下方查看或继续为其他人创建人类图。</p>
            </div>
          </div>
        )}

        {/* 计算结果 */}
        {chartData && (
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 mb-12 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">{chartData.name} 的人类图分析</h3>

            {chartData.analysis && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                  <p className="text-base text-gray-400 mb-2">类型</p>
                  <p className="text-xl font-bold text-white">{chartData.analysis.type}</p>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                  <p className="text-base text-gray-400 mb-2">人生角色</p>
                  <p className="text-xl font-bold text-white">{chartData.analysis.profile}</p>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                  <p className="text-base text-gray-400 mb-2">内在权威</p>
                  <p className="text-xl font-bold text-white">{chartData.analysis.authority}</p>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                  <p className="text-base text-gray-400 mb-2">定义</p>
                  <p className="text-xl font-bold text-white">{chartData.analysis.definition}</p>
                </div>
              </div>
            )}

            <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
              <p className="text-base text-gray-400 mb-4">出生信息</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-lg text-gray-300">
                <div>📅 {chartData.birthDate}</div>
                <div>🕐 {chartData.birthTime}</div>
                <div>📍 {chartData.location}</div>
                <div>🌍 {chartData.timezone}</div>
              </div>
            </div>
          </div>
        )}

        {/* 已保存的数据列表 */}
        {savedCharts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">已保存的星图</h3>
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-300">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'relationship' | 'type')}
                  className="px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date">保存时间</option>
                  <option value="name">姓名</option>
                  <option value="relationship">关系标签</option>
                  <option value="type">类型</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedCharts().map((chart, index) => (
                <div
                  key={chart.id || index}
                  className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 cursor-pointer hover:bg-black/40 transition-all border border-white/10 hover:border-white/30"
                  onClick={() => setChartData(chart)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-semibold text-white">{chart.name}</h4>
                    <span className={`px-3 py-2 rounded-lg text-base font-bold ${
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

                  <div className="grid grid-cols-2 gap-4 mb-4 text-base">
                    <div>
                      <span className="text-gray-400">类型:</span>
                      <span className="ml-2 text-white">{chart.analysis?.type || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">角色:</span>
                      <span className="ml-2 text-white">{chart.analysis?.profile || '-'}</span>
                    </div>
                  </div>

                  <div className="text-base text-gray-400 border-t border-white/10 pt-4">
                    <div className="mb-2">📅 {chart.birthDate} 🕐 {chart.birthTime}</div>
                    <div>📍 {chart.location}</div>
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