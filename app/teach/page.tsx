'use client';

import { useState, useReducer, useEffect } from 'react';
import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';
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
} from '@/lib/data/teachData';

type TeachAction =
  | { type: 'SET_STEP'; step: number }
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
    case 'SET_STEP': {
      // Derive activeProductIndex from step number
      // Steps 0-2: org (no product)
      // Steps 3-7: product 0
      // Steps 8-12: product 1
      // Steps 13+: finalize (no product)
      let productIndex = state.activeProductIndex;
      if (action.step >= 3 && action.step <= 7) {
        productIndex = 0;
      } else if (action.step >= 8 && action.step <= 12) {
        productIndex = 1;
      }
      return { ...state, currentStep: action.step, activeProductIndex: productIndex };
    }
    
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
      // Mock: Generate rich distinct content for the product from sources
      const productIndex = state.products.findIndex(p => p.id === action.productId);
      if (productIndex === -1) return state;

      const product = state.products[productIndex];
      const isCommander = product.id === 'commander';

      // Generate distinct mock data based on product - always replace/add
      const draftPersonas: Persona[] = isCommander
        ? [
            {
              id: `p-${Date.now()}-1`,
              name: 'Chief Revenue Officer',
              role: 'Primary User / Economic Buyer',
              notes: 'Owns revenue number and needs to know where the business is headed before it gets there. Cares about pipeline predictability, early warning signals, and where to focus limited attention. Asks about forecast accuracy improvement and executive dashboard clarity.',
            },
            {
              id: `p-${Date.now()}-2`,
              name: 'VP of Sales',
              role: 'Primary User',
              notes: 'Manages frontline sales managers and needs to know which deals and which reps need intervention. Values coaching efficiency and wants to spend time on highest-leverage activities. Concerned about creating more reporting overhead for managers.',
            },
          ]
        : [
            {
              id: `p-${Date.now()}-1`,
              name: 'Chief Revenue Officer',
              role: 'Economic Buyer',
              notes: 'Cares about predictable revenue growth and scaling best-seller behaviors across the team. Typically asks about ROI evidence, implementation timeline, and how this fits with existing sales tech stack. Concerned about adoption and proving value to board within first 90 days.',
            },
            {
              id: `p-${Date.now()}-2`,
              name: 'VP of Revenue Operations',
              role: 'Champion / Technical Buyer',
              notes: 'Owns the sales tech stack and process optimization. Values clean data, integration capabilities, and evidence-based coaching signals. Often burned by previous AI tools that promised insights but delivered noise.',
            },
          ];

      const draftKeyQuestions: string[] = isCommander
        ? [
            'How do you currently know which deals need your attention?',
            'What percentage of pipeline surprises could you have seen coming?',
            'How much time do your sales managers spend in status meetings vs coaching?',
          ]
        : [
            'What does success look like for your revenue team this quarter?',
            'How do you currently know when a deal is gaining or losing momentum?',
            'What happens when your best seller takes time off or leaves?',
          ];

      const draftKeyObjectives: string[] = isCommander
        ? [
            'Increase pipeline predictability and reduce forecast surprises',
            'Identify intervention opportunities before deals slip',
            'Focus coaching time on highest-impact activities',
          ]
        : [
            'Increase deal velocity across the full pipeline',
            'Scale best-seller behaviors to entire team',
            'Reduce time to productivity for new reps',
          ];

      const draftDifferentiators: Differentiator[] = isCommander
        ? [
            {
              id: `d-${Date.now()}-1`,
              they: 'Dashboards showing lagging indicators and historical trends',
              we: 'Real-time pattern detection and forward-looking momentum signals',
            },
            {
              id: `d-${Date.now()}-2`,
              they: 'Generic reports requiring manual interpretation',
              we: 'Intelligent surfaces that tell you what needs attention and why',
            },
          ]
        : [
            {
              id: `d-${Date.now()}-1`,
              they: 'Record and analyze conversations after the call ends',
              we: 'Provide real-time guidance while the buyer is still engaged',
            },
            {
              id: `d-${Date.now()}-2`,
              they: 'Create surveillance concerns with always-on recording',
              we: 'Private seller guidance with no-monitor commitment',
            },
          ];

      const draftObjections: Objection[] = isCommander
        ? [
            {
              id: `o-${Date.now()}-1`,
              objection: 'We already have Clari / Salesforce dashboards',
              counter: "Commander doesn't replace Clari—it makes it more actionable. Clari shows forecast roll-ups and deal scores. Commander shows which deals need intervention right now and what pattern is causing the stall.",
            },
          ]
        : [
            {
              id: `o-${Date.now()}-1`,
              objection: 'How is this different from Gong or Chorus?',
              counter: 'Gong records and analyzes after the call. Hunter guides during, while the conversation is happening. Think of Gong as the film room; Hunter is the coach on the sideline during the game.',
            },
          ];

      const draftCompetitors: Competitor[] = isCommander
        ? [
            {
              id: `c-${Date.now()}-1`,
              name: 'Clari',
              profile: 'Revenue operations platform focused on forecasting accuracy, pipeline management, and deal inspection. Strong in forecast roll-ups and executive reporting.',
            },
          ]
        : [
            {
              id: `c-${Date.now()}-1`,
              name: 'Gong',
              profile: 'Market leader in conversation intelligence and revenue intelligence platform. Strong in post-call analysis, trend identification, and manager dashboards.',
            },
          ];

      const draftBuyerEnvironment: MarketSignal[] = isCommander
        ? [
            { id: `be-${Date.now()}-1`, signal: 'Leadership team mentions being "surprised by deals slipping at the last minute"' },
            { id: `be-${Date.now()}-2`, signal: 'Sales managers spending excessive time in pipeline review meetings' },
            { id: `be-${Date.now()}-3`, signal: 'CRO mentions needing to "know where to focus" or "which deals need intervention"' },
          ]
        : [
            { id: `be-${Date.now()}-1`, signal: 'Mentions "AI fatigue" or concerns about adding another AI tool to tech stack' },
            { id: `be-${Date.now()}-2`, signal: 'Previous investment in conversation intelligence with mixed adoption' },
            { id: `be-${Date.now()}-3`, signal: 'Sales team resistance to being "watched" or recorded' },
          ];

      const draftCompanyEnvironment: MarketSignal[] = isCommander
        ? [
            { id: `cp-${Date.now()}-1`, signal: 'Frequent forecast misses or pipeline surprises quarter over quarter' },
            { id: `cp-${Date.now()}-2`, signal: 'Leadership attention spread thin across too many deals' },
            { id: `cp-${Date.now()}-3`, signal: 'Sales managers reactive to problems rather than proactive on opportunities' },
          ]
        : [
            { id: `cp-${Date.now()}-1`, signal: 'Inconsistent rep performance—big gap between top and middle performers' },
            { id: `cp-${Date.now()}-2`, signal: 'Long ramp time for new sellers (6+ months to productivity)' },
            { id: `cp-${Date.now()}-3`, signal: 'Managers spending 10+ hours per week reviewing call recordings' },
          ];

      const draftDealSignals: MarketSignal[] = isCommander
        ? [
            { id: `de-${Date.now()}-1`, signal: 'CRO asks about forecast accuracy improvement with specific metrics' },
            { id: `de-${Date.now()}-2`, signal: 'VP Sales mentions difficulty prioritizing coaching time across team' },
            { id: `de-${Date.now()}-3`, signal: 'Sales leader asks "how is this different from Clari?"' },
          ]
        : [
            { id: `de-${Date.now()}-1`, signal: 'Champion mentions board pressure or urgent timeline' },
            { id: `de-${Date.now()}-2`, signal: 'Security asks detailed questions about data handling and privacy' },
            { id: `de-${Date.now()}-3`, signal: 'Economic buyer asks for ROI evidence or customer references' },
          ];

      // Product-specific drafted descriptions
      const draftDescription: string = isCommander
        ? 'Revenue team performance platform that gives sales leaders real-time visibility into pipeline health, team patterns, and coaching opportunities. Commander aggregates signals from Hunter and your CRM to surface what needs your attention and where to intervene for maximum impact. Built for leaders who need to know which deals are stalling, which reps need coaching, and where small changes will create the biggest revenue outcomes.'
        : 'Real-time sales performance system that provides private guidance during live customer interactions. Hunter helps every seller perform like your best sellers by whispering the next best move while the outcome can still change. Built on behavioral science, not surveillance—helping reps navigate complex buyer conversations without creating compliance or trust concerns.';

      // Build the drafted product by replacing/merging content
      const draftedProduct: ProductTeach = {
        ...product,
        description: draftDescription,
        personas: draftPersonas,
        keyQuestions: draftKeyQuestions,
        keyObjectives: draftKeyObjectives,
        differentiators: draftDifferentiators,
        objections: draftObjections,
        competitors: draftCompetitors,
        buyerEnvironment: draftBuyerEnvironment,
        companyProductEnvironment: draftCompanyEnvironment,
        dealEnvironmentSignals: draftDealSignals,
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
        products: state.products.map((p, i) => (i === productIndex ? draftedProduct : p)),
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
  const [state, dispatch] = useReducer(teachReducer, initialTeachState);
  const [toast, setToast] = useState<string | null>(null);
  const [keySignalsSubStep, setKeySignalsSubStep] = useState<'questions' | 'objectives' | 'differentiators' | 'objections'>('questions');

  useEffect(() => {
    setKeySignalsSubStep('questions');
  }, [state.activeProductIndex]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const currentProduct = state.products[state.activeProductIndex];

  const steps: { id: TeachStepId; title: string; group: string }[] = [
    { id: 'company-overview', title: 'Company Overview', group: 'Organization' },
    { id: 'deal-stages', title: 'Deal Stages', group: 'Organization' },
    { id: 'sales-framework', title: 'Sales Framework', group: 'Organization' },
    ...state.products.flatMap((product) => [
      { id: 'product-about' as TeachStepId, title: `${product.name}: About`, group: product.name },
      { id: 'product-personas' as TeachStepId, title: `${product.name}: Personas`, group: product.name },
      { id: 'product-key-signals' as TeachStepId, title: `${product.name}: Key Signals`, group: product.name },
      { id: 'product-competitive' as TeachStepId, title: `${product.name}: Competitive`, group: product.name },
      { id: 'product-market-info' as TeachStepId, title: `${product.name}: Market Info`, group: product.name },
    ]),
    { id: 'gaps-contradictions', title: 'Gaps & Contradictions', group: 'Finalize' },
    { id: 'visibility-go-live', title: 'Visibility & Go Live', group: 'Finalize' },
  ];

  const totalSteps = steps.length;
  const currentStepData = steps[state.currentStep];

  const canContinue = () => {
    // Basic validation per step
    switch (currentStepData.id) {
      case 'company-overview':
        return state.companyOverview.industry && state.companyOverview.customerSegment.length > 0;
      case 'deal-stages':
        return state.dealStages.length >= 3;
      case 'product-about':
        return currentProduct.description.length > 20;
      default:
        return true;
    }
  };

  // Calculate go-live readiness
  const allProductsComplete = state.products.every(
    (p) =>
      p.completedSections.about &&
      p.completedSections.personas &&
      p.completedSections.keySignals &&
      p.completedSections.competitive &&
      p.completedSections.marketInfo
  );
  const unresolvedContradictions = state.contradictions.filter((c) => !c.resolved).length;
  const canGoLive = state.visibility.sensing && allProductsComplete && unresolvedContradictions === 0;

  const handleNext = () => {
    if (state.currentStep < totalSteps - 1) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Group steps for left rail
  const groupedSteps = steps.reduce((acc, step, idx) => {
    if (!acc[step.group]) acc[step.group] = [];
    acc[step.group].push({ ...step, index: idx });
    return acc;
  }, {} as Record<string, Array<typeof steps[0] & { index: number }>>);

  const stepTitle = currentStepData.title.replace(/^(Hunter|Commander): /, '');

  return (
    <div className="min-h-screen bg-piloteer-void text-piloteer-ink flex">
      <aside className="w-[200px] shrink-0 border-r border-piloteer-hair px-7 py-8 flex flex-col">
        <Link href="/" className="mb-14 opacity-90 hover:opacity-100 transition-opacity" aria-label="Hunter">
          <PiloteerLogo className="h-5" />
        </Link>
        <div className="flex-1 space-y-9">
          {Object.entries(groupedSteps).map(([group, groupSteps]) => {
            const groupActive = groupSteps.some((step) => step.index === state.currentStep);
            return (
              <div key={group}>
                <button
                  onClick={() => dispatch({ type: 'SET_STEP', step: groupSteps[0].index })}
                  className={`text-left text-[13px] font-semibold tracking-tight transition-colors ${
                    groupActive ? 'text-piloteer-ink' : 'text-piloteer-mute hover:text-piloteer-metal'
                  }`}
                >
                  {group}
                </button>
                <div className="mt-3 flex items-center gap-1.5">
                  {groupSteps.map((step) => (
                    <button
                      key={step.index}
                      aria-label={step.title}
                      onClick={() => dispatch({ type: 'SET_STEP', step: step.index })}
                      className={`h-1.5 rounded-full transition-all ${
                        state.currentStep === step.index
                          ? 'w-7 bg-piloteer-ink'
                          : step.index < state.currentStep
                          ? 'w-1.5 bg-piloteer-verified'
                          : 'w-1.5 bg-piloteer-hair-2 hover:bg-piloteer-metal'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/dashboard"
          className="text-[11px] font-mono uppercase tracking-[0.18em] text-piloteer-mute hover:text-piloteer-ink transition-colors"
        >
          Exit
        </Link>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-14 pt-12 pb-16 min-h-full flex flex-col">
          <div className="flex items-baseline justify-between mb-14">
            <h1 className="text-5xl font-bold tracking-editorial leading-none">{stepTitle}</h1>
            <span className="font-mono text-[11px] tracking-[0.16em] text-piloteer-faint">
              {String(state.currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
            </span>
          </div>

          <div className="flex-1">
            {renderStepContent(
              currentStepData.id,
              state,
              dispatch,
              showToast,
              keySignalsSubStep,
              setKeySignalsSubStep,
              currentProduct
            )}
          </div>

          <div className="flex items-center justify-between mt-16">
            <button
              onClick={handleBack}
              disabled={state.currentStep === 0}
              className="btn-ghost disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {state.currentStep === totalSteps - 1 ? (
              <div className="flex items-center gap-5">
                {!canGoLive && (
                  <span className="text-xs font-mono uppercase tracking-widest text-piloteer-signal">
                    {!state.visibility.sensing && 'Enable sensing'}
                    {state.visibility.sensing && !allProductsComplete && 'Complete all products'}
                    {state.visibility.sensing && allProductsComplete && unresolvedContradictions > 0 && `Resolve ${unresolvedContradictions}`}
                  </span>
                )}
                <button
                  onClick={() => {
                    dispatch({ type: 'GO_LIVE' });
                    showToast('Hunter is now live! Redirecting to dashboard...');
                    setTimeout(() => window.location.href = '/dashboard', 2000);
                  }}
                  disabled={!canGoLive}
                  className="btn-primary py-3.5 px-7 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Go live
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className="btn-primary py-3.5 px-7 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-piloteer-ink text-piloteer-void px-5 py-3 rounded-full z-50">
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}

function renderStepContent(
  stepId: TeachStepId,
  state: TeachState,
  dispatch: React.Dispatch<TeachAction>,
  showToast: (message: string) => void,
  keySignalsSubStep: 'questions' | 'objectives' | 'differentiators' | 'objections',
  setKeySignalsSubStep: (step: 'questions' | 'objectives' | 'differentiators' | 'objections') => void,
  currentProduct: ProductTeach
): React.ReactNode {
  switch (stepId) {
    case 'company-overview':
      return <CompanyOverviewStep state={state} dispatch={dispatch} />;
    case 'deal-stages':
      return <DealStagesStep state={state} dispatch={dispatch} showToast={showToast} />;
    case 'sales-framework':
      return <SalesFrameworkStep state={state} dispatch={dispatch} />;
    case 'product-about':
      return <ProductAboutStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
    case 'product-personas':
      return <ProductPersonasStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
    case 'product-key-signals':
      return (
        <ProductKeySignalsStep
          product={currentProduct}
          dispatch={dispatch}
          showToast={showToast}
          subStep={keySignalsSubStep}
          setSubStep={setKeySignalsSubStep}
        />
      );
    case 'product-competitive':
      return <ProductCompetitiveStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
    case 'product-market-info':
      return <ProductMarketInfoStep product={currentProduct} dispatch={dispatch} showToast={showToast} />;
    case 'gaps-contradictions':
      return <GapsContradictionsStep state={state} dispatch={dispatch} showToast={showToast} />;
    case 'visibility-go-live':
      return <VisibilityGoLiveStep state={state} dispatch={dispatch} showToast={showToast} />;
    default:
      return <div>Step not implemented</div>;
  }
}

// Step Components (each as a separate function component for clarity)

function CompanyOverviewStep({ state, dispatch }: { state: TeachState; dispatch: React.Dispatch<TeachAction> }) {
  const industries = [
    'Software / SaaS',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Professional Services',
    'Technology',
    'Retail / E-commerce',
    'Other',
  ];

  const segments: { value: CustomerSegment; label: string }[] = [
    { value: 'smb', label: 'SMB' },
    { value: 'mid-market', label: 'Mid-Market' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const dealSizes = ['<$25K', '$25K-$100K', '$100K-$500K', '$500K+'];
  const salesCycles = ['<30 days', '30-90 days', '90-180 days', '180+ days'];

  return (
    <div className="grid grid-cols-2 gap-x-16 gap-y-14">
      <section>
        <span className="eyebrow">Industry</span>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {industries.map((industry) => {
            const on = state.companyOverview.industry === industry;
            return (
              <button
                key={industry}
                onClick={() => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'industry', value: industry })}
                className={`px-4 py-4 rounded-2xl text-left text-sm font-semibold transition-colors ${
                  on ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal hover:text-piloteer-ink'
                }`}
              >
                {industry}
              </button>
            );
          })}
        </div>
      </section>

      <div className="space-y-12">
        <section>
          <span className="eyebrow">Customer Segment</span>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {segments.map((segment) => {
              const isSelected = state.companyOverview.customerSegment.includes(segment.value);
              return (
                <button
                  key={segment.value}
                  onClick={() => {
                    const current = state.companyOverview.customerSegment;
                    const updated = isSelected
                      ? current.filter((s) => s !== segment.value)
                      : [...current, segment.value];
                    dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'customerSegment', value: updated });
                  }}
                  className={`px-4 py-6 rounded-2xl text-sm font-semibold transition-colors ${
                    isSelected ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal hover:text-piloteer-ink'
                  }`}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <span className="eyebrow">Typical Deal Size</span>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {dealSizes.map((size) => {
              const on = state.companyOverview.typicalDealSize === size;
              return (
                <button
                  key={size}
                  onClick={() => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'typicalDealSize', value: size })}
                  className={`py-4 rounded-2xl text-xs font-semibold transition-colors ${
                    on ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal hover:text-piloteer-ink'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <span className="eyebrow">Typical Sales Cycle</span>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {salesCycles.map((cycle) => {
              const on = state.companyOverview.typicalSalesCycle === cycle;
              return (
                <button
                  key={cycle}
                  onClick={() => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'typicalSalesCycle', value: cycle })}
                  className={`py-4 rounded-2xl text-xs font-semibold transition-colors ${
                    on ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-metal hover:text-piloteer-ink'
                  }`}
                >
                  {cycle}
                </button>
              );
            })}
          </div>
        </section>
      </div>
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
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof stageTemplates | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-2">
          {(Object.keys(stageTemplates) as Array<keyof typeof stageTemplates>).map((key) => (
            <button
              key={key}
              onClick={() => {
                dispatch({ type: 'SET_DEAL_STAGES', stages: stageTemplates[key] });
                setSelectedTemplate(key);
                showToast(`Loaded ${key} template`);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors ${
                selectedTemplate === key ? 'bg-piloteer-ink text-piloteer-void' : 'text-piloteer-mute hover:text-piloteer-ink'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            dispatch({ type: 'ADD_DEAL_STAGE' });
            showToast('Stage added');
          }}
          className="w-9 h-9 rounded-full border border-piloteer-hair text-piloteer-metal hover:text-piloteer-ink hover:border-piloteer-hair-2 transition-colors"
          aria-label="Add stage"
        >
          +
        </button>
      </div>

      <div className="max-w-3xl space-y-2.5">
        {state.dealStages.map((stage, index) => {
          const span = state.dealStages.length > 1 ? (100 - 46) / (state.dealStages.length - 1) : 0;
          const width = 100 - index * span;
          return (
            <div key={stage.id} className="flex items-center gap-4" style={{ width: `${width}%` }}>
              <span className="w-6 font-mono text-[11px] text-piloteer-faint">{String(index + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0 bg-piloteer-surface rounded-full pl-5 pr-3 py-3 flex items-center gap-3">
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => dispatch({ type: 'UPDATE_DEAL_STAGE', id: stage.id, field: 'name', value: e.target.value })}
                  className="flex-1 min-w-0 bg-transparent text-piloteer-ink font-semibold outline-none"
                  placeholder="Stage"
                />
                <button
                  onClick={() => {
                    dispatch({ type: 'REMOVE_DEAL_STAGE', id: stage.id });
                    showToast('Stage removed');
                  }}
                  aria-label="Remove stage"
                  className="text-piloteer-faint hover:text-piloteer-ink transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SalesFrameworkStep({ state, dispatch }: { state: TeachState; dispatch: React.Dispatch<TeachAction> }) {
  const frameworks: SalesFramework[] = ['challenger', 'meddic', 'meddpicc', 'sandler', 'spin', 'miller-heiman', 'custom', 'none'];

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {frameworks.map((framework) => {
          const info = frameworkDescriptions[framework];
          const isSelected = state.salesFramework === framework;
          return (
            <button
              key={framework}
              onClick={() => dispatch({ type: 'SET_SALES_FRAMEWORK', framework })}
              className={`min-h-[148px] p-5 rounded-2xl text-left flex flex-col justify-between transition-colors ${
                isSelected ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink hover:bg-piloteer-surface-2'
              }`}
            >
              <span className="font-semibold text-[15px] leading-snug">{info.name}</span>
              {info.elements && (
                <span className={`mt-4 block text-[10px] font-mono uppercase tracking-wider leading-relaxed ${isSelected ? 'text-piloteer-void/55' : 'text-piloteer-faint'}`}>
                  {info.elements.join(' · ')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {state.salesFramework === 'custom' && (
        <div className="mt-10 grid grid-cols-2 gap-4">
          <input
            type="text"
            value={state.customFrameworkName || ''}
            onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: e.target.value, notes: state.customFrameworkNotes })}
            className="bg-transparent border-b border-piloteer-hair px-0 py-3 text-piloteer-ink outline-none focus:border-piloteer-ink"
            placeholder="Name"
            aria-label="Framework name"
          />
          <input
            type="text"
            value={state.customFrameworkNotes || ''}
            onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: state.customFrameworkName, notes: e.target.value })}
            className="bg-transparent border-b border-piloteer-hair px-0 py-3 text-piloteer-ink outline-none focus:border-piloteer-ink"
            placeholder="Elements"
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

  const handleDraftFromSources = () => {
    setIsDrafting(true);
    setTimeout(() => {
      dispatch({ type: 'DRAFT_FROM_SOURCES', productId: product.id });
      setIsDrafting(false);
      showToast('Draft generated from sources! Review each section.');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-[180px_1fr] gap-16 items-start">
      <div className="w-[180px] h-[180px] rounded-full bg-piloteer-surface flex items-center justify-center">
        <span className="text-6xl font-bold tracking-editorial">{product.name.slice(0, 1)}</span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {product.sources.map((source) => (
            <div key={source.id} className="inline-flex items-center gap-2 bg-piloteer-surface rounded-full pl-4 pr-2 py-2">
              <span className="text-sm font-semibold">{source.name}</span>
              <span className="text-[11px] font-mono text-piloteer-faint">{source.size || source.url}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_PRODUCT_SOURCE', productId: product.id, sourceId: source.id })}
                aria-label="Remove source"
                className="text-piloteer-faint hover:text-piloteer-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button onClick={handleFileUpload} className="px-4 py-2 rounded-full text-sm text-piloteer-metal hover:text-piloteer-ink border border-piloteer-hair">
            File
          </button>
          <form
            className="inline-flex items-center gap-1 rounded-full border border-piloteer-hair pl-4 pr-1 py-1"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUrl();
            }}
          >
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="URL"
              aria-label="Source URL"
              className="w-24 bg-transparent text-sm text-piloteer-ink outline-none placeholder:text-piloteer-faint"
            />
            <button type="submit" disabled={!urlInput.trim()} aria-label="Add URL" className="w-7 h-7 rounded-full text-piloteer-metal hover:text-piloteer-ink disabled:opacity-30">
              +
            </button>
          </form>
        </div>

        <textarea
          value={product.description}
          onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: 'description', value: e.target.value })}
          rows={4}
          className="mt-10 w-full bg-transparent text-2xl font-medium leading-snug tracking-editorial text-piloteer-ink outline-none resize-none placeholder:text-piloteer-faint"
          placeholder={product.name}
          aria-label={`Describe ${product.name}`}
        />

        {product.sources.length > 0 && (
          <button
            onClick={handleDraftFromSources}
            disabled={isDrafting || product.draftGenerated}
            className="mt-6 text-[11px] font-mono uppercase tracking-[0.18em] text-piloteer-mute hover:text-piloteer-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDrafting ? 'Drafting' : product.draftGenerated ? 'Drafted' : 'Draft'}
          </button>
        )}
      </div>
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
      name: 'New Persona',
      role: '',
      notes: '',
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

  return (
    <div>
      <div className="flex gap-4 items-stretch">
        {product.personas.map((persona) => {
          const selected = openId === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => setOpenId(selected ? null : persona.id)}
              className={`w-52 shrink-0 rounded-3xl px-5 py-6 text-left transition-colors ${
                selected ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink hover:bg-piloteer-surface-2'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                selected ? 'bg-piloteer-void text-piloteer-ink' : 'bg-piloteer-void text-piloteer-ink'
              }`}>
                {initials(persona.name) || '·'}
              </div>
              <div className="mt-8 font-semibold leading-snug">{persona.name}</div>
              <div className={`mt-2 text-[11px] font-mono uppercase tracking-wider ${selected ? 'text-piloteer-void/60' : 'text-piloteer-faint'}`}>
                {persona.role}
              </div>
            </button>
          );
        })}
        <button
          onClick={handleAddPersona}
          aria-label="Add persona"
          className="w-52 shrink-0 rounded-3xl border border-dashed border-piloteer-hair text-3xl text-piloteer-faint hover:text-piloteer-ink hover:border-piloteer-hair-2 transition-colors"
        >
          +
        </button>
      </div>

      {open && (
        <div className="mt-10 max-w-xl">
          <div className="flex items-center justify-between gap-4">
            <input
              value={open.name}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field: 'name', value: e.target.value })
              }
              className="flex-1 bg-transparent text-2xl font-semibold outline-none"
              aria-label="Persona name"
            />
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_PERSONA', productId: product.id, personaId: open.id });
                showToast('Persona removed');
                setOpenId(null);
              }}
              aria-label="Remove persona"
              className="text-piloteer-faint hover:text-piloteer-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            value={open.role}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field: 'role', value: e.target.value })
            }
            className="mt-2 w-full bg-transparent text-[11px] font-mono uppercase tracking-wider text-piloteer-mute outline-none"
            aria-label="Role"
          />
          <textarea
            value={open.notes}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: open.id, field: 'notes', value: e.target.value })
            }
            rows={3}
            className="mt-6 w-full bg-transparent text-piloteer-metal leading-relaxed outline-none resize-none"
            aria-label="Notes"
          />
        </div>
      )}
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
    <div>
      <div className="flex gap-8 mb-12">
        {subSteps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setSubStep(step.id)}
            className="text-left"
          >
            <div className={`h-px w-16 mb-3 ${subStep === step.id ? 'bg-piloteer-ink' : step.completed ? 'bg-piloteer-verified' : 'bg-piloteer-hair'}`} />
            <div className={`text-[11px] font-mono uppercase tracking-wider ${subStep === step.id ? 'text-piloteer-ink' : 'text-piloteer-faint'}`}>
              0{idx + 1}
            </div>
            <div className={`mt-1 text-sm font-semibold ${subStep === step.id ? 'text-piloteer-ink' : 'text-piloteer-mute'}`}>
              {step.label}
            </div>
          </button>
        ))}
      </div>

      {subStep === 'questions' && <KeyQuestionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
      {subStep === 'objectives' && <KeyObjectivesWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
      {subStep === 'differentiators' && <DifferentiatorsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
      {subStep === 'objections' && <ObjectionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
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
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      dispatch({ type: 'ADD_KEY_QUESTION', productId: product.id, question: newQuestion });
      setNewQuestion('');
      showToast('Question added');
    }
  };

  return (
    <div>
      <ol>
        {product.keyQuestions.map((question, index) => (
          <li key={index} className="flex items-baseline gap-6 py-4 border-b border-piloteer-hair">
            <span className="w-6 font-mono text-[11px] text-piloteer-faint">{String(index + 1).padStart(2, '0')}</span>
            <input
              type="text"
              value={question}
              onChange={(e) => dispatch({ type: 'UPDATE_KEY_QUESTION', productId: product.id, index, value: e.target.value })}
              className="flex-1 bg-transparent outline-none text-lg text-piloteer-ink"
              aria-label="Question"
            />
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_KEY_QUESTION', productId: product.id, index });
                showToast('Question removed');
              }}
              aria-label="Remove question"
              className="text-piloteer-faint hover:text-piloteer-ink"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ol>
      <form
        className="flex items-baseline gap-6 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddQuestion();
        }}
      >
        <span className="w-6 font-mono text-[11px] text-piloteer-faint">{String(product.keyQuestions.length + 1).padStart(2, '0')}</span>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add"
          aria-label="Add question"
          className="flex-1 bg-transparent outline-none text-lg text-piloteer-ink placeholder:text-piloteer-faint"
        />
      </form>
    </div>
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
  const [newObjective, setNewObjective] = useState('');

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      dispatch({ type: 'ADD_KEY_OBJECTIVE', productId: product.id, objective: newObjective });
      setNewObjective('');
      showToast('Objective added');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {product.keyObjectives.map((objective, index) => (
          <div key={index} className="inline-flex items-center gap-3 bg-piloteer-surface rounded-full pl-5 pr-3 py-3">
            <span className="text-sm font-semibold">{objective}</span>
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_KEY_OBJECTIVE', productId: product.id, index });
                showToast('Objective removed');
              }}
              aria-label="Remove objective"
              className="text-piloteer-faint hover:text-piloteer-ink"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddObjective();
        }}
      >
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          placeholder="Add"
          aria-label="Add objective"
          className="w-full bg-transparent border-b border-piloteer-hair py-3 text-lg outline-none placeholder:text-piloteer-faint"
        />
      </form>
    </div>
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
    <div>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-x-8 text-[11px] font-mono uppercase tracking-widest text-piloteer-faint pb-3">
        <span>They</span>
        <span>We</span>
        <span />
      </div>
      {product.differentiators.map((diff) => (
        <div key={diff.id} className="grid grid-cols-[1fr_1fr_auto] gap-x-8 items-start border-t border-piloteer-hair py-4">
          <textarea
            value={diff.they}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_DIFFERENTIATOR', productId: product.id, diffId: diff.id, field: 'they', value: e.target.value })
            }
            rows={2}
            className="bg-transparent text-piloteer-metal leading-relaxed outline-none resize-none"
            aria-label="They"
          />
          <textarea
            value={diff.we}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_DIFFERENTIATOR', productId: product.id, diffId: diff.id, field: 'we', value: e.target.value })
            }
            rows={2}
            className="bg-transparent text-piloteer-ink leading-relaxed outline-none resize-none"
            aria-label="We"
          />
          <button
            onClick={() => {
              dispatch({ type: 'REMOVE_DIFFERENTIATOR', productId: product.id, diffId: diff.id });
              showToast('Differentiator removed');
            }}
            aria-label="Remove differentiator"
            className="text-piloteer-faint hover:text-piloteer-ink mt-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={handleAddDifferentiator} className="mt-4 text-[11px] font-mono uppercase tracking-widest text-piloteer-mute hover:text-piloteer-ink">
        Add
      </button>
    </div>
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
    <div>
      <div className="grid grid-cols-[1fr_1.4fr_auto] gap-x-8 text-[11px] font-mono uppercase tracking-widest text-piloteer-faint pb-3">
        <span>Objection</span>
        <span>Counter</span>
        <span />
      </div>
      {product.objections.map((obj) => (
        <div key={obj.id} className="grid grid-cols-[1fr_1.4fr_auto] gap-x-8 items-start border-t border-piloteer-hair py-4">
          <input
            type="text"
            value={obj.objection}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_OBJECTION', productId: product.id, objId: obj.id, field: 'objection', value: e.target.value })
            }
            className="bg-transparent text-piloteer-metal outline-none"
            aria-label="Objection"
          />
          <textarea
            value={obj.counter}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_OBJECTION', productId: product.id, objId: obj.id, field: 'counter', value: e.target.value })
            }
            rows={2}
            className="bg-transparent text-piloteer-ink leading-relaxed outline-none resize-none"
            aria-label="Counter"
          />
          <button
            onClick={() => {
              dispatch({ type: 'REMOVE_OBJECTION', productId: product.id, objId: obj.id });
              showToast('Objection removed');
            }}
            aria-label="Remove objection"
            className="text-piloteer-faint hover:text-piloteer-ink mt-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={handleAddObjection} className="mt-4 text-[11px] font-mono uppercase tracking-widest text-piloteer-mute hover:text-piloteer-ink">
        Add
      </button>
    </div>
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
    };
    dispatch({ type: 'ADD_COMPETITOR', productId: product.id, competitor: newComp });
    showToast('Competitor added');
  };

  const handleAddAdvantage = () => {
    const newAdv: ComparisonAdvantage = {
      id: `adv-${Date.now()}`,
      ourAdvantage: '',
      competitorName: product.competitors[0]?.name || '',
    };
    dispatch({ type: 'ADD_COMPARISON_ADVANTAGE', productId: product.id, advantage: newAdv });
    showToast('Advantage added');
  };

  const [activeId, setActiveId] = useState<string | null>(product.competitors[0]?.id ?? null);
  const active = product.competitors.find((comp) => comp.id === activeId) || product.competitors[0];

  return (
    <div>
      <div className="flex gap-3 items-stretch">
        {product.competitors.map((comp) => {
          const selected = active?.id === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveId(comp.id)}
              className={`w-36 h-36 rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors ${
                selected ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink hover:bg-piloteer-surface-2'
              }`}
            >
              <span className="text-3xl font-bold">{(comp.name || '·').slice(0, 1)}</span>
              <span className="text-xs font-semibold text-center px-3 leading-snug">{comp.name}</span>
            </button>
          );
        })}
        <button
          onClick={handleAddCompetitor}
          aria-label="Add competitor"
          className="w-36 h-36 rounded-3xl border border-dashed border-piloteer-hair text-3xl text-piloteer-faint hover:text-piloteer-ink"
        >
          +
        </button>
      </div>

      {active && (
        <div className="mt-10 max-w-2xl">
          <div className="flex items-center gap-4">
            <input
              value={active.name}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: active.id, field: 'name', value: e.target.value })
              }
              className="flex-1 bg-transparent text-3xl font-semibold outline-none"
              aria-label="Competitor name"
            />
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_COMPETITOR', productId: product.id, compId: active.id });
                showToast('Competitor removed');
                setActiveId(null);
              }}
              aria-label="Remove competitor"
              className="text-piloteer-faint hover:text-piloteer-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea
            value={active.profile}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: active.id, field: 'profile', value: e.target.value })
            }
            rows={3}
            className="mt-4 w-full bg-transparent text-piloteer-metal leading-relaxed outline-none resize-none"
            aria-label="Profile"
          />
        </div>
      )}

      {product.competitors.length > 0 && (
        <div className="mt-12">
          {product.comparisonAdvantages.map((adv) => (
            <div key={adv.id} className="flex items-center gap-4 py-3 border-t border-piloteer-hair">
              <input
                type="text"
                value={adv.ourAdvantage}
                onChange={(e) => {
                  dispatch({
                    type: 'UPDATE_COMPARISON_ADVANTAGE',
                    productId: product.id,
                    advId: adv.id,
                    field: 'ourAdvantage',
                    value: e.target.value,
                  });
                }}
                className="flex-1 bg-transparent outline-none text-piloteer-ink"
                aria-label="Advantage"
              />
              <span className="text-[11px] font-mono text-piloteer-faint">vs</span>
              <select
                value={adv.competitorName}
                onChange={(e) => {
                  dispatch({
                    type: 'UPDATE_COMPARISON_ADVANTAGE',
                    productId: product.id,
                    advId: adv.id,
                    field: 'competitorName',
                    value: e.target.value,
                  });
                }}
                className="bg-transparent text-sm text-piloteer-metal outline-none"
                aria-label="Competitor"
              >
                <option value="">—</option>
                {product.competitors.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => dispatch({ type: 'REMOVE_COMPARISON_ADVANTAGE', productId: product.id, advId: adv.id })}
                aria-label="Remove advantage"
                className="text-piloteer-faint hover:text-piloteer-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button onClick={handleAddAdvantage} className="mt-3 text-[11px] font-mono uppercase tracking-widest text-piloteer-mute hover:text-piloteer-ink">
            Add
          </button>
        </div>
      )}
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

  const columns: { category: 'buyerEnvironment' | 'companyProductEnvironment' | 'dealEnvironmentSignals'; title: string }[] = [
    { category: 'buyerEnvironment', title: 'Buyer Environment' },
    { category: 'companyProductEnvironment', title: 'Company & Product' },
    { category: 'dealEnvironmentSignals', title: 'Deal' },
  ];

  return (
    <div className="grid grid-cols-3 gap-12">
      {columns.map((column) => {
        const signals = product[column.category];
        return (
          <section key={column.category}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">{column.title}</h2>
              <button
                onClick={() => handleAddSignal(column.category)}
                aria-label={`Add ${column.title}`}
                className="text-piloteer-faint hover:text-piloteer-ink text-lg leading-none"
              >
                +
              </button>
            </div>
            <ul>
              {signals.map((signal) => (
                <li key={signal.id} className="flex items-start gap-2 py-3 border-t border-piloteer-hair">
                  <textarea
                    value={signal.signal}
                    onChange={(e) => {
                      const updatedSignals = signals.map((item) =>
                        item.id === signal.id ? { ...item, signal: e.target.value } : item
                      );
                      dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: column.category, value: updatedSignals });
                    }}
                    rows={2}
                    className="flex-1 bg-transparent text-sm text-piloteer-metal leading-relaxed outline-none resize-none"
                    aria-label={column.title}
                  />
                  <button
                    onClick={() => {
                      dispatch({ type: 'REMOVE_MARKET_SIGNAL', productId: product.id, category: column.category, signalId: signal.id });
                      showToast('Signal removed');
                    }}
                    aria-label="Remove signal"
                    className="text-piloteer-faint hover:text-piloteer-ink mt-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
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
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const unresolvedContradictions = state.contradictions.filter((c) => !c.resolved);
  const resolvedContradictions = state.contradictions.filter((c) => c.resolved);

  const [focus, setFocus] = useState(0);
  const open = unresolvedContradictions;
  const index = open.length === 0 ? 0 : Math.min(focus, open.length - 1);
  const current = open[index];

  if (!current && resolvedContradictions.length === 0) {
    return (
      <div className="py-24">
        <div className="w-14 h-14 rounded-full bg-piloteer-surface" />
      </div>
    );
  }

  if (!current) {
    return (
      <ul className="max-w-xl">
        {resolvedContradictions.map((contradiction) => (
          <li key={contradiction.id} className="flex items-center justify-between gap-6 border-t border-piloteer-hair py-5">
            <span className="font-semibold">{contradiction.title}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-piloteer-verified">
              {contradiction.resolution === 'option1' ? 'A' : 'B'}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-12">
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
      <h2 className="max-w-3xl text-3xl font-bold tracking-editorial leading-tight">{current.title}</h2>
      <p className="mt-5 max-w-2xl text-piloteer-metal leading-relaxed">{current.description}</p>
      <div className="mt-10 grid grid-cols-2 gap-4 max-w-4xl">
        <button
          onClick={() => {
            dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: current.id, resolution: 'option1' });
            showToast('Conflict resolved');
            setFocus(0);
          }}
          className="min-h-[200px] rounded-3xl bg-piloteer-surface p-8 text-left hover:bg-piloteer-ink hover:text-piloteer-void transition-colors group"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-piloteer-faint group-hover:text-piloteer-void/50">A</div>
          <p className="mt-8 text-lg font-semibold leading-snug">{current.option1}</p>
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: current.id, resolution: 'option2' });
            showToast('Conflict resolved');
            setFocus(0);
          }}
          className="min-h-[200px] rounded-3xl bg-piloteer-surface p-8 text-left hover:bg-piloteer-ink hover:text-piloteer-void transition-colors group"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-piloteer-faint group-hover:text-piloteer-void/50">B</div>
          <p className="mt-8 text-lg font-semibold leading-snug">{current.option2}</p>
        </button>
      </div>
    </div>
  );
}

function VisibilityGoLiveStep({
  state,
  dispatch,
  showToast,
}: {
  state: TeachState;
  dispatch: React.Dispatch<TeachAction>;
  showToast: (message: string) => void;
}) {
  const allProductsComplete = state.products.every(
    (p) =>
      p.description.length > 20 &&
      p.personas.length > 0 &&
      p.keyQuestions.length > 0 &&
      p.competitors.length > 0 &&
      // Use completedSections for accurate completion tracking
      p.completedSections.about &&
      p.completedSections.personas &&
      p.completedSections.keySignals &&
      p.completedSections.competitive &&
      p.completedSections.marketInfo
  );

  const unresolvedContradictions = state.contradictions.filter((c) => !c.resolved).length;

  const canGoLive = state.visibility.sensing && allProductsComplete && unresolvedContradictions === 0;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            dispatch({ type: 'TOGGLE_VISIBILITY', field: 'sensing' });
            showToast(state.visibility.sensing ? 'Sensing disabled' : 'Sensing enabled');
          }}
          className={`min-h-[168px] rounded-3xl p-6 text-left flex flex-col justify-between transition-colors ${
            state.visibility.sensing ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink'
          }`}
        >
          <span className="text-lg font-semibold">Real-time Sensing</span>
          <span className={`relative w-11 h-6 rounded-full ${state.visibility.sensing ? 'bg-piloteer-void/30' : 'bg-piloteer-hair-2'}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${state.visibility.sensing ? 'left-6 bg-piloteer-void' : 'left-1 bg-piloteer-mute'}`} />
          </span>
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'TOGGLE_VISIBILITY', field: 'writeback' });
            showToast(state.visibility.writeback ? 'Writeback disabled' : 'Writeback enabled');
          }}
          className={`min-h-[168px] rounded-3xl p-6 text-left flex flex-col justify-between transition-colors ${
            state.visibility.writeback ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink'
          }`}
        >
          <span className="text-lg font-semibold">CRM Writeback</span>
          <span className={`relative w-11 h-6 rounded-full ${state.visibility.writeback ? 'bg-piloteer-void/30' : 'bg-piloteer-hair-2'}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${state.visibility.writeback ? 'left-6 bg-piloteer-void' : 'left-1 bg-piloteer-mute'}`} />
          </span>
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'TOGGLE_VISIBILITY', field: 'noMonitorCommitment' });
            showToast(state.visibility.noMonitorCommitment ? 'No-monitor disabled' : 'No-monitor enabled');
          }}
          className={`min-h-[168px] rounded-3xl p-6 text-left flex flex-col justify-between transition-colors ${
            state.visibility.noMonitorCommitment ? 'bg-piloteer-ink text-piloteer-void' : 'bg-piloteer-surface text-piloteer-ink'
          }`}
        >
          <span className="text-lg font-semibold">No-Monitor Commitment</span>
          <span className={`relative w-11 h-6 rounded-full ${state.visibility.noMonitorCommitment ? 'bg-piloteer-void/30' : 'bg-piloteer-hair-2'}`}>
            <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${state.visibility.noMonitorCommitment ? 'left-6 bg-piloteer-void' : 'left-1 bg-piloteer-mute'}`} />
          </span>
        </button>
      </div>

      <div className="mt-14 flex gap-10">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${state.visibility.sensing ? 'bg-piloteer-verified' : 'bg-piloteer-hair-2'}`} />
          <span className="text-sm font-semibold">Sensing</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${allProductsComplete ? 'bg-piloteer-verified' : 'bg-piloteer-hair-2'}`} />
          <span className="text-sm font-semibold">Products</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${unresolvedContradictions === 0 ? 'bg-piloteer-verified' : 'bg-piloteer-watch'}`} />
          <span className="text-sm font-semibold">{unresolvedContradictions === 0 ? 'No conflicts' : `${unresolvedContradictions} conflicts`}</span>
        </div>
      </div>
    </div>
  );
}
