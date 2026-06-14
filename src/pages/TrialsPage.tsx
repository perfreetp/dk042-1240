import { FlaskConical, Clock, CheckCircle2, XCircle, Loader2, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, categoryLabels } from '@/utils/constants';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', icon: XCircle },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

export function TrialsPage() {
  const { trials, getProductById, setSelectedProduct, setShowProductDetail } = useAppStore();

  const sortedTrials = [...trials].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleViewProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
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
        <div className="space-y-4">
          {sortedTrials.map((trial) => {
            const product = getProductById(trial.productId);
            const config = statusConfig[trial.status] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <div key={trial.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
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
                        <div className="flex items-center gap-2">
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

                    {trial.adminNote && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">运营回复：</span>{trial.adminNote}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>电话：{trial.phone}</span>
                        <span>·</span>
                        <span>邮箱：{trial.email}</span>
                      </div>
                      {product && (
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                        >
                          查看产品
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
