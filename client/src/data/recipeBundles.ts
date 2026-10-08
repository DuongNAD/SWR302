import { RecipeBundle } from '../types';

export const RECIPE_BUNDLES: RecipeBundle[] = [
  {
    id: 'bundle-tiramisu',
    name: 'Bánh Tiramisu Truyền Thống Nước Ý',
    slug: 'tiramisu-y',
    difficulty: 'Dễ',
    prepTime: '30 phút (Không cần lò nướng)',
    servings: '6-8 phần ăn (Khuôn vuông 18cm)',
    description: 'Món tráng miệng nổi tiếng nhất thế giới với từng lớp bánh sâm-panh đẫm cà phê hòa quyện cùng kem Mascarpone béo ngậy và lớp bột cacao nguyên chất đắng thơm.',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    itemIds: ['prod-03', 'prod-02', 'prod-07', 'prod-09'],
    instructions: [
      'Đánh bông lòng đỏ trứng với đường trên âu nước ấm cách thủy đến khi hỗn hợp chuyển màu vàng nhạt sánh mịn.',
      'Cho phô mai Mascarpone vào tán nhuyễn mịn, sau đó nhẹ nhàng fold đều vào hỗn hợp lòng đỏ.',
      'Đánh bông 200ml Whipping Cream với vani đến chóp mềm rồi trộn nhẹ nhàng cùng hỗn hợp Mascarpone.',
      'Nhúng nhanh từng chiếc bánh quy Savoiardi vào cà phê nguội (khoảng 1 giây mỗi mặt), xếp thành 1 lớp kín đáy khuôn.',
      'Phết 1/2 lượng kem lên bánh, lặp lại thêm 1 lớp bánh và 1 lớp kem còn lại. Cho vào ngăn mát tủ lạnh tối thiểu 6-8 tiếng.',
      'Trước khi thưởng thức, rây 1 lớp bột Cacao nguyên chất Puratos phủ kín bề mặt bánh.'
    ]
  },
  {
    id: 'bundle-sourdough',
    name: 'Bánh Mì Men Tự Nhiên Sourdough Thảo Mộc',
    slug: 'sourdough-artisan',
    difficulty: 'Nâng cao',
    prepTime: '24 giờ (Lên men lạnh)',
    servings: '1 ổ tròn lớn 800g',
    description: 'Bánh mì artisan vỏ giòn rụm màu hổ phách, ruột bánh tổ ong dai mềm, vị chua thanh tự nhiên từ quá trình lên men vi sinh có lợi cho hệ đường ruột.',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    itemIds: ['prod-04', 'prod-05', 'prod-12', 'prod-13'],
    instructions: [
      'Trộn bột mì số 13 với nước lọc ấm theo tỷ lệ 75% nước, để bột nghỉ tự phân hủy (autolyse) trong 45 phút.',
      'Thêm men nở và 10g muối biển mịn vào nhồi sơ, thực hiện kỹ thuật kéo gấp bột (stretch and fold) 4 lần cách nhau 30 phút.',
      'Ủ bột khối ở nhiệt độ phòng đến khi tăng 50% thể tích.',
      'Tạo hình bánh tròn căng mặt bột, áo một lớp bột gạo mỏng vào rổ mây Banneton rồi đặt khối bột vào.',
      'Bọc kín cho vào ngăn mát tủ lạnh ủ chậm 12-16 tiếng qua đêm để tạo hương thơm.',
      'Làm nóng lò nướng và nồi gang ở 240°C. Úp bánh ra giấy nướng, dùng dao rạch hoa văn sâu 0.5cm.',
      'Nướng đậy nắp 20 phút ở 230°C, sau đó mở nắp nướng thêm 20 phút ở 200°C cho vỏ bánh giòn nâu vàng.'
    ]
  },
  {
    id: 'bundle-cookies',
    name: 'Bánh Quy Bơ Đan Mạch Danish Butter Cookies',
    slug: 'cookies-bo-dan-mach',
    difficulty: 'Dễ',
    prepTime: '45 phút (Nướng 15 phút)',
    servings: '30-35 chiếc bánh hoa tuyết',
    description: 'Từng miếng bánh quy giòn tan tan biến trong miệng với hương thơm nồng nàn của bơ lạt động vật Anchor hảo hạng và vani tự nhiên.',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    itemIds: ['prod-01', 'prod-04', 'prod-09', 'prod-12'],
    instructions: [
      'Để bơ lạt Anchor mềm ở nhiệt độ phòng (ấn tay thấy lõm nhưng bơ không bị chảy dầu).',
      'Dùng máy đánh trứng đánh nhuyễn bơ với đường xay và một nhúm muối nhỏ đến khi bơ chuyển màu trắng ngà bông nhẹ.',
      'Cho lòng trắng trứng và tinh chất vani vào đánh quyện đều.',
      'Rây bột mì vào âu bơ, dùng spatula dẹt trộn đều theo một chiều cho đến khi không còn thấy bột khô.',
      'Cho bột vào túi bắt kem có gắn đui sao mở 1M hoặc 2D. Bóp thành hình hoa tròn hoặc chữ S lên khay nướng lót giấy nến.',
      'Cho khay bánh vào tủ lạnh 15 phút để định hình vân hoa không bị chảy xệ khi nướng.',
      'Nướng ở 175°C trong 13-15 phút đến khi rìa bánh ngả màu vàng nâu cánh gián thơm phức.'
    ]
  }
];
