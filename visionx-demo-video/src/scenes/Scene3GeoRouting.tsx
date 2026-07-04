import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';

const DURATION = 450; // frames 841–1290

// SVG road network paths
const TRADITIONAL_PATH = "M 200,800 L 200,650 L 350,650 L 350,500 L 550,500 L 550,400 L 700,400 L 700,350 L 850,350";
const OPTIMIZED_PATH = "M 200,800 L 200,650 L 300,600 L 400,520 L 500,440 L 650,380 L 800,320 L 950,280 L 1100,250 L 1300,230 L 1500,200 L 1650,180";

export const Scene3GeoRouting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Traditional route draws then stalls
  const traditionalProgress = interpolate(frame, [30, 200], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Optimized route draws fully
  const optimizedProgress = interpolate(frame, [60, 320], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Text overlays
  const text1Enter = spring({
    frame: frame - 160,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  const text2Enter = spring({
    frame: frame - 280,
    fps,
    config: { damping: 16, mass: 0.8 },
  });

  // Congestion zone pulse
  const congestionPulse = interpolate(frame % 40, [0, 20, 40], [0.3, 0.7, 0.3]);

  // Traffic stall indicator blink
  const stallBlink = frame > 200 ? (frame % 30 > 15 ? 1 : 0.4) : 0;

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        {/* Map Background Grid */}
        <AbsoluteFill>
          <svg width="1920" height="1080" viewBox="0 0 1920 1080">
            {/* Background road grid */}
            {Array.from({ length: 20 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <line
                  x1={i * 100}
                  y1={0}
                  x2={i * 100}
                  y2={1080}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  y1={i * 60}
                  x2={1920}
                  y2={i * 60}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {/* Road network lines */}
            {[
              "M 100,200 L 1800,200", "M 100,400 L 1800,400",
              "M 100,600 L 1800,600", "M 100,800 L 1800,800",
              "M 300,100 L 300,900", "M 600,100 L 600,900",
              "M 900,100 L 900,900", "M 1200,100 L 1200,900",
              "M 1500,100 L 1500,900",
              "M 200,800 L 500,500 L 900,350",
              "M 200,800 L 400,520 L 800,320 L 1300,230 L 1650,180",
            ].map((d, i) => (
              <path
                key={`road-${i}`}
                d={d}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
                fill="none"
              />
            ))}

            {/* Intersection nodes */}
            {[
              [300, 200], [600, 200], [900, 200], [1200, 200], [1500, 200],
              [300, 400], [600, 400], [900, 400], [1200, 400], [1500, 400],
              [300, 600], [600, 600], [900, 600], [1200, 600], [1500, 600],
              [300, 800], [600, 800], [900, 800], [1200, 800],
            ].map(([cx, cy], i) => (
              <circle
                key={`node-${i}`}
                cx={cx}
                cy={cy}
                r={3}
                fill="rgba(255,255,255,0.1)"
              />
            ))}

            {/* Congestion Zone */}
            <circle
              cx={700}
              cy={400}
              r={80}
              fill={`rgba(239, 68, 68, ${congestionPulse * 0.15})`}
              stroke={`rgba(239, 68, 68, ${congestionPulse * 0.4})`}
              strokeWidth={2}
            />
            <text
              x={700}
              y={400}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Orbitron"
              fontSize={10}
              fill={`rgba(239, 68, 68, ${congestionPulse})`}
              letterSpacing={3}
            >
              CONGESTION
            </text>

            {/* Traditional Route (Red Dashed) */}
            <path
              d={TRADITIONAL_PATH}
              stroke="#ef4444"
              strokeWidth={4}
              fill="none"
              strokeDasharray="12 8"
              strokeDashoffset={-frame * 0.5}
              pathLength={1}
              strokeLinecap="round"
              style={{
                opacity: 0.8,
              }}
            />
            {/* Traditional route drawn portion */}
            <path
              d={TRADITIONAL_PATH}
              stroke="#ef4444"
              strokeWidth={4}
              fill="none"
              strokeDasharray="12 8"
              pathLength={1}
              strokeLinecap="round"
              style={{
                strokeDashoffset: 1 - traditionalProgress,
                filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.5))',
              }}
            />

            {/* Stall X marker */}
            {frame > 200 && (
              <g opacity={stallBlink}>
                <line x1={835} y1={335} x2={865} y2={365} stroke="#ef4444" strokeWidth={3} />
                <line x1={865} y1={335} x2={835} y2={365} stroke="#ef4444" strokeWidth={3} />
              </g>
            )}

            {/* Optimized Route (Green Glowing) */}
            <path
              d={OPTIMIZED_PATH}
              stroke="#00e676"
              strokeWidth={4}
              fill="none"
              pathLength={1}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={1 - optimizedProgress}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,230,118,0.6)) drop-shadow(0 0 20px rgba(0,230,118,0.3))',
              }}
            />

            {/* Origin marker */}
            <circle cx={200} cy={800} r={8} fill="#00e676" opacity={0.8}>
              <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={200} y={830} textAnchor="middle" fontFamily="Orbitron" fontSize={9} fill="rgba(255,255,255,0.5)" letterSpacing={2}>
              ORIGIN
            </text>

            {/* Destination marker */}
            {optimizedProgress > 0.9 && (
              <>
                <circle cx={1650} cy={180} r={8} fill="#00e676" opacity={0.8}>
                  <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x={1650} y={210} textAnchor="middle" fontFamily="Orbitron" fontSize={9} fill="rgba(255,255,255,0.5)" letterSpacing={2}>
                  HOSPITAL
                </text>
              </>
            )}

            {/* Route Legend */}
            <g transform="translate(1550, 800)">
              <rect x={0} y={0} width={320} height={110} rx={10} fill="rgba(11,15,25,0.9)" stroke="rgba(255,255,255,0.08)" />
              <line x1={20} y1={35} x2={60} y2={35} stroke="#ef4444" strokeWidth={3} strokeDasharray="8 5" />
              <text x={75} y={39} fontFamily="Inter" fontSize={12} fill="rgba(255,255,255,0.5)">Traditional Route</text>
              <line x1={20} y1={70} x2={60} y2={70} stroke="#00e676" strokeWidth={3} />
              <text x={75} y={74} fontFamily="Inter" fontSize={12} fill="rgba(255,255,255,0.5)">Proposed Framework</text>
            </g>
          </svg>
        </AbsoluteFill>

        {/* Text Overlays */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 80,
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 36,
              color: '#fff',
              fontWeight: 700,
              letterSpacing: 3,
              opacity: interpolate(text1Enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(text1Enter, [0, 1], [40, 0])}px)`,
              textShadow: '0 0 30px rgba(0,230,118,0.3)',
              marginBottom: 16,
            }}
          >
            Dynamic Dijkstra Algorithm
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontSize: 24,
              color: 'rgba(0,230,118,0.8)',
              fontWeight: 500,
              letterSpacing: 2,
              opacity: interpolate(text2Enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(text2Enter, [0, 1], [40, 0])}px)`,
            }}
          >
            Emergency Vehicle Transit Time Reduced by 28%
          </div>
        </div>
      </AbsoluteFill>
    </SceneTransition>
  );
};
