import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { useCinematicCamera } from '../hooks/useCinematicCamera';

const CRISIS_IMAGES = [
  staticFile('10google2-jumbo.png'),
  staticFile('Accident.png'),
  staticFile('Ohio-Driver-Pileup.png'),
  staticFile('ctc-l-waymo-self-driving-taxis-17.png'),
  staticFile('dec_the-best-defense-preparing-to-share-the-road-with-self-driving-cars.png'),
  staticFile('e45fa75fb7b34684937bc84c10496906.png'),
  staticFile('glenmore-tr-crash.png'),
  staticFile('imagessssss.png'),
  staticFile('original.png'),
];

const STATS = [
  { text: '11,500', sub: 'Traffic Accidents Annually', delay: 90 },
  { text: '3,000', sub: 'Fatalities on National Roads', delay: 170 },
  { text: '5–10 Min', sub: 'Traditional Notification Delay', delay: 250 },
];

const DURATION = 390;

export const Scene1Crisis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grid opacity: fully visible early, fades as stats appear
  const gridOpacity = interpolate(frame, [0, 30, 180, 300], [0, 0.7, 0.4, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cinematic Slow Drift (Ken Burns effect but with physics depth)
  const { transform: cameraTransform } = useCinematicCamera({
    baseScale: 1.0,
    damping: 100, // Very slow and smooth
    mass: 5,
    focuses: [
      {
        startFrame: 0,
        endFrame: DURATION, // Continuously drifts throughout the scene
        scaleDelta: 0.15,
        rotateXDelta: 2,
        rotateYDelta: -1.5,
        xDelta: -20,
        yDelta: 30,
      }
    ]
  });

  // Vignette overlay intensity increases
  const vignetteOpacity = interpolate(frame, [0, 200], [0.3, 0.7], {
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={20} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        {/* 3x3 Image Grid */}
        <AbsoluteFill
          style={{
            opacity: gridOpacity,
            transform: cameraTransform,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 3,
            padding: 40,
            transformStyle: 'preserve-3d'
          }}
        >
          {CRISIS_IMAGES.map((src, i) => {
            const imgDelay = i * 8;
            const imgOpacity = interpolate(frame, [imgDelay, imgDelay + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={i}
                style={{
                  opacity: imgOpacity,
                  overflow: 'hidden',
                  borderRadius: 8,
                  position: 'relative',
                }}
              >
                <Img
                  src={src}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'saturate(0.4) brightness(0.7)',
                  }}
                />
                {/* Red tint overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), transparent)',
                  }}
                />
              </div>
            );
          })}
        </AbsoluteFill>

        {/* Dark Vignette Overlay */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, #0B0F19 80%)`,
            opacity: vignetteOpacity,
          }}
        />

        {/* Statistics Text Overlays */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 50,
            zIndex: 10,
          }}
        >
          {STATS.map((stat, i) => {
            const enter = spring({
              frame: frame - stat.delay,
              fps,
              config: { damping: 18, mass: 0.8, stiffness: 100 },
            });

            const translateY = interpolate(enter, [0, 1], [60, 0]);
            const opacity = interpolate(enter, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 72,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: 4,
                    textShadow: '0 0 40px rgba(239, 68, 68, 0.4), 0 0 80px rgba(239, 68, 68, 0.2)',
                    lineHeight: 1.1,
                  }}
                >
                  {stat.text}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 22,
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: 6,
                    textTransform: 'uppercase',
                    marginTop: 8,
                  }}
                >
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>

        {/* Subtle scanline texture */}
        <AbsoluteFill
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
