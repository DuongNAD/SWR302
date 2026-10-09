#!/usr/bin/env node
// Dựng SƠ ĐỒ USE CASE (UML) cho Topic 1 — Gia Hòa Phát Bakery Supply.
// Bố cục theo tài liệu mẫu của nhóm: khung hệ thống có thẻ tên ở góc trên phải, cột use case hình elip ở giữa,
// actor hình người que ở hai bên, đường kết hợp tỏa ra từ actor, mũi tên tam giác rỗng cho quan hệ kế thừa.
//
//   node ui-spec/diagrams/build-use-cases.mjs        → ghi uc-*.svg và uc-*.png (nét x2) cạnh file này
//   node ui-spec/diagrams/build-use-cases.mjs --md          → in hai bảng markdown (chức năng tổng quan, danh mục 41 use case)
//   node ui-spec/diagrams/build-use-cases.mjs --write-doc   → ghi hai bảng đó vào 05_use_case_diagram.md (giữa các cặp dấu <!-- uc:… -->)
//
// Sửa sơ đồ = sửa phần DỮ LIỆU bên dưới rồi chạy lại. Script tự báo khi một đường nối xuyên qua use case khác
// và đếm số đường cắt nhau. Cần Chrome để xuất PNG (đặt CHROME_PATH nếu Chrome ở chỗ khác; không có thì chỉ ra SVG).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM_NAME = 'Gia Hòa Phát Bakery Supply';

// ═══════════════════════════ DỮ LIỆU ═══════════════════════════

// Tác nhân (người). Vai trò tiếng Anh khớp `role` trong AuthContext: customer · wholesale_client · staff · admin.
const ACTORS = {
  KV: { name: ['Khách vãng lai'], role: 'Guest', note: 'Người chưa đăng nhập, đang xem hoặc tra cứu' },
  KL: { name: ['Khách hàng lẻ'], role: 'Customer', note: 'Thợ làm bánh tại gia; có tài khoản' },
  KS: { name: ['Khách hàng sỉ'], role: 'Wholesale', note: 'Chủ tiệm bánh, nhà hàng, đại lý; tài khoản doanh nghiệp đã được duyệt' },
  NV: { name: ['Nhân viên kho', 'và vận hành'], role: 'Staff', note: 'Xử lý đơn, kho, vận chuyển' },
  AD: { name: ['Quản trị viên'], role: 'Admin', note: 'Toàn quyền quản trị hệ thống' },
};
// Hệ thống ngoài (hình chữ nhật «hệ thống ngoài»).
const SYSTEMS = {
  PAY: ['Cổng thanh toán', 'VNPay / MoMo'],
  MAIL: ['Dịch vụ Email / SMS'],
  EINV: ['Dịch vụ hóa đơn', 'điện tử'],
  IOT: ['Cảm biến nhiệt độ', 'xe lạnh'],
};

// Danh mục 41 use case: [mã, tên, tác nhân, chức năng tổng quan, sơ đồ phân rã, màn hình, yêu cầu, mô tả ngắn]
const UCS = [
  ['01', 'Đăng ký tài khoản', 'KV', 'F01', 'uc-01', 'SCR-13', 'FR-AUTH-01', 'Tạo tài khoản bằng họ tên, email hoặc SĐT và mật khẩu; chọn loại tài khoản cá nhân hoặc doanh nghiệp.'],
  ['02', 'Xác thực OTP', 'KV', 'F01', 'uc-01', 'SCR-13 (bước 2)', 'FR-AUTH-01', 'Nhập mã 6 số gửi qua email hoặc SMS để hoàn tất đăng ký.'],
  ['03', 'Đăng nhập', 'KV, NV', 'F02', 'uc-01', 'SCR-12', 'FR-AUTH-01', 'Đăng nhập bằng email hoặc SĐT và mật khẩu; mọi vai trò dùng chung một màn hình.'],
  ['04', 'Quên / đặt lại mật khẩu', 'KV', 'F02', 'uc-01', 'SCR-14', 'đề xuất FR mới', 'Nhập email để nhận liên kết đặt lại mật khẩu và xem thông báo đã gửi.'],
  ['05', 'Quản lý hồ sơ và sổ địa chỉ', 'KL', 'F06', 'uc-01', 'SCR-15, SCR-17, SCR-19', 'đề xuất FR mới', 'Sửa thông tin cá nhân, đổi mật khẩu, thêm / sửa / xóa địa chỉ giao hàng.'],
  ['06', 'Đăng ký tài khoản mua sỉ', 'KS', 'F11', 'uc-01', 'SCR-21, SCR-13, SCR-20', 'BR-RULE-02, đề xuất FR mới', 'Gửi hồ sơ doanh nghiệp (mã số thuế, giấy phép) để được duyệt và hưởng giá sỉ.'],
  ['07', 'Xem trang chủ và danh mục', 'KV', 'F03', 'uc-02', 'SCR-01', 'FR-SRC-01, FR-KIT-04', 'Xem banner, danh mục, sản phẩm bán chạy và mới về, combo, cửa hàng.'],
  ['08', 'Tìm kiếm sản phẩm', 'KV', 'F03', 'uc-02', 'SCR-03 (và ô tìm kiếm ở đầu trang)', 'FR-SRC-01', 'Tìm theo tên, thương hiệu, SKU; có gợi ý tức thì và phím tắt Ctrl/⌘ + K.'],
  ['09', 'Lọc và sắp xếp sản phẩm', 'KV', 'F03', 'uc-02', 'SCR-02', 'FR-FIL-02', 'Lọc theo danh mục, điều kiện bảo quản, thương hiệu, giá, tình trạng; sắp xếp; kết quả nằm trên URL.'],
  ['10', 'Xem chi tiết sản phẩm', 'KV', 'F03', 'uc-02', 'SCR-04', 'FR-PROD-03', 'Xem ảnh, giá, mô tả, thông số, đánh giá và sản phẩm liên quan.'],
  ['11', 'Xem giá sỉ bậc thang', 'KV', 'F03', 'uc-02', 'SCR-04, SCR-21', 'FR-PROD-03, BR-RULE-02', 'Xem bảng đơn giá giảm dần theo số lượng; dòng đang áp dụng được tô nổi.'],
  ['12', 'Xem HSD, lô và tồn kho theo cửa hàng', 'KV', 'F03', 'uc-02', 'SCR-04, SCR-22', 'FR-PROD-03', 'Xem hạn dùng, số lô, số lượng còn và tình trạng hàng ở từng cửa hàng.'],
  ['13', 'Xem combo công thức', 'KV', 'F03', 'uc-02', 'SCR-05, SCR-06', 'FR-KIT-04', 'Xem combo nguyên liệu theo món bánh, chọn hoặc bỏ nguyên liệu, xem cách làm.'],
  ['14', 'Viết đánh giá sản phẩm', 'KL', 'F07', 'uc-02', 'SCR-04 (tab Đánh giá)', 'đề xuất FR mới', 'Chấm sao và viết nhận xét cho sản phẩm.'],
  ['15', 'Quản lý sản phẩm yêu thích', 'KL', 'F07', 'uc-02', 'SCR-18 (và nút ♡ ở thẻ sản phẩm)', 'đề xuất FR mới', 'Thêm hoặc bỏ sản phẩm yêu thích, xem danh sách đã lưu.'],
  ['16', 'Xem hệ thống cửa hàng', 'KV', 'F04', 'uc-02', 'SCR-22', 'đề xuất FR mới', 'Xem địa chỉ, giờ mở cửa, dịch vụ từng cửa hàng; kiểm tra tồn kho theo cửa hàng.'],
  ['17', 'Xem hỗ trợ và chính sách', 'KV', 'F04', 'uc-02', 'SCR-23, SCR-24', 'đề xuất FR mới', 'Đọc hướng dẫn đặt hàng, giao hàng lạnh, đổi trả, câu hỏi thường gặp; gửi liên hệ.'],
  ['18', 'Quản lý giỏ hàng', 'KL', 'F08', 'uc-03', 'SCR-07 (và giỏ mini)', 'FR-CART-05, BR-RULE-01, BR-RULE-02', 'Thêm, xóa, đổi số lượng; xem gợi ý bậc giá kế tiếp và tiến độ miễn phí vận chuyển.'],
  ['19', 'Thêm cả combo vào giỏ', 'KL', 'F08', 'uc-03', 'SCR-06', 'FR-KIT-04', 'Thêm các nguyên liệu đã chọn của một combo vào giỏ trong một thao tác.'],
  ['20', 'Áp dụng mã giảm giá', 'KL', 'F08', 'uc-03', 'SCR-07 (giảm giá hiện lại ở SCR-08)', 'FR-CART-05', 'Nhập voucher (BAKING2026, GHPVIP, FREESHIP) và xem số tiền được giảm.'],
  ['21', 'Đặt hàng', 'KL', 'F09', 'uc-03', 'SCR-08, SCR-09', 'FR-CHK-06', 'Điền thông tin nhận hàng, chọn vận chuyển và thanh toán, xác nhận đơn.'],
  ['22', 'Chọn phương thức vận chuyển', 'KL', 'F09', 'uc-03', 'SCR-08 (bước 2)', 'FR-CHK-06, BR-RULE-01', 'Giao tiêu chuẩn 25.000₫ hoặc xe lạnh 45.000₫ cho hàng cần bảo quản lạnh.'],
  ['23', 'Thanh toán trực tuyến', 'KL', 'F09', 'uc-03', 'SCR-08 (bước 3)', 'FR-CHK-06', 'Chọn VNPay (hiện mã QR), MoMo hoặc chuyển khoản; thanh toán khi nhận hàng (COD) không qua cổng.'],
  ['24', 'Yêu cầu xuất hóa đơn VAT', 'KS', 'F11', 'uc-03', 'SCR-08 (bước 1), SCR-11', 'FR-CHK-06', 'Nhập mã số thuế, tên và địa chỉ công ty, email nhận hóa đơn điện tử.'],
  ['25', 'Theo dõi hành trình đơn hàng', 'KL', 'F10', 'uc-04', 'SCR-11', 'FR-TRK-07', 'Xem 5 mốc xử lý, tài xế, xe và nhiệt độ thùng lạnh của đơn.'],
  ['26', 'Tra cứu đơn hàng', 'KV', 'F05', 'uc-04', 'SCR-10 → SCR-11', 'FR-TRK-07', 'Nhập mã đơn và SĐT để xem tình trạng đơn mà không cần đăng nhập.'],
  ['27', 'Xem lịch sử đơn và mua lại', 'KL', 'F10', 'uc-04', 'SCR-16', 'FR-TRK-07', 'Xem danh sách đơn theo trạng thái; mua lại một đơn cũ.'],
  ['28', 'Hủy đơn hàng', 'KL', 'F10', 'uc-04', 'SCR-11, SCR-16', 'FR-TRK-07', 'Hủy đơn khi còn ở trạng thái chờ xác nhận hoặc đã xác nhận.'],
  ['29', 'Tải và in hóa đơn', 'KL', 'F10', 'uc-04', 'SCR-11, SCR-09', 'FR-TRK-07', 'Tải hóa đơn điện tử (PDF) hoặc in phiếu của đơn.'],
  ['30', 'Xem tổng quan kinh doanh', 'AD', 'F18', 'uc-06', 'SCR-A01', 'FR-ADM-08', 'Xem doanh thu, đơn cần xử lý, cảnh báo tồn kho và HSD, chuyến xe lạnh trong ngày.'],
  ['31', 'Quản lý đơn hàng', 'NV', 'F12', 'uc-05', 'SCR-A02, SCR-A03', 'FR-ADM-08', 'Xem danh sách đơn, đổi trạng thái, in phiếu xuất kho, kiểm tra đóng gói lạnh.'],
  ['32', 'Quản lý sản phẩm và giá sỉ', 'AD', 'F15', 'uc-06', 'SCR-A04, SCR-A05', 'FR-ADM-08', 'Thêm, sửa, ẩn sản phẩm; đặt giá bán và bảng giá bậc thang.'],
  ['33', 'Quản lý danh mục', 'AD', 'F15', 'uc-06', 'SCR-A06', 'FR-ADM-08', 'Thêm, sửa, ẩn danh mục sản phẩm.'],
  ['34', 'Quản lý tồn kho và lô hàng', 'NV', 'F13', 'uc-05', 'SCR-A07', 'FR-ADM-08', 'Nhập xuất kho, sửa số lượng, theo dõi lô và hạn dùng theo nguyên tắc hết hạn trước xuất trước.'],
  ['35', 'Cảnh báo hạn dùng và tồn kho thấp', 'NV', 'F13', 'uc-05', 'SCR-A01, SCR-A07', 'FR-ADM-08', 'Làm nổi lô sắp hết hạn (≤ 30 ngày, ≤ 7 ngày) và sản phẩm dưới ngưỡng tồn.'],
  ['36', 'Quản lý khách hàng, duyệt khách sỉ', 'AD', 'F16', 'uc-06', 'SCR-A08', 'đề xuất FR mới', 'Xem danh sách khách; duyệt hoặc từ chối hồ sơ doanh nghiệp mua sỉ.'],
  ['37', 'Quản lý khuyến mãi và voucher', 'AD', 'F17', 'uc-06', 'SCR-A09', 'đề xuất FR mới', 'Tạo, bật hoặc tắt voucher giảm cố định, giảm phần trăm, giảm phí vận chuyển.'],
  ['38', 'Giám sát vận chuyển và chuỗi lạnh', 'NV', 'F14', 'uc-05', 'SCR-A10', 'BR-RULE-01, đề xuất FR mới', 'Theo dõi chuyến xe lạnh, nhiệt độ thùng và cảnh báo khi vượt 8°C.'],
  ['39', 'Xem báo cáo', 'AD', 'F18', 'uc-06', 'SCR-A11', 'đề xuất FR mới', 'Xem báo cáo doanh thu, sản phẩm bán chạy, cơ cấu khách; xuất CSV.'],
  ['40', 'Quản lý nhân viên và phân quyền', 'AD', 'F19', 'uc-06', 'SCR-A12', 'đề xuất FR mới', 'Mời nhân viên, gán vai trò, chỉnh ma trận quyền.'],
  ['41', 'Cấu hình hệ thống', 'AD', 'F19', 'uc-06', 'SCR-A13', 'đề xuất FR mới', 'Sửa thông tin cửa hàng, phí vận chuyển, cổng thanh toán, thông báo email.'],
];
const NAME = Object.fromEntries(UCS.map((u) => [u[0], u[1]]));

// 19 chức năng chính (mỗi chức năng = một elip ở sơ đồ tổng quan), theo thứ tự từ trên xuống:
// nhóm khách vãng lai → khách lẻ → khách sỉ → nhân viên → quản trị.
const FEATURES = [
  ['F01', 'Đăng ký tài khoản', ['01', '02']],
  ['F02', 'Đăng nhập, khôi phục mật khẩu', ['03', '04']],
  ['F03', 'Duyệt, tìm kiếm và xem sản phẩm', ['07', '08', '09', '10', '11', '12', '13']],
  ['F04', 'Xem cửa hàng và hỗ trợ', ['16', '17']],
  ['F05', 'Tra cứu đơn hàng', ['26']],
  ['F06', 'Quản lý hồ sơ và sổ địa chỉ', ['05']],
  ['F07', 'Đánh giá, yêu thích sản phẩm', ['14', '15']],
  ['F08', 'Quản lý giỏ hàng', ['18', '19', '20']],
  ['F09', 'Đặt hàng và thanh toán', ['21', '22', '23']],
  ['F10', 'Theo dõi và quản lý đơn của tôi', ['25', '27', '28', '29']],
  ['F11', 'Mua sỉ và hóa đơn VAT', ['06', '24']],
  ['F12', 'Quản lý đơn hàng', ['31']],
  ['F13', 'Quản lý kho và hạn dùng', ['34', '35']],
  ['F14', 'Giám sát vận chuyển, chuỗi lạnh', ['38']],
  ['F15', 'Quản lý sản phẩm và danh mục', ['32', '33']],
  ['F16', 'Quản lý khách hàng', ['36']],
  ['F17', 'Quản lý khuyến mãi, voucher', ['37']],
  ['F18', 'Xem tổng quan và báo cáo', ['30', '39']],
  ['F19', 'Quản lý nhân viên và cấu hình', ['40', '41']],
];

const FIG = { 'uc-00': 'Hình 1', 'uc-01': 'Hình 2', 'uc-02': 'Hình 3', 'uc-03': 'Hình 4', 'uc-04': 'Hình 5', 'uc-05': 'Hình 6', 'uc-06': 'Hình 7' };

// ═══════════════════════════ TIỆN ÍCH ═══════════════════════════
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sgn = (v) => (v < 0 ? -1 : 1);
// Cụm từ không được ngắt dòng ở giữa; dòng đầu không nên kết thúc bằng từ nối.
const KEEP = ['sản phẩm', 'đơn hàng', 'giỏ hàng', 'hóa đơn', 'mật khẩu', 'tài khoản', 'hệ thống', 'cửa hàng', 'khách hàng', 'tồn kho', 'chuỗi lạnh', 'giá sỉ', 'giảm giá', 'vận chuyển', 'phương thức',
  'nhân viên', 'danh mục', 'tổng quan', 'kinh doanh', 'trang chủ', 'bậc thang', 'hạn dùng', 'lô hàng', 'hành trình', 'theo dõi', 'giám sát', 'khuyến mãi', 'hồ sơ', 'địa chỉ', 'lịch sử', 'mua lại', 'phân quyền', 'công thức', 'yêu thích', 'đánh giá'];
const STOP = new Set(['và', 'của', 'theo', 'cho', 'trong', 'tại']);
function wrap(text, max) { // tối đa 2 dòng, ngắt cân bằng
  if (text.length <= max) return [text];
  let t = text; for (const p of KEEP) t = t.replace(new RegExp(p, 'gi'), (m) => m.replace(' ', ' '));
  const w = t.split(' '); let best = null;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(' '), b = w.slice(i).join(' ');
    const last = a.split(/[\s ]/).pop().replace(/[,.;]$/, '');
    const s = Math.max(a.length, b.length) + (STOP.has(last) ? 6 : 0);
    if (!best || s <= best.s) best = { a, b, s };
  }
  return [best.a, best.b].map((l) => l.replace(/ /g, ' '));
}
function ucLabel(codes) { // ['07','08','09','10'] → "UC-07 … UC-10"
  const n = codes.map(Number), out = []; let i = 0;
  while (i < n.length) { let j = i; while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++; const f = (v) => 'UC-' + String(v).padStart(2, '0'); out.push(j - i >= 2 ? `${f(n[i])} … ${f(n[j])}` : n.slice(i, j + 1).map(f).join(', ')); i = j + 1; }
  return out.join(', ');
}

// Nút (node)
const P = (id, x, y) => ({ id, type: 'person', x, y, lines: ACTORS[id].name, role: ACTORS[id].role });
const S = (id, x, y) => ({ id, type: 'system', x, y, lines: SYSTEMS[id] });
const U = (code, x, y) => ({ id: 'UC' + code, type: 'uc', x, y, rx: 118, ry: 34, lines: [{ t: 'UC-' + code, k: 'id' }, ...wrap(NAME[code], 24).map((t) => ({ t, k: 'name' }))] });
const F = (key, x, y) => { const f = FEATURES.find((v) => v[0] === key); return { id: key, type: 'uc', x, y, rx: 176, ry: 27, big: true, lines: [{ t: f[1], k: 'name' }, { t: ucLabel(f[2]), k: 'id' }] }; };

// ═══════════════════════════ SƠ ĐỒ ═══════════════════════════
const DIAGRAMS = [];

// ── Hình 1 · Tổng quan ──
{
  const X = 500, Y0 = 108, PITCH = 64, row = (i) => Y0 + i * PITCH;
  const nodes = FEATURES.map((f, i) => F(f[0], X, row(i)));
  nodes.push(P('KV', 895, row(2)), P('KL', 895, row(7)), P('KS', 895, row(10)), P('NV', 105, row(12)), P('AD', 105, row(16)));
  const bottom = row(18) + 27 + 34;
  DIAGRAMS.push({
    file: 'uc-00-tong-quan', tab: SYSTEM_NAME, title: `Sơ đồ use case tổng quan — ${SYSTEM_NAME} (Topic 1)`,
    w: 1000, h: bottom + 62, box: { x: 290, y: 44, w: 420, h: bottom - 44 }, nodes,
    links: [
      ...['F01', 'F02', 'F03', 'F04', 'F05'].map((f) => ['KV', f]),
      ...['F06', 'F07', 'F08', 'F09', 'F10'].map((f) => ['KL', f]),
      ['KS', 'F11'],
      ...['F02', 'F12', 'F13', 'F14'].map((f) => ['NV', f]),
      ...['F15', 'F16', 'F17', 'F18', 'F19'].map((f) => ['AD', f]),
      ['KL', 'KV', 'general'], ['KS', 'KL', 'general'], ['AD', 'NV', 'general'],
    ],
  });
}

// ── Hình 2 · Tài khoản và xác thực ──
DIAGRAMS.push({
  file: 'uc-01-tai-khoan', tab: 'Tài khoản và xác thực', title: 'Sơ đồ use case phân rã — Tài khoản và xác thực',
  w: 1180, h: 840, box: { x: 270, y: 44, w: 640, h: 626 },
  nodes: [P('KV', 110, 250), P('KL', 110, 490), P('KS', 110, 700),
    U('03', 430, 140), U('04', 430, 250), U('01', 430, 360), U('05', 430, 490), U('06', 430, 600),
    U('02', 760, 360), S('MAIL', 1060, 305)],
  links: [['KV', 'UC03'], ['KV', 'UC04'], ['KV', 'UC01'], ['KL', 'UC05'], ['KS', 'UC06'],
    ['KL', 'KV', 'general'], ['KS', 'KL', 'general'],
    ['UC01', 'UC02', 'include'], ['UC02', 'MAIL'], ['UC04', 'MAIL']],
});

// ── Hình 3 · Duyệt, tìm kiếm và xem sản phẩm ──
DIAGRAMS.push({
  file: 'uc-02-duyet-tim-kiem', tab: 'Duyệt, tìm kiếm và xem sản phẩm', title: 'Sơ đồ use case phân rã — Duyệt, tìm kiếm và xem sản phẩm',
  w: 1180, h: 1060, box: { x: 270, y: 44, w: 640, h: 956 },
  nodes: [P('KV', 110, 410), P('KL', 110, 880),
    U('07', 430, 130), U('08', 430, 240), U('13', 430, 350), U('16', 430, 450), U('17', 430, 550), U('10', 430, 670), U('14', 430, 820), U('15', 430, 930),
    U('09', 760, 240), U('11', 760, 620), U('12', 760, 720)],
  links: [['KV', 'UC07'], ['KV', 'UC08'], ['KV', 'UC13'], ['KV', 'UC16'], ['KV', 'UC17'], ['KV', 'UC10'], ['KL', 'UC14'], ['KL', 'UC15'],
    ['KL', 'KV', 'general'],
    ['UC09', 'UC08', 'extend'], ['UC10', 'UC11', 'include'], ['UC10', 'UC12', 'include'], ['UC14', 'UC10', 'extend']],
});

// ── Hình 4 · Giỏ hàng, đặt hàng và thanh toán ──
DIAGRAMS.push({
  file: 'uc-03-gio-hang-dat-hang', tab: 'Giỏ hàng, đặt hàng và thanh toán', title: 'Sơ đồ use case phân rã — Giỏ hàng, đặt hàng và thanh toán',
  w: 1180, h: 880, box: { x: 270, y: 44, w: 640, h: 746 },
  nodes: [P('KL', 110, 300), P('KS', 110, 720),
    U('19', 430, 130), U('18', 430, 250), U('21', 430, 420), U('24', 430, 720),
    U('20', 760, 300), U('22', 760, 520), U('23', 760, 650),
    S('MAIL', 1060, 420), S('PAY', 1060, 650), S('EINV', 1060, 765)],
  links: [['KL', 'UC19'], ['KL', 'UC18'], ['KL', 'UC21'], ['KS', 'UC24'], ['KS', 'KL', 'general'],
    ['UC19', 'UC18', 'extend'], ['UC21', 'UC22', 'include'], ['UC20', 'UC21', 'extend'], ['UC23', 'UC21', 'extend'], ['UC24', 'UC21', 'extend'],
    ['UC21', 'MAIL'], ['UC23', 'PAY'], ['UC24', 'EINV']],
});

// ── Hình 5 · Theo dõi đơn hàng và hậu mãi ──
DIAGRAMS.push({
  file: 'uc-04-theo-doi-don-hang', tab: 'Theo dõi đơn hàng và hậu mãi', title: 'Sơ đồ use case phân rã — Theo dõi đơn hàng và hậu mãi',
  w: 1180, h: 620, box: { x: 270, y: 44, w: 640, h: 506 },
  nodes: [P('KV', 110, 140), P('KL', 110, 420),
    U('26', 430, 140), U('25', 430, 300), U('27', 430, 480), U('28', 760, 220), U('29', 760, 380),
    S('IOT', 1060, 300)],
  links: [['KV', 'UC26'], ['KL', 'UC25'], ['KL', 'UC27'], ['KL', 'KV', 'general'],
    ['UC26', 'UC25', 'include'], ['UC28', 'UC25', 'extend'], ['UC29', 'UC25', 'extend'], ['UC25', 'IOT']],
});

// ── Hình 6 · Vận hành kho và đơn hàng ──
DIAGRAMS.push({
  file: 'uc-05-van-hanh-kho', tab: 'Vận hành kho và đơn hàng', title: 'Sơ đồ use case phân rã — Vận hành kho và đơn hàng',
  w: 1180, h: 750, box: { x: 270, y: 44, w: 640, h: 546 },
  nodes: [P('NV', 110, 330), P('AD', 110, 600),
    U('31', 430, 140), U('34', 430, 320), U('38', 430, 520), U('35', 760, 320),
    S('MAIL', 1060, 140), S('IOT', 1060, 520)],
  links: [['NV', 'UC31'], ['NV', 'UC34'], ['NV', 'UC38'], ['AD', 'NV', 'general'],
    ['UC34', 'UC35', 'include'], ['UC31', 'MAIL'], ['UC38', 'IOT']],
});

// ── Hình 7 · Quản trị cửa hàng ──
DIAGRAMS.push({
  file: 'uc-06-quan-tri', tab: 'Quản trị cửa hàng', title: 'Sơ đồ use case phân rã — Quản trị cửa hàng',
  w: 720, h: 880, box: { x: 270, y: 44, w: 320, h: 786 },
  nodes: [P('AD', 110, 445),
    U('30', 430, 130), U('39', 430, 220), U('32', 430, 310), U('33', 430, 400), U('36', 430, 490), U('37', 430, 580), U('40', 430, 670), U('41', 430, 760)],
  links: ['30', '39', '32', '33', '36', '37', '40', '41'].map((c) => ['AD', 'UC' + c]),
});

// ═══════════════════════════ HÌNH HỌC ═══════════════════════════
const ARM_X = 21, ARM_Y = -11, SYS_W = 176, SYS_H = 62;
const personLines = (n) => [...n.lines, `(${n.role})`];
const personBottom = (n) => n.y + 58 + 17 * (personLines(n).length - 1) + 5;

function side(n, o) { // điểm nối của đường kết hợp: đầu tay (actor), mép (hệ thống ngoài), đỉnh elip phía đối diện
  const s = sgn(o.x - n.x);
  if (n.type === 'person') return { x: n.x + s * ARM_X, y: n.y + ARM_Y };
  if (n.type === 'system') return { x: n.x + s * SYS_W / 2, y: n.y };
  return { x: n.x + s * n.rx, y: n.y };
}
function clip(n, o) { // điểm trên biên elip theo hướng tới tâm nút kia
  const dx = o.x - n.x, dy = o.y - n.y, t = 1 / Math.sqrt((dx / n.rx) ** 2 + (dy / n.ry) ** 2);
  return { x: n.x + dx * t, y: n.y + dy * t };
}
function route(A, B, type) {
  if (type === 'general') return [{ x: A.x, y: A.y - 49 }, { x: B.x, y: personBottom(B) + 5 }];
  if (A.type === 'uc' && B.type === 'uc') return [clip(A, B), clip(B, A)];
  return [side(A, B), side(B, A)];
}
function hit(n, px, py, pad = 4) {
  if (n.type === 'person') return Math.abs(px - n.x) < 62 && py > n.y - 52 && py < personBottom(n) + 6;
  if (n.type === 'system') return Math.abs(px - n.x) < SYS_W / 2 + pad && Math.abs(py - n.y) < SYS_H / 2 + pad;
  return ((px - n.x) / (n.rx + pad)) ** 2 + ((py - n.y) / (n.ry + pad)) ** 2 < 1;
}
function crosses(a1, a2, b1, b2) {
  const d = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return d(b1, b2, a1) * d(b1, b2, a2) < 0 && d(a1, a2, b1) * d(a1, a2, b2) < 0;
}

// ═══════════════════════════ VẼ SVG ═══════════════════════════
const C = { ink: '#1C1917', ink2: '#57534E', line: '#292524' };

function personSvg(n) {
  const { x, y } = n, s = C.line;
  const L = personLines(n);
  const text = L.map((l, i) => {
    const last = i === L.length - 1;
    return `<text x="${x}" y="${y + 58 + i * 17}" text-anchor="middle" font-size="${last ? 12.5 : 14}" font-weight="${last ? 400 : 700}" fill="${last ? C.ink2 : C.ink}">${esc(l)}</text>`;
  }).join('');
  return `<g><circle cx="${x}" cy="${y - 34}" r="11" fill="#fff" stroke="${s}" stroke-width="2"/>`
    + `<path d="M${x} ${y - 23} V${y + 10} M${x - ARM_X} ${y + ARM_Y} H${x + ARM_X} M${x} ${y + 10} L${x - 16} ${y + 38} M${x} ${y + 10} L${x + 16} ${y + 38}" fill="none" stroke="${s}" stroke-width="2" stroke-linecap="round"/>${text}</g>`;
}
function systemSvg(n) {
  const top = n.y - SYS_H / 2, L = n.lines;
  const base = top + 31 + (L.length === 1 ? 6 : 0);
  return `<g><rect x="${n.x - SYS_W / 2}" y="${top}" width="${SYS_W}" height="${SYS_H}" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>`
    + `<text x="${n.x}" y="${top + 15}" text-anchor="middle" font-size="11" font-style="italic" fill="${C.ink2}">«hệ thống ngoài»</text>`
    + L.map((l, i) => `<text x="${n.x}" y="${base + i * 15}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.ink}">${esc(l)}</text>`).join('') + '</g>';
}
function ucSvg(n) {
  const lh = (k) => (k === 'id' ? (n.big ? 15 : 14) : n.big ? 19 : 16), fs = (k) => (k === 'id' ? 11 : n.big ? 14.5 : 13.5);
  const total = n.lines.reduce((s, l) => s + lh(l.k), 0);
  let top = n.y - total / 2;
  const t = n.lines.map((l) => { const y = top + lh(l.k) * 0.76; top += lh(l.k); return `<text x="${n.x}" y="${y.toFixed(1)}" text-anchor="middle" font-size="${fs(l.k)}" font-weight="${l.k === 'id' ? 700 : 500}" fill="${l.k === 'id' ? C.ink2 : C.ink}">${esc(l.t)}</text>`; }).join('');
  return `<g><ellipse cx="${n.x}" cy="${n.y}" rx="${n.rx}" ry="${n.ry}" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>${t}</g>`;
}

function build(d) {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const warn = [], segs = [], parts = [], used = new Set();
  for (const [a, b, type = 'assoc'] of d.links) {
    const A = byId.get(a), B = byId.get(b);
    if (!A || !B) { warn.push(`link ${a}→${b}: thiếu nút`); continue; }
    used.add(type);
    const [p1, p2] = route(A, B, type);
    segs.push({ a, b, p1, p2, type });
    const dash = type === 'include' || type === 'extend' ? ' stroke-dasharray="7 5"' : '';
    const mk = type === 'include' || type === 'extend' ? ' marker-end="url(#open)"' : type === 'general' ? ' marker-end="url(#tri)"' : '';
    parts.push(`<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${C.line}" stroke-width="1.4"${dash}${mk}/>`);
    if (type === 'include' || type === 'extend') { // nhãn nằm sát một bên đường nối, không đè lên nét đứt
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2, dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy) || 1;
      const txt = `«${type}»`, hw = txt.length * 3.3, hh = 7;
      let cx = mx + 9, cy = my, anchor = 'start';
      if (Math.abs(dx) >= 24) { // đường không thẳng đứng: đặt nhãn phía trên theo pháp tuyến
        let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
        const off = hw * Math.abs(nx) + hh * Math.abs(ny) + 5; cx = mx + nx * off; cy = my + ny * off; anchor = 'middle';
      }
      parts.push(`<text x="${cx.toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-style="italic" fill="${C.ink2}" stroke="#fff" stroke-width="4" paint-order="stroke">${txt}</text>`);
    }
    for (let i = 1; i < 80; i++) { // đường nối không được xuyên qua nút khác
      const t = i / 80, px = p1.x + (p2.x - p1.x) * t, py = p1.y + (p2.y - p1.y) * t;
      const h = d.nodes.find((n) => n.id !== a && n.id !== b && hit(n, px, py));
      if (h) { warn.push(`đường ${a}→${b} (${type}) xuyên qua ${h.id}`); break; }
    }
  }
  let cross = 0;
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const s = segs[i], t = segs[j];
    if (s.a === t.a || s.a === t.b || s.b === t.a || s.b === t.b) continue;
    if (crosses(s.p1, s.p2, t.p1, t.p2)) cross++;
  }
  const bd = d.box, tw = Math.max(150, d.tab.length * 7.6 + 30);
  const tab = `<rect x="${bd.x + bd.w - tw}" y="${bd.y - 27}" width="${tw}" height="27" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>`
    + `<text x="${bd.x + bd.w - tw / 2}" y="${bd.y - 9}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.ink}">${esc(d.tab)}</text>`;
  const frame = `<rect x="${bd.x}" y="${bd.y}" width="${bd.w}" height="${bd.h}" fill="#fff" stroke="${C.line}" stroke-width="1.8"/>`;
  // chú giải: chỉ các ký hiệu có dùng
  let lx = 24; const ly = d.h - 24, leg = [];
  const item = (w, svg, label) => { leg.push(`<g transform="translate(${lx},${ly})">${svg}<text x="${w + 8}" y="4" font-size="12" fill="${C.ink2}">${label}</text></g>`); lx += w + 8 + label.length * 6.4 + 28; };
  item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4"/>`, 'Kết hợp');
  if (used.has('include') || used.has('extend')) item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4" stroke-dasharray="7 5" marker-end="url(#open)"/>`, '«include» / «extend»');
  if (used.has('general')) item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4" marker-end="url(#tri)"/>`, 'Kế thừa (actor con → actor cha)');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
<title>${esc(d.title)}</title>
<defs>
  <marker id="open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto"><path d="M1 1 L11 6 L1 11" fill="none" stroke="${C.line}" stroke-width="1.5"/></marker>
  <marker id="tri" viewBox="0 0 16 14" refX="15" refY="7" markerWidth="15" markerHeight="13" orient="auto"><path d="M1 1 L15 7 L1 13 Z" fill="#fff" stroke="${C.line}" stroke-width="1.5"/></marker>
</defs>
<rect width="100%" height="100%" fill="#FFFFFF"/>
${tab}
${frame}
${parts.join('\n')}
${d.nodes.map((n) => (n.type === 'person' ? personSvg(n) : n.type === 'system' ? systemSvg(n) : ucSvg(n))).join('\n')}
${leg.join('\n')}
</svg>
`;
  return { svg, warn, cross };
}

// ═══════════════════════════ BẢNG MARKDOWN ═══════════════════════════
// --md         in hai bảng (chức năng tổng quan, danh mục 41 use case) ra màn hình
// --write-doc  ghi hai bảng vào 05_use_case_diagram.md, giữa các cặp dấu <!-- uc:… --> (tài liệu không bao giờ lệch với sơ đồ)
function tables() {
  const an = (codes) => codes.split(', ').map((c) => ACTORS[c].name.join(' ')).join(', ');
  const feat = ['| Chức năng tổng quan | Use case chi tiết | Tác nhân | Sơ đồ phân rã |', '|---|---|---|---|'];
  for (const [key, name, codes] of FEATURES) {
    const acts = [...new Set(codes.flatMap((c) => UCS.find((u) => u[0] === c)[2].split(', ')))];
    const dgs = [...new Set(codes.map((c) => FIG[UCS.find((u) => u[0] === c)[4]]))];
    feat.push(`| ${key} · ${name} | ${ucLabel(codes)} | ${acts.map(an).join(', ')} | ${dgs.join(', ')} |`);
  }
  const cat = ['| Mã | Use case | Tác nhân | Mô tả ngắn | Màn hình | Yêu cầu |', '|---|---|---|---|---|---|'];
  for (const [id, name, act, , , scr, req, desc] of UCS) cat.push(`| UC-${id} | ${name} | ${an(act)} | ${desc} | ${scr} | ${req} |`);
  return { features: feat.join('\n'), catalogue: cat.join('\n') };
}
if (process.argv.includes('--md')) { const t = tables(); console.log(t.features + '\n\n' + t.catalogue); process.exit(0); }
if (process.argv.includes('--write-doc')) {
  const file = path.join(dir, '..', '05_use_case_diagram.md');
  let md = fs.readFileSync(file, 'utf8'); const t = tables();
  for (const key of ['features', 'catalogue']) {
    const re = new RegExp(`(<!-- uc:${key}:start -->)[\\s\\S]*?(<!-- uc:${key}:end -->)`);
    if (!re.test(md)) { console.error(`Thiếu cặp dấu <!-- uc:${key}:start/end --> trong ${path.basename(file)}`); process.exit(1); }
    md = md.replace(re, `$1\n${t[key]}\n$2`);
  }
  fs.writeFileSync(file, md);
  console.log(`Đã cập nhật bảng trong ${path.basename(file)} (${UCS.length} use case, ${FEATURES.length} chức năng).`);
  process.exit(0);
}

// ═══════════════════════════ CHẠY ═══════════════════════════
let bad = 0;
const covered = new Set(FEATURES.flatMap((f) => f[2]));
for (const [id] of UCS) if (!covered.has(id)) { console.log(`⚠ UC-${id} chưa thuộc chức năng tổng quan nào`); bad++; }
for (const d of DIAGRAMS) {
  const { svg, warn, cross } = build(d);
  fs.writeFileSync(path.join(dir, d.file + '.svg'), svg);
  console.log(`${warn.length ? '⚠' : '✓'} ${d.file}  (${cross} đường cắt nhau)${warn.length ? '\n    ' + warn.join('\n    ') : ''}`);
  bad += warn.length;
}

const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('• Không có Chrome: chỉ xuất SVG (đặt CHROME_PATH để xuất PNG).'); process.exit(bad ? 1 : 0); }
const tmp = fs.mkdtempSync(path.join(process.env.UC_TMPDIR || os.tmpdir(), 'uc-png-'));
const port = 9500 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${tmp}`, '--window-size=1400,1100', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page; for (let i = 0; i < 80 && !page; i++) { try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} if (!page) await sleep(250); }
if (!page) { console.log('• Không mở được Chrome: chỉ có SVG.'); chrome.kill('SIGKILL'); process.exit(bad ? 1 : 0); }
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const x = JSON.parse(m.data); if (x.id && pend.has(x.id)) { pend.get(x.id)(x); pend.delete(x.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
for (const d of DIAGRAMS) {
  await send('Emulation.setDeviceMetricsOverride', { width: d.w, height: d.h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(dir, d.file + '.svg') }); await sleep(500);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: d.w, height: d.h, scale: 2 } });
  fs.writeFileSync(path.join(dir, d.file + '.png'), Buffer.from(shot.result.data, 'base64'));
}
try { chrome.kill('SIGKILL'); fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
console.log(`PNG: ${DIAGRAMS.length} ảnh (nét x2).`);
process.exit(bad ? 1 : 0);
