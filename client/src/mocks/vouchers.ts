export type VoucherType = 'fixed' | 'percent' | 'free_shipping'

export interface Voucher {
  id: string
  code: string
  description: string
  type: VoucherType
  value: number // Fixed amount in VND or percentage (e.g., 10 for 10%)
  minOrderValue: number
  maxDiscount?: number
  usageCount: number
  usageLimit: number
  startDate: string
  endDate: string
  isActive: boolean
}

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'vouc-01',
    code: 'BAKING2026',
    description: 'Giảm 30.000₫ cho đơn hàng nguyên liệu từ 300.000₫',
    type: 'fixed',
    value: 30000,
    minOrderValue: 300000,
    usageCount: 142,
    usageLimit: 500,
    startDate: '01/01/2026',
    endDate: '31/12/2026',
    isActive: true,
  },
  {
    id: 'vouc-02',
    code: 'GHPVIP',
    description: 'Giảm 10% tối đa 100.000₫ cho khách hàng thân thiết',
    type: 'percent',
    value: 10,
    minOrderValue: 500000,
    maxDiscount: 100000,
    usageCount: 89,
    usageLimit: 200,
    startDate: '01/03/2026',
    endDate: '31/10/2026',
    isActive: true,
  },
  {
    id: 'vouc-03',
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển tiêu chuẩn cho đơn từ 250.000₫',
    type: 'free_shipping',
    value: 25000,
    minOrderValue: 250000,
    usageCount: 320,
    usageLimit: 1000,
    startDate: '01/01/2026',
    endDate: '31/12/2026',
    isActive: true,
  },
  {
    id: 'vouc-04',
    code: 'CHAOBANMOI',
    description: 'Giảm 20.000₫ cho khách hàng mới đặt đơn đầu tiên',
    type: 'fixed',
    value: 20000,
    minOrderValue: 150000,
    usageCount: 450,
    usageLimit: 1000,
    startDate: '01/01/2026',
    endDate: '30/06/2026',
    isActive: true,
  },
  {
    id: 'vouc-05',
    code: 'COMBO20K',
    description: 'Giảm 20.000₫ khi mua trọn bộ combo làm bánh',
    type: 'fixed',
    value: 20000,
    minOrderValue: 200000,
    usageCount: 64,
    usageLimit: 300,
    startDate: '15/02/2026',
    endDate: '30/11/2026',
    isActive: true,
  },
  {
    id: 'vouc-06',
    code: 'TRIANKHACHSI',
    description: 'Chiết khấu bổ sung 5% cho hóa đơn sỉ từ 5.000.000₫',
    type: 'percent',
    value: 5,
    minOrderValue: 5000000,
    maxDiscount: 500000,
    usageCount: 18,
    usageLimit: 50,
    startDate: '01/09/2026',
    endDate: '31/10/2026',
    isActive: true,
  },
  {
    id: 'vouc-07',
    code: 'TET2026',
    description: 'Ưu đãi Tết nguyên đán - Giảm 50.000₫ cho đơn từ 800.000₫',
    type: 'fixed',
    value: 50000,
    minOrderValue: 800000,
    usageCount: 500,
    usageLimit: 500,
    startDate: '01/01/2026',
    endDate: '15/02/2026',
    isActive: false, // Expired / Inactive demo
  },
]
