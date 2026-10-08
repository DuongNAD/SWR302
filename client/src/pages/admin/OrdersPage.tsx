import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { MOCK_ORDERS } from '@/mocks/orders'
import { Order } from '@/types'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Snowflake, Eye, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminOrdersPage: React.FC = () => {
  useDocumentTitle('Quản lý đơn hàng | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [shippingFilter, setShippingFilter] = useState<'all' | 'chilled_express' | 'standard'>('all')
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])

  // Status counts for tab labels
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      packing: orders.filter((o) => o.status === 'packing').length,
      shipping: orders.filter((o) => o.status === 'shipping').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    }
    return counts
  }, [orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab status match
      const matchesTab = selectedStatusTab === 'all' || order.status === selectedStatusTab

      // Search match
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q)

      // Shipping filter match
      const matchesShipping =
        shippingFilter === 'all' || order.shippingMethod === shippingFilter

      return matchesTab && matchesSearch && matchesShipping
    })
  }, [orders, selectedStatusTab, searchQuery, shippingFilter])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id))
    } else {
      setSelectedOrderIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds((prev) => [...prev, id])
    } else {
      setSelectedOrderIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // Batch actions
  const handleBatchConfirm = () => {
    setOrders((prev) =>
      prev.map((o) => (selectedOrderIds.includes(o.id) ? { ...o, status: 'confirmed' } : o))
    )
    showToast({
      type: 'success',
      message: `Đã xác nhận ${selectedOrderIds.length} đơn hàng được chọn.`,
    })
    setSelectedOrderIds([])
  }

  const handleExportCsv = () => {
    showToast({
      type: 'success',
      message: `Đang xuất danh sách ${filteredOrders.length} đơn hàng ra tệp CSV...`,
    })
  }

  // Column definitions for DataTable
  const columns: ColumnDef<Order>[] = [
    {
      header: (
        <Checkbox
          checked={
            filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length
          }
          onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
          aria-label="Chọn tất cả đơn"
        />
      ),
      className: 'w-10 text-center',
      cell: (order) => (
        <Checkbox
          checked={selectedOrderIds.includes(order.id)}
          onCheckedChange={(checked) => handleSelectRow(order.id, Boolean(checked))}
          aria-label={`Chọn đơn ${order.orderNumber}`}
        />
      ),
    },
    {
      header: 'Mã đơn',
      className: 'w-32',
      cell: (order) => (
        <Link
          to={`/admin/don-hang/${order.orderNumber}`}
          className="font-mono font-bold text-brand hover:underline"
        >
          #{order.orderNumber}
        </Link>
      ),
    },
    {
      header: 'Khách hàng',
      cell: (order) => (
        <div className="space-y-0.5">
          <p className="font-semibold text-ink">{order.customerName}</p>
          <p className="text-xs text-ink-3">{order.customerPhone}</p>
        </div>
      ),
    },
    {
      header: 'Thời gian đặt',
      cell: (order) => (
        <span className="text-xs text-ink-3 tabular-nums">{order.createdAt}</span>
      ),
    },
    {
      header: 'Sản phẩm',
      cell: (order) => (
        <div className="space-y-0.5 max-w-[200px] truncate">
          <span className="font-medium text-ink">{order.items.length} món</span>
          <p className="text-xs text-ink-3 truncate">
            {order.items.map((i) => i.productName).join(', ')}
          </p>
        </div>
      ),
    },
    {
      header: 'Vận chuyển',
      cell: (order) => (
        <div>
          {order.shippingMethod === 'chilled_express' ? (
            <span className="text-info font-medium flex items-center gap-1 text-xs">
              <Snowflake className="w-3 h-3" />
              Xe lạnh (2–8°C)
            </span>
          ) : (
            <span className="text-ink-2 text-xs">Tiêu chuẩn</span>
          )}
        </div>
      ),
    },
    {
      header: 'Thanh toán',
      cell: (order) => (
        <div className="space-y-0.5">
          <span className="text-xs text-ink font-medium">
            {order.paymentMethod}
          </span>
          <span className="block text-xs text-ink-3">
            {order.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chưa thu (COD)'}
          </span>
        </div>
      ),
    },
    {
      header: <span className="block text-right">Tổng tiền</span>,
      className: 'text-right',
      cell: (order) => (
        <span className="font-bold text-ink tabular-nums">
          {formatPrice(order.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      cell: (order) => {
        switch (order.status) {
          case 'delivered':
            return <Badge variant="outline" className="text-ok border-ok/40 text-xs">Hoàn tất</Badge>
          case 'shipping':
            return <Badge variant="default" className="bg-brand text-white text-xs">Đang giao</Badge>
          case 'packing':
            return <Badge variant="secondary" className="bg-sky-50 text-sky-800 text-xs">Đóng gói</Badge>
          case 'confirmed':
            return <Badge variant="secondary" className="bg-amber-100 text-amber-900 text-xs">Đã xác nhận</Badge>
          case 'cancelled':
            return <Badge variant="destructive" className="text-xs">Đã hủy</Badge>
          default:
            return <Badge variant="outline" className="text-xs">Chờ duyệt</Badge>
        }
      },
    },
    {
      header: '',
      className: 'w-16 text-right',
      cell: (order) => (
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link to={`/admin/don-hang/${order.orderNumber}`} title="Xem chi tiết đơn">
            <Eye className="w-3.5 h-3.5 text-ink-2" />
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-mono text-ink-3">SCR-A02 · QUẢN LÝ ĐƠN HÀNG</span>
          <h1 className="text-2xl font-bold text-ink">
            Danh sách đơn hàng
          </h1>
          <p className="text-xs text-ink-3">
            Theo dõi luồng xử lý đơn, xác nhận xuất kho và điều phối xe tải lạnh
          </p>
        </div>
      </div>

      {/* 2. Status Filter Tabs with Counts */}
      <Tabs value={selectedStatusTab} onValueChange={setSelectedStatusTab}>
        <TabsList className="bg-surface border border-line flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all">Tất cả ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="confirmed">Đã duyệt ({statusCounts.confirmed})</TabsTrigger>
          <TabsTrigger value="packing">Đóng gói ({statusCounts.packing})</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao ({statusCounts.shipping})</TabsTrigger>
          <TabsTrigger value="delivered">Hoàn tất ({statusCounts.delivered})</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy ({statusCounts.cancelled})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 3. DataTable Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm mã đơn, tên khách, số điện thoại..."
        filterSlot={
          <select
            value={shippingFilter}
            onChange={(e) => setShippingFilter(e.target.value as any)}
            className="h-9 rounded-md border border-line bg-surface px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="all">Tất cả vận chuyển</option>
            <option value="chilled_express">Xe lạnh (2–8°C)</option>
            <option value="standard">Giao tiêu chuẩn</option>
          </select>
        }
        onExportCsv={handleExportCsv}
        hasActiveFilters={searchQuery !== '' || shippingFilter !== 'all'}
        onResetFilters={() => {
          setSearchQuery('')
          setShippingFilter('all')
        }}
      />

      {/* Batch Action Bar if items selected */}
      {selectedOrderIds.length > 0 && (
        <div className="p-3 rounded-md bg-brand-soft border border-brand/40 flex items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-brand">
            Đã chọn {selectedOrderIds.length} đơn hàng
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleBatchConfirm}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Duyệt các đơn đã chọn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrderIds([])}
            >
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* 4. Main DataTable */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        keyExtractor={(item) => item.id}
        totalCount={filteredOrders.length}
        totalPages={1}
      />
    </div>
  )
}
