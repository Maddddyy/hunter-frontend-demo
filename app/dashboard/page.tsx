'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import BookHero from '@/components/BookHero';
import DealTable from '@/components/DealTable';
import PatternBoard from '@/components/PatternBoard';
import { MomentumBar, MomentumFigure } from '@/components/MomentumVisuals';
import {
  buyerPatterns,
  buyerSellerPatterns,
  marketPatterns,
  mockDeals,
  needsYouItems,
  performanceMetrics,
  sellerPatterns,
} from '@/lib/data/mockData';
import { useDealPane } from '@/lib/dealPane';
import { NeedsYouItem, Pattern } from '@/lib/types/domain';

const DANCE = {
  move: ['Buyer names a concern', 'Seller acknowledges', 'Buyer adds the real detail', 'Momentum rises'],
  stall: ['Buyer concern rises', 'Seller explains', 'Buyer goes quiet', 'Momentum falls'],
};

const LENSES = [
  { id: 'flow', label: 'Moments', value: String(performanceMetrics.momentsIdentified), copy: 'Across 47 moments, guidance was actioned 32 times. In 24 of those, the buyer’s next response changed. Momentum was higher afterward. That is sequence, not proof the tip caused the deal to move.' },
  { id: 'adoption', label: 'Actioned', value: String(performanceMetrics.guidanceActioned), copy: 'Permission-based questions are showing up in discovery. In eight of nine recent deals where you used them, the buyer named a concern without being pushed.' },
  { id: 'evidence', label: 'Buyer changed', value: String(performanceMetrics.buyerResponsesChanged), copy: 'Supported by 24 discovery interactions. TechCorp named security on call one. The usual book surfaces that in week three.' },
  { id: 'after', label: 'Momentum after', value: `+${performanceMetrics.momentumChanged}`, copy: 'The recurring slowdown is an implementation question answered with features. Where the acknowledgement came first, the next reading rose.' },
] as const;

export default function SellerDashboard() {
  const deals = mockDeals.filter((deal) => deal.ownerId === 'emma');
  const queueSource = needsYouItems.filter((item) => item.deal.ownerId === 'emma');
  const [queue, setQueue] = useState(queueSource);
  const [index, setIndex] = useState(0);
  const [patternTab, setPatternTab] = useState<'seller' | 'buyer' | 'buyer-seller' | 'market'>('seller');
  const [dance, setDance] = useState<'move' | 'stall'>('move');
  const [step, setStep] = useState(0);
  const [lens, setLens] = useState<(typeof LENSES)[number]['id']>('flow');
  const [focus, setFocus] = useState('When a buyer asks how it rolls out, tell a customer story before a feature story.');
  const [note, setNote] = useState<string | null>(null);
  const { openDeal } = useDealPane();
  const current = queue[index];
  const patterns: Record<typeof patternTab, Pattern[]> = {
    seller: sellerPatterns,
    buyer: buyerPatterns,
    'buyer-seller': buyerSellerPatterns,
    market: marketPatterns,
  };
  const activeLens = LENSES.find((item) => item.id === lens) || LENSES[0];

  const complete = () => {
    if (!current) return;
    const next = queue.filter((item) => item.id !== current.id);
    setQueue(next);
    setIndex(0);
    setNote(`${current.deal.company.name} cleared.`);
  };

  return (
    <DashboardNav>
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <BookHero
          eyebrow="Performance · your book"
          kicker="Four active deals, weighted by value. This is the book’s position, not a grade on you."
          deals={deals}
          compareNote="Compared with this book’s own readings. Nobody else’s."
        />

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Needs you</p>
              <h2 className="mt-2 text-3xl font-bold">One move.</h2>
            </div>
            <span className="font-mono text-xs text-piloteer-mute">{queue.length} open</span>
          </div>
          {current ? (
            <div className="mt-5 rounded-3xl border border-piloteer-hair bg-piloteer-surface p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => openDeal(current.deal.id)} className="text-left">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">{index + 1} of {queue.length}</span>
                  <span className="mt-1 block text-2xl font-bold">{current.deal.company.name}</span>
                </button>
                <MomentumFigure value={current.deal.momentum} />
              </div>
              <div className="mt-3 max-w-md"><MomentumBar value={current.deal.momentum} /></div>
              <h3 className="mt-5 text-xl font-bold leading-snug">{current.reason}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-piloteer-surface-2 p-4">
                  <p className="eyebrow mb-2">What Hunter sees</p>
                  <p className="text-sm text-piloteer-metal">{current.whatHunterSees}</p>
                </div>
                <div className="rounded-2xl bg-piloteer-surface-2 p-4">
                  <p className="eyebrow mb-2">Do this</p>
                  <p className="text-sm">{current.recommendedAction}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {current.type === 'follow-through' ? (
                  <button type="button" className="btn-primary" onClick={() => openDeal(current.deal.id, 'follow')}>Open follow-through</button>
                ) : (
                  <Link href={actionHref(current)} className="btn-primary">{actionLabel(current)}</Link>
                )}
                <button type="button" onClick={() => openDeal(current.deal.id, current.type === 'follow-through' ? 'follow' : 'read')} className="btn-secondary">Open the deal</button>
                <button type="button" onClick={complete} className="btn-secondary">Done</button>
                {queue.length > 1 && (
                  <button type="button" onClick={() => setIndex((index + 1) % queue.length)} className="btn-ghost">Next</button>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-5 text-lg text-piloteer-metal">You’re clear. The next action lands here when a deal needs you.</p>
          )}
        </section>

        <section>
          <p className="eyebrow">The book</p>
          <h2 className="mt-2 text-3xl font-bold">Every deal on one axis.</h2>
          <p className="mt-2 max-w-2xl text-sm text-piloteer-metal">Open a row. The right pane shows the three parts that add up to the number, and Ask Hunter for that deal.</p>
          <div className="mt-5"><DealTable deals={deals} /></div>
        </section>

        <section>
          <p className="eyebrow">Patterns</p>
          <h2 className="mt-2 text-3xl font-bold">What is shaping the deals.</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {([
              ['seller', 'Seller'],
              ['buyer', 'Buyer'],
              ['buyer-seller', 'Buyer × Seller'],
              ['market', 'Market'],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => setPatternTab(key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${patternTab === key ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal'}`}>
                {label}
              </button>
            ))}
          </div>
          {patternTab === 'buyer-seller' && (
            <div className="mt-4 rounded-3xl border border-piloteer-hair p-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => { setDance('move'); setStep(0); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${dance === 'move' ? 'bg-piloteer-verified text-black' : 'bg-piloteer-surface'}`}>When it moves</button>
                <button type="button" onClick={() => { setDance('stall'); setStep(0); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${dance === 'stall' ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface'}`}>When it stalls</button>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {DANCE[dance].map((label, stepIndex) => (
                  <button key={label} type="button" onClick={() => setStep(stepIndex)} className={`rounded-2xl p-4 text-left ${step === stepIndex ? 'bg-piloteer-surface-3' : 'bg-piloteer-surface'}`}>
                    <span className="font-mono text-[10px] text-piloteer-mute">0{stepIndex + 1}</span>
                    <span className="mt-2 block text-sm font-semibold leading-snug">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5">
            <PatternBoard
              patterns={patterns[patternTab]}
              onUse={(pattern) => {
                setFocus(pattern.recommendedAction);
                setNote('That move is now your next focus.');
              }}
            />
          </div>
        </section>

        <section>
          <p className="eyebrow">Did the move change what happened next?</p>
          <h2 className="mt-2 text-3xl font-bold">Sequence, not a score.</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {LENSES.map((item, itemIndex) => (
              <button key={item.id} type="button" onClick={() => setLens(item.id)} className={`rounded-2xl border p-4 text-left ${lens === item.id ? 'border-piloteer-ink bg-piloteer-ink text-piloteer-void' : 'border-piloteer-hair'}`}>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">0{itemIndex + 1}</span>
                <span className="mt-2 block text-3xl font-bold">{item.value}</span>
                <span className="mt-1 block text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-piloteer-metal">{activeLens.copy}</p>
          <p className="mt-4 text-sm"><span className="text-piloteer-mute">Next focus · </span>{focus}</p>
        </section>
      </div>
      {note && (
        <button type="button" onClick={() => setNote(null)} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-piloteer-ink px-4 py-2 text-sm font-semibold text-piloteer-void">
          {note}
        </button>
      )}
    </DashboardNav>
  );
}

function actionHref(item: NeedsYouItem) {
  if (item.deal.id === 'deal-northwind') return '/console?meeting=northwind-tm';
  if (item.deal.id === 'deal-acme') return '/console?meeting=acme-tm';
  if (item.deal.id === 'deal-techcorp') return '/console?meeting=techcorp-am';
  return '/console';
}

function actionLabel(item: NeedsYouItem) {
  if (item.type === 'prep-needed') return 'Prep the call';
  if (item.type === 'commitment') return 'Prep in Console';
  return 'Prep in Console';
}
