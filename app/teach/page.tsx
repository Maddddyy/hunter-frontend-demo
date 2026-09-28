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

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const currentProduct = state.products[state.activeProductIndex];

  const steps: { id: TeachStepId; title: string; group: string }[] = [
    { id: 'company-overview', title: 'Company Overview', group: 'Organization' },
    { id: 'deal-stages', title: 'Deal Stages', group: 'Organization' },
    { id: 'sales-framework', title: 'Sales Framework', group: 'Organization' },
    ...state.products.flatMap((product, idx) => [
      { id: 'product-about' as TeachStepId, title: `${product.name}: About`, group: `Product ${idx + 1}` },
      { id: 'product-personas' as TeachStepId, title: `${product.name}: Personas`, group: `Product ${idx + 1}` },
      { id: 'product-key-signals' as TeachStepId, title: `${product.name}: Key Signals`, group: `Product ${idx + 1}` },
      { id: 'product-competitive' as TeachStepId, title: `${product.name}: Competitive`, group: `Product ${idx + 1}` },
      { id: 'product-market-info' as TeachStepId, title: `${product.name}: Market Info`, group: `Product ${idx + 1}` },
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

  return (
    <div className="min-h-screen flex flex-col bg-piloteer-void">
      {/* Header */}
      <div className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-plane">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <PiloteerLogo className="h-6 opacity-90" />
              <span className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Hunter</span>
            </Link>
            <div className="h-6 w-px bg-piloteer-hair" />
            <div>
              <div className="text-sm font-bold text-piloteer-ink">Teaching Hunter</div>
              <div className="text-xs font-mono text-piloteer-mute">Sales configuration workshop</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-piloteer-mute">
              Step {state.currentStep + 1} of {totalSteps}
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-piloteer-metal hover:text-piloteer-ink transition-colors"
            >
              Exit to Dashboard →
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Rail */}
        <aside className="w-80 border-r border-piloteer-hair bg-piloteer-black-alt overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="eyebrow">Sales Configuration Journey</div>
            
            {Object.entries(groupedSteps).map(([group, groupSteps]) => (
              <div key={group}>
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mb-3">
                  {group}
                </div>
                <div className="space-y-1">
                  {groupSteps.map((step) => (
                    <button
                      key={step.index}
                      onClick={() => dispatch({ type: 'SET_STEP', step: step.index })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        state.currentStep === step.index
                          ? 'bg-piloteer-surface-3 text-piloteer-ink font-semibold'
                          : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          step.index < state.currentStep ? 'bg-piloteer-verified' : 'bg-piloteer-mute'
                        }`} />
                        <span>{step.title.replace(/^(Hunter|Commander): /, '')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-12 py-12">
            <div className="mb-8">
              <div className="eyebrow mb-3">Step {state.currentStep + 1} of {totalSteps}</div>
              <h1 className="text-4xl font-bold interp mb-2">{currentStepData.title}</h1>
            </div>

            <div className="card border-piloteer-hair-2 min-h-[560px] flex flex-col">
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

              {/* Footer Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-piloteer-hair mt-8">
                <button
                  onClick={handleBack}
                  disabled={state.currentStep === 0}
                  className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                
                {state.currentStep === totalSteps - 1 ? (
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => {
                        dispatch({ type: 'GO_LIVE' });
                        showToast('Hunter is now live! Redirecting to dashboard...');
                        setTimeout(() => window.location.href = '/dashboard', 2000);
                      }}
                      disabled={!canGoLive}
                      className="btn-primary py-3.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Complete & Go Live →
                    </button>
                    {!canGoLive && (
                      <div className="text-xs text-piloteer-signal text-right">
                        {!state.visibility.sensing && 'Enable sensing'}
                        {state.visibility.sensing && !allProductsComplete && 'Complete all products'}
                        {state.visibility.sensing && allProductsComplete && unresolvedContradictions > 0 && `Resolve ${unresolvedContradictions} conflict${unresolvedContradictions > 1 ? 's' : ''}`}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className="btn-primary py-3.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-piloteer-surface-3 border border-piloteer-verified-line text-piloteer-ink px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-piloteer-verified" />
            <span className="text-sm font-semibold">{toast}</span>
          </div>
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
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Help Hunter understand your business context. This shapes how Hunter interprets deal signals and timing.
      </p>

      <div className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="eyebrow mb-3 block">Industry</span>
          <select
            value={state.companyOverview.industry}
            onChange={(e) => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'industry', value: e.target.value })}
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="eyebrow mb-3 block">Customer Segment</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                    isSelected
                      ? 'bg-piloteer-verified-soft border-piloteer-verified-line text-piloteer-verified'
                      : 'bg-piloteer-surface-2 border-piloteer-hair-2 text-piloteer-metal hover:border-piloteer-hair hover:text-piloteer-ink'
                  }`}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="eyebrow mb-3 block">Typical Deal Size</span>
          <select
            value={state.companyOverview.typicalDealSize}
            onChange={(e) => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'typicalDealSize', value: e.target.value })}
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
          >
            {dealSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="eyebrow mb-3 block">Typical Sales Cycle</span>
          <select
            value={state.companyOverview.typicalSalesCycle}
            onChange={(e) => dispatch({ type: 'UPDATE_COMPANY_OVERVIEW', field: 'typicalSalesCycle', value: e.target.value })}
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
          >
            {salesCycles.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="pt-6 text-sm ctx bg-piloteer-surface-2 p-6 rounded-xl border border-piloteer-hair leading-relaxed">
        <strong className="text-piloteer-ink">Why this matters:</strong> Hunter uses your company context to calibrate momentum signals and recommend appropriate next moves for your deal complexity and timeline.
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
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Define how deals progress through your pipeline. Hunter will detect stage transitions and progression signals.
      </p>

      <div>
        <span className="eyebrow mb-3 block">Quick Start Templates</span>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(stageTemplates) as Array<keyof typeof stageTemplates>).map((key) => (
            <button
              key={key}
              onClick={() => {
                dispatch({ type: 'SET_DEAL_STAGES', stages: stageTemplates[key] });
                setSelectedTemplate(key);
                showToast(`Loaded ${key} template`);
              }}
              className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all capitalize ${
                selectedTemplate === key
                  ? 'bg-piloteer-verified-soft border-piloteer-verified-line text-piloteer-verified'
                  : 'bg-piloteer-surface-2 border-piloteer-hair-2 text-piloteer-metal hover:border-piloteer-hair hover:text-piloteer-ink'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow">Current Stages</span>
          <button
            onClick={() => {
              dispatch({ type: 'ADD_DEAL_STAGE' });
              showToast('Stage added');
            }}
            className="btn-secondary text-sm"
          >
            + Add Stage
          </button>
        </div>

        <div className="space-y-3">
          {state.dealStages.map((stage, index) => (
            <div
              key={stage.id}
              className="bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl p-4 flex items-start gap-4"
            >
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => dispatch({ type: 'UPDATE_DEAL_STAGE', id: stage.id, field: 'name', value: e.target.value })}
                  className="w-full bg-piloteer-surface-3 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink font-semibold focus:border-piloteer-focus focus:outline-none transition-colors"
                  placeholder="Stage name"
                />
                <input
                  type="text"
                  value={stage.description || ''}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_DEAL_STAGE', id: stage.id, field: 'description', value: e.target.value })
                  }
                  className="w-full bg-piloteer-surface-3 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors"
                  placeholder="Optional: What happens in this stage"
                />
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'REMOVE_DEAL_STAGE', id: stage.id });
                  showToast('Stage removed');
                }}
                className="text-piloteer-signal hover:text-piloteer-ink transition-colors mt-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Preview */}
      <div className="bg-piloteer-black border border-piloteer-hair rounded-xl p-6">
        <div className="eyebrow mb-4">Funnel Preview</div>
        <div className="space-y-2">
          {state.dealStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div
                className="h-8 bg-piloteer-verified-soft border border-piloteer-verified-line rounded flex items-center justify-center text-xs font-bold text-piloteer-verified transition-all"
                style={{ width: `${100 - index * 12}%` }}
              >
                {stage.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalesFrameworkStep({ state, dispatch }: { state: TeachState; dispatch: React.Dispatch<TeachAction> }) {
  const frameworks: SalesFramework[] = ['challenger', 'meddic', 'meddpicc', 'sandler', 'spin', 'miller-heiman', 'custom', 'none'];

  return (
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Select your team's sales methodology. Hunter will align coaching and pattern detection to your framework.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {frameworks.map((framework) => {
          const info = frameworkDescriptions[framework];
          const isSelected = state.salesFramework === framework;
          return (
            <button
              key={framework}
              onClick={() => dispatch({ type: 'SET_SALES_FRAMEWORK', framework })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'bg-piloteer-verified-soft border-piloteer-verified-line'
                  : 'bg-piloteer-surface-2 border-piloteer-hair-2 hover:border-piloteer-hair'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-bold text-lg ${isSelected ? 'text-piloteer-verified' : 'text-piloteer-ink'}`}>
                  {info.name}
                </h3>
                {isSelected && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4 12 14.01l-3-3" />
                  </svg>
                )}
              </div>
              <p className="text-sm ctx leading-relaxed mb-3">{info.description}</p>
              {info.elements && (
                <div className="flex flex-wrap gap-2">
                  {info.elements.map((element) => (
                    <span
                      key={element}
                      className="px-2 py-1 bg-piloteer-surface-3 text-piloteer-metal text-xs font-mono rounded"
                    >
                      {element}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {state.salesFramework === 'custom' && (
        <div className="space-y-4 pt-6 border-t border-piloteer-hair">
          <label className="block">
            <span className="eyebrow mb-3 block">Framework Name</span>
            <input
              type="text"
              value={state.customFrameworkName || ''}
              onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: e.target.value, notes: state.customFrameworkNotes })}
              className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              placeholder="e.g., Our Custom Sales Playbook"
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-3 block">Key Elements or Notes</span>
            <textarea
              value={state.customFrameworkNotes || ''}
              onChange={(e) => dispatch({ type: 'SET_CUSTOM_FRAMEWORK', name: state.customFrameworkName, notes: e.target.value })}
              rows={4}
              className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
              placeholder="Describe your methodology and key qualification elements..."
            />
          </label>
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
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Help Hunter understand <strong className="text-piloteer-ink">{product.name}</strong>. Upload materials, link resources, and describe what you're selling.
      </p>

      <div>
        <span className="eyebrow mb-3 block">Product Sources</span>
        <div className="space-y-3 mb-4">
          {product.sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between bg-piloteer-surface-2 border border-piloteer-hair rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-piloteer-surface-3 rounded-lg flex items-center justify-center">
                  {source.type === 'file' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-metal">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <path d="M13 2v7h7" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-metal">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-piloteer-ink">{source.name}</div>
                  {source.size && <div className="text-xs text-piloteer-mute font-mono">{source.size}</div>}
                  {source.url && <div className="text-xs text-piloteer-mute font-mono truncate max-w-md">{source.url}</div>}
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_PRODUCT_SOURCE', productId: product.id, sourceId: source.id })}
                className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={handleFileUpload} className="btn-secondary flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M17 8l-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
            Upload File
          </button>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-2 text-sm text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
            />
            <button onClick={handleAddUrl} disabled={!urlInput.trim()} className="btn-secondary disabled:opacity-50">
              Add URL
            </button>
          </div>
        </div>
      </div>

      <label className="block">
        <span className="eyebrow mb-3 block">Describe {product.name}</span>
        <textarea
          value={product.description}
          onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: 'description', value: e.target.value })}
          rows={6}
          className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
          placeholder="What does this product do? Who is it for? What problems does it solve?"
        />
        <div className="text-xs text-piloteer-mute mt-2">Hunter structures everything automatically from your description and sources.</div>
      </label>

      {product.sources.length > 0 && (
        <div className="pt-6 border-t border-piloteer-hair">
          <button
            onClick={handleDraftFromSources}
            disabled={isDrafting || product.draftGenerated}
            className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDrafting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Generating draft...
              </>
            ) : product.draftGenerated ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
                Draft generated — review sections ahead
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Draft from sources
              </>
            )}
          </button>
          <p className="text-xs ctx text-center mt-3">
            Hunter will analyze your sources and populate personas, key signals, competitive, and market info for you to review.
          </p>
        </div>
      )}
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
  const [expandedPersonas, setExpandedPersonas] = useState<Set<string>>(
    new Set(product.personas.map(p => p.id))
  );

  const toggleExpanded = (personaId: string) => {
    const newExpanded = new Set(expandedPersonas);
    if (newExpanded.has(personaId)) {
      newExpanded.delete(personaId);
    } else {
      newExpanded.add(personaId);
    }
    setExpandedPersonas(newExpanded);
  };

  const handleAddPersona = () => {
    const newPersona: Persona = {
      id: `persona-${Date.now()}`,
      name: 'New Persona',
      role: '',
      notes: '',
    };
    dispatch({ type: 'ADD_PERSONA', productId: product.id, persona: newPersona });
    showToast('Persona added');
    // Auto-expand new persona
    setExpandedPersonas(new Set([...expandedPersonas, newPersona.id]));
  };

  return (
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Define the buyers Hunter should recognize for <strong className="text-piloteer-ink">{product.name}</strong>. Focus on how they think, decide, and react during deals.
      </p>

      <div className="space-y-4">
        {product.personas.map((persona) => {
          const isExpanded = expandedPersonas.has(persona.id);
          return (
            <div key={persona.id} className="card bg-piloteer-black border-piloteer-hair-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={persona.name}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: persona.id, field: 'name', value: e.target.value })
                    }
                    className="bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink font-semibold focus:border-piloteer-focus focus:outline-none transition-colors"
                    placeholder="Persona name (e.g., CRO)"
                  />
                  <input
                    type="text"
                    value={persona.role}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: persona.id, field: 'role', value: e.target.value })
                    }
                    className="bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors"
                    placeholder="Role (e.g., Economic Buyer)"
                  />
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => toggleExpanded(persona.id)}
                    className="text-piloteer-metal hover:text-piloteer-ink transition-colors"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      dispatch({ type: 'REMOVE_PERSONA', productId: product.id, personaId: persona.id });
                      showToast('Persona removed');
                    }}
                    className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div>
                  <span className="eyebrow mb-2 block">What drives them, concerns, decision patterns</span>
                  <textarea
                    value={persona.notes}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_PERSONA', productId: product.id, personaId: persona.id, field: 'notes', value: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
                    placeholder="What they care about, fear, how they decide, what builds trust or friction..."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handleAddPersona} className="btn-secondary w-full">
        + Add Persona
      </button>

      <div className="pt-6 text-sm ctx bg-piloteer-surface-2 p-6 rounded-xl border border-piloteer-hair leading-relaxed">
        <strong className="text-piloteer-ink">Tip:</strong> Personas should be product-specific. The CRO buying Hunter may care about different things than the CRO buying Commander.
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
    <div className="space-y-6">
      <div>
        <div className="eyebrow mb-3">Workshop Progress</div>
        <p className="text-sm ctx mb-6">Build your sales strategy like a workshop, not a form.</p>
      </div>

      {/* Progress Rail */}
      <div className="flex items-center gap-3 bg-piloteer-black border border-piloteer-hair rounded-xl p-4 mb-8">
        {subSteps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setSubStep(step.id)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              subStep === step.id
                ? 'bg-piloteer-verified-soft border-2 border-piloteer-verified-line text-piloteer-verified'
                : step.completed
                ? 'bg-piloteer-surface-2 border-2 border-piloteer-hair text-piloteer-ink'
                : 'bg-piloteer-surface-2 border-2 border-piloteer-hair text-piloteer-mute'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {step.completed && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              <span>{step.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Workshop Card */}
      <div className="card bg-gradient-to-br from-piloteer-surface to-piloteer-black border-piloteer-hair-2 min-h-[400px]">
        {subStep === 'questions' && <KeyQuestionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'objectives' && <KeyObjectivesWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'differentiators' && <DifferentiatorsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
        {subStep === 'objections' && <ObjectionsWorkshop product={product} dispatch={dispatch} showToast={showToast} />}
      </div>

      {/* Workshop Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => {
            const currentIdx = subSteps.findIndex((s) => s.id === subStep);
            if (currentIdx > 0) setSubStep(subSteps[currentIdx - 1].id);
          }}
          disabled={subStep === 'questions'}
          className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous Section
        </button>
        <button
          onClick={() => {
            const currentIdx = subSteps.findIndex((s) => s.id === subStep);
            if (currentIdx < subSteps.length - 1) setSubStep(subSteps[currentIdx + 1].id);
          }}
          disabled={subStep === 'objections'}
          className="btn-secondary disabled:opacity-50"
        >
          Next Section →
        </button>
      </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-piloteer-ink mb-2">Discovery Questions</h3>
        <p className="text-sm ctx">
          Define the signals Hunter should listen for during real conversations. These shape live prompts, coaching, and decision detection.
        </p>
      </div>

      <div className="space-y-3">
        {product.keyQuestions.map((question, index) => (
          <div key={index} className="flex items-start gap-3 bg-piloteer-surface-2 border border-piloteer-hair rounded-xl p-4">
            <input
              type="text"
              value={question}
              onChange={(e) => dispatch({ type: 'UPDATE_KEY_QUESTION', productId: product.id, index, value: e.target.value })}
              className="flex-1 bg-transparent border-none outline-none text-piloteer-ink text-sm focus:outline-none"
              placeholder="Key question..."
            />
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_KEY_QUESTION', productId: product.id, index });
                showToast('Question removed');
              }}
              className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
          placeholder="Add a key question..."
          className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
        />
        <button onClick={handleAddQuestion} disabled={!newQuestion.trim()} className="btn-primary disabled:opacity-50">
          + Add
        </button>
      </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-piloteer-ink mb-2">Key Objectives</h3>
        <p className="text-sm ctx">
          What are you trying to achieve when selling {product.name}? These guide Hunter's strategic recommendations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.keyObjectives.map((objective, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-piloteer-verified-soft border border-piloteer-verified-line rounded-lg px-3 py-2 text-sm text-piloteer-verified"
          >
            <span>{objective}</span>
            <button
              onClick={() => {
                dispatch({ type: 'REMOVE_KEY_OBJECTIVE', productId: product.id, index });
                showToast('Objective removed');
              }}
              className="hover:text-piloteer-ink transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
          placeholder="Add a key objective..."
          className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
        />
        <button onClick={handleAddObjective} disabled={!newObjective.trim()} className="btn-primary disabled:opacity-50">
          + Add
        </button>
      </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-piloteer-ink mb-2">Differentiators</h3>
        <p className="text-sm ctx">
          What makes {product.name} different? Frame as "They do X, We do Y" to help Hunter articulate your advantage clearly.
        </p>
      </div>

      <div className="space-y-4">
        {product.differentiators.map((diff) => (
          <div key={diff.id} className="card bg-piloteer-black border-piloteer-hair-2">
            <div className="flex items-start gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <div className="eyebrow mb-2">They do</div>
                  <textarea
                    value={diff.they}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_DIFFERENTIATOR', productId: product.id, diffId: diff.id, field: 'they', value: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
                    placeholder="Competitors approach..."
                  />
                </div>
                <div>
                  <div className="eyebrow mb-2">We do</div>
                  <textarea
                    value={diff.we}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_DIFFERENTIATOR', productId: product.id, diffId: diff.id, field: 'we', value: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
                    placeholder="Our approach..."
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'REMOVE_DIFFERENTIATOR', productId: product.id, diffId: diff.id });
                  showToast('Differentiator removed');
                }}
                className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAddDifferentiator} className="btn-secondary w-full">
        + Add Differentiator
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-piloteer-ink mb-2">Objections & Counters</h3>
        <p className="text-sm ctx">
          Common objections buyers raise about {product.name} and how to counter them. Hunter will recognize these patterns in conversations.
        </p>
      </div>

      <div className="space-y-4">
        {product.objections.map((obj) => (
          <div key={obj.id} className="card bg-piloteer-black border-piloteer-hair-2">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="eyebrow mb-2">Objection</div>
                  <input
                    type="text"
                    value={obj.objection}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_OBJECTION', productId: product.id, objId: obj.id, field: 'objection', value: e.target.value })
                    }
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors"
                    placeholder='e.g., "How is this different from Gong?"'
                  />
                </div>
                <div>
                  <div className="eyebrow mb-2">Counter</div>
                  <textarea
                    value={obj.counter}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_OBJECTION', productId: product.id, objId: obj.id, field: 'counter', value: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
                    placeholder="How to counter this objection..."
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'REMOVE_OBJECTION', productId: product.id, objId: obj.id });
                  showToast('Objection removed');
                }}
                className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAddObjection} className="btn-secondary w-full">
        + Add Objection
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

  return (
    <div className="space-y-8">
      <p className="text-lg ctx leading-relaxed">
        Know how you win before the conversation starts. Define who <strong className="text-piloteer-ink">{product.name}</strong> competes with and your key advantages.
      </p>

      {/* Competitors Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow">Competitors</span>
          <button onClick={handleAddCompetitor} className="btn-secondary text-sm">
            + Add Competitor
          </button>
        </div>

        {product.competitors.length === 0 ? (
          <div className="card bg-piloteer-black border-piloteer-hair-2 text-center py-12">
            <p className="text-piloteer-mute mb-4">No competitors yet. Add your first competitor to start mapping the landscape.</p>
            <button onClick={handleAddCompetitor} className="btn-primary">
              + Add Competitor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {product.competitors.map((comp) => (
              <div key={comp.id} className="card bg-piloteer-black border-piloteer-hair-2">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) =>
                        dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: comp.id, field: 'name', value: e.target.value })
                      }
                      className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink font-semibold focus:border-piloteer-focus focus:outline-none transition-colors"
                      placeholder="Competitor name"
                    />
                    <textarea
                      value={comp.profile}
                      onChange={(e) =>
                        dispatch({ type: 'UPDATE_COMPETITOR', productId: product.id, compId: comp.id, field: 'profile', value: e.target.value })
                      }
                      rows={3}
                      className="w-full bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-metal text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
                      placeholder="Competitor profile: strengths, positioning, who they target..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      dispatch({ type: 'REMOVE_COMPETITOR', productId: product.id, compId: comp.id });
                      showToast('Competitor removed');
                    }}
                    className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Snapshot */}
      {product.competitors.length > 0 && (
        <div className="pt-6 border-t border-piloteer-hair">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="eyebrow mb-1 block">Comparison Snapshot</span>
              <p className="text-xs ctx">Keep your advantage visible</p>
            </div>
            <button onClick={handleAddAdvantage} className="btn-secondary text-sm">
              + Add Row
            </button>
          </div>

          {product.comparisonAdvantages.length === 0 ? (
            <div className="card bg-piloteer-surface-2 border-piloteer-hair text-center py-8">
              <p className="text-sm text-piloteer-mute mb-3">Add differentiators to surface your advantage.</p>
              <button onClick={handleAddAdvantage} className="btn-secondary text-sm">
                + Add Differentiator
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {product.comparisonAdvantages.map((adv) => (
                <div key={adv.id} className="bg-piloteer-surface-2 border border-piloteer-hair rounded-lg p-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={adv.ourAdvantage}
                    onChange={(e) => {
                      dispatch({ 
                        type: 'UPDATE_COMPARISON_ADVANTAGE', 
                        productId: product.id, 
                        advId: adv.id, 
                        field: 'ourAdvantage', 
                        value: e.target.value 
                      });
                    }}
                    className="flex-1 bg-piloteer-surface-3 border border-piloteer-hair rounded px-2 py-1.5 text-sm text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
                    placeholder="Our advantage"
                  />
                  <span className="text-piloteer-mute text-xs font-mono">vs</span>
                  <select
                    value={adv.competitorName}
                    onChange={(e) => {
                      dispatch({ 
                        type: 'UPDATE_COMPARISON_ADVANTAGE', 
                        productId: product.id, 
                        advId: adv.id, 
                        field: 'competitorName', 
                        value: e.target.value 
                      });
                    }}
                    className="bg-piloteer-surface-3 border border-piloteer-hair rounded px-2 py-1.5 text-sm text-piloteer-metal focus:border-piloteer-focus focus:outline-none"
                  >
                    <option value="">Select competitor</option>
                    {product.competitors.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_COMPARISON_ADVANTAGE', productId: product.id, advId: adv.id })}
                    className="text-piloteer-signal hover:text-piloteer-ink transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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

  const renderSignalWorkshop = (
    category: 'buyerEnvironment' | 'companyProductEnvironment' | 'dealEnvironmentSignals',
    title: string,
    description: string,
    icon: React.ReactNode
  ) => {
    const signals = product[category] as MarketSignal[];

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-piloteer-surface-2 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-piloteer-ink">{title}</h3>
            <p className="text-sm ctx">{description}</p>
          </div>
          <button
            onClick={() => handleAddSignal(category)}
            className="btn-secondary text-sm"
          >
            + Add Signal
          </button>
        </div>

        {signals.length === 0 ? (
          <div className="card bg-piloteer-black border-piloteer-hair-2 text-center py-12">
            <p className="text-piloteer-mute mb-4">No signals yet. Add your first {title.toLowerCase()} signal.</p>
            <button onClick={() => handleAddSignal(category)} className="btn-primary">
              + Add Signal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="card bg-gradient-to-br from-piloteer-surface to-piloteer-black border-piloteer-hair-2"
              >
                <div className="flex items-start gap-4">
                  <textarea
                    value={signal.signal}
                    onChange={(e) => {
                      const updatedSignals = (product[category] as MarketSignal[]).map((s) =>
                        s.id === signal.id ? { ...s, signal: e.target.value } : s
                      );
                      dispatch({ type: 'UPDATE_PRODUCT', productId: product.id, field: category, value: updatedSignals });
                    }}
                    rows={2}
                    className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2 text-piloteer-ink text-sm focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed resize-none"
                    placeholder={`Describe a ${title.toLowerCase()} signal...`}
                  />
                  <button
                    onClick={() => {
                      dispatch({ type: 'REMOVE_MARKET_SIGNAL', productId: product.id, category, signalId: signal.id });
                      showToast('Signal removed');
                    }}
                    className="text-piloteer-signal hover:text-piloteer-ink transition-colors mt-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg ctx leading-relaxed mb-2">
          Surface the market context that shapes how buyers engage with <strong className="text-piloteer-ink">{product.name}</strong>.
        </p>
        <p className="text-sm ctx">
          These signals help Hunter detect patterns and recommend contextual moves during live conversations.
        </p>
      </div>

      {renderSignalWorkshop(
        'buyerEnvironment',
        'Buyer Environment',
        'External factors, concerns, and market conditions buyers bring to the conversation',
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )}

      {renderSignalWorkshop(
        'companyProductEnvironment',
        'Company & Product Environment',
        'Internal challenges, initiatives, or organizational changes that make this product relevant',
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      )}

      {renderSignalWorkshop(
        'dealEnvironmentSignals',
        'Deal Environment Signals',
        'Specific signals during the deal cycle that indicate progression, stall risk, or champion strength',
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )}

      <div className="pt-6 text-sm ctx bg-piloteer-surface-2 p-6 rounded-xl border border-piloteer-hair leading-relaxed">
        <strong className="text-piloteer-ink">Why market intelligence matters:</strong> Hunter uses these signals to detect patterns in real time and recommend moves that match the buyer's context. The more specific and behavioral your signals, the sharper Hunter's guidance becomes during live conversations.
      </div>
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

  if (unresolvedContradictions.length === 0 && resolvedContradictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-piloteer-verified-soft border-2 border-piloteer-verified-line rounded-full flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-piloteer-ink mb-3">No conflicts detected</h3>
        <p className="text-lg ctx max-w-xl">
          Your configuration is consistent. Hunter has everything it needs to guide effectively.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg ctx leading-relaxed mb-6">
          Hunter detected potential conflicts in your configuration. Review and resolve each to ensure consistent guidance.
        </p>
        {unresolvedContradictions.length > 0 && (
          <div className="bg-piloteer-watch-soft border border-piloteer-watch-line rounded-xl p-4">
            <div className="flex items-center gap-2 text-piloteer-watch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-sm font-semibold">
                {unresolvedContradictions.length} {unresolvedContradictions.length === 1 ? 'conflict' : 'conflicts'} need resolution
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Unresolved Contradictions */}
      {unresolvedContradictions.length > 0 && (
        <div className="space-y-4">
          {unresolvedContradictions.map((contradiction) => (
            <div key={contradiction.id} className="card border-piloteer-watch-line bg-gradient-to-br from-piloteer-surface to-piloteer-black">
              <div className="mb-4">
                <div className="inline-block px-2 py-1 bg-piloteer-watch-soft text-piloteer-watch text-xs font-mono uppercase tracking-wider rounded mb-3">
                  {contradiction.type.replace('-', ' ')}
                </div>
                <h3 className="text-lg font-bold text-piloteer-ink mb-2">{contradiction.title}</h3>
                <p className="text-sm ctx leading-relaxed">{contradiction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => {
                    dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: contradiction.id, resolution: 'option1' });
                    showToast('Conflict resolved');
                  }}
                  className="p-4 bg-piloteer-surface-2 border-2 border-piloteer-hair rounded-xl text-left hover:border-piloteer-verified-line hover:bg-piloteer-verified-soft transition-all group"
                >
                  <div className="eyebrow mb-2 group-hover:text-piloteer-verified">Option A</div>
                  <p className="text-sm text-piloteer-ink leading-relaxed">{contradiction.option1}</p>
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: 'RESOLVE_CONTRADICTION', contradictionId: contradiction.id, resolution: 'option2' });
                    showToast('Conflict resolved');
                  }}
                  className="p-4 bg-piloteer-surface-2 border-2 border-piloteer-hair rounded-xl text-left hover:border-piloteer-verified-line hover:bg-piloteer-verified-soft transition-all group"
                >
                  <div className="eyebrow mb-2 group-hover:text-piloteer-verified">Option B</div>
                  <p className="text-sm text-piloteer-ink leading-relaxed">{contradiction.option2}</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved Contradictions */}
      {resolvedContradictions.length > 0 && (
        <div className="pt-6 border-t border-piloteer-hair">
          <div className="eyebrow mb-4">Resolved ({resolvedContradictions.length})</div>
          <div className="space-y-3">
            {resolvedContradictions.map((contradiction) => (
              <div key={contradiction.id} className="bg-piloteer-surface-2 border border-piloteer-verified-line rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-piloteer-verified-soft rounded flex items-center justify-center flex-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-piloteer-verified">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-piloteer-ink mb-1">{contradiction.title}</div>
                    <div className="text-xs ctx">
                      Resolved: {contradiction.resolution === 'option1' ? 'Option A' : 'Option B'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-piloteer-ink mb-3">Configure Visibility & Go Live</h2>
        <p className="text-lg ctx leading-relaxed">
          Control how Hunter operates and what it can access. You can adjust these settings anytime.
        </p>
      </div>

      {/* Visibility Controls */}
      <div className="space-y-4">
        <div className="card border-piloteer-hair-2 bg-gradient-to-br from-piloteer-surface to-piloteer-black">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-piloteer-ink">Real-time Sensing</h3>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_VISIBILITY', field: 'sensing' });
                    showToast(state.visibility.sensing ? 'Sensing disabled' : 'Sensing enabled');
                  }}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    state.visibility.sensing ? 'bg-piloteer-verified' : 'bg-piloteer-surface-3'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      state.visibility.sensing ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm ctx leading-relaxed">
                Hunter listens to customer interactions and provides real-time guidance. Required to go live.
              </p>
            </div>
          </div>
        </div>

        <div className="card border-piloteer-hair-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-piloteer-ink">CRM Writeback</h3>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_VISIBILITY', field: 'writeback' });
                    showToast(state.visibility.writeback ? 'Writeback disabled' : 'Writeback enabled');
                  }}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    state.visibility.writeback ? 'bg-piloteer-verified' : 'bg-piloteer-surface-3'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      state.visibility.writeback ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm ctx leading-relaxed">
                Allow Hunter to update deal momentum, next steps, and pattern notes in your CRM. Optional but recommended.
              </p>
            </div>
          </div>
        </div>

        <div className="card border-piloteer-hair-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-piloteer-ink">No-Monitor Commitment</h3>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_VISIBILITY', field: 'noMonitorCommitment' });
                    showToast(state.visibility.noMonitorCommitment ? 'No-monitor disabled' : 'No-monitor enabled');
                  }}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    state.visibility.noMonitorCommitment ? 'bg-piloteer-verified' : 'bg-piloteer-surface-3'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      state.visibility.noMonitorCommitment ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm ctx leading-relaxed">
                Seller tips remain private. Managers see patterns and coaching moments, never individual tips or live feeds. Recommended for team trust.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Check */}
      <div className="pt-6 border-t border-piloteer-hair">
        <div className="eyebrow mb-4">Readiness Check</div>
        <div className="space-y-3">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              state.visibility.sensing ? 'bg-piloteer-verified-soft border border-piloteer-verified-line' : 'bg-piloteer-surface-2 border border-piloteer-hair'
            }`}
          >
            {state.visibility.sensing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-mute">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <span className={`text-sm font-semibold ${state.visibility.sensing ? 'text-piloteer-verified' : 'text-piloteer-mute'}`}>
              Sensing enabled
            </span>
          </div>
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              allProductsComplete ? 'bg-piloteer-verified-soft border border-piloteer-verified-line' : 'bg-piloteer-surface-2 border border-piloteer-hair'
            }`}
          >
            {allProductsComplete ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-mute">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            <span className={`text-sm font-semibold ${allProductsComplete ? 'text-piloteer-verified' : 'text-piloteer-mute'}`}>
              All products configured
            </span>
          </div>
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              unresolvedContradictions === 0 ? 'bg-piloteer-verified-soft border border-piloteer-verified-line' : 'bg-piloteer-surface-2 border border-piloteer-hair'
            }`}
          >
            {unresolvedContradictions === 0 ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-watch">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
            <span className={`text-sm font-semibold ${unresolvedContradictions === 0 ? 'text-piloteer-verified' : 'text-piloteer-watch'}`}>
              {unresolvedContradictions === 0 ? 'No conflicts' : `${unresolvedContradictions} conflicts to resolve`}
            </span>
          </div>
        </div>
      </div>

      {canGoLive ? (
        <div className="card bg-gradient-to-br from-piloteer-verified-soft to-piloteer-surface border-piloteer-verified-line text-center py-8">
          <div className="w-16 h-16 bg-piloteer-verified-soft border-2 border-piloteer-verified-line rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-verified">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-piloteer-ink mb-3">Ready to Go Live</h3>
          <p className="text-lg ctx mb-6 max-w-xl mx-auto">
            Hunter is configured and ready to start guiding your team. Click below to complete setup and activate sensing.
          </p>
        </div>
      ) : (
        <div className="card bg-piloteer-surface-2 border-piloteer-hair-2 text-center py-8">
          <p className="text-sm ctx">
            Complete the items above to go live. You can always return to adjust your configuration later.
          </p>
        </div>
      )}
    </div>
  );
}
