'use client';

import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import MomentumDisplay from '@/components/MomentumDisplay';
import PatternCard from '@/components/PatternCard';
import { mockDeals, marketPatterns } from '@/lib/data/mockData';

type ViewMode = 'teams' | 'sellers';

export default function CRODashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('teams');

  const orgMomentum = mockDeals.reduce((sum, deal) => sum + deal.momentum, 0) / mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const gainingDeals = mockDeals.filter(d => d.momentumDirection === 'gaining');
  const holdingDeals = mockDeals.filter(d => d.momentumDirection === 'holding');
  const losingDeals = mockDeals.filter(d => d.momentumDirection === 'losing');

  const gainingValue = gainingDeals.reduce((sum, d) => sum + d.value, 0);
  const holdingValue = holdingDeals.reduce((sum, d) => sum + d.value, 0);
  const losingValue = losingDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-piloteer-black">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">CRO Dashboard</h1>
          <div className="text-sm text-piloteer-gray">Revenue Organization</div>
        </div>

        {/* Revenue Momentum */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Revenue Momentum</h2>
          <div className="card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    <MomentumDisplay
                      score={Math.round(orgMomentum)}
                      direction="gaining"
                      size="lg"
                    />
                  </div>
                  <p className="text-piloteer-gray">
                    Organization's collective book is gaining momentum. Enterprise segment driving growth.
                  </p>
                </div>

                <div className="h-48 bg-piloteer-black rounded-lg flex items-center justify-center border border-piloteer-surface-hover">
                  <div className="text-center text-piloteer-gray">
                    <div className="text-sm">Revenue momentum trend by segment</div>
                    <div className="text-xs mt-1">(chart visualization)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-2xl font-bold momentum-gaining">{gainingDeals.length}</div>
                  <div className="text-xs text-piloteer-gray mb-1">Deals gaining</div>
                  <div className="text-lg font-semibold">${(gainingValue / 1000).toFixed(0)}K</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-2xl font-bold momentum-holding">{holdingDeals.length}</div>
                  <div className="text-xs text-piloteer-gray mb-1">Deals holding</div>
                  <div className="text-lg font-semibold">${(holdingValue / 1000).toFixed(0)}K</div>
                </div>
                <div className="bg-piloteer-black p-4 rounded-lg border border-piloteer-surface-hover">
                  <div className="text-2xl font-bold momentum-losing">{losingDeals.length}</div>
                  <div className="text-xs text-piloteer-gray mb-1">Deals losing</div>
                  <div className="text-lg font-semibold">${(losingValue / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where Revenue Is Moving */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Where Revenue Is Moving</h2>
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('teams')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'teams'
                  ? 'bg-piloteer-surface text-white'
                  : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setViewMode('sellers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'sellers'
                  ? 'bg-piloteer-surface text-white'
                  : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
              }`}
            >
              Sellers
            </button>
          </div>

          {viewMode === 'teams' ? (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Team</h3>
                    <MomentumDisplay score={22} direction="gaining" size="sm" />
                  </div>
                  <div className="text-right text-sm text-piloteer-gray">
                    <div>$858K active pipeline</div>
                    <div>9 deals</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-piloteer-surface-hover">
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    Primary driver
                  </div>
                  <p className="text-sm">
                    Permission-based discovery technique spreading across team; buyer engagement up 2.8x
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-2">Mid-Market Team</h3>
                    <MomentumDisplay score={4} direction="holding" size="sm" />
                  </div>
                  <div className="text-right text-sm text-piloteer-gray">
                    <div>$412K active pipeline</div>
                    <div>12 deals</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-piloteer-surface-hover">
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    Primary driver
                  </div>
                  <p className="text-sm">
                    Steady activity; no major pattern shifts this period
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Sarah Mitchell</h3>
                    <MomentumDisplay score={18} direction="gaining" size="sm" />
                  </div>
                  <div className="text-right text-sm text-piloteer-gray">
                    <div>Enterprise Team</div>
                    <div>$473K · 4 deals</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Michael Chen</h3>
                    <MomentumDisplay score={-4} direction="holding" size="sm" />
                  </div>
                  <div className="text-right text-sm text-piloteer-gray">
                    <div>Enterprise Team</div>
                    <div>$385K · 5 deals</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Needs You */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Needs You</h2>
          <div className="grid gap-6">
            <div className="card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">EU data residency blocking enterprise deals</h3>
                  <div className="text-sm text-piloteer-gray">Systemic issue affecting multiple teams</div>
                </div>

                <div>
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    What's happening
                  </div>
                  <p className="text-sm">
                    EU data residency concerns stalling 3 enterprise deals ($268K pipeline). Pattern emerging: technical validation completes, then data sovereignty becomes deal-breaker. Competitors offering EU-hosted solutions.
                  </p>
                </div>

                <div>
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    CRO action
                  </div>
                  <p className="text-sm text-piloteer-gray">
                    Escalate to Product and Engineering for EU deployment option. Interim: Legal to draft data processing addendum for enterprise customers.
                  </p>
                </div>

                <div className="pt-3 border-t border-piloteer-surface-hover">
                  <button className="btn-primary">Escalate to Product</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scale permission-based discovery technique</h3>
                  <div className="text-sm text-piloteer-gray">Winning pattern ready to scale</div>
                </div>

                <div>
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    What's working
                  </div>
                  <p className="text-sm">
                    Asking "What concerns do you have?" early in discovery increases buyer-specific objection sharing by 3.2x. Validated across 24 interactions. Currently used by 3 of 8 enterprise reps.
                  </p>
                </div>

                <div>
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-1">
                    CRO action
                  </div>
                  <p className="text-sm text-piloteer-gray">
                    Add to standard discovery playbook. Train remaining reps in next enablement session. Document for onboarding.
                  </p>
                </div>

                <div className="pt-3 border-t border-piloteer-surface-hover">
                  <button className="btn-primary">Add to Playbook</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patterns Shaping Revenue */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Patterns Shaping Revenue</h2>
          <div className="grid gap-6">
            {marketPatterns.map((pattern) => (
              <div key={pattern.id} className="card">
                <PatternCard pattern={pattern} showAffectedDeals />
                <div className="mt-4 pt-4 border-t border-piloteer-surface-hover">
                  <div className="text-xs text-piloteer-gray uppercase tracking-wide mb-2">
                    Organizational action
                  </div>
                  <p className="text-sm">
                    Update positioning and messaging. Train all teams to lead with performance outcomes, not AI capabilities. Position Hunter as performance layer on existing stack, not replacement.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Performance */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Revenue Performance and Hunter Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Performance Consistency</h3>
              <div className="text-3xl font-bold momentum-gaining mb-2">+24%</div>
              <p className="text-sm text-piloteer-gray">
                Variance in seller performance decreased. More reps performing at top quartile level.
              </p>
              <div className="mt-3 pt-3 border-t border-piloteer-surface-hover text-xs text-piloteer-gray">
                <EvidenceBadge level="supported" /> Based on 60-day momentum variance analysis
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Winning Pattern Adoption</h3>
              <div className="text-3xl font-bold momentum-gaining mb-2">38%</div>
              <p className="text-sm text-piloteer-gray">
                of team now using validated permission-based discovery technique
              </p>
              <div className="mt-3 pt-3 border-t border-piloteer-surface-hover text-xs text-piloteer-gray">
                <EvidenceBadge level="validated" /> Tracked across 89 discovery calls
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Deal Velocity</h3>
              <div className="text-3xl font-bold momentum-gaining mb-2">-12 days</div>
              <p className="text-sm text-piloteer-gray">
                Average time from discovery to proposal when IT invited early
              </p>
              <div className="mt-3 pt-3 border-t border-piloteer-surface-hover text-xs text-piloteer-gray">
                <EvidenceBadge level="validated" /> Compared to deals with late IT involvement
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EvidenceBadge({ level }: { level: string }) {
  return (
    <span className={`evidence-label evidence-${level}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
