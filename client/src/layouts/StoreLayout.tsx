import React from 'react'
import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { MiniCart } from '@/components/layout/MiniCart'
import { DemoWidget } from '@/components/layout/DemoWidget'
import { PageTransition } from '@/components/layout/PageTransition'

export const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-page text-ink selection:bg-brand-soft selection:text-brand">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
      <MiniCart />
      <DemoWidget />
    </div>
  )
}
