import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Order } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  Snowflake,
  CreditCard,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react'

// Default mock order if user enters URL directly without state
const DEFAULT_DEMO_ORDER: Order = {
  id: 'ord-demo-889120',
  orderNumber: 'GHP-889120',
  createdAt: '08/10/2026, 14:20',
  customerName: 'Trần Mai Anh',
  customerPhone: '0912 345 678',
  customerEmail: 'maianh.baker@gmail.com',
  shippingAddress: 'Số 42 Ngõ 178 Tây Sơn, P. Trung Liệt, Q. Đống Đa, Hà Nội',
  shippingCity: 'Hà Nội',
  items: [
    {
      productId: 'prod-01',
      productName: 'Bơ Lạt Tự Nhiên Anchor Unsalted Butter 227g',
      sku: 'GHP-BUTTER-ANC227',
      unit: 'Thỏi 227g',
      price: 78000,
      quantity: 2,
      total: 156000,
      storageCondition: 'chilled',
    },
    {
      productId: 'prod-03',
      productName: 'Phô Mai Kem Mascarpone Tatua New Zealand 500g',
      sku: 'GHP-CHEE-MASC500',
      unit: 'Hộp 500g',
      price: 115000,
      quantity: 1,
      total: 115000,
      storageCondition: 'chilled',
    },
  ],
  subtotal: 271000,
  shippingFee: 45000,
  coldPackagingFee: 15000,
  discountAmount: 0,
  totalAmount: 331000,
  status: 'confirmed',
  paymentMethod: 'vnpay',
  paymentStatus: 'paid',
  shippingMethod: 'chilled_express',
  estimatedDelivery: 'Hôm nay trong 2–4 giờ (xe lạnh)',
  requiresColdChain: true,
  vatInvoiceRequested: false,
}

export const OrderSuccessPage: React.FC = () => {
  const { ma } = useParams<{ ma: string }>()
  const location = useLocation()
  useDocumentTitle('Đặt hàng thành công | Gia Hòa Phát')

  // Retrieve order from state if available, else fallback to default demo order with route parameter
  const order: Order = (location.state as { order?: Order })?.order || {
    ...DEFAULT_DEMO_ORDER,
    orderNumber: ma || 'GHP-889120',
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-xl space-y-6">
      {/* 1. Success Message Box */}
      <div className="text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-ok mx-auto" />
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">
            Đặt hàng thành công!
          </h1>
          <p className="text-xs text-ink-3">
            Mã đơn hàng:{' '}
            <strong className="font-mono text-ink text-sm">#{order.orderNumber}</strong>
          </p>
          <p className="text-xs text-ink-2">
            Chúng tôi đã gửi thông tin xác nhận và biên nhận thanh toán tới email{' '}
            <strong className="text-ink">{order.customerEmail}</strong>.
          </p>
        </div>
      </div>

      {/* 2. Order Summary Card */}
      <div className="border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="text-xs font-semibold text-ink">Chi tiết đơn hàng</span>
          <Badge variant="outline" className="text-xs text-ok border-ok/40">
            {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán (COD)'}
          </Badge>
        </div>

        {/* Cold chain packaging note if present */}
        {order.requiresColdChain && (
          <div className="border-l-2 border-info bg-info-soft p-3 rounded-r-md text-xs text-ink flex items-start gap-2">
            <Snowflake className="w-4 h-4 text-info shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-info block">
                Đơn hàng chuỗi lạnh bảo quản 2–8°C
              </span>
              <p className="text-ink-2 text-xs leading-relaxed">
                Đã được đóng gói thùng xốp cách nhiệt đá gel và sắp xếp xe tải lạnh chuyên dụng.
              </p>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="divide-y divide-line text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div className="space-y-0.5 max-w-[70%]">
                <p className="font-medium text-ink truncate">{item.productName}</p>
                <p className="text-xs text-ink-3">
                  {item.unit} · Số lượng: {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-ink tabular-nums">
                {formatPrice(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown Details */}
        <div className="border-t border-line pt-3 space-y-1.5 text-xs text-ink-2">
          <div className="flex justify-between">
            <span>Tạm tính hàng:</span>
            <span className="tabular-nums font-medium text-ink">{formatPrice(order.subtotal)}</span>
          </div>

          {order.coldPackagingFee > 0 && (
            <div className="flex justify-between text-info">
              <span>Phí đóng gói lạnh:</span>
              <span className="tabular-nums font-medium">{formatPrice(order.coldPackagingFee)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Phí vận chuyển ({order.shippingMethod === 'chilled_express' ? 'Xe lạnh' : 'Tiêu chuẩn'}):</span>
            <span className="tabular-nums font-medium text-ink">{formatPrice(order.shippingFee)}</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between text-ok">
              <span>Khuyến mại giảm giá:</span>
              <span className="tabular-nums font-medium">-{formatPrice(order.discountAmount)}</span>
            </div>
          )}

          <div className="border-t border-line pt-2 flex justify-between items-baseline font-bold text-ink">
            <span className="text-sm">Tổng cộng:</span>
            <Price price={order.totalAmount} size="lg" className="text-lg font-bold text-brand" />
          </div>
        </div>

        {/* Logistics Information */}
        <div className="border-t border-line pt-3 space-y-2 text-xs bg-page p-3 rounded-md">
          <div className="flex items-start gap-2 text-ink-2">
            <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-ink">Giao tới: </span>
              <span>{order.customerName} ({order.customerPhone})</span>
              <p className="text-ink-3 text-xs">{order.shippingAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-ink-2">
            <Calendar className="w-4 h-4 text-brand shrink-0" />
            <div>
              <span className="font-semibold text-ink">Dự kiến nhận hàng: </span>
              <span>{order.estimatedDelivery}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-ink-2">
            <CreditCard className="w-4 h-4 text-brand shrink-0" />
            <div>
              <span className="font-semibold text-ink">Hình thức thanh toán: </span>
              <span>
                {order.paymentMethod === 'vnpay'
                  ? 'VNPay QR'
                  : order.paymentMethod === 'momo'
                  ? 'Ví MoMo'
                  : order.paymentMethod === 'banking'
                  ? 'Chuyển khoản'
                  : 'Tiền mặt khi nhận hàng (COD)'}
              </span>
            </div>
          </div>

          {order.vatInvoiceRequested && (
            <div className="flex items-start gap-2 text-ink-2 pt-1 border-t border-line/60">
              <Building2 className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-ink">Xuất hóa đơn VAT: </span>
                <span>{order.companyName} (MST: {order.taxCode})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button asChild size="lg" className="w-full">
          <Link to={`/don-hang/${order.orderNumber}`}>
            Theo dõi hành trình đơn hàng
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/san-pham">Tiếp tục mua sắm</Link>
          </Button>

          <Button variant="ghost" onClick={handlePrint} className="flex-1 text-ink-2 hover:text-ink">
            <Printer className="w-4 h-4 mr-1.5" />
            In phiếu đơn hàng
          </Button>
        </div>
      </div>
    </div>
  )
}
