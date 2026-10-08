# 👥 PHÂN TÍCH CÁC BÊN LIÊN QUAN (STAKEHOLDER ANALYSIS)

## 1. Ma trận Quyền hạn & Mức độ quan tâm (Power vs Interest Matrix)

```text
       Mức độ quyền hạn (Power)
          ▲
     Cao  │  [Tham vấn & Quản lý chặt]       [Hợp tác chặt chẽ (Key Players)]
          │  - Nhà tài trợ dự án (Sponsor)   - Ban Giám đốc / Product Owner
          │  - Cơ quan quản lý pháp lý       - Trưởng bộ phận nghiệp vụ
          │──────────────────────────────────────────────────────────────
     Thấp │  [Giám sát tối thiểu]             [Thông báo & Giữ gắn kết]
          │  - Nhà cung cấp dịch vụ phụ trợ  - Người dùng cuối (End-Users)
          │  - Bộ phận hỗ trợ kỹ thuật       - Nhân viên vận hành hàng ngày
          └──────────────────────────────────────────────────────────────►
             Thấp                             Cao
                     Mức độ quan tâm (Interest)
```

---

## 2. Bảng Phân Tích Stakeholder Chi Tiết

| Mã Stakeholder | Tên nhóm liên quan | Đại diện tiêu biểu | Mục tiêu & Kỳ vọng chính | Nỗi đau hiện tại (Pain Points) | Chiến lược tương tác (Engagement Strategy) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **SH-01** | Khách hàng cuối (End-User) | Người đặt dịch vụ / Người mua | Trải nghiệm mượt mà, minh bạch giá, bảo mật dữ liệu | Mất thời gian chờ đợi, giao diện phức tạp, dễ bị trễ hẹn | Khảo sát nhu cầu, phỏng vấn mẫu, kiểm thử Usability testing |
| **SH-02** | Đối tác cung ứng (Service Provider)| Bác sĩ / Cửa hàng | Quản lý lịch thuận tiện, giảm tỷ lệ vắng mặt (no-show) | Quản lý sổ sách thủ công dễ nhầm lẫn, khó thống kê doanh thu | Phỏng vấn sâu (Deep interview), đào tạo sử dụng |
| **SH-03** | Đội ngũ Vận hành (Operations) | Chăm sóc khách hàng | Dễ dàng tra cứu thông tin khi khách gọi hỗ trợ | Thông tin phân tán, mất nhiều thao tác xử lý sự cố | Thu thập yêu cầu quy trình hỗ trợ khách hàng |
| **SH-04** | Ban Lãnh đạo (Management) | Business Owner / Sponsor | Tối ưu hóa chi phí, tăng trưởng doanh thu, báo cáo real-time | Thiếu số liệu tổng quan để ra quyết định kinh doanh | Báo cáo tiến độ định kỳ hàng tuần, bản demo MVP |
| **SH-05** | Đội ngũ Kỹ thuật (Dev / QA) | Lập trình viên, Tester | Yêu cầu rõ ràng, không mơ hồ, scope ổn định | Scope creep, thay đổi yêu cầu liên tục, thiếu test case | Tham gia review SRS, phê duyệt RTM |
