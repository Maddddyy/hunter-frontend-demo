'use client';

import { useState } from 'react';
import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';

// Hybrid Teach Journey Steps
const TEACH_STEPS = [
  { id: 1, title: 'Product count', description: 'How many products do you sell?' },
  { id: 2, title: 'Add sources', description: 'Optional: Help Hunter draft faster' },
  { id: 3, title: 'What we sell', description: 'About & value for each product' },
  { id: 4, title: 'Who we sell to', description: 'Personas & buying signals' },
  { id: 5, title: 'Deal stages', description: 'Your sales process stages' },
  { id: 6, title: 'How we win', description: 'Differentiators, objections, competitive' },
  { id: 7, title: 'Company context', description: 'Company profile & market' },
  { id: 8, title: 'Gaps & contradictions', description: 'Review what Hunter needs' },
  { id: 9, title: 'Go live', description: 'Standards, visibility, handoff' },
];

type Source = {
  name: string;
  type: 'url' | 'pdf' | 'note';
  status: 'reading' | 'ready';
};

export default function TeachPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [productCount, setProductCount] = useState(1);
  const [productNames, setProductNames] = useState(['Hunter']);
  const [sources, setSources] = useState<Source[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [hasSourceFromStep2, setHasSourceFromStep2] = useState(false);
  
  const [productAbouts, setProductAbouts] = useState(['Real-time sales performance system that provides private, intelligent guidance during live customer interactions']);
  const [personas, setPersonas] = useState(['CRO', 'VP Revenue Operations', 'VP Sales Enablement']);
  const [buyingSignals, setBuyingSignals] = useState(['Concern about rep performance consistency', 'Interest in real-time coaching', 'Security questions about live sensing']);
  const [dealStages, setDealStages] = useState(['Discovery', 'Technical Validation', 'Proposal', 'Negotiation', 'Closed Won']);
  const [stageObjectives, setStageObjectives] = useState<Record<string, string>>({
    'Discovery': 'Understand business challenges and quantify impact',
    'Technical Validation': 'Confirm technical fit and security requirements',
    'Proposal': 'Present tailored solution with clear ROI',
    'Negotiation': 'Finalize terms and secure executive commitment',
    'Closed Won': 'Transition to implementation with clear success criteria',
  });
  const [differentiators, setDifferentiators] = useState(['Real-time guidance during calls', 'Private seller tips', 'Behavioral science foundation']);
  const [objections, setObjections] = useState([
    { objection: 'How is this different from Gong?', counter: 'Gong analyzes after. Hunter guides during.' },
    { objection: 'Team will feel surveilled', counter: 'Tips are private to seller. Managers see patterns, never live tips.' },
  ]);
  const [companyOverview, setCompanyOverview] = useState('Piloteer sells Hunter to revenue leaders who want their teams to perform like their best sellers');
  
  const [contradictionChoices, setContradictionChoices] = useState<Record<string, string>>({});

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= TEACH_STEPS.length) {
      setCurrentStep(nextStep);
      setMaxStep(Math.max(maxStep, nextStep));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= maxStep) {
      setCurrentStep(stepId);
    }
  };

  const addSource = (name: string, type: 'url' | 'pdf' | 'note') => {
    const newSource: Source = { name, type, status: 'reading' };
    setSources([...sources, newSource]);
    setHasSourceFromStep2(true);
    
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.name === name ? { ...s, status: 'ready' } : s
      ));
    }, 1500);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const cleanUrl = urlInput.replace(/^https?:\/\//, '');
      addSource(cleanUrl, 'url');
      setUrlInput('');
    }
  };

  const handleFileUpload = () => {
    addSource('Sales Deck Q4 2026.pdf', 'pdf');
  };

  const handleSkipSources = () => {
    handleNext();
  };

  const progress = (currentStep / TEACH_STEPS.length) * 100;

  return (
    <div className="min-h-screen flex bg-piloteer-void">
      {/* Left Rail - Journey Steps */}
      <aside className="w-80 border-r border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-plane flex flex-col">
        <div className="p-6 border-b border-piloteer-hair">
          <PiloteerLogo className="h-7 opacity-90 mb-3" />
          <h2 className="font-disp font-bold text-lg interp">Teach Hunter</h2>
          <div className="eyebrow mt-1.5">Revenue Leader Onboarding</div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-2">
            {TEACH_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={step.id > maxStep}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all group ${
                  currentStep === step.id
                    ? 'bg-piloteer-surface-3 border border-piloteer-hair-2'
                    : step.id < currentStep
                    ? 'hover:bg-piloteer-surface-2'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5 ${
                    step.id < currentStep
                      ? 'bg-piloteer-verified-soft border border-piloteer-verified-line text-piloteer-verified'
                      : currentStep === step.id
                      ? 'bg-piloteer-surface border border-piloteer-ink text-piloteer-ink'
                      : 'bg-piloteer-surface border border-piloteer-hair-2 text-piloteer-mute'
                  }`}>
                    {step.id < currentStep ? '✓' : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-disp font-semibold text-sm leading-snug ${
                      currentStep === step.id ? 'text-piloteer-ink' : 'text-piloteer-metal'
                    }`}>
                      {step.title}
                    </div>
                    {currentStep === step.id && (
                      <div className="text-xs text-piloteer-mute mt-0.5 leading-snug">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-piloteer-hair p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mb-2">
            Progress
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-piloteer-surface-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-piloteer-metal rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs font-mono text-piloteer-metal">
              {currentStep}/{TEACH_STEPS.length}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-12 py-12">
            {renderStepContent(
              currentStep,
              {
                productCount,
                setProductCount,
                productNames,
                setProductNames,
                sources,
                urlInput,
                setUrlInput,
                handleAddUrl,
                handleFileUpload,
                handleSkipSources,
                hasSourceFromStep2,
                productAbouts,
                setProductAbouts,
                personas,
                setPersonas,
                buyingSignals,
                setBuyingSignals,
                dealStages,
                setDealStages,
                stageObjectives,
                setStageObjectives,
                differentiators,
                setDifferentiators,
                objections,
                setObjections,
                companyOverview,
                setCompanyOverview,
                contradictionChoices,
                setContradictionChoices,
              }
            )}
          </div>
        </main>

        {/* Footer Navigation */}
        <div className="border-t border-piloteer-hair bg-piloteer-black/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-12 py-5 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {currentStep === TEACH_STEPS.length ? (
              <Link href="/console" className="btn-primary px-6 py-3">
                Go to Console →
              </Link>
            ) : (
              <button onClick={handleNext} className="btn-primary px-6 py-3">
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderStepContent(
  step: number,
  state: any
) {
  const {
    productCount,
    setProductCount,
    productNames,
    setProductNames,
    sources,
    urlInput,
    setUrlInput,
    handleAddUrl,
    handleFileUpload,
    handleSkipSources,
    hasSourceFromStep2,
    productAbouts,
    setProductAbouts,
    personas,
    setPersonas,
    buyingSignals,
    setBuyingSignals,
    dealStages,
    setDealStages,
    stageObjectives,
    setStageObjectives,
    differentiators,
    setDifferentiators,
    objections,
    setObjections,
    companyOverview,
    setCompanyOverview,
    contradictionChoices,
    setContradictionChoices,
  } = state;

  switch (step) {
    // Step 1: Product Count (Mandatory First)
    case 1:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 1 · Product Count</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              How many products do you sell?
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Always start here. Hunter needs to know your product portfolio before anything else.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="eyebrow mb-3 block">Number of products</label>
              <select
                value={productCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setProductCount(count);
                  // Ensure productNames and productAbouts arrays match the count
                  const newNames = [...productNames];
                  const newAbouts = [...productAbouts];
                  while (newNames.length < count) newNames.push('');
                  while (newAbouts.length < count) newAbouts.push('');
                  setProductNames(newNames.slice(0, count));
                  setProductAbouts(newAbouts.slice(0, count));
                }}
                className="w-full max-w-md bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              >
                <option value={1}>1 product</option>
                <option value={2}>2 products</option>
                <option value={3}>3 products</option>
                <option value={4}>4+ products</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="eyebrow block">Product name{productCount > 1 ? 's' : ''}</label>
              {Array.from({ length: productCount }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={productNames[idx] || ''}
                  onChange={(e) => {
                    const newNames = [...productNames];
                    newNames[idx] = e.target.value;
                    setProductNames(newNames);
                  }}
                  placeholder={`Product ${idx + 1} name`}
                  className="w-full max-w-md bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
                />
              ))}
            </div>

            <div className="card bg-piloteer-surface-2 border-piloteer-hair max-w-2xl">
              <p className="text-sm ctx leading-relaxed">
                <strong className="text-piloteer-ink">Why this matters:</strong> Hunter structures its knowledge around products. 
                Starting with count ensures the curriculum fits your portfolio—one deep dive per product, 
                not a generic "tell us about your business" form.
              </p>
            </div>
          </div>
        </div>
      );

    // Step 2: Add Sources (Optional)
    case 2:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 2 · Add Sources (Optional)</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Help Hunter draft faster.
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Paste a website URL or upload a deck. Hunter will read it and draft-fill the structured fields ahead. 
              <strong className="text-piloteer-ink"> You can skip this</strong> and fill everything manually—or add sources now to speed up later steps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Input */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-piloteer-surface-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-piloteer-metal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>
                  </svg>
                </div>
                <div>
                  <div className="font-disp font-bold text-piloteer-ink">Website URL</div>
                  <div className="text-xs text-piloteer-mute">Company site or product page</div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                  placeholder="https://yourcompany.com"
                  className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-lg px-3 py-2.5 text-sm text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
                />
                <button onClick={handleAddUrl} className="btn-secondary px-4">
                  Add
                </button>
              </div>
            </div>

            {/* PDF/Deck Upload */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-piloteer-surface-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-piloteer-metal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div>
                  <div className="font-disp font-bold text-piloteer-ink">Upload PDF or deck</div>
                  <div className="text-xs text-piloteer-mute">Sales deck, one-pager, playbook</div>
                </div>
              </div>
              <button onClick={handleFileUpload} className="btn-secondary w-full">
                Choose file
              </button>
            </div>
          </div>

          {/* Sources List */}
          {sources.length > 0 && (
            <div className="card border-piloteer-hair">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-piloteer-hair">
                <div className="font-disp font-bold text-piloteer-ink">Sources added</div>
                <div className="text-xs font-mono text-piloteer-mute">{sources.length} source{sources.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="space-y-2">
                {sources.map((source: Source, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 bg-piloteer-surface-2 rounded-lg border border-piloteer-hair">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-piloteer-metal">
                        {source.type === 'url' && (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20"/>
                          </svg>
                        )}
                        {source.type === 'pdf' && (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <path d="M14 2v6h6"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-piloteer-metal truncate">{source.name}</span>
                    </div>
                    <div className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                      source.status === 'reading'
                        ? 'bg-piloteer-watch-soft text-piloteer-watch border-piloteer-watch-line'
                        : 'bg-piloteer-verified-soft text-piloteer-verified border-piloteer-verified-line'
                    }`}>
                      {source.status === 'reading' ? 'Reading...' : '✓ Ready'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card bg-piloteer-surface-2 border-piloteer-hair max-w-2xl">
            <p className="text-sm ctx leading-relaxed mb-3">
              <strong className="text-piloteer-ink">One URL or one deck is enough</strong> for the mock. 
              Real-world: sales training is structured knowledge transfer. AI helps draft fields from a website/deck; 
              humans confirm/edit. This is NOT "upload 50 PDFs."
            </p>
            <button onClick={handleSkipSources} className="btn-ghost text-sm">
              Skip sources and fill manually →
            </button>
          </div>
        </div>
      );

    // Step 3: What We Sell
    case 3:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 3 · What We Sell</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              About & value for {productCount === 1 ? productNames[0] || 'each product' : 'each product'}
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Structured fields for product understanding. 
              {hasSourceFromStep2 && <strong className="text-piloteer-ink"> Pre-filled from your source</strong>}—edit as needed.
            </p>
          </div>

          <div className="space-y-8">
            {Array.from({ length: productCount }).map((_, idx) => (
              <div key={idx} className="space-y-6">
                {productCount > 1 && (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-piloteer-surface-3 border border-piloteer-hair flex items-center justify-center text-sm font-mono text-piloteer-metal">
                      {idx + 1}
                    </div>
                    <div className="eyebrow">Product {idx + 1}</div>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="eyebrow">Product name</label>
                  </div>
                  <input
                    type="text"
                    value={productNames[idx] || ''}
                    onChange={(e) => {
                      const newNames = [...productNames];
                      newNames[idx] = e.target.value;
                      setProductNames(newNames);
                    }}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="eyebrow">What does it do? (Value proposition)</label>
                    {hasSourceFromStep2 && idx === 0 && (
                      <span className="text-xs font-mono px-2 py-1 rounded bg-piloteer-watch-soft text-piloteer-watch border border-piloteer-watch-line">
                        AI-DRAFTED
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={5}
                    value={productAbouts[idx] || ''}
                    onChange={(e) => {
                      const newAbouts = [...productAbouts];
                      newAbouts[idx] = e.target.value;
                      setProductAbouts(newAbouts);
                    }}
                    className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none leading-relaxed"
                  />
                  {hasSourceFromStep2 && idx === 0 && (
                    <div className="mt-2 text-xs text-piloteer-mute flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <path d="M14 2v6h6"/>
                      </svg>
                      Drafted from {sources[0]?.name || 'your source'} — edit to match your messaging
                    </div>
                  )}
                </div>
                {productCount > 1 && idx < productCount - 1 && (
                  <div className="border-t border-piloteer-hair pt-6" />
                )}
              </div>
            ))}

            <div className="card bg-piloteer-surface-2 border-piloteer-hair">
              <p className="text-sm ctx leading-relaxed">
                Keep it concise. Hunter uses this to recognize when a buyer conversation matches this product's value.
              </p>
            </div>
          </div>
        </div>
      );

    // Step 4: Who We Sell To
    case 4:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 4 · Who We Sell To</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Personas & buying signals
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Who buys, and what signals tell you they're a fit.
            </p>
          </div>

          <div className="space-y-8">
            {/* Personas */}
            <div>
              <label className="eyebrow mb-3 block">Key buyer personas</label>
              <div className="space-y-2">
                {personas.map((persona: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                    <span className="text-piloteer-ink">{persona}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPersonas([...personas, 'New Persona'])}
                className="btn-secondary w-full mt-3"
              >
                + Add persona
              </button>
            </div>

            {/* Buying Signals */}
            <div>
              <label className="eyebrow mb-3 block">Buying signals (what tells you they need this)</label>
              <div className="space-y-2">
                {buyingSignals.map((signal: string, idx: number) => (
                  <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                    <p className="text-piloteer-ink text-sm">{signal}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setBuyingSignals([...buyingSignals, 'New signal'])}
                className="btn-secondary w-full mt-3"
              >
                + Add signal
              </button>
            </div>
          </div>
        </div>
      );

    // Step 5: Deal Stages
    case 5:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 5 · Deal Stages</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Your sales process stages
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Your deal stages and what Hunter should listen for at each stage.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="eyebrow mb-3 block">Deal stages (in order)</label>
              <div className="space-y-3">
                {dealStages.map((stage: string, idx: number) => (
                  <div key={idx} className="card bg-piloteer-black border-piloteer-hair-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 rounded-full bg-piloteer-surface-3 flex items-center justify-center text-xs font-mono text-piloteer-mute">
                        {idx + 1}
                      </div>
                      <span className="text-piloteer-ink font-semibold">{stage}</span>
                    </div>
                    <div>
                      <div className="eyebrow mb-2">Interaction objective for this stage</div>
                      <textarea
                        rows={2}
                        value={stageObjectives[stage] || ''}
                        onChange={(e) => {
                          setStageObjectives({
                            ...stageObjectives,
                            [stage]: e.target.value,
                          });
                        }}
                        placeholder="What should happen in interactions at this stage?"
                        className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-lg px-3 py-2.5 text-sm text-piloteer-ink focus:border-piloteer-focus focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-piloteer-surface-2 border-piloteer-hair">
              <p className="text-sm ctx leading-relaxed">
                Hunter maps conversations to stages to provide context-aware guidance. 
                Stage objectives help Hunter understand what success looks like at each phase.
              </p>
            </div>
          </div>
        </div>
      );

    // Step 6: How We Win
    case 6:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 6 · How We Win</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Differentiators, objections, competitive
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              What sets you apart, common objections, and who you compete with.
            </p>
          </div>

          <div className="space-y-8">
            {/* Differentiators */}
            <div>
              <label className="eyebrow mb-3 block">Key differentiators</label>
              <div className="space-y-2">
                {differentiators.map((diff: string, idx: number) => (
                  <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                    <p className="text-piloteer-ink text-sm">{diff}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setDifferentiators([...differentiators, 'New differentiator'])}
                className="btn-secondary w-full mt-3"
              >
                + Add differentiator
              </button>
            </div>

            {/* Objections */}
            <div>
              <label className="eyebrow mb-3 block">Common objections & counters</label>
              <div className="space-y-3">
                {objections.map((obj: { objection: string; counter: string }, idx: number) => (
                  <div key={idx} className="card bg-piloteer-black border-piloteer-hair-2">
                    <div className="eyebrow mb-2">Objection</div>
                    <div className="text-sm ctx mb-4">{obj.objection}</div>
                    <div className="eyebrow mb-2">Counter</div>
                    <div className="text-sm text-piloteer-ink">{obj.counter}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setObjections([...objections, { objection: 'New objection', counter: 'Counter message' }])}
                className="btn-secondary w-full mt-3"
              >
                + Add objection
              </button>
            </div>

            {/* Competitive */}
            <div>
              <label className="eyebrow mb-3 block">Competitive landscape</label>
              <div className="flex flex-wrap gap-2">
                {['Gong', 'Chorus', 'Salesforce Einstein', 'Clari'].map((comp: string, idx: number) => (
                  <div key={idx} className="bg-piloteer-surface-2 px-4 py-2 rounded-lg text-sm text-piloteer-ink border border-piloteer-hair">
                    {comp}
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full mt-3">
                + Add competitor
              </button>
            </div>
          </div>
        </div>
      );

    // Step 7: Company Context
    case 7:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 7 · Company Context</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Company profile & market
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              High-level company context and market positioning.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="eyebrow mb-3 block">Company overview</label>
              <textarea
                rows={5}
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="eyebrow mb-3 block">Sales framework</label>
              <select className="w-full max-w-md bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none">
                <option>MEDDPICC</option>
                <option>BANT</option>
                <option>Challenger</option>
                <option>Solution Selling</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="card bg-piloteer-surface-2 border-piloteer-hair">
              <p className="text-sm ctx leading-relaxed">
                Hunter uses this context to interpret patterns in the context of your company's approach.
              </p>
            </div>
          </div>
        </div>
      );

    // Step 8: Gaps & Contradictions
    case 8:
      return (
        <div className="space-y-8">
          <div>
            <div className="eyebrow mb-3">Step 8 · Gaps & Contradictions</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Hunter still needs...
            </h1>
            <p className="text-lg ctx leading-relaxed max-w-2xl">
              Short review of empty critical fields and one company-standard vs observed contradiction.
            </p>
          </div>

          <div className="space-y-6">
            {/* Missing Fields */}
            <div>
              <div className="eyebrow mb-3">Missing critical fields</div>
              <div className="space-y-3">
                <div className="card border-piloteer-signal-line bg-gradient-to-r from-piloteer-signal-soft to-transparent">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-piloteer-signal-soft border border-piloteer-signal-line flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-piloteer-signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-disp font-bold text-piloteer-ink mb-1">Integration objectives missing</div>
                      <div className="text-sm ctx">
                        Hunter needs to know what successful CRM integration looks like for your team.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contradictions */}
            <div>
              <div className="eyebrow mb-3">Observed contradiction</div>
              <div className="card border-piloteer-watch-line">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-piloteer-hair">
                  <svg className="w-5 h-5 text-piloteer-watch" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <path d="M12 9v4M12 17h.01"/>
                  </svg>
                  <div className="font-disp font-bold text-piloteer-ink">
                    Website vs enterprise messaging
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-piloteer-surface-2 rounded-lg border border-piloteer-hair-2">
                    <div className="eyebrow mb-2">Company Standard</div>
                    <div className="text-sm text-piloteer-ink mb-3">
                      Website leads with "productivity"
                    </div>
                    <div className="text-xs ctx">Your approved messaging</div>
                  </div>
                  <div className="p-4 bg-piloteer-verified-soft rounded-lg border border-piloteer-verified-line">
                    <div className="eyebrow mb-2 text-piloteer-verified">Observed Pattern</div>
                    <div className="text-sm text-piloteer-ink mb-3">
                      Won enterprise deals emphasize "organizational capacity"
                    </div>
                    <div className="text-xs ctx">From closed-won narratives</div>
                  </div>
                </div>

                <div className="p-4 bg-piloteer-surface-3 rounded-lg border border-piloteer-hair mb-4">
                  <div className="eyebrow mb-2">Hunter suggests</div>
                  <div className="text-sm text-piloteer-ink">
                    Vary messaging by segment: "organizational capacity" for enterprise, "productivity" for mid-market
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setContradictionChoices({ ...contradictionChoices, messaging: 'keep' })}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      contradictionChoices.messaging === 'keep'
                        ? 'bg-piloteer-ink text-piloteer-void border-piloteer-ink font-semibold'
                        : 'bg-piloteer-surface-2 text-piloteer-ink border-piloteer-hair-2 hover:bg-piloteer-surface-3'
                    }`}
                  >
                    Keep my standard
                  </button>
                  <button
                    onClick={() => setContradictionChoices({ ...contradictionChoices, messaging: 'adopt' })}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      contradictionChoices.messaging === 'adopt'
                        ? 'bg-piloteer-ink text-piloteer-void border-piloteer-ink font-semibold'
                        : 'bg-piloteer-surface-2 text-piloteer-ink border-piloteer-hair-2 hover:bg-piloteer-surface-3'
                    }`}
                  >
                    Adopt as pattern
                  </button>
                  <button
                    onClick={() => setContradictionChoices({ ...contradictionChoices, messaging: 'later' })}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      contradictionChoices.messaging === 'later'
                        ? 'bg-piloteer-ink text-piloteer-void border-piloteer-ink font-semibold'
                        : 'bg-piloteer-surface-2 text-piloteer-ink border-piloteer-hair-2 hover:bg-piloteer-surface-3'
                    }`}
                  >
                    Decide later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    // Step 9: Go Live
    case 9:
      return (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#22222C" strokeWidth="3"/>
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="#5BC08D" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="289"
                    strokeDashoffset="70"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PiloteerLogo className="h-10 opacity-90" />
                </div>
              </div>
            </div>
            <div className="eyebrow mb-3">Step 9 · Go Live</div>
            <h1 className="text-4xl font-bold interp mb-4 leading-tight">
              Ready to activate Hunter.
            </h1>
            <p className="text-lg ctx leading-relaxed">
              Your company model is built. Approve standards, set visibility, and Hunter begins observing 
              your deals—quietly calibrating for about two weeks before live guidance switches on.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Model Summary */}
            <div className="card">
              <div className="font-disp font-bold text-lg text-piloteer-ink mb-4">Your company model</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg text-sm">
                  <strong className="text-piloteer-ink">{productCount}</strong> product{productCount !== 1 ? 's' : ''}
                </span>
                <span className="px-3 py-1.5 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg text-sm">
                  <strong className="text-piloteer-ink">{personas.length}</strong> personas
                </span>
                <span className="px-3 py-1.5 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg text-sm">
                  <strong className="text-piloteer-ink">{dealStages.length}</strong> stages
                </span>
                <span className="px-3 py-1.5 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg text-sm">
                  <strong className="text-piloteer-ink">{differentiators.length}</strong> differentiators
                </span>
                <span className="px-3 py-1.5 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg text-sm">
                  <strong className="text-piloteer-ink">{objections.length}</strong> objections mapped
                </span>
              </div>
              <p className="text-sm ctx">
                Built from {sources.length} source{sources.length !== 1 ? 's' : ''}, structured curriculum, and your answers. 
                This becomes Hunter's foundation.
              </p>
            </div>

            {/* Visibility */}
            <div className="card">
              <div className="font-disp font-bold text-piloteer-ink mb-3">Visibility & Standards</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-piloteer-surface-2 rounded-lg border border-piloteer-hair">
                  <div className="flex-1">
                    <div className="font-disp font-semibold text-sm text-piloteer-ink">Seller controls sensing</div>
                    <div className="text-xs text-piloteer-mute mt-0.5">Explicit start, pause, stop—no hidden monitoring</div>
                  </div>
                  <div className="w-11 h-6 bg-piloteer-verified-soft border border-piloteer-verified-line rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-piloteer-verified rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-piloteer-surface-2 rounded-lg border border-piloteer-hair">
                  <div className="flex-1">
                    <div className="font-disp font-semibold text-sm text-piloteer-ink">Rep approves CRM writeback</div>
                    <div className="text-xs text-piloteer-mute mt-0.5">Nothing written to Salesforce without approval</div>
                  </div>
                  <div className="w-11 h-6 bg-piloteer-verified-soft border border-piloteer-verified-line rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-piloteer-verified rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-piloteer-surface-2 rounded-lg border border-piloteer-hair">
                  <div className="flex-1">
                    <div className="font-disp font-semibold text-sm text-piloteer-ink">Live tips stay private to seller</div>
                    <div className="text-xs text-piloteer-mute mt-0.5">Managers see patterns & evidence, never real-time tips</div>
                  </div>
                  <div className="w-11 h-6 bg-piloteer-verified-soft border border-piloteer-verified-line rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-piloteer-verified rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Calibration Phase */}
            <div className="card bg-gradient-to-br from-piloteer-verified-soft to-transparent border-piloteer-verified-line">
              <div className="font-disp font-bold text-piloteer-ink mb-2">What happens next</div>
              <div className="text-sm ctx space-y-2 leading-relaxed">
                <p>
                  Hunter begins <strong className="text-piloteer-ink">observe-only calibration</strong> (~2 weeks). 
                  It watches real interactions, learns each deal's normal pace, and builds momentum baselines—before it ever whispers a tip.
                </p>
                <p>
                  Sellers see nothing during calibration. No premature guidance. Once calibrated, live tips switch on.
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="text-center pt-4">
              <Link href="/console" className="btn-primary px-8 py-4 text-base">
                Activate Hunter & go to Console →
              </Link>
              <p className="text-xs text-piloteer-mute mt-4">
                You can add products, update messaging, or refine the model anytime after go-live
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
