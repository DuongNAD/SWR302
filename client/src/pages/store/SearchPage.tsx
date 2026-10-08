import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Search, ArrowRight } from 'lucide-react'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('danh-muc')

  useDocumentTitle(query ? `Tìm kiếm: “${query}”` : 'Tìm kiếm sản phẩm')

  // Search matching logic
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()

    return PRODUCTS.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)

      const matchesCat = !categoryFilter || p.categoryId === categoryFilter
      return matchesText && matchesCat
    })
  }, [query, categoryFilter])

  const suggestions = ['bơ', 'bột mì', 'socola', 'kem tươi', 'khuôn bánh']

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
            <BreadcrumbLink href="#/san-pham">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tìm kiếm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">
          {query ? (
            <>
              Kết quả cho <span className="text-brand">“{query}”</span>
            </>
          ) : (
            'Tìm kiếm sản phẩm'
          )}
        </h1>
        <p className="text-xs text-ink-3">
          Tìm thấy <span className="font-semibold text-ink">{searchResults.length}</span> sản phẩm phù hợp
        </p>
      </div>

      {/* Results or Empty with Suggestions */}
      {searchResults.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5">
          <div className="h-12 w-12 rounded-full bg-page border border-line flex items-center justify-center mx-auto text-ink-3">
            <Search className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-ink">
              Không tìm thấy sản phẩm nào phù hợp với “{query}”
            </h3>
            <p className="text-xs text-ink-2">
              Hãy kiểm tra lại chính tả hoặc thử tìm kiếm bằng các từ khóa nguyên liệu phổ biến dưới đây.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <span className="text-xs font-medium text-ink-3 block">Gợi ý từ khóa tìm kiếm:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSearchParams({ q: s })}
                  className="px-3 py-1.5 rounded-md bg-page border border-line text-xs font-medium text-ink hover:text-brand hover:border-brand transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
            >
              <span>Xem toàn bộ danh mục sản phẩm</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <ProductGrid products={searchResults} columns={5} />
      )}
    </div>
  )
}
