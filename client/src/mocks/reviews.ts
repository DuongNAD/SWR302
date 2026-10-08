export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  date: string
  isVerified: boolean
  content: string
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    author: 'Trần Thu Thảo (Bếp Nhà Bơ)',
    rating: 5,
    date: '02/10/2026',
    isVerified: true,
    content: 'Bơ lạt Anchor giao bằng xe lạnh nên đến nơi vẫn mát rượi, không hề bị chảy hay biến dạng. Dùng làm croissant và bánh quy bơ thơm phức, nở lớp rất đẹp.',
  },
  {
    id: 'rev-02',
    productId: 'prod-01',
    author: 'Lê Hoàng Nam (Tiệm bánh Le Petit)',
    rating: 5,
    date: '28/09/2026',
    isVerified: true,
    content: 'Mình mua theo thùng 20 gói để được giá sỉ 72.000₫. HSD còn xa đến cuối năm, đóng gói bọt xốp cách nhiệt chu đáo. Rất yên tâm nhập nguyên liệu ở Gia Hòa Phát.',
  },
  {
    id: 'rev-03',
    productId: 'prod-01',
    author: 'Nguyễn Thị Bích Ngọc',
    rating: 4,
    date: '15/09/2026',
    isVerified: true,
    content: 'Chất lượng bơ chuẩn New Zealand, thơm ngậy. Đợt này shipper giao hơi trễ 15 phút do kẹt xe nhưng nhiệt độ thùng lạnh vẫn đảm bảo 4°C.',
  },
  {
    id: 'rev-04',
    productId: 'prod-02',
    author: 'Phạm Minh Tuấn',
    rating: 5,
    date: '01/10/2026',
    isVerified: true,
    content: 'Whipping Tatua đánh bông cực nhanh và đứng form, làm bánh kem mousse giữ form cả ngày không chảy tách nước.',
  },
  {
    id: 'rev-05',
    productId: 'prod-03',
    author: 'Đỗ Hải Yến',
    rating: 5,
    date: '25/09/2026',
    isVerified: true,
    content: 'Mascarpone Tatua làm Tiramisu số một luôn, mịn màng béo dịu không bị chua gắt. Date mới tinh.',
  },
  {
    id: 'rev-06',
    productId: 'prod-04',
    author: 'Vũ Đình Trọng',
    rating: 5,
    date: '30/09/2026',
    isVerified: true,
    content: 'Bột mì hoa ngọc lan chuẩn hàng công ty, hút nước tốt, làm bánh mì mềm xốp và giữ ẩm rất tốt.',
  },
  {
    id: 'rev-07',
    productId: 'prod-10',
    author: 'Lê Thị Thu Trang',
    rating: 5,
    date: '20/09/2026',
    isVerified: true,
    content: 'Máy đánh trứng Bear 5L chạy êm ru, âu inox dày dặn, đánh 8 lòng trắng trứng bông cứng chỉ mất 4 phút. Có phiếu bảo hành chính hãng 12 tháng.',
  },
  {
    id: 'rev-08',
    productId: 'prod-11',
    author: 'Nguyễn Văn Quang',
    rating: 5,
    date: '18/09/2026',
    isVerified: true,
    content: 'Lò nướng Unox nhiệt cực kỳ đều giữa 4 khay, nướng bánh choux và macaron không lo xẹp. Đội ngũ kỹ thuật hỗ trợ lắp đặt tận nơi rất nhiệt tình.',
  },
]

export const getReviewsByProductId = (productId: string): Review[] => {
  const specific = MOCK_REVIEWS.filter((r) => r.productId === productId)
  if (specific.length > 0) return specific

  // Fallback reviews with the product context
  return [
    {
      id: `rev-default-1-${productId}`,
      productId,
      author: 'Nguyễn Thanh Hằng',
      rating: 5,
      date: '03/10/2026',
      isVerified: true,
      content: 'Sản phẩm đóng gói cẩn thận, đúng quy cách nhà sản xuất. Date mới và chất lượng nguyên liệu đạt chuẩn.',
    },
    {
      id: `rev-default-2-${productId}`,
      productId,
      author: 'Trần Văn Mạnh',
      rating: 4,
      date: '25/09/2026',
      isVerified: true,
      content: 'Giao hàng nhanh, hóa đơn VAT đầy đủ theo thông tin doanh nghiệp đăng ký. Sẽ tiếp tục ủng hộ tiệm.',
    },
    {
      id: `rev-default-3-${productId}`,
      productId,
      author: 'Hoàng Kim Oanh',
      rating: 5,
      date: '12/09/2026',
      isVerified: true,
      content: 'Chất lượng tốt, giá sỉ cạnh tranh hơn các bên khác. Hàng chính hãng có tem phụ tiếng Việt rõ ràng.',
    },
  ]
}
