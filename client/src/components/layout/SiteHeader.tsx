import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { SearchBox } from './SearchBox'
import { CategoryMenu } from './CategoryMenu'
import { MobileMenu } from './MobileMenu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Menu,
  ShoppingBag,
  Heart,
  User,
  LogOut,
} from 'lucide-react'

export const SiteHeader: React.FC = () => {
  const { currentUser, isLoggedIn, logout } = useAuth()
  const { totalItemCount, setIsCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* 1. Main Header (64px desktop, 56px mobile) */}
      <header className="sticky top-0 z-40 h-14 lg:h-16 border-b border-line bg-surface">
        <div className="wrap flex items-center justify-between h-full gap-4">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-page text-ink-2 hover:text-ink transition-colors cursor-pointer"
              aria-label="Mở danh mục menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-baseline gap-1.5 text-ink hover:text-brand transition-colors">
              <span className="text-xl font-bold tracking-tight">Gia Hòa Phát</span>
              <span className="hidden sm:inline text-xs text-ink-3 font-normal">
                Bakery Supply
              </span>
            </Link>
          </div>

          {/* Search Box (Desktop) */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl px-4">
            <SearchBox />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Wishlist Link */}
            <Link
              to="/tai-khoan/yeu-thich"
              className="inline-flex items-center gap-1.5 p-2 rounded-md hover:bg-page text-ink-2 hover:text-ink transition-colors"
              title="Sản phẩm yêu thích"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden xl:inline text-xs font-medium">Yêu thích</span>
            </Link>

            {/* Account / Login */}
            {isLoggedIn && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md hover:bg-page text-ink transition-colors cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-full bg-brand-soft border border-line flex items-center justify-center text-brand font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-semibold truncate max-w-[110px]">
                        {currentUser.name}
                      </span>
                      <span className="text-xs text-brand leading-none">
                        {currentUser.role === 'wholesale_client' ? 'Khách sỉ' : 'Khách lẻ'}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-semibold text-ink text-sm">{currentUser.name}</p>
                    <p className="text-xs text-brand font-normal">
                      {currentUser.role === 'wholesale_client'
                        ? 'Khách hàng sỉ'
                        : currentUser.role === 'admin'
                        ? 'Quản trị viên'
                        : 'Khách hàng lẻ'}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/tai-khoan')}>
                    Tài khoản của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/tai-khoan/don-hang')}>
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/tai-khoan/yeu-thich')}>
                    Sản phẩm yêu thích
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <span className="text-brand font-medium">Trang quản trị (Admin)</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/dang-nhap"
                className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-md hover:bg-page text-ink-2 hover:text-ink transition-colors text-xs font-medium"
              >
                <User className="h-5 w-5 text-ink-2" />
                <span className="hidden xl:inline">Đăng nhập</span>
              </Link>
            )}

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 p-2 rounded-md hover:bg-page text-ink transition-colors cursor-pointer"
              aria-label={`Giỏ hàng, ${totalItemCount} sản phẩm`}
            >
              <ShoppingBag className="h-5 w-5 text-ink" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white tabular-nums leading-none">
                  {totalItemCount}
                </span>
              )}
              <span className="hidden xl:inline text-xs font-medium">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search bar (Row 2, not sticky) */}
      <div className="lg:hidden p-3 bg-surface border-b border-line">
        <SearchBox />
      </div>

      {/* 3. Category Bar (Desktop only, not sticky) */}
      <CategoryMenu />

      {/* Mobile drawer menu */}
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  )
}
