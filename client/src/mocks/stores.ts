export interface StoreBranch {
  id: string
  name: string
  address: string
  city: 'Hà Nội' | 'TP. Hồ Chí Minh'
  phone: string
  openHours: string
  mapUrl?: string
}

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: 'store-hn-01',
    name: 'Chi nhánh Đống Đa (Trụ sở chính)',
    address: 'Số 42 Ngõ 178 Tây Sơn, P. Trung Liệt, Q. Đống Đa, Hà Nội',
    city: 'Hà Nội',
    phone: '024 3857 1234',
    openHours: '08:00 – 21:00 (Thứ 2 – Chủ Nhật)',
  },
  {
    id: 'store-hn-02',
    name: 'Chi nhánh Cầu Giấy',
    address: 'Số 125 Trần Thái Tông, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội',
    city: 'Hà Nội',
    phone: '024 3792 5678',
    openHours: '08:00 – 21:00 (Thứ 2 – Chủ Nhật)',
  },
  {
    id: 'store-hcm-01',
    name: 'Chi nhánh Quận 1 (Kho Trung Tâm Phía Nam)',
    address: 'Số 88 Hàm Nghi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    phone: '028 3914 9876',
    openHours: '08:00 – 21:30 (Thứ 2 – Chủ Nhật)',
  },
  {
    id: 'store-hcm-02',
    name: 'Chi nhánh Bình Thạnh',
    address: 'Số 452 Điện Biên Phủ, P. 21, Q. Bình Thạnh, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    phone: '028 3512 3456',
    openHours: '08:00 – 21:00 (Thứ 2 – Chủ Nhật)',
  },
]

export type StoreStockStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng'

export const getStoreAvailability = (productId: string, stock: number): Array<{ store: StoreBranch; status: StoreStockStatus; qtyHint: string }> => {
  if (stock <= 0) {
    return STORE_BRANCHES.map((store) => ({
      store,
      status: 'Hết hàng',
      qtyHint: 'Tạm hết',
    }))
  }

  // Consistent deterministic stock status per store based on product id
  return STORE_BRANCHES.map((store, index) => {
    if (index === 0) {
      return {
        store,
        status: stock > 10 ? 'Còn hàng' : 'Sắp hết',
        qtyHint: stock > 10 ? `Còn ${Math.floor(stock * 0.4)} tại kho` : 'Chỉ còn 3',
      }
    }
    if (index === 1) {
      return {
        store,
        status: stock > 20 ? 'Còn hàng' : 'Sắp hết',
        qtyHint: stock > 20 ? `Còn ${Math.floor(stock * 0.3)} tại kho` : 'Chỉ còn 2',
      }
    }
    if (index === 2) {
      return {
        store,
        status: stock > 15 ? 'Còn hàng' : 'Sắp hết',
        qtyHint: stock > 15 ? `Còn ${Math.floor(stock * 0.25)} tại kho` : 'Chỉ còn 4',
      }
    }
    return {
      store,
      status: 'Còn hàng',
      qtyHint: `Còn ${Math.max(5, Math.floor(stock * 0.05))} tại kho`,
    }
  })
}
