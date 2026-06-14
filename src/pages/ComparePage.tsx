import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Plus, Check, Minus, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Rating } from '@/components/Rating';
import { formatPrice, deploymentLabels, categoryLabels } from '@/utils/constants';

export function ComparePage() {
  const navigate = useNavigate();
  const { compareProductIds, removeFromCompare, clearCompare, getProductById, products, addToCompare, setSelectedProduct, setShowProductDetail } = useAppStore();

  const compareProducts = compareProductIds
    .map(id => getProductById(id))
    .filter(Boolean);

  const availableProducts = products.filter(
    p => p.status === 'active' && !compareProductIds.includes(p.id)
  );

  const handleAddProduct = (productId: string) => {
    addToCompare(productId);
  };

  const handleViewDetail = (productId: string) => {
    setSelectedProduct(productId);
    setShowProductDetail(true);
  };

  const compareSections = [
    {
      title: '基本信息',
      rows: [
        { label: '产品分类', key: 'category', format: (val: string) => categoryLabels[val as keyof typeof categoryLabels] || val },
        { label: '综合评分', key: 'rating', format: (val: number, p) => (
          <div className="flex items-center gap-2">
            <Rating value={val} size={14} />
            <span className="font-medium">{val}</span>
            <span className="text-xs text-slate-400">({p.reviewCount}条)</span>
          </div>
        )},
        { label: '价格区间', key: 'priceRange', format: (val) => formatPrice(val) },
        { label: '部署方式', key: 'deployment', format: (val: string[]) => val.map(d => deploymentLabels[d as keyof typeof deploymentLabels]).join('、') },
      ]
    },
    {
      title: '适用范围',
      rows: [
        { label: '团队规模', key: 'teamSize', format: (_, p) => `${p.minTeamSize} - ${p.maxTeamSize > 1000 ? '1000+' : p.maxTeamSize} 人` },
        { label: '适用行业', key: 'industries', format: (val: string[]) => (
          <div className="flex flex-wrap gap-1">
            {val.slice(0, 4).map((ind, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {ind}
              </span>
            ))}
            {val.length > 4 && <span className="text-xs text-slate-400">+{val.length - 4}</span>}
          </div>
        )},
        { label: '适用场景', key: 'useCases', format: (val: string[]) => (
          <div className="flex flex-wrap gap-1">
            {val.slice(0, 3).map((uc, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                {uc}
              </span>
            ))}
          </div>
        )},
      ]
    },
    {
      title: '功能对比',
      rows: [
        { label: '核心功能数', key: 'features', format: (val: string[]) => `${val.length} 个` },
      ]
    }
  ];

  const allFeatures = Array.from(new Set(compareProducts.flatMap(p => p?.features || [])));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">产品对比</h1>
            <p className="text-sm text-slate-500">已选择 {compareProducts.length} 款产品进行对比</p>
          </div>
        </div>
        <button
          onClick={clearCompare}
          className="px-4 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
        >
          清空对比
        </button>
      </div>

      {compareProducts.length < 2 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">请选择至少 2 款产品进行对比</h3>
          <p className="text-slate-500 mb-6">返回软件目录，将感兴趣的产品加入对比栏</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            去选择产品
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="sticky left-0 z-10 bg-slate-50 w-48 px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      产品
                    </th>
                    {compareProducts.map((product) => (
                      product && (
                        <th key={product.id} className="min-w-56 px-6 py-4 text-center">
                          <div className="relative inline-block">
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors z-10"
                            >
                              <X size={14} />
                            </button>
                            <div
                              onClick={() => handleViewDetail(product.id)}
                              className="cursor-pointer"
                            >
                              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-3 hover:scale-105 transition-transform">
                                {product.logo}
                              </div>
                              <h3 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-blue-600 font-medium mt-1">
                                {formatPrice(product.priceRange)}
                              </p>
                            </div>
                          </div>
                        </th>
                      )
                    ))}
                    {compareProducts.length < 4 && (
                      <th className="min-w-56 px-6 py-4">
                        <div className="relative group">
                          <div className="w-16 h-16 mx-auto bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-3 group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
                            <Plus size={24} />
                          </div>
                          <p className="text-sm text-slate-400">添加产品</p>
                          
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                            <div className="max-h-64 overflow-y-auto">
                              {availableProducts.slice(0, 8).map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => handleAddProduct(p.id)}
                                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-left"
                                >
                                  <span className="text-xl">{p.logo}</span>
                                  <span className="text-sm text-slate-700">{p.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {compareSections.map((section, si) => (
                    <tr key={si} className="bg-slate-50/50">
                      <td colSpan={compareProducts.length + 2} className="px-6 py-3">
                        <span className="text-sm font-semibold text-slate-700">{section.title}</span>
                      </td>
                    </tr>
                  ))}

                  <tr className="border-b border-slate-100">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium">
                      综合评分
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Rating value={product.rating} size={16} />
                            <span className="font-bold text-lg text-slate-800">{product.rating}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{product.reviewCount} 条评价</p>
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium">
                      价格
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 text-center">
                          <span className="font-bold text-blue-600">{formatPrice(product.priceRange)}</span>
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium">
                      部署方式
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {product.deployment.map((d) => (
                              <span key={d} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                {deploymentLabels[d]}
                              </span>
                            ))}
                          </div>
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium">
                      团队规模
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 text-center text-sm text-slate-700">
                          {product.minTeamSize} - {product.maxTeamSize > 1000 ? '1000+' : product.maxTeamSize} 人
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>

                  <tr className="bg-slate-50/50">
                    <td colSpan={compareProducts.length + 2} className="px-6 py-3">
                      <span className="text-sm font-semibold text-slate-700">功能对比</span>
                    </td>
                  </tr>

                  {allFeatures.slice(0, 10).map((feature, fi) => (
                    <tr key={fi} className="border-b border-slate-100">
                      <td className="sticky left-0 z-10 bg-white px-6 py-3 text-sm text-slate-600">
                        {feature}
                      </td>
                      {compareProducts.map((product) => (
                        product && (
                          <td key={product.id} className="px-6 py-3 text-center">
                            {product.features.includes(feature) ? (
                              <Check className="mx-auto text-green-500" size={18} strokeWidth={2.5} />
                            ) : (
                              <Minus className="mx-auto text-slate-300" size={18} strokeWidth={2} />
                            )}
                          </td>
                        )
                      ))}
                      {compareProducts.length < 4 && <td></td>}
                    </tr>
                  ))}

                  <tr className="bg-slate-50/50">
                    <td colSpan={compareProducts.length + 2} className="px-6 py-3">
                      <span className="text-sm font-semibold text-slate-700">优缺点对比</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium align-top">
                      产品优势
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 align-top">
                          <ul className="space-y-2">
                            {product.pros.map((pro, pi) => (
                              <li key={pi} className="flex items-start gap-2 text-sm text-green-700">
                                <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>

                  <tr>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-slate-500 font-medium align-top">
                      待改进
                    </td>
                    {compareProducts.map((product) => (
                      product && (
                        <td key={product.id} className="px-6 py-4 align-top">
                          <ul className="space-y-2">
                            {product.cons.map((con, ci) => (
                              <li key={ci} className="flex items-start gap-2 text-sm text-red-700">
                                <Minus size={14} className="text-red-400 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      )
                    ))}
                    {compareProducts.length < 4 && <td></td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              返回目录
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25">
              导出对比报告
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
