'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
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
    <DashboardNav>
      <div className="flex-1 bg-piloteer-void">

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Deals</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('momentum')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'momentum'
                  ? 'bg-piloteer-surface text-white'
                  : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
              }`}
            >
              Hunter Momentum
            </button>
            <button
              onClick={() => setViewMode('stage')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'stage'
                  ? 'bg-piloteer-surface text-white'
                  : 'text-piloteer-gray hover:text-white hover:bg-piloteer-surface/50'
              }`}
            >
              CRM Stage
            </button>
          </div>
        </div>

        {viewMode === 'momentum' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MomentumColumn
              title="Needs Action"
              deals={dealsByMomentum['needs-action']}
              color="red"
            />
            <MomentumColumn
              title="Losing Momentum"
              deals={dealsByMomentum['losing']}
              color="red"
            />
            <MomentumColumn
              title="Moving"
              deals={dealsByMomentum['gaining']}
              color="green"
            />
            <MomentumColumn
              title="Commitment Ready"
              deals={dealsByMomentum['holding']}
              color="gray"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(dealsByStage).map(([stage, deals]) => (
              <StageColumn key={stage} title={stage} deals={deals} />
            ))}
          </div>
        )}
      </div>
      </div>
    </DashboardNav>
  );
}

function MomentumColumn({
  title,
  deals,
  color,
}: {
  title: string;
  deals: typeof mockDeals;
  color: 'red' | 'green' | 'gray';
}) {
  const colorClasses = {
    red: 'border-piloteer-red/30 bg-piloteer-red/5',
    green: 'border-piloteer-green/30 bg-piloteer-green/5',
    gray: 'border-piloteer-surface-hover bg-piloteer-surface/30',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-sm text-piloteer-gray">{deals.length}</span>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} colorClass={colorClasses[color]} />
        ))}
      </div>
    </div>
  );
}

function StageColumn({ title, deals }: { title: string; deals: typeof mockDeals }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold capitalize">{title.replace('-', ' ')}</h2>
        <span className="text-sm text-piloteer-gray">{deals.length}</span>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal, colorClass = '' }: { deal: typeof mockDeals[0]; colorClass?: string }) {
  return (
    <div className={`card p-4 ${colorClass} hover:border-piloteer-surface-hover transition-colors`}>
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-sm mb-1">{deal.company.name}</h3>
          <div className="text-xs text-piloteer-gray">
            ${(deal.value / 1000).toFixed(0)}K
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MomentumDisplay
            score={deal.momentum}
            direction={deal.momentumDirection}
            size="sm"
            showLabel={false}
          />
          <span className={`text-xs momentum-${deal.momentumDirection}`}>
            {deal.momentumDirection.charAt(0).toUpperCase() + deal.momentumDirection.slice(1)}
          </span>
        </div>

        {deal.primaryPattern && (
          <div className="pt-2 border-t border-piloteer-surface-hover">
            <div className="flex items-center gap-1 mb-1">
              <EvidenceBadge level={deal.primaryPattern.evidence.level} />
            </div>
            <p className="text-xs text-piloteer-gray line-clamp-2">
              {deal.primaryPattern.pattern}
            </p>
          </div>
        )}

        {deal.needsAction && (
          <div className="pt-2 border-t border-piloteer-surface-hover">
            <p className="text-xs font-medium text-piloteer-red">{deal.actionReason}</p>
          </div>
        )}

        <Link
          href={`/dashboard/deals/${deal.id}`}
          className="text-xs text-piloteer-gray hover:text-white block pt-1"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
