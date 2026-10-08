import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { MOCK_ORDERS } from '@/mocks/orders'
import { PRODUCTS } from '@/data/products'
import { Order } from '@/types'
import { Price, formatPrice } from '@/components/ui/price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShoppingBag,
  RotateCcw,
  Ban,
  Snowflake,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

export const AccountOrdersPage: React.FC = () => {
  useDocumentTitle('Lịch sử đơn hàng | Gia Hòa Phát Bakery Supply')

  const { addItem } = useCart()
  const { showToast } = useToast()

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [filterTab, setFilterTab] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    if (filterTab === 'all') return orders
    return orders.filter((o) => o.status === filterTab)
  }, [orders, filterTab])

  const handleCancelOrder = (orderNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'cancelled' } : o))
    )
    showToast({
      type: 'info',
      message: `Đơn hàng #${orderNumber} đã được hủy theo yêu cầu.`,
    })
  }

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const p = PRODUCTS.find((prod) => prod.id === item.productId)
      if (p) {
        addItem(p, item.quantity)
      }
    })
    showToast({
      type: 'success',
      message: `Đã thêm ${order.items.length} món từ đơn #${order.orderNumber} vào giỏ!`,
    })
  }

  return (
    <div className="border border-line rounded-lg bg-surface p-6 space-y-6 shadow-xs">
      <div className="space-y-1 border-b border-line pb-4">
        <h1 className="text-xl font-bold text-ink">
          Lịch sử đơn hàng của tôi
        </h1>
        <p className="text-xs text-ink-3">
          Theo dõi trạng thái giao hàng, kiểm tra nhiệt độ xe lạnh và mua lại nguyên liệu
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterTab} onValueChange={setFilterTab}>
        <TabsList className="bg-page border border-line">
          <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao</TabsTrigger>
          <TabsTrigger value="packing">Đóng gói</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <ShoppingBag className="w-10 h-10 text-ink-3 mx-auto" />
          <p className="text-xs text-ink-2">Không có đơn hàng nào trong mục này.</p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === 'cancelled'

            return (
              <div key={order.orderNumber} className="py-5 space-y-4">
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/don-hang/${order.orderNumber}`}
                      className="font-mono font-bold text-ink text-sm hover:text-brand"
                    >
                      #{order.orderNumber}
                    </Link>
                    <span className="text-ink-3">•</span>
                    <span className="text-ink-3 tabular-nums">{order.createdAt}</span>

                    {order.requiresColdChain && (
                      <span className="text-info flex items-center gap-1 font-medium text-xs">
                        <Snowflake className="w-3 h-3" />
                        Xe lạnh
                      </span>
                    )}
                  </div>

                  <div>
                    {isCancelled ? (
                      <Badge variant="destructive" className="text-xs">
                        Đã hủy
                      </Badge>
                    ) : order.status === 'delivered' ? (
                      <Badge variant="outline" className="text-ok border-ok/40 text-xs">
                        Giao thành công
                      </Badge>
                    ) : order.status === 'shipping' ? (
                      <Badge variant="default" className="bg-brand text-white text-xs">
                        Đang vận chuyển (3,2°C)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {order.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Products in this order */}
                <div className="bg-page/50 border border-line rounded-md p-3 divide-y divide-line/60 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink truncate">{item.productName}</p>
                        <p className="text-xs text-ink-3">
                          {item.unit} · Số lượng: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-ink tabular-nums shrink-0">
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom line: Total & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-xs">
                    <span className="text-ink-3">Tổng cộng: </span>
                    <Price price={order.totalAmount} size="sm" className="font-bold text-brand" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                      <Link to={`/don-hang/${order.orderNumber}`}>
                        Xem chi tiết
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="h-8 text-xs hover:border-brand hover:text-brand"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Mua lại
                    </Button>

                    {!isCancelled && order.status !== 'delivered' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelOrder(order.orderNumber)}
                        className="h-8 text-xs text-danger hover:bg-danger-soft hover:text-danger"
                      >
                        <Ban className="w-3.5 h-3.5 mr-1" />
                        Hủy
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
