import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { MOCK_ORDERS } from '@/mocks/orders'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Search, AlertCircle, Truck } from 'lucide-react'

export const OrderLookupPage: React.FC = () => {
  useDocumentTitle('Tra cứu đơn hàng | Gia Hòa Phát Bakery Supply')
  const navigate = useNavigate()

  const [orderCode, setOrderCode] = useState('GHP-889120')
  const [phoneNumber, setPhoneNumber] = useState('0912 345 678')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanCode = orderCode.trim().toUpperCase()
    if (!cleanCode) {
      setErrorMessage('Vui lòng nhập mã đơn hàng.')
      return
    }

    // Match either in mock orders or demo code
    const found = MOCK_ORDERS.find((o) => o.orderNumber.toUpperCase() === cleanCode)

    if (cleanCode === 'GHP-889120' || found) {
      navigate(`/don-hang/${cleanCode}`)
    } else {
      setErrorMessage('Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và số điện thoại.')
    }
  }

  return (
    <div className="wrap py-8 md:py-12 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tra cứu đơn hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center mx-auto text-brand">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-ink">
          Tra cứu đơn hàng nhanh
        </h1>
        <p className="text-xs text-ink-2 max-w-sm mx-auto leading-relaxed">
          Nhập mã đơn hàng và số điện thoại bạn đã sử dụng khi đặt hàng để theo dõi tiến độ giao hàng và thông số nhiệt độ xe lạnh.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="border border-line rounded-lg bg-surface p-6 space-y-5 shadow-xs">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lookup-code">Mã đơn hàng *</Label>
            <Input
              id="lookup-code"
              value={orderCode}
              onChange={(e) => {
                setOrderCode(e.target.value.toUpperCase())
                setErrorMessage(null)
              }}
              placeholder="Ví dụ: GHP-889120"
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lookup-phone">Số điện thoại người nhận *</Label>
            <Input
              id="lookup-phone"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="0912 345 678"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-md bg-danger-soft border border-danger/40 text-danger text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Tra cứu đơn hàng
          </Button>
        </form>

        {/* Demo Hint */}
        <div className="pt-3 border-t border-line text-xs text-ink-3 space-y-1">
          <p className="font-semibold text-ink-2">Mã đơn thử nghiệm sẵn có:</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_ORDERS.map((o) => (
              <button
                key={o.orderNumber}
                type="button"
                onClick={() => {
                  setOrderCode(o.orderNumber)
                  setPhoneNumber(o.customerPhone)
                  setErrorMessage(null)
                }}
                className="font-mono px-2 py-1 rounded-sm bg-page border border-line text-brand hover:border-brand transition-colors cursor-pointer"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
