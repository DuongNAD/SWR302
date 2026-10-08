import React from 'react'
import { cn } from '@/lib/utils'

export interface PriceProps {
  price: number
  originalPrice?: number
  wholesalePrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫'
}

export const Price: React.FC<PriceProps> = ({
  price,
  originalPrice,
  wholesalePrice,
  size = 'md',
  className,
}) => {
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-2xl sm:text-[28px] font-bold',
  }[size]

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2 tabular-nums', className)}>
      <span className={cn('text-ink font-bold leading-tight', sizeClasses)}>
        {formatPrice(price)}
      </span>

      {originalPrice && originalPrice > price && (
        <>
          <span className="text-xs text-ink-3 line-through">
            {formatPrice(originalPrice)}
          </span>
          {discountPercent !== null && (
            <span className="inline-flex items-center rounded-sm bg-bad-soft px-1.5 py-0.5 text-xs font-medium text-bad border border-bad/20 leading-none">
              -{discountPercent}%
            </span>
          )}
        </>
      )}

      {wholesalePrice && (
        <span className="text-xs text-brand font-medium">
          Giá sỉ: {formatPrice(wholesalePrice)}
        </span>
      )}
    </div>
  )
}
