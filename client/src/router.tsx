import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { StoreLayout } from '@/layouts/StoreLayout'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AccountLayout } from '@/layouts/AccountLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Static Homepage
import { HomePage } from '@/pages/store/HomePage'

// Lazy Store Pages
const ProductListPage = React.lazy(() => import('@/pages/store/ProductListPage').then((m) => ({ default: m.ProductListPage })))
const SearchPage = React.lazy(() => import('@/pages/store/SearchPage').then((m) => ({ default: m.SearchPage })))
const ProductDetailPage = React.lazy(() => import('@/pages/store/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const ComboListPage = React.lazy(() => import('@/pages/store/ComboListPage').then((m) => ({ default: m.ComboListPage })))
const ComboDetailPage = React.lazy(() => import('@/pages/store/ComboDetailPage').then((m) => ({ default: m.ComboDetailPage })))
const CartPage = React.lazy(() => import('@/pages/store/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = React.lazy(() => import('@/pages/store/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderSuccessPage = React.lazy(() => import('@/pages/store/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })))
const OrderLookupPage = React.lazy(() => import('@/pages/store/OrderLookupPage').then((m) => ({ default: m.OrderLookupPage })))
const OrderTrackingPage = React.lazy(() => import('@/pages/store/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })))
const WholesalePage = React.lazy(() => import('@/pages/store/WholesalePage').then((m) => ({ default: m.WholesalePage })))
const StoresPage = React.lazy(() => import('@/pages/store/StoresPage').then((m) => ({ default: m.StoresPage })))
const SupportPage = React.lazy(() => import('@/pages/store/SupportPage').then((m) => ({ default: m.SupportPage })))
const AboutPage = React.lazy(() => import('@/pages/store/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = React.lazy(() => import('@/pages/store/ContactPage').then((m) => ({ default: m.ContactPage })))
const NotFoundPage = React.lazy(() => import('@/pages/store/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// Lazy Auth Pages
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))

// Lazy Account Pages
const AccountOverviewPage = React.lazy(() => import('@/pages/account/AccountOverviewPage').then((m) => ({ default: m.AccountOverviewPage })))
const AccountOrdersPage = React.lazy(() => import('@/pages/account/AccountOrdersPage').then((m) => ({ default: m.AccountOrdersPage })))
const AccountAddressesPage = React.lazy(() => import('@/pages/account/AccountAddressesPage').then((m) => ({ default: m.AccountAddressesPage })))
const AccountWishlistPage = React.lazy(() => import('@/pages/account/AccountWishlistPage').then((m) => ({ default: m.AccountWishlistPage })))
const AccountProfilePage = React.lazy(() => import('@/pages/account/AccountProfilePage').then((m) => ({ default: m.AccountProfilePage })))
const AccountBusinessPage = React.lazy(() => import('@/pages/account/AccountBusinessPage').then((m) => ({ default: m.AccountBusinessPage })))

// Lazy Admin Pages
const AdminDashboardPage = React.lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const AdminOrdersPage = React.lazy(() => import('@/pages/admin/OrdersPage').then((m) => ({ default: m.AdminOrdersPage })))
const AdminOrderDetailPage = React.lazy(() => import('@/pages/admin/OrderDetailPage').then((m) => ({ default: m.AdminOrderDetailPage })))
const AdminProductsPage = React.lazy(() => import('@/pages/admin/ProductsPage').then((m) => ({ default: m.AdminProductsPage })))
const AdminProductFormPage = React.lazy(() => import('@/pages/admin/ProductFormPage').then((m) => ({ default: m.AdminProductFormPage })))
const AdminCategoriesPage = React.lazy(() => import('@/pages/admin/CategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })))
const AdminInventoryPage = React.lazy(() => import('@/pages/admin/InventoryPage').then((m) => ({ default: m.AdminInventoryPage })))
const AdminCustomersPage = React.lazy(() => import('@/pages/admin/CustomersPage').then((m) => ({ default: m.AdminCustomersPage })))
const AdminPromotionsPage = React.lazy(() => import('@/pages/admin/PromotionsPage').then((m) => ({ default: m.AdminPromotionsPage })))
const AdminShippingPage = React.lazy(() => import('@/pages/admin/ShippingPage').then((m) => ({ default: m.AdminShippingPage })))
const AdminReportsPage = React.lazy(() => import('@/pages/admin/ReportsPage').then((m) => ({ default: m.AdminReportsPage })))
const AdminStaffPage = React.lazy(() => import('@/pages/admin/StaffPage').then((m) => ({ default: m.AdminStaffPage })))
const AdminSettingsPage = React.lazy(() => import('@/pages/admin/SettingsPage').then((m) => ({ default: m.AdminSettingsPage })))

// Lazy Dev Pages
const StyleGuidePage = React.lazy(() => import('@/pages/dev/StyleGuidePage').then((m) => ({ default: m.StyleGuidePage })))
const RequirementsMatrixPage = React.lazy(() => import('@/pages/dev/RequirementsMatrixPage').then((m) => ({ default: m.RequirementsMatrixPage })))

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. STOREFRONT & ACCOUNT (StoreLayout) */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductListPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="/san-pham/:id" element={<ProductDetailPage />} />
        <Route path="/combo" element={<ComboListPage />} />
        <Route path="/combo/:id" element={<ComboDetailPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/tra-cuu-don-hang" element={<OrderLookupPage />} />
        <Route path="/don-hang/:ma" element={<OrderTrackingPage />} />
        <Route path="/mua-si" element={<WholesalePage />} />
        <Route path="/cua-hang" element={<StoresPage />} />
        <Route path="/ho-tro" element={<SupportPage />} />
        <Route path="/ho-tro/:slug" element={<SupportPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />

        {/* Account nested routes */}
        <Route path="/tai-khoan" element={<AccountLayout />}>
          <Route index element={<AccountOverviewPage />} />
          <Route path="don-hang" element={<AccountOrdersPage />} />
          <Route path="dia-chi" element={<AccountAddressesPage />} />
          <Route path="yeu-thich" element={<AccountWishlistPage />} />
          <Route path="ho-so" element={<AccountProfilePage />} />
          <Route path="doanh-nghiep" element={<AccountBusinessPage />} />
        </Route>

        {/* Dev routes */}
        <Route path="/dev/style-guide" element={<StyleGuidePage />} />
        <Route path="/dev/requirements" element={<RequirementsMatrixPage />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. CHECKOUT (CheckoutLayout) */}
      <Route element={<CheckoutLayout />}>
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/dat-hang/thanh-cong/:ma" element={<OrderSuccessPage />} />
      </Route>

      {/* 3. AUTH (AuthLayout) */}
      <Route element={<AuthLayout />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
      </Route>

      {/* 4. ADMIN (AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="don-hang" element={<AdminOrdersPage />} />
        <Route path="don-hang/:id" element={<AdminOrderDetailPage />} />
        <Route path="san-pham" element={<AdminProductsPage />} />
        <Route path="san-pham/moi" element={<AdminProductFormPage />} />
        <Route path="san-pham/:id" element={<AdminProductFormPage />} />
        <Route path="danh-muc" element={<AdminCategoriesPage />} />
        <Route path="ton-kho" element={<AdminInventoryPage />} />
        <Route path="khach-hang" element={<AdminCustomersPage />} />
        <Route path="khuyen-mai" element={<AdminPromotionsPage />} />
        <Route path="van-chuyen" element={<AdminShippingPage />} />
        <Route path="bao-cao" element={<AdminReportsPage />} />
        <Route path="nhan-vien" element={<AdminStaffPage />} />
        <Route path="cai-dat" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  )
}
