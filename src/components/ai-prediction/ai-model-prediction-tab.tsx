'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sliders, AlertTriangle, Loader2, Target, CheckCircle2, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Prediction {
  box: [number, number, number, number];
  label: string;
  score: number;
}

const PRESET_IMAGES = [
  '/10google2-jumbo.png',
  '/Accident.png',
  '/Ohio-Driver-Pileup.png',
  '/ctc-l-waymo-self-driving-taxis-17.png',
  '/dec_the-best-defense-preparing-to-share-the-road-with-self-driving-cars.png',
  '/e45fa75fb7b34684937bc84c10496906.png',
  '/glenmore-tr-crash.png',
  '/imagessssss.png',
  '/original.png'
];

export function AIModelPredictionTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Waking up AI model... (Cold start)');
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [payloadSize, setPayloadSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    window.addEventListener('resize', updateOverlayDimensions);
    return () => window.removeEventListener('resize', updateOverlayDimensions);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPredictions([]);
    setPayloadSize({ width: 0, height: 0 });
    setActivePreset(null);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handlePresetSelect = async (presetPath: string) => {
    try {
      setError(null);
      setPredictions([]);
      setPayloadSize({ width: 0, height: 0 });
      setActivePreset(presetPath);
      setPreviewUrl(presetPath);
      
      const response = await fetch(presetPath);
      const blob = await response.blob();
      const file = new File([blob], presetPath.split('/').pop() || 'preset.png', { type: blob.type });
      
      setSelectedFile(file);
    } catch (err) {
      console.error("Failed to load preset:", err);
      setError("Failed to load preset image.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const updateOverlayDimensions = () => {
    if (imgRef.current) {
      setImageSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
      setImgDimensions({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
        left: imgRef.current.offsetLeft,
        top: imgRef.current.offsetTop
      });
    }
  };

  const runPrediction = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setPredictions([]);

    let textTimeout: ReturnType<typeof setTimeout>;

    try {
      setLoadingText('Waking up AI model... (Cold start)');
      textTimeout = setTimeout(() => {
        setLoadingText('Analyzing vision tokens...');
      }, 5000);

      // Client-side Compression & EXIF Preservation
      const base64String = await new Promise<string>(async (resolve, reject) => {
        try {
          const bitmap = await createImageBitmap(selectedFile, { imageOrientation: 'from-image' });
          let width = bitmap.width;
          let height = bitmap.height;
          
          if (width > 1024 || height > 1024) {
             const ratio = 1024 / Math.max(width, height);
             width = Math.round(width * ratio);
             height = Math.round(height * ratio);
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context failed');
          
          ctx.drawImage(bitmap, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          
          // Store the exact resolution sent to the API so coordinates can be mapped accurately
          setPayloadSize({ width, height });
          resolve(dataUrl.split(',')[1]);
        } catch (e) {
          reject(e);
        }
      });

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_base64: base64String
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.predictions && data.predictions.length > 0) {
        // Parse the batched format
        const pred = data.predictions[0];
        const parsedPredictions: Prediction[] = pred.boxes.map((box: number[], index: number) => ({
          box: box as [number, number, number, number],
          label: pred.labels[index],
          score: pred.scores[index]
        }));
        setPredictions(parsedPredictions);
      } else {
        setPredictions([]);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during prediction. The server might be waking up (Cold Start).');
    } finally {
      setIsLoading(false);
      clearTimeout(textTimeout!);
    }
  };

  const filteredPredictions = predictions.filter(p => p.score >= threshold);

  return (
    <div className="grid grid-cols-12 gap-2 h-full">
      {/* Left Panel: Controls */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
        {/* Upload Card */}
        <section className="glassmorphism rounded-lg p-3 border border-white/5 relative overflow-hidden flex-1">
          <h2 className="text-[10px] font-orbitron text-brand-primary uppercase tracking-widest flex items-center gap-2 mb-4">
            <Upload size={14} /> Data Ingestion
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer h-32 mb-2 ${
              isDragging 
                ? 'border-brand-primary bg-brand-primary/10' 
                : 'border-white/10 hover:border-brand-primary/50 bg-black/40 hover:bg-black/60'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <motion.div animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}>
              <ImageIcon className={`w-10 h-10 mb-3 ${isDragging ? 'text-brand-primary' : 'text-zinc-500'}`} />
            </motion.div>
            <p className="text-[11px] font-orbitron text-zinc-300 uppercase tracking-widest">
              {selectedFile ? selectedFile.name : 'Drag & Drop Image Here'}
            </p>
            <p className="text-[9px] font-mono text-zinc-500 mt-1">
              or click to browse filesystem
            </p>
          </div>

          {/* Slider Component matching Stitch MCP standards */}
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-orbitron text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
                <Sliders size={12} /> Confidence Threshold
              </span>
              <span className="text-xs font-bold font-orbitron text-brand-primary">{Math.round(threshold * 100)}%</span>
            </div>
            
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                style={{
                  background: `linear-gradient(to right, #2e7d32 ${threshold * 100}%, #27272a ${threshold * 100}%)`
                }}
              />
            </div>
            <p className="text-[8px] font-mono text-zinc-500 leading-tight">
              Filters out predictions below this threshold. Real-time dynamic adjustments are supported post-inference.
            </p>
          </div>
        </section>

        {/* Action Card */}
        <section className="glassmorphism rounded-lg p-3 border border-white/5 shrink-0">
          <button
            onClick={runPrediction}
            disabled={!selectedFile || isLoading}
            className={`w-full py-3 flex items-center justify-center gap-2 font-orbitron font-bold text-[10px] uppercase tracking-[0.2em] rounded-lg transition-all ${
              !selectedFile 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-2 border-zinc-700/50' 
                : isLoading
                  ? 'bg-brand-primary/20 text-brand-primary border-2 border-brand-primary/50'
                  : 'bg-brand-primary hover:bg-brand-primary/90 text-white border-2 border-brand-primary shadow-[0_0_15px_rgba(46,125,50,0.4)]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Feed...
              </>
            ) : (
              <>
                <Target size={16} />
                Run AI Inference
              </>
            )}
          </button>
        </section>
      </div>

      {/* Right Panel: Live Result Display */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-2 min-h-[450px]">
        <section className="flex-1 glassmorphism rounded-lg border border-white/5 relative overflow-hidden flex flex-col">
          <div className="p-2 px-3 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center shrink-0">
            <h2 className="text-[10px] font-orbitron text-zinc-400 flex items-center gap-2 uppercase tracking-widest">
              <Activity size={14} className={isLoading ? "text-brand-primary animate-pulse" : "text-brand-primary"} /> 
              Telemetry Stream // T4 GPU NODE
            </h2>
            {filteredPredictions.length > 0 && (
              <span className="px-2 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded text-[9px] font-orbitron text-brand-primary font-bold">
                {filteredPredictions.length} OBJECTS DETECTED
              </span>
            )}
          </div>

          <div className="flex-1 p-2 relative bg-black/60 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 hud-scanline opacity-10" />
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute z-20 top-4 left-1/2 -translate-x-1/2 p-4 border border-brand-red/50 bg-brand-red/10 rounded-xl flex items-start gap-3 max-w-md shadow-2xl backdrop-blur-md w-[90%]"
                >
                  <AlertTriangle size={20} className="text-brand-red shrink-0" />
                  <div className="w-full">
                    <span className="text-[10px] font-orbitron font-bold text-brand-red uppercase tracking-widest block mb-1">
                      System Exception
                    </span>
                    <span className="text-[11px] font-mono text-zinc-300 block mb-3">
                      {error}
                    </span>
                    <button onClick={runPrediction} className="px-4 py-2 bg-brand-red/20 hover:bg-brand-red/30 border border-brand-red/50 text-brand-red font-orbitron text-[9px] rounded uppercase font-bold tracking-widest transition-colors w-full text-center cursor-pointer">
                      Manual Retry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!previewUrl ? (
              <div className="text-center opacity-50 relative z-10">
                <Target size={48} className="mx-auto mb-4 text-zinc-600" />
                <span className="text-xs font-orbitron text-zinc-500 uppercase tracking-widest block">
                  Awaiting Visual Data Input
                </span>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  ref={imgRef}
                  src={previewUrl} 
                  alt="Upload preview" 
                  className="max-w-full max-h-[60vh] lg:max-h-[65vh] block rounded border border-white/10 shadow-2xl"
                  style={{ width: 'auto', height: 'auto' }}
                  onLoad={updateOverlayDimensions}
                />
                
                {/* Dynamically Sized Overlay Container */}
                {imgDimensions.width > 0 && (
                  <div 
                    className="absolute z-10 pointer-events-none"
                    style={{
                      width: imgDimensions.width,
                      height: imgDimensions.height,
                      left: imgDimensions.left,
                      top: imgDimensions.top
                    }}
                  >
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 backdrop-blur-sm rounded border border-white/10"
                        >
                          <RefreshCw size={48} className="text-brand-primary animate-spin mb-6 opacity-80 pointer-events-auto" />
                          <span className="text-xs font-orbitron font-bold text-brand-primary tracking-[0.2em] animate-pulse uppercase text-center px-4">
                            {loadingText}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Render Bounding Boxes */}
                    {payloadSize.width > 0 && payloadSize.height > 0 && filteredPredictions.map((pred, idx) => {
                      const [xmin, ymin, xmax, ymax] = pred.box;
                      
                      // Calculate display scale ratio against the API payload dimensions (NOT the natural uncompressed image)
                      const scaleX = imgDimensions.width / payloadSize.width;
                      const scaleY = imgDimensions.height / payloadSize.height;

                      const left = xmin * scaleX;
                      const top = ymin * scaleY;
                      const width = (xmax - xmin) * scaleX;
                      const height = (ymax - ymin) * scaleY;
                      
                      const isAccident = pred.label.toLowerCase() === 'accident';
                      const colorClass = isAccident ? 'border-brand-red text-brand-red bg-brand-red' : 'border-brand-primary text-brand-primary bg-brand-primary';
                      const glowClass = isAccident ? 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_15px_rgba(46,125,50,0.5)]';

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className={`absolute border-2 ${colorClass.split(' ')[0]} ${glowClass} z-10 bg-black/10`}
                          style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`
                          }}
                        >
                          <div className={`absolute -top-7 left-[-2px] px-2 py-1 ${colorClass.split(' ')[2]} text-black text-xs font-orbitron font-bold whitespace-nowrap`}>
                            {pred.label.toUpperCase()} {Math.round(pred.score * 100)}%
                          </div>
                          
                          {/* Corner Accents */}
                          <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colorClass.split(' ')[0]}`} />
                          <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${colorClass.split(' ')[0]}`} />
                          <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${colorClass.split(' ')[0]}`} />
                          <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colorClass.split(' ')[0]}`} />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Quick Test Dataset Presets Section */}
        <section className="col-span-1 lg:col-span-3 mt-1 shrink-0">
          <div className="glassmorphism p-3 rounded-lg border border-white/5 bg-black/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <h3 className="font-orbitron text-[10px] text-brand-primary uppercase tracking-widest flex items-center mb-2">
              <ImageIcon size={14} className="mr-2 opacity-80" />
              Quick Test Preset Frames
            </h3>
            
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
              {PRESET_IMAGES.map((preset, index) => {
                const isActive = activePreset === preset;
                return (
                  <div 
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className={`relative aspect-square rounded overflow-hidden cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? 'border-2 border-brand-primary shadow-[0_0_15px_rgba(46,125,50,0.6)] scale-105 z-10' 
                        : 'border border-white/10 hover:border-brand-primary/50 hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={preset} 
                      alt={`Preset ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
