import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { DemoWidget } from '@/components/layout/DemoWidget'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-page text-ink">
      <header className="h-16 border-b border-line bg-surface flex items-center">
        <div className="wrap flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-ink hover:text-brand transition-colors">
            <span className="text-xl font-bold tracking-tight">Gia Hòa Phát</span>
            <span className="hidden sm:inline text-xs text-ink-3">Bakery Supply</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[420px]">
          <PageTransition>
            <React.Suspense fallback={null}>
              <Outlet />
            </React.Suspense>
          </PageTransition>
        </div>
      </main>

      <footer className="py-4 border-t border-line text-center text-xs text-ink-3 bg-surface">
        <p>© 2026 Gia Hòa Phát Bakery Supply. Hotline hỗ trợ: 1900 6899</p>
      </footer>
      <DemoWidget />
    </div>
  )
}
