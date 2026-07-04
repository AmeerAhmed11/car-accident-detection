import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile, Video } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { AnimatedCursor } from '../components/AnimatedCursor';

const DURATION = 450; // frames 391–840

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
  { frame: DURATION, x: 960, y: 1200 },
];

const CLICK_FRAMES = [140, 280];

export const Scene2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cinematic 3D Camera Movements using Physics-based Springs for ultra-smooth transitions
  // We use an overdamped spring config (high damping) to prevent ANY bouncing or jerking.
  const smoothConfig = { damping: 40, mass: 2, stiffness: 80 };

  const headerFocus = spring({ frame: frame - 60, fps, config: smoothConfig }) 
                    - spring({ frame: frame - 150, fps, config: smoothConfig });
                    
  const popupFocus = spring({ frame: frame - 160, fps, config: smoothConfig }) 
                   - spring({ frame: frame - 280, fps, config: smoothConfig });

  const cameraScale = 1.05 + (headerFocus * 0.15) + (popupFocus * 0.1);
  const cameraRotateX = 0 + (headerFocus * -2) + (popupFocus * 4);
  const cameraRotateY = 0 + (headerFocus * 2) + (popupFocus * -2);
  const cameraTranslateX = 0 + (headerFocus * 100) + (popupFocus * -30);
  const cameraTranslateY = 0 + (headerFocus * 220) + (popupFocus * -120);

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


  const dashboardFade = interpolate(frame, [290, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19', perspective: 1200 }}>
        {/* Background 1: Main Dashboard (Default) */}
        <AbsoluteFill
          style={{
            opacity: dashboardFade,
            transform: `scale(${dashboardScale}) scale(${cameraScale}) translateX(${cameraTranslateX}px) translateY(${cameraTranslateY}px) rotateX(${cameraRotateX}deg) rotateY(${cameraRotateY}deg)`,
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
            <Img 
              src={staticFile('screenshot-1783164667772.png')} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
              }}
            />

            {/* Background 2: Activated Model Mode (Fades in at click 1: frame 140) */}
            <Img 
              src={staticFile('screenshot-1783164715936.png')} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                opacity: interpolate(frame, [140, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              }}
            />

            {/* Live Video Feeds Overlay */}
            <div style={{
              position: 'absolute',
              top: '8%',
              left: '19.5%',
              width: '61%',
              height: '89%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '8px',
              opacity: interpolate(frame, [280, 290], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <Video src={staticFile('Feed_01_Normal_Monitoring.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              <Video src={staticFile('Node_02_Strategic_Urban_Flow.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              <Video src={staticFile('Incident_Alpha_Detection.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              <Video src={staticFile('Node_04_High_Density_Monitoring.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            </div>

            {/* Background 3: Map View (Fades in at click 2: frame 280) */}
            <Img 
              src={staticFile('screenshot-1783164803069.png')} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                opacity: interpolate(frame, [280, 290], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              }}
            />

            {/* Map Routing Animation Overlay */}
            {frame >= 280 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 40, // Below alert popup, above map
                opacity: interpolate(frame, [290, 310], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              }}>
                <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                  {/* Glowing line shadow */}
                  <path 
                    d="M 600 750 L 1000 450 L 1350 350"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeDasharray="2000"
                    strokeDashoffset={interpolate(frame, [310, 380], [2000, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{ filter: 'blur(8px)', opacity: 0.6 }}
                  />
                  {/* The actual routing line */}
                  <path 
                    d="M 600 750 L 1000 450 L 1350 350"
                    fill="none"
                    stroke="#00e676"
                    strokeWidth="3"
                    strokeDasharray="2000"
                    strokeDashoffset={interpolate(frame, [310, 380], [2000, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Marker 1: Operation Center (Green) */}
                  <g style={{ transform: `translate(600px, 750px) scale(${interpolate(frame, [290, 310], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
                    <circle cx="0" cy="0" r="15" fill="rgba(0, 230, 118, 0.2)" className="animate-ping" />
                    <circle cx="0" cy="0" r="6" fill="#00e676" />
                    <text x="20" y="5" fill="#00e676" fontFamily="Orbitron" fontSize="14" fontWeight="bold" letterSpacing="2">OPERATION CENTER</text>
                  </g>

                  {/* Marker 2: Accident Location (Red) */}
                  <g style={{ transform: `translate(1000px, 450px) scale(${interpolate(frame, [330, 350], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
                    <circle cx="0" cy="0" r="20" fill="rgba(239, 68, 68, 0.3)" style={{ filter: 'blur(4px)' }} />
                    <circle cx="0" cy="0" r="8" fill="#ef4444" />
                    <text x="25" y="5" fill="#ef4444" fontFamily="Orbitron" fontSize="14" fontWeight="bold" letterSpacing="2">ACCIDENT LOCATION</text>
                  </g>

                  {/* Marker 3: Nearest Hospital (Blue) */}
                  <g style={{ transform: `translate(1350px, 350px) scale(${interpolate(frame, [370, 390], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
                    <circle cx="0" cy="0" r="15" fill="rgba(59, 130, 246, 0.3)" />
                    <circle cx="0" cy="0" r="6" fill="#3b82f6" />
                    <circle cx="0" cy="0" r="3" fill="#ffffff" />
                    <text x="20" y="5" fill="#3b82f6" fontFamily="Orbitron" fontSize="14" fontWeight="bold" letterSpacing="2">NEAREST HOSPITAL</text>
                  </g>
                </svg>
              </div>
            )}

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
                  width: 600, // Appropriate width for the Capture.PNG pop-up
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 0 60px rgba(239, 68, 68, 0.4), 0 0 120px rgba(239, 68, 68, 0.2)',
                }}
              >
                <Img 
                  src={staticFile('Capture.PNG')} 
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            )}
            
            {/* Animated Cursor (Now inside the 3D container to stay aligned) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <AnimatedCursor path={CURSOR_PATH} clickFrames={CLICK_FRAMES} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneTransition>
  );
};
