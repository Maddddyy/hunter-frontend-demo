'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PiloteerLogo from './PiloteerLogo';
import { NavIcons } from './icons';

export default function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [askHunterOpen, setAskHunterOpen] = useState(false);

  const navItems = [
    { label: 'Performance', href: '/dashboard', Icon: NavIcons.Dashboard },
    { label: 'Deals', href: '/dashboard/deals', Icon: NavIcons.Reports },
    { label: 'Team', href: '/dashboard/manager', Icon: NavIcons.Console },
    { label: 'Settings', href: '/settings', Icon: NavIcons.Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Mock Q&A based on current page
  const getContextualQA = () => {
    if (pathname === '/dashboard') {
      return [
        { q: "Why is TechCorp momentum gaining?", a: "Security review completed ahead of schedule. Champion (Sarah Chen) mentioned board timeline pressure twice — external urgency creating decision momentum. Implementation concerns shifted from technical feasibility to organizational change management, indicating progression." },
        { q: "What's the pattern across my book?", a: "Permission-based questioning in discovery: Supported across 24 interactions. TechCorp surfaced security concern in first call (typically surfaces week 3). Eight of nine recent deals where used: buyer shared unscripted concern proactively." },
        { q: "How do I improve Acme Europe's momentum?", a: "Momentum losing (-12). EU data residency blocker unresolved for three weeks. Escalate to Product team for EU solution. Rep responding to deployment questions with features instead of rollout examples — coach on this pattern." }
      ];
    } else if (pathname?.startsWith('/dashboard/deals')) {
      return [
        { q: "How do I move TechCorp forward?", a: "Security sign-off confirmed. Next: board presentation. Sarah Chen's timeline pressure is the key catalyst. Get written confirmation of security approval, then schedule executive presentation within their board cycle." },
        { q: "What's stalling in my pipeline?", a: "Acme Europe: EU data residency blocker (three weeks). Midway Healthcare: timeline slipping, no new stakeholders in three weeks. Both show declining champion engagement — early signal that blocker resolution is prerequisite to momentum recovery." }
      ];
    } else if (pathname?.startsWith('/dashboard/manager')) {
      return [
        { q: "Where should I intervene first?", a: "TechCorp progressing well — security review completed. Acme stalled: EU data residency blocker needs Product escalation (recurring across 3 enterprise deals). Rep converting deployment questions to features instead of rollout stories — coach this." },
        { q: "What patterns are spreading across the team?", a: "Permission-based discovery: 3 of 5 reps now using consistently (TechCorp and Globex both progressing with this). Early IT involvement: Security conversations resolving faster. Implementation question handling: 2 reps still need coaching on deployment examples vs features." }
      ];
    }
    return [
      { q: "How does Hunter work?", a: "Hunter provides real-time guidance during customer conversations. It senses buyer and seller behavior, identifies patterns, and whispers specific moves while the outcome can still change." },
      { q: "What makes momentum different from probability?", a: "Momentum describes deal movement and direction. It's not a prediction of likelihood to close. A deal can have high momentum (gaining rapidly) but still be early stage, or low momentum (stalled) but in negotiation." }
    ];
  };

  return (
    <div className="min-h-screen flex flex-col bg-piloteer-void">
      {/* Top Nav */}
      <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-plane">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <PiloteerLogo className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
              <span className="text-xs font-mono uppercase tracking-wider text-piloteer-mute">Hunter</span>
            </Link>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive(item.href)
                        ? 'bg-piloteer-surface-3 text-piloteer-ink'
                        : 'text-piloteer-metal hover:text-piloteer-ink hover:bg-piloteer-surface-2'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ask Hunter - always accessible */}
          <button 
            onClick={() => setAskHunterOpen(!askHunterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-piloteer-surface-2 hover:bg-piloteer-surface-3 border border-piloteer-hair rounded-lg text-sm font-semibold text-piloteer-ink transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Ask Hunter</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        {children}

        {/* Ask Hunter Drawer */}
        {askHunterOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setAskHunterOpen(false)}
            />
            
            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[480px] bg-gradient-to-b from-piloteer-surface to-piloteer-black border-l border-piloteer-hair-2 z-50 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-piloteer-hair">
                  <div>
                    <h2 className="text-lg font-bold font-disp text-piloteer-ink">Ask Hunter</h2>
                    <p className="text-xs font-mono text-piloteer-mute">Contextual intelligence about {pathname === '/dashboard' ? 'Performance' : pathname?.includes('/deals') ? 'Deals' : pathname?.includes('/manager') ? 'Team' : 'this view'}</p>
                  </div>
                  <button 
                    onClick={() => setAskHunterOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-piloteer-surface-3 flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {getContextualQA().map((qa, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-piloteer-surface-3 flex items-center justify-center flex-none">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M9 9h.01M15 9h.01M8 13c.5 1 1.5 2 4 2s3.5-1 4-2"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-piloteer-ink leading-relaxed mb-2">{qa.q}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-piloteer-verified-soft border border-piloteer-verified-line flex items-center justify-center flex-none">
                            <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
                              <path d="M20 3 L34 11 V25 L20 33 L20 20 L8 13 Z" fill="#2C2C36"/>
                              <path d="M8 13 L20 20 V33 L6 25 V13 Z" fill="#5BC08D"/>
                              <path d="M20 20 L34 11 L34 25 L20 33 Z" fill="#33333d"/>
                            </svg>
                          </div>
                          <div className="flex-1 bg-piloteer-surface-2 border border-piloteer-hair rounded-xl p-4">
                            <p className="text-sm text-piloteer-metal leading-relaxed">{qa.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-piloteer-hair p-4 bg-piloteer-black/40">
                  <div className="flex items-center gap-2 bg-piloteer-surface-2 border border-piloteer-hair rounded-xl px-4 py-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-piloteer-mute">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <input 
                      type="text"
                      placeholder="Ask about patterns, momentum, or next moves..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-piloteer-ink placeholder:text-piloteer-mute"
                    />
                  </div>
                  <p className="text-xs text-piloteer-mute mt-2 px-1">Hunter understands the context of what you're viewing</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
