import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { TacticalMap } from '../components/TacticalMap';

const DURATION = 450; // frames 841–1290

export const Scene3GeoRouting: React.FC = () => {
  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={20} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
        
        {/* Dashboard UI Background with sidebars */}
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
          }}
        />

        {/* Real Interactive Leaflet Map replacing the static map area */}
        <div style={{
          position: 'absolute',
          top: '5.92%',
          left: '0.4%', 
          width: '74.2%', 
          height: '93.33%',
          zIndex: 40,
        }}>
          {/* We start the routing animation at frame 30 of this local sequence */}
          <TacticalMap animationStartFrame={30} />
        </div>

      </AbsoluteFill>
    </SceneTransition>
  );
};
