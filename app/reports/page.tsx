'use client';

import AppShell from '@/components/AppShell';
import { mockDeals } from '@/lib/data/mockData';
import EvidenceBadge from '@/components/EvidenceBadge';

export default function ReportsPage() {
  const dealsWithEvidence = mockDeals.filter(d => d.primaryPattern);

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-piloteer-void">
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
          <div>
            <div className="eyebrow mb-3">Intelligence</div>
            <h1 className="text-4xl font-bold interp mb-4">Reports</h1>
            <p className="text-lg ctx max-w-3xl">
              Deals with evidence — detailed interaction analysis and pattern documentation
            </p>
          </div>

          {/* Deals with Evidence */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Deals with Evidence</h2>
            <div className="space-y-6">
              {dealsWithEvidence.map((deal) => (
                <div key={deal.id} className="card border-piloteer-hair-2">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-piloteer-ink mb-2">
                        {deal.company.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm ctx">
                        <span>${(deal.value / 1000).toFixed(0)}K</span>
                        <span>·</span>
                        <span className="capitalize">{deal.stage.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold momentum-${deal.momentumDirection}`}>
                        {deal.momentum > 0 ? '+' : ''}{deal.momentum}
                      </div>
                      <div className="text-sm ctx capitalize">{deal.momentumDirection}</div>
                    </div>
                  </div>

                  {deal.primaryPattern && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <EvidenceBadge level={deal.primaryPattern.evidence.level} />
                        <span className="text-xs font-mono text-piloteer-mute uppercase">
                          {deal.primaryPattern.evidence.interactions} interactions
                        </span>
                      </div>

                      <div>
                        <div className="eyebrow mb-2">Pattern</div>
                        <p className="text-piloteer-ink leading-relaxed">
                          {deal.primaryPattern.pattern}
                        </p>
                      </div>

                      <div>
                        <div className="eyebrow mb-2">Meaning</div>
                        <p className="ctx leading-relaxed">
                          {deal.primaryPattern.meaning}
                        </p>
                      </div>

                      {deal.primaryPattern.evidence.details && (
                        <div>
                          <div className="eyebrow mb-2">Evidence</div>
                          <ul className="space-y-2">
                            {deal.primaryPattern.evidence.details.map((detail, idx) => (
                              <li key={idx} className="text-sm ctx leading-relaxed flex items-start gap-3">
                                <span className="text-piloteer-verified mt-1">·</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 border-t border-piloteer-hair">
                        <div className="eyebrow mb-2">Recommended Action</div>
                        <p className="text-piloteer-ink font-semibold leading-relaxed">
                          {deal.primaryPattern.recommendedAction}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Additional Report Sections */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Interaction Timeline</h2>
            <div className="card">
              <p className="ctx text-center py-12">
                Detailed interaction timeline and transcript analysis
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Pattern Evolution</h2>
            <div className="card">
              <p className="ctx text-center py-12">
                How patterns have evolved across interactions over time
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
