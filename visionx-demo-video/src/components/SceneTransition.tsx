import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

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

  // Handle fade-in
  const fadeInOpacity = fadeInDuration > 0
    ? interpolate(frame, [0, fadeInDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Handle fade-out
  const fadeOutOpacity = fadeOutDuration > 0
    ? interpolate(
        frame,
        [totalDuration - fadeOutDuration, totalDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeInOpacity, fadeOutOpacity) }}>
      {children}
    </AbsoluteFill>
  );
};
