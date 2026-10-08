# 📑 VISION AND SCOPE DOCUMENT

> **Dự án:** [Tên Dự Án]  
> **Phiên bản:** 1.0  
> **Ngày cập nhật:** DD/MM/2026  
> **Tác giả:** [Tên nhóm / Tác giả]  

---

## 1. Business Requirements (Yêu cầu Kinh doanh)

### 1.1. Background (Bối cảnh)
- Mô tả bối cảnh thị trường, hoạt động hiện tại của tổ chức/khách hàng.
- Những bất cập, thách thức trong quy trình thủ công hoặc hệ thống cũ.

### 1.2. Business Opportunity (Cơ hội kinh doanh)
- Lý do tại sao cần xây dựng hệ thống này lúc này.
- Tiềm năng giải quyết vấn đề và giá trị cốt lõi mang lại.

### 1.3. Business Objectives and Success Criteria (Mục tiêu kinh doanh & Chỉ số thành công)
- **Business Objective 1 (BO-1):** [Ví dụ: Giảm 60% thời gian chờ đợi đặt lịch trong vòng 3 tháng đầu triển khai].
- **Business Objective 2 (BO-2):** [Ví dụ: Tăng số lượng giao dịch thành công lên 40% sau 6 tháng].
- **Success Metric 1 (SM-1):** [Đo lường bằng KPI cụ thể].
- **Success Metric 2 (SM-2):** [Đo lường bằng tỷ lệ phản hồi tích cực từ người dùng > 85%].

### 1.4. Customer or Market Needs (Nhu cầu khách hàng / thị trường)
- Nhu cầu thực tế của từng đối tượng khách hàng mục tiêu.

### 1.5. Business Risks (Rủi ro kinh doanh)
- Rủi ro về thị trường, đối thủ cạnh tranh, sự chấp nhận của người dùng và phương án giảm thiểu (Mitigation strategy).

---

## 2. Vision of the Solution (Tầm nhìn Giải pháp)

### 2.1. Vision Statement (Tuyên ngôn tầm nhìn)
> **Dành cho** [Khách hàng mục tiêu]  
> **Người có nhu cầu** [Vấn đề hoặc cơ hội cần nắm bắt]  
> **Hệ thống** [Tên hệ thống/Sản phẩm]  
> **Là một** [Phân loại sản phẩm, ví dụ: Nền tảng ứng dụng di động & web]  
> **Có khả năng** [Lợi ích chính, tính năng vượt trội tạo sự khác biệt]  
> **Không giống như** [Sản phẩm đối thủ cạnh tranh chính hoặc quy trình thủ công hiện tại]  
> **Sản phẩm của chúng tôi** [Điểm độc đáo tạo nên giá trị cốt lõi].

### 2.2. Major Features (Các tính năng chính cốt lõi)
- **FEAT-1:** [Tên tính năng 1 - Tóm tắt ngắn gọn chức năng cung cấp].
- **FEAT-2:** [Tên tính năng 2].
- **FEAT-3:** [Tên tính năng 3].
- **FEAT-4:** [Tên tính năng 4].

### 2.3. Assumptions and Dependencies (Giả định & Sự phụ thuộc)
- **Giả định:** Người dùng sở hữu điện thoại thông minh kết nối internet tối thiểu 4G; Cổng thanh toán bên thứ ba luôn khả dụng.
- **Sự phụ thuộc:** Tích hợp với dịch vụ xác thực OTP qua SMS, API bản đồ Google Maps, v.v.

---

## 3. Scope and Limitations (Phạm vi & Giới hạn)

### 3.1. Scope of Initial Release (Phạm vi phiên bản phát hành đầu tiên - MVP)
- Danh sách các tính năng được phát triển trong phiên bản 1.0 (Must-Have).

### 3.2. Scope of Subsequent Releases (Phạm vi các phiên bản tiếp theo)
- **Release 2.0:** [Các tính năng nâng cao, AI gợi ý thông minh, báo cáo chuyên sâu...]
- **Release 3.0:** [Mở rộng hệ sinh thái, tích hợp đa nền tảng...]

### 3.3. Limitations and Exclusions (Giới hạn ngoài phạm vi - Out of Scope)
- Hệ thống không hỗ trợ giao dịch tiền mặt trực tiếp.
- Hệ thống chưa hỗ trợ đa ngôn ngữ trong phiên bản đầu tiên (chỉ hỗ trợ Tiếng Việt).

---

## 4. Business Context (Bối cảnh Nghiệp vụ)

### 4.1. Stakeholder Profiles (Hồ sơ các bên liên quan)
| Stakeholder | Đại diện | Vai trò chính | Nhu cầu & Kỳ vọng | Mức độ ảnh hưởng |
| :--- | :--- | :--- | :--- | :--- |
| End User | Bệnh nhân/Khách hàng | Sử dụng dịch vụ | Giao diện thân thiện, đặt lịch nhanh | Cao |
| Service Provider | Bác sĩ / Cửa hàng | Cung cấp dịch vụ | Quản lý lịch thuận tiện, nhận thông báo kịp thời | Cao |
| System Admin | Đội ngũ kỹ thuật | Vận hành hệ thống | Quản lý tài khoản, cấu hình bảo mật, phân quyền | Trung bình |

### 4.2. Context Diagram (Sơ đồ ngữ cảnh hệ thống)
```mermaid
flowchart TD
    User["Người dùng cuối (End-User)"] -->|Yêu cầu dịch vụ / Thanh toán| System[("Hệ Thống Phần Mềm")]
    System -->|Thông báo / Kết quả / Hóa đơn| User

    Admin["Quản trị viên (Admin)"] -->|Cấu hình / Quản lý người dùng| System
    System -->|Báo cáo thống kê / Logs| Admin

    PaymentGW["Cổng thanh toán bên thứ 3"] <-->|Xác thực giao dịch| System
    SMSGateway["SMS / Mail Gateway"] <--|Gửi OTP / Email xác nhận| System
```
