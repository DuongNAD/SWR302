import { SWRRequirement } from '../types';

export const SWR_REQUIREMENTS: SWRRequirement[] = [
  {
    id: 'FR-AUTH-01',
    name: 'Đăng ký & Đăng nhập phân quyền',
    type: 'FR',
    priority: 'Must',
    description: 'Hệ thống hỗ trợ đăng nhập cho Khách mua hàng (Home Baker / Chủ tiệm bánh sỉ) và Nhân viên Quản lý (Admin). Có cơ chế giả lập OTP.',
    verifiedInClient: 'Header > Nút Tài khoản / Đăng nhập (Cho phép chọn Demo Role: Baker hoặc Admin)',
    status: 'passed'
  },
  {
    id: 'FR-SRC-01',
    name: 'Tìm kiếm & Gợi ý từ khóa tức thì',
    type: 'FR',
    priority: 'Must',
    description: 'Hỗ trợ tìm kiếm theo tên nguyên liệu, mã SKU, thương hiệu, hoặc danh mục với độ trễ phản hồi < 300ms và gợi ý tìm kiếm.',
    verifiedInClient: 'Header > Search Bar có bộ chọn danh mục, phím tắt Ctrl+K và gợi ý từ khóa',
    status: 'passed'
  },
  {
    id: 'FR-FIL-02',
    name: 'Bộ lọc thuộc tính chuyên ngành làm bánh',
    type: 'FR',
    priority: 'Must',
    description: 'Lọc sản phẩm đa chiều theo: Điều kiện bảo quản (Bắt buộc xe lạnh / Nhiệt độ phòng), Thương hiệu, Khoảng giá, và Tình trạng kho.',
    verifiedInClient: 'Trang Sản Phẩm > Sidebar bộ lọc bên trái với bộ đếm sản phẩm thời gian thực',
    status: 'passed'
  },
  {
    id: 'FR-PROD-03',
    name: 'Đặc tả chi tiết sản phẩm & Giá sỉ bậc thang',
    type: 'FR',
    priority: 'Must',
    description: 'Hiển thị đầy đủ thông số kỹ thuật, hạn sử dụng theo lô (Expiry Date), điều kiện lưu trữ, công thức làm bánh gợi ý và bảng chiết khấu sỉ.',
    verifiedInClient: 'Xem nhanh & Modal chi tiết sản phẩm > Bảng giá sỉ bậc thang (Wholesale Tiers) và cảnh báo nhiệt độ',
    status: 'passed'
  },
  {
    id: 'FR-KIT-04',
    name: 'Bộ Combo Nguyên Liệu Theo Món (Recipe Kit)',
    type: 'FR',
    priority: 'Should',
    description: 'Tính năng cốt lõi cho tiệm bánh: Chọn món bánh (Tiramisu, Sourdough, Cookies) và thêm toàn bộ nguyên liệu đủ định lượng chỉ với 1 click.',
    verifiedInClient: 'Section "Combo Làm Bánh Theo Món" > Chọn món > Nút "Thêm các món đã chọn vào giỏ"',
    status: 'passed'
  },
  {
    id: 'FR-CART-05',
    name: 'Giỏ hàng thông minh & Cảnh báo bảo quản lạnh',
    type: 'FR',
    priority: 'Must',
    description: 'Tính toán tổng trọng lượng đơn hàng (kg), áp dụng giá sỉ tự động khi đạt số lượng, thông báo phí đóng gói thùng cách nhiệt đá gel.',
    verifiedInClient: 'Drawer giỏ hàng bên phải > Thanh tiến trình miễn phí ship lạnh và bảng tóm tắt chi phí',
    status: 'passed'
  },
  {
    id: 'FR-CHK-06',
    name: 'Thanh toán & Chọn phương thức vận chuyển lạnh',
    type: 'FR',
    priority: 'Must',
    description: 'Hỗ trợ chọn Giao hàng chuẩn hoặc Giao hỏa tốc xe lạnh 2-4h. Thanh toán qua VNPay QR Code (preview mã QR động), MoMo, Chuyển khoản, COD.',
    verifiedInClient: 'Modal Đặt Hàng > Quy trình 3 bước với form nhập địa chỉ, mã giảm giá và thanh toán QR',
    status: 'passed'
  },
  {
    id: 'FR-TRK-07',
    name: 'Theo dõi hành trình đơn hàng thời gian thực',
    type: 'FR',
    priority: 'Must',
    description: 'Hiển thị tiến trình đơn hàng (Chờ duyệt -> Đang đóng gói có đá gel -> Đang giao xe lạnh -> Hoàn tất), mã tra cứu vận đơn và hóa đơn điện tử.',
    verifiedInClient: 'Màn hình Sau Đặt Hàng > Timeline trực quan + Nút in phiếu xuất kho / hóa đơn điện tử',
    status: 'passed'
  },
  {
    id: 'FR-ADM-08',
    name: 'Phân hệ Quản trị kho & Cảnh báo hạn sử dụng',
    type: 'FR',
    priority: 'Must',
    description: 'Dành cho nhân viên cửa hàng Gia Hòa Phát: Quản lý danh mục, thêm/sửa sản phẩm, cập nhật tồn kho, cảnh báo lô hàng bơ sữa sắp hết hạn.',
    verifiedInClient: 'Chuyển sang chế độ Quản Trị Viên (Admin View) ở thanh điều hướng trên cùng',
    status: 'passed'
  },
  {
    id: 'NFR-A11Y-01',
    name: 'Tiêu chuẩn Tiếp cận WCAG 2.2 AA',
    type: 'NFR',
    priority: 'Must',
    description: 'Màu chữ chính (#2B1D14) trên nền (#FFFBF5) đạt độ tương phản 14.8:1 (vượt chuẩn AAA). Nút bấm chính (#92400E) đạt 5.1:1 (đạt chuẩn AA).',
    verifiedInClient: 'Kiểm tra bằng công cụ devtools / Không sử dụng emoji làm icon đơn thuần, hỗ trợ focus ring rõ ràng',
    status: 'passed'
  },
  {
    id: 'BR-RULE-01',
    name: 'Quy tắc Chuỗi Cung Ứng Lạnh (Cold Chain Rule)',
    type: 'BR',
    priority: 'Must',
    description: 'Nếu giỏ hàng chứa bất kỳ sản phẩm nào có điều kiện bảo quản là "chilled" hoặc "frozen", đơn hàng bắt buộc phải đóng gói thùng cách nhiệt đá gel.',
    verifiedInClient: 'Hệ thống tự động phát hiện sản phẩm bơ/kem và áp dụng quy tắc đóng gói lạnh trong giỏ hàng',
    status: 'passed'
  },
  {
    id: 'BR-RULE-02',
    name: 'Quy tắc Chiết Khấu Sỉ Tự Động (Wholesale Tier Rule)',
    type: 'BR',
    priority: 'Must',
    description: 'Khi số lượng một mặt hàng vượt qua các mốc tối thiểu (Ví dụ: bơ Anchor mua từ 10 thỏi hoặc từ 40 thỏi), giá đơn vị sẽ tự động hạ theo bảng giá sỉ.',
    verifiedInClient: 'Giỏ hàng và Trang sản phẩm hiển thị trực quan phần trăm giảm giá khi tăng số lượng',
    status: 'passed'
  }
];
