import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  rating: number
  reviewCount?: number
  className?: string
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  className,
}) => {
  return (
    <div className={cn('inline-flex items-center gap-1 text-[13px] text-ink-2 tabular-nums', className)}>
      <Star className="h-3.5 w-3.5 fill-warn text-warn shrink-0" />
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {typeof reviewCount === 'number' && (
        <span className="text-ink-3">({reviewCount})</span>
      )}
    </div>
  )
}
