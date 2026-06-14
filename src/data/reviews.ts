import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userName: '张明',
    avatar: '👨‍💼',
    rating: 5,
    content: '飞书真的改变了我们团队的协作方式，文档、会议、沟通一站式搞定，特别是多维表格太好用了，很多项目管理需求都能满足。',
    date: '2024-12-01',
    isApproved: true,
    companySize: '50-100人',
    industry: '互联网'
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userName: '李雪',
    avatar: '👩‍💻',
    rating: 4,
    content: '整体体验不错，功能很全面。但价格对于小团队来说还是有点贵，希望能推出更实惠的小团队版本。',
    date: '2024-11-15',
    isApproved: true,
    companySize: '10-50人',
    industry: '科技'
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    userName: '王强',
    avatar: '👨‍💼',
    rating: 5,
    content: '钉钉的考勤功能太强大了，各种排班、打卡规则都能满足，特别适合我们制造业的工厂管理。',
    date: '2024-11-28',
    isApproved: true,
    companySize: '100-500人',
    industry: '制造'
  },
  {
    id: 'rev-004',
    productId: 'prod-004',
    userName: '陈静',
    avatar: '👩‍🎨',
    rating: 5,
    content: 'Notion 是我用过最好用的笔记和项目管理工具，高度可定制，模板生态超级丰富，强烈推荐！',
    date: '2024-12-05',
    isApproved: true,
    companySize: '1-10人',
    industry: '设计'
  },
  {
    id: 'rev-005',
    productId: 'prod-005',
    userName: '刘芳',
    avatar: '👩‍💼',
    rating: 4,
    content: '用友的财务软件很专业，符合国内会计准则，用起来很顺手，就是界面可以再现代化一点。',
    date: '2024-10-20',
    isApproved: true,
    companySize: '10-50人',
    industry: '商贸'
  },
  {
    id: 'rev-006',
    productId: 'prod-011',
    userName: '赵磊',
    avatar: '👨‍💻',
    rating: 4,
    content: '智齿客服功能很全面，机器人也比较智能，客服效率提升了很多。就是价格偏高，小团队成本压力大。',
    date: '2024-11-10',
    isApproved: true,
    companySize: '50-100人',
    industry: '电商'
  },
  {
    id: 'rev-007',
    productId: 'prod-014',
    userName: '孙伟',
    avatar: '👨‍💼',
    rating: 5,
    content: '神策的数据功能太强大了，对我们产品优化和用户增长帮助很大。服务团队也很专业，响应及时。',
    date: '2024-12-08',
    isApproved: true,
    companySize: '100-500人',
    industry: '互联网'
  },
  {
    id: 'rev-008',
    productId: 'prod-021',
    userName: '周婷',
    avatar: '👩‍🎨',
    rating: 5,
    content: 'Figma 是设计师必备工具，协作功能太强大了，多人同时设计完全不是问题。插件生态也超级丰富。',
    date: '2024-12-12',
    isApproved: true,
    companySize: '10-50人',
    industry: '设计'
  },
  {
    id: 'rev-009',
    productId: 'prod-009',
    userName: '吴凯',
    avatar: '👨‍💼',
    rating: 4,
    content: '易快报报销体验很好，员工喜欢用，财务也省心。发票识别准确率很高，大大减少了人工核对的工作量。',
    date: '2024-11-25',
    isApproved: true,
    companySize: '50-100人',
    industry: '科技'
  },
  {
    id: 'rev-010',
    productId: 'prod-019',
    userName: '郑华',
    avatar: '👩‍💼',
    rating: 5,
    content: 'Moka 招聘系统真的很好用，界面清爽，功能强大，HR 和面试官协作起来很顺畅，强烈推荐！',
    date: '2024-12-03',
    isApproved: true,
    companySize: '100-500人',
    industry: '科技'
  },
  {
    id: 'rev-011',
    productId: 'prod-003',
    userName: '黄丽',
    avatar: '👩‍💻',
    rating: 4,
    content: '企业微信和微信打通太方便了，客户管理功能很实用。最重要的是免费，对中小企业很友好。',
    date: '2024-11-30',
    isApproved: true,
    companySize: '10-50人',
    industry: '零售'
  },
  {
    id: 'rev-012',
    productId: 'prod-016',
    userName: '林涛',
    avatar: '👨‍💼',
    rating: 4,
    content: '有赞商城功能很完善，营销工具也多，做私域运营很合适。就是抽成加年费，成本要好好算一下。',
    date: '2024-10-25',
    isApproved: true,
    companySize: '10-50人',
    industry: '电商'
  }
];

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter(r => r.productId === productId && r.isApproved).sort((a, b) => b.date.localeCompare(a.date));
};

export const getPendingReviews = (): Review[] => {
  return reviews.filter(r => !r.isApproved);
};
