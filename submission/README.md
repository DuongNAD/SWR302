# Bộ nộp SRS — BakeCraft (Gia Hòa Phát Bakery Supply)

| Thành phần | Nội dung |
| :--- | :--- |
| `SRS_BakeCraft_v1.0.docx` / `.pdf` | SRS theo template IEEE 830: 2 vai trò (User, Admin), 15 use case, ảnh chụp giao diện |
| `figures/` | Sơ đồ use case (`fig-usecase`) và sơ đồ ngữ cảnh (`fig-context`), PNG nét x2 và SVG |
| `screenshots/` | Ảnh chụp màn hình `client` (1440×900; 2 ảnh mobile 390 px) dùng trong SRS |
| `tools/` | Script dựng lại khi giao diện thay đổi |

## Dựng lại khi giao diện đổi

Cần: `client` đang chạy ở `http://localhost:5173` (`npm run dev` trong `client/`), Chrome, Node ≥ 22, gói npm `docx`, LibreOffice (đổi PDF).

```bash
node tools/ui-check.mjs <thư-mục-ảnh>              # kiểm tra giao diện + chụp lại toàn bộ màn hình
node tools/diagrams.mjs <thư-mục-hình>             # vẽ lại sơ đồ use case và ngữ cảnh
node tools/build-srs.js <ảnh> <hình> <ra.docx>     # dựng SRS (chạy 2 lần với pages.json để điền số trang mục lục)
```
