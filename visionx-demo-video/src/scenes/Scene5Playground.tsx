import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img, Sequence } from 'remotion';
import { Upload, Image as ImageIcon, Sliders, Target, Activity, RefreshCw } from 'lucide-react';
import { SceneTransition } from '../components/SceneTransition';
import { AnimatedCursor } from '../components/AnimatedCursor';

const DURATION = 360; // frames 1591–1950

const PRESET_IMAGES = [
  staticFile('10google2-jumbo.png'),
  staticFile('Accident.png'),
  staticFile('Ohio-Driver-Pileup.png'),
  staticFile('ctc-l-waymo-self-driving-taxis-17.png'),
  staticFile('dec_the-best-defense-preparing-to-share-the-road-with-self-driving-cars.png'),
  staticFile('e45fa75fb7b34684937bc84c10496906.png'),
  staticFile('glenmore-tr-crash.png'),
  staticFile('imagessssss.png'),
  staticFile('original.png')
];

// Bounding boxes for the selected test image (real API output normalized 0-1)
const PREDICTIONS = [
  { box: [0.8105, 0.1587, 1.0, 0.3400], label: 'CAR', score: 0.98 },
  { box: [0.7208, 0.0995, 0.8656, 0.2265], label: 'CAR', score: 0.98 },
  { box: [-0.0004, 0.13, 0.06, 0.20], label: 'CAR', score: 0.89 },
  { box: [0.10, 0.12, 0.15, 0.19], label: 'CAR', score: 0.88 },
  { box: [0.14, 0.12, 0.19, 0.19], label: 'CAR', score: 0.87 },
  { box: [0.2361, 0.1367, 0.3275, 0.2445], label: 'CAR', score: 0.97 },
  { box: [0.0616, 0.0847, 0.1081, 0.1630], label: 'CAR', score: 0.97 },
  { box: [0.1844, 0.1265, 0.2453, 0.2250], label: 'CAR', score: 0.97 },
  { box: [0.2348, 0.0343, 0.3027, 0.1154], label: 'CAR', score: 0.96 },
  { box: [0.6746, 0.0206, 0.8078, 0.1518], label: 'CAR', score: 0.94 },
  { box: [0.2074, 0.3939, 0.5386, 0.7920], label: 'ACCIDENT', score: 0.91 },
  { box: [0, 0.0691, 0.0535, 0.1363], label: 'CAR', score: 0.91 },
];

// Cursor path optimized for the exact grid positions
const CURSOR_PATH = [
  { frame: 0, x: 960, y: 700 },
  { frame: 40, x: 880, y: 960 },    // Move to preset thumbnail 2
  { frame: 80, x: 880, y: 960 },    // Click thumbnail 2
  { frame: 120, x: 340, y: 980 },   // Move to "Run AI Inference" button
  { frame: 160, x: 340, y: 980 },   // Click "Run AI Inference"
  { frame: 220, x: 960, y: 500 },   // Move to center to observe results
  { frame: DURATION, x: 960, y: 500 },
];

const CLICK_FRAMES = [80, 160];

export const Scene5Playground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline events based on frame
  const isThumbnailHovered = frame >= 40 && frame < 80;
  const imageSelected = frame >= 80;
  const isButtonHovered = frame >= 120 && frame < 160;
  const inferenceTriggered = frame >= 160;
  const processingComplete = frame >= 220;

  // Final fade to black
  const finalFade = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition totalDuration={DURATION} fadeInDuration={15} fadeOutDuration={0}>
      <AbsoluteFill style={{ backgroundColor: '#0B0F19', opacity: finalFade, padding: '40px' }}>

        <div className="grid grid-cols-12 gap-6 h-full font-inter text-white">

          {/* Left Panel: Controls */}
          <div className="col-span-4 flex flex-col gap-6">

            {/* Upload Card */}
            <section className="glassmorphism rounded-xl p-5 border border-white/5 relative overflow-hidden flex-1 shadow-2xl flex flex-col bg-zinc-900/40">
              <h2 className="text-sm font-orbitron text-brand-primary uppercase tracking-widest flex items-center gap-3 mb-6 font-bold">
                <Upload size={18} /> Data Ingestion
              </h2>

              <div className="border-2 border-dashed border-white/10 bg-black/40 rounded-xl p-6 flex flex-col items-center justify-center text-center h-48 mb-6 relative overflow-hidden">
                <ImageIcon className="w-12 h-12 mb-4 text-zinc-500" />
                <p className="text-sm font-orbitron text-zinc-300 uppercase tracking-widest font-bold">
                  {imageSelected ? '10google2-jumbo.png' : 'Drag & Drop Image Here'}
                </p>
                <p className="text-xs font-mono text-zinc-500 mt-2">
                  or click to browse filesystem
                </p>
                {imageSelected && (
                  <div className="absolute inset-0 bg-brand-primary/10 border-2 border-brand-primary flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-brand-primary font-orbitron font-bold tracking-widest text-lg bg-black/60 px-4 py-2 rounded-lg border border-brand-primary/50">DATA INGESTED</span>
                  </div>
                )}
              </div>

              {/* Slider Component */}
              <div className="bg-zinc-900/50 p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-orbitron text-zinc-400 flex items-center gap-2 uppercase tracking-widest font-bold">
                    <Sliders size={16} /> Confidence Threshold
                  </span>
                  <span className="text-sm font-bold font-orbitron text-brand-primary">50%</span>
                </div>
                <div className="relative pt-2">
                  <div className="w-full h-2 bg-zinc-800 rounded-lg overflow-hidden">
                    <div className="h-full bg-brand-primary w-1/2" />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed pt-2">
                  Filters out predictions below this threshold. Real-time dynamic adjustments are supported post-inference.
                </p>
              </div>
            </section>

            {/* Action Card */}
            <section className="glassmorphism rounded-xl p-4 border border-white/5 shrink-0 bg-zinc-900/40">
              <div
                className={`w-full py-5 flex items-center justify-center gap-3 font-orbitron font-bold text-sm uppercase tracking-[0.2em] rounded-xl transition-all ${!imageSelected
                  ? 'bg-zinc-800 text-zinc-500 border-2 border-zinc-700/50'
                  : inferenceTriggered && !processingComplete
                    ? 'bg-brand-primary/20 text-brand-primary border-2 border-brand-primary/50'
                    : isButtonHovered
                      ? 'bg-brand-primary/90 text-white border-2 border-brand-primary shadow-[0_0_20px_rgba(46,125,50,0.6)] scale-[1.02]'
                      : 'bg-brand-primary text-white border-2 border-brand-primary shadow-[0_0_15px_rgba(46,125,50,0.4)]'
                  }`}
              >
                {inferenceTriggered && !processingComplete ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '2s' }} />
                    Processing Feed...
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    Run AI Inference
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Right Panel: Live Result Display */}
          <div className="col-span-8 flex flex-col gap-6 h-full">
            <section className="flex-1 glassmorphism rounded-xl border border-white/5 relative overflow-hidden flex flex-col shadow-2xl bg-zinc-900/40">
              <div className="p-4 px-6 border-b border-white/5 bg-zinc-900/60 flex justify-between items-center shrink-0">
                <h2 className="text-xs font-orbitron text-zinc-400 flex items-center gap-3 uppercase tracking-widest font-bold">
                  <Activity size={16} className={inferenceTriggered && !processingComplete ? "text-brand-primary animate-pulse" : "text-brand-primary"} />
                  Telemetry Stream // T4 GPU NODE
                </h2>
                {processingComplete && (
                  <span className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/30 rounded text-xs font-orbitron text-brand-primary font-bold tracking-widest shadow-[0_0_10px_rgba(46,125,50,0.3)]">
                    {PREDICTIONS.length} OBJECTS DETECTED
                  </span>
                )}
              </div>

              <div className="flex-1 p-4 relative bg-black/80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

                {!imageSelected ? (
                  <div className="text-center opacity-50 relative z-10">
                    <Target size={64} className="mx-auto mb-6 text-zinc-600" />
                    <span className="text-sm font-orbitron text-zinc-500 uppercase tracking-widest block font-bold">
                      Awaiting Visual Data Input
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="relative flex items-center justify-center" style={{ aspectRatio: '1375 / 717', maxWidth: '100%', maxHeight: '100%' }}>
                      <Img
                        src={PRESET_IMAGES[1]} // Accident.png
                        className="w-full h-full block rounded border border-white/10 shadow-2xl relative z-10"
                        style={{ objectFit: 'contain' }}
                      />

                      {/* Bounding Boxes Container (Overlay exactly on image) */}
                      <div className="absolute inset-0 z-20 pointer-events-none">

                        {/* Loading Spinner */}
                        {inferenceTriggered && !processingComplete && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 backdrop-blur-sm rounded border border-white/10">
                            <RefreshCw size={64} className="text-brand-primary mb-8 opacity-80 animate-spin" style={{ animationDuration: '2s' }} />
                            <span className="text-sm font-orbitron font-bold text-brand-primary tracking-[0.3em] uppercase text-center px-4"
                              style={{ opacity: Math.sin(frame * 0.1) * 0.5 + 0.5 }}>
                              Analyzing vision tokens...
                            </span>
                          </div>
                        )}

                        {/* Bounding Boxes */}
                        {processingComplete && PREDICTIONS.map((pred, idx) => {
                          const boxScale = spring({
                            frame: frame - 220 - (idx * 5),
                            fps,
                            config: { damping: 12, stiffness: 120 }
                          });

                          const left = pred.box[0] * 100;
                          const top = pred.box[1] * 100;
                          const width = (pred.box[2] - pred.box[0]) * 100;
                          const height = (pred.box[3] - pred.box[1]) * 100;

                          const isAccident = pred.label === 'ACCIDENT';
                          const colorClass = isAccident ? 'border-brand-red text-brand-red bg-brand-red' : 'border-brand-primary text-brand-primary bg-brand-primary';
                          const glowClass = isAccident ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(46,125,50,0.5)]';

                          return (
                            <div
                              key={idx}
                              className={`absolute border-2 ${colorClass.split(' ')[0]} ${glowClass} z-40 bg-black/10`}
                              style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${width}%`,
                                height: `${height}%`,
                                transform: `scale(${boxScale})`,
                                opacity: boxScale
                              }}
                            >
                              <div className={`absolute -top-8 left-[-2px] px-3 py-1 ${colorClass.split(' ')[2]} text-black text-xs font-orbitron font-bold whitespace-nowrap`}>
                                {pred.label} {Math.round(pred.score * 100)}%
                              </div>

                              <div className={`absolute top-0 left-0 w-3 h-3 border-t-[3px] border-l-[3px] ${colorClass.split(' ')[0]}`} />
                              <div className={`absolute top-0 right-0 w-3 h-3 border-t-[3px] border-r-[3px] ${colorClass.split(' ')[0]}`} />
                              <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-[3px] border-l-[3px] ${colorClass.split(' ')[0]}`} />
                              <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-[3px] border-r-[3px] ${colorClass.split(' ')[0]}`} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Test Dataset Presets Section */}
            <section className="shrink-0 h-40">
              <div className="glassmorphism p-5 rounded-xl border border-white/5 bg-zinc-900/60 relative overflow-hidden h-full flex flex-col shadow-2xl">
                <h3 className="font-orbitron text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center mb-4 shrink-0">
                  <ImageIcon size={16} className="mr-3 opacity-80" />
                  Quick Test Preset Frames
                </h3>

                <div className="grid grid-cols-9 gap-3 flex-1 min-h-0">
                  {PRESET_IMAGES.map((preset, index) => {
                    const isActive = imageSelected && index === 1; // Accident.png
                    const isHovered = isThumbnailHovered && index === 1;

                    return (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden h-full"
                        style={{
                          border: isActive
                            ? '2px solid #00e676'
                            : isHovered
                              ? '2px solid rgba(0,230,118,0.5)'
                              : '1px solid rgba(255,255,255,0.06)',
                          boxShadow: isActive ? '0 0 20px rgba(0,230,118,0.4)' : 'none',
                          transform: isActive || isHovered ? 'scale(1.05)' : 'scale(1)',
                          zIndex: isActive || isHovered ? 10 : 1,
                          transition: 'all 0.2s ease-out'
                        }}
                      >
                        <Img
                          src={preset}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isActive || isHovered ? 'brightness(1)' : 'brightness(0.5) saturate(0.3)'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>

        <AnimatedCursor path={CURSOR_PATH} clickFrames={CLICK_FRAMES} />
      </AbsoluteFill>
    </SceneTransition>
  );
};
