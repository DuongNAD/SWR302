# 📊 REQUIREMENTS TRACEABILITY MATRIX (RTM)
### Ma trận truy vết yêu cầu phần mềm

> **Mục đích:** Đảm bảo mọi Yêu cầu Nghiệp vụ (BR) được hiện thực hóa bởi các Yêu cầu Chức năng (FR), được mô hình hóa qua Use Case (UC), thiết kế giao diện (UI) và kiểm thử đầy đủ qua Test Cases (TC). Đảm bảo không có "Yêu cầu mồ côi" (Orphan requirements) hoặc tính năng phát triển ngoài phạm vi (Gold plating).

---

## BẢNG MA TRẬN TRUY VẾT TIẾN VÀ LÙI (FORWARD & BACKWARD TRACEABILITY)

| Business Need / Obj | Functional Req (FR) | Use Case ID (UC) | User Story ID (US) | UI Screen ID | Test Case ID (TC) | Trạng thái (Status) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BO-01** (Giảm thời gian đặt lịch) | **FR-AUTH-01** (Đăng ký tài khoản) | **UC-01** | **US-01** | SCR-01 (Màn hình Đăng ký) | TC-AUTH-01 | Implemented |
| **BO-01** | **FR-AUTH-02** (Xác thực OTP) | **UC-01** | **US-02** | SCR-02 (Màn hình nhập OTP) | TC-AUTH-02 | Implemented |
| **BO-01** | **FR-CORE-01** (Tìm kiếm dịch vụ) | **UC-02** | **US-03** | SCR-03 (Màn hình Tìm kiếm) | TC-CORE-01 | In Progress |
| **BO-02** (Tăng tỷ lệ giao dịch) | **FR-CORE-02** (Khởi tạo đơn/lịch) | **UC-03** | **US-04** | SCR-04 (Màn hình Đặt lịch) | TC-CORE-02 | In Progress |
| **BO-02** | **FR-PAY-01** (Thanh toán trực tuyến)| **UC-04** | **US-05** | SCR-05 (Màn hình Thanh toán)| TC-PAY-01 | Planned |
| **BO-03** (Báo cáo doanh thu) | **FR-REP-01** (Xuất báo cáo thống kê)| **UC-05** | **US-06** | SCR-06 (Dashboard Admin) | TC-REP-01 | Planned |

---

## KIỂM TRA ĐỘ PHỦ YÊU CẦU (COVERAGE CHECK)
- **Tổng số FRs:** X
- **Số FRs đã có Use Case tương ứng:** Y / X (Tỷ lệ: 100%)
- **Số FRs đã có Test Case tương ứng:** Z / X (Tỷ lệ: 100%)
- **Ghi chú rủi ro:** Không có tính năng nào thiếu kiểm thử hoặc nằm ngoài mục tiêu kinh doanh.
