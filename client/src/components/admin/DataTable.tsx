import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'

export interface ColumnDef<T> {
  header: React.ReactNode
  accessorKey?: keyof T
  cell?: (item: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor: (item: T, index: number) => string
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalCount?: number
  pageSize?: number
  selectedIds?: string[]
  onSelectAll?: (selected: boolean) => void
  onSelectRow?: (id: string, selected: boolean) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalCount,
  pageSize = 10,
  emptyMessage = 'Không tìm thấy bản ghi nào phù hợp',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table container with horizontal scroll overflow */}
      <div className="border border-line rounded-lg overflow-x-auto bg-surface shadow-xs">
        <Table className="w-full text-xs">
          <TableHeader className="bg-page border-b border-line">
            <TableRow className="hover:bg-transparent">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={`py-3 px-3.5 text-ink-2 font-semibold text-xs whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-line">
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-ink-3 space-y-2"
                >
                  <Inbox className="w-8 h-8 mx-auto text-ink-3" />
                  <p>{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIdx) => (
                <TableRow
                  key={keyExtractor(item, rowIdx)}
                  className="hover:bg-page/50 transition-colors h-12"
                >
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={`py-2.5 px-3.5 text-ink whitespace-nowrap ${col.className || ''}`}
                    >
                      {col.cell
                        ? col.cell(item, rowIdx)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && onPageChange && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1 text-xs text-ink-2">
          <div>
            {typeof totalCount === 'number' && (
              <span>
                Hiển thị{' '}
                <strong className="text-ink tabular-nums">
                  {Math.min(totalCount, (currentPage - 1) * pageSize + 1)}–
                  {Math.min(totalCount, currentPage * pageSize)}
                </strong>{' '}
                trên <strong className="text-ink tabular-nums">{totalCount}</strong> kết quả
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              Trước
            </Button>

            <span className="px-2 font-medium text-ink tabular-nums">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-2 text-xs"
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
