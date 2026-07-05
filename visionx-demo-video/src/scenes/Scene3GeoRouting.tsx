import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneTransition } from '../components/SceneTransition';
import { TacticalMap } from '../components/TacticalMap';
import { DashboardHeader } from '../components/DashboardHeader';
import { TacticalSidebar } from '../components/TacticalSidebar';

const DURATION = 450; // frames 841–1290

export const Scene3GeoRouting: React.FC = () => {
  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={20} fadeOutDuration={20}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>

        {/* Full Page Layout replacing the static screenshot */}
        <div className="flex flex-col h-full p-4 gap-4 bg-[#0B0F19] text-white font-inter">

          <DashboardHeader />

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-row gap-4">

            {/* Center Panel: Tactical Map */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex-1 glassmorphism rounded-xl p-1 relative shadow-2xl border border-white/10 group overflow-hidden bg-black/20">

                <div className="w-full h-full relative z-0">
                  <TacticalMap animationStartFrame={30} />
                </div>

                {/* Bottom AI Intelligence Mode Badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full z-[50]">
                  <span className="text-xs font-orbitron text-brand-red font-bold tracking-[0.4em] uppercase shadow-black drop-shadow-md">
                    AI INTELLIGENCE MODE: INTERVENTION
                  </span>
                </div>

              </div>
            </div>

            {/* Right Panel: Logistics / Tactical Report */}
            <TacticalSidebar />

          </div>
        </div>

      </AbsoluteFill>
    </SceneTransition>
  );
};
