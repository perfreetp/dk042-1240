import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'prod-001',
    name: '飞书',
    logo: '📘',
    category: 'collaboration',
    description: '字节跳动旗下的企业协作与管理平台，整合即时沟通、日历、云文档、云盘、工作台等功能于一体，助力企业高效办公。',
    priceRange: { min: 0, max: 1440, unit: 'user', type: 'freemium' },
    deployment: ['cloud'],
    features: [
      '即时通讯与群组协作',
      '在线文档与表格',
      '日历与会议管理',
      '云盘文件存储',
      'OKR 目标管理',
      '审批与考勤',
      '开放平台与集成',
      '多维表格'
    ],
    pros: [
      '功能全面，一站式协作',
      '界面简洁易用',
      '与字节生态深度整合',
      '移动端体验优秀',
      '免费版功能丰富'
    ],
    cons: [
      '企业版定价偏高',
      '部分高级功能需定制',
      '海外访问受限'
    ],
    useCases: ['互联网公司', '创业团队', '远程办公', '项目管理', '知识管理'],
    rating: 4.7,
    reviewCount: 2356,
    industries: ['互联网', '科技', '教育', '零售', '金融'],
    minTeamSize: 1,
    maxTeamSize: 10000,
    officialUrl: 'https://www.feishu.cn',
    status: 'active',
    similarProducts: ['prod-002', 'prod-003', 'prod-004'],
    createdAt: '2023-01-15',
    updatedAt: '2024-12-01'
  },
  {
    id: 'prod-002',
    name: '钉钉',
    logo: '🔵',
    category: 'collaboration',
    description: '阿里巴巴旗下的企业级智能移动办公平台，提供即时通讯、考勤打卡、审批、视频会议等功能，助力企业数字化转型。',
    priceRange: { min: 0, max: 9800, unit: 'year', type: 'freemium' },
    deployment: ['cloud', 'private'],
    features: [
      '即时通讯',
      '考勤打卡',
      '审批流程',
      '视频会议',
      '企业通讯录',
      '钉盘存储',
      '智能办公硬件',
      '开放生态'
    ],
    pros: [
      '免费版功能强大',
      '考勤功能完善',
      '与阿里生态打通',
      '支持私有化部署',
      '中小企业普及率高'
    ],
    cons: [
      '界面较为复杂',
      '消息推送较频繁',
      '高级功能收费较高'
    ],
    useCases: ['中小企业', '制造业', '零售连锁', '教育培训', '政府机构'],
    rating: 4.5,
    reviewCount: 3890,
    industries: ['制造', '零售', '教育', '医疗', '政府'],
    minTeamSize: 1,
    maxTeamSize: 50000,
    officialUrl: 'https://www.dingtalk.com',
    status: 'active',
    similarProducts: ['prod-001', 'prod-003', 'prod-005'],
    createdAt: '2022-06-20',
    updatedAt: '2024-11-15'
  },
  {
    id: 'prod-003',
    name: '企业微信',
    logo: '💬',
    category: 'collaboration',
    description: '腾讯微信团队为企业打造的专业办公管理工具，与微信一致的沟通体验，丰富免费的OA应用，并与微信消息、小程序、微信支付等互通。',
    priceRange: { min: 0, max: 0, unit: 'month', type: 'free' },
    deployment: ['cloud'],
    features: [
      '与微信互通',
      '客户联系',
      '客户群',
      '客户朋友圈',
      '会议与直播',
      '微文档与微盘',
      '审批与打卡',
      '第三方应用'
    ],
    pros: [
      '完全免费',
      '与微信生态无缝连接',
      '客户管理功能强大',
      '用户上手快',
      '小程序生态丰富'
    ],
    cons: [
      '高级功能相对较少',
      '私有化部署不支持',
      '定制化能力有限'
    ],
    useCases: ['客户服务', '销售管理', '社群运营', '中小企业办公', '零售门店'],
    rating: 4.6,
    reviewCount: 4521,
    industries: ['零售', '服务', '教育', '金融', '医疗'],
    minTeamSize: 1,
    maxTeamSize: 100000,
    officialUrl: 'https://work.weixin.qq.com',
    status: 'active',
    similarProducts: ['prod-001', 'prod-002', 'prod-006'],
    createdAt: '2022-03-10',
    updatedAt: '2024-10-20'
  },
  {
    id: 'prod-004',
    name: 'Notion',
    logo: '📝',
    category: 'office',
    description: '集笔记、文档、任务管理、数据库于一体的协作工作空间，可自定义工作流程，是团队知识管理和项目协作的利器。',
    priceRange: { min: 0, max: 96, unit: 'user', type: 'freemium' },
    deployment: ['cloud'],
    features: [
      '模块化文档编辑',
      '数据库与表格',
      '任务与项目管理',
      '团队协作',
      '模板市场',
      'API 接口',
      '跨平台同步',
      'AI 助手'
    ],
    pros: [
      '高度可定制',
      '模板生态丰富',
      '界面设计优美',
      '功能强大且灵活',
      '个人免费版够用'
    ],
    cons: [
      '国内访问速度一般',
      '学习曲线较陡',
      '价格相对较高',
      '离线功能有限'
    ],
    useCases: ['知识管理', '项目管理', '个人笔记', '产品研发', '内容创作'],
    rating: 4.8,
    reviewCount: 5678,
    industries: ['互联网', '科技', '设计', '教育', '媒体'],
    minTeamSize: 1,
    maxTeamSize: 5000,
    officialUrl: 'https://www.notion.so',
    status: 'active',
    similarProducts: ['prod-001', 'prod-007', 'prod-008'],
    createdAt: '2022-08-05',
    updatedAt: '2024-12-10'
  },
  {
    id: 'prod-005',
    name: '用友畅捷通',
    logo: '💰',
    category: 'finance',
    description: '面向小微企业的财务及业务管理软件，提供账务处理、报表、进销存、工资管理等功能，支持云端部署和本地部署。',
    priceRange: { min: 598, max: 5980, unit: 'year', type: 'paid' },
    deployment: ['cloud', 'onPremise'],
    features: [
      '账务处理',
      '财务报表',
      '进销存管理',
      '工资管理',
      '固定资产',
      '税务管理',
      '多账套管理',
      '移动端查询'
    ],
    pros: [
      '财务功能专业',
      '符合国内会计准则',
      '进销存一体化',
      '本地化服务支持',
      '价格相对实惠'
    ],
    cons: [
      '界面设计传统',
      '云端体验一般',
      '学习成本较高',
      '升级服务收费'
    ],
    useCases: ['小微企业财务', '商贸企业', '服务业记账', '代账公司', '个体工商户'],
    rating: 4.3,
    reviewCount: 1890,
    industries: ['商贸', '服务', '制造', '零售', '建筑'],
    minTeamSize: 1,
    maxTeamSize: 200,
    officialUrl: 'https://www.chanjet.com',
    status: 'active',
    similarProducts: ['prod-006', 'prod-009', 'prod-010'],
    createdAt: '2022-04-18',
    updatedAt: '2024-09-30'
  },
  {
    id: 'prod-006',
    name: '金蝶精斗云',
    logo: '🦋',
    category: 'finance',
    description: '金蝶旗下面向小微企业的一站式云服务平台，提供云会计、云进销存、云电商、云报销等SaaS服务。',
    priceRange: { min: 798, max: 4980, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '云会计记账',
      '进销存管理',
      '电商订单管理',
      '报销费用管理',
      '税务申报',
      '经营分析报表',
      '多端同步',
      '开放接口'
    ],
    pros: [
      '云端使用方便',
      '财务功能专业',
      '报表分析完善',
      '手机端体验好',
      '数据安全可靠'
    ],
    cons: [
      '高级模块费用高',
      '定制化能力有限',
      '部分功能不够灵活'
    ],
    useCases: ['小微企业财务', '电商企业', '商贸公司', '服务行业', '连锁门店'],
    rating: 4.4,
    reviewCount: 2134,
    industries: ['电商', '商贸', '服务', '零售', '餐饮'],
    minTeamSize: 1,
    maxTeamSize: 500,
    officialUrl: 'https://www.jdy.com',
    status: 'active',
    similarProducts: ['prod-005', 'prod-009', 'prod-011'],
    createdAt: '2022-07-22',
    updatedAt: '2024-11-05'
  },
  {
    id: 'prod-007',
    name: '语雀',
    logo: '🐦',
    category: 'office',
    description: '蚂蚁集团旗下的知识构建与分享平台，提供文档、知识库、团队协作等功能，适合企业知识沉淀和团队协作。',
    priceRange: { min: 0, max: 598, unit: 'user', type: 'freemium' },
    deployment: ['cloud', 'private'],
    features: [
      '富文本文档',
      '知识库管理',
      '团队协作',
      '版本历史',
      '模板中心',
      '开放 API',
      '企业级安全',
      '私有化部署'
    ],
    pros: [
      '文档编辑体验优秀',
      '知识结构化管理',
      '支持私有化部署',
      '与支付宝生态互通',
      '安全可靠'
    ],
    cons: [
      '移动端体验一般',
      '高级功能收费',
      '第三方集成较少'
    ],
    useCases: ['企业知识库', '技术文档', '产品需求文档', '团队协作', '教育培训'],
    rating: 4.5,
    reviewCount: 1567,
    industries: ['互联网', '金融', '科技', '教育', '企业服务'],
    minTeamSize: 1,
    maxTeamSize: 10000,
    officialUrl: 'https://www.yuque.com',
    status: 'active',
    similarProducts: ['prod-004', 'prod-008', 'prod-012'],
    createdAt: '2022-09-12',
    updatedAt: '2024-10-15'
  },
  {
    id: 'prod-008',
    name: '石墨文档',
    logo: '📄',
    category: 'office',
    description: '中国第一款支持多人实时协作的在线文档，支持文档、表格、幻灯片、思维导图等多种格式，适合团队协作办公。',
    priceRange: { min: 0, max: 600, unit: 'user', type: 'freemium' },
    deployment: ['cloud', 'private'],
    features: [
      '在线文档编辑',
      '实时协作',
      '表格与表单',
      '幻灯片',
      '思维导图',
      '文件存储',
      '权限管理',
      '私有化部署'
    ],
    pros: [
      '协作体验流畅',
      '界面简洁美观',
      '中文使用习惯优化',
      '移动端体验好',
      '支持私有化'
    ],
    cons: [
      '大型文档加载慢',
      '高级功能需付费',
      '格式兼容性一般'
    ],
    useCases: ['团队协作文档', '会议纪要', '项目文档', '教育培训', '内容创作'],
    rating: 4.4,
    reviewCount: 2876,
    industries: ['互联网', '教育', '媒体', '设计', '企业服务'],
    minTeamSize: 1,
    maxTeamSize: 5000,
    officialUrl: 'https://shimo.im',
    status: 'active',
    similarProducts: ['prod-004', 'prod-007', 'prod-012'],
    createdAt: '2022-02-28',
    updatedAt: '2024-12-05'
  },
  {
    id: 'prod-009',
    name: '合思·易快报',
    logo: '💹',
    category: 'finance',
    description: '新一代企业报销与费控管理平台，提供移动报销、预算管理、费用控制、发票管理等功能，帮助企业降本增效。',
    priceRange: { min: 2880, max: 19800, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '移动报销',
      '电子发票管理',
      '预算管控',
      '费用标准',
      '审批流程',
      '财务核算',
      '数据分析',
      '系统集成'
    ],
    pros: [
      '报销体验好',
      '发票识别准确',
      '预算管控灵活',
      '报表分析完善',
      '集成能力强'
    ],
    cons: [
      '起售价格较高',
      '小团队不划算',
      '功能较多需培训'
    ],
    useCases: ['企业费控', '差旅报销', '费用管理', '预算控制', '财务共享'],
    rating: 4.6,
    reviewCount: 1245,
    industries: ['互联网', '科技', '金融', '咨询', '制造'],
    minTeamSize: 10,
    maxTeamSize: 10000,
    officialUrl: 'https://www.ekuaibao.com',
    status: 'active',
    similarProducts: ['prod-005', 'prod-006', 'prod-010'],
    createdAt: '2023-02-14',
    updatedAt: '2024-11-20'
  },
  {
    id: 'prod-010',
    name: '每刻报销',
    logo: '🧾',
    category: 'finance',
    description: '专业的企业级云报销平台，提供智能报销、预算管理、发票管理、差旅管理等一站式费用管理解决方案。',
    priceRange: { min: 1980, max: 15800, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '智能报销',
      '发票管理',
      '预算控制',
      '差旅管理',
      '审批流程',
      '财务对接',
      '数据分析',
      '开放平台'
    ],
    pros: [
      'AI 发票识别',
      '预算管控精细',
      '差旅一体化',
      '财务对接完善',
      '服务响应快'
    ],
    cons: [
      '定价相对较高',
      '功能较复杂',
      '小团队不适合'
    ],
    useCases: ['企业报销', '差旅管理', '费用管控', '预算管理', '财务共享中心'],
    rating: 4.5,
    reviewCount: 987,
    industries: ['科技', '制造', '医药', '金融', '咨询'],
    minTeamSize: 20,
    maxTeamSize: 20000,
    officialUrl: 'https://www.maycur.com',
    status: 'active',
    similarProducts: ['prod-005', 'prod-009', 'prod-011'],
    createdAt: '2023-03-20',
    updatedAt: '2024-10-25'
  },
  {
    id: 'prod-011',
    name: '智齿科技',
    logo: '🦷',
    category: 'customerService',
    description: '一体化智能客服平台，提供在线客服、呼叫中心、机器人、工单系统、客户洞察等全场景客服解决方案。',
    priceRange: { min: 2400, max: 30000, unit: 'year', type: 'paid' },
    deployment: ['cloud', 'hybrid'],
    features: [
      '在线客服',
      '呼叫中心',
      '智能机器人',
      '工单系统',
      '客户画像',
      '数据分析',
      '全渠道接入',
      '开放 API'
    ],
    pros: [
      '功能全面',
      '机器人智能度高',
      '部署方式灵活',
      '数据报表完善',
      '客户成功服务好'
    ],
    cons: [
      '价格偏高',
      '系统较复杂',
      '定制化成本高'
    ],
    useCases: ['电商客服', '企业服务', '金融客服', '在线教育', '医疗健康'],
    rating: 4.5,
    reviewCount: 1654,
    industries: ['电商', '金融', '教育', '医疗', '企业服务'],
    minTeamSize: 5,
    maxTeamSize: 5000,
    officialUrl: 'https://www.sobot.com',
    status: 'active',
    similarProducts: ['prod-012', 'prod-013', 'prod-014'],
    createdAt: '2022-11-08',
    updatedAt: '2024-12-08'
  },
  {
    id: 'prod-012',
    name: '网易七鱼',
    logo: '🐟',
    category: 'customerService',
    description: '网易旗下智能客服平台，提供在线客服、智能机器人、呼叫中心、工单系统等服务，助力企业提升客户服务质量。',
    priceRange: { min: 1980, max: 25000, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '在线客服',
      '智能机器人',
      '呼叫中心',
      '工单管理',
      '客服绩效',
      '数据分析',
      '全渠道',
      'CRM 集成'
    ],
    pros: [
      '网易技术背书',
      '稳定性好',
      '机器人效果不错',
      '界面友好',
      '性价比高'
    ],
    cons: [
      '高级功能需额外付费',
      '部分定制需求响应慢',
      '海外支持有限'
    ],
    useCases: ['电商客服', '在线教育', '企业服务', '金融保险', '生活服务'],
    rating: 4.4,
    reviewCount: 1876,
    industries: ['电商', '教育', '金融', '服务', '医疗'],
    minTeamSize: 3,
    maxTeamSize: 3000,
    officialUrl: 'https://qiyukf.com',
    status: 'active',
    similarProducts: ['prod-011', 'prod-013', 'prod-015'],
    createdAt: '2022-10-15',
    updatedAt: '2024-11-25'
  },
  {
    id: 'prod-013',
    name: '美洽',
    logo: '💬',
    category: 'customerService',
    description: '专业的在线客服系统，提供网站在线客服、APP 客服、小程序客服等多渠道接入方案，帮助企业高效服务客户。',
    priceRange: { min: 1200, max: 18000, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '多渠道接入',
      '智能分配',
      '快捷回复',
      '客户画像',
      '数据统计',
      '机器人',
      '工单系统',
      'API 接口'
    ],
    pros: [
      '价格实惠',
      '上手简单',
      '接入方便',
      '功能实用',
      '客服响应快'
    ],
    cons: [
      '高级功能较少',
      '机器人能力一般',
      '大型企业功能不足'
    ],
    useCases: ['中小企业客服', '电商店铺', '营销推广', '在线咨询', '客户支持'],
    rating: 4.3,
    reviewCount: 2345,
    industries: ['电商', '教育', '服务', '金融', '医疗'],
    minTeamSize: 1,
    maxTeamSize: 500,
    officialUrl: 'https://meiqia.com',
    status: 'active',
    similarProducts: ['prod-011', 'prod-012', 'prod-015'],
    createdAt: '2022-08-30',
    updatedAt: '2024-09-20'
  },
  {
    id: 'prod-014',
    name: '神策数据',
    logo: '📊',
    category: 'marketing',
    description: '专业的大数据分析平台，提供用户行为分析、用户画像、营销触达等能力，助力企业实现数据驱动决策。',
    priceRange: { min: 50000, max: 500000, unit: 'year', type: 'custom' },
    deployment: ['cloud', 'private', 'hybrid'],
    features: [
      '用户行为分析',
      '用户画像',
      '漏斗分析',
      '留存分析',
      '智能触达',
      'A/B 测试',
      '数据看板',
      '私有化部署'
    ],
    pros: [
      '分析能力强大',
      '数据模型完善',
      '支持私有化',
      '服务专业',
      '行业解决方案丰富'
    ],
    cons: [
      '价格较高',
      '实施周期长',
      '需要专业团队运营',
      '小团队不适用'
    ],
    useCases: ['用户行为分析', '增长黑客', '精细化运营', '产品优化', '营销分析'],
    rating: 4.6,
    reviewCount: 876,
    industries: ['互联网', '金融', '电商', '教育', '游戏'],
    minTeamSize: 20,
    maxTeamSize: 10000,
    officialUrl: 'https://www.sensorsdata.cn',
    status: 'active',
    similarProducts: ['prod-015', 'prod-016', 'prod-017'],
    createdAt: '2023-01-25',
    updatedAt: '2024-12-12'
  },
  {
    id: 'prod-015',
    name: 'GrowingIO',
    logo: '📈',
    category: 'marketing',
    description: '一站式数据增长引擎，提供无埋点数据采集、用户行为分析、智能运营等产品，助力企业实现数据驱动增长。',
    priceRange: { min: 30000, max: 300000, unit: 'year', type: 'custom' },
    deployment: ['cloud', 'private'],
    features: [
      '无埋点采集',
      '用户行为分析',
      '漏斗模型',
      '留存分析',
      '用户分群',
      '智能触达',
      '数据看板',
      '开放接口'
    ],
    pros: [
      '无埋点技术领先',
      '上手相对简单',
      '分析功能全面',
      '产品迭代快',
      '服务支持好'
    ],
    cons: [
      '价格偏高',
      '私有化版本贵',
      '深度分析需要专业能力'
    ],
    useCases: ['增长分析', '产品优化', '用户运营', '营销分析', '转化提升'],
    rating: 4.5,
    reviewCount: 1023,
    industries: ['互联网', '电商', '金融', '教育', 'SaaS'],
    minTeamSize: 10,
    maxTeamSize: 5000,
    officialUrl: 'https://www.growingio.com',
    status: 'active',
    similarProducts: ['prod-014', 'prod-016', 'prod-018'],
    createdAt: '2022-12-10',
    updatedAt: '2024-11-30'
  },
  {
    id: 'prod-016',
    name: '有赞',
    logo: '🛒',
    category: 'marketing',
    description: '商家服务领域的 SaaS 公司，提供微商城、零售、美业、教育等行业解决方案，帮助商家经营私域流量。',
    priceRange: { min: 6800, max: 58800, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '微商城',
      '小程序商城',
      '会员管理',
      '营销工具',
      '数据分析',
      '多门店管理',
      '供应链',
      '开放平台'
    ],
    pros: [
      '功能完善',
      '模板丰富',
      '营销工具多',
      '上手较快',
      '生态完善'
    ],
    cons: [
      '抽成费用',
      '定制化有限',
      '高级版本贵',
      '部分功能需额外付费'
    ],
    useCases: ['社交电商', '私域运营', '门店零售', '美业服务', '知识付费'],
    rating: 4.3,
    reviewCount: 3456,
    industries: ['零售', '电商', '美业', '教育', '餐饮'],
    minTeamSize: 1,
    maxTeamSize: 1000,
    officialUrl: 'https://www.youzan.com',
    status: 'active',
    similarProducts: ['prod-017', 'prod-018', 'prod-019'],
    createdAt: '2022-05-18',
    updatedAt: '2024-10-10'
  },
  {
    id: 'prod-017',
    name: '微盟',
    logo: '🌐',
    category: 'marketing',
    description: '中小企业云端商业及营销解决方案提供商，提供智慧零售、智慧餐饮、智慧酒店等行业解决方案。',
    priceRange: { min: 5800, max: 49800, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '小程序商城',
      '智慧零售',
      '智慧餐饮',
      '会员营销',
      '数据罗盘',
      '分销系统',
      '直播带货',
      '企业微信集成'
    ],
    pros: [
      '行业方案丰富',
      '微信生态深度整合',
      '营销功能强',
      '代理商网络广',
      '价格选择多'
    ],
    cons: [
      '服务质量参差',
      '功能深度一般',
      '高级功能需升级',
      '用户体验一般'
    ],
    useCases: ['智慧零售', '餐饮外卖', '本地生活', '私域运营', '门店管理'],
    rating: 4.2,
    reviewCount: 2890,
    industries: ['零售', '餐饮', '美业', '酒店', '生活服务'],
    minTeamSize: 1,
    maxTeamSize: 500,
    officialUrl: 'https://www.weimob.com',
    status: 'active',
    similarProducts: ['prod-016', 'prod-018', 'prod-020'],
    createdAt: '2022-06-30',
    updatedAt: '2024-09-15'
  },
  {
    id: 'prod-018',
    name: '北森',
    logo: '🎯',
    category: 'hr',
    description: '一体化 HR SaaS 平台，提供人才测评、招聘、绩效、继任、员工调查等一站式人力资源管理解决方案。',
    priceRange: { min: 50000, max: 500000, unit: 'year', type: 'custom' },
    deployment: ['cloud', 'private'],
    features: [
      '人才测评',
      '招聘管理',
      '绩效管理',
      '继任发展',
      '员工调查',
      '数据分析',
      '组织管理',
      '移动端'
    ],
    pros: [
      '人才测评专业',
      '一体化解决方案',
      '中大型企业客户多',
      '服务体系完善',
      '数据安全'
    ],
    cons: [
      '价格较高',
      '实施周期长',
      '中小企业不适用',
      '系统较复杂'
    ],
    useCases: ['企业招聘', '人才管理', '绩效管理', '人才发展', '组织诊断'],
    rating: 4.4,
    reviewCount: 567,
    industries: ['金融', '科技', '制造', '能源', '地产'],
    minTeamSize: 200,
    maxTeamSize: 50000,
    officialUrl: 'https://www.beisen.com',
    status: 'active',
    similarProducts: ['prod-019', 'prod-020', 'prod-021'],
    createdAt: '2023-04-10',
    updatedAt: '2024-12-03'
  },
  {
    id: 'prod-019',
    name: 'Moka',
    logo: '💼',
    category: 'hr',
    description: '智能化招聘管理系统，提供简历管理、面试管理、Offer 管理、数据分析等功能，提升企业招聘效率。',
    priceRange: { min: 19800, max: 200000, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '多渠道简历收集',
      '智能简历解析',
      '面试管理',
      'Offer 管理',
      '人才库',
      '数据报表',
      '面试官协作',
      '开放 API'
    ],
    pros: [
      '产品体验好',
      '智能化程度高',
      '上手简单',
      '数据可视化强',
      '迭代速度快'
    ],
    cons: [
      '价格偏高',
      '非招聘模块较弱',
      '高级功能需加钱',
      '小团队性价比低'
    ],
    useCases: ['企业招聘', '猎头公司', 'HR 共享中心', '校园招聘', '社会招聘'],
    rating: 4.6,
    reviewCount: 789,
    industries: ['互联网', '科技', '金融', '教育', '医疗'],
    minTeamSize: 50,
    maxTeamSize: 5000,
    officialUrl: 'https://www.mokahr.com',
    status: 'active',
    similarProducts: ['prod-018', 'prod-020', 'prod-022'],
    createdAt: '2023-02-28',
    updatedAt: '2024-11-18'
  },
  {
    id: 'prod-020',
    name: '飞书招聘',
    logo: '📋',
    category: 'hr',
    description: '飞书旗下的招聘管理系统，与飞书生态深度整合，提供内推、简历管理、面试、Offer 等全流程招聘管理。',
    priceRange: { min: 9800, max: 98000, unit: 'year', type: 'paid' },
    deployment: ['cloud'],
    features: [
      '内推系统',
      '简历管理',
      '面试安排',
      'Offer 管理',
      '人才库',
      '飞书集成',
      '数据看板',
      '面试官工具'
    ],
    pros: [
      '与飞书深度集成',
      '体验统一',
      '内推功能强',
      '协作方便',
      '性价比不错'
    ],
    cons: [
      '独立使用不划算',
      '功能相对简单',
      '非飞书用户不推荐'
    ],
    useCases: ['飞书用户招聘', '内推管理', '创业公司招聘', '科技企业 HR'],
    rating: 4.3,
    reviewCount: 456,
    industries: ['互联网', '科技', '教育', '企业服务', '金融'],
    minTeamSize: 20,
    maxTeamSize: 2000,
    officialUrl: 'https://www.feishu.cn/product/recruit',
    status: 'active',
    similarProducts: ['prod-018', 'prod-019', 'prod-021'],
    createdAt: '2023-05-15',
    updatedAt: '2024-10-28'
  },
  {
    id: 'prod-021',
    name: 'Figma',
    logo: '🎨',
    category: 'design',
    description: '基于浏览器的界面设计工具，支持多人实时协作，是 UI/UX 设计师的首选工具之一。',
    priceRange: { min: 0, max: 180, unit: 'user', type: 'freemium' },
    deployment: ['cloud'],
    features: [
      '矢量设计',
      '实时协作',
      '组件库',
      '原型设计',
      '设计系统',
      '插件生态',
      '开发者工具',
      '社区资源'
    ],
    pros: [
      '协作体验一流',
      '云端实时保存',
      '插件生态丰富',
      '设计系统完善',
      '免费版够用'
    ],
    cons: [
      '国内访问不稳定',
      '企业版价格高',
      '高级功能需付费',
      '离线使用受限'
    ],
    useCases: ['UI 设计', '产品原型', '设计协作', '设计系统', '团队协作'],
    rating: 4.9,
    reviewCount: 8976,
    industries: ['互联网', '设计', '科技', '媒体', '教育'],
    minTeamSize: 1,
    maxTeamSize: 10000,
    officialUrl: 'https://www.figma.com',
    status: 'active',
    similarProducts: ['prod-022', 'prod-023', 'prod-024'],
    createdAt: '2022-07-12',
    updatedAt: '2024-12-15'
  },
  {
    id: 'prod-022',
    name: 'MasterGo',
    logo: '🖌️',
    category: 'design',
    description: '国产专业设计协作平台，提供界面设计、原型交互、设计系统、资源社区等功能，支持多人实时协作。',
    priceRange: { min: 0, max: 399, unit: 'user', type: 'freemium' },
    deployment: ['cloud'],
    features: [
      '矢量设计',
      '实时协作',
      '原型交互',
      '设计系统',
      '组件库',
      '资源社区',
      '标注切图',
      '私有化部署'
    ],
    pros: [
      '国产本土化',
      '访问速度快',
      '协作体验好',
      '性价比高',
      '支持私有化'
    ],
    cons: [
      '插件生态较少',
      '社区资源不如 Figma',
      '部分细节待优化'
    ],
    useCases: ['UI/UX 设计', '产品设计', '团队协作', '设计系统', '产品研发'],
    rating: 4.6,
    reviewCount: 2345,
    industries: ['互联网', '设计', '科技', '金融', '教育'],
    minTeamSize: 1,
    maxTeamSize: 5000,
    officialUrl: 'https://mastergo.com',
    status: 'active',
    similarProducts: ['prod-021', 'prod-023', 'prod-024'],
    createdAt: '2023-03-05',
    updatedAt: '2024-11-22'
  },
  {
    id: 'prod-023',
    name: '即时设计',
    logo: '✨',
    category: 'design',
    description: '国内首款专业级 UI 设计工具，支持云端协作，提供设计、原型、资源社区等一站式设计服务。',
    priceRange: { min: 0, max: 299, unit: 'user', type: 'freemium' },
    deployment: ['cloud'],
    features: [
      'UI 设计',
      '实时协作',
      '原型设计',
      '设计系统',
      '资源广场',
      '插件平台',
      '交付开发',
      '私有化部署'
    ],
    pros: [
      '完全云端',
      '国内访问快',
      '免费功能多',
      '资源丰富',
      '上手简单'
    ],
    cons: [
      '复杂设计略卡',
      '高级功能需付费',
      '插件生态待完善'
    ],
    useCases: ['界面设计', '产品原型', '设计协作', '设计培训', '自由设计师'],
    rating: 4.4,
    reviewCount: 3456,
    industries: ['设计', '互联网', '教育', '科技', '媒体'],
    minTeamSize: 1,
    maxTeamSize: 2000,
    officialUrl: 'https://js.design',
    status: 'active',
    similarProducts: ['prod-021', 'prod-022', 'prod-024'],
    createdAt: '2022-09-25',
    updatedAt: '2024-10-18'
  },
  {
    id: 'prod-024',
    name: 'Sketch',
    logo: '💎',
    category: 'design',
    description: 'Mac 平台上的专业矢量设计工具，是 UI/UX 设计师的经典工具，拥有丰富的插件生态。',
    priceRange: { min: 720, max: 1188, unit: 'user', type: 'paid' },
    deployment: ['onPremise'],
    features: [
      '矢量设计',
      '像素完美',
      '组件库',
      '插件生态',
      '原型预览',
      '协作功能',
      '开发者工具',
      '资源社区'
    ],
    pros: [
      '设计专业度高',
      '插件生态丰富',
      '性能流畅',
      '行业标准',
      'Mac 优化好'
    ],
    cons: [
      '仅支持 Mac',
      '协作功能一般',
      '需付费购买',
      '云端功能弱'
    ],
    useCases: ['UI 设计', '图标设计', '移动应用设计', '网页设计', '专业设计工作室'],
    rating: 4.7,
    reviewCount: 4567,
    industries: ['设计', '互联网', '科技', '广告', '媒体'],
    minTeamSize: 1,
    maxTeamSize: 1000,
    officialUrl: 'https://www.sketch.com',
    status: 'active',
    similarProducts: ['prod-021', 'prod-022', 'prod-023'],
    createdAt: '2022-04-05',
    updatedAt: '2024-09-28'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const searchProducts = (keyword: string): Product[] => {
  const lowerKeyword = keyword.toLowerCase();
  return products.filter(
    p =>
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.description.toLowerCase().includes(lowerKeyword) ||
      p.features.some(f => f.toLowerCase().includes(lowerKeyword))
  );
};
