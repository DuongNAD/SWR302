# Assignment 2 — Sơ đồ UML (Topic 1, Gia Hoa Phat Bakery Supply)

Bài làm Assignment 2 môn SWR302, bám theo SRS đã nộp (`submission/SRS_BakeCraft_v1.0.docx`): 15 use case UC01–UC15, quy tắc BR-01–BR-09, các màn hình SCR-xx của prototype `client/`.

| Yêu cầu của đề | Ở đâu |
| :--- | :--- |
| Use Case Diagram | `diagrams/UC_Diagram.png` (vẽ bằng `tools/usecase_diagram.py`) |
| Class Diagram | `diagrams/Class_Diagram.png` (đầy đủ) và 3 hình theo phân hệ `Class_View_1/2/3_*.png` |
| Sequence Diagram (mỗi người 3, không trùng) | `diagrams/SD01…SD15_*.png`, mỗi hình ứng với đúng một use case |
| Tệp nộp | `submission/Ass2_GroupX_Topic1/Ass2_GroupX_MemberN.docx` và `submission/Ass2_GroupX_Topic1.zip` |

Thư mục `diagrams/` còn có 3 sơ đồ hoạt động `AD01–AD03`. Chúng không nằm trong bài nộp Assignment 2 mà được dùng cho `docs/06_diagrams_models/activity_diagrams.md`. Các tệp `domain_model.md` và `sequence_diagrams.md` trong cùng thư mục cũng nhúng hình từ `diagrams/`, nên khi chạy lại `build.py` thì tài liệu tự cập nhật theo. Sau đó chạy `python3 scripts/export_docs.py` để tạo lại báo cáo HTML.

## Phân công Sequence Diagram

| Thành viên | Phần | Sequence Diagram |
| :--- | :--- | :--- |
| Member 1 | Tài khoản | SD01 UC01 Đăng ký · SD02 UC08 Đăng nhập · SD03 UC07 Thêm địa chỉ |
| Member 2 | Duyệt hàng và giỏ hàng | SD04 UC02 Tìm kiếm, xem sản phẩm · SD05 UC03 Combo công thức · SD06 UC04 Giỏ hàng, voucher |
| Member 3 | Đặt hàng và xử lý đơn | SD07 UC05 Đặt hàng, thanh toán VNPay · SD08 UC06 Tra cứu, hủy đơn · SD09 UC10 Xử lý đơn |
| Member 4 | Sản phẩm, kho, khuyến mãi | SD10 UC11 Thêm sản phẩm · SD11 UC12 Nhập kho, FEFO · SD12 UC13 Tạo voucher |
| Member 5 | Báo cáo, khách hàng, nhân viên | SD13 UC09 Báo cáo · SD14 UC14 Duyệt khách sỉ · SD15 UC15 Mời nhân viên, phân quyền |

Mỗi tệp `.docx` gồm phần chung của nhóm (Use Case Diagram, Class Diagram) và 3 Sequence Diagram của người đó.

## Sửa và dựng lại

1. Điền tên nhóm và thành viên vào `GROUP`, `MEMBERS` ở đầu `tools/build.py`.
2. Sửa sơ đồ:
   - Sequence Diagram và Class Diagram: sửa tệp `.puml` trong `diagrams/` (cú pháp PlantUML, dán thử được ở plantuml.com).
   - Use Case Diagram: sửa khối dữ liệu đầu `tools/usecase_diagram.py`.
   - 3 hình `Class_View_*` được sinh tự động từ `Class_Diagram.puml`, không sửa tay.
3. Chạy lại trong thư mục `assignment2`:

```bash
python3 tools/build.py --jar /đường/dẫn/plantuml.jar
```

Nếu chỉ đổi tên nhóm hoặc thành viên mà không sửa sơ đồ, chạy `python3 tools/build.py --skip-render`.

Cần cài: Java, `plantuml.jar` (tải ở github.com/plantuml/plantuml/releases), `rsvg-convert` (librsvg) và các gói Python `python-docx`, `Pillow`.
