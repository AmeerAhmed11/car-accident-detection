'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';

export const HUDOverlay = () => {
  const { mode } = useTheme();
  const [coords, setCoords] = useState({ lat: '33.3152', lng: '44.3661' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        lat: (33.3152 + (Math.random() - 0.5) * 0.001).toFixed(4),
        lng: (44.3661 + (Math.random() - 0.5) * 0.001).toFixed(4),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colorClass = mode === 'alert' ? 'text-brand-red' : 'text-brand-emerald';
  const borderClass = mode === 'alert' ? 'border-brand-red' : 'border-brand-emerald';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-orbitron select-none z-20">
      {/* Laser Scanline Sweep */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className={`absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${colorClass}`}
      />

      {/* Static Technical Grid */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          color: mode === 'alert' ? '#ef4444' : '#2e7d32'
        }} 
      />

      {/* Corner Data Readouts */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 p-2 bg-black/20 backdrop-blur-sm rounded border border-white/5">
        <div className={`text-[9px] tracking-[0.2em] opacity-80 ${colorClass}`}>CH_04 // GRID_SEC_BAGHDAD</div>
        <div className={`text-[12px] font-bold ${colorClass}`}>GPS: {coords.lat} N, {coords.lng} E</div>
      </div>

      <div className="absolute top-4 right-4 text-right flex flex-col gap-1 p-2 bg-black/20 backdrop-blur-sm rounded border border-white/5">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-[10px] tracking-widest font-bold ${colorClass}`}
        >
          ● STATUS: {mode === 'alert' ? 'INCIDENT_LOCK' : 'SCANNING'}
        </motion.div>
        <div className={`text-[9px] opacity-60 ${colorClass}`}>ENCRYPTED_LINK: ACTIVE</div>
      </div>

      {/* Central Target Lock */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-full h-full"
        >
          <div className={`absolute top-0 left-0 w-6 h-6 border-t border-l ${borderClass}`} />
          <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r ${borderClass}`} />
          <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l ${borderClass}`} />
          <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r ${borderClass}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${mode === 'alert' ? 'bg-brand-red' : 'bg-brand-emerald'}`} />
        </motion.div>
      </div>

      {/* Bottom Technical Logs */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end px-2">
        <div className={`text-[8px] opacity-40 leading-tight tracking-wider ${colorClass}`}>
          STREAM_SIG // VX_{Math.floor(Math.random() * 900) + 100} <br />
          NODE // AL_NAHRAIN_AEOC
        </div>
        <div className={`text-[10px] font-bold tracking-widest ${colorClass}`}>
          {new Date().toLocaleTimeString([], { hour12: false })}
        </div>
      </div>
    </div>
  );
};
