# ⚖️ QUY TẮC NGHIỆP VỤ HỆ THỐNG (BUSINESS RULES - BRs)

> **Dự án:** Topic 1 — Hệ Thống Mua Sắm Nguyên Liệu & Thiết Bị Làm Bánh Trực Tuyến (Gia Hoa Phat Bakery Supply)  
> **Môn học:** SWR302 — Software Requirements  
> **Phân loại theo Karl Wiegers:** Fact, Constraint, Action Enabler, Inference, Computation.

---

## BẢNG TỔNG HỢP QUY TẮC NGHIỆP VỤ

| Mã BR | Tên quy tắc | Loại quy tắc (Type) | Mô tả chi tiết quy tắc nghiệp vụ | FRs / UCs thực thi |
| :---: | :--- | :---: | :--- | :--- |
| **BR-RULE-01** | Quy tắc Chuỗi Cung Ứng Lạnh (Cold Chain Rule) | **Constraint** | Nếu giỏ hàng chứa bất kỳ sản phẩm nào có điều kiện lưu trữ là "chilled" (mát) hoặc "frozen" (đông lạnh) như bơ lạt, kem whipping, men tươi: đơn hàng bắt buộc phải đóng gói thùng cách nhiệt đá gel và áp dụng phí đóng gói bảo quản lạnh. Phương thức giao hàng ưu tiên là Hỏa tốc xe lạnh 2-4h. | `FR-CART-05`, `FR-CHK-06`, `UC-08`, `UC-09` |
| **BR-RULE-02** | Quy tắc Chiết Khấu Sỉ Tự Động (Wholesale Tier Rule) | **Computation** | Khi số lượng một mặt hàng vượt qua các mốc tối thiểu quy định (Ví dụ: bơ Anchor mua từ 10 thỏi giảm 5%, từ 40 thỏi giảm 12%), hệ thống tự động hạ đơn giá theo bảng giá sỉ bậc thang ngay trong giỏ hàng mà không cần nhập mã. | `FR-PROD-03`, `FR-CART-05`, `UC-03`, `UC-07` |
| **BR-RULE-03** | Quy tắc Quản Lý Hạn Dùng FEFO (First-Expired, First-Out) | **Action Enabler** | Nhân viên kho khi gom hàng đóng gói bắt buộc phải xuất những lô hàng có hạn sử dụng gần nhất trước. Hệ thống tự động gửi cảnh báo đẩy đến Quản lý kho khi một lô bơ sữa/men còn dưới 30 ngày sử dụng. | `FR-ADM-08`, `UC-13`, `UC-14`, `UC-15` |
| **BR-RULE-04** | Quy tắc Đăng Ký Tài Khoản Khách Sỉ B2B | **Constraint** | Tài khoản khách hàng muốn kích hoạt chính sách giá sỉ đại lý/tiệm bánh phải cung cấp Tên cơ sở kinh doanh, Mã số thuế và Địa chỉ tiệm, sau đó phải được Nhân viên CSKH/Admin phê duyệt trạng thái `Approved`. | `FR-AUTH-01`, `UC-05` |
| **BR-RULE-05** | Quy tắc Bảo Mật & Xác Thực OTP | **Constraint** | Đăng ký tài khoản mới bắt buộc phải kích hoạt qua mã OTP 6 chữ số có hiệu lực trong 5 phút. Khóa tạm thời 15 phút nếu người dùng nhập sai mật khẩu 5 lần liên tiếp. | `FR-AUTH-01`, `UC-05`, `UC-06` |
| **BR-RULE-06** | Quy tắc Combo Nguyên Liệu Theo Món (Recipe Kit Rule) | **Inference** | Một bộ Recipe Kit (Ví dụ: Kit làm bánh Tiramisu chuẩn Ý) chỉ có trạng thái `In Stock` (Còn hàng) khi tất cả các nguyên liệu thành phần (Mascarpone, bánh sâm banh, bột cacao, cà phê espresso) đều còn hàng trong kho. | `FR-KIT-04`, `UC-04`, `UC-17` |
| **BR-RULE-07** | Đơn vị tiền tệ và định dạng | **Fact** | Đơn vị tiền tệ chính thức của hệ thống là Việt Nam Đồng (VNĐ). Mọi số tiền hiển thị trên giao diện phải có dấu phân cách hàng nghìn (ví dụ: `150,000 VNĐ`). | Toàn hệ thống |
