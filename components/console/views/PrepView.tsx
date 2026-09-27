import { ConsoleState } from '../types';
import { SELLER_TODAY } from './HomeView';

interface PrepViewProps {
  state: ConsoleState;
  setState: (fn: (s: ConsoleState) => ConsoleState) => void;
  onBack: () => void;
  onStartSensing: () => void;
}

export function PrepView({ state, setState, onBack, onStartSensing }: PrepViewProps) {
  const interaction = SELLER_TODAY.find(i => i.id === state.currentDeal) || SELLER_TODAY[0];
  const needsObj = !interaction.objective || interaction.state === 'prep';

  return (
    <div className="p-4 space-y-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 font-mono text-[11px] text-[#787c86] hover:text-[#f5f6f7] mb-3"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Prepare My Day
      </button>

      {/* Objective Box */}
      <div className={`flex gap-3 items-start p-3.5 rounded-xl border ${
        needsObj 
          ? 'bg-[#e8a33d]/10 border-[#e8a33d]/30' 
          : 'bg-[#5bc08d]/10 border-[#5bc08d]/30'
      }`}>
        <span className={`font-mono text-[9px] uppercase tracking-[0.12em] pt-1 whitespace-nowrap ${
          needsObj ? 'text-[#e8a33d]' : 'text-[#5bc08d]'
        }`}>
          {needsObj ? 'Objective' : 'Goal'}
        </span>
        <span className="font-display font-semibold text-sm leading-snug">
          {needsObj 
            ? `Set a measurable objective — Hunter suggests: "${interaction.recs?.Move}"` 
            : interaction.objective
          }
        </span>
      </div>

      {/* Hunter knows */}
      <div className="border border-[#24242e] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#15151c] border-b border-[#24242e]">
          <span className="font-display font-bold text-[13px]">Hunter knows</span>
          <span className="font-mono text-[9px] text-[#787c86] ml-auto uppercase tracking-wider">Confirm</span>
        </div>
        <div className="px-3.5 py-1">
          {Object.entries(interaction.knows || {}).map(([key, value]) => (
            <div key={key} className="flex gap-2.5 py-2 border-b border-[#24242e] last:border-b-0">
              <span className="font-mono text-[9px] text-[#787c86] uppercase tracking-wider w-[74px] flex-shrink-0 pt-0.5">
                {key}
              </span>
              {key === 'Participants' && interaction.people ? (
                <div className="flex-1 space-y-2">
                  {interaction.people.map((person, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-xs">{person[0]}</span>
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#787c86]">{person[1]}</span>
                        {person[2] ? (
                          <button className="ml-auto font-mono text-[9.5px] text-[#7fb0ff] border border-[#7fb0ff]/35 bg-[#7fb0ff]/8 rounded-full px-2.5 py-0.5 hover:brightness-110">
                            in · profile ▸
                          </button>
                        ) : (
                          <button className="ml-auto font-mono text-[9.5px] text-[#787c86] border border-[#34343f] bg-[#15151c] rounded-full px-2.5 py-0.5 hover:text-[#f5f6f7]">
                            + LinkedIn
                          </button>
                        )}
                      </div>
                      {person[2] && (
                        <div className="border-l-2 border-[#7fb0ff]/35 pl-3 py-0.5 hidden">
                          <span className="font-mono text-[10px] text-[#7fb0ff] block mb-1">linkedin.com/in/{person[2]}</span>
                          <p className="text-xs text-[#b7babd] leading-relaxed">{person[3]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="flex-1 text-[#f5f6f7] text-xs leading-relaxed">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {interaction.knows?.Lasttime && interaction.knows.Lasttime !== 'First meeting' && (
        <div className="font-mono text-[10.5px] text-[#787c86] leading-relaxed -mt-1 px-0.5">
          ↳ Second interaction — Hunter enriches the buyer with public LinkedIn context to sharpen this prep.
        </div>
      )}

      {/* Hunter recommends */}
      <div className="border border-[#24242e] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#15151c] border-b border-[#24242e]">
          <span className="font-display font-bold text-[13px]">Hunter recommends</span>
          <span className="font-mono text-[9px] text-[#787c86] ml-auto uppercase tracking-wider">Accept / edit</span>
        </div>
        <div className="px-3.5 py-1">
          {Object.entries(interaction.recs || {}).map(([key, value]) => (
            <div key={key} className="flex gap-2.5 py-2 border-b border-[#24242e] last:border-b-0">
              <span className="font-mono text-[9px] text-[#787c86] uppercase tracking-wider w-[74px] flex-shrink-0 pt-0.5">
                {key}
              </span>
              <span className="flex-1 text-[#f5f6f7] text-xs leading-relaxed">
                <strong className="font-semibold">{value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hunter needs */}
      <div className="border border-[#24242e] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#15151c] border-b border-[#24242e]">
          <span className="font-display font-bold text-[13px]">Hunter needs</span>
          <span className="font-mono text-[9px] text-[#787c86] ml-auto uppercase tracking-wider">Only what it can't retrieve</span>
        </div>
        <div className="px-3.5 pt-2.5 pb-2.5">
          <textarea 
            className="w-full bg-[#15151c] border border-[#34343f] rounded-lg text-[#f5f6f7] text-xs p-3 min-h-[56px] resize-y outline-none focus:border-[#7fb0ff] leading-relaxed"
            placeholder="Anything Hunter can't see? A relationship change, a private constraint…"
          />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#24242e] -mx-4 px-4 pb-0.5 mt-6 bg-black/25">
        <button className="font-display font-semibold text-xs text-[#b7babd] hover:text-[#f5f6f7] px-3 py-2">
          Save prep
        </button>
        <div className="flex-1" />
        <button 
          onClick={onStartSensing}
          className="flex items-center gap-2 bg-gradient-to-b from-[#ff6a6a] to-[#e94f4f] border border-[#ff6a6a] text-white font-display font-semibold text-xs px-3.5 py-2 rounded-lg hover:brightness-105 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-white" />
          Start Sensing
        </button>
      </div>
    </div>
  );
}
