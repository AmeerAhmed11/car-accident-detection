'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

const CRASH_TIMESTAMP = 3.0;
const MONITORING_COORDS = { lat: '33.3152', lng: '44.3661' }; // Baghdad Crash Site

export function useScriptedTimeline(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { mode, setMode, isAutoMode, incidentStatus, setIncidentStatus } = useTheme();
  const processedInCurrentLoop = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Loop Prevention: Reset when video returns to start
      if (video.currentTime < 0.5) {
        processedInCurrentLoop.current = false;
        // Also reset status to none if we were 'ignored' so it can trigger again next loop?
        // User said: "disable the alert trigger for that specific video loop"
        // This implies it should reset when the loop resets.
        if (incidentStatus === 'ignored') setIncidentStatus('none');
      }

      if (!isAutoMode) return;

      // Detection Trigger
      if (video.currentTime >= CRASH_TIMESTAMP && !processedInCurrentLoop.current && incidentStatus === 'none') {
        setIncidentStatus('detected');
      }
      
      // Mark as processed if user took action
      if (incidentStatus === 'approved' || incidentStatus === 'ignored') {
        processedInCurrentLoop.current = true;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, mode, setMode, isAutoMode, incidentStatus, setIncidentStatus]);

  // Manual Presenter Override: Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        console.log('[VISIONX] MANUAL OVERRIDE: TRIGGERING DETECTION');
        setIncidentStatus('detected');
      }
      if (e.shiftKey && e.key.toUpperCase() === 'R') {
        console.log('[VISIONX] MANUAL OVERRIDE: RESETTING SYSTEM');
        setMode('monitoring');
        setIncidentStatus('none');
        processedInCurrentLoop.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode, setIncidentStatus]);

  return { isProcessed: processedInCurrentLoop.current };
}
