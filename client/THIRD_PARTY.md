# Danh sách thư viện và tài nguyên bên thứ ba (THIRD_PARTY.md)

Tài liệu này ghi nhận toàn bộ thư viện, mã nguồn và tài nguyên mở được sử dụng trong dự án `client/` tuân thủ quy định mục 4 của `ui-spec/README.md`.

## 1. Thư viện mã nguồn mở

| Thư viện | Phiên bản | Giấy phép | Mục đích & Nơi sử dụng |
|---|---|---|---|
| `react-router-dom` | ^7.x | MIT | Định tuyến ứng dụng với HashRouter (`src/router.tsx`) |
| `@fontsource/be-vietnam-pro` | ^5.x | OFL-1.1 | Font chữ thương hiệu Be Vietnam Pro chạy offline (`src/main.tsx`) |
| `lucide-react` | ^1.x | ISC | Bộ icon duy nhất cho toàn bộ hệ thống giao diện |
| `clsx` | ^2.x | MIT | Tiện ích ghép lớp class CSS (`src/lib/utils.ts`) |
| `tailwind-merge` | ^3.x | MIT | Tiện ích hợp nhất xung đột class Tailwind CSS (`src/lib/utils.ts`) |
| `class-variance-authority` | ^0.7.x | Apache-2.0 | Xây dựng các biến thể component cho shadcn/ui |
| `tw-animate-css` | ^1.x | MIT | Hiệu ứng chuyển động giao diện chuẩn |
| `radix-ui` | ^1.x | MIT | Bộ nguyên mẫu giao diện không kiểu dáng phục vụ các thành phần shadcn/ui |
| `@tanstack/react-table` | ^8.x | MIT | Xử lý bảng dữ liệu quản trị DataTable (`src/components/admin/DataTable.tsx`) |
| `date-fns` | ^4.x | MIT | Xử lý và định dạng ngày tháng tiếng Việt |
| `recharts` | ^2.x | MIT | Biểu đồ doanh thu và vận hành quản trị |
| `vaul` | ^1.x | MIT | Ngăn kéo đáy (bottom sheet drawer) cho thiết bị di động |
| `cmdk` | ^1.x | MIT | Hộp tìm kiếm nhanh và gợi ý ⌘K (`src/components/layout/SearchBox.tsx`) |
| `input-otp` | ^1.x | MIT | Thành phần nhập mã xác thực OTP 6 ô rời (`src/components/ui/input-otp.tsx`) |
| `embla-carousel-react` | ^8.x | MIT | Điều khiển cuộn danh mục rail trên mobile |
| `sonner` | ^2.x | MIT | Hiển thị thông báo toast ở góc màn hình (`src/context/ToastContext.tsx`) |

## 2. Tài nguyên hình ảnh

Toàn bộ hình ảnh sản phẩm, danh mục, combo và banner được lưu trữ cục bộ tại `client/public/img/` phục vụ chạy hoàn toàn offline (0 nạp từ URL bên ngoài), tuân thủ định dạng WebP chất lượng cao và phong cách nhiếp ảnh thương phẩm tối giản đồng nhất: phông nền sáng ấm (`#F4F1EC`), góc chụp 40 độ top-down, ánh sáng tự nhiên khuếch tán từ cửa sổ bên trái, đổ bóng mềm mại, không có chữ/logo/nhãn hiệu và không có người/tay người.

| File | Cách | Nguồn / công cụ | Tác giả, giấy phép | Ghi chú / Prompt |
|---|---|---|---|---|
| `placeholder.svg` | Tự tạo | Vector SVG nội bộ | Giấy phép dự án | Nền `#F4F1EC`, icon hộp xám trung tính dự phòng |
| `banners/hero.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "top-down view of a bakery worktop: flour dusted on pale wood, a block of butter, eggs, dark chocolate pieces, vanilla pods and a rolling pin; empty space on the left third, 16:10" |
| `categories/cat-dairy.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a block of unsalted butter unwrapped on parchment paper and a glass jug of fresh cream, warm off-white #F4F1EC background" |
| `categories/cat-flour.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "three small ceramic bowls holding white wheat flour, whole wheat flour and cocoa powder with small wooden scoops" |
| `categories/cat-chocolate.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "dark chocolate callets (couverture pistoles) heaped in a matte porcelain bowl, a few chocolate shards beside it" |
| `categories/cat-flavor.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "amber glass bottles of vanilla extract with dropper pipettes, two whole vanilla beans tied with twine" |
| `categories/cat-tools.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a stainless steel wire whisk, a silicone spatula and a metal dough scraper neatly aligned" |
| `categories/cat-machinery.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a stand mixer and a digital kitchen scale on a clean bakery worktop" |
| `categories/cat-packaging.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "flat-pack kraft cake boxes, a window pastry box, parchment bags and spools of natural ribbon" |
| `categories/cat-combo.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a wooden crate packed with neatly arranged baking ingredients for one recipe" |
| `combos/bundle-tiramisu.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a square slice of tiramisu on a plain white plate dusted with cocoa, an espresso cup beside it, 4:3" |
| `combos/bundle-sourdough.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a rustic round sourdough loaf, scored, with one slice cut showing open crumb, on a linen cloth, 4:3" |
| `combos/bundle-cookies.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "golden Danish-style butter cookies with sugar crystals on parchment, a plain unlabelled round tin beside them, 4:3" |
| `products/prod-01.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a 227g block of chilled unsalted butter in parchment paper, embossed butter texture" |
| `products/prod-02.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a glass carton of pasteurised whipping cream 35% fat, small droplet on spout" |
| `products/prod-03.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a neat paper bag of premium French T45 pastry flour, dusted with a pinch of white flour" |
| `products/prod-04.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a paper sack of high-protein bread flour T65 beside a miniature sheaf of wheat" |
| `products/prod-05.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a shallow porcelain bowl filled with 70% dark chocolate callets (couverture buttons)" |
| `products/prod-06.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "creamy-ivory white chocolate couverture drops in a small ceramic dish" |
| `products/prod-07.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "an amber apothecary bottle of pure Madagascar bourbon vanilla extract with dropper" |
| `products/prod-08.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a small amber tin of green matcha powder with a bamboo scoop (chashaku) resting beside" |
| `products/prod-09.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a 500g vacuum-sealed brick of active dry instant yeast in silver foil" |
| `products/prod-10.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a small glass tub of soft, silky Italian mascarpone cheese with a wooden spatula swipe" |
| `products/prod-11.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a professional 25cm stainless steel wire balloon whisk with ergonomic handle" |
| `products/prod-12.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a translucent white silicone spatula with a brushed beechwood handle" |
| `products/prod-13.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a slim precision digital kitchen scale with brushed stainless steel platform showing 0.0g" |
| `products/prod-14.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a stack of five square kraft cake boxes with clear acetate display windows" |
| `products/prod-15.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a roll of unbleached brown baking parchment paper partially unrolled on stone surface" |
| `products/prod-16.webp` | A | AI Image Generator | Tự tạo qua AI, 10/2026 | "a set of two heavy-gauge gold non-stick 20cm round cake pans" |

- Mã QR demo: File SVG vector tĩnh tự tạo tại `public/qr-demo.svg`, không gọi API bên ngoài.

