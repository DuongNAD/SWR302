import React, { useState } from 'react';
import { X, Check, Truck, CreditCard, QrCode, ShieldCheck, Snowflake, Building, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, OrderItem, PaymentMethod, ShippingMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const {
    items,
    subtotal,
    totalWeightKg,
    requiresColdChain,
    coldPackagingFee,
    appliedVoucher,
    clearCart
  } = useCart();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(currentUser?.name || 'Trần Mai Anh');
  const [phone, setPhone] = useState(currentUser?.phone || '0912 345 678');
  const [email, setEmail] = useState(currentUser?.email || 'maianh.baker@gmail.com');
  const [address, setAddress] = useState(
    currentUser?.addresses[0]?.address || 'Số 42 Ngõ 178 Tây Sơn, Đống Đa, Hà Nội'
  );
  const [city, setCity] = useState('Hà Nội');
  const [notes, setNotes] = useState('Giao vào giờ hành chính, gọi trước 15 phút');

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(
    requiresColdChain ? 'chilled_express' : 'standard'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay');

  // VAT Invoice Request for Bakery Owners
  const [vatRequested, setVatRequested] = useState(false);
  const [taxCode, setTaxCode] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const shippingFee = shippingMethod === 'chilled_express' ? 45000 : 25000;
  const discountVal = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee + coldPackagingFee - discountVal);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast({ type: 'error', message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!' });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomOrderNum = 'GHP-' + Math.floor(100000 + Math.random() * 900000);
      
      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        sku: i.product.sku,
        unit: i.product.unit,
        price: i.selectedPrice,
        quantity: i.quantity,
        total: i.selectedPrice * i.quantity,
        storageCondition: i.product.storageCondition
      }));

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: randomOrderNum,
        createdAt: new Date().toLocaleString('vi-VN'),
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address,
        shippingCity: city,
        items: orderItems,
        subtotal,
        shippingFee,
        coldPackagingFee,
        discountAmount: discountVal,
        totalAmount: finalTotal,
        status: 'confirmed',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        shippingMethod,
        notes,
        estimatedDelivery: shippingMethod === 'chilled_express' ? 'Hôm nay (2-4 giờ)' : 'Ngày mai (24-48 giờ)',
        requiresColdChain,
        vatInvoiceRequested: vatRequested,
        taxCode: vatRequested ? taxCode : undefined,
        companyName: vatRequested ? companyName : undefined
      };

      clearCart();
      onClose();
      onOrderCompleted(newOrder);
      showToast({
        type: 'success',
        message: `Đặt hàng thành công! Mã đơn của bạn là #${newOrder.orderNumber}`
      });
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-3xl border border-[#EFE4D6] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE4D6] bg-[#FFFBF5]">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 id="checkout-modal-title" className="text-base font-extrabold text-[#2B1D14]">
              {step === 1 ? 'Thông Tin Giao Hàng & Địa Chỉ' : 'Phương Thức Vận Chuyển & Thanh Toán'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">Bước {step}/2</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              {/* Receiver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email nhận hóa đơn điện tử
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Địa chỉ nhận hàng chi tiết <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên ngõ, đường/phố"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tỉnh / Thành phố <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none cursor-pointer"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ghi chú giao hàng (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Giữ lạnh kỹ, giao giờ hành chính..."
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                />
              </div>

              {/* VAT Invoice Request Accordion */}
              <div className="p-4 rounded-xl border border-[#EFE4D6] bg-[#FFFBF5] space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vatRequested}
                    onChange={(e) => setVatRequested(e.target.checked)}
                    className="rounded border-[#EFE4D6] text-[#92400E] focus:ring-[#92400E] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#92400E]" />
                    <span>Yêu cầu xuất hóa đơn điện tử GTGT (Dành cho Tiệm bánh / Doanh nghiệp)</span>
                  </div>
                </label>

                {vatRequested && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-2xs font-semibold text-stone-600 mb-1">
                        Mã số thuế doanh nghiệp
                      </label>
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="0101234567"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#EFE4D6] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-semibold text-stone-600 mb-1">
                        Tên công ty / Tiệm bánh
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Công ty TNHH Bánh Ngọt..."
                        className="w-full px-3 py-2 text-xs bg-white border border-[#EFE4D6] rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Shipping Method Selection */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E] block">
                  1. Chọn Phương Thức Vận Chuyển
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chilled Express */}
                  <div
                    onClick={() => setShippingMethod('chilled_express')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      shippingMethod === 'chilled_express'
                        ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                        : 'border-[#EFE4D6] hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-600 text-white text-3xs font-bold">
                          <Snowflake className="w-3 h-3" /> Giao Xe Lạnh Chuyên Dụng
                        </span>
                        <span className="font-mono font-bold text-sm text-sky-900">45.000₫</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#2B1D14] mt-2">
                        Giao Hỏa Tốc Xe Lạnh 2-4 Giờ
                      </h4>
                      <p className="text-2xs text-stone-600 mt-1">
                        Thùng cách nhiệt chuyên dụng kèm đá gel CO2 giữ mát ổn định 2-4°C suốt hành trình. Bắt buộc cho bơ sữa.
                      </p>
                    </div>
                    <div className="mt-3 text-2xs font-semibold text-sky-800">
                      Dự kiến giao: Hôm nay trong 2-4h
                    </div>
                  </div>

                  {/* Standard */}
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      shippingMethod === 'standard'
                        ? 'border-[#92400E] bg-amber-50/50 shadow-xs'
                        : 'border-[#EFE4D6] hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-700 text-white text-3xs font-bold">
                          <Truck className="w-3 h-3" /> Giao Tiêu Chuẩn
                        </span>
                        <span className="font-mono font-bold text-sm text-[#2B1D14]">25.000₫</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#2B1D14] mt-2">
                        Giao Hàng Nhanh 24-48 Giờ
                      </h4>
                      <p className="text-2xs text-stone-600 mt-1">
                        Áp dụng cho bột mì, dụng cụ nướng, phụ kiện không yêu cầu bảo quản nhiệt độ thấp.
                      </p>
                    </div>
                    <div className="mt-3 text-2xs font-semibold text-stone-600">
                      Dự kiến giao: Ngày mai
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E] block">
                  2. Chọn Phương Thức Thanh Toán
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* VNPay QR */}
                  <div
                    onClick={() => setPaymentMethod('vnpay')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'vnpay'
                        ? 'border-[#92400E] bg-amber-50/50 shadow-xs'
                        : 'border-[#EFE4D6] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-[#92400E]" />
                      <span className="font-bold text-xs text-[#2B1D14]">VNPAY-QR</span>
                    </div>
                    <p className="text-2xs text-stone-500 mt-1">
                      Quét mã QR qua ứng dụng ngân hàng hoặc ví VNPAY
                    </p>
                  </div>

                  {/* MoMo */}
                  <div
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'momo'
                        ? 'border-pink-600 bg-pink-50/60 shadow-xs'
                        : 'border-[#EFE4D6] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-pink-600" />
                      <span className="font-bold text-xs text-[#2B1D14]">Ví MoMo</span>
                    </div>
                    <p className="text-2xs text-stone-500 mt-1">
                      Liên kết ví MoMo thanh toán một chạm
                    </p>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-stone-800 bg-stone-100 shadow-xs'
                        : 'border-[#EFE4D6] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-stone-700" />
                      <span className="font-bold text-xs text-[#2B1D14]">Tiền Mặt (COD)</span>
                    </div>
                    <p className="text-2xs text-stone-500 mt-1">
                      Thanh toán khi nhận hàng & kiểm tra nguyên liệu
                    </p>
                  </div>
                </div>

                {/* Dynamic QR preview if VNPay selected */}
                {paymentMethod === 'vnpay' && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center gap-4 text-xs">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-stone-200 shrink-0 flex items-center justify-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GIAHOAPHAT-VNPAY-PREVIEW"
                        alt="QR Code VNPay"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[#92400E]">Mã QR Thanh Toán Tự Động VNPay</p>
                      <p className="text-2xs text-stone-600 mt-0.5">
                        Sau khi nhấn "Xác nhận đặt hàng", hệ thống sẽ kích hoạt kết nối cổng thanh toán để hoàn tất giao dịch tức thì.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Final Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Tiền hàng ({items.length} món, {totalWeightKg} kg):</span>
                  <span className="font-mono text-stone-800">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển ({shippingMethod === 'chilled_express' ? 'Xe Lạnh' : 'Chuẩn'}):</span>
                  <span className="font-mono text-stone-800">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                {requiresColdChain && (
                  <div className="flex justify-between text-sky-800">
                    <span>Đóng gói thùng giữ nhiệt + đá gel:</span>
                    <span className="font-mono">
                      {coldPackagingFee === 0 ? 'Miễn phí' : `${coldPackagingFee.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                )}
                {discountVal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Giảm giá voucher:</span>
                    <span className="font-mono">-{discountVal.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-[#2B1D14]">
                  <span>Tổng tiền phải thanh toán:</span>
                  <span className="text-lg text-[#92400E] font-black font-mono">
                    {finalTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-[#EFE4D6] flex items-center justify-between">
            {step === 1 ? (
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 bg-[#92400E] hover:bg-[#78350F] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Tiếp tục chọn vận chuyển & thanh toán
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Quay lại thông tin
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="py-3 px-8 bg-[#92400E] hover:bg-[#78350F] disabled:bg-stone-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý đơn...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Xác nhận & Đặt hàng ({finalTotal.toLocaleString('vi-VN')}₫)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
