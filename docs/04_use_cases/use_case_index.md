# 📚 DANH MỤC USE CASE HỆ THỐNG (USE CASE INDEX)

> **Dự án:** Topic 1 — Hệ Thống Mua Sắm Nguyên Liệu & Thiết Bị Làm Bánh Trực Tuyến (Gia Hoa Phat Bakery Supply)  
> **Môn học:** SWR302 — Software Requirements  
> **Phiên bản:** 2.0 (Đồng bộ chuẩn IEEE Std 830 & Client SPA)

---

## 1. MA TRẬN PHÂN QUYỀN ACTOR VÀ USE CASE (ACTOR - USE CASE MATRIX)

| Mã UC | Tên Use Case | Primary Actor | Secondary Actor | Độ ưu tiên | Phân hệ (Module) | Traceability (FRs / BRs) |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **UC-01** | Tìm kiếm nguyên liệu & Gợi ý từ khóa | Khách vãng lai, Khách hàng | — | Must | Khám phá & Tra cứu | `FR-SRC-01` |
| **UC-02** | Lọc theo chuỗi cung ứng lạnh & thương hiệu | Khách vãng lai, Khách hàng | — | Must | Khám phá & Tra cứu | `FR-FIL-02`, `BR-RULE-01` |
| **UC-03** | Xem chi tiết, HSD theo lô & Bảng giá sỉ | Khách vãng lai, Khách sỉ | — | Must | Sản phẩm & Giá sỉ | `FR-PROD-03`, `BR-RULE-02` |
| **UC-04** | Khám phá & Mua combo công thức bánh (Recipe Kit) | Khách vãng lai, Khách hàng | — | Should | Combo làm bánh | `FR-KIT-04` |
| **UC-05** | Đăng ký tài khoản (Khách lẻ / Khách sỉ B2B) | Khách vãng lai | Dịch vụ gửi OTP | Must | Tài khoản & Xác thực | `FR-AUTH-01` |
| **UC-06** | Đăng nhập hệ thống & Phân quyền RBAC | Tất cả người dùng | — | Must | Tài khoản & Xác thực | `FR-AUTH-01` |
| **UC-07** | Quản lý giỏ hàng thông minh & Tự tính trọng lượng | Khách hàng, Khách sỉ | — | Must | Giỏ hàng | `FR-CART-05`, `BR-RULE-02` |
| **UC-08** | Đặt hàng & Chọn phương thức giao xe lạnh | Khách hàng, Khách sỉ | Đơn vị xe lạnh 2-4h | Must | Đặt hàng & Vận chuyển | `FR-CHK-06`, `BR-RULE-01` |
| **UC-09** | Tính phí đóng thùng xốp đá gel tự động | Hệ thống (Hỗ trợ đặt hàng) | — | Must | Chuỗi lạnh (Cold Chain) | `FR-CART-05`, `BR-RULE-01` |
| **UC-10** | Thanh toán đơn hàng trực tuyến (VNPay / MoMo) | Khách hàng, Khách sỉ | Cổng thanh toán | Must | Thanh toán | `FR-CHK-06` |
| **UC-11** | Áp dụng mã giảm giá / Voucher | Khách hàng | — | Should | Thanh toán | `FR-CHK-06` |
| **UC-12** | Theo dõi tiến trình đơn hàng xe lạnh real-time | Khách hàng, Khách vãng lai | Đơn vị xe lạnh, SMS | Must | Theo dõi đơn hàng | `FR-TRK-07` |
| **UC-13** | Quản lý tồn kho theo số lô & Kho mát/đông | Nhân viên kho | — | Must | Quản trị kho bãi | `FR-ADM-08` |
| **UC-14** | Giám sát hạn sử dụng & Cảnh báo FEFO cận date | Nhân viên kho | Hệ thống cảnh báo | Must | Quản trị kho bãi | `FR-ADM-08` |
| **UC-15** | Xử lý đóng gói chuỗi lạnh đá gel | Nhân viên kho | Đơn vị xe lạnh | Must | Vận hành kho | `FR-ADM-08`, `BR-RULE-01` |
| **UC-16** | Quản lý sản phẩm & Bảng giá sỉ bậc thang | Quản trị viên (Admin) | — | Must | Quản trị hệ thống | `FR-ADM-08`, `BR-RULE-02` |
| **UC-17** | Quản lý bộ combo nguyên liệu (Recipe Kits) | Quản trị viên (Admin) | — | Should | Quản trị hệ thống | `FR-KIT-04` |
| **UC-18** | Quản lý đơn hàng & Điều phối vận chuyển | Admin, CSKH | Đơn vị vận chuyển | Must | Xử lý đơn hàng | `FR-ADM-08` |
| **UC-19** | Quản trị người dùng & Phân quyền (RBAC) | Quản trị viên (Admin) | — | Must | Quản trị hệ thống | `FR-AUTH-01` |
| **UC-20** | Xem báo cáo doanh thu & Thống kê tồn kho | Quản trị viên (Admin) | — | Should | Báo cáo & Thống kê | `FR-ADM-08` |

---

## 2. QUAN HỆ GIỮA CÁC USE CASE (UML RELATIONSHIPS)

1. **Quan hệ Bao hàm (`<<include>>`):**
   - `UC-05 (Đăng ký)` **<<include>>** `Xác thực mã OTP điện tử`.
   - `UC-07 (Quản lý giỏ hàng)` **<<include>>** `Tự động áp dụng giá sỉ theo bậc (Wholesale Tier)`.
   - `UC-08 (Đặt hàng xe lạnh)` **<<include>>** `UC-09 (Tính phí thùng xốp đá gel)` (Bắt buộc nếu có hàng chilled/frozen).
   - `UC-08 (Đặt hàng xe lạnh)` **<<include>>** `UC-10 (Thanh toán đơn hàng)`.
   - `UC-16 (Quản lý sản phẩm)` **<<include>>** `Thiết lập bảng giá sỉ bậc thang`.

2. **Quan hệ Mở rộng (`<<extend>>`):**
   - `UC-11 (Áp dụng voucher)` **<<extend>>** `UC-10 (Thanh toán đơn hàng)` (Chỉ kích hoạt khi khách nhập mã khuyến mãi hợp lệ).
   - `Yêu cầu hóa đơn đỏ VAT Doanh nghiệp` **<<extend>>** `UC-08 (Đặt hàng)` (Kích hoạt khi khách sỉ B2B tick chọn xuất hóa đơn).
   - `UC-14 (Cảnh báo hàng cận date FEFO)` **<<extend>>** `UC-13 (Quản lý tồn kho theo số lô)` (Tự động thông báo khi lô hàng bơ sữa còn dưới 30 ngày).
   - `Đăng ký tài khoản mua sỉ B2B` **<<extend>>** `UC-05 (Đăng ký tài khoản)`.

3. **Quan hệ Kế thừa Tác nhân (Actor Generalization):**
   - `Khách Mua Sỉ B2B` —|> `Khách Mua Lẻ (Customer)` —|> `Khách Vãng Lai (Guest)`
   - `Quản Trị Viên (Admin)` —|> `Nhân Viên CSKH`
