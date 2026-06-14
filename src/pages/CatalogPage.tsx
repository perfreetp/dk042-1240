import { useState } from 'react';
import { SlidersHorizontal, Grid3X3, List, ArrowUpDown, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ProductCard } from '@/components/ProductCard';
import { FilterPanel } from '@/components/FilterPanel';
import { categoryIcons, categoryLabels } from '@/utils/constants';
import type { ProductCategory } from '@/types';

export function CatalogPage() {
  const { getFilteredProducts, filters, setFilters } = useAppStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const products = getFilteredProducts();

  const categories: { key: ProductCategory | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📦' },
    { key: 'collaboration', label: '协作办公', icon: '🤝' },
    { key: 'office', label: '办公软件', icon: '📄' },
    { key: 'finance', label: '财务管理', icon: '💰' },
    { key: 'customerService', label: '客户服务', icon: '💬' },
    { key: 'marketing', label: '营销增长', icon: '📣' },
    { key: 'hr', label: '人力资源', icon: '👥' },
    { key: 'design', label: '设计工具', icon: '🎨' }
  ];

  const sortOptions = [
    { value: 'rating', label: '评分最高' },
    { value: 'popular', label: '最受欢迎' },
    { value: 'newest', label: '最新上架' },
    { value: 'priceAsc', label: '价格从低到高' },
    { value: 'priceDesc', label: '价格从高到低' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          <Sparkles size={16} />
          <span>已收录 {products.length}+ 款优质 SaaS 工具</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          发现最适合你的
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {' '}SaaS 工具
          </span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          多维度筛选、横向对比、真实评价，帮你快速找到最适合企业的软件解决方案
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilters({ category: cat.key as ProductCategory | 'all' })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              filters.category === cat.key
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <FilterPanel />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                共 <span className="font-semibold text-slate-700">{products.length}</span> 款产品
              </span>
              {filters.search && (
                <span className="text-sm text-blue-600">
                  · 搜索 "{filters.search}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <ArrowUpDown size={14} className="text-slate-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value as typeof filters.sortBy })}
                  className="text-sm text-slate-600 bg-transparent border-0 focus:ring-0 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600"
              >
                <SlidersHorizontal size={16} />
                筛选
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无匹配的产品</h3>
              <p className="text-slate-500 mb-6">试试调整筛选条件，或清除所有筛选</p>
              <button
                onClick={() => setFilters({ category: 'all', industries: [], budgetMin: undefined, budgetMax: undefined, teamSizeMin: undefined, teamSizeMax: undefined, deployment: [], search: '' })}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                清除筛选
              </button>
            </div>
          ) : (
            <div className={`grid gap-5 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterPanel isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />
    </div>
  );
}
