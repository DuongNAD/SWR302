import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getOrderByNumber } from '@/mocks/orders'
import { OrderStatus } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Printer,
  FileText,
  Snowflake,
  Truck,
  MapPin,
  Building2,
  User,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orderNumber = id || 'GHP-889120'
  useDocumentTitle(`Chi tiết đơn hàng #${orderNumber} | Quản trị Gia Hòa Phát`)

  const { showToast } = useToast()
  const initialOrder = getOrderByNumber(orderNumber)

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialOrder.status)
  const [checklist, setChecklist] = useState({
    foamBox: true,
    iceGel: true,
    tempSensor: true,
    tapeSeal: true,
  })

  // Contextual single primary button
  const getNextStatusAction = () => {
    switch (currentStatus) {
      case 'pending':
        return { label: 'Xác nhận đơn hàng', next: 'confirmed' as OrderStatus }
      case 'confirmed':
        return { label: 'Bắt đầu đóng gói kho', next: 'packing' as OrderStatus }
      case 'packing':
        return { label: 'Bàn giao xe tải lạnh', next: 'shipping' as OrderStatus }
      case 'shipping':
        return { label: 'Xác nhận hoàn tất giao hàng', next: 'delivered' as OrderStatus }
      default:
        return null
    }
  }

  const action = getNextStatusAction()

  const handleAdvanceStatus = () => {
    if (!action) return
    setCurrentStatus(action.next)
    showToast({
      type: 'success',
      message: `Đã cập nhật trạng thái đơn #${orderNumber} thành "${action.next}".`,
    })
  }

  const handlePrintDispatch = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Link to="/admin/don-hang" className="hover:text-ink flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Quản lý đơn hàng
            </Link>
            <span>/</span>
            <span className="font-mono text-ink">#{orderNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">
              Đơn hàng #{orderNumber}
            </h1>

            {currentStatus === 'delivered' ? (
              <Badge variant="outline" className="text-ok border-ok/40 text-xs">Hoàn tất</Badge>
            ) : currentStatus === 'shipping' ? (
              <Badge variant="default" className="bg-brand text-white text-xs">Đang giao xe lạnh</Badge>
            ) : currentStatus === 'packing' ? (
              <Badge variant="secondary" className="bg-sky-50 text-sky-900 text-xs">Đang đóng gói</Badge>
            ) : currentStatus === 'confirmed' ? (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900 text-xs">Đã duyệt</Badge>
            ) : currentStatus === 'cancelled' ? (
              <Badge variant="destructive" className="text-xs">Đã hủy</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Chờ duyệt</Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintDispatch}>
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            In phiếu xuất kho
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrintDispatch}>
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            In hóa đơn VAT
          </Button>

          {action && (
            <Button size="sm" onClick={handleAdvanceStatus} className="font-medium">
              {action.label}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Items, Cold chain checklist, Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ordered Products Table */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-ink">
              Danh sách nguyên liệu trong đơn ({initialOrder.items.length})
            </h2>

            <div className="border border-line rounded-md overflow-hidden bg-surface">
              <table className="w-full text-xs text-left">
                <thead className="bg-page text-ink-2 font-medium border-b border-line">
                  <tr>
                    <th className="py-2.5 px-3">Sản phẩm</th>
                    <th className="py-2.5 px-3">Bảo quản</th>
                    <th className="py-2.5 px-3 text-right">Đơn giá</th>
                    <th className="py-2.5 px-3 text-right">SL</th>
                    <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {initialOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-page/50">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-ink block">{item.productName}</span>
                        <span className="text-xs text-ink-3 font-mono">SKU: {item.sku} · {item.unit}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        {item.storageCondition !== 'ambient' ? (
                          <span className="text-info font-medium text-xs flex items-center gap-1">
                            <Snowflake className="w-3 h-3" />
                            Lạnh 2–8°C
                          </span>
                        ) : (
                          <span className="text-ink-3 text-xs">Thường</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-ink">
                        {formatPrice(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cold Chain Packaging Checklist (if required) */}
          {initialOrder.requiresColdChain && (
            <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-info" />
                  Checklist kiểm soát đóng gói xe lạnh
                </h3>
                <Badge variant="outline" className="text-xs text-info border-info/40">
                  Chuỗi lạnh 2–8°C
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 p-2 rounded-md hover:bg-page cursor-pointer">
                  <Checkbox
                    checked={checklist.foamBox}
                    onCheckedChange={(c) => setChecklist({ ...checklist, foamBox: Boolean(c) })}
                  />
                  <span className="text-ink-2">Thùng xốp cách nhiệt chuyên dụng đạt chuẩn chống thất thoát nhiệt</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-md hover:bg-page cursor-pointer">
                  <Checkbox
                    checked={checklist.iceGel}
                    onCheckedChange={(c) => setChecklist({ ...checklist, iceGel: Boolean(c) })}
                  />
                  <span className="text-ink-2">Đá gel nhiệt độ âm đã được cấp đông sâu tối thiểu 24 giờ</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-md hover:bg-page cursor-pointer">
                  <Checkbox
                    checked={checklist.tempSensor}
                    onCheckedChange={(c) => setChecklist({ ...checklist, tempSensor: Boolean(c) })}
                  />
                  <span className="text-ink-2">Cảm biến nhiệt kế thùng xe tải hoạt động (Nhiệt độ hiện tại: 3,2°C)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-md hover:bg-page cursor-pointer">
                  <Checkbox
                    checked={checklist.tapeSeal}
                    onCheckedChange={(c) => setChecklist({ ...checklist, tapeSeal: Boolean(c) })}
                  />
                  <span className="text-ink-2">Dán tem niêm phong chống mở nắp Gia Hòa Phát Cold Chain</span>
                </label>
              </div>
            </div>
          )}

          {/* Customer Order Notes */}
          {initialOrder.notes && (
            <div className="border border-line rounded-lg bg-page p-4 text-xs space-y-1">
              <span className="font-semibold text-ink">Ghi chú từ người mua hàng:</span>
              <p className="text-ink-2 leading-relaxed">{initialOrder.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Customer, Delivery, VAT, Billing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer & Delivery */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3.5 text-xs shadow-xs">
            <h3 className="text-sm font-bold text-ink border-b border-line pb-2.5">
              Khách hàng & Giao nhận
            </h3>

            <div className="space-y-2 text-ink-2">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">{initialOrder.customerName}</span>
                  <p className="text-xs text-ink-3">{initialOrder.customerPhone} · {initialOrder.customerEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-ink block">Địa chỉ nhận hàng:</span>
                  <p className="text-ink-2">{initialOrder.shippingAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Truck className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <span className="font-semibold text-ink">Phương thức vận chuyển: </span>
                  <span>{initialOrder.shippingMethod === 'chilled_express' ? 'Xe lạnh (2–4h)' : 'Tiêu chuẩn'}</span>
                </div>
              </div>
            </div>

            {/* VAT Invoice Details */}
            {initialOrder.vatInvoiceRequested && (
              <div className="border-t border-line pt-3 space-y-1 bg-page p-3 rounded-md text-xs text-ink-2">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand" />
                  Yêu cầu hóa đơn GTGT (VAT)
                </span>
                <p>Công ty: <strong>{initialOrder.companyName}</strong></p>
                <p>MST: <strong className="font-mono">{initialOrder.taxCode}</strong></p>
              </div>
            )}
          </div>

          {/* Billing Breakdown */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 text-xs shadow-xs">
            <h3 className="text-sm font-bold text-ink border-b border-line pb-2.5">
              Tổng kết thanh toán
            </h3>

            <div className="space-y-2 text-ink-2">
              <div className="flex justify-between">
                <span>Tạm tính hàng:</span>
                <span className="tabular-nums font-medium text-ink">{formatPrice(initialOrder.subtotal)}</span>
              </div>

              {initialOrder.coldPackagingFee > 0 && (
                <div className="flex justify-between text-info">
                  <span>Phí đóng gói xe lạnh:</span>
                  <span className="tabular-nums font-medium">{formatPrice(initialOrder.coldPackagingFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="tabular-nums font-medium text-ink">{formatPrice(initialOrder.shippingFee)}</span>
              </div>

              {initialOrder.discountAmount > 0 && (
                <div className="flex justify-between text-ok">
                  <span>Khuyến mãi voucher:</span>
                  <span className="tabular-nums font-medium">-{formatPrice(initialOrder.discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-line pt-3 flex justify-between items-baseline font-bold text-ink">
              <span className="text-sm">Tổng cộng:</span>
              <Price price={initialOrder.totalAmount} size="lg" className="text-xl font-bold text-brand" />
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-ink-3">Thanh toán qua {initialOrder.paymentMethod.toUpperCase()}</span>
              <Badge variant="outline" className="text-xs text-ok border-ok/40">
                {initialOrder.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chưa thu tiền'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
