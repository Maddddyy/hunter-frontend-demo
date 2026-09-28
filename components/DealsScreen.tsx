'use client';

import { useMemo, useState } from 'react';
import { MomentumBar, MomentumFigure, StatePill } from '@/components/MomentumVisuals';
import { mockDeals, sellers } from '@/lib/data/mockData';
import { useDealPane } from '@/lib/dealPane';
import { useFollow } from '@/lib/followThrough';
import { usePersona } from '@/lib/persona';
import { BANDS, bandOf, dealState, money, stageLabel } from '@/lib/momentum';
import { Deal, DealStage } from '@/lib/types/domain';

const STAGE_ORDER: DealStage[] = ['discovery', 'technical-validation', 'proposal', 'negotiation'];

export default function DealsScreen() {
  const { persona } = usePersona();
  const { openDeal, dealId, view } = useDealPane();
  const follow = useFollow();
  const [mode, setMode] = useState<'momentum' | 'stage'>('momentum');
  const [owner, setOwner] = useState<'all' | 'emma' | 'noah'>('all');
  const deals = useMemo(() => {
    const base = persona?.id === 'rep' ? mockDeals.filter((deal) => deal.ownerId === 'emma') : mockDeals;
    if (persona?.id !== 'manager' || owner === 'all') return base;
    return base.filter((deal) => deal.ownerId === owner);
  }, [persona?.id, owner]);

  const open = (deal: Deal) => openDeal(deal.id, follow.isOpen(deal.id) ? 'follow' : 'read');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{persona?.id === 'manager' ? 'Team' : 'Book'}</p>
          <h1 className="mt-2 text-4xl font-bold">Deals</h1>
          <p className="mt-2 max-w-xl text-sm text-piloteer-metal">
            {mode === 'momentum'
              ? 'Columns are momentum bands. A deal with open follow-through is outlined. Opening it does not leave this board.'
              : 'CRM stage is where the card sits. The bar on each card is still momentum. The two are not merged.'}
          </p>
        </div>
        <div className="flex rounded-full border border-piloteer-hair p-1">
          <button type="button" onClick={() => setMode('momentum')} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'momentum' ? 'bg-piloteer-ink text-piloteer-void' : 'text-piloteer-metal'}`}>Momentum</button>
          <button type="button" onClick={() => setMode('stage')} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === 'stage' ? 'bg-piloteer-ink text-piloteer-void' : 'text-piloteer-metal'}`}>CRM stage</button>
        </div>
      </div>

      {persona?.id === 'manager' && (
        <div className="mt-5 flex flex-wrap gap-2">
          {(['all', 'emma', 'noah'] as const).map((id) => (
            <button key={id} type="button" onClick={() => setOwner(id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${owner === id ? 'bg-piloteer-surface-3 text-piloteer-ink' : 'text-piloteer-metal'}`}>
              {id === 'all' ? 'Both books' : sellers.find((seller) => seller.id === id)?.name}
            </button>
          ))}
        </div>
      )}

      <div className={`mt-6 grid gap-3 ${mode === 'momentum' ? 'md:grid-cols-2 xl:grid-cols-5' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
        {mode === 'momentum'
          ? BANDS.map((band) => (
              <Column key={band.id} title={band.label} hint={band.range} deals={deals.filter((deal) => bandOf(deal.momentum) === band.id)} selectedId={dealId} followView={view === 'follow'} isOpen={follow.isOpen} onOpen={open} />
            ))
          : STAGE_ORDER.map((stage) => (
              <Column key={stage} title={stageLabel(stage)} deals={deals.filter((deal) => deal.stage === stage)} selectedId={dealId} followView={view === 'follow'} isOpen={follow.isOpen} onOpen={open} />
            ))}
      </div>
    </div>
  );
}

function Column({
  title,
  hint,
  deals,
  selectedId,
  followView,
  isOpen,
  onOpen,
}: {
  title: string;
  hint?: string;
  deals: Deal[];
  selectedId: string | null;
  followView: boolean;
  isOpen: (id: string) => boolean;
  onOpen: (deal: Deal) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-sm font-semibold capitalize">{title}</h2>
        <span className="font-mono text-xs text-piloteer-mute">{deals.length}</span>
      </div>
      {hint && <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-piloteer-faint">{hint}</p>}
      <div className="space-y-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} selected={selectedId === deal.id} followOpen={isOpen(deal.id)} followView={followView && selectedId === deal.id} onOpen={() => onOpen(deal)} />
        ))}
        {deals.length === 0 && <p className="rounded-2xl border border-dashed border-piloteer-hair px-3 py-6 text-center text-xs text-piloteer-mute">None</p>}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  selected,
  followOpen,
  followView,
  onOpen,
}: {
  deal: Deal;
  selected: boolean;
  followOpen: boolean;
  followView: boolean;
  onOpen: () => void;
}) {
  const state = dealState(deal);
  const border = selected
    ? 'border-piloteer-ink bg-piloteer-surface'
    : followOpen
      ? 'border-piloteer-watch bg-piloteer-watch-soft'
      : 'border-piloteer-hair bg-piloteer-surface/60';
  return (
    <button type="button" onClick={onOpen} className={`w-full rounded-2xl border p-4 text-left ${border}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold leading-tight">{deal.company.name}</span>
        <MomentumFigure value={deal.momentum} size="sm" />
      </div>
      {followOpen && <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-piloteer-watch">{followView ? 'Follow-through open' : 'Follow-through ready'}</span>}
      <div className="mt-3"><MomentumBar value={deal.momentum} /></div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-piloteer-mute">{money(deal.value)}</span>
        <StatePill state={state.state} label={state.label} />
      </div>
    </button>
  );
}
