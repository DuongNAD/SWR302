import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { StoreLayout } from '@/layouts/StoreLayout'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AccountLayout } from '@/layouts/AccountLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Store Pages
import {
  HomePage,
  ProductListPage,
  SearchPage,
  ProductDetailPage,
  ComboListPage,
  ComboDetailPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  OrderLookupPage,
  OrderTrackingPage,
  WholesalePage,
  StoresPage,
  SupportPage,
  AboutPage,
  ContactPage,
  NotFoundPage,
} from '@/pages/store'

// Auth Pages
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
} from '@/pages/auth'

// Account Pages
import {
  AccountOverviewPage,
  AccountOrdersPage,
  AccountAddressesPage,
  AccountWishlistPage,
  AccountProfilePage,
  AccountBusinessPage,
} from '@/pages/account'

// Admin Pages
import {
  AdminDashboardPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminProductsPage,
  AdminProductFormPage,
  AdminCategoriesPage,
  AdminInventoryPage,
  AdminCustomersPage,
  AdminPromotionsPage,
  AdminShippingPage,
  AdminReportsPage,
  AdminStaffPage,
  AdminSettingsPage,
} from '@/pages/admin'

// Dev Pages
import { StyleGuidePage } from '@/pages/dev/StyleGuidePage'
import { RequirementsMatrixPage } from '@/pages/dev/RequirementsMatrixPage'


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
