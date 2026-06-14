import { useState } from 'react';
import { Heart, Trash2, Edit3, Plus, ChevronRight, BookOpen, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, categoryLabels } from '@/utils/constants';
import { Rating } from '@/components/Rating';

export function FavoritesPage() {
  const { favorites, getProductById, removeFavorite, updateFavoriteNote, addToCompare, compareProductIds } = useAppStore();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const groups = Array.from(new Set(favorites.map(f => f.groupName)));

  const filteredFavorites = selectedGroup === 'all' 
    ? favorites 
    : favorites.filter(f => f.groupName === selectedGroup);

  const handleStartEdit = (favoriteId: string, currentNote?: string) => {
    setEditingId(favoriteId);
    setEditNote(currentNote || '');
  };

  const handleSaveNote = (favoriteId: string) => {
    updateFavoriteNote(favoriteId, editNote);
    setEditingId(null);
    setEditNote('');
  };

  const handleAddAllToCompare = () => {
    filteredFavorites.forEach(f => {
      if (!compareProductIds.includes(f.productId) && compareProductIds.length < 4) {
        addToCompare(f.productId);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-4">
          <Heart size={16} fill="currentColor" />
          <span>我的收藏</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          收藏清单
        </h1>
        <p className="text-slate-500">
          已收藏 {favorites.length} 款产品，按分组管理你的候选清单
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedGroup('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedGroup === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          全部 ({favorites.length})
        </button>
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedGroup === group
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {group} ({favorites.filter(f => f.groupName === group).length})
          </button>
        ))}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">还没有收藏的产品</h3>
          <p className="text-slate-500 mb-6">去软件目录逛逛，收藏心仪的产品吧</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            去发现产品
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end gap-3 mb-4">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <Plus size={16} />
              新建分组
            </button>
            <button
              onClick={handleAddAllToCompare}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              全部加入对比
            </button>
          </div>

          <div className="space-y-3">
            {filteredFavorites.map((favorite) => {
              const product = getProductById(favorite.productId);
              if (!product) return null;
              const isEditing = editingId === favorite.id;

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {product.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800 text-lg">
                              {product.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                              {categoryLabels[product.category]}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <Rating value={product.rating} size={14} showValue />
                            <span className="text-sm text-slate-400">{product.reviewCount} 评价</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{formatPrice(product.priceRange)}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="添加备注..."
                              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveNote(favorite.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEdit(favorite.id, favorite.note)}
                            className="flex items-start gap-2 cursor-text group"
                          >
                            {favorite.note ? (
                              <>
                                <BookOpen size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">{favorite.note}</p>
                                <Edit3 size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                              </>
                            ) : (
                              <span className="text-sm text-slate-400 flex items-center gap-1">
                                <Plus size={12} />
                                添加备注
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            收藏于 {new Date(favorite.addedAt).toLocaleDateString('zh-CN')}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                            {favorite.groupName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFavorite(favorite.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                            查看详情
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
