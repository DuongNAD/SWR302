import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  HelpCircle,
  RotateCcw,
  Snowflake,
  FileText,
  Phone,
  ArrowRight,
} from 'lucide-react'

export const SupportPage: React.FC = () => {
  useDocumentTitle('Trung tâm hỗ trợ & Chính sách | Gia Hòa Phát Bakery Supply')

  const faqs = [
    {
      q: 'Đơn hàng chuỗi lạnh (bơ, whipping, phô mai) được vận chuyển như thế nào?',
      a: 'Tất cả các sản phẩm bơ động vật, kem tươi whipping cream và phô mai Mascarpone tại Gia Hòa Phát bắt buộc được vận chuyển bằng đội xe tải chuyên dụng có thùng lạnh duy trì dải nhiệt độ 2°C – 8°C. Đơn hàng lẻ được ướp kèm túi đá gel nhiệt độ âm trong thùng xốp cách nhiệt để đảm bảo nhiệt độ chuẩn tới tận tay bạn.',
    },
    {
      q: 'Chính sách miễn phí vận chuyển và miễn phí đóng gói xe lạnh?',
      a: 'Đơn hàng có giá trị tạm tính từ 500.000₫ trở lên được MIỄN PHÍ phí vận chuyển tiêu chuẩn 25.000₫. Đối với đơn hàng có sản phẩm chuỗi lạnh, phí đóng gói thùng xốp đá gel (15.000₫) được MIỄN PHÍ hoàn toàn cho các đơn hàng từ 300.000₫ trở lên.',
    },
    {
      q: 'Làm thế nào để yêu cầu xuất hóa đơn GTGT (VAT) điện tử?',
      a: 'Bạn chỉ cần tích chọn "Xuất hóa đơn VAT cho tiệm bánh / doanh nghiệp" ở Bước 1 trong trang Thanh toán và điền Mã số thuế, Tên công ty, Email nhận hóa đơn. Hệ thống sẽ tự động xuất hóa đơn điện tử hợp lệ gửi về email trong vòng 24 giờ sau khi giao hàng thành công.',
    },
    {
      q: 'Chính sách đổi trả hàng bị hư hỏng hoặc biến dạng khi nhận?',
      a: 'Gia Hòa Phát cam kết 1 đổi 1 hoặc hoàn tiền 100% nếu bơ/kem bị chảy tách nước, móp vỡ bao bì hoặc lỗi do quy trình vận chuyển của xe lạnh. Quý khách vui lòng đồng kiểm tra cùng shipper hoặc phản hồi qua hotline 1900 6899 trong vòng 24 giờ kể từ thời điểm nhận hàng.',
    },
    {
      q: 'Làm sao để đăng ký mua sỉ và mở hạn mức công nợ 30 ngày?',
      a: 'Quý tiệm bánh có thể truy cập trang "Mua sỉ" trên website hoặc liên hệ bộ phận kinh doanh B2B. Đối tác có giấy phép kinh doanh ngành bánh và hoạt động trên 6 tháng sẽ được cấp hạn mức công nợ lên đến 50.000.000₫ với kỳ hạn thanh toán T+30 ngày.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-8">
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
            <BreadcrumbPage>Trung tâm hỗ trợ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-1.5 border-b border-line pb-4">
        <span className="text-xs font-mono text-ink-3">SCR-23 · HỖ TRỢ & CHÍNH SÁCH</span>
        <h1 className="text-2xl font-bold text-ink">
          Trung tâm hỗ trợ & Câu hỏi thường gặp
        </h1>
        <p className="text-xs text-ink-2 max-w-2xl leading-relaxed">
          Giải đáp các thắc mắc về quy trình bảo quản chuỗi lạnh, chính sách giao hàng xe tải chuyên dụng và hỗ trợ hóa đơn doanh nghiệp
        </p>
      </div>

      {/* 3 Main Policy Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-info-soft text-info flex items-center justify-center">
            <Snowflake className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Chính sách chuỗi lạnh</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Quy trình kiểm soát nhiệt độ nghiêm ngặt từ kho tổng đến xe tải lạnh. Đền bù 100% nếu sản phẩm bơ kem bị suy giảm chất lượng.
          </p>
        </div>

        <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-brand-soft text-brand flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Đổi trả trong 24 giờ</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Hỗ trợ đổi mới nguyên liệu ngay trong ngày nếu phát hiện lỗi nhà sản xuất, bao bì rách thủng hoặc cận date dưới 60 ngày.
          </p>
        </div>

        <div className="border border-line rounded-lg bg-surface p-5 space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-ok/10 text-ok flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-ink">Hóa đơn & Nguồn gốc</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            100% sản phẩm có tem phụ tiếng Việt, chứng nhận kiểm dịch và an toàn thực phẩm. Hóa đơn điện tử xuất chuẩn xác theo quy định.
          </p>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand" />
            Câu hỏi thường gặp (FAQ)
          </h2>
          <p className="text-xs text-ink-3">
            Những điều thợ làm bánh và chủ tiệm thường quan tâm nhất khi mua sắm tại Gia Hòa Phát
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-xs font-semibold text-ink text-left hover:text-brand">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-ink-2 leading-relaxed pt-1 pb-3">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Direct Contact Support Box */}
      <div className="border border-line rounded-lg bg-page p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">
            Bạn vẫn cần giải đáp thêm thắc mắc?
          </h3>
          <p className="text-xs text-ink-3">
            Đội ngũ tư vấn kỹ thuật làm bánh và điều phối viên vận tải luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <a href="tel:19006899">
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Tổng đài 1900 6899
            </a>
          </Button>

          <Button size="sm" asChild>
            <Link to="/lien-he">
              Gửi biểu mẫu liên hệ
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
