import React, { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageTransition } from '@/components/layout/PageTransition'
import { DemoWidget } from '@/components/layout/DemoWidget'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Archive,
  Users,
  Tag,
  Truck,
  BarChart3,
  ShieldAlert,
  Settings,
  Store,
  Menu,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  interface NavItem {
    to: string
    label: string
    icon: React.ElementType
    end?: boolean
  }

  const navGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'Tổng quan',
      items: [
        { to: '/admin', end: true, label: 'Bảng điều khiển', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Bán hàng',
      items: [
        { to: '/admin/don-hang', label: 'Đơn hàng', icon: ShoppingBag },
        { to: '/admin/khach-hang', label: 'Khách hàng', icon: Users },
        { to: '/admin/khuyen-mai', label: 'Khuyến mãi & mã', icon: Tag },
      ],
    },
    {
      group: 'Sản phẩm & Kho',
      items: [
        { to: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
        { to: '/admin/danh-muc', label: 'Danh mục', icon: Layers },
        { to: '/admin/ton-kho', label: 'Tồn kho & lô HSD', icon: Archive },
      ],
    },
    {
      group: 'Vận hành',
      items: [
        { to: '/admin/van-chuyen', label: 'Vận chuyển chuỗi lạnh', icon: Truck },
        { to: '/admin/bao-cao', label: 'Báo cáo doanh thu', icon: BarChart3 },
      ],
    },
    {
      group: 'Hệ thống',
      items: [
        { to: '/admin/nhan-vien', label: 'Nhân viên & quyền', icon: ShieldAlert },
        { to: '/admin/cai-dat', label: 'Cài đặt hệ thống', icon: Settings },
      ],
    },
  ]

  const navContent = (
    <div className="flex flex-col h-full bg-surface text-ink">
      <div className="h-14 border-b border-line flex items-center px-4 gap-2">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-ink">
          <span className="text-lg">Gia Hòa Phát</span>
          <span className="text-xs text-brand font-medium border border-brand/20 bg-brand-soft px-1.5 py-0.5 rounded">
            Quản trị
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((g) => (
          <div key={g.group} className="space-y-1">
            <div className="px-2 text-xs font-semibold text-ink-3">
              {g.group}
            </div>
            {g.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-brand-soft text-brand font-semibold'
                        : 'text-ink-2 hover:bg-page hover:text-ink'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-line">
        <Link
          to="/"
          className="flex items-center gap-2 px-2.5 py-2 text-sm text-ink-2 hover:text-ink hover:bg-page rounded-md transition-colors"
        >
          <Store className="h-4 w-4 shrink-0" />
          <span>Xem cửa hàng</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-page text-ink">
      {/* Desktop Sidebar (240px) */}
      <aside className="hidden lg:block w-60 border-r border-line bg-surface shrink-0">
        {navContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (56px) */}
        <header className="h-14 bg-surface border-b border-line flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden p-2 -ml-2 rounded-md hover:bg-page text-ink-2 hover:text-ink cursor-pointer"
                  aria-label="Mở menu quản trị"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                {navContent}
              </SheetContent>
            </Sheet>

            <span className="text-sm font-medium text-ink-2 hidden sm:inline">
              Hệ thống bán lẻ & thiết bị làm bánh Gia Hòa Phát
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink bg-page hover:bg-line border border-line px-2.5 py-1.5 rounded-md transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Xem cửa hàng</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium text-ink">
              <div className="h-7 w-7 rounded-full bg-brand-soft border border-line flex items-center justify-center text-brand font-bold text-xs">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden md:inline">{currentUser?.name || 'Nguyễn Anh Dương'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-x-hidden">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      <DemoWidget />
    </div>
  )
}
