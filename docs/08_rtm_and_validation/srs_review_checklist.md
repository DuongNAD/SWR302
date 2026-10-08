# ✅ CHECKLIST ĐÁNH GIÁ CHẤT LƯỢNG SRS (VERIFICATION & VALIDATION)
### 8 Đặc tính chất lượng yêu cầu phần mềm theo chuẩn IEEE 830 / ISO 29148

---

## 1. BẢNG CHECKLIST ĐÁNH GIÁ CHI TIẾT

| Tiêu chuẩn chất lượng (Quality Attribute) | Câu hỏi kiểm tra (Verification Questions) | Đạt (Pass/Fail) | Ghi chú / Điểm cần sửa |
| :--- | :--- | :---: | :--- |
| **1. Correctness (Tính đúng đắn)** | Mọi yêu cầu có phản ánh chính xác mong muốn thực tế của khách hàng và nghiệp vụ không? | [ ] Pass | |
| **2. Unambiguous (Tính không mơ hồ)** | Mỗi yêu cầu chỉ có DUY NHẤT một cách hiểu? Không chứa các từ cảm tính như "nhanh chóng", "thân thiện", "tối ưu", "dễ dùng"? | [ ] Pass | Rà soát từ mơ hồ |
| **3. Completeness (Tính đầy đủ)** | Đã mô tả đầy đủ cả luồng thành công lẫn luồng ngoại lệ/lỗi? Đầy đủ tham số đầu vào và đầu ra? | [ ] Pass | |
| **4. Consistency (Tính nhất quán)** | Các yêu cầu không mâu thuẫn lẫn nhau về mặt thuật ngữ, logic nghiệp vụ hoặc phân quyền? | [ ] Pass | |
| **5. Ranked for Importance (Độ ưu tiên)** | Mọi yêu cầu đã được phân loại mức độ quan trọng theo MoSCoW (Must, Should, Could, Won't)? | [ ] Pass | |
| **6. Verifiable / Testable (Kiểm chứng được)** | Đội ngũ QA/Tester có thể thiết kế ít nhất 1 kịch bản kiểm thử (Test Case) cụ thể để pass/fail yêu cầu này không? | [ ] Pass | |
| **7. Modifiable (Dễ sửa đổi)** | Tài liệu có mục lục rõ ràng, mã hóa ID duy nhất (FR-xx, BR-xx), không bị lặp lại nội dung ở nhiều nơi? | [ ] Pass | |
| **8. Traceable (Khả năng truy vết)** | Mỗi yêu cầu có truy ngược được về mục tiêu kinh doanh (Backward) và truy xuôi đến Use Case/Test Case (Forward)? | [ ] Pass | Xem tại RTM |

---

## 2. DANH SÁCH TỪ NGỮ CẦN TRÁNH TRONG TÀI LIỆU YÊU CẦU (AMBIGUITY DEFECTS)
- ❌ **"Thân thiện với người dùng (User-friendly)":** Thay bằng: *"Người dùng mới có thể hoàn thành tác vụ trong tối đa 3 phút mà không cần tài liệu hướng dẫn"*.
- ❌ **"Phản hồi nhanh (Fast response)":** Thay bằng: *"Thời gian phản hồi API < 1.5 giây với 95% số yêu cầu trong điều kiện tải 500 CCU"*.
- ❌ **"Độ bảo mật cao (High security)":** Thay bằng: *"Mã hóa dữ liệu đường truyền bằng TLS 1.3 và mật khẩu được băm bằng BCrypt cost factor 12"*.
- ❌ **"Hỗ trợ nhiều trình duyệt":** Thay bằng: *"Tương thích với Google Chrome từ phiên bản 110+, Safari 16+, MS Edge và Mozilla Firefox"*.
