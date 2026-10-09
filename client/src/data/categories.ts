import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-dairy',
    name: 'Bơ sữa & Phô mai tươi',
    slug: 'bo-sua-pho-mai',
    iconName: 'Milk',
    description: 'Bảo quản xe lạnh 2-8°C, cam kết hạn sử dụng mới nhất từ Anchor, Tatua, Elle & Vire',
    productCount: 14,
    imageUrl: './img/categories/cat-dairy.webp'
  },
  {
    id: 'cat-flour',
    name: 'Bột mì & Men nở',
    slug: 'bot-men-lam-banh',
    iconName: 'Wheat',
    description: 'Đầy đủ bột số 8, số 11, số 13, bột nguyên cám, men ngọt Mauripan, men lạt Saf-Instant',
    productCount: 22,
    imageUrl: './img/categories/cat-flour.webp'
  },
  {
    id: 'cat-chocolate',
    name: 'Socola, Cacao & Matcha',
    slug: 'socola-cacao-matcha',
    iconName: 'Cookie',
    description: 'Socola Bỉ Callebaut couverture, cacao Puratos xuất khẩu, bột matcha Uji Nhật Bản',
    productCount: 18,
    imageUrl: './img/categories/cat-chocolate.webp'
  },
  {
    id: 'cat-flavor',
    name: 'Hương liệu & Mứt nhân bánh',
    slug: 'huong-lieu-mut-nhan',
    iconName: 'Cherry',
    description: 'Mứt trái cây Andros Chunky, vanilla Nielsen-Massey, màu thực phẩm AmeriColor',
    productCount: 16,
    imageUrl: './img/categories/cat-flavor.webp'
  },
  {
    id: 'cat-tools',
    name: 'Dụng cụ & Khuôn khay làm bánh',
    slug: 'dung-cu-khuon-khay',
    iconName: 'UtensilsCrossed',
    description: 'Khuôn bánh chống dính Chefmade, spatula silicon đúc, bộ đui kem inox 304',
    productCount: 35,
    imageUrl: './img/categories/cat-tools.webp'
  },
  {
    id: 'cat-machinery',
    name: 'Thiết bị & Máy móc chuyên dụng',
    slug: 'thiet-bi-may-moc',
    iconName: 'Cpu',
    description: 'Máy đánh trứng để bàn Bear, lò nướng bánh đối lưu, cân tiểu ly điện tử 0.1g',
    productCount: 11,
    imageUrl: './img/categories/cat-machinery.webp'
  },
  {
    id: 'cat-packaging',
    name: 'Hộp bánh & Bao bì trang trí',
    slug: 'hop-banh-bao-bi',
    iconName: 'Package',
    description: 'Hộp bánh kem mica trong suốt cao cấp, túi kraft giấy xi măng đựng bánh mì, ruy băng',
    productCount: 20,
    imageUrl: './img/categories/cat-packaging.webp'
  },
  {
    id: 'cat-combo',
    name: 'Combo Nguyên Liệu Theo Món',
    slug: 'combo-cong-thuc',
    iconName: 'Layers',
    description: 'Gói trọn đủ nguyên liệu theo công thức bánh Tiramisu, Sourdough, Su kem chuẩn tỷ lệ',
    productCount: 6,
    imageUrl: './img/categories/cat-combo.webp'
  }
];
