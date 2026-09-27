'use client';

import { useState } from 'react';
import LightDashboardLayout from '@/components/LightDashboardLayout';
import MomentumDisplay from '@/components/MomentumDisplay';
import EvidenceBadge from '@/components/EvidenceBadge';
import { mockDeals } from '@/lib/data/mockData';

type ViewMode = 'momentum' | 'stage';

export default function DealsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('momentum');

  const dealsByMomentum = {
    'needs-action': mockDeals.filter(d => d.needsAction),
    'losing': mockDeals.filter(d => d.momentumDirection === 'losing' && !d.needsAction),
    'gaining': mockDeals.filter(d => d.momentumDirection === 'gaining'),
    'holding': mockDeals.filter(d => d.momentumDirection === 'holding'),
  };

  const dealsByStage = mockDeals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = [];
    acc[deal.stage].push(deal);
    return acc;
  }, {} as Record<string, typeof mockDeals>);

  return (
    <LightDashboardLayout
      title="Deals"
      subtitle="Deal-level Momentum, patterns, history and evidence"
      actions={
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('momentum')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'momentum'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            By Momentum
          </button>
          <button
            onClick={() => setViewMode('stage')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'stage'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            By Stage
          </button>
        </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto">
        {viewMode === 'momentum' ? (
          <div className="space-y-8">
            {Object.entries(dealsByMomentum).map(([category, deals]) => {
              if (deals.length === 0) return null;
              const categoryLabels: Record<string, { title: string; color: string }> = {
                'needs-action': { title: 'Needs Action', color: 'red' },
                'losing': { title: 'Losing Momentum', color: 'red' },
                'gaining': { title: 'Gaining Momentum', color: 'emerald' },
                'holding': { title: 'Holding', color: 'gray' }
              };
              const label = categoryLabels[category];
              
              return (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{label.title}</h2>
                  <div className="grid gap-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{deal.company.name}</h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-gray-600">{deal.stage}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                ${(deal.value / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MomentumDisplay
                              score={deal.momentum}
                              direction={deal.momentumDirection}
                            />
                          </div>
                        </div>
                        
                        {deal.primaryPattern && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Primary Pattern
                            </div>
                            <p className="text-sm text-gray-900">{deal.primaryPattern.pattern}</p>
                          </div>
                        )}
                        
                        {deal.needsAction && deal.actionReason && (
                          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {deal.actionReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(dealsByStage).map(([stage, deals]) => (
              <div key={stage}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  {stage.replace('-', ' ')}
                </h2>
                <div className="grid gap-4">
                  {deals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{deal.company.name}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-semibold text-gray-900">
                              ${(deal.value / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MomentumDisplay
                            score={deal.momentum}
                            direction={deal.momentumDirection}
                          />
                        </div>
                      </div>
                      
                      {deal.primaryPattern && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Primary Pattern
                          </div>
                          <p className="text-sm text-gray-900">{deal.primaryPattern.pattern}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LightDashboardLayout>
  );
}
