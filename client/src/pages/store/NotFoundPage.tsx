import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/layout/SearchBox'
import { CATEGORIES } from '@/data/categories'
import { ArrowLeft, PackageSearch } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  useDocumentTitle('404 - Không tìm thấy trang | Gia Hòa Phát')

  const popularCategories = CATEGORIES.slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-xl text-center space-y-6">
      <div className="w-16 h-16 bg-page border border-line rounded-full flex items-center justify-center mx-auto text-brand">
        <PackageSearch className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-line text-ink-3">
          SCR-25 · LỖI 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          Không tìm thấy trang bạn yêu cầu
        </h1>
        <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
          Đường dẫn có thể đã thay đổi, sản phẩm đã ngừng kinh doanh hoặc tạm thời chưa cập nhật.
        </p>
      </div>

      <div className="pt-2">
        <SearchBox />
      </div>

      <div className="space-y-3 pt-4 border-t border-line text-left">
        <p className="text-xs font-semibold text-ink-3 text-center">
          Hoặc khám phá các danh mục nguyên liệu phổ biến:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {popularCategories.map((c) => (
            <Link
              key={c.id}
              to={`/danh-muc/${c.slug}`}
              className="p-2.5 rounded-md border border-line bg-surface hover:border-brand hover:text-brand text-xs font-medium transition-colors text-center"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
