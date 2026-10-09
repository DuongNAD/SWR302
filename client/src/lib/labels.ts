export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang vận chuyển',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

export const PAYMENT_LABEL: Record<string, string> = {
  vnpay: 'VNPAY-QR',
  momo: 'Ví MoMo',
  banking: 'Chuyển khoản',
  cod: 'Tiền mặt (COD)',
}

export const SHIPPING_LABEL: Record<string, string> = {
  standard: 'Tiêu chuẩn',
  chilled_express: 'Xe lạnh chuyên dụng',
}

export const TRIP_STATUS_LABEL: Record<string, string> = {
  en_route: 'Đang giao',
  'Đang giao': 'Đang giao',
  completed: 'Hoàn thành',
  'Hoàn thành': 'Hoàn thành',
  preparing: 'Chuẩn bị',
  'Chuẩn bị': 'Chuẩn bị',
}

export function getOrderStatusBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-warn-soft text-warn border-warn/30'
    case 'confirmed':
      return 'bg-info-soft text-info border-info/30'
    case 'packing':
      return 'bg-brand-soft text-brand border-brand/30'
    case 'shipping':
      return 'bg-brand text-white border-brand'
    case 'delivered':
      return 'bg-ok-soft text-ok border-ok/30'
    case 'cancelled':
      return 'bg-page text-ink-3 border-line'
    default:
      return 'bg-page text-ink-2 border-line'
  }
}
