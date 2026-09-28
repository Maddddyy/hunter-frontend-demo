'use client';

import { useState } from 'react';
import { Deal, DriverId } from '@/lib/types/domain';
import { bookNet, dealState, DRIVERS, driverPoints, inBand, interpret, money, signed, since } from '@/lib/momentum';
import { useDealPane } from '@/lib/dealPane';
import { DriverStack, MomentumBar, MomentumFigure, MomentumScale, TrendChart } from './MomentumVisuals';
import { BandId } from '@/lib/momentum';

export default function BookHero({
  eyebrow,
  kicker,
  deals,
  compareNote,
}: {
  eyebrow: string;
  kicker: string;
  deals: Deal[];
  compareNote?: string;
}) {
  const net = bookNet(deals);
  const { openDeal } = useDealPane();
  const [band, setBand] = useState<BandId | 'all'>('all');
  const [driver, setDriver] = useState<DriverId | null>('velocity');
  const counts = {
    progress: deals.filter((deal) => dealState(deal).label === 'Progressing').length,
    flat: deals.filter((deal) => dealState(deal).label === 'Stalling').length,
    attention: deals.filter((deal) => dealState(deal).label === 'Needs attention' || dealState(deal).label === 'Cold').length,
  };

  const activeDriver = driver || 'velocity';
  const contributors = [...deals].sort((a, b) => Math.abs(driverPoints(b, activeDriver) * b.value) - Math.abs(driverPoints(a, activeDriver) * a.value));

  return (
    <section>
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="max-w-[16ch] text-4xl font-bold tracking-editorial sm:text-5xl">{interpret(net.score, net.history)}</h1>
        <MomentumFigure value={net.score} size="lg" />
      </div>
      <p className="mt-3 max-w-2xl text-piloteer-metal">{kicker} {since(net.history)} {counts.progress} progressing · {counts.flat} flat · {counts.attention} need attention.</p>
      <div className="mt-6 max-w-xl">
        <MomentumBar value={net.score} />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-piloteer-mute"><span>−100</span><span>0</span><span>+100</span></div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-piloteer-hair bg-piloteer-surface p-4 sm:p-6">
          <p className="eyebrow mb-4">The scale · click a band</p>
          <MomentumScale selected={band} onSelect={setBand} />
          <div className="mt-5 space-y-2">
            {deals.filter((deal) => band === 'all' || inBand(deal.momentum, band)).map((deal) => (
              <button key={deal.id} type="button" onClick={() => openDeal(deal.id)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-piloteer-surface-2">
                <span className="w-28 shrink-0 truncate text-sm font-semibold sm:w-40">{deal.company.name}</span>
                <span className="min-w-0 flex-1"><MomentumBar value={deal.momentum} /></span>
                <MomentumFigure value={deal.momentum} size="sm" />
              </button>
            ))}
            {deals.filter((deal) => band === 'all' || inBand(deal.momentum, band)).length === 0 && (
              <p className="text-sm text-piloteer-mute">Nothing in this band.</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <p className="eyebrow">What moved the book</p>
            <p className="text-xs text-piloteer-mute">Value-weighted</p>
          </div>
          <DriverStack
            parts={net.drivers.map((part) => ({ ...part, reason: DRIVERS.find((item) => item.id === part.id)?.question }))}
            active={driver}
            onPick={(id) => setDriver(driver === id ? null : id)}
          />
          {driver && (
            <div className="mt-3 rounded-2xl border border-piloteer-hair bg-piloteer-surface-2 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">Deals pulling {DRIVERS.find((item) => item.id === driver)?.label}</p>
              <div className="mt-2 space-y-1">
                {contributors.map((deal) => {
                  const points = driverPoints(deal, driver);
                  return (
                    <button key={deal.id} type="button" onClick={() => openDeal(deal.id)} className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-piloteer-surface-3">
                      <span className="truncate text-sm">{deal.company.name} <span className="text-piloteer-mute">{money(deal.value)}</span></span>
                      <span className={`font-mono text-sm font-semibold ${points > 0 ? 'text-piloteer-verified' : points < 0 ? 'text-piloteer-signal' : 'text-piloteer-metal'}`}>{signed(points)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-4">
            <p className="eyebrow mb-2">Its own past</p>
            <TrendChart values={net.history} caption={`${kicker} ${since(net.history)}`} />
            {compareNote && <p className="mt-2 text-xs text-piloteer-mute">{compareNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

