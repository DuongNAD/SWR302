export type StaffRole = 'admin' | 'warehouse' | 'sales' | 'accountant'

export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: StaffRole
  roleTitle: string
  storeLocation: string
  status: 'active' | 'suspended'
  joinedDate: string
}

export interface PermissionItem {
  id: string
  category: string
  name: string
  description: string
  admin: boolean
  warehouse: boolean
  sales: boolean
  accountant: boolean
}

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'Nguyễn Gia Hòa',
    email: 'giahoa@giahoaphat.vn',
    phone: '0903 111 222',
    role: 'admin',
    roleTitle: 'Quản trị hệ thống',
    storeLocation: 'Tất cả chi nhánh',
    status: 'active',
    joinedDate: '01/01/2023',
  },
  {
    id: 'staff-02',
    name: 'Phạm Văn Minh',
    email: 'minh.pv@giahoaphat.vn',
    phone: '0912 333 444',
    role: 'warehouse',
    roleTitle: 'Quản lý kho lạnh',
    storeLocation: 'Kho Tổng 180 Cầu Giấy, Hà Nội',
    status: 'active',
    joinedDate: '15/03/2024',
  },
  {
    id: 'staff-03',
    name: 'Lê Thu Hương',
    email: 'huong.lt@giahoaphat.vn',
    phone: '0988 555 666',
    role: 'sales',
    roleTitle: 'Nhân viên bán hàng & CSKH',
    storeLocation: 'Showroom 45 Nguyễn Trãi, Q.5, TP.HCM',
    status: 'active',
    joinedDate: '02/06/2024',
  },
  {
    id: 'staff-04',
    name: 'Trần Thị Kim Loan',
    email: 'loan.ttk@giahoaphat.vn',
    phone: '0977 777 888',
    role: 'accountant',
    roleTitle: 'Kế toán trưởng',
    storeLocation: 'Văn phòng trụ sở Hà Nội',
    status: 'active',
    joinedDate: '10/08/2023',
  },
  {
    id: 'staff-05',
    name: 'Vũ Đức Thành',
    email: 'thanh.vd@giahoaphat.vn',
    phone: '0934 888 999',
    role: 'warehouse',
    roleTitle: 'Thủ kho thực phẩm',
    storeLocation: 'Kho trung chuyển Q.5, TP.HCM',
    status: 'active',
    joinedDate: '20/11/2024',
  },
  {
    id: 'staff-06',
    name: 'Đặng Mai Phương',
    email: 'phuong.dm@giahoaphat.vn',
    phone: '0966 222 333',
    role: 'sales',
    roleTitle: 'Nhân viên bán hàng B2B',
    storeLocation: 'Showroom 180 Cầu Giấy, Hà Nội',
    status: 'active',
    joinedDate: '05/01/2025',
  },
]

export const MOCK_PERMISSIONS: PermissionItem[] = [
  {
    id: 'perm-01',
    category: 'Đơn hàng & Giao vận',
    name: 'Xem danh sách & chi tiết đơn hàng',
    description: 'Truy cập thông tin đơn hàng, tra cứu mã đơn',
    admin: true,
    warehouse: true,
    sales: true,
    accountant: true,
  },
  {
    id: 'perm-02',
    category: 'Đơn hàng & Giao vận',
    name: 'Xử lý trạng thái & in phiếu xuất kho',
    description: 'Chuyển đơn sang đóng gói, in phiếu giao xe lạnh',
    admin: true,
    warehouse: true,
    sales: true,
    accountant: false,
  },
  {
    id: 'perm-03',
    category: 'Sản phẩm & Tồn kho',
    name: 'Thêm & sửa thông tin sản phẩm, giá bán',
    description: 'Điều chỉnh danh mục, mô tả, bảng giá sỉ',
    admin: true,
    warehouse: false,
    sales: false,
    accountant: false,
  },
  {
    id: 'perm-04',
    category: 'Sản phẩm & Tồn kho',
    name: 'Điều chỉnh tồn kho & quản lý lô FEFO',
    description: 'Nhập số lượng tồn, cập nhật HSD lô hàng lạnh',
    admin: true,
    warehouse: true,
    sales: false,
    accountant: false,
  },
  {
    id: 'perm-05',
    category: 'Khách hàng & Khuyến mãi',
    name: 'Duyệt hồ sơ đăng ký khách mua sỉ',
    description: 'Xem MST, giấy phép kinh doanh và cấp quyền B2B',
    admin: true,
    warehouse: false,
    sales: true,
    accountant: false,
  },
  {
    id: 'perm-06',
    category: 'Khách hàng & Khuyến mãi',
    name: 'Tạo mã voucher & chương trình ưu đãi',
    description: 'Cấu hình mã giảm giá, giới hạn ngân sách',
    admin: true,
    warehouse: false,
    sales: true,
    accountant: false,
  },
  {
    id: 'perm-07',
    category: 'Tài chính & Báo cáo',
    name: 'Xem báo cáo doanh thu & xuất hóa đơn VAT',
    description: 'Báo cáo doanh số theo ngày/tháng, đối soát thuế',
    admin: true,
    warehouse: false,
    sales: false,
    accountant: true,
  },
  {
    id: 'perm-08',
    category: 'Hệ thống & Cài đặt',
    name: 'Quản lý tài khoản nhân viên & cấu hình shop',
    description: 'Thêm/xóa nhân sự, phân quyền, cấu hình cổng thanh toán',
    admin: true,
    warehouse: false,
    sales: false,
    accountant: false,
  },
]
