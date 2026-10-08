import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ProductGrid } from '@/components/product/ProductGrid'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'
import { RECIPE_BUNDLES } from '@/data/recipeBundles'
import { formatPrice } from '@/components/ui/price'
import {
  Snowflake,
  Calendar,
  Tag,
  FileText,
  ArrowRight,
  Store,
  CheckCircle2,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  useDocumentTitle('Nguyên liệu và thiết bị làm bánh chính hãng')

  // Products
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 5)
  const newArrivals = PRODUCTS.filter((p) => p.isNew || p.rating >= 4.9).slice(0, 5)

  // Anchor butter for wholesale tier demonstration
  const anchorProduct = PRODUCTS.find((p) => p.id === 'prod-01')

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Banner chia đôi (Split Hero Banner) */}
      <section className="wrap pt-6">
        <div className="rounded-xl border border-line bg-surface overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-ink leading-tight tracking-tight">
              Nguyên liệu và thiết bị làm bánh chính hãng
            </h1>
            <p className="text-sm sm:text-base text-ink-2 max-w-xl leading-relaxed">
              Bơ, sữa, bột, socola, khuôn và máy móc từ các thương hiệu nhập khẩu. Hàng cần bảo quản lạnh giao bằng xe lạnh trong 2–4 giờ.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/san-pham"
                className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
              >
                Xem sản phẩm
              </Link>
              <Link
                to="/mua-si"
                className="inline-flex items-center justify-center h-11 px-4 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
              >
                <span>Mua sỉ cho tiệm bánh</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 aspect-[16/9] md:aspect-auto relative bg-page">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
              alt="Nguyên liệu làm bánh Gia Hòa Phát"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Dải dịch vụ (Service Strip) */}
      <section className="wrap">
        <div className="rounded-lg border border-line bg-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <Snowflake className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">Giao lạnh 2–8°C</p>
              <p className="text-xs text-ink-2 mt-0.5">Xe lạnh cho bơ, sữa, kem tươi</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <Calendar className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">Hạn dùng theo lô</p>
              <p className="text-xs text-ink-2 mt-0.5">Xem HSD trên từng sản phẩm</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <Tag className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">Giá sỉ theo số lượng</p>
              <p className="text-xs text-ink-2 mt-0.5">Tự hạ giá khi đạt mốc mua</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <FileText className="h-5 w-5 text-ink-2 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">Hóa đơn VAT</p>
              <p className="text-xs text-ink-2 mt-0.5">Xuất hóa đơn điện tử cho tiệm</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Danh mục sản phẩm (Categories Grid) */}
      <section className="wrap space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Danh mục sản phẩm</h2>
          <Link
            to="/san-pham"
            className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            <span>Tất cả sản phẩm</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/san-pham?danh-muc=${c.slug}`}
              className="group rounded-lg border border-line bg-surface hover:border-line-strong transition-colors p-3 flex flex-col items-center text-center space-y-2.5"
            >
              <div className="w-full aspect-square rounded-md overflow-hidden bg-page border border-line">
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-ink group-hover:text-brand transition-colors line-clamp-1">
                  {c.name}
                </p>
                <p className="text-xs text-ink-3 tabular-nums mt-0.5">
                  {c.productCount} sản phẩm
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Bán chạy (Best Sellers) */}
      <section className="wrap space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Sản phẩm bán chạy</h2>
            <p className="text-xs text-ink-2 mt-0.5">Các nguyên liệu được nhiều thợ bánh tin dùng nhất</p>
          </div>
          <Link
            to="/san-pham"
            className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} columns={5} />
      </section>

      {/* 5. Combo nguyên liệu theo món (Recipe Bundles) */}
      <section className="wrap space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Combo nguyên liệu theo món</h2>
            <p className="text-xs text-ink-2 mt-0.5">Mua trọn bộ nguyên liệu theo định lượng chuẩn</p>
          </div>
          <Link
            to="/combo"
            className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            <span>Xem tất cả combo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECIPE_BUNDLES.map((bundle) => (
            <Link
              key={bundle.id}
              to={`/combo/${bundle.id}`}
              className="group rounded-lg border border-line bg-surface hover:border-line-strong transition-colors overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-page overflow-hidden">
                <img
                  src={bundle.imageUrl}
                  alt={bundle.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-xs text-brand font-medium">
                    {bundle.difficulty} · {bundle.servings}
                  </span>
                  <h3 className="text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
                    {bundle.name}
                  </h3>
                  <p className="text-xs text-ink-2 line-clamp-2">
                    {bundle.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                  <span className="text-ink-3">
                    {bundle.itemIds.length} nguyên liệu
                  </span>
                  <span className="font-semibold text-brand group-hover:underline">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Giá sỉ cho tiệm bánh (Wholesale Banner with Real Tier Table) */}
      <section className="wrap">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-semibold text-ink">Giá sỉ cho tiệm bánh và xưởng sản xuất</h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Chính sách chiết khấu trực tiếp theo sản lượng, không giới hạn đơn hàng tối thiểu. Hỗ trợ giao định kỳ và xuất hóa đơn VAT đầy đủ.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Bảng giá theo số lượng, tự động áp dụng khi thêm vào giỏ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Xuất hóa đơn điện tử VAT chuẩn xác cho doanh nghiệp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Lịch giao hàng xe lạnh cố định hàng ngày</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/mua-si"
                className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-line-strong bg-surface text-ink text-xs font-semibold hover:bg-page transition-colors"
              >
                Đăng ký tài khoản mua sỉ
              </Link>
            </div>
          </div>

          {/* Real Wholesale Tier Table Example */}
          <div className="lg:col-span-5 rounded-lg border border-line bg-page p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div>
                <p className="text-xs font-semibold text-ink">Bảng giá sỉ mẫu</p>
                <p className="text-xs text-ink-3">Bơ lạt Anchor 227g (New Zealand)</p>
              </div>
              <span className="text-xs text-brand font-medium">Bán lẻ: 78.000₫</span>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-ink-3 border-b border-line">
                  <th className="py-1.5 font-medium">Số lượng</th>
                  <th className="py-1.5 font-medium text-right">Đơn giá</th>
                  <th className="py-1.5 font-medium text-right">Tiết kiệm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {anchorProduct?.wholesaleTiers.map((tier, idx) => (
                  <tr key={idx} className="tabular-nums">
                    <td className="py-2 text-ink font-medium">
                      Mua từ {tier.minQty} thỏi
                    </td>
                    <td className="py-2 text-right font-semibold text-ink">
                      {formatPrice(tier.price)}
                    </td>
                    <td className="py-2 text-right text-ok font-medium">
                      -{tier.discountPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-ink-3 pt-1">
              * Hệ thống tự động giảm giá trên giỏ hàng khi đạt số lượng yêu cầu.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Hàng mới về (New Arrivals) */}
      <section className="wrap space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Hàng mới về & Đánh giá cao</h2>
            <p className="text-xs text-ink-2 mt-0.5">Các nguyên liệu tươi mới cập bến tuần này</p>
          </div>
          <Link
            to="/san-pham"
            className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} columns={5} />
      </section>

      {/* 8. Hệ thống cửa hàng (Stores Info) */}
      <section className="wrap space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Hệ thống kho & Cửa hàng</h2>
          <Link
            to="/cua-hang"
            className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            <span>Xem chi tiết cửa hàng</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-line bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-ink">Kho Tổng & Cửa Hàng Hà Nội</h3>
            </div>
            <p className="text-xs text-ink-2 leading-relaxed">
              120 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội
            </p>
            <div className="pt-2 text-xs text-ink-3 flex flex-wrap gap-4">
              <span>Giờ mở cửa: 07:30–21:00</span>
              <span>Hotline: 1900 6899</span>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-ink">Chi Nhánh Nam & Cửa Hàng TP.HCM</h3>
            </div>
            <p className="text-xs text-ink-2 leading-relaxed">
              452 Sư Vạn Hạnh, P.9, Quận 10, TP. Hồ Chí Minh
            </p>
            <div className="pt-2 text-xs text-ink-3 flex flex-wrap gap-4">
              <span>Giờ mở cửa: 07:30–21:00</span>
              <span>Hotline: 1900 6899</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
