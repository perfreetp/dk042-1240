import type { ProductCategory, DeploymentType, PriceType } from '@/types';

export const categoryLabels: Record<ProductCategory | 'all', string> = {
  all: '全部',
  office: '办公软件',
  finance: '财务管理',
  customerService: '客户服务',
  marketing: '营销增长',
  collaboration: '协作办公',
  hr: '人力资源',
  design: '设计工具'
};

export const categoryIcons: Record<ProductCategory, string> = {
  office: '📄',
  finance: '💰',
  customerService: '💬',
  marketing: '📣',
  collaboration: '🤝',
  hr: '👥',
  design: '🎨'
};

export const deploymentLabels: Record<DeploymentType, string> = {
  cloud: '云端部署',
  private: '私有部署',
  hybrid: '混合部署',
  onPremise: '本地部署'
};

export const priceTypeLabels: Record<PriceType, string> = {
  free: '免费',
  paid: '付费',
  freemium: '免费增值',
  custom: '定制报价'
};

export const industries = [
  '互联网',
  '科技',
  '金融',
  '电商',
  '教育',
  '医疗',
  '制造',
  '零售',
  '服务',
  '设计',
  '媒体',
  '餐饮',
  '建筑',
  '政府',
  '企业服务',
  '美业',
  '酒店',
  '游戏',
  '能源',
  '地产'
];

export const teamSizeOptions = [
  { label: '1-10人', min: 1, max: 10 },
  { label: '10-50人', min: 10, max: 50 },
  { label: '50-100人', min: 50, max: 100 },
  { label: '100-500人', min: 100, max: 500 },
  { label: '500-1000人', min: 500, max: 1000 },
  { label: '1000人以上', min: 1000, max: 100000 }
];

export const budgetOptions = [
  { label: '免费', min: 0, max: 0 },
  { label: '1000元以下', min: 0, max: 1000 },
  { label: '1000-5000元', min: 1000, max: 5000 },
  { label: '5000-1万元', min: 5000, max: 10000 },
  { label: '1-5万元', min: 10000, max: 50000 },
  { label: '5万元以上', min: 50000, max: 1000000 }
];

export const formatPrice = (priceRange: { min: number; max: number; unit: string; type: string }): string => {
  if (priceRange.type === 'free') return '免费';
  if (priceRange.type === 'custom') return '定制报价';
  if (priceRange.min === 0) return `免费起`;
  
  const unitMap: Record<string, string> = {
    month: '月',
    year: '年',
    user: '人/年'
  };
  
  const unit = unitMap[priceRange.unit] || priceRange.unit;
  
  if (priceRange.min === priceRange.max) {
    return `¥${priceRange.min.toLocaleString()}/${unit}`;
  }
  
  return `¥${priceRange.min.toLocaleString()}-${priceRange.max.toLocaleString()}/${unit}`;
};

export const getCategoryColor = (category: ProductCategory): string => {
  const colors: Record<ProductCategory, string> = {
    office: 'bg-blue-100 text-blue-700',
    finance: 'bg-green-100 text-green-700',
    customerService: 'bg-purple-100 text-purple-700',
    marketing: 'bg-orange-100 text-orange-700',
    collaboration: 'bg-indigo-100 text-indigo-700',
    hr: 'bg-pink-100 text-pink-700',
    design: 'bg-rose-100 text-rose-700'
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};
