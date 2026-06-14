import { useState, useCallback } from 'react';
import { Heart, Trash2, Edit3, Plus, ChevronRight, BookOpen, Check, SquareCheck, Square, Tag, X, FolderPlus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, categoryLabels } from '@/utils/constants';
import { Rating } from '@/components/Rating';

export function FavoritesPage() {
  const {
    favorites,
    getProductById,
    removeFavorite,
    removeFavorites,
    updateFavoriteNote,
    updateFavoriteGroup,
    addToCompare,
    compareProductIds,
    setSelectedProduct,
    setShowProductDetail,
  } = useAppStore();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customGroups, setCustomGroups] = useState<string[]>([]);

  const existingGroups = Array.from(new Set(favorites.map(f => f.groupName)));
  const allGroups = Array.from(new Set([...existingGroups, ...customGroups]));

  const filteredFavorites = selectedGroup === 'all'
    ? favorites
    : favorites.filter(f => f.groupName === selectedGroup);

  const isAllSelected = filteredFavorites.length > 0 && filteredFavorites.every(f => selectedIds.has(f.id));

  const handleToggleSelect = useCallback((favoriteId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(favoriteId)) {
        next.delete(favoriteId);
      } else {
        next.add(favoriteId);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFavorites.map(f => f.id)));
    }
  }, [isAllSelected, filteredFavorites]);

  const handleStartEditNote = (favoriteId: string, currentNote?: string) => {
    setEditingNoteId(favoriteId);
    setEditNote(currentNote || '');
  };

  const handleSaveNote = (favoriteId: string) => {
    updateFavoriteNote(favoriteId, editNote);
    setEditingNoteId(null);
    setEditNote('');
  };

  const handleStartEditGroup = (favoriteId: string, currentGroup: string) => {
    setEditingGroupId(favoriteId);
    setEditGroupName(currentGroup);
  };

  const handleSaveGroup = (favoriteId: string) => {
    const trimmed = editGroupName.trim();
    if (trimmed) {
      updateFavoriteGroup(favoriteId, trimmed);
    }
    setEditingGroupId(null);
    setEditGroupName('');
  };

  const handleViewDetail = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
  };

  const handleBatchRemove = () => {
    if (selectedIds.size === 0) return;
    removeFavorites(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBatchAddToCompare = () => {
    const ids = Array.from(selectedIds);
    ids.forEach(id => {
      const fav = favorites.find(f => f.id === id);
      if (fav && !compareProductIds.includes(fav.productId) && compareProductIds.length < 4) {
        addToCompare(fav.productId);
      }
    });
    setSelectedIds(new Set());
  };

  const handleAddAllToCompare = () => {
    filteredFavorites.forEach(f => {
      if (!compareProductIds.includes(f.productId) && compareProductIds.length < 4) {
        addToCompare(f.productId);
      }
    });
  };

  const handleCreateGroup = () => {
    const name = window.prompt('请输入新分组名称');
    if (name && name.trim()) {
      const trimmed = name.trim();
      if (!allGroups.includes(trimmed)) {
        setCustomGroups(prev => [...prev, trimmed]);
      }
      setSelectedGroup(trimmed);
    }
  };

  const selectedCount = selectedIds.size;

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
        {allGroups.map((group) => (
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {filteredFavorites.length > 0 && (
                <button
                  onClick={handleToggleAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {isAllSelected ? <SquareCheck size={18} className="text-blue-600" /> : <Square size={18} />}
                  全选
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateGroup}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
              >
                <FolderPlus size={16} />
                新建分组
              </button>
              <button
                onClick={handleAddAllToCompare}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                全部加入对比
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFavorites.map((favorite) => {
              const product = getProductById(favorite.productId);
              if (!product) return null;
              const isEditingNote = editingNoteId === favorite.id;
              const isEditingGroup = editingGroupId === favorite.id;
              const isSelected = selectedIds.has(favorite.id);

              return (
                <div
                  key={favorite.id}
                  className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all ${
                    isSelected ? 'border-blue-400 ring-1 ring-blue-400/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                      <button
                        onClick={() => handleToggleSelect(favorite.id)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {isSelected ? <SquareCheck size={20} className="text-blue-600" /> : <Square size={20} />}
                      </button>
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                        {product.logo}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className="font-semibold text-slate-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => handleViewDetail(product.id)}
                            >
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
                        {isEditingNote ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="添加备注..."
                              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveNote(favorite.id);
                                if (e.key === 'Escape') { setEditingNoteId(null); setEditNote(''); }
                              }}
                            />
                            <button
                              onClick={() => handleSaveNote(favorite.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => { setEditingNoteId(null); setEditNote(''); }}
                              className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEditNote(favorite.id, favorite.note)}
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
                          {isEditingGroup ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editGroupName}
                                onChange={(e) => setEditGroupName(e.target.value)}
                                className="w-24 px-2 py-0.5 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveGroup(favorite.id);
                                  if (e.key === 'Escape') { setEditingGroupId(null); setEditGroupName(''); }
                                }}
                                onBlur={() => handleSaveGroup(favorite.id)}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditGroup(favorite.id, favorite.groupName)}
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 transition-colors"
                            >
                              <Tag size={10} />
                              {favorite.groupName}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFavorite(favorite.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => handleViewDetail(product.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                          >
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

          {selectedCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  已选择 <span className="font-semibold text-blue-600">{selectedCount}</span> 项
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBatchAddToCompare}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    批量加入对比
                  </button>
                  <button
                    onClick={handleBatchRemove}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    批量移出
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    取消选择
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
