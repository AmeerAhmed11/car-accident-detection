import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile, Video, Audio, Sequence } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { AnimatedCursor } from '../components/AnimatedCursor';
import { AlertPopup } from '../components/AlertPopup';
import { DashboardHeader } from '../components/DashboardHeader';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { TacticalSidebar } from '../components/TacticalSidebar';

import { useCinematicCamera } from '../hooks/useCinematicCamera';

// Reduced duration since Map was moved to Scene 3
const DURATION = 320; // frames 391–840

// Cursor path keyframes (relative to scene start)
const CURSOR_PATH = [
  { frame: 0, x: 960, y: 1080 },    // Start below screen
  { frame: 60, x: 700, y: 400 },    // Move up
  { frame: 120, x: 640, y: 70 },    // Navigate to header toggle (VIGILANCE / AUTONOMOUS)
  { frame: 130, x: 640, y: 70 },    // Hover on toggle
  { frame: 140, x: 640, y: 70 },    // Click position
  { frame: 180, x: 960, y: 400 },   // Move toward center as alert appears
  { frame: 250, x: 830, y: 760 },   // Navigate to "Approve Intervention" button
  { frame: 280, x: 830, y: 760 },   // Click position
  { frame: 320, x: 960, y: 1200 },  // Move away off-screen
];

const CLICK_FRAMES = [140, 280];

export const Scene2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cinematic 3D Camera Movements using the new physics-based hook
  const { transform: cameraTransform } = useCinematicCamera({
    baseScale: 1.05,
    focuses: [
      {
        startFrame: 60,
        endFrame: 150,
        scaleDelta: 0.15,
        rotateXDelta: -2,
        rotateYDelta: 2,
        xDelta: 100,
        yDelta: 220,
      },
      {
        startFrame: 160,
        endFrame: 280,
        scaleDelta: 0.1,
        rotateXDelta: 4,
        rotateYDelta: -2,
        xDelta: -30,
        yDelta: -120,
      },
    ],
  });

  // Dashboard enters with scale
  const dashboardScale = spring({
    frame,
    fps,
    from: 0.95,
    to: 1,
    config: { damping: 20, mass: 1 },
  });

  // Alert appears after "click" at frame 140
  const alertEnter = spring({
    frame: frame - 155,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const alertOpacity = interpolate(alertEnter, [0, 1], [0, 1]);
  const alertScale = interpolate(alertEnter, [0, 1], [0.8, 1]);


  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19', perspective: 1200 }}>
        {/* Main Dashboard Container */}
        <AbsoluteFill
          style={{
            transform: `scale(${dashboardScale}) ${cameraTransform}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative'
          }}>
            {/* Real Dashboard UI Components */}
            <div className="absolute inset-0 flex flex-col p-4 gap-4 bg-[#0B0F19] text-white font-inter">
              <DashboardHeader isAutonomous={frame >= 140} />
              <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
                {/* Left Panel: Analytics */}
                <div className="col-span-3 flex flex-col gap-4 h-full">
                  <AnalyticsPanel 
                    speedDropRatio={frame >= 140 ? 68 : 24}
                    networkLoad={frame >= 140 ? 88 : 42}
                    congestionLevel={frame >= 140 ? "SEVERE" : "LOW"}
                    themeColor={frame >= 140 ? "rgba(239, 68, 68, 1)" : "rgba(46, 125, 50, 1)"}
                  />
                </div>

                {/* Center Panel: Main View (Video Feeds) */}
                <div 
                  className="col-span-6 flex flex-col gap-4 h-full relative"
                  style={{ opacity: interpolate(frame, [280, 290], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}
                >
                  <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 relative">
                    <Video src={staticFile('Feed_01_Normal_Monitoring.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <Video src={staticFile('Node_02_Strategic_Urban_Flow.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <Video src={staticFile('Incident_Alpha_Detection.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <Video src={staticFile('Node_04_High_Density_Monitoring.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                </div>

                {/* Right Panel: Tactical Feed */}
                <div className="col-span-3 flex flex-col gap-4 h-full">
                  <TacticalSidebar />
                </div>
              </div>
            </div>



            {/* Infrastructure Status Panel (Springs in at frame 140) */}
            {(() => {
              const statusEnter = spring({
                frame: frame - 140,
                fps,
                config: { damping: 14, mass: 1 },
              });

              return (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    transform: `translateY(${interpolate(statusEnter, [0, 1], [40, 0])}px)`,
                    opacity: interpolate(statusEnter, [0, 1], [0, 1]),
                    zIndex: 40,
                  }}
                  className="bg-black/60 border border-brand-primary/50 p-6 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="w-2 h-2 rounded-full bg-brand-emerald shadow-[0_0_8px_#10b981]" />
                    <h3 className="font-orbitron font-bold text-white text-sm tracking-widest uppercase">
                      Infrastructure Status
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-3 font-mono text-xs">
                    <div className="flex justify-between items-center gap-8">
                      <span className="text-zinc-400">NETWORK</span>
                      <span className="text-brand-primary font-bold">EXISTING CCTV</span>
                    </div>
                    <div className="flex justify-between items-center gap-8">
                      <span className="text-zinc-400">HARDWARE REQ</span>
                      <span className="text-brand-primary font-bold">NONE</span>
                    </div>
                    <div className="flex justify-between items-center gap-8">
                      <span className="text-zinc-400">DEPLOYMENT COST</span>
                      <span className="text-brand-emerald font-bold text-sm">$0.00</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Alert Pop-up Overlay (Springs in at frame 155, fades out at frame 280) */}
            {frame >= 155 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${alertScale})`,
                  opacity: alertOpacity * interpolate(frame, [275, 285], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  zIndex: 50,
                  width: 600, 
                  height: 'auto', // Changed to auto to fit content naturally
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 0 60px rgba(239, 68, 68, 0.4), 0 0 120px rgba(239, 68, 68, 0.2)',
                }}
              >
                <AlertPopup />
              </div>
            )}
            
            {/* Animated Cursor (Now inside the 3D container to stay aligned) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <AnimatedCursor path={CURSOR_PATH} clickFrames={CLICK_FRAMES} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Sound Effects for Camera Zooms */}
      <Sequence from={125}>
        <Audio src={staticFile('zoom-whoosh.mp3')} volume={1.0} />
      </Sequence>
      <Sequence from={260}>
        <Audio src={staticFile('zoom-whoosh.mp3')} volume={1.0} />
      </Sequence>

      {/* Mouse Click Sound Effects */}
      <Sequence from={140}>
        <Audio src={staticFile('mouse-click.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={280}>
        <Audio src={staticFile('mouse-click.mp3')} volume={0.8} />
      </Sequence>
    </SceneTransition>
  );
};
