import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { VoucherBox } from './VoucherBox'
import { ArrowRight, ArrowLeft, Snowflake, ShieldCheck } from 'lucide-react'

export const OrderSummary: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    subtotal,
    requiresColdChain,
    coldPackagingFee,
    isColdPackagingFree,
    appliedVoucher,
  } = useCart()

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0
  const finalTotal = Math.max(0, subtotal + coldPackagingFee - discountAmount)

  const isCartEmpty = items.length === 0

  return (
    <div className="border border-line rounded-lg bg-surface p-5 space-y-5 sticky top-20 shadow-xs">
      <h3 className="text-base font-semibold text-ink border-b border-line pb-3">
        Tóm tắt đơn hàng
      </h3>

      {/* Breakdown lines */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-ink-2">
          <span>Tạm tính hàng ({items.length} món):</span>
          <span className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        {/* Cold packaging fee */}
        {requiresColdChain && (
          <div className="flex items-center justify-between text-ink-2">
            <span className="flex items-center gap-1 text-info font-medium">
              <Snowflake className="w-3.5 h-3.5" />
              Phí đóng gói xe lạnh:
            </span>
            <span className="tabular-nums font-medium text-ink">
              {isColdPackagingFree ? (
                <span className="text-ok">Miễn phí (≥ 300k)</span>
              ) : (
                formatPrice(coldPackagingFee)
              )}
            </span>
          </div>
        )}

        {/* Voucher discount */}
        {appliedVoucher && (
          <div className="flex items-center justify-between text-ok">
            <span>Giảm giá ({appliedVoucher.code}):</span>
            <span className="tabular-nums font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-ink-3">
          <span>Phí vận chuyển:</span>
          <span>Tính ở bước thanh toán</span>
        </div>
      </div>

      {/* Total line */}
      <div className="border-t border-line pt-3 flex items-baseline justify-between">
        <div>
          <span className="text-sm font-semibold text-ink block">Tổng thanh toán:</span>
          <span className="text-xs text-ink-3">Đã gồm VAT nếu áp dụng</span>
        </div>
        <Price price={finalTotal} size="lg" className="text-xl font-bold text-brand" />
      </div>

      {/* Voucher Box */}
      <div className="border-t border-line pt-4">
        <VoucherBox />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button
          type="button"
          size="lg"
          disabled={isCartEmpty}
          onClick={() => navigate('/thanh-toan')}
          className="w-full text-sm font-medium"
        >
          Tiến hành thanh toán
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          asChild
          className="w-full text-xs text-ink-2 hover:text-brand"
        >
          <Link to="/san-pham">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Tiếp tục mua hàng
          </Link>
        </Button>
      </div>

      {/* Small trust note */}
      <div className="border-t border-line/60 pt-3 flex items-center gap-2 text-xs text-ink-3">
        <ShieldCheck className="w-4 h-4 text-ok shrink-0" />
        <span>Hạn dùng ghi rõ trên từng lô hàng, giao xe lạnh 2–8°C cho bơ sữa.</span>
      </div>
    </div>
  )
}
