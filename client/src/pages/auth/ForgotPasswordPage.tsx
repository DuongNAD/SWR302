import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  useDocumentTitle('Khôi phục mật khẩu | Gia Hòa Phát Bakery Supply')

  const [identifier, setIdentifier] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setIsSubmitted(true)
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
      {!isSubmitted ? (
        <div className="space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-ink">
              Khôi phục mật khẩu
            </h1>
            <p className="text-xs text-ink-3 leading-relaxed">
              Nhập email hoặc số điện thoại liên kết với tài khoản của bạn để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email hoặc Số điện thoại</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
                <Input
                  id="forgot-email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="email@example.com hoặc 0912..."
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Gửi liên kết đặt lại
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-ink-3">
            <Link
              to="/dang-nhap"
              className="inline-flex items-center text-ink-2 hover:text-brand font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      ) : (
        /* In-place success state */
        <div className="text-center space-y-5">
          <CheckCircle2 className="w-12 h-12 text-ok mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-ink">Đã gửi hướng dẫn</h2>
            <p className="text-xs text-ink-2 leading-relaxed">
              Chúng tôi đã gửi đường dẫn đặt lại mật khẩu tới{' '}
              <strong className="text-ink">{identifier}</strong>. Vui lòng kiểm tra hộp thư đến hoặc tin nhắn SMS.
            </p>
          </div>

          <div className="pt-2">
            <Button asChild size="lg" className="w-full">
              <Link to="/dang-nhap">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
