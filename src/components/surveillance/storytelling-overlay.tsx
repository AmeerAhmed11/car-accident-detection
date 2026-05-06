'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStorytellingTimeline, STORY_SCENES } from '@/hooks/use-storytelling-timeline';
import { AlertTriangle, Radio, MapPin, Hospital, Clock, Video, Navigation, Shield, Zap, Send, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const Scene1Map = dynamic(() => import('./storytelling-maps').then(mod => mod.Scene1Map), { ssr: false });
const Scene4Map = dynamic(() => import('./storytelling-maps').then(mod => mod.Scene4Map), { ssr: false });

// ── Scene Progress Bar ───────────────────────────────────────────
const SceneProgressBar = ({ activeScene, sceneProgress }: { activeScene: number; sceneProgress: number }) => (
  <div className="flex gap-2 w-full max-w-lg">
    {STORY_SCENES.filter(s => s.id >= 1 && s.id <= 5).map((scene) => (
      <div key={scene.id} className="flex-1 h-2 rounded-full overflow-hidden bg-white/15 shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: activeScene > scene.id ? '#2e7d32' : activeScene === scene.id ? 'linear-gradient(90deg, #2e7d32, #4ade80)' : 'transparent',
            width: activeScene > scene.id ? '100%' : activeScene === scene.id ? `${sceneProgress * 100}%` : '0%',
            boxShadow: activeScene === scene.id ? '0 0 12px rgba(46,125,50,0.6)' : 'none',
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    ))}
  </div>
);

// ── Narrative Tooltip Card ───────────────────────────────────────
const NarrativeCard = ({ scene, sceneNum }: { scene: typeof STORY_SCENES[0]; sceneNum: number }) => (
  <motion.div
    key={`narrative-${sceneNum}`}
    initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-3xl mx-auto"
  >
    <div className="relative p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl shadow-[0_12px_80px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)]">
      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-brand-emerald to-transparent opacity-70" />

      <div className="flex items-start gap-6">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-brand-emerald/15 border-2 border-brand-emerald/40 flex items-center justify-center shadow-[0_0_20px_rgba(46,125,50,0.2)]">
          <span className="text-lg font-orbitron font-black text-brand-emerald">{String(sceneNum).padStart(2, '0')}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-orbitron text-brand-emerald tracking-[0.3em] font-bold uppercase">{scene.subtitle}</span>
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-white tracking-tight mb-3 uppercase">{scene.title}</h3>
          <p className="text-lg text-zinc-300 font-inter leading-relaxed">{scene.narrativeText}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Map placeholder — replace with real Baghdad screenshot later
const MAP_BG_URL = '/assets/map-baghdad-dark.png';

// ── Scene 1: The Problem — Heat Map / Congestion ─────────────────
const Scene1Content = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* Live Leaflet Map Background */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
        <Scene1Map />
      </div>

      {/* Vignette over map */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.9)' }} />

      {/* Congestion severity legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-[10%] right-[5%] z-20 px-5 py-3 bg-slate-900/90 border-2 border-white/15 rounded-xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] pointer-events-auto"
      >
        <span className="text-[10px] font-orbitron text-zinc-400 tracking-[0.2em] block mb-2 uppercase">Congestion Level</span>
        <div className="flex items-center gap-3">
          {[
            { color: '#eab308', label: 'MOD' },
            { color: '#f97316', label: 'HIGH' },
            { color: '#ef4444', label: 'SEV' },
          ].map((lv) => (
            <div key={lv.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: lv.color, boxShadow: `0 0 8px ${lv.color}` }} />
              <span className="text-[9px] font-orbitron text-zinc-300 font-bold">{lv.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Congestion headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute top-[15%] left-1/2 -translate-x-1/2 z-20 px-8 py-4 bg-red-950/85 border-2 border-red-500/50 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.25)] pointer-events-auto"
      >
        <span className="text-base font-orbitron text-red-400 tracking-[0.2em] font-bold uppercase animate-pulse">
          ⚠ HIGH CONGESTION ZONES DETECTED
        </span>
      </motion.div>
    </motion.div>
  );
};

// ── Scene 2: AI Detection — Video Focus + Flash ──────────────────
const Scene2Content = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
  >
    {/* Screen flash at simulated crash moment */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 0, 0.6, 0.1, 0.3, 0] }}
      transition={{ duration: 4, times: [0, 0.28, 0.29, 0.3, 0.35, 0.37, 0.5] }}
      className="absolute inset-0 bg-red-500 z-50"
    />

    {/* Centered video frame — larger with bold border and glow */}
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[65%] max-w-4xl aspect-video rounded-3xl overflow-hidden border-2 border-white/25 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_40px_rgba(239,68,68,0.15)]"
    >
      <video
        src="/assets/videos/Incident_Alpha_Detection.mp4"
        autoPlay muted loop playsInline
        className="w-full h-full object-cover"
      />
      {/* AI bounding box */}
      <motion.div
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: [0, 0, 1, 1], scale: [1.3, 1.3, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.3, 0.35, 1] }}
        className="absolute top-[25%] left-[30%] w-[40%] h-[45%] border-[3px] border-red-500 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.6)]"
      >
        <div className="absolute -top-8 left-0 px-4 py-1.5 bg-red-600 rounded-lg text-sm font-orbitron font-bold text-white tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          CRASH DETECTED — 94.2%
        </div>
        {/* Corner brackets — larger */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-red-400" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-red-400" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-red-400" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-red-400" />
      </motion.div>
      {/* Live tag — larger */}
      <div className="absolute top-4 left-4 px-4 py-1.5 bg-red-600 rounded-lg text-sm font-orbitron font-bold text-white tracking-wider animate-pulse shadow-lg">
        ● LIVE — CAM_03
      </div>
    </motion.div>
  </motion.div>
);

// ── Scene 3: IoT Data Pipeline ───────────────────────────────────
const DataNode = ({ icon: Icon, label, delay }: { icon: any; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-3"
  >
    <div className="w-24 h-24 rounded-2xl bg-slate-900/90 border-2 border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(46,125,50,0.15)]">
      <Icon size={36} className="text-brand-emerald" />
    </div>
    <span className="text-xs font-orbitron text-zinc-300 tracking-[0.15em] uppercase font-bold">{label}</span>
  </motion.div>
);

const Scene3Content = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <div className="flex items-center gap-10">
      {/* Source nodes */}
      <div className="flex flex-col gap-6">
        <DataNode icon={Video} label="Video Feed" delay={0.2} />
        <DataNode icon={MapPin} label="GPS Coords" delay={0.5} />
        <DataNode icon={Clock} label="Timestamp" delay={0.8} />
      </div>

      {/* Animated connecting lines — wider */}
      <div className="flex flex-col items-center gap-4 mx-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.3, duration: 0.8 }}
            className="h-[3px] rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-full h-full bg-gradient-to-r from-transparent via-brand-emerald to-transparent"
            />
          </motion.div>
        ))}
      </div>

      {/* Data package result — larger */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="w-36 h-36 rounded-3xl bg-brand-emerald/15 border-2 border-brand-emerald/50 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_60px_rgba(46,125,50,0.35)]">
          <Send size={40} className="text-brand-emerald mb-2" />
          <span className="text-xs font-orbitron text-brand-emerald font-bold tracking-wider">DATA PKG</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl border-2 border-brand-emerald/40"
        />
      </motion.div>
    </div>
  </motion.div>
);

// ── Scene 4: Smart Routing ───────────────────────────────────────
const Scene4Content = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 pointer-events-none overflow-hidden"
  >
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
      <Scene4Map />
    </div>

    {/* Vignette over map */}
    <div className="absolute inset-0 z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.9)' }} />
  </motion.div>
);

// ── Scene 5: Mission Accomplished ────────────────────────────────
const Scene5Content = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <motion.div
      initial={{ x: 100, opacity: 0, filter: 'blur(10px)' }}
      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-[520px] rounded-3xl border-2 border-brand-emerald/40 bg-slate-900/95 backdrop-blur-xl shadow-[0_0_100px_rgba(46,125,50,0.2)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-brand-emerald/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-emerald/20 border-2 border-brand-emerald/40 flex items-center justify-center shadow-[0_0_20px_rgba(46,125,50,0.3)]">
          <CheckCircle size={24} className="text-brand-emerald" />
        </div>
        <div>
          <span className="text-sm font-orbitron font-bold tracking-[0.2em] text-brand-emerald uppercase">Dispatch Report</span>
          <span className="block text-xs font-mono text-zinc-400 mt-0.5">DELIVERED TO 911 OPERATIONS</span>
        </div>
      </div>
      {/* Body */}
      <div className="p-7 space-y-4">
        {[
          { label: 'INCIDENT TYPE', value: 'HIGH-IMPACT COLLISION', color: 'text-red-400' },
          { label: 'LOCATION', value: '33.2900°N, 44.3850°E', color: 'text-zinc-200' },
          { label: 'AI CONFIDENCE', value: '94.2%', color: 'text-brand-emerald' },
          { label: 'ROUTE GENERATED', value: 'DIJKSTRA OPTIMAL', color: 'text-brand-emerald' },
          { label: 'ETA TO SITE', value: '3.5 MINUTES', color: 'text-amber-400' },
        ].map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
          >
            <span className="text-xs font-orbitron text-zinc-400 tracking-wider">{row.label}</span>
            <span className={`text-base font-orbitron font-bold ${row.color}`}>{row.value}</span>
          </motion.div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-brand-emerald/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <span className="text-4xl font-orbitron font-black text-brand-emerald tracking-tight">&lt; 8 SECONDS</span>
          <span className="block text-sm font-orbitron text-zinc-400 tracking-[0.3em] mt-2 uppercase">Total End-to-End Latency</span>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main Overlay ─────────────────────────────────────────────────
export function StorytellingOverlay() {
  const { activeScene, currentScene, sceneProgress, isActive, abort } = useStorytellingTimeline();

  if (!isActive && activeScene === 0) return null;

  return (
    <AnimatePresence>
      {(isActive || activeScene === 6) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[200] flex flex-col"
          onClick={abort}
        >
          {/* Dark cinematic backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.88 }}
            className="absolute inset-0 bg-black"
          />

          {/* Scanline effect */}
          <div className="absolute inset-0 hud-scanline opacity-[0.03] pointer-events-none" />

          {/* Top bar: NURAI branding + progress */}
          <div className="relative z-10 flex items-center justify-between px-10 py-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-brand-emerald shadow-[0_0_12px_rgba(46,125,50,0.9)]"
              />
              <span className="text-sm font-orbitron text-brand-emerald font-bold tracking-[0.4em] uppercase">
                ResQ-AI // CINEMATIC DEMO
              </span>
            </div>
            <SceneProgressBar activeScene={activeScene} sceneProgress={sceneProgress} />
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-orbitron text-zinc-400 tracking-[0.2em]">
                CLICK ANYWHERE TO EXIT
              </span>
            </div>
          </div>

          {/* Scene Content Area */}
          <div className="relative z-10 flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {activeScene === 1 && <Scene1Content key="s1" />}
              {activeScene === 2 && <Scene2Content key="s2" />}
              {activeScene === 3 && <Scene3Content key="s3" />}
              {activeScene === 4 && <Scene4Content key="s4" />}
              {activeScene === 5 && <Scene5Content key="s5" />}
            </AnimatePresence>
          </div>

          {/* Bottom: Narrative Card */}
          <div className="relative z-10 px-8 pb-8">
            <AnimatePresence mode="wait">
              {currentScene.id >= 1 && currentScene.id <= 5 && (
                <NarrativeCard scene={currentScene} sceneNum={currentScene.id} />
              )}
            </AnimatePresence>
          </div>

          {/* Scene 6 — idle reset state */}
          {activeScene === 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="text-center">
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Shield size={72} className="text-brand-emerald/50 mx-auto mb-6" />
                  <span className="text-base font-orbitron text-zinc-500 tracking-[0.4em] uppercase block">
                    NURAI STANDBY — MONITORING
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
