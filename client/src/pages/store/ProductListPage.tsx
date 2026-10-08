import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterPanel, MobileFilterDrawer, FilterState } from '@/components/product/FilterPanel'
import { ActiveFilters } from '@/components/product/ActiveFilters'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { SlidersHorizontal, PackageOpen } from 'lucide-react'

const PAGE_SIZE = 12

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Parse filters from URL
  const categorySlug = searchParams.get('danh-muc')
  const currentCategory = CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug)

  const storageParam = searchParams.get('bao-quan')
  const storageConditions = useMemo(
    () => (storageParam ? storageParam.split(',').filter(Boolean) : []),
    [storageParam]
  )

  const brandParam = searchParams.get('thuong-hieu')
  const selectedBrands = useMemo(
    () => (brandParam ? brandParam.split(',').filter(Boolean) : []),
    [brandParam]
  )

  const minPrice = searchParams.get('gia-tu') ? parseInt(searchParams.get('gia-tu')!, 10) : null
  const maxPrice = searchParams.get('gia-den') ? parseInt(searchParams.get('gia-den')!, 10) : null
  const inStockOnly = searchParams.get('con-hang') === '1'
  const sortBy = searchParams.get('sap-xep') || 'bestseller'
  const currentPage = parseInt(searchParams.get('trang') || '1', 10)

  const pageTitle = currentCategory ? currentCategory.name : 'Tất cả sản phẩm'
  useDocumentTitle(pageTitle)

  // Available brands list
  const availableBrands = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort()
  }, [])

  // Update query params helper
  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        next.delete(key)
      } else {
        next.set(key, val)
      }
    })
    // Reset page to 1 when changing filters (except when changing page itself)
    if (!('trang' in updates)) {
      next.delete('trang')
    }
    setSearchParams(next)
  }

  // Filter state for panel
  const filterState: FilterState = {
    category: categorySlug,
    storage: storageConditions,
    brands: selectedBrands,
    minPrice,
    maxPrice,
    inStockOnly,
  }

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updates: Record<string, string | null> = {}
    if ('category' in newFilters) updates['danh-muc'] = newFilters.category || null
    if ('storage' in newFilters) {
      updates['bao-quan'] = newFilters.storage && newFilters.storage.length > 0
        ? newFilters.storage.join(',')
        : null
    }
    if ('brands' in newFilters) {
      updates['thuong-hieu'] = newFilters.brands && newFilters.brands.length > 0
        ? newFilters.brands.join(',')
        : null
    }
    if ('minPrice' in newFilters) {
      updates['gia-tu'] = newFilters.minPrice ? newFilters.minPrice.toString() : null
    }
    if ('maxPrice' in newFilters) {
      updates['gia-den'] = newFilters.maxPrice ? newFilters.maxPrice.toString() : null
    }
    if ('inStockOnly' in newFilters) {
      updates['con-hang'] = newFilters.inStockOnly ? '1' : null
    }
    updateParams(updates)
  }

  const handleResetFilters = () => {
    setSearchParams({})
  }

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (currentCategory && p.categoryId !== currentCategory.id) {
        return false
      }

      // Storage condition
      if (storageConditions.length > 0 && !storageConditions.includes(p.storageCondition)) {
        return false
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false
      }

      // Price range
      if (minPrice !== null && p.price < minPrice) return false
      if (maxPrice !== null && p.price > maxPrice) return false

      // In stock
      if (inStockOnly && (!p.inStock || p.stockQty <= 0)) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
    })
  }, [currentCategory, storageConditions, selectedBrands, minPrice, maxPrice, inStockOnly, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage])

  const activeFilterCount =
    (categorySlug ? 1 : 0) +
    storageConditions.length +
    selectedBrands.length +
    (minPrice || maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  return (
    <div className="wrap py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {currentCategory ? currentCategory.name : 'Sản phẩm'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category Title & Description */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">{pageTitle}</h1>
          <span className="text-xs text-ink-3">({filteredProducts.length} sản phẩm)</span>
        </div>
        {currentCategory?.description && (
          <p className="text-xs sm:text-sm text-ink-2 max-w-3xl leading-relaxed">
            {currentCategory.description}
          </p>
        )}
      </div>

      {/* Main Grid & Filters */}
      <div className="flex items-start gap-6">
        {/* Left Column: Filter Panel (Desktop 260px) */}
        <FilterPanel
          filters={filterState}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availableBrands={availableBrands}
          totalMatches={filteredProducts.length}
        />

        {/* Right Column: Active Filters, Sorting, Product Grid */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-line bg-surface">
            {/* Mobile filter toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFilterOpen(true)}
                className="gap-1.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
              </Button>
            </div>

            <div className="text-xs text-ink-2 hidden sm:block">
              Hiển thị <span className="font-semibold text-ink">{paginatedProducts.length}</span> trong{' '}
              <span className="font-semibold text-ink">{filteredProducts.length}</span> sản phẩm
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-ink-3 whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParams({ 'sap-xep': e.target.value })}
                className="h-8 px-2.5 rounded-md border border-field bg-surface text-xs text-ink focus:outline-none focus:border-brand cursor-pointer"
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="bestseller">Bán chạy nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
                <option value="newest">Hàng mới nhất</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilters
            categoryName={currentCategory?.name}
            storageConditions={storageConditions}
            brands={selectedBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStockOnly={inStockOnly}
            onRemoveCategory={() => updateParams({ 'danh-muc': null })}
            onRemoveStorage={(s) =>
              updateParams({
                'bao-quan': storageConditions.filter((c) => c !== s).join(',') || null,
              })
            }
            onRemoveBrand={(b) =>
              updateParams({
                'thuong-hieu': selectedBrands.filter((brand) => brand !== b).join(',') || null,
              })
            }
            onRemovePrice={() => updateParams({ 'gia-tu': null, 'gia-den': null })}
            onRemoveInStock={() => updateParams({ 'con-hang': null })}
            onClearAll={handleResetFilters}
          />

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 bg-surface rounded-lg border border-line">
              <EmptyState
                icon={PackageOpen}
                title="Không tìm thấy sản phẩm phù hợp"
                description="Hãy thử bỏ bớt một vài tiêu chí lọc hoặc điều chỉnh khoảng giá tìm kiếm."
                action={{
                  label: 'Xóa toàn bộ bộ lọc',
                  onClick: handleResetFilters,
                }}
              />
            </div>
          ) : (
            <>
              <ProductGrid products={paginatedProducts} columns={4} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            updateParams({ trang: Math.max(1, currentPage - 1).toString() })
                          }
                          disabled={currentPage <= 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={p === currentPage}
                            onClick={() => updateParams({ trang: p.toString() })}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            updateParams({
                              trang: Math.min(totalPages, currentPage + 1).toString(),
                            })
                          }
                          disabled={currentPage >= totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Drawer for Filters */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        filters={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        availableBrands={availableBrands}
        totalMatches={filteredProducts.length}
      />
    </div>
  )
}
