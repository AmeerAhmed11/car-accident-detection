import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
}

interface AnimatedCursorProps {
  path: CursorKeyframe[];
  clickFrames?: number[];
  startFrame?: number;
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  path,
  clickFrames = [],
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || path.length < 2) return null;

  const frames = path.map((p) => p.frame);
  const xValues = path.map((p) => p.x);
  const yValues = path.map((p) => p.y);

  const x = interpolate(localFrame, frames, xValues, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(localFrame, frames, yValues, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Check if we're near a click frame for the ripple effect
  const activeClick = clickFrames.find(
    (cf) => localFrame >= cf && localFrame <= cf + 20
  );

  const rippleScale = activeClick !== undefined
    ? spring({
        frame: localFrame - activeClick,
        fps,
        config: { damping: 12, mass: 0.4, stiffness: 120 },
      })
    : 0;

  const rippleOpacity = activeClick !== undefined
    ? interpolate(localFrame - activeClick, [0, 20], [0.6, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Cursor press animation
  const isClicking = activeClick !== undefined && localFrame >= activeClick && localFrame <= activeClick + 6;
  const cursorScale = isClicking ? 0.85 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 100,
        pointerEvents: 'none',
        transform: `translate(-4px, -2px)`,
      }}
    >
      {/* Click Ripple */}
      {rippleScale > 0 && (
        <div
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '2px solid rgba(0, 230, 118, 0.8)',
            left: -26,
            top: -26,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            boxShadow: '0 0 20px rgba(0, 230, 118, 0.3)',
          }}
        />
      )}

      {/* SVG Cursor */}
      <svg
        width="28"
        height="34"
        viewBox="0 0 28 34"
        fill="none"
        style={{ transform: `scale(${cursorScale})`, transition: 'transform 0.08s ease' }}
      >
        <path
          d="M2 2L2 28L8.5 21.5L14 32L18 30L12.5 19.5L22 19.5L2 2Z"
          fill="white"
          stroke="#0B0F19"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
