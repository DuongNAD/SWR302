import React, { useState, useMemo, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { getEquipmentExtra } from '@/mocks/productExtras'
import { getStoreAvailability } from '@/mocks/stores'
import { WholesaleTierTable } from '@/components/product/WholesaleTierTable'
import { StorageNote } from '@/components/product/StorageNote'
import { ReviewList } from '@/components/product/ReviewList'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Price } from '@/components/ui/price'
import { Rating } from '@/components/ui/rating'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  Snowflake,
  ShieldCheck,
  Store,
  ChevronRight,
  Maximize2,
  ChefHat,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { NotFoundPage } from '@/pages/store/NotFoundPage'

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()

  // Find product by id or slug
  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === id || p.sku.toLowerCase() === id?.toLowerCase())
  }, [id])

  useDocumentTitle(product ? `${product.name} | Gia Hòa Phát` : 'Chi tiết sản phẩm')

  const [qty, setQty] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('desc')

  const reviewsTabRef = useRef<HTMLDivElement>(null)

  if (!product) {
    return <NotFoundPage />
  }

  // Current tier price calculation
  let currentTierInfo = { price: product.price, discountPercent: 0 }
  if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
    const sorted = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty)
    for (let i = 0; i < sorted.length; i++) {
      if (qty >= sorted[i].minQty) {
        currentTierInfo = {
          price: sorted[i].price,
          discountPercent: sorted[i].discountPercent,
        }
        break
      }
    }
  }

  // Equipment extras (if machine category)
  const equipmentExtra = getEquipmentExtra(product.id)
  const storeAvailability = getStoreAvailability(product.id, product.stockQty)

  const category = CATEGORIES.find((c) => c.id === product.categoryId)
  const galleryImages = [product.imageUrl].filter(Boolean)

  const sameCategoryProducts = PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  )
  let relatedProducts = sameCategoryProducts.slice(0, 5)
  let relatedTitle = 'Sản phẩm cùng danh mục'

  if (sameCategoryProducts.length < 4) {
    const supplement = PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.categoryId !== product.categoryId &&
        p.storageCondition === product.storageCondition
    )
    relatedProducts = [...sameCategoryProducts, ...supplement].slice(0, 4)
    relatedTitle = 'Có thể bạn cần'
  }

  const handleAddToCart = () => {
    if (!product.inStock) return
    addItem(product, qty)
    showToast({
      type: 'success',
      message: `Đã thêm ${qty} ${product.unit} “${product.name}” vào giỏ hàng`,
    })
  }

  const handleBuyNow = () => {
    if (!product.inStock) return
    addItem(product, qty)
    navigate('/thanh-toan')
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToast({
      type: 'info',
      message: !isWishlisted
        ? `Đã thêm “${product.name}” vào danh sách yêu thích`
        : `Đã gỡ “${product.name}” khỏi danh sách yêu thích`,
    })
  }

  const scrollToReviews = () => {
    setActiveTab('reviews')
    reviewsTabRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : currentTierInfo.discountPercent > 0
      ? currentTierInfo.discountPercent
      : null

  const isLowStock = product.inStock && product.stockQty <= product.lowStockThreshold

  return (
    <div className="wrap py-4 md:py-6 space-y-8 pb-24 lg:pb-8">
      {/* 1. Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/san-pham?danh-muc=${category.id}`}>{category.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Main Product Info (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative aspect-square rounded-lg border border-line bg-surface overflow-hidden group">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              {discountPercent && discountPercent > 0 && (
                <Badge variant="default" className="bg-brand text-white border-none font-semibold text-xs">
                  -{discountPercent}%
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-line text-xs">
                  Bán chạy
                </Badge>
              )}
              {product.storageCondition !== 'ambient' && (
                <Badge variant="secondary" className="bg-sky-50 text-info border-sky-200 text-xs flex items-center gap-1">
                  <Snowflake className="w-3 h-3" />
                  {product.storageCondition === 'frozen' ? 'Đông lạnh ≤ -18°C' : 'Bảo quản mát 2–8°C'}
                </Badge>
              )}
            </div>

            {/* Lightbox trigger */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Xem ảnh phóng to"
              className="absolute bottom-3 right-3 p-2 bg-surface/90 hover:bg-surface border border-line rounded-md text-ink-2 hover:text-ink shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-16 h-16 rounded-md border-2 border-brand overflow-hidden p-0.5"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xs"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box */}
        <div className="lg:col-span-7 space-y-5">
          {/* Brand & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <Link
                to={`/san-pham?thuong-hieu=${encodeURIComponent(product.brand)}`}
                className="text-xs font-semibold text-brand hover:underline"
              >
                {product.brand}
              </Link>
              <span className="text-xs text-ink-3 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl font-semibold text-ink leading-snug">
              {product.name}
            </h1>

            {/* Rating link to reviews tab */}
            <div className="flex items-center gap-3 text-xs pt-0.5">
              <button
                type="button"
                onClick={scrollToReviews}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Rating rating={product.rating} reviewCount={product.reviewCount} />
              </button>
              <span className="text-line">•</span>
              <span className="text-ink-2">Xuất xứ: {product.origin}</span>
              <span className="text-line">•</span>
              <span className="text-ink-2">Quy cách: {product.unit}</span>
            </div>
          </div>

          {/* Khối 1: Giá + Bảng giá bậc thang */}
          <div className="rounded-lg bg-page border border-line p-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <Price
                  price={currentTierInfo.price}
                  size="lg"
                  className="text-2xl font-bold text-brand"
                />
                {product.originalPrice && product.originalPrice > currentTierInfo.price && (
                  <Price
                    price={product.originalPrice}
                    size="sm"
                    originalPrice={product.originalPrice}
                    className="text-sm text-ink-3"
                  />
                )}
                {discountPercent && discountPercent > 0 && (
                  <Badge variant="outline" className="text-xs text-brand border-brand/30">
                    Tiết kiệm {discountPercent}%
                  </Badge>
                )}
              </div>
              <p className="text-xs text-ink-3">
                Giá niêm yết đã bao gồm thuế GTGT (VAT 8% - 10%). Hỗ trợ xuất hóa đơn điện tử cho tiệm bánh.
              </p>
            </div>

            {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
              <div className="pt-3 border-t border-line">
                <WholesaleTierTable
                  tiers={product.wholesaleTiers}
                  currentQty={qty}
                  unit={product.unit}
                  onSelectQty={(minQty) => setQty(minQty)}
                />
              </div>
            )}
          </div>

          {/* Khối 2: Ghi chú bảo quản */}
          <StorageNote condition={product.storageCondition} />

          {/* Phân cách đường kẻ: Tồn kho & Đặt mua */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-3 border-y border-line text-xs">
            <div>
              <span className="text-ink-3 block text-xs">Tình trạng kho:</span>
              {product.inStock ? (
                isLowStock ? (
                  <span className="font-semibold text-warn flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Chỉ còn {product.stockQty} {product.unit}
                  </span>
                ) : (
                  <span className="font-medium text-ok flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Còn hàng ({product.stockQty} {product.unit})
                  </span>
                )
              ) : (
                <span className="font-semibold text-ink-3">Tạm hết hàng</span>
              )}
            </div>

            <div>
              <span className="text-ink-3 block text-xs">Hạn sử dụng (HSD):</span>
              <span className="font-medium text-ink tabular-nums">{product.expiryDate}</span>
            </div>

            <div>
              <span className="text-ink-3 block text-xs">Mã lô sản xuất:</span>
              <span className="font-mono text-ink text-xs">{product.batchNumber}</span>
            </div>
          </div>

          {/* Nút hành động mua */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-2 font-medium">Số lượng:</span>
                <QuantityStepper
                  value={qty}
                  min={1}
                  max={Math.max(1, product.stockQty)}
                  onChange={setQty}
                  disabled={!product.inStock}
                />
              </div>

              <div className="text-xs text-ink-3">
                Thành tiền:{' '}
                <span className="font-semibold text-ink tabular-nums">
                  <Price price={currentTierInfo.price * qty} size="sm" />
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-1">
              <Button
                type="button"
                size="lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1 min-w-[140px] px-4"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!product.inStock}
                onClick={handleBuyNow}
                className="flex-1 min-w-[120px] px-4 border-brand text-brand hover:bg-brand-soft"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mua ngay
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleToggleWishlist}
                aria-label="Thêm vào danh sách yêu thích"
                className={`h-11 w-11 shrink-0 ${
                  isWishlisted ? 'text-brand border-brand' : 'text-ink-3 hover:text-ink'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand text-brand' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Khối 3: Giao hàng và tình trạng cửa hàng */}
          <div className="rounded-lg border border-line p-3.5 bg-surface text-xs space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-ink-2">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Truck className="w-4 h-4 text-brand shrink-0" />
                  Giao hàng tiêu chuẩn:
                </span>
                <span>24–48 giờ · 25.000₫ (Miễn phí từ 500k)</span>
              </div>
              {product.storageCondition !== 'ambient' && (
                <div className="flex items-center justify-between text-info border-t border-line/60 pt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Snowflake className="w-4 h-4 text-info shrink-0" />
                    Giao xe lạnh chuyên dụng:
                  </span>
                  <span>2–4 giờ · 45.000₫ (Thùng xốp đá gel)</span>
                </div>
              )}
            </div>

            <div className="border-t border-line/60 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-brand" />
                  Tình trạng tại cửa hàng
                </span>
                <Link to="/cua-hang" className="text-xs text-brand hover:underline flex items-center">
                  Xem hệ thống <ChevronRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>

              <div className="divide-y divide-line/60">
                {storeAvailability.slice(0, 3).map(({ store, status, qtyHint }) => (
                  <div key={store.id} className="py-1.5 flex items-center justify-between">
                    <span className="text-ink-2 truncate pr-2">{store.name}</span>
                    <span
                      className={`shrink-0 font-medium tabular-nums ${
                        status === 'Còn hàng'
                          ? 'text-ok'
                          : status === 'Sắp hết'
                          ? 'text-warn'
                          : 'text-ink-3'
                      }`}
                    >
                      {qtyHint}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Underline Tabs: Description, Ingredients, Storage & Usage, Specifications, Reviews */}
      <div ref={reviewsTabRef} className="pt-4 border-t border-line">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto max-w-full">
            <TabsList className="border-b border-line bg-transparent p-0 w-full min-w-max justify-start rounded-none h-auto gap-6">
            <TabsTrigger
              value="desc"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:text-brand px-1 py-3 text-sm font-semibold bg-transparent shadow-none"
            >
              Mô tả chi tiết
            </TabsTrigger>
            <TabsTrigger
              value="ingredients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:text-brand px-1 py-3 text-sm font-semibold bg-transparent shadow-none"
            >
              Thành phần
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:text-brand px-1 py-3 text-sm font-semibold bg-transparent shadow-none"
            >
              Bảo quản và sử dụng
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:text-brand px-1 py-3 text-sm font-semibold bg-transparent shadow-none"
            >
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:text-brand px-1 py-3 text-sm font-semibold bg-transparent shadow-none"
            >
              Đánh giá ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
        </div>

          {/* Tab 1: Description */}
          <TabsContent value="desc" className="focus-visible:outline-none">
            <div className="prose prose-stone max-w-none text-ink-2 text-sm leading-relaxed space-y-4">
              <p>{product.description}</p>
              <div className="p-4 bg-page border border-line rounded-lg space-y-2">
                <h4 className="font-semibold text-ink text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-ok" />
                  Tiêu chuẩn chất lượng tại Gia Hòa Phát
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-ink-2">
                  <li>Sản phẩm có nguồn gốc xuất xứ rõ ràng, đầy đủ hồ sơ công bố an toàn thực phẩm.</li>
                  <li>Hạn sử dụng luôn đảm bảo tối thiểu trên 60% thời hạn kể từ ngày sản xuất.</li>
                  <li>Vận chuyển bằng xe lạnh đối với bơ, kem sữa tươi, phô mai đảm bảo nhiệt độ chuẩn 2–8°C.</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Ingredients */}
          <TabsContent value="ingredients" className="focus-visible:outline-none">
            <div className="bg-surface border border-line rounded-lg p-5 space-y-3">
              <h4 className="font-semibold text-ink text-sm">Thành phần cấu tạo</h4>
              <p className="text-sm text-ink-2 leading-relaxed">
                {product.ingredients || 'Thành phần theo công bố quy cách tiêu chuẩn của nhà sản xuất ghi trên nhãn phụ.'}
              </p>
            </div>
          </TabsContent>

          {/* Tab 3: Storage & Usage */}
          <TabsContent value="usage" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-line rounded-lg p-5 space-y-2">
                <h4 className="font-semibold text-ink text-sm flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-info" />
                  Hướng dẫn bảo quản
                </h4>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {product.storageInstructions}
                </p>
              </div>

              <div className="bg-surface border border-line rounded-lg p-5 space-y-2">
                <h4 className="font-semibold text-ink text-sm">Hướng dẫn sử dụng</h4>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {product.usageGuide}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Specifications */}
          <TabsContent value="specs" className="focus-visible:outline-none">
            <div className="border border-line rounded-lg overflow-hidden bg-surface">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-line">
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3 w-1/3">Thương hiệu</td>
                    <td className="py-2.5 px-4 text-ink font-semibold">{product.brand}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Xuất xứ</td>
                    <td className="py-2.5 px-4 text-ink">{product.origin}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Quy cách đóng gói</td>
                    <td className="py-2.5 px-4 text-ink">{product.unit}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Khối lượng tịnh</td>
                    <td className="py-2.5 px-4 text-ink tabular-nums">{product.weightKg} kg</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Mã SKU</td>
                    <td className="py-2.5 px-4 text-ink font-mono">{product.sku}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Hạn sử dụng</td>
                    <td className="py-2.5 px-4 text-ink tabular-nums">{product.expiryDate}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Lô sản xuất</td>
                    <td className="py-2.5 px-4 text-ink font-mono">{product.batchNumber}</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-4 font-medium text-ink-3">Điều kiện bảo quản</td>
                    <td className="py-2.5 px-4 text-ink">
                      {product.storageCondition === 'frozen'
                        ? 'Đông lạnh ≤ -18°C'
                        : product.storageCondition === 'chilled'
                        ? 'Bảo quản mát 2–8°C'
                        : 'Nơi khô ráo thoáng mát, tránh ánh nắng trực tiếp'}
                    </td>
                  </tr>

                  {/* Machinery / Equipment Extras */}
                  {equipmentExtra && (
                    <>
                      <tr className="hover:bg-page/50 bg-brand-soft/30">
                        <td className="py-2.5 px-4 font-semibold text-brand">Thời hạn bảo hành</td>
                        <td className="py-2.5 px-4 text-ink font-semibold">{equipmentExtra.warranty}</td>
                      </tr>
                      <tr className="hover:bg-page/50">
                        <td className="py-2.5 px-4 font-medium text-ink-3">Công suất máy</td>
                        <td className="py-2.5 px-4 text-ink">{equipmentExtra.power}</td>
                      </tr>
                      <tr className="hover:bg-page/50">
                        <td className="py-2.5 px-4 font-medium text-ink-3">Kích thước (D × R × C)</td>
                        <td className="py-2.5 px-4 text-ink font-mono">{equipmentExtra.dimensions}</td>
                      </tr>
                      {equipmentExtra.capacity && (
                        <tr className="hover:bg-page/50">
                          <td className="py-2.5 px-4 font-medium text-ink-3">Dung tích / Khay chứa</td>
                          <td className="py-2.5 px-4 text-ink">{equipmentExtra.capacity}</td>
                        </tr>
                      )}
                      {equipmentExtra.voltage && (
                        <tr className="hover:bg-page/50">
                          <td className="py-2.5 px-4 font-medium text-ink-3">Điện áp sử dụng</td>
                          <td className="py-2.5 px-4 text-ink">{equipmentExtra.voltage}</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab 5: Reviews */}
          <TabsContent value="reviews" className="focus-visible:outline-none">
            <ReviewList
              productId={product.id}
              productRating={product.rating}
              reviewCount={product.reviewCount}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* 4. Suggested Recipes (Món bánh phù hợp) */}
      {product.suggestedRecipes && product.suggestedRecipes.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-line">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-brand" />
                Món bánh phù hợp với nguyên liệu này
              </h3>
              <p className="text-xs text-ink-3">
                Các set combo nguyên liệu làm bánh định lượng chuẩn sử dụng {product.name}
              </p>
            </div>
            <Link to="/combo" className="text-xs text-brand font-medium hover:underline flex items-center">
              Xem tất cả combo <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {product.suggestedRecipes.map((recipe, index) => (
              <Link
                key={index}
                to="/combo"
                className="px-3.5 py-2 rounded-md border border-line bg-surface hover:border-brand hover:text-brand text-xs font-medium transition-colors"
              >
                {recipe}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-line">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">{relatedTitle}</h3>
            {category && (
              <Link
                to={`/san-pham?danh-muc=${category.id}`}
                className="text-xs text-brand font-medium hover:underline flex items-center"
              >
                Xem thêm trong danh mục <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}
          </div>

          <ProductGrid products={relatedProducts} columns={5} />
        </div>
      )}

      {/* 6. Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 border-t border-line p-3 shadow-pop">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-ink-3 block">Đơn giá ({product.unit})</span>
            <Price price={currentTierInfo.price} size="md" className="font-bold text-brand" />
          </div>

          <div className="flex items-center gap-2">
            <QuantityStepper
              value={qty}
              min={1}
              max={Math.max(1, product.stockQty)}
              onChange={setQty}
              disabled={!product.inStock}
            />

            <Button
              size="sm"
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className="px-4"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Thêm giỏ
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-2xl p-2 bg-surface">
          <div className="aspect-square w-full rounded-md overflow-hidden bg-page">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
