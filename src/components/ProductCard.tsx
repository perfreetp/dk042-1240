import { Heart, GitCompare, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Rating } from './Rating';
import { formatPrice, getCategoryColor, categoryLabels } from '@/utils/constants';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export function ProductCard({ product, rank }: ProductCardProps) {
  const { isFavorite, toggleFavorite, addToCompare, compareProductIds, setSelectedProduct, setShowProductDetail } = useAppStore();
  
  const favorited = isFavorite(product.id);
  const inCompare = compareProductIds.includes(product.id);

  const handleViewDetail = () => {
    setSelectedProduct(product.id);
    setShowProductDetail(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCompare) {
      addToCompare(product.id);
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div
      onClick={handleViewDetail}
      className="group relative bg-white rounded-xl border border-slate-200/80 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1"
    >
      {rank && (
        <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-md ${getRankStyle(rank)}`}>
          {rank}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {product.logo}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(product.category)}`}>
              {categoryLabels[product.category]}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-lg transition-all ${
            favorited
              ? 'bg-red-50 text-red-500'
              : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
        {product.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <Rating value={product.rating} size={14} showValue />
        <span className="text-xs text-slate-400">{product.reviewCount} 条评价</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.features.slice(0, 3).map((feature, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md"
          >
            {feature}
          </span>
        ))}
        {product.features.length > 3 && (
          <span className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded-md">
            +{product.features.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="text-lg font-bold text-slate-800">
            {formatPrice(product.priceRange)}
          </p>
          <p className="text-xs text-slate-400">起</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCompare}
            disabled={inCompare || compareProductIds.length >= 4}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              inCompare
                ? 'bg-blue-100 text-blue-600'
                : compareProductIds.length >= 4
                ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            <GitCompare size={14} />
            {inCompare ? '已加入' : '对比'}
          </button>
          <button className="flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
            详情
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
