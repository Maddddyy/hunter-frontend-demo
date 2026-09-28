// Teach journey types for Sales Configuration

export type SalesFramework = 
  | 'challenger'
  | 'meddic'
  | 'meddpicc'
  | 'sandler'
  | 'spin'
  | 'miller-heiman'
  | 'custom'
  | 'none';

export type CustomerSegment = 'smb' | 'mid-market' | 'enterprise' | 'mixed';

export interface TeachSource {
  id: string;
  type: 'file' | 'url';
  name: string;
  size?: string;
  url?: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  notes: string;
}

export interface Differentiator {
  id: string;
  they: string;
  we: string;
}

export interface Objection {
  id: string;
  objection: string;
  counter: string;
}

export interface Competitor {
  id: string;
  name: string;
  profile: string;
}

export interface ComparisonAdvantage {
  id: string;
  ourAdvantage: string;
  competitorName: string;
}

export interface MarketSignal {
  id: string;
  signal: string;
}

export interface ProductTeach {
  id: string;
  name: string;
  sources: TeachSource[];
  description: string;
  personas: Persona[];
  keyQuestions: string[];
  keyObjectives: string[];
  differentiators: Differentiator[];
  objections: Objection[];
  competitors: Competitor[];
  comparisonAdvantages: ComparisonAdvantage[];
  buyerEnvironment: MarketSignal[];
  companyProductEnvironment: MarketSignal[];
  dealEnvironmentSignals: MarketSignal[];
  draftGenerated: boolean;
  completedSections: {
    about: boolean;
    personas: boolean;
    keySignals: boolean;
    competitive: boolean;
    marketInfo: boolean;
  };
}

export interface DealStage {
  id: string;
  name: string;
  description?: string;
}

export interface CompanyOverview {
  industry: string;
  customerSegment: CustomerSegment[];
  typicalDealSize: string;
  typicalSalesCycle: string;
}

export interface Contradiction {
  id: string;
  type: 'persona-segment' | 'framework-stages' | 'cross-product' | 'deal-size';
  title: string;
  description: string;
  option1: string;
  option2: string;
  resolved: boolean;
  resolution?: 'option1' | 'option2' | 'custom';
}

export interface TeachState {
  currentStep: number;
  companyOverview: CompanyOverview;
  dealStages: DealStage[];
  salesFramework: SalesFramework;
  customFrameworkName?: string;
  customFrameworkNotes?: string;
  products: ProductTeach[];
  activeProductIndex: number;
  contradictions: Contradiction[];
  visibility: {
    sensing: boolean;
    writeback: boolean;
    noMonitorCommitment: boolean;
  };
  goLive: boolean;
}

export type TeachStepId = 
  | 'welcome'
  | 'company-overview'
  | 'deal-stages'
  | 'sales-framework'
  | 'product-about'
  | 'product-personas'
  | 'product-key-signals'
  | 'product-competitive'
  | 'product-market-info'
  | 'gaps-contradictions'
  | 'visibility-go-live';
