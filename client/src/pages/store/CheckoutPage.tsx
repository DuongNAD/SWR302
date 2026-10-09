import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { STORE_BRANCHES } from '@/mocks/stores'
import { Order, OrderItem, PaymentMethod, ShippingMethod } from '@/types'
import { Stepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Price, formatPrice } from '@/components/ui/price'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Truck,
  Snowflake,
  QrCode,
  ShieldCheck,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Store,
} from 'lucide-react'

export const CheckoutPage: React.FC = () => {
  useDocumentTitle('Thanh toán đơn hàng | Gia Hòa Phát Bakery Supply')

  const navigate = useNavigate()
  const {
    items,
    subtotal,
    requiresColdChain,
    coldPackagingFee,
    isColdPackagingFree,
    appliedVoucher,
    clearCart,
  } = useCart()
  const { currentUser, role } = useAuth()
  const { showToast } = useToast()

  // Guard: Empty cart redirects to cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/gio-hang', { replace: true })
    }
  }, [items.length, navigate])

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [_direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Delivery & Customer Info
  const [deliveryType, setDeliveryType] = useState<'ship' | 'pickup'>('ship')
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser?.addresses[0]?.id || 'custom'
  )
  const [selectedStoreId, setSelectedStoreId] = useState<string>(STORE_BRANCHES[0].id)

  const [fullName, setFullName] = useState(currentUser?.name || 'Trần Mai Anh')
  const [phone, setPhone] = useState(currentUser?.phone || '0912 345 678')
  const [email, setEmail] = useState(currentUser?.email || 'maianh.baker@gmail.com')
  const [address, setAddress] = useState(
    currentUser?.addresses[0]?.address || 'Số 42 Ngõ 178 Tây Sơn, Đống Đa, Hà Nội'
  )
  const [city, setCity] = useState('Hà Nội')
  const [notes, setNotes] = useState('Giao vào giờ hành chính, gọi trước 15 phút')

  // VAT Invoice
  const [vatRequested, setVatRequested] = useState(role === 'wholesale_client')
  const [taxCode, setTaxCode] = useState(role === 'wholesale_client' ? '0108892345' : '')
  const [companyName, setCompanyName] = useState(
    role === 'wholesale_client' ? 'Công ty TNHH Bánh Ngọt Tiệm Vàng' : ''
  )
  const [companyAddress, setCompanyAddress] = useState(
    role === 'wholesale_client' ? 'Tầng 2, 88 Hoàng Cầu, Đống Đa, Hà Nội' : ''
  )
  const [vatEmail, setVatEmail] = useState(currentUser?.email || 'ketoan.tiemvang@gmail.com')

  // Step 2: Shipping Method
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(
    requiresColdChain ? 'chilled_express' : 'standard'
  )

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay')

  // Calculations
  const shippingFee = deliveryType === 'pickup' ? 0 : shippingMethod === 'chilled_express' ? 45000 : 25000
  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0
  const finalTotal = Math.max(0, subtotal + shippingFee + coldPackagingFee - discountAmount)

  // Address selection synchronization
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId)
    const found = currentUser?.addresses.find((a) => a.id === addrId)
    if (found) {
      setAddress(found.address)
    }
  }

  // Navigation between steps
  const goToStep = (targetStep: 1 | 2 | 3) => {
    setDirection(targetStep > step ? 'next' : 'prev')
    setStep(targetStep)
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deliveryType === 'ship' && (!fullName.trim() || !phone.trim() || !address.trim())) {
      showToast({
        type: 'error',
        message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.',
      })
      return
    }
    goToStep(2)
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    goToStep(3)
  }

  const handlePlaceOrder = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      const orderNumber = 'GHP-' + Math.floor(100000 + Math.random() * 900000)

      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        sku: i.product.sku,
        unit: i.product.unit,
        price: i.selectedPrice,
        quantity: i.quantity,
        total: i.selectedPrice * i.quantity,
        storageCondition: i.product.storageCondition,
      }))

      const finalAddress =
        deliveryType === 'ship'
          ? address
          : `Nhận tại cửa hàng: ${STORE_BRANCHES.find((s) => s.id === selectedStoreId)?.name || 'Cửa hàng GHP'}`

      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber,
        createdAt: new Date().toLocaleString('vi-VN'),
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: finalAddress,
        shippingCity: city,
        items: orderItems,
        subtotal,
        shippingFee,
        coldPackagingFee,
        discountAmount,
        totalAmount: finalTotal,
        status: 'confirmed',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        shippingMethod,
        notes,
        estimatedDelivery:
          shippingMethod === 'chilled_express' ? 'Hôm nay (2–4 giờ xe lạnh)' : 'Ngày mai (24–48 giờ)',
        requiresColdChain,
        vatInvoiceRequested: vatRequested,
        taxCode: vatRequested ? taxCode : undefined,
        companyName: vatRequested ? companyName : undefined,
      }

      clearCart()
      navigate(`/dat-hang/thanh-cong/${orderNumber}`, { state: { order: newOrder } })
    }, 1200)
  }

  const stepsList = [
    { id: 1, title: 'Thông tin nhận hàng' },
    { id: 2, title: 'Phương thức vận chuyển' },
    { id: 3, title: 'Thanh toán và xác nhận' },
  ]

  const animationClass = ''

  return (
    <div className="wrap py-4 md:py-6 space-y-8">
      <h1 className="sr-only">Thanh toán</h1>
      {/* 1. Stepper Header */}
      <div className="border border-line rounded-lg bg-surface p-4">
        <Stepper
          steps={stepsList}
          currentStep={step}
          onStepClick={(target) => goToStep(target as 1 | 2 | 3)}
        />
      </div>

      {/* 2. Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-step Form Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: DELIVERY & RECEIVER INFO */}
          {step === 1 ? (
            <div className={`space-y-6 ${animationClass}`}>
              <div className="border border-line rounded-lg bg-surface p-6 space-y-5">
                <div className="border-b border-line pb-3">
                  <h2 className="text-lg font-bold text-ink">
                    1. Thông tin giao nhận hàng
                  </h2>
                  <p className="text-xs text-ink-3">
                    Chọn hình thức nhận hàng và cung cấp địa chỉ nhận nguyên liệu làm bánh
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-5">
                  {/* Delivery Mode (Ship or Pickup) */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-ink">Hình thức nhận hàng</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('ship')}
                        className={`p-3 rounded-md border text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                          deliveryType === 'ship'
                            ? 'border-brand bg-brand-soft/50 text-brand'
                            : 'border-line bg-page text-ink hover:border-line-strong'
                        }`}
                      >
                        <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold">Giao hàng tận nơi</p>
                          <p className="text-xs text-ink-3">Giao tới địa chỉ tiệm / nhà bạn</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-3 rounded-md border text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                          deliveryType === 'pickup'
                            ? 'border-brand bg-brand-soft/50 text-brand'
                            : 'border-line bg-page text-ink hover:border-line-strong'
                        }`}
                      >
                        <Store className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold">Nhận tại cửa hàng</p>
                          <p className="text-xs text-ink-3">Lấy tại kho Hà Nội hoặc TP.HCM</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {deliveryType === 'ship' ? (
                    <>
                      {/* Saved addresses (if logged in) */}
                      {currentUser?.addresses && currentUser.addresses.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-line/60">
                          <Label className="text-xs font-semibold text-ink">
                            Chọn từ sổ địa chỉ đã lưu
                          </Label>
                          <div className="space-y-2">
                            {currentUser.addresses.map((addr) => (
                              <label
                                key={addr.id}
                                className={`flex items-start gap-3 p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                                  selectedAddressId === addr.id
                                    ? 'border-brand bg-brand-soft/30 font-medium'
                                    : 'border-line hover:bg-page'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="saved-address"
                                  checked={selectedAddressId === addr.id}
                                  onChange={() => handleSelectSavedAddress(addr.id)}
                                  className="mt-0.5 text-brand focus:ring-brand"
                                />
                                <div>
                                  <span className="font-semibold text-ink block">{addr.label}</span>
                                  <span className="text-ink-2">{addr.address}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Receiver inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="chk-fullname">Họ và tên người nhận *</Label>
                          <Input
                            id="chk-fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="chk-phone">Số điện thoại liên hệ *</Label>
                          <Input
                            id="chk-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0912 345 678"
                            required
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="chk-email">Email nhận xác nhận đơn hàng</Label>
                          <Input
                            id="chk-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tiembanh@gmail.com"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="chk-address">Địa chỉ nhận hàng chi tiết *</Label>
                          <Input
                            id="chk-address"
                            value={address}
                            onChange={(e) => {
                              setSelectedAddressId('custom')
                              setAddress(e.target.value)
                            }}
                            placeholder="Số nhà, ngõ ngách, tên đường, phường/xã..."
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="chk-city">Tỉnh / Thành phố</Label>
                          <Select value={city} onValueChange={setCity}>
                            <SelectTrigger id="chk-city" className="w-full h-10 text-xs">
                              <SelectValue placeholder="Chọn Tỉnh / Thành phố" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                              <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                              <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="chk-notes">Ghi chú giao hàng</Label>
                          <Input
                            id="chk-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Giờ giao, gửi bảo vệ, gọi trước..."
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Pickup store selection */
                    <div className="space-y-3 pt-2">
                      <Label className="text-xs font-semibold text-ink">
                        Chọn chi nhánh Gia Hòa Phát để nhận hàng
                      </Label>
                      <div className="space-y-2">
                        {STORE_BRANCHES.map((store) => (
                          <label
                            key={store.id}
                            className={`flex items-start gap-3 p-3.5 rounded-md border text-xs cursor-pointer transition-colors ${
                              selectedStoreId === store.id
                                ? 'border-brand bg-brand-soft/30 font-medium'
                                : 'border-line hover:bg-page'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickup-store"
                              checked={selectedStoreId === store.id}
                              onChange={() => setSelectedStoreId(store.id)}
                              className="mt-0.5 text-brand focus:ring-brand"
                            />
                            <div className="space-y-0.5">
                              <p className="font-semibold text-ink">{store.name}</p>
                              <p className="text-ink-2">{store.address}</p>
                              <p className="text-xs text-ink-3">
                                Giờ mở cửa: {store.openHours} · Hotline: {store.phone}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VAT Invoice Checkbox & Collapsible Fields */}
                  <div className="pt-4 border-t border-line space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <Checkbox
                        checked={vatRequested}
                        onCheckedChange={(checked) => setVatRequested(Boolean(checked))}
                      />
                      <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-brand" />
                        Yêu cầu xuất hóa đơn điện tử (VAT) cho doanh nghiệp / tiệm bánh
                      </span>
                    </label>

                    {vatRequested && (
                      <div className="p-4 rounded-md border border-line bg-page space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <Label htmlFor="vat-tax">Mã số thuế (MST) *</Label>
                            <Input
                              id="vat-tax"
                              value={taxCode}
                              onChange={(e) => setTaxCode(e.target.value)}
                              placeholder="Ví dụ: 0108892345"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="vat-comp">Tên công ty / Doanh nghiệp *</Label>
                            <Input
                              id="vat-comp"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="Công ty TNHH Bánh Ngọt..."
                              required
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label htmlFor="vat-addr">Địa chỉ đăng ký kinh doanh *</Label>
                            <Input
                              id="vat-addr"
                              value={companyAddress}
                              onChange={(e) => setCompanyAddress(e.target.value)}
                              placeholder="Địa chỉ theo giấy phép ĐKKD"
                              required
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label htmlFor="vat-email">Email nhận hóa đơn điện tử *</Label>
                            <Input
                              id="vat-email"
                              type="email"
                              value={vatEmail}
                              onChange={(e) => setVatEmail(e.target.value)}
                              placeholder="ketoan@doanhnghiep.vn"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" size="lg" className="w-full sm:w-auto px-6">
                      Tiếp tục sang vận chuyển
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Collapsed Summary of Step 1 */
            <div className="border border-line rounded-lg bg-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ok shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-ink block">
                    1. Người nhận: {fullName} · {phone}
                  </span>
                  <span className="text-ink-2 truncate block max-w-md">
                    {deliveryType === 'ship'
                      ? address
                      : `Nhận tại cửa hàng: ${STORE_BRANCHES.find((s) => s.id === selectedStoreId)?.name}`}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep(1)}
                className="text-xs text-brand hover:bg-brand-soft h-8"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Sửa
              </Button>
            </div>
          )}

          {/* STEP 2: SHIPPING METHOD */}
          {step === 2 ? (
            <div className={`space-y-6 ${animationClass}`}>
              <div className="border border-line rounded-lg bg-surface p-6 space-y-5">
                <div className="border-b border-line pb-3">
                  <h2 className="text-lg font-bold text-ink">
                    2. Phương thức vận chuyển
                  </h2>
                  <p className="text-xs text-ink-3">
                    Chọn loại hình giao hàng phù hợp với tính chất nguyên liệu của đơn hàng
                  </p>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-4">
                  {requiresColdChain && (
                    <div className="border-l-2 border-info bg-info-soft p-3.5 rounded-r-md text-xs text-ink flex items-start gap-2.5">
                      <Snowflake className="w-4 h-4 text-info shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-info block">
                          Đơn hàng có sản phẩm chuỗi lạnh (bơ, sữa tươi, phô mai)
                        </span>
                        <p className="text-ink-2 leading-relaxed">
                          Gia Hòa Phát khuyên bạn chọn hình thức <strong>Giao xe lạnh chuyên dụng (2–4 giờ)</strong> kèm thùng xốp đá gel để đảm bảo sản phẩm không biến tính hay chua hỏng.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Option 1: Standard */}
                    <label
                      className={`flex items-start justify-between p-4 rounded-md border text-xs cursor-pointer transition-colors ${
                        shippingMethod === 'standard'
                          ? 'border-brand bg-brand-soft/30'
                          : 'border-line hover:bg-page'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping-method"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="mt-0.5 text-brand focus:ring-brand"
                        />
                        <div className="space-y-1">
                          <span className="font-semibold text-ink text-sm block">
                            Giao hàng tiêu chuẩn
                          </span>
                          <span className="text-ink-2 block">
                            Thời gian giao: 24–48 giờ (phù hợp với bột mì, phụ gia, bao bì)
                          </span>
                          {requiresColdChain && (
                            <span className="text-xs text-warn block">
                              * Lưu ý: Không khuyến khích cho bơ kem tươi đi xa
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Price price={25000} size="sm" className="font-bold text-ink" />
                        <span className="text-xs text-ink-3 block">Miễn phí từ 500k</span>
                      </div>
                    </label>

                    {/* Option 2: Chilled express */}
                    <label
                      className={`flex items-start justify-between p-4 rounded-md border text-xs cursor-pointer transition-colors ${
                        shippingMethod === 'chilled_express'
                          ? 'border-brand bg-brand-soft/30'
                          : 'border-line hover:bg-page'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping-method"
                          checked={shippingMethod === 'chilled_express'}
                          onChange={() => setShippingMethod('chilled_express')}
                          className="mt-0.5 text-brand focus:ring-brand"
                        />
                        <div className="space-y-1">
                          <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                            <Snowflake className="w-4 h-4 text-info" />
                            Giao xe lạnh chuyên dụng
                          </span>
                          <span className="text-ink-2 block">
                            Thời gian giao: 2–4 giờ nội thành · Thùng xốp cách nhiệt đá gel 2–8°C
                          </span>
                          <span className="text-xs text-info font-medium block">
                            Duy trì nhiệt độ 2–8°C trong suốt quá trình vận chuyển
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Price price={45000} size="sm" className="font-bold text-brand" />
                        <span className="text-xs text-info block font-medium">Khuyên dùng</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => goToStep(1)}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      Quay lại bước 1
                    </Button>

                    <Button type="submit" size="lg" className="px-6">
                      Tiếp tục sang thanh toán
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : step === 3 ? (
            /* Collapsed Summary of Step 2 */
            <div className="border border-line rounded-lg bg-surface p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-ok shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-ink block">
                    2. Vận chuyển:{' '}
                    {shippingMethod === 'chilled_express'
                      ? 'Giao xe lạnh chuyên dụng (45.000₫)'
                      : 'Giao hàng tiêu chuẩn (25.000₫)'}
                  </span>
                  <span className="text-ink-3">
                    Dự kiến:{' '}
                    {shippingMethod === 'chilled_express' ? 'Hôm nay trong 2–4 giờ' : 'Ngày mai'}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep(2)}
                className="text-xs text-brand hover:bg-brand-soft h-8"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                Sửa
              </Button>
            </div>
          ) : null}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className={`space-y-6 ${animationClass}`}>
              <div className="border border-line rounded-lg bg-surface p-6 space-y-5">
                <div className="border-b border-line pb-3">
                  <h2 className="text-lg font-bold text-ink">
                    3. Phương thức thanh toán
                  </h2>
                  <p className="text-xs text-ink-3">
                    Chọn cổng thanh toán điện tử VNPay QR, ví điện tử MoMo, ngân hàng hoặc tiền mặt COD
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Option 1: VNPay QR */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      paymentMethod === 'vnpay'
                        ? 'border-brand bg-brand-soft/30 font-medium'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="mt-0.5 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-ink text-sm block">
                        VNPay (Quét mã QR từ ứng dụng ngân hàng)
                      </span>
                      <span className="text-ink-2 text-xs block">
                        Hỗ trợ hơn 40 ngân hàng (Vietcombank, Techcombank, MB, BIDV...)
                      </span>
                    </div>
                  </label>

                  {/* Option 2: MoMo */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      paymentMethod === 'momo'
                        ? 'border-brand bg-brand-soft/30 font-medium'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="mt-0.5 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-ink text-sm block">
                        Ví điện tử MoMo
                      </span>
                      <span className="text-ink-2 text-xs block">
                        Quét mã thanh toán tức thì qua ví MoMo
                      </span>
                    </div>
                  </label>

                  {/* Option 3: Banking */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      paymentMethod === 'banking'
                        ? 'border-brand bg-brand-soft/30 font-medium'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'banking'}
                      onChange={() => setPaymentMethod('banking')}
                      className="mt-0.5 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-ink text-sm block">
                        Chuyển khoản ngân hàng trực tiếp
                      </span>
                      <span className="text-ink-2 text-xs block">
                        Chuyển tiền vào tài khoản Techcombank của Gia Hòa Phát
                      </span>
                    </div>
                  </label>

                  {/* Option 4: COD */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-brand bg-brand-soft/30 font-medium'
                        : 'border-line hover:bg-page'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-ink text-sm block">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <span className="text-ink-2 text-xs block">
                        Kiểm tra hàng và thanh toán tiền mặt trực tiếp cho shipper
                      </span>
                    </div>
                  </label>
                </div>

                {/* VNPay Static QR Code Block */}
                {paymentMethod === 'vnpay' && (
                  <div className="p-5 border border-line rounded-lg bg-page flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-36 h-36 bg-surface p-2 border border-line rounded-md shrink-0 flex items-center justify-center">
                      <img
                        src="/qr-demo.svg"
                        alt="Mã VNPay QR thanh toán tĩnh"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-2 text-xs text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-brand-soft text-brand font-mono font-semibold text-xs">
                        <QrCode className="w-3.5 h-3.5" />
                        GIAHOAPHAT-VNPAY-DEMO
                      </div>
                      <p className="font-semibold text-ink">
                        Số tiền cần thanh toán:{' '}
                        <span className="text-brand text-sm tabular-nums">
                          {formatPrice(finalTotal)}
                        </span>
                      </p>
                      <p className="text-ink-3 text-xs">
                        Mở app Mobile Banking bất kỳ quét mã QR phía trên để xác thực chuyển tiền.
                      </p>
                      <p className="text-ink-3 text-xs font-mono">
                        Mã hết hạn sau 10:00 (Tĩnh)
                      </p>
                    </div>
                  </div>
                )}

                {/* Banking details if selected */}
                {paymentMethod === 'banking' && (
                  <div className="p-4 rounded-lg border border-line bg-page text-xs space-y-1.5">
                    <p className="font-semibold text-ink">Thông tin chuyển khoản ngân hàng:</p>
                    <p className="text-ink-2">Ngân hàng: <strong>Techcombank - Chi nhánh Ba Đình</strong></p>
                    <p className="text-ink-2 font-mono">Số tài khoản: <strong>1903 8888 6688 99</strong></p>
                    <p className="text-ink-2">Chủ tài khoản: <strong>Công ty Cổ phần Gia Hòa Phát</strong></p>
                    <p className="text-xs text-ink-3">Nội dung CK: Tên bạn + SĐT (Hệ thống duyệt tự động trong 2 phút)</p>
                  </div>
                )}

                {/* Submit action */}
                <div className="pt-4 border-t border-line space-y-3">
                  <Button
                    type="button"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="w-5 h-5 border-white border-t-transparent" />
                        Đang tạo đơn hàng và xác thực...
                      </span>
                    ) : (
                      <span>Hoàn tất đặt hàng ({formatPrice(finalTotal)})</span>
                    )}
                  </Button>

                  <p className="text-center text-xs text-ink-3">
                    Bằng việc bấm Đặt hàng, bạn đồng ý với Điều khoản mua bán và chính sách bảo mật của Gia Hòa Phát.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="border border-line rounded-lg bg-surface p-5 space-y-4 shadow-xs">
            <h3 className="text-base font-semibold text-ink border-b border-line pb-3">
              Tóm tắt đơn hàng ({items.length} món)
            </h3>

            {/* Product items mini list */}
            <div className="divide-y divide-line max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center gap-3 text-xs">
                  <div className="w-10 h-10 rounded-md border border-line bg-page overflow-hidden shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">{item.product.name}</p>
                    <p className="text-xs text-ink-3">
                      SL: {item.quantity} × {formatPrice(item.selectedPrice)}
                    </p>
                  </div>
                  <span className="font-semibold text-ink tabular-nums shrink-0">
                    {formatPrice(item.selectedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-line pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-2">
                <span>Tạm tính:</span>
                <span className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</span>
              </div>

              {requiresColdChain && (
                <div className="flex items-center justify-between text-ink-2">
                  <span className="flex items-center gap-1 text-info">
                    <Snowflake className="w-3.5 h-3.5" />
                    Phí đóng gói xe lạnh:
                  </span>
                  <span className="font-medium text-ink tabular-nums">
                    {isColdPackagingFree ? (
                      <span className="text-ok">Miễn phí (≥ 300k)</span>
                    ) : (
                      formatPrice(coldPackagingFee)
                    )}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-ink-2">
                <span>Phí vận chuyển:</span>
                <span className="font-medium text-ink tabular-nums">
                  {deliveryType === 'pickup' ? (
                    <span className="text-ok">Miễn phí (nhận tại quầy)</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-ok">
                  <span>Giảm giá ({appliedVoucher.code}):</span>
                  <span className="font-medium tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Final Total */}
            <div className="border-t border-line pt-3 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-ink block">Tổng cộng:</span>
                <span className="text-xs text-ink-3">Đã gồm VAT</span>
              </div>
              <Price price={finalTotal} size="lg" className="text-xl font-bold text-brand" />
            </div>

            <div className="border-t border-line/60 pt-3 flex items-center gap-2 text-xs text-ink-3">
              <ShieldCheck className="w-4 h-4 text-ok shrink-0" />
              <span>Giao xe lạnh 2–8°C, hạn dùng ghi trên từng lô hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
