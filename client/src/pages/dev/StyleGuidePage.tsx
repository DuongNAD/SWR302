import React, { useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Price } from '@/components/ui/price'
import { Rating } from '@/components/ui/rating'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { Stepper } from '@/components/ui/stepper'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Package, Heart } from 'lucide-react'

export const StyleGuidePage: React.FC = () => {
  useDocumentTitle('Bộ thành phần giao diện')

  const [qty, setQty] = useState(2)
  const [sliderVal, setSliderVal] = useState([50])
  const [otpVal, setOtpVal] = useState('889966')
  const [switchVal, setSwitchVal] = useState(true)

  return (
    <div className="wrap py-8 space-y-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bộ thành phần giao diện</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Bộ thành phần giao diện (Design System Style Guide)"
        description="Mọi thành phần giao diện tuân thủ quy tắc 01_design_rules.md, chuẩn token và phẳng không AI."
      />

      {/* 1. Tokens Màu */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          1. Bảng màu Token (Design Tokens)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-brand" />
            <div className="text-xs font-semibold text-ink">--color-brand</div>
            <div className="text-xs text-ink-3">#92400E</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-brand-soft border border-line" />
            <div className="text-xs font-semibold text-ink">--color-brand-soft</div>
            <div className="text-xs text-ink-3">#FBF3EA</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-page border border-line" />
            <div className="text-xs font-semibold text-ink">--color-page</div>
            <div className="text-xs text-ink-3">#FAFAF9</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-surface border border-line" />
            <div className="text-xs font-semibold text-ink">--color-surface</div>
            <div className="text-xs text-ink-3">#FFFFFF</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-line" />
            <div className="text-xs font-semibold text-ink">--color-line</div>
            <div className="text-xs text-ink-3">#E7E5E4</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-field" />
            <div className="text-xs font-semibold text-ink">--color-field</div>
            <div className="text-xs text-ink-3">#8A847E</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-ok text-white flex items-center justify-center text-xs font-semibold">OK</div>
            <div className="text-xs font-semibold text-ink">--color-ok</div>
            <div className="text-xs text-ink-3">#15803D</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-warn text-white flex items-center justify-center text-xs font-semibold">Warn</div>
            <div className="text-xs font-semibold text-ink">--color-warn</div>
            <div className="text-xs text-ink-3">#B45309</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-bad text-white flex items-center justify-center text-xs font-semibold">Bad</div>
            <div className="text-xs font-semibold text-ink">--color-bad</div>
            <div className="text-xs text-ink-3">#B91C1C</div>
          </div>
          <div className="p-3 rounded-lg border border-line bg-surface space-y-2">
            <div className="h-10 rounded bg-info text-white flex items-center justify-center text-xs font-semibold">Info</div>
            <div className="text-xs font-semibold text-ink">--color-info</div>
            <div className="text-xs text-ink-3">#0369A1</div>
          </div>
        </div>
      </section>

      {/* 2. Typography */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          2. Thang chữ (Typography)
        </h2>
        <div className="space-y-3 bg-surface p-6 rounded-lg border border-line">
          <div>
            <span className="text-xs text-ink-3 block mb-1">h1 Banner (36px/600)</span>
            <span className="text-3xl sm:text-4xl font-semibold text-ink">Nguyên liệu và thiết bị làm bánh chính hãng</span>
          </div>
          <div>
            <span className="text-xs text-ink-3 block mb-1">h1 Trang ứng dụng (24px/600)</span>
            <h1 className="text-2xl font-semibold text-ink">Danh sách sản phẩm</h1>
          </div>
          <div>
            <span className="text-xs text-ink-3 block mb-1">h2 Khối trang (20px/600)</span>
            <h2 className="text-xl font-semibold text-ink">Sản phẩm bán chạy</h2>
          </div>
          <div>
            <span className="text-xs text-ink-3 block mb-1">h3 Tiêu đề thẻ (16px/600)</span>
            <h3 className="text-base font-semibold text-ink">Bơ lạt tự nhiên Anchor 227g</h3>
          </div>
          <div>
            <span className="text-xs text-ink-3 block mb-1">Chữ mặc định (14px/400)</span>
            <p className="text-sm text-ink">Thương hiệu bơ chất lượng cao nhập khẩu New Zealand.</p>
          </div>
          <div>
            <span className="text-xs text-ink-3 block mb-1">Chú thích phụ (12px/400 ink-2)</span>
            <p className="text-xs text-ink-2">Hạn sử dụng: 28/11/2026 · Bảo quản 2–8°C</p>
          </div>
        </div>
      </section>

      {/* 3. Nút bấm (Button) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          3. Nút bấm (Button) & Trạng thái
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Nút chính (Primary)</Button>
          <Button variant="outline">Nút phụ (Outline)</Button>
          <Button variant="secondary">Nút phụ 2 (Secondary)</Button>
          <Button variant="ghost">Nút chữ (Ghost)</Button>
          <Button variant="link">Nút liên kết (Link)</Button>
          <Button variant="destructive">Nút cảnh báo (Destructive)</Button>
          <Button disabled>Bị vô hiệu (Disabled)</Button>
          <Button>
            <Spinner size="sm" />
            <span>Đang xử lý</span>
          </Button>
          <Button size="sm">Cỡ nhỏ</Button>
          <Button size="lg">Cỡ lớn (Thanh toán)</Button>
          <Button size="icon" aria-label="Yêu thích">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* 4. Ô nhập liệu (Form controls) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          4. Biểu mẫu & Ô nhập (Input, Textarea, Select, Checkbox, Radio, Switch)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-surface p-6 rounded-lg border border-line">
          <div className="space-y-2">
            <Label htmlFor="demo-name" requiredIndicator>
              Họ và tên
            </Label>
            <Input id="demo-name" placeholder="Nguyễn Văn A" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-err" requiredIndicator>
              Ô có lỗi hiển thị
            </Label>
            <Input id="demo-err" error defaultValue="Sai định dạng" />
            <p className="text-xs text-bad">Vui lòng nhập đúng số điện thoại 10 chữ số.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-disabled">Ô bị khóa (Disabled)</Label>
            <Input id="demo-disabled" disabled value="Không được chỉnh sửa" />
          </div>

          <div className="space-y-2">
            <Label>Chọn danh mục</Label>
            <Select defaultValue="bo-sua">
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bo-sua">Bơ, Sữa & Phô mai</SelectItem>
                <SelectItem value="bot-men">Bột & Men nở</SelectItem>
                <SelectItem value="socola">Socola & Cacao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mã OTP 6 số</Label>
            <InputOTP maxLength={6} value={otpVal} onChange={setOtpVal}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <Label>Thanh trượt giá: {sliderVal[0]}%</Label>
            <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} />
          </div>

          <div className="space-y-3">
            <Label>Checkbox & Radio</Label>
            <div className="flex items-center gap-2">
              <Checkbox id="c1" defaultChecked />
              <label htmlFor="c1" className="text-sm text-ink cursor-pointer">
                Xuất hóa đơn điện tử VAT
              </label>
            </div>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="standard" id="r1" />
                <label htmlFor="r1" className="text-sm text-ink cursor-pointer">
                  Giao tiêu chuẩn (25.000₫)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cold" id="r2" />
                <label htmlFor="r2" className="text-sm text-ink cursor-pointer">
                  Giao xe lạnh (45.000₫)
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Công tắc (Switch)</Label>
            <div className="flex items-center gap-3">
              <Switch id="s1" checked={switchVal} onCheckedChange={setSwitchVal} />
              <label htmlFor="s1" className="text-sm text-ink cursor-pointer">
                Nhận thông báo đơn qua SMS
              </label>
            </div>
          </div>

          <div className="space-y-2 col-span-full">
            <Label htmlFor="demo-note">Ghi chú giao hàng</Label>
            <Textarea id="demo-note" placeholder="Nhập ghi chú cho tài xế..." />
          </div>
        </div>
      </section>

      {/* 5. Badges & Tags */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          5. Nhãn trạng thái (Badges)
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Thương hiệu</Badge>
          <Badge variant="ok">Đã giao hàng</Badge>
          <Badge variant="warn">Sắp hết hàng</Badge>
          <Badge variant="bad">Hết hàng</Badge>
          <Badge variant="info">Giao lạnh 2–8°C</Badge>
          <Badge variant="neutral">Kho Cầu Giấy</Badge>
          <Badge variant="outline">Mã: GHP-889120</Badge>
        </div>
      </section>

      {/* 6. Tabs, Breadcrumb, Stepper */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          6. Điều hướng & Bước (Tabs, Breadcrumb, Stepper, Pagination)
        </h2>
        <div className="bg-surface p-6 rounded-lg border border-line space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#/san-pham">Nguyên liệu</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bơ lạt Anchor 227g</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Stepper
            steps={['Thông tin nhận hàng', 'Vận chuyển', 'Thanh toán']}
            currentStep={2}
          />

          <Tabs defaultValue="desc">
            <div className="overflow-x-auto max-w-full">
              <TabsList className="min-w-max">
                <TabsTrigger value="desc">Mô tả sản phẩm</TabsTrigger>
                <TabsTrigger value="specs">Thông số kỹ thuật</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá (12)</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="desc">
              <p className="text-sm text-ink-2">Bơ lạt nhập khẩu từ New Zealand, chất lượng tiêu chuẩn quốc tế.</p>
            </TabsContent>
            <TabsContent value="specs">
              <p className="text-sm text-ink-2">Khối lượng: 227g · Độ béo: 82.9% · Bảo quản mát 2–8°C.</p>
            </TabsContent>
            <TabsContent value="reviews">
              <p className="text-sm text-ink-2">Đánh giá 4.9/5 từ các chủ tiệm bánh.</p>
            </TabsContent>
          </Tabs>

          <div className="overflow-x-auto max-w-full">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>

      {/* 7. Thành phần riêng */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          7. Thành phần nghiệp vụ riêng (Price, Rating, QuantityStepper, Modals)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-6 rounded-lg border border-line">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-ink-3 block mb-1">Price (Định dạng VND, giảm giá, giá sỉ)</span>
              <Price price={78000} originalPrice={92000} wholesalePrice={66000} size="lg" />
            </div>

            <div>
              <span className="text-xs text-ink-3 block mb-1">Rating</span>
              <Rating rating={4.9} reviewCount={342} />
            </div>

            <div>
              <span className="text-xs text-ink-3 block mb-1">QuantityStepper (Gõ số & tăng giảm)</span>
              <QuantityStepper value={qty} onChange={setQty} min={1} max={100} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-ink-3 block mb-1">Hộp thoại (Dialog & Sheet)</span>
              <div className="flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Mở Dialog xác nhận</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Xác nhận đơn hàng</DialogTitle>
                      <DialogDescription>
                        Đơn hàng sẽ được chuyển vào quy trình đóng gói và bàn giao xe lạnh.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Hủy</Button>
                      <Button>Đồng ý</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary">Mở Sheet bên phải</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Giỏ hàng nhanh</SheetTitle>
                      <SheetDescription>Tóm tắt các món trong giỏ hàng của bạn.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p className="text-sm text-ink-2">Nội dung giỏ hàng...</p>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Bảng dữ liệu (Table) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          8. Bảng dữ liệu chuẩn (48px Row, chữ chuẩn)
        </h2>
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Vận chuyển</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono font-medium">GHP-889120</TableCell>
                <TableCell>Trần Mai Anh</TableCell>
                <TableCell>
                  <Badge variant="info">Xe lạnh 2–8°C</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">485.000₫</TableCell>
                <TableCell>
                  <Badge variant="ok">Đang giao</Badge>
                </TableCell>
              </TableRow>
              <TableRow isSelected>
                <TableCell className="font-mono font-medium">GHP-889121</TableCell>
                <TableCell>Lê Hoàng Tuấn (Sỉ)</TableCell>
                <TableCell>
                  <Badge variant="info">Xe lạnh 2–8°C</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">3.450.000₫</TableCell>
                <TableCell>
                  <Badge variant="warn">Chờ đóng gói</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* 9. Empty State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink border-b border-line pb-2">
          9. Trạng thái rỗng (Empty State)
        </h2>
        <Card>
          <EmptyState
            icon={Package}
            title="Không tìm thấy sản phẩm"
            description="Hãy thử bỏ chọn các bộ lọc hoặc tìm kiếm bằng từ khóa nguyên liệu khác."
            action={{
              label: 'Xóa bộ lọc',
              onClick: () => {},
            }}
          />
        </Card>
      </section>
    </div>
  )
}
