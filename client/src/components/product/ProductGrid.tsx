import React from 'react'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'

export interface ProductGridProps {
  products: Product[]
  columns?: 3 | 4 | 5
  className?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 4,
  className,
}) => {
  const colClasses = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }[columns]

  return (
    <div className={cn('grid gap-4', colClasses, className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
