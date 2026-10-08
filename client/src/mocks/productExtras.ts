export interface ProductEquipmentExtra {
  warranty: string
  power: string
  dimensions: string
  capacity?: string
  voltage?: string
  weight?: string
}

export const PRODUCT_EXTRAS: Record<string, ProductEquipmentExtra> = {
  'prod-10': {
    warranty: '12 tháng chính hãng (1 đổi 1 trong 30 ngày)',
    power: '1000W - Động cơ đồng nguyên chất',
    dimensions: '380 × 240 × 350 mm',
    capacity: '5.0 Lít (Âu inox 304)',
    voltage: '220V / 50Hz',
    weight: '6.8 kg',
  },
  'prod-11': {
    warranty: '24 tháng tại chỗ - Bảo trì định kỳ 6 tháng/lần',
    power: '3200W (Quạt đối lưu đảo chiều)',
    dimensions: '600 × 710 × 500 mm',
    capacity: '4 khay tiêu chuẩn 460 × 330 mm',
    voltage: '220V / 50Hz - Dây tiếp địa an toàn',
    weight: '38.0 kg',
  },
}

export const getEquipmentExtra = (productId: string): ProductEquipmentExtra | null => {
  return PRODUCT_EXTRAS[productId] || null
}
