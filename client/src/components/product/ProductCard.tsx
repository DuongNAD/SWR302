import React from 'react';
import { ShoppingBag, Eye, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { StorageBadge, StockBadge, BestSellerBadge, WholesaleBadge } from '../common/Badge';
import { StarRating } from '../common/StarRating';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { addItem } = useCart();

  const maxWholesaleDiscount = product.wholesaleTiers && product.wholesaleTiers.length > 1
    ? Math.max(...product.wholesaleTiers.map((t) => t.discountPercent))
    : 0;

  const lowestWholesalePrice = product.wholesaleTiers && product.wholesaleTiers.length > 1
    ? Math.min(...product.wholesaleTiers.map((t) => t.price))
    : null;

  return (
    <article 
      onClick={() => onOpenModal(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#EFE4D6] shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full bg-[#FFFBF5] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && <BestSellerBadge />}
          <StorageBadge condition={product.storageCondition} />
        </div>

        {/* Wholesale indicator pill */}
        {maxWholesaleDiscount > 0 && (
          <div className="absolute top-3 right-3">
            <WholesaleBadge discountMax={Math.round(maxWholesaleDiscount)} />
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(product);
            }}
            className="px-4 py-2 bg-white/95 text-[#2B1D14] hover:bg-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#92400E]" />
            <span>Xem thông số & giá sỉ</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4.5">
        {/* Brand & Origin metadata */}
        <div className="flex items-center justify-between text-xs text-[#6B5B4E] mb-1.5">
          <span className="font-semibold text-[#92400E] uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="text-[#9E8E81]">{product.origin}</span>
        </div>

        {/* Product Title */}
        <h3 
          className="text-sm font-bold text-[#2B1D14] group-hover:text-[#92400E] transition-colors line-clamp-2 min-h-10 leading-snug mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <StockBadge inStock={product.inStock} stockQty={product.stockQty} lowStockThreshold={product.lowStockThreshold} />
        </div>

        {/* Expiry & Cold Chain Micro-banner */}
        <div className="flex items-center gap-1.5 text-2xs text-[#6B5B4E] bg-[#FFFBF5] px-2.5 py-1 rounded-md mb-3 border border-[#EFE4D6]/70">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">HSD: <strong>{product.expiryDate}</strong> • {product.unit}</span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-auto pt-3 border-t border-[#EFE4D6]/60 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-[#92400E]">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#9E8E81] line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {lowestWholesalePrice && (
              <span className="block text-2xs text-amber-700 font-medium">
                Giá sỉ từ: <strong>{lowestWholesalePrice.toLocaleString('vi-VN')}₫</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              addItem(product, 1);
            }}
            aria-label={`Thêm ${product.name} vào giỏ`}
            className="p-2.5 bg-[#92400E] hover:bg-[#78350F] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
