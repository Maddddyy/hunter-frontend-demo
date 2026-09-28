'use client';

import { BandId, BANDS, bandOf, DRIVERS, signed, StateId } from '@/lib/momentum';
import { DriverId } from '@/lib/types/domain';

export function MomentumBar({ value }: { value: number }) {
  const position = Math.max(0, Math.min(100, (value + 100) / 2));
  const tone = value > 10 ? 'pos' : value < -10 ? 'neg' : 'zero';
  const left = value >= 0 ? 50 : position;
  const width = Math.abs(position - 50);
  const dot = tone === 'pos' ? '#5BC08D' : tone === 'neg' ? '#FF5C5C' : '#B7BABD';
  const fill = tone === 'pos'
    ? 'linear-gradient(90deg, rgba(91,192,141,.45), #5BC08D)'
    : tone === 'neg'
      ? 'linear-gradient(90deg, #FF5C5C, rgba(255,92,92,.45))'
      : '#B7BABD';

  return (
    <div className="relative h-3 rounded-full bg-piloteer-surface-3 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-piloteer-hair-2" />
      <div className="absolute top-0 bottom-0 rounded-full" style={{ left: `${left}%`, width: `${width}%`, background: fill }} />
      <div
        className="absolute top-1/2 h-2.5 w-2.5 rounded-full border-2 border-piloteer-void"
        style={{ left: `${position}%`, background: dot, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}

export function MomentumFigure({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const tone = value > 10 ? 'text-piloteer-verified' : value < -10 ? 'text-piloteer-signal' : 'text-piloteer-metal';
  const text = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-xl';
  return <span className={`font-mono font-semibold tabular-nums ${text} ${tone}`}>{signed(value)}</span>;
}

export function StatePill({ state, label }: { state: StateId; label: string }) {
  const styles = state === 'progress'
    ? 'text-piloteer-verified border-piloteer-verified-line bg-piloteer-verified-soft'
    : state === 'cold'
      ? 'text-piloteer-signal border-piloteer-signal-line bg-piloteer-signal-soft'
      : 'text-piloteer-watch border-piloteer-watch-line bg-piloteer-watch-soft';
  const dot = state === 'progress' ? 'bg-piloteer-verified' : state === 'cold' ? 'bg-piloteer-signal' : 'bg-piloteer-watch';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${styles}`}>
      <i className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function Sparkline({ values, state }: { values: number[]; state: StateId }) {
  const width = 68;
  const height = 26;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stroke = state === 'progress' ? '#5BC08D' : state === 'cold' ? '#FF5C5C' : '#E8A33D';
  const points = values.map((value, index) => {
    const x = pad + (index * (width - pad * 2)) / (values.length - 1 || 1);
    const y = pad + (height - pad * 2) * (1 - (value - min) / span);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = points[points.length - 1]?.split(',') || ['0', '0'];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points.join(' ')} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={stroke} />
    </svg>
  );
}

export function TrendChart({ values, caption }: { values: number[]; caption: string }) {
  const width = 320;
  const height = 96;
  const pad = 10;
  const min = Math.min(...values, 0) - 4;
  const max = Math.max(...values, 0) + 4;
  const span = max - min || 1;
  const xAt = (index: number) => pad + (index * (width - pad * 2)) / (values.length - 1 || 1);
  const yAt = (value: number) => pad + (height - pad * 2) * (1 - (value - min) / span);
  const line = values.map((value, index) => `${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`);
  const area = `M${xAt(0).toFixed(1)},${height - pad} L${line.join(' L')} L${xAt(values.length - 1).toFixed(1)},${height - pad} Z`;
  const last = line[line.length - 1]?.split(',') || ['0', '0'];
  const zero = yAt(0);
  const rising = values[values.length - 1] >= values[0];
  const stroke = rising ? '#5BC08D' : '#FF5C5C';
  const id = `trend-${caption.replace(/\W+/g, '').slice(0, 12)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" role="img" aria-label={caption}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={rising ? 'rgba(91,192,141,.30)' : 'rgba(255,92,92,.28)'} />
          <stop offset="1" stopColor="rgba(91,192,141,0)" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={zero} x2={width - pad} y2={zero} stroke="#32323E" strokeDasharray="3 4" />
      <path d={area} fill={`url(#${id})`} />
      <polyline points={line.join(' ')} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3.2" fill={stroke} stroke="#08080B" strokeWidth="2" />
    </svg>
  );
}

const ZONE_STYLE: Record<BandId, string> = {
  cold: 'bg-piloteer-signal/20 text-[#ff8f8f]',
  slipping: 'bg-piloteer-watch/15 text-piloteer-watch',
  neutral: 'bg-piloteer-metal/10 text-piloteer-metal',
  gaining: 'bg-piloteer-verified/15 text-piloteer-verified',
  strong: 'bg-piloteer-verified/30 text-[#7ed3a6]',
};

export function MomentumScale({
  selected,
  onSelect,
}: {
  selected: BandId | 'all';
  onSelect: (band: BandId | 'all') => void;
}) {
  return (
    <div>
      <div className="relative pt-6">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] tracking-wider text-piloteer-ink">0 · NEUTRAL</div>
        <div className="relative flex h-12 overflow-hidden rounded-xl border border-piloteer-hair">
          {BANDS.map((band) => {
            const active = selected === band.id;
            return (
              <button
                key={band.id}
                type="button"
                onClick={() => onSelect(selected === band.id ? 'all' : band.id)}
                className={`relative z-10 ${ZONE_STYLE[band.id]} ${active ? 'ring-2 ring-inset ring-white' : ''}`}
                style={{ flex: band.flex }}
                aria-pressed={active}
                aria-label={`${band.label}, ${band.range}`}
              />
            );
          })}
          <div className="pointer-events-none absolute bottom-[-6px] left-1/2 top-[-6px] z-0 w-0.5 -translate-x-1/2 bg-piloteer-ink/70" />
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-piloteer-mute">
        <span>−100</span><span>−50</span><span>0</span><span>+50</span><span>+100</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {BANDS.map((band) => (
          <button
            key={`${band.id}-key`}
            type="button"
            onClick={() => onSelect(selected === band.id ? 'all' : band.id)}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${selected === band.id ? 'border-piloteer-ink text-piloteer-ink' : 'border-piloteer-hair text-piloteer-mute'}`}
            aria-pressed={selected === band.id}
          >
            {band.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-piloteer-metal">
        {selected === 'all'
          ? 'Zero means the deal is going nowhere. Further right is closer to a decision. Further left is closer to dead. Click a band to filter.'
          : `${BANDS.find((band) => band.id === selected)?.hint} Click it again to see the whole book.`}
      </p>
    </div>
  );
}

export function DriverStack({
  parts,
  active,
  onPick,
}: {
  parts: { id: DriverId; points: number; reason?: string }[];
  active: DriverId | null;
  onPick: (id: DriverId) => void;
}) {
  const total = parts.reduce((sum, part) => sum + part.points, 0);
  return (
    <div className="overflow-hidden rounded-2xl border border-piloteer-hair bg-piloteer-surface">
      {parts.map((part) => {
        const meta = DRIVERS.find((driver) => driver.id === part.id)!;
        const open = active === part.id;
        return (
          <button
            key={part.id}
            type="button"
            onClick={() => onPick(part.id)}
            className={`grid w-full grid-cols-[20px_1fr_auto] items-start gap-3 border-t border-piloteer-hair px-4 py-4 text-left first:border-t-0 ${open ? 'bg-piloteer-surface-2' : 'hover:bg-piloteer-surface-2'}`}
            aria-expanded={open}
          >
            <span className="pt-0.5 font-mono text-xs" style={{ color: meta.color }}>{part.points >= 0 ? '↑' : '↓'}</span>
            <span>
              <span className="block font-disp text-sm font-semibold">{meta.label}</span>
              <span className="mt-1 block text-sm text-piloteer-metal">{open ? part.reason || meta.question : meta.question}</span>
            </span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${part.points > 0 ? 'text-piloteer-verified' : part.points < 0 ? 'text-piloteer-signal' : 'text-piloteer-metal'}`}>
              {signed(part.points)}
            </span>
          </button>
        );
      })}
      <div className="flex items-center gap-2 border-t border-piloteer-hair-2 bg-piloteer-surface-2 px-4 py-3 text-sm text-piloteer-metal">
        <span className="font-mono font-semibold text-piloteer-ink">
          {parts.map((part) => signed(part.points)).join('  ')} = {signed(total)}.
        </span>
        <span>That is the whole number.</span>
      </div>
    </div>
  );
}

export function bandButtonLabel(score: number) {
  return BANDS.find((band) => band.id === bandOf(score))?.label || 'Neutral';
}
