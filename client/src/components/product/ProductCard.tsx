import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types'
import { formatPrice } from '@/components/ui/price'
import { Rating } from '@/components/ui/rating'
import { useCart } from '@/context/CartContext'
import { Snowflake, Heart, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  product: Product
  className?: string
  onOpenModal?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imgError, setImgError] = useState(false)

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const bestTier =
    product.wholesaleTiers && product.wholesaleTiers.length > 0
      ? product.wholesaleTiers[product.wholesaleTiers.length - 1]
      : null

  const isCold = product.storageCondition === 'chilled' || product.storageCondition === 'frozen'
  const isOutOfStock = !product.inStock || product.stockQty <= 0
  const isLowStock = !isOutOfStock && product.stockQty <= product.lowStockThreshold

  return (
    <div
      className={cn(
        'group flex flex-col justify-between rounded-lg border border-line bg-surface hover:border-line-strong transition-colors overflow-hidden',
        className
      )}
    >
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-square w-full bg-page overflow-hidden">
          <Link to={`/san-pham/${product.id}`} className="block w-full h-full">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-page text-ink-3">
                <Package className="h-8 w-8" />
              </div>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </Link>

          {/* Discount Tag Top-Left */}
          {discountPercent !== null && (
            <span className="absolute top-2 left-2 rounded-sm bg-bad px-1.5 py-0.5 text-xs font-semibold text-white leading-none">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist Button Top-Right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            aria-label={isWishlisted ? 'Bỏ yêu thích' : 'Yêu thích'}
            className="absolute top-2 right-2 p-1.5 text-ink-2 hover:text-bad transition-colors cursor-pointer"
          >
            <Heart
              className={cn(
                'h-4.5 w-4.5 transition-colors',
                isWishlisted ? 'fill-bad text-bad' : 'text-ink-2'
              )}
            />
          </button>
        </div>

        {/* Card Body (padding 12) */}
        <div className="p-3 space-y-1">
          {/* 1. Brand */}
          <div className="text-xs text-ink-3 truncate leading-tight">
            {product.brand}
          </div>

          {/* 2. Product Name */}
          <Link
            to={`/san-pham/${product.id}`}
            className="block text-sm font-medium text-ink hover:text-brand line-clamp-2 min-h-[40px] leading-snug transition-colors"
          >
            {product.name}
          </Link>

          {/* 3. Rating */}
          <div className="py-0.5">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          {/* 4. Price */}
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base font-semibold text-ink leading-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-ink-3 line-through leading-tight">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* 5. Wholesale Tier hint */}
          <div className="h-4">
            {bestTier && bestTier.minQty > 1 ? (
              <p className="text-xs text-brand font-medium leading-none truncate">
                Từ {formatPrice(bestTier.price)} khi mua {bestTier.minQty}+
              </p>
            ) : null}
          </div>

          {/* 6. Cold Chain note */}
          <div className="h-4">
            {isCold ? (
              <span className="inline-flex items-center gap-1 text-xs text-info leading-none">
                <Snowflake className="h-3.5 w-3.5 shrink-0" />
                <span>Giao lạnh 2–8°C</span>
              </span>
            ) : null}
          </div>

          {/* 7. Expiry & Stock status */}
          <div className="text-xs leading-tight pt-0.5 truncate">
            {isOutOfStock ? (
              <span className="text-bad font-medium">Hết hàng</span>
            ) : isLowStock ? (
              <span className="text-warn font-medium">
                Chỉ còn {product.stockQty} · HSD: {product.expiryDate}
              </span>
            ) : (
              <span className="text-ink-2">HSD: {product.expiryDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3 pt-0">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addItem(product, 1)}
          className="w-full h-9 rounded-md border border-line-strong bg-surface text-ink text-xs font-medium hover:bg-page hover:border-field disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center"
        >
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}
