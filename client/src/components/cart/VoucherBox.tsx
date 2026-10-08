import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tag, X, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/components/ui/price'

export const VoucherBox: React.FC = () => {
  const { appliedVoucher, applyVoucher, removeVoucher } = useCart()
  const [inputCode, setInputCode] = useState('')

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const success = applyVoucher(inputCode.trim())
    if (success) {
      setInputCode('')
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-brand" />
          Mã giảm giá / Voucher
        </span>
        <span className="text-xs text-ink-3">Thử: BAKING2026, GHPVIP, FREESHIP</span>
      </div>

      {appliedVoucher ? (
        <div className="p-3 bg-brand-soft border border-brand/40 rounded-md flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-brand">
                {appliedVoucher.code}
              </span>
              <Badge variant="outline" className="text-xs text-ok border-ok/40 gap-1 py-0">
                <Check className="w-2.5 h-2.5" />
                Đã giảm {formatPrice(appliedVoucher.discountAmount)}
              </Badge>
            </div>
            <p className="text-xs text-ink-2">{appliedVoucher.description}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeVoucher}
            className="h-7 text-xs text-ink-3 hover:text-danger hover:bg-surface px-2"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Bỏ
          </Button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <Input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã ưu đãi..."
            className="font-mono text-xs h-9 bg-surface"
          />
          <Button type="submit" variant="outline" size="sm" className="h-9 px-4 shrink-0 font-medium">
            Áp dụng
          </Button>
        </form>
      )}
    </div>
  )
}
