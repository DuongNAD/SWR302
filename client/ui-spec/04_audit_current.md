# 04 · Hiện trạng của `client/` (đã chạy thử và đo trên app thật, 08/10/2026)

> File tham khảo — giải thích **vì sao** phải làm lại. Antigravity không cần làm gì với file này.

## 1. Đánh giá tóm tắt

**Điểm mạnh (giữ lại):** nghiệp vụ thể hiện rất đủ ý cho Topic 1 (hàng lạnh/HSD, giá sỉ bậc thang, combo công thức, giỏ hàng có thanh miễn phí vận chuyển, 3 vai trò demo, admin có tồn kho/chuỗi lạnh); ảnh sản phẩm đẹp; có `aria-label`, `role="dialog"`, focus ring; màu thương hiệu nâu `#92400E` đạt tương phản tốt.

**Điểm yếu (lý do làm lại):**
1. **Không phải một bộ trang.** Toàn bộ là 1 trang dài + modal (chi tiết SP, đăng nhập, thanh toán, thành công đều là modal) + 1 màn admin. Đề bài đòi *các màn hình chính và chức năng có thể có* → thiếu: trang chi tiết, giỏ hàng, thanh toán, theo dõi đơn, tài khoản, đăng ký/OTP, quản lý sản phẩm/danh mục, báo cáo…
2. **Mang "mùi AI" rõ** (xem mục 3).
3. **Mobile hỏng** (header chiếm 51% màn hình, bộ lọc dài 926px nằm trước sản phẩm đầu tiên).
4. **Ma trận yêu cầu ghi "passed" cho vài tính năng không có thật** (xem mục 4) — rủi ro khi thuyết trình.
5. Lỗi kỹ thuật gốc: class chữ nhỏ không tồn tại → chữ 16px khắp nơi; animation không chạy; font tải thừa.

## 2. Số liệu đo được

| # | Phát hiện | Số đo |
|---|---|---|
| 1 | Header (thanh thông báo + header + danh mục) đều `sticky` | **190px / 900px (21%)** ở 1440px; **420px / 812px (51%)** ở 375px |
| 2 | Ô tìm kiếm desktop bị brand + cụm nút nén | rộng **68px** (placeholder bị cắt còn "Tìm bột") |
| 3 | Mobile: brand wrap từng chữ; nút giỏ sát/tràn mép phải; nút ☰ không mở gì (`isMobileMenuOpen` không có panel) | brand cao 240px |
| 4 | Thẻ sản phẩm | cao **491px** (desktop), **505px** (mobile); tới 3 badge chồng lên ảnh |
| 5 | Mobile: bộ lọc nằm trước sản phẩm | sidebar cao **926px**; SP đầu tiên cách đỉnh catalog **1.132px**; trang dài **14.005px** |
| 6 | Class `text-2xs`, `text-3xs` **không tồn tại** → render 16px | ~**90** dòng / 11 file |
| 7 | `animate-in fade-in …` (cần plugin `tailwindcss-animate` chưa cài) → không animation nào chạy | 8 chỗ |
| 8 | Màu hex cứng trong className | ~**268** dòng / 15 file |
| 9 | `font-mono` cho giá/KPI | 39 chỗ |
| 10 | Font: tải 3 họ, dùng 1. **Rubik không có subset tiếng Việt** (kiểm chứng Google Fonts API) | `index.html:10` |
| 11 | `src/App.css` là file mẫu Vite, không ai import | — |
| 12 | Tương phản: `#9E8E81` trên trắng **3.16:1**, trên nền `#FFFBF5` 3.07:1; `text-stone-400` trên trắng **2.52:1** (không đạt AA 4.5:1). Footer lại ghi "WCAG 2.2 AA Contrast Compliant" | tính từ mã màu |
| 13 | Nút nổi "SWR302 Requirements Matrix" (`fixed bottom-6 left-6`) che nội dung và dòng bản quyền footer | — |
| 14 | Link danh mục trong footer (`#cat-dairy`, `#combo`…) **không có phần tử nào mang id đó** → link chết | — |
| 15 | Lint | 36 cảnh báo, 0 lỗi (28 cái là import không dùng); `tsc` sạch |

## 3. "Mùi AI" của bản hiện tại — `check-ui.sh` đếm được **526 vi phạm**

| Dấu hiệu | Số chỗ | Ví dụ |
|---|---|---|
| Gradient | 6 | hero `bg-linear-to-r from-[#2B1D14] via-[#452D1F] to-[#78350F]` (`App.tsx:207`); logo, nút, header thành công |
| Kính mờ / blur / glow | 14 | `backdrop-blur-*`, vòng tròn mờ `blur-3xl` ở hero (`App.tsx:243`) |
| Bo góc ≥ 2xl | 39 | `rounded-3xl` ở hero, card, modal |
| Bóng nặng | 24 | `shadow-xl/2xl` |
| Hiệu ứng thừa | 18 | `hover:scale-105`, `active:scale-95`, `animate-pulse` |
| Icon Sparkles | 15 | badge hero, nút nổi, modal đăng nhập |
| Chữ IN HOA + giãn chữ | 30 | `uppercase tracking-wider` ở nhãn khắp nơi |
| Chữ < 12px / class không tồn tại | 90 | xem mục 2 #6 |
| Màu hex cứng | 268 | xem mục 2 #8 |
| Cụm quảng cáo | 2 | "Khởi Đầu Mọi Mẻ Bánh Hoàn Hảo…", "100% Hoàn Thiện" |
| Emoji làm icon | 11 | 🔥 `App.tsx:273` · 📍✉️ `Footer.tsx:75-77` · 🍳 `ProductModal.tsx:259` · 👩‍🍳🏢🛠️ `AuthModal.tsx:91,101,111` · ✕ `Header.tsx:124` · ✓ `OrderSuccessModal.tsx:166` · 🎉 `CartDrawer.tsx:115` |
| "SWR302" lọt ra giao diện khách | 9 | nút hero, nút nổi, modal đăng nhập, badge ma trận |

Các mẫu AI điển hình khác (không grep được): Title Case ở tiêu đề/nút; pill "eyebrow" trên mỗi tiêu đề (`Tiện ích độc quyền cho Thợ làm bánh`); lưới 4 thẻ icon giống hệt nhau ở footer; chip pastel có viền cho mọi thứ; thẻ lồng thẻ (`RecipeKitSection`); KPI 4 thẻ có icon màu + số font mono (`AdminDashboard`); số liệu ảo ("12.000 thợ làm bánh").

## 4. Ma trận yêu cầu (`swrRequirements.ts`) vs thực tế trong client

Ma trận ghi **100% "passed"**. Đối chiếu với code hiện có:

| Mã | Ma trận nói | Thực tế |
|---|---|---|
| FR-SRC-01 | Search bar có **bộ chọn danh mục, phím tắt Ctrl+K, gợi ý từ khóa** | **Không có cả ba** — `Header.tsx` chỉ có 1 ô input văn bản |
| FR-CHK-06 | **Quy trình 3 bước**, QR VNPay | **2 bước** ("Bước 1/2"); QR có nhưng lấy ảnh từ `api.qrserver.com` (cần mạng) |
| FR-TRK-07 | Timeline + nút in **phiếu xuất kho / hóa đơn điện tử** | Có timeline 5 mốc và nút in (`window.print`) nhưng chỉ trong modal ngay sau khi đặt; **không có trang tra cứu/theo dõi đơn** về sau; không có phiếu xuất kho/hóa đơn điện tử riêng |
| FR-ADM-08 | **Quản lý danh mục, thêm/sửa sản phẩm**, cập nhật tồn kho, cảnh báo lô hết hạn | Admin chỉ có 3 tab (đơn hàng · kho/cập nhật tồn · chuỗi lạnh & HSD); **không có thêm/sửa sản phẩm, không có quản lý danh mục** |
| NFR-A11Y-01 | "Không dùng emoji làm icon"; tương phản 14.8:1 và 5.1:1 | **Có 11 chỗ dùng emoji**; chữ phụ `#9E8E81` chỉ 3.2:1; con số trong ma trận không khớp phép tính (thực tế 15.8:1 và 7.1:1) |
| FR-AUTH-01, FR-FIL-02, FR-PROD-03, FR-KIT-04, FR-CART-05 | — | Có (dạng modal/drawer/section) |

→ Bộ spec mới **làm cho các mục trên thành thật** (T2, T8, T9, T14) và T16 cập nhật chuỗi minh chứng cho khớp trang mới.

## 5. Mâu thuẫn nghiệp vụ có sẵn (ngoài phạm vi UI — chỉ ghi nhận để nhóm quyết định)

- **Miễn phí vận chuyển:** `CartContext` tính tiến độ "miễn phí vận chuyển ≥ 500.000₫" và `CartDrawer` báo "Bạn đã đủ điều kiện Miễn phí vận chuyển", nhưng `CheckoutModal` luôn cộng phí 25.000₫ (tiêu chuẩn) / 45.000₫ (xe lạnh) (`shippingFee` ở `CheckoutModal.tsx:55`). Người dùng được hứa miễn phí rồi vẫn bị tính phí.
- **Tài liệu `docs/`** (use case, SRS, persona, `ui_flow.md`, domain model…) hiện là **mẫu đề tài đặt lịch dịch vụ**, chưa phải Topic 1. Đề bài yêu cầu SRS cho Topic 1 → nhóm cần viết lại các tài liệu đó; **không thuộc phạm vi giao diện**.
