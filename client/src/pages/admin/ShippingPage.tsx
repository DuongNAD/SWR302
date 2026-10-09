import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import {
  MOCK_REEFER_TRIPS,
  MOCK_TEMP_LOGS,
  SHIPPING_POLICY_CONSTANTS,
  ReeferTrip,
  TempLogEntry,
} from '@/mocks/shipments'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice } from '@/components/ui/price'
import {
  Snowflake,
  Truck,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Package,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const AdminShippingPage: React.FC = () => {
  useDocumentTitle('Vận chuyển và chuỗi lạnh | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'trips' | 'telemetry' | 'policy'>('trips')
  const [trips] = useState<ReeferTrip[]>(MOCK_REEFER_TRIPS)
  const [logs] = useState<TempLogEntry[]>(MOCK_TEMP_LOGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const q = searchQuery.toLowerCase().trim()
      if (
        q &&
        !t.tripCode.toLowerCase().includes(q) &&
        !t.driverName.toLowerCase().includes(q) &&
        !t.plateNumber.toLowerCase().includes(q) &&
        !t.area.toLowerCase().includes(q)
      ) {
        return false
      }
      return true
    })
  }, [trips, searchQuery])

  // Filtered telemetry logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const q = searchQuery.toLowerCase().trim()
      if (q && !l.tripCode.toLowerCase().includes(q) && !l.sensorId.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [logs, searchQuery])

  // Chart data for temperature timeline
  const chartData = [
    { time: '13:00', temp1: 2.8, temp4: 4.5 },
    { time: '13:30', temp1: 3.1, temp4: 5.8 },
    { time: '14:00', temp1: 3.5, temp4: 7.2 },
    { time: '14:15', temp1: 3.8, temp4: 8.6 }, // Peak alert
    { time: '14:45', temp1: 3.6, temp4: 7.9 },
    { time: '15:10', temp1: 3.2, temp4: 6.4 },
  ]

  // Columns for Trips table
  const tripColumns: ColumnDef<ReeferTrip>[] = [
    {
      header: 'Mã chuyến',
      cell: (item) => (
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-xs text-brand">{item.tripCode}</span>
          <div className="text-xs text-ink-3 tabular-nums">{item.departureTime}</div>
        </div>
      ),
    },
    {
      header: 'Tài xế và biển số',
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="font-medium text-ink flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-ink-2" />
            {item.driverName}
          </div>
          <div className="text-xs text-ink-3 flex items-center gap-2">
            <span className="font-mono">{item.plateNumber}</span>
            <span>•</span>
            <span className="font-mono tabular-nums">{item.driverPhone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Số đơn',
      className: 'text-center',
      cell: (item) => (
        <span className="font-semibold text-ink tabular-nums">{item.ordersCount} đơn</span>
      ),
    },
    {
      header: 'Khu vực giao',
      cell: (item) => (
        <span className="text-xs text-ink-2 max-w-xs truncate block" title={item.area}>
          {item.area}
        </span>
      ),
    },
    {
      header: 'Nhiệt độ thùng (°C)',
      cell: (item) => {
        const isExceeded = item.currentTemp > 8.0
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Thermometer
                className={`w-3.5 h-3.5 ${isExceeded ? 'text-danger' : 'text-ok'}`}
              />
              <span
                className={`font-mono font-bold text-xs tabular-nums ${
                  isExceeded ? 'text-danger bg-danger-soft px-1.5 py-0.5 rounded font-black' : 'text-ink'
                }`}
              >
                {item.currentTemp.toFixed(1)}°C
              </span>
              {isExceeded && (
                <span className="text-xs font-bold text-danger">
                  Vượt ngưỡng
                </span>
              )}
            </div>
            <div className="text-xs text-ink-3 tabular-nums">
              Dải đo: {item.minTemp.toFixed(1)}°C – {item.maxTemp.toFixed(1)}°C
            </div>
          </div>
        )
      },
    },
    {
      header: 'Trạng thái',
      cell: (item) => {
        if (item.status === 'incident' || item.currentTemp > 8) {
          return (
            <Badge variant="outline" className="border-danger/40 text-danger bg-danger-soft text-xs gap-1">
              <AlertTriangle className="w-3 h-3" />
              Cảnh báo nhiệt
            </Badge>
          )
        }
        if (item.status === 'delivering') {
          return (
            <Badge variant="outline" className="border-info/40 text-info bg-info-soft text-xs gap-1">
              <Clock className="w-3 h-3" />
              Đang giao
            </Badge>
          )
        }
        if (item.status === 'departed') {
          return (
            <Badge variant="outline" className="border-brand/40 text-brand bg-brand-soft text-xs gap-1">
              <Truck className="w-3 h-3" />
              Đã xuất bến
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="border-ok/40 text-ok bg-ok-soft text-xs gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Hoàn tất
          </Badge>
        )
      },
    },
    {
      header: 'Thao tác',
      sticky: 'right',
      className: 'w-[100px] min-w-[100px] text-right',
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            showToast({
              message: `Đang kết nối GPS thùng lạnh xe ${item.plateNumber} (Nhiệt độ: ${item.currentTemp}°C)`,
              type: item.currentTemp > 8 ? 'error' : 'info',
            })
          }
          className="h-7 text-xs px-2.5 text-ink-2 hover:text-brand"
        >
          Định vị GPS
        </Button>
      ),
    },
  ]

  // Columns for Telemetry table
  const telemetryColumns: ColumnDef<TempLogEntry>[] = [
    {
      header: 'Thời gian',
      cell: (item) => <span className="font-mono text-xs tabular-nums text-ink">{item.time}</span>,
    },
    {
      header: 'Mã chuyến xe',
      cell: (item) => <span className="font-mono font-bold text-xs text-brand">{item.tripCode}</span>,
    },
    {
      header: 'Mã cảm biến IoT',
      cell: (item) => <span className="font-mono text-xs text-ink-3">{item.sensorId}</span>,
    },
    {
      header: 'Nhiệt độ ghi nhận',
      cell: (item) => {
        const isBad = item.temperature > 8.0
        return (
          <span
            className={`font-mono text-xs font-semibold tabular-nums ${
              isBad ? 'text-danger bg-danger-soft px-1.5 py-0.5 rounded' : 'text-ink'
            }`}
          >
            {item.temperature.toFixed(1)}°C
          </span>
        )
      },
    },
    {
      header: 'Độ ẩm (%)',
      cell: (item) => <span className="font-mono text-xs tabular-nums text-ink-2">{item.humidity}%</span>,
    },
    {
      header: 'Đánh giá an toàn',
      cell: (item) => {
        if (item.status === 'critical' || item.temperature > 8.0) {
          return (
            <Badge variant="outline" className="border-danger/40 text-danger bg-danger-soft text-xs gap-1">
              <AlertTriangle className="w-3 h-3" />
              Nguy hiểm (&gt;8°C)
            </Badge>
          )
        }
        if (item.status === 'warning') {
          return (
            <Badge variant="outline" className="border-warn/40 text-warn bg-warn-soft text-xs">
              Cảnh báo dao động
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="border-ok/40 text-ok bg-ok-soft text-xs">
            Đạt chuẩn 2–8°C
          </Badge>
        )
      },
    },
    {
      header: 'Ghi chú vận hành',
      cell: (item) => <span className="text-xs text-ink-3">{item.note || 'Hoạt động bình thường'}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-brand" />
            Vận chuyển và giám sát chuỗi lạnh
          </h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Theo dõi nhiệt độ thùng xe lạnh theo thời gian thực (cảm biến IoT), quản lý lộ trình xe và biểu phí
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-line">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as any)
            setCurrentPage(1)
          }}
          className="w-full"
        >
          <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
            <TabsTrigger
              value="trips"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              Chuyến giao hôm nay ({trips.length})
            </TabsTrigger>
            <TabsTrigger
              value="telemetry"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold flex items-center gap-1.5"
            >
              <Thermometer className="w-3.5 h-3.5" />
              Nhật ký nhiệt độ IoT
            </TabsTrigger>
            <TabsTrigger
              value="policy"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              Biểu phí và ngưỡng miễn phí
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Trips Table */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={(v) => {
              setSearchQuery(v)
              setCurrentPage(1)
            }}
            searchPlaceholder="Tìm mã chuyến, tài xế, biển số, khu vực..."
            onExportCsv={() => showToast({ message: 'Đang xuất báo cáo chuyến xe lạnh ra CSV...', type: 'info' })}
            hasActiveFilters={Boolean(searchQuery)}
            onResetFilters={() => setSearchQuery('')}
          />

          <DataTable
            data={filteredTrips}
            columns={tripColumns}
            keyExtractor={(item) => item.id}
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredTrips.length / pageSize))}
            onPageChange={setCurrentPage}
            totalCount={filteredTrips.length}
            pageSize={pageSize}
            emptyMessage="Không tìm thấy chuyến xe nào"
          />
        </div>
      )}

      {/* Tab 2: Telemetry Log & Chart */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          {/* Chart Section */}
          <div className="p-4 bg-surface border border-line rounded-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-brand" />
                  Biểu đồ diễn biến nhiệt độ thùng xe theo thời gian (08/10/2026)
                </h2>
                <p className="text-xs text-ink-3">
                  Ngưỡng chuẩn an toàn: 2.0°C – 8.0°C • Điểm đỏ thể hiện chuyến CH-2610-04 bị quá nhiệt lúc 14:15
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-ink-2">
                  <span className="w-3 h-0.5 bg-brand inline-block" /> Chuyến CH-2610-01 (Chuẩn)
                </span>
                <span className="flex items-center gap-1.5 text-danger font-medium">
                  <span className="w-3 h-0.5 bg-danger inline-block" /> Chuyến CH-2610-04 (Cảnh báo)
                </span>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#78716C' }} />
                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fontSize: 11, fill: '#78716C' }}
                    unit="°C"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E7E5E4',
                      borderRadius: '6px',
                      fontSize: '11px',
                    }}
                    formatter={(value: any) => [`${value}°C`, 'Nhiệt độ']}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp1"
                    name="CH-2610-01"
                    stroke="#92400E"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#92400E' }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp4"
                    name="CH-2610-04"
                    stroke="#DC2626"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#DC2626' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Telemetry Data Table */}
          <DataTable
            data={filteredLogs}
            columns={telemetryColumns}
            keyExtractor={(item) => item.id}
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredLogs.length / pageSize))}
            onPageChange={setCurrentPage}
            totalCount={filteredLogs.length}
            pageSize={pageSize}
            emptyMessage="Không có dữ liệu telemetry"
          />
        </div>
      )}

      {/* Tab 3: Policy & Fee Thresholds */}
      {activeTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface border border-line rounded-lg space-y-3">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand" />
              Biểu phí vận chuyển cơ bản
            </h2>
            <div className="space-y-2 text-xs divide-y divide-line">
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Giao hàng tiêu chuẩn (nguyên liệu khô):</span>
                <strong className="text-ink font-mono tabular-nums">
                  {formatPrice(SHIPPING_POLICY_CONSTANTS.standardDeliveryFee)}
                </strong>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Giao hàng xe lạnh chuyên dụng (2–8°C):</span>
                <strong className="text-brand font-mono tabular-nums">
                  {formatPrice(SHIPPING_POLICY_CONSTANTS.chilledDeliveryFee)}
                </strong>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Ngưỡng miễn phí vận chuyển toàn bộ đơn:</span>
                <strong className="text-ok font-mono tabular-nums">
                  Từ {formatPrice(SHIPPING_POLICY_CONSTANTS.freeShippingThreshold)}
                </strong>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface border border-line rounded-lg space-y-3">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <Package className="w-4 h-4 text-brand" />
              Phí đóng gói bảo ôn hàng lạnh
            </h2>
            <div className="space-y-2 text-xs divide-y divide-line">
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Phí thùng xốp bảo ôn + túi đá gel chuyên dụng:</span>
                <strong className="text-ink font-mono tabular-nums">
                  {formatPrice(SHIPPING_POLICY_CONSTANTS.coldPackagingFee)}
                </strong>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Ngưỡng miễn phí tiền đóng gói lạnh:</span>
                <strong className="text-ok font-mono tabular-nums">
                  Từ {formatPrice(SHIPPING_POLICY_CONSTANTS.freeColdPackagingThreshold)}
                </strong>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-ink-2">Quy chuẩn nhiệt độ kiểm soát:</span>
                <strong className="text-ink font-mono tabular-nums">
                  {SHIPPING_POLICY_CONSTANTS.safeTempRangeMin}°C – {SHIPPING_POLICY_CONSTANTS.safeTempRangeMax}°C
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
