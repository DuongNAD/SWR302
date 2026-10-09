import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { MOCK_BATCHES, MOCK_STOCK_TRANSACTIONS, ProductBatch, StockTransaction } from '@/mocks/batches'
import { Product } from '@/types'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Snowflake,
  Plus,
  Check,
  Clock,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminInventoryPage: React.FC = () => {
  useDocumentTitle('Tồn kho và quản lý lô FEFO | Quản trị Gia Hòa Phát')

  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'stock' | 'fefo' | 'transactions'>('stock')
  const [stockList, setStockList] = useState<Product[]>(PRODUCTS)
  const [batches, _setBatches] = useState<ProductBatch[]>(MOCK_BATCHES)
  const [transactions, setTransactions] = useState<StockTransaction[]>(MOCK_STOCK_TRANSACTIONS)
  const [searchQuery, setSearchQuery] = useState('')

  // Inline stock edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [inlineStockVal, setInlineStockVal] = useState<number>(0)

  // Inbound stock modal state
  const [inboundModalOpen, setInboundModalOpen] = useState(false)
  const [inboundProduct, setInboundProduct] = useState(PRODUCTS[0].id)
  const [inboundQty, setInboundQty] = useState(50)
  const [inboundSupplier, setInboundSupplier] = useState('Công ty TNHH Fonterra Vietnam')

  const handleStartInlineEdit = (p: Product) => {
    setEditingStockId(p.id)
    setInlineStockVal(p.stockQty)
  }

  const handleSaveInlineStock = (p: Product) => {
    setStockList((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, stockQty: inlineStockVal } : item))
    )
    setEditingStockId(null)
    showToast({
      type: 'success',
      message: `Đã cập nhật tồn kho cho “${p.name}”: ${inlineStockVal} ${p.unit}.`,
    })
  }

  const handleInboundSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = PRODUCTS.find((p) => p.id === inboundProduct)
    if (!product) return

    setStockList((prev) =>
      prev.map((item) =>
        item.id === inboundProduct ? { ...item, stockQty: item.stockQty + inboundQty } : item
      )
    )

    const newTr: StockTransaction = {
      id: `tr-${Date.now()}`,
      code: `NK-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString('vi-VN'),
      type: 'import',
      partnerName: inboundSupplier,
      totalItems: inboundQty,
      totalAmount: product.price * inboundQty,
      creator: 'Nguyễn Văn Kho',
      note: `Nhập kho bổ sung ${inboundQty} ${product.unit}`,
    }

    setTransactions([newTr, ...transactions])
    setInboundModalOpen(false)
    showToast({
      type: 'success',
      message: `Đã tạo phiếu nhập kho thành công cho ${product.name}!`,
    })
  }

  // Filtered Stock Items
  const filteredStock = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return stockList.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    )
  }, [stockList, searchQuery])

  // Filtered & Sorted FEFO Batches (Sorted ascending by days remaining)
  const sortedBatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const list = batches.filter(
      (b) =>
        !q ||
        b.productName.toLowerCase().includes(q) ||
        b.batchNumber.toLowerCase().includes(q) ||
        b.sku.toLowerCase().includes(q)
    )
    return [...list].sort((a, b) => a.daysRemaining - b.daysRemaining)
  }, [batches, searchQuery])

  // Columns: Tab 1 - Stock
  const stockColumns: ColumnDef<Product>[] = [
    {
      header: 'Sản phẩm và SKU',
      className: 'max-w-[280px]',
      cell: (p) => (
        <div className="space-y-0.5 truncate">
          <span className="font-semibold text-ink truncate block">{p.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className="font-mono">{p.sku}</span>
            <span>•</span>
            <span>{p.unit}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Điều kiện kho',
      cell: (p) => (
        <div>
          {p.storageCondition !== 'ambient' ? (
            <span className="text-info font-medium text-xs flex items-center gap-1">
              <Snowflake className="w-3 h-3" />
              Kho lạnh 2–8°C
            </span>
          ) : (
            <span className="text-ink-3 text-xs">Kho thường</span>
          )}
        </div>
      ),
    },
    {
      header: <span className="block text-right">Ngưỡng cảnh báo</span>,
      className: 'text-right',
      cell: (p) => <span className="tabular-nums text-ink-3">{p.lowStockThreshold} {p.unit}</span>,
    },
    {
      header: <span className="block text-right">Tồn kho hiện hành</span>,
      className: 'text-right',
      cell: (p) => {
        const isEditing = editingStockId === p.id
        const isLow = p.stockQty <= p.lowStockThreshold

        return isEditing ? (
          <div className="flex items-center justify-end gap-1.5">
            <Input
              type="number"
              value={inlineStockVal}
              onChange={(e) => setInlineStockVal(parseInt(e.target.value) || 0)}
              className="h-7 w-20 text-right text-xs font-semibold tabular-nums"
              autoFocus
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleSaveInlineStock(p)}
              className="h-7 w-7 text-ok hover:bg-ok/10"
              title="Lưu số lượng"
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => handleStartInlineEdit(p)}
            className="cursor-pointer group flex items-center justify-end gap-1.5"
            title="Bấm để sửa nhanh số lượng tồn kho"
          >
            <span
              className={`tabular-nums font-semibold ${
                isLow ? 'text-warn font-bold' : 'text-ink'
              }`}
            >
              {p.stockQty} {p.unit}
            </span>
            <span className="text-xs text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity">
              [Sửa]
            </span>
          </div>
        )
      },
    },
    {
      header: 'Trạng thái',
      cell: (p) => {
        const isLow = p.stockQty <= p.lowStockThreshold
        return (
          <Badge
            variant={isLow ? 'secondary' : 'outline'}
            className={isLow ? 'bg-warn-soft text-warn text-xs' : 'text-ok border-ok/40 text-xs'}
          >
            {isLow ? 'Cảnh báo tồn thấp' : 'Đầy đủ tồn'}
          </Badge>
        )
      },
    },
  ]

  // Columns: Tab 2 - FEFO Batches
  const batchColumns: ColumnDef<ProductBatch>[] = [
    {
      header: 'Số lô sản xuất',
      className: 'font-mono text-xs font-bold text-ink',
      accessorKey: 'batchNumber',
    },
    {
      header: 'Sản phẩm và quy cách',
      cell: (b) => (
        <div>
          <span className="font-semibold text-ink block">{b.productName}</span>
          <span className="text-xs text-ink-3 font-mono">{b.sku}</span>
        </div>
      ),
    },
    {
      header: <span className="block text-right">Số lượng lô</span>,
      className: 'text-right',
      cell: (b) => <span className="tabular-nums font-semibold">{b.quantity} {b.unit}</span>,
    },
    {
      header: 'Vị trí lưu kho',
      cell: (b) => (
        <span
          className={`text-xs font-medium flex items-center gap-1 ${
            b.warehouse.includes('lạnh') ? 'text-info' : 'text-ink-2'
          }`}
        >
          {b.warehouse.includes('lạnh') && <Snowflake className="w-3 h-3" />}
          {b.warehouse}
        </span>
      ),
    },
    {
      header: 'Hạn sử dụng (HSD)',
      cell: (b) => <span className="tabular-nums text-xs">{b.expiryDate}</span>,
    },
    {
      header: 'Thời hạn còn lại',
      cell: (b) => {
        const isCritical = b.daysRemaining <= 7
        const isExpiringSoon = b.daysRemaining <= 30

        return (
          <span
            className={`font-semibold tabular-nums text-xs ${
              isCritical
                ? 'text-danger font-bold'
                : isExpiringSoon
                ? 'text-warn font-bold'
                : 'text-ok'
            }`}
          >
            Còn {b.daysRemaining} ngày
            {isCritical && ' (Cực kỳ gấp)'}
          </span>
        )
      },
    },
    {
      header: 'FEFO Ưu tiên',
      cell: (_, idx) => (
        <Badge
          variant="outline"
          className={
            idx === 0
              ? 'bg-danger-soft text-danger border-danger/40 text-xs'
              : idx <= 2
              ? 'bg-warn-soft text-warn border-warn/40 text-xs'
              : 'text-ink-3 text-xs'
          }
        >
          Ưu tiên xuất #{idx + 1}
        </Badge>
      ),
    },
  ]

  // Columns: Tab 3 - Stock Transactions
  const trColumns: ColumnDef<StockTransaction>[] = [
    {
      header: 'Mã phiếu',
      className: 'font-mono text-xs font-bold text-ink',
      accessorKey: 'code',
    },
    {
      header: 'Thời gian',
      accessorKey: 'date',
    },
    {
      header: 'Loại nghiệp vụ',
      cell: (t) => (
        <Badge
          variant={t.type === 'import' ? 'default' : 'secondary'}
          className={t.type === 'import' ? 'bg-ok text-white text-xs' : 'text-xs'}
        >
          {t.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
        </Badge>
      ),
    },
    {
      header: 'Đối tác / Khách hàng',
      accessorKey: 'partnerName',
    },
    {
      header: <span className="block text-right">Tổng số lượng</span>,
      className: 'text-right',
      cell: (t) => <span className="tabular-nums font-semibold">{t.totalItems} đơn vị</span>,
    },
    {
      header: <span className="block text-right">Tổng giá trị</span>,
      className: 'text-right',
      cell: (t) => (
        <span className="font-bold text-ink tabular-nums">{formatPrice(t.totalAmount)}</span>
      ),
    },
    {
      header: 'Ghi chú',
      cell: (t) => <span className="text-ink-3 text-xs max-w-xs truncate block">{t.note}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Quản trị tồn kho và hạn dùng (FEFO)
          </h1>
          <p className="text-xs text-ink-3">
            Kiểm soát nguyên tắc First Expired - First Out, điều chỉnh số lượng tồn và quản lý phiếu nhập xuất
          </p>
        </div>

        <Button size="sm" onClick={() => setInboundModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tạo phiếu nhập kho
        </Button>
      </div>

      {/* 2. Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
        <TabsList className="bg-surface border border-line">
          <TabsTrigger value="stock">Tồn kho theo sản phẩm ({stockList.length})</TabsTrigger>
          <TabsTrigger value="fefo">Lô hàng và hạn dùng (FEFO) ({batches.length})</TabsTrigger>
          <TabsTrigger value="transactions">Nhật ký nhập / xuất ({transactions.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 3. Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={
          activeTab === 'stock'
            ? 'Tìm theo tên sản phẩm, SKU...'
            : activeTab === 'fefo'
            ? 'Tìm theo số lô, tên sản phẩm...'
            : 'Tìm phiếu nhập xuất...'
        }
      />

      {/* 4. Active Tab Table */}
      {activeTab === 'stock' && (
        <DataTable
          data={filteredStock}
          columns={stockColumns}
          keyExtractor={(item) => item.id}
          totalCount={filteredStock.length}
          totalPages={1}
        />
      )}

      {activeTab === 'fefo' && (
        <div className="space-y-3">
          <div className="p-3 bg-info-soft border border-info/30 rounded-md text-xs text-info flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              Quy tắc FEFO: Các lô hàng có HSD gần nhất bắt buộc được xuất kho trước để tránh quá hạn hư hỏng nguyên liệu bơ sữa.
            </span>
          </div>

          <DataTable
            data={sortedBatches}
            columns={batchColumns}
            keyExtractor={(item) => item.id}
            totalCount={sortedBatches.length}
            totalPages={1}
          />
        </div>
      )}

      {activeTab === 'transactions' && (
        <DataTable
          data={transactions}
          columns={trColumns}
          keyExtractor={(item) => item.id}
          totalCount={transactions.length}
          totalPages={1}
        />
      )}

      {/* Inbound Stock Dialog */}
      <Dialog open={inboundModalOpen} onOpenChange={setInboundModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiếu nhập kho nguyên liệu</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInboundSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="in-prd">Chọn sản phẩm nhập kho</Label>
              <Select value={inboundProduct} onValueChange={setInboundProduct}>
                <SelectTrigger id="in-prd" className="w-full h-10 text-xs">
                  <SelectValue placeholder="Chọn sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="in-qty">Số lượng nhập thêm</Label>
              <Input
                id="in-qty"
                type="number"
                min={1}
                value={inboundQty}
                onChange={(e) => setInboundQty(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="in-supp">Nhà cung cấp / Đối tác</Label>
              <Input
                id="in-supp"
                value={inboundSupplier}
                onChange={(e) => setInboundSupplier(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setInboundModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Xác nhận nhập kho</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
