import { create } from 'zustand';
import type { Product, Filters, Favorite, Review, AdminTab } from '@/types';
import { products as initialProducts } from '@/data/products';
import { reviews as initialReviews } from '@/data/reviews';
import { rankings } from '@/data/rankings';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

interface AppState {
  products: Product[];
  reviews: Review[];
  filters: Filters;
  compareProductIds: string[];
  favorites: Favorite[];
  selectedProductId: string | null;
  showProductDetail: boolean;
  adminTab: AdminTab;

  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  toggleFavorite: (productId: string, groupName?: string) => void;
  removeFavorite: (favoriteId: string) => void;
  updateFavoriteNote: (favoriteId: string, note: string) => void;
  isFavorite: (productId: string) => boolean;
  setSelectedProduct: (productId: string | null) => void;
  setShowProductDetail: (show: boolean) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'isApproved'>) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  mergeProducts: (sourceIds: string[], targetId: string) => void;
  setAdminTab: (tab: AdminTab) => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getReviewsByProductId: (productId: string) => Review[];
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

const loadFavorites = (): Favorite[] => {
  const stored = loadFromStorage<Favorite[]>('favorites', []);
  return stored || [];
};

const loadProducts = (): Product[] => {
  const stored = loadFromStorage<Product[]>('products', null);
  return stored || initialProducts;
};

const loadReviews = (): Review[] => {
  const stored = loadFromStorage<Review[]>('reviews', null);
  return stored || initialReviews;
};

export const useAppStore = create<AppState>((set, get) => ({
  products: loadProducts(),
  reviews: loadReviews(),
  filters: defaultFilters,
  compareProductIds: [],
  favorites: loadFavorites(),
  selectedProductId: null,
  showProductDetail: false,
  adminTab: 'products',

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  resetFilters: () => set({ filters: defaultFilters }),

  addToCompare: (productId) => set((state) => {
    if (state.compareProductIds.includes(productId) || state.compareProductIds.length >= 4) {
      return state;
    }
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
      newFavorites = [
        ...state.favorites,
        {
          id: `fav-${Date.now()}`,
          productId,
          groupName,
          addedAt: new Date().toISOString()
        }
      ];
    }
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  removeFavorite: (favoriteId) => set((state) => {
    const newFavorites = state.favorites.filter(f => f.id !== favoriteId);
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  updateFavoriteNote: (favoriteId, note) => set((state) => {
    const newFavorites = state.favorites.map(f =>
      f.id === favoriteId ? { ...f, note } : f
    );
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  isFavorite: (productId) => {
    return get().favorites.some(f => f.productId === productId);
  },

  setSelectedProduct: (productId) => set({ selectedProductId: productId }),

  setShowProductDetail: (show) => set({ showProductDetail: show }),

  addReview: (review) => set((state) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isApproved: false
    };
    const newReviews = [...state.reviews, newReview];
    saveToStorage('reviews', newReviews);
    return { reviews: newReviews };
  }),

  approveReview: (reviewId) => set((state) => {
    const newReviews = state.reviews.map(r =>
      r.id === reviewId ? { ...r, isApproved: true } : r
    );
    saveToStorage('reviews', newReviews);
    return { reviews: newReviews };
  }),

  deleteReview: (reviewId) => set((state) => {
    const newReviews = state.reviews.filter(r => r.id !== reviewId);
    saveToStorage('reviews', newReviews);
    return { reviews: newReviews };
  }),

  addProduct: (product) => set((state) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const newProducts = [...state.products, newProduct];
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  updateProduct: (productId, updates) => set((state) => {
    const newProducts = state.products.map(p =>
      p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  deleteProduct: (productId) => set((state) => {
    const newProducts = state.products.filter(p => p.id !== productId);
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  mergeProducts: (sourceIds, targetId) => set((state) => {
    const newProducts = state.products.map(p => {
      if (sourceIds.includes(p.id)) {
        return { ...p, status: 'merged' as const, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return p;
    });
    saveToStorage('products', newProducts);
    return { products: newProducts };
  }),

  setAdminTab: (tab) => set({ adminTab: tab }),

  getFilteredProducts: () => {
    const state = get();
    const { filters, products } = state;
    let result = [...products].filter(p => p.status === 'active');

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.features.some(f => f.toLowerCase().includes(searchLower))
      );
    }

    if (filters.industries.length > 0) {
      result = result.filter(p =>
        p.industries.some(ind => filters.industries.includes(ind))
      );
    }

    if (filters.budgetMin !== undefined) {
      result = result.filter(p => p.priceRange.max >= filters.budgetMin!);
    }

    if (filters.budgetMax !== undefined) {
      result = result.filter(p => p.priceRange.min <= filters.budgetMax!);
    }

    if (filters.teamSizeMin !== undefined) {
      result = result.filter(p => p.maxTeamSize >= filters.teamSizeMin!);
    }

    if (filters.teamSizeMax !== undefined) {
      result = result.filter(p => p.minTeamSize <= filters.teamSizeMax!);
    }

    if (filters.deployment.length > 0) {
      result = result.filter(p =>
        p.deployment.some(d => filters.deployment.includes(d))
      );
    }

    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceAsc':
        result.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.priceRange.min - a.priceRange.min);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    return result;
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },

  getReviewsByProductId: (productId) => {
    return get().reviews
      .filter(r => r.productId === productId && r.isApproved)
      .sort((a, b) => b.date.localeCompare(a.date));
  }
}));
