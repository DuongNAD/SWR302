import React from 'react'
import { WholesaleTier } from '@/types'
import { Price } from '@/components/ui/price'
import { Check } from 'lucide-react'

interface WholesaleTierTableProps {
  tiers: WholesaleTier[]
  currentQty: number
  unit: string
  onSelectQty?: (minQty: number) => void
}

export const WholesaleTierTable: React.FC<WholesaleTierTableProps> = ({
  tiers,
  currentQty,
  unit,
  onSelectQty,
}) => {
  if (!tiers || tiers.length === 0) return null

  // Sort ascending by minQty
  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty)

  // Determine active tier based on currentQty
  // Active tier is the highest tier where currentQty >= tier.minQty
  let activeIndex = -1
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (currentQty >= sorted[i].minQty) {
      activeIndex = i
      break
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink">Bảng giá sỉ bậc thang</span>
        <span className="text-xs text-ink-3">Bấm vào dòng để chọn nhanh</span>
      </div>

      <div className="border border-line rounded-md overflow-hidden bg-surface">
        <table className="w-full text-xs text-left">
          <thead className="bg-page text-ink-2 font-medium border-b border-line">
            <tr>
              <th className="py-2 px-3">Số lượng ({unit})</th>
              <th className="py-2 px-3">Đơn giá</th>
              <th className="py-2 px-3 text-right">Tiết kiệm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((tier, idx) => {
              const isActive = idx === activeIndex
              return (
                <tr
                  key={tier.minQty}
                  onClick={() => onSelectQty && onSelectQty(tier.minQty)}
                  className={`transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-brand-soft text-brand font-semibold'
                      : 'hover:bg-page text-ink'
                  }`}
                >
                  <td className="py-2 px-3 flex items-center gap-1.5">
                    {isActive ? (
                      <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 inline-block" />
                    )}
                    <span>Từ {tier.minQty} {unit}</span>
                  </td>
                  <td className="py-2 px-3 tabular-nums">
                    <Price price={tier.price} size="sm" className={isActive ? 'text-brand' : 'text-ink'} />
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-ok">
                    -{tier.discountPercent}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
