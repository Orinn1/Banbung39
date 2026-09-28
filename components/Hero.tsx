'use client';

import React from 'react';
import { Search, ShieldAlert, Users, Radio, Calendar } from 'lucide-react';
import { FAMILY_INFO } from '@/data/members';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalMembers: number;
  activeMembers: number;
}

export default function Hero({
  searchQuery,
  onSearchChange,
  totalMembers,
  activeMembers,
}: HeroProps) {
  return (
    <section className="relative pt-10 pb-8 md:pt-14 md:pb-12 border-b border-white/[0.08] bg-[#0A0C10]">
      {/* Subtle top indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>{FAMILY_INFO.serverName}</span>
          <span className="text-zinc-600">•</span>
          <span>ROSTER DATABASE</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-display text-white uppercase">
          {FAMILY_INFO.name}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm sm:text-base text-zinc-400 font-normal tracking-wide max-w-xl mx-auto">
          Official Family Member Directory
        </p>

        {/* Stats Counter Bar */}
        <div className="mt-8 grid grid-cols-3 max-w-xl mx-auto rounded-lg border border-white/[0.08] bg-[#12141C] divide-x divide-white/[0.08] shadow-sm">
          {/* Members */}
          <div className="py-3.5 px-2 flex flex-col items-center">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Users className="w-3 h-3 text-red-500" />
              MEMBERS
            </span>
            <span className="mt-1 text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {totalMembers || FAMILY_INFO.totalMembersCount}
            </span>
          </div>

          {/* Active */}
          <div className="py-3.5 px-2 flex flex-col items-center">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-500" />
              ACTIVE
            </span>
            <span className="mt-1 text-2xl sm:text-3xl font-bold font-display text-emerald-400 tracking-tight">
              {activeMembers || FAMILY_INFO.activeMembersCount}
            </span>
          </div>

          {/* Founded */}
          <div className="py-3.5 px-2 flex flex-col items-center">
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-zinc-400" />
              FOUNDED
            </span>
            <span className="mt-1 text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {FAMILY_INFO.foundedYear}
            </span>
          </div>
        </div>

        {/* Hero Search Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหาชื่อสมาชิก..."
              className="w-full pl-11 pr-24 py-3 bg-[#131620] border border-white/[0.1] rounded-md text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 px-2 py-1 text-[11px] font-mono text-zinc-400 hover:text-white bg-white/[0.06] rounded border border-white/[0.08]"
              >
                ESC / ล้าง
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-zinc-500 font-mono">
            <span>รองรับ: ชื่อตัวละคร</span>
            <span>•</span>
            <span>Username</span>
            <span>•</span>
            <span>Member ID (#0001)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
