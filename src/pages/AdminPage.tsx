import { useState } from 'react';
import {
  Settings,
  Package,
  Trophy,
  MessageSquare,
  FlaskConical,
  Plus,
  Edit3,
  Trash2,
  Search,
  Check,
  X,
  Merge,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  GripVertical,
  Heart,
  BarChart3,
  Calendar,
  User,
  PlusCircle,
  History,
} from 'lucide-react';
import type { AdminTab, Product, Ranking, TrialStatus, TrialFollowUp } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { categoryLabels, formatPrice } from '@/utils/constants';

const rankingTypeLabels: Record<string, string> = {
  rating: '满意度榜',
  popular: '人气榜',
  new: '新锐榜',
  satisfaction: '综合榜',
};

const trialStatusConfig: Record<TrialStatus, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700' },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700' },
};

const followUpResultLabels: Record<NonNullable<TrialFollowUp['result']>, string> = {
  contacted: '已联系',
  scheduled: '已预约',
  converted: '已转化',
  lost: '已流失',
};

const followUpResultColors: Record<NonNullable<TrialFollowUp['result']>, string> = {
  contacted: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-slate-100 text-slate-600',
};

const ownerOptions = ['张小明', '李小红', '王大伟', '赵美丽'];

export function AdminPage() {
  const {
    products,
    reviews,
    trials,
    rankings,
    favorites,
    adminTab,
    setAdminTab,
    addProduct,
    updateProduct,
    deleteProduct,
    mergeProducts,
    approveReview,
    deleteReview,
    addTrial,
    updateTrialStatus,
    assignTrialOwner,
    addTrialFollowUp,
    updateTrialNextContact,
    addRanking,
    updateRanking,
    deleteRanking,
    publishRanking,
    unpublishRanking,
    reorderRankingProducts,
    detectDuplicates,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [selectedMergeGroupKey, setSelectedMergeGroupKey] = useState<string | null>(null);
  const [mergedGroupKeys, setMergedGroupKeys] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showRankingForm, setShowRankingForm] = useState(false);
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [deletingRankingId, setDeletingRankingId] = useState<string | null>(null);
  const [trialFilter, setTrialFilter] = useState<TrialStatus | 'all'>('all');
  const [adminNoteTrialId, setAdminNoteTrialId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [expandedTrialIds, setExpandedTrialIds] = useState<Set<string>>(new Set());
  const [followUpFormTrialId, setFollowUpFormTrialId] = useState<string | null>(null);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpResult, setFollowUpResult] = useState<NonNullable<TrialFollowUp['result']>>('contacted');

  const tabs = [
    { key: 'dashboard', label: '数据看板', icon: BarChart3 },
    { key: 'products', label: '产品管理', icon: Package },
    { key: 'duplicates', label: '重复合并', icon: Merge },
    { key: 'rankings', label: '榜单管理', icon: Trophy },
    { key: 'reviews', label: '评价审核', icon: MessageSquare },
    { key: 'trials', label: '试用管理', icon: FlaskConical },
  ] as const;

  const filteredProducts = products.filter(
    p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProducts = filteredProducts.filter(p => p.status === 'active');
  const pendingReviews = reviews.filter(r => !r.isApproved);

  const duplicateGroups = detectDuplicates();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentTrialsCount = trials.filter(t => t.createdAt >= sevenDaysAgo).length;
  const pendingReviewsCount = pendingReviews.length;
  const favoritesCount = favorites.length;
  const publishedRankingsCount = rankings.filter(r => r.status === 'published').length;

  const latestTrials = [...trials]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const hotRankings = rankings
    .filter(r => r.status === 'published')
    .sort((a, b) => b.productIds.length - a.productIds.length)
    .slice(0, 5);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleTrialExpand = (trialId: string) => {
    setExpandedTrialIds(prev => {
      const next = new Set(prev);
      if (next.has(trialId)) {
        next.delete(trialId);
      } else {
        next.add(trialId);
      }
      return next;
    });
  };

  const handleSelectForMerge = (productId: string, groupKey: string) => {
    if (selectedMergeGroupKey && selectedMergeGroupKey !== groupKey) {
      return;
    }
    const isSelected = selectedForMerge.includes(productId);
    if (isSelected) {
      const next = selectedForMerge.filter(id => id !== productId);
      setSelectedForMerge(next);
      if (next.length === 0) {
        setSelectedMergeGroupKey(null);
      }
    } else {
      setSelectedForMerge(prev => [...prev, productId]);
      if (!selectedMergeGroupKey) {
        setSelectedMergeGroupKey(groupKey);
      }
    }
  };

  const handleMerge = (targetId: string, groupKey: string) => {
    const sources = selectedForMerge.filter(id => id !== targetId);
    if (sources.length > 0) {
      mergeProducts(sources, targetId);
      setSelectedForMerge([]);
      setSelectedMergeGroupKey(null);
      setMergedGroupKeys(prev => new Set(prev).add(groupKey));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddRanking = () => {
    setEditingRanking(null);
    setShowRankingForm(true);
  };

  const handleEditRanking = (ranking: Ranking) => {
    setEditingRanking(ranking);
    setShowRankingForm(true);
  };

  const handleDeleteRanking = (rankingId: string) => {
    deleteRanking(rankingId);
    setDeletingRankingId(null);
  };

  const handleMoveRankingProduct = (ranking: Ranking, index: number, direction: 'up' | 'down') => {
    const newIds = [...ranking.productIds];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newIds.length) return;
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    reorderRankingProducts(ranking.id, newIds);
  };

  const handleUpdateTrialStatus = (trialId: string, status: TrialStatus) => {
    const note = adminNoteTrialId === trialId ? adminNoteText : undefined;
    updateTrialStatus(trialId, status, note);
    if (adminNoteTrialId === trialId) {
      setAdminNoteTrialId(null);
      setAdminNoteText('');
    }
  };

  const handleSaveAdminNote = (trialId: string) => {
    const trial = trials.find(t => t.id === trialId);
    if (trial) {
      updateTrialStatus(trialId, trial.status, adminNoteText);
    }
    setAdminNoteTrialId(null);
    setAdminNoteText('');
  };

  const handleAddFollowUp = (trialId: string) => {
    const trial = trials.find(t => t.id === trialId);
    const operator = trial?.owner || '运营';
    addTrialFollowUp(trialId, {
      content: followUpContent,
      operator,
      result: followUpResult,
    });
    setFollowUpContent('');
    setFollowUpResult('contacted');
    setFollowUpFormTrialId(null);
  };

  const filteredTrials = trialFilter === 'all'
    ? trials
    : trials.filter(t => t.status === trialFilter);

  const sortedTrials = [...filteredTrials].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  const metricCards = [
    {
      label: '近7日新增试用',
      value: recentTrialsCount,
      icon: FlaskConical,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      text: 'text-blue-600',
    },
    {
      label: '待审核评价',
      value: pendingReviewsCount,
      icon: MessageSquare,
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      text: 'text-orange-600',
    },
    {
      label: '收藏总数',
      value: favoritesCount,
      icon: Heart,
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      text: 'text-red-600',
    },
    {
      label: '已发布榜单',
      value: publishedRankingsCount,
      icon: Trophy,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      text: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">后台管理</h1>
          <p className="text-sm text-slate-500">运营人员管理中心</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200 p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAdminTab(tab.key as AdminTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  adminTab === tab.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {adminTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metricCards.map((card) => (
                  <div key={card.label} className={`${card.bg} rounded-xl p-5 border border-slate-100`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
                      </div>
                      <div className={`${card.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                        <card.icon size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="text-blue-500" size={18} />
                      <h2 className="font-semibold text-slate-800">最新试用申请</h2>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                      {latestTrials.length} 条
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {latestTrials.map((trial) => {
                      const product = products.find(p => p.id === trial.productId);
                      const statusCfg = trialStatusConfig[trial.status];
                      return (
                        <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              {product && (
                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                  {product.logo}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 text-sm truncate">
                                  {product?.name || '未知产品'}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                  {trial.contactName} · {trial.companyName}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                                {statusCfg.label}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(trial.createdAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {latestTrials.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <FlaskConical size={36} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">暂无试用申请</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-purple-500" size={18} />
                      <h2 className="font-semibold text-slate-800">热门榜单</h2>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                      {hotRankings.length} 个
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {hotRankings.map((ranking, idx) => (
                      <div key={ranking.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                            idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                            idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                            idx === 2 ? 'bg-gradient-to-br from-orange-300 to-amber-500' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">{ranking.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {rankingTypeLabels[ranking.type] || ranking.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <Package size={12} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{ranking.productIds.length}</span>
                        </div>
                      </div>
                    ))}
                    {hotRankings.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <Trophy size={36} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">暂无已发布榜单</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'products' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-slate-800">产品列表</h2>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    {activeProducts.length} 款产品
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索产品..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    添加产品
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">产品</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">分类</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">价格</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">评分</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">状态</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.logo}</span>
                            <div>
                              <p className="font-medium text-slate-800">{product.name}</p>
                              <p className="text-xs text-slate-400 truncate max-w-48">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-600">
                            {categoryLabels[product.category]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatPrice(product.priceRange)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {product.rating} ({product.reviewCount})
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : product.status === 'merged'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {product.status === 'active' ? '正常' : product.status === 'merged' ? '已合并' : '待审核'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'duplicates' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Merge className="text-orange-500" size={20} />
                    <h2 className="font-semibold text-slate-800">重复产品检测</h2>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                    {duplicateGroups.length} 组重复
                  </span>
                </div>

                {selectedForMerge.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between border border-blue-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-700">
                        已选择 {selectedForMerge.length} 个产品
                      </span>
                      {selectedMergeGroupKey && (
                        <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">
                          仅当前组内合并
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (selectedMergeGroupKey) handleMerge(selectedForMerge[0], selectedMergeGroupKey);
                      }}
                      disabled={selectedForMerge.length < 2}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      合并选中
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {duplicateGroups.map((group) => {
                    const isGroupMerged = mergedGroupKeys.has(group.groupKey);
                    const isGroupDisabled = selectedMergeGroupKey !== null && selectedMergeGroupKey !== group.groupKey;

                    return (
                      <div
                        key={group.groupKey}
                        className={`border rounded-lg overflow-hidden transition-opacity ${
                          isGroupDisabled ? 'opacity-50 border-slate-100' : 'border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleSection(group.groupKey)}
                          disabled={isGroupMerged}
                          className={`w-full flex items-center justify-between p-3 transition-colors ${
                            isGroupMerged ? 'bg-green-50 cursor-default' : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isGroupMerged ? (
                              <CheckCircle2 className="text-green-500" size={18} />
                            ) : (
                              <span className="text-sm text-slate-600">疑似重复组 - {group.reason}</span>
                            )}
                            {isGroupMerged ? (
                              <span className="text-sm font-medium text-green-700">已合并 ✓</span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                                {group.products.length} 款产品
                              </span>
                            )}
                          </div>
                          {!isGroupMerged && (
                            expandedSections[group.groupKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                          )}
                        </button>

                        {isGroupMerged && (
                          <div className="p-6 bg-green-50/50 text-center">
                            <CheckCircle2 size={40} className="mx-auto mb-2 text-green-400" />
                            <p className="text-sm text-green-700 font-medium">该组产品已完成合并</p>
                          </div>
                        )}

                        {expandedSections[group.groupKey] && !isGroupMerged && (
                          <div className="p-3 space-y-2 bg-white">
                            {group.products.map((product) => {
                              const isSelected = selectedForMerge.includes(product.id);

                              return (
                                <div
                                  key={product.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    isGroupDisabled
                                      ? 'cursor-not-allowed bg-slate-50 border-slate-100'
                                      : isSelected
                                      ? 'border-blue-400 bg-blue-50 cursor-pointer'
                                      : 'border-slate-200 hover:border-slate-300 cursor-pointer'
                                  }`}
                                  onClick={() => !isGroupDisabled && handleSelectForMerge(product.id, group.groupKey)}
                                >
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected ? 'border-blue-500 bg-blue-500' : isGroupDisabled ? 'border-slate-200 bg-slate-50' : 'border-slate-300'
                                  }`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                  <span className="text-xl">{product.logo}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium truncate ${isGroupDisabled ? 'text-slate-400' : 'text-slate-800'}`}>
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                      {formatPrice(product.priceRange)} · {categoryLabels[product.category]}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isGroupDisabled) handleMerge(product.id, group.groupKey);
                                    }}
                                    disabled={isGroupDisabled}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors flex-shrink-0 ${
                                      isGroupDisabled
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                    }`}
                                  >
                                    设为主版本
                                  </button>
                                </div>
                              );
                            })}
                            {isGroupDisabled && (
                              <p className="text-xs text-slate-400 text-center pt-2 pb-1">
                                请先取消其他组的选择，才能在本组操作
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {duplicateGroups.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle2 size={48} className="mx-auto mb-3 text-green-300" />
                      <p>暂无检测到重复产品</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'rankings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">榜单管理</h2>
                  <button
                    onClick={handleAddRanking}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    新建榜单
                  </button>
                </div>

                {rankings.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Trophy size={48} className="mx-auto mb-3 text-slate-300" />
                    <p>暂无榜单，点击上方按钮新建</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {rankings.map((ranking) => (
                      <div key={ranking.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white">
                              <Trophy size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-slate-800">{ranking.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  ranking.status === 'draft'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {ranking.status === 'draft' ? '草稿' : '已发布'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {ranking.productIds.length} 款产品 · {rankingTypeLabels[ranking.type] || ranking.type}
                                {ranking.category && ranking.category !== 'all' && ` · ${categoryLabels[ranking.category as keyof typeof categoryLabels] || ranking.category}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {ranking.status === 'draft' ? (
                              <button
                                onClick={() => publishRanking(ranking.id)}
                                className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                              >
                                发布
                              </button>
                            ) : (
                              <button
                                onClick={() => unpublishRanking(ranking.id)}
                                className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors font-medium"
                              >
                                取消发布
                              </button>
                            )}
                            <button
                              onClick={() => handleEditRanking(ranking)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeletingRankingId(ranking.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {ranking.productIds.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {ranking.productIds.map((pid, index) => {
                              const product = products.find(p => p.id === pid);
                              if (!product) return null;
                              return (
                                <div
                                  key={pid}
                                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm"
                                >
                                  <GripVertical size={14} className="text-slate-300" />
                                  <span className="text-xs font-medium text-slate-400 w-5">{index + 1}</span>
                                  <span>{product.logo}</span>
                                  <span className="text-slate-700 flex-1">{product.name}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleMoveRankingProduct(ranking, index, 'up')}
                                      disabled={index === 0}
                                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleMoveRankingProduct(ranking, index, 'down')}
                                      disabled={index === ranking.productIds.length - 1}
                                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {ranking.productIds.length === 0 && (
                          <p className="text-xs text-slate-400 mt-2">暂无上榜产品</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {adminTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-slate-800">评价审核</h2>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                    {pendingReviews.length} 条待审核
                  </span>
                </div>
              </div>

              {pendingReviews.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <MessageSquare size={48} className="mx-auto mb-3 text-slate-300" />
                  <p>暂无待审核的评价</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingReviews.map((review) => {
                    const product = products.find(p => p.id === review.productId);
                    return (
                      <div key={review.id} className="p-4 hover:bg-slate-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                              {review.avatar || '👤'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{review.userName}</p>
                              <p className="text-xs text-slate-400">
                                评价了 {product?.name || '未知产品'} · {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => approveReview(review.id)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="通过"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 pl-13">{review.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {adminTab === 'trials' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-slate-800">试用管理</h2>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                      {trials.length} 条申请
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={trialFilter}
                      onChange={(e) => setTrialFilter(e.target.value as TrialStatus | 'all')}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="all">全部状态</option>
                      {Object.entries(trialStatusConfig).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {sortedTrials.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <FlaskConical size={48} className="mx-auto mb-3 text-slate-300" />
                    <p>暂无试用申请</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {sortedTrials.map((trial) => {
                      const product = products.find(p => p.id === trial.productId);
                      const statusCfg = trialStatusConfig[trial.status];
                      const isExpanded = expandedTrialIds.has(trial.id);

                      return (
                        <div key={trial.id} className="hover:bg-slate-50 transition-colors">
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                {product && (
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                                    {product.logo}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-slate-800">
                                      {product?.name || '未知产品'}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                                      {statusCfg.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                    <span>{trial.contactName}</span>
                                    <span>·</span>
                                    <span>{trial.companyName}</span>
                                    <span>·</span>
                                    <span>{trial.teamSize}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">
                                  {new Date(trial.createdAt).toLocaleDateString('zh-CN')}
                                </span>
                                <button
                                  onClick={() => toggleTrialExpand(trial.id)}
                                  className={`p-1 rounded transition-colors ${
                                    isExpanded ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </div>
                            </div>

                            <div className="ml-13 mt-2 space-y-1 text-xs text-slate-500">
                              <div className="flex flex-wrap gap-4">
                                <span>电话：{trial.phone}</span>
                                <span>邮箱：{trial.email}</span>
                              </div>
                              {trial.note && (
                                <p>备注：{trial.note}</p>
                              )}
                              {trial.adminNote && (
                                <div className="p-2 bg-blue-50 rounded text-blue-700">
                                  <span className="font-medium">运营回复：</span>{trial.adminNote}
                                </div>
                              )}
                            </div>

                            <div className="ml-13 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400 flex-shrink-0" />
                                <select
                                  value={trial.owner || ''}
                                  onChange={(e) => assignTrialOwner(trial.id, e.target.value || '')}
                                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                >
                                  <option value="">选择负责人</option>
                                  {ownerOptions.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                                <input
                                  type="date"
                                  value={trial.nextContactAt || ''}
                                  onChange={(e) => updateTrialNextContact(trial.id, e.target.value || undefined)}
                                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            {adminNoteTrialId === trial.id && (
                              <div className="ml-13 mt-2 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={adminNoteText}
                                  onChange={(e) => setAdminNoteText(e.target.value)}
                                  placeholder="输入运营备注..."
                                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                />
                                <button
                                  onClick={() => handleSaveAdminNote(trial.id)}
                                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  保存
                                </button>
                                <button
                                  onClick={() => { setAdminNoteTrialId(null); setAdminNoteText(''); }}
                                  className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                  取消
                                </button>
                              </div>
                            )}

                            <div className="ml-13 mt-3 flex items-center gap-2 flex-wrap">
                              <select
                                value={trial.status}
                                onChange={(e) => handleUpdateTrialStatus(trial.id, e.target.value as TrialStatus)}
                                className="px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                              >
                                {Object.entries(trialStatusConfig).map(([key, cfg]) => (
                                  <option key={key} value={key}>{cfg.label}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => { setAdminNoteTrialId(trial.id); setAdminNoteText(trial.adminNote || ''); }}
                                className="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                              >
                                添加备注
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="ml-13 mr-4 mb-4 border-t border-slate-100 pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <History size={14} className="text-slate-500" />
                                  <h4 className="text-sm font-medium text-slate-700">跟进记录</h4>
                                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                                    {trial.followUps.length} 条
                                  </span>
                                </div>
                                {followUpFormTrialId !== trial.id && (
                                  <button
                                    onClick={() => {
                                      setFollowUpFormTrialId(trial.id);
                                      setFollowUpContent('');
                                      setFollowUpResult('contacted');
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    <PlusCircle size={12} />
                                    新增跟进
                                  </button>
                                )}
                              </div>

                              {followUpFormTrialId === trial.id && (
                                <div className="mb-4 p-3 bg-slate-50 rounded-lg space-y-3">
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">跟进内容</label>
                                    <textarea
                                      value={followUpContent}
                                      onChange={(e) => setFollowUpContent(e.target.value)}
                                      placeholder="请输入跟进内容..."
                                      rows={3}
                                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                                    />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <label className="block text-xs font-medium text-slate-600 mb-1">跟进结果</label>
                                      <select
                                        value={followUpResult}
                                        onChange={(e) => setFollowUpResult(e.target.value as NonNullable<TrialFollowUp['result']>)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      >
                                        {Object.entries(followUpResultLabels).map(([key, label]) => (
                                          <option key={key} value={key}>{label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      onClick={() => setFollowUpFormTrialId(null)}
                                      className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() => handleAddFollowUp(trial.id)}
                                      disabled={!followUpContent.trim()}
                                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      保存
                                    </button>
                                  </div>
                                </div>
                              )}

                              {trial.followUps.length > 0 ? (
                                <div className="relative pl-5 border-l-2 border-slate-100 space-y-4">
                                  {trial.followUps.map((fu) => (
                                    <div key={fu.id} className="relative">
                                      <div className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full bg-white border-2 border-blue-400" />
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-xs font-medium text-slate-700">{fu.operator}</span>
                                            <span className="text-xs text-slate-400">
                                              {new Date(fu.createdAt).toLocaleString('zh-CN')}
                                            </span>
                                            {fu.result && (
                                              <span className={`text-xs px-1.5 py-0.5 rounded ${followUpResultColors[fu.result]}`}>
                                                {followUpResultLabels[fu.result]}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-slate-600 whitespace-pre-wrap break-words">
                                            {fu.content}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : followUpFormTrialId !== trial.id ? (
                                <div className="text-center py-6 text-slate-400">
                                  <p className="text-xs">暂无跟进记录，点击右上角按钮新增</p>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowProductForm(false)}
          onSave={(productData) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, productData);
            } else {
              addProduct(productData as any);
            }
            setShowProductForm(false);
          }}
        />
      )}

      {showRankingForm && (
        <RankingFormModal
          ranking={editingRanking}
          onClose={() => setShowRankingForm(false)}
          onSave={(data) => {
            if (editingRanking) {
              updateRanking(editingRanking.id, data);
            } else {
              addRanking({ ...data, status: 'draft' } as any);
            }
            setShowRankingForm(false);
          }}
        />
      )}

      {deletingRankingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeletingRankingId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">确认删除</h3>
            <p className="text-sm text-slate-500 mb-6">删除后不可恢复，确定要删除该榜单吗？</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingRankingId(null)}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteRanking(deletingRankingId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    logo: product?.logo || '📦',
    category: product?.category || 'office',
    description: product?.description || '',
    priceMin: product?.priceRange.min || 0,
    priceMax: product?.priceRange.max || 100,
    priceUnit: product?.priceRange.unit || 'month',
    priceType: product?.priceRange.type || 'paid',
    rating: product?.rating || 4.0,
    reviewCount: product?.reviewCount || 0,
    minTeamSize: product?.minTeamSize || 1,
    maxTeamSize: product?.maxTeamSize || 100,
    officialUrl: product?.officialUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      priceRange: {
        min: formData.priceMin,
        max: formData.priceMax,
        unit: formData.priceUnit as any,
        type: formData.priceType as any,
      },
      features: product?.features || ['功能1', '功能2'],
      pros: product?.pros || ['优点1'],
      cons: product?.cons || ['缺点1'],
      useCases: product?.useCases || ['场景1'],
      deployment: product?.deployment || ['cloud'],
      industries: product?.industries || ['互联网'],
      similarProducts: product?.similarProducts || [],
      status: 'active',
    } as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {product ? '编辑产品' : '添加产品'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo (Emoji)</label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {Object.entries(categoryLabels).filter(([k]) => k !== 'all').map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">产品描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">最低价格</label>
              <input
                type="number"
                value={formData.priceMin}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">最高价格</label>
              <input
                type="number"
                value={formData.priceMax}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">官网链接</label>
            <input
              type="url"
              value={formData.officialUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, officialUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface RankingFormModalProps {
  ranking: Ranking | null;
  onClose: () => void;
  onSave: (data: Partial<Ranking>) => void;
}

function RankingFormModal({ ranking, onClose, onSave }: RankingFormModalProps) {
  const { products } = useAppStore();
  const activeProducts = products.filter(p => p.status === 'active');

  const [formData, setFormData] = useState({
    name: ranking?.name || '',
    category: ranking?.category || 'all',
    type: ranking?.type || 'rating' as const,
    productIds: ranking?.productIds || [] as string[],
    status: ranking?.status || 'draft',
  });

  const [productSearch, setProductSearch] = useState('');

  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const filteredActiveProducts = activeProducts.filter(
    p => p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      category: formData.category,
      type: formData.type,
      productIds: formData.productIds,
      status: formData.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {ranking ? '编辑榜单' : '新建榜单'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">榜单名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              required
              placeholder="例如：最佳办公软件排行榜"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="all">全部分类</option>
                {Object.entries(categoryLabels).filter(([k]) => k !== 'all').map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">榜单类型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Ranking['type'] }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {Object.entries(rankingTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              上榜产品 <span className="text-slate-400 font-normal">（已选 {formData.productIds.length} 个）</span>
            </label>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="搜索产品..."
              className="w-full px-3 py-2 mb-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
              {filteredActiveProducts.map((product) => {
                const isSelected = formData.productIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check size={10} className="text-white" />}
                    </div>
                    <span>{product.logo}</span>
                    <span className="text-slate-700">{product.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">{categoryLabels[product.category]}</span>
                  </button>
                );
              })}
              {filteredActiveProducts.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">无匹配产品</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}