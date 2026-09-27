import { ConsoleState, LiveTip } from '../types';

const SELLER_TIPS: LiveTip[] = [
  {
    cat: 'Trust',
    type: 'MOVE',
    accent: '#FF5C5C',
    move: 'Stop pitching. Ask what is still on their mind.',
    body: 'Their answers are getting shorter and the tone has gone careful while you keep talking.',
    sig: [42, '▼ falling', '#E8A33D', 62, 'talk ratio', '#B7BABD', 30, 'readiness', '#5BC08D']
  },
  {
    cat: 'Value',
    type: 'MOVE',
    accent: '#E8A33D',
    move: 'Find the real blocker before you sell more.',
    body: 'Every time you talk value they pull back to how hard switching looks — the worry is the change, not the value.',
    sig: [36, '▼ low', '#E8A33D', 54, 'talk ratio', '#B7BABD', 44, 'readiness', '#5BC08D']
  },
  {
    cat: 'Authority',
    type: 'AWARENESS',
    accent: '#B7BABD',
    move: 'Ask what the CFO needs to say yes.',
    body: 'Mark has to sign off but has not shown up yet - get what he needs while you can.',
    sig: [58, '▲ rising', '#5BC08D', 46, 'talk ratio', '#B7BABD', 60, 'readiness', '#5BC08D']
  },
  {
    cat: 'Readiness',
    type: 'MOVE',
    accent: '#5BC08D',
    move: 'They are ready - stop selling and book the next step.',
    body: 'They are talking like it is already happening and asking about timing. Stop presenting.',
    sig: [80, '▲ high', '#5BC08D', 38, 'talk ratio', '#B7BABD', 84, 'readiness', '#5BC08D']
  }
];

interface SensingViewProps {
  state: ConsoleState;
  setState: (fn: (s: ConsoleState) => ConsoleState) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function SensingView({ state, setState }: SensingViewProps) {
  // Show tips progressively
  const visibleTips = state.tipIdx >= 0 ? SELLER_TIPS.slice(0, state.tipIdx + 1) : [];
  const currentTip = state.tipIdx >= 0 ? SELLER_TIPS[state.tipIdx] : null;

  // Schedule tips to appear over time
  if (state.sensing && state.tipIdx < 0) {
    setTimeout(() => setState(s => ({ ...s, tipIdx: 0 })), 2200);
  }
  if (state.sensing && state.tipIdx === 0 && visibleTips.length === 1) {
    setTimeout(() => setState(s => s.tipIdx < 1 ? { ...s, tipIdx: 1 } : s), 6000);
  }
  if (state.sensing && state.tipIdx === 1 && visibleTips.length === 2) {
    setTimeout(() => setState(s => s.tipIdx < 2 ? { ...s, tipIdx: 2 } : s), 10000);
  }
  if (state.sensing && state.tipIdx === 2 && visibleTips.length === 3) {
    setTimeout(() => setState(s => s.tipIdx < 3 ? { ...s, tipIdx: 3 } : s), 14000);
  }

  return (
    <div className="p-4 space-y-4">
      {state.tipIdx < 0 ? (
        <div className="py-10 px-4 text-center text-[#787c86] text-sm">
          Hunter is sensing…
          <div className="flex items-center justify-center gap-1.5 mt-3.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#787c86] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#787c86] animate-bounce" style={{ animationDelay: '200ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#787c86] animate-bounce" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      ) : currentTip ? (
        <>
          <div 
            className="border border-[#34343f] rounded-[13px] bg-[#15151c] p-4 relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-450"
            style={{ '--accent': currentTip.accent } as any}
          >
            <div 
              className="absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-full"
              style={{ background: currentTip.accent }}
            />
            <div className="flex items-center gap-2.5 mb-3 pl-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider" style={{ color: currentTip.accent }}>
                <div className="w-[7px] h-[7px] rounded-full" style={{ background: currentTip.accent }} />
                {currentTip.cat}
              </div>
              <div className="ml-auto font-mono text-[9.5px] tracking-[0.12em] font-semibold" style={{ color: currentTip.accent }}>
                {currentTip.type}
              </div>
            </div>
            <h3 className="font-display font-bold text-[19px] leading-tight tracking-tight mb-2.5 pl-2" style={{ textWrap: 'balance' } as any}>
              {currentTip.move}
            </h3>
            <p className="text-[13px] text-[#b7babd] leading-relaxed pl-2 mb-0">
              {currentTip.body}
            </p>
            <div className="font-mono text-[10px] text-[#787c86] pl-2 mt-3">
              just now
            </div>
            <div className="flex gap-2 mt-3.5 pl-2">
              <button className="font-display font-semibold text-xs px-3.5 py-2 border border-[#34343f] bg-[#15151c] rounded-lg hover:bg-[#1d1d26] transition-colors">
                Acted
              </button>
              <button className="font-display font-semibold text-xs text-[#b7babd] px-3.5 py-2 hover:text-[#f5f6f7] transition-colors">
                Dismiss
              </button>
            </div>
          </div>

          {/* Signal bars */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0f0f14] border border-[#24242e] rounded-lg p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#787c86] mb-1.5">
                Buyer engagement
              </div>
              <div className="font-mono text-xs text-[#f5f6f7] mb-1.5">
                {currentTip.sig[1]}
              </div>
              <div className="h-[5px] bg-[#1d1d26] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-900 ease-out"
                  style={{ 
                    width: `${currentTip.sig[0]}%`,
                    background: currentTip.sig[2] as string
                  }}
                />
              </div>
            </div>
            <div className="bg-[#0f0f14] border border-[#24242e] rounded-lg p-3">
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#787c86] mb-1.5">
                Decision readiness
              </div>
              <div className="font-mono text-xs text-[#f5f6f7] mb-1.5">
                {currentTip.sig[6]}%
              </div>
              <div className="h-[5px] bg-[#1d1d26] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-900 ease-out"
                  style={{ 
                    width: `${currentTip.sig[6]}%`,
                    background: currentTip.sig[7] as string
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pager */}
          <div className="flex items-center justify-between pt-3 border-t border-[#24242e] font-mono text-[11px] text-[#787c86]">
            <button 
              onClick={() => state.tipIdx > 0 && setState(s => ({ ...s, tipIdx: s.tipIdx - 1 }))}
              disabled={state.tipIdx <= 0}
              className="flex items-center gap-1.5 hover:text-[#f5f6f7] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Older
            </button>
            <span>{state.tipIdx + 1} / {SELLER_TIPS.length}</span>
            <button 
              onClick={() => state.tipIdx < SELLER_TIPS.length - 1 && setState(s => ({ ...s, tipIdx: s.tipIdx + 1 }))}
              disabled={state.tipIdx >= SELLER_TIPS.length - 1}
              className="flex items-center gap-1.5 hover:text-[#f5f6f7] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Newer
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </>
      ) : null}

      {/* Controls */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-[#24242e] -mx-4 px-4 pb-0.5 bg-black/25">
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#787c86]">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5 6 9H2v6h4l5 4z"/>
            <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
          </svg>
          Tip volume
          <div className="w-16 h-1 bg-[#1d1d26] rounded-full relative">
            <div className="absolute left-0 top-0 h-full bg-[#b7babd] rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[10px] text-[#787c86]">Cooldown active</span>
      </div>
    </div>
  );
}
