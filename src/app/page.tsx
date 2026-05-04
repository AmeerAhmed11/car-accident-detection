'use client';

import { useTheme } from "@/hooks/use-theme";
import { useInactivity } from "@/hooks/use-inactivity";
import { VideoFeedContainer } from "@/components/surveillance/video-feed-container";
import { 
  Activity, 
  Map as MapIcon, 
  Shield, 
  Navigation, 
  AlertTriangle,
  History,
  TrendingUp,
  Hospital,
  Cpu,
  Zap,
  Waves,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';

const TacticalMap = dynamic(() => import('@/components/surveillance/tactical-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/50 animate-pulse flex items-center justify-center font-orbitron text-zinc-500">INITIALIZING TACTICAL OVERLAY...</div>
});

export default function Home() {
  const { mode, setMode, isAutoMode, setIsAutoMode, incidentStatus, setIncidentStatus } = useTheme();
  const [vitalsStatus, setVitalsStatus] = useState('SCANNING...');
  const [isResetting, setIsResetting] = useState(false);
  const [activeView, setActiveView] = useState<'analytics' | 'pathfinder'>('analytics');
  const [time, setTime] = useState<string>('00:00:00');
  const [modalVideoError, setModalVideoError] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Phase 5: Kiosk Inactivity Loop (45s)
  useInactivity(45000);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mode]);

  // Client-side clock to avoid hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (incidentStatus === 'approved') {
      setVitalsStatus('SCANNING...');
      setActiveView('pathfinder');
      const timer = setTimeout(() => setVitalsStatus('STABLE (95% SpO2)'), 3000);
      return () => clearTimeout(timer);
    } else {
      setVitalsStatus('SCANNING...');
      setActiveView('analytics');
    }
  }, [incidentStatus]);

  const handleApprove = () => {
    setIncidentStatus('approved');
    setMode('alert');
  };

  const handleIgnore = () => {
    setIncidentStatus('ignored');
    setMode('monitoring');
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setMode('monitoring');
      setIncidentStatus('none');
      setIsResetting(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] p-4 flex flex-col gap-4 font-inter text-zinc-100 selection:bg-brand-primary/30 overflow-hidden relative selection:text-white">
      
      {/* GPU Optimization: Backface Visibility & Will-Change */}
      <style jsx global>{`
        .glassmorphism {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .hud-scanline {
          pointer-events: none;
        }
      `}</style>

      {/* Cinematic Reset Fade */}
      <AnimatePresence>
        {isResetting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[300] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Cinematic Alert Flash Overlay */}
      <AnimatePresence>
        {mode === 'alert' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.1, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-brand-red pointer-events-none z-[100]"
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 hud-scanline opacity-[0.05] pointer-events-none z-[60]" />

      {/* Header Bar */}
      <header className="h-16 flex items-center justify-between px-6 glassmorphism rounded-xl border border-white/10 shrink-0 shadow-2xl relative">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={mode === 'alert' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: mode === 'alert' ? Infinity : 0 }}
            className={`w-3 h-3 rounded-full ${mode === 'alert' ? 'bg-brand-red' : 'bg-brand-emerald shadow-[0_0_10px_#2e7d32]'} transition-colors duration-700`} 
          />
          <div className="flex flex-col">
            <h1 className={`text-xl font-orbitron font-bold tracking-tighter transition-colors duration-700 uppercase ${mode === 'alert' ? 'text-brand-red' : 'text-brand-emerald'}`}>
              VISIONX IRAQ // AEOC-BGD
            </h1>
            <span className="text-[8px] font-orbitron text-zinc-500 uppercase tracking-[0.3em]">Neural Traffic Response Unit</span>
          </div>
        </div>

        {/* Tactical Mode Toggle */}
        <div className="flex items-center gap-4 px-5 py-2 rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
          <span className={`text-[9px] font-orbitron font-bold transition-all duration-500 ${!isAutoMode ? 'text-brand-emerald drop-shadow-[0_0_8px_rgba(46,125,50,0.5)]' : 'text-zinc-600'}`}>
            VIGILANCE (NORMAL)
          </span>
          <button 
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`group relative w-12 h-6 rounded-full transition-all duration-700 p-1 border ${isAutoMode ? 'bg-brand-red/10 border-brand-red/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-brand-emerald/10 border-brand-emerald/40 shadow-[0_0_15px_rgba(46,125,50,0.2)]'}`}
          >
            <motion.div 
              layout
              animate={{ 
                x: isAutoMode ? 24 : 0,
                backgroundColor: isAutoMode ? '#ef4444' : '#2e7d32',
                boxShadow: isAutoMode ? '0 0 15px rgba(239,68,68,0.8)' : '0 0 15px rgba(46,125,50,0.8)'
              }}
              className="w-4 h-4 rounded-full"
            />
          </button>
          <span className={`text-[9px] font-orbitron font-bold transition-all duration-500 ${isAutoMode ? 'text-brand-red animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-600'}`}>
            AUTONOMOUS (AI)
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex gap-4 items-center border-r border-white/10 pr-8">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-orbitron text-zinc-500 uppercase">Latency</span>
                <span className="text-xs font-bold font-orbitron text-brand-emerald">14.8ms</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-orbitron text-zinc-500 uppercase">Edge_Node</span>
                <span className="text-xs font-bold font-orbitron text-zinc-400">0x7F2</span>
             </div>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
          >
            <Maximize2 size={18} />
          </button>
          <div className="text-2xl font-orbitron font-bold tracking-widest text-zinc-300 min-w-[120px] text-right">
            {time}
          </div>
        </div>
      </header>

      {/* Main Grid — switches to flex layout in Tactical Mode */}
      <div className={`flex-1 min-h-0 gap-4 ${incidentStatus === 'approved' ? 'flex flex-row' : 'grid grid-cols-12'}`}>
        
        {/* Left Panel: City Intelligence (Hidden in Tactical Mode) */}
        {incidentStatus !== 'approved' && (
          <div className="col-span-3 flex flex-col gap-4">
          <section className="flex-1 glassmorphism rounded-xl p-5 flex flex-col min-h-0 border border-white/5">
            <h2 className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              {activeView === 'analytics' ? (
                <><TrendingUp size={14} className="text-brand-primary" /> City Analytics</>
              ) : (
                <><Navigation size={14} className="text-brand-red" /> Tactical Path Finder</>
              )}
            </h2>
            
            <div className="space-y-4 overflow-y-auto pr-1">
              {activeView === 'pathfinder' && (
                <div className="p-4 bg-brand-red/10 border border-brand-red/30 rounded-xl mb-4 animate-pulse">
                  <div className="text-[10px] font-orbitron text-brand-red font-bold mb-2 uppercase">Dijkstra Routing Active</div>
                  <div className="text-[8px] font-mono text-zinc-400">CRASH_SITE: 33.3152 N, 44.3661 E</div>
                  <div className="text-[8px] font-mono text-zinc-400">TARGET: MEDICAL CITY HOSPITAL</div>
                </div>
              )}
              {/* Al-Jadriya Bridge Stats */}
              <div className="p-3 bg-white/5 rounded border border-white/5 group hover:border-brand-primary/20 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-orbitron text-zinc-400">AL-JADRIYA BRIDGE</span>
                  <span className="text-[10px] font-orbitron text-brand-emerald">HIGH_VOL</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-brand-emerald" />
                </div>
                <div className="mt-1 flex justify-between text-[8px] font-mono text-zinc-600">
                  <span>FLOW: 2.4k/hr</span>
                  <span>CAP: 84%</span>
                </div>
              </div>

              {/* Response Comparison */}
              <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/10">
                <span className="text-[9px] font-orbitron text-zinc-500 block mb-3 uppercase tracking-tighter">Response Comparison (Avg)</span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-orbitron text-zinc-500">
                      <span>MANUAL REPORTING</span>
                      <span>18.0 MIN</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                      <div className="h-full bg-zinc-700 w-full" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-orbitron text-brand-emerald">
                      <span>VISIONX AI</span>
                      <span>4.0 MIN</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '22%' }} 
                        className="h-full bg-brand-emerald shadow-[0_0_8px_#2e7d32]" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Hardware Telemetry (New) */}
              <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5">
                <span className="text-[9px] font-orbitron text-zinc-500 block mb-3 uppercase tracking-widest">Hardware Telemetry</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-zinc-600 font-mono">GPU_UTIL</span>
                    <span className="text-[11px] font-bold font-orbitron text-brand-primary">84%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-zinc-600 font-mono">VRAM_USE</span>
                    <span className="text-[11px] font-bold font-orbitron text-zinc-300">3.2/4GB</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-brand-primary animate-pulse rounded-full" />
                    <span className="text-[8px] font-orbitron text-zinc-400">MODE: CUDA-ACCELERATED</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
               <div className="p-2 bg-white/5 rounded text-center">
                  <Cpu size={12} className="mx-auto mb-1 text-brand-primary opacity-50" />
                  <span className="text-[8px] font-orbitron text-zinc-500 block">NET_LOAD</span>
                  <span className="text-xs font-bold font-orbitron text-zinc-200">68.2%</span>
               </div>
               <div className="p-2 bg-white/5 rounded text-center">
                  <Zap size={12} className="mx-auto mb-1 text-brand-primary opacity-50" />
                  <span className="text-[8px] font-orbitron text-zinc-500 block">TEMP_CORE</span>
                  <span className="text-xs font-bold font-orbitron text-zinc-200">42°C</span>
               </div>
            </div>
          </section>

          <section className="h-40 glassmorphism rounded-xl p-5 flex flex-col border border-white/5 relative overflow-hidden">
             <h2 className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-3">
               <History size={14} className="text-brand-primary" /> Narrative Event Logs
             </h2>
             <div className="flex-1 text-[9px] font-mono space-y-2 opacity-50 overflow-y-auto pr-1">
               <p className="text-brand-emerald">[12:12:01] HEARTBEAT_NOMINAL</p>
               <p>[12:12:05] SYNCING_CAMS_4/4</p>
               <p>[12:12:30] SCAN_MODE: AL-JADRIYA</p>
               <p>[12:12:45] AI_ENGINE: OPTIMIZED</p>
               {mode === 'alert' && (
                 <>
                   <p className="text-brand-red font-bold animate-pulse">[12:13:00] COLLISION_DETECTED_C3</p>
                   <p className="text-brand-red">[12:13:02] DIJKSTRA_INIT: MEDICAL_CITY</p>
                   <p className="text-brand-red">[12:13:05] DISPATCH_UNIT: UNIT_04</p>
                 </>
               )}
               <div ref={logEndRef} />
             </div>
          </section>
        </div>
        )}

        {/* Center Panel: Surveillance Hub / Tactical Map */}
        <div className={`${incidentStatus === 'approved' ? 'flex-1' : 'col-span-6'} flex flex-col gap-4 ${mode === 'alert' ? 'alert-border' : ''}`}>
           <div className="flex-1 glassmorphism rounded-2xl p-2 relative shadow-2xl border border-white/10 group overflow-hidden" style={{ minHeight: incidentStatus === 'approved' ? '100%' : undefined }}>
              <AnimatePresence mode="wait">
                {incidentStatus === 'approved' ? (
                  <motion.div 
                    key="tactical-map"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full" style={{ minHeight: '600px' }}
                  >
                    <TacticalMap />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="camera-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <VideoFeedContainer />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full z-[40]">
                <span className="text-[10px] font-orbitron text-brand-primary font-bold tracking-[0.4em] uppercase">
                  AI INTELLIGENCE MODE: {mode === 'alert' ? 'INTERVENTION' : 'MONITORING'}
                </span>
              </div>
           </div>
        </div>

        {/* Right Panel: Logistics / Tactical Report */}
        <div className={`${incidentStatus === 'approved' ? 'w-[450px] shrink-0' : 'col-span-3'} flex flex-col gap-4 overflow-y-auto`}>

           {/* ── TACTICAL MODE: Full Incident Report ── */}
           {incidentStatus === 'approved' ? (
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex-1 flex flex-col gap-4"
             >
               {/* Incident Summary Card */}
               <section className="glassmorphism rounded-2xl p-8 border-2 border-brand-red/50 bg-brand-red/10 flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-orbitron font-bold text-brand-red tracking-widest uppercase">Tactical_Incident_Summary</span>
                   <span className="text-xs font-mono text-brand-red animate-pulse font-black">● LIVE</span>
                 </div>
                 
                 <div className="text-[1.05rem] font-mono space-y-4">
                   <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-brand-emerald font-bold">SECTOR:</span>
                     <span className="text-brand-red font-black">AL-JADRIYA, BGD</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-brand-emerald font-bold">TYPE:</span>
                     <span className="text-brand-red font-black">HIGH-IMPACT COLLISION</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-brand-emerald font-bold">SEVERITY:</span>
                     <span className="text-brand-red font-black">LEVEL 4 (CRITICAL)</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-brand-emerald font-bold">ETA_SITE:</span>
                     <span className="text-brand-red font-black">3.5 MINUTES</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-3">
                     <span className="text-brand-emerald font-bold">CAMERA:</span>
                     <span className="text-zinc-200 font-bold">CAM_03 // KARRADA INT.</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-brand-emerald font-bold">TIMESTAMP:</span>
                     <span className="text-zinc-200 font-bold">{time}</span>
                   </div>
                 </div>
                 
                 <div className="mt-2 space-y-3">
                   <div className="flex justify-between text-[10px] font-orbitron text-zinc-400 font-bold">
                     <span>DISTANCE_TO_SITE</span>
                     <span className="text-brand-red">4.2 KM</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: '85%' }}
                       transition={{ duration: 1.5, ease: 'easeOut' }}
                       className="h-full bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.8)]" 
                     />
                   </div>
                 </div>
               </section>

               {/* Dispatched Units Card */}
               <section className="glassmorphism rounded-2xl p-6 border border-brand-red/30">
                 <h2 className="text-[10px] font-orbitron text-brand-red uppercase tracking-widest flex items-center gap-2 mb-4 font-bold">
                   <Shield size={14} /> Dispatched Emergency Units
                 </h2>
                 <div className="space-y-3">
                   {[
                     { label: 'UNIT_04_AMBULANCE', icon: Hospital, status: 'EN_ROUTE', eta: '3.5 MIN' },
                     { label: 'UNIT_07_POLICE', icon: Shield, status: 'DISPATCHED', eta: '5.1 MIN' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-brand-red/40 bg-brand-red/5">
                       <div className="flex items-center gap-3">
                          <item.icon size={16} className="text-brand-red" />
                          <div>
                            <span className="text-[10px] font-bold font-orbitron tracking-widest text-brand-red block">{item.label}</span>
                            <span className="text-[8px] font-mono text-zinc-500">{item.status} // ETA: {item.eta}</span>
                          </div>
                       </div>
                       <div className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                     </div>
                   ))}
                 </div>
               </section>

               {/* Reset Button */}
               <button 
                 onClick={handleReset}
                 className="w-full py-5 bg-brand-red/20 hover:bg-brand-red/30 border-2 border-brand-red/50 rounded-xl text-xs font-orbitron font-black text-brand-red uppercase tracking-widest transition-all shadow-lg shadow-brand-red/10"
               >
                 ◼ Close Report & Reset
               </button>
             </motion.div>
           ) : (
             /* ── MONITORING MODE: Normal Widgets ── */
             <>
               <section className="glassmorphism rounded-xl p-5 border border-white/5 relative overflow-hidden">
                 <h2 className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                   <Navigation size={14} className="text-brand-primary" /> Pathfinding Visualization
                 </h2>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-orbitron">Origin</span>
                        <span className="text-[11px] font-bold text-zinc-300 font-orbitron">JADRIYA_07</span>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <span className="text-[8px] text-zinc-500 uppercase font-orbitron">Target</span>
                        <span className={`text-[11px] font-bold transition-colors duration-700 font-orbitron ${mode === 'alert' ? 'text-brand-red' : 'text-zinc-300'}`}>
                          {mode === 'alert' ? 'MED_CITY' : 'WAITING...'}
                        </span>
                      </div>
                    </div>

                    <div className="h-44 bg-black rounded-xl border border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                       <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-5">
                          {Array.from({length: 100}).map((_, i) => <div key={i} className="border-[0.5px] border-white/20" />)}
                       </div>

                       {/* Pathfinding Simulation SVG */}
                       <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 200 100">
                          <AnimatePresence>
                            {mode === 'alert' && (
                              <>
                                <motion.path
                                  d="M 20 20 Q 50 20 80 50"
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="1"
                                  strokeDasharray="2,2"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.5 }}
                                />
                                <motion.path
                                  d="M 80 50 Q 130 50 180 20"
                                  fill="none"
                                  stroke="#ef4444"
                                  strokeWidth="3"
                                  strokeDasharray="4,4"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 2, delay: 1, repeat: Infinity }}
                                />
                              </>
                            )}
                          </AnimatePresence>
                       </svg>
                       
                       <div className="absolute bottom-2 left-2 bg-black/60 p-2 border border-white/5 rounded text-[7px] font-mono leading-tight z-10">
                          ALGORITHM: DIJKSTRA_OPTIMIZED <br />
                          NODES_SAMPLED: {mode === 'alert' ? '1,240' : '---'} <br />
                          ETA: {mode === 'alert' ? '4.2 MIN' : '---'}
                       </div>
                    </div>
                 </div>
               </section>

               <section className="glassmorphism rounded-xl p-5 border border-white/5">
                 <h2 className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                   <Shield size={14} className="text-brand-primary" /> Emergency Units
                 </h2>
                 <div className="space-y-2">
                   {[
                     { label: 'UNIT_04_AMBULANCE', icon: Hospital, status: 'EN_ROUTE' },
                     { label: 'UNIT_07_POLICE', icon: Shield, status: 'DISPATCHED' },
                   ].map((item, idx) => (
                     <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-700 ${
                       mode === 'alert' 
                        ? 'border-brand-red/40 bg-brand-red/5 text-brand-red' 
                        : 'border-white/5 bg-white/5 text-zinc-600'
                     }`}>
                       <div className="flex items-center gap-3">
                          <item.icon size={14} />
                          <span className="text-[10px] font-bold font-orbitron tracking-widest">{item.label}</span>
                       </div>
                       <div className={`w-1.5 h-1.5 rounded-full ${mode === 'alert' ? 'bg-brand-red animate-ping' : 'bg-zinc-800'}`} />
                     </div>
                   ))}
                 </div>
               </section>

               <div className="flex-1 glassmorphism rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 border border-white/5">
                 <div className={`p-5 rounded-full border transition-all duration-1000 ${
                   mode === 'alert' ? 'border-brand-red text-brand-red glow-red shadow-brand-red/20' : 'border-brand-emerald text-brand-emerald glow-emerald shadow-brand-emerald/20'
                 }`}>
                   <Activity size={32} />
                 </div>
                 <div className="mt-4">
                    <p className="text-[9px] font-orbitron text-zinc-500 uppercase tracking-[0.3em]">AI Node Confidence</p>
                    <span className={`text-4xl font-bold font-orbitron transition-colors duration-700 ${mode === 'alert' ? 'text-brand-red' : 'text-zinc-100'}`}>
                      {mode === 'alert' ? '94.2%' : '---'}
                    </span>
                 </div>
               </div>
             </>
           )}
        </div>

      </div>
      {/* Incident Detection Card (Step 1: Detection) */}
      <AnimatePresence>
        {incidentStatus === 'detected' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-zinc-900/50">
                <AlertTriangle size={18} className="text-brand-red animate-pulse" />
                <span className="text-[10px] font-orbitron font-bold tracking-widest text-zinc-300">INCIDENT_DETECTION_CARD // CAM_03</span>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="aspect-video bg-black rounded-xl border border-white/5 overflow-hidden relative">
                   <video 
                     src="/assets/videos/Incident_Alpha_Detection.mp4" 
                     autoPlay muted loop playsInline
                     className="w-full h-full object-cover"
                   >
                     <source src="/assets/videos/Incident_Alpha_Detection.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                   </video>
                   <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-red text-[8px] font-bold rounded font-orbitron">LOOP_EVIDENCE</div>
                </div>

                <div className="space-y-2">
                   <h3 className="text-lg font-orbitron font-bold text-white tracking-tight uppercase">Manual Intervention Required</h3>
                   <p className="text-[10px] text-zinc-500 font-inter leading-relaxed">
                     VisionX AI has detected a high-impact collision at Sector 07. Supervisor verification is required to initiate tactical response protocols.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                   <button 
                     onClick={handleApprove}
                     className="py-3 bg-brand-emerald text-white font-orbitron font-bold text-[9px] rounded-lg tracking-widest uppercase hover:bg-brand-emerald/90 transition-colors"
                   >
                     Approve Intervention
                   </button>
                   <button 
                     onClick={handleIgnore}
                     className="py-3 bg-zinc-800 text-zinc-400 font-orbitron font-bold text-[9px] rounded-lg tracking-widest uppercase hover:bg-zinc-700 transition-colors"
                   >
                     Ignore / False Alarm
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
