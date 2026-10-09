# 06 · Đánh giá vòng 2 và việc cần làm tiếp (R1 → R16)

Antigravity đã làm xong vòng 1 (commit `c9cc5ce`: 40 màn hình, T0 → T17). Tài liệu này là kết quả **chạy thử và đo lại** bản đó (08–09/10/2026) bằng `check-ui.sh`, `check-links.mjs`, `audit-runtime.mjs` (Chrome headless, 45 route × desktop + mobile), `npm run build`, `npm run lint` và xem trực tiếp từng trang — rồi biến thành **việc cần làm tiếp**.

> **Phạm vi không đổi: CHỈ GIAO DIỆN** — phần hiển thị, các trang, hiệu ứng chuyển trang. Không backend, không bảo mật, dữ liệu hard-code, không đổi công thức nghiệp vụ.
> **Cách dùng:** nhóm đọc mục 1 → 4 để hiểu vì sao. Antigravity làm **R1 → R16 theo thứ tự** (mục 6), sau mỗi task chạy 4 cổng kiểm tra (mục 8).

---

## 1. Kết luận

**Vòng 1 làm đúng phần lớn, nhưng chưa "tự nhiên như web hiện đại".**

- **Đạt:** đủ 40 màn hình, mọi route vào được (45/45), hiệu ứng chuyển trang đã gắn ở cả 5 layout, bố cục header / sidebar / bảng giá sỉ / stepper thanh toán / timeline đơn trông đúng kiểu web bán hàng. Không còn gradient, kính mờ, emoji, icon lấp lánh, bo góc lớn, bóng nặng (13/13 mục kiểm tra vòng 1 đều ✓).
- **Chưa đạt:** nhìn là biết đây là bản nháp dev — **nhãn nội bộ lộ ra**, **ảnh sai nội dung** (mèo, gấu, sân khấu trên trang bán nguyên liệu), **trang chủ lặp nhịp**, **lề không thẳng hàng**, **điều khiển lẫn lộn**, **mobile tràn ngang**, **câu chữ hứa hẹn quá tay**. Đây không phải lỗi bố cục lớn mà là hàng chục chi tiết nhỏ cộng lại — và chính chúng phân biệt "prototype" với "web thật".
- **Cách sửa:** 16 task ngắn (R1 → R16), mỗi task có số đo kiểm được bằng lệnh. Nặng nhất là **R4 (ảnh)** — được phép tự tạo ảnh hoặc tìm ảnh trên mạng (`07_image_guide.md`).

## 2. Giữ nguyên — đừng "sửa" những thứ này

Token màu và chữ (`#92400E`, nền ấm, Be Vietnam Pro) · hiệu ứng chuyển trang `.page-enter` · bảng giá sỉ bậc thang và dòng được tô theo số lượng ở trang chi tiết · stepper 3 bước ở thanh toán · timeline theo dõi đơn · sidebar và dải số liệu một khung ở admin · biểu đồ một màu · các trạng thái trống / lỗi · khối chọn vai trò demo (chỉ đổi hình thức, xem R2).

## 3. Hiện trạng đo được (baseline)

| Cổng | Lệnh (chạy trong `client/`) | Hiện tại | Mục tiêu |
|---|---|---|---|
| Dấu hiệu "AI" & lỗi token | `bash ui-spec/check-ui.sh` | **189 vi phạm** (13 mục vòng 1 ✓) | **0** |
| Link nội bộ chết | `node ui-spec/check-links.mjs` | **4** | **0** |
| Ảnh | `node ui-spec/check-images.mjs` | **37 lỗi** (32 URL ngoài, 5 thiếu) | **0** |
| Chạy thật, 45 route × desktop + mobile | `node ui-spec/audit-runtime.mjs --viewports=desktop,mobile --all` | **12 loại lỗi, 3 loại cảnh báo** | **0 lỗi, 0 cảnh báo** |
| Lint | `npm run lint` | 0 lỗi, **8 cảnh báo** | 0 cảnh báo |
| Build | `npm run build` | pass; **một** chunk JS 1.424 MB (gzip 384 KB), có cảnh báo "chunks larger than 500 kB" | pass, không còn cảnh báo chunk lớn |

`check-ui.sh` = 189 gồm: SCR-xx 13 · IN HOA 11 · dấu "!" 35 · viết hoa sau "&" 52 · `<select>` gốc 15 · ảnh URL ngoài 32 · enum thô 4 · `container mx-auto` 16 · tuyên bố sai 7 · link chết 4.

## 4. Vì sao vẫn chưa tự nhiên

Mỗi điểm dưới đây kèm nơi thấy được và task sửa.

1. **Dấu vết dev lộ ra (R1, R2).** Dòng mono IN HOA kiểu `SCR-22 · HỆ THỐNG CỬA HÀNG` trên đầu 13 trang; chip đen *Demo: Khách lẻ* cố định ở góc dưới trái, đè lên chữ trên mobile và lên chân sidebar admin; trang quản trị hiện tên **khách** "Trần Mai Anh" ở góc phải; bảng đơn hiện chữ `packing`, `pending` nguyên gốc; câu tiếng Việt lẫn "(Free)", "Chilled Express".
2. **Ảnh sai nội dung (R4).** Socola Callebaut là **con mèo nằm trên chăn**; danh mục Thiết bị là **sân khấu**; danh mục Bao bì là **con gấu**; cân điện tử là **sân khấu**; khuôn bánh mì là **nồi gang**; phới dẹt là **đĩa cơm chiên**; máy đánh trứng **ảnh chết**. Ổ bánh mì lặp ở banner, danh mục bột, thẻ bột mì. Web bán nguyên liệu thật dùng **một bộ ảnh nền sạch, cùng ánh sáng** — đây là yếu tố quyết định "độ thật" nhiều nhất.
3. **Trang chủ lặp nhịp (R6).** Sáu khối cùng một khuôn "tiêu đề + lưới thẻ"; mục *Hàng mới về* lặp 3/5 sản phẩm của mục *Bán chạy*; tiêu đề viết kiểu "Hàng mới về & Đánh giá cao".
4. **Header ba tầng (R5).** Thanh tiện ích 35px + header 64px + thanh danh mục 40px ≈ 140px; chữ danh mục tự xuống 2 dòng ("Bơ sữa & Phô / mai"); ô chọn danh mục trong tìm kiếm bị cắt thành "Tất cả danh …".
5. **Lề không thẳng hàng (R5).** Trang chủ, danh sách, header, footer dùng khung `wrap` (1200px → lề trái 144px ở màn 1440); **15 file** (14 trang cửa hàng và form sản phẩm ở admin) dùng `container mx-auto px-4` (lề trái 96px). Nhảy 48px ngay ở breadcrumb khi chuyển trang — mắt thấy "lệch" dù không chỉ ra được chỗ nào.
6. **Điều khiển lẫn lộn (R7).** 15 thẻ `<select>` gốc của trình duyệt đứng cạnh ô nhập và nút đã retheme: viền, mũi tên, chiều cao khác nhau.
7. **Câu chữ hứa hẹn (R1).** "Giao dịch bảo mật chuẩn PCI-DSS 256-bit" (không có nghĩa), "Thanh toán an toàn SSL", "Đền bù 100%", "100% sản phẩm có tem phụ", "Cam kết chất lượng…" — lặp ở 11 chỗ. Nghe như văn mẫu sinh tự động; web thật hiếm viết vậy, và nếu viết thì có điều khoản cụ thể.
8. **Viết hoa kiểu Title Case (R1).** 52 chỗ như "Vận chuyển & Chuỗi lạnh", "Nhân viên & Phân quyền", "Thanh toán & Xác nhận" — trái quy tắc sentence case ở `01_design_rules.md`.
9. **Mobile (R9).** 7 trang tràn ngang (tới +55px) — chi tiết sản phẩm, giỏ hàng (nút xóa nằm ngoài khung), hỗ trợ, đơn hàng của tôi; 17 trang có nhiều vùng bấm < 36px; nhãn "Đang vận chuyển" bị cắt chữ; mã đơn xuống dòng `#GHP-` / `889120`; dòng giá sỉ bị cắt "Từ 66.000₫ khi mua …" ở lưới 2 cột.
10. **Admin (R8, R12).** Bảng sản phẩm tràn khung: cột HSD bị cắt, **không thấy cột trạng thái và nút thao tác**; cột *Tồn kho* cách xa cột giá. Ba đơn "cần xử lý gấp" đều của cùng một khách dù có 12 khách trong dữ liệu.
11. **Trang chi tiết sản phẩm (R10).** Lỗi console `<a>` lồng `<a>`; một ảnh nhỏ duy nhất trong dải thumbnail; bảng giá ghi "Từ 1 Thỏi 227g"; mục *Sản phẩm cùng danh mục* chỉ 2 thẻ dồn bên trái; cột phải có 6 khung viền chồng nhau.
12. **Kỹ thuật (R11, R13, R14).** `/thanh-toan` không có `<h1>`; 36 trang có ô nhập không tên truy cập (ô tìm kiếm ở header, ô giá "Từ"/"Đến"); một bundle 1.4 MB; 8 cảnh báo lint.

## 5. Danh sách lỗi

Mức: **Cao** = thấy ngay, làm hỏng cảm giác · **Trung** = thấy khi dùng · **Thấp** = chi tiết.

| Mã | Mức | Lỗi | Bằng chứng | Task |
|---|---|---|---|---|
| L01 | Cao | Mã màn hình `SCR-xx` kèm nhãn IN HOA lộ ra giao diện | 13 chỗ, 12 route: `admin/{Dashboard:79, Orders:231, Products:227, Categories:149, Inventory:348}`, `account/{Overview:31, Business:43}`, `store/{Contact:72, NotFound:22, Stores:57, About:65, Support:73, Wholesale:77}` | R1 |
| L02 | Trung | Chữ IN HOA gõ cứng ≥ 3 từ | 11 chỗ, 9 route (cùng các dòng trên) | R1 |
| L03 | Trung | Viết hoa chữ đầu sau dấu `&` (Title Case) | 52 chỗ, 22 file — nhiều nhất: `AccountBusinessPage` 6, `ShippingPage` 4, `ReportsPage` 4, `InventoryPage` 4, `CategoryMenu` 4 | R1 |
| L04 | Trung | Giá trị enum thô hiện ra (`packing`, `pending`, `vnpay`…) | `admin/DashboardPage:380`, `account/AccountOrdersPage:127`, `account/AccountOverviewPage:125`, `admin/OrdersPage:177` — 3 route | R1 |
| L05 | Trung | Từ tiếng Anh lẫn trong câu | `StoresPage:121` "(Free)" · `CheckoutPage:588` "Chilled Express" · `OrderTrackingPage:195` "Chilled Express" · `admin/ShippingPage:288` "IoT Telemetry" | R1 |
| L06 | Thấp | Dấu "!" trong toast và nhãn | 35 chỗ (vd. `RegisterPage:47,61,70`, `LoginPage:29`, `admin/SettingsPage:51`) | R1 |
| L07 | Trung | Tuyên bố sai / lời hứa chung chung, lặp | `CheckoutPage:924` PCI-DSS · `CheckoutLayout:20` SSL · `SupportPage:110` · `WholesalePage:127` · `ProductDetailPage:491,494` · `AboutPage:111` · cam kết đền bù / hoàn tiền / "không bị chảy" lặp ở `CheckoutPage:594`, `OrderSummary:113`, `SupportPage:46,90`, `OrderTrackingPage:289` | R1 |
| L08 | Cao | Chip *Demo* cố định che nội dung; link `/legacy` chết | `DemoWidget.tsx:39` (`fixed bottom-20 sm:bottom-6 left-4`), `:124` | R2 |
| L09 | Trung | Trang quản trị hiện tên khách | `AdminLayout.tsx:175` đọc `currentUser?.name` | R2 |
| L10 | Cao | 4 link dẫn tới 404 | `DemoWidget:124` `/legacy` · `NotFoundPage:44`, `ProductDetailPage:157,662` `/danh-muc/${slug}` | R3 |
| L11 | Cao | Ảnh sai nội dung (6 sản phẩm, 4 danh mục) | `07_image_guide.md` mục 2 | R4 |
| L12 | Cao | Ảnh chết `prod-14` hiện chữ alt | `net::ERR_BLOCKED_BY_ORB` ở `/san-pham/prod-14`, `/admin/san-pham`, `/admin/san-pham/moi` | R4 |
| L13 | Trung | Ảnh dùng lặp | ổ bánh mì: banner + `cat-flour` + `prod-04`; `prod-15/16` = ảnh `bundle-*`; `cat-dairy` = `prod-01` | R4 |
| L14 | Trung | 32 chỗ nạp ảnh Unsplash (cần mạng, nội dung không bảo đảm) | `check-ui.sh`, `check-images.mjs` | R4 |
| L15 | Thấp | Ảnh không cùng phong cách (nền, ánh sáng lẫn lộn) | `/`, `/san-pham` | R4 |
| L16 | Cao | Lề trái nội dung lệch header 48px | audit: 14 route desktop (breadcrumb 96px ≠ logo 144px); `container mx-auto` ở 14 file trang cửa hàng + `admin/ProductFormPage` (16 chỗ) | R5 |
| L17 | Trung | Header ba tầng ~140px, nav xuống 2 dòng, ô chọn danh mục bị cắt | `SiteHeader.tsx`, `SearchBox.tsx:89`, `CategoryMenu.tsx` | R5 |
| L18 | Trung | Trang chủ lặp nhịp, *Hàng mới về* trùng *Bán chạy* | `HomePage.tsx` | R6 |
| L19 | Trung | 15 `<select>` gốc | `ProductsPage:251,264` · `ProductFormPage:178` · `OrdersPage:260` · `StaffPage:263,436,450` · `InventoryPage:435` · `PromotionsPage:280,355` · `CheckoutPage:345` · `ContactPage:199` · `WholesalePage:249` · `ProductListPage:236` · `SearchBox:89` | R7 |
| L20 | Trung | Bảng admin tràn khung, mất cột cuối | `/admin/san-pham` (và kiểm các bảng admin còn lại) | R8 |
| L21 | Cao | Tràn ngang mobile (tới +55px) | 7 route: `/san-pham/prod-01,14,16`, `/gio-hang`, `/ho-tro`, `/tai-khoan/don-hang`, `/dev/style-guide` | R9 |
| L22 | Trung | Mobile: vùng bấm < 36px (17 route), nhãn bị cắt, mã đơn xuống dòng, dòng giá sỉ bị cắt | audit + ảnh chụp 375px | R9 |
| L23 | Trung | Trang chi tiết: `<a>` lồng `<a>` + prop lạ (`BreadcrumbLink` nhận `asChild` nhưng không dùng `Slot`), 1 thumbnail, "Từ 1 Thỏi 227g", 2 thẻ liên quan lệch trái | `components/ui/breadcrumb.tsx:40-54`, `ProductDetailPage:148,156` | R10 |
| L24 | Trung | `/thanh-toan` không có `<h1>`; 36 route có ô nhập không tên truy cập | audit (vd. `input[placeholder="Tìm bột mì, bơ lạt, soco…"]`, `"Từ"`, `"Đến"`) | R11 |
| L25 | Thấp | Dữ liệu admin đơn điệu | "Đơn cần xử lý gấp": 3/3 đơn của Trần Mai Anh dù `mocks/customers.ts` có 12 khách | R12 |
| L26 | Thấp | Một bundle JS 1.424 MB | `router.tsx` import tĩnh mọi trang, import qua barrel `@/pages/*` | R13 |
| L27 | Thấp | 8 cảnh báo lint | `ui/{button:59, sidebar:13, badge:46, price:12}`, `context/{Auth:128, Toast:67, Cart:298}`, `ProductDetailPage:74` | R14 |

## 6. Việc cần làm

**Thứ tự:** R1 → R2 → R3 (nhanh, sửa chữ và link) → R5 (lưới) → **R4 (ảnh, nặng nhất)** → R6 → R7 → R8 → R9 → R10 → R11 → R12 → R13 → R14 → R15 → R16. Sau mỗi task chạy 4 cổng ở mục 8; số vi phạm chỉ được giảm.

### R1 — Dọn dấu vết dev và câu chữ `[P0 · nhanh]` — L01 → L07
1. **Xóa** 13 nhãn `SCR-xx · …` (danh sách ở L01) — xóa nguyên thẻ `<span>`, không thay bằng nhãn khác.
2. Tạo `src/lib/labels.ts`: `ORDER_STATUS_LABEL`, `PAYMENT_LABEL`, `SHIPPING_LABEL`, `TRIP_STATUS_LABEL` (Việt hóa mọi giá trị enum); dùng ở 4 chỗ ở L04; `Tag` đổi màu theo trạng thái.
3. Sửa 4 chỗ tiếng Anh ở L05: "miễn phí", "Giao xe lạnh", "cảm biến IoT".
4. Bỏ dấu "!" ở 35 chỗ (giọng trung tính: "Đặt hàng thành công", "Đã lưu thay đổi").
5. **Đổi mọi chữ `A & B` thành `A và b`** theo sentence case ở 52 chỗ (L03): "Sản phẩm và kho", "Vận chuyển và chuỗi lạnh", "Thanh toán và xác nhận", "Nhân viên và phân quyền". Chỗ nào chữ lấy từ tên danh mục trong `data/` thì **hiển thị lại từ dữ liệu** thay vì gõ lại (vd. `ReportsPage`, `AccountBusinessPage`, `CategoriesPage`).
6. Gỡ các tuyên bố ở L07: xóa dòng "PCI-DSS 256-bit" và "Thanh toán an toàn SSL"; xóa "100% sản phẩm…", "Cam kết chất lượng…". Chính sách đền bù/hoàn tiền chỉ **giữ một chỗ** (trang Hỗ trợ → *Đổi trả và hoàn tiền*) và viết đúng điều kiện; gỡ lặp lại ở thanh toán, tóm tắt đơn, theo dõi đơn, giỏ hàng. Thay bằng thông tin kiểm chứng được ("Hạn dùng ghi trên từng lô", "Giao xe lạnh 2–8°C").

**Nghiệm thu:** `check-ui.sh` các mục SCR-xx, IN HOA, "!", viết hoa sau "&", enum, tuyên bố sai đều ✓ · audit không còn lỗi *SCR*, *IN HOA*, *enum*, *tiếng Anh*, *dấu "!"* · `grep -rniE "PCI|hoàn tiền 100|đền bù 100" src/pages src/components src/layouts` chỉ còn tối đa 1 chỗ (trang Hỗ trợ).

### R2 — DemoWidget và người dùng ở trang quản trị `[P0 · nhanh]` — L08, L09
1. `DemoWidget`: thu thành **nút tròn 40px** (icon `SlidersHorizontal`) ở góc dưới **phải** (desktop); mở popover chọn vai trò; **không chip chữ thường trực**. Mobile: ẩn mặc định, chỉ mở khi URL có `?demo=1`. Không che thanh dính đáy (giá + *Thêm vào giỏ*) hay chân sidebar admin. **Bỏ link `/legacy`**; thêm link `/dev/use-cases` nếu làm T18.
2. `AdminLayout`: góc phải luôn hiện **người dùng quản trị cố định** ("Nguyễn Anh Dương · Quản trị viên", một hằng ngay trong `AdminLayout` — `DEMO_USERS` ở `AuthContext` không được export) — không đọc `currentUser`.

**Nghiệm thu:** ảnh chụp 375px các trang chi tiết sản phẩm, giỏ hàng, theo dõi đơn: không có chip đè chữ · `/admin` hiện "Nguyễn Anh Dương" dù đang chọn vai khách lẻ · `/legacy` không còn trong mã nguồn.

### R3 — Sửa link chết `[P0 · nhanh]` — L10
`/danh-muc/${slug}` → `/san-pham?danh-muc=${category.id}` ở `NotFoundPage:44`, `ProductDetailPage:157,662`. `DemoWidget:124` đã xử lý ở R2.

**Nghiệm thu:** `node ui-spec/check-links.mjs` → "không có link chết" · `node ui-spec/audit-runtime.mjs --links` không báo LINK CHẾT.

### R4 — Ảnh `[P0 · nặng nhất]` — L11 → L15
Làm đúng `07_image_guide.md`: tạo hoặc tìm **28 ảnh** + `placeholder.svg`, đặt trong `public/img/{products,categories,combos,banners}/`, sửa `imageUrl` (ngoại lệ duy nhất cho luật "không sửa `data/`"), tạo `ProductImage` có ảnh dự phòng, ghi nguồn vào `THIRD_PARTY.md`.

**Nghiệm thu:** `node ui-spec/check-images.mjs` → 0 lỗi · `check-ui.sh` mục "Ảnh nạp từ URL ngoài" ✓ · audit không còn "ảnh hỏng", không còn net-fail · duyệt bằng mắt theo checklist cuối `07_image_guide.md` (không còn mèo, gấu, sân khấu, cơm chiên; cả lưới nhìn như một bộ ảnh).

### R5 — Lưới thống nhất và header gọn `[P0]` — L16, L17
1. **Một khung duy nhất:** thay `container mx-auto px-4 …` bằng `wrap` ở 14 file trang cửa hàng (`About, Cart, Checkout, ComboDetail, ComboList, Contact, NotFound, OrderLookup, OrderSuccess, OrderTracking, ProductDetail, Stores, Support, Wholesale`); `admin/ProductFormPage` bỏ `container mx-auto`, dùng bố cục của `AdminLayout`. Header, breadcrumb, nội dung, footer, thanh toán cùng một lề trái.
2. **Header hai tầng:** tầng 1 = logo · tìm kiếm · yêu thích · tài khoản · giỏ; tầng 2 = thanh danh mục **một dòng** (`whitespace-nowrap`, thiếu chỗ thì cuộn ngang hoặc gom vào "Xem thêm"). Thanh tiện ích (hotline, giờ mở cửa, hỗ trợ) gộp xuống footer hoặc thu ≤ 32px. Tổng chiều cao desktop **≤ 112px**.
3. **Tìm kiếm:** ô chọn danh mục không còn cắt chữ (đủ rộng hoặc bỏ); gợi ý phím tắt "Ctrl K" thành thẻ `kbd` nhỏ bên phải ô, không nằm trong placeholder.

**Nghiệm thu:** `check-ui.sh` mục "container mx-auto" ✓ · audit không còn cảnh báo "lề trái nội dung lệch" (14 route) · ảnh chụp 1440 / 1024 / 768: thanh danh mục không xuống dòng, header ≤ 112px.

### R6 — Trang chủ có nhịp `[P0]` — L18
1. Thứ tự: Banner → Dải dịch vụ → Danh mục (8) → Bán chạy (5) → Combo (3) → Khối giá sỉ (có bảng giá thật) → **Mới về (5, không trùng *Bán chạy*)** → Cửa hàng.
2. *Mới về* chỉ lấy sản phẩm **chưa xuất hiện ở *Bán chạy***; không đủ thì bỏ khối. Đổi tiêu đề thành "Mới về" (sentence case, bỏ "& Đánh giá cao").
3. Mọi khối dùng cùng một kiểu tiêu đề: `h2` + một dòng mô tả + link "Xem tất cả"; khoảng cách dọc giữa các khối bằng nhau (96px desktop, 64px mobile).
4. Banner dùng `hero.webp` mới (`07_image_guide.md`), không trùng ảnh danh mục.

**Nghiệm thu:** không sản phẩm nào xuất hiện ở hai khối của trang chủ · ảnh chụp 1440 và 375 đã xem lại (không khối nào giống hệt khối trên nó về hình thức mà khác nội dung vô lý).

### R7 — Thay `<select>` gốc `[P1]` — L19
Thay 15 thẻ `<select>` bằng shadcn `Select` (đã có `components/ui/select`), cùng chiều cao và viền với `Input` (40px; 44px trên mobile). Giữ giá trị và hành vi hiện có.

**Nghiệm thu:** `check-ui.sh` mục `<select>` ✓.

### R8 — Bảng admin không tràn `[P1]` — L20
1. Một thành phần bọc bảng dùng chung: khung `overflow-x-auto`, tiêu đề dính, **cột thao tác (⋯) luôn thấy** (dính bên phải), tên dài `truncate` kèm tooltip.
2. Chia lại độ rộng bảng sản phẩm: Ảnh 56 · Tên + SKU (co giãn) · Danh mục 160 · Giá 110 · Tồn 140 · Bảo quản 110 · HSD 110 · Trạng thái 100 · ⋯ 48. Áp dụng tương tự cho bảng Đơn hàng, Tồn kho, Khách hàng, Khuyến mãi, Vận chuyển, Nhân viên.

**Nghiệm thu:** ở 1440 và 1280px mọi bảng admin thấy **đủ cột, kể cả thao tác** · ở 1024 / 768px bảng cuộn ngang **trong khung**, trang không tràn (`scrollWidth ≤ innerWidth`).

### R9 — Mobile `[P0]` — L21, L22
1. Sửa tràn ngang 7 route ở L21. Cách tìm phần tử gây tràn (dán vào console ở 375px): `[...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth + 1)` rồi sửa `min-w-0`, `overflow-x-auto` hoặc `min-w-*` sai chỗ. Giỏ hàng: nút xóa phải nằm trong khung.
2. **Vùng bấm ≥ 40px** cho nút và ô nhập chính (nút icon 40×40, ô nhập 44px).
3. Nhãn trạng thái không cắt chữ; mã đơn `whitespace-nowrap`; dòng giá sỉ ở thẻ sản phẩm 2 cột rút gọn thành "Từ 66.000₫ (mua 40+)" một dòng.
4. Thanh dính đáy trang chi tiết (giá + *Thêm vào giỏ*) không bị che (R2).

**Nghiệm thu:** audit mobile: **0** "TRÀN NGANG", **0** "nhiều vùng bấm < 36px" · ảnh chụp 375px các trang đã nêu.

### R10 — Trang chi tiết sản phẩm `[P1]` — L23
1. `components/ui/breadcrumb.tsx`: `BreadcrumbLink` dùng `Slot` của Radix khi `asChild` (không đẩy prop `asChild` xuống thẻ `<a>`, không lồng `<a>` trong `<a>`).
2. Ẩn dải thumbnail khi chỉ có một ảnh.
3. Bảng giá bậc thang: cột số lượng ghi khoảng ("1–9 thỏi", "10–39 thỏi", "từ 40 thỏi"); dòng đầu "–0%" → "Giá lẻ".
4. *Sản phẩm cùng danh mục*: nếu < 4 thẻ thì bổ sung từ danh mục khác cùng điều kiện bảo quản cho đủ 4, đổi tiêu đề thành "Có thể bạn cần".
5. Cột phải: gộp bớt khung — tối đa 3 khối viền (giá + bảng bậc thang · ghi chú bảo quản · giao hàng và cửa hàng); phần còn lại ngăn bằng đường kẻ.

**Nghiệm thu:** audit `/san-pham/prod-01` không còn `console.error` · ảnh chụp 1440 / 375.

### R11 — Truy cập `[P1]` — L24
1. `/thanh-toan` có đúng **một** `<h1>` ("Thanh toán" — được dùng `sr-only`).
2. Mọi ô nhập và nút icon có `aria-label` hoặc `<label>`: ô tìm kiếm ở header, ô lọc giá "Từ"/"Đến", các nút icon ♡, giỏ, đóng… Xem danh sách từng route bằng `node ui-spec/audit-runtime.mjs --routes=<route> --all`.
3. Focus ring nhìn thấy trên mọi điều khiển; Tab đi hết trang theo thứ tự hợp lý.

**Nghiệm thu:** audit: 0 lỗi "số `<h1>`", 0 cảnh báo "không có tên truy cập".

### R12 — Dữ liệu mock trông thật `[P1]` — L25
Trong `src/mocks/` và trang admin: "Đơn cần xử lý gấp" và các danh sách admin lấy đơn của **nhiều khách khác nhau** (≥ 6 tên khác nhau trên danh sách đơn); đơn của Trần Mai Anh chỉ nổi bật ở trang tài khoản của chị. Số liệu cùng một đối tượng phải giống nhau giữa các trang (tổng đơn, doanh thu, tên khách). Không đổi công thức.

**Nghiệm thu:** mở `/admin`, `/admin/don-hang`, `/admin/khach-hang` — danh sách không lặp một khách; số chủ chốt khớp giữa các trang.

### R13 — Tải nhanh hơn `[P2]` — L26
`router.tsx`: nạp trang bằng `React.lazy(() => import('@/pages/store/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))` (import **trực tiếp từ file trang**, không qua barrel `@/pages/*`), bọc `Suspense fallback={null}` bên trong `PageTransition` để hiệu ứng chuyển trang không đổi. Giữ layout và `HomePage` nạp tĩnh. Trang admin (nặng vì Recharts, TanStack Table) thành chunk riêng.

**Nghiệm thu:** `npm run build` không còn cảnh báo "chunks larger than 500 kB"; chuyển trang vẫn hiện dần 220ms, header/footer vẫn đứng yên, không nháy trắng.

### R14 — Lint sạch `[P2]` — L27
Cảnh báo `react(only-export-components)` ở `components/ui/*` và `context/*`: thêm `overrides` cho hai thư mục này vào `.oxlintrc.json` (vd. `{ "files": ["src/components/ui/**", "src/context/**"], "rules": { "react/only-export-components": "off" } }` — cách quen thuộc của shadcn) hoặc tách hằng/hook ra file riêng. Cảnh báo `preserve-manual-memoization` ở `ProductDetailPage:74`: sửa theo gợi ý hoặc bỏ memo thủ công.

**Nghiệm thu:** `npm run lint` = 0 cảnh báo · `npm run build` pass.

### R15 — Rà soát cuối bằng mắt `[P0]`
Chạy `node ui-spec/audit-runtime.mjs --viewports=desktop,tablet,mobile --links --shots=ui-spec/screenshots/round2`, rồi xem **từng ảnh** của 14 trang: `/`, `/san-pham`, `/san-pham/prod-01`, `/combo`, `/gio-hang`, `/thanh-toan`, `/don-hang/GHP-889120`, `/dang-nhap`, `/tai-khoan`, `/admin`, `/admin/don-hang`, `/admin/san-pham`, `/admin/ton-kho`, `/cua-hang` ở 1440 / 768 / 375. Với mỗi trang trả lời:

- [ ] Lề trái header, nội dung, footer thẳng hàng?
- [ ] Không còn chữ kỹ thuật (SCR, enum, tiếng Anh) hay chữ viết hoa kiểu Title Case?
- [ ] Ảnh khớp nhãn và cùng một bộ?
- [ ] Không cuộn ngang ở 375px, không chữ bị cắt hay đè lên nhau?
- [ ] Select, Input, Button cùng chiều cao và viền?
- [ ] Chuyển trang chạy ở cả 5 layout; header/footer/sidebar đứng yên?
- [ ] Bàn phím: Tab đi hết trang, focus nhìn thấy?
- [ ] Admin: mọi bảng đủ cột, thấy nút thao tác ở 1280px?
- [ ] Trang chủ không khối nào lặp?

Chỗ nào "không" thì sửa rồi chụp lại. Ghi kết quả vào báo cáo cuối.

### R16 — Tài liệu và đóng gói `[P0]`
1. `THIRD_PARTY.md`: thêm mục **Ảnh** (mỗi file: cách tạo/nguồn, tác giả, giấy phép, URL hoặc công cụ + prompt).
2. Cập nhật ma trận yêu cầu (`verifiedInClient`) nếu trang đổi đường dẫn.
3. Chạy đủ 4 cổng ở mục 8 và dán kết quả vào báo cáo cuối.
4. *(Tùy chọn)* **T18** — trang `/dev/use-cases` (xem `03_tasks.md`), chỉ làm khi xong R1 → R15.

## 7. Quy tắc vòng 2 (thêm và đổi so với `README.md`)

1. **Ảnh được tự tạo hoặc tìm trên mạng** (`07_image_guide.md`) — thay cho luật "ảnh Unsplash trong `data/` giữ nguyên URL". Ngoại lệ duy nhất cho luật "không sửa `src/data/*`" là trường `imageUrl`.
2. **Không thêm thư viện mới.** Select dùng shadcn đã có; lazy-load dùng `React.lazy` có sẵn; nén ảnh dùng công cụ ngoài ứng dụng.
3. **Câu chữ trung tính, kiểm chứng được:** không "cam kết", không con số bịa, không dấu "!", sentence case, dùng "và" thay "&" trong tiêu đề.
4. **Không đổi công thức nghiệp vụ** và không xóa trang nào. Mâu thuẫn cũ (giỏ hàng hứa miễn phí vận chuyển ≥ 500.000₫ nhưng thanh toán vẫn cộng phí) **vẫn chỉ ghi nhận**, không sửa.
5. **Số vi phạm chỉ được giảm** sau mỗi task; không đưa lỗi cũ trở lại (ví dụ viết lại `container mx-auto`).
6. Không commit, không push.

## 8. Bốn cổng kiểm tra

Chạy trong `client/` sau **mỗi** task (dev server đang chạy ở `npm run dev` cho cổng 3):

```bash
bash ui-spec/check-ui.sh        # tĩnh: dấu hiệu AI, nhãn dev, lưới, select, ảnh ngoài, link  — mục tiêu 0
node ui-spec/check-links.mjs    # link nội bộ tới route không tồn tại                          — mục tiêu 0
node ui-spec/check-images.mjs   # ảnh cục bộ, kích thước, không trùng, không mồ côi            — mục tiêu 0
node ui-spec/audit-runtime.mjs --viewports=desktop,mobile --all   # chạy thật 45 route          — mục tiêu 0 lỗi, 0 cảnh báo
npm run build && npm run lint   # build pass, lint 0 cảnh báo
```

`audit-runtime.mjs` cần Chrome và dev server; thêm `--viewports=desktop,tablet,mobile --links` ở bước R15; `--routes=<chuỗi>` để chỉ chạy các route chứa chuỗi đó; `--shots=<thư mục>` để lưu ảnh chụp.

## 9. Prompt dán vào Antigravity (vòng 2)

```markdown
Đóng vai trò Senior Frontend Engineer kiêm UI/UX Designer. Dự án: thư mục `client/` — prototype website
"Gia Hòa Phát Bakery Supply" (Topic 1, môn SWR302). Vòng 1 đã xong (commit c9cc5ce). Đây là VÒNG 2: sửa các
lỗi còn lại để giao diện trông TỰ NHIÊN như một website bán hàng hiện đại, không còn "mùi dev" hay "mùi AI".

Đọc lần lượt: `client/ui-spec/README.md` → `06_review_round2.md` (đây là việc cần làm) → `07_image_guide.md` (R4) →
`01_design_rules.md` và `02_pages.md` (tham chiếu khi cần). `05_use_case_diagram.md` chỉ là tài liệu tham chiếu,
không phải việc cần làm (trừ T18 tùy chọn).

Làm LẦN LƯỢT R1 → R16 trong `06_review_round2.md` mục 6. Sau MỖI task chạy 4 cổng ở mục 8:
`bash ui-spec/check-ui.sh`, `node ui-spec/check-links.mjs`, `node ui-spec/check-images.mjs`,
`node ui-spec/audit-runtime.mjs --viewports=desktop,mobile --all`, rồi `npm run build && npm run lint`.
Số vi phạm chỉ được giảm. Chỉ sang task kế tiếp khi mục "Nghiệm thu" của task hiện tại đã đạt.

Ràng buộc cứng:
- CHỈ làm giao diện. Không backend, không bảo mật, dữ liệu hard-code. KHÔNG đổi công thức nghiệp vụ trong
  `src/context/*`, KHÔNG xóa trang, KHÔNG thêm thư viện mới. Chỉ được sửa trường `imageUrl` trong `src/data/*`.
- Câu chữ trung tính, kiểm chứng được: không "cam kết", không con số bịa, không dấu "!", sentence case, dùng "và" thay "&".
- ẢNH (R4): bạn ĐƯỢC PHÉP tự tạo ảnh bằng công cụ tạo ảnh hoặc tìm ảnh miễn phí trên mạng (Unsplash, Pexels, Pixabay,
  Wikimedia Commons) rồi TẢI VỀ `client/public/img/`. Ảnh phải đúng nhãn, cùng một phong cách, không chữ/logo/người,
  không dùng URL ngoài khi chạy. Ghi nguồn hoặc công cụ + prompt vào `client/THIRD_PARTY.md`. Làm đúng `07_image_guide.md`.
- Không commit, không push.

Khi xong, báo cáo ngắn gọn: task đã xong / bỏ qua (kèm lý do); kết quả 4 cổng (trước → sau); danh sách ảnh đã tạo
hoặc tìm (kèm cách làm); file đã tạo / xóa; các quyết định tự chọn khi spec chưa rõ; kết quả rà soát bằng mắt ở R15.
```
