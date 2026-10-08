# 📋 TEMPLATE USER STORY & ACCEPTANCE CRITERIA
### Theo chuẩn Agile / Scrum & BDD Gherkin

---

## 1. TIÊU CHUẨN INVEST CHO USER STORY
- **I**ndependent (Độc lập): Có thể phát triển và kiểm thử riêng biệt.
- **N**egotiable (Có thể thương lượng): Không phải bản hợp đồng cứng nhắc.
- **V**aluable (Có giá trị): Mang lại giá trị rõ ràng cho người dùng hoặc khách hàng.
- **E**stimable (Có thể ước lượng): Đủ rõ để dev ước tính Story Points.
- **S**mall (Nhỏ gọn): Hoàn thành trong 1 Sprint.
- **T**estable (Có thể kiểm thử): Có tiêu chí nghiệm thu rõ ràng.

---

## 2. TEMPLATE USER STORY CHI TIẾT

### User Story ID: `US-[Mã số, ví dụ: US-05]`
- **Epic:** `[Tên Epic lớn, ví dụ: Quản lý Giỏ hàng & Thanh toán]`
- **Title:** `[Tên ngắn gọn, ví dụ: Áp dụng mã khuyến mãi khi đặt dịch vụ]`
- **User Role (Actor):** `[Khách hàng]`
- **Priority:** Must Have / Should Have / Could Have (MoSCoW)
- **Story Points:** 3 (Ước lượng theo Fibonacci: 1, 2, 3, 5, 8, 13)

---

### Statement (Mô tả theo cú pháp Connextra)
> **Là một** [Khách hàng đã đăng nhập],  
> **Tôi muốn** [nhập mã khuyến mãi hợp lệ vào ô giảm giá trước khi bấm thanh toán],  
> **Để** [nhận được mức chiết khấu và giảm số tiền phải thanh toán cho đơn hàng].

---

### Acceptance Criteria (Tiêu chí chấp nhận theo chuẩn Gherkin / BDD)

#### Kịch bản 1: Áp dụng mã giảm giá hợp lệ thành công
```gherkin
Scenario: Áp dụng mã giảm giá hợp lệ và còn hạn sử dụng
  Given Người dùng đang ở màn hình Xác nhận Đơn hàng
    And Tổng giá trị đơn hàng đạt điều kiện tối thiểu 200.000 VNĐ
  When Người dùng nhập mã "SUMMER2026" vào ô Mã khuyến mãi
    And Người dùng bấm nút "Áp dụng"
  Then Hệ thống kiểm tra mã tồn tại trong cơ sở dữ liệu và còn lượt dùng
    And Hệ thống tính toán mức giảm giá 10% trên tổng hóa đơn
    And Hệ thống cập nhật lại "Tổng tiền cần thanh toán" đã trừ tiền khuyến mãi
    And Hệ thống hiển thị thông báo màu xanh "Áp dụng mã giảm giá thành công!"
```

#### Kịch bản 2: Mã giảm giá đã hết hạn hoặc hết lượt dùng
```gherkin
Scenario: Nhập mã giảm giá đã hết hiệu lực
  Given Người dùng đang ở màn hình Xác nhận Đơn hàng
  When Người dùng nhập mã "EXPIRED50"
    And Người dùng bấm nút "Áp dụng"
  Then Hệ thống từ chối áp dụng mã
    And Giữ nguyên số tiền thanh toán ban đầu
    And Hệ thống hiển thị thông báo lỗi màu đỏ "Mã khuyến mãi đã hết hạn hoặc hết lượt sử dụng!"
```

#### Kịch bản 3: Đơn hàng chưa đạt giá trị tối thiểu
```gherkin
Scenario: Đơn hàng không đủ điều kiện áp dụng mã
  Given Đơn hàng hiện tại có giá trị 150.000 VNĐ
  When Người dùng nhập mã yêu cầu đơn tối thiểu 200.000 VNĐ
    And Bấm "Áp dụng"
  Then Hệ thống hiển thị cảnh báo "Đơn hàng cần tối thiểu 200.000 VNĐ để sử dụng mã này"
```
