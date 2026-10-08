import React, { useState, useMemo } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import {
  MOCK_STAFF,
  MOCK_PERMISSIONS,
  StaffMember,
  StaffRole,
  PermissionItem,
} from '@/mocks/staff'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { DataTableToolbar } from '@/components/admin/DataTableToolbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  UserCheck,
  UserPlus,
  Shield,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const AdminStaffPage: React.FC = () => {
  useDocumentTitle('Nhân viên & Phân quyền | Quản trị Gia Hòa Phát')
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'staff' | 'matrix'>('staff')
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF)
  const [permissions, setPermissions] = useState<PermissionItem[]>(MOCK_PERMISSIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Modal invite staff
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRole, setNewRole] = useState<StaffRole>('sales')
  const [newStore, setNewStore] = useState('Kho Tổng 180 Cầu Giấy, Hà Nội')

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      if (roleFilter !== 'all' && s.role !== roleFilter) return false
      const q = searchQuery.toLowerCase().trim()
      if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q) && !s.phone.includes(q)) {
        return false
      }
      return true
    })
  }, [staffList, roleFilter, searchQuery])

  // Handle invite staff submit
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim()) {
      showToast({ message: 'Vui lòng điền họ tên và email', type: 'error' })
      return
    }

    const roleTitles: Record<StaffRole, string> = {
      admin: 'Quản trị hệ thống',
      warehouse: 'Quản lý kho lạnh',
      sales: 'Nhân viên bán hàng & CSKH',
      accountant: 'Kế toán viên',
    }

    const created: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '0900 000 000',
      role: newRole,
      roleTitle: roleTitles[newRole],
      storeLocation: newStore,
      status: 'active',
      joinedDate: '08/10/2026',
    }

    setStaffList([created, ...staffList])
    setIsInviteOpen(false)
    showToast({ message: `Đã gửi lời mời kích hoạt tài khoản tới ${created.email}`, type: 'success' })

    // Reset
    setNewName('')
    setNewEmail('')
    setNewPhone('')
  }

  // Toggle permission checkbox in matrix
  const handleTogglePermission = (permId: string, role: StaffRole) => {
    if (role === 'admin') {
      showToast({ message: 'Vai trò Quản trị viên luôn có toàn quyền hệ thống', type: 'info' })
      return
    }

    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === permId) {
          const updated = { ...p, [role]: !p[role] }
          showToast({ message: `Đã cập nhật quyền: ${p.name}`, type: 'success' })
          return updated
        }
        return p
      })
    )
  }

  const staffColumns: ColumnDef<StaffMember>[] = [
    {
      header: 'Họ tên nhân viên',
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-xs text-ink flex items-center gap-1.5">
            {item.name}
            {item.role === 'admin' && (
              <span title="Quản trị viên">
                <Shield className="w-3.5 h-3.5 text-brand" />
              </span>
            )}
          </div>
          <div className="text-xs text-ink-3 flex items-center gap-2">
            <span>{item.email}</span>
            <span>•</span>
            <span className="font-mono tabular-nums">{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Vai trò chuyên môn',
      cell: (item) => {
        const roleBadges: Record<StaffRole, { label: string; cls: string }> = {
          admin: { label: 'Quản trị viên', cls: 'border-brand/40 text-brand bg-brand-soft' },
          warehouse: { label: 'Quản lý kho lạnh', cls: 'border-info/40 text-info bg-info-soft' },
          sales: { label: 'Bán hàng & CSKH', cls: 'border-ok/40 text-ok bg-ok-soft' },
          accountant: { label: 'Kế toán viên', cls: 'border-line text-ink bg-page' },
        }
        const b = roleBadges[item.role]
        return (
          <Badge variant="outline" className={`text-xs font-medium ${b.cls}`}>
            {item.roleTitle}
          </Badge>
        )
      },
    },
    {
      header: 'Cơ sở / Kho phụ trách',
      cell: (item) => (
        <div className="text-xs text-ink-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-ink-3 shrink-0" />
          <span className="truncate max-w-xs">{item.storeLocation}</span>
        </div>
      ),
    },
    {
      header: 'Ngày gia nhập',
      cell: (item) => (
        <span className="text-xs text-ink-3 tabular-nums">{item.joinedDate}</span>
      ),
    },
    {
      header: 'Trạng thái',
      cell: () => (
        <Badge variant="outline" className="border-ok/40 text-ok bg-ok-soft text-xs gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Hoạt động
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      cell: (item) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showToast({ message: `Cấu hình tài khoản ${item.name}`, type: 'info' })}
            className="h-7 text-xs px-2 text-ink-3 hover:text-ink"
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand" />
            Nhân viên & Phân quyền hệ thống
          </h1>
          <p className="text-xs text-ink-2 mt-0.5">
            Quản trị tài khoản nhân viên nội bộ, chi nhánh phân công và ma trận kiểm soát quyền truy cập
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Mời nhân viên mới
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-full"
        >
          <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
            <TabsTrigger
              value="staff"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold"
            >
              Danh sách nhân sự ({staffList.length})
            </TabsTrigger>
            <TabsTrigger
              value="matrix"
              className="data-[state=active]:border-brand data-[state=active]:text-brand border-b-2 border-transparent rounded-none px-1 pb-2.5 pt-1 text-xs font-semibold flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Ma trận phân quyền (Role Matrix)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Staff List */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={(v) => {
              setSearchQuery(v)
              setCurrentPage(1)
            }}
            searchPlaceholder="Tìm theo tên, email, SĐT..."
            filterSlot={
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="h-9 px-2.5 text-xs bg-surface border border-line rounded-md text-ink"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="warehouse">Quản lý kho lạnh</option>
                <option value="sales">Bán hàng & CSKH</option>
                <option value="accountant">Kế toán viên</option>
              </select>
            }
            hasActiveFilters={Boolean(searchQuery || roleFilter !== 'all')}
            onResetFilters={() => {
              setSearchQuery('')
              setRoleFilter('all')
            }}
          />

          <DataTable
            data={filteredStaff}
            columns={staffColumns}
            keyExtractor={(item) => item.id}
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filteredStaff.length / pageSize))}
            onPageChange={setCurrentPage}
            totalCount={filteredStaff.length}
            pageSize={pageSize}
            emptyMessage="Không tìm thấy nhân viên phù hợp"
          />
        </div>
      )}

      {/* Tab 2: Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-3">
          <div className="p-3 bg-brand-soft border border-brand/30 rounded-md text-xs text-ink flex items-start gap-2">
            <Lock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <p>
              Ma trận kiểm soát quyền hạn theo vị trí công việc. Tích chọn để cấp hoặc thu hồi quyền tương ứng.
              Vai trò <strong>Quản trị viên</strong> mặc định nắm toàn quyền hệ thống.
            </p>
          </div>

          <div className="border border-line rounded-lg overflow-x-auto bg-surface shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-page border-b border-line text-ink-2 font-semibold">
                <tr>
                  <th className="py-3 px-3.5 text-left w-2/5">Chức năng & Tác vụ hệ thống</th>
                  <th className="py-3 px-3.5 text-center">Quản trị</th>
                  <th className="py-3 px-3.5 text-center">Quản lý kho</th>
                  <th className="py-3 px-3.5 text-center">Bán hàng & CSKH</th>
                  <th className="py-3 px-3.5 text-center">Kế toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-page/50 h-12">
                    <td className="py-2.5 px-3.5">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-ink flex items-center gap-1.5">
                          <span className="text-xs text-ink-3 font-mono">[{perm.category}]</span>
                          {perm.name}
                        </div>
                        <p className="text-xs text-ink-3">{perm.description}</p>
                      </div>
                    </td>

                    {/* Admin Checkbox (Always checked & disabled) */}
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={true}
                          disabled={true}
                          aria-label={`Quyền ${perm.name} cho Quản trị`}
                        />
                      </div>
                    </td>

                    {/* Warehouse Checkbox */}
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={perm.warehouse}
                          onCheckedChange={() => handleTogglePermission(perm.id, 'warehouse')}
                          aria-label={`Quyền ${perm.name} cho Kho`}
                        />
                      </div>
                    </td>

                    {/* Sales Checkbox */}
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={perm.sales}
                          onCheckedChange={() => handleTogglePermission(perm.id, 'sales')}
                          aria-label={`Quyền ${perm.name} cho Bán hàng`}
                        />
                      </div>
                    </td>

                    {/* Accountant Checkbox */}
                    <td className="py-2.5 px-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={perm.accountant}
                          onCheckedChange={() => handleTogglePermission(perm.id, 'accountant')}
                          aria-label={`Quyền ${perm.name} cho Kế toán`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Invite Staff */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md p-6 bg-surface border border-line rounded-lg">
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-ink flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand" />
                Mời nhân viên tham gia quản trị
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-3">
                Nhập thông tin nhân sự và chỉ định vai trò phân quyền
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-semibold text-ink">Họ và tên *</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Trần Văn Bình"
                  required
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-ink">Email công vụ *</Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="binh.tv@giahoaphat.vn"
                  required
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-ink">Số điện thoại</Label>
                <Input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="mt-1 h-8 text-xs tabular-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-ink">Vai trò phân quyền</Label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as StaffRole)}
                    className="mt-1 w-full h-8 px-2 text-xs bg-surface border border-line rounded-md text-ink"
                  >
                    <option value="sales">Bán hàng & CSKH</option>
                    <option value="warehouse">Quản lý kho lạnh</option>
                    <option value="accountant">Kế toán viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-ink">Cơ sở làm việc</Label>
                  <select
                    value={newStore}
                    onChange={(e) => setNewStore(e.target.value)}
                    className="mt-1 w-full h-8 px-2 text-xs bg-surface border border-line rounded-md text-ink"
                  >
                    <option value="Kho Tổng 180 Cầu Giấy, Hà Nội">Kho Cầu Giấy, HN</option>
                    <option value="Kho trung chuyển Q.5, TP.HCM">Kho Q.5, TP.HCM</option>
                    <option value="Showroom 45 Nguyễn Trãi, Q.5, TP.HCM">Showroom TP.HCM</option>
                    <option value="Tất cả chi nhánh">Tất cả chi nhánh</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                className="h-8 text-xs px-3"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs px-3 bg-brand text-brand-contrast hover:bg-brand-hover"
              >
                Gửi lời mời kích hoạt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
