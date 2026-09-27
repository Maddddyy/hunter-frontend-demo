// Core domain types for Hunter

export type EvidenceLevel = 'validated' | 'supported' | 'associated' | 'observed';

export type MomentumDirection = 'gaining' | 'holding' | 'losing';

export type PatternType = 'seller' | 'buyer' | 'buyer-seller' | 'market';

export type PrepStatus = 'needs-prep' | 'draft' | 'prepared';

export type CallType = 'discovery' | 'technical-validation' | 'demo' | 'proposal' | 'negotiation' | 'close';

export type SellerRole = 'leading' | 'supporting' | 'observing';

export type DealStage = 'lead' | 'discovery' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  linkedIn?: string;
  isExternal: boolean;
  personalContext?: PersonalContext[];
}

export interface PersonalContext {
  detail: string;
  source: 'public-profile' | 'prior-interaction';
  verified: boolean;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  linkedIn?: string;
  industry?: string;
}

export interface Deal {
  id: string;
  company: Company;
  value: number;
  stage: DealStage;
  momentum: number; // -100 to +100
  momentumDirection: MomentumDirection;
  momentumChangeLastWeek: number;
  primaryPattern?: Pattern;
  nextInteraction?: Interaction;
  needsAction: boolean;
  actionReason?: string;
}

export interface Interaction {
  id: string;
  dealId: string;
  company: Company;
  date: Date;
  callType: CallType;
  sellerRole: SellerRole;
  goal?: string;
  contacts: Contact[];
  prepStatus: PrepStatus;
  sellerInputs?: string;
  hunterRead?: HunterRead;
  followThrough?: FollowThrough;
}

export interface HunterRead {
  currentMomentum: number;
  momentumDirection: MomentumDirection;
  whatChanged: string;
  buyerCaresAbout: string[];
  unresolved: string[];
  commitments: string[];
  patterns: Pattern[];
  personalContext: PersonalContext[];
}

export interface FollowThrough {
  outcome: string;
  commitments: string[];
  blockers: string[];
  nextAction: string;
  moveThatWorked?: string;
  missedOpportunity?: string;
  awaitingApproval: boolean;
}

export interface Pattern {
  id: string;
  type: PatternType;
  pattern: string; // What's happening
  meaning: string; // Why it matters
  evidence: Evidence;
  impact: 'stall' | 'accelerate' | 'loss' | 'engagement' | 'commitment' | 'progression';
  recommendedAction: string;
  affectedDeals?: number;
  affectedValue?: number;
}

export interface Evidence {
  level: EvidenceLevel;
  interactions: number;
  details?: string[];
}

export interface LiveTip {
  id: string;
  pattern: string;
  meaning: string;
  move: string;
  dismissed: boolean;
}

export interface PerformanceMetric {
  momentsIdentified: number;
  guidanceActioned: number;
  buyerResponsesChanged: number;
  momentumChanged: number;
}

export interface NeedsYouItem {
  id: string;
  type: 'follow-through' | 'prep-needed' | 'missing-context' | 'approval-needed' | 'commitment' | 'intervention';
  deal: Deal;
  reason: string;
  whatHunterSees: string;
  recommendedAction: string;
  priority: number;
}

export interface TeachStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProductConfig {
  id: string;
  name: string;
  about?: string;
  personas?: string[];
  keySignals?: string[];
  keyObjectives?: string[];
  differentiators?: string[];
  objections?: { objection: string; counter: string }[];
  competitiveLandscape?: string[];
  marketInfo?: string;
}

export interface CompanyProfile {
  companyOverview?: string;
  dealStages?: string[];
  salesFramework?: string;
  integrations?: string[];
}
