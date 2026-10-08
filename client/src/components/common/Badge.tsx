import React from 'react';
import { Snowflake, PackageCheck, AlertTriangle, Flame, Sparkles, Building2 } from 'lucide-react';
import { StorageCondition } from '../../types';

interface StorageBadgeProps {
  condition: StorageCondition;
  className?: string;
}

export const StorageBadge: React.FC<StorageBadgeProps> = ({ condition, className = '' }) => {
  if (condition === 'chilled') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 shadow-xs ${className}`}
        title="Yêu cầu bảo quản mát 2°C - 8°C và vận chuyển bằng xe lạnh hoặc thùng cách nhiệt đá gel"
      >
        <Snowflake className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span>Giao Xe Lạnh 2-8°C</span>
      </span>
    );
  }

  if (condition === 'frozen') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-900 border border-blue-300 shadow-xs ${className}`}
        title="Bắt buộc bảo quản đông lạnh -18°C"
      >
        <Snowflake className="w-3.5 h-3.5 text-blue-700 shrink-0" />
        <span>Đông Lạnh -18°C</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-stone-700 border border-amber-200/60 ${className}`}
    >
      <span>Nhiệt độ phòng</span>
    </span>
  );
};

interface StockBadgeProps {
  inStock: boolean;
  stockQty: number;
  lowStockThreshold?: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  inStock,
  stockQty,
  lowStockThreshold = 20
}) => {
  if (!inStock || stockQty <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        Hết hàng
      </span>
    );
  }

  if (stockQty <= lowStockThreshold) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        Chỉ còn {stockQty} món
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
      <PackageCheck className="w-3 h-3 text-emerald-600" />
      Còn hàng ({stockQty})
    </span>
  );
};

export const BestSellerBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-xs">
    <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
    Bán chạy
  </span>
);

export const NewBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-xs">
    <Sparkles className="w-3 h-3" />
    Mới về
  </span>
);

export const WholesaleBadge: React.FC<{ discountMax: number }> = ({ discountMax }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-300/80">
    <Building2 className="w-3 h-3 text-amber-800" />
    Giá sỉ đến -{discountMax}%
  </span>
);
