'use client';

import { useRouter } from 'next/navigation';
import PiloteerLogo from '@/components/PiloteerLogo';
import { MomentumBar, MomentumFigure } from '@/components/MomentumVisuals';
import { mockDeals } from '@/lib/data/mockData';
import { bookNet, interpret } from '@/lib/momentum';
import { personaOrder, personas, usePersona, type PersonaId } from '@/lib/persona';

export default function Home() {
  const router = useRouter();
  const { persona, ready, setPersona } = usePersona();
  const company = bookNet(mockDeals);
  const emma = bookNet(mockDeals.filter((deal) => deal.ownerId === 'emma'));
  const readings: Record<PersonaId, { score: number; history: number[]; line: string }> = {
    leader: { score: company.score, history: company.history, line: 'Company book. What is slowing revenue, and what to scale.' },
    manager: { score: company.score, history: company.history, line: 'Two sellers, each against their own trend. Never a ranking.' },
    rep: { score: emma.score, history: emma.history, line: 'Your four deals. The number is the sum of its parts.' },
  };

  const enter = (id: PersonaId) => {
    setPersona(id);
    router.push(personas[id].home);
  };

  return (
    <main className="min-h-screen bg-piloteer-void text-piloteer-ink">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-16">
        <PiloteerLogo className="h-6 opacity-90" />
        <h1 className="mt-8 text-5xl font-bold tracking-editorial sm:text-6xl">Hunter</h1>
        <p className="mt-4 max-w-xl text-lg text-piloteer-metal">
          Is the deal moving toward yes, or slipping away? Momentum runs from −100 to +100, with the reasons beside the number.
        </p>
        <div className="mt-8 max-w-md">
          <MomentumBar value={company.score} />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-piloteer-mute">
            <span>−100</span><span>0</span><span>+100</span>
          </div>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {personaOrder.map((id) => {
            const person = personas[id];
            const current = ready && persona?.id === id;
            const reading = readings[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => enter(id)}
                className={`rounded-3xl border p-5 text-left ${current ? 'border-piloteer-ink bg-piloteer-surface' : 'border-piloteer-hair bg-piloteer-surface hover:border-piloteer-hair-2'}`}
              >
                <p className="eyebrow">{person.title}</p>
                <p className="mt-3 text-xl font-bold">{person.name}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-piloteer-metal">{interpret(reading.score, reading.history)}</span>
                  <MomentumFigure value={reading.score} size="sm" />
                </div>
                <div className="mt-3"><MomentumBar value={reading.score} /></div>
                <p className="mt-4 text-sm leading-relaxed text-piloteer-metal">{reading.line}</p>
                <p className="mt-5 text-sm font-semibold">{current ? 'Continue' : 'Sign in'}</p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
