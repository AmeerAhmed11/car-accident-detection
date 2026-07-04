import React from 'react';
import { Activity, Car, Cpu, Radio, Zap } from 'lucide-react';

export interface AnalyticsPanelProps {
  speedDropRatio: number;
  networkLoad: number;
  congestionLevel: 'LOW' | 'MODERATE' | 'SEVERE';
  themeColor: string;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  speedDropRatio,
  networkLoad,
  congestionLevel,
  themeColor
}) => {
  const isAlert = themeColor.includes('239'); // Simple heuristic based on RGB for Red

  return (
    <div className={`w-[320px] rounded-2xl glassmorphism border-white/10 overflow-hidden flex flex-col p-4 space-y-4`} style={{ '--local-theme': themeColor } as React.CSSProperties}>
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Activity className="w-5 h-5" style={{ color: themeColor }} />
        <div>
          <h3 className="text-white font-orbitron font-bold tracking-wider text-sm uppercase">City Analytics</h3>
          <p className="text-zinc-500 font-mono text-[10px]">LIVE TELEMETRY FEED</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Speed Drop */}
        <div className="p-3 rounded-xl border relative overflow-hidden" style={{ borderColor: themeColor, backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.1)' : 'rgba(46, 125, 50, 0.1)' }}>
          <div className="flex justify-between items-center mb-2 relative z-10">
            <span className="text-[10px] text-zinc-400 font-orbitron tracking-widest uppercase">Traffic Velocity</span>
            <Car className="w-4 h-4" style={{ color: themeColor }} />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-2xl font-bold font-mono" style={{ color: themeColor }}>-{speedDropRatio.toFixed(0)}%</span>
            <span className="text-xs text-zinc-500 font-mono">from avg</span>
          </div>
          {isAlert && (
            <div className="absolute inset-0 bg-brand-red opacity-10" />
          )}
        </div>

        {/* Network Load */}
        <div className="p-3 rounded-xl border border-white/5 bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-zinc-400 font-orbitron tracking-widest uppercase">IoT Network Load</span>
            <Radio className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
              <div 
                className={`h-full ${networkLoad > 80 ? 'bg-brand-red' : 'bg-brand-emerald'}`} 
                style={{ width: `${networkLoad}%` }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-300">{networkLoad.toFixed(0)}%</span>
          </div>
        </div>

        {/* Node Status */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border border-white/5 bg-black/40 flex flex-col items-center justify-center gap-1">
            <Cpu className="w-4 h-4 text-brand-emerald mb-1" />
            <span className="text-[8px] text-zinc-500 font-orbitron tracking-widest">EDGE COMPUTE</span>
            <span className="text-xs font-mono text-brand-emerald font-bold">OPTIMAL</span>
          </div>
          <div 
            className="p-2 rounded-lg border flex flex-col items-center justify-center gap-1"
            style={{ 
              borderColor: isAlert ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.4)'
            }}
          >
            <Zap className={`w-4 h-4 mb-1 ${isAlert ? 'text-brand-red' : 'text-zinc-400'}`} />
            <span className="text-[8px] text-zinc-500 font-orbitron tracking-widest">CONGESTION</span>
            <span className="text-xs font-mono font-bold" style={{ color: isAlert ? '#ef4444' : '#d4d4d8' }}>
              {congestionLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
