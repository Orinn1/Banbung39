'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';
import MusicPlayer from '@/components/MusicPlayer';
import { MEMBERS_DATA, Member, MemberRole } from '@/data/members';

export default function MembersPage() {
  const [selectedRole, setSelectedRole] = useState<'All' | MemberRole>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts by role
  const counts = useMemo(() => {
    return {
      all: MEMBERS_DATA.length,
      founder: MEMBERS_DATA.filter((m) => m.role === 'Founder').length,
      leader: MEMBERS_DATA.filter((m) => m.role === 'Leader').length,
      support: MEMBERS_DATA.filter((m) => m.role === 'Support').length,
      member: MEMBERS_DATA.filter((m) => m.role === 'Member').length,
    };
  }, []);

  // Filtered members based on role and search query
  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((m) => {
      const matchesRole = selectedRole === 'All' || m.role === selectedRole;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        (m.specialty && m.specialty.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, searchQuery]);

  // Group by role for the "All" view
  const founderList = filteredMembers.filter((m) => m.role === 'Founder');
  const leaderList = filteredMembers.filter((m) => m.role === 'Leader');
  const supportList = filteredMembers.filter((m) => m.role === 'Support');
  const regularMemberList = filteredMembers.filter((m) => m.role === 'Member');

  const getRoleBadgeStyle = (role: MemberRole) => {
    switch (role) {
      case 'Founder':
        return 'bg-white/10 text-white border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.12)]';
      case 'Leader':
        return 'bg-zinc-800/90 text-zinc-200 border-white/20';
      case 'Support':
        return 'bg-zinc-900 text-zinc-300 border-white/15';
      case 'Member':
        return 'bg-zinc-900/60 text-zinc-400 border-white/10';
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#060709] text-[#F3F4F6] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Dark Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1117]/80 via-[#08090C]/95 to-[#040507]" />
        
        {/* Soft atmospheric radial glow */}
        <div className="absolute top-1/6 left-1/3 w-[36rem] h-[36rem] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-zinc-800/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      {/* TOP NAVBAR */}
      <header className="relative z-30 w-full px-6 sm:px-12 md:px-16 pt-7 sm:pt-9 flex items-center justify-between">
        {/* Left: Brand Name with Link back home */}
        <Link href="/" className="flex flex-col group cursor-pointer">
          <span 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-lg sm:text-xl font-anton tracking-wider text-white uppercase leading-tight group-hover:text-zinc-300 transition-colors"
          >
            BANBUNG39
          </span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
            BY.MIKE WINTERFELL
          </span>
        </Link>

        {/* Right: Navigation Pill Menu */}
        <nav className="flex items-center gap-2.5">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.04] text-xs font-mono tracking-widest uppercase transition-colors"
          >
            HOME
          </Link>

          <div className="px-5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
            MEMBERS
          </div>
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12">
        {/* Back Button & Top Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/30 text-xs font-mono text-zinc-400 hover:text-white transition-all"
          >
            <span>&larr; BACK TO HOME</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <span>ROSTER • 2K26 OFFICIAL</span>
          </div>
        </div>

        {/* Hero Title Section */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
              BANBUNG39
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              CREW DIRECTORY
            </span>
          </div>

          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-4xl sm:text-6xl md:text-7xl font-anton tracking-wide text-white uppercase leading-[0.95] drop-shadow-md"
          >
            ROSTER & MEMBERS
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono uppercase tracking-wider max-w-xl">
            รายชื่อสมาชิกและทำเนียบผู้บริหาร BANBUNG39 • BY.MIKE WINTERFELL
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 bg-[#0C0D12]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl mb-10 shadow-2xl">
          {/* Role Filter Tabs (No icons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1">
            <button
              onClick={() => setSelectedRole('All')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'All'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>ALL</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'All' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Founder')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Founder'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>FOUNDER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Founder' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.founder}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Leader')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Leader'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>LEADER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Leader' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.leader}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Support')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Support'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>SUPPORT</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Support' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.support}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Member')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Member'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>MEMBER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Member' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.member}
              </span>
            </button>
          </div>

          {/* Search Box (No icons) */}
          <div className="relative min-w-[240px] sm:min-w-[280px] px-2 py-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY NAME OR #ID..."
              className="w-full px-4 py-2 bg-[#12141C] border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 uppercase transition-colors"
            />
          </div>
        </div>

        {/* MEMBERS CONTENT */}
        {filteredMembers.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              [ NO MEMBERS FOUND ]
            </p>
            <button
              onClick={() => {
                setSelectedRole('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-white/[0.06] text-xs font-mono text-white hover:bg-white/15 transition-colors uppercase"
            >
              RESET FILTER
            </button>
          </div>
        ) : selectedRole === 'All' && !searchQuery ? (
          /* SECTIONED VIEW WHEN 'ALL' IS SELECTED */
          <div className="space-y-14">
            {/* 1. FOUNDER SECTION */}
            {founderList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      FOUNDER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      SUPREME LEADERSHIP
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {founderList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {founderList.map((m) => (
                    <FounderCard key={m.id} member={m} getRoleBadgeStyle={getRoleBadgeStyle} />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LEADER SECTION */}
            {leaderList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      LEADER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      COMMAND & TACTICAL OPS
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {leaderList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaderList.map((m) => (
                    <StandardMemberCard key={m.id} member={m} getRoleBadgeStyle={getRoleBadgeStyle} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SUPPORT SECTION */}
            {supportList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      SUPPORT
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      LOGISTICS & COMMUNITY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {supportList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supportList.map((m) => (
                    <StandardMemberCard key={m.id} member={m} getRoleBadgeStyle={getRoleBadgeStyle} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MEMBER SECTION */}
            {regularMemberList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-5 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      MEMBER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      CORE OPERATIVES
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {regularMemberList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularMemberList.map((m) => (
                    <StandardMemberCard key={m.id} member={m} getRoleBadgeStyle={getRoleBadgeStyle} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* UNIFIED GRID VIEW WHEN FILTERED */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m) => (
              <StandardMemberCard key={m.id} member={m} getRoleBadgeStyle={getRoleBadgeStyle} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 w-full px-6 sm:px-12 md:px-16 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div>
          BANBUNG39 • BY.MIKE WINTERFELL • 2K26
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-zinc-400">MEMBERS</span>
        </div>
      </footer>

      {/* PERSISTENT MUSIC PLAYER */}
      <MusicPlayer />
    </div>
  );
}

// Pure Typographic Card for Founder (No icons / no emojis)
function FounderCard({ 
  member, 
  getRoleBadgeStyle 
}: { 
  member: Member; 
  getRoleBadgeStyle: (role: MemberRole) => string;
}) {
  return (
    <div className="relative p-6 sm:p-7 rounded-2xl bg-[#0D0F15]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col justify-between hover:border-white/40 transition-all duration-300">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${getRoleBadgeStyle(member.role)}`}>
            {member.role}
          </span>
          <span className="text-xs font-mono text-zinc-400 font-bold tracking-wider">
            {member.memberId}
          </span>
        </div>

        <span className="text-[10px] font-mono tracking-widest text-zinc-300 border border-white/10 px-2 py-0.5 rounded-full">
          STATUS: {member.status.toUpperCase()}
        </span>
      </div>

      {/* Main Info */}
      <div className="my-2">
        <h3 
          style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
          className="text-2xl sm:text-3xl font-anton tracking-wide text-white uppercase leading-tight"
        >
          {member.name}
        </h3>
        <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase mt-1">
          {member.specialty}
        </p>
      </div>

      {/* Bio / Description */}
      {member.bio && (
        <p className="text-xs text-zinc-300/90 font-mono mt-3 line-clamp-2 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
          {member.bio}
        </p>
      )}

      {/* Meta Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>JOINED: {member.joinedDate}</span>
        {member.discordId && (
          <span className="text-zinc-400">
            DISCORD: @{member.discordId}
          </span>
        )}
      </div>
    </div>
  );
}

// Pure Typographic Card for Leaders, Support, and Members (No icons / no emojis)
function StandardMemberCard({ 
  member, 
  getRoleBadgeStyle 
}: { 
  member: Member; 
  getRoleBadgeStyle: (role: MemberRole) => string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#0C0D12]/90 backdrop-blur-md border border-white/[0.08] hover:border-white/25 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${getRoleBadgeStyle(member.role)}`}>
          {member.role}
        </span>

        <span className="text-xs font-mono text-zinc-400 font-bold">
          {member.memberId}
        </span>
      </div>

      {/* Body Info */}
      <div className="my-2">
        <h3 
          style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
          className="text-xl font-anton tracking-wide text-white uppercase truncate"
        >
          {member.name}
        </h3>
        <p className="text-[11px] font-mono text-zinc-400 uppercase truncate mt-0.5">
          {member.specialty || member.nickname}
        </p>
      </div>

      {/* Bottom Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span className="tracking-wider">
          [{member.status.toUpperCase()}]
        </span>

        {member.discordId && (
          <span className="text-zinc-400">
            @{member.discordId}
          </span>
        )}
      </div>
    </div>
  );
}
