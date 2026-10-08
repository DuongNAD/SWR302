# 📑 ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS - IEEE STD 830-1998)
### SOFTWARE REQUIREMENTS SPECIFICATION

**Tên dự án:** [TÊN HỆ THỐNG / ĐỀ TÀI SẢN PHẨM]  
**Môn học:** SWR302 — Software Requirements  
**Nhóm thực hiện:** [Nhóm X]  
**Phiên bản:** 1.0 (Official Draft)  
**Ngày cập nhật:** DD/MM/2026  

---

## MỤC LỤC TÀI LIỆU
1. **GIỚI THIỆU (INTRODUCTION)**
   - 1.1 Mục đích (Purpose)
   - 1.2 Phạm vi tài liệu (Scope)
   - 1.3 Định nghĩa & Từ viết tắt (Definitions & Acronyms)
   - 1.4 Tài liệu tham khảo (References)
   - 1.5 Tổng quan cấu trúc tài liệu (Overview)
2. **MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)**
   - 2.1 Bối cảnh hệ thống (Product Perspective) & Sơ đồ ngữ cảnh (Context Diagram)
   - 2.2 Các phân hệ chức năng chính (Product Functions)
   - 2.3 Phân loại người dùng (User Classes & Characteristics)
   - 2.4 Môi trường vận hành (Operating Environment)
   - 2.5 Ràng buộc thiết kế và triển khai (Design Constraints)
   - 2.6 Giả định và phụ thuộc (Assumptions & Dependencies)
3. **YÊU CẦU GIAO DIỆN HỆ THỐNG NGOÀI (EXTERNAL INTERFACE REQUIREMENTS)**
   - 3.1 Giao diện người dùng (User Interfaces)
   - 3.2 Giao diện phần cứng (Hardware Interfaces)
   - 3.3 Giao diện phần mềm & API bên ngoài (Software Interfaces)
   - 3.4 Giao diện truyền thông (Communications Interfaces)
4. **CÁC TÍNH NĂNG VÀ YÊU CẦU CHỨC NĂNG (SYSTEM FEATURES & FUNCTIONAL REQUIREMENTS)**
   - *Chi tiết liên kết:* Xem toàn bộ danh sách tại [functional_reqs.md](functional_reqs.md)
   - 4.1 Phân hệ Quản lý Tài khoản & Phân quyền (Authentication & Authorization)
   - 4.2 Phân hệ Tìm kiếm & Tra cứu Dịch vụ (Search & Discovery)
   - 4.3 Phân hệ Đặt chỗ & Quản lý Lịch hẹn (Booking Management)
   - 4.4 Phân hệ Thanh toán & Hóa đơn (Payment & Invoicing)
   - 4.5 Phân hệ Quản trị & Báo cáo Thống kê (Admin & Dashboard)
5. **QUY TẮC NGHIỆP VỤ (BUSINESS RULES)**
   - *Chi tiết liên kết:* Xem toàn bộ quy tắc nghiệp vụ tại [business_rules.md](business_rules.md)
   - 5.1 Facts & Constraints
   - 5.2 Action Enablers & Inferences
   - 5.3 Computations (Thuật toán chiết khấu, phạt huỷ)
6. **YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - FURPS+)**
   - *Chi tiết liên kết:* Xem bảng NFRs chi tiết tại [non_functional_reqs.md](non_functional_reqs.md)
   - 6.1 An toàn & Bảo mật (Security)
   - 6.2 Khả năng sử dụng (Usability)
   - 6.3 Độ tin cậy & Sẵn sàng (Reliability & Availability)
   - 6.4 Hiệu năng & Khả năng chịu tải (Performance)
   - 6.5 Khả năng bảo trì & Mở rộng (Supportability)
7. **CÁC YÊU CẦU KHÁC (OTHER REQUIREMENTS)**
   - 7.1 Cơ sở dữ liệu và lưu trữ (Database Requirements)
   - 7.2 Tuân thủ pháp lý & Sở hữu trí tuệ (Legal & Compliance)
