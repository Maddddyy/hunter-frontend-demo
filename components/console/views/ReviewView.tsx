import { ConsoleState } from '../types';

const REVIEW_DATA = {
  cells: [
    ['Outcome', 'Moved forward', 'g'],
    ['Their commitment', 'Next meeting Tuesday', ''],
    ['Still open', 'Their switch-over worry', 'r'],
    ['Who decides', 'Sarah backs it · Mark signs off', ''],
    ['What worked', 'Got them to name the real worry', 'g'],
    ['Missed', 'Did not press on the cost of waiting', '']
  ],
  carry: 'Do not talk price again until their switch-over worry is handled.',
  drafts: [
    ['Follow-up email', 'Confirms Tuesday next meeting and sends the rollout plan they asked for.', 'Sends to Sarah Klein'],
    ['CRM update', 'Keeps the stage where it is; logs their open worry, who signs, and Tuesday meeting.', 'Writes to Salesforce'],
    ['Next interaction', 'Next meeting · Tuesday 10:00 - turn their worry into a yes.', 'Books the meeting']
  ]
};

interface ReviewViewProps {
  state: ConsoleState;
  setState: (fn: (s: ConsoleState) => ConsoleState) => void;
  onBack: () => void;
}

export function ReviewView({ state, setState, onBack }: ReviewViewProps) {
  const draftsDone = state.draftsDone || new Set<number>();

  const handleApproveDraft = (idx: number) => {
    const newDraftsDone = new Set(draftsDone);
    newDraftsDone.add(idx);
    setState(s => ({ ...s, draftsDone: newDraftsDone }));
  };

  const handleApproveAll = () => {
    const newDraftsDone = new Set([0, 1, 2]);
    setState(s => ({ ...s, draftsDone: newDraftsDone }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.07em] text-[#5bc08d] bg-[#5bc08d]/10 border border-[#5bc08d]/30 rounded-full px-3 py-1">
          Advanced
        </div>
        <span className="text-xs text-[#787c86] font-mono">
          Hunter drafted your follow-through
        </span>
      </div>

      {/* Review grid */}
      <div className="grid gap-px bg-[#24242e] border border-[#24242e] rounded-xl overflow-hidden">
        {REVIEW_DATA.cells.map((cell, idx) => (
          <div key={idx} className="bg-[#15151c] p-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.07em] text-[#787c86] mb-1">
              {cell[0]}
            </div>
            <div className={`text-xs leading-relaxed ${
              cell[2] === 'g' ? 'text-[#5bc08d]' : 
              cell[2] === 'r' ? 'text-[#ff5c5c]' : 
              'text-[#f5f6f7]'
            }`}>
              {cell[1]}
            </div>
          </div>
        ))}
      </div>

      {/* Carry forward */}
      <div className="flex gap-2.5 border border-[#24242e] rounded-xl p-3 bg-[#15151c]">
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#e8a33d] w-[74px] flex-shrink-0 leading-tight pt-0.5">
          Carry<br />forward
        </span>
        <span className="flex-1 text-[#f5f6f7] text-xs leading-relaxed">
          {REVIEW_DATA.carry}
        </span>
      </div>

      {/* Eyebrow */}
      <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#787c86]">
        Approve before anything is sent or written back
      </div>

      {/* Drafts */}
      {REVIEW_DATA.drafts.map((draft, idx) => {
        const isDone = draftsDone.has(idx);
        return (
          <div 
            key={idx} 
            className={`border border-[#24242e] rounded-xl bg-[#15151c] p-3.5 ${isDone ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#787c86]">
                {draft[0]}
              </span>
              <span className={`ml-auto font-mono text-[9px] ${
                isDone ? 'text-[#5bc08d]' : 'text-[#e8a33d]'
              }`}>
                {isDone ? '✓ Approved' : 'Awaiting approval'}
              </span>
            </div>
            <div className="text-xs text-[#b7babd] leading-relaxed mb-2">
              {draft[1]}
            </div>
            <div className={`font-mono text-[10px] tracking-wider mb-3 ${
              isDone ? 'text-[#5bc08d]' : 'text-[#787c86]'
            }`}>
              {isDone ? `✓ ${draft[2]} · done` : `→ ${draft[2]} · on your approval`}
            </div>
            {!isDone && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleApproveDraft(idx)}
                  className="font-display font-semibold text-xs bg-[#f5f6f7] text-[#08080b] px-3.5 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  Approve
                </button>
                <button className="font-display font-semibold text-xs text-[#b7babd] px-3.5 py-2 hover:text-[#f5f6f7] transition-colors">
                  Edit
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom toolbar */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#24242e] -mx-4 px-4 pb-0.5 mt-6 bg-black/25">
        <button 
          onClick={onBack}
          className="font-display font-semibold text-xs text-[#b7babd] hover:text-[#f5f6f7] px-3 py-2"
        >
          Close
        </button>
        <div className="flex-1" />
        <button 
          onClick={handleApproveAll}
          className="bg-[#f5f6f7] text-[#08080b] font-display font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-white transition-colors"
        >
          Approve all & carry forward
        </button>
      </div>
    </div>
  );
}
