export interface ProductBatch {
  id: string
  batchNumber: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unit: string
  expiryDate: string // DD/MM/YYYY
  daysRemaining: number
  warehouse: 'Kho lạnh 2–8°C' | 'Kho thường'
  status: 'good' | 'expiring_soon' | 'critical'
}

export const MOCK_BATCHES: ProductBatch[] = [
  {
    id: 'batch-01',
    batchNumber: 'LOT-TAT26-11B',
    productId: 'prod-02',
    productName: 'Kem Tươi Whipping Cream Tatua 1L',
    sku: 'GHP-WHIP-TAT1L',
    quantity: 36,
    unit: 'Hộp 1L',
    expiryDate: '25/10/2026',
    daysRemaining: 17,
    warehouse: 'Kho lạnh 2–8°C',
    status: 'critical', // <= 30 days, close to 7
  },
  {
    id: 'batch-02',
    batchNumber: 'LOT-SAF-882',
    productId: 'prod-05',
    productName: 'Men Bánh Mì Instant Vàng Saf-Instant 500g',
    sku: 'GHP-YEAST-SAF500',
    quantity: 80,
    unit: 'Gói 500g',
    expiryDate: '05/11/2026',
    daysRemaining: 28,
    warehouse: 'Kho thường',
    status: 'expiring_soon', // <= 30 days
  },
  {
    id: 'batch-03',
    batchNumber: 'LOT-MASC26-9',
    productId: 'prod-03',
    productName: 'Phô Mai Kem Mascarpone Tatua New Zealand 500g',
    sku: 'GHP-CHEE-MASC500',
    quantity: 48,
    unit: 'Hộp 500g',
    expiryDate: '05/11/2026',
    daysRemaining: 28,
    warehouse: 'Kho lạnh 2–8°C',
    status: 'expiring_soon',
  },
  {
    id: 'batch-04',
    batchNumber: 'LOT-NZ2026-88B',
    productId: 'prod-01',
    productName: 'Bơ Lạt Tự Nhiên Anchor Unsalted Butter 227g',
    sku: 'GHP-BUTTER-ANC227',
    quantity: 180,
    unit: 'Thỏi 227g',
    expiryDate: '28/11/2026',
    daysRemaining: 51,
    warehouse: 'Kho lạnh 2–8°C',
    status: 'good',
  },
  {
    id: 'batch-05',
    batchNumber: 'LOT-HNL-09B',
    productId: 'prod-04',
    productName: 'Bột Mì Hoa Ngọc Lan Số 11 Đa Dụng 1kg',
    sku: 'GHP-FLOUR-HNL1K',
    quantity: 250,
    unit: 'Gói 1kg',
    expiryDate: '15/12/2026',
    daysRemaining: 68,
    warehouse: 'Kho thường',
    status: 'good',
  },
  {
    id: 'batch-06',
    batchNumber: 'LOT-PUR-771',
    productId: 'prod-07',
    productName: 'Bột Cacao Nguyên Chất Puratos 1kg',
    sku: 'GHP-COCOA-PUR1K',
    quantity: 95,
    unit: 'Gói 1kg',
    expiryDate: '20/01/2027',
    daysRemaining: 104,
    warehouse: 'Kho thường',
    status: 'good',
  },
]

export interface StockTransaction {
  id: string
  code: string
  date: string
  type: 'import' | 'export'
  partnerName: string
  totalItems: number
  totalAmount: number
  creator: string
  note: string
}

export const MOCK_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'tr-01',
    code: 'NK-20261008-01',
    date: '08/10/2026, 08:30',
    type: 'import',
    partnerName: 'Công ty TNHH Fonterra Brands Vietnam',
    totalItems: 300,
    totalAmount: 21500000,
    creator: 'Nguyễn Văn Kho',
    note: 'Nhập bơ lạt Anchor và whipping cream lô mới xe lạnh',
  },
  {
    id: 'tr-02',
    code: 'XK-20261008-04',
    date: '08/10/2026, 14:15',
    type: 'export',
    partnerName: 'Tiệm Bánh Vàng (Xuất bán sỉ)',
    totalItems: 40,
    totalAmount: 3080000,
    creator: 'Trần Điều Phối',
    note: 'Xuất hàng sỉ 40 thỏi bơ lạt Anchor thùng xe lạnh',
  },
  {
    id: 'tr-03',
    code: 'NK-20261005-02',
    date: '05/10/2026, 10:00',
    type: 'import',
    partnerName: 'Công ty Cổ phần Bột mì Vimaflour',
    totalItems: 500,
    totalAmount: 12000000,
    creator: 'Nguyễn Văn Kho',
    note: 'Nhập 20 bao bột mì hoa ngọc lan 25kg',
  },
]
