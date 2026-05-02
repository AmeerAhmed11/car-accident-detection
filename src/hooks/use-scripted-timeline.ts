'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

const CRASH_TIMESTAMP = 12.0;
const MONITORING_COORDS = { lat: '33.2788', lng: '44.3839' }; // Al-Jadriya

export function useScriptedTimeline(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { mode, setMode } = useTheme();
  const alertTriggered = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= CRASH_TIMESTAMP && !alertTriggered.current && mode === 'monitoring') {
        alertTriggered.current = true;
        setMode('alert');
        console.log(`[VISIONX AI] NODE 03: COLLISION DETECTED AT ${MONITORING_COORDS.lat}N, ${MONITORING_COORDS.lng}E`);
      }
      
      // Reset if video loops back to start
      if (video.currentTime < 1 && alertTriggered.current) {
        alertTriggered.current = false;
        // Optional: Reset mode to monitoring when video loops? 
        // For a demo, it's better to keep it in alert until manual reset or auto-pilot loop resets it.
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, mode, setMode]);

  // Manual Presenter Override: Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        console.log('[VISIONX] MANUAL OVERRIDE: TRIGGERING ALERT MODE');
        setMode('alert');
      }
      if (e.shiftKey && e.key.toUpperCase() === 'R') {
        console.log('[VISIONX] MANUAL OVERRIDE: RESETTING SYSTEM');
        setMode('monitoring');
        alertTriggered.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  return { alertTriggered: alertTriggered.current };
}
