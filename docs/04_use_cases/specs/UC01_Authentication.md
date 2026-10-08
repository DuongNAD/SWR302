# 📑 USE CASE SPECIFICATION: UC-01
## ĐĂNG KÝ VÀ ĐĂNG NHẬP HỆ THỐNG (AUTHENTICATION)

---

## 1. THÔNG TIN CƠ BẢN
- **Use Case ID:** `UC-01`
- **Use Case Name:** Đăng ký và Đăng nhập hệ thống
- **Primary Actor:** Khách vãng lai (Guest) / Người dùng đã đăng ký (Registered User)
- **Secondary Actor:** Hệ thống gửi Email / SMS OTP
- **Scope:** Hệ thống phần mềm [Tên Hệ Thống]
- **Level:** User Goal
- **Priority:** High (Must-have)

---

## 2. TIỀN ĐIỀU KIỆN & HẬU ĐIỀU KIỆN (PRE & POST-CONDITIONS)
- **Preconditions:**
  - Người dùng có thiết bị kết nối mạng Internet ổn định và truy cập vào giao diện hệ thống.
- **Postconditions (Success Guarantee):**
  - Người dùng được xác thực danh tính thành công.
  - Hệ thống sinh phiên đăng nhập (JWT token), điều hướng người dùng tới Dashboard tương ứng với vai trò.

---

## 3. MAIN SUCCESS SCENARIO (LUỒNG CHÍNH - ĐĂNG NHẬP)

| Bước | Hành động của Actor | Phản hồi của Hệ thống |
| :---: | :--- | :--- |
| **1** | Người dùng mở trang đăng nhập và nhập Email/Số điện thoại cùng Mật khẩu. | Hệ thống kiểm tra cú pháp định dạng cơ bản của dữ liệu đầu vào. |
| **2** | Người dùng bấm nút "Đăng nhập". | Hệ thống kiểm tra sự tồn tại của tài khoản, trạng thái tài khoản [BR-01], và so khớp mật khẩu mã hóa. |
| **3** | | Hệ thống xác thực thành công, ghi nhận lịch sử đăng nhập vào Audit Log, reset bộ đếm lần đăng nhập sai về 0. |
| **4** | | Hệ thống cấp Access Token và điều hướng người dùng về trang chủ/bảng điều khiển với giao diện tương ứng theo vai trò. |

---

## 4. EXTENSIONS / ALTERNATIVE FLOWS (LUỒNG RẼ NHÁNH VÀ NGOẠI LỆ)

- **1a. Người dùng để trống trường bắt buộc hoặc sai định dạng email:**
  - 1a1. Hệ thống báo lỗi đỏ: *"Vui lòng nhập đúng định dạng email"*.
  - 1a2. Người dùng sửa lại và bấm Đăng nhập.

- **2a. Sai mật khẩu:**
  - 2a1. Hệ thống tăng bộ đếm đăng nhập sai thêm 1.
  - 2a2. Hệ thống hiển thị: *"Email hoặc mật khẩu không chính xác. Bạn còn X lần thử"*.
  - 2a3. Nếu sai quá 5 lần liên tiếp trong 10 phút, hệ thống kích hoạt [BR-03]: khóa tài khoản 15 phút và gửi email cảnh báo bảo mật.

- **2b. Tài khoản đang ở trạng thái Bị khóa (Inactive/Suspended):**
  - 2b1. Hệ thống từ chối đăng nhập và thông báo: *"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên qua support@system.vn"*.
