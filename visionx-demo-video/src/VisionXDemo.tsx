import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Scene1Crisis } from './scenes/Scene1Crisis';
import { Scene2Reveal } from './scenes/Scene2Reveal';
import { Scene3GeoRouting } from './scenes/Scene3GeoRouting';
import { Scene4Training } from './scenes/Scene4Training';
import { Scene5Playground } from './scenes/Scene5Playground';

/**
 * VisionX Product Launch Video — Master Timeline
 * 
 * Total: 1950 frames @ 30 FPS = 65 seconds
 * 
 * Scene 1: The Crisis           | Frames 0–390    | 13s
 * Scene 2: The Reveal            | Frames 391–710  | ~10s
 * Scene 3: Geospatial Routing    | Frames 711–1160 | 15s
 * Scene 4: Model Training        | Frames 1161–1460| 10s
 * Scene 5: AI Playground         | Frames 1461–1820| 12s
 */

export const VisionXDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Volume: fade in over first 1s, sustain at 15% for voiceover headroom, fade out over last 2s
  const volume = interpolate(
    frame,
    [0, 30, 1890, 1950],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F19', fontFamily: 'Inter, sans-serif' }}>
      {/* Background Music */}
      <Audio src={staticFile('bgm.mp3')} volume={volume} />
      {/* Scene 1: The Crisis (0–390) */}
      <Sequence from={0} durationInFrames={391}>
        <Scene1Crisis />
      </Sequence>
      {/* Scene 2: The Reveal & Activation (391–710) */}
      <Sequence from={391} durationInFrames={320}>
        <Scene2Reveal />
      </Sequence>
      {/* Scene 3: Geospatial Map Routing (711–1160) */}
      <Sequence from={711} durationInFrames={450}>
        <Scene3GeoRouting />
      </Sequence>
      {/* Scene 4: Model Training & Calibration (1161–1460) */}
      <Sequence from={1161} durationInFrames={300}>
        <Scene4Training />
      </Sequence>
      {/* Scene 5: Interactive AI Playground (1461–1820) */}
      <Sequence from={1461} durationInFrames={360}>
        <Scene5Playground />
      </Sequence>
    </AbsoluteFill>
  );
};
