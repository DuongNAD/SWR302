import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  ShieldCheck,
  Award,
  Clock,
  Check,
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  useDocumentTitle('Về chúng tôi | Gia Hòa Phát Bakery Supply')

  const milestones = [
    { year: '1998', title: 'Thành lập tại Hà Nội', desc: 'Khởi đầu từ một cửa hàng cung cấp bơ đường sữa truyền thống trên phố Tây Sơn.' },
    { year: '2008', title: 'Đối tác chiến lược Anchor & Tatua', desc: 'Trở thành nhà phân phối chính thức bơ New Zealand và kem sữa tươi tại miền Bắc.' },
    { year: '2016', title: 'Đầu tư hệ thống xe tải lạnh chuyên dụng', desc: 'Tiên phong triển khai giải pháp chuỗi lạnh khép kín (Cold Chain) 2–8°C cho nguyên liệu bánh.' },
    { year: '2022', title: 'Mở rộng trung tâm phân phối TP.HCM', desc: 'Khánh thành kho lạnh trung tâm tại Hàm Nghi (Quận 1) và Bình Thạnh phục vụ thị trường miền Nam.' },
    { year: '2026', title: 'Hệ sinh thái số Bakery Supply', desc: 'Ra mắt nền tảng thương mại điện tử chuyên ngành tích hợp báo giá sỉ tự động và theo dõi nhiệt độ xe lạnh.' },
  ]

  const partners = [
    'Anchor (New Zealand)',
    'Tatua Dairy (New Zealand)',
    'Puratos Grand-Place (Bỉ)',
    'Corman Butter (Bỉ)',
    'Elle & Vire (Pháp)',
    'Lesaffre Yeast (Pháp)',
    'Lò nướng UNOX (Ý)',
    'Thiết bị BEAR',
  ]

  return (
    <div className="wrap py-4 md:py-6 space-y-10">
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
            <BreadcrumbPage>Về Gia Hòa Phát</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Section */}
      <div className="border border-line rounded-lg bg-surface p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-brand-soft text-brand border-brand/40 text-xs px-2.5 py-0.5 font-semibold">
            Thành lập từ năm 1998 · 28 năm đồng hành
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-ink max-w-3xl leading-snug">
          Gia Hòa Phát — Nền tảng cung ứng nguyên liệu làm bánh tin cậy hàng đầu Việt Nam
        </h1>

        <p className="text-xs sm:text-sm text-ink-2 max-w-3xl leading-relaxed">
          Suốt gần 3 thập kỷ, Gia Hòa Phát luôn kiên định với sứ mệnh mang đến nguồn nguyên liệu làm bánh nhập khẩu chính ngạch chuẩn chất lượng cao nhất, bảo quản bằng quy trình chuỗi lạnh nghiêm ngặt để tiếp lửa cho đam mê sáng tạo của từng thợ làm bánh và sự thịnh vượng của mỗi tiệm bánh.
        </p>
      </div>

      {/* 4 Key Numbers Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-line rounded-lg bg-surface p-5 text-center space-y-1">
          <div className="text-3xl font-extrabold text-brand tabular-nums">28+</div>
          <div className="text-xs font-semibold text-ink">Năm kinh nghiệm</div>
          <p className="text-xs text-ink-3">Đồng hành cùng ngành bánh Việt Nam</p>
        </div>

        <div className="border border-line rounded-lg bg-surface p-5 text-center space-y-1">
          <div className="text-3xl font-extrabold text-ink tabular-nums">1.200+</div>
          <div className="text-xs font-semibold text-ink">Mặt hàng nguyên liệu</div>
          <p className="text-xs text-ink-3">Đầy đủ công bố & tem phụ chính hãng</p>
        </div>

        <div className="border border-line rounded-lg bg-surface p-5 text-center space-y-1">
          <div className="text-3xl font-extrabold text-brand tabular-nums">4</div>
          <div className="text-xs font-semibold text-ink">Kho phân phối trung tâm</div>
          <p className="text-xs text-ink-3">Hà Nội & TP. Hồ Chí Minh</p>
        </div>

        <div className="border border-line rounded-lg bg-surface p-5 text-center space-y-1">
          <div className="text-3xl font-extrabold text-ok tabular-nums">2–8°C</div>
          <div className="text-xs font-semibold text-ink">Nhiệt độ chuẩn xe lạnh</div>
          <p className="text-xs text-ink-3">Giữ trọn độ tươi của bơ sữa</p>
        </div>
      </div>

      {/* 2-column: Mission & Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Philosophy & Quality Commitments */}
        <div className="lg:col-span-7 space-y-5">
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand" />
              Tiêu chuẩn chất lượng nguyên liệu
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-ink-2 leading-relaxed">
              <p>
                Tại Gia Hòa Phát, chúng tôi hiểu rằng chỉ một thỏi bơ bị chảy dầu hay một hộp kem whipping bị tách nước cũng đủ làm hỏng mẻ bánh croissant cầu kỳ hoặc chiếc bánh mousse tâm huyết của người thợ bánh.
              </p>
              <p>
                Chính vì vậy, chúng tôi không xem mình đơn thuần là bên giao hàng, mà là <strong>người gác cổng chất lượng nguyên liệu</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-2">
                <li><strong>Kiểm soát nhiệt độ xuyên suốt:</strong> Kho trung tâm đạt chuẩn HACCP, đội xe tải đông lạnh chuyên dụng đo nhiệt độ bằng cảm biến IoT liên tục.</li>
                <li><strong>Hạn sử dụng luôn minh bạch:</strong> Ngày sản xuất và hạn dùng được in rõ trên tem phụ, cam kết HSD tối thiểu từ 6 tháng đối với hàng khô và 60 ngày đối với hàng bơ sữa.</li>
                <li><strong>Hóa đơn VAT và pháp lý minh bạch:</strong> Bảo vệ quyền lợi kế toán và an toàn thực phẩm tuyệt đối cho đối tác doanh nghiệp.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: International Brand Partners */}
        <div className="lg:col-span-5 space-y-5">
          <div className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <Award className="w-4 h-4 text-brand" />
              Đối tác thương hiệu quốc tế
            </h2>
            <p className="text-xs text-ink-3">
              Nhập khẩu chính ngạch trực tiếp từ các tập đoàn bơ sữa và nguyên liệu danh tiếng thế giới
            </p>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-md border border-line bg-page text-xs font-medium text-ink flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Milestones */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-6 shadow-xs">
        <div className="space-y-1 border-b border-line pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            Hành trình phát triển qua các mốc thời gian
          </h2>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative text-xs">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="ml-2 space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-brand text-sm">{m.year}</span>
                  <span className="font-semibold text-ink">{m.title}</span>
                </div>
                <p className="text-ink-2 text-xs">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
