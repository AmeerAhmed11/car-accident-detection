import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { useMemo } from 'react';

export interface CameraFocus {
  startFrame: number;
  endFrame: number;
  scaleDelta: number;
  rotateXDelta: number;
  rotateYDelta: number;
  xDelta: number;
  yDelta: number;
}

export interface CinematicCameraConfig {
  baseScale?: number;
  baseRotateX?: number;
  baseRotateY?: number;
  baseX?: number;
  baseY?: number;
  focuses: CameraFocus[];
  damping?: number;
  mass?: number;
  stiffness?: number;
}

export const useCinematicCamera = (config: CinematicCameraConfig) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    baseScale = 1,
    baseRotateX = 0,
    baseRotateY = 0,
    baseX = 0,
    baseY = 0,
    focuses,
    damping = 40,
    mass = 2,
    stiffness = 80,
  } = config;

  const smoothConfig = useMemo(() => ({ damping, mass, stiffness }), [damping, mass, stiffness]);

  // Compute the current value of each focus point based on spring physics
  const focusValues = focuses.map((focus) => {
    const entry = spring({ frame: frame - focus.startFrame, fps, config: smoothConfig });
    const exit = spring({ frame: frame - focus.endFrame, fps, config: smoothConfig });
    return entry - exit;
  });

  let scale = baseScale;
  let rotateX = baseRotateX;
  let rotateY = baseRotateY;
  let translateX = baseX;
  let translateY = baseY;

  focuses.forEach((focus, i) => {
    const val = focusValues[i];
    scale += val * focus.scaleDelta;
    rotateX += val * focus.rotateXDelta;
    rotateY += val * focus.rotateYDelta;
    translateX += val * focus.xDelta;
    translateY += val * focus.yDelta;
  });

  // Memoize the transform string to avoid unnecessary string allocations on every frame
  const transform = useMemo(
    () =>
      `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    [scale, translateX, translateY, rotateX, rotateY]
  );

  return {
    scale,
    rotateX,
    rotateY,
    translateX,
    translateY,
    transform,
  };
};
