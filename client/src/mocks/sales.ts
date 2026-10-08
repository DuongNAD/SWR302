export interface DailySales {
  date: string
  revenue: number
  ordersCount: number
}

export const DAILY_SALES_7D: DailySales[] = [
  { date: '02/10', revenue: 4250000, ordersCount: 14 },
  { date: '03/10', revenue: 5800000, ordersCount: 19 },
  { date: '04/10', revenue: 3900000, ordersCount: 12 },
  { date: '05/10', revenue: 6400000, ordersCount: 22 },
  { date: '06/10', revenue: 7850000, ordersCount: 26 },
  { date: '07/10', revenue: 8900000, ordersCount: 31 },
  { date: '08/10', revenue: 6720000, ordersCount: 24 },
]

export const DAILY_SALES_30D: DailySales[] = [
  { date: 'Tuần 1', revenue: 28400000, ordersCount: 95 },
  { date: 'Tuần 2', revenue: 34100000, ordersCount: 114 },
  { date: 'Tuần 3', revenue: 31800000, ordersCount: 106 },
  { date: 'Tuần 4', revenue: 42600000, ordersCount: 142 },
]

export interface StatusCount {
  status: string
  label: string
  count: number
  percentage: number
  colorClass: string
}

export const ORDER_STATUS_SUMMARY: StatusCount[] = [
  { status: 'shipping', label: 'Đang vận chuyển xe lạnh', count: 18, percentage: 38, colorClass: 'bg-brand' },
  { status: 'packing', label: 'Kho đang đóng gói', count: 8, percentage: 17, colorClass: 'bg-sky-600' },
  { status: 'confirmed', label: 'Đã xác nhận', count: 6, percentage: 13, colorClass: 'bg-amber-600' },
  { status: 'delivered', label: 'Giao hoàn tất', count: 14, percentage: 29, colorClass: 'bg-emerald-600' },
  { status: 'cancelled', label: 'Đã hủy', count: 1, percentage: 3, colorClass: 'bg-stone-400' },
]

export interface ColdChainTrip {
  id: string
  tripCode: string
  driver: string
  plate: string
  orderCount: number
  tempNow: number
  route: string
  status: 'Đang giao' | 'Đã về kho' | 'Chờ xuất bến'
}

export const TODAY_COLD_CHAIN_TRIPS: ColdChainTrip[] = [
  {
    id: 'trip-01',
    tripCode: 'REEFER-HN01',
    driver: 'Nguyễn Văn Hùng',
    plate: '29C-881.92',
    orderCount: 6,
    tempNow: 3.2,
    route: 'Tây Sơn → Đống Đa → Ba Đình → Hoàn Kiếm',
    status: 'Đang giao',
  },
  {
    id: 'trip-02',
    tripCode: 'REEFER-HN02',
    driver: 'Trần Đình Trọng',
    plate: '29H-542.11',
    orderCount: 5,
    tempNow: 4.1,
    route: 'Cầu Giấy → Nam Từ Liêm → Hà Đông',
    status: 'Đang giao',
  },
  {
    id: 'trip-03',
    tripCode: 'REEFER-HCM01',
    driver: 'Lê Minh Quân',
    plate: '51D-921.84',
    orderCount: 8,
    tempNow: 3.8,
    route: 'Quận 1 → Bình Thạnh → Phú Nhuận → TP. Thủ Đức',
    status: 'Đang giao',
  },
]
