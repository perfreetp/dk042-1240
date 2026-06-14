import { useState } from 'react';
import { FlaskConical, Clock, CheckCircle2, XCircle, Loader2, ChevronRight, User, Calendar, MessageSquare, Filter, ChevronDown, History, FileText, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, categoryLabels } from '@/utils/constants';
import type { TrialStatus, TrialFollowUp } from '@/types';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', icon: XCircle },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

const resultConfig: Record<string, { label: string; color: string }> = {
  contacted: { label: '已联系', color: 'bg-slate-100 text-slate-700' },
  scheduled: { label: '已排期', color: 'bg-indigo-100 text-indigo-700' },
  converted: { label: '已转化', color: 'bg-green-100 text-green-700' },
  lost: { label: '已流失', color: 'bg-red-100 text-red-700' },
};

const filterOptions: Array<{ value: TrialStatus | 'all'; label: string }> = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'completed', label: '已完成' },
];

export function TrialsPage() {
  const { trials, getProductById, setSelectedProduct, setShowProductDetail } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<TrialStatus | 'all'>('all');
  const [expandedTrialIds, setExpandedTrialIds] = useState<Set<string>>(new Set());

  const todayStr = new Date().toISOString().split('T')[0];

  const isToday = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] === todayStr;
  };

  const isOverdue = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    return dateStr.split('T')[0] < todayStr;
  };

  const filteredTrials = trials
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleViewProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
  };

  const toggleTrialExpand = (trialId: string) => {
    setExpandedTrialIds((prev) => {
      const next = new Set(prev);
      if (next.has(trialId)) {
        next.delete(trialId);
      } else {
        next.add(trialId);
      }
      return next;
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-4">
          <FlaskConical size={16} />
          <span>试用管理</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">我的试用记录</h1>
        <p className="text-slate-500">
          已提交 {trials.length} 份试用申请
        </p>
      </div>

      {trials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无试用记录</h3>
          <p className="text-slate-500 mb-6">浏览产品详情，即可发起试用申请</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <span className="text-sm text-slate-500">按状态筛选</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TrialStatus | 'all')}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-slate-500">
              共 {filteredTrials.length} 条
            </div>
          </div>

          {filteredTrials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">没有匹配的试用记录</h3>
              <p className="text-slate-500">尝试切换筛选条件查看其他试用申请</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrials.map((trial) => {
                const product = getProductById(trial.productId);
                const config = statusConfig[trial.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const latestFollowUp = trial.followUps?.[0];
                const resultBadge = latestFollowUp?.result ? resultConfig[latestFollowUp.result] : null;
                const isExpanded = expandedTrialIds.has(trial.id);

                return (
                  <div key={trial.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {product && (
                          <div
                            onClick={() => handleViewProduct(product.id)}
                            className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                          >
                            {product.logo}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {product && (
                                  <h3
                                    onClick={() => handleViewProduct(product.id)}
                                    className="font-semibold text-slate-800 text-lg hover:text-blue-600 cursor-pointer transition-colors"
                                  >
                                    {product.name}
                                  </h3>
                                )}
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                                  <StatusIcon size={12} />
                                  {config.label}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${trial.owner ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                                  <User size={12} />
                                  {trial.owner ? `负责人：${trial.owner}` : '未分配'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                <span>{trial.contactName}</span>
                                <span>·</span>
                                <span>{trial.companyName}</span>
                                <span>·</span>
                                <span>{trial.teamSize}</span>
                              </div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                              {new Date(trial.createdAt).toLocaleDateString('zh-CN')}
                            </div>
                          </div>

                          {trial.note && (
                            <p className="text-sm text-slate-600 mb-2">需求备注：{trial.note}</p>
                          )}

                          {trial.nextContactAt && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 ${
                              isOverdue(trial.nextContactAt)
                                ? 'bg-red-50 border border-red-100'
                                : isToday(trial.nextContactAt)
                                ? 'bg-blue-50 border border-blue-100'
                                : 'bg-slate-50 border border-slate-100'
                            }`}>
                              <Calendar size={16} className={`flex-shrink-0 ${
                                isOverdue(trial.nextContactAt)
                                  ? 'text-red-500'
                                  : isToday(trial.nextContactAt)
                                  ? 'text-blue-500'
                                  : 'text-slate-400'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-sm font-medium ${
                                    isOverdue(trial.nextContactAt)
                                      ? 'text-red-700'
                                      : isToday(trial.nextContactAt)
                                      ? 'text-blue-700'
                                      : 'text-slate-700'
                                  }`}>
                                    下次联系时间
                                  </span>
                                  {isToday(trial.nextContactAt) && (
                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                                      今天联系
                                    </span>
                                  )}
                                  {isOverdue(trial.nextContactAt) && (
                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded-full">
                                      已逾期
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${
                                  isOverdue(trial.nextContactAt)
                                    ? 'text-red-600'
                                    : isToday(trial.nextContactAt)
                                    ? 'text-blue-600'
                                    : 'text-slate-600'
                                }`}>
                                  {new Date(trial.nextContactAt).toLocaleDateString('zh-CN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          {trial.adminNote && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">运营回复：</span>{trial.adminNote}
                              </p>
                            </div>
                          )}

                          {latestFollowUp && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                                <MessageSquare size={12} />
                                <span className="font-medium">最近跟进</span>
                                {resultBadge && (
                                  <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${resultBadge.color}`}>
                                    {resultBadge.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-700 mb-1.5">{latestFollowUp.content}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <User size={11} />
                                  {latestFollowUp.operator}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar size={11} />
                                  {new Date(latestFollowUp.createdAt).toLocaleDateString('zh-CN')}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>电话：{trial.phone}</span>
                              <span>·</span>
                              <span>邮箱：{trial.email}</span>
                            </div>
                            <button
                              onClick={() => toggleTrialExpand(trial.id)}
                              className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              查看详情
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${trial.owner ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                            <User size={16} />
                            <span className="text-sm font-medium">
                              负责人：{trial.owner || '未分配'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <History size={16} className="text-slate-500" />
                          <h4 className="text-sm font-semibold text-slate-700">跟进时间线</h4>
                        </div>

                        <div className="relative pl-6 border-l-2 border-slate-200 space-y-5">
                          <div className="relative">
                            <div className="absolute -left-[26px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-green-400 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-medium text-slate-700">系统</span>
                                <span className="text-xs text-slate-400">
                                  {formatDateTime(trial.createdAt)}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                                  申请已提交
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">
                                您的试用申请已成功提交，运营团队将尽快处理。
                              </p>
                            </div>
                          </div>

                          {trial.followUps.map((fu: TrialFollowUp) => {
                            const fuResultBadge = fu.result ? resultConfig[fu.result] : null;
                            return (
                              <div key={fu.id} className="relative">
                                <div className="absolute -left-[26px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-medium text-slate-700">{fu.operator}</span>
                                    <span className="text-xs text-slate-400">
                                      {formatDateTime(fu.createdAt)}
                                    </span>
                                    {fuResultBadge && (
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${fuResultBadge.color}`}>
                                        {fuResultBadge.label}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 whitespace-pre-wrap break-words">
                                    {fu.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                          {trial.adminNote && (
                            <div className="relative">
                              <div className="absolute -left-[26px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-xs font-medium text-slate-700">运营备注</span>
                                  <span className="text-xs text-slate-400">
                                    {config.label}
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${config.color}`}>
                                    当前状态
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                  {trial.adminNote}
                                </p>
                              </div>
                            </div>
                          )}

                          {trial.nextContactAt && (
                            <div className="relative">
                              <div className="absolute -left-[26px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-xs font-medium text-slate-700">下次联系安排</span>
                                  <span className="text-xs text-slate-400">
                                    {new Date(trial.nextContactAt).toLocaleDateString('zh-CN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                  {isToday(trial.nextContactAt) && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                      今天联系
                                    </span>
                                  )}
                                  {isOverdue(trial.nextContactAt) && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                      已逾期
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 flex items-center gap-1">
                                  <Calendar size={11} className="text-slate-400" />
                                  运营团队将按计划与您联系
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
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
  );
}
