# 📄 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
### Chuẩn IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018

**Tên dự án:** [TÊN HỆ THỐNG / SẢN PHẨM]  
**Phiên bản tài liệu:** 1.0  
**Tác giả:** Nhóm [Nhóm X] - Môn SWR302  
**Ngày:** DD/MM/2026  

---

## BẢNG LỊCH SỬ THAY ĐỔI (REVISION HISTORY)

| Phiên bản | Ngày | Tác giả | Mô tả thay đổi | Trạng thái |
| :---: | :---: | :--- | :--- | :--- |
| 0.1 | DD/MM/2026 | [Tác giả] | Khởi tạo khung tài liệu SRS | Draft |
| 1.0 | DD/MM/2026 | [Tác giả] | Hoàn thiện FR, NFR, Business Rules và Use Cases | Review |

---

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1 Mục đích tài liệu (Purpose)
Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này mô tả toàn diện và chi tiết các yêu cầu chức năng, phi chức năng, quy tắc nghiệp vụ và giao diện người dùng của hệ thống **[Tên hệ thống]**. Tài liệu này đóng vai trò là cơ sở cam kết giữa khách hàng/stakeholder và đội ngũ phát triển, kiểm thử.

### 1.2 Phạm vi sản phẩm (Document Scope)
Hệ thống **[Tên hệ thống]** được xây dựng nhằm giải quyết bài toán [mô tả bài toán chính]. Phiên bản này bao gồm các phân hệ chính:
- Phân hệ Quản lý Tài khoản & Phân quyền (Authentication & Authorization).
- Phân hệ Quản lý Nghiệp vụ cốt lõi (Core Business Modules).
- Phân hệ Báo cáo & Thống kê (Reporting & Analytics).

### 1.3 Định nghĩa, từ viết tắt (Definitions, Acronyms, and Abbreviations)
| Từ viết tắt | Định nghĩa đầy đủ |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **FR** | Functional Requirement (Yêu cầu chức năng) |
| **NFR** | Non-Functional Requirement (Yêu cầu phi chức năng) |
| **BR** | Business Rule (Quy tắc nghiệp vụ) |
| **UC** | Use Case |
| **RTM** | Requirements Traceability Matrix |
| **RBAC** | Role-Based Access Control |

### 1.4 Tài liệu tham khảo (References)
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. Karl Wiegers & Joy Beatty: *Software Requirements (3rd Edition)*.
3. Tài liệu Vision & Scope của dự án: [vision_and_scope.md](../01_vision_and_scope/vision_and_scope.md).

---

## 2. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)

### 2.1 Bối cảnh sản phẩm (Product Perspective)
- Hệ thống này là một sản phẩm độc lập (Self-contained) hay là một phân hệ trong một hệ thống lớn hơn?
- Các giao tiếp với hệ thống bên ngoài: Cổng thanh toán (VNPay/Momo/Stripe), Email Server (SendGrid), Dịch vụ SMS OTP.

### 2.2 Các lớp chức năng chính của sản phẩm (Product Functions)
- **Quản lý danh tính:** Đăng ký, đăng nhập, quên mật khẩu, phân quyền đa vai trò.
- **Nghiệp vụ giao dịch/đặt hàng:** Tìm kiếm, xem chi tiết, khởi tạo đơn, hủy/đổi.
- **Thanh toán & Hóa đơn:** Tích hợp cổng thanh toán trực tuyến và ghi nhận dòng tiền.
- **Báo cáo & Giám sát:** Dashboard trực quan theo thời gian thực cho người quản lý.

### 2.3 Các lớp người dùng và đặc điểm (User Classes and Characteristics)
| Lớp người dùng (User Class) | Mô tả vai trò | Tần suất sử dụng | Trình độ công nghệ |
| :--- | :--- | :--- | :--- |
| **Khách hàng vãng lai (Guest)** | Duyệt thông tin công khai | Không thường xuyên | Cơ bản |
| **Người dùng đã đăng ký (Registered User)** | Thực hiện giao dịch chính | Hàng ngày / Hàng tuần | Cơ bản đến trung bình |
| **Nhân viên nghiệp vụ (Staff/Operator)** | Xử lý dữ liệu, kiểm duyệt | Hàng ngày (8h/ngày) | Trung bình |
| **Quản trị viên (System Admin)** | Quản lý hệ thống, cấu hình | Thường xuyên | Nâng cao |

### 2.4 Môi trường vận hành (Operating Environment)
- **Web App:** Hỗ trợ các trình duyệt hiện đại (Google Chrome 110+, Safari 16+, Edge, Firefox).
- **Mobile App (nếu có):** Android 10+ và iOS 15+.
- **Hạ tầng Server:** Nền tảng Cloud (AWS / Google Cloud / Docker containers).

### 2.5 Ràng buộc thiết kế và triển khai (Design and Implementation Constraints)
- Tuân thủ Luật An ninh mạng Việt Nam và bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP).
- Mật khẩu người dùng phải được mã hóa một chiều bằng thuật toán băm an toàn (Argon2 hoặc BCrypt có muối).

---

## 3. CÁC TÍNH NĂNG HỆ THỐNG & YÊU CẦU CHỨC NĂNG (SYSTEM FEATURES & FUNCTIONAL REQUIREMENTS)

> **Quy ước:** Mỗi yêu cầu chức năng (FR) phải tuân theo cấu trúc:  
> `Hệ thống PHẢI [hành động] khi [điều kiện kích hoạt]` (The system SHALL...).

### 3.1 Nhóm chức năng: Quản lý Xác thực & Tài khoản (Module Authentication)
- **FR-AUTH-01:** Hệ thống **phải** cho phép người dùng đăng ký tài khoản mới bằng địa chỉ email hợp lệ và mật khẩu thỏa mãn chính sách bảo mật [BR-01].
- **FR-AUTH-02:** Hệ thống **phải** gửi mã OTP xác thực qua email/SMS có hiệu lực trong vòng 5 phút sau khi người dùng bấm gửi yêu cầu.
- **FR-AUTH-03:** Hệ thống **phải** khóa tài khoản tạm thời trong vòng 15 phút nếu người dùng nhập sai mật khẩu quá 5 lần liên tiếp [BR-02].
- **FR-AUTH-04:** Hệ thống **phải** cung cấp tính năng Đăng xuất và vô hiệu hóa JWT token phiên làm việc hiện tại ngay lập tức.

### 3.2 Nhóm chức năng: Quản lý Nghiệp vụ Cốt lõi (Core Business Module)
- **FR-CORE-01:** Hệ thống **phải** cho phép người dùng tìm kiếm theo từ khóa, lọc theo danh mục, mức giá và khoảng thời gian.
- **FR-CORE-02:** Hệ thống **phải** hiển thị trạng thái tồn kho / lịch trống theo thời gian thực (real-time).
- **FR-CORE-03:** Hệ thống **phải** tự động tính toán tổng số tiền bao gồm thuế, phí dịch vụ và áp dụng mã giảm giá hợp lệ trước khi xác nhận đơn.

*(Chi tiết xem thêm tại file [functional_reqs.md](functional_reqs.md))*

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

| Mã BR | Tên quy tắc nghiệp vụ | Mô tả chi tiết quy tắc | Loại quy tắc |
| :--- | :--- | :--- | :--- |
| **BR-01** | Chính sách mật khẩu | Mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt. | Ràng buộc dữ liệu |
| **BR-02** | Khóa đăng nhập chống Brute-force | Sau 5 lần nhập sai liên tiếp, khóa 15 phút hoặc yêu cầu giải mã Captcha. | Ràng buộc bảo mật |
| **BR-03** | Chính sách hủy đơn/lịch | Người dùng chỉ được hủy miễn phí trước giờ hẹn tối thiểu 24 giờ. Hủy sau thời gian này chịu phí phạt 30%. | Quy tắc vận hành |

*(Chi tiết xem thêm tại file [business_rules.md](business_rules.md))*

---

## 5. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - FURPS+)

### 5.1 Hiệu năng (Performance Requirements)
- **NFR-PERF-01 (Thời gian phản hồi):** Hệ thống phải phản hồi 95% các yêu cầu truy vấn thông thường dưới 1.5 giây trong điều kiện tải bình thường.
- **NFR-PERF-02 (Tải đồng thời):** Hệ thống phải chịu tải tối thiểu 1.000 người dùng hoạt động đồng thời (concurrent users) mà không xảy ra lỗi sập dịch vụ.

### 5.2 An toàn & Bảo mật (Security Requirements)
- **NFR-SEC-01 (Mã hóa đường truyền):** 100% dữ liệu truyền qua mạng phải được mã hóa giao thức TLS 1.3 (HTTPS).
- **NFR-SEC-02 (Phân quyền):** Áp dụng mô hình RBAC (Role-Based Access Control) để kiểm soát quyền truy cập tài nguyên theo từng vai trò cụ thể.

### 5.3 Độ tin cậy & Sẵn sàng (Reliability & Availability)
- **NFR-REL-01 (Uptime):** Hệ thống duy trì thời gian hoạt động khả dụng (Availability) tối thiểu 99.5% mỗi tháng (không tính thời gian bảo trì có báo trước).
- **NFR-REL-02 (Backup):** Cơ sở dữ liệu phải được tự động sao lưu định kỳ hàng ngày (daily snapshot) và lưu trữ bảo mật tại máy chủ dự phòng.

### 5.4 Khả năng sử dụng (Usability Requirements)
- **NFR-USA-01:** Người dùng lần đầu tiên truy cập có thể hoàn thành luồng nghiệp vụ chính trong vòng dưới 3 phút mà không cần hướng dẫn bằng văn bản.
- **NFR-USA-02:** Giao diện tương thích Responsive trên mọi kích thước màn hình từ 375px (Mobile) đến 1920px (Desktop).

*(Chi tiết xem thêm tại file [non_functional_reqs.md](non_functional_reqs.md))*

---

## 6. GIAO DIỆN HỆ THỐNG NGOÀI (EXTERNAL INTERFACE REQUIREMENTS)

- **User Interfaces (UI):** Thiết kế theo quy chuẩn Material Design / Human Interface Guidelines, hỗ trợ Dark Mode và Light Mode.
- **Software Interfaces:**
  - Tích hợp cổng thanh toán VNPay / Momo qua RESTful API có xác thực chữ ký điện tử HMAC-SHA512.
  - Tích hợp dịch vụ gửi thư SMTP / SendGrid API.
- **Communications Interfaces:** HTTPS, WebSockets (cho thông báo thời gian thực).
