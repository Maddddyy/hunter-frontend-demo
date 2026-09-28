'use client';

import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import MomentumDisplay from '@/components/MomentumDisplay';
import PatternCard from '@/components/PatternCard';
import { mockDeals, sellerPatterns, buyerPatterns, marketPatterns } from '@/lib/data/mockData';

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer' | 'market'>('seller');

  const teamMomentum = mockDeals.reduce((sum, deal) => sum + deal.momentum, 0) / mockDeals.length;
  const gainingDeals = mockDeals.filter(d => d.momentumDirection === 'gaining').length;
  const holdingDeals = mockDeals.filter(d => d.momentumDirection === 'holding').length;
  const losingDeals = mockDeals.filter(d => d.momentumDirection === 'losing').length;

  const patternsByTab = {
    seller: sellerPatterns,
    buyer: buyerPatterns,
    market: marketPatterns,
  };

  return (
    <DashboardNav>
      <div className="flex-1 bg-piloteer-void">

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <div className="text-sm text-piloteer-gray">Your Team</div>
        </div>

        {/* Team Book Momentum */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Team Book Momentum</h2>
          <div className="card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    <MomentumDisplay
                      score={Math.round(teamMomentum)}
                      direction="gaining"
                      size="lg"
                    />
                  </div>
                  <p className="text-piloteer-gray">
                    Team's collective book is gaining momentum. Enterprise deals progressing well.
                  </p>
                </div>

                <div className="h-48 bg-piloteer-black rounded-lg flex items-center justify-center border border-piloteer-surface-hover">
                  <div className="text-center text-piloteer-gray">
                    <div className="text-sm">Team momentum trend</div>
                    <div className="text-xs mt-1">(chart visualization)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-gaining">{gainingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Deals gaining</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-holding">{holdingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Deals holding</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-3xl font-bold momentum-losing">{losingDeals}</div>
                  <div className="text-sm text-piloteer-gray">Deals losing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Needs You */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Needs You</h2>
          <div className="card">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Acme Europe deal stalling</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MomentumDisplay score={-12} direction="losing" size="sm" />
                  <span className="text-sm text-piloteer-gray">· $95K · Proposal</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                  What's happening
                </div>
                <p className="text-sm">
                  EU data residency blocker unresolved for three weeks. Champion engagement declining. Rep responding to deployment questions with feature explanations instead of rollout examples.
                </p>
              </div>

              <div>
                <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                  Where to intervene
                </div>
                <p className="text-sm text-piloteer-gray">
                  Coach rep on handling implementation concerns. Escalate data residency issue to Product team for EU solution.
                </p>
              </div>

              <div className="pt-3 border-t border-piloteer-surface-hover">
                <button className="btn-primary">Review with Rep</button>
              </div>
            </div>
          </div>
        </section>

        {/* Each Seller's Book Momentum */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Each Seller's Book Momentum</h2>
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Sarah Mitchell (AE)</h3>
                  <MomentumDisplay score={18} direction="gaining" size="sm" />
                </div>
                <div className="text-right text-sm text-piloteer-gray">
                  <div>4 active deals</div>
                  <div>$473K pipeline</div>
                </div>
              </div>
              <p className="text-sm text-piloteer-gray mt-3">
                TechCorp and Globex both progressing. Strong permission-based discovery technique.
              </p>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Michael Chen (AE)</h3>
                  <MomentumDisplay score={-4} direction="holding" size="sm" />
                </div>
                <div className="text-right text-sm text-piloteer-gray">
                  <div>5 active deals</div>
                  <div>$385K pipeline</div>
                </div>
              </div>
              <p className="text-sm text-piloteer-gray mt-3">
                Acme stalling on data residency. Needs coaching on converting feature explanations to deployment stories.
              </p>
            </div>
          </div>
        </section>

        {/* Patterns Shaping the Team's Deals */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Patterns Shaping the Team's Deals</h2>
          
          <div className="flex gap-2 mb-6">
            {[
              { key: 'seller' as const, label: 'Seller' },
              { key: 'buyer' as const, label: 'Buyer' },
              { key: 'market' as const, label: 'Market' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-piloteer-surface text-white'
                    : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6">
            {patternsByTab[activeTab].map((pattern) => (
              <div key={pattern.id} className="card">
                <PatternCard pattern={pattern} showAffectedDeals />
                <div className="mt-4 pt-4 border-t border-piloteer-surface-hover">
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-2">
                    Manager action
                  </div>
                  <p className="text-sm">
                    {activeTab === 'seller'
                      ? pattern.impact === 'progression'
                        ? 'Reinforce with team; document as best practice'
                        : 'Coach affected reps; provide deployment story templates'
                      : 'Share with team in next enablement session'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Performance */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Team Performance and Hunter Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">What's Improving</h3>
              <ul className="space-y-3">
                <li className="text-sm">
                  <div className="font-medium mb-1">Permission-based discovery adoption</div>
                  <div className="text-piloteer-gray">3 of 5 reps now using consistently; buyer sharing up 2.8x on average</div>
                </li>
                <li className="text-sm">
                  <div className="font-medium mb-1">Early IT involvement</div>
                  <div className="text-piloteer-gray">Security conversations resolving 3 weeks faster</div>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Needs Attention</h3>
              <ul className="space-y-3">
                <li className="text-sm">
                  <div className="font-medium mb-1">Implementation question handling</div>
                  <div className="text-piloteer-gray">2 reps still answering with features instead of deployment examples</div>
                </li>
                <li className="text-sm">
                  <div className="font-medium mb-1">EU data residency blockers</div>
                  <div className="text-piloteer-gray">Recurring across 3 enterprise deals; needs Product escalation</div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardNav>
  );
}
