import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export const CategoryMenu: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="h-10 border-b border-line bg-surface text-ink hidden lg:block">
      <div className="wrap flex items-center justify-between h-full text-xs">
        {/* Left: Dropdown + Quick Category Links */}
        <div className="flex items-center gap-6 h-full min-w-0">
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 font-semibold text-ink hover:text-brand transition-colors h-full cursor-pointer pr-4 border-r border-line shrink-0 select-none outline-none focus-visible:ring-1 focus-visible:ring-brand"
              >
                <Menu className="h-4 w-4 text-brand" />
                <span>Tất cả danh mục</span>
                <ChevronDown className="h-3.5 w-3.5 text-ink-3" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={6} className="w-64 p-1.5 shadow-pop">
              {CATEGORIES.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => navigate(`/san-pham?danh-muc=${cat.id}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-page transition-colors cursor-pointer text-ink hover:text-brand"
                >
                  <span className="font-medium text-xs">{cat.name}</span>
                  <span className="text-xs text-ink-3 tabular-nums">
                    {cat.productCount}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick links */}
          <nav className="flex items-center gap-5 whitespace-nowrap overflow-x-auto no-scrollbar py-1">
            <Link
              to="/san-pham?danh-muc=cat-dairy"
              className="text-ink-2 hover:text-ink font-medium transition-colors shrink-0"
            >
              Bơ sữa và phô mai
            </Link>
            <Link
              to="/san-pham?danh-muc=cat-flour"
              className="text-ink-2 hover:text-ink font-medium transition-colors shrink-0"
            >
              Bột mì và men nở
            </Link>
            <Link
              to="/san-pham?danh-muc=cat-chocolate"
              className="text-ink-2 hover:text-ink font-medium transition-colors shrink-0"
            >
              Socola và cacao
            </Link>
            <Link
              to="/san-pham?danh-muc=cat-tools"
              className="text-ink-2 hover:text-ink font-medium transition-colors shrink-0"
            >
              Dụng cụ và khuôn
            </Link>
            <Link
              to="/san-pham?danh-muc=cat-machinery"
              className="text-ink-2 hover:text-ink font-medium transition-colors shrink-0"
            >
              Thiết bị và máy móc
            </Link>
          </nav>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-5 font-medium text-ink-2 shrink-0 whitespace-nowrap pl-4">
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
