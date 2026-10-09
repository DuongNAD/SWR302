import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
} from 'lucide-react'

export const ContactPage: React.FC = () => {
  useDocumentTitle('Liên hệ và góp ý | Gia Hòa Phát Bakery Supply')

  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('wholesale')
  const [message, setMessage] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast({ type: 'error', message: 'Vui lòng điền họ tên, số điện thoại và nội dung tin nhắn.' })
      return
    }

    setIsSent(true)
    showToast({
      type: 'success',
      message: 'Cảm ơn bạn đã gửi liên hệ. Bộ phận chăm sóc khách hàng Gia Hòa Phát sẽ phản hồi trong 24 giờ.',
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
            <BreadcrumbPage>Liên hệ và góp ý</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-1.5 border-b border-line pb-4">
        <h1 className="text-2xl font-bold text-ink">
          Liên hệ với Gia Hòa Phát
        </h1>
        <p className="text-xs text-ink-2 max-w-2xl leading-relaxed">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến phản hồi về chất lượng nguyên liệu, dịch vụ vận chuyển xe lạnh và các cơ hội hợp tác kinh doanh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info & Store Addresses */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-ink">
              Thông tin liên hệ trực tiếp
            </h2>

            <div className="space-y-3 text-xs text-ink-2">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-3 block text-xs">Tổng đài hỗ trợ & đặt hàng:</span>
                  <a href="tel:19006899" className="font-bold text-ink text-sm hover:underline">
                    1900 6899
                  </a>
                  <span className="text-ink-3 block text-xs">(08:00 – 21:00 hàng ngày)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-3 block text-xs">Hòm thư điện tử:</span>
                  <a href="mailto:lienhe@giahoaphat.com.vn" className="font-medium text-ink hover:underline">
                    lienhe@giahoaphat.com.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-3 block text-xs">Trụ sở điều hành chính:</span>
                  <p className="font-medium text-ink leading-relaxed">
                    Số 42 Ngõ 178 Tây Sơn, P. Trung Liệt, Q. Đống Đa, TP. Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-3 block text-xs">Thời gian giao hàng xe lạnh:</span>
                  <p className="font-medium text-ink">
                    08:00 – 18:30 (Thứ 2 đến Thứ 7)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links to stores */}
          <div className="border border-line rounded-lg bg-page p-5 space-y-2 text-xs">
            <h3 className="font-semibold text-ink">Hệ thống chi nhánh</h3>
            <p className="text-ink-3 text-xs leading-relaxed">
              Bạn muốn mua trực tiếp hoặc thử mẫu nguyên liệu tại quầy?
            </p>
            <Button variant="outline" size="sm" asChild className="mt-2 text-xs">
              <Link to="/cua-hang">
                Xem 4 chi nhánh cửa hàng
              </Link>
            </Button>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="border border-line rounded-lg bg-surface p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="space-y-1 border-b border-line pb-3">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand" />
                Gửi tin nhắn hoặc thư góp ý
              </h2>
              <p className="text-xs text-ink-3">
                Vui lòng điền thông tin bên dưới, chúng tôi sẽ phản hồi lại bạn sớm nhất
              </p>
            </div>

            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cnt-name">Họ và tên của bạn *</Label>
                    <Input
                      id="cnt-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cnt-phone">Số điện thoại liên hệ *</Label>
                    <Input
                      id="cnt-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cnt-email">Email (tùy chọn)</Label>
                    <Input
                      id="cnt-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cnt-subject">Chủ đề cần hỗ trợ</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="cnt-subject" className="w-full h-10 text-xs">
                      <SelectValue placeholder="Chọn chủ đề cần hỗ trợ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesale">Báo giá mua sỉ tiệm bánh và hạn mức công nợ</SelectItem>
                      <SelectItem value="coldchain">Khiếu nại về nhiệt độ vận chuyển xe lạnh</SelectItem>
                      <SelectItem value="vat">Yêu cầu tra soát hóa đơn VAT điện tử</SelectItem>
                      <SelectItem value="technical">Tư vấn kỹ thuật nguyên liệu và công thức làm bánh</SelectItem>
                      <SelectItem value="other">Ý kiến đóng góp khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cnt-msg">Nội dung chi tiết *</Label>
                  <Textarea
                    id="cnt-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả cụ thể yêu cầu của bạn..."
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto px-6">
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Gửi tin nhắn liên hệ
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-ok mx-auto" />
                <h3 className="font-bold text-ink text-base">Đã gửi tin nhắn thành công</h3>
                <p className="text-xs text-ink-2 max-w-sm mx-auto leading-relaxed">
                  Cảm ơn bạn đã liên hệ với Gia Hòa Phát. Chuyên viên phụ trách sẽ gọi điện hoặc gửi email phản hồi tới bạn trong thời gian sớm nhất.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSent(false)
                    setMessage('')
                  }}
                  className="mt-2"
                >
                  Gửi thêm nội dung khác
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
