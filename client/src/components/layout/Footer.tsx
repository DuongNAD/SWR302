import React from 'react';
import { Snowflake, ShieldCheck, Award, Truck, Heart, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2B1D14] text-[#E8DED3] pt-14 pb-8 mt-20 border-t-4 border-[#92400E]">
      <div className="container mx-auto px-4 space-y-12">
        {/* Trust Badges 4-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-900/40 rounded-2xl border border-amber-800/60 text-amber-400 shrink-0">
              <Snowflake className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Chuỗi Cung Ứng Lạnh 2-4°C</h4>
              <p className="text-2xs text-stone-400 mt-1 leading-relaxed">
                Đảm bảo 100% bơ lạt, kem whipping, phô mai không bị tách nước hay chua men khi giao tới tay thợ bánh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-900/40 rounded-2xl border border-amber-800/60 text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Cam Kết Date Mới & VSATTP</h4>
              <p className="text-2xs text-stone-400 mt-1 leading-relaxed">
                Hạn sử dụng minh bạch từng lô hàng. Đầy đủ hóa đơn GTGT điện tử và chứng chỉ kiểm nghiệm an toàn thực phẩm.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-900/40 rounded-2xl border border-amber-800/60 text-amber-400 shrink-0">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Bán Lẻ & Chiết Khấu Sỉ Đến 25%</h4>
              <p className="text-2xs text-stone-400 mt-1 leading-relaxed">
                Chính sách giá sỉ bậc thang tự động cho tiệm bánh, xưởng sản xuất và quán café đặt hàng định kỳ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-900/40 rounded-2xl border border-amber-800/60 text-amber-400 shrink-0">
              <Truck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Giao Hỏa Tốc Trong Ngày</h4>
              <p className="text-2xs text-stone-400 mt-1 leading-relaxed">
                Đội xe chuyên dụng giao trong 2-4 giờ nội thành Hà Nội, TP.HCM và gửi chành xe lạnh toàn quốc.
              </p>
            </div>
          </div>
        </div>

        {/* Company & Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#92400E] text-white flex items-center justify-center font-black text-sm">
                GHP
              </span>
              <span className="font-black text-lg text-white">
                Gia Hòa Phát Bakery Supply
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Hệ thống bán buôn & bán lẻ nguyên liệu, dụng cụ và thiết bị làm bánh chuyên nghiệp. Đồng hành cùng hơn 12.000 thợ làm bánh tại gia và 850 tiệm bánh trên toàn quốc từ năm 1998.
            </p>
            <div className="text-2xs text-stone-400 space-y-1 pt-2">
              <p>📍 Kho Tổng: 120 Cầu Giấy, P. Quan Hoa, Cầu Giấy, Hà Nội</p>
              <p>📍 Chi nhánh Nam: 452 Sư Vạn Hạnh, Phường 9, Quận 10, TP. Hồ Chí Minh</p>
              <p>✉️ Email: contact@giahoaphat.com.vn | Giờ mở cửa: 07:30 - 21:00 hàng ngày</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Danh Mục Nổi Bật</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#cat-dairy" className="hover:text-amber-300 transition-colors">Bơ sữa & Whipping Cream</a></li>
              <li><a href="#cat-flour" className="hover:text-amber-300 transition-colors">Bột mì số 8, 11, 13 & Men nở</a></li>
              <li><a href="#cat-chocolate" className="hover:text-amber-300 transition-colors">Socola Bỉ Callebaut Couverture</a></li>
              <li><a href="#cat-tools" className="hover:text-amber-300 transition-colors">Khuôn nướng & Phới trộn bột</a></li>
              <li><a href="#combo" className="hover:text-amber-300 transition-colors">Combo Làm Bánh Tiramisu / Sourdough</a></li>
            </ul>
          </div>

          {/* Col 3: Academic / Course SWR302 Notice */}
          <div className="space-y-2.5 bg-amber-950/40 p-4 rounded-2xl border border-amber-900/60">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Đồ Án Môn SWR302</span>
            </div>
            <p className="text-2xs text-stone-300 leading-relaxed">
              <strong>Topic 1:</strong> Online Shopping for Baking Ingredients & Equipment System (Gia Hoa Phat Case Study).
            </p>
            <div className="pt-2 border-t border-amber-900/60 space-y-1 text-3xs text-stone-400">
              <p>• Chuẩn đặc tả: <strong>IEEE Std 830 / ISO 29148</strong></p>
              <p>• Phân tích: Use Case, Context Diagram, RTM Matrix</p>
              <p>• UI/UX: Design System WCAG 2.2 AA (ui-ux-pro-max)</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-stone-400">
          <p>© 2026 Gia Hòa Phát Bakery Supply. Bản quyền thuộc về Nhóm Đồ Án Môn SWR302.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>WCAG 2.2 AA Contrast Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
