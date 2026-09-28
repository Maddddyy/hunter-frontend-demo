'use client';

import { Deal } from '@/lib/types/domain';
import { dealState, money, stageLabel } from '@/lib/momentum';
import { useDealPane } from '@/lib/dealPane';
import { MomentumBar, MomentumFigure, Sparkline, StatePill } from './MomentumVisuals';

export default function DealTable({ deals }: { deals: Deal[] }) {
  const { dealId, openDeal } = useDealPane();
  if (deals.length === 0) {
    return <p className="rounded-2xl border border-piloteer-hair px-5 py-10 text-center text-sm text-piloteer-mute">No deals in this view.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-piloteer-hair bg-piloteer-surface">
      <div className="hidden grid-cols-[1.3fr_2fr_76px_138px] gap-4 border-b border-piloteer-hair px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-piloteer-mute md:grid">
        <span>Deal</span>
        <span>Momentum</span>
        <span className="text-center">Last 5</span>
        <span className="text-right">State</span>
      </div>
      {deals.map((deal) => {
        const state = dealState(deal);
        const recent = deal.history.slice(-5);
        const selected = dealId === deal.id;
        return (
          <button
            key={deal.id}
            type="button"
            onClick={() => openDeal(deal.id)}
            className={`grid w-full grid-cols-1 items-center gap-3 border-t border-piloteer-hair px-4 py-4 text-left first:border-t-0 md:grid-cols-[1.3fr_2fr_76px_138px] md:gap-4 md:px-5 ${selected ? 'bg-piloteer-surface-2' : 'hover:bg-piloteer-surface-2'}`}
          >
            <span>
              <span className="block font-disp text-sm font-semibold">{deal.company.name}</span>
              <span className="mt-1 block text-xs text-piloteer-mute">{deal.why}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-piloteer-faint">{money(deal.value)} · {stageLabel(deal.stage)}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="min-w-0 flex-1"><MomentumBar value={deal.momentum} /></span>
              <MomentumFigure value={deal.momentum} size="sm" />
            </span>
            <span className="hidden justify-self-center md:block"><Sparkline values={recent} state={state.state} /></span>
            <span className="justify-self-start md:justify-self-end"><StatePill state={state.state} label={state.label} /></span>
          </button>
        );
      })}
    </div>
  );
}
