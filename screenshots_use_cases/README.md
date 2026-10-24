# 📸 BẢNG ĐỐI CHIẾU SƠ ĐỒ USE CASE & ẢNH CHỤP GIAO DIỆN HỆ THỐNG
## Gia Hoa Phat Bakery Supply — SWR302 Software Requirements Engineering

Thư mục này chứa đầy đủ các ảnh chụp màn hình giao diện thực tế của hệ thống, được đối chiếu và ánh xạ trực tiếp theo **Sơ đồ Use Case tổng quan** và **Đặc tả Use Case chi tiết** trong tài liệu SRS (`docs/06_diagrams_models/use_case_diagram.md` & `docs/04_use_cases/use_case_index.md`).

---

## 1. Phân Hệ Người Dùng & Mua Sắm (Customer & Shopping)

| Mã Use Case | Tên Use Case | Tác Nhân (Actor) | Tên File Ảnh Giao Diện | Đường Dẫn URL | Đặc Điểm Nghiệp Vụ Chính |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **—** | **Trang chủ hệ thống** | Guest, Customer | `00_Trang_Chu_GiaHoaPhat.png` | `/#/` | Banner chuỗi lạnh, danh mục nguyên liệu, cam kết xe lạnh 2-4h, giá sỉ tiệm bánh. |
| **UC-01** | **Đăng ký tài khoản** | Khách vãng lai (Guest) | `UC01_Dang_Ky_Tai_Khoan.png` | `/#/dang-ky` | Phân luồng đăng ký Khách mua lẻ & Chủ tiệm bánh (Sỉ B2B), xác thực OTP. |
| **UC-02** | **Đăng nhập hệ thống & RBAC** | Tất cả người dùng | `UC02_Dang_Nhap_He_Thong.png` | `/#/dang-nhap` | Đăng nhập tài khoản, hỗ trợ nút demo chuyển đổi nhanh vai trò RBAC (Khách lẻ / Sỉ / Admin). |
| **UC-03** | **Tìm kiếm nguyên liệu & Gợi ý từ khóa** | Guest, Customer | `UC03_Tim_Kiem_Nguyen_Lieu.png` | `/#/tim-kiem?q=bơ` | Tìm kiếm theo tên sản phẩm, thương hiệu, hiển thị nhãn nhiệt độ bảo quản. |
| **UC-04** | **Lọc theo chuỗi lạnh & giá** | Guest, Customer | `UC04_Loc_Theo_Chuoi_Lanh_Va_Gia.png` | `/#/san-pham` | Bộ lọc điều kiện bảo quản (Mát 2-8°C, Đông ≤-18°C), mức giá, thương hiệu, HSD lô. |
| **UC-05** | **Xem chi tiết & HSD lô hàng** | Guest, Customer, Wholesale | `UC05_Chi_Tiet_San_Pham_HSD_Bang_Gia_Si.png` | `/#/san-pham/prod-01` | Hiển thị bảng giá sỉ bậc thang theo số lượng, số lô hàng sản xuất, HSD và lưu ý bảo quản xe lạnh. |
| **UC-06** | **Xem danh sách combo công thức bánh** | Guest, Customer | `UC06_Danh_Sach_Combo_Cong_Thuc.png` | `/#/combo` | Danh sách Recipe Kits (Tiramisu, Sourdough, Macaron...) gom trọn bộ nguyên liệu theo công thức chuẩn. |
| **UC-06** | **Chi tiết combo bánh & nguyên liệu** | Guest, Customer | `UC06_Chi_Tiet_Combo_Cong_Thuc.png` | `/#/combo/bundle-tiramisu` | Hướng dẫn từng bước làm bánh, danh sách nguyên liệu định lượng sẵn, 1 click thêm toàn bộ vào giỏ. |
| **UC-07** | **Quản lý giỏ hàng thông minh** | Customer, Wholesale | `UC07_Quan_Ly_Gio_Hang.png` | `/#/gio-hang` | Tự động tính tổng trọng lượng, phát hiện nguyên liệu lạnh, tính phí đóng gói đá gel & thanh tiến trình freeship. |
| **UC-08** | **Đặt hàng hỏa tốc xe lạnh** | Customer, Wholesale | `UC08_Dat_Hang_Hoa_Toc_Xe_Lanh.png` | `/#/thanh-toan` | Chọn phương thức giao xe lạnh 2-4h, phụ phí thùng xốp bảo ôn, tùy chọn xuất hóa đơn VAT điện tử. |
| **UC-09** | **Thanh toán trực tuyến & Thành công** | Customer, Wholesale | `UC09_Thanh_Toan_Dat_Hang_Thanh_Cong.png` | `/#/dat-hang/thanh-cong/GHP-889120` | Xác nhận đơn hàng thành công, hiển thị mã đơn, phương thức thanh toán VNPay/MoMo/COD. |
| **UC-10** | **Tra cứu đơn hàng** | Guest, Customer | `UC10_Tra_Cuu_Don_Hang.png` | `/#/tra-cuu-don-hang` | Tra cứu nhanh trạng thái đơn hàng bằng số điện thoại và mã đơn hàng mà không cần đăng nhập. |
| **UC-10 / UC-12** | **Theo dõi đơn hàng xe lạnh real-time** | Guest, Customer | `UC10_Theo_Doi_Don_Hang_Xe_Lanh.png` | `/#/don-hang/GHP-889120` | Giám sát nhiệt độ thùng xe lạnh real-time qua cảm biến IoT (3.2°C), tiến trình các chặng vận chuyển. |
| **B2B** | **Cổng mua sỉ cho tiệm bánh** | Khách sỉ B2B | `Bo_Sung_Trang_Mua_Si_B2B.png` | `/#/mua-si` | Chính sách chiết khấu bậc thang, cấp hạn mức công nợ, giao xe lạnh định kỳ theo ca làm bánh. |
| **Tài khoản** | **Tổng quan tài khoản khách hàng** | Khách hàng | `Bo_Sung_Quan_Ly_Tai_Khoan.png` | `/#/tai-khoan` | Quản lý sổ địa chỉ giao hàng, hạng thành viên, thông tin doanh nghiệp tiệm bánh. |
| **Tài khoản** | **Lịch sử đơn hàng cá nhân** | Khách hàng | `Bo_Sung_Lich_Su_Don_Hang_User.png` | `/#/tai-khoan/don-hang` | Danh sách các đơn đã đặt, trạng thái giao vận và nút đặt lại nhanh đơn cũ. |

---

## 2. Phân Hệ Quản Trị & Vận Hành Kho (Admin & Warehouse)

| Mã Use Case | Tên Use Case | Tác Nhân (Actor) | Tên File Ảnh Giao Diện | Đường Dẫn URL | Đặc Điểm Nghiệp Vụ Chính |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | **Bảng điều khiển tổng quan** | Quản trị viên (Admin) | `Admin_Dashboard_Tong_Quan.png` | `/#/admin` | Thống kê doanh thu theo ngày/tháng, tỷ lệ đơn chuỗi lạnh, cảnh báo nhanh lô hàng sắp hết hạn. |
| **UC-11 / UC-16** | **Quản lý sản phẩm & Bảng giá sỉ** | Admin | `UC11_Admin_Quan_Ly_San_Pham.png` | `/#/admin/san-pham` | Quản lý danh mục sản phẩm, tình trạng tồn kho, nhiệt độ bảo quản yêu cầu và phân loại giá sỉ. |
| **UC-11 / UC-16** | **Biểu mẫu tạo mới / sửa sản phẩm** | Admin | `UC11_Admin_Form_San_Pham_Gia_Si.png` | `/#/admin/san-pham/moi` | Thiết lập thông số SKU, trọng lượng, điều kiện bảo quản lạnh, cấu hình các bậc giá sỉ (Wholesale Tiers). |
| **UC-12 / UC-17** | **Quản lý danh mục & Combo** | Admin | `UC12_Admin_Quan_Ly_Danh_Muc.png` | `/#/admin/danh-muc` | Phân chia ngành hàng nguyên liệu và quản lý các combo công thức làm bánh theo chủ đề. |
| **UC-13** | **Quản lý tồn kho theo số lô** | Nhân viên kho (Warehouse) | `UC13_Admin_Quan_Ly_Ton_Kho_So_Lo.png` | `/#/admin/ton-kho` | Quản lý vị trí lưu trữ (Kho mát 2-8°C, Kho đông ≤-18°C), điều chỉnh số lượng và tạo phiếu nhập kho. |
| **UC-14** | **Giám sát HSD & Cảnh báo FEFO** | Nhân viên kho, Admin | `UC14_Admin_Giam_Sat_FEFO_Canh_Bao_HSD.png` | `/#/admin/ton-kho` | Tab FEFO: Sắp xếp ưu tiên xuất kho các lô hàng bơ sữa có HSD gần nhất, cảnh báo lô cận date. |
| **UC-15** | **Đóng gói đá gel & Điều phối xe lạnh** | Nhân viên kho, Vận hành | `UC15_Admin_Dieu_Phoi_Van_Chuyen.png` | `/#/admin/van-chuyen` | Giám sát các chuyến xe lạnh đang chạy, nhiệt độ cảm biến IoT thùng xe (2-8°C), định vị GPS lộ trình giao hàng. |
| **UC-16 / UC-18** | **Quản lý danh sách đơn hàng** | Admin, Nhân viên CSKH | `UC16_Admin_Danh_Sach_Don_Hang.png` | `/#/admin/don-hang` | Bộ lọc đơn hàng theo trạng thái, kênh khách lẻ/khách sỉ, phân loại giao xe lạnh hỏa tốc. |
| **UC-16 / UC-18** | **Chi tiết đơn hàng & Quy cách gói** | Admin, Nhân viên CSKH | `UC16_Admin_Chi_Tiet_Don_Hang.png` | `/#/admin/don-hang/ord-889120` | Kiểm tra chi tiết danh mục hàng, ghi chú đóng gói thùng xốp đá gel, thông tin xuất hóa đơn VAT tiệm bánh. |
| **UC-17 / UC-19** | **Quản trị nhân viên & RBAC** | Quản trị viên (Admin) | `UC17_Admin_Quan_Tri_Nhan_Vien_RBAC.png` | `/#/admin/nhan-vien` | Ma trận phân quyền RBAC chi tiết (Admin, Quản lý kho lạnh, Thủ kho, Kế toán, Nhân viên CSKH/B2B). |
| **UC-17 / UC-19** | **Quản lý danh sách khách hàng** | Admin, CSKH | `UC17_Admin_Danh_Sach_Khach_Hang.png` | `/#/admin/khach-hang` | Phân nhóm khách hàng cá nhân và tài khoản doanh nghiệp sỉ, kiểm soát hạn mức tín dụng và công nợ. |
| **UC-18 / UC-20** | **Báo cáo thống kê doanh thu** | Admin, Kế toán | `UC18_Admin_Bao_Cao_Thong_Ke.png` | `/#/admin/bao-cao` | Biểu đồ doanh số theo ngành hàng, tỷ trọng đơn chuỗi lạnh, tỷ lệ hư hỏng bảo quản và hiệu quả giao vận. |

---

## 3. Thông Số Kỹ Thuật Chụp Ảnh
- **Độ phân giải (Viewport):** `1440 x 900` px (Tỷ lệ máy tính xách tay tiêu chuẩn, tối ưu dàn trang hiển thị)
- **Hệ số tỷ lệ điểm ảnh (Device Scale Factor):** `1.25x` (Hiển thị văn bản tiếng Việt cực kỳ sắc nét, không vỡ nét font Be Vietnam Pro)
- **Định dạng file:** PNG 24-bit sắc nét cao
- **Trình điều khiển tự động:** Playwright Chromium (Automated Script: `scripts/capture_screenshots.py`)
