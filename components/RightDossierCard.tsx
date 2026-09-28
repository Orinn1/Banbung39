'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RightDossierCardProps {
  onOpenPartners?: () => void;
}

export default function RightDossierCard({ onOpenPartners }: RightDossierCardProps) {
  return (
    <div className="w-full max-w-sm sm:w-[380px] bg-[#0C0D12]/95 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-white/[0.18]">
      {/* Top Header Label */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
          BANBUNG39
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Center Official Logo */}
      <div className="py-6 flex flex-col items-center justify-center text-center">
        <div className="w-52 sm:w-60 h-20 sm:h-24 flex items-center justify-center relative">
          <img
            src="/logo.png"
            alt="BB39 By Mike Winterfell"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Middle Interactive Capsule: HOUSE LINKS / PARTNERS */}
      <div className="mt-4">
        <Link
          href="/members"
          className="group flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-xl bg-[#131622]/95 border border-white/[0.12] hover:border-white/30 hover:bg-[#181D2C] transition-all duration-200 cursor-pointer shadow-lg"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-[0.22em] text-zinc-400 uppercase font-medium leading-none mb-1">
              HOUSE LINKS
            </span>
            <span className="text-sm font-mono font-bold tracking-[0.16em] text-white uppercase group-hover:text-zinc-200 transition-colors leading-tight">
              MEMBER
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/20 text-[11px] font-mono font-semibold text-zinc-200">
              02
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
