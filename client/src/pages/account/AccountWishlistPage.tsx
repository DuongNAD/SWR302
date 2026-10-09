import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCTS } from '@/data/products'
import { Product } from '@/types'
import { Price } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2, Snowflake } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

export const AccountWishlistPage: React.FC = () => {
  useDocumentTitle('Sản phẩm yêu thích | Gia Hòa Phát Bakery Supply')

  const { addItem } = useCart()
  const { showToast } = useToast()

  // Sample 4 wishlist items
  const [wishlist, setWishlist] = useState<Product[]>(() => PRODUCTS.slice(0, 4))

  const handleRemove = (productId: string, name: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId))
    showToast({
      type: 'info',
      message: `Đã gỡ “${name}” khỏi danh sách yêu thích.`,
    })
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    showToast({
      type: 'success',
      message: `Đã thêm 1 ${product.unit} “${product.name}” vào giỏ hàng.`,
    })
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 space-y-6 shadow-xs">
      <div className="space-y-1 border-b border-line pb-4">
        <h1 className="text-xl font-bold text-ink">
          Sản phẩm yêu thích ({wishlist.length})
        </h1>
        <p className="text-xs text-ink-3">
          Danh sách nguyên liệu và khuôn khay làm bánh bạn đã lưu để mua lại định kỳ
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Heart className="w-10 h-10 text-ink-3 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-ink">Chưa có sản phẩm yêu thích nào</p>
            <p className="text-xs text-ink-3">
              Bấm vào biểu tượng trái tim ở từng sản phẩm để lưu vào danh sách này.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/san-pham">Khám phá sản phẩm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="border border-line rounded-md p-4 bg-page/50 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <Link
                  to={`/san-pham/${product.id}`}
                  className="w-16 h-16 rounded-md border border-line bg-surface overflow-hidden shrink-0 block"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-brand">{product.brand}</span>
                    {product.storageCondition !== 'ambient' && (
                      <span className="text-info text-xs font-medium flex items-center gap-0.5">
                        <Snowflake className="w-2.5 h-2.5" />
                        Lạnh
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/san-pham/${product.id}`}
                    className="text-xs font-semibold text-ink hover:text-brand transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-ink-3">{product.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line/60">
                <Price price={product.price} size="sm" className="font-bold text-ink" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="h-8 text-xs hover:border-brand hover:text-brand"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Thêm giỏ
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(product.id, product.name)}
                    className="h-8 w-8 text-ink-3 hover:text-danger hover:bg-danger-soft"
                    title="Bỏ yêu thích"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
