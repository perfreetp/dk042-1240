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
} from 'lucide-react';
import type { AdminTab, Product, Ranking, TrialStatus } from '@/types';
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

export function AdminPage() {
  const {
    products,
    reviews,
    trials,
    rankings,
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
    addRanking,
    updateRanking,
    deleteRanking,
    reorderRankingProducts,
    detectDuplicates,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showRankingForm, setShowRankingForm] = useState(false);
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);
  const [deletingRankingId, setDeletingRankingId] = useState<string | null>(null);
  const [trialFilter, setTrialFilter] = useState<TrialStatus | 'all'>('all');
  const [adminNoteTrialId, setAdminNoteTrialId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');

  const tabs = [
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectForMerge = (productId: string) => {
    setSelectedForMerge(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleMerge = (targetId: string) => {
    const sources = selectedForMerge.filter(id => id !== targetId);
    if (sources.length > 0) {
      mergeProducts(sources, targetId);
      setSelectedForMerge([]);
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

  const filteredTrials = trialFilter === 'all'
    ? trials
    : trials.filter(t => t.status === trialFilter);

  const sortedTrials = [...filteredTrials].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

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
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      已选择 {selectedForMerge.length} 个产品
                    </span>
                    <button
                      onClick={() => handleMerge(selectedForMerge[0])}
                      disabled={selectedForMerge.length < 2}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      合并选中
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {duplicateGroups.map((group) => (
                    <div key={group.groupKey} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(group.groupKey)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">疑似重复组 - {group.reason}</span>
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                            {group.products.length} 款产品
                          </span>
                        </div>
                        {expandedSections[group.groupKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {expandedSections[group.groupKey] && (
                        <div className="p-3 space-y-2">
                          {group.products.map((product) => {
                            const isSelected = selectedForMerge.includes(product.id);

                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                                onClick={() => handleSelectForMerge(product.id)}
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-xl">{product.logo}</span>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-800">{product.name}</p>
                                  <p className="text-xs text-slate-400">{formatPrice(product.priceRange)} · {categoryLabels[product.category]}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMerge(product.id);
                                  }}
                                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                                >
                                  设为主版本
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

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
                              <h3 className="font-medium text-slate-800">{ranking.name}</h3>
                              <p className="text-xs text-slate-400">
                                {ranking.productIds.length} 款产品 · {rankingTypeLabels[ranking.type] || ranking.type}
                                {ranking.category && ranking.category !== 'all' && ` · ${categoryLabels[ranking.category as keyof typeof categoryLabels] || ranking.category}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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

                      return (
                        <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors">
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
                            <span className="text-xs text-slate-400">
                              {new Date(trial.createdAt).toLocaleDateString('zh-CN')}
                            </span>
                          </div>

                          <div className="ml-13 mt-2 space-y-1 text-xs text-slate-500">
                            <div className="flex gap-4">
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

                          <div className="ml-13 mt-3 flex items-center gap-2">
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
              addRanking(data as any);
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
