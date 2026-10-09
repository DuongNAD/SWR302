import React, { useState } from 'react'
import { CATEGORIES } from '@/data/categories'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Filter } from 'lucide-react'

export interface FilterState {
  category: string | null
  storage: string[]
  brands: string[]
  minPrice: number | null
  maxPrice: number | null
  inStockOnly: boolean
}

export interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
  onReset: () => void
  availableBrands: string[]
  totalMatches: number
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableBrands,
  totalMatches,
}) => {
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [localMinPrice, setLocalMinPrice] = useState(
    filters.minPrice ? filters.minPrice.toString() : ''
  )
  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice ? filters.maxPrice.toString() : ''
  )

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({
      minPrice: localMinPrice ? parseInt(localMinPrice, 10) : null,
      maxPrice: localMaxPrice ? parseInt(localMaxPrice, 10) : null,
    })
  }

  const toggleStorage = (cond: string) => {
    const next = filters.storage.includes(cond)
      ? filters.storage.filter((s) => s !== cond)
      : [...filters.storage, cond]
    onFilterChange({ storage: next })
  }

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFilterChange({ brands: next })
  }

  const displayedBrands = showAllBrands ? availableBrands : availableBrands.slice(0, 6)

  const filterContent = (
    <div className="space-y-6 text-sm text-ink">
      {/* 1. Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-ink-3">Danh mục sản phẩm</h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: null })}
            className={`flex w-full items-center justify-between px-2 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${
              !filters.category
                ? 'bg-brand-soft text-brand font-semibold'
                : 'text-ink-2 hover:bg-page hover:text-ink'
            }`}
          >
            <span>Tất cả danh mục</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilterChange({ category: c.slug })}
              className={`flex w-full items-center justify-between px-2 py-1.5 rounded text-xs transition-colors cursor-pointer text-left ${
                filters.category === c.slug
                  ? 'bg-brand-soft text-brand font-semibold'
                  : 'text-ink-2 hover:bg-page hover:text-ink'
              }`}
            >
              <span className="truncate pr-2">{c.name}</span>
              <span className="text-ink-3 tabular-nums">{c.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Storage Condition */}
      <div className="pt-4 border-t border-line space-y-2">
        <h4 className="text-xs font-semibold text-ink-3">Điều kiện bảo quản</h4>
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer">
            <Checkbox
              checked={filters.storage.includes('ambient')}
              onCheckedChange={() => toggleStorage('ambient')}
            />
            <span>Nhiệt độ phòng (thường)</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer">
            <Checkbox
              checked={filters.storage.includes('chilled')}
              onCheckedChange={() => toggleStorage('chilled')}
            />
            <span>Mát 2–8°C (xe lạnh)</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer">
            <Checkbox
              checked={filters.storage.includes('frozen')}
              onCheckedChange={() => toggleStorage('frozen')}
            />
            <span>Đông −18°C (xe lạnh)</span>
          </label>
        </div>
      </div>

      {/* 3. Brands */}
      <div className="pt-4 border-t border-line space-y-2">
        <h4 className="text-xs font-semibold text-ink-3">Thương hiệu</h4>
        <div className="space-y-2 pt-1">
          {displayedBrands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 text-xs text-ink cursor-pointer">
              <Checkbox
                checked={filters.brands.includes(b)}
                onCheckedChange={() => toggleBrand(b)}
              />
              <span className="truncate">{b}</span>
            </label>
          ))}
          {availableBrands.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-xs text-brand font-medium hover:underline pt-1 cursor-pointer"
            >
              {showAllBrands ? 'Thu gọn' : `Xem thêm (${availableBrands.length - 6})`}
            </button>
          )}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="pt-4 border-t border-line space-y-2">
        <h4 className="text-xs font-semibold text-ink-3">Khoảng giá (₫)</h4>
        <form onSubmit={handleApplyPrice} className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Từ"
                aria-label="Giá từ"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="h-8 text-xs px-2"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Đến"
                aria-label="Giá đến"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="h-8 text-xs px-2"
              />
            </div>
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full text-xs h-7">
            Áp dụng giá
          </Button>
        </form>
      </div>

      {/* 5. In Stock Only */}
      <div className="pt-4 border-t border-line space-y-2">
        <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer">
          <Checkbox
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => onFilterChange({ inStockOnly: Boolean(checked) })}
          />
          <span>Chỉ hiện sản phẩm còn hàng</span>
        </label>
      </div>

      {/* Reset action */}
      <div className="pt-4 border-t border-line">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-ink-3 hover:text-bad underline transition-colors cursor-pointer w-full text-center"
        >
          Xóa toàn bộ bộ lọc
        </button>
      </div>
    </div>
  )

  return (
    <aside className="w-64 shrink-0 rounded-lg border border-line bg-surface p-4 hidden lg:block sticky top-20">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-line">
        <div className="flex items-center gap-2 font-semibold text-ink text-sm">
          <Filter className="h-4 w-4 text-brand" />
          <span>Bộ lọc sản phẩm</span>
        </div>
        <span className="text-xs text-ink-3">{totalMatches} kết quả</span>
      </div>
      {filterContent}
    </aside>
  )
}

// Mobile Filter Drawer using Bottom Drawer with Accordion
export const MobileFilterDrawer: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
  onReset: () => void
  availableBrands: string[]
  totalMatches: number
}> = ({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  onReset,
  availableBrands,
  totalMatches,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 max-h-[85vh] flex flex-col">
        <DrawerHeader className="p-4 border-b border-line text-left">
          <DrawerTitle className="text-base font-semibold text-ink flex items-center justify-between">
            <span>Bộ lọc sản phẩm</span>
            <span className="text-xs text-ink-3 font-normal">{totalMatches} sản phẩm</span>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="multiple" defaultValue={['cat', 'storage', 'brand', 'price']}>
            {/* Danh mục */}
            <AccordionItem value="cat">
              <AccordionTrigger>Danh mục</AccordionTrigger>
              <AccordionContent className="space-y-1">
                <button
                  type="button"
                  onClick={() => onFilterChange({ category: null })}
                  className={`flex w-full items-center justify-between px-2 py-1.5 rounded text-xs ${
                    !filters.category ? 'bg-brand-soft text-brand font-semibold' : 'text-ink-2'
                  }`}
                >
                  <span>Tất cả danh mục</span>
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onFilterChange({ category: c.slug })}
                    className={`flex w-full items-center justify-between px-2 py-1.5 rounded text-xs ${
                      filters.category === c.slug ? 'bg-brand-soft text-brand font-semibold' : 'text-ink-2'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-ink-3">{c.productCount}</span>
                  </button>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Bảo quản */}
            <AccordionItem value="storage">
              <AccordionTrigger>Điều kiện bảo quản</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={filters.storage.includes('ambient')}
                    onCheckedChange={() => {
                      const next = filters.storage.includes('ambient')
                        ? filters.storage.filter((s) => s !== 'ambient')
                        : [...filters.storage, 'ambient']
                      onFilterChange({ storage: next })
                    }}
                  />
                  <span>Nhiệt độ phòng (thường)</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={filters.storage.includes('chilled')}
                    onCheckedChange={() => {
                      const next = filters.storage.includes('chilled')
                        ? filters.storage.filter((s) => s !== 'chilled')
                        : [...filters.storage, 'chilled']
                      onFilterChange({ storage: next })
                    }}
                  />
                  <span>Mát 2–8°C (xe lạnh)</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={filters.storage.includes('frozen')}
                    onCheckedChange={() => {
                      const next = filters.storage.includes('frozen')
                        ? filters.storage.filter((s) => s !== 'frozen')
                        : [...filters.storage, 'frozen']
                      onFilterChange({ storage: next })
                    }}
                  />
                  <span>Đông −18°C (xe lạnh)</span>
                </label>
              </AccordionContent>
            </AccordionItem>

            {/* Thương hiệu */}
            <AccordionItem value="brand">
              <AccordionTrigger>Thương hiệu</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {availableBrands.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-xs">
                    <Checkbox
                      checked={filters.brands.includes(b)}
                      onCheckedChange={() => {
                        const next = filters.brands.includes(b)
                          ? filters.brands.filter((brand) => brand !== b)
                          : [...filters.brands, b]
                        onFilterChange({ brands: next })
                      }}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Tồn kho */}
            <AccordionItem value="price">
              <AccordionTrigger>Tình trạng hàng</AccordionTrigger>
              <AccordionContent>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={filters.inStockOnly}
                    onCheckedChange={(checked) => onFilterChange({ inStockOnly: Boolean(checked) })}
                  />
                  <span>Chỉ hiện sản phẩm còn hàng</span>
                </label>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DrawerFooter className="p-4 border-t border-line grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onReset}>
            Xóa bộ lọc
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Xem {totalMatches} sản phẩm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
