import { ConsoleState, Interaction } from '../types';

const SELLER_TODAY: Interaction[] = [
  {
    id: 'techcorp',
    time: '10:00',
    company: 'TechCorp Global',
    type: 'Discovery',
    stage: 'Discovery',
    objective: 'Understand their current sales coaching gaps and quantify the impact',
    state: 'ready',
    knows: {
      'Opportunity': 'TechCorp Global · Discovery',
      'Participants': 'Sarah Chen, David Kim',
      'Unresolved': 'Current coaching approach and what is not working',
      'Lasttime': 'First meeting'
    },
    recs: {
      'Move': 'Get them to name what coaching does not catch today.',
      'Ask': 'What signals do your managers miss in real calls?',
      'Watch': 'Generic coaching pain without a dollar figure.',
      'Secure': 'A number on lost revenue or rep turnover.'
    },
    people: [
      ['Sarah Chen', 'Champion', 'sarah-chen', 'VP Revenue Operations at TechCorp, 3 years. Previously scaled sales ops at a Series C SaaS company - cares about rep productivity and manager effectiveness.'],
      ['David Kim', 'Evaluator', 'david-kim', 'CRO, 18 months. Ex-enterprise seller turned leader - skeptical of AI coaching but open if it proves revenue impact.']
    ]
  },
  {
    id: 'acme',
    time: '14:00',
    company: 'Acme Europe',
    type: 'Technical validation',
    stage: 'Technical validation',
    objective: 'Address their rollout concern and secure next meeting',
    state: 'prep',
    knows: {
      'Opportunity': 'Acme Europe · $125K',
      'Participants': 'Sarah Klein, Mark Boyd',
      'Unresolved': 'Their switch-over worry',
      'Lasttime': 'They went quiet on rollout details'
    },
    recs: {
      'Move': 'Surface the real blocker before you talk price.',
      'Ask': 'What would need to be true for this to be an easy yes?',
      'Watch': 'They go quiet when you pitch features.',
      'Secure': 'A booked next meeting with a date.'
    }
  },
  {
    id: 'globex',
    time: '16:30',
    company: 'Globex',
    type: 'Commercial review',
    stage: 'Negotiation',
    objective: 'Lock the signer, the date, and the path to signature',
    state: 'ready',
    knows: {
      'Opportunity': 'Globex · $260K',
      'Participants': 'Ray Osei, Legal',
      'Unresolved': 'Who actually signs',
      'Lasttime': 'Agreed on terms in principle'
    },
    recs: {
      'Move': 'Confirm who signs and when.',
      'Ask': 'Who signs this, and what is the path to get there?',
      'Watch': 'Procurement going quiet.',
      'Secure': 'A signer and a signature date.'
    }
  }
];

interface HomeViewProps {
  state: ConsoleState;
  setState: (fn: (s: ConsoleState) => ConsoleState) => void;
}

export function HomeView({ state, setState }: HomeViewProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-display font-bold text-base">Today</div>
        <div className="font-mono text-[11px] text-[#787c86]">Mon 1 Sep · {SELLER_TODAY.length} interactions</div>
      </div>

      <div className="space-y-2">
        {SELLER_TODAY.map((interaction, idx) => (
          <button
            key={interaction.id}
            onClick={() => setState(s => ({ ...s, mode: 'prep', currentDeal: interaction.id }))}
            className={`w-full text-left border border-[#24242e] bg-[#15151c] rounded-xl p-3 hover:border-[#34343f] hover:bg-[#1d1d26] transition-all relative ${
              idx === 0 ? 'border-[#34343f]' : ''
            }`}
          >
            {idx === 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#5bc08d] animate-pulse" />
            )}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] text-[#b7babd]">{interaction.time}</span>
              <span className="font-display font-semibold text-[13.5px] flex-1">{interaction.company}</span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full border border-[#34343f] text-[#b7babd] bg-[#1d1d26]">
                {interaction.stage}
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                interaction.state === 'ready' 
                  ? 'text-[#5bc08d] border-[#5bc08d]/30 bg-[#5bc08d]/10'
                  : 'text-[#e8a33d] border-[#e8a33d]/30 bg-[#e8a33d]/10'
              }`}>
                {interaction.state === 'ready' ? 'Ready' : 'Needs prep'}
              </span>
            </div>
            <div className={`text-xs leading-relaxed ${
              interaction.state === 'prep' ? 'text-[#ff5c5c]' : 'text-[#787c86]'
            }`}>
              {interaction.objective}
            </div>
            <div className="absolute bottom-3 right-3 font-display font-semibold text-[11px] text-[#787c86] group-hover:text-[#f5f6f7]">
              {interaction.state === 'ready' ? 'Open →' : 'Prep →'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { SELLER_TODAY };
