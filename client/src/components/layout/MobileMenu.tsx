import React from 'react'
import { Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import { CATEGORIES } from '@/data/categories'
import {
  User,
  Store,
  HelpCircle,
  Search,
  LogIn,
  LogOut,
  ShieldAlert,
} from 'lucide-react'

interface MobileMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onOpenChange }) => {
  const { currentUser, isLoggedIn, logout } = useAuth()

  const handleLinkClick = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex flex-col w-full sm:max-w-sm p-0">
        <SheetHeader className="p-4 border-b border-line text-left bg-surface">
          <SheetTitle className="text-base font-bold text-ink flex items-center justify-between">
            <span>Gia Hòa Phát</span>
          </SheetTitle>

          {/* User Auth Section */}
          <div className="mt-3 pt-3 border-t border-line">
            {isLoggedIn && currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-brand-soft border border-line flex items-center justify-center text-brand font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{currentUser.name}</p>
                    <span className="text-xs text-brand font-medium">
                      {currentUser.role === 'wholesale_client'
                        ? 'Khách sỉ doanh nghiệp'
                        : currentUser.role === 'admin'
                        ? 'Quản trị viên'
                        : 'Khách lẻ'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout()
                    onOpenChange(false)
                  }}
                  className="p-1.5 text-ink-3 hover:text-bad transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/dang-nhap"
                  onClick={handleLinkClick}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-brand text-white text-xs font-medium hover:bg-brand-hover transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/dang-ky"
                  onClick={handleLinkClick}
                  className="flex-1 inline-flex items-center justify-center h-9 rounded-md border border-line bg-surface text-ink text-xs font-medium hover:bg-page transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </SheetHeader>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* Main sections */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md font-medium text-ink hover:bg-page transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/san-pham"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md font-medium text-ink hover:bg-page transition-colors"
            >
              Tất cả sản phẩm
            </Link>
            <Link
              to="/combo"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md font-medium text-ink hover:bg-page transition-colors"
            >
              Combo công thức
            </Link>
            <Link
              to="/mua-si"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-2.5 py-2 rounded-md font-semibold text-brand hover:bg-brand-soft transition-colors"
            >
              Mua sỉ cho tiệm bánh
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <div className="px-2.5 text-xs font-semibold text-ink-3">
              Danh mục nguyên liệu
            </div>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/san-pham?danh-muc=${c.slug}`}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-ink-2 hover:bg-page hover:text-ink transition-colors"
              >
                <span>{c.name}</span>
                <span className="text-ink-3 tabular-nums">{c.productCount}</span>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <div className="pt-2 border-t border-line space-y-1">
            <Link
              to="/tra-cuu-don-hang"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-ink-2 hover:text-ink hover:bg-page transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Tra cứu đơn hàng</span>
            </Link>
            <Link
              to="/cua-hang"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-ink-2 hover:text-ink hover:bg-page transition-colors"
            >
              <Store className="h-4 w-4" />
              <span>Hệ thống cửa hàng</span>
            </Link>
            <Link
              to="/ho-tro"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-ink-2 hover:text-ink hover:bg-page transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Hỗ trợ & chính sách</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/tai-khoan"
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-ink-2 hover:text-ink hover:bg-page transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Tài khoản cá nhân</span>
              </Link>
            )}

            <Link
              to="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-brand hover:bg-brand-soft transition-colors font-medium"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Trang quản trị (Admin)</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
