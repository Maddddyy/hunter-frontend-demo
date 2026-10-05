'use client';

import { useState, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import { markTeachComplete } from '@/lib/teachGate';
import {
  TeachState,
  TeachStepId,
  ProductTeach,
  Persona,
  Differentiator,
  Objection,
  Competitor,
  ComparisonAdvantage,
  MarketSignal,
  DealStage,
  SalesFramework,
  CustomerSegment,
  Contradiction,
  TeachSource,
} from '@/lib/types/teach';
import {
  initialTeachState,
  frameworkDescriptions,
  stageTemplates,
  blankProduct,
} from '@/lib/data/teachData';

type TeachAction =
  | { type: 'SET_STEP'; step: number; productIndex?: number }
  | { type: 'SET_PRODUCT_COUNT'; count: number }
  | { type: 'RENAME_PRODUCT'; productId: string; name: string }
  | { type: 'ADD_CONTACT' }
  | { type: 'UPDATE_CONTACT'; id: string; field: 'name' | 'role' | 'email'; value: string }
  | { type: 'REMOVE_CONTACT'; id: string }
  | { type: 'UPDATE_COMPANY_OVERVIEW'; field: string; value: any }
  | { type: 'SET_DEAL_STAGES'; stages: DealStage[] }
  | { type: 'ADD_DEAL_STAGE' }
  | { type: 'UPDATE_DEAL_STAGE'; id: string; field: string; value: string }
  | { type: 'REMOVE_DEAL_STAGE'; id: string }
  | { type: 'SET_SALES_FRAMEWORK'; framework: SalesFramework }
  | { type: 'SET_CUSTOM_FRAMEWORK'; name?: string; notes?: string }
  | { type: 'SET_ACTIVE_PRODUCT'; index: number }
  | { type: 'UPDATE_PRODUCT'; productId: string; field: string; value: any }
  | { type: 'ADD_PRODUCT_SOURCE'; productId: string; source: TeachSource }
  | { type: 'REMOVE_PRODUCT_SOURCE'; productId: string; sourceId: string }
  | { type: 'ADD_PERSONA'; productId: string; persona: Persona }
  | { type: 'UPDATE_PERSONA'; productId: string; personaId: string; field: string; value: string }
  | { type: 'REMOVE_PERSONA'; productId: string; personaId: string }
  | { type: 'ADD_KEY_QUESTION'; productId: string; question: string }
  | { type: 'UPDATE_KEY_QUESTION'; productId: string; index: number; value: string }
  | { type: 'REMOVE_KEY_QUESTION'; productId: string; index: number }
  | { type: 'ADD_KEY_OBJECTIVE'; productId: string; objective: string }
  | { type: 'UPDATE_KEY_OBJECTIVE'; productId: string; index: number; value: string }
  | { type: 'REMOVE_KEY_OBJECTIVE'; productId: string; index: number }
  | { type: 'ADD_DIFFERENTIATOR'; productId: string; differentiator: Differentiator }
  | { type: 'UPDATE_DIFFERENTIATOR'; productId: string; diffId: string; field: string; value: string }
  | { type: 'REMOVE_DIFFERENTIATOR'; productId: string; diffId: string }
  | { type: 'ADD_OBJECTION'; productId: string; objection: Objection }
  | { type: 'UPDATE_OBJECTION'; productId: string; objId: string; field: string; value: string }
  | { type: 'REMOVE_OBJECTION'; productId: string; objId: string }
  | { type: 'ADD_COMPETITOR'; productId: string; competitor: Competitor }
  | { type: 'UPDATE_COMPETITOR'; productId: string; compId: string; field: string; value: string }
  | { type: 'REMOVE_COMPETITOR'; productId: string; compId: string }
  | { type: 'ADD_COMPARISON_ADVANTAGE'; productId: string; advantage: ComparisonAdvantage }
  | { type: 'UPDATE_COMPARISON_ADVANTAGE'; productId: string; advId: string; field: string; value: string }
  | { type: 'REMOVE_COMPARISON_ADVANTAGE'; productId: string; advId: string }
  | { type: 'ADD_MARKET_SIGNAL'; productId: string; category: string; signal: MarketSignal }
  | { type: 'REMOVE_MARKET_SIGNAL'; productId: string; category: string; signalId: string }
  | { type: 'DRAFT_FROM_SOURCES'; productId: string }
  | { type: 'UPDATE_COMPLETED_SECTIONS'; productId: string }
  | { type: 'RESOLVE_CONTRADICTION'; contradictionId: string; resolution: 'option1' | 'option2' }
  | { type: 'TOGGLE_VISIBILITY'; field: string }
  | { type: 'GO_LIVE' };

function teachReducer(state: TeachState, action: TeachAction): TeachState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
        activeProductIndex: action.productIndex ?? state.activeProductIndex,
      };

    case 'SET_PRODUCT_COUNT': {
      const count = Math.min(6, Math.max(1, action.count));
      const samples = state.products.filter((product) => product.sample);
      const userProducts = state.products.filter((product) => !product.sample).slice(0, count);
      while (userProducts.length < count) {
        userProducts.push(blankProduct(`product-${userProducts.length + 1}`));
      }
      const products = [...samples, ...userProducts];
      return {
        ...state,
        products,
        activeProductIndex: Math.min(state.activeProductIndex, Math.max(0, products.length - 1)),
      };
    }

    case 'RENAME_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.productId ? { ...p, name: action.name } : p
        ),
      };

    case 'ADD_CONTACT':
      return {
        ...state,
        companyOverview: {
          ...state.companyOverview,
          contacts: [
            ...state.companyOverview.contacts,
            { id: `contact-${Date.now()}`, name: '', role: '', email: '' },
          ],
        },
      };

    case 'UPDATE_CONTACT':
      return {
        ...state,
        companyOverview: {
          ...state.companyOverview,
          contacts: state.companyOverview.contacts.map((contact) =>
            contact.id === action.id ? { ...contact, [action.field]: action.value } : contact
          ),
        },
      };

    case 'REMOVE_CONTACT':
      return {
        ...state,
        companyOverview: {
          ...state.companyOverview,
          contacts: state.companyOverview.contacts.filter((contact) => contact.id !== action.id),
        },
      };
    
    case 'UPDATE_COMPANY_OVERVIEW':
      return {
        ...state,
        companyOverview: {
          ...state.companyOverview,
          [action.field]: action.value,
        },
      };
    
    case 'SET_DEAL_STAGES':
      return { ...state, dealStages: action.stages };
    
    case 'ADD_DEAL_STAGE': {
      const newStage: DealStage = {
        id: `stage-${Date.now()}`,
        name: 'New Stage',
        description: '',
      };
      return { ...state, dealStages: [...state.dealStages, newStage] };
    }
    
    case 'UPDATE_DEAL_STAGE':
      return {
        ...state,
        dealStages: state.dealStages.map(stage =>
          stage.id === action.id ? { ...stage, [action.field]: action.value } : stage
        ),
      };
    
    case 'REMOVE_DEAL_STAGE':
      return {
        ...state,
        dealStages: state.dealStages.filter(stage => stage.id !== action.id),
      };
    
    case 'SET_SALES_FRAMEWORK':
      return { ...state, salesFramework: action.framework };
    
    case 'SET_CUSTOM_FRAMEWORK':
      return {
        ...state,
        customFrameworkName: action.name,
        customFrameworkNotes: action.notes,
      };
    
    case 'SET_ACTIVE_PRODUCT':
      return { ...state, activeProductIndex: action.index };
    
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(p => {
          if (p.id !== action.productId) return p;
          
          // Update the field
          const updatedProduct = { ...p, [action.field]: action.value };
          
          // Recalculate completed sections
          return {
            ...updatedProduct,
            completedSections: {
              about: updatedProduct.description.trim().length > 20,
              personas: updatedProduct.personas.length > 0,
              keySignals: updatedProduct.keyQuestions.length > 0 && updatedProduct.keyObjectives.length > 0,
              competitive: updatedProduct.competitors.length > 0,
              marketInfo: updatedProduct.buyerEnvironment.length > 0 || updatedProduct.companyProductEnvironment.length > 0,
            },
          };
        }),
      };
    }
    
    case 'ADD_PRODUCT_SOURCE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, sources: [...p.sources, action.source] }
            : p
        ),
      };
    
    case 'REMOVE_PRODUCT_SOURCE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, sources: p.sources.filter(s => s.id !== action.sourceId) }
            : p
        ),
      };
    
    case 'ADD_PERSONA':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, personas: [...p.personas, action.persona] }
            : p
        ),
      };
    
    case 'UPDATE_PERSONA':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                personas: p.personas.map(persona =>
                  persona.id === action.personaId
                    ? { ...persona, [action.field]: action.value }
                    : persona
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_PERSONA':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, personas: p.personas.filter(persona => persona.id !== action.personaId) }
            : p
        ),
      };
    
    case 'ADD_KEY_QUESTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, keyQuestions: [...p.keyQuestions, action.question] }
            : p
        ),
      };
    
    case 'UPDATE_KEY_QUESTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                keyQuestions: p.keyQuestions.map((q, i) =>
                  i === action.index ? action.value : q
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_KEY_QUESTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, keyQuestions: p.keyQuestions.filter((_, i) => i !== action.index) }
            : p
        ),
      };
    
    case 'ADD_KEY_OBJECTIVE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, keyObjectives: [...p.keyObjectives, action.objective] }
            : p
        ),
      };

    case 'UPDATE_KEY_OBJECTIVE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                keyObjectives: p.keyObjectives.map((objective, index) =>
                  index === action.index ? action.value : objective
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_KEY_OBJECTIVE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, keyObjectives: p.keyObjectives.filter((_, i) => i !== action.index) }
            : p
        ),
      };
    
    case 'ADD_DIFFERENTIATOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, differentiators: [...p.differentiators, action.differentiator] }
            : p
        ),
      };
    
    case 'UPDATE_DIFFERENTIATOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                differentiators: p.differentiators.map(d =>
                  d.id === action.diffId ? { ...d, [action.field]: action.value } : d
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_DIFFERENTIATOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, differentiators: p.differentiators.filter(d => d.id !== action.diffId) }
            : p
        ),
      };
    
    case 'ADD_OBJECTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, objections: [...p.objections, action.objection] }
            : p
        ),
      };
    
    case 'UPDATE_OBJECTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                objections: p.objections.map(o =>
                  o.id === action.objId ? { ...o, [action.field]: action.value } : o
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_OBJECTION':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, objections: p.objections.filter(o => o.id !== action.objId) }
            : p
        ),
      };
    
    case 'ADD_COMPETITOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, competitors: [...p.competitors, action.competitor] }
            : p
        ),
      };
    
    case 'UPDATE_COMPETITOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                competitors: p.competitors.map(c =>
                  c.id === action.compId ? { ...c, [action.field]: action.value } : c
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_COMPETITOR':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, competitors: p.competitors.filter(c => c.id !== action.compId) }
            : p
        ),
      };
    
    case 'ADD_COMPARISON_ADVANTAGE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, comparisonAdvantages: [...p.comparisonAdvantages, action.advantage] }
            : p
        ),
      };
    
    case 'UPDATE_COMPARISON_ADVANTAGE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                comparisonAdvantages: p.comparisonAdvantages.map(a =>
                  a.id === action.advId ? { ...a, [action.field]: action.value } : a
                ),
              }
            : p
        ),
      };
    
    case 'REMOVE_COMPARISON_ADVANTAGE':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, comparisonAdvantages: p.comparisonAdvantages.filter(a => a.id !== action.advId) }
            : p
        ),
      };
    
    case 'ADD_MARKET_SIGNAL':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? { ...p, [action.category]: [...(p[action.category as keyof ProductTeach] as MarketSignal[]), action.signal] }
            : p
        ),
      };
    
    case 'REMOVE_MARKET_SIGNAL':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId
            ? {
                ...p,
                [action.category]: (p[action.category as keyof ProductTeach] as MarketSignal[]).filter(
                  s => s.id !== action.signalId
                ),
              }
            : p
        ),
      };
    
    case 'DRAFT_FROM_SOURCES': {
      const product = state.products.find((item) => item.id === action.productId);
      if (!product || product.sample) return state;
      const name = product.name.trim() || 'This product';
      const drafted: ProductTeach = {
        ...product,
        description: product.description.trim() || `${name} helps the buyer finish the job they cannot finish with the tools they already have.`,
        personas: product.personas.length > 0 ? product.personas : [
          {
            id: `p-${product.id}-1`,
            name: 'Economic buyer',
            role: 'Owns the budget',
            notes: '',
            titles: 'CRO, VP Sales, CFO, Revenue leader',
            owns: 'Revenue, budget, team performance',
            accomplish: `Hit the outcome ${name} is bought for`,
            matters: 'Clear ROI, low risk, and proof it works',
            hesitate: 'Cost, implementation risk, and a lack of proof',
            signals: `Asks what changes if the team adopts ${name}.`,
          },
          {
            id: `p-${product.id}-2`,
            name: 'Champion',
            role: 'Runs the process',
            notes: '',
            titles: 'Director, senior manager, project lead',
            owns: 'The process and the people who have to use it',
            accomplish: `Get ${name} adopted without stalling the quarter`,
            matters: 'That it fits the way the team already sells',
            hesitate: 'A rollout that creates more work for the team',
            signals: 'Brings in stakeholders and pushes on timing',
          },
        ],
        keyQuestions: product.keyQuestions.length > 0 ? product.keyQuestions : [
          `Where does the current approach fail before ${name} shows up?`,
          'What would have to be true for this to be worth switching?',
        ],
        keyObjectives: product.keyObjectives.length > 0 ? product.keyObjectives : [
          `Make the outcome ${name} promises visible in the first cycle.`,
        ],
        differentiators: product.differentiators.length > 0 ? product.differentiators : [
          { id: `d-${product.id}-1`, they: 'Add another report', we: `${name} tells the buyer the next move.` },
        ],
        objections: product.objections.length > 0 ? product.objections : [
          { id: `o-${product.id}-1`, objection: 'We already have something for this.', counter: `${name} sits on top of that system and makes it actionable.` },
        ],
        competitors: product.competitors.length > 0 ? product.competitors : [
          {
            id: `c-${product.id}-1`,
            name: 'The incumbent',
            profile: '',
            whyChoose: 'The tool the buyer already pays for and rarely replaces outright.',
            fallShort: 'It records what happened. It does not tell the rep what to do next.',
            emphasize: `${name} sits on top of that system and makes the next move obvious.`,
            objection: 'We already have something for this.',
            response: `${name} does not replace the system of record. It makes it actionable on the call.`,
          },
        ],
        buyerEnvironment: product.buyerEnvironment.length > 0 ? product.buyerEnvironment : [
          { id: `be-${product.id}-1`, signal: 'The buyer describes the job in their own words before you name the product.' },
        ],
        companyProductEnvironment: product.companyProductEnvironment.length > 0 ? product.companyProductEnvironment : [
          { id: `cp-${product.id}-1`, signal: `Teams adopt ${name} when the current process hides the deal that needs attention.` },
        ],
        dealEnvironmentSignals: product.dealEnvironmentSignals.length > 0 ? product.dealEnvironmentSignals : [
          { id: `de-${product.id}-1`, signal: 'A stakeholder asks what this replaces.' },
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
      return {
        ...state,
        products: state.products.map((item) => (item.id === product.id ? drafted : item)),
      };
    }

    case 'UPDATE_COMPLETED_SECTIONS': {
      const product = state.products.find(p => p.id === action.productId);
      if (!product) return state;

      const completedSections = {
        about: product.description.trim().length > 20,
        personas: product.personas.length > 0 && product.personas.every(p => p.name && p.notes),
        keySignals: product.keyQuestions.length > 0 && product.keyObjectives.length > 0 && 
                    product.differentiators.length > 0 && product.objections.length > 0,
        competitive: product.competitors.length > 0,
        marketInfo: product.buyerEnvironment.length > 0 || product.companyProductEnvironment.length > 0 ||
                   product.dealEnvironmentSignals.length > 0,
      };

      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.productId ? { ...p, completedSections } : p
        ),
      };
    }
    
    case 'RESOLVE_CONTRADICTION': {
      const contradiction = state.contradictions.find(c => c.id === action.contradictionId);
      if (!contradiction) return state;

      let updatedState = { ...state };

      // Apply the chosen option
      if (contradiction.id === 'con1') {
        // Deal size vs sales cycle mismatch
        if (action.resolution === 'option1') {
          // Update sales cycle to 90-180 days
          updatedState.companyOverview = {
            ...updatedState.companyOverview,
            typicalSalesCycle: '90-180 days',
          };
        } else {
          // Update deal size to $25K-$100K
          updatedState.companyOverview = {
            ...updatedState.companyOverview,
            typicalDealSize: '$25K-$100K',
          };
        }
      } else if (contradiction.id === 'con2') {
        // Cross-product objection handling
        if (action.resolution === 'option1') {
          // Keep both—they're complementary
          // No state change needed, just mark resolved
        } else {
          // Unify message
          updatedState.products = updatedState.products.map(p => ({
            ...p,
            objections: p.objections.map(obj =>
              obj.objection.toLowerCase().includes('tool')
                ? {
                    ...obj,
                    counter: obj.counter.replace(
                      /Hunter (complements|doesn't replace).*?\./,
                      'Hunter is an intelligent layer that makes your existing tools more actionable.'
                    ),
                  }
                : obj
            ),
          }));
        }
      } else if (contradiction.id === 'con3') {
        // Framework vs stages
        if (action.resolution === 'option1') {
          // Add MEDDPICC checkpoints to stages
          const meddpiccStages = state.dealStages.map(stage => ({
            ...stage,
            description: stage.description + (stage.description ? ' | ' : '') + 'MEDDPICC checkpoint',
          }));
          updatedState.dealStages = meddpiccStages;
        } else {
          // Restructure stages to align with MEDDPICC
          updatedState.dealStages = [
            { id: 'qualification', name: 'Qualification', description: 'MEDDPICC validation' },
            { id: 'technical', name: 'Technical Validation', description: 'Metrics, Decision Criteria' },
            { id: 'economic', name: 'Economic Validation', description: 'Economic Buyer engagement' },
            { id: 'decision-process', name: 'Decision Process', description: 'Identify Pain, Champion confirmed' },
            { id: 'paper-process', name: 'Paper Process', description: 'Legal, procurement, contracts' },
            { id: 'closed-won', name: 'Closed Won', description: 'Deal signed' },
          ];
        }
      }

      // Mark contradiction as resolved
      updatedState.contradictions = updatedState.contradictions.map(c =>
        c.id === action.contradictionId
          ? { ...c, resolved: true, resolution: action.resolution }
          : c
      );

      return updatedState;
    }
    
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        visibility: {
          ...state.visibility,
          [action.field]: !state.visibility[action.field as keyof typeof state.visibility],
        },
      };
    
    case 'GO_LIVE':
      return { ...state, goLive: true };
    
    default:
      return state;
  }
}

export default function TeachPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(teachReducer, initialTeachState);
  const [toast, setToast] = useState<string | null>(null);
  const [keySignalsSubStep, setKeySignalsSubStep] = useState<'questions' | 'objectives' | 'differentiators' | 'objections'>('questions');
  const [launch, setLaunch] = useState<'edit' | 'configuring' | 'success' | 'team' | 'console'>('edit');
  const [samplePreview, setSamplePreview] = useState(false);
  const [showGaps, setShowGaps] = useState(false);

  useEffect(() => {
    setKeySignalsSubStep('questions');
  }, [state.activeProductIndex]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  type AskScreen = 'industry' | 'segment' | 'deal-size' | 'cycle' | 'website' | 'stages' | 'framework' | 'names' | 'sources' | 'buyers' | 'playbook' | 'competitors' | 'market' | 'ready';
  type Ask = { id: string; chapter: 'company' | 'sell' | 'ready'; prompt: string; rail: string; detail?: string; required: boolean; screen: AskScreen; productId?: string };

  const userProducts = state.products.filter((product) => !product.sample);
  const namedProducts = userProducts.filter((product) => product.name.trim());
  const asks: Ask[] = [
    { id: 'industry', chapter: 'company', prompt: 'What industry are you in?', rail: 'Industry', required: true, screen: 'industry' },
    { id: 'segment', chapter: 'company', prompt: 'Who do you primarily sell to?', rail: 'Who you sell to', required: true, screen: 'segment' },
    { id: 'deal-size', chapter: 'company', prompt: 'What is your typical deal size?', rail: 'Deal size', required: false, screen: 'deal-size' },
    { id: 'cycle', chapter: 'company', prompt: 'How long is a typical sales cycle?', rail: 'Sales cycle', required: false, screen: 'cycle' },
    { id: 'website', chapter: 'company', prompt: 'Where should Hunter read about the company?', rail: 'Website', required: false, screen: 'website' },
    { id: 'stages', chapter: 'company', prompt: 'How does a deal move?', rail: 'Deal stages', required: false, screen: 'stages' },
    { id: 'framework', chapter: 'company', prompt: 'What motion do your reps already run?', rail: 'Sales motion', required: false, screen: 'framework' },
    { id: 'names', chapter: 'sell', prompt: 'Products & Services', rail: 'Products & Services', detail: 'Name what you sell. Hunter learns each one.', required: true, screen: 'names' },
    ...namedProducts.flatMap((product) => ([
      { id: `sources-${product.id}`, chapter: 'sell' as const, prompt: `What should Hunter know about ${product.name}?`, rail: 'About', required: false, screen: 'sources' as const, productId: product.id },
      { id: `buyers-${product.id}`, chapter: 'sell' as const, prompt: 'Buyer personas', rail: 'Buyer personas', detail: 'Teach Hunter who you sell to, what matters to them, and how they decide.', required: false, screen: 'buyers' as const, productId: product.id },
      { id: `playbook-${product.id}`, chapter: 'sell' as const, prompt: 'Sales Playbook', rail: 'Sales playbook', detail: 'Define the questions, objections, differentiators, and responses Hunter should recognize live.', required: false, screen: 'playbook' as const, productId: product.id },
      { id: `competitors-${product.id}`, chapter: 'sell' as const, prompt: `Who do you sell ${product.name} against?`, rail: 'Competitors', required: false, screen: 'competitors' as const, productId: product.id },
      { id: `market-${product.id}`, chapter: 'sell' as const, prompt: `What is changing around ${product.name} deals?`, rail: 'Market', required: false, screen: 'market' as const, productId: product.id },
    ])),
    { id: 'ready', chapter: 'ready', prompt: 'Ready to launch Hunter', rail: 'Go live', required: true, screen: 'ready' },
  ];

  const askIndex = Math.min(state.currentStep, Math.max(0, asks.length - 1));
  const ask = asks[askIndex];
  const currentProduct = ask.productId
    ? state.products.find((product) => product.id === ask.productId)
    : undefined;
  const sampleProduct = state.products.find((product) => product.sample);

  useEffect(() => {
    if (state.currentStep > asks.length - 1) {
      dispatch({ type: 'SET_STEP', step: Math.max(0, asks.length - 1) });
    }
  }, [state.currentStep, asks.length]);

  const chapterLabel = { company: 'Your company', sell: 'What you sell', ready: 'Finalize' } as const;
  const chapterAsks = asks.filter((item) => item.chapter === ask.chapter);
  const chapterPos = chapterAsks.findIndex((item) => item.id === ask.id) + 1;

  const requirementMet = (item: Ask) => {
    if (item.screen === 'industry') return Boolean(state.companyOverview.industry);
    if (item.screen === 'segment') return state.companyOverview.customerSegment.length > 0;
    if (item.screen === 'names') return namedProducts.length > 0 && userProducts.every((product) => product.name.trim().length > 0);
    return true;
  };

  const canAdvance = () => !ask.required || requirementMet(ask);
  const canOpen = (index: number) => asks.slice(0, index).every((item) => !item.required || requirementMet(item));

  const goTo = (index: number) => {
    const target = asks[index];
    const found = target?.productId
      ? state.products.findIndex((product) => product.id === target.productId)
      : 0;
    setSamplePreview(false);
    setShowGaps(false);
    dispatch({ type: 'SET_STEP', step: index, productIndex: found >= 0 ? found : 0 });
  };

  const openAsk = (id: string) => {
    const index = asks.findIndex((item) => item.id === id);
    if (index >= 0) goTo(index);
  };

  useEffect(() => {
    if (launch !== 'configuring') return;
    const timer = window.setTimeout(() => setLaunch('success'), 4200);
    return () => window.clearTimeout(timer);
  }, [launch]);

  const headerNote = showGaps
    ? null
    : ask.detail || (!ask.required ? 'Optional. Skip it if it does not apply yet.' : null);

  return (
    <DashboardNav>
    <div className="flex h-full min-h-0 overflow-hidden bg-piloteer-void text-piloteer-ink">
      {launch === 'edit' && (
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-piloteer-hair px-2.5 py-4">
        <p className="px-2 text-sm font-semibold">Teach Hunter</p>
        <p className="mt-1 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-mute">
          {String(askIndex + 1).padStart(2, '0')} / {String(asks.length).padStart(2, '0')}
        </p>
        <div className="mx-2 mt-2.5 h-1 overflow-hidden rounded-full bg-piloteer-surface">
          <div className="h-full rounded-full bg-piloteer-signal" style={{ width: `${Math.max(8, ((askIndex + 1) / asks.length) * 100)}%` }} />
        </div>
        <nav className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-label="Teach journey">
          {(['company', 'sell', 'ready'] as const).map((chapter) => {
            const items = asks.map((item, index) => ({ item, index })).filter(({ item }) => item.chapter === chapter);
            if (items.length === 0) return null;
            return (
              <div key={chapter}>
                <p className="px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-mute">{chapterLabel[chapter]}</p>
                <div className="mt-1 space-y-0.5">
                  {items.map(({ item, index }, position) => {
                    const active = index === askIndex && !showGaps;
                    const done = index < askIndex;
                    const open = canOpen(index);
                    const product = item.productId ? state.products.find((entry) => entry.id === item.productId) : undefined;
                    const previous = items[position - 1]?.item;
                    const showProduct = Boolean(product && previous?.productId !== item.productId);
                    return (
                      <div key={item.id}>
                        {showProduct && <p className="px-2 pb-0.5 pt-2 text-xs font-semibold">{product?.name}</p>}
                        <button
                          type="button"
                          disabled={!open && !active}
                          onClick={() => open && goTo(index)}
                          aria-current={active ? 'step' : undefined}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] ${
                            active
                              ? 'bg-piloteer-surface font-semibold text-piloteer-ink shadow-[inset_2px_0_0_#FF5C5C]'
                              : done
                                ? 'font-semibold text-piloteer-metal hover:bg-piloteer-surface-2 hover:text-piloteer-ink'
                                : 'text-piloteer-mute hover:bg-piloteer-surface-2 hover:text-piloteer-ink'
                          } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
                        >
                          <span className={`w-6 shrink-0 font-mono text-[11px] ${active ? 'text-piloteer-signal' : done ? 'text-piloteer-metal' : 'text-piloteer-mute'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 truncate">{item.rail}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
      )}

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-6 pb-4 pt-4">
        {launch === 'edit' && !samplePreview && ask.screen !== 'ready' && (
          <div className="flex shrink-0 items-stretch gap-5 pb-3">
            <div className="flex min-w-0 flex-1 flex-col justify-end">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-piloteer-signal">
                {ask.productId ? currentProduct?.name : chapterLabel[ask.chapter]}
                <span className="ml-3 tracking-[0.16em] text-piloteer-mute">{String(chapterPos).padStart(2, '0')} / {String(chapterAsks.length).padStart(2, '0')}</span>
              </p>
              <h1 className="mt-1 text-[32px] font-bold leading-tight tracking-editorial">{showGaps ? 'Review gaps' : ask.prompt}</h1>
              {headerNote ? <p className="mt-1.5 truncate text-sm text-piloteer-metal">{headerNote}</p> : null}
            </div>
            <StepMark
              index={askIndex}
              total={asks.length}
              label={ask.prompt}
              marks={chapterAsks.map((item) => asks.findIndex((entry) => entry.id === item.id))}
            />
          </div>
        )}

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 grid grid-rows-1">
            {launch !== 'edit' ? (
              <LaunchSequence
                percent={learningReport(state).percent}
                phase={launch}
                onPhase={setLaunch}
                onEnter={() => {
                  dispatch({ type: 'GO_LIVE' });
                  markTeachComplete();
                  router.push('/dashboard');
                }}
                onConsole={() => {
                  dispatch({ type: 'GO_LIVE' });
                  markTeachComplete();
                  router.push('/console');
                }}
              />
            ) : samplePreview && sampleProduct ? (
              <div className="flex h-full min-h-0 flex-col">
                <button type="button" onClick={() => setSamplePreview(false)} className="btn-ghost mb-2 self-start px-2 py-1">Back to your products</button>
                <div className="min-h-0 flex-1">
                  <ProductAboutStep product={sampleProduct} dispatch={dispatch} showToast={showToast} />
                </div>
              </div>
            ) : showGaps ? (
              <GapsContradictionsStep state={state} dispatch={dispatch} showToast={showToast} gaps={teachGaps(state)} onFix={openAsk} />
            ) : (
              renderStepContent(ask.screen, state, dispatch, showToast, keySignalsSubStep, setKeySignalsSubStep, currentProduct, () => setSamplePreview(true), () => setShowGaps(true), openAsk)
            )}
          </div>
        </div>

        {launch === 'edit' && !samplePreview && (
          <div className="mt-3 flex shrink-0 items-center justify-between border-t border-piloteer-hair pt-3">
            <button type="button" onClick={() => (showGaps ? setShowGaps(false) : goTo(askIndex - 1))} disabled={!showGaps && askIndex === 0} className="btn-ghost disabled:opacity-20">
              Back
            </button>
            {ask.screen === 'ready' && !showGaps ? (
              <button type="button" onClick={() => setLaunch('configuring')} className="btn-primary">Submit for configuration</button>
            ) : showGaps ? (
              <button type="button" onClick={() => setShowGaps(false)} className="btn-primary">Back to readiness</button>
            ) : (
              <div className="flex items-center gap-2">
                {!ask.required && (
                  <button type="button" onClick={() => goTo(askIndex + 1)} className="btn-ghost">Skip</button>
                )}
                <button type="button" onClick={() => goTo(askIndex + 1)} disabled={!canAdvance()} className="btn-primary disabled:opacity-30">
                  Continue
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 rounded-full bg-piloteer-ink px-5 py-3 text-piloteer-void">
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
    </DashboardNav>
  );
}

function renderStepContent(
  screen: 'industry' | 'segment' | 'deal-size' | 'cycle' | 'website' | 'stages' | 'framework' | 'names' | 'sources' | 'buyers' | 'playbook' | 'competitors' | 'market' | 'ready',
  state: TeachState,
  dispatch: React.Dispatch<TeachAction>,
  showToast: (message: string) => void,
  keySignalsSubStep: 'questions' | 'objectives' | 'differentiators' | 'objections',
  setKeySignalsSubStep: (step: 'questions' | 'objectives' | 'differentiators' | 'objections') => void,
  currentProduct: ProductTeach | undefined,
  onOpenSample: () => void,
  onReviewGaps: () => void,
  onOpenAsk: (id: string) => void
): React.ReactNode {
  if (screen === 'industry' || screen === 'segment' || screen === 'deal-size' || screen === 'cycle' || screen === 'website') {
    return <CompanyOverviewStep state={state} dispatch={dispatch} focus={screen} />;
  }
  if (screen === 'stages') return <DealStagesStep state={state} dispatch={dispatch} showToast={showToast} />;
  if (screen === 'framework') return <SalesFrameworkStep state={state} dispatch={dispatch} />;
  if (screen === 'names') return <ProductsStep state={state} dispatch={dispatch} onOpenSample={onOpenSample} />;
  if (screen === 'ready') return <VisibilityGoLiveStep state={state} onReviewGaps={onReviewGaps} onOpenAsk={onOpenAsk} />;
  if (!currentProduct) return <p className="text-base text-piloteer-metal">Name your products first.</p>;
  if (screen === 'sources') return <ProductAboutStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
  if (screen === 'buyers') return <ProductPersonasStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
  if (screen === 'playbook') {
    return (
      <ProductKeySignalsStep
        product={currentProduct}
        dispatch={dispatch}
        showToast={showToast}
        subStep={keySignalsSubStep}
        setSubStep={setKeySignalsSubStep}
      />
    );
  }
  if (screen === 'competitors') return <ProductCompetitiveStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
  if (screen === 'market') return <ProductMarketInfoStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
  return null;
}

// Step Components (each as a separate function component for clarity)

function StepMark({
  index,
  total,
  label,
  marks,
}: {
  index: number;
  total: number;
  label: string;
  marks: number[];
}) {
  const percent = Math.round(((index + 1) / total) * 100);
  return (
    <div className="relative flex h-[148px] w-[280px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-piloteer-hair bg-[radial-gradient(80%_80%_at_100%_0%,rgba(255,92,92,0.28),transparent_55%),linear-gradient(180deg,#1a1216_0%,#111117_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-piloteer-signal/40 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-piloteer-mute">This step</p>
        <p className="font-mono text-xs text-piloteer-metal">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
      </div>
      <div className="relative mt-1 flex items-end justify-between gap-3">
        <p className="font-disp text-[68px] font-bold leading-[0.8] tracking-editorial">{String(index + 1).padStart(2, '0')}</p>
        <div className="mb-1 flex max-w-[132px] flex-wrap justify-end gap-x-1.5 gap-y-0.5">
          {marks.map((stepIndex) => {
            const on = stepIndex === index;
            const done = stepIndex < index;
            return (
              <span
                key={stepIndex}
                className={`font-mono text-[11px] leading-none ${on ? 'font-bold text-piloteer-signal' : done ? 'text-piloteer-metal' : 'text-piloteer-faint'}`}
              >
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
            );
          })}
        </div>
      </div>
      <p className="relative mt-2 truncate text-sm font-semibold text-piloteer-metal">{label}</p>
      <div className="relative mt-auto h-1.5 overflow-hidden rounded-full bg-piloteer-void">
        <div className="h-full rounded-full bg-piloteer-signal" style={{ width: `${Math.max(8, percent)}%` }} />
      </div>
    </div>
  );
}

function ChoiceButton({
  index,
  title,
  detail,
  selected,
  onClick,
  large,
}: {
  index: number;
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-full min-h-0 items-center gap-4 rounded-2xl border px-4 text-left transition-colors ${
        selected
          ? 'border-piloteer-signal bg-gradient-to-r from-piloteer-signal/18 to-piloteer-surface shadow-[inset_3px_0_0_#FF5C5C]'
          : 'border-piloteer-hair bg-piloteer-surface hover:border-piloteer-hair-2 hover:bg-piloteer-surface-2'
      }`}
    >
      <span className={`shrink-0 leading-none ${large ? 'w-14 font-disp text-[32px] font-bold' : 'w-8 font-disp text-lg font-bold'} ${selected ? 'text-piloteer-signal' : 'text-piloteer-faint'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-disp font-semibold leading-tight ${large ? 'text-[28px]' : 'text-lg'}`}>{title}</span>
        <span className={`mt-0.5 block truncate text-piloteer-metal ${large ? 'text-base' : 'text-sm'}`}>{detail}</span>
      </span>
      <span className={`h-2 w-2 shrink-0 rounded-full ${selected ? 'bg-piloteer-signal shadow-[0_0_10px_#FF5C5C]' : 'bg-piloteer-hair-2'}`} />
    </button>
  );
}

function ChoiceBoard({
  options,
}: {
  options: { key: string; title: string; detail: string; selected: boolean; onClick: () => void }[];
}) {
  const large = options.length <= 4;
  return (
    <div
      className="grid h-full min-h-0 gap-2"
      style={{ gridTemplateRows: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option, index) => (
        <ChoiceButton
          key={option.key}
          index={index}
          title={option.title}
          detail={option.detail}
          selected={option.selected}
          onClick={option.onClick}
          large={large}
        />
      ))}
    </div>
  );
}

function CompanyOverviewStep({
  state,
  dispatch,
  focus,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  focus: 'industry' | 'segment' | 'deal-size' | 'cycle' | 'website';
}) {
  const industries = [
    ['Software / SaaS', 'Subscription products and usage-based software'],
    ['Financial Services', 'Banking, insurance, capital markets, fintech'],
    ['Healthcare', 'Providers, payers, and life sciences'],
    ['Manufacturing', 'Industrial, supply chain, and the plant floor'],
    ['Professional Services', 'Firms that sell expertise and time'],
    ['Technology', 'Hardware, infrastructure, and platforms'],
    ['Retail / E-commerce', 'Stores, marketplaces, and digital commerce'],
    ['Other', 'A market that doesn’t sit in the list'],
  ] as const;

  const segments: { value: CustomerSegment; label: string; detail: string }[] = [
    { value: 'smb', label: 'SMB', detail: 'One owner, a short evaluation, a faster yes' },
    { value: 'mid-market', label: 'Mid-Market', detail: 'A buying group, and a real process' },
    { value: 'enterprise', label: 'Enterprise', detail: 'Committees, security, and a longer path' },
    { value: 'mixed', label: 'Mixed', detail: 'More than one of these motions' },
  ];

  const dealSizes = [
    ['<$25K', 'A quick commercial close'],
    ['$25K-$100K', 'A defined evaluation'],
    ['$100K-$500K', 'Multiple stakeholders'],
    ['$500K+', 'An executive decision'],
  ] as const;

  const salesCycles = [
    ['<30 days', 'In and out inside a month'],
    ['30-90 days', 'A quarter to land'],
    ['90-180 days', 'A long evaluation'],
    ['180+ days', 'A strategic buy'],
  ] as const;

  const setField = (field: string, value: string) =>
    dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field, value });

  if (focus === 'website') {
    return (
      <label className="teach-panel justify-center px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-piloteer-mute">Company website</span>
        <input
          type="url"
          value={state.companyOverview.website}
          onChange={(e) => setField('website', e.target.value)}
          placeholder="https://company.com"
          aria-label="Company website"
          className="mt-4 w-full bg-transparent font-disp text-5xl font-bold tracking-editorial text-piloteer-ink outline-none placeholder:text-piloteer-faint"
        />
      </label>
    );
  }

  if (focus === 'industry') {
    return (
      <ChoiceBoard
        options={industries.map(([title, detail]) => ({
          key: title,
          title,
          detail,
          selected: state.companyOverview.industry === title,
          onClick: () => setField('industry', title),
        }))}
      />
    );
  }

  if (focus === 'segment') {
    return (
      <ChoiceBoard
        options={segments.map((segment) => ({
          key: segment.value,
          title: segment.label,
          detail: segment.detail,
          selected: state.companyOverview.customerSegment.includes(segment.value),
          onClick: () => {
            const current = state.companyOverview.customerSegment;
            const updated = current.includes(segment.value)
              ? current.filter((item) => item !== segment.value)
              : [...current, segment.value];
            dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'customerSegment', value: updated });
          },
        }))}
      />
    );
  }

  if (focus === 'deal-size') {
    return (
      <ChoiceBoard
        options={dealSizes.map(([title, detail]) => ({
          key: title,
          title,
          detail,
          selected: state.companyOverview.typicalDealSize === title,
          onClick: () => setField('typicalDealSize', title),
        }))}
      />
    );
  }

  return (
    <ChoiceBoard
      options={salesCycles.map(([title, detail]) => ({
        key: title,
        title,
        detail,
        selected: state.companyOverview.typicalSalesCycle === title,
        onClick: () => setField('typicalSalesCycle', title),
      }))}
    />
  );
}

function ProductsStep({
  state,
  dispatch,
  onOpenSample,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  onOpenSample: () => void;
}) {
  const sample = state.products.find((product) => product.sample);
  const userProducts = state.products.filter((product) => !product.sample);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center gap-3">
        {sample && (
          <button
            type="button"
            onClick={onOpenSample}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-piloteer-hair bg-piloteer-surface px-3 py-2.5 text-left hover:border-piloteer-hair-2 hover:bg-piloteer-surface-2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-piloteer-void font-disp text-base font-bold">
              {sample.name.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">{sample.name}</span>
                <span className="rounded-full bg-piloteer-ink px-1.5 py-0.5 text-[10px] font-semibold text-piloteer-void">Sample</span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-piloteer-mute">A filled example. Open it anytime.</span>
            </span>
          </button>
        )}
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-piloteer-hair bg-piloteer-surface px-3 py-2.5">
          <span className="mr-1 text-xs font-semibold text-piloteer-mute">How many</span>
          {[1, 2, 3, 4, 5, 6].map((count) => {
            const on = userProducts.length === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => dispatch({ type: 'SET_PRODUCT_COUNT', count })}
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-disp text-lg font-bold transition-colors ${
                  on ? 'bg-piloteer-signal text-white shadow-[0_0_24px_-8px_#FF5C5C]' : 'border border-piloteer-hair bg-piloteer-void text-piloteer-ink hover:border-piloteer-signal-line'
                }`}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      <section className="teach-panel p-4">
        <h2 className="text-sm font-semibold">Name them</h2>
        <p className="mt-1 text-xs text-piloteer-mute">Use the names your sellers already say out loud.</p>
        {userProducts.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-sm text-piloteer-metal">Pick how many products you sell, then name each one.</p>
        ) : (
          <div
            className="mt-3 grid min-h-0 flex-1 gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(userProducts.length, 3)}, minmax(0, 1fr))`,
              gridTemplateRows: userProducts.length > 3 ? '1fr 1fr' : '1fr',
            }}
          >
            {userProducts.map((product, index) => (
              <label key={product.id} className="flex min-h-0 flex-col rounded-2xl border border-piloteer-hair bg-piloteer-void/40 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-mute">Product {String(index + 1).padStart(2, '0')}</span>
                <input
                  value={product.name}
                  onChange={(e) => dispatch({ type: 'RENAME_PRODUCT', productId: product.id, name: e.target.value })}
                  placeholder="Product name"
                  aria-label={`Product ${index + 1} name`}
                  className="mt-4 w-full bg-transparent font-disp text-4xl font-bold tracking-editorial text-piloteer-ink outline-none placeholder:text-piloteer-faint"
                />
                <span className="mt-3 text-sm text-piloteer-mute">The name sellers already use.</span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HowYouSellStep({
  state,
  dispatch,
  showToast,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  return (
    <div className="space-y-16">
      <section>
        <h2 className="text-base font-semibold">Deal stages</h2>
        <p className="mt-2 max-w-xl text-sm text-piloteer-metal">Drag a stage to put it where it belongs. AI Gov, for example, can sit after Negotiation.</p>
        <div className="mt-6">
          <DealStagesStep state={state} dispatch={dispatch} showToast={showToast} />
        </div>
      </section>
      <section>
        <h2 className="text-base font-semibold">Sales framework</h2>
        <p className="mt-2 max-w-xl text-sm text-piloteer-metal">The motion your reps already run.</p>
        <div className="mt-6">
          <SalesFrameworkStep state={state} dispatch={dispatch} />
        </div>
      </section>
    </div>
  );
}

function DealStagesStep({
  state,
  dispatch,
  showToast,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const templateKeys = Object.keys(stageTemplates) as Array<keyof typeof stageTemplates>;
  const templateCopy: Record<keyof typeof stageTemplates, { label: string; line: string }> = {
    standard: { label: 'Standard', line: 'A straight path from first conversation to signature.' },
    enterprise: { label: 'Enterprise', line: 'Room for security, validation, and a buying committee.' },
    saas: { label: 'SaaS', line: 'A demo or a trial before the commercial close.' },
  };
  const matched = templateKeys.find(
    (key) =>
      stageTemplates[key].length === state.dealStages.length &&
      stageTemplates[key].every((stage, index) => state.dealStages[index]?.name === stage.name),
  );

  const loadTemplate = (key: keyof typeof stageTemplates) => {
    dispatch({ type: 'SET_DEAL_STAGES', stages: stageTemplates[key] });
    showToast(`Loaded ${templateCopy[key].label} template`);
  };

  if (state.dealStages.length === 0) {
    return (
      <div className="grid h-full min-h-0 grid-cols-3 gap-3">
        {templateKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => loadTemplate(key)}
            className="teach-panel p-5 text-left transition-colors hover:border-piloteer-signal"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-signal">Template</span>
            <span className="mt-2 block font-disp text-2xl font-bold tracking-editorial">{templateCopy[key].label}</span>
            <span className="mt-1 block text-sm leading-snug text-piloteer-metal">{templateCopy[key].line}</span>
            <ol className="mt-4 flex min-h-0 flex-1 flex-col justify-between border-t border-piloteer-hair pt-3">
              {stageTemplates[key].map((stage, index) => (
                <li key={stage.id} className="flex items-center gap-3">
                  <span className="w-5 font-mono text-[10px] text-piloteer-mute">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold">{stage.name}</span>
                </li>
              ))}
            </ol>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex gap-2">
          {templateKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => loadTemplate(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                matched === key ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink hover:bg-piloteer-surface-2'
              }`}
            >
              {templateCopy[key].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'ADD_DEAL_STAGE' });
            showToast('Stage added');
          }}
          className="rounded-full border border-piloteer-hair px-3 py-1.5 text-xs font-semibold text-piloteer-metal hover:border-piloteer-hair-2 hover:text-piloteer-ink"
        >
          Add stage
        </button>
      </div>

      <div
        className="grid min-h-[120px] shrink-0 gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(state.dealStages.length, 6)}, minmax(0, 1fr))` }}
      >
        {state.dealStages.map((stage, index) => (
          <div key={stage.id} className="flex min-w-0 flex-col justify-between rounded-2xl border border-piloteer-hair bg-[linear-gradient(180deg,#17171f,#111117)] px-3 py-3">
            <span className="font-mono text-[10px] text-piloteer-signal">{String(index + 1).padStart(2, '0')}</span>
            <span className="mt-3 truncate text-sm font-semibold">{stage.name || 'Untitled'}</span>
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1"
        style={{ gridTemplateRows: `repeat(${Math.max(state.dealStages.length, 1)}, minmax(52px, 1fr))` }}
      >
        {state.dealStages.map((stage, index) => (
          <div
            key={stage.id}
            onDragOverCapture={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const fromId = event.dataTransfer.getData('text/plain') || dragId;
              if (!fromId || fromId === stage.id) return;
              const stages = [...state.dealStages];
              const from = stages.findIndex((item) => item.id === fromId);
              const to = stages.findIndex((item) => item.id === stage.id);
              if (from < 0 || to < 0) return;
              const [moved] = stages.splice(from, 1);
              stages.splice(to, 0, moved);
              dispatch({ type: 'SET_DEAL_STAGES', stages });
              setDragId(null);
            }}
            className={`flex items-center gap-2 ${dragId === stage.id ? 'opacity-50' : ''}`}
          >
            <button
              type="button"
              draggable
              aria-label={`Drag to reorder ${stage.name || 'stage'}`}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', stage.id);
                setDragId(stage.id);
              }}
              onDragEnd={() => setDragId(null)}
              className="flex w-7 cursor-grab items-center justify-center text-piloteer-metal active:cursor-grabbing"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="9" cy="6" r="1.4" />
                <circle cx="15" cy="6" r="1.4" />
                <circle cx="9" cy="12" r="1.4" />
                <circle cx="15" cy="12" r="1.4" />
                <circle cx="9" cy="18" r="1.4" />
                <circle cx="15" cy="18" r="1.4" />
              </svg>
            </button>
            <span className="w-5 font-mono text-[11px] text-piloteer-mute">{String(index + 1).padStart(2, '0')}</span>
            <div className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-xl border border-piloteer-hair bg-piloteer-surface px-3">
              <input
                type="text"
                value={stage.name}
                onChange={(e) => dispatch({ type: 'UPDATE_DEAL_STAGE', id: stage.id, field: 'name', value: e.target.value })}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-piloteer-ink outline-none"
                placeholder="Stage"
              />
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'REMOVE_DEAL_STAGE', id: stage.id });
                  showToast('Stage removed');
                }}
                aria-label="Remove stage"
                className="text-piloteer-metal hover:text-piloteer-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesFrameworkStep({ state, dispatch }: { state: TeachState; dispatch: React.Dispatch<TeachAction> }) {
  const frameworks: SalesFramework[] = ['challenger', 'meddic', 'meddpicc', 'sandler', 'spin', 'miller-heiman', 'custom', 'none'];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="grid min-h-0 flex-1 grid-rows-1">
        <ChoiceBoard
          options={frameworks.map((framework) => {
            const info = frameworkDescriptions[framework];
            return {
              key: framework,
              title: info.name,
              detail: info.description,
              selected: state.salesFramework === framework,
              onClick: () => dispatch({ type: 'SET_SALES_FRAMEWORK', framework }),
            };
          })}
        />
      </div>
      {state.salesFramework === 'custom' && (
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <input
            type="text"
            value={state.customFrameworkName || ''}
            onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: e.target.value, notes: state.customFrameworkNotes })}
            className="teach-field"
            placeholder="Framework name"
            aria-label="Framework name"
          />
          <input
            type="text"
            value={state.customFrameworkNotes || ''}
            onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: state.customFrameworkName, notes: e.target.value })}
            className="teach-field"
            placeholder="Elements, separated by commas"
            aria-label="Framework elements"
          />
        </div>
      )}
    </div>
  );
}

function ProductAboutStep({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const [urlInput, setUrlInput] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const draftWithHunter = () => {
    setIsDrafting(true);
    window.setTimeout(() => {
      dispatch({ type: 'DRAFT_FROM_SOURCES', productId: product.id });
      setIsDrafting(false);
      showToast('Hunter drafted a starting point. Edit anything that is not true.');
    }, 700);
  };

  const handleFileUpload = () => {
    // Mock file upload
    const mockSource: TeachSource = {
      id: `src-${Date.now()}`,
      type: 'file',
      name: 'Product Documentation.pdf',
      size: '1.8 MB',
    };
    dispatch({ type: 'ADD_PRODUCT_SOURCE', productId: product.id, source: mockSource });
    showToast('File uploaded');
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const mockSource: TeachSource = {
        id: `src-${Date.now()}`,
        type: 'url',
        name: 'Product Page',
        url: urlInput,
      };
      dispatch({ type: 'ADD_PRODUCT_SOURCE', productId: product.id, source: mockSource });
      setUrlInput('');
      showToast('URL added');
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-3">
      <div className="teach-panel p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-piloteer-void font-disp text-lg font-bold">{(product.name || '·').slice(0, 1)}</span>
          <div>
            <h2 className="text-sm font-semibold">Sources</h2>
            <p className="text-xs text-piloteer-mute">Files and links Hunter can draft from.</p>
          </div>
          {product.sample && <span className="ml-auto rounded-full bg-piloteer-ink px-2 py-0.5 text-[10px] font-semibold text-piloteer-void">Sample</span>}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={handleFileUpload} className="rounded-xl border border-piloteer-hair bg-piloteer-void/60 px-3 py-3 text-left hover:border-piloteer-signal">
            <span className="block text-sm font-semibold">Upload files</span>
            <span className="mt-0.5 block text-xs text-piloteer-mute">PDFs, decks, one-pagers</span>
          </button>
          <form
            className="rounded-xl border border-piloteer-hair bg-piloteer-void/60 px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUrl();
            }}
          >
            <span className="block text-sm font-semibold">Add a link</span>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://"
                aria-label="Source URL"
                className="min-w-0 flex-1 bg-transparent text-sm text-piloteer-ink outline-none placeholder:text-piloteer-faint"
              />
              <button type="submit" disabled={!urlInput.trim()} className="text-sm font-semibold text-piloteer-signal disabled:opacity-30">Add</button>
            </div>
          </form>
        </div>
        <div className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
          {product.sources.length === 0 && (
            <p className="py-6 text-center text-sm text-piloteer-mute">Nothing added yet.</p>
          )}
          {product.sources.map((source) => (
            <div key={source.id} className="flex items-center gap-2 rounded-xl border border-piloteer-hair bg-piloteer-void/50 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-piloteer-mute">{source.type}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{source.name}</span>
              {source.size && <span className="text-xs text-piloteer-mute">{source.size}</span>}
              <button
                type="button"
                onClick={() => dispatch({ type: 'REMOVE_PRODUCT_SOURCE', productId: product.id, sourceId: source.id })}
                aria-label="Remove source"
                className="text-piloteer-metal hover:text-piloteer-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {!product.sample && (
          <div className="mt-3 flex shrink-0 items-center gap-3">
            <button type="button" onClick={draftWithHunter} disabled={isDrafting} className="btn-primary disabled:opacity-40">
              {isDrafting ? 'Hunter is drafting' : 'Draft with Hunter'}
            </button>
            {product.draftGenerated && <span className="text-xs text-piloteer-mute">Edit anything that isn’t true.</span>}
          </div>
        )}
      </div>

      <label className="teach-panel p-4">
        <span className="text-sm font-semibold">What does {product.name || 'this product'} do?</span>
        <span className="mt-0.5 block text-xs text-piloteer-mute">One clear picture. Hunter drafts from your sources, and you can rewrite it.</span>
        <textarea
          value={product.description}
          onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: 'description', value: e.target.value })}
          className="mt-3 min-h-0 w-full flex-1 resize-none bg-transparent font-disp text-xl font-semibold leading-snug tracking-editorial text-piloteer-ink outline-none placeholder:text-piloteer-faint"
          placeholder={`What does ${product.name || 'it'} do?`}
          aria-label={`Describe ${product.name}`}
        />
      </label>
    </div>
  );
}

function ProductPersonasStep({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = product.personas.find((persona) => persona.id === openId) || null;

  const handleAddPersona = () => {
    const newPersona: Persona = {
      id: `persona-${Date.now()}`,
      name: 'New persona',
      role: '',
      notes: '',
      titles: '',
      owns: '',
      accomplish: '',
      matters: '',
      hesitate: '',
      signals: '',
    };
    dispatch({ type: 'ADD_PERSONA', productId: product.id, persona: newPersona });
    showToast('Persona added');
    setOpenId(newPersona.id);
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .filter((part) => part && part !== 'of')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  const fields = [
    ['titles', 'Typical titles', 'CRO, VP Sales, RevOps'],
    ['owns', 'What they own', 'Forecast, team time, the systems'],
    ['accomplish', 'What they’re driving', 'The outcome they need this quarter'],
    ['matters', 'What has to be true', 'What they need to believe before yes'],
    ['hesitate', 'What makes them pause', 'The objection that slows the deal'],
    ['signals', 'Buying signals', 'How you know they’re leaning in'],
  ] as const;

  return (
    <div className="grid h-full min-h-0 grid-cols-[240px_minmax(0,1fr)] gap-3">
      <div className="teach-panel p-2">
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-1 pt-1">
          {product.personas.length === 0 && (
            <p className="px-2 py-6 text-center text-xs leading-relaxed text-piloteer-mute">No buyers yet. Add the people Hunter should recognize.</p>
          )}
          {product.personas.map((persona) => {
            const selected = openId === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => setOpenId(selected ? null : persona.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${
                  selected ? 'bg-piloteer-ink text-piloteer-void' : 'hover:bg-piloteer-surface-2'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${selected ? 'bg-piloteer-void text-piloteer-ink' : 'bg-piloteer-void text-piloteer-ink'}`}>
                  {initials(persona.name) || '·'}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{persona.name}</span>
                  <span className={`block truncate text-[11px] ${selected ? 'text-piloteer-void/70' : 'text-piloteer-mute'}`}>{persona.role || 'Role'}</span>
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={handleAddPersona} className="mt-1 shrink-0 rounded-xl border border-dashed border-piloteer-hair px-3 py-2 text-sm font-semibold text-piloteer-metal hover:border-piloteer-hair-2 hover:text-piloteer-ink">
          Add persona
        </button>
      </div>

      <div className="teach-panel p-4">
        {!open ? (
          <div className="flex flex-1 flex-col items-start justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-piloteer-signal">Buyer</p>
            <p className="mt-2 font-disp text-2xl font-bold tracking-editorial">Who has to say yes?</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-piloteer-metal">Add a persona, then teach Hunter the title, the outcome, and the thing that makes them hesitate.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <input
                value={open.name}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field: 'name', value: e.target.value })
                }
                className="min-w-0 flex-1 bg-transparent font-disp text-xl font-bold tracking-editorial outline-none"
                aria-label="Persona name"
              />
              <input
                value={open.role}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field: 'role', value: e.target.value })
                }
                placeholder="Role"
                className="w-40 bg-transparent text-sm text-piloteer-metal outline-none placeholder:text-piloteer-faint"
                aria-label="Role"
              />
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'REMOVE_PERSONA', productId: product.id, personaId: open.id });
                  showToast('Persona removed');
                  setOpenId(null);
                }}
                aria-label="Remove persona"
                className="text-piloteer-metal hover:text-piloteer-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2">
              {fields.map(([field, label, hint]) => (
                <label key={field} className="flex min-h-0 flex-col">
                  <span className="mb-1 text-xs font-semibold text-piloteer-metal">{label}</span>
                  <input
                    value={open[field]}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field, value: e.target.value })
                    }
                    placeholder={hint}
                    className="teach-field min-h-0 flex-1"
                  />
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductKeySignalsStep({
  product,
  dispatch,
  showToast,
  subStep,
  setSubStep,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
  subStep: 'questions' | 'objectives' | 'differentiators' | 'objections';
  setSubStep: (step: 'questions' | 'objectives' | 'differentiators' | 'objections') => void;
}) {
  const subSteps = [
    { id: 'questions' as const, label: 'Discovery Questions', completed: product.keyQuestions.length > 0 },
    { id: 'objectives' as const, label: 'Key Objectives', completed: product.keyObjectives.length > 0 },
    { id: 'differentiators' as const, label: 'Differentiators', completed: product.differentiators.length > 0 },
    { id: 'objections' as const, label: 'Objections & Counters', completed: product.objections.length > 0 },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="grid shrink-0 grid-cols-4 gap-2">
        {subSteps.map((step, idx) => {
          const active = subStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setSubStep(step.id)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                active
                  ? 'border-piloteer-signal bg-piloteer-signal-soft text-piloteer-ink shadow-[inset_0_-2px_0_#FF5C5C]'
                  : 'border-piloteer-hair text-piloteer-metal hover:border-piloteer-hair-2 hover:text-piloteer-ink'
              }`}
            >
              <span className={`font-mono text-[10px] ${active ? 'text-piloteer-signal' : 'text-piloteer-mute'}`}>0{idx + 1}</span>
              <span className="truncate text-sm font-semibold">{step.label}</span>
              {step.completed && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-piloteer-verified" />}
            </button>
          );
        })}
      </div>
      <div className="min-h-0 flex-1">
        {subStep === 'questions' && <KeyQuestionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'objectives' && <KeyObjectivesWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'differentiators' && <DifferentiatorsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'objections' && <ObjectionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
      </div>
    </div>
  );
}

function PlaybookRows({
  columns,
  rows,
  onChange,
  onRemove,
  onAdd,
}: {
  columns: { key: string; label: string }[];
  rows: { id: string; values: Record<string, string> }[];
  onChange: (id: string, key: string, value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  const grid = columns.length > 1
    ? 'grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)_1.5rem]'
    : 'grid-cols-[1.75rem_minmax(0,1fr)_1.5rem]';

  return (
    <div className="teach-panel h-full">
      <div className={`grid shrink-0 ${grid} gap-x-4 border-b border-piloteer-hair px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-piloteer-mute`}>
        <span />
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
        <span />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-piloteer-mute">Nothing here yet. Add the first line Hunter should recognize.</p>
        )}
        {rows.map((row, index) => (
          <div key={row.id} className={`grid ${grid} items-center gap-x-4 border-b border-piloteer-hair/80 px-4 py-2`}>
            <span className="font-mono text-[11px] text-piloteer-mute">{String(index + 1).padStart(2, '0')}</span>
            {columns.map((column) => (
              <input
                key={column.key}
                type="text"
                value={row.values[column.key] ?? ''}
                onChange={(event) => onChange(row.id, column.key, event.target.value)}
                aria-label={column.label}
                placeholder={column.label}
                className="w-full bg-transparent text-sm text-piloteer-ink outline-none placeholder:text-piloteer-faint"
              />
            ))}
            <button type="button" onClick={() => onRemove(row.id)} aria-label="Remove" className="text-piloteer-metal hover:text-piloteer-ink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className="shrink-0 border-t border-piloteer-hair px-4 py-2.5 text-left text-sm font-semibold text-piloteer-signal hover:text-piloteer-ink">
        Add a line
      </button>
    </div>
  );
}

function KeyQuestionsWorkshop({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  return (
    <PlaybookRows
      columns={[{ key: 'question', label: 'Discovery question' }]}
      rows={product.keyQuestions.map((question, index) => ({ id: String(index), values: { question } }))}
      onChange={(id, _key, value) => dispatch({ type: 'UPDATE_KEY_QUESTION', productId: product.id, index: Number(id), value })}
      onRemove={(id) => {
        dispatch({ type: 'REMOVE_KEY_QUESTION', productId: product.id, index: Number(id) });
        showToast('Question removed');
      }}
      onAdd={() => {
        dispatch({ type: 'ADD_KEY_QUESTION', productId: product.id, question: '' });
        showToast('Question added');
      }}
    />
  );
}

function KeyObjectivesWorkshop({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  return (
    <PlaybookRows
      columns={[{ key: 'objective', label: 'Key objective' }]}
      rows={product.keyObjectives.map((objective, index) => ({ id: String(index), values: { objective } }))}
      onChange={(id, _key, value) => dispatch({ type: 'UPDATE_KEY_OBJECTIVE', productId: product.id, index: Number(id), value })}
      onRemove={(id) => {
        dispatch({ type: 'REMOVE_KEY_OBJECTIVE', productId: product.id, index: Number(id) });
        showToast('Objective removed');
      }}
      onAdd={() => {
        dispatch({ type: 'ADD_KEY_OBJECTIVE', productId: product.id, objective: '' });
        showToast('Objective added');
      }}
    />
  );
}

function DifferentiatorsWorkshop({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const handleAddDifferentiator = () => {
    const newDiff: Differentiator = {
      id: `diff-${Date.now()}`,
      they: '',
      we: '',
    };
    dispatch({ type: 'ADD_DIFFERENTIATOR', productId: product.id, differentiator: newDiff });
    showToast('Differentiator added');
  };

  return (
    <PlaybookRows
      columns={[
        { key: 'they', label: 'They' },
        { key: 'we', label: 'We' },
      ]}
      rows={product.differentiators.map((diff) => ({ id: diff.id, values: { they: diff.they, we: diff.we } }))}
      onChange={(id, key, value) => dispatch({ type: 'UPDATE_DIFFERENTIATOR', productId: product.id, diffId: id, field: key, value })}
      onRemove={(id) => {
        dispatch({ type: 'REMOVE_DIFFERENTIATOR', productId: product.id, diffId: id });
        showToast('Differentiator removed');
      }}
      onAdd={handleAddDifferentiator}
    />
  );
}

function ObjectionsWorkshop({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const handleAddObjection = () => {
    const newObjection: Objection = {
      id: `obj-${Date.now()}`,
      objection: '',
      counter: '',
    };
    dispatch({ type: 'ADD_OBJECTION', productId: product.id, objection: newObjection });
    showToast('Objection added');
  };

  return (
    <PlaybookRows
      columns={[
        { key: 'objection', label: 'Objection' },
        { key: 'counter', label: 'Counter' },
      ]}
      rows={product.objections.map((obj) => ({ id: obj.id, values: { objection: obj.objection, counter: obj.counter } }))}
      onChange={(id, key, value) => dispatch({ type: 'UPDATE_OBJECTION', productId: product.id, objId: id, field: key, value })}
      onRemove={(id) => {
        dispatch({ type: 'REMOVE_OBJECTION', productId: product.id, objId: id });
        showToast('Objection removed');
      }}
      onAdd={handleAddObjection}
    />
  );
}

function ProductCompetitiveStep({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const handleAddCompetitor = () => {
    const newComp: Competitor = {
      id: `comp-${Date.now()}`,
      name: '',
      profile: '',
      whyChoose: '',
      fallShort: '',
      emphasize: '',
      objection: '',
      response: '',
    };
    dispatch({ type: 'ADD_COMPETITOR', productId: product.id, competitor: newComp });
    showToast('Competitor added');
  };

  const [activeId, setActiveId] = useState<string | null>(product.competitors[0]?.id ?? null);
  const active = product.competitors.find((comp) => comp.id === activeId) || product.competitors[0];

  const fields = [
    ['whyChoose', 'Why buyers choose them'],
    ['fallShort', 'Where they fall short'],
    ['emphasize', 'What reps should emphasize'],
    ['objection', 'Common objection'],
    ['response', 'Best response'],
  ] as const;

  return (
    <div className="grid h-full min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-3">
      <div className="teach-panel p-2">
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-1 pt-1">
          {product.competitors.length === 0 && (
            <p className="px-2 py-6 text-center text-xs leading-relaxed text-piloteer-mute">No competitors yet.</p>
          )}
          {product.competitors.map((comp) => {
            const selected = active?.id === comp.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setActiveId(comp.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${
                  selected ? 'bg-piloteer-ink text-piloteer-void' : 'hover:bg-piloteer-surface-2'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-disp text-sm font-bold ${selected ? 'bg-piloteer-void text-piloteer-ink' : 'bg-piloteer-void'}`}>
                  {(comp.name || '·').slice(0, 1)}
                </span>
                <span className="min-w-0 truncate text-sm font-semibold">{comp.name || 'Untitled'}</span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={handleAddCompetitor} className="mt-1 shrink-0 rounded-xl border border-dashed border-piloteer-hair px-3 py-2 text-sm font-semibold text-piloteer-metal hover:border-piloteer-hair-2 hover:text-piloteer-ink">
          Add competitor
        </button>
      </div>

      <div className="teach-panel p-4">
        {!active ? (
          <div className="flex flex-1 flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-piloteer-signal">Competitor</p>
            <p className="mt-2 font-disp text-2xl font-bold tracking-editorial">Who do you sell against?</p>
            <p className="mt-2 max-w-md text-sm text-piloteer-metal">Name them, then say why buyers pick them and where they fall short.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <input
                value={active.name}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: active.id, field: 'name', value: e.target.value })
                }
                className="min-w-0 flex-1 bg-transparent font-disp text-xl font-bold tracking-editorial outline-none"
                aria-label="Competitor name"
                placeholder="Competitor name"
              />
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'REMOVE_COMPETITOR', productId: product.id, compId: active.id });
                  showToast('Competitor removed');
                  setActiveId(null);
                }}
                aria-label="Remove competitor"
                className="text-piloteer-metal hover:text-piloteer-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2">
              {fields.map(([field, label]) => (
                <label key={field} className={`flex min-h-0 flex-col ${field === 'response' ? 'col-span-2' : ''}`}>
                  <span className="mb-1 text-xs font-semibold text-piloteer-metal">{label}</span>
                  <textarea
                    value={active[field]}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: active.id, field, value: e.target.value })
                    }
                    className="teach-field min-h-0 flex-1 resize-none"
                  />
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductMarketInfoStep({
  product,
  dispatch,
  showToast,
}: {
  product: ProductTeach;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const handleAddSignal = (category: 'buyerEnvironment' | 'companyProductEnvironment' | 'dealEnvironmentSignals') => {
    const signal: MarketSignal = {
      id: `signal-${Date.now()}`,
      signal: '',
    };
    dispatch({ type: 'ADD_MARKET_SIGNAL', productId: product.id, category, signal });
    showToast('Signal added');
  };

  const columns: {
    category: 'buyerEnvironment' | 'companyProductEnvironment' | 'dealEnvironmentSignals';
    title: string;
    context: string;
    examples: string[];
  }[] = [
    {
      category: 'buyerEnvironment',
      title: 'Buyer environment',
      context: 'Pressures changing how customers buy.',
      examples: ['Budget got tighter', 'Doing more with fewer people', 'Harder to add another vendor'],
    },
    {
      category: 'companyProductEnvironment',
      title: 'Industry trends',
      context: 'What’s changing in your buyers’ world?',
      examples: ['Everyone is pushing AI', 'New compliance requirements', 'Competitors are moving faster'],
    },
    {
      category: 'dealEnvironmentSignals',
      title: 'Macro factors',
      context: 'Broader forces affecting deals.',
      examples: ['Spend is under more scrutiny', 'Deals are taking longer to approve', 'Hiring is still tight'],
    },
  ];

  return (
    <div className="grid h-full min-h-0 grid-cols-3 gap-3">
      {columns.map((column) => {
        const signals = product[column.category];
        return (
          <section key={column.category} className="teach-panel p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">{column.title}</h2>
                <p className="mt-0.5 text-xs text-piloteer-mute">{column.context}</p>
              </div>
              <button
                type="button"
                onClick={() => handleAddSignal(column.category)}
                aria-label={`Add ${column.title}`}
                className="rounded-full border border-piloteer-hair px-2 py-0.5 text-sm text-piloteer-metal hover:text-piloteer-ink"
              >
                +
              </button>
            </div>
            <div
              className="mt-3 grid min-h-0 flex-1 gap-2 overflow-y-auto"
              style={{ gridTemplateRows: `repeat(${column.examples.length + signals.filter((signal) => !column.examples.includes(signal.signal)).length}, minmax(64px, 1fr))` }}
            >
              {column.examples.map((example) => {
                const used = signals.some((item) => item.signal === example);
                return (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      if (used) return;
                      dispatch({
                        type: 'ADD_MARKET_SIGNAL',
                        productId: product.id,
                        category: column.category,
                        signal: { id: `sig-${Date.now()}`, signal: example },
                      });
                    }}
                    className={`flex h-full items-center justify-between gap-3 rounded-xl border px-3 text-left text-sm ${
                      used
                        ? 'border-piloteer-verified-line bg-piloteer-verified-soft text-piloteer-ink'
                        : 'border-piloteer-hair bg-piloteer-void/40 text-piloteer-metal hover:border-piloteer-hair-2 hover:text-piloteer-ink'
                    }`}
                  >
                    <span>{example}</span>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${used ? 'bg-piloteer-verified' : 'bg-piloteer-hair-2'}`} />
                  </button>
                );
              })}
              {signals.filter((signal) => !column.examples.includes(signal.signal)).map((signal) => (
                <div key={signal.id} className="flex items-center gap-2 rounded-xl border border-piloteer-hair bg-piloteer-void/50 px-3 py-2">
                  <input
                    value={signal.signal}
                    onChange={(e) => {
                      const updatedSignals = signals.map((item) =>
                        item.id === signal.id ? { ...item, signal: e.target.value } : item
                      );
                      dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: column.category, value: updatedSignals });
                    }}
                    className="min-w-0 flex-1 bg-transparent text-sm text-piloteer-ink outline-none"
                    aria-label={column.title}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'REMOVE_MARKET_SIGNAL', productId: product.id, category: column.category, signalId: signal.id });
                      showToast('Signal removed');
                    }}
                    aria-label="Remove signal"
                    className="text-piloteer-metal hover:text-piloteer-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function GapsContradictionsStep({
  state,
  dispatch,
  showToast,
  gaps,
  onFix,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
  gaps: TeachGap[];
  onFix: (id: string) => void;
}) {
  const unresolvedContradictions = state.contradictions.filter((c) => !c.resolved);
  const resolvedContradictions = state.contradictions.filter((c) => c.resolved);

  const [focus, setFocus] = useState(0);
  const [reviewing, setReviewing] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setReviewing(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);
  const open = unresolvedContradictions;
  const index = open.length === 0 ? 0 : Math.min(focus, open.length - 1);
  const current = open[index];

  if (reviewing) {
    return (
      <div className="flex h-full items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-piloteer-signal" />
            <p className="text-lg font-semibold">Hunter is reviewing what you entered.</p>
          </div>
          <p className="mt-2 text-sm text-piloteer-metal">Looking for gaps across products, buyers, and the playbook.</p>
        </div>
      </div>
    );
  }

  if (!current && resolvedContradictions.length === 0) {
    return <OpenGaps gaps={gaps} onFix={onFix} />;
  }

  if (!current) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <ul className="shrink-0">
          {resolvedContradictions.map((contradiction) => (
            <li key={contradiction.id} className="flex items-center justify-between gap-6 border-t border-piloteer-hair py-2.5">
              <span className="text-sm font-semibold">{contradiction.title}</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-piloteer-verified">
                {contradiction.resolution === 'option1' ? 'A' : 'B'}
              </span>
            </li>
          ))}
        </ul>
        <div className="min-h-0 flex-1">
          <OpenGaps gaps={gaps} onFix={onFix} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex shrink-0 items-center gap-1.5">
        {state.contradictions.map((contradiction) => (
          <span
            key={contradiction.id}
            className={`h-1.5 rounded-full ${
              contradiction.id === current.id
                ? 'w-7 bg-piloteer-ink'
                : contradiction.resolved
                ? 'w-1.5 bg-piloteer-verified'
                : 'w-1.5 bg-piloteer-hair-2'
            }`}
          />
        ))}
      </div>
      <h2 className="shrink-0 font-disp text-2xl font-bold leading-tight tracking-editorial">{current.title}</h2>
      <p className="mt-2 max-w-3xl shrink-0 text-sm leading-relaxed text-piloteer-metal">{current.description}</p>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: current.id, resolution: 'option1' });
            showToast('Conflict resolved');
            setFocus(0);
          }}
          className="teach-panel p-5 text-left transition-colors hover:border-piloteer-signal"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-signal">Option A</div>
          <p className="mt-3 text-lg font-semibold leading-snug">{current.option1}</p>
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: current.id, resolution: 'option2' });
            showToast('Conflict resolved');
            setFocus(0);
          }}
          className="teach-panel p-5 text-left transition-colors hover:border-piloteer-signal"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-piloteer-signal">Option B</div>
          <p className="mt-3 text-lg font-semibold leading-snug">{current.option2}</p>
        </button>
      </div>
    </div>
  );
}

type TeachGap = { id: string; label: string; done: boolean };

function OpenGaps({ gaps, onFix }: { gaps: TeachGap[]; onFix: (id: string) => void }) {
  const open = gaps.filter((gap) => !gap.done);
  if (open.length === 0) {
    return (
      <div className="flex h-full items-center">
        <p className="font-disp text-2xl font-bold tracking-editorial">Nothing conflicts with what you have entered.</p>
      </div>
    );
  }
  const rows = Math.ceil(open.length / 2);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <h1 className="shrink-0 text-[26px] font-bold leading-tight tracking-editorial">Review gaps</h1>
      <p className="mt-1 shrink-0 text-xs text-piloteer-mute">These are still open. Open one to fill it in.</p>
      <ul
        className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(52px, 1fr))` }}
      >
        {open.map((gap) => (
          <li key={gap.id} className="flex h-full items-center justify-between gap-4 rounded-xl border border-piloteer-hair bg-piloteer-surface px-4">
            <span className="truncate text-sm font-semibold">{gap.label}</span>
            <button type="button" onClick={() => onFix(gap.id)} className="shrink-0 text-xs font-semibold text-piloteer-signal">Fix</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function learningReport(state: TeachState) {
  const company = state.companyOverview;
  const steps = [
    { label: 'Industry', askId: 'industry', done: Boolean(company.industry) },
    { label: 'Who you sell to', askId: 'segment', done: company.customerSegment.length > 0 },
    { label: 'Deal size', askId: 'deal-size', done: Boolean(company.typicalDealSize) },
    { label: 'Sales cycle', askId: 'cycle', done: Boolean(company.typicalSalesCycle) },
    { label: 'Website', askId: 'website', done: Boolean(company.website.trim()) },
    { label: 'Deal stages', askId: 'stages', done: state.dealStages.length >= 3 },
    { label: 'Sales framework', askId: 'framework', done: Boolean(state.salesFramework) },
  ];
  const productScores = state.products.filter((product) => product.name.trim()).map((product) => {
    const askId = (screen: string) => (product.sample ? undefined : `${screen}-${product.id}`);
    const parts = [
      { label: 'Sources', askId: askId('sources'), done: product.sources.length > 0 || product.description.trim().length > 20 },
      { label: 'Buyers', askId: askId('buyers'), done: product.personas.length > 0 },
      { label: 'Playbook', askId: askId('playbook'), done: product.keyQuestions.length + product.keyObjectives.length + product.differentiators.length + product.objections.length > 0 },
      { label: 'Competitors', askId: askId('competitors'), done: product.competitors.length > 0 },
      { label: 'Market', askId: askId('market'), done: product.buyerEnvironment.length + product.companyProductEnvironment.length + product.dealEnvironmentSignals.length > 0 },
    ];
    const score = Math.round((parts.filter((part) => part.done).length / parts.length) * 100);
    return { product, parts, score };
  });
  const counted = productScores.filter((item) => !item.product.sample);
  const bits = [...steps.map((step) => step.done), ...counted.flatMap((item) => item.parts.map((part) => part.done))];
  const percent = bits.length === 0 ? 0 : Math.round((bits.filter(Boolean).length / bits.length) * 100);
  return { percent, steps, productScores };
}

function teachGaps(state: TeachState): TeachGap[] {
  const report = learningReport(state);
  return [
    ...report.steps.map((step) => ({ id: step.askId, label: step.label, done: step.done })),
    ...report.productScores
      .filter((item) => !item.product.sample)
      .flatMap(({ product, parts }) =>
        parts.flatMap((part) => (part.askId ? [{ id: part.askId, label: `${product.name} · ${part.label}`, done: part.done }] : []))
      ),
  ];
}

function ScoreRing({ percent, size = 148, label = 'Learned' }: { percent: number; size?: number; label?: string }) {
  const ring = Math.max(10, Math.round(size * 0.08));
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(#5BC08D ${percent * 3.6}deg, #1c1c22 0deg)` }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center rounded-full bg-piloteer-void" style={{ width: size - ring * 2, height: size - ring * 2 }}>
        <span className="font-disp text-3xl font-bold leading-none tracking-editorial">{percent}%</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-piloteer-mute">{label}</span>
      </div>
    </div>
  );
}

function VisibilityGoLiveStep({
  state,
  onReviewGaps,
  onOpenAsk,
}: {
  state: TeachState;
  onReviewGaps: () => void;
  onOpenAsk: (id: string) => void;
}) {
  const report = learningReport(state);
  const ready = report.percent >= 80;
  const next = [
    ['1', 'Piloteer configures your account', 'We set up your environment from what you entered.'],
    ['2', 'Add your team', 'Invite managers and reps, and set their access.'],
    ['3', 'Download the console', 'Get Hunter Console onto the devices sellers use.'],
    ['4', 'Go live with Hunter', 'Sellers start getting guidance in the conversation.'],
  ];

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3">
      <div className="flex items-center gap-5">
        <ScoreRing percent={report.percent} size={104} label="Ready" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-piloteer-signal">Overall readiness</p>
          <h1 className="mt-1 font-disp text-[26px] font-bold leading-none tracking-editorial">
            {ready ? 'Ready to launch Hunter' : 'Hunter has a first read.'}
          </h1>
          <p className="mt-1.5 max-w-2xl truncate text-sm text-piloteer-metal">
            {ready
              ? 'Strong enough to launch. Real-time sensing stays on. Nothing goes live until you submit.'
              : `${report.percent}% of the teaching is in. A few gaps can still sharpen guidance. Nothing goes live until you submit.`}
          </p>
        </div>
        <button type="button" onClick={onReviewGaps} className="btn-secondary shrink-0">Review gaps</button>
      </div>

      <div className="grid min-h-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
        <section className="teach-panel p-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-piloteer-mute">Company</h2>
          <ul className="mt-2 min-h-0 flex-1 overflow-y-auto">
            {report.steps.map((step) => (
              <li key={step.askId}>
                <button
                  type="button"
                  onClick={() => onOpenAsk(step.askId)}
                  className="flex w-full items-center gap-3 border-t border-piloteer-hair py-2 text-left hover:text-piloteer-signal"
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${step.done ? 'bg-piloteer-verified' : 'bg-piloteer-signal'}`} />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{step.label}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${step.done ? 'text-piloteer-verified' : 'text-piloteer-mute'}`}>
                    {step.done ? 'In' : 'Open'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex min-h-0 flex-col gap-3">
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {report.productScores.map(({ product, parts, score }) => (
              <div key={product.id} className="rounded-2xl border border-piloteer-hair bg-piloteer-surface px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-piloteer-mute">{product.sample ? 'Sample' : 'Product'}</p>
                    <p className="truncate font-disp text-lg font-bold">{product.name}</p>
                  </div>
                  <p className="font-disp text-2xl font-bold">{score}%</p>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-piloteer-void">
                  <div className={`h-full rounded-full ${score >= 80 ? 'bg-piloteer-verified' : 'bg-piloteer-signal'}`} style={{ width: `${score}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parts.map((part) => (
                    part.done || !part.askId ? (
                      <span key={part.label} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${part.done ? 'bg-piloteer-verified-soft text-piloteer-verified' : 'bg-piloteer-void text-piloteer-mute'}`}>
                        {part.label}
                      </span>
                    ) : (
                      <button key={part.label} type="button" onClick={() => onOpenAsk(part.askId!)} className="rounded-full bg-piloteer-void px-2 py-0.5 text-[11px] font-semibold text-piloteer-signal hover:text-piloteer-ink">
                        Fix {part.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid shrink-0 grid-cols-4 gap-2">
            {next.map(([n, title, detail]) => (
              <div key={n} className="rounded-xl border border-piloteer-hair bg-piloteer-plane px-3 py-2.5">
                <p className="font-mono text-[10px] text-piloteer-signal">{n}</p>
                <p className="mt-1 text-xs font-semibold leading-snug">{title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-piloteer-mute">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="truncate text-xs text-piloteer-mute">
        Your setup stays private. Sellers start and stop sensing. Leaders see patterns, not a live feed of someone else’s call.
      </p>
    </div>
  );
}

function LaunchSequence({
  percent,
  phase,
  onPhase,
  onEnter,
  onConsole,
}: {
  percent: number;
  phase: 'configuring' | 'success' | 'team' | 'console';
  onPhase: (phase: 'configuring' | 'success' | 'team' | 'console') => void;
  onEnter: () => void;
  onConsole: () => void;
}) {
  const [tick, setTick] = useState(0);
  const [people, setPeople] = useState<{ name: string; email: string; role: string }[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sales rep');
  const lines = [
    'Reading your products and buyers',
    'Turning sensing on',
    'Writing the sales playbook',
    'Preparing Hunter Console',
  ];

  useEffect(() => {
    if (phase !== 'configuring') return;
    const timer = window.setInterval(() => setTick((current) => current + 1), 900);
    return () => window.clearInterval(timer);
  }, [phase]);

  if (phase === 'configuring') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-piloteer-signal">Configuring</p>
          <h1 className="mt-2 font-disp text-[28px] font-bold tracking-editorial">Piloteer is configuring Hunter.</h1>
          <ul className="mt-5 space-y-2">
            {lines.map((line, index) => (
              <li key={line} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${index <= tick ? 'bg-piloteer-surface text-piloteer-ink' : 'text-piloteer-mute'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${index <= tick ? 'bg-piloteer-signal shadow-[0_0_8px_#FF5C5C]' : 'bg-piloteer-hair'}`} />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="grid w-full max-w-3xl items-center gap-8 grid-cols-[auto_minmax(0,1fr)]">
          <ScoreRing percent={percent} size={148} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-piloteer-verified">Configured</p>
            <h1 className="mt-2 font-disp text-[32px] font-bold leading-none tracking-editorial">Hunter is configured.</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-piloteer-metal">{percent}% of the teaching is in the account. Nothing is live for the team until you invite them and they open Console.</p>
            <button type="button" onClick={() => onPhase('team')} className="btn-primary mt-5">Add your team</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'team') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="grid w-full max-w-4xl grid-cols-2 gap-8">
          <div>
            <h1 className="font-disp text-[28px] font-bold tracking-editorial">Add your team</h1>
            <p className="mt-2 text-sm text-piloteer-metal">These are the people who sell. Prospects stay in the CRM.</p>
            <form
              className="mt-5 space-y-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!name.trim() || !email.trim()) return;
                setPeople((current) => [...current, { name: name.trim(), email: email.trim(), role }]);
                setName('');
                setEmail('');
              }}
            >
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" aria-label="Name" className="teach-field" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" aria-label="Email" className="teach-field" />
              <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Role" className="teach-field">
                <option>Sales rep</option>
                <option>Sales manager</option>
              </select>
              <button type="submit" className="btn-secondary">Send invite</button>
            </form>
          </div>
          <div className="teach-panel p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-piloteer-mute">Invited</p>
            <ul className="mt-2 min-h-0 flex-1 overflow-y-auto">
              {people.length === 0 && <li className="py-6 text-sm text-piloteer-mute">No one invited yet.</li>}
              {people.map((person) => (
                <li key={person.email} className="border-t border-piloteer-hair py-2 text-sm">
                  <span className="font-semibold">{person.name}</span>
                  <span className="text-piloteer-metal"> · {person.role}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => onPhase('console')} className="btn-primary mt-3 self-start">Download the console</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-xl">
      <h1 className="font-disp text-[28px] font-bold tracking-editorial">Download the console</h1>
      <p className="mt-2 text-sm text-piloteer-metal">Hunter Console is where a seller starts, pauses, and stops sensing. Live guidance stays on their device.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            const file = new Blob(
              ['Hunter Console\n\nPut this on the devices your sellers use.\nSellers start, pause, and stop sensing. Live guidance stays on their device.\n'],
              { type: 'text/plain;charset=utf-8' },
            );
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Hunter-Console.txt';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
          }}
          className="btn-primary"
        >
          Download Console
        </button>
        <button type="button" onClick={onConsole} className="btn-secondary">Open Console</button>
        <button type="button" onClick={onEnter} className="btn-ghost">Go to your book</button>
      </div>
      </div>
    </div>
  );
}
