import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import {
  DAILY_SALES_7D,
  DAILY_SALES_30D,
  ORDER_STATUS_SUMMARY,
  TODAY_COLD_CHAIN_TRIPS,
} from '@/mocks/sales'
import { MOCK_ORDERS } from '@/mocks/orders'
import { PRODUCTS } from '@/data/products'
import { StatStrip, StatItem } from '@/components/admin/StatStrip'
import { formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  ShoppingBag,
  AlertTriangle,
  Snowflake,
  Truck,
  ArrowRight,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  useDocumentTitle('Tổng quan quản trị | Gia Hòa Phát Bakery Supply')

  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d')

  const chartData = timeRange === '7d' ? DAILY_SALES_7D : DAILY_SALES_30D

  const statItems: StatItem[] = [
    {
      id: 'stat-rev',
      label: 'Tổng doanh thu',
      value: formatPrice(43820000),
      subtext: '+14,2% so với kỳ trước',
      trend: 'up',
    },
    {
      id: 'stat-ord',
      label: 'Đơn hàng mới',
      value: '138 đơn',
      subtext: '+8,5% so với tuần trước',
      trend: 'up',
    },
    {
      id: 'stat-pending',
      label: 'Đơn cần xử lý ngay',
      value: '8 đơn',
      subtext: '4 đơn xe lạnh cần đóng đá gel',
      trend: 'warn',
    },
    {
      id: 'stat-stock',
      label: 'Cảnh báo kho & HSD',
      value: '5 cảnh báo',
      subtext: '3 lô còn dưới 30 ngày',
      trend: 'warn',
    },
  ]

  // Low stock products sample
  const lowStockItems = PRODUCTS.filter((p) => p.stockQty <= p.lowStockThreshold).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* 1. Header with Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-mono text-ink-3">SCR-A01 · TRANG QUẢN TRỊ TỔNG QUAN</span>
          <h1 className="text-2xl font-bold text-ink">
            Tổng quan hoạt động kinh doanh
          </h1>
          <p className="text-xs text-ink-3">
            Số liệu cập nhật theo thời gian thực từ 4 kho phân phối và hệ thống xe tải lạnh
          </p>
        </div>

        <div className="flex items-center gap-2 bg-page p-1 border border-line rounded-md text-xs">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              timeRange === '7d'
                ? 'bg-surface text-brand font-semibold shadow-xs border border-line'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            7 ngày qua
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
              timeRange === '30d'
                ? 'bg-surface text-brand font-semibold shadow-xs border border-line'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            30 ngày qua
          </button>
        </div>
      </div>

      {/* 2. Dải số liệu (StatStrip - 1 frame, divide-x) */}
      <StatStrip stats={statItems} />

      {/* 3. Row 2: Sales Column Chart (8/12) + Order Status List (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales by date chart (no gradient, single brand color #92400E, no animation) */}
        <div className="lg:col-span-8 border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink">
                Doanh thu bán hàng lẻ & sỉ
              </h2>
              <p className="text-xs text-ink-3">
                Biểu đồ doanh số theo từng mốc thời gian ({timeRange === '7d' ? 'Theo ngày' : 'Theo tuần'})
              </p>
            </div>
            <span className="text-xs font-semibold text-brand tabular-nums">
              {timeRange === '7d' ? 'TB: 6.2M/ngày' : 'TB: 34.2M/tuần'}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#E7E5E4' }}
                  tick={{ fill: '#78716C', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#E7E5E4' }}
                  tick={{ fill: '#78716C', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(231, 229, 228, 0.4)' }}
                  formatter={(value: any) => [formatPrice(Number(value) || 0), 'Doanh thu']}
                  labelFormatter={(lbl) => `Thời gian: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E7E5E4',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1C1917',
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#92400E"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-4 border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-ink">
              Đơn hàng theo trạng thái
            </h2>
            <p className="text-xs text-ink-3">
              Tổng số 47 đơn hàng đang trong luồng vận hành hôm nay
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {ORDER_STATUS_SUMMARY.map((st) => (
              <div key={st.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-2">{st.label}</span>
                  <span className="font-semibold text-ink tabular-nums">
                    {st.count} đơn ({st.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${st.colorClass}`}
                    style={{ width: `${st.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-line">
            <Button variant="outline" size="sm" asChild className="w-full text-xs">
              <Link to="/admin/don-hang">
                Quản lý danh sách đơn
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Row 3: Orders to process (left) + Inventory & Expiry warnings (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Pending / Action needed orders */}
        <div className="lg:col-span-7 border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand" />
                Đơn hàng cần xử lý gấp
              </h2>
              <p className="text-xs text-ink-3">
                Các đơn có hàng chuỗi lạnh và đơn khách sỉ cần xác nhận xuất kho
              </p>
            </div>
            <Link to="/admin/don-hang" className="text-xs text-brand hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="divide-y divide-line text-xs">
            {MOCK_ORDERS.slice(0, 3).map((order) => (
              <div key={order.orderNumber} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink text-sm">
                      #{order.orderNumber}
                    </span>
                    {order.requiresColdChain && (
                      <Badge variant="outline" className="text-xs text-info border-info/40 py-0 flex items-center gap-0.5">
                        <Snowflake className="w-2.5 h-2.5" />
                        Xe lạnh
                      </Badge>
                    )}
                  </div>
                  <p className="text-ink-2">
                    {order.customerName} · {order.customerPhone}
                  </p>
                  <p className="text-xs text-ink-3">
                    {order.items.length} món · {formatPrice(order.totalAmount)}
                  </p>
                </div>

                <Button size="sm" asChild className="h-8 text-xs">
                  <Link to={`/admin/don-hang/${order.orderNumber}`}>
                    Xử lý đơn
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock & Batch Expiry Warnings */}
        <div className="lg:col-span-5 border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warn" />
                Cảnh báo kho & hạn dùng
              </h2>
              <p className="text-xs text-ink-3">Sản phẩm sắp hết và lô hàng cận HSD</p>
            </div>
            <Link to="/admin/ton-kho" className="text-xs text-brand hover:underline font-medium">
              Xem kho FEFO
            </Link>
          </div>

          {/* Low stock items */}
          <div className="space-y-2 text-xs">
            <span className="text-xs font-semibold text-ink-3 block">
              Tồn kho thấp dưới ngưỡng
            </span>
            <div className="space-y-2">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-2.5 rounded-md bg-page border border-line flex items-center justify-between gap-2"
                >
                  <div className="truncate flex-1">
                    <span className="font-medium text-ink block truncate">{prod.name}</span>
                    <span className="text-xs text-ink-3 font-mono">SKU: {prod.sku}</span>
                  </div>
                  <span className="text-warn font-semibold tabular-nums text-xs shrink-0">
                    Còn {prod.stockQty} {prod.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry warning mock items */}
          <div className="space-y-2 text-xs pt-2 border-t border-line/60">
            <span className="text-xs font-semibold text-ink-3 block">
              Lô hàng sắp đến hạn (FEFO)
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-md bg-page border border-line flex items-center justify-between gap-2">
                <div>
                  <span className="font-medium text-ink block">Kem Tươi Whipping Tatua 1L</span>
                  <span className="text-xs text-ink-3 font-mono">LOT-TAT26-11B</span>
                </div>
                <Badge variant="outline" className="text-xs text-danger border-danger/40 py-0">
                  Còn 18 ngày (25/10)
                </Badge>
              </div>

              <div className="p-2.5 rounded-md bg-page border border-line flex items-center justify-between gap-2">
                <div>
                  <span className="font-medium text-ink block">Men Bánh Mì Instant Saf-Gold</span>
                  <span className="text-xs text-ink-3 font-mono">LOT-SAF-882</span>
                </div>
                <Badge variant="outline" className="text-xs text-warn border-warn/40 py-0">
                  Còn 28 ngày (05/11)
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Row 4: Today's Cold Chain Reefer Trips */}
      <div className="border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand" />
              Chuyến xe tải lạnh đang giao hôm nay
            </h2>
            <p className="text-xs text-ink-3">
              Giám sát hành trình và kiểm soát nhiệt độ thùng xe từ cảm biến GPS IoT
            </p>
          </div>
          <Link to="/admin/van-chuyen" className="text-xs text-brand hover:underline font-medium">
            Xem bản đồ chuỗi lạnh
          </Link>
        </div>

        <div className="border border-line rounded-md overflow-hidden bg-surface">
          <table className="w-full text-xs text-left">
            <thead className="bg-page text-ink-2 font-medium border-b border-line">
              <tr>
                <th className="py-2.5 px-3">Mã chuyến</th>
                <th className="py-2.5 px-3">Tài xế & Biển số</th>
                <th className="py-2.5 px-3">Tuyến giao</th>
                <th className="py-2.5 px-3">Số đơn</th>
                <th className="py-2.5 px-3">Nhiệt độ thùng</th>
                <th className="py-2.5 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TODAY_COLD_CHAIN_TRIPS.map((trip) => (
                <tr key={trip.id} className="hover:bg-page/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-brand">{trip.tripCode}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-ink block">{trip.driver}</span>
                    <span className="text-xs text-ink-3 font-mono">{trip.plate}</span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-2 max-w-xs truncate">{trip.route}</td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold">{trip.orderCount} đơn</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-info tabular-nums">{trip.tempNow.toFixed(1)}°C</span>
                    <span className="text-xs text-ok block">Đạt chuẩn 2–8°C</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className="text-xs text-ok border-ok/40">
                      {trip.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
