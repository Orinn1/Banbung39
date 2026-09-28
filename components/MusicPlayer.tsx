'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(5); // 5 seconds
  const [isMuted, setIsMuted] = useState(false);
  const totalSeconds = 193; // 3:13

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= totalSeconds ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-30 flex items-center gap-3 px-3.5 py-2.5 bg-[#0C0D12]/95 backdrop-blur-md border border-white/[0.1] hover:border-white/30 rounded-xl shadow-2xl cursor-pointer group transition-all duration-200 select-none hover:scale-105"
        title="คลิกเพื่อเปิดเครื่องเล่นเพลง"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
          <Music className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white font-anton leading-tight tracking-wider">
            BANBUNG39
          </span>
          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white hover:text-black text-zinc-300 flex items-center justify-center transition-all ml-1"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>

        <ChevronUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors ml-0.5" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-30 p-3.5 bg-[#0C0D12]/95 backdrop-blur-md border border-white/[0.1] rounded-xl shadow-2xl max-w-xs sm:w-72 select-none transition-all duration-200">
      {/* Track Information & Controls */}
      <div className="w-full">
        {/* Header with toggle to collapse */}
        <div 
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-between mb-0.5 cursor-pointer group"
          title="คลิกเพื่อย่อเครื่องเล่นเพลง"
        >
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 group-hover:text-zinc-300 uppercase flex items-center gap-1.5 transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            NOW PLAYING
          </span>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1 -mr-1 rounded hover:bg-white/[0.08] text-zinc-500 hover:text-zinc-200 transition-colors"
            title="ย่อลง"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide truncate font-anton">
              BANBUNG39
            </h4>
            <p className="text-[10px] text-zinc-400 font-sans truncate -mt-0.5">
              By.Mike Winterfell
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500">
            {formatTime(progress)}
          </span>
          <div
            className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setProgress(Math.floor(ratio * totalSeconds));
            }}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(progress / totalSeconds) * 100}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-zinc-500">
            {formatTime(totalSeconds)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProgress(0)}
              className="text-zinc-500 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-zinc-300 hover:text-white transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setProgress(0)}
              className="text-zinc-500 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-500 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
