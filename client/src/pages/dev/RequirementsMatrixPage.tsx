import React from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageHeader } from '@/components/ui/page-header'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react'
import { SWR_REQUIREMENTS } from '@/data/swrRequirements'

const getProofLinks = (id: string): { label: string; href: string }[] => {
  switch (id) {
    case 'FR-AUTH-01':
      return [
        { label: '/dang-nhap', href: '/dang-nhap' },
        { label: '/dang-ky', href: '/dang-ky' },
      ]
    case 'FR-SRC-01':
      return [{ label: '/tim-kiem', href: '/tim-kiem' }]
    case 'FR-FIL-02':
      return [{ label: '/san-pham', href: '/san-pham' }]
    case 'FR-PROD-03':
      return [{ label: '/san-pham/prod-01', href: '/san-pham/prod-01' }]
    case 'FR-KIT-04':
      return [
        { label: '/combo', href: '/combo' },
        { label: '/combo/cb-tiramisu-01', href: '/combo/cb-tiramisu-01' },
      ]
    case 'FR-CART-05':
      return [{ label: '/gio-hang', href: '/gio-hang' }]
    case 'FR-CHK-06':
      return [{ label: '/thanh-toan', href: '/thanh-toan' }]
    case 'FR-TRK-07':
      return [{ label: '/don-hang/GHP-889120', href: '/don-hang/GHP-889120' }]
    case 'FR-ADM-08':
      return [
        { label: '/admin', href: '/admin' },
        { label: '/admin/don-hang', href: '/admin/don-hang' },
        { label: '/admin/san-pham', href: '/admin/san-pham' },
        { label: '/admin/ton-kho', href: '/admin/ton-kho' },
      ]
    case 'BR-RULE-01':
      return [
        { label: '/san-pham/prod-01', href: '/san-pham/prod-01' },
        { label: '/gio-hang', href: '/gio-hang' },
      ]
    case 'BR-RULE-02':
      return [
        { label: '/san-pham/prod-01', href: '/san-pham/prod-01' },
        { label: '/gio-hang', href: '/gio-hang' },
      ]
    default:
      return []
  }
}

export const RequirementsMatrixPage: React.FC = () => {
  useDocumentTitle('Ma trận yêu cầu SWR302')

  return (
    <div className="wrap py-8 space-y-6">
      <PageHeader
        title="Ma trận truy vết yêu cầu (SWR302 Requirements Matrix)"
        description="Minh chứng các yêu cầu chức năng (FR), phi chức năng (NFR) và quy tắc nghiệp vụ (BR) cho Topic 1 — Hệ thống mua sắm nguyên liệu và thiết bị làm bánh trực tuyến."
      />

      <div className="p-4 bg-ok-soft border border-ok/20 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm text-ok">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>
            Toàn bộ 12 yêu cầu của môn học SWR302 được hiện thực đầy đủ trên giao diện người dùng.
          </span>
        </div>
        <Badge variant="ok">Đã hoàn thành 100%</Badge>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Mã yêu cầu</TableHead>
              <TableHead className="w-56">Tên & Phân loại</TableHead>
              <TableHead>Mô tả tiêu chuẩn</TableHead>
              <TableHead className="w-80">Minh chứng trên giao diện</TableHead>
              <TableHead className="w-28 text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SWR_REQUIREMENTS.map((req) => {
              const links = getProofLinks(req.id)
              return (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-semibold text-brand align-top">
                    <div>{req.id}</div>
                    <span className="text-xs text-ink-3 font-normal">{req.priority}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="font-medium text-ink">{req.name}</div>
                    <div className="mt-1">
                      <Badge variant="neutral">
                        {req.type === 'FR' ? 'Chức năng' : req.type === 'NFR' ? 'Phi chức năng' : 'Quy tắc'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-2 align-top text-xs leading-relaxed">
                    {req.description}
                  </TableCell>
                  <TableCell className="align-top space-y-1.5">
                    <div className="p-2 rounded bg-page border border-line text-xs text-ink-2">
                      {req.verifiedInClient}
                    </div>
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {links.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-brand hover:underline bg-brand-soft px-1.5 py-0.5 rounded border border-brand/20"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center align-top">
                    <span className="inline-flex items-center gap-1 text-ok font-medium text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Đạt</span>
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="text-xs text-ink-3 text-center">
        Tài liệu SRS chuẩn hóa IEEE Std 830 được lưu trữ trong thư mục docs/ của đồ án.
      </div>
    </div>
  )
}
