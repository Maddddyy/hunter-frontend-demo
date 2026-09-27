'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import MomentumDisplay from '@/components/MomentumDisplay';
import PatternCard from '@/components/PatternCard';
import {
  mockDeals,
  needsYouItems,
  sellerPatterns,
  buyerPatterns,
  buyerSellerPatterns,
  marketPatterns,
  performanceMetrics,
} from '@/lib/data/mockData';

type PatternTab = 'seller' | 'buyer' | 'buyer-seller' | 'market';

export default function SellerDashboard() {
  const [activePatternTab, setActivePatternTab] = useState<PatternTab>('seller');
  const [needsYouIndex, setNeedsYouIndex] = useState(0);

  const totalMomentum = mockDeals.reduce((sum, deal) => sum + deal.momentum, 0) / mockDeals.length;
  const gainingDeals = mockDeals.filter(d => d.momentumDirection === 'gaining').length;
  const holdingDeals = mockDeals.filter(d => d.momentumDirection === 'holding').length;
  const losingDeals = mockDeals.filter(d => d.momentumDirection === 'losing').length;

  const patternsByTab = {
    seller: sellerPatterns,
    buyer: buyerPatterns,
    'buyer-seller': buyerSellerPatterns,
    market: marketPatterns,
  };

  const currentNeedsYou = needsYouItems[needsYouIndex];

  return (
    <div className="min-h-screen bg-piloteer-black">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Your Book's Momentum */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Book's Momentum</h2>
          <div className="card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    <MomentumDisplay
                      score={Math.round(totalMomentum)}
                      direction="gaining"
                      size="lg"
                    />
                  </div>
                  <p className="text-piloteer-gray">
                    Your book is gaining momentum. TechCorp and Globex both progressing.
                  </p>
                </div>

                {/* Simple momentum chart placeholder */}
                <div className="h-48 bg-piloteer-black rounded-lg flex items-center justify-center border border-piloteer-surface-hover">
                  <div className="text-center text-piloteer-gray">
                    <div className="text-sm">Momentum trend over time</div>
                    <div className="text-xs mt-1">(chart visualization)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-gaining">{gainingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Gaining</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-holding">{holdingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Holding</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-losing">{losingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Losing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Needs You */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Needs You</h2>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-piloteer-gray">
                {needsYouIndex + 1} of {needsYouItems.length}
              </div>
              {needsYouItems.length > 1 && (
                <button className="text-sm text-piloteer-gray hover:text-white">
                  View all
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{currentNeedsYou.deal.company.name}</h3>
                  <MomentumDisplay
                    score={currentNeedsYou.deal.momentum}
                    direction={currentNeedsYou.deal.momentumDirection}
                    size="sm"
                  />
                </div>
                <div className="text-sm text-piloteer-gray">
                  ${(currentNeedsYou.deal.value / 1000).toFixed(0)}K · {currentNeedsYou.deal.stage}
                </div>
              </div>

              <div>
                <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                  Why Hunter surfaced this
                </div>
                <p className="text-sm">{currentNeedsYou.reason}</p>
              </div>

              <div>
                <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                  What Hunter sees
                </div>
                <p className="text-sm text-piloteer-gray">{currentNeedsYou.whatHunterSees}</p>
              </div>

              <div className="pt-3 border-t border-piloteer-surface-hover">
                <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-2">
                  Recommended action
                </div>
                <p className="text-sm font-medium mb-4">{currentNeedsYou.recommendedAction}</p>
                <div className="flex gap-3">
                  <Link href="/console" className="btn-primary">
                    {currentNeedsYou.type === 'follow-through' ? 'Review Follow-Up' : 'Open Prep'}
                  </Link>
                  {needsYouIndex < needsYouItems.length - 1 && (
                    <button
                      onClick={() => setNeedsYouIndex(needsYouIndex + 1)}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patterns Shaping Your Deals */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Patterns Shaping Your Deals</h2>
          
          <div className="flex gap-2 mb-6">
            {[
              { key: 'seller' as PatternTab, label: 'Seller' },
              { key: 'buyer' as PatternTab, label: 'Buyer' },
              { key: 'buyer-seller' as PatternTab, label: 'Buyer × Seller' },
              { key: 'market' as PatternTab, label: 'Market' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivePatternTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePatternTab === tab.key
                    ? 'bg-piloteer-surface text-white'
                    : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6">
            {patternsByTab[activePatternTab].map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} showAffectedDeals />
            ))}
          </div>
        </section>

        {/* My Performance */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">My Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">How Guidance Connects to Momentum</h3>
              <div className="flex items-center justify-between py-8 px-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceMetrics.momentsIdentified}</div>
                  <div className="text-xs text-piloteer-gray mt-1">Moments<br/>identified</div>
                </div>
                <div className="text-piloteer-gray">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceMetrics.guidanceActioned}</div>
                  <div className="text-xs text-piloteer-gray mt-1">Guidance<br/>actioned</div>
                </div>
                <div className="text-piloteer-gray">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{performanceMetrics.buyerResponsesChanged}</div>
                  <div className="text-xs text-piloteer-gray mt-1">Buyer responses<br/>changed</div>
                </div>
                <div className="text-piloteer-gray">→</div>
                <div className="text-center">
                  <div className="text-3xl font-bold momentum-gaining">{performanceMetrics.momentumChanged}</div>
                  <div className="text-xs text-piloteer-gray mt-1">Momentum<br/>increased</div>
                </div>
              </div>
            </div>

            <div className="card space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Where I'm Improving</h4>
                <p className="text-sm text-piloteer-gray">
                  Permission-based questioning in discovery. Buyer sharing increased 3.2x when used.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">My Opportunity</h4>
                <p className="text-sm text-piloteer-gray">
                  Responding to implementation questions with deployment examples vs feature explanations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm">Next Focus</h4>
                <p className="text-sm text-piloteer-gray">
                  When buyer asks "how does this work?", share customer rollout story instead of product walkthrough.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
