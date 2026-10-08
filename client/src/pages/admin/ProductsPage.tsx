import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { Product } from '@/types'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Snowflake,
  AlertTriangle,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminProductsPage: React.FC = () => {
  useDocumentTitle('Quản lý sản phẩm | Quản trị Gia Hòa Phát')

  const navigate = useNavigate()
  const { showToast } = useToast()

  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [storageFilter, setStorageFilter] = useState('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)

      const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter
      const matchesStorage =
        storageFilter === 'all' ||
        (storageFilter === 'cold' ? p.storageCondition !== 'ambient' : p.storageCondition === 'ambient')
      const matchesStock = !lowStockOnly || p.stockQty <= p.lowStockThreshold

      return matchesSearch && matchesCat && matchesStorage && matchesStock
    })
  }, [products, searchQuery, categoryFilter, storageFilter, lowStockOnly])

  const handleToggleVisibility = (productId: string, currentInStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !currentInStock } : p))
    )
    showToast({
      type: 'info',
      message: `Đã ${currentInStock ? 'ẩn' : 'mở bán lại'} sản phẩm trên cửa hàng.`,
    })
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
    showToast({
      type: 'success',
      message: `Đã xóa sản phẩm “${productToDelete.name}” khỏi hệ thống.`,
    })
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const columns: ColumnDef<Product>[] = [
    {
      header: 'Ảnh',
      className: 'w-12',
      cell: (p) => (
        <div className="w-10 h-10 rounded-md border border-line bg-page overflow-hidden">
          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      header: 'Tên sản phẩm & SKU',
      className: 'max-w-[280px]',
      cell: (p) => (
        <div className="space-y-0.5 truncate">
          <Link
            to={`/admin/san-pham/${p.id}`}
            className="font-semibold text-ink hover:text-brand transition-colors truncate block"
          >
            {p.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className="font-mono">{p.sku}</span>
            <span>•</span>
            <span>{p.brand}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      cell: (p) => <span className="text-xs text-ink-2">{p.categoryName}</span>,
    },
    {
      header: <span className="block text-right">Giá bán lẻ</span>,
      className: 'text-right',
      cell: (p) => (
        <span className="font-bold text-ink tabular-nums">{formatPrice(p.price)}</span>
      ),
    },
    {
      header: <span className="block text-right">Tồn kho</span>,
      className: 'text-right',
      cell: (p) => {
        const isLow = p.stockQty <= p.lowStockThreshold
        return (
          <div className="text-right">
            <span
              className={`tabular-nums font-semibold ${
                isLow ? 'text-warn font-bold' : 'text-ink'
              }`}
            >
              {p.stockQty} {p.unit}
            </span>
            {isLow && (
              <span className="block text-xs text-warn font-medium">Tồn thấp</span>
            )}
          </div>
        )
      },
    },
    {
      header: 'Bảo quản',
      cell: (p) => (
        <div>
          {p.storageCondition !== 'ambient' ? (
            <span className="text-info font-medium text-xs flex items-center gap-1">
              <Snowflake className="w-3 h-3" />
              {p.storageCondition === 'frozen' ? 'Đông lạnh' : 'Mát 2–8°C'}
            </span>
          ) : (
            <span className="text-ink-3 text-xs">Kho thường</span>
          )}
        </div>
      ),
    },
    {
      header: 'HSD',
      cell: (p) => (
        <span className="text-xs text-ink-3 tabular-nums">{p.expiryDate}</span>
      ),
    },
    {
      header: 'Trạng thái',
      cell: (p) => (
        <Badge
          variant={p.inStock ? 'outline' : 'secondary'}
          className={p.inStock ? 'text-ok border-ok/40 text-xs' : 'text-ink-3 text-xs'}
        >
          {p.inStock ? 'Đang bán' : 'Tạm ẩn'}
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      className: 'w-24 text-right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-ink-2 hover:text-brand"
            onClick={() => navigate(`/admin/san-pham/${p.id}`)}
            title="Chỉnh sửa sản phẩm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-ink-3 hover:text-ink"
            onClick={() => handleToggleVisibility(p.id, p.inStock)}
            title={p.inStock ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
          >
            {p.inStock ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-ink-3 hover:text-danger hover:bg-danger-soft"
            onClick={() => {
              setProductToDelete(p)
              setDeleteDialogOpen(true)
            }}
            title="Xóa sản phẩm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-mono text-ink-3">SCR-A04 · QUẢN LÝ SẢN PHẨM</span>
          <h1 className="text-2xl font-bold text-ink">
            Danh mục nguyên liệu & thiết bị
          </h1>
          <p className="text-xs text-ink-3">
            Quản lý thông tin nguyên liệu, bảng giá bán lẻ, giá sỉ bậc thang và điều kiện bảo quản
          </p>
        </div>

        <Button size="sm" asChild>
          <Link to="/admin/san-pham/moi">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>

      {/* 2. Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm theo tên, SKU, thương hiệu..."
        filterSlot={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-md border border-line bg-surface px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Tất cả danh mục</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={storageFilter}
              onChange={(e) => setStorageFilter(e.target.value)}
              className="h-9 rounded-md border border-line bg-surface px-3 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Tất cả bảo quản</option>
              <option value="cold">Chuỗi lạnh (2–8°C / Đông)</option>
              <option value="ambient">Kho thường</option>
            </select>

            <button
              type="button"
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`h-9 px-3 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                lowStockOnly
                  ? 'border-warn bg-warn-soft text-warn font-semibold'
                  : 'border-line bg-surface text-ink-2 hover:bg-page'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Tồn kho thấp
            </button>
          </>
        }
        hasActiveFilters={
          searchQuery !== '' ||
          categoryFilter !== 'all' ||
          storageFilter !== 'all' ||
          lowStockOnly
        }
        onResetFilters={() => {
          setSearchQuery('')
          setCategoryFilter('all')
          setStorageFilter('all')
          setLowStockOnly(false)
        }}
      />

      {/* 3. DataTable */}
      <DataTable
        data={filteredProducts}
        columns={columns}
        keyExtractor={(item) => item.id}
        totalCount={filteredProducts.length}
        totalPages={1}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-ink-2 space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <strong className="text-ink">“{productToDelete?.name}”</strong> (SKU:{' '}
              <span className="font-mono text-ink">{productToDelete?.sku}</span>)?
            </p>
            <p className="text-xs text-ink-3">
              Thao tác này sẽ xóa sản phẩm khỏi danh sách bán hàng trong phiên thử nghiệm hiện tại.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
