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
export const mockDeals: Deal[] = [
  {
    id: 'deal-techcorp',
    company: techCorpCompany,
    value: 180000,
    stage: 'technical-validation' as any,
    momentum: 32,
    momentumDirection: 'gaining',
    momentumChangeLastWeek: 18,
    needsAction: true,
    actionReason: 'Security review completed; champion ready to present to economic buyer',
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
    needsAction: true,
    actionReason: 'EU data residency blocker unresolved; champion engagement declining',
  },
  {
    id: 'deal-globex',
    company: globexCorp,
    value: 120000,
    stage: 'proposal',
    momentum: 8,
    momentumDirection: 'holding',
    momentumChangeLastWeek: 2,
    needsAction: false,
  },
  {
    id: 'deal-midway',
    company: { id: 'midway', name: 'Midway Healthcare', industry: 'Healthcare' },
    value: 78000,
    stage: 'discovery',
    momentum: -28,
    momentumDirection: 'losing',
    momentumChangeLastWeek: -15,
    needsAction: true,
    actionReason: 'Timeline slipping; no new stakeholders introduced in three weeks',
  },
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
    pattern: 'Asking "What concerns do you have?" early in discovery increases buyer-specific objection sharing by 3.2x',
    meaning: 'Early permission-based inquiry surfaces real blockers before they become silent deal-killers',
    evidence: {
      level: 'validated',
      interactions: 24,
      details: [
        'TechCorp: surfaced security concern in first call vs typical week 3',
        'Globex: buyer volunteered pricing constraints proactively',
        '8 of 9 recent deals where used: buyer shared unscripted concern',
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
        'Acme: repeated "how does this work with our team?" 3x; momentum dropped after feature walkthrough',
        'Midway: similar pattern; buyer engagement fell after demo',
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
        'TechCorp: IT invited call 2; security resolved by call 5',
        'Prior deals with late IT: avg 4.2 week delay',
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
    pattern: 'Enterprise buyers mention "AI fatigue" and "tool sprawl" in 60% of discovery calls',
    meaning: 'Market saturation concern requires differentiation as performance system, not another AI point solution',
    evidence: {
      level: 'validated',
      interactions: 12,
      details: [
        'TechCorp: "We already tried Einstein"',
        'Globex: "How is this different from Gong?"',
        'Acme: "Our team is overwhelmed with new tools"',
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
    reason: 'TechCorp follow-up from security review call awaiting your approval',
    whatHunterSees: 'David (IT Security) confirmed SOC 2 compliance; Sarah asked about rollout timeline; both expressed readiness to move forward',
    recommendedAction: 'Review and approve follow-up email with executive presentation proposal',
    priority: 1,
  },
  {
    id: 'ny-2',
    type: 'prep-needed',
    deal: mockDeals[1],
    reason: 'Acme follow-on call tomorrow needs preparation',
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
];

// Performance metrics
export const performanceMetrics: PerformanceMetric = {
  momentsIdentified: 47,
  guidanceActioned: 32,
  buyerResponsesChanged: 24,
  momentumChanged: 18,
};

// Teach Hunter steps (for onboarding)
export const teachSteps: TeachStep[] = [
  { id: '1', title: 'How many products does your team sell?', completed: true },
  { id: '2', title: 'Tell us about Hunter (Product 1)', completed: true },
  { id: '3', title: 'Who buys Hunter?', completed: true },
  { id: '4', title: 'Key signals that matter', completed: true },
  { id: '5', title: 'Sales objectives for Hunter', completed: true },
  { id: '6', title: 'What makes Hunter different?', completed: true },
  { id: '7', title: 'Common objections', completed: true },
  { id: '8', title: 'Competitive landscape', completed: false },
  { id: '9', title: 'Market intelligence', completed: false },
  { id: '10', title: 'Company profile', completed: false },
  { id: '11', title: 'Deal stages', completed: false },
  { id: '12', title: 'Sales framework', completed: false },
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
