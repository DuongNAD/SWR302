import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'

export const AccountProfilePage: React.FC = () => {
  useDocumentTitle('Hồ sơ & bảo mật | Gia Hòa Phát Bakery Supply')

  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState(currentUser?.name || 'Trần Mai Anh')
  const [email, setEmail] = useState(currentUser?.email || 'maianh.baker@gmail.com')
  const [phone, setPhone] = useState(currentUser?.phone || '0912 345 678')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      type: 'success',
      message: 'Đã cập nhật thông tin cá nhân thành công!',
    })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim()) {
      showToast({ type: 'error', message: 'Vui lòng nhập mật khẩu mới!' })
      return
    }
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' })
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showToast({
      type: 'success',
      message: 'Đã thay đổi mật khẩu tài khoản thành công!',
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Personal Information Form */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h1 className="text-xl font-bold text-ink">
            Thông tin cá nhân
          </h1>
          <p className="text-xs text-ink-3">
            Cập nhật tên hiển thị, địa chỉ email và số điện thoại liên hệ
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="prof-name">Họ và tên *</Label>
              <Input
                id="prof-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-phone">Số điện thoại *</Label>
              <Input
                id="prof-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-email">Địa chỉ email *</Label>
              <Input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="sm">
              Lưu thay đổi hồ sơ
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Password & Security Section */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand" />
            Đổi mật khẩu tài khoản
          </h2>
          <p className="text-xs text-ink-3">
            Nên sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường, số và ký tự đặc biệt
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="curr-pass">Mật khẩu hiện tại</Label>
            <Input
              id="curr-pass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-pass">Mật khẩu mới</Label>
            <Input
              id="new-pass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conf-pass">Xác nhận mật khẩu mới</Label>
            <Input
              id="conf-pass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="pt-2 flex justify-start">
            <Button type="submit" variant="outline" size="sm">
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
