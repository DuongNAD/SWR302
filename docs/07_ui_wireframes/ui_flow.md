# 📱 SƠ ĐỒ LUỒNG MÀN HÌNH (SCREEN FLOW / UI FLOW)

```mermaid
flowchart LR
    Splash["Màn hình Chào (Splash)"] --> Home["Trang Chủ (Home / Catalog)"]
    Home --> Search["Tìm Kiếm & Bộ Lọc"]
    Home --> Login["Đăng Nhập / Đăng Ký"]

    Search --> Detail["Chi Tiết Dịch Vụ & Chuyên Gia"]
    Detail --> SelectSlot["Chọn Ngày & Khung Giờ"]

    SelectSlot --> CheckLogin{Đã đăng nhập?}
    CheckLogin -- Chưa --> Login
    Login --> Checkout["Xác Nhận Đặt Lịch & Hóa Đơn"]
    CheckLogin -- Rồi --> Checkout

    Checkout --> ApplyPromo["Nhập Voucher Khuyến Mãi"]
    ApplyPromo --> Checkout

    Checkout --> Payment["Cổng Thanh Toán Trực Tuyến"]
    Payment --> Success["Đặt Lịch Thành Công (Booking Receipt)"]
    Payment --> Failed["Thanh Toán Thất Bại (Thử Lại)"]
    Failed --> Checkout

    Success --> History["Lịch Sử Đặt Chỗ (Quản Lý & Hủy Lịch)"]
```

---

## DANH SÁCH MÃ MÀN HÌNH (SCREEN SPECIFICATION)
| Mã màn hình | Tên màn hình | Chức năng chính | Use Case liên quan |
| :---: | :--- | :--- | :---: |
| **SCR-01** | Landing Page / Trang chủ | Banner nổi bật, tìm kiếm nhanh, top dịch vụ được ưa thích | `UC-02` |
| **SCR-02** | Login / Register Modal | Đăng nhập bằng Email/Password hoặc Google OAuth | `UC-01` |
| **SCR-03** | Service Detail Page | Thông tin dịch vụ, chuyên gia, đánh giá, bảng giá | `UC-02` |
| **SCR-04** | Booking Calendar Slot | Lịch chọn ngày, các slot giờ còn trống theo thời gian thực | `UC-03` |
| **SCR-05** | Checkout & Payment | Tóm tắt đơn hàng, áp voucher, chọn cổng VNPay/MoMo | `UC-04` |
| **SCR-06** | Booking Confirmation Receipt | Hiển thị mã QR check-in, mã Booking ID, hướng dẫn đường đi | `UC-03`, `UC-04` |
| **SCR-07** | Admin Dashboard | Biểu đồ doanh thu, thống kê lượt đặt, quản lý người dùng | `UC-08`, `UC-10` |
