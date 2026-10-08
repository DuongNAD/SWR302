import React, { useState } from 'react';
import { CheckCircle2, PackageCheck, Truck, Snowflake, MapPin, Printer, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Step 2: Packing in cold chain

  if (!order) return null;

  const steps = [
    { title: 'Tiếp nhận đơn', desc: 'Đơn hàng đã được lưu vào hệ thống GHP', time: '14:20' },
    { title: 'Kho đóng gói', desc: order.requiresColdChain ? 'Đang ướp đá gel & thùng xốp cách nhiệt' : 'Đang lấy hàng tại kho tổng', time: '14:22' },
    { title: 'Bàn giao xe lạnh', desc: 'Tài xế Nguyễn Văn Hùng nhận đơn', time: 'Dự kiến 14:45' },
    { title: 'Đang giao hàng', desc: 'Xe tải lạnh đang di chuyển tới bạn', time: 'Dự kiến 15:15' },
    { title: 'Hoàn tất giao', desc: 'Ký nhận & kiểm tra nhiệt độ bơ sữa', time: 'Dự kiến 15:30' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EFE4D6] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Success Header */}
        <div className="bg-linear-to-r from-amber-700 to-[#92400E] text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs border border-white/20">
            <CheckCircle2 className="w-10 h-10 text-amber-200" />
          </div>
          <h2 id="order-success-title" className="text-2xl font-black">
            Đặt Hàng Thành Công!
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            Cảm ơn bạn đã tin tưởng chọn Gia Hòa Phát Bakery Supply.
          </p>
          <div className="inline-block mt-3 px-4 py-1.5 bg-black/25 rounded-full font-mono text-xs font-bold tracking-wider border border-white/15">
            MÃ ĐƠN: #{order.orderNumber}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Real-time Order Tracking Stepper */}
          <div className="bg-[#FFFBF5] rounded-2xl border border-[#EFE4D6] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#92400E]" />
                <span className="text-xs font-bold text-[#2B1D14] uppercase tracking-wider">
                  Theo Dõi Hành Trình Đơn Hàng (Real-Time Tracking)
                </span>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                {order.shippingMethod === 'chilled_express' ? 'Xe Lạnh Chilled Express' : 'Giao Tiêu Chuẩn'}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
              {steps.map((st, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={idx} className="relative flex items-start justify-between text-xs">
                    {/* Circle Bullet */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#92400E] border-[#92400E] text-white ring-4 ring-amber-100'
                          : 'bg-white border-stone-300 text-stone-300'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="text-3xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="ml-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold ${
                            isCurrent
                              ? 'text-[#92400E]'
                              : isPassed
                              ? 'text-stone-800'
                              : 'text-stone-400'
                          }`}
                        >
                          {st.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 text-3xs font-extrabold bg-amber-200 text-amber-900 rounded animate-pulse">
                            Đang xử lý
                          </span>
                        )}
                      </div>
                      <p className="text-2xs text-stone-500 mt-0.5">{st.desc}</p>
                    </div>

                    <span className="text-2xs text-stone-400 font-mono shrink-0 ml-2">
                      {st.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Driver Simulation Card */}
            {order.shippingMethod === 'chilled_express' && (
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs text-sky-950">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-200 flex items-center justify-center font-bold text-sky-900">
                    H
                  </div>
                  <div>
                    <h5 className="font-bold">Tài xế xe lạnh: Nguyễn Văn Hùng</h5>
                    <p className="text-2xs text-sky-700">Xe chuyên dụng: 29C-881.92 • Nhiệt kế thùng: 3.2°C</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-white text-sky-800 font-bold text-2xs rounded-lg shadow-2xs">
                  0914.888.xxx
                </span>
              </div>
            )}
          </div>

          {/* Delivery & Payment Information Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#EFE4D6] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#2B1D14]">
                <MapPin className="w-4 h-4 text-[#92400E]" />
                <span>Địa chỉ nhận hàng:</span>
              </div>
              <p className="text-stone-700 font-medium">{order.customerName} — {order.customerPhone}</p>
              <p className="text-stone-500">{order.shippingAddress}, {order.shippingCity}</p>
              {order.notes && <p className="text-2xs text-amber-800 italic">"{order.notes}"</p>}
            </div>

            <div className="p-4 rounded-xl border border-[#EFE4D6] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#2B1D14]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Thanh toán & Hóa đơn:</span>
              </div>
              <p className="text-stone-700">
                Phương thức: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'})
              </p>
              <p className="text-stone-700">
                Tổng thanh toán: <strong className="text-[#92400E] text-sm">{order.totalAmount.toLocaleString('vi-VN')}₫</strong>
              </p>
              {order.vatInvoiceRequested && (
                <p className="text-2xs text-emerald-700">
                  ✓ Yêu cầu xuất hóa đơn GTGT cho: {order.companyName || 'Doanh nghiệp'} (MST: {order.taxCode})
                </p>
              )}
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="border border-[#EFE4D6] rounded-xl overflow-hidden text-xs">
            <div className="bg-[#FFFBF5] px-4 py-2.5 font-bold text-[#2B1D14] border-b border-[#EFE4D6] flex justify-between">
              <span>Sản phẩm trong đơn ({order.items.length})</span>
              <span>Thành tiền</span>
            </div>
            <div className="divide-y divide-[#EFE4D6] max-h-40 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-stone-700">
                  <div>
                    <h5 className="font-bold line-clamp-1">{item.productName}</h5>
                    <p className="text-2xs text-stone-500">
                      {item.unit} • SL: {item.quantity} x {item.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#92400E]">
                    {item.total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-[#EFE4D6] bg-[#FFFBF5] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-[#EFE4D6] hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>In Phiếu Đơn / Hóa Đơn</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục mua hàng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
