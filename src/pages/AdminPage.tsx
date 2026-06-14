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
  Clock,
  Bell,
  CalendarCheck,
  AlertTriangle,
  UserPlus,
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

const formatScheduleDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const toDatetimeLocalValue = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
    scheduleRankingPublish,
    checkScheduledRankings,
    detectDuplicates,
    getTodayFollowUps,
    getOverdueFollowUps,
    getRecent7DayStats,
    getRecent7DayTrend,
    getPublishedRankings,
    getProductById,
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
  const [trialQuickFilter, setTrialQuickFilter] = useState<'all' | 'today' | 'overdue' | 'pending'>('all');
  const [adminNoteTrialId, setAdminNoteTrialId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [expandedTrialIds, setExpandedTrialIds] = useState<Set<string>>(new Set());
  const [followUpFormTrialId, setFollowUpFormTrialId] = useState<string | null>(null);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpResult, setFollowUpResult] = useState<NonNullable<TrialFollowUp['result']>>('contacted');
  const [schedulingRankingId, setSchedulingRankingId] = useState<string | null>(null);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [rankingViewMode, setRankingViewMode] = useState<'list' | 'schedule'>('list');
  const [trialViewMode, setTrialViewMode] = useState<'workspace' | 'list'>('workspace');
  const [processingTrialId, setProcessingTrialId] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<TrialStatus>('pending');
  const [processOwner, setProcessOwner] = useState('');
  const [processNextContact, setProcessNextContact] = useState('');
  const [processNote, setProcessNote] = useState('');

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

  const stats7d = getRecent7DayStats();
  const trend7d = getRecent7DayTrend();
  const allTodayFollowUps = getTodayFollowUps();
  const allOverdueFollowUps = getOverdueFollowUps();
  const todayFollowUps = allTodayFollowUps.slice(0, 5);
  const overdueFollowUps = allOverdueFollowUps.slice(0, 5);
  const hotRankings = getPublishedRankings()
    .sort((a, b) => b.productIds.length - a.productIds.length)
    .slice(0, 5);

  const calcDaysOverdue = (dateStr: string | undefined): number => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  };

  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data, 1);
    return (
      <div className="flex items-end gap-0.5 h-8">
        {data.map((v, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-sm ${color}`}
            style={{ height: `${(v / max) * 100}%`, minHeight: '2px' }}
          />
        ))}
      </div>
    );
  };

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

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCheckScheduledRankings = () => {
    const publishedIds = checkScheduledRankings();
    if (publishedIds.length > 0) {
      showToastMessage(`已发布 ${publishedIds.length} 个榜单`);
    } else {
      showToastMessage('没有待发布的榜单');
    }
  };

  const handleSetSchedule = (rankingId: string) => {
    if (scheduleDateTime) {
      const isoString = new Date(scheduleDateTime).toISOString();
      scheduleRankingPublish(rankingId, isoString);
      setSchedulingRankingId(null);
      setScheduleDateTime('');
    }
  };

  const handleCancelSchedule = (rankingId: string) => {
    scheduleRankingPublish(rankingId, '');
  };

  const handleStartProcessTrial = (trialId: string) => {
    const trial = trials.find(t => t.id === trialId);
    if (trial) {
      setProcessingTrialId(trialId);
      setProcessStatus(trial.status);
      setProcessOwner(trial.owner || '');
      setProcessNextContact(trial.nextContactAt ? trial.nextContactAt.split('T')[0] : '');
      setProcessNote('');
    }
  };

  const handleSaveProcessTrial = (trialId: string) => {
    const trial = trials.find(t => t.id === trialId);
    if (trial) {
      if (trial.status !== processStatus) {
        updateTrialStatus(trialId, processStatus);
      }
      if (trial.owner !== processOwner) {
        assignTrialOwner(trialId, processOwner);
      }
      if ((trial.nextContactAt || '') !== processNextContact) {
        updateTrialNextContact(trialId, processNextContact || undefined);
      }
      if (processNote.trim()) {
        const operator = trial.owner || '运营';
        addTrialFollowUp(trialId, {
          content: processNote,
          operator,
        });
      }
    }
    setProcessingTrialId(null);
    setProcessNote('');
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

  const todayStr = new Date().toISOString().split('T')[0];

  const isToday = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] === todayStr;
  };

  const isOverdue = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] < todayStr;
  };

  const quickFilteredTrials = (() => {
    switch (trialQuickFilter) {
      case 'today':
        return trials.filter(t => isToday(t.nextContactAt));
      case 'overdue':
        return trials.filter(t => isOverdue(t.nextContactAt));
      case 'pending':
        return trials.filter(t => t.status === 'pending');
      default:
        return trials;
    }
  })();

  const filteredTrials = trialFilter === 'all'
    ? quickFilteredTrials
    : quickFilteredTrials.filter(t => t.status === trialFilter);

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
          {adminTab === 'dashboard' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">运营概览</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-blue-100 mb-1">近7日新增试用</p>
                        <p className="text-3xl font-bold">{stats7d.trials}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <FlaskConical size={20} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-100">趋势</span>
                      <Sparkline data={trend7d.map(t => t.trials)} color="bg-white/70" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 text-white shadow-lg shadow-red-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-red-100 mb-1">近7日新增收藏</p>
                        <p className="text-3xl font-bold">{stats7d.favorites}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Heart size={20} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-100">趋势</span>
                      <Sparkline data={trend7d.map(t => t.favorites)} color="bg-white/70" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-5 text-white shadow-lg shadow-orange-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-orange-100 mb-1">近7日新增评价</p>
                        <p className="text-3xl font-bold">{stats7d.reviews}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-orange-100">趋势</span>
                      <Sparkline data={trend7d.map(t => t.reviews)} color="bg-white/70" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">跟进提醒</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-blue-50/50">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-slate-800">今日待跟进</h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                        {allTodayFollowUps.length} 条
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {todayFollowUps.map((trial) => {
                        const product = getProductById(trial.productId);
                        return (
                          <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between gap-3">
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
                                  <p className="text-xs text-blue-500 mt-0.5">
                                    {trial.nextContactAt?.split('T')[1]?.substring(0, 5) || '全天'}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setAdminTab('trials');
                                  setTrialViewMode('workspace');
                                }}
                                className="flex-shrink-0 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                立即处理
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {todayFollowUps.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                          <CalendarCheck size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">今日暂无待跟进</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                      <button
                        onClick={() => {
                          setAdminTab('trials');
                          setTrialViewMode('workspace');
                        }}
                        className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        查看全部 →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-red-50/50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={18} />
                        <h3 className="font-semibold text-slate-800">已逾期待跟进</h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                        {allOverdueFollowUps.length} 条
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {overdueFollowUps.map((trial) => {
                        const product = getProductById(trial.productId);
                        const daysOverdue = calcDaysOverdue(trial.nextContactAt);
                        return (
                          <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between gap-3">
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
                              <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
                                逾期 {daysOverdue} 天
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {overdueFollowUps.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                          <AlertTriangle size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">暂无逾期跟进</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                      <button
                        onClick={() => {
                          setAdminTab('trials');
                          setTrialViewMode('workspace');
                        }}
                        className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        查看全部 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-800 mb-3">热门榜单</h2>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-purple-500" size={18} />
                      <h3 className="font-semibold text-slate-800">已发布榜单 TOP5</h3>
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
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-slate-800">榜单管理</h2>
                    <button
                      onClick={handleCheckScheduledRankings}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                      <Bell size={14} />
                      自动检查已到点榜单
                    </button>
                  </div>
                  <button
                    onClick={handleAddRanking}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    新建榜单
                  </button>
                </div>

                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                  <button
                    onClick={() => setRankingViewMode('list')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      rankingViewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    榜单管理
                  </button>
                  <button
                    onClick={() => setRankingViewMode('schedule')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      rankingViewMode === 'schedule'
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    发布计划
                  </button>
                </div>

                {rankingViewMode === 'list' && (
                  <>
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

                        {ranking.status === 'draft' && (
                          <div className="mb-3">
                            {ranking.scheduledPublishAt ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                                  <Clock size={12} className="text-amber-600" />
                                  <span className="text-xs text-amber-700 font-medium">
                                    定时发布：{formatScheduleDateTime(ranking.scheduledPublishAt)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleCancelSchedule(ranking.id)}
                                  className="px-2 py-1 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  取消定时
                                </button>
                              </div>
                            ) : schedulingRankingId === ranking.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="datetime-local"
                                  value={scheduleDateTime}
                                  onChange={(e) => setScheduleDateTime(e.target.value)}
                                  className="px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                />
                                <button
                                  onClick={() => handleSetSchedule(ranking.id)}
                                  disabled={!scheduleDateTime}
                                  className="px-2.5 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  确定
                                </button>
                                <button
                                  onClick={() => {
                                    setSchedulingRankingId(null);
                                    setScheduleDateTime('');
                                  }}
                                  className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                >
                                  取消
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSchedulingRankingId(ranking.id);
                                  setScheduleDateTime('');
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors border border-amber-200"
                              >
                                <Clock size={12} />
                                设置定时
                              </button>
                            )}
                          </div>
                        )}

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
                  </>
                )}

                {rankingViewMode === 'schedule' && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                        <div className="flex items-center justify-between p-3 bg-amber-100/50 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <Clock className="text-amber-600" size={18} />
                            <h3 className="font-semibold text-amber-800 text-sm">待发布</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-700 rounded-full font-medium">
                            {rankings.filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) > new Date()).length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {rankings
                            .filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) > new Date())
                            .sort((a, b) => (a.scheduledPublishAt || '').localeCompare(b.scheduledPublishAt || ''))
                            .map(ranking => (
                              <div key={ranking.id} className="bg-white rounded-lg p-3 border border-amber-100 shadow-sm">
                                <p className="font-medium text-slate-800 text-sm mb-1">{ranking.name}</p>
                                <div className="flex items-center gap-1 mb-2">
                                  <Clock size={12} className="text-amber-500" />
                                  <span className="text-xs text-amber-600">
                                    {formatScheduleDateTime(ranking.scheduledPublishAt!)}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => publishRanking(ranking.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                                  >
                                    立即发布
                                  </button>
                                  <button
                                    onClick={() => handleCancelSchedule(ranking.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                  >
                                    取消定时
                                  </button>
                                </div>
                              </div>
                            ))}
                          {rankings.filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) > new Date()).length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <Clock size={24} className="mx-auto mb-1 text-amber-300" />
                              <p className="text-xs">暂无待发布榜单</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/30">
                        <div className="flex items-center justify-between p-3 bg-red-100/50 border-b border-red-200">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={18} />
                            <h3 className="font-semibold text-red-800 text-sm">已过期未发布</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-red-200 text-red-700 rounded-full font-medium">
                            {rankings.filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) <= new Date()).length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {rankings
                            .filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) <= new Date())
                            .sort((a, b) => (a.scheduledPublishAt || '').localeCompare(b.scheduledPublishAt || ''))
                            .map(ranking => (
                              <div key={ranking.id} className="bg-white rounded-lg p-3 border border-red-100 shadow-sm">
                                <p className="font-medium text-slate-800 text-sm mb-1">{ranking.name}</p>
                                <div className="flex items-center gap-1 mb-2">
                                  <AlertTriangle size={12} className="text-red-500" />
                                  <span className="text-xs text-red-600">
                                    {formatScheduleDateTime(ranking.scheduledPublishAt!)}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => publishRanking(ranking.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                                  >
                                    立即发布
                                  </button>
                                  <button
                                    onClick={() => handleCancelSchedule(ranking.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                  >
                                    取消定时
                                  </button>
                                </div>
                              </div>
                            ))}
                          {rankings.filter(r => r.status === 'draft' && r.scheduledPublishAt && new Date(r.scheduledPublishAt) <= new Date()).length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <AlertTriangle size={24} className="mx-auto mb-1 text-red-300" />
                              <p className="text-xs">暂无过期未发布榜单</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50/30">
                        <div className="flex items-center justify-between p-3 bg-green-100/50 border-b border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-600" size={18} />
                            <h3 className="font-semibold text-green-800 text-sm">最近发布</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-green-200 text-green-700 rounded-full font-medium">
                            {getPublishedRankings().length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {getPublishedRankings()
                            .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
                            .slice(0, 10)
                            .map(ranking => (
                              <div key={ranking.id} className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
                                <p className="font-medium text-slate-800 text-sm mb-1">{ranking.name}</p>
                                <div className="flex items-center gap-1 mb-2">
                                  <CheckCircle2 size={12} className="text-green-500" />
                                  <span className="text-xs text-green-600">
                                    {ranking.publishedAt ? formatScheduleDateTime(ranking.publishedAt) : '-'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => unpublishRanking(ranking.id)}
                                  className="w-full px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors font-medium"
                                >
                                  撤回草稿
                                </button>
                              </div>
                            ))}
                          {getPublishedRankings().length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <CheckCircle2 size={24} className="mx-auto mb-1 text-green-300" />
                              <p className="text-xs">暂无已发布榜单</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                    {trialViewMode === 'list' && (
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
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                  <button
                    onClick={() => setTrialViewMode('workspace')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      trialViewMode === 'workspace'
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    工作台
                  </button>
                  <button
                    onClick={() => setTrialViewMode('list')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      trialViewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    全部列表
                  </button>
                </div>

                {trialViewMode === 'workspace' && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/30">
                        <div className="flex items-center justify-between p-3 bg-blue-100/50 border-b border-blue-200">
                          <div className="flex items-center gap-2">
                            <CalendarCheck className="text-blue-600" size={18} />
                            <h3 className="font-semibold text-blue-800 text-sm">今日待联系</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full font-medium">
                            {getTodayFollowUps().length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {getTodayFollowUps().map(trial => {
                            const product = getProductById(trial.productId);
                            const statusCfg = trialStatusConfig[trial.status];
                            const isProcessing = processingTrialId === trial.id;

                            return (
                              <div key={trial.id} className="bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
                                <div className="p-3">
                                  <div className="flex items-start gap-2 mb-2">
                                    {product && (
                                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                        {product.logo}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-slate-800 text-sm truncate">
                                        {product?.name || '未知产品'}
                                      </p>
                                      <p className="text-xs text-slate-500 truncate">
                                        {trial.contactName} · {trial.companyName}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusCfg.color}`}>
                                      {statusCfg.label}
                                    </span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {trial.owner || '未分配'}
                                    </span>
                                  </div>
                                  {trial.nextContactAt && (
                                    <div className="flex items-center gap-1 mb-2">
                                      <Clock size={12} className="text-blue-500" />
                                      <span className="text-xs text-blue-600">
                                        {trial.nextContactAt.split('T')[1]?.substring(0, 5) || '全天'}
                                      </span>
                                    </div>
                                  )}
                                  {!isProcessing && (
                                    <button
                                      onClick={() => handleStartProcessTrial(trial.id)}
                                      className="w-full px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                    >
                                      处理
                                    </button>
                                  )}
                                </div>
                                {isProcessing && (
                                  <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">状态</label>
                                      <select
                                        value={processStatus}
                                        onChange={(e) => setProcessStatus(e.target.value as TrialStatus)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      >
                                        {Object.entries(trialStatusConfig).map(([key, cfg]) => (
                                          <option key={key} value={key}>{cfg.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">负责人</label>
                                      <select
                                        value={processOwner}
                                        onChange={(e) => setProcessOwner(e.target.value)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      >
                                        <option value="">未分配</option>
                                        {ownerOptions.map(name => (
                                          <option key={name} value={name}>{name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">下次联系日期</label>
                                      <input
                                        type="date"
                                        value={processNextContact}
                                        onChange={(e) => setProcessNextContact(e.target.value)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">跟进备注</label>
                                      <textarea
                                        value={processNote}
                                        onChange={(e) => setProcessNote(e.target.value)}
                                        placeholder="输入跟进内容..."
                                        rows={2}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                                      />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                      <button
                                        onClick={() => setProcessingTrialId(null)}
                                        className="flex-1 px-2 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                      >
                                        取消
                                      </button>
                                      <button
                                        onClick={() => handleSaveProcessTrial(trial.id)}
                                        className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                      >
                                        保存
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {getTodayFollowUps().length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <CalendarCheck size={24} className="mx-auto mb-1 text-blue-300" />
                              <p className="text-xs">今日暂无待联系</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/30">
                        <div className="flex items-center justify-between p-3 bg-red-100/50 border-b border-red-200">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={18} />
                            <h3 className="font-semibold text-red-800 text-sm">已逾期</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-red-200 text-red-700 rounded-full font-medium">
                            {getOverdueFollowUps().length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {getOverdueFollowUps().map(trial => {
                            const product = getProductById(trial.productId);
                            const statusCfg = trialStatusConfig[trial.status];
                            const isProcessing = processingTrialId === trial.id;

                            return (
                              <div key={trial.id} className="bg-white rounded-lg border border-red-100 shadow-sm overflow-hidden">
                                <div className="p-3">
                                  <div className="flex items-start gap-2 mb-2">
                                    {product && (
                                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                        {product.logo}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-slate-800 text-sm truncate">
                                        {product?.name || '未知产品'}
                                      </p>
                                      <p className="text-xs text-slate-500 truncate">
                                        {trial.contactName} · {trial.companyName}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${statusCfg.color}`}>
                                      {statusCfg.label}
                                    </span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {trial.owner || '未分配'}
                                    </span>
                                  </div>
                                  {trial.nextContactAt && (
                                    <div className="flex items-center gap-1 mb-2">
                                      <AlertTriangle size={12} className="text-red-500" />
                                      <span className="text-xs text-red-600">
                                        逾期 {calcDaysOverdue(trial.nextContactAt)} 天
                                      </span>
                                    </div>
                                  )}
                                  {!isProcessing && (
                                    <button
                                      onClick={() => handleStartProcessTrial(trial.id)}
                                      className="w-full px-2 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                                    >
                                      处理
                                    </button>
                                  )}
                                </div>
                                {isProcessing && (
                                  <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">状态</label>
                                      <select
                                        value={processStatus}
                                        onChange={(e) => setProcessStatus(e.target.value as TrialStatus)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      >
                                        {Object.entries(trialStatusConfig).map(([key, cfg]) => (
                                          <option key={key} value={key}>{cfg.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">负责人</label>
                                      <select
                                        value={processOwner}
                                        onChange={(e) => setProcessOwner(e.target.value)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      >
                                        <option value="">未分配</option>
                                        {ownerOptions.map(name => (
                                          <option key={name} value={name}>{name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">下次联系日期</label>
                                      <input
                                        type="date"
                                        value={processNextContact}
                                        onChange={(e) => setProcessNextContact(e.target.value)}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">跟进备注</label>
                                      <textarea
                                        value={processNote}
                                        onChange={(e) => setProcessNote(e.target.value)}
                                        placeholder="输入跟进内容..."
                                        rows={2}
                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                                      />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                      <button
                                        onClick={() => setProcessingTrialId(null)}
                                        className="flex-1 px-2 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                      >
                                        取消
                                      </button>
                                      <button
                                        onClick={() => handleSaveProcessTrial(trial.id)}
                                        className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                      >
                                        保存
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {getOverdueFollowUps().length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <AlertTriangle size={24} className="mx-auto mb-1 text-red-300" />
                              <p className="text-xs">暂无逾期跟进</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50/30">
                        <div className="flex items-center justify-between p-3 bg-purple-100/50 border-b border-purple-200">
                          <div className="flex items-center gap-2">
                            <UserPlus className="text-purple-600" size={18} />
                            <h3 className="font-semibold text-purple-800 text-sm">未分配负责人</h3>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-700 rounded-full font-medium">
                            {trials.filter(t => !t.owner && t.status !== 'completed' && t.status !== 'rejected').length}
                          </span>
                        </div>
                        <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                          {trials
                            .filter(t => !t.owner && t.status !== 'completed' && t.status !== 'rejected')
                            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                            .map(trial => {
                              const product = getProductById(trial.productId);
                              const statusCfg = trialStatusConfig[trial.status];
                              const isProcessing = processingTrialId === trial.id;

                              return (
                                <div key={trial.id} className="bg-white rounded-lg border border-purple-100 shadow-sm overflow-hidden">
                                  <div className="p-3">
                                    <div className="flex items-start gap-2 mb-2">
                                      {product && (
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                                          {product.logo}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm truncate">
                                          {product?.name || '未知产品'}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                          {trial.contactName} · {trial.companyName}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${statusCfg.color}`}>
                                        {statusCfg.label}
                                      </span>
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
                                        未分配
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                      <Clock size={12} className="text-slate-400" />
                                      <span className="text-xs text-slate-500">
                                        {new Date(trial.createdAt).toLocaleDateString('zh-CN')}
                                      </span>
                                    </div>
                                    {!isProcessing && (
                                      <button
                                        onClick={() => handleStartProcessTrial(trial.id)}
                                        className="w-full px-2 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                                      >
                                        处理
                                      </button>
                                    )}
                                  </div>
                                  {isProcessing && (
                                    <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                                      <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">状态</label>
                                        <select
                                          value={processStatus}
                                          onChange={(e) => setProcessStatus(e.target.value as TrialStatus)}
                                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                        >
                                          {Object.entries(trialStatusConfig).map(([key, cfg]) => (
                                            <option key={key} value={key}>{cfg.label}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">负责人</label>
                                        <select
                                          value={processOwner}
                                          onChange={(e) => setProcessOwner(e.target.value)}
                                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                        >
                                          <option value="">未分配</option>
                                          {ownerOptions.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">下次联系日期</label>
                                        <input
                                          type="date"
                                          value={processNextContact}
                                          onChange={(e) => setProcessNextContact(e.target.value)}
                                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">跟进备注</label>
                                        <textarea
                                          value={processNote}
                                          onChange={(e) => setProcessNote(e.target.value)}
                                          placeholder="输入跟进内容..."
                                          rows={2}
                                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                                        />
                                      </div>
                                      <div className="flex gap-2 pt-1">
                                        <button
                                          onClick={() => setProcessingTrialId(null)}
                                          className="flex-1 px-2 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                                        >
                                          取消
                                        </button>
                                        <button
                                          onClick={() => handleSaveProcessTrial(trial.id)}
                                          className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                        >
                                          保存
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          {trials.filter(t => !t.owner && t.status !== 'completed' && t.status !== 'rejected').length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <UserPlus size={24} className="mx-auto mb-1 text-purple-300" />
                              <p className="text-xs">暂无未分配试用</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {trialViewMode === 'list' && (
                  <>
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-slate-500 mr-1">快速筛选：</span>
                        {[
                          { key: 'all', label: '全部' },
                          { key: 'today', label: '今日待联系' },
                          { key: 'overdue', label: '已逾期' },
                          { key: 'pending', label: '待处理' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() => setTrialQuickFilter(item.key as 'all' | 'today' | 'overdue' | 'pending')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                              trialQuickFilter === item.key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
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
                  </>
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

      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl shadow-lg">
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
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
    scheduledPublishAt: ranking?.scheduledPublishAt || '',
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
      scheduledPublishAt: formData.scheduledPublishAt || undefined,
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

          {formData.status === 'draft' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                定时发布 <span className="text-slate-400 font-normal">（可选）</span>
              </label>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <input
                  type="datetime-local"
                  value={formData.scheduledPublishAt ? toDatetimeLocalValue(formData.scheduledPublishAt) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      scheduledPublishAt: val ? new Date(val).toISOString() : '',
                    }));
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                {formData.scheduledPublishAt && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, scheduledPublishAt: '' }))}
                    className="px-2.5 py-2 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    清除
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">设置后，榜单将在指定时间自动发布</p>
            </div>
          )}

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