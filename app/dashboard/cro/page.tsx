'use client';

import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import BookHero from '@/components/BookHero';
import DealTable from '@/components/DealTable';
import PatternBoard from '@/components/PatternBoard';
import EvidenceBadge from '@/components/EvidenceBadge';
import { MomentumBar, MomentumFigure } from '@/components/MomentumVisuals';
import { marketPatterns, mockDeals } from '@/lib/data/mockData';
import { bookNet, interpret, money } from '@/lib/momentum';
import { SegmentId } from '@/lib/types/domain';

const SEGMENTS: { id: SegmentId; name: string; read: string }[] = [
  { id: 'enterprise', name: 'Enterprise', read: 'Helios and TechCorp are gaining. Acme is the drag, and the drag is EU hosting — a product gap, not a stage problem.' },
  { id: 'mid-market', name: 'Mid-market', read: 'Northwind is gaining. Midway is losing ground. Globex and Brightline are warm and not advancing. The net sits near zero.' },
];

export default function CRODashboard() {
  const [segment, setSegment] = useState<SegmentId>('enterprise');
  const [owner, setOwner] = useState('Product');
  const [notice, setNotice] = useState<string | null>(null);
  const [playbook, setPlaybook] = useState(false);
  const [card, setCard] = useState<'spread' | 'pattern' | 'it'>('pattern');
  const selected = SEGMENTS.find((item) => item.id === segment)!;
  const segmentDeals = mockDeals.filter((deal) => deal.segment === segment);
  const net = bookNet(segmentDeals);

  return (
    <DashboardNav>
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <BookHero
          eyebrow="Company"
          kicker="Every active deal, weighted by value. Patterns are aggregated. Live guidance stays with the seller."
          deals={mockDeals}
          compareNote="This is the company’s own trend. It is not a ranking of teams or people."
        />

        <section>
          <p className="eyebrow">Where revenue is moving</p>
          <h2 className="mt-2 text-3xl font-bold">Two books. Same axis.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {SEGMENTS.map((item) => {
              const deals = mockDeals.filter((deal) => deal.segment === item.id);
              const reading = bookNet(deals);
              const active = segment === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSegment(item.id)}
                  className={`rounded-3xl border p-5 text-left ${active ? 'border-piloteer-ink bg-piloteer-surface' : 'border-piloteer-hair'}`}
                  aria-pressed={active}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-piloteer-mute">{deals.length} deals · {money(deals.reduce((sum, deal) => sum + deal.value, 0))}</p>
                    </div>
                    <MomentumFigure value={reading.score} />
                  </div>
                  <div className="mt-4"><MomentumBar value={reading.score} /></div>
                  <p className="mt-3 text-sm text-piloteer-metal">{interpret(reading.score, reading.history)}</p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 max-w-3xl text-sm text-piloteer-metal">{selected.read} Net {net.score > 0 ? '+' : ''}{net.score}, and the parts add up.</p>
          <div className="mt-4"><DealTable deals={segmentDeals} /></div>
        </section>

        <section>
          <p className="eyebrow">Needs you</p>
          <h2 className="mt-2 text-3xl font-bold">Two decisions. Not a forecast.</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-3xl border border-piloteer-hair bg-piloteer-surface p-5">
              <p className="font-semibold">EU hosting is stalling enterprise deals</p>
              <p className="mt-3 text-sm text-piloteer-metal">Technical validation completes, then data residency becomes the blocker. Acme is the deal you can open. Competitors are offering an EU-hosted path.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor="owner">Owner</label>
                <select id="owner" value={owner} onChange={(event) => setOwner(event.target.value)} className="rounded-xl border border-piloteer-hair bg-piloteer-void px-3 py-2 text-sm">
                  <option>Product</option>
                  <option>Legal</option>
                  <option>Enablement</option>
                </select>
                <button type="button" className="btn-primary" onClick={() => setNotice(`Escalated to ${owner}. They can see the pattern and the deals, not a seller’s live tips.`)}>
                  Escalate to {owner}
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-piloteer-hair bg-piloteer-surface p-5">
              <p className="font-semibold">Scale permission-based discovery</p>
              <p className="mt-3 text-sm text-piloteer-metal">Supported across 24 interactions. TechCorp named security on the first call. Eight of nine recent deals where it was used, the buyer shared an unscripted concern. Three of eight enterprise reps use it.</p>
              <div className="mt-4 flex gap-1" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <span key={index} className={`h-2 flex-1 rounded-full ${index < 3 ? 'bg-piloteer-verified' : 'bg-piloteer-surface-3'}`} />
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">3 of 8 reps</p>
              <button type="button" className="btn-primary mt-4" onClick={() => { setPlaybook(true); setNotice('Added to the discovery playbook. Sellers see it the next time they prep.'); }}>
                {playbook ? 'In the playbook' : 'Add to playbook'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <p className="eyebrow">Patterns shaping revenue</p>
          <div className="mt-5"><PatternBoard patterns={marketPatterns} /></div>
        </section>

        <section>
          <p className="eyebrow">Movement</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <EvidenceCard id="spread" active={card} onPick={setCard} title="More even momentum" badge="supported" body="Enterprise deal momentum is less uneven than it was 60 days ago. This is about deals, not a seller ranking." />
            <EvidenceCard id="pattern" active={card} onPick={setCard} title="Winning pattern" badge="validated" body="Three of eight enterprise reps use permission-based discovery. Buyers name the real concern earlier when they do." />
            <EvidenceCard id="it" active={card} onPick={setCard} title="Earlier IT" badge="validated" body="Deals that invite IT during discovery reach proposal sooner than deals that invite IT late." />
          </div>
        </section>
      </div>
      {notice && (
        <button type="button" onClick={() => setNotice(null)} className="fixed bottom-5 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-full bg-piloteer-ink px-4 py-2 text-sm font-semibold text-piloteer-void">
          {notice}
        </button>
      )}
    </DashboardNav>
  );
}

function EvidenceCard({
  id,
  active,
  onPick,
  title,
  badge,
  body,
}: {
  id: 'spread' | 'pattern' | 'it';
  active: string;
  onPick: (id: 'spread' | 'pattern' | 'it') => void;
  title: string;
  badge: 'supported' | 'validated';
  body: string;
}) {
  const open = active === id;
  return (
    <button type="button" onClick={() => onPick(id)} className={`rounded-3xl border p-5 text-left ${open ? 'border-piloteer-ink bg-piloteer-surface' : 'border-piloteer-hair'}`} aria-pressed={open}>
      <EvidenceBadge level={badge} />
      <h3 className="mt-3 font-semibold">{title}</h3>
      {open && <p className="mt-2 text-sm text-piloteer-metal">{body}</p>}
    </button>
  );
}
