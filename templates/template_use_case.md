# 📌 USE CASE SPECIFICATION (ĐẶC TẢ USE CASE CHI TIẾT)
### Theo chuẩn Alistair Cockburn (Fully Dressed Format)

---

## 1. THÔNG TIN CƠ BẢN
- **Use Case ID:** `UC-[Mã số, ví dụ: UC-01]`
- **Use Case Name:** `[Tên Use Case, định dạng Động từ + Danh từ, ví dụ: Đặt lịch hẹn khám bệnh]`
- **Module:** `[Tên phân hệ, ví dụ: Quản lý Đặt lịch]`
- **Primary Actor:** `[Tác nhân chính, ví dụ: Khách hàng / Bệnh nhân]`
- **Secondary Actors:** `[Tác nhân phụ, ví dụ: Cổng thanh toán, Hệ thống SMS]`
- **Level:** User-goal level (Mục tiêu người dùng)
- **Priority:** High / Medium / Low
- **Status:** Approved / Draft / In Progress

---

## 2. TIỀN ĐIỀU KIỆN & HẬU ĐIỀU KIỆN (PRE & POST-CONDITIONS)

### 2.1 Preconditions (Tiền điều kiện)
- Người dùng đã đăng nhập thành công vào hệ thống với vai trò hợp lệ.
- Tài khoản của người dùng không bị khóa hoặc tạm ngưng hoạt động.

### 2.2 Postconditions (Hậu điều kiện)
- **Minimal Guarantees (Đảm bảo tối thiểu):** Nếu giao dịch thất bại, trạng thái hệ thống và số dư tài khoản của người dùng được giữ nguyên vẹn không bị trừ tiền oan.
- **Success Guarantees (Đảm bảo thành công):** 
  - Yêu cầu được lưu vào cơ sở dữ liệu với trạng thái "Đã xác nhận".
  - Một email xác nhận kèm mã đặt lịch được gửi đến người dùng.
  - Lịch của nhà cung cấp dịch vụ được cập nhật bận tại khung giờ đó.

---

## 3. TRIGGER (SỰ KIỆN KÍCH HOẠT)
- Người dùng nhấn vào nút `[Ví dụ: "Xác nhận Đặt lịch"]` tại màn hình chi tiết dịch vụ.

---

## 4. MAIN SUCCESS SCENARIO (LUỒNG SỰ KIỆN CHÍNH / LUỒNG CƠ BẢN)

| Bước | Hành động của Tác nhân (Actor Action) | Phản hồi của Hệ thống (System Response) |
| :---: | :--- | :--- |
| **1** | Người dùng lựa chọn dịch vụ và chọn khung thời gian mong muốn. | Hệ thống kiểm tra tính khả dụng của khung giờ và hiển thị bảng biểu phí dự kiến. |
| **2** | Người dùng nhập thông tin liên hệ và ghi chú đặc biệt (nếu có). | Hệ thống xác thực tính hợp lệ của dữ liệu đầu vào. |
| **3** | Người dùng chọn phương thức thanh toán và nhấn nút "Tiến hành thanh toán". | Hệ thống tạo mã giao dịch tạm thời và chuyển hướng sang cổng thanh toán đối tác. |
| **4** | Người dùng hoàn tất xác thực thanh toán tại cổng thanh toán. | Hệ thống nhận thông báo thanh toán thành công (Webhook), cập nhật trạng thái đơn thành "Đã thanh toán". |
| **5** | | Hệ thống hiển thị màn hình thông báo "Đặt lịch thành công" kèm mã xác nhận (Booking ID) và gửi email/SMS thông báo. |

---

## 5. EXTENSIONS / ALTERNATIVE FLOWS (LUỒNG RẼ NHÁNH VÀ NGOẠI LỆ)

- **1a. Khung giờ đã bị người khác chọn trong lúc thao tác:**
  - 1a1. Hệ thống hiển thị cảnh báo: *"Khung giờ vừa chọn đã kín, vui lòng chọn khung giờ khác"*.
  - 1a2. Hệ thống tải lại danh sách các khung giờ còn trống gần nhất.
  - 1a3. Quay lại Bước 1 của Luồng chính.

- **2a. Người dùng nhập sai định dạng số điện thoại hoặc để trống trường bắt buộc:**
  - 2a1. Hệ thống làm nổi bật (highlight) trường bị lỗi và hiển thị thông báo lỗi tương ứng.
  - 2a2. Người dùng sửa lại thông tin và bấm tiếp tục.

- **4a. Giao dịch thanh toán bị từ chối hoặc quá thời gian chờ (Timeout):**
  - 4a1. Hệ thống nhận mã lỗi từ cổng thanh toán.
  - 4a2. Hệ thống hiển thị thông báo lỗi: *"Thanh toán không thành công. Thẻ/Ví của bạn chưa bị trừ tiền"*.
  - 4a3. Hệ thống cho phép người dùng chọn lại phương thức thanh toán khác hoặc thử lại (trong vòng 10 phút trước khi hủy giữ chỗ).

---

## 6. SPECIAL REQUIREMENTS (YÊU CẦU ĐẶC BIỆT / PHI CHỨC NĂNG)
- Thời gian xác thực thông tin và phản hồi kết quả không quá 2 giây.
- Luồng thanh toán phải tuân thủ tiêu chuẩn bảo mật thanh toán PCI-DSS.

---

## 7. BUSINESS RULES LIÊN QUAN
- Áp dụng quy tắc `[BR-01]`, `[BR-03]`.
