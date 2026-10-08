import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RECIPE_BUNDLES } from '@/data/recipeBundles'
import { PRODUCTS } from '@/data/products'
import { Price } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Clock, Users, ArrowRight, Layers } from 'lucide-react'

export const ComboListPage: React.FC = () => {
  useDocumentTitle('Combo nguyên liệu theo món bánh | Gia Hòa Phát')

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Combo nguyên liệu</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-1.5 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          Combo nguyên liệu theo món
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed">
          Mua trọn bộ nguyên liệu theo định lượng chuẩn của từng công thức làm bánh. Bạn hoàn toàn có thể bỏ chọn những món đã có sẵn ở nhà.
        </p>
      </div>

      {/* Combo Cards Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RECIPE_BUNDLES.map((bundle) => {
          // Calculate total price of ingredients in bundle
          const bundleProducts = bundle.itemIds
            .map((id) => PRODUCTS.find((p) => p.id === id))
            .filter((p): p is (typeof PRODUCTS)[0] => Boolean(p))

          const totalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0)

          return (
            <div
              key={bundle.id}
              className="group border border-line rounded-lg bg-surface overflow-hidden flex flex-col hover:border-brand/40 transition-colors"
            >
              {/* Image 4:3 */}
              <Link
                to={`/combo/${bundle.id}`}
                className="relative aspect-4/3 w-full bg-page overflow-hidden block"
              >
                <img
                  src={bundle.imageUrl}
                  alt={bundle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-surface text-ink border-line text-xs">
                    {bundle.difficulty}
                  </Badge>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-ink line-clamp-1 group-hover:text-brand transition-colors">
                    <Link to={`/combo/${bundle.id}`}>{bundle.name}</Link>
                  </h3>
                  <p className="text-xs text-ink-3 line-clamp-2 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Metadata list */}
                  <div className="grid grid-cols-2 gap-y-1.5 pt-1 text-xs text-ink-2 border-t border-line/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-ink-3 shrink-0" />
                      <span className="truncate">{bundle.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-ink-3 shrink-0" />
                      <span className="truncate">{bundle.servings}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Layers className="w-3.5 h-3.5 text-ink-3 shrink-0" />
                      <span>{bundle.itemIds.length} nguyên liệu chuẩn định lượng</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Price + Button */}
                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <div>
                    <span className="text-xs text-ink-3 block">Trọn bộ từ</span>
                    <Price price={totalPrice} size="md" className="font-bold text-brand" />
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/combo/${bundle.id}`}>
                      Xem combo
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
