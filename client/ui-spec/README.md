# UI SPEC — Gia Hòa Phát Bakery Supply (Topic 1)

Bộ tài liệu giao việc cho **Antigravity** để làm lại giao diện `client/` thành một **prototype website bán hàng chuẩn, đẹp, hiện đại, gọn, sạch và đủ trang** — nhìn như do designer làm, không phải sản phẩm "sinh tự động". **Được dùng framework / mã nguồn mở** (mục 4) để đạt chất lượng cao nhất.

> **Phạm vi: CHỈ GIAO DIỆN** — phần hiển thị, các trang và **hiệu ứng chuyển trang**. Không backend, **không cần bảo mật**, **dữ liệu có thể hard-code**, không đổi công thức nghiệp vụ, không sửa tài liệu SRS trong `docs/`.

> **Trạng thái (09/10/2026):** vòng 1 (T0 → T17) **đã xong**. **Đang ở vòng 2** — sửa các lỗi còn lại để giao diện tự nhiên như web thật: việc cần làm ở **`06_review_round2.md`** (R1 → R16), ảnh ở **`07_image_guide.md`** (được tự tạo ảnh hoặc tìm ảnh trên mạng). Có thêm **sơ đồ use case** ở `05_use_case_diagram.md`.

| File | Nội dung |
|---|---|
| `README.md` | Bối cảnh đề bài, luật bắt buộc, **thư viện được phép**, prompt dán cho Antigravity *(file này)* |
| **`06_review_round2.md`** | **Vòng 2 — đọc trước.** Kết luận, số đo, 27 lỗi, **16 task R1 → R16** với tiêu chí nghiệm thu đo được, prompt vòng 2 |
| **`07_image_guide.md`** | **Ảnh** — được tự tạo hoặc tìm trên mạng; danh sách 28 ảnh, phong cách, prompt mẫu, cách kiểm tra |
| `05_use_case_diagram.md` | **Sơ đồ use case** (hình người que): 1 tổng quan + 19 sơ đồ phân rã, phủ **146 thao tác** người dùng làm được; chức năng của từng tác nhân; use case ↔ màn hình ↔ yêu cầu. Tài liệu tham chiếu |
| `01_design_rules.md` | Nguyên tắc **"không giống AI"**, design tokens, cách retheme shadcn/ui, quy cách thành phần, cách viết nội dung |
| `02_pages.md` | **Danh sách đủ các trang** (40 màn hình + 1 trang dev tùy chọn): đường dẫn, bố cục, thành phần, trạng thái, dữ liệu |
| `03_tasks.md` | Vòng 1: 18 task (T0 → T17, đã xong) + T18 tùy chọn |
| `04_audit_current.md` | Hiện trạng **trước vòng 1** (bằng chứng, số liệu) — chỉ để tham khảo |
| `check-ui.sh` | Kiểm tra tĩnh: "dấu hiệu giao diện AI", nhãn dev, lưới, `<select>` gốc, ảnh ngoài, link chết |
| `check-links.mjs` | Tìm link nội bộ trỏ tới route không tồn tại |
| `check-images.mjs` | Kiểm ảnh: cục bộ, tồn tại, đủ kích thước, không trùng, không mồ côi |
| `audit-runtime.mjs` | Chạy thật 45 route bằng Chrome headless: tràn ngang, ảnh hỏng, lỗi console, nhãn dev, truy cập… |
| `diagrams/` | Sơ đồ use case: `build-use-cases.mjs` (nguồn) + `uc-*.svg` / `uc-*.png` |

**Thứ tự đọc (vòng 2):** `README` → `06_review_round2` → `07_image_guide` → (tham chiếu khi cần) `01_design_rules`, `02_pages`, `03_tasks`, `05_use_case_diagram`.

---

## 1. Bối cảnh đề bài (tóm từ `SWR302_Assignment1_Topics.doc`)

- **Topic 1 — Online Shopping for Baking Ingredients System.** Công ty **Gia Hoa Phat** (ngành thực phẩm) có nhiều cửa hàng bán nguyên liệu làm bánh và thiết bị làm bánh (ví dụ lò nướng). Công ty muốn chuyển từ kinh doanh truyền thống sang **thương mại điện tử**.
- Assignment 1 yêu cầu nhóm nộp tài liệu SRS (IEEE 830) gồm: mục tiêu hệ thống, stakeholder, kịch bản + use case diagram, **prototype/mock-up có *ít nhất các màn hình chính và các chức năng có thể có***, và yêu cầu phi chức năng.
- Prototype nộp ở dạng **file nguồn hoặc HTML**; cả bài nén thành 1 file zip đặt tên `ClassName_Topic#_TopicName.zip`.

**Hệ quả cho giao diện**
1. Phải **đủ màn hình chính + chức năng có thể có** của một cửa hàng nhiều chi nhánh bán nguyên liệu *và* thiết bị làm bánh (khách lẻ, khách sỉ, quản trị/nhân viên cửa hàng).
2. Người chấm mở lên phải **nhìn là hiểu** hệ thống làm được gì: nhất quán, rõ ràng, không rối.
3. Chạy **độc lập, không backend** (dữ liệu mock).
4. Chỉ nội dung Topic 1. Bỏ qua mọi thứ của Topic 2–7 trong file đề.

## 2. Đừng đọc nhầm

`docs/07_ui_wireframes/ui_flow.md`, `docs/04_use_cases/*`, `docs/03_srs/functional_reqs.md`, `docs/02_elicitation/user_personas.md`… hiện là **mẫu của một đề tài đặt lịch dịch vụ** ("Booking", "Provider", "chuyên gia", "khung giờ"). **Không phải Topic 1 — không bám theo.**
Nguồn đúng cho nghiệp vụ Topic 1: các file trong `ui-spec/`, `client/src/data/swrRequirements.ts` và code hiện có trong `client/src/`. Sơ đồ use case đúng của Topic 1: `05_use_case_diagram.md`.

## 3. Luật bắt buộc

1. **Chỉ UI (prototype):** phần hiển thị, các trang, hiệu ứng chuyển trang. Được phép: thêm thư viện theo **mục 4**; tạo file mới (`pages/`, `layouts/`, `components/`, `mocks/`); cấu hình hạ tầng mà thư viện cần (alias `@`, `components.json`, plugin Vite); đưa bộ lọc / sắp xếp / phân trang lên URL query.
2. **Không cần bảo mật. Dữ liệu hard-code được.** Không xác thực thật, không phân quyền route (mọi trang vào được bằng URL; vai trò chỉ làm đổi *phần hiển thị*), không kiểm tra hợp lệ phức tạp, không lưu bền vững. Dữ liệu viết thẳng trong `src/mocks/`; không cần đồng bộ trạng thái giữa các trang (không cần `OrdersContext` / `WishlistContext`).
3. **Hiệu ứng chuyển trang là bắt buộc** (`01_design_rules.md` mục 10.1) và là hiệu ứng tự thêm *duy nhất*; mọi hiệu ứng trang trí khác bị cấm.
4. **Dùng lại nguyên trạng** các context có sẵn: `CartContext` (miễn phí vận chuyển 500.000₫, miễn phí đóng gói lạnh từ 300.000₫, phí đóng gói 15.000₫, voucher `BAKING2026`/`GHPVIP`/`FREESHIP`), `AuthContext` (3 vai trò demo), `ToastContext` (API `showToast`). Công thức đã có (phí vận chuyển tiêu chuẩn 25.000₫ / xe lạnh 45.000₫, giá sỉ bậc thang `getCurrentTierPrice`) thì **sao chép nguyên văn** sang trang mới, không phát minh lại.
5. **Không sửa** `src/data/*`, `src/types/*` (chỉ được *thêm* file/type/field tùy chọn mới). Ngoại lệ: chuỗi `verifiedInClient` trong `swrRequirements.ts` (xem T16) và trường **`imageUrl`** trong `data/products.ts`, `categories.ts`, `recipeBundles.ts` (R4 — `07_image_guide.md`).
6. **Không có "mùi AI"** — xem `01_design_rules.md`. `check-ui.sh` phải về 0 ở cuối. *Dùng thư viện không có nghĩa là giữ giao diện mặc định của nó — phải retheme theo token.*
7. **Chạy được offline**: font bằng `@fontsource` (không CDN), QR là file SVG tĩnh, **mọi ảnh là file cục bộ** trong `public/img/` — được **tự tạo bằng AI** hoặc **tìm ảnh miễn phí trên mạng rồi tải về** (`07_image_guide.md`); không nạp ảnh từ URL ngoài khi chạy.
8. Mỗi task xong: `npm run build` pass · `npm run lint` không tăng cảnh báo · `bash ui-spec/check-ui.sh` không tăng vi phạm · xem lại ở 375 / 768 / 1440px.
9. **Mọi thư viện thêm vào và mọi đoạn mã/ảnh copy từ nguồn mở phải ghi vào `client/THIRD_PARTY.md`** (tên, phiên bản, giấy phép, URL, dùng ở đâu).
10. **Không commit, không push.**
11. Chỗ spec chưa rõ → chọn phương án **đơn giản, trung tính hơn** và ghi chú vào báo cáo cuối. Không tự thêm hiệu ứng / trang trí.

## 4. Nền tảng UI đã chốt & thư viện / mã nguồn mở được phép

### 4.1 Đã chốt: **shadcn/ui** (Radix UI + Tailwind CSS v4)
Dự án đã dùng Tailwind v4 + lucide-react nên shadcn/ui là lựa chọn khớp nhất: hỗ trợ Tailwind v4 + React 19 + Vite; **mã nguồn component nằm ngay trong repo** (`src/components/ui/`) nên sửa được hoàn toàn để khớp token và luật "không mùi AI"; truy cập (a11y) chuẩn Radix; có sẵn đúng thứ ta cần — Command (⌘K), Sheet/Drawer, Data Table, Chart, Input OTP, Sidebar, Breadcrumb, Pagination…
> ⚠️ **Giao diện mặc định của shadcn (zinc/slate, bóng, bo tròn) chính là "diện mạo app AI" quen thuộc.** Bắt buộc retheme theo `01_design_rules.md` mục 4–5 ngay sau khi `init`.

### 4.2 Thư viện được phép (cài khi cần, qua `npx shadcn@latest add …` hoặc `npm i`)

| Mục đích | Thư viện |
|---|---|
| Định tuyến | `react-router-dom` (dùng `HashRouter`) |
| Thành phần nền | `shadcn/ui` → kéo theo `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` |
| Icon (đã có) | `lucide-react` — **không** trộn bộ icon khác |
| Font offline | `@fontsource/be-vietnam-pro` (400/500/600/700, subset `latin` + `vietnamese`) |
| Tìm kiếm ⌘K, gợi ý | `cmdk` (shadcn `Command`) |
| Toast | `sonner` (giữ nguyên API `showToast` của `ToastContext`, chỉ đổi phần hiển thị) |
| Drawer / bottom-sheet mobile | `vaul` (shadcn `Drawer`) và shadcn `Sheet` |
| Bảng dữ liệu admin | `@tanstack/react-table` (shadcn Data Table) |
| Biểu đồ | `recharts` (shadcn `Chart`) — một màu `brand`, không gradient, không animation |
| Form (tùy chọn) | `react-hook-form`, `zod`, `@hookform/resolvers` — không bắt buộc, không cần kiểm tra hợp lệ |
| Lịch / khoảng ngày | `react-day-picker`, `date-fns` (locale `vi`) |
| Mã OTP 6 ô | `input-otp` (shadcn `InputOTP`) |
| Cuộn ngang (rail mobile, nếu cần) | `embla-carousel-react` — **không** làm banner tự chạy |
| Phóng to ảnh (tùy chọn) | `yet-another-react-lightbox` hoặc `Dialog` của shadcn |

Thư viện nào ngoài bảng này: chỉ thêm khi thật sự cần, ghi lý do vào `THIRD_PARTY.md` và báo cáo cuối.

### 4.3 CẤM dùng (vì chính chúng tạo ra "mùi AI" hoặc trộn hai hệ giao diện)
Magic UI · Aceternity UI · mọi bộ "glass / gradient / animated hero / spotlight / aurora" · block sinh sẵn của v0 / Lovable / Bolt dùng nguyên bản · `framer-motion` / `motion` · GSAP · Lottie · `canvas-confetti` · particles · AOS / `animate.css` · three.js · **trộn thêm** Ant Design / MUI / Chakra / Mantine / HeroUI / daisyUI / Flowbite-React (đã chọn shadcn, không dùng hai hệ thành phần cùng lúc) · mọi mẫu **trả phí / bản Pro** (Tailwind UI, Catalyst…).

### 4.4 Mã nguồn mở & tài nguyên có thể lấy về (điều kiện bắt buộc)
- **Giấy phép** MIT / Apache-2.0 / BSD / ISC (ảnh: Unsplash / Pexels). Không GPL, không "chỉ dùng phi thương mại", không bản trả phí.
- Chạy được với **React 19 + Tailwind v4 + Vite**; còn được bảo trì (có commit gần đây).
- Phải **retheme** theo token, **xóa** thương hiệu / logo / văn bản của mẫu, **không** để lại CDN hay script bên ngoài.
- Mã copy về phải qua `check-ui.sh` (0 vi phạm) — gradient, blur, emoji, bo ≥ 2xl… trong mẫu đều phải gỡ.
- Ghi nguồn vào `THIRD_PARTY.md`.

**Nguồn tham khảo cho bố cục** (xem để học cấu trúc, không sao chép thương hiệu):

| Dùng cho | Nguồn |
|---|---|
| Khung admin: sidebar, bảng, form, biểu đồ | shadcn/ui **Blocks** (`dashboard-01`, `sidebar-*`), dự án **shadcn-admin** (`satnaing/shadcn-admin` trên GitHub: Vite + React + shadcn + Tailwind) |
| Đăng nhập / đăng ký | shadcn/ui Blocks (`login-*`) |
| Storefront: thẻ sản phẩm, bộ lọc, giỏ hàng, thanh toán | **HyperUI** (hyperui.dev, mục *Ecommerce*), các khối miễn phí của **Flowbite** và **Preline** — HTML Tailwind do người thiết kế viết tay, dễ chuyển sang React |
| Mô hình các trang admin (danh sách / biểu mẫu / chi tiết / kết quả) | **Ant Design Pro** (chỉ để tham khảo cấu trúc trang) |

### 4.5 Vì sao không chọn khung khác (để nhóm quyết định nếu muốn đổi)
| Khung | Nhận xét |
|---|---|
| **Ant Design** | Rất đủ cho admin, nhìn "doanh nghiệp"; dùng CSS-in-JS riêng nên khó đồng bộ với storefront Tailwind; giao diện cửa hàng bán lẻ cần chỉnh nhiều. |
| **Mantine** | Đẹp, đầy đủ (dates, charts, spotlight); cũng có hệ CSS riêng → trộn với Tailwind khó gọn. |
| **MUI** | Chuẩn, nhưng nặng và mang "diện mạo Material" khó hợp thương hiệu tiệm bánh. |
| **HeroUI / daisyUI / Flowbite-React** | Làm nhanh nhưng mặc định bóng bẩy/hoạt hình → dễ "mùi template/AI", khó gỡ. |

*Nếu nhóm muốn đổi khung: sửa mục 4 trước khi giao; mọi file còn lại viết theo "thành phần ui/" nên đổi nền không phải viết lại trang.*

## 5. Vai trò & dữ liệu demo phải giữ nguyên

| Vai trò | Người dùng demo | Vào được |
|---|---|---|
| Khách lẻ (`customer`) | Trần Mai Anh — thợ làm bánh tại gia | Storefront + Tài khoản |
| Khách sỉ (`wholesale_client`) | Lê Hoàng Tuấn — Chuỗi tiệm bánh Le Parisien | Như khách lẻ + giá sỉ + mục Doanh nghiệp |
| Quản trị (`admin`) | Nguyễn Anh Dương | `/admin/*` |

- Voucher: `BAKING2026` (giảm 30.000₫, đơn từ 200.000₫) · `GHPVIP` (giảm 10%, tối đa 100.000₫) · `FREESHIP` (giảm 25.000₫).
- OTP demo: `889966`. Đơn mẫu có sẵn: `GHP-889120`.
- Các nút chọn nhanh vai trò (phục vụ thuyết trình) **vẫn phải còn**, nhưng chuyển khỏi header: nằm ở **`DemoWidget`** và ở khối "Tài khoản demo" trên trang đăng nhập (xem `01_design_rules.md` mục 11).

## 6. Prompt dán vào Antigravity

### 6.1 Vòng 2 (hiện tại)

Prompt đầy đủ ở **`06_review_round2.md` mục 9**. Bản rút gọn để dán nhanh:

```text
Đọc client/ui-spec/README.md, rồi làm đúng prompt ở 06_review_round2.md mục 9 và các task R1 → R16 (mục 6 cùng file).
Ảnh làm theo 07_image_guide.md: được tự tạo ảnh hoặc tìm ảnh miễn phí trên mạng rồi tải về client/public/img/.
Chỉ làm giao diện, không cần bảo mật, dữ liệu hard-code, không thêm thư viện mới. Không commit.
```

### 6.2 Vòng 1 (đã xong — giữ để tham chiếu)

```markdown
Đóng vai trò Senior Frontend Engineer kiêm UI/UX Designer có kinh nghiệm làm website thương mại điện tử.

Dự án: thư mục `client/` — prototype website "Gia Hòa Phát Bakery Supply" cho Topic 1 môn SWR302
(Online Shopping for Baking Ingredients System: công ty có nhiều cửa hàng bán nguyên liệu và thiết bị
làm bánh, chuyển sang bán hàng trực tuyến). Stack hiện tại: Vite + React 19 + TypeScript + Tailwind CSS v4 + lucide-react.

Nhiệm vụ: làm lại TOÀN BỘ giao diện thành một website bán hàng ĐẸP, HIỆN ĐẠI, chuẩn, gọn gàng, sạch sẽ,
ĐỦ CÁC TRANG (cửa hàng + tài khoản + quản trị), nhìn như do designer làm. Hãy dùng framework / mã nguồn mở
để đạt chất lượng cao nhất theo đúng danh sách ở `ui-spec/README.md` mục 4 (nền: shadcn/ui + Radix + Tailwind v4).
Chỉ cần PHẦN HIỂN THỊ, CÁC TRANG và HIỆU ỨNG CHUYỂN TRANG (một kiểu duy nhất, tinh tế, nhất quán).
Không cần bảo mật; dữ liệu cứ hard-code.
TUYỆT ĐỐI KHÔNG có "mùi AI": không gradient, không kính mờ, không emoji, không icon Sparkles, không hero hoa mỹ,
không thẻ nổi, không chữ Title Case, không số liệu ảo, không hiệu ứng thừa, và KHÔNG giữ nguyên giao diện mặc định
của thư viện — phải retheme theo token trong `01_design_rules.md`.

Cách làm:
1. Đọc lần lượt `client/ui-spec/README.md`, `01_design_rules.md`, `02_pages.md`, `03_tasks.md`.
2. Làm LẦN LƯỢT các task T0 → T17 trong `03_tasks.md`. Sau MỖI task: chạy `npm run build`,
   `npm run lint`, `bash ui-spec/check-ui.sh`, rồi mở http://localhost:5173 kiểm tra ở 375px / 768px / 1440px.
3. Chỉ sang task kế tiếp khi mục "Nghiệm thu" của task hiện tại đã đạt.

Ràng buộc cứng:
- CHỈ làm giao diện (prototype). Không backend, KHÔNG cần bảo mật / phân quyền / kiểm tra hợp lệ; dữ liệu mock cứ
  hard-code trong `src/mocks/`. Không đổi công thức nghiệp vụ trong `src/context/*`.
  Không sửa `src/data/*` và `src/types/*` (chỉ được thêm mới).
- Chỉ dùng thư viện / mã nguồn mở nằm trong danh sách cho phép; giấy phép MIT/Apache/BSD/ISC;
  ghi mọi thứ thêm vào `client/THIRD_PARTY.md`. Cấm các thư viện trong mục 4.3.
- Không commit, không push.
- Chỗ nào spec chưa rõ: chọn phương án đơn giản, trung tính hơn và ghi chú lại. KHÔNG tự thêm trang trí.

Khi xong, báo cáo ngắn gọn: task đã xong / bỏ qua (kèm lý do), kết quả `check-ui.sh`,
danh sách thư viện đã thêm, và liệt kê file đã tạo/xóa.
```

## 7. Chạy & kiểm tra

```bash
cd client
npm run dev                          # http://localhost:5173 (đã chạy sẵn thì không cần chạy lại)
npm run build                        # tsc -b && vite build — phải pass (hiện 1 chunk 1.424 MB, có cảnh báo chunk lớn — R13)
npm run lint                         # baseline: 8 cảnh báo, 0 lỗi — mục tiêu 0
bash ui-spec/check-ui.sh             # baseline: 189 vi phạm — mục tiêu 0
node ui-spec/check-links.mjs         # baseline: 4 link chết — mục tiêu 0
node ui-spec/check-images.mjs        # baseline: 37 lỗi ảnh — mục tiêu 0
node ui-spec/audit-runtime.mjs --viewports=desktop,mobile --all   # baseline: 12 loại lỗi, 3 loại cảnh báo — mục tiêu 0
```

`audit-runtime.mjs` mở 45 route bằng Chrome headless (cần Node ≥ 22, Google Chrome và dev server đang chạy; **không cần cài thêm gói**). Thêm `--viewports=desktop,tablet,mobile --links` để rà cuối, `--routes=<chuỗi>` để chạy riêng vài route, `--shots=<thư mục>` để lưu ảnh chụp. Sơ đồ use case: `node ui-spec/diagrams/build-use-cases.mjs`.

## 8. Cấu trúc thư mục đích

```text
client/
├── components.json          # cấu hình shadcn/ui (do CLI tạo)
├── THIRD_PARTY.md           # danh sách thư viện / mã / ảnh mở đã dùng + giấy phép
├── public/
│   ├── img/                 # MỌI ảnh: products/ categories/ combos/ banners/ + placeholder.svg (07_image_guide.md)
│   └── diagrams/            # (T18, tùy chọn) 20 sơ đồ use case .svg
└── src/
    ├── main.tsx             # Providers + HashRouter
    ├── router.tsx           # bảng route (xem 02_pages.md)
    ├── lib/                 # utils.ts (cn() của shadcn) · labels.ts (nhãn tiếng Việt: trạng thái, thanh toán, vận chuyển)
    ├── layouts/             # StoreLayout · CheckoutLayout · AuthLayout · AccountLayout · AdminLayout
    ├── pages/
    │   ├── store/           # Home, ProductList, Search, ProductDetail, Combo*, Cart, Checkout, OrderSuccess,
    │   │                    # OrderLookup, OrderTracking, Wholesale, Stores, Support, About, Contact, NotFound
    │   ├── auth/            # Login, Register, ForgotPassword
    │   ├── account/         # Overview, Orders, Addresses, Wishlist, Profile, Business
    │   ├── admin/           # Dashboard, Orders, OrderDetail, Products, ProductForm, Categories, Inventory,
    │   │                    # Customers, Promotions, Shipping, Reports, Staff, Settings
    │   └── dev/             # StyleGuide, RequirementsMatrix, (T18) UseCases
    ├── components/
    │   ├── ui/              # shadcn/ui đã retheme + thành phần riêng (Price, Rating, QuantityStepper, Stepper, EmptyState, ProductImage…)
    │   ├── layout/          # SiteHeader, SiteFooter, SearchBox, CategoryMenu, MobileMenu, MiniCart, DemoWidget, PageTransition, ScrollToTop
    │   ├── product/         # ProductCard, ProductGrid, FilterPanel, WholesaleTierTable, StorageNote, …
    │   ├── cart/            # CartLine, OrderSummary, VoucherBox
    │   └── admin/           # PageHeader, StatStrip, DataTable, …
    ├── context/             # giữ nguyên (Cart, Auth, Toast)
    ├── data/                # KHÔNG sửa
    ├── mocks/               # dữ liệu mock mới (reviews, stores, articles, customers, staff, batches, shipments, vouchers, sales…)
    └── types/               # KHÔNG sửa (chỉ thêm)
```

## 9. Nếu thiếu thời gian — ưu tiên

1. **T0 → T10** (nền tảng, storefront, giỏ → thanh toán → theo dõi đơn, đăng nhập/đăng ký): đây là "các màn hình chính" mà đề bài đòi hỏi.
2. **T13** (Admin: tổng quan + đơn hàng) và **T14** (Admin: sản phẩm, tồn kho).
3. Phần còn lại (T11, T12, T15) theo mức ưu tiên P1 → P2 ghi trong `02_pages.md`.
4. **T16 luôn phải làm** (dọn dẹp + `check-ui.sh` về 0 + `THIRD_PARTY.md`), kể cả khi cắt bớt trang.
5. **Vòng 2:** nếu thiếu thời gian, làm **R1 → R2 → R3 → R5 → R4 → R9 → R15 → R16** (P0) trước, rồi **R6 → R7 → R8 → R10 → R11 → R12** (P1), cuối cùng **R13, R14** (P2) và T18.
