import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getOrderByNumber } from '@/mocks/orders'
import { getDriverInfo } from '@/mocks/shipments'
import { PRODUCTS } from '@/data/products'
import { OrderStatus } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Check,
  Clock,
  Truck,
  Snowflake,
  Package,
  Printer,
  Download,
  RotateCcw,
  Ban,
  MapPin,
  Building2,
  Phone,
  ThermometerSnowflake,
  AlertTriangle,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

export const OrderTrackingPage: React.FC = () => {
  const { ma } = useParams<{ ma: string }>()
  const orderNumber = ma || 'GHP-889120'
  useDocumentTitle(`Đơn hàng #${orderNumber} | Gia Hòa Phát`)

  const { addItem } = useCart()
  const { showToast } = useToast()

  const initialOrder = getOrderByNumber(orderNumber)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(initialOrder.status)
  const driverInfo = getDriverInfo(orderNumber)

  // Status mapping to timeline step (1 to 5)
  const getActiveStep = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 1
      case 'confirmed':
        return 2
      case 'packing':
        return 3
      case 'shipping':
        return 4
      case 'delivered':
        return 5
      case 'cancelled':
        return 0
      default:
        return 4
    }
  }

  const currentStep = getActiveStep(orderStatus)
  const isCancelled = orderStatus === 'cancelled'

  const timelineSteps = [
    {
      step: 1,
      title: 'Tiếp nhận đơn hàng',
      desc: 'Đơn hàng đã được ghi nhận trên hệ thống Gia Hòa Phát',
      time: '14:20 · 08/10/2026',
    },
    {
      step: 2,
      title: 'Xác nhận & chuyển kho',
      desc: 'Bộ phận điều phối đã duyệt đơn và chuyển danh sách tới thủ kho',
      time: '14:22 · 08/10/2026',
    },
    {
      step: 3,
      title: 'Đóng gói thùng xe lạnh',
      desc: initialOrder.requiresColdChain
        ? 'Ướp đá gel nhiệt độ âm và niêm phong thùng xốp cách nhiệt'
        : 'Đóng gói kiện hàng theo tiêu chuẩn chống va đập',
      time: '14:45 · 08/10/2026',
    },
    {
      step: 4,
      title: 'Đang vận chuyển trên đường',
      desc: 'Xe tải đông lạnh đang di chuyển tới địa chỉ nhận của bạn',
      time: '15:15 · 08/10/2026',
    },
    {
      step: 5,
      title: 'Giao hàng thành công',
      desc: 'Bàn giao nguyên liệu tận tay, kiểm tra cảm quan và đo nhiệt độ thùng',
      time: 'Dự kiến 15:30',
    },
  ]

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    showToast({
      type: 'success',
      message: `Đang tải xuống hóa đơn điện tử PDF cho đơn #${orderNumber}...`,
    })
  }

  const handleReorder = () => {
    initialOrder.items.forEach((item) => {
      const p = PRODUCTS.find((prod) => prod.id === item.productId)
      if (p) {
        addItem(p, item.quantity)
      }
    })
    showToast({
      type: 'success',
      message: `Đã thêm ${initialOrder.items.length} món từ đơn #${orderNumber} vào giỏ hàng!`,
    })
  }

  const handleCancelOrder = () => {
    setOrderStatus('cancelled')
    showToast({
      type: 'info',
      message: `Đơn hàng #${orderNumber} đã được chuyển sang trạng thái Đã hủy.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tra-cuu-don-hang">Tra cứu đơn</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Đơn hàng #{orderNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Top Header Card: Order Code + Status + Actions */}
      <div className="border border-line rounded-lg bg-surface p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-ink">
              Đơn hàng #{orderNumber}
            </h1>

            {isCancelled ? (
              <Badge variant="destructive" className="text-xs">
                Đã hủy
              </Badge>
            ) : orderStatus === 'delivered' ? (
              <Badge variant="outline" className="text-ok border-ok/40 text-xs">
                Giao thành công
              </Badge>
            ) : orderStatus === 'shipping' ? (
              <Badge variant="default" className="bg-brand text-white text-xs">
                Đang vận chuyển
              </Badge>
            ) : orderStatus === 'packing' ? (
              <Badge variant="secondary" className="text-xs">
                Đang đóng gói
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Đã tiếp nhận
              </Badge>
            )}
          </div>
          <p className="text-xs text-ink-3">
            Thời gian đặt: {initialOrder.createdAt} · Phương thức:{' '}
            {initialOrder.shippingMethod === 'chilled_express' ? 'Xe lạnh Chilled Express' : 'Tiêu chuẩn'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            In hóa đơn
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Tải PDF (VAT)
          </Button>

          <Button variant="outline" size="sm" onClick={handleReorder}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Mua lại
          </Button>

          {!isCancelled && orderStatus !== 'delivered' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelOrder}
              className="text-danger hover:bg-danger-soft hover:text-danger text-xs"
            >
              <Ban className="w-3.5 h-3.5 mr-1.5" />
              Hủy đơn
            </Button>
          )}
        </div>
      </div>

      {/* Cancelled Banner if cancelled */}
      {isCancelled && (
        <div className="p-4 rounded-md border border-danger/40 bg-danger-soft text-danger text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-sm block">Đơn hàng này đã được hủy</span>
            <p className="text-ink-2 mt-0.5">
              Nếu bạn đã thanh toán qua VNPay/Ví điện tử, số tiền sẽ được hoàn trả tự động vào tài khoản nguồn trong vòng 24–48 giờ làm việc.
            </p>
          </div>
        </div>
      )}

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline & Items list */}
        <div className="lg:col-span-7 space-y-6">
          {/* Reefer Telemetry & Driver Block (if cold chain) */}
          {initialOrder.requiresColdChain && !isCancelled && (
            <div className="border border-line rounded-lg bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand" />
                  Thông tin xe tải lạnh & Nhiệt độ bảo quản
                </span>
                <span className="text-xs text-ink-3 tabular-nums">
                  {driverInfo.lastTelemetryTime}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Driver */}
                <div className="space-y-1">
                  <span className="text-xs text-ink-3 block">Tài xế giao hàng:</span>
                  <p className="font-semibold text-ink">{driverInfo.name}</p>
                  <p className="text-ink-2 flex items-center gap-1 text-xs">
                    <Phone className="w-3 h-3 text-ink-3" />
                    <span>{driverInfo.phone}</span>
                  </p>
                  <p className="text-ink-3 text-xs">
                    Biển số: <strong className="font-mono text-ink">{driverInfo.plateNumber}</strong>
                  </p>
                </div>

                {/* Reefer Temperature Telemetry */}
                <div className="p-3 rounded-md bg-info-soft border border-info/30 space-y-1 text-ink">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-info flex items-center gap-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      Nhiệt độ thùng xe:
                    </span>
                    <Badge variant="outline" className="text-xs border-ok/40 text-ok py-0">
                      Đạt chuẩn 2–8°C
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-info tabular-nums">
                    {driverInfo.compartmentTemp.toFixed(1)}°C
                  </div>
                  <p className="text-xs text-ink-2">
                    Cảm biến IoT xe lạnh đo liên tục. Cam kết bơ lạt & kem tươi không bị chảy mềm.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5-step Vertical Timeline */}
          {!isCancelled && (
            <div className="border border-line rounded-lg bg-surface p-5 space-y-4">
              <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                Hành trình vận chuyển đơn hàng
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
                {timelineSteps.map((st) => {
                  const isDone = st.step < currentStep
                  const isCurrent = st.step === currentStep
                  const isUpcoming = st.step > currentStep

                  return (
                    <div key={st.step} className="relative text-xs">
                      {/* Circle Bullet */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                          isDone
                            ? 'bg-ok text-white'
                            : isCurrent
                            ? 'bg-brand text-white ring-4 ring-brand-soft'
                            : 'bg-page border border-line text-ink-3'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : st.step}
                      </div>

                      {/* Content */}
                      <div className="ml-2 space-y-0.5">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span
                            className={`font-semibold ${
                              isCurrent
                                ? 'text-brand'
                                : isDone
                                ? 'text-ink'
                                : 'text-ink-3'
                            }`}
                          >
                            {st.title}
                          </span>
                          <span className="text-xs text-ink-3 tabular-nums">
                            {st.time}
                          </span>
                        </div>
                        <p className={`text-xs ${isUpcoming ? 'text-ink-3' : 'text-ink-2'}`}>
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ordered Products Table */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Package className="w-4 h-4 text-brand" />
              Sản phẩm trong đơn hàng ({initialOrder.items.length})
            </h3>

            <div className="divide-y divide-line text-xs">
              {initialOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.productId}`}
                      className="font-medium text-ink hover:text-brand transition-colors truncate block"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-ink-3">
                      <span className="font-mono">SKU: {item.sku}</span>
                      <span>•</span>
                      <span>{item.unit}</span>
                      {item.storageCondition !== 'ambient' && (
                        <>
                          <span>•</span>
                          <span className="text-info font-medium flex items-center gap-0.5">
                            <Snowflake className="w-3 h-3" />
                            Lạnh 2–8°C
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-ink-3 block">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                    <span className="font-semibold text-ink tabular-nums">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Destination, VAT, Billing Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Logistics & Delivery details */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-ink border-b border-line pb-2.5">
              Địa chỉ & Giao nhận
            </h3>

            <div className="space-y-2.5 text-ink-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink block">
                    {initialOrder.customerName} ({initialOrder.customerPhone})
                  </span>
                  <p className="text-xs text-ink-3 mt-0.5">
                    {initialOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {initialOrder.notes && (
                <div className="p-2.5 bg-page rounded-md text-xs text-ink-2 border border-line">
                  <span className="font-semibold text-ink">Ghi chú: </span>
                  {initialOrder.notes}
                </div>
              )}
            </div>

            {/* Payment info */}
            <div className="border-t border-line pt-3 space-y-2">
              <span className="text-xs font-semibold text-ink block">Thanh toán</span>
              <div className="flex items-center justify-between text-xs text-ink-2">
                <span>Hình thức:</span>
                <span className="font-medium text-ink">
                  {initialOrder.paymentMethod === 'vnpay'
                    ? 'VNPay QR'
                    : initialOrder.paymentMethod === 'momo'
                    ? 'Ví điện tử MoMo'
                    : initialOrder.paymentMethod === 'banking'
                    ? 'Chuyển khoản ngân hàng'
                    : 'Thanh toán tiền mặt (COD)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-2">
                <span>Trạng thái:</span>
                <Badge variant="outline" className="text-xs text-ok border-ok/40 py-0">
                  {initialOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </div>
            </div>

            {/* VAT Invoice Details if present */}
            {initialOrder.vatInvoiceRequested && (
              <div className="border-t border-line pt-3 space-y-1.5 text-xs text-ink-2 bg-page p-3 rounded-md">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand" />
                  Hóa đơn GTGT (VAT) doanh nghiệp
                </span>
                <p>Công ty: <strong>{initialOrder.companyName}</strong></p>
                <p className="text-ok flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Đã phát hành hóa đơn điện tử
                </p>
              </div>
            )}
          </div>

          {/* Billing Cost Summary */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 text-xs shadow-xs">
            <h3 className="text-sm font-semibold text-ink border-b border-line pb-2.5">
              Tổng kết chi phí
            </h3>

            <div className="space-y-2 text-ink-2">
              <div className="flex justify-between">
                <span>Tạm tính hàng:</span>
                <span className="tabular-nums font-medium text-ink">
                  {formatPrice(initialOrder.subtotal)}
                </span>
              </div>

              {initialOrder.coldPackagingFee > 0 && (
                <div className="flex justify-between text-info">
                  <span>Phí đóng gói xe lạnh:</span>
                  <span className="tabular-nums font-medium">
                    {formatPrice(initialOrder.coldPackagingFee)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span className="tabular-nums font-medium text-ink">
                  {formatPrice(initialOrder.shippingFee)}
                </span>
              </div>

              {initialOrder.discountAmount > 0 && (
                <div className="flex justify-between text-ok">
                  <span>Khuyến mại giảm giá:</span>
                  <span className="tabular-nums font-medium">
                    -{formatPrice(initialOrder.discountAmount)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-line pt-3 flex justify-between items-baseline font-bold text-ink">
              <span className="text-sm">Tổng cộng:</span>
              <Price price={initialOrder.totalAmount} size="lg" className="text-xl font-bold text-brand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
