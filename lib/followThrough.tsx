'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { mockDeals } from '@/lib/data/mockData';
import { Deal } from '@/lib/types/domain';

export type FollowStatus = 'open' | 'seller-approved' | 'hunter-confirmed';

export type FollowAction = {
  id: string;
  task: string;
  owner: string;
  when: string;
  external: boolean;
};

export type FollowPack = {
  changed: string;
  buyerCares: string[];
  unresolved: string[];
  commitments: string[];
  roles: { name: string; role: string }[];
  patterns: string[];
  relationship: string[];
  nextFocus: string;
  actions: FollowAction[];
  emailTo: string;
  emailSubject: string;
  emailBody: string;
};

export type FollowRecord = {
  status: FollowStatus;
  hoursLeft: number;
  readText: string;
  emailBody: string;
};

const TECHCORP: FollowPack = {
  changed: 'Security review cleared. The language moved from “if we can deploy” to “how we roll this out.” Sarah named the board timeline.',
  buyerCares: [
    'A board date they can defend',
    'Adoption on the sales floor, not another tool announcement',
    'A pilot that does not disturb the Q4 pipeline',
  ],
  unresolved: [
    'The date of the executive conversation',
    'Whether the pilot is the full sales team or one pod',
  ],
  commitments: [
    'David’s written security sign-off — done on the call',
    'Sarah will take a note to the board',
    'Emma will send the one-page briefing before that conversation',
  ],
  roles: [
    { name: 'Sarah Chen', role: 'Champion' },
    { name: 'James Park', role: 'Economic buyer' },
    { name: 'David Kim', role: 'Security' },
    { name: 'Maria Rodriguez', role: 'Enablement' },
  ],
  patterns: [
    'Buyer: the concern moved from technical feasibility to rollout.',
    'Seller: permission-based questions surfaced security on call one.',
    'Buyer × Seller: acknowledgement opened the sales-floor detail. A feature answer would have closed it.',
  ],
  relationship: [
    'Sarah mentioned her daughter’s tournament on the last call.',
    'Her team struggled with Einstein last year.',
  ],
  nextFocus: 'Book the executive conversation inside their board cycle.',
  actions: [
    { id: 'briefing', task: 'Send the one-page briefing for James', owner: 'Emma Dixon', when: 'Thursday', external: false },
    { id: 'board', task: 'Put the security note on the board agenda', owner: 'Sarah Chen', when: 'This week', external: true },
  ],
  emailTo: 'sarah.chen@techcorpglobal.com',
  emailSubject: 'Security sign-off and the board conversation',
  emailBody: `Sarah,

Security sign-off is in. I’ll send the one-page briefing for James before the board conversation.

Two things are still open: the date of that conversation, and whether the pilot is the full sales team or one pod.

I’ll hold Thursday for whichever you can book.

Emma`,
};

export function packFor(deal: Deal): FollowPack {
  if (deal.id === 'deal-techcorp') return TECHCORP;
  return {
    changed: deal.why,
    buyerCares: deal.drivers.filter((driver) => driver.points !== 0).map((driver) => driver.reason),
    unresolved: deal.actionReason ? [deal.actionReason] : ['No new decision, person, or date from the last conversation.'],
    commitments: [],
    roles: [],
    patterns: deal.primaryPattern ? [`${deal.primaryPattern.type}: ${deal.primaryPattern.pattern}`] : [],
    relationship: [],
    nextFocus: deal.actionReason || 'Wait for the next interaction to change velocity, communication, or progression.',
    actions: deal.actionReason
      ? [{ id: 'next', task: deal.actionReason, owner: 'Emma Dixon', when: 'Before the next call', external: false }]
      : [],
    emailTo: '',
    emailSubject: `${deal.company.name} — next step`,
    emailBody: `${deal.company.name} is at ${deal.momentum > 0 ? '+' : ''}${deal.momentum}. ${deal.why}\n\nNext: ${deal.actionReason || 'Nothing goes out until you edit this and send it yourself.'}`,
  };
}

export function recommendedGoal(company: string) {
  const deal = mockDeals.find((item) => item.company.name === company);
  if (!deal) return '';
  if (deal.id === 'deal-techcorp') {
    return 'Confirm security requirements are met, share the rollout timeline, and secure a date for the executive conversation.';
  }
  if (deal.id === 'deal-northwind') return 'Agree which site would pilot, and who owns the rollout.';
  if (deal.id === 'deal-acme') return 'Answer the rollout question with a customer story, then put a dated next step on the calendar.';
  return deal.actionReason || '';
}

export function readText(pack: FollowPack) {
  return [
    pack.changed,
    pack.buyerCares.length ? `Buyer cares about ${pack.buyerCares.join('; ')}.` : '',
    pack.unresolved.length ? `Still open: ${pack.unresolved.join('; ')}.` : '',
    pack.commitments.length ? `Commitments: ${pack.commitments.join('; ')}.` : '',
    pack.nextFocus ? `Next-call focus: ${pack.nextFocus}` : '',
  ].filter(Boolean).join(' ');
}

type FollowApi = {
  record: (id: string) => FollowRecord | null;
  isOpen: (id: string) => boolean;
  ensure: (id: string) => void;
  setRead: (id: string, text: string) => void;
  setEmail: (id: string, body: string) => void;
  approve: (id: string) => void;
  confirmByHunter: (id: string) => void;
};

const FollowContext = createContext<FollowApi | null>(null);

function seed(): Record<string, FollowRecord> {
  const pack = TECHCORP;
  return {
    'deal-techcorp': {
      status: 'open',
      hoursLeft: 42,
      readText: readText(pack),
      emailBody: pack.emailBody,
    },
  };
}

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<Record<string, FollowRecord>>(seed);

  const record = useCallback((id: string) => records[id] || null, [records]);
  const isOpen = useCallback((id: string) => records[id]?.status === 'open', [records]);

  const ensure = useCallback((id: string) => {
    setRecords((current) => {
      if (current[id]) return current;
      const deal = mockDeals.find((item) => item.id === id);
      if (!deal) return current;
      const pack = packFor(deal);
      return {
        ...current,
        [id]: { status: 'open', hoursLeft: 47, readText: readText(pack), emailBody: pack.emailBody },
      };
    });
  }, []);

  const setRead = useCallback((id: string, text: string) => {
    setRecords((current) => current[id] ? { ...current, [id]: { ...current[id], readText: text } } : current);
  }, []);

  const setEmail = useCallback((id: string, body: string) => {
    setRecords((current) => current[id] ? { ...current, [id]: { ...current[id], emailBody: body } } : current);
  }, []);

  const approve = useCallback((id: string) => {
    setRecords((current) => current[id] ? { ...current, [id]: { ...current[id], status: 'seller-approved', hoursLeft: 0 } } : current);
  }, []);

  const confirmByHunter = useCallback((id: string) => {
    setRecords((current) => current[id] ? { ...current, [id]: { ...current[id], status: 'hunter-confirmed', hoursLeft: 0 } } : current);
  }, []);

  return (
    <FollowContext.Provider value={{ record, isOpen, ensure, setRead, setEmail, approve, confirmByHunter }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const value = useContext(FollowContext);
  if (!value) throw new Error('useFollow must be used within FollowProvider');
  return value;
}
