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
    <div className="relative min-h-screen w-full bg-[#060709] text-[#F3F4F6] flex flex-col justify-between overflow-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Cinematic Background Image (Back.jpg) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/Back.jpg"
          alt="BANBUNG39 Official Background"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
        />
        {/* Soft atmospheric gradient & vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060709]/45 via-black/25 to-[#060709]/70" />
        <div className="absolute inset-0 cinematic-vignette opacity-80" />
      </div>

      {/* TOP NAVBAR (Clean Original Navbar) */}
      <header className="relative z-30 w-full px-6 sm:px-12 md:px-16 pt-7 sm:pt-9 flex items-center justify-between">
        {/* Left: Brand Name */}
        <Link href="/" className="flex flex-col group cursor-pointer">
          <span className="text-sm sm:text-base font-mono font-bold tracking-[0.25em] text-white uppercase leading-tight group-hover:text-zinc-300 transition-colors">
            BANBUNG39
          </span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
            BY.MIKE WINTERFELL
          </span>
        </Link>

        {/* Right: Navigation Pill Menu */}
        <nav className="flex items-center gap-2.5">
          <div className="px-5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
            HOME
          </div>

          <Link
            href="/members"
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.04] text-xs font-mono tracking-widest uppercase transition-colors"
          >
            MEMBERS
          </Link>
        </nav>
      </header>

      {/* MAIN HERO CONTENT (Split Left Hero & Right Dossier Card) */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT COLUMN: HERO TYPOGRAPHY */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl lg:max-w-2xl">

          {/* Signature Bold Display Title: BANBUNG & 39 on one line */}
          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-anton tracking-wide uppercase leading-none inline-flex items-baseline gap-2.5 sm:gap-3.5 flex-nowrap"
          >
            <span className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              BANBUNG
            </span>
            <span 
              className="hero-brand-39 select-none"
              data-shine-text="39"
            >
              39
            </span>
          </h1>

          {/* Call to Action Button: VIEW MEMBERS */}
          <div className="mt-8 sm:mt-10">
            <Link
              href="/members"
              className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0E1015]/90 backdrop-blur-md border border-white/20 hover:border-white/60 text-xs font-mono tracking-widest text-white uppercase transition-all duration-200 hover:bg-[#151821] hover:shadow-lg hover:shadow-white/[0.06]"
            >
              <span className="font-semibold tracking-wider">VIEW MEMBERS</span>
              <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
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
