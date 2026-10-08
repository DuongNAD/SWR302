import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  Bell,
  Save,
  Snowflake,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminSettingsPage: React.FC = () => {
  useDocumentTitle('Cài đặt hệ thống | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  // 1. Store info state
  const [storeName, setStoreName] = useState('Gia Hòa Phát Bakery Supply')
  const [storeTaxCode, setStoreTaxCode] = useState('0108892345')
  const [storeHotline, setStoreHotline] = useState('1900 6868')
  const [storeEmail, setStoreEmail] = useState('lienhe@giahoaphat.vn')
  const [storeAddress, setStoreAddress] = useState('180 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội')
  const [storeHours, setStoreHours] = useState('08:00 - 20:00 (Thứ 2 - Chủ nhật)')

  // 2. Shipping policy state
  const [standardFee, setStandardFee] = useState('25000')
  const [chilledFee, setChilledFee] = useState('45000')
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('500000')
  const [coldPackagingFee, setColdPackagingFee] = useState('15000')
  const [freeColdThreshold, setFreeColdThreshold] = useState('300000')

  // 3. Payment methods state
  const [payVnpay, setPayVnpay] = useState(true)
  const [payMomo, setPayMomo] = useState(true)
  const [payBankTransfer, setPayBankTransfer] = useState(true)
  const [payCod, setPayCod] = useState(true)

  // 4. Notifications state
  const [notifyNewOrder, setNotifyNewOrder] = useState(true)
  const [notifyShipping, setNotifyShipping] = useState(true)
  const [notifyTempAlert, setNotifyTempAlert] = useState(true)
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(false)

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({ message: 'Đã lưu thông tin cửa hàng thành công!', type: 'success' })
  }

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({ message: 'Đã cập nhật biểu phí và định mức vận chuyển!', type: 'success' })
  }

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({ message: 'Đã cập nhật cấu hình cổng thanh toán!', type: 'success' })
  }

  const handleSaveNotification = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({ message: 'Đã cập nhật tùy chọn thông báo tự động!', type: 'success' })
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand" />
          Cài đặt hệ thống
        </h1>
        <p className="text-xs text-ink-2 mt-0.5">
          Cấu hình thông tin pháp lý doanh nghiệp, chính sách phí giao hàng, cổng thanh toán và thông báo
        </p>
      </div>

      {/* 1. Store Profile */}
      <form onSubmit={handleSaveStore} className="p-4 bg-surface border border-line rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-ink">Thông tin doanh nghiệp & Cửa hàng</h2>
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Lưu thông tin
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <Label className="text-xs font-semibold text-ink">Tên cửa hàng hiển thị *</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Mã số thuế (MST) *</Label>
            <Input
              value={storeTaxCode}
              onChange={(e) => setStoreTaxCode(e.target.value)}
              required
              className="mt-1 font-mono h-8 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Hotline hỗ trợ khách hàng *</Label>
            <Input
              value={storeHotline}
              onChange={(e) => setStoreHotline(e.target.value)}
              required
              className="mt-1 font-mono h-8 text-xs tabular-nums"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Email tiếp nhận đơn & liên hệ *</Label>
            <Input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              required
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs font-semibold text-ink">Địa chỉ trụ sở chính *</Label>
            <Input
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              required
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <Label className="text-xs font-semibold text-ink">Thời gian làm việc & phục vụ</Label>
            <Input
              value={storeHours}
              onChange={(e) => setStoreHours(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>
      </form>

      {/* 2. Shipping & Cold Chain Fees */}
      <form onSubmit={handleSaveShipping} className="p-4 bg-surface border border-line rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-ink">Biểu phí vận chuyển & Chuỗi lạnh</h2>
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Lưu biểu phí
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <Label className="text-xs font-semibold text-ink">Phí giao tiêu chuẩn (₫)</Label>
            <Input
              type="number"
              value={standardFee}
              onChange={(e) => setStandardFee(e.target.value)}
              className="mt-1 font-mono h-8 text-xs tabular-nums"
            />
            <p className="text-xs text-ink-3 mt-1">Áp dụng cho các sản phẩm nhiệt độ thường</p>
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Phí giao xe lạnh chuyên dụng (₫)</Label>
            <Input
              type="number"
              value={chilledFee}
              onChange={(e) => setChilledFee(e.target.value)}
              className="mt-1 font-mono h-8 text-xs tabular-nums text-brand font-semibold"
            />
            <p className="text-xs text-ink-3 mt-1">Áp dụng khi đơn có bơ, kem whipping, phô mai lạnh</p>
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Ngưỡng miễn phí vận chuyển (₫)</Label>
            <Input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="mt-1 font-mono h-8 text-xs tabular-nums text-ok font-semibold"
            />
            <p className="text-xs text-ink-3 mt-1">Đơn hàng đạt mức này sẽ được miễn 100% phí giao</p>
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Phí đóng gói bảo ôn xốp + đá gel (₫)</Label>
            <Input
              type="number"
              value={coldPackagingFee}
              onChange={(e) => setColdPackagingFee(e.target.value)}
              className="mt-1 font-mono h-8 text-xs tabular-nums"
            />
            <p className="text-xs text-ink-3 mt-1">Phí vật tư đóng gói lạnh phụ trợ</p>
          </div>

          <div>
            <Label className="text-xs font-semibold text-ink">Ngưỡng miễn phí đóng gói lạnh (₫)</Label>
            <Input
              type="number"
              value={freeColdThreshold}
              onChange={(e) => setFreeColdThreshold(e.target.value)}
              className="mt-1 font-mono h-8 text-xs tabular-nums text-ok font-semibold"
            />
            <p className="text-xs text-ink-3 mt-1">Đơn từ mức này miễn tiền thùng xốp và đá gel</p>
          </div>
        </div>
      </form>

      {/* 3. Payment Methods */}
      <form onSubmit={handleSavePayment} className="p-4 bg-surface border border-line rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-ink">Phương thức thanh toán chấp nhận</h2>
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Lưu thanh toán
          </Button>
        </div>

        <div className="space-y-3 text-xs divide-y divide-line">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-semibold text-ink">Cổng VNPay QR (Quét mã VietQR)</p>
              <p className="text-xs text-ink-3">Thanh toán tức thời qua ứng dụng ngân hàng và ví điện tử</p>
            </div>
            <Switch checked={payVnpay} onCheckedChange={setPayVnpay} aria-label="VNPay QR" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-ink">Ví điện tử MoMo</p>
              <p className="text-xs text-ink-3">Thanh toán qua ví điện tử liên kết</p>
            </div>
            <Switch checked={payMomo} onCheckedChange={setPayMomo} aria-label="MoMo" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-ink">Chuyển khoản trực tiếp qua ngân hàng (B2B / Sỉ)</p>
              <p className="text-xs text-ink-3">Tài khoản Vietcombank công ty, phù hợp cho khách mua sỉ đối soát</p>
            </div>
            <Switch checked={payBankTransfer} onCheckedChange={setPayBankTransfer} aria-label="Chuyển khoản" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-ink">Thanh toán khi nhận hàng (COD)</p>
              <p className="text-xs text-ink-3">Trả tiền mặt cho tài xế khi giao hàng thành công</p>
            </div>
            <Switch checked={payCod} onCheckedChange={setPayCod} aria-label="COD" />
          </div>
        </div>
      </form>

      {/* 4. Automated Notifications */}
      <form onSubmit={handleSaveNotification} className="p-4 bg-surface border border-line rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-ink">Thông báo tự động & Cảnh báo an toàn</h2>
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Lưu thông báo
          </Button>
        </div>

        <div className="space-y-3 text-xs divide-y divide-line">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-semibold text-ink">Email xác nhận đơn hàng mới cho khách</p>
              <p className="text-xs text-ink-3">Gửi email kèm chi tiết danh mục hàng hóa và hóa đơn tạm tính</p>
            </div>
            <Switch checked={notifyNewOrder} onCheckedChange={setNotifyNewOrder} aria-label="Email xác nhận" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-ink">Thông báo xe lạnh bắt đầu giao hàng (SMS / Email)</p>
              <p className="text-xs text-ink-3">Gửi kèm thông tin tài xế và biển số xe vận chuyển</p>
            </div>
            <Switch checked={notifyShipping} onCheckedChange={setNotifyShipping} aria-label="Thông báo giao hàng" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-danger flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-danger" />
                Cảnh báo nhiệt độ thùng xe vượt 8.0°C
              </p>
              <p className="text-xs text-ink-3">Tự động gửi thông báo khẩn cấp tới quản trị viên & quản lý kho lạnh</p>
            </div>
            <Switch checked={notifyTempAlert} onCheckedChange={setNotifyTempAlert} aria-label="Cảnh báo nhiệt" />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-ink">Báo cáo doanh số định kỳ hàng tuần</p>
              <p className="text-xs text-ink-3">Tổng hợp số liệu doanh thu và tồn kho gửi vào sáng thứ Hai</p>
            </div>
            <Switch checked={notifyWeeklyReport} onCheckedChange={setNotifyWeeklyReport} aria-label="Báo cáo tuần" />
          </div>
        </div>
      </form>
    </div>
  )
}
