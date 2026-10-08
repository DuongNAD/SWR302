import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { formatPrice } from '@/components/ui/price'
import { useCart } from '@/context/CartContext'
import { Snowflake, Trash2, ArrowRight, PackageOpen } from 'lucide-react'

export const MiniCart: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    totalItemCount,
    subtotal,
    requiresColdChain,
    coldPackagingFee,
    isColdPackagingFree,
    freeShippingProgress,
    amountNeededForFreeShip,
    updateQuantity,
    removeItem,
  } = useCart()

  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    setIsCartOpen(false)
    navigate(path)
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-line text-left">
          <SheetTitle className="text-base font-semibold text-ink flex items-center justify-between">
            <span>Giỏ hàng ({totalItemCount})</span>
          </SheetTitle>

          {/* Free shipping progress */}
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-xs text-ink-2">
              <span>
                {amountNeededForFreeShip > 0
                  ? `Mua thêm ${formatPrice(amountNeededForFreeShip)} để được miễn phí vận chuyển`
                  : 'Đơn hàng được miễn phí vận chuyển'}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${Math.min(100, freeShippingProgress)}%` }}
              />
            </div>
          </div>

          {/* Cold packaging notice */}
          {requiresColdChain && (
            <div className="mt-2 flex items-center gap-2 p-2 rounded bg-info-soft border border-info/20 text-xs text-info">
              <Snowflake className="h-3.5 w-3.5 shrink-0" />
              <span>
                Đơn có hàng bảo quản lạnh (2–8°C).{' '}
                {isColdPackagingFree
                  ? 'Được miễn phí đóng gói đá gel.'
                  : `Phí đóng gói đá gel: ${formatPrice(coldPackagingFee)}.`}
              </span>
            </div>
          )}
        </SheetHeader>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <PackageOpen className="h-10 w-10 text-ink-3 mx-auto mb-3" />
              <p className="text-sm font-semibold text-ink mb-1">Giỏ hàng đang trống</p>
              <p className="text-xs text-ink-2 mb-4">
                Hãy lựa chọn các nguyên liệu làm bánh tươi ngon để tiếp tục.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/san-pham')}
              >
                Xem sản phẩm
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 pb-3 border-b border-line last:border-b-0"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-16 w-16 rounded border border-line object-cover bg-page shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/san-pham/${item.product.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-medium text-ink hover:text-brand line-clamp-2 transition-colors"
                  >
                    {item.product.name}
                  </Link>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink tabular-nums">
                      {formatPrice(item.selectedPrice)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-ink-3 hover:text-bad p-1 transition-colors cursor-pointer"
                      aria-label="Xóa món"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      onChange={(newQty) => updateQuantity(item.product.id, newQty)}
                      min={1}
                      max={item.product.stockQty}
                    />

                    <span className="text-xs font-bold text-ink tabular-nums">
                      {formatPrice(item.selectedPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-line bg-surface space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-2">Tạm tính:</span>
              <span className="text-base font-bold text-ink tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleNavigate('/gio-hang')}
                className="w-full"
              >
                Xem giỏ hàng
              </Button>

              <Button
                onClick={() => handleNavigate('/thanh-toan')}
                className="w-full"
              >
                <span>Thanh toán</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
