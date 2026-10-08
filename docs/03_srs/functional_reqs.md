# 📋 DANH SÁCH YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FRs)

> **Tiêu chuẩn viết:** Mỗi yêu cầu chức năng phải được đánh mã định danh duy nhất (Unique ID), có mức độ ưu tiên theo MoSCoW, mô tả rõ hành vi hệ thống bằng từ ngữ chuẩn xác (**PHẢI - SHALL**).

---

## 1. PHÂN HỆ QUẢN LÝ TÀI KHOẢN & XÁC THỰC (AUTHENTICATION & USER MANAGEMENT)

| Mã FR | Tên chức năng | Mô tả yêu cầu (System SHALL...) | Ưu tiên | Actor | Traceability (UC/BR) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **FR-AUTH-01** | Đăng ký tài khoản | Hệ thống **phải** cho phép người dùng đăng ký tài khoản bằng email/số điện thoại và mật khẩu thỏa mãn chính sách bảo mật [BR-02]. | Must | Guest | `UC-01`, `BR-02` |
| **FR-AUTH-02** | Xác thực OTP | Hệ thống **phải** gửi mã OTP 6 chữ số có hiệu lực trong vòng 5 phút qua email/SMS để hoàn tất kích hoạt tài khoản. | Must | Guest | `UC-01` |
| **FR-AUTH-03** | Đăng nhập hệ thống | Hệ thống **phải** xác thực thông tin đăng nhập và cấp Access Token (JWT) có thời hạn 60 phút nếu thông tin chính xác. | Must | User/Staff | `UC-01`, `BR-01` |
| **FR-AUTH-04** | Khóa tài khoản đăng nhập sai | Hệ thống **phải** tự động tạm khóa đăng nhập trong vòng 15 phút nếu người dùng nhập sai mật khẩu 5 lần liên tiếp. | Must | System | `UC-01`, `BR-03` |
| **FR-AUTH-05** | Quên / Đặt lại mật khẩu | Hệ thống **phải** cho phép người dùng yêu cầu liên kết đặt lại mật khẩu qua email đăng ký với thời hạn hiệu lực 15 phút. | Should | User | `UC-01` |
| **FR-AUTH-06** | Quản lý hồ sơ cá nhân | Hệ thống **phải** cho phép người dùng cập nhật họ tên, ảnh đại diện, số điện thoại và địa chỉ liên lạc. | Should | User | `UC-02` |

---

## 2. PHÂN HỆ TÌM KIẾM & XEM THÔNG TIN DỊCH VỤ (SEARCH & BROWSING)

| Mã FR | Tên chức năng | Mô tả yêu cầu (System SHALL...) | Ưu tiên | Actor | Traceability (UC/BR) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **FR-SRC-01** | Tìm kiếm theo từ khóa | Hệ thống **phải** hỗ trợ tìm kiếm theo tên dịch vụ, tên nhà cung cấp, hoặc từ khóa liên quan với độ trễ phản hồi < 1 giây. | Must | All Users | `UC-02` |
| **FR-SRC-02** | Bộ lọc nâng cao | Hệ thống **phải** cho phép lọc danh sách dịch vụ theo khoảng giá, chuyên khoa/danh mục, khoảng cách địa lý và đánh giá sao. | Should | All Users | `UC-02` |
| **FR-SRC-03** | Xem chi tiết dịch vụ | Hệ thống **phải** hiển thị đầy đủ mô tả dịch vụ, hồ sơ chuyên gia, bảng giá chi tiết, các khung giờ còn trống và đánh giá từ khách hàng. | Must | All Users | `UC-02` |

---

## 3. PHÂN HỆ ĐẶT DỊCH VỤ & QUẢN LÝ LỊCH HẸN (BOOKING & RESERVATION)

| Mã FR | Tên chức năng | Mô tả yêu cầu (System SHALL...) | Ưu tiên | Actor | Traceability (UC/BR) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **FR-BOK-01** | Khởi tạo lịch hẹn | Hệ thống **phải** cho phép người dùng chọn dịch vụ, chọn chuyên gia và chọn khung giờ còn trống để tạo yêu cầu đặt lịch. | Must | Customer | `UC-03` |
| **FR-BOK-02** | Giữ chỗ tạm thời | Hệ thống **phải** khóa tạm thời khung giờ đã chọn trong vòng 10 phút để người dùng hoàn tất thanh toán (tránh double-booking). | Must | System | `UC-03` |
| **FR-BOK-03** | Xác nhận đặt lịch | Hệ thống **phải** cập nhật trạng thái lịch hẹn thành "Đã xác nhận", sinh mã Booking ID duy nhất và gửi email thông báo sau khi thanh toán thành công. | Must | System | `UC-03` |
| **FR-BOK-04** | Hủy lịch hẹn | Hệ thống **phải** cho phép khách hàng hủy lịch hẹn theo quy tắc hoàn/phạt [BR-05]. | Should | Customer | `UC-04`, `BR-05` |
| **FR-BOK-05** | Nhắc nhở tự động | Hệ thống **phải** tự động gửi thông báo đẩy (push notification) hoặc SMS nhắc lịch trước giờ hẹn 24 giờ và 2 giờ. | Should | System | `UC-05` |

---

## 4. PHÂN HỆ THANH TOÁN (PAYMENT MODULE)

| Mã FR | Tên chức năng | Mô tả yêu cầu (System SHALL...) | Ưu tiên | Actor | Traceability (UC/BR) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **FR-PAY-01** | Tích hợp cổng thanh toán | Hệ thống **phải** tích hợp với cổng thanh toán (VNPay / MoMo) để hỗ trợ thanh toán qua mã QR, thẻ ATM nội địa và thẻ quốc tế. | Must | Customer | `UC-04` |
| **FR-PAY-02** | Áp dụng mã giảm giá | Hệ thống **phải** xác thực và trừ tiền giảm giá nếu mã voucher còn hiệu lực và thỏa mãn điều kiện đơn hàng. | Should | Customer | `UC-04` |
| **FR-PAY-03** | Xuất biên lai / hóa đơn | Hệ thống **phải** tự động tạo và lưu trữ hóa đơn điện tử (PDF) có thể tải về ngay sau khi giao dịch hoàn tất. | Should | Customer/Admin| `UC-04` |

---

## 5. PHÂN HỆ QUẢN TRỊ & BÁO CÁO (ADMIN & DASHBOARD)

| Mã FR | Tên chức năng | Mô tả yêu cầu (System SHALL...) | Ưu tiên | Actor | Traceability (UC/BR) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **FR-ADM-01** | Quản lý người dùng | Quản trị viên **phải** có quyền kích hoạt, tạm khóa, hoặc phân quyền vai trò cho bất kỳ tài khoản nào trong hệ thống. | Must | Admin | `UC-07` |
| **FR-ADM-02** | Quản lý danh mục dịch vụ | Quản trị viên **phải** có quyền thêm mới, chỉnh sửa, ẩn/hiện các danh mục dịch vụ và bảng giá niêm yết. | Must | Admin | `UC-08` |
| **FR-ADM-03** | Báo cáo thống kê | Hệ thống **phải** cung cấp dashboard biểu đồ thể hiện doanh thu, số lượng đơn, tỷ lệ hủy đơn theo ngày/tuần/tháng. | Should | Admin/Provider| `UC-09` |
