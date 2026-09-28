import {
  Company,
  Contact,
  Deal,
  Interaction,
  Pattern,
  NeedsYouItem,
  PerformanceMetric,
  TeachStep,
  ProductConfig,
  CompanyProfile
} from '@/lib/types/domain';

// Piloteer (our company)
export const piloteerCompany: Company = {
  id: 'piloteer',
  name: 'Piloteer',
  website: 'https://piloteer.ai',
  industry: 'Sales Technology',
};

// Primary buyer: TechCorp Global (fictional enterprise)
export const techCorpCompany: Company = {
  id: 'techcorp',
  name: 'TechCorp Global',
  website: 'https://techcorpglobal.com',
  industry: 'Enterprise Software',
};

// Secondary accounts (for dashboard context)
export const acmeEurope: Company = {
  id: 'acme-europe',
  name: 'Acme Europe',
  industry: 'Manufacturing',
};

export const globexCorp: Company = {
  id: 'globex',
  name: 'Globex',
  industry: 'Technology',
};

// TechCorp buying committee
export const techCorpContacts: Contact[] = [
  {
    id: 'tc-sarah',
    name: 'Sarah Chen',
    title: 'VP of Revenue Operations',
    company: 'TechCorp Global',
    email: 'sarah.chen@techcorpglobal.com',
    linkedIn: 'https://linkedin.com/in/sarahchen',
    isExternal: true,
    personalContext: [
      {
        detail: 'Previously scaled sales ops at a Series C SaaS company',
        source: 'public-profile',
        verified: true,
      },
      {
        detail: 'Mentioned implementing Salesforce Einstein last year with mixed results',
        source: 'prior-interaction',
        verified: true,
      },
    ],
  },
  {
    id: 'tc-james',
    name: 'James Park',
    title: 'CRO',
    company: 'TechCorp Global',
    email: 'james.park@techcorpglobal.com',
    isExternal: true,
    personalContext: [
      {
        detail: 'Coached college basketball; values team performance over individual metrics',
        source: 'public-profile',
        verified: true,
      },
    ],
  },
  {
    id: 'tc-maria',
    name: 'Maria Rodriguez',
    title: 'Director of Sales Enablement',
    company: 'TechCorp Global',
    email: 'maria.rodriguez@techcorpglobal.com',
    isExternal: true,
  },
  {
    id: 'tc-david',
    name: 'David Kim',
    title: 'IT Security Lead',
    company: 'TechCorp Global',
    email: 'david.kim@techcorpglobal.com',
    isExternal: true,
    personalContext: [
      {
        detail: 'Concerned about SOC 2 compliance and data handling for live call sensing',
        source: 'prior-interaction',
        verified: true,
      },
    ],
  },
];

// Deals in pipeline (Piloteer's rep perspective)
export const sellers = [
  {
    id: 'emma' as const,
    name: 'Emma Dixon',
    role: 'Sales rep',
    initials: 'ED',
    focus: 'Permission-based discovery is showing up on the deals that are moving.',
  },
  {
    id: 'noah' as const,
    name: 'Noah Adler',
    role: 'Sales rep',
    initials: 'NA',
    focus: 'Deployment questions are still getting feature answers. Two deals are losing ground.',
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-techcorp',
    company: techCorpCompany,
    value: 180000,
    stage: 'technical-validation',
    momentum: 32,
    momentumDirection: 'gaining',
    momentumChangeLastWeek: 18,
    ownerId: 'emma',
    segment: 'enterprise',
    why: 'Security cleared. Sarah named the board timeline.',
    history: [8, 12, 14, 22, 28, 32],
    drivers: [
      { id: 'velocity', points: 12, reason: 'Sarah replied the same day. The board conversation is the next step they are trying to date.' },
      { id: 'communication', points: 14, reason: 'David and Maria are on the thread. The language moved from “if we can deploy” to “how we roll this out.”' },
      { id: 'progression', points: 6, reason: 'Security review cleared. The executive date is still open, which keeps this short of Strong.' },
    ],
    prompts: [
      { q: 'Why is TechCorp gaining?', a: 'Security finished early and Sarah named board timing. Velocity is +12 and communication is +14. Progression is only +6 because the executive date is not booked yet. 12 + 14 + 6 = +32.' },
      { q: 'What would make this Strong?', a: 'A written executive conversation inside their board cycle. That is a dated state change. Warm language alone will not get it there.' },
      { q: 'What is still open?', a: 'The presentation date, whether the pilot is the full sales team or a subset, and the Salesforce integration timeline.' },
    ],
    needsAction: true,
    actionReason: 'Confirm the security sign-off in writing, then book the executive conversation inside their board cycle.',
    primaryPattern: {
      id: 'pattern-implementation-risk',
      type: 'buyer',
      pattern: 'Implementation concerns shifting from technical feasibility to organizational change management',
      meaning: 'Buyer focus moved from "Can we deploy this?" to "How do we roll this out effectively?" — indicates technical validation passed',
      evidence: {
        level: 'supported',
        interactions: 4,
        details: [
          'Security lead stopped asking compliance questions',
          'Enablement director asked about training timelines three times',
          'Champion mentioned "getting buy-in from the sales floor"',
        ],
      },
      impact: 'progression',
      recommendedAction: 'Introduce customer success team; share rollout timeline for similar enterprise deployments',
    },
  },
  {
    id: 'deal-acme',
    company: acmeEurope,
    value: 95000,
    stage: 'proposal',
    momentum: -12,
    momentumDirection: 'losing',
    momentumChangeLastWeek: -8,
    ownerId: 'noah',
    segment: 'enterprise',
    why: 'EU hosting is still open. Replies are slowing.',
    history: [6, 4, 1, -4, -9, -12],
    drivers: [
      { id: 'velocity', points: -8, reason: 'Replies have slowed against Acme’s own pace. No next step is on the calendar.' },
      { id: 'communication', points: -6, reason: 'The thread is back to one person. Lena is hedging instead of naming a date.' },
      { id: 'progression', points: 2, reason: 'The proposal is still the last real artifact. The EU hosting risk is open, not retired.' },
    ],
    prompts: [
      { q: 'Why is Acme slipping?', a: 'Velocity is −8 and communication is −6. The EU hosting question has sat for three weeks, and nothing is booked next. Progression is only +2 because the proposal itself did not move. −8 + −6 + +2 = −12.' },
      { q: 'What should Noah do on the next call?', a: 'Answer the rollout question with a customer story, then put a dated step on the calendar. A better call does not create EU hosting. That risk has to be escalated.' },
      { q: 'Is this the CRM stage?', a: 'No. The CRM card says Proposal. Momentum is −12 because the buyer went quieter and the risk stayed open. Stage and momentum sit side by side.' },
    ],
    needsAction: true,
    actionReason: 'Coach the rollout story, book a dated next step, and escalate EU hosting. The call cannot invent a product path.',
  },
  {
    id: 'deal-globex',
    company: globexCorp,
    value: 120000,
    stage: 'proposal',
    momentum: 8,
    momentumDirection: 'holding',
    momentumChangeLastWeek: 2,
    ownerId: 'emma',
    segment: 'mid-market',
    why: 'Cadence is unchanged. Still one thread.',
    history: [4, 6, 7, 8, 8, 8],
    drivers: [
      { id: 'velocity', points: 2, reason: 'Reply time matches Globex’s own baseline. Nothing has sped up or stalled.' },
      { id: 'communication', points: 5, reason: 'They volunteered a pricing constraint. No new person has joined the thread.' },
      { id: 'progression', points: 1, reason: 'The proposal is out. No new document, date, or decision landed this week.' },
    ],
    prompts: [
      { q: 'Why is Globex neutral?', a: 'It is +8, inside the neutral band. Velocity +2, communication +5, progression +1. The exchange is polite and it is not advancing.' },
      { q: 'What would move Globex?', a: 'A named reviewer or a date for a decision. Another proposal recap will not change progression.' },
    ],
    needsAction: false,
  },
  {
    id: 'deal-midway',
    company: { id: 'midway', name: 'Midway Healthcare', industry: 'Healthcare', website: 'https://midwayhealth.example' },
    value: 78000,
    stage: 'discovery',
    momentum: -28,
    momentumDirection: 'losing',
    momentumChangeLastWeek: -15,
    ownerId: 'noah',
    segment: 'mid-market',
    why: 'No new stakeholder in three weeks. Timeline slipped.',
    history: [10, 4, -2, -12, -20, -28],
    drivers: [
      { id: 'velocity', points: -12, reason: 'The gaps between conversations are wider than Midway’s own early pace.' },
      { id: 'communication', points: -10, reason: 'The buyer mentioned alternatives and did not name them. Disclosure got thinner.' },
      { id: 'progression', points: -6, reason: 'The timeline slipped. No decision, person, or date was added.' },
    ],
    prompts: [
      { q: 'Why does Midway need attention?', a: 'All three parts are negative: velocity −12, communication −10, progression −6. That is −28. The thread did not grow, and the last conversations did not produce a step.' },
      { q: 'What is the next question?', a: 'Ask which alternatives are in the evaluation, and who else has to see the answer. A feature walkthrough is what stalled the last call.' },
    ],
    needsAction: true,
    actionReason: 'Ask which alternatives are being evaluated, and who else owns the decision.',
  },
  {
    id: 'deal-helios',
    company: { id: 'helios', name: 'Helios Bank', industry: 'Financial Services', website: 'https://heliosbank.example' },
    value: 210000,
    stage: 'negotiation',
    momentum: 41,
    momentumDirection: 'gaining',
    momentumChangeLastWeek: 9,
    ownerId: 'emma',
    segment: 'enterprise',
    why: 'Friday committee is dated. The success plan is still open.',
    history: [18, 22, 27, 33, 38, 41],
    drivers: [
      { id: 'velocity', points: 14, reason: 'Replies are inside Helios’s usual window, and Friday is a real date.' },
      { id: 'communication', points: 15, reason: 'The economic buyer is using ownership language, not “if we look at this.”' },
      { id: 'progression', points: 12, reason: 'They asked for a written success plan before the committee. The artifact is requested and not sent.' },
    ],
    prompts: [
      { q: 'Why is Helios gaining?', a: 'Velocity +14, communication +15, progression +12. The committee date is real, and they asked for a document. +41 stays in Gaining until that plan is in their hands.' },
      { q: 'What is the open commitment?', a: 'Emma said she would send a one-page success plan before Friday. Until it is sent, progression cannot move to a closed step.' },
    ],
    needsAction: true,
    actionReason: 'Send the one-page success plan and ask them to put it on Friday’s committee agenda.',
  },
  {
    id: 'deal-northwind',
    company: { id: 'northwind', name: 'Northwind Logistics', industry: 'Logistics', website: 'https://northwind.example' },
    value: 64000,
    stage: 'discovery',
    momentum: 18,
    momentumDirection: 'gaining',
    momentumChangeLastWeek: 6,
    ownerId: 'emma',
    segment: 'mid-market',
    why: 'Tomorrow’s call is booked. The goal is still blank.',
    history: [0, 4, 9, 12, 16, 18],
    drivers: [
      { id: 'velocity', points: 11, reason: 'The second call is on the calendar for tomorrow. That is faster than the first gap.' },
      { id: 'communication', points: 8, reason: 'Omar named the warehouse rollout worry out loud.' },
      { id: 'progression', points: -1, reason: 'The step is booked and the goal is blank, so the deal has not actually advanced.' },
    ],
    prompts: [
      { q: 'Why isn’t the booked call enough?', a: 'Velocity is +11 because tomorrow is on the calendar. Progression is −1 because the goal is blank. A meeting without an outcome is tempo, not a state change. 11 + 8 + −1 = +18.' },
      { q: 'What should the goal be?', a: 'Agree which site would pilot, and who owns the rollout. That gives the call a decision and a person.' },
    ],
    needsAction: true,
    actionReason: 'Set the goal before tomorrow: which site pilots, and who owns the rollout.',
  },
  {
    id: 'deal-brightline',
    company: { id: 'brightline', name: 'Brightline Retail', industry: 'Retail', website: 'https://brightline.example' },
    value: 54000,
    stage: 'discovery',
    momentum: 2,
    momentumDirection: 'holding',
    momentumChangeLastWeek: 0,
    ownerId: 'noah',
    segment: 'mid-market',
    why: 'Warm, and not advancing.',
    history: [1, 2, 2, 3, 2, 2],
    drivers: [
      { id: 'velocity', points: 0, reason: 'Response time matches Brightline’s own norm. No next step is booked.' },
      { id: 'communication', points: 3, reason: 'The tone is warm. It is still a single contact.' },
      { id: 'progression', points: -1, reason: 'Discovery repeated the same topics. No decision, person, or date.' },
    ],
    prompts: [
      { q: 'Why is Brightline neutral?', a: 'It is +2. Communication +3 is warmth. Velocity is 0 and progression is −1. Warm and stuck are different things. 0 + 3 + −1 = +2.' },
      { q: 'What would count as progress?', a: 'A second person on the thread, or a date for a working session. Another friendly discovery call will leave the reading here.' },
    ],
    needsAction: false,
  },
];

mockDeals.forEach((deal) => {
  const sum = deal.drivers.reduce((total, driver) => total + driver.points, 0);
  if (sum !== deal.momentum) {
    throw new Error(`${deal.id} drivers add up to ${sum}, not ${deal.momentum}`);
  }
  if (deal.history[deal.history.length - 1] !== deal.momentum) {
    throw new Error(`${deal.id} history does not end on ${deal.momentum}`);
  }
});

export const bookEvents = [
  { id: 'evt-security', at: 32, label: 'Sep 13', detail: 'TechCorp security review finished early. The book turned up.' },
  { id: 'evt-acme', at: 58, label: 'Sep 18', detail: 'Acme asked about EU hosting again. No answer landed. Momentum slipped.' },
  { id: 'evt-board', at: 82, label: 'Sep 25', detail: 'Sarah Chen named the board timeline. TechCorp kept gaining.' },
];

// Mock interactions
export const upcomingInteraction: Interaction = {
  id: 'int-techcorp-next',
  dealId: 'deal-techcorp',
  company: techCorpCompany,
  date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  callType: 'technical-validation',
  sellerRole: 'leading',
  goal: 'Confirm security requirements are met; introduce customer success timeline; secure commitment to executive presentation',
  contacts: [techCorpContacts[0], techCorpContacts[3]],
  prepStatus: 'prepared',
  hunterRead: {
    currentMomentum: 32,
    momentumDirection: 'gaining',
    whatChanged: 'Security lead completed SOC 2 audit review; champion mentioned timeline pressure from board',
    buyerCaresAbout: [
      'Proving ROI to board within 90 days',
      'Smooth rollout without disrupting Q4 pipeline',
      'Sales team adoption and training',
    ],
    unresolved: [
      'Executive presentation date',
      'Pilot scope: full sales team or subset?',
      'Integration timeline with existing Salesforce instance',
    ],
    commitments: [
      'Sarah to review security documentation by end of week',
      'David to provide final compliance sign-off',
    ],
    patterns: [
      {
        id: 'pattern-buyer-urgency',
        type: 'buyer',
        pattern: 'Champion mentions board pressure and Q4 timeline repeatedly',
        meaning: 'External forcing function creating urgency; champion needs ammunition to accelerate internal process',
        evidence: {
          level: 'observed',
          interactions: 3,
        },
        impact: 'progression',
        recommendedAction: 'Frame next steps around board timeline; offer executive briefing materials',
      },
    ],
    personalContext: [
      {
        detail: 'Sarah mentioned her team struggled with Einstein adoption last year',
        source: 'prior-interaction',
        verified: true,
      },
      {
        detail: "David's security review typically takes 2 weeks but completed in 5 days this time",
        source: 'prior-interaction',
        verified: true,
      },
    ],
  },
};

// Patterns across deals
export const sellerPatterns: Pattern[] = [
  {
    id: 'seller-1',
    type: 'seller',
    pattern: 'Asking "What concerns do you have?" early in discovery surfaces buyer-specific objections proactively',
    meaning: 'Early permission-based inquiry surfaces real blockers before they become silent deal-killers',
    evidence: {
      level: 'supported',
      interactions: 24,
      details: [
        'TechCorp Global: surfaced security concern in first call (typically surfaces week 3)',
        'Globex: buyer volunteered pricing constraints proactively',
        'Eight of nine recent deals where used: buyer shared unscripted concern',
      ],
    },
    impact: 'progression',
    recommendedAction: 'Continue using in every discovery call; consider teaching team',
    affectedDeals: 9,
    affectedValue: 650000,
  },
  {
    id: 'seller-2',
    type: 'seller',
    pattern: 'Responding to implementation questions with feature explanations instead of deployment examples',
    meaning: 'Buyer asking "how" wants proof of feasibility, not product education — technical answers to deployment questions slow momentum',
    evidence: {
      level: 'supported',
      interactions: 7,
      details: [
        'Acme Europe: repeated "how does this work with our team?" three times; momentum dropped after feature walkthrough',
        'Midway Healthcare: similar pattern; buyer engagement fell after demo',
      ],
    },
    impact: 'stall',
    recommendedAction: 'When buyer asks deployment questions, share customer rollout example instead of product capabilities',
    affectedDeals: 3,
    affectedValue: 245000,
  },
];

export const buyerPatterns: Pattern[] = [
  {
    id: 'buyer-1',
    type: 'buyer',
    pattern: 'Security and compliance questions resolve faster when IT lead is invited early',
    meaning: 'Delaying IT involvement pushes risk conversation to late stage when it has more power to stall',
    evidence: {
      level: 'validated',
      interactions: 18,
      details: [
        'TechCorp Global: IT invited call 2; security resolved by call 5',
        'Prior deals with late IT: weeks-long delays observed',
      ],
    },
    impact: 'progression',
    recommendedAction: 'Ask champion to include IT contact by second call',
    affectedDeals: 6,
    affectedValue: 520000,
  },
];

export const buyerSellerPatterns: Pattern[] = [
  {
    id: 'bs-1',
    type: 'buyer-seller',
    pattern: 'When buyer shares concern → seller acknowledges without defending → buyer provides more context → momentum increases',
    meaning: 'Defensive responses close buyer sharing; acknowledgment opens it',
    evidence: {
      level: 'supported',
      interactions: 15,
      details: [
        'TechCorp: Emma acknowledged the adoption worry. Sarah then named the sales-floor concern.',
        'Acme: a feature walkthrough followed the rollout question. The buyer went quiet.',
        'Midway: the same sequence. Engagement fell after the explanation.',
      ],
    },
    impact: 'progression',
    recommendedAction: 'Practice: "That makes sense" + clarifying question before addressing concern',
    affectedDeals: 8,
  },
];

export const marketPatterns: Pattern[] = [
  {
    id: 'market-1',
    type: 'market',
    pattern: 'Enterprise buyers frequently mention "AI fatigue" and "tool sprawl" concerns in discovery',
    meaning: 'Market saturation concern requires differentiation as performance system, not another AI point solution',
    evidence: {
      level: 'validated',
      interactions: 12,
      details: [
        'TechCorp Global: "We already tried Einstein"',
        'Globex: "How is this different from Gong?"',
        'Acme Europe: "Our team is overwhelmed with new tools"',
      ],
    },
    impact: 'stall',
    recommendedAction: 'Lead with performance outcomes, not AI capabilities; position as layer on existing stack',
    affectedDeals: 12,
    affectedValue: 980000,
  },
];

// Needs You queue
export const needsYouItems: NeedsYouItem[] = [
  {
    id: 'ny-1',
    type: 'follow-through',
    deal: mockDeals[0],
    reason: 'TechCorp Global follow-up from security review call awaiting your approval',
    whatHunterSees: 'David (IT Security) confirmed SOC 2 compliance; Sarah asked about rollout timeline; both expressed readiness to move forward',
    recommendedAction: 'Review and approve follow-up email with executive presentation proposal',
    priority: 1,
  },
  {
    id: 'ny-2',
    type: 'prep-needed',
    deal: mockDeals[1],
    reason: 'Acme Europe follow-on call tomorrow needs preparation',
    whatHunterSees: 'Last interaction momentum dropped; EU data residency blocker still unresolved; champion engagement declining',
    recommendedAction: 'Prep with updated data residency solution; plan to re-engage champion',
    priority: 2,
  },
  {
    id: 'ny-3',
    type: 'missing-context',
    deal: mockDeals[3],
    reason: 'Midway Healthcare competitive intelligence needed',
    whatHunterSees: 'Buyer mentioned "evaluating alternatives" in last call but did not specify; timeline extending',
    recommendedAction: 'Ask champion which alternatives and what criteria matter most',
    priority: 3,
  },
  {
    id: 'ny-4',
    type: 'commitment',
    deal: mockDeals.find((deal) => deal.id === 'deal-helios')!,
    reason: 'Helios Bank is waiting on a success plan you said you would send',
    whatHunterSees: 'The economic buyer repeated the Friday committee date. The commitment is still open.',
    recommendedAction: 'Send the one-page success plan and ask them to put it on the committee agenda',
    priority: 4,
  },
  {
    id: 'ny-5',
    type: 'prep-needed',
    deal: mockDeals.find((deal) => deal.id === 'deal-northwind')!,
    reason: 'Northwind Logistics tomorrow is still missing a goal',
    whatHunterSees: 'First call surfaced a warehouse rollout worry. Hunter can prep the follow-on, but the goal is blank.',
    recommendedAction: 'Set the goal: agree which site would pilot, and who owns the rollout',
    priority: 5,
  },
];

export const hunterDirectory = [
  { kind: 'company' as const, id: 'techcorp', name: 'TechCorp Global', meta: 'Follow-on · technical validation', firstCall: false },
  { kind: 'company' as const, id: 'acme-europe', name: 'Acme Europe', meta: 'Follow-on · proposal', firstCall: false },
  { kind: 'company' as const, id: 'globex', name: 'Globex', meta: 'Follow-on · proposal', firstCall: false },
  { kind: 'company' as const, id: 'midway', name: 'Midway Healthcare', meta: 'Follow-on · discovery', firstCall: false },
  { kind: 'company' as const, id: 'helios', name: 'Helios Bank', meta: 'Follow-on · negotiation', firstCall: false },
  { kind: 'company' as const, id: 'northwind', name: 'Northwind Logistics', meta: 'Follow-on · discovery', firstCall: false },
  { kind: 'company' as const, id: 'brightline', name: 'Brightline Retail', meta: 'Follow-on · discovery', firstCall: false },
  { kind: 'contact' as const, id: 'tc-sarah', name: 'Sarah Chen', meta: 'VP RevOps · TechCorp Global', companyId: 'techcorp', firstCall: false },
  { kind: 'contact' as const, id: 'tc-david', name: 'David Kim', meta: 'IT Security · TechCorp Global', companyId: 'techcorp', firstCall: false },
  { kind: 'contact' as const, id: 'tc-james', name: 'James Park', meta: 'CRO · TechCorp Global', companyId: 'techcorp', firstCall: false },
  { kind: 'contact' as const, id: 'acme-lena', name: 'Lena Vogel', meta: 'VP Operations · Acme Europe', companyId: 'acme-europe', firstCall: false },
  { kind: 'contact' as const, id: 'nw-omar', name: 'Omar Shah', meta: 'Director of Ops · Northwind', companyId: 'northwind', firstCall: false },
];

// Performance metrics
export const performanceMetrics: PerformanceMetric = {
  momentsIdentified: 47,
  guidanceActioned: 32,
  buyerResponsesChanged: 24,
  momentumChanged: 18,
};

// Teach Hunter steps (Sales Configuration from BUILD-BRIEF)
export const teachSteps: TeachStep[] = [
  // Products group
  { id: '1', title: 'How many products?', completed: true },
  
  // Per-product: Hunter
  { id: '2', title: 'Product 1: About', completed: true },
  { id: '3', title: 'Product 1: Personas', completed: true },
  { id: '4', title: 'Product 1: Key Signals', completed: true },
  { id: '5', title: 'Product 1: Key Objectives', completed: true },
  { id: '6', title: 'Product 1: Differentiators', completed: true },
  { id: '7', title: 'Product 1: Objections & Counters', completed: true },
  { id: '8', title: 'Product 1: Competitive Landscape', completed: false },
  { id: '9', title: 'Product 1: Market Info', completed: false },
  
  // Company
  { id: '10', title: 'Company Overview', completed: false },
  { id: '11', title: 'Deal Stages', completed: false },
  { id: '12', title: 'Sales Framework', completed: false },
  { id: '13', title: 'Integrations', completed: false },
];

export const mockProductConfig: ProductConfig = {
  id: 'hunter',
  name: 'Hunter',
  about: 'Real-time sales performance system that provides private guidance during live customer interactions',
  personas: ['CRO', 'VP Revenue Operations', 'VP Sales Enablement', 'Sales Managers'],
  keySignals: [
    'Mentions of AI tool fatigue',
    'Concern about rep performance consistency',
    'Interest in real-time coaching vs post-call review',
    'Security and compliance questions about live call sensing',
  ],
  keyObjectives: [
    'Improve deal momentum across the team',
    'Scale best-seller behaviors to entire team',
    'Reduce time to productivity for new reps',
    'Evidence-based coaching for managers',
  ],
  differentiators: [
    'Real-time guidance during calls (not post-call analysis)',
    'Private seller tips (not surveillance)',
    'Behavioral science foundation',
    'Evidence-labeled intelligence',
  ],
  objections: [
    { objection: 'How is this different from Gong/Chorus?', counter: 'Gong records and analyzes after. Hunter guides during. Complementary, not competitive.' },
    { objection: 'Our team will feel surveilled', counter: 'Hunter tips are private to the seller. Managers see patterns and evidence, never live tips or recordings.' },
    { objection: 'We already have Salesforce Einstein', counter: 'Hunter ingests Einstein signals as context to make tips more relevant. Adds real-time layer on your existing stack.' },
  ],
  competitiveLandscape: ['Gong', 'Chorus', 'Salesforce Einstein', 'Clari'],
};

export const mockCompanyProfile: CompanyProfile = {
  companyOverview: 'Piloteer builds sales performance systems. We sell Hunter to revenue leaders who want their teams to perform like their best sellers.',
  dealStages: ['Discovery', 'Technical Validation', 'Proposal', 'Negotiation', 'Closed Won'],
  salesFramework: 'MEDDPICC with emphasis on Champion and Decision Process',
  integrations: ['Salesforce', 'HubSpot', 'Google Calendar', 'Microsoft Teams', 'Zoom'],
};
