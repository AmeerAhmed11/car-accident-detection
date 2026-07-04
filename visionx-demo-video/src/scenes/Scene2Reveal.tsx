import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { AnimatedCursor } from '../components/AnimatedCursor';

const DURATION = 450; // frames 391–840

// Cursor path keyframes (relative to scene start)
const CURSOR_PATH = [
  { frame: 0, x: 960, y: 800 },    // Start below center
  { frame: 30, x: 960, y: 600 },    // Move up
  { frame: 80, x: 340, y: 480 },    // Navigate to sidebar area
  { frame: 130, x: 340, y: 520 },   // Hover on "Activate AI Model" button
  { frame: 140, x: 340, y: 520 },   // Click position
  { frame: 200, x: 700, y: 400 },   // Move toward alert
  { frame: 260, x: 900, y: 520 },   // Navigate to "Accept Notification"
  { frame: 280, x: 900, y: 520 },   // Click position
  { frame: 340, x: 960, y: 540 },   // Rest center
  { frame: DURATION, x: 960, y: 540 },
];

const CLICK_FRAMES = [140, 280];

export const Scene2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dashboard enters with scale
  const dashboardScale = spring({
    frame,
    fps,
    from: 0.92,
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

  // Map transition after "Accept" click at frame 280
  const mapReveal = spring({
    frame: frame - 300,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  const mapScale = interpolate(mapReveal, [0, 1], [0.5, 1]);
  const mapOpacity = interpolate(mapReveal, [0, 1], [0, 1]);
  const dashboardFade = interpolate(frame, [290, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        {/* Dashboard Mockup */}
        <AbsoluteFill
          style={{
            opacity: dashboardFade,
            transform: `scale(${dashboardScale})`,
            padding: 40,
          }}
        >
          {/* Dashboard Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 12px rgba(0,230,118,0.6)' }} />
              <span style={{ fontFamily: 'Orbitron', fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textTransform: 'uppercase' }}>
                Central Command Dashboard
              </span>
            </div>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              The Proposed System — Live Monitoring
            </span>
          </div>

          {/* Main Grid: Sidebar + Camera Feeds */}
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {/* Left Sidebar */}
            <div
              style={{
                width: 320,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Status Panels */}
              {['System Vitals', 'Network Load', 'Active Nodes'].map((label, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ fontFamily: 'Orbitron', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
                    {label}
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${60 + i * 15}%`, background: 'linear-gradient(90deg, #2e7d32, #00e676)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              {/* Activate AI Model Button */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 10,
                  background: frame >= 140 ? 'rgba(0,230,118,0.15)' : 'linear-gradient(135deg, #2e7d32, #1b5e20)',
                  border: frame >= 140 ? '1px solid rgba(0,230,118,0.4)' : '1px solid rgba(46,125,50,0.6)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: frame >= 140 ? '0 0 25px rgba(0,230,118,0.3)' : '0 0 15px rgba(46,125,50,0.3)',
                  transform: `scale(${frame >= 140 && frame <= 150 ? 0.95 : 1})`,
                  transition: 'transform 0.1s',
                }}
              >
                <span style={{ fontFamily: 'Orbitron', fontSize: 12, color: '#fff', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 }}>
                  ⚡ Activate AI Model
                </span>
              </div>
            </div>

            {/* Camera Feed Grid */}
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: 8,
              }}
            >
              {['CAM_01 // HIGHWAY', 'CAM_02 // URBAN', 'CAM_03 // INTERSECTION', 'CAM_04 // BRIDGE'].map((label, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Noise pattern background */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }} />
                  {/* Feed label */}
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    left: 10,
                    fontFamily: 'Orbitron',
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: 2,
                  }}>
                    {label}
                  </div>
                  {/* Simulated feed activity */}
                  <div style={{
                    width: '80%',
                    height: '60%',
                    borderRadius: 4,
                    background: `linear-gradient(${135 + i * 30}deg, rgba(255,255,255,0.02), rgba(46,125,50,0.05))`,
                    border: '1px solid rgba(255,255,255,0.03)',
                  }} />
                  {/* REC indicator */}
                  <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', opacity: frame % 30 > 15 ? 1 : 0.3 }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 7, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>REC</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>

        {/* Alert Box (appears after button click) */}
        {frame >= 155 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${alertScale})`,
              opacity: alertOpacity * dashboardFade,
              zIndex: 50,
              width: 520,
              padding: 32,
              borderRadius: 16,
              background: 'rgba(15, 10, 10, 0.95)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              boxShadow: '0 0 60px rgba(239, 68, 68, 0.2), 0 0 120px rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 15px rgba(239,68,68,0.6)' }} />
              <span style={{ fontFamily: 'Orbitron', fontSize: 13, color: '#ef4444', letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                ⚠ Collision Detected
              </span>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 20 }}>
              High-confidence impact event verified at Node 03. Automated alert triggered. Emergency response coordination required.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: frame >= 280 ? 'rgba(0,230,118,0.15)' : 'linear-gradient(135deg, #2e7d32, #1b5e20)',
                  border: '1px solid rgba(46,125,50,0.5)',
                  textAlign: 'center',
                  boxShadow: frame >= 280 ? '0 0 20px rgba(0,230,118,0.3)' : '0 0 10px rgba(46,125,50,0.2)',
                  transform: `scale(${frame >= 280 && frame <= 290 ? 0.95 : 1})`,
                }}
              >
                <span style={{ fontFamily: 'Orbitron', fontSize: 10, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                  Accept Notification
                </span>
              </div>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontFamily: 'Orbitron', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Dismiss
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Geospatial Coordinates Flash (post-accept) */}
        {frame >= 300 && (
          <AbsoluteFill
            style={{
              opacity: mapOpacity,
              transform: `scale(${mapScale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 60,
            }}
          >
            <div style={{ fontFamily: 'Orbitron', fontSize: 16, color: 'rgba(0,230,118,0.6)', letterSpacing: 8, textTransform: 'uppercase', marginBottom: 16 }}>
              Dispatching Geospatial Coordinates
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 48, color: '#fff', fontWeight: 300, letterSpacing: 4 }}>
              33.3152°N, 44.3661°E
            </div>
            <div style={{ width: 200, height: 2, background: 'linear-gradient(90deg, transparent, #00e676, transparent)', marginTop: 20 }} />
          </AbsoluteFill>
        )}

        {/* Animated Cursor */}
        <AnimatedCursor path={CURSOR_PATH} clickFrames={CLICK_FRAMES} />
      </AbsoluteFill>
    </SceneTransition>
  );
};
