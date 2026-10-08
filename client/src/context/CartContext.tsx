import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface AppliedVoucher {
  code: string;
  description: string;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Computed metrics
  totalItemCount: number;
  subtotal: number;
  totalWeightKg: number;
  requiresColdChain: boolean;
  coldPackagingFee: number;
  isColdPackagingFree: boolean;
  freeShippingProgress: number; // 0 - 100%
  amountNeededForFreeShip: number;
  
  // Voucher
  appliedVoucher: AppliedVoucher | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIP_THRESHOLD = 500000;
const FREE_COLD_PACK_THRESHOLD = 300000;
const COLD_PACK_FEE = 15000;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([
    // Initial sample items for realistic demo
    {
      product: {
        id: 'prod-01',
        name: 'Bơ Lạt Tự Nhiên Anchor Unsalted Butter 227g',
        sku: 'GHP-BUTTER-ANC227',
        categoryId: 'cat-dairy',
        categoryName: 'Bơ sữa & Phô mai tươi',
        brand: 'Anchor',
        origin: 'New Zealand',
        unit: 'Thỏi 227g',
        weightKg: 0.227,
        price: 78000,
        inStock: true,
        stockQty: 180,
        lowStockThreshold: 30,
        storageCondition: 'chilled',
        expiryDate: '28/11/2026',
        batchNumber: 'LOT-NZ2026-88B',
        rating: 4.9,
        reviewCount: 342,
        imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
        description: 'Bơ động vật nguyên chất từ đồng cỏ tự nhiên New Zealand.',
        ingredients: '100% Kem sữa tươi thanh trùng từ bò ăn cỏ tự nhiên.',
        usageGuide: 'Thích hợp làm bánh mì hoa cúc, cookies.',
        storageInstructions: 'Bắt buộc bảo quản ngăn mát tủ lạnh ở 2°C - 4°C.',
        wholesaleTiers: [
          { minQty: 1, price: 78000, discountPercent: 0 },
          { minQty: 10, price: 72000, discountPercent: 7.7 },
          { minQty: 40, price: 66000, discountPercent: 15.4 }
        ]
      },
      quantity: 2,
      selectedPrice: 78000
    },
    {
      product: {
        id: 'prod-03',
        name: 'Phô Mai Kem Mascarpone Tatua New Zealand 500g',
        sku: 'GHP-CHEE-MASC500',
        categoryId: 'cat-dairy',
        categoryName: 'Bơ sữa & Phô mai tươi',
        brand: 'Tatua',
        origin: 'New Zealand',
        unit: 'Hộp 500g',
        weightKg: 0.52,
        price: 115000,
        inStock: true,
        stockQty: 48,
        lowStockThreshold: 15,
        storageCondition: 'chilled',
        expiryDate: '05/11/2026',
        batchNumber: 'LOT-MASC26-9',
        rating: 4.95,
        reviewCount: 164,
        imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
        description: 'Linh hồn của món bánh Tiramisu trứ danh nước Ý.',
        ingredients: 'Kem sữa thanh trùng, acid citric.',
        usageGuide: 'Trộn với lòng đỏ trứng và kem tươi.',
        storageInstructions: 'Bảo quản tối ưu 2°C - 4°C.',
        wholesaleTiers: [
          { minQty: 1, price: 115000, discountPercent: 0 },
          { minQty: 8, price: 107000, discountPercent: 7.0 },
          { minQty: 24, price: 99000, discountPercent: 13.9 }
        ]
      },
      quantity: 1,
      selectedPrice: 115000
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const { showToast } = useToast();

  // Helper to calculate tier price based on current quantity
  const calculateTierPrice = (product: Product, qty: number): number => {
    if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
      return product.price;
    }
    // Find the highest tier where qty >= minQty
    const applicableTiers = [...product.wholesaleTiers]
      .filter((t) => qty >= t.minQty)
      .sort((a, b) => b.minQty - a.minQty);
    
    return applicableTiers.length > 0 ? applicableTiers[0].price : product.price;
  };

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newPrice = calculateTierPrice(product, newQty);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, selectedPrice: newPrice }
            : item
        );
      } else {
        const newPrice = calculateTierPrice(product, quantity);
        return [...prev, { product, quantity, selectedPrice: newPrice }];
      }
    });

    showToast({
      type: 'success',
      message: `Đã thêm "${product.name}" vào giỏ hàng!`,
      actionText: 'Xem giỏ',
      onAction: () => setIsCartOpen(true)
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newPrice = calculateTierPrice(item.product, quantity);
          return { ...item, quantity, selectedPrice: newPrice };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    const itemToRemove = items.find((i) => i.product.id === productId);
    if (!itemToRemove) return;

    setItems((prev) => prev.filter((item) => item.product.id !== productId));

    // Jakob Nielsen Heuristic #3: User Freedom & Undo
    showToast({
      type: 'info',
      message: `Đã bỏ "${itemToRemove.product.name}" khỏi giỏ.`,
      actionText: 'Hoàn tác',
      onAction: () => {
        setItems((prev) => [...prev, itemToRemove]);
      }
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Computations
  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  }, [items]);

  const totalWeightKg = useMemo(() => {
    return Number(
      items.reduce((sum, item) => sum + (item.product.weightKg || 0.5) * item.quantity, 0).toFixed(2)
    );
  }, [items]);

  const requiresColdChain = useMemo(() => {
    return items.some(
      (item) => item.product.storageCondition === 'chilled' || item.product.storageCondition === 'frozen'
    );
  }, [items]);

  const isColdPackagingFree = subtotal >= FREE_COLD_PACK_THRESHOLD;
  const coldPackagingFee = requiresColdChain ? (isColdPackagingFree ? 0 : COLD_PACK_FEE) : 0;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));
  const amountNeededForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);

  const applyVoucher = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BAKING2026') {
      if (subtotal < 200000) {
        showToast({
          type: 'error',
          message: 'Mã BAKING2026 chỉ áp dụng cho đơn hàng từ 200.000₫ trở lên!'
        });
        return false;
      }
      setAppliedVoucher({
        code: 'BAKING2026',
        description: 'Giảm 30.000₫ cho đơn làm bánh đầu mùa',
        discountAmount: 30000
      });
      showToast({ type: 'success', message: 'Áp dụng mã BAKING2026 giảm 30.000₫ thành công!' });
      return true;
    } else if (clean === 'GHPVIP') {
      const discount = Math.min(100000, Math.round(subtotal * 0.1));
      setAppliedVoucher({
        code: 'GHPVIP',
        description: 'Ưu đãi Khách hàng thân thiết: Giảm 10%',
        discountAmount: discount
      });
      showToast({ type: 'success', message: `Áp dụng mã GHPVIP giảm ${discount.toLocaleString('vi-VN')}₫ thành công!` });
      return true;
    } else if (clean === 'FREESHIP') {
      setAppliedVoucher({
        code: 'FREESHIP',
        description: 'Miễn phí vận chuyển tiêu chuẩn',
        discountAmount: 25000
      });
      showToast({ type: 'success', message: 'Áp dụng mã FREESHIP giảm 25.000₫ tiền vận chuyển!' });
      return true;
    } else {
      showToast({
        type: 'error',
        message: 'Mã voucher không hợp lệ hoặc đã hết lượt. Thử: BAKING2026, GHPVIP hoặc FREESHIP'
      });
      return false;
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast({ type: 'info', message: 'Đã hủy áp dụng mã giảm giá.' });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemCount,
        subtotal,
        totalWeightKg,
        requiresColdChain,
        coldPackagingFee,
        isColdPackagingFree,
        freeShippingProgress,
        amountNeededForFreeShip,
        appliedVoucher,
        applyVoucher,
        removeVoucher
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
