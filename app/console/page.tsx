'use client';

import { useState } from 'react';
import Link from 'next/link';
import PiloteerLogo from '@/components/PiloteerLogo';
import { upcomingInteraction, techCorpContacts } from '@/lib/data/mockData';
import EvidenceBadge from '@/components/EvidenceBadge';
import MomentumDisplay from '@/components/MomentumDisplay';

type ConsoleMode = 'default' | 'prep' | 'sensing' | 'follow-through';

export default function ConsolePage() {
  const [mode, setMode] = useState<ConsoleMode>('default');
  const [sensingActive, setSensingActive] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const liveTips = [
    {
      pattern: 'Sarah mentioned "board timeline" twice in 90 seconds',
      meaning: 'External urgency creating decision pressure',
      move: 'Ask: "What does the board need to see to feel confident moving forward?"',
    },
    {
      pattern: 'David shifted from asking compliance questions to implementation timeline',
      meaning: 'Security concerns resolved; focus moved to deployment',
      move: 'Acknowledge shift: "Sounds like security is good. What timeline works for rollout?"',
    },
    {
      pattern: 'Sarah paused before answering adoption question',
      meaning: 'Unspoken concern about team adoption',
      move: 'Permission-based: "What concerns do you have about the team adopting this?"',
    },
  ];

  if (mode === 'sensing') {
    return (
      <div className="min-h-screen flex flex-col bg-piloteer-plane">
        <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-void px-6 py-3.5 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <Link href="/console" onClick={() => setMode('default')}>
              <PiloteerLogo className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <div className="text-sm text-piloteer-metal font-mono">
              TechCorp Global · Sarah Chen, David Kim
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-piloteer-signal-soft border border-piloteer-signal-line rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-piloteer-signal animate-pulse" />
              <span className="text-sm font-mono text-piloteer-signal">Sensing</span>
            </div>
            <button
              onClick={() => {
                setSensingActive(false);
                setMode('follow-through');
              }}
              className="btn-secondary text-sm"
            >
              End Call
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-end justify-center p-8 pb-16">
          <div className="max-w-xl w-full space-y-4">
            <div className="card bg-piloteer-black border-piloteer-hair-2 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow flex items-center gap-2">
                  <span>Pattern</span>
                  <span className="text-piloteer-hair-2">→</span>
                  <span>Meaning</span>
                  <span className="text-piloteer-hair-2">→</span>
                  <span>Move</span>
                </div>
                <span className="text-xs font-mono text-piloteer-mute">
                  {currentTip + 1} of {liveTips.length}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="eyebrow mb-2">Pattern</div>
                  <p className="text-sm text-piloteer-ink leading-relaxed">{liveTips[currentTip].pattern}</p>
                </div>
                <div>
                  <div className="eyebrow mb-2">Meaning</div>
                  <p className="text-sm ctx leading-relaxed">{liveTips[currentTip].meaning}</p>
                </div>
                <div className="pt-3 border-t border-piloteer-hair-2">
                  <div className="eyebrow mb-2">Move</div>
                  <p className="text-base font-semibold text-piloteer-ink leading-relaxed">{liveTips[currentTip].move}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-4 border-t border-piloteer-hair">
                <button
                  onClick={() => setCurrentTip((prev) => Math.min(prev + 1, liveTips.length - 1))}
                  className="btn-ghost text-sm flex-1"
                  disabled={currentTip === liveTips.length - 1}
                >
                  Dismiss
                </button>
                <button className="btn-ghost text-sm px-4">👍</button>
                <button className="btn-ghost text-sm px-4">👎</button>
              </div>
            </div>

            <div className="text-xs text-center ctx font-mono">
              Tips are private. Only you see them during the call.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'follow-through') {
    return (
      <div className="min-h-screen flex flex-col bg-piloteer-void">
        <nav className="border-b border-piloteer-hair bg-piloteer-plane px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/console" onClick={() => setMode('default')}>
              <PiloteerLogo className="h-7" />
            </Link>
            <button
              onClick={() => setMode('default')}
              className="text-sm ctx hover:text-piloteer-ink font-mono"
            >
              ← Console
            </button>
          </div>
        </nav>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-3 interp">Follow-Through</h1>
              <p className="ctx text-lg">
                TechCorp Global · Sarah Chen, David Kim
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">What happened?</h3>
              <textarea
                rows={4}
                defaultValue="Security review completed. David confirmed SOC 2 compliance requirements are met. Sarah expressed urgency driven by board timeline. Both ready to move to executive presentation."
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Commitments made</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  defaultValue="Sarah to schedule executive presentation by end of week"
                  className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  defaultValue="David to provide final written compliance sign-off"
                  className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">What's blocking progress?</h3>
              <textarea
                rows={3}
                placeholder="Concerns, objections, or obstacles that came up..."
                defaultValue="Need to define pilot scope (full team vs subset) before executive presentation"
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Next action</h3>
              <textarea
                rows={3}
                defaultValue="Send executive briefing materials and rollout timeline options. Propose three pilot scope options with pros/cons."
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1">
                Save & Approve Follow-Up
              </button>
              <button className="btn-secondary">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'prep') {
    const interaction = upcomingInteraction;
    const hunterRead = interaction.hunterRead!;

    return (
      <div className="min-h-screen flex flex-col bg-piloteer-void">
        <nav className="border-b border-piloteer-hair bg-piloteer-plane px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/console" onClick={() => setMode('default')}>
              <PiloteerLogo className="h-7" />
            </Link>
            <button
              onClick={() => setMode('default')}
              className="text-sm ctx hover:text-piloteer-ink font-mono"
            >
              ← Console
            </button>
          </div>
        </nav>

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-3 interp">Prep Sensing</h1>
              <p className="ctx text-lg">
                {interaction.company.name} · {new Date(interaction.date).toLocaleString()}
              </p>
            </div>

            <div className="card bg-piloteer-black border-2 border-piloteer-hair-2">
              <h2 className="text-2xl font-bold mb-6">Hunter's Read</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="eyebrow mb-3">Current Momentum</div>
                  <MomentumDisplay
                    score={hunterRead.currentMomentum}
                    direction={hunterRead.momentumDirection}
                    size="lg"
                  />
                </div>

                <div>
                  <div className="eyebrow mb-3">What Changed</div>
                  <p className="ctx leading-relaxed">{hunterRead.whatChanged}</p>
                </div>

                <div>
                  <div className="eyebrow mb-3">What the Buyer Cares About</div>
                  <ul className="space-y-2">
                    {hunterRead.buyerCaresAbout.map((item, idx) => (
                      <li key={idx} className="ctx leading-relaxed flex items-start gap-3">
                        <span className="text-piloteer-verified mt-1">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="eyebrow mb-3">Unresolved</div>
                  <ul className="space-y-2">
                    {hunterRead.unresolved.map((item, idx) => (
                      <li key={idx} className="ctx leading-relaxed flex items-start gap-3">
                        <span className="text-piloteer-signal mt-1">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {hunterRead.personalContext && hunterRead.personalContext.length > 0 && (
                  <div className="pt-5 border-t border-piloteer-hair-2">
                    <div className="eyebrow mb-3">Personal Context</div>
                    {hunterRead.personalContext.map((ctx, idx) => (
                      <div key={idx} className="text-sm ctx mb-3">
                        <p className="leading-relaxed">{ctx.detail}</p>
                        <p className="text-xs text-piloteer-mute mt-2 font-mono">
                          {ctx.source === 'public-profile' ? 'Public profile' : 'Prior interaction'} · <button className="hover:text-piloteer-ink transition-colors">Review</button>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-3">Call Type</h3>
                <select className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors">
                  <option>{interaction.callType}</option>
                  <option>Discovery</option>
                  <option>Demo</option>
                  <option>Proposal</option>
                </select>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-3">Your Role</h3>
                <select className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors">
                  <option>{interaction.sellerRole}</option>
                  <option>Leading</option>
                  <option>Supporting</option>
                  <option>Observing</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">People Joining</h3>
              <div className="grid grid-cols-2 gap-4">
                {interaction.contacts.map((contact) => (
                  <div key={contact.id} className="bg-piloteer-surface-2 p-4 rounded-xl border border-piloteer-hair">
                    <div className="font-semibold text-sm text-piloteer-ink">{contact.name}</div>
                    <div className="text-xs ctx mt-1">{contact.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Goal</h3>
              <textarea
                rows={3}
                defaultValue={interaction.goal}
                placeholder="What needs to be true when this call ends?"
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Additional Context (Optional)</h3>
              <textarea
                rows={3}
                placeholder="Anything Hunter can't retrieve: offline conversations, internal concerns, personal details..."
                className="w-full bg-piloteer-surface-2 border border-piloteer-hair-2 rounded-xl px-4 py-3 text-piloteer-ink focus:border-piloteer-focus focus:outline-none transition-colors leading-relaxed"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSensingActive(true);
                  setMode('sensing');
                }}
                className="btn-primary flex-1 py-3.5 text-base"
              >
                Start Sensing
              </button>
              <button className="btn-secondary py-3.5">Save Prep</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default console view - compact chrome
  return (
    <div className="min-h-screen flex flex-col bg-piloteer-void">
      <nav className="border-b border-piloteer-hair bg-gradient-to-b from-piloteer-black-alt to-piloteer-void px-6 py-3.5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <PiloteerLogo className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="bg-piloteer-surface border border-piloteer-hair rounded-lg px-4 py-2 text-sm w-56 text-piloteer-ink placeholder:text-piloteer-mute focus:border-piloteer-hair-2 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary text-sm">Start Sensing ▾</button>
            <button className="btn-secondary text-sm px-3">+</button>
            <button className="text-sm ctx hover:text-piloteer-ink font-mono transition-colors">More</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold interp">Console</h1>
            <p className="ctx text-lg">Prepare for calls and sense during interactions</p>
          </div>

          <div className="space-y-4">
            <div className="eyebrow mb-4">Today's Interactions</div>
            
            <button
              onClick={() => setMode('prep')}
              className="w-full card hover:border-piloteer-hair-2 hover:bg-piloteer-surface-2/50 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-piloteer-verified" />
                    <span className="text-sm font-mono text-piloteer-mute">In 2 hours</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-piloteer-ink">{upcomingInteraction.company.name}</h3>
                  <p className="text-sm ctx mb-3">
                    {upcomingInteraction.contacts.map(c => c.name).join(', ')}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-piloteer-verified-soft text-piloteer-verified text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-piloteer-verified-line">
                    Prepared
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-piloteer-ink">Technical Validation</div>
                  <div className="text-xs ctx mt-1.5">Leading</div>
                  <div className="mt-4 text-xs font-mono uppercase tracking-wider ctx group-hover:text-piloteer-ink transition-colors">
                    Open Prep →
                  </div>
                </div>
              </div>
            </button>

            <div className="card opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-piloteer-mute" />
                    <span className="text-sm font-mono text-piloteer-mute">Tomorrow, 10:00 AM</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-piloteer-ink">Acme Europe</h3>
                  <p className="text-sm ctx mb-3">Follow-on call</p>
                  <div className="inline-flex items-center gap-2 bg-piloteer-signal-soft text-piloteer-signal text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border border-piloteer-signal-line">
                    Needs Prep
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-piloteer-ink">Proposal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/dashboard" className="text-sm font-mono ctx hover:text-piloteer-ink transition-colors">
              Open Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
