import { MomentumDirection } from '@/lib/types/domain';

interface MomentumDisplayProps {
  score: number;
  direction: MomentumDirection;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export default function MomentumDisplay({
  score,
  direction,
  size = 'md',
  showLabel = true,
}: MomentumDisplayProps) {
  const directionLabels: Record<MomentumDirection, string> = {
    gaining: 'Gaining',
    holding: 'Holding',
    losing: 'Losing',
  };

  const directionStyles: Record<MomentumDirection, string> = {
    gaining: 'momentum-gaining',
    holding: 'momentum-holding',
    losing: 'momentum-losing',
  };

  const sizeClasses = {
    sm: 'text-base gap-2',
    md: 'text-xl gap-3',
    lg: 'text-3xl gap-4',
    xl: 'text-4xl gap-4',
  };

  return (
    <div className={`flex items-baseline ${sizeClasses[size]}`}>
      {showLabel && (
        <span className={`font-bold ${directionStyles[direction]}`}>
          {directionLabels[direction]}
        </span>
      )}
      <span className="ctx font-mono font-semibold tabular-nums">
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  );
}
