import React from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import { HotnessLevel } from '@/types/mimenu';
import { getHotnessLabel } from '@/data/mimenuData';

interface HotnessIndicatorProps {
  score: HotnessLevel;
  velocity24h?: number;
  showThermometer?: boolean;
  compact?: boolean;
}

export const HotnessIndicator: React.FC<HotnessIndicatorProps> = ({
  score,
  velocity24h,
  showThermometer = true,
  compact = false,
}) => {
  const { label, badge, color, flameCount } = getHotnessLabel(score);

  if (compact) {
    if (score <= 1) return null;
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
        <Flame className={`w-3.5 h-3.5 ${score >= 4 ? 'animate-bounce text-red-500 fill-red-500' : 'text-amber-500 fill-amber-500'}`} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${color}`}>
          <div className="flex items-center">
            {Array.from({ length: Math.max(1, flameCount) }).map((_, i) => (
              <Flame
                key={i}
                className={`w-3.5 h-3.5 ${
                  score === 5
                    ? 'text-red-500 fill-red-500 animate-pulse'
                    : score === 4
                    ? 'text-orange-500 fill-orange-500'
                    : 'text-amber-500 fill-amber-500'
                } ${i > 0 ? '-ml-1' : ''}`}
              />
            ))}
          </div>
          <span>{label}</span>
        </div>

        {velocity24h !== undefined && velocity24h > 10 && (
          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>+{velocity24h} pedidos hoy</span>
          </span>
        )}
      </div>

      {showThermometer && (
        <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score === 5
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600'
                : score === 4
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : score === 3
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-blue-400'
            }`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
