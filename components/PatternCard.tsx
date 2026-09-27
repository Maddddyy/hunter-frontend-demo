import { Pattern } from '@/lib/types/domain';
import EvidenceBadge from './EvidenceBadge';

interface PatternCardProps {
  pattern: Pattern;
  showAffectedDeals?: boolean;
}

export default function PatternCard({ pattern, showAffectedDeals = false }: PatternCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <EvidenceBadge level={pattern.evidence.level} />
            <span className="text-xs text-piloteer-gray uppercase tracking-wide">
              {pattern.type.replace('-', ' × ')}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{pattern.pattern}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
            Why it matters
          </div>
          <p className="text-sm text-piloteer-gray">{pattern.meaning}</p>
        </div>

        {pattern.evidence.details && pattern.evidence.details.length > 0 && (
          <div>
            <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
              Evidence ({pattern.evidence.interactions} interactions)
            </div>
            <ul className="space-y-1">
              {pattern.evidence.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-piloteer-gray flex items-start gap-2">
                  <span className="text-piloteer-gray/50 mt-0.5">·</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 border-t border-piloteer-surface-hover">
          <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
            Recommended action
          </div>
          <p className="text-sm font-medium">{pattern.recommendedAction}</p>
        </div>

        {showAffectedDeals && pattern.affectedDeals && (
          <div className="pt-2 text-xs text-piloteer-gray">
            Affecting {pattern.affectedDeals} deals
            {pattern.affectedValue && ` · $${(pattern.affectedValue / 1000).toFixed(0)}K`}
          </div>
        )}
      </div>
    </div>
  );
}
