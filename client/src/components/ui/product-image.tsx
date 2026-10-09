import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt = '',
  className,
  fallbackSrc = './img/placeholder.svg',
  loading = 'lazy',
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const isFailed = Boolean(src && failedSrc === src)
  const effectiveSrc = isFailed ? fallbackSrc : (src || fallbackSrc)

  const handleError = () => {
    if (src) {
      setFailedSrc(src)
    }
  }

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={cn('object-cover', className)}
      {...props}
    />
  )
}
