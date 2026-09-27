'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { teachSteps } from '@/lib/data/mockData';

export default function TeachPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = teachSteps[currentStep];

  const handleNext = () => {
    if (currentStep < teachSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex">
        {/* Left Rail - Sales Configuration Steps */}
        <aside className="w-80 border-r border-piloteer-hair bg-piloteer-black-alt overflow-y-auto">
          <div className="p-6">
            <div className="eyebrow mb-4">Sales Configuration</div>
            <h2 className="text-xl font-bold interp mb-6">Teaching Hunter</h2>
            
            <div className="space-y-6">
              {/* Products Group */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mb-3">
                  Products
                </div>
                <button
                  onClick={() => setCurrentStep(0)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    currentStep === 0
                      ? 'bg-piloteer-surface-3 text-piloteer-ink font-semibold'
                      : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      teachSteps[0].completed ? 'bg-piloteer-verified' : 'bg-piloteer-mute'
                    }`} />
                    <span>{teachSteps[0].title}</span>
                  </div>
                </button>
              </div>

              {/* Product 1: Hunter */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mb-3">
                  Product 1: Hunter
                </div>
                <div className="space-y-1">
                  {teachSteps.slice(1, 9).map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentStep(idx + 1)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentStep === idx + 1
                          ? 'bg-piloteer-surface-3 text-piloteer-ink font-semibold'
                          : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          s.completed ? 'bg-piloteer-verified' : 'bg-piloteer-mute'
                        }`} />
                        <span>{s.title.replace('Product 1: ', '')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute mb-3">
                  Company
                </div>
                <div className="space-y-1">
                  {teachSteps.slice(9).map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentStep(idx + 9)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentStep === idx + 9
                          ? 'bg-piloteer-surface-3 text-piloteer-ink font-semibold'
                          : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          s.completed ? 'bg-piloteer-verified' : 'bg-piloteer-mute'
                        }`} />
                        <span>{s.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-piloteer-hair">
              <div className="text-xs ctx leading-relaxed">
                <strong className="text-piloteer-ink">{teachSteps.filter(s => s.completed).length}</strong> of {teachSteps.length} steps completed
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Current Step Form */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-12 py-12">
            <div className="mb-8">
              <div className="eyebrow mb-3">Step {currentStep + 1} of {teachSteps.length}</div>
              <h1 className="text-4xl font-bold interp mb-4">{step.title}</h1>
            </div>

            <div className="card border-piloteer-hair-2 min-h-[480px] flex flex-col">
              <div className="flex-1">
                {renderStepContent(currentStep)}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-piloteer-hair mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                {currentStep === teachSteps.length - 1 ? (
                  <Link href="/console" className="btn-primary py-3.5 px-6">
                    Complete Setup →
                  </Link>
                ) : (
                  <button onClick={handleNext} className="btn-primary py-3.5 px-6">
                    Continue →
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}

function renderStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Let's start by understanding what your revenue team sells.
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="eyebrow mb-3 block">Number of products</span>
              <select className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors">
                <option>1 product</option>
                <option>2-3 products</option>
                <option>4+ products</option>
              </select>
            </label>
          </div>
          <div className="pt-6 text-sm ctx bg-piloteer-surface-2 p-6 rounded-xl border border-piloteer-hair leading-relaxed">
            We'll teach Hunter about each product one at a time. This helps Hunter understand what to listen for in your customer conversations.
          </div>
        </div>
      );

    case 1:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Help Hunter understand what you're selling.
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="eyebrow mb-3 block">Product name</span>
              <input
                type="text"
                defaultValue="Hunter"
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-3 block">What does Hunter do?</span>
              <textarea
                rows={6}
                defaultValue="Real-time sales performance system that provides private guidance during live customer interactions. Helps every seller perform like your best sellers by whispering the next best move while the outcome can still change."
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
              />
            </label>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Who are the key personas who buy Hunter?
          </p>
          <div className="space-y-3">
            {['CRO', 'VP Revenue Operations', 'VP Sales Enablement', 'Sales Managers'].map((persona, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-piloteer-ink">{persona}</span>
              </div>
            ))}
            <button className="btn-secondary w-full mt-4">+ Add persona</button>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What signals tell you a buyer might need Hunter?
          </p>
          <div className="space-y-3">
            {[
              'Mentions of AI tool fatigue',
              'Concern about rep performance consistency',
              'Interest in real-time coaching vs post-call review',
              'Security and compliance questions about live call sensing',
            ].map((signal, idx) => (
              <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                <p className="text-piloteer-ink">{signal}</p>
              </div>
            ))}
            <button className="btn-secondary w-full mt-4">+ Add signal</button>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What are your key sales objectives when selling Hunter?
          </p>
          <div className="space-y-3">
            {[
              'Improve deal momentum across the team',
              'Scale best-seller behaviors to entire team',
              'Reduce time to productivity for new reps',
              'Evidence-based coaching for managers',
            ].map((obj, idx) => (
              <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                <p className="text-piloteer-ink">{obj}</p>
              </div>
            ))}
            <button className="btn-secondary w-full mt-4">+ Add objective</button>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What makes Hunter different from alternatives?
          </p>
          <div className="space-y-3">
            {[
              'Real-time guidance during calls (not post-call analysis)',
              'Private seller tips (not surveillance)',
              'Behavioral science foundation',
              'Evidence-labeled intelligence',
            ].map((diff, idx) => (
              <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                <p className="text-piloteer-ink">{diff}</p>
              </div>
            ))}
            <button className="btn-secondary w-full mt-4">+ Add differentiator</button>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Common objections and how to counter them
          </p>
          <div className="space-y-4">
            <div className="card bg-piloteer-black border-piloteer-hair-2">
              <div className="eyebrow mb-2">Objection</div>
              <div className="text-sm ctx mb-4">
                "How is this different from Gong/Chorus?"
              </div>
              <div className="eyebrow mb-2">Counter</div>
              <div className="text-sm text-piloteer-ink">
                "Gong records and analyzes after. Hunter guides during. Complementary, not competitive."
              </div>
            </div>
            <div className="card bg-piloteer-black border-piloteer-hair-2">
              <div className="eyebrow mb-2">Objection</div>
              <div className="text-sm ctx mb-4">
                "Our team will feel surveilled"
              </div>
              <div className="eyebrow mb-2">Counter</div>
              <div className="text-sm text-piloteer-ink">
                "Hunter tips are private to the seller. Managers see patterns and evidence, never live tips or recordings."
              </div>
            </div>
            <button className="btn-secondary w-full mt-4">+ Add objection</button>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Who does Hunter compete with?
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Gong', 'Chorus', 'Salesforce Einstein', 'Clari'].map((comp, idx) => (
              <div key={idx} className="bg-piloteer-surface-2 px-4 py-2 rounded-lg text-sm text-piloteer-ink border border-piloteer-hair">
                {comp}
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full">+ Add competitor</button>
        </div>
      );

    case 8:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Market intelligence and trends
          </p>
          <textarea
            rows={8}
            placeholder="What's happening in your market? What are buyers talking about?"
            defaultValue="Enterprise buyers mention 'AI fatigue' and 'tool sprawl' in 60% of discovery calls. Market saturation concern requires differentiation as performance system, not another AI point solution."
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
          />
        </div>
      );

    case 9:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            Tell Hunter about your company
          </p>
          <label className="block">
            <span className="eyebrow mb-3 block">Company overview</span>
            <textarea
              rows={6}
              defaultValue="Piloteer builds sales performance systems. We sell Hunter to revenue leaders who want their teams to perform like their best sellers."
              className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
            />
          </label>
        </div>
      );

    case 10:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What are your deal stages?
          </p>
          <div className="space-y-2">
            {['Discovery', 'Technical Validation', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, idx) => (
              <div key={idx} className="bg-piloteer-surface-2 p-4 rounded-xl flex items-center justify-between border border-piloteer-hair">
                <span className="text-piloteer-ink font-medium">{stage}</span>
                <button className="text-piloteer-metal hover:text-piloteer-ink text-sm font-mono">Edit</button>
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full mt-4">+ Add stage</button>
        </div>
      );

    case 11:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What sales framework does your team use?
          </p>
          <select className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors mb-4">
            <option>MEDDPICC</option>
            <option>BANT</option>
            <option>Challenger</option>
            <option>Solution Selling</option>
            <option>Custom</option>
          </select>
          <textarea
            rows={4}
            placeholder="Additional framework details..."
            defaultValue="MEDDPICC with emphasis on Champion and Decision Process"
            className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
          />
        </div>
      );

    case 12:
      return (
        <div className="space-y-6">
          <p className="text-lg ctx leading-relaxed">
            What integrations does your team use?
          </p>
          <div className="space-y-3">
            {['Salesforce', 'HubSpot', 'Google Calendar', 'Microsoft Teams', 'Zoom'].map((integration, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-piloteer-ink">{integration}</span>
              </div>
            ))}
            <button className="btn-secondary w-full mt-4">+ Add integration</button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
