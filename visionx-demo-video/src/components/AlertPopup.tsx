import React from 'react';
import { Video, staticFile } from 'remotion';
import { AlertTriangle } from 'lucide-react';

export const AlertPopup: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col font-sans text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-zinc-900/50">
        <AlertTriangle size={18} className="text-red-500" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <span className="text-[10px] font-bold tracking-[0.1em] text-zinc-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          INCIDENT_DETECTION_CARD // CAM_03
        </span>
      </div>
      
      {/* Body */}
      <div className="p-6 space-y-6 flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-black rounded-xl border border-white/5 overflow-hidden relative" style={{ height: '260px' }}>
          <Video 
            src={staticFile('Incident_Alpha_Detection.mp4')} 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-[10px] font-bold rounded" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            LOOP_EVIDENCE
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Manual Intervention Required
          </h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[90%]">
            VisionX AI has detected a high-impact collision at Sector 07. Supervisor verification is required to initiate tactical response protocols.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="py-3 bg-emerald-600 text-white font-bold text-[11px] rounded-lg tracking-widest uppercase text-center flex items-center justify-center" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Approve Intervention
          </div>
          <div className="py-3 bg-zinc-800 text-zinc-400 font-bold text-[11px] rounded-lg tracking-widest uppercase text-center flex items-center justify-center" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Ignore / False Alarm
          </div>
        </div>
      </div>
    </div>
  );
};
