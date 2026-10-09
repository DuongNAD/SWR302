import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { MOCK_CUSTOMERS, Customer } from '@/mocks/customers'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Price } from '@/components/ui/price'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Building2,
  UserCheck,
  UserX,
  FileText,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminCustomersPage: React.FC = () => {
  useDocumentTitle('Quản lý khách hàng | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [activeTab, setActiveTab] = useState<'all' | 'wholesale' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Selected customer for business review modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  // Pending count
  const pendingCount = useMemo(() => {
    return customers.filter((c) => c.status === 'pending').length
  }, [customers])

  const wholesaleCount = useMemo(() => {
    return customers.filter((c) => c.type === 'wholesale').length
  }, [customers])

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Tab filter
      if (activeTab === 'wholesale' && c.type !== 'wholesale') return false
      if (activeTab === 'pending' && c.status !== 'pending') return false

      // Search filter
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchName = c.name.toLowerCase().includes(q)
        const matchEmail = c.email.toLowerCase().includes(q)
        const matchPhone = c.phone.includes(q)
        const matchCompany = c.businessProfile?.companyName.toLowerCase().includes(q) || false
        if (!matchName && !matchEmail && !matchPhone && !matchCompany) return false
      }

      return true
    })
  }, [customers, activeTab, searchQuery])

  // Paginated data
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCustomers.slice(start, start + pageSize)
  }, [filteredCustomers, currentPage, pageSize])

  // Approve wholesale customer
  const handleApproveWholesale = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'active', type: 'wholesale' } : c))
    )
    setIsReviewOpen(false)
    showToast({ message: 'Đã phê duyệt tài khoản khách sỉ thành công.', type: 'success' })
  }

  // Reject wholesale customer
  const handleRejectWholesale = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'rejected' } : c))
    )
    setIsReviewOpen(false)
    showToast({ message: 'Đã từ chối yêu cầu đăng ký khách sỉ.', type: 'info' })
  }

  const columns: ColumnDef<Customer>[] = [
    {
      header: 'Khách hàng',
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-ink flex items-center gap-1.5">
            {item.name}
            {item.businessProfile && (
              <span title="Khách doanh nghiệp / tiệm bánh">
                <Building2 className="w-3.5 h-3.5 text-brand" />
              </span>
            )}
          </div>
          <div className="text-xs text-ink-3 flex items-center gap-2">
            <span>{item.email}</span>
            <span>•</span>
            <span>{item.city}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Loại tài khoản',
      cell: (item) => (
        item.type === 'wholesale' ? (
          <Badge variant="outline" className="border-brand/40 text-brand bg-brand-soft text-xs font-medium">
            Khách sỉ / B2B
          </Badge>
        ) : (
          <Badge variant="outline" className="border-line text-ink-2 bg-surface text-xs font-normal">
            Khách lẻ
          </Badge>
        )
      ),
    },
    {
      header: 'Số điện thoại',
      cell: (item) => <span className="font-mono text-xs tabular-nums">{item.phone}</span>,
    },
    {
      header: 'Số đơn',
      cell: (item) => (
        <span className="font-semibold text-ink tabular-nums">{item.ordersCount}</span>
      ),
    },
    {
      header: 'Tổng chi tiêu',
      className: 'text-right',
      cell: (item) => (
        <div className="text-right">
          <Price price={item.totalSpent} className="font-semibold text-xs tabular-nums text-ink" />
        </div>
      ),
    },
    {
      header: 'Ngày tạo',
      cell: (item) => <span className="text-xs text-ink-3 tabular-nums">{item.createdAt}</span>,
    },
    {
      header: 'Trạng thái',
      cell: (item) => {
        if (item.status === 'pending') {
          return (
            <Badge variant="outline" className="border-warn/40 text-warn bg-warn-soft gap-1 text-xs">
              <Clock className="w-3 h-3" />
              Chờ duyệt sỉ
            </Badge>
          )
        }
        if (item.status === 'rejected') {
          return (
            <Badge variant="outline" className="border-danger/40 text-danger bg-danger-soft text-xs">
              Từ chối
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="border-ok/40 text-ok bg-ok-soft gap-1 text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Hoạt động
          </Badge>
        )
      },
    },
    {
      header: 'Thao tác',
      sticky: 'right',
      className: 'w-[110px] min-w-[110px] text-right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.businessProfile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCustomer(item)
                setIsReviewOpen(true)
              }}
              className="h-7 text-xs px-2.5 gap-1 text-ink-2 hover:text-brand"
            >
              <Eye className="w-3.5 h-3.5" />
              {item.status === 'pending' ? 'Duyệt hồ sơ' : 'Xem hồ sơ'}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => showToast({ message: `Xem chi tiết khách hàng ${item.name}`, type: 'info' })}
              className="h-7 text-xs px-2 text-ink-3 hover:text-ink"
            >
              Xem
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Quản lý khách hàng</h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Danh sách khách hàng bán lẻ, tiệm bánh đối tác mua sỉ và hồ sơ doanh nghiệp chờ duyệt
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as 'all' | 'wholesale' | 'pending')
            setCurrentPage(1)
          }}
          className="w-full"
        >
          <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Tất cả khách hàng ({customers.length})
            </TabsTrigger>
            <TabsTrigger
              value="wholesale"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Khách sỉ / B2B ({wholesaleCount})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold flex items-center gap-1.5"
            >
              Chờ duyệt
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-warn-soft text-warn rounded text-xs font-bold">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={(v) => {
          setSearchQuery(v)
          setCurrentPage(1)
        }}
        searchPlaceholder="Tìm theo tên, email, SĐT, công ty..."
        onExportCsv={() => showToast({ message: 'Đang xuất danh sách khách hàng ra CSV...', type: 'info' })}
        hasActiveFilters={Boolean(searchQuery)}
        onResetFilters={() => setSearchQuery('')}
      />

      {/* Table */}
      <DataTable
        data={paginatedCustomers}
        columns={columns}
        keyExtractor={(item) => item.id}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredCustomers.length}
        pageSize={pageSize}
        emptyMessage="Không tìm thấy khách hàng nào"
      />

      {/* Business Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-xl p-6 bg-surface border border-line rounded-lg">
          {selectedCustomer && selectedCustomer.businessProfile && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center justify-between gap-3">
                  <DialogTitle className="text-base font-bold text-ink flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand" />
                    Hồ sơ doanh nghiệp khách sỉ
                  </DialogTitle>
                  {selectedCustomer.status === 'pending' ? (
                    <Badge variant="outline" className="border-warn/40 text-warn bg-warn-soft text-xs">
                      Chờ duyệt
                    </Badge>
                  ) : selectedCustomer.status === 'rejected' ? (
                    <Badge variant="outline" className="border-danger/40 text-danger bg-danger-soft text-xs">
                      Từ chối
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-ok/40 text-ok bg-ok-soft text-xs">
                      Đã duyệt
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-xs text-ink-3">
                  Đăng ký ngày {selectedCustomer.businessProfile.submittedAt} • Mã khách hàng: {selectedCustomer.id}
                </DialogDescription>
              </DialogHeader>

              {/* Company Info Box */}
              <div className="p-3.5 bg-page rounded-md border border-line space-y-2.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-ink-3 block text-xs">Tên doanh nghiệp / Hộ kinh doanh:</span>
                    <strong className="text-ink block mt-0.5">{selectedCustomer.businessProfile.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-ink-3 block text-xs">Mã số thuế:</span>
                    <strong className="text-ink font-mono mt-0.5 block">{selectedCustomer.businessProfile.taxCode}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-line">
                  <div>
                    <span className="text-ink-3 block text-xs">Người đại diện pháp luật:</span>
                    <span className="text-ink font-medium mt-0.5 block">{selectedCustomer.businessProfile.representative}</span>
                  </div>
                  <div>
                    <span className="text-ink-3 block text-xs">Số ĐKKD / Giấy phép:</span>
                    <span className="text-ink font-mono text-xs mt-0.5 block">{selectedCustomer.businessProfile.licenseNumber}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-line">
                  <span className="text-ink-3 block text-xs">Địa chỉ trụ sở đăng ký:</span>
                  <span className="text-ink flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-ink-3 shrink-0 mt-0.5" />
                    {selectedCustomer.businessProfile.businessAddress}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-line">
                  <div>
                    <span className="text-ink-3 block text-xs">Email nhận hóa đơn VAT:</span>
                    <span className="text-ink flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-ink-3" />
                      {selectedCustomer.businessProfile.invoiceEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-3 block text-xs">Quy mô tiệm bánh / xưởng:</span>
                    <span className="text-ink mt-0.5 block">{selectedCustomer.businessProfile.businessScale}</span>
                  </div>
                </div>
              </div>

              {/* Documents preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-ink">Tài liệu đính kèm kiểm tra:</span>
                <div className="p-2.5 border border-line rounded-md bg-surface flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand" />
                    <div>
                      <p className="font-medium text-ink">Ban_sao_Giay_phep_DKKD.pdf</p>
                      <p className="text-xs text-ink-3">1.8 MB • Tải lên ngày {selectedCustomer.businessProfile.submittedAt}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showToast({ message: 'Mở xem bản scan giấy phép kinh doanh (demo)', type: 'info' })}
                    className="h-7 text-xs px-2.5"
                  >
                    Xem tài liệu
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReviewOpen(false)}
                  className="h-8 text-xs px-3"
                >
                  Đóng
                </Button>

                {selectedCustomer.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectWholesale(selectedCustomer.id)}
                      className="h-8 text-xs px-3 border-danger/40 text-danger hover:bg-danger-soft gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Từ chối
                    </Button>
                    <Button
                      onClick={() => handleApproveWholesale(selectedCustomer.id)}
                      className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Phê duyệt khách sỉ
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
