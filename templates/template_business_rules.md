# ⚖️ PHÂN LOẠI QUY TẮC NGHIỆP VỤ (BUSINESS RULES)
### Theo giáo trình Karl E. Wiegers — Software Requirements (3rd Edition)

> **Khái niệm:** Quy tắc nghiệp vụ (Business Rule) là một tuyên bố chính sách, hướng dẫn hoặc nguyên tắc định hướng hoặc giới hạn các khía cạnh của hoạt động doanh nghiệp. Quy tắc nghiệp vụ tồn tại độc lập với phần mềm, phần mềm chỉ có nhiệm vụ thực thi (enforce) chúng.

---

## 1. PHÂN LOẠI THEO 5 NHÓM CỦA KARL WIEGERS

1. **Facts (Sự thật hiển nhiên):** Các khẳng định bất biến về cấu trúc dữ liệu hoặc mối quan hệ giữa các thực thể nghiệp vụ.
2. **Constraints (Ràng buộc):** Các hạn chế áp đặt lên hành vi hoặc dữ liệu của hệ thống/người dùng (thường chứa từ *phải*, *không được*).
3. **Action Enablers (Kích hoạt hành động):** Nếu một điều kiện thỏa mãn thì một hành động cụ thể sẽ được tự động kích hoạt (*If [Condition] Then [Action]*).
4. **Inferences (Suy luận / Diễn giải logic):** Tạo ra một thông tin/sự kiện mới dựa trên một tập dữ liệu hoặc điều kiện đã biết (*If [Condition] Then [New Fact]*).
5. **Computations (Thuật toán tính toán):** Các công thức toán học hoặc quy tắc tính toán tài chính, thuế, phí, chiết khấu.

---

## 2. BẢNG QUY TẮC NGHIỆP VỤ MẪU

| Mã BR | Tên quy tắc nghiệp vụ | Phân loại (Type) | Mô tả chi tiết quy tắc nghiệp vụ | Use Case / FR liên quan |
| :---: | :--- | :---: | :--- | :---: |
| **BR-01** | Quyền đăng nhập hệ thống | **Constraint** | Chỉ người dùng có trạng thái tài khoản `Active` mới được phép đăng nhập vào hệ thống. | `UC-01`, `FR-AUTH-03` |
| **BR-02** | Độ mạnh của mật khẩu | **Constraint** | Mật khẩu phải có độ dài tối thiểu 8 ký tự, bao gồm ít nhất: 1 chữ in hoa, 1 chữ in thường, 1 chữ số và 1 ký tự đặc biệt. | `UC-01`, `FR-AUTH-01` |
| **BR-03** | Khóa tài khoản đăng nhập sai | **Action Enabler** | Nếu người dùng nhập sai mật khẩu 5 lần liên tiếp trong vòng 10 phút, thì hệ thống tự động khóa tài khoản trong 15 phút và gửi email cảnh báo. | `UC-01`, `FR-AUTH-04` |
| **BR-04** | Phân hạng khách hàng VIP | **Inference** | Nếu tổng chi tiêu của khách hàng trong năm dương lịch đạt từ 20.000.000 VNĐ trở lên, khách hàng được nâng hạng thành `VIP Member`. | `UC-03`, `FR-CUST-02` |
| **BR-05** | Tính phí phạt hủy lịch | **Computation** | Phí hủy lịch = `Giá trị đơn dịch vụ * 30%` nếu hủy trước giờ hẹn từ 12 đến 24 giờ; = `100%` nếu hủy dưới 12 giờ trước giờ hẹn. | `UC-04`, `FR-BOOK-05` |
| **BR-06** | Mối quan hệ giữa Bác sĩ và Khoa | **Fact** | Mỗi bác sĩ chỉ được trực thuộc duy nhất một Chuyên khoa chính tại một thời điểm. | `UC-06`, `FR-DOC-01` |

---

## 3. CHECKLIST KIỂM ĐỊNH QUY TẮC NGHIỆP VỤ
- [ ] Quy tắc có viết độc lập với giao diện người dùng không? (Không nhắc tới *nút bấm*, *màn hình*, *pop-up*).
- [ ] Công thức tính toán có rõ ràng các biến và đơn vị tính không?
- [ ] Các trường hợp ngoại lệ của quy tắc đã được bao quát chưa?
