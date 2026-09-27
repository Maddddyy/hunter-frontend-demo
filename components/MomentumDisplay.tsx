import { MomentumDirection } from '@/lib/types/domain';

interface MomentumDisplayProps {
  score: number; // -100 to 100
  direction: MomentumDirection;
  size?: 'sm' | 'md' | 'lg';
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
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-semibold',
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className={`font-medium ${directionStyles[direction]} ${sizeClasses[size]}`}>
          {directionLabels[direction]}
        </span>
      )}
      <span className={`text-piloteer-gray ${sizeClasses[size]}`}>
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  );
}
