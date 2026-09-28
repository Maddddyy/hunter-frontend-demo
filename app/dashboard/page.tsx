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

  // Value-weighted book momentum (TechCorp-primary: $1.2M at +32 dominates the $2.2M book)
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const totalMomentum = Math.round(
    mockDeals.reduce((sum, deal) => sum + (deal.momentum * deal.value), 0) / totalValue
  );
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
    <DashboardNav>
      <div className="flex-1 bg-piloteer-void">

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        {/* Your Book's Momentum */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-3">Performance</div>
            <h2 className="text-4xl font-bold interp">Your Book's Momentum</h2>
          </div>
          
          <div className="card bg-gradient-to-br from-piloteer-surface to-piloteer-black border-piloteer-hair-2">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-bold mb-4">
                    <MomentumDisplay
                      score={totalMomentum}
                      direction={totalMomentum > 0 ? 'gaining' : totalMomentum < 0 ? 'losing' : 'holding'}
                      size="xl"
                    />
                  </div>
                  <p className="text-lg ctx leading-relaxed max-w-2xl">
                    Your book is <span className={`font-semibold ${totalMomentum > 0 ? 'text-piloteer-verified' : totalMomentum < 0 ? 'text-piloteer-watch' : 'text-piloteer-mute'}`}>
                      {totalMomentum > 0 ? 'gaining momentum' : totalMomentum < 0 ? 'losing momentum' : 'holding steady'}
                    </span>. 
                    TechCorp Global moved to technical validation after security review completed ahead of schedule.
                    Implementation concerns shifting from technical feasibility to organizational change management — a progression signal.
                  </p>
                </div>

                <div className="h-64 bg-piloteer-surface-2 rounded-xl border border-piloteer-hair p-6 relative overflow-hidden">
                  {/* Simple momentum sparkline visualization */}
                  <div className="absolute inset-0 p-6 flex flex-col">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">30-Day Momentum</span>
                      <span className="text-xs font-mono text-piloteer-ink">+32 Today</span>
                    </div>
                    
                    {/* Sparkline path */}
                    <svg viewBox="0 0 400 120" className="flex-1" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
                      
                      {/* Momentum path */}
                      <path 
                        d="M 0,80 L 40,75 L 80,70 L 120,68 L 160,55 L 200,50 L 240,48 L 280,42 L 320,38 L 360,32 L 400,28"
                        fill="none"
                        stroke="rgba(91,192,141,0.6)"
                        strokeWidth="2"
                      />
                      
                      {/* Gradient fill under line */}
                      <defs>
                        <linearGradient id="momentumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(91,192,141,0.3)" />
                          <stop offset="100%" stopColor="rgba(91,192,141,0.0)" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,80 L 40,75 L 80,70 L 120,68 L 160,55 L 200,50 L 240,48 L 280,42 L 320,38 L 360,32 L 400,28 L 400,120 L 0,120 Z"
                        fill="url(#momentumGradient)"
                      />
                      
                      {/* Key event markers */}
                      <circle cx="200" cy="50" r="3" fill="#5BC08D" />
                      <circle cx="320" cy="38" r="3" fill="#5BC08D" />
                    </svg>
                    
                    {/* Event annotations */}
                    <div className="flex items-center justify-between mt-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-piloteer-verified" />
                        <span className="font-mono text-piloteer-mute">Sep 13 · Security review completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-piloteer-verified" />
                        <span className="font-mono text-piloteer-mute">Sep 25 · Board timeline mentioned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-piloteer-black p-6 rounded-xl border border-piloteer-verified-line">
                  <div className="text-4xl font-bold momentum-gaining mb-2">{gainingDeals}</div>
                  <div className="text-sm font-mono uppercase tracking-wider text-piloteer-mute">Gaining</div>
                  <div className="text-xs ctx mt-2">Moving forward with clear progression</div>
                </div>
                <div className="bg-piloteer-black p-6 rounded-xl border border-piloteer-hair-2">
                  <div className="text-4xl font-bold momentum-holding mb-2">{holdingDeals}</div>
                  <div className="text-sm font-mono uppercase tracking-wider text-piloteer-mute">Holding</div>
                  <div className="text-xs ctx mt-2">Stable, awaiting next catalyst</div>
                </div>
                <div className="bg-piloteer-black p-6 rounded-xl border border-piloteer-signal-line">
                  <div className="text-4xl font-bold momentum-losing mb-2">{losingDeals}</div>
                  <div className="text-sm font-mono uppercase tracking-wider text-piloteer-mute">Losing</div>
                  <div className="text-xs ctx mt-2">Requires attention to regain movement</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Needs You */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-3">Priority Actions</div>
            <h2 className="text-4xl font-bold interp">Needs You</h2>
          </div>
          
          <div className="card border-piloteer-hair-2 bg-gradient-to-br from-piloteer-surface to-piloteer-black">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-piloteer-hair">
              <div className="eyebrow">
                Action {needsYouIndex + 1} of {needsYouItems.length}
              </div>
              {needsYouItems.length > 1 && (
                <button className="text-sm font-mono ctx hover:text-piloteer-ink transition-colors uppercase tracking-wider">
                  View all →
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 text-piloteer-ink">{currentNeedsYou.deal.company.name}</h3>
                  <MomentumDisplay
                    score={currentNeedsYou.deal.momentum}
                    direction={currentNeedsYou.deal.momentumDirection}
                    size="md"
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono ctx">${(currentNeedsYou.deal.value / 1000).toFixed(0)}K</div>
                  <div className="text-sm font-mono text-piloteer-mute mt-1">{currentNeedsYou.deal.stage}</div>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <div className="eyebrow mb-3">Why Hunter surfaced this</div>
                  <p className="text-lg font-semibold text-piloteer-ink leading-relaxed">{currentNeedsYou.reason}</p>
                </div>

                <div>
                  <div className="eyebrow mb-3">What Hunter sees</div>
                  <p className="ctx leading-relaxed">{currentNeedsYou.whatHunterSees}</p>
                </div>

                <div className="pt-6 border-t border-piloteer-hair">
                  <div className="eyebrow mb-3">Recommended action</div>
                  <p className="text-lg font-semibold text-piloteer-ink mb-6 leading-relaxed">{currentNeedsYou.recommendedAction}</p>
                  <div className="flex gap-4">
                    <Link href="/console" className="btn-primary py-3.5 px-6">
                      {currentNeedsYou.type === 'follow-through' ? 'Review Follow-Up' : 'Open Prep'}
                    </Link>
                    {needsYouIndex < needsYouItems.length - 1 && (
                      <button
                        onClick={() => setNeedsYouIndex(needsYouIndex + 1)}
                        className="btn-secondary py-3.5 px-6"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patterns Shaping Your Deals */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-3">Intelligence</div>
            <h2 className="text-4xl font-bold interp">Patterns Shaping Your Deals</h2>
          </div>
          
          <div className="inline-flex bg-piloteer-surface border border-piloteer-hair rounded-xl p-1 mb-8">
            {[
              { key: 'seller' as PatternTab, label: 'Seller' },
              { key: 'buyer' as PatternTab, label: 'Buyer' },
              { key: 'buyer-seller' as PatternTab, label: 'Buyer × Seller' },
              { key: 'market' as PatternTab, label: 'Market' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivePatternTab(tab.key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-mono uppercase tracking-wider transition-all ${
                  activePatternTab === tab.key
                    ? 'bg-piloteer-surface-3 text-piloteer-ink'
                    : 'text-piloteer-mute hover:text-piloteer-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {patternsByTab[activePatternTab].map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} showAffectedDeals />
            ))}
          </div>
        </section>

        {/* My Performance */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-3">Learning</div>
            <h2 className="text-4xl font-bold interp">My Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card border-piloteer-hair-2">
              <h3 className="text-xl font-bold mb-6">How Guidance Connects to Momentum</h3>
              <div className="flex items-center justify-between py-10 px-2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-piloteer-ink mb-2">{performanceMetrics.momentsIdentified}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Moments<br/>identified</div>
                </div>
                <div className="text-piloteer-hair-2 text-xl">→</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-piloteer-ink mb-2">{performanceMetrics.guidanceActioned}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Guidance<br/>actioned</div>
                </div>
                <div className="text-piloteer-hair-2 text-xl">→</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-piloteer-ink mb-2">{performanceMetrics.buyerResponsesChanged}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Buyer responses<br/>changed</div>
                </div>
                <div className="text-piloteer-hair-2 text-xl">→</div>
                <div className="text-center">
                  <div className="text-4xl font-bold momentum-gaining mb-2">+{performanceMetrics.momentumChanged}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Momentum<br/>increased</div>
                </div>
              </div>
              <p className="text-xs ctx text-center pt-4 border-t border-piloteer-hair">
                Shows momentum increased after guidance was actioned. Not claiming guidance caused the increase.
              </p>
            </div>

            <div className="card border-piloteer-hair-2 space-y-6">
              <div>
                <h4 className="font-bold mb-3 text-piloteer-ink">Where I'm Improving</h4>
                <p className="ctx leading-relaxed">
                  Permission-based questioning in discovery. <span className="text-xs font-mono text-piloteer-verified ml-1">[Supported]</span> Buyer sharing increased when used across 24 interactions.
                </p>
              </div>
              <div className="pt-4 border-t border-piloteer-hair">
                <h4 className="font-bold mb-3 text-piloteer-watch">My Opportunity</h4>
                <p className="ctx leading-relaxed">
                  Responding to implementation questions with deployment examples vs feature explanations.
                </p>
              </div>
              <div className="pt-4 border-t border-piloteer-hair">
                <h4 className="font-bold mb-3 text-piloteer-ink">Next Focus</h4>
                <p className="ctx leading-relaxed">
                  When buyer asks "how does this work?", share customer rollout story instead of product walkthrough.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </DashboardNav>
  );
}
