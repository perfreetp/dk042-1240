import type { Ranking } from '@/types';

export const rankings: Ranking[] = [
  {
    id: 'rank-001',
    name: '综合满意度榜',
    category: 'all',
    type: 'rating',
    productIds: ['prod-021', 'prod-004', 'prod-001', 'prod-024', 'prod-014', 'prod-019', 'prod-003', 'prod-002', 'prod-022', 'prod-011'],
    status: 'published'
  },
  {
    id: 'rank-002',
    name: '协作办公榜',
    category: 'collaboration',
    type: 'popular',
    productIds: ['prod-001', 'prod-002', 'prod-003'],
    status: 'published'
  },
  {
    id: 'rank-003',
    name: '财务管理榜',
    category: 'finance',
    type: 'rating',
    productIds: ['prod-009', 'prod-010', 'prod-006', 'prod-005'],
    status: 'published'
  },
  {
    id: 'rank-004',
    name: '客户服务榜',
    category: 'customerService',
    type: 'rating',
    productIds: ['prod-011', 'prod-012', 'prod-013'],
    status: 'published'
  },
  {
    id: 'rank-005',
    name: '营销增长榜',
    category: 'marketing',
    type: 'popular',
    productIds: ['prod-014', 'prod-015', 'prod-016', 'prod-017'],
    status: 'published'
  },
  {
    id: 'rank-006',
    name: '人力资源榜',
    category: 'hr',
    type: 'rating',
    productIds: ['prod-019', 'prod-018', 'prod-020'],
    status: 'published'
  },
  {
    id: 'rank-007',
    name: '设计工具榜',
    category: 'design',
    type: 'rating',
    productIds: ['prod-021', 'prod-024', 'prod-022', 'prod-023'],
    status: 'published'
  },
  {
    id: 'rank-008',
    name: '新锐产品榜',
    category: 'all',
    type: 'new',
    productIds: ['prod-019', 'prod-022', 'prod-023', 'prod-009', 'prod-015', 'prod-020'],
    status: 'published'
  },
  {
    id: 'rank-009',
    name: '最佳性价比榜',
    category: 'all',
    type: 'satisfaction',
    productIds: ['prod-003', 'prod-004', 'prod-013', 'prod-023', 'prod-016', 'prod-005'],
    status: 'published'
  },
  {
    id: 'rank-010',
    name: '办公文档榜',
    category: 'office',
    type: 'popular',
    productIds: ['prod-004', 'prod-007', 'prod-008'],
    status: 'published'
  }
];

export const getRankingById = (id: string): Ranking | undefined => {
  return rankings.find(r => r.id === id);
};

export const getRankingsByCategory = (category: string): Ranking[] => {
  if (category === 'all') return rankings;
  return rankings.filter(r => r.category === category || r.category === 'all');
};
