import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { AnimatedCursor } from '../components/AnimatedCursor';

const DURATION = 360; // frames 1591–1950

const SIDEBAR_THUMBNAILS = [
  staticFile('10google2-jumbo.png'),
  staticFile('Accident.png'),
  staticFile('Ohio-Driver-Pileup.png'),
  staticFile('glenmore-tr-crash.png'),
  staticFile('original.png'),
];

// Bounding boxes for the selected test image (normalized 0-1)
const BOUNDING_BOXES = [
  { x: 0.12, y: 0.25, w: 0.18, h: 0.22, label: 'CAR', confidence: 97 },
  { x: 0.38, y: 0.30, w: 0.20, h: 0.25, label: 'TRUCK', confidence: 94 },
  { x: 0.65, y: 0.35, w: 0.15, h: 0.18, label: 'CAR', confidence: 96 },
  { x: 0.82, y: 0.28, w: 0.13, h: 0.20, label: 'CAR', confidence: 91 },
  { x: 0.25, y: 0.55, w: 0.22, h: 0.24, label: 'CAR', confidence: 98 },
];

// Cursor path
const CURSOR_PATH = [
  { frame: 0, x: 960, y: 700 },
  { frame: 30, x: 200, y: 500 },    // Move to sidebar
  { frame: 60, x: 140, y: 340 },     // Hover over second thumbnail
  { frame: 80, x: 140, y: 340 },     // Click thumbnail
  { frame: 120, x: 500, y: 780 },    // Move to "Test Image" button
  { frame: 160, x: 500, y: 780 },    // Click "Test Image"
  { frame: 240, x: 800, y: 400 },    // Move to center to observe results
  { frame: DURATION, x: 800, y: 400 },
];

const CLICK_FRAMES = [80, 160];

export const Scene5Playground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image selected after click at frame 80
  const imageSelected = frame >= 80;

  // Inference triggered after click at frame 160
  const inferenceTriggered = frame >= 160;

  // Processing indicator
  const processingProgress = interpolate(frame, [160, 195], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bounding boxes appear after "processing"
  const bboxesVisible = frame >= 195;

  // Final fade to black
  const finalFade = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={0}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19', opacity: finalFade }}>
        {/* Page Layout */}
        <div
          style={{
            display: 'flex',
            height: '100%',
            padding: 40,
            gap: 20,
          }}
        >
          {/* Left Sidebar */}
          <div
            style={{
              width: 260,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 18px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: 'rgba(0,230,118,0.7)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
                AI Testing Sandbox
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                Select an image to run inference
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1,
              }}
            >
              {SIDEBAR_THUMBNAILS.map((src, i) => {
                const isSelected = imageSelected && i === 1;
                return (
                  <div
                    key={i}
                    style={{
                      height: 80,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: isSelected
                        ? '2px solid rgba(0,230,118,0.6)'
                        : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isSelected ? '0 0 20px rgba(0,230,118,0.2)' : 'none',
                      position: 'relative',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <Img
                      src={src}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isSelected ? 'brightness(0.9)' : 'brightness(0.5) saturate(0.3)',
                      }}
                    />
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#00e676',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#0B0F19',
                        fontWeight: 700,
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Test Image Button */}
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 10,
                background: inferenceTriggered
                  ? 'rgba(0,230,118,0.1)'
                  : imageSelected
                    ? 'linear-gradient(135deg, #2e7d32, #1b5e20)'
                    : 'rgba(255,255,255,0.03)',
                border: inferenceTriggered
                  ? '1px solid rgba(0,230,118,0.3)'
                  : imageSelected
                    ? '1px solid rgba(46,125,50,0.6)'
                    : '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
                boxShadow: imageSelected && !inferenceTriggered ? '0 0 15px rgba(46,125,50,0.3)' : 'none',
                transform: `scale(${frame >= 160 && frame <= 168 ? 0.95 : 1})`,
              }}
            >
              <span style={{
                fontFamily: 'Orbitron',
                fontSize: 11,
                color: imageSelected ? '#fff' : 'rgba(255,255,255,0.25)',
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                {inferenceTriggered ? '✓ Inference Complete' : '⚡ Test Image'}
              </span>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div
            style={{
              flex: 1,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Header bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '10px 16px',
                background: 'rgba(0,0,0,0.4)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 5,
              }}
            >
              <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 3 }}>
                INFERENCE CANVAS
              </span>
              {bboxesVisible && (
                <span style={{
                  fontFamily: 'Orbitron',
                  fontSize: 9,
                  color: '#00e676',
                  letterSpacing: 2,
                  padding: '3px 10px',
                  borderRadius: 4,
                  background: 'rgba(0,230,118,0.1)',
                  border: '1px solid rgba(0,230,118,0.3)',
                }}>
                  {BOUNDING_BOXES.length} OBJECTS DETECTED
                </span>
              )}
            </div>

            {!imageSelected ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.15 }}>🎯</div>
                <div style={{ fontFamily: 'Orbitron', fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 4, textTransform: 'uppercase' }}>
                  Select an Image to Begin
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '90%', height: '85%' }}>
                <Img
                  src={SIDEBAR_THUMBNAILS[1]}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />

                {/* Processing Overlay */}
                {inferenceTriggered && !bboxesVisible && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontFamily: 'Orbitron', fontSize: 14, color: '#00e676', letterSpacing: 4, marginBottom: 16 }}>
                      PROCESSING...
                    </div>
                    <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${processingProgress * 100}%`, height: '100%', background: '#00e676', borderRadius: 2 }} />
                    </div>
                  </div>
                )}

                {/* Bounding Boxes */}
                {bboxesVisible && BOUNDING_BOXES.map((box, i) => {
                  const boxEnter = spring({
                    frame: frame - 195 - i * 6,
                    fps,
                    config: { damping: 12, mass: 0.5, stiffness: 150 },
                  });

                  const boxScale = interpolate(boxEnter, [0, 1], [0.5, 1]);
                  const boxOpacity = interpolate(boxEnter, [0, 1], [0, 1]);

                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${box.x * 100}%`,
                        top: `${box.y * 100}%`,
                        width: `${box.w * 100}%`,
                        height: `${box.h * 100}%`,
                        border: '2px solid #ef4444',
                        borderRadius: 4,
                        opacity: boxOpacity,
                        transform: `scale(${boxScale})`,
                        transformOrigin: 'center center',
                        boxShadow: '0 0 12px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.15)',
                      }}
                    >
                      {/* Label */}
                      <div
                        style={{
                          position: 'absolute',
                          top: -22,
                          left: -2,
                          padding: '2px 8px',
                          background: '#ef4444',
                          borderRadius: '3px 3px 0 0',
                          fontFamily: 'Orbitron',
                          fontSize: 9,
                          color: '#fff',
                          fontWeight: 700,
                          letterSpacing: 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {box.label} {box.confidence}%
                      </div>

                      {/* Corner accents */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 8, height: 8, borderTop: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderTop: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 8, height: 8, borderBottom: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Animated Cursor */}
        <AnimatedCursor path={CURSOR_PATH} clickFrames={CLICK_FRAMES} />
      </AbsoluteFill>
    </SceneTransition>
  );
};
