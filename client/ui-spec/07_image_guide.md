# 07 · Hướng dẫn ảnh (tự tạo hoặc tìm trên mạng)

Ảnh là thứ làm giao diện trông "như web thật" nhiều nhất — và hiện là điểm yếu lớn nhất: **khoảng một nửa ảnh sản phẩm không khớp nhãn**, có ảnh hỏng, có ảnh lặp (xem mục 2). Tài liệu này cho phép Antigravity **tự tạo ảnh** hoặc **tìm ảnh trên mạng** để thay toàn bộ, kèm danh sách ảnh cần có, phong cách thống nhất, cách đặt file và cách kiểm tra.

> Việc này là **R4** trong `06_review_round2.md`. Làm xong R1 → R3 rồi mới làm R4.

---

## 1. Được phép gì

Antigravity được **chọn một trong hai cách, hoặc kết hợp** cho từng ảnh:

| Cách | Khi nào dùng | Bắt buộc |
|---|---|---|
| **A. Tự tạo ảnh** bằng công cụ tạo ảnh có sẵn (Imagen, Nano Banana hoặc tương đương trong Antigravity) | Sản phẩm cụ thể mà ảnh trên mạng không có hoặc không đúng (bao bì không chữ, bộ combo, khuôn bánh mì gối…) | Ghi công cụ, ngày, prompt vào `THIRD_PARTY.md`. Không có người, không có chữ, không có nhãn hiệu thật |
| **B. Tìm ảnh miễn phí trên mạng** rồi **tải về** `public/img/` | Ảnh nguyên liệu, món bánh, không gian tiệm — nơi ảnh chụp thật nhìn tự nhiên hơn ảnh AI | Chỉ lấy từ **Unsplash, Pexels, Pixabay, Wikimedia Commons** (giấy phép cho phép dùng miễn phí/thương mại; Commons chỉ lấy CC0, CC BY, CC BY-SA). Ghi tác giả, giấy phép, URL vào `THIRD_PARTY.md` |

**Luật chung (cả hai cách):**

1. **Không nạp ảnh từ URL ngoài khi chạy** (không hotlink Unsplash/Pexels). Mọi ảnh là **file cục bộ** trong `client/public/img/` — prototype phải chạy offline.
2. **Ảnh phải đúng nhãn.** Tên sản phẩm là "Bơ lạt" thì ảnh là bơ. Không có ảnh đúng → tạo bằng cách A. Tuyệt đối không dùng ảnh "gần giống" hay ảnh không liên quan để cho đủ.
3. **Không chữ, không logo, không nhãn hiệu có thật** trong ảnh (Anchor, Tatua, Callebaut… đều là nhãn hiệu thật — vẽ bao bì trơn, giấy gói trắng hoặc kraft không chữ). Không hình người, không bàn tay, không watermark.
4. **Không lặp ảnh:** mỗi sản phẩm, danh mục, combo một file riêng. Một ảnh không được xuất hiện ở hai chỗ khác nhau của trang chủ.
5. **Một bộ ảnh thống nhất** (mục 4): cùng nền, cùng hướng sáng, cùng góc máy. Ảnh lẻ loi nền đen, nền xanh, ảnh "mood" tối là lý do trang chủ hiện nhìn tạp.
6. **Ảnh tạo bằng AI không được trông như AI:** màu tự nhiên (không bão hòa quá), bề mặt có kết cấu thật (không bóng nhựa), chi tiết đúng hình học (nếp giấy, nắp hũ, phới đánh trứng), không chữ méo mó. Soi phóng to 100% trước khi nhận; ảnh nào còn nghi ngờ thì tạo lại.

## 2. Hiện trạng cần sửa (đã đo)

Nguồn: `check-ui.sh` (32 chỗ nạp ảnh từ URL ngoài), `audit-runtime.mjs` (ảnh hỏng), xem trực tiếp trên trang.

**Sản phẩm (16):**

| Mức | Sản phẩm | Ảnh hiện tại thực tế là gì |
|---|---|---|
| **Sai hẳn** | prod-06 Socola Callebaut | Con mèo nằm trên chăn trắng |
| | prod-09 Tinh dầu vanilla | Bánh cupcake kem |
| | prod-11 Khuôn bánh mì gối | Nồi gang màu cam trong bếp |
| | prod-12 Phới dẹt silicone | Đĩa cơm chiên cà rốt |
| | prod-13 Cân điện tử tiểu ly | Sân khấu, khán phòng ánh xanh |
| | prod-14 Máy đánh trứng | **Ảnh chết** (URL không còn): hiện chữ "Máy…" ở trang chi tiết và admin |
| **Gần đúng** | prod-03 Mascarpone | Khay phô mai với bánh mì, trứng |
| | prod-04 Bột mì số 13 | Ổ bánh mì (không phải bột) — trùng ảnh banner và danh mục |
| | prod-05 Men khô Mauripan | Kệ bày bánh mì |
| | prod-08 Bột trà xanh matcha | Cốc trà đen có túi lọc |
| | prod-10 Mứt dâu tây | Miếng bánh nhân trái cây |
| **Trùng** | prod-15, prod-16 (combo) | Dùng lại ảnh món thành phẩm của `bundle-tiramisu` / `bundle-sourdough` |
| Đúng | prod-01 Bơ, prod-02 Kem tươi, prod-07 Cacao | Giữ ý tưởng, chụp lại cho cùng phong cách |

**Danh mục (8):** `cat-chocolate` = mèo trên chăn · `cat-machinery` = sân khấu · `cat-packaging` = **con gấu** · `cat-tools` = nồi gang · `cat-flavor` = cupcake · `cat-dairy` trùng ảnh prod-01 · `cat-flour` trùng prod-04 và banner · `cat-combo` tạm chấp nhận (bánh socola) nhưng nên đổi cho đúng chủ đề.

**Combo (3):** `bundle-cookies` đang là bánh quy chocolate chip trong khi tên là bánh quy bơ Đan Mạch. Hai combo còn lại đúng chủ đề.

**Banner trang chủ:** ổ bánh mì — trùng ảnh danh mục bột và prod-04.

**Nơi nạp ảnh từ URL ngoài (32 chỗ):** `src/data/products.ts` (16) · `src/data/categories.ts` (8) · `src/data/recipeBundles.ts` (3) · `src/context/CartContext.tsx:65,99` · `src/pages/admin/ProductFormPage.tsx:57,507` · `src/pages/store/HomePage.tsx:60`.

## 3. Đổi luật "không sửa `src/data/*`" — chỉ cho ảnh

Ngoại lệ **duy nhất** so với `README.md` mục 3 luật 5: được sửa trường **`imageUrl`** trong `src/data/products.ts`, `categories.ts`, `recipeBundles.ts` (và 5 chỗ ngoài `data/` nêu trên). **Mọi trường khác giữ nguyên** — tên, giá, tồn kho, bậc giá… không đổi.

Đường dẫn dùng **tương đối**: `'./img/products/prod-01.webp'`. Lý do: `vite.config.ts` đặt `base: './'` và router là `HashRouter`, nên đường dẫn tương đối chạy được cả ở dev server, thư mục `dist/` mở trực tiếp lẫn hosting tĩnh trong thư mục con. **Không** dùng `/img/...` (tuyệt đối).

## 4. Phong cách bắt buộc

| Hạng mục | Ảnh sản phẩm (1:1) | Ảnh danh mục (1:1) | Ảnh combo / món bánh (4:3) | Banner (16:10) |
|---|---|---|---|---|
| Nền | Liền một màu **kem ấm `#F4F1EC`**, không đường chân trời | Cùng nền kem | Bàn gỗ sáng hoặc đá cẩm thạch trắng, nền mờ nhẹ | Mặt bàn gỗ sáng |
| Ánh sáng | Cửa sổ khuếch tán từ **trên-trái**, bóng đổ mềm, nhạt | Như sản phẩm | Ánh sáng ban ngày tự nhiên | Như combo |
| Góc máy | Nhìn xéo trên xuống khoảng **40°**, hoặc đặt phẳng (flat-lay) với đồ dẹt | Nhóm 2–4 món, flat-lay hoặc 40° | 30–45°, chiều sâu trường ảnh nông | Nhìn thẳng từ trên xuống |
| Bố cục | Chủ thể ở giữa, **chừa lề ≥ 10%** mỗi cạnh (ảnh bị cắt `object-cover`) | Như sản phẩm | Món ăn lệch nhẹ theo quy tắc một phần ba | Có khoảng trống bên trái cho chữ |
| Màu | Tự nhiên; không lọc tông (cam, xanh teal) | Như sản phẩm | Ấm, tự nhiên | Ấm, tự nhiên |
| Cấm | Chữ, logo, bàn tay, người, đạo cụ thừa, hiệu ứng khói / lấp lánh | | | |

**Thông số kỹ thuật:**

| Loại | Kích thước | Định dạng | Dung lượng tối đa | Thư mục |
|---|---|---|---|---|
| Sản phẩm | 1200 × 1200 | WebP (chất lượng ~80) hoặc JPEG | 150 KB | `public/img/products/` |
| Danh mục | 800 × 800 | WebP / JPEG | 100 KB | `public/img/categories/` |
| Combo / món bánh | 1200 × 900 | WebP / JPEG | 150 KB | `public/img/combos/` |
| Banner | 1600 × 1000 | WebP / JPEG | 250 KB | `public/img/banners/` |

Đặt tên: chữ thường, đúng mã trong dữ liệu — `prod-01.webp`, `cat-dairy.webp`, `bundle-tiramisu.webp`, `hero.webp`.
Cạnh ngắn của ảnh tối thiểu 800px (sản phẩm), 600px (danh mục, combo); banner rộng tối thiểu 1200px. Nén bằng công cụ quen thuộc (`cwebp`, Squoosh, `sharp`) — không thêm thư viện vào ứng dụng chỉ để nén.

## 5. Danh sách 28 ảnh cần có

Cột **Subject** viết bằng tiếng Anh để **dùng làm từ khóa tìm ảnh (cách B)** hoặc **ghép vào prompt (cách A)** ở mục 6.

### 5.1 Sản phẩm — `public/img/products/`

| File | Sản phẩm | Subject (EN) | Lưu ý |
|---|---|---|---|
| `prod-01.webp` | Bơ lạt 227g (lạnh) | a block of unsalted butter partly unwrapped from plain white parchment paper, three thin slices cut beside it, on a white marble slab | Giấy gói trơn, không chữ |
| `prod-02.webp` | Kem tươi whipping cream 1 lít (lạnh) | a plain white 1-litre cream carton with a glass jug of cream and a small bowl of lightly whipped cream with a whisk | Hộp không nhãn |
| `prod-03.webp` | Mascarpone 500g (lạnh) | an open round white tub of smooth mascarpone cheese with a wooden spoon lifting a scoop | Phải là phô mai kem mịn, không phải khay phô mai |
| `prod-04.webp` | Bột mì số 13, 1kg | a plain kraft paper bag of bread flour, flour dusted across a pale wooden surface, a few ears of wheat | Là **bột**, không phải bánh mì |
| `prod-05.webp` | Men khô ngọt, hộp 500g | a small unlabelled red-and-gold vacuum pack of dry yeast beside a ceramic bowl of golden-brown instant yeast granules | Thấy rõ hạt men |
| `prod-06.webp` | Socola đen hạt nút 1kg | dark chocolate callets (couverture pistoles) spilling from an unlabelled resealable pouch | Hạt tròn dẹt, bóng mờ |
| `prod-07.webp` | Bột cacao 500g | unsweetened cocoa powder heaped on a wooden spoon beside a small mound of cocoa powder, plain zip pouch | Là **bột** |
| `prod-08.webp` | Bột trà xanh matcha 100g (lạnh) | matcha green tea powder in a small round tin with a bamboo whisk (chasen) and a fine sifter, vivid green powder | Màu xanh lá tươi |
| `prod-09.webp` | Tinh dầu vanilla 118ml | a small dark amber glass bottle of vanilla extract with a black cap, two vanilla pods and a few seeds | Chai không nhãn chữ |
| `prod-10.webp` | Mứt dâu tây 1kg | a plain stand-up pouch of chunky strawberry jam with a spoonful of jam and fresh strawberries | Thấy miếng dâu |
| `prod-11.webp` | Khuôn bánh mì gối, nắp trượt | a Pullman loaf pan (non-stick cast aluminium) with a sliding lid beside a sliced white sandwich loaf | Khuôn chữ nhật có nắp |
| `prod-12.webp` | Phới dẹt silicone 28cm | a seamless one-piece beige silicone flat spatula lying diagonally | Một món duy nhất, nền trơn |
| `prod-13.webp` | Cân điện tử tiểu ly 0.1g | a digital kitchen scale with two small measuring trays, display reading 0.0 g | Số trên màn hình được phép |
| `prod-14.webp` | Máy đánh trứng để bàn 3.5L | a 3.5-litre tabletop stand mixer with a stainless-steel bowl, with whisk and dough hook attachments beside it | Có âu inox và phới |
| `prod-15.webp` | Combo nguyên liệu Tiramisu (lạnh) | flat-lay of tiramisu ingredients: mascarpone tub, ladyfinger biscuits, cocoa powder, espresso cup, eggs, a small square 18 cm cake pan | **Bộ nguyên liệu**, không phải bánh thành phẩm |
| `prod-16.webp` | Combo Sourdough thảo mộc | flat-lay of a sourdough kit: bread flour bag, a jar of sourdough starter, a round cane banneton proofing basket, dried herbs, a bread lame | **Bộ nguyên liệu**, không phải ổ bánh |

### 5.2 Danh mục — `public/img/categories/`

| File | Danh mục | Subject (EN) |
|---|---|---|
| `cat-dairy.webp` | Bơ sữa & phô mai tươi | a butter block, a glass jug of cream and a wedge of cheese arranged together on a marble surface |
| `cat-flour.webp` | Bột mì & men nở | flour in a wooden scoop, a kraft flour bag, wheat ears and a small bowl of yeast granules |
| `cat-chocolate.webp` | Socola, cacao & matcha | dark chocolate pieces, a small bowl of cocoa powder and a small mound of matcha powder |
| `cat-flavor.webp` | Hương liệu & mứt nhân bánh | a vanilla extract bottle with vanilla pods, a jar of strawberry jam and small bottles of food colouring |
| `cat-tools.webp` | Dụng cụ & khuôn khay | silicone spatulas, a balloon whisk, a loaf pan and metal piping tips arranged flat |
| `cat-machinery.webp` | Thiết bị & máy móc | a stand mixer and a digital kitchen scale on a bakery worktop |
| `cat-packaging.webp` | Hộp bánh & bao bì | flat-pack kraft cake boxes, a window pastry box, parchment bags and spools of ribbon |
| `cat-combo.webp` | Combo nguyên liệu theo món | a wooden crate packed with neatly arranged baking ingredients for one recipe |

### 5.3 Combo / món bánh — `public/img/combos/`

| File | Dùng cho | Subject (EN) |
|---|---|---|
| `bundle-tiramisu.webp` | Combo bánh Tiramisu | a square slice of tiramisu on a plain white plate dusted with cocoa, an espresso cup beside it |
| `bundle-sourdough.webp` | Combo bánh mì Sourdough | a rustic round sourdough loaf, scored, with one slice cut showing open crumb, on a linen cloth |
| `bundle-cookies.webp` | Combo bánh quy bơ Đan Mạch | golden Danish-style butter cookies with sugar crystals on parchment, a plain unlabelled round tin beside them |

### 5.4 Banner — `public/img/banners/`

| File | Dùng cho | Subject (EN) |
|---|---|---|
| `hero.webp` | Banner trang chủ (`HomePage.tsx`) | top-down view of a bakery worktop: flour dusted on pale wood, a block of butter, eggs, dark chocolate pieces, vanilla pods and a rolling pin; empty space on the left third |

Ngoài ra tạo `public/img/placeholder.svg` (nền `#F4F1EC`, một icon hộp xám) làm ảnh dự phòng — xem mục 7.

## 6. Prompt mẫu (cách A) và mẹo tìm ảnh (cách B)

**Prompt gốc — sản phẩm / danh mục (thay `{SUBJECT}` bằng cột Subject):**

```text
Professional e-commerce product photograph of {SUBJECT}. Centered, with a 10% margin around the subject.
Seamless warm off-white background (#F4F1EC). Soft diffused window light from the upper left, soft natural contact shadow.
Shot at about a 40-degree top-down angle on an 85mm lens, f/5.6, realistic textures, natural colours, very slight film grain.
No text, no letters, no logo, no watermark, no brand names, no hands, no people, no extra props. Square 1:1.
```

**Prompt gốc — combo / món bánh (4:3) và banner (16:10):**

```text
Natural-light food photograph of {SUBJECT}. Bright pale wooden table, shallow depth of field, soft daylight from a window on the left,
realistic textures, natural warm colours, subtle imperfections (crumbs, dusting). No text, no logo, no watermark, no hands, no people.
Aspect ratio 4:3.   (banner: aspect ratio 16:10, leave the left third calm and empty)
```

**Prompt phủ định (nếu công cụ có ô riêng):** `text, letters, logo, watermark, label with words, hands, people, glossy plastic look, oversaturated colours, extra objects, distorted shapes, blurry, cartoon, 3D render`.

**Cách B — tìm ảnh:** dùng cột *Subject* làm từ khóa (vd. `block of unsalted butter parchment`), lọc *Orientation: Square* hoặc *Landscape*. Ưu tiên ảnh nền sáng, đơn giản. Với ảnh nền tối hoặc có chữ/logo → bỏ, chọn ảnh khác hoặc chuyển sang cách A. Có thể cắt/giảm kích thước nhưng **không** chỉnh màu quá tay làm lệch tông bộ ảnh; không thêm chữ.

## 7. Cách đưa vào code

1. Tạo thư mục và đặt file đúng tên ở mục 5.
2. Sửa `imageUrl` trong `src/data/products.ts`, `categories.ts`, `recipeBundles.ts` (mục 3), và 5 chỗ ngoài `data/` (mục 2): `CartContext.tsx` (2 sản phẩm mặc định, dùng đúng đường dẫn của `prod-01`, `prod-03`), `ProductFormPage.tsx` (ảnh xem trước mặc định, ô nhập URL chỉ còn là placeholder chữ — không nạp ảnh ngoài), `HomePage.tsx` (banner `./img/banners/hero.webp`).
3. Tạo thành phần dùng chung `src/components/ui/product-image.tsx`:
   - nhận `src`, `alt`; `loading="lazy"`; `width`/`height` cố định để không nhảy bố cục; `object-cover`;
   - khi lỗi (`onError`) chuyển sang `./img/placeholder.svg` — **không** để hiện chữ alt như ở `/san-pham/prod-14` và `/admin/san-pham` hiện nay;
   - `alt` = tên sản phẩm (ảnh trang trí thì `alt=""`).
   Dùng thành phần này ở mọi nơi hiện `<img>` sản phẩm: thẻ sản phẩm, trang chi tiết, giỏ hàng, mini cart, thanh toán, theo dõi đơn, admin.
4. Cập nhật `client/THIRD_PARTY.md`, thêm mục **Ảnh** — mỗi file một dòng:

   | File | Cách | Nguồn / công cụ | Tác giả, giấy phép | Ghi chú |
   |---|---|---|---|---|
   | `products/prod-01.webp` | B | https://unsplash.com/photos/… | Tên tác giả — Unsplash License | cắt vuông |
   | `products/prod-05.webp` | A | Công cụ tạo ảnh tên … | Tạo bằng AI, 08/10/2026 | prompt: "…" |

## 8. Kiểm tra (bắt buộc trước khi báo xong R4)

```bash
cd client
node ui-spec/check-images.mjs                 # mọi imageUrl là file cục bộ, tồn tại, đủ kích thước, không trùng
bash ui-spec/check-ui.sh                      # mục "Ảnh nạp từ URL ngoài" phải ✓ (0 chỗ)
node ui-spec/audit-runtime.mjs --routes=/san-pham --all   # không còn "ảnh hỏng", không còn net-fail
```

`check-images.mjs` kiểm: không còn URL `http(s)` ở bất kỳ `imageUrl` / `src` ảnh nào · file tồn tại trong `public/` · cạnh ngắn ≥ ngưỡng (mục 4) · dung lượng ≤ ngưỡng · **không hai thực thể dùng chung một file** hoặc hai file giống hệt nội dung · không có file mồ côi trong `public/img/` · đủ 16 + 8 + 3 + 1 ảnh. Thoát mã 1 nếu sai.

**Duyệt bằng mắt (không có công cụ nào thay được):** mở `/`, `/san-pham`, `/san-pham?danh-muc=…` (8 danh mục), `/combo`, `/admin/san-pham` và tự trả lời:

- [ ] Nhìn tên và ảnh của từng thẻ — có khớp không? (Không còn mèo, gấu, sân khấu, cơm chiên.)
- [ ] Cả lưới nhìn như **một bộ ảnh** (cùng nền kem, cùng hướng sáng, cùng cỡ chủ thể) không?
- [ ] Có ảnh nào xuất hiện hai lần trên cùng một trang không?
- [ ] Có chữ, logo, watermark, bàn tay trong ảnh không?
- [ ] Ảnh AI có chỗ nào méo (nắp hũ, nếp giấy, phới đánh trứng, chữ lạ) không?
- [ ] Mở ở 375px: ảnh không bị cắt mất chủ thể?
