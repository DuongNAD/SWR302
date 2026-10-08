import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuantityStepperProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 9999,
  disabled = false,
  size = 'md',
  className,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10)
    if (isNaN(raw)) {
      onChange(min)
    } else {
      const clamped = Math.min(Math.max(raw, min), max)
      onChange(clamped)
    }
  }

  const heightClass = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm'
  const btnWidthClass = size === 'sm' ? 'w-8' : 'w-10'

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-field bg-surface text-ink transition-colors',
        disabled && 'opacity-50 pointer-events-none',
        heightClass,
        className
      )}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          'flex h-full items-center justify-center text-ink hover:bg-page transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
          btnWidthClass
        )}
        aria-label="Giảm số lượng"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-12 h-full text-center tabular-nums font-medium bg-transparent border-x border-field text-ink focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Số lượng"
      />

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          'flex h-full items-center justify-center text-ink hover:bg-page transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
          btnWidthClass
        )}
        aria-label="Tăng số lượng"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
