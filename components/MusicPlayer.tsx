'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Music } from 'lucide-react';

interface MusicInfo {
  title: string;
  artist: string;
  url: string;
}

const STORAGE_KEY_TIME = 'bb39_music_time';
const STORAGE_KEY_PLAYING = 'bb39_music_playing';

// Helper to compare audio URLs ignoring query params and domains
function isSameTrack(urlA: string, urlB: string): boolean {
  if (!urlA || !urlB) return false;
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const pathA = new URL(urlA, origin).pathname;
    const pathB = new URL(urlB, origin).pathname;
    return pathA === pathB;
  } catch {
    return urlA.split('?')[0] === urlB.split('?')[0];
  }
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [musicInfo, setMusicInfo] = useState<MusicInfo>({
    title: 'BANBUNG39',
    artist: 'By.Mike Winterfell',
    url: '/music.mp3',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const hasRestoredTimeRef = useRef<boolean>(false);

  // 1. Load music metadata from API (without disrupting current playback)
  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMusicInfo((prev) => {
            // If the audio URL is basically the same file, keep track title/artist without resetting audio
            return {
              title: data.data.title || prev.title,
              artist: data.data.artist || prev.artist,
              url: data.data.url || prev.url,
            };
          });
        }
      })
      .catch(() => {});
  }, []);

  // 2. Setup Audio Source & Ensure fresh visit always starts at 0:00
  useEffect(() => {
    // Clear any previously saved timestamps so fresh entries always start from 0:00
    try {
      localStorage.removeItem(STORAGE_KEY_TIME);
    } catch {}

    const audio = audioRef.current;
    if (!audio || !musicInfo.url) return;

    // Check if the current audio src is actually a different song
    if (audio.src && isSameTrack(audio.src, musicInfo.url)) {
      // Same song! Do NOT call audio.load() and do NOT reset playback!
      return;
    }

    // Only set and load if it's genuinely a new audio file
    audio.src = musicInfo.url;
    audio.currentTime = 0;
    setProgress(0);
    audio.load();
  }, [musicInfo.url]);

  // 3. Register MediaSession API (Lock screen, background playback, Control Center on iOS & Android)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: musicInfo.title || 'BANBUNG39',
          artist: musicInfo.artist || 'By.Mike Winterfell',
          album: 'BANBUNG39 OFFICIAL',
          artwork: [
            { src: '/Logo.jpg', sizes: '96x96', type: 'image/jpeg' },
            { src: '/Logo.jpg', sizes: '128x128', type: 'image/jpeg' },
            { src: '/Logo.jpg', sizes: '192x192', type: 'image/jpeg' },
            { src: '/Logo.jpg', sizes: '512x512', type: 'image/jpeg' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined && audioRef.current) {
            audioRef.current.currentTime = details.seekTime;
            setProgress(details.seekTime);
          }
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
          handleRestart();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          handleRestart();
        });
      } catch {}
    }
  }, [musicInfo]);

  // 4. Force Autoplay & Listen to First Global Interaction (Single-fire only)
  useEffect(() => {
    const tryPlayAudio = () => {
      // If already started or playing, never re-trigger
      if (hasStartedRef.current) return;
      if (!audioRef.current) return;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            setIsPlaying(true);
            try {
              localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
            } catch {}
            removeListeners();
          })
          .catch(() => {
            // Browser policy blocked unmuted autoplay without user gesture; keep listeners active
          });
      }
    };

    const removeListeners = () => {
      const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'];
      events.forEach((event) => {
        window.removeEventListener(event, tryPlayAudio);
        document.removeEventListener(event, tryPlayAudio);
      });
    };

    // Try immediate autoplay
    tryPlayAudio();

    // Attach global listeners for first touch/click/scroll
    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, tryPlayAudio, { once: true, passive: true });
      document.addEventListener(event, tryPlayAudio, { once: true, passive: true });
    });

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('canplay', tryPlayAudio, { once: true });
    }

    return () => {
      removeListeners();
      if (audio) {
        audio.removeEventListener('canplay', tryPlayAudio);
      }
    };
  }, []);

  // 5. Keep playing in background / lock screen when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const wasPlaying = localStorage.getItem(STORAGE_KEY_PLAYING) === 'true';
        if (wasPlaying && audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY_PLAYING, 'false');
      } catch {}
    } else {
      audioRef.current
        .play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
          try {
            localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
          } catch {}
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  // Format time (mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Handle Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  // Restart / Reset
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    if (!isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
          try {
            localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
          } catch {}
        })
        .catch(() => {});
    }
  };

  return (
    <>
      {/* Real HTML5 Audio Element with background and loop capabilities */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        playsInline
        onPlay={() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
          try {
            localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
          } catch {}
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
      />

      {/* Collapsed Pill Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#0C0D12]/95 backdrop-blur-md border border-white/[0.1] hover:border-white/30 rounded-xl shadow-2xl cursor-pointer group transition-all duration-200 select-none hover:scale-105 active:scale-95"
          title="คลิกเพื่อเปิดเครื่องเล่นเพลง"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <Music className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
          </div>

          <div className="flex flex-col min-w-[68px] sm:min-w-[72px]">
            <span className="text-xs font-mono font-bold text-white tracking-wider leading-none truncate max-w-[100px]">
              {musicInfo.title}
            </span>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white hover:text-black text-zinc-300 flex items-center justify-center transition-all ml-0.5 sm:ml-1 active:scale-90"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
          </button>

          <ChevronUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors ml-0.5" />
        </div>
      )}

      {/* Expanded Player Widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:p-3.5 bg-[#0C0D12]/95 backdrop-blur-md border border-white/[0.1] rounded-2xl shadow-2xl w-[calc(100vw-32px)] sm:w-72 max-w-xs select-none transition-all duration-200">
          <div className="w-full">
            {/* Header with collapse button */}
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
                <h4 className="text-xs font-mono font-bold text-white tracking-wider truncate max-w-[190px]">
                  {musicInfo.title}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono tracking-wide truncate mt-0.5 max-w-[190px]">
                  {musicInfo.artist}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[9px] font-mono text-zinc-500 w-7">
                {formatTime(progress)}
              </span>
              <div
                className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-zinc-500 w-7 text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action Controls */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="text-zinc-500 hover:text-white transition-colors active:scale-90"
                  title="Restart"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-90 shadow-sm"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="text-zinc-500 hover:text-white transition-colors active:scale-90"
                  title="Next"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={toggleMute}
                className="text-zinc-500 hover:text-white transition-colors p-1"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
