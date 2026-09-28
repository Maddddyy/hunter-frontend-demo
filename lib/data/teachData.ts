import {
  TeachState,
  ProductTeach,
  CompanyContact,
} from '@/lib/types/teach';

export function blankContact(id: string): CompanyContact {
  return { id, name: '', role: '', email: '' };
}

export function blankProduct(id: string): ProductTeach {
  return {
    id,
    name: '',
    sources: [],
    description: '',
    personas: [],
    keyQuestions: [],
    keyObjectives: [],
    differentiators: [],
    objections: [],
    competitors: [],
    comparisonAdvantages: [],
    buyerEnvironment: [],
    companyProductEnvironment: [],
    dealEnvironmentSignals: [],
    draftGenerated: false,
    completedSections: {
      about: false,
      personas: false,
      keySignals: false,
      competitive: false,
      marketInfo: false,
    },
  };
}

export function sampleCommanderProduct(): ProductTeach {
  return {
    id: 'commander',
    name: 'Commander',
    sample: true,
    sources: [
      { id: 'src-cmd-1', type: 'file', name: 'Commander overview.pdf', size: '1.9 MB' },
      { id: 'src-cmd-2', type: 'url', name: 'piloteer.ai/commander', url: 'https://piloteer.ai/commander' },
    ],
    description: 'Commander shows sales leaders which deals need them, and why, before the quarter slips.',
    personas: [
      { id: 'p1', name: 'Chief Revenue Officer', role: 'Economic buyer', notes: 'Needs an early read on which deals will miss, without another dashboard.' },
      { id: 'p2', name: 'VP of Sales', role: 'Primary user', notes: 'Wants coaching time on the deals that can still move.' },
      { id: 'p3', name: 'Head of Sales Operations', role: 'Implementer', notes: 'Will block anything that adds a reporting system to maintain.' },
    ],
    keyQuestions: [
      'Which deals need you this week?',
      'What slipped last quarter that you could have seen earlier?',
    ],
    keyObjectives: [
      'Fewer forecast surprises',
      'Coaching time on deals that can still move',
    ],
    differentiators: [
      { id: 'd1', they: 'Show last quarter’s numbers', we: 'Show which live deals need a move today' },
    ],
    objections: [
      { id: 'o1', objection: 'We already have Clari.', counter: 'Clari is the scoreboard. Commander is the play you run next.' },
    ],
    competitors: [
      { id: 'c1', name: 'Clari', profile: 'Forecast roll-ups and deal scores. Strong at reporting what already happened.' },
    ],
    comparisonAdvantages: [
      { id: 'ca1', ourAdvantage: 'Tells the leader where to intervene, not only how the forecast rolled up.', competitorName: 'Clari' },
    ],
    buyerEnvironment: [
      { id: 'be1', signal: '“We were surprised when that deal slipped.”' },
    ],
    companyProductEnvironment: [
      { id: 'cp1', signal: 'Managers spend the week in pipeline meetings and still don’t know where to coach.' },
    ],
    dealEnvironmentSignals: [
      { id: 'de1', signal: 'A leader asks how this is different from the dashboard they already pay for.' },
    ],
    draftGenerated: true,
    completedSections: {
      about: true,
      personas: true,
      keySignals: true,
      competitive: true,
      marketInfo: true,
    },
  };
}

export const initialTeachState: TeachState = {
  currentStep: 0,
  companyOverview: {
    industry: '',
    customerSegment: [],
    typicalDealSize: '',
    typicalSalesCycle: '',
    website: '',
    contacts: [blankContact('contact-1')],
  },
  dealStages: [],
  salesFramework: null,
  products: [sampleCommanderProduct()],
  activeProductIndex: 0,
  contradictions: [],
  visibility: {
    sensing: true,
    writeback: false,
    noMonitorCommitment: true,
  },
  goLive: false,
};

export const frameworkDescriptions: Record<string, { name: string; description: string; elements?: string[] }> = {
  challenger: {
    name: 'Challenger Sale',
    description: 'Teach, tailor, and take control of the conversation.',
    elements: ['Teach', 'Tailor', 'Take Control'],
  },
  meddic: {
    name: 'MEDDIC',
    description: 'Qualify metrics, buyer, criteria, process, pain, and champion.',
    elements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Identify Pain', 'Champion'],
  },
  meddpicc: {
    name: 'MEDDPICC',
    description: 'MEDDIC plus paper process and competition.',
    elements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Paper Process', 'Identify Pain', 'Champion', 'Competition'],
  },
  sandler: {
    name: 'Sandler',
    description: 'Pain, budget, and an up-front contract before you advance.',
    elements: ['Bonding & Rapport', 'Up-front Contract', 'Pain', 'Budget', 'Decision'],
  },
  spin: {
    name: 'SPIN Selling',
    description: 'Situation, problem, implication, and need-payoff questions.',
    elements: ['Situation', 'Problem', 'Implication', 'Need-Payoff'],
  },
  'miller-heiman': {
    name: 'Miller Heiman',
    description: 'Map buying influences and the themes that win the deal.',
    elements: ['Blue Sheet', 'Buying Influences', 'Win Themes', 'Ideal Customer Profile'],
  },
  custom: {
    name: 'Custom',
    description: 'Use the methodology your team already runs.',
  },
  none: {
    name: 'None',
    description: 'No formal framework yet.',
  },
};

export const stageTemplates = {
  standard: [
    { id: 'lead', name: 'Lead', description: 'Initial qualification' },
    { id: 'discovery', name: 'Discovery', description: 'Understanding needs' },
    { id: 'proposal', name: 'Proposal', description: 'Solution presentation' },
    { id: 'negotiation', name: 'Negotiation', description: 'Terms and pricing' },
    { id: 'closed-won', name: 'Closed Won', description: 'Deal signed' },
  ],
  enterprise: [
    { id: 'lead', name: 'Lead', description: 'Initial qualification' },
    { id: 'discovery', name: 'Discovery', description: 'Stakeholder mapping and need validation' },
    { id: 'technical-validation', name: 'Technical Validation', description: 'Security, compliance, feasibility' },
    { id: 'proposal', name: 'Proposal', description: 'Solution design and pricing' },
    { id: 'negotiation', name: 'Negotiation', description: 'Contract terms and approval process' },
    { id: 'closed-won', name: 'Closed Won', description: 'Signed and active' },
  ],
  saas: [
    { id: 'lead', name: 'Lead', description: 'Inbound qualification' },
    { id: 'discovery', name: 'Discovery', description: 'Product fit assessment' },
    { id: 'demo', name: 'Demo / Trial', description: 'Product demonstration or trial period' },
    { id: 'proposal', name: 'Proposal', description: 'Pricing and terms' },
    { id: 'closed-won', name: 'Closed Won', description: 'Customer activated' },
  ],
};
