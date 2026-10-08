# ⚡ YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFRs)
### Phân loại theo mô hình FURPS+ (Hewlett-Packard / Karl Wiegers)

---

## 1. FUNCTIONALITY (AN TOÀN BẢO MẬT & PHÂN QUYỀN)
- **NFR-SEC-01 (Mã hóa đường truyền):** 100% dữ liệu trao đổi giữa máy khách và máy chủ phải được mã hóa bằng giao thức HTTPS/TLS 1.3 với chứng chỉ SSL hợp lệ.
- **NFR-SEC-02 (Mã hóa mật khẩu):** Mật khẩu người dùng không bao giờ được lưu dưới dạng văn bản thuần (plain text); bắt buộc phải được mã hóa bằng thuật toán băm an toàn (BCrypt với cost factor >= 12 hoặc Argon2id).
- **NFR-SEC-03 (Kiểm soát truy cập - RBAC):** Hệ thống phải thực thi kiểm tra quyền nghiêm ngặt tại tầng API đối với mọi endpoint yêu cầu quyền Admin hoặc Provider.
- **NFR-SEC-04 (Bảo vệ phiên làm việc):** Phiên làm việc (Session) sẽ tự động hết hạn và yêu cầu đăng nhập lại sau 30 phút nếu không có bất kỳ tương tác nào từ phía người dùng.

---

## 2. USABILITY (KHẢ NĂNG SỬ DỤNG & TRẢI NGHIỆM NGƯỜI DÙNG)
- **NFR-USA-01 (Thời gian hoàn thành thao tác):** Người dùng thông thường có thể hoàn thành luồng đặt lịch dịch vụ trong vòng không quá 3 phút (tối đa 4 bước màn hình).
- **NFR-USA-02 (Tính đáp ứng giao diện - Responsive):** Giao diện web/app phải hiển thị mượt mà và trực quan trên các kích thước màn hình phổ biến từ 375px (iPhone SE) đến 1920px (Desktop Full HD).
- **NFR-USA-03 (Thông báo lỗi thân thiện):** Tất cả các thông báo lỗi hiển thị cho người dùng phải rõ ràng bằng tiếng Việt, giải thích nguyên nhân và hướng dẫn cách khắc phục, tuyệt đối không hiển thị mã lỗi kỹ thuật (ví dụ: Stack trace hoặc SQL Exception).

---

## 3. RELIABILITY (ĐỘ TIN CẬY & TÍNH KHẢ DỤNG)
- **NFR-REL-01 (Độ khả dụng - Availability):** Hệ thống phải đảm bảo thời gian hoạt động liên tục (Uptime) tối thiểu 99.5% mỗi tháng (tương đương thời gian gián đoạn tối đa không quá 3.65 giờ/tháng).
- **NFR-REL-02 (Sao lưu dữ liệu - Backup):** Toàn bộ cơ sở dữ liệu phải được tự động sao lưu định kỳ 24 giờ một lần (Automated Daily Backup) và được lưu trữ phân tán tại vị trí địa lý độc lập.
- **NFR-REL-03 (Khôi phục thảm họa - RTO & RPO):**
  - **RTO (Recovery Time Objective):** Thời gian phục hồi hệ thống sau sự cố sập máy chủ tối đa là 2 giờ.
  - **RPO (Recovery Point Objective):** Mất mát dữ liệu tối đa chấp nhận được không vượt quá 1 giờ dữ liệu giao dịch.

---

## 4. PERFORMANCE (HIỆU NĂNG & KHẢ NĂNG TẢI)
- **NFR-PERF-01 (Thời gian phản hồi):** Trong điều kiện tải thông thường, 90% các tác vụ tìm kiếm và xem trang phải trả về kết quả trong thời gian dưới 1.2 giây.
- **NFR-PERF-02 (Tải đồng thời - Concurrency):** Hệ thống phải duy trì hoạt động ổn định khi có ít nhất 1.000 người dùng truy cập và thao tác đồng thời tại cùng một thời điểm.
- **NFR-PERF-03 (Băng thông & Kích thước trang):** Dung lượng tải về của trang chủ (Landing Page) lần đầu tiên không được vượt quá 2.5 MB.

---

## 5. SUPPORTABILITY (KHẢ NĂNG BẢO TRÌ & MỞ RỘNG)
- **NFR-SUP-01 (Kiến trúc phân tầng):** Hệ thống phải được thiết kế theo kiến trúc phân tách rõ ràng (Clean Architecture / RESTful APIs), cho phép thay thế giao diện người dùng mà không cần sửa đổi logic nghiệp vụ phía backend.
- **NFR-SUP-02 (Nhật ký hệ thống - Logging):** Hệ thống phải tự động ghi log mọi giao dịch tài chính, thay đổi phân quyền và ngoại lệ hệ thống vào file log tập trung để hỗ trợ truy vết lỗi.
