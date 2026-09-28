'use client';

import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import BookHero from '@/components/BookHero';
import DealTable from '@/components/DealTable';
import PatternBoard from '@/components/PatternBoard';
import { MomentumBar, MomentumFigure, TrendChart } from '@/components/MomentumVisuals';
import { mockDeals, sellers, sellerPatterns, buyerPatterns, marketPatterns } from '@/lib/data/mockData';
import { useDealPane } from '@/lib/dealPane';
import { bookNet, interpret, since } from '@/lib/momentum';
import { Pattern } from '@/lib/types/domain';

export default function ManagerDashboard() {
  const [sellerId, setSellerId] = useState<'all' | 'emma' | 'noah'>('all');
  const [tab, setTab] = useState<'seller' | 'buyer' | 'market'>('seller');
  const [focus, setFocus] = useState<'improving' | 'attention'>('attention');
  const { openDeal } = useDealPane();
  const visible = sellerId === 'all' ? mockDeals : mockDeals.filter((deal) => deal.ownerId === sellerId);
  const attention = mockDeals.filter((deal) => deal.momentum < -10);
  const patterns: Record<typeof tab, Pattern[]> = { seller: sellerPatterns, buyer: buyerPatterns, market: marketPatterns };

  return (
    <DashboardNav>
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <BookHero
          eyebrow="Team"
          kicker="The team book on the same axis as a single deal. It describes the deals, not the people."
          deals={mockDeals}
          compareNote="Hunter never ranks sellers against each other. Each book below is compared only with its own past."
        />

        <section>
          <p className="eyebrow">Two books</p>
          <h2 className="mt-2 text-3xl font-bold">Each seller, against their own trend.</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {sellers.map((seller) => {
              const deals = mockDeals.filter((deal) => deal.ownerId === seller.id);
              const net = bookNet(deals);
              const selected = sellerId === seller.id;
              return (
                <button
                  key={seller.id}
                  type="button"
                  onClick={() => setSellerId(selected ? 'all' : seller.id)}
                  className={`rounded-3xl border p-5 text-left ${selected ? 'border-piloteer-ink bg-piloteer-surface' : 'border-piloteer-hair bg-piloteer-surface/50'}`}
                  aria-pressed={selected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-piloteer-hair-2 bg-piloteer-surface-3 font-mono text-xs">{seller.initials}</span>
                      <span>
                        <span className="block font-semibold">{seller.name}</span>
                        <span className="block text-xs text-piloteer-mute">{deals.length} active deals · {seller.role}</span>
                      </span>
                    </div>
                    <span className="text-right">
                      <MomentumFigure value={net.score} />
                      <span className="mt-1 block text-xs text-piloteer-mute">{interpret(net.score, net.history)}</span>
                    </span>
                  </div>
                  <div className="mt-4"><MomentumBar value={net.score} /></div>
                  <div className="mt-4"><TrendChart values={net.history} caption={`${seller.name} ${since(net.history)}`} /></div>
                  <p className="mt-3 text-sm text-piloteer-metal">{seller.focus} {since(net.history)}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="eyebrow">Needs you</p>
          <h2 className="mt-2 text-3xl font-bold">Where the book is losing ground.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {attention.map((deal) => (
              <button key={deal.id} type="button" onClick={() => openDeal(deal.id)} className="rounded-3xl border border-piloteer-hair bg-piloteer-surface p-5 text-left hover:bg-piloteer-surface-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{deal.company.name}</p>
                    <p className="mt-1 text-xs text-piloteer-mute">{sellers.find((seller) => seller.id === deal.ownerId)?.name}</p>
                  </div>
                  <MomentumFigure value={deal.momentum} />
                </div>
                <div className="mt-3"><MomentumBar value={deal.momentum} /></div>
                <p className="mt-3 text-sm text-piloteer-metal">{deal.why}</p>
                <p className="mt-2 text-sm font-semibold">{deal.actionReason}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Deals</p>
              <h2 className="mt-2 text-3xl font-bold">{sellerId === 'all' ? 'The whole team' : sellers.find((seller) => seller.id === sellerId)?.name}</h2>
            </div>
            {sellerId !== 'all' && (
              <button type="button" onClick={() => setSellerId('all')} className="text-sm font-semibold text-piloteer-metal">Show both books</button>
            )}
          </div>
          <div className="mt-5"><DealTable deals={visible} /></div>
        </section>

        <section>
          <p className="eyebrow">Patterns</p>
          <h2 className="mt-2 text-3xl font-bold">What to reinforce, and what to coach.</h2>
          <div className="mt-5 flex gap-2">
            {([
              ['seller', 'Seller'],
              ['buyer', 'Buyer'],
              ['market', 'Market'],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === key ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="mt-5"><PatternBoard patterns={patterns[tab]} /></div>
        </section>

        <section>
          <p className="eyebrow">Team movement</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setFocus('improving')} className={`rounded-3xl border p-5 text-left ${focus === 'improving' ? 'border-piloteer-verified bg-piloteer-verified-soft' : 'border-piloteer-hair'}`}>
              <p className="font-semibold">Improving</p>
              <p className="mt-2 text-sm text-piloteer-metal">Permission-based discovery is on the deals that are gaining. Security conversations that start early are closing faster.</p>
            </button>
            <button type="button" onClick={() => setFocus('attention')} className={`rounded-3xl border p-5 text-left ${focus === 'attention' ? 'border-piloteer-watch bg-piloteer-watch-soft' : 'border-piloteer-hair'}`}>
              <p className="font-semibold">Needs a manager</p>
              <p className="mt-2 text-sm text-piloteer-metal">Two deals are still getting feature answers to rollout questions. EU hosting is a product risk, not a coaching tip.</p>
            </button>
          </div>
        </section>
      </div>
    </DashboardNav>
  );
}
