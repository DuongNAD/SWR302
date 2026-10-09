import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Store,
  Percent,
  CreditCard,
  Snowflake,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const WholesalePage: React.FC = () => {
  useDocumentTitle('Mua sỉ cho tiệm bánh và khách hàng doanh nghiệp | Gia Hòa Phát')

  const { showToast } = useToast()

  const [bakeryName, setBakeryName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Hà Nội')
  const [demandNotes, setDemandNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bakeryName.trim() || !contactName.trim() || !phone.trim()) {
      showToast({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' })
      return
    }
    setIsSubmitted(true)
    showToast({
      type: 'success',
      message: 'Đăng ký thành công. Chuyên viên B2B Gia Hòa Phát sẽ liên hệ báo giá trong vòng 2 giờ làm việc.',
    })
  }

  return (
    <div className="wrap py-4 md:py-6 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chính sách mua sỉ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Strip */}
      <div className="border border-line rounded-lg bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-brand-soft text-brand border-brand/40 text-xs px-2.5 py-0.5 font-semibold">
            Chương trình B2B Bakery Supply
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-ink max-w-2xl leading-snug">
          Giải pháp cung ứng nguyên liệu làm bánh toàn diện cho tiệm bánh và chuỗi xưởng
        </h1>

        <p className="text-xs sm:text-sm text-ink-2 max-w-3xl leading-relaxed">
          Gia Hòa Phát cung cấp mức giá sỉ chiết khấu cạnh tranh theo số lượng, hạn mức công nợ linh hoạt 30 ngày, xuất đầy đủ hóa đơn điện tử VAT và cam kết chuỗi cung ứng lạnh bảo đảm nhiệt độ 2–8°C tận cửa xưởng.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-line bg-surface space-y-2">
          <div className="w-8 h-8 rounded-md bg-brand-soft text-brand flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-ink">Chiết khấu bậc thang</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Giảm tới 20% khi nhập theo thùng hoặc bao xá. Mức giá sỉ hiển thị trực tiếp và tự động trừ trong giỏ hàng.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-line bg-surface space-y-2">
          <div className="w-8 h-8 rounded-md bg-info-soft text-info flex items-center justify-center">
            <Snowflake className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-ink">Giao xe lạnh 2–8°C</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Đội xe tải lạnh Isuzu chuyên dụng giao hàng nội thành Hà Nội & TP.HCM từ 2–4 giờ. Kiểm tra cảm biến nhiệt độ khi ký nhận.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-line bg-surface space-y-2">
          <div className="w-8 h-8 rounded-md bg-ok/10 text-ok flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-ink">Công nợ T+30 ngày</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Hỗ trợ hạn mức tín dụng công nợ lên đến 50.000.000₫ cho đối tác tiệm bánh hoạt động trên 6 tháng.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-line bg-surface space-y-2">
          <div className="w-8 h-8 rounded-md bg-warn/10 text-warn flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-ink">Hóa đơn VAT và VSATTP</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Sản phẩm có hồ sơ tự công bố chất lượng, tem phụ tiếng Việt và hóa đơn điện tử tự động xuất trong ngày.
          </p>
        </div>
      </div>

      {/* Main 2-column: Discount Table & Registration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Wholesale Tier Policy Table */}
        <div className="lg:col-span-7 space-y-5">
          <div className="border border-line rounded-lg bg-surface p-5 space-y-4">
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <Store className="w-4 h-4 text-brand" />
              Bảng khung chiết khấu đại lý theo danh mục
            </h2>

            <div className="border border-line rounded-md overflow-hidden bg-surface">
              <table className="w-full text-xs text-left">
                <thead className="bg-page text-ink-2 font-medium border-b border-line">
                  <tr>
                    <th className="py-2.5 px-3">Danh mục hàng</th>
                    <th className="py-2.5 px-3">Quy cách sỉ</th>
                    <th className="py-2.5 px-3">Mức chiết khấu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-3 font-semibold text-ink">Bơ động vật (Anchor, Corman, Elle&Vire)</td>
                    <td className="py-2.5 px-3 text-ink-2">Thùng 20 thỏi / Thùng 40 thỏi</td>
                    <td className="py-2.5 px-3 font-bold text-brand tabular-nums">7.7% – 15.4%</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-3 font-semibold text-ink">Kem tươi Whipping & Mascarpone (Tatua)</td>
                    <td className="py-2.5 px-3 text-ink-2">Thùng 8–12 hộp 1L/500g</td>
                    <td className="py-2.5 px-3 font-bold text-brand tabular-nums">7.0% – 14.0%</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-3 font-semibold text-ink">Bột mì chuyên dụng (Hoa Ngọc Lan, Meizan)</td>
                    <td className="py-2.5 px-3 text-ink-2">Bao 25kg (từ 5 bao)</td>
                    <td className="py-2.5 px-3 font-bold text-brand tabular-nums">10.0% – 18.0%</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-3 font-semibold text-ink">Socola Couverture & Hạt trang trí (Puratos)</td>
                    <td className="py-2.5 px-3 text-ink-2">Thùng 10 gói 1kg</td>
                    <td className="py-2.5 px-3 font-bold text-brand tabular-nums">12.0% – 20.0%</td>
                  </tr>
                  <tr className="hover:bg-page/50">
                    <td className="py-2.5 px-3 font-semibold text-ink">Thiết bị máy móc (Bear, Unox)</td>
                    <td className="py-2.5 px-3 text-ink-2">Từng chiếc máy</td>
                    <td className="py-2.5 px-3 font-bold text-brand tabular-nums">5.0% + Lắp đặt</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-ink-3">
              * Khách hàng sỉ có thể đặt hàng trực tiếp trên website bằng cách chọn số lượng lớn ở từng sản phẩm hoặc liên hệ nhân viên điều phối để làm hợp đồng nguyên tắc.
            </p>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-5">
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <div className="space-y-1 border-b border-line pb-3">
              <h2 className="text-base font-bold text-ink">
                Đăng ký tài khoản tiệm bánh
              </h2>
              <p className="text-xs text-ink-3">
                Nhận bảng báo giá đại lý chi tiết và kích hoạt hạn mức công nợ
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="ws-bakery">Tên tiệm bánh / Xưởng sản xuất *</Label>
                  <Input
                    id="ws-bakery"
                    value={bakeryName}
                    onChange={(e) => setBakeryName(e.target.value)}
                    placeholder="Ví dụ: Tiệm Bánh Le Petit Bakery"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ws-name">Họ tên người phụ trách thu mua *</Label>
                  <Input
                    id="ws-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Lan Anh"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="ws-phone">Số điện thoại liên hệ *</Label>
                    <Input
                      id="ws-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912..."
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="ws-email">Email nhận báo giá</Label>
                    <Input
                      id="ws-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tiembanh@..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ws-city">Khu vực tiệm bánh</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="ws-city" className="w-full h-10 text-xs">
                      <SelectValue placeholder="Chọn khu vực tiệm bánh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hà Nội">Hà Nội và miền Bắc</SelectItem>
                      <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh và miền Nam</SelectItem>
                      <SelectItem value="Đà Nẵng">Đà Nẵng và miền Trung</SelectItem>
                      <SelectItem value="Tỉnh thành khác">Tỉnh thành khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ws-notes">Nhu cầu nhập nguyên liệu chính</Label>
                  <Textarea
                    id="ws-notes"
                    rows={3}
                    value={demandNotes}
                    onChange={(e) => setDemandNotes(e.target.value)}
                    placeholder="Nhập nhóm hàng quan tâm: Bơ lạt theo thùng, whipping cream xe lạnh, bột mì bao..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full pt-1">
                  Gửi yêu cầu đăng ký đại lý
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-ok mx-auto" />
                <h3 className="font-bold text-ink text-sm">Yêu cầu đã được tiếp nhận</h3>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Cảm ơn <strong>{contactName}</strong> từ <strong>{bakeryName}</strong>. Chuyên viên kinh doanh B2B của Gia Hòa Phát sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2"
                >
                  Gửi yêu cầu khác
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
