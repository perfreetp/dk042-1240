import type { Product, SurveyAnswers, MatchResult } from '@/types';

export const calculateMatchScore = (product: Product, answers: SurveyAnswers): MatchResult => {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  if (answers.category) {
    if (product.category === answers.category) {
      score += 25;
      reasons.push('品类匹配');
    } else {
      score -= 10;
    }
  }

  if (answers.industry) {
    if (product.industries.includes(answers.industry)) {
      score += 15;
      reasons.push('适用于您的行业');
    }
  }

  if (answers.teamSize) {
    const sizeMap: Record<string, { min: number; max: number }> = {
      '1-10人': { min: 1, max: 10 },
      '10-50人': { min: 10, max: 50 },
      '50-100人': { min: 50, max: 100 },
      '100-500人': { min: 100, max: 500 },
      '500人以上': { min: 500, max: 100000 }
    };
    const size = sizeMap[answers.teamSize];
    if (size) {
      const fitsMin = product.minTeamSize <= size.min;
      const fitsMax = product.maxTeamSize >= size.max;
      if (fitsMin && fitsMax) {
        score += 15;
        reasons.push('团队规模适配');
      } else if (fitsMin || fitsMax) {
        score += 8;
      }
    }
  }

  if (answers.budget) {
    const budgetMap: Record<string, { min: number; max: number }> = {
      '免费': { min: 0, max: 0 },
      '1000元以下': { min: 0, max: 1000 },
      '1000-5000元': { min: 1000, max: 5000 },
      '5000-1万元': { min: 5000, max: 10000 },
      '1-5万元': { min: 10000, max: 50000 },
      '5万元以上': { min: 50000, max: 1000000 }
    };
    const budget = budgetMap[answers.budget];
    if (budget) {
      if (product.priceRange.type === 'free' && budget.min === 0) {
        score += 20;
        reasons.push('完全免费');
      } else if (product.priceRange.min <= budget.max && product.priceRange.max >= budget.min) {
        score += 18;
        reasons.push('价格在预算内');
      } else if (product.priceRange.min <= budget.max * 1.2) {
        score += 8;
      }
    }
  }

  if (answers.deployment) {
    if (product.deployment.includes(answers.deployment)) {
      score += 15;
      reasons.push('支持您需要的部署方式');
    }
  }

  if (answers.features && answers.features.length > 0) {
    const matchedFeatures = product.features.filter(f =>
      answers.features.some(af => f.includes(af) || af.includes(f))
    );
    const featureScore = Math.min(10, (matchedFeatures.length / answers.features.length) * 10);
    score += featureScore;
    if (matchedFeatures.length > 0) {
      reasons.push(`包含 ${matchedFeatures.length} 个您需要的功能`);
    }
  }

  const ratingBonus = (product.rating - 3) * 2;
  score += Math.max(0, ratingBonus);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    productId: product.id,
    matchScore: score,
    reasons
  };
};

export const getRecommendations = (products: Product[], answers: SurveyAnswers): MatchResult[] => {
  return products
    .filter(p => p.status === 'active')
    .map(p => calculateMatchScore(p, answers))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
};
