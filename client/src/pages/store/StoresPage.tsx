import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { STORE_BRANCHES } from '@/mocks/stores'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  Snowflake,
  Wrench,
} from 'lucide-react'

export const StoresPage: React.FC = () => {
  useDocumentTitle('Hệ thống cửa hàng & Kho phân phối | Gia Hòa Phát Bakery Supply')

  const [cityFilter, setCityFilter] = useState<string>('all')

  const filteredStores = useMemo(() => {
    if (cityFilter === 'all') return STORE_BRANCHES
    return STORE_BRANCHES.filter((s) => s.city === cityFilter)
  }, [cityFilter])

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hệ thống cửa hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-ink-3">SCR-22 · HỆ THỐNG CỬA HÀNG</span>
          <h1 className="text-2xl font-bold text-ink">
            Hệ thống cửa hàng & Kho phân phối
          </h1>
          <p className="text-xs text-ink-2 max-w-2xl leading-relaxed">
            Hệ thống 4 trung tâm phân phối và cửa hàng trải nghiệm nguyên liệu làm bánh tại Hà Nội và TP. Hồ Chí Minh với kho lạnh đạt chuẩn 2–8°C.
          </p>
        </div>

        {/* City Filter Tabs */}
        <Tabs value={cityFilter} onValueChange={setCityFilter}>
          <TabsList className="bg-surface border border-line">
            <TabsTrigger value="all">Tất cả ({STORE_BRANCHES.length})</TabsTrigger>
            <TabsTrigger value="Hà Nội">Hà Nội (2)</TabsTrigger>
            <TabsTrigger value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (2)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Store Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStores.map((branch) => (
          <div
            key={branch.id}
            className="border border-line rounded-lg bg-surface p-6 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-brand" />
                  {branch.city}
                </span>
                <Badge variant="outline" className="text-xs text-ok border-ok/40">
                  Mở cửa đón khách
                </Badge>
              </div>

              <h2 className="text-base font-bold text-ink leading-snug">
                {branch.name}
              </h2>

              <div className="space-y-2 text-xs text-ink-2 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{branch.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  <a href={`tel:${branch.phone}`} className="font-semibold text-ink hover:underline">
                    {branch.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <span>{branch.openHours}</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="pt-2 border-t border-line/60 flex flex-wrap gap-2 text-xs text-ink-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-page border border-line">
                  <CheckCircle2 className="w-3 h-3 text-ok" />
                  Nhận hàng tại quầy (Free)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-page border border-line">
                  <Snowflake className="w-3 h-3 text-info" />
                  Kho lạnh 2–8°C tại chỗ
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-page border border-line">
                  <Wrench className="w-3 h-3 text-brand" />
                  Kỹ thuật máy & thử lò
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                <a href={`tel:${branch.phone}`}>
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  Gọi cửa hàng
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                  Chỉ đường
                </a>
              </Button>

              <Button size="sm" asChild className="flex-1 text-xs">
                <Link to="/san-pham">
                  Đặt hàng
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
