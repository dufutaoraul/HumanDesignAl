/**
 * 人类图计算器 - 宇宙星云主题
 * 探索宇宙能量，解析生命密码
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

  // 认证加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gradient mb-2">连接宇宙中...</h3>
          <p className="text-secondary">正在准备您的星图计算器</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main-content">
      {/* 导航栏 */}
      <nav className="cosmos-glass sticky top-0 z-50 border-b border-glass">
        <div className="cosmos-container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gradient">
                人类图 AI 陪伴
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stardust-gold animate-pulse"></div>
                <span className="text-secondary">星图计算器</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {user && (
                <div className="hidden sm:block">
                  <span className="text-sm text-secondary">
                    {user.email}
                  </span>
                </div>
              )}
              <button
                onClick={() => router.push('/chat')}
                className="text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/charts')}
                className="cosmos-glass px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                我的星图
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="cosmos-container py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-700/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
            人类图计算器
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            探索您的宇宙能量印记，解析独特的生命密码
          </p>
        </div>

        {/* 输入表单区域 */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gray-700/20 rounded-2xl blur-sm"></div>
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/30 p-8 animate-fadeInUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">出生信息</h3>
                  <p className="text-gray-400 text-sm">请填写准确的出生信息以计算您的人类图</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="请输入姓名"
                  />
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    出生时间
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    出生地点
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="例如: 北京, 上海"
                  />
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    时区
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="Asia/Shanghai">中国(北京时间 UTC+8)</option>
                    <option value="America/New_York">美国东部(UTC-5/-4)</option>
                    <option value="America/Los_Angeles">美国西部(UTC-8/-7)</option>
                    <option value="Europe/London">英国(UTC+0/+1)</option>
                    <option value="Europe/Paris">欧洲中部(UTC+1/+2)</option>
                    <option value="Asia/Tokyo">日本(UTC+9)</option>
                  </select>
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    关系标签
                    {relationship === '本人' && (
                      <span className="text-xs ml-2 text-amber-400">
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
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                    <option value="__new__">+ 新建标签</option>
                  </select>
                  {showNewTagInput && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="输入新标签名称"
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNewTag();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddNewTag}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setShowNewTagInput(false);
                          setNewTag('');
                        }}
                        className="px-4 py-2 bg-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                <button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      计算中...
                    </span>
                  ) : (
                    '计算人类图'
                  )}
                </button>

                {chartData && (
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                  >
                    保存星图
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-5">
              <h4 className="font-medium text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                计算提示
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  <span>请确保出生时间准确到分钟</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  <span>选择正确的时区对计算结果至关重要</span>
                </li>
                {!hasSelfChart && (
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>&quot;本人&quot;标签每个用户只能使用一次</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 p-5">
              <h4 className="font-medium text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                关于人类图
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                人类图是一套区分的科学体系，通过出生时间计算出的独特密码图谱，
                帮助您了解自己的天赋特质、人生策略和内在权威。
              </p>
            </div>
          </div>
        </div>

        {/* 计算结果 */}
        {chartData && (
          <div className="max-w-6xl mx-auto mt-16 space-y-8 animate-fadeInUp">
            {/* 基本信息卡片 */}
            {chartData.analysis && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-stardust-gold via-orange-500 to-red-500 rounded-3xl blur opacity-25"></div>
                <div className="relative bg-gradient-to-br from-stardust-gold/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-stardust-gold/30 p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-stardust-gold to-orange-500 rounded-full blur opacity-50"></div>
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-stardust-gold to-orange-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-stardust-gold to-orange-500 bg-clip-text text-transparent">
                        {chartData.name} 的生命密码
                      </h3>
                      <p className="text-secondary/70 mt-1">您的人类图核心信息</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-violet-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl border border-violet-500/20 p-6 hover:border-violet-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-violet-300 mb-2">类型</p>
                        <p className="text-xl font-bold text-white">
                          {chartData.analysis.type}
                        </p>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-blue-300 mb-2">人生角色</p>
                        <p className="text-xl font-bold text-white">
                          {chartData.analysis.profile}
                        </p>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-cyan-300 mb-2">内在权威</p>
                        <p className="text-xl font-bold text-white">
                          {chartData.analysis.authority}
                        </p>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-teal-900/30 to-green-900/30 backdrop-blur-sm rounded-2xl border border-teal-500/20 p-6 hover:border-teal-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-teal-300 mb-2">定义</p>
                        <p className="text-xl font-bold text-white">
                          {chartData.analysis.definition}
                        </p>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-lime-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-green-900/30 to-lime-900/30 backdrop-blur-sm rounded-2xl border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-green-300 mb-2">轮回交叉</p>
                        <p className="text-xl font-bold text-white">
                          {chartData.analysis.incarnationCross?.full || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="group relative lg:col-span-3">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
                        <p className="text-sm font-semibold text-purple-300 mb-2">激活通道</p>
                        <div className="flex flex-wrap gap-2">
                          {chartData.analysis.channels.length > 0
                            ? chartData.analysis.channels.map((channel, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm">
                                  {channel}
                                </span>
                              ))
                            : <span className="text-secondary/60">无激活通道</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-violet-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl border border-violet-500/20">
                    <p className="text-sm font-semibold text-violet-300 mb-3">出生信息</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-violet-400">📅</span>
                        <span className="text-white">{chartData.birthDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">🕐</span>
                        <span className="text-white">{chartData.birthTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">📍</span>
                        <span className="text-white">{chartData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-teal-400">🌍</span>
                        <span className="text-white">{chartData.timezone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 行星数据表格 */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-50"></div>
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      星盘数据
                    </h3>
                    <p className="text-secondary/70 mt-1">详细的行星位置和闸门信息</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-violet-500/10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-violet-500/20">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-red-400">设计端</th>
                          <th className="px-8 py-4 text-center text-sm font-semibold text-violet-300">行星</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-blue-400">个性端</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planets.map((planet, index) => {
                          const persData = chartData.planets.personality[planet.en] || {};
                          const desData = chartData.planets.design[planet.en] || {};

                          return (
                            <tr
                              key={planet.en}
                              className="border-b border-violet-500/10 hover:bg-violet-500/5 transition-all duration-300"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              {/* 设计端（红色） */}
                              <td className="px-6 py-6 text-left">
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-2xl text-red-400" style={{
                                    textShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)'
                                  }}>
                                    {desData.gate ? `${desData.gate}.${desData.line}` : '-'}
                                  </span>
                                  {desData.arrow && (
                                    <span className="text-2xl text-red-300">{desData.arrow}</span>
                                  )}
                                </div>
                              </td>

                              {/* 中间：行星符号 */}
                              <td className="px-8 py-6 text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-4xl font-bold" style={{
                                    filter: 'drop-shadow(0 0 15px currentColor)',
                                    color: planet.en === 'Sun' ? '#fbbf24' :
                                           planet.en === 'Moon' ? '#e5e7eb' :
                                           planet.en.includes('Node') ? '#a78bfa' : '#94a3b8'
                                  }}>
                                    {planet.symbol}
                                  </span>
                                  <span className="text-sm font-medium text-violet-300">{planet.cn}</span>
                                </div>
                              </td>

                              {/* 个性端（蓝色） */}
                              <td className="px-6 py-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {persData.arrow && (
                                    <span className="text-2xl text-blue-300">{persData.arrow}</span>
                                  )}
                                  <span className="font-black text-2xl text-blue-400" style={{
                                    textShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
                                  }}>
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
            </div>
          </div>
        )}

        {/* 已保存的数据列表 */}
        {savedCharts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/30 p-6 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      已保存的星图
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">点击查看详细的人类图信息</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">排序：</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'relationship' | 'type')}
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="date">保存时间</option>
                    <option value="name">姓名</option>
                    <option value="relationship">关系标签</option>
                    <option value="type">类型</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedCharts().map((chart, index) => (
                <div
                  key={chart.id || index}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => setChartData(chart)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute -inset-1 bg-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/30 p-5 hover:border-blue-500/40 transition-all duration-300">
                    {/* 标题行 */}
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-white">{chart.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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

                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                        <p className="text-xs font-medium text-gray-400 mb-1">类型</p>
                        <p className="text-sm font-semibold text-white">
                          {chart.analysis?.type || '-'}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                        <p className="text-xs font-medium text-gray-400 mb-1">人生角色</p>
                        <p className="text-sm font-semibold text-white">
                          {chart.analysis?.profile || '-'}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                        <p className="text-xs font-medium text-gray-400 mb-1">权威</p>
                        <p className="text-sm font-semibold text-white">
                          {chart.analysis?.authority || '-'}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                        <p className="text-xs font-medium text-gray-400 mb-1">定义</p>
                        <p className="text-sm font-semibold text-white">
                          {chart.analysis?.definition || '-'}
                        </p>
                      </div>
                    </div>

                    {/* 通道信息 */}
                    {chart.analysis?.channels && chart.analysis.channels.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-400 mb-2">激活通道</p>
                        <div className="flex flex-wrap gap-1">
                          {chart.analysis.channels.slice(0, 3).map((channel, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 text-xs">
                              {channel}
                            </span>
                          ))}
                          {chart.analysis.channels.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/20 border border-gray-500/30 rounded text-gray-300 text-xs">
                              +{chart.analysis.channels.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 出生信息 */}
                    <div className="pt-3 border-t border-gray-700/30">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{chart.birthDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{chart.birthTime}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <span>📍</span>
                        <span>{chart.location}</span>
                      </div>
                    </div>
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