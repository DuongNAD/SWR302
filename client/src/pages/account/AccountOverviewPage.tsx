import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/context/AuthContext'
import { MOCK_ORDERS } from '@/mocks/orders'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Price, formatPrice } from '@/components/ui/price'
import { ORDER_STATUS_LABEL } from '@/lib/labels'
import {
  ShoppingBag,
  Award,
  CreditCard,
  MapPin,
  ArrowRight,
  Building2,
} from 'lucide-react'

export const AccountOverviewPage: React.FC = () => {
  useDocumentTitle('Tổng quan tài khoản | Gia Hòa Phát Bakery Supply')
  const { currentUser, role } = useAuth()

  const isWholesale = role === 'wholesale_client'
  const recentOrders = MOCK_ORDERS.filter(
    (o) => o.customerName === (currentUser?.name || 'Trần Mai Anh')
  ).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* 1. Header & Membership Card */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink">
              Xin chào, {currentUser?.name || 'Trần Mai Anh'}
            </h1>
            <p className="text-xs text-ink-3">
              {currentUser?.email || 'maianh.baker@gmail.com'} · {currentUser?.phone || '0912 345 678'}
            </p>
          </div>

          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 font-semibold ${
              isWholesale
                ? 'bg-brand-soft text-brand border-brand/40'
                : 'bg-page text-ink-2 border-line'
            }`}
          >
            {isWholesale ? 'Đại lý mua sỉ tiệm bánh' : 'Hội viên thân thiết (Hạng Vàng)'}
          </Badge>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-line/60">
          <div className="p-3.5 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-brand" />
              Điểm thưởng tích lũy
            </span>
            <div className="text-xl font-bold text-brand tabular-nums">
              1.250 điểm
            </div>
            <p className="text-xs text-ink-3">Quy đổi 125.000₫ cho đơn tiếp theo</p>
          </div>

          <div className="p-3.5 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 flex items-center gap-1.5 font-medium">
              <ShoppingBag className="w-3.5 h-3.5 text-brand" />
              Đơn hàng trong tháng
            </span>
            <div className="text-xl font-bold text-ink tabular-nums">
              {MOCK_ORDERS.length} đơn
            </div>
            <p className="text-xs text-ink-3">1 đơn đang trên xe lạnh</p>
          </div>

          <div className="p-3.5 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 flex items-center gap-1.5 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-brand" />
              Chi tiêu tích lũy 2026
            </span>
            <div className="text-xl font-bold text-ink tabular-nums">
              {formatPrice(1012000)}
            </div>
            <p className="text-xs text-ink-3">Đạt mốc chiết khấu cấp 2</p>
          </div>
        </div>
      </div>

      {/* 2. Recent Orders Section */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-base font-semibold text-ink flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-brand" />
            Đơn hàng gần đây
          </h2>
          <Button variant="ghost" size="sm" asChild className="text-xs text-brand hover:bg-brand-soft">
            <Link to="/tai-khoan/don-hang">
              Xem tất cả đơn
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="divide-y divide-line text-xs">
          {recentOrders.map((order) => (
            <div key={order.orderNumber} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1 max-w-sm">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/don-hang/${order.orderNumber}`}
                    className="font-mono font-bold text-ink hover:text-brand transition-colors text-sm"
                  >
                    #{order.orderNumber}
                  </Link>
                  {order.status === 'shipping' ? (
                    <Badge variant="default" className="bg-brand text-white text-xs py-0">
                      Đang vận chuyển
                    </Badge>
                  ) : order.status === 'delivered' ? (
                    <Badge variant="outline" className="text-ok border-ok/40 text-xs py-0">
                      Đã hoàn tất
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs py-0">
                      {ORDER_STATUS_LABEL[order.status] || order.status}
                    </Badge>
                  )}
                </div>
                <p className="text-ink-3 text-xs">
                  {order.createdAt} · {order.items.length} sản phẩm ({order.items.map((i) => i.productName).join(', ')})
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-ink-3 block">Tổng thanh toán:</span>
                  <Price price={order.totalAmount} size="sm" className="font-bold text-ink" />
                </div>

                <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                  <Link to={`/don-hang/${order.orderNumber}`}>
                    Theo dõi
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Address & Business Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Address */}
        <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand" />
              Địa chỉ nhận hàng mặc định
            </h3>
            <Link to="/tai-khoan/dia-chi" className="text-xs text-brand hover:underline">
              Quản lý sổ địa chỉ
            </Link>
          </div>

          <div className="text-xs space-y-1 text-ink-2">
            <p className="font-semibold text-ink">
              {currentUser?.name || 'Trần Mai Anh'} · {currentUser?.phone || '0912 345 678'}
            </p>
            <p className="text-ink-3 leading-relaxed">
              {currentUser?.addresses[0]?.address || 'Số 42 Ngõ 178 Tây Sơn, Đống Đa, Hà Nội'}
            </p>
          </div>
        </div>

        {/* Business or Support Note */}
        <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand" />
              {isWholesale ? 'Hồ sơ đại lý tiệm bánh' : 'Hỗ trợ khách hàng'}
            </h3>
            <Link to={isWholesale ? '/tai-khoan/doanh-nghiep' : '/ho-tro'} className="text-xs text-brand hover:underline">
              {isWholesale ? 'Xem hồ sơ' : 'Trung tâm hỗ trợ'}
            </Link>
          </div>

          <div className="text-xs space-y-1 text-ink-2">
            {isWholesale ? (
              <>
                <p className="font-semibold text-ink">Công ty TNHH Bánh Ngọt Tiệm Vàng</p>
                <p className="text-ink-3">MST: 0108892345 · Hạn mức công nợ 50.000.000₫</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-ink">Tổng đài chăm sóc khách hàng</p>
                <p className="text-ink-3">Hotline: 1900 6899 (08:00 – 21:00 hàng ngày)</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
