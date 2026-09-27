import { Pattern } from '@/lib/types/domain';
import EvidenceBadge from './EvidenceBadge';

interface PatternCardProps {
  pattern: Pattern;
  showAffectedDeals?: boolean;
}

export default function PatternCard({ pattern, showAffectedDeals = false }: PatternCardProps) {
  return (
    <div className="card border-piloteer-hair-2 hover:border-piloteer-hair-2 transition-colors">
      <div className="flex items-start justify-between mb-6 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <EvidenceBadge level={pattern.evidence.level} />
            <span className="eyebrow">
              {pattern.type.replace('-', ' × ')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-piloteer-ink leading-tight">{pattern.pattern}</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="eyebrow mb-3">Why it matters</div>
          <p className="ctx leading-relaxed">{pattern.meaning}</p>
        </div>

        {pattern.evidence.details && pattern.evidence.details.length > 0 && (
          <div>
            <div className="eyebrow mb-3">
              Evidence ({pattern.evidence.interactions} interactions)
            </div>
            <ul className="space-y-2">
              {pattern.evidence.details.map((detail, idx) => (
                <li key={idx} className="ctx leading-relaxed flex items-start gap-3">
                  <span className="text-piloteer-verified mt-1">·</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-6 border-t border-piloteer-hair">
          <div className="eyebrow mb-3">Recommended action</div>
          <p className="text-lg font-semibold text-piloteer-ink leading-relaxed">{pattern.recommendedAction}</p>
        </div>

        {showAffectedDeals && pattern.affectedDeals && (
          <div className="pt-4 text-sm ctx font-mono border-t border-piloteer-hair">
            Affecting {pattern.affectedDeals} deals
            {pattern.affectedValue && ` · $${(pattern.affectedValue / 1000).toFixed(0)}K`}
          </div>
        )}
      </div>
    </div>
  );
}
