import {
  TeachState,
  ProductTeach,
  Contradiction,
} from '@/lib/types/teach';

// Initial teach state with 2 distinct products
export const initialTeachState: TeachState = {
  currentStep: 0,
  companyOverview: {
    industry: 'Software / SaaS',
    customerSegment: ['enterprise'],
    typicalDealSize: '$100K-$500K',
    typicalSalesCycle: '30-90 days',
  },
  dealStages: [
    { id: 'lead', name: 'Lead', description: 'Initial qualification' },
    { id: 'discovery', name: 'Discovery', description: 'Understanding buyer needs and context' },
    { id: 'technical-validation', name: 'Technical Validation', description: 'Security, compliance, technical feasibility' },
    { id: 'proposal', name: 'Proposal', description: 'Solution design and pricing' },
    { id: 'negotiation', name: 'Negotiation', description: 'Contract terms and commitments' },
    { id: 'closed-won', name: 'Closed Won', description: 'Deal signed and active' },
  ],
  salesFramework: 'meddpicc',
  products: [
    createHunterProduct(),
    createCommanderProduct(),
  ],
  activeProductIndex: 0,
  contradictions: generateContradictions(),
  visibility: {
    sensing: true,
    writeback: false,
    noMonitorCommitment: true,
  },
  goLive: false,
};

function createHunterProduct(): ProductTeach {
  return {
    id: 'hunter',
    name: 'Hunter',
    sources: [
      {
        id: 'src-1',
        type: 'file',
        name: 'Hunter Product Brief.pdf',
        size: '2.4 MB',
      },
      {
        id: 'src-2',
        type: 'url',
        name: 'Product Page',
        url: 'https://piloteer.ai/hunter',
      },
    ],
    description: 'Real-time sales performance system that provides private guidance during live customer interactions. Hunter helps every seller perform like your best sellers by whispering the next best move while the outcome can still change. Built on behavioral science, not surveillance.',
    personas: [
      {
        id: 'p1',
        name: 'Chief Revenue Officer',
        role: 'Economic Buyer',
        notes: 'Cares about predictable revenue growth and scaling best-seller behaviors across the team. Typically asks about ROI evidence, implementation timeline, and how this fits with existing sales tech stack. Concerned about adoption and proving value to board within first 90 days.',
      },
      {
        id: 'p2',
        name: 'VP of Revenue Operations',
        role: 'Champion / Technical Buyer',
        notes: 'Owns the sales tech stack and process optimization. Values clean data, integration capabilities, and evidence-based coaching signals. Often burned by previous AI tools that promised insights but delivered noise. Asks detailed questions about CRM integration, data handling, and seller privacy.',
      },
      {
        id: 'p3',
        name: 'VP of Sales Enablement',
        role: 'Influencer',
        notes: 'Responsible for training effectiveness and rep performance improvement. Cares about coaching efficiency and skill development at scale. Wants to see how Hunter surfaces learning moments without creating more work for frontline managers. Concerned about training overhead and change management.',
      },
    ],
    keyQuestions: [
      'What does success look like for your revenue team this quarter?',
      'How do you currently know when a deal is gaining or losing momentum?',
      'What happens when your best seller takes time off or leaves?',
      'How do your managers currently coach on live customer interactions?',
    ],
    keyObjectives: [
      'Increase deal velocity across the full pipeline',
      'Scale best-seller behaviors to entire team',
      'Reduce time to productivity for new reps',
      'Provide evidence-based coaching for managers',
      'Surface buyer concerns before they become silent deal-killers',
    ],
    differentiators: [
      {
        id: 'd1',
        they: 'Record and analyze conversations after the call ends',
        we: 'Provide real-time guidance while the buyer is still engaged and outcomes can change',
      },
      {
        id: 'd2',
        they: 'Surface trends and aggregated insights for managers',
        we: 'Whisper specific next moves privately to sellers during live conversations',
      },
      {
        id: 'd3',
        they: 'Built on natural language processing and transcription',
        we: 'Built on behavioral science research about what actually changes deal outcomes',
      },
      {
        id: 'd4',
        they: 'Create surveillance concerns with always-on recording',
        we: 'Private seller guidance with clear privacy boundaries and no-monitor commitment',
      },
    ],
    objections: [
      {
        id: 'o1',
        objection: 'How is this different from Gong or Chorus?',
        counter: 'Gong records and analyzes after the call. Hunter guides during, while the conversation is still happening. They\'re complementary—Gong helps you understand what happened; Hunter helps you change what happens next. Think of Gong as the film room; Hunter is the coach on the sideline during the game.',
      },
      {
        id: 'o2',
        objection: 'Our team will feel like they\'re being watched or micromanaged',
        counter: 'Hunter tips are private to the seller—managers never see live guidance or individual tips. What managers see are patterns and coaching moments, not surveillance feeds. We built this with a no-monitor commitment because we believe seller performance improves with support, not surveillance.',
      },
      {
        id: 'o3',
        objection: 'We already have Salesforce Einstein / AI tools',
        counter: 'Hunter doesn\'t replace Einstein—it makes it better. We ingest Einstein signals as context to make our tips more relevant to your process. Hunter adds the real-time coaching layer that turns those insights into action while the buyer is still engaged.',
      },
      {
        id: 'o4',
        objection: 'This sounds complicated to implement',
        counter: 'Most enterprise customers are sensing in under two weeks. We integrate with your calendar and conferencing tools, connect to Salesforce for deal context, and deploy to your first pilot team in days. Your RevOps team stays in control of what Hunter knows and how it guides.',
      },
    ],
    competitors: [
      {
        id: 'c1',
        name: 'Gong',
        profile: 'Market leader in conversation intelligence and revenue intelligence platform. Strong in post-call analysis, trend identification, and manager dashboards. Known for comprehensive recording and transcription. Used primarily for coaching and deal inspection after interactions occur.',
      },
      {
        id: 'c2',
        name: 'Chorus (Zoominfo)',
        profile: 'Conversation intelligence platform focused on call recording, analysis, and coaching. Strong integration with Zoominfo data for account intelligence. Primarily retrospective—helps managers review what happened and coach after the fact.',
      },
      {
        id: 'c3',
        name: 'Salesforce Einstein',
        profile: 'AI layer built into Salesforce CRM. Provides opportunity scoring, activity capture, and some conversation insights. Limited real-time guidance capabilities. Broad but not deep in live-interaction coaching.',
      },
    ],
    comparisonAdvantages: [
      {
        id: 'ca1',
        ourAdvantage: 'Real-time guidance during calls, not post-call analysis',
        competitorName: 'Gong',
      },
      {
        id: 'ca2',
        ourAdvantage: 'Private seller tips with no-monitor commitment',
        competitorName: 'Gong',
      },
      {
        id: 'ca3',
        ourAdvantage: 'Built on behavioral science, not just NLP transcription',
        competitorName: 'Chorus (Zoominfo)',
      },
      {
        id: 'ca4',
        ourAdvantage: 'Complements existing tools (Gong, Einstein) rather than replacing',
        competitorName: 'Salesforce Einstein',
      },
    ],
    buyerEnvironment: [
      {
        id: 'be1',
        signal: 'Mentions "AI fatigue" or concerns about adding another AI tool to the stack',
      },
      {
        id: 'be2',
        signal: 'Previous investment in conversation intelligence (Gong, Chorus) with mixed adoption',
      },
      {
        id: 'be3',
        signal: 'RevOps team overwhelmed with tool sprawl and integration complexity',
      },
      {
        id: 'be4',
        signal: 'Sales team resistance to being "watched" or recorded',
      },
    ],
    companyProductEnvironment: [
      {
        id: 'cp1',
        signal: 'Inconsistent rep performance—big gap between top and middle performers',
      },
      {
        id: 'cp2',
        signal: 'Long ramp time for new sellers (6+ months to productivity)',
      },
      {
        id: 'cp3',
        signal: 'Managers spending 10+ hours per week reviewing call recordings',
      },
      {
        id: 'cp4',
        signal: 'Difficulty scaling coaching as team grows',
      },
    ],
    dealEnvironmentSignals: [
      {
        id: 'de1',
        signal: 'Champion mentions board pressure or urgent timeline',
      },
      {
        id: 'de2',
        signal: 'Security or IT asks detailed questions about data handling and privacy',
      },
      {
        id: 'de3',
        signal: 'Enablement stakeholder asks about change management and training overhead',
      },
      {
        id: 'de4',
        signal: 'Buyer shares frustration with current tools not delivering promised insights',
      },
    ],
    draftGenerated: false,
    completedSections: {
      about: true,
      personas: true,
      keySignals: true,
      competitive: true,
      marketInfo: true,
    },
  };
}

function createCommanderProduct(): ProductTeach {
  return {
    id: 'commander',
    name: 'Commander',
    sources: [],
    description: 'Revenue team performance platform that gives sales leaders real-time visibility into pipeline health, team patterns, and coaching opportunities. Commander aggregates signals from Hunter and your CRM to surface what needs your attention and where to intervene for maximum impact.',
    personas: [
      {
        id: 'p1',
        name: 'Chief Revenue Officer',
        role: 'Primary User / Economic Buyer',
        notes: 'Owns revenue number and needs to know where the business is headed before it gets there. Cares about pipeline predictability, early warning signals, and where to focus limited attention. Asks about forecast accuracy improvement and executive dashboard clarity. Wants pattern intelligence without drowning in reports.',
      },
      {
        id: 'p2',
        name: 'VP of Sales',
        role: 'Primary User',
        notes: 'Manages frontline sales managers and needs to know which deals and which reps need intervention. Values coaching efficiency and wants to spend time on highest-leverage activities. Concerned about creating more reporting overhead for managers. Asks about integration with existing sales process.',
      },
      {
        id: 'p3',
        name: 'Head of Sales Operations',
        role: 'Technical Buyer / Implementer',
        notes: 'Responsible for sales systems, reporting infrastructure, and data integrity. Cares about clean pipeline data, integration complexity, and maintainability. Often skeptical of new dashboards that duplicate existing reports. Wants to see how Commander reduces, not increases, their reporting burden.',
      },
    ],
    keyQuestions: [
      'How do you currently know which deals need your attention?',
      'What percentage of pipeline surprises could you have seen coming?',
      'How much time do your sales managers spend in status meetings vs actually coaching?',
      'When a deal stalls, how quickly do you know and what do you do about it?',
    ],
    keyObjectives: [
      'Increase pipeline predictability and reduce forecast surprises',
      'Identify intervention opportunities before deals slip',
      'Focus coaching time on highest-impact activities',
      'Scale leadership leverage across growing sales org',
      'Connect team patterns to revenue outcomes',
    ],
    differentiators: [
      {
        id: 'd1',
        they: 'Dashboards showing lagging indicators and historical trends',
        we: 'Real-time pattern detection and forward-looking momentum signals',
      },
      {
        id: 'd2',
        they: 'Generic reports requiring manual interpretation',
        we: 'Intelligent surfaces that tell you what needs attention and why',
      },
      {
        id: 'd3',
        they: 'Separate tools for pipeline tracking and team coaching',
        we: 'Unified view connecting deal momentum to seller behaviors',
      },
      {
        id: 'd4',
        they: 'Built for reporting to executives, not leading teams',
        we: 'Built for leaders who need to know where to intervene and how',
      },
    ],
    objections: [
      {
        id: 'o1',
        objection: 'We already have Clari / Salesforce dashboards',
        counter: 'Commander doesn\'t replace Clari—it makes it more actionable. Clari shows you forecast roll-ups and deal scores. Commander shows you which deals need intervention right now and what pattern is causing the stall. Think of Clari as the scoreboard; Commander is the playbook.',
      },
      {
        id: 'o2',
        objection: 'This looks like another dashboard our team won\'t use',
        counter: 'Most BI dashboards fail because they show data, not decisions. Commander surfaces the three things that need your attention today, with context about why they matter and what to do. It\'s not a dashboard—it\'s your leadership co-pilot.',
      },
      {
        id: 'o3',
        objection: 'Our sales managers already feel overwhelmed with tools',
        counter: 'Commander actually reduces tool sprawl. Instead of checking Salesforce, Gong, Slack, and calendar to understand what\'s happening, your managers get one intelligent brief that connects the dots. We\'ve seen leaders save 5+ hours per week on status gathering.',
      },
    ],
    competitors: [
      {
        id: 'c1',
        name: 'Clari',
        profile: 'Revenue operations platform focused on forecasting accuracy, pipeline management, and deal inspection. Strong in forecast roll-ups and executive reporting. Primarily bottom-up data aggregation with some AI scoring.',
      },
      {
        id: 'c2',
        name: 'Salesforce Reports & Dashboards',
        profile: 'Native CRM reporting and dashboard capabilities. Flexible but requires manual configuration and interpretation. Shows historical data and current state, limited predictive or pattern intelligence.',
      },
      {
        id: 'c3',
        name: 'Tableau / Looker',
        profile: 'General business intelligence platforms often used for sales analytics. Powerful for custom reporting but requires significant data engineering. Not sales-specific; requires interpretation.',
      },
    ],
    comparisonAdvantages: [
      {
        id: 'ca1',
        ourAdvantage: 'Pattern intelligence connecting behaviors to outcomes, not just activity tracking',
        competitorName: 'Clari',
      },
      {
        id: 'ca2',
        ourAdvantage: 'Prescriptive guidance on where to intervene, not just descriptive dashboards',
        competitorName: 'Salesforce Reports & Dashboards',
      },
      {
        id: 'ca3',
        ourAdvantage: 'Built for front-line leaders making decisions, not executive reporting',
        competitorName: 'Tableau / Looker',
      },
    ],
    buyerEnvironment: [
      {
        id: 'be1',
        signal: 'Leadership team mentions "surprised by deals slipping at the last minute"',
      },
      {
        id: 'be2',
        signal: 'Sales managers spending excessive time in pipeline review meetings',
      },
      {
        id: 'be3',
        signal: 'Existing dashboards unused or generating more questions than answers',
      },
      {
        id: 'be4',
        signal: 'Leadership struggling to scale coaching across growing sales organization',
      },
    ],
    companyProductEnvironment: [
      {
        id: 'cp1',
        signal: 'Frequent forecast misses or pipeline surprises',
      },
      {
        id: 'cp2',
        signal: 'Leadership attention spread thin across too many deals',
      },
      {
        id: 'cp3',
        signal: 'Sales managers reactive to problems rather than proactive on opportunities',
      },
      {
        id: 'cp4',
        signal: 'Disconnect between activity metrics and actual revenue outcomes',
      },
    ],
    dealEnvironmentSignals: [
      {
        id: 'de1',
        signal: 'CRO asks about forecast accuracy improvement with specific metrics',
      },
      {
        id: 'de2',
        signal: 'VP Sales mentions difficulty prioritizing coaching time across team',
      },
      {
        id: 'de3',
        signal: 'RevOps concerned about adding another system to maintain',
      },
      {
        id: 'de4',
        signal: 'Leadership mentions "too many dashboards" or "reporting fatigue"',
      },
    ],
    draftGenerated: false,
    completedSections: {
      about: true,
      personas: true,
      keySignals: true,
      competitive: true,
      marketInfo: true,
    },
  };
}

function generateContradictions(): Contradiction[] {
  return [
    {
      id: 'con1',
      type: 'deal-size',
      title: 'Deal size vs typical sales cycle mismatch',
      description: 'Company overview indicates typical deal size of $100K-$500K (mid-to-large deals) but sales cycle is set to 30-90 days. Deals in this range typically require 90-180 days for enterprise validation, security review, and multi-stakeholder alignment.',
      option1: 'Update sales cycle to 90-180 days to match deal complexity',
      option2: 'Update typical deal size to $25K-$100K to align with 30-90 day cycle',
      resolved: false,
    },
    {
      id: 'con2',
      type: 'cross-product',
      title: 'Overlapping objections handling',
      description: 'Both Hunter and Commander mention "tool sprawl" concerns but frame the counter differently. Hunter says it complements existing tools; Commander says it reduces tool sprawl.',
      option1: 'Keep both—Hunter complements during-call tools, Commander replaces multiple dashboards',
      option2: 'Unify message around "intelligent layer that makes existing tools more actionable"',
      resolved: false,
    },
    {
      id: 'con3',
      type: 'framework-stages',
      title: 'MEDDPICC framework elements not reflected in deal stages',
      description: 'Selected sales framework is MEDDPICC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion) but deal stages don\'t explicitly include validation of these elements.',
      option1: 'Add MEDDPICC qualification checkpoints to existing stages',
      option2: 'Restructure stages to align with MEDDPICC: Qualification → Technical Validation → Economic Validation → Decision Process → Paper Process → Close',
      resolved: false,
    },
  ];
}

// Framework descriptions for selector
export const frameworkDescriptions: Record<string, { name: string; description: string; elements?: string[] }> = {
  challenger: {
    name: 'Challenger Sale',
    description: 'Teaching, tailoring, and taking control. Focus on challenging customer thinking and constructive tension.',
    elements: ['Teach', 'Tailor', 'Take Control'],
  },
  meddic: {
    name: 'MEDDIC',
    description: 'Qualification framework ensuring all key elements are covered before advancing deals.',
    elements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Identify Pain', 'Champion'],
  },
  meddpicc: {
    name: 'MEDDPICC',
    description: 'Extended MEDDIC adding Paper Process and Competition for complex enterprise sales.',
    elements: ['Metrics', 'Economic Buyer', 'Decision Criteria', 'Decision Process', 'Paper Process', 'Identify Pain', 'Champion', 'Competition'],
  },
  sandler: {
    name: 'Sandler',
    description: 'Pain-focused selling methodology emphasizing up-front contracts and qualifying out.',
    elements: ['Bonding & Rapport', 'Up-front Contract', 'Pain', 'Budget', 'Decision'],
  },
  spin: {
    name: 'SPIN Selling',
    description: 'Question-based approach using Situation, Problem, Implication, and Need-payoff questions.',
    elements: ['Situation', 'Problem', 'Implication', 'Need-Payoff'],
  },
  'miller-heiman': {
    name: 'Miller Heiman',
    description: 'Strategic selling framework mapping buying influences and win themes.',
    elements: ['Blue Sheet', 'Buying Influences', 'Win Themes', 'Ideal Customer Profile'],
  },
  custom: {
    name: 'Custom Framework',
    description: 'Define your own sales methodology and key elements.',
  },
  none: {
    name: 'No Formal Framework',
    description: 'Your team uses a flexible or informal approach to selling.',
  },
};

// Stage templates
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
