import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { User, Store, ArrowRight, ArrowLeft, Phone } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  useDocumentTitle('Đăng ký tài khoản | Gia Hòa Phát Bakery Supply')

  const navigate = useNavigate()
  const { loginAs } = useAuth()
  const { showToast } = useToast()

  const [stage, setStage] = useState<'info' | 'otp'>('info')
  const [accountType, setAccountType] = useState<'customer' | 'wholesale'>('customer')

  // Form states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [taxCode, setTaxCode] = useState('')

  // OTP states
  const [otpValue, setOtpValue] = useState('')
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (stage === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [stage, countdown])

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !password.trim()) {
      showToast({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' })
      return
    }
    setStage('otp')
    setCountdown(60)
    showToast({
      type: 'info',
      message: `Đã gửi mã OTP 6 số tới số điện thoại ${phone}`,
    })
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) {
      showToast({ type: 'error', message: 'Vui lòng nhập đủ 6 chữ số OTP!' })
      return
    }

    // Accepts any 6 digits in prototype
    const targetRole = accountType === 'wholesale' ? 'wholesale_client' : 'customer'
    loginAs(targetRole)
    showToast({
      type: 'success',
      message: `Đăng ký thành công! Chào mừng ${name} đến với Gia Hòa Phát.`,
    })
    navigate('/tai-khoan')
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
      {stage === 'info' ? (
        <div className="space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-ink">
              Đăng ký tài khoản
            </h1>
            <p className="text-xs text-ink-3">
              Gia nhập cộng đồng thợ làm bánh và tiệm bánh chuyên nghiệp
            </p>
          </div>

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-page border border-line rounded-md">
            <button
              type="button"
              onClick={() => setAccountType('customer')}
              className={`py-2 px-3 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                accountType === 'customer'
                  ? 'bg-surface text-brand shadow-xs border border-line'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Khách mua lẻ
            </button>

            <button
              type="button"
              onClick={() => setAccountType('wholesale')}
              className={`py-2 px-3 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                accountType === 'wholesale'
                  ? 'bg-surface text-brand shadow-xs border border-line'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Chủ tiệm bánh (Sỉ)
            </button>
          </div>

          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Họ và tên của bạn *</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Trần Mai Anh"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-phone">Số điện thoại *</Label>
              <Input
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email (tùy chọn)</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tiembanh@example.com"
              />
            </div>

            {accountType === 'wholesale' && (
              <>
                <div className="space-y-1.5 pt-1 border-t border-line/60">
                  <Label htmlFor="reg-business">Tên tiệm bánh / Doanh nghiệp</Label>
                  <Input
                    id="reg-business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ví dụ: Tiệm Bánh Le Petit"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-tax">Mã số thuế (nếu cần xuất VAT)</Label>
                  <Input
                    id="reg-tax"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="Ví dụ: 0108892345"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Mật khẩu *</Label>
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Tiếp tục xác thực OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-ink-3">
            <span>Đã có tài khoản? </span>
            <Link to="/dang-nhap" className="font-semibold text-brand hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      ) : (
        /* STAGE 2: 6-DIGIT OTP VERIFICATION */
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center mx-auto text-brand">
            <Phone className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-ink">Xác thực số điện thoại</h2>
            <p className="text-xs text-ink-3">
              Mã OTP 6 số đã được gửi qua tin nhắn tới{' '}
              <strong className="text-ink font-mono">{phone || '0912 345 678'}</strong>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(val) => setOtpValue(val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-xs text-ink-3">
              {countdown > 0 ? (
                <span>Gửi lại mã sau <strong className="tabular-nums text-ink">{countdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCountdown(60)}
                  className="text-brand font-semibold hover:underline cursor-pointer"
                >
                  Gửi lại mã OTP mới
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Button type="submit" size="lg" className="w-full">
                Xác nhận & Hoàn tất đăng ký
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStage('info')}
                className="w-full text-xs text-ink-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Quay lại sửa thông tin
              </Button>
            </div>
          </form>

          <p className="text-xs text-ink-3">
            Gợi ý thử nghiệm: Nhập bất kỳ 6 chữ số nào (ví dụ: 123456)
          </p>
        </div>
      )}
    </div>
  )
}
