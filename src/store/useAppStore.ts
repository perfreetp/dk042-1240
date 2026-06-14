import { create } from 'zustand';
import type { Product, Filters, Favorite, Review, AdminTab, TrialApplication, TrialStatus, Ranking } from '@/types';
import { products as initialProducts } from '@/data/products';
import { reviews as initialReviews } from '@/data/reviews';
import { rankings as initialRankings } from '@/data/rankings';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

interface AppState {
  products: Product[];
  reviews: Review[];
  rankings: Ranking[];
  filters: Filters;
  compareProductIds: string[];
  favorites: Favorite[];
  selectedProductId: string | null;
  showProductDetail: boolean;
  adminTab: AdminTab;
  trials: TrialApplication[];

  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  toggleFavorite: (productId: string, groupName?: string) => void;
  removeFavorite: (favoriteId: string) => void;
  removeFavorites: (favoriteIds: string[]) => void;
  updateFavoriteNote: (favoriteId: string, note: string) => void;
  updateFavoriteGroup: (favoriteId: string, groupName: string) => void;
  isFavorite: (productId: string) => boolean;
  setSelectedProduct: (productId: string | null) => void;
  setShowProductDetail: (show: boolean) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  recalculateProductRating: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  mergeProducts: (sourceIds: string[], targetId: string) => void;
  addTrial: (trial: Omit<TrialApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateTrialStatus: (trialId: string, status: TrialStatus, adminNote?: string) => void;
  addRanking: (ranking: Omit<Ranking, 'id'>) => void;
  updateRanking: (rankingId: string, updates: Partial<Ranking>) => void;
  deleteRanking: (rankingId: string) => void;
  reorderRankingProducts: (rankingId: string, productIds: string[]) => void;
  setAdminTab: (tab: AdminTab) => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getReviewsByProductId: (productId: string) => Review[];
  getTrialsByProductId: (productId: string) => TrialApplication[];
  detectDuplicates: () => { groupKey: string; reason: string; products: Product[] }[];
}

const defaultFilters: Filters = {
  category: 'all',
  industries: [],
  budgetMin: undefined,
  budgetMax: undefined,
  teamSizeMin: undefined,
  teamSizeMax: undefined,
  deployment: [],
  search: '',
  sortBy: 'rating'
};

const loadFavorites = (): Favorite[] => loadFromStorage<Favorite[]>('favorites', []) || [];
const loadProducts = (): Product[] => loadFromStorage<Product[]>('products', null) || initialProducts;
const loadReviews = (): Review[] => loadFromStorage<Review[]>('reviews', null) || initialReviews;
const loadRankings = (): Ranking[] => loadFromStorage<Ranking[]>('rankings', null) || initialRankings;
const loadTrials = (): TrialApplication[] => loadFromStorage<TrialApplication[]>('trials', []) || [];

export const useAppStore = create<AppState>((set, get) => ({
  products: loadProducts(),
  reviews: loadReviews(),
  rankings: loadRankings(),
  filters: defaultFilters,
  compareProductIds: [],
  favorites: loadFavorites(),
  selectedProductId: null,
  showProductDetail: false,
  adminTab: 'products',
  trials: loadTrials(),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: defaultFilters }),

  addToCompare: (productId) => set((state) => {
    if (state.compareProductIds.includes(productId) || state.compareProductIds.length >= 4) return state;
    return { compareProductIds: [...state.compareProductIds, productId] };
  }),

  removeFromCompare: (productId) => set((state) => ({
    compareProductIds: state.compareProductIds.filter(id => id !== productId)
  })),

  clearCompare: () => set({ compareProductIds: [] }),

  toggleFavorite: (productId, groupName = '默认分组') => set((state) => {
    const exists = state.favorites.find(f => f.productId === productId);
    let newFavorites;
    if (exists) {
      newFavorites = state.favorites.filter(f => f.productId !== productId);
    } else {
      newFavorites = [...state.favorites, { id: `fav-${Date.now()}`, productId, groupName, addedAt: new Date().toISOString() }];
    }
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  removeFavorite: (favoriteId) => set((state) => {
    const newFavorites = state.favorites.filter(f => f.id !== favoriteId);
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  removeFavorites: (favoriteIds) => set((state) => {
    const idSet = new Set(favoriteIds);
    const newFavorites = state.favorites.filter(f => !idSet.has(f.id));
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  updateFavoriteNote: (favoriteId, note) => set((state) => {
    const newFavorites = state.favorites.map(f => f.id === favoriteId ? { ...f, note } : f);
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  updateFavoriteGroup: (favoriteId, groupName) => set((state) => {
    const newFavorites = state.favorites.map(f => f.id === favoriteId ? { ...f, groupName } : f);
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  isFavorite: (productId) => get().favorites.some(f => f.productId === productId),

  setSelectedProduct: (productId) => set({ selectedProductId: productId }),
  setShowProductDetail: (show) => set({ showProductDetail: show }),

  addReview: (review) => set((state) => {
    const newReview: Review = { ...review, id: `rev-${Date.now()}`, date: new Date().toISOString().split('T')[0], isApproved: false };
    const newReviews = [...state.reviews, newReview];
    saveToStorage('reviews', newReviews);
    return { reviews: newReviews };
  }),

  approveReview: (reviewId) => set((state) => {
    const newReviews = state.reviews.map(r => r.id === reviewId ? { ...r, isApproved: true } : r);
    saveToStorage('reviews', newReviews);
    const review = newReviews.find(r => r.id === reviewId);
    if (review) {
      const newProducts = state.products.map(p => {
        if (p.id !== review.productId) return p;
        const approved = newReviews.filter(r => r.productId === p.id && r.isApproved);
        const totalRating = approved.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = approved.length > 0 ? Math.round((totalRating / approved.length) * 10) / 10 : p.rating;
        return { ...p, rating: avgRating, reviewCount: approved.length, updatedAt: new Date().toISOString().split('T')[0] };
      });
      saveToStorage('products', newProducts);
      return { reviews: newReviews, products: newProducts };
    }
    return { reviews: newReviews };
  }),

  deleteReview: (reviewId) => set((state) => {
    const deleted = state.reviews.find(r => r.id === reviewId);
    const newReviews = state.reviews.filter(r => r.id !== reviewId);
    saveToStorage('reviews', newReviews);
    if (deleted && deleted.isApproved) {
      const newProducts = state.products.map(p => {
        if (p.id !== deleted.productId) return p;
        const approved = newReviews.filter(r => r.productId === p.id && r.isApproved);
        const totalRating = approved.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = approved.length > 0 ? Math.round((totalRating / approved.length) * 10) / 10 : p.rating;
        return { ...p, rating: avgRating, reviewCount: approved.length, updatedAt: new Date().toISOString().split('T')[0] };
      });
      saveToStorage('products', newProducts);
      return { reviews: newReviews, products: newProducts };
    }
    return { reviews: newReviews };
  }),

  recalculateProductRating: (productId) => set((state) => {
    const approved = state.reviews.filter(r => r.productId === productId && r.isApproved);
    const totalRating = approved.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = approved.length > 0 ? Math.round((totalRating / approved.length) * 10) / 10 : 0;
    const newProducts = state.products.map(p =>
      p.id === productId ? { ...p, rating: avgRating, reviewCount: approved.length, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  addProduct: (product) => set((state) => {
    const newProduct: Product = { ...product, id: `prod-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] };
    const newProducts = [...state.products, newProduct];
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  updateProduct: (productId, updates) => set((state) => {
    const newProducts = state.products.map(p => p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p);
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  deleteProduct: (productId) => set((state) => {
    const newProducts = state.products.filter(p => p.id !== productId);
    const newFavorites = state.favorites.filter(f => f.productId !== productId);
    const newCompareIds = state.compareProductIds.filter(id => id !== productId);
    const newRankings = state.rankings.map(r => ({ ...r, productIds: r.productIds.filter(id => id !== productId) }));
    saveToStorage('products', newProducts);
    saveToStorage('favorites', newFavorites);
    saveToStorage('rankings', newRankings);
    return { products: newProducts, favorites: newFavorites, compareProductIds: newCompareIds, rankings: newRankings };
  }),

  mergeProducts: (sourceIds, targetId) => set((state) => {
    const newProducts = state.products.map(p => {
      if (sourceIds.includes(p.id)) return { ...p, status: 'merged' as const, updatedAt: new Date().toISOString().split('T')[0] };
      return p;
    });
    const sourceIdSet = new Set(sourceIds);
    const newFavorites = state.favorites.map(f => sourceIdSet.has(f.productId) ? { ...f, productId: targetId } : f);
    const newCompareIds = state.compareProductIds.map(id => sourceIdSet.has(id) ? targetId : id);
    const uniqueCompareIds = [...new Set(newCompareIds)];
    const newRankings = state.rankings.map(r => {
      const updated = r.productIds.map(id => sourceIdSet.has(id) ? targetId : id);
      return { ...r, productIds: [...new Set(updated)] };
    });
    const newReviews = state.reviews.map(r => sourceIdSet.has(r.productId) ? { ...r, productId: targetId } : r);
    const newTrials = state.trials.map(t => sourceIdSet.has(t.productId) ? { ...t, productId: targetId } : t);
    saveToStorage('products', newProducts);
    saveToStorage('favorites', newFavorites);
    saveToStorage('rankings', newRankings);
    saveToStorage('reviews', newReviews);
    saveToStorage('trials', newTrials);
    return { products: newProducts, favorites: newFavorites, compareProductIds: uniqueCompareIds, rankings: newRankings, reviews: newReviews, trials: newTrials };
  }),

  addTrial: (trial) => set((state) => {
    const newTrial: TrialApplication = { ...trial, id: `trial-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const newTrials = [...state.trials, newTrial];
    saveToStorage('trials', newTrials);
    return { trials: newTrials };
  }),

  updateTrialStatus: (trialId, status, adminNote) => set((state) => {
    const newTrials = state.trials.map(t => t.id === trialId ? { ...t, status, adminNote: adminNote || t.adminNote, updatedAt: new Date().toISOString() } : t);
    saveToStorage('trials', newTrials);
    return { trials: newTrials };
  }),

  addRanking: (ranking) => set((state) => {
    const newRanking: Ranking = { ...ranking, id: `rank-${Date.now()}` };
    const newRankings = [...state.rankings, newRanking];
    saveToStorage('rankings', newRankings);
    return { rankings: newRankings };
  }),

  updateRanking: (rankingId, updates) => set((state) => {
    const newRankings = state.rankings.map(r => r.id === rankingId ? { ...r, ...updates } : r);
    saveToStorage('rankings', newRankings);
    return { rankings: newRankings };
  }),

  deleteRanking: (rankingId) => set((state) => {
    const newRankings = state.rankings.filter(r => r.id !== rankingId);
    saveToStorage('rankings', newRankings);
    return { rankings: newRankings };
  }),

  reorderRankingProducts: (rankingId, productIds) => set((state) => {
    const newRankings = state.rankings.map(r => r.id === rankingId ? { ...r, productIds } : r);
    saveToStorage('rankings', newRankings);
    return { rankings: newRankings };
  }),

  setAdminTab: (tab) => set({ adminTab: tab }),

  getFilteredProducts: () => {
    const state = get();
    const { filters, products } = state;
    let result = [...products].filter(p => p.status === 'active');
    if (filters.category && filters.category !== 'all') result = result.filter(p => p.category === filters.category);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.features.some(f => f.toLowerCase().includes(s)));
    }
    if (filters.industries.length > 0) result = result.filter(p => p.industries.some(ind => filters.industries.includes(ind)));
    if (filters.budgetMin !== undefined) result = result.filter(p => p.priceRange.max >= filters.budgetMin!);
    if (filters.budgetMax !== undefined) result = result.filter(p => p.priceRange.min <= filters.budgetMax!);
    if (filters.teamSizeMin !== undefined) result = result.filter(p => p.maxTeamSize >= filters.teamSizeMin!);
    if (filters.teamSizeMax !== undefined) result = result.filter(p => p.minTeamSize <= filters.teamSizeMax!);
    if (filters.deployment.length > 0) result = result.filter(p => p.deployment.some(d => filters.deployment.includes(d)));
    switch (filters.sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'priceAsc': result.sort((a, b) => a.priceRange.min - b.priceRange.min); break;
      case 'priceDesc': result.sort((a, b) => b.priceRange.min - a.priceRange.min); break;
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'newest': result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    }
    return result;
  },

  getProductById: (id) => get().products.find(p => p.id === id),

  getReviewsByProductId: (productId) => get().reviews.filter(r => r.productId === productId && r.isApproved).sort((a, b) => b.date.localeCompare(a.date)),

  getTrialsByProductId: (productId) => get().trials.filter(t => t.productId === productId),

  detectDuplicates: () => {
    const state = get();
    const active = state.products.filter(p => p.status === 'active');
    const groups: Map<string, { reason: string; products: Product[] }> = new Map();

    const normalizeUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/+$/, '').replace(/^www\./, '').toLowerCase();

    const urlMap = new Map<string, Product[]>();
    active.forEach(p => {
      const key = normalizeUrl(p.officialUrl);
      if (!urlMap.has(key)) urlMap.set(key, []);
      urlMap.get(key)!.push(p);
    });
    urlMap.forEach((prods, key) => {
      if (prods.length > 1 && key.length > 3) {
        groups.set(`url-${key}`, { reason: '官网地址相同', products: prods });
      }
    });

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i], b = active[j];
        const nameA = a.name.toLowerCase().replace(/[\s\-_]/g, '');
        const nameB = b.name.toLowerCase().replace(/[\s\-_]/g, '');
        const maxLen = Math.max(nameA.length, nameB.length);
        let commonChars = 0;
        for (let k = 0; k < Math.min(nameA.length, nameB.length); k++) {
          if (nameA[k] === nameB[k]) commonChars++;
        }
        const similarity = maxLen > 0 ? commonChars / maxLen : 0;
        if (similarity >= 0.6 && a.category === b.category) {
          const groupKey = `name-${[a.name, b.name].sort().join('-')}`;
          if (!groups.has(groupKey)) {
            groups.set(groupKey, { reason: '名称相似（同一分类）', products: [a, b] });
          } else {
            const existing = groups.get(groupKey)!.products;
            if (!existing.find(p => p.id === a.id)) existing.push(a);
            if (!existing.find(p => p.id === b.id)) existing.push(b);
          }
        }
      }
    }

    return Array.from(groups.entries()).map(([groupKey, val]) => ({ groupKey, ...val })).filter(g => g.products.length > 1);
  }
}));
