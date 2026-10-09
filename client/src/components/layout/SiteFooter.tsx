import React from 'react'
import { Link } from 'react-router-dom'

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-ink text-stone-300 text-xs">
      <div className="wrap py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin công ty */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Gia Hòa Phát Bakery Supply</h3>
            <p className="text-stone-400 leading-relaxed">
              Tổng kho phân phối nguyên liệu làm bánh và thiết bị máy móc chính hãng cho thợ bánh tại gia và tiệm bánh chuyên nghiệp từ năm 1998.
            </p>
            <div className="space-y-1.5 pt-2 text-stone-400">
              <p>Kho tổng: 120 Cầu Giấy, P. Quan Hoa, Cầu Giấy, Hà Nội</p>
              <p>Chi nhánh: 452 Sư Vạn Hạnh, P.9, Q.10, TP.HCM</p>
              <p>Hotline: 1900 6899 (07:30–21:00)</p>
              <p>Email: contact@giahoaphat.com.vn</p>
            </div>
          </div>

          {/* Cột 2: Mua hàng */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Mua hàng</h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link to="/san-pham" className="hover:text-white transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/san-pham?danh-muc=bo-sua-pho-mai" className="hover:text-white transition-colors">
                  Bơ sữa và phô mai tươi
                </Link>
              </li>
              <li>
                <Link to="/combo" className="hover:text-white transition-colors">
                  Combo nguyên liệu theo món
                </Link>
              </li>
              <li>
                <Link to="/mua-si" className="hover:text-white transition-colors">
                  Bảng giá sỉ cho tiệm bánh
                </Link>
              </li>
              <li>
                <Link to="/tra-cuu-don-hang" className="hover:text-white transition-colors">
                  Tra cứu tình trạng đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Hướng dẫn đặt hàng trực tuyến
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Chính sách giao hàng xe lạnh
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Chính sách đổi trả & hoàn tiền
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Quy định xuất hóa đơn VAT
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Về chúng tôi */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Về chúng tôi</h3>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link to="/gioi-thieu" className="hover:text-white transition-colors">
                  Giới thiệu công ty
                </Link>
              </li>
              <li>
                <Link to="/cua-hang" className="hover:text-white transition-colors">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-white transition-colors">
                  Liên hệ & góp ý
                </Link>
              </li>
              <li>
                <Link to="/ho-tro" className="hover:text-white transition-colors">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Cổng quản trị nội bộ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            <span>Phương thức thanh toán: </span>
            <span className="text-stone-300 font-medium">VNPay (QR) · MoMo · Chuyển khoản ngân hàng · Thanh toán khi nhận hàng (COD)</span>
          </div>
          <div>
            <span>Giao hàng: </span>
            <span className="text-stone-300 font-medium">Tiêu chuẩn toàn quốc (24–48h) · Xe lạnh hỏa tốc (2–4h)</span>
          </div>
        </div>

        {/* Dòng bản quyền & Prototype note */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <p>© 2026 Công ty Cổ phần Thương mại Thực phẩm Gia Hòa Phát. Tất cả quyền được bảo lưu.</p>
          <p className="text-stone-400">Prototype phục vụ môn SWR302 — Topic 1</p>
        </div>
      </div>
    </footer>
  )
}
