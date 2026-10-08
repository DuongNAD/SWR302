# 🎨 ĐẶC TẢ HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM SPECIFICATION)
### Dự án: Gia Hoa Phat Bakery Supply (Topic 1 - SWR302)

---

## 1. THÔNG TIN CHUNG
- **Đề tài:** Online Shopping for Baking Ingredients & Equipment System (Gia Hoa Phat).
- **Mục tiêu:** Chuyển đổi mô hình bán lẻ truyền thống sang hệ thống thương mại điện tử chuyên nghiệp, phục vụ thợ làm bánh tại gia (Home bakers) và chủ tiệm bánh (Bakery owners) mua sỉ/lẻ.
- **Tiêu chuẩn áp dụng:** WCAG 2.2 AA (Tương phản ≥ 4.5:1), 10 Heuristics của Jakob Nielsen, Quy tắc Baymard E-commerce UX, Lưới 8pt Grid.

---

## 2. BẢNG MÃ TOKEN THIẾT KẾ (DESIGN TOKENS / FIGMA VARIABLES)

### 2.1 Bảng màu (Color Tokens)
| Token Name | Mã HEX | Vai trò & Ứng dụng | Kiểm thử tương phản WCAG AA |
| :--- | :---: | :--- | :---: |
| `--color-primary` | `#B45309` | Màu caramel chủ đạo (Nút chính, giá tiền, liên kết, CTA) | **5.1:1** trên nền trắng / 5.1:1 chữ trắng (Đạt AA) |
| `--color-primary-hover` | `#92400E` | Trạng thái hover / active của nút bấm | **7.2:1** (Đạt AAA) |
| `--color-primary-tint` | `#FEF3E2` | Nền chip kích hoạt, nền cảnh báo nhẹ, focus ring | Nền tương phản nhẹ |
| `--color-bg` | `#FFFBF5` | Màu nền kem ấm cúng toàn trang web (Canvas background) | Mang lại cảm giác ẩm thực, ngon miệng |
| `--color-surface` | `#FFFFFF` | Nền trắng thẻ sản phẩm, modal, input | Tương phản tốt với nền canvas |
| `--color-text-primary` | `#2B1D14` | Màu chữ chính (Nâu đậm hạt cà phê rang) | **14.8:1** (Vượt chuẩn AAA) |
| `--color-text-secondary` | `#6B5B4E` | Màu chữ phụ, mô tả đơn vị tính, thương hiệu | **6.2:1** (Đạt AA) |
| `--color-border` | `#E8DED3` | Viền thẻ, đường ngăn cách bảng | Độ dày 1px nét mảnh |
| `--color-success` | `#15803D` | Huy hiệu Còn hàng (In Stock), đơn thành công | **4.8:1** |
| `--color-warning` | `#B45309` | Huy hiệu Sắp hết hàng (Low Stock), nhắc nhở | **5.1:1** |
| `--color-error` | `#B91C1C` | Huy hiệu Hết hàng (Out of Stock), báo lỗi form | **5.9:1** |
| `--color-info` | `#1D4ED8` | Thông tin chính sách, gợi ý | **5.6:1** |

### 2.2 Thang Typography (Be Vietnam Pro)
| Cấp bậc (Hierarchy) | Cỡ chữ / Line-height | Trọng số (Weight) | Trường hợp sử dụng |
| :--- | :---: | :---: | :--- |
| **Display** | 56px / 1.1 | 700 Bold | Hero banner trang chủ |
| **Heading 1** | 40px / 1.2 | 700 Bold | Tiêu đề trang chính (Product Detail, Cart, Dashboard) |
| **Heading 2** | 32px / 1.2 | 700 Bold | Tiêu đề từng Section (Bán chạy, Hàng mới về) |
| **Heading 3** | 24px / 1.3 | 600 SemiBold | Tiêu đề khối / Modal dialog / Bộ lọc danh mục |
| **Subheading** | 20px / 1.4 | 600 SemiBold | Giá sản phẩm trên thẻ card, tóm tắt đơn hàng |
| **Body Large** | 16px / 1.5 | 400 Regular / 500 Medium | Nội dung chính, text inputs, nút bấm cơ bản |
| **Body Small** | 14px / 1.5 | 400 Regular / 500 Medium | Thông số kỹ thuật, bảng dữ liệu admin, breadcrumb |
| **Caption / Badge** | 12px / 1.2 | 600 SemiBold | Mã SKU, tem nhãn Còn hàng/Hết hàng, text trợ giúp |

### 2.3 Thước đo Lưới Spacing (8pt Grid) & Bo góc (Radius)
- **Spacing:** `4px` (xxs), `8px` (xs), `16px` (sm), `24px` (md), `32px` (lg), `48px` (xl), `64px` (xxl).
- **Border Radius:**
  - Nút bấm, Ô nhập liệu, Search bar: `8px` (`--radius-sm`)
  - Thẻ sản phẩm, Hộp phân nhóm, Card: `12px` (`--radius-md`)
  - Hộp thoại Modal: `16px` (`--radius-lg`)
  - Chip danh mục, Pill badge trạng thái: `9999px` (`--radius-full`)

### 2.4 Độ nổi & Đổ bóng (Elevation)
- **Level 1 (Subtle):** `0 1px 3px rgba(43,29,20,0.05), 0 1px 2px rgba(43,29,20,0.08)` — Thẻ sản phẩm mặc định.
- **Level 2 (Hover):** `0 4px 12px rgba(43,29,20,0.08), 0 2px 4px rgba(43,29,20,0.04)` — Khi rê chuột vào card, Sticky bar.
- **Level 3 (Floating):** `0 12px 28px rgba(43,29,20,0.12), 0 4px 8px rgba(43,29,20,0.06)` — Toast, Modal.

---

## 3. DANH MỤC THÀNH PHẦN (COMPONENT MATRIX)

1. **Button:** Primary, Secondary, Ghost, Destructive; gồm các trạng thái Default, Hover, Active, Focus ring, Disabled, Loading (Spinner).
2. **Form Controls:** Text, Email, Password (có icon ẩn/hiện mắt), Number stepper, Error inline text, Select dropdown.
3. **Quantity Stepper:** Nút `-`, ô số lượng, nút `+`, giới hạn tối thiểu 1.
4. **Global Search Bar:** Tích hợp bộ chọn danh mục, ô nhập từ khóa, nút tìm kiếm caramel.
5. **Product Card:** Ảnh vuông 1:1, tên 2 dòng, thương hiệu, đơn vị tính/khối lượng, giá niêm yết + giá cũ, badge tồn kho, nút tăng giảm & Thêm giỏ.
6. **Badges:** Còn hàng (Xanh), Sắp hết hàng (Cam), Hết hàng (Đỏ), Giảm giá (Đỏ gạch), Bán chạy (Xanh dương).
7. **Category Chips:** Chip bo tròn có trạng thái Active / Inactive.
8. **Navigation:** Breadcrumbs phân cấp, Pagination chuyển trang, Underline Tabs & Pill Tabs.
9. **Feedback:** Toast Notification có nút Hoàn tác (Undo - Nielsen Heuristic 3), Modal Dialog có lớp phủ làm mờ nền (Backdrop blur).
10. **Data Table (Admin):** Checkbox chọn hàng loạt, SKU, Tên, Danh mục, Tồn kho, Đơn giá, Trạng thái, Cột thao tác.
11. **States:** Skeleton shimmer loader, Empty Cart state, Connection Error state.

---

## 4. TỆP NGUỒN PROTOTYPE HTML
Tệp mã nguồn HTML & CSS của Design System được lưu trực tiếp tại:
- File giao diện: [`prototype/design-system.html`](../../prototype/design-system.html)
- File CSS tokens: [`prototype/design-system.css`](../../prototype/design-system.css)
