'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDeals } from '@/lib/data/mockData';
import { useDealPane } from '@/lib/dealPane';
import { usePersona } from '@/lib/persona';
import { dealAnswer, dealState, interpret, money, prepHref, since, signed, stageLabel } from '@/lib/momentum';
import { packFor, useFollow } from '@/lib/followThrough';
import { DriverId } from '@/lib/types/domain';
import FollowThroughView from './FollowThroughView';
import { DriverStack, MomentumBar, MomentumFigure, Sparkline, StatePill } from './MomentumVisuals';

export default function DealPane() {
  const { dealId, view, openDeal, closeDeal } = useDealPane();
  const { persona } = usePersona();
  const follow = useFollow();
  const deal = mockDeals.find((item) => item.id === dealId);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [coach, setCoach] = useState('On the next call, answer the rollout question with a customer story, then ask what is still unresolved.');
  const [coachSent, setCoachSent] = useState(false);
  const [driver, setDriver] = useState<DriverId | null>('velocity');
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    setNote('');
    setSaved(false);
    setCoachSent(false);
    setQuestion('');
    setThread([]);
    setDriver('velocity');
  }, [dealId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDeal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDeal]);

  if (!dealId) return null;

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || !deal) return;
    setThread((current) => [...current, { q: text, a: dealAnswer(deal, text) }]);
    setQuestion('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(question);
  };

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-full flex-col border-l border-piloteer-hair bg-piloteer-surface shadow-2xl xl:w-[460px]" aria-label="Deal">
      <div className="flex items-start justify-between gap-3 border-b border-piloteer-hair px-5 py-4">
        <div className="min-w-0">
          <p className="eyebrow">Deal</p>
          <h2 className="mt-1 truncate text-xl font-bold">{deal ? deal.company.name : 'Not in this book'}</h2>
        </div>
        <button type="button" onClick={closeDeal} className="rounded-lg px-2 py-1 text-sm text-piloteer-metal hover:bg-piloteer-surface-3 hover:text-piloteer-ink" aria-label="Close deal">
          Close
        </button>
      </div>

      {!deal ? (
        <div className="p-5">
          <p className="text-piloteer-metal">That deal is not in this book.</p>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-piloteer-mute">
              <span>{money(deal.value)}</span>
              <span>·</span>
              <span className="capitalize">{stageLabel(deal.stage)}</span>
              <span>·</span>
              <span className="capitalize">{deal.segment.replace('-', ' ')}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <p className="max-w-[16ch] text-2xl font-bold leading-tight">{interpret(deal.momentum, deal.history)}</p>
              <MomentumFigure value={deal.momentum} size="lg" />
            </div>
            <p className="mt-2 text-sm text-piloteer-metal">{since(deal.history)}{deal.momentumChangeLastWeek === 0 ? ' Unchanged this week.' : ` This week ${signed(deal.momentumChangeLastWeek)}.`}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1"><MomentumBar value={deal.momentum} /></div>
              <Sparkline values={deal.history.slice(-5)} state={dealState(deal).state} />
              <StatePill state={dealState(deal).state} label={dealState(deal).label} />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-piloteer-mute"><span>−100</span><span>0</span><span>+100</span></div>

            <p className="mt-6 text-sm text-piloteer-ink">{deal.why}</p>

            {follow.record(deal.id) && (
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => openDeal(deal.id, 'read')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${view === 'read' ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface-3 text-piloteer-metal'}`}>Momentum</button>
                <button type="button" onClick={() => openDeal(deal.id, 'follow')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${view === 'follow' ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface-3 text-piloteer-metal'}`}>Follow-through</button>
              </div>
            )}

            {view === 'follow' && follow.record(deal.id) ? (
              <div className="mt-5">
                <FollowThroughView deal={deal} pack={packFor(deal)} record={follow.record(deal.id)!} seller={persona?.id === 'rep'} />
              </div>
            ) : (
            <>
            <div className="mt-5">
              <DriverStack
                parts={deal.drivers}
                active={driver}
                onPick={(id) => setDriver(driver === id ? null : id)}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-piloteer-hair bg-piloteer-surface-2 px-4 py-3 text-sm text-piloteer-metal">
              <span className="font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">CRM stage · {stageLabel(deal.stage)}</span>
              <p className="mt-1">Stage is where the card was placed. Momentum is what changed in the conversation. They are not combined.</p>
            </div>

            {deal.primaryPattern && (
              <div className="mt-4 rounded-2xl border border-piloteer-hair px-4 py-4">
                <p className="eyebrow">What Hunter sees</p>
                <p className="mt-2 text-sm font-semibold leading-snug">{deal.primaryPattern.pattern}</p>
                <p className="mt-2 text-sm text-piloteer-metal">{deal.primaryPattern.recommendedAction}</p>
              </div>
            )}

            {persona?.id === 'rep' && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={prepHref(deal.id)} className="btn-primary">Prep in Console</Link>
              </div>
            )}

            {persona?.id === 'rep' && (
              <form
                className="mt-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!note.trim()) return;
                  setSaved(true);
                }}
              >
                <label className="eyebrow mb-2 block" htmlFor="deal-note">Note for the next prep</label>
                <textarea id="deal-note" value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} rows={3} className="w-full rounded-xl border border-piloteer-hair bg-piloteer-void px-3 py-2 text-sm outline-none focus:border-piloteer-focus" placeholder="Stays on this deal." />
                <button type="submit" className="btn-secondary mt-2">{saved ? 'Saved on the deal' : 'Save note'}</button>
              </form>
            )}

            {persona?.id === 'manager' && deal.ownerId === 'noah' && (
              <form
                className="mt-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setCoachSent(true);
                }}
              >
                <label className="eyebrow mb-2 block" htmlFor="coach-note">Note for Noah</label>
                <textarea id="coach-note" value={coach} onChange={(event) => { setCoach(event.target.value); setCoachSent(false); }} rows={4} className="w-full rounded-xl border border-piloteer-hair bg-piloteer-void px-3 py-2 text-sm outline-none focus:border-piloteer-focus" />
                <p className="mt-2 text-xs text-piloteer-mute">Noah sees the note. He does not see anyone else’s live tips.</p>
                <button type="submit" className="btn-primary mt-3">{coachSent ? 'Sent to Noah' : 'Send note'}</button>
              </form>
            )}

            {persona?.id === 'manager' && deal.ownerId === 'emma' && (
              <p className="mt-4 text-sm text-piloteer-metal">Emma’s book is moving. Reinforce the behaviour. There is no ranking against Noah.</p>
            )}
            </>
            )}

            <div className="mt-6 border-t border-piloteer-hair pt-5">
              <p className="font-disp text-lg font-bold">Ask Hunter</p>
              <p className="mt-1 text-xs text-piloteer-mute">About {deal.company.name}. Answers use this reading.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {deal.prompts.map((prompt) => (
                  <button key={prompt.q} type="button" onClick={() => ask(prompt.q)} className="rounded-full border border-piloteer-hair-2 px-3 py-1.5 text-left text-xs font-semibold text-piloteer-metal hover:border-piloteer-mute hover:text-piloteer-ink">
                    {prompt.q}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {thread.map((item) => (
                  <div key={item.q} className="space-y-2">
                    <p className="text-sm font-semibold">{item.q}</p>
                    <div className="rounded-xl border border-piloteer-hair bg-piloteer-surface-2 p-3 text-sm leading-relaxed text-piloteer-metal">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="border-t border-piloteer-hair bg-piloteer-black/40 p-4">
            <div className="flex items-center gap-2 rounded-xl border border-piloteer-hair bg-piloteer-surface-2 px-3 py-2">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={`Ask about ${deal.company.name}`}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-piloteer-mute"
                aria-label={`Ask Hunter about ${deal.company.name}`}
              />
              <button type="submit" className="text-sm font-semibold">Ask</button>
            </div>
          </form>
        </>
      )}
    </aside>
  );
}
