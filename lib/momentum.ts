import { Deal, DriverId, MomentumDirection } from '@/lib/types/domain';

export type BandId = 'cold' | 'slipping' | 'neutral' | 'gaining' | 'strong';
export type StateId = 'progress' | 'stall' | 'cold';

export const DRIVERS: { id: DriverId; label: string; question: string; color: string }[] = [
  {
    id: 'velocity',
    label: 'Velocity',
    question: 'Is the exchange moving at the pace of a deal that wants to close?',
    color: '#7FB0FF',
  },
  {
    id: 'communication',
    label: 'Communication',
    question: 'Is it getting deeper and more honest, or thinner and more guarded?',
    color: '#C9A0FF',
  },
  {
    id: 'progression',
    label: 'Progression',
    question: 'Did a decision, a person, a date, or a risk actually change?',
    color: '#5BC08D',
  },
];

export const BANDS: { id: BandId; label: string; range: string; hint: string; flex: number }[] = [
  { id: 'cold', label: 'Cold', range: '−100 to −40', hint: 'Dead. No reply in weeks, champion gone, no path forward.', flex: 30 },
  { id: 'slipping', label: 'Slipping', range: '−40 to −10', hint: 'Losing ground. Silence, a shrinking thread, or a risk that will not close.', flex: 15 },
  { id: 'neutral', label: 'Neutral', range: '−10 to +10', hint: 'Going nowhere. Not lost, and not advancing.', flex: 10 },
  { id: 'gaining', label: 'Gaining', range: '+10 to +50', hint: 'Moving toward a decision.', flex: 20 },
  { id: 'strong', label: 'Strong', range: '+50 to +100', hint: 'Ready to close. Verbal commit, several people on the thread, next step booked.', flex: 25 },
];

export function signed(value: number) {
  return `${value > 0 ? '+' : ''}${value}`;
}

export function money(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

export function stageLabel(stage: string) {
  return stage.replace(/-/g, ' ');
}

export function bandOf(score: number): BandId {
  if (score <= -40) return 'cold';
  if (score < -10) return 'slipping';
  if (score <= 10) return 'neutral';
  if (score < 50) return 'gaining';
  return 'strong';
}

export function bandMeta(score: number) {
  return BANDS.find((band) => band.id === bandOf(score)) || BANDS[2];
}

export function directionOf(score: number): MomentumDirection {
  if (score > 10) return 'gaining';
  if (score < -10) return 'losing';
  return 'holding';
}

export function dealState(deal: Pick<Deal, 'momentum' | 'history'>): { state: StateId; label: string } {
  if (deal.momentum <= -40) return { state: 'cold', label: 'Cold' };
  const previous = deal.history.length > 1 ? deal.history[deal.history.length - 2] : deal.momentum;
  const delta = deal.momentum - previous;
  if (deal.momentum < -10) return { state: 'stall', label: 'Needs attention' };
  if (deal.momentum <= 10 || delta < 0) return { state: 'stall', label: 'Stalling' };
  return { state: 'progress', label: 'Progressing' };
}

export function interpret(score: number, history: number[]) {
  const band = bandOf(score);
  const previous = history.length > 1 ? history[history.length - 2] : score;
  const delta = score - previous;
  if (band === 'cold') return 'Cold.';
  if (band === 'slipping') return delta < 0 ? 'Slipping — and the gaps are widening.' : 'Slipping.';
  if (band === 'neutral') return 'Neutral. Going nowhere.';
  if (band === 'strong') return delta > 0 ? 'Strong — and still moving.' : 'Strong.';
  if (delta >= 8) return 'Gaining — and accelerating.';
  if (delta > 0) return 'Gaining.';
  if (delta < 0) return 'Gaining, but the last reading dipped.';
  return 'Gaining, and holding this level.';
}

export function since(history: number[]) {
  if (history.length < 2) return 'First reading on this deal.';
  const delta = history[history.length - 1] - history[0];
  if (delta === 0) return 'Flat across these readings.';
  if (delta > 0) return `Up ${signed(delta)} across these readings.`;
  return `Down ${Math.abs(delta)} across these readings.`;
}

export function driverPoints(deal: Deal, id: DriverId) {
  return deal.drivers.find((driver) => driver.id === id)?.points ?? 0;
}

export function bookNet(deals: Deal[]) {
  const value = deals.reduce((sum, deal) => sum + deal.value, 0);
  const empty = DRIVERS.map((driver) => ({ id: driver.id, points: 0 }));
  if (!value || deals.length === 0) {
    return { score: 0, drivers: empty, history: [0], delta: 0 };
  }

  const raw = DRIVERS.map((driver) => {
    const exact = deals.reduce((sum, deal) => sum + driverPoints(deal, driver.id) * deal.value, 0) / value;
    return { id: driver.id, exact };
  });
  const score = Math.round(raw.reduce((sum, part) => sum + part.exact, 0));
  const floors = raw.map((part) => {
    const points = Math.floor(part.exact);
    return { id: part.id, points, frac: part.exact - points };
  });
  let used = floors.reduce((sum, part) => sum + part.points, 0);
  let guard = 0;
  while (used !== score && guard < 12) {
    const rising = used < score;
    const pool = [...floors].sort((a, b) => rising ? b.frac - a.frac : a.frac - b.frac);
    const target = pool[guard % pool.length];
    const step = rising ? 1 : -1;
    target.points += step;
    used += step;
    guard += 1;
  }
  if (used !== score) {
    throw new Error(`Book momentum parts ${floors.map((part) => part.points).join(', ')} do not add up to ${score}`);
  }

  const length = Math.max(...deals.map((deal) => deal.history.length));
  const history = Array.from({ length }, (_, index) => {
    const exact = deals.reduce((sum, deal) => {
      const reading = deal.history[Math.min(index, deal.history.length - 1)];
      return sum + reading * deal.value;
    }, 0) / value;
    return Math.round(exact);
  });
  history[history.length - 1] = score;
  const delta = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0;

  return {
    score,
    drivers: DRIVERS.map((driver) => ({ id: driver.id, points: floors.find((part) => part.id === driver.id)!.points })),
    history,
    delta,
  };
}

export function inBand(score: number, band: BandId) {
  return bandOf(score) === band;
}

export function prepHref(id: string) {
  if (id === 'deal-techcorp') return '/console?meeting=techcorp-am';
  if (id === 'deal-acme') return '/console?meeting=acme-tm';
  if (id === 'deal-northwind') return '/console?meeting=northwind-tm';
  return '/console';
}

export function dealAnswer(deal: Deal, question: string) {
  const text = question.toLowerCase();
  const exact = deal.prompts.find((prompt) => prompt.q.toLowerCase() === text);
  if (exact) return exact.a;

  const focused = DRIVERS.find((driver) => text.includes(driver.label.toLowerCase()) || text.includes(driver.id));
  if (focused) {
    const driver = deal.drivers.find((item) => item.id === focused.id)!;
    return `${focused.label} is ${signed(driver.points)} of the ${signed(deal.momentum)} reading. ${driver.reason} ${focused.question}`;
  }

  if (text.includes('stage') || text.includes('crm')) {
    return `${deal.company.name} sits in ${stageLabel(deal.stage)} in the CRM. That stage is not part of momentum. The reading is ${signed(deal.momentum)} because ${deal.drivers.map((driver) => `${driver.id} ${signed(driver.points)}`).join(', ')}. Those three parts are the whole number.`;
  }

  if (text.includes('next') || text.includes('do') || text.includes('move') || text.includes('should')) {
    return deal.actionReason
      ? `${deal.actionReason} ${deal.primaryPattern ? deal.primaryPattern.recommendedAction : ''}`.trim()
      : `${deal.why} Nothing new has to be invented. The next change has to show up in velocity, communication, or progression.`;
  }

  const sum = deal.drivers.map((driver) => signed(driver.points)).join(' + ');
  return `${deal.company.name} is ${interpret(deal.momentum, deal.history)} ${deal.why} ${deal.drivers.map((driver) => `${driver.id[0].toUpperCase()}${driver.id.slice(1)} ${signed(driver.points)}: ${driver.reason}`).join(' ')} ${sum} = ${signed(deal.momentum)}.`;
}
