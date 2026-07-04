import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface HUDOverlayProps {
  themeColor: string; // e.g., 'rgba(46, 125, 50, 1)' or 'rgba(239, 68, 68, 1)'
  isAutoMode: boolean;
  coords: { lat: string; lng: string };
  timeString?: string;
  cameraId?: string;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({ 
  themeColor, 
  isAutoMode, 
  coords,
  timeString = '14:32:05',
  cameraId = '04'
}) => {
  const frame = useCurrentFrame();
  const scanlinePos = (frame % 240) / 240; // 4 seconds at 60fps
  const targetLockOpacity = themeColor.includes('239') ? 1 : 0.4;
  const isAlert = themeColor.includes('239'); // Simple heuristic for text

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden font-orbitron select-none z-20"
      style={{ color: themeColor }}
    >
      {/* Laser Scanline Sweep */}
      <div
        style={{ top: `${scanlinePos * 120 - 10}%`, backgroundColor: themeColor }}
        className="absolute left-0 right-0 h-[1px] opacity-40 shadow-[0_0_10px_currentColor]"
      />

      {/* Static Technical Grid */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Corner Data Readouts */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 p-2 bg-black/20 backdrop-blur-sm rounded border border-white/5">
        <div className="text-[9px] tracking-[0.2em] opacity-80">CH_{cameraId} // GRID_SEC_BAGHDAD</div>
        <div className="text-[12px] font-bold">GPS: {coords.lat} N, {coords.lng} E</div>
        {/* Tactical Mode Status */}
        <div className="text-[8px] font-bold mt-1 tracking-[0.2em] flex items-center gap-2 opacity-80">
          <div 
            className="w-1 h-1 rounded-full" 
            style={{ 
              backgroundColor: isAutoMode ? '#ef4444' : '#2e7d32', 
              boxShadow: isAutoMode ? '0 0 5px rgba(239,68,68,0.8)' : 'none' 
            }} 
          />
          SYSTEM: {isAutoMode ? 'ACTIVE' : 'STANDBY'}
        </div>
      </div>

      <div className="absolute top-4 right-4 text-right flex flex-col gap-1 p-2 bg-black/20 backdrop-blur-sm rounded border border-white/5">
        <div 
          className="text-[10px] tracking-widest font-bold"
          style={{ opacity: 0.5 + Math.sin(frame * 0.1) * 0.5 }}
        >
          ● STATUS: {isAlert ? 'INCIDENT_LOCK' : 'SCANNING'}
        </div>
        <div className="text-[9px] opacity-60">ENCRYPTED_LINK: ACTIVE</div>
      </div>

      {/* Central Target Lock — solid, non-moving frame */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
        <div className="relative w-full h-full" style={{ opacity: targetLockOpacity }}>
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: themeColor }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: themeColor }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: themeColor }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
        </div>
      </div>

      {/* Bottom Technical Logs */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end px-2">
        <div className="text-[8px] opacity-40 leading-tight tracking-wider">
          STREAM_SIG // VX_404 <br />
          NODE // AL_NAHRAIN_AEOC
        </div>
        <div className="text-[10px] font-bold tracking-widest">
          {timeString}
        </div>
      </div>
    </div>
  );
};
