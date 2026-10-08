import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'sm'
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  
  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Đánh giá ${rating} trên 5 sao`}>
      <div className="flex items-center gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-450 text-amber-500'
                : 'fill-stone-200 text-stone-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-800">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-stone-500">({reviewCount})</span>
      )}
    </div>
  );
};
