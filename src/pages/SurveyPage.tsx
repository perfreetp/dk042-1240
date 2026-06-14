import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight, ChevronLeft, Check, Sparkles, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getRecommendations } from '@/utils/matching';
import { industries, categoryLabels, deploymentLabels, formatPrice } from '@/utils/constants';
import { Rating } from '@/components/Rating';
import type { SurveyAnswers, ProductCategory, DeploymentType } from '@/types';

export function SurveyPage() {
  const navigate = useNavigate();
  const { products, addToCompare, setSelectedProduct, setShowProductDetail } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    features: []
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      key: 'category',
      title: '你想找什么类型的软件？',
      subtitle: '选择你最感兴趣的品类',
      type: 'single',
      options: [
        { value: 'collaboration', label: '协作办公', icon: '🤝' },
        { value: 'office', label: '办公软件', icon: '📄' },
        { value: 'finance', label: '财务管理', icon: '💰' },
        { value: 'customerService', label: '客户服务', icon: '💬' },
        { value: 'marketing', label: '营销增长', icon: '📣' },
        { value: 'hr', label: '人力资源', icon: '👥' },
        { value: 'design', label: '设计工具', icon: '🎨' },
      ]
    },
    {
      key: 'industry',
      title: '你们公司属于哪个行业？',
      subtitle: '帮助我们为你推荐更合适的产品',
      type: 'single',
      options: industries.slice(0, 12).map(ind => ({ value: ind, label: ind, icon: '🏢' }))
    },
    {
      key: 'teamSize',
      title: '你们团队有多少人？',
      subtitle: '选择最接近的规模范围',
      type: 'single',
      options: [
        { value: '1-10人', label: '1-10人', icon: '👤' },
        { value: '10-50人', label: '10-50人', icon: '👥' },
        { value: '50-100人', label: '50-100人', icon: '🏢' },
        { value: '100-500人', label: '100-500人', icon: '🏬' },
        { value: '500人以上', label: '500人以上', icon: '🏛️' },
      ]
    },
    {
      key: 'budget',
      title: '你的预算范围是？',
      subtitle: '每年每人的预算',
      type: 'single',
      options: [
        { value: '免费', label: '免费工具', icon: '🆓' },
        { value: '1000元以下', label: '1000元以下', icon: '💰' },
        { value: '1000-5000元', label: '1000-5000元', icon: '💵' },
        { value: '5000-1万元', label: '5000-1万元', icon: '💎' },
        { value: '1-5万元', label: '1-5万元', icon: '👑' },
        { value: '5万元以上', label: '5万元以上', icon: '🏆' },
      ]
    },
    {
      key: 'deployment',
      title: '你倾向哪种部署方式？',
      subtitle: '根据公司需求选择',
      type: 'single',
      options: [
        { value: 'cloud', label: '云端部署', icon: '☁️' },
        { value: 'private', label: '私有部署', icon: '🔒' },
        { value: 'hybrid', label: '混合部署', icon: '🌐' },
        { value: 'onPremise', label: '本地部署', icon: '💻' },
      ]
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const key = currentQuestion.key as keyof SurveyAnswers;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
  };

  const canProceed = answers[currentQuestion.key as keyof SurveyAnswers] !== undefined;

  const recommendations = showResults ? getRecommendations(products, answers).slice(0, 6) : [];

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>智能推荐</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            为你推荐以下产品
          </h1>
          <p className="text-slate-500">
            基于你的需求，我们匹配了 {recommendations.length} 款最适合的产品
          </p>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const product = products.find(p => p.id === rec.productId);
            if (!product) return null;

            return (
              <div
                key={rec.productId}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
                      {product.logo}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => handleViewProduct(product.id)}
                            className="text-xl font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors"
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
                        <p className="text-xl font-bold text-blue-600">{formatPrice(product.priceRange)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Target size={12} className="text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            匹配度 {rec.matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mt-3">{product.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {rec.reasons.map((reason, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full"
                        >
                          <Check size={12} />
                          {reason}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => addToCompare(product.id)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        加入对比
                      </button>
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentStep(0);
              setAnswers({ features: [] });
            }}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            重新测试
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            浏览全部产品
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          <ClipboardList size={16} />
          <span>智能选型</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          找到最适合你的 SaaS 工具
        </h1>
        <p className="text-slate-500">
          回答几个简单问题，AI 为你智能匹配最合适的软件
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>第 {currentStep + 1} 步，共 {questions.length} 步</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {currentQuestion.title}
        </h2>
        <p className="text-slate-500 mb-8">{currentQuestion.subtitle}</p>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.key as keyof SurveyAnswers] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
                <span className="text-2xl">{option.icon}</span>
                <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-1.5 px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          上一步
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center gap-1.5 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {currentStep === questions.length - 1 ? '查看推荐' : '下一步'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
