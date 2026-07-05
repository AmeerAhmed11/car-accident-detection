import React from 'react';
import { Shield, Hospital } from 'lucide-react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const TacticalSidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple pulsing animation for the "LIVE" indicator
  const pulseOpacity = interpolate(
    frame % (fps * 1.5),
    [0, (fps * 1.5) / 2, fps * 1.5],
    [1, 0.4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Progress bar animation (loads over 1.5 seconds)
  const progressWidth = interpolate(frame, [0, 45], [0, 85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="w-[480px] shrink-0 flex flex-col gap-4 overflow-y-auto z-50">
      
      {/* Incident Summary Card */}
      <section className="glassmorphism rounded-xl p-5 border-2 border-brand-red/50 bg-brand-red/10 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-orbitron font-bold text-brand-red tracking-widest uppercase">
            Tactical_Incident_Summary
          </span>
          <span
            className="text-sm font-mono text-brand-red font-black"
            style={{ opacity: pulseOpacity }}
          >
            ● LIVE
          </span>
        </div>

        <div className="text-[1.1rem] font-mono space-y-5 mt-2">
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-brand-emerald font-bold">SECTOR:</span>
            <span className="text-brand-red font-black">AL-JADRIYA, BGD</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-brand-emerald font-bold">TYPE:</span>
            <span className="text-brand-red font-black">HIGH-IMPACT COLLISION</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-brand-emerald font-bold">SEVERITY:</span>
            <span className="text-brand-red font-black">LEVEL 4 (CRITICAL)</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-brand-emerald font-bold">ETA_SITE:</span>
            <span className="text-brand-red font-black">3.5 MINUTES</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-brand-emerald font-bold">CAMERA:</span>
            <span className="text-zinc-200 font-bold">CAM_03 // KARRADA INT.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-emerald font-bold">TIMESTAMP:</span>
            <span className="text-zinc-200 font-bold">14:22:10</span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex justify-between text-xs font-orbitron text-zinc-400 font-bold">
            <span>DISTANCE_TO_SITE</span>
            <span className="text-brand-red">4.2 KM</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              style={{ width: `${progressWidth}%` }}
              className="h-full bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            />
          </div>
        </div>
      </section>

      {/* Dispatched Units Card */}
      <section className="glassmorphism rounded-xl p-5 border border-brand-red/30 shadow-2xl">
        <h2 className="text-xs font-orbitron text-brand-red uppercase tracking-widest flex items-center gap-3 mb-5 font-bold">
          <Shield size={16} /> Dispatched Emergency Units
        </h2>
        <div className="space-y-4">
          {[
            { label: 'UNIT_04_AMBULANCE', icon: Hospital, status: 'EN_ROUTE', eta: '3.5 MIN' },
            { label: 'UNIT_07_POLICE', icon: Shield, status: 'DISPATCHED', eta: '5.1 MIN' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-5 rounded-xl border border-brand-red/40 bg-brand-red/5"
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="text-brand-red" />
                <div>
                  <span className="text-xs font-bold font-orbitron tracking-widest text-brand-red block mb-1">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {item.status} // ETA: {item.eta}
                  </span>
                </div>
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full bg-brand-red"
                style={{ opacity: pulseOpacity }}
              />
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};
