import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Layers } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function CompareBar() {
  const navigate = useNavigate();
  const { compareProductIds, removeFromCompare, clearCompare, getProductById } = useAppStore();

  if (compareProductIds.length === 0) return null;

  const products = compareProductIds
    .map(id => getProductById(id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Layers size={18} className="text-blue-500" />
              <span className="text-sm font-medium">对比栏</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {compareProductIds.length}/4
              </span>
            </div>

            <div className="flex items-center gap-2">
              {products.map((product) => (
                product && (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg group hover:bg-slate-200 transition-colors"
                  >
                    <span className="text-lg">{product.logo}</span>
                    <span className="text-sm font-medium text-slate-700 max-w-20 truncate">
                      {product.name}
                    </span>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="p-0.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              清空
            </button>
            <button
              onClick={() => navigate('/compare')}
              disabled={compareProductIds.length < 2}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              开始对比
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
