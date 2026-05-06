'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/hooks/use-theme';

/**
 * useInactivity — triggers "Storytelling" (cinematic demo) mode
 * after `timeout` ms of complete user inactivity by setting isAutoMode = true.
 * 
 * The StorytellingOverlay + useStorytellingTimeline then take over the experience.
 * Any user interaction immediately aborts storytelling by setting isAutoMode = false.
 */
export function useInactivity(timeout: number = 30000) {
  const { isAutoMode, setIsAutoMode, setMode, setIncidentStatus, isStorytelling, setIsStorytelling } = useTheme();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isStorytellingRef = useRef(isStorytelling);

  useEffect(() => { isStorytellingRef.current = isStorytelling; }, [isStorytelling]);

  const startStorytelling = useCallback(() => {
    console.log('[NURAI] STORYTELLING: 30s inactivity — entering cinematic mode');
    setIsAutoMode(true); // Ensure manual toggle shows 'Autonomous'
    setIsStorytelling(true);
  }, [setIsAutoMode, setIsStorytelling]);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);

    // If user interacted while storytelling was active, abort it
    if (isStorytellingRef.current) {
      console.log('[NURAI] USER ACTIVITY — exiting storytelling mode');
      setIsStorytelling(false);
      setIsAutoMode(false);
      setMode('monitoring');
      setIncidentStatus('none');
    }

    // Restart idle countdown
    timer.current = setTimeout(startStorytelling, timeout);
  }, [timeout, startStorytelling, setIsStorytelling, setIsAutoMode, setMode, setIncidentStatus]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'touchmove', 'wheel'];
    const handleEvent = () => resetTimer();

    events.forEach(name => document.addEventListener(name, handleEvent, { passive: true }));
    resetTimer();

    return () => {
      events.forEach(name => document.removeEventListener(name, handleEvent));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resetTimer]);
}
