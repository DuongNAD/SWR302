import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Download } from 'lucide-react'

interface DataTableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filterSlot?: React.ReactNode
  actionSlot?: React.ReactNode
  onExportCsv?: () => void
  onResetFilters?: () => void
  hasActiveFilters?: boolean
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  filterSlot,
  actionSlot,
  onExportCsv,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search input with search icon */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-ink-3 absolute left-2.5 top-2.5" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 h-9 text-xs bg-surface"
          />
        </div>

        {/* Custom filter select boxes */}
        {filterSlot}

        {/* Reset active filters button */}
        {hasActiveFilters && onResetFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 text-xs text-ink-3 hover:text-ink px-2"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Right action buttons: CSV Export and Add */}
      <div className="flex items-center gap-2">
        {onExportCsv && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-9 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Xuất CSV
          </Button>
        )}

        {actionSlot}
      </div>
    </div>
  )
}
