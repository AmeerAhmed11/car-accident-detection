'use client';

import { useRef, useState, useEffect } from 'react';
import { HUDOverlay } from './hud-overlay';
import { useScriptedTimeline } from '@/hooks/use-scripted-timeline';
import { AlertTriangle } from 'lucide-react';

const VideoFeed = ({ cam, mainCameraRef }: { cam: any, mainCameraRef: React.RefObject<HTMLVideoElement | null> }) => {
  const [hasError, setHasError] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Assign the ref conditionally
  const refToUse = cam.isMain ? mainCameraRef : videoRef;

  // Auto-retry: if stalled for more than 3s, reload the video
  useEffect(() => {
    if (!isStalled) return;
    const retryTimer = setTimeout(() => {
      const el = refToUse.current;
      if (el) {
        el.load();
        el.play().catch(() => {});
      }
    }, 3000);
    return () => clearTimeout(retryTimer);
  }, [isStalled, refToUse]);

  return (
    <div className="relative group overflow-hidden border border-white/5 hover:border-brand-primary/30 transition-colors duration-500 bg-zinc-900/20 w-full h-full">
      {/* Fallback Background (Static Noise Pattern) */}
      <div className="absolute inset-0 bg-[#0a0a0a] opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#1a1a1a 1px, transparent 1px)`,
          backgroundSize: '4px 4px'
        }} 
      />

      <video
        ref={refToUse}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={(e) => {
          console.error(`[NURAI] CODEC_ERR CAM_${cam.id}:`, e);
          setHasError(true);
        }}
        onStalled={() => setIsStalled(true)}
        onWaiting={() => setIsStalled(true)}
        onPlaying={() => {
          setHasError(false);
          setIsStalled(false);
        }}
        onCanPlayThrough={() => {
          setHasError(false);
          setIsStalled(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-700 ${(hasError || isStalled) ? 'opacity-0' : 'opacity-90 group-hover:opacity-100'}`}
      >
        {/* Primary H.264 source with explicit codec */}
        <source src={cam.src} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        {/* Fallback: generic mp4 */}
        <source src={cam.src} type="video/mp4" />
      </video>

      {/* Debug Overlay for Codec Issues */}
      {(hasError || isStalled) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-40 p-4 text-center">
          <AlertTriangle className="text-brand-red mb-2 animate-pulse" size={20} />
          <div className="text-[9px] font-orbitron font-bold text-brand-red tracking-[0.2em] uppercase">
            {hasError ? 'CODEC INCOMPATIBILITY' : 'FEED BUFFERING...'}
          </div>
          <div className="text-[7px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">
            {hasError ? 'CONVERT TO H.264 (AVC1)' : 'RETRYING STREAM...'}
          </div>
        </div>
      )}
      
      {/* Label Tag */}
      <div className="absolute top-2 left-2 z-30 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-orbitron text-zinc-400 tracking-widest uppercase">
        CAM_{cam.id} // {cam.label}
      </div>

      {/* GPS Coords Tag */}
      <div className="absolute bottom-2 right-2 z-30 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[7px] font-mono text-zinc-600">
        {cam.gps}
      </div>

      {/* HUD Overlay layer */}
      <HUDOverlay />
      
      {/* Subtle Scanline Texture overlay */}
      <div className="absolute inset-0 pointer-events-none hud-scanline opacity-10 z-10" />
    </div>
  );
};

export const VideoFeedContainer = () => {
  const mainCameraRef = useRef<HTMLVideoElement>(null);
  
  // Use the hook on the primary "incident" camera (Cam 03)
  useScriptedTimeline(mainCameraRef);

  const cameras = [
    { id: '01', src: '/assets/videos/Feed_01_Normal_Monitoring.mp4', label: 'NORMAL', gps: '33.2847°N 44.3744°E' },
    { id: '02', src: '/assets/videos/Node_02_Strategic_Urban_Flow.mp4', label: 'NORMAL', gps: '33.2750°N 44.3770°E' },
    { id: '03', src: '/assets/videos/Incident_Alpha_Detection.mp4', isMain: true, label: 'CRASH DETECTED', gps: '33.2900°N 44.3850°E' },
    { id: '04', src: '/assets/videos/Node_04_High_Density_Monitoring.mp4', label: 'NORMAL', gps: '33.2810°N 44.3450°E' },
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full bg-black rounded-lg overflow-hidden border border-white/10">
      {cameras.map((cam) => (
        <VideoFeed key={cam.id} cam={cam} mainCameraRef={mainCameraRef} />
      ))}
    </div>
  );
};
