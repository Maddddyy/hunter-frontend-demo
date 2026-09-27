'use client';

import { useState, useEffect } from 'react';
import { ConsoleMode, ConsoleState } from './types';
import { HomeView } from './views/HomeView';
import { PrepView } from './views/PrepView';
import { SensingView } from './views/SensingView';
import { ReviewView } from './views/ReviewView';

const EMBLEM = (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <path d="M20 3 L34 11 V25 L20 33 L20 20 L8 13 Z" fill="#2C2C36" stroke="#4a4a55"/>
    <path d="M8 13 L20 20 V33 L6 25 V13 Z" fill="#B7BABD"/>
    <path d="M20 20 L34 11 L34 25 L20 33 Z" fill="#33333d"/>
  </svg>
);

interface ConsolePanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialState?: Partial<ConsoleState>;
}

export function ConsolePanel({ isOpen, onClose, initialState }: ConsolePanelProps) {
  const [state, setState] = useState<ConsoleState>({
    mode: 'home',
    sensing: false,
    elapsed: 0,
    tipIdx: -1,
    currentDeal: null,
    role: null,
    ...initialState
  });

  // Timer for sensing mode
  useEffect(() => {
    if (!state.sensing) return;
    const interval = setInterval(() => {
      setState(s => ({ ...s, elapsed: s.elapsed + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.sensing]);

  if (!isOpen) return null;

  const handleBack = () => setState(s => ({ ...s, mode: 'home' }));
  const handleStartSensing = () => setState(s => ({ ...s, sensing: true, mode: 'home' }));
  const handleStopSensing = () => setState(s => ({ ...s, sensing: false, mode: 'review' }));

  return (
    <div className="fixed top-10 right-4 w-[400px] z-[42] animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-b from-[#101015] to-[#0c0c11] border border-[#34343f] rounded-2xl shadow-2xl overflow-hidden">
        {/* Panel Head */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#24242e]">
          <div className="w-6 h-6 flex-shrink-0">{EMBLEM}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm">
              {state.sensing ? 'Live Guidance' : 'Hunter'}
            </div>
            <div className="font-mono text-[10px] text-[#787c86] uppercase tracking-wider">
              {state.sensing ? 'Sensing buyer & seller' : 'Prepare My Day'}
            </div>
          </div>
          {state.sensing && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#5bc08d]/10 border border-[#5bc08d]/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5bc08d]" />
              <span className="font-mono text-[10px] text-[#5bc08d]">Connected</span>
            </div>
          )}
        </div>

        {/* Panel Body */}
        <div className="max-h-[70vh] overflow-y-auto console-scroll">
          {state.sensing ? (
            <SensingView state={state} setState={setState} />
          ) : state.mode === 'home' ? (
            <HomeView state={state} setState={setState} />
          ) : state.mode === 'prep' ? (
            <PrepView state={state} setState={setState} onBack={handleBack} onStartSensing={handleStartSensing} />
          ) : state.mode === 'review' ? (
            <ReviewView state={state} setState={setState} onBack={handleBack} />
          ) : null}
        </div>

        {/* Toolbar */}
        {!state.sensing && (
          <div className="flex items-center gap-2 px-3 py-2.5 border-t border-[#24242e] bg-black/25">
            <div className="flex-1 flex items-center gap-2 bg-[#15151c] border border-[#24242e] rounded-lg px-3 py-2">
              <svg className="w-3 h-3 text-[#787c86]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/>
                <path d="m21 21-4-4"/>
              </svg>
              <input 
                placeholder="Search deals or contacts…" 
                className="flex-1 bg-transparent border-none outline-none text-xs text-[#f5f6f7] placeholder:text-[#787c86]"
              />
            </div>
            <button className="w-9 h-9 flex items-center justify-center bg-[#15151c] border border-[#24242e] rounded-lg text-[#b7babd] hover:bg-[#1d1d26] hover:text-[#f5f6f7] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-[#15151c] border border-[#24242e] rounded-lg text-[#b7babd] hover:bg-[#1d1d26] hover:text-[#f5f6f7] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.6"/>
                <circle cx="12" cy="12" r="1.6"/>
                <circle cx="12" cy="19" r="1.6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
