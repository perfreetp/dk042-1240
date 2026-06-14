export type ProductCategory =
  | 'office'
  | 'finance'
  | 'customerService'
  | 'marketing'
  | 'collaboration'
  | 'hr'
  | 'design';

export type DeploymentType = 'cloud' | 'private' | 'hybrid' | 'onPremise';

export type PriceType = 'free' | 'paid' | 'freemium' | 'custom';

export type PriceUnit = 'month' | 'year' | 'user';

export interface PriceRange {
  min: number;
  max: number;
  unit: PriceUnit;
  type: PriceType;
}

export interface Product {
  id: string;
  name: string;
  logo: string;
  category: ProductCategory;
  description: string;
  priceRange: PriceRange;
  deployment: DeploymentType[];
  features: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
  rating: number;
  reviewCount: number;
  industries: string[];
  minTeamSize: number;
  maxTeamSize: number;
  officialUrl: string;
  status: 'active' | 'pending' | 'merged';
  similarProducts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  avatar?: string;
  rating: number;
  content: string;
  date: string;
  isApproved: boolean;
  companySize?: string;
  industry?: string;
}

export interface Ranking {
  id: string;
  name: string;
  category: string | 'all';
  type: 'rating' | 'popular' | 'new' | 'satisfaction';
  productIds: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
}

export interface Favorite {
  id: string;
  productId: string;
  note?: string;
  groupName: string;
  addedAt: string;
}

export interface TrialFollowUp {
  id: string;
  trialId: string;
  content: string;
  createdAt: string;
  operator: string;
  result?: 'contacted' | 'scheduled' | 'converted' | 'lost';
}

export interface Filters {
  category?: ProductCategory | 'all';
  industries: string[];
  budgetMin?: number;
  budgetMax?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  deployment: DeploymentType[];
  search: string;
  sortBy: 'rating' | 'priceAsc' | 'priceDesc' | 'popular' | 'newest';
}

export interface SurveyAnswers {
  industry?: string;
  teamSize?: string;
  budget?: string;
  category?: ProductCategory;
  features: string[];
  deployment?: DeploymentType;
}

export interface MatchResult {
  productId: string;
  matchScore: number;
  reasons: string[];
}

export type TrialStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';

export interface TrialApplication {
  id: string;
  productId: string;
  contactName: string;
  companyName: string;
  teamSize: string;
  phone: string;
  email: string;
  note: string;
  status: TrialStatus;
  adminNote?: string;
  owner?: string;
  followUps: TrialFollowUp[];
  nextContactAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminTab = 'dashboard' | 'products' | 'duplicates' | 'rankings' | 'reviews' | 'trials';
