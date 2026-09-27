'use client';

import AppShell from '@/components/AppShell';
import { mockDeals, sellerPatterns, buyerPatterns, marketPatterns } from '@/lib/data/mockData';

export default function AnalyticsPage() {
  const totalDeals = mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgMomentum = mockDeals.reduce((sum, deal) => sum + deal.momentum, 0) / totalDeals;

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-piloteer-void">
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
          <div>
            <div className="eyebrow mb-3">Intelligence</div>
            <h1 className="text-4xl font-bold interp mb-4">Analytics</h1>
            <p className="text-lg ctx max-w-3xl">
              Team and organizational performance metrics with pattern analysis
            </p>
          </div>

          {/* Key Metrics */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card border-piloteer-hair-2">
                <div className="eyebrow mb-3">Active Pipeline</div>
                <div className="text-4xl font-bold text-piloteer-ink mb-2">
                  ${(totalValue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm ctx">Across {totalDeals} active deals</div>
              </div>

              <div className="card border-piloteer-hair-2">
                <div className="eyebrow mb-3">Average Momentum</div>
                <div className={`text-4xl font-bold mb-2 momentum-${avgMomentum > 0 ? 'gaining' : avgMomentum < 0 ? 'losing' : 'holding'}`}>
                  {avgMomentum > 0 ? '+' : ''}{Math.round(avgMomentum)}
                </div>
                <div className="text-sm ctx capitalize">
                  {avgMomentum > 0 ? 'Gaining' : avgMomentum < 0 ? 'Losing' : 'Holding'}
                </div>
              </div>

              <div className="card border-piloteer-hair-2">
                <div className="eyebrow mb-3">Validated Patterns</div>
                <div className="text-4xl font-bold text-piloteer-ink mb-2">
                  {[...sellerPatterns, ...buyerPatterns, ...marketPatterns].filter(p => p.evidence.level === 'validated').length}
                </div>
                <div className="text-sm ctx">High-confidence insights</div>
              </div>
            </div>
          </section>

          {/* Team Performance */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Team Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card border-piloteer-hair-2">
                <h3 className="text-xl font-bold mb-4">Momentum Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="ctx">Gaining momentum</span>
                    <span className="font-bold text-piloteer-verified">
                      {mockDeals.filter(d => d.momentumDirection === 'gaining').length} deals
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ctx">Holding steady</span>
                    <span className="font-bold text-piloteer-metal">
                      {mockDeals.filter(d => d.momentumDirection === 'holding').length} deals
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="ctx">Losing momentum</span>
                    <span className="font-bold text-piloteer-signal">
                      {mockDeals.filter(d => d.momentumDirection === 'losing').length} deals
                    </span>
                  </div>
                </div>
              </div>

              <div className="card border-piloteer-hair-2">
                <h3 className="text-xl font-bold mb-4">Pattern Adoption</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm ctx">Permission-based discovery</span>
                      <span className="text-sm font-mono text-piloteer-verified">38% adoption</span>
                    </div>
                    <div className="h-2 bg-piloteer-surface-2 rounded-full overflow-hidden">
                      <div className="h-full bg-piloteer-verified" style={{ width: '38%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm ctx">Early IT involvement</span>
                      <span className="text-sm font-mono text-piloteer-verified">45% adoption</span>
                    </div>
                    <div className="h-2 bg-piloteer-surface-2 rounded-full overflow-hidden">
                      <div className="h-full bg-piloteer-verified" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm ctx">Deployment examples vs features</span>
                      <span className="text-sm font-mono text-piloteer-watch">25% adoption</span>
                    </div>
                    <div className="h-2 bg-piloteer-surface-2 rounded-full overflow-hidden">
                      <div className="h-full bg-piloteer-watch" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trend Charts Placeholder */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Momentum Trends</h2>
            <div className="card">
              <div className="h-64 flex items-center justify-center">
                <p className="ctx text-center">
                  <span className="block text-sm font-mono uppercase tracking-wider mb-2">Visualization</span>
                  <span className="block text-xs">Momentum trends over time with pattern annotations</span>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Deal Velocity by Stage</h2>
            <div className="card">
              <div className="h-64 flex items-center justify-center">
                <p className="ctx text-center">
                  <span className="block text-sm font-mono uppercase tracking-wider mb-2">Visualization</span>
                  <span className="block text-xs">Average days in each stage with pattern impact</span>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Pattern Impact Analysis</h2>
            <div className="card">
              <div className="h-64 flex items-center justify-center">
                <p className="ctx text-center">
                  <span className="block text-sm font-mono uppercase tracking-wider mb-2">Visualization</span>
                  <span className="block text-xs">Correlation between pattern adoption and momentum change</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
