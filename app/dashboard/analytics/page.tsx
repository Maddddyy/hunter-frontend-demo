'use client';

import { useState } from 'react';
import LightDashboardLayout from '@/components/LightDashboardLayout';
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
    <LightDashboardLayout
      title="Company sales analytics"
      subtitle="Integrated performance, revenue movement, and forecast across the sales organization"
    >
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Team Book Momentum */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Team Book Momentum</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    Gaining +{Math.round(teamMomentum)}
                  </div>
                  <p className="text-gray-600">
                    Team's collective book is gaining momentum. Enterprise deals progressing well.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-700">{gainingDeals} gaining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-700">{holdingDeals} holding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-700">{losingDeals} losing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Needs You */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Needs You</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">TechCorp - Seller needs deal support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Security discussion stalling; your experience with similar objections could help close.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Review deal & coach
              </button>
            </div>
          </div>
        </section>

        {/* Each Seller's Book Momentum */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Each Seller's Book Momentum</h2>
          <div className="grid gap-4">
            {[
              { name: 'John Doe', momentum: 15, deals: 3, value: 450000 },
              { name: 'Jane Smith', momentum: 8, deals: 2, value: 320000 }
            ].map((seller) => (
              <div key={seller.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{seller.deals} deals</span>
                      <span className="text-sm text-gray-600">${(seller.value / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Gaining +{seller.momentum}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Patterns */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Patterns Shaping the Team's Deals</h2>
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              {(['seller', 'buyer', 'market'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {patternsByTab[activeTab].slice(0, 2).map((pattern, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{pattern.pattern}</h3>
                <p className="text-sm text-gray-600 mb-3">{pattern.meaning}</p>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">What to reinforce: </span>
                  <span className="text-gray-900">{pattern.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </LightDashboardLayout>
  );
}
