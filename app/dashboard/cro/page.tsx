'use client';

import { useState } from 'react';
import LightDashboardLayout from '@/components/LightDashboardLayout';
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
    <LightDashboardLayout
      title="CRO Dashboard"
      subtitle="Revenue Momentum, organizational patterns, and system performance"
      actions={
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('teams')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'teams'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setViewMode('sellers')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'sellers'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sellers
          </button>
        </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Revenue Momentum */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Momentum</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    Gaining +{Math.round(orgMomentum)}
                  </div>
                  <p className="text-gray-600">
                    Organization's collective book is gaining momentum. Enterprise segment driving growth.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-gray-700">Gaining</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(gainingValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-500">{gainingDeals.length} deals</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Holding</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(holdingValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-500">{holdingDeals.length} deals</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-gray-700">Losing</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(losingValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-500">{losingDeals.length} deals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where Revenue Is Moving */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Where Revenue Is Moving ({viewMode === 'teams' ? 'by Team' : 'by Seller'})
          </h2>
          <div className="grid gap-4">
            {viewMode === 'teams' ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Enterprise Team</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">5 deals</span>
                        <span className="text-sm text-gray-600">$1.2M</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Gaining +18
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Strong momentum across large deals; early objection-surfacing pattern spreading
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Commercial Team</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">8 deals</span>
                        <span className="text-sm text-gray-600">$780K</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Holding +3
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Needs coaching on implementation objection handling
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">John Doe</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Enterprise Team</span>
                        <span className="text-sm text-gray-600">3 deals · $450K</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Gaining +15
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Jane Smith</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Commercial Team</span>
                        <span className="text-sm text-gray-600">2 deals · $320K</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Gaining +8
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Needs You */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Needs You</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Scale the early-objection pattern to Commercial team
            </h3>
            <div className="space-y-3 text-sm mb-4">
              <div>
                <div className="font-medium text-gray-700">What Hunter sees</div>
                <div className="text-gray-600">
                  Enterprise reps using "What concerns do you have?" early in discovery see 3.2x more buyer objection sharing. Commercial team not using it yet.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Revenue impact</div>
                <div className="text-gray-900">
                  Could unlock $200K+ in stalled Commercial deals
                </div>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
              Create team training
            </button>
          </div>
        </section>

        {/* Market Patterns */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Patterns Shaping Revenue</h2>
          <div className="space-y-4">
            {marketPatterns.slice(0, 3).map((pattern, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{pattern.pattern}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Affected: </span>
                    <span className="text-gray-900">
                      {pattern.affectedDeals} deals · ${(pattern.affectedValue || 0) / 1000}K
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">What to do: </span>
                    <span className="text-gray-900 font-medium">{pattern.recommendedAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LightDashboardLayout>
  );
}
