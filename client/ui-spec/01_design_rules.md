# 01 · Nguyên tắc thiết kế — đẹp, hiện đại, gọn, sạch và "không giống AI"

## 1. Đích đến nhìn thấy

> **Một website bán hàng thật do designer làm:** nền trung tính, **một** màu nhấn, thông tin rõ ràng, nhiều thứ hữu ích trên mỗi màn hình, rất ít trang trí — *đẹp nhờ chữ, khoảng cách, ảnh sản phẩm tốt và sự nhất quán*, không nhờ hiệu ứng.

Tham chiếu về **bố cục và mật độ thông tin** (không sao chép giao diện): các trang bán lẻ lớn ở Việt Nam (Bách Hóa Xanh, Tiki) cho storefront; Shopify Admin / Stripe Dashboard cho khu quản trị — nền phẳng, viền 1px, bảng dữ liệu chuẩn, nút và ô nhập có kích thước nhất quán.

Hiện tại giao diện mang "mùi AI" rõ rệt (gradient hero + vòng tròn mờ, thẻ kính, emoji, icon Sparkles, bo 24–32px khắp nơi, chữ Title Case, nhãn IN HOA giãn chữ, thẻ 3–4 ô icon giống hệt nhau…). `check-ui.sh` đang đếm **526 vi phạm**; mục tiêu **0**.

**Phạm vi nhớ kỹ:** chỉ *phần hiển thị*, *các trang* và *hiệu ứng chuyển trang*. **Không cần bảo mật** (không xác thực thật, không phân quyền route, không kiểm tra hợp lệ phức tạp). **Dữ liệu có thể hard-code.**

---

## 2. Danh sách CẤM — dấu hiệu "giao diện AI"

| # | Cấm | Dùng thay |
|---|---|---|
| 1 | **Gradient** ở nền, nút, chữ (`bg-linear-*`, `from-/via-/to-`, `bg-clip-text`) | Màu phẳng. Duy nhất được phép: lớp phủ phẳng `bg-black/40` khi đặt chữ lên ảnh |
| 2 | **Kính mờ / glow**: `backdrop-blur`, `blur-*`, vòng tròn mờ trang trí, hạt nhiễu, `shadow-2xl` | Nền trắng + viền 1px |
| 3 | **Bo góc quá lớn** (`rounded-2xl/3xl/[…]`), nút dạng pill, **thẻ lồng thẻ** | `rounded-md/lg/xl`. `rounded-full` chỉ cho avatar, chấm trạng thái, nút icon |
| 4 | **Emoji làm icon**; icon `Sparkles`; icon đặt trong ô vuông/tròn nền pastel | Icon lucide 16/20px đặt cạnh chữ, màu `ink-2`, **không có nền** |
| 5 | Pill "eyebrow" phía trên tiêu đề; nhãn IN HOA chữ nhỏ giãn chữ (`uppercase tracking-*`) | Tiêu đề trơn; nhãn viết câu thường |
| 6 | **Title Case**: "Khởi Đầu Mọi Mẻ Bánh Hoàn Hảo…", "Xem Ngay Bảng Giá Sỉ & Lẻ" | Sentence case: "Xem sản phẩm" |
| 7 | **Lời quảng cáo hoa mỹ**, dấu "!", **số liệu ảo** ("12.000+ thợ bánh", "100% Hoàn Thiện") | Mô tả đúng, ngắn, cụ thể. Chỉ dùng số có trong đề bài/dữ liệu |
| 8 | Lưới 3–4 thẻ "icon + tiêu đề + 2 dòng mô tả" giống hệt nhau (feature cards) | Một hàng chữ có icon nhỏ, hoặc danh sách gạch đầu dòng |
| 9 | **Hiệu ứng trang trí**: `hover:scale/translate`, `active:scale`, float/pulse/bounce, fade-up khi cuộn, shimmer, ảnh zoom khi hover | Chỉ đổi màu nền/viền/chữ 150ms. **Duy nhất** được thêm: hiệu ứng **chuyển trang** (mục 10.1) |
| 10 | Chip pastel có viền cho mọi thứ (nền amber-50 + viền amber-200 + chữ amber-800) | Chữ thường + chấm màu; badge trạng thái chỉ khi cần |
| 11 | Dashboard "4 thẻ KPI có icon màu + pill tăng trưởng", số font mono | Khối số liệu: nhãn nhỏ + số lớn + ghi chú; `tabular-nums` |
| 12 | **Nội dung môn học/demo trong giao diện khách** (chữ "SWR302", "Phục vụ báo cáo đồ án", nút đổi vai trò ở header, "100% Hoàn Thiện") | Gom vào `DemoWidget` + trang `/dev/requirements` |
| 13 | Chữ < 12px; class không tồn tại (`text-2xs`, `animate-in` khi chưa cài plugin…); màu hex cứng trong className | Token trong `@theme`; chữ nhỏ nhất `text-xs` |
| 14 | Hero có ảnh nền + thẻ kính nổi + hàng số liệu | Banner "chia đôi" trong khung viền 1px: chữ bên trái, ảnh bên phải (xem SCR-01) |
| 15 | **Giao diện mặc định của shadcn/ui** (zinc/slate, bóng `shadow-sm/md`, bo tròn mặc định) — nhìn là biết "app AI" | Retheme theo mục 4 ngay sau `init` |
| 16 | Thư viện hiệu ứng (Magic UI, Aceternity, `motion`/framer-motion, GSAP, Lottie, particles) | Không dùng; chuyển trang chỉ bằng `.page-enter` |

---

## 3. Quy tắc NÊN làm

- **Nền:** trang `page` (#FAFAF9); khối nội dung/thẻ/bảng nền trắng + viền `line`. Footer nền `ink`.
- **Một màu nhấn** `brand` (#92400E) cho nút chính, link, mục đang chọn, focus. Giá **không** tô màu nhấn (dùng `ink`); giá giảm/giá gốc: `bad`/`ink-3`; "giá sỉ": `brand`. Màu `ok/warn/bad/info` **chỉ** dùng cho trạng thái.
- **Lưới & khoảng cách:** container tối đa **1200px**, lề ngang 16px (≥ md: 24px); thang khoảng cách 4·8·12·16·24·32·48. Khoảng cách giữa các khối trang 32–48px (không 96px).
- **Mật độ:** danh sách sản phẩm ≥ 4 cột ở desktop; hàng bảng admin 48px; không padding thừa.
- **Thứ bậc:** mỗi màn hình đúng **1 `h1`**; mỗi vùng chỉ **1 nút primary**; nút phụ là outline/text.
- **Căn lề trái** cho nội dung; chỉ căn giữa cho empty state, đăng nhập/đăng ký, trang thành công, 404.
- **Viền & đường kẻ thay cho bóng.** Bóng (`shadow-pop` / `shadow-modal`) chỉ cho dropdown, popover, dialog, sheet và header khi đã cuộn.
- **Đủ trạng thái hiển thị** cho mọi trang/thành phần: mặc định · hover · focus · disabled · empty · lỗi (chỉ cần *hình dạng* của trạng thái, không cần logic thật).
- **Responsive** 375 / 768 / 1024 / 1440: không cuộn ngang; vùng bấm ≥ 44px trên mobile; bảng → cuộn ngang trong khung hoặc chuyển thành danh sách thẻ.
- **Dữ liệu hard-code là chấp nhận được:** tên, số tiền, đơn hàng, biểu đồ… viết thẳng vào `src/mocks/`. Chỉ cần *hợp lý và đẹp*: số liệu nổi bật (tổng doanh thu, tên khách chính, đơn `GHP-889120`) giống nhau giữa các trang. **Không cần** đồng bộ trạng thái giữa các trang.
- **Không cần bảo mật:** đăng nhập nhận mọi thông tin, mã OTP nhận mọi 6 chữ số, mọi route vào được trực tiếp bằng URL. Vai trò chỉ làm thay đổi *phần hiển thị* (nhãn, menu, giá sỉ).

---

## 4. Design tokens & retheme shadcn/ui — nội dung `src/index.css`

**Cách làm**
1. `npx shadcn@latest init` (Vite · TypeScript · Tailwind v4 · CSS variables = yes · alias `@/*` → `src/*`).
2. **Ghi đè** `src/index.css` bằng khối bên dưới (giữ dòng `@import "tw-animate-css";` do CLI thêm).
3. **Xóa** khối `.dark { … }` và `@custom-variant dark` (không làm dark mode).
4. Font: `npm i @fontsource/be-vietnam-pro`, trong `main.tsx` import `@fontsource/be-vietnam-pro/400.css`, `/500.css`, `/600.css`, `/700.css`. **Xóa** mọi `<link>` Google Fonts trong `index.html` (không CDN; **bỏ Rubik và Nunito Sans** — Rubik không có subset tiếng Việt).
5. **Xóa** `src/App.css` (mẫu Vite, không ai import).

```css
@import "tailwindcss";
@import "tw-animate-css";

/* 1) Token thương hiệu — nguồn sự thật duy nhất */
@theme static {
  /* Nhấn: DUY NHẤT một màu thương hiệu */
  --color-brand: #92400E;          /* nút chính, link, mục chọn — 7.1:1 trên trắng */
  --color-brand-hover: #78350F;
  --color-brand-soft: #FBF3EA;     /* nền mục/hàng đang chọn */

  /* Trung tính (xám ấm) — chiếm ~90% giao diện */
  --color-page: #FAFAF9;           /* nền trang */
  --color-surface: #FFFFFF;
  --color-line: #E7E5E4;           /* viền thẻ, đường kẻ */
  --color-line-strong: #D6D3D1;    /* viền nút phụ */
  --color-field: #8A847E;          /* viền ô nhập — 3.7:1 (WCAG 1.4.11) */
  --color-ink: #1C1917;            /* chữ chính — 17.5:1 */
  --color-ink-2: #57534E;          /* chữ phụ — 7.6:1 */
  --color-ink-3: #78716C;          /* chữ mờ — 4.8:1; KHÔNG dùng màu nhạt hơn cho chữ */

  /* Trạng thái — chỉ dùng cho trạng thái */
  --color-ok: #15803D;    --color-ok-soft: #F0FDF4;
  --color-warn: #B45309;  --color-warn-soft: #FFFBEB;
  --color-bad: #B91C1C;   --color-bad-soft: #FEF2F2;
  --color-info: #0369A1;  --color-info-soft: #F0F9FF;   /* hàng lạnh, thông tin */

  --font-sans: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --shadow-pop: 0 4px 16px rgb(28 25 23 / 0.10);        /* dropdown, popover */
  --shadow-modal: 0 12px 40px rgb(28 25 23 / 0.18);     /* dialog, sheet */
}

/* 2) Ánh xạ sang biến của shadcn/ui */
:root {
  --radius: 0.5rem;
  --background: var(--color-page);
  --foreground: var(--color-ink);
  --card: var(--color-surface);
  --card-foreground: var(--color-ink);
  --popover: var(--color-surface);
  --popover-foreground: var(--color-ink);
  --primary: var(--color-brand);
  --primary-foreground: #FFFFFF;
  --secondary: var(--color-page);
  --secondary-foreground: var(--color-ink);
  --muted: var(--color-page);
  --muted-foreground: var(--color-ink-2);
  --accent: var(--color-brand-soft);
  --accent-foreground: var(--color-brand);
  --destructive: var(--color-bad);
  --border: var(--color-line);
  --input: var(--color-field);
  --ring: var(--color-brand);
  --chart-1: var(--color-brand);
  --chart-2: var(--color-ink-3);
  --chart-3: var(--color-info);
  --chart-4: var(--color-ok);
  --chart-5: var(--color-warn);
  --sidebar: var(--color-surface);
  --sidebar-foreground: var(--color-ink);
  --sidebar-primary: var(--color-brand);
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: var(--color-brand-soft);
  --sidebar-accent-foreground: var(--color-brand);
  --sidebar-border: var(--color-line);
  --sidebar-ring: var(--color-brand);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);   /* 4px  — tag */
  --radius-md: calc(var(--radius) - 2px);   /* 6px  — nút, ô nhập */
  --radius-lg: var(--radius);               /* 8px  — thẻ, bảng, popover */
  --radius-xl: calc(var(--radius) + 4px);   /* 12px — dialog, sheet */
}

/* 3) Base */
@layer base {
  *, ::before, ::after { border-color: var(--color-line); }
  html { scroll-padding-top: 5rem; }
  body {
    background: var(--color-page);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 { text-wrap: balance; }
  :focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
  input[type="checkbox"], input[type="radio"] { accent-color: var(--color-brand); }
}

/* 4) Container thống nhất */
@utility wrap {
  width: 100%;
  max-width: 75rem;               /* 1200px */
  margin-inline: auto;
  padding-inline: 1rem;
  @media (width >= 48rem) { padding-inline: 1.5rem; }
}

/* 5) Chuyển trang — hiệu ứng DUY NHẤT tự thêm (xem mục 10.1) */
@keyframes page-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.page-enter { animation: page-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both; }

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Quy ước dùng class:** trong `components/ui/*` (shadcn) giữ tên class của shadcn (`bg-primary`, `text-muted-foreground`, `border-input`…); trong `pages/*` và component riêng dùng token của ta (`bg-surface`, `text-ink-2`, `border-line`, `text-brand`…). Hai bên cùng trỏ về **một** bảng màu.

**Sửa component ngay sau khi `npx shadcn@latest add …`** — bỏ bước này là giữ nguyên diện mạo mặc định của shadcn (= "mùi AI"):

| Component (`components/ui/…`) | Sửa bắt buộc |
|---|---|
| `button` | Bỏ `shadow-*`; cao `h-10` (nhỏ `h-8`, CTA thanh toán `h-12`); `rounded-md`. Variants: `default` (nền `primary`), `outline` (nền trắng, viền `line-strong`, hover nền `background`), `ghost`, `link`, `destructive`. Không `active:scale-*`, không gradient. |
| `input`, `textarea`, `select` (trigger) | `h-10`, `rounded-md`, viền `border-input`, bỏ `shadow-xs`; focus: `border-ring ring-2 ring-ring/20`; lỗi: `border-destructive`. |
| `card` | `rounded-lg border bg-card`, **bỏ shadow**; không đặt Card trong Card. |
| `badge` | Thêm variants `ok · warn · bad · info · neutral` theo token; `h-5 rounded-sm px-1.5 text-xs font-medium`; không pill. |
| `dialog`, `sheet`, `drawer`, `popover`, `dropdown-menu`, `select` (content), `command`, `tooltip` | Thay `shadow-md/lg` → `shadow-pop` (popover/menu) hoặc `shadow-modal` (dialog/sheet/drawer); lớp phủ `bg-black/40`, **xóa** `backdrop-blur*`; dialog `rounded-xl`. |
| `table` | Header nền `bg-background`, chữ `text-[13px] font-medium text-muted-foreground` (câu thường, **bỏ** `uppercase`); hàng cao 48px; hover `bg-background`. |
| `tabs` | Kiểu gạch chân: `TabsList` trong suốt, không viền bo; `TabsTrigger` `rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none`. |
| `sidebar` | Nền trắng + viền phải; mục chọn `bg-sidebar-accent text-sidebar-accent-foreground`; icon 16px. |
| `chart` | Series dùng `--chart-1…5` (chủ yếu `brand`); lưới `line`; tooltip đơn giản; **tắt animation** của Recharts (`isAnimationActive={false}`). |
| `sonner` | Thẻ trắng viền `line`, góc dưới phải, không `richColors`, không blur. |
| `input-otp`, `calendar`, `breadcrumb`, `pagination`, `accordion`, `slider`, `switch`, `checkbox`, `radio-group`, `command`… | Bỏ `shadow-*`, `tracking-*`, `uppercase`; màu theo token; vùng bấm ≥ 44px trên mobile. |

**Bảng tương phản đã tính** (chữ ≥ 4.5:1; viền ô nhập ≥ 3:1):

| Cặp màu | Tỉ lệ |
|---|---|
| `ink` / `page` · `ink` / trắng | 16.7 · 17.5 |
| `ink-2` / trắng · `ink-3` / trắng · `ink-3` / `page` | 7.6 · 4.8 · 4.6 |
| `brand` / trắng · `brand` / `brand-soft` · trắng / `brand-hover` | 7.1 · 6.5 · 9.1 |
| `ok` · `warn` · `bad` · `info` trên trắng | 5.0 · 5.0 · 6.5 · 5.9 |
| `ok/warn/bad/info` trên nền `-soft` tương ứng | 4.8 · 4.8 · 5.9 · 5.6 |
| `#D6D3D1` · `#A8A29E` trên `ink` (chữ footer) | 11.7 · 6.9 |
| `field` (#8A847E) / trắng · / `page` | 3.7 · 3.5 |

---

## 5. Typography — một họ chữ, ít cỡ

Họ chữ duy nhất: **Be Vietnam Pro**, trọng số 400 / 500 / 600 / 700. Không IN HOA, không giãn chữ, không `font-black`, không font serif/display.

| Vai trò | Cỡ / dòng | Đậm |
|---|---|---|
| `h1` trang ứng dụng | 24 / 32 | 600 |
| `h1` banner trang chủ | 36 / 44 (mobile 28 / 36) | 600 |
| `h2` khối trang | 20 / 28 | 600 |
| `h3` / tên thẻ | 16 / 24 | 600 |
| Chữ giao diện (mặc định) | 14 / 22 | 400 (nhãn 500) |
| Đoạn văn dài (mô tả, chính sách) | 16 / 26 | 400 |
| Phụ / chú thích | 12–13 / 18 | 400, màu `ink-2/ink-3` |
| Giá lớn (chi tiết SP, tổng tiền) | 28 / 36 | 700 |
| Giá trong thẻ | 16 / 24 | 600 |

Chữ nhỏ nhất **12px**. Số tiền, số lượng, mã đơn: `tabular-nums`. `font-mono` chỉ cho SKU, số lô, mã đơn, mã OTP.

---

## 6. Quy cách thành phần (`components/ui/` = shadcn đã retheme + thành phần riêng)

Bán kính: **nút, ô nhập** `rounded-md` (6px) · **thẻ, bảng, popover** `rounded-lg` (8px) · **dialog, sheet** `rounded-xl` (12px) · **tag** `rounded-sm` (4px) · `rounded-full` chỉ cho avatar/chấm/nút icon.

| Thành phần | shadcn/ui | Quy cách (sau khi retheme) |
|---|---|---|
| **Button** | `button` | Xem bảng sửa ở mục 4. Chữ 14px/500, icon 16px cách chữ 8px. Disabled `opacity-50 cursor-not-allowed`. Loading: spinner 16px thay icon, giữ nguyên độ rộng. Trong 1 vùng chỉ 1 nút primary. |
| **Input / Textarea / Select** | `input` `textarea` `select` `label` | Cao 40px; nhãn nằm **trên** ô (14px/500); bắt buộc đánh dấu `*` màu `bad`; lỗi: viền `bad` + thông báo 12px `bad` bên dưới (chỉ cần dựng *hình dạng* trạng thái lỗi). Ô có icon: icon trái 16px `ink-3`. |
| **Checkbox / Radio / Switch** | `checkbox` `radio-group` `switch` | 16px (switch 36×20), nhãn 14px, vùng bấm là cả dòng. |
| **Card / Panel** | `card` (hoặc `div`) | Nền trắng, viền `line`, `rounded-lg`, padding 16/24. **Không bóng. Không thẻ trong thẻ** — chia vùng bằng `divide-y`. |
| **Tag / Badge** | `badge` | Cao 20px, chữ 12px/500. Trạng thái: nền `*-soft` + chữ màu trạng thái. Trung tính: nền `page` + chữ `ink-2` + viền `line`. Tối đa 1 badge mỗi ô/dòng. |
| **Tabs** | `tabs` | Gạch chân; mục chọn chữ `ink` + viền dưới 2px `brand`; mục khác `ink-2`; mobile cuộn ngang. |
| **Table** | `table` + `@tanstack/react-table` | Khung viền `line` `rounded-lg`; header nền `page`, chữ 13px/500 `ink-2` (**câu thường**); hàng 48px, hover nền `page`; số căn phải + `tabular-nums`; header dính khi cuộn; chân bảng có phân trang. Hàng chọn: nền `brand-soft`. |
| **Pagination** | `pagination` | Trái: "Hiển thị 1–12 / 48". Phải: nút trước/sau + số trang 32px; trang hiện tại nền `brand`, chữ trắng. |
| **Breadcrumb** | `breadcrumb` | 13px `ink-2`, ngăn cách `/`, mục cuối `ink`. |
| **Dialog (modal)** | `dialog` | `rounded-xl`, `shadow-modal`, lớp phủ phẳng `bg-black/40`; tiêu đề 18px/600; chân: Hủy = outline, Xác nhận = primary. Mobile: dùng `drawer` (bottom sheet, `max-h-[90dvh]`). |
| **Sheet / Drawer** | `sheet` (phải/trái), `drawer` (đáy, mobile) | Rộng 400px (mobile 100%); cùng quy cách dialog. |
| **Menu thả, Popover, Tooltip** | `dropdown-menu` `popover` `tooltip` | `rounded-lg`, `shadow-pop`, mục cao 36px. |
| **Command (⌘K, gợi ý tìm kiếm)** | `command` | Trong `popover` ở header và `CommandDialog` cho Ctrl/⌘+K; mục cao 44px. |
| **Toast** | `sonner` | Góc dưới phải; trắng, viền `line`, `shadow-pop`; icon trạng thái 16px; tự tắt 4 giây; tối đa 3. Giữ API `showToast` của `ToastContext`, chỉ đổi phần hiển thị. |
| **Accordion** | `accordion` | Bộ lọc mobile, FAQ: viền dưới `line`, mũi tên 16px. |
| **Slider** | `slider` | Khoảng giá: track 4px, thumb 16px viền `brand`. |
| **Input OTP** | `input-otp` | 6 ô 44×48px. |
| **Calendar / chọn ngày** | `calendar` + `popover` | Locale `vi`; chỉ dùng ở admin (báo cáo, đơn). |
| **Sidebar** | `sidebar` | Khung admin (mục 7). |
| **Chart** | `chart` (Recharts) | Một màu `brand`; lưới `line`; nhãn trục 12px; **không** animation, không gradient. |
| **Empty state** | *riêng* | Căn giữa: icon 32px `ink-3` (**không nền**), tiêu đề 16/600, mô tả 14px `ink-2`, 1 nút. |
| **Skeleton** | `skeleton` | Khối `bg-line` **tĩnh** (bỏ `animate-pulse`). |
| **Stepper** (thanh toán) | *riêng* | Số trong vòng 24px; hiện tại nền `brand`; xong: icon `Check`; chưa: viền `line-strong`; đường nối 1px. |
| **Price** | *riêng* | Giá hiện tại `ink` đậm; giá gốc gạch ngang `ink-3`; `-15%` là tag `bad`; "giá sỉ" `brand`; định dạng `78.000₫`. |
| **Rating** | *riêng* | Icon `Star` 14px màu `warn` + "4.9 (342)" 13px `ink-2`. |
| **Quantity stepper** | *riêng* | `[−] [số] [+]`, cao 40px, viền `field`, cho phép gõ số. |
| **Avatar** | `avatar` | Tròn 32px, nền `brand-soft`, chữ cái đầu `brand` 14px/600. |

---

## 7. Khung trang (layouts)

**Mọi layout** bọc vùng nội dung bằng `PageTransition` (mục 10.1). Phần khung (header, footer, sidebar, `DemoWidget`) đứng yên khi chuyển trang.

**StoreLayout** — dùng cho storefront và tài khoản
1. *Thanh tiện ích* (ẩn trên mobile): cao 36px, nền trắng, viền dưới `line`, chữ 12px `ink-2`. Trái: "Hotline 1900 6899 · 07:30–21:00 hằng ngày". Phải: `Hệ thống cửa hàng · Tra cứu đơn hàng · Hỗ trợ`. **Không cuộn theo.**
2. *Header* **dính**, nền trắng, viền dưới `line`, cao 64px (mobile 56px): logo chữ **"Gia Hòa Phát"** 20px/700 (+ dòng nhỏ "Bakery Supply" 12px `ink-3`, ẩn trên mobile) · **ô tìm kiếm** rộng (`flex-1`, tối đa 640px, ô chọn danh mục bên trái + input + nút tìm; gợi ý sản phẩm/danh mục khi gõ; **Ctrl/⌘ + K** để focus) · cụm phải: Yêu thích · Tài khoản (hiện tên hoặc "Đăng nhập") · Giỏ hàng (có số lượng). Nhãn chữ chỉ hiện ≥ xl; dưới đó chỉ icon 20px. Tổng chiều cao phần dính ≤ **64px**.
3. *Thanh danh mục* (không dính, cao 40px, viền dưới `line`): nút "Danh mục" mở menu thả 8 danh mục (kèm số sản phẩm) + vài link danh mục chính + bên phải: "Combo công thức", "Mua sỉ".
4. *Footer* nền `ink`, chữ `#D6D3D1`, 4 cột: Gia Hòa Phát (mô tả ngắn + 2 cửa hàng + hotline/email) · Mua hàng · Hỗ trợ · Về chúng tôi; hàng cuối: phương thức thanh toán (chữ: VNPay · MoMo · Chuyển khoản · Thanh toán khi nhận hàng) và dòng bản quyền + **một dòng** "Prototype phục vụ môn SWR302 — Topic 1" (12px, `#A8A29E`). Không icon trang trí, không thẻ.
5. *Mobile (< 1024px):* hàng 1 dính: ☰ · logo · giỏ hàng; hàng 2 (không dính): ô tìm kiếm full-width. ☰ mở **sheet trái**: tài khoản, danh mục, combo, mua sỉ, cửa hàng, hỗ trợ.

**CheckoutLayout** — header tối giản: logo + "Quay lại giỏ hàng" + dòng "Thanh toán an toàn" (icon khóa 16px). Không tìm kiếm, không thanh danh mục.

**AuthLayout** — header tối giản (logo + "Về trang chủ"); nội dung là khối trắng viền `line` rộng tối đa 420px, căn giữa trên nền `page`.

**AccountLayout** — trong StoreLayout: breadcrumb + 2 cột: trái là danh sách điều hướng 240px (Tổng quan · Đơn hàng · Địa chỉ · Yêu thích · Hồ sơ · Doanh nghiệp *(mục này chỉ hiện khi là khách sỉ)*; mục đang chọn nền `brand-soft`, chữ `brand`); phải là nội dung (`PageTransition` chỉ bọc cột phải). Mobile: điều hướng thành tab cuộn ngang.

**AdminLayout** — shadcn `Sidebar` trái 240px (nền trắng, viền phải `line`; logo + nhóm mục: *Tổng quan* · *Bán hàng* (Đơn hàng, Khách hàng, Khuyến mãi) · *Sản phẩm* (Sản phẩm, Danh mục, Tồn kho & lô) · *Vận hành* (Vận chuyển & chuỗi lạnh, Báo cáo) · *Hệ thống* (Nhân viên & phân quyền, Cài đặt); mục chọn nền `brand-soft` chữ `brand`; icon 16px). Thanh trên cao 56px: tiêu đề/breadcrumb · "Xem cửa hàng" · menu người dùng. Nội dung nền `page`, lề 24px, `PageTransition` chỉ bọc vùng nội dung. Mobile: sidebar thành sheet. **Không kiểm tra quyền** — vào `/admin` bằng URL, bằng menu tài khoản hoặc bằng `DemoWidget` đều được.

**PageHeader** (dùng ở mọi trang ứng dụng/admin): `h1` 24px/600 bên trái (+ mô tả 14px `ink-2` dưới), nhóm nút hành động bên phải; cách nội dung 16px.

---

## 8. Cách viết nội dung (copy)

- **Câu thường** (sentence case) cho mọi tiêu đề, nút, nhãn: "Thêm vào giỏ", "Thanh toán", "Xem tất cả". Không IN HOA từ, không dấu "!".
- Giọng trung tính, hữu ích, ngắn. Nói **điều gì** và **làm gì tiếp**.
- Thuật ngữ cố định: **Giỏ hàng · Đặt hàng · Thanh toán · Giá sỉ · HSD (hạn sử dụng) · Giao lạnh / Xe lạnh · Khách lẻ · Khách sỉ · Tiệm bánh · Cửa hàng**.
- Định dạng: tiền `78.000₫` · ngày `28/11/2026` · nhiệt độ `2–8°C` (gạch nối en) · khối lượng `227g` · điện thoại `0912 345 678`.
- Thông báo lỗi (khi có) nói rõ cách sửa: "Số điện thoại chưa đúng. Nhập 10 chữ số, bắt đầu bằng 0."
- Không số liệu ảo / lời khen chung chung. Chỉ dùng số có trong đề bài hoặc dữ liệu (1998, 2 cửa hàng, ngưỡng 500.000₫…).

| Hiện tại | Thay bằng |
|---|---|
| Khởi Đầu Mọi Mẻ Bánh Hoàn Hảo Cùng Gia Hòa Phát | Nguyên liệu và thiết bị làm bánh chính hãng |
| Tổng kho nguyên liệu nhập khẩu chính ngạch… Cam kết giao hỏa tốc xe lạnh 2-4h bảo quản tươi nguyên. | Bơ, sữa, bột, socola, khuôn và máy móc từ các thương hiệu nhập khẩu. Hàng cần bảo quản lạnh giao bằng xe lạnh trong 2–4 giờ. |
| Xem Ngay Bảng Giá Sỉ & Lẻ | Xem sản phẩm |
| Đặt Hàng Thành Công! | Đặt hàng thành công |
| Chúc mừng! Bạn đã đủ điều kiện Miễn phí vận chuyển toàn quốc! | Đơn hàng được miễn phí vận chuyển |
| Tiện ích độc quyền cho Thợ làm bánh | *(bỏ — dùng tiêu đề "Combo nguyên liệu theo món")* |
| Phục vụ báo cáo đồ án SWR302 (Chọn nhanh vai trò) | Đăng nhập nhanh bằng tài khoản demo |

---

## 9. Ảnh & icon

- **Icon:** chỉ `lucide-react`, 16px (nút, ô nhập, menu) / 20px (header) / 32px (empty state), `strokeWidth={1.75}`, màu kế thừa chữ. Icon **không** nằm trong ô tròn/vuông có nền.
- **Ảnh sản phẩm:** khung vuông 1:1, `object-cover`, nền `page`, `loading="lazy"`, `alt` = tên sản phẩm; ảnh lỗi → nền `page` + icon `Package` 32px `ink-3`.
- **Ảnh banner / danh mục (để giao diện đẹp):** chọn ảnh thật chất lượng cao từ **Unsplash / Pexels** (giấy phép miễn phí), **cùng tông ấm, cùng kiểu chụp**, tải về `public/img/` (chạy offline), ghi nguồn vào `THIRD_PARTY.md`. Banner tỉ lệ ~5:2. **Không** minh họa, blob, hình trang trí.
- Hình QR thanh toán: file SVG tĩnh trong `public/` (không gọi API ngoài).

---

## 10. Chuyển động, chuyển trang & truy cập (a11y)

### 10.1 Chuyển trang — BẮT BUỘC
Mọi lần đổi trang đều có hiệu ứng, **một kiểu duy nhất, nhất quán toàn site**:

- **Kiểu:** nội dung trang *hiện dần + trồi lên 8px* — `opacity 0→1`, `translateY(8px→0)`, **220ms**, easing `cubic-bezier(0.22, 1, 0.36, 1)` (class `.page-enter` ở mục 4). Không có hiệu ứng thoát: trang cũ biến mất ngay, trang mới vào.
- **Chỉ vùng nội dung chuyển.** Header, thanh danh mục, footer, sidebar (admin/tài khoản), `DemoWidget` **đứng yên** (nằm ngoài phần tử có `key`).
- **Cách làm:** component `PageTransition` bọc `<Outlet />` trong mỗi layout:
  ```tsx
  const { pathname } = useLocation();
  return <div key={pathname} className="page-enter">{children}</div>;
  ```
  **Key theo `pathname`** (không theo query): đổi bộ lọc / sắp xếp / phân trang ở `/san-pham?…` **không** chạy lại hiệu ứng; đổi `:id` ở `/san-pham/:id` thì có.
- **Đổi layout** (Store ↔ Auth ↔ Checkout ↔ Admin): vùng nội dung dùng cùng kiểu trên; khung của layout mới hiện ngay, không animation.
- **Cuộn:** mỗi lần đổi `pathname` cuộn về đầu trang ngay (không smooth); neo `#…` thì cuộn tới neo. Back/Forward vẫn chạy hiệu ứng.
- **Tab / bước trong cùng một trang** (tab ở chi tiết sản phẩm, tab đơn hàng, tab admin): chéo mờ **150ms** (`opacity`), không trượt. **Bước thanh toán 1→2→3:** nội dung bước mới trượt vào 16px từ phía hướng tới + hiện dần 200ms (quay lại thì ngược lại).
- **Cấm:** trượt cả trang sang ngang, lật/scale/xoay, hiệu ứng le-le từng phần tử (stagger), thanh tiến trình giả, hiệu ứng khi cuộn, `motion`/framer-motion.
- **Hiệu năng:** chỉ animate `opacity` và `transform`; ≤ 250ms; không nháy trắng, không nhảy layout giữa hai trang.
- **`prefers-reduced-motion: reduce`:** tắt toàn bộ (khối `@media` ở mục 4).
- *(Tùy chọn P2 — chỉ làm sau khi bản chuẩn đã ổn)* **Chuyển ảnh dùng chung** từ thẻ sản phẩm sang trang chi tiết bằng View Transitions API (`createHashRouter` + `viewTransition` của React Router). Nếu giật hoặc nháy thì bỏ, giữ bản chuẩn.

### 10.2 Chuyển động khác
- **Cho phép:** đổi màu nền/viền/chữ 150ms; hiệu ứng vào/ra mặc định của shadcn/Radix (`tw-animate-css`: overlay fade, dialog fade + zoom-95, sheet trượt) **chỉ trong `components/ui/`**, ≤ 200ms.
- **Không:** scale/translate khi hover, float, pulse, shimmer, hiện dần khi cuộn.

### 10.3 Truy cập (a11y)
- Tương phản chữ ≥ 4.5:1; viền ô nhập ≥ 3:1; focus ring luôn thấy; vùng bấm ≥ 44px trên mobile; `cursor-pointer` cho mọi phần tử bấm được.
- Điều hướng bàn phím đầy đủ: logo, thẻ sản phẩm, menu thả, dialog (focus trap, `Esc` — Radix lo sẵn), tab. Nút icon có `aria-label`. Ảnh có `alt`.

---

## 11. `DemoWidget` & khu vực "không phải của khách"

Mọi thứ phục vụ thuyết trình/môn học **không** nằm trong giao diện khách:

- **`DemoWidget`**: một nút nhỏ "Demo" (cao 32px, nền `ink`, chữ trắng, 12px) cố định góc **dưới trái** (trên mobile đặt cao hơn thanh dính đáy của SCR-04, `bottom` ≥ 72px, để không che nút "Thêm vào giỏ"), bấm mở `Popover` gồm: *Vai trò hiện tại* → 3 nút chọn nhanh **Khách lẻ · Khách sỉ · Quản trị** (gọi `loginAs` sẵn có) · liên kết "Ma trận yêu cầu (SWR302)" → `/dev/requirements` · liên kết "Bộ thành phần giao diện" → `/dev/style-guide`. Không icon trang trí, không hiệu ứng.
- **Trang đăng nhập:** thêm khối viền `line` tên "Tài khoản demo" dưới form, 3 nút nhỏ như trên.
- **`/dev/requirements`:** chuyển nội dung `SWRMatrixDrawer` sang trang đầy đủ (bảng responsive). **`/dev/style-guide`:** hiển thị mọi thành phần ở mục 6 cùng các trạng thái.
- Footer có đúng **một dòng** prototype (xem mục 7). Ngoài các chỗ này, chữ "SWR302" **không** xuất hiện trong giao diện (`check-ui.sh` kiểm tra).

## 12. Kiểm tra

```bash
bash ui-spec/check-ui.sh   # 0 vi phạm: gradient · blur · bo góc lớn · bóng nặng · hiệu ứng · Sparkles ·
                           # IN HOA · chữ nhỏ · hex cứng · cụm từ quảng cáo · emoji · "SWR302" lọt ra ngoài
```
Ngoài script, **tự rà bằng mắt**: Title Case còn sót, thẻ lồng thẻ, nhãn pastel, icon trong ô màu, khoảng cách lệch thang 4, hai nút primary trong một vùng, chữ mờ dưới 4.5:1, **giao diện mặc định của shadcn còn sót** (bóng, bo tròn, xám zinc), hiệu ứng chuyển trang giật/nháy.
