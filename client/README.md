# Gia Hòa Phát Bakery Supply — Frontend Prototype (SWR302 Topic 1)

Giao diện mẫu hoàn chỉnh hệ thống thương mại điện tử chuyên ngành nguyên liệu & thiết bị làm bánh Gia Hòa Phát. Hệ thống được triển khai tuân thủ nghiêm ngặt theo tài liệu đặc tả `ui-spec/` (40 màn hình, zero AI aesthetics, Be Vietnam Pro typography, WCAG AA contrast).

## Hướng dẫn cài đặt và vận hành

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Đóng gói mã nguồn và kiểm tra bản xem trước sản phẩm
npm run build && npm run preview
```

## Kiểm tra chất lượng giao diện (QA & Linter)

```bash
# Kiểm tra 12 quy tắc thiết kế (chống lỗi AI aesthetics & vi phạm tokens)
bash ui-spec/check-ui.sh

# Kiểm tra cú pháp và linter
npm run lint

# Kiểm tra biên dịch TypeScript và bundling Vite
npm run build
```

## Cấu trúc điều hướng hệ thống (40 màn hình)

- **Storefront (Khách lẻ & Khách sỉ):** `/#/`
  - Danh mục & Lọc: `/#/san-pham`
  - Chi tiết sản phẩm & Giá bậc thang B2B: `/#/san-pham/bo-nhiet-doi-anchor-sheet-2kg`
  - Giỏ hàng & Voucher chuỗi lạnh: `/#/gio-hang`
  - Thanh toán 3 bước & Xuất hóa đơn VAT: `/#/thanh-toan`
  - Theo dõi đơn hàng & IoT cảm biến thùng lạnh: `/#/tra-cuu-don-hang` hoặc `/#/don-hang/GHP-889120`
  - Hệ thống chi nhánh & Kho lạnh: `/#/cua-hang`
  - Chính sách sỉ & Biểu mẫu B2B: `/#/mua-si`
- **Tài khoản khách hàng (Account):** `/#/tai-khoan` (Hồ sơ, Đơn hàng, Địa chỉ giao hàng, Doanh nghiệp VAT, Đổi mật khẩu)
- **Quản trị hệ thống (Admin):** `/#/admin`
  - Tổng quan KPI & Doanh thu: `/#/admin`
  - Quản lý đơn hàng & Xác nhận: `/#/admin/don-hang`
  - Quản lý sản phẩm & Biểu mẫu: `/#/admin/san-pham` / `/#/admin/san-pham/tao-moi`
  - Danh mục ngành hàng: `/#/admin/danh-muc`
  - Tồn kho & Quản lý lô hàng FEFO: `/#/admin/kho-lo`
  - Khách hàng & Duyệt hồ sơ sỉ B2B: `/#/admin/khach-hang`
  - Khuyến mãi & Voucher: `/#/admin/khuyen-mai`
  - Vận chuyển xe lạnh & Giám sát nhiệt độ: `/#/admin/van-chuyen`
  - Báo cáo kinh doanh: `/#/admin/bao-cao`
  - Phân quyền nhân viên: `/#/admin/nhan-vien`
  - Cài đặt hệ thống: `/#/admin/cai-dat`
- **Công cụ kiểm thử đặc tả (Dev):**
  - Ma trận đối chiếu yêu cầu SRS/SWR: `/#/dev/requirements`
  - Hướng dẫn phong cách & Bảng màu Design tokens: `/#/dev/styleguide`

*Mẹo kiểm thử:* Bật nút điều khiển **"Demo"** ở góc phải màn hình để chuyển nhanh giữa các vai trò (Khách lẻ, Khách sỉ, Quản trị viên) hoặc nhảy trực tiếp tới bất kỳ màn hình nào.
