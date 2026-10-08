import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'

export const CategoryMenu: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="h-10 border-b border-line bg-surface text-ink hidden lg:block">
      <div className="wrap flex items-center justify-between h-full text-xs">
        {/* Left: Dropdown + Quick Category Links */}
        <div className="flex items-center gap-6 h-full">
          {/* Category Dropdown */}
          <div ref={menuRef} className="relative h-full flex items-center">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 font-semibold text-ink hover:text-brand transition-colors h-full cursor-pointer pr-4 border-r border-line"
            >
              <Menu className="h-4 w-4 text-brand" />
              <span>Tất cả danh mục</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-3" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border border-line bg-surface p-1.5 shadow-pop z-50">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/san-pham?danh-muc=${cat.slug}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-page transition-colors text-ink hover:text-brand"
                  >
                    <span className="font-medium text-xs">{cat.name}</span>
                    <span className="text-xs text-ink-3 tabular-nums">
                      {cat.productCount}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <nav className="flex items-center gap-5">
            <Link
              to="/san-pham?danh-muc=bo-sua-pho-mai"
              className="text-ink-2 hover:text-ink font-medium transition-colors"
            >
              Bơ sữa & Phô mai
            </Link>
            <Link
              to="/san-pham?danh-muc=bot-men-lam-banh"
              className="text-ink-2 hover:text-ink font-medium transition-colors"
            >
              Bột mì & Men nở
            </Link>
            <Link
              to="/san-pham?danh-muc=socola-cacao-matcha"
              className="text-ink-2 hover:text-ink font-medium transition-colors"
            >
              Socola & Cacao
            </Link>
            <Link
              to="/san-pham?danh-muc=dung-cu-khuon-khay"
              className="text-ink-2 hover:text-ink font-medium transition-colors"
            >
              Dụng cụ & Khuôn
            </Link>
            <Link
              to="/san-pham?danh-muc=thiet-bi-may-moc"
              className="text-ink-2 hover:text-ink font-medium transition-colors"
            >
              Thiết bị & Máy móc
            </Link>
          </nav>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-5 font-medium text-ink-2">
          <Link
            to="/combo"
            className="hover:text-brand transition-colors flex items-center gap-1.5"
          >
            <span>Combo công thức</span>
          </Link>
          <Link
            to="/mua-si"
            className="hover:text-brand transition-colors text-brand font-semibold"
          >
            Mua sỉ cho tiệm bánh
          </Link>
          <Link
            to="/cua-hang"
            className="hover:text-ink transition-colors"
          >
            Hệ thống cửa hàng
          </Link>
        </div>
      </div>
    </div>
  )
}
