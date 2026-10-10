// DỮ LIỆU của sơ đồ use case (Topic 1) — sửa file này rồi chạy lại `node ui-spec/diagrams/build-use-cases.mjs`.
//
// Mỗi NHÓM chức năng = một sơ đồ phân rã (Hình 2.n). Mỗi use case là MỘT THAO TÁC người dùng làm được trên giao diện
// (lấy từ nút, liên kết, tab, menu và thông báo trong mã nguồn `src/pages`, `src/components`, `src/layouts`).
//
// u(id, tên, tác nhân, màn hình, tùy chọn)
//   id       số thứ tự trong nhóm → mã UC-<nhóm>.<id>, vd. UC-6.3
//   tác nhân mảng mã tác nhân LÀM TRỰC TIẾP use case (đường kết hợp vẽ từ người tới elip). Để null = use case phụ:
//            do cùng tác nhân của use case gốc mà nó nối tới («include» / «extend») thực hiện, nằm ở cột bên phải
//   rel      các quan hệ XUẤT PHÁT từ use case này: ['include', id] (use case này luôn gọi id)
//            hoặc ['extend', id] (use case này mở rộng id). Mũi tên đi theo đúng hướng đó
//   sys      mã hệ thống ngoài mà use case làm việc với
//   req      yêu cầu liên quan (mặc định lấy của nhóm); note: ghi chú ngắn
//
// QUY TẮC XẾP THỨ TỰ: use case có tác nhân (cột giữa) viết theo thứ tự từ trên xuống; tác nhân cha viết trước tác nhân
// con ở mảng `actors`, và use case của tác nhân cha viết trước use case của tác nhân con, để đường nối không cắt nhau.
export const SYSTEM_NAME = 'Gia Hòa Phát Bakery Supply';

// Tác nhân (người). Vai trò tiếng Anh khớp `role` trong AuthContext: customer · wholesale_client · staff · admin.
export const ACTORS = {
  KV: { name: ['Khách vãng lai'], role: 'Guest', desc: 'Người chưa đăng nhập: xem, tìm kiếm, tra cứu đơn, đăng ký, đăng nhập' },
  KL: { name: ['Khách hàng lẻ'], role: 'Customer', desc: 'Thợ làm bánh tại gia, đã đăng nhập: giỏ hàng, đặt hàng, theo dõi đơn, tài khoản' },
  KS: { name: ['Khách hàng sỉ'], role: 'Wholesale', desc: 'Chủ tiệm bánh, nhà hàng, đại lý có tài khoản doanh nghiệp đã duyệt: giá sỉ, hóa đơn VAT' },
  NV: { name: ['Nhân viên kho', 'và vận hành'], role: 'Staff', desc: 'Xử lý đơn hàng, kho và hạn dùng, vận chuyển chuỗi lạnh' },
  AD: { name: ['Quản trị viên'], role: 'Admin', desc: 'Toàn quyền quản trị: sản phẩm, khách hàng, khuyến mãi, báo cáo, nhân viên, cài đặt' },
};
// Kế thừa: tác nhân con làm được mọi việc của tác nhân cha.
export const ACTOR_PARENT = { KL: 'KV', KS: 'KL', AD: 'NV' };

// Hệ thống ngoài (hình chữ nhật «hệ thống ngoài»; ở prototype chỉ mô phỏng).
export const SYSTEMS = {
  PAY: { lines: ['Cổng thanh toán', 'VNPay / MoMo'], note: 'Khối mã QR tĩnh (public/qr-demo.svg)' },
  MAIL: { lines: ['Dịch vụ Email / SMS'], note: 'Gửi OTP, liên kết đặt lại mật khẩu, email xác nhận, tin nhắn liên hệ — chỉ hiện thông báo trên màn hình' },
  EINV: { lines: ['Dịch vụ hóa đơn', 'điện tử'], note: 'Nút "Tải hóa đơn điện tử (PDF)" giả' },
  IOT: { lines: ['Cảm biến nhiệt độ', 'xe lạnh'], note: 'Số liệu nhiệt độ thùng viết cứng trong mocks/shipments.ts' },
};

const u = (id, name, by, scr, o = {}) => ({ id: String(id), name, by: by || [], scr, ...o });

export const GROUPS = [
  // ───────────── KHÁCH VÃNG LAI ─────────────
  {
    slug: 'cua-hang-ho-tro-mua-si', title: 'Cửa hàng, hỗ trợ và mua sỉ', actors: ['KV'], systems: ['MAIL'], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem hệ thống cửa hàng', ['KV'], 'SCR-22'),
      u(2, 'Lọc cửa hàng theo khu vực', null, 'SCR-22', { rel: [['extend', 1]] }),
      u(3, 'Xem chỉ đường đến cửa hàng', null, 'SCR-22', { rel: [['extend', 1]], note: 'Mở Google Maps ở tab mới' }),
      u(4, 'Gọi điện đến cửa hàng', null, 'SCR-22', { rel: [['extend', 1]] }),
      u(5, 'Xem trung tâm hỗ trợ và chính sách', ['KV'], 'SCR-23'),
      u(6, 'Xem câu hỏi thường gặp (FAQ)', null, 'SCR-23', { rel: [['extend', 5]] }),
      u(7, 'Xem giới thiệu công ty', ['KV'], 'SCR-24'),
      u(8, 'Gửi liên hệ, góp ý', ['KV'], 'SCR-24', { sys: ['MAIL'] }),
      u(9, 'Xem quyền lợi và bảng chiết khấu mua sỉ', ['KV'], 'SCR-21', { req: 'BR-RULE-02' }),
      u(10, 'Gửi yêu cầu đăng ký đại lý mua sỉ', ['KV'], 'SCR-21', { req: 'BR-RULE-02, đề xuất FR mới', note: 'Phản hồi trong 24 giờ làm việc (nội dung mô phỏng)' }),
    ],
  },
  {
    slug: 'chi-tiet-san-pham', title: 'Xem chi tiết sản phẩm', actors: ['KV'], systems: [], req: 'FR-PROD-03',
    ucs: [
      u(1, 'Xem chi tiết sản phẩm', ['KV'], 'SCR-04', { rel: [['include', 3], ['include', 5], ['include', 6], ['include', 7], ['include', 8], ['include', 9]] }),
      u(2, 'Phóng to ảnh sản phẩm', null, 'SCR-04', { rel: [['extend', 1]] }),
      u(3, 'Xem bảng giá sỉ bậc thang', null, 'SCR-04', { req: 'FR-PROD-03, BR-RULE-02', note: 'Dòng ứng với số lượng đang chọn được tô nổi' }),
      u(4, 'Chọn nhanh số lượng theo bậc giá', null, 'SCR-04', { rel: [['extend', 3]], req: 'BR-RULE-02' }),
      u(5, 'Xem hạn dùng, số lô và tồn kho', null, 'SCR-04', { req: 'FR-PROD-03, BR-RULE-01', note: 'Hàng cần lạnh hiện ghi chú bảo quản 2–8°C và giao xe lạnh' }),
      u(6, 'Xem tình trạng hàng tại các cửa hàng', null, 'SCR-04'),
      u(7, 'Xem mô tả, thành phần và thông số', null, 'SCR-04', { note: 'Các tab Mô tả, Thành phần, Bảo quản và sử dụng, Thông số kỹ thuật' }),
      u(8, 'Xem đánh giá của khách hàng', null, 'SCR-04', { note: 'Tab Đánh giá' }),
      u(9, 'Xem món bánh phù hợp và sản phẩm liên quan', null, 'SCR-04'),
    ],
  },
  {
    slug: 'duyet-tim-kiem-combo', title: 'Duyệt, tìm kiếm và combo', actors: ['KV', 'KL'], systems: [], req: 'FR-SRC-01',
    ucs: [
      u(1, 'Xem trang chủ', ['KV'], 'SCR-01', { req: 'FR-SRC-01, FR-KIT-04' }),
      u(2, 'Duyệt sản phẩm theo danh mục', ['KV'], 'SCR-02', { req: 'FR-FIL-02' }),
      u(3, 'Lọc sản phẩm', null, 'SCR-02', { rel: [['extend', 2]], req: 'FR-FIL-02', note: 'Danh mục, điều kiện bảo quản, thương hiệu, khoảng giá, còn hàng; gỡ từng lọc hoặc xóa tất cả' }),
      u(4, 'Sắp xếp sản phẩm', null, 'SCR-02', { rel: [['extend', 2]], req: 'FR-FIL-02' }),
      u(5, 'Chuyển trang danh sách', null, 'SCR-02', { rel: [['extend', 2]] }),
      u(6, 'Tìm kiếm sản phẩm', ['KV'], 'SCR-03', { note: 'Theo tên, thương hiệu, SKU, danh mục; ô tìm kiếm ở đầu trang' }),
      u(7, 'Xem gợi ý tìm kiếm (Ctrl/⌘ + K)', null, 'SCR-03', { rel: [['extend', 6]] }),
      u(8, 'Xem danh sách combo công thức', ['KV'], 'SCR-05', { req: 'FR-KIT-04' }),
      u(9, 'Xem chi tiết combo và cách làm', ['KV'], 'SCR-06', { req: 'FR-KIT-04' }),
      u(10, 'Chọn hoặc bỏ nguyên liệu trong combo', null, 'SCR-06', { rel: [['extend', 9]], req: 'FR-KIT-04' }),
      u(11, 'Thêm nguyên liệu đã chọn vào giỏ', ['KL'], 'SCR-06', { rel: [['extend', 9]], req: 'FR-KIT-04, FR-CART-05' }),
    ],
  },
  {
    slug: 'tai-khoan-xac-thuc', title: 'Tài khoản và xác thực', actors: ['NV', 'KV', 'KL'], systems: ['MAIL'], req: 'FR-AUTH-01',
    ucs: [
      u(1, 'Đăng nhập', ['NV', 'KV'], 'SCR-12', { note: 'Mọi vai trò dùng chung một màn hình đăng nhập' }),
      u(2, 'Đăng ký tài khoản khách lẻ', ['KV'], 'SCR-13', { rel: [['include', 4]] }),
      u(3, 'Đăng ký tài khoản doanh nghiệp (sỉ)', ['KV'], 'SCR-13', { rel: [['include', 4]], note: 'Nhập thêm tên doanh nghiệp và mã số thuế; chờ quản trị viên duyệt' }),
      u(4, 'Xác thực OTP', null, 'SCR-13 (bước 2)', { sys: ['MAIL'] }),
      u(5, 'Gửi lại mã OTP', null, 'SCR-13 (bước 2)', { rel: [['extend', 4]] }),
      u(6, 'Quên mật khẩu', ['KV'], 'SCR-14', { sys: ['MAIL'], req: 'đề xuất FR mới', note: 'Gửi liên kết đặt lại qua email, không có OTP' }),
      u(7, 'Đăng xuất', ['KL'], 'Menu tài khoản ở đầu trang', { req: 'đề xuất FR mới' }),
    ],
  },
  {
    slug: 'theo-doi-don-hang', title: 'Theo dõi và quản lý đơn hàng', actors: ['KV', 'KL'], systems: ['IOT', 'EINV'], req: 'FR-TRK-07',
    ucs: [
      u(1, 'Tra cứu đơn hàng bằng mã đơn và SĐT', ['KV'], 'SCR-10', { rel: [['include', 2]] }),
      u(2, 'Xem hành trình đơn hàng', ['KL'], 'SCR-11', { sys: ['IOT'], note: '5 mốc xử lý, tài xế, xe và nhiệt độ thùng lạnh; vào từ danh sách đơn hoặc trang đặt hàng thành công' }),
      u(3, 'Hủy đơn hàng', null, 'SCR-11, SCR-16', { rel: [['extend', 2]], note: 'Khi đơn chờ xác nhận hoặc đã xác nhận' }),
      u(4, 'Mua lại đơn hàng', null, 'SCR-11, SCR-16', { rel: [['extend', 2]] }),
      u(5, 'In hóa đơn', null, 'SCR-11', { rel: [['extend', 2]] }),
      u(6, 'Tải hóa đơn điện tử (PDF)', null, 'SCR-11', { rel: [['extend', 2]], sys: ['EINV'], note: 'Đơn có yêu cầu hóa đơn VAT' }),
      u(7, 'Xem danh sách đơn hàng của tôi', ['KL'], 'SCR-16'),
      u(8, 'Lọc đơn theo trạng thái', null, 'SCR-16', { rel: [['extend', 7]] }),
    ],
  },

  // ───────────── KHÁCH HÀNG LẺ / SỈ ─────────────
  {
    slug: 'gio-hang', title: 'Giỏ hàng', actors: ['KL'], systems: [], req: 'FR-CART-05',
    ucs: [
      u(1, 'Thêm sản phẩm vào giỏ', ['KL'], 'SCR-02, SCR-04, SCR-18, giỏ mini', { note: 'Từ thẻ sản phẩm, trang chi tiết, danh sách yêu thích' }),
      u(2, 'Mua ngay', ['KL'], 'SCR-04', { rel: [['include', 1]], note: 'Thêm vào giỏ rồi chuyển thẳng sang thanh toán' }),
      u(3, 'Xem giỏ hàng', ['KL'], 'SCR-07, giỏ mini', { req: 'FR-CART-05, BR-RULE-01, BR-RULE-02', note: 'Hiện tiến độ miễn phí vận chuyển và gợi ý bậc giá kế tiếp' }),
      u(4, 'Đổi số lượng sản phẩm trong giỏ', null, 'SCR-07', { rel: [['extend', 3]] }),
      u(5, 'Xóa sản phẩm khỏi giỏ', null, 'SCR-07, giỏ mini', { rel: [['extend', 3]] }),
      u(6, 'Xóa toàn bộ giỏ hàng', null, 'SCR-07', { rel: [['extend', 3]] }),
      u(7, 'Áp dụng mã giảm giá', null, 'SCR-07', { rel: [['extend', 3]], note: 'BAKING2026, GHPVIP, FREESHIP' }),
      u(8, 'Bỏ mã giảm giá', null, 'SCR-07', { rel: [['extend', 7]] }),
    ],
  },
  {
    slug: 'dat-hang-thanh-toan', title: 'Đặt hàng và thanh toán', actors: ['KL', 'KS'], systems: ['MAIL', 'PAY', 'EINV'], req: 'FR-CHK-06',
    ucs: [
      u(1, 'Đặt hàng', ['KL'], 'SCR-08', { sys: ['MAIL'], rel: [['include', 2], ['include', 3], ['include', 4], ['include', 5], ['include', 8]], note: 'Thanh toán 3 bước: nhận hàng, vận chuyển, thanh toán' }),
      u(2, 'Chọn hình thức nhận hàng', null, 'SCR-08 (bước 1)', { note: 'Giao tận nơi hoặc nhận tại cửa hàng' }),
      u(3, 'Chọn hoặc nhập địa chỉ nhận hàng', null, 'SCR-08 (bước 1)'),
      u(4, 'Chọn phương thức vận chuyển', null, 'SCR-08 (bước 2)', { req: 'FR-CHK-06, BR-RULE-01', note: 'Giao tiêu chuẩn 25.000₫ hoặc xe lạnh 45.000₫' }),
      u(5, 'Chọn phương thức thanh toán', null, 'SCR-08 (bước 3)', { note: 'VNPay QR, MoMo, chuyển khoản, COD' }),
      u(6, 'Thanh toán bằng mã QR VNPay', null, 'SCR-08 (bước 3)', { rel: [['extend', 5]], sys: ['PAY'] }),
      u(7, 'Yêu cầu xuất hóa đơn VAT', null, 'SCR-08 (bước 1)', { rel: [['extend', 1]], sys: ['EINV'], note: 'Khách sỉ được gợi ý bật sẵn' }),
      u(8, 'Xem xác nhận đặt hàng thành công', null, 'SCR-09'),
      u(9, 'In phiếu đơn hàng', null, 'SCR-09', { rel: [['extend', 8]] }),
      u(10, 'Xuất VAT bằng thông tin doanh nghiệp điền sẵn', ['KS'], 'SCR-08 (bước 1)', { rel: [['extend', 7]], note: 'Khách sỉ: hóa đơn VAT bật sẵn, tự điền mã số thuế, tên và địa chỉ công ty' }),
    ],
  },
  {
    slug: 'yeu-thich-danh-gia', title: 'Yêu thích và đánh giá', actors: ['KL'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem sản phẩm yêu thích', ['KL'], 'SCR-18'),
      u(2, 'Thêm sản phẩm vào yêu thích', ['KL'], 'SCR-02, SCR-04', { note: 'Nút ♡ ở thẻ sản phẩm và trang chi tiết' }),
      u(3, 'Bỏ sản phẩm khỏi yêu thích', ['KL'], 'SCR-18, SCR-04'),
      u(4, 'Viết đánh giá sản phẩm', ['KL'], 'SCR-04 (tab Đánh giá)', { note: 'Chấm sao và viết nhận xét' }),
    ],
  },
  {
    slug: 'ho-so-so-dia-chi', title: 'Hồ sơ, sổ địa chỉ và doanh nghiệp', actors: ['KL', 'KS'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem tổng quan tài khoản', ['KL'], 'SCR-15'),
      u(2, 'Xem sổ địa chỉ', ['KL'], 'SCR-17'),
      u(3, 'Thêm địa chỉ mới', null, 'SCR-17', { rel: [['extend', 2]] }),
      u(4, 'Sửa địa chỉ', null, 'SCR-17', { rel: [['extend', 2]] }),
      u(5, 'Xóa địa chỉ', null, 'SCR-17', { rel: [['extend', 2]] }),
      u(6, 'Đặt địa chỉ mặc định', null, 'SCR-17', { rel: [['extend', 2]] }),
      u(7, 'Cập nhật thông tin cá nhân', ['KL'], 'SCR-19'),
      u(8, 'Đổi mật khẩu', ['KL'], 'SCR-19'),
      u(9, 'Xem hồ sơ doanh nghiệp', ['KS'], 'SCR-20', { req: 'BR-RULE-02, đề xuất FR mới' }),
      u(10, 'Cập nhật thông tin xuất hóa đơn VAT', null, 'SCR-20', { rel: [['extend', 9]] }),
      u(11, 'Xem bảng chiết khấu của tôi', ['KS'], 'SCR-15, SCR-20', { req: 'BR-RULE-02' }),
      u(12, 'Xem hạn mức công nợ', ['KS'], 'SCR-15', { req: 'đề xuất FR mới', note: 'Hiện trong thẻ đại lý ở tổng quan tài khoản' }),
    ],
  },

  // ───────────── NHÂN VIÊN KHO VÀ VẬN HÀNH ─────────────
  {
    slug: 'quan-ly-don-hang', title: 'Quản lý đơn hàng', actors: ['NV', 'AD'], systems: [], req: 'FR-ADM-08',
    ucs: [
      u(1, 'Xem danh sách đơn hàng', ['NV'], 'SCR-A02'),
      u(2, 'Lọc đơn theo trạng thái', null, 'SCR-A02', { rel: [['extend', 1]] }),
      u(3, 'Lọc đơn theo hình thức vận chuyển', null, 'SCR-A02', { rel: [['extend', 1]] }),
      u(4, 'Tìm kiếm đơn hàng', null, 'SCR-A02', { rel: [['extend', 1]] }),
      u(5, 'Duyệt hàng loạt các đơn đã chọn', null, 'SCR-A02', { rel: [['extend', 1]] }),
      u(6, 'Xuất danh sách đơn ra CSV', null, 'SCR-A02', { rel: [['extend', 1]] }),
      u(7, 'Xem chi tiết đơn hàng', ['NV'], 'SCR-A03', { rel: [['include', 12]] }),
      u(8, 'Cập nhật trạng thái xử lý đơn', null, 'SCR-A03', { rel: [['extend', 7]], note: 'Xác nhận → đóng gói → bàn giao xe lạnh → hoàn tất' }),
      u(9, 'Kiểm tra checklist đóng gói lạnh', null, 'SCR-A03', { rel: [['extend', 7]], req: 'FR-ADM-08, BR-RULE-01', note: 'Thùng xốp, đá gel, nhiệt kế' }),
      u(10, 'In phiếu xuất kho', null, 'SCR-A03', { rel: [['extend', 7]] }),
      u(11, 'In hóa đơn VAT', null, 'SCR-A03', { rel: [['extend', 7]] }),
      u(12, 'Xem lịch sử trạng thái của đơn', null, 'SCR-A03'),
    ],
  },
  {
    slug: 'kho-lo-hang', title: 'Quản lý kho và lô hàng', actors: ['NV', 'AD'], systems: [], req: 'FR-ADM-08',
    ucs: [
      u(1, 'Xem tồn kho theo sản phẩm', ['NV'], 'SCR-A07', { rel: [['include', 6]] }),
      u(2, 'Sửa nhanh số lượng tồn kho', null, 'SCR-A07', { rel: [['extend', 1]] }),
      u(3, 'Tạo phiếu nhập kho', null, 'SCR-A07', { rel: [['extend', 1]] }),
      u(4, 'Xem lô hàng và hạn dùng (FEFO)', ['NV'], 'SCR-A07', { rel: [['include', 7]], note: 'Hết hạn trước, xuất trước' }),
      u(5, 'Xem nhật ký nhập xuất', ['NV'], 'SCR-A07'),
      u(6, 'Cảnh báo sản phẩm tồn kho thấp', null, 'SCR-A07, SCR-A01'),
      u(7, 'Cảnh báo lô sắp hết hạn', null, 'SCR-A07, SCR-A01', { note: 'Còn ≤ 30 ngày; ≤ 7 ngày làm nổi hơn' }),
    ],
  },
  {
    slug: 'van-chuyen-chuoi-lanh', title: 'Vận chuyển và chuỗi lạnh', actors: ['NV', 'AD'], systems: ['IOT'], req: 'FR-ADM-08, BR-RULE-01',
    ucs: [
      u(1, 'Xem chuyến giao hôm nay', ['NV'], 'SCR-A10', { rel: [['include', 2]] }),
      u(2, 'Xem nhiệt độ thùng xe lạnh', null, 'SCR-A10', { sys: ['IOT'], note: 'Cảnh báo khi vượt 8°C' }),
      u(3, 'Định vị GPS xe giao hàng', null, 'SCR-A10', { rel: [['extend', 1]], sys: ['IOT'] }),
      u(4, 'Xuất báo cáo chuyến xe ra CSV', null, 'SCR-A10', { rel: [['extend', 1]] }),
      u(5, 'Xem nhật ký nhiệt độ', ['NV'], 'SCR-A10', { sys: ['IOT'] }),
      u(6, 'Xem biểu phí và ngưỡng miễn phí', ['NV'], 'SCR-A10'),
    ],
  },

  // ───────────── QUẢN TRỊ VIÊN ─────────────
  {
    slug: 'tong-quan-quan-tri', title: 'Tổng quan quản trị', actors: ['AD'], systems: [], req: 'FR-ADM-08',
    ucs: [
      u(1, 'Xem chỉ số kinh doanh', ['AD'], 'SCR-A01', { rel: [['include', 3], ['include', 4], ['include', 5], ['include', 6]], note: 'Doanh thu, đơn hàng, đơn cần xử lý, cảnh báo kho và HSD' }),
      u(2, 'Chọn kỳ thống kê 7 hoặc 30 ngày', null, 'SCR-A01', { rel: [['extend', 1]] }),
      u(3, 'Xem biểu đồ doanh thu theo ngày', null, 'SCR-A01'),
      u(4, 'Xem đơn hàng theo trạng thái', null, 'SCR-A01'),
      u(5, 'Xem cảnh báo kho và lô sắp hết hạn', null, 'SCR-A01'),
      u(6, 'Xem chuyến xe lạnh đang giao', null, 'SCR-A01'),
      u(7, 'Xử lý nhanh đơn cần xử lý', null, 'SCR-A01', { rel: [['extend', 1]], note: 'Mở chi tiết đơn hàng' }),
    ],
  },
  {
    slug: 'bao-cao', title: 'Báo cáo', actors: ['AD'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem báo cáo doanh thu theo thời gian', ['AD'], 'SCR-A11'),
      u(2, 'Xem top 10 sản phẩm bán chạy', null, 'SCR-A11', { rel: [['extend', 1]] }),
      u(3, 'Xem phân khúc khách hàng lẻ và sỉ', null, 'SCR-A11', { rel: [['extend', 1]] }),
      u(4, 'Chọn kỳ báo cáo 7 hoặc 30 ngày', null, 'SCR-A11', { rel: [['extend', 1]] }),
      u(5, 'Xuất báo cáo ra CSV', null, 'SCR-A11', { rel: [['extend', 1]] }),
    ],
  },
  {
    slug: 'san-pham-danh-muc', title: 'Quản lý sản phẩm và danh mục', actors: ['AD'], systems: [], req: 'FR-ADM-08',
    ucs: [
      u(1, 'Xem danh sách sản phẩm', ['AD'], 'SCR-A04'),
      u(2, 'Tìm và lọc sản phẩm', null, 'SCR-A04', { rel: [['extend', 1]], note: 'Danh mục, điều kiện bảo quản, tồn kho thấp' }),
      u(3, 'Ẩn hoặc mở bán lại sản phẩm', null, 'SCR-A04', { rel: [['extend', 1]] }),
      u(4, 'Xóa sản phẩm', null, 'SCR-A04', { rel: [['extend', 1]], note: 'Có hộp thoại xác nhận' }),
      u(5, 'Thêm sản phẩm mới', ['AD'], 'SCR-A05'),
      u(6, 'Sửa thông tin sản phẩm', ['AD'], 'SCR-A05'),
      u(7, 'Thiết lập bảng giá sỉ bậc thang', null, 'SCR-A05', { rel: [['extend', 5], ['extend', 6]], req: 'FR-ADM-08, BR-RULE-02' }),
      u(8, 'Xem danh sách danh mục', ['AD'], 'SCR-A06'),
      u(9, 'Thêm danh mục', null, 'SCR-A06', { rel: [['extend', 8]] }),
      u(10, 'Sửa danh mục', null, 'SCR-A06', { rel: [['extend', 8]] }),
      u(11, 'Xóa danh mục', null, 'SCR-A06', { rel: [['extend', 8]] }),
    ],
  },
  {
    slug: 'khach-hang', title: 'Quản lý khách hàng', actors: ['AD'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem danh sách khách hàng', ['AD'], 'SCR-A08'),
      u(2, 'Lọc khách hàng (tất cả, sỉ, chờ duyệt)', null, 'SCR-A08', { rel: [['extend', 1]] }),
      u(3, 'Xuất danh sách khách hàng ra CSV', null, 'SCR-A08', { rel: [['extend', 1]] }),
      u(4, 'Xem hồ sơ doanh nghiệp và giấy phép', null, 'SCR-A08', { rel: [['extend', 1]] }),
      u(5, 'Duyệt tài khoản khách sỉ', null, 'SCR-A08', { rel: [['extend', 4]], req: 'BR-RULE-02, đề xuất FR mới' }),
      u(6, 'Từ chối yêu cầu đăng ký sỉ', null, 'SCR-A08', { rel: [['extend', 4]] }),
    ],
  },
  {
    slug: 'khuyen-mai', title: 'Khuyến mãi và voucher', actors: ['AD'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem danh sách voucher', ['AD'], 'SCR-A09'),
      u(2, 'Lọc voucher theo loại', null, 'SCR-A09', { rel: [['extend', 1]], note: 'Giảm cố định, giảm phần trăm, miễn phí vận chuyển' }),
      u(3, 'Tạo voucher mới', null, 'SCR-A09', { rel: [['extend', 1]] }),
      u(4, 'Bật hoặc tạm dừng voucher', null, 'SCR-A09', { rel: [['extend', 1]] }),
      u(5, 'Xóa voucher', null, 'SCR-A09', { rel: [['extend', 1]] }),
    ],
  },
  {
    slug: 'nhan-vien-phan-quyen', title: 'Nhân viên và phân quyền', actors: ['AD'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Xem danh sách nhân sự', ['AD'], 'SCR-A12'),
      u(2, 'Lọc nhân sự theo vai trò', null, 'SCR-A12', { rel: [['extend', 1]] }),
      u(3, 'Mời nhân viên mới', null, 'SCR-A12', { rel: [['extend', 1]], note: 'Gửi lời mời kích hoạt qua email' }),
      u(4, 'Chỉnh sửa tài khoản nhân viên', null, 'SCR-A12', { rel: [['extend', 1]] }),
      u(5, 'Xem ma trận phân quyền', ['AD'], 'SCR-A12'),
      u(6, 'Cập nhật quyền theo vai trò', null, 'SCR-A12', { rel: [['extend', 5]] }),
    ],
  },
  {
    slug: 'cai-dat', title: 'Cài đặt hệ thống', actors: ['AD'], systems: [], req: 'đề xuất FR mới',
    ucs: [
      u(1, 'Cập nhật thông tin cửa hàng', ['AD'], 'SCR-A13'),
      u(2, 'Cập nhật biểu phí vận chuyển', ['AD'], 'SCR-A13', { note: 'Phí giao tiêu chuẩn, xe lạnh, ngưỡng miễn phí' }),
      u(3, 'Bật hoặc tắt phương thức thanh toán', ['AD'], 'SCR-A13', { note: 'VNPay QR, MoMo, chuyển khoản, COD' }),
      u(4, 'Cấu hình thông báo tự động', ['AD'], 'SCR-A13', { note: 'Email xác nhận, thông báo giao hàng, cảnh báo nhiệt, báo cáo tuần' }),
    ],
  },
];
