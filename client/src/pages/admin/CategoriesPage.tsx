import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CATEGORIES } from '@/data/categories'
import { Category } from '@/types'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminCategoriesPage: React.FC = () => {
  useDocumentTitle('Quản lý danh mục sản phẩm | Quản trị Gia Hòa Phát')

  const { showToast } = useToast()

  const [categories, setCategories] = useState<Category[]>(CATEGORIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [desc, setDesc] = useState('')

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setDesc('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c)
    setName(c.name)
    setSlug(c.slug)
    setDesc(c.description)
    setDialogOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name, slug: slug || c.slug, description: desc } : c
        )
      )
      showToast({ type: 'success', message: `Đã cập nhật danh mục “${name}”.` })
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: desc,
        iconName: 'Package',
        productCount: 0,
      }
      setCategories([...categories, newCat])
      showToast({ type: 'success', message: `Đã tạo danh mục mới “${name}”.` })
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string, catName: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    showToast({ type: 'info', message: `Đã xóa danh mục “${catName}”.` })
  }

  const columns: ColumnDef<Category>[] = [
    {
      header: 'Tên danh mục',
      cell: (c) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-ink text-sm block">{c.name}</span>
          <p className="text-xs text-ink-3 line-clamp-1">{c.description}</p>
        </div>
      ),
    },
    {
      header: 'Đường dẫn (Slug)',
      cell: (c) => <span className="font-mono text-xs text-brand">/danh-muc/{c.slug}</span>,
    },
    {
      header: <span className="block text-right">Số sản phẩm</span>,
      className: 'text-right',
      cell: (c) => (
        <span className="font-semibold text-ink tabular-nums">{c.productCount} SP</span>
      ),
    },
    {
      header: 'Trạng thái',
      cell: () => (
        <Badge variant="outline" className="text-ok border-ok/40 text-xs">
          Hiển thị
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      className: 'w-24 text-right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenEdit(c)}
            className="h-8 w-8 text-ink-2 hover:text-brand"
            title="Sửa danh mục"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(c.id, c.name)}
            className="h-8 w-8 text-ink-3 hover:text-danger hover:bg-danger-soft"
            title="Xóa danh mục"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-mono text-ink-3">SCR-A06 · QUẢN LÝ DANH MỤC</span>
          <h1 className="text-2xl font-bold text-ink">
            Cấu trúc danh mục sản phẩm
          </h1>
          <p className="text-xs text-ink-3">
            Quản lý cây danh mục nguyên liệu, phụ gia và thiết bị làm bánh trên storefront
          </p>
        </div>

        <Button size="sm" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Thêm danh mục mới
        </Button>
      </div>

      {/* 2. Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm danh mục..."
      />

      {/* 3. Table */}
      <DataTable
        data={filteredCategories}
        columns={columns}
        keyExtractor={(item) => item.id}
        totalCount={filteredCategories.length}
        totalPages={1}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Tên danh mục *</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!editingCategory) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }
                }}
                placeholder="Ví dụ: Bơ sữa & Phô mai tươi"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">Slug đường dẫn *</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bo-sua-pho-mai"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Mô tả ngắn</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Mô tả nhóm sản phẩm và ứng dụng..."
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu danh mục</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
