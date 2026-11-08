# ⚡ SƠ ĐỒ TRÌNH TỰ (SEQUENCE DIAGRAMS)

> **Đề tài:** Topic 1 — Hệ thống mua sắm nguyên liệu và thiết bị làm bánh trực tuyến (Gia Hòa Phát Bakery Supply)
> **Khớp với:** SRS_BakeCraft_v1.0 (UC01–UC15, BR-01–BR-09), [sơ đồ lớp](domain_model.md) và màn hình SCR-xx của prototype
> **Mã nguồn sơ đồ:** [`assignment2/diagrams/SD*.puml`](../../assignment2/diagrams) (PlantUML)

Mỗi use case có đúng một sơ đồ trình tự, tổng cộng 15 sơ đồ (SD01–SD15). Mỗi thành viên phụ trách 3 sơ đồ, không trùng nhau.

## Quy ước

- Đường đời theo mẫu Boundary – Control – Entity: «boundary» là màn hình của prototype (mã SCR-xx trong SRS), «control» là bộ điều khiển xử lý use case, «entity» là lớp trong [sơ đồ lớp](domain_model.md), «system» là hệ thống bên ngoài.
- Thông điệp được đánh số. Mũi tên liền là lời gọi, mũi tên nét đứt là giá trị trả về, đầu mũi tên mở là thông điệp bất đồng bộ. `create(...)` tạo đối tượng mới (đường đời bắt đầu tại thông điệp đó).
- Khối `alt` là các nhánh rẽ (A1, A2… đánh số theo luồng thay thế trong SRS), `opt` là phần không bắt buộc, `loop` là vòng lặp, `group «include»` là use case được bao hàm.

## Danh sách sơ đồ

| Mã | Use case | Kịch bản | Luồng thay thế | Phụ trách |
| :---: | :--- | :--- | :--- | :---: |
| SD01 | UC01 Đăng ký tài khoản | Khách đăng ký tài khoản lẻ, xác thực OTP | A1 sai dữ liệu, A2 sai hoặc hết hạn OTP, A3 đã đăng ký | Thành viên 1 |
| SD02 | UC08 Đăng nhập | Đăng nhập, chuyển tới cửa hàng hoặc trang quản trị theo vai trò | A1 sai thông tin, tài khoản bị khóa sau 5 lần sai | Thành viên 1 |
| SD03 | UC07 Quản lý tài khoản cá nhân | Thêm địa chỉ nhận hàng, đặt làm mặc định | A1 dữ liệu không hợp lệ | Thành viên 1 |
| SD04 | UC02 Tìm kiếm và xem sản phẩm | Gợi ý tìm kiếm, lọc, sắp xếp, xem chi tiết sản phẩm | A1 không có kết quả | Thành viên 2 |
| SD05 | UC03 Xem combo công thức | Bỏ nguyên liệu đã có, thêm phần còn lại vào giỏ | A1 chưa đăng nhập | Thành viên 2 |
| SD06 | UC04 Quản lý giỏ hàng | Đổi số lượng (giá sỉ, phí đóng thùng lạnh), áp dụng voucher | A1 voucher không hợp lệ, A2 giỏ trống | Thành viên 2 |
| SD07 | UC05 Đặt hàng và thanh toán | Thanh toán 3 bước, giao xe lạnh, trả bằng mã QR VNPay | A1 thiếu thông tin, A2 thanh toán thất bại | Thành viên 3 |
| SD08 | UC06 Theo dõi đơn hàng | Khách tra cứu đơn bằng mã đơn và số điện thoại, xem hành trình, hủy đơn | A1 không tìm thấy, A2 không còn hủy được | Thành viên 3 |
| SD09 | UC10 Xử lý đơn hàng | Lọc đơn, đánh dấu đủ các mục đóng thùng lạnh, chuyển trạng thái tới khi giao xong | Đơn bị hủy (A1) | Thành viên 3 |
| SD10 | UC11 Quản lý sản phẩm và danh mục | Thêm sản phẩm mới kèm bảng giá sỉ | A1 thiếu tên hoặc SKU, trùng SKU | Thành viên 4 |
| SD11 | UC12 Quản lý kho và hạn dùng | Tạo phiếu nhập kho, xem lô theo FEFO và cảnh báo hạn dùng | A1 số lượng hoặc hạn dùng sai | Thành viên 4 |
| SD12 | UC13 Quản lý khuyến mãi | Lọc, tạo mới và tạm dừng voucher | A1 trùng mã hoặc giá trị sai | Thành viên 4 |
| SD13 | UC09 Xem tổng quan và báo cáo | Xem bảng điều khiển, đổi kỳ thống kê, xuất báo cáo CSV | A1 không có dữ liệu | Thành viên 5 |
| SD14 | UC14 Quản lý khách hàng | Duyệt hoặc từ chối tài khoản khách sỉ | A1 từ chối | Thành viên 5 |
| SD15 | UC15 Quản lý nhân viên và cài đặt | Mời nhân viên, cập nhật quyền của vai trò | A1 e-mail sai hoặc đã dùng | Thành viên 5 |

## SD01 — UC01 Đăng ký tài khoản

![SD01](../../assignment2/diagrams/SD01_UC01_Register.png)

## SD02 — UC08 Đăng nhập

![SD02](../../assignment2/diagrams/SD02_UC08_Login.png)

## SD03 — UC07 Quản lý tài khoản cá nhân: thêm địa chỉ

![SD03](../../assignment2/diagrams/SD03_UC07_AddAddress.png)

## SD04 — UC02 Tìm kiếm và xem sản phẩm

![SD04](../../assignment2/diagrams/SD04_UC02_SearchProducts.png)

## SD05 — UC03 Xem combo công thức và thêm nguyên liệu vào giỏ

![SD05](../../assignment2/diagrams/SD05_UC03_RecipeCombo.png)

## SD06 — UC04 Quản lý giỏ hàng

![SD06](../../assignment2/diagrams/SD06_UC04_ManageCart.png)

## SD07 — UC05 Đặt hàng và thanh toán

Sơ đồ dài nên được chia làm hai phần: bước 1–2 và bước 3.

![SD07 phần 1](../../assignment2/diagrams/SD07_UC05_PlaceOrder.png)

![SD07 phần 2](../../assignment2/diagrams/SD07_UC05_PlaceOrder_001.png)

## SD08 — UC06 Theo dõi và hủy đơn hàng

![SD08](../../assignment2/diagrams/SD08_UC06_TrackOrder.png)

## SD09 — UC10 Xử lý đơn hàng

![SD09](../../assignment2/diagrams/SD09_UC10_ProcessOrder.png)

## SD10 — UC11 Thêm sản phẩm kèm bảng giá sỉ

![SD10](../../assignment2/diagrams/SD10_UC11_AddProduct.png)

## SD11 — UC12 Nhập kho và cảnh báo hạn dùng

![SD11](../../assignment2/diagrams/SD11_UC12_StockReceipt.png)

## SD12 — UC13 Tạo và tạm dừng voucher

![SD12](../../assignment2/diagrams/SD12_UC13_CreateVoucher.png)

## SD13 — UC09 Xem tổng quan và báo cáo

![SD13](../../assignment2/diagrams/SD13_UC09_Reports.png)

## SD14 — UC14 Duyệt tài khoản khách sỉ

![SD14](../../assignment2/diagrams/SD14_UC14_ApproveWholesale.png)

## SD15 — UC15 Mời nhân viên và phân quyền

![SD15](../../assignment2/diagrams/SD15_UC15_StaffPermissions.png)
