export type StorageCondition = 'ambient' | 'chilled' | 'frozen';

export interface WholesaleTier {
  minQty: number;
  price: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  origin: string; // e.g. New Zealand, Bỉ, Pháp, Việt Nam
  unit: string; // e.g. Gói 500g, Thỏi 250g, Hộp 1L, Bao 25kg
  weightKg: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQty: number;
  lowStockThreshold: number;
  storageCondition: StorageCondition; // ambient = phòng, chilled = mát 2-8°C, frozen = đông -18°C
  expiryDate: string; // ISO format or string: "15/12/2026"
  batchNumber: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  ingredients: string;
  usageGuide: string;
  storageInstructions: string;
  wholesaleTiers: WholesaleTier[];
  suggestedRecipes?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  productCount: number;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPrice: number; // Tier-adjusted price
}

export interface RecipeBundle {
  id: string;
  name: string;
  slug: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao';
  prepTime: string;
  servings: string;
  description: string;
  imageUrl: string;
  itemIds: string[]; // List of product IDs
  instructions: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
  storageCondition: StorageCondition;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packing' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'vnpay' | 'momo' | 'cod' | 'banking';
export type ShippingMethod = 'standard' | 'chilled_express';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  coldPackagingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid';
  shippingMethod: ShippingMethod;
  notes?: string;
  estimatedDelivery: string;
  requiresColdChain: boolean;
  vatInvoiceRequested: boolean;
  taxCode?: string;
  companyName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'wholesale_client' | 'staff' | 'admin';
  businessName?: string;
  addresses: {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
  }[];
}

export interface SWRRequirement {
  id: string;
  name: string;
  type: 'FR' | 'NFR' | 'BR';
  priority: 'Must' | 'Should' | 'Could';
  description: string;
  verifiedInClient: string;
  status: 'passed' | 'demo_ready';
}
