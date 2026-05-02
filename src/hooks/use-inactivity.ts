'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function useInactivity(timeout: number = 45000) {
  const { mode, setMode } = useTheme();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (mode === 'alert') {
        console.log('[VISIONX] AUTO-RESET: INACTIVITY DETECTED');
        setMode('monitoring');
      }
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleEvent = () => resetTimer();

    events.forEach(name => document.addEventListener(name, handleEvent));
    resetTimer();
    
    return () => {
      events.forEach(name => document.removeEventListener(name, handleEvent));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mode, setMode, timeout]);
}
