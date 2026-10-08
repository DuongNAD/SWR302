import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  min = 1,
  max = 999,
  onChange,
  size = 'md'
}) => {
  const isSmall = size === 'sm';
  const buttonPadding = isSmall ? 'p-1' : 'p-2';
  const iconSize = isSmall ? 'w-3 h-3' : 'w-4 h-4';
  const inputWidth = isSmall ? 'w-9 text-xs' : 'w-12 text-sm';

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const clamped = Math.max(min, Math.min(max, val));
      onChange(clamped);
    }
  };

  return (
    <div className="inline-flex items-center border border-[#EFE4D6] rounded-lg bg-white overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Giảm số lượng"
        className={`${buttonPadding} text-[#6B5B4E] hover:bg-[#FEF3E2] hover:text-[#92400E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer`}
      >
        <Minus className={iconSize} />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        aria-label="Số lượng"
        className={`${inputWidth} text-center font-semibold text-[#2B1D14] focus:outline-none focus:bg-[#FFFBF5]`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Tăng số lượng"
        className={`${buttonPadding} text-[#6B5B4E] hover:bg-[#FEF3E2] hover:text-[#92400E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
};
