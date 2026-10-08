# ⚖️ QUY TẮC NGHIỆP VỤ HỆ THỐNG (BUSINESS RULES - BRs)

> Phân loại theo 5 loại chuẩn của Karl Wiegers: **Fact, Constraint, Action Enabler, Inference, Computation**.

---

## BẢNG TỔNG HỢP QUY TẮC NGHIỆP VỤ

| Mã BR | Tên quy tắc | Loại quy tắc (Type) | Mô tả chi tiết quy tắc nghiệp vụ | FRs / UCs thực thi |
| :---: | :--- | :---: | :--- | :--- |
| **BR-01** | Quyền đăng nhập hệ thống | **Constraint** | Chỉ những tài khoản có trạng thái `Active` và đã xác thực email/số điện thoại mới được phép đăng nhập. | `FR-AUTH-03`, `UC-01` |
| **BR-02** | Độ phức tạp của mật khẩu | **Constraint** | Mật khẩu phải có độ dài từ 8 đến 32 ký tự, bao gồm ít nhất 1 chữ cái in hoa, 1 chữ cái thường, 1 chữ số và 1 ký tự đặc biệt (@, #, $, %, !). | `FR-AUTH-01`, `UC-01` |
| **BR-03** | Khóa tài khoản tạm thời | **Action Enabler** | Nếu người dùng nhập sai mật khẩu quá 5 lần liên tiếp trong khoảng thời gian 10 phút, hệ thống tự động khóa đăng nhập 15 phút. | `FR-AUTH-04`, `UC-01` |
| **BR-04** | Giữ chỗ lịch hẹn tạm thời | **Action Enabler** | Khi khách hàng chọn khung giờ và bấm "Tiến hành thanh toán", hệ thống tạm thời giữ chỗ (lock slot) trong 10 phút. Nếu quá thời gian chưa thanh toán, slot tự động mở lại cho người khác. | `FR-BOK-02`, `UC-03` |
| **BR-05** | Chính sách hủy hẹn & hoàn tiền | **Computation** | - Hủy trước giờ hẹn > 24 giờ: Hoàn 100% tiền.<br>- Hủy trước giờ hẹn từ 12 - 24 giờ: Phí phạt 30%, hoàn 70%.<br>- Hủy trước giờ hẹn < 12 giờ hoặc vắng mặt: Phí phạt 100%, không hoàn tiền. | `FR-BOK-04`, `UC-04` |
| **BR-06** | Định nghĩa khách hàng VIP | **Inference** | Khách hàng có tổng chi tiêu trong năm dương lịch đạt từ 10.000.000 VNĐ trở lên được tự động xếp hạng `Thành viên VIP` và được giảm giá 5% cho mọi dịch vụ. | `FR-CUST-02`, `UC-04` |
| **BR-07** | Đơn vị tiền tệ và định dạng | **Fact** | Đơn vị tiền tệ chính thức của hệ thống là Việt Nam Đồng (VNĐ). Mọi số tiền hiển thị trên giao diện phải có dấu phân cách hàng nghìn (ví dụ: `150,000 VNĐ`). | `FR-PAY-01`, `UC-03` |
| **BR-08** | Lịch làm việc của nhà cung cấp | **Constraint** | Mỗi nhà cung cấp dịch vụ không được phép mở quá 12 ca hẹn trong một ngày làm việc để đảm bảo chất lượng dịch vụ. | `FR-ADM-02`, `UC-08` |
