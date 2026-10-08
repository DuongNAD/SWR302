import React from 'react';
import { Filter, RotateCcw, Snowflake, Check, Sun } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { StorageCondition } from '../../types';

interface FilterSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedStorage: StorageCondition | 'all';
  onSelectStorage: (storage: StorageCondition | 'all') => void;
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  availableBrands: string[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStorage,
  onSelectStorage,
  selectedBrands,
  onToggleBrand,
  availableBrands,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onToggleInStockOnly,
  onResetFilters,
  totalFilteredCount
}) => {
  const hasActiveFilters =
    selectedCategory !== null ||
    selectedStorage !== 'all' ||
    selectedBrands.length > 0 ||
    inStockOnly ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000000;

  return (
    <aside className="w-full lg:w-68 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl border border-[#EFE4D6] p-5 shadow-xs space-y-5">
        {/* Header & Reset */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
          <div className="flex items-center gap-2 font-bold text-[#2B1D14]">
            <Filter className="w-4 h-4 text-[#92400E]" />
            <span className="text-sm">Bộ Lọc Tìm Kiếm</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#92400E] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* 1. Storage Condition Filter (Key requirement for Bakery ingredients!) */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E] block">
            Điều Kiện Bảo Quản
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onSelectStorage('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedStorage === 'all'
                  ? 'bg-[#92400E] text-white'
                  : 'bg-stone-50 text-stone-700 hover:bg-[#FEF3E2]'
              }`}
            >
              <span>Tất cả điều kiện</span>
              {selectedStorage === 'all' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectStorage('chilled')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedStorage === 'chilled'
                  ? 'bg-sky-700 text-white'
                  : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Snowflake className="w-3.5 h-3.5" />
                <span>Giao xe lạnh 2-8°C</span>
              </div>
              {selectedStorage === 'chilled' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectStorage('ambient')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedStorage === 'ambient'
                  ? 'bg-[#92400E] text-white'
                  : 'bg-amber-50 text-stone-800 hover:bg-amber-100/70 border border-amber-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Nhiệt độ phòng</span>
              </div>
              {selectedStorage === 'ambient' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Category Filter */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E] block">
            Danh Mục Nguyên Liệu
          </label>
          <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                selectedCategory === null
                  ? 'bg-[#FEF3E2] text-[#92400E] font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>Tất cả sản phẩm</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FEF3E2] text-[#92400E] font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-2xs text-stone-400">({cat.productCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Price Range Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E]">
            <span>Khoảng Giá</span>
            <span className="text-[#92400E] font-bold lowercase">
              ≤ {priceRange[1].toLocaleString('vi-VN')}₫
            </span>
          </div>
          <input
            type="range"
            min="20000"
            max="1000000"
            step="20000"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value, 10)])}
            aria-label="Khoảng giá tối đa"
            className="w-full accent-[#92400E] cursor-pointer"
          />
          <div className="flex items-center justify-between text-2xs text-stone-400 font-mono">
            <span>20.000₫</span>
            <span>1.000.000₫</span>
          </div>
        </div>

        {/* 4. Brands Filter */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B5B4E] block">
            Thương Hiệu ({availableBrands.length})
          </label>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 text-xs text-stone-700 hover:text-[#92400E] cursor-pointer select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand)}
                    className="rounded border-[#EFE4D6] text-[#92400E] focus:ring-[#92400E] cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 5. In-Stock Only Toggle */}
        <div className="pt-2 border-t border-[#EFE4D6]">
          <label className="flex items-center gap-2.5 text-xs font-bold text-stone-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={onToggleInStockOnly}
              className="rounded border-[#EFE4D6] text-[#92400E] focus:ring-[#92400E] cursor-pointer"
            />
            <span>Chỉ hiển thị hàng có sẵn</span>
          </label>
        </div>

        {/* Results count pill */}
        <div className="p-2.5 bg-[#FFFBF5] rounded-xl text-center border border-[#EFE4D6] text-xs text-stone-600">
          Tìm thấy <strong>{totalFilteredCount}</strong> sản phẩm phù hợp
        </div>
      </div>
    </aside>
  );
};
