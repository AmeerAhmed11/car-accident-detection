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

export default function Home() {
  const { mode, setMode } = useTheme();
  const [vitalsStatus, setVitalsStatus] = useState('SCANNING...');
  const [isResetting, setIsResetting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Phase 5: Kiosk Inactivity Loop (45s)
  useInactivity(45000);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mode]);

  useEffect(() => {
    if (mode === 'alert') {
      const timer = setTimeout(() => setVitalsStatus('STABLE'), 3000);
      return () => clearTimeout(timer);
    } else {
      setVitalsStatus('SCANNING...');
    }
  }, [mode]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setMode('monitoring');
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
            {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Left Panel: City Intelligence */}
        <div className="col-span-3 flex flex-col gap-4">
          <section className="flex-1 glassmorphism rounded-xl p-5 flex flex-col min-h-0 border border-white/5">
            <h2 className="text-[10px] font-orbitron text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <TrendingUp size={14} className="text-brand-primary" /> City Analytics
            </h2>
            
            <div className="space-y-4 overflow-y-auto pr-1">
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

        {/* Center Panel: Surveillance Hub */}
        <div className="col-span-6 flex flex-col gap-4">
           <div className="flex-1 glassmorphism rounded-2xl p-2 relative shadow-2xl border border-white/10 group overflow-hidden">
              <VideoFeedContainer />
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full z-[40]">
                <span className="text-[10px] font-orbitron text-brand-primary font-bold tracking-[0.4em] uppercase">
                  AI INTELLIGENCE MODE: {mode === 'alert' ? 'INTERVENTION' : 'MONITORING'}
                </span>
              </div>
           </div>
        </div>

        {/* Right Panel: Logistics & Pathfinding */}
        <div className="col-span-3 flex flex-col gap-4">
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
                      {/* Scanning "Nodes" Effect */}
                      <AnimatePresence>
                        {mode === 'alert' && (
                          <>
                            <motion.path
                              d="M 20 80 L 40 70 L 60 85 L 90 70 L 120 75 L 150 50 L 180 20"
                              fill="none"
                              stroke="#2e7d32"
                              strokeWidth="0.5"
                              opacity="0.3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1 }}
                            />
                            <motion.path
                              d="M 20 80 Q 100 80 180 20"
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
        </div>

      </div>

      {/* Cinematic Incident Modal Overlay */}
      <AnimatePresence>
        {mode === 'alert' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-[20px] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-xl glassmorphism p-10 rounded-[2rem] border-2 border-brand-red/50 relative overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.15)]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-red animate-pulse" />
              
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <AlertTriangle size={70} className="text-brand-red" />
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-[-10px] border border-brand-red rounded-full" />
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-orbitron font-bold text-brand-red tracking-tight uppercase">Emergency Intervention</h3>
                  <p className="text-[10px] text-zinc-500 mt-2 font-orbitron uppercase tracking-[0.4em]">Node 03 // JADRIYA_SECTOR_07</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                   <div className="col-span-2 h-44 bg-zinc-900 rounded-2xl border border-brand-red/20 overflow-hidden relative">
                      <video src="/assets/videos/cam03.mp4" autoPlay muted loop className="w-full h-full object-cover opacity-30 grayscale contrast-125" />
                      <div className="absolute top-3 left-3 bg-brand-red text-[8px] font-bold px-2 py-0.5 rounded animate-pulse text-white font-orbitron">EVIDENCE_CLIP</div>
                   </div>

                   <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                      <Waves size={20} className={vitalsStatus === 'STABLE' ? 'text-brand-emerald' : 'text-zinc-500 animate-pulse'} />
                      <span className="text-[9px] text-zinc-500 block mt-2 uppercase font-orbitron">Victim Vitals</span>
                      <span className={`text-sm font-bold font-orbitron mt-1 ${vitalsStatus === 'STABLE' ? 'text-brand-emerald' : 'text-zinc-400'}`}>
                        {vitalsStatus}
                      </span>
                   </div>

                   <div className="glassmorphism p-5 rounded-2xl border border-brand-red/10 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-zinc-500 block mb-1 uppercase font-orbitron">AI Confidence</span>
                      <span className="text-2xl font-bold font-orbitron text-brand-red">94.2%</span>
                   </div>
                </div>

                <div className="w-full space-y-3">
                  <button 
                    onClick={handleReset}
                    className="w-full py-5 bg-brand-red/90 hover:bg-brand-red text-white font-orbitron font-bold text-[10px] rounded-xl transition-all tracking-[0.4em] uppercase shadow-xl shadow-brand-red/10 active:scale-[0.98] border border-white/10"
                  >
                    Confirm Intervention
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full py-4 glassmorphism hover:bg-white/10 text-zinc-400 font-orbitron font-bold text-[9px] rounded-xl transition-all tracking-[0.4em] uppercase border border-white/5"
                  >
                    Ignore & Reset Node
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
