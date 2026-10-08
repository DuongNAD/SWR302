import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/components/ui/price'
import {
  Building2,
  CreditCard,
  Percent,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export const AccountBusinessPage: React.FC = () => {
  useDocumentTitle('Hồ sơ doanh nghiệp & Mua sỉ | Gia Hòa Phát Bakery Supply')

  const { showToast } = useToast()

  const [companyName, setCompanyName] = useState('Công ty TNHH Bánh Ngọt Tiệm Vàng')
  const [taxCode, setTaxCode] = useState('0108892345')
  const [address, setAddress] = useState('Tầng 2, 88 Hoàng Cầu, Đống Đa, Hà Nội')
  const [vatEmail, setVatEmail] = useState('ketoan.tiemvang@gmail.com')
  const [repName, setRepName] = useState('Trần Mai Anh')
  const [repPhone, setRepPhone] = useState('0912 345 678')

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      type: 'success',
      message: 'Đã lưu thông tin doanh nghiệp xuất hóa đơn VAT!',
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Credit Limit Card */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-ink-3">SCR-20 · ĐẠI LÝ MUA SỈ TIỆM BÁNH</span>
            <h1 className="text-xl sm:text-2xl font-bold text-ink">
              Hồ sơ doanh nghiệp & Công nợ
            </h1>
            <p className="text-xs text-ink-3">
              Thông tin xuất hóa đơn VAT điện tử và hạn mức công nợ đại lý được cấp
            </p>
          </div>

          <Badge variant="outline" className="bg-brand-soft text-brand border-brand/40 text-xs px-3 py-1 font-semibold">
            Đại lý B2B cấp 1 (Gold Partner)
          </Badge>
        </div>

        {/* Credit Limit Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand" />
              Hạn mức công nợ được duyệt
            </span>
            <div className="text-xl font-bold text-ink tabular-nums">
              {formatPrice(50000000)}
            </div>
            <p className="text-xs text-ink-3">Kỳ hạn thanh toán: T+30 ngày</p>
          </div>

          <div className="p-4 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-warn" />
              Công nợ đang sử dụng
            </span>
            <div className="text-xl font-bold text-warn tabular-nums">
              {formatPrice(12450000)}
            </div>
            <p className="text-xs text-ink-3">Hạn thanh toán kế tiếp: 28/10/2026</p>
          </div>

          <div className="p-4 rounded-md bg-page border border-line space-y-1">
            <span className="text-xs text-ink-3 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
              Hạn mức khả dụng còn lại
            </span>
            <div className="text-xl font-bold text-ok tabular-nums">
              {formatPrice(37550000)}
            </div>
            <p className="text-xs text-ink-3">Sẵn sàng đặt hàng xe lạnh ngay</p>
          </div>
        </div>
      </div>

      {/* 2. Business VAT Details Form */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand" />
            Thông tin xuất hóa đơn GTGT (VAT)
          </h2>
          <p className="text-xs text-ink-3">
            Hóa đơn điện tử sẽ được gửi tự động tới email này ngay sau khi đơn hàng được giao thành công
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="biz-name">Tên doanh nghiệp / Công ty *</Label>
              <Input
                id="biz-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-tax">Mã số thuế (MST) *</Label>
              <Input
                id="biz-tax"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className="font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-email">Email nhận hóa đơn điện tử *</Label>
              <Input
                id="biz-email"
                type="email"
                value={vatEmail}
                onChange={(e) => setVatEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="biz-addr">Địa chỉ đăng ký kinh doanh *</Label>
              <Input
                id="biz-addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-rep">Người đại diện / Người liên hệ</Label>
              <Input
                id="biz-rep"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-phone">Số điện thoại liên hệ</Label>
              <Input
                id="biz-phone"
                value={repPhone}
                onChange={(e) => setRepPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="sm">
              Lưu thông tin hóa đơn
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Wholesale Discount Policy Table */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Percent className="w-4 h-4 text-brand" />
            Chính sách chiết khấu mua sỉ theo ngành hàng
          </h2>
          <p className="text-xs text-ink-3">
            Áp dụng tự động trong giỏ hàng khi đạt số lượng tối thiểu của từng nhóm nguyên liệu
          </p>
        </div>

        <div className="border border-line rounded-md overflow-hidden bg-surface">
          <table className="w-full text-xs text-left">
            <thead className="bg-page text-ink-2 font-medium border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Nhóm nguyên liệu</th>
                <th className="py-2.5 px-4">Mốc tối thiểu</th>
                <th className="py-2.5 px-4">Mức chiết khấu</th>
                <th className="py-2.5 px-4">Vận chuyển xe lạnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr className="hover:bg-page/50">
                <td className="py-2.5 px-4 font-semibold text-ink">Bơ sữa & Phô mai tươi</td>
                <td className="py-2.5 px-4 text-ink-2">Từ 10 thỏi / hộp</td>
                <td className="py-2.5 px-4 font-semibold text-brand tabular-nums">Giảm 8% – 15%</td>
                <td className="py-2.5 px-4 text-info font-medium">Bảo quản 2–8°C thùng đá gel</td>
              </tr>
              <tr className="hover:bg-page/50">
                <td className="py-2.5 px-4 font-semibold text-ink">Bột mì, men nở & phụ gia</td>
                <td className="py-2.5 px-4 text-ink-2">Từ 5 bao (25kg)</td>
                <td className="py-2.5 px-4 font-semibold text-brand tabular-nums">Giảm 10% – 18%</td>
                <td className="py-2.5 px-4 text-ink-2">Giao pallet tận kho</td>
              </tr>
              <tr className="hover:bg-page/50">
                <td className="py-2.5 px-4 font-semibold text-ink">Socola nguyên chất & Cacao</td>
                <td className="py-2.5 px-4 text-ink-2">Từ 10 gói 1kg</td>
                <td className="py-2.5 px-4 font-semibold text-brand tabular-nums">Giảm 12% – 20%</td>
                <td className="py-2.5 px-4 text-info font-medium">Xe lạnh chống chảy socola</td>
              </tr>
              <tr className="hover:bg-page/50">
                <td className="py-2.5 px-4 font-semibold text-ink">Thiết bị & Máy móc làm bánh</td>
                <td className="py-2.5 px-4 text-ink-2">Từ 1 máy</td>
                <td className="py-2.5 px-4 font-semibold text-brand tabular-nums">Giảm 5%</td>
                <td className="py-2.5 px-4 text-ok font-medium">Miễn phí lắp đặt & Hướng dẫn kỹ thuật</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
