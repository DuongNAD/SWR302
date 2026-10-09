import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { formatPrice } from '@/components/ui/price'
import { cn } from '@/lib/utils'

export const SearchBox: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter products and categories
  const filteredProducts =
    query.trim().length >= 2
      ? PRODUCTS.filter((p) => {
          return (
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase())
          )
        }).slice(0, 5)
      : []

  const filteredCategories =
    query.trim().length >= 2
      ? CATEGORIES.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)
      : []

  // Global Ctrl/Cmd + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    setIsOpen(false)
    navigate(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSelectProduct = (id: string) => {
    setIsOpen(false)
    navigate(`/san-pham/${id}`)
  }

  const handleSelectCategory = (catId: string) => {
    setIsOpen(false)
    navigate(`/san-pham?danh-muc=${catId}`)
  }

  const showSuggestions = isOpen && query.trim().length >= 2

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center h-10 w-full rounded-md border border-field bg-surface text-ink focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all overflow-hidden"
      >
        {/* Query Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm bột mì, bơ lạt, socola Bỉ, lò nướng..."
          aria-label="Tìm kiếm sản phẩm"
          className="flex-1 h-full px-3.5 text-sm bg-transparent text-ink placeholder:text-ink-3 focus:outline-none min-w-0"
        />

        {/* Shortcut hint badge */}
        <div className="hidden sm:flex items-center pr-2">
          <kbd className="inline-flex items-center gap-0.5 rounded border border-line bg-page px-1.5 py-0.5 text-xs font-medium text-ink-3 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="h-full px-3.5 bg-brand text-white hover:bg-brand-hover transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {/* Suggestions Popover */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg border border-line bg-surface p-2 shadow-pop text-ink">
          {filteredProducts.length === 0 && filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-sm text-ink-2">
              Không tìm thấy gợi ý cho “{query}”
            </div>
          ) : (
            <div className="space-y-2">
              {/* Category Suggestions */}
              {filteredCategories.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-medium text-ink-3">
                    Danh mục gợi ý
                  </div>
                  {filteredCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCategory(c.id)}
                      className="flex w-full items-center justify-between px-2 py-1.5 text-xs text-ink-2 hover:bg-page hover:text-ink rounded transition-colors text-left cursor-pointer"
                    >
                      <span className="font-medium text-ink">{c.name}</span>
                      <span className="text-ink-3">{c.productCount} sản phẩm</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Product Suggestions */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-medium text-ink-3">
                    Sản phẩm ({filteredProducts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p.id)}
                        className="flex w-full items-center gap-3 p-1.5 rounded hover:bg-page text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-10 rounded border border-line object-cover bg-page shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="text-ink font-semibold tabular-nums">
                              {formatPrice(p.price)}
                            </span>
                            <span className="text-ink-3 text-xs">{p.brand}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View all results button */}
              <div className="pt-1 border-t border-line">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full text-center py-2 text-xs font-medium text-brand hover:text-brand-hover hover:bg-brand-soft rounded transition-colors cursor-pointer"
                >
                  Xem tất cả kết quả cho “{query}”
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
