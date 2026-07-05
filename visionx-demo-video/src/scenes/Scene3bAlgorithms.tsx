import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';

const DURATION = 300;

export const Scene3bAlgorithms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const headerEnter = spring({ frame, fps, config: { damping: 14, mass: 1 } });
  
  // All boxes appear at the beginning
  const boxesEnter = spring({ frame: frame - 15, fps, config: { damping: 14, mass: 1 } });
  
  const statusEnter = spring({ frame: frame - 250, fps, config: { damping: 12, mass: 0.8, stiffness: 150 } });

  // Camera Pan and Zoom effect
  const cameraScale = interpolate(
    frame,
    [25, 38, 100, 116, 183, 200, 258, 275],
    [ 1, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1 ],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraX = interpolate(
    frame,
    [25, 38, 100, 116, 183, 200, 258, 275],
    [ 0,  420, 420,   0,   0,-420,-420,  0 ],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={15}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19', fontFamily: 'Inter, sans-serif' }}>
        <div className="w-full h-full p-16 flex flex-col items-center justify-center relative">
          
          {/* Header */}
          <div 
            className="absolute top-24 flex flex-col items-center"
            style={{ 
              opacity: interpolate(headerEnter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(headerEnter, [0, 1], [-20, 0])})`
            }}
          >
            <h1 className="text-4xl font-orbitron font-bold text-white tracking-widest uppercase text-center leading-tight">
              Triple-Verification Pipeline
            </h1>
            <div className="w-64 h-1 mt-4 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          </div>

          {/* Grid for the 3 algorithms */}
          <div 
            className="w-full max-w-7xl grid grid-cols-3 gap-8 mt-12"
            style={{
              transform: `translateX(${cameraX}px) scale(${cameraScale})`,
            }}
          >
            
            {/* Algorithm 1: Vector Direction */}
            <div 
              className="flex flex-col gap-6 glassmorphism p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-black/40"
              style={{
                opacity: interpolate(boxesEnter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(boxesEnter, [0, 1], [0.95, 1])})`
              }}
            >
              <div className="text-[10px] text-brand-primary font-orbitron tracking-[0.3em] uppercase">Algorithm 01</div>
              <h2 className="text-2xl font-bold text-white leading-tight">Vector Direction Check</h2>
              <p className="text-sm text-zinc-400">Verifying if vehicle trajectories physically intersect post-detection.</p>
              
              {/* Visual representation */}
              <div className="h-32 mt-4 bg-black/60 rounded-xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                {frame > 25 && (
                  <div className="flex gap-4">
                    <div 
                      className="w-16 h-1 bg-brand-red rounded-full shadow-[0_0_10px_#ef4444]"
                      style={{ 
                        transformOrigin: 'right',
                        transform: `rotate(45deg) scaleX(${interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` 
                      }} 
                    />
                    <div 
                      className="w-16 h-1 bg-brand-emerald rounded-full shadow-[0_0_10px_#10b981]"
                      style={{ 
                        transformOrigin: 'left',
                        transform: `rotate(-45deg) scaleX(${interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` 
                      }} 
                    />
                  </div>
                )}
              </div>
              
              <div className="absolute top-8 right-8 text-xs font-mono text-zinc-500">
                {frame > 75 ? <span className="text-brand-emerald font-bold">VERIFIED</span> : 'ANALYZING...'}
              </div>
            </div>

            {/* Algorithm 2: Speed Check */}
            <div 
              className="flex flex-col gap-6 glassmorphism p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-black/40"
              style={{
                opacity: interpolate(boxesEnter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(boxesEnter, [0, 1], [0.95, 1])})`
              }}
            >
              <div className="text-[10px] text-brand-primary font-orbitron tracking-[0.3em] uppercase">Algorithm 02</div>
              <h2 className="text-2xl font-bold text-white leading-tight">Velocity Drop Analysis</h2>
              <p className="text-sm text-zinc-400">Monitoring for abrupt drops to zero speed across a small time frame.</p>
              
              {/* Visual representation */}
              <div className="h-32 mt-4 bg-black/60 rounded-xl border border-white/5 relative flex items-end p-4">
                 <div className="w-full flex items-end gap-1 h-full opacity-80">
                    {new Array(15).fill(0).map((_, i) => {
                      const barHeight = frame < 125 + (i*2) ? 80 : (i > 8 ? 5 : 80);
                      return (
                        <div key={i} className="flex-1 bg-brand-emerald transition-all duration-300 rounded-t-sm" style={{ height: `${barHeight}%` }} />
                      );
                    })}
                 </div>
              </div>
              
              <div className="absolute top-8 right-8 text-xs font-mono text-zinc-500">
                {frame > 155 ? <span className="text-brand-emerald font-bold">VERIFIED</span> : 'ANALYZING...'}
              </div>
            </div>

            {/* Algorithm 3: Temporal Consistency */}
            <div 
              className="flex flex-col gap-6 glassmorphism p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-black/40"
              style={{
                opacity: interpolate(boxesEnter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(boxesEnter, [0, 1], [0.95, 1])})`
              }}
            >
              <div className="text-[10px] text-brand-primary font-orbitron tracking-[0.3em] uppercase">Algorithm 03</div>
              <h2 className="text-2xl font-bold text-white leading-tight">Frame Persistence</h2>
              <p className="text-sm text-zinc-400">Ensuring the AI model detects the anomaly across 30 consecutive frames.</p>
              
              {/* Visual representation */}
              <div className="h-32 mt-4 bg-black/60 rounded-xl border border-white/5 relative flex flex-col justify-center px-8 gap-4">
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-emerald shadow-[0_0_10px_#10b981]"
                    style={{ width: `${interpolate(frame, [200, 240], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%` }}
                  />
                </div>
                <div className="text-center font-orbitron text-xs text-white tracking-widest">
                  {Math.round(interpolate(frame, [200, 240], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))} / 30 FRAMES
                </div>
              </div>

              <div className="absolute top-8 right-8 text-xs font-mono text-zinc-500">
                {frame > 240 ? <span className="text-brand-emerald font-bold">VERIFIED</span> : 'ANALYZING...'}
              </div>
            </div>

          </div>

          {/* Final Validation Status */}
          <div 
            className="absolute bottom-16 bg-brand-emerald/10 border border-brand-emerald/40 px-12 py-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl"
            style={{
              opacity: interpolate(statusEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(statusEnter, [0, 1], [0.8, 1])})`
            }}
          >
            <div className="text-brand-emerald font-orbitron font-bold text-2xl tracking-[0.5em] uppercase">
              STATUS: ALARM VALIDATED
            </div>
          </div>

        </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
