import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react'

interface AddressItem {
  id: string
  label: string
  address: string
  isDefault: boolean
}

export const AccountAddressesPage: React.FC = () => {
  useDocumentTitle('Sổ địa chỉ giao hàng | Gia Hòa Phát Bakery Supply')

  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const [addresses, setAddresses] = useState<AddressItem[]>(
    currentUser?.addresses || [
      {
        id: 'addr-1',
        label: 'Tiệm bánh chính (Đống Đa)',
        address: 'Số 42 Ngõ 178 Tây Sơn, Đống Đa, Hà Nội',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Xưởng sản xuất bánh lạnh',
        address: 'Tầng 2, 88 Hoàng Cầu, Đống Đa, Hà Nội',
        isDefault: false,
      },
    ]
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [labelInput, setLabelInput] = useState('')
  const [addressInput, setAddressInput] = useState('')

  const handleOpenAdd = () => {
    setEditingId(null)
    setLabelInput('')
    setAddressInput('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: AddressItem) => {
    setEditingId(item.id)
    setLabelInput(item.label)
    setAddressInput(item.address)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    showToast({
      type: 'info',
      message: 'Đã xóa địa chỉ khỏi danh bạ.',
    })
  }

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
    showToast({
      type: 'success',
      message: 'Đã cập nhật địa chỉ giao hàng mặc định.',
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!labelInput.trim() || !addressInput.trim()) return

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, label: labelInput, address: addressInput } : a
        )
      )
      showToast({ type: 'success', message: 'Đã cập nhật thông tin địa chỉ.' })
    } else {
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        label: labelInput,
        address: addressInput,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddr])
      showToast({ type: 'success', message: 'Đã thêm địa chỉ giao hàng mới.' })
    }

    setDialogOpen(false)
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 space-y-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-ink">
            Sổ địa chỉ nhận hàng
          </h1>
          <p className="text-xs text-ink-3">
            Quản lý địa chỉ nhà riêng, tiệm bánh và xưởng sản xuất để thanh toán nhanh hơn
          </p>
        </div>

        <Button size="sm" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Thêm địa chỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className={`border rounded-md p-4 space-y-3 transition-colors ${
              item.isDefault
                ? 'border-brand bg-brand-soft/20'
                : 'border-line bg-page/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                {item.label}
              </span>
              {item.isDefault && (
                <Badge variant="outline" className="text-xs text-brand border-brand/40 bg-surface">
                  Mặc định
                </Badge>
              )}
            </div>

            <p className="text-xs text-ink-2 leading-relaxed min-h-[38px]">
              {item.address}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-line/60 text-xs">
              {!item.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(item.id)}
                  className="text-xs text-ink-3 hover:text-brand cursor-pointer"
                >
                  Đặt làm mặc định
                </button>
              ) : (
                <span className="text-xs text-brand font-medium">Địa chỉ giao chính</span>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(item)}
                  className="h-7 text-xs text-ink-2 hover:text-ink px-2"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Sửa
                </Button>

                {addresses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 text-xs text-ink-3 hover:text-danger hover:bg-danger-soft px-2"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ giao hàng mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="addr-label">Tên gợi nhớ địa chỉ *</Label>
              <Input
                id="addr-label"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Ví dụ: Xưởng bánh, Cửa hàng 2, Nhà riêng..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addr-detail">Địa chỉ chi tiết *</Label>
              <Input
                id="addr-detail"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Số nhà, ngõ ngách, tên đường, phường/xã, quận/huyện..."
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu địa chỉ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
