import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export const DemoWidget: React.FC = () => {
  const { currentUser, role, loginAs } = useAuth()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRoleSelect = (newRole: 'customer' | 'wholesale_client' | 'admin') => {
    loginAs(newRole)
    setOpen(false)
    if (newRole === 'admin') {
      navigate('/admin')
    }
  }

  const roleLabels: Record<string, string> = {
    customer: 'Khách lẻ',
    wholesale_client: 'Khách sỉ',
    admin: 'Quản trị',
  }

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 px-3 rounded-md bg-ink text-white text-xs font-medium shadow-pop hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
        aria-label="Mở bảng điều khiển demo"
      >
        <span>Demo: {roleLabels[role] || 'Khách'}</span>
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-72 rounded-lg border border-line bg-surface p-4 shadow-modal text-ink space-y-4">
          <div>
            <span className="text-xs font-semibold text-ink-3 block">
              Vai trò hiện tại
            </span>
            <div className="mt-1 font-medium text-sm text-ink flex items-center justify-between">
              <span>{currentUser?.name || 'Khách'}</span>
              <span className="text-xs text-brand font-semibold">
                {roleLabels[role]}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-ink-3 block">Đổi vai trò nhanh:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleRoleSelect('customer')}
                className={cn(
                  'py-1.5 px-2 text-xs rounded border text-center transition-colors cursor-pointer',
                  role === 'customer'
                    ? 'bg-brand text-white border-brand font-semibold'
                    : 'bg-page text-ink border-line hover:border-field'
                )}
              >
                Khách lẻ
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('wholesale_client')}
                className={cn(
                  'py-1.5 px-2 text-xs rounded border text-center transition-colors cursor-pointer',
                  role === 'wholesale_client'
                    ? 'bg-brand text-white border-brand font-semibold'
                    : 'bg-page text-ink border-line hover:border-field'
                )}
              >
                Khách sỉ
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={cn(
                  'py-1.5 px-2 text-xs rounded border text-center transition-colors cursor-pointer',
                  role === 'admin'
                    ? 'bg-brand text-white border-brand font-semibold'
                    : 'bg-page text-ink border-line hover:border-field'
                )}
              >
                Quản trị
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-line space-y-2 text-xs">
            <Link
              to="/dev/requirements"
              onClick={() => setOpen(false)}
              className="block text-ink-2 hover:text-brand font-medium transition-colors"
            >
              Ma trận yêu cầu (SWR302)
            </Link>
            <Link
              to="/dev/style-guide"
              onClick={() => setOpen(false)}
              className="block text-ink-2 hover:text-brand font-medium transition-colors"
            >
              Bộ thành phần giao diện
            </Link>
            <Link
              to="/legacy"
              onClick={() => setOpen(false)}
              className="block text-ink-3 hover:text-ink transition-colors"
            >
              Bản giao diện cũ (Legacy)
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
