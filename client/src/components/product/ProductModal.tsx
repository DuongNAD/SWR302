import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ShieldCheck, Thermometer, Building2, ChefHat, Check, Info } from 'lucide-react';
import { Product } from '../../types';
import { StorageBadge, StockBadge, BestSellerBadge, WholesaleBadge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { QuantityStepper } from '../common/QuantityStepper';
import { useCart } from '../../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectRecipe?: (recipeName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSelectRecipe }) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'storage' | 'wholesale'>('info');

  useEffect(() => {
    setQty(1);
    setActiveTab('info');
  }, [product]);

  if (!product) return null;

  // Calculate current tier price based on selected quantity
  const getCurrentTierPrice = (currentQty: number): { price: number; discount: number; tierIndex: number } => {
    if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
      return { price: product.price, discount: 0, tierIndex: 0 };
    }
    const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
    for (let i = 0; i < sortedTiers.length; i++) {
      if (currentQty >= sortedTiers[i].minQty) {
        return {
          price: sortedTiers[i].price,
          discount: sortedTiers[i].discountPercent,
          tierIndex: product.wholesaleTiers.findIndex((t) => t.minQty === sortedTiers[i].minQty)
        };
      }
    }
    return { price: product.price, discount: 0, tierIndex: 0 };
  };

  const currentTier = getCurrentTierPrice(qty);
  const totalPrice = currentTier.price * qty;

  const handleAddToCart = () => {
    addItem(product, qty);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#EFE4D6] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE4D6] bg-[#FFFBF5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">SKU: {product.sku}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết sản phẩm"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Column */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#EFE4D6] bg-[#FFFBF5]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.isBestSeller && <BestSellerBadge />}
                  <StorageBadge condition={product.storageCondition} />
                </div>
              </div>

              {/* Quality & Traceability Guarantee */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2 font-bold text-[#92400E]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cam Kết Chất Lượng Gia Hòa Phát</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div>• Hạn dùng: <strong>{product.expiryDate}</strong></div>
                  <div>• Mã lô: <strong>{product.batchNumber}</strong></div>
                  <div>• Xuất xứ: <strong>{product.origin}</strong></div>
                  <div>• Trọng lượng: <strong>{product.weightKg} kg</strong></div>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#92400E] uppercase">{product.brand}</p>
                <h2 id="modal-product-title" className="text-xl font-extrabold text-[#2B1D14] leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                  <StockBadge inStock={product.inStock} stockQty={product.stockQty} lowStockThreshold={product.lowStockThreshold} />
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-[#FFFBF5] border border-[#EFE4D6] flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-[#92400E]">
                    {currentTier.price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs text-stone-500 ml-1">/ {product.unit}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-stone-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {currentTier.discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-200 rounded-lg">
                    Đang áp dụng giá sỉ (-{Math.round(currentTier.discount)}%)
                  </span>
                )}
              </div>

              {/* Cold storage note */}
              {product.storageCondition === 'chilled' && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                  <Thermometer className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Bắt buộc giao bảo quản xe lạnh</strong>
                    Sản phẩm bơ sữa tươi cần giữ nhiệt 2°C - 4°C. GHP đóng thùng xốp cách nhiệt kèm đá gel chuyên dụng miễn phí.
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Price Calculation */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="modal-qty" className="text-sm font-bold text-stone-800">
                    Số lượng mua:
                  </label>
                  <QuantityStepper
                    quantity={qty}
                    max={product.stockQty}
                    onChange={(newQty) => setQty(newQty)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 text-sm">
                  <span className="text-stone-600">Thành tiền tạm tính:</span>
                  <span className="text-lg font-extrabold text-[#92400E]">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#92400E] hover:bg-[#78350F] disabled:bg-stone-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Thêm {qty} sản phẩm vào giỏ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation for Detailed Specs */}
          <div className="border-t border-[#EFE4D6] pt-6">
            <div className="flex gap-2 border-b border-[#EFE4D6] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-[#92400E] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#FEF3E2]'
                }`}
              >
                Mô Tả & Thành Phần
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('storage')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'storage'
                    ? 'bg-[#92400E] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#FEF3E2]'
                }`}
              >
                Bảo Quản & HDSD
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wholesale')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'wholesale'
                    ? 'bg-[#92400E] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#FEF3E2]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bảng Giá Sỉ Đại Lý</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4 text-sm text-stone-700 leading-relaxed">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <div>
                    <h4 className="font-bold text-[#2B1D14] mb-1">Thành phần chi tiết:</h4>
                    <p className="text-stone-600">{product.ingredients}</p>
                  </div>
                  {product.suggestedRecipes && product.suggestedRecipes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[#2B1D14] mb-2 flex items-center gap-1.5">
                        <ChefHat className="w-4 h-4 text-[#92400E]" />
                        <span>Món bánh thích hợp:</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.suggestedRecipes.map((r, i) => (
                          <span
                            key={i}
                            onClick={() => onSelectRecipe?.(r)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-[#92400E] rounded-full text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
                          >
                            🍳 {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'storage' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <h4 className="font-bold text-[#92400E] mb-1">Hướng dẫn bảo quản chuẩn tiệm bánh:</h4>
                    <p>{product.storageInstructions}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2B1D14] mb-1">Khuyến nghị sử dụng:</h4>
                    <p>{product.usageGuide}</p>
                  </div>
                </div>
              )}

              {activeTab === 'wholesale' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-500">
                    Chính sách chiết khấu lũy tiến dành riêng cho các tiệm bánh, xưởng sản xuất bánh và đại lý phân phối:
                  </p>
                  <div className="border border-[#EFE4D6] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FFFBF5] text-stone-700 font-bold border-b border-[#EFE4D6]">
                        <tr>
                          <th className="p-3">Mốc số lượng</th>
                          <th className="p-3">Đơn giá sỉ</th>
                          <th className="p-3">Mức chiết khấu</th>
                          <th className="p-3">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE4D6]">
                        {product.wholesaleTiers?.map((tier, idx) => {
                          const isCurrentActive = currentTier.tierIndex === idx;
                          return (
                            <tr
                              key={idx}
                              className={`transition-colors ${
                                isCurrentActive
                                  ? 'bg-amber-100/70 font-bold text-[#92400E]'
                                  : 'hover:bg-stone-50 text-stone-700'
                              }`}
                            >
                              <td className="p-3">Từ {tier.minQty} {product.unit}</td>
                              <td className="p-3 font-mono">{tier.price.toLocaleString('vi-VN')}₫</td>
                              <td className="p-3 text-emerald-700">-{tier.discountPercent}%</td>
                              <td className="p-3">
                                {isCurrentActive ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                    <Check className="w-3.5 h-3.5" /> Đang chọn
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setQty(tier.minQty)}
                                    className="text-stone-500 hover:text-[#92400E] underline cursor-pointer"
                                  >
                                    Chọn mốc này
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
