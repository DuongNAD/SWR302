import React from 'react'
import { X } from 'lucide-react'
import { formatPrice } from '@/components/ui/price'

export interface ActiveFiltersProps {
  categoryName?: string | null
  storageConditions: string[]
  brands: string[]
  minPrice?: number | null
  maxPrice?: number | null
  inStockOnly: boolean
  onRemoveCategory: () => void
  onRemoveStorage: (storage: string) => void
  onRemoveBrand: (brand: string) => void
  onRemovePrice: () => void
  onRemoveInStock: () => void
  onClearAll: () => void
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  categoryName,
  storageConditions,
  brands,
  minPrice,
  maxPrice,
  inStockOnly,
  onRemoveCategory,
  onRemoveStorage,
  onRemoveBrand,
  onRemovePrice,
  onRemoveInStock,
  onClearAll,
}) => {
  const hasActiveFilters =
    Boolean(categoryName) ||
    storageConditions.length > 0 ||
    brands.length > 0 ||
    Boolean(minPrice || maxPrice) ||
    inStockOnly

  if (!hasActiveFilters) return null

  const storageLabels: Record<string, string> = {
    ambient: 'Nhiệt độ phòng',
    chilled: 'Mát 2–8°C',
    frozen: 'Đông −18°C',
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
      <span className="text-xs text-ink-3">Đang lọc theo:</span>

      {categoryName && (
        <span className="inline-flex items-center gap-1 rounded-sm bg-page border border-line px-2 py-0.5 text-xs text-ink">
          <span>Danh mục: {categoryName}</span>
          <button
            type="button"
            onClick={onRemoveCategory}
            className="text-ink-3 hover:text-ink cursor-pointer"
            aria-label="Xóa lọc danh mục"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {storageConditions.map((cond) => (
        <span
          key={cond}
          className="inline-flex items-center gap-1 rounded-sm bg-page border border-line px-2 py-0.5 text-xs text-ink"
        >
          <span>{storageLabels[cond] || cond}</span>
          <button
            type="button"
            onClick={() => onRemoveStorage(cond)}
            className="text-ink-3 hover:text-ink cursor-pointer"
            aria-label={`Xóa lọc ${cond}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {brands.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1 rounded-sm bg-page border border-line px-2 py-0.5 text-xs text-ink"
        >
          <span>{b}</span>
          <button
            type="button"
            onClick={() => onRemoveBrand(b)}
            className="text-ink-3 hover:text-ink cursor-pointer"
            aria-label={`Xóa lọc thương hiệu ${b}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {(minPrice || maxPrice) && (
        <span className="inline-flex items-center gap-1 rounded-sm bg-page border border-line px-2 py-0.5 text-xs text-ink">
          <span>
            Giá: {minPrice ? formatPrice(minPrice) : '0₫'} – {maxPrice ? formatPrice(maxPrice) : 'Tối đa'}
          </span>
          <button
            type="button"
            onClick={onRemovePrice}
            className="text-ink-3 hover:text-ink cursor-pointer"
            aria-label="Xóa lọc giá"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className="inline-flex items-center gap-1 rounded-sm bg-page border border-line px-2 py-0.5 text-xs text-ink">
          <span>Chỉ còn hàng</span>
          <button
            type="button"
            onClick={onRemoveInStock}
            className="text-ink-3 hover:text-ink cursor-pointer"
            aria-label="Xóa lọc còn hàng"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-brand hover:underline cursor-pointer ml-1"
      >
        Xóa tất cả
      </button>
    </div>
  )
}
