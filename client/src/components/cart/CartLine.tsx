import React from 'react'
import { Link } from 'react-router-dom'
import { CartItem } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { ProductImage } from '@/components/ui/product-image'
import { Button } from '@/components/ui/button'
import { Snowflake, Trash2, ArrowUpRight } from 'lucide-react'

interface CartLineProps {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export const CartLine: React.FC<CartLineProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity, selectedPrice } = item

  // Calculate next wholesale tier hint
  const nextTierHint = React.useMemo(() => {
    if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) return null
    // Sort tiers ascending by minQty
    const sorted = [...product.wholesaleTiers].sort((a, b) => a.minQty - b.minQty)
    // Find first tier where minQty > quantity
    const nextTier = sorted.find((t) => t.minQty > quantity)
    if (!nextTier) return null

    const neededQty = nextTier.minQty - quantity
    return {
      neededQty,
      nextPrice: nextTier.price,
      unit: product.unit,
    }
  }, [product, quantity])

  return (
    <div className="py-4 border-b border-line space-y-2.5">
      <div className="flex items-start gap-4">
        {/* 64px Thumbnail */}
        <Link
          to={`/san-pham/${product.id}`}
          className="w-16 h-16 rounded-md border border-line bg-page overflow-hidden shrink-0 block"
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Product details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <Link
              to={`/san-pham/${product.id}`}
              className="text-sm font-semibold text-ink hover:text-brand transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
            <span className="text-xs font-mono text-ink-3">SKU: {product.sku}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
            <span>{product.brand}</span>
            <span>•</span>
            <span>{product.unit}</span>
            {product.storageCondition !== 'ambient' && (
              <>
                <span>•</span>
                <span className="text-info flex items-center gap-1 font-medium">
                  <Snowflake className="w-3 h-3" />
                  {product.storageCondition === 'frozen' ? 'Bảo quản đông' : 'Bảo quản mát 2–8°C'}
                </span>
              </>
            )}
          </div>

          {/* Controls: Price + Stepper + Line total + Delete */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-ink-3">Đơn giá:</span>
              <Price price={selectedPrice} size="sm" className="font-medium text-ink" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <QuantityStepper
                value={quantity}
                min={1}
                max={Math.max(1, product.stockQty)}
                onChange={onUpdateQuantity}
              />

              <div className="min-w-[64px] text-right">
                <Price
                  price={selectedPrice * quantity}
                  size="sm"
                  className="font-bold text-brand"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Xóa ${product.name} khỏi giỏ`}
                title="Xóa sản phẩm"
                className="h-8 w-8 text-ink-3 hover:text-danger hover:bg-danger-soft cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Next wholesale tier hint */}
      {nextTierHint && (
        <div className="ml-0 sm:ml-20 text-xs text-brand bg-brand-soft/60 px-2.5 py-1 rounded-sm inline-flex items-center gap-1 font-medium">
          <ArrowUpRight className="w-3 h-3 shrink-0" />
          <span>
            Mua thêm {nextTierHint.neededQty} {nextTierHint.unit} để giá sỉ chỉ còn {formatPrice(nextTierHint.nextPrice)}
          </span>
        </div>
      )}
    </div>
  )
}
