import { Clock, MapPin, Navigation, ShieldAlert } from 'lucide-react';
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface IncidentReportCardProps {
  incidentStatus: 'detected' | 'approved' | 'ignored';
  confidenceScore: number;
  eta: string;
}

export const IncidentReportCard: React.FC<IncidentReportCardProps> = ({
  incidentStatus,
  confidenceScore,
  eta
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (incidentStatus === 'ignored') {
    return null;
  }

  const isApproved = incidentStatus === 'approved';

  // Entry animation for the whole card
  const cardScale = spring({ frame, fps, config: { damping: 15, mass: 0.5 }, from: 0.95, to: 1 });
  const cardOpacity = spring({ frame, fps, config: { damping: 15, mass: 0.5 }, from: 0, to: 1 });
  const cardX = spring({ frame, fps, config: { damping: 15, mass: 0.5 }, from: 50, to: 0 });

  // Staggered list element animations
  const row1Opacity = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const row2Opacity = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const row3Opacity = spring({ frame: frame - 30, fps, config: { damping: 15 } });

  const confBarWidth = interpolate(spring({ frame: frame - 15, fps, config: { damping: 20 } }), [0, 1], [0, confidenceScore]);

  // Shield rotation
  const shieldRot = isApproved ? 0 : Math.sin(frame * 0.1) * 15;
  const pulseOpacity = 0.3 + Math.sin(frame * 0.1) * 0.3;

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateX(${cardX}px) scale(${cardScale})`
      }}
      className="w-[420px] rounded-2xl glassmorphism border-brand-red/40 overflow-hidden flex flex-col glow-red"
    >
      {/* Header */}
      <div className="bg-brand-red/20 border-b border-brand-red/30 p-4 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 hud-scanline opacity-20" />
        <div style={{ transform: `rotate(${shieldRot}deg)` }}>
          <ShieldAlert className="text-brand-red w-7 h-7" />
        </div>
        <div>
          <h2 className="text-brand-red font-orbitron font-bold tracking-widest text-sm uppercase">
            Incident Detected
          </h2>
          <p className="text-zinc-400 font-mono text-[10px]">
            ID: COL-9482-BGD // 14:32:05
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 space-y-5 bg-black/40">
        <div style={{ opacity: row1Opacity, transform: `translateY(${10 - row1Opacity * 10}px)` }} className="flex gap-4">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] text-zinc-500 font-orbitron tracking-widest uppercase block">Confidence</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-brand-red font-bold font-mono">{confidenceScore}%</span>
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${confBarWidth}%` }}
                  className="h-full bg-brand-red" 
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ opacity: row2Opacity, transform: `translateY(${10 - row2Opacity * 10}px)` }} className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
            <div>
              <span className="text-[9px] text-zinc-500 font-orbitron tracking-widest block mb-1">LOCATION</span>
              <span className="text-xs text-white font-mono">SECTOR_07</span>
            </div>
          </div>
          <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-3 flex items-start gap-2 relative overflow-hidden">
            <div 
              style={{ opacity: pulseOpacity }} 
              className="absolute inset-0 bg-brand-red/10" 
            />
            <Navigation className="w-4 h-4 text-brand-red mt-0.5 relative z-10" />
            <div className="relative z-10">
              <span className="text-[9px] text-brand-red/70 font-orbitron tracking-widest block mb-1">AI ROUTING</span>
              <span className="text-xs text-brand-red font-bold font-mono">DIJKSTRA_OPT</span>
            </div>
          </div>
        </div>

        <div style={{ opacity: row3Opacity, transform: `translateY(${10 - row3Opacity * 10}px)` }} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono">Est. First Responder ETA</span>
          </div>
          <span className="text-amber-400 font-bold font-mono text-sm">{eta}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 flex gap-3 bg-black/60">
        <div className={`flex-1 py-3 px-4 rounded-xl font-orbitron text-xs font-bold tracking-wider text-center ${
            isApproved 
              ? 'bg-brand-red/20 border-brand-red text-brand-red opacity-50' 
              : 'bg-brand-red hover:bg-brand-red/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
          }`}
        >
          {isApproved ? 'INTERVENTION APPROVED' : 'APPROVE INTERVENTION'}
        </div>
      </div>
    </div>
  );
};
