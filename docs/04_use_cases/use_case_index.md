# 📚 DANH MỤC USE CASE (USE CASE INDEX)

> Tổng hợp danh mục Use Case theo từng phân hệ, ánh xạ với Actor và độ ưu tiên.

---

## 1. MA TRẬN PHÂN QUYỀN ACTOR VÀ USE CASE (ACTOR - USE CASE MATRIX)

| Mã UC | Tên Use Case | Primary Actor | Secondary Actor | Độ ưu tiên | File đặc tả chi tiết |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **UC-01** | Đăng ký & Đăng nhập hệ thống | Khách vãng lai, Người dùng | Mail/SMS Service | High | [UC01_Authentication.md](specs/UC01_Authentication.md) |
| **UC-02** | Tìm kiếm & Xem chi tiết dịch vụ | Khách vãng lai, Người dùng | — | High | [specs/UC02_Search.md](specs/UC02_Search.md) |
| **UC-03** | Khởi tạo lịch hẹn dịch vụ | Người dùng đã đăng ký | Provider | High | [specs/UC03_Booking.md](specs/UC03_Booking.md) |
| **UC-04** | Thanh toán đơn dịch vụ | Người dùng đã đăng ký | Payment Gateway | High | [specs/UC04_Payment.md](specs/UC04_Payment.md) |
| **UC-05** | Hủy hoặc đổi lịch hẹn | Người dùng đã đăng ký | Mail Service | Medium | [specs/UC05_Cancel_Booking.md](specs/UC05_Cancel_Booking.md) |
| **UC-06** | Quản lý ca làm việc & tiếp nhận | Nhà cung cấp (Provider) | — | High | [specs/UC06_Manage_Schedule.md](specs/UC06_Manage_Schedule.md) |
| **UC-07** | Đánh giá & Phản hồi dịch vụ | Người dùng đã đăng ký | — | Low | [specs/UC07_Review_Feedback.md](specs/UC07_Review_Feedback.md) |
| **UC-08** | Quản trị người dùng & Phân quyền | Quản trị viên (Admin) | — | High | [specs/UC08_Manage_Users.md](specs/UC08_Manage_Users.md) |
| **UC-09** | Quản lý danh mục & Bảng giá | Quản trị viên (Admin) | — | Medium | [specs/UC09_Manage_Catalog.md](specs/UC09_Manage_Catalog.md) |
| **UC-10** | Xem báo cáo & Thống kê doanh thu | Quản trị viên, Provider | — | Medium | [specs/UC10_View_Reports.md](specs/UC10_View_Reports.md) |

---

## 2. QUAN HỆ GIỮA CÁC USE CASE (UML RELATIONSHIPS)
- `UC-03 (Khởi tạo lịch hẹn)` **<<include>>** `UC-04 (Thanh toán đơn dịch vụ)`.
- `UC-04 (Thanh toán đơn dịch vụ)` **<<extend>>** `Áp dụng mã giảm giá` (Chỉ kích hoạt khi khách hàng chọn nhập voucher).
- `UC-01 (Đăng ký)` **<<include>>** `Xác thực mã OTP`.
