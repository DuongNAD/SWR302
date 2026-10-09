import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Lock, Mail, ArrowRight, UserCheck, Store, Shield } from 'lucide-react'

export const LoginPage: React.FC = () => {
  useDocumentTitle('Đăng nhập | Gia Hòa Phát Bakery Supply')

  const navigate = useNavigate()
  const { loginAs } = useAuth()
  const { showToast } = useToast()

  const [identifier, setIdentifier] = useState('maianh.baker@gmail.com')
  const [password, setPassword] = useState('••••••••')
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Prototype mode: Any valid credential logs in as customer
    loginAs('customer')
    showToast({
      type: 'success',
      message: 'Đăng nhập thành công. Chào mừng bạn quay trở lại.',
    })
    navigate('/tai-khoan')
  }

  const handleDemoLogin = (role: 'customer' | 'wholesale_client' | 'admin') => {
    loginAs(role)
    const roleLabels = {
      customer: 'Khách lẻ (Trần Mai Anh)',
      wholesale_client: 'Khách sỉ tiệm bánh (Tiệm Bánh Vàng)',
      admin: 'Quản trị viên hệ thống',
    }
    showToast({
      type: 'success',
      message: `Đã đăng nhập vai trò: ${roleLabels[role]}`,
    })
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/tai-khoan')
    }
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-ink">
          Đăng nhập tài khoản
        </h1>
        <p className="text-xs text-ink-3">
          Nhập thông tin tài khoản Gia Hòa Phát của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email hoặc Số điện thoại</Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
            <Input
              id="login-email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="email@example.com hoặc 0912..."
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <Link
              to="/quen-mat-khau"
              className="text-xs text-brand hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(c) => setRememberMe(Boolean(c))}
            />
            <span className="text-ink-2">Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Đăng nhập
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      {/* Demo Accounts Quick-Switch Block */}
      <div className="pt-2 border-t border-line space-y-3">
        <div className="text-center">
          <span className="text-xs font-semibold text-ink-3 bg-surface px-2">
            Tài khoản demo thử nghiệm
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('customer')}
            className="w-full justify-start text-xs font-normal hover:border-brand hover:text-brand"
          >
            <UserCheck className="w-3.5 h-3.5 mr-2 text-brand shrink-0" />
            <span>Khách mua lẻ · Trần Mai Anh</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('wholesale_client')}
            className="w-full justify-start text-xs font-normal hover:border-brand hover:text-brand"
          >
            <Store className="w-3.5 h-3.5 mr-2 text-brand shrink-0" />
            <span>Khách sỉ tiệm bánh · Tiệm Bánh Vàng (VAT)</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            className="w-full justify-start text-xs font-normal hover:border-brand hover:text-brand"
          >
            <Shield className="w-3.5 h-3.5 mr-2 text-brand shrink-0" />
            <span>Quản trị viên · Gia Hòa Phát Admin</span>
          </Button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-ink-3">
        <span>Chưa có tài khoản? </span>
        <Link to="/dang-ky" className="font-semibold text-brand hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  )
}
