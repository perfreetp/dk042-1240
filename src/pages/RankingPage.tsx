import { useState } from 'react';
import { Trophy, TrendingUp, Sparkles, Star, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Rating } from '@/components/Rating';
import { categoryLabels, formatPrice } from '@/utils/constants';
import type { Ranking as RankingType } from '@/types';

export function RankingPage() {
  const { rankings, getProductById, setSelectedProduct, setShowProductDetail } = useAppStore();
  const [activeRanking, setActiveRanking] = useState<RankingType>(rankings[0]);

  const handleViewProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white';
    if (rank === 2) return 'bg-gradient-to-br from-slate-300 to-slate-400 text-white';
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white';
    return 'bg-slate-100 text-slate-600';
  };

  const rankingCategories = [
    { key: 'all', label: '全部榜单', icon: Trophy },
    { key: 'rating', label: '满意度榜', icon: Star },
    { key: 'popular', label: '人气榜', icon: TrendingUp },
    { key: 'new', label: '新锐榜', icon: Sparkles },
  ];

  const filteredRankings = rankings.filter(
    r => activeRanking.type === r.type || activeRanking.category === r.category
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
          <Trophy size={16} />
          <span>权威榜单</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          SaaS 工具
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            {' '}排行榜
          </span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          基于真实用户评价和使用数据，为你推荐各领域最优秀的 SaaS 产品
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {rankingCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              const ranking = rankings.find(r => 
                cat.key === 'all' ? true : r.type === cat.key
              );
              if (ranking) setActiveRanking(ranking);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              activeRanking.type === cat.key || (cat.key === 'all' && activeRanking.category === 'all')
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <cat.icon size={18} />
            <span className="text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 mb-3">全部榜单</h3>
          {rankings.map((ranking) => (
            <button
              key={ranking.id}
              onClick={() => setActiveRanking(ranking)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                activeRanking.id === ranking.id
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 shadow-md'
                  : 'bg-white border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeRanking.id === ranking.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className={`font-medium ${
                    activeRanking.id === ranking.id ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {ranking.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {ranking.productIds.length} 款产品
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <Trophy size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{activeRanking.name}</h2>
                  <p className="text-sm text-slate-500">
                    共 {activeRanking.productIds.length} 款产品上榜
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {activeRanking.productIds.map((productId, index) => {
                const product = getProductById(productId);
                if (!product) return null;
                const rank = index + 1;
                const trend = index < 3 ? 'up' : index < 6 ? 'same' : 'down';

                return (
                  <div
                    key={productId}
                    onClick={() => handleViewProduct(product.id)}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getRankBadgeStyle(rank)}`}>
                      {rank}
                    </div>

                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {product.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                          {categoryLabels[product.category]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {product.description}
                      </p>
                    </div>

                    <div className="hidden sm:block text-center">
                      <div className="flex items-center gap-1">
                        <Rating value={product.rating} size={14} />
                        <span className="font-semibold text-slate-700">{product.rating}</span>
                      </div>
                      <p className="text-xs text-slate-400">{product.reviewCount} 评价</p>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="font-bold text-blue-600">{formatPrice(product.priceRange)}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                      {trend === 'up' && (
                        <span className="flex items-center gap-0.5 text-green-500 text-xs">
                          <ArrowUp size={12} />
                          上升
                        </span>
                      )}
                      {trend === 'down' && (
                        <span className="flex items-center gap-0.5 text-red-400 text-xs">
                          <ArrowDown size={12} />
                          下降
                        </span>
                      )}
                      {trend === 'same' && (
                        <span className="flex items-center gap-0.5 text-slate-400 text-xs">
                          <Minus size={12} />
                          持平
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-amber-500" size={20} />
                <span className="font-semibold text-amber-800">评选标准</span>
              </div>
              <p className="text-sm text-amber-700">
                综合用户评分、使用量、增长速度等多维度数据，每月更新排名
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="font-semibold text-green-800">数据来源</span>
              </div>
              <p className="text-sm text-green-700">
                基于平台真实用户评价和使用数据，确保榜单客观公正
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-blue-500" size={20} />
                <span className="font-semibold text-blue-800">编辑推荐</span>
              </div>
              <p className="text-sm text-blue-700">
                专业编辑团队深度评测，精选各品类优质产品
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
