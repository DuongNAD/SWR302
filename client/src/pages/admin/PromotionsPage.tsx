import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { MOCK_VOUCHERS, Voucher, VoucherType } from '@/mocks/vouchers'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tag,
  Plus,
  Percent,
  Truck,
  DollarSign,
  Calendar,
  Trash2,
} from 'lucide-react'
import { formatPrice } from '@/components/ui/price'
import { useToast } from '@/context/ToastContext'

export const AdminPromotionsPage: React.FC = () => {
  useDocumentTitle('Quản lý khuyến mãi & voucher | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | VoucherType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Modal create voucher
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState<VoucherType>('fixed')
  const [newValue, setNewValue] = useState('30000')
  const [newMinOrder, setNewMinOrder] = useState('300000')
  const [newMaxDiscount, setNewMaxDiscount] = useState('100000')
  const [newLimit, setNewLimit] = useState('500')
  const [newEndDate, setNewEndDate] = useState('31/12/2026')

  // Filtered vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      if (typeFilter !== 'all' && v.type !== typeFilter) return false
      const q = searchQuery.toLowerCase().trim()
      if (q && !v.code.toLowerCase().includes(q) && !v.description.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [vouchers, typeFilter, searchQuery])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / pageSize))
  const paginatedVouchers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredVouchers.slice(start, start + pageSize)
  }, [filteredVouchers, currentPage, pageSize])

  // Toggle active switch
  const handleToggleActive = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          const nextState = !v.isActive
          showToast({
            message: `Đã ${nextState ? 'kích hoạt' : 'tạm dừng'} mã voucher ${v.code}`,
            type: nextState ? 'success' : 'info',
          })
          return { ...v, isActive: nextState }
        }
        return v
      })
    )
  }

  // Delete voucher
  const handleDeleteVoucher = (voucher: Voucher) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã voucher ${voucher.code}?`)) {
      setVouchers((prev) => prev.filter((v) => v.id !== voucher.id))
      showToast({ message: `Đã xóa voucher ${voucher.code}`, type: 'info' })
    }
  }

  // Handle create voucher
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim()) {
      showToast({ message: 'Vui lòng nhập mã voucher', type: 'error' })
      return
    }

    const created: Voucher = {
      id: `vouc-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      description: newDesc.trim() || 'Ưu đãi đặc biệt từ Gia Hòa Phát',
      type: newType,
      value: Number(newValue) || 0,
      minOrderValue: Number(newMinOrder) || 0,
      maxDiscount: newType === 'percent' ? Number(newMaxDiscount) || undefined : undefined,
      usageCount: 0,
      usageLimit: Number(newLimit) || 100,
      startDate: '08/10/2026',
      endDate: newEndDate || '31/12/2026',
      isActive: true,
    }

    setVouchers([created, ...vouchers])
    setIsCreateOpen(false)
    showToast({ message: `Đã tạo mã khuyến mãi ${created.code} thành công!`, type: 'success' })

    // Reset form
    setNewCode('')
    setNewDesc('')
    setNewValue('30000')
  }

  const columns: ColumnDef<Voucher>[] = [
    {
      header: 'Mã voucher',
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-brand bg-brand-soft px-1.5 py-0.5 rounded border border-brand/20">
              {item.code}
            </span>
          </div>
          <p className="text-xs text-ink-2 max-w-xs truncate" title={item.description}>
            {item.description}
          </p>
        </div>
      ),
    },
    {
      header: 'Loại ưu đãi',
      cell: (item) => {
        if (item.type === 'percent') {
          return (
            <Badge variant="outline" className="border-brand/40 text-brand bg-brand-soft text-xs gap-1">
              <Percent className="w-3 h-3" />
              Giảm {item.value}%
            </Badge>
          )
        }
        if (item.type === 'free_shipping') {
          return (
            <Badge variant="outline" className="border-info/40 text-info bg-info-soft text-xs gap-1">
              <Truck className="w-3 h-3" />
              Freeship
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="border-line text-ink bg-page text-xs gap-1">
            <DollarSign className="w-3 h-3" />
            Giảm {formatPrice(item.value)}
          </Badge>
        )
      },
    },
    {
      header: 'Điều kiện áp dụng',
      cell: (item) => (
        <div className="text-xs space-y-0.5 text-ink-2">
          <div>
            Đơn từ: <strong className="text-ink tabular-nums">{formatPrice(item.minOrderValue)}</strong>
          </div>
          {item.maxDiscount && (
            <div>
              Tối đa: <span className="text-ink tabular-nums">{formatPrice(item.maxDiscount)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Lượt đã dùng',
      cell: (item) => {
        const percent = Math.min(100, Math.round((item.usageCount / item.usageLimit) * 100))
        return (
          <div className="space-y-1 min-w-[100px]">
            <div className="text-xs text-ink font-semibold tabular-nums">
              {item.usageCount} / {item.usageLimit} ({percent}%)
            </div>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-brand"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Hiệu lực',
      cell: (item) => (
        <div className="text-xs text-ink-3 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-ink-3" />
          <span className="tabular-nums">{item.startDate} – {item.endDate}</span>
        </div>
      ),
    },
    {
      header: 'Bật / Tắt',
      className: 'text-center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handleToggleActive(item.id)}
            aria-label={`Bật tắt ${item.code}`}
          />
          <span className={`text-xs font-medium ${item.isActive ? 'text-ok' : 'text-ink-3'}`}>
            {item.isActive ? 'Bật' : 'Tắt'}
          </span>
        </div>
      ),
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      cell: (item) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteVoucher(item)}
            className="h-7 w-7 p-0 text-ink-3 hover:text-danger hover:bg-danger-soft"
            title="Xóa voucher"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Khuyến mãi & mã giảm giá</h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Quản lý các chiến dịch khuyến mãi, mã voucher giảm tiền mặt, phần trăm và miễn phí giao hàng
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Tạo voucher mới
        </Button>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v)
          setCurrentPage(1)
        }}
        searchPlaceholder="Tìm kiếm mã hoặc nội dung..."
        filterSlot={
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="h-9 px-2.5 text-xs bg-surface border border-line rounded-md text-ink"
            >
              <option value="all">Tất cả loại voucher</option>
              <option value="fixed">Giảm số tiền cố định</option>
              <option value="percent">Giảm theo tỷ lệ %</option>
              <option value="free_shipping">Miễn phí vận chuyển</option>
            </select>
          </div>
        }
        hasActiveFilters={Boolean(searchQuery || typeFilter !== 'all')}
        onResetFilters={() => {
          setSearchQuery('')
          setTypeFilter('all')
        }}
      />

      {/* Table */}
      <DataTable
        data={paginatedVouchers}
        columns={columns}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredVouchers.length}
        pageSize={pageSize}
        emptyMessage="Chưa có mã giảm giá nào phù hợp"
      />

      {/* Modal Create Voucher */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md p-6 bg-surface border border-line rounded-lg">
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-ink flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand" />
                Tạo mã voucher mới
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-3">
                Nhập thông số và thiết lập điều kiện áp dụng cho chiến dịch khuyến mãi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-semibold text-ink">Mã voucher *</Label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="VD: GIANGSINH2026"
                  required
                  className="mt-1 font-mono h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-ink">Mô tả hiển thị *</Label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="VD: Giảm 30.000₫ cho đơn từ 300.000₫"
                  required
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-ink">Loại giảm giá</Label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as VoucherType)}
                    className="mt-1 w-full h-8 px-2 text-xs bg-surface border border-line rounded-md text-ink"
                  >
                    <option value="fixed">Giảm số tiền cố định (₫)</option>
                    <option value="percent">Giảm theo tỷ lệ %</option>
                    <option value="free_shipping">Miễn phí giao hàng</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-ink">
                    {newType === 'percent' ? 'Mức giảm (%)' : 'Giá trị giảm (₫)'}
                  </Label>
                  <Input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="mt-1 h-8 text-xs tabular-nums"
                  />
                </div>
              </div>

              {newType === 'percent' && (
                <div>
                  <Label className="text-xs font-semibold text-ink">Giảm tối đa (₫)</Label>
                  <Input
                    type="number"
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(e.target.value)}
                    className="mt-1 h-8 text-xs tabular-nums"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-ink">Đơn tối thiểu (₫)</Label>
                  <Input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="mt-1 h-8 text-xs tabular-nums"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-ink">Giới hạn số lượt dùng</Label>
                  <Input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="mt-1 h-8 text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-ink">Ngày kết thúc hiệu lực</Label>
                <Input
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  placeholder="31/12/2026"
                  className="mt-1 h-8 text-xs tabular-nums"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="h-8 text-xs px-3"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover"
              >
                Lưu mã voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
