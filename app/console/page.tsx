'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, PlusIcon, MoreIcon } from '@/components/icons';
import EvidenceBadge from '@/components/EvidenceBadge';
import MomentumDisplay from '@/components/MomentumDisplay';
import { upcomingInteraction } from '@/lib/data/mockData';

const EMBLEM = (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <path d="M20 3 L34 11 V25 L20 33 L20 20 L8 13 Z" fill="#2C2C36" stroke="#4a4a55"/>
    <path d="M8 13 L20 20 V33 L6 25 V13 Z" fill="#B7BABD"/>
    <path d="M20 20 L34 11 L34 25 L20 33 Z" fill="#33333d"/>
  </svg>
);

type ConsoleMode = 'home' | 'prep' | 'review';

const LIVE_TIPS = [
  {
    pattern: 'Sarah mentioned "board timeline" twice in 90 seconds',
    meaning: 'External urgency creating decision pressure',
    move: 'Ask: "What does the board need to see to feel confident moving forward?"',
    cat: 'Authority',
    type: 'MOVE',
    accent: '#E8A33D',
  },
  {
    pattern: 'David shifted from asking compliance questions to implementation timeline',
    meaning: 'Security concerns resolved; focus moved to deployment',
    move: 'Acknowledge shift: "Sounds like security is good. What timeline works for rollout?"',
    cat: 'Progression',
    type: 'MOVE',
    accent: '#5BC08D',
  },
  {
    pattern: 'Sarah paused before answering adoption question',
    meaning: 'Unspoken concern about team adoption',
    move: 'Permission-based: "What concerns do you have about the team adopting this?"',
    cat: 'Trust',
    type: 'MOVE',
    accent: '#FF5C5C',
  },
];

export default function ConsolePage() {
  const [mode, setMode] = useState<ConsoleMode>('home');
  const [sensing, setSensing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [tipIdx, setTipIdx] = useState(-1);

  useEffect(() => {
    if (!sensing) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    // Simulate tips appearing
    setTimeout(() => setTipIdx(0), 2200);
    setTimeout(() => setTipIdx(1), 6000);
    setTimeout(() => setTipIdx(2), 10000);
    return () => clearInterval(timer);
  }, [sensing]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-piloteer-void via-piloteer-black-alt to-piloteer-plane">
      {/* Calm workspace background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(120% 90% at 60% 40%, #000, transparent 90%)'
      }} />

      {/* Faint call mock when sensing */}
      {sensing && (
        <div className="absolute left-20 top-32 w-[52vw] max-w-[720px] opacity-20 transition-opacity duration-600 animate-in fade-in">
          <div className="grid grid-cols-2 gap-1 bg-piloteer-black p-1 rounded-2xl border border-piloteer-hair">
            {[
              { initials: 'SC', name: 'Sarah Chen', bg: '#3a5a7a' },
              { initials: 'DK', name: 'David Kim', bg: '#2f6e63' },
              { initials: 'JP', name: 'James Park', bg: '#6b4e8c' },
              { initials: 'ED', name: 'Emma Dixon', bg: '#3B5578' }
            ].map((person, i) => (
              <div key={i} className="aspect-video bg-gradient-to-br from-piloteer-surface-2 to-piloteer-surface rounded-xl flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: person.bg }}>
                  {person.initials}
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-piloteer-metal">{person.name}</div>
              </div>
            ))}
          </div>
          <div className="h-9 bg-piloteer-black flex items-center justify-center gap-3 mt-1 rounded-b-2xl">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-piloteer-surface-2" />
            ))}
            <div className="w-6 h-6 rounded-full bg-red-900/40" />
          </div>
        </div>
      )}

      {/* Console Menu Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 z-40 bg-piloteer-black/80 backdrop-blur-xl border-b border-piloteer-hair flex items-center px-4 gap-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-4 h-4">{EMBLEM}</div>
          <span className="text-xs font-bold font-disp text-piloteer-ink">Piloteer</span>
        </Link>
        <div className="flex-1 flex items-center gap-4 text-xs font-medium text-piloteer-metal">
          <button className="hover:text-piloteer-ink transition-colors">File</button>
          <button className="hover:text-piloteer-ink transition-colors">Session</button>
          <button className="hover:text-piloteer-ink transition-colors">View</button>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-2 py-1 bg-piloteer-surface-2 hover:bg-piloteer-surface-3 border border-piloteer-hair rounded-md text-xs font-semibold text-piloteer-ink transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Dashboards</span>
          </Link>
          <span className="text-xs font-mono text-piloteer-mute">9:41</span>
        </div>
      </div>

      {/* Floating Console Panel */}
      <div className="fixed top-14 right-4 w-[400px] z-40 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-gradient-to-b from-piloteer-surface to-piloteer-black border border-piloteer-hair-2 rounded-2xl shadow-2xl overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-piloteer-hair">
            <div className="w-5 h-5">{EMBLEM}</div>
            <div className="flex-1">
              <div className="text-sm font-bold font-disp text-piloteer-ink">
                {sensing ? 'Live Guidance' : mode === 'prep' ? upcomingInteraction.company.name : 'Hunter'}
              </div>
              <div className="text-xs font-mono text-piloteer-mute">
                {sensing ? 'Sensing buyer & seller' : mode === 'prep' ? upcomingInteraction.callType : 'Prepare My Day'}
              </div>
            </div>
            {sensing && (
              <div className="flex items-center gap-2 bg-piloteer-signal-soft border border-piloteer-signal-line rounded-full px-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-piloteer-signal animate-pulse" />
                <span className="text-xs font-mono text-piloteer-signal">{formatTime(elapsed)}</span>
              </div>
            )}
          </div>

          {/* Panel Body */}
          <div className="px-4 py-4 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {sensing ? (
              <>
                {tipIdx < 0 ? (
                  <div className="py-10 text-center text-piloteer-mute">
                    Hunter is sensing…
                    <div className="flex justify-center gap-1 mt-3">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-piloteer-mute animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border border-piloteer-hair-2 rounded-xl bg-piloteer-surface-2 p-4 relative overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: LIVE_TIPS[tipIdx].accent }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono font-medium" style={{ color: LIVE_TIPS[tipIdx].accent }}>
                          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: LIVE_TIPS[tipIdx].accent }} />
                          {LIVE_TIPS[tipIdx].cat}
                        </span>
                        <span className="ml-auto text-xs font-mono font-semibold tracking-wider" style={{ color: LIVE_TIPS[tipIdx].accent }}>
                          {LIVE_TIPS[tipIdx].type}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-3">
                        <div>
                          <div className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute mb-1">Pattern</div>
                          <p className="text-sm text-piloteer-ink leading-relaxed">{LIVE_TIPS[tipIdx].pattern}</p>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute mb-1">Meaning</div>
                          <p className="text-sm text-piloteer-metal leading-relaxed">{LIVE_TIPS[tipIdx].meaning}</p>
                        </div>
                        <div className="pt-2 border-t border-piloteer-hair">
                          <div className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute mb-1">Move</div>
                          <p className="text-base font-bold font-disp text-piloteer-ink leading-tight">{LIVE_TIPS[tipIdx].move}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs font-mono text-piloteer-mute">just now</div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-piloteer-hair">
                        <button className="btn-ghost text-xs px-3 py-1.5 flex-1">Acted</button>
                        <button className="btn-ghost text-xs px-3 py-1.5 flex-1">Dismiss</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-piloteer-hair text-xs font-mono text-piloteer-mute">
                      <button 
                        disabled={tipIdx <= 0}
                        className="disabled:opacity-30"
                      >
                        ← Older
                      </button>
                      <span>{tipIdx + 1} / {LIVE_TIPS.length}</span>
                      <button 
                        disabled={tipIdx >= LIVE_TIPS.length - 1}
                        className="disabled:opacity-30"
                      >
                        Newer →
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : mode === 'prep' ? (
              <PrepView 
                interaction={upcomingInteraction} 
                onBack={() => setMode('home')}
                onStartSensing={() => setSensing(true)}
              />
            ) : mode === 'review' ? (
              <ReviewView onBack={() => { setMode('home'); setSensing(false); }} />
            ) : (
              <HomeView onOpenPrep={() => setMode('prep')} />
            )}
          </div>

          {/* Panel Toolbar */}
          {!sensing && (
            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-piloteer-hair bg-piloteer-black/40">
              <div className="flex-1 flex items-center gap-2 bg-piloteer-surface-2 border border-piloteer-hair rounded-lg px-3 py-2">
                <SearchIcon />
                <input 
                  placeholder="Search deal or contact…" 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-piloteer-ink placeholder:text-piloteer-mute"
                />
              </div>
              <button className="w-8 h-8 rounded-lg bg-piloteer-surface-2 border border-piloteer-hair flex items-center justify-center hover:bg-piloteer-surface-3 transition-colors">
                <PlusIcon />
              </button>
              <button className="w-8 h-8 rounded-lg bg-piloteer-surface-2 border border-piloteer-hair flex items-center justify-center hover:bg-piloteer-surface-3 transition-colors">
                <MoreIcon />
              </button>
            </div>
          )}

          {/* Sensing Controls */}
          {sensing && (
            <div className="flex items-center gap-3 px-3 py-2.5 border-t border-piloteer-hair bg-piloteer-black/40">
              <button 
                onClick={() => { setSensing(false); setMode('review'); setElapsed(0); setTipIdx(-1); }}
                className="btn-secondary text-xs px-4 py-2"
              >
                End Call
              </button>
              <div className="flex-1 text-xs font-mono text-piloteer-mute text-right">
                Cooldown active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      {!sensing && (
        <div className="fixed bottom-8 right-8 text-xs font-mono text-piloteer-mute/40 tracking-wider uppercase">
          Piloteer runs beside whatever you're selling in
        </div>
      )}
    </div>
  );
}

function HomeView({ onOpenPrep }: { onOpenPrep: () => void }) {
  return (
    <>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-base font-bold font-disp text-piloteer-ink">Today</h3>
        <span className="text-xs font-mono text-piloteer-mute">Mon · 3 interactions</span>
      </div>
      <div className="space-y-2">
        <button 
          onClick={onOpenPrep}
          className="w-full text-left border border-piloteer-hair-2 bg-piloteer-surface-2 hover:bg-piloteer-surface-3 hover:border-piloteer-hair rounded-xl p-3 transition-all relative group"
        >
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-piloteer-verified" />
          <div className="flex items-center gap-2 text-xs font-mono text-piloteer-mute mb-1">
            <span>11:00</span>
            <span className="px-2 py-0.5 bg-piloteer-verified-soft text-piloteer-verified border border-piloteer-verified-line rounded-full text-[10px] uppercase tracking-wider">
              Ready
            </span>
          </div>
          <h4 className="font-semibold text-sm text-piloteer-ink mb-1">TechCorp Global</h4>
          <p className="text-xs text-piloteer-metal leading-relaxed">Technical validation · Prep complete</p>
          <div className="text-xs font-mono text-piloteer-mute group-hover:text-piloteer-ink transition-colors mt-2">
            Open Prep →
          </div>
        </button>

        <div className="border border-piloteer-hair bg-piloteer-surface-2 rounded-xl p-3 opacity-60">
          <div className="flex items-center gap-2 text-xs font-mono text-piloteer-mute mb-1">
            <span>14:00</span>
            <span className="px-2 py-0.5 bg-piloteer-signal-soft text-piloteer-signal border border-piloteer-signal-line rounded-full text-[10px] uppercase tracking-wider">
              Needs Prep
            </span>
          </div>
          <h4 className="font-semibold text-sm text-piloteer-ink mb-1">TechCorp Global</h4>
          <p className="text-xs text-piloteer-metal">Follow-up · Security review completed</p>
        </div>
      </div>
    </>
  );
}

function PrepView({ interaction, onBack, onStartSensing }: any) {
  const hunterRead = interaction.hunterRead!;

  return (
    <>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono text-piloteer-mute hover:text-piloteer-ink mb-4 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Prepare My Day
      </button>

      <div className="bg-piloteer-verified-soft border border-piloteer-verified-line rounded-xl p-3 mb-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-piloteer-verified mb-1">Objective</div>
        <p className="text-sm font-semibold text-piloteer-ink leading-relaxed">{interaction.goal}</p>
      </div>

      <div className="border border-piloteer-hair rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-3 py-2 bg-piloteer-surface-2 border-b border-piloteer-hair">
          <h4 className="text-sm font-bold font-disp text-piloteer-ink">Hunter knows</h4>
          <span className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute">Confirm</span>
        </div>
        <div className="px-3 py-2 space-y-2">
          <div className="flex gap-2 py-2 border-b border-piloteer-hair text-xs">
            <span className="w-20 flex-none text-[9px] font-mono uppercase text-piloteer-mute">Current</span>
            <div className="flex-1">
              <MomentumDisplay score={hunterRead.currentMomentum} direction={hunterRead.momentumDirection} size="sm" />
            </div>
          </div>
          <div className="flex gap-2 py-2 border-b border-piloteer-hair text-xs">
            <span className="w-20 flex-none text-[9px] font-mono uppercase text-piloteer-mute">Changed</span>
            <span className="flex-1 text-piloteer-ink">{hunterRead.whatChanged}</span>
          </div>
          <div className="flex gap-2 py-2 text-xs">
            <span className="w-20 flex-none text-[9px] font-mono uppercase text-piloteer-mute">Unresolved</span>
            <div className="flex-1 space-y-1">
              {hunterRead.unresolved.map((item: string, idx: number) => (
                <div key={idx} className="text-piloteer-ink">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-piloteer-hair rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-3 py-2 bg-piloteer-surface-2 border-b border-piloteer-hair">
          <h4 className="text-sm font-bold font-disp text-piloteer-ink">Hunter recommends</h4>
        </div>
        <div className="px-3 py-2 space-y-2">
          <div className="flex gap-2 py-2 text-xs">
            <span className="w-20 flex-none text-[9px] font-mono uppercase text-piloteer-mute">Move</span>
            <span className="flex-1 text-piloteer-ink font-semibold">Get security sign-off confirmed in writing before presenting to board</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-ghost text-xs flex-1" onClick={onBack}>Save prep</button>
        <button 
          onClick={onStartSensing}
          className="btn-secondary text-xs flex-1 bg-piloteer-signal hover:bg-piloteer-signal/90 border-piloteer-signal text-white"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5" />
          Start Sensing
        </button>
      </div>
    </>
  );
}

function ReviewView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono text-piloteer-mute hover:text-piloteer-ink mb-4 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Close
      </button>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-piloteer-verified-soft text-piloteer-verified border border-piloteer-verified-line rounded-full text-[10px] font-mono uppercase tracking-wider">
          Advanced
        </span>
        <span className="text-xs font-mono text-piloteer-mute">Hunter drafted your follow-through</span>
      </div>

      <div className="space-y-3">
        <div className="border border-piloteer-hair rounded-xl p-3 bg-piloteer-surface-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute">Follow-up email</span>
            <span className="text-[9px] font-mono text-piloteer-verified">✓ Approved</span>
          </div>
          <p className="text-xs text-piloteer-metal">Confirms Tuesday's board presentation and provides security sign-off documentation they requested.</p>
        </div>

        <div className="border border-piloteer-hair rounded-xl p-3 bg-piloteer-surface-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-piloteer-mute">CRM update</span>
            <span className="text-[9px] font-mono text-piloteer-verified">✓ Approved</span>
          </div>
          <p className="text-xs text-piloteer-metal">Advances stage to executive presentation; logs confirmed security resolution and board timeline pressure.</p>
        </div>
      </div>

      <button onClick={onBack} className="btn-primary w-full mt-4 text-sm">
        Close review
      </button>
    </>
  );
}
