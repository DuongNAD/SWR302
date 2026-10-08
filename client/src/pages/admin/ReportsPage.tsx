import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { DAILY_SALES_7D, DAILY_SALES_30D } from '@/mocks/sales'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Price, formatPrice } from '@/components/ui/price'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  Download,
  Calendar,
  Users,
  Building2,
  DollarSign,
  ShoppingBag,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface TopProduct {
  rank: number
  id: string
  name: string
  sku: string
  category: string
  unitsSold: number
  revenue: number
  maxSold: number
}

const TOP_PRODUCTS: TopProduct[] = [
  { rank: 1, id: 'p1', name: 'Bơ Lạt Tự Nhiên Anchor Unsalted Butter 227g', sku: 'GHP-BUTTER-ANC227', category: 'Bơ & Phô mai', unitsSold: 840, revenue: 65520000, maxSold: 1250 },
  { rank: 2, id: 'p2', name: 'Kem Tươi Whipping Cream Tatua 1L', sku: 'GHP-WHIP-TAT1L', category: 'Kem & Sữa', unitsSold: 420, revenue: 59640000, maxSold: 1250 },
  { rank: 3, id: 'p3', name: 'Bột Mì Hoa Ngọc Lan Số 11 Đa Dụng 1kg', sku: 'GHP-FLOUR-HNL1K', category: 'Bột các loại', unitsSold: 1250, revenue: 30000000, maxSold: 1250 },
  { rank: 4, id: 'p4', name: 'Phô Mai Kem Mascarpone Tatua New Zealand 500g', sku: 'GHP-CHEE-MASC500', category: 'Bơ & Phô mai', unitsSold: 210, revenue: 24150000, maxSold: 1250 },
  { rank: 5, id: 'p5', name: 'Sô Cô La Đen Nguyên Chất Callebaut 54.5% Callets 1kg', sku: 'GHP-CHOC-CAL545', category: 'Sô cô la & Cacao', unitsSold: 65, revenue: 22425000, maxSold: 1250 },
  { rank: 6, id: 'p6', name: 'Men Nở Khô Ngọt Saf-Instant Vàng 500g', sku: 'GHP-YEAST-SAF500', category: 'Phụ gia & Men nở', unitsSold: 180, revenue: 15300000, maxSold: 1250 },
  { rank: 7, id: 'p7', name: 'Bột Trộn Bánh Bông Lan Puratos Tegral Sponge 1kg', sku: 'GHP-MIX-SPON1K', category: 'Bột các loại', unitsSold: 140, revenue: 6860000, maxSold: 1250 },
  { rank: 8, id: 'p8', name: 'Bột Hạnh Nhân Mỹ Nguyên Chất Blue Diamond 500g', sku: 'GHP-NUTS-ALM500', category: 'Hạt dinh dưỡng', unitsSold: 45, revenue: 7875000, maxSold: 1250 },
  { rank: 9, id: 'p9', name: "Tinh Mùi Vani Rayner's Chiết Xuất Tự Nhiên 28ml", sku: 'GHP-FLAV-VAN28', category: 'Hương liệu & Tinh dầu', unitsSold: 85, revenue: 4080000, maxSold: 1250 },
  { rank: 10, id: 'p10', name: 'Đường Bột Làm Bánh Biên Hòa Pure Icing Sugar 500g', sku: 'GHP-SUGAR-IC500', category: 'Đường & Siro', unitsSold: 160, revenue: 3840000, maxSold: 1250 },
]

interface TopCustomer {
  rank: number
  id: string
  name: string
  company?: string
  type: 'retail' | 'wholesale'
  ordersCount: number
  revenue: number
}

const TOP_CUSTOMERS: TopCustomer[] = [
  { rank: 1, id: 'c1', name: 'Đỗ Văn Nam', company: 'Công ty Cổ phần Bánh Kẹo Hoàng Kim', type: 'wholesale', ordersCount: 31, revenue: 86300000 },
  { rank: 2, id: 'c2', name: 'Lê Hoàng Tuấn', company: 'Công ty Cổ phần Tiệm Bánh Dolce Sài Gòn', type: 'wholesale', ordersCount: 22, revenue: 45200000 },
  { rank: 3, id: 'c3', name: 'Trần Mai Anh', company: 'Công ty TNHH Bánh Ngọt Tiệm Vàng', type: 'wholesale', ordersCount: 14, revenue: 18450000 },
  { rank: 4, id: 'c4', name: 'Nguyễn Thảo My', company: 'Hộ Kinh Doanh Tiệm Bánh Mơ Màng', type: 'wholesale', ordersCount: 8, revenue: 14250000 },
  { rank: 5, id: 'c5', name: 'Vũ Hải Yến', type: 'retail', ordersCount: 6, revenue: 2840000 },
  { rank: 6, id: 'c6', name: 'Nguyễn Minh Khoa', type: 'retail', ordersCount: 5, revenue: 3120000 },
  { rank: 7, id: 'c7', name: 'Đặng Thu Trang', type: 'retail', ordersCount: 4, revenue: 1950000 },
]

export const AdminReportsPage: React.FC = () => {
  useDocumentTitle('Báo cáo thống kê | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'revenue' | 'products' | 'customers'>('revenue')
  const [dateRange, setDateRange] = useState<'7d' | '30d'>('7d')

  const salesData = dateRange === '7d' ? DAILY_SALES_7D : DAILY_SALES_30D

  // Total summary
  const totalRevenue = useMemo(() => {
    return salesData.reduce((acc, cur) => acc + cur.revenue, 0)
  }, [salesData])

  const totalOrders = useMemo(() => {
    return salesData.reduce((acc, cur) => acc + cur.ordersCount, 0)
  }, [salesData])

  const averageOrderValue = Math.round(totalRevenue / Math.max(1, totalOrders))

  // Product Table columns
  const productColumns: ColumnDef<TopProduct>[] = [
    {
      header: 'Hạng',
      cell: (item) => <span className="font-bold text-xs tabular-nums text-ink">{item.rank}</span>,
    },
    {
      header: 'Tên sản phẩm',
      cell: (item) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-ink">{item.name}</span>
          <div className="text-xs text-ink-3 flex items-center gap-2">
            <span className="font-mono">{item.sku}</span>
            <span>•</span>
            <span>{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Số lượng đã bán',
      cell: (item) => {
        const pct = Math.round((item.unitsSold / item.maxSold) * 100)
        return (
          <div className="space-y-1 min-w-[120px]">
            <span className="text-xs font-semibold tabular-nums text-ink">{item.unitsSold} đơn vị</span>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Doanh thu đem lại',
      className: 'text-right',
      cell: (item) => (
        <div className="text-right">
          <Price price={item.revenue} className="font-semibold text-xs tabular-nums text-ink" />
        </div>
      ),
    },
  ]

  // Customer Table columns
  const customerColumns: ColumnDef<TopCustomer>[] = [
    {
      header: 'Hạng',
      cell: (item) => <span className="font-bold text-xs tabular-nums text-ink">{item.rank}</span>,
    },
    {
      header: 'Khách hàng',
      cell: (item) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-xs text-ink">{item.name}</span>
          {item.company && (
            <div className="text-xs text-ink-3 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-brand" />
              <span>{item.company}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Loại khách',
      cell: (item) => (
        item.type === 'wholesale' ? (
          <span className="text-xs font-semibold text-brand bg-brand-soft border border-brand/30 px-1.5 py-0.5 rounded">
            Khách sỉ / B2B
          </span>
        ) : (
          <span className="text-xs text-ink-2 bg-page border border-line px-1.5 py-0.5 rounded">
            Khách lẻ
          </span>
        )
      ),
    },
    {
      header: 'Số đơn đã đặt',
      className: 'text-center',
      cell: (item) => (
        <span className="font-semibold text-ink tabular-nums">{item.ordersCount} đơn</span>
      ),
    },
    {
      header: 'Tổng tiền mua hàng',
      className: 'text-right',
      cell: (item) => (
        <div className="text-right">
          <Price price={item.revenue} className="font-bold text-xs tabular-nums text-ink" />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            Báo cáo & Phân tích số liệu
          </h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Báo cáo doanh số bán hàng, danh sách sản phẩm dẫn đầu và phân bổ khách hàng lẻ / sỉ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="flex items-center bg-surface border border-line rounded-md p-0.5 text-xs">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                dateRange === '7d' ? 'bg-brand text-brand-contrast' : 'text-ink-2 hover:text-ink'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                dateRange === '30d' ? 'bg-brand text-brand-contrast' : 'text-ink-2 hover:text-ink'
              }`}
            >
              30 ngày qua
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast({ message: 'Đang xuất báo cáo tài chính sang định dạng CSV...', type: 'info' })}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Dải số liệu tổng hợp (1 khung, 3 ô divide-x) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-surface border border-line rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-line shadow-xs">
        <div className="p-4 space-y-1">
          <span className="text-xs text-ink-2 font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-brand" />
            Tổng doanh thu
          </span>
          <div className="text-xl font-bold text-ink tabular-nums">
            {formatPrice(totalRevenue)}
          </div>
          <p className="text-xs text-ok flex items-center gap-1">
            <span>↑ 12.5%</span> so với kỳ trước
          </p>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-xs text-ink-2 font-medium flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-brand" />
            Tổng đơn hàng
          </span>
          <div className="text-xl font-bold text-ink tabular-nums">
            {totalOrders} đơn
          </div>
          <p className="text-xs text-ok flex items-center gap-1">
            <span>↑ 8.2%</span> số lượng đặt mua
          </p>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-xs text-ink-2 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-brand" />
            Giá trị trung bình / đơn
          </span>
          <div className="text-xl font-bold text-ink tabular-nums">
            {formatPrice(averageOrderValue)}
          </div>
          <p className="text-xs text-ink-3">
            Tăng nhờ tỷ trọng đơn mua sỉ
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-full"
        >
          <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
            <TabsTrigger
              value="revenue"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Doanh thu theo mốc thời gian
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Top 10 sản phẩm bán chạy
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Phân khúc khách hàng (Lẻ / Sỉ)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Revenue Chart & Table */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <div className="p-4 bg-surface border border-line rounded-lg space-y-3">
            <h2 className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand" />
              Doanh thu ({dateRange === '7d' ? '7 ngày qua' : '30 ngày qua'})
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716C' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#78716C' }}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Tr`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E7E5E4',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [formatPrice(Number(val)), 'Doanh thu']}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#92400E"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-line rounded-lg overflow-x-auto bg-surface">
            <table className="w-full text-xs">
              <thead className="bg-page border-b border-line text-ink-2 font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5 text-left">Thời gian</th>
                  <th className="py-2.5 px-3.5 text-center">Số đơn phát sinh</th>
                  <th className="py-2.5 px-3.5 text-right">Doanh thu đạt được</th>
                  <th className="py-2.5 px-3.5 text-right">Giá trị trung bình/đơn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {salesData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-page/50 h-10">
                    <td className="py-2 px-3.5 font-medium text-ink tabular-nums">{row.date}</td>
                    <td className="py-2 px-3.5 text-center tabular-nums text-ink">{row.ordersCount} đơn</td>
                    <td className="py-2 px-3.5 text-right font-semibold tabular-nums text-ink">
                      {formatPrice(row.revenue)}
                    </td>
                    <td className="py-2 px-3.5 text-right tabular-nums text-ink-2">
                      {formatPrice(Math.round(row.revenue / row.ordersCount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Top Products */}
      {activeTab === 'products' && (
        <DataTable
          data={TOP_PRODUCTS}
          columns={productColumns}
          keyExtractor={(item) => item.id}
          totalPages={1}
          totalCount={TOP_PRODUCTS.length}
        />
      )}

      {/* Tab 3: Customer Segments */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface border border-line rounded-lg space-y-3">
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                Cơ cấu doanh thu theo loại khách hàng
              </h2>
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-brand flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Khách mua sỉ / Tiệm bánh B2B
                    </span>
                    <span className="font-bold text-ink tabular-nums">68% (103.700.000₫)</span>
                  </div>
                  <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: '68%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-ink-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Khách hàng cá nhân / Bán lẻ
                    </span>
                    <span className="font-bold text-ink tabular-nums">32% (48.801.000₫)</span>
                  </div>
                  <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-stone-400" style={{ width: '32%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface border border-line rounded-lg space-y-2 text-xs">
              <h2 className="text-sm font-bold text-ink">Đặc điểm hành vi mua sắm</h2>
              <ul className="space-y-1.5 text-ink-2 list-disc list-inside pt-1">
                <li>Khách sỉ có tần suất đặt lại 2 tuần/lần, giá trị trung bình đơn 4.500.000₫.</li>
                <li>82% đơn sỉ yêu cầu xuất hóa đơn điện tử VAT và giao bằng xe đông lạnh.</li>
                <li>Khách lẻ chủ yếu tập trung vào các mặt hàng bơ gói nhỏ 227g, bột mì và phụ gia làm bánh tại gia.</li>
              </ul>
            </div>
          </div>

          <DataTable
            data={TOP_CUSTOMERS}
            columns={customerColumns}
            keyExtractor={(item) => item.id}
            totalPages={1}
            totalCount={TOP_CUSTOMERS.length}
          />
        </div>
      )}
    </div>
  )
}
