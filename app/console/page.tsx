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
      <div className="min-h-screen flex flex-col bg-piloteer-black-alt">
        <nav className="border-b border-piloteer-surface px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PiloteerLogo className="h-6" />
            <div className="text-sm text-piloteer-gray">
              TechCorp Global · Sarah Chen, David Kim
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-piloteer-red animate-pulse" />
              <span className="text-sm">Sensing</span>
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

        <div className="flex-1 flex items-end justify-center p-8">
          <div className="max-w-xl w-full space-y-4">
            {/* Live tip */}
            <div className="card bg-piloteer-black border-2 border-piloteer-surface-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs text-piloteer-gray uppercase tracking-wide">
                  Pattern → Meaning → Move
                </div>
                <span className="text-xs text-piloteer-gray">
                  {currentTip + 1} of {liveTips.length}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-piloteer-gray mb-1">Pattern</div>
                  <p className="text-sm">{liveTips[currentTip].pattern}</p>
                </div>
                <div>
                  <div className="text-xs text-piloteer-gray mb-1">Meaning</div>
                  <p className="text-sm text-piloteer-gray">{liveTips[currentTip].meaning}</p>
                </div>
                <div className="pt-2 border-t border-piloteer-surface-hover">
                  <div className="text-xs text-piloteer-gray mb-1">Move</div>
                  <p className="text-sm font-medium">{liveTips[currentTip].move}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-piloteer-surface-hover">
                <button
                  onClick={() => setCurrentTip((prev) => Math.min(prev + 1, liveTips.length - 1))}
                  className="btn-secondary text-sm flex-1"
                  disabled={currentTip === liveTips.length - 1}
                >
                  Dismiss
                </button>
                <button className="btn-secondary text-sm px-3">
                  <span className="text-piloteer-gray">👍</span>
                </button>
                <button className="btn-secondary text-sm px-3">
                  <span className="text-piloteer-gray">👎</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-center text-piloteer-gray">
              Tips are private. Only you see them during the call.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'follow-through') {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="border-b border-piloteer-surface bg-piloteer-black-alt px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/console" onClick={() => setMode('default')}>
              <PiloteerLogo className="h-8" />
            </Link>
            <button
              onClick={() => setMode('default')}
              className="text-sm text-piloteer-gray hover:text-white"
            >
              ← Back to Console
            </button>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Follow-Through</h1>
              <p className="text-piloteer-gray">
                TechCorp Global · Sarah Chen, David Kim
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">What happened?</h3>
              <textarea
                rows={4}
                defaultValue="Security review completed. David confirmed SOC 2 compliance requirements are met. Sarah expressed urgency driven by board timeline. Both ready to move to executive presentation."
                className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Commitments made</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue="Sarah to schedule executive presentation by end of week"
                  className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
                />
                <input
                  type="text"
                  defaultValue="David to provide final written compliance sign-off"
                  className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">What's blocking progress?</h3>
              <textarea
                rows={3}
                placeholder="Concerns, objections, or obstacles that came up..."
                defaultValue="Need to define pilot scope (full team vs subset) before executive presentation"
                className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Next action</h3>
              <textarea
                rows={3}
                defaultValue="Send executive briefing materials and rollout timeline options. Propose three pilot scope options with pros/cons."
                className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
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
      <div className="min-h-screen flex flex-col">
        <nav className="border-b border-piloteer-surface bg-piloteer-black-alt px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/console" onClick={() => setMode('default')}>
              <PiloteerLogo className="h-8" />
            </Link>
            <button
              onClick={() => setMode('default')}
              className="text-sm text-piloteer-gray hover:text-white"
            >
              ← Back to Console
            </button>
          </div>
        </nav>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Prepare for Call</h1>
              <p className="text-piloteer-gray">
                {interaction.company.name} · {new Date(interaction.date).toLocaleString()}
              </p>
            </div>

            {/* Hunter's Read */}
            <div className="card bg-piloteer-black border-2 border-piloteer-surface-hover">
              <h2 className="text-xl font-semibold mb-4">Hunter's Read</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    Current Momentum
                  </div>
                  <MomentumDisplay
                    score={hunterRead.currentMomentum}
                    direction={hunterRead.momentumDirection}
                    size="md"
                  />
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">What Changed</div>
                  <p className="text-sm text-piloteer-gray">{hunterRead.whatChanged}</p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">What the Buyer Cares About</div>
                  <ul className="space-y-1">
                    {hunterRead.buyerCaresAbout.map((item, idx) => (
                      <li key={idx} className="text-sm text-piloteer-gray flex items-start gap-2">
                        <span className="text-piloteer-gray/50 mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Unresolved</div>
                  <ul className="space-y-1">
                    {hunterRead.unresolved.map((item, idx) => (
                      <li key={idx} className="text-sm text-piloteer-gray flex items-start gap-2">
                        <span className="text-piloteer-red/50 mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {hunterRead.personalContext && hunterRead.personalContext.length > 0 && (
                  <div className="pt-3 border-t border-piloteer-surface-hover">
                    <div className="text-sm font-medium mb-2">Personal Context</div>
                    {hunterRead.personalContext.map((ctx, idx) => (
                      <div key={idx} className="text-sm text-piloteer-gray mb-2">
                        <p>{ctx.detail}</p>
                        <p className="text-xs text-piloteer-gray/70 mt-1">
                          {ctx.source === 'public-profile' ? 'Public profile' : 'Prior interaction'} · <button className="hover:text-white">Review</button>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Call details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold mb-3">Call Type</h3>
                <select className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2">
                  <option>{interaction.callType}</option>
                  <option>Discovery</option>
                  <option>Demo</option>
                  <option>Proposal</option>
                </select>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-3">Your Role</h3>
                <select className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2">
                  <option>{interaction.sellerRole}</option>
                  <option>Leading</option>
                  <option>Supporting</option>
                  <option>Observing</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">People Joining</h3>
              <div className="grid grid-cols-2 gap-4">
                {interaction.contacts.map((contact) => (
                  <div key={contact.id} className="bg-piloteer-black p-3 rounded-md border border-piloteer-surface-hover">
                    <div className="font-medium text-sm">{contact.name}</div>
                    <div className="text-xs text-piloteer-gray">{contact.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Goal</h3>
              <textarea
                rows={3}
                defaultValue={interaction.goal}
                placeholder="What needs to be true when this call ends?"
                className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Additional Context (Optional)</h3>
              <textarea
                rows={3}
                placeholder="Anything Hunter can't retrieve: offline conversations, internal concerns, personal details..."
                className="w-full bg-piloteer-black border border-piloteer-surface-hover rounded-md px-4 py-2"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSensingActive(true);
                  setMode('sensing');
                }}
                className="btn-primary flex-1"
              >
                Start Sensing
              </button>
              <button className="btn-secondary">Save Prep</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default console view
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-piloteer-surface bg-piloteer-black-alt px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <PiloteerLogo className="h-6" />
            </Link>
            <input
              type="search"
              placeholder="Search companies, contacts..."
              className="bg-piloteer-surface border border-piloteer-surface-hover rounded-md px-4 py-1.5 text-sm w-64"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary text-sm">Start Sensing ▾</button>
            <button className="btn-secondary text-sm px-3">+</button>
            <button className="text-sm text-piloteer-gray hover:text-white">More</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">Console</h1>
            <p className="text-piloteer-gray">Prepare for calls and sense during interactions</p>
          </div>

          <div className="grid gap-6">
            <button
              onClick={() => setMode('prep')}
              className="card hover:border-piloteer-surface-hover hover:bg-piloteer-surface/50 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-piloteer-green" />
                    <span className="text-sm text-piloteer-gray">In 2 hours</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{upcomingInteraction.company.name}</h3>
                  <p className="text-sm text-piloteer-gray mb-3">
                    {upcomingInteraction.contacts.map(c => c.name).join(', ')}
                  </p>
                  <div className="inline-block bg-piloteer-green/10 text-piloteer-green text-xs px-2 py-1 rounded">
                    Prepared
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Technical Validation</div>
                  <div className="text-xs text-piloteer-gray mt-1">Leading</div>
                </div>
              </div>
            </button>

            <div className="card opacity-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-piloteer-gray" />
                    <span className="text-sm text-piloteer-gray">Tomorrow, 10:00 AM</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Acme Europe</h3>
                  <p className="text-sm text-piloteer-gray mb-3">Follow-on call</p>
                  <div className="inline-block bg-piloteer-red/10 text-piloteer-red text-xs px-2 py-1 rounded">
                    Needs Prep
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Proposal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-piloteer-gray hover:text-white">
              Open Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
