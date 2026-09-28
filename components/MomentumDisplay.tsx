import { bandMeta, signed } from '@/lib/momentum';
import { MomentumBar } from './MomentumVisuals';
import { MomentumDirection } from '@/lib/types/domain';

interface MomentumDisplayProps {
  score: number;
  direction: MomentumDirection;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export default function MomentumDisplay({
  score,
  size = 'md',
  showLabel = true,
}: MomentumDisplayProps) {
  const band = bandMeta(score);
  const tone = score > 10 ? 'text-piloteer-verified' : score < -10 ? 'text-piloteer-signal' : 'text-piloteer-metal';

  const sizeClasses = {
    sm: 'text-base gap-2',
    md: 'text-xl gap-3',
    lg: 'text-3xl gap-4',
    xl: 'text-4xl gap-4',
  };

  return (
    <div className="min-w-[140px]">
      <div className={`flex items-baseline ${sizeClasses[size]}`}>
        {showLabel && <span className={`font-bold ${tone}`}>{band.label}</span>}
        <span className="ctx font-mono font-semibold tabular-nums">{signed(score)}</span>
      </div>
      <div className="mt-2"><MomentumBar value={score} /></div>
    </div>
  );
}
