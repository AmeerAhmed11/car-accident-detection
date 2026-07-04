import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface SceneTransitionProps {
  children: React.ReactNode;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  totalDuration: number;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  fadeInDuration = 15,
  fadeOutDuration = 15,
  totalDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Handle fade-in opacity
  const fadeInOpacity = fadeInDuration > 0
    ? interpolate(frame, [0, fadeInDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Handle fade-out opacity
  const fadeOutOpacity = fadeOutDuration > 0
    ? interpolate(
        frame,
        [totalDuration - fadeOutDuration, totalDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Depth scaling: Zoom in slightly from 0.95 to 1 on entry (using spring)
  const scaleIn = spring({
    frame,
    fps,
    from: 0.95,
    to: 1,
    config: { damping: 14, mass: 0.5 },
  });

  // Depth scaling: Zoom out slightly from 1 to 1.05 on exit
  const scaleOut = fadeOutDuration > 0 
    ? interpolate(
        frame,
        [totalDuration - fadeOutDuration, totalDuration],
        [1, 1.05],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  const finalScale = (frame > totalDuration - fadeOutDuration && fadeOutDuration > 0) ? scaleOut : scaleIn;

  return (
    <AbsoluteFill 
      style={{ 
        opacity: Math.min(fadeInOpacity, fadeOutOpacity),
        transform: `scale(${finalScale})`,
        transformOrigin: 'center center'
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
