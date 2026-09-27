import { EvidenceLevel } from '@/lib/types/domain';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
}

export default function EvidenceBadge({ level, className = '' }: EvidenceBadgeProps) {
  const labels: Record<EvidenceLevel, string> = {
    validated: 'Validated',
    supported: 'Supported',
    associated: 'Associated',
    observed: 'Observed',
  };

  const styles: Record<EvidenceLevel, string> = {
    validated: 'evidence-validated',
    supported: 'evidence-supported',
    associated: 'evidence-associated',
    observed: 'evidence-observed',
  };

  return (
    <span className={`evidence-label ${styles[level]} ${className}`}>
      {labels[level]}
    </span>
  );
}
