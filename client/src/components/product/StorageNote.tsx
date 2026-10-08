import React from 'react'
import { Snowflake } from 'lucide-react'
import { StorageCondition } from '@/types'

interface StorageNoteProps {
  condition: StorageCondition
  className?: string
}

export const StorageNote: React.FC<StorageNoteProps> = ({ condition, className = '' }) => {
  if (condition === 'ambient') return null

  const isFrozen = condition === 'frozen'

  return (
    <div
      role="note"
      aria-label="Lưu ý bảo quản chuỗi lạnh"
      className={`border-l-2 border-info bg-info-soft px-3 py-2.5 rounded-r-md flex items-start gap-2.5 text-xs text-ink ${className}`}
    >
      <Snowflake className="w-4 h-4 text-info shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="font-semibold text-info">
          {isFrozen ? 'Bảo quản đông lạnh (≤ -18°C)' : 'Bảo quản mát (2–8°C)'}
        </p>
        <p className="text-ink-2 leading-relaxed">
          {isFrozen
            ? 'Cần bảo quản đông lạnh. Đơn có sản phẩm này được đóng thùng xốp đá gel và giao bằng xe lạnh chuyên dụng.'
            : 'Cần bảo quản 2–8°C. Đơn có sản phẩm này được đóng túi cách nhiệt và giao bằng xe lạnh.'}
        </p>
      </div>
    </div>
  )
}
