import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999] font-orbitron">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute w-32 h-32 rounded-full border-t-2 border-r-2 border-brand-primary/30 animate-[spin_3s_linear_infinite]" />
          {/* Inner rotating ring */}
          <div className="absolute w-24 h-24 rounded-full border-b-2 border-l-2 border-brand-emerald animate-[spin_2s_linear_infinite_reverse]" />
          
          <Loader2 size={40} className="text-brand-primary animate-spin" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-brand-emerald uppercase animate-pulse">
            System Initializing
          </h1>
          <p className="text-xs text-zinc-500 tracking-widest font-mono uppercase">
            Establishing Secure Uplink...
          </p>
          
          <div className="mt-4 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] blur-[1px]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-zinc-600 font-mono">
        VISIONX OS v1.0.0 // BGD_NODE
      </div>
    </div>
  );
}
