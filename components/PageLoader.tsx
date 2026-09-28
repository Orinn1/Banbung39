'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PageLoader() {
  const router = useRouter();
  const pathname = usePathname();

  // Initial Website Load State
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialProgress, setInitialProgress] = useState(0);
  const [initialStatus, setInitialStatus] = useState('INITIALIZING PROTOCOL...');
  const [initialFadeOut, setInitialFadeOut] = useState(false);

  // Route Navigation Transition State
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);
  const [routeTitle, setRouteTitle] = useState('ACCESSING MEMBER ROSTER');
  const [routeSubtitle, setRouteSubtitle] = useState('SYNCHRONIZING DATABASE...');
  const [routeFadeOut, setRouteFadeOut] = useState(false);

  // Reference to cancel timeouts on unmount
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 1. Initial Page Load Animation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Smooth accelerated progression
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setInitialProgress(100);
        setInitialStatus('SYSTEM READY');

        const t1 = setTimeout(() => {
          setInitialFadeOut(true);
        }, 150);

        const t2 = setTimeout(() => {
          setIsInitialLoading(false);
        }, 750);

        timeoutsRef.current.push(t1, t2);
      } else {
        setInitialProgress(current);
        if (current < 25) {
          setInitialStatus('INITIALIZING PROTOCOL...');
        } else if (current < 55) {
          setInitialStatus('LOADING ASSETS & AUDIO...');
        } else if (current < 85) {
          setInitialStatus('CONNECTING SECURE DATABASE...');
        } else {
          setInitialStatus('VERIFYING CREDENTIALS...');
        }
      }
    }, 45);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // 2. Intercept internal navigation clicks (e.g. to /members or back to /)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find nearest anchor tag
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Only handle internal navigation links
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        target.target === '_blank'
      ) {
        return;
      }

      // If clicking the current active path, don't re-trigger
      const currentPath = window.location.pathname;
      if (href === currentPath) return;

      // Trigger custom route transition for /members and /
      if (href === '/members' || href === '/') {
        e.preventDefault();

        // Configure destination messages
        if (href === '/members') {
          setRouteTitle('ACCESSING MEMBER ROSTER');
          setRouteSubtitle('SYNCHRONIZING TACTICAL DATA • 2K26');
        } else {
          setRouteTitle('RETURNING TO COMMAND');
          setRouteSubtitle('INITIALIZING MAIN TERMINAL • BANBUNG39');
        }

        setRouteLoading(true);
        setRouteFadeOut(false);
        setRouteProgress(15);

        // Animate rapid loading bar
        let prog = 15;
        const navInterval = setInterval(() => {
          prog += 25;
          if (prog >= 100) {
            prog = 100;
            clearInterval(navInterval);
            setRouteProgress(100);

            // Execute client-side router navigation
            router.push(href);
          } else {
            setRouteProgress(prog);
          }
        }, 70);
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [router]);

  // 3. When pathname changes, smoothly fade out the route transition loader
  useEffect(() => {
    if (routeLoading) {
      setRouteProgress(100);
      const t1 = setTimeout(() => {
        setRouteFadeOut(true);
      }, 150);

      const t2 = setTimeout(() => {
        setRouteLoading(false);
      }, 550);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname]);

  return (
    <>
      {/* ============================================================ */}
      {/* 1. INITIAL WEBSITE PRELOADER SCREEN                          */}
      {/* ============================================================ */}
      {isInitialLoading && (
        <div
          className={`fixed inset-0 z-[9999] bg-[#060709] flex flex-col items-center justify-center select-none transition-all duration-700 ease-out ${
            initialFadeOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
          }`}
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute w-[500px] h-[500px] bg-red-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
          
          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Logo Badge */}
            <div className="w-56 sm:w-64 h-24 sm:h-28 flex items-center justify-center mb-6 relative">
              <img
                src="/logo.png"
                alt="BANBUNG39 Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(220,38,38,0.35)] animate-pulse"
              />
            </div>

            {/* Tactical Tagline */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.28em] text-zinc-400 uppercase">
                BANBUNG39 • OFFICIAL HOUSE
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 sm:w-72 h-1.5 bg-white/[0.06] rounded-full p-0.5 border border-white/[0.1] overflow-hidden relative shadow-inner mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#DC2626] via-[#FF4554] to-white rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(239,68,68,0.8)] relative"
                style={{ width: `${initialProgress}%` }}
              >
                {/* Subtle sheen highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-bar" />
              </div>
            </div>

            {/* Status and Percentage Details */}
            <div className="w-64 sm:w-72 flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <span className="truncate max-w-[180px] text-zinc-300 font-medium text-left">
                {initialStatus}
              </span>
              <span className="tabular-nums font-bold text-white text-right">
                {initialProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ROUTE TRANSITION SCREEN (When clicking to view members)  */}
      {/* ============================================================ */}
      {routeLoading && (
        <div
          className={`fixed inset-0 z-[9998] bg-[#060709]/95 backdrop-blur-xl flex flex-col items-center justify-center select-none transition-all duration-300 ease-out ${
            routeFadeOut ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Subtle Ambient Crimson Pulse */}
          <div className="absolute w-[400px] h-[400px] bg-red-600/[0.1] rounded-full blur-[100px] pointer-events-none animate-pulse" />

          {/* Tactical Center Modal */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Compact Glowing Logo / Monogram */}
            <div className="w-40 h-16 flex items-center justify-center mb-5">
              <img
                src="/logo.png"
                alt="BANBUNG39"
                className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]"
              />
            </div>

            {/* Navigation Destination Heading */}
            <h3 className="text-base sm:text-lg font-mono font-bold tracking-[0.2em] text-white uppercase mb-1.5 drop-shadow-md">
              {routeTitle}
            </h3>

            {/* Subtitle */}
            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-5">
              {routeSubtitle}
            </p>

            {/* Rapid High-Tech Progress Bar */}
            <div className="w-56 sm:w-64 h-1.5 bg-white/[0.06] rounded-full p-0.5 border border-white/[0.12] overflow-hidden relative shadow-inner mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-white rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(239,68,68,0.85)]"
                style={{ width: `${routeProgress}%` }}
              />
            </div>

            {/* Connecting status label */}
            <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ENCRYPTED ROUTE • {routeProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
