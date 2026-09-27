'use client';

import { useState } from 'react';
import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';
import { teachSteps } from '@/lib/data/mockData';

export default function TeachPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = teachSteps.length;
  const step = teachSteps[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-piloteer-void">
      <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-plane to-piloteer-void backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/">
            <PiloteerLogo className="h-7 opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="text-sm font-mono ctx uppercase tracking-wider">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-10">
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="h-2 bg-piloteer-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-piloteer-ink transition-all duration-500"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            <div className="text-xs font-mono ctx text-center uppercase tracking-wider">
              {teachSteps.filter(s => s.completed).length} of {totalSteps} completed
            </div>
          </div>

          {/* Step content */}
          <div className="card border-piloteer-hair-2 min-h-[480px] flex flex-col">
            <div className="mb-8">
              <div className="eyebrow mb-3">Teach Hunter</div>
              <h2 className="text-3xl font-bold interp">{step.title}</h2>
            </div>

            <div className="flex-1 space-y-8">
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
              
              {currentStep === totalSteps - 1 ? (
                <Link href="/console" className="btn-primary py-3.5 px-6">
                  Complete & Open Console →
                </Link>
              ) : (
                <button onClick={handleNext} className="btn-primary py-3.5 px-6">
                  Continue →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Help Hunter understand what you're selling.
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium mb-2 block">Product name</span>
              <input
                type="text"
                defaultValue="Hunter"
                className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium mb-2 block">What does Hunter do?</span>
              <textarea
                rows={4}
                defaultValue="Real-time sales performance system that provides private guidance during live customer interactions. Helps every seller perform like your best sellers by whispering the next best move while the outcome can still change."
                className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </label>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Who are the key personas who buy Hunter?
          </p>
          <div className="space-y-3">
            {['CRO', 'VP Revenue Operations', 'VP Sales Enablement', 'Sales Managers'].map((persona, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-piloteer-surface p-3 rounded-md">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>{persona}</span>
              </div>
            ))}
            <button className="btn-secondary w-full">+ Add persona</button>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            What signals tell you a buyer might need Hunter?
          </p>
          <div className="space-y-3">
            {[
              'Mentions of AI tool fatigue',
              'Concern about rep performance consistency',
              'Interest in real-time coaching vs post-call review',
            ].map((signal, idx) => (
              <div key={idx} className="bg-piloteer-surface p-3 rounded-md">
                {signal}
              </div>
            ))}
            <button className="btn-secondary w-full">+ Add signal</button>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            What are your key sales objectives when selling Hunter?
          </p>
          <div className="space-y-3">
            {[
              'Improve deal momentum across the team',
              'Scale best-seller behaviors',
              'Reduce time to productivity for new reps',
            ].map((obj, idx) => (
              <div key={idx} className="bg-piloteer-surface p-3 rounded-md">
                {obj}
              </div>
            ))}
            <button className="btn-secondary w-full">+ Add objective</button>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            What makes Hunter different from alternatives?
          </p>
          <div className="space-y-3">
            {[
              'Real-time guidance during calls (not post-call analysis)',
              'Private seller tips (not surveillance)',
              'Behavioral science foundation',
            ].map((diff, idx) => (
              <div key={idx} className="bg-piloteer-surface p-3 rounded-md">
                {diff}
              </div>
            ))}
            <button className="btn-secondary w-full">+ Add differentiator</button>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Common objections and how to counter them
          </p>
          <div className="space-y-4">
            <div className="card bg-piloteer-black">
              <div className="text-sm font-medium mb-2">Objection</div>
              <div className="text-sm text-piloteer-gray mb-3">
                "How is this different from Gong/Chorus?"
              </div>
              <div className="text-sm font-medium mb-2">Counter</div>
              <div className="text-sm text-piloteer-gray">
                "Gong records and analyzes after. Hunter guides during. Complementary, not competitive."
              </div>
            </div>
            <button className="btn-secondary w-full">+ Add objection</button>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Who does Hunter compete with?
          </p>
          <div className="flex flex-wrap gap-2">
            {['Gong', 'Chorus', 'Salesforce Einstein', 'Clari'].map((comp, idx) => (
              <div key={idx} className="bg-piloteer-surface px-4 py-2 rounded-md text-sm">
                {comp}
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full">+ Add competitor</button>
        </div>
      );

    case 8:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Market intelligence and trends
          </p>
          <textarea
            rows={6}
            placeholder="What's happening in your market? What are buyers talking about?"
            className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2"
          />
        </div>
      );

    case 9:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            Tell Hunter about your company
          </p>
          <label className="block">
            <span className="text-sm font-medium mb-2 block">Company overview</span>
            <textarea
              rows={4}
              defaultValue="Piloteer builds sales performance systems. We sell Hunter to revenue leaders who want their teams to perform like their best sellers."
              className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2"
            />
          </label>
        </div>
      );

    case 10:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            What are your deal stages?
          </p>
          <div className="space-y-2">
            {['Discovery', 'Technical Validation', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, idx) => (
              <div key={idx} className="bg-piloteer-surface p-3 rounded-md flex items-center justify-between">
                <span>{stage}</span>
                <button className="text-piloteer-gray hover:text-white text-sm">Edit</button>
              </div>
            ))}
          </div>
        </div>
      );

    case 11:
      return (
        <div className="space-y-4">
          <p className="text-piloteer-gray">
            What sales framework does your team use?
          </p>
          <select className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2">
            <option>MEDDPICC</option>
            <option>BANT</option>
            <option>Challenger</option>
            <option>Solution Selling</option>
            <option>Custom</option>
          </select>
          <textarea
            rows={3}
            placeholder="Additional framework details..."
            defaultValue="MEDDPICC with emphasis on Champion and Decision Process"
            className="w-full bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-2"
          />
        </div>
      );

    default:
      return null;
  }
}
