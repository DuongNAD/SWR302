# Danh sách thư viện và tài nguyên bên thứ ba (THIRD_PARTY.md)

Tài liệu này ghi nhận toàn bộ thư viện, mã nguồn và tài nguyên mở được sử dụng trong dự án `client/` tuân thủ quy định mục 4 của `ui-spec/README.md`.

## 1. Thư viện mã nguồn mở

| Thư viện | Phiên bản | Giấy phép | Mục đích & Nơi sử dụng |
|---|---|---|---|
| `react-router-dom` | ^7.x | MIT | Định tuyến ứng dụng với HashRouter (`src/router.tsx`) |
| `@fontsource/be-vietnam-pro` | ^5.x | OFL-1.1 | Font chữ thương hiệu Be Vietnam Pro chạy offline (`src/main.tsx`) |
| `lucide-react` | ^1.x | ISC | Bộ icon duy nhất cho toàn bộ hệ thống giao diện |
| `clsx` | ^2.x | MIT | Tiện ích ghép lớp class CSS (`src/lib/utils.ts`) |
| `tailwind-merge` | ^3.x | MIT | Tiện ích hợp nhất xung đột class Tailwind CSS (`src/lib/utils.ts`) |
| `class-variance-authority` | ^0.7.x | Apache-2.0 | Xây dựng các biến thể component cho shadcn/ui |
| `tw-animate-css` | ^1.x | MIT | Hiệu ứng chuyển động giao diện chuẩn |
| `radix-ui` | ^1.x | MIT | Bộ nguyên mẫu giao diện không kiểu dáng phục vụ các thành phần shadcn/ui |
| `@tanstack/react-table` | ^8.x | MIT | Xử lý bảng dữ liệu quản trị DataTable (`src/components/admin/DataTable.tsx`) |
| `date-fns` | ^4.x | MIT | Xử lý và định dạng ngày tháng tiếng Việt |
| `recharts` | ^2.x | MIT | Biểu đồ doanh thu và vận hành quản trị |
| `vaul` | ^1.x | MIT | Ngăn kéo đáy (bottom sheet drawer) cho thiết bị di động |
| `cmdk` | ^1.x | MIT | Hộp tìm kiếm nhanh và gợi ý ⌘K (`src/components/layout/SearchBox.tsx`) |
| `input-otp` | ^1.x | MIT | Thành phần nhập mã xác thực OTP 6 ô rời (`src/components/ui/input-otp.tsx`) |
| `embla-carousel-react` | ^8.x | MIT | Điều khiển cuộn danh mục rail trên mobile |
| `sonner` | ^2.x | MIT | Hiển thị thông báo toast ở góc màn hình (`src/context/ToastContext.tsx`) |

## 2. Tài nguyên hình ảnh

- Ảnh sản phẩm: Unsplash License (miễn phí sử dụng thương mại, không bản quyền), nguồn URL có sẵn trong `data/`.
- Ảnh banner & danh mục: Unsplash/Pexels License, lưu trữ cục bộ tại `public/img/` phục vụ chạy offline.
- Mã QR demo: File SVG vector tĩnh tự tạo tại `public/qr-demo.svg`, không gọi API bên ngoài.
