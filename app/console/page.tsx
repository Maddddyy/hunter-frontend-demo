'use client';

import { useState, useEffect, useRef } from 'react';
import { ConsolePanel } from '@/components/console/ConsolePanel';
import type { ConsoleState } from '@/components/console/types';

const EMBLEM = (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <path d="M20 3 L34 11 V25 L20 33 L20 20 L8 13 Z" fill="#2C2C36" stroke="#4a4a55"/>
    <path d="M8 13 L20 20 V33 L6 25 V13 Z" fill="#B7BABD"/>
    <path d="M20 20 L34 11 L34 25 L20 33 Z" fill="#33333d"/>
  </svg>
);

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ConsolePage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [consoleState, setConsoleState] = useState<ConsoleState>({
    mode: 'home',
    sensing: false,
    elapsed: 0,
    tipIdx: -1,
    currentDeal: null,
    role: null
  });

  const handleStopSensing = () => {
    setConsoleState(prev => ({
      ...prev,
      sensing: false,
      mode: 'review'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#15151d] via-[#0a0a0e] to-[#08080b] relative overflow-hidden">
      {/* Wallpaper grid effect */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(120% 90% at 60% 40%,#000,transparent 90%)'
        }}
      />

      {/* Faint call mock (only while sensing) */}
      {consoleState.sensing && (
        <div className="absolute left-[5vw] top-[16vh] w-[52vw] max-w-[720px] border border-white/6 rounded-2xl overflow-hidden opacity-20 transition-opacity duration-600">
          <div className="grid grid-cols-2 gap-1.5 bg-black p-1.5">
            {[
              { initials: 'SC', name: 'Sarah Chen · TechCorp', bg: '#3a5a7a' },
              { initials: 'DK', name: 'David Kim · CRO', bg: '#6b4e8c' },
              { initials: 'LG', name: 'Legal · Data protection', bg: '#2f6e63' },
              { initials: 'JD', name: 'You', bg: '#3B5578' }
            ].map((person, idx) => (
              <div 
                key={idx}
                className="aspect-[16/10] bg-gradient-to-br from-[#1b1b24] to-[#0e0e14] rounded-lg grid place-items-center relative"
              >
                <div 
                  className="w-14 h-14 rounded-full grid place-items-center font-display font-bold text-xl text-white"
                  style={{ background: person.bg }}
                >
                  {person.initials}
                </div>
                <div className="absolute bottom-2 left-2.5 font-mono text-[11px] text-[#cfd2d6]">
                  {person.name}
                </div>
              </div>
            ))}
          </div>
          <div className="h-[34px] bg-[#0b0b0f] flex items-center justify-center gap-3.5 text-[#6a6e77]">
            <div className="w-[26px] h-[26px] rounded-full bg-[#1a1a22]" />
            <div className="w-[26px] h-[26px] rounded-full bg-[#1a1a22]" />
            <div className="w-[26px] h-[26px] rounded-full bg-[#1a1a22]" />
            <div className="w-[26px] h-[26px] rounded-full bg-[#3a1414]" />
          </div>
        </div>
      )}

      {/* Hint text */}
      <div className="fixed right-[6vw] bottom-[9vh] font-mono text-[11px] text-[#2c2c36] uppercase tracking-[0.1em]">
        Piloteer runs beside whatever you're selling in
      </div>

      {/* Menu bar */}
      <div className="fixed top-0 left-0 right-0 h-[30px] z-40 bg-[#0a0a0d]/70 backdrop-blur-xl border-b border-white/5 flex items-center px-3.5 gap-4">
        <span className="font-display font-bold text-xs text-[#e9eaec]">Piloteer</span>
        <span className="text-xs text-[#9a9ea6]">File</span>
        <span className="text-xs text-[#9a9ea6]">Session</span>
        <span className="text-xs text-[#9a9ea6]">View</span>
        <div className="flex-1" />
        
        {/* Anchor button */}
        <button 
          onClick={() => {
            if (consoleState.sensing) {
              handleStopSensing();
            } else {
              setIsPanelOpen(!isPanelOpen);
            }
          }}
          className={`flex items-center gap-2 border rounded-lg px-2 py-1 transition-all ${
            consoleState.sensing 
              ? 'border-[#ff5c5c]/30 bg-[#ff5c5c]/8'
              : 'border-[#34343f] bg-[#1c1c24]/90 hover:border-[#43434f] hover:bg-[#20202a]'
          }`}
        >
          {consoleState.sensing ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c5c] animate-pulse" />
              <span className="font-mono text-xs text-[#ff5c5c] tabular-nums min-w-[42px]">
                {formatTime(consoleState.elapsed)}
              </span>
              <span className="font-display font-semibold text-[11px] text-[#ff5c5c] border-l border-[#ff5c5c]/30 pl-2">
                Stop
              </span>
            </>
          ) : (
            <>
              <div className="w-4 h-4">{EMBLEM}</div>
              <span className="font-display font-semibold text-xs">Hunter</span>
              <span className="text-[10px] text-[#787c86]">▾ Prepare My Day</span>
            </>
          )}
        </button>

        <span className="font-mono text-[11px] text-[#8b8f97]">9:41</span>
      </div>

      {/* Console Panel */}
      <ConsolePanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)}
        state={consoleState}
        setState={setConsoleState}
      />
    </div>
  );
}
