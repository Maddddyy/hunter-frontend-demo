'use client';

import { useState } from 'react';
import LightDashboardLayout from '@/components/LightDashboardLayout';
import { mockDeals, needsYouItems, sellerPatterns, buyerPatterns, buyerSellerPatterns, marketPatterns } from '@/lib/data/mockData';

type PatternTab = 'seller' | 'buyer' | 'buyer-seller' | 'market';

export default function SellerPerformanceDashboard() {
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

  const currentPatterns = patternsByTab[activePatternTab];
  const currentNeedsYou = needsYouItems[needsYouIndex];

  return (
    <LightDashboardLayout
      title="Performance"
      subtitle="Where are your deals moving, why, what needs you, and how you're improving"
    >
      <div className="p-8 space-y-12 max-w-7xl mx-auto">
        {/* 1. Your Book's Momentum */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Book's Momentum</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-baseline gap-4 mb-6">
              <div className="text-4xl font-bold text-emerald-600">Gaining</div>
              <div className="text-lg text-gray-500">+{Math.round(totalMomentum)}</div>
            </div>

            <div className="flex items-center gap-6 mb-6">
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

            {/* Momentum trend line (simplified) */}
            <div className="h-32 bg-gradient-to-t from-emerald-50 to-transparent rounded-lg mb-4 flex items-end">
              <div className="w-full h-20 border-l-2 border-b-2 border-gray-200 relative">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline
                    points="0,80 20,75 40,65 60,55 80,50 100,40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points="0,80 20,75 40,65 60,55 80,50 100,40"
                    fill="url(#momentum-gradient)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="momentum-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="font-semibold text-gray-900">Hunter sees:</strong> Three high-value deals advanced after you addressed buyer implementation concerns directly. TechCorp Global moved from stalled to active after you shifted from product features to their revenue operations pain.
            </p>
          </div>
        </section>

        {/* 2. Needs You */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Needs You</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                {needsYouIndex + 1} of {needsYouItems.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNeedsYouIndex(Math.max(0, needsYouIndex - 1))}
                  disabled={needsYouIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={() => setNeedsYouIndex(Math.min(needsYouItems.length - 1, needsYouIndex + 1))}
                  disabled={needsYouIndex === needsYouItems.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{currentNeedsYou.deal.company.name}</h3>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      currentNeedsYou.deal.momentum > 0 
                        ? 'bg-emerald-100 text-emerald-700'
                        : currentNeedsYou.deal.momentum < 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        currentNeedsYou.deal.momentum > 0 
                          ? 'bg-emerald-500'
                          : currentNeedsYou.deal.momentum < 0
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`} />
                      {currentNeedsYou.deal.momentum > 0 ? 'Gaining' : currentNeedsYou.deal.momentum < 0 ? 'Losing' : 'Holding'} {Math.abs(currentNeedsYou.deal.momentum)}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Why Hunter surfaced it</div>
                      <div className="text-gray-600">{currentNeedsYou.reason}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700">What Hunter sees</div>
                      <div className="text-gray-600">{currentNeedsYou.whatHunterSees}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700">What you should do</div>
                      <div className="text-gray-900 font-medium">{currentNeedsYou.recommendedAction}</div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                {currentNeedsYou.recommendedAction}
              </button>
            </div>
          </div>
        </section>

        {/* 3. Patterns Shaping Your Deals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Patterns Shaping Your Deals</h2>
            
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              {([
                ['seller', 'Seller'],
                ['buyer', 'Buyer'],
                ['buyer-seller', 'Buyer × Seller'],
                ['market', 'Market']
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActivePatternTab(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activePatternTab === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {currentPatterns.map((pattern, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className={`w-1 h-full rounded-full flex-shrink-0 ${
                      pattern.impact === 'loss' || pattern.impact === 'stall' ? 'bg-red-500' :
                      pattern.impact === 'engagement' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} 
                    style={{ minHeight: '60px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{pattern.pattern}</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">What Hunter sees</div>
                        <div className="text-gray-600">{pattern.meaning}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">Where Hunter sees it</div>
                        <div className="text-gray-600">
                          {pattern.evidence.details?.join(' • ') || `${pattern.evidence.interactions} interactions · ${pattern.evidence.level}`}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">How it's affecting Momentum</div>
                        <div className="text-gray-900">
                          Impact: {pattern.impact} · {pattern.affectedDeals} deals · ${(pattern.affectedValue || 0) / 1000}K
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-gray-700">What you should do</div>
                        <div className="text-gray-900 font-medium">{pattern.recommendedAction}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. My Performance */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">My Performance</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Flow diagram */}
            <div className="flex items-center gap-3 mb-8 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 font-medium text-blue-900">
                77 moments identified
              </div>
              <div className="text-gray-400">→</div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 font-medium text-emerald-900">
                54 guidance actioned
              </div>
              <div className="text-gray-400">→</div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 font-medium text-purple-900">
                38 buyer responses changed
              </div>
              <div className="text-gray-400">→</div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 font-medium text-emerald-900">
                Momentum +12
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Where I'm improving</h3>
                <p className="text-sm text-gray-600">
                  You're addressing buyer concerns earlier in conversations. Buyers are engaging more when you ask about constraints before presenting solutions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">My opportunity</h3>
                <p className="text-sm text-gray-600">
                  You're still pitching features when buyers show hesitation. The pattern: buyer concern rises → you explain more → engagement falls.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Next focus</h3>
                <p className="text-sm text-gray-600 font-medium">
                  When you notice a buyer pause or hedging language, ask: "What's your concern?" before adding more detail.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LightDashboardLayout>
  );
}
