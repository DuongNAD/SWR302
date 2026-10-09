import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageTransition } from '@/components/layout/PageTransition'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LayoutDashboard, ShoppingBag, MapPin, Heart, User, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const AccountLayout: React.FC = () => {
  const { currentUser } = useAuth()
  const isWholesale = currentUser?.role === 'wholesale_client'

  const navItems = [
    { to: '/tai-khoan', end: true, label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/tai-khoan/don-hang', label: 'Đơn hàng của tôi', icon: ShoppingBag },
    { to: '/tai-khoan/dia-chi', label: 'Sổ địa chỉ', icon: MapPin },
    { to: '/tai-khoan/yeu-thich', label: 'Sản phẩm yêu thích', icon: Heart },
    { to: '/tai-khoan/ho-so', label: 'Hồ sơ và bảo mật', icon: User },
    ...(isWholesale
      ? [{ to: '/tai-khoan/doanh-nghiep', label: 'Hồ sơ doanh nghiệp', icon: Building2 }]
      : []),
  ]

  return (
    <div className="wrap py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tài khoản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 rounded-lg border border-line bg-surface p-2 overflow-x-auto min-w-0 max-w-full">
          <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
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
          </nav>
        </aside>

        {/* Content Column */}
        <div className="lg:col-span-3 min-w-0 max-w-full">
          <PageTransition>
            <React.Suspense fallback={null}>
              <Outlet />
            </React.Suspense>
          </PageTransition>
        </div>
      </div>
    </div>
  )
}
