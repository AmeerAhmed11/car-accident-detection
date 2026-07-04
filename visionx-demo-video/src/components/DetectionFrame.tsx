import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DetectionFrameProps {
  progress: number; // 0 to 1
  confidenceScore: number;
}

export const DetectionFrame: React.FC<DetectionFrameProps> = ({
  progress,
  confidenceScore
}) => {
  const frame = useCurrentFrame();
  const showDetection = progress > 0.05;
  const pulseOpacity = 0.5 + Math.sin(frame * 0.2) * 0.5;

  return (
    <div className="relative w-full h-full max-w-4xl aspect-video rounded-3xl overflow-hidden border-2 border-white/25 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_40px_rgba(239,68,68,0.15)] flex items-center justify-center bg-black">
      {/* Fallback pattern */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} 
      />
      <span className="text-zinc-600 font-mono tracking-widest">VIDEO_FEED_HOLDER</span>

      {showDetection && (
        <div
          style={{
            opacity: progress,
            transform: `scale(${1.3 - (progress * 0.3)})`, // scales from 1.3 to 1.0 based on progress
          }}
          className="absolute top-[25%] left-[30%] w-[40%] h-[45%] border-[3px] border-red-500 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.6)]"
        >
          <div className="absolute -top-8 left-0 px-4 py-1.5 bg-red-600 rounded-lg text-sm font-orbitron font-bold text-white tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)] whitespace-nowrap">
            CRASH DETECTED — {confidenceScore.toFixed(1)}%
          </div>
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-red-400" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-red-400" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-red-400" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-red-400" />
        </div>
      )}

      {/* Live tag */}
      <div 
        className="absolute top-4 left-4 px-4 py-1.5 bg-red-600 rounded-lg text-sm font-orbitron font-bold text-white tracking-wider shadow-lg"
        style={{ opacity: 0.5 + (pulseOpacity * 0.5) }}
      >
        ● LIVE — CAM_03
      </div>
    </div>
  );
};
