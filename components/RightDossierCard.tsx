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
          className="group flex items-center justify-between px-4 py-3 rounded-xl bg-[#12141C]/90 border border-white/[0.08] hover:border-white/30 transition-all duration-200 cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
              HOUSE LINKS
            </span>
            <span className="text-xs font-bold text-white tracking-wider uppercase font-anton group-hover:text-zinc-200 transition-colors">
              PARTNERS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[10px] font-mono text-zinc-300">
              02
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
