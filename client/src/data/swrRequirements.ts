import { SWRRequirement } from '../types';

export const SWR_REQUIREMENTS: SWRRequirement[] = [
  {
    id: 'FR-AUTH-01',
    name: 'Đăng ký & Đăng nhập phân quyền',
    type: 'FR',
    priority: 'Must',
    description: 'Hệ thống hỗ trợ đăng nhập cho Khách mua hàng (Home Baker / Chủ tiệm bánh sỉ) và Nhân viên Quản lý (Admin). Có cơ chế giả lập OTP.',
    verifiedInClient: '/dang-nhap, /dang-ky (OTP), nút chọn vai trò ở DemoWidget',
    status: 'passed'
  },
  {
    id: 'FR-SRC-01',
    name: 'Tìm kiếm & Gợi ý từ khóa tức thì',
    type: 'FR',
    priority: 'Must',
    description: 'Hỗ trợ tìm kiếm theo tên nguyên liệu, mã SKU, thương hiệu, hoặc danh mục với độ trễ phản hồi < 300ms và gợi ý tìm kiếm.',
    verifiedInClient: 'Ô tìm kiếm ở header (chọn danh mục, gợi ý, Ctrl/⌘+K) và /tim-kiem',
    status: 'passed'
  },
  {
    id: 'FR-FIL-02',
    name: 'Bộ lọc thuộc tính chuyên ngành làm bánh',
    type: 'FR',
    priority: 'Must',
    description: 'Lọc sản phẩm đa chiều theo: Điều kiện bảo quản (Bắt buộc xe lạnh / Nhiệt độ phòng), Thương hiệu, Khoảng giá, và Tình trạng kho.',
    verifiedInClient: 'Cột lọc ở /san-pham (bảo quản, thương hiệu, giá, tình trạng)',
    status: 'passed'
  },
  {
    id: 'FR-PROD-03',
    name: 'Đặc tả chi tiết sản phẩm & Giá sỉ bậc thang',
    type: 'FR',
    priority: 'Must',
    description: 'Hiển thị đầy đủ thông số kỹ thuật, hạn sử dụng theo lô (Expiry Date), điều kiện lưu trữ, công thức làm bánh gợi ý và bảng chiết khấu sỉ.',
    verifiedInClient: '/san-pham/:id — bảng giá sỉ bậc thang, HSD/lô, ghi chú bảo quản',
    status: 'passed'
  },
  {
    id: 'FR-KIT-04',
    name: 'Bộ Combo Nguyên Liệu Theo Món (Recipe Kit)',
    type: 'FR',
    priority: 'Should',
    description: 'Tính năng cốt lõi cho tiệm bánh: Chọn món bánh (Tiramisu, Sourdough, Cookies) và thêm toàn bộ nguyên liệu đủ định lượng chỉ với 1 click.',
    verifiedInClient: '/combo, /combo/:id — chọn nguyên liệu, thêm cả combo vào giỏ',
    status: 'passed'
  },
  {
    id: 'FR-CART-05',
    name: 'Giỏ hàng thông minh & Cảnh báo bảo quản lạnh',
    type: 'FR',
    priority: 'Must',
    description: 'Tính toán tổng trọng lượng đơn hàng (kg), áp dụng giá sỉ tự động khi đạt số lượng, thông báo phí đóng gói thùng cách nhiệt đá gel.',
    verifiedInClient: '/gio-hang và giỏ mini — thanh miễn phí vận chuyển, phí đóng gói lạnh',
    status: 'passed'
  },
  {
    id: 'FR-CHK-06',
    name: 'Thanh toán & Chọn phương thức vận chuyển lạnh',
    type: 'FR',
    priority: 'Must',
    description: 'Hỗ trợ chọn Giao hàng chuẩn hoặc Giao hỏa tốc xe lạnh 2-4h. Thanh toán qua VNPay QR Code (preview mã QR động), MoMo, Chuyển khoản, COD.',
    verifiedInClient: '/thanh-toan — 3 bước, xe lạnh/tiêu chuẩn, VNPay QR/MoMo/chuyển khoản/COD',
    status: 'passed'
  },
  {
    id: 'FR-TRK-07',
    name: 'Theo dõi hành trình đơn hàng thời gian thực',
    type: 'FR',
    priority: 'Must',
    description: 'Hiển thị tiến trình đơn hàng (Chờ duyệt -> Đang đóng gói có đá gel -> Đang giao xe lạnh -> Hoàn tất), mã tra cứu vận đơn và hóa đơn điện tử.',
    verifiedInClient: '/don-hang/:ma — timeline, in hóa đơn; /dat-hang/thanh-cong/:ma',
    status: 'passed'
  },
  {
    id: 'FR-ADM-08',
    name: 'Phân hệ Quản trị kho & Cảnh báo hạn sử dụng',
    type: 'FR',
    priority: 'Must',
    description: 'Dành cho nhân viên cửa hàng Gia Hòa Phát: Quản lý danh mục, thêm/sửa sản phẩm, cập nhật tồn kho, cảnh báo lô hàng bơ sữa sắp hết hạn.',
    verifiedInClient: '/admin/* — sản phẩm, danh mục, tồn kho & lô, cảnh báo HSD, đơn hàng',
    status: 'passed'
  },
  {
    id: 'NFR-A11Y-01',
    name: 'Tiêu chuẩn Tiếp cận WCAG 2.2 AA',
    type: 'NFR',
    priority: 'Must',
    description: 'Màu chữ chính (#1C1917) trên nền (#FAFAF9) đạt độ tương phản 16.7:1 (vượt chuẩn AAA). Nút bấm chính (#92400E) đạt 7.1:1 (chuẩn AAA). Chữ phụ (#78716C) trên trắng đạt 4.8:1 (chuẩn AA).',
    verifiedInClient: 'Toàn site — chữ chính #1C1917 trên #FAFAF9 = 16,7:1 · trắng trên nút #92400E = 7,1:1 · chữ phụ #78716C trên trắng = 4,8:1 · focus ring, bàn phím',
    status: 'passed'
  },
  {
    id: 'BR-RULE-01',
    name: 'Quy tắc Chuỗi Cung Ứng Lạnh (Cold Chain Rule)',
    type: 'BR',
    priority: 'Must',
    description: 'Nếu giỏ hàng chứa bất kỳ sản phẩm nào có điều kiện bảo quản là "chilled" hoặc "frozen", đơn hàng bắt buộc phải đóng gói thùng cách nhiệt đá gel.',
    verifiedInClient: 'Giỏ hàng, thanh toán, /san-pham/:id — hàng lạnh → xe lạnh + phí đóng gói',
    status: 'passed'
  },
  {
    id: 'BR-RULE-02',
    name: 'Quy tắc Chiết Khấu Sỉ Tự Động (Wholesale Tier Rule)',
    type: 'BR',
    priority: 'Must',
    description: 'Khi số lượng một mặt hàng vượt qua các mốc tối thiểu (Ví dụ: bơ Anchor mua từ 10 thỏi hoặc từ 40 thỏi), giá đơn vị sẽ tự động hạ theo bảng giá sỉ.',
    verifiedInClient: '/san-pham/:id, /gio-hang — giá tự hạ theo mốc số lượng',
    status: 'passed'
  }
];
