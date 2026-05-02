'use client';

import { useRef } from 'react';
import { HUDOverlay } from './hud-overlay';
import { useScriptedTimeline } from '@/hooks/use-scripted-timeline';

export const VideoFeedContainer = () => {
  const mainCameraRef = useRef<HTMLVideoElement>(null);
  
  // Use the hook on the primary "incident" camera (Cam 03)
  useScriptedTimeline(mainCameraRef);

  const cameras = [
    { id: '01', src: '/assets/videos/cam01.mp4' },
    { id: '02', src: '/assets/videos/cam02.mp4' },
    { id: '03', src: '/assets/videos/cam03.mp4', isMain: true },
    { id: '04', src: '/assets/videos/cam04.mp4' },
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full bg-black rounded-lg overflow-hidden border border-white/10">
      {cameras.map((cam) => (
        <div 
          key={cam.id} 
          className="relative group overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-colors duration-500 bg-zinc-900/20"
        >
          <video
            ref={cam.isMain ? mainCameraRef : null}
            src={cam.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          />
          
          {/* Label Tag */}
          <div className="absolute top-2 left-2 z-30 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-orbitron text-zinc-400 tracking-widest uppercase">
            CAM_{cam.id} // BGD_SECTOR_{cam.id}
          </div>

          {/* HUD Overlay layer */}
          <HUDOverlay />
          
          {/* Subtle Scanline Texture overlay */}
          <div className="absolute inset-0 pointer-events-none hud-scanline opacity-10 z-10" />
        </div>
      ))}
    </div>
  );
};
