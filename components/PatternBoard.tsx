'use client';

import { useState } from 'react';
import { Pattern } from '@/lib/types/domain';
import EvidenceBadge from './EvidenceBadge';

export default function PatternBoard({
  patterns,
  onUse,
}: {
  patterns: Pattern[];
  onUse?: (pattern: Pattern) => void;
}) {
  const [id, setId] = useState(patterns[0]?.id);
  const [showEvidence, setShowEvidence] = useState(false);
  const [used, setUsed] = useState<string | null>(null);
  const current = patterns.find((pattern) => pattern.id === id) || patterns[0];
  if (!current) return null;

  return (
    <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            onClick={() => { setId(pattern.id); setShowEvidence(false); }}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-left lg:shrink ${pattern.id === current.id ? 'border-piloteer-ink bg-piloteer-surface' : 'border-piloteer-hair bg-piloteer-surface/40'}`}
          >
            <span className="block text-sm font-semibold leading-snug">{shorten(pattern.pattern)}</span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-piloteer-mute">{pattern.impact}</span>
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-piloteer-hair bg-piloteer-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <EvidenceBadge level={current.evidence.level} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">{current.evidence.interactions} interactions</span>
        </div>
        <h3 className="mt-4 text-2xl font-bold leading-tight">{current.pattern}</h3>
        <p className="mt-3 text-sm leading-relaxed text-piloteer-metal">{current.meaning}</p>
        <p className="mt-4 text-sm font-semibold">{current.recommendedAction}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowEvidence((value) => !value)} className="btn-secondary">
            {showEvidence ? 'Hide evidence' : 'Show evidence'}
          </button>
          {onUse && (
            <button
              type="button"
              onClick={() => { setUsed(current.id); onUse(current); }}
              className={used === current.id ? 'btn-primary' : 'btn-secondary'}
            >
              {used === current.id ? 'Set as next focus' : 'Use this'}
            </button>
          )}
        </div>
        {showEvidence && (
          <ul className="mt-5 space-y-2 border-t border-piloteer-hair pt-4">
            {(current.evidence.details || []).map((detail) => (
              <li key={detail} className="text-sm text-piloteer-metal">· {detail}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function shorten(text: string) {
  return text.length > 72 ? `${text.slice(0, 70)}…` : text;
}
