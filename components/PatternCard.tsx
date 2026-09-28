'use client';

import { useState } from 'react';
import { Pattern } from '@/lib/types/domain';
import EvidenceBadge from './EvidenceBadge';

interface PatternCardProps {
  pattern: Pattern;
  showAffectedDeals?: boolean;
  onUse?: (pattern: Pattern) => void;
}

export default function PatternCard({ pattern, showAffectedDeals = false, onUse }: PatternCardProps) {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <EvidenceBadge level={pattern.evidence.level} />
        <span className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">{pattern.type.replace('-', ' × ')}</span>
      </div>
      <h3 className="mt-4 text-2xl font-bold leading-tight tracking-editorial">{pattern.pattern}</h3>
      <p className="mt-3 max-w-3xl text-piloteer-metal leading-relaxed">{pattern.meaning}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
          {open ? 'Hide evidence' : `Evidence · ${pattern.evidence.interactions}`}
        </button>
        <button
          type="button"
          onClick={() => {
            setUsed(true);
            onUse?.(pattern);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${used ? 'bg-piloteer-verified text-black' : 'bg-white text-black'}`}
        >
          {used ? 'Added to next focus' : 'Use this'}
        </button>
        {showAffectedDeals && pattern.affectedDeals ? (
          <span className="text-sm text-piloteer-mute">Seen on {pattern.affectedDeals} deals</span>
        ) : null}
      </div>
      {open && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-sm font-semibold">{pattern.recommendedAction}</p>
          <ul className="mt-3 space-y-2">
            {(pattern.evidence.details || ['Still gathering the interaction quotes.']).map((detail) => (
              <li key={detail} className="text-sm text-piloteer-metal">· {detail}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
