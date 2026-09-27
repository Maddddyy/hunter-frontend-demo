export type ConsoleMode = 'home' | 'prep' | 'review';

export interface ConsoleState {
  mode: ConsoleMode;
  sensing: boolean;
  elapsed: number;
  tipIdx: number;
  currentDeal: string | null;
  role: number | null;
  draftsDone?: Set<number>;
}

export interface Interaction {
  id: string;
  time: string;
  company: string;
  type: string;
  stage: string;
  objective: string;
  state: 'ready' | 'prep' | 'draft';
  knows?: Record<string, string>;
  recs?: Record<string, string>;
  people?: Array<[string, string, string, string]>;
}

export interface LiveTip {
  cat: string;
  type: 'MOVE' | 'AWARENESS';
  accent: string;
  move: string;
  body: string;
  sig: Array<number | string>;
}
