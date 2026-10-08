import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RECIPE_BUNDLES } from '@/data/recipeBundles'
import { PRODUCTS } from '@/data/products'
import { Price } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChefHat, Clock, Users, ShoppingCart, Snowflake } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { NotFoundPage } from '@/pages/store/NotFoundPage'

export const ComboDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const { showToast } = useToast()

  const bundle = useMemo(() => {
    return RECIPE_BUNDLES.find((b) => b.id === id || b.slug === id)
  }, [id])

  useDocumentTitle(bundle ? `${bundle.name} | Gia Hòa Phát` : 'Chi tiết combo')

  // Find products belonging to this bundle
  const bundleProducts = useMemo(() => {
    if (!bundle) return []
    return bundle.itemIds
      .map((itemId) => PRODUCTS.find((p) => p.id === itemId))
      .filter((p): p is (typeof PRODUCTS)[0] => Boolean(p))
  }, [bundle])

  // Track checked state for each ingredient
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    if (bundle) {
      bundle.itemIds.forEach((itemId) => {
        initial[itemId] = true
      })
    }
    return initial
  })

  if (!bundle) {
    return <NotFoundPage />
  }

  const toggleItem = (productId: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // Filter selected products
  const selectedProducts = bundleProducts.filter((p) => checkedIds[p.id])
  const selectedTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0)
  const allCount = bundleProducts.length
  const selectedCount = selectedProducts.length

  const handleAddSelectedToCart = () => {
    if (selectedCount === 0) {
      showToast({
        type: 'error',
        message: 'Vui lòng chọn ít nhất một nguyên liệu trong bộ combo!',
      })
      return
    }

    selectedProducts.forEach((p) => {
      addItem(p, 1)
    })

    showToast({
      type: 'success',
      message: `Đã thêm ${selectedCount} nguyên liệu làm bánh “${bundle.name}” vào giỏ hàng!`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-8">
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
            <BreadcrumbLink asChild>
              <Link to="/combo">Combo nguyên liệu</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">
              {bundle.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image + Info + Metadata */}
        <div className="lg:col-span-5 space-y-5">
          <div className="aspect-4/3 rounded-lg border border-line bg-surface overflow-hidden">
            <img
              src={bundle.imageUrl}
              alt={bundle.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-brand border-brand/30">
                Combo định lượng chuẩn
              </Badge>
              <Badge variant="secondary" className="text-xs text-ink-2">
                Độ khó: {bundle.difficulty}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-ink leading-snug">
              {bundle.name}
            </h1>

            <p className="text-sm text-ink-2 leading-relaxed">
              {bundle.description}
            </p>

            {/* Key Metadata Info */}
            <div className="border border-line rounded-lg p-3.5 bg-page space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-2">
                <span className="flex items-center gap-1.5 text-ink-3">
                  <Clock className="w-4 h-4 text-brand" />
                  Thời gian thực hiện:
                </span>
                <span className="font-medium text-ink">{bundle.prepTime}</span>
              </div>

              <div className="flex items-center justify-between text-ink-2 border-t border-line/60 pt-2">
                <span className="flex items-center gap-1.5 text-ink-3">
                  <Users className="w-4 h-4 text-brand" />
                  Khẩu phần thành phẩm:
                </span>
                <span className="font-medium text-ink">{bundle.servings}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingredients Checklist Table & Cart Action */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-line rounded-lg bg-surface overflow-hidden">
            <div className="p-4 border-b border-line bg-page flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Nguyên liệu theo công thức
                </h2>
                <p className="text-xs text-ink-3">
                  Bỏ chọn những nguyên liệu bạn đã có sẵn tại nhà
                </p>
              </div>
              <span className="text-xs font-medium text-ink-2 tabular-nums">
                Đã chọn {selectedCount}/{allCount} món
              </span>
            </div>

            {/* Ingredients rows */}
            <div className="divide-y divide-line">
              {bundleProducts.map((product) => {
                const isChecked = Boolean(checkedIds[product.id])

                return (
                  <div
                    key={product.id}
                    onClick={() => toggleItem(product.id)}
                    className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer select-none ${
                      isChecked ? 'hover:bg-page/50' : 'bg-page/30 opacity-50'
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleItem(product.id)}
                      aria-label={`Chọn ${product.name}`}
                    />

                    {/* Thumbnail 48px */}
                    <div className="w-12 h-12 rounded-md border border-line bg-surface overflow-hidden shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name + unit + brand */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/san-pham/${product.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium text-ink hover:text-brand hover:underline truncate"
                        >
                          {product.name}
                        </Link>
                        {product.storageCondition !== 'ambient' && (
                          <span title="Bảo quản lạnh">
                            <Snowflake className="w-3 h-3 text-info shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-3 flex items-center gap-2">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.unit}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <Price price={product.price} size="sm" className="font-semibold text-ink" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Table Footer: Total & Add button */}
            <div className="p-4 border-t border-line bg-page space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-ink-3 block">
                    Tổng tiền nguyên liệu đã chọn:
                  </span>
                  <span className="text-xs text-ink-2">
                    {selectedCount === 0 ? 'Chưa chọn món nào' : `Bao gồm ${selectedCount} sản phẩm`}
                  </span>
                </div>

                <div className="text-right">
                  <Price price={selectedTotal} size="lg" className="text-xl font-bold text-brand" />
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={selectedCount === 0}
                onClick={handleAddSelectedToCart}
                className="w-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm {selectedCount} nguyên liệu vào giỏ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions ("Cách làm") - plain clean numbered list */}
      <div className="space-y-4 pt-6 border-t border-line">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-brand" />
            Hướng dẫn các bước thực hiện món bánh
          </h2>
          <p className="text-xs text-ink-3">
            Quy trình làm bánh từng bước chuẩn kỹ thuật để đạt mẻ bánh thơm ngon nhất
          </p>
        </div>

        <ol className="divide-y divide-line border border-line rounded-lg bg-surface">
          {bundle.instructions.map((step, idx) => (
            <li key={idx} className="p-4 flex items-start gap-4 text-xs sm:text-sm text-ink-2 leading-relaxed">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-soft text-brand font-semibold shrink-0 text-xs tabular-nums mt-0.5">
                {idx + 1}
              </span>
              <p className="flex-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
