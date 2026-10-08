import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Snowflake, Tag, ShieldAlert, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { QuantityStepper } from '../common/QuantityStepper';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalItemCount,
    subtotal,
    totalWeightKg,
    requiresColdChain,
    coldPackagingFee,
    isColdPackagingFree,
    freeShippingProgress,
    amountNeededForFreeShip,
    appliedVoucher,
    applyVoucher,
    removeVoucher
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherInput.trim()) {
      applyVoucher(voucherInput);
      setVoucherInput('');
    }
  };

  const discountVal = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal + coldPackagingFee - discountVal);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#EFE4D6]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#EFE4D6] bg-[#FFFBF5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-[#92400E]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="text-base font-bold text-[#2B1D14]">
                  Giỏ Hàng Của Bạn
                </h2>
                <p className="text-2xs text-[#6B5B4E]">
                  {totalItemCount} sản phẩm • Tổng khối lượng: <strong>{totalWeightKg} kg</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              aria-label="Đóng giỏ hàng"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/60 text-xs">
            {amountNeededForFreeShip > 0 ? (
              <div>
                <p className="text-stone-700">
                  Mua thêm <strong className="text-[#92400E]">{amountNeededForFreeShip.toLocaleString('vi-VN')}₫</strong> để được <strong>Miễn phí vận chuyển</strong>!
                </p>
                <div className="w-full bg-amber-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#92400E] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Chúc mừng! Bạn đã đủ điều kiện Miễn phí vận chuyển toàn quốc!</span>
              </div>
            )}
          </div>

          {/* Cold Chain Alert (if applicable) */}
          {requiresColdChain && (
            <div className="px-5 py-3 bg-sky-50 border-b border-sky-200 text-xs text-sky-900 flex items-start gap-2.5">
              <Snowflake className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Đơn hàng có nguyên liệu bảo quản lạnh (Bơ/Kem tươi)</p>
                <p className="text-2xs text-sky-700 mt-0.5">
                  {isColdPackagingFree
                    ? '🎉 Miễn phí thùng cách nhiệt & đá gel (cho đơn trên 300.000₫)'
                    : 'Phí đóng gói thùng xốp giữ nhiệt + đá gel: 15.000₫'}
                </p>
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EFE4D6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFFBF5] border border-[#EFE4D6] flex items-center justify-center text-stone-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-700">Giỏ hàng của bạn đang trống</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Hãy dạo quanh tiệm để chọn nguyên liệu bột, bơ sữa, hoặc combo làm bánh nhé!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#92400E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#78350F] cursor-pointer"
                >
                  Khám phá nguyên liệu ngay
                </button>
              </div>
            ) : (
              items.map((item) => {
                const p = item.product;
                const isWholesaleTierApplied = item.selectedPrice < p.price;

                return (
                  <div key={p.id} className="py-4 flex gap-3 items-start first:pt-0 last:pb-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#EFE4D6] bg-[#FFFBF5] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#2B1D14] line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-2xs text-stone-500 mt-0.5">
                        {p.unit} • {p.brand}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-bold text-[#92400E]">
                          {item.selectedPrice.toLocaleString('vi-VN')}₫
                        </span>
                        {isWholesaleTierApplied && (
                          <span className="text-3xs px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold">
                            Giá sỉ
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <QuantityStepper
                          size="sm"
                          quantity={item.quantity}
                          max={p.stockQty}
                          onChange={(newQty) => updateQuantity(p.id, newQty)}
                        />

                        <button
                          type="button"
                          onClick={() => removeItem(p.id)}
                          aria-label={`Xóa ${p.name}`}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EFE4D6] bg-[#FFFBF5] space-y-4">
              {/* Voucher Input */}
              <div>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-900">{appliedVoucher.code}</span>
                        <p className="text-2xs text-emerald-700">{appliedVoucher.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                    >
                      Bỏ mã
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Mã voucher (BAKING2026, GHPVIP)"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-[#EFE4D6] rounded-xl focus:border-[#92400E] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính hàng hóa:</span>
                  <span className="font-mono font-medium text-stone-800">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>

                {requiresColdChain && (
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-sky-800">
                      <Snowflake className="w-3.5 h-3.5" /> Đóng gói thùng lạnh & đá gel:
                    </span>
                    <span className="font-mono font-medium text-sky-900">
                      {coldPackagingFee === 0 ? 'Miễn phí' : `${coldPackagingFee.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                )}

                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Giảm giá ({appliedVoucher.code}):</span>
                    <span className="font-mono">-{appliedVoucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-[#EFE4D6] text-sm font-bold text-[#2B1D14]">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-lg font-black text-[#92400E] font-mono">
                    {finalTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#92400E] hover:bg-[#78350F] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
