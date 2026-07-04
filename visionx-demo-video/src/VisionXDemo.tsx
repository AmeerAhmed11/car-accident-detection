import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { DetectionFrame } from './components/DetectionFrame';
import { HUDOverlay } from './components/HUDOverlay';
import { IncidentReportCard } from './components/IncidentReportCard';

export const VisionXDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase Theme Color Interpolation (Green -> Red at frame 301)
  const themeColor = interpolateColors(
    frame,
    [300, 330],
    ['rgba(46, 125, 50, 1)', 'rgba(239, 68, 68, 1)']
  );

  // Phase 2: Accident Event Data
  const speedDropRatio = interpolate(
    frame,
    [301, 360],
    [60, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const detectionProgress = spring({
    frame: frame - 301,
    fps,
    config: { damping: 15, mass: 0.5 }
  });

  // Phase 3: Operational Dispatch Camera Pan
  const camScale = spring({
    frame: frame - 1201,
    fps,
    from: 1,
    to: 1.15,
    config: { damping: 20, mass: 1 }
  });

  const camX = spring({
    frame: frame - 1201,
    fps,
    from: 0,
    to: -300, // Pan right to focus on the card which will be on the right side
    config: { damping: 20, mass: 1 }
  });

  const camY = spring({
    frame: frame - 1201,
    fps,
    from: 0,
    to: 100,
    config: { damping: 20, mass: 1 }
  });

  return (
    <AbsoluteFill className="bg-zinc-950 font-inter text-white overflow-hidden">
      {/* Audio Placeholder for Arabic Voiceover */}
      {/* <Audio src={staticFile("audio.mp3")} /> */}

      {/* Global Camera Wrapper */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translateX(${camX}px) translateY(${camY}px)`,
          transformOrigin: 'center right',
        }}
      >
        {/* Background Base */}
        <AbsoluteFill className="opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black" />
        </AbsoluteFill>

        {/* Center: Detection Video Feed */}
        <div className="absolute inset-0 flex items-center justify-center p-20">
          <DetectionFrame progress={detectionProgress} confidenceScore={98.4} />
        </div>

        {/* Overlays */}
        <AbsoluteFill>
          <HUDOverlay
            themeColor={themeColor}
            isAutoMode={frame > 301}
            coords={{ lat: '33.3152', lng: '44.3661' }}
          />
        </AbsoluteFill>

        {/* Left Side: Telemetry Panel */}
        <div className="absolute top-24 left-8 z-30">
          <AnalyticsPanel
            themeColor={themeColor}
            speedDropRatio={speedDropRatio}
            networkLoad={interpolate(frame, [301, 330], [45, 92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            congestionLevel={frame > 301 ? 'SEVERE' : 'LOW'}
          />
        </div>

        {/* Right Side: Incident Report Card (Phase 3) */}
        <Sequence from={1201} className="z-40">
          <div className="absolute top-24 right-8">
            <IncidentReportCard
              incidentStatus="detected"
              confidenceScore={98.4}
              eta="04:12 MIN"
            />
          </div>
        </Sequence>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
