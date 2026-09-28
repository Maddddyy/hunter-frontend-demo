'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hunterDirectory, mockDeals } from '@/lib/data/mockData';
import { useFollow, packFor, recommendedGoal } from '@/lib/followThrough';
import { usePersona } from '@/lib/persona';
import PiloteerLogo from '@/components/PiloteerLogo';
import MomentumDisplay from '@/components/MomentumDisplay';

type Day = 'today' | 'tomorrow';
type PrepState = 'needs-prep' | 'draft' | 'prepared';
type Mode = 'home' | 'prep' | 'sense';
type SalesMark = 'unset' | 'sales' | 'not-sales';

type Person = {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  linkedIn: string;
  external: boolean;
};

type ContextItem = {
  id: string;
  detail: string;
  source: 'Public profile' | 'Prior interaction';
  state: 'open' | 'confirmed' | 'dismissed';
};

type Meeting = {
  id: string;
  day: Day;
  time: string;
  company: string;
  companyId: string;
  callType: string;
  status: PrepState;
  internal: boolean;
  privateEvent: boolean;
  recurring: boolean;
  sales: SalesMark;
  firstCall: boolean;
  people: Person[];
  goal: string;
};

const CALL_TYPES = ['Discovery', 'Technical validation', 'Proposal', 'Other'];
const ROLES = ['Leading', 'Supporting', 'Observing'] as const;

const STARTER: Meeting[] = [
  {
    id: 'techcorp-am',
    day: 'today',
    time: '11:00',
    company: 'TechCorp Global',
    companyId: 'techcorp',
    callType: 'Technical validation',
    status: 'prepared',
    internal: false,
    privateEvent: false,
    recurring: true,
    sales: 'sales',
    firstCall: false,
    people: [
      { id: 'p1', name: 'Sarah Chen', email: 'sarah.chen@techcorpglobal.com', title: 'VP RevOps', company: 'TechCorp Global', linkedIn: '', external: true },
      { id: 'p2', name: 'David Kim', email: 'david.kim@techcorpglobal.com', title: 'IT Security', company: 'TechCorp Global', linkedIn: '', external: true },
    ],
    goal: 'Get security sign-off in writing before the board conversation',
  },
  {
    id: 'techcorp-pm',
    day: 'today',
    time: '14:00',
    company: 'TechCorp Global',
    companyId: 'techcorp',
    callType: 'Technical validation',
    status: 'draft',
    internal: false,
    privateEvent: false,
    recurring: false,
    sales: 'unset',
    firstCall: false,
    people: [
      { id: 'p3', name: 'Sarah Chen', email: 'sarah.chen@techcorpglobal.com', title: 'VP RevOps', company: 'TechCorp Global', linkedIn: '', external: true },
    ],
    goal: '',
  },
  {
    id: 'standup',
    day: 'today',
    time: '09:30',
    company: 'Pipeline standup',
    companyId: '',
    callType: 'Internal',
    status: 'needs-prep',
    internal: true,
    privateEvent: false,
    recurring: true,
    sales: 'not-sales',
    firstCall: false,
    people: [],
    goal: '',
  },
  {
    id: 'private-1',
    day: 'today',
    time: '16:00',
    company: 'Private',
    companyId: '',
    callType: '',
    status: 'needs-prep',
    internal: false,
    privateEvent: true,
    recurring: false,
    sales: 'unset',
    firstCall: false,
    people: [],
    goal: '',
  },
  {
    id: 'northwind-tm',
    day: 'tomorrow',
    time: '10:00',
    company: 'Northwind Logistics',
    companyId: 'northwind',
    callType: 'Discovery',
    status: 'needs-prep',
    internal: false,
    privateEvent: false,
    recurring: false,
    sales: 'unset',
    firstCall: false,
    people: [
      { id: 'p4', name: 'Omar Shah', email: 'omar.shah@northwind.example', title: 'Director of Ops', company: 'Northwind Logistics', linkedIn: '', external: true },
    ],
    goal: '',
  },
  {
    id: 'acme-tm',
    day: 'tomorrow',
    time: '15:30',
    company: 'Acme Europe',
    companyId: 'acme-europe',
    callType: 'Proposal',
    status: 'needs-prep',
    internal: false,
    privateEvent: false,
    recurring: true,
    sales: 'sales',
    firstCall: false,
    people: [
      { id: 'p5', name: 'Lena Vogel', email: 'lena.vogel@acme-europe.example', title: 'VP Operations', company: 'Acme Europe', linkedIn: '', external: true },
    ],
    goal: '',
  },
];

const TIPS = [
  {
    pattern: 'Sarah said “board timeline” twice in ninety seconds',
    meaning: 'An outside date is creating pressure',
    move: 'Ask what the board needs to see before it will move',
  },
  {
    pattern: 'David stopped asking compliance questions and asked about rollout',
    meaning: 'Security is no longer the open issue',
    move: 'Name the shift, then ask which timeline works for the first site',
  },
  {
    pattern: 'Sarah paused before the adoption question',
    meaning: 'Something about the sales floor is still unsaid',
    move: 'Ask what would make the team trust this enough to use it',
  },
];

const STATUS_LABEL: Record<PrepState, string> = {
  prepared: 'Prepared',
  draft: 'Draft',
  'needs-prep': 'Needs prep',
};

const ACTION_LABEL: Record<PrepState, string> = {
  prepared: 'Start',
  draft: 'Continue prep',
  'needs-prep': 'Prep',
};

export default function ConsolePage() {
  const router = useRouter();
  const { persona, ready } = usePersona();
  const follow = useFollow();
  const [meetings, setMeetings] = useState<Meeting[]>(STARTER);
  const [mode, setMode] = useState<Mode>('home');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [day, setDay] = useState<Day>('today');
  const [showAll, setShowAll] = useState(false);
  const [menu, setMenu] = useState<'none' | 'sense' | 'add' | 'more' | 'help' | 'permissions'>('none');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sensing, setSensing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [tipIdx, setTipIdx] = useState(-1);
  const [tipMarks, setTipMarks] = useState<Record<number, 'acted' | 'dismissed'>>({});
  const [role, setRole] = useState<(typeof ROLES)[number]>('Leading');
  const [callType, setCallType] = useState('Technical validation');
  const [goal, setGoal] = useState('');
  const [sellerNote, setSellerNote] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [contexts, setContexts] = useState<ContextItem[]>([]);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [saveLabel, setSaveLabel] = useState('Needs prep');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [firstCall, setFirstCall] = useState(false);
  const [addCompany, setAddCompany] = useState('');
  const [addContact, setAddContact] = useState('');
  const [addWhen, setAddWhen] = useState('');
  const [created, setCreated] = useState<{ kind: 'company' | 'contact'; id: string; name: string; meta: string; companyId?: string; firstCall: boolean }[]>([]);

  useEffect(() => {
    if (!ready) return;
    if (!persona) router.replace('/');
  }, [ready, persona, router]);

  useEffect(() => {
    if (!sensing) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    const tips = [800, 2800, 5200].map((delay, index) => window.setTimeout(() => setTipIdx(index), delay));
    return () => {
      window.clearInterval(timer);
      tips.forEach(window.clearTimeout);
    };
  }, [sensing]);

  const opened = useRef(false);

  useEffect(() => {
    if (!ready || !persona || opened.current) return;
    const params = new URLSearchParams(window.location.search);
    const meeting = params.get('meeting');
    const requested = params.get('mode');
    if (!meeting) return;
    const found = STARTER.find((item) => item.id === meeting);
    if (!found || found.privateEvent) return;
    opened.current = true;
    if (requested === 'follow') {
      const deal = mockDeals.find((item) => item.company.name === found.company);
      if (deal && persona.id !== 'leader') {
        follow.ensure(deal.id);
        router.replace(`/dashboard/deals/${deal.id}?view=follow`);
      }
      return;
    }
    openMeeting(found, requested === 'sense' ? 'sense' : 'prep');
    // openMeeting is stable enough for the initial deep link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, persona]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const active = meetings.find((meeting) => meeting.id === activeId) || null;

  const visibleMeetings = meetings.filter((meeting) => {
    if (meeting.day !== day) return false;
    if (meeting.privateEvent) return true;
    if (showAll) return true;
    if (meeting.internal) return false;
    if (meeting.sales === 'not-sales') return false;
    return true;
  });

  const records = useMemo(() => {
    const extras = created.map((item) => ({ ...item }));
    return [...hunterDirectory, ...extras];
  }, [created]);

  const matches = query.trim().length < 1
    ? []
    : records.filter((record) => record.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6);

  const requiredReady = Boolean(callType && role && goal.trim() && people.some((person) => person.external) && (!firstCall || companyName.trim()));

  useEffect(() => {
    if (mode !== 'prep') return;
    const handle = window.setTimeout(() => {
      setSaveLabel(requiredReady ? 'Draft saved' : 'Needs prep');
      if (activeId) {
        setMeetings((current) => current.map((meeting) => (
          meeting.id === activeId && meeting.status !== 'prepared'
            ? { ...meeting, status: requiredReady ? 'draft' : 'needs-prep', goal, callType }
            : meeting
        )));
      }
    }, 400);
    return () => window.clearTimeout(handle);
  }, [mode, requiredReady, goal, callType, people, companyName, sellerNote, activeId, firstCall]);

  function loadPrep(meeting: Meeting, asFirst: boolean) {
    setActiveId(meeting.id);
    setFirstCall(asFirst);
    setCompanyName(meeting.company);
    setWebsite(asFirst ? '' : 'https://techcorpglobal.com');
    setLinkedIn('');
    setCallType(meeting.callType || 'Discovery');
    setRole('Leading');
    setGoal(meeting.goal || (asFirst ? '' : recommendedGoal(meeting.company)));
    setPeople(meeting.people);
    setSellerNote('');
    setContexts(contextsFor(meeting.company, asFirst));
    setReviewId(null);
    setSaveLabel(meeting.status === 'prepared' ? 'Prepared' : meeting.status === 'draft' ? 'Draft saved' : 'Needs prep');
  }

  function openMeeting(meeting: Meeting, next: Mode) {
    if (meeting.privateEvent) {
      notify('Private event. Hunter leaves the title alone.');
      return;
    }
    loadPrep(meeting, meeting.firstCall);
    setMenu('none');
    if (next === 'sense') {
      setMode('sense');
      setSensing(true);
      setElapsed(0);
      setTipIdx(-1);
      setTipMarks({});
      return;
    }
    setMode('prep');
  }

  function onMeetingAction(meeting: Meeting) {
    if (meeting.status === 'prepared') openMeeting(meeting, 'sense');
    else openMeeting(meeting, 'prep');
  }

  function selectRecord(record: (typeof records)[number]) {
    const companyId = record.kind === 'company' ? record.id : record.companyId || '';
    const companyNameValue = record.kind === 'company'
      ? record.name
      : hunterDirectory.find((item) => item.id === companyId)?.name || record.name;
    const existing = meetings.find((meeting) => meeting.companyId === companyId && !meeting.privateEvent);
    const meeting: Meeting = existing || {
      id: `made-${Date.now()}`,
      day: 'today',
      time: 'Next',
      company: companyNameValue,
      companyId,
      callType: record.firstCall ? 'Discovery' : 'Technical validation',
      status: 'needs-prep',
      internal: false,
      privateEvent: false,
      recurring: false,
      sales: 'sales',
      firstCall: record.firstCall,
      people: record.kind === 'contact'
        ? [{ id: record.id, name: record.name, email: '', title: record.meta.split('·')[0].trim(), company: companyNameValue, linkedIn: '', external: true }]
        : [],
      goal: '',
    };
    if (!existing) setMeetings((current) => [meeting, ...current]);
    setQuery('');
    setSearchOpen(false);
    openMeeting(meeting, 'prep');
  }

  function createFromQuery() {
    const name = query.trim();
    if (!name) return;
    const record = { kind: 'company' as const, id: `new-${Date.now()}`, name, meta: 'New company', firstCall: true };
    setCreated((current) => [record, ...current]);
    selectRecord(record);
    notify(`${name} added. Finish the first-call prep.`);
  }

  function addManual() {
    if (!addCompany.trim() || !addContact.trim()) {
      notify('Company and contact are both required.');
      return;
    }
    const meeting: Meeting = {
      id: `add-${Date.now()}`,
      day: 'today',
      time: addWhen.trim() || 'Unscheduled',
      company: addCompany.trim(),
      companyId: `co-${Date.now()}`,
      callType: 'Discovery',
      status: 'needs-prep',
      internal: false,
      privateEvent: false,
      recurring: false,
      sales: 'sales',
      firstCall: true,
      people: [{ id: `ct-${Date.now()}`, name: addContact.trim(), email: '', title: '', company: addCompany.trim(), linkedIn: '', external: true }],
      goal: '',
    };
    setMeetings((current) => [meeting, ...current]);
    setAddCompany('');
    setAddContact('');
    setAddWhen('');
    setMenu('none');
    openMeeting(meeting, 'prep');
    notify('Call added. Prep is open.');
  }

  function savePrep() {
    if (!requiredReady || !activeId) {
      notify('Call type, your role, an external person, and a goal are still open.');
      return;
    }
    setMeetings((current) => current.map((meeting) => (
      meeting.id === activeId ? { ...meeting, status: 'prepared', goal, callType, people, company: companyName || meeting.company } : meeting
    )));
    setSaveLabel('Prepared');
    notify('Prep saved on this call.');
  }

  function endCall() {
    setSensing(false);
    setMode('home');
    setTipIdx(-1);
    const name = active?.company || companyName;
    const deal = mockDeals.find((item) => item.company.name === name);
    if (!deal) {
      notify('Follow-through is tagged to a deal once the company is in the book.');
      return;
    }
    follow.ensure(deal.id);
    if (!persona || persona.id === 'leader') {
      notify('Follow-through is on the seller’s deal. It is not done in Console.');
      return;
    }
    router.push(`/dashboard/deals/${deal.id}?view=follow`);
  }

  function markSales(meeting: Meeting, sales: SalesMark) {
    setMeetings((current) => current.map((item) => (
      item.id === meeting.id || (meeting.recurring && item.companyId && item.companyId === meeting.companyId)
        ? { ...item, sales }
        : item
    )));
    notify(sales === 'sales'
      ? meeting.recurring ? 'Marked sales. Hunter will remember this series.' : 'Marked sales.'
      : meeting.recurring ? 'Marked not sales. Hidden unless you show all. Remembered for the series.' : 'Marked not sales.');
  }

  if (!ready || !persona) return <div className="min-h-screen bg-piloteer-void" />;

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#07070a] text-piloteer-ink">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:h-14 sm:flex-nowrap sm:px-4">
          <Link href={persona.home} className="shrink-0" aria-label="Open dashboards">
            <PiloteerLogo className="h-5" />
          </Link>

          <div className="order-last relative w-full sm:order-none sm:flex-1 sm:max-w-xl">
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setMenu('none'); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search companies and contacts"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm outline-none focus:border-white/30"
            />
            {searchOpen && query.trim() && (
              <div className="absolute left-0 right-0 top-12 rounded-2xl border border-white/10 bg-[#12121a] shadow-2xl overflow-hidden">
                {matches.map((record) => (
                  <button key={record.id} type="button" onClick={() => selectRecord(record)} className="block w-full text-left px-4 py-3 hover:bg-white/5">
                    <div className="text-sm font-semibold">{record.name}</div>
                    <div className="text-xs text-piloteer-metal">{record.kind === 'company' ? 'Company' : 'Contact'} · {record.meta}</div>
                  </button>
                ))}
                {matches.length === 0 && (
                  <button type="button" onClick={createFromQuery} className="block w-full text-left px-4 py-3 hover:bg-white/5">
                    <div className="text-sm font-semibold">Create {query.trim()}</div>
                    <div className="text-xs text-piloteer-metal">No saved match. Start a first-call prep.</div>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button type="button" onClick={() => { setMenu(menu === 'sense' ? 'none' : 'sense'); setSearchOpen(false); }} className="rounded-xl border border-white/10 bg-white text-black px-3 py-2 text-sm font-semibold whitespace-nowrap">
              Start Sensing
            </button>
            {menu === 'sense' && (
              <div className="absolute right-0 top-12 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#12121a] p-3 shadow-2xl">
                <div className="flex gap-2 mb-3">
                  {(['today', 'tomorrow'] as Day[]).map((value) => (
                    <button key={value} type="button" onClick={() => setDay(value)} className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize ${day === value ? 'bg-white text-black' : 'text-piloteer-metal'}`}>
                      {value}
                    </button>
                  ))}
                </div>
                <label className="mb-3 flex items-center justify-between text-xs text-piloteer-metal">
                  Show internal and not-sales
                  <input type="checkbox" checked={showAll} onChange={(event) => setShowAll(event.target.checked)} />
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {visibleMeetings.map((meeting) => (
                    <MeetingRow key={meeting.id} meeting={meeting} onAction={() => onMeetingAction(meeting)} onMark={(sales) => markSales(meeting, sales)} />
                  ))}
                  {visibleMeetings.length === 0 && <p className="py-6 text-center text-sm text-piloteer-mute">Nothing on {day}.</p>}
                </div>
              </div>
            )}
          </div>

          <button type="button" onClick={() => { setMenu(menu === 'add' ? 'none' : 'add'); setSearchOpen(false); }} className="h-10 w-10 rounded-xl border border-white/10 text-lg" aria-label="Add a call">+</button>
          <button type="button" onClick={() => { setMenu(menu === 'more' || menu === 'help' || menu === 'permissions' ? 'none' : 'more'); setSearchOpen(false); }} className="h-10 w-10 shrink-0 rounded-xl border border-white/10" aria-label="More">···</button>
          </div>
        </div>
        {menu === 'add' && (
          <form className="border-t border-white/10 px-4 py-4 grid gap-3 md:grid-cols-[1fr_1fr_180px_auto]" onSubmit={(event) => { event.preventDefault(); addManual(); }}>
            <input value={addCompany} onChange={(event) => setAddCompany(event.target.value)} placeholder="Company" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none" />
            <input value={addContact} onChange={(event) => setAddContact(event.target.value)} placeholder="Contact" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none" />
            <input value={addWhen} onChange={(event) => setAddWhen(event.target.value)} placeholder="Tomorrow 10:00" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none" />
            <button type="submit" className="btn-primary">Add call</button>
          </form>
        )}
        {(menu === 'more' || menu === 'help' || menu === 'permissions') && (
          <div className="border-t border-white/10 px-4 py-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="w-40 space-y-1">
              <Link href="/settings" className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/5">Settings</Link>
              <button type="button" onClick={() => setMenu('permissions')} className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/5">Permissions</button>
              <button type="button" onClick={() => setMenu('help')} className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/5">Help</button>
              <Link href={persona.home} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/5">Exit</Link>
            </div>
            <div className="max-w-lg text-sm text-piloteer-metal leading-relaxed">
              {menu === 'permissions' && 'Sensing starts only when you press Start. Live guidance stays on this console. Managers do not see these tips. Private calendar events stay busy blocks.'}
              {menu === 'help' && 'Search a company or open Start Sensing. Both open the same prep. Prepared calls can start immediately. Save Prep when the goal, role, call type, and people are filled.'}
              {menu === 'more' && `${persona.name} · one console for every role. The dashboards are where the jobs differ.`}
            </div>
          </div>
        )}
      </header>

      <div className="relative min-h-[calc(100vh-3.5rem)]">
        {sensing && (
          <div className="absolute left-10 top-16 w-[46vw] max-w-[640px] opacity-30">
            <div className="grid grid-cols-2 gap-2">
              {['Sarah Chen', 'David Kim', 'James Park', persona.name].map((name) => (
                <div key={name} className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-end p-3 text-xs">{name}</div>
              ))}
            </div>
          </div>
        )}

        <aside className="ml-auto w-full max-w-[480px] min-h-[calc(100dvh-3.5rem)] border-l border-white/10 bg-[#0c0c12] p-5">
          {mode === 'home' && (
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">Today</p>
              <h1 className="mt-2 text-3xl font-bold tracking-editorial">Prepare, then sense.</h1>
              <div className="mt-6 space-y-3">
                {meetings.filter((meeting) => meeting.day === 'today' && !meeting.internal && meeting.sales !== 'not-sales').map((meeting) => (
                  <MeetingRow key={meeting.id} meeting={meeting} onAction={() => onMeetingAction(meeting)} onMark={(sales) => markSales(meeting, sales)} />
                ))}
              </div>
            </div>
          )}

          {mode === 'prep' && (
            <Prep
              firstCall={firstCall}
              companyName={companyName}
              website={website}
              linkedIn={linkedIn}
              callType={callType}
              role={role}
              goal={goal}
              sellerNote={sellerNote}
              people={people}
              contexts={contexts}
              reviewId={reviewId}
              editDraft={editDraft}
              saveLabel={saveLabel}
              onCompany={setCompanyName}
              onWebsite={setWebsite}
              onLinkedIn={setLinkedIn}
              onCallType={setCallType}
              onRole={setRole}
              onGoal={setGoal}
              onNote={setSellerNote}
              onPeople={setPeople}
              onContexts={setContexts}
              onReview={(id) => { setReviewId(reviewId === id ? null : id); const found = contexts.find((item) => item.id === id); setEditDraft(found?.detail || ''); }}
              onEditDraft={setEditDraft}
              onBack={() => { setMode('home'); setSensing(false); }}
              onSave={savePrep}
              onStart={() => { if (!requiredReady) { notify('Finish the required fields before sensing.'); return; } savePrep(); setMode('sense'); setSensing(true); setElapsed(0); setTipIdx(-1); }}
              suggestedGoal={recommendedGoal(companyName)}
            />
          )}

          {mode === 'sense' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-piloteer-signal">Sensing</p>
                  <h1 className="mt-1 text-2xl font-bold">{active?.company || companyName}</h1>
                </div>
                <span className="font-mono text-sm">{clock}</span>
              </div>
              {tipIdx < 0 ? (
                <p className="mt-16 text-piloteer-metal">Listening for the next moment.</p>
              ) : (
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">Example tip · {tipIdx + 1} of {TIPS.length}</p>
                  <p className="mt-4 text-lg font-semibold leading-snug">{TIPS[tipIdx].move}</p>
                  <p className="mt-3 text-sm text-piloteer-metal">{TIPS[tipIdx].pattern}</p>
                  <p className="mt-2 text-sm text-piloteer-metal">{TIPS[tipIdx].meaning}</p>
                  <div className="mt-5 flex gap-2">
                    <button type="button" onClick={() => { setTipMarks((current) => ({ ...current, [tipIdx]: 'acted' })); notify('Marked as acted.'); }} className={`flex-1 rounded-xl py-2 text-sm font-semibold ${tipMarks[tipIdx] === 'acted' ? 'bg-piloteer-verified text-black' : 'bg-white/10'}`}>Acted</button>
                    <button type="button" onClick={() => { setTipMarks((current) => ({ ...current, [tipIdx]: 'dismissed' })); if (tipIdx < TIPS.length - 1) setTipIdx(tipIdx + 1); notify('Dismissed.'); }} className="flex-1 rounded-xl bg-white/10 py-2 text-sm font-semibold">Dismiss</button>
                  </div>
                  <div className="mt-4 flex justify-between text-xs">
                    <button type="button" disabled={tipIdx === 0} onClick={() => setTipIdx(tipIdx - 1)} className="disabled:opacity-30">Older</button>
                    <button type="button" disabled={tipIdx === TIPS.length - 1} onClick={() => setTipIdx(tipIdx + 1)} className="disabled:opacity-30">Newer</button>
                  </div>
                </div>
              )}
              <button type="button" onClick={endCall} className="btn-secondary mt-6 w-full">End call</button>
            </div>
          )}
        </aside>
      </div>
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{toast}</div>}
    </div>
  );
}

function MeetingRow({ meeting, onAction, onMark }: { meeting: Meeting; onAction: () => void; onMark: (sales: SalesMark) => void }) {
  if (meeting.privateEvent) {
    return (
      <div className="rounded-2xl border border-white/10 px-3 py-3">
        <div className="text-xs font-mono text-piloteer-mute">{meeting.time} · Private</div>
        <p className="mt-1 text-sm text-piloteer-metal">Busy. Hunter does not read this event.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-piloteer-mute">{meeting.time} · {STATUS_LABEL[meeting.status]}</div>
          <div className="mt-1 font-semibold">{meeting.company}</div>
          <div className="text-xs text-piloteer-metal">{meeting.internal ? 'Internal' : meeting.callType}</div>
        </div>
        {!meeting.internal && (
          <button type="button" onClick={onAction} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black">
            {ACTION_LABEL[meeting.status]}
          </button>
        )}
      </div>
      {!meeting.internal && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => onMark('sales')} className={`rounded-full px-2 py-1 text-[11px] font-semibold ${meeting.sales === 'sales' ? 'bg-piloteer-verified text-black' : 'bg-white/5 text-piloteer-metal'}`}>Sales</button>
          <button type="button" onClick={() => onMark('not-sales')} className={`rounded-full px-2 py-1 text-[11px] font-semibold ${meeting.sales === 'not-sales' ? 'bg-white text-black' : 'bg-white/5 text-piloteer-metal'}`}>Not sales</button>
        </div>
      )}
    </div>
  );
}

function Prep(props: {
  firstCall: boolean;
  companyName: string;
  website: string;
  linkedIn: string;
  callType: string;
  role: (typeof ROLES)[number];
  goal: string;
  sellerNote: string;
  people: Person[];
  contexts: ContextItem[];
  reviewId: string | null;
  editDraft: string;
  saveLabel: string;
  suggestedGoal: string;
  onCompany: (value: string) => void;
  onWebsite: (value: string) => void;
  onLinkedIn: (value: string) => void;
  onCallType: (value: string) => void;
  onRole: (value: (typeof ROLES)[number]) => void;
  onGoal: (value: string) => void;
  onNote: (value: string) => void;
  onPeople: (people: Person[]) => void;
  onContexts: (items: ContextItem[]) => void;
  onReview: (id: string) => void;
  onEditDraft: (value: string) => void;
  onBack: () => void;
  onSave: () => void;
  onStart: () => void;
}) {
  return (
    <div className="space-y-5">
      <button type="button" onClick={props.onBack} className="text-xs text-piloteer-metal">Back</button>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">{props.firstCall ? 'First call' : 'Follow-on'}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-editorial">{props.companyName || 'New company'}</h1>
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">{props.saveLabel}</span>
      </div>

      {!props.firstCall && (() => {
        const deal = mockDeals.find((item) => item.company.name === props.companyName);
        if (!deal) return null;
        const pack = packFor(deal);
        return (
          <section className="rounded-3xl bg-white/[0.03] border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">Hunter’s read</p>
            <div className="mt-3"><MomentumDisplay score={deal.momentum} direction={deal.momentumDirection} size="sm" /></div>
            <p className="mt-3 text-sm">{pack.changed}</p>
            <div className="mt-3 space-y-2 text-sm text-piloteer-metal">
              {pack.buyerCares.length > 0 && <p>Buyer cares about {pack.buyerCares.join('; ')}.</p>}
              {pack.unresolved.length > 0 && <p>Still open: {pack.unresolved.join('; ')}.</p>}
              {pack.commitments.length > 0 && <p>Commitments: {pack.commitments.join('; ')}.</p>}
              {pack.roles.length > 0 && <p>Roles: {pack.roles.map((role) => `${role.name} · ${role.role}`).join(', ')}.</p>}
              {pack.patterns.slice(0, 2).map((pattern) => <p key={pattern}>{pattern}</p>)}
            </div>
          </section>
        );
      })()}

      {props.firstCall && (
        <section className="space-y-2">
          <Field label="Company" value={props.companyName} onChange={props.onCompany} />
          <Field label="Website" value={props.website} onChange={props.onWebsite} />
          <Field label="LinkedIn" value={props.linkedIn} onChange={props.onLinkedIn} />
        </section>
      )}

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">Personal context</p>
        {props.contexts.filter((item) => item.state !== 'dismissed').map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 p-3">
            <p className="text-sm">Personal context: {item.detail}</p>
            <button type="button" onClick={() => props.onReview(item.id)} className="mt-1 text-xs text-piloteer-metal">{item.source} · {item.state === 'confirmed' ? 'Confirmed' : 'Review'}</button>
            {props.reviewId === item.id && (
              <div className="mt-3 space-y-2">
                <input value={props.editDraft} onChange={(event) => props.onEditDraft(event.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-2 py-1 text-sm" />
                <div className="flex flex-wrap gap-2">
                  <Mini onClick={() => props.onContexts(props.contexts.map((entry) => entry.id === item.id ? { ...entry, state: 'confirmed', detail: props.editDraft } : entry))}>Confirm</Mini>
                  <Mini onClick={() => props.onContexts(props.contexts.map((entry) => entry.id === item.id ? { ...entry, detail: props.editDraft } : entry))}>Edit</Mini>
                  <Mini onClick={() => props.onContexts(props.contexts.map((entry) => entry.id === item.id ? { ...entry, state: 'dismissed' } : entry))}>Dismiss</Mini>
                  <Mini onClick={() => props.onContexts(props.contexts.filter((entry) => entry.id !== item.id))}>Delete</Mini>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.16em] text-piloteer-mute">Call type
          <select value={props.callType} onChange={(event) => props.onCallType(event.target.value)} className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm normal-case tracking-normal text-piloteer-ink">
            {CALL_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <div className="flex gap-2">
          {ROLES.map((value) => (
            <button key={value} type="button" onClick={() => props.onRole(value)} className={`flex-1 rounded-xl py-2 text-xs font-semibold ${props.role === value ? 'bg-white text-black' : 'bg-white/5'}`}>{value}</button>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-piloteer-mute">People joining</p>
            <button type="button" className="text-xs" onClick={() => props.onPeople([...props.people, { id: `new-${Date.now()}`, name: '', email: '', title: '', company: props.companyName, linkedIn: '', external: true }])}>Add</button>
          </div>
          <div className="mt-2 space-y-2">
            {props.people.map((person) => (
              <div key={person.id} className="rounded-2xl border border-white/10 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <TileField label="Name" value={person.name} onChange={(value) => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, name: value } : item))} />
                  <TileField label="Title" value={person.title} onChange={(value) => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, title: value } : item))} />
                  <TileField label="Company" value={person.company} onChange={(value) => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, company: value } : item))} />
                  <TileField label="Email" value={person.email} onChange={(value) => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, email: value } : item))} />
                  <TileField label="LinkedIn" value={person.linkedIn} onChange={(value) => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, linkedIn: value } : item))} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button type="button" onClick={() => props.onPeople(props.people.map((item) => item.id === person.id ? { ...item, external: !item.external } : item))} className="text-xs text-piloteer-metal">
                    {person.external ? 'External' : 'Internal'}
                  </button>
                  <button type="button" onClick={() => props.onPeople(props.people.filter((item) => item.id !== person.id))} className="text-xs text-piloteer-metal">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <label className="block text-xs uppercase tracking-[0.16em] text-piloteer-mute">Goal
          {!props.firstCall && (
            <button type="button" className="ml-3 normal-case tracking-normal text-piloteer-ink" onClick={() => props.onGoal(props.suggestedGoal)}>Use Hunter’s goal</button>
          )}
          <textarea value={props.goal} onChange={(event) => props.onGoal(event.target.value)} rows={3} className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm normal-case tracking-normal" />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-piloteer-mute">Seller inputs
          <textarea value={props.sellerNote} onChange={(event) => props.onNote(event.target.value)} rows={2} placeholder="Anything Hunter could not retrieve" className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm normal-case tracking-normal" />
        </label>
      </section>

      <div className="flex gap-2">
        <button type="button" onClick={props.onSave} className="btn-secondary flex-1">Save prep</button>
        <button type="button" onClick={props.onStart} className="btn-primary flex-1">Start sensing</button>
      </div>
    </div>
  );
}

function TileField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.14em] text-piloteer-mute">{label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-sm normal-case tracking-normal text-piloteer-ink" />
    </label>
  );
}

function contextsFor(company: string, firstCall: boolean): ContextItem[] {
  if (firstCall) {
    return [{ id: 'ctx-msu', detail: 'Chris attended Michigan State.', source: 'Public profile', state: 'open' }];
  }
  if (company === 'TechCorp Global') {
    return [
      { id: 'ctx-board', detail: 'Sarah mentioned her daughter’s tournament on the last call.', source: 'Prior interaction', state: 'open' },
      { id: 'ctx-einstein', detail: 'Sarah’s team struggled with Einstein last year.', source: 'Prior interaction', state: 'open' },
    ];
  }
  const deal = mockDeals.find((item) => item.company.name === company);
  if (!deal) return [];
  return [{ id: `ctx-${deal.id}`, detail: deal.why, source: 'Prior interaction', state: 'open' }];
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs uppercase tracking-[0.16em] text-piloteer-mute">{label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm normal-case tracking-normal text-piloteer-ink" />
    </label>
  );
}

function Mini({ children, onClick }: { children: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold">{children}</button>;
}
