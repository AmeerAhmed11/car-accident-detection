import React from 'react';
import { Maximize2 } from 'lucide-react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const DashboardHeader: React.FC<{ isAutonomous?: boolean }> = ({ isAutonomous = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple pulsing animation for the alert dot using frame interpolation
  const pulseScale = interpolate(
    frame % (fps * 1), // 1 second loop
    [0, fps / 2, fps],
    [1, 1.2, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <header className="h-16 flex items-center justify-between px-6 glassmorphism rounded-xl border border-white/10 shrink-0 shadow-2xl relative bg-zinc-900/60 backdrop-blur-md z-50">
      <div className="flex items-center gap-4">
        <div
          style={{ transform: `scale(${isAutonomous ? pulseScale : 1})` }}
          className={`w-3 h-3 rounded-full ${isAutonomous ? 'bg-brand-red shadow-[0_0_10px_#ef4444]' : 'bg-brand-primary shadow-[0_0_10px_#2e7d32]'}`}
        />
        <div className="flex flex-col">
          <h1 className={`text-2xl font-orbitron font-bold tracking-tighter uppercase leading-none ${isAutonomous ? 'text-brand-red' : 'text-white'}`}>
            VISIONX IRAQ // AEOC-BGD
          </h1>
          <span className="text-[10px] font-orbitron text-zinc-500 uppercase tracking-[0.3em] mt-1">
            Neural Traffic Response Unit
          </span>
        </div>
      </div>

      {/* Tactical Mode Toggle (Dynamic) */}
      <div className="flex items-center gap-4 px-5 py-2 rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
        <span className={`text-[10px] font-orbitron font-bold transition-all duration-500 ${!isAutonomous ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(46,125,50,0.5)]' : 'text-zinc-600'}`}>
          VIGILANCE (NORMAL)
        </span>
        <button className={`group relative w-12 h-6 rounded-full transition-all duration-700 p-1 border ${isAutonomous ? 'bg-brand-red/10 border-brand-red/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-zinc-800 border-white/10'}`}>
          <div
            className="w-4 h-4 rounded-full transition-all duration-700"
            style={{
              transform: isAutonomous ? 'translateX(24px)' : 'translateX(0px)',
              backgroundColor: isAutonomous ? '#ef4444' : '#71717a',
              boxShadow: isAutonomous ? '0 0 15px rgba(239,68,68,0.8)' : 'none'
            }}
          />
        </button>
        <span className={`text-[10px] font-orbitron font-bold transition-all duration-500 ${isAutonomous ? 'text-brand-red drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-600'}`} style={{ opacity: isAutonomous ? pulseScale : 1 }}>
          AUTONOMOUS (AI)
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center bg-zinc-900/40 p-1 rounded-xl border border-white/5 backdrop-blur-md">
        <button className="px-6 py-2 rounded-lg text-[10px] font-orbitron font-bold uppercase tracking-widest transition-all bg-brand-primary text-white shadow-[0_0_10px_rgba(46,125,50,0.5)]">
          Dashboard
        </button>
        <button className="px-6 py-2 rounded-lg text-[10px] font-orbitron font-bold uppercase tracking-widest transition-all text-zinc-500">
          AI Prediction
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-4 items-center border-r border-white/10 pr-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-orbitron text-zinc-500 uppercase">Latency</span>
            <span className="text-sm font-bold font-orbitron text-brand-emerald">14.8ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-orbitron text-zinc-500 uppercase">Edge_Node</span>
            <span className="text-sm font-bold font-orbitron text-zinc-400">0x7F2</span>
          </div>
        </div>
        <button className="p-2 rounded-full transition-colors text-zinc-500">
          <Maximize2 size={20} />
        </button>
        <div className="text-3xl font-orbitron font-bold tracking-widest text-zinc-300 min-w-[140px] text-right">
          14:22:10
        </div>
      </div>
    </header>
  );
};
