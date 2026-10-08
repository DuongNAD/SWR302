import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Snowflake,
  ShieldCheck,
  Building2,
  BookOpen,
  Filter,
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SWRMatrixDrawer } from './components/layout/SWRMatrixDrawer';
import { FilterSidebar } from './components/product/FilterSidebar';
import { ProductCard } from './components/product/ProductCard';
import { ProductModal } from './components/product/ProductModal';
import { RecipeKitSection } from './components/recipe/RecipeKitSection';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { PRODUCTS } from './data/products';
import { Product, StorageCondition, Order, OrderStatus } from './types';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

export const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useAuth();
  const { setIsCartOpen } = useCart();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageCondition | 'all'>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('bestseller');

  // Modals state
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSWRMatrixOpen, setIsSWRMatrixOpen] = useState(false);

  // Orders in-memory store for simulation
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-init-1',
      orderNumber: 'GHP-889120',
      createdAt: '08/10/2026, 11:30',
      customerName: 'Tiệm Bánh Le Parisien',
      customerPhone: '0988 777 999',
      customerEmail: 'tuan.le@leparisienbakery.vn',
      shippingAddress: 'Lô B4 Cụm Công Nghiệp Từ Liêm',
      shippingCity: 'Hà Nội',
      items: [
        {
          productId: 'prod-01',
          productName: 'Bơ Lạt Tự Nhiên Anchor Unsalted Butter 227g',
          sku: 'GHP-BUTTER-ANC227',
          unit: 'Thỏi 227g',
          price: 66000,
          quantity: 40,
          total: 2640000,
          storageCondition: 'chilled'
        },
        {
          productId: 'prod-02',
          productName: 'Kem Tươi Whipping Cream Tatua Dairy Cream 1 Lít',
          sku: 'GHP-CREAM-TATUA1L',
          unit: 'Hộp 1 Lít',
          price: 118000,
          quantity: 12,
          total: 1416000,
          storageCondition: 'chilled'
        }
      ],
      subtotal: 4056000,
      shippingFee: 45000,
      coldPackagingFee: 0,
      discountAmount: 100000,
      totalAmount: 4001000,
      status: 'confirmed',
      paymentMethod: 'vnpay',
      paymentStatus: 'paid',
      shippingMethod: 'chilled_express',
      notes: 'Đơn hàng bán buôn sỉ, giao trước 15:00',
      estimatedDelivery: 'Hôm nay (2-4 giờ)',
      requiresColdChain: true,
      vatInvoiceRequested: true,
      taxCode: '0108992144',
      companyName: 'Công Ty Cổ Phần Bánh Le Parisien'
    }
  ]);

  // Extract available brands
  const availableBrands = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  }, []);

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedStorage('all');
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (selectedCategory && p.categoryId !== selectedCategory) {
        return false;
      }

      // Storage condition
      if (selectedStorage !== 'all' && p.storageCondition !== selectedStorage) {
        return false;
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Price
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }

      // In stock
      if (inStockOnly && (!p.inStock || p.stockQty <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedStorage, selectedBrands, priceRange, inStockOnly, sortBy]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCompletedOrder(newOrder);
  };

  // If in Admin View Mode, render the Admin Portal
  if (activeView === 'admin') {
    return (
      <AdminDashboard
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onBackToStore={() => setActiveView('store')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#2B1D14]">
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSWRMatrix={() => setIsSWRMatrixOpen(true)}
      />

      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section & Value Propositions */}
        <section className="relative rounded-3xl overflow-hidden bg-linear-to-r from-[#2B1D14] via-[#452D1F] to-[#78350F] text-white p-8 sm:p-12 shadow-xl border border-amber-900/40">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuyển Đổi Số E-Commerce Gia Hòa Phát • Thành lập 1998</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Khởi Đầu Mọi Mẻ Bánh Hoàn Hảo Cùng Gia Hòa Phát
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              Tổng kho nguyên liệu nhập khẩu chính ngạch: Bơ động vật Anchor, Whipping Tatua, Socola Bỉ Callebaut và máy móc làm bánh chuyên nghiệp. Cam kết giao hỏa tốc xe lạnh 2-4h bảo quản tươi nguyên.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="py-3 px-6 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Xem Ngay Bảng Giá Sỉ & Lẻ</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsSWRMatrixOpen(true)}
                className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Xem Đặc Tả Môn SWR302</span>
              </button>
            </div>
          </div>

          {/* Background Decorative Blur */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Recipe Kit Bundles (Killer Feature for SWR302 Topic 1) */}
        <div id="recipe-kits">
          <RecipeKitSection />
        </div>

        {/* Main Product Catalog Section */}
        <section id="catalog" className="space-y-6">
          {/* Catalog Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE4D6]">
            <div>
              <h2 className="text-2xl font-extrabold text-[#2B1D14]">
                Danh Mục Nguyên Liệu & Thiết Bị Làm Bánh
              </h2>
              <p className="text-xs text-[#6B5B4E] mt-0.5">
                Hiển thị {filteredProducts.length} sản phẩm thỏa mãn tiêu chí tìm kiếm
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-stone-500 font-medium">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sắp xếp sản phẩm"
                className="text-xs font-semibold bg-white border border-[#EFE4D6] rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#92400E] cursor-pointer shadow-2xs"
              >
                <option value="bestseller">🔥 Bán chạy nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới về</option>
              </select>
            </div>
          </div>

          {/* Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar */}
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStorage={selectedStorage}
              onSelectStorage={setSelectedStorage}
              selectedBrands={selectedBrands}
              onToggleBrand={handleToggleBrand}
              availableBrands={availableBrands}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredProducts.length}
            />

            {/* Product Grid */}
            <div className="flex-1 w-full">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EFE4D6] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-[#92400E] mx-auto flex items-center justify-center">
                    <Filter className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">
                    Không tìm thấy nguyên liệu phù hợp
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Hãy thử xóa bớt bộ lọc hoặc gõ từ khóa chung hơn như "bột", "bơ", "mascarpone" nhé.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#92400E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#78350F] cursor-pointer"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenModal={(p) => setActiveModalProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button for SWR302 Matrix */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          type="button"
          onClick={() => setIsSWRMatrixOpen(true)}
          className="py-3 px-4.5 bg-[#2B1D14] hover:bg-[#452D1F] text-[#FFFBF5] rounded-full shadow-2xl border border-amber-500/40 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>SWR302 Requirements Matrix</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <AuthModal />

      <SWRMatrixDrawer
        isOpen={isSWRMatrixOpen}
        onClose={() => setIsSWRMatrixOpen(false)}
      />
    </div>
  );
};
