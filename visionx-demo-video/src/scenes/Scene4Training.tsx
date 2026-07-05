import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';

const DURATION = 300; // frames 1291–1590

const CAROUSEL_IMAGES = [
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

const TEXTS = [
  { text: 'Model trained on a large dataset', delay: 30 },
  { text: 'Including different environments like rain, dust, storms, & low light', delay: 120 },
  { text: 'And real accident scenarios', delay: 200 },
];

const IMAGE_DURATION = 28; // Each image visible for ~0.9s

export const Scene4Training: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which carousel image is active
  const activeIndex = Math.min(
    Math.floor(frame / IMAGE_DURATION),
    CAROUSEL_IMAGES.length - 1
  );



  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={12} fadeOutDuration={15}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        {/* Carousel Images */}
        {CAROUSEL_IMAGES.map((src, i) => {
          const imgStart = i * IMAGE_DURATION;
          const imgEnd = (i + 1) * IMAGE_DURATION;

          // Crossfade: fade in at start, fade out at end
          const imgOpacity = interpolate(
            frame,
            [imgStart, imgStart + 8, imgEnd - 8, imgEnd],
            [0, 0.9, 0.9, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          // Gentle Ken Burns
          const imgScale = interpolate(
            frame,
            [imgStart, imgEnd],
            [1.05, 1.15],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          if (Math.abs(i - activeIndex) > 1) return null;

          return (
            <AbsoluteFill
              key={i}
              style={{
                opacity: imgOpacity,
                transform: `scale(${imgScale})`,
              }}
            >
              <Img
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'saturate(0.5) brightness(0.8)',
                }}
              />
            </AbsoluteFill>
          );
        })}

        {/* Dark Overlay */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, rgba(11,15,25,0.4) 0%, rgba(11,15,25,0.7) 60%, #0B0F19 100%)',
          }}
        />

        {/* Flashing Frame Counter (cinematic feel) */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 60,
            fontFamily: 'Orbitron',
            fontSize: 12,
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: 4,
          }}
        >
          DATASET [{String(activeIndex + 1).padStart(2, '0')}/{String(CAROUSEL_IMAGES.length).padStart(2, '0')}]
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            right: 60,
            width: 200,
            height: 2,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 1,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((activeIndex + 1) / CAROUSEL_IMAGES.length) * 100}%`,
              background: 'linear-gradient(90deg, #2e7d32, #00e676)',
              borderRadius: 1,
              transition: 'width 0.3s',
            }}
          />
        </div>

        {/* Center Text Overlays */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
            zIndex: 10,
            padding: '0 120px',
          }}
        >
          {TEXTS.map((item, i) => {
            const enter = spring({
              frame: frame - item.delay,
              fps,
              config: { damping: 18, mass: 0.7 },
            });

            const translateY = interpolate(enter, [0, 1], [50, 0]);
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
                    fontFamily: i === 0 ? 'Orbitron' : 'Inter',
                    fontSize: i === 0 ? 42 : 26,
                    fontWeight: i === 0 ? 700 : 400,
                    color: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                    letterSpacing: i === 0 ? 4 : 2,
                    lineHeight: 1.4,
                    textShadow: i === 0 ? '0 0 30px rgba(0,230,118,0.2)' : 'none',
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>

        {/* Accuracy Highlight */}
        {(() => {
          const accuracyEnter = spring({
            frame: frame - 30, // Appear at the beginning of the scene
            fps,
            config: { damping: 14, mass: 1 },
          });

          const scale = interpolate(accuracyEnter, [0, 1], [0.8, 1]);
          const opacity = interpolate(accuracyEnter, [0, 1], [0, 1]);
          
          // Count up linearly over the entire scene
          const displayedAccuracy = Math.round(
            interpolate(frame, [30, 270], [0, 98], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          );

          return (
            <div
              style={{
                position: 'absolute',
                top: '72%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: 84,
                  fontWeight: 900,
                  color: '#00e676',
                  textShadow: '0 0 40px rgba(0, 230, 118, 0.8), 0 0 80px rgba(0, 230, 118, 0.4)',
                  lineHeight: 1,
                }}
              >
                {displayedAccuracy}%
              </div>
              <div
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: 8,
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase',
                }}
              >
                Model Accuracy
              </div>
            </div>
          );
        })()}

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.3), transparent)',
          }}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
