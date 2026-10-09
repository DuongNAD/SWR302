# 03 · Danh sách task (vòng 1: T0 → T17 — đã xong; tùy chọn: T18)

> **Vòng 1 (T0 → T17) đã hoàn thành** (commit `c9cc5ce`). **Việc cần làm tiếp là vòng 2: R1 → R16 ở `06_review_round2.md`.** File này giữ lại làm tham chiếu cho nội dung từng task, và có thêm **T18** (tùy chọn, làm sau cùng).

> Đọc `README.md` (luật + thư viện được phép), `01_design_rules.md` (thiết kế, chuyển trang) và `02_pages.md` (nội dung từng trang) trước.
> Ưu tiên: **P0** bắt buộc · **P1** nên làm · **P2** nếu còn thời gian. **T16 luôn phải làm.**

## Quy ước chung cho MỌI task

- **Chỉ làm phần hiển thị, các trang và hiệu ứng chuyển trang.** Không cần bảo mật/phân quyền/xác thực thật; **dữ liệu hard-code** trong `src/mocks/`; không cần đồng bộ trạng thái giữa các trang.
- Context có sẵn (`CartContext`, `AuthContext`, `ToastContext`) **dùng lại nguyên trạng**, không viết lại. Công thức đã có (giá bậc thang, phí, voucher) thì sao chép từ code cũ, không phát minh lại.
- Mỗi task xong: `npm run build` pass → `npm run lint` không tăng cảnh báo → `bash ui-spec/check-ui.sh` **không tăng** vi phạm (file *mới* viết ra phải **0 vi phạm**; vi phạm còn lại chỉ nằm ở file cũ chờ xóa ở T16) → xem lại ở **375 / 768 / 1440px**.
- Mọi trang: dùng `components/ui/*` (shadcn đã retheme), đủ trạng thái hiển thị (mặc định · empty · lỗi), không cuộn ngang, focus bàn phím rõ, vùng bấm ≥ 44px trên mobile, **nằm trong `PageTransition`**.
- Component cũ (`Header`, `ProductCard`, `FilterSidebar`, các modal, `AdminDashboard`, `RecipeKitSection`…) **giữ nguyên tại chỗ để lấy logic**, chỉ xóa ở **T16**.
- Thư viện chỉ lấy từ danh sách ở `README.md` mục 4; thêm gì → ghi vào `THIRD_PARTY.md`. Không commit/push.

---

## T0 — Nền tảng giao diện: thư viện, shadcn/ui, token, font `[P0 · làm đầu tiên]`
**Files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/index.css`, `src/main.tsx`, `components.json`, `src/lib/utils.ts`, `src/components/ui/*`, `src/context/ToastContext.tsx` *(chỉ phần hiển thị)*, `THIRD_PARTY.md`; xóa `src/App.css`.

1. `npm i react-router-dom @fontsource/be-vietnam-pro`, rồi `npx shadcn@latest init` (Vite · TypeScript · Tailwind v4 · CSS variables · alias `@/*` → `src/*`: thêm `resolve.alias` ở `vite.config.ts` và `paths` ở tsconfig; nếu `baseUrl` bị cảnh báo deprecated ở TypeScript 6 thì chỉ dùng `paths`). Nếu `init` vướng quá ~30 phút: dùng thẳng các gói `radix-ui` + `class-variance-authority` + `clsx` + `tailwind-merge` + `tw-animate-css` và tự dựng component theo cùng quy cách — **không** đổi sang khung khác.
2. **Ghi đè** `src/index.css` bằng khối ở `01_design_rules.md` mục 4 (tokens, ánh xạ shadcn, base, `wrap`, `.page-enter`); xóa `.dark` và `@custom-variant dark`; xóa `src/App.css`. `index.html`: bỏ mọi link Google Fonts, đổi `<title>` thành `Gia Hòa Phát — Nguyên liệu và thiết bị làm bánh`. `main.tsx`: import `@fontsource/be-vietnam-pro/400.css`, `500.css`, `600.css`, `700.css`.
3. Thêm component: `npx shadcn@latest add button input textarea select checkbox radio-group switch label badge tabs table pagination breadcrumb dialog sheet drawer dropdown-menu popover command separator skeleton accordion alert avatar tooltip sonner calendar input-otp sidebar chart carousel scroll-area slider collapsible navigation-menu progress` *(tên có thể đổi theo phiên bản CLI — chạy `npx shadcn@latest add` không đối số để xem danh sách)*. Rồi `npm i @tanstack/react-table date-fns` (và `recharts` nếu CLI chưa kéo). `react-hook-form` + `zod` chỉ khi muốn — **không bắt buộc** kiểm tra hợp lệ.
4. **Retheme từng component** theo bảng "Sửa component ngay sau khi `add`" ở `01_design_rules.md` mục 4 (bỏ shadow nặng, blur, uppercase, `animate-pulse`; `Tabs` kiểu gạch chân; `Badge` có variants trạng thái…).
5. Thành phần riêng trong `components/ui/`: `Price`, `Rating`, `QuantityStepper`, `Stepper`, `EmptyState`, `PageHeader`, `Spinner` — đúng `01_design_rules.md` mục 6.
6. `ToastContext`: **giữ nguyên API** `showToast` / `dismissToast`; phần hiển thị dùng `sonner` (đặt `<Toaster />`, góc dưới phải).
7. Tạo `client/THIRD_PARTY.md` (bảng: thư viện · phiên bản · giấy phép · dùng ở đâu) và cập nhật dần.

**Nghiệm thu**
- [ ] `npm run build` pass với alias `@` và shadcn.
- [ ] Mọi file trong `src/components/ui/` đạt `check-ui.sh` = 0 (không còn `shadow-md/lg`, `backdrop-blur`, `uppercase`, `animate-pulse`, hex cứng…).
- [ ] Tab Network chỉ có font cục bộ (không `fonts.googleapis.com`); chữ tiếng Việt hiển thị đúng dấu.
- [ ] `src/App.css` đã xóa.

---

## T1 — Khung ứng dụng: router, layout, chuyển trang, trang tạm `[P0]`
**Files:** `src/main.tsx`, `src/router.tsx`, `src/layouts/*`, `src/components/layout/{PageTransition,ScrollToTop}.tsx`, `src/hooks/useDocumentTitle.ts`, `src/pages/**` (stub), `src/pages/dev/StyleGuidePage.tsx`, `vite.config.ts`.

1. `main.tsx`: Providers theo thứ tự `Toast → Auth → Cart`, bọc `HashRouter` và `<AppRoutes />`. `vite.config.ts`: `base: './'`.
2. `router.tsx`: khai báo **toàn bộ route** trong sơ đồ ở `02_pages.md`; mỗi trang tạm là `PageStub` (hiện mã SCR + tên trang). Layout lồng: `StoreLayout` / `AuthLayout` / `CheckoutLayout` / `AccountLayout` / `AdminLayout` (khung rỗng).
3. **`PageTransition`** đúng `01_design_rules.md` mục 10.1 (`key={pathname}` + `.page-enter`, chỉ bọc vùng nội dung của từng layout); `ScrollToTop`; `useDocumentTitle` → `"{Tên trang} — Gia Hòa Phát"`.
4. **Không** cần route guard, trang 403, `OrdersContext`, `WishlistContext`.
5. `App.tsx` cũ đổi tên `LegacyApp`, gắn tạm ở `/legacy` để lấy logic khi cần (**xóa ở T16**).
6. `/dev/style-guide`: hiển thị mọi thành phần ở mục 6 với đủ trạng thái (mặc định, hover, focus, disabled, lỗi) + bảng màu token + thang chữ.

**Nghiệm thu**
- [ ] Mọi route trong sơ đồ vào được (hiện stub); F5 trên bất kỳ route nào không lỗi.
- [ ] Chuyển qua lại giữa ≥ 3 route (kể cả khác layout): **chỉ vùng nội dung** hiện dần + trồi 8px trong ~220ms; header/footer/sidebar đứng yên; không nháy trắng; đổi query (`?danh-muc=…`) **không** chạy lại hiệu ứng; bật *Reduce motion* → không animation.
- [ ] `/dev/style-guide` đủ thành phần; `/legacy` vẫn chạy như bản cũ; `build` pass.

---

## T2 — Khung storefront: header, tìm kiếm, menu, giỏ mini, footer, DemoWidget `[P0]`
**Files:** `src/layouts/StoreLayout.tsx`, `src/components/layout/{SiteHeader,SearchBox,CategoryMenu,MobileMenu,MiniCart,SiteFooter,DemoWidget}.tsx`.
**Làm theo:** `01_design_rules.md` mục 7 (StoreLayout) và mục 11 (DemoWidget).

1. Thanh tiện ích → header dính (≤ 64px) → thanh danh mục (không dính) → footer.
2. **SearchBox:** ô chọn danh mục + input + nút; gợi ý bằng shadcn `Command` trong `Popover` (≤ 5 sản phẩm, 3 danh mục, "Xem tất cả kết quả"); ↑ ↓ Enter `Esc`; **Ctrl/⌘ + K**; Enter → `/tim-kiem?q=…`.
3. **CategoryMenu:** `NavigationMenu`/`Popover` 8 danh mục (có số sản phẩm) → `/san-pham?danh-muc=…`.
4. **MobileMenu:** `Sheet` trái.
5. **MiniCart:** `Sheet` phải 400px, dựng từ logic `CartDrawer` (danh sách, đổi số lượng, xóa, tạm tính, 2 nút → `/gio-hang`, `/thanh-toan`); mở khi bấm icon giỏ; sau khi thêm hàng hiện toast "Đã thêm vào giỏ" có nút "Xem giỏ".
6. **Tài khoản:** chưa đăng nhập → link "Đăng nhập"; đã đăng nhập → `DropdownMenu` (Tài khoản · Đơn hàng · Yêu thích · Quản trị · Đăng xuất) kèm nhãn vai trò (Khách lẻ / Khách sỉ).
7. **SiteFooter:** 4 cột + hàng thanh toán + bản quyền + **một dòng** prototype (mục 7.4).
8. **DemoWidget:** nút "Demo" góc dưới trái + `Popover` 3 nút vai trò (gọi `loginAs`), link tới `/dev/requirements`, `/dev/style-guide`.
9. **Không còn** nút đổi vai trò, nút SWR302, nút nổi hay chữ "SWR302" trong header (chỉ còn đúng 1 dòng ở footer).

**Nghiệm thu**
- [ ] 1440px: phần dính ≤ 64px; ô tìm kiếm rộng ≥ 480px; thanh tiện ích đúng 1 dòng.
- [ ] 375px: phần dính ≤ 56px; ☰ mở sheet; giỏ không bị cắt; không cuộn ngang.
- [ ] Gõ "bơ" → thấy gợi ý; Ctrl/⌘+K mở ô tìm; Esc đóng; Enter sang `/tim-kiem?q=bơ`.
- [ ] DemoWidget đổi được 3 vai trò; chuyển trang vẫn mượt, header đứng yên.

---

## T3 — `ProductCard` + Trang chủ (SCR-01) `[P0]`
**Files:** `src/components/product/{ProductCard,ProductGrid}.tsx`, `src/pages/store/HomePage.tsx`, `public/img/*` (ảnh banner & danh mục).

**ProductCard** (dùng ở mọi nơi) — tối đa **7 dòng thông tin**:
- Khung `bg-surface border border-line rounded-lg`; hover chỉ đổi viền `line-strong` (không bóng, không dịch chuyển). Cả ảnh + tên là **một link** → `/san-pham/:id` (nút "Thêm vào giỏ" nằm ngoài link, không lồng).
- Ảnh vuông 1:1 `object-cover` nền `page`; góc trên trái tag `-x%` (nếu có `originalPrice`); góc trên phải nút ♡ (icon viền 18px, không nền).
- Thân (padding 12): thương hiệu 12px `ink-3` → **tên** 14px/500 (2 dòng) → `Rating` → **giá** 16px/600 + giá gốc gạch → "Từ 66.000₫ khi mua 10+" 12px `brand` *(nếu có bậc giá)* → "Giao lạnh 2–8°C" 12px `info` + icon bông tuyết 14px *(chỉ khi chilled/frozen)* → "HSD 28/11/2026" 12px `ink-2` → tồn thấp "Chỉ còn N" `warn` / hết "Hết hàng" `bad`.
- Nút outline full-width cao 36px **"Thêm vào giỏ"** (hết hàng → disabled). Không badge "Bán chạy", không chip pastel, không overlay khi hover.

**HomePage:** đúng SCR-01 (8 khối). Ảnh banner/danh mục: chọn ảnh thật chất lượng cao, cùng tông ấm (Unsplash/Pexels), lưu `public/img/`, ghi nguồn `THIRD_PARTY.md`.

**Nghiệm thu**
- [ ] Thẻ ≤ 7 dòng, không bị cắt chữ HSD; 2 cột ở 375px, 4–5 cột ở 1440px.
- [ ] Trang chủ đủ 8 khối, không gradient/thẻ nổi/số liệu ảo; `h1` đúng 1.
- [ ] Bấm danh mục → `/san-pham?danh-muc=…`; bấm thẻ → chi tiết (có hiệu ứng chuyển trang); "Thêm vào giỏ" mở toast + cập nhật số lượng giỏ.

---

## T4 — Danh sách & tìm kiếm (SCR-02, SCR-03) `[P0]`
**Files:** `src/pages/store/{ProductListPage,SearchPage}.tsx`, `src/components/product/{FilterPanel,ActiveFilters}.tsx`.
**Dùng lại:** logic lọc/sắp xếp trong `App.tsx` (`filteredProducts`); thêm lọc nhiều điều kiện bảo quản và ô giá từ–đến.

1. Bộ lọc/sắp xếp/phân trang **trên URL query** (`danh-muc, bao-quan, thuong-hieu, gia, con-hang, sap-xep, trang`).
2. Cột lọc trái 260px dính, không cuộn lồng; mobile: `Drawer` đáy (accordion) + chân "Xem N sản phẩm".
3. Tag bộ lọc đang bật (bỏ được), ô sắp xếp, phân trang 12/trang, empty state.
4. `SearchPage` dùng chung bố cục; nhận `q` (và danh mục); không có kết quả → 3 gợi ý.

**Nghiệm thu**
- [ ] Đổi bộ lọc → URL đổi → F5/chia sẻ link giữ nguyên kết quả; **không** chạy lại hiệu ứng chuyển trang.
- [ ] 375px: sản phẩm đầu tiên cách đỉnh danh sách **< 250px** (hiện 1.132px); trang ngắn hơn rõ rệt (hiện 14.005px).
- [ ] "Xóa bộ lọc" về mặc định; số kết quả hợp lý với bộ lọc.

---

## T5 — Chi tiết sản phẩm (SCR-04) `[P0]`
**Files:** `src/pages/store/ProductDetailPage.tsx`, `src/components/product/{WholesaleTierTable,StorageNote,ReviewList}.tsx`, `src/mocks/{reviews,productExtras,stores}.ts`.
**Dùng lại:** `getCurrentTierPrice` (từ `ProductModal.tsx`); `addItem`.

- Làm đúng SCR-04 (6 khối). Bảng giá bậc thang **tô dòng theo số lượng đang chọn**; bấm dòng → đặt số lượng.
- Ghi chú bảo quản (viền trái `info`) chỉ khi `chilled`/`frozen`.
- Thiết bị (danh mục *Thiết bị & Máy móc*): thêm Bảo hành/Công suất/Kích thước từ `productExtras`.
- Thanh dính đáy trên mobile; id không tồn tại → 404.

**Nghiệm thu**
- [ ] Tăng số lượng qua mốc sỉ → đơn giá, "Tiết kiệm", dòng được tô và thành tiền đổi đúng.
- [ ] Hàng lạnh có ghi chú xe lạnh; hàng thường thì không.
- [ ] 375px: thanh dính đáy không che nội dung cuối trang và không đè `DemoWidget`.
- [ ] Đổi tab (Mô tả/Thông số/Đánh giá): chéo mờ 150ms, không trượt.

---

## T6 — Combo công thức (SCR-05, SCR-06) `[P0]`
**Files:** `src/pages/store/{ComboListPage,ComboDetailPage}.tsx`. **Dùng lại:** logic `RecipeKitSection` (chọn/bỏ chọn, tổng tiền, thêm vào giỏ).

- Danh sách 3 combo; chi tiết có bảng nguyên liệu (checkbox), tổng, nút thêm giỏ, "Cách làm" là danh sách đánh số trơn.

**Nghiệm thu**
- [ ] Bỏ chọn 1 món → tổng giảm đúng; bấm thêm → giỏ có đúng các món đã chọn, toast đúng số lượng.
- [ ] Không còn accordion/timeline trang trí, không viền kép.

---

## T7 — Giỏ hàng (SCR-07) `[P0]`
**Files:** `src/pages/store/CartPage.tsx`, `src/components/cart/{CartLine,OrderSummary,VoucherBox}.tsx`. **Dùng lại:** `useCart()` nguyên trạng.

- Làm đúng SCR-07: danh sách + tóm tắt dính, gợi ý bậc giá kế tiếp, ghi chú xe lạnh, thanh miễn phí vận chuyển, ô voucher (tag mã đang áp dụng).
- Empty state + sản phẩm bán chạy.

**Nghiệm thu**
- [ ] Voucher `BAKING2026` (đơn ≥ 200.000₫), `GHPVIP`, `FREESHIP` áp dụng/bỏ đúng như bản cũ; mã sai → báo lỗi.
- [ ] Hàng lạnh → hiện ghi chú + phí đóng gói 15.000₫, miễn phí từ 300.000₫.
- [ ] Số liệu giỏ mini và trang giỏ luôn khớp.

---

## T8 — Thanh toán 3 bước & thành công (SCR-08, SCR-09) `[P0]`
**Files:** `src/layouts/CheckoutLayout.tsx`, `src/pages/store/{CheckoutPage,OrderSuccessPage}.tsx`, `public/qr-demo.svg`.
**Dùng lại:** công thức từ `CheckoutModal.tsx` (phí 25.000₫/45.000₫, tổng tiền, tạo đối tượng đơn hàng), `clearCart`.

- Làm đúng SCR-08: stepper 3 bước, tóm tắt đơn dính, địa chỉ đã lưu, VAT, giao tiêu chuẩn/xe lạnh, 4 phương thức thanh toán, khối QR **tĩnh** (`public/qr-demo.svg`, nội dung `GIAHOAPHAT-VNPAY-DEMO`, **không** gọi `api.qrserver.com`).
- **Chuyển bước** có hiệu ứng trượt 16px + hiện dần 200ms (mục 10.1).
- Đặt hàng → loading ~1,2 giây → `clearCart` → `/dat-hang/thanh-cong/:ma`, kèm đơn trong `location.state`. SCR-09 đúng mô tả (vào thẳng URL → đơn mẫu `GHP-889120`).

**Nghiệm thu**
- [ ] Đặt một đơn hàng lạnh từ giỏ có sẵn → tổng tiền ở SCR-09 **khớp** tổng ở bước thanh toán.
- [ ] Giỏ trống vào `/thanh-toan` → về `/gio-hang`; tắt mạng vẫn thấy mã QR.
- [ ] Bước 1 → 2 → 3 → quay lại: hướng trượt đúng chiều; không giật.

---

## T9 — Tra cứu & theo dõi đơn hàng (SCR-10, SCR-11) `[P0]`
**Files:** `src/pages/store/{OrderLookupPage,OrderTrackingPage}.tsx`, `src/mocks/{orders,shipments}.ts`.
**Dựng từ:** timeline + khối tài xế trong `OrderSuccessModal` cũ.

- Làm đúng SCR-11 (timeline 5 mốc, ánh xạ trạng thái, tài xế & nhiệt độ, sản phẩm, giao tới, thanh toán, VAT, in hóa đơn). Dữ liệu **hard-code**; mã lạ → đơn mẫu `GHP-889120`.
- "Hủy đơn" chỉ đổi Tag thành "Đã hủy" + toast (state cục bộ); "Mua lại" thêm sản phẩm vào giỏ.

**Nghiệm thu**
- [ ] `/don-hang/GHP-889120` hiện timeline đúng, khối xe lạnh (Nguyễn Văn Hùng · 29C-881.92 · 3,2°C); mã lạ vẫn hiển thị được.
- [ ] Tra cứu: `GHP-889120` + SĐT bất kỳ → vào đơn; mã khác → báo lỗi mẫu.

---

## T10 — Đăng nhập · Đăng ký · Quên mật khẩu (SCR-12, 13, 14) `[P0]`
**Files:** `src/layouts/AuthLayout.tsx`, `src/pages/auth/*`. **Dùng lại:** `loginAs`.

- Làm đúng 3 trang; khối **Tài khoản demo** ở đăng nhập; OTP dùng `InputOTP` (tự nhảy ô, dán được, đếm ngược), **nhận mọi 6 chữ số**.
- Không kiểm tra thông tin: đăng nhập nhận mọi giá trị; quên mật khẩu → trạng thái thành công tại chỗ.

**Nghiệm thu**
- [ ] Nút demo vào đúng vai trò; đăng ký → OTP → vào `/tai-khoan` kèm toast.
- [ ] Chuyển Đăng nhập ↔ Đăng ký ↔ Quên mật khẩu có hiệu ứng chuyển trang; header của AuthLayout đứng yên.

---

## T11 — Tài khoản (SCR-15 → SCR-20) `[P0: 15, 16 · P1: 17, 18, 19 · P2: 20]`
**Files:** `src/layouts/AccountLayout.tsx`, `src/pages/account/*`.

- Làm đúng các trang; điều hướng bên trái (mục *Doanh nghiệp* chỉ hiện khi là khách sỉ — **không chặn** truy cập bằng URL).
- Dữ liệu đơn hàng, địa chỉ, yêu thích **hard-code**; thao tác lưu/xóa chỉ đổi hiển thị + toast.

**Nghiệm thu**
- [ ] Khách lẻ không thấy mục Doanh nghiệp ở menu; khách sỉ thấy.
- [ ] Chuyển giữa các trang con: chỉ cột nội dung chuyển, điều hướng bên trái đứng yên.

---

## T12 — Trang thông tin (SCR-21 → SCR-25) `[P1]`
**Files:** `src/pages/store/{WholesalePage,StoresPage,SupportPage,AboutPage,ContactPage,NotFoundPage}.tsx`, `src/mocks/{stores,articles}.ts`.

- Làm đúng các trang; nội dung hỗ trợ **khớp con số thật** (xem SCR-23).

**Nghiệm thu**
- [ ] Form mua sỉ / liên hệ gửi xong hiện trạng thái thành công tại chỗ.
- [ ] Trang cửa hàng không có bản đồ giả; link "Chỉ đường" mở tab mới.
- [ ] Đường dẫn sai → 404 có ô tìm kiếm.

---

## T13 — Admin: khung + Tổng quan + Đơn hàng (SCR-A01 → A03) `[P0]`
**Files:** `src/layouts/AdminLayout.tsx`, `src/components/admin/{StatStrip,DataTable,DataTableToolbar}.tsx`, `src/pages/admin/{DashboardPage,OrdersPage,OrderDetailPage}.tsx`, `src/mocks/{orders,sales}.ts`.
**Tham khảo cấu trúc:** shadcn Blocks `dashboard-01` / `sidebar-*` hoặc `satnaing/shadcn-admin` (retheme, bỏ thương hiệu, ghi nguồn).

- Làm đúng 3 trang bằng shadcn `Sidebar`, `Table` + TanStack Table, `Chart` (Recharts, một màu `brand`, không animation). Dải số liệu một khung (không thẻ KPI có icon màu).
- Đổi trạng thái đơn chỉ cập nhật hiển thị tại chỗ (state cục bộ) + toast. **Không** kiểm tra quyền.

**Nghiệm thu**
- [ ] 768px: bảng không làm tràn trang (cuộn ngang trong khung); sidebar thành sheet.
- [ ] Chuyển Tổng quan → Đơn hàng → Chi tiết: chỉ vùng nội dung chuyển; sidebar và thanh trên đứng yên.
- [ ] Biểu đồ không gradient, không animation.

---

## T14 — Admin: Sản phẩm · Danh mục · Tồn kho & lô (SCR-A04 → A07) `[P0: A04, A05, A07 · P1: A06]`
**Files:** `src/pages/admin/{ProductsPage,ProductFormPage,CategoriesPage,InventoryPage}.tsx`, `src/mocks/batches.ts`.

- Làm đúng các trang; form sản phẩm có bảng bậc thang sửa được; lô hàng sắp xếp FEFO, tô màu theo số ngày còn lại.
- Thêm/sửa/ẩn/xóa chỉ cập nhật hiển thị + toast (xóa có `Dialog` xác nhận). Không cần lan sang storefront.

**Nghiệm thu**
- [ ] Lô còn ≤ 7 ngày chữ `bad`, ≤ 30 ngày chữ `warn`; sửa tồn kho tại chỗ đổi số hiển thị.
- [ ] Form hiển thị được trạng thái lỗi mẫu cho ô bắt buộc; lưu → về danh sách + toast.

---

## T15 — Admin: Khách hàng · Khuyến mãi · Vận chuyển · Báo cáo · Nhân viên · Cài đặt (SCR-A08 → A13) `[P1: A08–A11 · P2: A12, A13]`
**Files:** `src/pages/admin/{CustomersPage,PromotionsPage,ShippingPage,ReportsPage,StaffPage,SettingsPage}.tsx`, `src/mocks/{customers,vouchers,shipments,staff}.ts`.

- Làm đúng các trang; mọi bảng dùng chung `DataTable` + `DataTableToolbar`; biểu đồ bằng shadcn `Chart`.

**Nghiệm thu**
- [ ] Duyệt/Từ chối khách sỉ đổi nhãn trạng thái; bật/tắt voucher đổi trạng thái; nhiệt độ > 8°C hiện chữ `bad`.
- [ ] Mọi bảng cùng một kiểu (header, hàng 48px, phân trang) — không trang nào tự chế.

---

## T16 — Dọn dẹp, cập nhật ma trận, QA tổng `[P0 · bắt buộc]`

1. **Xóa** file cũ sau khi đã lấy hết logic: `src/App.tsx` (+ route `/legacy`), `components/auth/AuthModal.tsx`, `components/checkout/*`, `components/product/{ProductModal,FilterSidebar,ProductCard cũ}`, `components/layout/{Header,Footer,SWRMatrixDrawer}.tsx`, `components/recipe/RecipeKitSection.tsx`, `components/admin/AdminDashboard.tsx`, `components/common/*` đã thay bằng `ui/*`.
2. **Ma trận yêu cầu** (`/dev/requirements`): chuyển nội dung `SWRMatrixDrawer`; cập nhật **chỉ** chuỗi `verifiedInClient` trong `src/data/swrRequirements.ts` theo bảng ánh xạ cuối `02_pages.md`. Với `NFR-A11Y-01` ghi số **đã tính**: chữ chính `#1C1917` trên `#FAFAF9` = 16,7:1 · trắng trên nút `#92400E` = 7,1:1 · chữ phụ `#78716C` trên trắng = 4,8:1.
3. **Lint:** xóa import không dùng (28 chỗ) — **chỉ import**, không đụng logic.
4. `bash ui-spec/check-ui.sh` → **0 vi phạm**. Rà bằng mắt các mục "tự rà" ở `01_design_rules.md` mục 12.
5. **Duyệt luồng demo** (không cần hồi quy sâu):
   - *Khách lẻ:* Trang chủ → gõ tìm "bơ" → chi tiết → thêm giỏ → giỏ → voucher `BAKING2026` → thanh toán 3 bước → thành công → theo dõi đơn → Tài khoản.
   - *Khách sỉ:* bảng giá bậc thang ở chi tiết/giỏ; thanh toán có VAT; mục Doanh nghiệp.
   - *Admin:* DemoWidget → Tổng quan → Đơn hàng → Chi tiết → Sản phẩm → Form → Tồn kho & lô.
6. **Chuyển trang:** đi qua ≥ 15 lần đổi route ở cả 5 layout — mọi lần chỉ vùng nội dung chuyển, cùng một kiểu/thời lượng, không nháy trắng, không nhảy layout; bật *Reduce motion* → tắt hết; đổi query không chạy lại.
7. **Responsive & a11y:** duyệt mọi trang ở 375 / 768 / 1024 / 1440px; Tab bàn phím qua header, thẻ sản phẩm, dialog (focus trap, `Esc`); ảnh có `alt`; mỗi trang đúng 1 `h1`.
8. **Offline:** tắt mạng → trang vẫn chạy (trừ ảnh Unsplash của sản phẩm); không còn request tới `api.qrserver.com`, `fonts.googleapis.com`.
9. **`THIRD_PARTY.md`** đầy đủ: mọi thư viện + giấy phép, mọi ảnh/mã copy kèm URL nguồn.

**Nghiệm thu**
- [ ] `check-ui.sh` = 0 · `npm run build` pass · `npm run lint` giảm 36 → 8 cảnh báo (8 cái còn lại thuộc logic, ngoài phạm vi).
- [ ] Ba luồng demo chạy trọn vẹn; không còn component cũ; ma trận khớp thực tế; `THIRD_PARTY.md` đủ.

---

## T17 — Đóng gói & ảnh chụp cho SRS `[P1]`

1. `npm run build` → `dist/` chạy được bằng `npm run preview`. Ghi 3 dòng hướng dẫn chạy vào `client/README.md` (cài, chạy dev, build/preview).
2. *(Tùy chọn — chỉ khi muốn mở bằng double-click `index.html`)*: thêm **devDependency** `vite-plugin-singlefile` để gộp JS/CSS vào 1 file HTML (module script không chạy được qua `file://`). Đây là ngoại lệ duy nhất ngoài danh sách thư viện.
3. Chụp ảnh các màn hình `P0` ở **1440×900** vào `client/ui-spec/screenshots/SCR-xx.png` (đủ SCR-01, 02, 04, 06, 07, 08, 09, 11, 12, 13, 15, 16, A01, A02, A03, A04, A05, A07) để nhóm dán vào mục *Prototype* của SRS.

**Nghiệm thu**
- [ ] `npm run preview` mở được toàn bộ route; thư mục `screenshots/` đủ ảnh, tên đúng mã SCR.

---

## T18 — Trang xem sơ đồ use case `/dev/use-cases` (SCR-D03) `[P2 · tùy chọn · chỉ làm khi xong R1 → R15 ở 06_review_round2.md]`
**Files:** `src/pages/dev/UseCasesPage.tsx`, `src/router.tsx` (thêm route), `src/components/layout/DemoWidget.tsx` (thêm liên kết), `public/diagrams/*.svg`.

1. Sao chép 7 file `ui-spec/diagrams/uc-*.svg` vào `client/public/diagrams/` (giữ nguyên tên, **không sửa nội dung**, **không vẽ lại** — sơ đồ do nhóm tự vẽ nên không cần ghi vào `THIRD_PARTY.md`).
2. Trang `/dev/use-cases` (trong `StoreLayout`, như hai trang dev còn lại): `PageHeader` với `h1` "Sơ đồ use case" + mô tả một dòng ("41 use case, 5 tác nhân, 4 hệ thống ngoài."); shadcn `Tabs` kiểu gạch chân gồm 7 tab: *Tổng quan · Tài khoản · Duyệt và tìm kiếm · Giỏ hàng và đặt hàng · Theo dõi đơn · Kho và vận hành · Quản trị*. Mỗi tab hiện sơ đồ bằng `<img src="./diagrams/uc-xx.svg">` trong khung viền trắng `rounded-lg`, `max-w-full`; sơ đồ rộng hơn khung thì **cuộn ngang trong khung** (trang không được tràn). Dưới ảnh: chú thích "Hình n — …" và liên kết "Mở ảnh gốc" (`target="_blank"`).
3. Dưới các tab: bảng **Tác nhân** (5 dòng: tên, vai trò `role`, làm được gì) — nội dung chép từ `05_use_case_diagram.md` mục 2, viết cứng.
4. Thêm liên kết "Sơ đồ use case" vào `DemoWidget`. Thêm `/dev/use-cases` vào mảng `ROUTES` của `ui-spec/audit-runtime.mjs`.
5. Mỗi `<img>` có `alt` mô tả ("Sơ đồ use case tổng quan", …).

**Nghiệm thu**
- [ ] `/dev/use-cases` hiện đủ 7 sơ đồ rõ nét; ở 375px sơ đồ cuộn ngang trong khung, trang không tràn.
- [ ] `check-ui.sh`, `check-links.mjs`, `audit-runtime.mjs` không tăng so với trước T18.

---

## Báo cáo cuối (Antigravity gửi lại)

1. Task đã xong / bỏ qua (kèm lý do).
2. Kết quả `check-ui.sh`, `npm run build`, `npm run lint` (số cảnh báo trước → sau).
3. Danh sách thư viện đã thêm (có giấy phép) và nguồn mã/ảnh mở đã dùng.
4. Danh sách file đã tạo / xóa.
5. Các quyết định tự chọn khi spec chưa rõ.
6. Mâu thuẫn nghiệp vụ phát hiện thêm (vd. giỏ hàng hứa miễn phí vận chuyển ≥ 500.000₫ nhưng thanh toán vẫn cộng phí) để nhóm quyết định.
