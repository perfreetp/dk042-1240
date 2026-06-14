import { useState } from 'react';
import { X, Heart, GitCompare, ExternalLink, Star, ThumbsUp, ThumbsDown, ChevronRight, Send, FlaskConical, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Rating } from './Rating';
import { formatPrice, categoryLabels, deploymentLabels, getCategoryColor } from '@/utils/constants';

export function ProductDetailModal() {
  const { showProductDetail, setShowProductDetail, selectedProductId, getProductById, getReviewsByProductId, isFavorite, toggleFavorite, addToCompare, compareProductIds, addReview, addTrial, getTrialsByProductId } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'similar' | 'trial'>('overview');
  const [newReview, setNewReview] = useState({ rating: 5, content: '', userName: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [trialForm, setTrialForm] = useState({ contactName: '', companyName: '', teamSize: '10-50人', phone: '', email: '', note: '' });
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  const product = selectedProductId ? getProductById(selectedProductId) : null;
  const reviews = selectedProductId ? getReviewsByProductId(selectedProductId) : [];
  const productTrials = selectedProductId ? getTrialsByProductId(selectedProductId) : [];

  if (!product || !showProductDetail) return null;

  const favorited = isFavorite(product.id);
  const inCompare = compareProductIds.includes(product.id);

  const handleClose = () => {
    setShowProductDetail(false);
    setActiveTab('overview');
    setShowReviewForm(false);
    setTrialSubmitted(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.content.trim() && newReview.userName.trim()) {
      addReview({ productId: product.id, userName: newReview.userName, rating: newReview.rating, content: newReview.content });
      setNewReview({ rating: 5, content: '', userName: '' });
      setShowReviewForm(false);
    }
  };

  const handleSubmitTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (trialForm.contactName.trim() && trialForm.companyName.trim() && trialForm.phone.trim()) {
      addTrial({ productId: product.id, ...trialForm });
      setTrialForm({ contactName: '', companyName: '', teamSize: '10-50人', phone: '', email: '', note: '' });
      setTrialSubmitted(true);
    }
  };

  const similarProducts = product.similarProducts.map(id => getProductById(id)).filter(Boolean).slice(0, 4);

  const tabs = [
    { key: 'overview', label: '产品概览' },
    { key: 'features', label: '功能与场景' },
    { key: 'reviews', label: `用户评价 (${reviews.length})` },
    { key: 'trial', label: '申请试用' },
    { key: 'similar', label: '相似推荐' }
  ];

  const statusLabels: Record<string, string> = {
    pending: '待处理', processing: '处理中', approved: '已通过', rejected: '已拒绝', completed: '已完成'
  };
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-modal-in">
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><X size={20} /></button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">{product.logo}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(product.category)} bg-opacity-20`}>{categoryLabels[product.category]}</span>
              </div>
              <div className="flex items-center gap-4">
                <Rating value={product.rating} size={16} showValue />
                <span className="text-sm text-slate-300">{product.reviewCount} 条评价</span>
                <span className="text-lg font-semibold text-cyan-400">{formatPrice(product.priceRange)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleFavorite(product.id)} className={`p-3 rounded-xl transition-all ${favorited ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`}><Heart size={20} fill={favorited ? 'currentColor' : 'none'} /></button>
              <button onClick={() => !inCompare && addToCompare(product.id)} disabled={inCompare || compareProductIds.length >= 4} className={`p-3 rounded-xl transition-all ${inCompare ? 'bg-blue-500/30 text-blue-300' : compareProductIds.length >= 4 ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`}><GitCompare size={20} /></button>
              <a href={product.officialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"><span>官网</span><ExternalLink size={16} /></a>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 px-6">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div><h3 className="text-lg font-semibold text-slate-800 mb-3">产品简介</h3><p className="text-slate-600 leading-relaxed">{product.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4"><h4 className="text-sm font-medium text-slate-500 mb-2">价格区间</h4><p className="text-lg font-bold text-slate-800">{formatPrice(product.priceRange)}</p></div>
                <div className="bg-slate-50 rounded-xl p-4"><h4 className="text-sm font-medium text-slate-500 mb-2">部署方式</h4><p className="text-lg font-bold text-slate-800">{product.deployment.map(d => deploymentLabels[d]).join('、')}</p></div>
                <div className="bg-slate-50 rounded-xl p-4"><h4 className="text-sm font-medium text-slate-500 mb-2">适用团队规模</h4><p className="text-lg font-bold text-slate-800">{product.minTeamSize} - {product.maxTeamSize > 1000 ? '1000+' : product.maxTeamSize} 人</p></div>
                <div className="bg-slate-50 rounded-xl p-4"><h4 className="text-sm font-medium text-slate-500 mb-2">综合评分</h4><div className="flex items-center gap-2"><Rating value={product.rating} size={16} /><span className="text-lg font-bold text-slate-800">{product.rating}</span></div></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4"><div className="flex items-center gap-2 mb-3"><ThumbsUp className="text-green-600" size={18} /><h4 className="font-semibold text-green-800">产品优势</h4></div><ul className="space-y-2">{product.pros.map((pro, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-green-700"><span className="text-green-500 mt-0.5">✓</span><span>{pro}</span></li>))}</ul></div>
                <div className="bg-red-50 rounded-xl p-4"><div className="flex items-center gap-2 mb-3"><ThumbsDown className="text-red-600" size={18} /><h4 className="font-semibold text-red-800">待改进</h4></div><ul className="space-y-2">{product.cons.map((con, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-red-700"><span className="text-red-400 mt-0.5">!</span><span>{con}</span></li>))}</ul></div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div><h3 className="text-lg font-semibold text-slate-800 mb-4">核心功能</h3><div className="grid grid-cols-2 gap-3">{product.features.map((feature, idx) => (<div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"><span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span><span className="text-sm text-slate-700">{feature}</span></div>))}</div></div>
              <div><h3 className="text-lg font-semibold text-slate-800 mb-4">适用场景</h3><div className="flex flex-wrap gap-2">{product.useCases.map((useCase, idx) => (<span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-medium">{useCase}</span>))}</div></div>
              <div><h3 className="text-lg font-semibold text-slate-800 mb-4">适用行业</h3><div className="flex flex-wrap gap-2">{product.industries.map((industry, idx) => (<span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm">{industry}</span>))}</div></div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-800">用户评价</h3><button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">写评价</button></div>
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 rounded-xl p-4 space-y-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">您的昵称</label><input type="text" value={newReview.userName} onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" placeholder="请输入昵称" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">评分</label><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setNewReview(prev => ({ ...prev, rating: star }))} className="p-1"><Star size={24} className={star <= newReview.rating ? 'text-amber-400' : 'text-slate-300'} fill={star <= newReview.rating ? 'currentColor' : 'none'} strokeWidth={0} /></button>))}</div></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">评价内容</label><textarea value={newReview.content} onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none" rows={3} placeholder="分享您的使用体验..." /></div>
                  <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition-colors">取消</button><button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"><Send size={14} />提交</button></div>
                </form>
              )}
              <div className="space-y-4">
                {reviews.length === 0 ? (<div className="text-center py-12 text-slate-500"><p>暂无评价，来发表第一条评价吧</p></div>) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">{review.avatar || '👤'}</div><div className="flex-1"><div className="flex items-center gap-2"><span className="font-medium text-slate-800">{review.userName}</span>{review.companySize && <span className="text-xs text-slate-400">· {review.companySize}</span>}</div><div className="flex items-center gap-2"><Rating value={review.rating} size={12} /><span className="text-xs text-slate-400">{review.date}</span></div></div></div>
                      <p className="text-sm text-slate-600 ml-13">{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'trial' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="text-purple-500" size={20} />
                <h3 className="text-lg font-semibold text-slate-800">申请试用</h3>
              </div>

              {trialSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4"><CheckCircle2 size={32} /></div>
                  <h4 className="text-xl font-semibold text-slate-800 mb-2">试用申请已提交！</h4>
                  <p className="text-slate-500 mb-6">我们会在 1-2 个工作日内处理您的申请，请关注试用记录查看进度。</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => setTrialSubmitted(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">再次申请</button>
                    <button onClick={handleClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">关闭</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-600">填写以下信息，提交后运营人员会尽快联系您安排试用。</p>
                  <form onSubmit={handleSubmitTrial} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">联系人 <span className="text-red-500">*</span></label><input type="text" value={trialForm.contactName} onChange={(e) => setTrialForm(p => ({ ...p, contactName: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500" placeholder="您的姓名" required /></div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">公司名称 <span className="text-red-500">*</span></label><input type="text" value={trialForm.companyName} onChange={(e) => setTrialForm(p => ({ ...p, companyName: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500" placeholder="公司全称" required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">联系电话 <span className="text-red-500">*</span></label><input type="tel" value={trialForm.phone} onChange={(e) => setTrialForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500" placeholder="手机号码" required /></div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label><input type="email" value={trialForm.email} onChange={(e) => setTrialForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500" placeholder="工作邮箱" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">团队规模</label><select value={trialForm.teamSize} onChange={(e) => setTrialForm(p => ({ ...p, teamSize: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"><option>1-10人</option><option>10-50人</option><option>50-100人</option><option>100-500人</option><option>500人以上</option></select></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">需求备注</label><textarea value={trialForm.note} onChange={(e) => setTrialForm(p => ({ ...p, note: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none" rows={3} placeholder="请描述您的核心需求..." /></div>
                    <div className="flex justify-end"><button type="submit" className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/25"><Send size={16} />提交试用申请</button></div>
                  </form>

                  {productTrials.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-medium text-slate-700 mb-3">历史试用记录</h4>
                      <div className="space-y-2">
                        {productTrials.map(t => (
                          <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2"><span className="text-sm text-slate-700">{t.contactName} · {t.companyName}</span></div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[t.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabels[t.status] || t.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">相似产品推荐</h3>
              <div className="grid grid-cols-2 gap-4">
                {similarProducts.map((sp) => (sp && (
                  <div key={sp.id} onClick={() => { setShowProductDetail(false); setTimeout(() => { const { setSelectedProduct, setShowProductDetail } = useAppStore.getState(); setSelectedProduct(sp.id); setShowProductDetail(true); }, 100); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">{sp.logo}</div>
                    <div className="flex-1"><h4 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{sp.name}</h4><div className="flex items-center gap-2"><Rating value={sp.rating} size={12} showValue /></div></div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                )))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
