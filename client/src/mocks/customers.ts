export type CustomerType = 'retail' | 'wholesale'

export type CustomerStatus = 'active' | 'pending' | 'rejected' | 'locked'

export interface BusinessProfile {
  companyName: string
  taxCode: string
  representative: string
  businessAddress: string
  invoiceEmail: string
  licenseNumber: string
  businessScale: string // e.g. 'Tiệm bánh thủ công (1-3 cơ sở)', 'Xưởng sản xuất công nghiệp'
  submittedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  type: CustomerType
  status: CustomerStatus
  ordersCount: number
  totalSpent: number
  createdAt: string
  city: string
  businessProfile?: BusinessProfile
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    name: 'Trần Mai Anh',
    email: 'maianh.baker@gmail.com',
    phone: '0912 345 678',
    type: 'wholesale',
    status: 'active',
    ordersCount: 14,
    totalSpent: 18450000,
    createdAt: '15/03/2025',
    city: 'Hà Nội',
    businessProfile: {
      companyName: 'Công ty TNHH Bánh Ngọt Tiệm Vàng',
      taxCode: '0108892345',
      representative: 'Trần Mai Anh',
      businessAddress: 'Số 42 Ngõ 178 Tây Sơn, P. Trung Liệt, Q. Đống Đa, Hà Nội',
      invoiceEmail: 'ketoan@tiemvangbakery.vn',
      licenseNumber: 'GPKD-0108892345/HN',
      businessScale: 'Chuỗi 2 tiệm bánh ngọt & café',
      submittedAt: '12/03/2025',
    },
  },
  {
    id: 'cust-02',
    name: 'Lê Hoàng Tuấn',
    email: 'tuan.le@tiembanhdolce.vn',
    phone: '0903 456 789',
    type: 'wholesale',
    status: 'active',
    ordersCount: 22,
    totalSpent: 45200000,
    createdAt: '10/01/2025',
    city: 'TP.HCM',
    businessProfile: {
      companyName: 'Công ty Cổ phần Tiệm Bánh Dolce Sài Gòn',
      taxCode: '0315894123',
      representative: 'Lê Hoàng Tuấn',
      businessAddress: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP.HCM',
      invoiceEmail: 'tuan.le@tiembanhdolce.vn',
      licenseNumber: 'GPKD-0315894123/HCM',
      businessScale: 'Xưởng sản xuất bánh lạnh cao cấp & 3 cửa hàng',
      submittedAt: '08/01/2025',
    },
  },
  {
    id: 'cust-03',
    name: 'Đỗ Văn Nam (Hoàng Kim Bakery)',
    email: 'ketoan@hoangkimbakery.vn',
    phone: '0945 678 123',
    type: 'wholesale',
    status: 'active',
    ordersCount: 31,
    totalSpent: 86300000,
    createdAt: '20/11/2024',
    city: 'TP.HCM',
    businessProfile: {
      companyName: 'Công ty Cổ phần Bánh Kẹo Hoàng Kim',
      taxCode: '0309988771',
      representative: 'Đỗ Văn Nam',
      businessAddress: '234 Hoàng Văn Thụ, P. 4, Q. Tân Bình, TP.HCM',
      invoiceEmail: 'ketoan@hoangkimbakery.vn',
      licenseNumber: 'GPKD-0309988771/HCM',
      businessScale: 'Hệ thống chuỗi 5 chi nhánh',
      submittedAt: '18/11/2024',
    },
  },
  {
    id: 'cust-04',
    name: 'Nguyễn Thảo My (Tiệm Bánh Mơ Màng)',
    email: 'mybakes@momangbakery.vn',
    phone: '0966 777 888',
    type: 'wholesale',
    status: 'active',
    ordersCount: 8,
    totalSpent: 14250000,
    createdAt: '05/08/2025',
    city: 'Hà Nội',
    businessProfile: {
      companyName: 'Hộ Kinh Doanh Tiệm Bánh Mơ Màng',
      taxCode: '0109128374',
      representative: 'Nguyễn Thảo My',
      businessAddress: '45 Xuân Thủy, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội',
      invoiceEmail: 'mybakes@momangbakery.vn',
      licenseNumber: 'HKD-0109128374/CG',
      businessScale: 'Tiệm bánh kem sinh nhật online & offline',
      submittedAt: '02/08/2025',
    },
  },
  {
    id: 'cust-05',
    name: 'Phan Minh Trí (Bếp Bánh Trí Gia)',
    email: 'trigia.bakery@gmail.com',
    phone: '0938 999 111',
    type: 'wholesale',
    status: 'pending',
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '07/10/2026',
    city: 'Đà Nẵng',
    businessProfile: {
      companyName: 'Công ty TNHH Bánh Ngọt Trí Gia Foods',
      taxCode: '0402198876',
      representative: 'Phan Minh Trí',
      businessAddress: '12 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng',
      invoiceEmail: 'ketoan.trigia@gmail.com',
      licenseNumber: 'GPKD-0402198876/DN',
      businessScale: 'Xưởng gia công bánh mì & bánh lạnh cung cấp khách sạn',
      submittedAt: '07/10/2026',
    },
  },
  {
    id: 'cust-06',
    name: 'Hoàng Kim Ngân (Ngân Cake Lab)',
    email: 'ngancake.lab@gmail.com',
    phone: '0979 444 888',
    type: 'wholesale',
    status: 'pending',
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '08/10/2026',
    city: 'Hà Nội',
    businessProfile: {
      companyName: 'Hộ Kinh Doanh Ngân Cake Studio',
      taxCode: '0109887654',
      representative: 'Hoàng Kim Ngân',
      businessAddress: '88 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm, Hà Nội',
      invoiceEmail: 'ngancake.lab@gmail.com',
      licenseNumber: 'HKD-0109887654/HK',
      businessScale: 'Lớp học làm bánh & tiệm bánh trà chiều cao cấp',
      submittedAt: '08/10/2026',
    },
  },
  {
    id: 'cust-07',
    name: 'Vũ Hải Yến',
    email: 'haiyen.sweetcake@gmail.com',
    phone: '0988 123 456',
    type: 'retail',
    status: 'active',
    ordersCount: 6,
    totalSpent: 2840000,
    createdAt: '12/04/2025',
    city: 'Hà Nội',
  },
  {
    id: 'cust-08',
    name: 'Nguyễn Minh Khoa',
    email: 'khoa.bakeshop@gmail.com',
    phone: '0933 789 012',
    type: 'retail',
    status: 'active',
    ordersCount: 5,
    totalSpent: 3120000,
    createdAt: '18/06/2025',
    city: 'Hà Nội',
  },
  {
    id: 'cust-09',
    name: 'Đặng Thu Trang',
    email: 'trang.dang@outlook.com',
    phone: '0977 234 567',
    type: 'retail',
    status: 'active',
    ordersCount: 4,
    totalSpent: 1950000,
    createdAt: '02/08/2025',
    city: 'Hà Nội',
  },
  {
    id: 'cust-10',
    name: 'Phạm Quỳnh Chi',
    email: 'quynhchi.pastry@gmail.com',
    phone: '0909 333 444',
    type: 'retail',
    status: 'active',
    ordersCount: 3,
    totalSpent: 1240000,
    createdAt: '14/09/2025',
    city: 'TP.HCM',
  },
  {
    id: 'cust-11',
    name: 'Bùi Đức Anh',
    email: 'ducanh.bui@hotmail.com',
    phone: '0918 555 666',
    type: 'retail',
    status: 'active',
    ordersCount: 2,
    totalSpent: 750000,
    createdAt: '01/10/2025',
    city: 'Hà Nội',
  },
  {
    id: 'cust-12',
    name: 'Lý Quốc Bảo',
    email: 'bao.ly@yahoo.com',
    phone: '0922 111 222',
    type: 'retail',
    status: 'active',
    ordersCount: 1,
    totalSpent: 145000,
    createdAt: '05/10/2026',
    city: 'Hà Nội',
  },
]
