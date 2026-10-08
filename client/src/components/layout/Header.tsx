import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Snowflake,
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  Store,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenSWRMatrix: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenSWRMatrix
}) => {
  const { totalItemCount, subtotal, setIsCartOpen, requiresColdChain } = useCart();
  const { currentUser, isLoggedIn, setIsAuthModalOpen, activeView, setActiveView, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE4D6] shadow-2xs">
      {/* Top Notice Bar */}
      <div className="bg-[#2B1D14] text-[#FFFBF5] px-4 py-1.5 text-2xs font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
              <Snowflake className="w-3 h-3 text-sky-400" />
              <span>Giao Hỏa Tốc Xe Lạnh 2-4 Giờ:</span>
            </span>
            <span className="hidden sm:inline text-stone-300">
              Giữ nhiệt bơ sữa 2-4°C chuẩn tươi nguyên, không tách nước.
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <button
              type="button"
              onClick={onOpenSWRMatrix}
              className="hidden md:inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ma Trận Yêu Cầu SWR302 (Traceability)</span>
            </button>
            <div className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Hotline Sỉ & Lẻ: <strong>1900 6899</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Mở menu di động"
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => {
              setActiveView('store');
              onSelectCategory(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#78350F] to-[#B45309] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              GHP
            </div>
            <div>
              <span className="block font-black text-base sm:text-lg text-[#2B1D14] tracking-tight group-hover:text-[#92400E] transition-colors">
                Gia Hòa Phát
              </span>
              <span className="block text-3xs font-bold uppercase tracking-wider text-[#92400E]">
                Bakery Supply • Nguyên Liệu & Thiết Bị Làm Bánh
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (FR-SRC-01) */}
        <div className="hidden md:flex flex-1 max-w-xl items-center relative">
          <div className="w-full flex items-center bg-stone-50 border-2 border-[#EFE4D6] focus-within:border-[#92400E] focus-within:bg-white rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs">
            <div className="pl-3.5 text-stone-400">
              <Search className="w-4 h-4 text-[#92400E]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm bột mì số 13, bơ Anchor, mascarpone, socola Callebaut, khuôn bánh..."
              className="w-full px-3 py-2.5 text-xs text-[#2B1D14] bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="pr-3 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & User & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SWR302 View Mode Switcher: Storefront vs Admin */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-[#EFE4D6]">
            <button
              type="button"
              onClick={() => setActiveView('store')}
              className={`px-2.5 py-1.5 rounded-lg text-2xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'store'
                  ? 'bg-white text-[#92400E] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khách Hàng</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-2xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#92400E] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Kho</span>
            </button>
          </div>

          {/* User Account Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsUserMenuOpen(!isUserMenuOpen);
                }
              }}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-[#EFE4D6] hover:bg-stone-50 transition-colors text-xs font-semibold text-stone-800 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-amber-100 text-[#92400E] flex items-center justify-center font-bold text-2xs">
                {isLoggedIn ? currentUser?.name[0] : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden lg:inline font-bold">
                {isLoggedIn ? currentUser?.name : 'Đăng nhập'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400 hidden lg:inline" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EFE4D6] shadow-xl p-2 z-50 animate-in fade-in duration-150">
                <div className="p-3 border-b border-[#EFE4D6]">
                  <p className="font-bold text-xs text-[#2B1D14]">{currentUser?.name}</p>
                  <p className="text-3xs text-stone-500">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-[#92400E] text-3xs font-extrabold uppercase">
                    {currentUser?.role === 'wholesale_client'
                      ? 'Tiệm Bánh Mua Sỉ'
                      : currentUser?.role === 'admin'
                      ? 'Quản Trị Viên'
                      : 'Thợ Làm Bánh Lẻ'}
                  </span>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer"
                  >
                    Chuyển đổi vai trò demo...
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Mở giỏ hàng, hiện có ${totalItemCount} sản phẩm`}
            className="flex items-center gap-2.5 px-3 py-2 bg-[#92400E] hover:bg-[#78350F] text-white rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white font-extrabold text-3xs rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#92400E]">
                  {totalItemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-3xs uppercase font-extrabold text-amber-200">Giỏ Hàng</span>
              <span className="block text-xs font-black font-mono">
                {subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')}₫` : '0₫'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 md:hidden">
        <div className="flex items-center bg-stone-50 border border-[#EFE4D6] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-[#92400E] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm nguyên liệu làm bánh..."
            className="w-full px-2 text-xs bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav 
        aria-label="Danh mục sản phẩm"
        className="border-t border-[#EFE4D6]/70 bg-[#FFFBF5] overflow-x-auto scrollbar-none"
      >
        <div className="container mx-auto px-4 flex items-center gap-2 py-2 text-xs font-semibold whitespace-nowrap">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-[#92400E] text-white shadow-2xs font-bold'
                : 'text-stone-700 hover:bg-[#FEF3E2] hover:text-[#92400E]'
            }`}
          >
            Tất Cả Sản Phẩm
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#92400E] text-white shadow-2xs font-bold'
                    : 'text-stone-700 hover:bg-[#FEF3E2] hover:text-[#92400E]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.id === 'cat-dairy' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title="Bảo quản lạnh" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
