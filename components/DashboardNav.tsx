'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PiloteerLogo from './PiloteerLogo';
import { NavIcons } from './icons';
import DealPane from './DealPane';
import { useDealPane } from '@/lib/dealPane';
import { allows, personaOrder, personas, usePersona, type PersonaId } from '@/lib/persona';
import { isTeachComplete, TEACH_COMPLETE_EVENT } from '@/lib/teachGate';

export default function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { persona, ready } = usePersona();

  useEffect(() => {
    if (!ready || !pathname) return;
    if (!persona) {
      router.replace('/');
      return;
    }
    if (!allows(persona.id, pathname)) {
      router.replace(persona.home);
    }
  }, [ready, persona, pathname, router]);

  if (!ready || !persona || (pathname && !allows(persona.id, pathname))) {
    return <div className="min-h-screen bg-piloteer-void" />;
  }

  return (
    <AppShell personaId={persona.id} pathname={pathname}>
      {children}
    </AppShell>
  );
}

function AppShell({
  children,
  personaId,
  pathname,
}: {
  children: React.ReactNode;
  personaId: PersonaId;
  pathname: string | null;
}) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState<{ q: string; a: string }[]>([]);
  const [teachChecked, setTeachChecked] = useState(false);
  const [teachComplete, setTeachComplete] = useState(false);
  const { dealId } = useDealPane();
  const persona = personas[personaId];
  const teachLocked = personaId === 'leader' && teachChecked && !teachComplete;

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sync = () => setTeachComplete(isTeachComplete());
    sync();
    setTeachChecked(true);
    window.addEventListener(TEACH_COMPLETE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(TEACH_COMPLETE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!teachLocked || !pathname || pathname.startsWith('/settings/teach')) return;
    router.replace('/settings/teach');
  }, [teachLocked, pathname, router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAskOpen(false);
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navItems =
    personaId === 'leader'
      ? [
          { label: 'Me', href: '/dashboard', Icon: NavIcons.Me },
          { label: 'Deals', href: '/dashboard/deals', Icon: NavIcons.Deals },
          { label: 'Teams', href: '/dashboard/manager', Icon: NavIcons.Team },
          { label: 'Company', href: '/dashboard/cro', Icon: NavIcons.Company },
          { label: 'Settings', href: '/settings', Icon: NavIcons.Settings },
        ]
      : [
          { label: 'Me', href: '/dashboard', Icon: NavIcons.Me },
          { label: 'Deals', href: '/dashboard/deals', Icon: NavIcons.Deals },
          { label: 'Team', href: '/dashboard/manager', Icon: NavIcons.Team },
        ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    if (href === '/settings') return pathname === '/settings' || pathname?.startsWith('/settings/');
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const viewLabel =
    pathname === '/dashboard'
      ? 'your book'
      : pathname?.includes('/deals')
        ? 'deals'
        : pathname?.includes('/manager')
          ? 'the team'
          : pathname?.includes('/cro')
            ? 'the company'
            : pathname?.includes('/console')
              ? 'Console'
              : pathname?.includes('/settings/teach')
                ? 'the company model'
                : pathname?.includes('/settings')
                  ? 'settings'
                  : 'this view';

  const submitAsk = (event: FormEvent) => {
    event.preventDefault();
    const q = question.trim();
    if (!q) return;
    setAsked((current) => [...current, { q, a: answerFor(q, viewLabel) }]);
    setQuestion('');
  };

  if (personaId === 'leader' && !teachChecked) {
    return <div className="min-h-screen bg-piloteer-void" />;
  }

  if (teachLocked) {
    return <div className="h-screen overflow-hidden bg-piloteer-void text-piloteer-ink">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-piloteer-void text-piloteer-ink">
      {navOpen && (
        <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" aria-label="Close navigation" onClick={() => setNavOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[232px] shrink-0 flex-col border-r border-piloteer-hair bg-piloteer-plane transition-transform lg:static lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link href={teachLocked ? '/settings/teach' : persona.home} className="flex items-center gap-3 px-5 py-5">
          <PiloteerLogo className="h-5 opacity-90" />
        </Link>
        <p className="px-5 pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-mute">Hunter</p>
        <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.Icon;
            const active = isActive(item.href);
            const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active ? 'bg-piloteer-surface-3 text-piloteer-ink' : 'text-piloteer-metal hover:bg-piloteer-surface-2 hover:text-piloteer-ink'}`;
            if (teachLocked) {
              return (
                <span key={item.href} className={`${className} cursor-not-allowed opacity-40 hover:bg-transparent hover:text-piloteer-metal`} title="Finish Teach Hunter first">
                  <Icon />
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={className}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-piloteer-hair bg-piloteer-void/90 px-3 backdrop-blur sm:px-5">
          <button type="button" className="rounded-lg px-2 py-1 text-sm font-semibold lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigation">
            Menu
          </button>
          <div className="ml-auto flex items-center gap-2">
            <PersonaMenu current={personaId} compact />
            <button
            type="button"
            onClick={() => setAskOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-lg border border-piloteer-hair bg-piloteer-surface-2 px-3 py-2 text-sm font-semibold hover:bg-piloteer-surface-3"
            aria-expanded={askOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ask Hunter
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-y-auto">{children}</div>
          <DealPane />
          {askOpen && (
            <aside
              className={`absolute inset-y-0 right-0 z-30 flex w-full flex-col border-l border-piloteer-hair bg-piloteer-surface shadow-2xl xl:w-[380px] ${dealId ? 'xl:right-[460px]' : ''}`}
              aria-label="Ask Hunter"
            >
              <div className="flex items-center justify-between border-b border-piloteer-hair px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold">Ask Hunter</h2>
                  <p className="text-xs font-mono text-piloteer-mute">About {viewLabel}</p>
                </div>
                <button type="button" onClick={() => setAskOpen(false)} className="rounded-lg px-2 py-1 text-sm text-piloteer-metal hover:text-piloteer-ink" aria-label="Close Ask Hunter">
                  Close
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                  {[...contextualQA(pathname, personaId), ...asked].map((qa) => (
                    <div key={qa.q} className="space-y-2">
                      <p className="text-sm font-semibold leading-relaxed">{qa.q}</p>
                      <div className="rounded-xl border border-piloteer-hair bg-piloteer-surface-2 p-4 text-sm leading-relaxed text-piloteer-metal">{qa.a}</div>
                    </div>
                  ))}
                </div>
              </div>
              <form className="border-t border-piloteer-hair bg-piloteer-black/40 p-4" onSubmit={submitAsk}>
                <div className="flex items-center gap-2 rounded-xl border border-piloteer-hair bg-piloteer-surface-2 px-3 py-2">
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    type="text"
                    placeholder="Ask about this screen"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-piloteer-mute"
                  />
                  <button type="submit" className="text-sm font-semibold">Ask</button>
                </div>
              </form>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonaMenu({ current, compact = false }: { current: PersonaId; compact?: boolean }) {
  const router = useRouter();
  const { setPersona } = usePersona();
  const [open, setOpen] = useState(false);
  const person = personas[current];
  const initials = person.name.split(' ').map((part) => part[0]).join('');

  const choose = (id: PersonaId) => {
    setPersona(id);
    setOpen(false);
    if (id === 'leader' && !isTeachComplete()) {
      router.push('/settings/teach');
      return;
    }
    router.push(personas[id].home);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-piloteer-surface-2 ${compact ? '' : 'w-full'}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-piloteer-hair-2 bg-piloteer-surface-3 text-xs font-semibold">{initials}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{person.name}</span>
          <span className="block truncate text-[11px] text-piloteer-mute">{person.title}</span>
        </span>
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-40 cursor-default" aria-label="Close role menu" onClick={() => setOpen(false)} />
          <div className={`absolute z-50 w-[250px] rounded-2xl border border-piloteer-hair bg-piloteer-surface p-2 shadow-2xl ${compact ? 'right-0 top-12' : 'bottom-14 left-0'}`} role="menu">
            <p className="px-3 pb-1 pt-2 font-mono text-[11px] uppercase tracking-widest text-piloteer-mute">Signed in as</p>
            {personaOrder.map((id) => {
              const option = personas[id];
              const selected = id === current;
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => choose(id)}
                  className={`w-full rounded-xl px-3 py-3 text-left ${selected ? 'bg-piloteer-surface-3' : 'hover:bg-piloteer-surface-2'}`}
                >
                  <span className="block text-sm font-semibold">{option.name}</span>
                  <span className="mt-0.5 block text-xs text-piloteer-metal">{option.title}</span>
                </button>
              );
            })}
            <Link href="/" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-piloteer-metal hover:bg-piloteer-surface-2 hover:text-piloteer-ink">
              All roles
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function answerFor(question: string, view: string) {
  const text = question.toLowerCase();
  if (text.includes('acme') || text.includes('europe')) {
    return 'Acme is slipping at −12. Velocity −8, communication −6, progression +2. The EU hosting question has been open for three weeks. A better story does not create EU hosting — escalate that, and book a dated next step.';
  }
  if (text.includes('momentum') || text.includes('score')) {
    return 'Momentum runs from −100 to +100. Zero means the deal is going nowhere. Plus is gaining ground, minus is losing it. It is not a close probability and it is not a grade on the seller. Velocity, communication, and progression add up to the whole number.';
  }
  if (text.includes('rank') || text.includes('leaderboard')) {
    return 'Hunter does not rank sellers. A book’s net momentum is compared with its own past. Territory is not skill.';
  }
  if (text.includes('teach')) {
    return 'Teach Hunter lives in Settings for the revenue leader. Managers and reps use the model. They do not edit it.';
  }
  return `From ${view}: the useful next step is already on this screen. Hunter only claims a change after the interaction shows it in velocity, communication, or progression.`;
}

function contextualQA(pathname: string | null, personaId: PersonaId) {
  if (pathname?.startsWith('/console')) {
    return [
      {
        q: 'Where does momentum show up in Console?',
        a: 'Prep shows the current reading for a known deal. Live tips stay private. The number itself is explained on the deal pane, which you can open from Performance or Deals.',
      },
    ];
  }
  if (pathname?.startsWith('/settings/teach')) {
    return [
      {
        q: 'What should I teach before sellers start?',
        a: 'What Piloteer sells, who buys it, the sales motion, and the moments that matter. Hunter asks only when something is missing, contradictory, or outdated.',
      },
      {
        q: 'Can I change this after go-live?',
        a: 'Yes. Teach Hunter stays in Settings for the revenue leader. Products, pricing, messaging, and the sales motion can be updated whenever they change.',
      },
    ];
  }
  if (pathname?.startsWith('/settings')) {
    if (personaId === 'rep') {
      return [
        {
          q: 'What does calendar sync do?',
          a: 'Hunter reads Google Calendar so Prepare and Start Sensing can open today and tomorrow. Meetings with an external attendee are treated as likely customer calls. Internal-only meetings stay hidden.',
        },
        {
          q: 'Why can’t I see Teach Hunter?',
          a: 'The company model is owned by the revenue leader. Your settings cover your calendar, call connection, and notifications.',
        },
      ];
    }
    if (personaId === 'manager') {
      return [
        {
          q: 'Where is team performance?',
          a: 'Team is your home. It shows where to intervene and which behaviours to reinforce. It is not a seller leaderboard.',
        },
        {
          q: 'Why isn’t Teach Hunter here?',
          a: 'Only the revenue leader teaches and approves the company model. Your settings are personal: calendar, calls, and notifications.',
        },
      ];
    }
    return [
      {
        q: 'Where do I update how we sell?',
        a: 'Teach Hunter, in Settings. Open the company model, change what is outdated, and approve it. Sellers pick up the updated guidance on their next prep.',
      },
      {
        q: 'Who should I invite?',
        a: 'Invite sales managers and sales reps. Managers get team performance. Reps get their book and Hunter Console. Neither role can edit the company model.',
      },
    ];
  }
  if (pathname?.includes('/cro')) {
    return [
      {
        q: 'What is slowing revenue?',
        a: 'EU data residency is the drag on the enterprise book. Acme is −12 after technical questions were already answered. The move is a product path for EU hosting, not another forecast review.',
      },
      {
        q: 'What should we scale?',
        a: 'Permission-based discovery. Buyers name the real concern earlier when sellers use it. It is on part of the enterprise team, not all of it.',
      },
    ];
  }
  if (pathname?.includes('/manager')) {
    return [
      {
        q: 'Where should I intervene first?',
        a: 'Noah’s book. Acme is −12 on an open EU hosting risk, and Midway is −28 with no new stakeholder in three weeks. Coach the story. Escalate the product blocker. Do not rank Noah against Emma.',
      },
      {
        q: 'What should I reinforce?',
        a: 'Emma’s book is gaining. Permission-based discovery is showing up on TechCorp and Helios. Reinforce the behaviour on her own trend.',
      },
    ];
  }
  if (pathname?.includes('/deals')) {
    return [
      {
        q: 'How do I read a row?',
        a: 'The bar is the position from −100 to +100. The sparkline is the last five readings. The state is the direction. Open a row for the three parts that add up to the number.',
      },
      {
        q: 'Why isn’t stage the sort?',
        a: 'CRM stage is where someone dragged the card. Momentum changes when the buyer does. The stage view is available beside it, and the two are never merged.',
      },
    ];
  }
  return [
    {
      q: 'Why is my book gaining?',
      a: 'Emma’s book is value-weighted. Helios and TechCorp are doing the lifting. Globex is flat at +8. The parts — velocity, communication, progression — add up to the net. It is not a grade.',
    },
    {
      q: 'What needs me?',
      a: 'One action at a time, ordered by deal impact. Helios is waiting on the success plan. Northwind’s call is booked and the goal is blank. TechCorp still needs the executive date.',
    },
  ];
}
