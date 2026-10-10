# 02 · Danh sách đủ các trang (Topic 1)

Mỗi màn hình có mã `SCR-xx` để nhóm đưa thẳng vào phần *prototype* của SRS. **Ưu tiên:** `P0` = màn hình chính bắt buộc · `P1` = chức năng có thể có, nên làm · `P2` = bổ sung nếu còn thời gian.
Mọi trang tuân thủ `01_design_rules.md`, nằm trong `PageTransition` (hiệu ứng chuyển trang — mục 10.1) và dựng bằng thành phần shadcn/ui đã retheme (mục 6). Mọi trang có đủ trạng thái *hiển thị*: mặc định · empty · lỗi (chỉ cần dựng hình dạng).

**Quy ước phạm vi:** chỉ *phần hiển thị*, *các trang* và *hiệu ứng chuyển trang*. **Không cần bảo mật** (mọi route vào được bằng URL; đăng nhập/OTP nhận mọi giá trị; không phân quyền thật). **Dữ liệu có thể hard-code** trong `src/mocks/`; không cần đồng bộ trạng thái giữa các trang.

## Sơ đồ trang

```text
STOREFRONT (StoreLayout)
/                          SCR-01  Trang chủ
/san-pham                  SCR-02  Danh sách sản phẩm   (?danh-muc= &bao-quan= &thuong-hieu= &gia= &con-hang= &sap-xep= &trang=)
/tim-kiem?q=               SCR-03  Kết quả tìm kiếm
/san-pham/:id              SCR-04  Chi tiết sản phẩm
/combo                     SCR-05  Combo công thức
/combo/:id                 SCR-06  Chi tiết combo
/gio-hang                  SCR-07  Giỏ hàng
/thanh-toan                SCR-08  Thanh toán 3 bước          (CheckoutLayout)
/dat-hang/thanh-cong/:ma   SCR-09  Đặt hàng thành công        (CheckoutLayout)
/tra-cuu-don-hang          SCR-10  Tra cứu đơn (khách vãng lai)
/don-hang/:ma              SCR-11  Theo dõi đơn hàng
/mua-si                    SCR-21  Mua sỉ / đăng ký đại lý
/cua-hang                  SCR-22  Hệ thống cửa hàng
/ho-tro  /ho-tro/:slug     SCR-23  Hỗ trợ & chính sách
/gioi-thieu  /lien-he      SCR-24  Giới thiệu · Liên hệ
*                          SCR-25  404

AUTH (AuthLayout)
/dang-nhap                 SCR-12  Đăng nhập
/dang-ky                   SCR-13  Đăng ký + OTP
/quen-mat-khau             SCR-14  Quên mật khẩu

TÀI KHOẢN (AccountLayout)
/tai-khoan                 SCR-15  Tổng quan
/tai-khoan/don-hang        SCR-16  Đơn hàng của tôi
/tai-khoan/dia-chi         SCR-17  Sổ địa chỉ
/tai-khoan/yeu-thich       SCR-18  Sản phẩm yêu thích
/tai-khoan/ho-so           SCR-19  Hồ sơ & mật khẩu
/tai-khoan/doanh-nghiep    SCR-20  Doanh nghiệp (chỉ khách sỉ)

ADMIN (AdminLayout)
/admin                     SCR-A01 Tổng quan
/admin/don-hang            SCR-A02 Danh sách đơn
/admin/don-hang/:id        SCR-A03 Chi tiết & xử lý đơn
/admin/san-pham            SCR-A04 Danh sách sản phẩm
/admin/san-pham/moi  /:id  SCR-A05 Thêm / sửa sản phẩm
/admin/danh-muc            SCR-A06 Danh mục
/admin/ton-kho             SCR-A07 Tồn kho & lô hàng (HSD)
/admin/khach-hang          SCR-A08 Khách hàng & duyệt khách sỉ
/admin/khuyen-mai          SCR-A09 Khuyến mãi & voucher
/admin/van-chuyen          SCR-A10 Vận chuyển & chuỗi lạnh
/admin/bao-cao             SCR-A11 Báo cáo
/admin/nhan-vien           SCR-A12 Nhân viên & phân quyền
/admin/cai-dat             SCR-A13 Cài đặt

DEV (không phải giao diện khách)
/dev/style-guide           SCR-D01 Bộ thành phần giao diện
/dev/requirements          SCR-D02 Ma trận yêu cầu SWR302
/dev/use-cases             SCR-D03 Sơ đồ use case (tùy chọn — T18)
```

Router: **`HashRouter`** (`/#/san-pham`) để mở được khi đóng gói/đặt trên hosting tĩnh và F5 không bị 404; `vite.config.ts` đặt `base: './'`.

---

# A · STOREFRONT

### SCR-01 · Trang chủ · `/` · P0
**Ai dùng:** mọi người dùng · **Trace:** FR-SRC-01, FR-KIT-04, BR-RULE-02
1. **Banner chia đôi** — khung `rounded-xl border border-line bg-surface`, 2 cột (≥ md): trái (padding 32–48px) `h1` "Nguyên liệu và thiết bị làm bánh chính hãng", mô tả 16px `ink-2` (≤ 480px), nút primary **"Xem sản phẩm"** → `/san-pham` + link text **"Mua sỉ cho tiệm bánh"** → `/mua-si`; phải: ảnh thật `object-cover` (dùng URL có sẵn trong `data/`, đổi `w=600` → `w=1200`). Mobile: ảnh trên (16:9), chữ dưới. **Không** carousel, gradient, thẻ nổi, số liệu.
2. **Dải dịch vụ** — một khung viền, 4 ô ngăn bằng `divide-x` (mobile 2×2): icon 20px + dòng 14px/500 + dòng 12px `ink-2`: *Giao lạnh 2–8°C — Xe lạnh cho bơ, sữa, kem tươi* · *Hạn dùng theo lô — Xem HSD trên từng sản phẩm* · *Giá sỉ theo số lượng — Tự hạ giá khi đạt mốc* · *Hóa đơn VAT — Xuất hóa đơn điện tử khi cần*.
3. **Danh mục sản phẩm** — `h2` + lưới 8 ô (4 cột; mobile 2): ảnh 1:1 `rounded-lg border`, tên 14px/500, "14 sản phẩm" 12px `ink-3`; bấm → `/san-pham?danh-muc=…`.
4. **Bán chạy** — `h2` + link "Xem tất cả"; 5 `ProductCard` (lưới 2/4/5 cột).
5. **Combo nguyên liệu theo món** — `h2` + link "Xem tất cả combo"; 3 thẻ: ảnh 4:3, tên, "Dễ · 90 phút · 6–8 phần", "N nguyên liệu · từ X₫", link "Xem combo".
6. **Giá sỉ cho tiệm bánh** — khung viền: trái `h2`, 3 gạch đầu dòng (*Bảng giá theo số lượng, tự động áp dụng · Xuất hóa đơn VAT · Giao theo lịch cố định*), nút secondary "Đăng ký mua sỉ"; phải: **bảng giá bậc thang thật** của một sản phẩm (lấy `wholesaleTiers` của Bơ Anchor 227g).
7. **Hàng mới về** — 5 `ProductCard` (`isNew`, bù bằng đánh giá cao).
8. **Cửa hàng** — 2 khối địa chỉ (Hà Nội · TP.HCM) + link "Xem hệ thống cửa hàng".

### SCR-02 · Danh sách sản phẩm · `/san-pham` · P0
**Trace:** FR-FIL-02, FR-SRC-01 · **Dữ liệu:** `PRODUCTS`, `CATEGORIES`
- Breadcrumb + `h1` (tên danh mục hoặc "Tất cả sản phẩm") + số kết quả. Danh mục có `description` thì hiện 1 dòng mô tả.
- **Cột lọc trái 260px** (dính khi cuộn, không có thanh cuộn lồng): *Danh mục* (danh sách có số lượng) · *Điều kiện bảo quản* (checkbox: Nhiệt độ phòng · Mát 2–8°C · Đông −18°C) · *Thương hiệu* (checkbox, 6 mục đầu + "Xem thêm") · *Khoảng giá* (2 ô nhập từ–đến + nút "Áp dụng") · *Tình trạng* (chỉ hiện hàng còn) · nút text "Xóa bộ lọc". Số kết quả cập nhật tức thì.
- **Thanh công cụ** trên lưới: "N sản phẩm" · các **tag bộ lọc đang bật** (có nút bỏ) · ô sắp xếp (Bán chạy · Giá tăng · Giá giảm · Đánh giá · Mới nhất).
- Lưới **4 cột** (≥ lg, khi có cột lọc) / 3 / 2; phân trang 12 sản phẩm/trang.
- **Mobile:** nút "Bộ lọc (n)" mở **bottom sheet** (mục lọc dạng accordion) + chân "Xem N sản phẩm" / "Xóa bộ lọc"; sắp xếp là ô chọn cạnh nút.
- Toàn bộ bộ lọc/sắp xếp/phân trang nằm **trên URL query** (link chia sẻ được, F5 giữ nguyên).
- **Thành phần:** shadcn `Checkbox`, `Slider` (hoặc 2 ô nhập giá), `Accordion` + `Drawer` (mobile), `Select`, `Pagination`, `Badge`.
- **Empty:** "Không tìm thấy sản phẩm phù hợp" + gợi ý bỏ bớt bộ lọc + nút "Xóa bộ lọc".

### SCR-03 · Kết quả tìm kiếm · `/tim-kiem?q=` · P0
**Trace:** FR-SRC-01
- Dùng lại bố cục SCR-02. `h1`: `Kết quả cho “{q}”`. Khớp theo tên, thương hiệu, SKU, danh mục (đúng logic hiện có ở `App.tsx`).
- **Ô tìm kiếm ở header** (làm ở T2): ô chọn danh mục bên trái; gõ ≥ 2 ký tự → `Popover` + shadcn `Command` (`shadow-pop`) gồm tối đa 5 sản phẩm (ảnh nhỏ, tên có tô đậm phần khớp, giá), 3 danh mục khớp, dòng `Xem tất cả kết quả cho “{q}”`; điều hướng ↑ ↓ Enter, `Esc` đóng; **Ctrl/⌘ + K** mở `CommandDialog` / focus ô tìm kiếm.
- **Không có kết quả:** tiêu đề + 3 gợi ý từ khóa ("bơ", "bột mì", "socola") + link về `/san-pham`.

### SCR-04 · Chi tiết sản phẩm · `/san-pham/:id` · P0
**Trace:** FR-PROD-03, BR-RULE-01, BR-RULE-02 · **Dùng lại:** `getCurrentTierPrice` (từ `ProductModal.tsx`) để tính giá theo bậc
1. Breadcrumb: Trang chủ / Danh mục / Tên sản phẩm.
2. **Hai cột.** Trái: ảnh vuông 1:1 trong khung viền, bấm để phóng to (lightbox đơn giản). Phải:
   - thương hiệu (link lọc) · `h1` tên (24px/600) · "SKU …" 13px `ink-3` · điểm đánh giá (link cuộn xuống tab Đánh giá);
   - **Giá** 28px/700 + giá gốc gạch + tag `-x%`; dòng nhỏ "Giá đã gồm VAT" *(mock)*;
   - **Bảng giá sỉ bậc thang** (bảng 3 cột *Số lượng · Đơn giá · Tiết kiệm*) — **dòng ứng với số lượng đang chọn được tô `brand-soft`**; bấm một dòng để đặt số lượng bằng mốc đó;
   - **Ghi chú bảo quản** (chỉ khi `chilled`/`frozen`): khối viền trái 2px `info`, nền `info-soft`, icon bông tuyết 16px, 1–2 dòng: "Cần bảo quản 2–8°C. Đơn có sản phẩm này được giao bằng xe lạnh." (BR-RULE-01);
   - **HSD · Lô · Còn hàng** thành danh sách nhãn–giá trị (HSD: 28/11/2026 · Lô: … · Còn 180); tồn thấp → chữ `warn` "Chỉ còn 12";
   - **Số lượng** + nút primary **"Thêm vào giỏ"** + nút secondary **"Mua ngay"** (thêm giỏ rồi → `/thanh-toan`) + nút icon ♡ Yêu thích;
   - **Tình trạng tại cửa hàng** (P1): danh sách 2–4 cửa hàng + "Còn hàng / Sắp hết / Hết" (mock) + link "Xem hệ thống cửa hàng";
   - **Giao hàng:** "Tiêu chuẩn 24–48 giờ · 25.000₫" / "Xe lạnh 2–4 giờ · 45.000₫".
3. **Tab gạch chân:** *Mô tả* · *Thành phần* · *Bảo quản & sử dụng* · *Thông số* (bảng 2 cột: Thương hiệu, Xuất xứ, Quy cách, Khối lượng, SKU, HSD, Lô, Điều kiện bảo quản; **với thiết bị** thêm *Bảo hành, Công suất, Kích thước* lấy từ `mocks/productExtras.ts`) · *Đánh giá (n)*.
4. **Đánh giá:** điểm trung bình + phân bố 5→1 sao (thanh mảnh màu `warn`), danh sách 3–5 đánh giá mock (tên, sao, ngày, nhãn "Đã mua hàng", nội dung), phân trang; nút "Viết đánh giá" (khi đã đăng nhập) mở modal (UI).
5. **Món bánh phù hợp** (`suggestedRecipes`) dạng link → `/combo`; **Sản phẩm liên quan** (cùng danh mục, 5 thẻ).
6. **Mobile:** thanh dính đáy (giá + nút "Thêm vào giỏ").
**Trạng thái:** hết hàng → nút disabled + "Hết hàng"; id không tồn tại → SCR-25.

### SCR-05 · Combo công thức · `/combo` · P0
**Trace:** FR-KIT-04 · **Dữ liệu:** `RECIPE_BUNDLES`
- `h1` "Combo nguyên liệu theo món"; mô tả 1–2 câu ("Mua trọn bộ nguyên liệu theo định lượng chuẩn. Bỏ chọn món bạn đã có.").
- Lưới thẻ (3 cột): ảnh 4:3, tên, độ khó · thời gian · khẩu phần (danh sách nhãn–giá trị 13px), "N nguyên liệu", tổng tiền "từ X₫", nút secondary "Xem combo".

### SCR-06 · Chi tiết combo · `/combo/:id` · P0
**Logic mang sang:** chọn/bỏ chọn nguyên liệu, tổng tiền, thêm vào giỏ (từ `RecipeKitSection.tsx`)
- Breadcrumb. Trái: ảnh 4:3 + mô tả + nhãn–giá trị (Độ khó · Thời gian · Khẩu phần). Phải: **bảng nguyên liệu** (checkbox · ảnh 48px · tên + quy cách + thương hiệu · giá), hàng bỏ chọn mờ; **chân bảng:** "Đã chọn 4/4 món" + **Tổng** (20px/700) + nút primary "Thêm N nguyên liệu vào giỏ".
- Dưới: **"Cách làm"** — danh sách đánh số trơn (không accordion, không timeline trang trí).

### SCR-07 · Giỏ hàng · `/gio-hang` · P0
**Trace:** FR-CART-05, BR-RULE-01, BR-RULE-02 · **Dữ liệu:** `useCart()`
- `h1` "Giỏ hàng (N sản phẩm)". **Hai cột** (≥ lg): trái danh sách, phải **tóm tắt dính**.
- Mỗi dòng: ảnh 64px · tên (link) + SKU + dòng bảo quản (chữ `info`, icon bông tuyết nếu lạnh) · đơn giá theo bậc (`selectedPrice`) · **stepper số lượng** · thành tiền (`tabular-nums`) · nút text "Xóa". Dưới dòng: gợi ý bậc giá kế tiếp ("Mua thêm 6 để giá còn 72.000₫") tính từ `wholesaleTiers` (chỉ hiển thị, không đổi logic).
- Trên danh sách: **thanh tiến độ miễn phí vận chuyển** (mảnh 4px, nền `line`, phần đầy `brand`) + một dòng chữ; khối ghi chú xe lạnh (viền trái `info`) khi `requiresColdChain`, nêu phí đóng gói 15.000₫ hoặc "miễn phí đóng gói" (≥ 300.000₫). *(Giữ đúng ngưỡng/công thức hiện có.)*
- **Tóm tắt đơn hàng:** Tạm tính · Phí đóng gói lạnh · Giảm giá (voucher) · "Phí vận chuyển: tính ở bước thanh toán" · **Tổng cộng**; ô voucher + nút "Áp dụng" (mã hợp lệ hiện thành tag có nút bỏ); nút primary **"Tiến hành thanh toán"** → `/thanh-toan`; link "Tiếp tục mua sắm".
- **Empty:** "Giỏ hàng trống" + nút "Xem sản phẩm" + 5 sản phẩm bán chạy.
- **Giỏ mini (drawer phải 400px)** mở từ icon giỏ ở header và sau khi thêm hàng: danh sách rút gọn, tạm tính, 2 nút "Xem giỏ hàng" / "Thanh toán". Dựng bằng shadcn `Sheet`, dùng lại logic `CartDrawer`.
> **Mâu thuẫn nghiệp vụ có sẵn (ngoài phạm vi, chỉ ghi nhận):** giỏ hàng nói "đủ 500.000₫ được miễn phí vận chuyển" nhưng `CheckoutModal` luôn cộng 25.000₫/45.000₫. **Không sửa công thức; không nhắc "miễn phí vận chuyển" ở nơi nào khác ngoài giỏ hàng.** Nhóm cần chốt quy tắc.

### SCR-08 · Thanh toán · `/thanh-toan` · P0
**Trace:** FR-CHK-06, BR-RULE-01 · **Layout:** CheckoutLayout · **Tính tiền:** sao chép công thức từ `CheckoutModal.tsx` (phí 25.000₫/45.000₫, phí đóng gói lạnh, voucher). Đặt hàng → `clearCart` → chuyển sang SCR-09 kèm đơn vừa tạo trong `location.state` (không cần `OrdersContext`)
- Nếu giỏ trống → chuyển về `/gio-hang`. **Stepper 3 bước:** ① Thông tin nhận hàng → ② Vận chuyển → ③ Thanh toán. Mỗi bước là một khối; bước đã xong thu gọn thành dòng tóm tắt có link "Sửa".
- **Cột phải dính — Tóm tắt đơn:** danh sách sản phẩm (thumbnail 40px, tên, SL), tạm tính, phí đóng gói lạnh, phí vận chuyển, giảm giá (voucher), **Tổng cộng**.
- **① Thông tin nhận hàng:** chọn địa chỉ đã lưu (radio, từ `currentUser.addresses`) hoặc "Địa chỉ mới" (họ tên, SĐT, email, địa chỉ, tỉnh/thành); ghi chú; **hình thức nhận:** "Giao tận nơi" | "Nhận tại cửa hàng" (chọn 1 trong các cửa hàng, P1); checkbox **"Xuất hóa đơn VAT"** → mở thêm MST, tên công ty, địa chỉ công ty, email nhận hóa đơn (khách sỉ mặc định gợi ý bật). Trạng thái lỗi chỉ cần dựng *hình dạng* cho ô bắt buộc (họ tên, SĐT, địa chỉ); không cần quy tắc hợp lệ phức tạp.
- **② Vận chuyển:** radio-list 2 dòng: *Giao tiêu chuẩn — 24–48 giờ — 25.000₫* · *Giao xe lạnh — 2–4 giờ — 45.000₫* (mặc định xe lạnh khi giỏ cần bảo quản lạnh); ghi chú: "Đơn có bơ, sữa, kem nên chọn xe lạnh".
- **③ Thanh toán:** radio-list: *VNPay (QR)* · *MoMo* · *Chuyển khoản ngân hàng* · *Thanh toán khi nhận hàng (COD)*. Chọn VNPay → hiện khối **QR** (SVG tĩnh, số tiền, "Mã hết hạn sau 10:00" tĩnh). Nút primary cao 48px **"Đặt hàng"**; dòng nhỏ về điều khoản; trạng thái đang xử lý (nút loading ~1,2 giây như hiện tại).
- Thành công → `clearCart` → `/dat-hang/thanh-cong/:ma` (kèm đơn trong `location.state`).
- **Chuyển bước:** nội dung bước mới trượt vào 16px + hiện dần 200ms, quay lại thì ngược lại (`01_design_rules.md` mục 10.1).
- **Thành phần:** shadcn `RadioGroup`, `Select` (tỉnh/thành), `Collapsible`, `Input`, `Checkbox`.

### SCR-09 · Đặt hàng thành công · `/dat-hang/thanh-cong/:ma` · P0
**Trace:** FR-TRK-07, FR-CHK-06
- Căn giữa, cột 640px: icon `CheckCircle2` 32px màu `ok` (không vòng, không gradient) · `h1` "Đặt hàng thành công" · "Mã đơn hàng **GHP-xxxxxx**" · "Chúng tôi đã gửi xác nhận tới {email}".
- Khung tóm tắt: sản phẩm (tên × SL), phương thức thanh toán + trạng thái, giao hàng + **dự kiến giao**, địa chỉ, tổng tiền. Ghi chú xe lạnh nếu có.
- Nút: primary **"Theo dõi đơn hàng"** → `/don-hang/:ma` · secondary "Tiếp tục mua sắm" · text "In phiếu" (`window.print()`).
- Vào thẳng URL (không có `location.state`) → hiển thị đơn mẫu `GHP-889120` với mã đang xem.

### SCR-10 · Tra cứu đơn · `/tra-cuu-don-hang` · P1
- Căn giữa, form 2 ô (Mã đơn hàng, Số điện thoại) + nút "Tra cứu"; nhập `GHP-889120` (SĐT bất kỳ) → `/don-hang/GHP-889120`; mã khác → hiện trạng thái lỗi mẫu "Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và số điện thoại."

### SCR-11 · Theo dõi đơn hàng · `/don-hang/:ma` · P0
**Trace:** FR-TRK-07 · **Dữ liệu:** `mocks/orders.ts` hard-code (kèm tài xế, nhiệt độ); mã không có trong danh sách → hiển thị đơn mẫu `GHP-889120` với mã đang xem
- Đầu trang: "Đơn hàng #GHP-889120" + `Tag` trạng thái + thời gian đặt; nút: "In hóa đơn" · "Tải hóa đơn điện tử (PDF)" *(mock)* · "Mua lại" · "Hủy đơn" (khi `pending`/`confirmed`).
- **Hành trình (timeline dọc)** 5 mốc: *Tiếp nhận đơn · Đóng gói (đá gel nếu hàng lạnh) · Bàn giao xe lạnh · Đang giao · Hoàn tất*, mỗi mốc có thời gian. Ánh xạ trạng thái: `pending`→mốc 1 · `confirmed`→mốc 2 · `packing`→mốc 2–3 · `shipping`→mốc 4 · `delivered`→mốc 5 · `cancelled`→ banner "Đơn đã hủy". Mốc đã qua: chấm `ok` + dấu ✓ (icon); hiện tại: chấm `brand`; chưa tới: chấm rỗng.
- Giao xe lạnh: khối **Tài xế & xe** (dữ liệu có sẵn trong `OrderSuccessModal`: Nguyễn Văn Hùng · 0914 888 xxx · xe 29C-881.92) và **nhiệt độ thùng** hiện tại (3,2°C, ngưỡng cho phép 2–8°C) — nhãn–giá trị, không icon trang trí.
- Hai cột: trái *Sản phẩm* (bảng) · phải *Giao tới* · *Thanh toán* · *Hóa đơn VAT* (nếu có: MST, công ty) · *Tổng kết chi phí*.

### SCR-21 · Mua sỉ · `/mua-si` · P1
- `h1` "Mua sỉ cho tiệm bánh và nhà hàng". **Lợi ích** (4 gạch đầu dòng, không thẻ icon) · **Bảng chiết khấu minh họa** (3 sản phẩm × mốc số lượng, lấy từ `wholesaleTiers`) · **Quy trình 3 bước** (danh sách đánh số: Đăng ký → Duyệt trong 24 giờ → Mua với giá sỉ).
- **Form đăng ký:** Tên doanh nghiệp, Mã số thuế, Người liên hệ, SĐT, Email, Loại hình (Tiệm bánh · Quán cà phê · Nhà hàng · Xưởng sản xuất), Nhu cầu hàng tháng (select), Ghi chú, Tải giấy phép kinh doanh (ô tải lên mock). Gửi → trạng thái thành công trên cùng trang ("Đã nhận yêu cầu. Chúng tôi sẽ liên hệ trong 24 giờ làm việc.").
- *(P2)* Tab "Yêu cầu báo giá": bảng nhập dòng sản phẩm × số lượng (thêm/xóa dòng) + gửi.

### SCR-22 · Hệ thống cửa hàng · `/cua-hang` · P1
- Danh sách cửa hàng (dùng dữ liệu chân trang: **Kho tổng 120 Cầu Giấy, P. Quan Hoa, Cầu Giấy, Hà Nội** · **Chi nhánh Nam 452 Sư Vạn Hạnh, P.9, Q.10, TP.HCM** · giờ mở cửa 07:30–21:00 · hotline 1900 6899 · contact@giahoaphat.com.vn; thêm tối đa 2 cửa hàng mock để thể hiện hệ thống nhiều chi nhánh). Mỗi cửa hàng: tên, địa chỉ, giờ, SĐT, nhãn dịch vụ ("Nhận hàng tại cửa hàng", "Có kho lạnh"), link "Chỉ đường" (mở Google Maps bằng truy vấn địa chỉ, tab mới).
- **Kiểm tra tồn kho theo cửa hàng:** ô chọn sản phẩm → bảng *Cửa hàng · Tình trạng · Số lượng* (mock). **Không** vẽ bản đồ giả.

### SCR-23 · Hỗ trợ & chính sách · `/ho-tro`, `/ho-tro/:slug` · P1
- Cột trái danh sách chủ đề; phải nội dung dạng văn bản (16px/26, `h1` + `h2`, danh sách, bảng nhỏ). Chủ đề: *Hướng dẫn đặt hàng* · *Giao hàng & chuỗi lạnh* · *Phương thức thanh toán* · *Đổi trả & hoàn tiền* · *Chính sách mua sỉ* · *Câu hỏi thường gặp* (accordion đơn giản) · *Chính sách bảo mật*.
- Nội dung mock (mỗi bài 120–200 từ) **phải khớp con số thật**: giao tiêu chuẩn 25.000₫ (24–48 giờ), xe lạnh 45.000₫ (2–4 giờ), phí đóng gói lạnh 15.000₫ (miễn phí từ 300.000₫), ngưỡng 500.000₫, bảo quản lạnh 2–8°C, voucher `BAKING2026`/`GHPVIP`/`FREESHIP`.

### SCR-24 · Giới thiệu · Liên hệ · `/gioi-thieu`, `/lien-he` · P2
- *Giới thiệu:* 3–4 đoạn ngắn (thành lập 1998, nhiều cửa hàng bán nguyên liệu và thiết bị làm bánh, đang chuyển sang bán trực tuyến), 2 cửa hàng. Không số liệu ảo.
- *Liên hệ:* trái thông tin (địa chỉ, giờ, hotline, email); phải form (Họ tên, Email, SĐT, Chủ đề, Nội dung) → trạng thái thành công tại chỗ.

### SCR-25 · 404 · `*` · P1
- *404:* căn giữa, "Không tìm thấy trang", mô tả 1 dòng, ô tìm kiếm + nút "Về trang chủ".

---

# B · AUTH

### SCR-12 · Đăng nhập · `/dang-nhap` · P0
**Trace:** FR-AUTH-01 · **Layout:** AuthLayout
- `h1` "Đăng nhập". Ô *Email hoặc số điện thoại*, *Mật khẩu* (nút hiện/ẩn), checkbox "Ghi nhớ đăng nhập", link "Quên mật khẩu?", nút primary full-width "Đăng nhập", dòng "Chưa có tài khoản? Đăng ký". Checkbox "Tài khoản đại lý / tiệm bánh mua sỉ" (giữ hành vi `loginAs` hiện có).
- Khối **"Tài khoản demo"** (viền `line`, 12px): 3 nút nhỏ *Khách lẻ · Khách sỉ · Quản trị* → `loginAs(...)` rồi chuyển về `/` (admin → `/admin`).
- Không kiểm tra thông tin: bấm "Đăng nhập" là vào (mặc định khách lẻ; bật checkbox đại lý → khách sỉ).

### SCR-13 · Đăng ký + OTP · `/dang-ky` · P0
**Trace:** FR-AUTH-01 (OTP)
- Bước 1: Họ tên · Email/SĐT · Mật khẩu (kèm danh sách quy tắc: ≥ 8 ký tự, có chữ và số — chỉ hiển thị) · Nhập lại mật khẩu · *Loại tài khoản* (radio: Cá nhân / thợ làm bánh tại gia · Doanh nghiệp / tiệm bánh mua sỉ → hiện MST + tên doanh nghiệp) · checkbox đồng ý điều khoản · nút "Tiếp tục".
- Bước 2: shadcn `InputOTP` **6 ô riêng** (tự nhảy ô, dán được), đếm ngược "Gửi lại mã sau 00:45", ghi chú demo nhỏ "Mã demo: 889966"; nhận **mọi** 6 chữ số; nút "Xác nhận" → đăng nhập + toast + `/tai-khoan`.

### SCR-14 · Quên mật khẩu · `/quen-mat-khau` · P1
- Ô email + "Gửi liên kết đặt lại" → trạng thái thành công trên cùng trang ("Nếu email tồn tại, chúng tôi đã gửi liên kết…") + link "Quay lại đăng nhập".

---

# C · TÀI KHOẢN

### SCR-15 · Tổng quan · `/tai-khoan` · P0
- `h1` "Xin chào, {tên}" + tag loại tài khoản (Khách lẻ / Khách sỉ). **Dải số liệu** (1 khung, 3 ô `divide-x`): *Đơn đang xử lý · Tổng số đơn · Voucher có thể dùng*. **Đơn gần đây** (bảng 3 dòng + link "Xem tất cả"). **Địa chỉ mặc định**. Khách sỉ: thêm khối *Bảng chiết khấu của bạn* và tóm tắt doanh nghiệp.

### SCR-16 · Đơn hàng của tôi · `/tai-khoan/don-hang` · P0
- Tab trạng thái (Tất cả · Chờ xác nhận · Đang xử lý · Đang giao · Hoàn tất · Đã hủy) kèm số lượng; ô tìm theo mã đơn; bảng: *Mã đơn · Ngày · Sản phẩm (2 tên đầu + "+N") · Tổng tiền · Trạng thái · Thao tác* (Xem chi tiết → SCR-11, Mua lại, Hủy). Phân trang. Empty có nút "Xem sản phẩm". Danh sách cố định ~8 đơn (`mocks/orders.ts`).

### SCR-17 · Sổ địa chỉ · `/tai-khoan/dia-chi` · P1
- Danh sách địa chỉ (nhãn, người nhận, địa chỉ, tag "Mặc định") + Sửa · Xóa · Đặt mặc định; nút "Thêm địa chỉ" mở modal form (nhãn, người nhận, SĐT, địa chỉ, tỉnh/thành, đặt mặc định). Dữ liệu từ `currentUser.addresses` (thao tác lưu trong state cục bộ của trang).

### SCR-18 · Yêu thích · `/tai-khoan/yeu-thich` · P1
- Lưới `ProductCard` có nút bỏ yêu thích; empty "Bạn chưa lưu sản phẩm nào". Danh sách cố định 6 sản phẩm. Nút ♡ ở `ProductCard` (góc trên phải ảnh, icon viền, không nền) và SCR-04 chỉ đổi icon (state cục bộ) — *không bắt buộc* đồng bộ với trang này (tùy chọn: `WishlistContext` in-memory).

### SCR-19 · Hồ sơ & mật khẩu · `/tai-khoan/ho-so` · P1
- Hai khối (viền `line`): *Thông tin cá nhân* (họ tên, email chỉ đọc, SĐT, ảnh đại diện — ô tải lên mock) · *Đổi mật khẩu* (hiện tại, mới, nhập lại) · *Thông báo* (checkbox email/SMS). Mỗi khối có nút "Lưu thay đổi" riêng + toast.

### SCR-20 · Doanh nghiệp · `/tai-khoan/doanh-nghiep` · P2 *(mục menu chỉ hiện khi là khách sỉ)*
- Nhãn–giá trị: Tên doanh nghiệp, MST, địa chỉ, người đại diện, email nhận hóa đơn; tag "Đã duyệt"; điều khoản thanh toán (mock); bảng chiết khấu; tài liệu (giấy phép KD — mock).

---

# D · ADMIN (`AdminLayout`)

Mọi bảng admin: tìm kiếm + bộ lọc + phân trang theo `01_design_rules.md` mục 6; thao tác nguy hiểm có modal xác nhận. **Dữ liệu hard-code**; thao tác (đổi trạng thái, sửa tồn kho, duyệt, bật/tắt) chỉ cập nhật hiển thị tại chỗ (state cục bộ của trang) + toast. Bảng dùng shadcn `Table` + TanStack Table; biểu đồ dùng shadcn `Chart` (Recharts). **Không** 4 thẻ KPI có icon màu — dùng *dải số liệu* một khung.

### SCR-A01 · Tổng quan · `/admin` · P0
**Trace:** FR-ADM-08
- `PageHeader` "Tổng quan" + ô chọn "7 ngày qua / 30 ngày qua".
- **Dải số liệu** (1 khung, 4 ô `divide-x`): *Doanh thu · Đơn hàng · Đơn cần xử lý · Cảnh báo tồn kho & HSD* — nhãn 13px `ink-2`, số 24px/600 `tabular-nums`, ghi chú 12px (tăng: `ok`; trung tính: `ink-3`). Doanh thu lấy từ tổng đơn như hiện tại.
- Hàng 2: trái (8/12) **Doanh thu theo ngày** — biểu đồ cột (shadcn `Chart`/Recharts) một màu `brand`, đường lưới `line`, nhãn trục 12px, không gradient, không animation; phải (4/12) **Đơn theo trạng thái** — danh sách nhãn + số + thanh mảnh.
- Hàng 3: trái **Đơn cần xử lý** (bảng 5 dòng, nút "Xử lý"); phải **Cảnh báo** — *Sắp hết hàng* (3 dòng) và *Lô sắp hết hạn* (3 dòng, "còn N ngày"), link → SCR-A07.
- Hàng 4: **Chuyến xe lạnh hôm nay** (bảng 3 dòng).

### SCR-A02 · Danh sách đơn · `/admin/don-hang` · P0
- Tab trạng thái có số đếm (Tất cả · Chờ xác nhận · Đã xác nhận · Đóng gói · Đang giao · Hoàn tất · Đã hủy); thanh công cụ: tìm (mã đơn/tên/SĐT) · lọc *Vận chuyển* (Tất cả/Xe lạnh/Tiêu chuẩn) · *Thanh toán* · khoảng ngày · nút "Xuất CSV" (mock).
- Bảng: ☐ · *Mã đơn* (mono) · *Khách hàng* (+SĐT) · *Ngày tạo* · *Sản phẩm* (n) · *Vận chuyển* (chữ "Xe lạnh" màu `info` nếu có) · *Thanh toán* · *Tổng tiền* (phải) · *Trạng thái* (Tag) · "Xem". Chọn nhiều → thanh hành động ("Xác nhận", "In phiếu xuất kho"). Đổi trạng thái chỉ cập nhật hiển thị tại chỗ.

### SCR-A03 · Chi tiết & xử lý đơn · `/admin/don-hang/:id` · P0
- Đầu trang: mã đơn + Tag trạng thái + **một nút primary theo ngữ cảnh** ("Xác nhận đơn" → "Bắt đầu đóng gói" → "Bàn giao xe lạnh" → "Hoàn tất") + "In phiếu xuất kho" · "In hóa đơn".
- Trái: bảng sản phẩm; **checklist đóng gói lạnh** (khi `requiresColdChain`: thùng xốp · đá gel · nhiệt kế — checkbox, UI); ghi chú khách; **lịch sử trạng thái** (danh sách dòng thời gian). Phải: *Khách hàng* · *Giao tới* · *Thanh toán* · *Hóa đơn VAT* · *Tổng kết*.

### SCR-A04 · Sản phẩm · `/admin/san-pham` · P0
- Công cụ: tìm · lọc *Danh mục · Bảo quản · Tồn kho thấp · Trạng thái* · nút primary "Thêm sản phẩm" → SCR-A05.
- Bảng: ảnh 40px · *Tên + SKU* · *Danh mục* · *Giá* · *Tồn* (chữ `warn` nếu dưới ngưỡng) · *Bảo quản* · *HSD gần nhất* · *Trạng thái* (Đang bán/Ẩn) · menu "…" (Sửa · Ẩn/Hiện · Xóa có xác nhận).

### SCR-A05 · Thêm / sửa sản phẩm · `/admin/san-pham/moi`, `/admin/san-pham/:id` · P0
- Form 2 cột (trái 2/3, phải 1/3), chân dính "Hủy | Lưu sản phẩm". Trái: *Thông tin cơ bản* (tên, SKU, danh mục, thương hiệu, xuất xứ, quy cách, mô tả, thành phần, hướng dẫn sử dụng, hướng dẫn bảo quản) · *Giá & giá sỉ* (giá bán, giá gốc, **bảng bậc thang sửa được**: số lượng tối thiểu · đơn giá · % giảm tự tính; thêm/xóa dòng) · *Kho* (tồn, ngưỡng cảnh báo, điều kiện bảo quản radio, số lô, HSD). Phải: *Trạng thái* (Đang bán/Ẩn) · *Hình ảnh* (ô tải lên mock + xem trước) · *Xem trước thẻ sản phẩm*.
- Lỗi tại chỗ; lưu → toast + về SCR-A04 (dữ liệu mock cập nhật trong state).

### SCR-A06 · Danh mục · `/admin/danh-muc` · P1
- Bảng: ảnh · tên · slug · số sản phẩm · công tắc Hiển thị · "Sửa/Xóa"; nút "Thêm danh mục" mở modal (tên, slug tự sinh, mô tả, ảnh mock).

### SCR-A07 · Tồn kho & lô hàng · `/admin/ton-kho` · P0
**Trace:** FR-ADM-08 · **Dùng lại:** cách sửa tồn kho từ `AdminDashboard` (hoặc chỉ cập nhật hiển thị tại chỗ)
- Tab: *Tồn kho theo sản phẩm* · *Lô hàng & hạn dùng* · *Phiếu nhập/xuất*.
- *Tồn kho:* bảng (SP · SKU · Tồn · Ngưỡng · Trạng thái) + ô sửa số lượng tại chỗ (đúng hành vi hiện có) + nút "Nhập kho" (modal).
- *Lô hàng (FEFO — hết hạn trước xuất trước):* bảng *Lô · Sản phẩm · Số lượng · HSD · Còn lại (ngày) · Kho (Kho lạnh/Kho thường)*; "Còn lại" ≤ 30 ngày chữ `warn`, ≤ 7 ngày chữ `bad`; sắp xếp mặc định theo HSD tăng dần; nút "Điều chỉnh".
- *Phiếu:* bảng lịch sử nhập/xuất (mock).

### SCR-A08 · Khách hàng · `/admin/khach-hang` · P1
- Tab *Tất cả · Khách sỉ · Chờ duyệt (n)*; bảng *Tên · Loại (Lẻ/Sỉ) · SĐT · Số đơn · Tổng chi tiêu · Ngày tạo · Trạng thái*. Tab *Chờ duyệt*: mở drawer hồ sơ doanh nghiệp (MST, giấy phép mock) + nút "Duyệt" / "Từ chối".

### SCR-A09 · Khuyến mãi & voucher · `/admin/khuyen-mai` · P1
- Bảng voucher (3 mã có sẵn + vài mã mock): *Mã · Mô tả · Loại (Cố định/Phần trăm/Phí vận chuyển) · Điều kiện · Lượt dùng · Hiệu lực · Bật/Tắt*; nút "Tạo voucher" mở modal form.

### SCR-A10 · Vận chuyển & chuỗi lạnh · `/admin/van-chuyen` · P1
- Tab *Chuyến giao hôm nay* (bảng: mã chuyến · tài xế · biển số · số đơn · khu vực · **nhiệt độ thùng** hiện tại/min/max · trạng thái; nhiệt độ > 8°C hiện chữ `bad`) · *Nhật ký nhiệt độ* (bảng + biểu đồ đường shadcn `Chart` một màu) · *Phí & ngưỡng* (chỉ đọc: 25.000₫/45.000₫ · miễn phí vận chuyển 500.000₫ · phí đóng gói lạnh 15.000₫, miễn phí từ 300.000₫).

### SCR-A11 · Báo cáo · `/admin/bao-cao` · P1
- Bộ lọc khoảng ngày + "Xuất CSV" (mock). Tab *Doanh thu* (cột theo ngày + bảng) · *Sản phẩm* (top 10 bán chạy, bảng + thanh ngang) · *Khách hàng* (tỉ lệ lẻ/sỉ, khách mua nhiều nhất). Biểu đồ: shadcn `Chart` (Recharts), một màu, không animation.

### SCR-A12 · Nhân viên & phân quyền · `/admin/nhan-vien` · P2
- Bảng nhân viên (*Tên · Email · Vai trò (Quản trị · Quản lý kho · Nhân viên bán hàng · Kế toán) · Cửa hàng · Trạng thái*) + "Mời nhân viên" (modal) + **ma trận phân quyền** (hàng = chức năng, cột = vai trò, ô checkbox).

### SCR-A13 · Cài đặt · `/admin/cai-dat` · P2
- Các nhóm form: *Thông tin cửa hàng* · *Vận chuyển* (phí, ngưỡng miễn phí — hiển thị giá trị hiện có) · *Thanh toán* (công tắc VNPay/MoMo/Chuyển khoản/COD) · *Thông báo email*. Mỗi nhóm có nút "Lưu".

---

# E · DEV

### SCR-D01 · Bộ thành phần giao diện · `/dev/style-guide` · P0
- Mọi thành phần ở `01_design_rules.md` mục 6 với đủ trạng thái (mặc định, hover, focus, disabled, lỗi, loading), bảng màu token, thang chữ. Dùng để tự kiểm tra tính nhất quán và để minh chứng khi báo cáo.

### SCR-D02 · Ma trận yêu cầu · `/dev/requirements` · P0
- Nội dung `SWRMatrixDrawer` chuyển thành trang đầy đủ: bảng responsive, cột *Mã · Tên & loại · Mô tả · Minh chứng trên giao diện (link tới trang tương ứng) · Trạng thái*. Cập nhật chuỗi `verifiedInClient` theo bảng ánh xạ dưới đây (T16).

### SCR-D03 · Sơ đồ use case · `/dev/use-cases` · P2 *(tùy chọn — T18)*
- `h1` "Sơ đồ use case"; **danh sách chọn** 25 sơ đồ (cột trái ở ≥ lg, ô chọn `Select` ở mobile): *Tổng quan*, rồi *1.1 → 1.5* (chức năng của từng tác nhân), rồi *2.1 → 2.19* (từng nhóm chức năng); vùng phải hiện sơ đồ SVG trong `public/diagrams/` (cuộn ngang trong khung nếu rộng hơn); dưới đó là bảng 5 tác nhân (tên, vai trò, số chức năng). Nội dung và hình: `05_use_case_diagram.md`. Chi tiết việc làm: `03_tasks.md` T18.

---

## Ánh xạ yêu cầu → trang (dùng để cập nhật `verifiedInClient`)

| Mã | Trang minh chứng |
|---|---|
| FR-AUTH-01 | `/dang-nhap`, `/dang-ky` (OTP), nút chọn vai trò ở DemoWidget |
| FR-SRC-01 | Ô tìm kiếm ở header (chọn danh mục, gợi ý, Ctrl/⌘+K) và `/tim-kiem` |
| FR-FIL-02 | Cột lọc ở `/san-pham` (bảo quản, thương hiệu, giá, tình trạng) |
| FR-PROD-03 | `/san-pham/:id` — bảng giá sỉ bậc thang, HSD/lô, ghi chú bảo quản |
| FR-KIT-04 | `/combo`, `/combo/:id` — chọn nguyên liệu, thêm cả combo vào giỏ |
| FR-CART-05 | `/gio-hang` và giỏ mini — thanh miễn phí vận chuyển, phí đóng gói lạnh |
| FR-CHK-06 | `/thanh-toan` — 3 bước, xe lạnh/tiêu chuẩn, VNPay QR/MoMo/chuyển khoản/COD |
| FR-TRK-07 | `/don-hang/:ma` — timeline, in hóa đơn; `/dat-hang/thanh-cong/:ma` |
| FR-ADM-08 | `/admin/*` — sản phẩm, danh mục, tồn kho & lô, cảnh báo HSD, đơn hàng |
| NFR-A11Y-01 | Toàn site — tương phản, focus, bàn phím (xem `01_design_rules.md`) |
| BR-RULE-01 | Giỏ hàng, thanh toán, `/san-pham/:id` — hàng lạnh → xe lạnh + phí đóng gói |
| BR-RULE-02 | `/san-pham/:id`, `/gio-hang` — giá tự hạ theo mốc số lượng |

**Use case ↔ màn hình:** mỗi màn hình ở trên phục vụ use case nào — xem cột "Màn hình" ở `05_use_case_diagram.md` mục 7 (148 use case, 1 sơ đồ tổng quan và 19 sơ đồ phân rã).

**Màn hình chưa có FR tương ứng trong ma trận** (SCR-10, 14, 17–22, 24; SCR-A06, A08–A13): ghi chú trong báo cáo là *"đề xuất FR mới"* để nhóm bổ sung vào SRS nếu giữ lại — Antigravity **không** tự sửa tài liệu SRS.

---

## Dữ liệu mock cần tạo (`src/mocks/`) — hard-code trực tiếp

Viết thẳng giá trị vào file, không cần sinh động. Chỉ cần hợp lý; các số nổi bật (tổng doanh thu, tên khách chính, đơn `GHP-889120`) giống nhau giữa các trang.

| File | Nội dung |
|---|---|
| `orders.ts` | ~12 đơn đa trạng thái (kèm `GHP-889120`), của Trần Mai Anh, Lê Hoàng Tuấn và vài khách khác |
| `customers.ts` | ~12 khách (8 lẻ, 4 sỉ, 2 chờ duyệt), khớp tên trong `orders.ts` |
| `reviews.ts` | 3–5 đánh giá/sản phẩm cho vài sản phẩm chính (tên người Việt, ngày hợp lý) |
| `stores.ts` | 2 cửa hàng thật (chân trang) + tối đa 2 mock; tồn kho theo cửa hàng |
| `articles.ts` | Nội dung 7 chủ đề hỗ trợ (khớp con số thật) |
| `batches.ts` | ~10 lô hàng (vài lô gần hết hạn: ≤ 7 ngày, ≤ 30 ngày), vị trí kho |
| `shipments.ts` | ~6 chuyến xe lạnh + nhật ký nhiệt độ (có 1 điểm vượt 8°C để minh họa cảnh báo) |
| `vouchers.ts` | 3 mã có sẵn + vài mã mock |
| `sales.ts` | Doanh thu theo ngày 30 ngày (tổng khớp số trên dashboard hiện tại 152.501.000₫ ± hợp lý) |
| `staff.ts` | ~6 nhân viên, vai trò, cửa hàng |
| `productExtras.ts` | Bảo hành / công suất / kích thước cho các sản phẩm thuộc danh mục thiết bị |

Quy ước: tên người Việt có dấu; SĐT dạng `0912 345 678`; mã đơn `GHP-xxxxxx`; ngày `dd/mm/yyyy`; **ngày "hôm nay" cố định `08/10/2026`** để số liệu không lệch.
