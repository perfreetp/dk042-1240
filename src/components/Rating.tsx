import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
}

export function Rating({ value, max = 5, size = 16, showValue = false }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(max)].map((_, index) => {
          const fillPercent = Math.min(Math.max(value - index, 0), 1) * 100;
          return (
            <div key={index} className="relative">
              <Star
                size={size}
                className="text-slate-200"
                strokeWidth={0}
                fill="currentColor"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  size={size}
                  className="text-amber-400"
                  strokeWidth={0}
                  fill="currentColor"
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-slate-600 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
