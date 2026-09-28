'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SnowEffect from '@/components/SnowEffect';
import MusicPlayer from '@/components/MusicPlayer';
import RightDossierCard from '@/components/RightDossierCard';
import MembersModal from '@/components/MembersModal';

export default function LandingPage() {
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#05070D] text-[#F3F4F6] flex flex-col justify-between overflow-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Background Layers (Grid + Vignette + Radial Glows) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Swyft 171 Tactical Background Grid */}
        <div className="absolute inset-0 tactical-grid opacity-80" />

        {/* Deep Dark Linear Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060912]/80 via-[#04060A]/95 to-[#020306]" />
        
        {/* Soft atmospheric radial glow */}
        <div className="absolute top-12 -left-28 w-[32rem] h-[32rem] bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-28 w-[34rem] h-[34rem] bg-indigo-600/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      {/* TOPBAR (Swyft 171 Glass Shell) */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-5 sm:pt-7">
        <div className="w-full min-h-[62px] px-4 sm:px-6 rounded-2xl bg-[#080D16]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_18px_40px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4">
          {/* Left: Brand with Logo Badge */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <span className="w-8 h-8 rounded-lg border border-sky-400/30 bg-gradient-to-br from-sky-400/20 to-white/[0.02] flex items-center justify-center font-anton text-sm text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:scale-105 transition-transform">
              39
            </span>
            <div className="flex flex-col">
              <span 
                style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                className="text-base sm:text-lg font-anton tracking-wider text-white uppercase leading-tight group-hover:text-zinc-200 transition-colors"
              >
                BANBUNG39
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5">
                BY.MIKE WINTERFELL
              </span>
            </div>
          </Link>

          {/* Right: Nav Links & Swyft Pulse Online Indicator */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <div className="px-4 py-1.5 rounded-xl bg-white/[0.1] border border-white/20 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.06)]">
              HOME
            </div>

            <Link
              href="/members"
              className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] text-xs font-mono tracking-widest uppercase transition-colors"
            >
              MEMBERS
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span>ONLINE</span>
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN HERO CONTENT (Split Left Hero & Right Dossier Card) */}
      <main className="relative z-20 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT COLUMN: HERO TYPOGRAPHY (Swyft 171 Layout) */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-lg">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-400/[0.04] text-[10px] font-mono tracking-[0.18em] text-sky-300 uppercase mb-3">
            <span className="w-4 h-[1px] bg-sky-400" />
            <span>HOUSE OF <b>BANBUNG39</b></span>
          </div>

          {/* Signature Bold Display Title: BANBUNG & 39 with Shimmer */}
          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-anton tracking-wide uppercase leading-[0.88] flex flex-col my-1"
          >
            <span className="text-[#F4F8FF]">
              BANBUNG
            </span>
            <span 
              className="hero-brand-39"
              data-shine-text="39"
            >
              39
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono uppercase tracking-wider max-w-md">
            BANBUNG39 • BY.MIKE WINTERFELL • OFFICIAL HOUSE 2K26
          </p>

          {/* Call to Action Button: OPEN MEMBERS (Swyft 171 Style) */}
          <div className="mt-7 sm:mt-9">
            <Link
              href="/members"
              className="group inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-gradient-to-r from-sky-400/15 to-indigo-600/10 border border-sky-400/30 hover:border-sky-400/60 text-xs font-mono tracking-widest text-sky-100 uppercase transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_25px_rgba(56,189,248,0.08)]"
            >
              <span className="font-semibold tracking-wider">OPEN MEMBERS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING DOSSIER CARD */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <RightDossierCard onOpenPartners={() => setIsMembersOpen(true)} />
        </div>
      </main>

      {/* BOTTOM-LEFT MUSIC PLAYER WIDGET */}
      <MusicPlayer />

      {/* MEMBERS DIRECTORY MODAL */}
      <MembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </div>
  );
}
