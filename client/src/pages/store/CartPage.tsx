import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCart } from '@/context/CartContext'
import { PRODUCTS } from '@/data/products'
import { CartLine } from '@/components/cart/CartLine'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/components/ui/price'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ShoppingBag, Truck, Snowflake, ArrowRight } from 'lucide-react'

export const CartPage: React.FC = () => {
  useDocumentTitle('Giỏ hàng | Gia Hòa Phát Bakery Supply')

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItemCount,
    requiresColdChain,
    isColdPackagingFree,
    freeShippingProgress,
    amountNeededForFreeShip,
  } = useCart()

  const bestSellerProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 5)
  }, [])

  if (items.length === 0) {
    return (
      <div className="wrap py-8 space-y-12">
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
              <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Empty State Card */}
        <div className="max-w-md mx-auto text-center space-y-4 py-12 px-6 border border-line rounded-lg bg-surface">
          <div className="w-16 h-16 rounded-full bg-page border border-line flex items-center justify-center mx-auto text-ink-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-ink">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              Bạn chưa thêm sản phẩm hoặc nguyên liệu làm bánh nào vào giỏ. Hãy chọn nguyên liệu tươi ngon từ Gia Hòa Phát.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild>
              <Link to="/san-pham">
                Khám phá nguyên liệu ngay
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Recommended Bestsellers */}
        <div className="space-y-4 pt-6 border-t border-line">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">
              Nguyên liệu bán chạy gợi ý cho bạn
            </h3>
            <Link to="/san-pham" className="text-xs text-brand font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>
          <ProductGrid products={bestSellerProducts} columns={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="wrap py-4 md:py-6 space-y-6">
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
            <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Giỏ hàng ({totalItemCount} sản phẩm)
          </h1>
          <p className="text-xs text-ink-3">
            Kiểm tra lại số lượng, quy cách đóng gói và điều kiện bảo quản xe lạnh
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-xs text-ink-3 hover:text-danger hover:bg-danger-soft h-8"
        >
          Xóa toàn bộ giỏ
        </Button>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Alerts + Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free shipping progress bar (4px height) */}
          <div className="border border-line rounded-lg p-3.5 bg-surface space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Truck className="w-4 h-4 text-brand" />
                {amountNeededForFreeShip > 0
                  ? `Mua thêm ${formatPrice(amountNeededForFreeShip)} để được miễn phí vận chuyển`
                  : 'Đơn hàng của bạn đã đủ điều kiện miễn phí vận chuyển tiêu chuẩn.'}
              </span>
              <span className="font-semibold text-brand tabular-nums">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cold Chain Packaging Alert */}
          {requiresColdChain && (
            <div className="border-l-2 border-info bg-info-soft p-3.5 rounded-r-md text-xs text-ink space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-info">
                <Snowflake className="w-4 h-4" />
                <span>Đơn hàng có sản phẩm chuỗi lạnh (bơ, sữa tươi, phô mai)</span>
              </div>
              <p className="text-ink-2 leading-relaxed">
                {isColdPackagingFree
                  ? 'Đơn trên 300.000₫: Bạn được MIỄN PHÍ thùng xốp và đá gel bảo quản chuyên dụng (trị giá 15.000₫).'
                  : 'Đơn có sản phẩm cần bảo quản 2–8°C được đóng gói thùng xốp đá gel và vận chuyển bằng xe lạnh (phí đóng gói 15.000₫, miễn phí từ 300.000₫).'}
              </p>
            </div>
          )}

          {/* Items Table / List */}
          <div className="border border-line rounded-lg bg-surface p-4">
            <div className="divide-y divide-line">
              {items.map((item) => (
                <CartLine
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.product.id, qty)}
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
