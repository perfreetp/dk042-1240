import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { categoryLabels, deploymentLabels, industries, budgetOptions, teamSizeOptions } from '@/utils/constants';
import type { ProductCategory, DeploymentType } from '@/types';
import { useState } from 'react';

interface FilterPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterPanel({ isOpen = true, onClose }: FilterPanelProps) {
  const { filters, setFilters, resetFilters } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    industry: true,
    budget: true,
    teamSize: false,
    deployment: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setFilters({ category });
  };

  const handleIndustryToggle = (industry: string) => {
    const current = filters.industries;
    if (current.includes(industry)) {
      setFilters({ industries: current.filter(i => i !== industry) });
    } else {
      setFilters({ industries: [...current, industry] });
    }
  };

  const handleBudgetChange = (min: number | undefined, max: number | undefined) => {
    setFilters({ budgetMin: min, budgetMax: max });
  };

  const handleTeamSizeChange = (min: number | undefined, max: number | undefined) => {
    setFilters({ teamSizeMin: min, teamSizeMax: max });
  };

  const handleDeploymentToggle = (deployment: DeploymentType) => {
    const current = filters.deployment;
    if (current.includes(deployment)) {
      setFilters({ deployment: current.filter(d => d !== deployment) });
    } else {
      setFilters({ deployment: [...current, deployment] });
    }
  };

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'office', label: '办公软件' },
    { key: 'finance', label: '财务管理' },
    { key: 'customerService', label: '客户服务' },
    { key: 'marketing', label: '营销增长' },
    { key: 'collaboration', label: '协作办公' },
    { key: 'hr', label: '人力资源' },
    { key: 'design', label: '设计工具' }
  ];

  const FilterSection = ({ title, sectionKey, children }: { title: string; sectionKey: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-100 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expandedSections[sectionKey] && <div className="mt-2">{children}</div>}
    </div>
  );

  const panelContent = (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <SlidersHorizontal size={18} className="text-blue-500" />
          <span className="font-semibold">筛选条件</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
        >
          重置筛选
        </button>
      </div>

      <FilterSection title="产品分类" sectionKey="category">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key as ProductCategory | 'all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filters.category === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="适用行业" sectionKey="industry">
        <div className="flex flex-wrap gap-1.5">
          {industries.slice(0, 12).map((industry) => (
            <button
              key={industry}
              onClick={() => handleIndustryToggle(industry)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                filters.industries.includes(industry)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="预算范围" sectionKey="budget">
        <div className="space-y-2">
          {budgetOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (option.min === 0 && option.max === 0) {
                  handleBudgetChange(0, 0);
                } else {
                  handleBudgetChange(option.min, option.max);
                }
              }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${
                filters.budgetMin === option.min && filters.budgetMax === option.max
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="团队规模" sectionKey="teamSize">
        <div className="space-y-2">
          {teamSizeOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleTeamSizeChange(option.min, option.max)}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${
                filters.teamSizeMin === option.min && filters.teamSizeMax === option.max
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="部署方式" sectionKey="deployment">
        <div className="space-y-2">
          {Object.entries(deploymentLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleDeploymentToggle(key as DeploymentType)}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${
                filters.deployment.includes(key as DeploymentType)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-xl border border-slate-200 p-4">
          {panelContent}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <span className="font-semibold text-slate-700">筛选</span>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{panelContent}</div>
        </div>
      </div>
    </>
  );
}
