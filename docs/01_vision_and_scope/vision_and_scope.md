# 📑 TÀI LIỆU VISION AND SCOPE (TẦM NHÌN VÀ PHẠM VI)

> **Môn học:** SWR302 — Software Requirements  
> **Dự án:** [Tên Dự Án Của Nhóm]  
> **Phiên bản:** 1.0 (Draft)  
> **Người thực hiện:** [Tên Thành viên / Nhóm X]  

---

## 1. BUSINESS REQUIREMENTS (YÊU CẦU KINH DOANH)

### 1.1 Bối cảnh (Background)
Trong kỷ nguyên số hóa, nhu cầu quản lý và thực hiện giao dịch trực tuyến ngày càng trở nên cấp thiết. Các phương thức quản lý truyền thống bộc lộ nhiều điểm nghẽn: tốn kém thời gian, dễ thất lạc dữ liệu, tỷ lệ sai sót thủ công cao và thiếu khả năng thống kê tức thì.

### 1.2 Cơ hội kinh doanh (Business Opportunity)
Xây dựng một nền tảng số hóa tập trung giúp kết nối trực tiếp giữa người dùng và nhà cung cấp dịch vụ, tối ưu hóa quy trình tiếp nhận, xử lý và giám sát giao dịch với chi phí vận hành tối thiểu.

### 1.3 Mục tiêu kinh doanh & Tiêu chí thành công (Business Objectives & Success Metrics)
- **BO-1:** Giảm ít nhất 50% thời gian chờ đợi xử lý yêu cầu nghiệp vụ trong 3 tháng đầu tiên.
- **BO-2:** Đạt mức độ hài lòng của khách hàng (CSAT) tối thiểu 85% trong khảo sát sau sử dụng.
- **BO-3:** Giảm tỷ lệ huỷ hẹn / hủy đơn bất ngờ xuống dưới 10% nhờ hệ thống thông báo nhắc nhở tự động.

---

## 2. VISION STATEMENT (TUYÊN NGÔN TẦM NHÌN)

> **Dành cho:** Khách hàng và đối tác cần một giải pháp quản lý & giao dịch nhanh chóng  
> **Người đang gặp vấn đề:** Mất nhiều thời gian xếp hàng, quản lý lịch trình thủ công rời rạc  
> **Sản phẩm của chúng tôi:** [Tên sản phẩm]  
> **Là một:** Nền tảng ứng dụng đa nền tảng hiện đại  
> **Giúp:** Tự động hóa quy trình đặt chỗ, thanh toán trực tuyến và cập nhật trạng thái theo thời gian thực  
> **Khác với:** Các hệ thống phân tán, ghi sổ truyền thống hoặc các ứng dụng đơn lẻ thiếu đồng bộ  
> **Sản phẩm của chúng tôi:** Đem lại trải nghiệm liền mạch, an toàn bảo mật và khả năng phân tích báo cáo toàn diện.

---

## 3. SCOPE AND LIMITATIONS (PHẠM VI DỰ ÁN)

### 3.1 Phạm vi bản phát hành đầu tiên (In-Scope for Release 1.0 - MVP)
1. **Module Tài khoản & Phân quyền:** Đăng ký, đăng nhập, bảo vệ dữ liệu người dùng, phân quyền RBAC.
2. **Module Tìm kiếm & Khám phá:** Bộ lọc thông minh theo danh mục, vị trí, giá, thời gian.
3. **Module Đặt dịch vụ & Xử lý giao dịch:** Chọn lịch, xác nhận, hủy lịch trước hạn.
4. **Module Tích hợp Thanh toán:** Cổng thanh toán trực tuyến và hóa đơn điện tử.
5. **Module Dashboard & Báo cáo cơ bản:** Thống kê lượt giao dịch và doanh thu cho quản lý.

### 3.2 Ngoài phạm vi phiên bản 1.0 (Out-of-Scope)
- Tích hợp trí tuệ nhân tạo (AI) gợi ý thông minh (sẽ triển khai ở Release 2.0).
- Hỗ trợ thanh toán quốc tế đa tiền tệ (chỉ hỗ trợ VNĐ ở MVP).
- Ứng dụng bản địa hóa đa ngôn ngữ (chỉ hỗ trợ Tiếng Việt ở MVP).

---

## 4. CONTEXT DIAGRAM (SƠ ĐỒ NGỮ CẢNH HỆ THỐNG)

```mermaid
flowchart TD
    Customer["Người Dùng / Khách Hàng"] -->|"Thông tin đăng ký, Yêu cầu dịch vụ, Dữ liệu thanh toán"| System(("Hệ Thống\n[Tên Dự Án]\nProcess 0"))
    System -->|"Xác nhận đặt lịch, Hóa đơn, Kết quả tra cứu"| Customer

    Admin["Quản Trị Viên (Admin)"] -->|"Cấu hình danh mục, Phân quyền người dùng"| System
    System -->|"Báo cáo thống kê, Nhật ký kiểm toán (Audit Logs)"| Admin

    Provider["Đối Tác / Nhà Cung Cấp"] -->|"Cập nhật lịch làm việc, Xác nhận hoàn tất dịch vụ"| System
    System -->|"Danh sách lịch hẹn, Thông báo đơn mới"| Provider

    PaymentGW["Cổng Thanh Toán Trực Tuyến"] <-->|"Xác thực giao dịch thanh toán"| System
    NotificationService["Cổng Gửi Email / SMS"] <--|"Yêu cầu gửi mã OTP / Thông báo"| System
```
