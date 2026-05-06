'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

// ── Scene Definitions ─────────────────────────────────────────────
// Each scene has a duration (ms) and metadata for the overlay to consume.
export interface StoryScene {
  id: number;
  name: string;
  duration: number;       // ms
  title: string;
  subtitle: string;
  narrativeText: string;
}

export const STORY_SCENES: StoryScene[] = [
  {
    id: 0,
    name: 'idle',
    duration: 0,
    title: '',
    subtitle: '',
    narrativeText: '',
  },
  {
    id: 1,
    name: 'the-problem',
    duration: 8000,
    title: 'THE PROBLEM',
    subtitle: 'URBAN EMERGENCY RESPONSE',
    narrativeText: 'In emergencies, every second costs a life. Traffic congestion delays rapid response by an average of 16 minutes in dense urban corridors.',
  },
  {
    id: 2,
    name: 'ai-detection',
    duration: 10000,
    title: 'AI DETECTION',
    subtitle: 'NEURAL EDGE INFERENCE',
    narrativeText: 'NURAI Edge AI detects the incident instantly with high precision — eliminating the need for manual 911 calls.',
  },
  {
    id: 3,
    name: 'iot-pipeline',
    duration: 10000,
    title: 'IoT DATA PIPELINE',
    subtitle: 'AUTOMATED DISSEMINATION',
    narrativeText: 'Automated Data Dissemination: Packaging crucial proof, GPS coordinates, and timestamps in milliseconds.',
  },
  {
    id: 4,
    name: 'smart-routing',
    duration: 12000,
    title: 'SMART ROUTING',
    subtitle: 'AI-OSRM PATHFINDING',
    narrativeText: 'AI-OSRM instantly generates the fastest unobstructed route for emergency responders—bypassing all congestion.',
  },
  {
    id: 5,
    name: 'mission-accomplished',
    duration: 5000,
    title: 'MISSION ACCOMPLISHED',
    subtitle: 'DISPATCH CONFIRMED',
    narrativeText: 'Total Latency: < 8 Seconds. NURAI: Faster Response, Longer Lives.',
  },
  {
    id: 6,
    name: 'reset',
    duration: 0, // Infinite — stays here until user interacts or loop restarts
    title: '',
    subtitle: '',
    narrativeText: '',
  },
];

export const TOTAL_SCENES = STORY_SCENES.length;

// ── Hook ──────────────────────────────────────────────────────────
export function useStorytellingTimeline() {
  const { isAutoMode, setIsAutoMode, setMode, setIncidentStatus, isStorytelling, setIsStorytelling } = useTheme();
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0-1 progress within scene
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sceneStartTimeRef = useRef<number>(0);
  const isStorytellingRef = useRef(isStorytelling);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref in sync
  useEffect(() => { isStorytellingRef.current = isStorytelling; }, [isStorytelling]);

  const isActive = isStorytelling && activeScene > 0;

  // ── Abort: immediately kills the timeline and resets everything
  const abort = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    timerRef.current = null;
    progressIntervalRef.current = null;
    loopTimeoutRef.current = null;
    setActiveScene(0);
    setSceneProgress(0);
    setIsStorytelling(false);
    setIsAutoMode(false);
    setMode('monitoring');
    setIncidentStatus('none');
  }, [setIsStorytelling, setIsAutoMode, setMode, setIncidentStatus]);

  // ── Advance to a specific scene
  const goToScene = useCallback((sceneId: number) => {
    // Clean up existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    timerRef.current = null;
    progressIntervalRef.current = null;

    if (sceneId >= TOTAL_SCENES) {
      // End of timeline — go to reset scene
      setActiveScene(6);
      setSceneProgress(0);
      return;
    }

    const scene = STORY_SCENES[sceneId];
    setActiveScene(sceneId);
    setSceneProgress(0);
    sceneStartTimeRef.current = Date.now();

    if (scene.duration > 0) {
      // Progress tracker — updates ~30fps for smooth progress bars
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - sceneStartTimeRef.current;
        const progress = Math.min(elapsed / scene.duration, 1);
        setSceneProgress(progress);
      }, 33);

      // Auto-advance to next scene
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setSceneProgress(1);
        goToScene(sceneId + 1);
      }, scene.duration);
    }
  }, []);

  // ── Start the storytelling timeline
  const start = useCallback(() => {
    console.log('[NURAI] STORYTELLING TIMELINE: Starting cinematic sequence');
    goToScene(1);
  }, [goToScene]);

  // ── Auto-start when isStorytelling becomes true
  useEffect(() => {
    if (isStorytelling && activeScene === 0) {
      // Small delay before starting to let the UI settle
      const startDelay = setTimeout(() => {
        start();
      }, 500);
      return () => clearTimeout(startDelay);
    }
  }, [isStorytelling, activeScene, start]);

  // ── When reaching reset scene (6), loop back after 15s
  useEffect(() => {
    if (activeScene === 6 && isStorytelling) {
      loopTimeoutRef.current = setTimeout(() => {
        if (isStorytellingRef.current) {
          console.log('[NURAI] STORYTELLING: Loop restart');
          goToScene(1);
        }
      }, 15000);
      return () => {
        if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      };
    }
  }, [activeScene, isStorytelling, goToScene]);

  // ── Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  const currentScene = STORY_SCENES[activeScene] || STORY_SCENES[0];

  return {
    activeScene,
    currentScene,
    sceneProgress,
    isActive,
    abort,
    start,
    goToScene,
    totalScenes: TOTAL_SCENES,
  };
}
