import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { StorageCondition, WholesaleTier } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Snowflake,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const isEditing = Boolean(id && id !== 'moi')
  const existingProduct = useMemo(() => {
    return isEditing ? PRODUCTS.find((p) => p.id === id) : null
  }, [id, isEditing])

  useDocumentTitle(
    isEditing
      ? `Sửa: ${existingProduct?.name || 'Sản phẩm'} | Quản trị Gia Hòa Phát`
      : 'Thêm sản phẩm mới | Quản trị Gia Hòa Phát'
  )

  // Form Fields
  const [name, setName] = useState(existingProduct?.name || '')
  const [sku, setSku] = useState(() => existingProduct?.sku || 'GHP-PRD-889')
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId || CATEGORIES[0].id)
  const [brand, setBrand] = useState(existingProduct?.brand || 'Anchor')
  const [origin, setOrigin] = useState(existingProduct?.origin || 'New Zealand')
  const [unit, setUnit] = useState(existingProduct?.unit || 'Thỏi 227g')
  const [weightKg, setWeightKg] = useState(existingProduct?.weightKg || 0.25)
  const [price, setPrice] = useState(existingProduct?.price || 75000)
  const [originalPrice, setOriginalPrice] = useState(existingProduct?.originalPrice || 85000)
  const [stockQty, setStockQty] = useState(existingProduct?.stockQty || 100)
  const [lowStockThreshold, setLowStockThreshold] = useState(existingProduct?.lowStockThreshold || 20)
  const [storageCondition, setStorageCondition] = useState<StorageCondition>(
    existingProduct?.storageCondition || 'chilled'
  )
  const [expiryDate, setExpiryDate] = useState(existingProduct?.expiryDate || '28/11/2026')
  const [batchNumber, setBatchNumber] = useState(existingProduct?.batchNumber || 'LOT-2026-NZ8')
  const [imageUrl, setImageUrl] = useState(
    existingProduct?.imageUrl || './img/products/prod-01.webp'
  )
  const [description, setDescription] = useState(existingProduct?.description || '')
  const [ingredients, setIngredients] = useState(existingProduct?.ingredients || '')
  const [storageInstructions, setStorageInstructions] = useState(
    existingProduct?.storageInstructions || 'Bảo quản nhiệt độ mát 2–8°C.'
  )
  const [usageGuide, setUsageGuide] = useState(existingProduct?.usageGuide || '')
  const [inStock, setInStock] = useState(existingProduct ? existingProduct.inStock : true)

  // Wholesale Tiers editable table
  const [tiers, setTiers] = useState<WholesaleTier[]>(
    existingProduct?.wholesaleTiers || [
      { minQty: 1, price: 75000, discountPercent: 0 },
      { minQty: 10, price: 69000, discountPercent: 8 },
      { minQty: 40, price: 63000, discountPercent: 16 },
    ]
  )

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1]
    const nextQty = lastTier ? lastTier.minQty + 10 : 10
    const nextPrice = lastTier ? Math.round(lastTier.price * 0.95) : Math.round(price * 0.9)
    const discount = price > 0 ? Math.round(((price - nextPrice) / price) * 100) : 0

    setTiers([...tiers, { minQty: nextQty, price: nextPrice, discountPercent: discount }])
  }

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, idx) => idx !== index))
  }

  const handleUpdateTier = (index: number, field: keyof WholesaleTier, value: number) => {
    setTiers(
      tiers.map((t, idx) => {
        if (idx !== index) return t
        const updated = { ...t, [field]: value }
        if (field === 'price' && price > 0) {
          updated.discountPercent = Math.max(0, Math.round(((price - value) / price) * 100))
        }
        return updated
      })
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !sku.trim()) {
      showToast({ type: 'error', message: 'Vui lòng điền tên sản phẩm và mã SKU.' })
      return
    }

    showToast({
      type: 'success',
      message: isEditing
        ? `Đã cập nhật sản phẩm “${name}” thành công.`
        : `Đã thêm sản phẩm mới “${name}” vào hệ thống.`,
    })
    navigate('/admin/san-pham')
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with Back button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Link to="/admin/san-pham" className="hover:text-ink flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Danh mục sản phẩm
            </Link>
            <span>/</span>
            <span className="font-mono text-ink">
              {isEditing ? existingProduct?.sku : 'Tạo mới'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-ink">
            {isEditing ? `Chỉnh sửa: ${existingProduct?.name}` : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-xs text-ink-3">
            Cấu hình thông tin thuộc tính, giá bán lẻ, giá sỉ bậc thang và lô hàng bảo quản
          </p>
        </div>
      </div>

      {/* 2. Main 2-column Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (2/3): Basic info + Pricing & Tiers + Warehouse */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Thông tin cơ bản */}
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-ink border-b border-line pb-2.5">
              1. Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prd-name">Tên sản phẩm *</Label>
                <Input
                  id="prd-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Bơ Lạt Tự Nhiên Anchor 227g"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-sku">Mã SKU *</Label>
                <Input
                  id="prd-sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-cat">Danh mục sản phẩm</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="prd-cat" className="w-full h-10 text-xs">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-brand">Thương hiệu</Label>
                <Input
                  id="prd-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ví dụ: Anchor, Tatua, Puratos..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-origin">Xuất xứ</Label>
                <Input
                  id="prd-origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ví dụ: New Zealand, Bỉ, Pháp..."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-unit">Quy cách đóng gói</Label>
                <Input
                  id="prd-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ví dụ: Thỏi 227g, Hộp 1L, Bao 25kg"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-weight">Khối lượng tịnh (kg)</Label>
                <Input
                  id="prd-weight"
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prd-desc">Mô tả sản phẩm</Label>
                <Textarea
                  id="prd-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả hương vị, tính chất nổi bật của nguyên liệu..."
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prd-ing">Thành phần cấu tạo</Label>
                <Input
                  id="prd-ing"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="100% kem sữa tươi thanh trùng..."
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prd-usage">Hướng dẫn sử dụng</Label>
                <Input
                  id="prd-usage"
                  value={usageGuide}
                  onChange={(e) => setUsageGuide(e.target.value)}
                  placeholder="Dùng làm bánh mì, bánh ngọt..."
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prd-storage">Hướng dẫn bảo quản</Label>
                <Input
                  id="prd-storage"
                  value={storageInstructions}
                  onChange={(e) => setStorageInstructions(e.target.value)}
                  placeholder="Bắt buộc bảo quản 2–8°C..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Giá bán & Giá sỉ bậc thang */}
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-ink border-b border-line pb-2.5">
              2. Giá bán lẻ và bảng giá sỉ bậc thang
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="prd-price">Giá niêm yết bán lẻ (đã gồm VAT) *</Label>
                <Input
                  id="prd-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-orig-price">Giá gốc gạch (tùy chọn)</Label>
                <Input
                  id="prd-orig-price"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Editable Wholesale Tiers Table */}
            <div className="space-y-2 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Bảng giá sỉ bậc thang ({tiers.length} mốc)</span>
                <Button type="button" variant="outline" size="sm" onClick={handleAddTier} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Thêm mốc sỉ
                </Button>
              </div>

              <div className="border border-line rounded-md overflow-hidden bg-surface">
                <table className="w-full text-xs text-left">
                  <thead className="bg-page text-ink-2 font-medium border-b border-line">
                    <tr>
                      <th className="py-2 px-3">SL tối thiểu ({unit})</th>
                      <th className="py-2 px-3">Đơn giá sỉ (₫)</th>
                      <th className="py-2 px-3 text-right">Giảm %</th>
                      <th className="py-2 px-3 text-right w-12">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {tiers.map((t, idx) => (
                      <tr key={idx} className="hover:bg-page/50">
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            aria-label={`Số lượng tối thiểu mốc ${idx + 1}`}
                            value={t.minQty}
                            onChange={(e) =>
                              handleUpdateTier(idx, 'minQty', parseInt(e.target.value) || 1)
                            }
                            className="h-7 w-20 text-xs tabular-nums"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            aria-label={`Đơn giá sỉ mốc ${idx + 1}`}
                            value={t.price}
                            onChange={(e) =>
                              handleUpdateTier(idx, 'price', parseInt(e.target.value) || 0)
                            }
                            className="h-7 w-28 text-xs tabular-nums font-semibold"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-ok tabular-nums">
                          -{t.discountPercent}%
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={tiers.length <= 1}
                            onClick={() => handleRemoveTier(idx)}
                            aria-label={`Xóa mốc sỉ ${t.minQty}`}
                            className="h-6 w-6 text-ink-3 hover:text-danger"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Kho hàng & Lô sản xuất */}
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-ink border-b border-line pb-2.5">
              3. Kho hàng và điều kiện bảo quản
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="prd-stock">Số lượng tồn kho</Label>
                <Input
                  id="prd-stock"
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-thresh">Ngưỡng cảnh báo tồn thấp</Label>
                <Input
                  id="prd-thresh"
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Storage Condition Radio List */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Yêu cầu bảo quản chuỗi lạnh *</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStorageCondition('ambient')}
                    className={`p-2.5 rounded-md border text-xs text-center cursor-pointer transition-colors ${
                      storageCondition === 'ambient'
                        ? 'border-brand bg-brand-soft font-semibold text-brand'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    Kho thường
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorageCondition('chilled')}
                    className={`p-2.5 rounded-md border text-xs text-center cursor-pointer transition-colors ${
                      storageCondition === 'chilled'
                        ? 'border-info bg-info-soft font-semibold text-info'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    Mát 2–8°C (Xe lạnh)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorageCondition('frozen')}
                    className={`p-2.5 rounded-md border text-xs text-center cursor-pointer transition-colors ${
                      storageCondition === 'frozen'
                        ? 'border-info bg-info-soft font-semibold text-info'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    Đông lạnh ≤ -18°C
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-batch">Mã lô sản xuất hiện hành</Label>
                <Input
                  id="prd-batch"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prd-exp">Hạn sử dụng (HSD)</Label>
                <Input
                  id="prd-exp"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Status, Image URL & Card Preview */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Status & Visibility */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-ink">Trạng thái kinh doanh</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-2">Hiển thị trên gian hàng</span>
              <Switch
                checked={inStock}
                onCheckedChange={setInStock}
                aria-label="Hiển thị trên gian hàng"
              />
            </div>
            <p className="text-xs text-ink-3">
              {inStock ? 'Sản phẩm đang được mở bán cho khách hàng.' : 'Sản phẩm đang tạm ẩn.'}
            </p>
          </div>

          {/* Product Image */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-ink">Hình ảnh sản phẩm</h3>
            <div className="space-y-2 text-xs">
              <Label htmlFor="prd-img">Đường dẫn ảnh (URL)</Label>
              <Input
                id="prd-img"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="aspect-square w-full rounded-md border border-line bg-page overflow-hidden">
              <img
                src={imageUrl}
                alt="Xem trước ảnh"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = './img/placeholder.svg'
                }}
              />
            </div>
          </div>

          {/* Mini Card Preview */}
          <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-ink">Xem trước hiển thị</h3>
            <div className="p-3 border border-line rounded-md bg-page space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand">{brand || 'Brand'}</span>
                {storageCondition !== 'ambient' && (
                  <Badge variant="outline" className="text-xs text-info border-info/40 py-0 flex items-center gap-0.5">
                    <Snowflake className="w-2.5 h-2.5" />
                    Lạnh
                  </Badge>
                )}
              </div>
              <p className="font-semibold text-ink line-clamp-1">{name || 'Tên sản phẩm'}</p>
              <div className="flex items-baseline gap-2">
                <Price price={price} size="sm" className="font-bold text-brand" />
                {originalPrice > price && (
                  <span className="text-xs text-ink-3 line-through">{formatPrice(originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-surface border-t border-line p-3 shadow-pop flex items-center justify-between px-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/san-pham')}
            className="text-xs text-ink-2"
          >
            Hủy và quay lại
          </Button>

          <Button type="submit" size="lg" className="px-6">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Lưu cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
          </Button>
        </div>
      </form>
    </div>
  )
}
